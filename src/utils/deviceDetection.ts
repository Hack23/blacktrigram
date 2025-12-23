/**
 * Device Detection Utility
 * 
 * Provides robust mobile device detection combining:
 * - User-agent string analysis
 * - Screen size detection
 * - Touch capability detection
 * 
 * This ensures mobile controls are shown on all mobile devices,
 * including high-resolution phones that exceed typical mobile breakpoints.
 * 
 * @module utils/deviceDetection
 * @category Mobile
 * @korean 기기감지유틸리티
 */

/**
 * Device type classification
 */
export enum DeviceType {
  /** Desktop computer or laptop */
  DESKTOP = 'desktop',
  /** Mobile phone (iOS, Android, etc.) */
  MOBILE = 'mobile',
  /** Tablet device (iPad, Android tablets) */
  TABLET = 'tablet',
}

/**
 * Platform detection results
 */
export interface PlatformInfo {
  /** Operating system type */
  readonly os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  /** Device type classification */
  readonly deviceType: DeviceType;
  /** Whether device has touch capability */
  readonly hasTouch: boolean;
  /** Whether device is mobile phone */
  readonly isMobile: boolean;
  /** Whether device is tablet */
  readonly isTablet: boolean;
  /** Whether device is desktop */
  readonly isDesktop: boolean;
  /** Screen width in pixels */
  readonly screenWidth: number;
  /** Screen height in pixels */
  readonly screenHeight: number;
}

/**
 * Detect if user-agent indicates a mobile device
 * Checks for common mobile device identifiers in user-agent string
 * 
 * @param userAgent - Browser user-agent string
 * @returns True if user-agent indicates mobile device
 */
function isMobileUserAgent(userAgent: string): boolean {
  const mobileKeywords = [
    'Android',
    'webOS',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'IEMobile',
    'Opera Mini',
    'Mobile',
    'mobile',
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

/**
 * Detect if user-agent indicates a tablet device
 * 
 * @param userAgent - Browser user-agent string
 * @returns True if user-agent indicates tablet
 */
function isTabletUserAgent(userAgent: string): boolean {
  // iPad is always a tablet
  if (userAgent.includes('iPad')) {
    return true;
  }
  
  // Android tablets typically include "Tablet" or have Mobile absent
  if (userAgent.includes('Android')) {
    return userAgent.includes('Tablet') || !userAgent.includes('Mobile');
  }
  
  return false;
}

/**
 * Detect operating system from user-agent
 * 
 * @param userAgent - Browser user-agent string
 * @returns Operating system identifier
 */
function detectOS(userAgent: string): PlatformInfo['os'] {
  if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    return 'ios';
  }
  if (userAgent.includes('Android')) {
    return 'android';
  }
  if (userAgent.includes('Windows')) {
    return 'windows';
  }
  if (userAgent.includes('Mac')) {
    return 'macos';
  }
  if (userAgent.includes('Linux')) {
    return 'linux';
  }
  return 'unknown';
}

/**
 * Detect if device has touch capability
 * Uses multiple methods for reliability
 * 
 * @returns True if touch is supported
 */
function hasTouchSupport(): boolean {
  // Check for touch events support
  if ('ontouchstart' in window) {
    return true;
  }
  
  // Check for touch points (must be defined and > 0)
  if (typeof navigator !== 'undefined' && 
      typeof navigator.maxTouchPoints !== 'undefined' && 
      navigator.maxTouchPoints > 0) {
    return true;
  }
  
  // Check for pointer events with touch
  if (typeof window !== 'undefined' &&
      window.matchMedia && 
      window.matchMedia('(pointer: coarse)').matches) {
    return true;
  }
  
  return false;
}

/**
 * Mobile screen size breakpoint
 * Devices with width <= this value are considered mobile by size
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * Tablet screen size breakpoint
 * Devices with width > MOBILE_BREAKPOINT and <= TABLET_BREAKPOINT are tablets
 */
export const TABLET_BREAKPOINT = 1024;

/**
 * Detect device type and platform information
 * 
 * Combines multiple detection methods for reliability:
 * 1. User-agent string analysis (most reliable for device type)
 * 2. Screen dimensions
 * 3. Touch capability
 * 
 * This ensures mobile controls are shown on:
 * - Standard mobile phones (< 768px width)
 * - High-resolution phones (>= 768px width but mobile user-agent)
 * - Tablets (user preference via touch support)
 * 
 * @returns Complete platform information
 * 
 * @example
 * ```typescript
 * const platform = detectPlatform();
 * 
 * if (platform.isMobile) {
 *   // Show mobile controls
 *   return <MobileControls />;
 * }
 * ```
 * 
 * @public
 * @korean 플랫폼감지
 */
export function detectPlatform(): PlatformInfo {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  
  // Detect OS
  const os = detectOS(userAgent);
  
  // Detect touch capability
  const hasTouch = hasTouchSupport();
  
  // Detect if mobile by user-agent (most reliable method)
  const isMobileUA = isMobileUserAgent(userAgent);
  
  // Detect if tablet by user-agent
  const isTabletUA = isTabletUserAgent(userAgent);
  
  // Detect by screen size (fallback method)
  const isMobileBySize = screenWidth <= MOBILE_BREAKPOINT;
  const isTabletBySize = screenWidth > MOBILE_BREAKPOINT && screenWidth <= TABLET_BREAKPOINT;
  
  // Determine device type
  // Priority: User-agent > Screen size
  let deviceType: DeviceType;
  let isMobile: boolean;
  let isTablet: boolean;
  
  if (isMobileUA && !isTabletUA) {
    // User-agent indicates phone
    deviceType = DeviceType.MOBILE;
    isMobile = true;
    isTablet = false;
  } else if (isTabletUA) {
    // User-agent indicates tablet
    deviceType = DeviceType.TABLET;
    isMobile = false;
    isTablet = true;
  } else if (isMobileBySize) {
    // Small screen, assume mobile
    deviceType = DeviceType.MOBILE;
    isMobile = true;
    isTablet = false;
  } else if (isTabletBySize && hasTouch) {
    // Medium screen with touch, assume tablet
    deviceType = DeviceType.TABLET;
    isMobile = false;
    isTablet = true;
  } else {
    // Desktop
    deviceType = DeviceType.DESKTOP;
    isMobile = false;
    isTablet = false;
  }
  
  const isDesktop = deviceType === DeviceType.DESKTOP;
  
  return {
    os,
    deviceType,
    hasTouch,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
  };
}

/**
 * Simple mobile check for backward compatibility
 * Returns true for both mobile phones and tablets
 * 
 * @returns True if device is mobile or tablet
 * 
 * @public
 * @korean 모바일확인
 */
export function isMobileDevice(): boolean {
  const platform = detectPlatform();
  return platform.isMobile || platform.isTablet;
}

/**
 * Check if device should use mobile controls
 * Takes into account device type, screen size, and touch capability
 * 
 * @returns True if mobile controls should be shown
 * 
 * @public
 * @korean 모바일컨트롤사용
 */
export function shouldUseMobileControls(): boolean {
  const platform = detectPlatform();
  
  // Always use mobile controls on phones
  if (platform.isMobile) {
    return true;
  }
  
  // Use mobile controls on tablets (better touch experience)
  if (platform.isTablet) {
    return true;
  }
  
  // Use mobile controls on small desktop screens with touch
  if (platform.screenWidth <= MOBILE_BREAKPOINT && platform.hasTouch) {
    return true;
  }
  
  return false;
}

/**
 * Get safe area insets for device
 * Returns appropriate values based on device type and OS
 * 
 * @returns Safe area insets in pixels
 * 
 * @public
 * @korean 안전영역인셋
 */
export function getSafeAreaInsets() {
  const platform = detectPlatform();
  
  // iOS devices with notch (iPhone X and later)
  if (platform.os === 'ios' && platform.isMobile) {
    return {
      top: 44,
      bottom: 34,
      left: 0,
      right: 0,
    };
  }
  
  // Android devices (standard status bar)
  if (platform.os === 'android' && platform.isMobile) {
    return {
      top: 24,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
  
  // Tablets and desktop - no safe area needed
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
}
