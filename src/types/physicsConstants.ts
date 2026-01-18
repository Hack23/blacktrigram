/**
 * Shared physics constants for Black Trigram combat system.
 *
 * **Korean**: 물리 상수
 *
 * This module provides shared constants for physics calculations across
 * combat and training systems, ensuring consistency in coordinate transformations
 * and unit conversions.
 *
 * ## Physics-First Architecture
 *
 * The game uses a physics-first coordinate system where:
 * - All internal calculations use meters (m) and meters/second (m/s)
 * - Arena sizes are determined by screen resolution (6m, 8m, 10m, 12m, 14m)
 * - Pixel conversion happens only at render time
 * - The pixels-per-meter ratio varies by device/resolution
 *
 * @module types/physicsConstants
 * @category Constants
 * @korean 물리상수
 */

/**
 * Reference pixels-per-meter ratio for scale calculations.
 *
 * **Korean**: 참조 미터-픽셀 변환
 *
 * This is the REFERENCE ratio used for calculating scale factors.
 * The actual pixels-per-meter varies by device resolution:
 * - Calculate actual ratio: `arenaWidthPixels / arenaWidthMeters`
 * - Calculate scale: `actualRatio / REFERENCE_PIXELS_PER_METER`
 *
 * **Do NOT use this for direct coordinate conversion.**
 * Use `bounds.width / bounds.worldWidthMeters` instead.
 *
 * @example
 * ```typescript
 * // Calculate actual pixels per meter from arena bounds
 * const actualPixelsPerMeter = bounds.width / bounds.worldWidthMeters;
 *
 * // Calculate scale relative to reference
 * const scale = actualPixelsPerMeter / REFERENCE_PIXELS_PER_METER;
 * ```
 *
 * @public
 * @category Coordinate Constants
 * @korean 참조픽셀미터비율
 */
export const REFERENCE_PIXELS_PER_METER = 100 as const;

/**
 * @deprecated Use `bounds.width / bounds.worldWidthMeters` for dynamic conversion.
 * This constant is kept for backward compatibility only.
 *
 * Legacy conversion factor from meters to pixels. The actual ratio now varies
 * by screen resolution and arena size.
 */
export const METERS_TO_PIXELS_SCALE = 100 as const;

/**
 * Conversion factor from meters to training scene units.
 *
 * **Korean**: 미터-훈련 단위 변환
 *
 * Training scenes are authored in real-world meters and use a 1:1 conversion
 * ratio. This means 1 meter in the game world equals 1 unit in the training
 * scene coordinate system.
 *
 * **IMPORTANT**: This differs from combat AI which uses dynamic pixels-per-meter.
 * The 3D world uses 1:1 meter scale for consistent physics.
 *
 * @example
 * ```typescript
 * // Convert reach from meters to training units (1:1)
 * const reachInUnits = reachInMeters * METERS_TO_TRAINING_UNITS;
 * ```
 *
 * @public
 * @category Coordinate Constants
 * @korean 미터훈련비율
 */
export const METERS_TO_TRAINING_UNITS = 1.0 as const;

/**
 * Standard arena sizes in meters (all square).
 *
 * @public
 */
export const ARENA_SIZE_METERS = {
  /** Small screens (< 768px): 6m × 6m */
  SMALL: 6,
  /** Medium screens (768-1199px): 8m × 8m */
  MEDIUM: 8,
  /** Large screens (1200-1919px): 10m × 10m */
  LARGE: 10,
  /** XLarge screens (1920-2559px): 12m × 12m */
  XLARGE: 12,
  /** Ultra screens (≥ 2560px): 14m × 14m */
  ULTRA: 14,
} as const;
