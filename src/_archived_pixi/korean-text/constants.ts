// Korean text rendering constants

// Fix: Import from correct path
import { KOREAN_COLORS } from "../../../../types/constants/colors";

export const KOREAN_TEXT_CONSTANTS = {
  // Font families optimized for Korean text
  FONT_FAMILIES: {
    PRIMARY: '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
    SECONDARY: '"Nanum Gothic", Arial, sans-serif',
    DISPLAY: '"Black Han Sans", "Noto Sans KR", sans-serif',
    MONO: '"D2Coding", "Consolas", monospace',
  },

  // Font sizes for different contexts
  FONT_SIZES: {
    TINY: 10,
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 20,
    XLARGE: 24,
    HUGE: 32,
    TITLE: 36,
  } as const,

  // Fix: Add FONT_WEIGHTS
  FONT_WEIGHTS: {
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
    HEAVY: 900,
  } as const,

  // Default colors for Korean text
  COLORS: {
    PRIMARY: KOREAN_COLORS.TEXT_PRIMARY,
    SECONDARY: KOREAN_COLORS.TEXT_SECONDARY,
    ACCENT: KOREAN_COLORS.ACCENT_GOLD,
    WARNING: KOREAN_COLORS.WARNING_YELLOW,
    ERROR: KOREAN_COLORS.NEGATIVE_RED,
    SUCCESS: KOREAN_COLORS.POSITIVE_GREEN,
  } as const,

  // Korean text layout
  LAYOUT: {
    LINE_HEIGHT_RATIO: 1.4,
    LETTER_SPACING: 0,
    PARAGRAPH_SPACING: 16,
    KOREAN_ENGLISH_RATIO: 0.8, // Size ratio when showing both languages
  } as const,

  // Animation defaults
  ANIMATIONS: {
    FADE_DURATION: 300,
    SLIDE_DURATION: 400,
    TYPEWRITER_SPEED: 50, // ms per character
  } as const,
} as const;

// Export font sizes for compatibility
export const KOREAN_TEXT_SIZES = KOREAN_TEXT_CONSTANTS.FONT_SIZES;

// Export font family for compatibility
export const KOREAN_FONT_FAMILY = KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.PRIMARY;

export default KOREAN_TEXT_CONSTANTS;
