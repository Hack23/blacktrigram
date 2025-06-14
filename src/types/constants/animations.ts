/**
 * Animation constants for Black Trigram Korean martial arts
 */

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  // UI animations
  BUTTON_HOVER: 150,
  BUTTON_PRESS: 100,
  MODAL_FADE: 300,
  SCREEN_TRANSITION: 500,

  // Combat animations
  BASIC_ATTACK: 400,
  HEAVY_ATTACK: 600,
  BLOCK: 200,
  DODGE: 300,
  STANCE_CHANGE: 500,

  // Effect animations
  HIT_FLASH: 100,
  DAMAGE_NUMBER: 1000,
  STATUS_EFFECT: 2000,
  PARTICLE_LIFE: 800,

  // Korean martial arts specific
  TRIGRAM_TRANSITION: 600,
  VITAL_POINT_HIGHLIGHT: 300,
  KI_FLOW_PULSE: 1200,
} as const;

// Animation easing curves
export const ANIMATION_EASING = {
  LINEAR: "linear",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
  BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  ELASTIC: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  BACK: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
} as const;

// Animation frame configurations
export const FRAME_CONFIGS = {
  IDLE: {
    frames: 4,
    duration: 1000,
    loop: true,
  },
  WALK: {
    frames: 6,
    duration: 600,
    loop: true,
  },
  ATTACK: {
    frames: 8,
    duration: 400,
    loop: false,
  },
  BLOCK: {
    frames: 3,
    duration: 200,
    loop: false,
  },
  HIT: {
    frames: 4,
    duration: 300,
    loop: false,
  },
} as const;

// Korean martial arts animation sequences
export const KOREAN_MARTIAL_ANIMATIONS = {
  STANCE_TRANSITIONS: {
    GEON_TO_TAE: { frames: 12, duration: 500 },
    TAE_TO_LI: { frames: 10, duration: 450 },
    LI_TO_JIN: { frames: 14, duration: 550 },
    // ... other transitions
  },

  TECHNIQUE_ANIMATIONS: {
    PALM_STRIKE: { frames: 8, duration: 400 },
    FLYING_KICK: { frames: 12, duration: 600 },
    PRESSURE_POINT: { frames: 6, duration: 300 },
    VITAL_POINT_STRIKE: { frames: 10, duration: 500 },
  },
} as const;

export default ANIMATION_DURATIONS;
