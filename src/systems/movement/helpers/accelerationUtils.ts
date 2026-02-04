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
 * Step distance thresholds for foot laterality alternation
 * 발 측면성 교대를 위한 걸음 거리 임계값
 */
export const STEP_DISTANCE_THRESHOLDS = {
  /**
   * Average step length when walking (meters)
   * 걷기 시 평균 걸음 길이
   */
  WALK: 0.7,

  /**
   * Average step length when running (meters)
   * 달리기 시 평균 걸음 길이
   */
  RUN: 1.0,
} as const;

/**
 * Constants for acceleration-based running (defaults for non-archetype usage)
 */
export const ACCELERATION_CONSTANTS = {
  /** Default walking speed in m/s (when no archetype speed provided) */
  DEFAULT_WALK_SPEED: 6.0,
  /** Default running speed in m/s (when no archetype speed provided) */
  DEFAULT_RUN_SPEED: 10.0,
  /** Time to reach running speed in seconds */
  TIME_TO_RUN: 1.5,
  /** Threshold for considering direction "same" (cos(45°) = √2/2) */
  DIRECTION_THRESHOLD: Math.cos(Math.PI / 4),
  /** Running threshold as percentage of max speed (0-1) */
  RUN_THRESHOLD_PERCENT: 0.9,
  /** Epsilon for speed change detection (m/s) */
  SPEED_CHANGE_EPSILON: 0.05,
} as const;

/**
 * Calculate running threshold speed
 * @param runSpeed - Maximum running speed (from archetype or default)
 * @returns Speed at which movement is considered running (m/s)
 */
export function calculateRunThreshold(
  runSpeed: number = ACCELERATION_CONSTANTS.DEFAULT_RUN_SPEED
): number {
  return runSpeed * ACCELERATION_CONSTANTS.RUN_THRESHOLD_PERCENT;
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

  // Clamp cosAngle to [-1, 1] to handle floating-point edge cases
  const cosAngleRaw = dot / (magCurrent * magLast);
  const cosAngle = Math.max(-1, Math.min(1, cosAngleRaw));
  
  // Use >= to include exactly 45° as consistent (not trigger reset)
  return cosAngle >= ACCELERATION_CONSTANTS.DIRECTION_THRESHOLD;
}

/**
 * Calculate acceleration-based speed
 * @param movementTime Accumulated movement time in same direction (seconds)
 * @param walkSpeed - Walking speed in m/s (from archetype or default)
 * @param runSpeed - Running speed in m/s (from archetype or default)
 * @returns Interpolated speed between walk and run (m/s)
 */
export function calculateAcceleratedSpeed(
  movementTime: number,
  walkSpeed: number = ACCELERATION_CONSTANTS.DEFAULT_WALK_SPEED,
  runSpeed: number = ACCELERATION_CONSTANTS.DEFAULT_RUN_SPEED
): number {
  const progress = Math.min(movementTime / ACCELERATION_CONSTANTS.TIME_TO_RUN, 1.0);
  return walkSpeed + (runSpeed - walkSpeed) * progress;
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
 * @param runSpeed - Maximum running speed (from archetype or default)
 * @returns True if speed exceeds running threshold
 */
export function isRunningSpeed(
  speed: number,
  runSpeed: number = ACCELERATION_CONSTANTS.DEFAULT_RUN_SPEED
): boolean {
  return speed >= calculateRunThreshold(runSpeed);
}
