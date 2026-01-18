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
 * **Square Arena Philosophy**:
 * All arenas are square (6×6, 8×8, 10×10 meters) for consistent combat mechanics.
 * This ensures:
 * - Equal movement range in all directions
 * - Predictable positioning and spacing
 * - Consistent physics across all devices
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
export type ScreenSizeCategory =
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "ultra";

/**
 * Standard square arena sizes in meters.
 * Arenas are always square for consistent combat mechanics.
 *
 * @public
 */
export const ARENA_SIZES = {
  /** Small arena for compact screens (6m × 6m) */
  SMALL: 6,
  /** Medium arena for tablets and small laptops (8m × 8m) */
  MEDIUM: 8,
  /** Large arena for standard desktops (10m × 10m) */
  LARGE: 10,
  /** Extra-large arena for high-res displays (12m × 12m) */
  XLARGE: 12,
  /** Ultra arena for 4K+ displays (14m × 14m) */
  ULTRA: 14,
} as const;

/**
 * Resolution breakpoints for arena size determination.
 * Based on common display widths.
 *
 * @public
 */
export const RESOLUTION_BREAKPOINTS = {
  /** Small screens: < 768px (phones, small tablets) */
  SMALL_MAX: 768,
  /** Medium screens: 768-1199px (tablets, small laptops) */
  MEDIUM_MAX: 1200,
  /** Large screens: 1200-1919px (laptops, standard monitors) */
  LARGE_MAX: 1920,
  /** XLarge screens: 1920-2559px (large monitors, some 4K) */
  XLARGE_MAX: 2560,
  /** Ultra screens: ≥ 2560px (4K, ultrawide) */
} as const;

/**
 * World dimensions for an arena in meters.
 *
 * **Korean**: 세계크기 (World Dimensions)
 *
 * @public
 */
export interface WorldDimensions {
  /** Arena width in meters (always equals depth for square arenas) */
  readonly widthMeters: number;
  /** Arena depth in meters (always equals width for square arenas) */
  readonly depthMeters: number;
  /** Arena size in meters (same as widthMeters for square arenas) */
  readonly sizeMeters: number;
  /** Screen category used to determine arena size */
  readonly screenCategory: ScreenSizeCategory;
}

/**
 * Complete arena configuration including pixel and meter dimensions.
 *
 * @public
 */
export interface ArenaConfiguration {
  /** Arena position X in pixels */
  readonly x: number;
  /** Arena position Y in pixels */
  readonly y: number;
  /** Arena width in pixels */
  readonly width: number;
  /** Arena height in pixels */
  readonly height: number;
  /** Arena world width in meters */
  readonly worldWidthMeters: number;
  /** Arena world depth in meters */
  readonly worldDepthMeters: number;
  /** Pixels per meter ratio for this arena */
  readonly pixelsPerMeter: number;
  /** Scale factor (1.0 = reference desktop, <1.0 = smaller screens) */
  readonly scale: number;
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
 * getScreenSizeCategory(640);   // "small" - small phone
 * getScreenSizeCategory(1200);  // "large" - standard laptop
 * getScreenSizeCategory(3840);  // "ultra" - 4K display
 * ```
 *
 * @public
 */
export function getScreenSizeCategory(screenWidth: number): ScreenSizeCategory {
  if (screenWidth < RESOLUTION_BREAKPOINTS.SMALL_MAX) return "small";
  if (screenWidth < RESOLUTION_BREAKPOINTS.MEDIUM_MAX) return "medium";
  if (screenWidth < RESOLUTION_BREAKPOINTS.LARGE_MAX) return "large";
  if (screenWidth < RESOLUTION_BREAKPOINTS.XLARGE_MAX) return "xlarge";
  return "ultra";
}

/**
 * Get arena size in meters for a given screen category.
 *
 * @param category - Screen size category
 * @returns Arena size in meters (square dimension)
 *
 * @public
 */
export function getArenaSizeForCategory(category: ScreenSizeCategory): number {
  switch (category) {
    case "small":
      return ARENA_SIZES.SMALL;
    case "medium":
      return ARENA_SIZES.MEDIUM;
    case "large":
      return ARENA_SIZES.LARGE;
    case "xlarge":
      return ARENA_SIZES.XLARGE;
    case "ultra":
      return ARENA_SIZES.ULTRA;
    default:
      return ARENA_SIZES.LARGE;
  }
}

/**
 * Calculate appropriate arena world dimensions based on screen resolution.
 *
 * Larger resolution displays get larger arenas for better gameplay, while
 * maintaining the same physical combat mechanics. Movement speed in m/s
 * remains constant, but larger arenas provide more tactical space.
 *
 * **All arenas are square** for consistent combat mechanics:
 * - < 768px: 6m × 6m (compact, fast-paced combat)
 * - 768-1199px: 8m × 8m (balanced gameplay)
 * - 1200-1919px: 10m × 10m (tactical combat)
 * - 1920-2559px: 12m × 12m (advanced positioning)
 * - ≥ 2560px: 14m × 14m (maximum tactical space)
 *
 * **Korean**: 경기장크기계산 (Calculate Arena Size)
 *
 * @param screenWidth - Screen width in pixels (resolution, not device type)
 * @returns World dimensions in meters (always square)
 *
 * @example
 * ```typescript
 * // Mobile phone 640px width
 * const smallPhone = calculateArenaWorldDimensions(640);
 * // Result: { widthMeters: 6, depthMeters: 6, sizeMeters: 6, screenCategory: "small" }
 *
 * // Desktop 1920×1080
 * const desktop = calculateArenaWorldDimensions(1920);
 * // Result: { widthMeters: 12, depthMeters: 12, sizeMeters: 12, screenCategory: "xlarge" }
 * ```
 *
 * @public
 */
export function calculateArenaWorldDimensions(
  screenWidth: number,
): WorldDimensions {
  const category = getScreenSizeCategory(screenWidth);
  const sizeMeters = getArenaSizeForCategory(category);

  return {
    widthMeters: sizeMeters,
    depthMeters: sizeMeters,
    sizeMeters,
    screenCategory: category,
  };
}

/**
 * Calculate complete arena configuration including pixel and meter dimensions.
 *
 * This is the primary function for setting up arena bounds. It calculates:
 * - Pixel dimensions based on available screen space
 * - Meter dimensions based on screen resolution category
 * - Pixels-per-meter ratio for physics conversion
 *
 * @param screenWidth - Screen width in pixels
 * @param screenHeight - Screen height in pixels
 * @param topOffset - Pixels reserved at top (HUD, headers)
 * @param bottomOffset - Pixels reserved at bottom (controls, footer)
 * @param horizontalMargin - Pixels to leave on sides (as ratio 0-1)
 * @returns Complete arena configuration
 *
 * @public
 */
export function calculateArenaConfiguration(
  screenWidth: number,
  screenHeight: number,
  topOffset: number,
  bottomOffset: number,
  horizontalMargin: number = 0.1,
): ArenaConfiguration {
  // Get world dimensions based on resolution
  const worldDimensions = calculateArenaWorldDimensions(screenWidth);

  // Calculate available pixel space
  const availableWidth = screenWidth * (1 - 2 * horizontalMargin);
  const availableHeight = screenHeight - topOffset - bottomOffset;

  // Use the smaller dimension to ensure square arena fits
  const arenaSizePixels = Math.min(availableWidth, availableHeight);

  // Calculate arena position (centered horizontally)
  const arenaX = (screenWidth - arenaSizePixels) / 2;
  const arenaY = topOffset;

  // Calculate pixels per meter for this configuration
  const pixelsPerMeter = arenaSizePixels / worldDimensions.sizeMeters;

  // Calculate scale relative to reference (1000px / 10m = 100 px/m)
  const referencePixelsPerMeter = 100;
  const scale = pixelsPerMeter / referencePixelsPerMeter;

  return {
    x: arenaX,
    y: arenaY,
    width: arenaSizePixels,
    height: arenaSizePixels,
    worldWidthMeters: worldDimensions.widthMeters,
    worldDepthMeters: worldDimensions.depthMeters,
    pixelsPerMeter,
    scale,
  };
}

/**
 * Calculate pixels-per-meter ratio from arena dimensions.
 *
 * @param arenaWidthPixels - Arena width in pixels
 * @param arenaWidthMeters - Arena width in meters
 * @returns Pixels per meter ratio
 *
 * @public
 */
export function calculatePixelsPerMeter(
  arenaWidthPixels: number,
  arenaWidthMeters: number,
): number {
  if (arenaWidthMeters <= 0) {
    throw new Error(`arenaWidthMeters must be positive: ${arenaWidthMeters}`);
  }
  return arenaWidthPixels / arenaWidthMeters;
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
