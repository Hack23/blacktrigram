/**
 * Skeleton rig scaling based on physical attributes.
 *
 * **Korean**: 골격 크기 조정 (Skeleton Scaling)
 *
 * This module provides functions to scale the skeleton rig based on player
 * physical attributes, allowing each archetype to have anatomically accurate
 * body proportions that affect combat hitboxes, vital point positioning, and
 * visual representation.
 *
 * ## Visual Amplification System
 *
 * Raw physical attribute differences between archetypes are subtle (2-12%).
 * To create recognizable visual silhouettes in 3D, this system applies
 * amplification factors that enhance differences while maintaining realistic
 * proportions:
 *
 * - **Limb Scaling**: 2.5x amplification (subtle 5% difference → 12.5% visual)
 * - **Shoulder Width**: 1.15x additional amplification for silhouette distinction
 * - **Overall Height**: 1.5x amplification (kept subtle for realism)
 *
 * ### Expected Visual Silhouettes
 *
 * Each archetype has a distinct, recognizable body shape:
 *
 * - **해커 (Hacker)**: Compact, narrow shoulders (43cm), shortest limbs - SMALLEST
 * - **암살자 (Amsalja)**: Tall (186cm), lean, long limbs (102cm legs) - TALLEST
 * - **정보요원 (Jeongbo)**: Balanced, average proportions - BASELINE
 * - **무사 (Musa)**: Athletic military build (46cm shoulders) - TRADITIONAL
 * - **조직폭력배 (Jojik)**: Massive, widest shoulders (54cm), imposing - LARGEST
 *
 * ## Integration with Korean Anatomy
 *
 * The scaling system respects Korean martial arts anatomy principles:
 * - **Head vital points** (두부 급소) scale with head size
 * - **Neck vulnerability** (경부 취약성) affected by neck length
 * - **Torso vital points** (몸통 급소) distributed across torso length
 * - **Limb reach** (팔다리 거리) determined by arm/leg length
 * - **Shoulder defense** (어깨 방어) coverage from shoulder width
 *
 * @module utils/skeletonScaling
 * @category Combat System
 * @korean 골격조정
 */

import { PhysicalAttributes } from "@/types";
import { BoneName } from "@/types/skeletal";

/**
 * Bone scaling factors for each body region.
 *
 * **Korean**: 뼈 크기 비율 (Bone Scaling Factors)
 *
 * Defines how physical attributes map to skeleton bone scaling.
 * Each factor is a multiplier applied to the base bone length.
 *
 * @public
 * @korean 뼈크기비율
 */
export interface BoneScalingFactors {
  /** Head bone scaling (based on headSize) */
  readonly head: number;
  /** Neck bone scaling (based on neckLength) */
  readonly neck: number;
  /** Spine bones scaling (based on torsoLength) */
  readonly spine: number;
  /** Upper arm bones scaling (based on armLength) */
  readonly upperArm: number;
  /** Forearm bones scaling (based on armLength) */
  readonly forearm: number;
  /** Thigh bones scaling (based on legLength) */
  readonly thigh: number;
  /** Shin bones scaling (based on legLength) */
  readonly shin: number;
  /** Shoulder bones scaling (based on shoulderWidth) */
  readonly shoulder: number;
  /** Overall skeleton scaling (based on totalHeight) */
  readonly overall: number;
}

/**
 * Base bone dimensions in centimeters (from SkeletonRig.ts).
 *
 * **Korean**: 기본 뼈 치수 (Base Bone Dimensions)
 *
 * These are the default bone lengths used in createHumanoidRig().
 * Scaling factors are applied to these baseline values.
 *
 * @internal
 * @korean 기본뼈치수
 */
const BASE_BONE_DIMENSIONS = {
  // Head region
  head: 20, // Head bone length in cm
  neck: 10, // Neck bone length in cm

  // Torso region
  spineLower: 20, // Lower spine segment
  spineMiddle: 20, // Middle spine segment
  spineUpper: 20, // Upper spine segment
  pelvis: 15, // Pelvis/root bone

  // Arm region (one side)
  shoulder: 10, // Shoulder bone
  upperArm: 25, // Upper arm (shoulder to elbow)
  forearm: 25, // Forearm (elbow to wrist)
  hand: 8, // Hand length

  // Leg region (one side)
  hip: 10, // Hip joint
  thigh: 30, // Thigh (hip to knee)
  shin: 30, // Shin (knee to ankle)
  foot: 15, // Foot length

  // Width measurements
  shoulderWidth: 30, // Distance between shoulders (total span / 2)
  hipWidth: 20, // Distance between hips
} as const;

/**
 * Reference physical attributes for baseline scaling.
 *
 * **Korean**: 기준 신체 속성 (Reference Physical Attributes)
 *
 * These represent the "average" Korean male fighter that the base
 * skeleton rig is designed for. Scaling is calculated relative to
 * these reference values.
 *
 * @internal
 * @korean 기준신체속성
 */
const REFERENCE_ATTRIBUTES: PhysicalAttributes = {
  weight: 75,
  legLength: 95,
  armLength: 75,
  muscleMass: 35,
  fatMass: 12,
  age: 30,
  totalHeight: 178,
  torsoLength: 58,
  headSize: 22,
  neckLength: 10,
  shoulderWidth: 43,
};

/**
 * Visual amplification factor for more noticeable archetype differences.
 *
 * **Korean**: 시각적 증폭 계수 (Visual Amplification Factor)
 *
 * Raw physical attribute differences are subtle (2-12%). This factor
 * amplifies the visual scaling to make archetype body differences more
 * apparent while keeping proportions realistic.
 *
 * Increased from 2.0 to 2.5 for more distinct visual silhouettes:
 * - Jojik shoulders (54cm) vs Hacker (43cm) = 25% difference → 63% visual difference
 * - Amsalja legs (102cm) vs Hacker (92cm) = 11% difference → 28% visual difference
 *
 * @internal
 * @korean 시각적증폭계수
 */
const VISUAL_AMPLIFICATION_FACTOR = 2.5;

/**
 * Apply visual amplification to a scaling factor.
 *
 * Amplifies deviations from 1.0 to make differences more visible.
 * For example, with 2x amplification:
 * - 1.05 becomes 1.10 (5% → 10%)
 * - 0.95 becomes 0.90 (5% → 10%)
 *
 * @param rawFactor - Raw scaling factor (1.0 = reference)
 * @returns Amplified scaling factor
 * @korean 시각적증폭적용
 */
function amplifyScaling(rawFactor: number): number {
  const deviation = rawFactor - 1.0;
  return 1.0 + deviation * VISUAL_AMPLIFICATION_FACTOR;
}

/**
 * Calculate bone scaling factors from physical attributes.
 *
 * **Korean**: 뼈 크기 비율 계산 (Calculate Bone Scaling Factors)
 *
 * Computes scaling multipliers for each bone region based on the
 * player's physical attributes compared to reference values.
 * Differences are amplified for more noticeable visual distinction
 * between archetypes.
 *
 * @param attributes - Player's physical attributes
 * @returns Bone scaling factors for skeleton rig
 *
 * @example
 * ```typescript
 * const factors = calculateBoneScalingFactors(AMSALJA_PHYSICAL);
 * // Amsalja has longer legs: factors.thigh ~= 1.06 (amplified from ~1.03)
 * // Amsalja has smaller head: factors.head ~= 0.90 (amplified from ~0.95)
 * ```
 *
 * @public
 * @korean 뼈크기비율계산
 */
export function calculateBoneScalingFactors(
  attributes: PhysicalAttributes
): BoneScalingFactors {
  // Calculate raw scaling ratios from physical attributes
  const rawOverall = attributes.totalHeight / REFERENCE_ATTRIBUTES.totalHeight;
  const rawHead = attributes.headSize / REFERENCE_ATTRIBUTES.headSize;
  const rawNeck = attributes.neckLength / REFERENCE_ATTRIBUTES.neckLength;
  const rawSpine = attributes.torsoLength / REFERENCE_ATTRIBUTES.torsoLength;
  const rawArm = attributes.armLength / REFERENCE_ATTRIBUTES.armLength;
  const rawLeg = attributes.legLength / REFERENCE_ATTRIBUTES.legLength;
  const rawShoulder =
    attributes.shoulderWidth / REFERENCE_ATTRIBUTES.shoulderWidth;

  // Apply visual amplification for more noticeable archetype differences
  // Overall height scaling is kept subtle (1.5x) for realism
  const overall = 1.0 + (rawOverall - 1.0) * 1.5;

  // Head, neck, and body proportions are amplified for visual distinction
  const head = amplifyScaling(rawHead);
  const neck = amplifyScaling(rawNeck);
  const spine = amplifyScaling(rawSpine);

  // Limb proportions amplified for noticeable reach differences
  const upperArm = amplifyScaling(rawArm);
  const forearm = amplifyScaling(rawArm);
  const thigh = amplifyScaling(rawLeg);
  const shin = amplifyScaling(rawLeg);

  // Shoulder width amplified for body silhouette distinction
  const shoulder = amplifyScaling(rawShoulder);

  return {
    head,
    neck,
    spine,
    upperArm,
    forearm,
    thigh,
    shin,
    shoulder,
    overall,
  };
}

/**
 * Get scaled bone length for a specific bone.
 *
 * **Korean**: 크기 조정된 뼈 길이 (Scaled Bone Length)
 *
 * Returns the scaled length for a specific bone based on the player's
 * physical attributes. Used when creating or updating skeleton rigs.
 *
 * @param boneName - Name of the bone to scale
 * @param attributes - Player's physical attributes
 * @returns Scaled bone length in centimeters
 *
 * @example
 * ```typescript
 * const headLength = getScaledBoneLength(BoneName.HEAD, JOJIK_PHYSICAL);
 * // Jojik has larger head: returns ~23cm (base 20cm * 1.15)
 * ```
 *
 * @public
 * @korean 크기조정된뼈길이
 */
export function getScaledBoneLength(
  boneName: string,
  attributes: PhysicalAttributes
): number {
  const factors = calculateBoneScalingFactors(attributes);

  // Map bone names to their base dimensions and scaling factors
  switch (boneName) {
    // Head region
    case BoneName.HEAD:
      return BASE_BONE_DIMENSIONS.head * factors.head;
    case BoneName.NECK:
      return BASE_BONE_DIMENSIONS.neck * factors.neck;

    // Spine region
    case BoneName.SPINE_LOWER:
      return BASE_BONE_DIMENSIONS.spineLower * factors.spine;
    case BoneName.SPINE_MIDDLE:
      return BASE_BONE_DIMENSIONS.spineMiddle * factors.spine;
    case BoneName.SPINE_UPPER:
      return BASE_BONE_DIMENSIONS.spineUpper * factors.spine;
    case BoneName.PELVIS:
      return BASE_BONE_DIMENSIONS.pelvis * factors.overall;

    // Left arm
    case BoneName.SHOULDER_L:
    case BoneName.SHOULDER_R:
      return BASE_BONE_DIMENSIONS.shoulder * factors.shoulder;
    case BoneName.UPPER_ARM_L:
    case BoneName.UPPER_ARM_R:
      return BASE_BONE_DIMENSIONS.upperArm * factors.upperArm;
    case BoneName.FOREARM_L:
    case BoneName.FOREARM_R:
      return BASE_BONE_DIMENSIONS.forearm * factors.forearm;
    case BoneName.HAND_L:
    case BoneName.HAND_R:
      return BASE_BONE_DIMENSIONS.hand * factors.overall;

    // Left leg
    case BoneName.THIGH_L:
    case BoneName.THIGH_R:
      return BASE_BONE_DIMENSIONS.thigh * factors.thigh;
    case BoneName.SHIN_L:
    case BoneName.SHIN_R:
      return BASE_BONE_DIMENSIONS.shin * factors.shin;
    case BoneName.FOOT_L:
    case BoneName.FOOT_R:
      return BASE_BONE_DIMENSIONS.foot * factors.overall;

    // Default: use overall scaling
    default:
      return 10 * factors.overall; // Default bone length
  }
}

/**
 * Calculate scaled shoulder offset for skeleton positioning.
 *
 * **Korean**: 어깨 오프셋 계산 (Shoulder Offset Calculation)
 *
 * Determines the horizontal offset for shoulder bones based on
 * shoulder width. Used to position arms correctly on the skeleton.
 *
 * Applies amplification to shoulder width for more noticeable silhouette
 * differences between archetypes:
 * - Jojik (54cm): Offset = 31.05cm (54/2 * 1.15) - WIDE, imposing
 * - Hacker (43cm): Offset = 24.73cm (43/2 * 1.15) - NARROW, compact
 * - Difference: 26% wider shoulder span for visual distinction
 *
 * @param attributes - Player's physical attributes
 * @returns Shoulder offset in centimeters (half of total shoulder width, amplified)
 *
 * @example
 * ```typescript
 * const offset = calculateShoulderOffset(JOJIK_PHYSICAL);
 * // Jojik has wide shoulders: returns ~31cm (54cm width / 2 * 1.15)
 * // Left shoulder at -31cm, right shoulder at +31cm
 * ```
 *
 * @public
 * @korean 어깨오프셋계산
 */
export function calculateShoulderOffset(
  attributes: PhysicalAttributes
): number {
  // Shoulder width is the total span, so divide by 2 for offset from center
  // Apply amplification factor for more visible width differences
  const SHOULDER_AMPLIFICATION = 1.15;
  return (attributes.shoulderWidth / 2) * SHOULDER_AMPLIFICATION;
}

/**
 * Calculate hitbox dimensions based on physical attributes.
 *
 * **Korean**: 히트박스 크기 계산 (Hitbox Dimension Calculation)
 *
 * Determines the bounding box dimensions for collision detection
 * and hit registration based on body proportions.
 *
 * @param attributes - Player's physical attributes
 * @returns Hitbox dimensions {width, height, depth} in centimeters
 *
 * @example
 * ```typescript
 * const hitbox = calculateHitboxDimensions(AMSALJA_PHYSICAL);
 * // Amsalja is tall and lean: {width: 40, height: 182, depth: 25}
 * ```
 *
 * @public
 * @korean 히트박스크기계산
 */
export function calculateHitboxDimensions(attributes: PhysicalAttributes): {
  width: number;
  height: number;
  depth: number;
} {
  return {
    width: attributes.shoulderWidth,
    height: attributes.totalHeight,
    depth: attributes.shoulderWidth * 0.5, // Approximate depth from shoulder width
  };
}

/**
 * Calculate vital point offset adjustments based on body proportions.
 *
 * **Korean**: 급소 위치 조정 (Vital Point Position Adjustment)
 *
 * Adjusts vital point positions based on scaled skeleton dimensions.
 * Ensures vital points remain anatomically accurate for different
 * body types while maintaining Korean anatomy principles.
 *
 * @param vitalPointId - ID of the vital point to adjust
 * @param attributes - Player's physical attributes
 * @returns Position adjustment {x, y} offset in centimeters
 *
 * @example
 * ```typescript
 * const adjustment = calculateVitalPointAdjustment("head_temple", MUSA_PHYSICAL);
 * // Returns offset based on head size and torso height
 * ```
 *
 * @public
 * @korean 급소위치조정
 */
export function calculateVitalPointAdjustment(
  vitalPointId: string,
  attributes: PhysicalAttributes
): { x: number; y: number } {
  const factors = calculateBoneScalingFactors(attributes);

  // Determine which body region this vital point belongs to
  // Use exact prefix matching to avoid ambiguity
  if (vitalPointId.startsWith("head_")) {
    // Head vital points scale with head size and torso height
    return {
      x: 0,
      y: (factors.head - 1.0) * 20 + (factors.spine - 1.0) * 60,
    };
  } else if (vitalPointId.startsWith("neck_")) {
    // Neck vital points scale with neck length and torso height
    return {
      x: 0,
      y: (factors.neck - 1.0) * 10 + (factors.spine - 1.0) * 60,
    };
  } else if (vitalPointId.startsWith("torso_")) {
    // Torso vital points scale with torso length
    return {
      x: 0,
      y: (factors.spine - 1.0) * 30,
    };
  } else if (
    vitalPointId.startsWith("shoulder_") ||
    vitalPointId.startsWith("arm_")
  ) {
    // Arm vital points scale with arm length and shoulder width
    return {
      x: (factors.shoulder - 1.0) * 15,
      y: (factors.upperArm - 1.0) * 12,
    };
  } else if (
    vitalPointId.startsWith("leg_") ||
    vitalPointId.startsWith("knee_")
  ) {
    // Leg vital points scale with leg length
    return {
      x: 0,
      y: -(factors.thigh - 1.0) * 15,
    };
  }

  // Default: no adjustment
  return { x: 0, y: 0 };
}

/**
 * Calculate choke effectiveness modifier based on neck dimensions.
 *
 * **Korean**: 목 조르기 효과 계산 (Choke Effectiveness Calculation)
 *
 * Determines how effective chokes and strangles are based on neck
 * length and thickness. Longer, thinner necks are more vulnerable.
 *
 * @param attributes - Player's physical attributes
 * @returns Choke effectiveness multiplier (1.0 = baseline)
 *
 * @example
 * ```typescript
 * const chokeEffectiveness = calculateChokeEffectiveness(AMSALJA_PHYSICAL);
 * // Amsalja has longer neck: returns ~1.1 (10% more vulnerable)
 *
 * const jojikChoke = calculateChokeEffectiveness(JOJIK_PHYSICAL);
 * // Jojik has shorter, thicker neck: returns ~0.9 (10% more resistant)
 * ```
 *
 * @public
 * @korean 목조르기효과계산
 */
export function calculateChokeEffectiveness(
  attributes: PhysicalAttributes
): number {
  // Longer necks are more vulnerable to chokes
  const lengthFactor = attributes.neckLength / REFERENCE_ATTRIBUTES.neckLength;

  // Thicker necks (from muscle/weight) resist chokes better
  const thicknessFactor = REFERENCE_ATTRIBUTES.weight / attributes.weight;

  // Combine factors: longer neck + lighter weight = more vulnerable
  return lengthFactor * thicknessFactor;
}

/**
 * Calculate head strike vulnerability based on head size.
 *
 * **Korean**: 머리 타격 취약성 계산 (Head Strike Vulnerability)
 *
 * Determines vulnerability to head strikes based on head size.
 * Larger heads have more mass and resistance, smaller heads are
 * more vulnerable to concussive force.
 *
 * @param attributes - Player's physical attributes
 * @returns Head strike vulnerability multiplier (1.0 = baseline)
 *
 * @example
 * ```typescript
 * const headVuln = calculateHeadStrikeVulnerability(JOJIK_PHYSICAL);
 * // Jojik has larger head: returns ~0.95 (5% more resistant)
 * ```
 *
 * @public
 * @korean 머리타격취약성계산
 */
export function calculateHeadStrikeVulnerability(
  attributes: PhysicalAttributes
): number {
  // Larger heads have more mass, providing some protection
  const sizeFactor = REFERENCE_ATTRIBUTES.headSize / attributes.headSize;

  // But larger heads are also bigger targets (handled by hitbox size)
  // Here we only calculate the mass-based resistance
  return sizeFactor;
}
