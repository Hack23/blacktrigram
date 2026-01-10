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
]);
