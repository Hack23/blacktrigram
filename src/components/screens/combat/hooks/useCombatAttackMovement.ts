/**
 * useCombatAttackMovement Hook - Track Attack Movement for Combat Characters
 *
 * Custom hook for managing attack movement physics during combat animations.
 * Supports two fighters with simultaneous attack movements and arena bounds.
 *
 * @korean 전투공격이동훅 - 전투 공격 이동 추적
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AnimationType } from "@/systems/animation";
import { AttackMovementPhysics } from "@/systems/physics";
import { TrigramStance } from "@/types/common";

/**
 * Calculate attack direction from attacker to defender
 * 공격자에서 방어자로의 공격 방향 계산
 * 
 * @param attackerPos - Attacker position
 * @param defenderPos - Defender position
 * @returns Normalized direction vector
 */
function calculateAttackDirection(
  attackerPos: [number, number, number],
  defenderPos: [number, number, number]
): THREE.Vector3 {
  const direction = new THREE.Vector3(
    defenderPos[0] - attackerPos[0],
    0, // Keep movement horizontal
    defenderPos[2] - attackerPos[2]
  );
  return direction.normalize();
}

/**
 * Configuration for combat attack movement
 */
export interface CombatAttackMovementConfig {
  /** Whether player 1 is currently attacking */
  readonly player1Attacking: boolean;
  /** Player 1 animation type */
  readonly player1AnimationType?: AnimationType;
  /** Player 1 current stance */
  readonly player1Stance: TrigramStance;
  /** Player 1 base position */
  readonly player1BasePosition: [number, number, number];

  /** Whether player 2 is currently attacking */
  readonly player2Attacking: boolean;
  /** Player 2 animation type */
  readonly player2AnimationType?: AnimationType;
  /** Player 2 current stance */
  readonly player2Stance: TrigramStance;
  /** Player 2 base position */
  readonly player2BasePosition: [number, number, number];

  /** Animation duration in seconds (default: 0.4) */
  readonly animationDuration?: number;
}

/**
 * Return value from useCombatAttackMovement hook
 */
export interface CombatAttackMovementResult {
  /** Player 1 current position including attack movement */
  readonly player1Position: [number, number, number];
  /** Player 2 current position including attack movement */
  readonly player2Position: [number, number, number];
  /** Whether player 1 is in forward lunge phase */
  readonly player1IsLunging: boolean;
  /** Whether player 2 is in forward lunge phase */
  readonly player2IsLunging: boolean;
}

/**
 * useCombatAttackMovement hook
 *
 * Tracks attack movement physics for both fighters in combat.
 * Automatically handles lunge and recovery phases with smooth easing.
 * Calculates attack direction between fighters dynamically.
 *
 * @param config - Combat attack movement configuration
 * @returns Current positions and movement states for both fighters
 *
 * @example
 * ```typescript
 * const {
 *   player1Position,
 *   player2Position,
 *   player1IsLunging
 * } = useCombatAttackMovement({
 *   player1Attacking: isPlayer1Attacking,
 *   player1AnimationType: AnimationType.ROUNDHOUSE_KICK,
 *   player1Stance: player1.stance,
 *   player1BasePosition: [5, 0, 0],
 *   player2Attacking: false,
 *   player2AnimationType: undefined,
 *   player2Stance: player2.stance,
 *   player2BasePosition: [-5, 0, 0],
 * });
 *
 * <Player3D position={player1Position} />
 * <Player3D position={player2Position} />
 * ```
 *
 * @korean 전투공격이동사용
 */
export function useCombatAttackMovement(
  config: CombatAttackMovementConfig
): CombatAttackMovementResult {
  const {
    player1Attacking,
    player1AnimationType,
    player1Stance,
    player1BasePosition,
    player2Attacking,
    player2AnimationType,
    player2Stance,
    player2BasePosition,
    animationDuration = 0.4,
  } = config;

  // Attack movement physics engines (separate instances for each player to avoid race conditions)
  const player1PhysicsRef = useRef(new AttackMovementPhysics());
  const player2PhysicsRef = useRef(new AttackMovementPhysics());

  // Reusable Vector3 objects to avoid GC pressure (60fps allocation)
  const player1BasePosVectorRef = useRef(new THREE.Vector3());
  const player2BasePosVectorRef = useRef(new THREE.Vector3());

  // Player 1 attack timing
  const player1AttackStartTimeRef = useRef<number | null>(null);
  const player1MovementResultRef = useRef<ReturnType<
    typeof player1PhysicsRef.current.calculateAttackMovement
  > | null>(null);

  // Player 2 attack timing
  const player2AttackStartTimeRef = useRef<number | null>(null);
  const player2MovementResultRef = useRef<ReturnType<
    typeof player2PhysicsRef.current.calculateAttackMovement
  > | null>(null);

  // Current positions
  const [player1Position, setPlayer1Position] = useState<
    [number, number, number]
  >(player1BasePosition);
  const [player2Position, setPlayer2Position] = useState<
    [number, number, number]
  >(player2BasePosition);

  // Movement states
  const [player1IsLunging, setPlayer1IsLunging] = useState(false);
  const [player2IsLunging, setPlayer2IsLunging] = useState(false);

  // Track previous attacking state for rising-edge detection
  const player1WasAttackingRef = useRef(false);
  const player2WasAttackingRef = useRef(false);

  // Player 1 attack movement effect
  useEffect(() => {
    const wasAttacking = player1WasAttackingRef.current;
    player1WasAttackingRef.current = player1Attacking;

    // Only initialize on transition from not-attacking → attacking (rising edge)
    if (player1Attacking && player1AnimationType && !wasAttacking) {
      // Start attack - calculate movement result
      player1AttackStartTimeRef.current = Date.now();

      const direction = calculateAttackDirection(
        player1BasePosition,
        player2BasePosition
      );

      player1MovementResultRef.current =
        player1PhysicsRef.current.calculateAttackMovement({
          animationType: player1AnimationType,
          currentStance: player1Stance,
          direction,
          animationDuration,
        });

      setPlayer1IsLunging(true);

      // Setup animation frame loop
      let animationFrameId: number;

      const updatePosition = () => {
        const elapsed = Date.now() - (player1AttackStartTimeRef.current ?? 0);
        const movementResult = player1MovementResultRef.current;

        if (!movementResult) {
          setPlayer1Position(player1BasePosition);
          return;
        }

        const totalDuration = movementResult.totalDuration * 1000; // Convert to ms

        if (elapsed >= totalDuration) {
          // Attack complete - return to base position
          setPlayer1Position(player1BasePosition);
          setPlayer1IsLunging(false);
          player1AttackStartTimeRef.current = null;
          player1MovementResultRef.current = null;
          return;
        }

        // Calculate current position with attack movement
        const elapsedSeconds = elapsed / 1000;
        const basePos = player1BasePosVectorRef.current.set(...player1BasePosition);
        const recovering = elapsed >= (movementResult.lungeDuration * 1000);
        
        const newPos = player1PhysicsRef.current.applyAttackMovement(
          basePos,
          movementResult,
          elapsedSeconds,
          recovering
        );

        const newPosition: [number, number, number] = [
          newPos.x,
          newPos.y,
          newPos.z,
        ];

        setPlayer1Position(newPosition);

        // Update lunging state (first half is lunge, second half is recovery)
        const totalProgress = elapsedSeconds / movementResult.totalDuration;
        setPlayer1IsLunging(totalProgress < 0.5);

        animationFrameId = requestAnimationFrame(updatePosition);
      };

      animationFrameId = requestAnimationFrame(updatePosition);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } else {
      // Not attacking - reset to base position
      setPlayer1Position(player1BasePosition);
      setPlayer1IsLunging(false);
      player1AttackStartTimeRef.current = null;
      player1MovementResultRef.current = null;
    }
  }, [
    player1Attacking,
    player1AnimationType,
    player1Stance,
    player1BasePosition,
    player2BasePosition,
    animationDuration,
  ]);

  // Player 2 attack movement effect (same logic as player 1)
  useEffect(() => {
    const wasAttacking = player2WasAttackingRef.current;
    player2WasAttackingRef.current = player2Attacking;

    // Only initialize on transition from not-attacking → attacking (rising edge)
    if (player2Attacking && player2AnimationType && !wasAttacking) {
      player2AttackStartTimeRef.current = Date.now();

      const direction = calculateAttackDirection(
        player2BasePosition,
        player1BasePosition
      );

      player2MovementResultRef.current =
        player2PhysicsRef.current.calculateAttackMovement({
          animationType: player2AnimationType,
          currentStance: player2Stance,
          direction,
          animationDuration,
        });

      setPlayer2IsLunging(true);

      let animationFrameId: number;

      const updatePosition = () => {
        const elapsed = Date.now() - (player2AttackStartTimeRef.current ?? 0);
        const movementResult = player2MovementResultRef.current;

        if (!movementResult) {
          setPlayer2Position(player2BasePosition);
          return;
        }

        const totalDuration = movementResult.totalDuration * 1000;

        if (elapsed >= totalDuration) {
          setPlayer2Position(player2BasePosition);
          setPlayer2IsLunging(false);
          player2AttackStartTimeRef.current = null;
          player2MovementResultRef.current = null;
          return;
        }

        const elapsedSeconds = elapsed / 1000;
        const basePos = player2BasePosVectorRef.current.set(...player2BasePosition);
        const recovering = elapsed >= (movementResult.lungeDuration * 1000);
        
        const newPos = player2PhysicsRef.current.applyAttackMovement(
          basePos,
          movementResult,
          elapsedSeconds,
          recovering
        );

        const newPosition: [number, number, number] = [
          newPos.x,
          newPos.y,
          newPos.z,
        ];

        setPlayer2Position(newPosition);
        
        const totalProgress = elapsedSeconds / movementResult.totalDuration;
        setPlayer2IsLunging(totalProgress < 0.5);

        animationFrameId = requestAnimationFrame(updatePosition);
      };

      animationFrameId = requestAnimationFrame(updatePosition);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } else {
      setPlayer2Position(player2BasePosition);
      setPlayer2IsLunging(false);
      player2AttackStartTimeRef.current = null;
      player2MovementResultRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- base positions stored in refs to prevent attack cancellation on position updates
  }, [
    player2Attacking,
    player2AnimationType,
    player2Stance,
    animationDuration,
  ]);

  return {
    player1Position,
    player2Position,
    player1IsLunging,
    player2IsLunging,
  };
}
