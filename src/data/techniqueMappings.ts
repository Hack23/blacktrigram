/**
 * Technique to Animation Type mappings
 *
 * **Korean**: 기술-애니메이션 매핑
 *
 * Maps each technique to its corresponding AnimationType for attack movement physics.
 * This provides a type-safe, comprehensive mapping that replaces string-based
 * substring matching.
 *
 * @module data/techniqueMappings
 * @category Combat System
 * @korean 기술매핑
 */

import { TechniqueId } from "../types/techniqueId";
import { AnimationType } from "../systems/animation/builders/MartialArtsConstants";
import { AttackAnimationType } from "../types/skeletal";

/**
 * Maps AttackAnimationType (from technique definitions) to AnimationType (for movement physics)
 *
 * AttackAnimationType is the skeletal animation type (PUNCH_HIGH, KICK_FRONT, etc.)
 * AnimationType is the martial arts movement type for physics calculations
 *
 * @korean 공격애니메이션타입-애니메이션타입매핑
 */
export const ATTACK_ANIMATION_TO_MOVEMENT_TYPE: Record<
  AttackAnimationType,
  AnimationType
> = {
  // Punches → Punch types
  [AttackAnimationType.PUNCH_HIGH]: AnimationType.CROSS,
  [AttackAnimationType.PUNCH_MID]: AnimationType.JAB,
  [AttackAnimationType.PUNCH_LOW]: AnimationType.JAB,

  // Kicks → Kick types
  [AttackAnimationType.KICK_FRONT]: AnimationType.FRONT_KICK,
  [AttackAnimationType.KICK_SIDE]: AnimationType.SIDE_KICK,
  [AttackAnimationType.KICK_ROUNDHOUSE]: AnimationType.ROUNDHOUSE_KICK,

  // Elbows → Elbow types
  [AttackAnimationType.ELBOW_STRIKE]: AnimationType.ELBOW_STRIKE,
  [AttackAnimationType.ELBOW_UPPERCUT]: AnimationType.ELBOW_UPPERCUT,

  // Knees → Knee types
  [AttackAnimationType.KNEE_STRIKE]: AnimationType.KNEE_STRIKE,
  [AttackAnimationType.KNEE_CLINCH]: AnimationType.CLINCH_KNEE,

  // Pressure points → Specialized strikes
  [AttackAnimationType.PRESSURE_POINT]: AnimationType.PRESSURE_POINT_STRIKE,
  [AttackAnimationType.PRESSURE_POINT_RAPID]: AnimationType.RAPID_BARRAGE,
};

/**
 * Maps TechniqueId to AnimationType for movement physics
 *
 * This is the primary lookup table used by CombatScreen3D to determine
 * the correct movement animation for each technique.
 *
 * Derived from technique definitions but cached here for performance.
 *
 * @korean 기술ID-애니메이션타입매핑
 */
export const TECHNIQUE_TO_ANIMATION_TYPE: Record<TechniqueId, AnimationType> = {
  // 무사 (Musa) - Traditional Warrior
  [TechniqueId.MUSA_THUNDER_STRIKE]: AnimationType.HEAVEN_STRIKE, // PUNCH_HIGH → powerful descending
  [TechniqueId.MUSA_IRON_DEFENSE]: AnimationType.JAB, // PUNCH_MID → defensive
  [TechniqueId.MUSA_DRAGON_FIST]: AnimationType.JAB, // PUNCH_MID → piercing
  [TechniqueId.MUSA_MOUNTAIN_BREAKER]: AnimationType.CROSS, // PUNCH_HIGH → crushing

  // 암살자 (Amsalja) - Shadow Assassin
  [TechniqueId.AMSALJA_SHADOW_STRIKE]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT
  [TechniqueId.AMSALJA_NERVE_STRIKE]: AnimationType.NERVE_STRIKE, // PRESSURE_POINT → precise
  [TechniqueId.AMSALJA_DEADLY_PRECISION]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT
  [TechniqueId.AMSALJA_SILENT_DEATH]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT → lethal

  // 해커 (Hacker) - Cyber Warrior
  [TechniqueId.HACKER_ELECTRIC_SHOCK]: AnimationType.LIGHTNING_STRIKE, // PUNCH_MID → electric
  [TechniqueId.HACKER_DATA_STRIKE]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT
  [TechniqueId.HACKER_CYBER_OVERDRIVE]: AnimationType.RAPID_BARRAGE, // PRESSURE_POINT_RAPID
  [TechniqueId.HACKER_SYSTEM_CRASH]: AnimationType.NERVE_STRIKE, // PRESSURE_POINT → system

  // 정보요원 (Jeongbo) - Intelligence Operative
  [TechniqueId.JEONGBO_TACTICAL_STRIKE]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT
  [TechniqueId.JEONGBO_COUNTER_INTELLIGENCE]: AnimationType.JAB, // PUNCH_MID → counter
  [TechniqueId.JEONGBO_PSYCHOLOGICAL_WARFARE]: AnimationType.NERVE_STRIKE, // PRESSURE_POINT
  [TechniqueId.JEONGBO_PRECISION_TAKEDOWN]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT
  [TechniqueId.JEONGBO_INTELLIGENCE_STRIKE]: AnimationType.PRESSURE_POINT_STRIKE, // PRESSURE_POINT

  // 조직폭력배 (Jojik) - Organized Crime
  [TechniqueId.JOJIK_STREET_BRAWL]: AnimationType.HOOK, // PUNCH_MID → brawling
  [TechniqueId.JOJIK_IMPROVISED_WEAPON]: AnimationType.HAMMER_FIST, // ELBOW_STRIKE variant
  [TechniqueId.JOJIK_RUTHLESS_ASSAULT]: AnimationType.CROSS, // PUNCH_HIGH → brutal
  [TechniqueId.JOJIK_BRUTAL_TAKEDOWN]: AnimationType.ELBOW_STRIKE, // ELBOW_STRIKE → takedown
};

/**
 * Get AnimationType for a given technique ID
 *
 * @param techniqueId - The technique ID
 * @returns The AnimationType for movement physics, or undefined if not found
 * @korean 기술ID로애니메이션타입가져오기
 */
export function getAnimationTypeForTechnique(
  techniqueId: string
): AnimationType | undefined {
  return TECHNIQUE_TO_ANIMATION_TYPE[techniqueId as TechniqueId];
}

/**
 * Get AnimationType from AttackAnimationType
 *
 * @param attackAnimationType - The attack animation type from technique definition
 * @returns The AnimationType for movement physics
 * @korean 공격애니메이션타입에서애니메이션타입가져오기
 */
export function getAnimationTypeFromAttackAnimation(
  attackAnimationType: AttackAnimationType
): AnimationType {
  return ATTACK_ANIMATION_TO_MOVEMENT_TYPE[attackAnimationType];
}

export default {
  TECHNIQUE_TO_ANIMATION_TYPE,
  ATTACK_ANIMATION_TO_MOVEMENT_TYPE,
  getAnimationTypeForTechnique,
  getAnimationTypeFromAttackAnimation,
};
