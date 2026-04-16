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
  PORTRAIT_FORCE_MAX_WIDTH_PX,
  PORTRAIT_HYSTERESIS_FACTOR,
  portraitMobileControlsBottomBand,
} from "../../../../utils/responsiveOrientationConstants";

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
  // Determine screen size category using centralized scaling system
  const screenSize = useMemo(() => getScreenSize(width), [width]);

  // Portrait orientation with hysteresis (see responsiveOrientationConstants)
  // 세로 모드 감지 (히스테리시스 적용)
  const isPortrait = height > width * PORTRAIT_HYSTERESIS_FACTOR;

  // Force mobile branch on narrow portrait viewports even if the user-agent
  // says we're on desktop (devtools emulation + real rotated phones).
  // 좁은 세로 화면에서는 모바일 레이아웃 강제
  const isMobile =
    shouldUseMobileControls() ||
    (isPortrait && width < PORTRAIT_FORCE_MAX_WIDTH_PX);

  // Centralized layout constants for easier tweaking
  // Enhanced with tablet-specific values for better responsive support
  const layoutConstants = useMemo<TrainingLayoutConstants>(() => {
    // Determine if large desktop
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

  // Training area bounds using orientation-aware aspect-ratio sizing
  // Landscape mobile: 4:3 — horizontal dummy + analysis overlay
  // Portrait mobile : 3:4 — vertical dummy + bottom training controls fit
  const trainingAreaBounds = useMemo<TrainingAreaBounds>(() => {
    const areaY = layoutConstants.headerHeight + layoutConstants.padding;

    // Calculate world dimensions based on screen resolution (not device type)
    const worldDimensions = calculateArenaWorldDimensions(width);

    // Mobile-specific training area sizing for better screen fit
    if (isMobile) {
      const isExtraSmall = width < 380;
      const topClearance = isExtraSmall ? 75 : 80;
      // Portrait needs the full bottom band reserved (training controls +
      // footer + virtual controls) so the arena doesn't end up behind them.
      // Training's virtual-controls band is lighter than Combat's, so the
      // shared helper picks the "training" variant.
      const bottomClearance = isPortrait
        ? portraitMobileControlsBottomBand(
            layoutConstants.controlsHeight,
            layoutConstants.footerHeight,
            isExtraSmall,
            "training",
          )
        : 120;

      return calculateMobileAreaBounds(
        width,
        height,
        topClearance,
        bottomClearance,
        areaY,
        isPortrait ? "portrait" : "landscape",
      );
    }

    // Desktop training area sizing - create 4:3 aspect ratio arena
    const totalReservedHeight =
      layoutConstants.headerHeight +
      layoutConstants.controlsHeight +
      layoutConstants.footerHeight;
    const totalPadding = layoutConstants.padding * 3;
    const availableHeight = height - totalReservedHeight - totalPadding;
    const availableWidth = width * 0.8;

    // Calculate arena dimensions with 4:3 aspect ratio (width > height)
    // Start with available width, constrain by height if needed
    let arenaWidth = availableWidth;
    let arenaHeight = arenaWidth * (3 / 4); // 4:3 aspect ratio

    // If height is constrained, recalculate from height
    if (arenaHeight > availableHeight) {
      arenaHeight = availableHeight;
      arenaWidth = arenaHeight * (4 / 3);
    }

    // Calculate pixels-per-meter and scale
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
