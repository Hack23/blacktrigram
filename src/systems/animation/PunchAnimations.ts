/**
 * Punch Animations Module
 *
 * All punch and hand strike animations (주먹 공격) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 주먹 공격 애니메이션 모듈
 *
 * @module systems/animation/PunchAnimations
 * @korean 주먹애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// JAB (잽) - Quick Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab - 잽 (빠른 직권)
 *
 * Fast straight punch with lead hand.
 * Probing attack to gauge distance and set up combinations.
 *
 * Phases:
 * 1. Wind-up (준비): Arm bent, coiled position - 100ms
 * 2. Extension (지르기): Arm snaps forward - 150ms
 * 3. Peak hold (정점): Maximum reach - 50ms
 * 4. Recovery (복귀): Return to guard - 250ms
 *
 * Total duration: 550ms (FAST technique)
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .punchWindup(TECHNIQUE_TIMING.FAST.chamber) // 준비 - 100ms wind-up
    .punchExtend(TECHNIQUE_TIMING.FAST.extend) // 지르기 - 150ms snap forward
    .punchExtend(TECHNIQUE_TIMING.FAST.peak) // 정점 - 50ms hold at extension
    .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover) // 복귀 - 250ms return
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CROSS (크로스) - Power Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross - 크로스 (교차 직권)
 *
 * Powerful straight punch with rear hand.
 * Full body rotation generates maximum power.
 *
 * Phases:
 * 1. Wind-up (준비): Weight shifts back - 150ms
 * 2. Hip rotation: Power generation from hips - 200ms
 * 3. Extension (지르기): Arm extends with torso - 80ms
 * 4. Follow-through: Complete rotation
 * 5. Recovery (복귀): Return to guard - 300ms
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 크로스애니메이션
 */
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM.chamber) // 준비 - 150ms
    .crossPunch(TECHNIQUE_TIMING.MEDIUM.extend) // 지르기 - 200ms full rotation punch
    .crossPunch(TECHNIQUE_TIMING.MEDIUM.peak) // 정점 - 80ms hold
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover) // 복귀 - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PALM STRIKE (장권) - Open Palm Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Palm Strike - 장권
 *
 * Open palm heel strike targeting chin or solar plexus.
 * Traditional Taekwondo technique for close range.
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 장권애니메이션
 */
export const PALM_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("palm_strike", "장권")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM.chamber) // 준비 - 150ms
    .palmStrike(TECHNIQUE_TIMING.MEDIUM.extend) // 장권 - 200ms palm heel forward
    .palmStrike(TECHNIQUE_TIMING.MEDIUM.peak) // 정점 - 80ms hold
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover) // 복귀 - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK (훅) - Curved Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook - 훅 (곡권)
 *
 * Curved punch targeting jaw or temple.
 * Generates power from hip and shoulder rotation.
 *
 * Phases:
 * 1. Wind-up (준비): Arm pulls back, elbow bent 90° - 150ms
 * 2. Rotation & Strike (회전+타격): Hip rotates, fist arcs into target - 300ms
 * 3. Recovery (복귀): Return to guard - 350ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 훅애니메이션
 */
export const HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook", "훅")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .hookWindup(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms arm pulls back
    .hookPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 타격 - 200ms curved strike
    .hookPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEAD HOOK (리드훅) - Quick Lead Hand Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead Hook - 리드훅
 *
 * Fast hook with lead hand.
 * Shorter range but quicker than rear hook.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 리드훅애니메이션
 */
export const LEAD_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lead_hook", "리드훅")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .hookWindup(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Quick wind-up - 120ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Fast hook - 180ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// UPPERCUT (어퍼컷) - Rising Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Uppercut - 어퍼컷 (상권)
 *
 * Rising punch targeting chin from below.
 * Power generated from legs and hips.
 *
 * Phases:
 * 1. Crouch (낮추기): Drop level to load punch - 150ms
 * 2. Drive (상승): Drive up through legs - 200ms
 * 3. Strike (타격): Fist rises into chin - 100ms
 * 4. Recovery (복귀): Return to guard - 350ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 어퍼컷애니메이션
 */
export const UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("uppercut", "어퍼컷")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .uppercutCrouch(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 낮추기 - 150ms drop level
    .uppercutPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 상권 - 200ms rising strike
    .uppercutPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEAD UPPERCUT (리드어퍼컷) - Quick Lead Uppercut
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead Uppercut - 리드어퍼컷
 *
 * Fast uppercut with lead hand.
 * Good counter when opponent ducks.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 리드어퍼컷애니메이션
 */
export const LEAD_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lead_uppercut", "리드어퍼컷")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .uppercutCrouch(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Quick drop - 120ms
    .uppercutPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Fast uppercut - 180ms
    .uppercutPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// OVERHAND (오버핸드) - Looping Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Overhand - 오버핸드 (천권)
 *
 * Looping punch over opponent's guard.
 * High arc to strike top of head or jaw.
 *
 * Phases:
 * 1. Wind-up (준비): Arm raises high - 200ms
 * 2. Loop (호): Arm loops over - 300ms
 * 3. Strike (타격): Fist crashes down - 120ms
 * 4. Recovery (복귀): Return to guard - 380ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 오버핸드애니메이션
 */
export const OVERHAND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("overhand", "오버핸드")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .overhandPunch(TECHNIQUE_TIMING.HEAVY.chamber + TECHNIQUE_TIMING.HEAVY.extend) // 천권 - 500ms looping strike
    .overhandPunch(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold
    .recover(TECHNIQUE_TIMING.HEAVY.retract + TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 380ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACKFIST (등주먹) - Spinning Backfist
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Backfist - 등주먹
 *
 * Back of fist whips into target.
 * Can be spinning or direct.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 등주먹애니메이션
 */
export const BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("backfist", "등주먹")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Pull back - 120ms
    .counterStrike(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Whip motion - 180ms
    .counterStrike(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING BACKFIST (회전등주먹) - Full Spin Backfist
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Backfist - 회전등주먹
 *
 * Full 360° rotation into backfist.
 * High-risk knockout technique.
 *
 * Total duration: 1200ms (HEAVY+ spinning technique)
 *
 * @korean 회전등주먹애니메이션
 */
export const SPINNING_BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_backfist", "회전등주먹")
    .asAttack(1.2)
    .backKickSpin(0.3) // Full spin - 300ms
    .counterStrike(0.25) // Backfist on completion - 250ms
    .counterStrike(0.1) // Peak - 100ms
    .spinRecover(0.55) // Complete rotation - 550ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HAMMER FIST (철퇴권) - Downward Hammer Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hammer Fist - 철퇴권
 *
 * Bottom of fist strikes downward like a hammer.
 * Effective in ground-and-pound.
 *
 * Total duration: 900ms (JUMPING technique timing)
 *
 * @korean 철퇴권애니메이션
 */
export const HAMMER_FIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hammer_fist", "철퇴권")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total)
    .overhandPunch(TECHNIQUE_TIMING.JUMPING.chamber + TECHNIQUE_TIMING.JUMPING.extend) // Similar arc to overhand - 400ms
    .overhandPunch(TECHNIQUE_TIMING.JUMPING.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.JUMPING.retract + TECHNIQUE_TIMING.JUMPING.recover) // Recover - 420ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SUPERMAN PUNCH (슈퍼맨펀치) - Flying Cross
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Superman Punch - 슈퍼맨펀치
 *
 * Jumping cross punch for extended range.
 * Fakes kick then throws power punch.
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 슈퍼맨펀치애니메이션
 */
export const SUPERMAN_PUNCH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("superman_punch", "슈퍼맨펀치")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .chamber(0.15) // Fake kick chamber - 150ms
    .punchWindup(0.15) // Transfer to punch - 150ms
    .crossPunch(0.3) // Throw cross in air - 300ms
    .crossPunch(0.12) // Peak - 120ms
    .recover(0.28) // Land and recover - 280ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JAB-CROSS COMBINATION (잽크로스) - 1-2 Combo
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab-Cross - 잽크로스
 *
 * Classic 1-2 boxing combination.
 * Lead jab sets up rear cross.
 *
 * Total duration: 900ms (COMBO_FAST technique)
 *
 * @korean 잽크로스애니메이션
 */
export const JAB_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab_cross", "잽크로스")
    .asAttack(TECHNIQUE_TIMING.COMBO_FAST.total)
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.chamber) // Quick jab prep - 80ms
    .punchExtend(TECHNIQUE_TIMING.COMBO_FAST.extend) // Jab lands - 120ms
    .punchWindup(0.1) // Cross prep - 100ms
    .crossPunch(0.2) // Cross lands - 200ms
    .crossPunch(TECHNIQUE_TIMING.COMBO_FAST.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.COMBO_FAST.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK-HOOK COMBINATION (더블훅) - Double Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Hook - 더블훅
 *
 * Left hook followed by right hook.
 * Body rotation carries momentum.
 *
 * Total duration: 1000ms (combo technique)
 *
 * @korean 더블훅애니메이션
 */
export const DOUBLE_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_hook", "더블훅")
    .asAttack(1.0)
    .hookWindup(0.12) // First hook prep - 120ms
    .hookPunch(0.18) // First hook - 180ms
    .hookWindup(0.12) // Second hook prep - 120ms
    .hookPunch(0.2) // Second hook - 200ms
    .hookPunch(0.08) // Peak - 80ms
    .recover(0.3) // Recover - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BODY SHOT (바디샷) - Hook to Body
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Body Shot - 바디샷
 *
 * Hook targeting ribs/liver.
 * Lower trajectory than head hook.
 *
 * Total duration: 750ms (MEDIUM_HEAVY technique)
 *
 * @korean 바디샷애니메이션
 */
export const BODY_SHOT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("body_shot", "바디샷")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .uppercutCrouch(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber) // Drop level - 120ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend) // Hook to body - 200ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract + TECHNIQUE_TIMING.MEDIUM_HEAVY.recover) // Recover - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT PUNCH ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all punch animations for easy access
 * 주먹 애니메이션 맵
 */
export const PUNCH_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map(
  [
    ["jab", JAB_ANIMATION],
    ["cross", CROSS_ANIMATION],
    ["palm_strike", PALM_STRIKE_ANIMATION],
    ["hook", HOOK_ANIMATION],
    ["lead_hook", LEAD_HOOK_ANIMATION],
    ["uppercut", UPPERCUT_ANIMATION],
    ["lead_uppercut", LEAD_UPPERCUT_ANIMATION],
    ["overhand", OVERHAND_ANIMATION],
    ["backfist", BACKFIST_ANIMATION],
    ["spinning_backfist", SPINNING_BACKFIST_ANIMATION],
    ["hammer_fist", HAMMER_FIST_ANIMATION],
    ["superman_punch", SUPERMAN_PUNCH_ANIMATION],
    ["jab_cross", JAB_CROSS_ANIMATION],
    ["double_hook", DOUBLE_HOOK_ANIMATION],
    ["body_shot", BODY_SHOT_ANIMATION],
  ]
);
