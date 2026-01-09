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

/**
 * Footwork drill pattern types
 */
export type FootworkDrillPattern = 
  | "circular_left"
  | "circular_right"
  | "pivot_combo"
  | "triangle_step"
  | "slide_drill"
  | "shuffle_practice"
  | "none";

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
 * Generate footwork pattern positions
 * 
 * @korean 보법패턴위치생성
 */
function getPatternPositions(
  pattern: FootworkDrillPattern,
  center: [number, number, number]
): Array<{ position: [number, number, number]; label: string }> {
  const [cx, cy, cz] = center;
  const radius = 2.0; // 2 meters radius for circular patterns
  const stepDist = 0.3; // 30cm step distance

  switch (pattern) {
    case "circular_left":
      // 4 positions in a circle (left rotation)
      return [
        { position: [cx + radius, cy, cz], label: "1" },
        { position: [cx, cy, cz - radius], label: "2" },
        { position: [cx - radius, cy, cz], label: "3" },
        { position: [cx, cy, cz + radius], label: "4" },
      ];

    case "circular_right":
      // 4 positions in a circle (right rotation)
      return [
        { position: [cx + radius, cy, cz], label: "1" },
        { position: [cx, cy, cz + radius], label: "2" },
        { position: [cx - radius, cy, cz], label: "3" },
        { position: [cx, cy, cz - radius], label: "4" },
      ];

    case "pivot_combo":
      // Pivot left and right positions
      return [
        { position: [cx, cy, cz], label: "Start" },
        { position: [cx - 0.5, cy, cz + 0.5], label: "Pivot L" },
        { position: [cx, cy, cz], label: "Center" },
        { position: [cx + 0.5, cy, cz + 0.5], label: "Pivot R" },
      ];

    case "triangle_step":
      // Triangle stepping pattern
      return [
        { position: [cx, cy, cz], label: "Start" },
        { position: [cx, cy, cz - stepDist * 2], label: "Forward" },
        { position: [cx + stepDist * 1.5, cy, cz], label: "Right" },
        { position: [cx, cy, cz], label: "Back" },
      ];

    case "slide_drill":
      // Four-direction slide pattern (cross shape)
      return [
        { position: [cx, cy, cz], label: "Center" },
        { position: [cx, cy, cz - stepDist], label: "Forward" },
        { position: [cx + stepDist, cy, cz], label: "Right" },
        { position: [cx, cy, cz + stepDist], label: "Back" },
        { position: [cx - stepDist, cy, cz], label: "Left" },
      ];

    case "shuffle_practice":
      // Quick forward shuffles
      return [
        { position: [cx, cy, cz], label: "Start" },
        { position: [cx, cy, cz - 0.15], label: "Shuffle 1" },
        { position: [cx, cy, cz - 0.30], label: "Shuffle 2" },
        { position: [cx, cy, cz - 0.45], label: "Shuffle 3" },
      ];

    case "none":
    default:
      return [];
  }
}

/**
 * Single foot placement marker
 */
const FootMarker: React.FC<{
  position: [number, number, number];
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  animated: boolean;
}> = ({ position, label, isActive, isCompleted, animated }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Pulsing animation for active marker
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

  const markerColor = isCompleted
    ? KOREAN_COLORS.ACCENT_GREEN
    : isActive
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
    () => getPatternPositions(pattern, centerPosition),
    [pattern, centerPosition]
  );

  if (!visible || pattern === "none" || positions.length === 0) {
    return null;
  }

  return (
    <group scale={scale}>
      {positions.map((marker, index) => (
        <FootMarker
          key={`${pattern}-${index}`}
          position={marker.position}
          label={marker.label}
          isActive={index === currentStep}
          isCompleted={index < currentStep}
          animated={animated}
        />
      ))}
    </group>
  );
};

export default FootPlacementMarkers3D;
