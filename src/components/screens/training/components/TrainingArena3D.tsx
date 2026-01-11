/**
 * TrainingArena3D - 3D training dojang floor
 *
 * Provides the ground plane for the training area with Korean-themed aesthetics
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Props for TrainingArena3D component
 */
export interface TrainingArena3DProps {
  /** Size of the arena. Defaults to 20 */
  readonly size?: number;
  /** Whether to show grid lines. Defaults to true */
  readonly showGrid?: boolean;
}

/**
 * TrainingArena3D Component
 * Renders the training dojang floor with Korean aesthetic
 */
export const TrainingArena3D: React.FC<TrainingArena3DProps> = ({
  size = 20,
  showGrid = true,
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Animate grid rotation (matching CombatArena3D)
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0002;
    }
  });

  // Create floor texture with Korean pattern
  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      metalness: 0.2,
      roughness: 0.8,
      side: THREE.FrontSide,
    });
  }, []);

  // Cleanup material on unmount
  useEffect(() => {
    return () => {
      floorMaterial.dispose();
    };
  }, [floorMaterial]);

  // Grid helper colors (matching CombatArena3D pattern)
  const gridColor = useMemo(
    () => new THREE.Color(KOREAN_COLORS.PRIMARY_CYAN),
    []
  );
  const gridSecondaryColor = useMemo(
    () => new THREE.Color(KOREAN_COLORS.UI_BACKGROUND_DARK),
    []
  );

  return (
    <group>
      {/* Main floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size, 1, 1]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Cyberpunk grid overlay (animated, matching CombatArena3D) */}
      {showGrid && (
        <gridHelper
          ref={gridRef}
          args={[size, 20, gridColor, gridSecondaryColor]}
          position={[0, 0.01, 0]}
        />
      )}

      {/* Center marker - Yin Yang inspired (matching CombatArena3D) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.ACCENT_GOLD}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner markers for Korean aesthetic */}
      <CornerMarkers size={size} />
    </group>
  );
};

/**
 * Corner markers for Korean dojang aesthetic
 */
const CornerMarkers: React.FC<{ size: number }> = ({ size }) => {
  const halfSize = size / 2 - 0.5;

  const markerPositions: Array<[number, number, number]> = [
    [-halfSize, 0.1, -halfSize], // Front-left
    [halfSize, 0.1, -halfSize], // Front-right
    [-halfSize, 0.1, halfSize], // Back-left
    [halfSize, 0.1, halfSize], // Back-right
  ];

  return (
    <>
      {markerPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 8]} />
          <meshStandardMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}
    </>
  );
};

export default TrainingArena3D;
