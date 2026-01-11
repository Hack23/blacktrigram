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
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// BASIC FOOTWORK (기본 풋워크)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Forward Step - 전진스텝
 *
 * Advancing step toward opponent.
 * Closes distance safely.
 *
 * @korean 전진스텝애니메이션
 */
export const MOVEMENT_FORWARD_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_forward_step", "전진스텝")
    .asMovement(0.3)
    .step(0.15)
    .recover(0.15)
    .build();

/**
 * Backward Step - 후진스텝
 *
 * Retreating step from opponent.
 * Creates safe distance.
 *
 * @korean 후진스텝애니메이션
 */
export const MOVEMENT_BACKWARD_STEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_backward_step", "후진스텝")
    .asMovement(0.3)
    .step(0.15)
    .recover(0.15)
    .build();

/**
 * Left Sidestep - 왼쪽측면스텝
 *
 * Lateral movement left.
 * Creates angle advantage.
 *
 * @korean 왼쪽측면스텝애니메이션
 */
export const MOVEMENT_SIDESTEP_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("movement_sidestep_left", "왼쪽측면스텝")
    .asMovement(0.28)
    .shift(0.14)
    .recover(0.14)
    .build();

/**
 * Right Sidestep - 오른쪽측면스텝
 *
 * Lateral movement right.
 * Creates angle advantage.
 *
 * @korean 오른쪽측면스텝애니메이션
 */
export const MOVEMENT_SIDESTEP_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "movement_sidestep_right",
    "오른쪽측면스텝"
  )
    .asMovement(0.28)
    .shift(0.14)
    .recover(0.14)
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
