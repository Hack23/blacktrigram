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
 * @param _position - Desired position (top, bottom, left, right) - currently unused
 * @param value - Position value in pixels
 * @param safeAreaInset - Safe area inset for that edge
 * @returns Adjusted position value
 * 
 * @example
 * ```typescript
 * const top = calculateSafePosition('top', 10, 44); // 54px (10 + 44)
 * const bottom = calculateSafePosition('bottom', 20, 34); // 54px (20 + 34)
 * ```
 */
export function calculateSafePosition(
  _position: 'top' | 'bottom' | 'left' | 'right',
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
 * @param _viewportHeight - Viewport height in pixels - currently unused but reserved for future enhancements
 * @param isLandscape - Whether in landscape orientation
 * @returns HUD height in pixels
 * 
 * @example
 * ```typescript
 * const hudHeight = calculateHUDHeight(375, 667, false); // ~80px for mobile portrait
 * const hudHeight = calculateHUDHeight(667, 375, true); // ~60px for mobile landscape
 * ```
 */
export function calculateHUDHeight(
  viewportWidth: number,
  _viewportHeight: number,
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
