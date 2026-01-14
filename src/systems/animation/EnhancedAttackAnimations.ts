/**
 * Enhanced Attack Animations with Recovery Phases
 * 
 * Demonstrates application of RecoveryPhaseEnhancer to existing attack animations
 * following Korean martial arts principles of 복귀 (Bokgwi - recovery/return).
 * 
 * @module systems/animation/EnhancedAttackAnimations
 * @category Animation System
 * @korean 향상된공격애니메이션
 */

import { JAB_ANIMATION, CROSS_ANIMATION, FRONT_KICK_ANIMATION, ROUNDHOUSE_KICK_ANIMATION } from "./AttackAnimations";
import { addRecoveryPhase, type RecoveryPhaseConfig } from "./RecoveryPhaseEnhancer";
import type { SkeletalAnimation } from "../../types/skeletal";

/**
 * Enhanced jab animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 잽
 * 
 * Original duration: 300ms
 * Enhanced duration: 500ms (300ms technique + 200ms recovery)
 * 
 * Recovery characteristics:
 * - Quick 200ms recovery for fast technique
 * - 75% intermediate return (faster than default)
 * - Low final tension (0.05) for quick follow-up
 * 
 * @korean 향상된잽애니메이션
 */
export const JAB_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  JAB_ANIMATION,
  {
    duration: 0.2, // Fast recovery for jab
    intermediateReturnPercent: 0.75, // Faster return than default
    peakMuscleTension: 0.9, // Jab doesn't require full tension
    intermediateMuscleTension: 0.35,
    finalMuscleTension: 0.05, // Very relaxed for combo follow-up
  }
);

/**
 * Enhanced cross punch animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 크로스
 * 
 * Original duration: 350ms
 * Enhanced duration: 570ms (350ms technique + 220ms recovery)
 * 
 * Recovery characteristics:
 * - Standard 220ms recovery for power technique
 * - Default 80% intermediate return
 * - Higher tension values due to power generation
 * 
 * @korean 향상된크로스애니메이션
 */
export const CROSS_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  CROSS_ANIMATION,
  {
    duration: 0.22, // Standard recovery
    peakMuscleTension: 1.0, // Full power technique
    intermediateMuscleTension: 0.45, // Maintain tension during return
    finalMuscleTension: 0.12, // Slightly more tension than jab
  }
);

/**
 * Enhanced front kick animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 앞차기
 * 
 * Original duration: 550ms (already includes some recovery)
 * Enhanced duration: 720ms (550ms technique + 170ms enhanced recovery)
 * 
 * Recovery characteristics:
 * - Shorter 170ms recovery (already has set-down phase)
 * - 85% intermediate return (more complete than default)
 * - Balance-focused recovery
 * 
 * Note: FRONT_KICK_ANIMATION already has frames 4-5 for set-down and balance recovery.
 * This enhancement adds proper muscle tension release and intermediate positioning.
 * 
 * @korean 향상된앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  FRONT_KICK_ANIMATION,
  {
    duration: 0.17, // Shorter since base has set-down
    intermediateReturnPercent: 0.85, // More complete return
    peakMuscleTension: 1.0, // Full leg power
    intermediateMuscleTension: 0.38,
    finalMuscleTension: 0.1, // Stable standing position
  }
);

/**
 * Enhanced roundhouse kick animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 돌려차기
 * 
 * Original duration: 600ms (already includes some recovery)
 * Enhanced duration: 780ms (600ms technique + 180ms enhanced recovery)
 * 
 * Recovery characteristics:
 * - Moderate 180ms recovery (has set-down phase)
 * - 85% intermediate return for rotational recovery
 * - Higher tension due to rotational power
 * 
 * Note: ROUNDHOUSE_KICK_ANIMATION already has frames 6-7 for set-down and recovery shuffle.
 * This enhancement adds proper hip de-rotation and balance restoration.
 * 
 * @korean 향상된돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  ROUNDHOUSE_KICK_ANIMATION,
  {
    duration: 0.18, // Moderate recovery for rotation
    intermediateReturnPercent: 0.85, // Complete hip de-rotation
    peakMuscleTension: 1.0, // Maximum rotational power
    intermediateMuscleTension: 0.42, // Maintain core stability
    finalMuscleTension: 0.12, // Balanced stance
  }
);

/**
 * Map of enhanced animations for easy lookup
 * 
 * **Korean**: 향상된 애니메이션 맵
 * 
 * Use this to replace base animations with enhanced versions in combat system.
 * 
 * @example
 * ```typescript
 * import { ENHANCED_ANIMATIONS } from './EnhancedAttackAnimations';
 * 
 * // Use enhanced jab instead of base jab
 * const jabAnimation = ENHANCED_ANIMATIONS.jab;
 * ```
 * 
 * @korean 향상된애니메이션맵
 */
export const ENHANCED_ANIMATIONS = {
  jab: JAB_ANIMATION_ENHANCED,
  cross: CROSS_ANIMATION_ENHANCED,
  front_kick: FRONT_KICK_ANIMATION_ENHANCED,
  roundhouse_kick: ROUNDHOUSE_KICK_ANIMATION_ENHANCED,
} as const;

/**
 * Recovery phase configuration presets for different technique types
 * 
 * **Korean**: 기술 유형별 복귀 설정
 * 
 * Use these presets when enhancing additional techniques:
 * - **Fast**: Quick strikes (jabs, straights) - 180-200ms recovery
 * - **Power**: Heavy techniques (hooks, uppercuts) - 220-240ms recovery
 * - **Kick**: Leg techniques (kicks) - 170-190ms recovery (have set-down)
 * - **Combo**: Combination starters - 150-170ms recovery for fast chains
 * 
 * @korean 복귀설정프리셋
 */
export const RECOVERY_PRESETS: Record<string, RecoveryPhaseConfig> = {
  /**
   * Fast technique recovery (잽, 직권)
   * - Duration: 180-200ms
   * - Quick return: 75%
   * - Low tension: 0.05-0.35
   */
  fast: {
    duration: 0.19,
    intermediateReturnPercent: 0.75,
    peakMuscleTension: 0.9,
    intermediateMuscleTension: 0.35,
    finalMuscleTension: 0.05,
  },

  /**
   * Power technique recovery (훅, 어퍼컷)
   * - Duration: 220-240ms
   * - Standard return: 80%
   * - High tension: 0.12-0.45
   */
  power: {
    duration: 0.22,
    intermediateReturnPercent: 0.8,
    peakMuscleTension: 1.0,
    intermediateMuscleTension: 0.45,
    finalMuscleTension: 0.12,
  },

  /**
   * Kick technique recovery (차기)
   * - Duration: 170-190ms (shorter, has set-down)
   * - Complete return: 85%
   * - Moderate tension: 0.1-0.4
   */
  kick: {
    duration: 0.18,
    intermediateReturnPercent: 0.85,
    peakMuscleTension: 1.0,
    intermediateMuscleTension: 0.4,
    finalMuscleTension: 0.1,
  },

  /**
   * Combo starter recovery (연속기 시작)
   * - Duration: 150-170ms (fastest)
   * - Rapid return: 70%
   * - Very low tension: 0.03-0.3
   */
  combo: {
    duration: 0.16,
    intermediateReturnPercent: 0.7,
    peakMuscleTension: 0.85,
    intermediateMuscleTension: 0.3,
    finalMuscleTension: 0.03,
  },

  /**
   * Finishing move recovery (마무리기술)
   * - Duration: 240-250ms (longest)
   * - Deliberate return: 85%
   * - High final tension: 0.15-0.5 (defensive)
   */
  finishing: {
    duration: 0.25,
    intermediateReturnPercent: 0.85,
    peakMuscleTension: 1.0,
    intermediateMuscleTension: 0.5,
    finalMuscleTension: 0.15,
  },
} as const;

/**
 * Apply recovery phase to any animation using preset
 * 
 * **Korean**: 프리셋을 사용한 복귀 적용
 * 
 * Convenience function for applying recovery with standard presets.
 * 
 * @param animation - Base animation
 * @param preset - Preset name ('fast', 'power', 'kick', 'combo', 'finishing')
 * @returns Enhanced animation with recovery phase
 * 
 * @example
 * ```typescript
 * import { UPPERCUT_ANIMATION } from './PunchAnimations';
 * import { applyRecoveryPreset } from './EnhancedAttackAnimations';
 * 
 * // Apply power recovery preset to uppercut
 * const enhancedUppercut = applyRecoveryPreset(UPPERCUT_ANIMATION, 'power');
 * ```
 * 
 * @korean 프리셋복귀적용
 */
export function applyRecoveryPreset(
  animation: SkeletalAnimation,
  preset: keyof typeof RECOVERY_PRESETS
): SkeletalAnimation {
  return addRecoveryPhase(animation, RECOVERY_PRESETS[preset]);
}
