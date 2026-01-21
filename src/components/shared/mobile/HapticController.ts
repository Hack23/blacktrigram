/**
 * HapticController
 * 
 * Optimized haptic feedback system with device capability detection
 * Provides differentiated haptic patterns without causing frame drops
 * 
 * Key Features:
 * - Device capability detection (auto-disable on low-end devices)
 * - Differentiated feedback intensities (light, medium, strong)
 * - Frame-drop prevention (<2ms overhead)
 * - Adaptive patterns based on device performance
 * - Throttling to prevent excessive haptic triggers
 * 
 * Browser Compatibility Note:
 * navigator.vibrate() returns boolean in some browsers (Chrome, Edge) and void in others (Firefox).
 * This implementation normalizes return values to boolean for consistency.
 * 
 * @module components/mobile/HapticController
 * @category Mobile Controls
 * @korean 햅틱 컨트롤러
 */

/**
 * Haptic intensity levels
 */
export type HapticIntensity = 'light' | 'medium' | 'strong' | 'disabled';

/**
 * Device performance tier
 */
export type DevicePerformanceTier = 'high' | 'medium' | 'low';

/**
 * Haptic pattern configuration
 */
interface HapticPattern {
  readonly vibration: number | number[];
  readonly maxFrameTime: number; // Maximum frame time impact in ms
}

/**
 * Optimized haptic patterns for different intensities
 * Designed to provide clear feedback without frame drops
 * 
 * @korean 햅틱 패턴
 */
const HAPTIC_PATTERNS: Record<HapticIntensity, HapticPattern> = {
  light: {
    vibration: [20], // Short, crisp tap
    maxFrameTime: 0.5, // Minimal impact
  },
  medium: {
    vibration: [40], // Medium pulse
    maxFrameTime: 1.0, // Small impact
  },
  strong: {
    vibration: [60], // Strong pulse
    maxFrameTime: 2.0, // Noticeable impact
  },
  disabled: {
    vibration: [],
    maxFrameTime: 0,
  },
} as const;

/**
 * Adaptive haptic patterns for low-end devices
 * Reduced intensities to prevent frame drops
 * 
 * @korean 적응형 햅틱 패턴
 */
const ADAPTIVE_HAPTIC_PATTERNS: Record<HapticIntensity, HapticPattern> = {
  light: {
    vibration: [10], // Minimal vibration
    maxFrameTime: 0.2,
  },
  medium: {
    vibration: [20], // Reduced medium
    maxFrameTime: 0.5,
  },
  strong: {
    vibration: [30], // Reduced strong
    maxFrameTime: 1.0,
  },
  disabled: {
    vibration: [],
    maxFrameTime: 0,
  },
} as const;

/**
 * HapticController class
 * Manages haptic feedback with device-aware optimization
 * 
 * @public
 * @korean 햅틱컨트롤러
 */
export class HapticController {
  private static instance: HapticController | null = null;
  private isSupported: boolean = false;
  private isEnabled: boolean = true;
  private performanceTier: DevicePerformanceTier = 'high';
  /**
   * Last trigger timestamp for throttling.
   * Initialized to -Infinity to ensure the first trigger always succeeds.
   * Using -Infinity instead of 0 prevents throttling when performance.now() returns 0,
   * which can occur in test environments or immediately after page load.
   */
  private lastTriggerTime: number = -Infinity;
  private minTriggerInterval: number = 50; // Minimum 50ms between haptics

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.isSupported = this.detectHapticSupport();
    this.performanceTier = this.detectPerformanceTier();
    
    // Disable haptics on low-end devices by default
    if (this.performanceTier === 'low') {
      this.isEnabled = false;
    }
  }

  /**
   * Get singleton instance
   * 
   * @returns HapticController instance
   * @korean 인스턴스가져오기
   */
  public static getInstance(): HapticController {
    this.instance ??= new HapticController();
    return this.instance;
  }

  /**
   * Detect if haptic feedback is supported
   * 
   * @returns True if Vibration API is available
   * @korean 햅틱지원감지
   */
  private detectHapticSupport(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }

    // Check for Vibration API
    return 'vibrate' in navigator;
  }

  /**
   * Detect device performance tier
   * Uses multiple heuristics to determine device capability
   * 
   * @returns Performance tier (high, medium, low)
   * @korean 성능등급감지
   */
  private detectPerformanceTier(): DevicePerformanceTier {
    if (typeof navigator === 'undefined') {
      return 'medium';
    }

    // Check navigator.hardwareConcurrency (CPU cores)
    const cores = navigator.hardwareConcurrency ?? 4;
    
    // Check device memory (if available)
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    
    // Check if running on mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Heuristic scoring
    let score = 0;
    
    // More cores = better performance
    if (cores >= 8) score += 2;
    else if (cores >= 4) score += 1;
    
    // More memory = better performance
    if (memory >= 8) score += 2;
    else if (memory >= 4) score += 1;
    
    // Desktop generally performs better
    if (!isMobile) score += 1;
    
    // Determine tier
    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  /**
   * Trigger haptic feedback with optimized patterns
   * 
   * @param intensity - Haptic intensity level
   * @returns True if haptic was triggered
   * @korean 햅틱실행
   * 
   * @example
   * ```typescript
   * const haptic = HapticController.getInstance();
   * 
   * // Light haptic for button tap
   * haptic.trigger('light');
   * 
   * // Strong haptic for critical hit
   * haptic.trigger('strong');
   * ```
   * 
   * @public
   */
  public trigger(intensity: HapticIntensity): boolean {
    // Check if haptics are supported and enabled
    if (!this.isSupported || !this.isEnabled || intensity === 'disabled') {
      return false;
    }

    // Throttle haptic triggers to prevent excessive vibration
    const now = performance.now();
    if (now - this.lastTriggerTime < this.minTriggerInterval) {
      return false;
    }
    this.lastTriggerTime = now;

    // Select pattern based on device performance
    const patterns = this.performanceTier === 'low' 
      ? ADAPTIVE_HAPTIC_PATTERNS 
      : HAPTIC_PATTERNS;
    
    const pattern = patterns[intensity];

    try {
      // Trigger vibration (see class-level comment for browser compatibility notes)
      const result = navigator.vibrate(pattern.vibration);
      return result !== false; // Return true if not explicitly false
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  }

  /**
   * Trigger custom haptic pattern
   * 
   * @param pattern - Custom vibration pattern
   * @returns True if haptic was triggered
   * @korean 커스텀햅틱실행
   * 
   * @example
   * ```typescript
   * const haptic = HapticController.getInstance();
   * 
   * // Custom combo pattern
   * haptic.triggerCustom([30, 20, 30, 20, 50]);
   * ```
   * 
   * @public
   */
  public triggerCustom(pattern: number | number[]): boolean {
    if (!this.isSupported || !this.isEnabled) {
      return false;
    }

    // Throttle haptic triggers
    const now = performance.now();
    if (now - this.lastTriggerTime < this.minTriggerInterval) {
      return false;
    }
    this.lastTriggerTime = now;

    try {
      // Adapt pattern for low-end devices (reduce durations by 50%)
      let adaptedPattern = pattern;
      if (this.performanceTier === 'low') {
        if (Array.isArray(pattern)) {
          adaptedPattern = pattern.map(duration => Math.floor(duration * 0.5));
        } else {
          adaptedPattern = Math.floor(pattern * 0.5);
        }
      }

      // Trigger vibration (see class-level comment for browser compatibility notes)
      const result = navigator.vibrate(adaptedPattern);
      return result !== false; // Return true if not explicitly false
    } catch (error) {
      console.warn('Custom haptic feedback failed:', error);
      return false;
    }
  }

  /**
   * Stop any ongoing haptic feedback
   * 
   * @returns True if haptic was stopped
   * @korean 햅틱중지
   * 
   * @public
   */
  public stop(): boolean {
    if (!this.isSupported) {
      return false;
    }

    try {
      // Stop vibration (see class-level comment for browser compatibility notes)
      const result = navigator.vibrate(0);
      return result !== false; // Return true if not explicitly false
    } catch (error) {
      console.warn('Failed to stop haptic feedback:', error);
      return false;
    }
  }

  /**
   * Enable haptic feedback
   * 
   * @korean 햅틱활성화
   * @public
   */
  public enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable haptic feedback
   * 
   * @korean 햅틱비활성화
   * @public
   */
  public disable(): void {
    this.isEnabled = false;
    this.stop();
  }

  /**
   * Check if haptic is currently enabled
   * 
   * @returns True if haptic is enabled
   * @korean 햅틱활성화상태
   * @public
   */
  public isHapticEnabled(): boolean {
    return this.isSupported && this.isEnabled;
  }

  /**
   * Get current device performance tier
   * 
   * @returns Performance tier
   * @korean 성능등급가져오기
   * @public
   */
  public getPerformanceTier(): DevicePerformanceTier {
    return this.performanceTier;
  }

  /**
   * Set minimum interval between haptic triggers
   * 
   * @param intervalMs - Minimum interval in milliseconds
   * @korean 최소간격설정
   * @public
   */
  public setMinTriggerInterval(intervalMs: number): void {
    this.minTriggerInterval = Math.max(0, intervalMs);
  }
}

/**
 * Convenience function to trigger haptic feedback
 * Uses singleton HapticController instance
 * 
 * @param intensity - Haptic intensity level
 * @returns True if haptic was triggered
 * @korean 햅틱실행
 * 
 * @example
 * ```typescript
 * // Light haptic for UI interaction
 * triggerOptimizedHaptic('light');
 * 
 * // Medium haptic for combat action
 * triggerOptimizedHaptic('medium');
 * 
 * // Strong haptic for critical hit
 * triggerOptimizedHaptic('strong');
 * ```
 * 
 * @public
 */
export function triggerOptimizedHaptic(intensity: HapticIntensity): boolean {
  return HapticController.getInstance().trigger(intensity);
}

/**
 * Convenience function to trigger custom haptic pattern
 * 
 * @param pattern - Custom vibration pattern
 * @returns True if haptic was triggered
 * @korean 커스텀햅틱실행
 * 
 * @public
 */
export function triggerCustomOptimizedHaptic(pattern: number | number[]): boolean {
  return HapticController.getInstance().triggerCustom(pattern);
}

/**
 * Convenience function to stop haptic feedback
 * 
 * @returns True if haptic was stopped
 * @korean 햅틱중지
 * @public
 */
export function stopOptimizedHaptic(): boolean {
  return HapticController.getInstance().stop();
}

/**
 * Combat-specific optimized haptic patterns
 * Pre-configured for common combat scenarios
 * 
 * @korean 전투 햅틱 패턴
 * @public
 */
export const OptimizedCombatHaptics = {
  /**
   * Standard attack hit feedback
   * @korean 일반 공격
   */
  attack: () => triggerOptimizedHaptic('medium'),

  /**
   * Block successful feedback
   * @korean 방어 성공
   */
  block: () => triggerOptimizedHaptic('light'),

  /**
   * Critical hit feedback with double pulse
   * @korean 크리티컬 히트
   */
  criticalHit: () => triggerCustomOptimizedHaptic([40, 20, 60]),

  /**
   * Vital point strike feedback
   * @korean 급소 타격
   */
  vitalPointStrike: () => triggerOptimizedHaptic('strong'),

  /**
   * Stance change feedback
   * @korean 자세 변경
   */
  stanceChange: () => triggerOptimizedHaptic('light'),

  /**
   * Combo counter increment
   * @korean 콤보 카운터
   */
  comboIncrement: () => triggerOptimizedHaptic('light'),

  /**
   * Player KO feedback with extended pattern
   * @korean 플레이어 KO
   */
  knockout: () => triggerCustomOptimizedHaptic([60, 30, 60, 30, 100]),

  /**
   * Error or invalid action feedback
   * @korean 오류 피드백
   */
  error: () => triggerCustomOptimizedHaptic([15, 10, 15]),
} as const;
