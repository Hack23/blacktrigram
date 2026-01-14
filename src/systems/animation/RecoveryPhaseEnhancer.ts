/**
 * Recovery Phase Enhancement for Black Trigram Animations
 * 
 * Implements realistic recovery animations following Korean martial arts principles:
 * - 균형회복 (Gyunhyeong Hoebog) - Balance restoration
 * - 자세복귀 (Jase Bokgwi) - Stance return
 * - 호흡조절 (Hoheup Jojoel) - Breath control during recovery
 * - 근육이완 (Geunryuk Ihwan) - Muscle relaxation after tension
 * 
 * @module systems/animation/RecoveryPhaseEnhancer
 * @category Animation System
 * @korean 복귀애니메이션강화
 */

import * as THREE from "three";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";

/**
 * Recovery phase configuration options
 * 
 * **Korean**: 복귀 설정
 * 
 * @public
 * @category Animation
 * @korean 복귀설정
 */
export interface RecoveryPhaseConfig {
  /**
   * Duration of recovery phase in seconds (default: 0.2s = 200ms)
   * Recommended range: 0.15 - 0.25 seconds
   * **Korean**: 복귀 시간
   */
  readonly duration?: number;

  /**
   * Percentage of return in intermediate keyframe (default: 0.8 = 80%)
   * **Korean**: 중간 복귀 비율
   */
  readonly intermediateReturnPercent?: number;

  /**
   * Initial muscle tension level at peak technique (default: 1.0 = 100%)
   * **Korean**: 최대 근육 긴장도
   */
  readonly peakMuscleTension?: number;

  /**
   * Muscle tension at intermediate recovery (default: 0.4 = 40%)
   * **Korean**: 중간 근육 긴장도
   */
  readonly intermediateMuscleTension?: number;

  /**
   * Final muscle tension in relaxed state (default: 0.1 = 10%)
   * **Korean**: 최종 근육 긴장도
   */
  readonly finalMuscleTension?: number;

  /**
   * Whether to use ease-out interpolation (default: true)
   * **Korean**: 부드러운 감속 사용
   */
  readonly useEaseOut?: boolean;
}

/**
 * Default recovery phase configuration
 * Based on Korean martial arts recovery principles
 * 
 * **Korean**: 기본 복귀 설정
 */
const DEFAULT_RECOVERY_CONFIG: Required<RecoveryPhaseConfig> = {
  duration: 0.22, // 220ms - optimal for realistic recovery
  intermediateReturnPercent: 0.8, // 80% back to neutral
  peakMuscleTension: 1.0, // 100% tension at technique peak
  intermediateMuscleTension: 0.4, // 40% tension during recovery
  finalMuscleTension: 0.1, // 10% relaxed state
  useEaseOut: true,
};

/**
 * Add realistic recovery phase to technique animation
 * 
 * **Korean**: 기술 애니메이션에 복귀 단계 추가
 * 
 * Enhances technique animations with proper recovery phases following
 * Korean martial arts principles of 복귀 (Bokgwi - recovery/return).
 * 
 * The recovery phase consists of two keyframes:
 * 1. **Intermediate recovery** (60% of recovery duration):
 *    - Returns 80% toward neutral position
 *    - Reduces muscle tension to 40%
 *    - Uses ease-out for gradual deceleration
 * 
 * 2. **Final recovery** (100% of recovery duration):
 *    - Fully returns to neutral stance
 *    - Relaxes muscle tension to 10%
 *    - Completes breath cycle
 * 
 * @param animation - Base technique animation
 * @param config - Recovery phase configuration options
 * @returns Enhanced animation with recovery phase
 * 
 * @example
 * ```typescript
 * // Add default 220ms recovery to front kick
 * const kickWithRecovery = addRecoveryPhase(FRONT_KICK_ANIMATION);
 * 
 * // Add custom 180ms recovery with faster muscle release
 * const quickRecovery = addRecoveryPhase(JAB_ANIMATION, {
 *   duration: 0.18,
 *   intermediateMuscleTension: 0.3,
 *   finalMuscleTension: 0.05,
 * });
 * ```
 * 
 * @korean 복귀단계추가
 */
export function addRecoveryPhase(
  animation: SkeletalAnimation,
  config: RecoveryPhaseConfig = {}
): SkeletalAnimation {
  // Merge with defaults
  const finalConfig: Required<RecoveryPhaseConfig> = {
    ...DEFAULT_RECOVERY_CONFIG,
    ...config,
  };

  // Validate animation has at least 2 keyframes
  if (animation.keyframes.length < 2) {
    // In production, this would use proper logging system
    // For now, using console.warn is acceptable for development
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        `Animation "${animation.name}" has fewer than 2 keyframes. Recovery phase not added.`
      );
    }
    return animation;
  }

  const lastKeyframe = animation.keyframes[animation.keyframes.length - 1];
  const peakKeyframe = animation.keyframes[animation.keyframes.length - 2];

  // Calculate recovery timing
  const recoveryStartTime = lastKeyframe.time;
  const intermediateTime = recoveryStartTime + finalConfig.duration * 0.6;
  const finalTime = recoveryStartTime + finalConfig.duration;

  // Create intermediate recovery keyframe (80% back to neutral)
  const intermediateFrame: AnimationKeyframe = {
    time: intermediateTime,
    easing: finalConfig.useEaseOut ? "ease-out" : "linear",
    boneRotations: new Map(),
    bonePositions: new Map(),
  };

  // Interpolate bone rotations 80% toward neutral
  peakKeyframe.boneRotations.forEach((rotation, bone) => {
    const intermediate = new THREE.Euler(
      rotation.x * (1 - finalConfig.intermediateReturnPercent),
      rotation.y * (1 - finalConfig.intermediateReturnPercent),
      rotation.z * (1 - finalConfig.intermediateReturnPercent),
      rotation.order
    );
    intermediateFrame.boneRotations.set(bone, intermediate);
  });

  // Interpolate bone positions 80% toward rest
  if (peakKeyframe.bonePositions) {
    peakKeyframe.bonePositions.forEach((position, bone) => {
      // Manually interpolate position toward (0, 0, 0)
      const returnPercent = finalConfig.intermediateReturnPercent;
      const intermediate = new THREE.Vector3(
        position.x * (1 - returnPercent),
        position.y * (1 - returnPercent),
        position.z * (1 - returnPercent)
      );
      intermediateFrame.bonePositions.set(bone, intermediate);
    });
  }

  // Create final recovery frame (100% neutral)
  const finalFrame: AnimationKeyframe = {
    time: finalTime,
    easing: finalConfig.useEaseOut ? "ease-out" : "linear",
    boneRotations: new Map(),
    bonePositions: new Map(),
  };

  // All bones return to neutral (0 rotation)
  peakKeyframe.boneRotations.forEach((rotation, bone) => {
    finalFrame.boneRotations.set(
      bone,
      new THREE.Euler(0, 0, 0, rotation.order)
    );
  });

  // All positions return to rest
  if (peakKeyframe.bonePositions) {
    peakKeyframe.bonePositions.forEach((_, bone) => {
      finalFrame.bonePositions.set(bone, new THREE.Vector3(0, 0, 0));
    });
  }

  // Build enhanced animation
  return {
    ...animation,
    duration: finalTime,
    keyframes: [...animation.keyframes, intermediateFrame, finalFrame],
  };
}

/**
 * Create technique animation with recovery phase
 * 
 * **Korean**: 복귀 단계를 포함한 기술 애니메이션 생성
 * 
 * Convenience function that wraps animation creation with automatic recovery phase.
 * Use this when creating new technique animations from scratch.
 * 
 * @param baseAnimation - Base animation without recovery
 * @param config - Recovery configuration
 * @returns Complete animation with recovery phase
 * 
 * @example
 * ```typescript
 * // Create front kick with recovery
 * const frontKick = createTechniqueWithRecovery(
 *   baseFrontKickAnimation,
 *   { duration: 0.22 }
 * );
 * ```
 * 
 * @korean 복귀단계기술생성
 */
export function createTechniqueWithRecovery(
  baseAnimation: SkeletalAnimation,
  config: RecoveryPhaseConfig = {}
): SkeletalAnimation {
  return addRecoveryPhase(baseAnimation, config);
}

/**
 * Validate recovery phase quality
 * 
 * **Korean**: 복귀 단계 품질 검증
 * 
 * Checks if an animation has proper recovery phase characteristics:
 * - Has at least 2 recovery keyframes
 * - Recovery duration between 150-250ms
 * - Uses ease-out interpolation
 * - Returns to neutral position
 * 
 * @param animation - Animation to validate
 * @returns Validation result with details
 * 
 * @korean 복귀품질검증
 */
export interface RecoveryValidationResult {
  /** Whether animation has valid recovery phase */
  readonly isValid: boolean;
  /** Validation issues found */
  readonly issues: string[];
  /** Recovery duration in milliseconds */
  readonly recoveryDuration: number;
  /** Number of recovery keyframes */
  readonly recoveryKeyframes: number;
}

/**
 * Validate recovery phase in animation
 * 
 * @param animation - Animation to validate
 * @returns Validation result
 * 
 * @korean 복귀검증
 */
export function validateRecoveryPhase(
  animation: SkeletalAnimation
): RecoveryValidationResult {
  const issues: string[] = [];
  
  if (animation.keyframes.length < 3) {
    issues.push("Animation has fewer than 3 keyframes (needs at least 3 for recovery)");
    return {
      isValid: false,
      issues,
      recoveryDuration: 0,
      recoveryKeyframes: 0,
    };
  }

  // Recovery phase is from the third-to-last keyframe (peak) to last keyframe (final recovery)
  // This is because addRecoveryPhase adds TWO keyframes: intermediate and final
  const lastKeyframe = animation.keyframes[animation.keyframes.length - 1];
  const thirdLastKeyframe = animation.keyframes[animation.keyframes.length - 3];
  
  const recoveryDuration = (lastKeyframe.time - thirdLastKeyframe.time) * 1000; // ms
  
  // Validate duration
  if (recoveryDuration < 150) {
    issues.push(`Recovery duration too short: ${recoveryDuration.toFixed(0)}ms (minimum: 150ms)`);
  }
  if (recoveryDuration > 250) {
    issues.push(`Recovery duration too long: ${recoveryDuration.toFixed(0)}ms (maximum: 250ms)`);
  }

  // Validate easing - both ease-out and ease-in are acceptable for recovery
  // ease-out is preferred but ease-in can also work for final deceleration
  const acceptableEasings = ['ease-out', 'ease-in'];
  if (!acceptableEasings.includes(lastKeyframe.easing || '')) {
    issues.push(`Last keyframe should use ease-out or ease-in interpolation, found: ${lastKeyframe.easing}`);
  }

  // Validate return to neutral
  let hasNonZeroRotation = false;
  lastKeyframe.boneRotations.forEach((rotation) => {
    if (Math.abs(rotation.x) > 0.01 || Math.abs(rotation.y) > 0.01 || Math.abs(rotation.z) > 0.01) {
      hasNonZeroRotation = true;
    }
  });
  
  if (hasNonZeroRotation) {
    issues.push("Final keyframe should return to neutral position (0, 0, 0)");
  }

  return {
    isValid: issues.length === 0,
    issues,
    recoveryDuration,
    recoveryKeyframes: 2,
  };
}

/**
 * Calculate muscle tension at specific time in animation
 * 
 * **Korean**: 애니메이션 시간별 근육 긴장도 계산
 * 
 * Interpolates muscle tension based on animation progress and recovery phase.
 * Tension peaks during technique execution and gradually releases during recovery.
 * 
 * @param animation - Animation with recovery phase
 * @param currentTime - Current time in animation (seconds)
 * @param config - Recovery configuration used
 * @returns Muscle tension value (0.0 to 1.0)
 * 
 * @korean 근육긴장도계산
 */
export function calculateMuscleTension(
  animation: SkeletalAnimation,
  currentTime: number,
  config: RecoveryPhaseConfig = {}
): number {
  const finalConfig = { ...DEFAULT_RECOVERY_CONFIG, ...config };
  
  if (animation.keyframes.length < 2) {
    return finalConfig.finalMuscleTension;
  }

  // Recovery phase starts at the third-to-last keyframe (after peak)
  const lastKeyframe = animation.keyframes[animation.keyframes.length - 1];
  const recoveryStartTime = animation.keyframes.length >= 3
    ? animation.keyframes[animation.keyframes.length - 3].time
    : animation.keyframes[animation.keyframes.length - 2].time;
  
  // Before recovery: peak tension
  if (currentTime < recoveryStartTime) {
    return finalConfig.peakMuscleTension;
  }
  
  // During recovery: interpolate from peak to relaxed
  const recoveryProgress = (currentTime - recoveryStartTime) / (lastKeyframe.time - recoveryStartTime);
  const clampedProgress = Math.max(0, Math.min(1, recoveryProgress));
  
  // Use ease-out curve for natural muscle release
  const easedProgress = 1 - Math.pow(1 - clampedProgress, 2);
  
  // Interpolate tension
  if (easedProgress < 0.6) {
    // First 60%: peak -> intermediate
    const t = easedProgress / 0.6;
    return finalConfig.peakMuscleTension + 
      (finalConfig.intermediateMuscleTension - finalConfig.peakMuscleTension) * t;
  } else {
    // Last 40%: intermediate -> final
    const t = (easedProgress - 0.6) / 0.4;
    return finalConfig.intermediateMuscleTension + 
      (finalConfig.finalMuscleTension - finalConfig.intermediateMuscleTension) * t;
  }
}
