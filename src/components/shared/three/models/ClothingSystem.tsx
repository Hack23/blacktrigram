/**
 * ClothingSystem component for rendering fighter clothing
 *
 * **Korean**: 의류 시스템 컴포넌트 (Clothing System Component)
 *
 * Renders archetype-specific clothing that follows skeletal bone movements.
 * Clothing is attached to bones and updates position/rotation each frame.
 *
 * @module components/three/ClothingSystem
 * @category 3D Components
 * @korean 의류시스템컴포넌트
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getArchetypeClothing } from "../../../../data/archetypeClothing";
import {
    getBoneWorldPosition,
    getBoneWorldRotation,
} from "../../../../systems/animation/SkeletonRig";
import type {
    ClothingItem,
    ClothingSystemProps,
} from "../../../../types/clothing";
import type { PhysicalAttributes } from "../../../../types/common";
import type { Bone } from "../../../../types/skeletal";

/**
 * Get primary bone for a clothing item based on its type
 */
const getPrimaryBone = (itemType: string): string => {
  switch (itemType) {
    case "torso":
    case "vest":
      return "spine_middle";
    case "pants":
      return "pelvis";
    case "belt":
      return "pelvis";
    case "boots":
      return "foot_L";
    case "gloves":
      return "hand_L";
    case "headgear":
      return "head";
    default:
      return "pelvis";
  }
};

/**
 * Calculate body thickness multiplier based on muscle mass and fat mass
 * Similar to BoneRenderer's calculation for consistency
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
 * A single limb segment clothing piece that follows one bone
 */
interface LimbSegmentProps {
  readonly boneName: string;
  readonly boneMap: Map<string, Bone>;
  readonly geometry: THREE.BufferGeometry;
  readonly material: THREE.Material;
  readonly offset: THREE.Vector3;
  readonly castShadow: boolean;
  readonly receiveShadow: boolean;
  readonly scale: number;
  readonly itemId: string;
}

const LimbSegment: React.FC<LimbSegmentProps> = ({
  boneName,
  boneMap,
  geometry,
  material,
  offset,
  castShadow,
  receiveShadow,
  scale,
  itemId,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const tempOffset = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const bone = boneMap.get(boneName);
    if (meshRef.current && bone) {
      const worldPos = getBoneWorldPosition(bone);
      const worldRot = getBoneWorldRotation(bone);
      tempOffset.copy(offset);
      meshRef.current.position.copy(worldPos).add(tempOffset);
      meshRef.current.rotation.copy(worldRot);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      name={`clothing-${itemId}-${boneName}`}
      scale={scale}
    />
  );
};

/**
 * Props for BoneAttachedClothing component
 */
interface BoneAttachedClothingProps {
  readonly item: ClothingItem;
  readonly boneMap: Map<string, Bone>;
  readonly physicalAttributes: PhysicalAttributes;
  readonly scale: number;
}

/**
 * Clothing item that follows bone movement
 */
const BoneAttachedClothing: React.FC<BoneAttachedClothingProps> = ({
  item,
  boneMap,
  physicalAttributes,
  scale,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftMeshRef = useRef<THREE.Mesh>(null);
  const rightMeshRef = useRef<THREE.Mesh>(null);

  const {
    type: itemType,
    fit: itemFit,
    colorPrimary,
    colorEmissive,
    emissiveIntensity,
    metalness,
    roughness,
    castShadow,
    receiveShadow,
    id: itemId,
  } = item;

  // Calculate geometry based on clothing type
  const clothingConfig = useMemo(() => {
    const torsoScale = physicalAttributes.torsoLength / 59;
    const legScale = physicalAttributes.legLength / 96;

    // Calculate body thickness based on muscle and fat (matches BoneRenderer)
    const bodyThickness = calculateBodyThickness(
      physicalAttributes.muscleMass,
      physicalAttributes.fatMass
    );

    // Base thickness for clothing to sit outside body
    // Body uses bone.length * 0.1 * bodyThickness for radius
    // Average bone length ~0.3-0.5, so body radius ~0.03-0.05 * bodyThickness
    // Clothing needs to be ~1.3-1.5x body size to sit outside
    const clothingBuffer = 0.04 * bodyThickness; // Extra radius to sit outside body

    const fitScaleMap: Record<string, number> = {
      tight: 1.08,
      fitted: 1.15,
      loose: 1.25,
      oversized: 1.4,
    };
    const fitScale = fitScaleMap[itemFit] ?? 1.15;

    switch (itemType) {
      case "torso": {
        // Torso clothing - shirt/jacket with sleeves
        const width =
          (physicalAttributes.shoulderWidth / 100) * fitScale * bodyThickness;
        const height =
          (physicalAttributes.torsoLength / 100) * torsoScale * 1.2;
        const depth = 0.22 * fitScale * bodyThickness;

        // Arm sleeve dimensions
        const armThickness = 0.08 * fitScale * bodyThickness;
        const upperArmLength = (physicalAttributes.armLength / 100) * 0.45;
        const forearmLength = (physicalAttributes.armLength / 100) * 0.4;

        return {
          geometry: new THREE.BoxGeometry(width, height, depth),
          offset: new THREE.Vector3(0, 0, clothingBuffer),
          isPaired: false,
          // Multi-segment: includes sleeves
          isMultiSegment: true,
          segments: [
            // Left upper arm sleeve
            {
              boneName: "upper_arm_L",
              geometry: new THREE.CylinderGeometry(
                armThickness * 1.1,
                armThickness * 0.95,
                upperArmLength,
                12
              ),
              offset: new THREE.Vector3(0, -upperArmLength * 0.4, 0),
            },
            // Left forearm sleeve
            {
              boneName: "forearm_L",
              geometry: new THREE.CylinderGeometry(
                armThickness * 0.95,
                armThickness * 0.85,
                forearmLength,
                12
              ),
              offset: new THREE.Vector3(0, -forearmLength * 0.4, 0),
            },
            // Right upper arm sleeve
            {
              boneName: "upper_arm_R",
              geometry: new THREE.CylinderGeometry(
                armThickness * 1.1,
                armThickness * 0.95,
                upperArmLength,
                12
              ),
              offset: new THREE.Vector3(0, -upperArmLength * 0.4, 0),
            },
            // Right forearm sleeve
            {
              boneName: "forearm_R",
              geometry: new THREE.CylinderGeometry(
                armThickness * 0.95,
                armThickness * 0.85,
                forearmLength,
                12
              ),
              offset: new THREE.Vector3(0, -forearmLength * 0.4, 0),
            },
          ],
        };
      }

      case "pants": {
        // Pants - separate cylinders for each leg segment (thigh + shin)
        const legThickness = 0.1 * fitScale * bodyThickness;
        const thighLength = (physicalAttributes.legLength / 100) * legScale * 0.45;
        const shinLength = (physicalAttributes.legLength / 100) * legScale * 0.42;

        return {
          // Main geometry not used for multi-segment
          geometry: new THREE.BoxGeometry(0.01, 0.01, 0.01),
          offset: new THREE.Vector3(0, 0, 0),
          isPaired: false,
          isMultiSegment: true,
          segments: [
            // Left thigh
            {
              boneName: "thigh_L",
              geometry: new THREE.CylinderGeometry(
                legThickness * 1.15, // Top (hip)
                legThickness * 0.95, // Bottom (knee)
                thighLength,
                16
              ),
              offset: new THREE.Vector3(0, -thighLength * 0.4, 0),
            },
            // Left shin
            {
              boneName: "shin_L",
              geometry: new THREE.CylinderGeometry(
                legThickness * 0.95, // Top (knee)
                legThickness * 0.8, // Bottom (ankle)
                shinLength,
                16
              ),
              offset: new THREE.Vector3(0, -shinLength * 0.4, 0),
            },
            // Right thigh
            {
              boneName: "thigh_R",
              geometry: new THREE.CylinderGeometry(
                legThickness * 1.15,
                legThickness * 0.95,
                thighLength,
                16
              ),
              offset: new THREE.Vector3(0, -thighLength * 0.4, 0),
            },
            // Right shin
            {
              boneName: "shin_R",
              geometry: new THREE.CylinderGeometry(
                legThickness * 0.95,
                legThickness * 0.8,
                shinLength,
                16
              ),
              offset: new THREE.Vector3(0, -shinLength * 0.4, 0),
            },
          ],
        };
      }

      case "belt": {
        // Belt around waist
        const beltWidth =
          (physicalAttributes.shoulderWidth / 100) * 0.85 * bodyThickness;
        const beltDepth = 0.18 * bodyThickness;
        return {
          geometry: new THREE.BoxGeometry(beltWidth, 0.1, beltDepth),
          offset: new THREE.Vector3(0, 0, clothingBuffer),
          isPaired: false,
        };
      }

      case "vest": {
        // Vest over torso (worn over shirt)
        const width =
          (physicalAttributes.shoulderWidth / 100) *
          0.95 *
          fitScale *
          bodyThickness;
        const height =
          (physicalAttributes.torsoLength / 100) * 0.75 * torsoScale;
        const depth = 0.2 * fitScale * bodyThickness;
        return {
          geometry: new THREE.BoxGeometry(width, height, depth),
          offset: new THREE.Vector3(0, 0, clothingBuffer + 0.02), // Extra offset to sit over shirt
          isPaired: false,
        };
      }

      case "boots": {
        // Boots on feet
        const bootSize = 0.1 * bodyThickness;
        return {
          geometry: new THREE.BoxGeometry(
            bootSize * 1.6,
            bootSize * 1.4,
            bootSize * 1.8
          ),
          geometryRight: new THREE.BoxGeometry(
            bootSize * 1.6,
            bootSize * 1.4,
            bootSize * 1.8
          ),
          offset: new THREE.Vector3(0, -bootSize * 0.3, bootSize * 0.4),
          isPaired: true,
          leftBone: "foot_L",
          rightBone: "foot_R",
        };
      }

      case "gloves": {
        // Gloves on hands
        const gloveSize = 0.08 * bodyThickness;
        return {
          geometry: new THREE.BoxGeometry(
            gloveSize,
            gloveSize * 1.3,
            gloveSize
          ),
          geometryRight: new THREE.BoxGeometry(
            gloveSize,
            gloveSize * 1.3,
            gloveSize
          ),
          offset: new THREE.Vector3(0, 0, clothingBuffer * 0.5),
          isPaired: true,
          leftBone: "hand_L",
          rightBone: "hand_R",
        };
      }

      case "headgear": {
        // Headgear - helmet/cap
        const headRadius = (physicalAttributes.headSize / 200) * bodyThickness;
        return {
          geometry: new THREE.SphereGeometry(
            headRadius * 1.15, // Slightly larger than head
            16,
            8,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
          ),
          offset: new THREE.Vector3(0, 0.12, clothingBuffer),
          isPaired: false,
        };
      }

      default:
        return {
          geometry: new THREE.BoxGeometry(0.08, 0.08, 0.08),
          offset: new THREE.Vector3(0, 0, clothingBuffer),
          isPaired: false,
        };
    }
  }, [itemType, itemFit, physicalAttributes]);

  // Create material
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: colorPrimary,
      metalness: metalness ?? 0.15,
      roughness: roughness ?? 0.75,
    });
    if (colorEmissive !== undefined) {
      mat.emissive = new THREE.Color(colorEmissive);
      mat.emissiveIntensity = emissiveIntensity ?? 0.1;
    }
    return mat;
  }, [colorPrimary, colorEmissive, emissiveIntensity, metalness, roughness]);

  // Second material for paired items
  const materialRight = useMemo(() => {
    if (!clothingConfig.isPaired) return null;
    const mat = new THREE.MeshStandardMaterial({
      color: colorPrimary,
      metalness: metalness ?? 0.15,
      roughness: roughness ?? 0.75,
    });
    if (colorEmissive !== undefined) {
      mat.emissive = new THREE.Color(colorEmissive);
      mat.emissiveIntensity = emissiveIntensity ?? 0.1;
    }
    return mat;
  }, [
    clothingConfig.isPaired,
    colorPrimary,
    colorEmissive,
    emissiveIntensity,
    metalness,
    roughness,
  ]);

  // Get primary bone name
  const primaryBoneName = getPrimaryBone(itemType);

  // Temp vectors for offset calculation (reused to avoid allocations)
  const tempOffset = useMemo(() => new THREE.Vector3(), []);

  // Update position/rotation each frame to follow bones
  useFrame(() => {
    if (
      clothingConfig.isPaired &&
      "leftBone" in clothingConfig &&
      "rightBone" in clothingConfig
    ) {
      // Handle paired items (pants legs, boots, gloves)
      const leftBone = boneMap.get(clothingConfig.leftBone as string);
      const rightBone = boneMap.get(clothingConfig.rightBone as string);

      if (leftMeshRef.current && leftBone) {
        // Get world position (traverse parent chain)
        const worldPos = getBoneWorldPosition(leftBone);
        const worldRot = getBoneWorldRotation(leftBone);
        tempOffset.copy(clothingConfig.offset);
        leftMeshRef.current.position.copy(worldPos).add(tempOffset);
        leftMeshRef.current.rotation.copy(worldRot);
      }

      if (rightMeshRef.current && rightBone) {
        // Get world position (traverse parent chain)
        const worldPos = getBoneWorldPosition(rightBone);
        const worldRot = getBoneWorldRotation(rightBone);
        tempOffset.copy(clothingConfig.offset);
        rightMeshRef.current.position.copy(worldPos).add(tempOffset);
        rightMeshRef.current.rotation.copy(worldRot);
      }
    } else {
      // Handle single items (torso, belt, etc.)
      const bone = boneMap.get(primaryBoneName);
      if (groupRef.current && bone) {
        // Get world position (traverse parent chain)
        const worldPos = getBoneWorldPosition(bone);
        const worldRot = getBoneWorldRotation(bone);
        tempOffset.copy(clothingConfig.offset);
        groupRef.current.position.copy(worldPos).add(tempOffset);
        groupRef.current.rotation.copy(worldRot);
      }
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      clothingConfig.geometry.dispose();
      if ("geometryRight" in clothingConfig && clothingConfig.geometryRight) {
        (clothingConfig.geometryRight as THREE.BufferGeometry).dispose();
      }
      // Dispose segment geometries
      if (
        "segments" in clothingConfig &&
        Array.isArray(clothingConfig.segments)
      ) {
        for (const seg of clothingConfig.segments) {
          seg.geometry.dispose();
        }
      }
      material.dispose();
      materialRight?.dispose();
    };
  }, [clothingConfig, material, materialRight]);

  // Render multi-segment items (pants with 4 leg segments, torso with sleeves)
  if (
    "isMultiSegment" in clothingConfig &&
    clothingConfig.isMultiSegment &&
    "segments" in clothingConfig
  ) {
    const segments = clothingConfig.segments as Array<{
      boneName: string;
      geometry: THREE.BufferGeometry;
      offset: THREE.Vector3;
    }>;

    return (
      <>
        {/* Main body piece (for torso) */}
        {itemType === "torso" && (
          <group ref={groupRef} name={`clothing-${itemId}-body`} scale={scale}>
            <mesh
              geometry={clothingConfig.geometry}
              material={material}
              castShadow={castShadow ?? true}
              receiveShadow={receiveShadow ?? true}
            />
          </group>
        )}
        {/* Limb segments */}
        {segments.map((seg, idx) => (
          <LimbSegment
            key={`${itemId}-${seg.boneName}-${idx}`}
            boneName={seg.boneName}
            boneMap={boneMap}
            geometry={seg.geometry}
            material={material}
            offset={seg.offset}
            castShadow={castShadow ?? true}
            receiveShadow={receiveShadow ?? true}
            scale={scale}
            itemId={itemId}
          />
        ))}
      </>
    );
  }

  // Render paired items separately
  if (clothingConfig.isPaired && "geometryRight" in clothingConfig) {
    return (
      <>
        <mesh
          ref={leftMeshRef}
          geometry={clothingConfig.geometry}
          material={material}
          castShadow={castShadow ?? true}
          receiveShadow={receiveShadow ?? true}
          name={`clothing-${itemId}-left`}
          scale={scale}
        />
        <mesh
          ref={rightMeshRef}
          geometry={
            (clothingConfig.geometryRight as THREE.BufferGeometry) ??
            clothingConfig.geometry
          }
          material={materialRight ?? material}
          castShadow={castShadow ?? true}
          receiveShadow={receiveShadow ?? true}
          name={`clothing-${itemId}-right`}
          scale={scale}
        />
      </>
    );
  }

  // Render single items
  return (
    <group ref={groupRef} name={`clothing-${itemId}`} scale={scale}>
      <mesh
        geometry={clothingConfig.geometry}
        material={material}
        castShadow={castShadow ?? true}
        receiveShadow={receiveShadow ?? true}
      />
    </group>
  );
};

/**
 * ClothingSystem Component
 *
 * Main component that renders all clothing items for an archetype.
 * Clothing follows skeletal bone movements in real-time.
 *
 * @example
 * ```tsx
 * <ClothingSystem
 *   archetype={PlayerArchetype.MUSA}
 *   physicalAttributes={musaPhysical}
 *   boneMap={skeletalRig.bones}
 *   scale={1.0}
 *   visible={true}
 * />
 * ```
 *
 * @korean 의류시스템컴포넌트
 */
export const ClothingSystem: React.FC<ClothingSystemProps> = ({
  archetype,
  physicalAttributes,
  boneMap,
  scale = 1,
  visible = true,
}) => {
  // Get clothing set for archetype
  const clothingSet = useMemo(
    () => getArchetypeClothing(archetype),
    [archetype]
  );

  // Early return if not visible or no bone map
  if (!visible || !boneMap) {
    return null;
  }

  return (
    <group name={`clothing-system-${archetype}`}>
      {clothingSet.items.map((item) => (
        <BoneAttachedClothing
          key={item.id}
          item={item}
          boneMap={boneMap}
          physicalAttributes={physicalAttributes}
          scale={scale}
        />
      ))}
    </group>
  );
};

export default ClothingSystem;
