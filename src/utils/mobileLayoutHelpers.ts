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
 * Device orientation for mobile area calculation.
 *
 * - `landscape`: width > height, the arena is rendered in 4:3 (wider than tall)
 *   so both fighters remain visible from a side view.
 * - `portrait`: height ≥ width, the arena is rendered in 3:4 (taller than wide)
 *   so both fighters plus the horizontal breathing-room between them fit
 *   inside a narrow viewport without being occluded by the bottom HUD.
 *
 * @public
 */
export type MobileOrientation = "portrait" | "landscape";

/**
 * Calculate mobile area bounds, orientation-aware.
 *
 * Implements consistent mobile area sizing logic shared between combat and training screens.
 * Adapts to different device resolutions while maintaining an orientation-appropriate
 * aspect ratio (4:3 in landscape, 3:4 in portrait).
 *
 * The caller is responsible for passing `bottomClearance` that already includes
 * the bottom HUD (technique bar), the mobile controls (D-Pad / action buttons)
 * and any safe-area insets. This function will never let the arena overflow
 * `height - topClearance - bottomClearance`.
 *
 * @param width - Screen width in pixels
 * @param height - Screen height in pixels
 * @param topClearance - Minimum space to reserve at top (for HUD/header + safe area)
 * @param bottomClearance - Minimum space to reserve at bottom (controls + footer + safe area)
 * @param yOffset - Y position offset (typically header height + padding)
 * @param orientation - `"portrait"` for tall-narrow viewports, otherwise `"landscape"` (default)
 * @returns Mobile area bounds with position, dimensions, scale, and world dimensions
 *
 * @example
 * ```typescript
 * // Landscape phone: 4:3 arena
 * const landscape = calculateMobileAreaBounds(667, 375, 60, 120, 70, "landscape");
 *
 * // Portrait phone: 3:4 arena (taller than wide)
 * const portrait  = calculateMobileAreaBounds(375, 667, 80, 220, 90, "portrait");
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
  orientation: MobileOrientation = "landscape",
): MobileAreaBounds {
  const isPortrait = orientation === "portrait";

  // Calculate available space for the area.
  // Extra-small devices (<380px) use tighter margins for more screen real estate.
  //
  // Height reservation: the arena starts at `yOffset`, so the available
  // vertical space is bounded by `height - yOffset - bottomClearance`.
  // Falling back to `height - topClearance - bottomClearance` when a caller
  // passes `yOffset < topClearance` keeps the legacy behaviour, but we must
  // never let the arena overflow when `yOffset > topClearance` (which is the
  // case for the updated combat/training layout hooks).
  const horizontalMargin = width < 380 ? 30 : 40; // 15px vs 20px per side
  const effectiveTopReservation = Math.max(topClearance, yOffset);
  const availableHeight = Math.max(
    0,
    height - effectiveTopReservation - bottomClearance,
  );
  const availableWidth = Math.max(0, width - horizontalMargin);

  // Determine max width based on device resolution
  // Device-specific sizing with extra-small support:
  // - 4K mobile landscape (≥2160px): up to 1100px
  // - QHD+/4K portrait (≥1440px): up to 960px
  // - 2K (1200-1439px): up to 760px
  // - Large phones/tablets (768-1199px): up to 560px
  // - Standard phones (380-767px): up to 400px
  // - Extra-small phones (<380px): up to 320px
  let maxMobileWidth: number;
  if (width >= 2160) {
    maxMobileWidth = Math.min(availableWidth, 1100);
  } else if (width >= 1440) {
    maxMobileWidth = Math.min(availableWidth, 960);
  } else if (width >= 1200) {
    maxMobileWidth = Math.min(availableWidth, 760);
  } else if (width >= 768) {
    maxMobileWidth = Math.min(availableWidth, 560);
  } else if (width >= 380) {
    maxMobileWidth = Math.min(availableWidth, 400);
  } else {
    // Extra-small devices (iPhone SE, old Android, budget phones)
    maxMobileWidth = Math.min(availableWidth, 320);
  }

  // In portrait we want the arena to consume more vertical real estate,
  // so the per-device max-height cap only applies in landscape.
  const maxMobileHeight = isPortrait
    ? availableHeight
    : Math.min(availableHeight, width < 380 ? 240 : 800);

  // Aspect ratio depends on orientation:
  //   landscape → 4:3 (height = width × 3/4)
  //   portrait  → 3:4 (height = width × 4/3)
  // In portrait, width is constrained by height × 3/4 (not height × 4/3).
  const widthFromHeight = isPortrait
    ? maxMobileHeight * (3 / 4)
    : maxMobileHeight * (4 / 3);

  // Minimum arena width so the 3D scene stays legible, but never above
  // what the viewport can actually host:
  //   - `availableWidth` caps absolute width of the arena element
  //   - in portrait, `availableHeight × 3/4` caps arena width so the arena
  //     height never exceeds `availableHeight` (preventing the arena from
  //     being drawn behind the bottom HUD / D-Pad).
  const hardWidthCap = isPortrait
    ? Math.min(availableWidth, availableHeight * (3 / 4))
    : Math.min(availableWidth, availableHeight * (4 / 3));
  const minArenaWidth = Math.min(280, hardWidthCap);

  const areaWidth = Math.max(
    Math.min(maxMobileWidth, widthFromHeight, hardWidthCap),
    Math.max(0, minArenaWidth),
  );
  const areaHeight = isPortrait ? areaWidth * (4 / 3) : areaWidth * (3 / 4);

  // Calculate world dimensions based on RENDERED arena width (not screen width)
  // This ensures correct pixels-per-meter ratio for the actual visible arena
  const worldDimensions = calculateArenaWorldDimensions(areaWidth);

  // Calculate 3D scale factor based on reference arena
  // Reference: 10m arena at 1000px = 100 px/m
  const pixelsPerMeter = areaWidth / worldDimensions.widthMeters;
  const referencePixelsPerMeter = 100;
  const scale = pixelsPerMeter / referencePixelsPerMeter;

  return {
    x: (width - areaWidth) / 2, // Centered horizontally
    y: yOffset,
    width: areaWidth,
    height: areaHeight,
    scale,
    worldWidthMeters: worldDimensions.widthMeters,
    worldDepthMeters: worldDimensions.depthMeters,
  };
}
