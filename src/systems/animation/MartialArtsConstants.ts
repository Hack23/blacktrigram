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

  // Elbow/Knee (팔꿈치/무릎)
  ELBOW_STRIKE = "elbow_strike",
  KNEE_STRIKE = "knee_strike",
  ELBOW_UPPERCUT = "elbow_uppercut",
  FLYING_KNEE = "flying_knee",
  CLINCH_KNEE = "clinch_knee",
  SPINNING_ELBOW = "spinning_elbow",

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

  // Counters (반격)
  COUNTER_STRIKE = "counter_strike",
  PARRY_COUNTER = "parry_counter",
  COUNTER_ATTACK = "counter_attack",

  // Defense (방어)
  BLOCK = "block",
  BLOCK_HIGH = "block_high",
  BLOCK_LOW = "block_low",
  PARRY = "parry",

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
