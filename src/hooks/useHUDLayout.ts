/**
 * useHUDLayout - Centralized HUD layout calculations
 * 
 * Extracts common HUD layout patterns used across Training and Combat screens.
 * Provides responsive sizing, positioning, and spacing calculations.
 * 
 * @module hooks
 * @korean HUD레이아웃훅 - 중앙화된 HUD 레이아웃 계산
 */

import { useMemo } from 'react';

/**
 * HUD position type - left, right, top, or bottom
 */
export type HUDPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Configuration for HUD layout calculations
 */
export interface HUDLayoutConfig {
  /** Screen width in pixels */
  readonly width: number;
  /** Screen height in pixels */
  readonly height: number;
  /** Position scale multiplier for large displays (1.0-1.5) */
  readonly positionScale: number;
  /** Whether mobile layout is active */
  readonly isMobile?: boolean;
}

/**
 * Result of HUD layout calculations
 */
export interface HUDLayoutResult {
  /** HUD width as percentage of screen (0.0-1.0) */
  readonly hudWidthPercent: number;
  /** HUD height as percentage of screen (0.0-1.0) */
  readonly hudHeightPercent: number;
  /** HUD width in pixels */
  readonly hudWidth: number;
  /** HUD height in pixels */
  readonly hudHeight: number;
  /** Top offset in pixels (for left/right HUDs) */
  readonly topOffset: number;
  /** Bottom offset in pixels (for left/right HUDs) */
  readonly bottomOffset: number;
  /** Available height between top and bottom bars */
  readonly availableHeight: number;
  /** Internal padding in pixels */
  readonly padding: number;
  /** Gap between sections in pixels */
  readonly gap: number;
  /** Scaled top height as percentage (for responsive layouts) */
  readonly scaledTopHeight: number;
  /** Scaled bottom height as percentage (for responsive layouts) */
  readonly scaledBottomHeight: number;
}

/**
 * HUD dimension constants for different positions and contexts
 */
const HUD_DIMENSIONS = {
  // Width percentages for left/right HUDs
  WIDTH_DESKTOP: {
    training: 0.14, // 14% for training
    combat: 0.14,   // 14% for combat
  },
  WIDTH_MOBILE: {
    training: 0.18, // 18% for training
    combat: 0.18,   // 18% for combat
  },
  
  // Height constants for top/bottom bars
  TOP_HEIGHT_DESKTOP: {
    training: 70,
    combat: 70,
  },
  TOP_HEIGHT_MOBILE: {
    training: 50,
    combat: 55,
  },
  BOTTOM_HEIGHT_DESKTOP: {
    training: 130,
    combat: 120,
  },
  BOTTOM_HEIGHT_MOBILE: {
    training: 110,
    combat: 100,
  },
} as const;

/**
 * Custom hook for calculating HUD layout dimensions
 * 
 * Provides consistent layout calculations across Training and Combat screens.
 * Handles responsive sizing, positioning, and spacing based on screen size
 * and HUD position.
 * 
 * @param config - Layout configuration (width, height, positionScale, isMobile)
 * @param position - HUD position (left, right, top, bottom)
 * @param context - Optional context ('training' or 'combat') for context-specific dimensions
 * @returns Calculated layout dimensions and offsets
 * 
 * @example
 * ```tsx
 * const layout = useHUDLayout(
 *   { width: 1920, height: 1080, positionScale: 1.0, isMobile: false },
 *   'left',
 *   'training'
 * );
 * // layout.hudWidth = 268.8 (14% of 1920)
 * // layout.availableHeight = 940 (1080 - 70 - 70)
 * ```
 */
export function useHUDLayout(
  config: HUDLayoutConfig,
  position: HUDPosition,
  context: 'training' | 'combat' = 'training'
): HUDLayoutResult {
  return useMemo(() => {
    const { width, height, positionScale, isMobile = false } = config;

    // Calculate width percentage based on position and screen size
    const hudWidthPercent = position === 'left' || position === 'right'
      ? (isMobile 
          ? HUD_DIMENSIONS.WIDTH_MOBILE[context] 
          : HUD_DIMENSIONS.WIDTH_DESKTOP[context])
      : 1.0; // Full width for top/bottom

    // Calculate height based on position
    const topHeightDesktop = HUD_DIMENSIONS.TOP_HEIGHT_DESKTOP[context];
    const topHeightMobile = HUD_DIMENSIONS.TOP_HEIGHT_MOBILE[context];
    const bottomHeightDesktop = HUD_DIMENSIONS.BOTTOM_HEIGHT_DESKTOP[context];
    const bottomHeightMobile = HUD_DIMENSIONS.BOTTOM_HEIGHT_MOBILE[context];

    const scaledTopHeight = isMobile
      ? topHeightMobile
      : topHeightDesktop * positionScale;
    
    const scaledBottomHeight = isMobile
      ? bottomHeightMobile
      : bottomHeightDesktop * positionScale;

    // Calculate HUD dimensions in pixels
    const hudWidth = Math.round(width * hudWidthPercent);
    const hudHeight = position === 'top' || position === 'bottom'
      ? (position === 'top' ? scaledTopHeight : scaledBottomHeight)
      : height - scaledTopHeight - scaledBottomHeight;

    // Calculate offsets for left/right HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Responsive padding and gap
    const padding = isMobile ? 8 : 12 * positionScale;
    const gap = isMobile ? 10 : 14 * positionScale;

    // Scaled heights as percentages (for legacy compatibility)
    const scaledTopHeightPercent = isMobile ? 0.25 : 0.15;
    const scaledBottomHeightPercent = 1.0 - scaledTopHeightPercent;

    return {
      hudWidthPercent,
      hudHeightPercent: hudHeight / height,
      hudWidth,
      hudHeight,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
      scaledTopHeight: scaledTopHeightPercent,
      scaledBottomHeight: scaledBottomHeightPercent,
    };
  }, [config, position, context]);
}
