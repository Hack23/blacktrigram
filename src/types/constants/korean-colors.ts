/**
 * Korean Color Palette Constants
 * Traditional Korean colors with cyberpunk accents for the Black Trigram game
 */

export const KOREAN_COLORS = {
  // Text Colors
  TEXT_PRIMARY: 0xffffff,
  TEXT_SECONDARY: 0xcccccc,
  TEXT_TERTIARY: 0x999999,
  TEXT_DISABLED: 0x666666,

  // Basic Colors
  BLACK_SOLID: 0x000000,
  WHITE_SOLID: 0xffffff,
  TRANSPARENT: 0x000000, // With alpha 0

  // Cardinal Direction Colors
  CARDINAL_EAST: 0x00ff68,
  CARDINAL_WEST: 0xffffff,
  CARDINAL_SOUTH: 0xfd4a64,
  CARDINAL_NORTH: 0x000000,
  CARDINAL_CENTER: 0xffcc00,

  // UI Colors
  UI_BACKGROUND_DARK: 0x1a1a2e,
  UI_BACKGROUND_MEDIUM: 0x2d2d42,
  UI_BACKGROUND_LIGHT: 0x4a4a6b,
  UI_BORDER: 0x666680,
  UI_GRAY: 0x808080,
  UI_STEEL_GRAY: 0x6b7280,
  UI_LIGHT_GRAY: 0xcccccc,
  UI_DARK_GRAY: 0x2d2d2d,
  UI_DISABLED_BG: 0x374151,
  UI_DISABLED_FILL: 0x4b5563,
  UI_DISABLED_BORDER: 0x6b7280,
  UI_DISABLED_TEXT: 0x9ca3af,

  // Primary Colors
  PRIMARY_RED: 0xcf1b1b,
  PRIMARY_GOLD: 0xffcc00,
  PRIMARY_BLUE: 0x1e40af,
  PRIMARY_CYAN: 0x00bfff,

  // Accent Colors
  ACCENT_GOLD: 0xffd700,
  ACCENT_CYAN: 0x00e5ff,
  ACCENT_BLUE: 0x2563eb,
  ACCENT_PURPLE: 0x8b5cf6,
  ACCENT_RED: 0xdc2626,
  ACCENT_GREEN: 0x10b981,
  ACCENT_ORANGE: 0xf97316,

  // Secondary Colors
  SECONDARY_YELLOW: 0xfdba74,
  SECONDARY_MAGENTA: 0xe879f9,

  // Status Colors
  POSITIVE_GREEN: 0x22c55e,
  WARNING_YELLOW: 0xfde047,
  WARNING_ORANGE: 0xfb923c,
  NEGATIVE_RED: 0xef4444,
  NEGATIVE_RED_DARK: 0xb91c1c,
  CRITICAL_HIT: 0xff6b6b,
  NEUTRAL_GRAY: 0x6b7280,

  // Player Colors
  PLAYER_1_COLOR: 0x3b82f6,
  PLAYER_2_COLOR: 0xef4444,

  // Trigram Stance Colors
  TRIGRAM_GEON_PRIMARY: 0xffd700, // Heaven - Gold
  TRIGRAM_TAE_PRIMARY: 0xe6e6fa, // Lake - Light Purple
  TRIGRAM_LI_PRIMARY: 0xff4500, // Fire - Orange Red
  TRIGRAM_JIN_PRIMARY: 0x8b4513, // Thunder - Brown
  TRIGRAM_SON_PRIMARY: 0x32cd32, // Wind - Lime Green
  TRIGRAM_GAM_PRIMARY: 0x191970, // Water - Midnight Blue
  TRIGRAM_GAN_PRIMARY: 0xa0522d, // Mountain - Sienna
  TRIGRAM_GON_PRIMARY: 0x8b4513, // Earth - Saddle Brown
} as const;

export type KoreanColorKey = keyof typeof KOREAN_COLORS;
export type KoreanColorValue = (typeof KOREAN_COLORS)[KoreanColorKey];
