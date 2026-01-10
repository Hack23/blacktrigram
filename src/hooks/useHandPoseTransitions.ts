/**
 * useHandPoseTransitions - Shared hook for hand animation management
 *
 * Manages hand pose transitions and animation state for both hands.
 * Reduces code duplication in skeletal animation components.
 *
 * @module hooks/useHandPoseTransitions
 * @category Hooks
 * @korean 손자세전환훅
 */

import { useEffect, useRef, useState } from "react";
import {
  createInitialHandAnimationState,
  getTechniqueHandPose,
  updateHandAnimationState,
} from "../systems/animation";
import type { HandAnimationState } from "../types/hand-animation";
import { HandPoseType } from "../types/hand-animation";
import type { PlayerAnimation } from "../types/player-visual";

/**
 * Default transition duration for hand pose changes (in seconds)
 * @korean 손자세전환기본지속시간
 */
const DEFAULT_HAND_TRANSITION_DURATION = 0.2;

/**
 * Frequency of React state syncs during hand animations.
 * Value of 20 means sync every 5% progress (~every 3 frames at 60fps).
 * Reduces React re-renders from 60/sec to ~20/sec during transitions.
 * @korean 손상태동기화빈도
 */
const HAND_STATE_SYNC_FREQUENCY = 20;

/**
 * Options for useHandPoseTransitions hook
 * @korean 손자세전환훅옵션
 */
export interface UseHandPoseTransitionsOptions {
  /** Current animation name */
  readonly currentAnimation: PlayerAnimation;
  /** Specific attack animation name (for attack state) */
  readonly attackAnimation?: string;
  /** Whether player is blocking */
  readonly isBlocking?: boolean;
}

/**
 * Return type for useHandPoseTransitions hook
 * @korean 손자세전환훅반환타입
 */
export interface UseHandPoseTransitionsReturn {
  /** Left hand animation state */
  readonly leftHandState: HandAnimationState;
  /** Right hand animation state */
  readonly rightHandState: HandAnimationState;
  /** Update hand animations (call in useFrame) */
  readonly updateHandAnimations: (delta: number) => void;
}

/**
 * Updates hand animation state for a single hand at 60fps.
 * Uses refs to avoid triggering React re-renders on every frame.
 * Only syncs to React state periodically or when transition completes.
 *
 * @param handStateRef - Ref storing current hand animation state
 * @param setHandState - React setState function to update hand state
 * @param delta - Time elapsed since last frame (in seconds)
 * @korean 손애니메이션프레임업데이트
 */
const updateHandAnimationFrame = (
  handStateRef: React.MutableRefObject<HandAnimationState>,
  setHandState: React.Dispatch<React.SetStateAction<HandAnimationState>>,
  delta: number
): void => {
  if (handStateRef.current && handStateRef.current.targetPose !== null) {
    const previousState = handStateRef.current;
    const updatedState = updateHandAnimationState(
      previousState,
      previousState.targetPose,
      delta,
      DEFAULT_HAND_TRANSITION_DURATION
    );

    handStateRef.current = updatedState;

    // Sync to React state periodically (approximately every 3 frames at 60fps)
    if (
      updatedState.targetPose === null ||
      Math.floor(updatedState.transitionProgress * HAND_STATE_SYNC_FREQUENCY) !==
        Math.floor(
          previousState.transitionProgress * HAND_STATE_SYNC_FREQUENCY
        )
    ) {
      setHandState(updatedState);
    }
  }
};

/**
 * useHandPoseTransitions hook
 *
 * Manages hand pose transitions for both hands based on current animation.
 * Automatically selects appropriate hand poses for different techniques
 * and handles smooth transitions at 60fps.
 *
 * @param options - Hand animation options
 * @returns Hand states and update function
 *
 * @example
 * ```tsx
 * const { leftHandState, rightHandState, updateHandAnimations } =
 *   useHandPoseTransitions({
 *     currentAnimation: "attack",
 *     attackAnimation: "jab",
 *     isBlocking: false,
 *   });
 *
 * // In useFrame callback
 * useFrame((_, delta) => {
 *   updateHandAnimations(delta);
 * });
 * ```
 *
 * @korean 손자세전환훅
 */
export function useHandPoseTransitions(
  options: UseHandPoseTransitionsOptions
): UseHandPoseTransitionsReturn {
  const { currentAnimation, attackAnimation, isBlocking = false } = options;

  // Hand animation states
  const [leftHandState, setLeftHandState] = useState<HandAnimationState>(
    createInitialHandAnimationState(HandPoseType.OPEN)
  );
  const [rightHandState, setRightHandState] = useState<HandAnimationState>(
    createInitialHandAnimationState(HandPoseType.OPEN)
  );

  // Refs for 60fps animation updates without triggering React re-renders
  const leftHandStateRef = useRef<HandAnimationState>(leftHandState);
  const rightHandStateRef = useRef<HandAnimationState>(rightHandState);

  // Sync refs with state
  useEffect(() => {
    leftHandStateRef.current = leftHandState;
  }, [leftHandState]);

  useEffect(() => {
    rightHandStateRef.current = rightHandState;
  }, [rightHandState]);

  // Update hand poses based on current animation
  useEffect(() => {
    if (currentAnimation === "attack" && attackAnimation) {
      // Attack animation - use technique-specific hand poses
      const handPose = getTechniqueHandPose(attackAnimation);
      setLeftHandState((prev) =>
        updateHandAnimationState(
          prev,
          handPose.leftHandPose,
          0,
          handPose.transitionDuration
        )
      );
      setRightHandState((prev) =>
        updateHandAnimationState(
          prev,
          handPose.rightHandPose,
          0,
          handPose.transitionDuration
        )
      );
    } else if (currentAnimation === "defend" || isBlocking) {
      // Open hands for blocking
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
      );
    } else if (currentAnimation === "walk") {
      // Relaxed hands while walking
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.2)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.2)
      );
    } else if (currentAnimation === "stance_change") {
      // Guard hands during stance change
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.15)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.15)
      );
    } else if (
      currentAnimation?.startsWith("step_") ||
      currentAnimation?.startsWith("footwork_")
    ) {
      // Maintain guard hands during steps and footwork
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
      );
    } else if (currentAnimation?.startsWith("stance_guard_")) {
      // Guard hands in open position
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.2)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.2)
      );
    } else {
      // Idle - return to relaxed hand pose
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.3)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.3)
      );
    }
  }, [currentAnimation, attackAnimation, isBlocking]);

  // Update hand animations at 60fps
  const updateHandAnimations = (delta: number): void => {
    updateHandAnimationFrame(leftHandStateRef, setLeftHandState, delta);
    updateHandAnimationFrame(rightHandStateRef, setRightHandState, delta);
  };

  return {
    leftHandState,
    rightHandState,
    updateHandAnimations,
  };
}
