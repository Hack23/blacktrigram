/**
 * Grappling Animations Module
 *
 * Throw (던지기), lock (관절기), and grappling animations for Korean martial arts.
 * Features Hapkido and Ssireum techniques.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 잡기 애니메이션 모듈
 *
 * @module systems/animation/GrapplingAnimations
 * @korean 잡기애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// THROW (던지기) - Hip Throw
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Throw - 던지기
 *
 * Hip throw technique from Hapkido and Ssireum.
 * Unbalance and throw opponent over hip.
 *
 * Phases:
 * 1. Entry (진입): Step in and grab
 * 2. Load: Hip under opponent's center
 * 3. Throw (던지기): Hip rotation throws opponent
 * 4. Recovery (복귀): Return to stance
 *
 * @korean 던지기애니메이션
 */
export const THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("throw", "던지기")
    .asAttack(0.6)
    .throwEntry(0.18) // 진입 - Entry and grab
    .hipThrow(0.22) // 던지기 - Execute hip throw
    .recover(0.2) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// GRAPPLE (관절기) - Joint Lock
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Grapple - 관절기
 *
 * Joint lock application from Hapkido.
 * Control and submit opponent through joint manipulation.
 *
 * Phases:
 * 1. Grab (잡기): Secure grip on limb
 * 2. Control: Position for leverage
 * 3. Lock (꺾기): Apply joint pressure
 * 4. Hold/Release: Maintain or release
 *
 * @korean 관절기애니메이션
 */
export const GRAPPLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("grapple", "관절기")
    .asAttack(0.65)
    .throwEntry(0.15) // Entry and grab
    .jointLock(0.25) // 꺾기 - Apply lock
    .recover(0.25) // Release/reset
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER ATTACK (반격) - Defensive Counter
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Counter Attack - 반격
 *
 * Defensive parry followed by immediate counter strike.
 * Fundamental Hapkido and Taekwondo defensive concept.
 *
 * Phases:
 * 1. Parry (막기): Deflect incoming attack
 * 2. Counter (반격): Immediate return strike
 * 3. Recovery (복귀): Return to guard
 *
 * @korean 반격애니메이션
 */
export const COUNTER_ATTACK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("counter_attack", "반격")
    .asAttack(0.45)
    .parry(0.12) // 막기 - Deflect
    .punchExtend(0.13) // 반격 - Counter strike
    .recover(0.2) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK (막기) - Defensive Block
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Block - 막기
 *
 * Defensive blocking technique.
 * High or mid-level block against incoming attacks.
 *
 * @korean 막기애니메이션
 */
export const BLOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("block", "막기")
    .asDefense(TECHNIQUE_TIMING.FAST.total)
    .parry(TECHNIQUE_TIMING.FAST.chamber + TECHNIQUE_TIMING.FAST.extend) // 막기 - Block
    .recover(
      TECHNIQUE_TIMING.FAST.peak +
        TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    ) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// WRIST LOCK (손목꺾기) - Hapkido Joint Lock
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Wrist Lock - 손목꺾기
 *
 * Hapkido wrist joint manipulation technique.
 * Controls opponent through pain compliance.
 *
 * Phases:
 * 1. Grab (잡기): Secure wrist grip
 * 2. Twist (꺾기): Apply rotational pressure
 * 3. Control: Maintain lock pressure
 * 4. Release (복귀): Release opponent
 *
 * @korean 손목꺾기애니메이션
 */
export const WRIST_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("wrist_lock", "손목꺾기")
    .asAttack(0.6)
    .wristGrab(0.15) // 잡기 - Grab wrist
    .wristTwist(0.2) // 꺾기 - Apply rotation
    .recover(0.25) // 복귀 - Release
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NEW TAE (LAKE) TRIGRAM JOINT LOCKS (새로운 태괘 관절기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Small Circle Lock - 소원꺾기
 *
 * Tae (Lake) Trigram signature technique.
 * Using minimal circular motion to lock joint.
 *
 * @korean 소원꺾기애니메이션
 */
export const SMALL_CIRCLE_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("small_circle_lock", "소원꺾기")
    .asAttack(0.55)
    .wristGrab(0.12) // 잡기 - Quick grab
    .wristTwist(0.1) // 꺾기 - Small circle twist
    .jointLock(0.15) // 제압 - Lock
    .recover(0.18) // 복귀
    .build();

/**
 * Finger Lock - 손가락꺾기
 *
 * Manipulating individual digits for pain compliance.
 *
 * @korean 손가락꺾기애니메이션
 */
export const FINGER_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("finger_lock", "손가락꺾기")
    .asAttack(0.5)
    .wristGrab(0.1) // 잡기 - Grab fingers
    .fingerLockTwist(0.15) // 꺺기 - Hyper-extend fingers
    .recover(0.25) // 복귀
    .build();

/**
 * Elbow Lock - 팔꿈치꺾기
 *
 * Hyperextending the elbow joint (Armbar variation).
 *
 * @korean 팔꿈치꺾기애니메이션
 */
export const ELBOW_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_lock", "팔꿈치꺾기")
    .asAttack(0.65)
    .throwEntry(0.15) // 진입
    .elbowLockApply(0.3) // 꺺기 - Apply elbow hyperextension
    .recover(0.2) // 복귀
    .build();

/**
 * Shoulder Manipulation - 어깨비틀기
 *
 * Rotational torque on shoulder joint.
 *
 * @korean 어깨비틀기애니메이션
 */
export const SHOULDER_MANIPULATION_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("shoulder_manipulation", "어깨비틀기")
    .asAttack(0.7)
    .throwEntry(0.2) // 진입
    .shoulderLockTwist(0.3) // 비틀기 - Shoulder manipulation
    .recover(0.2) // 복귀
    .build();

/**
 * Flowing Arm Bar - 유수팔꺾기
 *
 * Fluid transition into arm bar from movement.
 *
 * @korean 유수팔꺾기애니메이션
 */
export const FLOWING_ARM_BAR_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_arm_bar", "유수팔꺾기")
    .asAttack(0.75)
    .parry(0.15) // 막기 - Flow with attack
    .throwEntry(0.15) // 진입 - Enter
    .jointLock(0.25) // 꺾기 - Lock
    .recover(0.2) // 복귀
    .build();

/**
 * Joint Lock Defense - 관절기방어
 *
 * Escaping or countering a joint lock.
 *
 * @korean 관절기방어애니메이션
 */
export const JOINT_LOCK_DEFENSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("joint_lock_defense", "관절기방어")
    .asDefense(0.5)
    .parry(0.1) // 틈파기 - Create space
    .wristTwist(0.2) // 빼기 - Rotate out
    .recover(0.2) // 복귀
    .build();

/**
 * Sweep Defense - 걸기방어
 *
 * Avoiding or countering a low sweep.
 *
 * @korean 걸기방어애니메이션
 */
export const SWEEP_DEFENSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("sweep_defense", "걸기방어")
    .asDefense(0.45)
    .recover(0.15) // 들어올리기 - Lift leg
    .parry(0.1) // 피하기 - Avoid
    .recover(0.2) // 착지 - Land
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NEW GROUND/CHOKE TECHNIQUES (새로운 그라운드/조르기 기법)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mountain Lock - 산형굳히기 (Gan Trigram)
 * Immovable hold.
 *
 * @korean 산형굳히기애니메이션
 */
export const MOUNTAIN_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("mountain_lock", "산형굳히기")
    .asAttack(0.8)
    .throwEntry(0.2)
    .jointLock(0.4) // Long hold
    .recover(0.2)
    .build();

/**
 * Earth Embrace - 대지포옹 (Gon Trigram)
 * Ground control technique.
 *
 * @korean 대지포옹애니메이션
 */
export const EARTH_EMBRACE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("earth_embrace", "대지포옹")
    .asAttack(0.9)
    .takedownShoot(0.25) // Shoot for takedown
    .takedownDump(0.35) // Take down
    .groundMount(0.3) // Control on ground
    .build();

/**
 * Carotid Choke - 경동맥조르기 (Dark Ops)
 * Blood choke.
 *
 * @korean 경동맥조르기애니메이션
 */
export const CAROTID_CHOKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("carotid_choke", "경동맥조르기")
    .asAttack(1.0)
    .throwEntry(0.2) // Get behind
    .chokeGrip(0.6) // Apply carotid squeeze
    .recover(0.2)
    .build();

/**
 * Rear Naked Choke - 뒤조르기 (Dark Ops)
 * Traditional mata leao.
 *
 * @korean 뒤조르기애니메이션
 */
export const REAR_NAKED_CHOKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("rear_naked_choke", "뒤조르기")
    .asAttack(1.2)
    .throwEntry(0.3) // Get back control
    .chokeGrip(0.7) // Apply rear naked choke
    .recover(0.2)
    .build();

/**
 * Redirect Throw - 유수던지기 (Gam Trigram)
 * Using opponent momentum.
 *
 * @korean 유수던지기애니메이션
 */
export const REDIRECT_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("redirect_throw", "유수던지기")
    .asAttack(0.7)
    .parry(0.2) // Flow with attack
    .hipThrow(0.3) // Redirect momentum into throw
    .recover(0.2)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ARM BAR (팔꺾기) - Arm Hyperextension
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Arm Bar - 팔꺾기
 *
 * Standing arm bar technique.
 * Hyperextends elbow joint for control or submission.
 *
 * Phases:
 * 1. Entry (진입): Catch arm
 * 2. Position: Hip under elbow
 * 3. Drop (내려가기): Drop to secure arm
 * 4. Extension: Hyperextend elbow
 *
 * @korean 팔꺾기애니메이션
 */
export const ARM_BAR_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("arm_bar", "팔꺾기")
    .asAttack(0.7)
    .armBarEntry(0.18) // 진입 - Catch arm
    .armBarDrop(0.22) // 내려가기 - Drop and extend
    .recover(0.3) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SLAM (메치기) - Powerful Throw Down
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Slam - 메치기
 *
 * Powerful lift and slam technique.
 * Lifts opponent and drives them into ground.
 *
 * Phases:
 * 1. Entry (진입): Clinch and underhook
 * 2. Lift (들기): Lift opponent
 * 3. Slam (메치기): Drive to ground
 * 4. Recovery (복귀): Return to stance
 *
 * @korean 메치기애니메이션
 */
export const SLAM_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("slam", "메치기")
    .asAttack(0.75)
    .slamLift(0.25) // 들기 - Lift opponent
    .slamDown(0.2) // 메치기 - Slam down
    .recover(0.3) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HIP THROW (허리치기) - Classic Judo/Hapkido Throw
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hip Throw - 허리치기
 *
 * Classic hip throw from Hapkido and Judo.
 * Hip as fulcrum to throw opponent.
 *
 * @korean 허리치기애니메이션
 */
export const HIP_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hip_throw", "허리치기")
    .asAttack(0.65)
    .throwEntry(0.2) // Entry and grab
    .hipThrow(0.22) // Hip rotation throw
    .recover(0.23) // Recovery
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEG REAP (다리걸기) - Leg Sweep Takedown
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Leg Reap - 다리걸기
 *
 * Reap opponent's leg while pushing.
 * Opponent falls backward.
 *
 * @korean 다리걸기애니메이션
 */
export const LEG_REAP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("leg_reap", "다리걸기")
    .asAttack(0.55)
    .clinchGrab(0.12) // Grab opponent
    .sweep(0.18) // Reap leg
    .recover(0.25) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SHOULDER LOCK (어깨꺾기) - Kimura/Americana
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shoulder Lock - 어깨꺾기
 *
 * Rotational pressure on shoulder joint.
 * Standing or ground submission.
 *
 * @korean 어깨꺾기애니메이션
 */
export const SHOULDER_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("shoulder_lock", "어깨꺾기")
    .asAttack(0.65)
    .wristGrab(0.15) // Grab arm
    .shoulderLockTwist(0.25) // Apply shoulder rotation
    .recover(0.25) // Release
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER STRIKE (반격타격) - Parry to Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Counter Strike - 반격타격
 *
 * Defensive parry followed by powerful counter.
 * More aggressive than standard counter attack.
 *
 * @korean 반격타격애니메이션
 */
export const COUNTER_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("counter_strike", "반격타격")
    .asAttack(0.5)
    .counterParry(0.1) // Parry incoming
    .counterStrike(0.15) // Powerful counter
    .recover(0.25) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PARRY COUNTER (막기반격) - Block and Counter
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parry Counter - 막기반격
 *
 * High block followed by immediate counter strike.
 *
 * @korean 막기반격애니메이션
 */
export const PARRY_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("parry_counter", "막기반격")
    .asAttack(0.48)
    .parry(0.12) // Block
    .punchExtend(0.14) // Quick counter
    .recover(0.22) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// REMOVED - MOVED TO ELBOWKNEEANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE KNEE (더블무릎) - Two Rapid Knee Strikes
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Knee - 더블무릎
 *
 * Two rapid knee strikes from clinch.
 *
 * @korean 더블무릎애니메이션
 */
export const DOUBLE_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_knee", "더블무릎")
    .asAttack(0.6)
    .clinchGrab(0.1) // Clinch
    .kneeStrike(0.12) // First knee
    .kneeStrike(0.15) // Second knee
    .recover(0.23) // Release
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SUPLEX (수플렉스) - Backward Throw
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Suplex - 수플렉스
 *
 * Grab and throw opponent backward.
 * High-impact wrestling technique.
 *
 * @korean 수플렉스애니메이션
 */
export const SUPLEX_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("suplex", "수플렉스")
    .asAttack(0.8)
    .clinchGrab(0.15) // Grab from behind
    .slamLift(0.25) // Lift and arch
    .slamDown(0.2) // Slam backward
    .recover(0.2) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HIGH BLOCK (상단막기) - Upper Defense
// ═══════════════════════════════════════════════════════════════════════════

/**
 * High Block - 상단막기
 *
 * High defensive block against head attacks.
 *
 * @korean 상단막기애니메이션
 */
export const HIGH_BLOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("block_high", "상단막기")
    .asDefense(TECHNIQUE_TIMING.FAST.total)
    .withHighGuard() // High guard position
    .blockHigh(TECHNIQUE_TIMING.FAST.chamber + TECHNIQUE_TIMING.FAST.extend) // High block technique
    .recover(
      TECHNIQUE_TIMING.FAST.peak +
        TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    ) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LOW BLOCK (하단막기) - Lower Defense
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Low Block - 하단막기
 *
 * Low defensive block against leg attacks.
 *
 * @korean 하단막기애니메이션
 */
export const LOW_BLOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("block_low", "하단막기")
    .asDefense(TECHNIQUE_TIMING.FAST.total)
    .blockLow(TECHNIQUE_TIMING.FAST.chamber + TECHNIQUE_TIMING.FAST.extend) // Low block technique
    .recover(
      TECHNIQUE_TIMING.FAST.peak +
        TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    ) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// TAKEDOWN (테이크다운) - Wrestling Takedown
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Takedown - 테이크다운
 *
 * Wrestling-style double leg takedown.
 * Shoot for legs and drive through.
 *
 * @korean 테이크다운애니메이션
 */
export const TAKEDOWN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("takedown", "테이크다운")
    .asAttack(0.65)
    .takedownShoot(0.2) // Shoot for legs
    .takedownDump(0.2) // Drive through and dump
    .recover(0.25) // Top position
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BODY LOCK THROW (바디락던지기) - Bear Hug Throw
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Body Lock Throw - 바디락던지기
 *
 * Grab body and throw using leverage.
 *
 * @korean 바디락던지기애니메이션
 */
export const BODY_LOCK_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("body_lock_throw", "바디락던지기")
    .asAttack(0.7)
    .clinchGrab(0.15) // Body lock
    .throwEntry(0.15) // Position
    .throwExecute(0.2) // Execute throw
    .recover(0.2) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT GRAPPLING ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all grappling animations for easy access
 * 잡기 애니메이션 맵
 */
export const GRAPPLING_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["throw", THROW_ANIMATION],
    ["grapple", GRAPPLE_ANIMATION],
    ["counter_attack", COUNTER_ATTACK_ANIMATION],
    ["block", BLOCK_ANIMATION],
    ["wrist_lock", WRIST_LOCK_ANIMATION],
    ["arm_bar", ARM_BAR_ANIMATION],
    ["slam", SLAM_ANIMATION],
    ["hip_throw", HIP_THROW_ANIMATION],
    ["leg_reap", LEG_REAP_ANIMATION],
    ["shoulder_lock", SHOULDER_LOCK_ANIMATION],
    ["counter_strike", COUNTER_STRIKE_ANIMATION],
    ["parry_counter", PARRY_COUNTER_ANIMATION],
    // Clinch knee moved to ElbowKneeAnimations
    ["double_knee", DOUBLE_KNEE_ANIMATION],
    ["suplex", SUPLEX_ANIMATION],
    ["block_high", HIGH_BLOCK_ANIMATION],
    ["block_low", LOW_BLOCK_ANIMATION],
    ["takedown", TAKEDOWN_ANIMATION],
    ["body_lock_throw", BODY_LOCK_THROW_ANIMATION],
    ["small_circle_lock", SMALL_CIRCLE_LOCK_ANIMATION],
    ["finger_lock", FINGER_LOCK_ANIMATION],
    ["elbow_lock", ELBOW_LOCK_ANIMATION],
    ["shoulder_manipulation", SHOULDER_MANIPULATION_ANIMATION],
    ["flowing_arm_bar", FLOWING_ARM_BAR_ANIMATION],
    ["joint_lock_defense", JOINT_LOCK_DEFENSE_ANIMATION],
    ["sweep_defense", SWEEP_DEFENSE_ANIMATION],
    ["mountain_lock", MOUNTAIN_LOCK_ANIMATION],
    ["earth_embrace", EARTH_EMBRACE_ANIMATION],
    ["carotid_choke", CAROTID_CHOKE_ANIMATION],
    ["rear_naked_choke", REAR_NAKED_CHOKE_ANIMATION],
    ["redirect_throw", REDIRECT_THROW_ANIMATION],
  ]);
