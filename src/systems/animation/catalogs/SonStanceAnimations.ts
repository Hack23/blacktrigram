/**
 * ☴ Son (Wind) Stance-Specific Animations
 *
 * Specialized idle, movement, guard, and combat animations for the Son (손/Wind) trigram.
 * Embodies continuous pressure and flowing combinations from Taekyon rhythmic combat.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 택견 유동 기술 (Taekyon Fluid Movement)
 * - **특성**: 지속적 압박 (Continuous Pressure), 흐르는 연속 공격 (Flowing Combinations)
 * - **철학**: 바람의 끊임없음 (Wind's Relentlessness), 소용돌이의 힘 (Whirlwind Power)
 * - **대표 기술**: 선풍연격 (Whirlwind Strike/Continuous Pressure), 회오리 타격 (Sweeping Strikes)
 *
 * @module systems/animation/catalogs/SonStanceAnimations
 * @category Animation
 * @korean 손괘자세애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Son (Wind) trigram animations
 *
 * These limits document safe physiological ranges validated by Korean martial arts experts
 * and inform the design of all Son animations to ensure realistic, safe joint mechanics.
 *
 * Note: These are documentation constants that guide animation design. Actual animation
 * rotations stay well within these limits naturally through authentic Taekyon biomechanics.
 *
 * @internal Documentation-only constants for animation design reference
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error - Documentation-only constant for animation design reference
const ANATOMICAL_LIMITS_SON_STANCE = {
  /**
   * Maximum safe shoulder rotation for continuous circular motion: ±90° (±1.57 radians)
   *
   * Son (Wind) emphasizes fluid circular motion requiring safe shoulder range.
   */
  MAX_SHOULDER_ROTATION: 1.57, // ±90° in radians

  /**
   * Maximum safe elbow flexion for flowing transitions: 145° (2.53 radians)
   *
   * Allows natural flowing guard positions and continuous strike transitions.
   */
  MAX_ELBOW_FLEXION: 2.53, // 145° in radians

  /**
   * Maximum safe hip rotation for circular movement: ±70° (±1.22 radians)
   *
   * Hip rotation drives circular footwork and sweeping techniques.
   */
  MAX_HIP_ROTATION: 1.22, // ±70° in radians
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON IDLE SWAYING ANIMATION (손괘 흐름 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Idle Swaying Animation
 *
 * **Korean**: 손괘 흐름 자세 (Son-gwae Heureum Jase)
 * **Philosophy**: Wind's endless flow through rhythmic swaying like trees in breeze
 *
 * Characteristics:
 * - Gentle swaying motion side-to-side
 * - Rhythmic breathing with flowing upper body
 * - Hands moving in small continuous circles
 * - Weight shifting foot to foot continuously
 * - Head tracking with fluid neck movement
 *
 * Animation Cycle:
 * - 0ms: Neutral center position
 * - 700ms: Sway left with circular hand motion
 * - 1400ms: Return to center
 * - 2100ms: Sway right with circular hand motion
 * - 2800ms: Return to start (complete cycle)
 *
 * @korean 손괘흐름자세
 * @duration 2800ms (2.8 second cycle)
 * @category Idle Animation
 */
export const SON_IDLE_SWAYING: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_idle_swaying", "손괘 흐름 자세")
    .asIdle(2.8, true)
    // Keyframe 0ms: Neutral center (baseline)
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0.03) // 0°, 0°, 2° (slight lean right)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // 10°, 5°, -15° (flowing guard)
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26) // 10°, -5°, 15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (bent guard)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (bent guard)
    .rotate(BoneName.WRIST_L, 0, 0, -0.09) // 0°, 0°, -5° (circular hand motion start)
    .rotate(BoneName.WRIST_R, 0, 0, 0.09) // 0°, 0°, 5°
    .rotate(BoneName.HEAD, 0, 0, 0) // Neutral head
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 700ms: Sway left with circular flow
    .at(0.7)
    .rotate(BoneName.PELVIS, 0, 0, -0.07) // 0°, 0°, -4° (lean left)
    .rotate(BoneName.SPINE_UPPER, 0, -0.05, 0) // 0°, -3°, 0° (upper body follows)
    .rotate(BoneName.SHOULDER_L, 0.21, 0.12, -0.3) // 12°, 7°, -17° (left shoulder rises)
    .rotate(BoneName.SHOULDER_R, 0.14, -0.05, 0.22) // 8°, -3°, 13° (right shoulder drops)
    .rotate(BoneName.WRIST_L, 0.09, 0, -0.17) // 5°, 0°, -10° (hands continue circles)
    .rotate(BoneName.WRIST_R, -0.09, 0, 0.17) // -5°, 0°, 10°
    .rotate(BoneName.HEAD, 0, -0.05, -0.03) // 0°, -3°, -2° (head tracks with flow)
    .position(BoneName.PELVIS, -0.02, 0, 0) // Minimal lateral shift
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1400ms: Return to center
    .at(1.4)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Return to neutral
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26)
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26)
    .rotate(BoneName.WRIST_L, 0, 0, -0.09)
    .rotate(BoneName.WRIST_R, 0, 0, 0.09)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2100ms: Sway right with circular flow
    .at(2.1)
    .rotate(BoneName.PELVIS, 0, 0, 0.07) // 0°, 0°, 4° (lean right)
    .rotate(BoneName.SPINE_UPPER, 0, 0.05, 0) // 0°, 3°, 0° (upper body follows)
    .rotate(BoneName.SHOULDER_L, 0.14, 0.05, -0.22) // 8°, 3°, -13° (left shoulder drops)
    .rotate(BoneName.SHOULDER_R, 0.21, -0.12, 0.3) // 12°, -7°, 17° (right shoulder rises)
    .rotate(BoneName.WRIST_L, -0.09, 0, 0) // -5°, 0°, 0° (hands reverse circles)
    .rotate(BoneName.WRIST_R, 0.09, 0, 0) // 5°, 0°, 0°
    .rotate(BoneName.HEAD, 0, 0.05, 0.03) // 0°, 3°, 2° (head tracks with flow)
    .position(BoneName.PELVIS, 0.02, 0, 0) // Minimal lateral shift right
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2800ms: Return to start (complete cycle)
    .at(2.8)
    .rotate(BoneName.PELVIS, 0, 0, 0.03)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26)
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26)
    .rotate(BoneName.WRIST_L, 0, 0, -0.09)
    .rotate(BoneName.WRIST_R, 0, 0, 0.09)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON FLOWING ARC STEP (바람 호 걸음)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Flowing Arc Step Animation
 *
 * **Korean**: 바람 호 걸음 (Baram Ho Georeum) - Wind Arc Step
 * **Technique**: Arc-shaped forward movement with hip-led circular motion
 *
 * Characteristics:
 * - Forward movement follows arc path (not straight)
 * - Hips lead with circular motion
 * - Arms swing naturally with momentum
 * - Smooth weight transfer through arc
 * - Continuous flowing transition
 *
 * Animation Phases:
 * - 0-200ms: Initial hip rotation and weight shift
 * - 200-500ms: Arc path forward with hip driving
 * - 500-667ms: Landing and settling into flowing position
 *
 * @korean 바람호걸음
 * @frames 12-16 frames (~42-56ms per frame at 60fps)
 * @duration 667ms
 * @category Movement Animation
 */
export const SON_FLOWING_ARC_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_flowing_arc_step", "바람 호 걸음")
    .asMovement(0.667, false)
    // Phase 1: Initial hip rotation (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.09, -0.26, 0) // 5°, -15°, 0° (hip winds for arc)
    .rotate(BoneName.SPINE_UPPER, 0.12, -0.17, 0) // 7°, -10°, 0° (torso follows hip)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (rear leg ready to push)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (lead leg ready)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.17, -0.26) // 10°, 10°, -15° (arms begin swing)
    .rotate(BoneName.SHOULDER_R, 0.17, -0.17, 0.26) // 10°, -10°, 15°
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Arc path forward (400ms)
    .at(0.4)
    .rotate(BoneName.PELVIS, 0.14, -0.17, 0) // 8°, -10°, 0° (unwinding through arc)
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.09, 0) // 10°, -5°, 0°
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° (rear leg extending)
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° (lead leg absorbing weight)
    .rotate(BoneName.SHOULDER_L, 0.21, 0.26, -0.35) // 12°, 15°, -20° (arms swing with momentum)
    .rotate(BoneName.SHOULDER_R, 0.21, -0.26, 0.35) // 12°, -15°, 20°
    .position(BoneName.PELVIS, -0.12, 0.02, 0.25) // Arc trajectory (slight left, up, forward)
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Landing and settling (667ms)
    .at(0.667)
    .rotate(BoneName.PELVIS, 0.09, -0.26, 0) // 5°, -15°, 0° (settled in arc position)
    .rotate(BoneName.SPINE_UPPER, 0.12, -0.17, 0) // 7°, -10°, 0°
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg stable)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (lead leg grounded)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.17, -0.26) // Return to flowing guard
    .rotate(BoneName.SHOULDER_R, 0.17, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° guard position
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° guard position
    .position(BoneName.PELVIS, -0.15, 0, 0.35) // Final arc position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON SWEEPING CIRCLE STEP (회오리 원형보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Sweeping Circle Step Animation
 *
 * **Korean**: 회오리 원형보 (Hoeori Wonhyeongbo) - Whirlwind Circle Step
 * **Technique**: Full circular movement around opponent while maintaining orientation
 *
 * Characteristics:
 * - Complete circular path around target
 * - Body remains oriented toward opponent
 * - Hands maintain guard while circling
 * - Continuous flow without stopping
 * - Weight transfer smoothly through circle
 *
 * Animation Phases:
 * - 0-280ms: Initial circular pivot
 * - 280-700ms: Circular arc movement
 * - 700-889ms: Complete circle and settle
 *
 * @korean 회오리원형보
 * @frames 14-18 frames (~49-63ms per frame at 60fps)
 * @duration 889ms
 * @category Movement Animation
 */
export const SON_SWEEPING_CIRCLE_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "son_sweeping_circle_step",
    "회오리 원형보",
  )
    .asMovement(0.889, false)
    // Phase 1: Initial circular pivot (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.09, -0.79, 0) // 5°, -45°, 0° (begin rotation)
    .rotate(BoneName.SPINE_UPPER, 0.12, -0.87, 0) // 7°, -50°, 0° (torso leads)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (pivot foot)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stepping foot)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // Maintain guard
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Circular arc movement (490ms)
    .at(0.49)
    .rotate(BoneName.PELVIS, 0.09, -1.57, 0) // 5°, -90°, 0° (quarter circle)
    .rotate(BoneName.SPINE_UPPER, 0.12, -1.74, 0) // 7°, -100°, 0°
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (pivot stable)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (stepping load)
    .rotate(BoneName.HEAD, 0, -0.87, 0) // 0°, -50°, 0° (head tracks target)
    .position(BoneName.PELVIS, -0.25, 0.02, 0.1) // Circular path (left and slight forward)
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Complete circle (889ms)
    .at(0.889)
    .rotate(BoneName.PELVIS, 0.09, -2.79, 0) // 5°, -160°, 0° (near full circle)
    .rotate(BoneName.SPINE_UPPER, 0.12, -2.79, 0) // 7°, -160°, 0° (spine follows pelvis)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (grounded)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // Guard maintained throughout
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57)
    .rotate(BoneName.HEAD, 0, -2.79, 0) // 0°, -160°, 0° (head follows rotation)
    .position(BoneName.PELVIS, -0.35, 0, -0.1) // Complete circular position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON MOBILE GUARD TRANSITION (바람 방어 전환)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Mobile Guard Transition Animation
 *
 * **Korean**: 바람 방어 (Baram Bangeo) - Wind Guard
 * **Technique**: Transition into Son's characteristic mobile guard with micro-adjustments
 *
 * Characteristics:
 * - Hands in constant subtle motion (micro-adjustments)
 * - Shoulders relaxed, ready to flow
 * - Weight centered, ready to move any direction
 * - Head tracking opponent with fluid neck movement
 * - Continuous readiness for pressure attacks
 *
 * Animation Phases:
 * - 0-180ms: Begin transition with hand repositioning
 * - 180-360ms: Settle into mobile guard with micro-adjustments
 *
 * @korean 바람방어
 * @duration 360ms
 * @category Stance Animation
 */
export const SON_MOBILE_GUARD_TRANSITION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_mobile_guard_transition", "바람 방어")
    .asStance(0.36, false)
    // Phase 1: Begin transition (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, 0.14, 0.07, -0.22) // 8°, 4°, -12.5° (moving toward guard)
    .rotate(BoneName.SHOULDER_R, 0.14, -0.07, 0.22) // 8°, -4°, 12.5°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (transitioning)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (transitioning)
    .rotate(BoneName.WRIST_L, 0, 0, -0.05) // Slight wrist adjustment
    .rotate(BoneName.WRIST_R, 0, 0, 0.05)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable stance)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Settle into mobile guard (360ms)
    .at(0.36)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // 10°, 5°, -15° (Son guard)
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26) // 10°, -5°, 15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (Son guard angle)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (Son guard angle)
    .rotate(BoneName.WRIST_L, 0, 0, -0.09) // 0°, 0°, -5° (micro-adjustment position)
    .rotate(BoneName.WRIST_R, 0, 0, 0.09) // 0°, 0°, 5°
    .rotate(BoneName.HEAD, 0, 0, 0) // Neutral tracking
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable stance)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Son stance-specific animations for easy access
 * @korean 손괘자세애니메이션맵
 */
export const SON_STANCE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    // Idle & Movement
    ["son_idle_swaying", SON_IDLE_SWAYING],
    ["son_flowing_arc_step", SON_FLOWING_ARC_STEP],
    ["son_sweeping_circle_step", SON_SWEEPING_CIRCLE_STEP],

    // Stance Transitions
    ["son_mobile_guard_transition", SON_MOBILE_GUARD_TRANSITION],
  ]);
