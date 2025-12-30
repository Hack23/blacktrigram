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
  readonly scale: number; // 3D scale factor for arena (1.0 = desktop, <1.0 = mobile)
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
  // Updated mobile controls height for new sizing: D-Pad (140px), buttons (80px+70px)
  // Optimized: Depends on breakpoint booleans, not exact width
  const layoutConstants = useMemo<LayoutConstants>(
    () => ({
      padding: 10,
      hudHeight: isMobile ? 95 : isLargeDesktop ? 90 : 120,
      controlsHeight: isMobile ? 160 : isLargeDesktop ? 120 : 160, // Increased from 130 to 160 for larger mobile controls
      footerHeight: isMobile ? 34 : isLargeDesktop ? 20 : 28, // Changed from 22 to 34 for safe area
      healthBarHeight: isMobile ? 48 : isLargeDesktop ? 45 : 55,
    }),
    [isMobile, isLargeDesktop]
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
      // Reserve space for HUD (80px min) and controls (120px min)
      const minTopClearance = 80;
      const minBottomClearance = 120;
      const availableHeight = height - minTopClearance - minBottomClearance;
      const availableWidth = width - 40; // 20px margins on each side

      // Calculate optimal arena size maintaining 4:3 aspect ratio (width:height)
      // Target sizing based on device resolution:
      // - Standard mobile (375-430px): 350x262px to 400x300px
      // - High-res mobile (1200px+): Up to 600x450px (2K Android)
      // - Ultra high-res (1440px+): Up to 800x600px (4K Android)
      
      // Determine max width based on screen width for high-end devices
      let maxMobileWidth: number;
      if (width >= 1440) {
        // 4K/QHD+ Android devices (e.g., Galaxy S23 Ultra, Pixel 9 Pro)
        maxMobileWidth = Math.min(availableWidth, 800);
      } else if (width >= 1200) {
        // 2K Android devices
        maxMobileWidth = Math.min(availableWidth, 600);
      } else if (width >= 768) {
        // Large phones (e.g., iPhone 14 Pro Max)
        maxMobileWidth = Math.min(availableWidth, 500);
      } else {
        // Standard phones (e.g., iPhone SE, standard Android)
        maxMobileWidth = Math.min(availableWidth, 400);
      }
      
      const maxMobileHeight = Math.min(availableHeight, 800);

      // Maintain 4:3 aspect ratio (width:height = 4:3)
      const aspectRatio = 4 / 3;
      let arenaWidth = maxMobileWidth;
      let arenaHeight = arenaWidth / aspectRatio; // height = width / (4/3) = width * (3/4)

      // If height exceeds available, recalculate based on height constraint
      if (arenaHeight > maxMobileHeight) {
        arenaHeight = maxMobileHeight;
        arenaWidth = arenaHeight * aspectRatio; // width = height * (4/3)
      }

      // Ensure minimum size for playability without exceeding available space
      arenaWidth = Math.min(Math.max(arenaWidth, 300), availableWidth);
      arenaHeight = Math.min(Math.max(arenaHeight, 225), maxMobileHeight); // 300 * 3/4 = 225

      // Calculate 3D scale factor (mobile arena is smaller than desktop)
      const desktopWidth = 960; // 80% of 1200px
      const scale = arenaWidth / desktopWidth;

      return {
        x: (width - arenaWidth) / 2, // Centered horizontally
        y: arenaY,
        width: arenaWidth,
        height: arenaHeight,
        scale,
      };
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
  };
}
