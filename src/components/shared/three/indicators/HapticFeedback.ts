/**
 * Haptic Feedback System for Combat UI
 * 
 * Provides tactile feedback for mobile devices during combat interactions
 * such as guard activation, stance changes, and guard breaks.
 * 
 * Uses the Vibration API with fallback for unsupported devices.
 * 
 * @module components/shared/three/indicators/HapticFeedback
 * @category Combat UI
 * @korean 햅틱피드백
 */

/**
 * Haptic pattern type
 * @korean 햅틱패턴타입
 */
export type HapticPattern = number | number[];

/**
 * Check if haptic feedback is supported on this device
 * 
 * @returns True if the Vibration API is available
 * 
 * @example
 * ```typescript
 * if (isHapticSupported()) {
 *   triggerGuardHaptic('activate');
 * }
 * ```
 * 
 * @public
 * @korean 햅틱지원여부
 */
export function isHapticSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "vibrate" in navigator &&
    typeof navigator.vibrate === "function"
  );
}

/**
 * Trigger haptic feedback for guard activation or break
 * 
 * Provides tactile feedback when a player activates their guard
 * or when their guard is broken by an opponent.
 * 
 * Patterns:
 * - **activate**: Light single vibration (50ms) for guard activation
 * - **break**: Strong triple-pulse pattern (100ms, 50ms pause, 100ms) for guard break
 * 
 * @param type - Type of guard haptic feedback
 * 
 * @example
 * ```typescript
 * // When player activates guard
 * triggerGuardHaptic('activate');
 * 
 * // When guard is broken
 * triggerGuardHaptic('break');
 * ```
 * 
 * @public
 * @korean 방어햅틱트리거
 */
export function triggerGuardHaptic(type: "activate" | "break"): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    if (type === "activate") {
      // Light haptic - single short vibration
      navigator.vibrate(50);
    } else if (type === "break") {
      // Strong haptic - triple pulse pattern for impact
      // Pattern: vibrate 100ms, pause 50ms, vibrate 100ms
      navigator.vibrate([100, 50, 100]);
    }
  } catch (error) {
    // Silently fail if vibration fails
    console.warn("Haptic feedback failed:", error);
  }
}

/**
 * Trigger haptic feedback for stance change
 * 
 * Provides medium-strength tactile feedback when a player transitions
 * between trigram stances (건→태→리→진→손→감→간→곤).
 * 
 * @example
 * ```typescript
 * // When stance changes from Geon to Tae
 * triggerStanceChangeHaptic();
 * ```
 * 
 * @public
 * @korean 자세변경햅틱트리거
 */
export function triggerStanceChangeHaptic(): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    // Medium haptic - single medium vibration
    navigator.vibrate(75);
  } catch (error) {
    // Silently fail if vibration fails
    console.warn("Haptic feedback failed:", error);
  }
}

/**
 * Trigger custom haptic pattern
 * 
 * Allows for custom vibration patterns using the Vibration API.
 * Can specify either a single duration or a pattern array.
 * 
 * Pattern arrays alternate between vibration and pause:
 * - [200, 100, 200] = vibrate 200ms, pause 100ms, vibrate 200ms
 * 
 * @param pattern - Vibration duration in ms or pattern array
 * 
 * @example
 * ```typescript
 * // Single vibration
 * triggerCustomHaptic(200);
 * 
 * // Complex pattern
 * triggerCustomHaptic([100, 50, 100, 50, 100]);
 * ```
 * 
 * @public
 * @korean 사용자정의햅틱트리거
 */
export function triggerCustomHaptic(pattern: HapticPattern): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Silently fail if vibration fails
    console.warn("Haptic feedback failed:", error);
  }
}

/**
 * Stop all haptic feedback
 * 
 * Immediately stops any ongoing vibration. Useful for interrupting
 * long or repeated patterns.
 * 
 * @example
 * ```typescript
 * // Stop any ongoing haptic feedback
 * stopHaptic();
 * ```
 * 
 * @public
 * @korean 햅틱중지
 */
export function stopHaptic(): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    // Passing 0 or empty array stops vibration
    navigator.vibrate(0);
  } catch (error) {
    // Silently fail if vibration stop fails
    console.warn("Haptic stop failed:", error);
  }
}

/**
 * Check if device is mobile
 * 
 * Simple heuristic to detect mobile devices based on screen size,
 * user agent, and touch support.
 * 
 * @returns True if device is likely mobile
 * 
 * @example
 * ```typescript
 * if (isMobileDevice() && isHapticSupported()) {
 *   triggerStanceChangeHaptic();
 * }
 * ```
 * 
 * @public
 * @korean 모바일기기여부
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Check screen size (mobile typically < 768px)
  const isMobileSize = window.innerWidth < 768;

  // Check user agent for mobile indicators
  const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileKeywords.test(navigator.userAgent);

  // Check for touch support (modern browsers)
  const hasTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  // Device is mobile if it meets size OR user agent criteria AND has touch
  return (isMobileSize || isMobileUA) && hasTouch;
}

/**
 * Haptic feedback settings
 * 
 * Allows for global configuration of haptic feedback intensity
 * and enable/disable state.
 * 
 * @korean 햅틱설정
 */
export interface HapticSettings {
  /** Whether haptic feedback is enabled */
  readonly enabled: boolean;
  /** Intensity multiplier (0.0 to 1.0) */
  readonly intensity: number;
}

/**
 * Default haptic settings
 * @korean 기본햅틱설정
 */
export const DEFAULT_HAPTIC_SETTINGS: HapticSettings = {
  enabled: true,
  intensity: 1.0,
};

/**
 * Apply intensity modifier to haptic pattern
 * 
 * Scales vibration durations based on intensity setting.
 * 
 * @param pattern - Original haptic pattern
 * @param intensity - Intensity multiplier (0.0 to 1.0)
 * @returns Scaled haptic pattern
 * 
 * @internal
 * @korean 햅틱강도적용
 */
export function applyIntensity(
  pattern: HapticPattern,
  intensity: number
): HapticPattern {
  const clampedIntensity = Math.max(0, Math.min(1, intensity));

  if (typeof pattern === "number") {
    return Math.round(pattern * clampedIntensity);
  }

  return pattern.map((duration) => Math.round(duration * clampedIntensity));
}

/**
 * Trigger haptic with settings
 * 
 * Wrapper function that applies haptic settings before triggering.
 * 
 * @param pattern - Haptic pattern to trigger
 * @param settings - Haptic settings to apply
 * 
 * @example
 * ```typescript
 * const settings = { enabled: true, intensity: 0.7 };
 * triggerWithSettings(100, settings); // Triggers 70ms vibration
 * ```
 * 
 * @public
 * @korean 설정포함햅틱트리거
 */
export function triggerWithSettings(
  pattern: HapticPattern,
  settings: HapticSettings = DEFAULT_HAPTIC_SETTINGS
): void {
  if (!settings.enabled || !isHapticSupported()) {
    return;
  }

  const scaledPattern = applyIntensity(pattern, settings.intensity);
  triggerCustomHaptic(scaledPattern);
}
