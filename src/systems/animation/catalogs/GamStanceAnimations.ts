/**
 * ☵ Gam (Water) Stance-Specific Animations
 *
 * Specialized idle, movement, guard, and adaptive counter animations for the Gam (감/Water) trigram.
 * Embodies adaptive flow and redirection from Hapkido techniques with water-like yielding principles.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 합기도 적응 기술 (Hapkido Adaptive Techniques)
 * - **특성**: 혈류 차단 (Blood Flow Disruption), 양보와 방향 전환 (Yielding and Redirecting)
 * - **철학**: 물의 적응력 (Water's Adaptability), 흐름의 지혜 (Flowing Wisdom)
 * - **대표 기술**: 수류반격 (Water Flow Counter/Adaptive Redirection)
 *
 * Animation Philosophy:
 * - **물처럼 흘러라** (Flow Like Water) - No resistance, only adaptation
 * - **적의 힘을 이용** (Use Enemy's Force) - Redirection over blocking
 * - **완전한 이완** (Complete Relaxation) - No tension in movements
 * - **끊임없는 적응** (Endless Adaptation) - Constant readiness to adjust
 *
 * @module systems/animation/catalogs/GamStanceAnimations
 * @category Animation
 * @korean 감괘자세애니메이션
 */

import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM IDLE FLOWING ANIMATION (감괘 흐름 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Idle Flowing Animation
 *
 * **Korean**: 감괘 흐름 자세 (Gam-gwae Heureum Jase)
 * **Philosophy**: Water's adaptability through relaxed readiness
 *
 * Characteristics:
 * - Complete relaxation with no tension
 * - Subtle weight shifts demonstrating adaptability
 * - Shoulders completely loose and low
 * - Hands open and ready to receive force
 * - Breathing deep and flowing like water
 *
 * Animation Cycle:
 * - 0ms: Neutral relaxed position
 * - 650ms: Subtle weight shift left (물의 호흡)
 * - 1300ms: Return to center
 * - 1950ms: Subtle weight shift right
 * - 2600ms: Complete cycle
 *
 * @korean 감괘흐름자세
 * @duration 2600ms (2.6 second cycle)
 * @category Idle Animation
 */
export const GAM_IDLE_FLOWING: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gam_idle_flowing",
    "감괘 흐름 자세"
  )
    .asIdle(2.6, true)
    // Keyframe 0ms: Neutral relaxed position (baseline)
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.SHOULDER_L, 0.09, 0.14, -0.17) // ~5°, ~8°, ~-10° (relaxed low)
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17) // ~5°, ~-8°, ~10°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (soft bend)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° (soft bend)
    .rotate(BoneName.WRIST_L, -0.09, 0, -0.05) // -5°, 0°, -3° (relaxed wrists)
    .rotate(BoneName.WRIST_R, -0.09, 0, 0.05) // -5°, 0°, 3°
    .rotate(BoneName.HEAD, 0, 0, 0) // Head neutral, aware
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 650ms: Subtle weight shift left (물의 호흡)
    .at(0.65)
    .rotate(BoneName.PELVIS, 0, 0, -0.0349) // 0°, 0°, -2° (minimal shift)
    .rotate(BoneName.SPINE_UPPER, 0, -0.0349, 0) // 0°, -2°, 0° (flowing with weight)
    .rotate(BoneName.SHOULDER_L, 0.10, 0.17, -0.21) // 6°, 10°, -12° (left rises slightly)
    .rotate(BoneName.SHOULDER_R, 0.07, -0.10, 0.14) // 4°, -6°, 8° (right lowers)
    .rotate(BoneName.WRIST_L, -0.05, 0, -0.09) // -3°, 0°, -5° (subtle flow)
    .rotate(BoneName.WRIST_R, -0.12, 0, 0.02) // -7°, 0°, 1°
    .position(BoneName.PELVIS, -0.01, 0, 0) // Minimal lateral shift left
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1300ms: Return to center
    .at(1.3)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.09, 0.14, -0.17)
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17)
    .rotate(BoneName.WRIST_L, -0.09, 0, -0.05)
    .rotate(BoneName.WRIST_R, -0.09, 0, 0.05)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1950ms: Subtle weight shift right
    .at(1.95)
    .rotate(BoneName.PELVIS, 0, 0, 0.03) // 0°, 0°, 2° (minimal shift)
    .rotate(BoneName.SPINE_UPPER, 0, 0.03, 0) // 0°, 2°, 0°
    .rotate(BoneName.SHOULDER_L, 0.07, 0.10, -0.14) // 4°, 6°, -8° (left lowers)
    .rotate(BoneName.SHOULDER_R, 0.10, -0.17, 0.21) // 6°, -10°, 12° (right rises)
    .rotate(BoneName.WRIST_L, -0.12, 0, -0.02) // -7°, 0°, -1°
    .rotate(BoneName.WRIST_R, -0.05, 0, 0.09) // -3°, 0°, 5°
    .position(BoneName.PELVIS, 0.01, 0, 0) // Minimal lateral shift right
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2600ms: Return to start (complete cycle)
    .at(2.6)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.09, 0.14, -0.17)
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52)
    .rotate(BoneName.WRIST_L, -0.09, 0, -0.05)
    .rotate(BoneName.WRIST_R, -0.09, 0, 0.05)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM YIELDING SIDESTEP (물의 양보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Yielding Sidestep Animation
 *
 * **Korean**: 물의 양보 (Mul-ui Yangbo) - Water's Yielding
 * **Technique**: Lateral movement yielding to opponent's force
 *
 * Characteristics:
 * - Weight transfer follows natural flow
 * - Upper body remains centered and relaxed
 * - Feet glide rather than step
 * - No resistance, only adaptation
 * - Seamless transition to counter position
 *
 * Animation Phases:
 * - 0-167ms: Initial weight shift (양보 시작)
 * - 167-400ms: Gliding lateral movement (흐름)
 * - 400-583ms: Landing and settling (정착)
 *
 * @korean 물의양보
 * @frames 10 frames (58.3ms per frame at 60fps, total 583ms)
 * @duration 583ms
 * @category Movement Animation
 */
export const GAM_YIELDING_SIDESTEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gam_yielding_sidestep",
    "물의 양보"
  )
    .asMovement(0.583, false)
    // Phase 1: Initial weight shift (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.09, 0) // 0°, -5° (weight begins shift)
    .rotate(BoneName.SPINE_UPPER, 0, -0.05, 0) // Upper body stays centered
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (left leg loads)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (right leg ready to glide)
    .rotate(BoneName.SHOULDER_L, 0.09, 0.14, -0.17) // Relaxed guard maintained
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Gliding lateral movement (283ms - midpoint)
    .at(0.283)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8° (flowing lateral)
    .rotate(BoneName.SPINE_UPPER, 0, -0.03, 0) // Minimal rotation
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (left leg extends)
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° (right leg glides)
    .rotate(BoneName.SHOULDER_L, 0.10, 0.17, -0.14) // Slight adjustment
    .rotate(BoneName.SHOULDER_R, 0.08, -0.10, 0.14)
    .position(BoneName.PELVIS, -0.12, 0.01, 0) // Lateral with slight rise
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Landing and settling (583ms)
    .at(0.583)
    .rotate(BoneName.PELVIS, 0, -0.10, 0) // 0°, -6° (settled)
    .rotate(BoneName.SPINE_UPPER, 0, -0.02, 0) // Return to center
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (grounded)
    .rotate(BoneName.SHOULDER_L, 0.09, 0.14, -0.17) // Guard restored
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17)
    .position(BoneName.PELVIS, -0.20, 0, 0) // Final lateral position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM FLOWING RETREAT STEP (수류 후퇴)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Flowing Retreat Step Animation
 *
 * **Korean**: 수류 후퇴 (Suryu Hutoe) - Water Flow Retreat
 * **Technique**: Backward movement with no resistance
 *
 * Characteristics:
 * - Body flows with opponent's momentum
 * - Hands stay forward to maintain contact
 * - No breaking of flow, continuous movement
 * - Seamless transition to counter position
 * - Weight shifts smoothly backward
 *
 * Animation Phases:
 * - 0-200ms: Initial backward flow (후퇴 시작)
 * - 200-533ms: Continuous backward glide (지속 흐름)
 * - 533-750ms: Settling in counter position (반격 준비)
 *
 * @korean 수류후퇴
 * @frames 13 frames (57.7ms per frame at 60fps, total 750ms)
 * @duration 750ms
 * @category Movement Animation
 */
export const GAM_FLOWING_RETREAT_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gam_flowing_retreat_step",
    "수류 후퇴"
  )
    .asMovement(0.75, false)
    // Phase 1: Initial backward flow (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, -0.05, 0, 0) // -3° (lean back begins)
    .rotate(BoneName.SPINE_UPPER, -0.03, 0, 0) // Slight backward lean
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (front leg ready)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (back leg loads)
    .rotate(BoneName.SHOULDER_L, 0.05, 0.17, -0.14) // 3°, 10°, -8° (hands forward)
    .rotate(BoneName.SHOULDER_R, 0.05, -0.17, 0.14) // Maintain contact position
    .rotate(BoneName.ELBOW_L, 0, 0, -0.70) // -40° (arms extending forward)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.70) // To maintain contact
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Continuous backward glide (367ms - midpoint)
    .at(0.367)
    .rotate(BoneName.PELVIS, -0.09, 0, 0) // -5° (flowing back)
    .rotate(BoneName.SPINE_UPPER, -0.05, 0, 0) // Maintain forward contact
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (front leg extends)
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° (back leg absorbs)
    .rotate(BoneName.SHOULDER_L, 0.07, 0.21, -0.17) // Arms extend to maintain
    .rotate(BoneName.SHOULDER_R, 0.07, -0.21, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (maximum extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87)
    .position(BoneName.PELVIS, 0, -0.02, -0.25) // Back and slightly down
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Settling in counter position (750ms)
    .at(0.75)
    .rotate(BoneName.PELVIS, -0.07, 0, 0) // -4° (settled back)
    .rotate(BoneName.SPINE_UPPER, -0.03, 0, 0) // Upright but ready
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable front)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (grounded back)
    .rotate(BoneName.SHOULDER_L, 0.09, 0.17, -0.14) // Return to guard
    .rotate(BoneName.SHOULDER_R, 0.09, -0.17, 0.14)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (guard position)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52)
    .position(BoneName.PELVIS, 0, 0, -0.40) // Final backward position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All Gam stance animations for idle and movement
 */
export const GAM_STANCE_ANIMATIONS = {
  idle: GAM_IDLE_FLOWING,
  movement: {
    yieldingSidestep: GAM_YIELDING_SIDESTEP,
    flowingRetreat: GAM_FLOWING_RETREAT_STEP,
  },
} as const;
