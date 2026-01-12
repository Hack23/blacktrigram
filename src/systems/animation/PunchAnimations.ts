/**
 * Punch Animations Module
 *
 * All punch and hand strike animations (주먹 공격) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * Updated to include proper Korean martial arts biomechanics:
 * - Hip rotation (엉덩이회전) for power generation
 * - Shoulder torque (어깨비틀기) coordination
 * - Fist rotation (주먹회전) from vertical to pronated
 * - Hikite (당기기) - opposite arm pulling for power
 * - Full arm extension (팔완전펴기) at impact
 *
 * 한국 무술 주먹 공격 애니메이션 모듈
 *
 * @module systems/animation/PunchAnimations
 * @korean 주먹애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// JAB (잽) - Quick Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab - 잽 (빠른 직권)
 *
 * Fast straight punch with lead hand using proper Korean martial arts form.
 * Probing attack to gauge distance and set up combinations.
 *
 * Korean martial arts biomechanics:
 * - Chamber: Fist at hip, palm vertical (세로주먹)
 * - Extension: Full arm extension with fist rotation to pronated (palm-down)
 * - Hip engagement: Minimal hip rotation for speed
 * - Hikite: Opposite arm pulls slightly back for power
 * - Fist rotation: Vertical → Pronated (~90° wrist rotation)
 *
 * Phases:
 * 1. Chamber (준비): Fist at hip, elbow bent 90° - 100ms
 * 2. Extension (지르기): Arm snaps forward with fist rotation - 150ms
 * 3. Peak hold (정점): Maximum reach, fist pronated - 50ms
 * 4. Retract (회수): Return to chamber - 100ms
 * 5. Recovery (복귀): Return to guard - 150ms
 *
 * Total duration: 550ms (FAST technique)
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    // 준비 - Chamber position with fist at hip
    .at(0, "ease-out")
      .rotate(BoneName.SHOULDER_L, -0.15, 0, -0.2)  // Shoulder back and down
      .rotate(BoneName.ELBOW_L, 0, 0, -1.57)         // Elbow bent 90°
      .rotate(BoneName.WRIST_L, 0, 0, 0)             // Fist vertical
      // Opposite arm guard
      .rotate(BoneName.SHOULDER_R, -0.1, 0, 0.2)
      .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
      // Body neutral
      .rotate(BoneName.PELVIS, 0, -0.1, 0)
      .rotate(BoneName.SPINE_UPPER, 0, -0.1, 0)
      .done()
    // 지르기 - Extension with fist rotation and minimal hip drive
    .at(TECHNIQUE_TIMING.FAST.chamber + TECHNIQUE_TIMING.FAST.extend, "ease-out")
      .rotate(BoneName.SHOULDER_L, 0.25, 0, 0.15)   // Shoulder forward
      .rotate(BoneName.ELBOW_L, 0, 0, -0.09)        // Nearly straight
      .rotate(BoneName.WRIST_L, 0, 0, 0.2)          // Fist pronated
      // Opposite arm pulls back (hikite)
      .rotate(BoneName.SHOULDER_R, -0.2, 0, -0.3)
      .rotate(BoneName.ELBOW_R, 0, 0, -1.1)
      // Minimal hip rotation for speed
      .rotate(BoneName.PELVIS, 0, 0.1, 0)
      .rotate(BoneName.SPINE_UPPER, 0, 0.15, 0)
      .rotate(BoneName.SPINE_MIDDLE, 0, 0.1, 0)
      .done()
    // 정점 - Peak extension
    .at(TECHNIQUE_TIMING.FAST.chamber + TECHNIQUE_TIMING.FAST.extend + TECHNIQUE_TIMING.FAST.peak, "linear")
      .rotate(BoneName.SHOULDER_L, 0.25, 0, 0.15)
      .rotate(BoneName.ELBOW_L, 0, 0, -0.09)
      .rotate(BoneName.WRIST_L, 0, 0, 0.2)
      // Hold hikite
      .rotate(BoneName.SHOULDER_R, -0.2, 0, -0.3)
      .rotate(BoneName.ELBOW_R, 0, 0, -1.1)
      // Hold rotation
      .rotate(BoneName.PELVIS, 0, 0.1, 0)
      .rotate(BoneName.SPINE_UPPER, 0, 0.15, 0)
      .done()
    // 복귀 - Return to guard
    .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CROSS (크로스) - Power Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross - 크로스 (교차 직권)
 *
 * Powerful straight punch with rear hand using full Korean martial arts biomechanics.
 * Full body rotation generates maximum power through hip and shoulder engagement.
 *
 * Korean martial arts biomechanics (역권지르기 - Yeokwon Jireugi):
 * - Chamber: Rear fist at hip, palm vertical, body coiled
 * - Hip drive: Full hip rotation (엉덩이회전) ~20-25°
 * - Shoulder torque: Shoulder rotates with punch (어깨비틀기)  
 * - Hikite: Lead arm pulls back strongly to hip (당기기)
 * - Fist rotation: Vertical → Pronated for power transfer
 * - Full extension: Elbow nearly straight (~175°) at impact
 *
 * Phases:
 * 1. Chamber (준비): Rear fist coiled at hip - 150ms
 * 2. Hip rotation (회전): Power generation from hips - 200ms
 * 3. Extension (지르기): Arm extends with torso rotation - 80ms
 * 4. Follow-through (관통): Complete rotation and extension
 * 5. Recovery (복귀): Return to guard - 300ms
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 크로스애니메이션
 */
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    // 준비 - Chamber with body coiled
    .at(0, "ease-out")
      .rotate(BoneName.SHOULDER_R, -0.15, 0, -0.2)   // Rear shoulder back
      .rotate(BoneName.ELBOW_R, 0, 0, -1.57)          // Elbow bent 90°
      .rotate(BoneName.WRIST_R, 0, 0, 0)              // Fist vertical
      // Lead arm guard
      .rotate(BoneName.SHOULDER_L, -0.1, 0, 0.2)
      .rotate(BoneName.ELBOW_L, 0, 0, 1.4)
      // Body coiled away from target
      .rotate(BoneName.PELVIS, 0, -0.15, 0)
      .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0)
      .rotate(BoneName.SPINE_MIDDLE, 0, -0.15, 0)
      .done()
    // 지르기 - Full hip rotation and punch extension
    .at(TECHNIQUE_TIMING.MEDIUM.chamber + TECHNIQUE_TIMING.MEDIUM.extend, "ease-out")
      .rotate(BoneName.SHOULDER_R, 0.25, 0, 0.15)    // Punch forward
      .rotate(BoneName.ELBOW_R, 0, 0, -0.09)         // Nearly straight
      .rotate(BoneName.WRIST_R, 0, 0, 0.2)           // Fist pronated
      // Lead arm hikite - strong pull back
      .rotate(BoneName.SHOULDER_L, -0.2, 0, -0.3)
      .rotate(BoneName.ELBOW_L, 0, 0, -1.1)
      // Full hip rotation for power (20-25°)
      .rotate(BoneName.PELVIS, 0, 0.4, 0)            // ~23° hip rotation
      .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0)       // ~29° shoulder rotation
      .rotate(BoneName.SPINE_MIDDLE, 0, 0.45, 0)     // ~26° mid-spine rotation
      .done()
    // 정점 - Peak impact with maximum rotation
    .at(TECHNIQUE_TIMING.MEDIUM.chamber + TECHNIQUE_TIMING.MEDIUM.extend + TECHNIQUE_TIMING.MEDIUM.peak, "linear")
      .rotate(BoneName.SHOULDER_R, 0.25, 0, 0.15)
      .rotate(BoneName.ELBOW_R, 0, 0, -0.09)
      .rotate(BoneName.WRIST_R, 0, 0, 0.2)
      // Maximum hikite
      .rotate(BoneName.SHOULDER_L, -0.2, 0, -0.3)
      .rotate(BoneName.ELBOW_L, 0, 0, -1.1)
      // Maximum body rotation
      .rotate(BoneName.PELVIS, 0, 0.45, 0)           // ~26° maximum hip rotation
      .rotate(BoneName.SPINE_UPPER, 0, 0.55, 0)      // ~32° maximum shoulder rotation
      .rotate(BoneName.SPINE_MIDDLE, 0, 0.5, 0)      // ~29° mid-spine
      .done()
    // 복귀 - Return to guard
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover)
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
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전등주먹애니메이션
 */
export const SPINNING_BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_backfist", "회전등주먹")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Full spin - 300ms
    .counterStrike(TECHNIQUE_TIMING.SPINNING.extend) // Backfist on completion - 350ms
    .counterStrike(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .spinRecover(TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover) // Complete rotation - 430ms
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
    .chamber(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Fake kick chamber - 150ms (0.75 × 200ms)
    .punchWindup(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Transfer to punch - 150ms
    .crossPunch(TECHNIQUE_TIMING.HEAVY.extend) // Throw cross in air - 300ms
    .crossPunch(TECHNIQUE_TIMING.HEAVY.peak) // Peak - 120ms
    .recover(TECHNIQUE_TIMING.HEAVY.recover + 0.05) // Land and recover - 280ms (230ms + 50ms landing)
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
 * Phases (준비, 실행, 회수, 복귀):
 * 1. Jab chamber (잽 준비): 80ms
 * 2. Jab extend (잽 실행): 120ms  
 * 3. Cross transition (크로스 전환): 80ms (using peak for transition)
 * 4. Cross extend (크로스 실행): 100ms (using retract)
 * 5. Recovery (복귀): 320ms
 *
 * Total duration: 700ms (COMBO_FAST technique)
 * Sum: 80 + 120 + 80 + 100 + 320 = 700ms ✓
 *
 * @korean 잽크로스애니메이션
 */
export const JAB_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab_cross", "잽크로스")
    .asAttack(TECHNIQUE_TIMING.COMBO_FAST.total)
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.chamber) // Jab prep - 80ms
    .punchExtend(TECHNIQUE_TIMING.COMBO_FAST.extend) // Jab lands - 120ms
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.peak) // Cross transition - 80ms (using peak for quick transition)
    .crossPunch(TECHNIQUE_TIMING.COMBO_FAST.retract) // Cross lands - 100ms (faster for speed combo)
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
 * Phases (준비, 실행, 회수, 복귀):
 * 1. First hook chamber (첫 훅 준비): 120ms (0.6 × chamber)
 * 2. First hook extend (첫 훅 실행): 180ms (0.6 × extend)
 * 3. Second hook chamber (둘째 훅 준비): 120ms (0.8 × retract)
 * 4. Second hook extend (둘째 훅 실행): 350ms (extend + 50ms)
 * 5. Recovery (복귀): 230ms
 *
 * Total duration: 1000ms (HEAVY technique)
 * Sum: 120 + 180 + 120 + 350 + 230 = 1000ms ✓
 *
 * @korean 더블훅애니메이션
 */
export const DOUBLE_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_hook", "더블훅")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .hookWindup(TECHNIQUE_TIMING.HEAVY.chamber * 0.6) // First hook prep - 120ms (0.6 × chamber)
    .hookPunch(TECHNIQUE_TIMING.HEAVY.extend * 0.6) // First hook - 180ms (0.6 × extend)
    .hookWindup(TECHNIQUE_TIMING.HEAVY.retract * 0.8) // Second hook prep - 120ms (0.8 × retract)
    .hookPunch(TECHNIQUE_TIMING.HEAVY.extend + 0.05) // Second hook - 350ms (extend + 50ms)
    .recover(TECHNIQUE_TIMING.HEAVY.recover) // Recover - 230ms
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
