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
 * Linear easing (no easing)
 * 
 * @param t - Input time (0-1)
 * @returns Same as input
 * 
 * @korean 선형이징
 */
export const easeLinear: EasingFunction = (t: number): number => t;

/**
 * Ease-in (slow start, fast end)
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 이즈인
 */
export const easeIn: EasingFunction = (t: number): number => t * t;

/**
 * Ease-out (fast start, slow end)
 * 
 * @param t - Input time (0-1)
 * @returns Eased value
 * 
 * @korean 이즈아웃
 */
export const easeOut: EasingFunction = (t: number): number => t * (2 - t);

/**
 * Ease-in-out (slow start, slow end)
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
 * Get easing function by name
 * 
 * @param name - Easing function name
 * @returns Easing function
 * 
 * @korean 이징함수구하기
 */
export const getEasingFunction = (
  name: "linear" | "ease-in" | "ease-out" | "ease-in-out" = "linear"
): EasingFunction => {
  switch (name) {
    case "ease-in":
      return easeIn;
    case "ease-out":
      return easeOut;
    case "ease-in-out":
      return easeInOut;
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

  allBoneNames.forEach((boneName) => {
    const prevRotation =
      prevKeyframe.boneRotations.get(boneName) || new THREE.Euler();
    const nextRotation =
      nextKeyframe.boneRotations.get(boneName) || new THREE.Euler();

    const interpolated = interpolateRotation(
      prevRotation,
      nextRotation,
      t,
      easingFn
    );
    boneRotations.set(boneName, interpolated);
  });

  // Interpolate bone positions
  const bonePositions = new Map<string, THREE.Vector3>();
  const allPositionBones = new Set([
    ...prevKeyframe.bonePositions.keys(),
    ...nextKeyframe.bonePositions.keys(),
  ]);

  allPositionBones.forEach((boneName) => {
    const prevPosition =
      prevKeyframe.bonePositions.get(boneName) || new THREE.Vector3();
    const nextPosition =
      nextKeyframe.bonePositions.get(boneName) || new THREE.Vector3();

    const interpolated = interpolatePosition(
      prevPosition,
      nextPosition,
      t,
      easingFn
    );
    bonePositions.set(boneName, interpolated);
  });

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
    const rot1 = keyframe1.boneRotations.get(boneName) || new THREE.Euler();
    const rot2 = keyframe2.boneRotations.get(boneName) || new THREE.Euler();
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
    const pos1 = keyframe1.bonePositions.get(boneName) || new THREE.Vector3();
    const pos2 = keyframe2.bonePositions.get(boneName) || new THREE.Vector3();
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
