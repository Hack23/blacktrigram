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
 * Get mobile controls bottom position (always 200px)
 * 
 * @returns Bottom position in pixels
 */
export function getMobileControlsBottom(): number {
  return LAYOUT_BOTTOM_POSITIONS.MOBILE_CONTROLS;
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
