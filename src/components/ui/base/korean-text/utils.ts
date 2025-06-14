/**
 * ## Korean Text Utility Functions
 *
 * **Business Purpose:**
 * Core utility functions for Korean text processing, formatting, and validation
 * within Black Trigram's Korean martial arts educational system.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import * as PIXI from "pixi.js";
import type {
  KoreanText,
  KoreanTextSize,
  KoreanTextWeight,
} from "../../../../types/korean-text";
import { KOREAN_TEXT_CONSTANTS } from "./constants";
import {
  KOREAN_COLORS,
  KOREAN_FONT_WEIGHTS,
} from "../../../../types/constants";

// Fix: Define missing interface locally
interface KoreanPixiTextOptions {
  readonly preferKorean?: boolean;
  readonly size?: KoreanTextSize;
  readonly weight?: KoreanTextWeight;
  readonly color?: number;
  readonly fontFamily?: string;
}

// Fix: Define KoreanTextStyleConfig interface
interface KoreanTextStyleConfig {
  readonly size?: KoreanTextSize;
  readonly weight?: KoreanTextWeight;
  readonly color?: number;
  readonly fontFamily?: string;
  readonly fontSize?: number;
  readonly fontWeight?: number;
  readonly align?: "left" | "center" | "right";
  readonly wordWrap?: boolean;
  readonly lineHeight?: number;
}

// Single consolidated implementation - remove all duplicates
export function isKoreanCharacter(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0xac00 && code <= 0xd7af) ||
    (code >= 0x1100 && code <= 0x11ff) ||
    (code >= 0x3130 && code <= 0x318f) ||
    (code >= 0xa960 && code <= 0xa97f) ||
    (code >= 0xd7b0 && code <= 0xd7ff)
  );
}

export function sizeToPixels(size: KoreanTextSize | number): number {
  if (typeof size === "number") return size;
  // Convert type to string for lookup
  const sizeKey = size as keyof typeof KOREAN_TEXT_SIZES;
  return KOREAN_TEXT_SIZES[sizeKey] || 16;
}

export function weightToCSSValue(weight: KoreanTextWeight): number {
  const weightKey = weight as keyof typeof KOREAN_FONT_WEIGHTS;
  return KOREAN_FONT_WEIGHTS[weightKey] || 400;
}

// Fix: Use string literals for compatibility
export function getTextConfigForVariant(
  variant: KoreanTextVariant
): KoreanTextConfig {
  switch (variant) {
    case "primary":
      return {
        variant: "primary",
        size: "large" as any, // Fix: Use type assertion for compatibility
        weight: "bold" as any, // Fix: Use type assertion for compatibility
        order: "korean_first",
        cyberpunk: false,
      };
    case "secondary":
      return {
        variant: "secondary",
        size: "medium" as any, // Fix: Use type assertion for compatibility
        weight: "regular" as any, // Fix: Use type assertion for compatibility
        order: "korean_first",
        cyberpunk: false,
      };
    case "accent":
      return {
        variant: "accent",
        size: "xlarge" as any, // Fix: Use type assertion for compatibility
        weight: "bold" as any, // Fix: Use type assertion for compatibility
        order: "korean_first",
        cyberpunk: true,
      };
    case "combat":
      return {
        variant: "combat",
        size: "large" as any, // Fix: Use type assertion for compatibility
        weight: "bold" as any, // Fix: Use type assertion for compatibility
        order: "korean_first",
        cyberpunk: true,
      };
    default:
      return {
        variant: "primary",
        size: "medium" as any, // Fix: Use type assertion for compatibility
        weight: "regular" as any, // Fix: Use type assertion for compatibility
        order: "korean_first",
        cyberpunk: false,
      };
  }
}

export function hasKoreanText(text: string): boolean {
  const koreanRegex = /[\u3131-\u3163\uac00-\ud7a3]/;
  return koreanRegex.test(text);
}

// Fix: Remove unused import and parameters
export const getTextDirection = (_text: string): "ltr" | "rtl" => {
  return "ltr";
};

export const measureKoreanText = (
  text: string,
  fontSize: number
): { width: number; height: number } => {
  const koreanCharWidth = fontSize * 0.9;
  const englishCharWidth = fontSize * 0.6;

  let width = 0;
  for (const char of text) {
    if (/[\u3130-\u318F\uAC00-\uD7AF]/.test(char)) {
      width += koreanCharWidth;
    } else {
      width += englishCharWidth;
    }
  }

  return {
    width,
    height: fontSize * 1.2,
  };
};

// Fix: Simplified PIXI Text creation functions
export function createKoreanPixiText(
  text: KoreanText,
  options: KoreanPixiTextOptions = {}
): PIXI.Text {
  const {
    preferKorean = true,
    size = "medium" as KoreanTextSize,
    weight = "regular" as KoreanTextWeight,
    color = KOREAN_COLORS.TEXT_PRIMARY,
    fontFamily = KOREAN_FONT_FAMILY,
  } = options;

  const displayText = preferKorean ? text.korean : text.english;
  const fontSize = sizeToPixels(size);
  const fontWeight = weightToCSSValue(weight);

  const textStyle = new PIXI.TextStyle({
    fontFamily,
    fontSize,
    fontWeight: fontWeight.toString() as PIXI.TextStyleFontWeight,
    fill: color,
  });

  return new PIXI.Text(displayText, textStyle);
}

export function getKoreanTextMetrics(
  text: KoreanText,
  options: KoreanPixiTextOptions = {}
): { width: number; height: number } {
  const {
    preferKorean = true,
    size = "medium" as KoreanTextSize,
    weight = "regular" as KoreanTextWeight,
    fontFamily = KOREAN_FONT_FAMILY,
  } = options;

  const displayText = preferKorean ? text.korean : text.english;
  const fontSize = sizeToPixels(size);
  const fontWeight = weightToCSSValue(weight);

  const textStyle = new PIXI.TextStyle({
    fontFamily,
    fontSize,
    fontWeight: fontWeight.toString() as PIXI.TextStyleFontWeight,
  });

  // Use PIXI.Text for measurements instead of TextMetrics
  const tempText = new PIXI.Text(displayText, textStyle);
  return {
    width: tempText.width,
    height: tempText.height,
  };
}

// Fix: Remove unused text parameter
export function formatKoreanText(style: KoreanTextStyleConfig): PIXI.TextStyle {
  const fontSize =
    style.fontSize || sizeToPixels(style.size || ("medium" as KoreanTextSize));
  const fontWeight =
    style.fontWeight ||
    weightToCSSValue(style.weight || ("regular" as KoreanTextWeight));

  return new PIXI.TextStyle({
    fontFamily: style.fontFamily || KOREAN_FONT_FAMILY,
    fontSize,
    fontWeight: fontWeight.toString() as PIXI.TextStyleFontWeight,
    fill: style.color || KOREAN_COLORS.TEXT_PRIMARY,
    align: style.align || "left",
    wordWrap: style.wordWrap || false,
    lineHeight: style.lineHeight,
  });
}

export function sizeToPixelValue(size: KoreanTextSize): number {
  return sizeToPixels(size);
}

// Fix: String-based text formatting
export function formatKoreanTextString(
  text: KoreanText,
  showBoth: boolean = false
): string {
  if (showBoth) {
    return `${text.korean} (${text.english})`;
  }
  return text.korean;
}

// Additional utility functions
export const getTextLanguage = (
  text: string
): "korean" | "english" | "mixed" => {
  const koreanChars = text.split("").filter(isKoreanCharacter).length;
  const totalChars = text.replace(/\s/g, "").length;

  if (koreanChars === 0) return "english";
  if (koreanChars === totalChars) return "korean";
  return "mixed";
};

export const optimizeKoreanTextForDisplay = (
  text: KoreanText,
  maxWidth: number,
  fontSize: number
): string => {
  const estimatedWidth = measureKoreanText(text.korean, fontSize).width;

  if (estimatedWidth <= maxWidth) {
    return text.korean;
  }

  const englishWidth = measureKoreanText(text.english, fontSize).width;
  if (englishWidth <= maxWidth) {
    return text.english;
  }

  const avgCharWidth = fontSize * 0.6;
  const maxChars = Math.floor(maxWidth / avgCharWidth) - 3;
  return text.korean.substring(0, Math.max(1, maxChars)) + "...";
};

/**
 * **Business Logic:** Creates a properly formatted Korean text object
 * with validation for cultural accuracy
 */
export function createKoreanText(
  korean: string,
  english: string,
  romanized?: string
): KoreanText {
  // Validate Korean text contains actual Korean characters
  const hasKorean = /[\u3131-\u318E\uAC00-\uD7A3]/.test(korean);

  if (!hasKorean) {
    console.warn("Korean text validation failed:", korean);
  }

  return {
    korean: korean.trim(),
    english: english.trim(),
    ...(romanized && { romanized: romanized.trim() }),
  };
}

/**
 * **Business Logic:** Formats Korean text for display with cultural sensitivity
 */
export function formatKoreanText(
  text: KoreanText,
  showBoth: boolean = true,
  separator: string = " - "
): string {
  if (showBoth) {
    return `${text.korean}${separator}${text.english}`;
  }
  return text.korean;
}

/**
 * **Business Logic:** Converts Korean text size enum to pixel value
 */
export function sizeToPixelValue(size: KoreanTextSize): number {
  const sizeMap: Record<KoreanTextSize, number> = {
    tiny: KOREAN_TEXT_CONSTANTS.FONT_SIZES.TINY,
    small: KOREAN_TEXT_CONSTANTS.FONT_SIZES.SMALL,
    medium: KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    large: KOREAN_TEXT_CONSTANTS.FONT_SIZES.LARGE,
    xlarge: KOREAN_TEXT_CONSTANTS.FONT_SIZES.XLARGE,
    huge: KOREAN_TEXT_CONSTANTS.FONT_SIZES.HUGE,
  };

  return sizeMap[size] || KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM;
}

/**
 * **Business Logic:** Converts Korean text weight enum to CSS font weight
 */
export function weightToFontWeight(weight: KoreanTextWeight): string {
  const weightMap: Record<KoreanTextWeight, string> = {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    heavy: "900",
  };

  return weightMap[weight] || "400";
}

/**
 * **Business Logic:** Validates Korean text for cultural appropriateness
 */
export function validateKoreanText(text: string): {
  isValid: boolean;
  hasKorean: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const hasKorean = /[\u3131-\u318E\uAC00-\uD7A3]/.test(text);

  if (!hasKorean) {
    warnings.push("Text does not contain Korean characters");
  }

  // Check for potentially inappropriate romanizations
  const suspiciousPatterns = [
    /\b(ninja|samurai|sensei)\b/i, // Japanese terms
    /\b(kung fu|chi)\b/i, // Chinese terms
  ];

  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      warnings.push("Text may contain non-Korean martial arts terminology");
    }
  });

  return {
    isValid: warnings.length === 0 && hasKorean,
    hasKorean,
    warnings,
  };
}

/**
 * **Business Logic:** Calculates optimal line height for Korean text display
 */
export function calculateKoreanLineHeight(fontSize: number): number {
  return Math.ceil(fontSize * KOREAN_TEXT_CONSTANTS.LAYOUT.LINE_HEIGHT_RATIO);
}

/**
 * **Business Logic:** Wraps Korean text to fit within specified width
 */
export function wrapKoreanText(
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  // Simplified Korean text wrapping - can be enhanced with proper Korean word boundaries
  const avgCharWidth = fontSize * 0.6; // Approximate Korean character width
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);

  const lines: string[] = [];
  let currentLine = "";

  for (const char of text) {
    if (currentLine.length >= charsPerLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine += char;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * **Business Logic:** Gets appropriate Korean font family based on context
 */
export function getKoreanFontFamily(
  context: "display" | "body" | "mono" = "body"
): string {
  switch (context) {
    case "display":
      return KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.DISPLAY;
    case "mono":
      return KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.MONO;
    default:
      return KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.PRIMARY;
  }
}

export default {
  createKoreanText,
  formatKoreanText,
  sizeToPixelValue,
  weightToFontWeight,
  validateKoreanText,
  calculateKoreanLineHeight,
  wrapKoreanText,
  getKoreanFontFamily,
};
