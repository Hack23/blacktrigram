/**
 * CombatArena3D - Three.js 3D arena environment
 *
 * Renders the 3D combat arena with Korean dojang aesthetic
 * Includes floor, lighting, and atmospheric effects
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Props for the CombatArena3D component.
 * Configures the lighting and atmosphere of the 3D arena.
 */
export interface CombatArena3DProps {
  /** Lighting theme affecting ambiance and colors. Defaults to "cyberpunk" */
  readonly lighting?: "cyberpunk" | "traditional" | "neutral";
}

/**
 * CombatArena3D Component
 * Creates a Korean-themed 3D arena environment
 */
export const CombatArena3D: React.FC<CombatArena3DProps> = ({
  lighting = "cyberpunk",
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Animate grid rotation
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group>
      {/* Lighting based on theme */}
      {lighting === "cyberpunk" && (
        <>
          <ambientLight intensity={0.5} color={KOREAN_COLORS.PRIMARY_CYAN} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            color={KOREAN_COLORS.ACCENT_GOLD}
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

      {/* Arena floor - dojang mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_MEDIUM}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Cyberpunk grid overlay */}
      <gridHelper
        ref={gridRef}
        args={[
          20,
          20,
          KOREAN_COLORS.PRIMARY_CYAN,
          KOREAN_COLORS.UI_BACKGROUND_DARK,
        ]}
        position={[0, 0.01, 0]}
      />

      {/* Korean traditional boundary markers */}
      {[
        [-8, 0, -4],
        [-8, 0, 4],
        [8, 0, -4],
        [8, 0, 4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
          <meshStandardMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Center marker - Yin Yang inspired */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
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
