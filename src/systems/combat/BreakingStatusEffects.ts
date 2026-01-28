/**
 * Breaking Technique Status Effect Constants
 *
 * **Korean**: 파쇄기술 상태효과 상수
 *
 * Defines status effect IDs used by the limb exposure and breaking technique system.
 * These effects are applied when joints/bones are broken during counter-attacks.
 *
 * @module systems/combat/BreakingStatusEffects
 * @korean 파쇄상태효과
 */

/**
 * Status effect IDs for breaking techniques.
 *
 * These IDs are used when creating StatusEffect objects after successful
 * breaking technique execution. Each ID should eventually have a corresponding
 * StatusEffect implementation in the game's effect system.
 *
 * **Korean**: 파쇄 상태효과 ID
 *
 * @public
 * @korean 파쇄상태효과ID
 */
export const BREAKING_STATUS_EFFECT_IDS = {
  /**
   * General pain effect applied on all successful breaks.
   * Maps to existing VitalPointEffectType.PAIN.
   * @korean 고통
   */
  PAIN: "pain" as const,

  /**
   * Severe injury from high-severity breaks (severity > 0.8).
   * Indicates major trauma requiring immediate attention.
   * @korean 심각한부상
   */
  SEVERE_INJURY: "severe_injury" as const,

  /**
   * Limb is completely disabled and cannot be used.
   * Applied to broken joints/bones preventing limb function.
   * @korean 사지불능
   */
  DISABLED_LIMB: "disabled_limb" as const,

  /**
   * Moderate limb injury (severity 0.5-0.8).
   * Limb can be used but with reduced effectiveness.
   * @korean 사지부상
   */
  INJURED_LIMB: "injured_limb" as const,

  /**
   * Minor joint sprain or strain (severity < 0.5).
   * Causes discomfort but doesn't prevent use.
   * @korean 관절염좌
   */
  SPRAINED_JOINT: "sprained_joint" as const,

  /**
   * Movement speed reduction from leg/ankle breaks.
   * Applied when ankle or knee is broken.
   * @korean 이동력감소
   */
  IMPAIRED_MOBILITY: "impaired_mobility" as const,

  /**
   * Bleeding from severe bone breaks (severity > 0.6).
   * Causes continuous health drain.
   * @korean 출혈
   */
  BLEEDING: "bleeding" as const,
} as const;

/**
 * Type representing valid breaking status effect IDs.
 * Use this type when referencing breaking effect IDs to ensure type safety.
 *
 * @public
 * @korean 파쇄상태효과ID타입
 */
export type BreakingStatusEffectId =
  (typeof BREAKING_STATUS_EFFECT_IDS)[keyof typeof BREAKING_STATUS_EFFECT_IDS];

/**
 * Helper function to validate if a string is a valid breaking status effect ID.
 *
 * @param id - The ID to validate
 * @returns true if the ID is a valid breaking status effect
 *
 * @public
 * @korean 파쇄상태효과ID검증
 */
export function isBreakingStatusEffectId(
  id: string
): id is BreakingStatusEffectId {
  return Object.values(BREAKING_STATUS_EFFECT_IDS).includes(
    id as BreakingStatusEffectId
  );
}

/**
 * Get all breaking status effect IDs as an array.
 *
 * @returns Array of all breaking status effect ID strings
 *
 * @public
 * @korean 모든파쇄상태효과ID
 */
export function getAllBreakingStatusEffectIds(): readonly string[] {
  return Object.values(BREAKING_STATUS_EFFECT_IDS);
}

export default BREAKING_STATUS_EFFECT_IDS;
