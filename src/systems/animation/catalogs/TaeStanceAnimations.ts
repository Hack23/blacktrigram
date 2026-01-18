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
 * - **대표 기술**: 유수연타 (Flowing Water Strikes), 손목꺾기 (Wrist Lock), 팔꿈치 제어 (Elbow Control)
 *
 * @module systems/animation/catalogs/TaeStanceAnimations
 * @category Animation
 * @korean 태괘자세애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Tae (Lake) trigram animations
 *
 * These limits document safe physiological ranges for Korean martial arts movements.
 * The constants serve as reference documentation validated by Korean martial arts experts
 * and inform the design of all Tae animations to ensure realistic, safe joint mechanics.
 *
 * Note: These are documentation constants. The actual animation rotations are designed
 * to stay well within these limits naturally through authentic Hapkido biomechanics.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE IDLE FLOWING ANIMATION (태괘 유동 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Idle Flowing Animation
 *
 * **Korean**: 태괘 유동 자세 (Tae-gwae Yudong Jase)
 * **Philosophy**: Embodying lake's fluidity through gentle circular breathing
 *
 * Characteristics:
 * - Gentle circular shoulder movement
 * - Relaxed mid-level guard position
 * - Weight centered and stable
 * - Hands open and ready to grasp
 *
 * Animation Cycle:
 * - 0ms: Neutral position with mid-level guard
 * - 1250ms: Circular shift (left shoulder forward, right back)
 * - 2500ms: Return to neutral (complete cycle)
 *
 * @korean 태괘유동자세
 * @duration 2500ms (2.5 second cycle)
 * @category Idle Animation
 */
export const TAE_IDLE_FLOWING: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_idle_flowing",
    "태괘 유동 자세"
  )
    .asIdle(2.5, true)
    // Keyframe 0ms: Neutral mid-level guard (baseline)
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // -30°, -10°, 15° (mid-level flexible guard)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // -30°, 10°, -15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (flexed guard)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (flexed guard)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0) // Head neutral, aware
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1250ms: Circular shift (subtle flowing motion)
    .at(1.25)
    .rotate(BoneName.SPINE_UPPER, 0, 0.09, 0) // 0°, 5° (slight rotation creating circular feel)
    .rotate(BoneName.SHOULDER_L, -0.48, -0.09, 0.17) // -27.5°, -5°, 10° (left forward slightly)
    .rotate(BoneName.SHOULDER_R, -0.57, 0.26, -0.17) // -32.5°, 15°, -10° (right back slightly)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° (slight extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.48) // 85° (slight flexion)
    .rotate(BoneName.WRIST_L, 0, 0.09, 0) // 0°, 5° (gentle circular motion)
    .rotate(BoneName.WRIST_R, 0, -0.09, 0) // 0°, -5°
    .rotate(BoneName.PELVIS, 0, 0.05, 0) // 0°, 3° (subtle weight shift)
    .position(BoneName.PELVIS, -0.02, 0, 0) // Minimal lateral shift
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
 * **Korean**: 원형 측면보 (Wonhyeong Cheukmyeonbo) - Circular Sidestep
 * **Technique**: Arc-shaped lateral movement, hip-led
 *
 * Characteristics:
 * - Circular arc path (not straight lateral)
 * - Hip leads the movement
 * - Maintains flexible guard throughout
 * - Weight shifts smoothly
 *
 * Animation Phases:
 * - 0-180ms: Weight shift and hip initiation
 * - 180-400ms: Circular arc movement
 * - 400-550ms: Landing and settling
 *
 * @korean 원형측면보
 * @duration 550ms
 * @category Movement Animation
 */
export const TAE_CIRCULAR_SIDESTEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_circular_sidestep",
    "원형 측면보"
  )
    .asMovement(0.55, false)
    // Phase 1: Initial weight shift (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.17, 0) // 0°, -10° (hip begins rotation)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg loads)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (lead leg ready)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // Guard maintained
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Circular arc movement (275ms)
    .at(0.275)
    .rotate(BoneName.PELVIS, 0, -0.35, 0) // 0°, -20° (maximum hip rotation)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° (rear leg extends)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (lead leg pushes)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // Guard stable
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .position(BoneName.PELVIS, -0.18, 0.02, -0.03) // Arc trajectory (lateral + slight back)
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Landing and settling (550ms)
    .at(0.55)
    .rotate(BoneName.PELVIS, 0, -0.26, 0) // 0°, -15° (settled)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (grounded)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // Guard maintained
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .position(BoneName.PELVIS, -0.25, 0, 0) // Final lateral position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE DIAGONAL CIRCULAR APPROACH (대각선 원형 접근)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Diagonal Circular Approach Animation
 *
 * **Korean**: 대각선 원형 접근 (Daegakseon Wonhyeong Jeobgeun)
 * **Technique**: 45° curved approach with hands extending
 *
 * Characteristics:
 * - 45° diagonal angle with curved path
 * - Hands extend forward for joint control
 * - Hip rotation coordinates with step
 * - Smooth weight transfer
 *
 * Animation Phases:
 * - 0-233ms: Initial diagonal pivot
 * - 233-500ms: Curved approach with extending hands
 * - 500-667ms: Landing in engagement position
 *
 * @korean 대각선원형접근
 * @duration 667ms
 * @category Movement Animation
 */
export const TAE_DIAGONAL_CIRCULAR_APPROACH: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_diagonal_circular_approach",
    "대각선 원형 접근"
  )
    .asMovement(0.667, false)
    // Phase 1: Initial diagonal pivot (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.79, 0) // 0°, -45° (diagonal rotation)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (rear leg ready)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (lead leg ready)
    .rotate(BoneName.SHOULDER_L, -0.44, -0.26, 0.35) // -25°, -15°, 20° (hands begin extending)
    .rotate(BoneName.SHOULDER_R, -0.44, 0.26, -0.35) // -25°, 15°, -20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (extending)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° (extending)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Curved approach with extending hands (361ms)
    .at(0.361)
    .rotate(BoneName.PELVIS, 0, -0.61, 0) // 0°, -35° (unwinding)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° (extending)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (pushing)
    .rotate(BoneName.SHOULDER_L, -0.35, -0.35, 0.44) // -20°, -20°, 25° (reaching)
    .rotate(BoneName.SHOULDER_R, -0.35, 0.35, -0.44) // -20°, 20°, -25°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7) // -40° (extending more)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7) // 40° (extending more)
    .position(BoneName.PELVIS, -0.2, 0.02, 0.2) // Curved diagonal path
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Landing in engagement position (667ms)
    .at(0.667)
    .rotate(BoneName.PELVIS, 0, -0.79, 0) // 0°, -45° (settled diagonal)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (grounded)
    .rotate(BoneName.SHOULDER_L, -0.26, -0.44, 0.52) // -15°, -25°, 30° (hands extended)
    .rotate(BoneName.SHOULDER_R, -0.26, 0.44, -0.52) // -15°, 25°, -30°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (ready to engage)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° (ready to engage)
    .rotate(BoneName.WRIST_L, 0.09, 0, -0.09) // 5°, 0°, -5° (hands ready to grasp)
    .rotate(BoneName.WRIST_R, 0.09, 0, 0.09) // 5°, 0°, 5°
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
 * - Smooth transition to mid-level guard
 * - Hands at chest/solar plexus height
 * - Elbows bent at 80° for flexibility
 * - Weight evenly distributed
 *
 * Animation Phases:
 * - 0-150ms: Begin transition
 * - 150-300ms: Settle into Tae guard
 *
 * @korean 호수방어전환
 * @duration 300ms
 * @category Stance Animation
 */
export const TAE_FLEXIBLE_GUARD_TRANSITION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "tae_flexible_guard_transition",
    "호수 방어 전환"
  )
    .asStance(0.3, false)
    // Phase 1: Begin transition (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.44, -0.09, 0.22) // -25°, -5°, 12.5° (moving toward guard)
    .rotate(BoneName.SHOULDER_R, -0.44, 0.09, -0.22) // -25°, 5°, -12.5°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (transitioning)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (transitioning)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Settle into Tae guard (300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // -30°, -10°, 15° (Tae guard)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // -30°, 10°, -15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (Tae guard angle)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (Tae guard angle)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable stance)
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
