/**
 * Unified character scaling system for Black Trigram.
 *
 * **Korean**: 통합 캐릭터 스케일링 시스템
 *
 * This module provides a physics-first approach to character scaling where:
 * - All measurements are in METERS for consistency with arena and physics
 * - Physical attributes (in cm) are converted to meters
 * - All body part dimensions derive from physical attributes
 * - Scale factors are based on anatomical proportions
 *
 * ## Design Philosophy
 *
 * The scaling system ensures that:
 * 1. Characters appear correctly sized in arenas (6-14 meters wide)
 * 2. Reach calculations (arm/leg length) match visual representation
 * 3. Muscle and clothing scale proportionally with body dimensions
 * 4. Combat animations use realistic distances
 *
 * ## Unit Conventions
 * - Physical attributes: centimeters (totalHeight: 180 = 180cm)
 * - World space: meters (arena width: 10 = 10m)
 * - Character model: meters (height: 1.80 = 1.80m)
 *
 * @module utils/characterScaling
 * @category Character Rendering
 * @korean 캐릭터스케일링
 */

import type { PhysicalAttributes } from "@/types";

// ============================================================================
// REFERENCE ANATOMY (Based on average Korean adult male proportions)
// ============================================================================

/**
 * Reference body proportions as fractions of total height.
 * Based on canonical human anatomy (8-head proportion system).
 *
 * @korean 기준신체비율
 */
export const BODY_PROPORTIONS = {
  /** Head is ~1/8 of total height */
  HEAD_HEIGHT_RATIO: 0.125,
  /** Neck is ~0.055 of total height */
  NECK_HEIGHT_RATIO: 0.055,
  /** Torso (spine) is ~0.33 of total height */
  TORSO_HEIGHT_RATIO: 0.33,
  /** Leg (hip to floor) is ~0.48 of total height */
  LEG_HEIGHT_RATIO: 0.48,
  /** Upper leg (thigh) is ~55% of total leg length */
  THIGH_LEG_RATIO: 0.55,
  /** Lower leg (shin) is ~45% of total leg length */
  SHIN_LEG_RATIO: 0.45,
  /** Upper arm is ~55% of total arm length */
  UPPER_ARM_RATIO: 0.55,
  /** Forearm is ~45% of total arm length */
  FOREARM_RATIO: 0.45,
  /** Hand is ~0.11 of total height (or ~10.5% of total height) */
  HAND_HEIGHT_RATIO: 0.105,
  /** Foot length is ~15% of total height */
  FOOT_LENGTH_RATIO: 0.15,
  /** Shoulder width is typically 23-25% of height for males */
  SHOULDER_WIDTH_RATIO: 0.255,
  /** Hip width is typically 16-18% of height */
  HIP_WIDTH_RATIO: 0.17,
  /** Torso depth is typically 10-12% of height */
  TORSO_DEPTH_RATIO: 0.11,
} as const;

/**
 * Bone length as fraction of total height.
 * These are anatomically accurate proportions for skeletal rig creation.
 *
 * @korean 뼈길이비율
 */
export const BONE_HEIGHT_RATIOS = {
  // Head & Neck
  head: 0.125, // 22.5cm for 180cm person
  neck: 0.055, // 9.9cm for 180cm person

  // Spine (split into 3 segments)
  spineUpper: 0.11, // Upper thoracic
  spineMiddle: 0.11, // Middle thoracic
  spineLower: 0.11, // Lumbar

  // Shoulders (clavicle + shoulder joint)
  shoulder: 0.055, // Clavicle length

  // Arms (based on arm length from physical attributes)
  // Actual values calculated from physicalAttributes.armLength
  upperArm: 0.21, // ~38cm for 180cm (55% of arm)
  elbow: 0.025, // Elbow joint
  forearm: 0.17, // ~31cm for 180cm (45% of arm)
  wrist: 0.025, // Wrist joint
  hand: 0.105, // ~19cm for 180cm

  // Pelvis & Hips
  pelvis: 0.08, // Pelvis height
  hip: 0.05, // Hip joint

  // Legs (based on leg length from physical attributes)
  // Actual values calculated from physicalAttributes.legLength
  thigh: 0.265, // ~48cm for 180cm (55% of leg)
  knee: 0.025, // Knee joint
  shin: 0.22, // ~40cm for 180cm (45% of leg)
  foot: 0.05, // Ankle to ground
} as const;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert centimeters to meters.
 *
 * @param cm - Value in centimeters
 * @returns Value in meters
 * @korean cm를미터로
 */
export function cmToMeters(cm: number): number {
  return cm / 100;
}

/**
 * Convert physical attributes from centimeters to meters.
 *
 * @param attrs - Physical attributes in centimeters
 * @returns Object with key measurements in meters
 * @korean 신체속성미터변환
 */
export function getPhysicalMeters(attrs: PhysicalAttributes): {
  readonly totalHeight: number;
  readonly armLength: number;
  readonly legLength: number;
  readonly shoulderWidth: number;
  readonly torsoLength: number;
  readonly headSize: number;
  readonly neckLength: number;
} {
  return {
    totalHeight: cmToMeters(attrs.totalHeight),
    armLength: cmToMeters(attrs.armLength),
    legLength: cmToMeters(attrs.legLength),
    shoulderWidth: cmToMeters(attrs.shoulderWidth),
    torsoLength: cmToMeters(attrs.torsoLength),
    headSize: cmToMeters(attrs.headSize),
    neckLength: cmToMeters(attrs.neckLength),
  };
}

// ============================================================================
// SKELETON DIMENSIONS
// ============================================================================

/**
 * Calculate skeleton bone dimensions in meters based on physical attributes.
 *
 * Returns actual bone lengths that should be used in SkeletonRig creation.
 * All values are in meters and anatomically proportioned.
 *
 * @param attrs - Physical attributes (in centimeters)
 * @returns Bone dimensions in meters
 * @korean 골격치수계산
 */
export function calculateSkeletonDimensions(attrs: PhysicalAttributes): {
  readonly pelvisHeight: number;
  readonly spineLower: number;
  readonly spineMiddle: number;
  readonly spineUpper: number;
  readonly neck: number;
  readonly head: number;
  readonly shoulder: number;
  readonly upperArm: number;
  readonly elbow: number;
  readonly forearm: number;
  readonly wrist: number;
  readonly hand: number;
  readonly hip: number;
  readonly thigh: number;
  readonly knee: number;
  readonly shin: number;
  readonly foot: number;
  readonly totalHeight: number;
} {
  const totalHeightM = cmToMeters(attrs.totalHeight);
  const armLengthM = cmToMeters(attrs.armLength);
  const legLengthM = cmToMeters(attrs.legLength);
  const shoulderWidthM = cmToMeters(attrs.shoulderWidth);
  const neckLengthM = cmToMeters(attrs.neckLength);
  const headSizeM = cmToMeters(attrs.headSize);
  const torsoLengthM = cmToMeters(attrs.torsoLength);

  // Calculate arm segments based on actual arm length
  const upperArmLength = armLengthM * BODY_PROPORTIONS.UPPER_ARM_RATIO;
  const forearmLength = armLengthM * BODY_PROPORTIONS.FOREARM_RATIO;

  // Calculate leg segments based on actual leg length
  const thighLength = legLengthM * BODY_PROPORTIONS.THIGH_LEG_RATIO;
  const shinLength = legLengthM * BODY_PROPORTIONS.SHIN_LEG_RATIO;

  // Spine segments (divide torso into 3 parts)
  const spineSegment = torsoLengthM / 3;

  return {
    // Pelvis height = leg length + foot height (to have feet at Y=0)
    pelvisHeight: legLengthM + 0.05, // 0.05m for foot/ankle height

    // Spine segments
    spineLower: spineSegment,
    spineMiddle: spineSegment,
    spineUpper: spineSegment,

    // Head & Neck (use actual values if available, or proportional)
    neck: neckLengthM || totalHeightM * BONE_HEIGHT_RATIOS.neck,
    head: headSizeM || totalHeightM * BONE_HEIGHT_RATIOS.head,

    // Shoulders
    shoulder: shoulderWidthM * 0.25, // Clavicle is ~25% of shoulder width

    // Arms
    upperArm: upperArmLength,
    elbow: totalHeightM * BONE_HEIGHT_RATIOS.elbow,
    forearm: forearmLength,
    wrist: totalHeightM * BONE_HEIGHT_RATIOS.wrist,
    hand: totalHeightM * BONE_HEIGHT_RATIOS.hand,

    // Pelvis & Hip
    hip: totalHeightM * BONE_HEIGHT_RATIOS.hip,

    // Legs
    thigh: thighLength,
    knee: totalHeightM * BONE_HEIGHT_RATIOS.knee,
    shin: shinLength,
    foot: 0.05, // Ankle height

    // Total for validation
    totalHeight: totalHeightM,
  };
}

// ============================================================================
// MUSCLE DIMENSIONS
// ============================================================================

/**
 * Base muscle dimensions as fractions of associated bone length.
 * These are proportional values that scale with bone size.
 *
 * @korean 근육비율
 */
export const MUSCLE_BONE_RATIOS = {
  // Shoulder muscles (deltoid)
  shoulder: {
    radiusFactor: 0.4, // 40% of shoulder bone length
    lengthFactor: 0.8, // 80% of shoulder bone length
  },

  // Bicep (front of upper arm)
  bicep: {
    radiusFactor: 0.35, // 35% of upper arm length
    lengthFactor: 0.7, // 70% of upper arm length
  },

  // Tricep (back of upper arm)
  tricep: {
    radiusFactor: 0.3, // 30% of upper arm length
    lengthFactor: 0.65, // 65% of upper arm length
  },

  // Forearm
  forearm: {
    radiusFactor: 0.3, // 30% of forearm length
    lengthFactor: 0.8, // 80% of forearm length
  },

  // Pectorals (chest)
  pectorals: {
    radiusFactor: 0.5, // 50% of torso segment
    lengthFactor: 0.7, // 70% of torso segment
  },

  // Core/Abs
  core: {
    radiusFactor: 0.45, // 45% of torso segment
    lengthFactor: 0.9, // 90% of torso segment
  },

  // Abs (lower core)
  abs: {
    radiusFactor: 0.4, // 40% of torso segment
    lengthFactor: 0.8, // 80% of torso segment
  },

  // Obliques (side core)
  obliques: {
    radiusFactor: 0.35, // 35% of torso segment
    lengthFactor: 0.75, // 75% of torso segment
  },

  // Glutes
  glute: {
    radiusFactor: 0.5, // 50% of hip/pelvis width
    lengthFactor: 0.6, // 60% of hip area
  },

  // Quadriceps (front of thigh)
  quad: {
    radiusFactor: 0.35, // 35% of thigh length
    lengthFactor: 0.8, // 80% of thigh length
  },

  // Hamstring (back of thigh)
  hamstring: {
    radiusFactor: 0.3, // 30% of thigh length
    lengthFactor: 0.75, // 75% of thigh length
  },

  // Calf
  calf: {
    radiusFactor: 0.28, // 28% of shin length
    lengthFactor: 0.6, // 60% of shin length
  },
} as const;

/**
 * Calculate muscle dimensions in meters based on skeleton dimensions.
 *
 * @param skeletonDims - Skeleton dimensions from calculateSkeletonDimensions
 * @param muscleMass - Muscle mass in kg for scaling
 * @param referenceMass - Reference muscle mass (default 35kg)
 * @returns Muscle dimensions in meters
 * @korean 근육치수계산
 */
export function calculateMuscleDimensions(
  skeletonDims: ReturnType<typeof calculateSkeletonDimensions>,
  muscleMass: number,
  referenceMass: number = 35,
): Record<
  string,
  {
    readonly radius: number;
    readonly length: number;
    readonly scaleFactor: number;
  }
> {
  // Muscle scale factor based on muscle mass
  // Uses square root for more natural visual scaling
  const massRatio = muscleMass / referenceMass;
  const scaleFactor = Math.sqrt(massRatio);

  return {
    shoulder: {
      radius:
        skeletonDims.shoulder *
        MUSCLE_BONE_RATIOS.shoulder.radiusFactor *
        scaleFactor,
      length: skeletonDims.shoulder * MUSCLE_BONE_RATIOS.shoulder.lengthFactor,
      scaleFactor,
    },
    bicep: {
      radius:
        skeletonDims.upperArm *
        MUSCLE_BONE_RATIOS.bicep.radiusFactor *
        scaleFactor,
      length: skeletonDims.upperArm * MUSCLE_BONE_RATIOS.bicep.lengthFactor,
      scaleFactor,
    },
    tricep: {
      radius:
        skeletonDims.upperArm *
        MUSCLE_BONE_RATIOS.tricep.radiusFactor *
        scaleFactor,
      length: skeletonDims.upperArm * MUSCLE_BONE_RATIOS.tricep.lengthFactor,
      scaleFactor,
    },
    forearm: {
      radius:
        skeletonDims.forearm *
        MUSCLE_BONE_RATIOS.forearm.radiusFactor *
        scaleFactor,
      length: skeletonDims.forearm * MUSCLE_BONE_RATIOS.forearm.lengthFactor,
      scaleFactor,
    },
    pectorals: {
      radius:
        skeletonDims.spineMiddle *
        MUSCLE_BONE_RATIOS.pectorals.radiusFactor *
        scaleFactor,
      length:
        skeletonDims.spineMiddle * MUSCLE_BONE_RATIOS.pectorals.lengthFactor,
      scaleFactor,
    },
    core: {
      radius:
        skeletonDims.spineMiddle *
        MUSCLE_BONE_RATIOS.core.radiusFactor *
        scaleFactor,
      length: skeletonDims.spineMiddle * MUSCLE_BONE_RATIOS.core.lengthFactor,
      scaleFactor,
    },
    abs: {
      radius:
        skeletonDims.spineLower *
        MUSCLE_BONE_RATIOS.abs.radiusFactor *
        scaleFactor,
      length: skeletonDims.spineLower * MUSCLE_BONE_RATIOS.abs.lengthFactor,
      scaleFactor,
    },
    obliques: {
      radius:
        skeletonDims.spineLower *
        MUSCLE_BONE_RATIOS.obliques.radiusFactor *
        scaleFactor,
      length:
        skeletonDims.spineLower * MUSCLE_BONE_RATIOS.obliques.lengthFactor,
      scaleFactor,
    },
    glute: {
      radius:
        skeletonDims.hip * MUSCLE_BONE_RATIOS.glute.radiusFactor * scaleFactor,
      length: skeletonDims.hip * MUSCLE_BONE_RATIOS.glute.lengthFactor,
      scaleFactor,
    },
    quad: {
      radius:
        skeletonDims.thigh * MUSCLE_BONE_RATIOS.quad.radiusFactor * scaleFactor,
      length: skeletonDims.thigh * MUSCLE_BONE_RATIOS.quad.lengthFactor,
      scaleFactor,
    },
    hamstring: {
      radius:
        skeletonDims.thigh *
        MUSCLE_BONE_RATIOS.hamstring.radiusFactor *
        scaleFactor,
      length: skeletonDims.thigh * MUSCLE_BONE_RATIOS.hamstring.lengthFactor,
      scaleFactor,
    },
    calf: {
      radius:
        skeletonDims.shin * MUSCLE_BONE_RATIOS.calf.radiusFactor * scaleFactor,
      length: skeletonDims.shin * MUSCLE_BONE_RATIOS.calf.lengthFactor,
      scaleFactor,
    },
  };
}

// ============================================================================
// HAND & FOOT DIMENSIONS
// ============================================================================

/**
 * Calculate hand dimensions in meters based on physical attributes.
 *
 * @param attrs - Physical attributes
 * @returns Hand dimensions in meters
 * @korean 손치수계산
 */
export function calculateHandDimensions(attrs: PhysicalAttributes): {
  readonly palmLength: number;
  readonly palmWidth: number;
  readonly palmDepth: number;
  readonly fingerLengths: {
    readonly thumb: number;
    readonly index: number;
    readonly middle: number;
    readonly ring: number;
    readonly pinky: number;
  };
  readonly fingerWidths: {
    readonly thumb: number;
    readonly index: number;
    readonly middle: number;
    readonly ring: number;
    readonly pinky: number;
  };
} {
  const totalHeightM = cmToMeters(attrs.totalHeight);

  // Hand is ~10.5% of total height, palm is ~55% of hand
  const handLength = totalHeightM * BODY_PROPORTIONS.HAND_HEIGHT_RATIO;
  const palmLength = handLength * 0.55;
  const fingerBaseLength = handLength * 0.45; // Fingers are 45% of hand

  // Palm width is ~85% of palm length
  const palmWidth = palmLength * 0.85;
  const palmDepth = palmLength * 0.25;

  // Finger lengths relative to middle finger (longest)
  const middleFingerLength = fingerBaseLength;

  return {
    palmLength,
    palmWidth,
    palmDepth,
    fingerLengths: {
      thumb: middleFingerLength * 0.65, // Thumb is ~65% of middle finger
      index: middleFingerLength * 0.95, // Index is ~95% of middle finger
      middle: middleFingerLength, // Middle is longest
      ring: middleFingerLength * 0.94, // Ring is ~94% of middle finger
      pinky: middleFingerLength * 0.75, // Pinky is ~75% of middle finger
    },
    fingerWidths: {
      thumb: palmWidth * 0.2, // Thumb is thickest
      index: palmWidth * 0.16,
      middle: palmWidth * 0.16,
      ring: palmWidth * 0.15,
      pinky: palmWidth * 0.13, // Pinky is thinnest
    },
  };
}

/**
 * Calculate foot dimensions in meters based on physical attributes.
 *
 * @param attrs - Physical attributes
 * @returns Foot dimensions in meters
 * @korean 발치수계산
 */
export function calculateFootDimensions(attrs: PhysicalAttributes): {
  readonly footLength: number;
  readonly footWidth: number;
  readonly footHeight: number;
  readonly toeLength: number;
  readonly heelLength: number;
  readonly ankleRadius: number;
} {
  const totalHeightM = cmToMeters(attrs.totalHeight);

  // Foot length is ~15% of total height
  const footLength = totalHeightM * BODY_PROPORTIONS.FOOT_LENGTH_RATIO;

  return {
    footLength,
    footWidth: footLength * 0.38, // Foot width is ~38% of length
    footHeight: footLength * 0.3, // Foot height at ankle is ~30% of length
    toeLength: footLength * 0.3, // Toes are ~30% of foot length
    heelLength: footLength * 0.7, // Heel area is ~70% of foot length
    ankleRadius: footLength * 0.12, // Ankle joint radius
  };
}

// ============================================================================
// CLOTHING DIMENSIONS
// ============================================================================

/**
 * Clothing fit scale multipliers.
 * Applied on top of body dimensions.
 *
 * @korean 의류핏배율
 */
export const CLOTHING_FIT_SCALES = {
  tight: 1.02, // 2% larger than body
  fitted: 1.06, // 6% larger than body
  regular: 1.1, // 10% larger than body
  loose: 1.18, // 18% larger than body
  oversized: 1.3, // 30% larger than body
} as const;

export type ClothingFit = keyof typeof CLOTHING_FIT_SCALES;

/**
 * Calculate clothing dimensions in meters based on physical attributes.
 *
 * @param attrs - Physical attributes
 * @param fit - Clothing fit type
 * @returns Clothing dimensions in meters
 * @korean 의류치수계산
 */
export function calculateClothingDimensions(
  attrs: PhysicalAttributes,
  fit: ClothingFit = "fitted",
): {
  readonly torsoWidth: number;
  readonly torsoDepth: number;
  readonly torsoLength: number;
  readonly armThickness: number;
  readonly legThickness: number;
  readonly fitScale: number;
} {
  const phys = getPhysicalMeters(attrs);
  const fitScale = CLOTHING_FIT_SCALES[fit];

  // Calculate body thickness factor based on mass distribution
  const bmi = attrs.weight / Math.pow(phys.totalHeight, 2);
  const thicknessFactor = Math.min(1.3, Math.max(0.85, bmi / 22)); // Normalize around BMI 22

  return {
    torsoWidth: phys.shoulderWidth * fitScale,
    torsoDepth: phys.shoulderWidth * 0.45 * fitScale * thicknessFactor,
    torsoLength: phys.torsoLength * fitScale,
    armThickness: phys.armLength * 0.12 * fitScale * thicknessFactor,
    legThickness: phys.legLength * 0.14 * fitScale * thicknessFactor,
    fitScale,
  };
}

// ============================================================================
// VISUAL SCALING (for render-time adjustments)
// ============================================================================

/**
 * Visual amplification factor for better screen readability.
 * This is applied uniformly to make characters more visible in the arena.
 * Does NOT affect physics or reach calculations.
 *
 * Value of 1.0 = realistic scale (1.8m character in 10m arena)
 * Value of 1.15 = 15% larger for better visibility
 *
 * @korean 시각적증폭계수
 */
export const VISUAL_SCALE_FACTOR = 1.0;

/**
 * Calculate the uniform scale factor to apply to a character group.
 * This ensures the character's total height matches their physical height.
 *
 * @param attrs - Physical attributes
 * @param baseSkeletonHeight - Height of the base skeleton rig (before scaling)
 * @returns Scale factor to apply to character group
 * @korean 캐릭터스케일계산
 */
export function calculateCharacterScale(
  attrs: PhysicalAttributes,
  baseSkeletonHeight: number = 1.8, // Default skeleton is ~1.8m
): number {
  const targetHeight = cmToMeters(attrs.totalHeight);
  const scale = targetHeight / baseSkeletonHeight;
  return scale * VISUAL_SCALE_FACTOR;
}
