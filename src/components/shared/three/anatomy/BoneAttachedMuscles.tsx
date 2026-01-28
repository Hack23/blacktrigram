/**
 * Bone-attached muscle system for realistic muscle movement with skeleton
 *
 * Muscles are rendered as children of their parent bones, inheriting bone
 * transformations automatically for proper movement during animation.
 *
 * @module components/three/BoneAttachedMuscles
 * @category 3D Components
 * @korean 뼈부착근육시스템
 */

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";
import type { MuscleGroupName } from "../../../../types/muscle";
import { DEFAULT_MUSCLE_CONFIG } from "../../../../types/muscle";

/**
 * Muscle attachment configuration
 *
 * Defines how a muscle is positioned relative to its parent bone.
 * Position is in local bone space, so muscles move with the bone.
 *
 * @korean 근육부착설정
 */
export interface MuscleAttachment {
  /** Muscle group name */
  readonly name: MuscleGroupName;
  /** Korean name for UI */
  readonly korean: string;
  /** English name for UI */
  readonly english: string;
  /** Local position offset from bone origin */
  readonly localOffset: THREE.Vector3;
  /** Local rotation relative to bone */
  readonly localRotation: THREE.Euler;
  /** Base scale when relaxed */
  readonly baseScale: THREE.Vector3;
  /** Max scale when fully flexed */
  readonly maxFlexScale: THREE.Vector3;
  /** Capsule geometry radius */
  readonly radius: number;
  /** Capsule geometry length */
  readonly length: number;
}

/**
 * Mapping of bone names to their attached muscles
 *
 * Each bone can have multiple muscles attached to it.
 * Positions are relative to the bone's local coordinate system.
 *
 * @korean 뼈근육매핑
 */
export const BONE_MUSCLE_MAP: Record<string, MuscleAttachment[]> = {
  // Shoulders - deltoid muscles (INCREASED for visible shoulder mass)
  shoulder_L: [
    {
      name: "SHOULDER_L",
      korean: "왼쪽어깨",
      english: "Left Shoulder",
      localOffset: new THREE.Vector3(-0.08, 0, 0),
      localRotation: new THREE.Euler(0, 0, Math.PI / 2),
      baseScale: new THREE.Vector3(0.7, 0.5, 0.5), // INCREASED
      maxFlexScale: new THREE.Vector3(0.9, 0.65, 0.65),
      radius: 0.38, // INCREASED
      length: 0.35, // INCREASED
    },
  ],
  shoulder_R: [
    {
      name: "SHOULDER_R",
      korean: "오른쪽어깨",
      english: "Right Shoulder",
      localOffset: new THREE.Vector3(0.08, 0, 0),
      localRotation: new THREE.Euler(0, 0, -Math.PI / 2),
      baseScale: new THREE.Vector3(0.7, 0.5, 0.5), // INCREASED
      maxFlexScale: new THREE.Vector3(0.9, 0.65, 0.65),
      radius: 0.38, // INCREASED
      length: 0.35, // INCREASED
    },
  ],

  // Upper arms - biceps and triceps (INCREASED for visible arm mass)
  upper_arm_L: [
    {
      name: "BICEP_L",
      korean: "왼쪽이두근",
      english: "Left Bicep",
      localOffset: new THREE.Vector3(-0.12, 0, 0.05),
      localRotation: new THREE.Euler(0, 0, Math.PI / 2),
      baseScale: new THREE.Vector3(0.5, 0.6, 0.5), // INCREASED
      maxFlexScale: new THREE.Vector3(0.65, 0.65, 0.65),
      radius: 0.35, // INCREASED
      length: 0.55, // INCREASED
    },
    {
      name: "TRICEP_L",
      korean: "왼쪽삼두근",
      english: "Left Tricep",
      localOffset: new THREE.Vector3(-0.12, 0, -0.05),
      localRotation: new THREE.Euler(0, 0, Math.PI / 2),
      baseScale: new THREE.Vector3(0.42, 0.55, 0.42), // INCREASED
      maxFlexScale: new THREE.Vector3(0.55, 0.6, 0.55),
      radius: 0.3, // INCREASED
      length: 0.5, // INCREASED
    },
  ],
  upper_arm_R: [
    {
      name: "BICEP_R",
      korean: "오른쪽이두근",
      english: "Right Bicep",
      localOffset: new THREE.Vector3(0.12, 0, 0.05),
      localRotation: new THREE.Euler(0, 0, -Math.PI / 2),
      baseScale: new THREE.Vector3(0.5, 0.6, 0.5), // INCREASED
      maxFlexScale: new THREE.Vector3(0.65, 0.65, 0.65),
      radius: 0.35, // INCREASED
      length: 0.55, // INCREASED
    },
    {
      name: "TRICEP_R",
      korean: "오른쪽삼두근",
      english: "Right Tricep",
      localOffset: new THREE.Vector3(0.12, 0, -0.05),
      localRotation: new THREE.Euler(0, 0, -Math.PI / 2),
      baseScale: new THREE.Vector3(0.42, 0.55, 0.42), // INCREASED
      maxFlexScale: new THREE.Vector3(0.55, 0.6, 0.55),
      radius: 0.3, // INCREASED
      length: 0.5, // INCREASED
    },
  ],

  // Forearms (INCREASED for visible lower arm mass)
  forearm_L: [
    {
      name: "FOREARM_L",
      korean: "왼쪽전완근",
      english: "Left Forearm",
      localOffset: new THREE.Vector3(-0.11, 0, 0),
      localRotation: new THREE.Euler(0, 0, Math.PI / 2),
      baseScale: new THREE.Vector3(0.38, 0.5, 0.38), // INCREASED
      maxFlexScale: new THREE.Vector3(0.48, 0.55, 0.48),
      radius: 0.26, // INCREASED
      length: 0.48, // INCREASED
    },
  ],
  forearm_R: [
    {
      name: "FOREARM_R",
      korean: "오른쪽전완근",
      english: "Right Forearm",
      localOffset: new THREE.Vector3(0.11, 0, 0),
      localRotation: new THREE.Euler(0, 0, -Math.PI / 2),
      baseScale: new THREE.Vector3(0.38, 0.5, 0.38), // INCREASED
      maxFlexScale: new THREE.Vector3(0.48, 0.55, 0.48),
      radius: 0.26, // INCREASED
      length: 0.48, // INCREASED
    },
  ],

  // Spine - chest/core muscles attach to spine_middle (INCREASED for human-like body shape)
  spine_middle: [
    {
      name: "PECTORALS",
      korean: "대흉근",
      english: "Pectorals",
      localOffset: new THREE.Vector3(0, 0.08, 0.14),
      localRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      baseScale: new THREE.Vector3(1.1, 0.6, 0.5), // INCREASED for visible chest
      maxFlexScale: new THREE.Vector3(1.3, 0.75, 0.6),
      radius: 0.45, // INCREASED
      length: 0.5, // INCREASED
    },
    {
      name: "CORE",
      korean: "코어",
      english: "Core",
      localOffset: new THREE.Vector3(0, -0.04, 0.06),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.85, 0.75, 0.55), // INCREASED for body mass
      maxFlexScale: new THREE.Vector3(1.0, 0.85, 0.65),
      radius: 0.4, // INCREASED
      length: 0.7, // INCREASED
    },
    {
      name: "ABS",
      korean: "복근",
      english: "Abdominals",
      localOffset: new THREE.Vector3(0, -0.18, 0.12),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.7, 0.65, 0.45), // INCREASED
      maxFlexScale: new THREE.Vector3(0.85, 0.75, 0.55),
      radius: 0.35, // INCREASED
      length: 0.6, // INCREASED
    },
    {
      name: "OBLIQUES",
      korean: "복사근",
      english: "Obliques",
      localOffset: new THREE.Vector3(0, -0.1, 0.16),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.6, 0.6, 0.35), // INCREASED
      maxFlexScale: new THREE.Vector3(0.75, 0.7, 0.45),
      radius: 0.3, // INCREASED
      length: 0.55, // INCREASED
    },
  ],

  // Pelvis - central hip/waist muscles for human-like body shape (INCREASED)
  pelvis: [
    {
      name: "HIP_FLEXOR_L",
      korean: "왼쪽고관절굴근",
      english: "Left Hip Flexor",
      localOffset: new THREE.Vector3(-0.1, 0.04, 0.05),
      localRotation: new THREE.Euler(0.2, 0, 0.15),
      baseScale: new THREE.Vector3(0.5, 0.4, 0.4), // INCREASED
      maxFlexScale: new THREE.Vector3(0.6, 0.5, 0.5),
      radius: 0.3, // INCREASED
      length: 0.35, // INCREASED
    },
    {
      name: "HIP_FLEXOR_R",
      korean: "오른쪽고관절굴근",
      english: "Right Hip Flexor",
      localOffset: new THREE.Vector3(0.1, 0.04, 0.05),
      localRotation: new THREE.Euler(0.2, 0, -0.15),
      baseScale: new THREE.Vector3(0.5, 0.4, 0.4), // INCREASED
      maxFlexScale: new THREE.Vector3(0.6, 0.5, 0.5),
      radius: 0.3, // INCREASED
      length: 0.35, // INCREASED
    },
    {
      name: "LOWER_ABS",
      korean: "하복근",
      english: "Lower Abdominals",
      localOffset: new THREE.Vector3(0, 0.02, 0.08),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.65, 0.5, 0.4), // INCREASED for visible waist
      maxFlexScale: new THREE.Vector3(0.8, 0.6, 0.5),
      radius: 0.35, // INCREASED
      length: 0.45, // INCREASED
    },
  ],

  // Spine lower - lower back muscles for fuller torso appearance (INCREASED)
  spine_lower: [
    {
      name: "ERECTOR_SPINAE_L",
      korean: "왼쪽척추기립근",
      english: "Left Erector Spinae",
      localOffset: new THREE.Vector3(-0.06, 0.06, -0.06),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.4, 0.5, 0.35), // INCREASED
      maxFlexScale: new THREE.Vector3(0.5, 0.6, 0.45),
      radius: 0.25, // INCREASED
      length: 0.5, // INCREASED
    },
    {
      name: "ERECTOR_SPINAE_R",
      korean: "오른쪽척추기립근",
      english: "Right Erector Spinae",
      localOffset: new THREE.Vector3(0.06, 0.06, -0.06),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.4, 0.5, 0.35), // INCREASED
      maxFlexScale: new THREE.Vector3(0.5, 0.6, 0.45),
      radius: 0.25, // INCREASED
      length: 0.5, // INCREASED
    },
  ],

  // Spine upper - lats and traps for broader V-shaped back (INCREASED for human silhouette)
  spine_upper: [
    {
      name: "LAT_L",
      korean: "왼쪽광배근",
      english: "Left Latissimus",
      localOffset: new THREE.Vector3(-0.14, -0.02, -0.05),
      localRotation: new THREE.Euler(0, 0.2, 0.3),
      baseScale: new THREE.Vector3(0.55, 0.65, 0.4), // INCREASED for V-taper
      maxFlexScale: new THREE.Vector3(0.7, 0.8, 0.5),
      radius: 0.35, // INCREASED
      length: 0.6, // INCREASED
    },
    {
      name: "LAT_R",
      korean: "오른쪽광배근",
      english: "Right Latissimus",
      localOffset: new THREE.Vector3(0.14, -0.02, -0.05),
      localRotation: new THREE.Euler(0, -0.2, -0.3),
      baseScale: new THREE.Vector3(0.55, 0.65, 0.4), // INCREASED
      maxFlexScale: new THREE.Vector3(0.7, 0.8, 0.5),
      radius: 0.35, // INCREASED
      length: 0.6, // INCREASED
    },
    {
      name: "TRAPEZIUS",
      korean: "승모근",
      english: "Trapezius",
      localOffset: new THREE.Vector3(0, 0.1, -0.06),
      localRotation: new THREE.Euler(-0.25, 0, 0),
      baseScale: new THREE.Vector3(0.8, 0.45, 0.35), // INCREASED for visible upper back
      maxFlexScale: new THREE.Vector3(1.0, 0.55, 0.45),
      radius: 0.32, // INCREASED
      length: 0.4, // INCREASED
    },
    {
      name: "RHOMBOID",
      korean: "능형근",
      english: "Rhomboid",
      localOffset: new THREE.Vector3(0, 0.02, -0.08),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.6, 0.45, 0.3), // INCREASED
      maxFlexScale: new THREE.Vector3(0.75, 0.55, 0.4),
      radius: 0.28, // INCREASED
      length: 0.4, // INCREASED
    },
  ],

  // Hips - glutes attach here (INCREASED for visible hip/buttock area)
  hip_L: [
    {
      name: "GLUTE_L",
      korean: "왼쪽둔근",
      english: "Left Glute",
      localOffset: new THREE.Vector3(-0.06, -0.03, -0.1),
      localRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      baseScale: new THREE.Vector3(0.6, 0.55, 0.5), // INCREASED
      maxFlexScale: new THREE.Vector3(0.75, 0.7, 0.6),
      radius: 0.4, // INCREASED
      length: 0.45, // INCREASED
    },
  ],
  hip_R: [
    {
      name: "GLUTE_R",
      korean: "오른쪽둔근",
      english: "Right Glute",
      localOffset: new THREE.Vector3(0.06, -0.03, -0.1),
      localRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      baseScale: new THREE.Vector3(0.6, 0.55, 0.5), // INCREASED
      maxFlexScale: new THREE.Vector3(0.75, 0.7, 0.6),
      radius: 0.4, // INCREASED
      length: 0.45, // INCREASED
    },
  ],

  // Thighs - quads and hamstrings (INCREASED for visible leg mass)
  thigh_L: [
    {
      name: "QUAD_L",
      korean: "왼쪽대퇴사두근",
      english: "Left Quadriceps",
      localOffset: new THREE.Vector3(0, -0.15, 0.05),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.55, 0.8, 0.55), // INCREASED
      maxFlexScale: new THREE.Vector3(0.7, 0.85, 0.7),
      radius: 0.42, // INCREASED
      length: 0.75, // INCREASED
    },
    {
      name: "HAMSTRING_L",
      korean: "왼쪽햄스트링",
      english: "Left Hamstring",
      localOffset: new THREE.Vector3(0, -0.15, -0.05),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.48, 0.75, 0.48), // INCREASED
      maxFlexScale: new THREE.Vector3(0.6, 0.8, 0.6),
      radius: 0.36, // INCREASED
      length: 0.7, // INCREASED
    },
  ],
  thigh_R: [
    {
      name: "QUAD_R",
      korean: "오른쪽대퇴사두근",
      english: "Right Quadriceps",
      localOffset: new THREE.Vector3(0, -0.15, 0.05),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.55, 0.8, 0.55), // INCREASED
      maxFlexScale: new THREE.Vector3(0.7, 0.85, 0.7),
      radius: 0.42, // INCREASED
      length: 0.75, // INCREASED
    },
    {
      name: "HAMSTRING_R",
      korean: "오른쪽햄스트링",
      english: "Right Hamstring",
      localOffset: new THREE.Vector3(0, -0.15, -0.05),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.48, 0.75, 0.48), // INCREASED
      maxFlexScale: new THREE.Vector3(0.6, 0.8, 0.6),
      radius: 0.36, // INCREASED
      length: 0.7, // INCREASED
    },
  ],

  // Shins - calves (INCREASED for visible lower leg)
  shin_L: [
    {
      name: "CALF_L",
      korean: "왼쪽종아리",
      english: "Left Calf",
      localOffset: new THREE.Vector3(0, -0.08, -0.02),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.4, 0.6, 0.4), // INCREASED
      maxFlexScale: new THREE.Vector3(0.5, 0.65, 0.5),
      radius: 0.3, // INCREASED
      length: 0.55, // INCREASED
    },
  ],
  shin_R: [
    {
      name: "CALF_R",
      korean: "오른쪽종아리",
      english: "Right Calf",
      localOffset: new THREE.Vector3(0, -0.08, -0.02),
      localRotation: new THREE.Euler(0, 0, 0),
      baseScale: new THREE.Vector3(0.4, 0.6, 0.4), // INCREASED
      maxFlexScale: new THREE.Vector3(0.5, 0.65, 0.5),
      radius: 0.3, // INCREASED
      length: 0.55, // INCREASED
    },
  ],
};

// Import centralized constants
import {
  MIN_MUSCLE_SCALE,
  MUSCLE_AMPLIFICATION_BASE,
  MUSCLE_AMPLIFICATION_EXPONENT,
  MUSCLE_GEOMETRY_NORMALIZATION,
  REFERENCE_MUSCLE_MASS,
} from "../../../../constants/bodyRenderingConstants";

/**
 * Calculate muscle scale factor based on muscle mass with non-linear amplification.
 *
 * Uses exponential curve to create dramatic visual differences:
 * - 28kg (Hacker) → 0.64 scale (skinny, visible ribs)
 * - 30kg (Amsalja) → 0.78 scale (lean athlete)
 * - 32kg (Jeongbo) → 0.90 scale (fit operative)
 * - 35kg (Musa) → 1.0 scale (reference baseline)
 * - 48kg (Jojik) → 1.91 scale (massive, intimidating)
 *
 * Formula: 1.0 + sign(deviation) * |deviation|^exponent * amplificationBase
 * where deviation = (muscleMass / referenceMass) - 1.0
 *
 * @param muscleMass - Muscle mass in kilograms (archetype range: 28-48kg)
 * @returns Scale factor for muscle geometry
 *
 * @korean 근육크기계산
 */
export const calculateMuscleScaleFactor = (muscleMass: number): number => {
  const massRatio = muscleMass / REFERENCE_MUSCLE_MASS;
  const deviation = massRatio - 1.0;

  // Exponential curve for dramatic differences
  const exponentialDeviation =
    Math.sign(deviation) *
    Math.pow(Math.abs(deviation), MUSCLE_AMPLIFICATION_EXPONENT);

  return Math.max(
    MIN_MUSCLE_SCALE,
    1.0 + exponentialDeviation * MUSCLE_AMPLIFICATION_BASE,
  );
};

/**
 * Calculate fat layer opacity with expanded range for better distinction.
 *
 * Previous: 0.1-0.7 opacity (insufficient contrast)
 * New: 0.05-0.85 opacity (dramatic difference)
 *
 * @param fatMass - Fat mass in kilograms (archetype range: 10-22kg)
 * @returns Opacity value for fat layer (0.05-0.85)
 *
 * @korean 지방층투명도계산
 */
export const calculateFatLayerOpacity = (fatMass: number): number => {
  const minFat = 10; // Amsalja minimum
  const maxFat = 22; // Jojik maximum
  const normalizedFat = (fatMass - minFat) / (maxFat - minFat);

  // Expanded range: 0.05 (lean) to 0.85 (heavy)
  return Math.max(0.05, Math.min(0.85, 0.05 + normalizedFat * 0.8));
};

/**
 * Calculate fat layer thickness with non-linear scaling.
 *
 * Previous: 0.05-0.45 linear
 * New: 0.02-0.60 exponential (skinny = very thin, heavy = very thick)
 *
 * @param fatMass - Fat mass in kilograms (archetype range: 10-22kg)
 * @returns Scale increase for fat layer (0.02-0.60)
 *
 * @korean 지방층두께계산
 */
export const calculateFatLayerThickness = (fatMass: number): number => {
  const minFat = 10;
  const maxFat = 22;
  const normalizedFat = (fatMass - minFat) / (maxFat - minFat);

  // Exponential curve for fat thickness
  const exponentialFat = Math.pow(normalizedFat, 1.5);

  return Math.max(0.02, Math.min(0.6, 0.02 + exponentialFat * 0.58));
};

/**
 * Props for BoneAttachedMuscle component
 *
 * @korean 뼈부착근육속성
 */
export interface BoneAttachedMuscleProps {
  /** Muscle attachment configuration */
  readonly attachment: MuscleAttachment;
  /** Tension level (0-1) for muscle flex */
  readonly tension: number;
  /** Whether muscle is shaking (exhausted state) */
  readonly isShaking: boolean;
  /** Muscle scale factor based on archetype */
  readonly muscleScaleFactor: number;
  /** Fat layer opacity */
  readonly fatLayerOpacity: number;
  /** Fat layer thickness multiplier */
  readonly fatLayerThickness: number;
}

/**
 * Single bone-attached muscle component
 *
 * Renders a muscle mesh that follows its parent bone's transformations.
 * Includes dynamic scaling based on tension and archetype.
 *
 * @korean 뼈부착근육컴포넌트
 */
export const BoneAttachedMuscle: React.FC<BoneAttachedMuscleProps> = ({
  attachment,
  tension,
  isShaking,
  muscleScaleFactor,
  fatLayerOpacity,
  fatLayerThickness,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const fatMeshRef = useRef<THREE.Mesh>(null);

  // Round tension to reduce unnecessary re-renders
  const roundedTension = Math.round(tension * 100) / 100;

  // Calculate current scale based on tension
  const currentScale = useMemo(() => {
    const t = Math.max(0, Math.min(1, roundedTension));
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    return new THREE.Vector3(
      lerp(attachment.baseScale.x, attachment.maxFlexScale.x, t) *
        muscleScaleFactor,
      lerp(attachment.baseScale.y, attachment.maxFlexScale.y, t) *
        muscleScaleFactor,
      lerp(attachment.baseScale.z, attachment.maxFlexScale.z, t) *
        muscleScaleFactor,
    );
  }, [attachment, roundedTension, muscleScaleFactor]);

  // Fat layer scale
  const fatScale = useMemo(() => {
    return new THREE.Vector3(
      currentScale.x * (1 + fatLayerThickness),
      currentScale.y * (1 + fatLayerThickness),
      currentScale.z * (1 + fatLayerThickness),
    );
  }, [currentScale, fatLayerThickness]);

  // Muscle color based on tension and exhaustion
  const muscleColor = useMemo(() => {
    if (isShaking) {
      return KOREAN_COLORS.MUSCLE_EXHAUSTED;
    } else if (roundedTension > 0.7) {
      return KOREAN_COLORS.MUSCLE_FLEXED;
    }
    return KOREAN_COLORS.MUSCLE_TONE;
  }, [roundedTension, isShaking]);

  // Shaking animation at 60fps
  useFrame((state) => {
    if (!meshRef.current) return;

    if (!isShaking) {
      meshRef.current.rotation.z = attachment.localRotation.z;
      return;
    }

    // Shaking frequency: 20Hz
    const shake = Math.sin(state.clock.elapsedTime * 20 * Math.PI * 2) * 0.02;
    meshRef.current.rotation.z = attachment.localRotation.z + shake;
    if (fatMeshRef.current) {
      fatMeshRef.current.rotation.z = attachment.localRotation.z + shake;
    }
  });

  return (
    <group
      position={
        attachment.localOffset
          .toArray()
          .map((v) => v * MUSCLE_GEOMETRY_NORMALIZATION) as [
          number,
          number,
          number,
        ]
      }
      rotation={[attachment.localRotation.x, attachment.localRotation.y, 0]}
    >
      {/* Main muscle mesh */}
      <mesh
        ref={meshRef}
        rotation={[0, 0, attachment.localRotation.z]}
        scale={currentScale.toArray()}
        castShadow
        receiveShadow
        name={`muscle-${attachment.name}`}
      >
        <capsuleGeometry
          args={[
            attachment.radius * MUSCLE_GEOMETRY_NORMALIZATION,
            attachment.length * MUSCLE_GEOMETRY_NORMALIZATION,
            8,
            16,
          ]}
        />
        <meshPhysicalMaterial
          color={muscleColor}
          metalness={0.3}
          roughness={0.7}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Fat layer (only visible when fat mass is significant) */}
      {fatLayerOpacity > 0.05 && (
        <mesh
          ref={fatMeshRef}
          rotation={[0, 0, attachment.localRotation.z]}
          scale={fatScale.toArray()}
          castShadow
          receiveShadow
          name={`fat-layer-${attachment.name}`}
        >
          <capsuleGeometry
            args={[
              attachment.radius * MUSCLE_GEOMETRY_NORMALIZATION,
              attachment.length * MUSCLE_GEOMETRY_NORMALIZATION,
              8,
              16,
            ]}
          />
          <meshStandardMaterial
            color={KOREAN_COLORS.SKIN_TONE}
            metalness={0.05}
            roughness={0.95}
            transparent={true}
            opacity={fatLayerOpacity}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * Props for BoneMuscles component (renders all muscles for a bone)
 *
 * @korean 뼈근육들속성
 */
export interface BoneMusclesProps {
  /** Bone name to look up muscles for */
  readonly boneName: string;
  /** Map of muscle name to tension level */
  readonly muscleStates: Map<string, number>;
  /** Whether character is exhausted (triggers shaking) */
  readonly isExhausted: boolean;
  /** Physical attributes for scaling */
  readonly physicalAttributes?: {
    readonly muscleMass: number;
    readonly fatMass: number;
  };
}

/**
 * Renders all muscles attached to a specific bone
 *
 * Looks up muscle attachments by bone name and renders each one.
 * Muscles inherit the bone's transformations automatically.
 *
 * @korean 뼈근육들컴포넌트
 */
export const BoneMuscles: React.FC<BoneMusclesProps> = ({
  boneName,
  muscleStates,
  isExhausted,
  physicalAttributes,
}) => {
  // Get muscle attachments for this bone
  const attachments = BONE_MUSCLE_MAP[boneName];

  // Calculate scaling factors
  const muscleScaleFactor = useMemo(() => {
    if (!physicalAttributes) return 1.0;
    return calculateMuscleScaleFactor(physicalAttributes.muscleMass);
  }, [physicalAttributes]);

  const fatLayerOpacity = useMemo(() => {
    if (!physicalAttributes) return 0.0;
    return calculateFatLayerOpacity(physicalAttributes.fatMass);
  }, [physicalAttributes]);

  const fatLayerThickness = useMemo(() => {
    if (!physicalAttributes) return 0.0;
    return calculateFatLayerThickness(physicalAttributes.fatMass);
  }, [physicalAttributes]);

  // No muscles for this bone
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <>
      {attachments.map((attachment) => {
        const tension = muscleStates.get(attachment.name) ?? 0;
        const isShaking =
          isExhausted &&
          tension > DEFAULT_MUSCLE_CONFIG.shakingTensionThreshold;

        return (
          <BoneAttachedMuscle
            key={attachment.name}
            attachment={attachment}
            tension={tension}
            isShaking={isShaking}
            muscleScaleFactor={muscleScaleFactor}
            fatLayerOpacity={fatLayerOpacity}
            fatLayerThickness={fatLayerThickness}
          />
        );
      })}
    </>
  );
};

export default BoneMuscles;
