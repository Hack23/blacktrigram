/**
 * Movement Animations Module
 *
 * Footwork, dodges, and movement techniques (이동기술).
 * Positioning and distance management animations.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 이동 애니메이션 모듈
 *
 * @module systems/animation/MovementAnimations
 * @korean 이동애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS (유틸리티 함수)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert degrees to radians
 * 각도를 라디안으로 변환
 * 
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 * @example toRadians(90) // returns approximately 1.5708 (π/2)
 * @korean 각도변환
 */
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// ═══════════════════════════════════════════════════════════════════════════
// BASIC FOOTWORK (기본 풋워크)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Forward Step - 전진스텝 with Korean Martial Arts Weight Transfer
 *
 * Advancing step toward opponent with authentic Korean martial arts footwork mechanics.
 * Implements proper weight transfer (체중이동), stepping foot mechanics (디딤발),
 * and pivot foot stability (축발) principles.
 *
 * Weight Transfer Mechanics (체중이동 원리):
 * - Phase 1 (0-0.15s): Weight shift to back foot, front leg prepares (준비단계)
 * - Phase 2 (0.15-0.35s): Front foot lifts and extends forward (이동단계)
 * - Phase 3 (0.35-0.45s): Heel strikes ground, weight begins transfer (착지단계)
 * - Phase 4 (0.45-0.6s): Complete weight transfer, foot rolls to flat (안정단계)
 *
 * Korean Martial Arts Principles:
 * - 디딤발 (Didimbal): Stepping foot lands heel-first, rolls to ball
 * - 축발 (Chukbal): Pivot foot maintains balance during weight shift
 * - 체중이동 (Chejung Idong): Weight transfers smoothly, not abruptly
 * - 중심이동 (Jungsim Idong): Center of mass moves with body
 *
 * @korean 전진스텝애니메이션_체중이동
 */
export const MOVEMENT_FORWARD_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_forward_step", "전진스텝")
    .asMovement(0.6)
    // Phase 1: Preparation - Weight shift to back leg (준비단계)
    .at(0, "linear")
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.03, "ease-out")
    .position(BoneName.PELVIS, 0.05, 0, 0) // Hip shifts over back leg
    .rotate(BoneName.KNEE_R, toRadians(-8), 0, 0) // Back leg bends to accept weight
    .rotate(BoneName.KNEE_L, toRadians(-3), 0, 0) // Front leg lightens
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Lift step leg (이동단계 - 들어올리기)
    .at(0.15, "ease-out")
    .rotate(BoneName.HIP_L, toRadians(-30), 0, 0) // Knee lifts
    .rotate(BoneName.KNEE_L, toRadians(-40), 0, 0) // Shin forward
    .position(BoneName.PELVIS, 0.05, -0.02, 0) // Drop slightly for power
    .rotate(BoneName.KNEE_R, toRadians(-10), 0, 0) // Back leg bears full weight
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Extend forward (이동단계 - 앞으로)
    .at(0.25, "linear")
    .rotate(BoneName.HIP_L, toRadians(-15), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-10), 0, 0)
    .rotate(BoneName.FOOT_L, toRadians(25), 0, 0) // Toe up, heel ready
    .position(BoneName.PELVIS, 0.03, -0.025, 0.15) // Forward, slightly lower
    .done<MartialArtsAnimationBuilder>()
    // Phase 4: Heel strike (착지단계 - 뒤꿈치 착지)
    .at(0.35, "linear")
    .rotate(BoneName.HIP_L, toRadians(-10), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-8), 0, 0)
    .rotate(BoneName.FOOT_L, toRadians(20), 0, 0) // Heel down, toe still up - 디딤발 (Didimbal)
    .position(BoneName.PELVIS, 0, -0.03, 0.3) // Forward and lower on impact
    .rotate(BoneName.KNEE_R, toRadians(-6), 0, 0) // Back leg still supporting
    .done<MartialArtsAnimationBuilder>()
    // Phase 5: Weight transfer begins (체중이동 시작)
    .at(0.45, "ease-in")
    .position(BoneName.PELVIS, -0.03, -0.02, 0.35) // Hip shifts toward front leg - 체중이동 (Chejung Idong)
    .rotate(BoneName.KNEE_L, toRadians(-12), 0, 0) // Front leg accepts weight
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0) // Back leg relaxes
    .rotate(BoneName.FOOT_L, toRadians(5), 0, 0) // Foot rolling to flat
    .done<MartialArtsAnimationBuilder>()
    // Phase 6: Complete transfer and stabilization (안정단계)
    .at(0.6, "ease-in")
    .position(BoneName.PELVIS, -0.05, 0, 0.4) // Center over front leg
    .rotate(BoneName.KNEE_L, toRadians(-10), 0, 0) // Front leg stable
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0) // Back leg light
    .rotate(BoneName.FOOT_L, toRadians(-5), 0, 0) // Foot completely flat, slight pressure on ball
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3) // Guard maintained throughout
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Backward Step - 후진스텝 with Korean Martial Arts Weight Transfer
 *
 * Retreating step from opponent with authentic Korean martial arts footwork.
 * Implements proper rear weight transfer and defensive positioning.
 *
 * Weight Transfer Mechanics (후퇴 체중이동):
 * - Phase 1 (0-0.15s): Weight shift to front foot, back leg prepares
 * - Phase 2 (0.15-0.35s): Back foot lifts and extends backward
 * - Phase 3 (0.35-0.45s): Ball of foot touches down, weight begins transfer
 * - Phase 4 (0.45-0.6s): Complete weight transfer, maintain guard
 *
 * Korean Martial Arts Principles:
 * - Backward steps land on ball of foot first (unlike forward heel-first)
 * - Maintain forward-facing guard throughout retreat
 * - Center of mass moves smoothly backward
 * - Front leg remains ready to kick or defend
 *
 * @korean 후진스텝애니메이션_체중이동
 */
export const MOVEMENT_BACKWARD_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_backward_step", "후진스텝")
    .asMovement(0.6)
    .at(0, "linear")
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.03, "ease-out")
    .position(BoneName.PELVIS, -0.05, 0, 0) // Weight shifts to front leg
    .rotate(BoneName.KNEE_L, toRadians(-8), 0, 0) // Front leg accepts weight
    .rotate(BoneName.KNEE_R, toRadians(-3), 0, 0) // Back leg lightens
    .done<MartialArtsAnimationBuilder>()
    .at(0.15, "ease-out")
    .rotate(BoneName.HIP_R, toRadians(20), 0, 0) // Hip extends back
    .rotate(BoneName.KNEE_R, toRadians(-25), 0, 0) // Knee lifts slightly
    .position(BoneName.PELVIS, -0.05, -0.015, 0)
    .rotate(BoneName.KNEE_L, toRadians(-10), 0, 0) // Front leg stable
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "linear")
    .rotate(BoneName.HIP_R, toRadians(12), 0, 0)
    .rotate(BoneName.KNEE_R, toRadians(-8), 0, 0)
    .rotate(BoneName.FOOT_R, toRadians(-15), 0, 0) // Ball of foot ready to land
    .position(BoneName.PELVIS, -0.03, -0.02, -0.15) // Backward motion
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "linear")
    .rotate(BoneName.HIP_R, toRadians(8), 0, 0)
    .rotate(BoneName.KNEE_R, toRadians(-6), 0, 0)
    .rotate(BoneName.FOOT_R, toRadians(-12), 0, 0) // Ball of foot contacts ground
    .position(BoneName.PELVIS, 0, -0.025, -0.3)
    .rotate(BoneName.KNEE_L, toRadians(-8), 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "ease-in")
    .position(BoneName.PELVIS, 0.03, -0.015, -0.35) // Weight transfers to back leg
    .rotate(BoneName.KNEE_R, toRadians(-10), 0, 0) // Back leg accepts weight
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0) // Front leg lightens
    .rotate(BoneName.FOOT_R, toRadians(-5), 0, 0) // Heel settles down
    .done<MartialArtsAnimationBuilder>()
    .at(0.6, "ease-in")
    .position(BoneName.PELVIS, 0.05, 0, -0.4) // Stable rear stance
    .rotate(BoneName.KNEE_R, toRadians(-8), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3) // Guard maintained
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Left Sidestep - 왼쪽측면스텝 with Korean Martial Arts Weight Transfer
 *
 * Lateral movement left with authentic Korean martial arts footwork.
 * Creates angle advantage while maintaining forward guard.
 *
 * Weight Transfer Mechanics (측면 체중이동):
 * - Phase 1: Weight shifts to right leg
 * - Phase 2: Left foot slides lateral
 * - Phase 3: Weight transfers smoothly to left
 * - Phase 4: Right foot follows, stance width maintained
 *
 * Korean Martial Arts Principles:
 * - Guard faces forward throughout (원형보 - Circular footwork)
 * - Pelvis rotates slightly to engage hip
 * - Spine counter-rotates to maintain guard orientation
 * - Smooth weight distribution prevents telegraphing
 *
 * @korean 왼쪽측면스텝애니메이션_체중이동
 */
export const MOVEMENT_SIDESTEP_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_sidestep_left", "왼쪽측면스텝")
    .asMovement(0.5)
    .at(0, "linear")
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.08, "ease-out")
    .position(BoneName.PELVIS, 0.04, 0, 0) // Weight shifts to right leg
    .rotate(BoneName.PELVIS, 0, 0, toRadians(3)) // Slight tilt right
    .rotate(BoneName.KNEE_R, toRadians(-10), 0, 0) // Right leg accepts weight
    .rotate(BoneName.KNEE_L, toRadians(-3), 0, 0) // Left leg lightens
    .done<MartialArtsAnimationBuilder>()
    .at(0.18, "linear")
    .position(BoneName.PELVIS, 0.02, -0.01, 0) // Slight drop during slide
    .rotate(BoneName.PELVIS, 0, toRadians(5), toRadians(5)) // Hip engages for lateral movement
    .rotate(BoneName.SPINE_LOWER, 0, toRadians(-3), 0) // Counter-rotate to maintain guard
    .rotate(BoneName.KNEE_R, toRadians(-12), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.3, "ease-in")
    .position(BoneName.PELVIS, -0.15, 0, 0) // Lateral 15cm
    .rotate(BoneName.PELVIS, 0, toRadians(3), 0)
    .rotate(BoneName.SPINE_LOWER, 0, toRadians(-2), 0)
    .rotate(BoneName.KNEE_L, toRadians(-10), 0, 0) // Left leg accepts weight
    .rotate(BoneName.KNEE_R, toRadians(-6), 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "ease-in")
    .position(BoneName.PELVIS, -0.3, 0, 0) // Full 30cm lateral
    .rotate(BoneName.PELVIS, 0, 0, 0) // Return to neutral
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-8), 0, 0)
    .rotate(BoneName.KNEE_R, toRadians(-8), 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3) // Guard maintained forward
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Right Sidestep - 오른쪽측면스텝 with Korean Martial Arts Weight Transfer
 *
 * Lateral movement right with authentic Korean martial arts footwork.
 * Mirror of left sidestep.
 *
 * @korean 오른쪽측면스텝애니메이션_체중이동
 */
export const MOVEMENT_SIDESTEP_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_sidestep_right", "오른쪽측면스텝")
    .asMovement(0.5)
    .at(0, "linear")
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-5), 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.08, "ease-out")
    .position(BoneName.PELVIS, -0.04, 0, 0) // Weight shifts to left leg
    .rotate(BoneName.PELVIS, 0, 0, toRadians(-3))
    .rotate(BoneName.KNEE_L, toRadians(-10), 0, 0)
    .rotate(BoneName.KNEE_R, toRadians(-3), 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.18, "linear")
    .position(BoneName.PELVIS, -0.02, -0.01, 0) // Right foot slides lateral
    .rotate(BoneName.PELVIS, 0, toRadians(-5), toRadians(-5))
    .rotate(BoneName.SPINE_LOWER, 0, toRadians(3), 0)
    .rotate(BoneName.KNEE_L, toRadians(-12), 0, 0)
    .rotate(BoneName.KNEE_R, toRadians(-5), 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.3, "ease-in")
    .position(BoneName.PELVIS, 0.15, 0, 0) // Weight begins transfer to right
    .rotate(BoneName.PELVIS, 0, toRadians(-3), 0)
    .rotate(BoneName.SPINE_LOWER, 0, toRadians(2), 0)
    .rotate(BoneName.KNEE_R, toRadians(-10), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-6), 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "ease-in")
    .position(BoneName.PELVIS, 0.3, 0, 0) // Stable lateral stance
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.KNEE_R, toRadians(-8), 0, 0)
    .rotate(BoneName.KNEE_L, toRadians(-8), 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3) // Guard maintained
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Step Drag - 스텝드래그
 *
 * Lead foot step with rear drag.
 * Maintains stance while moving.
 *
 * @korean 스텝드래그애니메이션
 */
export const MOVEMENT_STEP_DRAG_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_step_drag", "스텝드래그")
    .asMovement(0.35)
    .step(0.12)
    .step(0.1) // Drag
    .recover(0.13)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PIVOTS AND TURNS (피봇과 회전)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Left Pivot - 왼쪽피봇
 *
 * Pivot on lead foot to the left.
 * 45 degree angle change.
 *
 * @korean 왼쪽피봇애니메이션
 */
export const MOVEMENT_PIVOT_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_pivot_left", "왼쪽피봇")
    .asMovement(0.28)
    .rotate(0.14)
    .recover(0.14)
    .build();

/**
 * Right Pivot - 오른쪽피봇
 *
 * Pivot on lead foot to the right.
 * 45 degree angle change.
 *
 * @korean 오른쪽피봇애니메이션
 */
export const MOVEMENT_PIVOT_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_pivot_right", "오른쪽피봇")
    .asMovement(0.28)
    .rotate(0.14)
    .recover(0.14)
    .build();

/**
 * Full Spin - 전체회전
 *
 * Complete 360 rotation.
 * For spinning attack setups.
 *
 * @korean 전체회전애니메이션
 */
export const MOVEMENT_FULL_SPIN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_full_spin", "전체회전")
    .asMovement(0.4)
    .spin(0.25)
    .recover(0.15)
    .build();

/**
 * Quarter Turn - 사분회전
 *
 * 90 degree turn.
 * Quick repositioning.
 *
 * @korean 사분회전애니메이션
 */
export const MOVEMENT_QUARTER_TURN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_quarter_turn", "사분회전")
    .asMovement(0.25)
    .rotate(0.12)
    .recover(0.13)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BOUNCING FOOTWORK (바운싱 풋워크)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bounce Step - 바운스스텝
 *
 * Light bouncing movement.
 * Keeps fighter mobile.
 *
 * @korean 바운스스텝애니메이션
 */
export const MOVEMENT_BOUNCE_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_bounce_step", "바운스스텝")
    .asMovement(0.25)
    .step(0.08)
    .step(0.08)
    .recover(0.09)
    .build();

/**
 * Switch Step - 스위치스텝
 *
 * Quick stance switch.
 * Changes lead foot.
 *
 * @korean 스위치스텝애니메이션
 */
export const MOVEMENT_SWITCH_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_switch_step", "스위치스텝")
    .asMovement(0.22)
    .jump(0.08)
    .step(0.08)
    .recover(0.06)
    .build();

/**
 * Shuffle - 셔플
 *
 * Quick shuffle step.
 * Rapid forward movement.
 *
 * @korean 셔플애니메이션
 */
export const MOVEMENT_SHUFFLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_shuffle", "셔플")
    .asMovement(0.28)
    .step(0.08)
    .step(0.08)
    .step(0.06)
    .recover(0.06)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EVASIVE FOOTWORK (회피 풋워크)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Back Step - 백스텝
 *
 * Quick retreat step.
 * Creates distance rapidly.
 *
 * @korean 백스텝애니메이션
 */
export const MOVEMENT_BACK_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_back_step", "백스텝")
    .asMovement(0.25)
    .step(0.12)
    .recover(0.13)
    .build();

/**
 * Circle Left - 서클왼쪽
 *
 * Circling movement to the left.
 * Maintains distance while repositioning.
 *
 * @korean 서클왼쪽애니메이션
 */
export const MOVEMENT_CIRCLE_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_circle_left", "서클왼쪽")
    .asMovement(0.4)
    .shift(0.12)
    .step(0.12)
    .recover(0.16)
    .build();

/**
 * Circle Right - 서클오른쪽
 *
 * Circling movement to the right.
 * Maintains distance while repositioning.
 *
 * @korean 서클오른쪽애니메이션
 */
export const MOVEMENT_CIRCLE_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_circle_right", "서클오른쪽")
    .asMovement(0.4)
    .shift(0.12)
    .step(0.12)
    .recover(0.16)
    .build();

/**
 * Angle Off - 앵글오프
 *
 * Step at diagonal angle.
 * Creates superior position.
 *
 * @korean 앵글오프애니메이션
 */
export const MOVEMENT_ANGLE_OFF_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_angle_off", "앵글오프")
    .asMovement(0.32)
    .shift(0.1)
    .step(0.1)
    .recover(0.12)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// STANCE CHANGES (스탠스 변경)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Orthodox to Southpaw - 오소독스투사우스포
 *
 * Stance switch orthodox to southpaw.
 * Changes fighting orientation.
 *
 * @korean 오소독스투사우스포애니메이션
 */
export const MOVEMENT_ORTHODOX_TO_SOUTHPAW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "movement_orthodox_to_southpaw",
    "오소독스투사우스포"
  )
    .asMovement(0.35)
    .jump(0.1)
    .rotate(0.12)
    .recover(0.13)
    .build();

/**
 * Southpaw to Orthodox - 사우스포투오소독스
 *
 * Stance switch southpaw to orthodox.
 * Changes fighting orientation.
 *
 * @korean 사우스포투오소독스애니메이션
 */
export const MOVEMENT_SOUTHPAW_TO_ORTHODOX_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "movement_southpaw_to_orthodox",
    "사우스포투오소독스"
  )
    .asMovement(0.35)
    .jump(0.1)
    .rotate(0.12)
    .recover(0.13)
    .build();

/**
 * Drop Level - 드롭레벨
 *
 * Lower fighting stance.
 * For takedown or level change attacks.
 *
 * @korean 드롭레벨애니메이션
 */
export const MOVEMENT_DROP_LEVEL_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_drop_level", "드롭레벨")
    .asMovement(0.3)
    .duck(0.15)
    .recover(0.15)
    .build();

/**
 * Rise Up - 라이즈업
 *
 * Return to normal fighting stance.
 * Recovery from level change.
 *
 * @korean 라이즈업애니메이션
 */
export const MOVEMENT_RISE_UP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_rise_up", "라이즈업")
    .asMovement(0.28)
    .lean(0.1) // Rise
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING MOVEMENTS (점프 이동)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jump Back - 점프백
 *
 * Jumping retreat.
 * Maximum distance creation.
 *
 * @korean 점프백애니메이션
 */
export const MOVEMENT_JUMP_BACK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_jump_back", "점프백")
    .asMovement(0.45)
    .jump(0.2)
    .recover(0.25)
    .build();

/**
 * Jump In - 점프인
 *
 * Jumping advance.
 * Closes distance rapidly.
 *
 * @korean 점프인애니메이션
 */
export const MOVEMENT_JUMP_IN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_jump_in", "점프인")
    .asMovement(0.45)
    .jump(0.2)
    .recover(0.25)
    .build();

/**
 * Jump Aside - 점프사이드
 *
 * Jumping sideways.
 * Lateral evasion.
 *
 * @korean 점프사이드애니메이션
 */
export const MOVEMENT_JUMP_ASIDE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_jump_aside", "점프사이드")
    .asMovement(0.42)
    .jump(0.18)
    .shift(0.1)
    .recover(0.14)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DODGES (회피)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Duck - 덕
 *
 * Ducking under attack.
 * Low evasion.
 *
 * @korean 덕애니메이션
 */
export const MOVEMENT_DUCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_duck", "덕")
    .asMovement(0.3)
    .duck(0.15)
    .recover(0.15)
    .build();

/**
 * Lean Back - 린백
 *
 * Leaning away from attack.
 * Upper body evasion.
 *
 * @korean 린백애니메이션
 */
export const MOVEMENT_LEAN_BACK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_lean_back", "린백")
    .asMovement(0.28)
    .lean(0.14)
    .recover(0.14)
    .build();

/**
 * Sway Left - 스웨이왼쪽
 *
 * Body sway to the left.
 * Subtle evasion.
 *
 * @korean 스웨이왼쪽애니메이션
 */
export const MOVEMENT_SWAY_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_sway_left", "스웨이왼쪽")
    .asMovement(0.25)
    .bob(0.12)
    .recover(0.13)
    .build();

/**
 * Sway Right - 스웨이오른쪽
 *
 * Body sway to the right.
 * Subtle evasion.
 *
 * @korean 스웨이오른쪽애니메이션
 */
export const MOVEMENT_SWAY_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_sway_right", "스웨이오른쪽")
    .asMovement(0.25)
    .bob(0.12)
    .recover(0.13)
    .build();

/**
 * Bob and Weave - 밥앤위브
 *
 * U-shaped head movement.
 * Classic boxing evasion.
 *
 * @korean 밥앤위브애니메이션
 */
export const MOVEMENT_BOB_WEAVE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_bob_weave", "밥앤위브")
    .asMovement(0.4)
    .bob(0.12)
    .weave(0.13)
    .recover(0.15)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// FEINTS (페인트)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab Feint - 잽페인트
 *
 * Fake jab movement.
 * Draws reaction.
 *
 * @korean 잽페인트애니메이션
 */
export const MOVEMENT_JAB_FEINT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_jab_feint", "잽페인트")
    .asMovement(0.2)
    .punchWindup(0.08)
    .recover(0.12)
    .build();

/**
 * Level Change Feint - 레벨체인지페인트
 *
 * Fake level drop.
 * Draws takedown defense.
 *
 * @korean 레벨체인지페인트애니메이션
 */
export const MOVEMENT_LEVEL_FEINT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_level_feint", "레벨체인지페인트")
    .asMovement(0.25)
    .duck(0.1)
    .recover(0.15)
    .build();

/**
 * Kick Feint - 킥페인트
 *
 * Fake kick chamber.
 * Draws leg check.
 *
 * @korean 킥페인트애니메이션
 */
export const MOVEMENT_KICK_FEINT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_kick_feint", "킥페인트")
    .asMovement(0.25)
    .chamber(0.1)
    .recover(0.15)
    .build();

/**
 * Step Feint - 스텝페인트
 *
 * Fake step forward.
 * Draws counter.
 *
 * @korean 스텝페인트애니메이션
 */
export const MOVEMENT_STEP_FEINT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_step_feint", "스텝페인트")
    .asMovement(0.22)
    .step(0.08)
    .recover(0.14)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT MOVEMENT ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all movement animations for easy access
 * 이동 애니메이션 맵
 */
export const MOVEMENT_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    // Basic Footwork
    ["movement_forward_step", MOVEMENT_FORWARD_STEP_ANIMATION],
    ["movement_backward_step", MOVEMENT_BACKWARD_STEP_ANIMATION],
    ["movement_sidestep_left", MOVEMENT_SIDESTEP_LEFT_ANIMATION],
    ["movement_sidestep_right", MOVEMENT_SIDESTEP_RIGHT_ANIMATION],
    ["movement_step_drag", MOVEMENT_STEP_DRAG_ANIMATION],

    // Pivots and Turns
    ["movement_pivot_left", MOVEMENT_PIVOT_LEFT_ANIMATION],
    ["movement_pivot_right", MOVEMENT_PIVOT_RIGHT_ANIMATION],
    ["movement_full_spin", MOVEMENT_FULL_SPIN_ANIMATION],
    ["movement_quarter_turn", MOVEMENT_QUARTER_TURN_ANIMATION],

    // Bouncing Footwork
    ["movement_bounce_step", MOVEMENT_BOUNCE_STEP_ANIMATION],
    ["movement_switch_step", MOVEMENT_SWITCH_STEP_ANIMATION],
    ["movement_shuffle", MOVEMENT_SHUFFLE_ANIMATION],

    // Evasive Footwork
    ["movement_back_step", MOVEMENT_BACK_STEP_ANIMATION],
    ["movement_circle_left", MOVEMENT_CIRCLE_LEFT_ANIMATION],
    ["movement_circle_right", MOVEMENT_CIRCLE_RIGHT_ANIMATION],
    ["movement_angle_off", MOVEMENT_ANGLE_OFF_ANIMATION],

    // Stance Changes
    ["movement_orthodox_to_southpaw", MOVEMENT_ORTHODOX_TO_SOUTHPAW_ANIMATION],
    ["movement_southpaw_to_orthodox", MOVEMENT_SOUTHPAW_TO_ORTHODOX_ANIMATION],
    ["movement_drop_level", MOVEMENT_DROP_LEVEL_ANIMATION],
    ["movement_rise_up", MOVEMENT_RISE_UP_ANIMATION],

    // Jumping
    ["movement_jump_back", MOVEMENT_JUMP_BACK_ANIMATION],
    ["movement_jump_in", MOVEMENT_JUMP_IN_ANIMATION],
    ["movement_jump_aside", MOVEMENT_JUMP_ASIDE_ANIMATION],

    // Dodges
    ["movement_duck", MOVEMENT_DUCK_ANIMATION],
    ["movement_lean_back", MOVEMENT_LEAN_BACK_ANIMATION],
    ["movement_sway_left", MOVEMENT_SWAY_LEFT_ANIMATION],
    ["movement_sway_right", MOVEMENT_SWAY_RIGHT_ANIMATION],
    ["movement_bob_weave", MOVEMENT_BOB_WEAVE_ANIMATION],

    // Feints
    ["movement_jab_feint", MOVEMENT_JAB_FEINT_ANIMATION],
    ["movement_level_feint", MOVEMENT_LEVEL_FEINT_ANIMATION],
    ["movement_kick_feint", MOVEMENT_KICK_FEINT_ANIMATION],
    ["movement_step_feint", MOVEMENT_STEP_FEINT_ANIMATION],
  ]);
