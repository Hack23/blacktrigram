/**
 * Head movement animations for combat reactions
 * 
 * Provides realistic head movement animations:
 * - Recoil from strikes
 * - Nods during attacks
 * - Head shakes when stunned
 * - Tilts to avoid hits
 * - Tracking opponent position
 * 
 * @module systems/animation/HeadMovements
 * @category Animation System
 * @korean 머리움직임애니메이션
 */

import * as THREE from "three";
import {
  HeadMovementType,
  type HeadMovementKeyframes,
} from "../../types/facial";

/**
 * Generate head recoil animation from hit
 * 
 * Creates keyframes for head snapping back when struck.
 * Intensity based on hit strength.
 * 
 * @param hitStrength - Strength of hit (0-1)
 * @param hitDirection - Direction vector of hit (normalized)
 * @returns Head movement keyframes for recoil animation
 * 
 * @example
 * ```typescript
 * const recoil = createHeadRecoilAnimation(0.8, new THREE.Vector3(1, 0, 0));
 * // Creates strong recoil animation to the right
 * ```
 * 
 * @public
 * @korean 머리반동애니메이션생성
 */
export const createHeadRecoilAnimation = (
  hitStrength: number,
  hitDirection?: THREE.Vector3
): HeadMovementKeyframes => {
  // Calculate recoil angle based on hit strength (max 35 degrees = 0.61 radians)
  const maxRecoilAngle = 0.61;
  const recoilAngle = hitStrength * maxRecoilAngle;

  // Determine recoil direction (default: backward)
  const direction = hitDirection ? hitDirection.clone().normalize() : new THREE.Vector3(0, 0, -1);
  
  // Calculate rotation angles
  const pitchRecoil = -recoilAngle * Math.abs(direction.z); // Back/forward
  const yawRecoil = recoilAngle * direction.x * 0.5; // Left/right
  const rollRecoil = recoilAngle * direction.x * 0.3; // Roll from side hits

  const rotations = [
    new THREE.Euler(0, 0, 0), // Frame 0: Normal position
    new THREE.Euler(pitchRecoil, yawRecoil, rollRecoil), // Frame 1: Maximum recoil
    new THREE.Euler(pitchRecoil * 0.4, yawRecoil * 0.4, rollRecoil * 0.4), // Frame 2: Bounce back
    new THREE.Euler(0, 0, 0), // Frame 3: Return to normal
  ];

  return {
    type: HeadMovementType.RECOIL,
    rotations,
    frameDuration: 0.05, // 50ms per frame
    totalDuration: 0.15, // 150ms total
    loop: false,
  };
};

/**
 * Generate head nod animation for attacks
 * 
 * Creates subtle forward nod during attack commitment.
 * Represents weight shift and attack intention.
 * 
 * @param intensity - Nod intensity (0-1)
 * @returns Head movement keyframes for nod animation
 * 
 * @public
 * @korean 머리끄덕임애니메이션생성
 */
export const createHeadNodAnimation = (
  intensity = 0.5
): HeadMovementKeyframes => {
  const nodAngle = 0.2 * intensity; // Max ~11 degrees

  const rotations = [
    new THREE.Euler(0, 0, 0), // Frame 0: Normal
    new THREE.Euler(nodAngle, 0, 0), // Frame 1: Nod forward
    new THREE.Euler(nodAngle * 0.5, 0, 0), // Frame 2: Partial return
    new THREE.Euler(0, 0, 0), // Frame 3: Return to normal
  ];

  return {
    type: HeadMovementType.NOD,
    rotations,
    frameDuration: 0.1, // 100ms per frame
    totalDuration: 0.3, // 300ms total
    loop: false,
  };
};

/**
 * Generate head shake animation for stun/disorientation
 * 
 * Creates side-to-side head shake when stunned or disoriented.
 * 
 * @param intensity - Shake intensity (0-1)
 * @returns Head movement keyframes for shake animation
 * 
 * @public
 * @korean 머리흔들기애니메이션생성
 */
export const createHeadShakeAnimation = (
  intensity = 0.7
): HeadMovementKeyframes => {
  const shakeAngle = 0.35 * intensity; // Max ~20 degrees

  const rotations = [
    new THREE.Euler(0, 0, 0), // Frame 0: Center
    new THREE.Euler(0, shakeAngle, 0), // Frame 1: Shake left
    new THREE.Euler(0, -shakeAngle, 0), // Frame 2: Shake right
    new THREE.Euler(0, shakeAngle * 0.6, 0), // Frame 3: Shake left (reduced)
    new THREE.Euler(0, -shakeAngle * 0.6, 0), // Frame 4: Shake right (reduced)
    new THREE.Euler(0, shakeAngle * 0.3, 0), // Frame 5: Shake left (minimal)
    new THREE.Euler(0, -shakeAngle * 0.3, 0), // Frame 6: Shake right (minimal)
    new THREE.Euler(0, 0, 0), // Frame 7: Return to center
  ];

  return {
    type: HeadMovementType.SHAKE,
    rotations,
    frameDuration: 0.08, // 80ms per frame
    totalDuration: 0.56, // 560ms total
    loop: false,
  };
};

/**
 * Generate head tilt animation for dodging
 * 
 * Creates quick head tilt to avoid incoming strike.
 * 
 * @param direction - Tilt direction ("left" or "right")
 * @param intensity - Tilt intensity (0-1)
 * @returns Head movement keyframes for tilt animation
 * 
 * @public
 * @korean 머리기울임애니메이션생성
 */
export const createHeadTiltAnimation = (
  direction: "left" | "right",
  intensity = 0.6
): HeadMovementKeyframes => {
  const tiltAngle = 0.4 * intensity * (direction === "left" ? -1 : 1); // Max ~23 degrees

  const rotations = [
    new THREE.Euler(0, 0, 0), // Frame 0: Normal
    new THREE.Euler(0, 0, tiltAngle), // Frame 1: Tilt
    new THREE.Euler(0, 0, tiltAngle * 0.8), // Frame 2: Hold tilt
    new THREE.Euler(0, 0, 0), // Frame 3: Return to normal
  ];

  return {
    type: HeadMovementType.TILT,
    rotations,
    frameDuration: 0.08, // 80ms per frame
    totalDuration: 0.24, // 240ms total
    loop: false,
  };
};

/**
 * Generate head turn animation for opponent tracking
 * 
 * Creates smooth head turn to face opponent.
 * 
 * @param targetAngle - Target yaw angle in radians
 * @param currentAngle - Current yaw angle in radians
 * @returns Head movement keyframes for turn animation
 * 
 * @public
 * @korean 머리돌리기애니메이션생성
 */
export const createHeadTurnAnimation = (
  targetAngle: number,
  currentAngle = 0
): HeadMovementKeyframes => {
  // Calculate angle difference
  let angleDiff = targetAngle - currentAngle;
  
  // Normalize angle to [-PI, PI]
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

  // Limit maximum turn per animation (max 45 degrees = 0.785 radians)
  const maxTurn = 0.785;
  angleDiff = Math.max(-maxTurn, Math.min(maxTurn, angleDiff));

  const rotations = [
    new THREE.Euler(0, currentAngle, 0), // Frame 0: Current position
    new THREE.Euler(0, currentAngle + angleDiff * 0.5, 0), // Frame 1: Halfway
    new THREE.Euler(0, currentAngle + angleDiff, 0), // Frame 2: Target position
  ];

  return {
    type: HeadMovementType.TURN,
    rotations,
    frameDuration: 0.1, // 100ms per frame
    totalDuration: 0.2, // 200ms total
    loop: false,
  };
};

/**
 * Generate head drop animation for knockout
 * 
 * Creates head dropping forward when fighter is knocked out.
 * 
 * @returns Head movement keyframes for drop animation
 * 
 * @public
 * @korean 머리떨어짐애니메이션생성
 */
export const createHeadDropAnimation = (): HeadMovementKeyframes => {
  const dropAngle = 0.7; // ~40 degrees forward

  const rotations = [
    new THREE.Euler(0, 0, 0), // Frame 0: Normal
    new THREE.Euler(dropAngle * 0.3, 0, 0), // Frame 1: Start dropping
    new THREE.Euler(dropAngle * 0.7, 0, 0), // Frame 2: Continue drop
    new THREE.Euler(dropAngle, 0, 0), // Frame 3: Full drop
  ];

  return {
    type: HeadMovementType.DROP,
    rotations,
    frameDuration: 0.15, // 150ms per frame
    totalDuration: 0.45, // 450ms total
    loop: false,
  };
};

/**
 * Calculate smooth head rotation toward target
 * 
 * Uses linear interpolation (lerp) for smooth head turning.
 * Each Euler angle component is interpolated independently.
 * 
 * @param currentRotation - Current head rotation
 * @param targetPosition - Position to look at
 * @param headPosition - Current head position in world space
 * @param smoothing - Smoothing factor (0-1, lower = smoother)
 * @returns New head rotation
 * 
 * @public
 * @korean 부드러운머리회전계산
 */
export const calculateSmoothHeadRotation = (
  currentRotation: THREE.Euler,
  targetPosition: THREE.Vector3,
  headPosition: THREE.Vector3,
  smoothing = 0.1
): THREE.Euler => {
  // Calculate direction to target
  const direction = new THREE.Vector3()
    .subVectors(targetPosition, headPosition)
    .normalize();

  // Calculate target rotation (look at target)
  const targetRotation = new THREE.Euler();
  targetRotation.y = Math.atan2(direction.x, direction.z);
  targetRotation.x = Math.asin(-direction.y);

  // Limit head rotation range (realistic human limits)
  const maxPitch = 0.7; // ~40 degrees up/down
  const maxYaw = 1.4; // ~80 degrees left/right
  
  targetRotation.x = Math.max(-maxPitch, Math.min(maxPitch, targetRotation.x));
  targetRotation.y = Math.max(-maxYaw, Math.min(maxYaw, targetRotation.y));

  // Smoothly interpolate to target rotation
  const newRotation = new THREE.Euler();
  newRotation.x = THREE.MathUtils.lerp(currentRotation.x, targetRotation.x, smoothing);
  newRotation.y = THREE.MathUtils.lerp(currentRotation.y, targetRotation.y, smoothing);
  newRotation.z = THREE.MathUtils.lerp(currentRotation.z, targetRotation.z, smoothing);

  return newRotation;
};

/**
 * Apply head movement keyframe at given time
 * 
 * Interpolates between keyframes for smooth animation.
 * 
 * @param animation - Head movement keyframes
 * @param currentTime - Current animation time (seconds)
 * @returns Interpolated head rotation
 * 
 * @public
 * @korean 머리움직임키프레임적용
 */
export const applyHeadMovementKeyframe = (
  animation: HeadMovementKeyframes,
  currentTime: number
): THREE.Euler => {
  const { rotations, frameDuration } = animation;

  // Calculate current frame index
  const totalFrames = rotations.length;
  const frameIndex = Math.floor(currentTime / frameDuration);

  // Animation complete
  if (frameIndex >= totalFrames - 1) {
    return rotations[totalFrames - 1].clone();
  }

  // Get current and next keyframes
  const currentFrame = rotations[frameIndex];
  const nextFrame = rotations[frameIndex + 1];

  // Calculate interpolation factor
  const frameProgress = (currentTime % frameDuration) / frameDuration;

  // Interpolate between keyframes
  const interpolated = new THREE.Euler();
  interpolated.x = THREE.MathUtils.lerp(
    currentFrame.x,
    nextFrame.x,
    frameProgress
  );
  interpolated.y = THREE.MathUtils.lerp(
    currentFrame.y,
    nextFrame.y,
    frameProgress
  );
  interpolated.z = THREE.MathUtils.lerp(
    currentFrame.z,
    nextFrame.z,
    frameProgress
  );

  return interpolated;
};

/**
 * Check if head movement animation is complete
 * 
 * @param animation - Head movement keyframes
 * @param currentTime - Current animation time (seconds)
 * @returns True if animation is complete
 * 
 * @public
 * @korean 머리움직임완료확인
 */
export const isHeadMovementComplete = (
  animation: HeadMovementKeyframes,
  currentTime: number
): boolean => {
  return currentTime >= animation.totalDuration;
};

/**
 * Get head movement animation by type
 * 
 * Convenience function to create animation by type with default parameters.
 * 
 * @param type - Type of head movement
 * @param intensity - Animation intensity (0-1)
 * @returns Head movement keyframes
 * 
 * @public
 * @korean 타입별머리움직임가져오기
 */
export const getHeadMovementByType = (
  type: HeadMovementType,
  intensity = 0.7
): HeadMovementKeyframes => {
  switch (type) {
    case HeadMovementType.RECOIL:
      return createHeadRecoilAnimation(intensity);
    case HeadMovementType.NOD:
      return createHeadNodAnimation(intensity);
    case HeadMovementType.SHAKE:
      return createHeadShakeAnimation(intensity);
    case HeadMovementType.TILT:
      return createHeadTiltAnimation("left", intensity);
    case HeadMovementType.DROP:
      return createHeadDropAnimation();
    case HeadMovementType.TURN:
      return createHeadTurnAnimation(0, 0);
    default:
      return createHeadNodAnimation(0);
  }
};
