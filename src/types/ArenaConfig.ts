/**
 * Arena Configuration System
 * 
 * Defines arena dimensions based on screen size and device capabilities.
 * NO FIXED CONSTANTS - all values calculated based on context.
 * 
 * @module types/ArenaConfig
 * @korean 경기장설정
 */

import type { ScreenSize } from "./ResponsiveTypes";

/**
 * Arena world dimensions in meters
 * Calculated based on screen size for optimal gameplay
 */
export interface ArenaWorldDimensions {
  /** Arena width in meters */
  readonly widthMeters: number;
  /** Arena depth in meters */
  readonly depthMeters: number;
}

/**
 * Calculate arena world dimensions based on screen size
 * Larger screens get larger arenas for better visibility and gameplay
 * 
 * @param screenSize - Current screen size category
 * @param aspectRatio - Arena aspect ratio (width/depth), default 1.0 for square
 * @returns Arena dimensions in meters
 */
export function calculateArenaWorldDimensions(
  screenSize: ScreenSize,
  aspectRatio: number = 1.0
): ArenaWorldDimensions {
  // Base arena size varies by screen category
  // Larger screens = larger arena for better spatial awareness
  let baseSize: number;
  
  switch (screenSize) {
    case "mobile":
      baseSize = 6; // 6m for mobile (compact)
      break;
    case "tablet":
      baseSize = 8; // 8m for tablet
      break;
    case "desktop":
      baseSize = 10; // 10m for desktop
      break;
    case "large":
      baseSize = 12; // 12m for large displays
      break;
    case "xlarge":
      baseSize = 14; // 14m for 4K+ displays
      break;
    default:
      baseSize = 8; // fallback
  }

  // Apply aspect ratio
  const widthMeters = baseSize;
  const depthMeters = baseSize / aspectRatio;

  return {
    widthMeters,
    depthMeters,
  };
}

/**
 * Get player height in meters based on archetype physical attributes
 * 
 * @param archetypeHeight - Height from archetype physical attributes (cm or pixels)
 * @returns Height in meters
 */
export function getPlayerHeightMeters(archetypeHeight: number): number {
  // If height is in cm (typical range 160-200), convert to meters
  if (archetypeHeight > 100) {
    return archetypeHeight / 100;
  }
  // If already in meters (1.6-2.0), return as-is
  return archetypeHeight;
}
