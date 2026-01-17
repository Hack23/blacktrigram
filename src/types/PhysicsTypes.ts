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

/**
 * Position in 3D space measured in **meters**.
 * 
 * This is the fundamental position type for all physics calculations.
 * Never store positions in pixels internally.
 * 
 * **Korean**: 물리 위치 (Physics Position)
 * 
 * @public
 * @category Physics Types
 */
export interface PhysicsPosition {
  /** X coordinate in meters */
  readonly x: number;
  /** Y coordinate in meters (vertical, usually 0 for ground plane) */
  readonly y: number;
  /** Z coordinate in meters (depth) */
  readonly z: number;
}

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
 * Calculate pixels-per-meter ratio from arena bounds.
 * 
 * This is the fundamental conversion factor between screen space (pixels)
 * and physics space (meters). It varies by device resolution and arena size.
 * 
 * **Korean**: 픽셀당미터비율 (Pixels Per Meter Ratio)
 * 
 * @param bounds - Arena bounds with pixel and meter dimensions
 * @returns Conversion ratio (pixels per meter)
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
 * 
 * @public
 * @category Physics Types
 */
export function metersToPixels(
  positionMeters: PhysicsPosition | THREE.Vector3,
  bounds: PhysicsArenaBounds
): { x: number; y: number } {
  const pixelsPerMeter = getPixelsPerMeter(bounds);
  
  // Handle both PhysicsPosition and THREE.Vector3
  const x = "x" in positionMeters ? positionMeters.x : 0;
  const z = "z" in positionMeters ? positionMeters.z : 0;
  
  return {
    x: x * pixelsPerMeter,
    y: z * pixelsPerMeter, // Z axis maps to screen Y
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
 * 
 * @public
 * @category Physics Types
 */
export function pixelsToMeters(
  pixelPosition: { x: number; y: number },
  bounds: PhysicsArenaBounds
): PhysicsPosition {
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
 * 
 * @public
 * @category Physics Types
 */
export function calculateDistanceMeters(
  pos1: PhysicsPosition | THREE.Vector3,
  pos2: PhysicsPosition | THREE.Vector3
): number {
  const dx = ("x" in pos1 ? pos1.x : 0) - ("x" in pos2 ? pos2.x : 0);
  const dy = ("y" in pos1 ? pos1.y : 0) - ("y" in pos2 ? pos2.y : 0);
  const dz = ("z" in pos1 ? pos1.z : 0) - ("z" in pos2 ? pos2.z : 0);
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
