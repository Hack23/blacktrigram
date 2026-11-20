/**
 * FootPlacementMarkers3D - 3D markers showing foot placement for footwork drills
 * 
 * Renders visual indicators on the ground to guide footwork training,
 * showing target positions for Korean martial arts footwork patterns.
 * 
 * @module components/screens/training/components/FootPlacementMarkers3D
 * @category Training 3D Components
 * @korean 발위치표시3D컴포넌트
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";
import { getFootworkMarkers, type FootworkDrillPattern } from "../footworkMarkers";

/**
 * Footwork drill pattern types for 3D visualization
 * 
 * Derived from FootworkDrill, excluding "free_practice" (which has no pattern),
 * and adding a "none" sentinel for cases with no active pattern.
 */
export type { FootworkDrillPattern } from "../footworkMarkers";

/**
 * Props for FootPlacementMarkers3D component
 */
export interface FootPlacementMarkers3DProps {
  /** Center position for the pattern */
  readonly centerPosition?: [number, number, number];
  /** Current drill pattern to display */
  readonly pattern: FootworkDrillPattern;
  /** Current step in pattern (0-based) */
  readonly currentStep?: number;
  /** Whether markers are visible */
  readonly visible?: boolean;
  /** Scale factor for markers */
  readonly scale?: number;
  /** Whether to animate markers */
  readonly animated?: boolean;
}

/**
 * Single foot placement marker
 */
const FootMarker: React.FC<{
  position: [number, number, number];
  label: string;
  isActive: boolean;
  animated: boolean;
}> = ({ position, label, isActive, animated }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!animated) return;
    
    if (meshRef.current && isActive) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
    }

    if (ringRef.current && isActive) {
      const ringPulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
      ringRef.current.scale.setScalar(ringPulse);
    }
  });

  const markerColor = isActive
    ? KOREAN_COLORS.PRIMARY_CYAN
    : KOREAN_COLORS.ACCENT_GOLD;

  return (
    <group position={position}>
      {/* Ground circle marker */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial
          color={markerColor}
          transparent
          opacity={isActive ? 0.9 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial
          color={markerColor}
          transparent
          opacity={isActive ? 0.7 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, 0.1, 0]}
        center
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: isActive ? "#00ffff" : "#ffffff",
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
            background: "rgba(0,0,0,0.6)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {label}
        </div>
      </Html>

      {/* Vertical beam for active marker */}
      {isActive && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * FootPlacementMarkers3D Component
 * 
 * Displays 3D foot placement markers on the ground for footwork drills,
 * with Korean martial arts-themed visual feedback.
 * 
 * @korean 발위치표시3D
 */
export const FootPlacementMarkers3D: React.FC<FootPlacementMarkers3DProps> = ({
  centerPosition = [5, 0, 0],
  pattern,
  currentStep = 0,
  visible = true,
  scale = 1.0,
  animated = true,
}) => {
  const positions = useMemo(
    () => getFootworkMarkers(pattern, centerPosition),
    [pattern, centerPosition]
  );

  if (!visible || pattern === "none" || positions.length === 0) {
    return null;
  }

  return (
    <group scale={scale}>
      {positions.map((marker, index) => index >= currentStep && (
        <FootMarker
          key={`${pattern}-${index}`}
          position={marker.position}
          label={marker.label}
          isActive={index === currentStep}
          animated={animated}
        />
      ))}
    </group>
  );
};

export default FootPlacementMarkers3D;
