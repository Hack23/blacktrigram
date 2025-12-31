/**
 * Responsive Scaling System for Black Trigram
 * 
 * Centralized scaling calculations for responsive layout across all screen sizes.
 * Implements proportional font and spacing scaling with smooth transitions.
 * 
 * Features:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Font scaling: 0.8x (mobile) to 1.4x (4K displays)
 * - Spacing scaling: 0.5x (mobile) to 1.5x (4K displays)
 * - Korean text readability: 14-24px range enforced
 * - Smooth CSS transitions for resize operations
 * - 60fps performance maintained
 * 
 * @module systems/ResponsiveScaling
 * @category Responsive Layout
 * @korean 반응형스케일시스템
 */

import type {
  ScreenSize,
  ResponsiveBreakpoints,
  FontScaleMap,
  SpacingScaleMap,
  ResponsiveScaleConfig,
  ResizeTransitionConfig,
  ResponsiveValues,
  ScreenSizeTestResult,
} from '../types/ResponsiveTypes';

// Re-export types for convenience
export type {
  ScreenSize,
  ResponsiveBreakpoints,
  FontScaleMap,
  SpacingScaleMap,
  ResponsiveScaleConfig,
  ResizeTransitionConfig,
  ResponsiveValues,
  ScreenSizeTestResult,
};

/**
 * Standard breakpoints for responsive design
 * Maps viewport widths to device categories
 * 
 * @constant
 * @category Responsive Layout
 */
export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoints = {
  MOBILE: 768,      // < 768px: Mobile devices
  TABLET: 1024,     // 768-1024px: Tablets
  DESKTOP: 1440,    // 1024-1440px: Standard desktop
  LARGE: 1920,      // 1440-1920px: HD/2K displays
  XLARGE: 2560,     // ≥1920px: 4K/ultra-wide displays
} as const;

/**
 * Font scaling multipliers by screen size
 * Base size (16px) * scale = final size
 * 
 * Results clamped to 14-24px for readability
 * 
 * @constant
 * @category Typography
 */
export const FONT_SCALE_MAP: FontScaleMap = {
  mobile: 0.8,    // 16px * 0.8 = 12.8px → clamped to 14px min
  tablet: 0.9,    // 16px * 0.9 = 14.4px
  desktop: 1.0,   // 16px * 1.0 = 16px (base)
  large: 1.2,     // 16px * 1.2 = 19.2px
  xlarge: 1.4,    // 16px * 1.4 = 22.4px → clamped to 24px max
} as const;

/**
 * Spacing scaling multipliers by screen size
 * Base spacing * scale = final spacing
 * 
 * @constant
 * @category Layout
 */
export const SPACING_SCALE_MAP: SpacingScaleMap = {
  mobile: 0.5,    // Compact spacing for small screens
  tablet: 0.75,   // Moderate spacing for tablets
  desktop: 1.0,   // Standard reference spacing
  large: 1.25,    // Spacious for large displays
  xlarge: 1.5,    // Maximum spacing for 4K
} as const;

/**
 * Default transition configuration for smooth resizing
 * Optimized for 60fps performance
 * 
 * @constant
 * @category Animation
 */
export const DEFAULT_RESIZE_TRANSITION: ResizeTransitionConfig = {
  duration: '300ms',
  easing: 'ease-in-out',
  properties: ['font-size', 'padding', 'margin', 'width', 'height'] as const,
  enabled: true,
} as const;

/**
 * Font size constraints for Korean and English text
 * Ensures readability across all screen sizes
 * 
 * @constant
 * @category Typography
 */
export const FONT_SIZE_CONSTRAINTS = {
  /** Minimum body text size for readability */
  MIN_BODY_SIZE: 14,
  /** Maximum size before text becomes too large */
  MAX_SIZE: 24,
  /** Base reference size (desktop) */
  BASE_SIZE: 16,
} as const;

/**
 * Determine screen size category from viewport width
 * 
 * Categories:
 * - mobile: < 768px (phones)
 * - tablet: 768-1024px (tablets)
 * - desktop: 1024-1440px (standard monitors)
 * - large: 1440-1920px (HD/2K displays)
 * - xlarge: ≥1920px (4K/ultra-wide)
 * 
 * @param width - Viewport width in pixels
 * @returns Screen size category
 * 
 * @example
 * ```typescript
 * getScreenSize(375);  // 'mobile'
 * getScreenSize(768);  // 'tablet'
 * getScreenSize(1920); // 'xlarge'
 * ```
 * 
 * @public
 * @korean 화면크기얻기
 */
export function getScreenSize(width: number): ScreenSize {
  if (width < RESPONSIVE_BREAKPOINTS.MOBILE) return 'mobile';
  if (width < RESPONSIVE_BREAKPOINTS.TABLET) return 'tablet';
  if (width < RESPONSIVE_BREAKPOINTS.DESKTOP) return 'desktop';
  if (width < RESPONSIVE_BREAKPOINTS.LARGE) return 'large';
  return 'xlarge';
}

/**
 * Calculate scaled font size with readability constraints
 * 
 * Formula: baseSize * scale
 * Clamped: max(minSize, min(maxSize, calculated))
 * 
 * Ensures Korean and English text remain readable at all sizes
 * 
 * @param baseSize - Base font size in pixels (typically 16px)
 * @param screenSize - Current screen size category
 * @param minSize - Minimum allowed size (default: 14px)
 * @param maxSize - Maximum allowed size (default: 24px)
 * @returns Calculated font size in pixels
 * 
 * @example
 * ```typescript
 * calculateFontSize(16, 'mobile');  // 14 (clamped from 12.8)
 * calculateFontSize(16, 'desktop'); // 16
 * calculateFontSize(16, 'xlarge');  // 22.4
 * calculateFontSize(20, 'xlarge', 14, 24); // 24 (clamped from 28)
 * ```
 * 
 * @public
 * @korean 글꼴크기계산
 */
export function calculateFontSize(
  baseSize: number,
  screenSize: ScreenSize,
  minSize: number = FONT_SIZE_CONSTRAINTS.MIN_BODY_SIZE,
  maxSize: number = FONT_SIZE_CONSTRAINTS.MAX_SIZE
): number {
  const scale = FONT_SCALE_MAP[screenSize];
  const scaled = baseSize * scale;
  
  // Clamp to readable range
  return Math.max(minSize, Math.min(maxSize, scaled));
}

/**
 * Calculate scaled spacing value
 * 
 * Formula: baseSpacing * scale
 * Rounded to nearest integer for crisp rendering
 * 
 * @param baseSpacing - Base spacing value in pixels
 * @param screenSize - Current screen size category
 * @returns Calculated spacing in pixels (rounded)
 * 
 * @example
 * ```typescript
 * calculateSpacing(20, 'mobile');  // 10 (20 * 0.5)
 * calculateSpacing(20, 'desktop'); // 20
 * calculateSpacing(20, 'xlarge');  // 30 (20 * 1.5)
 * ```
 * 
 * @public
 * @korean 간격계산
 */
export function calculateSpacing(
  baseSpacing: number,
  screenSize: ScreenSize
): number {
  const scale = SPACING_SCALE_MAP[screenSize];
  return Math.round(baseSpacing * scale);
}

/**
 * Get font scale multiplier for screen size
 * 
 * @param screenSize - Screen size category
 * @returns Scale multiplier (0.8 - 1.4)
 * 
 * @example
 * ```typescript
 * getFontScale('mobile');  // 0.8
 * getFontScale('desktop'); // 1.0
 * getFontScale('xlarge');  // 1.4
 * ```
 * 
 * @public
 * @korean 글꼴스케일얻기
 */
export function getFontScale(screenSize: ScreenSize): number {
  return FONT_SCALE_MAP[screenSize];
}

/**
 * Get spacing scale multiplier for screen size
 * 
 * @param screenSize - Screen size category
 * @returns Scale multiplier (0.5 - 1.5)
 * 
 * @example
 * ```typescript
 * getSpacingScale('mobile');  // 0.5
 * getSpacingScale('desktop'); // 1.0
 * getSpacingScale('xlarge');  // 1.5
 * ```
 * 
 * @public
 * @korean 간격스케일얻기
 */
export function getSpacingScale(screenSize: ScreenSize): number {
  return SPACING_SCALE_MAP[screenSize];
}

/**
 * Create CSS transition string for smooth resizing
 * 
 * @param config - Transition configuration (optional)
 * @returns CSS transition string
 * 
 * @example
 * ```typescript
 * createTransitionString();
 * // 'font-size 300ms ease-in-out, padding 300ms ease-in-out, ...'
 * 
 * createTransitionString({ duration: '200ms', easing: 'linear' });
 * // 'font-size 200ms linear, padding 200ms linear, ...'
 * ```
 * 
 * @public
 * @korean 전환문자열생성
 */
export function createTransitionString(
  config: Partial<ResizeTransitionConfig> = {}
): string {
  const {
    duration = DEFAULT_RESIZE_TRANSITION.duration,
    easing = DEFAULT_RESIZE_TRANSITION.easing,
    properties = DEFAULT_RESIZE_TRANSITION.properties,
    enabled = DEFAULT_RESIZE_TRANSITION.enabled,
  } = config;

  if (!enabled) {
    return 'none';
  }

  return properties
    .map((prop) => `${prop} ${duration} ${easing}`)
    .join(', ');
}

/**
 * Create complete responsive scale configuration
 * 
 * @param width - Viewport width
 * @param height - Viewport height
 * @returns Complete responsive configuration
 * 
 * @example
 * ```typescript
 * const config = createResponsiveConfig(375, 667);
 * console.log(config.screenSize);  // 'mobile'
 * console.log(config.fontScale);   // 0.8
 * console.log(config.spacingScale); // 0.5
 * ```
 * 
 * @public
 * @korean 반응형설정생성
 */
export function createResponsiveConfig(
  width: number,
  height: number
): ResponsiveScaleConfig {
  const screenSize = getScreenSize(width);
  const fontScale = getFontScale(screenSize);
  const spacingScale = getSpacingScale(screenSize);

  return {
    screenSize,
    fontScale,
    spacingScale,
    viewport: { width, height },
  };
}

/**
 * Calculate all responsive values for a component
 * 
 * Computes font sizes, spacing, and transitions based on screen size
 * Ready-to-use values for component styling
 * 
 * @param width - Viewport width
 * @param baseFontSize - Base font size (default: 16px)
 * @param baseSpacing - Base spacing unit (default: 16px)
 * @returns Complete responsive values
 * 
 * @example
 * ```typescript
 * const values = calculateResponsiveValues(375);
 * 
 * <div style={{
 *   fontSize: values.fontSize.body,
 *   padding: values.spacing.md,
 *   transition: values.transition,
 * }}>
 *   Responsive content
 * </div>
 * ```
 * 
 * @public
 * @korean 반응형값계산
 */
export function calculateResponsiveValues(
  width: number,
  baseFontSize: number = FONT_SIZE_CONSTRAINTS.BASE_SIZE,
  baseSpacing: number = 16
): ResponsiveValues {
  const screenSize = getScreenSize(width);
  
  // Calculate font sizes for all text levels
  const fontSize = {
    small: calculateFontSize(baseFontSize * 0.75, screenSize, 12, 18),
    body: calculateFontSize(baseFontSize, screenSize),
    title: calculateFontSize(baseFontSize * 1.5, screenSize, 18, 28),
    hero: calculateFontSize(baseFontSize * 2.25, screenSize, 24, 36),
    hud: calculateFontSize(baseFontSize * 1.25, screenSize, 16, 24),
  };

  // Calculate spacing scale
  const spacing = {
    xs: calculateSpacing(baseSpacing * 0.5, screenSize),
    sm: calculateSpacing(baseSpacing * 0.75, screenSize),
    md: calculateSpacing(baseSpacing, screenSize),
    lg: calculateSpacing(baseSpacing * 1.5, screenSize),
    xl: calculateSpacing(baseSpacing * 2, screenSize),
  };

  // Create transition string
  const transition = createTransitionString();

  return {
    fontSize,
    spacing,
    transition,
  };
}

/**
 * Test screen size determination for validation
 * 
 * Useful for testing and debugging responsive breakpoints.
 * Screen size is determined by width (breakpoints), but height is included
 * in the result for testing portrait/landscape orientations.
 * 
 * @param width - Viewport width to test
 * @param height - Viewport height to test
 * @returns Test result with screen size and device type flags
 * 
 * @example
 * ```typescript
 * const result = testScreenSize(768, 1024);
 * console.log(result.screenSize);  // 'tablet'
 * console.log(result.isTablet);    // true
 * console.log(result.isMobile);    // false
 * ```
 * 
 * @public
 * @korean 화면크기테스트
 */
export function testScreenSize(
  width: number,
  height: number
): ScreenSizeTestResult {
  const screenSize = getScreenSize(width);
  const isLandscape = width > height;
  
  return {
    width,
    height,
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop' || screenSize === 'large' || screenSize === 'xlarge',
    // Include landscape in test result for completeness
    isLandscape,
  };
}

/**
 * Check if screen size is mobile
 * 
 * @param width - Viewport width
 * @returns True if mobile screen size
 * 
 * @public
 * @korean 모바일확인
 */
export function isMobileSize(width: number): boolean {
  return getScreenSize(width) === 'mobile';
}

/**
 * Check if screen size is tablet
 * 
 * @param width - Viewport width
 * @returns True if tablet screen size
 * 
 * @public
 * @korean 태블릿확인
 */
export function isTabletSize(width: number): boolean {
  return getScreenSize(width) === 'tablet';
}

/**
 * Check if screen size is desktop or larger
 * 
 * @param width - Viewport width
 * @returns True if desktop, large, or xlarge screen size
 * 
 * @public
 * @korean 데스크톱확인
 */
export function isDesktopSize(width: number): boolean {
  const size = getScreenSize(width);
  return size === 'desktop' || size === 'large' || size === 'xlarge';
}
