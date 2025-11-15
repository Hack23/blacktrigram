/**
 * useCombatLayout Hook - Optimized Layout Calculations
 * 
 * Custom hook for managing responsive combat screen layout calculations.
 * Optimizes layout recalculations by minimizing dependencies and memoizing
 * complex calculations.
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
  // Performance: Only recalculate when crossing mobile breakpoint (768px)
  // This prevents recalculation on every pixel change during resize
  const isMobile = useMemo(() => width < 768, [width < 768]);

  // Centralized layout constants for easier tweaking
  // Optimized: Only depends on isMobile boolean, not exact width
  const layoutConstants = useMemo<LayoutConstants>(() => ({
    padding: 10,
    hudHeight: isMobile ? 100 : 140,
    controlsHeight: isMobile ? 140 : 180,
    footerHeight: isMobile ? 25 : 30,
    healthBarHeight: isMobile ? 50 : 60,
  }), [isMobile]);

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
