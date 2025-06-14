/**
 * ## Korean PixiJS Text Utilities - Type Definitions and Functions
 *
 * **Business Purpose:**
 * Provides comprehensive Korean text handling utilities for PixiJS components
 * with proper TypeScript typing and cultural accuracy validation.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import type * as PIXI from "pixi.js";
import { KOREAN_TEXT_CONSTANTS } from "../constants";

export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

export interface KoreanPixiTextStyle {
  fontSize?: number;
  fill?: number;
  fontWeight?: string;
  align?: string;
  wordWrap?: boolean;
  wordWrapWidth?: number;
}

export interface KoreanPixiTextProps {
  text: KoreanText;
  style?: PIXI.TextStyle;
  showRomanization?: boolean;
  x?: number;
  y?: number;
  anchor?: number | { x: number; y: number };
}

/**
 * **Business Logic:** Creates properly configured PIXI TextStyle for Korean text
 * with cultural accuracy and readability optimization
 */
export function createKoreanTextStyle(
  options: KoreanPixiTextStyle = {}
): PIXI.TextStyle {
  const PIXI = require("pixi.js");

  return new PIXI.TextStyle({
    fontFamily: KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.PRIMARY,
    fontSize: options.fontSize || KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    fill: (options.fill ||
      KOREAN_TEXT_CONSTANTS.COLORS.PRIMARY) as PIXI.ColorSource,
    fontWeight: options.fontWeight || "normal",
    align: options.align || "left",
    wordWrap: options.wordWrap || false,
    wordWrapWidth: options.wordWrapWidth || 300,
    lineHeight: KOREAN_TEXT_CONSTANTS.LAYOUT.LINE_HEIGHT_RATIO,
    letterSpacing: KOREAN_TEXT_CONSTANTS.LAYOUT.LETTER_SPACING,
  });
}

/**
 * **Business Logic:** Formats Korean text for display with optional romanization
 * following Korean language display conventions
 */
export function getDisplayText(
  text: KoreanText,
  showRomanization: boolean = false
): string {
  if (showRomanization && text.romanized) {
    return `${text.korean} (${text.romanized})`;
  }
  return text.korean;
}

/**
 * **Business Logic:** Pre-configured PIXI TextStyles for common Korean text use cases
 */
export const KOREAN_TEXT_STYLES = {
  heading: createKoreanTextStyle({
    fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.LARGE,
    fontWeight: "bold",
    fill: KOREAN_TEXT_CONSTANTS.COLORS.ACCENT,
  }),
  body: createKoreanTextStyle({
    fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    fill: KOREAN_TEXT_CONSTANTS.COLORS.PRIMARY,
  }),
  small: createKoreanTextStyle({
    fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.SMALL,
    fill: KOREAN_TEXT_CONSTANTS.COLORS.SECONDARY,
  }),
  accent: createKoreanTextStyle({
    fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    fontWeight: "bold",
    fill: KOREAN_TEXT_CONSTANTS.COLORS.ACCENT,
  }),
};

export default {
  createKoreanTextStyle,
  getDisplayText,
  KOREAN_TEXT_STYLES,
};
