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
 * - Double-sided rendering (THREE.DoubleSide) for complete 360° coverage and gap prevention
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
  // Thin character (28kg muscle, 10kg fat): 0.85 + (-0.030) + (-0.033) ≈ 0.787
  // Average (35kg muscle, 12kg fat): 0.85 + 0 + 0 = 0.85
  // Heavy (48kg muscle, 20kg fat): 0.85 + 0.056 + 0.133 ≈ 1.039
  const muscleContribution = (muscleRatio - 1.0) * 0.15;
  const fatContribution = (fatRatio - 1.0) * 0.2;

  // Cap at 1.20x maximum to prevent "michelin man" effect
  return Math.max(
    0.75,
    Math.min(1.2, 0.85 + muscleContribution + fatContribution),
  );
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
      // Main neck cylinder
      segments.push({
        geometry: new THREE.CylinderGeometry(
          neckRadius * 0.9, // Slightly narrower at top (under jaw)
          neckRadius * 1.2, // Wider at base (base of neck)
          neckLength,
          segmentCount, // LOD-based segment count
        ),
        localOffset: new THREE.Vector3(0, -neckLength * 0.4, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      // Neck base flare - smooth transition to shoulders/torso
      segments.push({
        geometry: new THREE.CylinderGeometry(
          neckRadius * 1.2, // Match neck bottom
          neckRadius * 1.6, // Flare out to trapezius area
          neckLength * 0.3,
          segmentCount,
        ),
        localOffset: new THREE.Vector3(0, -neckLength * 0.75, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "head": {
      // Head / skull sphere - Face3D renders features on top of this base
      // Slightly elongated sphere for realistic cranium shape
      const headRadius = 0.095 * bodyThickness; // ~19cm head width
      const headHeight = headRadius * 1.15; // Slightly taller than wide

      // Main cranium sphere
      segments.push({
        geometry: new THREE.SphereGeometry(
          headRadius,
          segmentCount,
          segmentCount,
        ),
        localOffset: new THREE.Vector3(0, headHeight * 0.15, 0), // Slightly above bone origin
        localRotation: new THREE.Euler(0, 0, 0),
      });
      // Jaw/chin area - smaller sphere below to fill out the jaw line
      segments.push({
        geometry: new THREE.SphereGeometry(
          headRadius * 0.7,
          Math.floor(segmentCount * 0.75),
          Math.floor(segmentCount * 0.75),
        ),
        localOffset: new THREE.Vector3(
          0,
          -headHeight * 0.25,
          headRadius * 0.15,
        ),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "spine_upper": {
      // Upper torso / chest area - wider for shoulders
      const width =
        (physicalAttributes.shoulderWidth / 100) * bodyThickness * 0.9;
      const height = (physicalAttributes.torsoLength / 100) * torsoScale * 0.3;
      const depth = PECTORALS_RADIUS * 2 * bodyThickness * 0.95;

      segments.push({
        geometry: new THREE.BoxGeometry(
          width,
          height,
          depth,
          Math.max(2, Math.round(segmentCount * 0.2)),
          Math.max(2, Math.round(segmentCount * 0.2)),
          Math.max(2, Math.round(segmentCount * 0.2)),
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "spine_middle": {
      // Main torso - box covering chest and abs
      const width = (physicalAttributes.shoulderWidth / 100) * bodyThickness;
      const height = (physicalAttributes.torsoLength / 100) * torsoScale * 0.35;
      const depth = PECTORALS_RADIUS * 2 * bodyThickness; // Front to back depth

      // Use LOD-aware segment counts (slightly higher than other regions) to keep torso shading smooth:
      // - Torso is frequently closest to the camera and used for breathing / impact motion.
      // - Vital point overlays and skin highlights rely on smoother curvature in this region.
      // - We still respect the global LOD segmentCount so distant torsos reduce complexity consistently.
      const torsoSegmentsX = Math.max(2, Math.round(segmentCount * 0.2));
      const torsoSegmentsY = Math.max(3, Math.round(segmentCount * 0.3));
      const torsoSegmentsZ = Math.max(2, Math.round(segmentCount * 0.2));

      segments.push({
        geometry: new THREE.BoxGeometry(
          width,
          height,
          depth,
          torsoSegmentsX,
          torsoSegmentsY,
          torsoSegmentsZ,
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "spine_lower": {
      // Lower torso / lumbar area - tapers from chest to pelvis
      const widthTop =
        (physicalAttributes.shoulderWidth / 100) * bodyThickness * 0.95;
      const widthBottom =
        (physicalAttributes.shoulderWidth / 100) * bodyThickness * 0.85;
      const height = (physicalAttributes.torsoLength / 100) * torsoScale * 0.3;

      // Use tapered cylinder for natural waist shape
      segments.push({
        geometry: new THREE.CylinderGeometry(
          widthTop * 0.5,
          widthBottom * 0.5,
          height,
          segmentCount,
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "pelvis": {
      // Pelvis/hip area - wider for hip bones, connecting to legs
      const width =
        (physicalAttributes.shoulderWidth / 100) * 0.85 * bodyThickness;
      const height = 0.15;
      const depth = CORE_RADIUS * 2 * bodyThickness;

      segments.push({
        geometry: new THREE.BoxGeometry(width, height, depth, 3, 2, 3),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "shoulder_L":
    case "shoulder_R": {
      // Shoulder joint - full sphere for smooth, rounded shoulder with LOD
      const shoulderRadius = BICEP_RADIUS * bodyThickness * 1.4;

      segments.push({
        geometry: new THREE.SphereGeometry(
          shoulderRadius,
          segmentCount,
          segmentCount,
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
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
      const radiusBottom = FOREARM_RADIUS * bodyThickness * 0.8; // Less narrow - connects to wrist smoothly
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
      const radiusTop = QUAD_RADIUS * bodyThickness * 1.3; // Wider at hip for smooth connection
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
      const radiusBottom = CALF_RADIUS * bodyThickness * 0.8; // Less taper - connects to ankle
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

    case "elbow_L":
    case "elbow_R": {
      // Elbow joint sphere - bridges upper arm and forearm
      const elbowRadius = BICEP_RADIUS * bodyThickness * 0.95;
      segments.push({
        geometry: new THREE.SphereGeometry(
          elbowRadius,
          segmentCount,
          Math.floor(segmentCount * 0.75),
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "wrist_L":
    case "wrist_R": {
      // Wrist joint - tapered cylinder connecting forearm to hand
      // No rotation needed - cylinder Y axis already aligns with forearm direction
      const wristRadiusTop = FOREARM_RADIUS * bodyThickness * 0.75;
      const wristRadiusBottom = FOREARM_RADIUS * bodyThickness * 0.6;
      const wristLength = 0.035 * bodyThickness;
      segments.push({
        geometry: new THREE.CylinderGeometry(
          wristRadiusTop,
          wristRadiusBottom,
          wristLength,
          segmentCount,
        ),
        localOffset: new THREE.Vector3(0, -wristLength * 0.3, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "hand_L":
    case "hand_R": {
      // Wrist-to-hand bridge sphere - fills gap between wrist skin and Hand3D component
      const handBridgeRadius = FOREARM_RADIUS * bodyThickness * 0.55;
      segments.push({
        geometry: new THREE.SphereGeometry(
          handBridgeRadius,
          segmentCount,
          Math.floor(segmentCount * 0.75),
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "knee_L":
    case "knee_R": {
      // Knee joint sphere - bridges thigh and shin
      const kneeRadius = QUAD_RADIUS * bodyThickness * 0.9;
      segments.push({
        geometry: new THREE.SphereGeometry(
          kneeRadius,
          segmentCount,
          Math.floor(segmentCount * 0.75),
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      // Front kneecap bump
      const kneecapRadius = kneeRadius * 0.5;
      segments.push({
        geometry: new THREE.SphereGeometry(
          kneecapRadius,
          Math.floor(segmentCount * 0.5),
          Math.floor(segmentCount * 0.5),
        ),
        localOffset: new THREE.Vector3(0, 0, kneeRadius * 0.6),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "hip_L":
    case "hip_R": {
      // Hip joint sphere - connects pelvis to thigh smoothly
      const hipRadius = QUAD_RADIUS * bodyThickness * 1.1;
      segments.push({
        geometry: new THREE.SphereGeometry(
          hipRadius,
          segmentCount,
          Math.floor(segmentCount * 0.75),
        ),
        localOffset: new THREE.Vector3(0, -hipRadius * 0.3, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    case "foot_L":
    case "foot_R": {
      // Ankle bridge sphere - connects shin body surface to Foot3D component
      const ankleRadius = CALF_RADIUS * bodyThickness * 0.75;
      segments.push({
        geometry: new THREE.SphereGeometry(
          ankleRadius,
          segmentCount,
          Math.floor(segmentCount * 0.75),
        ),
        localOffset: new THREE.Vector3(0, 0, 0),
        localRotation: new THREE.Euler(0, 0, 0),
      });
      break;
    }

    // Shoulders already handled by shoulder_L/R cases
    // Hand detail (fingers) uses specialized Hand3D component
    // Foot detail (toes) uses specialized Foot3D component
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
   * Material properties are intentionally different from Face3D/Hand3D/Foot3D to capture
   * body-specific skin characteristics:
   * - transmission: 0.08 (extremities use 0) – BodySurface is the only skin material with
   *   non-zero transmission, to model subsurface scattering on larger, less directly lit
   *   body areas.
   * - thickness: 0.5 (extremities use 0.1) – torso/limb skin is treated as thicker than
   *   hands, feet, and face, which appear optically thinner.
   * - clearcoat: 0.15 (extremities use 0.3) – extremities are rendered slightly glossier
   *   due to being more exposed to direct light, while the main body surface is softer.
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

      side: THREE.DoubleSide, // Render both sides for complete body coverage and gap prevention
      flatShading: false, // Smooth shading for organic look
    });
  }, [skinTone]);

  // Cleanup material on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  // Cleanup geometries when segments change or on unmount
  useEffect(() => {
    return () => {
      segments.forEach((segment) => {
        segment.geometry.dispose();
      });
    };
  }, [segments]);

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
