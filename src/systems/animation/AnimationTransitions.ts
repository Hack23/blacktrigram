/**
 * Animation transition rules for Black Trigram
 * 
 * Defines valid transitions between animation states.
 * Based on game-design.md specifications and combat flow.
 * 
 * Transition rules:
 * - idle ↔ walk ↔ run (movement states)
 * - stance_guard_{stance} ↔ other states (stance-specific guards)
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
 * Stance guard animation states (팔괘 방어 자세)
 * @korean 자세방어상태들
 */
const STANCE_GUARD_STATES: readonly AnimationState[] = [
  "stance_guard_geon",
  "stance_guard_tae",
  "stance_guard_li",
  "stance_guard_jin",
  "stance_guard_son",
  "stance_guard_gam",
  "stance_guard_gan",
  "stance_guard_gon",
] as const;

/**
 * Fall animation states (낙법 상태)
 * @korean 낙법상태들
 */
const FALL_STATES: readonly AnimationState[] = [
  "fall_forward",
  "fall_backward",
  "fall_side_left",
  "fall_side_right",
] as const;

/**
 * Ground position states (지면 자세)
 * @korean 지면자세들
 */
const GROUND_STATES: readonly AnimationState[] = [
  "ground_prone",
  "ground_supine",
  "ground_side_left",
  "ground_side_right",
] as const;

/**
 * Generate transition rules for fall animations
 * 
 * Fall animations have highest priority and can interrupt any state.
 * Falls automatically transition to ground states upon completion.
 * Ground states can only transition to recovery animations (future).
 * 
 * @korean 낙법전환규칙생성
 */
function generateFallTransitions(): TransitionRule[] {
  const transitions: TransitionRule[] = [];
  
  // All states (except falls and ko) can transition to fall states
  const nonFallStates: AnimationState[] = [
    "idle",
    "walk",
    "run",
    "attack",
    "defend",
    "hit",
    "stance_change",
    "stance_side_switch",
    ...STANCE_GUARD_STATES,
  ];
  
  for (const fromState of nonFallStates) {
    for (const fallState of FALL_STATES) {
      transitions.push({
        from: fromState,
        to: fallState,
        allowed: true,
      });
    }
  }
  
  // Fall states automatically transition to ground states (handled in state machine)
  for (const fallState of FALL_STATES) {
    // Falls can only go to their corresponding ground state
    // (this is automatic in the state machine update logic)
    const groundState = fallState.replace("fall_", "ground_") as AnimationState;
    transitions.push({
      from: fallState,
      to: groundState,
      allowed: true,
    });
  }
  
  // Ground states are semi-terminal (can only transition to recovery - future feature)
  // For now, they can be interrupted by hit or ko
  for (const groundState of GROUND_STATES) {
    transitions.push(
      { from: groundState, to: "hit", allowed: true },
      { from: groundState, to: "ko", allowed: true }
    );
    
    // Falls can interrupt ground states
    for (const fallState of FALL_STATES) {
      transitions.push({
        from: groundState,
        to: fallState,
        allowed: true,
      });
    }
  }
  
  return transitions;
}

/**
 * Generate transition rules for stance guards
 * 
 * Each stance guard can transition to:
 * - walk, run (movement)
 * - attack, defend (combat actions)
 * - stance_change (changing stance)
 * - hit, ko (being hit)
 * - other stance guards (direct stance change with guard)
 * 
 * @korean 자세방어전환규칙생성
 */
function generateStanceGuardTransitions(): TransitionRule[] {
  const transitions: TransitionRule[] = [];

  for (const guardState of STANCE_GUARD_STATES) {
    // Guard can transition to movement
    transitions.push(
      { from: guardState, to: "idle", allowed: true },
      { from: guardState, to: "walk", allowed: true },
      { from: guardState, to: "run", allowed: true }
    );

    // Guard can transition to combat actions
    transitions.push(
      { from: guardState, to: "attack", allowed: true },
      { from: guardState, to: "defend", allowed: true },
      { from: guardState, to: "stance_change", allowed: true }
    );

    // Guard can be interrupted by hits
    transitions.push(
      { from: guardState, to: "hit", allowed: true },
      { from: guardState, to: "ko", allowed: true }
    );

    // Guards can transition between each other (direct stance change)
    for (const otherGuard of STANCE_GUARD_STATES) {
      if (guardState !== otherGuard) {
        transitions.push({ from: guardState, to: otherGuard, allowed: true });
      }
    }

    // Other states can transition to guards
    transitions.push(
      { from: "idle", to: guardState, allowed: true },
      { from: "walk", to: guardState, allowed: true },
      { from: "run", to: guardState, allowed: true },
      { from: "defend", to: guardState, allowed: true }
    );
  }

  return transitions;
}

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

  // Fall transitions (generated dynamically)
  ...generateFallTransitions(),

  // Stance guard transitions (generated dynamically)
  ...generateStanceGuardTransitions(),
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
