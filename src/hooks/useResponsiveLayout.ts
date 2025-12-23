/**
 * useResponsiveLayout Hook - Mobile-Optimized Layout Calculations
 * 
 * Provides responsive layout values optimized for mobile screens with touch-friendly
 * element sizing and strategic positioning following iOS Human Interface Guidelines.
 * 
 * Uses robust device detection combining user-agent and screen size to ensure
 * mobile controls are shown on all mobile devices, including high-resolution phones.
 * 
 * Features:
 * - Touch target minimum: 44x44px (iOS guideline)
 * - Safe area insets for notch and home indicator
 * - Responsive font sizes (14px minimum body text)
 * - Optimized spacing for mobile vs desktop
 * - Portrait and landscape mode support
 * 
 * @module hooks/useResponsiveLayout
 * @category Mobile UI
 * @korean 반응형레이아웃훅
 */

import { useMemo } from 'react';
import { shouldUseMobileControls, getSafeAreaInsets as getDeviceSafeAreaInsets } from '../utils/deviceDetection';

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  /** Extra small mobile devices (iPhone SE) */
  MOBILE_SMALL: 375,
  /** Standard mobile devices */
  MOBILE: 768,
  /** Tablet devices */
  TABLET: 1024,
  /** Desktop devices */
  DESKTOP: 1920,
} as const;

/**
 * Touch target sizes following iOS Human Interface Guidelines
 */
export interface TouchTargets {
  /** Minimum touch target (44x44px iOS guideline) */
  readonly small: number;
  /** Medium touch target for primary actions */
  readonly medium: number;
  /** Large touch target for critical actions */
  readonly large: number;
}

/**
 * Safe area insets for mobile devices
 * Accounts for notch, status bar, and home indicator
 */
export interface SafeAreaInsets {
  /** Top inset (status bar, notch) */
  readonly top: number;
  /** Bottom inset (home indicator) */
  readonly bottom: number;
  /** Left inset (landscape mode) */
  readonly left: number;
  /** Right inset (landscape mode) */
  readonly right: number;
}

/**
 * Responsive font sizes
 */
export interface FontSizes {
  /** Small text (12-14px) */
  readonly small: number;
  /** Body text (14-16px minimum for mobile) */
  readonly body: number;
  /** Title text (18-24px) */
  readonly title: number;
  /** Hero text (24-36px) */
  readonly hero: number;
  /** HUD text (16-20px for important combat info) */
  readonly hud: number;
}

/**
 * Responsive spacing scale
 */
export interface Spacing {
  /** Extra small (4-8px) */
  readonly xs: number;
  /** Small (8-12px) */
  readonly sm: number;
  /** Medium (12-16px) */
  readonly md: number;
  /** Large (16-24px) */
  readonly lg: number;
  /** Extra large (24-32px) */
  readonly xl: number;
}

/**
 * Complete responsive layout configuration
 */
export interface ResponsiveLayout {
  /** Whether current viewport is mobile-sized */
  readonly isMobile: boolean;
  /** Whether current viewport is small mobile (< 400px) */
  readonly isSmallMobile: boolean;
  /** Whether current viewport is tablet-sized */
  readonly isTablet: boolean;
  /** Whether in landscape orientation */
  readonly isLandscape: boolean;
  /** Safe area insets for mobile devices */
  readonly safeArea: SafeAreaInsets;
  /** Touch target sizes */
  readonly touchTarget: TouchTargets;
  /** Font sizes */
  readonly fontSize: FontSizes;
  /** Spacing scale */
  readonly spacing: Spacing;
  /** Current viewport dimensions */
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Calculate responsive layout values based on viewport dimensions
 * 
 * Optimized for:
 * - iPhone SE (375x667)
 * - iPhone 11/12/13 (414x896)
 * - iPhone 14 Pro Max (430x932)
 * - iPad (768x1024)
 * - Desktop (1920x1080+)
 * 
 * @param width - Viewport width in pixels
 * @param height - Viewport height in pixels
 * @returns Complete responsive layout configuration
 * 
 * @example
 * ```tsx
 * const layout = useResponsiveLayout(375, 667);
 * 
 * <div style={{
 *   padding: layout.spacing.md,
 *   fontSize: layout.fontSize.body,
 *   minHeight: layout.touchTarget.small,
 * }}>
 *   Mobile-optimized content
 * </div>
 * ```
 * 
 * @public
 * @korean 반응형레이아웃사용
 */
export function useResponsiveLayout(
  width: number,
  height: number
): ResponsiveLayout {
  return useMemo(() => {
    // Device type detection using robust device detection utility
    // Combines user-agent and screen size for reliable mobile detection
    const isMobile = shouldUseMobileControls();
    const isSmallMobile = width <= BREAKPOINTS.MOBILE_SMALL; // Changed to <= to include 375
    const isTablet = width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET && !isMobile;
    const isLandscape = width > height;

    // Safe area insets from device detection utility
    const deviceInsets = getDeviceSafeAreaInsets();
    const safeArea: SafeAreaInsets = {
      top: deviceInsets.top,
      bottom: deviceInsets.bottom,
      left: isLandscape ? deviceInsets.left : 0,
      right: isLandscape ? deviceInsets.right : 0,
    };

    // Touch target sizes (iOS Human Interface Guidelines: 44x44px minimum)
    const touchTarget: TouchTargets = {
      small: 44, // Minimum iOS guideline
      medium: isSmallMobile ? 50 : 60,
      large: isSmallMobile ? 60 : 80,
    };

    // Font sizes optimized for readability
    // Mobile: minimum 14px body, 16px for important text
    const fontSize: FontSizes = {
      small: isSmallMobile ? 12 : 14,
      body: isSmallMobile ? 14 : 16,
      title: isSmallMobile ? 18 : isTablet ? 22 : 24,
      hero: isSmallMobile ? 24 : isTablet ? 32 : 36,
      hud: isSmallMobile ? 16 : isMobile ? 18 : 20, // Scale up on larger mobile/desktop
    };

    // Spacing scale
    const spacing: Spacing = {
      xs: isSmallMobile ? 4 : 8,
      sm: isSmallMobile ? 8 : 12,
      md: isSmallMobile ? 12 : 16,
      lg: isSmallMobile ? 16 : 24,
      xl: isSmallMobile ? 24 : 32,
    };

    return {
      isMobile,
      isSmallMobile,
      isTablet,
      isLandscape,
      safeArea,
      touchTarget,
      fontSize,
      spacing,
      viewport: { width, height },
    };
  }, [width, height]);
}

/**
 * Calculate available content area after safe areas and HUD
 * 
 * @param layout - Responsive layout configuration
 * @param hudHeight - Height reserved for HUD elements
 * @param controlsHeight - Height reserved for control elements
 * @returns Available content dimensions
 */
export function useContentArea(
  layout: ResponsiveLayout,
  hudHeight: number = 0,
  controlsHeight: number = 0
) {
  return useMemo(() => {
    const totalVerticalReserved =
      layout.safeArea.top +
      layout.safeArea.bottom +
      hudHeight +
      controlsHeight +
      layout.spacing.md * 2; // Padding

    const totalHorizontalReserved =
      layout.safeArea.left + layout.safeArea.right + layout.spacing.md * 2;

    return {
      width: layout.viewport.width - totalHorizontalReserved,
      height: layout.viewport.height - totalVerticalReserved,
      x: layout.safeArea.left + layout.spacing.md,
      y: layout.safeArea.top + hudHeight + layout.spacing.md,
    };
  }, [layout, hudHeight, controlsHeight]);
}
