/**
 * Haptic feedback utilities for mobile touch interactions
 * 
 * Provides vibration feedback for button presses and combat actions
 * with support for different intensity levels on iOS and Android.
 * 
 * @module utils/hapticFeedback
 * @category Mobile Utilities
 * @korean 햅틱피드백유틸리티
 */

/**
 * Haptic feedback intensity levels
 * 
 * @category Haptic Feedback
 * @korean 햅틱강도
 */
export type HapticIntensity = "light" | "medium" | "heavy";

/**
 * Haptic feedback pattern configuration
 * 
 * @category Haptic Feedback
 * @korean 햅틱패턴설정
 */
interface HapticPattern {
  readonly duration: number; // Duration in milliseconds
  readonly pattern?: readonly number[]; // For Android pattern vibration
}

/**
 * Haptic patterns for different intensities
 * 
 * @category Haptic Feedback
 * @korean 햅틱패턴
 */
const HAPTIC_PATTERNS: Record<HapticIntensity, HapticPattern> = {
  light: {
    duration: 10,
    pattern: [10],
  },
  medium: {
    duration: 50,
    pattern: [50],
  },
  heavy: {
    duration: 100,
    pattern: [100],
  },
};

/**
 * Check if haptic feedback is supported
 * 
 * @returns Whether haptic feedback is available
 * 
 * @example
 * ```typescript
 * if (isHapticSupported()) {
 *   triggerHapticFeedback('medium');
 * }
 * ```
 * 
 * @public
 * @korean 햅틱지원여부
 */
export function isHapticSupported(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  
  // Check for modern vibrate API or webkit prefixed version
  const nav = navigator as Navigator & { webkitVibrate?: (pattern: number | number[]) => boolean };
  return "vibrate" in navigator || !!nav.webkitVibrate;
}

/**
 * Trigger haptic feedback with specified intensity
 * 
 * @param intensity - Feedback intensity level
 * @returns Whether feedback was triggered successfully
 * 
 * @example
 * ```typescript
 * // Light feedback for menu navigation
 * triggerHapticFeedback('light');
 * 
 * // Medium feedback for button press
 * triggerHapticFeedback('medium');
 * 
 * // Heavy feedback for critical hit
 * triggerHapticFeedback('heavy');
 * ```
 * 
 * @public
 * @korean 햅틱피드백트리거
 */
export function triggerHapticFeedback(intensity: HapticIntensity): boolean {
  if (!isHapticSupported()) {
    return false;
  }

  const pattern = HAPTIC_PATTERNS[intensity];

  try {
    // Try modern Vibration API
    if ("vibrate" in navigator) {
      return navigator.vibrate(pattern.duration);
    }

    // Try webkit prefixed version for older devices
    const nav = navigator as Navigator & { webkitVibrate?: (pattern: number | number[]) => boolean };
    if (nav.webkitVibrate) {
      return nav.webkitVibrate(pattern.duration);
    }
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }

  return false;
}

/**
 * Trigger custom haptic pattern
 * Useful for complex feedback sequences
 * 
 * @param pattern - Array of vibration durations and pauses (ms)
 * @returns Whether pattern was triggered successfully
 * 
 * @example
 * ```typescript
 * // Double tap feedback: vibrate 50ms, pause 50ms, vibrate 50ms
 * triggerHapticPattern([50, 50, 50]);
 * ```
 * 
 * @public
 * @korean 햅틱패턴트리거
 */
export function triggerHapticPattern(pattern: readonly number[]): boolean {
  if (!isHapticSupported()) {
    return false;
  }

  try {
    if ("vibrate" in navigator) {
      return navigator.vibrate(pattern as number[]);
    }

    // Try webkit prefixed version for older devices
    const nav = navigator as Navigator & { webkitVibrate?: (pattern: number | number[]) => boolean };
    if (nav.webkitVibrate) {
      return nav.webkitVibrate(pattern as number[]);
    }
  } catch (error) {
    console.warn("Haptic pattern failed:", error);
  }

  return false;
}

/**
 * Haptic feedback for UI interactions
 * Pre-configured patterns for common UI elements
 * 
 * @category Haptic Feedback
 * @korean UI햅틱피드백
 */
export const UIHaptics = {
  /**
   * Button tap feedback
   * @korean 버튼탭피드백
   */
  buttonTap: () => triggerHapticFeedback("medium"),

  /**
   * Menu hover/navigation feedback
   * @korean 메뉴호버피드백
   */
  menuHover: () => triggerHapticFeedback("light"),

  /**
   * Stance change feedback
   * @korean 자세변경피드백
   */
  stanceChange: () => triggerHapticFeedback("light"),

  /**
   * Attack execution feedback
   * @korean 공격실행피드백
   */
  attackExecution: () => triggerHapticFeedback("medium"),

  /**
   * Critical hit feedback
   * @korean 치명타피드백
   */
  criticalHit: () => triggerHapticPattern([50, 30, 100]),

  /**
   * Vital point strike feedback
   * @korean 급소타격피드백
   */
  vitalPointStrike: () => triggerHapticPattern([100, 50, 100, 50, 100]),

  /**
   * Block/defend feedback
   * @korean 방어피드백
   */
  blockDefend: () => triggerHapticFeedback("medium"),

  /**
   * Error/invalid action feedback
   * @korean 오류피드백
   */
  error: () => triggerHapticPattern([50, 50, 50]),

  /**
   * Success/achievement feedback
   * @korean 성공피드백
   */
  success: () => triggerHapticPattern([30, 30, 30, 30, 100]),
} as const;

/**
 * Combat haptic feedback manager
 * Provides context-aware haptic feedback for combat actions
 * 
 * @category Haptic Feedback
 * @korean 전투햅틱피드백
 */
export const CombatHaptics = {
  /**
   * Normal hit feedback
   * @korean 일반타격피드백
   */
  normalHit: () => triggerHapticFeedback("medium"),

  /**
   * Critical hit feedback with double pulse
   * @korean 치명타피드백
   */
  criticalHit: () => triggerHapticPattern([50, 30, 100]),

  /**
   * Perfect strike feedback (triple pulse)
   * @korean 완벽타격피드백
   */
  perfectStrike: () => triggerHapticPattern([30, 30, 30, 30, 100]),

  /**
   * Vital point strike feedback (intense pattern)
   * @korean 급소타격피드백
   */
  vitalPointHit: () => triggerHapticPattern([100, 50, 100, 50, 100]),

  /**
   * Blocked attack feedback (sharp double pulse)
   * @korean 방어성공피드백
   */
  attackBlocked: () => triggerHapticPattern([30, 30, 30]),

  /**
   * Miss feedback (quick light pulse)
   * @korean 빗나감피드백
   */
  attackMissed: () => triggerHapticFeedback("light"),

  /**
   * Counter-attack feedback (building intensity)
   * @korean 반격피드백
   */
  counterAttack: () => triggerHapticPattern([30, 20, 50, 20, 100]),

  /**
   * Combo hit feedback (rhythmic pattern)
   * @korean 콤보타격피드백
   */
  comboHit: (comboCount: number) => {
    const pattern = Array(Math.min(comboCount, 5))
      .fill(null)
      .flatMap(() => [30, 20]);
    pattern.push(50); // Final pulse
    return triggerHapticPattern(pattern);
  },

  /**
   * Heavy damage taken feedback (long intense pulse)
   * @korean 큰피해피드백
   */
  heavyDamage: () => triggerHapticPattern([150, 50, 150]),

  /**
   * Knockout feedback (dramatic pattern)
   * @korean 녹다운피드백
   */
  knockout: () => triggerHapticPattern([100, 50, 100, 50, 200]),
} as const;

/**
 * Training mode haptic feedback
 * Provides feedback for training exercises
 * 
 * @category Haptic Feedback
 * @korean 훈련햅틱피드백
 */
export const TrainingHaptics = {
  /**
   * Correct technique feedback
   * @korean 정확한기술피드백
   */
  correctTechnique: () => triggerHapticPattern([30, 30, 100]),

  /**
   * Incorrect technique feedback
   * @korean 부정확한기술피드백
   */
  incorrectTechnique: () => triggerHapticPattern([50, 50, 50]),

  /**
   * Target hit feedback
   * @korean 표적명중피드백
   */
  targetHit: () => triggerHapticFeedback("medium"),

  /**
   * Perfect timing feedback
   * @korean 완벽한타이밍피드백
   */
  perfectTiming: () => triggerHapticPattern([20, 20, 20, 20, 80]),

  /**
   * New skill unlocked feedback
   * @korean 새기술해금피드백
   */
  skillUnlocked: () => triggerHapticPattern([50, 30, 50, 30, 50, 30, 150]),
} as const;
