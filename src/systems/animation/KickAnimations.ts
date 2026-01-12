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
 * 1. Chamber (준비): Knee lifts to torso height - 120ms
 * 2. Extension (차기): Leg snaps forward with hip thrust - 180ms
 * 3. Peak (정점): Hold at full extension - 80ms
 * 4. Retraction (회수): Leg returns through chamber - 100ms
 * 5. Recovery (복귀): Return to fighting stance - 220ms
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("front_kick", "앞차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .chamber(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // 준비 - 120ms knee lifts to torso
    .extend(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // 차기 - 180ms leg snaps forward
    .extend(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // 정점 - 80ms hold at extension
    .retract(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract) // 회수 - 100ms return through chamber
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // 복귀 - 220ms return to stance
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
 * 4. Retraction (회수): Leg withdraws toward chamber - 150ms
 * 5. Recovery (복귀): Return to fighting stance - 200ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("roundhouse_kick", "돌려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms hip rotates out
    .withHighGuard() // 상단방어
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 차기 - 200ms leg whips through
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .retract(TECHNIQUE_TIMING.HEAVY_LIGHT.retract) // 회수 - 150ms
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 200ms
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
 * 1. Chamber (준비): Turn sideways, knee lifts - 120ms
 * 2. Extension (차기): Heel drives through target - 200ms
 * 3. Peak (정점): Hold at extension - 80ms
 * 4. Retraction (회수): Leg returns - 150ms
 * 5. Recovery (복귀): Return to stance - 200ms
 *
 * Total duration: 750ms (MEDIUM_HEAVY technique)
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_kick", "옆차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .sideKickChamber(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber) // 준비 - 120ms turn sideways
    .withHighGuard()
    .sideKickExtend(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend) // 차기 - 200ms heel drives
    .sideKickExtend(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak) // 정점 - 80ms hold at extension
    .retract(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract) // 회수 - 150ms
    .recover(TECHNIQUE_TIMING.MEDIUM_HEAVY.recover) // 복귀 - 200ms
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
 * 1. Rise (올리기): Leg rises high above target - 200ms
 * 2. Chop (내려치기): Heel drives down - 300ms
 * 3. Peak (정점): Brief hold at impact - 120ms
 * 4. Set down (착지): Controlled leg descent - 150ms
 * 5. Recovery (복귀): Return to stance - 230ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 내려차기애니메이션
 */
export const AXE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("axe_kick", "내려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .axeKickRise(TECHNIQUE_TIMING.HEAVY.chamber) // 올리기 - 200ms leg rises high
    .withHighGuard()
    .axeKickChop(TECHNIQUE_TIMING.HEAVY.extend) // 내려치기 - 300ms heel chops down
    .axeKickChop(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold at impact
    .setDown(TECHNIQUE_TIMING.HEAVY.retract) // 착지 - 150ms controlled descent
    .recover(TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 230ms return to stance
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
 * 1. Spin & chamber (회전+준비): Body rotates 180° and leg loads - 200ms
 * 2. Thrust (차기): Heel drives backward - 300ms
 * 3. Peak (정점): Hold at extension - 120ms
 * 4. Recovery (복귀): Complete rotation, return to stance - 380ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뒤차기애니메이션
 */
export const BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_kick", "뒤차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .backKickSpin(TECHNIQUE_TIMING.HEAVY.chamber) // 회전+준비 - 200ms body rotates and chambers
    .backKickThrust(TECHNIQUE_TIMING.HEAVY.extend) // 차기 - 300ms heel thrusts
    .backKickThrust(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold at extension
    .spinRecover(TECHNIQUE_TIMING.HEAVY.retract + TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 380ms (150ms + 230ms)
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
 * 1. Jump prep: Crouch and spring - 300ms (chamber + rotation start)
 * 2. Spin (회전): 360° rotation in air - 350ms
 * 3. Strike (차기): Instep connects - 120ms
 * 4. Landing (착지): Return to ground - 430ms
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전차기애니메이션
 */
export const TORNADO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tornado_kick", "회전차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .chamber(TECHNIQUE_TIMING.SPINNING.chamber) // Jump prep & begin spin - 300ms
    .roundhouseExtend(TECHNIQUE_TIMING.SPINNING.extend) // Strike through spin - 350ms
    .roundhouseExtend(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .spinRecover(TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover) // Land and recover - 430ms
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
 * Total duration: 900ms (JUMPING technique)
 *
 * @korean 뛰어차기애니메이션
 */
export const JUMPING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_kick", "뛰어차기")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total)
    .chamber(TECHNIQUE_TIMING.JUMPING.chamber) // Jump prep with chamber - 180ms
    .extend(TECHNIQUE_TIMING.JUMPING.extend) // Kick in air - 220ms
    .retract(TECHNIQUE_TIMING.JUMPING.retract) // Retract before landing - 120ms
    .recover(TECHNIQUE_TIMING.JUMPING.recover) // Land and recover - 300ms
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
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 걸기애니메이션
 */
export const SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("sweep", "걸기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .sweep(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber + TECHNIQUE_TIMING.HEAVY_LIGHT.extend + TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // Sweeping motion - 450ms
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // Recover from low position - 350ms
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
 * Total duration: 600ms (FAST_MEDIUM technique)
 *
 * @korean 하단차기애니메이션
 */
export const LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("low_kick", "하단차기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .lowKickChamber(TECHNIQUE_TIMING.FAST_MEDIUM.chamber) // 준비 - 100ms hip rotation
    .withGuard() // Hands protect
    .lowKickSweep(TECHNIQUE_TIMING.FAST_MEDIUM.extend) // 차기 - 150ms shin sweeps
    .lowKickSweep(TECHNIQUE_TIMING.FAST_MEDIUM.peak) // 정점 - 50ms hold
    .recover(TECHNIQUE_TIMING.FAST_MEDIUM.retract + TECHNIQUE_TIMING.FAST_MEDIUM.recover) // 복귀 - 300ms
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
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 초승달차기애니메이션
 */
export const CRESCENT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("crescent_kick", "초승달차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .crescentKickChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms leg rises
    .withHighGuard()
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 호 - 200ms sweeping arc
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .setDown(TECHNIQUE_TIMING.HEAVY_LIGHT.retract) // 착지 - 150ms
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 200ms
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
 * 1. Chamber (준비): Knee lifts high - 120ms
 * 2. Thrust (밀기): Foot pushes forward - 180ms
 * 3. Recovery (복귀): Return to stance - 400ms
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 밀어차기애니메이션
 */
export const PUSH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("push_kick", "밀어차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .pushKickChamber(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // 준비 - 120ms high chamber
    .withHighGuard()
    .pushKickThrust(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // 밀기 - 180ms push through
    .retract(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract) // 회수 - 100ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // 복귀 - 220ms
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
 * 3. Recovery (복귀): Complete rotation - 430ms
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 뒤돌려차기애니메이션
 */
export const SPINNING_HEEL_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_heel_kick", "뒤돌려차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // 회전 - 300ms begin spin
    .spinningHeelKick(TECHNIQUE_TIMING.SPINNING.extend) // 차기 - 350ms heel hooks
    .spinningHeelKick(TECHNIQUE_TIMING.SPINNING.peak) // 정점 - 120ms hold
    .spinRecover(TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover) // 복귀 - 430ms complete rotation
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
    .chamber(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Jump prep - 150ms (0.75 × 200ms)
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY.chamber) // Chamber in air - 200ms
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY.extend * 0.83) // Strike through - 250ms (0.83 × 300ms)
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY.retract * 0.67) // Peak - 100ms (0.67 × 150ms)
    .recover(TECHNIQUE_TIMING.HEAVY.recover + 0.07) // Land - 300ms (230ms + 70ms landing adjustment)
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
 * Total duration: 850ms (HEAVY_MEDIUM technique)
 *
 * @korean 물음표차기애니메이션
 */
export const QUESTION_MARK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("question_mark_kick", "물음표차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_MEDIUM.total)
    .lowKickChamber(TECHNIQUE_TIMING.HEAVY_MEDIUM.chamber) // Feint low - 120ms
    .withHighGuard()
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY_MEDIUM.extend) // Redirect up - 220ms (includes transition)
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_MEDIUM.peak) // Strike high - 80ms
    .recover(TECHNIQUE_TIMING.HEAVY_MEDIUM.retract + TECHNIQUE_TIMING.HEAVY_MEDIUM.recover) // Recover - 430ms
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
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 후려차기애니메이션
 */
export const HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook_kick", "후려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .sideKickChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // Chamber like side kick - 150ms
    .withHighGuard()
    .sideKickExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.extend * 0.5) // Extend past target - 100ms (split extension phase)
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.extend * 0.5 + TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // Hook back - 200ms (remaining extend + peak)
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // Recover - 350ms
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
 * Phases (준비, 실행, 회수, 복귀):
 * 1. First kick chamber (첫 차기 준비): 120ms
 * 2. First kick extend (첫 차기 실행): 145ms (0.66 × 220ms, shortened)
 * 3. Second kick chamber (둘째 차기 준비): 80ms (using peak for quick transition)
 * 4. Second kick extend (둘째 차기 실행): 145ms (0.66 × 220ms, shortened)
 * 5. Second kick peak (둘째 차기 정점): 80ms
 * 6. Recovery (복귀): 380ms
 *
 * Total duration: 950ms (COMBO_HEAVY technique)
 * Sum: 120 + 145 + 80 + 145 + 80 + 380 = 950ms ✓
 *
 * @korean 이중차기애니메이션
 */
export const DOUBLE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_kick", "이중차기")
    .asAttack(TECHNIQUE_TIMING.COMBO_HEAVY.total)
    .lowKickChamber(TECHNIQUE_TIMING.COMBO_HEAVY.chamber) // First kick chamber - 120ms
    .lowKickSweep(TECHNIQUE_TIMING.COMBO_HEAVY.extend * 0.66) // First kick strikes - 145ms (shortened for speed)
    .roundhouseChamber(TECHNIQUE_TIMING.COMBO_HEAVY.peak) // Second kick chamber - 80ms (using peak for quick transition)
    .roundhouseExtend(TECHNIQUE_TIMING.COMBO_HEAVY.extend * 0.66) // Second kick strikes - 145ms (shortened for speed)
    .roundhouseExtend(TECHNIQUE_TIMING.COMBO_HEAVY.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.COMBO_HEAVY.recover) // Recover - 380ms
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
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 뒤돌아차기애니메이션
 */
export const SPINNING_BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_back_kick", "뒤돌아차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Full spin - 300ms
    .backKickThrust(TECHNIQUE_TIMING.SPINNING.extend) // Thrust heel - 350ms
    .backKickThrust(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .spinRecover(TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover) // Complete rotation - 430ms
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
