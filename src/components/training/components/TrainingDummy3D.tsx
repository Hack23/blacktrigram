/**
 * TrainingDummy3D - 3D training dummy with vital points
 * 
 * Provides anatomically accurate training dummy with 70 vital points
 * for Korean martial arts practice
 */

import { useFrame } from "@react-three/fiber";
import React, { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_VITAL_POINTS } from "../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPoint } from "../../../systems/vitalpoint/types";
import { VitalPointSeverity } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Props for TrainingDummy3D component
 */
export interface TrainingDummy3DProps {
  /** 3D world position of the dummy */
  readonly position: [number, number, number];
  /** Currently selected vital point for targeting */
  readonly selectedVitalPoint: string | null;
  /** Whether training is active */
  readonly isTraining: boolean;
  /** Callback when dummy is hit */
  readonly onHit: (vitalPointId: string, accuracy: number) => boolean;
}

/**
 * Get color based on vital point severity
 */
const getSeverityColor = (severity: VitalPointSeverity): number => {
  switch (severity) {
    case VitalPointSeverity.MINOR:
      return KOREAN_COLORS.POSITIVE_GREEN;
    case VitalPointSeverity.MODERATE:
      return KOREAN_COLORS.WARNING_YELLOW;
    case VitalPointSeverity.MAJOR:
      return KOREAN_COLORS.ACCENT_GOLD;
    case VitalPointSeverity.CRITICAL:
      return KOREAN_COLORS.ACCENT_RED;
    default:
      return KOREAN_COLORS.TEXT_SECONDARY;
  }
};

/**
 * Map body region to 3D position on dummy
 */
const getVitalPointPosition = (point: VitalPoint): [number, number, number] => {
  const category = point.category;
  
  // Base positions (relative to dummy center) based on category
  const positions: Record<string, [number, number, number]> = {
    head: [0, 1.6, 0],
    neck: [0, 1.4, 0.1],
    torso: [0, 1.0, 0.15],
    chest: [0, 1.0, 0.15],
    abdomen: [0, 0.6, 0.15],
    back: [0, 1.0, -0.15],
    arm: [-0.35, 1.0, 0],
    leg: [-0.2, 0.3, 0],
  };

  // Get base position or default to center
  const basePos = positions[category] ?? [0, 1.0, 0];
  
  // Add some randomization for multiple points in same region
  const offset = point.id.charCodeAt(0) * 0.001;
  return [
    basePos[0] + Math.sin(offset) * 0.1,
    basePos[1] + Math.cos(offset) * 0.1,
    basePos[2],
  ];
};

/**
 * Single vital point marker component
 */
const VitalPointMarker: React.FC<{
  point: VitalPoint;
  isSelected: boolean;
  isTraining: boolean;
  onClick: (pointId: string) => void;
}> = ({ point, isSelected, isTraining, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate selected and hovered markers
  useFrame((state) => {
    if (!meshRef.current) return;

    if (isSelected || hovered) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const position = useMemo(() => getVitalPointPosition(point), [point]);
  const color = useMemo(() => getSeverityColor(point.severity), [point.severity]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => isTraining && onClick(point.id)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={isSelected ? KOREAN_COLORS.ACCENT_GOLD : color}
        emissive={isSelected ? KOREAN_COLORS.ACCENT_GOLD : color}
        emissiveIntensity={isSelected ? 0.6 : hovered ? 0.4 : 0.2}
        metalness={0.5}
        roughness={0.3}
        transparent
        opacity={isTraining ? 0.9 : 0.5}
      />
    </mesh>
  );
};

/**
 * TrainingDummy3D Component
 * Main training dummy with body and vital points
 */
export const TrainingDummy3D: React.FC<TrainingDummy3DProps> = ({
  position,
  selectedVitalPoint,
  isTraining,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Use first 12 vital points for training (full 70 would be overwhelming)
  const vitalPoints = useMemo(
    () => KOREAN_VITAL_POINTS.slice(0, 12),
    []
  );

  // Breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const breathScale = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathScale;
  });

  // Handle vital point selection
  const handlePointClick = useCallback(
    (_pointId: string) => {
      // This is just for selection - actual hit happens from player attack
      // The selection helps with targeting
    },
    []
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_LIGHT}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 16, 32]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_LIGHT}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.4, 1.0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_LIGHT}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.4, 1.0, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_LIGHT}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.2, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_LIGHT}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.2, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_LIGHT}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Stance indicator ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.8, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vital point markers */}
      {vitalPoints.map((point) => (
        <VitalPointMarker
          key={point.id}
          point={point}
          isSelected={point.id === selectedVitalPoint}
          isTraining={isTraining}
          onClick={handlePointClick}
        />
      ))}
    </group>
  );
};

export default TrainingDummy3D;
