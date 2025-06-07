import * as PIXI from "pixi.js";

// Korean text size constants
export const KOREAN_TEXT_SIZES = {
  xsmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  title: 48,
} as const;

// Korean font weight constants
export const KOREAN_FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600, // Added missing semibold
  bold: 700,
  heavy: 900,
} as const;

// Korean font family constants
export const KOREAN_FONT_FAMILY =
  '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif';

// PixiJS compatible text style options
export interface KoreanTextStyleOptions extends Partial<PIXI.TextStyleOptions> {
  // Korean specific extensions
  hangeulSpacing?: number;
  verticalAlignment?: "top" | "middle" | "bottom";
  koreanEmphasis?: "normal" | "bold" | "outline" | "glow";
}

// Base Korean text styles for different contexts
export const KOREAN_BASE_TEXT_STYLES: Record<string, KoreanTextStyleOptions> = {
  default: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.medium,
    fontWeight:
      KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
    fill: 0xffffff,
    align: "left",
  },
  title: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.title,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
    fill: 0x00ffcc,
    align: "center",
  },
  body: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.medium,
    fontWeight:
      KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
    fill: 0xcccccc,
    wordWrap: true,
    wordWrapWidth: 400,
  },
  small: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.small,
    fontWeight:
      KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
    fill: 0x999999,
  },
};

// Combat specific text styles
export const COMBAT_TEXT_STYLES: Record<string, KoreanTextStyleOptions> = {
  damage: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.large,
    fontWeight: KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
    fill: 0xff4444,
    stroke: { color: 0x000000, width: 2 },
  },
  critical: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.xlarge,
    fontWeight:
      KOREAN_FONT_WEIGHTS.heavy.toString() as PIXI.TextStyleFontWeight,
    fill: 0xffaa00,
    stroke: { color: 0x000000, width: 3 },
    dropShadow: {
      color: 0xff0000,
      blur: 4,
      distance: 2,
    },
  },
  status: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.small,
    fontWeight:
      KOREAN_FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight,
    fill: 0x00ff88,
  },
};

// UI specific text styles
export const UI_TEXT_STYLES: Record<string, KoreanTextStyleOptions> = {
  button: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.medium,
    fontWeight:
      KOREAN_FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
    fill: 0xffffff,
    align: "center",
  },
  menu: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.large,
    fontWeight:
      KOREAN_FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight,
    fill: 0x00ffcc,
    align: "center",
  },
  label: {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: KOREAN_TEXT_SIZES.small,
    fontWeight:
      KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
    fill: 0xaaaaaa,
  },
};

// Export convenience type
export type KoreanTextSize = keyof typeof KOREAN_TEXT_SIZES;
export type KoreanFontWeight = keyof typeof KOREAN_FONT_WEIGHTS;
