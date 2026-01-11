/**
 * Elbow and Knee Animations Module
 *
 * Close-range elbow (팔꿈치) and knee (무릎) techniques for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 팔꿈치/무릎 애니메이션 모듈
 *
 * @module systems/animation/ElbowKneeAnimations
 * @korean 팔꿈치무릎애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW STRIKE (팔꿈치치기) - Horizontal Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow Strike - 팔꿈치치기
 *
 * Horizontal elbow strike to temple or jaw.
 * Devastating close-range technique from Muay Thai influence.
 *
 * Phases:
 * 1. Chamber (준비): Arm crosses body
 * 2. Strike (치기): Elbow drives through target
 * 3. Recovery (복귀): Return to guard
 *
 * @korean 팔꿈치치기애니메이션
 */
export const ELBOW_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_strike", "팔꿈치치기")
    .asAttack(0.35)
    .elbowChamber(0.08) // 준비 - Arm crosses body
    .elbowStrike(0.12) // 치기 - Elbow drives through
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW UPPERCUT (팔꿈치올려치기) - Rising Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow Uppercut - 팔꿈치올려치기
 *
 * Rising elbow strike targeting chin from below.
 * Explosive vertical strike for close-range combat.
 *
 * @korean 팔꿈치올려치기애니메이션
 */
export const ELBOW_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_uppercut", "팔꿈치올려치기")
    .asAttack(0.35)
    .elbowChamber(0.08) // 준비
    .elbowUppercut(0.12) // 올려치기 - Rising elbow
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KNEE STRIKE (무릎차기) - Clinch Knee
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knee Strike - 무릎차기
 *
 * Powerful knee strike from clinch position.
 * Targets midsection or thigh from close range.
 *
 * Phases:
 * 1. Clinch (클린치): Control opponent's head
 * 2. Strike (차기): Knee drives up into target
 * 3. Reset: Return to clinch or disengage
 *
 * @korean 무릎차기애니메이션
 */
export const KNEE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("knee_strike", "무릎차기")
    .asAttack(0.4)
    .withClinch() // 클린치 - Control position
    .kneeStrike(0.15) // 차기 - Knee drives up
    .recover(0.25) // Reset position
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING ELBOW (회전팔꿈치) - 360° Spinning Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Elbow - 회전팔꿈치
 *
 * Full 360° rotation into horizontal elbow.
 * High-risk knockout technique.
 *
 * Phases:
 * 1. Spin (회전): Body rotates 360°
 * 2. Strike (치기): Elbow whips through target
 * 3. Recovery (복귀): Complete rotation
 *
 * @korean 회전팔꿈치애니메이션
 */
export const SPINNING_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_elbow", "회전팔꿈치")
    .asAttack(0.5)
    .backKickSpin(0.18) // 회전 - Full spin
    .elbowStrike(0.12) // 치기 - Elbow on completion
    .spinRecover(0.2) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOWNWARD ELBOW (내려팔꿈치) - 12-6 Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Downward Elbow - 내려팔꿈치
 *
 * Vertical downward elbow strike.
 * Strikes top of head from above.
 *
 * @korean 내려팔꿈치애니메이션
 */
export const DOWNWARD_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("downward_elbow", "내려팔꿈치")
    .asAttack(0.4)
    .withHighGuard() // Arm raises
    .elbowUppercut(0.08) // Arm goes up
    .elbowStrike(0.12) // Crashes down
    .recover(0.2) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACK ELBOW (뒤팔꿈치) - Rear Elbow Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Back Elbow - 뒤팔꿈치
 *
 * Elbow strike thrown backward.
 * Used when opponent is behind.
 *
 * @korean 뒤팔꿈치애니메이션
 */
export const BACK_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_elbow", "뒤팔꿈치")
    .asAttack(0.35)
    .elbowChamber(0.08) // Chamber
    .elbowStrike(0.12) // Thrust back
    .recover(0.15) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE ELBOW (더블팔꿈치) - Two Rapid Elbows
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Elbow - 더블팔꿈치
 *
 * Two rapid elbow strikes.
 * Left-right combination.
 *
 * @korean 더블팔꿈치애니메이션
 */
export const DOUBLE_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_elbow", "더블팔꿈치")
    .asAttack(0.45)
    .elbowChamber(0.06) // First chamber
    .elbowStrike(0.1) // First elbow
    .elbowChamber(0.06) // Second chamber
    .elbowStrike(0.1) // Second elbow
    .recover(0.13) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SLASHING ELBOW (베기팔꿈치) - Diagonal Elbow Slash
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Slashing Elbow - 베기팔꿈치
 *
 * Diagonal slashing elbow motion.
 * Cuts across opponent's face.
 *
 * @korean 베기팔꿈치애니메이션
 */
export const SLASHING_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("slashing_elbow", "베기팔꿈치")
    .asAttack(0.38)
    .withHighGuard() // Arm high
    .elbowStrike(0.15) // Slash down diagonally
    .recover(0.23) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// FLYING KNEE (뛰어무릎) - Jumping Knee Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Flying Knee - 뛰어무릎
 *
 * Jumping knee strike.
 * Maximum power from jumping momentum.
 *
 * Phases:
 * 1. Jump (뛰기): Explosive jump
 * 2. Strike (차기): Knee drives forward
 * 3. Land (착지): Return to ground
 *
 * @korean 뛰어무릎애니메이션
 */
export const FLYING_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flying_knee", "뛰어무릎")
    .asAttack(0.55)
    .chamber(0.1) // Jump prep
    .kneeStrike(0.18) // Knee in air
    .recover(0.27) // Land
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SIDE KNEE (옆무릎) - Lateral Knee Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Side Knee - 옆무릎
 *
 * Lateral knee strike to ribs.
 * Clinch position to side target.
 *
 * @korean 옆무릎애니메이션
 */
export const SIDE_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_knee", "옆무릎")
    .asAttack(0.42)
    .withClinch() // Clinch
    .kneeStrike(0.17) // Side knee
    .recover(0.25) // Release
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// STEP KNEE (스텝무릎) - Step-in Knee Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Step Knee - 스텝무릎
 *
 * Stepping knee strike.
 * Close distance with knee.
 *
 * @korean 스텝무릎애니메이션
 */
export const STEP_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("step_knee", "스텝무릎")
    .asAttack(0.45)
    .throwEntry(0.12) // Step in
    .kneeStrike(0.15) // Knee on entry
    .recover(0.18) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW-KNEE COMBO (팔꿈치무릎콤보) - Elbow to Knee
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow-Knee Combo - 팔꿈치무릎콤보
 *
 * Elbow strike followed by knee.
 * Clinch range combination.
 *
 * @korean 팔꿈치무릎콤보애니메이션
 */
export const ELBOW_KNEE_COMBO_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_knee_combo", "팔꿈치무릎콤보")
    .asAttack(0.55)
    .elbowChamber(0.06) // Elbow prep
    .elbowStrike(0.1) // Elbow lands
    .withClinch() // Grab
    .kneeStrike(0.17) // Knee follows
    .recover(0.22) // Release
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KNEE BODY HOOK (무릎바디훅) - Knee to Hook Combo
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knee Body Hook - 무릎바디훅
 *
 * Knee strike followed by body hook.
 * Devastates opponent's midsection.
 *
 * @korean 무릎바디훅애니메이션
 */
export const KNEE_BODY_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("knee_body_hook", "무릎바디훅")
    .asAttack(0.55)
    .withClinch() // Clinch
    .kneeStrike(0.15) // Knee lands
    .hookPunch(0.15) // Body hook
    .recover(0.25) // Disengage
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ELBOW/KNEE ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all elbow and knee animations for easy access
 * 팔꿈치/무릎 애니메이션 맵
 */
export const ELBOW_KNEE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["elbow_strike", ELBOW_STRIKE_ANIMATION],
    ["elbow_uppercut", ELBOW_UPPERCUT_ANIMATION],
    ["knee_strike", KNEE_STRIKE_ANIMATION],
    ["spinning_elbow", SPINNING_ELBOW_ANIMATION],
    ["downward_elbow", DOWNWARD_ELBOW_ANIMATION],
    ["back_elbow", BACK_ELBOW_ANIMATION],
    ["double_elbow", DOUBLE_ELBOW_ANIMATION],
    ["slashing_elbow", SLASHING_ELBOW_ANIMATION],
    ["flying_knee", FLYING_KNEE_ANIMATION],
    ["side_knee", SIDE_KNEE_ANIMATION],
    ["step_knee", STEP_KNEE_ANIMATION],
    ["elbow_knee_combo", ELBOW_KNEE_COMBO_ANIMATION],
    ["knee_body_hook", KNEE_BODY_HOOK_ANIMATION],
  ]);
