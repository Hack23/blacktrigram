/**
 * Animation transition rules for Black Trigram
 * 
 * Defines valid transitions between animation states.
 * Based on game-design.md specifications and combat flow.
 * 
 * Transition rules:
 * - idle ↔ walk ↔ run (movement states)
 * - attack → idle (after completion)
 * - defend → idle (after completion)
 * - hit → idle (after completion)
 * - stance_change → idle (after completion)
 * - ko is terminal (no transitions out)
 * - hit can interrupt any non-ko state (high priority)
 * 
 * @module systems/animation/AnimationTransitions
 * @category Animation
 * @korean 애니메이션전환
 */

import { AnimationState, TransitionRule } from "./types";

/**
 * Default transition rules for animation states
 * 
 * @korean 기본전환규칙
 */
export const DEFAULT_TRANSITIONS: readonly TransitionRule[] = [
  // Idle transitions
  { from: "idle", to: "walk", allowed: true },
  { from: "idle", to: "run", allowed: true },
  { from: "idle", to: "attack", allowed: true },
  { from: "idle", to: "defend", allowed: true },
  { from: "idle", to: "stance_change", allowed: true },
  { from: "idle", to: "hit", allowed: true },
  { from: "idle", to: "ko", allowed: true },

  // Walk transitions
  { from: "walk", to: "idle", allowed: true },
  { from: "walk", to: "run", allowed: true },
  { from: "walk", to: "attack", allowed: true },
  { from: "walk", to: "defend", allowed: true },
  { from: "walk", to: "stance_change", allowed: true },
  { from: "walk", to: "hit", allowed: true },
  { from: "walk", to: "ko", allowed: true },

  // Run transitions
  { from: "run", to: "idle", allowed: true },
  { from: "run", to: "walk", allowed: true },
  { from: "run", to: "attack", allowed: true },
  { from: "run", to: "defend", allowed: true },
  { from: "run", to: "stance_change", allowed: true },
  { from: "run", to: "hit", allowed: true },
  { from: "run", to: "ko", allowed: true },

  // Attack transitions (typically returns to idle after completion)
  { from: "attack", to: "idle", allowed: true },
  { from: "attack", to: "hit", allowed: true }, // Can be interrupted by hit
  { from: "attack", to: "ko", allowed: true },

  // Defend transitions (typically returns to idle after completion)
  { from: "defend", to: "idle", allowed: true },
  { from: "defend", to: "walk", allowed: true },
  { from: "defend", to: "hit", allowed: true }, // Can be interrupted by hit
  { from: "defend", to: "ko", allowed: true },

  // Hit transitions (returns to idle after completion)
  { from: "hit", to: "idle", allowed: true },
  { from: "hit", to: "hit", allowed: true }, // Can take multiple hits
  { from: "hit", to: "ko", allowed: true },

  // Stance change transitions (returns to idle after completion)
  { from: "stance_change", to: "idle", allowed: true },
  { from: "stance_change", to: "hit", allowed: true }, // Can be interrupted by hit
  { from: "stance_change", to: "ko", allowed: true },

  // KO is terminal - no transitions out
  // (Player must be revived/reset to leave KO state)
] as const;

/**
 * Check if a transition from one animation state to another is allowed
 * 
 * @param from - Source animation state
 * @param to - Target animation state
 * @param transitions - Optional custom transition rules (defaults to DEFAULT_TRANSITIONS)
 * @returns Whether the transition is allowed
 * 
 * @example
 * ```typescript
 * // Valid transitions
 * isTransitionAllowed("idle", "walk"); // true
 * isTransitionAllowed("attack", "idle"); // true
 * isTransitionAllowed("hit", "idle"); // true
 * 
 * // Invalid transitions
 * isTransitionAllowed("ko", "idle"); // false (KO is terminal)
 * isTransitionAllowed("attack", "walk"); // false (must return to idle first)
 * ```
 * 
 * @korean 전환허용여부확인
 */
export function isTransitionAllowed(
  from: AnimationState,
  to: AnimationState,
  transitions: readonly TransitionRule[] = DEFAULT_TRANSITIONS
): boolean {
  // Same state is always allowed
  if (from === to) {
    return true;
  }

  // Find matching transition rule
  const rule = transitions.find((t) => t.from === from && t.to === to);

  if (!rule) {
    return false;
  }

  // Check condition if provided
  if (rule.condition) {
    return rule.condition();
  }

  return rule.allowed;
}

/**
 * Get all valid transitions from a given animation state
 * 
 * @param from - Source animation state
 * @param transitions - Optional custom transition rules (defaults to DEFAULT_TRANSITIONS)
 * @returns Array of allowed target animation states
 * 
 * @example
 * ```typescript
 * getValidTransitions("idle"); 
 * // Returns: ["walk", "run", "attack", "defend", "stance_change", "hit", "ko"]
 * 
 * getValidTransitions("ko");
 * // Returns: [] (KO is terminal)
 * ```
 * 
 * @korean 유효전환목록가져오기
 */
export function getValidTransitions(
  from: AnimationState,
  transitions: readonly TransitionRule[] = DEFAULT_TRANSITIONS
): AnimationState[] {
  return transitions
    .filter((t) => t.from === from && t.allowed)
    .map((t) => t.to)
    .filter((to) => isTransitionAllowed(from, to, transitions));
}

/**
 * Build a transition map for fast lookups
 * 
 * @param transitions - Transition rules to build map from
 * @returns Map of from->to->allowed
 * 
 * @korean 전환맵생성
 */
export function buildTransitionMap(
  transitions: readonly TransitionRule[] = DEFAULT_TRANSITIONS
): Map<AnimationState, Set<AnimationState>> {
  const map = new Map<AnimationState, Set<AnimationState>>();

  for (const rule of transitions) {
    if (!rule.allowed) continue;

    if (!map.has(rule.from)) {
      map.set(rule.from, new Set());
    }

    map.get(rule.from)?.add(rule.to);
  }

  return map;
}
