/**
 * Shared physics constants for Black Trigram combat system.
 * 
 * **Korean**: 물리 상수
 * 
 * This module provides shared constants for physics calculations across
 * combat and training systems, ensuring consistency in coordinate transformations
 * and unit conversions.
 * 
 * @module types/physicsConstants
 * @category Constants
 * @korean 물리상수
 */

/**
 * Conversion factor from meters to pixels in the combat screen coordinate system.
 * 
 * **Korean**: 미터-픽셀 변환
 * 
 * The combat screen uses a pixel-based coordinate system where approximately
 * 100 pixels equals 1 meter in the game world. This scaling factor is used
 * consistently across:
 * - AI range calculations (useAICombat.ts)
 * - Combat hit detection (CombatSystem.ts)
 * - Movement speed calculations
 * 
 * @example
 * ```typescript
 * // Convert reach from meters to pixels
 * const reachInPixels = reachInMeters * METERS_TO_PIXELS_SCALE;
 * 
 * // Convert distance from pixels to meters
 * const distanceInMeters = distanceInPixels / METERS_TO_PIXELS_SCALE;
 * ```
 * 
 * @public
 * @category Coordinate Constants
 * @korean 미터픽셀비율
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
 * **IMPORTANT**: This differs from combat AI which uses METERS_TO_PIXELS_SCALE.
 * Do not use the combat scaling factor in training without updating this constant
 * and verifying all training hit detection logic.
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
