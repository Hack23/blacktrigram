/**
 * AccelerationUpdater - Component that updates movement acceleration at 60fps
 *
 * Uses useFrame to track continuous movement time and calculate acceleration-based speed.
 * This component only updates movement state and renders no visual elements.
 *
 * @module components/combat/helpers/AccelerationUpdater
 * @category Combat Utilities
 * @korean 가속업데이터
 */

import { useFrame } from "@react-three/fiber";
import React from "react";

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
  /** Callback to update calculated speed */
  readonly onSpeedUpdate: (speed: number) => void;
}

/**
 * AccelerationUpdater Component
 *
 * Updates movement acceleration at 60fps using Three.js useFrame hook.
 * Tracks continuous movement time and calculates speed based on direction consistency.
 * Component only updates movement state, renders no visual elements.
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
  useFrame((_state, delta) => {
    // Constants for acceleration
    const WALK_SPEED = 6.0;
    const RUN_SPEED = 10.0;
    const TIME_TO_RUN = 1.5; // seconds to reach running speed

    // If not moving, reset timers and direction
    if (!isMoving || !velocity || (velocity.x === 0 && velocity.y === 0)) {
      movementTimeRef.current = 0;
      lastDirectionRef.current = { x: 0, y: 0 };
      onSpeedUpdate(WALK_SPEED);
      return;
    }

    // Check direction consistency (within 45 degrees)
    const currentDir = { x: velocity.x, y: velocity.y };
    const lastDir = lastDirectionRef.current;

    let isSameDirection = true;
    if (lastDir.x !== 0 || lastDir.y !== 0) {
      // Calculate dot product
      const dot = currentDir.x * lastDir.x + currentDir.y * lastDir.y;
      const magCurrent = Math.sqrt(currentDir.x ** 2 + currentDir.y ** 2);
      const magLast = Math.sqrt(lastDir.x ** 2 + lastDir.y ** 2);

      if (magCurrent > 0 && magLast > 0) {
        const cosAngle = dot / (magCurrent * magLast);
        // cos(45deg) ≈ 0.707: treat angles <= 45° as "same direction"
        isSameDirection = cosAngle > 0.707;
      }
    }

    // Reset accumulated movement time if direction changed too much
    if (!isSameDirection) {
      movementTimeRef.current = 0;
    } else {
      // Accumulate movement time while moving in a consistent direction
      movementTimeRef.current += delta;
    }

    // Update last direction for the next frame
    lastDirectionRef.current = currentDir;

    // Calculate progress (0 to 1)
    const progress = Math.min(movementTimeRef.current / TIME_TO_RUN, 1.0);

    // Linear interpolation from walk to run speed
    const newSpeed = WALK_SPEED + (RUN_SPEED - WALK_SPEED) * progress;
    onSpeedUpdate(newSpeed);
  });

  return null; // Component only updates movement state, renders no visual elements
};

export default AccelerationUpdater;
