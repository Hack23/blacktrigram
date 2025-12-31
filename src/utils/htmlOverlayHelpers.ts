/**
 * Html Overlay Positioning Helpers for Three.js
 * 
 * Provides utilities for positioning Html overlays from @react-three/drei
 * with bounds checking, z-index management, and Korean text measurement.
 * 
 * Fixes:
 * - Z-fighting between Html overlays and 3D elements
 * - Text clipping at screen edges
 * - Inconsistent overlay positioning
 * - Performance issues with many overlays
 * 
 * @module utils/htmlOverlayHelpers
 * @category Utilities
 * @korean HTML오버레이헬퍼
 */

// Note: Using Z_INDEX from LayoutTypes which is designed for Three.js Html overlays.
// This is distinct from the legacy Z_INDEX in ui.ts which is for traditional DOM elements.
import { Z_INDEX, type ZIndexValue } from "../types/LayoutTypes";
import type {
  HtmlOverlayLayer,
  ScreenBounds,
  ElementBounds,
  SafePosition,
  HtmlOverlayStyle,
  TextMeasurement,
  HtmlOverlayPositionOptions,
  HtmlOverlayConfig,
} from "../types/HtmlOverlayTypes";
import { FONT_FAMILY } from "../types/constants";

/**
 * Get z-index value for Html overlay layer
 * 
 * Maps layer names to Z_INDEX constants for consistent stacking order.
 * Prevents z-fighting by maintaining clear hierarchy.
 * 
 * @param layer - Html overlay layer category
 * @param offset - Optional offset to add to base z-index (default: 0)
 * @returns Z-index value for the layer
 * 
 * @example
 * ```typescript
 * const zIndex = getZIndexForLayer('hud'); // Returns 40
 * const zIndexWithOffset = getZIndexForLayer('hud', 5); // Returns 45
 * ```
 * 
 * @category Html Overlay Helpers
 * @korean Z인덱스가져오기
 */
export function getZIndexForLayer(
  layer: HtmlOverlayLayer,
  offset: number = 0
): ZIndexValue {
  const layerMap: Record<HtmlOverlayLayer, ZIndexValue> = {
    background: Z_INDEX.BACKGROUND,
    arena: Z_INDEX.ARENA,
    players: Z_INDEX.PLAYERS,
    effects: Z_INDEX.EFFECTS,
    hud: Z_INDEX.HUD,
    "mobile-controls": Z_INDEX.MOBILE_CONTROLS,
    modal: Z_INDEX.MODAL,
    tooltip: Z_INDEX.TOOLTIP,
    debug: Z_INDEX.DEBUG,
  };

  const baseZIndex = layerMap[layer];
  
  // Derive the valid numeric z-index range from Z_INDEX to ensure we never
  // return an out-of-bounds value, even if a large offset is provided.
  const zIndexValues = Object.values(Z_INDEX).filter(
    (value) => typeof value === "number"
  ) as number[];
  const minZIndex = Math.min(...zIndexValues);
  const maxZIndex = Math.max(...zIndexValues);

  const rawZIndex = baseZIndex + offset;
  const clampedZIndex = Math.max(minZIndex, Math.min(maxZIndex, rawZIndex));

  return clampedZIndex as ZIndexValue;
}

/**
 * Calculate safe position that prevents clipping at screen edges
 * 
 * Takes a desired position and element bounds, then ensures the element
 * stays within screen bounds by clamping to safe area.
 * 
 * @param position - Desired 3D position [x, y, z]
 * @param elementBounds - Size of the element
 * @param screenBounds - Screen size and safe area insets
 * @returns Safe position with clipping prevention
 * 
 * @example
 * ```typescript
 * const safePos = calculateSafePosition(
 *   [100, 50, 0],
 *   { width: 200, height: 100, margin: 10 },
 *   { width: 1920, height: 1080 }
 * );
 * // Returns: { x: 100, y: 50, wasClamped: false }
 * ```
 * 
 * @category Html Overlay Helpers
 * @korean 안전위치계산
 */
export function calculateSafePosition(
  position: [number, number, number],
  elementBounds: ElementBounds,
  screenBounds: ScreenBounds
): SafePosition {
  const [x, y] = position;
  const margin = elementBounds.margin ?? 0;
  const safeArea = screenBounds.safeArea ?? { top: 0, right: 0, bottom: 0, left: 0 };

  // Calculate effective bounds with safe area and margin
  const minX = safeArea.left + margin;
  const maxX = screenBounds.width - safeArea.right - elementBounds.width - margin;
  const minY = safeArea.top + margin;
  const maxY = screenBounds.height - safeArea.bottom - elementBounds.height - margin;

  // Clamp position to safe bounds
  const safeX = Math.max(minX, Math.min(x, maxX));
  const safeY = Math.max(minY, Math.min(y, maxY));

  // Check if position was clamped
  const wasClamped = safeX !== x || safeY !== y;

  return {
    x: safeX,
    y: safeY,
    wasClamped,
  };
}

/**
 * Measure Korean and English text dimensions
 * 
 * Uses canvas-based text measurement to calculate accurate bounds
 * for bilingual text before rendering. Prevents text overflow.
 * 
 * @param korean - Korean text content
 * @param english - English text content
 * @param fontSize - Font size in pixels
 * @param fontFamily - Font family to use (default: FONT_FAMILY.KOREAN)
 * @param layout - Text layout direction ('vertical' | 'horizontal')
 * @returns Text measurement with width and height
 * 
 * @example
 * ```typescript
 * const bounds = measureTextBounds('공격', 'Attack', 16, FONT_FAMILY.KOREAN, 'vertical');
 * // Returns: { width: 48, height: 42, koreanWidth: 32, englishWidth: 48 }
 * ```
 * 
 * @category Html Overlay Helpers
 * @korean 텍스트경계측정
 */
export function measureTextBounds(
  korean: string,
  english: string,
  fontSize: number,
  fontFamily: string = FONT_FAMILY.KOREAN,
  layout: "vertical" | "horizontal" = "vertical"
): TextMeasurement {
  // Create canvas for text measurement
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    // Fallback if canvas not available
    return {
      width: fontSize * Math.max(korean.length, english.length),
      height: fontSize * 2.4, // Line height * 2 lines
      koreanWidth: fontSize * korean.length,
      englishWidth: fontSize * english.length,
    };
  }

  // Measure Korean text (larger, bold)
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  const koreanMetrics = ctx.measureText(korean);
  const koreanWidth = koreanMetrics.width;

  // Measure English text (smaller, italic)
  const englishFontSize = fontSize * 0.75;
  ctx.font = `italic ${englishFontSize}px ${fontFamily}`;
  const englishMetrics = ctx.measureText(english);
  const englishWidth = englishMetrics.width;

  // Calculate total dimensions based on layout
  let totalWidth: number;
  let totalHeight: number;

  if (layout === "vertical") {
    // Vertical layout: max width, sum heights
    totalWidth = Math.max(koreanWidth, englishWidth);
    totalHeight = fontSize * 1.2 + englishFontSize * 1.2 + 4; // Line heights + gap
  } else {
    // Horizontal layout: sum widths, max height
    totalWidth = koreanWidth + 8 + englishWidth; // Add gap between texts
    totalHeight = Math.max(fontSize * 1.2, englishFontSize * 1.2);
  }

  return {
    width: totalWidth,
    height: totalHeight,
    koreanWidth,
    englishWidth,
  };
}

/**
 * Apply standardized Html overlay styles
 * 
 * Creates consistent styling for Html overlays with proper z-index,
 * pointer events, and performance optimizations.
 * 
 * @param layer - Html overlay layer for z-index
 * @param interactive - Whether the overlay should receive pointer events
 * @param distanceFactor - Distance scaling factor (default: 10)
 * @param center - Whether to center the overlay (default: true)
 * @param occlude - Whether to occlude behind 3D objects (default: false)
 * @param zIndexOffset - Optional z-index offset (default: 0)
 * @returns Html overlay style configuration
 * 
 * @example
 * ```typescript
 * const style = applyHtmlOverlayStyles('hud', false, 10, true);
 * // Returns: { zIndex: 40, pointerEvents: 'none', distanceFactor: 10, center: true, ... }
 * ```
 * 
 * @category Html Overlay Helpers
 * @korean 오버레이스타일적용
 */
export function applyHtmlOverlayStyles(
  layer: HtmlOverlayLayer,
  interactive: boolean = false,
  distanceFactor: number = 10,
  center: boolean = true,
  occlude: boolean = false,
  zIndexOffset: number = 0
): HtmlOverlayStyle {
  return {
    zIndex: getZIndexForLayer(layer, zIndexOffset),
    pointerEvents: interactive ? "all" : "none",
    distanceFactor,
    center,
    occlude,
    transform: "translateZ(0)", // GPU acceleration
  };
}

/**
 * Create complete Html overlay configuration
 * 
 * Combines position calculation, bounds checking, and styling
 * into a single configuration object for Html overlays.
 * 
 * @param options - Html overlay positioning options
 * @returns Complete Html overlay configuration
 * 
 * @example
 * ```typescript
 * const config = createHtmlOverlayConfig({
 *   position: [0, 2, 0],
 *   layer: 'hud',
 *   screenBounds: { width: 1920, height: 1080 },
 *   elementBounds: { width: 200, height: 100 },
 *   isMobile: false,
 * });
 * ```
 * 
 * @category Html Overlay Helpers
 * @korean 오버레이설정생성
 */
export function createHtmlOverlayConfig(
  options: HtmlOverlayPositionOptions
): HtmlOverlayConfig {
  const {
    position,
    layer,
    screenBounds,
    elementBounds,
    isMobile = false,
    zIndexOffset = 0,
  } = options;

  // Calculate safe position if bounds provided
  let safePosition: SafePosition;
  if (screenBounds && elementBounds) {
    safePosition = calculateSafePosition(position, elementBounds, screenBounds);
  } else {
    // No bounds checking needed
    safePosition = {
      x: position[0],
      y: position[1],
      wasClamped: false,
    };
  }

  // Create style configuration
  const style = applyHtmlOverlayStyles(
    layer,
    false, // Default to non-interactive for performance
    isMobile ? 15 : 10, // Larger distance factor for mobile
    true, // Center by default
    false, // Don't occlude by default
    zIndexOffset
  );

  return {
    position: safePosition,
    style,
    position3D: position,
  };
}

/**
 * Get default safe area insets for mobile devices
 * 
 * Provides standard safe area values for devices with notches
 * and home indicators (iPhone X+, modern Android).
 * 
 * @param isMobile - Whether device is mobile
 * @returns Safe area insets
 * 
 * @category Html Overlay Helpers
 * @korean 기본안전영역
 */
export function getDefaultSafeArea(isMobile: boolean): {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
} {
  if (!isMobile) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // Standard safe area for mobile devices with notches
  return {
    top: 44, // Status bar + notch
    right: 0,
    bottom: 34, // Home indicator
    left: 0,
  };
}

/**
 * Calculate optimal distance factor for Html overlay
 * 
 * Determines appropriate distance scaling based on screen size
 * and overlay purpose. Prevents overlays from being too small or large.
 * 
 * @param screenWidth - Screen width in pixels
 * @param overlayType - Type of overlay ('text' | 'button' | 'panel')
 * @param isMobile - Whether on mobile device
 * @returns Optimal distance factor
 * 
 * @category Html Overlay Helpers
 * @korean 거리인수계산
 */
export function calculateDistanceFactor(
  screenWidth: number,
  overlayType: "text" | "button" | "panel",
  isMobile: boolean
): number {
  // Base distance factors by type
  const baseFactors = {
    text: 10,
    button: 12,
    panel: 15,
  };

  const baseFactor = baseFactors[overlayType];

  // Adjust for mobile
  if (isMobile) {
    return baseFactor * 1.5; // 50% larger on mobile
  }

  // Adjust for screen width
  if (screenWidth < 1200) {
    return baseFactor * 1.2; // 20% larger on smaller screens
  }

  return baseFactor;
}
