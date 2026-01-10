/**
 * useMuscleActivation - Shared hook for muscle activation management
 *
 * Manages muscle activation state based on current actions and stamina.
 * Reduces code duplication in skeletal animation components.
 *
 * @module hooks/useMuscleActivation
 * @category Hooks
 * @korean 근육활성화훅
 */

import { useEffect, useRef, useState } from "react";
import { MuscleActivationManager } from "../systems/animation/MuscleActivation";
import type { PlayerAnimation } from "../types/player-visual";

/**
 * Options for useMuscleActivation hook
 * @korean 근육활성화훅옵션
 */
export interface UseMuscleActivationOptions {
  /** Current animation name */
  readonly currentAnimation: PlayerAnimation;
  /** Specific attack animation name (for attack state) */
  readonly attackAnimation?: string;
  /** Whether player is blocking */
  readonly isBlocking?: boolean;
  /** Current stamina level (0-100) */
  readonly stamina: number;
}

/**
 * Return type for useMuscleActivation hook
 * @korean 근육활성화훅반환타입
 */
export interface UseMuscleActivationReturn {
  /** Current muscle activation states (bone name -> activation 0-1) */
  readonly muscleStates: Map<string, number>;
  /** Update muscle activations (call in useFrame) */
  readonly updateMuscleActivations: (delta: number, frameCounter: number) => void;
}

/**
 * useMuscleActivation hook
 *
 * Manages muscle activation based on current actions (attack, defend, movement).
 * Updates at 60fps with periodic state syncs to reduce re-renders.
 *
 * @param options - Muscle activation options
 * @returns Muscle states and update function
 *
 * @example
 * ```tsx
 * const { muscleStates, updateMuscleActivations } = useMuscleActivation({
 *   currentAnimation: "attack",
 *   attackAnimation: "jab",
 *   isBlocking: false,
 *   stamina: 85,
 * });
 *
 * // In useFrame callback
 * let frameCounter = 0;
 * useFrame((_, delta) => {
 *   frameCounter = (frameCounter + 1) % 10;
 *   updateMuscleActivations(delta, frameCounter);
 * });
 *
 * // Use muscle states in rendering
 * <BoneRenderer
 *   rig={rig}
 *   muscleStates={muscleStates}
 *   isExhausted={stamina < 20}
 * />
 * ```
 *
 * @korean 근육활성화훅
 */
export function useMuscleActivation(
  options: UseMuscleActivationOptions
): UseMuscleActivationReturn {
  const { currentAnimation, attackAnimation, isBlocking = false, stamina } = options;

  // Muscle activation manager
  const muscleManager = useRef(new MuscleActivationManager());
  const [muscleStates, setMuscleStates] = useState<Map<string, number>>(
    new Map()
  );

  // Cleanup muscle manager on unmount
  useEffect(() => {
    return () => {
      try {
        muscleManager.current.reset();
      } catch (error) {
        console.warn("MuscleActivationManager reset failed:", error);
      }
    };
  }, []);

  // Update muscle activations (called at 60fps in useFrame)
  const updateMuscleActivations = (
    delta: number,
    frameCounter: number
  ): void => {
    // Update muscle system based on current action
    if (currentAnimation === "attack" && attackAnimation) {
      muscleManager.current.update(attackAnimation, stamina, delta);
    } else if (currentAnimation === "defend" || isBlocking) {
      muscleManager.current.update("block", stamina, delta);
    } else if (
      currentAnimation === "walk" ||
      currentAnimation === "stance_change"
    ) {
      // Engage stance/leg/core muscles during movement and stance changes
      muscleManager.current.update("stance_change", stamina, delta);
    } else {
      muscleManager.current.relaxAllMuscles(delta);
    }

    // Sync muscle states to React state deterministically
    // (every 10 frames at 60fps = ~6 times/sec)
    // Balances animation smoothness with performance and reduces GC pressure
    if (frameCounter === 0) {
      // Reuse scratch map from manager to avoid repeated allocations
      const scratchMap = muscleManager.current.getScratchMapForSync();
      setMuscleStates(scratchMap);
    }
  };

  return {
    muscleStates,
    updateMuscleActivations,
  };
}
