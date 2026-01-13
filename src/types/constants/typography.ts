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

/**
 * Korean font sizes optimized for mobile devices
 * Korean characters need ~10-15% larger size than Latin for equal readability
 * 
 * Extra-small: <380px width (iPhone SE, old Android, budget phones)
 * Small: 380-450px width (standard mobile phones)
 * Regular: 450+ width (large phones, tablets, desktop)
 * 
 * @category Typography
 * @korean 한글모바일글꼴크기
 */
export const KOREAN_MOBILE_FONT_SIZES = {
  SMALL: {
    extraSmall: 13, // 320-380px width
    small: 14,      // 380-450px width
    regular: 16,    // 450+ width
  },
  MEDIUM: {
    extraSmall: 15, // 320-380px width
    small: 17,      // 380-450px width
    regular: 19,    // 450+ width
  },
  LARGE: {
    extraSmall: 18, // 320-380px width
    small: 20,      // 380-450px width
    regular: 22,    // 450+ width
  },
} as const;

/**
 * Get Korean font size based on screen width
 * Automatically scales Korean text for readability on small screens
 * 
 * @param baseSize - Base font size category ('SMALL', 'MEDIUM', 'LARGE')
 * @param screenWidth - Screen width in pixels
 * @returns Optimized font size in pixels
 * 
 * @example
 * ```typescript
 * getKoreanFontSize('MEDIUM', 375); // 15 (extra-small)
 * getKoreanFontSize('MEDIUM', 410); // 17 (small)
 * getKoreanFontSize('MEDIUM', 768); // 19 (regular)
 * ```
 * 
 * @public
 * @korean 한글글꼴크기얻기
 */
export function getKoreanFontSize(
  baseSize: keyof typeof KOREAN_MOBILE_FONT_SIZES,
  screenWidth: number
): number {
  const sizeMap = KOREAN_MOBILE_FONT_SIZES[baseSize];
  
  if (screenWidth < 380) {
    return sizeMap.extraSmall;
  } else if (screenWidth < 450) {
    return sizeMap.small;
  } else {
    return sizeMap.regular;
  }
}

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
