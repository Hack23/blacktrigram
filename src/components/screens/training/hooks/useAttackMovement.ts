/**
 * useAttackMovement Hook - Track Attack Movement for 3D Characters
 *
 * Custom hook for managing attack movement physics during animations.
 * Tracks lunge and recovery phases with smooth easing curves.
 *
 * @korean 공격이동훅 - 공격 이동 추적
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AnimationType } from "@/systems/animation";
import { AttackMovementPhysics } from "@/systems/physics";
import { TrigramStance } from "@/types/common";

/**
 * Configuration for useAttackMovement hook
 */
export interface UseAttackMovementConfig {
  /** Whether character is currently attacking */
  readonly isAttacking: boolean;
  /** Animation type for current attack */
  readonly animationType?: AnimationType;
  /** Current trigram stance */
  readonly currentStance: TrigramStance;
  /** Base position of character (when not attacking) */
  readonly basePosition: [number, number, number];
  /** Direction vector for attack (normalized) */
  readonly attackDirection?: THREE.Vector3;
  /** Animation duration in seconds (default: 0.4) */
  readonly animationDuration?: number;
}

/**
 * Return value from useAttackMovement hook
 */
export interface UseAttackMovementResult {
  /** Current 3D position including attack movement */
  readonly currentPosition: [number, number, number];
  /** Whether in forward lunge phase */
  readonly isLunging: boolean;
  /** Whether in recovery return phase */
  readonly isRecovering: boolean;
  /** Progress through attack movement (0-1) */
  readonly progress: number;
}

/**
 * useAttackMovement hook
 *
 * Tracks attack movement physics and returns current position.
 * Automatically handles lunge and recovery phases with smooth easing.
 *
 * @param config - Attack movement configuration
 * @returns Current position and movement state
 *
 * @example
 * ```typescript
 * const { currentPosition, isLunging } = useAttackMovement({
 *   isAttacking: playerIsAttacking,
 *   animationType: AnimationType.ROUNDHOUSE_KICK,
 *   currentStance: TrigramStance.LI,
 *   basePosition: [0, 0, 0],
 *   attackDirection: new THREE.Vector3(1, 0, 0),
 * });
 *
 * // Use currentPosition for rendering
 * <CharacterModel position={currentPosition} />
 * ```
 *
 * @korean 공격이동사용
 */
export function useAttackMovement(
  config: UseAttackMovementConfig
): UseAttackMovementResult {
  const {
    isAttacking,
    animationType,
    currentStance,
    basePosition,
    attackDirection,
    animationDuration = 0.4,
  } = config;

  const physicsRef = useRef(new AttackMovementPhysics());

  const attackStartTimeRef = useRef<number | null>(null);
  const attackMovementResultRef = useRef<ReturnType<
    typeof physicsRef.current.calculateAttackMovement
  > | null>(null);

  const [currentPosition, setCurrentPosition] = useState<
    [number, number, number]
  >(basePosition);
  const [isLunging, setIsLunging] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [progress, setProgress] = useState(0);

  const wasAttackingRef = useRef(false);

  useEffect(() => {
    if (!isAttacking) {
      setCurrentPosition(basePosition);
    }
  }, [isAttacking, basePosition]);

  useEffect(() => {
    if (isAttacking && !wasAttackingRef.current) {
      attackStartTimeRef.current = performance.now() / 1000;

      if (animationType && attackDirection) {
        attackMovementResultRef.current =
          physicsRef.current.calculateAttackMovement({
            animationType,
            currentStance,
            direction: attackDirection.clone().normalize(),
            animationDuration,
          });
      }
    } else if (!isAttacking && wasAttackingRef.current) {
      attackStartTimeRef.current = null;
      attackMovementResultRef.current = null;
      setIsLunging(false);
      setIsRecovering(false);
      setProgress(0);
    }

    wasAttackingRef.current = isAttacking;

    if (!isAttacking || !attackStartTimeRef.current || !attackMovementResultRef.current) {
      return;
    }

    const result = attackMovementResultRef.current;
    let animationFrameId: number;

    const updatePosition = () => {
      if (attackStartTimeRef.current === null) return;

      const currentTime = performance.now() / 1000;
      const elapsedTime = currentTime - attackStartTimeRef.current;

      const lunging = physicsRef.current.isInLungePhase(
        elapsedTime,
        result.lungeDuration
      );
      const recovering = physicsRef.current.isInRecoveryPhase(
        elapsedTime,
        result
      );

      setIsLunging(lunging);
      setIsRecovering(recovering);

      const totalProgress = Math.min(1.0, elapsedTime / result.totalDuration);
      setProgress(totalProgress);

      if (lunging || recovering) {
        const basePos = new THREE.Vector3(...basePosition);
        const newPosition = physicsRef.current.applyAttackMovement(
          basePos,
          result,
          elapsedTime,
          recovering
        );

        setCurrentPosition([newPosition.x, newPosition.y, newPosition.z]);

        animationFrameId = requestAnimationFrame(updatePosition);
      } else {
        setCurrentPosition(basePosition);
        setIsLunging(false);
        setIsRecovering(false);
        setProgress(1.0);
      }
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    isAttacking,
    animationType,
    currentStance,
    attackDirection,
    animationDuration,
    basePosition,
  ]);

  return {
    currentPosition,
    isLunging,
    isRecovering,
    progress,
  };
}

export default useAttackMovement;
