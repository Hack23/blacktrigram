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
import { shouldUseMobileControls } from "../../../../utils/deviceDetection";
import { getScreenSize } from "../../../../systems/ResponsiveScaling";
import { getCombatLayoutConstants } from "../../../../utils/responsiveLayoutHelpers";
import { calculateMobileAreaBounds } from "../../../../utils/mobileLayoutHelpers";

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
  const layoutConstants = useMemo<LayoutConstants>(
    () => getCombatLayoutConstants(width),
    [width]
  );

  // Fixed player positions for 2-player combat with proper bounds
  // Arena bounds should account for HUD at top and controls at bottom
  // Mobile arena sizing with 4:3 aspect ratio adapts to device resolution:
  // - Standard phones (< 768px): up to 400px width
  // - Large phones (768-1199px): up to 500px width
  // - 2K devices (1200-1439px): up to 600px width
  // - 4K devices (≥1440px): up to 800px width
  // Optimized: Separate calculation dependencies to reduce recalculation frequency
  const arenaBounds = useMemo<ArenaBounds>(() => {
    const arenaY = layoutConstants.hudHeight + layoutConstants.padding;

    // Mobile-specific arena sizing for better screen fit
    if (isMobile) {
      // Use shared mobile area calculation for consistency with training screen
      return calculateMobileAreaBounds(
        width,
        height,
        80,  // minTopClearance (HUD space)
        120, // minBottomClearance (controls space)
        arenaY
      );
    }

    // Desktop arena sizing - use full available space
    const totalReservedHeight =
      layoutConstants.hudHeight +
      layoutConstants.controlsHeight +
      layoutConstants.footerHeight;
    const totalPadding = layoutConstants.padding * 3;
    const arenaHeight = height - totalReservedHeight - totalPadding;

    return {
      x: width * 0.1,
      y: arenaY,
      width: width * 0.8,
      height: arenaHeight,
      scale: 1.0, // Desktop uses full scale
    };
  }, [width, height, layoutConstants, isMobile]);

  return {
    layoutConstants,
    arenaBounds,
    isMobile,
    screenSize,
  };
}
