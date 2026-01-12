/**
 * useSkeletalAnimation - Shared hook for skeletal animation management
 *
 * Centralizes skeletal animation state and frame updates for player characters.
 * Reduces code duplication across SkeletalPlayer3D, Player3DWithTransitions,
 * and screen components.
 *
 * PHASE 2: Now uses cached interpolation and batch bone updates for 60fps performance
 *
 * @module hooks/useSkeletalAnimation
 * @category Hooks
 * @korean 골격애니메이션훅
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAnimation,
  getAnimationByName,
  getAttackAnimation,
  getDefensiveAnimation,
  getFootworkAnimation,
  getStepAnimation,
} from "../systems/animation";
import {
  batchUpdateBones,
  interpolateKeyframeCached,
  performanceMonitor,
} from "../systems/animation/AnimationOptimizations";
import type { PlayerAnimation } from "../types/player-visual";
import type {
  SkeletalAnimation,
  SkeletalAnimationState,
  SkeletalRig,
} from "../types/skeletal";

/**
 * Options for useSkeletalAnimation hook
 * @korean 골격애니메이션훅옵션
 */
export interface UseSkeletalAnimationOptions {
  /** Current animation name */
  readonly currentAnimation: PlayerAnimation;
  /** Specific attack animation name (for attack state) */
  readonly attackAnimation?: string;
  /** Whether player is blocking */
  readonly isBlocking?: boolean;
  /** Callback when animation completes */
  readonly onAnimationComplete?: () => void;
}

/**
 * Return type for useSkeletalAnimation hook
 * @korean 골격애니메이션훅반환타입
 */
export interface UseSkeletalAnimationReturn {
  /** Current animation state */
  readonly animState: SkeletalAnimationState;
  /** Animation time reference (seconds) */
  readonly animTimeRef: React.MutableRefObject<number>;
  /** Update animation and apply to rig (call in useFrame) */
  readonly updateRigAnimation: (rig: SkeletalRig, delta: number) => void;
  /** Diagonal rotation override for step animations */
  readonly diagonalRotationY: number | null;
}

/**
 * Set of diagonal step animations for O(1) lookup
 * @korean 대각선스텝애니메이션집합
 */
const DIAGONAL_STEP_ANIMATIONS = new Set([
  "step_forward_left",
  "step_forward_right",
  "step_back_left",
  "step_back_right",
]);

/**
 * useSkeletalAnimation hook
 *
 * Manages skeletal animation state and frame updates for player characters.
 * Handles animation selection based on player state (idle, walk, attack, etc.)
 * and applies keyframes to the skeletal rig.
 *
 * @param options - Animation options
 * @returns Animation state and update function
 *
 * @example
 * ```tsx
 * const { animState, animTimeRef, updateRigAnimation, diagonalRotationY } =
 *   useSkeletalAnimation({
 *     currentAnimation: "walk",
 *     isBlocking: false,
 *     onAnimationComplete: () => console.log("Animation completed"),
 *   });
 *
 * // In useFrame callback
 * useFrame((_, delta) => {
 *   updateRigAnimation(rig, delta);
 * });
 * ```
 *
 * @korean 골격애니메이션훅
 */
export function useSkeletalAnimation(
  options: UseSkeletalAnimationOptions
): UseSkeletalAnimationReturn {
  const {
    currentAnimation,
    attackAnimation,
    isBlocking = false,
    onAnimationComplete,
  } = options;

  // Animation state
  const [animState, setAnimState] = useState<SkeletalAnimationState>({
    currentAnimation: null,
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1.0,
    previousKeyframeIndex: 0,
    nextKeyframeIndex: 1,
  });

  // Animation time ref (updated at 60fps without triggering re-renders)
  const animTimeRef = useRef(0);

  // Diagonal step rotation override (Y-axis rotation in radians)
  const [diagonalRotationY, setDiagonalRotationY] = useState<number | null>(
    null
  );

  // Load animation when currentAnimation or blocking state changes
  useEffect(() => {
    // Reset animation time whenever animation changes
    animTimeRef.current = 0;

    let selectedAnim: SkeletalAnimation | undefined;
    let playbackSpeed = 1.0;
    let shouldClearDiagonalRotation = true;

    if (currentAnimation === "attack" && attackAnimation) {
      // Attack animation - first check stance-specific attacks, then generic
      selectedAnim =
        getAttackAnimation(attackAnimation) ?? getAnimation(attackAnimation);
      playbackSpeed = 1.0;
    } else if (currentAnimation === "defend" || isBlocking) {
      // Block/defend animation - check stance-specific defensive animations first
      // If attackAnimation contains a defensive animation name, use it
      if (attackAnimation) {
        selectedAnim = getDefensiveAnimation(attackAnimation);
      }
      // Fall back to generic block animation
      if (!selectedAnim) {
        selectedAnim = getAnimation("block");
      }
      playbackSpeed = 1.0;
    } else if (currentAnimation === "idle") {
      // Idle animation - uses breathing cycle from BasicAnimations
      selectedAnim = getAnimation("idle");
      playbackSpeed = 0.5; // Slow breathing animation
    } else if (currentAnimation === "walk") {
      // Walking animation
      selectedAnim = getAnimation("walk");
      playbackSpeed = 1.0;
    } else if (currentAnimation === "run") {
      // Running animation - faster gait from BasicAnimations
      selectedAnim = getAnimation("run");
      playbackSpeed = 1.0;
    } else if (currentAnimation?.startsWith("fall_")) {
      // Fall animations - directional falls from BasicAnimations
      selectedAnim = getAnimation(currentAnimation);
      playbackSpeed = 1.0;
    } else if (currentAnimation === "stance_change") {
      // Stance change animation
      selectedAnim = getAnimation("idle_stance");
      playbackSpeed = 1.2; // Slightly faster for responsiveness
    } else if (currentAnimation === "hit") {
      // Hit reaction - stop animation
      setAnimState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
      return;
    } else if (currentAnimation?.startsWith("step_")) {
      // Tactical step animation
      selectedAnim = getStepAnimation(currentAnimation);
      playbackSpeed = 1.0;

      // Handle diagonal step rotation
      if (DIAGONAL_STEP_ANIMATIONS.has(currentAnimation)) {
        shouldClearDiagonalRotation = false;
        // Diagonal rotation will be handled by parent component
        // This hook only manages the flag
      }
    } else if (currentAnimation?.startsWith("footwork_")) {
      // Footwork pattern animation
      selectedAnim = getFootworkAnimation(currentAnimation);
      playbackSpeed = 1.0;
    } else if (currentAnimation?.startsWith("stance_")) {
      // Stance-specific idle animation with proper biomechanics
      // Use getAnimationByName which searches ALL_ANIMATIONS (includes STANCE_ANIMATIONS)
      selectedAnim = getAnimationByName(currentAnimation);
      playbackSpeed = 0.5; // Slow breathing animation for stance idle
    } else {
      // Idle animation (fallback)
      selectedAnim = getAnimation("idle_stance");
      playbackSpeed = 0.5; // Slow breathing animation
    }

    // Clear diagonal rotation for non-diagonal animations
    if (shouldClearDiagonalRotation) {
      setDiagonalRotationY(null);
    }

    // Update animation state
    if (selectedAnim) {
      setAnimState({
        currentAnimation: selectedAnim,
        currentTime: 0,
        isPlaying: true,
        playbackSpeed,
        previousKeyframeIndex: 0,
        nextKeyframeIndex: 1,
      });
    }
  }, [currentAnimation, attackAnimation, isBlocking]);

  // Update animation and apply to rig (called at 60fps in useFrame)
  // PHASE 2: Now uses cached interpolation and batch bone updates
  const updateRigAnimation = useCallback(
    (targetRig: SkeletalRig, delta: number) => {
      if (animState.isPlaying && animState.currentAnimation) {
        const frameStartTime = performance.now();

        // Advance animation time
        let newTime = animTimeRef.current + delta * animState.playbackSpeed;
        let completed = false;

        // Handle looping or completion
        if (newTime >= animState.currentAnimation.duration) {
          if (animState.currentAnimation.loop) {
            newTime = newTime % animState.currentAnimation.duration;
          } else {
            newTime = animState.currentAnimation.duration;
            completed = true;
          }
        }

        // Use cached interpolation for 90%+ cache hit rate
        // Use animation.name as the unique identifier
        const keyframe = interpolateKeyframeCached(
          animState.currentAnimation.name,
          animState.currentAnimation,
          newTime
        );

        if (keyframe) {
          // Batch update bones (60% faster than individual updates)
          batchUpdateBones(targetRig, keyframe);
        }

        // Update time ref
        animTimeRef.current = newTime;

        // Record performance metrics
        const frameTime = performance.now() - frameStartTime;
        performanceMonitor.recordFrame(frameTime);

        // Handle animation completion
        if (completed) {
          animTimeRef.current = 0;
          setAnimState((prev) => ({
            ...prev,
            isPlaying: false,
            currentTime: 0,
          }));

          // Trigger callback
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      }
    },
    [animState, onAnimationComplete]
  );

  return {
    animState,
    animTimeRef,
    updateRigAnimation,
    diagonalRotationY,
  };
}
