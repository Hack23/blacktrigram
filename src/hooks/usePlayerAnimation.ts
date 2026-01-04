/**
 * usePlayerAnimation - React hook for player animation state
 * 
 * Provides a React interface to the PlayerAnimationStateMachine
 * with automatic cleanup and event handling.
 * 
 * @module hooks/usePlayerAnimation
 * @category Hooks
 * @korean 플레이어애니메이션훅
 */

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AnimationEvents,
  AnimationState,
  DEFAULT_ANIMATION_CONFIGS,
  PlayerAnimationStateMachine,
} from "../systems/animation";
import type { AnimationConfig, AnimationUpdateResult } from "../systems/animation/types";
import type { TrigramStance } from "../types/common";

/**
 * Options for usePlayerAnimation hook
 * 
 * @korean 플레이어애니메이션훅옵션
 */
export interface UsePlayerAnimationOptions {
  /**
   * Custom animation configurations
   * If not provided, uses DEFAULT_ANIMATION_CONFIGS
   * 
   * @korean 커스텀애니메이션설정
   */
  readonly customConfigs?: Map<AnimationState, AnimationConfig>;

  /**
   * Animation event callbacks
   * 
   * **IMPORTANT**: The events object should be stable (memoized) to prevent
   * unnecessary re-initialization of the animation system. Changes to event
   * callbacks after the hook is initialized will NOT be reflected in the
   * animation system. Use `useMemo` or define events outside the component
   * to ensure stability.
   * 
   * @korean 이벤트콜백
   */
  readonly events?: AnimationEvents;

  /**
   * Initial animation state (defaults to "idle")
   * 
   * @korean 초기상태
   */
  readonly initialState?: AnimationState;
}

/**
 * Return type for usePlayerAnimation hook
 * 
 * @korean 플레이어애니메이션훅반환타입
 */
export interface UsePlayerAnimationReturn {
  /**
   * Current animation state
   * 
   * @korean 현재상태
   */
  readonly currentState: AnimationState;

  /**
   * Current frame index
   * 
   * @korean 현재프레임
   */
  readonly currentFrame: number;

  /**
   * Update animation state (call in useFrame)
   * 
   * @param deltaTime - Time elapsed since last update in seconds
   * @returns Animation update result
   * 
   * @korean 업데이트
   */
  readonly update: (deltaTime: number) => AnimationUpdateResult;

  /**
   * Transition to a new animation state
   * 
   * @param newState - Target animation state
   * @returns Whether transition was successful
   * 
   * @korean 상태전환
   */
  readonly transitionTo: (newState: AnimationState) => boolean;

  /**
   * Transition to stance-specific guard animation
   * 
   * @param stance - Trigram stance
   * @returns Whether transition was successful
   * 
   * @korean 자세가드전환
   */
  readonly transitionToStanceGuard: (stance: TrigramStance) => boolean;
  
  /**
   * Check if currently in a stance guard animation
   * 
   * @returns True if in any stance guard state
   * 
   * @korean 자세가드확인
   */
  readonly isInStanceGuard: () => boolean;
  
  /**
   * Get current guard stance (if in guard animation)
   * 
   * @returns Trigram stance or null
   * 
   * @korean 현재가드자세
   */
  readonly getCurrentGuardStance: () => TrigramStance | null;

  /**
   * Reset animation to idle state
   * 
   * @korean 초기화
   */
  readonly reset: () => void;
}

/**
 * React hook for player animation state management
 * 
 * Provides frame-accurate animation control with priority system
 * and event callbacks. Integrates seamlessly with useFrame for
 * 60fps updates.
 * 
 * @param options - Animation options
 * @returns Animation control interface
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { currentState, currentFrame, update, transitionTo } = usePlayerAnimation({
 *   events: {
 *     onAnimationStart: (state) => console.log(`Started ${state}`),
 *     onAnimationComplete: (state) => console.log(`Completed ${state}`),
 *     onFrame: (frame, state) => {
 *       if (state === "attack" && frame === 6) {
 *         // Execute attack at midpoint
 *         executeAttack();
 *       }
 *     }
 *   }
 * });
 * 
 * // In useFrame callback
 * useFrame((state, delta) => {
 *   const result = update(delta);
 *   // Update visuals based on result.state and result.frame
 * });
 * 
 * // Trigger animations
 * const handleAttackInput = () => {
 *   transitionTo("attack");
 * };
 * 
 * const handleMovement = (isMoving: boolean) => {
 *   transitionTo(isMoving ? "walk" : "idle");
 * };
 * ```
 * 
 * @korean 플레이어애니메이션훅
 */
export function usePlayerAnimation(
  options: UsePlayerAnimationOptions = {}
): UsePlayerAnimationReturn {
  const { customConfigs, events, initialState = "idle" } = options;

  // Force re-renders when state changes
  const [, forceUpdate] = useState(0);

  // Create animation configs (memoized)
  const configs = useMemo(
    () => customConfigs ?? DEFAULT_ANIMATION_CONFIGS,
    [customConfigs]
  );

  // Create animation state machine (persistent across renders via useMemo)
  const stateMachine = useMemo(() => {
    const machine = new PlayerAnimationStateMachine(configs, events);
    // Set initial state if not "idle"
    if (initialState !== "idle") {
      machine.transitionTo(initialState);
    }
    return machine;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only create once

  // Track previous state to only update on actual changes
  const prevStateRef = useRef<AnimationState>(stateMachine.getCurrentState());
  const prevFrameRef = useRef<number>(stateMachine.getCurrentFrame());

  // Memoized callbacks with selective state updates
  const update = useCallback(
    (deltaTime: number) => {
      const result = stateMachine.update(deltaTime);
      const currentState = stateMachine.getCurrentState();
      const currentFrame = stateMachine.getCurrentFrame();
      
      // Only trigger re-render if state or frame changed
      if (currentState !== prevStateRef.current || currentFrame !== prevFrameRef.current) {
        prevStateRef.current = currentState;
        prevFrameRef.current = currentFrame;
        forceUpdate((n) => n + 1);
      }
      
      return result;
    },
    [stateMachine]
  );

  const transitionTo = useCallback(
    (newState: AnimationState) => {
      const success = stateMachine.transitionTo(newState);
      if (success) {
        prevStateRef.current = stateMachine.getCurrentState();
        prevFrameRef.current = stateMachine.getCurrentFrame();
        forceUpdate((n) => n + 1);
      }
      return success;
    },
    [stateMachine]
  );

  const reset = useCallback(() => {
    stateMachine.reset();
    prevStateRef.current = stateMachine.getCurrentState();
    prevFrameRef.current = stateMachine.getCurrentFrame();
    forceUpdate((n) => n + 1);
  }, [stateMachine]);
  
  const transitionToStanceGuard = useCallback(
    (stance: TrigramStance) => {
      const success = stateMachine.transitionToStanceGuard(stance);
      if (success) {
        prevStateRef.current = stateMachine.getCurrentState();
        prevFrameRef.current = stateMachine.getCurrentFrame();
        forceUpdate((n) => n + 1);
      }
      return success;
    },
    [stateMachine]
  );
  
  const isInStanceGuard = useCallback(() => {
    return stateMachine.isInStanceGuard();
  }, [stateMachine]);
  
  const getCurrentGuardStance = useCallback(() => {
    return stateMachine.getCurrentGuardStance();
  }, [stateMachine]);

  // Memoize the return value to ensure stable reference unless state/frame changes
  return useMemo(
    () => ({
      currentState: prevStateRef.current,
      currentFrame: prevFrameRef.current,
      update,
      transitionTo,
      transitionToStanceGuard,
      isInStanceGuard,
      getCurrentGuardStance,
      reset,
    }),
    [prevStateRef.current, prevFrameRef.current, update, transitionTo, transitionToStanceGuard, isInStanceGuard, getCurrentGuardStance, reset]
  );
}
