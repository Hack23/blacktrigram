/**
 * Centralized body dimensions for consistent rendering across muscles and clothing.
 *
 * **Korean**: 신체 치수 (Body Dimensions)
 *
 * This module provides a single source of truth for body part radii and lengths.
 * Both the muscle system (BoneAttachedMuscles) and clothing system (BoneClothing)
 * import these values to ensure clothing properly wraps around muscles.
 *
 * ## Design Philosophy
 *
 * - All values are tuned for muscular Korean martial arts fighter proportions
 * - Radii represent the thickness of each body part
 * - Lengths represent the extent along the bone axis
 * - Clothing should add a thin layer OUTSIDE these dimensions
 *
 * @module constants/bodyDimensions
 * @category Rendering
 * @korean 신체치수
 */

// ============================================================================
// SHOULDER DIMENSIONS (어깨 치수)
// ============================================================================

/**
 * Shoulder (deltoid) muscle radius.
 * Athletic martial artist proportions.
 * @korean 어깨반지름
 */
export const SHOULDER_RADIUS = 0.08;

/**
 * Shoulder muscle length along bone axis.
 * @korean 어깨길이
 */
export const SHOULDER_LENGTH = 0.15;

// ============================================================================
// UPPER ARM DIMENSIONS (상완 치수)
// ============================================================================

/**
 * Bicep muscle radius.
 * Muscular martial artist proportions.
 * @korean 이두근반지름
 */
export const BICEP_RADIUS = 0.06;

/**
 * Bicep muscle length.
 * @korean 이두근길이
 */
export const BICEP_LENGTH = 0.25;

/**
 * Tricep muscle radius.
 * Slightly smaller than bicep.
 * @korean 삼두근반지름
 */
export const TRICEP_RADIUS = 0.055;

/**
 * Tricep muscle length.
 * @korean 삼두근길이
 */
export const TRICEP_LENGTH = 0.22;

/**
 * Combined upper arm radius for clothing calculations.
 * Uses the larger of bicep/tricep for proper fit.
 * @korean 상완반지름
 */
export const UPPER_ARM_RADIUS = Math.max(BICEP_RADIUS, TRICEP_RADIUS);

// ============================================================================
// FOREARM DIMENSIONS (전완 치수)
// ============================================================================

/**
 * Forearm muscle radius.
 * Athletic martial artist proportions.
 * @korean 전완반지름
 */
export const FOREARM_RADIUS = 0.045;

/**
 * Forearm muscle length.
 * @korean 전완길이
 */
export const FOREARM_LENGTH = 0.2;

// ============================================================================
// TORSO DIMENSIONS (몸통 치수)
// ============================================================================

/**
 * Pectorals (chest) muscle radius/depth.
 * Athletic chest depth.
 * @korean 가슴반지름
 */
export const PECTORALS_RADIUS = 0.12;

/**
 * Pectorals width (length in capsule terms).
 * @korean 가슴너비
 */
export const PECTORALS_LENGTH = 0.28;

/**
 * Core (midsection) muscle radius.
 * Athletic core depth.
 * @korean 코어반지름
 */
export const CORE_RADIUS = 0.1;

/**
 * Core muscle length.
 * @korean 코어길이
 */
export const CORE_LENGTH = 0.25;

/**
 * Abdominals muscle radius.
 * Athletic abs depth.
 * @korean 복근반지름
 */
export const ABS_RADIUS = 0.08;

/**
 * Abdominals muscle length.
 * @korean 복근길이
 */
export const ABS_LENGTH = 0.22;

/**
 * Obliques muscle radius.
 * @korean 복사근반지름
 */
export const OBLIQUES_RADIUS = 0.06;

/**
 * Obliques muscle length.
 * @korean 복사근길이
 */
export const OBLIQUES_LENGTH = 0.2;

// ============================================================================
// HIP/GLUTE DIMENSIONS (엉덩이 치수)
// ============================================================================

/**
 * Hip flexor muscle radius.
 * @korean 고관절굴근반지름
 */
export const HIP_FLEXOR_RADIUS = 0.04;

/**
 * Hip flexor muscle length.
 * @korean 고관절굴근길이
 */
export const HIP_FLEXOR_LENGTH = 0.12;

/**
 * Glute muscle radius.
 * Athletic glute proportions.
 * @korean 둔근반지름
 */
export const GLUTE_RADIUS = 0.06;

/**
 * Glute muscle length.
 * @korean 둔근길이
 */
export const GLUTE_LENGTH = 0.14;

// ============================================================================
// THIGH DIMENSIONS (허벅지 치수)
// ============================================================================

/**
 * Quadriceps muscle radius.
 * Athletic thigh proportions.
 * @korean 대퇴사두근반지름
 */
export const QUAD_RADIUS = 0.055;

/**
 * Quadriceps muscle length.
 * @korean 대퇴사두근길이
 */
export const QUAD_LENGTH = 0.25;

/**
 * Hamstring muscle radius.
 * @korean 햄스트링반지름
 */
export const HAMSTRING_RADIUS = 0.05;

/**
 * Hamstring muscle length.
 * @korean 햄스트링길이
 */
export const HAMSTRING_LENGTH = 0.23;

/**
 * Combined thigh radius for clothing calculations.
 * Uses the larger of quad/hamstring for proper fit.
 * @korean 허벅지반지름
 */
export const THIGH_RADIUS = Math.max(QUAD_RADIUS, HAMSTRING_RADIUS);

// ============================================================================
// LOWER LEG DIMENSIONS (종아리 치수)
// ============================================================================

/**
 * Calf muscle radius.
 * Athletic calf proportions.
 * @korean 종아리반지름
 */
export const CALF_RADIUS = 0.04;

/**
 * Calf muscle length.
 * @korean 종아리길이
 */
export const CALF_LENGTH = 0.2;

// ============================================================================
// BACK DIMENSIONS (등 치수)
// ============================================================================

/**
 * Latissimus dorsi muscle radius.
 * @korean 광배근반지름
 */
export const LAT_RADIUS = 0.05;

/**
 * Latissimus dorsi muscle length.
 * @korean 광배근길이
 */
export const LAT_LENGTH = 0.2;

/**
 * Trapezius muscle radius.
 * @korean 승모근반지름
 */
export const TRAPEZIUS_RADIUS = 0.045;

/**
 * Trapezius muscle length.
 * @korean 승모근길이
 */
export const TRAPEZIUS_LENGTH = 0.14;

/**
 * Erector spinae muscle radius.
 * @korean 척추기립근반지름
 */
export const ERECTOR_SPINAE_RADIUS = 0.035;

/**
 * Erector spinae muscle length.
 * @korean 척추기립근길이
 */
export const ERECTOR_SPINAE_LENGTH = 0.18;

// ============================================================================
// CLOTHING CONSTANTS (의류 상수)
// ============================================================================

/**
 * Standard fabric thickness for tight-fitting clothing.
 * @korean 밀착의류두께
 */
export const CLOTHING_THICKNESS_TIGHT = 0.01;

/**
 * Standard fabric thickness for fitted clothing.
 * @korean 맞춤의류두께
 */
export const CLOTHING_THICKNESS_FITTED = 0.015;

/**
 * Standard fabric thickness for loose clothing.
 * @korean 헐렁한의류두께
 */
export const CLOTHING_THICKNESS_LOOSE = 0.025;

/**
 * Standard fabric thickness for oversized clothing.
 * @korean 오버사이즈의류두께
 */
export const CLOTHING_THICKNESS_OVERSIZED = 0.04;

/**
 * Get clothing thickness based on fit type.
 * @param fit - Clothing fit type
 * @returns Fabric thickness in meters
 * @korean 의류두께가져오기
 */
export const getClothingThickness = (
  fit: "tight" | "fitted" | "loose" | "oversized",
): number => {
  switch (fit) {
    case "tight":
      return CLOTHING_THICKNESS_TIGHT;
    case "fitted":
      return CLOTHING_THICKNESS_FITTED;
    case "loose":
      return CLOTHING_THICKNESS_LOOSE;
    case "oversized":
      return CLOTHING_THICKNESS_OVERSIZED;
    default:
      return CLOTHING_THICKNESS_FITTED;
  }
};

/**
 * Calculate clothing radius for a body part.
 * Adds fabric thickness to body radius with body thickness scaling.
 *
 * @param bodyRadius - Base body part radius
 * @param bodyThickness - Body thickness multiplier (from muscle/fat mass)
 * @param clothingThickness - Fabric thickness
 * @returns Total clothing radius
 * @korean 의류반지름계산
 */
export const calculateClothingRadius = (
  bodyRadius: number,
  bodyThickness: number,
  clothingThickness: number,
): number => {
  return bodyRadius * bodyThickness + clothingThickness;
};
