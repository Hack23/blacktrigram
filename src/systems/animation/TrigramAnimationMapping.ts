/**
 * Trigram Animation Mapping with Laterality Support
 * 
 * **Korean**: 팔괘 애니메이션 매핑
 * 
 * Provides unified access to all stance-specific animations with full
 * laterality support. Wraps existing animation lookup functions and
 * applies laterality transformations on-demand.
 * 
 * Key Features:
 * - Support for `StanceWithSide` parameter (e.g., "geon_left", "tae_right")
 * - On-demand laterality transformation for optimal performance
 * - Unified API for guard poses, attacks, defensive moves, and locomotion
 * - Backward compatible with existing `TrigramStance` parameters
 * 
 * Usage Pattern:
 * ```typescript
 * // Using StanceWithSide (16 configurations)
 * const leftGeonAttacks = getAnimationsForStance("geon_left");
 * const rightTaeGuard = getGuardPoseForStanceWithSide("tae_right");
 * 
 * // Using TrigramStance (backward compatible)
 * const geonAttacks = getAnimationsForStance("geon"); // Defaults to right
 * ```
 * 
 * @module systems/animation/TrigramAnimationMapping
 * @category Animation
 * @korean 팔괘애니메이션매핑
 */

import type { TrigramStance } from "../../types/common";
import type { SkeletalAnimation, StanceGuardPose } from "../../types/skeletal";
import type { StanceWithSide, StanceLaterality } from "../trigram/types";
import { parseStanceWithSide } from "../trigram/types";
import { applyLaterality } from "./LateralityTransform";
import {
  getGuardPoseForStance,
  getAllStanceGuardPoses,
} from "./StanceGuardPoses";
import {
  getAttackAnimationsForStance,
  ATTACK_ANIMATIONS_BY_STANCE,
} from "./StanceAttackAnimations";
import {
  getDefensiveAnimationsForStance,
} from "./DefensiveAnimations";
import {
  getStanceWalkAnimation,
  getStanceRunAnimation,
} from "./StanceLocomotionAnimations";

/**
 * Animation collection for a stance configuration
 * 
 * **Korean**: 자세 애니메이션 모음
 * 
 * Contains all animation types for a specific stance with laterality.
 * 
 * @public
 * @category Animation Mapping
 * @korean 자세애니메이션모음
 */
export interface StanceAnimationCollection {
  /** Guard pose for idle stance */
  readonly guardPose: StanceGuardPose;
  /** Attack animations (3 per stance) */
  readonly attacks: readonly SkeletalAnimation[];
  /** Defensive animations (2 per stance) */
  readonly defensive: readonly SkeletalAnimation[];
  /** Walk animation */
  readonly walk: SkeletalAnimation;
  /** Run animation */
  readonly run: SkeletalAnimation;
}

/**
 * Get all animations for a stance with laterality support.
 * 
 * **Korean**: 자세 애니메이션 가져오기
 * 
 * Returns a complete collection of animations for the specified stance,
 * including guard pose, attacks, defensive moves, and locomotion.
 * 
 * Accepts either:
 * - `StanceWithSide` (e.g., "geon_left", "tae_right") - 16 configurations
 * - `TrigramStance` (e.g., "geon", "tae") - defaults to right laterality
 * 
 * Performance:
 * - Right laterality: Returns original animations (no transformation)
 * - Left laterality: Applies on-demand transformation (<1ms per animation)
 * 
 * @param stanceOrSide - Stance identifier with optional laterality
 * @param defaultLaterality - Default laterality if not specified (default: "right")
 * @returns Complete animation collection for the stance
 * 
 * @example
 * ```typescript
 * // With StanceWithSide
 * const leftGeon = getAnimationsForStance("geon_left");
 * // leftGeon.attacks are all left-handed versions
 * 
 * // With TrigramStance (defaults to right)
 * const geon = getAnimationsForStance("geon");
 * // geon.attacks are right-handed versions
 * 
 * // With explicit laterality
 * const tae = getAnimationsForStance("tae", "left");
 * // tae.attacks are left-handed versions
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 자세애니메이션가져오기
 */
export function getAnimationsForStance(
  stanceOrSide: TrigramStance | StanceWithSide,
  defaultLaterality: StanceLaterality = "right"
): StanceAnimationCollection | undefined {
  // Parse stance and laterality
  const parsed = parseStanceWithSide(stanceOrSide as string);
  
  let stance: TrigramStance;
  let laterality: StanceLaterality;
  
  if (parsed) {
    // StanceWithSide format
    stance = parsed.stance;
    laterality = parsed.laterality;
  } else {
    // Plain TrigramStance format
    stance = stanceOrSide as TrigramStance;
    laterality = defaultLaterality;
  }

  // Get guard pose (already supports laterality)
  const guardPose = getGuardPoseForStance(stance, laterality);
  if (!guardPose) {
    return undefined;
  }

  // Get base animations
  const baseAttacks = getAttackAnimationsForStance(stance);
  const baseDefensive = getDefensiveAnimationsForStance(stance);
  const baseWalk = getStanceWalkAnimation(stance);
  const baseRun = getStanceRunAnimation(stance);

  if (!baseWalk || !baseRun) {
    return undefined;
  }

  // Apply laterality transformation if needed
  const attacks = laterality === "right" 
    ? baseAttacks 
    : baseAttacks.map(anim => applyLaterality(anim, laterality));
  
  const defensive = laterality === "right"
    ? baseDefensive
    : baseDefensive.map(anim => applyLaterality(anim, laterality));
  
  const walk = laterality === "right" ? baseWalk : applyLaterality(baseWalk, laterality);
  const run = laterality === "right" ? baseRun : applyLaterality(baseRun, laterality);

  return {
    guardPose,
    attacks,
    defensive,
    walk,
    run,
  };
}

/**
 * Get guard pose for a stance with StanceWithSide support.
 * 
 * **Korean**: 자세 방어 포즈 가져오기 (측면 지원)
 * 
 * Convenience wrapper around `getGuardPoseForStance()` that accepts
 * `StanceWithSide` strings directly.
 * 
 * @param stanceOrSide - Stance identifier with optional laterality
 * @param defaultLaterality - Default laterality if not specified (default: "right")
 * @returns Guard pose or undefined if not found
 * 
 * @example
 * ```typescript
 * const leftGeon = getGuardPoseForStanceWithSide("geon_left");
 * const rightTae = getGuardPoseForStanceWithSide("tae_right");
 * const gan = getGuardPoseForStanceWithSide("gan"); // Defaults to right
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 자세방어포즈가져오기
 */
export function getGuardPoseForStanceWithSide(
  stanceOrSide: TrigramStance | StanceWithSide,
  defaultLaterality: StanceLaterality = "right"
): StanceGuardPose | undefined {
  const parsed = parseStanceWithSide(stanceOrSide as string);
  
  if (parsed) {
    return getGuardPoseForStance(parsed.stance, parsed.laterality);
  } else {
    return getGuardPoseForStance(stanceOrSide as TrigramStance, defaultLaterality);
  }
}

/**
 * Get all 16 stance guard poses mapped by StanceWithSide key.
 * 
 * **Korean**: 모든 자세 방어 포즈 (16개)
 * 
 * Returns a map of all possible stance+laterality combinations.
 * This is a cached operation - subsequent calls return the same Map instance.
 * 
 * Map keys: `"stance_laterality"` (e.g., "geon_left", "tae_right")
 * 
 * @returns Map of all 16 guard pose configurations
 * 
 * @example
 * ```typescript
 * const allPoses = getAllGuardPoses();
 * const leftGeon = allPoses.get("geon_left");
 * const rightTae = allPoses.get("tae_right");
 * 
 * console.log(allPoses.size); // 16 (8 stances × 2 laterality)
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 모든방어포즈가져오기
 */
export function getAllGuardPoses(): Map<string, StanceGuardPose> {
  return getAllStanceGuardPoses();
}

/**
 * Get attack animations for a stance with laterality support.
 * 
 * **Korean**: 자세 공격 애니메이션 가져오기
 * 
 * Returns all attack animations (3 per stance) with optional laterality
 * transformation applied.
 * 
 * @param stanceOrSide - Stance identifier with optional laterality
 * @param defaultLaterality - Default laterality if not specified (default: "right")
 * @returns Array of attack animations (3 per stance)
 * 
 * @example
 * ```typescript
 * const leftGeonAttacks = getAttackAnimations("geon_left");
 * // Returns 3 left-handed Heaven stance attacks
 * 
 * const taeAttacks = getAttackAnimations("tae");
 * // Returns 3 right-handed Lake stance attacks (default)
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 공격애니메이션가져오기
 */
export function getAttackAnimations(
  stanceOrSide: TrigramStance | StanceWithSide,
  defaultLaterality: StanceLaterality = "right"
): readonly SkeletalAnimation[] {
  const parsed = parseStanceWithSide(stanceOrSide as string);
  
  let stance: TrigramStance;
  let laterality: StanceLaterality;
  
  if (parsed) {
    stance = parsed.stance;
    laterality = parsed.laterality;
  } else {
    stance = stanceOrSide as TrigramStance;
    laterality = defaultLaterality;
  }

  const baseAnimations = getAttackAnimationsForStance(stance);
  
  return laterality === "right"
    ? baseAnimations
    : baseAnimations.map(anim => applyLaterality(anim, laterality));
}

/**
 * Get defensive animations for a stance with laterality support.
 * 
 * **Korean**: 자세 방어 애니메이션 가져오기
 * 
 * Returns all defensive animations (2 per stance) with optional laterality
 * transformation applied.
 * 
 * @param stanceOrSide - Stance identifier with optional laterality
 * @param defaultLaterality - Default laterality if not specified (default: "right")
 * @returns Array of defensive animations (2 per stance)
 * 
 * @example
 * ```typescript
 * const leftGamDefense = getDefensiveAnimations("gam_left");
 * // Returns 2 left-handed Water stance defensive moves
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 방어애니메이션가져오기
 */
export function getDefensiveAnimations(
  stanceOrSide: TrigramStance | StanceWithSide,
  defaultLaterality: StanceLaterality = "right"
): readonly SkeletalAnimation[] {
  const parsed = parseStanceWithSide(stanceOrSide as string);
  
  let stance: TrigramStance;
  let laterality: StanceLaterality;
  
  if (parsed) {
    stance = parsed.stance;
    laterality = parsed.laterality;
  } else {
    stance = stanceOrSide as TrigramStance;
    laterality = defaultLaterality;
  }

  const baseAnimations = getDefensiveAnimationsForStance(stance);
  
  return laterality === "right"
    ? baseAnimations
    : baseAnimations.map(anim => applyLaterality(anim, laterality));
}

/**
 * Get walk animation for a stance with laterality support.
 * 
 * **Korean**: 자세 걷기 애니메이션 가져오기
 * 
 * Returns the walk animation for the specified stance with optional
 * laterality transformation applied.
 * 
 * @param stanceOrSide - Stance identifier with optional laterality
 * @param defaultLaterality - Default laterality if not specified (default: "right")
 * @returns Walk animation or undefined if not found
 * 
 * @example
 * ```typescript
 * const leftGeonWalk = getWalkAnimation("geon_left");
 * const taeWalk = getWalkAnimation("tae"); // Defaults to right
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 걷기애니메이션가져오기
 */
export function getWalkAnimation(
  stanceOrSide: TrigramStance | StanceWithSide,
  defaultLaterality: StanceLaterality = "right"
): SkeletalAnimation | undefined {
  const parsed = parseStanceWithSide(stanceOrSide as string);
  
  let stance: TrigramStance;
  let laterality: StanceLaterality;
  
  if (parsed) {
    stance = parsed.stance;
    laterality = parsed.laterality;
  } else {
    stance = stanceOrSide as TrigramStance;
    laterality = defaultLaterality;
  }

  const baseAnimation = getStanceWalkAnimation(stance);
  
  return baseAnimation ? applyLaterality(baseAnimation, laterality) : undefined;
}

/**
 * Get run animation for a stance with laterality support.
 * 
 * **Korean**: 자세 달리기 애니메이션 가져오기
 * 
 * Returns the run animation for the specified stance with optional
 * laterality transformation applied.
 * 
 * @param stanceOrSide - Stance identifier with optional laterality
 * @param defaultLaterality - Default laterality if not specified (default: "right")
 * @returns Run animation or undefined if not found
 * 
 * @example
 * ```typescript
 * const leftSonRun = getRunAnimation("son_left");
 * const ganRun = getRunAnimation("gan"); // Defaults to right
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 달리기애니메이션가져오기
 */
export function getRunAnimation(
  stanceOrSide: TrigramStance | StanceWithSide,
  defaultLaterality: StanceLaterality = "right"
): SkeletalAnimation | undefined {
  const parsed = parseStanceWithSide(stanceOrSide as string);
  
  let stance: TrigramStance;
  let laterality: StanceLaterality;
  
  if (parsed) {
    stance = parsed.stance;
    laterality = parsed.laterality;
  } else {
    stance = stanceOrSide as TrigramStance;
    laterality = defaultLaterality;
  }

  const baseAnimation = getStanceRunAnimation(stance);
  
  return baseAnimation ? applyLaterality(baseAnimation, laterality) : undefined;
}

/**
 * Mapping statistics for all stance animations
 * 
 * **Korean**: 매핑 통계
 * 
 * @public
 * @category Animation Mapping
 * @korean 매핑통계
 */
export interface AnimationMappingStats {
  /** Total stance configurations (should be 16: 8 stances × 2 laterality) */
  readonly totalConfigurations: number;
  /** Stances with complete mappings */
  readonly completeMappings: number;
  /** Attack animations per stance */
  readonly attacksPerStance: number;
  /** Defensive animations per stance */
  readonly defensivePerStance: number;
  /** Total attack animations (completeMappings × attacksPerStance × 2 laterality) */
  readonly totalAttacks: number;
  /** Total defensive animations (completeMappings × defensivePerStance × 2 laterality) */
  readonly totalDefensive: number;
}

/**
 * Get statistics about animation mapping coverage.
 * 
 * **Korean**: 매핑 통계 가져오기
 * 
 * Returns coverage statistics for the animation mapping system,
 * useful for validation and testing.
 * 
 * @returns Mapping statistics
 * 
 * @example
 * ```typescript
 * const stats = getAnimationMappingStats();
 * console.log(`Total configurations: ${stats.totalConfigurations}`); // 16
 * console.log(`Total attacks: ${stats.totalAttacks}`); // 8 × 3 × 2 = 48
 * ```
 * 
 * @public
 * @category Animation Mapping
 * @korean 매핑통계가져오기
 */
export function getAnimationMappingStats(): AnimationMappingStats {
  const stanceCount = ATTACK_ANIMATIONS_BY_STANCE.size;
  const attacksPerStance = 3; // Each stance has 3 attack variants
  const defensivePerStance = 2; // Each stance has 2 defensive variants
  
  return {
    totalConfigurations: stanceCount * 2, // × 2 for left/right laterality
    completeMappings: stanceCount,
    attacksPerStance,
    defensivePerStance,
    totalAttacks: stanceCount * attacksPerStance * 2, // × 2 for laterality
    totalDefensive: stanceCount * defensivePerStance * 2, // × 2 for laterality
  };
}
