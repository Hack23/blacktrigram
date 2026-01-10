/**
 * Kick Animations Module
 *
 * All kick animations (발차기) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 발차기 애니메이션 모듈
 *
 * @module systems/animation/KickAnimations
 * @korean 발차기애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// FRONT KICK (앞차기) - Basic Taekwondo Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Front Kick - 앞차기
 *
 * Basic Taekwondo front kick targeting solar plexus.
 * Ball of foot strikes forward in a snapping motion.
 *
 * Phases:
 * 1. Chamber (준비): Knee lifts to waist height
 * 2. Extension (차기): Leg snaps forward
 * 3. Retraction (회수): Leg returns to chamber
 * 4. Recovery (복귀): Return to fighting stance
 *
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("front_kick", "앞차기")
    .asAttack(0.55)
    .chamber(0.12) // 준비 - Knee lifts
    .withHighGuard() // 상단방어 - Protect face
    .extend(0.13) // 차기 - Leg snaps forward
    .retract(0.15) // 회수 - Return to chamber
    .setDown(0.15) // 착지 - Foot returns
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ROUNDHOUSE KICK (돌려차기) - Signature Taekwondo Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Roundhouse Kick - 돌려차기
 *
 * Signature Taekwondo kick with hip rotation.
 * Instep or shin strikes target in circular arc.
 *
 * Phases:
 * 1. Chamber (준비): Hip rotates out, knee lifts
 * 2. Extension (차기): Leg whips through target
 * 3. Follow-through: Hip continues rotation
 * 4. Recovery (복귀): Return to fighting stance
 *
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("roundhouse_kick", "돌려차기")
    .asAttack(0.6)
    .roundhouseChamber(0.12) // 준비 - Hip rotates out
    .withHighGuard() // 상단방어
    .roundhouseExtend(0.15) // 차기 - Leg whips through
    .retract(0.15) // 회수
    .recover(0.18) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SIDE KICK (옆차기) - Lateral Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Side Kick - 옆차기
 *
 * Powerful lateral kick with heel striking target.
 * Body turns sideways for maximum reach.
 *
 * Phases:
 * 1. Chamber (준비): Turn sideways, knee lifts
 * 2. Extension (차기): Heel drives through target
 * 3. Retraction (회수): Leg returns
 * 4. Recovery (복귀): Return to stance
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_kick", "옆차기")
    .asAttack(0.55)
    .sideKickChamber(0.12) // 준비 - Turn sideways
    .withHighGuard()
    .sideKickExtend(0.13) // 차기 - Heel drives
    .retract(0.15) // 회수
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// AXE KICK (내려차기) - Downward Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Axe Kick - 내려차기
 *
 * High kick that comes down like an axe on target.
 * Heel strikes head or collarbone from above.
 *
 * Phases:
 * 1. Rise (올리기): Leg rises high above target
 * 2. Peak: Leg nearly vertical
 * 3. Chop (내려치기): Heel drives down
 * 4. Recovery (복귀): Return to stance
 *
 * @korean 내려차기애니메이션
 */
export const AXE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("axe_kick", "내려차기")
    .asAttack(0.65)
    .axeKickRise(0.2) // 올리기 - Leg rises high
    .withHighGuard()
    .axeKickChop(0.15) // 내려치기 - Heel chops down
    .setDown(0.15) // 착지
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACK KICK (뒤차기) - Spinning Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Back Kick - 뒤차기
 *
 * Powerful spinning kick with heel thrust backward.
 * Body rotates 180° for surprise attack.
 *
 * Phases:
 * 1. Spin (회전): Body begins 180° rotation
 * 2. Chamber: Leg loads while spinning
 * 3. Thrust (차기): Heel drives backward
 * 4. Recovery (복귀): Complete rotation, return to stance
 *
 * @korean 뒤차기애니메이션
 */
export const BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_kick", "뒤차기")
    .asAttack(0.65)
    .backKickSpin(0.15) // 회전 - Body rotates
    .backKickThrust(0.15) // 차기 - Heel thrusts
    .spinRecover(0.35) // 복귀 - Complete rotation
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// TORNADO KICK (회전차기) - Jumping Spin Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tornado Kick - 회전차기
 *
 * Jumping spinning kick with instep striking target.
 * Full 360° rotation with both feet off ground.
 *
 * Phases:
 * 1. Jump prep: Crouch and spring
 * 2. Spin (회전): 360° rotation in air
 * 3. Strike (차기): Instep connects
 * 4. Landing (착지): Return to ground
 *
 * @korean 회전차기애니메이션
 */
export const TORNADO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tornado_kick", "회전차기")
    .asAttack(0.7)
    .chamber(0.1) // Jump prep
    .backKickSpin(0.15) // Begin spin
    .roundhouseExtend(0.15) // Strike through spin
    .spinRecover(0.3) // Land and recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING KICK (뛰어차기) - Airborne Front Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jumping Kick - 뛰어차기
 *
 * Front kick executed while airborne for extra height/reach.
 * Traditional Taekwondo flying kick technique.
 *
 * @korean 뛰어차기애니메이션
 */
export const JUMPING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_kick", "뛰어차기")
    .asAttack(0.6)
    .chamber(0.1) // Jump prep with chamber
    .extend(0.15) // Kick in air
    .retract(0.15) // Retract before landing
    .recover(0.2) // Land and recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SWEEP (걸기) - Low Leg Sweep
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sweep - 걸기
 *
 * Low sweeping kick targeting opponent's legs.
 * Used to unbalance or take down opponent.
 *
 * @korean 걸기애니메이션
 */
export const SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("sweep", "걸기")
    .asAttack(0.55)
    .sweep(0.2) // Sweeping motion
    .recover(0.35) // Recover from low position
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LOW KICK (하단차기) - Muay Thai Leg Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Low Kick - 하단차기
 *
 * Muay Thai style leg kick targeting thigh.
 * Shin strikes outer thigh to damage mobility.
 *
 * Phases:
 * 1. Chamber (준비): Slight hip rotation
 * 2. Sweep (차기): Shin sweeps through low target
 * 3. Recovery (복귀): Return to stance
 *
 * @korean 하단차기애니메이션
 */
export const LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("low_kick", "하단차기")
    .asAttack(0.45)
    .lowKickChamber(0.1) // 준비 - Hip rotation
    .withGuard() // Hands protect
    .lowKickSweep(0.12) // 차기 - Shin sweeps
    .recover(0.23) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CRESCENT KICK (초승달차기) - Inside/Outside Crescent
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crescent Kick - 초승달차기
 *
 * Arcing kick that sweeps in a crescent path.
 * Instep strikes head or arm in sweeping motion.
 *
 * Phases:
 * 1. Chamber (준비): Leg rises across body
 * 2. Arc (호): Leg sweeps in crescent path
 * 3. Recovery (복귀): Return to stance
 *
 * @korean 초승달차기애니메이션
 */
export const CRESCENT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("crescent_kick", "초승달차기")
    .asAttack(0.55)
    .crescentKickChamber(0.12) // 준비 - Leg rises
    .withHighGuard()
    .crescentKickArc(0.15) // 호 - Sweeping arc
    .setDown(0.13) // 착지
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PUSH KICK (밀어차기) - Teep Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Push Kick - 밀어차기 (Teep)
 *
 * Front kick used to push opponent away.
 * Ball of foot thrusts into opponent's torso.
 *
 * Phases:
 * 1. Chamber (준비): Knee lifts high
 * 2. Thrust (밀기): Foot pushes forward
 * 3. Recovery (복귀): Return to stance
 *
 * @korean 밀어차기애니메이션
 */
export const PUSH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("push_kick", "밀어차기")
    .asAttack(0.5)
    .pushKickChamber(0.12) // 준비 - High chamber
    .withHighGuard()
    .pushKickThrust(0.13) // 밀기 - Push through
    .retract(0.12) // 회수
    .recover(0.13) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING HEEL KICK (뒤돌려차기) - Reverse Hook Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Heel Kick - 뒤돌려차기
 *
 * Full spin with heel striking in reverse arc.
 * High-risk, high-reward knockout technique.
 *
 * Phases:
 * 1. Spin (회전): Body rotates 360°
 * 2. Strike (차기): Heel hooks around
 * 3. Recovery (복귀): Complete rotation
 *
 * @korean 뒤돌려차기애니메이션
 */
export const SPINNING_HEEL_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_heel_kick", "뒤돌려차기")
    .asAttack(0.7)
    .backKickSpin(0.18) // 회전 - Begin spin
    .spinningHeelKick(0.2) // 차기 - Heel hooks
    .spinRecover(0.32) // 복귀 - Complete rotation
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING ROUNDHOUSE (뛰어돌려차기) - Flying Roundhouse
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jumping Roundhouse - 뛰어돌려차기
 *
 * Roundhouse kick executed while airborne.
 * Added height and power from jumping momentum.
 *
 * @korean 뛰어돌려차기애니메이션
 */
export const JUMPING_ROUNDHOUSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_roundhouse", "뛰어돌려차기")
    .asAttack(0.65)
    .chamber(0.1) // Jump prep
    .roundhouseChamber(0.12) // Chamber in air
    .roundhouseExtend(0.15) // Strike through
    .recover(0.28) // Land
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION MARK KICK (물음표차기) - Feint to Roundhouse
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Question Mark Kick - 물음표차기
 *
 * Feints low kick then arcs up to head.
 * Path resembles a question mark.
 *
 * @korean 물음표차기애니메이션
 */
export const QUESTION_MARK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("question_mark_kick", "물음표차기")
    .asAttack(0.6)
    .lowKickChamber(0.08) // Feint low
    .withHighGuard()
    .roundhouseChamber(0.1) // Redirect up
    .roundhouseExtend(0.15) // Strike high
    .recover(0.27) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK KICK (후려차기) - Heel Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook Kick - 후려차기
 *
 * Leg extends past target then hooks back.
 * Heel strikes from unexpected angle.
 *
 * @korean 후려차기애니메이션
 */
export const HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook_kick", "후려차기")
    .asAttack(0.55)
    .sideKickChamber(0.1) // Chamber like side kick
    .withHighGuard()
    .sideKickExtend(0.1) // Extend past target
    .crescentKickArc(0.12) // Hook back
    .recover(0.23) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE KICK (이중차기) - Two Rapid Kicks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Kick - 이중차기
 *
 * Two rapid kicks from same leg.
 * First low, second high to confuse defense.
 *
 * @korean 이중차기애니메이션
 */
export const DOUBLE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_kick", "이중차기")
    .asAttack(0.7)
    .lowKickChamber(0.08) // First kick chamber
    .lowKickSweep(0.1) // First kick strikes
    .roundhouseChamber(0.1) // Second kick chamber
    .roundhouseExtend(0.12) // Second kick strikes
    .recover(0.3) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING BACK KICK (뒤돌아차기) - 540 Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Back Kick - 뒤돌아차기
 *
 * Full rotation into powerful back kick.
 * 540 degrees of spinning momentum.
 *
 * @korean 뒤돌아차기애니메이션
 */
export const SPINNING_BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_back_kick", "뒤돌아차기")
    .asAttack(0.75)
    .backKickSpin(0.2) // Full spin
    .backKickThrust(0.18) // Thrust heel
    .spinRecover(0.37) // Complete rotation
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT KICK ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all kick animations for easy access
 * 발차기 애니메이션 맵
 */
export const KICK_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ["front_kick", FRONT_KICK_ANIMATION],
  ["roundhouse_kick", ROUNDHOUSE_KICK_ANIMATION],
  ["side_kick", SIDE_KICK_ANIMATION],
  ["axe_kick", AXE_KICK_ANIMATION],
  ["back_kick", BACK_KICK_ANIMATION],
  ["tornado_kick", TORNADO_KICK_ANIMATION],
  ["jumping_kick", JUMPING_KICK_ANIMATION],
  ["sweep", SWEEP_ANIMATION],
  ["low_kick", LOW_KICK_ANIMATION],
  ["crescent_kick", CRESCENT_KICK_ANIMATION],
  ["push_kick", PUSH_KICK_ANIMATION],
  ["spinning_heel_kick", SPINNING_HEEL_KICK_ANIMATION],
  ["jumping_roundhouse", JUMPING_ROUNDHOUSE_ANIMATION],
  ["question_mark_kick", QUESTION_MARK_KICK_ANIMATION],
  ["hook_kick", HOOK_KICK_ANIMATION],
  ["double_kick", DOUBLE_KICK_ANIMATION],
  ["spinning_back_kick", SPINNING_BACK_KICK_ANIMATION],
]);
