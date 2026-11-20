/**
 * CombatArena3D - Three.js 3D arena environment
 *
 * Renders the 3D combat arena with Korean dojang aesthetic
 * Includes floor, lighting, and atmospheric effects
 *
 * Enhanced features:
 * - Neutral key and cyan rim lights for readable fighter silhouettes
 * - Low-gloss dojang floor and a fixed grid
 * - Capped shadow-map resolution when the host enables shadows
 * - Korean signage with emissive neon glow (전투, 흑괘, 급소격)
 * - Optional atmospheric particles (rain/mist)
 */

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";
import AtmosphericParticles3D from "./AtmosphericParticles3D";
import KoreanSignage3D from "./KoreanSignage3D";

/**
 * Props for the CombatArena3D component.
 * Configures the lighting and atmosphere of the 3D arena.
 */
export interface CombatArena3DProps {
  /** Lighting theme affecting ambiance and colors. Defaults to "cyberpunk" */
  readonly lighting?: "cyberpunk" | "traditional" | "neutral";
  /** Scale factor for arena size (1.0 = desktop, <1.0 = mobile). Defaults to 1.0 */
  readonly scale?: number;
  /** Physical arena width in meters. Defaults to 10m (desktop standard) */
  readonly worldWidthMeters?: number;
  /** Physical arena depth in meters. Defaults to worldWidthMeters for square arena */
  readonly worldDepthMeters?: number;
  /** Enable atmospheric particles (rain/mist). Defaults to true on desktop, false on mobile */
  readonly enableParticles?: boolean;
}

const FLOOR_SCALE_FACTOR = 1.5;

const SHADOW_MAP_SIZE_MOBILE: [number, number] = [1024, 1024]; // Upgraded from 512x512
const SHADOW_MAP_SIZE_DESKTOP: [number, number] = [2048, 2048]; // Upgraded from 1024x1024

/**
 * CombatArena3D Component
 * Creates a Korean-themed 3D arena environment with cyberpunk aesthetic
 */
export const CombatArena3D: React.FC<CombatArena3DProps> = ({
  lighting = "cyberpunk",
  scale = 1.0,
  worldWidthMeters = 10, // Default desktop standard
  worldDepthMeters,
  enableParticles = scale >= 1.0, // Enable particles on desktop by default
}) => {
  const effectiveDepth = worldDepthMeters ?? worldWidthMeters;
  const floorWidth = worldWidthMeters * FLOOR_SCALE_FACTOR;
  const floorDepth = effectiveDepth * FLOOR_SCALE_FACTOR;
  const gridSize = worldWidthMeters * FLOOR_SCALE_FACTOR;
  const markerDistance = worldWidthMeters * 0.8;
  const markerDepth = effectiveDepth * 0.4;

  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
      roughness: 0.72,
      metalness: 0.12,
    }),
    [],
  );

  useEffect(() => {
    return () => {
      floorMaterial.dispose();
    };
  }, [floorMaterial]);

  return (
    <group>
      {/* Lighting based on theme */}
      {lighting === "cyberpunk" && (
        <>
          <hemisphereLight args={[KOREAN_COLORS.TEXT_PRIMARY, KOREAN_COLORS.UI_STEEL_GRAY_DARK, 1.65]} />

          {/* Primary directional light (moonlight) with upgraded shadows */}
          <directionalLight
            position={[-5, 6, 4]}
            intensity={2.25}
            color={KOREAN_COLORS.TEXT_PRIMARY}
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

          <directionalLight
            position={[2, 4, -5]}
            intensity={1.65}
            color={KOREAN_COLORS.PRIMARY_CYAN}
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
      {/* Floor dimensions use pre-calculated floorWidth/floorDepth which already include FLOOR_SCALE_FACTOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[floorWidth, floorDepth]} />
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
        args={[
          gridSize,
          20,
          KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
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
          opacity={0.23}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Korean Signage with neon glow */}
      {lighting === "cyberpunk" && <KoreanSignage3D scale={scale} />}

      {/* Atmospheric Particles (rain/mist) */}
      {lighting === "cyberpunk" && enableParticles && (
        <AtmosphericParticles3D
          count={scale >= 1.0 ? 500 : 250}
          scale={scale}
          speed={2}
        />
      )}
    </group>
  );
};

export default CombatArena3D;
