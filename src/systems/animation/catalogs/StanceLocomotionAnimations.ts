/**
 * Stance-Specific Locomotion Animations Module
 *
 * Trigram-specific walk and run animations for each of the eight stances.
 * Each trigram has unique movement characteristics reflecting its philosophy:
 *
 * ☰ Geon (Heaven): Direct, powerful movements
 * ☱ Tae (Lake): Fluid, adaptive movements
 * ☲ Li (Fire): Quick, precise movements
 * ☳ Jin (Thunder): Explosive, sudden movements
 * ☴ Son (Wind): Continuous, flowing movements
 * ☵ Gam (Water): Adaptive, redirecting movements
 * ☶ Gan (Mountain): Stable, grounded movements
 * ☷ Gon (Earth): Heavy, rooted movements
 *
 * DESIGN PRINCIPLES:
 * - Fighters MAINTAIN GUARD during locomotion (no arm swing)
 * - Arms/torso/pelvis use withTrigramGuard() from builder
 * - Legs blend trigram base position + locomotion motion
 * - Each stance has distinct leg mechanics (stance width, knee bend, weight)
 *
 * @module systems/animation/StanceLocomotionAnimations
 * @korean 자세별이동애니메이션
 */

import { TrigramStance } from "@/types/common";
import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";
import { KOREAN_STANCE_BIOMECHANICS } from "../builders/MartialArtsConstants";
import { TRIGRAM_GUARD_POSES } from "../builders/TrigramGuardApplicator";

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Default shoulder width for stance locomotion animations (cm) */
const DEFAULT_SHOULDER_WIDTH_CM = 46;

// ═══════════════════════════════════════════════════════════════════════════
// ARM SWING HELPERS - Apply guard pose with locomotion swing offset
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get arm positions with walk swing for a trigram stance
 *
 * Combines the trigram's guard arm position with a forward/back swing offset.
 * The elbow position from the guard is preserved to maintain proper guard shape.
 *
 * @param stance - Trigram stance
 * @param leftSwing - Left shoulder forward swing (positive = forward)
 * @param rightSwing - Right shoulder forward swing (positive = forward)
 * @returns Arm rotation values to apply
 *
 * @korean 걷기팔스윙가져오기
 */
function getWalkArmSwing(
  stance: TrigramStance,
  leftSwing: number,
  rightSwing: number
): {
  leftShoulder: [number, number, number];
  leftElbow: [number, number, number];
  rightShoulder: [number, number, number];
  rightElbow: [number, number, number];
} {
  const guard = TRIGRAM_GUARD_POSES[stance];

  return {
    // Add swing to X rotation, preserve Y and Z from guard
    leftShoulder: [
      guard.leftArm.shoulder.x + leftSwing,
      guard.leftArm.shoulder.y,
      guard.leftArm.shoulder.z,
    ],
    leftElbow: [
      guard.leftArm.elbow.x,
      guard.leftArm.elbow.y,
      guard.leftArm.elbow.z,
    ],
    rightShoulder: [
      guard.rightArm.shoulder.x + rightSwing,
      guard.rightArm.shoulder.y,
      guard.rightArm.shoulder.z,
    ],
    rightElbow: [
      guard.rightArm.elbow.x,
      guard.rightArm.elbow.y,
      guard.rightArm.elbow.z,
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// LEG SWING HELPERS - Apply guard pose with locomotion offsets
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get leg positions with walk swing for a trigram stance
 *
 * Combines the trigram's guard leg position with locomotion offsets.
 * This ensures walk/run animations maintain proper stance-specific leg positioning.
 *
 * Each trigram has distinct base knee bends and hip rotations:
 * - GEON: 0.2 rad knee (mobile)
 * - TAE: 0.9 rad front knee (deep lunge)
 * - LI: 0.8 rad knee (horse stance)
 * - JIN: 0.7 rad back knee (coiled)
 * - SON: 0.4 rad knee (L-stance)
 * - GAM: 0.25 rad knee (natural)
 * - GAN: 0.2 rad knee (narrow)
 * - GON: 1.0 rad knee (VERY deep)
 *
 * @param stance - Trigram stance
 * @param leftHipSwing - Left hip forward/back swing offset
 * @param leftKneeSwing - Left knee bend offset (negative = more bend)
 * @param rightHipSwing - Right hip forward/back swing offset
 * @param rightKneeSwing - Right knee bend offset (negative = more bend)
 * @returns Leg rotation values to apply
 *
 * @korean 걷기다리스윙가져오기
 */
function getWalkLegSwing(
  stance: TrigramStance,
  leftHipSwing: number,
  leftKneeSwing: number,
  rightHipSwing: number,
  rightKneeSwing: number
): {
  leftHip: [number, number, number];
  leftKnee: [number, number, number];
  leftAnkle: [number, number, number];
  rightHip: [number, number, number];
  rightKnee: [number, number, number];
  rightAnkle: [number, number, number];
} {
  const guard = TRIGRAM_GUARD_POSES[stance];

  // Apply walk offsets to the trigram's base leg position
  return {
    leftHip: [
      guard.leftLeg.hip.x + leftHipSwing,
      guard.leftLeg.hip.y,
      guard.leftLeg.hip.z,
    ],
    leftKnee: [
      guard.leftLeg.knee.x + leftKneeSwing,
      guard.leftLeg.knee.y,
      guard.leftLeg.knee.z,
    ],
    leftAnkle: [
      guard.leftLeg.ankle.x,
      guard.leftLeg.ankle.y,
      guard.leftLeg.ankle.z,
    ],
    rightHip: [
      guard.rightLeg.hip.x + rightHipSwing,
      guard.rightLeg.hip.y,
      guard.rightLeg.hip.z,
    ],
    rightKnee: [
      guard.rightLeg.knee.x + rightKneeSwing,
      guard.rightLeg.knee.y,
      guard.rightLeg.knee.z,
    ],
    rightAnkle: [
      guard.rightLeg.ankle.x,
      guard.rightLeg.ankle.y,
      guard.rightLeg.ankle.z,
    ],
  };
}

/**
 * Get torso and pelvis rotations with walk sway for a trigram stance
 *
 * Combines the trigram's guard torso/pelvis with locomotion sway.
 * Each trigram has distinct torso rotation for their fighting style.
 *
 * @param stance - Trigram stance
 * @param pelvisTiltOffset - Forward/back tilt offset
 * @param pelvisRotateOffset - Left/right rotation offset
 * @param torsoTiltOffset - Forward/back tilt offset
 * @returns Torso and pelvis rotation values
 *
 * @korean 걷기몸통스윙가져오기
 */
function getWalkBodySway(
  stance: TrigramStance,
  pelvisTiltOffset: number,
  pelvisRotateOffset: number,
  torsoTiltOffset: number
): {
  pelvis: [number, number, number];
  torso: [number, number, number];
} {
  const guard = TRIGRAM_GUARD_POSES[stance];

  return {
    pelvis: [
      guard.pelvis.x + pelvisTiltOffset,
      guard.pelvis.y + pelvisRotateOffset,
      guard.pelvis.z,
    ],
    torso: [guard.torso.x + torsoTiltOffset, guard.torso.y, guard.torso.z],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON (건) - HEAVEN: Direct, Powerful Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Walk - 건보법
 * Forward-weighted walk with high guard, authoritative stride
 * Stance width: 1.35x shoulder width for power generation
 *
 * Uses GEON_HIGH_GUARD_POSE arm positions with walk swing applied
 */
export const GEON_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GEON, 0.2, -0.1); // Left forward
  const arms1 = getWalkArmSwing(TrigramStance.GEON, 0.1, 0); // Neutral
  const arms2 = getWalkArmSwing(TrigramStance.GEON, -0.1, 0.2); // Right forward

  return (
    MartialArtsAnimationBuilder.create("walk_geon", "건보법")
      .asMovement(0.75, true)
      // Start: Right foot forward, left arm forward (high guard maintained)
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
      .rotate(BoneName.HIP_L, -0.25, 0, 0)
      .rotate(BoneName.KNEE_L, -0.15, 0, 0)
      .rotate(BoneName.HIP_R, 0.35, 0, 0)
      .rotate(BoneName.KNEE_R, -0.25, 0, 0)
      // Arms from trigram guard with swing
      .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0)
      .position(BoneName.PELVIS, 0, 0.02, 0.02)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      // Mid stride
      .at(0.375, "linear")
      .rotate(BoneName.PELVIS, 0, 0, 0)
      .rotate(BoneName.HIP_L, 0.1, 0, 0)
      .rotate(BoneName.KNEE_L, -0.6, 0, 0)
      .rotate(BoneName.HIP_R, -0.1, 0, 0)
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.04, 0.02)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      // Left foot forward
      .at(0.75, "ease-out")
      .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
      .rotate(BoneName.HIP_R, -0.25, 0, 0)
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      .rotate(BoneName.HIP_L, 0.35, 0, 0)
      .rotate(BoneName.KNEE_L, -0.25, 0, 0)
      // Arms from trigram guard with swing (mirrored)
      .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
      .position(BoneName.PELVIS, 0, 0.02, 0.02)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .build()
  );
})();

/**
 * Geon Run - 건질주
 * Powerful forward charge with aggressive posture
 * Stance width: 1.35x shoulder width maintained during run
 *
 * Uses GEON_HIGH_GUARD_POSE arm positions with enhanced run swing
 */
export const GEON_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GEON, 0.5, -0.4); // Big swing left forward
  const arms1 = getWalkArmSwing(TrigramStance.GEON, 0.3, 0.3); // Both pulled back
  const arms2 = getWalkArmSwing(TrigramStance.GEON, -0.4, 0.5); // Big swing right forward

  return (
    MartialArtsAnimationBuilder.create("run_geon", "건질주")
      .asMovement(0.45, true)
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.2, 0.08, 0)
      .rotate(BoneName.HIP_L, -0.5, 0, 0)
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.HIP_R, 0.7, 0, 0)
      .rotate(BoneName.KNEE_R, -1.0, 0, 0)
      // Arms from trigram guard with run swing
      .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.15, 0, 0)
      .position(BoneName.PELVIS, 0, 0.05, 0.05)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .at(0.225, "linear")
      .rotate(BoneName.PELVIS, 0.15, 0, 0)
      .rotate(BoneName.HIP_L, 0.2, 0, 0)
      .rotate(BoneName.KNEE_L, -1.2, 0, 0)
      .rotate(BoneName.HIP_R, -0.3, 0, 0)
      .rotate(BoneName.KNEE_R, -0.3, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.08, 0.05)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .at(0.45, "ease-out")
      .rotate(BoneName.PELVIS, 0.2, -0.08, 0)
      .rotate(BoneName.HIP_R, -0.5, 0, 0)
      .rotate(BoneName.KNEE_R, -0.2, 0, 0)
      .rotate(BoneName.HIP_L, 0.7, 0, 0)
      .rotate(BoneName.KNEE_L, -1.0, 0, 0)
      // Arms from trigram guard with run swing (mirrored)
      .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
      .position(BoneName.PELVIS, 0, 0.05, 0.05)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .build()
  );
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE (태) - LAKE: Fluid, Adaptive Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Walk - 태보법
 * Light, cat-like walk with 90/10 weight on back foot
 *
 * Uses TAE_FLUID_GUARD_POSE arm positions - lead hand forward for grappling
 */
export const TAE_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.TAE, 0.15, -0.1);
  const arms1 = getWalkArmSwing(TrigramStance.TAE, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.TAE, -0.1, 0.15);

  return (
    MartialArtsAnimationBuilder.create("walk_tae", "태보법")
      .asMovement(0.85, true)
      .at(0.0, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.05, 0.08, 0)
      .rotate(BoneName.HIP_L, -0.15, 0, -0.1)
      .rotate(BoneName.KNEE_L, -0.4, 0, 0)
      .rotate(BoneName.HIP_R, 0.2, 0, 0.1)
      .rotate(BoneName.KNEE_R, -0.1, 0, 0)
      .rotate(BoneName.FOOT_R, 0.2, 0, 0)
      // Fluid guard from TAE_FLUID_GUARD_POSE
      .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0, 0.05, 0)
      .position(BoneName.PELVIS, 0, -0.02, -0.02)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .at(0.425, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.03, 0, 0)
      .rotate(BoneName.HIP_L, 0.15, 0, 0)
      .rotate(BoneName.KNEE_L, -0.5, 0, 0)
      .rotate(BoneName.HIP_R, -0.1, 0, 0)
      .rotate(BoneName.KNEE_R, -0.35, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.01, -0.02)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .at(0.85, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.05, -0.08, 0)
      .rotate(BoneName.HIP_R, -0.15, 0, 0.1)
      .rotate(BoneName.KNEE_R, -0.4, 0, 0)
      .rotate(BoneName.HIP_L, 0.2, 0, -0.1)
      .rotate(BoneName.KNEE_L, -0.1, 0, 0)
      .rotate(BoneName.FOOT_L, 0.2, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
      .rotate(BoneName.SPINE_UPPER, 0, -0.05, 0)
      .position(BoneName.PELVIS, 0, -0.02, -0.02)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .build()
  );
})();

/**
 * Tae Run - 태질주
 * Flowing, evasive run with quick direction changes
 *
 * Uses TAE_FLUID_GUARD_POSE arm positions with run swing
 */
export const TAE_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.TAE, 0.4, -0.3);
  const arms1 = getWalkArmSwing(TrigramStance.TAE, 0.2, 0.2);
  const arms2 = getWalkArmSwing(TrigramStance.TAE, -0.3, 0.4);

  return MartialArtsAnimationBuilder.create("run_tae", "태질주")
    .asMovement(0.5, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.05, 0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.25, "linear")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.5, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ LI (리) - FIRE: Quick, Precise Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Li Walk - 리보법
 * Quick, bouncy walk with rapid foot placement
 *
 * Uses LI_FIRE_GUARD_POSE - peekaboo guard protecting face
 */
export const LI_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.LI, 0.1, -0.08);
  const arms1 = getWalkArmSwing(TrigramStance.LI, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.LI, -0.08, 0.1);

  return (
    MartialArtsAnimationBuilder.create("walk_li", "리보법")
      .asMovement(0.65, true)
      .at(0.0, "linear")
      .rotate(BoneName.PELVIS, 0.08, 0.06, 0)
      .rotate(BoneName.HIP_L, -0.2, 0, 0)
      .rotate(BoneName.KNEE_L, -0.15, 0, 0)
      .rotate(BoneName.HIP_R, 0.3, 0, 0)
      .rotate(BoneName.KNEE_R, -0.2, 0, 0)
      // Peekaboo guard from LI_FIRE_GUARD_POSE
      .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.03, 0, 0)
      .position(BoneName.PELVIS, 0, 0.03, 0.01)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .at(0.325, "linear")
      .rotate(BoneName.PELVIS, 0.05, 0, 0)
      .rotate(BoneName.HIP_L, 0.1, 0, 0)
      .rotate(BoneName.KNEE_L, -0.5, 0, 0)
      .rotate(BoneName.HIP_R, -0.1, 0, 0)
      .rotate(BoneName.KNEE_R, -0.12, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.05, 0.01)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .at(0.65, "linear")
      .rotate(BoneName.PELVIS, 0.08, -0.06, 0)
      .rotate(BoneName.HIP_R, -0.2, 0, 0)
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      .rotate(BoneName.HIP_L, 0.3, 0, 0)
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
      .position(BoneName.PELVIS, 0, 0.03, 0.01)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM
      )
      .build()
  );
})();

/**
 * Li Run - 리질주
 * Explosive sprint with precision footwork
 *
 * Uses LI_FIRE_GUARD_POSE arm positions with run swing
 */
export const LI_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.LI, 0.4, -0.35);
  const arms1 = getWalkArmSwing(TrigramStance.LI, 0.2, 0.2);
  const arms2 = getWalkArmSwing(TrigramStance.LI, -0.35, 0.4);

  return MartialArtsAnimationBuilder.create("run_li", "리질주")
    .asMovement(0.4, true)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0.18, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.45, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.65, 0, 0)
    .rotate(BoneName.KNEE_R, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0.06, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.2, "linear")
    .rotate(BoneName.PELVIS, 0.12, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -1.15, 0, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .position(BoneName.PELVIS, 0, 0.09, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.4, "linear")
    .rotate(BoneName.PELVIS, 0.18, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.45, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.65, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, 0.06, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN (진) - THUNDER: Explosive, Sudden Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Walk - 진보법
 * Explosive step-and-ready walk, prepared to strike
 *
 * Uses JIN_THUNDER_GUARD_POSE arm positions with walk swing
 */
export const JIN_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.JIN, 0.2, -0.15);
  const arms1 = getWalkArmSwing(TrigramStance.JIN, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.JIN, -0.15, 0.2);

  return MartialArtsAnimationBuilder.create("walk_jin", "진보법")
    .asMovement(0.7, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.12, 0.06, 0)
    .rotate(BoneName.HIP_L, -0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.HIP_R, 0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.35, "ease-in")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.15, 0, 0)
    .rotate(BoneName.KNEE_L, -0.6, 0, 0)
    .rotate(BoneName.HIP_R, -0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.02, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.7, "ease-out")
    .rotate(BoneName.PELVIS, 0.12, -0.06, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.HIP_L, 0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, -0.01, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

/**
 * Jin Run - 진질주
 * Thunderous charge with explosive power
 *
 * Uses JIN_THUNDER_GUARD_POSE arm positions with run swing
 */
export const JIN_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.JIN, 0.5, -0.45);
  const arms1 = getWalkArmSwing(TrigramStance.JIN, 0.2, 0.2);
  const arms2 = getWalkArmSwing(TrigramStance.JIN, -0.45, 0.5);

  return MartialArtsAnimationBuilder.create("run_jin", "진질주")
    .asMovement(0.42, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.22, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.55, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.75, 0, 0)
    .rotate(BoneName.KNEE_R, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.18, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.21, "linear")
    .rotate(BoneName.PELVIS, 0.16, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -1.25, 0, 0)
    .rotate(BoneName.HIP_R, -0.35, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.08, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.42, "ease-out")
    .rotate(BoneName.PELVIS, 0.22, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.55, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.75, 0, 0)
    .rotate(BoneName.KNEE_L, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, 0.04, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON (손) - WIND: Continuous, Flowing Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Walk - 손보법
 * Gentle, continuous flow walk like wind through trees
 *
 * Uses SON_WIND_GUARD_POSE arm positions with walk swing
 */
export const SON_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.SON, 0.15, -0.12);
  const arms1 = getWalkArmSwing(TrigramStance.SON, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.SON, -0.12, 0.15);

  return MartialArtsAnimationBuilder.create("walk_son", "손보법")
    .asMovement(0.9, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.06, 0.04, 0)
    .rotate(BoneName.HIP_L, -0.18, 0, 0)
    .rotate(BoneName.KNEE_L, -0.12, 0, 0)
    .rotate(BoneName.HIP_R, 0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.02, 0.03, 0)
    .position(BoneName.PELVIS, 0, 0.01, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.45, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.04, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.HIP_R, -0.08, 0, 0)
    .rotate(BoneName.KNEE_R, -0.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.9, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.06, -0.04, 0)
    .rotate(BoneName.HIP_R, -0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .rotate(BoneName.SPINE_UPPER, 0.02, -0.03, 0)
    .position(BoneName.PELVIS, 0, 0.01, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

/**
 * Son Run - 손질주
 * Swift, gliding run like wind rushing
 *
 * Uses SON_WIND_GUARD_POSE arm positions with run swing
 */
export const SON_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.SON, 0.35, -0.3);
  const arms1 = getWalkArmSwing(TrigramStance.SON, 0.15, 0.15);
  const arms2 = getWalkArmSwing(TrigramStance.SON, -0.3, 0.35);

  return MartialArtsAnimationBuilder.create("run_son", "손질주")
    .asMovement(0.48, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.14, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.85, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.04, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.24, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.07, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.48, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.14, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.85, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .rotate(BoneName.SPINE_UPPER, 0.08, -0.04, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM (감) - WATER: Adaptive, Redirecting Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Walk - 감보법
 * Flowing, adaptive walk that goes around obstacles
 *
 * Uses GAM_WATER_GUARD_POSE arm positions with walk swing
 */
export const GAM_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GAM, 0.12, -0.1);
  const arms1 = getWalkArmSwing(TrigramStance.GAM, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.GAM, -0.1, 0.12);

  return MartialArtsAnimationBuilder.create("walk_gam", "감보법")
    .asMovement(0.88, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.05, 0.06, 0.02)
    .rotate(BoneName.HIP_L, -0.2, 0, -0.05)
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.HIP_R, 0.28, 0, 0.05)
    .rotate(BoneName.KNEE_R, -0.18, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0, 0.04, 0.02)
    .position(BoneName.PELVIS, 0.01, 0, -0.01)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.44, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.03, 0, 0)
    .rotate(BoneName.HIP_L, 0.12, 0, 0)
    .rotate(BoneName.KNEE_L, -0.45, 0, 0)
    .rotate(BoneName.HIP_R, -0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, -0.01)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.88, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.05, -0.06, -0.02)
    .rotate(BoneName.HIP_R, -0.2, 0, 0.05)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.HIP_L, 0.28, 0, -0.05)
    .rotate(BoneName.KNEE_L, -0.18, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .rotate(BoneName.SPINE_UPPER, 0, -0.04, -0.02)
    .position(BoneName.PELVIS, -0.01, 0, -0.01)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

/**
 * Gam Run - 감질주
 * Fluid run that flows like water around obstacles
 *
 * Uses GAM_WATER_GUARD_POSE arm positions with run swing
 */
export const GAM_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GAM, 0.3, -0.25);
  const arms1 = getWalkArmSwing(TrigramStance.GAM, 0.12, 0.12);
  const arms2 = getWalkArmSwing(TrigramStance.GAM, -0.25, 0.3);

  return MartialArtsAnimationBuilder.create("run_gam", "감질주")
    .asMovement(0.52, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, 0.1, 0.03)
    .rotate(BoneName.HIP_L, -0.38, 0, 0)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0)
    .rotate(BoneName.HIP_R, 0.58, 0, 0)
    .rotate(BoneName.KNEE_R, -0.82, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.06, 0.05, 0.02)
    .position(BoneName.PELVIS, 0.02, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.26, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.22, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.HIP_R, -0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.22, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.52, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, -0.1, -0.03)
    .rotate(BoneName.HIP_R, -0.38, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .rotate(BoneName.HIP_L, 0.58, 0, 0)
    .rotate(BoneName.KNEE_L, -0.82, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .rotate(BoneName.SPINE_UPPER, 0.06, -0.05, -0.02)
    .position(BoneName.PELVIS, -0.02, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN (간) - MOUNTAIN: Stable, Grounded Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Walk - 간보법
 * Solid, immovable walk with defensive posture
 *
 * Uses GAN_MOUNTAIN_GUARD_POSE arm positions with walk swing
 */
export const GAN_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GAN, 0.1, -0.08);
  const arms1 = getWalkArmSwing(TrigramStance.GAN, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.GAN, -0.08, 0.1);

  return MartialArtsAnimationBuilder.create("walk_gan", "간보법")
    .asMovement(0.95, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.08, 0.04, 0)
    .rotate(BoneName.HIP_L, -0.22, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.04, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.06, 0, 0)
    .position(BoneName.PELVIS, 0, -0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.475, "linear")
    .rotate(BoneName.PELVIS, 0.06, 0, 0)
    .rotate(BoneName.HIP_L, 0.08, 0, 0)
    .rotate(BoneName.KNEE_L, -0.5, 0, 0)
    .rotate(BoneName.HIP_R, -0.05, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, -0.01, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.95, "ease-out")
    .rotate(BoneName.PELVIS, 0.08, -0.04, 0)
    .rotate(BoneName.HIP_R, -0.22, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, -0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

/**
 * Gan Run - 간질주
 * Heavy, unstoppable charge like an avalanche
 *
 * Uses GAN_MOUNTAIN_GUARD_POSE arm positions with run swing
 */
export const GAN_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GAN, 0.3, -0.25);
  const arms1 = getWalkArmSwing(TrigramStance.GAN, 0.12, 0.12);
  const arms2 = getWalkArmSwing(TrigramStance.GAN, -0.25, 0.3);

  return MartialArtsAnimationBuilder.create("run_gan", "간질주")
    .asMovement(0.55, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.18, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.45, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.HIP_R, 0.65, 0, 0)
    .rotate(BoneName.KNEE_R, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.275, "linear")
    .rotate(BoneName.PELVIS, 0.14, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.05, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.55, "ease-out")
    .rotate(BoneName.PELVIS, 0.18, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.45, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.HIP_L, 0.65, 0, 0)
    .rotate(BoneName.KNEE_L, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, 0.02, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON (곤) - EARTH: Heavy, Rooted Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Walk - 곤보법
 * Heavy, rooted walk with low center of gravity
 *
 * Uses GON_EARTH_GUARD_POSE arm positions with walk swing
 */
export const GON_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GON, 0.08, -0.06);
  const arms1 = getWalkArmSwing(TrigramStance.GON, 0, 0);
  const arms2 = getWalkArmSwing(TrigramStance.GON, -0.06, 0.08);

  return MartialArtsAnimationBuilder.create("walk_gon", "곤보법")
    .asMovement(1.0, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
    .rotate(BoneName.HIP_L, -0.25, 0, -0.08)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.HIP_R, 0.35, 0, 0.08)
    .rotate(BoneName.KNEE_R, -0.38, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.06, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, -0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.5, "linear")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.55, 0, 0)
    .rotate(BoneName.HIP_R, -0.08, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, -0.04, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(1.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0.08)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.HIP_L, 0.35, 0, -0.08)
    .rotate(BoneName.KNEE_L, -0.38, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, -0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

/**
 * Gon Run - 곤질주
 * Powerful, earthshaking run
 *
 * Uses GON_EARTH_GUARD_POSE arm positions with run swing
 */
export const GON_RUN_ANIMATION: SkeletalAnimation = (() => {
  const arms0 = getWalkArmSwing(TrigramStance.GON, 0.25, -0.22);
  const arms1 = getWalkArmSwing(TrigramStance.GON, 0.1, 0.1);
  const arms2 = getWalkArmSwing(TrigramStance.GON, -0.22, 0.25);

  return MartialArtsAnimationBuilder.create("run_gon", "곤질주")
    .asMovement(0.58, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.HIP_R, 0.7, 0, 0)
    .rotate(BoneName.KNEE_R, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms0.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms0.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms0.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms0.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.14, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.29, "linear")
    .rotate(BoneName.PELVIS, 0.16, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -1.1, 0, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms1.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms1.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms1.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms1.rightElbow)
    .position(BoneName.PELVIS, 0, 0.04, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .at(0.58, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.5, 0, 0)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.HIP_L, 0.7, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_R, ...arms2.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms2.rightElbow)
    .rotate(BoneName.SHOULDER_L, ...arms2.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms2.leftElbow)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION MAPS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all stance-specific walk animations
 * @korean 자세별걷기애니메이션맵
 */
export const STANCE_WALK_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["walk_geon", GEON_WALK_ANIMATION],
    ["walk_tae", TAE_WALK_ANIMATION],
    ["walk_li", LI_WALK_ANIMATION],
    ["walk_jin", JIN_WALK_ANIMATION],
    ["walk_son", SON_WALK_ANIMATION],
    ["walk_gam", GAM_WALK_ANIMATION],
    ["walk_gan", GAN_WALK_ANIMATION],
    ["walk_gon", GON_WALK_ANIMATION],
  ]);

/**
 * Map of all stance-specific run animations
 * @korean 자세별달리기애니메이션맵
 */
export const STANCE_RUN_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["run_geon", GEON_RUN_ANIMATION],
    ["run_tae", TAE_RUN_ANIMATION],
    ["run_li", LI_RUN_ANIMATION],
    ["run_jin", JIN_RUN_ANIMATION],
    ["run_son", SON_RUN_ANIMATION],
    ["run_gam", GAM_RUN_ANIMATION],
    ["run_gan", GAN_RUN_ANIMATION],
    ["run_gon", GON_RUN_ANIMATION],
  ]);

/**
 * Combined map of all stance locomotion animations
 * @korean 자세별이동애니메이션통합맵
 */
export const STANCE_LOCOMOTION_ANIMATIONS: ReadonlyMap<
  string,
  SkeletalAnimation
> = new Map([...STANCE_WALK_ANIMATIONS, ...STANCE_RUN_ANIMATIONS]);

/**
 * Get stance-specific walk animation
 * @param stance - Trigram stance name (geon, tae, li, etc.)
 * @returns Walk animation for that stance
 */
export function getStanceWalkAnimation(
  stance: string
): SkeletalAnimation | undefined {
  return STANCE_WALK_ANIMATIONS.get(`walk_${stance}`);
}

/**
 * Get stance-specific run animation
 * @param stance - Trigram stance name (geon, tae, li, etc.)
 * @returns Run animation for that stance
 */
export function getStanceRunAnimation(
  stance: string
): SkeletalAnimation | undefined {
  return STANCE_RUN_ANIMATIONS.get(`run_${stance}`);
}
