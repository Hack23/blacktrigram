/**
 * Mobile Layout Helpers
 * 
 * Shared utilities for calculating mobile area bounds with consistent aspect ratios
 * and device-specific sizing. Used by both combat and training layout hooks.
 * 
 * @module utils/mobileLayoutHelpers
 * @category Layout
 * @korean 모바일레이아웃도우미
 */

/**
 * Calculate mobile area bounds with 4:3 aspect ratio
 * 
 * Implements consistent mobile area sizing logic shared between combat and training screens.
 * Adapts to different device resolutions while maintaining a 4:3 aspect ratio.
 * Enhanced with extra-small device support (<380px) for low-end mobile devices.
 * 
 * @param width - Screen width in pixels
 * @param height - Screen height in pixels
 * @param topClearance - Minimum space to reserve at top (for HUD/header)
 * @param bottomClearance - Minimum space to reserve at bottom (for controls)
 * @param yOffset - Y position offset (typically header height + padding)
 * @returns Mobile area bounds with position, dimensions, and scale factor
 * 
 * @example
 * ```typescript
 * const bounds = calculateMobileAreaBounds(375, 667, 80, 120, 100);
 * // Returns: { x: ~37, y: 100, width: 300, height: 225, scale: 0.3125 }
 * 
 * const boundsSmall = calculateMobileAreaBounds(320, 568, 75, 110, 90);
 * // Returns: { x: ~25, y: 90, width: 270, height: 202, scale: 0.28125 }
 * ```
 * 
 * @public
 * @korean 모바일영역경계계산
 */
export function calculateMobileAreaBounds(
  width: number,
  height: number,
  topClearance: number,
  bottomClearance: number,
  yOffset: number
): {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
} {
  // Calculate available space for the area
  // Extra-small devices (<380px) use tighter margins for more screen real estate
  const horizontalMargin = width < 380 ? 30 : 40; // 15px vs 20px per side
  const availableHeight = height - topClearance - bottomClearance;
  const availableWidth = width - horizontalMargin;

  // Determine max width based on device resolution
  // Device-specific sizing with extra-small support:
  // - 4K/QHD+ (≥1440px): up to 800px
  // - 2K (1200-1439px): up to 600px
  // - Large phones (768-1199px): up to 500px
  // - Standard phones (380-767px): up to 400px
  // - Extra-small phones (<380px): up to 320px
  let maxMobileWidth: number;
  if (width >= 1440) {
    maxMobileWidth = Math.min(availableWidth, 800);
  } else if (width >= 1200) {
    maxMobileWidth = Math.min(availableWidth, 600);
  } else if (width >= 768) {
    maxMobileWidth = Math.min(availableWidth, 500);
  } else if (width >= 380) {
    maxMobileWidth = Math.min(availableWidth, 400);
  } else {
    // Extra-small devices (iPhone SE, old Android, budget phones)
    maxMobileWidth = Math.min(availableWidth, 320);
  }
  
  // Extra-small devices also get reduced max height for better fit
  const maxMobileHeight = Math.min(availableHeight, width < 380 ? 240 : 800);

  // Maintain 4:3 aspect ratio (width:height = 4:3)
  const aspectRatio = 4 / 3;
  let areaWidth = maxMobileWidth;
  let areaHeight = areaWidth / aspectRatio;

  // If height exceeds available, recalculate based on height constraint
  if (areaHeight > maxMobileHeight) {
    areaHeight = maxMobileHeight;
    areaWidth = areaHeight * aspectRatio;
  }

  // Ensure minimum size for usability
  areaWidth = Math.min(Math.max(areaWidth, 300), availableWidth);
  areaHeight = Math.min(Math.max(areaHeight, 225), maxMobileHeight);

  // Calculate 3D scale factor (mobile area is smaller than desktop reference)
  const desktopWidth = 960; // 80% of 1200px reference
  const scale = areaWidth / desktopWidth;

  return {
    x: (width - areaWidth) / 2, // Centered horizontally
    y: yOffset,
    width: areaWidth,
    height: areaHeight,
    scale,
  };
}
