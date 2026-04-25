/**
 * Responsive Layout Utility Functions
 * 
 * Helper functions for responsive layout calculations and touch target validation
 * 
 * @module utils/responsiveLayout
 * @category Mobile UI
 * @korean 반응형레이아웃유틸
 */

/**
 * Minimum touch target size according to iOS Human Interface Guidelines
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Convert a CSS percentage string (for example "70%") into a decimal ratio.
 *
 * Invalid or non-finite percentage values fall back to `1` so responsive
 * layout calculations preserve full-width behaviour instead of producing NaN.
 *
 * @param value - CSS percentage string
 * @returns Decimal ratio (e.g. "70%" -> 0.7)
 */
export function parsePercentageToRatio(value: string): number {
  const percent = Number.parseFloat(value);
  return Number.isFinite(percent) ? percent / 100 : 1;
}

/**
 * Validate if an element meets minimum touch target requirements
 * 
 * @param width - Element width in pixels
 * @param height - Element height in pixels
 * @param minSize - Minimum size (default: 44px iOS guideline)
 * @returns True if element meets minimum requirements
 * 
 * @example
 * ```typescript
 * const isValid = isValidTouchTarget(50, 50); // true
 * const isTooSmall = isValidTouchTarget(30, 30); // false
 * ```
 */
export function isValidTouchTarget(
  width: number,
  height: number,
  minSize: number = MIN_TOUCH_TARGET_SIZE
): boolean {
  return width >= minSize && height >= minSize;
}

/**
 * Calculate optimal font size for given viewport width
 * Ensures minimum readable font sizes on mobile
 * 
 * @param viewportWidth - Viewport width in pixels
 * @param baseSize - Base font size for desktop (default: 16)
 * @param minSize - Minimum font size for mobile (default: 14)
 * @returns Calculated font size in pixels
 * 
 * @example
 * ```typescript
 * const fontSize = calculateFontSize(375, 16, 14); // 14px for mobile
 * const fontSize = calculateFontSize(1920, 16, 14); // 16px for desktop
 * ```
 */
export function calculateFontSize(
  viewportWidth: number,
  baseSize: number = 16,
  minSize: number = 14
): number {
  if (viewportWidth < 768) {
    // Mobile: use minimum size or scale down slightly
    return Math.max(minSize, Math.floor(baseSize * 0.875));
  } else if (viewportWidth < 1024) {
    // Tablet: scale proportionally
    return Math.max(minSize, Math.floor(baseSize * 0.9375));
  }
  // Desktop: use base size
  return baseSize;
}

/**
 * Calculate element position within safe area
 * Ensures elements don't overlap notch or home indicator
 * 
 * @param value - Position value in pixels
 * @param safeAreaInset - Safe area inset for that edge
 * @returns Adjusted position value
 * 
 * @example
 * ```typescript
 * const top = calculateSafePosition(10, 44); // 54px (10 + 44)
 * const bottom = calculateSafePosition(20, 34); // 54px (20 + 34)
 * ```
 */
export function calculateSafePosition(
  value: number,
  safeAreaInset: number
): number {
  return value + safeAreaInset;
}

/**
 * Calculate optimal HUD height for given viewport
 * Scales based on device type and orientation
 * 
 * @param viewportWidth - Viewport width in pixels
 * @param isLandscape - Whether in landscape orientation
 * @returns HUD height in pixels
 * 
 * @example
 * ```typescript
 * const hudHeight = calculateHUDHeight(375, false); // ~80px for mobile portrait
 * const hudHeight = calculateHUDHeight(667, true); // ~60px for mobile landscape
 * ```
 */
export function calculateHUDHeight(
  viewportWidth: number,
  isLandscape: boolean
): number {
  const isMobile = viewportWidth < 768;
  const isSmallMobile = viewportWidth <= 375; // Changed to <= to match 375px iPhone SE

  if (isLandscape && isMobile) {
    // Landscape: minimize HUD to maximize gameplay area
    return isSmallMobile ? 60 : 70;
  }

  if (isMobile) {
    // Portrait mobile: compact but readable
    return isSmallMobile ? 80 : 95;
  }

  // Desktop/tablet: larger HUD with more information
  return 120;
}

/**
 * Calculate optimal control bar height for mobile
 * 
 * @param isMobile - Whether on mobile device
 * @param isLandscape - Whether in landscape orientation
 * @returns Control bar height in pixels
 */
export function calculateControlsHeight(
  isMobile: boolean,
  isLandscape: boolean
): number {
  if (!isMobile) {
    return 0; // Desktop uses keyboard
  }

  if (isLandscape) {
    return 100; // Minimal controls in landscape
  }

  return 130; // Full touch controls in portrait
}

/**
 * Calculate spacing between HUD elements
 * Ensures proper touch targets and visual hierarchy
 * 
 * @param isMobile - Whether on mobile device
 * @param density - Spacing density ('compact' | 'normal' | 'spacious')
 * @returns Spacing value in pixels
 */
export function calculateSpacing(
  isMobile: boolean,
  density: 'compact' | 'normal' | 'spacious' = 'normal'
): number {
  const baseSpacing = isMobile ? 8 : 12;

  switch (density) {
    case 'compact':
      return Math.floor(baseSpacing * 0.75);
    case 'spacious':
      return Math.ceil(baseSpacing * 1.5);
    case 'normal':
    default:
      return baseSpacing;
  }
}

/**
 * Calculate optimal progress bar dimensions
 * Ensures bars are touch-friendly on mobile
 * 
 * @param isMobile - Whether on mobile device
 * @param type - Bar type ('health' | 'ki' | 'stamina')
 * @returns Bar dimensions { width, height }
 */
export function calculateProgressBarSize(
  isMobile: boolean,
  type: 'health' | 'ki' | 'stamina'
): { width: number; height: number } {
  if (isMobile) {
    // Mobile: touch-friendly sizes
    const height = type === 'health' ? 48 : 40; // Health bar larger
    return {
      width: 160,
      height,
    };
  }

  // Desktop: more detailed display
  const height = type === 'health' ? 55 : 45;
  return {
    width: 220,
    height,
  };
}

/**
 * Get optimal grid layout for trigram stance selector
 * 
 * @param isMobile - Whether on mobile device
 * @param isLandscape - Whether in landscape orientation
 * @returns Grid configuration { columns, rows, gap }
 */
export function getStanceSelectorLayout(
  isMobile: boolean,
  isLandscape: boolean
): { columns: number; rows: number; gap: number } {
  if (isMobile) {
    if (isLandscape) {
      // Landscape: horizontal layout
      return { columns: 4, rows: 2, gap: 8 };
    }
    // Portrait: compact grid
    return { columns: 4, rows: 2, gap: 10 };
  }

  // Desktop: spacious layout
  return { columns: 4, rows: 2, gap: 15 };
}

/**
 * Resolution breakpoints for responsive design
 * @korean 반응형 중단점
 */
export interface ResolutionBreakpoints {
  readonly mobile: number;    // 768px
  readonly tablet: number;    // 1280px
  readonly desktop: number;   // 1920px
  readonly ultrawide: number; // 2560px
}

/**
 * Standard breakpoints for responsive sizing
 */
export const BREAKPOINTS: ResolutionBreakpoints = Object.freeze({
  mobile: 768,
  tablet: 1280,
  desktop: 1920,
  ultrawide: 2560,
});

/**
 * Get responsive size based on screen width
 * Scales linearly between breakpoints
 * 
 * @param width - Screen width in pixels
 * @param sizes - Size values at each breakpoint
 * @returns Interpolated size value
 * 
 * @example
 * ```typescript
 * const fontSize = getResponsiveSize(1024, { mobile: 12, tablet: 14, desktop: 16 });
 * // Returns ~13.3 (interpolated between mobile and tablet)
 * ```
 */
export function getResponsiveSize(
  width: number,
  sizes: { mobile: number; tablet: number; desktop: number }
): number {
  if (width < BREAKPOINTS.mobile) {
    return sizes.mobile;
  }
  if (width < BREAKPOINTS.tablet) {
    const ratio = (width - BREAKPOINTS.mobile) / (BREAKPOINTS.tablet - BREAKPOINTS.mobile);
    return sizes.mobile + (sizes.tablet - sizes.mobile) * ratio;
  }
  if (width < BREAKPOINTS.desktop) {
    const ratio = (width - BREAKPOINTS.tablet) / (BREAKPOINTS.desktop - BREAKPOINTS.tablet);
    return sizes.tablet + (sizes.desktop - sizes.tablet) * ratio;
  }
  return sizes.desktop;
}

/**
 * Calculate HUD height as percentage of screen height
 * Ensures minimum and maximum bounds for usability
 * 
 * @param height - Screen height in pixels
 * @param percentage - Target percentage (0.0 - 1.0)
 * @returns Calculated HUD height with bounds applied
 * 
 * @example
 * ```typescript
 * const hudHeight = getHUDHeight(1080, 0.08); // ~86px (8% of 1080)
 * const tooSmall = getHUDHeight(400, 0.08);   // 40px (minimum applied)
 * const tooLarge = getHUDHeight(3000, 0.08);  // 120px (maximum applied)
 * ```
 */
export function getHUDHeight(height: number, percentage: number): number {
  return Math.max(40, Math.min(120, height * percentage));
}

/**
 * Calculate padding based on resolution
 * 
 * @param width - Screen width in pixels
 * @returns Padding value in pixels
 * 
 * @example
 * ```typescript
 * const padding = getResponsivePadding(375);  // 8px (mobile)
 * const padding = getResponsivePadding(1920); // 16px (desktop)
 * ```
 */
export function getResponsivePadding(width: number): number {
  return getResponsiveSize(width, { mobile: 8, tablet: 12, desktop: 16 });
}

/**
 * Calculate font size based on resolution
 * 
 * @param width - Screen width in pixels
 * @returns Font size in pixels
 * 
 * @example
 * ```typescript
 * const fontSize = getResponsiveFontSize(375);  // 12px (mobile)
 * const fontSize = getResponsiveFontSize(1920); // 16px (desktop)
 * ```
 */
export function getResponsiveFontSize(width: number): number {
  return getResponsiveSize(width, { mobile: 12, tablet: 14, desktop: 16 });
}

/**
 * Determine if mobile controls should be shown
 * NOTE: This is the ONLY valid use of isMobile prop
 * 
 * @param width - Screen width in pixels
 * @param isMobile - Optional mobile device flag
 * @returns Whether to show mobile controls
 * 
 * @example
 * ```typescript
 * const showControls = shouldShowMobileControls(500, false); // true (narrow screen)
 * const showControls = shouldShowMobileControls(1920, false); // false (wide screen)
 * const showControls = shouldShowMobileControls(1920, true); // true (mobile device)
 * ```
 */
export function shouldShowMobileControls(width: number, isMobile: boolean = false): boolean {
  return isMobile || width < BREAKPOINTS.mobile;
}
