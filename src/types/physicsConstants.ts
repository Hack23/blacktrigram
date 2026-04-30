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
 * Base stamina regeneration rate (stamina per second).
 *
 * **Korean**: 기본 체력 재생 속도
 *
 * This is the base rate at which stamina regenerates when not affected by
 * combat state penalties, breathing disruption, or other modifiers.
 *
 * - Increased from 3 to 15 stamina/second (5x faster) for fluid combat
 * - Allows players to move around and attack frequently without exhaustion
 * - Subject to penalties from breathing disruption (25%-75% reduction)
 * - Subject to combat state penalties (20%-100% reduction when attacking/stunned)
 *
 * @example
 * ```typescript
 * // Calculate stamina regen with breathing disruption
 * const baseRegen = regenRate * BASE_STAMINA_REGEN_RATE;
 * const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
 *   player,
 *   baseRegen
 * );
 * ```
 *
 * @public
 * @category Combat Constants
 * @korean 기본체력재생속도
 */
export const BASE_STAMINA_REGEN_RATE = 15.0 as const;

/**
 * Base movement acceleration rate (m/s²).
 *
 * **Korean**: 기본 이동 가속도
 *
 * This is the base rate at which characters accelerate during movement.
 * Used by both MovementPhysics and SpeedModifierSystem for consistency.
 *
 * - Increased from 12.0 to 30.0 m/s² (2.5x faster) for instant-response combat
 * - Reaches 6 m/s walking speed in 0.2 seconds
 * - Reaches 10 m/s sprint speed in 0.33 seconds
 * - Provides arcade-style responsiveness suitable for Korean martial arts combat
 * - Subject to combat state penalties (20%-100% reduction when attacking/stunned)
 *
 * @example
 * ```typescript
 * // Calculate acceleration with combat state penalty
 * const effectiveAcceleration = BASE_MOVEMENT_ACCELERATION * (1 - statePenalty);
 * const velocityChange = effectiveAcceleration * deltaTime;
 * ```
 *
 * @public
 * @category Physics Constants
 * @korean 기본이동가속도
 */
export const BASE_MOVEMENT_ACCELERATION = 30.0 as const;

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
 * Legacy conversion factor from meters to pixels.
 *
 * **Korean**: 미터-픽셀 변환 인자 (구형)
 *
 * @deprecated Use `bounds.width / bounds.worldWidthMeters` for dynamic conversion.
 * The actual ratio now varies by screen resolution and arena size; this constant
 * is retained for backward compatibility with existing consumers importing
 * `METERS_TO_PIXELS_SCALE` from `blacktrigram/types` and will be removed in a
 * future major release.
 *
 * @public
 * @category Coordinate Constants
 * @korean 미터-픽셀변환 (구형)
 */
export const METERS_TO_PIXELS_SCALE = REFERENCE_PIXELS_PER_METER;

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
 * Default body radius for hit distance calculation (training dummy).
 *
 * **Korean**: 기본몸체반경 (Default Body Radius)
 *
 * When calculating hit distance, we measure center-to-center, but attacks
 * land on the target's body surface, not their center point. This constant
 * represents the default body radius for entities without physical attributes
 * (like training dummies).
 *
 * For player archetypes, use `calculateBodyRadius(physicalAttributes)` from
 * `utils/skeletonScaling.ts` which calculates based on shoulder width.
 *
 * Based on average human proportions:
 * - Average shoulder width: ~45cm
 * - Body depth ratio: 0.5 × shoulderWidth = 22.5cm
 * - Result: ~0.225m (rounded to 0.23m)
 *
 * @example
 * ```typescript
 * // For training dummy (no archetype):
 * const effectiveDistance = centerToCenter - DEFAULT_BODY_RADIUS_METERS;
 *
 * // For player (use archetype):
 * import { calculateBodyRadius } from '@/utils/skeletonScaling';
 * const radius = calculateBodyRadius(physicalAttributes);
 * const effectiveDistance = centerToCenter - radius;
 * ```
 *
 * @public
 * @category Physics Constants
 * @korean 기본몸체반경
 */
export const DEFAULT_BODY_RADIUS_METERS = 0.23 as const;

/**
 * Backwards-compatible alias for the default body radius.
 *
 * **Korean**: 이전호환몸체반경별칭
 *
 * @deprecated Use `DEFAULT_BODY_RADIUS_METERS` or `calculateBodyRadius()` instead.
 * This alias is retained for backward compatibility with existing consumers
 * importing `BODY_RADIUS_METERS` from `blacktrigram/types` and will be removed
 * in a future major release.
 *
 * @public
 * @category Physics Constants
 * @korean 몸체반경별칭
 */
export const BODY_RADIUS_METERS = DEFAULT_BODY_RADIUS_METERS;

/**
 * Standard arena sizes in meters (4:3 aspect ratio).
 *
 * @public
 */
export const ARENA_SIZE_METERS = {
  /** Small screens (< 768px): 6m × 4.5m */
  SMALL: 6,
  /** Medium screens (768-1199px): 8m × 6m */
  MEDIUM: 8,
  /** Large screens (1200-1919px): 10m × 7.5m */
  LARGE: 10,
  /** XLarge screens (1920-2559px): 12m × 9m */
  XLARGE: 12,
  /** Ultra screens (≥ 2560px): 14m × 10.5m */
  ULTRA: 14,
} as const;

/**
 * Combat ranges in METERS for physics-first system.
 *
 * **Korean**: 전투범위미터 (Combat Ranges in Meters)
 *
 * These values define combat distance thresholds for AI decision-making
 * and hit detection. Use these instead of pixel-based COMBAT_RANGES.
 *
 * @public
 */
export const COMBAT_RANGES_METERS = {
  /** Melee range: very close, grappling distance (0.5m) */
  MELEE: 0.5,
  /** Close range: punching/elbow distance (0.8m) */
  CLOSE: 0.8,
  /** Medium range: kicking distance (1.2m) */
  MEDIUM: 1.2,
  /** Long range: max attack distance (2.0m) */
  LONG: 2.0,
  /** Maximum range: engagement distance (3.0m) */
  MAX: 3.0,
} as const;

/**
 * AI movement constants in METERS for physics-first system.
 *
 * **Korean**: AI이동상수미터 (AI Movement Constants in Meters)
 *
 * @public
 */
export const AI_MOVEMENT_METERS = {
  /** Step size for AI movement (0.5m per step) */
  STEP_SIZE: 0.5,
  /** Minimum distance threshold to avoid division by zero */
  MIN_DISTANCE_THRESHOLD: 0.05,
  /** Horizontal arena margin (based on character width ~0.6m) */
  ARENA_MARGIN_X: 0.6,
  /** Vertical arena margin (based on character depth ~1.8m for movement) */
  ARENA_MARGIN_Y: 1.8,
  /** Flanking offset base (0.4m) */
  FLANK_OFFSET_BASE: 0.4,
  /** Flanking offset random range (0.2m) */
  FLANK_OFFSET_RANDOM: 0.2,
} as const;

/**
 * Player starting positions as PERCENTAGES of arena dimensions.
 *
 * **Korean**: 시작위치비율 (Starting Position Ratios)
 *
 * Use these ratios with arena dimensions to calculate starting positions:
 * - playerStartX = arenaX + (arenaWidth * PLAYER_START_POSITIONS.PLAYER1_X)
 *
 * @public
 */
export const PLAYER_START_POSITIONS = {
  /** Player 1 starts at 25% from left edge */
  PLAYER1_X: 0.25,
  /** Player 2 starts at 75% from left edge */
  PLAYER2_X: 0.75,
  /** Both players start at 50% depth (center vertically) */
  CENTER_Y: 0.5,
} as const;

/**
 * AI personality optimal ranges in METERS.
 *
 * **Korean**: AI성격최적범위미터 (AI Personality Optimal Ranges in Meters)
 *
 * @public
 */
export const AI_OPTIMAL_RANGE_METERS = {
  /** Musa - Traditional warrior: close quarters */
  MUSA: 0.5,
  /** Amsalja - Shadow assassin: stealth melee */
  AMSALJA: 0.4,
  /** Hacker - Cyber warrior: mid-range analysis */
  HACKER: 1.2,
  /** Jeongbo Yowon - Intelligence operative: tactical mid-range */
  JEONGBO_YOWON: 0.8,
  /** Jojik Pokryeokbae - Organized crime: brutal close combat */
  JOJIK: 0.6,
} as const;
