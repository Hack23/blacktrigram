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

/** Desktop arena width as a proportion of viewport width. */
const DESKTOP_ARENA_WIDTH_RATIO = 0.8;

/**
 * Maximum desktop arena width in CSS pixels.
 *
 * Caps ultra-wide/8K displays to protect WebGL fill-rate while preserving a
 * large, readable 4K desktop arena.
 */
const DESKTOP_ARENA_MAX_WIDTH_PX = 2560;

/**
 * Calculate maximum desktop arena width for combat/training screens.
 *
 * @param width - Viewport width in CSS pixels
 * @returns Width budget for the 4:3 desktop arena
 *
 * @public
 */
export function getDesktopArenaWidthBudget(width: number): number {
  return Math.min(width * DESKTOP_ARENA_WIDTH_RATIO, DESKTOP_ARENA_MAX_WIDTH_PX);
}

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
 * 
 * @public
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
 * 
 * @public
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
 * 
 * @public
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
 * 
 * @public
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
 * 
 * @public
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
 * const layout = getLayoutConstants(3840); // 4K display
 * // {
 * //   padding: 35,
 * //   headerHeight: 120,
 * //   footerHeight: 100,
 * //   sectionSpacing: 25,
 * //   buttonArea: 110
 * // }
 * ```
 * 
 * @public
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
 * Optimized for narrow devices (<450px), with extra-small device support
 * explicitly tuned for ultra-small screens (<380px) like iPhone SE, old
 * Android phones, and budget smartphones.
 * 
 * Now properly handles high-resolution mobile devices (2K+, Super HD) by
 * checking isMobile flag to ensure they get mobile-optimized layout values
 * regardless of pixel width.
 * 
 * @param width - Screen width in pixels
 * @param isMobile - Optional: Whether device is mobile (from user-agent detection)
 * @returns Object with combat layout constant values
 * 
 * @example
 * ```typescript
 * // Extra-small mobile (iPhone SE)
 * const layout = getCombatLayoutConstants(375, true);
 * // { padding: 8, hudHeight: 85, controlsHeight: 150, ... }
 * 
 * // High-res mobile (Motorola Edge 60 Pro)
 * const layoutHD = getCombatLayoutConstants(2712, true);
 * // { padding: 10, hudHeight: 95, controlsHeight: 160, ... } (mobile values!)
 * 
 * // Desktop
 * const layoutDesktop = getCombatLayoutConstants(1920, false);
 * // { padding: 10, hudHeight: 135, controlsHeight: 175, ... } (desktop values)
 * ```
 * 
 * @public
 */
export function getCombatLayoutConstants(width: number, isMobile?: boolean) {
  // For mobile devices, force 'mobile' screen size regardless of pixel width
  // This ensures high-res mobile devices (2K+) get mobile-optimized layouts
  const screenSize = isMobile ? 'mobile' : getScreenSize(width);
  
  // Extra-small detection for low-end mobile devices (<380px)
  const isExtraSmall = isMobile && width < 380;
  
  // Combat screen uses different base values for compact HUD
  const hudHeightMap = {
    mobile: isExtraSmall ? 85 : 95,
    tablet: 100,
    desktop: 130,
    large: 135,
    xlarge: 140,
  };
  
  // Note: Tablet optimizations - controlsHeight and footerHeight are intentionally
  // smaller on tablets than mobile for better landscape orientation ergonomics.
  // Mobile (portrait) needs taller controls for thumb reach, while tablets
  // (often landscape) can use more compact controls with better screen utilization.
  const controlsHeightMap = {
    mobile: isExtraSmall ? 150 : 160, // Taller for portrait thumb reach
    tablet: 140,  // Optimized for landscape - more compact
    desktop: 170,
    large: 175,
    xlarge: 180,
  };
  
  const footerHeightMap = {
    mobile: 34,  // Adequate for portrait orientation
    tablet: 30,   // Optimized for landscape - more compact
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
  
  // Touch target heights - WCAG AA compliance (minimum 44px)
  const buttonHeightMap = {
    mobile: isExtraSmall ? 48 : 55, // Minimum 48px for extra-small
    tablet: 55,
    desktop: 60,
    large: 60,
    xlarge: 60,
  };
  
  return {
    padding: isExtraSmall ? 8 : 10, // Reduced padding for extra-small
    hudHeight: hudHeightMap[screenSize],
    controlsHeight: controlsHeightMap[screenSize],
    footerHeight: footerHeightMap[screenSize],
    healthBarHeight: healthBarHeightMap[screenSize],
    buttonHeight: buttonHeightMap[screenSize],
  };
}
