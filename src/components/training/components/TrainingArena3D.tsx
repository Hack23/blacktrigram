/**
 * TrainingArena3D - 3D training dojang floor
 * 
 * Provides the ground plane for the training area with Korean-themed aesthetics
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../types/constants";

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
  // Create floor texture with Korean pattern
  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      metalness: 0.1,
      roughness: 0.9,
      side: THREE.FrontSide,
    });
  }, []);

  // Grid helper color
  const gridColor = useMemo(() => {
    return new THREE.Color(KOREAN_COLORS.PRIMARY_CYAN);
  }, []);

  return (
    <group>
      {/* Main floor plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size, 1, 1]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Grid lines for depth perception */}
      {showGrid && (
        <gridHelper
          args={[size, 20, gridColor, gridColor]}
          position={[0, 0.01, 0]}
        />
      )}

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
    [halfSize, 0.1, -halfSize],  // Front-right
    [-halfSize, 0.1, halfSize],  // Back-left
    [halfSize, 0.1, halfSize],   // Back-right
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
