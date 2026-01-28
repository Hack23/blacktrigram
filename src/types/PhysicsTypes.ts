/**
 * Physics-based type definitions for Black Trigram (흑괘)
 * 
 * This module defines physics-first types where all positions, distances,
 * and measurements are in **meters** or **centimeters**, never pixels.
 * Pixel conversions happen ONLY at render time.
 * 
 * @module types/PhysicsTypes
 * @category Type Definitions
 * @korean 물리타입
 */

import * as THREE from "three";
import type { Position3D } from "./physics";

/**
 * Arena bounds with both pixel dimensions (for rendering) and 
 * world dimensions (for physics calculations).
 * 
 * This allows proper conversion between screen space (pixels) and
 * physics space (meters) without fixed constants.
 * 
 * **Korean**: 경기장 경계 (Arena Bounds)
 * 
 * @public
 * @category Physics Types
 */
export interface PhysicsArenaBounds {
  /** X coordinate of arena top-left corner (pixels, for rendering) */
  readonly x: number;
  /** Y coordinate of arena top-left corner (pixels, for rendering) */
  readonly y: number;
  /** Arena width in pixels (for rendering) */
  readonly width: number;
  /** Arena height in pixels (for rendering) */
  readonly height: number;
  /** Arena scale factor (1.0 = desktop, <1.0 = mobile, for 3D scene scaling) */
  readonly scale: number;
  
  /**
   * Physical arena width in meters.
   * 
   * This is the actual size of the combat arena in the game world.
   * Combined with width (pixels), this gives pixels-per-meter ratio:
   * `pixelsPerMeter = width / worldWidthMeters`
   * 
   * Example: Desktop 960px / 10m = 96 px/m, Mobile 300px / 6m = 50 px/m
   */
  readonly worldWidthMeters: number;
  
  /**
   * Physical arena depth in meters.
   * 
   * Typically same as worldWidthMeters for square arenas.
   * For rectangular arenas, may differ.
   * 
   * Example: 10m × 10m square arena
   */
  readonly worldDepthMeters: number;
}

/**
 * Default arena bounds used across visual effect components.
 * 
 * Represents a standard 10m × 7.5m arena at desktop resolution (1200×800px).
 * Components should use this as their default to ensure consistency.
 * 
 * **Korean**: 기본경기장경계 (Default Arena Bounds)
 * 
 * @public
 * @category Physics Types
 */
export const DEFAULT_PHYSICS_ARENA_BOUNDS: PhysicsArenaBounds = {
  x: 0,
  y: 0,
  width: 1200,
  height: 800,
  scale: 1.0,
  worldWidthMeters: 10,
  worldDepthMeters: 7.5,
} as const;

/**
 * Validates if a value is a valid Position3D or THREE.Vector3.
 * 
 * @param pos - Value to check
 * @returns True if valid position with x, y, z properties
 * @internal
 */
function isValidPosition(pos: unknown): pos is Position3D | THREE.Vector3 {
  return (
    pos !== null &&
    pos !== undefined &&
    typeof pos === "object" &&
    "x" in pos &&
    "y" in pos &&
    "z" in pos &&
    typeof (pos as Position3D).x === "number" &&
    typeof (pos as Position3D).y === "number" &&
    typeof (pos as Position3D).z === "number" &&
    Number.isFinite((pos as Position3D).x) &&
    Number.isFinite((pos as Position3D).y) &&
    Number.isFinite((pos as Position3D).z)
  );
}

/**
 * Calculate pixels-per-meter ratio from arena bounds.
 * 
 * This is the fundamental conversion factor between screen space (pixels)
 * and physics space (meters). It varies by device resolution and arena size.
 * 
 * **Korean**: 픽셀당미터비율 (Pixels Per Meter Ratio)
 * 
 * @param bounds - Arena bounds with pixel and meter dimensions
 * @returns Conversion ratio (pixels per meter)
 * @throws Error if worldWidthMeters is not positive
 * 
 * @example
 * ```typescript
 * // Desktop: 960px arena, 10m world
 * const desktopPxPerM = getPixelsPerMeter({ width: 960, worldWidthMeters: 10, ... });
 * // Result: 96 px/m
 * 
 * // Mobile: 300px arena, 6m world  
 * const mobilePxPerM = getPixelsPerMeter({ width: 300, worldWidthMeters: 6, ... });
 * // Result: 50 px/m
 * ```
 * 
 * @public
 * @category Physics Types
 */
export function getPixelsPerMeter(bounds: PhysicsArenaBounds): number {
  if (bounds.worldWidthMeters <= 0) {
    throw new Error(
      `worldWidthMeters must be positive, got: ${bounds.worldWidthMeters}`
    );
  }
  return bounds.width / bounds.worldWidthMeters;
}

/**
 * Convert physics position (meters) to screen position (pixels).
 * 
 * **IMPORTANT**: This function only handles scaling conversion between
 * meters and pixels. It does NOT account for arena position offsets
 * (bounds.x and bounds.y). Callers must add these offsets separately
 * when rendering to screen.
 * 
 * Example:
 * ```typescript
 * const pixelPos = metersToPixels(physicsPos, bounds);
 * const screenX = bounds.x + pixelPos.x;  // Add arena offset
 * const screenY = bounds.y + pixelPos.y;  // Add arena offset
 * ```
 * 
 * This conversion should ONLY be used at render time.
 * Internal game logic should always work in meters.
 * 
 * **Korean**: 미터를픽셀로 (Meters To Pixels)
 * 
 * @param positionMeters - Position in meters
 * @param bounds - Arena bounds for conversion
 * @returns Position in pixels RELATIVE to arena origin (add bounds.x/y for screen position)
 * @throws Error if position is invalid
 * 
 * @public
 * @category Physics Types
 */
export function metersToPixels(
  positionMeters: Position3D | THREE.Vector3,
  bounds: PhysicsArenaBounds
): { x: number; y: number } {
  if (!isValidPosition(positionMeters)) {
    throw new Error(
      "Invalid position: must be Vector3 or Position3D with numeric x, y, z properties"
    );
  }
  
  const pixelsPerMeter = getPixelsPerMeter(bounds);
  
  return {
    x: positionMeters.x * pixelsPerMeter,
    y: positionMeters.z * pixelsPerMeter, // Z axis maps to screen Y
  };
}

/**
 * Convert screen position (pixels) to physics position (meters).
 * 
 * **IMPORTANT**: This function only handles scaling conversion between
 * pixels and meters. If you're converting from screen coordinates, you
 * must first subtract arena position offsets (bounds.x and bounds.y).
 * 
 * Example:
 * ```typescript
 * const arenaRelativeX = screenX - bounds.x;  // Remove arena offset
 * const arenaRelativeY = screenY - bounds.y;  // Remove arena offset
 * const physicsPos = pixelsToMeters({ x: arenaRelativeX, y: arenaRelativeY }, bounds);
 * ```
 * 
 * Use this when converting user input or initial positions.
 * After conversion, work entirely in meters.
 * 
 * **Korean**: 픽셀을미터로 (Pixels To Meters)
 * 
 * @param pixelPosition - Position in pixels RELATIVE to arena origin (subtract bounds.x/y first)
 * @param bounds - Arena bounds for conversion
 * @returns Position in meters
 * @throws Error if pixel coordinates are not finite numbers
 * 
 * @public
 * @category Physics Types
 */
export function pixelsToMeters(
  pixelPosition: { x: number; y: number },
  bounds: PhysicsArenaBounds
): Position3D {
  if (!Number.isFinite(pixelPosition.x) || !Number.isFinite(pixelPosition.y)) {
    throw new Error(
      `Invalid pixel coordinates: x=${pixelPosition.x}, y=${pixelPosition.y}`
    );
  }
  
  const pixelsPerMeter = getPixelsPerMeter(bounds);
  
  return {
    x: pixelPosition.x / pixelsPerMeter,
    y: 0, // Ground plane
    z: pixelPosition.y / pixelsPerMeter, // Screen Y maps to Z axis
  };
}

/**
 * Calculate distance between two positions in meters.
 * 
 * This is the correct way to calculate distance - always in meters,
 * never in pixels.
 * 
 * **Korean**: 거리계산 (Distance Calculation)
 * 
 * @param pos1 - First position in meters
 * @param pos2 - Second position in meters
 * @returns Distance in meters
 * @throws Error if either position is invalid
 * 
 * @public
 * @category Physics Types
 */
export function calculateDistanceMeters(
  pos1: Position3D | THREE.Vector3,
  pos2: Position3D | THREE.Vector3
): number {
  if (!isValidPosition(pos1) || !isValidPosition(pos2)) {
    throw new Error(
      "Invalid positions for distance calculation: both positions must be valid Vector3 or Position3D objects"
    );
  }
  
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Arena bounds for physics calculations in meters.
 * 
 * Defines the playable area boundaries for player/AI movement.
 * All arenas are centered at origin (0, 0) and extend symmetrically.
 * 
 * **Korean**: 경기장 경계 (Arena Bounds)
 * 
 * @public
 * @category Physics Types
 */
export interface ArenaBounds {
  /** Minimum X position in meters (left edge) */
  readonly minX: number;
  /** Maximum X position in meters (right edge) */
  readonly maxX: number;
  /** Minimum Z position in meters (back edge) */
  readonly minZ: number;
  /** Maximum Z position in meters (front edge) */
  readonly maxZ: number;
  /** Arena center X in meters (typically 0) */
  readonly centerX: number;
  /** Arena center Z in meters (typically 0) */
  readonly centerZ: number;
  /** Arena width in meters */
  readonly widthMeters: number;
  /** Arena depth in meters */
  readonly depthMeters: number;
}

/**
 * Calculate arena bounds from arena configuration.
 * 
 * Creates bounds with a margin to account for character radius,
 * preventing characters from walking through edges.
 * 
 * **Korean**: 경기장 경계 계산 (Calculate Arena Bounds)
 * 
 * @param bounds - Arena configuration with meter dimensions
 * @param margin - Character radius/margin in meters (default: 0.3m - half character width)
 * @returns Arena bounds for physics calculations
 * 
 * @example
 * ```typescript
 * const config = { worldWidthMeters: 10, worldDepthMeters: 7.5, ... };
 * const arenaBounds = calculateArenaBounds(config, 0.3);
 * // Result: { minX: -4.7, maxX: 4.7, minZ: -3.45, maxZ: 3.45, ... }
 * ```
 * 
 * @public
 * @category Physics Types
 */
export function calculateArenaBounds(
  bounds: PhysicsArenaBounds,
  margin: number = 0.3
): ArenaBounds {
  const halfWidth = bounds.worldWidthMeters / 2;
  const halfDepth = bounds.worldDepthMeters / 2;
  
  return {
    minX: -halfWidth + margin,
    maxX: halfWidth - margin,
    minZ: -halfDepth + margin,
    maxZ: halfDepth - margin,
    centerX: 0,
    centerZ: 0,
    widthMeters: bounds.worldWidthMeters,
    depthMeters: bounds.worldDepthMeters,
  };
}

/**
 * Clamp a 3D position to stay within arena boundaries.
 * 
 * Only clamps X and Z axes (horizontal plane). Y axis (height) is unchanged.
 * Arena is centered at origin with bounds extending ±width/2 and ±depth/2.
 * 
 * **Korean**: 위치를 경기장 경계로 제한 (Clamp Position To Bounds)
 * 
 * @param position - 3D position in meters (THREE.Vector3 or Position3D)
 * @param bounds - Arena bounds with min/max values
 * @returns Clamped position as new THREE.Vector3
 * 
 * @example
 * ```typescript
 * const position = new THREE.Vector3(6, 0, 4); // Outside bounds
 * const bounds = calculateArenaBounds(config);
 * const clamped = clampPositionToBounds(position, bounds);
 * // Result: Vector3(4.7, 0, 3.45) - clamped to edges
 * ```
 * 
 * @public
 * @category Physics Types
 */
export function clampPositionToBounds(
  position: THREE.Vector3 | Position3D,
  bounds: ArenaBounds
): THREE.Vector3 {
  return new THREE.Vector3(
    Math.max(bounds.minX, Math.min(bounds.maxX, position.x)),
    position.y, // Y is height, not bounds-checked
    Math.max(bounds.minZ, Math.min(bounds.maxZ, position.z))
  );
}

/**
 * Check if a position is within arena boundaries.
 * 
 * Only checks X and Z axes (horizontal plane). Y axis (height) is ignored.
 * 
 * **Korean**: 경기장 경계 내 위치 확인 (Check Position In Bounds)
 * 
 * @param position - Position to check (2D {x,z} or 3D Vector3/Position3D)
 * @param bounds - Arena bounds
 * @returns True if position is within bounds
 * 
 * @example
 * ```typescript
 * const position = { x: 5, z: 2 };
 * const bounds = calculateArenaBounds(config);
 * const inBounds = isPositionInBounds(position, bounds);
 * // Result: true if within bounds, false otherwise
 * ```
 * 
 * @public
 * @category Physics Types
 */
export function isPositionInBounds(
  position: { x: number; z: number } | THREE.Vector3 | Position3D,
  bounds: ArenaBounds
): boolean {
  const x = position.x;
  const z = 'z' in position ? position.z : 0;
  
  return (
    x >= bounds.minX &&
    x <= bounds.maxX &&
    z >= bounds.minZ &&
    z <= bounds.maxZ
  );
}

/**
 * Clamp a 2D position to stay within arena boundaries in meters.
 * 
 * This function works in a projected 2D arena space where:
 * - `position.x` corresponds to world **X** (horizontal)
 * - `position.y` corresponds to world **Z** (depth)
 * 
 * Arena coordinates are centered at origin (0, 0) and extend from
 * -worldWidthMeters/2 to +worldWidthMeters/2 in X (position.x),
 * -worldDepthMeters/2 to +worldDepthMeters/2 in Z/depth (position.y).
 * 
 * This is used for physics calculations like knockback to ensure
 * players stay within the playable area.
 * 
 * @param position - 2D projected position in meters (X, depth-as-Y), which may exceed arena bounds
 * @param bounds - Arena bounds with meter dimensions
 * @returns Position clamped to arena boundaries in the same 2D projection
 * 
 * @example
 * ```typescript
 * const bounds = { worldWidthMeters: 10, worldDepthMeters: 7.5, ... };
 * const position = { x: 6, y: 4 }; // Outside arena in X/Z-projected space
 * const clamped = clampToArenaBounds(position, bounds);
 * // Result: { x: 5, y: 3.75 } - clamped to boundaries
 * ```
 * 
 * @public
 * @category Physics Types
 */
export function clampToArenaBounds(
  position: { x: number; y: number },
  bounds: PhysicsArenaBounds
): { x: number; y: number } {
  const halfWidth = bounds.worldWidthMeters / 2;
  const halfDepth = bounds.worldDepthMeters / 2;
  
  return {
    x: Math.max(-halfWidth, Math.min(halfWidth, position.x)),
    y: Math.max(-halfDepth, Math.min(halfDepth, position.y)),
  };
}
