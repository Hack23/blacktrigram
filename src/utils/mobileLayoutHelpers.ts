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

import { calculateArenaWorldDimensions } from "./arenaWorldDimensions";

/**
 * Mobile area bounds with world dimensions.
 *
 * @public
 */
export interface MobileAreaBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  readonly worldWidthMeters: number;
  readonly worldDepthMeters: number;
}

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
 * @returns Mobile area bounds with position, dimensions, scale, and world dimensions
 *
 * @example
 * ```typescript
 * const bounds = calculateMobileAreaBounds(375, 667, 80, 120, 100);
 * // Returns: { x: ~37, y: 100, width: 300, height: 225, scale: 0.3125, worldWidthMeters: 6, worldDepthMeters: 6 }
 *
 * const boundsSmall = calculateMobileAreaBounds(320, 568, 75, 110, 90);
 * // Returns: { x: ~25, y: 90, width: 270, height: 202, scale: 0.28125, worldWidthMeters: 6, worldDepthMeters: 6 }
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
  yOffset: number,
): MobileAreaBounds {
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

  // Calculate world dimensions based on screen resolution (not device type)
  // All arenas are SQUARE for consistent combat mechanics
  const worldDimensions = calculateArenaWorldDimensions(width);

  // For square arenas, use same dimension for width and height
  // Determine max square size that fits in available space
  const maxSquareSize = Math.min(maxMobileWidth, maxMobileHeight);
  const areaSize = Math.max(maxSquareSize, 280); // Minimum 280px for usability

  // Calculate 3D scale factor based on reference arena
  // Reference: 10m arena at 1000px = 100 px/m
  const pixelsPerMeter = areaSize / worldDimensions.sizeMeters;
  const referencePixelsPerMeter = 100;
  const scale = pixelsPerMeter / referencePixelsPerMeter;

  return {
    x: (width - areaSize) / 2, // Centered horizontally
    y: yOffset,
    width: areaSize,
    height: areaSize, // Square arena
    scale,
    worldWidthMeters: worldDimensions.widthMeters,
    worldDepthMeters: worldDimensions.depthMeters,
  };
}
