/**
 * ☷ Gon (Earth) Stance-Specific Animations
 *
 * Specialized idle, movement, and guard animations for the Gon (곤/Earth) trigram.
 * Embodies grounding power and takedown mastery from Ssireum wrestling techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 씨름 던지기 기술 (Ssireum Throwing Techniques)
 * - **특성**: 던지기와 넘어뜨리기 (Throws and Takedowns), 지면 제어 (Ground Control)
 * - **철학**: 땅의 포용력 (Earth's Embracing Power), 대지의 안정성 (Ground Stability)
 * - **대표 기술**: 대지포옹 (Earth Embrace/Grounding Takedown)
 *
 * @module systems/animation/catalogs/GonStanceAnimations
 * @category Animation
 * @korean 곤괘자세애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Gon (Earth) trigram animations
 *
 * These limits ensure joint rotations remain within safe physiological ranges
 * while maintaining powerful, grounded animation for Gon's throwing techniques.
 */
export const ANATOMICAL_LIMITS_GON_STANCE = {
  /**
   * Maximum safe knee bend for deep stances: 130° (2.27 radians)
   * 
   * Deep knee bends for Ssireum stance require 110-130° flexion.
   * This maintains low center of gravity while preventing joint strain.
   */
  MAX_KNEE_BEND: 2.27, // 130° in radians
  
  /**
   * Maximum safe hip flexion for throws: 110° (1.92 radians)
   * 
   * Hip flexion for lifting and throwing motions. Safe range for
   * power generation without risking lower back strain.
   */
  MAX_HIP_FLEXION: 1.92, // 110° in radians
  
  /**
   * Maximum safe ankle dorsiflexion: 20° (0.35 radians)
   * 
   * Ankle flexibility for maintaining balance during throws and sweeps.
   * Conservative limit for stable weight transfer.
   */
  MAX_ANKLE_DORSIFLEX: 0.35, // 20° in radians
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON IDLE GROUNDED ANIMATION (곤괘 대지 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Idle Ssireum Stance Animation
 *
 * **Korean**: 곤괘 씨름 자세 (Gon-gwae Ssireum Jase)
 * **Philosophy**: Earth's grounding power through low center of gravity
 *
 * Specialized Ssireum wrestling idle stance that differs from the general
 * Gon idle animation (`stance_gon` in StanceIdleAnimations.ts). This animation
 * emphasizes deeper grounding, lower center of gravity, and wrestling-specific
 * hand positioning for grappling readiness.
 *
 * **When to use**:
 * - Use `GON_IDLE_SSIREUM_STANCE` for active combat scenarios requiring
 *   wrestling/grappling readiness with very low center of gravity
 * - Use `stance_gon` idle for general Gon stance with standard posture
 *
 * Characteristics:
 * - Very low center of gravity with wide stance
 * - Hands positioned low for grappling readiness
 * - Hips back, knees deeply bent
 * - Weight feels heavy and earthbound
 * - Breathing emphasizes settling deeper
 *
 * Animation Cycle:
 * - 0ms: Low grounded neutral position
 * - 1700ms: Deep breath settling (sink deeper)
 * - 3400ms: Return to neutral (complete cycle)
 *
 * @korean 곤괘씨름자세
 * @duration 3400ms (3.4 second cycle)
 * @category Idle Animation
 */
export const GON_IDLE_SSIREUM_STANCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_idle_ssireum_stance",
    "곤괘 씨름 자세"
  )
    .asIdle(3.4, true)
    // Keyframe 0ms: Low grounded neutral
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (hips back and low)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral lower spine
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (torso forward for balance)
    .rotate(BoneName.HIP_L, 0, 0, 0) // Hips neutral
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (deep knee bend)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° (deep knee bend)
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° (weight on full foot)
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20° (weight on full foot)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // 30°, 15°, -20° (hands low)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35) // 30°, -15°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (arms bent ready to grab)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80°
    .rotate(BoneName.HEAD, 0, 0, 0) // Head neutral, aware
    .position(BoneName.PELVIS, 0, -0.1, 0) // Lowered pelvis position
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1700ms: Deep breath settling (sink deeper)
    .at(1.7)
    .rotate(BoneName.PELVIS, -0.38, 0, 0) // -22° (settle deeper)
    .rotate(BoneName.SPINE_UPPER, 0.28, 0, 0) // 16° (lean forward slightly more)
    .rotate(BoneName.KNEE_L, -0.91, 0, 0) // -52° (sink lower)
    .rotate(BoneName.KNEE_R, -0.91, 0, 0) // -52°
    .rotate(BoneName.SHOULDER_L, 0.56, 0.30, -0.38) // 32°, 17°, -22° (hands settle)
    .rotate(BoneName.SHOULDER_R, 0.56, -0.30, 0.38) // 32°, -17°, 22°
    .position(BoneName.PELVIS, 0, -0.12, 0) // Lower pelvis slightly
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 3400ms: Return to start
    .at(3.4)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // Return to start
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .position(BoneName.PELVIS, 0, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON HEAVY GROUNDING STEP (곤괘 땅 밟기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Heavy Grounding Step Animation
 *
 * **Korean**: 땅 밟기 (Ttang Bapgi)
 * **Philosophy**: Each step plants firmly with earthbound power
 *
 * Characteristics:
 * - Forward movement with heavy grounded feel
 * - Each step plants firmly before lifting
 * - Center of gravity stays low throughout
 * - Arms ready for grappling engagement
 *
 * Animation Keyframes (4 keyframes spanning 267ms; ~16 interpolated frames when rendered at 60fps):
 * - 0ms: Start position (low stance)
 * - 90ms: Weight shift to left leg
 * - 180ms: Right foot lifts and steps forward
 * - 267ms: Right foot plants firmly
 *
 * @korean 땅밟기
 * @duration 267ms
 * @category Movement Animation
 */
export const GON_HEAVY_GROUNDING_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_heavy_grounding_step",
    "땅 밟기"
  )
    .asMovement(0.267, false)
    // Keyframe 0ms: Start position (low stance)
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (hips back)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (deep bend)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // Arms ready
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .position(BoneName.PELVIS, 0, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 90ms: Weight shift to left leg
    .at(0.09)
    .rotate(BoneName.PELVIS, -0.35, -0.09, 0) // Slight rotation to left
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (left leg bends more)
    .rotate(BoneName.KNEE_R, -0.7, 0, 0) // -40° (right prepares to lift)
    .position(BoneName.PELVIS, -0.02, -0.1, 0) // Shift weight left
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 180ms: Right foot lifts and steps forward
    .at(0.18)
    .rotate(BoneName.HIP_R, 0.35, 0, 0) // 20° (lift leg)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° (knee up)
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Foot neutral for step
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (support leg)
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° (lean forward into step)
    .position(BoneName.PELVIS, -0.02, -0.08, 0.1) // Move forward
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 267ms: Right foot plants firmly
    .at(0.267)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // Return to neutral
    .rotate(BoneName.HIP_R, 0, 0, 0) // Leg down
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° (plant firmly)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (equalize)
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20° (full weight on foot)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (return to forward lean)
    .position(BoneName.PELVIS, 0, -0.1, 0.2) // Forward position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON SWEEP POSITIONING STEP (곤괘 쓸기 준비)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Sweep Positioning Step Animation
 *
 * **Korean**: 쓸기 준비 (Sseulgi Junbi)
 * **Philosophy**: Lateral movement setting up sweep techniques
 *
 * Characteristics:
 * - Lateral movement to side
 * - Lead leg positioned for foot sweep
 * - Hands reaching for grappling control
 * - Weight shifts for throw setup
 *
 * Animation Keyframes (4 keyframes spanning 300ms; ~18 interpolated frames when rendered at 60fps):
 * - 0ms: Start position (low stance)
 * - 100ms: Weight shift to right leg
 * - 200ms: Left foot slides laterally
 * - 300ms: Positioned for sweep
 *
 * @korean 쓸기준비
 * @duration 300ms
 * @category Movement Animation
 */
export const GON_SWEEP_POSITIONING_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_sweep_positioning_step",
    "쓸기 준비"
  )
    .asMovement(0.3, false)
    // Keyframe 0ms: Start position (low stance)
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .position(BoneName.PELVIS, 0, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 100ms: Weight shift to right leg
    .at(0.1)
    .rotate(BoneName.PELVIS, -0.35, 0.09, 0) // Rotate right for shift
    .rotate(BoneName.KNEE_R, -1.05, 0, 0) // -60° (right leg loads)
    .rotate(BoneName.KNEE_L, -0.7, 0, 0) // -40° (left prepares to move)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0.09, 0) // Slight rotation
    .position(BoneName.PELVIS, 0.02, -0.1, 0) // Shift weight right
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 200ms: Left foot slides laterally
    .at(0.2)
    .rotate(BoneName.HIP_L, 0, 0, -0.17) // -10° (abduct slightly)
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° (slide with bent knee)
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Neutral for slide
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.26) // 40°, 25°, -15° (reach)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.44, 0.26) // Reach forward for grab
    .position(BoneName.PELVIS, 0.02, -0.08, -0.15) // Move left
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 300ms: Positioned for sweep
    .at(0.3)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // Return to neutral rotation
    .rotate(BoneName.HIP_L, 0, 0, -0.09) // -5° (slight abduction maintained)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (plant firmly)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° (equalize)
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° (ready for sweep)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.26) // Arms extended for grab
    .rotate(BoneName.SHOULDER_R, 0.70, -0.44, 0.26)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // Forward lean maintained
    .position(BoneName.PELVIS, 0, -0.1, -0.2) // Lateral position
    .done<MartialArtsAnimationBuilder>()
    .build();
