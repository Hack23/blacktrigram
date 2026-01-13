/**
 * Trigram Stance Animation Mapping System
 *
 * Provides automated mapping between TrigramStance enum values and their corresponding
 * guard poses and technique animations. This integration layer connects the Eight Trigram
 * philosophy (팔괘) with the combat animation system.
 *
 * **Korean Context:**
 * - **자세 가드 자세 (Jase Guard Jase)**: Guard positions for each trigram
 * - **팔괘 기술 (Palgwae Gisul)**: Eight trigram techniques
 * - **자동 매핑 (Jadong Maeping)**: Automatic mapping system
 *
 * ## Architecture
 *
 * This module provides:
 * 1. `TRIGRAM_GUARD_POSE_MAP` - Direct TrigramStance → GuardPose mapping
 * 2. `TRIGRAM_TECHNIQUE_ANIMATIONS_MAP` - TrigramStance → TechniqueAnimations[] mapping
 * 3. Accessor functions for type-safe animation retrieval
 *
 * ## Usage Example
 *
 * ```typescript
 * import { getGuardPoseByStance, getTechniqueAnimationsByStance } from './TrigramStanceAnimationMap';
 *
 * // Get guard pose for Heaven stance
 * const geonGuard = getGuardPoseByStance(TrigramStance.GEON);
 *
 * // Get all technique animations for Heaven stance
 * const geonTechniques = getTechniqueAnimationsByStance(TrigramStance.GEON);
 * // Returns: [GEON_HEAVEN_STRIKE, GEON_HEAVENLY_FIST, GEON_FRONTAL_KICK, ...]
 * ```
 *
 * @module systems/animation/TrigramStanceAnimationMap
 * @category Animation
 * @korean 팔괘자세애니메이션맵
 */

import { TrigramStance } from "../../types/common";
import type { SkeletalAnimation, StanceGuardPose } from "../../types/skeletal";
import { STANCE_GUARD_CONFIGS } from "./StanceGuardPoses";
import {
  // Geon (건) - Heaven
  GEON_HEAVEN_STRIKE_ANIMATION,
  GEON_HEAVENLY_FIST_ANIMATION,
  GEON_FRONTAL_KICK_ANIMATION,
  GEON_ROUNDHOUSE_ANIMATION,
  GEON_AXE_KICK_ANIMATION,
  GEON_PALM_STRIKE_ANIMATION,
  GEON_ELBOW_SMASH_ANIMATION,
  // Tae (태) - Lake
  TAE_FLOWING_STRIKES_ANIMATION,
  TAE_WRIST_LOCK_ANIMATION,
  TAE_SMALL_CIRCLE_ANIMATION,
  TAE_FINGER_LOCK_ANIMATION,
  TAE_ELBOW_LOCK_ANIMATION,
  TAE_SHOULDER_LOCK_ANIMATION,
  TAE_ARM_BAR_ANIMATION,
  // Li (리) - Fire
  LI_FLAME_SPEAR_ANIMATION,
  LI_TEMPLE_STRIKE_ANIMATION,
  LI_NERVE_STRIKE_ANIMATION,
  LI_SIDEKICK_ANIMATION,
  LI_PRESSURE_POINT_ANIMATION,
  LI_SOLAR_PLEXUS_ANIMATION,
  // Jin (진) - Thunder
  JIN_LIGHTNING_FLASH_ANIMATION,
  JIN_JUMPING_FRONT_KICK_ANIMATION,
  JIN_TORNADO_KICK_ANIMATION,
  JIN_FLYING_SIDEKICK_ANIMATION,
  JIN_BACK_KICK_ANIMATION,
  JIN_KNEE_STRIKE_ANIMATION,
  // Son (손) - Wind
  SON_WHIRLWIND_BARRAGE_ANIMATION,
  SON_SWEEPING_LOW_KICK_ANIMATION,
  SON_RHYTHMIC_STRIKES_ANIMATION,
  SON_FLOWING_PUSH_ANIMATION,
  SON_SPINNING_ELBOW_ANIMATION,
  SON_RAPID_FOOTWORK_ANIMATION,
  // Gam (감) - Water
  GAM_WATER_COUNTER_ANIMATION,
  GAM_REDIRECT_THROW_ANIMATION,
  GAM_FLOWING_BLOCK_ANIMATION,
  GAM_CIRCULAR_PARRY_ANIMATION,
  GAM_HIP_THROW_ANIMATION,
  GAM_WRIST_TWIST_COUNTER_ANIMATION,
  // Gan (간) - Mountain
  GAN_ROCK_DEFENSE_ANIMATION,
  GAN_IMMOVABLE_STANCE_ANIMATION,
  GAN_IRON_BLOCK_ANIMATION,
  GAN_COUNTER_STRIKE_ANIMATION,
  GAN_MOUNTAIN_STANCE_LOCK_ANIMATION,
  GAN_REVERSAL_TECHNIQUE_ANIMATION,
  // Gon (곤) - Earth
  GON_EARTH_EMBRACE_ANIMATION,
  GON_LEG_SWEEP_ANIMATION,
  GON_SSIREUM_THROW_ANIMATION,
  GON_GROUND_POUND_ANIMATION,
  GON_ANKLE_PICK_ANIMATION,
  GON_BODY_LOCK_TAKEDOWN_ANIMATION,
  GON_SACRIFICE_THROW_ANIMATION,
} from "./StanceAnimations";

/**
 * Trigram Guard Pose Map
 *
 * **Korean**: 팔괘 자세 방어 포즈 맵
 *
 * Direct mapping from TrigramStance enum to StanceGuardPose configurations.
 * Provides O(1) lookup time for guard pose retrieval by stance.
 *
 * This map is constructed from the existing `STANCE_GUARD_CONFIGS` Record,
 * extracting only the guard pose for each stance.
 *
 * @example
 * ```typescript
 * const geonGuard = TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.GEON);
 * // Returns: GEON_HIGH_GUARD_POSE
 * ```
 *
 * @constant
 * @korean 팔괘방어포즈맵
 */
export const TRIGRAM_GUARD_POSE_MAP: Map<TrigramStance, StanceGuardPose> =
  new Map([
    [TrigramStance.GEON, STANCE_GUARD_CONFIGS[TrigramStance.GEON].guardPose],
    [TrigramStance.TAE, STANCE_GUARD_CONFIGS[TrigramStance.TAE].guardPose],
    [TrigramStance.LI, STANCE_GUARD_CONFIGS[TrigramStance.LI].guardPose],
    [TrigramStance.JIN, STANCE_GUARD_CONFIGS[TrigramStance.JIN].guardPose],
    [TrigramStance.SON, STANCE_GUARD_CONFIGS[TrigramStance.SON].guardPose],
    [TrigramStance.GAM, STANCE_GUARD_CONFIGS[TrigramStance.GAM].guardPose],
    [TrigramStance.GAN, STANCE_GUARD_CONFIGS[TrigramStance.GAN].guardPose],
    [TrigramStance.GON, STANCE_GUARD_CONFIGS[TrigramStance.GON].guardPose],
  ]);

/**
 * Trigram Technique Animations Map
 *
 * **Korean**: 팔괘 기술 애니메이션 맵
 *
 * Mapping from TrigramStance enum to arrays of technique animations specific to that stance.
 * Groups all combat techniques by their corresponding trigram stance for easy retrieval.
 *
 * Each stance has 6-7 unique technique animations representing its combat philosophy:
 * - **☰ 건 (Geon/Heaven)**: 7 direct force techniques
 * - **☱ 태 (Tae/Lake)**: 7 joint manipulation techniques
 * - **☲ 리 (Li/Fire)**: 6 precision nerve strike techniques
 * - **☳ 진 (Jin/Thunder)**: 6 explosive power techniques
 * - **☴ 손 (Son/Wind)**: 6 continuous pressure techniques
 * - **☵ 감 (Gam/Water)**: 6 flow and counter techniques
 * - **☶ 간 (Gan/Mountain)**: 6 defensive mastery techniques
 * - **☷ 곤 (Gon/Earth)**: 7 grounding and takedown techniques
 *
 * @example
 * ```typescript
 * const geonTechniques = TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.GEON);
 * // Returns array of 7 Heaven stance techniques
 * ```
 *
 * @constant
 * @korean 팔괘기술애니메이션맵
 */
export const TRIGRAM_TECHNIQUE_ANIMATIONS_MAP: Map<
  TrigramStance,
  readonly SkeletalAnimation[]
> = new Map([
  [
    TrigramStance.GEON,
    [
      GEON_HEAVEN_STRIKE_ANIMATION,
      GEON_HEAVENLY_FIST_ANIMATION,
      GEON_FRONTAL_KICK_ANIMATION,
      GEON_ROUNDHOUSE_ANIMATION,
      GEON_AXE_KICK_ANIMATION,
      GEON_PALM_STRIKE_ANIMATION,
      GEON_ELBOW_SMASH_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.TAE,
    [
      TAE_FLOWING_STRIKES_ANIMATION,
      TAE_WRIST_LOCK_ANIMATION,
      TAE_SMALL_CIRCLE_ANIMATION,
      TAE_FINGER_LOCK_ANIMATION,
      TAE_ELBOW_LOCK_ANIMATION,
      TAE_SHOULDER_LOCK_ANIMATION,
      TAE_ARM_BAR_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.LI,
    [
      LI_FLAME_SPEAR_ANIMATION,
      LI_TEMPLE_STRIKE_ANIMATION,
      LI_NERVE_STRIKE_ANIMATION,
      LI_SIDEKICK_ANIMATION,
      LI_PRESSURE_POINT_ANIMATION,
      LI_SOLAR_PLEXUS_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.JIN,
    [
      JIN_LIGHTNING_FLASH_ANIMATION,
      JIN_JUMPING_FRONT_KICK_ANIMATION,
      JIN_TORNADO_KICK_ANIMATION,
      JIN_FLYING_SIDEKICK_ANIMATION,
      JIN_BACK_KICK_ANIMATION,
      JIN_KNEE_STRIKE_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.SON,
    [
      SON_WHIRLWIND_BARRAGE_ANIMATION,
      SON_SWEEPING_LOW_KICK_ANIMATION,
      SON_RHYTHMIC_STRIKES_ANIMATION,
      SON_FLOWING_PUSH_ANIMATION,
      SON_SPINNING_ELBOW_ANIMATION,
      SON_RAPID_FOOTWORK_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.GAM,
    [
      GAM_WATER_COUNTER_ANIMATION,
      GAM_REDIRECT_THROW_ANIMATION,
      GAM_FLOWING_BLOCK_ANIMATION,
      GAM_CIRCULAR_PARRY_ANIMATION,
      GAM_HIP_THROW_ANIMATION,
      GAM_WRIST_TWIST_COUNTER_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.GAN,
    [
      GAN_ROCK_DEFENSE_ANIMATION,
      GAN_IMMOVABLE_STANCE_ANIMATION,
      GAN_IRON_BLOCK_ANIMATION,
      GAN_COUNTER_STRIKE_ANIMATION,
      GAN_MOUNTAIN_STANCE_LOCK_ANIMATION,
      GAN_REVERSAL_TECHNIQUE_ANIMATION,
    ] as const,
  ],
  [
    TrigramStance.GON,
    [
      GON_EARTH_EMBRACE_ANIMATION,
      GON_LEG_SWEEP_ANIMATION,
      GON_SSIREUM_THROW_ANIMATION,
      GON_GROUND_POUND_ANIMATION,
      GON_ANKLE_PICK_ANIMATION,
      GON_BODY_LOCK_TAKEDOWN_ANIMATION,
      GON_SACRIFICE_THROW_ANIMATION,
    ] as const,
  ],
]);

/**
 * Get Guard Pose by Trigram Stance
 *
 * **Korean**: 팔괘 자세로 방어 포즈 가져오기
 *
 * Retrieves the guard pose configuration for a given trigram stance.
 * Returns undefined if the stance is not found.
 *
 * This function provides type-safe access to guard poses with O(1) lookup time.
 *
 * @param stance - Trigram stance enum value
 * @returns Guard pose configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const geonGuard = getGuardPoseByStance(TrigramStance.GEON);
 * if (geonGuard) {
 *   // Apply guard pose to skeletal rig
 *   applyGuardPose(rig, geonGuard);
 * }
 * ```
 *
 * @public
 * @korean 팔괘자세로방어포즈가져오기
 */
export function getGuardPoseByStance(
  stance: TrigramStance
): StanceGuardPose | undefined {
  return TRIGRAM_GUARD_POSE_MAP.get(stance);
}

/**
 * Get Technique Animations by Trigram Stance
 *
 * **Korean**: 팔괘 자세로 기술 애니메이션 가져오기
 *
 * Retrieves all technique animations for a given trigram stance.
 * Returns an empty array if the stance is not found.
 *
 * Each stance has 6-7 unique technique animations representing its combat philosophy.
 * The returned array is readonly to prevent accidental modification.
 *
 * @param stance - Trigram stance enum value
 * @returns Array of technique animations for the stance, or empty array if not found
 *
 * @example
 * ```typescript
 * const geonTechniques = getTechniqueAnimationsByStance(TrigramStance.GEON);
 * console.log(`Heaven stance has ${geonTechniques.length} techniques`);
 * // Outputs: "Heaven stance has 7 techniques"
 *
 * // Use in combat system
 * const randomTechnique = geonTechniques[Math.floor(Math.random() * geonTechniques.length)];
 * playAnimation(randomTechnique);
 * ```
 *
 * @public
 * @korean 팔괘자세로기술애니메이션가져오기
 */
export function getTechniqueAnimationsByStance(
  stance: TrigramStance
): readonly SkeletalAnimation[] {
  return TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(stance) ?? [];
}

/**
 * Get All Technique Animation Names by Stance
 *
 * **Korean**: 자세별 모든 기술 애니메이션 이름 가져오기
 *
 * Retrieves the names of all technique animations for a given stance.
 * Useful for debugging, UI display, and logging purposes.
 *
 * @param stance - Trigram stance enum value
 * @returns Array of animation names, or empty array if not found
 *
 * @example
 * ```typescript
 * const geonTechniqueNames = getTechniqueAnimationNamesByStance(TrigramStance.GEON);
 * // Returns: ["geon_heaven_strike", "geon_heavenly_fist", "geon_frontal_kick", ...]
 * ```
 *
 * @public
 * @korean 자세별모든기술애니메이션이름가져오기
 */
export function getTechniqueAnimationNamesByStance(
  stance: TrigramStance
): readonly string[] {
  const animations = getTechniqueAnimationsByStance(stance);
  return animations.map((anim) => anim.name);
}

/**
 * Get Total Technique Count by Stance
 *
 * **Korean**: 자세별 총 기술 수 가져오기
 *
 * Returns the total number of technique animations available for a given stance.
 * Quick way to check technique availability without retrieving all animations.
 *
 * @param stance - Trigram stance enum value
 * @returns Number of techniques for the stance (0 if not found)
 *
 * @example
 * ```typescript
 * const geonTechniqueCount = getTechniqueCountByStance(TrigramStance.GEON);
 * // Returns: 7
 * ```
 *
 * @public
 * @korean 자세별총기술수가져오기
 */
export function getTechniqueCountByStance(stance: TrigramStance): number {
  return getTechniqueAnimationsByStance(stance).length;
}

/**
 * Check if Stance Has Guard Pose
 *
 * **Korean**: 자세에 방어 포즈가 있는지 확인
 *
 * Checks whether a guard pose is defined for the given stance.
 * All eight trigram stances should have guard poses, but this provides
 * defensive validation.
 *
 * @param stance - Trigram stance enum value
 * @returns True if guard pose exists, false otherwise
 *
 * @example
 * ```typescript
 * if (hasGuardPose(TrigramStance.GEON)) {
 *   const guard = getGuardPoseByStance(TrigramStance.GEON);
 *   // Safe to use guard
 * }
 * ```
 *
 * @public
 * @korean 자세에방어포즈가있는지확인
 */
export function hasGuardPose(stance: TrigramStance): boolean {
  return TRIGRAM_GUARD_POSE_MAP.has(stance);
}

/**
 * Check if Stance Has Technique Animations
 *
 * **Korean**: 자세에 기술 애니메이션이 있는지 확인
 *
 * Checks whether technique animations are defined for the given stance.
 * All eight trigram stances should have techniques, but this provides
 * defensive validation.
 *
 * @param stance - Trigram stance enum value
 * @returns True if techniques exist, false otherwise
 *
 * @example
 * ```typescript
 * if (hasTechniqueAnimations(TrigramStance.GEON)) {
 *   const techniques = getTechniqueAnimationsByStance(TrigramStance.GEON);
 *   // Safe to use techniques
 * }
 * ```
 *
 * @public
 * @korean 자세에기술애니메이션이있는지확인
 */
export function hasTechniqueAnimations(stance: TrigramStance): boolean {
  const techniques = TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(stance);
  return techniques !== undefined && techniques.length > 0;
}
