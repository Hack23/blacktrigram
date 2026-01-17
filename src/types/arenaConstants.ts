/**
 * Arena and World Size Constants
 * 
 * Defines the fixed physical dimensions of the game world in meters.
 * These values remain constant across all device sizes - only the
 * pixel-to-meter conversion ratio changes based on screen resolution.
 * 
 * @packageDocumentation
 * @korean 경기장상수
 */

/**
 * Fixed width of the game world in meters.
 * This represents the physical arena size and is independent of screen resolution.
 * 
 * **Korean**: 세계 폭 (미터)
 * 
 * @constant
 * @public
 */
export const WORLD_WIDTH_METERS = 16;

/**
 * Fixed depth of the game world in meters.
 * This represents the physical arena depth and is independent of screen resolution.
 * 
 * **Korean**: 세계 깊이 (미터)
 * 
 * @constant
 * @public
 */
export const WORLD_DEPTH_METERS = 8;

/**
 * Reference arena width in pixels for desktop displays.
 * Used as baseline for calculating arena scale factors.
 * 
 * **Korean**: 기준 경기장 폭 (픽셀)
 * 
 * @constant
 * @public
 */
export const REFERENCE_ARENA_WIDTH_PIXELS = 960;

/**
 * Calculate pixels-per-meter ratio for a given arena width.
 * This is the correct way to convert between pixel space and world space.
 * 
 * @param arenaWidthPixels - Width of the arena in pixels
 * @returns The number of pixels representing one meter
 * 
 * @example
 * ```typescript
 * // Desktop: 960px arena / 16m world = 60 px/m
 * const desktopPxPerM = calculatePixelsPerMeter(960); // 60
 * 
 * // Mobile: 300px arena / 16m world = 18.75 px/m
 * const mobilePxPerM = calculatePixelsPerMeter(300); // 18.75
 * ```
 * 
 * @public
 * @korean 미터당픽셀계산
 */
export function calculatePixelsPerMeter(arenaWidthPixels: number): number {
  return arenaWidthPixels / WORLD_WIDTH_METERS;
}

/**
 * Calculate the arena scale factor relative to the reference desktop size.
 * This is used for scaling 3D rendering elements, not for movement calculations.
 * 
 * @param arenaWidthPixels - Width of the arena in pixels
 * @returns Scale factor (1.0 = desktop reference, <1.0 = smaller, >1.0 = larger)
 * 
 * @example
 * ```typescript
 * const desktopScale = calculateArenaScale(960);  // 1.0
 * const mobileScale = calculateArenaScale(300);   // 0.3125
 * ```
 * 
 * @public
 * @korean 경기장배율계산
 */
export function calculateArenaScale(arenaWidthPixels: number): number {
  return arenaWidthPixels / REFERENCE_ARENA_WIDTH_PIXELS;
}
