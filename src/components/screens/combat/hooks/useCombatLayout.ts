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
import { getCombatLayoutConstants } from "../../../../utils/responsiveLayoutHelpers";

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
  readonly screenSize: ScreenSize;
}

/**
 * Custom hook for combat screen layout calculations
 * Enhanced with centralized responsive scaling system
 * Optimized to reduce recalculations and improve 60fps performance
 */
export function useCombatLayout(width: number, height: number): CombatLayout {
  // Determine screen size category using centralized scaling system
  const screenSize = useMemo(() => getScreenSize(width), [width]);

  // Device detection has its own internal caching based on screen dimensions
  // No need for additional React memoization here
  const isMobile = shouldUseMobileControls();

  // Centralized layout constants for easier tweaking
  // Enhanced with tablet-specific values for better responsive support
  // Updated mobile controls height for new sizing: D-Pad (140px), buttons (80px+70px)
  // Uses centralized responsive helper for consistent scaling
  // Now passes isMobile flag to ensure high-res mobile devices get mobile layouts
  const layoutConstants = useMemo<LayoutConstants>(
    () => getCombatLayoutConstants(width, isMobile),
    [width, isMobile],
  );

  // Arena bounds calculation using physics-first 4:3 aspect ratio sizing
  // Arena size is based on resolution (6×4.5, 8×6, 10×7.5, 12×9, 14×10.5 meters)
  // Mobile controls are determined separately by device detection
  const arenaBounds = useMemo<ArenaBounds>(() => {
    const arenaY = layoutConstants.hudHeight + layoutConstants.padding;

    // Calculate world dimensions based on screen resolution (not device type)
    // All arenas are SQUARE for consistent combat mechanics
    const worldDimensions = calculateArenaWorldDimensions(width);

    // Mobile-specific arena sizing for better screen fit
    if (isMobile) {
      // Extra-small device detection for optimized clearances
      const isExtraSmall = width < 380;
      const minTopClearance = isExtraSmall ? 75 : 80;
      const minBottomClearance = isExtraSmall ? 110 : 120;

      // Use shared mobile area calculation for consistency with training screen
      const mobileBounds = calculateMobileAreaBounds(
        width,
        height,
        minTopClearance,
        minBottomClearance,
        arenaY,
      );

      // Mobile bounds already include world dimensions from resolution
      return mobileBounds;
    }

    // Desktop arena sizing - create 4:3 aspect ratio arena
    const totalReservedHeight =
      layoutConstants.hudHeight +
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
      y: arenaY,
      width: arenaWidth,
      height: arenaHeight, // 4:3 aspect ratio
      scale,
      worldWidthMeters: worldDimensions.widthMeters,
      worldDepthMeters: worldDimensions.depthMeters,
    };
  }, [width, height, layoutConstants, isMobile]);

  return {
    layoutConstants,
    arenaBounds,
    isMobile,
    screenSize,
  };
}
