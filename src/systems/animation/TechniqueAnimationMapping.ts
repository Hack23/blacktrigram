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
const DEFAULT_CONFIGS: Partial<Record<AnimationType, AnimationConfig>> = {
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
  [AnimationType.LOW_KICK]: { type: AnimationType.LOW_KICK, speed: 1.1 },
  [AnimationType.CRESCENT_KICK]: {
    type: AnimationType.CRESCENT_KICK,
    speed: 1.0,
  },
  [AnimationType.PUSH_KICK]: { type: AnimationType.PUSH_KICK, speed: 1.1 },
  [AnimationType.SPINNING_HEEL_KICK]: {
    type: AnimationType.SPINNING_HEEL_KICK,
    speed: 0.95,
  },

  // Punches (주먹)
  [AnimationType.JAB]: { type: AnimationType.JAB, speed: 1.2 },
  [AnimationType.CROSS]: { type: AnimationType.CROSS, speed: 1.1 },
  [AnimationType.HOOK]: { type: AnimationType.HOOK, speed: 1.0 },
  [AnimationType.UPPERCUT]: { type: AnimationType.UPPERCUT, speed: 1.0 },
  [AnimationType.OVERHAND]: { type: AnimationType.OVERHAND, speed: 0.95 },
  [AnimationType.PALM_STRIKE]: { type: AnimationType.PALM_STRIKE, speed: 1.0 },
  [AnimationType.BACKFIST]: { type: AnimationType.BACKFIST, speed: 1.05 },
  [AnimationType.HAMMER_FIST]: { type: AnimationType.HAMMER_FIST, speed: 1.0 },

  // ═══ SPECIALIZED JAB VARIANTS (잽 변형) ═══
  [AnimationType.SPEAR_HAND_STRIKE]: {
    type: AnimationType.SPEAR_HAND_STRIKE,
    speed: 1.3,
  },
  [AnimationType.NERVE_STRIKE]: {
    type: AnimationType.NERVE_STRIKE,
    speed: 1.2,
  },
  [AnimationType.PRESSURE_POINT_STRIKE]: {
    type: AnimationType.PRESSURE_POINT_STRIKE,
    speed: 1.0,
  },
  [AnimationType.LIGHTNING_STRIKE]: {
    type: AnimationType.LIGHTNING_STRIKE,
    speed: 1.4,
  },
  [AnimationType.RAPID_BARRAGE]: {
    type: AnimationType.RAPID_BARRAGE,
    speed: 1.5,
  },
  [AnimationType.RHYTHMIC_STRIKES]: {
    type: AnimationType.RHYTHMIC_STRIKES,
    speed: 1.3,
  },
  [AnimationType.NERVE_PARALYSIS]: {
    type: AnimationType.NERVE_PARALYSIS,
    speed: 1.1,
  },
  [AnimationType.THROAT_STRIKE]: {
    type: AnimationType.THROAT_STRIKE,
    speed: 1.2,
  },
  [AnimationType.EYE_GOUGE]: { type: AnimationType.EYE_GOUGE, speed: 1.3 },

  // ═══ SPECIALIZED CROSS VARIANTS (크로스 변형) ═══
  [AnimationType.HEAVEN_STRIKE]: {
    type: AnimationType.HEAVEN_STRIKE,
    speed: 1.0,
  },
  [AnimationType.FLOWING_CROSS]: {
    type: AnimationType.FLOWING_CROSS,
    speed: 1.2,
  },

  // ═══ SPECIALIZED PALM STRIKES (장권 변형) ═══
  [AnimationType.SOLAR_PLEXUS_STRIKE]: {
    type: AnimationType.SOLAR_PLEXUS_STRIKE,
    speed: 1.1,
  },
  [AnimationType.FLOWING_PUSH]: {
    type: AnimationType.FLOWING_PUSH,
    speed: 1.1,
  },
  [AnimationType.LIVER_DISRUPTION]: {
    type: AnimationType.LIVER_DISRUPTION,
    speed: 1.0,
  },
  [AnimationType.EAR_STRIKE]: { type: AnimationType.EAR_STRIKE, speed: 1.2 },

  // Elbow/Knee (팔꿈치/무릎)
  [AnimationType.ELBOW_STRIKE]: {
    type: AnimationType.ELBOW_STRIKE,
    speed: 1.1,
  },
  [AnimationType.ELBOW_UPPERCUT]: {
    type: AnimationType.ELBOW_UPPERCUT,
    speed: 1.0,
  },
  [AnimationType.SPINNING_ELBOW]: {
    type: AnimationType.SPINNING_ELBOW,
    speed: 0.95,
  },
  [AnimationType.KNEE_STRIKE]: { type: AnimationType.KNEE_STRIKE, speed: 1.0 },
  [AnimationType.FLYING_KNEE]: { type: AnimationType.FLYING_KNEE, speed: 0.95 },

  // ═══ SPECIALIZED ELBOW VARIANTS (팔꿈치 변형) ═══
  [AnimationType.TEMPLE_ELBOW]: {
    type: AnimationType.TEMPLE_ELBOW,
    speed: 1.1,
  },
  [AnimationType.SPINNING_BACK_ELBOW]: {
    type: AnimationType.SPINNING_BACK_ELBOW,
    speed: 1.2,
  },
  [AnimationType.SPINAL_ELBOW]: {
    type: AnimationType.SPINAL_ELBOW,
    speed: 1.0,
  },
  [AnimationType.BRACHIAL_ELBOW]: {
    type: AnimationType.BRACHIAL_ELBOW,
    speed: 1.1,
  },

  // ═══ SPECIALIZED KNEE VARIANTS (무릎 변형) ═══
  [AnimationType.KIDNEY_KNEE]: { type: AnimationType.KIDNEY_KNEE, speed: 1.0 },
  [AnimationType.FEMORAL_KNEE]: {
    type: AnimationType.FEMORAL_KNEE,
    speed: 1.0,
  },

  // Grappling (잡기)
  [AnimationType.THROW]: { type: AnimationType.THROW, speed: 0.9 },
  [AnimationType.GRAPPLE]: { type: AnimationType.GRAPPLE, speed: 0.85 },
  [AnimationType.SWEEP]: { type: AnimationType.SWEEP, speed: 1.0 },
  [AnimationType.SLAM]: { type: AnimationType.SLAM, speed: 0.9 },
  [AnimationType.WRIST_LOCK]: { type: AnimationType.WRIST_LOCK, speed: 0.85 },
  [AnimationType.ARM_BAR]: { type: AnimationType.ARM_BAR, speed: 0.8 },
  [AnimationType.SHOULDER_LOCK]: {
    type: AnimationType.SHOULDER_LOCK,
    speed: 0.85,
  },
  [AnimationType.HIP_THROW]: { type: AnimationType.HIP_THROW, speed: 0.9 },
  [AnimationType.LEG_REAP]: { type: AnimationType.LEG_REAP, speed: 1.0 },

  // ═══ SPECIALIZED GRAPPLE VARIANTS (잡기 변형) ═══
  [AnimationType.SMALL_CIRCLE_LOCK]: {
    type: AnimationType.SMALL_CIRCLE_LOCK,
    speed: 0.85,
  },
  [AnimationType.FINGER_LOCK]: {
    type: AnimationType.FINGER_LOCK,
    speed: 0.9,
  },
  [AnimationType.ELBOW_LOCK]: { type: AnimationType.ELBOW_LOCK, speed: 0.8 },
  [AnimationType.SHOULDER_MANIPULATION]: {
    type: AnimationType.SHOULDER_MANIPULATION,
    speed: 0.8,
  },
  [AnimationType.MOUNTAIN_LOCK]: {
    type: AnimationType.MOUNTAIN_LOCK,
    speed: 0.8,
  },
  [AnimationType.EARTH_EMBRACE]: {
    type: AnimationType.EARTH_EMBRACE,
    speed: 0.85,
  },
  [AnimationType.CAROTID_CHOKE]: {
    type: AnimationType.CAROTID_CHOKE,
    speed: 0.9,
  },
  [AnimationType.REAR_NAKED_CHOKE]: {
    type: AnimationType.REAR_NAKED_CHOKE,
    speed: 0.8,
  },

  // ═══ SPECIALIZED THROW VARIANTS (던지기 변형) ═══
  [AnimationType.REDIRECT_THROW]: {
    type: AnimationType.REDIRECT_THROW,
    speed: 0.9,
  },
  [AnimationType.HIP_WHEEL_THROW]: {
    type: AnimationType.HIP_WHEEL_THROW,
    speed: 0.85,
  },
  [AnimationType.SSIREUM_THROW]: {
    type: AnimationType.SSIREUM_THROW,
    speed: 0.9,
  },
  [AnimationType.SACRIFICE_THROW]: {
    type: AnimationType.SACRIFICE_THROW,
    speed: 0.8,
  },

  // ═══ SPECIALIZED SWEEP VARIANTS (쓸기 변형) ═══
  [AnimationType.ANKLE_PICK]: { type: AnimationType.ANKLE_PICK, speed: 1.1 },
  [AnimationType.ACHILLES_ATTACK]: {
    type: AnimationType.ACHILLES_ATTACK,
    speed: 1.2,
  },

  // ═══ SPECIALIZED SLAM VARIANTS (슬램 변형) ═══
  [AnimationType.BODY_LOCK_SLAM]: {
    type: AnimationType.BODY_LOCK_SLAM,
    speed: 0.85,
  },

  // ═══ SPECIALIZED WRIST LOCK VARIANTS (손목꺾기 변형) ═══
  [AnimationType.WRIST_TWIST_COUNTER]: {
    type: AnimationType.WRIST_TWIST_COUNTER,
    speed: 0.9,
  },

  // Counters (반격)
  [AnimationType.COUNTER_ATTACK]: {
    type: AnimationType.COUNTER_ATTACK,
    speed: 1.1,
  },
  [AnimationType.COUNTER_STRIKE]: {
    type: AnimationType.COUNTER_STRIKE,
    speed: 1.1,
  },
  [AnimationType.PARRY_COUNTER]: {
    type: AnimationType.PARRY_COUNTER,
    speed: 1.1,
  },

  // ═══ SPECIALIZED COUNTER VARIANTS (반격 변형) ═══
  [AnimationType.WATER_COUNTER]: {
    type: AnimationType.WATER_COUNTER,
    speed: 1.0,
  },
  [AnimationType.ROCK_COUNTER]: {
    type: AnimationType.ROCK_COUNTER,
    speed: 1.1,
  },

  // Defense (방어)
  [AnimationType.BLOCK]: { type: AnimationType.BLOCK, speed: 1.0 },
  [AnimationType.BLOCK_HIGH]: { type: AnimationType.BLOCK_HIGH, speed: 1.0 },
  [AnimationType.BLOCK_LOW]: { type: AnimationType.BLOCK_LOW, speed: 1.0 },
  [AnimationType.PARRY]: { type: AnimationType.PARRY, speed: 1.1 },

  // ═══ SPECIALIZED BLOCK VARIANTS (방어 변형) ═══
  [AnimationType.FLOWING_BLOCK]: {
    type: AnimationType.FLOWING_BLOCK,
    speed: 1.0,
  },
  [AnimationType.CIRCULAR_PARRY]: {
    type: AnimationType.CIRCULAR_PARRY,
    speed: 1.1,
  },
  [AnimationType.ROCK_DEFENSE]: {
    type: AnimationType.ROCK_DEFENSE,
    speed: 0.9,
  },
  [AnimationType.IRON_BLOCK]: { type: AnimationType.IRON_BLOCK, speed: 0.85 },

  // ═══ DARK OPS SPECIALIZED (암살 특수기) ═══
  [AnimationType.JAW_DISLOCATION]: {
    type: AnimationType.JAW_DISLOCATION,
    speed: 1.0,
  },
  [AnimationType.TEMPLE_STRIKE]: {
    type: AnimationType.TEMPLE_STRIKE,
    speed: 1.1,
  },

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
  [AnimationType.STEP_FORWARD]: {
    type: AnimationType.STEP_FORWARD,
    speed: 1.0,
  },
  [AnimationType.STEP_BACK]: { type: AnimationType.STEP_BACK, speed: 1.0 },
  [AnimationType.SIDESTEP]: { type: AnimationType.SIDESTEP, speed: 1.1 },
  [AnimationType.PIVOT]: { type: AnimationType.PIVOT, speed: 1.0 },
  [AnimationType.DUCK]: { type: AnimationType.DUCK, speed: 1.2 },
  [AnimationType.LEAN]: { type: AnimationType.LEAN, speed: 1.0 },

  // Recovery & Stance (복귀 및 자세)
  [AnimationType.RECOVERY]: { type: AnimationType.RECOVERY, speed: 1.0 },
  [AnimationType.IDLE]: { type: AnimationType.IDLE, speed: 1.0 },
  [AnimationType.STANCE]: { type: AnimationType.STANCE, speed: 1.0 },

  // Additional Kicks (추가 발차기)
  [AnimationType.SPINNING_HOOK]: {
    type: AnimationType.SPINNING_HOOK,
    speed: 0.95,
  },
  [AnimationType.KNEE_KICK]: { type: AnimationType.KNEE_KICK, speed: 1.0 },
  [AnimationType.FLYING_KICK]: { type: AnimationType.FLYING_KICK, speed: 0.95 },

  // Additional Knee/Elbow (추가 무릎/팔꿈치)
  [AnimationType.CLINCH_KNEE]: { type: AnimationType.CLINCH_KNEE, speed: 1.0 },

  // Additional Grappling (추가 잡기)
  [AnimationType.JOINT_LOCK]: { type: AnimationType.JOINT_LOCK, speed: 0.8 },
  [AnimationType.TAKEDOWN]: { type: AnimationType.TAKEDOWN, speed: 0.9 },
  [AnimationType.CLINCH]: { type: AnimationType.CLINCH, speed: 0.85 },
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
    ["geon_heaven_strike", { type: AnimationType.HEAVEN_STRIKE, speed: 1.0 }],
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
    ["tae_flowing_strikes", { type: AnimationType.FLOWING_CROSS, speed: 1.2 }],
    ["tae_wrist_lock", { type: AnimationType.WRIST_LOCK, speed: 0.85 }],
    [
      "tae_small_circle",
      { type: AnimationType.SMALL_CIRCLE_LOCK, speed: 0.85 },
    ],
    ["tae_finger_lock", { type: AnimationType.FINGER_LOCK, speed: 0.9 }],
    ["tae_elbow_lock", { type: AnimationType.ELBOW_LOCK, speed: 0.8 }],
    [
      "tae_shoulder_lock",
      { type: AnimationType.SHOULDER_MANIPULATION, speed: 0.8 },
    ],
    ["tae_arm_bar", { type: AnimationType.ARM_BAR, speed: 0.75 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☲ LI (리) - FIRE: Precision Nerve Strikes (정밀 타격)
    // ═══════════════════════════════════════════════════════════════════════
    ["li_flame_spear", { type: AnimationType.SPEAR_HAND_STRIKE, speed: 1.3 }],
    ["li_temple_strike", { type: AnimationType.TEMPLE_ELBOW, speed: 1.1 }],
    ["li_nerve_strike", { type: AnimationType.NERVE_STRIKE, speed: 1.2 }],
    ["li_sidekick", { type: AnimationType.SIDE_KICK, speed: 1.0 }],
    [
      "li_pressure_point",
      { type: AnimationType.PRESSURE_POINT_STRIKE, speed: 1.0 },
    ],
    [
      "li_solar_plexus_strike",
      { type: AnimationType.SOLAR_PLEXUS_STRIKE, speed: 1.1 },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // ☳ JIN (진) - THUNDER: Explosive Power (폭발력)
    // ═══════════════════════════════════════════════════════════════════════
    [
      "jin_lightning_flash",
      { type: AnimationType.LIGHTNING_STRIKE, speed: 1.4 },
    ],
    [
      "jin_jumping_front_kick",
      { type: AnimationType.JUMPING_KICK, speed: 1.0 },
    ],
    ["jin_tornado_kick", { type: AnimationType.TORNADO_KICK, speed: 1.0 }],
    ["jin_flying_sidekick", { type: AnimationType.FLYING_KICK, speed: 1.1 }],
    ["jin_back_kick", { type: AnimationType.BACK_KICK, speed: 1.0 }],
    ["jin_knee_strike", { type: AnimationType.KNEE_STRIKE, speed: 1.1 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☴ SON (손) - WIND: Continuous Pressure (지속 공격)
    // ═══════════════════════════════════════════════════════════════════════
    [
      "son_whirlwind_barrage",
      { type: AnimationType.RAPID_BARRAGE, speed: 1.5 },
    ],
    ["son_sweeping_low_kick", { type: AnimationType.LOW_KICK, speed: 1.0 }],
    [
      "son_rhythmic_strikes",
      { type: AnimationType.RHYTHMIC_STRIKES, speed: 1.3 },
    ],
    ["son_flowing_push", { type: AnimationType.FLOWING_PUSH, speed: 1.1 }],
    [
      "son_spinning_elbow",
      { type: AnimationType.SPINNING_BACK_ELBOW, speed: 1.2 },
    ],
    ["son_rapid_footwork", { type: AnimationType.SIDE_STEP, speed: 1.3 }],

    // ═══════════════════════════════════════════════════════════════════════
    // ☵ GAM (감) - WATER: Flow & Adaptation (유동 반격)
    // ═══════════════════════════════════════════════════════════════════════
    ["gam_water_counter", { type: AnimationType.WATER_COUNTER, speed: 1.0 }],
    ["gam_redirect_throw", { type: AnimationType.REDIRECT_THROW, speed: 0.9 }],
    ["gam_flowing_block", { type: AnimationType.FLOWING_BLOCK, speed: 1.0 }],
    ["gam_circular_parry", { type: AnimationType.CIRCULAR_PARRY, speed: 1.1 }],
    ["gam_hip_throw", { type: AnimationType.HIP_WHEEL_THROW, speed: 0.85 }],
    [
      "gam_wrist_twist_counter",
      { type: AnimationType.WRIST_TWIST_COUNTER, speed: 0.9 },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // ☶ GAN (간) - MOUNTAIN: Defensive Mastery (방어 마스터리)
    // ═══════════════════════════════════════════════════════════════════════
    ["gan_rock_defense", { type: AnimationType.ROCK_DEFENSE, speed: 0.9 }],
    ["gan_immovable_stance", { type: AnimationType.IDLE_STANCE, speed: 0.8 }],
    ["gan_iron_block", { type: AnimationType.IRON_BLOCK, speed: 0.85 }],
    ["gan_counter_strike", { type: AnimationType.ROCK_COUNTER, speed: 1.1 }],
    [
      "gan_mountain_stance_lock",
      { type: AnimationType.MOUNTAIN_LOCK, speed: 0.8 },
    ],
    [
      "gan_reversal_technique",
      { type: AnimationType.COUNTER_ATTACK, speed: 1.0 },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // ☷ GON (곤) - EARTH: Grounding & Takedowns (넘어뜨리기)
    // ═══════════════════════════════════════════════════════════════════════
    ["gon_earth_embrace", { type: AnimationType.EARTH_EMBRACE, speed: 0.85 }],
    ["gon_leg_sweep", { type: AnimationType.SWEEP, speed: 1.0 }],
    ["gon_ssireum_throw", { type: AnimationType.SSIREUM_THROW, speed: 0.9 }],
    ["gon_ground_pound", { type: AnimationType.SLAM, speed: 1.0 }],
    ["gon_ankle_pick", { type: AnimationType.ANKLE_PICK, speed: 1.1 }],
    [
      "gon_body_lock_takedown",
      { type: AnimationType.BODY_LOCK_SLAM, speed: 0.85 },
    ],
    [
      "gon_sacrifice_throw",
      { type: AnimationType.SACRIFICE_THROW, speed: 0.8 },
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // DARK OPS (암살자) - Lethal Techniques (치명 기술)
    // ═══════════════════════════════════════════════════════════════════════
    [
      "darkops_silent_carotid",
      { type: AnimationType.CAROTID_CHOKE, speed: 0.9 },
    ],
    [
      "darkops_nerve_paralysis",
      { type: AnimationType.NERVE_PARALYSIS, speed: 1.1 },
    ],
    [
      "darkops_liver_disruption",
      { type: AnimationType.LIVER_DISRUPTION, speed: 1.0 },
    ],
    ["darkops_kidney_strike", { type: AnimationType.KIDNEY_KNEE, speed: 1.0 }],
    [
      "darkops_throat_strike",
      { type: AnimationType.THROAT_STRIKE, speed: 1.2 },
    ],
    [
      "darkops_solar_plexus_paralyze",
      { type: AnimationType.HAMMER_FIST, speed: 1.1 },
    ],
    [
      "darkops_brachial_plexus_strike",
      { type: AnimationType.BRACHIAL_ELBOW, speed: 1.1 },
    ],
    [
      "darkops_femoral_nerve_strike",
      { type: AnimationType.FEMORAL_KNEE, speed: 1.0 },
    ],
    [
      "darkops_rear_choke",
      { type: AnimationType.REAR_NAKED_CHOKE, speed: 0.8 },
    ],
    ["darkops_spinal_strike", { type: AnimationType.SPINAL_ELBOW, speed: 1.0 }],
    [
      "darkops_jaw_dislocation",
      { type: AnimationType.JAW_DISLOCATION, speed: 1.0 },
    ],
    [
      "darkops_temple_strike",
      { type: AnimationType.TEMPLE_STRIKE, speed: 1.1 },
    ],
    [
      "darkops_achilles_sever",
      { type: AnimationType.ACHILLES_ATTACK, speed: 1.2 },
    ],
    ["darkops_ear_strike", { type: AnimationType.EAR_STRIKE, speed: 1.2 }],
    ["darkops_eye_gouge", { type: AnimationType.EYE_GOUGE, speed: 1.3 }],
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
  const mapped = TECHNIQUE_ANIMATIONS.get(techniqueId);
  if (mapped) return mapped;

  const fallbackConfig = DEFAULT_CONFIGS[fallbackType];
  return fallbackConfig ?? { type: fallbackType, speed: 1.0 };
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
