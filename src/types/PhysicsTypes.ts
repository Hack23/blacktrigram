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
 * This conversion should ONLY be used at render time.
 * Internal game logic should always work in meters.
 * 
 * **Korean**: 미터를픽셀로 (Meters To Pixels)
 * 
 * @param positionMeters - Position in meters
 * @param bounds - Arena bounds for conversion
 * @returns Position in pixels for rendering
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
 * Use this when converting user input or initial positions.
 * After conversion, work entirely in meters.
 * 
 * **Korean**: 픽셀을미터로 (Pixels To Meters)
 * 
 * @param pixelPosition - Position in pixels
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
