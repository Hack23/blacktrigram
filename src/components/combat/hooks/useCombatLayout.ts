/**
 * useCombatLayout Hook - Optimized Layout Calculations
 *
 * Custom hook for managing responsive combat screen layout calculations.
 * Optimizes layout recalculations by minimizing dependencies and memoizing
 * complex calculations.
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
 * const { layoutConstants, arenaBounds, isMobile } = useCombatLayout(1200, 800);
 * ```
 */

import { useMemo } from "react";
import { shouldUseMobileControls } from "../../../utils/deviceDetection";

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
}

export interface CombatLayout {
  readonly layoutConstants: LayoutConstants;
  readonly arenaBounds: ArenaBounds;
  readonly isMobile: boolean;
}

/**
 * Custom hook for combat screen layout calculations
 * Optimized to reduce recalculations and improve 60fps performance
 */
export function useCombatLayout(width: number, height: number): CombatLayout {
  // Device detection has its own internal caching based on screen dimensions
  // No need for additional React memoization here
  const isMobile = shouldUseMobileControls();
  const isLargeDesktop = useMemo(() => width >= 1920, [width]); // 4K/2K displays

  // Centralized layout constants for easier tweaking
  // Optimized: Depends on breakpoint booleans, not exact width
  const layoutConstants = useMemo<LayoutConstants>(
    () => ({
      padding: 10,
      hudHeight: isMobile ? 95 : isLargeDesktop ? 90 : 120,
      controlsHeight: isMobile ? 130 : isLargeDesktop ? 120 : 160,
      footerHeight: isMobile ? 22 : isLargeDesktop ? 20 : 28,
      healthBarHeight: isMobile ? 48 : isLargeDesktop ? 45 : 55,
    }),
    [isMobile, isLargeDesktop]
  );

  // Fixed player positions for 2-player combat with proper bounds
  // Arena bounds should account for HUD at top and controls at bottom
  // Optimized: Separate calculation dependencies to reduce recalculation frequency
  const arenaBounds = useMemo<ArenaBounds>(() => {
    const arenaY = layoutConstants.hudHeight + layoutConstants.padding;

    // Break down complex calculation for clarity and maintainability
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
    };
  }, [width, height, layoutConstants]);

  return {
    layoutConstants,
    arenaBounds,
    isMobile,
  };
}
