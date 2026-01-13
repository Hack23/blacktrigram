/**
 * Technique Recovery Phase System
 * 
 * Implements realistic recovery animations for returning to stance after techniques,
 * preventing instant "snap-back" transitions. Korean martial arts emphasize controlled
 * recovery (복귀/Bokgwi) with proper deceleration, muscle tension release, and breathing.
 * 
 * **Korean Martial Arts Recovery Principles (복귀 원리)**:
 * - 균형회복 (Gyunhyeong Hoebog) - Balance restoration through intermediate positions
 * - 자세복귀 (Jase Bokgwi) - Stance return with gradual deceleration
 * - 호흡조절 (Hoheup Jojoel) - Breath control during recovery phase
 * - 근육이완 (Geunryuk Ihwan) - Muscle relaxation after peak tension
 * 
 * @module systems/animation/TechniqueRecoveryPhases
 * @category Animation System
 * @korean 기술복귀단계
 */

import type { AnimationKeyframe, SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import * as THREE from "three";
import type { EasingName } from "./KeyframeInterpolation";

/**
 * Muscle tension state for animation keyframes
 * 
 * **Korean**: 근육긴장상태
 * 
 * Represents tension levels in muscle groups during technique execution and recovery.
 * Values range from 0.0 (relaxed) to 1.0 (maximum tension).
 * 
 * @public
 * @category Animation
 * @korean 근육긴장상태
 */
export interface MuscleTensionState {
  /** Tension in legs (0.0 = relaxed, 1.0 = max tension) */
  readonly legs: number;
  /** Tension in core/torso */
  readonly core: number;
  /** Tension in arms */
  readonly arms: number;
  /** Tension in shoulders */
  readonly shoulders: number;
}

/**
 * Extended animation keyframe with muscle tension tracking
 * 
 * **Korean**: 확장 키프레임 (근육긴장 포함)
 * 
 * Extends standard keyframe with muscle tension information for realistic
 * recovery animation phases.
 * 
 * @public
 * @category Animation
 * @korean 근육긴장키프레임
 */
export interface TensionKeyframe extends AnimationKeyframe {
  /** Muscle tension state at this keyframe */
  readonly muscleTension?: Map<string, number>;
}

/**
 * Recovery phase configuration
 * 
 * **Korean**: 복귀 단계 구성
 * 
 * Defines the recovery phase to be added after technique completion.
 * 
 * @public
 * @category Animation
 * @korean 복귀단계구성
 */
export interface RecoveryPhaseConfig {
  /** Duration of recovery phase in seconds (default: 0.2s = 200ms) */
  readonly duration?: number;
  /** 
   * Percentage back to neutral at intermediate frame (0.0-1.0)
   * Default: 0.8 (80% back to neutral)
   */
  readonly intermediateProgress?: number;
  /**
   * Time ratio for intermediate frame (0.0-1.0)
   * Default: 0.6 (60% through recovery duration)
   */
  readonly intermediateTimeRatio?: number;
  /**
   * Easing function for recovery interpolation
   * Default: "ease-out" for gradual deceleration
   */
  readonly easing?: EasingName;
  /**
   * Include breathing synchronization
   * Default: true
   */
  readonly includeBreathing?: boolean;
}

/**
 * Default recovery phase configuration
 * 
 * **Korean**: 기본 복귀 설정
 * 
 * @korean 기본복귀설정
 */
export const DEFAULT_RECOVERY_CONFIG: Required<RecoveryPhaseConfig> = {
  duration: 0.2, // 200ms recovery phase
  intermediateProgress: 0.8, // 80% back to neutral
  intermediateTimeRatio: 0.6, // Intermediate at 60% through duration
  easing: "ease-out", // Gradual deceleration
  includeBreathing: true,
};

/**
 * Calculate muscle tension at recovery phase
 * 
 * **Korean**: 복귀 단계 근육 긴장도 계산
 * 
 * Calculates muscle tension release during recovery based on progress.
 * Tension decreases non-linearly from peak to relaxed state.
 * 
 * @param peakTension - Maximum tension during technique (0.0-1.0)
 * @param progress - Recovery progress (0.0 = start, 1.0 = complete)
 * @returns Tension level at current progress
 * 
 * @example
 * ```typescript
 * // At 50% recovery progress, tension reduces significantly
 * const tension = calculateRecoveryTension(1.0, 0.5);
 * // Returns ~0.25 (75% tension released)
 * ```
 * 
 * @korean 복귀긴장도계산
 */
export function calculateRecoveryTension(
  peakTension: number,
  progress: number
): number {
  // Non-linear tension release: Fast initial release, gradual final relaxation
  // Uses quadratic ease-out curve for natural muscle relaxation
  const releaseProgress = 1 - Math.pow(1 - progress, 2);
  const remainingTension = peakTension * (1 - releaseProgress);
  
  // Minimum 10% base tension (muscles never fully relax during combat)
  return Math.max(remainingTension, 0.1);
}

/**
 * Interpolate bone rotation toward neutral with progress
 * 
 * **Korean**: 중립 위치로 뼈 회전 보간
 * 
 * @param current - Current bone rotation
 * @param progress - Progress toward neutral (0.0-1.0)
 * @returns Interpolated rotation
 * 
 * @korean 중립회전보간
 */
function interpolateToNeutral(
  current: THREE.Euler,
  progress: number
): THREE.Euler {
  const neutral = new THREE.Euler(0, 0, 0, current.order);
  
  // Use quaternion interpolation for smooth rotation
  const currentQuat = new THREE.Quaternion().setFromEuler(current);
  const neutralQuat = new THREE.Quaternion().setFromEuler(neutral);
  
  const interpolated = new THREE.Quaternion().slerpQuaternions(
    currentQuat,
    neutralQuat,
    progress
  );
  
  return new THREE.Euler().setFromQuaternion(interpolated, current.order);
}

/**
 * Interpolate bone position toward neutral with progress
 * 
 * **Korean**: 중립 위치로 뼈 위치 보간
 * 
 * @param current - Current bone position
 * @param progress - Progress toward neutral (0.0-1.0)
 * @returns Interpolated position
 * 
 * @korean 중립위치보간
 */
function interpolatePositionToNeutral(
  current: THREE.Vector3,
  progress: number
): THREE.Vector3 {
  const neutral = new THREE.Vector3(0, 0, 0);
  return new THREE.Vector3().lerpVectors(current, neutral, progress);
}

/**
 * Add recovery phase to technique animation
 * 
 * **Korean**: 기술 애니메이션에 복귀 단계 추가
 * 
 * Adds realistic recovery phase keyframes to a technique animation, preventing
 * instant "snap-back" to neutral stance. The recovery includes:
 * 
 * 1. **Intermediate Recovery (60% of duration)**: Returns 80% toward neutral
 *    - Gradual deceleration from peak technique
 *    - Significant muscle tension release (60% reduction)
 *    - Body moves through transitional positions
 * 
 * 2. **Final Recovery (100% of duration)**: Completes return to neutral
 *    - Full return to fighting stance
 *    - Muscle tension reduced to relaxed state (10% base)
 *    - Breathing cycle completes
 * 
 * @param animation - Base technique animation (without recovery)
 * @param config - Recovery phase configuration (optional)
 * @returns Animation with recovery phase added
 * 
 * @example
 * ```typescript
 * // Add standard 200ms recovery to front kick
 * const frontKick = createFrontKickAnimation("right");
 * const withRecovery = addRecoveryPhase(frontKick);
 * 
 * // Custom recovery: 250ms duration, 70% intermediate progress
 * const customRecovery = addRecoveryPhase(frontKick, {
 *   duration: 0.25,
 *   intermediateProgress: 0.7,
 * });
 * ```
 * 
 * @public
 * @korean 복귀단계추가
 */
export function addRecoveryPhase(
  animation: SkeletalAnimation,
  config: RecoveryPhaseConfig = {}
): SkeletalAnimation {
  // Merge with defaults
  const recoveryConfig: Required<RecoveryPhaseConfig> = {
    ...DEFAULT_RECOVERY_CONFIG,
    ...config,
  };
  
  if (animation.keyframes.length < 2) {
    console.warn("Animation has insufficient keyframes for recovery phase");
    return animation;
  }
  
  // Get peak keyframe (second to last, before any existing recovery)
  const peakIndex = animation.keyframes.length - 2;
  const peakKeyframe = animation.keyframes[peakIndex];
  const lastKeyframe = animation.keyframes[animation.keyframes.length - 1];
  
  // Calculate recovery timings
  const recoveryStart = lastKeyframe.time;
  const intermediateTime = recoveryStart + (recoveryConfig.duration * recoveryConfig.intermediateTimeRatio);
  const finalTime = recoveryStart + recoveryConfig.duration;
  
  // Map extended easing names to base easing types
  const mapEasingToBase = (easing: EasingName): "linear" | "ease-in" | "ease-out" | "ease-in-out" => {
    // Extended easing types map to their closest base equivalent
    switch (easing) {
      case "natural-motion":
      case "smooth-transition":
      case "quick-start":
      case "controlled-slow":
        return "ease-out"; // All recovery easings use ease-out style deceleration
      case "explosive-power":
        return "ease-in";
      case "ease-in":
        return "ease-in";
      case "ease-in-out":
        return "ease-in-out";
      case "linear":
      default:
        return "ease-out"; // Default for recovery
    }
  };
  
  // Create intermediate recovery keyframe (e.g., 80% back to neutral)
  const intermediateFrame: TensionKeyframe = {
    time: intermediateTime,
    easing: mapEasingToBase(recoveryConfig.easing),
    boneRotations: new Map(),
    bonePositions: new Map(),
    muscleTension: new Map(),
  };
  
  // Interpolate bone rotations toward neutral (80% progress)
  peakKeyframe.boneRotations.forEach((rotation, boneName) => {
    const interpolated = interpolateToNeutral(rotation, recoveryConfig.intermediateProgress);
    intermediateFrame.boneRotations.set(boneName, interpolated);
    
    // Calculate tension release (60% reduction at intermediate)
    const peakTension = 1.0; // Assume peak tension during technique
    const currentTension = calculateRecoveryTension(peakTension, recoveryConfig.intermediateProgress);
    intermediateFrame.muscleTension!.set(boneName, currentTension);
  });
  
  // Interpolate bone positions toward neutral
  peakKeyframe.bonePositions.forEach((position, boneName) => {
    const interpolated = interpolatePositionToNeutral(position, recoveryConfig.intermediateProgress);
    intermediateFrame.bonePositions.set(boneName, interpolated);
  });
  
  // Add breathing movement to spine during recovery (subtle chest expansion)
  if (recoveryConfig.includeBreathing) {
    const breathingOffset = Math.sin(intermediateTime * 2 * Math.PI) * 0.02;
    const spineRotation = intermediateFrame.boneRotations.get(BoneName.SPINE_UPPER);
    if (spineRotation) {
      intermediateFrame.boneRotations.set(
        BoneName.SPINE_UPPER,
        new THREE.Euler(
          spineRotation.x + breathingOffset,
          spineRotation.y,
          spineRotation.z,
          spineRotation.order
        )
      );
    }
  }
  
  // Create final recovery keyframe (100% back to neutral)
  const finalFrame: TensionKeyframe = {
    time: finalTime,
    easing: mapEasingToBase(recoveryConfig.easing),
    boneRotations: new Map(),
    bonePositions: new Map(),
    muscleTension: new Map(),
  };
  
  // All bones return to neutral (0 rotation)
  peakKeyframe.boneRotations.forEach((_, boneName) => {
    finalFrame.boneRotations.set(boneName, new THREE.Euler(0, 0, 0));
    // Relaxed state: 10% base tension
    finalFrame.muscleTension!.set(boneName, 0.1);
  });
  
  // All positions return to neutral
  peakKeyframe.bonePositions.forEach((_, boneName) => {
    finalFrame.bonePositions.set(boneName, new THREE.Vector3(0, 0, 0));
  });
  
  // Add breathing completion
  if (recoveryConfig.includeBreathing) {
    const breathingOffset = Math.sin(finalTime * 2 * Math.PI) * 0.01;
    finalFrame.boneRotations.set(
      BoneName.SPINE_UPPER,
      new THREE.Euler(breathingOffset, 0, 0)
    );
  }
  
  // Return new animation with recovery keyframes added
  return {
    ...animation,
    duration: finalTime,
    keyframes: [...animation.keyframes, intermediateFrame, finalFrame],
  };
}

/**
 * Create recovery phase for specific technique type
 * 
 * **Korean**: 기술 유형별 복귀 단계 생성
 * 
 * Generates technique-specific recovery configurations based on martial arts principles.
 * Different techniques require different recovery timings and progressions.
 * 
 * @param techniqueType - Type of technique
 * @returns Recovery configuration optimized for technique type
 * 
 * @public
 * @korean 기술유형복귀생성
 */
export function createTechniqueRecovery(
  techniqueType: "kick" | "punch" | "throw" | "spin"
): RecoveryPhaseConfig {
  switch (techniqueType) {
    case "kick":
      // Kicks need longer recovery due to balance restoration
      return {
        duration: 0.22, // 220ms
        intermediateProgress: 0.75, // 75% back (leg still slightly elevated)
        intermediateTimeRatio: 0.6,
        easing: "ease-out",
      };
    
    case "punch":
      // Punches recover faster, arms return quickly
      return {
        duration: 0.18, // 180ms
        intermediateProgress: 0.85, // 85% back (arms mostly retracted)
        intermediateTimeRatio: 0.65,
        easing: "ease-out",
      };
    
    case "throw":
      // Throws need extended recovery for balance and position reset
      return {
        duration: 0.28, // 280ms
        intermediateProgress: 0.7, // 70% back (significant body repositioning)
        intermediateTimeRatio: 0.5,
        easing: "natural-motion", // More natural physics-based recovery
      };
    
    case "spin":
      // Spinning techniques need longest recovery to stop momentum
      return {
        duration: 0.28, // 280ms
        intermediateProgress: 0.7, // 70% back (rotational momentum dissipates)
        intermediateTimeRatio: 0.55,
        easing: "controlled-slow", // Controlled deceleration
      };
    
    default:
      return DEFAULT_RECOVERY_CONFIG;
  }
}

/**
 * Get muscle tension state from keyframe
 * 
 * **Korean**: 키프레임에서 근육 긴장 상태 가져오기
 * 
 * @param keyframe - Keyframe to extract tension from
 * @returns Muscle tension state by body region
 * 
 * @public
 * @korean 긴장상태가져오기
 */
export function getMuscleTensionState(
  keyframe: TensionKeyframe
): MuscleTensionState {
  if (!keyframe.muscleTension) {
    // Default relaxed state
    return {
      legs: 0.1,
      core: 0.1,
      arms: 0.1,
      shoulders: 0.1,
    };
  }
  
  // Average tension across bone groups
  const legBones = [
    BoneName.HIP_R,
    BoneName.HIP_L,
    BoneName.KNEE_R,
    BoneName.KNEE_L,
  ];
  
  const coreBones = [
    BoneName.PELVIS,
    BoneName.SPINE_LOWER,
    BoneName.SPINE_UPPER,
  ];
  
  const armBones = [
    BoneName.ELBOW_R,
    BoneName.ELBOW_L,
  ];
  
  const shoulderBones = [
    BoneName.SHOULDER_R,
    BoneName.SHOULDER_L,
  ];
  
  const avgTension = (bones: string[]) => {
    const tensions = bones
      .map((bone) => keyframe.muscleTension!.get(bone) || 0.1)
      .filter((t) => t > 0);
    return tensions.length > 0
      ? tensions.reduce((sum, t) => sum + t, 0) / tensions.length
      : 0.1;
  };
  
  return {
    legs: avgTension(legBones),
    core: avgTension(coreBones),
    arms: avgTension(armBones),
    shoulders: avgTension(shoulderBones),
  };
}

/**
 * Validate recovery phase meets requirements
 * 
 * **Korean**: 복귀 단계 검증
 * 
 * Checks that recovery phase meets Korean martial arts standards:
 * - Duration within 150-250ms range
 * - Uses ease-out interpolation
 * - Includes intermediate positions
 * - Releases muscle tension gradually
 * 
 * @param animation - Animation with recovery to validate
 * @returns Validation result with issues found
 * 
 * @public
 * @korean 복귀검증
 */
export function validateRecoveryPhase(
  animation: SkeletalAnimation
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (animation.keyframes.length < 3) {
    issues.push("Animation must have at least 3 keyframes (peak, intermediate, final)");
    return { valid: false, issues };
  }
  
  // Check last two keyframes form recovery phase
  const previousKeyframe = animation.keyframes[animation.keyframes.length - 3];
  const intermediate = animation.keyframes[animation.keyframes.length - 2];
  const final = animation.keyframes[animation.keyframes.length - 1];
  
  const recoveryDuration = final.time - previousKeyframe.time;
  
  // Duration check: 150-250ms
  if (recoveryDuration < 0.15 || recoveryDuration > 0.25) {
    issues.push(
      `Recovery duration ${(recoveryDuration * 1000).toFixed(0)}ms is outside recommended range (150-250ms)`
    );
  }
  
  // Easing check: Should use ease-out
  const validEasings: EasingName[] = ["ease-out", "natural-motion", "controlled-slow"];
  if (!validEasings.includes(intermediate.easing as EasingName)) {
    issues.push(
      `Intermediate keyframe should use ease-out interpolation, got: ${intermediate.easing}`
    );
  }
  
  // Intermediate positions check
  if (intermediate.boneRotations.size === 0 && intermediate.bonePositions.size === 0) {
    issues.push("Intermediate keyframe missing bone transformations");
  }
  
  // Muscle tension check (if TensionKeyframe)
  const tensionFrame = intermediate as TensionKeyframe;
  if (tensionFrame.muscleTension && tensionFrame.muscleTension.size > 0) {
    // Check that tension is releasing (not increasing)
    let allRelaxing = true;
    tensionFrame.muscleTension.forEach((tension) => {
      if (tension > 0.8) {
        allRelaxing = false;
      }
    });
    
    if (!allRelaxing) {
      issues.push("Muscle tension should be releasing during recovery phase");
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}
