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

import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

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
    "태권도삼중발차기",
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
 * Taekkyeon Poom Balki - 택견품밟기
 *
 * Traditional Taekkyeon footwork-based combo.
 * Rhythmic stepping (품밟기) into fluid kick sequence.
 * Korea's oldest martial art (UNESCO Intangible Cultural Heritage).
 *
 * @korean 택견품밟기콤보애니메이션
 */
export const COMBO_TAEKKYEON_POOM_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_taekkyeon_poom", "택견품밟기")
    .asAttack(0.6)
    .sideStepLeft(0.1) // 품밟기 - rhythmic stepping
    .lowKickSweep(0.12) // 낮은걸이 - low leg sweep
    .chamber(0.1)
    .extend(0.12) // 차올리기 - rising kick
    .palmStrike(0.08) // 손치기 - palm technique
    .recover(0.08)
    .build();

/**
 * Subak Yeonhwan - 수박연환
 *
 * Subak continuous palm strikes.
 * Ancient Korean striking art predating Taekwondo.
 * Emphasis on open-hand techniques and circular motion.
 *
 * @korean 수박연환콤보애니메이션
 */
export const COMBO_SUBAK_CHAIN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_subak_chain", "수박연환")
    .asAttack(0.55)
    .palmStrike(0.08) // 수박치기 1
    .palmStrike(0.08) // 수박치기 2
    .parry(0.06) // 막기 - deflect
    .palmStrike(0.08) // 수박치기 3
    .punchExtend(0.08) // 지르기 - thrust
    .elbowStrike(0.08) // 팔꿈치 - elbow
    .recover(0.09)
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
 * Yudo Bangyeok - 유도반격 (Korean Judo Counter)
 *
 * Korean Judo (Yudo) counter throw technique.
 * Defense into immediate offense with hip throw.
 * Yudo has been practiced in Korea since 1909.
 *
 * @korean 유도반격콤보애니메이션
 */
export const COMBO_YUDO_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_yudo_counter", "유도반격")
    .asAttack(0.7)
    .parry(0.1) // 막기 - deflect attack
    .clinchGrab(0.1) // 잡기 - grip
    .hipThrow(0.18) // 허리치기 - hip throw
    .slamDown(0.14) // 던지기 - takedown
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KOREAN GRAPPLING COMBOS (한국 유술 콤보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ssireum Mechi - 씨름메치기
 *
 * Traditional Korean wrestling takedown combo.
 * Ssireum (Korean wrestling) techniques with satba grip.
 * Korea's traditional folk wrestling sport.
 *
 * @korean 씨름메치기콤보애니메이션
 */
export const COMBO_SSIREUM_MECHI_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_ssireum_mechi", "씨름메치기")
    .asAttack(0.8)
    .clinchGrab(0.12) // 샅바잡기 - satba grip
    .throwEntry(0.15) // 들어올리기 - lift entry
    .slamDown(0.2) // 메치기 - throw down
    .groundMount(0.15) // 누르기 - pin
    .recover(0.18)
    .build();

/**
 * Teukgong Counter - 특공반격
 *
 * Korean Special Forces combatives counter.
 * Military-based defensive to offensive transition.
 * Teukgong Moosool (특공무술) techniques.
 *
 * @korean 특공반격콤보애니메이션
 */
export const COMBO_TEUKGONG_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_teukgong_counter", "특공반격")
    .asAttack(0.6)
    .counterParry(0.1) // 막아치기 - parry-strike
    .throatStrike(0.08) // 목치기 - throat strike
    .kneeStrike(0.12) // 무릎차기 - knee strike
    .sweep(0.12) // 걸기 - sweep
    .recover(0.18)
    .build();

/**
 * Gungdo Geupso - 궁도급소 (Clinch Vital Points)
 *
 * Close-range vital point combo from clinch.
 * Short-range strikes targeting pressure points.
 * Based on Korean traditional medicine meridians.
 *
 * @korean 궁도급소콤보애니메이션
 */
export const COMBO_CLINCH_GEUPSO_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_clinch_geupso", "궁도급소")
    .asAttack(0.55)
    .withClinch()
    .clinchGrab(0.1)
    .nerveStrike(0.08) // 경락치기 - meridian strike
    .elbowStrike(0.1) // 팔꿈치 - elbow
    .kneeStrike(0.1) // 무릎치기 - knee
    .recover(0.17)
    .build();

/**
 * Hwarang Bicheon - 화랑비천 (Hwarang Flying Attack)
 *
 * Hwarang warrior flying attack sequence.
 * Spectacular aerial techniques from ancient Korean warriors.
 * Based on Hwarangdo (화랑도) combat arts.
 *
 * @korean 화랑비천콤보애니메이션
 */
export const COMBO_HWARANG_BICHEON_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_hwarang_bicheon", "화랑비천")
    .asAttack(0.7)
    .jump(0.1)
    .flyingKnee(0.15) // 비천슬 - flying knee
    .spin(0.1)
    .axeKick(0.15) // 내려차기 - descending kick
    .palmStrike(0.1) // 장풍 - palm strike
    .recover(0.1)
    .build();

/**
 * Taekkyeon Hwalgae - 택견활개
 *
 * Taekkyeon arm sweeping technique sequence.
 * Circular arm movements (활개짓) with finishing kick.
 * Flowing defensive-offensive transition.
 *
 * @korean 택견활개콤보애니메이션
 */
export const COMBO_TAEKKYEON_HWALGAE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_taekkyeon_hwalgae", "택견활개")
    .asAttack(0.7)
    .parry(0.1) // 활개 - sweeping deflect
    .palmStrike(0.1) // 손치기 - palm strike
    .wristGrab(0.1) // 잡아채기 - grab and pull
    .roundhouse(0.15) // 돌려차기 - roundhouse
    .recover(0.25)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KUK SOOL WON COMBOS (국술원 콤보)
// Traditional Korean martial arts system integrating all fighting arts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Kuk Sool Su Ki - 국술수기 (Hand Strikes)
 *
 * Kuk Sool Won hand striking combination.
 * Palm strikes, knife hands, and blocking sequence.
 * Traditional Korean striking techniques (수기).
 *
 * @korean 국술수기콤보애니메이션
 */
export const COMBO_KUKSOOL_SUKI_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_suki", "국술수기")
    .asAttack(0.6)
    .blockMiddle(0.08) // 막기 - middle block
    .palmStrike(0.1) // 장권 - palm strike
    .blockKnifeHand(0.08) // 수도막기 - knife hand block
    .nerveStrike(0.1) // 혈도 - pressure point
    .elbowStrike(0.1) // 팔꿈치치기 - elbow strike
    .recover(0.14)
    .build();

/**
 * Kuk Sool Jok Sul - 국술족술 (Kicks and Sweeps)
 *
 * Kuk Sool Won kicking and leg sweep combination.
 * Front kick, crescent kick, and leg sweep sequence.
 * Dynamic lower body techniques (족술).
 *
 * @korean 국술족술콤보애니메이션
 */
export const COMBO_KUKSOOL_JOKSUL_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_joksul", "국술족술")
    .asAttack(0.7)
    .chamber(0.08) // 준비 - chamber
    .extend(0.1) // 앞차기 - front kick
    .hookKickExtend(0.12) // 후려차기 - crescent kick
    .lowKickSweep(0.15) // 걸이 - leg sweep
    .axeKick(0.12) // 내려차기 - axe kick
    .recover(0.13)
    .build();

/**
 * Kuk Sool Too Ki - 국술투기 (Throws and Grappling)
 *
 * Kuk Sool Won throwing and grappling combination.
 * Entry to hip throw with ground control.
 * Traditional Korean throwing techniques (투기).
 *
 * @korean 국술투기콤보애니메이션
 */
export const COMBO_KUKSOOL_TOOKI_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_tooki", "국술투기")
    .asAttack(0.75)
    .clinchGrab(0.1) // 잡기 - grip
    .throwEntry(0.12) // 들어가기 - entry
    .hipThrow(0.18) // 허리치기 - hip throw
    .groundMount(0.15) // 누르기 - pin
    .recover(0.2)
    .build();

/**
 * Kuk Sool Kwan Jyel Sul - 국술관절술 (Joint Locks)
 *
 * Kuk Sool Won joint manipulation sequence.
 * Wrist lock to arm bar transition.
 * 3,608 joint locking techniques (관절술).
 *
 * @korean 국술관절술콤보애니메이션
 */
export const COMBO_KUKSOOL_KWANJYEL_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_kwanjyel", "국술관절술")
    .asAttack(0.7)
    .parry(0.08) // 막기 - deflect
    .wristGrab(0.1) // 손목잡기 - wrist grab
    .wristTwist(0.12) // 손목꺾기 - wrist twist
    .elbowLockApply(0.15) // 팔꿈치꺾기 - elbow lock
    .jointLock(0.12) // 관절꺾기 - joint lock
    .recover(0.13)
    .build();

/**
 * Kuk Sool Nak Bup - 국술낙법 (Break-falls and Acrobatics)
 *
 * Kuk Sool Won acrobatic counter sequence.
 * Roll recovery into counter-attack.
 * Safe falling techniques (낙법).
 *
 * @korean 국술낙법콤보애니메이션
 */
export const COMBO_KUKSOOL_NAKBUP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_nakbup", "국술낙법")
    .asAttack(0.65)
    .duck(0.1) // 피하기 - evade
    .sweep(0.12) // 걸기 - sweep from ground
    .chamber(0.1) // 준비 - recovery chamber
    .extend(0.12) // 발차기 - rising kick
    .recover(0.21)
    .build();

/**
 * Kuk Sool Ho Shin Sul - 국술호신술 (Self-Defense)
 *
 * Kuk Sool Won self-defense combination.
 * Defensive parry into vital point strikes.
 * Practical self-defense techniques (호신술).
 *
 * @korean 국술호신술콤보애니메이션
 */
export const COMBO_KUKSOOL_HOSHIN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_hoshin", "국술호신술")
    .asAttack(0.55)
    .counterParry(0.08) // 받아치기 - parry counter
    .throatStrike(0.08) // 인후타격 - throat strike
    .groinStrike(0.1) // 낭심타격 - groin strike
    .kneeStrike(0.1) // 무릎치기 - knee
    .recover(0.19)
    .build();

/**
 * Kuk Sool Beom Hyung - 국술범형 (Tiger Style)
 *
 * Kuk Sool Won tiger animal style combo.
 * Powerful clawing and pouncing attacks.
 * One of the traditional animal forms (동물형).
 *
 * @korean 국술범형콤보애니메이션
 */
export const COMBO_KUKSOOL_TIGER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_tiger", "국술범형")
    .asAttack(0.65)
    .punchWindup(0.1) // 준비 - ready
    .palmStrike(0.1) // 호조 - tiger claw 1
    .palmStrike(0.1) // 호조 - tiger claw 2
    .jump(0.1) // 도약 - leap
    .slamDown(0.12) // 덮치기 - pounce
    .recover(0.13)
    .build();

/**
 * Kuk Sool Hak Hyung - 국술학형 (Crane Style)
 *
 * Kuk Sool Won crane animal style combo.
 * Graceful evasion with precision beak strikes.
 * Crane form emphasizing balance and accuracy (학형).
 *
 * @korean 국술학형콤보애니메이션
 */
export const COMBO_KUKSOOL_CRANE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_crane", "국술학형")
    .asAttack(0.6)
    .weave(0.1) // 피하기 - graceful evasion
    .nerveStrike(0.08) // 학부리 - crane beak strike 1
    .sideStepRight(0.08) // 옆걸음 - side step
    .nerveStrike(0.08) // 학부리 - crane beak strike 2
    .chamber(0.1) // 준비 - chamber
    .sideKickExtend(0.1) // 옆차기 - side kick
    .recover(0.06)
    .build();

/**
 * Kuk Sool Yong Hyung - 국술용형 (Dragon Style)
 *
 * Kuk Sool Won dragon animal style combo.
 * Coiling movements with spiraling attacks.
 * Dragon form emphasizing fluidity and power (용형).
 *
 * @korean 국술용형콤보애니메이션
 */
export const COMBO_KUKSOOL_DRAGON_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_dragon", "국술용형")
    .asAttack(0.7)
    .spin(0.12) // 회전 - coiling spin
    .palmStrike(0.1) // 용조 - dragon palm
    .wristGrab(0.1) // 잡아치기 - grab strike
    .throwExecute(0.15) // 용휘 - dragon whip throw
    .recover(0.23)
    .build();

/**
 * Kuk Sool Sa Hyung - 국술사형 (Snake Style)
 *
 * Kuk Sool Won snake animal style combo.
 * Quick precise strikes to vital points.
 * Snake form emphasizing speed and precision (사형).
 *
 * @korean 국술사형콤보애니메이션
 */
export const COMBO_KUKSOOL_SNAKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("combo_kuksool_snake", "국술사형")
    .asAttack(0.5)
    .nerveStrike(0.06) // 사두 - snake head strike
    .jugularStrike(0.08) // 경정맥타격 - jugular strike
    .fingerLockTwist(0.1) // 손가락꺾기 - finger manipulation
    .throatStrike(0.08) // 인후타격 - throat strike
    .recover(0.18)
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
    "물음표마무리",
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
    // Boxing (복싱)
    ["combo_one_two", COMBO_ONE_TWO_ANIMATION],
    ["combo_one_two_hook", COMBO_ONE_TWO_HOOK_ANIMATION],
    ["combo_double_jab_cross", COMBO_DOUBLE_JAB_CROSS_ANIMATION],
    ["combo_body_head", COMBO_BODY_HEAD_ANIMATION],
    ["combo_hook_uppercut", COMBO_HOOK_UPPERCUT_ANIMATION],

    // Kickboxing (킥복싱)
    ["combo_one_two_kick", COMBO_ONE_TWO_KICK_ANIMATION],
    ["combo_kick_punch_kick", COMBO_KICK_PUNCH_KICK_ANIMATION],
    ["combo_low_high_kick", COMBO_LOW_HIGH_KICK_ANIMATION],
    ["combo_switch_kick", COMBO_SWITCH_KICK_ANIMATION],
    ["combo_jab_low_kick", COMBO_JAB_LOW_KICK_ANIMATION],

    // Knee/Elbow (무릎/팔꿈치)
    ["combo_clinch_knee_elbow", COMBO_CLINCH_KNEE_ELBOW_ANIMATION],
    ["combo_double_knee", COMBO_DOUBLE_KNEE_ANIMATION],
    ["combo_elbow_chain", COMBO_ELBOW_CHAIN_ANIMATION],
    ["combo_knee_elbow_knee", COMBO_KNEE_ELBOW_KNEE_ANIMATION],

    // Korean Traditional Martial Arts (한국전통무술)
    ["combo_taekwondo_triple", COMBO_TAEKWONDO_TRIPLE_ANIMATION],
    ["combo_taekkyeon_poom", COMBO_TAEKKYEON_POOM_ANIMATION],
    ["combo_taekkyeon_hwalgae", COMBO_TAEKKYEON_HWALGAE_ANIMATION],
    ["combo_subak_chain", COMBO_SUBAK_CHAIN_ANIMATION],
    ["combo_hapkido_flow", COMBO_HAPKIDO_FLOW_ANIMATION],
    ["combo_yudo_counter", COMBO_YUDO_COUNTER_ANIMATION],

    // Korean Grappling/Military (한국유술/군사무술)
    ["combo_ssireum_mechi", COMBO_SSIREUM_MECHI_ANIMATION],
    ["combo_teukgong_counter", COMBO_TEUKGONG_COUNTER_ANIMATION],
    ["combo_clinch_geupso", COMBO_CLINCH_GEUPSO_ANIMATION],
    ["combo_hwarang_bicheon", COMBO_HWARANG_BICHEON_ANIMATION],

    // Kuk Sool Won (국술원)
    ["combo_kuksool_suki", COMBO_KUKSOOL_SUKI_ANIMATION],
    ["combo_kuksool_joksul", COMBO_KUKSOOL_JOKSUL_ANIMATION],
    ["combo_kuksool_tooki", COMBO_KUKSOOL_TOOKI_ANIMATION],
    ["combo_kuksool_kwanjyel", COMBO_KUKSOOL_KWANJYEL_ANIMATION],
    ["combo_kuksool_nakbup", COMBO_KUKSOOL_NAKBUP_ANIMATION],
    ["combo_kuksool_hoshin", COMBO_KUKSOOL_HOSHIN_ANIMATION],
    ["combo_kuksool_tiger", COMBO_KUKSOOL_TIGER_ANIMATION],
    ["combo_kuksool_crane", COMBO_KUKSOOL_CRANE_ANIMATION],
    ["combo_kuksool_dragon", COMBO_KUKSOOL_DRAGON_ANIMATION],
    ["combo_kuksool_snake", COMBO_KUKSOOL_SNAKE_ANIMATION],

    // Finishers (마무리)
    ["combo_knockout", COMBO_KNOCKOUT_ANIMATION],
    ["combo_spinning_destruction", COMBO_SPINNING_DESTRUCTION_ANIMATION],
    ["combo_question_mark_finish", COMBO_QUESTION_MARK_FINISH_ANIMATION],
  ],
);
