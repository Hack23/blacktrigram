/**
 * Performance constants and optimization settings for Black Trigram
 * 
 * Optimized settings for different device categories to maintain 60fps target
 * Special attention to low-end mobile devices (<380px, older hardware)
 * 
 * @module types/constants/performance
 * @category Performance
 * @korean 성능설정상수
 */

/**
 * Performance tier levels based on device capabilities
 * 
 * @category Performance
 * @korean 성능등급
 */
export type PerformanceTier = 'low' | 'medium' | 'high' | 'mobile-high';

/**
 * Performance settings for different device tiers
 * Balances visual quality with frame rate targets
 * 
 * @category Performance
 * @korean 성능설정
 */
export interface PerformanceSettings {
  /** Maximum particle count for effects */
  readonly maxParticles: number;
  /** Shadow map resolution (512, 1024, 2048) */
  readonly shadowMapSize: number;
  /** Enable antialiasing */
  readonly antialias: boolean;
  /** Device pixel ratio limit ([min, max] or single value) */
  readonly dpr: number | [number, number];
  /** Enable post-processing effects */
  readonly postProcessing: boolean;
  /** Target frame rate (fps) */
  readonly targetFPS: number;
}

/**
 * Performance settings by tier
 * 
 * Low tier: Extra-small mobile (<380px), older devices, budget hardware
 * Medium tier: Standard mobile (380-768px), tablets
 * Mobile-high tier: High-resolution mobile devices (≥768px, 2K+, Motorola Edge, etc.)
 * High tier: Desktop, large displays, modern hardware
 * 
 * @constant
 * @category Performance
 * @korean 성능등급별설정
 */
export const PERFORMANCE_SETTINGS_BY_TIER: Record<PerformanceTier, PerformanceSettings> = {
  low: {
    maxParticles: 20,
    shadowMapSize: 512,
    antialias: false, // Disable AA for performance
    dpr: 1, // Cap at 1x for low-end devices
    postProcessing: false,
    targetFPS: 50, // Realistic target for low-end
  },
  medium: {
    maxParticles: 40,
    shadowMapSize: 1024,
    antialias: true,
    dpr: [1, 2], // Allow up to 2x
    postProcessing: false, // Keep disabled for mobile
    targetFPS: 55,
  },
  'mobile-high': {
    maxParticles: 50, // Between medium and high
    shadowMapSize: 1536, // Between 1024 and 2048
    antialias: true,
    dpr: [1, 3.5], // Support up to 3.5x for Super HD displays (2712x1220)
    postProcessing: false, // Keep disabled for mobile battery life
    targetFPS: 55, // Realistic for high-end mobile
  },
  high: {
    maxParticles: 100,
    shadowMapSize: 2048,
    antialias: true,
    dpr: [1, 2],
    postProcessing: true,
    targetFPS: 60,
  },
} as const;

/**
 * Determine performance tier based on device characteristics
 * 
 * Now properly handles high-resolution mobile devices (Motorola Edge 60 Pro, etc.)
 * by checking isMobile flag before using screen width to determine tier.
 * 
 * @param screenWidth - Screen width in pixels
 * @param isMobile - Whether device is mobile (from user-agent detection)
 * @returns Performance tier
 * 
 * @example
 * ```typescript
 * getPerformanceTier(320, true);   // 'low' (extra-small mobile)
 * getPerformanceTier(768, true);   // 'medium' (standard mobile)
 * getPerformanceTier(2712, true);  // 'mobile-high' (Motorola Edge 60 Pro, 2K+ mobile)
 * getPerformanceTier(768, false);  // 'medium' (tablet)
 * getPerformanceTier(1920, false); // 'high' (desktop)
 * ```
 * 
 * @public
 * @korean 성능등급결정
 */
export function getPerformanceTier(
  screenWidth: number,
  isMobile: boolean
): PerformanceTier {
  // Mobile device tiers (user-agent detection takes priority)
  if (isMobile) {
    // Extra-small mobile devices (<380px) are always low tier
    if (screenWidth < 380) {
      return 'low';
    }
    
    // High-resolution mobile devices (≥768px, 2K+ displays like Motorola Edge 60 Pro)
    // Get optimized settings for Super HD mobile displays
    if (screenWidth >= 768) {
      return 'mobile-high';
    }
    
    // Standard mobile devices (380-768px)
    return 'medium';
  }
  
  // Non-mobile devices (tablets and desktop)
  if (screenWidth < 1024) {
    return 'medium'; // Tablet tier
  }
  
  // Desktop and large displays are high tier
  return 'high';
}

/**
 * Get performance settings for current device
 * 
 * Properly handles high-resolution mobile devices (2K+, Super HD) by using
 * the isMobile flag from user-agent detection before screen width classification.
 * 
 * This ensures devices like Motorola Edge 60 Pro (2712x1220) get mobile-optimized
 * settings with proper dpr support up to 3.5x for their Super HD displays.
 * 
 * @param screenWidth - Screen width in pixels
 * @param isMobile - Whether device is mobile (from user-agent detection)
 * @returns Performance settings object
 * 
 * @example
 * ```typescript
 * // Standard mobile (iPhone SE)
 * const settings = getPerformanceSettings(375, true);
 * // { maxParticles: 40, shadowMapSize: 1024, dpr: [1, 2], ... }
 * 
 * // High-res mobile (Motorola Edge 60 Pro)
 * const settingsHD = getPerformanceSettings(2712, true);
 * // { maxParticles: 50, shadowMapSize: 1536, dpr: [1, 3.5], ... }
 * 
 * // Desktop
 * const settingsDesktop = getPerformanceSettings(1920, false);
 * // { maxParticles: 100, shadowMapSize: 2048, dpr: [1, 2], ... }
 * 
 * <Canvas
 *   dpr={settings.dpr}
 *   gl={{ antialias: settings.antialias }}
 * />
 * ```
 * 
 * @public
 * @korean 성능설정얻기
 */
export function getPerformanceSettings(
  screenWidth: number,
  isMobile: boolean
): PerformanceSettings {
  const tier = getPerformanceTier(screenWidth, isMobile);
  return PERFORMANCE_SETTINGS_BY_TIER[tier];
}

/**
 * Frame time budget in milliseconds for target FPS
 * 
 * @constant
 * @category Performance
 * @korean 프레임시간예산
 */
export const FRAME_TIME_BUDGET = {
  /** 60fps = 16.67ms per frame */
  FPS_60: 16.67,
  /** 55fps = 18.18ms per frame */
  FPS_55: 18.18,
  /** 50fps = 20ms per frame */
  FPS_50: 20,
  /** 30fps = 33.33ms per frame (minimum acceptable) */
  FPS_30: 33.33,
} as const;

/**
 * Performance optimization thresholds for mobile
 * 
 * Target values for mobile performance optimization:
 * - FPS: 55+ sustained during combat
 * - Draw calls: <100 per frame
 * - Memory: <200MB heap usage
 * - Particle count: 50% of desktop
 * 
 * @constant
 * @category Performance
 * @korean 모바일성능임계값
 */
export const MOBILE_PERFORMANCE_THRESHOLDS = {
  /** Target FPS for mobile devices */
  targetFPS: 55,
  /** Minimum acceptable FPS before quality downgrade */
  minAcceptableFPS: 45,
  /** Maximum draw calls per frame */
  maxDrawCalls: 100,
  /** Maximum memory usage in MB */
  maxMemoryMB: 200,
  /** Particle count reduction factor (0.5 = 50% of desktop) */
  particleReduction: 0.5,
  /** Shadow map size for mobile */
  shadowMapSize: 512,
} as const;

/**
 * Desktop performance thresholds
 * 
 * @constant
 * @category Performance
 * @korean 데스크톱성능임계값
 */
export const DESKTOP_PERFORMANCE_THRESHOLDS = {
  /** Target FPS for desktop */
  targetFPS: 60,
  /** Minimum acceptable FPS before quality downgrade */
  minAcceptableFPS: 55,
  /** Maximum draw calls per frame */
  maxDrawCalls: 150,
  /** Maximum memory usage in MB */
  maxMemoryMB: 300,
  /** Particle count reduction factor (1.0 = full desktop quality) */
  particleReduction: 1.0,
  /** Shadow map size for desktop */
  shadowMapSize: 2048,
} as const;
