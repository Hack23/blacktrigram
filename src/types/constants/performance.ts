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
export type PerformanceTier = 'low' | 'medium' | 'high';

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
  readonly dpr: number | readonly [number, number];
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
 * @param screenWidth - Screen width in pixels
 * @param isMobile - Whether device is mobile
 * @returns Performance tier
 * 
 * @example
 * ```typescript
 * getPerformanceTier(320, true);  // 'low' (extra-small mobile)
 * getPerformanceTier(768, false); // 'medium' (tablet)
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
  // Extra-small mobile devices (<380px) are always low tier
  if (isMobile && screenWidth < 380) {
    return 'low';
  }
  
  // Standard mobile and tablets are medium tier
  if (isMobile || screenWidth < 1024) {
    return 'medium';
  }
  
  // Desktop and large displays are high tier
  return 'high';
}

/**
 * Get performance settings for current device
 * 
 * @param screenWidth - Screen width in pixels
 * @param isMobile - Whether device is mobile
 * @returns Performance settings object
 * 
 * @example
 * ```typescript
 * const settings = getPerformanceSettings(375, true);
 * // { maxParticles: 20, shadowMapSize: 512, ... }
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
