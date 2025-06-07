import { Text, extend } from "@pixi/react";
import type * as PIXI from "pixi.js";
import React from "react";
import type {
  KoreanTextSize,
  KoreanFontWeight,
  PixiTextStyleConfig,
  KoreanTextVariant,
  KoreanTextEmphasis,
  StatusKey,
  MartialVariant,
} from "../../../../../types/korean-text";
import type { KoreanText } from "../../../../../types"; // Correct import for KoreanText
import {
  KOREAN_FONT_FAMILY,
  KOREAN_TEXT_SIZES,
  KOREAN_FONT_WEIGHTS as BaseKoreanFontWeights, // Use aliased import
  KOREAN_COLORS,
} from "../../../../../types/constants"; // Correct path to main constants
import {
  KOREAN_MARTIAL_TEXT_STYLES,
  KOREAN_STATUS_TEXT_STYLES,
  KOREAN_TECHNIQUE_TEXT_STYLES,
  KOREAN_TITLE_TEXT_STYLES,
  KOREAN_TEXT_DEFAULT_STYLE,
} from "../constants"; // Local constants for text styles

// Extend PIXI React with Text component
extend({ Text });

// Declare extended components for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiText: any;
    }
  }
}

export interface KoreanPixiTextProps {
  text?: string | KoreanText;
  korean?: string;
  english?: string;
  style?: any;
  anchor?: [number, number] | number;
  position?: [number, number];
  [key: string]: any;
}

// Use the aliased KOREAN_FONT_WEIGHTS
const KOREAN_FONT_WEIGHTS = BaseKoreanFontWeights;

export interface KoreanTextStyleOptions extends PixiTextStyleConfig {
  size?: KoreanTextSize | number;
  weight?: KoreanFontWeight;
  variant?: KoreanTextVariant;
  emphasis?: KoreanTextEmphasis;
  statusKey?: StatusKey;
  martialVariant?: MartialVariant;
  color?: number | string; // Allow string for hex
  text?: string | KoreanText; // Added text for context
}

// ... (ensure ensurePixiColor is defined or imported)
function ensurePixiColor(
  color: string | number | undefined,
  defaultColor: number = KOREAN_COLORS.WHITE_SOLID
): number {
  if (typeof color === "string") {
    try {
      return PIXI.utils.string2hex(color);
    } catch (e) {
      return defaultColor;
    }
  }
  return color ?? defaultColor;
}

export function KoreanPixiText({
  text,
  korean,
  english,
  style = {},
  anchor = [0, 0],
  position = [0, 0],
  ...props
}: KoreanPixiTextProps): React.JSX.Element {
  // Handle different text input formats
  let displayText: string;

  if (text) {
    displayText =
      typeof text === "string" ? text : text.korean || text.english || "";
  } else if (korean && english) {
    displayText = korean; // Prefer Korean if both are provided
  } else if (korean) {
    displayText = korean;
  } else if (english) {
    displayText = english;
  } else {
    displayText = "";
  }

  const textStyle = createKoreanTextStyle(style);

  return React.createElement("pixiText", {
    text: displayText,
    style: textStyle,
    anchor: typeof anchor === "object" ? anchor[0] : anchor,
    x: Array.isArray(position) ? position[0] : 0,
    y: Array.isArray(position) ? position[1] : 0,
    ...props,
  });
}

export function createKoreanTextStyle(
  options: KoreanTextStyleOptions = {}
): PIXI.TextStyle {
  const baseStyle: Partial<PIXI.TextStyleOptions> = {
    ...KOREAN_TEXT_DEFAULT_STYLE,
    fontFamily: options.fontFamily || KOREAN_FONT_FAMILY,
    fill: ensurePixiColor(options.fill, KOREAN_COLORS.TEXT_PRIMARY),
  };

  let variantStyle: Partial<PIXI.TextStyleOptions> = {};
  if (options.variant) {
    switch (options.variant) {
      case "title":
        variantStyle = KOREAN_TITLE_TEXT_STYLES.default || {};
        break;
      case "technique":
        variantStyle = KOREAN_TECHNIQUE_TEXT_STYLES.default || {};
        break;
      case "status":
        variantStyle = options.statusKey
          ? KOREAN_STATUS_TEXT_STYLES[options.statusKey] ||
            KOREAN_STATUS_TEXT_STYLES.default ||
            {}
          : KOREAN_STATUS_TEXT_STYLES.default || {};
        break;
      case "martial":
        variantStyle = options.martialVariant
          ? KOREAN_MARTIAL_TEXT_STYLES[options.martialVariant] ||
            KOREAN_MARTIAL_TEXT_STYLES.default ||
            {}
          : KOREAN_MARTIAL_TEXT_STYLES.default || {};
        break;
      default:
        break;
    }
  }

  const finalStyle = {
    ...baseStyle,
    ...variantStyle,
    ...options,
  } as PIXI.TextStyleOptions;

  // Apply size
  if (options.size) {
    if (typeof options.size === "number") {
      finalStyle.fontSize = options.size;
    } else {
      finalStyle.fontSize =
        KOREAN_TEXT_SIZES[options.size as KoreanTextSize] ||
        KOREAN_TEXT_SIZES.medium;
    }
  } else if (!finalStyle.fontSize) {
    finalStyle.fontSize = KOREAN_TEXT_SIZES.medium;
  }

  // Apply weight
  if (options.weight) {
    if (typeof options.weight === "number") {
      finalStyle.fontWeight =
        options.weight.toString() as PIXI.TextStyleFontWeight;
    } else {
      const weightKey =
        options.weight.toLowerCase() as keyof typeof KOREAN_FONT_WEIGHTS;
      finalStyle.fontWeight = (
        KOREAN_FONT_WEIGHTS[weightKey] || KOREAN_FONT_WEIGHTS.regular
      ).toString() as PIXI.TextStyleFontWeight;
    }
  } else if (!finalStyle.fontWeight) {
    finalStyle.fontWeight =
      KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight;
  }

  // Apply emphasis (simplified, PIXI handles some via TextStyle properties)
  if (options.emphasis) {
    if (options.emphasis === "bold")
      finalStyle.fontWeight =
        KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight;
    if (options.emphasis === "italic") finalStyle.fontStyle = "italic";
    // Glow and shadow are more complex, often set via dropShadow properties
    if (options.emphasis === "glow" || options.emphasis === "shadow") {
      finalStyle.dropShadow = true;
      finalStyle.dropShadowColor = ensurePixiColor(
        options.dropShadowColor,
        KOREAN_COLORS.ACCENT_PRIMARY
      );
      finalStyle.dropShadowBlur =
        options.dropShadowBlur || (options.emphasis === "glow" ? 5 : 3);
      finalStyle.dropShadowDistance =
        options.dropShadowDistance || (options.emphasis === "glow" ? 0 : 3);
      finalStyle.dropShadowAngle =
        options.dropShadowAngle ||
        (options.emphasis === "shadow" ? Math.PI / 4 : 0);
    }
    if (options.emphasis === "outline") {
      finalStyle.stroke = ensurePixiColor(
        options.stroke,
        KOREAN_COLORS.BLACK_SOLID
      );
      finalStyle.strokeThickness = options.strokeThickness || 2;
    }
  }

  return new PIXI.TextStyle(finalStyle);
}

export function getDisplayText(text: string | KoreanText): string {
  return typeof text === "string" ? text : text.korean;
}
