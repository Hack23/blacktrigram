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
 * />
 * ```
 */
export const AccelerationUpdater: React.FC<AccelerationUpdaterProps> = ({
  isMoving,
  velocity,
  movementTimeRef,
  lastDirectionRef,
  onSpeedUpdate,
}) => {
  // Track last reported speed to throttle updates
  const lastReportedSpeedRef = useRef<number>(ACCELERATION_CONSTANTS.WALK_SPEED);

  useFrame((_state, delta) => {
    // If not moving, reset timers and direction
    if (!isMoving || !velocity || (velocity.x === 0 && velocity.y === 0)) {
      movementTimeRef.current = 0;
      lastDirectionRef.current = { x: 0, y: 0 };
      
      // Only update if changed meaningfully
      if (isSpeedChangeMeaningful(lastReportedSpeedRef.current, ACCELERATION_CONSTANTS.WALK_SPEED)) {
        lastReportedSpeedRef.current = ACCELERATION_CONSTANTS.WALK_SPEED;
        onSpeedUpdate(ACCELERATION_CONSTANTS.WALK_SPEED);
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

    // Calculate new speed
    const newSpeed = calculateAcceleratedSpeed(movementTimeRef.current);

    // Only call onSpeedUpdate if speed changed meaningfully (throttle updates)
    if (isSpeedChangeMeaningful(lastReportedSpeedRef.current, newSpeed)) {
      lastReportedSpeedRef.current = newSpeed;
      onSpeedUpdate(newSpeed);
    }
  });

  return null; // Component only updates movement state, renders no visual elements
};

export default AccelerationUpdater;
