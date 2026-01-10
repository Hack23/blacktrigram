/**
 * Technique Animation Mapping
 *
 * Maps technique IDs directly to animation types for reliable lookup.
 * This file is the source of truth for technique-to-animation relationships.
 *
 * 기술과 애니메이션의 직접 매핑
 * 기술 ID에서 애니메이션 타입으로의 확실한 조회를 위한 매핑 파일
 *
 * @module systems/animation/TechniqueAnimationMapping
 * @korean 기술애니메이션매핑
 */

import { AnimationType } from "./MartialArtsAnimationBuilder";

/**
 * Speed modifier for animation playback
 * Higher values = faster animation
 */
export interface AnimationConfig {
  readonly type: AnimationType;
  readonly speed: number;
}

/**
 * Default animation configurations by type
 */
const DEFAULT_CONFIGS: Record<AnimationType, AnimationConfig> = {
  // Kicks (발차기)
  [AnimationType.FRONT_KICK]: { type: AnimationType.FRONT_KICK, speed: 1.0 },
  [AnimationType.ROUNDHOUSE_KICK]: {
    type: AnimationType.ROUNDHOUSE_KICK,
    speed: 1.0,
  },
  [AnimationType.SIDE_KICK]: { type: AnimationType.SIDE_KICK, speed: 1.0 },
  [AnimationType.AXE_KICK]: { type: AnimationType.AXE_KICK, speed: 0.9 },
  [AnimationType.BACK_KICK]: { type: AnimationType.BACK_KICK, speed: 1.0 },
  [AnimationType.TORNADO_KICK]: {
    type: AnimationType.TORNADO_KICK,
    speed: 1.1,
  },
  [AnimationType.JUMPING_KICK]: {
    type: AnimationType.JUMPING_KICK,
    speed: 1.0,
  },

  // Punches (주먹)
  [AnimationType.JAB]: { type: AnimationType.JAB, speed: 1.2 },
  [AnimationType.CROSS]: { type: AnimationType.CROSS, speed: 1.1 },
  [AnimationType.PALM_STRIKE]: { type: AnimationType.PALM_STRIKE, speed: 1.0 },

  // Elbow/Knee (팔꿈치/무릎)
  [AnimationType.ELBOW_STRIKE]: {
    type: AnimationType.ELBOW_STRIKE,
    speed: 1.1,
  },
  [AnimationType.ELBOW_UPPERCUT]: {
    type: AnimationType.ELBOW_UPPERCUT,
    speed: 1.0,
  },
  [AnimationType.KNEE_STRIKE]: { type: AnimationType.KNEE_STRIKE, speed: 1.0 },

  // Grappling (잡기)
  [AnimationType.THROW]: { type: AnimationType.THROW, speed: 0.9 },
  [AnimationType.GRAPPLE]: { type: AnimationType.GRAPPLE, speed: 0.85 },
  [AnimationType.SWEEP]: { type: AnimationType.SWEEP, speed: 1.0 },
  [AnimationType.COUNTER_ATTACK]: {
    type: AnimationType.COUNTER_ATTACK,
    speed: 1.1,
  },

  // Defense (방어)
  [AnimationType.BLOCK]: { type: AnimationType.BLOCK, speed: 1.0 },

  // Movement (이동)
  [AnimationType.WALK]: { type: AnimationType.WALK, speed: 1.0 },
  [AnimationType.IDLE_STANCE]: { type: AnimationType.IDLE_STANCE, speed: 1.0 },
  [AnimationType.FORWARD_DASH]: {
    type: AnimationType.FORWARD_DASH,
    speed: 1.2,
  },
  [AnimationType.BACKWARD_RETREAT]: {
    type: AnimationType.BACKWARD_RETREAT,
    speed: 1.0,
  },
  [AnimationType.SIDE_STEP]: { type: AnimationType.SIDE_STEP, speed: 1.1 },
};

/**
 * Master technique-to-animation mapping
 *
 * Maps each technique ID to its animation configuration.
 * This is the canonical source of truth for animation selection.
 *
 * 기술 ID별 애니메이션 설정 마스터 매핑
 *
 * @korean 기술애니메이션매핑
 */
export const TECHNIQUE_ANIMATIONS: ReadonlyMap<string, AnimationConfig> =
  new Map([
    // ═══════════════════════════════════════════════════════════════════════
    // ☰ GEON (건) - HEAVEN: Direct Force (태권도 타격)
    // ═══════════════════════════════════════════════════════════════════════
    ["geon_heaven_strike", { type: AnimationType.CROSS, speed: 1.0 }],
    ["geon_heavenly_fist", { type: AnimationType.JAB, speed: 1.1 }],
    ["geon_frontal_kick", { type: AnimationType.FRONT_KICK, speed: 1.0 }],
    [
      "geon_roundhouse_kick",
      { type: AnimationType.ROUNDHOUSE_KICK, speed: 1.0 },
    ],
    ["geon_axe_kick", { type: AnimationType.AXE_KICK, speed: 0.9 }],
    ["geon_palm_strike", { type: AnimationType.PALM_STRIKE, speed: 1.0 }],
    ["geon_elbow_smash", { type: AnimationType.ELBOW_STRIKE, speed: 1.1 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☱ TAE (태) - LAKE: Fluid Joint Manipulation (합기도)
    // ═══════════════════════════════════════════════════════════════════════
    ["tae_flowing_strikes", { type: AnimationType.CROSS, speed: 1.2 }],
    ["tae_wrist_lock", { type: AnimationType.GRAPPLE, speed: 0.85 }],
    ["tae_small_circle", { type: AnimationType.GRAPPLE, speed: 0.85 }],
    ["tae_finger_lock", { type: AnimationType.GRAPPLE, speed: 0.9 }],
    ["tae_elbow_lock", { type: AnimationType.GRAPPLE, speed: 0.8 }],
    ["tae_shoulder_lock", { type: AnimationType.GRAPPLE, speed: 0.8 }],
    ["tae_arm_bar", { type: AnimationType.GRAPPLE, speed: 0.75 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☲ LI (리) - FIRE: Precision Nerve Strikes (정밀 타격)
    // ═══════════════════════════════════════════════════════════════════════
    ["li_flame_spear", { type: AnimationType.JAB, speed: 1.3 }],
    ["li_temple_strike", { type: AnimationType.ELBOW_STRIKE, speed: 1.1 }],
    ["li_nerve_strike", { type: AnimationType.JAB, speed: 1.2 }],
    ["li_sidekick", { type: AnimationType.SIDE_KICK, speed: 1.0 }],
    ["li_pressure_point", { type: AnimationType.JAB, speed: 1.0 }],
    ["li_solar_plexus_strike", { type: AnimationType.PALM_STRIKE, speed: 1.1 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☳ JIN (진) - THUNDER: Explosive Power (폭발력)
    // ═══════════════════════════════════════════════════════════════════════
    ["jin_lightning_flash", { type: AnimationType.JAB, speed: 1.4 }],
    [
      "jin_jumping_front_kick",
      { type: AnimationType.JUMPING_KICK, speed: 1.0 },
    ],
    ["jin_tornado_kick", { type: AnimationType.TORNADO_KICK, speed: 1.0 }],
    ["jin_flying_sidekick", { type: AnimationType.JUMPING_KICK, speed: 1.1 }],
    ["jin_back_kick", { type: AnimationType.BACK_KICK, speed: 1.0 }],
    ["jin_knee_strike", { type: AnimationType.KNEE_STRIKE, speed: 1.1 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☴ SON (손) - WIND: Continuous Pressure (지속 공격)
    // ═══════════════════════════════════════════════════════════════════════
    ["son_whirlwind_barrage", { type: AnimationType.JAB, speed: 1.5 }],
    ["son_sweeping_low_kick", { type: AnimationType.SWEEP, speed: 1.0 }],
    ["son_rhythmic_strikes", { type: AnimationType.JAB, speed: 1.3 }],
    ["son_flowing_push", { type: AnimationType.PALM_STRIKE, speed: 1.1 }],
    ["son_spinning_elbow", { type: AnimationType.ELBOW_STRIKE, speed: 1.2 }],
    ["son_rapid_footwork", { type: AnimationType.SIDE_STEP, speed: 1.3 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☵ GAM (감) - WATER: Flow & Adaptation (유동 반격)
    // ═══════════════════════════════════════════════════════════════════════
    ["gam_water_counter", { type: AnimationType.COUNTER_ATTACK, speed: 1.0 }],
    ["gam_redirect_throw", { type: AnimationType.THROW, speed: 0.9 }],
    ["gam_flowing_block", { type: AnimationType.BLOCK, speed: 1.0 }],
    ["gam_circular_parry", { type: AnimationType.BLOCK, speed: 1.1 }],
    ["gam_hip_throw", { type: AnimationType.THROW, speed: 0.85 }],
    ["gam_wrist_twist_counter", { type: AnimationType.GRAPPLE, speed: 0.9 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☶ GAN (간) - MOUNTAIN: Defensive Mastery (방어 마스터리)
    // ═══════════════════════════════════════════════════════════════════════
    ["gan_rock_defense", { type: AnimationType.BLOCK, speed: 0.9 }],
    ["gan_immovable_stance", { type: AnimationType.IDLE_STANCE, speed: 0.8 }],
    ["gan_iron_block", { type: AnimationType.BLOCK, speed: 0.85 }],
    ["gan_counter_strike", { type: AnimationType.COUNTER_ATTACK, speed: 1.1 }],
    ["gan_mountain_stance_lock", { type: AnimationType.GRAPPLE, speed: 0.8 }],
    [
      "gan_reversal_technique",
      { type: AnimationType.COUNTER_ATTACK, speed: 1.0 },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // ☷ GON (곤) - EARTH: Grounding & Takedowns (넘어뜨리기)
    // ═══════════════════════════════════════════════════════════════════════
    ["gon_earth_embrace", { type: AnimationType.GRAPPLE, speed: 0.85 }],
    ["gon_leg_sweep", { type: AnimationType.SWEEP, speed: 1.0 }],
    ["gon_ssireum_throw", { type: AnimationType.THROW, speed: 0.9 }],
    ["gon_ground_pound", { type: AnimationType.JAB, speed: 1.0 }],
    ["gon_ankle_pick", { type: AnimationType.SWEEP, speed: 1.1 }],
    ["gon_body_lock_takedown", { type: AnimationType.THROW, speed: 0.85 }],
    ["gon_sacrifice_throw", { type: AnimationType.THROW, speed: 0.8 }],

    // ═══════════════════════════════════════════════════════════════════════
    // DARK OPS (암살자) - Lethal Techniques (치명 기술)
    // ═══════════════════════════════════════════════════════════════════════
    ["darkops_silent_carotid", { type: AnimationType.GRAPPLE, speed: 0.9 }],
    ["darkops_nerve_paralysis", { type: AnimationType.JAB, speed: 1.1 }],
    [
      "darkops_liver_disruption",
      { type: AnimationType.PALM_STRIKE, speed: 1.0 },
    ],
    ["darkops_kidney_strike", { type: AnimationType.KNEE_STRIKE, speed: 1.0 }],
    ["darkops_throat_strike", { type: AnimationType.JAB, speed: 1.2 }],
    [
      "darkops_solar_plexus_paralyze",
      { type: AnimationType.PALM_STRIKE, speed: 1.1 },
    ],
    [
      "darkops_brachial_plexus_strike",
      { type: AnimationType.ELBOW_STRIKE, speed: 1.1 },
    ],
    [
      "darkops_femoral_nerve_strike",
      { type: AnimationType.KNEE_STRIKE, speed: 1.0 },
    ],
    ["darkops_rear_choke", { type: AnimationType.GRAPPLE, speed: 0.8 }],
    ["darkops_spinal_strike", { type: AnimationType.ELBOW_STRIKE, speed: 1.0 }],
    [
      "darkops_jaw_dislocation",
      { type: AnimationType.ELBOW_UPPERCUT, speed: 1.0 },
    ],
    ["darkops_temple_strike", { type: AnimationType.ELBOW_STRIKE, speed: 1.1 }],
    ["darkops_achilles_sever", { type: AnimationType.SWEEP, speed: 1.2 }],
    ["darkops_ear_strike", { type: AnimationType.PALM_STRIKE, speed: 1.2 }],
    ["darkops_eye_gouge", { type: AnimationType.JAB, speed: 1.3 }],
  ]);

/**
 * Get animation configuration for a technique
 *
 * @param techniqueId - The technique identifier
 * @returns Animation configuration or undefined if not mapped
 *
 * @korean 기술별애니메이션설정조회
 */
export function getAnimationForTechnique(
  techniqueId: string
): AnimationConfig | undefined {
  return TECHNIQUE_ANIMATIONS.get(techniqueId);
}

/**
 * Get animation configuration with fallback
 *
 * @param techniqueId - The technique identifier
 * @param fallbackType - Fallback animation type if not found
 * @returns Animation configuration (never undefined)
 *
 * @korean 기술별애니메이션설정조회_기본값
 */
export function getAnimationForTechniqueOrDefault(
  techniqueId: string,
  fallbackType: AnimationType = AnimationType.JAB
): AnimationConfig {
  return TECHNIQUE_ANIMATIONS.get(techniqueId) ?? DEFAULT_CONFIGS[fallbackType];
}

/**
 * Check if technique has animation mapping
 *
 * @param techniqueId - The technique identifier
 * @returns True if technique has animation mapping
 *
 * @korean 애니메이션매핑여부확인
 */
export function hasAnimationMapping(techniqueId: string): boolean {
  return TECHNIQUE_ANIMATIONS.has(techniqueId);
}

/**
 * Get all technique IDs with a specific animation type
 *
 * @param animationType - The animation type to search for
 * @returns Array of technique IDs using this animation
 *
 * @korean 애니메이션타입별기술조회
 */
export function getTechniquesByAnimationType(
  animationType: AnimationType
): readonly string[] {
  const techniques: string[] = [];
  for (const [id, config] of TECHNIQUE_ANIMATIONS) {
    if (config.type === animationType) {
      techniques.push(id);
    }
  }
  return techniques;
}

/**
 * Animation statistics for debugging
 */
export function getAnimationStats(): Record<AnimationType, number> {
  const stats: Record<AnimationType, number> = {} as Record<
    AnimationType,
    number
  >;

  // Initialize all types to 0
  for (const type of Object.values(AnimationType)) {
    stats[type] = 0;
  }

  // Count techniques per animation type
  for (const [, config] of TECHNIQUE_ANIMATIONS) {
    stats[config.type]++;
  }

  return stats;
}
