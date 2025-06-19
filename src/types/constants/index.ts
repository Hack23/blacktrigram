/**
 * Main constants export for Black Trigram Korean martial arts system
 */

// Fix: Remove duplicate exports and ensure proper imports
export { KOREAN_COLORS } from "./colors";
export { CYBERPUNK_COLORS } from "./colors";
export { GAME_CONFIG, COMBAT_TIMING, DAMAGE_CONSTANTS } from "./game";
export { COMBAT_CONFIG, COMBAT_CONSTANTS } from "./combat";
export { PLAYER_ARCHETYPES_DATA } from "./player";
export { TRIGRAM_TECHNIQUES, TECHNIQUE_PROPERTIES } from "./techniques";
export { TRIGRAM_DATA, TRIGRAM_STANCES_ORDER } from "./trigram";
export {
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  KOREAN_TEXT_SIZES,
  KOREAN_FONT_FAMILY,
  KOREAN_FONT_WEIGHTS,
  PIXI_TEXT_STYLES,
} from "./typography";
export { UI_CONSTANTS, HEALTH_COLORS } from "./ui";

// Fix: Provide default export
export { KOREAN_COLORS as default } from "./colors";

// Fix: Export COMBAT_CONTROLS from controls
export { COMBAT_CONTROLS } from "./controls";

// Fix: Add missing KOREAN_TYPOGRAPHY export
export { KOREAN_TYPOGRAPHY } from "./typography";

// Fix: Add missing PIXI_FONT_WEIGHTS export
export { PIXI_FONT_WEIGHTS } from "./typography";

// Fix: Add missing ANIMATION_DURATIONS export
export { ANIMATION_DURATIONS } from "./animations";

// Fix: Add missing VITAL_POINT_REGIONS export
export { VITAL_POINT_REGIONS } from "./vital-points";

export const ARCHETYPE_TECHNIQUE_BONUSES: Record<
  string,
  Record<string, number>
> = {
  // Define bonuses for each archetype
};

export const ENHANCED_DAMAGE_CONSTANTS = {
  CRITICAL_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,
  COMBO_MULTIPLIER: 1.2,
} as const;

// Fix: Add missing STANCE_EFFECTIVENESS_MATRIX
export const STANCE_EFFECTIVENESS_MATRIX: Record<
  string,
  Record<string, number>
> = {
  geon: {
    gon: 1.2,
    son: 0.8,
  },
  tae: {
    jin: 1.2,
    gan: 0.8,
  },
  li: {
    gam: 1.2,
    tae: 0.8,
  },
  jin: {
    son: 1.2,
    geon: 0.8,
  },
  son: {
    gon: 1.2,
    li: 0.8,
  },
  gam: {
    li: 1.2,
    jin: 0.8,
  },
  gan: {
    tae: 1.2,
    gam: 0.8,
  },
  gon: {
    geon: 1.2,
    son: 0.8,
  },
};

export const MAX_TRANSITION_COST_KI = 50;
export const MAX_TRANSITION_COST_STAMINA = 30;
export const MAX_TRANSITION_TIME_MILLISECONDS = 1000;

// Re-export from sub-modules
export * from "./trigram";
export * from "./techniques";
export * from "./player";
export * from "./vital-points";

// Fix: Re-export properly to avoid circular dependencies
export type { TrigramStanceData } from "./trigram";

// First, let's check what's actually in KOREAN_COLORS and fix the color constants

export const KOREAN_COLORS = {
  // Text colors
  TEXT_DISABLED: 0x666666,
  TEXT_PRIMARY: 0xffffff,
  TEXT_SECONDARY: 0xcccccc,
  TEXT_TERTIARY: 0x999999,

  // Cardinal directions (existing)
  CARDINAL_EAST: 0x00ff88,
  CARDINAL_WEST: 0xffffff,
  CARDINAL_SOUTH: 0xff4444,
  CARDINAL_NORTH: 0x000000,
  CARDINAL_CENTER: 0xffcc00,

  // UI colors
  UI_BACKGROUND_DARK: 0x1a1a2e,
  UI_BACKGROUND_MEDIUM: 0x2d2d44,
  UI_BACKGROUND_LIGHT: 0x404060,
  UI_BORDER: 0x555577,
  UI_GRAY: 0x666666,
  UI_DARK_GRAY: 0x2d2d2d,
  UI_DISABLED_FILL: 0x444444,
  UI_DISABLED_BORDER: 0x333333,
  UI_DISABLED_TEXT: 0x777777,
  UI_DISABLED_BG: 0x2a2a2a,
  UI_STEEL_GRAY: 0x708090,

  // Accent colors
  ACCENT_GOLD: 0xffd700,
  ACCENT_CYAN: 0x00ffff,
  ACCENT_BLUE: 0x4169e1,
  ACCENT_RED: 0xff4500,
  ACCENT_GREEN: 0x32cd32,
  ACCENT_PURPLE: 0x9370db,
  ACCENT_ORANGE: 0xff8c00,

  // Primary colors
  PRIMARY_CYAN: 0x00ced1,
  PRIMARY_BLUE: 0x0080ff,

  // Secondary colors
  SECONDARY_YELLOW: 0xffd700,
  SECONDARY_MAGENTA: 0xff69b4,

  // Status colors
  POSITIVE_GREEN: 0x00ff00,
  NEGATIVE_RED: 0xff0000,
  NEGATIVE_RED_DARK: 0x8b0000,
  WARNING_YELLOW: 0xffff00,
  WARNING_ORANGE: 0xffa500,
  NEUTRAL_GRAY: 0x808080,

  // Special colors
  BLACK_SOLID: 0x000000,
  WHITE_SOLID: 0xffffff,
  TRANSPARENT: 0x000000,

  // Player colors
  PLAYER_1_COLOR: 0x00bfff,
  PLAYER_2_COLOR: 0xff69b4,

  // Critical hit color
  CRITICAL_HIT: 0xff6347,

  // Trigram colors
  TRIGRAM_GEON_PRIMARY: 0xffd700,
  TRIGRAM_TAE_PRIMARY: 0xff69b4,
  TRIGRAM_LI_PRIMARY: 0xff4500,
  TRIGRAM_JIN_PRIMARY: 0x32cd32,
  TRIGRAM_SON_PRIMARY: 0x9370db,
  TRIGRAM_GAM_PRIMARY: 0x00ced1,
  TRIGRAM_GAN_PRIMARY: 0x8b4513,
  TRIGRAM_GON_PRIMARY: 0x2f4f4f,
} as const;

export type KoreanColorKey = keyof typeof KOREAN_COLORS;
