/**
 * Arena world dimension calculations for physics-first coordinate system.
 * 
 * Determines the physical size of the combat arena in meters based on
 * screen size, ensuring appropriate gameplay space for different devices.
 * 
 * **Korean**: 경기장세계크기 (Arena World Size)
 * 
 * @module utils/arenaWorldDimensions
 * @category Physics
 */

import type { ScreenSize } from "../systems/ResponsiveScaling";

/**
 * World dimensions for an arena in meters.
 * 
 * **Korean**: 세계크기 (World Dimensions)
 * 
 * @public
 */
export interface WorldDimensions {
  /** Arena width in meters */
  readonly widthMeters: number;
  /** Arena depth in meters */
  readonly depthMeters: number;
}

/**
 * Calculate appropriate arena world dimensions based on screen size.
 * 
 * Larger screens get larger arenas for better gameplay, while maintaining
 * the same physical combat mechanics. Movement speed in m/s remains constant,
 * but larger arenas provide more tactical space.
 * 
 * **Principle**: Arena size scales with device capability, not resolution.
 * - Mobile: Smaller arena (6m) for focused, fast-paced combat
 * - Tablet: Medium arena (8m) for balanced gameplay
 * - Desktop: Standard arena (10m) for tactical combat
 * - Large/4K: Larger arena (12-14m) for advanced positioning
 * 
 * **Korean**: 경기장크기계산 (Calculate Arena Size)
 * 
 * @param screenSize - Screen size category from ResponsiveScaling system
 * @param aspectRatio - Desired aspect ratio (default: 1.0 for square arena)
 * @returns World dimensions in meters
 * 
 * @example
 * ```typescript
 * // Mobile 640×360
 * const mobile = calculateArenaWorldDimensions("mobile", 1.0);
 * // Result: { widthMeters: 6, depthMeters: 6 }
 * 
 * // Desktop 1920×1080
 * const desktop = calculateArenaWorldDimensions("desktop", 1.0);
 * // Result: { widthMeters: 10, depthMeters: 10 }
 * ```
 * 
 * @public
 */
export function calculateArenaWorldDimensions(
  screenSize: ScreenSize,
  aspectRatio: number = 1.0
): WorldDimensions {
  // Base width in meters for each screen size category
  let baseWidthMeters: number;
  
  switch (screenSize) {
    case "mobile":
      // Small devices: 6m × 6m arena for fast, focused combat
      baseWidthMeters = 6;
      break;
      
    case "tablet":
      // Medium devices: 8m × 8m arena for balanced gameplay
      baseWidthMeters = 8;
      break;
      
    case "desktop":
      // Standard devices: 10m × 10m arena for tactical combat
      baseWidthMeters = 10;
      break;
      
    case "large":
      // Large displays: 12m × 12m arena for advanced positioning
      baseWidthMeters = 12;
      break;
      
    case "xlarge":
      // Ultra-wide/4K: 14m × 14m arena for maximum tactical space
      baseWidthMeters = 14;
      break;
      
    default:
      // Fallback to standard size
      baseWidthMeters = 10;
  }
  
  // Calculate depth based on aspect ratio
  // For square arenas (aspectRatio = 1.0), depth equals width
  // For rectangular arenas, depth = width / aspectRatio
  const depthMeters = baseWidthMeters / aspectRatio;
  
  return {
    widthMeters: baseWidthMeters,
    depthMeters,
  };
}

/**
 * Get player height in meters from archetype physical attributes.
 * 
 * Converts archetype totalHeight (in centimeters) to meters for physics calculations.
 * 
 * **Korean**: 플레이어키 (Player Height)
 * 
 * @param archetypeHeightCm - Player height in centimeters from PhysicalAttributes
 * @returns Height in meters
 * 
 * @example
 * ```typescript
 * // Musa archetype: 180cm
 * const height = getPlayerHeightMeters(180);
 * // Result: 1.8 meters
 * ```
 * 
 * @public
 */
export function getPlayerHeightMeters(archetypeHeightCm: number): number {
  return archetypeHeightCm / 100;
}
