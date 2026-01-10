/**
 * useBalanceAnimations - Shared hook for balance state visual effects
 *
 * Manages sway, stumble, and lean animations based on player balance state.
 * Reduces code duplication in skeletal animation components.
 *
 * @module hooks/useBalanceAnimations
 * @category Hooks
 * @korean 균형애니메이션훅
 */

import { useRef, useState } from "react";
import type { BalanceState } from "../types/player-visual";

/**
 * Animation constants for balance state sway effects.
 * Defines intensity, speed, and lean parameters for visual feedback.
 * @korean 균형상태애니메이션상수
 */
const BALANCE_STATE_ANIMATION_CONSTANTS = {
  SHAKEN: {
    swayIntensity: 0.02, // 2% subtle sway
    swaySpeed: 2, // Hz frequency
  },
  VULNERABLE: {
    swayIntensity: 0.04, // 4% moderate sway
    swaySpeed: 3, // Hz frequency
  },
  HELPLESS: {
    stumbleIntensity: 0.08, // 8% pronounced stumble
    stumbleSpeed: 1.5, // Hz frequency (slower, more dramatic)
    leanIntensity: 0.15, // 15° forward lean angle
    lowerStance: -0.15, // Lower Y position for stumbling effect
  },
  SWAY_THRESHOLD: 0.001, // Minimum sway to consider significant
} as const;

/**
 * Checks if there is significant sway that requires animation updates.
 *
 * @param swayPosition - Current sway position [x, y, z]
 * @param helplessRotation - Current helpless rotation angle
 * @returns True if sway is above threshold
 * @korean 의미있는흔들림확인
 */
const hasSignificantSway = (
  swayPosition: [number, number, number],
  helplessRotation: number
): boolean => {
  return (
    Math.abs(swayPosition[0]) >
      BALANCE_STATE_ANIMATION_CONSTANTS.SWAY_THRESHOLD ||
    Math.abs(swayPosition[1]) >
      BALANCE_STATE_ANIMATION_CONSTANTS.SWAY_THRESHOLD ||
    Math.abs(helplessRotation) >
      BALANCE_STATE_ANIMATION_CONSTANTS.SWAY_THRESHOLD
  );
};

/**
 * Options for useBalanceAnimations hook
 * @korean 균형애니메이션훅옵션
 */
export interface UseBalanceAnimationsOptions {
  /** Current balance state */
  readonly balance?: BalanceState;
}

/**
 * Return type for useBalanceAnimations hook
 * @korean 균형애니메이션훅반환타입
 */
export interface UseBalanceAnimationsReturn {
  /** Current sway position offset [x, y, z] */
  readonly swayPosition: [number, number, number];
  /** Current helpless rotation (forward lean) */
  readonly helplessRotation: number;
  /** Update balance animations (call in useFrame) */
  readonly updateBalanceAnimations: (delta: number, frameCounter: number) => void;
}

/**
 * useBalanceAnimations hook
 *
 * Manages balance state visual effects including sway, stumble, and lean
 * animations. Updates at 60fps with periodic state syncs to reduce re-renders.
 *
 * @param options - Balance animation options
 * @returns Balance animation state and update function
 *
 * @example
 * ```tsx
 * const { swayPosition, helplessRotation, updateBalanceAnimations } =
 *   useBalanceAnimations({
 *     balance: "VULNERABLE",
 *   });
 *
 * // In useFrame callback
 * let frameCounter = 0;
 * useFrame((_, delta) => {
 *   frameCounter = (frameCounter + 1) % 10;
 *   updateBalanceAnimations(delta, frameCounter);
 * });
 *
 * // Apply to character group in render:
 * // position={swayPosition} rotation={[helplessRotation, 0, 0]}
 * ```
 *
 * @korean 균형애니메이션훅
 */
export function useBalanceAnimations(
  options: UseBalanceAnimationsOptions
): UseBalanceAnimationsReturn {
  const { balance = "READY" } = options;

  // Sway time ref for animation
  const swayTimeRef = useRef(0);

  // Sway position and rotation states
  const [swayPosition, setSwayPosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [helplessRotation, setHelplessRotation] = useState<number>(0);

  // Update balance animations (called at 60fps in useFrame)
  const updateBalanceAnimations = (
    delta: number,
    frameCounter: number
  ): void => {
    if (balance === "HELPLESS") {
      // Helpless state: pronounced stumbling motion
      swayTimeRef.current += delta;

      const { stumbleIntensity, stumbleSpeed, leanIntensity, lowerStance } =
        BALANCE_STATE_ANIMATION_CONSTANTS.HELPLESS;

      const swayX =
        Math.sin(swayTimeRef.current * stumbleSpeed) * stumbleIntensity;
      const swayY =
        Math.cos(swayTimeRef.current * stumbleSpeed * 0.5) *
          stumbleIntensity *
          0.3 +
        lowerStance;
      const leanAngle =
        Math.sin(swayTimeRef.current * stumbleSpeed * 0.7) * leanIntensity;

      // Update periodically to reduce React re-renders
      if (frameCounter % 2 === 0) {
        setSwayPosition([swayX, swayY, 0]);
        setHelplessRotation(leanAngle);
      }
    } else if (balance === "SHAKEN" || balance === "VULNERABLE") {
      // Shaken/Vulnerable state: subtle sway
      swayTimeRef.current += delta;

      const animConfig =
        balance === "SHAKEN"
          ? BALANCE_STATE_ANIMATION_CONSTANTS.SHAKEN
          : BALANCE_STATE_ANIMATION_CONSTANTS.VULNERABLE;

      const swayX =
        Math.sin(swayTimeRef.current * animConfig.swaySpeed) *
        animConfig.swayIntensity;
      const swayY =
        Math.cos(swayTimeRef.current * animConfig.swaySpeed * 0.8) *
        animConfig.swayIntensity *
        0.5;

      // Update sway position periodically
      if (frameCounter % 2 === 0) {
        setSwayPosition([swayX, swayY, 0]);
        setHelplessRotation(0);
      }
    } else {
      // Smoothly return to neutral position
      if (
        frameCounter % 2 === 0 &&
        hasSignificantSway(swayPosition, helplessRotation)
      ) {
        setSwayPosition([swayPosition[0] * 0.95, swayPosition[1] * 0.95, 0]);
        setHelplessRotation(helplessRotation * 0.95);
      }

      // Reset sway time when not swaying
      if (!hasSignificantSway(swayPosition, helplessRotation)) {
        swayTimeRef.current = 0;
      }
    }
  };

  return {
    swayPosition,
    helplessRotation,
    updateBalanceAnimations,
  };
}
