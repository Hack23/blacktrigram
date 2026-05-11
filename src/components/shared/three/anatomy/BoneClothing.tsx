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
import {
  BICEP_RADIUS,
  CALF_RADIUS,
  CLOTHING_THICKNESS_FITTED,
  CORE_RADIUS,
  FOREARM_RADIUS,
  PECTORALS_RADIUS,
  QUAD_RADIUS,
  calculateClothingRadius,
} from "../../../../constants/bodyDimensions";
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
 *
 * Uses linear scaling with reasonable limits to prevent "michelin man" effect.
 * This matches the BodySurface calculation for consistency.
 *
 * @param muscleMass - Muscle mass in kg
 * @param fatMass - Fat mass in kg
 * @returns Body thickness multiplier (0.75 - 1.20)
 */
const calculateBodyThickness = (
  muscleMass: number,
  fatMass: number,
): number => {
  const referenceMuscle = 35; // Reference: athletic build
  const referenceFat = 12; // Reference: low body fat

  const muscleRatio = muscleMass / referenceMuscle;
  const fatRatio = fatMass / referenceFat;

  const muscleContribution = (muscleRatio - 1.0) * 0.15;
  const fatContribution = (fatRatio - 1.0) * 0.2;

  return Math.max(
    0.75,
    Math.min(1.2, 0.85 + muscleContribution + fatContribution),
  );
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
      if (boneName === "spine_middle") {
        const height = (59 / 100) * torsoScale * 1.2; // Using base torsoLength
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale;
        const torsoRadius =
          ((physicalAttributes.shoulderWidth / 100) * 0.5 * bodyThickness +
            PECTORALS_RADIUS * bodyThickness) *
          0.5;
        const clothingRadius = calculateClothingRadius(
          torsoRadius,
          1.0, // bodyThickness already applied above
          clothingThickness,
        );
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            clothingRadius * 0.95, // Slightly narrower at top (chest taper)
            clothingRadius * 1.05, // Slightly wider at bottom (waist)
            height,
            16, // Smooth cylinder
          ),
          localOffset: new THREE.Vector3(0, 0, 0), // Centered on bone
          localRotation: new THREE.Euler(0, 0, 0),
          color: item.colorPrimary,
          emissiveColor: item.colorEmissive,
          emissiveIntensity: item.emissiveIntensity,
          metalness: item.metalness,
          roughness: item.roughness,
          itemId: item.id,
        });
      }

      if (boneName === "upper_arm_L" || boneName === "upper_arm_R") {
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale;
        const clothingRadius = calculateClothingRadius(
          BICEP_RADIUS,
          bodyThickness,
          clothingThickness,
        );
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
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale * 0.8;
        const clothingRadius = calculateClothingRadius(
          FOREARM_RADIUS,
          bodyThickness,
          clothingThickness,
        );
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
      if (boneName === "thigh_L" || boneName === "thigh_R") {
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale * 1.3;
        const clothingRadius = calculateClothingRadius(
          QUAD_RADIUS,
          bodyThickness,
          clothingThickness,
        );
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

      if (boneName === "shin_L" || boneName === "shin_R") {
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale;
        const clothingRadius = calculateClothingRadius(
          CALF_RADIUS,
          bodyThickness,
          clothingThickness,
        );
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
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale;
        const waistRadius = CORE_RADIUS * bodyThickness;
        const beltRadius = calculateClothingRadius(
          waistRadius,
          1.0, // bodyThickness already applied
          clothingThickness + 0.005, // Extra so belt sits outside clothing
        );
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            beltRadius,
            beltRadius,
            0.06, // Belt height
            16, // Smooth cylinder
          ),
          localOffset: new THREE.Vector3(0, 0, 0), // Centered on bone
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
        const height = (59 / 100) * 0.75 * torsoScale;
        const clothingThickness = CLOTHING_THICKNESS_FITTED * fitScale;
        const torsoRadius =
          ((physicalAttributes.shoulderWidth / 100) * 0.5 * bodyThickness +
            (PECTORALS_RADIUS + 0.01) * bodyThickness) *
          0.5;
        const vestRadius = calculateClothingRadius(
          torsoRadius,
          1.0, // bodyThickness already applied
          clothingThickness + 0.008, // Extra gap for layering over shirt
        );
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            vestRadius * 0.97, // Slightly narrower at top
            vestRadius * 1.03, // Slightly wider at bottom
            height,
            16, // Smooth cylinder
          ),
          localOffset: new THREE.Vector3(0, 0, 0), // Centered on bone
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

  const attachments = useMemo(
    () => getClothingForBone(boneName, archetype, attrs),
    [boneName, archetype, attrs],
  );

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
      const clothingItem = clothingSet.items.find((item) =>
        attachment.itemId.startsWith(item.id),
      );
      const materialType = clothingItem?.material ?? "fabric";
      const textureSet = fabricTextures.get(materialType);

      let normalScale: THREE.Vector2 | undefined;
      try {
        normalScale = new THREE.Vector2(0.3, 0.3);
      } catch {
        normalScale = undefined;
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: attachment.color,
        map: textureSet?.colorMap ?? null,
        normalMap: textureSet?.normalMap ?? null,
        normalScale, // Subtle normal effect
        roughnessMap: textureSet?.roughnessMap ?? null,
        emissive: attachment.emissiveColor ?? 0x000000,
        emissiveIntensity: attachment.emissiveIntensity ?? 0,
        metalness: attachment.metalness ?? 0.1, // Lower metalness for fabric
        roughness: attachment.roughness ?? 0.8, // Higher roughness for cloth
        clearcoat: 0.2,
        clearcoatRoughness: 0.6,
        transmission: 0.03, // Minimal light transmission through fabric
        thickness: 0.15, // Thin fabric thickness
        ior: 1.4, // Index of refraction for fabric (lower than glass)
        reflectivity: 0.2,
        side: THREE.DoubleSide,
        flatShading: false,
      });
      return mat;
    });
  }, [attachments, clothingSet, fabricTextures]);

  useEffect(() => {
    return () => {
      materials.forEach((mat) => mat.dispose());
    };
  }, [materials]);

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
