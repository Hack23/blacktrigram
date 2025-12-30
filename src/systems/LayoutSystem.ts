/**
 * Unified Layout System for consistent component positioning
 *
 * Provides grid-based layout calculations, responsive positioning utilities,
 * and alignment helpers for all screens in Black Trigram (흑괘).
 *
 * Features:
 * - 12-column grid system for consistent alignment
 * - Responsive positioning that adapts to screen size
 * - Safe area handling for mobile devices with notches
 * - Z-index hierarchy management
 * - Korean-English UI alignment support
 *
 * Performance target: <1ms for layout calculations
 *
 * @module systems/LayoutSystem
 * @category Systems
 * @korean 레이아웃시스템
 */

import { Position } from "../types/common";
import {
  ContainerBounds,
  HorizontalAlignment,
  ResponsivePosition,
  SafeAreaInsets,
  ScreenSize,
  VerticalAlignment,
} from "../types/LayoutTypes";

/**
 * Default grid configuration
 */
const DEFAULT_GRID_COLUMNS = 12;
const DEFAULT_GUTTER_SIZE = 20;
const BASE_DESKTOP_WIDTH = 1200;

/**
 * Default safe area insets for mobile devices
 * Based on typical iOS device dimensions (iPhone 14 Pro as reference)
 */
const DEFAULT_SAFE_AREA: SafeAreaInsets = {
  top: 44, // Status bar + notch
  right: 0,
  bottom: 34, // Home indicator
  left: 0,
};

/**
 * LayoutSystem Class
 *
 * Provides unified layout calculations and positioning utilities
 * for consistent component placement across all screens.
 *
 * @example
 * ```typescript
 * const layout = new LayoutSystem();
 *
 * // Calculate grid position
 * const pos = layout.calculateGridPosition(2, 4, 1200);
 * // Returns { x: 200, width: 380 } for column 2, span 4
 *
 * // Calculate responsive position
 * const screenSize = { width: 375, height: 667, isMobile: true, isTablet: false, isDesktop: false, isLandscape: false };
 * const responsivePos = layout.calculateResponsivePosition(
 *   { base: { x: 100, y: 50 } },
 *   screenSize
 * );
 * ```
 */
export class LayoutSystem {
  private readonly gridColumns: number;
  private readonly gutterSize: number;
  private readonly safeArea: SafeAreaInsets;

  /**
   * Create a new LayoutSystem instance
   *
   * @param gridColumns - Number of grid columns (default: 12)
   * @param gutterSize - Gutter size between columns in pixels (default: 20)
   * @param safeArea - Safe area insets for mobile devices
   */
  constructor(
    gridColumns: number = DEFAULT_GRID_COLUMNS,
    gutterSize: number = DEFAULT_GUTTER_SIZE,
    safeArea: SafeAreaInsets = DEFAULT_SAFE_AREA
  ) {
    this.gridColumns = gridColumns;
    this.gutterSize = gutterSize;
    this.safeArea = safeArea;
  }

  /**
   * Calculate position and width for grid-based layout
   *
   * Uses 12-column grid system for consistent alignment.
   * Accounts for gutters between columns.
   *
   * @param column - Starting column (0-11)
   * @param span - Number of columns to span (1-12)
   * @param containerWidth - Total container width in pixels
   * @param customGutter - Custom gutter size (optional)
   * @returns Position and width for the grid cell
   *
   * @example
   * ```typescript
   * // Center element spanning 6 columns
   * const pos = layout.calculateGridPosition(3, 6, 1200);
   * // Returns { x: 300, width: 580 }
   * ```
   */
  calculateGridPosition(
    column: number,
    span: number,
    containerWidth: number,
    customGutter?: number
  ): { x: number; width: number } {
    const gutter = customGutter ?? this.gutterSize;
    const columnWidth = containerWidth / this.gridColumns;

    // Calculate x position
    const x = column * columnWidth;

    // Calculate width accounting for gutters
    // Width = (span * columnWidth) - gutter
    // The gutter is subtracted to create spacing between elements
    const width = span * columnWidth - gutter;

    return { x, width };
  }

  /**
   * Calculate responsive position based on screen size
   *
   * Scales position proportionally or uses specific overrides for tablet/mobile.
   *
   * @param config - Responsive position configuration
   * @param screenSize - Current screen dimensions and device type
   * @returns Calculated position for current screen size
   *
   * @example
   * ```typescript
   * const pos = layout.calculateResponsivePosition(
   *   {
   *     base: { x: 100, y: 50 },
   *     mobile: { x: 10, y: 20 },
   *     scaleProportionally: true
   *   },
   *   screenSize
   * );
   * ```
   */
  calculateResponsivePosition(
    config: ResponsivePosition,
    screenSize: ScreenSize
  ): Position {
    // Use specific override if available
    if (screenSize.isMobile && config.mobile) {
      return config.mobile;
    }
    if (screenSize.isTablet && config.tablet) {
      return config.tablet;
    }

    // Use base position for desktop
    if (screenSize.isDesktop || !config.scaleProportionally) {
      return config.base;
    }

    // Scale proportionally for mobile/tablet if no override
    const scale = screenSize.width / BASE_DESKTOP_WIDTH;
    return {
      x: config.base.x * scale,
      y: config.base.y * scale,
    };
  }

  /**
   * Calculate safe position accounting for device notches and home indicators
   *
   * Ensures UI elements don't overlap with system UI on mobile devices.
   *
   * @param position - Base position
   * @param edge - Which edge to apply safe area ('top' | 'bottom' | 'left' | 'right')
   * @returns Position adjusted for safe area
   *
   * @example
   * ```typescript
   * // Adjust top position for status bar/notch
   * const safePos = layout.calculateSafePosition({ x: 0, y: 10 }, 'top');
   * // Returns { x: 0, y: 54 } (10 + 44 for notch)
   * ```
   */
  calculateSafePosition(
    position: Position,
    edge: "top" | "bottom" | "left" | "right"
  ): Position {
    const inset = this.safeArea[edge];
    switch (edge) {
      case "top":
        return { ...position, y: position.y + inset };
      case "bottom":
        return { ...position, y: position.y - inset };
      case "left":
        return { ...position, x: position.x + inset };
      case "right":
        return { ...position, x: position.x - inset };
    }
  }

  /**
   * Align element horizontally within container
   *
   * @param elementWidth - Width of element to align
   * @param containerWidth - Width of container
   * @param alignment - Alignment type ('left' | 'center' | 'right')
   * @param margin - Optional margin from edges
   * @returns X position for alignment
   *
   * @example
   * ```typescript
   * const x = layout.alignHorizontal(200, 800, 'center', 10);
   * // Returns 300 (centered with margins)
   * ```
   */
  alignHorizontal(
    elementWidth: number,
    containerWidth: number,
    alignment: HorizontalAlignment,
    margin: number = 0
  ): number {
    switch (alignment) {
      case "left":
        return margin;
      case "center":
        return (containerWidth - elementWidth) / 2;
      case "right":
        return containerWidth - elementWidth - margin;
    }
  }

  /**
   * Align element vertically within container
   *
   * @param elementHeight - Height of element to align
   * @param containerHeight - Height of container
   * @param alignment - Alignment type ('top' | 'middle' | 'bottom')
   * @param margin - Optional margin from edges
   * @returns Y position for alignment
   *
   * @example
   * ```typescript
   * const y = layout.alignVertical(100, 600, 'middle', 10);
   * // Returns 250 (vertically centered)
   * ```
   */
  alignVertical(
    elementHeight: number,
    containerHeight: number,
    alignment: VerticalAlignment,
    margin: number = 0
  ): number {
    switch (alignment) {
      case "top":
        return margin;
      case "middle":
        return (containerHeight - elementHeight) / 2;
      case "bottom":
        return containerHeight - elementHeight - margin;
    }
  }

  /**
   * Create screen size information from dimensions
   *
   * Determines device type and orientation based on screen dimensions.
   *
   * @param width - Screen width in pixels
   * @param height - Screen height in pixels
   * @returns ScreenSize object with device type flags
   *
   * @example
   * ```typescript
   * const screenSize = layout.getScreenSize(375, 667);
   * // Returns { width: 375, height: 667, isMobile: true, ... }
   * ```
   */
  getScreenSize(width: number, height: number): ScreenSize {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;
    const isDesktop = width >= 1200;
    const isLandscape = width > height;

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isLandscape,
    };
  }

  /**
   * Calculate container bounds for arena or game area
   *
   * Accounts for HUD, controls, and safe areas to determine usable space.
   *
   * @param screenWidth - Total screen width
   * @param screenHeight - Total screen height
   * @param hudHeight - Height of top HUD
   * @param controlsHeight - Height of bottom controls
   * @param padding - Padding around content
   * @returns Container bounds for game content
   *
   * @example
   * ```typescript
   * const bounds = layout.calculateContainerBounds(1200, 800, 120, 0, 10);
   * // Returns bounds for desktop game area
   * ```
   */
  calculateContainerBounds(
    screenWidth: number,
    screenHeight: number,
    hudHeight: number = 0,
    controlsHeight: number = 0,
    padding: number = 10
  ): ContainerBounds {
    const screenSize = this.getScreenSize(screenWidth, screenHeight);

    // Calculate available height
    const topOffset = hudHeight + padding + (screenSize.isMobile ? this.safeArea.top : 0);
    const bottomOffset = controlsHeight + padding + (screenSize.isMobile ? this.safeArea.bottom : 0);
    const availableHeight = screenHeight - topOffset - bottomOffset;

    // Calculate width accounting for padding
    const availableWidth = screenWidth - padding * 2;

    // Calculate scale for mobile (arena should be smaller on mobile)
    const scale = screenSize.isMobile ? Math.min(availableWidth / 960, 1.0) : 1.0;

    return {
      x: padding,
      y: topOffset,
      width: availableWidth,
      height: availableHeight,
      scale,
    };
  }
}

/**
 * Default singleton instance for convenience
 *
 * @example
 * ```typescript
 * import { defaultLayoutSystem } from './systems/LayoutSystem';
 *
 * const pos = defaultLayoutSystem.alignHorizontal(200, 800, 'center');
 * ```
 */
export const defaultLayoutSystem = new LayoutSystem();

/**
 * Helper function to create grid-based position
 *
 * Convenience wrapper around LayoutSystem.calculateGridPosition
 *
 * @param column - Starting column (0-11)
 * @param span - Number of columns to span (1-12)
 * @param containerWidth - Total container width
 * @returns Position and width for grid cell
 */
export function calculateGridPosition(
  column: number,
  span: number,
  containerWidth: number
): { x: number; width: number } {
  return defaultLayoutSystem.calculateGridPosition(column, span, containerWidth);
}

/**
 * Helper function to align element horizontally
 *
 * @param elementWidth - Width of element
 * @param containerWidth - Width of container
 * @param alignment - Alignment type
 * @param margin - Optional margin
 * @returns X position
 */
export function alignHorizontal(
  elementWidth: number,
  containerWidth: number,
  alignment: HorizontalAlignment = "center",
  margin: number = 0
): number {
  return defaultLayoutSystem.alignHorizontal(elementWidth, containerWidth, alignment, margin);
}

/**
 * Helper function to align element vertically
 *
 * @param elementHeight - Height of element
 * @param containerHeight - Height of container
 * @param alignment - Alignment type
 * @param margin - Optional margin
 * @returns Y position
 */
export function alignVertical(
  elementHeight: number,
  containerHeight: number,
  alignment: VerticalAlignment = "middle",
  margin: number = 0
): number {
  return defaultLayoutSystem.alignVertical(elementHeight, containerHeight, alignment, margin);
}

/**
 * Helper function to center element in container
 *
 * @param elementWidth - Width of element
 * @param elementHeight - Height of element
 * @param containerWidth - Width of container
 * @param containerHeight - Height of container
 * @returns Centered position
 */
export function centerElement(
  elementWidth: number,
  elementHeight: number,
  containerWidth: number,
  containerHeight: number
): Position {
  return {
    x: alignHorizontal(elementWidth, containerWidth, "center"),
    y: alignVertical(elementHeight, containerHeight, "middle"),
  };
}
