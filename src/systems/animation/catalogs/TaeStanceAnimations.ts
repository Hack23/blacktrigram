/**
 * ☱ Tae (Lake) Stance-Specific Animations
 *
 * Specialized idle, movement, and guard animations for the Tae (태/Lake) trigram.
 * Embodies fluid joint manipulation and circular motion from Hapkido techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 합기도 관절기 (Hapkido Joint Manipulation)
 * - **특성**: 유동적 관절기 (Fluid Joint Locks), 소원 기술 (Small Circle Techniques)
 * - **철학**: 물처럼 흐르는 힘 (Flowing Power Like Water), 호수의 적응 (Lake's Adaptation)
 * - **대표 기술**: 유수연타 (Flowing Water Strike/Wrist Lock Sequence), 팔꿈치 제어 (Elbow Control)
 *
 * @module systems/animation/catalogs/TaeStanceAnimations
 * @category Animation
 * @korean 태괘자세애니메이션
 */

import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE IDLE FLOWING ANIMATION (태괘 유동 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Idle Flowing Animation
 *
 * **Korean**: 태괘 유동 자세 (Tae-gwae Yudong Jase)
 * **Philosophy**: Embodying lake's fluidity through circular breathing
 *
 * Characteristics:
 * - Circular shoulder movement with breathing
 * - Gentle wrist rotation (small circles)
 * - Weight shifting side to side
 * - Relaxed but ready posture
 * - Hands at mid-level, flexible guard
 *
 * Animation Cycle (6 keyframes):
 * - 0ms: Neutral breathing position (baseline)
 * - 830ms: Right shoulder forward with circular motion
 * - 1667ms: Center position with breath expansion
 * - 2500ms: Return to neutral (complete cycle)
 *
 * @korean 태괘유동자세
 * @duration 2500ms (2.5 second cycle)
 * @frames 6 keyframes
 * @category Idle Animation
 */
export const TAE_IDLE_FLOWING: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_idle_flowing",
    "태괘 유동 자세"
  )
    .asIdle(2.5, true)
    // Keyframe 0ms: Neutral breathing position (baseline)
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // -30°, -10°, 15° mid-level guard
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // -30°, 10°, -15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (flexed guard)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (flexed guard)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0) // Head neutral, aware
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 830ms: Right shoulder forward with circular motion (inhale begins)
    .at(0.83)
    .rotate(BoneName.SPINE_UPPER, 0, 0.09, 0) // 0°, 5° slight rotation right
    .rotate(BoneName.SHOULDER_L, -0.57, -0.09, 0.17) // -33°, -5°, 10° left back slightly
    .rotate(BoneName.SHOULDER_R, -0.44, 0.26, -0.17) // -25°, 15°, -10° right forward
    .rotate(BoneName.ELBOW_L, 0, 0, -1.48) // -85° left extends slightly
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° right flexes more
    .rotate(BoneName.WRIST_L, 0, -0.09, 0) // 0°, -5° subtle rotation
    .rotate(BoneName.WRIST_R, 0, 0.09, 0) // 0°, 5° circular motion
    .rotate(BoneName.PELVIS, 0, 0.05, 0) // 0°, 3° subtle weight shift
    .position(BoneName.PELVIS, 0.02, 0, 0) // Slight right shift
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1250ms: Left shoulder forward, reversing circle
    .at(1.25)
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5° rotation left
    .rotate(BoneName.SHOULDER_L, -0.44, -0.26, 0.17) // -25°, -15°, 10° left forward
    .rotate(BoneName.SHOULDER_R, -0.57, 0.09, -0.17) // -33°, 5°, -10° right back
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° left flexes more
    .rotate(BoneName.ELBOW_R, 0, 0, 1.48) // 85° right extends slightly
    .rotate(BoneName.WRIST_L, 0, 0.09, 0) // 0°, 5° continuing circle
    .rotate(BoneName.WRIST_R, 0, -0.09, 0) // 0°, -5°
    .rotate(BoneName.PELVIS, 0, -0.05, 0) // 0°, -3° weight shift left
    .position(BoneName.PELVIS, -0.02, 0, 0) // Slight left shift
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1667ms: Center with breath expansion (exhale)
    .at(1.667)
    .rotate(BoneName.SPINE_UPPER, -0.05, 0, 0) // -3°, 0° slight chest rise
    .rotate(BoneName.SHOULDER_L, -0.48, -0.17, 0.22) // -27.5°, -10°, 12.5° centering
    .rotate(BoneName.SHOULDER_R, -0.48, 0.17, -0.22) // -27.5°, 10°, -12.5°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.35) // -77.5° mid-position
    .rotate(BoneName.ELBOW_R, 0, 0, 1.35) // 77.5°
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Centered
    .position(BoneName.PELVIS, 0, 0, 0) // Center
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2500ms: Return to neutral (complete cycle)
    .at(2.5)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE CIRCULAR SIDESTEP (원형 측면보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Circular Sidestep Animation
 *
 * **Korean**: 원형 측면보 (Wonhyeong Cheungmyeonbo) - Circular Sidestep
 * **Technique**: Arc-shaped lateral movement, hip-led
 *
 * Characteristics:
 * - Circular arc path (not straight lateral)
 * - Hip leads the movement
 * - Maintains flexible guard throughout
 * - Weight shifts smoothly
 * - Hands ready to intercept or redirect
 *
 * Animation Phases:
 * - 0-180ms: Initial weight shift and hip initiation
 * - 180-370ms: Circular arc movement to side
 * - 370-550ms: Landing and weight settling
 *
 * @korean 원형측면보
 * @frames 10 frames (~55ms per frame at 60fps)
 * @duration 550ms
 * @category Movement Animation
 */
export const TAE_CIRCULAR_SIDESTEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_circular_sidestep",
    "원형 측면보"
  )
    .asMovement(0.55, false)
    // Frame 0-3: Initial weight shift (0-180ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.17, 0) // 0°, -10° hip begins rotation
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5° spine follows
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° right leg preparation
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° left leg loading
    .rotate(BoneName.SHOULDER_L, -0.48, -0.09, 0.22) // Hands maintain guard
    .rotate(BoneName.SHOULDER_R, -0.48, 0.09, -0.22)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.35)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.35)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 4-7: Circular arc movement (180-370ms)
    .at(0.275)
    .rotate(BoneName.PELVIS, 0, -0.35, 0) // 0°, -20° maximum hip rotation
    .rotate(BoneName.SPINE_UPPER, 0, -0.17, 0) // 0°, -10° spine rotation
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° right leg extending
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° left leg pushing
    .rotate(BoneName.HIP_L, 0, -0.17, 0) // 0°, -10° hip abduction for arc
    .rotate(BoneName.SHOULDER_L, -0.44, -0.17, 0.26) // -25°, -10°, 15° adjusting guard
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.17) // -30°, 10°, -10°
    .position(BoneName.PELVIS, -0.15, 0.02, -0.05) // Arc trajectory
    .done<MartialArtsAnimationBuilder>()
    // Frame 8-10: Landing and settling (370-550ms)
    .at(0.55)
    .rotate(BoneName.PELVIS, 0, -0.26, 0) // 0°, -15° settled rotation
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5° stable
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° right leg stable
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° left leg grounded
    .rotate(BoneName.HIP_L, 0, -0.09, 0) // 0°, -5° hip settled
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // Return to guard
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .position(BoneName.PELVIS, -0.25, 0, 0) // Lateral position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE DIAGONAL CIRCULAR APPROACH (대각선 원형 접근)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Diagonal Circular Approach Animation
 *
 * **Korean**: 대각선 원형 접근 (Daegakseon Wonhyeong Jeopgeun)
 * **Technique**: 45° curved approach with hands extending
 *
 * Characteristics:
 * - 45° diagonal angle with curved path
 * - Hands extend forward ready to manipulate joints
 * - Hip rotation coordinates with step
 * - Maintains balance throughout curve
 * - Smooth weight transfer
 *
 * Animation Phases:
 * - 0-222ms: Initial diagonal pivot
 * - 222-500ms: Curved approach with hands extending
 * - 500-667ms: Landing in engagement position
 *
 * @korean 대각선원형접근
 * @frames 12 frames (~55.5ms per frame at 60fps)
 * @duration 667ms
 * @category Movement Animation
 */
export const TAE_DIAGONAL_CIRCULAR_APPROACH: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_diagonal_circular_approach",
    "대각선 원형 접근"
  )
    .asMovement(0.667, false)
    // Frame 0-4: Initial diagonal pivot (0-222ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.79, 0) // 0°, -45° diagonal rotation
    .rotate(BoneName.SPINE_UPPER, 0, -0.61, 0) // 0°, -35° upper body follows
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° right leg preparation
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° left leg ready
    .rotate(BoneName.HIP_R, 0, -0.17, 0) // 0°, -10° hip positioning
    .rotate(BoneName.SHOULDER_L, -0.44, -0.26, 0.35) // -25°, -15°, 20° hands begin extending
    .rotate(BoneName.SHOULDER_R, -0.44, 0.26, -0.35) // -25°, 15°, -20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° left arm extending
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° right arm extending
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 5-9: Curved approach with extending hands (222-500ms)
    .at(0.361)
    .rotate(BoneName.PELVIS, 0, -0.61, 0) // 0°, -35° rotation unwinding
    .rotate(BoneName.SPINE_UPPER, 0, -0.44, 0) // 0°, -25° following through
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° right leg extending
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° left leg pushing
    .rotate(BoneName.HIP_R, 0, -0.26, 0) // 0°, -15° hip driving
    .rotate(BoneName.SHOULDER_L, -0.35, -0.35, 0.44) // -20°, -20°, 25° hands reaching forward
    .rotate(BoneName.SHOULDER_R, -0.35, 0.35, -0.44) // -20°, 20°, -25°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7) // -40° extending more
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7) // 40° extending more
    .rotate(BoneName.WRIST_L, 0.09, 0, -0.09) // 5°, 0°, -5° hands ready to grasp
    .rotate(BoneName.WRIST_R, 0.09, 0, 0.09) // 5°, 0°, 5°
    .position(BoneName.PELVIS, -0.2, 0.02, 0.2) // Curved diagonal path
    .done<MartialArtsAnimationBuilder>()
    // Frame 10-12: Landing in engagement position (500-667ms)
    .at(0.667)
    .rotate(BoneName.PELVIS, 0, -0.79, 0) // 0°, -45° settled diagonal
    .rotate(BoneName.SPINE_UPPER, 0, -0.52, 0) // 0°, -30° stable
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° right leg stable
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° left leg grounded
    .rotate(BoneName.HIP_R, 0, -0.35, 0) // 0°, -20° hip settled
    .rotate(BoneName.SHOULDER_L, -0.26, -0.44, 0.52) // -15°, -25°, 30° hands extended forward
    .rotate(BoneName.SHOULDER_R, -0.26, 0.44, -0.52) // -15°, 25°, -30°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° ready to engage
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° ready to engage
    .rotate(BoneName.WRIST_L, 0.17, 0, -0.17) // 10°, 0°, -10° hands in position
    .rotate(BoneName.WRIST_R, 0.17, 0, 0.17) // 10°, 0°, 10°
    .position(BoneName.PELVIS, -0.3, 0, 0.3) // Diagonal 45° position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE FLEXIBLE GUARD TRANSITION (호수 방어 전환)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Flexible Guard Transition Animation
 *
 * **Korean**: 호수 방어 전환 (Hosu Bangeo Jeonhwan) - Lake Guard Transition
 * **Technique**: Transition into Tae's characteristic flexible mid-level guard
 *
 * Characteristics:
 * - Smooth transition from any position to Tae guard
 * - Hands settle at mid-level (chest/solar plexus height)
 * - Elbows bent at 80° for flexibility
 * - Shoulders relaxed but ready
 * - Weight evenly distributed
 *
 * Animation Phases:
 * - 0-100ms: Begin transition from current position
 * - 100-200ms: Arms move to mid-level guard
 * - 200-300ms: Settle into stable Tae guard pose
 *
 * @korean 호수방어전환
 * @frames 6 frames (~50ms per frame at 60fps)
 * @duration 300ms
 * @category Stance Animation
 */
export const TAE_FLEXIBLE_GUARD_TRANSITION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_flexible_guard_transition",
    "호수 방어 전환"
  )
    .asStance(0.3, false)
    // Frame 0-2: Begin transition (0-100ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.44, -0.09, 0.22) // -25°, -5°, 12.5° moving toward guard
    .rotate(BoneName.SHOULDER_R, -0.44, 0.09, -0.22) // -25°, 5°, -12.5°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° transitioning
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° transitioning
    .rotate(BoneName.WRIST_L, 0, 0, 0.09) // 0°, 0°, 5° adjusting
    .rotate(BoneName.WRIST_R, 0, 0, -0.09) // 0°, 0°, -5°
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3-4: Arms move to mid-level (100-200ms)
    .at(0.15)
    .rotate(BoneName.SHOULDER_L, -0.48, -0.13, 0.24) // -27.5°, -7.5°, 13.75° approaching guard
    .rotate(BoneName.SHOULDER_R, -0.48, 0.13, -0.24) // -27.5°, 7.5°, -13.75°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° nearing guard angle
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31) // 75° nearing guard angle
    .rotate(BoneName.WRIST_L, 0, 0, 0.04) // 0°, 0°, 2.5° settling
    .rotate(BoneName.WRIST_R, 0, 0, -0.04) // 0°, 0°, -2.5°
    .done<MartialArtsAnimationBuilder>()
    // Frame 5-6: Settle into stable Tae guard (200-300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // -30°, -10°, 15° Tae guard position
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // -30°, 10°, -15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° Tae guard angle
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° Tae guard angle
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Stable spine
    .rotate(BoneName.PELVIS, 0, 0, 0) // Stable pelvis
    .rotate(BoneName.HEAD, 0, 0, 0) // Head neutral and aware
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° stance
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° stance
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Tae stance-specific animations for easy access
 * @korean 태괘자세애니메이션맵
 */
export const TAE_STANCE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  // Idle & Movement
  ["tae_idle_flowing", TAE_IDLE_FLOWING],
  ["tae_circular_sidestep", TAE_CIRCULAR_SIDESTEP],
  ["tae_diagonal_circular_approach", TAE_DIAGONAL_CIRCULAR_APPROACH],
  
  // Stance Transitions
  ["tae_flexible_guard_transition", TAE_FLEXIBLE_GUARD_TRANSITION],
]);
