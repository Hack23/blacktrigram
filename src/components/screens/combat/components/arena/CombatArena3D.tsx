/**
 * CombatArena3D - Three.js 3D arena environment
 *
 * Renders the 3D combat arena with Korean dojang aesthetic
 * Includes floor, lighting, and atmospheric effects
 */

import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";

/**
 * Props for the CombatArena3D component.
 * Configures the lighting and atmosphere of the 3D arena.
 */
export interface CombatArena3DProps {
  /** Lighting theme affecting ambiance and colors. Defaults to "cyberpunk" */
  readonly lighting?: "cyberpunk" | "traditional" | "neutral";
  /** Scale factor for arena size (1.0 = desktop, <1.0 = mobile). Defaults to 1.0 */
  readonly scale?: number;
}

// Floor scaling constant for extended arena boundaries
const FLOOR_SCALE_FACTOR = 1.5;

// Shadow map size constants for performance optimization
const SHADOW_MAP_SIZE_MOBILE: [number, number] = [512, 512];
const SHADOW_MAP_SIZE_DESKTOP: [number, number] = [1024, 1024];

/**
 * CombatArena3D Component
 * Creates a Korean-themed 3D arena environment
 */
export const CombatArena3D: React.FC<CombatArena3DProps> = ({
  lighting = "cyberpunk",
  scale = 1.0,
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Animate grid rotation
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0002;
    }
  });

  // Scale-aware dimensions for arena elements
  const floorWidth = 20 * scale;
  const floorDepth = 10 * scale;
  const gridSize = 20 * scale;
  const markerDistance = 8 * scale;
  const markerDepth = 4 * scale;

  return (
    <group>
      {/* Lighting based on theme */}
      {lighting === "cyberpunk" && (
        <>
          <Environment preset="city" />
          <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            color={KOREAN_COLORS.ACCENT_GOLD}
            castShadow
            shadow-mapSize={
              scale < 1.0 ? SHADOW_MAP_SIZE_MOBILE : SHADOW_MAP_SIZE_DESKTOP
            }
            shadow-bias={-0.0005}
          />
          <pointLight
            position={[-10, 5, -5]}
            intensity={0.4}
            color={KOREAN_COLORS.ACCENT_BLUE}
          />
        </>
      )}

      {lighting === "traditional" && (
        <>
          <ambientLight intensity={0.6} color={0xffffee} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
        </>
      )}

      {lighting === "neutral" && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        </>
      )}

      {/* Arena floor - dojang mat (scale-aware) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry
          args={[floorWidth * FLOOR_SCALE_FACTOR, floorDepth * FLOOR_SCALE_FACTOR]}
        />
        <meshPhysicalMaterial
          color={
            lighting === "cyberpunk"
              ? KOREAN_COLORS.UI_BACKGROUND_DARK
              : KOREAN_COLORS.UI_BACKGROUND_MEDIUM
          }
          roughness={lighting === "cyberpunk" ? 0.2 : 0.7}
          metalness={lighting === "cyberpunk" ? 0.6 : 0.1}
          clearcoat={lighting === "cyberpunk" ? 0.5 : 0}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Cyberpunk grid overlay (scale-aware) */}
      <gridHelper
        ref={gridRef}
        args={[
          gridSize,
          20,
          KOREAN_COLORS.PRIMARY_CYAN,
          KOREAN_COLORS.UI_BACKGROUND_DARK,
        ]}
        position={[0, 0.01, 0]}
      />

      {/* Korean traditional boundary markers (scale-aware) */}
      {[
        [-markerDistance, 0, -markerDepth],
        [-markerDistance, 0, markerDepth],
        [markerDistance, 0, -markerDepth],
        [markerDistance, 0, markerDepth],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.1 * scale, 0.15 * scale, 0.8, 8]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1.0}
          />
        </mesh>
      ))}

      {/* Center marker - Yin Yang inspired (scale-aware) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.8 * scale, 1.0 * scale, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.ACCENT_GOLD}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmospheric fog */}
      <fog attach="fog" args={[KOREAN_COLORS.UI_BACKGROUND_DARK, 15, 35]} />
    </group>
  );
};

export default CombatArena3D;
