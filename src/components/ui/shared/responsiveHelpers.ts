/**
 * Responsive sizing helpers for shared HUD components
 * 
 * Provides utility functions to calculate responsive sizes based on
 * screen width and mobile detection, reducing code duplication.
 * 
 * @module components/ui/shared/responsiveHelpers
 * @category UI Helpers
 */

import { getResponsiveValue, ResponsiveSize } from "../../../theme/korean-cyberpunk";

/**
 * Configuration for component responsive sizes
 */
export interface ComponentSizes {
  readonly width: ResponsiveSize;
  readonly height: ResponsiveSize;
  readonly fontSize: ResponsiveSize;
  readonly padding?: ResponsiveSize;
}

/**
 * Calculated responsive values
 */
export interface CalculatedSizes {
  readonly width: number;
  readonly height: number;
  readonly fontSize: number;
  readonly padding?: number;
}

/**
 * Calculate responsive sizes for a component
 * 
 * @param sizes - Component size configuration
 * @param isMobile - Whether device is mobile
 * @param screenWidth - Current screen width in pixels
 * @returns Calculated responsive sizes
 * 
 * @example
 * ```tsx
 * const sizes = getResponsiveSizes(HEALTH_BAR_SIZES, isMobile, screenWidth);
 * // Use sizes.width, sizes.height, etc.
 * ```
 */
export const getResponsiveSizes = (
  sizes: ComponentSizes,
  isMobile: boolean,
  screenWidth: number
): CalculatedSizes => {
  const base = {
    width: isMobile
      ? sizes.width.mobile
      : getResponsiveValue(sizes.width, screenWidth),
    height: isMobile
      ? sizes.height.mobile
      : getResponsiveValue(sizes.height, screenWidth),
    fontSize: isMobile
      ? sizes.fontSize.mobile
      : getResponsiveValue(sizes.fontSize, screenWidth),
  };

  // Only include padding if it's provided
  if (sizes.padding) {
    return {
      ...base,
      padding: isMobile
        ? sizes.padding.mobile
        : getResponsiveValue(sizes.padding, screenWidth),
    };
  }

  return base;
};
