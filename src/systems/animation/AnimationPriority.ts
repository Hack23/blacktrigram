/**
 * Animation priority system for Black Trigram
 * 
 * Determines which animations can interrupt others based on priority levels.
 * Higher priority animations can interrupt lower priority ones.
 * 
 * Priority order: ko > hit > attack > defend > stance_change > movement > idle
 * 
 * @module systems/animation/AnimationPriority
 * @category Animation
 * @korean 애니메이션우선순위
 */

import { AnimationPriority, AnimationState } from "./types";

/**
 * Map animation states to their priority levels
 * 
 * @korean 애니메이션우선순위맵
 */
export const ANIMATION_PRIORITY_MAP: Record<AnimationState, AnimationPriority> = {
  idle: AnimationPriority.IDLE,
  walk: AnimationPriority.WALK,
  run: AnimationPriority.RUN,
  stance_change: AnimationPriority.STANCE_CHANGE,
  defend: AnimationPriority.DEFEND,
  attack: AnimationPriority.ATTACK,
  hit: AnimationPriority.HIT,
  ko: AnimationPriority.KO,
};

/**
 * Check if an animation can interrupt another based on priority
 * 
 * @param current - Current animation state
 * @param requested - Requested animation state
 * @param currentInterruptible - Whether current animation is interruptible
 * @returns Whether the requested animation can interrupt the current one
 * 
 * @example
 * ```typescript
 * // Hit can interrupt attack
 * canInterrupt("attack", "hit", true); // true
 * 
 * // Attack cannot interrupt hit
 * canInterrupt("hit", "attack", true); // false
 * 
 * // Nothing can interrupt non-interruptible animations
 * canInterrupt("attack", "hit", false); // false (unless same priority)
 * ```
 * 
 * @korean 중단가능여부확인
 */
export function canInterrupt(
  current: AnimationState,
  requested: AnimationState,
  currentInterruptible: boolean
): boolean {
  const currentPriority = ANIMATION_PRIORITY_MAP[current];
  const requestedPriority = ANIMATION_PRIORITY_MAP[requested];

  // Same priority animations can always transition
  if (currentPriority === requestedPriority) {
    return true;
  }

  // Non-interruptible animations can only be interrupted by higher priority
  if (!currentInterruptible) {
    return requestedPriority > currentPriority;
  }

  // Interruptible animations can be interrupted by same or higher priority
  return requestedPriority >= currentPriority;
}

/**
 * Get the priority level for an animation state
 * 
 * @param state - Animation state
 * @returns Priority level
 * 
 * @korean 우선순위가져오기
 */
export function getPriority(state: AnimationState): AnimationPriority {
  return ANIMATION_PRIORITY_MAP[state];
}

/**
 * Compare two animation priorities
 * 
 * @param state1 - First animation state
 * @param state2 - Second animation state
 * @returns Positive if state1 has higher priority, negative if state2 has higher priority, 0 if equal
 * 
 * @korean 우선순위비교
 */
export function comparePriority(
  state1: AnimationState,
  state2: AnimationState
): number {
  return ANIMATION_PRIORITY_MAP[state1] - ANIMATION_PRIORITY_MAP[state2];
}
