import type * as PIXI from "pixi.js";
import type {
  KoreanTextSize,
  KoreanFontWeight,
  PixiTextStyleConfig,
  StatusKey,
  MartialVariant,
  // TrigramStance, // Not directly used here, imported in files that need it
} from "../../../../types/korean-text";
import {
  KOREAN_FONT_FAMILY as KOREAN_FONT_FAMILY_CONST,
  KOREAN_TEXT_SIZES as KOREAN_TEXT_SIZES_CONST,
  KOREAN_FONT_WEIGHTS as KOREAN_FONT_WEIGHTS_CONST,
  KOREAN_COLORS,
  TRIGRAM_DATA,
  FONT_FAMILY, // For stance specific colors if needed
} from "../../../../types/constants"; // Main constants

export const KOREAN_FONT_FAMILY = KOREAN_FONT_FAMILY_CONST;
export const KOREAN_TEXT_SIZES = KOREAN_TEXT_SIZES_CONST;
export const KOREAN_FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600, // Add missing semibold
  bold: 700,
  heavy: 900,
} as const;

export const KOREAN_TEXT_DEFAULT_STYLE: Partial<PIXI.TextStyleOptions> = {
  // Changed ITextStyle to TextStyleOptions
  fontFamily: KOREAN_FONT_FAMILY,
  fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
  fill: KOREAN_COLORS.TEXT_PRIMARY,
  align: "left",
  wordWrap: false,
};

// Base styles for variants (can be overridden)
export const KOREAN_BASE_VARIANT_STYLES: Record<
  string, // Allow any string for flexibility, specific variants below
  Partial<PIXI.TextStyleOptions> // Changed ITextStyle to TextStyleOptions
> = {
  default: KOREAN_TEXT_DEFAULT_STYLE,
  title: {
    fontSize: KOREAN_TEXT_SIZES.title, // Use lowercase key
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
    fill: KOREAN_COLORS.ACCENT_PRIMARY,
    align: "center",
  },
  subtitle: {
    fontSize: KOREAN_TEXT_SIZES.large, // Use lowercase key
    fill: KOREAN_COLORS.TEXT_SECONDARY,
    align: "center",
  },
  body: {
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    lineHeight: KOREAN_TEXT_SIZES.medium * 1.5,
  },
  caption: {
    fontSize: KOREAN_TEXT_SIZES.small, // Use lowercase key
    fill: KOREAN_COLORS.TEXT_TERTIARY,
  },
  button: {
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fontWeight:
      KOREAN_FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
    fill: KOREAN_COLORS.TEXT_PRIMARY, // Default button text color
    align: "center",
  },
};

// Specific styles for Korean text components
export const KOREAN_TITLE_TEXT_STYLES: Record<
  "default" | "h1" | "h2" | "h3",
  Partial<PIXI.TextStyleOptions> // Changed ITextStyle to TextStyleOptions
> = {
  default: {
    ...KOREAN_BASE_VARIANT_STYLES.title,
  },
  h1: {
    ...KOREAN_BASE_VARIANT_STYLES.title,
    fontSize: KOREAN_TEXT_SIZES.xlarge, // Use lowercase key
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
    fill: KOREAN_COLORS.ACCENT_PRIMARY,
  },
  h2: {
    ...KOREAN_BASE_VARIANT_STYLES.title,
    fontSize: KOREAN_TEXT_SIZES.large, // Use lowercase key
    fontWeight:
      KOREAN_FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
    fill: KOREAN_COLORS.ACCENT_SECONDARY,
  },
  h3: {
    ...KOREAN_BASE_VARIANT_STYLES.title,
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fontWeight:
      KOREAN_FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
    fill: KOREAN_COLORS.TEXT_PRIMARY,
  },
};

export const KOREAN_TECHNIQUE_TEXT_STYLES: Record<
  "default" | "mastered" | "unavailable",
  Partial<PIXI.TextStyleOptions> // Changed ITextStyle to TextStyleOptions
> = {
  default: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fill: KOREAN_COLORS.TEXT_PRIMARY,
    fontStyle: "italic",
  },
  mastered: {
    fontSize: KOREAN_TEXT_SIZES.large, // Use lowercase key
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
    dropShadow: true,
    dropShadowColor: KOREAN_COLORS.ACCENT_GOLD,
    dropShadowAlpha: 0.5,
    dropShadowBlur: 5,
  },
  unavailable: {
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fill: KOREAN_COLORS.UI_DISABLED_TEXT,
    alpha: 0.7,
  },
};

export const KOREAN_MARTIAL_TEXT_STYLES: Record<
  MartialVariant | "default",
  Partial<PIXI.TextStyleOptions> // Changed ITextStyle to TextStyleOptions
> = {
  default: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fill: KOREAN_COLORS.TEXT_SECONDARY,
  },
  practitioner: {
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fill: KOREAN_COLORS.TEXT_PRIMARY,
    fontWeight:
      KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
  },
  master: {
    fontSize: KOREAN_TEXT_SIZES.large, // Use lowercase key
    fill: KOREAN_COLORS.ACCENT_SECONDARY,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
  },
  grandmaster: {
    fontSize: KOREAN_TEXT_SIZES.xlarge, // Use lowercase key
    fill: KOREAN_COLORS.ACCENT_PRIMARY,
    fontWeight:
      KOREAN_FONT_WEIGHTS.heavy.toString() as PIXI.TextStyleFontWeight,
    dropShadow: true,
    dropShadowColor: KOREAN_COLORS.ACCENT_PRIMARY,
    dropShadowBlur: 4,
  },
};

// For Trigram symbols specifically
export const TRIGRAM_SYMBOL_STYLE: Partial<PIXI.TextStyleOptions> = {
  fontFamily: FONT_FAMILY.SYMBOL, // Assuming a specific symbol font
  fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
  fill: KOREAN_COLORS.TEXT_PRIMARY, // Default, can be overridden by stance theme
};

export const TRIGRAM_SYMBOL_DATA: Record<
  keyof typeof TRIGRAM_DATA, // Use TrigramStance from enums if TRIGRAM_DATA keys match
  string
> = {
  geon: "☰",
  tae: "☱",
  li: "☲",
  jin: "☳",
  son: "☴",
  gam: "☵",
  gan: "☶",
  gon: "☷",
};

// Status Text Styles
export const KOREAN_STATUS_TEXT_STYLES: Record<
  StatusKey | "default",
  Partial<PIXI.TextStyleOptions> // Changed ITextStyle to TextStyleOptions
> = {
  default: {
    fontFamily: FONT_FAMILY.MONO, // Monospaced for numbers often looks good
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
    fill: KOREAN_COLORS.TEXT_PRIMARY,
  },
  // Health related
  health: { fill: KOREAN_COLORS.POSITIVE_GREEN },
  health_critical: {
    fill: KOREAN_COLORS.NEGATIVE_RED,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight, // Use lowercase key
    fontSize: KOREAN_TEXT_SIZES.medium, // Use lowercase key
  },
  // Ki related
  ki: { fill: KOREAN_COLORS.PRIMARY_BLUE },
  ki_depleted: {
    fill: KOREAN_COLORS.PRIMARY_BLUE_DARK, // Darker blue for depleted
    fontStyle: "italic",
    fontSize: KOREAN_TEXT_SIZES.small, // Use lowercase key
  },
  // Stamina related
  stamina: { fill: KOREAN_COLORS.SECONDARY_YELLOW },
  stamina_low: {
    fill: KOREAN_COLORS.WARNING_ORANGE,
    fontWeight:
      KOREAN_FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
    fontSize: KOREAN_TEXT_SIZES.small, // Use lowercase key
  },
  // General states
  consciousness: { fontSize: KOREAN_TEXT_SIZES.medium }, // Use lowercase key
  pain: {
    fill: KOREAN_COLORS.WARNING_ORANGE,
    fontWeight:
      KOREAN_FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight,
  }, // Use lowercase key
  balance: { fontSize: KOREAN_TEXT_SIZES.medium }, // Use lowercase key
  // Debuffs
  stunned: {
    fill: KOREAN_COLORS.STATUS_STUNNED_YELLOW,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString(),
    fontStyle: "italic",
  },
  bleeding: { fill: KOREAN_COLORS.NEGATIVE_RED_LIGHT },
  poisoned: { fill: KOREAN_COLORS.NEGATIVE_GREEN }, // Assuming a poison green
  burning: { fill: KOREAN_COLORS.ACCENT_ORANGE },
  frozen: { fill: KOREAN_COLORS.SECONDARY_BLUE_LIGHT },
  slowed: { fill: KOREAN_COLORS.UI_STEEL_GRAY },
  // Buffs
  hastened: { fill: KOREAN_COLORS.POSITIVE_GREEN_LIGHT },
  // Combat events
  guard_break: {
    fill: KOREAN_COLORS.ACCENT_RED,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString(),
  },
  counter_hit: {
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString(),
  },
  vulnerable: { fill: KOREAN_COLORS.WARNING_YELLOW, fontStyle: "italic" },
  // General UI states
  ready: { fill: KOREAN_COLORS.POSITIVE_GREEN },
  active: { fill: KOREAN_COLORS.ACCENT_PRIMARY },
  inactive: { fill: KOREAN_COLORS.UI_DISABLED_TEXT },
  success: {
    fill: KOREAN_COLORS.POSITIVE_GREEN,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString(),
  },
  failure: {
    fill: KOREAN_COLORS.NEGATIVE_RED,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString(),
  },
  warning: {
    fill: KOREAN_COLORS.WARNING_YELLOW,
    fontWeight: KOREAN_FONT_WEIGHTS.semibold.toString(),
  },
  info: {
    fill: KOREAN_COLORS.TEXT_SECONDARY,
    fontWeight: KOREAN_FONT_WEIGHTS.medium.toString(),
  }, // Use lowercase key
};
