/**
 * Mobile UI utilities for responsive touch-optimized interfaces
 * 
 * Provides helpers for touch target sizing, responsive font scaling,
 * and mobile-specific layout calculations following iOS/Android guidelines.
 * 
 * PRIORITY: High-end mobile devices (Super HD, 2K+) are top priority and get:
 * - Enhanced touch targets (56px vs 48px)
 * - Larger Korean fonts (+10% for better readability)
 * - Optimized spacing and layout
 * - Full feature parity with desktop
 * 
 * Supported Devices (Priority Order):
 * 1. Super HD Mobile (≥768px): Motorola Edge 60 Pro, Galaxy S-series
 * 2. Standard Mobile (375-767px): iPhone 12/13/14, standard Android
 * 3. Small Mobile (<375px): iPhone SE, budget devices
 * 
 * @module utils/mobileUIUtils
 * @category Mobile Utilities
 * @korean 모바일UI유틸리티
 */

import { UI_DIMENSIONS, SPACING } from "../types/constants/ui";
import {
  KOREAN_MOBILE_FONT_SIZES,
  getKoreanFontSize,
} from "../types/constants/typography";

/**
 * Viewport size category for responsive design
 * 
 * @category Mobile UI
 * @korean 뷰포트크기범주
 */
export type ViewportSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Touch target size configuration
 * 
 * @category Mobile UI
 * @korean 터치타겟크기설정
 */
export interface TouchTargetSize {
  readonly minWidth: number;
  readonly minHeight: number;
  readonly padding: number;
  readonly spacing: number;
}

/**
 * Get viewport size category from width
 * 
 * PRIORITY: High-end mobile devices (Super HD, 2K+) are treated as 'md' for optimal layout
 * 
 * @param width - Viewport width in pixels
 * @returns Viewport size category
 * 
 * @example
 * ```typescript
 * getViewportSize(375); // 'xs' (iPhone SE)
 * getViewportSize(768); // 'sm' (Standard phones, high-end mobiles start here)
 * getViewportSize(2712); // 'md' (Motorola Edge 60 Pro Super HD)
 * getViewportSize(1200); // 'lg' (Desktop)
 * ```
 * 
 * @public
 * @korean 뷰포트크기얻기
 */
export function getViewportSize(width: number): ViewportSize {
  if (width < 375) return "xs"; // Extra small phones
  if (width < 768) return "sm"; // Standard phones
  if (width < 1024) return "md"; // High-end mobile (Super HD), tablets
  if (width < 1440) return "lg"; // Small desktop
  return "xl"; // Large desktop
}

/**
 * Get touch-optimized button size configuration
 * Ensures minimum 48px touch targets per iOS/Android guidelines
 * 
 * PRIORITY: High-end mobile devices (Super HD, 2K+) get enhanced touch targets (56px)
 * for better precision on high-resolution displays
 * 
 * @param isMobile - Whether on mobile device
 * @param viewportWidth - Optional viewport width for fine-tuning
 * @returns Touch target size configuration
 * 
 * @example
 * ```typescript
 * const buttonSize = getTouchTargetSize(true, 375);
 * // { minWidth: 48, minHeight: 48, padding: 12, spacing: 8 }
 * 
 * const superHDButtonSize = getTouchTargetSize(true, 2712);
 * // { minWidth: 56, minHeight: 56, padding: 16, spacing: 12 }
 * ```
 * 
 * @public
 * @korean 터치타겟크기얻기
 */
export function getTouchTargetSize(
  isMobile: boolean,
  viewportWidth?: number
): TouchTargetSize {
  if (!isMobile) {
    return {
      minWidth: 120,
      minHeight: 44,
      padding: SPACING.MD,
      spacing: SPACING.MD,
    };
  }

  const width = viewportWidth ?? 375;
  const isExtraSmall = width < 360;
  const isSuperHD = width >= 768; // High-end mobile (Motorola Edge 60 Pro, etc.)

  // Super HD devices get enhanced touch targets for better precision
  if (isSuperHD) {
    return {
      minWidth: UI_DIMENSIONS.TOUCH_TARGET_COMFORTABLE,
      minHeight: UI_DIMENSIONS.TOUCH_TARGET_COMFORTABLE,
      padding: SPACING.MD,
      spacing: SPACING.COMPACT,
    };
  }

  return {
    minWidth: UI_DIMENSIONS.TOUCH_TARGET_MIN,
    minHeight: UI_DIMENSIONS.TOUCH_TARGET_MIN,
    padding: isExtraSmall ? SPACING.SM : SPACING.COMPACT,
    spacing: UI_DIMENSIONS.TOUCH_TARGET_SPACING,
  };
}

/**
 * Get responsive Korean font size for mobile
 * Ensures minimum 16px for body text on mobile
 * 
 * PRIORITY: High-end mobile (Super HD, 2K+) get enhanced font sizes for better readability
 * 
 * @param size - Size category ('SMALL', 'MEDIUM', 'LARGE')
 * @param viewportWidth - Viewport width in pixels
 * @returns Font size in pixels
 * 
 * @example
 * ```typescript
 * getMobileKoreanFontSize('SMALL', 375); // 16
 * getMobileKoreanFontSize('MEDIUM', 410); // 18
 * getMobileKoreanFontSize('MEDIUM', 2712); // 20 (Super HD enhanced)
 * getMobileKoreanFontSize('LARGE', 768); // 24
 * ```
 * 
 * @public
 * @korean 모바일한글글꼴크기얻기
 */
export function getMobileKoreanFontSize(
  size: keyof typeof KOREAN_MOBILE_FONT_SIZES,
  viewportWidth: number
): number {
  const fontSize = getKoreanFontSize(size, viewportWidth);
  
  // Super HD mobile devices (≥768px) get enhanced font sizes
  // for better readability on high-resolution displays
  if (viewportWidth >= 768) {
    return Math.ceil(fontSize * 1.1); // 10% larger for Super HD
  }
  
  return fontSize;
}

/**
 * Get responsive spacing value
 * Scales spacing based on viewport size
 * 
 * @param baseSpacing - Base spacing value from SPACING constant
 * @param isMobile - Whether on mobile device
 * @returns Scaled spacing in pixels
 * 
 * @example
 * ```typescript
 * getResponsiveSpacing(SPACING.MD, true); // 12 (COMPACT on mobile)
 * getResponsiveSpacing(SPACING.MD, false); // 16 (original)
 * ```
 * 
 * @public
 * @korean 반응형간격얻기
 */
export function getResponsiveSpacing(
  baseSpacing: number,
  isMobile: boolean
): number {
  return isMobile ? Math.max(SPACING.SM, baseSpacing * 0.75) : baseSpacing;
}

/**
 * Calculate responsive panel width
 * Ensures panels fit within viewport with proper margins
 * 
 * @param viewportWidth - Viewport width in pixels
 * @param isMobile - Whether on mobile device
 * @param minMargin - Minimum margin on each side (default: 20px)
 * @returns Panel width in pixels
 * 
 * @example
 * ```typescript
 * getResponsivePanelWidth(375, true); // ~335px (375 - 40 margin)
 * getResponsivePanelWidth(1200, false); // ~400px (max width applied)
 * ```
 * 
 * @public
 * @korean 반응형패널폭얻기
 */
export function getResponsivePanelWidth(
  viewportWidth: number,
  isMobile: boolean,
  minMargin = 20
): number {
  if (!isMobile) {
    return Math.min(400, viewportWidth - minMargin * 2);
  }

  // Mobile: use most of screen width
  return Math.min(viewportWidth - minMargin * 2, 360);
}

/**
 * Check if viewport is in landscape orientation
 * 
 * @param viewportWidth - Viewport width in pixels
 * @param viewportHeight - Viewport height in pixels
 * @returns Whether in landscape orientation
 * 
 * @example
 * ```typescript
 * isLandscape(812, 375); // true (iPhone X landscape)
 * isLandscape(375, 812); // false (iPhone X portrait)
 * ```
 * 
 * @public
 * @korean 가로모드여부
 */
export function isLandscape(
  viewportWidth: number,
  viewportHeight: number
): boolean {
  return viewportWidth > viewportHeight;
}

/**
 * Get responsive button styles for touch optimization
 * 
 * @param isMobile - Whether on mobile device
 * @param viewportWidth - Optional viewport width
 * @returns CSS properties for button
 * 
 * @example
 * ```typescript
 * const buttonStyles = getResponsiveButtonStyles(true, 375);
 * // {
 * //   minWidth: '48px',
 * //   minHeight: '48px',
 * //   padding: '12px',
 * //   fontSize: '16px',
 * //   ...
 * // }
 * ```
 * 
 * @public
 * @korean 반응형버튼스타일얻기
 */
export function getResponsiveButtonStyles(
  isMobile: boolean,
  viewportWidth?: number
): React.CSSProperties {
  const touchTarget = getTouchTargetSize(isMobile, viewportWidth);
  const fontSize = isMobile
    ? getMobileKoreanFontSize("SMALL", viewportWidth ?? 375)
    : 16;

  return {
    minWidth: `${touchTarget.minWidth}px`,
    minHeight: `${touchTarget.minHeight}px`,
    padding: `${touchTarget.padding}px`,
    fontSize: `${fontSize}px`,
    lineHeight: "1.4",
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
  };
}

/**
 * Get responsive text styles with proper Korean font sizing
 * 
 * @param size - Font size category
 * @param isMobile - Whether on mobile device
 * @param viewportWidth - Viewport width in pixels
 * @returns CSS properties for text
 * 
 * @example
 * ```typescript
 * const textStyles = getResponsiveTextStyles('MEDIUM', true, 375);
 * // {
 * //   fontSize: '18px',
 * //   lineHeight: '1.5',
 * //   letterSpacing: '0.02em',
 * // }
 * ```
 * 
 * @public
 * @korean 반응형텍스트스타일얻기
 */
export function getResponsiveTextStyles(
  size: keyof typeof KOREAN_MOBILE_FONT_SIZES,
  isMobile: boolean,
  viewportWidth: number
): React.CSSProperties {
  const fontSize = isMobile
    ? getMobileKoreanFontSize(size, viewportWidth)
    : KOREAN_MOBILE_FONT_SIZES[size].regular;

  return {
    fontSize: `${fontSize}px`,
    lineHeight: isMobile ? "1.5" : "1.4",
    letterSpacing: "0.02em",
  };
}

/**
 * Calculate minimum spacing between interactive elements
 * Ensures adequate spacing for touch accuracy
 * 
 * @param isMobile - Whether on mobile device
 * @returns Minimum spacing in pixels
 * 
 * @example
 * ```typescript
 * getMinimumInteractiveSpacing(true); // 8px (mobile)
 * getMinimumInteractiveSpacing(false); // 12px (desktop)
 * ```
 * 
 * @public
 * @korean 최소상호작용간격얻기
 */
export function getMinimumInteractiveSpacing(isMobile: boolean): number {
  return isMobile
    ? UI_DIMENSIONS.TOUCH_TARGET_SPACING
    : SPACING.COMPACT;
}

/**
 * Viewport detection utilities
 * 
 * PRIORITY: High-end mobile devices (Super HD, 2K+) are explicitly supported
 * 
 * @category Mobile UI
 * @korean 뷰포트감지
 */
export const ViewportDetection = {
  /**
   * Check if iPhone SE or similar small device
   * @korean iPhone SE여부
   */
  isSmallMobile: (width: number) => width <= 375,

  /**
   * Check if standard mobile device (excluding high-end)
   * @korean 표준모바일여부
   */
  isMobile: (width: number) => width < 768,

  /**
   * Check if high-end mobile device (Super HD, 2K+)
   * Uses height + DPR to distinguish phones from tablets
   * High-end phones: short side 400-600px, long side >=800px, DPR >=2
   * @korean 고급모바일여부
   */
  isSuperHDMobile: (width: number, height: number = window.innerHeight) => {
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);
    const dpr = window.devicePixelRatio || 1;
    return shortSide >= 400 && shortSide <= 600 && longSide >= 800 && dpr >= 2;
  },

  /**
   * Check if tablet device
   * @korean 태블릿여부
   */
  isTablet: (width: number) => width >= 768 && width < 1024,

  /**
   * Check if desktop device
   * @korean 데스크톱여부
   */
  isDesktop: (width: number) => width >= 1024,

  /**
   * Check if device has notch (iPhone X+)
   * @korean 노치여부
   */
  hasNotch: (width: number, height: number) =>
    (width === 375 && height === 812) || // iPhone X, XS, 11 Pro
    (width === 414 && height === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
    (width === 390 && height === 844) || // iPhone 12, 12 Pro, 13, 13 Pro, 14
    (width === 393 && height === 852) || // iPhone 14 Pro
    (width === 428 && height === 926), // iPhone 12/13/14 Pro Max
} as const;
