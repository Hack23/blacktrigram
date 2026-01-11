/**
 * Martial Arts Animation Constants
 *
 * Constants for Korean martial arts animations including hand poses,
 * martial arts stances, kick phases, and punch phases.
 *
 * 한국 무술 애니메이션 상수 모듈
 *
 * @module systems/animation/MartialArtsConstants
 * @category Animation System
 * @korean 무술애니메이션상수
 */

// ═══════════════════════════════════════════════════════════════════════════
// HAND POSES FOR MARTIAL ARTS (무술 손 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hand poses for different strike types
 * 타격 유형별 손 자세
 *
 * Each pose defines rotations for all 19 finger joints (per hand):
 * - thumb_meta, thumb_prox, thumb_dist (3 joints)
 * - index_meta, index_prox, index_inter, index_dist (4 joints)
 * - middle_meta, middle_prox, middle_inter, middle_dist (4 joints)
 * - ring_meta, ring_prox, ring_inter, ring_dist (4 joints)
 * - pinky_meta, pinky_prox, pinky_inter, pinky_dist (4 joints)
 *
 * @korean 손자세
 */
export const HAND_POSES = {
  /**
   * Closed Fist - Standard punch (주먹)
   * Fingers curled tight, thumb outside
   */
  FIST: {
    thumb_meta: [0.3, 0.5, 0.2] as const,
    thumb_prox: [0.4, 0, 0] as const,
    thumb_dist: [0.3, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [1.57, 0, 0] as const, // 90° curl
    index_inter: [1.57, 0, 0] as const,
    index_dist: [0.8, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [1.57, 0, 0] as const,
    middle_inter: [1.57, 0, 0] as const,
    middle_dist: [0.8, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [1.57, 0, 0] as const,
    ring_inter: [1.57, 0, 0] as const,
    ring_dist: [0.8, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [1.57, 0, 0] as const,
    pinky_inter: [1.57, 0, 0] as const,
    pinky_dist: [0.8, 0, 0] as const,
  },

  /**
   * Open Palm - Palm strikes, blocks (장권)
   * Fingers extended, slight spread
   */
  OPEN_PALM: {
    thumb_meta: [0, 0.4, -0.3] as const,
    thumb_prox: [0.1, 0, 0] as const,
    thumb_dist: [0, 0, 0] as const,
    index_meta: [0, 0, -0.1] as const,
    index_prox: [0, 0, 0] as const,
    index_inter: [0, 0, 0] as const,
    index_dist: [0, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [0, 0, 0] as const,
    middle_inter: [0, 0, 0] as const,
    middle_dist: [0, 0, 0] as const,
    ring_meta: [0, 0, 0.1] as const,
    ring_prox: [0, 0, 0] as const,
    ring_inter: [0, 0, 0] as const,
    ring_dist: [0, 0, 0] as const,
    pinky_meta: [0, 0, 0.2] as const,
    pinky_prox: [0, 0, 0] as const,
    pinky_inter: [0, 0, 0] as const,
    pinky_dist: [0, 0, 0] as const,
  },

  /**
   * Spear Hand - Finger strikes (관수)
   * Fingers together, extended straight
   */
  SPEAR_HAND: {
    thumb_meta: [0.4, 0.6, 0.3] as const,
    thumb_prox: [0.2, 0, 0] as const,
    thumb_dist: [0.1, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [0, 0, 0] as const,
    index_inter: [0, 0, 0] as const,
    index_dist: [0, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [0, 0, 0] as const,
    middle_inter: [0, 0, 0] as const,
    middle_dist: [0, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [0, 0, 0] as const,
    ring_inter: [0, 0, 0] as const,
    ring_dist: [0, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [0, 0, 0] as const,
    pinky_inter: [0, 0, 0] as const,
    pinky_dist: [0, 0, 0] as const,
  },

  /**
   * Knife Hand - Ridge hand strikes (수도)
   * Fingers together, thumb tucked
   */
  KNIFE_HAND: {
    thumb_meta: [0.5, 0.8, 0.4] as const,
    thumb_prox: [0.4, 0, 0] as const,
    thumb_dist: [0.2, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [0.1, 0, 0] as const,
    index_inter: [0.05, 0, 0] as const,
    index_dist: [0, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [0.1, 0, 0] as const,
    middle_inter: [0.05, 0, 0] as const,
    middle_dist: [0, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [0.1, 0, 0] as const,
    ring_inter: [0.05, 0, 0] as const,
    ring_dist: [0, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [0.1, 0, 0] as const,
    pinky_inter: [0.05, 0, 0] as const,
    pinky_dist: [0, 0, 0] as const,
  },

  /**
   * Hammer Fist - Bottom fist strikes (철퇴)
   * Tight fist for hammer blow
   */
  HAMMER_FIST: {
    thumb_meta: [0.4, 0.6, 0.3] as const,
    thumb_prox: [0.5, 0, 0] as const,
    thumb_dist: [0.4, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [1.7, 0, 0] as const,
    index_inter: [1.7, 0, 0] as const,
    index_dist: [1.0, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [1.7, 0, 0] as const,
    middle_inter: [1.7, 0, 0] as const,
    middle_dist: [1.0, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [1.7, 0, 0] as const,
    ring_inter: [1.7, 0, 0] as const,
    ring_dist: [1.0, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [1.7, 0, 0] as const,
    pinky_inter: [1.7, 0, 0] as const,
    pinky_dist: [1.0, 0, 0] as const,
  },

  /**
   * Backfist - Knuckle strikes (등주먹)
   * Fist with wrist extended back
   */
  BACKFIST: {
    thumb_meta: [0.3, 0.5, 0.2] as const,
    thumb_prox: [0.3, 0, 0] as const,
    thumb_dist: [0.2, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [1.4, 0, 0] as const,
    index_inter: [1.4, 0, 0] as const,
    index_dist: [0.7, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [1.4, 0, 0] as const,
    middle_inter: [1.4, 0, 0] as const,
    middle_dist: [0.7, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [1.4, 0, 0] as const,
    ring_inter: [1.4, 0, 0] as const,
    ring_dist: [0.7, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [1.4, 0, 0] as const,
    pinky_inter: [1.4, 0, 0] as const,
    pinky_dist: [0.7, 0, 0] as const,
  },

  /**
   * Grab - Grappling and holds (잡기)
   * Fingers curled for grabbing
   */
  GRAB: {
    thumb_meta: [0.2, 0.3, 0.1] as const,
    thumb_prox: [0.3, 0, 0] as const,
    thumb_dist: [0.2, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [1.2, 0, 0] as const,
    index_inter: [1.0, 0, 0] as const,
    index_dist: [0.6, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [1.3, 0, 0] as const,
    middle_inter: [1.1, 0, 0] as const,
    middle_dist: [0.7, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [1.3, 0, 0] as const,
    ring_inter: [1.1, 0, 0] as const,
    ring_dist: [0.7, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [1.2, 0, 0] as const,
    pinky_inter: [1.0, 0, 0] as const,
    pinky_dist: [0.6, 0, 0] as const,
  },

  /**
   * Two Finger - Eye strikes (이지권)
   * Index and middle extended, others curled
   */
  TWO_FINGER: {
    thumb_meta: [0.4, 0.6, 0.3] as const,
    thumb_prox: [0.3, 0, 0] as const,
    thumb_dist: [0.2, 0, 0] as const,
    index_meta: [0, 0, -0.1] as const,
    index_prox: [0, 0, 0] as const,
    index_inter: [0, 0, 0] as const,
    index_dist: [0, 0, 0] as const,
    middle_meta: [0, 0, 0.1] as const,
    middle_prox: [0, 0, 0] as const,
    middle_inter: [0, 0, 0] as const,
    middle_dist: [0, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [1.57, 0, 0] as const,
    ring_inter: [1.57, 0, 0] as const,
    ring_dist: [0.8, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [1.57, 0, 0] as const,
    pinky_inter: [1.57, 0, 0] as const,
    pinky_dist: [0.8, 0, 0] as const,
  },

  /**
   * Relaxed - Natural/idle hands (자연)
   * Fingers in natural slight curl
   */
  RELAXED: {
    thumb_meta: [0.1, 0.2, 0.1] as const,
    thumb_prox: [0.1, 0, 0] as const,
    thumb_dist: [0.05, 0, 0] as const,
    index_meta: [0, 0, 0] as const,
    index_prox: [0.3, 0, 0] as const,
    index_inter: [0.2, 0, 0] as const,
    index_dist: [0.1, 0, 0] as const,
    middle_meta: [0, 0, 0] as const,
    middle_prox: [0.35, 0, 0] as const,
    middle_inter: [0.25, 0, 0] as const,
    middle_dist: [0.15, 0, 0] as const,
    ring_meta: [0, 0, 0] as const,
    ring_prox: [0.35, 0, 0] as const,
    ring_inter: [0.25, 0, 0] as const,
    ring_dist: [0.15, 0, 0] as const,
    pinky_meta: [0, 0, 0] as const,
    pinky_prox: [0.3, 0, 0] as const,
    pinky_inter: [0.2, 0, 0] as const,
    pinky_dist: [0.1, 0, 0] as const,
  },
} as const;

/** Type for a single hand pose */
export type HandPoseType = (typeof HAND_POSES)[keyof typeof HAND_POSES];

/** Available hand pose names */
export type HandPoseName = keyof typeof HAND_POSES;

// ═══════════════════════════════════════════════════════════════════════════
// KOREAN MARTIAL ARTS POSES (한국 무술 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard martial arts poses used across Korean martial arts
 * 한국 무술의 기본 자세들
 *
 * @korean 기본자세
 */
export const MARTIAL_POSES = {
  /**
   * Fighting Guard - Hands protecting face (경계자세)
   * Standard defensive position in Taekwondo
   */
  GUARD: {
    leftShoulder: [-0.6, 0.4, 0.3] as const,
    leftElbow: [0, 0, -1.8] as const,
    rightShoulder: [-0.6, -0.4, -0.3] as const,
    rightElbow: [0, 0, 1.8] as const,
  },

  /**
   * High Guard - Hands at temple level (상단방어)
   * Used during kicks for head protection
   */
  HIGH_GUARD: {
    leftShoulder: [-0.9, 0.3, 0.4] as const,
    leftElbow: [0, 0, -1.6] as const,
    rightShoulder: [-0.9, -0.3, -0.4] as const,
    rightElbow: [0, 0, 1.6] as const,
  },

  /**
   * Clinch Position - Arms controlling opponent (클린치)
   * Used for knee strikes and throws
   */
  CLINCH: {
    leftShoulder: [0.8, 0, -0.5] as const,
    leftElbow: [0, 0, -1.3] as const,
    rightShoulder: [0.8, 0, 0.5] as const,
    rightElbow: [0, 0, 1.3] as const,
  },

  /**
   * Grappling Entry - Reaching for opponent (잡기진입)
   */
  GRAPPLE_ENTRY: {
    leftShoulder: [0.4, 0.6, -0.2] as const,
    leftElbow: [0, 0, -1.2] as const,
    rightShoulder: [0.6, -0.4, 0.3] as const,
    rightElbow: [0, 0, 0.8] as const,
  },

  /**
   * Neutral Standing - Relaxed standing (기본선자세)
   */
  NEUTRAL: {
    leftShoulder: [0, 0, 0.1] as const,
    leftElbow: [0, 0, -0.2] as const,
    rightShoulder: [0, 0, -0.1] as const,
    rightElbow: [0, 0, 0.2] as const,
  },
} as const;

/** Type for martial poses */
export type MartialPoseType =
  (typeof MARTIAL_POSES)[keyof typeof MARTIAL_POSES];

/** Available martial pose names */
export type MartialPoseName = keyof typeof MARTIAL_POSES;

// ═══════════════════════════════════════════════════════════════════════════
// KICK PHASES (발차기 단계)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Kick phases for proper martial arts execution
 * 발차기 단계별 자세
 *
 * @korean 발차기단계
 */
export const KICK_PHASES = {
  /**
   * Chamber Position (준비자세) - Knee lifted, tight
   */
  CHAMBER: {
    hip: [1.57, 0, 0] as const, // 90° hip flexion
    knee: [-2.0, 0, 0] as const, // Tight chamber
    ankle: [0, 0, 0] as const,
    supportKnee: [-0.25, 0, 0] as const,
    pelvis: [-0.1, 0, 0] as const,
  },

  /**
   * Extension Position (차기자세) - Leg extended
   */
  EXTENSION: {
    hip: [1.7, 0, 0] as const,
    knee: [0.1, 0, 0] as const, // Full extension
    ankle: [0.5, 0, 0] as const, // Dorsiflexion
    supportKnee: [-0.35, 0, 0] as const,
    pelvis: [0.15, 0, 0] as const,
  },

  /**
   * High Axe Kick Peak (높은차기) - Leg nearly vertical
   */
  HIGH_PEAK: {
    hip: [2.5, 0, 0] as const, // >140° hip flexion
    knee: [-0.1, 0, 0] as const,
    ankle: [0.6, 0, 0] as const,
    supportKnee: [-0.35, 0, 0] as const,
    pelvis: [-0.25, 0, 0] as const,
  },

  /**
   * Roundhouse Chamber (돌려차기준비) - Hip rotated out
   */
  ROUNDHOUSE_CHAMBER: {
    hip: [1.2, 0, 0.8] as const,
    knee: [-1.5, 0, 0] as const,
    pelvisY: -0.5,
    spineY: 0.3,
  },

  /**
   * Side Kick Lateral (옆차기) - Turned sideways
   */
  SIDE_CHAMBER: {
    hip: [1.3, 0, 0.3] as const,
    knee: [-1.6, 0, 0] as const,
    pelvisY: -1.57, // 90° turn
    spineY: -1.2,
    spineLean: 0.2,
  },
} as const;

/** Type for kick phases */
export type KickPhaseType = (typeof KICK_PHASES)[keyof typeof KICK_PHASES];

/** Available kick phase names */
export type KickPhaseName = keyof typeof KICK_PHASES;

// ═══════════════════════════════════════════════════════════════════════════
// PUNCH PHASES (주먹 단계)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Punch phases for proper striking mechanics
 * 주먹 단계별 자세
 *
 * @korean 주먹단계
 */
export const PUNCH_PHASES = {
  /**
   * Wind-up (준비) - Arm coiled back
   */
  WINDUP: {
    shoulder: [0.3, 0, -0.3] as const,
    elbow: [0, 0, 1.8] as const,
    spineY: -0.15,
    pelvisY: -0.1,
  },

  /**
   * Extension (지르기) - Full extension
   */
  EXTENSION: {
    shoulder: [-0.7, 0, 0.5] as const,
    elbow: [0, 0, 0.05] as const,
    wrist: [0, 0, -0.2] as const,
    spineY: 0.35,
    pelvisY: 0.2,
  },
} as const;

/** Type for punch phases */
export type PunchPhaseType = (typeof PUNCH_PHASES)[keyof typeof PUNCH_PHASES];

/** Available punch phase names */
export type PunchPhaseName = keyof typeof PUNCH_PHASES;

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION TYPE ENUM (애니메이션 타입)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animation type identifiers for the animation system
 * @korean 애니메이션타입
 */
export enum AnimationType {
  // Kicks (발차기)
  FRONT_KICK = "front_kick",
  ROUNDHOUSE_KICK = "roundhouse_kick",
  SIDE_KICK = "side_kick",
  AXE_KICK = "axe_kick",
  CRESCENT_KICK = "crescent_kick",
  SPINNING_HOOK = "spinning_hook",
  BACK_KICK = "back_kick",
  PUSH_KICK = "push_kick",
  LOW_KICK = "low_kick",
  KNEE_KICK = "knee_kick",
  FLYING_KICK = "flying_kick",
  TORNADO_KICK = "tornado_kick",
  JUMPING_KICK = "jumping_kick",
  SPINNING_HEEL_KICK = "spinning_heel_kick",

  // Punches (주먹)
  JAB = "jab",
  CROSS = "cross",
  HOOK = "hook",
  UPPERCUT = "uppercut",
  OVERHAND = "overhand",
  PALM_STRIKE = "palm_strike",
  BACKFIST = "backfist",
  HAMMER_FIST = "hammer_fist",

  // ═══ SPECIALIZED JAB VARIANTS (잽 변형) ═══
  SPEAR_HAND_STRIKE = "spear_hand_strike", // li_flame_spear - Finger thrust
  NERVE_STRIKE = "nerve_strike", // li_nerve_strike - Pressure point jab
  PRESSURE_POINT_STRIKE = "pressure_point_strike", // li_pressure_point - Precision strike
  LIGHTNING_STRIKE = "lightning_strike", // jin_lightning_flash - Fast explosive jab
  RAPID_BARRAGE = "rapid_barrage", // son_whirlwind_barrage - Multiple fast jabs
  RHYTHMIC_STRIKES = "rhythmic_strikes", // son_rhythmic_strikes - Patterned jabs
  NERVE_PARALYSIS = "nerve_paralysis", // darkops_nerve_paralysis - Debilitating strike
  THROAT_STRIKE = "throat_strike", // darkops_throat_strike - Airway attack
  EYE_GOUGE = "eye_gouge", // darkops_eye_gouge - Vision attack

  // ═══ SPECIALIZED CROSS VARIANTS (크로스 변형) ═══
  HEAVEN_STRIKE = "heaven_strike", // geon_heaven_strike - Powerful descending cross
  FLOWING_CROSS = "flowing_cross", // tae_flowing_strikes - Circular cross motion

  // ═══ SPECIALIZED PALM STRIKES (장권 변형) ═══
  SOLAR_PLEXUS_STRIKE = "solar_plexus_strike", // li_solar_plexus_strike - Diaphragm shock
  FLOWING_PUSH = "flowing_push", // son_flowing_push - Redirecting palm
  LIVER_DISRUPTION = "liver_disruption", // darkops_liver_disruption - Organ strike
  EAR_STRIKE = "ear_strike", // darkops_ear_strike - Concussive palm

  // Elbow/Knee (팔꿈치/무릎)
  ELBOW_STRIKE = "elbow_strike",
  KNEE_STRIKE = "knee_strike",
  ELBOW_UPPERCUT = "elbow_uppercut",
  FLYING_KNEE = "flying_knee",
  CLINCH_KNEE = "clinch_knee",
  SPINNING_ELBOW = "spinning_elbow",

  // ═══ SPECIALIZED ELBOW VARIANTS (팔꿈치 변형) ═══
  TEMPLE_ELBOW = "temple_elbow", // li_temple_strike - Lateral temple strike
  SPINNING_BACK_ELBOW = "spinning_back_elbow", // son_spinning_elbow - Rotational power
  SPINAL_ELBOW = "spinal_elbow", // darkops_spinal_strike - Vertebrae targeting
  BRACHIAL_ELBOW = "brachial_elbow", // darkops_brachial_plexus_strike - Nerve cluster

  // ═══ SPECIALIZED KNEE VARIANTS (무릎 변형) ═══
  KIDNEY_KNEE = "kidney_knee", // darkops_kidney_strike - Organ targeting
  FEMORAL_KNEE = "femoral_knee", // darkops_femoral_nerve_strike - Nerve targeting

  // Grappling (잡기)
  THROW = "throw",
  JOINT_LOCK = "joint_lock",
  TAKEDOWN = "takedown",
  SWEEP = "sweep",
  CLINCH = "clinch",
  GRAPPLE = "grapple",
  SLAM = "slam",
  WRIST_LOCK = "wrist_lock",
  ARM_BAR = "arm_bar",
  SHOULDER_LOCK = "shoulder_lock",
  HIP_THROW = "hip_throw",
  LEG_REAP = "leg_reap",

  // ═══ SPECIALIZED GRAPPLE VARIANTS (잡기 변형) ═══
  SMALL_CIRCLE_LOCK = "small_circle_lock", // tae_small_circle - Subtle joint control
  FINGER_LOCK = "finger_lock", // tae_finger_lock - Digit manipulation
  ELBOW_LOCK = "elbow_lock", // tae_elbow_lock - Arm hyperextension
  SHOULDER_MANIPULATION = "shoulder_manipulation", // tae_shoulder_lock - Rotator cuff attack
  MOUNTAIN_LOCK = "mountain_lock", // gan_mountain_stance_lock - Immobilizing hold
  EARTH_EMBRACE = "earth_embrace", // gon_earth_embrace - Ground control
  CAROTID_CHOKE = "carotid_choke", // darkops_silent_carotid - Blood choke
  REAR_NAKED_CHOKE = "rear_naked_choke", // darkops_rear_choke - Air choke

  // ═══ SPECIALIZED THROW VARIANTS (던지기 변형) ═══
  REDIRECT_THROW = "redirect_throw", // gam_redirect_throw - Using opponent's momentum
  HIP_WHEEL_THROW = "hip_wheel_throw", // gam_hip_throw - O-goshi style
  SSIREUM_THROW = "ssireum_throw", // gon_ssireum_throw - Korean wrestling throw
  SACRIFICE_THROW = "sacrifice_throw", // gon_sacrifice_throw - Tomoe nage style

  // ═══ SPECIALIZED SWEEP VARIANTS (쓸기 변형) ═══
  ANKLE_PICK = "ankle_pick", // gon_ankle_pick - Single leg takedown entry
  ACHILLES_ATTACK = "achilles_attack", // darkops_achilles_sever - Tendon targeting

  // ═══ SPECIALIZED SLAM VARIANTS (슬램 변형) ═══
  BODY_LOCK_SLAM = "body_lock_slam", // gon_body_lock_takedown - Bear hug slam

  // ═══ SPECIALIZED WRIST LOCK VARIANTS (손목꺾기 변형) ═══
  WRIST_TWIST_COUNTER = "wrist_twist_counter", // gam_wrist_twist_counter - Counter technique

  // Counters (반격)
  COUNTER_STRIKE = "counter_strike",
  PARRY_COUNTER = "parry_counter",
  COUNTER_ATTACK = "counter_attack",

  // ═══ SPECIALIZED COUNTER VARIANTS (반격 변형) ═══
  WATER_COUNTER = "water_counter", // gam_water_counter - Fluid redirection
  ROCK_COUNTER = "rock_counter", // gan_counter_strike - Immovable counter

  // Defense (방어)
  BLOCK = "block",
  BLOCK_HIGH = "block_high",
  BLOCK_LOW = "block_low",
  PARRY = "parry",

  // ═══ SPECIALIZED BLOCK VARIANTS (방어 변형) ═══
  FLOWING_BLOCK = "flowing_block", // gam_flowing_block - Soft redirection
  CIRCULAR_PARRY = "circular_parry", // gam_circular_parry - Rotational deflect
  ROCK_DEFENSE = "rock_defense", // gan_rock_defense - Immovable guard
  IRON_BLOCK = "iron_block", // gan_iron_block - Hard block
  FLOW_DEFENSE = "flow_defense", // gam_flow_defense - Water-like defense
  IMMOVABLE_BLOCK = "immovable_block", // gan_immovable_block - Mountain defense
  EXPLOSIVE_BLOCK = "explosive_block", // jin_explosive_block - Counter with block
  CONTINUOUS_DEFLECTION = "continuous_deflection", // son_continuous_deflection - Wind deflection
  PRECISION_PARRY = "precision_parry", // li_precision_parry - Fire precision
  JOINT_LOCK_DEFENSE = "joint_lock_defense", // tae_joint_lock_defense - Hapkido defense
  SWEEP_DEFENSE = "sweep_defense", // tae_sweep_defense - Low defense
  GROUNDING_DEFENSE = "grounding_defense", // gon_grounding_defense - Earth rooting

  // ═══ DARK OPS SPECIALIZED (암살 특수기) ═══
  JAW_DISLOCATION = "jaw_dislocation", // darkops_jaw_dislocation - TMJ attack
  TEMPLE_STRIKE = "temple_strike", // darkops_temple_strike - Temporal bone strike
  CERVICAL_TWIST = "cervical_twist", // darkops_cervical_twist - Neck manipulation
  ELBOW_HYPEREXTEND = "elbow_hyperextend", // darkops_elbow_hyperextend - Joint destruction
  FINGER_BREAK = "finger_break", // darkops_finger_break - Digit targeting
  GUILLOTINE_CHOKE = "guillotine_choke", // darkops_guillotine - Front choke
  JUGULAR_STRIKE = "jugular_strike", // darkops_jugular_strike - Vein targeting
  KNEECAP_STRIKE = "kneecap_strike", // darkops_kneecap_strike - Patella attack
  LARYNX_CRUSH = "larynx_crush", // darkops_larynx_crush - Throat destruction
  OCCIPITAL_STRIKE = "occipital_strike", // darkops_occipital_strike - Skull base
  SCIATIC_NERVE_STRIKE = "sciatic_nerve_strike", // darkops_sciatic_nerve - Leg nerve
  SILENT_TAKEDOWN = "silent_takedown", // darkops_silent_takedown - Stealth attack
  SLEEPER_HOLD = "sleeper_hold", // darkops_sleeper_hold - Sleep choke
  SPLEEN_RUPTURE = "spleen_rupture", // darkops_spleen_rupture - Organ destruction
  TRIANGLE_CHOKE = "triangle_choke", // darkops_triangle_choke - Leg choke
  BRACHIAL_PLEXUS = "brachial_plexus", // darkops_brachial_plexus - Nerve cluster
  FEMORAL_NERVE = "femoral_nerve", // darkops_femoral_nerve - Thigh nerve

  // ═══ ADDITIONAL GEON (건) TECHNIQUES ═══
  HIGH_BLOCK = "high_block", // geon_high_block - Overhead defense
  CRUSHING_ELBOW = "crushing_elbow", // geon_crushing_elbow - Downward elbow
  THUNDEROUS_UPPERCUT = "thunderous_uppercut", // geon_thunderous_uppercut - Rising power
  GEON_COUNTER = "geon_counter", // geon_counter_strike - Heaven counter
  GEON_ROUNDHOUSE = "geon_roundhouse", // geon_roundhouse - Power kick

  // ═══ ADDITIONAL TAE (태) TECHNIQUES ═══
  FLOWING_ARM_BAR = "flowing_arm_bar", // tae_flowing_arm_bar - Fluid armlock
  SPIRAL_SHOULDER_THROW = "spiral_shoulder_throw", // tae_spiral_shoulder_throw - Circular throw
  WRIST_LOCK_STRIKE = "wrist_lock_strike", // tae_wrist_lock_strike - Lock with strike

  // ═══ ADDITIONAL LI (리) TECHNIQUES ═══
  PHOENIX_EYE_STRIKE = "phoenix_eye_strike", // li_phoenix_eye_strike - Single knuckle
  NERVE_STRIKE_COUNTER = "nerve_strike_counter", // li_nerve_strike_counter - Pressure counter
  SOLAR_PLEXUS_SPEAR = "solar_plexus_spear", // li_solar_plexus_spear - Diaphragm thrust
  LI_SOLAR_PLEXUS = "li_solar_plexus", // li_solar_plexus - Precision strike

  // ═══ ADDITIONAL JIN (진) TECHNIQUES ═══
  EXPLOSIVE_KNEE = "explosive_knee", // jin_explosive_knee - Thundering knee
  LIGHTNING_STRAIGHT = "lightning_straight", // jin_lightning_straight - Fast cross
  SHOCKING_COUNTER = "shocking_counter", // jin_shocking_counter - Thunder counter
  SHOCKING_HAMMER_FIST = "shocking_hammer_fist", // jin_shocking_hammer_fist - Power hammer

  // ═══ ADDITIONAL SON (손) TECHNIQUES ═══
  PENETRATING_PALM_RUSH = "penetrating_palm_rush", // son_penetrating_palm_rush - Wind palm barrage
  PRESSURE_COUNTER = "pressure_counter", // son_pressure_counter - Continuous counter
  PRESSURE_POINT_CHAIN = "pressure_point_chain", // son_pressure_point_chain - Multiple points

  // ═══ ADDITIONAL GAM (감) TECHNIQUES ═══
  FLOWING_RIVER_STRIKE = "flowing_river_strike", // gam_flowing_river_strike - Water flow attack
  REDIRECTION_COUNTER = "redirection_counter", // gam_redirection_counter - Momentum counter
  TIDAL_WAVE_PALM = "tidal_wave_palm", // gam_tidal_wave_palm - Wave impact
  WHIRLPOOL_COUNTER = "whirlpool_counter", // gam_whirlpool_counter - Circular counter

  // ═══ ADDITIONAL GAN (간) TECHNIQUES ═══
  AVALANCHE_HAMMER = "avalanche_hammer", // gan_avalanche_hammer - Crushing force
  COUNTER_FORTRESS = "counter_fortress", // gan_counter_fortress - Immovable counter
  FORTRESS_COUNTER_STRIKE = "fortress_counter_strike", // gan_fortress_counter_strike - Defensive strike
  STONE_WALL_THRUST = "stone_wall_thrust", // gan_stone_wall_thrust - Heavy push

  // ═══ ADDITIONAL GON (곤) TECHNIQUES ═══
  EARTHQUAKE_STOMP = "earthquake_stomp", // gon_earthquake_stomp - Ground impact
  GROUND_SWEEP_STRIKE = "ground_sweep_strike", // gon_ground_sweep_strike - Low attack
  ROOTING_TAKEDOWN = "rooting_takedown", // gon_rooting_takedown - Grounding takedown
  TAKEDOWN_COUNTER = "takedown_counter", // gon_takedown_counter - Takedown defense

  // ═══ ARCHETYPE TECHNIQUES (원형 기술) ═══
  // Musa (무사) - Traditional Warrior
  DRAGON_FIST = "dragon_fist", // musa_dragon_fist - Traditional power punch
  IRON_DEFENSE = "iron_defense", // musa_iron_defense - Warrior block
  MOUNTAIN_BREAKER = "mountain_breaker", // musa_mountain_breaker - Devastating strike
  THUNDER_STRIKE = "thunder_strike", // musa_thunder_strike - Powerful attack

  // Amsalja (암살자) - Shadow Assassin
  DEADLY_PRECISION = "deadly_precision", // amsalja_deadly_precision - Lethal accuracy
  SHADOW_NERVE_STRIKE = "shadow_nerve_strike", // amsalja_nerve_strike - Hidden nerve attack
  SHADOW_STRIKE = "shadow_strike", // amsalja_shadow_strike - Stealth attack
  SILENT_DEATH = "silent_death", // amsalja_silent_death - Lethal finisher

  // Hacker (해커) - Cyber Warrior
  CYBER_OVERDRIVE = "cyber_overdrive", // hacker_cyber_overdrive - Enhanced attack
  DATA_STRIKE = "data_strike", // hacker_data_strike - Technical strike
  ELECTRIC_SHOCK = "electric_shock", // hacker_electric_shock - Stunning attack
  SYSTEM_CRASH = "system_crash", // hacker_system_crash - Disabling strike

  // Jeongbo Yowon (정보요원) - Intelligence Operative
  COUNTER_INTELLIGENCE = "counter_intelligence", // jeongbo_counter_intelligence - Defensive counter
  INTELLIGENCE_STRIKE = "intelligence_strike", // jeongbo_intelligence_strike - Calculated attack
  PSYCHOLOGICAL_WARFARE = "psychological_warfare", // jeongbo_psychological_warfare - Mind attack
  TACTICAL_STRIKE = "tactical_strike", // jeongbo_tactical_strike - Strategic hit

  // Jojik Pokryeokbae (조직폭력배) - Organized Crime
  BRUTAL_TAKEDOWN = "brutal_takedown", // jojik_brutal_takedown - Ruthless takedown
  IMPROVISED_WEAPON = "improvised_weapon", // jojik_improvised_weapon - Street fighting
  RUTHLESS_ASSAULT = "ruthless_assault", // jojik_ruthless_assault - Savage attack
  STREET_BRAWL = "street_brawl", // jojik_street_brawl - Dirty fighting

  // Movement (이동)
  STEP_FORWARD = "step_forward",
  STEP_BACK = "step_back",
  SIDESTEP = "sidestep",
  PIVOT = "pivot",
  DUCK = "duck",
  LEAN = "lean",
  WALK = "walk",
  IDLE_STANCE = "idle_stance",
  FORWARD_DASH = "forward_dash",
  BACKWARD_RETREAT = "backward_retreat",
  SIDE_STEP = "side_step",

  // Recovery (복귀)
  RECOVERY = "recovery",

  // Idle/Stance
  IDLE = "idle",
  STANCE = "stance",
}
