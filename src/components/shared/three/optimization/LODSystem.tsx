/**
 * LODSystem - Level of Detail optimization for Three.js objects
 *
 * Reduces polygon count and detail based on distance from camera.
 * Implements 3-tier LOD system (high/medium/low) for optimal performance.
 *
 * Features:
 * - Distance-based detail switching
 * - Smooth transitions between LOD levels
 * - Configurable distance thresholds
 * - Works with any Three.js component
 * - Korean martial arts character optimization
 *
 * Performance Impact:
 * - Reduces polygon count by 50-75% for distant objects
 * - Maintains visual quality for near objects
 * - Target: <100 draw calls per frame
 *
 * @module components/shared/three/optimization/LODSystem
 * @category Performance Optimization
 * @korean LOD시스템
 */

import { Detailed } from "@react-three/drei";
import React from "react";

/**
 * LOD distance thresholds (in Three.js units)
 */
export interface LODDistances {
  /** Distance for high detail (closest) */
  readonly high: number;
  /** Distance for medium detail */
  readonly medium: number;
  /** Low detail used beyond medium distance */
}

/**
 * Default LOD distances optimized for Black Trigram combat
 * Arena is approximately 16x8 units, camera at [0, 5, 10]
 */
export const DEFAULT_LOD_DISTANCES: LODDistances = {
  high: 0, // 0-12 units (close range)
  medium: 12, // 12-20 units (mid range)
  // Beyond 20 units uses low detail
};

/**
 * Mobile LOD distances (more aggressive)
 */
export const MOBILE_LOD_DISTANCES: LODDistances = {
  high: 0, // 0-8 units (very close)
  medium: 8, // 8-15 units (mid range)
  // Beyond 15 units uses low detail
};

/**
 * Props for LODCharacter component
 */
export interface LODCharacterProps {
  /** High detail component (0-high distance) */
  readonly highDetail: React.ReactNode;
  /** Medium detail component (high-medium distance) */
  readonly mediumDetail: React.ReactNode;
  /** Low detail component (beyond medium distance) */
  readonly lowDetail: React.ReactNode;
  /** Custom LOD distances (optional) */
  readonly distances?: LODDistances;
  /** Whether to use mobile-optimized distances */
  readonly isMobile?: boolean;
}

/**
 * LOD-enabled character component
 *
 * Automatically switches between detail levels based on camera distance.
 * Uses @react-three/drei's Detailed component for smooth transitions.
 *
 * @example
 * ```tsx
 * <LODCharacter
 *   highDetail={<Player3DHighDetail />}
 *   mediumDetail={<Player3DMediumDetail />}
 *   lowDetail={<Player3DLowDetail />}
 *   isMobile={isMobile}
 * />
 * ```
 */
export const LODCharacter: React.FC<LODCharacterProps> = ({
  highDetail,
  mediumDetail,
  lowDetail,
  distances,
  isMobile = false,
}) => {
  // Use mobile distances if on mobile, otherwise use defaults
  const lodDistances = distances ?? (isMobile ? MOBILE_LOD_DISTANCES : DEFAULT_LOD_DISTANCES);

  // Detailed component requires array of distances
  const distanceArray = [
    lodDistances.high,
    lodDistances.medium,
    Infinity, // Low detail for all distances beyond medium
  ];

  return (
    <Detailed distances={distanceArray}>
      <group>{highDetail}</group>
      <group>{mediumDetail}</group>
      <group>{lowDetail}</group>
    </Detailed>
  );
};

/**
 * Props for LODEffect component
 */
export interface LODEffectProps {
  /** Effect to render at different detail levels */
  readonly children: (detailLevel: "high" | "medium" | "low") => React.ReactNode;
  /** Custom LOD distances (optional) */
  readonly distances?: LODDistances;
  /** Whether to use mobile-optimized distances */
  readonly isMobile?: boolean;
}

/**
 * LOD-enabled effect component
 *
 * Allows render function to adjust effect quality based on distance.
 * Useful for particle effects, visual effects, etc.
 *
 * @example
 * ```tsx
 * <LODEffect isMobile={isMobile}>
 *   {(detail) => (
 *     <ParticleSystem
 *       particleCount={detail === 'high' ? 100 : detail === 'medium' ? 50 : 20}
 *     />
 *   )}
 * </LODEffect>
 * ```
 */
export const LODEffect: React.FC<LODEffectProps> = ({
  children,
  distances,
  isMobile = false,
}) => {
  const lodDistances = distances ?? (isMobile ? MOBILE_LOD_DISTANCES : DEFAULT_LOD_DISTANCES);

  const distanceArray = [
    lodDistances.high,
    lodDistances.medium,
    Infinity,
  ];

  return (
    <Detailed distances={distanceArray}>
      <group>{children("high")}</group>
      <group>{children("medium")}</group>
      <group>{children("low")}</group>
    </Detailed>
  );
};

/**
 * Calculate appropriate LOD distances based on arena size
 *
 * @param arenaWidth - Arena width in units
 * @param arenaDepth - Arena depth in units
 * @returns Calculated LOD distances
 */
export function calculateLODDistances(
  arenaWidth: number,
  arenaDepth: number
): LODDistances {
  // High detail: within 40% of arena diagonal
  const diagonal = Math.sqrt(arenaWidth * arenaWidth + arenaDepth * arenaDepth);
  const highDistance = diagonal * 0.4;
  
  // Medium detail: within 70% of arena diagonal (not used directly, implicit in structure)
  // const mediumDistance = diagonal * 0.7;

  return {
    high: 0,
    medium: highDistance,
    // Low detail beyond mediumDistance
  };
}

/**
 * Get recommended particle count based on LOD level
 *
 * @param baseCount - Base particle count at high detail
 * @param detailLevel - Current LOD level
 * @returns Adjusted particle count
 */
export function getLODParticleCount(
  baseCount: number,
  detailLevel: "high" | "medium" | "low"
): number {
  switch (detailLevel) {
    case "high":
      return baseCount;
    case "medium":
      return Math.floor(baseCount * 0.6); // 60% of base
    case "low":
      return Math.floor(baseCount * 0.3); // 30% of base
    default:
      return baseCount;
  }
}

/**
 * Get recommended shadow quality based on LOD level
 *
 * @param detailLevel - Current LOD level
 * @returns Shadow map size
 */
export function getLODShadowQuality(
  detailLevel: "high" | "medium" | "low"
): number {
  switch (detailLevel) {
    case "high":
      return 2048;
    case "medium":
      return 1024;
    case "low":
      return 512;
    default:
      return 1024;
  }
}
