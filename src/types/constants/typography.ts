/**
 * Typography constants for Black Trigram
 */

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

// Font sizes
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

// Font weights
export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 900,
} as const;

// Korean text sizes
export const KOREAN_TEXT_SIZES: Record<string, number> = {
  tiny: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  huge: 32,
  title: 36,
};

// Korean font weights
export const KOREAN_FONT_WEIGHTS: Record<string, number> = {
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 900,
} as const;
