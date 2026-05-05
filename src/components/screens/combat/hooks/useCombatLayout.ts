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
  landscapeMobileControlsBottomClearance,
  PORTRAIT_FORCE_MAX_WIDTH_PX,
  PORTRAIT_HYSTERESIS_FACTOR,
  portraitMobileControlsBottomBand,
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
  // Determine screen size category using centralized scaling system
  const screenSize = useMemo(() => getScreenSize(width), [width]);

  // Portrait orientation detection. The hysteresis factor provides stability
  // so viewports near 1:1 don't flap on every resize event.
  // 세로 모드 감지
  const isPortrait = height > width * PORTRAIT_HYSTERESIS_FACTOR;

  // Device detection has its own internal caching based on screen dimensions.
  // In addition to its user-agent result we force the mobile branch for any
  // narrow portrait viewport so that devtools emulation and real rotated
  // phones both render the mobile-optimized layout.
  // 모바일 레이아웃 강제: 세로 + 좁은 화면
  const isMobile =
    shouldUseMobileControls() ||
    (isPortrait && width < PORTRAIT_FORCE_MAX_WIDTH_PX);

  // Centralized layout constants for easier tweaking
  // Enhanced with tablet-specific values for better responsive support
  // Updated mobile controls height for new sizing: D-Pad (140px), buttons (80px+70px)
  // Uses centralized responsive helper for consistent scaling
  // Now passes isMobile flag to ensure high-res mobile devices get mobile layouts
  const layoutConstants = useMemo<LayoutConstants>(
    () => getCombatLayoutConstants(width, isMobile),
    [width, isMobile],
  );

  // Arena bounds calculation using physics-first aspect-ratio sizing
  // Landscape mobile: 4:3 (width > height)
  // Portrait mobile:  3:4 (height > width) — fits both fighters vertically
  //                    without being occluded by bottom HUD + D-Pad
  const arenaBounds = useMemo<ArenaBounds>(() => {
    // In portrait mobile we render a compact two-player status strip
    // directly below the top HUD to replace the collapsed side HUDs.
    // Reserve its height here so the arena is pushed below it instead of
    // being drawn underneath. Use a tighter strip on extra-small phones
    // (< 380 px wide) to preserve the playable arena area.
    const isExtraSmallWidth = width < 380;
    const portraitStatusStripHeight =
      isMobile && isPortrait
        ? Math.max(isExtraSmallWidth ? 28 : 36, Math.round(height * 0.055))
        : 0;

    const arenaY =
      layoutConstants.hudHeight +
      portraitStatusStripHeight +
      layoutConstants.padding;

    // Calculate world dimensions based on screen resolution (not device type)
    // All arenas are SQUARE for consistent combat mechanics
    const worldDimensions = calculateArenaWorldDimensions(width);

    // Mobile-specific arena sizing for better screen fit
    if (isMobile) {
      const isExtraSmall = isExtraSmallWidth;
      const minTopClearance =
        (isExtraSmall ? 75 : 80) + portraitStatusStripHeight;

      // In portrait we must reserve space for the whole bottom band
      // (technique bar + mobile controls + footer) or the arena ends up
      // behind the D-Pad. See responsiveOrientationConstants.ts for the
      // derivation of the mobile-controls reservation.
      const minBottomClearance = isPortrait
        ? portraitMobileControlsBottomBand(
            layoutConstants.controlsHeight,
            layoutConstants.footerHeight,
            isExtraSmall,
            "combat",
          )
        : landscapeMobileControlsBottomClearance(isExtraSmall, "combat");

      const mobileBounds = calculateMobileAreaBounds(
        width,
        height,
        minTopClearance,
        minBottomClearance,
        arenaY,
        isPortrait ? "portrait" : "landscape",
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
    const availableWidth = getDesktopArenaWidthBudget(width);

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
  }, [width, height, layoutConstants, isMobile, isPortrait]);

  return {
    layoutConstants,
    arenaBounds,
    isMobile,
    isPortrait,
    screenSize,
  };
}
