/**
 * Body Facing Direction System for Black Trigram
 * 
 * Manages automatic character rotation to face opponent with:
 * - Smooth torso rotation at 45°/sec (±90° range)
 * - Independent head tracking (±45° range)
 * - 180° turn animations for repositioning
 * - Facing lock during attack/defend animations
 * 
 * Korean terminology:
 * - 정면향하기 (Jeongmyeon Hyanghagi) - Face forward
 * - 몸회전 (Mom Hoejeon) - Body rotation
 * - 머리추적 (Meori Chujok) - Head tracking
 * - 180도회전 (180-do Hoejeon) - 180-degree turn
 * 
 * @module systems/animation/BodyFacingSystem
 * @category Animation System
 * @korean 몸향하기시스템
 */

import { Position } from "@/types";
import type { BodyFacing } from "./types";

/**
 * Default rotation speed in degrees per second
 * 45°/sec provides smooth, realistic rotation
 * 
 * @korean 기본회전속도
 */
export const DEFAULT_ROTATION_SPEED = 45;

/**
 * Maximum torso rotation range in degrees
 * Torso can rotate ±90° from facing direction
 * 
 * @korean 최대몸통회전
 */
export const MAX_TORSO_ROTATION = 90;

/**
 * Maximum head rotation offset in degrees
 * Head can track independently ±45° from torso
 * 
 * @korean 최대머리회전
 */
export const MAX_HEAD_ROTATION = 45;

/**
 * Threshold angle for triggering 180° turn animation
 * If angle difference exceeds this, play full turn animation
 * 
 * @korean 180도회전기준각도
 */
export const TURN_THRESHOLD_ANGLE = 90;

/**
 * Duration of 180° turn animation in milliseconds
 * 12 frames at 60fps = 200ms
 * 
 * @korean 회전애니메이션시간
 */
export const TURN_ANIMATION_DURATION = 200;

/**
 * Head tracking smoothing factor (0-1)
 * Lower values = smoother but slower head tracking
 * 0.1 = smooth, natural head movement
 * 
 * @korean 머리추적부드러움
 */
export const HEAD_TRACKING_SMOOTHING = 0.1;

/**
 * Normalizes an angle to 0-360 degree range
 * 
 * @param angle - Angle in degrees
 * @returns Normalized angle in 0-360 range
 * 
 * @example
 * ```typescript
 * normalizeAngle(370); // Returns 10
 * normalizeAngle(-30); // Returns 330
 * ```
 * 
 * @public
 * @korean 각도정규화
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  // Handle -0 edge case (JavaScript quirk)
  return normalized === 0 ? 0 : normalized;
}

/**
 * Calculates the shortest angular difference between two angles
 * Returns value in range [-180, 180]
 * - Positive = clockwise rotation
 * - Negative = counter-clockwise rotation
 * 
 * @param from - Starting angle in degrees
 * @param to - Target angle in degrees
 * @returns Shortest angular difference in degrees
 * 
 * @example
 * ```typescript
 * calculateAngleDifference(10, 350); // Returns -20 (turn left)
 * calculateAngleDifference(350, 10); // Returns 20 (turn right)
 * calculateAngleDifference(0, 180); // Returns 180
 * ```
 * 
 * @public
 * @korean 각도차이계산
 */
export function calculateAngleDifference(from: number, to: number): number {
  const fromNorm = normalizeAngle(from);
  const toNorm = normalizeAngle(to);
  
  let diff = toNorm - fromNorm;
  
  // Find shortest path
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  
  return diff;
}

/**
 * Calculates angle from one position to another
 * Returns angle in degrees (0-360)
 * - 0° = pointing right (+X)
 * - 90° = pointing down (+Z)
 * - 180° = pointing left (-X)
 * - 270° = pointing up (-Z)
 * 
 * @param from - Starting position
 * @param to - Target position
 * @returns Angle in degrees
 * 
 * @example
 * ```typescript
 * calculateAngleToTarget({ x: 0, y: 0 }, { x: 1, y: 0 }); // Returns 0° (right)
 * calculateAngleToTarget({ x: 0, y: 0 }, { x: 0, y: 1 }); // Returns 90° (down)
 * ```
 * 
 * @public
 * @korean 목표각도계산
 */
export function calculateAngleToTarget(from: Position, to: Position): number {
  const dx = to.x - from.x;
  const dz = to.y - from.y; // Position.y is Z coordinate in 2D top-down
  
  // atan2 returns angle in radians, convert to degrees
  // atan2(y, x) where y is forward/back (Z), x is left/right (X)
  let angle = Math.atan2(dz, dx) * (180 / Math.PI);
  
  return normalizeAngle(angle);
}

/**
 * Linear interpolation between two values
 * 
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 * 
 * @private
 * @korean 선형보간
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Creates default body facing state
 * 
 * @param initialAngle - Initial facing angle in degrees (default: 0)
 * @returns Default BodyFacing state
 * 
 * @public
 * @korean 기본몸향하기생성
 */
export function createDefaultBodyFacing(initialAngle = 0): BodyFacing {
  return {
    currentAngle: normalizeAngle(initialAngle),
    targetAngle: normalizeAngle(initialAngle),
    rotationSpeed: DEFAULT_ROTATION_SPEED,
    headAngleOffset: 0,
    isLocked: false,
    isTurning: false,
  };
}

/**
 * Updates body facing direction with smooth rotation
 * 
 * Performs smooth rotation toward target angle at specified speed.
 * Handles:
 * - Rotation locking during attacks
 * - 180° turn animation triggering
 * - Head tracking with independent offset
 * - Smooth interpolation at 45°/sec
 * 
 * @param facing - Current body facing state
 * @param targetAngle - Desired facing angle in degrees
 * @param deltaTime - Time elapsed since last update in seconds
 * @param currentTime - Current timestamp in milliseconds
 * @returns Updated body facing state
 * 
 * @example
 * ```typescript
 * const facing = createDefaultBodyFacing(0);
 * const updated = updateBodyFacing(facing, 90, 0.016, Date.now());
 * // Rotates ~0.72° toward 90° (45°/sec * 0.016s)
 * ```
 * 
 * @public
 * @korean 몸향하기업데이트
 */
export function updateBodyFacing(
  facing: BodyFacing,
  targetAngle: number,
  deltaTime: number,
  currentTime: number
): BodyFacing {
  // If locked, no rotation allowed
  if (facing.isLocked) {
    return facing;
  }

  // Check if 180° turn animation is in progress
  if (facing.isTurning && facing.turnStartTime) {
    const elapsed = currentTime - facing.turnStartTime;
    
    if (elapsed >= TURN_ANIMATION_DURATION) {
      // Turn animation complete - snap to target angle
      return {
        ...facing,
        currentAngle: normalizeAngle(targetAngle),
        targetAngle: normalizeAngle(targetAngle),
        headAngleOffset: 0,
        isTurning: false,
        turnDirection: undefined,
        turnStartTime: undefined,
      };
    }
    
    // Still turning - don't update angle yet
    return {
      ...facing,
      targetAngle: normalizeAngle(targetAngle),
    };
  }

  // Calculate angle difference
  const angleDiff = calculateAngleDifference(facing.currentAngle, targetAngle);

  // Check if 180° turn is needed
  if (Math.abs(angleDiff) > TURN_THRESHOLD_ANGLE && !facing.isTurning) {
    // Trigger 180° turn animation
    return {
      ...facing,
      targetAngle: normalizeAngle(targetAngle),
      isTurning: true,
      turnDirection: angleDiff > 0 ? 'right' : 'left',
      turnStartTime: currentTime,
    };
  }

  // Calculate maximum rotation for this frame
  const maxRotation = facing.rotationSpeed * deltaTime;
  
  // Calculate actual rotation (limited by max rotation)
  const rotation = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxRotation);

  // Update current angle
  const newCurrentAngle = normalizeAngle(facing.currentAngle + rotation);

  // Update head tracking (±45° range independent of torso)
  // Head smoothly tracks toward target within allowed range
  const remainingDiff = calculateAngleDifference(newCurrentAngle, targetAngle);
  const targetHeadOffset = Math.max(
    -MAX_HEAD_ROTATION,
    Math.min(MAX_HEAD_ROTATION, remainingDiff)
  );
  
  const newHeadOffset = lerp(
    facing.headAngleOffset,
    targetHeadOffset,
    HEAD_TRACKING_SMOOTHING
  );

  return {
    ...facing,
    currentAngle: newCurrentAngle,
    targetAngle: normalizeAngle(targetAngle),
    headAngleOffset: newHeadOffset,
  };
}

/**
 * Updates facing direction to point toward opponent
 * 
 * Calculates target angle based on opponent position and updates
 * body facing state with smooth rotation.
 * 
 * @param facing - Current body facing state
 * @param playerPosition - Player's current position
 * @param opponentPosition - Opponent's current position
 * @param deltaTime - Time elapsed since last update in seconds
 * @param currentTime - Current timestamp in milliseconds
 * @returns Updated body facing state
 * 
 * @example
 * ```typescript
 * const updated = updateFacingTowardOpponent(
 *   facing,
 *   { x: 100, y: 200 },
 *   { x: 300, y: 200 },
 *   0.016,
 *   Date.now()
 * );
 * // Faces toward opponent (pointing right in this case)
 * ```
 * 
 * @public
 * @korean 상대방향하기업데이트
 */
export function updateFacingTowardOpponent(
  facing: BodyFacing,
  playerPosition: Position,
  opponentPosition: Position,
  deltaTime: number,
  currentTime: number
): BodyFacing {
  const targetAngle = calculateAngleToTarget(playerPosition, opponentPosition);
  return updateBodyFacing(facing, targetAngle, deltaTime, currentTime);
}

/**
 * Locks facing direction (during attacks/defends)
 * 
 * Prevents rotation while attack or defend animation is playing.
 * Maintains current facing angle.
 * 
 * @param facing - Current body facing state
 * @returns Updated body facing state with lock enabled
 * 
 * @public
 * @korean 회전잠금
 */
export function lockFacing(facing: BodyFacing): BodyFacing {
  return {
    ...facing,
    isLocked: true,
  };
}

/**
 * Unlocks facing direction (after attacks/defends complete)
 * 
 * Allows rotation to resume after attack or defend animation completes.
 * 
 * @param facing - Current body facing state
 * @returns Updated body facing state with lock disabled
 * 
 * @public
 * @korean 회전잠금해제
 */
export function unlockFacing(facing: BodyFacing): BodyFacing {
  return {
    ...facing,
    isLocked: false,
  };
}

/**
 * Checks if character is currently turning (180° animation)
 * 
 * @param facing - Current body facing state
 * @returns True if 180° turn animation is in progress
 * 
 * @public
 * @korean 회전중확인
 */
export function isTurning(facing: BodyFacing): boolean {
  return facing.isTurning;
}

/**
 * Gets current facing angle in radians
 * Useful for Three.js rotation (expects radians)
 * 
 * @param facing - Current body facing state
 * @returns Current facing angle in radians
 * 
 * @public
 * @korean 라디안각도
 */
export function getFacingAngleRadians(facing: BodyFacing): number {
  return (facing.currentAngle * Math.PI) / 180;
}

/**
 * Gets head angle in radians including offset
 * Combines torso rotation with head tracking offset
 * 
 * @param facing - Current body facing state
 * @returns Head rotation angle in radians
 * 
 * @public
 * @korean 머리각도라디안
 */
export function getHeadAngleRadians(facing: BodyFacing): number {
  const totalAngle = facing.currentAngle + facing.headAngleOffset;
  return (totalAngle * Math.PI) / 180;
}

/**
 * Body Facing System singleton for managing character rotation
 * 
 * Provides centralized system for body facing calculations and updates.
 * 
 * @public
 * @korean 몸향하기시스템
 */
export class BodyFacingSystem {
  /**
   * Creates default body facing state for a new player
   * 
   * @param initialAngle - Initial facing angle in degrees
   * @returns Default body facing state
   * 
   * @public
   * @korean 기본상태생성
   */
  createDefaultState(initialAngle = 0): BodyFacing {
    return createDefaultBodyFacing(initialAngle);
  }

  /**
   * Updates body facing with opponent tracking
   * 
   * @param facing - Current body facing state
   * @param playerPosition - Player position
   * @param opponentPosition - Opponent position
   * @param deltaTime - Delta time in seconds
   * @param currentTime - Current timestamp
   * @returns Updated body facing state
   * 
   * @public
   * @korean 업데이트
   */
  update(
    facing: BodyFacing,
    playerPosition: Position,
    opponentPosition: Position,
    deltaTime: number,
    currentTime: number
  ): BodyFacing {
    return updateFacingTowardOpponent(
      facing,
      playerPosition,
      opponentPosition,
      deltaTime,
      currentTime
    );
  }

  /**
   * Locks facing during attacks
   * 
   * @param facing - Current body facing state
   * @returns Updated state with lock
   * 
   * @public
   * @korean 잠금
   */
  lock(facing: BodyFacing): BodyFacing {
    return lockFacing(facing);
  }

  /**
   * Unlocks facing after attacks
   * 
   * @param facing - Current body facing state
   * @returns Updated state without lock
   * 
   * @public
   * @korean 잠금해제
   */
  unlock(facing: BodyFacing): BodyFacing {
    return unlockFacing(facing);
  }
}

/**
 * Default body facing system instance
 * 
 * @public
 * @korean 기본몸향하기시스템
 */
export const bodyFacingSystem = new BodyFacingSystem();

export default bodyFacingSystem;
