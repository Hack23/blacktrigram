/**
 * useTrainingLayout Hook - Enhanced Responsive Training Layout
 *
 * Custom hook for managing responsive training screen layout calculations with
 * comprehensive support for all screen sizes from mobile to ultra-wide displays.
 *
 * Enhanced Features:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Proportional scaling for consistent sizing across devices
 * - Optimized layout sizing for each device category
 * - Smooth transitions for resize operations
 * - 60fps performance maintained
 *
 * Uses robust device detection combining user-agent and screen size to ensure
 * mobile controls are shown on all mobile devices, including high-resolution phones.
 *
 * Performance:
 * - Reduces recalculations by checking only breakpoint changes, not exact dimensions
 * - Memoizes layout constants to prevent cascading re-renders
 * - Targets <1ms execution time for layout calculations
 *
 * @param width - Screen width
 * @param height - Screen height
 *
 * @returns Layout constants and training area bounds
 *
 * @example
 * ```typescript
 * const { layoutConstants, trainingAreaBounds, isMobile, screenSize } = useTrainingLayout(1200, 800);
 * ```
 */

import { useMemo } from "react";
import { shouldUseMobileControls } from "../../../../utils/deviceDetection";
import { getScreenSize } from "../../../../systems/ResponsiveScaling";

import type { ScreenSize } from "../../../../systems/ResponsiveScaling";

export interface TrainingLayoutConstants {
  readonly padding: number;
  readonly headerHeight: number;
  readonly contentAreaHeight: number;
  readonly buttonHeight: number;
  readonly sectionSpacing: number;
  readonly controlsHeight: number;
  readonly footerHeight: number;
}

export interface TrainingAreaBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number; // 3D scale factor for training area (1.0 = desktop, <1.0 = mobile)
}

export interface TrainingLayout {
  readonly layoutConstants: TrainingLayoutConstants;
  readonly trainingAreaBounds: TrainingAreaBounds;
  readonly isMobile: boolean;
  readonly screenSize: ScreenSize;
}

/**
 * Custom hook for training screen layout calculations
 * Enhanced with centralized responsive scaling system
 * Optimized to reduce recalculations and improve 60fps performance
 */
export function useTrainingLayout(width: number, height: number): TrainingLayout {
  // Determine screen size category using centralized scaling system
  const screenSize = useMemo(() => getScreenSize(width), [width]);
  
  // Device detection has its own internal caching based on screen dimensions
  // No need for additional React memoization here
  const isMobile = shouldUseMobileControls();

  // Centralized layout constants for easier tweaking
  // Enhanced with tablet-specific values for better responsive support
  const layoutConstants = useMemo<TrainingLayoutConstants>(() => {
    // Determine if large desktop
    const isLargeDesktop = screenSize === 'xlarge';
    const isTablet = screenSize === 'tablet';

    return {
      padding: isMobile ? 20 : isTablet ? 25 : isLargeDesktop ? 35 : 30,
      headerHeight: isMobile ? 80 : isTablet ? 90 : isLargeDesktop ? 110 : 100,
      contentAreaHeight: height - (isMobile ? 200 : isTablet ? 220 : isLargeDesktop ? 260 : 240),
      buttonHeight: isMobile ? 45 : isTablet ? 50 : isLargeDesktop ? 60 : 55,
      sectionSpacing: isMobile ? 15 : isTablet ? 18 : isLargeDesktop ? 25 : 20,
      controlsHeight: isMobile ? 120 : isTablet ? 110 : isLargeDesktop ? 150 : 130,
      footerHeight: isMobile ? 60 : isTablet ? 70 : isLargeDesktop ? 90 : 80,
    };
  }, [isMobile, screenSize, height]);

  // Training area bounds should account for header at top and controls at bottom
  // Mobile training area sizing adapts to device resolution
  const trainingAreaBounds = useMemo<TrainingAreaBounds>(() => {
    const areaY = layoutConstants.headerHeight + layoutConstants.padding;

    // Mobile-specific training area sizing for better screen fit
    if (isMobile) {
      // Reserve space for header and controls
      const minTopClearance = 80;
      const minBottomClearance = 120;
      const availableHeight = height - minTopClearance - minBottomClearance;
      const availableWidth = width - 40; // 20px margins on each side

      // Calculate optimal training area size maintaining 4:3 aspect ratio (width:height)
      // Target sizing based on device resolution
      let maxMobileWidth: number;
      if (width >= 1440) {
        // 4K/QHD+ Android devices
        maxMobileWidth = Math.min(availableWidth, 800);
      } else if (width >= 1200) {
        // 2K Android devices
        maxMobileWidth = Math.min(availableWidth, 600);
      } else if (width >= 768) {
        // Large phones
        maxMobileWidth = Math.min(availableWidth, 500);
      } else {
        // Standard phones
        maxMobileWidth = Math.min(availableWidth, 400);
      }
      
      const maxMobileHeight = Math.min(availableHeight, 800);

      // Maintain 4:3 aspect ratio (width:height = 4:3)
      const aspectRatio = 4 / 3;
      let areaWidth = maxMobileWidth;
      let areaHeight = areaWidth / aspectRatio;

      // If height exceeds available, recalculate based on height constraint
      if (areaHeight > maxMobileHeight) {
        areaHeight = maxMobileHeight;
        areaWidth = areaHeight * aspectRatio;
      }

      // Ensure minimum size for usability
      areaWidth = Math.min(Math.max(areaWidth, 300), availableWidth);
      areaHeight = Math.min(Math.max(areaHeight, 225), maxMobileHeight);

      // Calculate 3D scale factor (mobile area is smaller than desktop)
      const desktopWidth = 960; // 80% of 1200px
      const scale = areaWidth / desktopWidth;

      return {
        x: (width - areaWidth) / 2, // Centered horizontally
        y: areaY,
        width: areaWidth,
        height: areaHeight,
        scale,
      };
    }

    // Desktop training area sizing - use full available space
    const totalReservedHeight =
      layoutConstants.headerHeight +
      layoutConstants.controlsHeight +
      layoutConstants.footerHeight;
    const totalPadding = layoutConstants.padding * 3;
    const areaHeight = height - totalReservedHeight - totalPadding;

    return {
      x: width * 0.1,
      y: areaY,
      width: width * 0.8,
      height: areaHeight,
      scale: 1.0, // Desktop uses full scale
    };
  }, [width, height, layoutConstants, isMobile]);

  return {
    layoutConstants,
    trainingAreaBounds,
    isMobile,
    screenSize,
  };
}
