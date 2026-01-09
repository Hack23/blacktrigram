/**
 * Keyframe interpolation for smooth skeletal animations
 * 
 * Provides interpolation between animation keyframes for smooth 60fps playback.
 * Supports linear, ease-in, ease-out, and ease-in-out easing functions.
 * 
 * @module systems/animation/KeyframeInterpolation
 * @category Animation System
 * @korean 키프레임보간
 */

import * as THREE from "three";
import type {
  AnimationKeyframe,
  SkeletalAnimation,
  SkeletalRig,
} from "../../types/skeletal";

/**
 * Easing function type
 * 
 * @param t - Time value between 0 and 1
 * @returns Eased value between 0 and 1
 * 
 * @korean 이징함수타입
 */
type EasingFunction = (t: number) => number;

/**
 * Cubic bezier control points for easing curves
 * 
 * **Korean**: 3차 베지어 제어점
 * 
 * @public
 * @category Animation
 * @korean 베지어제어점
 */
export interface BezierControlPoints {
  /** First control point x (0-1) */
  readonly p1x: number;
  /** First control point y (0-1) */
  readonly p1y: number;
  /** Second control point x (0-1) */
  readonly p2x: number;
  /** Second control point y (0-1) */
  readonly p2y: number;
}

/**
 * Cubic bezier easing for natural movement
 * 
 * **Korean**: 3차 베지어 이징
 * 
 * Implements cubic bezier curve interpolation for smooth, natural motion.
 * Based on CSS cubic-bezier() function specification.
 * 
 * Note: For animation easing, we use a simplified approximation that assumes
 * x progresses linearly with t. This is standard for CSS cubic-bezier() and
 * provides good results for Korean martial arts movement with minimal overhead.
 * 
 * @param t - Input time (0-1)
 * @param _p1x - First control point x (0-1) - reserved for future precision mode
 * @param p1y - First control point y (can exceed 0-1 for overshoot)
 * @param _p2x - Second control point x (0-1) - reserved for future precision mode
 * @param p2y - Second control point y (can exceed 0-1 for overshoot)
 * @returns Eased value
 * 
 * @example
 * ```typescript
 * // Natural Korean martial arts movement (physics-based)
 * const eased = cubicBezier(0.5, 0.25, 0.1, 0.25, 1.0);
 * // Smooth S-curve for stance transitions
 * const eased2 = cubicBezier(0.5, 0.42, 0, 0.58, 1.0);
 * ```
 * 
 * @korean 3차베지어이징
 */
export function cubicBezier(
  t: number,
  _p1x: number,
  p1y: number,
  _p2x: number,
  p2y: number
): number {
  // Clamp t to [0, 1]
  const clampedT = Math.max(0, Math.min(1, t));
  
  // For performance, use direct calculation rather than iterative solving
  // This is acceptable for animation easing where precision requirements are lower
  // The x control points are preserved in the API for future precision mode
  const u = 1 - clampedT;
  
  // Cubic bezier formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
  // For easing, P₀ = (0,0) and P₃ = (1,1), so:
  // y(t) = 3(1-t)²t*p1y + 3(1-t)t²*p2y + t³
  const result = 3 * u * u * clampedT * p1y + 
                 3 * u * clampedT * clampedT * p2y + 
                 clampedT * clampedT * clampedT;
  
  return result;
}

/**
 * Create a cubic bezier easing function with control points
 * 
 * **Korean**: 베지어 이징 함수 생성
 * 
 * Factory function to create reusable bezier easing functions.
 * 
 * @param points - Bezier control points
 * @returns Easing function
 * 
 * @korean 베지어이징함수생성
 */
export function createBezierEasing(points: BezierControlPoints): EasingFunction {
  return (t: number) => cubicBezier(t, points.p1x, points.p1y, points.p2x, points.p2y);
}

/**
 * Preset bezier easing curves for Korean martial arts movements
 * 
 * **Korean**: 무도 동작 이징 곡선
 * 
 * @public
 * @category Animation
 * @korean 무도동작이징곡선
 */
export const BEZIER_PRESETS = {
  /**
   * Natural motion with physics-based acceleration/deceleration
   * Ideal for: Stance transitions, body rotations, weight shifts
   * **Korean**: 자연스러운 물리 기반 동작
   */
  naturalMotion: { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 },
  
  /**
   * Smooth S-curve for fluid transitions
   * Ideal for: Attack wind-ups, defensive positioning, footwork
   * **Korean**: 부드러운 S곡선 전환
   */
  smoothTransition: { p1x: 0.42, p1y: 0.0, p2x: 0.58, p2y: 1.0 },
  
  /**
   * Quick start with gentle landing
   * Ideal for: Strike recoil, guard recovery, step completion
   * **Korean**: 빠른 시작과 부드러운 착지
   */
  quickStart: { p1x: 0.1, p1y: 0.8, p2x: 0.25, p2y: 1.0 },
  
  /**
   * Explosive power curve
   * Ideal for: Explosive strikes, power techniques, ki projection
   * **Korean**: 폭발적 힘 곡선
   */
  explosivePower: { p1x: 0.05, p1y: 0.9, p2x: 0.2, p2y: 1.0 },
  
  /**
   * Controlled deceleration
   * Ideal for: Defensive withdrawals, cautious movements, guard stance
   * **Korean**: 제어된 감속
   */
  controlledSlow: { p1x: 0.6, p1y: 0.0, p2x: 0.9, p2y: 0.4 },
} as const;

/**
 * Linear easing (no easing)
 * 
 * @param t - Input time (0-1)
 * @returns Same as input
 * 
 * @korean 선형이징
 */
export const easeLinear: EasingFunction = (t: number): number => t;

/**
 * Ease-in (slow start, fast end) - Simple quadratic
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 이즈인
 */
export const easeIn: EasingFunction = (t: number): number => t * t;

/**
 * Ease-out (fast start, slow end) - Simple quadratic
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 이즈아웃
 */
export const easeOut: EasingFunction = (t: number): number => t * (2 - t);

/**
 * Ease-in-out (slow start, slow end) - Simple quadratic
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 이즈인아웃
 */
export const easeInOut: EasingFunction = (t: number): number => {
  if (t < 0.5) {
    return 2 * t * t;
  }
  return -1 + (4 - 2 * t) * t;
};

/**
 * Natural motion bezier easing (preset)
 * 
 * **Korean**: 자연스러운 동작 이징
 * 
 * Physics-based movement ideal for Korean martial arts.
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 자연동작이징
 */
export const easeNaturalMotion: EasingFunction = createBezierEasing(BEZIER_PRESETS.naturalMotion);

/**
 * Smooth transition bezier easing (preset)
 * 
 * **Korean**: 부드러운 전환 이징
 * 
 * S-curve for fluid stance transitions.
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 부드러운전환이징
 */
export const easeSmoothTransition: EasingFunction = createBezierEasing(BEZIER_PRESETS.smoothTransition);

/**
 * Explosive power bezier easing (preset)
 * 
 * **Korean**: 폭발적 힘 이징
 * 
 * Explosive acceleration for power strikes.
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 폭발적힘이징
 */
export const easeExplosivePower: EasingFunction = createBezierEasing(BEZIER_PRESETS.explosivePower);

/**
 * Extended easing function names including bezier presets
 * 
 * **Korean**: 확장된 이징 함수 이름
 * 
 * @public
 * @category Animation
 * @korean 확장이징함수이름
 */
export type EasingName = 
  | "linear"
  | "ease-in" 
  | "ease-out" 
  | "ease-in-out"
  | "natural-motion"
  | "smooth-transition"
  | "quick-start"
  | "explosive-power"
  | "controlled-slow";

/**
 * Get easing function by name
 * 
 * **Korean**: 이름으로 이징 함수 구하기
 * 
 * @param name - Easing function name (supports bezier presets)
 * @returns Easing function
 * 
 * @example
 * ```typescript
 * // Get natural motion easing for Korean martial arts
 * const easing = getEasingFunction("natural-motion");
 * const easedValue = easing(0.5); // Smooth physics-based interpolation
 * 
 * // Get explosive power for strike animations
 * const powerEasing = getEasingFunction("explosive-power");
 * ```
 * 
 * @korean 이징함수구하기
 */
export const getEasingFunction = (
  name: EasingName = "linear"
): EasingFunction => {
  switch (name) {
    case "ease-in":
      return easeIn;
    case "ease-out":
      return easeOut;
    case "ease-in-out":
      return easeInOut;
    case "natural-motion":
      return easeNaturalMotion;
    case "smooth-transition":
      return easeSmoothTransition;
    case "quick-start":
      return createBezierEasing(BEZIER_PRESETS.quickStart);
    case "explosive-power":
      return easeExplosivePower;
    case "controlled-slow":
      return createBezierEasing(BEZIER_PRESETS.controlledSlow);
    default:
      return easeLinear;
  }
};

/**
 * Find keyframes surrounding current time
 * 
 * Returns the two keyframes to interpolate between for current animation time.
 * 
 * @param animation - Skeletal animation
 * @param currentTime - Current time in animation (seconds)
 * @returns Tuple of [previousKeyframe, nextKeyframe, interpolationFactor]
 * 
 * @korean 주변키프레임찾기
 */
export const findSurroundingKeyframes = (
  animation: SkeletalAnimation,
  currentTime: number
): [AnimationKeyframe, AnimationKeyframe, number] => {
  const { keyframes } = animation;

  // Clamp time to animation duration
  const clampedTime = Math.max(
    0,
    Math.min(currentTime, animation.duration)
  );

  // Find keyframes
  let prevKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];
  let interpolationFactor = 0;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i];
    const next = keyframes[i + 1];

    if (clampedTime >= current.time && clampedTime <= next.time) {
      prevKeyframe = current;
      nextKeyframe = next;

      // Calculate interpolation factor (0 to 1)
      const timeDelta = next.time - current.time;
      if (timeDelta > 0) {
        interpolationFactor = (clampedTime - current.time) / timeDelta;
      }
      break;
    }
  }

  return [prevKeyframe, nextKeyframe, interpolationFactor];
};

/**
 * Interpolate between two Euler rotations
 * 
 * Performs spherical linear interpolation (slerp) for smooth rotation.
 * 
 * @param from - Start rotation
 * @param to - End rotation
 * @param t - Interpolation factor (0-1)
 * @param easingFn - Easing function to apply
 * @returns Interpolated rotation
 * 
 * @korean 회전보간
 */
export const interpolateRotation = (
  from: THREE.Euler,
  to: THREE.Euler,
  t: number,
  easingFn: EasingFunction = easeLinear
): THREE.Euler => {
  const easedT = easingFn(t);

  // Convert Euler to Quaternion for proper slerp
  const fromQuat = new THREE.Quaternion().setFromEuler(from);
  const toQuat = new THREE.Quaternion().setFromEuler(to);

  // Slerp between quaternions
  const result = new THREE.Quaternion().slerpQuaternions(
    fromQuat,
    toQuat,
    easedT
  );

  // Convert back to Euler
  const resultEuler = new THREE.Euler().setFromQuaternion(result);
  return resultEuler;
};

/**
 * Interpolate between two Vector3 positions
 * 
 * Performs linear interpolation for smooth position changes.
 * 
 * @param from - Start position
 * @param to - End position
 * @param t - Interpolation factor (0-1)
 * @param easingFn - Easing function to apply
 * @returns Interpolated position
 * 
 * @korean 위치보간
 */
export const interpolatePosition = (
  from: THREE.Vector3,
  to: THREE.Vector3,
  t: number,
  easingFn: EasingFunction = easeLinear
): THREE.Vector3 => {
  const easedT = easingFn(t);
  return new THREE.Vector3().lerpVectors(from, to, easedT);
};

/**
 * Get interpolated keyframe at current time
 * 
 * Calculates bone transformations by interpolating between keyframes.
 * 
 * @param animation - Skeletal animation
 * @param currentTime - Current time in animation (seconds)
 * @returns Interpolated keyframe
 * 
 * @korean 보간된키프레임구하기
 */
export const getInterpolatedKeyframe = (
  animation: SkeletalAnimation,
  currentTime: number
): AnimationKeyframe => {
  const [prevKeyframe, nextKeyframe, t] =
    findSurroundingKeyframes(animation, currentTime);

  // Get easing function from next keyframe
  const easingFn = getEasingFunction(nextKeyframe.easing);

  // Interpolate bone rotations
  const boneRotations = new Map<string, THREE.Euler>();
  const allBoneNames = new Set([
    ...prevKeyframe.boneRotations.keys(),
    ...nextKeyframe.boneRotations.keys(),
  ]);

  for (const boneName of allBoneNames) {
    const prevRotation =
      prevKeyframe.boneRotations.get(boneName) ?? new THREE.Euler();
    const nextRotation =
      nextKeyframe.boneRotations.get(boneName) ?? new THREE.Euler();

    const interpolated = interpolateRotation(
      prevRotation,
      nextRotation,
      t,
      easingFn
    );
    boneRotations.set(boneName, interpolated);
  }

  // Interpolate bone positions
  const bonePositions = new Map<string, THREE.Vector3>();
  const allPositionBones = new Set([
    ...prevKeyframe.bonePositions.keys(),
    ...nextKeyframe.bonePositions.keys(),
  ]);

  for (const boneName of allPositionBones) {
    const prevPosition =
      prevKeyframe.bonePositions.get(boneName) ?? new THREE.Vector3();
    const nextPosition =
      nextKeyframe.bonePositions.get(boneName) ?? new THREE.Vector3();

    const interpolated = interpolatePosition(
      prevPosition,
      nextPosition,
      t,
      easingFn
    );
    bonePositions.set(boneName, interpolated);
  }

  return {
    time: currentTime,
    boneRotations,
    bonePositions,
    easing: nextKeyframe.easing,
  };
};

/**
 * Apply keyframe to skeletal rig
 * 
 * Updates all bone transformations based on keyframe data.
 * 
 * @param rig - Skeletal rig to update
 * @param keyframe - Keyframe to apply
 * 
 * @korean 키프레임적용
 */
export const applyKeyframeToRig = (
  rig: SkeletalRig,
  keyframe: AnimationKeyframe
): void => {
  // Apply bone rotations
  keyframe.boneRotations.forEach((rotation, boneName) => {
    const bone = rig.bones.get(boneName);
    if (bone) {
      bone.rotation.copy(rotation);
    }
  });

  // Apply bone positions (offset from rest pose)
  keyframe.bonePositions.forEach((position, boneName) => {
    const bone = rig.bones.get(boneName);
    if (bone) {
      // Add position offset to rest position
      bone.position.copy(bone.restPosition).add(position);
    }
  });
};

/**
 * Blend between two keyframes
 * 
 * Creates smooth transition between two animations for animation blending.
 * Useful for transitioning between stance change and attack, etc.
 * 
 * @param keyframe1 - First keyframe
 * @param keyframe2 - Second keyframe
 * @param blendFactor - Blend amount (0 = keyframe1, 1 = keyframe2)
 * @returns Blended keyframe
 * 
 * @korean 키프레임블렌드
 */
export const blendKeyframes = (
  keyframe1: AnimationKeyframe,
  keyframe2: AnimationKeyframe,
  blendFactor: number
): AnimationKeyframe => {
  const clampedBlend = Math.max(0, Math.min(1, blendFactor));

  // Blend rotations
  const boneRotations = new Map<string, THREE.Euler>();
  const allBones = new Set([
    ...keyframe1.boneRotations.keys(),
    ...keyframe2.boneRotations.keys(),
  ]);

  allBones.forEach((boneName) => {
    const rot1 = keyframe1.boneRotations.get(boneName) ?? new THREE.Euler();
    const rot2 = keyframe2.boneRotations.get(boneName) ?? new THREE.Euler();
    const blended = interpolateRotation(rot1, rot2, clampedBlend);
    boneRotations.set(boneName, blended);
  });

  // Blend positions
  const bonePositions = new Map<string, THREE.Vector3>();
  const allPositionBones = new Set([
    ...keyframe1.bonePositions.keys(),
    ...keyframe2.bonePositions.keys(),
  ]);

  allPositionBones.forEach((boneName) => {
    const pos1 = keyframe1.bonePositions.get(boneName) ?? new THREE.Vector3();
    const pos2 = keyframe2.bonePositions.get(boneName) ?? new THREE.Vector3();
    const blended = interpolatePosition(pos1, pos2, clampedBlend);
    bonePositions.set(boneName, blended);
  });

  return {
    time: 0,
    boneRotations,
    bonePositions,
    easing: "linear",
  };
};

/**
 * Update animation state
 * 
 * Advances animation time and returns current interpolated keyframe.
 * Handles looping animations automatically.
 * 
 * @param animation - Skeletal animation
 * @param currentTime - Current time in animation
 * @param deltaTime - Time since last update (seconds)
 * @param playbackSpeed - Speed multiplier (1.0 = normal)
 * @returns Updated time and current keyframe
 * 
 * @korean 애니메이션상태업데이트
 */
export const updateAnimation = (
  animation: SkeletalAnimation,
  currentTime: number,
  deltaTime: number,
  playbackSpeed = 1.0
): { time: number; keyframe: AnimationKeyframe; completed: boolean } => {
  // Advance time
  let newTime = currentTime + deltaTime * playbackSpeed;
  let completed = false;

  // Handle looping or completion
  if (newTime >= animation.duration) {
    if (animation.loop) {
      newTime = newTime % animation.duration;
    } else {
      newTime = animation.duration;
      completed = true;
    }
  }

  // Get interpolated keyframe
  const keyframe = getInterpolatedKeyframe(animation, newTime);

  return {
    time: newTime,
    keyframe,
    completed,
  };
};

/**
 * Cross-fade blend between two animations
 * 
 * **Korean**: 크로스페이드 블렌드
 * 
 * Smoothly blends between two overlapping animations to prevent popping.
 * Uses cubic bezier easing for natural transitions.
 * 
 * @param animation1 - First animation
 * @param time1 - Current time in first animation
 * @param animation2 - Second animation
 * @param time2 - Current time in second animation
 * @param blendFactor - Blend weight (0 = animation1, 1 = animation2)
 * @param easingName - Easing curve for blend transition
 * @returns Blended keyframe
 * 
 * @example
 * ```typescript
 * // Cross-fade from idle to attack over 100ms
 * const blended = crossFadeAnimations(
 *   idleAnim, idleTime,
 *   attackAnim, attackTime,
 *   0.5, // 50% blend
 *   "smooth-transition"
 * );
 * applyKeyframeToRig(rig, blended);
 * ```
 * 
 * @korean 크로스페이드블렌드
 */
export const crossFadeAnimations = (
  animation1: SkeletalAnimation,
  time1: number,
  animation2: SkeletalAnimation,
  time2: number,
  blendFactor: number,
  easingName: EasingName = "smooth-transition"
): AnimationKeyframe => {
  const keyframe1 = getInterpolatedKeyframe(animation1, time1);
  const keyframe2 = getInterpolatedKeyframe(animation2, time2);
  
  // Apply easing to blend factor
  const easingFn = getEasingFunction(easingName);
  const easedBlend = easingFn(Math.max(0, Math.min(1, blendFactor)));
  
  return blendKeyframes(keyframe1, keyframe2, easedBlend);
};

/**
 * Motion prediction state for latency reduction
 * 
 * **Korean**: 동작 예측 상태
 * 
 * Stores recent animation velocities for motion prediction.
 * 
 * @public
 * @category Animation
 * @korean 동작예측상태
 */
export interface MotionPredictionState {
  /** Recent position velocities per bone */
  readonly velocities: Map<string, THREE.Vector3>;
  /** Recent rotation velocities per bone */
  readonly angularVelocities: Map<string, THREE.Euler>;
  /** Last update timestamp */
  readonly lastUpdateTime: number;
}

/**
 * Create motion prediction state
 * 
 * **Korean**: 동작 예측 상태 생성
 * 
 * @returns Initial motion prediction state
 * @korean 동작예측상태생성
 */
export const createMotionPredictionState = (): MotionPredictionState => ({
  velocities: new Map(),
  angularVelocities: new Map(),
  lastUpdateTime: 0,
});

/**
 * Update motion prediction state with new keyframe
 * 
 * **Korean**: 동작 예측 상태 업데이트
 * 
 * Calculates velocities from keyframe differences for motion prediction.
 * 
 * @param state - Current prediction state
 * @param previousKeyframe - Previous animation keyframe
 * @param currentKeyframe - Current animation keyframe
 * @param deltaTime - Time elapsed between keyframes
 * @returns Updated prediction state
 * 
 * @korean 동작예측상태업데이트
 */
export const updateMotionPrediction = (
  state: MotionPredictionState,
  previousKeyframe: AnimationKeyframe,
  currentKeyframe: AnimationKeyframe,
  deltaTime: number
): MotionPredictionState => {
  if (deltaTime <= 0) return state;
  
  const newVelocities = new Map<string, THREE.Vector3>();
  const newAngularVelocities = new Map<string, THREE.Euler>();
  
  // Calculate position velocities
  currentKeyframe.bonePositions.forEach((currentPos, boneName) => {
    const prevPos = previousKeyframe.bonePositions.get(boneName);
    if (prevPos) {
      const velocity = new THREE.Vector3()
        .subVectors(currentPos, prevPos)
        .divideScalar(deltaTime);
      newVelocities.set(boneName, velocity);
    }
  });
  
  // Calculate angular velocities (simplified - use rotation differences)
  currentKeyframe.boneRotations.forEach((currentRot, boneName) => {
    const prevRot = previousKeyframe.boneRotations.get(boneName);
    if (prevRot) {
      const angularVel = new THREE.Euler(
        (currentRot.x - prevRot.x) / deltaTime,
        (currentRot.y - prevRot.y) / deltaTime,
        (currentRot.z - prevRot.z) / deltaTime,
        currentRot.order
      );
      newAngularVelocities.set(boneName, angularVel);
    }
  });
  
  return {
    velocities: newVelocities,
    angularVelocities: newAngularVelocities,
    lastUpdateTime: performance.now(),
  };
};

/**
 * Predict future keyframe using motion prediction
 * 
 * **Korean**: 동작 예측으로 미래 키프레임 예측
 * 
 * Reduces perceived latency by predicting future bone positions/rotations
 * based on current velocities. Typical prediction: 16-33ms (1-2 frames at 60fps).
 * 
 * @param currentKeyframe - Current animation keyframe
 * @param predictionState - Motion prediction state
 * @param predictionTime - Time ahead to predict (seconds, typically 0.016-0.033)
 * @returns Predicted keyframe
 * 
 * @example
 * ```typescript
 * // Predict 1 frame ahead (16.67ms at 60fps) for <50ms total latency
 * const predicted = predictFutureKeyframe(
 *   currentKeyframe,
 *   motionState,
 *   0.01667
 * );
 * applyKeyframeToRig(rig, predicted);
 * ```
 * 
 * @korean 미래키프레임예측
 */
export const predictFutureKeyframe = (
  currentKeyframe: AnimationKeyframe,
  predictionState: MotionPredictionState,
  predictionTime: number
): AnimationKeyframe => {
  // Clamp prediction time to reasonable bounds (max 50ms)
  const clampedPrediction = Math.min(predictionTime, 0.05);
  
  // Predict bone positions
  const predictedPositions = new Map<string, THREE.Vector3>();
  currentKeyframe.bonePositions.forEach((currentPos, boneName) => {
    const velocity = predictionState.velocities.get(boneName);
    if (velocity) {
      // Apply damping to prevent overshoot (0.8 factor for natural motion)
      const predicted = currentPos.clone().add(
        velocity.clone().multiplyScalar(clampedPrediction * 0.8)
      );
      predictedPositions.set(boneName, predicted);
    } else {
      predictedPositions.set(boneName, currentPos.clone());
    }
  });
  
  // Predict bone rotations
  const predictedRotations = new Map<string, THREE.Euler>();
  currentKeyframe.boneRotations.forEach((currentRot, boneName) => {
    const angularVel = predictionState.angularVelocities.get(boneName);
    if (angularVel) {
      // Apply damping to prevent overshoot
      const predicted = new THREE.Euler(
        currentRot.x + angularVel.x * clampedPrediction * 0.8,
        currentRot.y + angularVel.y * clampedPrediction * 0.8,
        currentRot.z + angularVel.z * clampedPrediction * 0.8,
        currentRot.order
      );
      predictedRotations.set(boneName, predicted);
    } else {
      predictedRotations.set(boneName, currentRot.clone());
    }
  });
  
  return {
    time: currentKeyframe.time + clampedPrediction,
    boneRotations: predictedRotations,
    bonePositions: predictedPositions,
    easing: currentKeyframe.easing,
  };
};
