/**
 * Responsive Layout Helpers
 * 
 * Centralized utilities for calculating responsive layout constants
 * across different screen components. Uses the centralized ResponsiveScaling
 * system for consistent scaling patterns.
 * 
 * @module utils/responsiveLayoutHelpers
 * @category Layout
 * @korean 반응형레이아웃도우미
 */

import { getScreenSize } from '../systems/ResponsiveScaling';
import type { ScreenSize } from '../systems/ResponsiveScaling';

/**
 * Base layout values for different screen sizes
 * These serve as reference values that scale proportionally
 */
const BASE_LAYOUT_VALUES = {
  // Base padding values (desktop reference)
  padding: {
    mobile: 20,
    tablet: 25,
    desktop: 30,
    large: 32,
    xlarge: 35,
  },
  // Base header height values
  headerHeight: {
    mobile: 90,
    tablet: 100,
    desktop: 110,
    large: 115,
    xlarge: 120,
  },
  // Base footer height values
  footerHeight: {
    mobile: 75,
    tablet: 85,
    desktop: 90,
    large: 95,
    xlarge: 100,
  },
  // Base section spacing values
  sectionSpacing: {
    mobile: 15,
    tablet: 18,
    desktop: 20,
    large: 22,
    xlarge: 25,
  },
  // Base button area values
  buttonArea: {
    mobile: 75,
    tablet: 85,
    desktop: 95,
    large: 102,
    xlarge: 110,
  },
} as const;

/**
 * Calculate responsive padding value
 * 
 * @param screenSize - Current screen size category
 * @returns Calculated padding in pixels
 * 
 * @example
 * ```typescript
 * const padding = getResponsivePadding('xlarge'); // 35
 * const padding = getResponsivePadding('mobile'); // 20
 * ```
 */
export function getResponsivePadding(screenSize: ScreenSize): number {
  return BASE_LAYOUT_VALUES.padding[screenSize];
}

/**
 * Calculate responsive header height value
 * 
 * @param screenSize - Current screen size category
 * @returns Calculated header height in pixels
 * 
 * @example
 * ```typescript
 * const headerHeight = getResponsiveHeaderHeight('xlarge'); // 120
 * const headerHeight = getResponsiveHeaderHeight('mobile'); // 90
 * ```
 */
export function getResponsiveHeaderHeight(screenSize: ScreenSize): number {
  return BASE_LAYOUT_VALUES.headerHeight[screenSize];
}

/**
 * Calculate responsive footer height value
 * 
 * @param screenSize - Current screen size category
 * @returns Calculated footer height in pixels
 * 
 * @example
 * ```typescript
 * const footerHeight = getResponsiveFooterHeight('xlarge'); // 100
 * const footerHeight = getResponsiveFooterHeight('mobile'); // 75
 * ```
 */
export function getResponsiveFooterHeight(screenSize: ScreenSize): number {
  return BASE_LAYOUT_VALUES.footerHeight[screenSize];
}

/**
 * Calculate responsive section spacing value
 * 
 * @param screenSize - Current screen size category
 * @returns Calculated section spacing in pixels
 * 
 * @example
 * ```typescript
 * const spacing = getResponsiveSectionSpacing('xlarge'); // 25
 * const spacing = getResponsiveSectionSpacing('mobile'); // 15
 * ```
 */
export function getResponsiveSectionSpacing(screenSize: ScreenSize): number {
  return BASE_LAYOUT_VALUES.sectionSpacing[screenSize];
}

/**
 * Calculate responsive button area value
 * 
 * @param screenSize - Current screen size category
 * @returns Calculated button area in pixels
 * 
 * @example
 * ```typescript
 * const buttonArea = getResponsiveButtonArea('xlarge'); // 110
 * const buttonArea = getResponsiveButtonArea('mobile'); // 75
 * ```
 */
export function getResponsiveButtonArea(screenSize: ScreenSize): number {
  return BASE_LAYOUT_VALUES.buttonArea[screenSize];
}

/**
 * Get all layout constants for a given screen size
 * Convenient helper that returns all layout values at once
 * 
 * @param width - Screen width in pixels
 * @returns Object with all layout constant values
 * 
 * @example
 * ```typescript
 * const layout = getLayoutConstants(1920);
 * // {
 * //   padding: 35,
 * //   headerHeight: 120,
 * //   footerHeight: 100,
 * //   sectionSpacing: 25,
 * //   buttonArea: 110
 * // }
 * ```
 */
export function getLayoutConstants(width: number) {
  const screenSize = getScreenSize(width);
  
  return {
    padding: getResponsivePadding(screenSize),
    headerHeight: getResponsiveHeaderHeight(screenSize),
    footerHeight: getResponsiveFooterHeight(screenSize),
    sectionSpacing: getResponsiveSectionSpacing(screenSize),
    buttonArea: getResponsiveButtonArea(screenSize),
  };
}

/**
 * Get combat-specific layout constants for a given screen size
 * 
 * @param width - Screen width in pixels
 * @returns Object with combat layout constant values
 * 
 * @example
 * ```typescript
 * const layout = getCombatLayoutConstants(1920);
 * // {
 * //   padding: 10,
 * //   hudHeight: 140,
 * //   controlsHeight: 180,
 * //   footerHeight: 40,
 * //   healthBarHeight: 70
 * // }
 * ```
 */
export function getCombatLayoutConstants(width: number) {
  const screenSize = getScreenSize(width);
  
  // Combat screen uses different base values for compact HUD
  const hudHeightMap = {
    mobile: 95,
    tablet: 100,
    desktop: 130,
    large: 135,
    xlarge: 140,
  };
  
  const controlsHeightMap = {
    mobile: 160,
    tablet: 140,
    desktop: 170,
    large: 175,
    xlarge: 180,
  };
  
  const footerHeightMap = {
    mobile: 34,
    tablet: 30,
    desktop: 35,
    large: 37,
    xlarge: 40,
  };
  
  const healthBarHeightMap = {
    mobile: 48,
    tablet: 50,
    desktop: 65,
    large: 67,
    xlarge: 70,
  };
  
  return {
    padding: 10, // Combat screen uses minimal padding
    hudHeight: hudHeightMap[screenSize],
    controlsHeight: controlsHeightMap[screenSize],
    footerHeight: footerHeightMap[screenSize],
    healthBarHeight: healthBarHeightMap[screenSize],
  };
}
