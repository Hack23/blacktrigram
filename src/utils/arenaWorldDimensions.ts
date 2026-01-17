/**
 * Arena world dimension calculations for physics-first coordinate system.
 * 
 * Determines the physical size of the combat arena in meters based on
 * screen **resolution** (not device type), ensuring appropriate gameplay
 * space for different display capabilities.
 * 
 * **Important**: Arena size is determined by RESOLUTION, not device type.
 * A mobile device with a 4K screen gets a larger arena than a desktop with
 * 1080p resolution, because arena size should match display capability.
 * 
 * **Korean**: 경기장세계크기 (Arena World Size)
 * 
 * @module utils/arenaWorldDimensions
 * @category Physics
 */

/**
 * Screen size category based on RESOLUTION (width in pixels).
 * 
 * **Korean**: 화면크기범주 (Screen Size Category)
 * 
 * @public
 */
export type ScreenSizeCategory = "mobile" | "tablet" | "desktop" | "large" | "xlarge";

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
 * Categorize screen based on resolution (width in pixels).
 * 
 * This is used for arena sizing. Device type (mobile/desktop) is determined
 * separately for UI controls only.
 * 
 * **Korean**: 화면크기범주결정 (Determine Screen Size Category)
 * 
 * @param screenWidth - Screen width in pixels
 * @returns Screen size category for arena dimensions
 * 
 * @example
 * ```typescript
 * getScreenSizeCategory(640);   // "mobile" - small phone
 * getScreenSizeCategory(1200);  // "desktop" - standard laptop
 * getScreenSizeCategory(3840);  // "xlarge" - 4K display (even on mobile device)
 * ```
 * 
 * @public
 */
export function getScreenSizeCategory(screenWidth: number): ScreenSizeCategory {
  if (screenWidth < 768) return "mobile";      // < 768px
  if (screenWidth < 1200) return "tablet";     // 768-1199px
  if (screenWidth < 1920) return "desktop";    // 1200-1919px
  if (screenWidth < 2560) return "large";      // 1920-2559px
  return "xlarge";                              // ≥ 2560px
}

/**
 * Calculate appropriate arena world dimensions based on screen resolution.
 * 
 * Larger resolution displays get larger arenas for better gameplay, while
 * maintaining the same physical combat mechanics. Movement speed in m/s
 * remains constant, but larger arenas provide more tactical space.
 * 
 * **Principle**: Arena size scales with RESOLUTION CAPABILITY, not device type.
 * - < 768px: Smaller arena (6m) for focused, fast-paced combat
 * - 768-1199px: Medium arena (8m) for balanced gameplay
 * - 1200-1919px: Standard arena (10m) for tactical combat
 * - 1920-2559px: Larger arena (12m) for advanced positioning
 * - ≥ 2560px: Largest arena (14m) for maximum tactical space
 * 
 * **Korean**: 경기장크기계산 (Calculate Arena Size)
 * 
 * @param screenWidth - Screen width in pixels (resolution, not device type)
 * @param aspectRatio - Desired aspect ratio (default: 1.0 for square arena)
 * @returns World dimensions in meters
 * 
 * @example
 * ```typescript
 * // Mobile phone 640px width
 * const smallPhone = calculateArenaWorldDimensions(640, 1.0);
 * // Result: { widthMeters: 6, depthMeters: 6 }
 * 
 * // Desktop 1920×1080
 * const desktop = calculateArenaWorldDimensions(1920, 1.0);
 * // Result: { widthMeters: 12, depthMeters: 12 }
 * 
 * // Mobile with 4K screen (3840px)
 * const mobile4K = calculateArenaWorldDimensions(3840, 1.0);
 * // Result: { widthMeters: 14, depthMeters: 14 } - large arena for high res!
 * ```
 * 
 * @public
 */
export function calculateArenaWorldDimensions(
  screenWidth: number,
  aspectRatio: number = 1.0
): WorldDimensions {
  const category = getScreenSizeCategory(screenWidth);
  
  // Base width in meters for each resolution category
  let baseWidthMeters: number;
  
  switch (category) {
    case "mobile":
      // < 768px resolution: 6m × 6m arena for fast, focused combat
      baseWidthMeters = 6;
      break;
      
    case "tablet":
      // 768-1199px resolution: 8m × 8m arena for balanced gameplay
      baseWidthMeters = 8;
      break;
      
    case "desktop":
      // 1200-1919px resolution: 10m × 10m arena for tactical combat
      baseWidthMeters = 10;
      break;
      
    case "large":
      // 1920-2559px resolution: 12m × 12m arena for advanced positioning
      baseWidthMeters = 12;
      break;
      
    case "xlarge":
      // ≥ 2560px resolution: 14m × 14m arena for maximum tactical space
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
