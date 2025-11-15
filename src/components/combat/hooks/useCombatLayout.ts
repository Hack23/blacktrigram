import { useMemo } from "react";

/**
 * Layout constants for combat screen
 */
export interface CombatLayoutConstants {
  readonly padding: number;
  readonly hudHeight: number;
  readonly controlsHeight: number;
  readonly footerHeight: number;
  readonly healthBarHeight: number;
}

/**
 * Arena bounds for player movement and positioning
 */
export interface ArenaBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Custom hook for managing responsive combat layout calculations
 * Optimizes layout recalculations by memoizing based on screen size breakpoints
 * 
 * @param width - Screen width
 * @param height - Screen height
 * @returns Layout constants and arena bounds
 */
export function useCombatLayout(width: number, height: number) {
  // Optimize by checking breakpoint - only changes when crossing 768px threshold
  const isMobile = width < 768;

  // Centralized layout constants with optimized dependencies
  // Only recalculates when crossing mobile breakpoint
  const layoutConstants = useMemo<CombatLayoutConstants>(
    () => ({
      padding: 10,
      hudHeight: isMobile ? 100 : 140,
      controlsHeight: isMobile ? 140 : 180,
      footerHeight: isMobile ? 25 : 30,
      healthBarHeight: isMobile ? 50 : 60,
    }),
    [isMobile]
  );

  // Calculate arena bounds with optimized dependencies
  // Ensures minimum height of 300px to prevent rendering issues
  const arenaBounds = useMemo<ArenaBounds>(() => {
    const arenaY = layoutConstants.hudHeight + layoutConstants.padding;

    // Break down complex calculation for clarity and performance
    const totalReservedHeight =
      layoutConstants.hudHeight +
      layoutConstants.controlsHeight +
      layoutConstants.footerHeight;
    const totalPadding = layoutConstants.padding * 3;
    const calculatedHeight = height - totalReservedHeight - totalPadding;
    
    // Ensure minimum arena height to prevent rendering issues on small screens
    const arenaHeight = Math.max(300, calculatedHeight);

    return {
      x: width * 0.1,
      y: arenaY,
      width: width * 0.8,
      height: arenaHeight,
    };
  }, [width, height, layoutConstants]);

  return {
    isMobile,
    layoutConstants,
    arenaBounds,
  };
}
