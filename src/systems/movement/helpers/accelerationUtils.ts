/**
 * Acceleration Utilities for Movement System
 *
 * Pure functions for calculating acceleration-based running speeds.
 * Extracted for testability and reusability across training and combat screens.
 *
 * @module systems/movement/helpers/accelerationUtils
 * @category Movement
 * @korean 가속 유틸리티
 */

/**
 * Constants for acceleration-based running
 */
export const ACCELERATION_CONSTANTS = {
  /** Walking speed in m/s */
  WALK_SPEED: 6.0,
  /** Running speed in m/s */
  RUN_SPEED: 10.0,
  /** Time to reach running speed in seconds */
  TIME_TO_RUN: 1.5,
  /** Threshold for considering direction "same" (cos 45°) */
  DIRECTION_THRESHOLD: 0.707,
  /** Running threshold as percentage of max speed (0-1) */
  RUN_THRESHOLD_PERCENT: 0.9,
  /** Epsilon for speed change detection (m/s) */
  SPEED_CHANGE_EPSILON: 0.05,
} as const;

/**
 * Calculate running threshold speed
 * @returns Speed at which movement is considered running (m/s)
 */
export function calculateRunThreshold(): number {
  return ACCELERATION_CONSTANTS.RUN_SPEED * ACCELERATION_CONSTANTS.RUN_THRESHOLD_PERCENT;
}

/**
 * Check if two directions are consistent (within threshold angle)
 * @param currentDir Current direction vector
 * @param lastDir Previous direction vector
 * @returns True if directions are within 45° of each other
 */
export function isDirectionConsistent(
  currentDir: { x: number; y: number },
  lastDir: { x: number; y: number }
): boolean {
  // If last direction is zero, consider any movement as consistent
  if (lastDir.x === 0 && lastDir.y === 0) {
    return true;
  }

  // Calculate dot product
  const dot = currentDir.x * lastDir.x + currentDir.y * lastDir.y;
  const magCurrent = Math.sqrt(currentDir.x ** 2 + currentDir.y ** 2);
  const magLast = Math.sqrt(lastDir.x ** 2 + lastDir.y ** 2);

  if (magCurrent === 0 || magLast === 0) {
    return false;
  }

  const cosAngle = dot / (magCurrent * magLast);
  return cosAngle > ACCELERATION_CONSTANTS.DIRECTION_THRESHOLD;
}

/**
 * Calculate acceleration-based speed
 * @param movementTime Accumulated movement time in same direction (seconds)
 * @returns Interpolated speed between walk and run (m/s)
 */
export function calculateAcceleratedSpeed(movementTime: number): number {
  const progress = Math.min(movementTime / ACCELERATION_CONSTANTS.TIME_TO_RUN, 1.0);
  return (
    ACCELERATION_CONSTANTS.WALK_SPEED +
    (ACCELERATION_CONSTANTS.RUN_SPEED - ACCELERATION_CONSTANTS.WALK_SPEED) * progress
  );
}

/**
 * Check if speed change is meaningful (exceeds epsilon)
 * @param oldSpeed Previous speed (m/s)
 * @param newSpeed New speed (m/s)
 * @returns True if change exceeds threshold
 */
export function isSpeedChangeMeaningful(oldSpeed: number, newSpeed: number): boolean {
  return Math.abs(newSpeed - oldSpeed) >= ACCELERATION_CONSTANTS.SPEED_CHANGE_EPSILON;
}

/**
 * Determine if player is running based on current speed
 * @param speed Current speed (m/s)
 * @returns True if speed exceeds running threshold
 */
export function isRunningSpeed(speed: number): boolean {
  return speed >= calculateRunThreshold();
}
