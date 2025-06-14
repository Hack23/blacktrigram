/**
 * UI constants for Black Trigram Korean martial arts interface
 */

import { KOREAN_COLORS } from "./colors";

// Layout dimensions
export const UI_DIMENSIONS = {
  HEADER_HEIGHT: 80,
  FOOTER_HEIGHT: 60,
  SIDEBAR_WIDTH: 250,
  CONTENT_PADDING: 20,

  // Button sizes
  BUTTON_SMALL: { width: 80, height: 32 },
  BUTTON_MEDIUM: { width: 120, height: 40 },
  BUTTON_LARGE: { width: 200, height: 50 },

  // Modal sizes
  MODAL_SMALL: { width: 400, height: 300 },
  MODAL_MEDIUM: { width: 600, height: 450 },
  MODAL_LARGE: { width: 800, height: 600 },
} as const;

// Z-index layers
export const Z_INDEX = {
  BACKGROUND: 0,
  GAME_WORLD: 100,
  UI_BACKGROUND: 200,
  UI_ELEMENTS: 300,
  MODALS: 400,
  TOOLTIPS: 500,
  DEBUG_OVERLAY: 1000,
} as const;

// UI spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Border radius values
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 9999,
} as const;

// Shadow definitions
export const SHADOWS = {
  SM: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  MD: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  LG: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  XL: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  CYBER: "0 0 20px rgba(0, 255, 255, 0.3)",
  KOREAN_GLOW: "0 0 15px rgba(255, 215, 0, 0.4)",
} as const;

// Animation curves for UI
export const UI_ANIMATIONS = {
  FAST: "150ms ease-out",
  NORMAL: "250ms ease-in-out",
  SLOW: "400ms ease-in-out",
  BOUNCE: "300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

// Button states
export const BUTTON_STATES = {
  NORMAL: {
    background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    border: KOREAN_COLORS.UI_BORDER,
    text: KOREAN_COLORS.TEXT_PRIMARY,
    alpha: 1.0,
  },
  HOVER: {
    background: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
    border: KOREAN_COLORS.ACTIVE_BORDER,
    text: KOREAN_COLORS.TEXT_ACCENT,
    alpha: 1.0,
  },
  PRESSED: {
    background: KOREAN_COLORS.UI_BACKGROUND_DARK,
    border: KOREAN_COLORS.ACTIVE_BORDER,
    text: KOREAN_COLORS.TEXT_ACCENT,
    alpha: 0.8,
  },
  DISABLED: {
    background: KOREAN_COLORS.UI_DISABLED_FILL,
    border: KOREAN_COLORS.UI_DISABLED_BORDER,
    text: KOREAN_COLORS.TEXT_TERTIARY,
    alpha: 0.5,
  },
} as const;

// Health bar colors
export const HEALTH_COLORS = {
  FULL: KOREAN_COLORS.POSITIVE_GREEN,
  HIGH: KOREAN_COLORS.ACCENT_YELLOW,
  MEDIUM: KOREAN_COLORS.WARNING_ORANGE,
  LOW: KOREAN_COLORS.WARNING_YELLOW,
  CRITICAL: KOREAN_COLORS.NEGATIVE_RED,
  UNCONSCIOUS: KOREAN_COLORS.UI_GRAY,
} as const;

// Status effect colors
export const STATUS_COLORS = {
  POSITIVE: KOREAN_COLORS.POSITIVE_GREEN,
  NEGATIVE: KOREAN_COLORS.NEGATIVE_RED,
  NEUTRAL: KOREAN_COLORS.TEXT_SECONDARY,
  TEMPORARY: KOREAN_COLORS.ACCENT_YELLOW,
  PERMANENT: KOREAN_COLORS.ACCENT_PURPLE,
} as const;

// Combat feedback colors
export const COMBAT_FEEDBACK_COLORS = {
  HIT: KOREAN_COLORS.ACCENT_RED,
  CRITICAL_HIT: KOREAN_COLORS.CRITICAL_HIT,
  BLOCKED: KOREAN_COLORS.BLOCKED_ATTACK,
  MISS: KOREAN_COLORS.UI_GRAY,
  PERFECT: KOREAN_COLORS.PERFECT_STRIKE,
  COUNTER: KOREAN_COLORS.ACCENT_CYAN,
  VITAL_POINT: KOREAN_COLORS.VITAL_POINT_HIT,
} as const;

/**
 * UI Layout and component constants for Korean martial arts game
 */

export const UI_CONSTANTS = {
  // Layout dimensions
  HEADER_HEIGHT: 80,
  FOOTER_HEIGHT: 60,
  SIDEBAR_WIDTH: 240,
  PANEL_WIDTH: 320,

  // Component sizes
  BUTTON_HEIGHT: 48,
  BUTTON_WIDTH: 160,
  INPUT_HEIGHT: 40,
  CARD_MIN_HEIGHT: 120,

  // Spacing
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 16,
  MARGIN_LARGE: 24,
  MARGIN_XLARGE: 32,

  // Borders and radii
  BORDER_RADIUS: 8,
  BORDER_WIDTH: 2,

  // Animation durations (ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,

  // Z-index layers
  Z_BACKGROUND: 0,
  Z_CONTENT: 10,
  Z_OVERLAY: 100,
  Z_MODAL: 1000,
  Z_TOOLTIP: 2000,
} as const;

export const CYBERPUNK_UI_EFFECTS = {
  GLOW_INTENSITY: 0.3,
  PULSE_SPEED: 2.0,
  FLICKER_FREQUENCY: 0.1,
  SCAN_LINE_OPACITY: 0.1,
  NOISE_INTENSITY: 0.05,
} as const;

export const KOREAN_UI_LAYOUTS = {
  // Traditional Korean proportions
  GOLDEN_RATIO: 1.618,
  HANGEUL_LINE_HEIGHT: 1.4,
  KOREAN_ENGLISH_RATIO: 0.7,

  // Text hierarchy
  TITLE_SCALE: 2.0,
  SUBTITLE_SCALE: 1.5,
  BODY_SCALE: 1.0,
  CAPTION_SCALE: 0.8,
} as const;

export default UI_CONSTANTS;
