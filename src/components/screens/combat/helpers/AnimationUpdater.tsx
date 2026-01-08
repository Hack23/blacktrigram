/**
 * AnimationUpdater - Component that updates player animations at 60fps
 *
 * Uses useFrame to call update() on both animation state machines.
 * This component only updates animation state and renders no visual elements.
 *
 * @module components/combat/helpers/AnimationUpdater
 * @category Combat Utilities
 * @korean 애니메이션업데이터
 */

import { useFrame } from "@react-three/fiber";
import React from "react";
import { usePlayerAnimation } from "../../../../hooks/usePlayerAnimation";

/**
 * Props for AnimationUpdater component
 */
export interface AnimationUpdaterProps {
  /** Player 1 animation state machine */
  readonly player1Animation: ReturnType<typeof usePlayerAnimation>;
  /** Player 2 animation state machine */
  readonly player2Animation: ReturnType<typeof usePlayerAnimation>;
}

/**
 * AnimationUpdater Component
 *
 * Updates both player animations at 60fps using Three.js useFrame hook.
 * Component only updates animation state, renders no visual elements.
 *
 * @example
 * ```tsx
 * <AnimationUpdater
 *   player1Animation={player1Animation}
 *   player2Animation={player2Animation}
 * />
 * ```
 */
export const AnimationUpdater: React.FC<AnimationUpdaterProps> = ({
  player1Animation,
  player2Animation,
}) => {
  useFrame((_state, delta) => {
    // Update both player animations at 60fps
    player1Animation.update(delta);
    player2Animation.update(delta);
  });

  return null; // Component only updates animation state, renders no visual elements
};

export default AnimationUpdater;
