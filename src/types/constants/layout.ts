/**
 * Layout positioning constants for combat and training screens
 * Centralized to prevent magic numbers and ensure consistency
 * 
 * @category UI Constants
 * @korean 레이아웃위치상수
 */

/**
 * Bottom positioning for UI elements (in pixels)
 * Values designed to prevent overlap and prioritize gameplay visibility:
 * - Mobile controls at 200px for ergonomic touch access
 * - TechniqueBar lowered to 20px (mobile) / 30px (desktop) to minimize arena obstruction
 * - Back button moved to top-right corner (off-center) for accessibility
 * 
 * PRIORITY: Combat arena visibility > TechniqueBar > Mobile controls > Back button
 */
export const LAYOUT_BOTTOM_POSITIONS = {
  /** Mobile controls (VirtualDPad, ActionButtons) - must stay at 200px for accessibility */
  MOBILE_CONTROLS: 200,
  
  /** TechniqueBar container - lowered to bottom to prioritize arena visibility */
  TECHNIQUE_BAR: {
    MOBILE: 20,   // Near bottom of screen to minimize arena obstruction
    DESKTOP: 30,  // Slightly higher on desktop for better visibility
  },
  
  /** TechniqueBar container height (for overlap calculations) */
  TECHNIQUE_BAR_HEIGHT: 180,
} as const;

/**
 * Mobile touch controls placement ratios:
 * - 24% on short landscape viewports, clamped to 96–120 px, keeps controls
 *   below the arena center while preserving thumb reach.
 * - 17% on tall portrait viewports, clamped to 128–200 px, lowers controls
 *   toward the nav/home area without colliding with the bottom HUD or browser
 *   safe area.
 */
export const MOBILE_CONTROLS_PLACEMENT = {
  SHORT_VIEWPORT_RATIO: 0.24,
  TALL_VIEWPORT_RATIO: 0.17,
  SHORT_MIN: 96,
  SHORT_MAX: 120,
  TALL_MIN: 128,
  TALL_MAX: LAYOUT_BOTTOM_POSITIONS.MOBILE_CONTROLS,
} as const;

/**
 * Shared horizontal reservations for HUD side controls.
 *
 * These values keep centered technique cards readable while preserving space
 * for absolutely positioned controls such as the compact volume control and
 * mobile archetype selector.
 */
export const HUD_SIDE_CONTROL_RESERVES = {
  /** Compact volume control width (162px) plus interaction margin. */
  VOLUME_CONTROL: 180,

  /** Mobile archetype selector reserve in the training bottom HUD. */
  ARCHETYPE_SELECTOR: 180,

  /** Embedded mobile technique bar side reserve for compact controls. */
  TECHNIQUE_BAR_MOBILE: 96,

  /** Embedded desktop technique bar side reserve for side HUD controls. */
  TECHNIQUE_BAR_DESKTOP: 190,
} as const;

/**
 * Minimum visual scale before technique cards become unreadable.
 *
 * The 70% threshold preserves readable Korean/English labels and keyboard
 * hints on compact HUDs. Below this value, embedded bars switch to horizontal
 * scrolling instead of shrinking so touch targets and text remain usable.
 *
 * Used by TechniqueBar when calculating whether embedded cards should scale
 * down or remain full size with horizontal scroll.
 */
export const TECHNIQUE_BAR_MIN_READABLE_SCALE = 0.7;

/**
 * Training top HUD height ratio.
 *
 * Must match the training context top offset used by useHUDLayout so the
 * top HUD and side HUDs align without overlap across responsive breakpoints.
 */
export const TRAINING_TOP_HUD_HEIGHT_PERCENT = 0.06;

/**
 * Top positioning for UI elements (in pixels)
 * Used for elements positioned from the top of the screen
 */
export const LAYOUT_TOP_POSITIONS = {
  /** Back to Menu button positioned at top-right */
  BACK_BUTTON: {
    MOBILE: 10,    // 10px from top on mobile
    DESKTOP: 20,   // 20px from top on desktop
  },
  
  /** Safe area offset for notched devices */
  SAFE_AREA_TOP: 44, // iPhone notch height
} as const;

/**
 * Helper function to get technique bar bottom position
 * NOTE: positionScale NOT applied to prevent layout bugs on 4K displays
 * 
 * @param isMobile - Whether device is mobile (<768px)
 * @returns Bottom position in pixels
 */
export function getTechniqueBarBottom(isMobile: boolean): number {
  return isMobile 
    ? LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.MOBILE
    : LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.DESKTOP;
}

/**
 * Get mobile controls bottom position.
 *
 * Returns a viewport-responsive band for comfortable D-Pad / ActionButton
 * reach without pushing controls into the arena center. Tall phones use a
 * lower 17% band, large displays cap at 200 px, and short landscape phones
 * use a tighter 96–120 px band.
 *
 * @param viewportHeight - Optional current viewport height in pixels.
 *                         When omitted or &gt;= 500, returns the default 200 px.
 * @returns Bottom position in pixels
 */
export function getMobileControlsBottom(viewportHeight?: number): number {
  if (typeof viewportHeight !== "number" || Number.isNaN(viewportHeight)) {
    return LAYOUT_BOTTOM_POSITIONS.MOBILE_CONTROLS;
  }

  if (viewportHeight < 500) {
    return Math.round(
      Math.max(
        MOBILE_CONTROLS_PLACEMENT.SHORT_MIN,
        Math.min(
          MOBILE_CONTROLS_PLACEMENT.SHORT_MAX,
          viewportHeight * MOBILE_CONTROLS_PLACEMENT.SHORT_VIEWPORT_RATIO,
        ),
      ),
    );
  }

  return Math.round(
    Math.max(
      MOBILE_CONTROLS_PLACEMENT.TALL_MIN,
      Math.min(
        MOBILE_CONTROLS_PLACEMENT.TALL_MAX,
        viewportHeight * MOBILE_CONTROLS_PLACEMENT.TALL_VIEWPORT_RATIO,
      ),
    ),
  );
}

/**
 * Get back button top position for top-right corner placement
 * Includes safe area offset for notched devices
 * 
 * @param isMobile - Whether device is mobile (<768px)
 * @param hasSafeArea - Whether device has notch/safe area (default: false)
 * @returns Top position in pixels
 */
export function getBackButtonTop(isMobile: boolean, hasSafeArea = false): number {
  const baseTop = isMobile 
    ? LAYOUT_TOP_POSITIONS.BACK_BUTTON.MOBILE
    : LAYOUT_TOP_POSITIONS.BACK_BUTTON.DESKTOP;
  
  return hasSafeArea 
    ? baseTop + LAYOUT_TOP_POSITIONS.SAFE_AREA_TOP
    : baseTop;
}

/**
 * Get back button right position for top-right corner placement
 * 
 * @param isMobile - Whether device is mobile (<768px)
 * @returns Right position in pixels
 */
export function getBackButtonRight(isMobile: boolean): number {
  return isMobile ? 10 : 20;
}

/**
 * Type for layout position values
 */
export type LayoutBottomPosition = number;
export type LayoutTopPosition = number;
