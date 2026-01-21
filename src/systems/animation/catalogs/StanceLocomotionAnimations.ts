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
  rightSwing: number,
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
// SINGLE STEP WALK DESIGN (단일 보행 설계)
// ═══════════════════════════════════════════════════════════════════════════
/**
 * WALK ANIMATION DESIGN PHILOSOPHY:
 *
 * Walk animations are SINGLE STEPS that change foot laterality.
 * Each walk animation:
 * 1. Starts with one foot forward (e.g., left foot front)
 * 2. Steps forward with the rear foot
 * 3. Ends with the other foot forward (e.g., right foot front)
 *
 * This is NOT a continuous walk cycle - it's a discrete step that
 * transitions between two stable idle poses with opposite foot laterality.
 *
 * The animation should:
 * - Duration: 0.4-0.6s for a single step (longer = more deliberate)
 * - NOT loop (loops: false)
 * - End in a stable stance ready for another action
 * - Maintain guard position throughout (no wild arm swings)
 *
 * RUN ANIMATION DESIGN PHILOSOPHY:
 *
 * Run animations are CONTINUOUS LOOPING cycles.
 * Trained fighters maintain guard pose during running:
 * - Arms stay in guard position (NO arm swing)
 * - Only legs show running motion
 * - This allows immediate combat readiness
 *
 * @korean 단일보행설계철학
 */

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON (건) - HEAVEN: Direct, Powerful Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Walk - 건보법
 * SINGLE STEP: Powerful authoritative stride, changes foot laterality
 *
 * Start: Left foot forward, right foot back
 * End: Right foot forward, left foot back (reversed laterality)
 *
 * Maintains high guard throughout the step
 */
export const GEON_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.GEON, 0, 0); // Guard position maintained

  return (
    MartialArtsAnimationBuilder.create("walk_geon", "건보법")
      .asMovement(0.5, false) // Single step, NOT looping
      // Start: Left foot forward (standard stance laterality)
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
      .rotate(BoneName.HIP_L, 0.35, 0, 0) // Left forward
      .rotate(BoneName.KNEE_L, -0.25, 0, 0)
      .rotate(BoneName.HIP_R, -0.25, 0, 0) // Right back
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      // Arms maintain guard
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase (feet together, weight shifting)
      .at(0.25, "linear")
      .rotate(BoneName.PELVIS, 0, 0, 0)
      .rotate(BoneName.HIP_L, 0, 0, 0) // Feet passing
      .rotate(BoneName.KNEE_L, -0.5, 0, 0) // Lift rear foot
      .rotate(BoneName.HIP_R, 0.2, 0, 0) // Stepping forward
      .rotate(BoneName.KNEE_R, -0.6, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.03, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward (reversed laterality)
      .at(0.5, "ease-out")
      .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
      .rotate(BoneName.HIP_R, 0.35, 0, 0) // Right now forward
      .rotate(BoneName.KNEE_R, -0.25, 0, 0)
      .rotate(BoneName.HIP_L, -0.25, 0, 0) // Left now back
      .rotate(BoneName.KNEE_L, -0.15, 0, 0)
      // Arms maintain guard
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
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
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.GEON, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("run_geon", "건질주")
      .asMovement(0.45, true)
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.2, 0.08, 0)
      .rotate(BoneName.HIP_L, -0.5, 0, 0)
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.HIP_R, 0.7, 0, 0)
      .rotate(BoneName.KNEE_R, -1.0, 0, 0)
      // Arms maintain guard pose throughout
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.15, 0, 0)
      .position(BoneName.PELVIS, 0, 0.05, 0.05)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .at(0.225, "linear")
      .rotate(BoneName.PELVIS, 0.15, 0, 0)
      .rotate(BoneName.HIP_L, 0.2, 0, 0)
      .rotate(BoneName.KNEE_L, -1.2, 0, 0)
      .rotate(BoneName.HIP_R, -0.3, 0, 0)
      .rotate(BoneName.KNEE_R, -0.3, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .position(BoneName.PELVIS, 0, 0.08, 0.05)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .at(0.45, "ease-out")
      .rotate(BoneName.PELVIS, 0.2, -0.08, 0)
      .rotate(BoneName.HIP_R, -0.5, 0, 0)
      .rotate(BoneName.KNEE_R, -0.2, 0, 0)
      .rotate(BoneName.HIP_L, 0.7, 0, 0)
      .rotate(BoneName.KNEE_L, -1.0, 0, 0)
      // Arms maintain guard pose throughout
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .position(BoneName.PELVIS, 0, 0.05, 0.05)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .build()
  );
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE (태) - LAKE: Fluid, Adaptive Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Walk - 태보법
 * SINGLE STEP: Light cat-like step with 90/10 weight on back foot
 *
 * Start: Left foot forward
 * End: Right foot forward (reversed laterality)
 *
 * Maintains fluid guard throughout
 */
export const TAE_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.TAE, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_tae", "태보법")
      .asMovement(0.55, false) // Single step, NOT looping
      // Start: Left foot forward (cat stance)
      .at(0.0, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.05, 0.08, 0)
      .rotate(BoneName.HIP_L, 0.2, 0, -0.1) // Left forward
      .rotate(BoneName.KNEE_L, -0.1, 0, 0)
      .rotate(BoneName.FOOT_L, 0.2, 0, 0)
      .rotate(BoneName.HIP_R, -0.15, 0, 0.1) // Right back (weight)
      .rotate(BoneName.KNEE_R, -0.4, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0, 0.05, 0)
      .position(BoneName.PELVIS, 0, -0.02, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase
      .at(0.275, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.03, 0, 0)
      .rotate(BoneName.HIP_L, -0.1, 0, 0)
      .rotate(BoneName.KNEE_L, -0.35, 0, 0)
      .rotate(BoneName.HIP_R, 0.15, 0, 0)
      .rotate(BoneName.KNEE_R, -0.5, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.01, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward (reversed laterality)
      .at(0.55, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.05, -0.08, 0)
      .rotate(BoneName.HIP_R, 0.2, 0, 0.1) // Right now forward
      .rotate(BoneName.KNEE_R, -0.1, 0, 0)
      .rotate(BoneName.FOOT_R, 0.2, 0, 0)
      .rotate(BoneName.HIP_L, -0.15, 0, -0.1) // Left now back
      .rotate(BoneName.KNEE_L, -0.4, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SPINE_UPPER, 0, -0.05, 0)
      .position(BoneName.PELVIS, 0, -0.02, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
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
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.TAE, 0, 0);

  return MartialArtsAnimationBuilder.create("run_tae", "태질주")
    .asMovement(0.5, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.05, 0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.25, "linear")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.5, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.TAE_LAKE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ LI (리) - FIRE: Quick, Precise Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Li Walk - 리보법
 * SINGLE STEP: Quick precise step with minimal movement
 *
 * Start: Left foot forward
 * End: Right foot forward (reversed laterality)
 *
 * Maintains peekaboo guard throughout
 */
export const LI_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.LI, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_li", "리보법")
      .asMovement(0.45, false) // Single step, fast and precise
      // Start: Left foot forward
      .at(0.0, "linear")
      .rotate(BoneName.PELVIS, 0.08, 0.06, 0)
      .rotate(BoneName.HIP_L, 0.3, 0, 0) // Left forward
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.HIP_R, -0.2, 0, 0) // Right back
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.03, 0, 0)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase (quick)
      .at(0.225, "linear")
      .rotate(BoneName.PELVIS, 0.05, 0, 0)
      .rotate(BoneName.HIP_L, -0.1, 0, 0)
      .rotate(BoneName.KNEE_L, -0.12, 0, 0)
      .rotate(BoneName.HIP_R, 0.1, 0, 0)
      .rotate(BoneName.KNEE_R, -0.5, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .position(BoneName.PELVIS, 0, 0.03, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward
      .at(0.45, "linear")
      .rotate(BoneName.PELVIS, 0.08, -0.06, 0)
      .rotate(BoneName.HIP_R, 0.3, 0, 0) // Right now forward
      .rotate(BoneName.KNEE_R, -0.2, 0, 0)
      .rotate(BoneName.HIP_L, -0.2, 0, 0) // Left now back
      .rotate(BoneName.KNEE_L, -0.15, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
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
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.LI, 0, 0);

  return MartialArtsAnimationBuilder.create("run_li", "리질주")
    .asMovement(0.4, true)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0.18, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.45, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.65, 0, 0)
    .rotate(BoneName.KNEE_R, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0.06, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.2, "linear")
    .rotate(BoneName.PELVIS, 0.12, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -1.15, 0, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.09, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.4, "linear")
    .rotate(BoneName.PELVIS, 0.18, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.45, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.65, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.06, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.LI_FIRE.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
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
  const arms = getWalkArmSwing(TrigramStance.JIN, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_jin", "진보법")
      .asMovement(0.5, false) // Single step, coiled energy
      // Start: Left foot forward
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.12, 0.06, 0)
      .rotate(BoneName.HIP_L, 0.4, 0, 0) // Left forward
      .rotate(BoneName.KNEE_L, -0.3, 0, 0)
      .rotate(BoneName.HIP_R, -0.3, 0, 0) // Right back
      .rotate(BoneName.KNEE_R, -0.2, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
      .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0)
      .position(BoneName.PELVIS, 0, -0.01, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase
      .at(0.25, "ease-in")
      .rotate(BoneName.PELVIS, 0.08, 0, 0)
      .rotate(BoneName.HIP_L, -0.15, 0, 0)
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.HIP_R, 0.15, 0, 0)
      .rotate(BoneName.KNEE_R, -0.6, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .position(BoneName.PELVIS, 0, 0.02, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward
      .at(0.5, "ease-out")
      .rotate(BoneName.PELVIS, 0.12, -0.06, 0)
      .rotate(BoneName.HIP_R, 0.4, 0, 0) // Right now forward
      .rotate(BoneName.KNEE_R, -0.3, 0, 0)
      .rotate(BoneName.HIP_L, -0.3, 0, 0) // Left now back
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .position(BoneName.PELVIS, 0, -0.01, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .build()
  );
})();

/**
 * Jin Run - 진질주
 * Thunderous charge with explosive power
 *
 * Uses JIN_THUNDER_GUARD_POSE arm positions with run swing
 */
export const JIN_RUN_ANIMATION: SkeletalAnimation = (() => {
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.JIN, 0, 0);

  return MartialArtsAnimationBuilder.create("run_jin", "진질주")
    .asMovement(0.42, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.22, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.55, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.75, 0, 0)
    .rotate(BoneName.KNEE_R, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.18, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.21, "linear")
    .rotate(BoneName.PELVIS, 0.16, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -1.25, 0, 0)
    .rotate(BoneName.HIP_R, -0.35, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.08, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.42, "ease-out")
    .rotate(BoneName.PELVIS, 0.22, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.55, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.75, 0, 0)
    .rotate(BoneName.KNEE_L, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.04, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON (손) - WIND: Continuous, Flowing Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Walk - 손보법
 * SINGLE STEP: Gentle flowing step like wind through trees
 *
 * Start: Left foot forward
 * End: Right foot forward (reversed laterality)
 */
export const SON_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.SON, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_son", "손보법")
      .asMovement(0.55, false) // Single flowing step
      // Start: Left foot forward
      .at(0.0, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.06, 0.04, 0)
      .rotate(BoneName.HIP_L, 0.25, 0, 0) // Left forward
      .rotate(BoneName.KNEE_L, -0.15, 0, 0)
      .rotate(BoneName.HIP_R, -0.18, 0, 0) // Right back
      .rotate(BoneName.KNEE_R, -0.12, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.02, 0.03, 0)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase
      .at(0.275, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.04, 0, 0)
      .rotate(BoneName.HIP_L, -0.08, 0, 0)
      .rotate(BoneName.KNEE_L, -0.1, 0, 0)
      .rotate(BoneName.HIP_R, 0.1, 0, 0)
      .rotate(BoneName.KNEE_R, -0.4, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .position(BoneName.PELVIS, 0, 0.02, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward
      .at(0.55, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.06, -0.04, 0)
      .rotate(BoneName.HIP_R, 0.25, 0, 0) // Right now forward
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      .rotate(BoneName.HIP_L, -0.18, 0, 0) // Left now back
      .rotate(BoneName.KNEE_L, -0.12, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SPINE_UPPER, 0.02, -0.03, 0)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .build()
  );
})();

/**
 * Son Run - 손질주
 * Swift, gliding run like wind rushing
 *
 * Uses SON_WIND_GUARD_POSE arm positions with run swing
 */
export const SON_RUN_ANIMATION: SkeletalAnimation = (() => {
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.SON, 0, 0);

  return MartialArtsAnimationBuilder.create("run_son", "손질주")
    .asMovement(0.48, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.14, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.85, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.04, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.24, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.07, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.48, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.14, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.85, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.08, -0.04, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.SON_WIND.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM (감) - WATER: Adaptive, Redirecting Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Walk - 감보법
 * SINGLE STEP: Flowing adaptive step that flows around obstacles
 *
 * Start: Left foot forward
 * End: Right foot forward (reversed laterality)
 */
export const GAM_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.GAM, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_gam", "감보법")
      .asMovement(0.55, false) // Single flowing step
      // Start: Left foot forward
      .at(0.0, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.05, 0.06, 0.02)
      .rotate(BoneName.HIP_L, 0.28, 0, -0.05) // Left forward
      .rotate(BoneName.KNEE_L, -0.18, 0, 0)
      .rotate(BoneName.HIP_R, -0.2, 0, 0.05) // Right back
      .rotate(BoneName.KNEE_R, -0.15, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0, 0.04, 0.02)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase
      .at(0.275, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.03, 0, 0)
      .rotate(BoneName.HIP_L, -0.1, 0, 0)
      .rotate(BoneName.KNEE_L, -0.12, 0, 0)
      .rotate(BoneName.HIP_R, 0.12, 0, 0)
      .rotate(BoneName.KNEE_R, -0.45, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
      .position(BoneName.PELVIS, 0, 0.02, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward
      .at(0.55, "ease-in-out")
      .rotate(BoneName.PELVIS, 0.05, -0.06, -0.02)
      .rotate(BoneName.HIP_R, 0.28, 0, 0.05) // Right now forward
      .rotate(BoneName.KNEE_R, -0.18, 0, 0)
      .rotate(BoneName.HIP_L, -0.2, 0, -0.05) // Left now back
      .rotate(BoneName.KNEE_L, -0.15, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SPINE_UPPER, 0, -0.04, -0.02)
      .position(BoneName.PELVIS, 0, 0, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .build()
  );
})();

/**
 * Gam Run - 감질주
 * Fluid run that flows like water around obstacles
 *
 * Uses GAM_WATER_GUARD_POSE arm positions with run swing
 */
export const GAM_RUN_ANIMATION: SkeletalAnimation = (() => {
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.GAM, 0, 0);

  return MartialArtsAnimationBuilder.create("run_gam", "감질주")
    .asMovement(0.52, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, 0.1, 0.03)
    .rotate(BoneName.HIP_L, -0.38, 0, 0)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0)
    .rotate(BoneName.HIP_R, 0.58, 0, 0)
    .rotate(BoneName.KNEE_R, -0.82, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.06, 0.05, 0.02)
    .position(BoneName.PELVIS, 0.02, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.26, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.22, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.HIP_R, -0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.22, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.52, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, -0.1, -0.03)
    .rotate(BoneName.HIP_R, -0.38, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .rotate(BoneName.HIP_L, 0.58, 0, 0)
    .rotate(BoneName.KNEE_L, -0.82, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.06, -0.05, -0.02)
    .position(BoneName.PELVIS, -0.02, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAM_WATER.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN (간) - MOUNTAIN: Stable, Grounded Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Walk - 간보법
 * SINGLE STEP: Solid immovable step with defensive posture
 *
 * Start: Left foot forward
 * End: Right foot forward (reversed laterality)
 */
export const GAN_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.GAN, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_gan", "간보법")
      .asMovement(0.6, false) // Single grounded step
      // Start: Left foot forward
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.08, 0.04, 0)
      .rotate(BoneName.HIP_L, 0.3, 0, 0) // Left forward
      .rotate(BoneName.KNEE_L, -0.28, 0, 0)
      .rotate(BoneName.HIP_R, -0.22, 0, 0) // Right back
      .rotate(BoneName.KNEE_R, -0.25, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.04, 0, 0)
      .rotate(BoneName.SPINE_LOWER, 0.06, 0, 0)
      .position(BoneName.PELVIS, 0, -0.03, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase (deliberate)
      .at(0.3, "linear")
      .rotate(BoneName.PELVIS, 0.06, 0, 0)
      .rotate(BoneName.HIP_L, -0.05, 0, 0)
      .rotate(BoneName.KNEE_L, -0.2, 0, 0)
      .rotate(BoneName.HIP_R, 0.08, 0, 0)
      .rotate(BoneName.KNEE_R, -0.5, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .position(BoneName.PELVIS, 0, -0.01, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward
      .at(0.6, "ease-out")
      .rotate(BoneName.PELVIS, 0.08, -0.04, 0)
      .rotate(BoneName.HIP_R, 0.3, 0, 0) // Right now forward
      .rotate(BoneName.KNEE_R, -0.28, 0, 0)
      .rotate(BoneName.HIP_L, -0.22, 0, 0) // Left now back
      .rotate(BoneName.KNEE_L, -0.25, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .position(BoneName.PELVIS, 0, -0.03, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .build()
  );
})();

/**
 * Gan Run - 간질주
 * Heavy, unstoppable charge like an avalanche
 *
 * Uses GAN_MOUNTAIN_GUARD_POSE arm positions with run swing
 */
export const GAN_RUN_ANIMATION: SkeletalAnimation = (() => {
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.GAN, 0, 0);

  return MartialArtsAnimationBuilder.create("run_gan", "간질주")
    .asMovement(0.55, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.18, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.45, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.HIP_R, 0.65, 0, 0)
    .rotate(BoneName.KNEE_R, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.275, "linear")
    .rotate(BoneName.PELVIS, 0.14, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.05, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.55, "ease-out")
    .rotate(BoneName.PELVIS, 0.18, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.45, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.HIP_L, 0.65, 0, 0)
    .rotate(BoneName.KNEE_L, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.02, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .build();
})();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON (곤) - EARTH: Heavy, Rooted Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Walk - 곤보법
 * SINGLE STEP: Heavy rooted step with low center of gravity
 *
 * Start: Left foot forward
 * End: Right foot forward (reversed laterality)
 */
export const GON_WALK_ANIMATION: SkeletalAnimation = (() => {
  const arms = getWalkArmSwing(TrigramStance.GON, 0, 0);

  return (
    MartialArtsAnimationBuilder.create("walk_gon", "곤보법")
      .asMovement(0.65, false) // Single heavy step
      // Start: Left foot forward
      .at(0.0, "ease-out")
      .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
      .rotate(BoneName.HIP_L, 0.35, 0, -0.08) // Left forward
      .rotate(BoneName.KNEE_L, -0.38, 0, 0)
      .rotate(BoneName.HIP_R, -0.25, 0, 0.08) // Right back
      .rotate(BoneName.KNEE_R, -0.35, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SPINE_UPPER, 0.06, 0, 0)
      .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
      .position(BoneName.PELVIS, 0, -0.06, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // Mid: Passing phase (heavy)
      .at(0.325, "linear")
      .rotate(BoneName.PELVIS, 0.08, 0, 0)
      .rotate(BoneName.HIP_L, -0.08, 0, 0)
      .rotate(BoneName.KNEE_L, -0.28, 0, 0)
      .rotate(BoneName.HIP_R, 0.1, 0, 0)
      .rotate(BoneName.KNEE_R, -0.55, 0, 0)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .position(BoneName.PELVIS, 0, -0.04, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      // End: Right foot forward
      .at(0.65, "ease-out")
      .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
      .rotate(BoneName.HIP_R, 0.35, 0, 0.08) // Right now forward
      .rotate(BoneName.KNEE_R, -0.38, 0, 0)
      .rotate(BoneName.HIP_L, -0.25, 0, -0.08) // Left now back
      .rotate(BoneName.KNEE_L, -0.35, 0, 0)
      .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
      .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
      .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
      .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
      .position(BoneName.PELVIS, 0, -0.06, 0)
      .done<MartialArtsAnimationBuilder>()
      .withFootWidth(
        KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
        DEFAULT_SHOULDER_WIDTH_CM,
      )
      .build()
  );
})();

/**
 * Gon Run - 곤질주
 * Powerful, earthshaking run
 *
 * Trained fighters maintain guard pose throughout
 */
export const GON_RUN_ANIMATION: SkeletalAnimation = (() => {
  // Trained fighters maintain guard pose - no arm swing
  const arms = getWalkArmSwing(TrigramStance.GON, 0, 0);

  return MartialArtsAnimationBuilder.create("run_gon", "곤질주")
    .asMovement(0.58, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.HIP_R, 0.7, 0, 0)
    .rotate(BoneName.KNEE_R, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .rotate(BoneName.SPINE_UPPER, 0.14, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.29, "linear")
    .rotate(BoneName.PELVIS, 0.16, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -1.1, 0, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0.04, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
    )
    .at(0.58, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.5, 0, 0)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.HIP_L, 0.7, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, ...arms.leftShoulder)
    .rotate(BoneName.ELBOW_L, ...arms.leftElbow)
    .rotate(BoneName.SHOULDER_R, ...arms.rightShoulder)
    .rotate(BoneName.ELBOW_R, ...arms.rightElbow)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .withFootWidth(
      KOREAN_STANCE_BIOMECHANICS.GON_EARTH.stanceWidth,
      DEFAULT_SHOULDER_WIDTH_CM,
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
  stance: string,
): SkeletalAnimation | undefined {
  return STANCE_WALK_ANIMATIONS.get(`walk_${stance}`);
}

/**
 * Get stance-specific run animation
 * @param stance - Trigram stance name (geon, tae, li, etc.)
 * @returns Run animation for that stance
 */
export function getStanceRunAnimation(
  stance: string,
): SkeletalAnimation | undefined {
  return STANCE_RUN_ANIMATIONS.get(`run_${stance}`);
}
