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
  // Optimize by checking breakpoint instead of exact width
  const isMobile = useMemo(() => width < 768, [width]);

  // Centralized layout constants with optimized dependencies
  const layoutConstants = useMemo<CombatLayoutConstants>(
    () => ({
      padding: 10,
      hudHeight: isMobile ? 100 : 140,
      controlsHeight: isMobile ? 140 : 180,
      footerHeight: isMobile ? 25 : 30,
      healthBarHeight: isMobile ? 50 : 60,
    }),
    [isMobile] // Only recalculate when crossing mobile breakpoint
  );

  // Calculate arena bounds with optimized dependencies
  const arenaBounds = useMemo<ArenaBounds>(() => {
    const arenaY = layoutConstants.hudHeight + layoutConstants.padding;

    // Break down complex calculation for clarity and performance
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
    isMobile,
    layoutConstants,
    arenaBounds,
  };
}
