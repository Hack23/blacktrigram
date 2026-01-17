/**
 * Layout positioning constants for combat and training screens
 * Centralized to prevent magic numbers and ensure consistency
 * 
 * @category UI Constants
 * @korean 레이아웃위치상수
 */

/**
 * Bottom positioning for UI elements (in pixels)
 * Values designed to prevent overlap:
 * - Mobile controls at 200px provide space for TechniqueBar
 * - TechniqueBar at 200px (mobile) / 220px (desktop)
 * - Back button at 80px (mobile) / 100px (desktop) below TechniqueBar
 */
export const LAYOUT_BOTTOM_POSITIONS = {
  /** Mobile controls (VirtualDPad, ActionButtons) */
  MOBILE_CONTROLS: 200,
  
  /** TechniqueBar container */
  TECHNIQUE_BAR: {
    MOBILE: 200,
    DESKTOP: 220,
  },
  
  /** Back to Menu button */
  BACK_BUTTON: {
    MOBILE: 80,
    DESKTOP: 100,
  },
  
  /** TechniqueBar container height (for overlap calculations) */
  TECHNIQUE_BAR_HEIGHT: 180,
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
 * Helper function to get back button bottom position
 * NOTE: positionScale NOT applied to prevent layout bugs on 4K displays
 * 
 * @param isMobile - Whether device is mobile (<768px)
 * @returns Bottom position in pixels
 */
export function getBackButtonBottom(isMobile: boolean): number {
  return isMobile
    ? LAYOUT_BOTTOM_POSITIONS.BACK_BUTTON.MOBILE
    : LAYOUT_BOTTOM_POSITIONS.BACK_BUTTON.DESKTOP;
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
 * Type for layout position values
 */
export type LayoutBottomPosition = number;
