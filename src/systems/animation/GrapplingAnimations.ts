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

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

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
    .throwExecute(0.22) // 던지기 - Execute throw
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
    .asDefense(0.35)
    .parry(0.15) // 막기 - Block
    .recover(0.2) // 복귀
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
  ]);
