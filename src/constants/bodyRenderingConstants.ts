/**
 * Centralized body rendering constants for Black Trigram.
 *
 * **Korean**: 신체 렌더링 상수 (Body Rendering Constants)
 *
 * This module consolidates all constants related to character body rendering,
 * including bone thickness, muscle scaling, and visual amplification factors.
 * Having them centralized makes it easier to tune the visual appearance.
 *
 * ## Design Philosophy
 *
 * - All values are tuned for realistic Korean martial arts fighter proportions
 * - Constants are grouped by system (bones, muscles, clothing, etc.)
 * - Amplification is kept minimal for anatomical accuracy
 *
 * @module constants/bodyRenderingConstants
 * @category Rendering
 * @korean 신체렌더링상수
 */

// ============================================================================
// BONE RENDERING CONSTANTS (뼈 렌더링)
// ============================================================================

/**
 * Base bone radius as fraction of bone length.
 *
 * Anatomically, limb bones have diameter roughly 8-12% of their length.
 * Using 0.10 for realistic slim proportions - athletic fighter build.
 * Reduced from 0.16 which was too puffy/bubble-like.
 *
 * @korean 기본뼈반지름비율
 */
export const BASE_BONE_RADIUS_RATIO = 0.1;

/**
 * Minimum bone thickness multiplier.
 *
 * Ensures even lean archetypes maintain visible body mass.
 * Using 0.75 for lean athletic appearance.
 *
 * @korean 최소뼈두께배수
 */
export const MIN_BONE_THICKNESS_MULTIPLIER = 0.75;

/**
 * Maximum bone thickness multiplier.
 *
 * Prevents overly bulky appearance for high muscle mass archetypes.
 *
 * @korean 최대뼈두께배수
 */
export const MAX_BONE_THICKNESS_MULTIPLIER = 1.3;

/**
 * Visual amplification for bone thickness differences.
 *
 * Amplifies the visual difference between lean and muscular archetypes.
 * Lower values = more subtle differences, higher = more dramatic.
 *
 * @korean 뼈두께시각적증폭
 */
export const BONE_THICKNESS_AMPLIFICATION = 1.5;

/**
 * Reference muscle mass for bone thickness calculation (kg).
 *
 * @korean 기준근육량
 */
export const REFERENCE_MUSCLE_MASS = 35;

/**
 * Reference fat mass for bone thickness calculation (kg).
 *
 * @korean 기준지방량
 */
export const REFERENCE_FAT_MASS = 12;

/**
 * Muscle contribution percentage to bone thickness.
 *
 * @korean 근육기여율
 */
export const MUSCLE_THICKNESS_CONTRIBUTION = 0.7;

/**
 * Fat contribution percentage to bone thickness.
 *
 * @korean 지방기여율
 */
export const FAT_THICKNESS_CONTRIBUTION = 0.3;

// ============================================================================
// MUSCLE RENDERING CONSTANTS (근육 렌더링)
// ============================================================================

/**
 * Muscle geometry normalization factor.
 *
 * Converts legacy large muscle values to anatomically correct meter scale.
 * Using 0.35 for realistic athletic proportions - not inflated.
 * Reduced from 0.55 which was still too puffy.
 *
 * @korean 근육정규화계수
 */
export const MUSCLE_GEOMETRY_NORMALIZATION = 0.35;

/**
 * Base muscle amplification factor for visual differences.
 *
 * Amplifies muscle size differences between archetypes.
 *
 * @korean 근육증폭기본계수
 */
export const MUSCLE_AMPLIFICATION_BASE = 4.0;

/**
 * Exponent for muscle scaling curve.
 *
 * Creates non-linear scaling for dramatic visual differences.
 * Higher = more extreme differences between low and high muscle mass.
 *
 * @korean 근육증폭지수
 */
export const MUSCLE_AMPLIFICATION_EXPONENT = 1.5;

/**
 * Minimum muscle scale factor.
 *
 * Prevents muscles from becoming invisible on lean archetypes.
 * Using 0.45 for lean athletic fighters like kickboxers.
 *
 * @korean 최소근육크기
 */
export const MIN_MUSCLE_SCALE = 0.45;

/**
 * Muscle contraction intensity during combat.
 *
 * How much muscles visually contract during attacks/blocks.
 *
 * @korean 근육수축강도
 */
export const MUSCLE_CONTRACTION_INTENSITY = 0.15;

// ============================================================================
// SKELETON SCALING CONSTANTS (골격 스케일링)
// ============================================================================

/**
 * Visual amplification for archetype dimension differences.
 *
 * Raw physical attribute differences are subtle (2-12%).
 * This factor amplifies them for more visible silhouettes.
 *
 * @korean 시각적증폭계수
 */
export const VISUAL_AMPLIFICATION_FACTOR = 1.2;

/**
 * Height scaling amplification (kept subtle for realism).
 *
 * @korean 키증폭계수
 */
export const HEIGHT_AMPLIFICATION = 1.5;

/**
 * Shoulder width amplification for silhouette distinction.
 *
 * @korean 어깨증폭계수
 */
export const SHOULDER_AMPLIFICATION = 1.15;

// ============================================================================
// REFERENCE PHYSICAL ATTRIBUTES (기준 신체 속성)
// ============================================================================

/**
 * Reference Korean male fighter attributes.
 *
 * Used as baseline for all scaling calculations.
 *
 * @korean 기준신체속성
 */
export const REFERENCE_ATTRIBUTES = {
  weight: 75, // kg
  totalHeight: 178, // cm
  legLength: 95, // cm
  armLength: 75, // cm
  torsoLength: 58, // cm
  headSize: 22, // cm
  neckLength: 10, // cm
  shoulderWidth: 43, // cm
  muscleMass: 35, // kg
  fatMass: 12, // kg
  age: 30,
  walkSpeed: 6.0, // m/s
  runSpeed: 9.5, // m/s
  acceleration: 12.0, // m/s²
} as const;

// ============================================================================
// ANATOMICAL PROPORTION RATIOS (해부학적 비율)
// ============================================================================

/**
 * Body proportions as fractions of total height.
 *
 * Based on 8-head canon anatomical proportions.
 *
 * @korean 신체비율
 */
export const BODY_PROPORTIONS = {
  HEAD_RATIO: 0.125, // Head is 1/8 of height
  NECK_RATIO: 0.055, // Neck is ~5.5% of height
  TORSO_RATIO: 0.33, // Torso is ~33% of height
  LEG_RATIO: 0.48, // Legs are ~48% of height
  UPPER_ARM_RATIO: 0.55, // Upper arm is 55% of total arm
  FOREARM_RATIO: 0.45, // Forearm is 45% of total arm
  THIGH_RATIO: 0.55, // Thigh is 55% of leg length
  SHIN_RATIO: 0.45, // Shin is 45% of leg length
  HAND_RATIO: 0.105, // Hand is ~10.5% of height
  FOOT_RATIO: 0.15, // Foot length is ~15% of height
  SHOULDER_WIDTH_RATIO: 0.255, // Shoulder width 23-25% of height
  HIP_WIDTH_RATIO: 0.17, // Hip width 16-18% of height
} as const;

// ============================================================================
// KOREAN ANATOMY SPECIFICS (한국인 해부학적 특성)
// ============================================================================

/**
 * Korean adult male anatomical adjustments.
 *
 * Based on Korean physical anthropology studies.
 * These modify proportions for authentic Korean body types.
 *
 * @korean 한국인체형비율
 */
export const KOREAN_ANATOMY_ADJUSTMENTS = {
  /** Slightly shorter torso relative to Western proportions */
  TORSO_ADJUSTMENT: 0.98,
  /** Proportionally longer legs for height */
  LEG_ADJUSTMENT: 1.02,
  /** Narrower shoulder width relative to height */
  SHOULDER_ADJUSTMENT: 0.97,
  /** More compact hip structure */
  HIP_ADJUSTMENT: 0.95,
  /** Flatter chest profile */
  CHEST_DEPTH_ADJUSTMENT: 0.92,
} as const;

// ============================================================================
// CLOTHING RENDERING CONSTANTS (의복 렌더링)
// ============================================================================

/**
 * Base clothing offset from body surface.
 *
 * Gap between body and clothing geometry for natural appearance.
 *
 * @korean 의복기본오프셋
 */
export const CLOTHING_OFFSET = 0.01; // 1cm gap

/**
 * Clothing thickness (affects layering).
 *
 * @korean 의복두께
 */
export const CLOTHING_THICKNESS = 0.005; // 5mm

/**
 * Clothing drape factor for loose garments.
 *
 * @korean 의복드레이프계수
 */
export const CLOTHING_DRAPE_FACTOR = 1.1;

// ============================================================================
// FOOT RENDERING CONSTANTS (발 렌더링)
// ============================================================================

/**
 * Base foot length in meters (for average 180cm person).
 *
 * @korean 기본발길이
 */
export const BASE_FOOT_LENGTH = 0.26; // 26cm

/**
 * Foot width ratio relative to length.
 *
 * @korean 발너비비율
 */
export const FOOT_WIDTH_RATIO = 0.385; // ~10cm for 26cm foot

/**
 * Foot height ratio at ankle.
 *
 * @korean 발높이비율
 */
export const FOOT_HEIGHT_RATIO = 0.308; // ~8cm for 26cm foot

// ============================================================================
// HAND RENDERING CONSTANTS (손 렌더링)
// ============================================================================

/**
 * Base palm width in meters.
 *
 * @korean 기본손바닥너비
 */
export const BASE_PALM_WIDTH = 0.085; // 8.5cm

/**
 * Palm length as ratio of palm width.
 *
 * @korean 손바닥길이비율
 */
export const PALM_LENGTH_RATIO = 1.12; // ~9.5cm

/**
 * Palm thickness as ratio of width.
 *
 * @korean 손바닥두께비율
 */
export const PALM_THICKNESS_RATIO = 0.294; // ~2.5cm

// ============================================================================
// HELPER FUNCTIONS (도우미 함수)
// ============================================================================

/**
 * Calculate bone thickness multiplier from physical attributes.
 *
 * @param muscleMass - Muscle mass in kg
 * @param fatMass - Fat mass in kg
 * @returns Thickness multiplier (0.85 - 1.3)
 * @korean 뼈두께배수계산
 */
export function calculateBoneThickness(
  muscleMass: number,
  fatMass: number,
): number {
  const muscleRatio = muscleMass / REFERENCE_MUSCLE_MASS;
  const fatRatio = fatMass / REFERENCE_FAT_MASS;

  const muscleContribution =
    Math.sqrt(muscleRatio) * MUSCLE_THICKNESS_CONTRIBUTION;
  const fatContribution = Math.sqrt(fatRatio) * FAT_THICKNESS_CONTRIBUTION;

  const rawMultiplier = muscleContribution + fatContribution;
  const deviation = rawMultiplier - 1.0;
  const amplified = 1.0 + deviation * BONE_THICKNESS_AMPLIFICATION;

  return Math.max(
    MIN_BONE_THICKNESS_MULTIPLIER,
    Math.min(MAX_BONE_THICKNESS_MULTIPLIER, amplified),
  );
}

/**
 * Calculate muscle scale factor from muscle mass.
 *
 * @param muscleMass - Muscle mass in kg
 * @returns Scale factor (0.5 - 2.0+)
 * @korean 근육크기계산
 */
export function calculateMuscleScale(muscleMass: number): number {
  const massRatio = muscleMass / REFERENCE_MUSCLE_MASS;
  const deviation = massRatio - 1.0;

  const exponentialDeviation =
    Math.sign(deviation) *
    Math.pow(Math.abs(deviation), MUSCLE_AMPLIFICATION_EXPONENT);

  return Math.max(
    MIN_MUSCLE_SCALE,
    1.0 + exponentialDeviation * MUSCLE_AMPLIFICATION_BASE,
  );
}

/**
 * Apply visual amplification to a scaling factor.
 *
 * @param rawFactor - Raw scaling factor (1.0 = reference)
 * @returns Amplified scaling factor
 * @korean 시각적증폭적용
 */
export function amplifyScaling(rawFactor: number): number {
  const deviation = rawFactor - 1.0;
  return 1.0 + deviation * VISUAL_AMPLIFICATION_FACTOR;
}
