/**
 * Haptic Feedback Utility
 * 
 * Provides tactile feedback for mobile touch interactions
 * Uses Vibration API for physical response on button presses and combat hits
 * 
 * @module utils/haptics
 * @category Mobile Controls
 * @korean 햅틱 피드백 유틸리티
 */

/**
 * Haptic intensity levels for different interactions
 */
export type HapticIntensity = 'light' | 'medium' | 'heavy';

/**
 * Vibration patterns for different haptic intensities
 * - light: Quick tap (10ms) - UI interactions
 * - medium: Moderate pulse (50ms) - Combat actions
 * - heavy: Strong pulse (100ms) - Critical hits
 * 
 * @korean 햅틱 강도 패턴
 */
const HAPTIC_PATTERNS: Record<HapticIntensity, number[]> = {
  light: [10],
  medium: [50],
  heavy: [100],
} as const;

/**
 * Check if haptic feedback is supported by the device
 * 
 * @returns True if Vibration API is available
 * @korean 햅틱 지원 확인
 * 
 * @example
 * ```typescript
 * if (isHapticSupported()) {
 *   triggerHaptic('medium');
 * }
 * ```
 */
export function isHapticSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback with specified intensity
 * 
 * Provides tactile response for:
 * - Light: Menu selections, button taps
 * - Medium: Attack actions, stance changes
 * - Heavy: Critical hits, successful vital point strikes
 * 
 * Falls back gracefully if Vibration API is not supported
 * 
 * @param intensity - Haptic intensity level
 * @korean 햅틱 피드백 실행
 * 
 * @example
 * ```typescript
 * // Light feedback for UI interaction
 * triggerHaptic('light');
 * 
 * // Medium feedback for combat action
 * triggerHaptic('medium');
 * 
 * // Heavy feedback for critical hit
 * triggerHaptic('heavy');
 * ```
 * 
 * @public
 */
export function triggerHaptic(intensity: HapticIntensity): void {
  if (!isHapticSupported()) {
    return;
  }

  const pattern = HAPTIC_PATTERNS[intensity];
  navigator.vibrate(pattern);
}

/**
 * Custom haptic pattern for specific game events
 * Allows creating complex vibration sequences
 * 
 * @param pattern - Array of vibration durations in milliseconds
 * @korean 커스텀 햅틱 패턴
 * 
 * @example
 * ```typescript
 * // Combo hit feedback: buzz, pause, buzz
 * triggerCustomHaptic([30, 20, 30]);
 * 
 * // Critical vital point strike: long buzz
 * triggerCustomHaptic([200]);
 * ```
 * 
 * @public
 */
export function triggerCustomHaptic(pattern: number[]): void {
  if (!isHapticSupported()) {
    return;
  }

  navigator.vibrate(pattern);
}

/**
 * Stop any ongoing haptic feedback
 * Useful for interrupting long vibrations
 * 
 * @korean 햅틱 피드백 중지
 * 
 * @example
 * ```typescript
 * // Cancel ongoing vibration
 * stopHaptic();
 * ```
 * 
 * @public
 */
export function stopHaptic(): void {
  if (!isHapticSupported()) {
    return;
  }

  navigator.vibrate(0);
}

/**
 * Combat-specific haptic feedback patterns
 * Pre-configured patterns for common combat scenarios
 * 
 * @korean 전투 햅틱 패턴
 */
export const CombatHaptics = {
  /**
   * Standard attack hit feedback
   * @korean 일반 공격
   */
  attack: () => triggerHaptic('medium'),

  /**
   * Block successful feedback
   * @korean 방어 성공
   */
  block: () => triggerHaptic('light'),

  /**
   * Critical hit feedback with double pulse
   * @korean 크리티컬 히트
   */
  criticalHit: () => triggerCustomHaptic([50, 30, 100]),

  /**
   * Vital point strike feedback
   * @korean 급소 타격
   */
  vitalPointStrike: () => triggerHaptic('heavy'),

  /**
   * Stance change feedback
   * @korean 자세 변경
   */
  stanceChange: () => triggerHaptic('light'),

  /**
   * Combo counter increment
   * @korean 콤보 카운터
   */
  comboIncrement: () => triggerHaptic('light'),

  /**
   * Player KO feedback with extended pattern
   * @korean 플레이어 KO
   */
  knockout: () => triggerCustomHaptic([100, 50, 100, 50, 200]),

  /**
   * Error or invalid action feedback
   * @korean 오류 피드백
   */
  error: () => triggerCustomHaptic([20, 10, 20]),
} as const;
