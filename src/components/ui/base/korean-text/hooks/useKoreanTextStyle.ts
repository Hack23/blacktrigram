import { useMemo } from "react";
import * as PIXI from "pixi.js";
import type {
  KoreanTextProps,
  KoreanTextVariant,
  KoreanTextEmphasis,
  PixiTextStyleConfig,
} from "../../../../../types/korean-text";
import {
  KOREAN_FONT_FAMILY,
  KOREAN_TEXT_SIZES,
  KOREAN_FONT_WEIGHTS,
  CYBERPUNK_PALETTE,
} from "../../../../../types/constants";
import { ensurePixiColor } from "../../../../../utils/colorUtils";
import {
  KOREAN_TITLE_STYLES,
  KOREAN_TECHNIQUE_TEXT_STYLES,
  KOREAN_STATUS_TEXT_STYLES,
  KOREAN_MARTIAL_TEXT_STYLES,
} from "../constants";

export interface KoreanTextStyleOptions extends PixiTextStyleConfig {
  size?: KoreanTextProps["size"];
  weight?: KoreanTextProps["weight"];
  color?: KoreanTextProps["color"];
  variant?: KoreanTextVariant;
  emphasis?: KoreanTextEmphasis;
  align?: "left" | "center" | "right";
  korean?: string | { korean: string; english: string };
  english?: string;
  statusKey?: any;
  martialVariant?: any;
  trigram?: any;
  mastered?: boolean;
}

export function useKoreanTextStyle(
  options: KoreanTextStyleOptions = {}
): PIXI.TextStyle {
  return useMemo(() => {
    const baseStyle: Partial<PIXI.ITextStyle> = {
      fontFamily: KOREAN_FONT_FAMILY,
      fontSize: KOREAN_TEXT_SIZES.MEDIUM,
      fill: CYBERPUNK_PALETTE.TEXT_MAIN,
      align: options.align || "left",
      wordWrap: true,
      wordWrapWidth: 400,
    };

    let variantStyle: Partial<PIXI.ITextStyle> = {};
    if (options.variant) {
      switch (options.variant) {
        case "title":
          variantStyle = KOREAN_TITLE_STYLES.h1;
          break;
        case "technique":
          variantStyle = options.trigram
            ? KOREAN_TECHNIQUE_TEXT_STYLES.default
            : KOREAN_TECHNIQUE_TEXT_STYLES.default;
          break;
        case "status":
          variantStyle = options.statusKey
            ? KOREAN_STATUS_TEXT_STYLES[options.statusKey] ||
              KOREAN_STATUS_TEXT_STYLES.default
            : KOREAN_STATUS_TEXT_STYLES.default;
          break;
        case "martial":
          variantStyle = options.martialVariant
            ? KOREAN_MARTIAL_TEXT_STYLES[options.martialVariant] ||
              KOREAN_MARTIAL_TEXT_STYLES.default
            : KOREAN_MARTIAL_TEXT_STYLES.default;
          break;
        default:
          break;
      }
    }

    const style = new PIXI.TextStyle({ ...baseStyle, ...variantStyle });

    // Apply size
    if (options.size) {
      if (typeof options.size === "number") {
        style.fontSize = options.size;
      } else {
        style.fontSize =
          KOREAN_TEXT_SIZES[
            options.size.toUpperCase() as keyof typeof KOREAN_TEXT_SIZES
          ] || KOREAN_TEXT_SIZES.MEDIUM;
      }
    } else if (!variantStyle.fontSize) {
      style.fontSize = KOREAN_TEXT_SIZES.MEDIUM;
    }

    // Apply weight
    if (options.weight) {
      if (typeof options.weight === "number") {
        style.fontWeight =
          options.weight.toString() as PIXI.TextStyleFontWeight;
      } else {
        const weightKey =
          options.weight.toUpperCase() as keyof typeof KOREAN_FONT_WEIGHTS;
        style.fontWeight = (
          KOREAN_FONT_WEIGHTS[weightKey] || KOREAN_FONT_WEIGHTS.REGULAR
        ).toString() as PIXI.TextStyleFontWeight;
      }
    } else if (!variantStyle.fontWeight) {
      style.fontWeight =
        KOREAN_FONT_WEIGHTS.REGULAR.toString() as PIXI.TextStyleFontWeight;
    }

    // Apply color
    if (options.color) {
      style.fill = ensurePixiColor(options.color);
    } else if (!variantStyle.fill) {
      style.fill = CYBERPUNK_PALETTE.TEXT_MAIN;
    }

    // Apply emphasis
    if (options.emphasis) {
      switch (options.emphasis) {
        case "bold":
          style.fontWeight =
            KOREAN_FONT_WEIGHTS.BOLD.toString() as PIXI.TextStyleFontWeight;
          break;
        case "italic":
          style.fontStyle = "italic";
          break;
        case "underline":
          // PIXI doesn't have direct underline; often faked with a graphic or not used.
          break;
        case "glow":
          style.dropShadow = true;
          style.dropShadowColor = ensurePixiColor(
            options.dropShadowColor || CYBERPUNK_PALETTE.ACCENT_NEON_GREEN
          );
          style.dropShadowBlur = options.dropShadowBlur || 5;
          style.dropShadowDistance = options.dropShadowDistance || 0;
          style.dropShadowAlpha = options.dropShadowAlpha ?? 1;
          break;
        case "shadow":
          style.dropShadow = true;
          style.dropShadowColor = ensurePixiColor(
            options.dropShadowColor || CYBERPUNK_PALETTE.BLACK_SOLID
          );
          style.dropShadowBlur = options.dropShadowBlur || 3;
          style.dropShadowAngle = options.dropShadowAngle || Math.PI / 4;
          style.dropShadowDistance = options.dropShadowDistance || 3;
          style.dropShadowAlpha = options.dropShadowAlpha ?? 0.7;
          break;
        case "outline":
          style.stroke = ensurePixiColor(
            options.stroke || CYBERPUNK_PALETTE.TEXT_OUTLINE
          );
          style.strokeThickness = options.strokeThickness || 2;
          break;
        default:
          break;
      }
    }

    // Apply explicit PixiTextStyleConfig options, overriding others if present
    const directPixiOptions: Partial<PIXI.ITextStyle> = { ...options };
    delete directPixiOptions.size;
    delete directPixiOptions.weight;
    delete directPixiOptions.color;
    delete directPixiOptions.variant;
    delete directPixiOptions.emphasis;
    delete directPixiOptions.align;

    // Merge direct PIXI options
    Object.assign(style, directPixiOptions);

    return style;
  }, [options]);
}
