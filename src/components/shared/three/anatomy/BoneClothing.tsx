/**
 * Bone-attached clothing system for realistic clothing movement with skeleton
 *
 * **Enhanced Features (v0.6.23+)**:
 * - **Subsurface Scattering**: Realistic fabric translucency with light transmission
 * - **Physical Materials**: Advanced PBR materials with clearcoat and reflectivity
 * - **Body Thickness Scaling**: Accurate clothing sizing based on muscle/fat mass
 * - **Archetype Styling**: Unique clothing sets for all 5 player archetypes
 *
 * Clothing is rendered as children of their parent bones, inheriting bone
 * transformations automatically for proper movement during animation.
 * This mirrors the BoneMuscles approach for consistent rendering.
 *
 * **Visual Quality**:
 * - Transmission: 0.05 (minimal light passing through fabric)
 * - Thickness: 0.2 (thin fabric simulation)
 * - IOR: 1.4 (realistic fabric index of refraction)
 * - Clearcoat: 0.3 (surface depth and sheen)
 * - Double-sided rendering for cloth folding
 *
 * **Performance**:
 * - Geometry disposal on unmount (prevents memory leaks)
 * - Material cleanup system
 * - Optimized attachment calculations with useMemo
 *
 * @module components/three/BoneClothing
 * @category 3D Components
 * @korean 뼈부착의류시스템
 */

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { getArchetypeClothing } from "../../../../data/archetypeClothing";
import type {
  ClothingItem,
  ClothingMaterial,
} from "../../../../types/clothing";
import type { PlayerArchetype } from "../../../../types/common";
import {
  FABRIC_PRESETS,
  generateFabricTextureSet,
  type FabricTextureSet,
} from "../../../../utils/fabricTextures";

/**
 * Clothing attachment configuration for a bone
 *
 * Defines how clothing is positioned relative to its parent bone.
 * Position is in local bone space, so clothing moves with the bone.
 *
 * @korean 의류부착설정
 */
export interface ClothingAttachment {
  /** Geometry for this clothing piece */
  readonly geometry: THREE.BufferGeometry;
  /** Local position offset from bone origin */
  readonly localOffset: THREE.Vector3;
  /** Local rotation relative to bone */
  readonly localRotation: THREE.Euler;
  /** Color of the clothing */
  readonly color: number;
  /** Emissive color for glow effects */
  readonly emissiveColor?: number;
  /** Emissive intensity */
  readonly emissiveIntensity?: number;
  /** Metalness for material */
  readonly metalness?: number;
  /** Roughness for material */
  readonly roughness?: number;
  /** Clothing item ID */
  readonly itemId: string;
}

/**
 * Props for BoneClothing component
 */
export interface BoneClothingProps {
  /** Name of the bone this clothing attaches to */
  readonly boneName: string;
  /** Player archetype for clothing style */
  readonly archetype: PlayerArchetype;
  /** Physical attributes for sizing */
  readonly physicalAttributes?: {
    readonly muscleMass: number;
    readonly fatMass: number;
    readonly shoulderWidth: number;
    readonly torsoLength: number;
    readonly armLength: number;
    readonly legLength: number;
  };
}

/**
 * Calculate body thickness multiplier based on muscle mass and fat mass
 */
const calculateBodyThickness = (
  muscleMass: number,
  fatMass: number,
): number => {
  const referenceMuscle = 35;
  const referenceFat = 12;
  const muscleRatio = muscleMass / referenceMuscle;
  const muscleContribution = Math.sqrt(muscleRatio) * 0.7;
  const fatRatio = fatMass / referenceFat;
  const fatContribution = Math.sqrt(fatRatio) * 0.3;
  return muscleContribution + fatContribution;
};

/**
 * Get fabric preset based on clothing material type
 */
const getFabricPreset = (
  material: ClothingMaterial,
): keyof typeof FABRIC_PRESETS => {
  switch (material) {
    case "fabric":
      return "dobok";
    case "tactical":
    case "synthetic":
      return "tactical";
    case "leather":
    case "armored":
      return "leather";
    case "cybernetic":
      return "silk"; // Shiny synthetic look
    default:
      return "dobok";
  }
};

/**
 * Convert number color to hex string
 */
const numberToHex = (color: number): string => {
  return `#${color.toString(16).padStart(6, "0")}`;
};

/**
 * Get clothing attachments for a specific bone
 */
const getClothingForBone = (
  boneName: string,
  archetype: PlayerArchetype,
  physicalAttributes: {
    muscleMass: number;
    fatMass: number;
    shoulderWidth: number;
    torsoLength: number;
    armLength: number;
    legLength: number;
  },
): ClothingAttachment[] => {
  const clothingSet = getArchetypeClothing(archetype);
  const attachments: ClothingAttachment[] = [];

  const bodyThickness = calculateBodyThickness(
    physicalAttributes.muscleMass,
    physicalAttributes.fatMass,
  );

  // Scaling factors
  const torsoScale = physicalAttributes.torsoLength / 59;
  const legScale = physicalAttributes.legLength / 96;

  for (const item of clothingSet.items) {
    const attachmentsForItem = getAttachmentsForItem(
      item,
      boneName,
      bodyThickness,
      torsoScale,
      legScale,
      physicalAttributes,
    );
    attachments.push(...attachmentsForItem);
  }

  return attachments;
};

/**
 * Generate clothing attachments for a specific item on a bone
 */
const getAttachmentsForItem = (
  item: ClothingItem,
  boneName: string,
  bodyThickness: number,
  torsoScale: number,
  legScale: number,
  physicalAttributes: {
    shoulderWidth: number;
    armLength: number;
    legLength: number;
  },
): ClothingAttachment[] => {
  const fitScaleMap: Record<string, number> = {
    tight: 1.08,
    fitted: 1.15,
    loose: 1.25,
    oversized: 1.4,
  };
  const fitScale = fitScaleMap[item.fit] ?? 1.15;
  const attachments: ClothingAttachment[] = [];

  switch (item.type) {
    case "torso":
      // Main torso on spine_middle
      if (boneName === "spine_middle") {
        const width =
          (physicalAttributes.shoulderWidth / 100) * fitScale * bodyThickness;
        const height = (59 / 100) * torsoScale * 1.2; // Using base torsoLength
        const depth = 0.08 * fitScale * bodyThickness; // Thin clothing layer

        // Clothing offset = body radius + clothing half-depth (places clothing OUTSIDE body)
        const bodyRadius = 0.12 * bodyThickness; // Approximate body depth at chest
        const clothingOffset = bodyRadius + depth * 0.5;
        attachments.push({
          geometry: new THREE.BoxGeometry(width, height, depth),
          localOffset: new THREE.Vector3(0, 0, clothingOffset),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: item.id,
        });
      }

      // Sleeves
      if (boneName === "upper_arm_L" || boneName === "upper_arm_R") {
        // Body muscle radius at upper arm: ~0.05 (slim athletic arm)
        // Clothing must be OUTSIDE, so use larger radius
        const muscleRadius = 0.05 * bodyThickness; // Slim bicep radius
        const clothingThickness = 0.015 * fitScale; // Thin fabric layer
        const clothingRadius = muscleRadius + clothingThickness;
        const upperArmLength = (physicalAttributes.armLength / 100) * 0.45;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            clothingRadius * 1.05, // Slightly larger at top
            clothingRadius * 0.95, // Tapers slightly
            upperArmLength,
            12,
          ),
          localOffset: new THREE.Vector3(0, -upperArmLength * 0.4, 0),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: `${item.id}-sleeve-upper-${boneName}`,
        });
      }

      if (boneName === "forearm_L" || boneName === "forearm_R") {
        // Body muscle radius at forearm: ~0.035 (slim forearm)
        // Clothing must be OUTSIDE, so use larger radius
        const muscleRadius = 0.035 * bodyThickness; // Slim forearm radius
        const clothingThickness = 0.012 * fitScale; // Thin fabric layer
        const clothingRadius = muscleRadius + clothingThickness;
        const forearmLength = (physicalAttributes.armLength / 100) * 0.4;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            clothingRadius * 0.98, // Slightly smaller at top
            clothingRadius * 0.85, // Tapers toward wrist
            forearmLength,
            12,
          ),
          localOffset: new THREE.Vector3(0, -forearmLength * 0.4, 0),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: `${item.id}-sleeve-forearm-${boneName}`,
        });
      }
      break;

    case "pants":
      // Thigh segments
      if (boneName === "thigh_L" || boneName === "thigh_R") {
        // Body muscle radius at thigh: ~0.07 (slim athletic thigh)
        // Clothing must be OUTSIDE, so use larger radius
        const muscleRadius = 0.07 * bodyThickness; // Slim quad radius
        const clothingThickness = 0.02 * fitScale; // Fabric thickness
        const clothingRadius = muscleRadius + clothingThickness;
        const thighLength =
          (physicalAttributes.legLength / 100) * legScale * 0.45;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            clothingRadius * 1.08, // Larger at hip
            clothingRadius * 0.92, // Tapers toward knee
            thighLength,
            16,
          ),
          localOffset: new THREE.Vector3(0, -thighLength * 0.4, 0),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: `${item.id}-thigh-${boneName}`,
        });
      }

      // Shin segments
      if (boneName === "shin_L" || boneName === "shin_R") {
        // Body muscle radius at shin: ~0.04 (slim calf)
        // Clothing must be OUTSIDE, so use larger radius
        const muscleRadius = 0.04 * bodyThickness; // Slim calf radius
        const clothingThickness = 0.015 * fitScale; // Fabric thickness
        const clothingRadius = muscleRadius + clothingThickness;
        const shinLength =
          (physicalAttributes.legLength / 100) * legScale * 0.42;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            clothingRadius * 0.95, // Larger at knee
            clothingRadius * 0.75, // Tapers toward ankle
            shinLength,
            16,
          ),
          localOffset: new THREE.Vector3(0, -shinLength * 0.4, 0),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: `${item.id}-shin-${boneName}`,
        });
      }
      break;

    case "belt":
      if (boneName === "pelvis") {
        const beltWidth =
          (physicalAttributes.shoulderWidth / 100) * 0.85 * bodyThickness;
        const beltDepth = 0.04 * bodyThickness; // Thin belt

        // Belt offset = body radius + belt half-depth (places belt OUTSIDE waist)
        const waistRadius = 0.1 * bodyThickness;
        const beltOffset = waistRadius + beltDepth * 0.5;
        attachments.push({
          geometry: new THREE.BoxGeometry(beltWidth, 0.06, beltDepth),
          localOffset: new THREE.Vector3(0, 0, beltOffset),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: item.id,
        });
      }
      break;

    case "vest":
      if (boneName === "spine_middle") {
        const width =
          (physicalAttributes.shoulderWidth / 100) *
          0.95 *
          fitScale *
          bodyThickness;
        const height = (59 / 100) * 0.75 * torsoScale;
        const depth = 0.06 * fitScale * bodyThickness; // Thin vest layer

        // Vest offset = body radius + vest half-depth (places vest OUTSIDE body)
        const bodyRadius = 0.13 * bodyThickness; // Slightly larger for layered look
        const vestOffset = bodyRadius + depth * 0.5;
        attachments.push({
          geometry: new THREE.BoxGeometry(width, height, depth),
          localOffset: new THREE.Vector3(0, 0, vestOffset),
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: item.id,
        });
      }
      break;
  }

  return attachments;
};

/**
 * BoneClothing Component
 *
 * Renders clothing attached to a specific bone.
 * Clothing inherits bone transformations automatically through the scene graph.
 *
 * @korean 뼈부착의류
 */
export const BoneClothing: React.FC<BoneClothingProps> = ({
  boneName,
  archetype,
  physicalAttributes,
}) => {
  // Default physical attributes if not provided - memoized to prevent new object on every render
  const attrs = useMemo(
    () =>
      physicalAttributes ?? {
        muscleMass: 35,
        fatMass: 12,
        shoulderWidth: 45,
        torsoLength: 59,
        armLength: 62,
        legLength: 96,
      },
    [physicalAttributes],
  );

  // Get clothing attachments for this bone
  const attachments = useMemo(
    () => getClothingForBone(boneName, archetype, attrs),
    [boneName, archetype, attrs],
  );

  // Get clothing set for fabric texture generation
  const clothingSet = useMemo(
    () => getArchetypeClothing(archetype),
    [archetype],
  );

  /**
   * Generate fabric textures for realistic dobok (도복) rendering
   *
   * Creates procedural weave patterns, normal maps, and roughness maps
   * for enhanced cloth realism without external image assets.
   *
   * @korean 직물텍스처생성
   */
  const fabricTextures = useMemo(() => {
    // Generate textures for each unique clothing item
    const textureMap = new Map<string, FabricTextureSet>();

    for (const item of clothingSet.items) {
      if (!textureMap.has(item.material)) {
        const preset = getFabricPreset(item.material);
        const colorHex = numberToHex(item.colorPrimary);
        textureMap.set(
          item.material,
          generateFabricTextureSet(colorHex, preset),
        );
      }
    }

    return textureMap;
  }, [clothingSet]);

  // Cleanup fabric textures on unmount
  useEffect(() => {
    return () => {
      fabricTextures.forEach((textureSet) => textureSet.dispose());
    };
  }, [fabricTextures]);

  /**
   * Create materials with advanced physical properties for realistic cloth rendering
   *
   * Enhanced with:
   * - **Fabric textures**: Procedural weave patterns for dobok authenticity
   * - **Normal maps**: Surface detail for thread texture visibility
   * - **Roughness maps**: Realistic light scattering on fabric surface
   * - Subsurface scattering: Light transmission through fabric for realism
   * - Clearcoat: Surface depth and sheen for material quality
   * - Double-sided rendering: Proper display when cloth folds
   * - Physical properties: IOR, reflectivity for authentic appearance
   *
   * @korean 향상된물리재료생성
   */
  const materials = useMemo(() => {
    return attachments.map((attachment) => {
      // Find the clothing item for this attachment to get its material type
      const clothingItem = clothingSet.items.find((item) =>
        attachment.itemId.startsWith(item.id),
      );
      const materialType = clothingItem?.material ?? "fabric";
      const textureSet = fabricTextures.get(materialType);

      // Create normal scale safely (Vector2 may not be available in test environments)
      let normalScale: THREE.Vector2 | undefined;
      try {
        normalScale = new THREE.Vector2(0.3, 0.3);
      } catch {
        normalScale = undefined;
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: attachment.color,
        // Apply fabric texture maps for realistic dobok appearance
        map: textureSet?.colorMap ?? null,
        normalMap: textureSet?.normalMap ?? null,
        normalScale, // Subtle normal effect
        roughnessMap: textureSet?.roughnessMap ?? null,
        emissive: attachment.emissiveColor ?? 0x000000,
        emissiveIntensity: attachment.emissiveIntensity ?? 0,
        metalness: attachment.metalness ?? 0.1, // Lower metalness for fabric
        roughness: attachment.roughness ?? 0.8, // Higher roughness for cloth
        // Enhanced cloth realism with clearcoat for depth
        clearcoat: 0.2,
        clearcoatRoughness: 0.6,
        // Subsurface scattering for realistic fabric translucency
        // Subtle effect for cloth materials (not skin)
        transmission: 0.03, // Minimal light transmission through fabric
        thickness: 0.15, // Thin fabric thickness
        ior: 1.4, // Index of refraction for fabric (lower than glass)
        // Enable proper reflections
        reflectivity: 0.2,
        // Double-sided rendering for cloth that may fold
        side: THREE.DoubleSide,
        // Improved shading for folds
        flatShading: false,
      });
      return mat;
    });
  }, [attachments, clothingSet, fabricTextures]);

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      materials.forEach((mat) => mat.dispose());
    };
  }, [materials]);

  // Cleanup geometries on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        attachment.geometry.dispose();
      });
    };
  }, [attachments]);

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      {attachments.map((attachment, index) => (
        <mesh
          key={attachment.itemId}
          geometry={attachment.geometry}
          material={materials[index]}
          position={attachment.localOffset.toArray()}
          rotation={[
            attachment.localRotation.x,
            attachment.localRotation.y,
            attachment.localRotation.z,
          ]}
          castShadow
          receiveShadow
          name={`clothing-${attachment.itemId}`}
        />
      ))}
    </>
  );
};

export default BoneClothing;
