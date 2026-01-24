/**
 * useHUDLayout - Centralized HUD layout calculations
 * 
 * Extracts common HUD layout patterns used across Training and Combat screens.
 * Provides resolution-based responsive sizing, positioning, and spacing calculations.
 * 
 * @module hooks
 * @korean HUD레이아웃훅 - 중앙화된 HUD 레이아웃 계산
 */

import { useMemo } from 'react';
import type { HUDPosition } from '../components/shared/ui/BaseHUDContainer';
import { getResponsiveSize, getHUDHeight, getResponsivePadding } from '../utils/responsiveLayout';

/**
 * HUD position type - left, right, top, or bottom
 * Re-exported from BaseHUDContainer to maintain single source of truth
 */
export type { HUDPosition };

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
}

/**
 * Custom hook for calculating HUD layout dimensions
 * 
 * Provides consistent layout calculations across Training and Combat screens.
 * Uses resolution-based responsive sizing for smooth scaling across all screen sizes.
 * 
 * @param width - Screen width in pixels
 * @param height - Screen height in pixels
 * @param positionScale - Position scale multiplier for large displays (1.0-1.5)
 * @param position - HUD position (left, right, top, bottom)
 * @param context - Context ('training' or 'combat') for context-specific dimensions
 * @param paddingOverride - Optional padding override (final pixel value, already scaled). When provided, bypasses default padding calculation.
 * @param gapOverride - Optional gap override (final pixel value, already scaled). When provided, bypasses default gap calculation.
 * @returns Calculated layout dimensions and offsets
 * 
 * @example
 * ```tsx
 * const layout = useHUDLayout(
 *   1920, 1080, 1.0, 'left', 'training'
 * );
 * // Resolution-based sizing interpolates smoothly between breakpoints
 * // layout.hudWidth = 269 (14% of 1920 for desktop)
 * // layout.topOffset = 64.8 (getHUDHeight(1080, 0.06) = 64.8)
 * // layout.bottomOffset = 118.8 (getHUDHeight(1080, 0.11) = 118.8)
 * // layout.availableHeight = 896.4 (1080 - 64.8 - 118.8)
 * ```
 */
export function useHUDLayout(
  width: number,
  height: number,
  positionScale: number,
  position: HUDPosition,
  context: 'training' | 'combat' = 'training',
  paddingOverride?: number,
  gapOverride?: number
): HUDLayoutResult {
  return useMemo(() => {

    // Resolution-based width calculation: interpolates smoothly between breakpoints
    // Left/Right HUDs: 14-18% of screen width (mobile: 18%, tablet: 16%, desktop: 14%)
    // Top/Bottom HUDs: 100% width
    const hudWidthPercent = (position === 'left' || position === 'right')
      ? getResponsiveSize(width, {
          mobile: 18,   // 18% for small screens
          tablet: 16,   // 16% for medium screens
          desktop: 14,  // 14% for large screens
        }) / 100  // Convert to decimal for percentage calculation
      : 1.0;  // Top and bottom HUDs use full width

    // Resolution-based height calculation for top/bottom bars
    // Training: ~6% for top, ~11% for bottom
    // Combat: ~8% for top, ~12% for bottom
    const topHeightPercent = context === 'training' ? 0.06 : 0.08;
    const bottomHeightPercent = context === 'training' ? 0.11 : 0.12;
    
    const scaledTopHeight = getHUDHeight(height, topHeightPercent) * positionScale;
    const scaledBottomHeight = getHUDHeight(height, bottomHeightPercent) * positionScale;

    // Calculate HUD dimensions in pixels
    const hudWidth = Math.round(width * hudWidthPercent);
    const hudHeight = position === 'top' || position === 'bottom'
      ? (position === 'top' ? scaledTopHeight : scaledBottomHeight)
      : Math.max(0, height - scaledTopHeight - scaledBottomHeight);

    // Calculate offsets for left/right HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = Math.max(0, height - topOffset - bottomOffset);

    // Resolution-based padding using responsive utility
    const defaultPadding = getResponsivePadding(width) * positionScale;
    
    // Resolution-based gap: context-specific values
    // Training uses slightly larger gaps than combat for better readability
    const defaultGap = context === 'training'
      ? getResponsiveSize(width, {
          mobile: 12,
          tablet: 15,
          desktop: 18,
        }) * positionScale
      : getResponsiveSize(width, {
          mobile: 10,
          tablet: 12,
          desktop: 14,
        }) * positionScale;
    
    // Use overrides if provided, otherwise use defaults
    // Overrides allow per-position customization (e.g., TrainingRightHUD uses tighter spacing)
    const padding = paddingOverride !== undefined ? paddingOverride : defaultPadding;
    const gap = gapOverride !== undefined ? gapOverride : defaultGap;

    // Guard against division by zero and ensure valid percentage
    const safeHeight = Math.max(height, 1);
    const hudHeightPercent = Math.max(0, Math.min(1, hudHeight / safeHeight));

    return {
      hudWidthPercent,
      hudHeightPercent,
      hudWidth,
      hudHeight,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
    };
  }, [width, height, positionScale, position, context, paddingOverride, gapOverride]);
}
