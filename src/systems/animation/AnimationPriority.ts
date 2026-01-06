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

import { AnimationPriority, AnimationState, STEP_PRIORITY } from "./types";

/**
 * Map animation states to their priority levels
 * 
 * Stance guard animations have same priority as idle (0) since they are
 * also idle states, just stance-specific.
 * Tactical steps have priority 5 (same as attacks) to ensure commitment.
 * 
 * @korean 애니메이션우선순위맵
 */
export const ANIMATION_PRIORITY_MAP: Record<AnimationState, AnimationPriority> = {
  idle: AnimationPriority.IDLE,
  walk: AnimationPriority.WALK,
  run: AnimationPriority.RUN,
  stance_change: AnimationPriority.STANCE_CHANGE,
  stance_side_switch: AnimationPriority.STANCE_CHANGE, // Same priority as stance_change
  defend: AnimationPriority.DEFEND,
  attack: AnimationPriority.ATTACK,
  hit: AnimationPriority.HIT,
  ko: AnimationPriority.KO,
  // Stance-specific guard animations (팔괘 방어 자세)
  stance_guard_geon: AnimationPriority.IDLE,
  stance_guard_tae: AnimationPriority.IDLE,
  stance_guard_li: AnimationPriority.IDLE,
  stance_guard_jin: AnimationPriority.IDLE,
  stance_guard_son: AnimationPriority.IDLE,
  stance_guard_gam: AnimationPriority.IDLE,
  stance_guard_gan: AnimationPriority.IDLE,
  stance_guard_gon: AnimationPriority.IDLE,
  // Tactical step animations (전술적 발걸음) - non-interruptible
  step_forward: STEP_PRIORITY,
  step_back: STEP_PRIORITY,
  step_left: STEP_PRIORITY,
  step_right: STEP_PRIORITY,
  step_forward_left: STEP_PRIORITY,
  step_forward_right: STEP_PRIORITY,
  step_back_left: STEP_PRIORITY,
  step_back_right: STEP_PRIORITY,
  // Fall animations (낙법) - highest priority
  fall_forward: AnimationPriority.FALL,
  fall_backward: AnimationPriority.FALL,
  fall_side_left: AnimationPriority.FALL,
  fall_side_right: AnimationPriority.FALL,
  // Ground states (지면 자세) - idle priority
  ground_prone: AnimationPriority.IDLE,
  ground_supine: AnimationPriority.IDLE,
  ground_side_left: AnimationPriority.IDLE,
  ground_side_right: AnimationPriority.IDLE,
  // 180-degree turn animations (180도 회전) - same as steps (committed action)
  turn_left: STEP_PRIORITY,
  turn_right: STEP_PRIORITY,
  // Footwork patterns (보법) - Korean martial arts specialized footwork
  footwork_circular_left: STEP_PRIORITY,
  footwork_circular_right: STEP_PRIORITY,
  footwork_pivot_left: STEP_PRIORITY,
  footwork_pivot_right: STEP_PRIORITY,
  footwork_slide_forward: AnimationPriority.DEFEND,
  footwork_slide_back: AnimationPriority.DEFEND,
  footwork_slide_left: AnimationPriority.DEFEND,
  footwork_slide_right: AnimationPriority.DEFEND,
  footwork_shuffle: AnimationPriority.STANCE_CHANGE,
  // Recovery animations (기상 애니메이션) - highest priority (can interrupt anything)
  recovery_prone_standup: AnimationPriority.RECOVERY,
  recovery_supine_standup: AnimationPriority.RECOVERY,
  recovery_roll: AnimationPriority.RECOVERY,
  recovery_defensive: AnimationPriority.RECOVERY,
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
