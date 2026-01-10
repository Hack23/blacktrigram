/**
 * Combo Animations Module
 *
 * Multi-hit combination attacks and chain sequences (연속기술).
 * Complex attack patterns combining multiple strikes.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 연속 콤보 애니메이션 모듈
 *
 * @module systems/animation/ComboAnimations
 * @korean 콤보애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// BOXING COMBOS (권투 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * One-Two Combo - 원투콤보
 *
 * Classic jab-cross combination.
 * Fast, fundamental boxing combo.
 *
 * @korean 원투콤보애니메이션
 */
export const COMBO_ONE_TWO_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_one_two", "원투콤보")
    .asAttack(0.4)
    .punchWindup(0.05)
    .punchExtend(0.1) // Jab
    .punchWindup(0.08)
    .punchExtend(0.12) // Cross
    .recover(0.05)
    .build();

/**
 * One-Two-Hook - 원투훅
 *
 * Jab-cross-hook combination.
 * Three-punch power combo.
 *
 * @korean 원투훅애니메이션
 */
export const COMBO_ONE_TWO_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_one_two_hook", "원투훅")
    .asAttack(0.55)
    .punchWindup(0.05)
    .punchExtend(0.08) // Jab
    .punchWindup(0.06)
    .punchExtend(0.1) // Cross
    .hookWindup(0.08)
    .hookPunch(0.1) // Hook
    .recover(0.08)
    .build();

/**
 * Double Jab Cross - 더블잽크로스
 *
 * Jab-jab-cross combination.
 * Setup combo with double jab.
 *
 * @korean 더블잽크로스애니메이션
 */
export const COMBO_DOUBLE_JAB_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_double_jab_cross", "더블잽크로스")
    .asAttack(0.5)
    .punchWindup(0.04)
    .punchExtend(0.06) // Jab 1
    .punchWindup(0.04)
    .punchExtend(0.06) // Jab 2
    .punchWindup(0.08)
    .punchExtend(0.12) // Cross
    .recover(0.1)
    .build();

/**
 * Body-Head Combo - 바디헤드콤보
 *
 * Body hook followed by head hook.
 * Level-change combination.
 *
 * @korean 바디헤드콤보애니메이션
 */
export const COMBO_BODY_HEAD_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_body_head", "바디헤드콤보")
    .asAttack(0.5)
    .uppercutCrouch(0.08) // Level change down
    .hookPunch(0.12) // Body hook
    .uppercutPunch(0.12) // Rise with head shot
    .recover(0.18)
    .build();

/**
 * Hook-Uppercut - 훅어퍼컷
 *
 * Hook to uppercut combination.
 * Ripping combo pattern.
 *
 * @korean 훅어퍼컷애니메이션
 */
export const COMBO_HOOK_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_hook_uppercut", "훅어퍼컷")
    .asAttack(0.45)
    .hookWindup(0.08)
    .hookPunch(0.1) // Lead hook
    .uppercutCrouch(0.07)
    .uppercutPunch(0.1) // Rear uppercut
    .recover(0.1)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KICKBOXING COMBOS (킥복싱 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * One-Two-Kick - 원투킥
 *
 * Jab-cross-roundhouse combination.
 * Classic kickboxing combo.
 *
 * @korean 원투킥애니메이션
 */
export const COMBO_ONE_TWO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_one_two_kick", "원투킥")
    .asAttack(0.6)
    .punchWindup(0.04)
    .punchExtend(0.08) // Jab
    .punchWindup(0.06)
    .punchExtend(0.1) // Cross
    .chamber(0.1)
    .roundhouse(0.12) // Kick
    .recover(0.1)
    .build();

/**
 * Kick-Punch-Kick - 킥펀치킥
 *
 * Kick to punch to kick sequence.
 * Varied attack chain.
 *
 * @korean 킥펀치킥애니메이션
 */
export const COMBO_KICK_PUNCH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kick_punch_kick", "킥펀치킥")
    .asAttack(0.7)
    .chamber(0.08)
    .roundhouse(0.12) // Kick 1
    .punchWindup(0.06)
    .punchExtend(0.1) // Cross
    .chamber(0.1)
    .roundhouse(0.14) // Kick 2
    .recover(0.1)
    .build();

/**
 * Low-High Kick Combo - 로우하이킥
 *
 * Low kick followed by high kick.
 * Level change with kicks.
 *
 * @korean 로우하이킥콤보애니메이션
 */
export const COMBO_LOW_HIGH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_low_high_kick", "로우하이킥")
    .asAttack(0.55)
    .lowKickChamber(0.08)
    .lowKickSweep(0.1) // Low kick
    .chamber(0.12)
    .roundhouse(0.15) // High kick
    .recover(0.1)
    .build();

/**
 * Switch Kick Combo - 스위치킥콤보
 *
 * Lead kick followed by rear kick.
 * Stance-switching combo.
 *
 * @korean 스위치킥콤보애니메이션
 */
export const COMBO_SWITCH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_switch_kick", "스위치킥콤보")
    .asAttack(0.6)
    .chamber(0.1)
    .roundhouse(0.12) // Lead roundhouse
    .recover(0.08)
    .chamber(0.1)
    .roundhouse(0.12) // Rear roundhouse (switched)
    .recover(0.08)
    .build();

/**
 * Jab-Low Kick - 잽로우킥
 *
 * Jab followed by low kick.
 * Classic Dutch kickboxing combo.
 *
 * @korean 잽로우킥애니메이션
 */
export const COMBO_JAB_LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_jab_low_kick", "잽로우킥")
    .asAttack(0.45)
    .punchWindup(0.05)
    .punchExtend(0.08) // Jab
    .lowKickChamber(0.1)
    .lowKickSweep(0.12) // Low kick
    .recover(0.1)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KNEE/ELBOW COMBOS (무릎팔꿈치 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Clinch Knee Elbow - 클린치니엘보
 *
 * Clinch range knee and elbow combo.
 * Muay Thai plum combo.
 *
 * @korean 클린치니엘보애니메이션
 */
export const COMBO_CLINCH_KNEE_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_clinch_knee_elbow", "클린치니엘보")
    .asAttack(0.6)
    .withClinch()
    .clinchGrab(0.1)
    .kneeStrike(0.12) // Knee
    .elbowChamber(0.08)
    .elbowStrike(0.12) // Elbow
    .recover(0.18)
    .build();

/**
 * Double Knee Strike - 더블니스트라이크
 *
 * Alternating knee strikes.
 * Clinch domination combo.
 *
 * @korean 더블니스트라이크애니메이션
 */
export const COMBO_DOUBLE_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_double_knee", "더블니스트라이크")
    .asAttack(0.55)
    .withClinch()
    .clinchGrab(0.1)
    .kneeStrike(0.12) // Knee 1
    .kneeStrike(0.12) // Knee 2
    .recover(0.21)
    .build();

/**
 * Elbow Chain - 엘보체인
 *
 * Multiple elbow strikes in sequence.
 * Close-range devastation.
 *
 * @korean 엘보체인애니메이션
 */
export const COMBO_ELBOW_CHAIN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_elbow_chain", "엘보체인")
    .asAttack(0.5)
    .elbowChamber(0.06)
    .elbowStrike(0.1) // Elbow 1
    .elbowChamber(0.06)
    .elbowStrike(0.1) // Elbow 2
    .elbowUppercut(0.1) // Rising elbow
    .recover(0.08)
    .build();

/**
 * Knee-Elbow-Knee - 니엘보니
 *
 * Knee-elbow-knee sequence.
 * Triple threat combo.
 *
 * @korean 니엘보니애니메이션
 */
export const COMBO_KNEE_ELBOW_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_knee_elbow_knee", "니엘보니")
    .asAttack(0.65)
    .withClinch()
    .clinchGrab(0.08)
    .kneeStrike(0.12) // Knee 1
    .elbowStrike(0.1) // Elbow
    .kneeStrike(0.12) // Knee 2
    .recover(0.23)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// TRADITIONAL MARTIAL ARTS COMBOS (전통무술 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Taekwondo Triple Kick - 태권도삼중발차기
 *
 * Three-kick combination.
 * Fast consecutive kicks.
 *
 * @korean 태권도삼중발차기애니메이션
 */
export const COMBO_TAEKWONDO_TRIPLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "combo_taekwondo_triple",
    "태권도삼중발차기"
  )
    .asAttack(0.7)
    .chamber(0.08)
    .extend(0.1) // Front kick
    .roundhouse(0.12) // Roundhouse
    .spin(0.15)
    .spinKick(0.15) // Back kick
    .recover(0.1)
    .build();

/**
 * Karate Ippon Combo - 가라데일본콤보
 *
 * Traditional karate single-point combo.
 * Precise strike combination.
 *
 * @korean 가라데일본콤보애니메이션
 */
export const COMBO_KARATE_IPPON_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_karate_ippon", "가라데일본콤보")
    .asAttack(0.5)
    .punchWindup(0.08)
    .punchExtend(0.1) // Gyaku-zuki (reverse punch)
    .chamber(0.1)
    .extend(0.12) // Mae-geri (front kick)
    .recover(0.1)
    .build();

/**
 * Wing Chun Chain - 영춘권연쇄
 *
 * Wing Chun chain punches.
 * Rapid straight punches.
 *
 * @korean 영춘권연쇄애니메이션
 */
export const COMBO_WING_CHUN_CHAIN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_wing_chun_chain", "영춘권연쇄")
    .asAttack(0.5)
    .punchExtend(0.05) // Punch 1
    .punchExtend(0.05) // Punch 2
    .punchExtend(0.05) // Punch 3
    .punchExtend(0.05) // Punch 4
    .punchExtend(0.05) // Punch 5
    .punchExtend(0.05) // Punch 6
    .palmStrike(0.1) // Palm finish
    .recover(0.1)
    .build();

/**
 * Hapkido Flow - 합기도흐름
 *
 * Hapkido flowing technique.
 * Strike to joint lock.
 *
 * @korean 합기도흐름애니메이션
 */
export const COMBO_HAPKIDO_FLOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_hapkido_flow", "합기도흐름")
    .asAttack(0.65)
    .palmStrike(0.1) // Palm strike
    .parry(0.08) // Redirect
    .wristGrab(0.12) // Wrist control
    .wristTwist(0.15) // Lock
    .recover(0.2)
    .build();

/**
 * Judo Counter - 유도반격
 *
 * Judo counter throw.
 * Defense into offense.
 *
 * @korean 유도반격애니메이션
 */
export const COMBO_JUDO_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_judo_counter", "유도반격")
    .asAttack(0.7)
    .parry(0.1) // Block/deflect
    .clinchGrab(0.12) // Grip
    .throwEntry(0.15) // Entry
    .throwLift(0.15) // Throw
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// MMA COMBOS (종합격투기 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ground and Pound - 그라운드앤파운드
 *
 * Takedown to ground strikes.
 * MMA finish combo.
 *
 * @korean 그라운드앤파운드애니메이션
 */
export const COMBO_GROUND_AND_POUND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "combo_ground_and_pound",
    "그라운드앤파운드"
  )
    .asAttack(0.8)
    .throwEntry(0.15) // Shoot
    .slamDown(0.2) // Takedown
    .overhandPunch(0.15) // Ground strike 1
    .punchExtend(0.1) // Ground strike 2
    .recover(0.2)
    .build();

/**
 * Sprawl and Brawl - 스프롤앤브롤
 *
 * Sprawl defense into counter.
 * Anti-wrestling combo.
 *
 * @korean 스프롤앤브롤애니메이션
 */
export const COMBO_SPRAWL_BRAWL_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_sprawl_brawl", "스프롤앤브롤")
    .asAttack(0.6)
    .counterParry(0.12) // Sprawl defense
    .uppercutPunch(0.12) // Rising counter
    .kneeStrike(0.12) // Knee finish
    .recover(0.24)
    .build();

/**
 * Dirty Boxing - 더티복싱
 *
 * Clinch fighting combo.
 * Short-range strikes from clinch.
 *
 * @korean 더티복싱애니메이션
 */
export const COMBO_DIRTY_BOXING_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_dirty_boxing", "더티복싱")
    .asAttack(0.55)
    .withClinch()
    .clinchGrab(0.1)
    .elbowStrike(0.1) // Short elbow
    .uppercutPunch(0.1) // Clinch uppercut
    .hookPunch(0.1) // Hook inside
    .recover(0.15)
    .build();

/**
 * Cage Combo - 케이지콤보
 *
 * Wall fighting combination.
 * Cage-utilizing attacks.
 *
 * @korean 케이지콤보애니메이션
 */
export const COMBO_CAGE_COMBO_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_cage_combo", "케이지콤보")
    .asAttack(0.65)
    .clinchGrab(0.1) // Cage position
    .kneeStrike(0.12) // Body knee
    .elbowStrike(0.1) // Elbow
    .shoulderStrike(0.1) // Shoulder
    .recover(0.23)
    .build();

/**
 * Flying Attack Combo - 플라잉어택
 *
 * Jumping attack sequence.
 * Spectacular finish.
 *
 * @korean 플라잉어택애니메이션
 */
export const COMBO_FLYING_ATTACK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_flying_attack", "플라잉어택")
    .asAttack(0.7)
    .jump(0.12)
    .kneeStrike(0.15) // Flying knee
    .punchExtend(0.12) // Punch follow-up
    .axeKick(0.15) // Axe kick finish
    .recover(0.16)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// FINISHER COMBOS (마무리 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knockout Combo - 녹아웃콤보
 *
 * Power combo designed for finish.
 * Maximum damage output.
 *
 * @korean 녹아웃콤보애니메이션
 */
export const COMBO_KNOCKOUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_knockout", "녹아웃콤보")
    .asAttack(0.65)
    .overhandPunch(0.15) // Overhand
    .hookPunch(0.12) // Hook
    .uppercutPunch(0.12) // Uppercut finish
    .recover(0.26)
    .build();

/**
 * Spinning Destruction - 회전파괴
 *
 * Spinning attacks combo.
 * Spectacular power shots.
 *
 * @korean 회전파괴애니메이션
 */
export const COMBO_SPINNING_DESTRUCTION_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_spinning_destruction", "회전파괴")
    .asAttack(0.7)
    .spin(0.12)
    .spinKick(0.15) // Spinning kick
    .spin(0.1)
    .elbowStrike(0.12) // Spinning elbow
    .recover(0.21)
    .build();

/**
 * Question Mark to Finish - 물음표마무리
 *
 * Question mark kick setup to finish.
 * Deceptive power combo.
 *
 * @korean 물음표마무리애니메이션
 */
export const COMBO_QUESTION_MARK_FINISH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "combo_question_mark_finish",
    "물음표마무리"
  )
    .asAttack(0.65)
    .lowKickChamber(0.1) // Fake low
    .roundhouse(0.15) // Head kick
    .punchExtend(0.12) // Follow-up punch
    .recover(0.28)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT COMBO ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all combo animations for easy access
 * 콤보 애니메이션 맵
 */
export const COMBO_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map(
  [
    // Boxing
    ["combo_one_two", COMBO_ONE_TWO_ANIMATION],
    ["combo_one_two_hook", COMBO_ONE_TWO_HOOK_ANIMATION],
    ["combo_double_jab_cross", COMBO_DOUBLE_JAB_CROSS_ANIMATION],
    ["combo_body_head", COMBO_BODY_HEAD_ANIMATION],
    ["combo_hook_uppercut", COMBO_HOOK_UPPERCUT_ANIMATION],

    // Kickboxing
    ["combo_one_two_kick", COMBO_ONE_TWO_KICK_ANIMATION],
    ["combo_kick_punch_kick", COMBO_KICK_PUNCH_KICK_ANIMATION],
    ["combo_low_high_kick", COMBO_LOW_HIGH_KICK_ANIMATION],
    ["combo_switch_kick", COMBO_SWITCH_KICK_ANIMATION],
    ["combo_jab_low_kick", COMBO_JAB_LOW_KICK_ANIMATION],

    // Knee/Elbow
    ["combo_clinch_knee_elbow", COMBO_CLINCH_KNEE_ELBOW_ANIMATION],
    ["combo_double_knee", COMBO_DOUBLE_KNEE_ANIMATION],
    ["combo_elbow_chain", COMBO_ELBOW_CHAIN_ANIMATION],
    ["combo_knee_elbow_knee", COMBO_KNEE_ELBOW_KNEE_ANIMATION],

    // Traditional
    ["combo_taekwondo_triple", COMBO_TAEKWONDO_TRIPLE_ANIMATION],
    ["combo_karate_ippon", COMBO_KARATE_IPPON_ANIMATION],
    ["combo_wing_chun_chain", COMBO_WING_CHUN_CHAIN_ANIMATION],
    ["combo_hapkido_flow", COMBO_HAPKIDO_FLOW_ANIMATION],
    ["combo_judo_counter", COMBO_JUDO_COUNTER_ANIMATION],

    // MMA
    ["combo_ground_and_pound", COMBO_GROUND_AND_POUND_ANIMATION],
    ["combo_sprawl_brawl", COMBO_SPRAWL_BRAWL_ANIMATION],
    ["combo_dirty_boxing", COMBO_DIRTY_BOXING_ANIMATION],
    ["combo_cage_combo", COMBO_CAGE_COMBO_ANIMATION],
    ["combo_flying_attack", COMBO_FLYING_ATTACK_ANIMATION],

    // Finishers
    ["combo_knockout", COMBO_KNOCKOUT_ANIMATION],
    ["combo_spinning_destruction", COMBO_SPINNING_DESTRUCTION_ANIMATION],
    ["combo_question_mark_finish", COMBO_QUESTION_MARK_FINISH_ANIMATION],
  ]
);
