/**
 * Muscle system component for realistic fighter physiology visualization
 * 
 * Renders dynamic muscle groups that flex and tense during combat techniques.
 * Implements anatomically accurate muscle activation with smooth transitions.
 * 
 * @module components/three/MuscleSystem
 * @category 3D Components
 * @korean 근육시스템컴포넌트
 */

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants";
import type { MuscleGroup, MuscleMeshProps } from "../../types/muscle";
import { DEFAULT_MUSCLE_CONFIG } from "../../types/muscle";

/**
 * Comprehensive muscle group definitions for humanoid character
 * 
 * Positions are relative to character center (spine base).
 * All measurements in Three.js units (approximately meters).
 * 
 * @korean 근육그룹정의
 */
export const MUSCLE_GROUPS: Record<string, MuscleGroup> = {
  // Shoulders - 어깨
  SHOULDER_L: {
    name: "SHOULDER_L",
    korean: "왼쪽어깨",
    english: "Left Shoulder",
    baseScale: new THREE.Vector3(0.15, 0.1, 0.1),
    maxFlexScale: new THREE.Vector3(0.20, 0.13, 0.13), // +33% size
    position: new THREE.Vector3(-0.35, 1.5, 0),
    geometry: new THREE.CapsuleGeometry(0.1, 0.1, 8, 16),
  },
  SHOULDER_R: {
    name: "SHOULDER_R",
    korean: "오른쪽어깨",
    english: "Right Shoulder",
    baseScale: new THREE.Vector3(0.15, 0.1, 0.1),
    maxFlexScale: new THREE.Vector3(0.20, 0.13, 0.13),
    position: new THREE.Vector3(0.35, 1.5, 0),
    geometry: new THREE.CapsuleGeometry(0.1, 0.1, 8, 16),
  },

  // Biceps - 이두근
  BICEP_L: {
    name: "BICEP_L",
    korean: "왼쪽이두근",
    english: "Left Bicep",
    baseScale: new THREE.Vector3(0.09, 0.25, 0.09),
    maxFlexScale: new THREE.Vector3(0.12, 0.25, 0.12), // +33% width
    position: new THREE.Vector3(-0.3, 1.1, 0),
    geometry: new THREE.CapsuleGeometry(0.09, 0.25, 8, 16),
  },
  BICEP_R: {
    name: "BICEP_R",
    korean: "오른쪽이두근",
    english: "Right Bicep",
    baseScale: new THREE.Vector3(0.09, 0.25, 0.09),
    maxFlexScale: new THREE.Vector3(0.12, 0.25, 0.12),
    position: new THREE.Vector3(0.3, 1.1, 0),
    geometry: new THREE.CapsuleGeometry(0.09, 0.25, 8, 16),
  },

  // Triceps - 삼두근
  TRICEP_L: {
    name: "TRICEP_L",
    korean: "왼쪽삼두근",
    english: "Left Tricep",
    baseScale: new THREE.Vector3(0.08, 0.22, 0.08),
    maxFlexScale: new THREE.Vector3(0.10, 0.22, 0.10),
    position: new THREE.Vector3(-0.3, 1.1, -0.05),
    geometry: new THREE.CapsuleGeometry(0.08, 0.22, 8, 16),
  },
  TRICEP_R: {
    name: "TRICEP_R",
    korean: "오른쪽삼두근",
    english: "Right Tricep",
    baseScale: new THREE.Vector3(0.08, 0.22, 0.08),
    maxFlexScale: new THREE.Vector3(0.10, 0.22, 0.10),
    position: new THREE.Vector3(0.3, 1.1, -0.05),
    geometry: new THREE.CapsuleGeometry(0.08, 0.22, 8, 16),
  },

  // Forearms - 전완근
  FOREARM_L: {
    name: "FOREARM_L",
    korean: "왼쪽전완근",
    english: "Left Forearm",
    baseScale: new THREE.Vector3(0.07, 0.20, 0.07),
    maxFlexScale: new THREE.Vector3(0.09, 0.20, 0.09),
    position: new THREE.Vector3(-0.28, 0.7, 0),
    geometry: new THREE.CapsuleGeometry(0.07, 0.20, 8, 16),
  },
  FOREARM_R: {
    name: "FOREARM_R",
    korean: "오른쪽전완근",
    english: "Right Forearm",
    baseScale: new THREE.Vector3(0.07, 0.20, 0.07),
    maxFlexScale: new THREE.Vector3(0.09, 0.20, 0.09),
    position: new THREE.Vector3(0.28, 0.7, 0),
    geometry: new THREE.CapsuleGeometry(0.07, 0.20, 8, 16),
  },

  // Chest - 가슴
  PECTORALS: {
    name: "PECTORALS",
    korean: "대흉근",
    english: "Pectorals",
    baseScale: new THREE.Vector3(0.25, 0.15, 0.10),
    maxFlexScale: new THREE.Vector3(0.33, 0.18, 0.13),
    position: new THREE.Vector3(0, 1.4, 0.08),
    geometry: new THREE.CapsuleGeometry(0.12, 0.15, 8, 16),
  },

  // Core muscles - 복근
  CORE: {
    name: "CORE",
    korean: "코어",
    english: "Core",
    baseScale: new THREE.Vector3(0.20, 0.25, 0.12),
    maxFlexScale: new THREE.Vector3(0.24, 0.30, 0.14),
    position: new THREE.Vector3(0, 1.0, 0.05),
    geometry: new THREE.CapsuleGeometry(0.10, 0.25, 8, 16),
  },

  ABS: {
    name: "ABS",
    korean: "복근",
    english: "Abdominals",
    baseScale: new THREE.Vector3(0.18, 0.20, 0.10),
    maxFlexScale: new THREE.Vector3(0.22, 0.24, 0.12),
    position: new THREE.Vector3(0, 0.9, 0.08),
    geometry: new THREE.CapsuleGeometry(0.09, 0.20, 8, 16),
  },

  OBLIQUES: {
    name: "OBLIQUES",
    korean: "복사근",
    english: "Obliques",
    baseScale: new THREE.Vector3(0.15, 0.18, 0.08),
    maxFlexScale: new THREE.Vector3(0.18, 0.22, 0.10),
    position: new THREE.Vector3(0, 0.95, 0.12),
    geometry: new THREE.CapsuleGeometry(0.08, 0.18, 8, 16),
  },

  // Legs - 다리
  QUAD_L: {
    name: "QUAD_L",
    korean: "왼쪽대퇴사두근",
    english: "Left Quadriceps",
    baseScale: new THREE.Vector3(0.11, 0.35, 0.11),
    maxFlexScale: new THREE.Vector3(0.15, 0.35, 0.15), // +36% width
    position: new THREE.Vector3(-0.15, 0.6, 0),
    geometry: new THREE.CapsuleGeometry(0.11, 0.35, 8, 16),
  },
  QUAD_R: {
    name: "QUAD_R",
    korean: "오른쪽대퇴사두근",
    english: "Right Quadriceps",
    baseScale: new THREE.Vector3(0.11, 0.35, 0.11),
    maxFlexScale: new THREE.Vector3(0.15, 0.35, 0.15),
    position: new THREE.Vector3(0.15, 0.6, 0),
    geometry: new THREE.CapsuleGeometry(0.11, 0.35, 8, 16),
  },

  HAMSTRING_L: {
    name: "HAMSTRING_L",
    korean: "왼쪽햄스트링",
    english: "Left Hamstring",
    baseScale: new THREE.Vector3(0.10, 0.32, 0.10),
    maxFlexScale: new THREE.Vector3(0.13, 0.32, 0.13),
    position: new THREE.Vector3(-0.15, 0.6, -0.05),
    geometry: new THREE.CapsuleGeometry(0.10, 0.32, 8, 16),
  },
  HAMSTRING_R: {
    name: "HAMSTRING_R",
    korean: "오른쪽햄스트링",
    english: "Right Hamstring",
    baseScale: new THREE.Vector3(0.10, 0.32, 0.10),
    maxFlexScale: new THREE.Vector3(0.13, 0.32, 0.13),
    position: new THREE.Vector3(0.15, 0.6, -0.05),
    geometry: new THREE.CapsuleGeometry(0.10, 0.32, 8, 16),
  },

  CALF_L: {
    name: "CALF_L",
    korean: "왼쪽종아리",
    english: "Left Calf",
    baseScale: new THREE.Vector3(0.08, 0.28, 0.08),
    maxFlexScale: new THREE.Vector3(0.10, 0.28, 0.10),
    position: new THREE.Vector3(-0.15, 0.25, -0.02),
    geometry: new THREE.CapsuleGeometry(0.08, 0.28, 8, 16),
  },
  CALF_R: {
    name: "CALF_R",
    korean: "오른쪽종아리",
    english: "Right Calf",
    baseScale: new THREE.Vector3(0.08, 0.28, 0.08),
    maxFlexScale: new THREE.Vector3(0.10, 0.28, 0.10),
    position: new THREE.Vector3(0.15, 0.25, -0.02),
    geometry: new THREE.CapsuleGeometry(0.08, 0.28, 8, 16),
  },

  GLUTE_L: {
    name: "GLUTE_L",
    korean: "왼쪽둔근",
    english: "Left Glute",
    baseScale: new THREE.Vector3(0.12, 0.12, 0.10),
    maxFlexScale: new THREE.Vector3(0.16, 0.14, 0.13),
    position: new THREE.Vector3(-0.12, 0.85, -0.08),
    geometry: new THREE.CapsuleGeometry(0.10, 0.10, 8, 16),
  },
  GLUTE_R: {
    name: "GLUTE_R",
    korean: "오른쪽둔근",
    english: "Right Glute",
    baseScale: new THREE.Vector3(0.12, 0.12, 0.10),
    maxFlexScale: new THREE.Vector3(0.16, 0.14, 0.13),
    position: new THREE.Vector3(0.12, 0.85, -0.08),
    geometry: new THREE.CapsuleGeometry(0.10, 0.10, 8, 16),
  },
} as const;

/**
 * Individual muscle mesh with dynamic tension and shaking effects
 * 
 * Renders a single muscle group with smooth scaling transitions.
 * Applies shaking effect when exhausted (stamina < 20%).
 * 
 * @korean 근육메시컴포넌트
 */
export const MuscleMesh: React.FC<MuscleMeshProps> = ({
  muscleGroup,
  tension,
  isShaking,
  color = KOREAN_COLORS.MUSCLE_TONE,
  metalness = 0.1,
  roughness = 0.9,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Interpolate between base and flexed scale based on tension (0-1)
  const currentScale = useMemo(() => {
    const t = THREE.MathUtils.clamp(tension, 0, 1);
    return new THREE.Vector3(
      THREE.MathUtils.lerp(muscleGroup.baseScale.x, muscleGroup.maxFlexScale.x, t),
      THREE.MathUtils.lerp(muscleGroup.baseScale.y, muscleGroup.maxFlexScale.y, t),
      THREE.MathUtils.lerp(muscleGroup.baseScale.z, muscleGroup.maxFlexScale.z, t)
    );
  }, [muscleGroup, tension]);

  // Muscle color based on tension
  const muscleColor = useMemo(() => {
    if (tension > 0.7) {
      return KOREAN_COLORS.MUSCLE_FLEXED; // Lighter when flexed
    } else if (isShaking) {
      return KOREAN_COLORS.MUSCLE_EXHAUSTED; // Darker when exhausted
    }
    return color;
  }, [tension, isShaking, color]);

  // Shaking effect animation at 60fps
  useFrame((state) => {
    if (!meshRef.current || !isShaking) return;

    // Shaking frequency: 20Hz (as per spec)
    const shake = Math.sin(state.clock.elapsedTime * 20 * Math.PI * 2) * 0.02;
    meshRef.current.rotation.z = shake;
  });

  return (
    <mesh
      ref={meshRef}
      position={muscleGroup.position}
      scale={currentScale}
      castShadow
      receiveShadow
      data-testid={`muscle-${muscleGroup.name}`}
    >
      <primitive object={muscleGroup.geometry} attach="geometry" />
      <meshStandardMaterial
        color={muscleColor}
        metalness={metalness}
        roughness={roughness}
        transparent={false}
      />
    </mesh>
  );
};

/**
 * Complete muscle system rendering all muscle groups
 * 
 * @param muscleStates - Map of muscle group names to tension levels (0-1)
 * @param isExhausted - Whether character is exhausted (triggers shaking)
 * 
 * @korean 전체근육시스템
 */
export interface MuscleSystemProps {
  readonly muscleStates: Map<string, number>;
  readonly isExhausted?: boolean;
}

export const MuscleSystem: React.FC<MuscleSystemProps> = ({
  muscleStates,
  isExhausted = false,
}) => {
  return (
    <group data-testid="muscle-system">
      {Object.entries(MUSCLE_GROUPS).map(([name, muscleGroup]) => {
        const tension = muscleStates.get(name) ?? 0;
        const isShaking = 
          isExhausted && 
          tension > DEFAULT_MUSCLE_CONFIG.shakingTensionThreshold;

        return (
          <MuscleMesh
            key={name}
            muscleGroup={muscleGroup}
            tension={tension}
            isShaking={isShaking}
          />
        );
      })}
    </group>
  );
};

export default MuscleSystem;
