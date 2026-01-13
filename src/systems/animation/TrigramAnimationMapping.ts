/**
 * Trigram Animation Mapping
 *
 * Maps TrigramStance to stance-specific skeletal animations for punches, kicks, and strikes.
 * Provides intelligent lookup system for trigram-aware animation resolution.
 *
 * **Korean**: 팔괘 애니메이션 매핑 (Palgwae Animation Mapping)
 *
 * @module systems/animation/TrigramAnimationMapping
 * @category Animation
 * @korean 팔괘애니메이션매핑
 */

import { TrigramStance } from "../../types/common";
import type { SkeletalAnimation } from "../../types/skeletal";
import {
  GEON_BONE_BREAKING_STRIKE_1,
  GEON_THUNDEROUS_UPPERCUT,
  TAE_WRIST_LOCK_STRIKE,
  TAE_FLOWING_ARM_BAR,
  LI_BURNING_FINGER_STRIKE_1,
  LI_SOLAR_PLEXUS_SPEAR,
  JIN_LIGHTNING_STRAIGHT,
  JIN_SHOCKING_HAMMER_FIST,
  JIN_EXPLOSIVE_KNEE,
  SON_WHIRLWIND_COMBO_1,
  SON_PRESSURE_POINT_CHAIN,
  GAM_FLOWING_RIVER_STRIKE,
  GAM_TIDAL_WAVE_PALM,
  GAN_FORTRESS_COUNTER_STRIKE,
  GAN_AVALANCHE_HAMMER,
  GON_GROUND_SWEEP_STRIKE,
  GON_EARTHQUAKE_STOMP,
} from "./StanceAttackAnimations";
import {
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
} from "./KickAnimations";

/**
 * Animation set for a specific trigram stance.
 *
 * **Korean**: 자세 애니메이션 세트
 *
 * Contains punch, kick, and strike animations specific to a trigram stance.
 *
 * @public
 * @category Animation
 * @korean 자세애니메이션세트
 */
export interface StanceAnimationSet {
  /**
   * Punch animation for this stance
   * @korean 주먹기술
   */
  readonly punch: SkeletalAnimation;

  /**
   * Kick animation for this stance
   * @korean 발차기기술
   */
  readonly kick: SkeletalAnimation;

  /**
   * Strike animation for this stance (unique to stance philosophy)
   * @korean 타격기술
   */
  readonly strike: SkeletalAnimation;
}

/**
 * Master trigram animation mapping.
 *
 * **Korean**: 팔괘 애니메이션 맵
 *
 * Maps each of the 8 trigram stances to their specific animation sets.
 * Each stance has unique animations reflecting its philosophical nature
 * and combat characteristics.
 *
 * ## Stance Philosophy Integration
 *
 * - **☰ 건 (Geon/Heaven)**: Direct force, bone-breaking strikes
 * - **☱ 태 (Tae/Lake)**: Fluid joint manipulation and locks
 * - **☲ 리 (Li/Fire)**: Precise nerve and pressure point strikes
 * - **☳ 진 (Jin/Thunder)**: Explosive power techniques
 * - **☴ 손 (Son/Wind)**: Continuous pressure and rapid strikes
 * - **☵ 감 (Gam/Water)**: Adaptive counters and redirects
 * - **☶ 간 (Gan/Mountain)**: Defensive mastery and blocks
 * - **☷ 곤 (Gon/Earth)**: Grounding takedowns and throws
 *
 * @public
 * @category Animation
 * @korean 팔괘애니메이션맵
 */
export const TRIGRAM_ANIMATION_MAP: Record<TrigramStance, StanceAnimationSet> =
  {
    [TrigramStance.GEON]: {
      punch: GEON_BONE_BREAKING_STRIKE_1,
      kick: FRONT_KICK_ANIMATION,
      strike: GEON_THUNDEROUS_UPPERCUT,
    },
    [TrigramStance.TAE]: {
      punch: TAE_WRIST_LOCK_STRIKE,
      kick: ROUNDHOUSE_KICK_ANIMATION,
      strike: TAE_FLOWING_ARM_BAR,
    },
    [TrigramStance.LI]: {
      punch: LI_BURNING_FINGER_STRIKE_1,
      kick: SIDE_KICK_ANIMATION,
      strike: LI_SOLAR_PLEXUS_SPEAR,
    },
    [TrigramStance.JIN]: {
      punch: JIN_LIGHTNING_STRAIGHT,
      kick: JIN_EXPLOSIVE_KNEE,
      strike: JIN_SHOCKING_HAMMER_FIST,
    },
    [TrigramStance.SON]: {
      punch: SON_WHIRLWIND_COMBO_1,
      kick: FRONT_KICK_ANIMATION,
      strike: SON_PRESSURE_POINT_CHAIN,
    },
    [TrigramStance.GAM]: {
      punch: GAM_FLOWING_RIVER_STRIKE,
      kick: ROUNDHOUSE_KICK_ANIMATION,
      strike: GAM_TIDAL_WAVE_PALM,
    },
    [TrigramStance.GAN]: {
      punch: GAN_FORTRESS_COUNTER_STRIKE,
      kick: SIDE_KICK_ANIMATION,
      strike: GAN_AVALANCHE_HAMMER,
    },
    [TrigramStance.GON]: {
      punch: GON_GROUND_SWEEP_STRIKE,
      kick: FRONT_KICK_ANIMATION,
      strike: GON_EARTHQUAKE_STOMP,
    },
  };

/**
 * Get animation set for a specific trigram stance.
 *
 * **Korean**: 자세에 맞는 애니메이션 가져오기
 *
 * Returns the complete animation set (punch, kick, strike) for the given
 * trigram stance. Each animation reflects the philosophical nature and
 * combat characteristics of the stance.
 *
 * @param stance - Trigram stance to get animations for
 * @returns Animation set containing punch, kick, and strike animations
 *
 * @example
 * ```typescript
 * const geonAnims = getAnimationsForStance(TrigramStance.Geon);
 * console.log(geonAnims.punch.name); // "geon_bone_breaking_strike_1"
 * console.log(geonAnims.strike.name); // "geon_heaven_strike"
 * ```
 *
 * @public
 * @korean 자세애니메이션가져오기
 */
export function getAnimationsForStance(
  stance: TrigramStance
): StanceAnimationSet {
  return TRIGRAM_ANIMATION_MAP[stance];
}

/**
 * Get animation for a specific technique within a trigram stance.
 *
 * **Korean**: 자세 기술 애니메이션 가져오기
 *
 * @param stance - Trigram stance
 * @param technique - Technique type ("punch", "kick", "strike")
 * @returns Skeletal animation for the technique, or null if not found
 *
 * @example
 * ```typescript
 * const animation = getAnimationForTechnique(TrigramStance.Geon, "punch");
 * console.log(animation?.name); // "geon_bone_breaking_strike_1"
 * ```
 *
 * @public
 * @korean 자세기술애니메이션가져오기
 */
export function getAnimationForTechnique(
  stance: TrigramStance,
  technique: "punch" | "kick" | "strike"
): SkeletalAnimation | null {
  const animSet = TRIGRAM_ANIMATION_MAP[stance];
  if (!animSet) {
    return null;
  }

  switch (technique.toLowerCase()) {
    case "punch":
      return animSet.punch;
    case "kick":
      return animSet.kick;
    case "strike":
      return animSet.strike;
    default:
      return null;
  }
}

/**
 * Check if a technique is available for a stance.
 *
 * **Korean**: 자세 기술 가능 여부
 *
 * @param stance - Trigram stance
 * @param technique - Technique type
 * @returns True if technique is available for this stance
 *
 * @public
 * @korean 자세기술가능여부
 */
export function hasTechniqueAnimation(
  stance: TrigramStance,
  technique: "punch" | "kick" | "strike"
): boolean {
  return getAnimationForTechnique(stance, technique) !== null;
}
