/**
 * AccelerationUpdater - Component that updates movement acceleration at 60fps
 *
 * Uses useFrame to track continuous movement time and calculate acceleration-based speed.
 * Throttles state updates to only call onSpeedUpdate when speed changes meaningfully.
 * This component only updates movement state and renders no visual elements.
 *
 * @module systems/movement/helpers/AccelerationUpdater
 * @category Movement
 * @korean 가속업데이터
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import {
  ACCELERATION_CONSTANTS,
  calculateAcceleratedSpeed,
  isDirectionConsistent,
  isSpeedChangeMeaningful,
} from "./accelerationUtils";

/**
 * Props for AccelerationUpdater component
 */
export interface AccelerationUpdaterProps {
  /** Whether player is currently moving */
  readonly isMoving: boolean;
  /** Current velocity vector */
  readonly velocity: { x: number; y: number } | undefined;
  /** Ref to track accumulated movement time */
  readonly movementTimeRef: React.MutableRefObject<number>;
  /** Ref to track last movement direction */
  readonly lastDirectionRef: React.MutableRefObject<{ x: number; y: number }>;
  /** Callback to update calculated speed - only called on meaningful changes */
  readonly onSpeedUpdate: (speed: number) => void;
  /** Walking speed in m/s (from archetype or default) */
  readonly walkSpeed?: number;
  /** Running speed in m/s (from archetype or default) */
  readonly runSpeed?: number;
}

/**
 * AccelerationUpdater Component
 *
 * Updates movement acceleration at 60fps using Three.js useFrame hook.
 * Tracks continuous movement time and calculates speed based on direction consistency.
 * Only calls onSpeedUpdate when speed changes by more than epsilon, preventing
 * excessive React re-renders at frame rate.
 *
 * @example
 * ```tsx
 * <AccelerationUpdater
 *   isMoving={isMoving}
 *   velocity={velocity}
 *   movementTimeRef={movementTimeRef}
 *   lastDirectionRef={lastDirectionRef}
 *   onSpeedUpdate={setAccelerationBasedSpeed}
 *   walkSpeed={physicalAttributes.walkSpeed}
 *   runSpeed={physicalAttributes.runSpeed}
 * />
 * ```
 */
export const AccelerationUpdater: React.FC<AccelerationUpdaterProps> = ({
  isMoving,
  velocity,
  movementTimeRef,
  lastDirectionRef,
  onSpeedUpdate,
  walkSpeed = ACCELERATION_CONSTANTS.DEFAULT_WALK_SPEED,
  runSpeed = ACCELERATION_CONSTANTS.DEFAULT_RUN_SPEED,
}) => {
  // Track last reported speed and time to throttle updates
  // Initialize with walk speed (archetype-specific or default)
  const lastReportedSpeedRef = useRef<number>(walkSpeed);
  const lastUpdateTimeRef = useRef<number>(0);
  // Throttle interval: update at most every ~100ms (10Hz) instead of 60fps
  const UPDATE_THROTTLE_MS = 100;

  useFrame((_state, delta) => {
    // If not moving, reset timers and direction
    if (!isMoving || !velocity || (velocity.x === 0 && velocity.y === 0)) {
      movementTimeRef.current = 0;
      lastDirectionRef.current = { x: 0, y: 0 };
      
      // Only update if changed meaningfully
      if (isSpeedChangeMeaningful(lastReportedSpeedRef.current, walkSpeed)) {
        lastReportedSpeedRef.current = walkSpeed;
        onSpeedUpdate(walkSpeed);
        lastUpdateTimeRef.current = performance.now();
      }
      return;
    }

    // Check direction consistency (within 45 degrees)
    const currentDir = { x: velocity.x, y: velocity.y };
    const isSameDirection = isDirectionConsistent(currentDir, lastDirectionRef.current);

    // Reset accumulated movement time if direction changed too much
    if (!isSameDirection) {
      movementTimeRef.current = 0;
    } else {
      // Accumulate movement time while moving in a consistent direction
      movementTimeRef.current += delta;
    }

    // Update last direction for the next frame
    lastDirectionRef.current = currentDir;

    // Calculate new speed with archetype-specific walk/run speeds
    const newSpeed = calculateAcceleratedSpeed(movementTimeRef.current, walkSpeed, runSpeed);

    // Throttle updates by both time and epsilon
    // Only call onSpeedUpdate if enough time has passed AND speed changed meaningfully
    const now = performance.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    
    if (
      timeSinceLastUpdate >= UPDATE_THROTTLE_MS &&
      isSpeedChangeMeaningful(lastReportedSpeedRef.current, newSpeed)
    ) {
      lastReportedSpeedRef.current = newSpeed;
      onSpeedUpdate(newSpeed);
      lastUpdateTimeRef.current = now;
    }
  });

  return null; // Component only updates movement state, renders no visual elements
};

export default AccelerationUpdater;
