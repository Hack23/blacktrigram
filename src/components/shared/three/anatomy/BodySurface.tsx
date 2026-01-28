/**
 * Body Surface component for realistic humanoid skin/flesh rendering
 *
 * **Purpose**: Provides continuous body surface layer between bones and clothing
 * to create organic, human-like appearance instead of robotic segmented look.
 *
 * **Features**:
 * - Continuous skin layer covering neck, torso, shoulders, arms, and legs
 * - Archetype-specific skin tones for visual variety
 * - Proper body thickness scaling based on muscle and fat mass
 * - Double-sided rendering for complete 360° coverage
 * - Smooth tapering for realistic proportions
 * - Enhanced material with subsurface scattering and clearcoat
 * - High-quality geometry with increased segment counts
 * - Shoulder joints for smooth transitions
 *
 * **Rendering Order**: Bones → Muscles (optional) → Body Surface → Clothing
 *
 * @module components/three/BodySurface
 * @category 3D Components
 * @korean 신체표면컴포넌트
 */

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  PECTORALS_RADIUS,
  CORE_RADIUS,
  BICEP_RADIUS,
  FOREARM_RADIUS,
  QUAD_RADIUS,
  CALF_RADIUS,
} from "../../../../constants/bodyDimensions";
import type { PlayerArchetype } from "../../../../types/common";
import { getArchetypeSkinTone } from "../../../../utils/colorUtils";

/**
 * Props for BodySurface component
 *
 * @korean 신체표면속성
 */
export interface BodySurfaceProps {
  /**
   * Name of the bone this body surface attaches to
   * @korean 뼈이름
   */
  readonly boneName: string;

  /**
   * Player archetype for skin tone
   * @korean 플레이어원형
   */
  readonly archetype: PlayerArchetype;

  /**
   * Physical attributes for body sizing
   * @korean 신체속성
   */
  readonly physicalAttributes?: {
    readonly muscleMass: number;
    readonly fatMass: number;
    readonly shoulderWidth: number;
    readonly torsoLength: number;
    readonly armLength: number;
    readonly legLength: number;
  };

  /**
   * Distance from camera for LOD optimization
   * @korean 카메라거리
   */
  readonly cameraDistance?: number;
}

/**
 * Body surface segment configuration
 *
 * @korean 신체표면세그먼트
 */
interface BodySurfaceSegment {
  readonly geometry: THREE.BufferGeometry;
  readonly localOffset: THREE.Vector3;
  readonly localRotation: THREE.Euler;
}

/**
 * Calculate body thickness multiplier with reasonable limits
 *
 * Uses linear scaling instead of square root to prevent excessive inflation
 * for heavy characters. Caps maximum thickness at 1.20x to maintain realism.
 *
 * @param muscleMass - Muscle mass in kg
 * @param fatMass - Fat mass in kg
 * @returns Body thickness multiplier (0.75 - 1.20)
 * @korean 신체두께계산
 */
const calculateBodyThickness = (
  muscleMass: number,
  fatMass: number,
): number => {
  const referenceMuscle = 35; // Reference: athletic build
  const referenceFat = 12; // Reference: low body fat

  // Linear scaling with limits (not square root which causes excessive inflation)
  const muscleRatio = muscleMass / referenceMuscle;
  const fatRatio = fatMass / referenceFat;

  // Base 0.85, muscle adds up to +0.15, fat adds up to +0.20
  // Thin character (28kg muscle, 10kg fat): 0.85 + (-0.06) + (-0.03) = 0.76
  // Average (35kg muscle, 12kg fat): 0.85 + 0 + 0 = 0.85
  // Heavy (48kg muscle, 20kg fat): 0.85 + 0.11 + 0.13 = 1.09
  const muscleContribution = (muscleRatio - 1.0) * 0.15;
  const fatContribution = (fatRatio - 1.0) * 0.20;

  // Cap at 1.20x maximum to prevent "michelin man" effect
  return Math.max(0.75, Math.min(1.20, 0.85 + muscleContribution + fatContribution));
};

/**
 * Determine segment count based on camera distance for LOD
 *
 * @param cameraDistance - Distance from camera
 * @returns Segment count for geometry
 * @korean LOD세그먼트수
 */
const getLODSegmentCount = (cameraDistance: number): number => {
  if (cameraDistance < 5) {
    return 20; // High detail for close-ups
  } else if (cameraDistance < 10) {
    return 16; // Medium detail for normal distance
  } else {
    return 12; // Low detail for far distance
  }
};

/**
 * Get body surface segments for a specific bone
 *
 * Creates continuous skin geometry appropriate for each body part.
 * Implements LOD (Level of Detail) based on camera distance for performance.
 *
 * @param boneName - Name of the bone
 * @param physicalAttributes - Physical attributes for scaling
 * @param cameraDistance - Distance from camera for LOD
 * @returns Array of body surface segments
 * @korean 신체표면세그먼트가져오기
 */
const getBodySurfaceForBone = (
  boneName: string,
  physicalAttributes: {
    muscleMass: number;
    fatMass: number;
    shoulderWidth: number;
    torsoLength: number;
    armLength: number;
    legLength: number;
  },
  cameraDistance: number = 10,
): BodySurfaceSegment[] => {
  const segments: BodySurfaceSegment[] = [];

  const bodyThickness = calculateBodyThickness(
    physicalAttributes.muscleMass,
    physicalAttributes.fatMass,
  );

  // Get appropriate segment count based on distance
  const segmentCount = getLODSegmentCount(cameraDistance);

  // Scaling factors for different body parts
  const torsoScale = physicalAttributes.torsoLength / 59; // Reference: 59cm torso
  const armScale = physicalAttributes.armLength / 77; // Reference: 77cm arms
  const legScale = physicalAttributes.legLength / 96; // Reference: 96cm legs

  switch (boneName) {
    case "neck": {
      // Neck cylinder - smooth connection between head and torso with LOD
      const neckRadius = 0.06 * bodyThickness;
      const neckLength = 0.11 * bodyThickness;
      segments.push({
        geometry: new THREE.CylinderGeometry(
          neckRadius,
          neckRadius * 1.1, // Slightly wider at base
          neckLength,
          segmentCount, // LOD-based segment count
        ),
        localOffset: new THREE.Vector3(0, -neckLength * 0.4, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "spine_middle": {
      // Main torso - box covering chest, abs, and back with rounded edges
      const width = (physicalAttributes.shoulderWidth / 100) * bodyThickness;
      const height = (physicalAttributes.torsoLength / 100) * torsoScale;
      const depth = (PECTORALS_RADIUS * 2) * bodyThickness; // Front to back depth

      // Use higher segment count for smoother appearance
      segments.push({
        geometry: new THREE.BoxGeometry(width, height, depth, 4, 6, 4),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "pelvis": {
      // Pelvis/hip area - box covering lower torso
      const width = (physicalAttributes.shoulderWidth / 100) * 0.85 * bodyThickness;
      const height = 0.15;
      const depth = (CORE_RADIUS * 2) * bodyThickness;

      segments.push({
        geometry: new THREE.BoxGeometry(width, height, depth, 3, 2, 3),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "shoulder_L":
    case "shoulder_R": {
      // Shoulder joint - spherical cap for smooth shoulder transition with LOD
      const shoulderRadius = BICEP_RADIUS * bodyThickness * 1.3;

      segments.push({
        geometry: new THREE.SphereGeometry(shoulderRadius, segmentCount, Math.floor(segmentCount * 0.75), 0, Math.PI * 2, 0, Math.PI / 2),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      });
      break;
    }

    case "upper_arm_L":
    case "upper_arm_R": {
      // Upper arm - tapered cylinder (bicep area) with LOD
      const radiusTop = BICEP_RADIUS * bodyThickness * 1.1; // Wider at shoulder
      const radiusBottom = BICEP_RADIUS * bodyThickness * 0.9; // Narrower at elbow
      const length = (physicalAttributes.armLength / 100) * armScale * 0.45;

      segments.push({
        geometry: new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          length,
          segmentCount, // LOD-based segment count
        ),
        localOffset: new THREE.Vector3(0, -length * 0.4, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "forearm_L":
    case "forearm_R": {
      // Forearm - tapered cylinder with LOD
      const radiusTop = FOREARM_RADIUS * bodyThickness * 1.0; // Wider at elbow
      const radiusBottom = FOREARM_RADIUS * bodyThickness * 0.7; // Narrower at wrist
      const length = (physicalAttributes.armLength / 100) * armScale * 0.4;

      segments.push({
        geometry: new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          length,
          segmentCount, // LOD-based segment count
        ),
        localOffset: new THREE.Vector3(0, -length * 0.4, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "thigh_L":
    case "thigh_R": {
      // Thigh - tapered cylinder (quad area) with LOD
      const radiusTop = QUAD_RADIUS * bodyThickness * 1.2; // Wider at hip
      const radiusBottom = QUAD_RADIUS * bodyThickness * 0.95; // Narrower at knee
      const length = (physicalAttributes.legLength / 100) * legScale * 0.45;

      segments.push({
        geometry: new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          length,
          segmentCount, // LOD-based segment count
        ),
        localOffset: new THREE.Vector3(0, -length * 0.4, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "shin_L":
    case "shin_R": {
      // Shin/calf - tapered cylinder with LOD
      const radiusTop = CALF_RADIUS * bodyThickness * 1.0; // Wider at knee
      const radiusBottom = CALF_RADIUS * bodyThickness * 0.65; // Narrower at ankle
      const length = (physicalAttributes.legLength / 100) * legScale * 0.42;

      segments.push({
        geometry: new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          length,
          segmentCount, // LOD-based segment count
        ),
        localOffset: new THREE.Vector3(0, -length * 0.4, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    // Shoulders already handled by upper_arm connection
    // Hands and feet use specialized Hand3D and Foot3D components
    // Head uses Face3D component
  }

  return segments;
};

/**
 * BodySurface Component
 *
 * Renders realistic body surface (skin/flesh) attached to a specific bone.
 * Creates organic, human-like appearance by providing continuous body coverage.
 *
 * @example
 * ```tsx
 * <BodySurface
 *   boneName="spine_middle"
 *   archetype={PlayerArchetype.MUSA}
 *   physicalAttributes={musaPhysicalAttrs}
 * />
 * ```
 *
 * @korean 신체표면컴포넌트
 */
export const BodySurface: React.FC<BodySurfaceProps> = ({
  boneName,
  archetype,
  physicalAttributes,
  cameraDistance = 10,
}) => {
  // Default physical attributes if not provided
  const attrs = useMemo(
    () =>
      physicalAttributes ?? {
        muscleMass: 35,
        fatMass: 12,
        shoulderWidth: 45,
        torsoLength: 59,
        armLength: 77,
        legLength: 96,
      },
    [physicalAttributes],
  );

  // Get body surface segments for this bone with LOD
  const segments = useMemo(
    () => getBodySurfaceForBone(boneName, attrs, cameraDistance),
    [boneName, attrs, cameraDistance],
  );

  // Get archetype-specific skin tone
  const skinTone = useMemo(() => getArchetypeSkinTone(archetype), [archetype]);

  /**
   * Create skin material with realistic properties
   *
   * Uses MeshPhysicalMaterial for enhanced realism:
   * - Skin tone color from archetype
   * - Subsurface scattering with subtle transmission for realistic skin translucency
   * - Roughness: 0.65 (slightly rough skin texture)
   * - Metalness: 0.0 (skin is not metallic)
   * - Clearcoat for natural skin sheen
   * - Sheen for skin surface properties
   * - Subtle emissive for alive appearance
   * - Double-sided: true (render both inside and outside)
   *
   * Material properties differ from Face3D/Hand3D/Foot3D for body-specific characteristics:
   * - transmission: 0.08 (vs 0 in others) - body skin has more subsurface scattering
   * - thickness: 0.5 (vs 0.1 in others) - body has thicker skin layers
   * - clearcoat: 0.15 (vs 0.3 in others) - body skin is less glossy than extremities
   *
   * @korean 피부재료생성
   */
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: skinTone,
      roughness: 0.65, // Slightly rough for realistic skin
      metalness: 0.0, // Skin is not metallic
      
      // Subsurface scattering for realistic skin translucency
      transmission: 0.08, // Small non-zero transmission for subtle skin translucency
      thickness: 0.5, // Moderate thickness for subsurface scattering
      ior: 1.4, // Index of refraction for human skin
      
      // Clearcoat for natural skin sheen (subtle)
      clearcoat: 0.15,
      clearcoatRoughness: 0.8,
      
      // Sheen for skin surface properties (consistent with Hand3D, Foot3D)
      sheen: 0.1,
      sheenRoughness: 0.8,
      
      // Subtle emissive for alive appearance (consistent with other skin components)
      emissive: new THREE.Color(skinTone),
      emissiveIntensity: 0.02,
      
      // Reflectivity for realistic appearance
      reflectivity: 0.1,
      
      side: THREE.DoubleSide, // Render both sides for complete coverage
      flatShading: false, // Smooth shading for organic look
    });
  }, [skinTone]);

  // Cleanup material on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  // Cleanup geometries on unmount
  useEffect(() => {
    return () => {
      segments.forEach((segment) => {
        segment.geometry.dispose();
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (segments.length === 0) {
    return null;
  }

  return (
    <>
      {segments.map((segment, index) => (
        <mesh
          key={`body-surface-${boneName}-${index}`}
          geometry={segment.geometry}
          material={material}
          position={segment.localOffset.toArray()}
          rotation={[
            segment.localRotation.x,
            segment.localRotation.y,
            segment.localRotation.z,
          ]}
          castShadow
          receiveShadow
          name={`body-surface-${boneName}`}
        />
      ))}
    </>
  );
};

export default BodySurface;
