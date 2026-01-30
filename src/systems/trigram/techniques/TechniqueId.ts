/**
 * Technique ID Enumeration
 * 기법 ID 열거형
 *
 * Centralized enum of all technique IDs across all trigram stances.
 * Ensures type-safe technique identification and enables compile-time
 * validation of technique-to-animation mappings.
 *
 * Usage:
 * - Use as type for technique lookups
 * - Ensures no duplicate technique IDs
 * - Provides autocomplete in IDEs
 *
 * @module systems/trigram/techniques/TechniqueId
 * @korean 기법ID열거형
 */

/**
 * Complete enumeration of all technique IDs
 * Maps 1-1 with technique definitions across all stance files
 */
export enum TechniqueId {
  // ☰ GEON (건) - Heaven Techniques
  GEON_HEAVEN_STRIKE = "geon_heaven_strike",
  GEON_HEAVENLY_FIST = "geon_heavenly_fist",
  GEON_FRONTAL_KICK = "geon_frontal_kick",
  GEON_ROUNDHOUSE = "geon_roundhouse",
  GEON_AXE_KICK = "geon_axe_kick",
  GEON_PALM_STRIKE = "geon_palm_strike",
  GEON_CRUSHING_ELBOW = "geon_crushing_elbow",

  // ☱ TAE (태) - Lake Techniques
  TAE_FLOWING_STRIKES = "tae_flowing_strikes",
  TAE_WRIST_LOCK = "tae_wrist_lock",
  TAE_SMALL_CIRCLE = "tae_small_circle",
  TAE_FINGER_LOCK = "tae_finger_lock",
  TAE_ELBOW_LOCK = "tae_elbow_lock",
  TAE_SHOULDER_LOCK = "tae_shoulder_lock",
  TAE_ARM_BAR = "tae_arm_bar",

  // ☲ LI (리) - Fire Techniques
  LI_FLAME_SPEAR = "li_flame_spear",
  LI_TEMPLE_STRIKE = "li_temple_strike",
  LI_NERVE_STRIKE = "li_nerve_strike",
  LI_SIDE_KICK = "li_side_kick",
  LI_PRESSURE_POINT = "li_pressure_point",
  LI_SOLAR_PLEXUS_STRIKE = "li_solar_plexus_strike",

  // ☳ JIN (진) - Thunder Techniques
  JIN_LIGHTNING_FLASH = "jin_lightning_flash",
  JIN_JUMPING_FRONT_KICK = "jin_jumping_front_kick",
  JIN_TORNADO_KICK = "jin_tornado_kick",
  JIN_FLYING_SIDEKICK = "jin_flying_sidekick",
  JIN_BACK_KICK = "jin_back_kick",
  JIN_KNEE_STRIKE = "jin_knee_strike",

  // ☴ SON (손) - Wind Techniques
  SON_WHIRLWIND_BARRAGE = "son_whirlwind_barrage",
  SON_SWEEPING_LOW_KICK = "son_sweeping_low_kick",
  SON_RHYTHMIC_STRIKES = "son_rhythmic_strikes",
  SON_FLOWING_PUSH = "son_flowing_push",
  SON_SPINNING_ELBOW = "son_spinning_elbow",
  SON_RAPID_FOOTWORK = "son_rapid_footwork",

  // ☵ GAM (감) - Water Techniques
  GAM_WATER_COUNTER = "gam_water_counter",
  GAM_REDIRECT_THROW = "gam_redirect_throw",
  GAM_HIP_THROW = "gam_hip_throw",
  GAM_FLOWING_BLOCK = "gam_flowing_block",
  GAM_CIRCULAR_PARRY = "gam_circular_parry",
  GAM_WRIST_TWIST_COUNTER = "gam_wrist_twist_counter",

  // ☶ GAN (간) - Mountain Techniques
  GAN_ROCK_DEFENSE = "gan_rock_defense",
  GAN_IMMOVABLE_STANCE = "gan_immovable_stance",
  GAN_IRON_BLOCK = "gan_iron_block",
  GAN_COUNTER_STRIKE = "gan_counter_strike",
  GAN_REVERSAL_TECHNIQUE = "gan_reversal_technique",
  GAN_MOUNTAIN_STANCE_LOCK = "gan_mountain_stance_lock",

  // ☷ GON (곤) - Earth Techniques
  GON_EARTH_EMBRACE = "gon_earth_embrace",
  GON_LEG_SWEEP = "gon_leg_sweep",
  GON_SSIREUM_THROW = "gon_ssireum_throw",
  GON_GROUND_POUND = "gon_ground_pound",
  GON_ANKLE_PICK = "gon_ankle_pick",
  GON_BODY_LOCK_TAKEDOWN = "gon_body_lock_takedown",
  GON_SACRIFICE_THROW = "gon_sacrifice_throw",

  // 암살자 DARK OPS Techniques
  DARKOPS_SILENT_CAROTID = "darkops_silent_carotid",
  DARKOPS_JUGULAR_STRIKE = "darkops_jugular_strike",
  DARKOPS_NERVE_PARALYSIS = "darkops_nerve_paralysis",
  DARKOPS_BRACHIAL_PLEXUS_STRIKE = "darkops_brachial_plexus_strike",
  DARKOPS_FEMORAL_NERVE_STRIKE = "darkops_femoral_nerve_strike",
  DARKOPS_KIDNEY_STRIKE = "darkops_kidney_strike",
  DARKOPS_LIVER_DISRUPTION = "darkops_liver_disruption",
  DARKOPS_SPINAL_STRIKE = "darkops_spinal_strike",
  DARKOPS_ACHILLES_SEVER = "darkops_achilles_sever",
  DARKOPS_THROAT_STRIKE = "darkops_throat_strike",
  DARKOPS_TEMPLE_STRIKE = "darkops_temple_strike",
  DARKOPS_EYE_GOUGE = "darkops_eye_gouge",
  DARKOPS_EAR_STRIKE = "darkops_ear_strike",
  DARKOPS_REAR_CHOKE = "darkops_rear_choke",
  DARKOPS_SLEEPER_HOLD = "darkops_sleeper_hold",
}

/**
 * Helper type to ensure technique IDs match the enum
 */
export type TechniqueIdType = `${TechniqueId}`;

/**
 * Validate that a string is a valid technique ID
 */
export function isValidTechniqueId(id: string): id is TechniqueId {
  return Object.values(TechniqueId).includes(id as TechniqueId);
}

/**
 * Get all technique IDs as an array
 */
export function getAllTechniqueIds(): readonly TechniqueId[] {
  return Object.values(TechniqueId);
}

/**
 * Count of all technique IDs
 */
export const TECHNIQUE_ID_COUNT = Object.keys(TechniqueId).length;
