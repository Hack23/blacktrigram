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
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

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
 * 1. Wind-up (준비): Arm bent, coiled position
 * 2. Extension (지르기): Arm snaps forward
 * 3. Full extension: Maximum reach
 * 4. Recovery (복귀): Return to guard
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(0.3)
    .punchWindup(0.05) // 준비 - Quick wind-up
    .punchExtend(0.1) // 지르기 - Snap forward
    .recover(0.15) // 복귀 - Return to guard
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
 * 1. Wind-up (준비): Weight shifts back
 * 2. Hip rotation: Power generation from hips
 * 3. Extension (지르기): Arm extends with torso
 * 4. Follow-through: Complete rotation
 * 5. Recovery (복귀): Return to guard
 *
 * @korean 크로스애니메이션
 */
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(0.35)
    .punchWindup(0.08) // 준비
    .crossPunch(0.12) // 지르기 - Full rotation punch
    .recover(0.15) // 복귀
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
 * @korean 장권애니메이션
 */
export const PALM_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("palm_strike", "장권")
    .asAttack(0.35)
    .punchWindup(0.08) // 준비
    .palmStrike(0.12) // 장권 - Palm heel forward
    .recover(0.15) // 복귀
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
  ]
);
