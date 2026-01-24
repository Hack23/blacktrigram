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
import type { HUDPosition } from '../components/shared/ui/BaseHUDContainer';
import { HUD_WIDTH_PERCENT, HUD_HEIGHT } from '../types/LayoutTypes';

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
 * Handles responsive sizing, positioning, and spacing based on screen size
 * and HUD position.
 * 
 * @param width - Screen width in pixels
 * @param height - Screen height in pixels
 * @param positionScale - Position scale multiplier for large displays (1.0-1.5)
 * @param isMobile - Whether mobile layout is active
 * @param position - HUD position (left, right, top, bottom)
 * @param context - Context ('training' or 'combat') for context-specific dimensions
 * @param paddingOverride - Optional padding override for per-position customization
 * @param gapOverride - Optional gap override for per-position customization
 * @returns Calculated layout dimensions and offsets
 * 
 * @example
 * ```tsx
 * const layout = useHUDLayout(
 *   1920, 1080, 1.0, false, 'left', 'training'
 * );
 * // layout.hudWidth = 269 (Math.round(14% of 1920))
 * // layout.availableHeight = 880 (1080 - 70 - 130)
 * ```
 */
export function useHUDLayout(
  width: number,
  height: number,
  positionScale: number,
  isMobile: boolean,
  position: HUDPosition,
  context: 'training' | 'combat' = 'training',
  paddingOverride?: number,
  gapOverride?: number
): HUDLayoutResult {
  return useMemo(() => {

    // Calculate width percentage based on position and screen size
    // Use position-specific constants to maintain single source of truth
    let hudWidthPercent: number;
    if (position === 'left') {
      hudWidthPercent = isMobile ? HUD_WIDTH_PERCENT.LEFT_MOBILE : HUD_WIDTH_PERCENT.LEFT_DESKTOP;
    } else if (position === 'right') {
      hudWidthPercent = isMobile ? HUD_WIDTH_PERCENT.RIGHT_MOBILE : HUD_WIDTH_PERCENT.RIGHT_DESKTOP;
    } else if (position === 'top') {
      hudWidthPercent = HUD_WIDTH_PERCENT.TOP;
    } else {
      hudWidthPercent = HUD_WIDTH_PERCENT.BOTTOM;
    }

    // Calculate height based on position and context
    // Use imported constants from LayoutTypes for single source of truth
    const topHeightDesktop = context === 'training' 
      ? HUD_HEIGHT.TRAINING_TOP_DESKTOP 
      : HUD_HEIGHT.COMBAT_TOP_DESKTOP;
    const topHeightMobile = context === 'training'
      ? HUD_HEIGHT.TRAINING_TOP_MOBILE
      : HUD_HEIGHT.COMBAT_TOP_MOBILE;
    const bottomHeightDesktop = context === 'training'
      ? HUD_HEIGHT.TRAINING_BOTTOM_DESKTOP
      : HUD_HEIGHT.COMBAT_BOTTOM_DESKTOP;
    const bottomHeightMobile = context === 'training'
      ? HUD_HEIGHT.TRAINING_BOTTOM_MOBILE
      : HUD_HEIGHT.COMBAT_BOTTOM_MOBILE;

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
      : Math.max(0, height - scaledTopHeight - scaledBottomHeight);

    // Calculate offsets for left/right HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = Math.max(0, height - topOffset - bottomOffset);

    // Responsive padding and gap - context-specific for training vs combat
    // Default values apply unless overridden via paddingOverride/gapOverride parameters
    const defaultPadding = context === 'training'
      ? (isMobile ? 10 : 15 * positionScale)
      : (isMobile ? 8 : 12 * positionScale);
    
    const defaultGap = context === 'training'
      ? (isMobile ? 12 : 18 * positionScale)
      : (isMobile ? 10 : 14 * positionScale);
    
    // Use overrides if provided, otherwise use defaults
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
  }, [width, height, positionScale, isMobile, position, context, paddingOverride, gapOverride]);
}
