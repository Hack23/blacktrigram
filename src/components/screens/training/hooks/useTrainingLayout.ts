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
import { getScreenSize } from "../../../../systems/ResponsiveScaling";
import { calculateArenaWorldDimensions } from "../../../../utils/arenaWorldDimensions";
import { shouldUseMobileControls } from "../../../../utils/deviceDetection";
import { calculateMobileAreaBounds } from "../../../../utils/mobileLayoutHelpers";
import {
  mobileControlsBottomClearance,
  PORTRAIT_FORCE_MAX_WIDTH_PX,
  PORTRAIT_HYSTERESIS_FACTOR,
} from "../../../../utils/responsiveOrientationConstants";
import { getDesktopArenaWidthBudget } from "../../../../utils/responsiveLayoutHelpers";

import type { ScreenSize } from "../../../../systems/ResponsiveScaling";

export interface TrainingLayoutConstants {
  readonly padding: number;
  readonly headerHeight: number;
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
  readonly worldWidthMeters: number; // Physical training area width in meters
  readonly worldDepthMeters: number; // Physical training area depth in meters
}

export interface TrainingLayout {
  readonly layoutConstants: TrainingLayoutConstants;
  readonly trainingAreaBounds: TrainingAreaBounds;
  readonly isMobile: boolean;
  readonly isPortrait: boolean;
  readonly screenSize: ScreenSize;
}

/**
 * Custom hook for training screen layout calculations
 * Enhanced with centralized responsive scaling system
 * Optimized to reduce recalculations and improve 60fps performance
 */
export function useTrainingLayout(
  width: number,
  height: number,
): TrainingLayout {
  const screenSize = useMemo(() => getScreenSize(width), [width]);

  const isPortrait = height > width * PORTRAIT_HYSTERESIS_FACTOR;

  const isMobile =
    shouldUseMobileControls() ||
    (isPortrait && width < PORTRAIT_FORCE_MAX_WIDTH_PX);

  const layoutConstants = useMemo<TrainingLayoutConstants>(() => {
    const isLargeDesktop = screenSize === "xlarge";
    const isTablet = screenSize === "tablet";

    return {
      padding: isMobile ? 20 : isTablet ? 25 : isLargeDesktop ? 35 : 30,
      headerHeight: isMobile ? 80 : isTablet ? 90 : isLargeDesktop ? 110 : 100,
      buttonHeight: isMobile ? 45 : isTablet ? 50 : isLargeDesktop ? 60 : 55,
      sectionSpacing: isMobile ? 15 : isTablet ? 18 : isLargeDesktop ? 25 : 20,
      controlsHeight: isMobile
        ? 120
        : isTablet
          ? 110
          : isLargeDesktop
            ? 150
            : 130,
      footerHeight: isMobile ? 60 : isTablet ? 70 : isLargeDesktop ? 90 : 80,
    };
  }, [isMobile, screenSize]);

  const trainingAreaBounds = useMemo<TrainingAreaBounds>(() => {
    const areaY = layoutConstants.headerHeight + layoutConstants.padding;

    const worldDimensions = calculateArenaWorldDimensions(width);

    if (isMobile) {
      const isExtraSmall = width < 380;
      const topClearance = isExtraSmall ? 75 : 80;
      const bottomClearance = mobileControlsBottomClearance(
        layoutConstants.controlsHeight,
        layoutConstants.footerHeight,
        isExtraSmall,
        isPortrait,
        "training",
      );

      return calculateMobileAreaBounds(
        width,
        height,
        topClearance,
        bottomClearance,
        areaY,
        isPortrait ? "portrait" : "landscape",
      );
    }

    const totalReservedHeight =
      layoutConstants.headerHeight +
      layoutConstants.controlsHeight +
      layoutConstants.footerHeight;
    const totalPadding = layoutConstants.padding * 3;
    const availableHeight = height - totalReservedHeight - totalPadding;
    const availableWidth = getDesktopArenaWidthBudget(width);

    let arenaWidth = availableWidth;
    let arenaHeight = arenaWidth * (3 / 4); // 4:3 aspect ratio

    if (arenaHeight > availableHeight) {
      arenaHeight = availableHeight;
      arenaWidth = arenaHeight * (4 / 3);
    }

    const pixelsPerMeter = arenaWidth / worldDimensions.widthMeters;
    const referencePixelsPerMeter = 100;
    const scale = pixelsPerMeter / referencePixelsPerMeter;

    return {
      x: (width - arenaWidth) / 2, // Center horizontally
      y: areaY,
      width: arenaWidth,
      height: arenaHeight, // 4:3 aspect ratio
      scale,
      worldWidthMeters: worldDimensions.widthMeters,
      worldDepthMeters: worldDimensions.depthMeters,
    };
  }, [width, height, layoutConstants, isMobile, isPortrait]);

  return {
    layoutConstants,
    trainingAreaBounds,
    isMobile,
    isPortrait,
    screenSize,
  };
}
