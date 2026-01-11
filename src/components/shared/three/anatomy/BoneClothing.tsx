/**
 * Bone-attached clothing system for realistic clothing movement with skeleton
 *
 * Clothing is rendered as children of their parent bones, inheriting bone
 * transformations automatically for proper movement during animation.
 * This mirrors the BoneMuscles approach for consistent rendering.
 *
 * @module components/three/BoneClothing
 * @category 3D Components
 * @korean 뼈부착의류시스템
 */

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { getArchetypeClothing } from "../../../../data/archetypeClothing";
import type { ClothingItem } from "../../../../types/clothing";
import type { PlayerArchetype } from "../../../../types/common";

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
  fatMass: number
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
  }
): ClothingAttachment[] => {
  const clothingSet = getArchetypeClothing(archetype);
  const attachments: ClothingAttachment[] = [];

  const bodyThickness = calculateBodyThickness(
    physicalAttributes.muscleMass,
    physicalAttributes.fatMass
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
      physicalAttributes
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
  }
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
        const depth = 0.22 * fitScale * bodyThickness;

        attachments.push({
          geometry: new THREE.BoxGeometry(width, height, depth),
          localOffset: new THREE.Vector3(0, 0, 0.04 * bodyThickness),
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
        const armThickness = 0.08 * fitScale * bodyThickness;
        const upperArmLength = (physicalAttributes.armLength / 100) * 0.45;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            armThickness * 1.1,
            armThickness * 0.95,
            upperArmLength,
            12
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
        const armThickness = 0.08 * fitScale * bodyThickness;
        const forearmLength = (physicalAttributes.armLength / 100) * 0.4;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            armThickness * 0.95,
            armThickness * 0.85,
            forearmLength,
            12
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
        const legThickness = 0.1 * fitScale * bodyThickness;
        const thighLength =
          (physicalAttributes.legLength / 100) * legScale * 0.45;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            legThickness * 1.15,
            legThickness * 0.95,
            thighLength,
            16
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
        const legThickness = 0.1 * fitScale * bodyThickness;
        const shinLength =
          (physicalAttributes.legLength / 100) * legScale * 0.42;
        attachments.push({
          geometry: new THREE.CylinderGeometry(
            legThickness * 0.95,
            legThickness * 0.8,
            shinLength,
            16
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
        const beltDepth = 0.18 * bodyThickness;
        attachments.push({
          geometry: new THREE.BoxGeometry(beltWidth, 0.1, beltDepth),
          localOffset: new THREE.Vector3(0, 0, 0.04 * bodyThickness),
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
        const depth = 0.2 * fitScale * bodyThickness;
        attachments.push({
          geometry: new THREE.BoxGeometry(width, height, depth),
          localOffset: new THREE.Vector3(0, 0, 0.06 * bodyThickness),
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
  // Default physical attributes if not provided
  const attrs = physicalAttributes ?? {
    muscleMass: 35,
    fatMass: 12,
    shoulderWidth: 45,
    torsoLength: 59,
    armLength: 62,
    legLength: 96,
  };

  // Get clothing attachments for this bone
  const attachments = useMemo(
    () => getClothingForBone(boneName, archetype, attrs),
    [boneName, archetype, attrs]
  );

  // Create materials with cleanup
  const materials = useMemo(() => {
    return attachments.map((attachment) => {
      const mat = new THREE.MeshStandardMaterial({
        color: attachment.color,
        emissive: attachment.emissiveColor ?? 0x000000,
        emissiveIntensity: attachment.emissiveIntensity ?? 0,
        metalness: attachment.metalness ?? 0.3,
        roughness: attachment.roughness ?? 0.7,
      });
      return mat;
    });
  }, [attachments]);

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
