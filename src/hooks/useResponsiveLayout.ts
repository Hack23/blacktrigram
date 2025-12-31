/**
 * useResponsiveLayout Hook - Enhanced Responsive Layout System
 * 
 * Provides comprehensive responsive layout values for all screen sizes with:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Proportional font scaling (0.8x-1.4x) with 14-24px readability constraints
 * - Proportional spacing scaling (0.5x-1.5x)
 * - Smooth transitions for resize operations (300ms ease-in-out)
 * - Touch-friendly element sizing following iOS Human Interface Guidelines
 * - Safe area insets for notch and home indicator
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
 * - Tablet breakpoint support (768-1024px)
 * 
 * @module hooks/useResponsiveLayout
 * @category Mobile UI
 * @korean 반응형레이아웃훅
 */

import { useMemo } from 'react';
import { shouldUseMobileControls, getSafeAreaInsets as getDeviceSafeAreaInsets } from '../utils/deviceDetection';
import {
  RESPONSIVE_BREAKPOINTS,
  getScreenSize,
  calculateResponsiveValues,
  createTransitionString,
} from '../systems/ResponsiveScaling';

import type { ScreenSize } from '../systems/ResponsiveScaling';

/**
 * Breakpoints for responsive design
 * @deprecated Use RESPONSIVE_BREAKPOINTS from ResponsiveScaling instead
 */
export const BREAKPOINTS = {
  /** Extra small mobile devices (iPhone SE) */
  MOBILE_SMALL: 375,
  /** Standard mobile devices */
  MOBILE: RESPONSIVE_BREAKPOINTS.MOBILE,
  /** Tablet devices */
  TABLET: RESPONSIVE_BREAKPOINTS.TABLET,
  /** Desktop devices */
  DESKTOP: RESPONSIVE_BREAKPOINTS.LARGE,
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
  /** Whether current viewport is desktop or larger */
  readonly isDesktop: boolean;
  /** Whether in landscape orientation */
  readonly isLandscape: boolean;
  /** Current screen size category (mobile, tablet, desktop, large, xlarge) */
  readonly screenSize: ScreenSize;
  /** Safe area insets for mobile devices */
  readonly safeArea: SafeAreaInsets;
  /** Touch target sizes */
  readonly touchTarget: TouchTargets;
  /** Font sizes */
  readonly fontSize: FontSizes;
  /** Spacing scale */
  readonly spacing: Spacing;
  /** CSS transition string for smooth resizing */
  readonly transition: string;
  /** Current viewport dimensions */
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Calculate responsive layout values based on viewport dimensions
 * 
 * Enhanced with centralized responsive scaling system:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Proportional font scaling (0.8x-1.4x) with 14-24px constraints
 * - Proportional spacing scaling (0.5x-1.5x)
 * - Smooth CSS transitions for resize operations
 * 
 * Optimized for:
 * - iPhone SE (375x667) - mobile
 * - iPhone 11/12/13 (414x896) - mobile
 * - iPhone 14 Pro Max (430x932) - mobile
 * - iPad (768x1024) - tablet
 * - iPad Pro (1024x1366) - desktop
 * - Standard Desktop (1280x800) - desktop
 * - HD Display (1920x1080) - xlarge
 * - 4K Display (2560x1440) - xlarge
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
 *   transition: layout.transition,
 * }}>
 *   Responsive content
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
    // Determine screen size category using centralized scaling system
    const screenSize = getScreenSize(width);
    
    // Device type detection using robust device detection utility
    // Combines user-agent and screen size for reliable mobile detection
    const isMobile = shouldUseMobileControls();
    const isSmallMobile = width <= BREAKPOINTS.MOBILE_SMALL;
    const isTablet = screenSize === 'tablet';
    const isDesktop = screenSize === 'desktop' || screenSize === 'large' || screenSize === 'xlarge';
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

    // Calculate responsive values using centralized scaling system
    const responsiveValues = calculateResponsiveValues(width);

    // Map to existing font size structure for backward compatibility
    const fontSize: FontSizes = {
      small: responsiveValues.fontSize.small,
      body: responsiveValues.fontSize.body,
      title: responsiveValues.fontSize.title,
      hero: responsiveValues.fontSize.hero,
      hud: responsiveValues.fontSize.hud,
    };

    // Map to existing spacing structure for backward compatibility
    const spacing: Spacing = {
      xs: responsiveValues.spacing.xs,
      sm: responsiveValues.spacing.sm,
      md: responsiveValues.spacing.md,
      lg: responsiveValues.spacing.lg,
      xl: responsiveValues.spacing.xl,
    };

    // Get transition string for smooth resizing
    const transition = createTransitionString();

    return {
      isMobile,
      isSmallMobile,
      isTablet,
      isDesktop,
      isLandscape,
      screenSize,
      safeArea,
      touchTarget,
      fontSize,
      spacing,
      transition,
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
