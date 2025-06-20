import * as PIXI from "pixi.js";
import { KOREAN_COLORS } from "./colors";

// Font Families
export const FONT_FAMILY = {
  PRIMARY: '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
  SECONDARY: '"Nanum Gothic", Arial, sans-serif',
  MONO: '"Nanum Gothic Coding", monospace',
  KOREAN_BATTLE: '"Noto Sans KR", Impact, sans-serif',
  CYBER: '"Orbitron", "Noto Sans KR", monospace',
  SYMBOL: '"Arial Unicode MS", Arial, sans-serif',
  KOREAN: '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
} as const;

// Fix: Add missing font sizes including xxlarge and xsmall
export const FONT_SIZES = {
  xsmall: 8,
  tiny: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 28,
  huge: 32,
  title: 36,
  subtitle: 28,
} as const;

// Fix: Update FONT_WEIGHTS to include regular
export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  regular: 400, // Fix: Add regular
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 900,
} as const;

// Use proper enum mapping for sizes
export const KOREAN_TEXT_SIZES: Record<string, number> = {
  tiny: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  huge: 32,
  title: 36,
};

// Fix: Use proper enum values for font weights
export const KOREAN_FONT_WEIGHTS: Record<string, number> = {
  light: 300,
  normal: 400,
  regular: 400, // Keep only one 'regular' entry
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 900,
} as const;

// Only declare and export PIXI_FONT_WEIGHTS once, at the top
export const PIXI_FONT_WEIGHTS = {
  normal: "normal",
  bold: "bold",
} as const;

// Default PIXI TextStyle - Fix property names to match PixiJS v8
export const DEFAULT_PIXI_TEXT_STYLE: Partial<PIXI.TextStyleOptions> = {
  fontFamily: FONT_FAMILY.KOREAN,
  fontSize: KOREAN_TEXT_SIZES.medium,
  fill: KOREAN_COLORS.TEXT_PRIMARY,
  align: "left",
  wordWrap: false,
  fontWeight: "normal",
  // PixiJS v8 drop shadow format
  dropShadow: {
    alpha: 0.5,
    angle: Math.PI / 6,
    blur: 2,
    color: 0x000000,
    distance: 2,
  },
};

// PIXI Text Style Collections - Fix invalid properties
export const PIXI_TEXT_STYLES = {
  DEFAULT: new PIXI.TextStyle(DEFAULT_PIXI_TEXT_STYLE),
  TITLE: new PIXI.TextStyle({
    ...DEFAULT_PIXI_TEXT_STYLE,
    fontFamily: FONT_FAMILY.KOREAN_BATTLE,
    fontSize: FONT_SIZES.title,
    fontWeight: "bold",
    fill: KOREAN_COLORS.ACCENT_PRIMARY,
    align: "center",
    dropShadow: {
      alpha: 0.8,
      angle: Math.PI / 6,
      blur: 3,
      color: 0x000000,
      distance: 3,
    },
  }),
  SUBTITLE: new PIXI.TextStyle({
    ...DEFAULT_PIXI_TEXT_STYLE,
    fontSize: FONT_SIZES.large,
    fontWeight: "normal",
    fill: KOREAN_COLORS.TEXT_SECONDARY,
    align: "center",
  }),
  BODY: new PIXI.TextStyle({
    ...DEFAULT_PIXI_TEXT_STYLE,
    fontSize: FONT_SIZES.medium,
    lineHeight: FONT_SIZES.medium * 1.5,
  }),
  BUTTON: new PIXI.TextStyle({
    ...DEFAULT_PIXI_TEXT_STYLE,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    fill: KOREAN_COLORS.TEXT_PRIMARY,
    align: "center",
  }),
} as const;

// Fix: Add missing KOREAN_FONT_FAMILY constant
export const KOREAN_FONT_FAMILY = FONT_FAMILY.KOREAN;

// Default styles for HTML elements (React components)
export const HTML_DEFAULT_TEXT_STYLE: React.CSSProperties = {
  fontFamily: KOREAN_FONT_FAMILY,
  fontSize: `${KOREAN_TEXT_SIZES.medium}px`,
  color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
  fontWeight: KOREAN_FONT_WEIGHTS.normal,
};

// Fix: Add missing KOREAN_TYPOGRAPHY export if not present
export const KOREAN_TYPOGRAPHY = {
  // Korean-optimized fonts - 한국어 최적화 폰트
  FONTS: {
    HEADING: [
      "Noto Sans KR",
      "Malgun Gothic",
      "AppleGothic",
      "Arial",
      "sans-serif",
    ],
    BODY: ["Noto Sans KR", "Malgun Gothic", "Dotum", "Arial", "sans-serif"],
    MONO: ["D2Coding", "Consolas", "Monaco", "monospace"],
    DISPLAY: ["Black Han Sans", "Noto Sans KR", "Arial Black", "sans-serif"],
  },

  SIZES: {
    // Font sizes for different contexts - 컨텍스트별 폰트 크기
    TITLE: 32, // 제목
    HEADING: 24, // 헤딩
    SUBHEADING: 18, // 부제목
    BODY: 14, // 본문
    CAPTION: 12, // 캡션
    SMALL: 10, // 작은 텍스트
  },

  WEIGHTS: {
    LIGHT: 300, // 가벼움
    NORMAL: 400, // 보통
    MEDIUM: 500, // 중간
    BOLD: 700, // 굵음
    BLACK: 900, // 매우 굵음
  },

  LINE_HEIGHTS: {
    TIGHT: 1.2, // 좁음
    NORMAL: 1.4, // 보통
    RELAXED: 1.6, // 여유로움
    LOOSE: 1.8, // 느슨함
  },
} as const;
