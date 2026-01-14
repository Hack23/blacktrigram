import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// GAM TRIGRAM (감) - WATER: REDIRECTION & FLOW (유수/방향전환)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Flowing River Strike - 유수타격
 *
 * Signature Gam technique that flows like water around defenses.
 * Unlike direct strikes, this follows a curved path to bypass guards.
 *
 * Target: Face/Neck via curved trajectory
 * Principle: Flow (Yu)
 *
 * Phases:
 * 1. Flow Entry (유입): Circular wind-up
 * 2. Curve (곡선): Arcing strike path
 * 3. Impact (타격): Fluid impact
 * 4. Continue (지속): Follow-through like flowing water
 *
 * @korean 유수타격애니메이션
 */
export const GAM_FLOWING_RIVER_STRIKE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_river_strike", "유수타격")
    .asAttack(0.7)
    .parry(0.2) // Initial defensive flow
    .hookPunch(0.3) // Curved strike execution (using hook primitive for curve)
    .recover(0.2) // Flow back
    .build();

/**
 * Redirection Counter - 방향전환반격
 *
 * Using the opponent's momentum against them.
 * Catching an attack and redirecting it while striking.
 *
 * Principle: Redirection (Banghyang Jeonhwan)
 *
 * @korean 방향전환반격애니메이션
 */
export const GAM_REDIRECTION_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("redirection_counter", "방향전환반격")
    .asDefense(0.6)
    .parry(0.15) // Catch/Deflect
    .wristTwist(0.15) // Redirect vector
    .palmStrike(0.15) // Simultaneous counter
    .recover(0.15)
    .build();

/**
 * Tidal Wave Palm - 해일장
 *
 * A heavy, crashing palm strike that mimics a tidal wave.
 * Builds energy from the ground up through a fluid body wave.
 *
 * Target: Chest/Solar Plexus
 * Principle: Heavy Flow (Jungrryu)
 *
 * @korean 해일장애니메이션
 */
export const GAM_TIDAL_WAVE_PALM: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tidal_wave_palm", "해일장")
    .asAttack(0.8)
    .chamber(0.25) // Deep gathering like drawing water
    .palmStrike(0.3) // Heavy crashing extension
    .recover(0.25)
    .build();

/**
 * Whirlpool Counter - 소용돌이반격
 *
 * Circular defensive movement that traps the opponent's limb.
 *
 * Principle: Vortex (Soyongdori)
 *
 * @korean 소용돌이반격애니메이션
 */
export const GAM_WHIRLPOOL_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("whirlpool_counter", "소용돌이반격")
    .asDefense(0.7)
    .parry(0.15) // Outer deflection
    .wristTwist(0.2) // Circular trap
    .jointLock(0.2) // Lock in the center
    .recover(0.15)
    .build();

/**
 * Flowing Block - 유수막기
 *
 * Soft blocking technique that absorbs and redirects force rather than meeting it.
 *
 * @korean 유수막기애니메이션
 */
export const GAM_FLOWING_BLOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_block", "유수막기")
    .asDefense(0.5)
    .parry(0.25) // Long, fluid parry motion
    .recover(0.25)
    .build();
