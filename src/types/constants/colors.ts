/**
 * Color constants for Black Trigram (흑괘)
 * Defines both traditional Korean colors and a cyberpunk palette.
 */
import { lightenColor /* hexToNumeric */ } from "../../utils/colorUtils"; // hexToNumeric unused

// Cyberpunk Color Palette (Numeric values for PixiJS)
export const CYBERPUNK_PALETTE = {
  PRIMARY_CYAN: 0x00e0ff,
  PRIMARY_CYAN_LIGHT: 0x7ffff,
  PRIMARY_CYAN_DARK: 0x00aacc,
  SECONDARY_MAGENTA: 0xff00ff,
  SECONDARY_MAGENTA_LIGHT: 0xff7fff,
  SECONDARY_MAGENTA_DARK: 0xcc00cc,
  ACCENT_YELLOW: 0xffeb3b, // Bright yellow
  ACCENT_ORANGE: 0xff9800, // Bright orange
  ACCENT_RED: 0xf44336, // Bright red
  ACCENT_GREEN: 0x4caf50, // Bright green
  ACCENT_BLUE: 0x2196f3, // Bright blue
  ACCENT_PURPLE: 0x9c27b0, // Bright purple
  ACCENT_GOLD: 0xffd700, // Gold for highlights

  NEON_PINK: 0xff007f,
  NEON_GREEN: 0x39ff14,
  NEON_BLUE: 0x00c5ff, // Alias for PRIMARY_CYAN or specific neon blue
  NEON_ORANGE: 0xffa500,
  NEON_YELLOW: 0xffff00,

  // UI & Text Colors
  TEXT_PRIMARY: 0xe0e0e0, // Light gray for primary text
  TEXT_SECONDARY: 0xb0b0b0, // Medium gray for secondary text
  TEXT_TERTIARY: 0x757575, // Dark gray for tertiary/disabled text
  TEXT_ACCENT: 0x00e0ff, // Cyan for accented text, same as PRIMARY_CYAN
  TEXT_ERROR: 0xff4444, // Red for error messages
  TEXT_WARNING: 0xffbb33, // Orange/Yellow for warnings
  TEXT_SUCCESS: 0x00c851, // Green for success messages
  TEXT_LINK: 0x00e0ff, // Cyan for links

  // UI Background colors
  UI_BACKGROUND_DEEP_DARK: 0x0a0a0f, // Very dark, almost black with a hint of blue/purple
  UI_BACKGROUND_DARK: 0x0a0a0a, // Dark gray/blue, common cyberpunk bg
  UI_BACKGROUND_DARK_TRANSLUCENT: 0x0a0a0a, // Added missing color
  UI_BACKGROUND_MEDIUM: 0x1a1a1a, // Medium dark gray/blue
  UI_BACKGROUND_LIGHT: 0x2a2a2a, // Lighter gray/blue for surfaces
  UI_BACKGROUND_SURFACE: 0x1a1a24, // For cards, modals, elevated surfaces

  UI_BORDER: 0x4a4a5a, // Border color for UI elements
  UI_DIVIDER: 0x383848, // Divider line color

  UI_BUTTON_BG: 0x252530,
  UI_BUTTON_HOVER_BG: 0x353542,
  UI_BUTTON_ACTIVE_BG: 0x1c1c24,
  UI_BUTTON_TEXT: 0xe0e0e0,

  UI_INPUT_BG: 0x15151f,
  UI_INPUT_BORDER: 0x3a3a4a,
  UI_INPUT_TEXT: 0xe0e0e0,
  UI_INPUT_PLACEHOLDER: 0x6a6a7a,

  UI_SCROLLBAR_BG: 0x15151f,
  UI_SCROLLBAR_THUMB: 0x3a3a4a,

  UI_STEEL_GRAY: 0x78909c, // Muted steel gray for less prominent elements
  UI_LIGHT_GRAY: 0xb0bec5, // Light gray for backgrounds or text
  UI_DARK_GRAY: 0x37474f, // Dark gray for backgrounds or text

  UI_DISABLED_BG: 0x424242,
  UI_DISABLED_TEXT: 0x757575,
  UI_DISABLED_BORDER: 0x555555,

  // Semantic Colors
  POSITIVE_GREEN: 0x00e676,
  POSITIVE_GREEN_LIGHT: 0x66ffa6,
  NEGATIVE_RED: 0xff5252,
  NEGATIVE_RED_LIGHT: 0xff867f,
  NEGATIVE_RED_DARK: 0xc50e29,
  WARNING_YELLOW: 0xffc107,
  WARNING_ORANGE: 0xff9800, // Re-using ACCENT_ORANGE
  INFO_BLUE: 0x03a9f4, // Re-using a bright blue

  // Game Specific Status Colors
  STATUS_HEALTH_GREEN: 0x2ecc71, // Specific green for health
  STATUS_KI_BLUE: 0x3498db, // Specific blue for Ki
  STATUS_STAMINA_YELLOW: 0xf1c40f, // Specific yellow for stamina
  STATUS_STUNNED_YELLOW: 0xffeb3b, // Same as ACCENT_YELLOW
  STATUS_POISON_GREEN: 0x66bb6a, // Muted green for poison
  STATUS_BLEED_RED: 0xe57373, // Lighter red for bleed
  STATUS_BURN_ORANGE: 0xff7043, // Fiery orange for burn

  // Other
  BLACK_SOLID: 0x000000,
  WHITE_SOLID: 0xffffff,
  TRANSPARENT: 0x000000, // Use with alpha 0 for transparency
} as const;

export const KOREAN_TRADITIONAL_COLORS = {
  HANJI_WHITE: 0xfaf8f3, // Off-white like traditional Korean paper
  GIWA_GRAY: 0x5f6260, // Dark gray like traditional roof tiles
  DANCHEONG_RED: 0xd7292c, // Bright red used in palace paintings
  DANCHEONG_BLUE: 0x2a5caa, // Bright blue
  DANCHEONG_GREEN: 0x3a8e58, // Bright green
  DANCHEONG_YELLOW: 0xfddc2c, // Bright yellow
  OCHRE_YELLOW: 0xe2a120, // Earthy yellow
  INDIGO_BLUE: 0x3f51b5, // Deep blue
  JADE_GREEN: 0x80cbc4, // Light jade green
  PLUM_PURPLE: 0x6a1b9a, // Deep plum color
} as const;

export const KOREAN_COLORS = {
  ...CYBERPUNK_PALETTE,
  ...KOREAN_TRADITIONAL_COLORS,

  // Specific overrides or additions if needed
  DOJANG_BLUE: lightenColor(CYBERPUNK_PALETTE.PRIMARY_CYAN, -60), // Darker, more subdued blue
  TRADITIONAL_RED: 0xb71c1c, // 진홍 (Jinhong) - Crimson Red, more traditional

  // Status colors that might need specific shades not in cyberpunk palette
  STATUS_HEALTH_LOW: lightenColor(CYBERPUNK_PALETTE.NEGATIVE_RED, 20), // Lighter red for low health warning
  STATUS_KI_LOW: lightenColor(CYBERPUNK_PALETTE.PRIMARY_BLUE, -30), // Darker blue for low KI
  STATUS_STAMINA_LOW: lightenColor(CYBERPUNK_PALETTE.WARNING_YELLOW, 10), // Brighter yellow for low stamina

  // Theme colors for Trigrams (example, can be more detailed)
  TRIGRAM_GEON_PRIMARY: CYBERPUNK_PALETTE.WHITE_SOLID,
  TRIGRAM_TAE_PRIMARY: CYBERPUNK_PALETTE.ACCENT_BLUE,
  TRIGRAM_LI_PRIMARY: CYBERPUNK_PALETTE.ACCENT_RED,
  TRIGRAM_JIN_PRIMARY: CYBERPUNK_PALETTE.ACCENT_YELLOW,
  TRIGRAM_SON_PRIMARY: CYBERPUNK_PALETTE.ACCENT_GREEN,
  TRIGRAM_GAM_PRIMARY: CYBERPUNK_PALETTE.PRIMARY_CYAN_DARK,
  TRIGRAM_GAN_PRIMARY: CYBERPUNK_PALETTE.UI_STEEL_GRAY,
  TRIGRAM_GON_PRIMARY: KOREAN_TRADITIONAL_COLORS.OCHRE_YELLOW,

  // Add missing colors referenced in components
  WHITE: 0xffffff,
  ACCENT_PRIMARY: 0x00ffff,
  ACCENT_PRIMARY_LIGHT: 0x40ffff,
  SECONDARY_BLUE_DARK: 0x1a1a3e,
  SECONDARY_YELLOW_LIGHT: 0xffff80,
  PRIMARY_BLUE_LIGHT: 0x6666ff,
  BACKGROUND_DARK: 0x0a0a0a,
  BACKGROUND_MODAL: 0x1a1a1a,
  ACCENT_CYAN: 0x00ffff,
} as const;

export type KoreanColor = keyof typeof KOREAN_COLORS;
