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
  DESKTOP = "desktop",
  /** Mobile phone (iOS, Android, etc.) */
  MOBILE = "mobile",
  /** Tablet device (iPad, Android tablets) */
  TABLET = "tablet",
}

/**
 * Platform detection results
 */
export interface PlatformInfo {
  /** Operating system type */
  readonly os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
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
    "Android",
    "webOS",
    "iPhone",
    "iPod",
    "BlackBerry",
    "IEMobile",
    "Opera Mini",
    "Mobile",
    "mobile",
  ];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

/**
 * Detect if user-agent indicates a tablet device
 *
 * @param userAgent - Browser user-agent string
 * @returns True if user-agent indicates tablet
 */
function isTabletUserAgent(userAgent: string): boolean {
  if (userAgent.includes("iPad")) {
    return true;
  }

  if (userAgent.includes("Android")) {
    return userAgent.includes("Tablet") || !userAgent.includes("Mobile");
  }

  return false;
}

/**
 * Detect operating system from user-agent
 *
 * @param userAgent - Browser user-agent string
 * @returns Operating system identifier
 */
function detectOS(userAgent: string): PlatformInfo["os"] {
  if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad") ||
    userAgent.includes("iPod")
  ) {
    return "ios";
  }
  if (userAgent.includes("Android")) {
    return "android";
  }
  if (userAgent.includes("Windows")) {
    return "windows";
  }
  if (userAgent.includes("Mac")) {
    const isLikelyIPadOSDesktop =
      typeof navigator !== "undefined" &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1 &&
      userAgent.includes("Macintosh");

    if (isLikelyIPadOSDesktop) {
      return "ios";
    }
    return "macos";
  }
  if (userAgent.includes("Linux")) {
    return "linux";
  }
  return "unknown";
}

/**
 * Detect if device has touch capability
 * Uses multiple methods for reliability
 *
 * @returns True if touch is supported
 */
function hasTouchSupport(): boolean {
  if ("ontouchstart" in window) {
    return true;
  }

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.maxTouchPoints !== "undefined" &&
    navigator.maxTouchPoints > 0
  ) {
    return true;
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches
  ) {
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
 * Cached CSS environment variable insets
 */
let cachedCSSEnvInsets: { top: number; bottom: number } | null = null;

/**
 * Read CSS environment variables for safe area insets
 * Results are cached as they don't change during a session
 */
function readCSSEnvInsets(): { top: number; bottom: number } | null {
  if (cachedCSSEnvInsets !== null) {
    return cachedCSSEnvInsets;
  }

  if (typeof window !== "undefined" && typeof getComputedStyle === "function") {
    try {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      const topEnv = style.getPropertyValue("env(safe-area-inset-top)");
      const bottomEnv = style.getPropertyValue("env(safe-area-inset-bottom)");

      if (topEnv || bottomEnv) {
        const result = {
          top: parseInt(topEnv || "0", 10) || 0,
          bottom: parseInt(bottomEnv || "0", 10) || 0,
        };
        cachedCSSEnvInsets = result;
        return result;
      }
    } catch {
      // intentional: fall through to null
    }
  }

  return null;
}

/**
 * Cached platform information to avoid re-parsing user-agent on every call
 */
let cachedPlatform: PlatformInfo | null = null;
let cachedScreenWidth = 0;
let cachedScreenHeight = 0;

/**
 * Clear the cached platform information
 * Useful when window is resized or device emulation changes
 * Also clears CSS environment variable cache
 *
 */
export function clearPlatformCache(): void {
  cachedPlatform = null;
  cachedScreenWidth = 0;
  cachedScreenHeight = 0;
  cachedCSSEnvInsets = null;
}

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
 * - Android 15/16 devices with 2K/4K resolutions (1200px+, 1440px+)
 * - Tablets (user preference via touch support)
 *
 * **User-agent detection takes priority over screen size**, ensuring that
 * high-end Android phones with desktop-class resolutions (e.g., Galaxy S23 Ultra,
 * Pixel 9 Pro) are correctly identified as mobile devices.
 *
 * Results are cached to avoid re-parsing user-agent on every call.
 * Cache is invalidated when screen dimensions change.
 *
 * @returns Complete platform information
 *
 * @example
 * ```typescript
 * const platform = detectPlatform();
 *
 * if (platform.isMobile) {
 *   // Show mobile controls even on 4K Android phones
 *   return <MobileControls />;
 * }
 * ```
 *
 * @korean 플랫폼감지
 */
export function detectPlatform(): PlatformInfo {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const screenHeight =
    typeof window !== "undefined" ? window.innerHeight : 1080;

  if (
    cachedPlatform !== null &&
    cachedScreenWidth === screenWidth &&
    cachedScreenHeight === screenHeight
  ) {
    return cachedPlatform;
  }

  const os = detectOS(userAgent);
  const hasTouch = hasTouchSupport();
  const isMobileUA = isMobileUserAgent(userAgent);
  const isTabletUA = isTabletUserAgent(userAgent);
  const isMobileBySize = screenWidth <= MOBILE_BREAKPOINT;
  const isTabletBySize =
    screenWidth > MOBILE_BREAKPOINT && screenWidth <= TABLET_BREAKPOINT;

  let deviceType: DeviceType;
  let isMobile: boolean;
  let isTablet: boolean;

  if (isMobileUA && !isTabletUA) {
    deviceType = DeviceType.MOBILE;
    isMobile = true;
    isTablet = false;
  } else if (isTabletUA) {
    deviceType = DeviceType.TABLET;
    isMobile = false;
    isTablet = true;
  } else if (isMobileBySize) {
    deviceType = DeviceType.MOBILE;
    isMobile = true;
    isTablet = false;
  } else if (isTabletBySize && hasTouch) {
    deviceType = DeviceType.TABLET;
    isMobile = false;
    isTablet = true;
  } else {
    deviceType = DeviceType.DESKTOP;
    isMobile = false;
    isTablet = false;
  }

  const isDesktop = deviceType === DeviceType.DESKTOP;

  const result: PlatformInfo = {
    os,
    deviceType,
    hasTouch,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
  };

  cachedPlatform = result;
  cachedScreenWidth = screenWidth;
  cachedScreenHeight = screenHeight;

  return result;
}

/**
 * Simple mobile check for backward compatibility
 * Returns true for both mobile phones and tablets
 *
 * @returns True if device is mobile or tablet
 *
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
 * Uses user-agent detection to correctly identify mobile devices regardless
 * of screen resolution. This ensures high-end Android 15/16 phones with
 * 2K/4K displays (1200px+, 1440px+) show mobile controls.
 *
 * Also ensures tablets and touch-enabled devices always show mobile controls
 * regardless of resolution, for better UX on touch devices.
 *
 * @returns True if mobile controls should be shown
 *
 * @example
 * ```typescript
 * // High-res Android phone (1440x3168) → returns true via user-agent
 * // Desktop with 1440px screen → returns false (no mobile user-agent)
 * // iPad Pro 12.9" (1024x1366) → returns true (tablet user-agent)
 * // Surface Pro in tablet mode → returns true (touch + tablet size)
 * if (shouldUseMobileControls()) {
 *   return <VirtualDPad />; // Touch-optimized controls
 * }
 * ```
 *
 * @korean 모바일컨트롤사용
 */
export function shouldUseMobileControls(): boolean {
  const platform = detectPlatform();

  if (platform.isMobile) {
    return true;
  }

  if (platform.isTablet) {
    return true;
  }

  if (platform.hasTouch && platform.screenWidth <= TABLET_BREAKPOINT) {
    return true;
  }

  if (platform.screenWidth <= MOBILE_BREAKPOINT && platform.hasTouch) {
    return true;
  }

  return false;
}

/**
 * Get safe area insets for device
 * Returns appropriate values based on device type and OS
 *
 * For iOS devices, attempts to detect if device has a notch by checking
 * screen dimensions. Falls back to CSS environment variables if available.
 *
 * @returns Safe area insets in pixels
 *
 * @korean 안전영역인셋
 */
export function getSafeAreaInsets() {
  const platform = detectPlatform();

  if (platform.os === "ios" && platform.isMobile) {
    const cssEnvInsets = readCSSEnvInsets();
    if (cssEnvInsets) {
      return {
        top: cssEnvInsets.top,
        bottom: cssEnvInsets.bottom,
        left: 0,
        right: 0,
      };
    }

    const isLandscape = platform.screenWidth > platform.screenHeight;

    const hasNotch =
      platform.screenHeight >= 812 || platform.screenWidth >= 812;

    if (hasNotch) {
      if (isLandscape) {
        return {
          top: 0,
          bottom: 21,
          left: 44,
          right: 44,
        };
      } else {
        return {
          top: 44,
          bottom: 34,
          left: 0,
          right: 0,
        };
      }
    } else {
      return {
        top: 20,
        bottom: 0,
        left: 0,
        right: 0,
      };
    }
  }

  if (platform.os === "android" && platform.isMobile) {
    return {
      top: 24,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
}
