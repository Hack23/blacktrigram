/**
 * CombatArena3D - Three.js 3D arena environment
 *
 * Renders the 3D combat arena with Korean dojang aesthetic
 * Includes floor, lighting, and atmospheric effects
 *
 * Enhanced features:
 * - Korean cyberpunk lighting with neon point lights (cyan, gold, blue)
 * - Reflective wet concrete floor with clearcoat and emissive glow
 * - Upgraded shadow quality (2048x2048 shadow maps)
 * - Atmospheric fog with Korean color gradient
 * - Korean signage with emissive neon glow (전투, 흑괘, 급소격)
 * - Optional atmospheric particles (rain/mist)
 */

import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";
import KoreanSignage3D from "./KoreanSignage3D";
import AtmosphericParticles3D from "./AtmosphericParticles3D";

/**
 * Props for the CombatArena3D component.
 * Configures the lighting and atmosphere of the 3D arena.
 */
export interface CombatArena3DProps {
  /** Lighting theme affecting ambiance and colors. Defaults to "cyberpunk" */
  readonly lighting?: "cyberpunk" | "traditional" | "neutral";
  /** Scale factor for arena size (1.0 = desktop, <1.0 = mobile). Defaults to 1.0 */
  readonly scale?: number;
  /** Enable atmospheric particles (rain/mist). Defaults to true on desktop, false on mobile */
  readonly enableParticles?: boolean;
}

// Floor scaling constant for extended arena boundaries
const FLOOR_SCALE_FACTOR = 1.5;

// Shadow map size constants for performance optimization
// Upgraded to 2048x2048 for crisp shadows on desktop
const SHADOW_MAP_SIZE_MOBILE: [number, number] = [1024, 1024]; // Upgraded from 512x512
const SHADOW_MAP_SIZE_DESKTOP: [number, number] = [2048, 2048]; // Upgraded from 1024x1024

/**
 * CombatArena3D Component
 * Creates a Korean-themed 3D arena environment with cyberpunk aesthetic
 */
export const CombatArena3D: React.FC<CombatArena3DProps> = ({
  lighting = "cyberpunk",
  scale = 1.0,
  enableParticles = scale >= 1.0, // Default: enabled on desktop, disabled on mobile
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Animate grid rotation for cyberpunk effect
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

  // Memoized floor material with wet concrete aesthetic and reflections
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x2a2a2a), // Dark concrete
        roughness: 0.3, // Wet/reflective surface
        metalness: 0.1,
        clearcoat: 0.3, // Wet sheen
        clearcoatRoughness: 0.4,
        envMapIntensity: 1.5, // Enhanced reflections from Environment preset
        // Subtle emissive for neon reflection glow
        emissive: new THREE.Color(KOREAN_COLORS.PRIMARY_CYAN),
        emissiveIntensity: 0.05,
      }),
    []
  );

  return (
    <group>
      {/* Lighting based on theme */}
      {lighting === "cyberpunk" && (
        <>
          {/* Environment preset for realistic reflections */}
          <Environment preset="city" />

          {/* Base ambient light with Korean cyan tint */}
          <ambientLight intensity={0.3} color={KOREAN_COLORS.PRIMARY_CYAN} />

          {/* Primary directional light (moonlight) with upgraded shadows */}
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.2}
            color={0xffffff}
            castShadow
            shadow-mapSize={
              scale < 1.0 ? SHADOW_MAP_SIZE_MOBILE : SHADOW_MAP_SIZE_DESKTOP
            }
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0001}
          />

          {/* Korean neon accent lights */}
          {/* Cyan neon light (left side) */}
          <pointLight
            position={[-10, 3, 0]}
            intensity={3}
            distance={20}
            decay={2}
            color={KOREAN_COLORS.PRIMARY_CYAN}
          />

          {/* Gold neon light (right side) */}
          <pointLight
            position={[10, 3, 0]}
            intensity={3}
            distance={20}
            decay={2}
            color={KOREAN_COLORS.ACCENT_GOLD}
          />

          {/* Blue accent light (behind) */}
          <pointLight
            position={[0, 5, -15]}
            intensity={2}
            distance={25}
            decay={2}
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

      {/* Arena floor - dojang mat with reflective wet concrete aesthetic */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry
          args={[floorWidth * FLOOR_SCALE_FACTOR, floorDepth * FLOOR_SCALE_FACTOR]}
        />
        {lighting === "cyberpunk" ? (
          <primitive object={floorMaterial} attach="material" />
        ) : (
          <meshPhysicalMaterial
            color={KOREAN_COLORS.UI_BACKGROUND_MEDIUM}
            roughness={0.7}
            metalness={0.1}
            clearcoat={0}
            clearcoatRoughness={0.2}
          />
        )}
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

      {/* Korean Signage with Emissive Glow */}
      {lighting === "cyberpunk" && <KoreanSignage3D scale={scale} />}

      {/* Atmospheric Particles (rain/mist) */}
      {lighting === "cyberpunk" && enableParticles && (
        <AtmosphericParticles3D
          count={scale >= 1.0 ? 500 : 250} // Fewer particles on mobile
          scale={scale}
          speed={2}
        />
      )}
    </group>
  );
};

export default CombatArena3D;
