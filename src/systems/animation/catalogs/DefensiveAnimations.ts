/**
 * Defensive animations for Eight Trigram stances
 *
 * Implements stance-specific defensive techniques based on Korean martial arts
 * and I Ching philosophy using the MartialArtsAnimationBuilder pattern.
 *
 * Coverage:
 * - 8 stances × 2 defensive moves = 16 defensive animations
 * - Block success, parry, guard break, and recovery animations
 * - Integration with existing AnimationStateMachine
 *
 * @module systems/animation/DefensiveAnimations
 * @category Animation
 * @korean 방어애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { TrigramStance } from "@/types/common";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☰ 건 (GEON) - HEAVEN DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☰ 건 (Geon) - Heaven Defensive Move 1: High Block (상단막기)
 * Strong overhead block with both arms raised high. Direct force meets force.
 * @korean 건상단막기
 */
export const GEON_HIGH_BLOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_high_block", "건 상단막기")
    .asDefense(0.2)
    .stance()
    .blockHigh(0.1, "ease-out")
    .blockHigh(0.1, "linear")
    .build();

/**
 * ☰ 건 (Geon) - Heaven Defensive Move 2: Counter Strike (반격)
 * Quick counter punch after blocking, leveraging forward aggression.
 * @korean 건반격
 */
export const GEON_COUNTER_STRIKE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_counter_strike", "건 반격")
    .asDefense(0.25)
    .stance()
    .counterStrike(0.15, "ease-out")
    .recover(0.1, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ 태 (TAE) - LAKE DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☱ 태 (Tae) - Lake Defensive Move 1: Joint Lock Defense (관절꺾기 방어)
 * Circular deflection leading into joint manipulation. Fluid redirection.
 * @korean 태관절방어
 */
export const TAE_JOINT_LOCK_DEFENSE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_joint_lock_defense", "태 관절방어")
    .asDefense(0.3)
    .stance()
    .parry(0.1, "ease-out")
    .jointLock(0.12, "linear")
    .recover(0.08, "ease-in")
    .build();

/**
 * ☱ 태 (Tae) - Lake Defensive Move 2: Sweep Defense (쓸어치기 방어)
 * Low sweeping motion to deflect and unbalance attacker.
 * @korean 태쓸어치기방어
 */
export const TAE_SWEEP_DEFENSE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_sweep_defense", "태 쓸어치기방어")
    .asDefense(0.28)
    .stance()
    .parry(0.08, "ease-out")
    .sweep(0.12, "linear")
    .recover(0.08, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ 리 (LI) - FIRE DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☲ 리 (Li) - Fire Defensive Move 1: Precision Parry (정밀 받아넘기기)
 * Precise hand deflection targeting specific attack points.
 * @korean 리정밀받아넘기기
 */
export const LI_PRECISION_PARRY: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_precision_parry", "리 정밀받아넘기기")
    .asDefense(0.18)
    .stance()
    .parry(0.09, "ease-out")
    .recover(0.09, "ease-in")
    .build();

/**
 * ☲ 리 (Li) - Fire Defensive Move 2: Nerve Strike Counter (신경타격 반격)
 * Quick nerve strike counter after deflection.
 * @korean 리신경타격반격
 */
export const LI_NERVE_STRIKE_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "li_nerve_strike_counter",
    "리 신경타격반격",
  )
    .asDefense(0.22)
    .stance()
    .counterParry(0.06, "linear")
    .counterStrike(0.1, "ease-out")
    .recover(0.06, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ 진 (JIN) - THUNDER DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☳ 진 (Jin) - Thunder Defensive Move 1: Explosive Block (폭발적 막기)
 * Powerful explosive block that can stagger attacker.
 * @korean 진폭발막기
 */
export const JIN_EXPLOSIVE_BLOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_explosive_block", "진 폭발막기")
    .asDefense(0.15)
    .stance()
    .blockHigh(0.08, "ease-out")
    .recover(0.07, "ease-in")
    .build();

/**
 * ☳ 진 (Jin) - Thunder Defensive Move 2: Shocking Counter (충격 반격)
 * Lightning-fast counter strike with explosive power.
 * @korean 진충격반격
 */
export const JIN_SHOCKING_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_shocking_counter", "진 충격반격")
    .asDefense(0.18)
    .stance()
    .counterStrike(0.09, "ease-out")
    .recover(0.09, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ 손 (SON) - WIND DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☴ 손 (Son) - Wind Defensive Move 1: Continuous Deflection (연속 막기)
 * Rapid circular deflections, multiple in succession.
 * @korean 손연속막기
 */
export const SON_CONTINUOUS_DEFLECTION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_continuous_deflection", "손 연속막기")
    .asDefense(0.35)
    .stance()
    .parry(0.1, "linear")
    .parry(0.1, "linear")
    .parry(0.08, "linear")
    .recover(0.07, "ease-in")
    .build();

/**
 * ☴ 손 (Son) - Wind Defensive Move 2: Pressure Counter (압박 반격)
 * Multiple quick strikes after deflection, maintaining pressure.
 * @korean 손압박반격
 */
export const SON_PRESSURE_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_pressure_counter", "손 압박반격")
    .asDefense(0.4)
    .stance()
    .counterStrike(0.1, "ease-out")
    .counterStrike(0.1, "ease-out")
    .counterStrike(0.1, "ease-out")
    .recover(0.1, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ 감 (GAM) - WATER DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☵ 감 (Gam) - Water Defensive Move 1: Flow Defense (흐름 방어)
 * Yielding circular defense that redirects force.
 * @korean 감흐름방어
 */
export const GAM_FLOW_DEFENSE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_flow_defense", "감 흐름방어")
    .asDefense(0.32)
    .stance()
    .parry(0.12, "ease-out")
    .shift(0.1, "linear")
    .recover(0.1, "ease-in")
    .build();

/**
 * ☵ 감 (Gam) - Water Defensive Move 2: Redirection Counter (전환 반격)
 * Uses opponent's momentum for counter strike.
 * @korean 감전환반격
 */
export const GAM_REDIRECTION_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_redirection_counter", "감 전환반격")
    .asDefense(0.3)
    .stance()
    .parry(0.1, "ease-out")
    .counterStrike(0.12, "ease-out")
    .recover(0.08, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ 간 (GAN) - MOUNTAIN DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☶ 간 (Gan) - Mountain Defensive Move 1: Immovable Block (부동 막기)
 * Solid defensive stance that absorbs attacks.
 * @korean 간부동막기
 */
export const GAN_IMMOVABLE_BLOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_immovable_block", "간 부동막기")
    .asDefense(0.25)
    .stance()
    .blockHigh(0.13, "linear")
    .recover(0.12, "ease-in")
    .build();

/**
 * ☶ 간 (Gan) - Mountain Defensive Move 2: Counter Fortress (반격 요새)
 * Strong defensive position with delayed power counter.
 * @korean 간반격요새
 */
export const GAN_COUNTER_FORTRESS: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_counter_fortress", "간 반격요새")
    .asDefense(0.35)
    .stance()
    .blockHigh(0.12, "linear")
    .counterStrike(0.13, "ease-out")
    .recover(0.1, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ 곤 (GON) - EARTH DEFENSIVE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☷ 곤 (Gon) - Earth Defensive Move 1: Grounding Defense (접지 방어)
 * Low defensive posture with strong base.
 * @korean 곤접지방어
 */
export const GON_GROUNDING_DEFENSE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_grounding_defense", "곤 접지방어")
    .asDefense(0.28)
    .stance()
    .blockLow(0.14, "ease-out")
    .recover(0.14, "ease-in")
    .build();

/**
 * ☷ 곤 (Gon) - Earth Defensive Move 2: Takedown Counter (꺾기 반격)
 * Defensive takedown using low center of gravity advantage.
 * @korean 곤꺾기반격
 */
export const GON_TAKEDOWN_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_takedown_counter", "곤 꺾기반격")
    .asDefense(0.45)
    .stance()
    .takedownShoot(0.15, "ease-out")
    .takedownDump(0.15, "linear")
    .recover(0.15, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all defensive animations by stance
 * @korean 자세별방어애니메이션
 */
export const DEFENSIVE_ANIMATIONS_BY_STANCE: ReadonlyMap<
  TrigramStance,
  readonly SkeletalAnimation[]
> = new Map([
  [TrigramStance.GEON, [GEON_HIGH_BLOCK, GEON_COUNTER_STRIKE] as const],
  [TrigramStance.TAE, [TAE_JOINT_LOCK_DEFENSE, TAE_SWEEP_DEFENSE] as const],
  [TrigramStance.LI, [LI_PRECISION_PARRY, LI_NERVE_STRIKE_COUNTER] as const],
  [TrigramStance.JIN, [JIN_EXPLOSIVE_BLOCK, JIN_SHOCKING_COUNTER] as const],
  [
    TrigramStance.SON,
    [SON_CONTINUOUS_DEFLECTION, SON_PRESSURE_COUNTER] as const,
  ],
  [TrigramStance.GAM, [GAM_FLOW_DEFENSE, GAM_REDIRECTION_COUNTER] as const],
  [TrigramStance.GAN, [GAN_IMMOVABLE_BLOCK, GAN_COUNTER_FORTRESS] as const],
  [TrigramStance.GON, [GON_GROUNDING_DEFENSE, GON_TAKEDOWN_COUNTER] as const],
]);

/**
 * All defensive animations in a single map for easy lookup
 * @korean 모든방어애니메이션
 */
export const ALL_DEFENSIVE_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["geon_high_block", GEON_HIGH_BLOCK],
  ["geon_counter_strike", GEON_COUNTER_STRIKE],
  ["tae_joint_lock_defense", TAE_JOINT_LOCK_DEFENSE],
  ["tae_sweep_defense", TAE_SWEEP_DEFENSE],
  ["li_precision_parry", LI_PRECISION_PARRY],
  ["li_nerve_strike_counter", LI_NERVE_STRIKE_COUNTER],
  ["jin_explosive_block", JIN_EXPLOSIVE_BLOCK],
  ["jin_shocking_counter", JIN_SHOCKING_COUNTER],
  ["son_continuous_deflection", SON_CONTINUOUS_DEFLECTION],
  ["son_pressure_counter", SON_PRESSURE_COUNTER],
  ["gam_flow_defense", GAM_FLOW_DEFENSE],
  ["gam_redirection_counter", GAM_REDIRECTION_COUNTER],
  ["gan_immovable_block", GAN_IMMOVABLE_BLOCK],
  ["gan_counter_fortress", GAN_COUNTER_FORTRESS],
  ["gon_grounding_defense", GON_GROUNDING_DEFENSE],
  ["gon_takedown_counter", GON_TAKEDOWN_COUNTER],
]);

/**
 * Get defensive animations for a specific stance
 * @korean 자세방어애니메이션가져오기
 */
export function getDefensiveAnimationsForStance(
  stance: TrigramStance,
): readonly SkeletalAnimation[] {
  return DEFENSIVE_ANIMATIONS_BY_STANCE.get(stance) ?? [];
}

/**
 * Get a defensive animation by name
 * @korean 방어애니메이션가져오기
 */
export function getDefensiveAnimation(
  name: string,
): SkeletalAnimation | undefined {
  return ALL_DEFENSIVE_ANIMATIONS.get(name);
}
