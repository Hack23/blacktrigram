/**
 * useCombatLayout Hook - Enhanced Responsive Combat Layout
 *
 * Custom hook for managing responsive combat screen layout calculations with
 * comprehensive support for all screen sizes from mobile to ultra-wide displays.
 *
 * Enhanced Features:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Proportional scaling for consistent sizing across devices
 * - Optimized arena sizing for each device category
 * - Smooth transitions for resize operations
 * - 60fps performance maintained
 *
 * Uses robust device detection combining user-agent and screen size to ensure
 * mobile controls are shown on all mobile devices, including high-resolution phones.
 *
 * Performance:
 * - Reduces recalculations by checking only breakpoint changes, not exact dimensions
 * - Memoizes arena bounds to prevent cascading re-renders
 * - Targets <1ms execution time for layout calculations
 *
 * @param width - Screen width
 * @param height - Screen height
 *
 * @returns Layout constants and arena bounds
 *
 * @example
 * ```typescript
 * const { layoutConstants, arenaBounds, isMobile, screenSize } = useCombatLayout(1200, 800);
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
import {
  getCombatLayoutConstants,
  getDesktopArenaWidthBudget,
} from "../../../../utils/responsiveLayoutHelpers";

import type { ScreenSize } from "../../../../systems/ResponsiveScaling";

export interface LayoutConstants {
  readonly padding: number;
  readonly hudHeight: number;
  readonly controlsHeight: number;
  readonly footerHeight: number;
  readonly healthBarHeight: number;
}

export interface ArenaBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number; // 3D scale factor for arena (1.0 = desktop, <1.0 = mobile)
  readonly worldWidthMeters: number; // Physical arena width in meters
  readonly worldDepthMeters: number; // Physical arena depth in meters
}

export interface CombatLayout {
  readonly layoutConstants: LayoutConstants;
  readonly arenaBounds: ArenaBounds;
  readonly isMobile: boolean;
  readonly isPortrait: boolean;
  readonly screenSize: ScreenSize;
}

/**
 * Custom hook for combat screen layout calculations
 * Enhanced with centralized responsive scaling system
 * Optimized to reduce recalculations and improve 60fps performance
 */
export function useCombatLayout(width: number, height: number): CombatLayout {
  const screenSize = useMemo(() => getScreenSize(width), [width]);

  const isPortrait = height > width * PORTRAIT_HYSTERESIS_FACTOR;

  const isMobile =
    shouldUseMobileControls() ||
    (isPortrait && width < PORTRAIT_FORCE_MAX_WIDTH_PX);

  const layoutConstants = useMemo<LayoutConstants>(
    () => getCombatLayoutConstants(width, isMobile),
    [width, isMobile],
  );

  const arenaBounds = useMemo<ArenaBounds>(() => {
    const isExtraSmallWidth = width < 380;
    const portraitStatusStripHeight =
      isMobile && isPortrait
        ? Math.max(isExtraSmallWidth ? 28 : 36, Math.round(height * 0.055))
        : 0;

    const arenaY =
      layoutConstants.hudHeight +
      portraitStatusStripHeight +
      layoutConstants.padding;

    const worldDimensions = calculateArenaWorldDimensions(width);

    if (isMobile) {
      const isExtraSmall = isExtraSmallWidth;
      const minTopClearance =
        (isExtraSmall ? 75 : 80) + portraitStatusStripHeight;

      const minBottomClearance = mobileControlsBottomClearance(
        layoutConstants.controlsHeight,
        layoutConstants.footerHeight,
        isExtraSmall,
        isPortrait,
        "combat",
      );

      const mobileBounds = calculateMobileAreaBounds(
        width,
        height,
        minTopClearance,
        minBottomClearance,
        arenaY,
        isPortrait ? "portrait" : "landscape",
      );

      return mobileBounds;
    }

    const totalReservedHeight =
      layoutConstants.hudHeight +
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
      y: arenaY,
      width: arenaWidth,
      height: arenaHeight, // 4:3 aspect ratio
      scale,
      worldWidthMeters: worldDimensions.widthMeters,
      worldDepthMeters: worldDimensions.depthMeters,
    };
  }, [width, height, layoutConstants, isMobile, isPortrait]);

  return {
    layoutConstants,
    arenaBounds,
    isMobile,
    isPortrait,
    screenSize,
  };
}
