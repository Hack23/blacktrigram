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
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "./MartialArtsAnimationBuilder";

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
 * 1. Chamber (준비): Knee lifts to waist height - 150ms
 * 2. Extension (차기): Leg snaps forward - 180ms
 * 3. Retraction (회수): Leg returns to chamber - 150ms
 * 4. Recovery (복귀): Return to fighting stance - 220ms
 *
 * Total duration: 700ms (MEDIUM technique)
 *
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("front_kick", "앞차기")
    .asAttack(0.7)
    .chamber(0.15) // 준비 - 150ms knee lifts
    .withHighGuard() // 상단방어 - Protect face
    .extend(0.18) // 차기 - 180ms leg snaps forward
    .retract(0.15) // 회수 - 150ms return to chamber
    .setDown(0.22) // 착지 - 220ms foot returns
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
 * 1. Chamber (준비): Hip rotates out, knee lifts - 150ms
 * 2. Extension (차기): Leg whips through target - 200ms
 * 3. Follow-through: Hip continues rotation - 100ms
 * 4. Recovery (복귀): Return to fighting stance - 350ms
 *
 * Total duration: 800ms (MEDIUM+ technique)
 *
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("roundhouse_kick", "돌려차기")
    .asAttack(0.8)
    .roundhouseChamber(0.15) // 준비 - 150ms hip rotates out
    .withHighGuard() // 상단방어
    .roundhouseExtend(0.2) // 차기 - 200ms leg whips through
    .roundhouseExtend(0.1) // 정점 - 100ms hold
    .retract(0.15) // 회수 - 150ms
    .recover(0.2) // 복귀 - 200ms
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
 * 1. Chamber (준비): Turn sideways, knee lifts - 150ms
 * 2. Extension (차기): Heel drives through target - 180ms
 * 3. Retraction (회수): Leg returns - 150ms
 * 4. Recovery (복귀): Return to stance - 270ms
 *
 * Total duration: 750ms (MEDIUM technique)
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_kick", "옆차기")
    .asAttack(0.75)
    .sideKickChamber(0.15) // 준비 - 150ms turn sideways
    .withHighGuard()
    .sideKickExtend(0.18) // 차기 - 180ms heel drives
    .retract(0.15) // 회수 - 150ms
    .recover(0.27) // 복귀 - 270ms
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
 * 1. Rise (올리기): Leg rises high above target - 250ms
 * 2. Peak: Leg nearly vertical - 120ms
 * 3. Chop (내려치기): Heel drives down - 250ms
 * 4. Recovery (복귀): Return to stance - 380ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 내려차기애니메이션
 */
export const AXE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("axe_kick", "내려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .axeKickRise(0.25) // 올리기 - 250ms leg rises high
    .withHighGuard()
    .axeKickChop(0.25) // 내려치기 - 250ms heel chops down
    .axeKickChop(0.12) // 정점 - 120ms hold
    .setDown(0.18) // 착지 - 180ms
    .recover(0.2) // 복귀 - 200ms
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
 * 1. Spin (회전): Body begins 180° rotation - 200ms
 * 2. Chamber: Leg loads while spinning
 * 3. Thrust (차기): Heel drives backward - 250ms
 * 4. Recovery (복귀): Complete rotation, return to stance - 550ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뒤차기애니메이션
 */
export const BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_kick", "뒤차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .backKickSpin(0.2) // 회전 - 200ms body rotates
    .backKickThrust(0.25) // 차기 - 250ms heel thrusts
    .backKickThrust(0.1) // 정점 - 100ms hold
    .spinRecover(0.45) // 복귀 - 450ms complete rotation
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
 * 1. Jump prep: Crouch and spring - 200ms
 * 2. Spin (회전): 360° rotation in air - 300ms
 * 3. Strike (차기): Instep connects - 250ms
 * 4. Landing (착지): Return to ground - 450ms
 *
 * Total duration: 1200ms (HEAVY+ spinning technique)
 *
 * @korean 회전차기애니메이션
 */
export const TORNADO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tornado_kick", "회전차기")
    .asAttack(1.2)
    .chamber(0.2) // Jump prep - 200ms
    .backKickSpin(0.3) // Begin spin - 300ms
    .roundhouseExtend(0.25) // Strike through spin - 250ms
    .spinRecover(0.45) // Land and recover - 450ms
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
 * Total duration: 900ms (HEAVY- technique)
 *
 * @korean 뛰어차기애니메이션
 */
export const JUMPING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_kick", "뛰어차기")
    .asAttack(0.9)
    .chamber(0.18) // Jump prep with chamber - 180ms
    .extend(0.22) // Kick in air - 220ms
    .retract(0.2) // Retract before landing - 200ms
    .recover(0.3) // Land and recover - 300ms
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
 * Total duration: 800ms (MEDIUM+ technique)
 *
 * @korean 걸기애니메이션
 */
export const SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("sweep", "걸기")
    .asAttack(0.8)
    .sweep(0.3) // Sweeping motion - 300ms
    .recover(0.5) // Recover from low position - 500ms
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
 * 1. Chamber (준비): Slight hip rotation - 100ms
 * 2. Sweep (차기): Shin sweeps through low target - 150ms
 * 3. Recovery (복귀): Return to stance - 350ms
 *
 * Total duration: 600ms (FAST+ technique)
 *
 * @korean 하단차기애니메이션
 */
export const LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("low_kick", "하단차기")
    .asAttack(0.6)
    .lowKickChamber(0.1) // 준비 - 100ms hip rotation
    .withGuard() // Hands protect
    .lowKickSweep(0.15) // 차기 - 150ms shin sweeps
    .lowKickSweep(0.05) // 정점 - 50ms hold
    .recover(0.3) // 복귀 - 300ms
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
 * 1. Chamber (준비): Leg rises across body - 150ms
 * 2. Arc (호): Leg sweeps in crescent path - 200ms
 * 3. Recovery (복귀): Return to stance - 450ms
 *
 * Total duration: 800ms (MEDIUM+ technique)
 *
 * @korean 초승달차기애니메이션
 */
export const CRESCENT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("crescent_kick", "초승달차기")
    .asAttack(0.8)
    .crescentKickChamber(0.15) // 준비 - 150ms leg rises
    .withHighGuard()
    .crescentKickArc(0.2) // 호 - 200ms sweeping arc
    .crescentKickArc(0.08) // 정점 - 80ms hold
    .setDown(0.17) // 착지 - 170ms
    .recover(0.2) // 복귀 - 200ms
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
 * 1. Chamber (준비): Knee lifts high - 150ms
 * 2. Thrust (밀기): Foot pushes forward - 180ms
 * 3. Recovery (복귀): Return to stance - 370ms
 *
 * Total duration: 700ms (MEDIUM technique)
 *
 * @korean 밀어차기애니메이션
 */
export const PUSH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("push_kick", "밀어차기")
    .asAttack(0.7)
    .pushKickChamber(0.15) // 준비 - 150ms high chamber
    .withHighGuard()
    .pushKickThrust(0.18) // 밀기 - 180ms push through
    .retract(0.15) // 회수 - 150ms
    .recover(0.22) // 복귀 - 220ms
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
 * 1. Spin (회전): Body rotates 360° - 300ms
 * 2. Strike (차기): Heel hooks around - 350ms
 * 3. Recovery (복귀): Complete rotation - 550ms
 *
 * Total duration: 1200ms (HEAVY+ spinning technique)
 *
 * @korean 뒤돌려차기애니메이션
 */
export const SPINNING_HEEL_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_heel_kick", "뒤돌려차기")
    .asAttack(1.2)
    .backKickSpin(0.3) // 회전 - 300ms begin spin
    .spinningHeelKick(0.35) // 차기 - 350ms heel hooks
    .spinRecover(0.55) // 복귀 - 550ms complete rotation
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
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뛰어돌려차기애니메이션
 */
export const JUMPING_ROUNDHOUSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_roundhouse", "뛰어돌려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .chamber(0.15) // Jump prep - 150ms
    .roundhouseChamber(0.2) // Chamber in air - 200ms
    .roundhouseExtend(0.25) // Strike through - 250ms
    .roundhouseExtend(0.1) // Peak - 100ms
    .recover(0.3) // Land - 300ms
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
 * Total duration: 850ms (MEDIUM++ technique)
 *
 * @korean 물음표차기애니메이션
 */
export const QUESTION_MARK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("question_mark_kick", "물음표차기")
    .asAttack(0.85)
    .lowKickChamber(0.12) // Feint low - 120ms
    .withHighGuard()
    .roundhouseChamber(0.15) // Redirect up - 150ms
    .roundhouseExtend(0.22) // Strike high - 220ms
    .roundhouseExtend(0.08) // Peak - 80ms
    .recover(0.28) // Recover - 280ms
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
 * Total duration: 800ms (MEDIUM+ technique)
 *
 * @korean 후려차기애니메이션
 */
export const HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook_kick", "후려차기")
    .asAttack(0.8)
    .sideKickChamber(0.15) // Chamber like side kick - 150ms
    .withHighGuard()
    .sideKickExtend(0.18) // Extend past target - 180ms
    .crescentKickArc(0.2) // Hook back - 200ms
    .recover(0.27) // Recover - 270ms
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
 * Total duration: 1100ms (combo technique)
 *
 * @korean 이중차기애니메이션
 */
export const DOUBLE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_kick", "이중차기")
    .asAttack(1.1)
    .lowKickChamber(0.12) // First kick chamber - 120ms
    .lowKickSweep(0.15) // First kick strikes - 150ms
    .roundhouseChamber(0.15) // Second kick chamber - 150ms
    .roundhouseExtend(0.22) // Second kick strikes - 220ms
    .roundhouseExtend(0.08) // Peak - 80ms
    .recover(0.38) // Recover - 380ms
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
 * Total duration: 1200ms (HEAVY+ spinning technique)
 *
 * @korean 뒤돌아차기애니메이션
 */
export const SPINNING_BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_back_kick", "뒤돌아차기")
    .asAttack(1.2)
    .backKickSpin(0.35) // Full spin - 350ms
    .backKickThrust(0.3) // Thrust heel - 300ms
    .backKickThrust(0.12) // Peak - 120ms
    .spinRecover(0.43) // Complete rotation - 430ms
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
