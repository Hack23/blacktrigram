/**
 * TypeScript type definitions for Korean PixiJS text utilities
 * This file provides types that can be imported separately from the React components
 */

import * as PIXI from "pixi.js";
import { KOREAN_COLORS } from "../../../../../types/constants";

export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

export interface KoreanPixiTextStyle {
  fontSize?: number;
  fill?: number;
  fontWeight?: PIXI.TextStyleFontWeight;
  align?: PIXI.TextStyleAlign;
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

// Fix: Use proper ES6 import instead of require()
export function createKoreanTextStyle(
  options: KoreanPixiTextStyle = {}
): PIXI.TextStyle {
  return new PIXI.TextStyle({
    fontFamily: '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
    fontSize: options.fontSize || 16,
    fill: options.fill || KOREAN_COLORS.TEXT_PRIMARY,
    fontWeight: options.fontWeight || "normal",
    align: options.align || "left",
    wordWrap: options.wordWrap || false,
    wordWrapWidth: options.wordWrapWidth || 0,
  });
}

export function getDisplayText(
  text: KoreanText,
  showRomanization: boolean = false
): string {
  if (showRomanization && text.romanized) {
    return `${text.korean}\n${text.romanized}\n${text.english}`;
  }
  return `${text.korean}\n${text.english}`;
}

export const KOREAN_TEXT_STYLES = {
  heading: createKoreanTextStyle({
    fontSize: 24,
    fontWeight: "bold",
    fill: KOREAN_COLORS.ACCENT_GOLD,
  }),
  body: createKoreanTextStyle({
    fontSize: 16,
    fill: KOREAN_COLORS.TEXT_PRIMARY,
  }),
  small: createKoreanTextStyle({
    fontSize: 12,
    fill: KOREAN_COLORS.TEXT_SECONDARY,
  }),
  accent: createKoreanTextStyle({
    fontSize: 18,
    fontWeight: "bold",
    fill: KOREAN_COLORS.PRIMARY_CYAN,
  }),
};

