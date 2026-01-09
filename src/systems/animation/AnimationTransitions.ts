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

import { AnimationState, TransitionRule, FallType, FALL_TO_GROUND_MAP } from "./types";
import { TrigramStance } from "../../types/common";
import { KoreanText } from "../../types";

/**
 * Stance guard animation states (팔괘 방어 자세)
 * @korean 자세방어상태들
 */
const STANCE_GUARD_STATES: readonly AnimationState[] = [
  AnimationState.STANCE_GUARD_GEON,
  AnimationState.STANCE_GUARD_TAE,
  AnimationState.STANCE_GUARD_LI,
  AnimationState.STANCE_GUARD_JIN,
  AnimationState.STANCE_GUARD_SON,
  AnimationState.STANCE_GUARD_GAM,
  AnimationState.STANCE_GUARD_GAN,
  AnimationState.STANCE_GUARD_GON,
] as const;

/**
 * Type of stance transition based on stance adjacency
 * 
 * **Korean**: 자세 전환 유형
 * 
 * - **direct**: Adjacent stances (e.g., geon→tae) - smooth, fast transition
 * - **indirect**: Opposite stances (e.g., geon→gon) - requires intermediate neutral position
 * - **self**: Same stance (no transition needed)
 * 
 * @public
 * @category Animation
 * @korean 자세전환유형
 */
export type StanceTransitionType = 'direct' | 'indirect' | 'self';

/**
 * Keyframe for stance transition animation with blend weight
 * 
 * **Korean**: 자세 전환 키프레임
 * 
 * Defines a single keyframe in a stance transition animation, specifying
 * which stance pose to blend and how much weight to apply.
 * 
 * @public
 * @category Animation
 * @korean 자세전환키프레임
 */
export interface StanceTransitionKeyframe {
  /** Frame number (0-36 for 600ms at 60fps) */
  readonly frame: number;
  /** Stance pose to blend towards */
  readonly stance: TrigramStance | 'neutral';
  /** Blend weight (0.0 to 1.0) */
  readonly blend: number;
}

/**
 * Complete stance transition animation configuration
 * 
 * **Korean**: 자세 전환 애니메이션
 * 
 * Defines a complete transition animation between two trigram stances,
 * including keyframes, timing, and transition type.
 * 
 * @public
 * @category Animation
 * @korean 자세전환애니메이션
 */
export interface StanceTransition {
  /** Source stance */
  readonly from: TrigramStance;
  /** Target stance */
  readonly to: TrigramStance;
  /** Transition type based on adjacency */
  readonly type: StanceTransitionType;
  /** Duration in milliseconds (600ms standard) */
  readonly duration: number;
  /** Animation keyframes */
  readonly keyframes: readonly StanceTransitionKeyframe[];
  /** Bilingual description */
  readonly description: KoreanText;
}

/**
 * Order of trigram stances in the stance wheel (circular arrangement)
 * 
 * **Korean**: 팔괘 순서
 * 
 * The 8 trigrams arranged in traditional order around the Bagua octagon.
 * Adjacent stances in this array are considered "adjacent" for transition purposes.
 * 
 * @korean 팔괘순서
 */
export const TRIGRAM_STANCES_ORDER: readonly TrigramStance[] = [
  TrigramStance.GEON,  // ☰ Heaven
  TrigramStance.TAE,   // ☱ Lake
  TrigramStance.LI,    // ☲ Fire
  TrigramStance.JIN,   // ☳ Thunder
  TrigramStance.SON,   // ☴ Wind
  TrigramStance.GAM,   // ☵ Water
  TrigramStance.GAN,   // ☶ Mountain
  TrigramStance.GON,   // ☷ Earth
] as const;

/**
 * Fall animation states (낙법 상태)
 * @korean 낙법상태들
 */
const FALL_STATES: readonly AnimationState[] = [
  AnimationState.FALL_FORWARD,
  AnimationState.FALL_BACKWARD,
  AnimationState.FALL_SIDE_LEFT,
  AnimationState.FALL_SIDE_RIGHT,
] as const;

/**
 * Ground position states (지면 자세)
 * @korean 지면자세들
 */
const GROUND_STATES: readonly AnimationState[] = [
  AnimationState.GROUND_PRONE,
  AnimationState.GROUND_SUPINE,
  AnimationState.GROUND_SIDE_LEFT,
  AnimationState.GROUND_SIDE_RIGHT,
] as const;

/**
 * Recovery animation states (기상 애니메이션)
 * @korean 회복애니메이션들
 */
const RECOVERY_STATES: readonly AnimationState[] = [
  AnimationState.RECOVERY_PRONE_STANDUP,
  AnimationState.RECOVERY_SUPINE_STANDUP,
  AnimationState.RECOVERY_ROLL,
  AnimationState.RECOVERY_DEFENSIVE,
] as const;

/**
 * Generate transition rules for fall animations
 * 
 * Fall animations have highest priority and can interrupt any state.
 * Falls automatically transition to ground states upon completion.
 * Ground states can transition to recovery animations.
 * Recovery animations transition to idle upon completion.
 * 
 * @korean 낙법전환규칙생성
 */
function generateFallTransitions(): TransitionRule[] {
  const transitions: TransitionRule[] = [];
  
  // All states (except falls and ko) can transition to fall states
  const nonFallStates: AnimationState[] = [
    AnimationState.IDLE,
    AnimationState.WALK,
    AnimationState.RUN,
    AnimationState.ATTACK,
    AnimationState.DEFEND,
    AnimationState.HIT,
    AnimationState.STANCE_CHANGE,
    AnimationState.STANCE_SIDE_SWITCH,
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
    // Use FALL_TO_GROUND_MAP for type-safe mapping
    const fallType = fallState.replace("fall_", "");
    
    // Validate that fallType is a valid FallType before using in map
    if (fallType === "forward" || fallType === "backward" || 
        fallType === "side_left" || fallType === "side_right") {
      const groundState = FALL_TO_GROUND_MAP[fallType as FallType];
      const groundAnimState = `ground_${groundState}` as AnimationState;
      transitions.push({
        from: fallState,
        to: groundAnimState,
        allowed: true,
      });
    }
  }
  
  // Ground states can transition to recovery animations
  for (const groundState of GROUND_STATES) {
    // Allow transitions to all recovery types from any ground state
    for (const recoveryState of RECOVERY_STATES) {
      transitions.push({
        from: groundState,
        to: recoveryState,
        allowed: true,
      });
    }
    
    // Ground states can still be interrupted by hit or ko
    transitions.push(
      { from: groundState, to: AnimationState.HIT, allowed: true },
      { from: groundState, to: AnimationState.KO, allowed: true }
    );
    
    // Falls can interrupt ground states (getting hit while down)
    for (const fallState of FALL_STATES) {
      transitions.push({
        from: groundState,
        to: fallState,
        allowed: true,
      });
    }
  }
  
  // Recovery animations can be interrupted by high-priority states
  // (falls, hit, ko) but transition to idle when complete
  for (const recoveryState of RECOVERY_STATES) {
    // Falls can interrupt recovery (getting hit during recovery)
    for (const fallState of FALL_STATES) {
      transitions.push({
        from: recoveryState,
        to: fallState,
        allowed: true,
      });
    }
    
    // Hit and KO can interrupt recovery
    transitions.push(
      { from: recoveryState, to: AnimationState.HIT, allowed: true },
      { from: recoveryState, to: AnimationState.KO, allowed: true }
    );
    
    // Recovery animations automatically transition to idle (handled in state machine)
    transitions.push({
      from: recoveryState,
      to: AnimationState.IDLE,
      allowed: true,
    });
  }
  
  return transitions;
}

/**
 * Generate transition rules for stance guards
 * 
 * Each stance guard can transition to:
 * - walk, run (movement)
 * - attack, defend (combat actions)
 * - step_{direction} (tactical steps while maintaining guard)
 * - stance_change (changing stance)
 * - hit, ko (being hit)
 * - other stance guards (direct stance change with guard)
 * 
 * @korean 자세방어전환규칙생성
 */
function generateStanceGuardTransitions(): TransitionRule[] {
  const transitions: TransitionRule[] = [];

  // Step directions for guard transitions
  const stepDirections: AnimationState[] = [
    AnimationState.STEP_FORWARD,
    AnimationState.STEP_BACK,
    AnimationState.STEP_LEFT,
    AnimationState.STEP_RIGHT,
    AnimationState.STEP_FORWARD_LEFT,
    AnimationState.STEP_FORWARD_RIGHT,
    AnimationState.STEP_BACK_LEFT,
    AnimationState.STEP_BACK_RIGHT,
  ];

  for (const guardState of STANCE_GUARD_STATES) {
    // Guard can transition to movement
    transitions.push(
      { from: guardState, to: AnimationState.IDLE, allowed: true },
      { from: guardState, to: AnimationState.WALK, allowed: true },
      { from: guardState, to: AnimationState.RUN, allowed: true }
    );

    // Guard can transition to combat actions
    transitions.push(
      { from: guardState, to: AnimationState.ATTACK, allowed: true },
      { from: guardState, to: AnimationState.DEFEND, allowed: true },
      { from: guardState, to: AnimationState.STANCE_CHANGE, allowed: true }
    );
    
    // Guard can transition to tactical steps (guard maintained during step)
    for (const stepDirection of stepDirections) {
      transitions.push({ from: guardState, to: stepDirection, allowed: true });
    }

    // Guard can be interrupted by hits
    transitions.push(
      { from: guardState, to: AnimationState.HIT, allowed: true },
      { from: guardState, to: AnimationState.KO, allowed: true }
    );

    // Guards can transition between each other (direct stance change)
    for (const otherGuard of STANCE_GUARD_STATES) {
      if (guardState !== otherGuard) {
        transitions.push({ from: guardState, to: otherGuard, allowed: true });
      }
    }

    // Other states can transition to guards
    transitions.push(
      { from: AnimationState.IDLE, to: guardState, allowed: true },
      { from: AnimationState.WALK, to: guardState, allowed: true },
      { from: AnimationState.RUN, to: guardState, allowed: true },
      { from: AnimationState.DEFEND, to: guardState, allowed: true }
    );
    
    // Steps can return to guard (guard maintained throughout step)
    for (const stepDirection of stepDirections) {
      transitions.push({ from: stepDirection, to: guardState, allowed: true });
    }
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
  { from: AnimationState.IDLE, to: AnimationState.WALK, allowed: true },
  { from: AnimationState.IDLE, to: AnimationState.RUN, allowed: true },
  { from: AnimationState.IDLE, to: AnimationState.ATTACK, allowed: true },
  { from: AnimationState.IDLE, to: AnimationState.DEFEND, allowed: true },
  { from: AnimationState.IDLE, to: AnimationState.STANCE_CHANGE, allowed: true },
  { from: AnimationState.IDLE, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.IDLE, to: AnimationState.KO, allowed: true },

  // Walk transitions
  { from: AnimationState.WALK, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.RUN, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.ATTACK, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.DEFEND, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STANCE_CHANGE, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.KO, allowed: true },

  // Run transitions
  { from: AnimationState.RUN, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.RUN, to: AnimationState.WALK, allowed: true },
  { from: AnimationState.RUN, to: AnimationState.ATTACK, allowed: true },
  { from: AnimationState.RUN, to: AnimationState.DEFEND, allowed: true },
  { from: AnimationState.RUN, to: AnimationState.STANCE_CHANGE, allowed: true },
  { from: AnimationState.RUN, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.RUN, to: AnimationState.KO, allowed: true },

  // Attack transitions (typically returns to idle after completion)
  { from: AnimationState.ATTACK, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.ATTACK, to: AnimationState.HIT, allowed: true }, // Can be interrupted by hit
  { from: AnimationState.ATTACK, to: AnimationState.KO, allowed: true },

  // Defend transitions (typically returns to idle after completion)
  { from: AnimationState.DEFEND, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.DEFEND, to: AnimationState.WALK, allowed: true },
  { from: AnimationState.DEFEND, to: AnimationState.HIT, allowed: true }, // Can be interrupted by hit
  { from: AnimationState.DEFEND, to: AnimationState.KO, allowed: true },

  // Hit transitions (returns to idle after completion)
  { from: AnimationState.HIT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.HIT, to: AnimationState.HIT, allowed: true }, // Can take multiple hits
  { from: AnimationState.HIT, to: AnimationState.KO, allowed: true },

  // Stance change transitions (returns to idle after completion)
  { from: AnimationState.STANCE_CHANGE, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STANCE_CHANGE, to: AnimationState.HIT, allowed: true }, // Can be interrupted by hit
  { from: AnimationState.STANCE_CHANGE, to: AnimationState.KO, allowed: true },
  
  // Tactical step transitions (non-interruptible, returns to idle/guard after completion)
  // Steps can be initiated from idle, walk, or guard states
  // 전진보법 (Forward Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_FORWARD, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_FORWARD, allowed: true },
  { from: AnimationState.STEP_FORWARD, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_FORWARD, to: AnimationState.HIT, allowed: true }, // Can be hit during step
  { from: AnimationState.STEP_FORWARD, to: AnimationState.KO, allowed: true },
  
  // 후퇴보법 (Retreat Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_BACK, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_BACK, allowed: true },
  { from: AnimationState.STEP_BACK, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_BACK, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_BACK, to: AnimationState.KO, allowed: true },
  
  // 좌측면보법 (Left Side Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_LEFT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_LEFT, allowed: true },
  { from: AnimationState.STEP_LEFT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_LEFT, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_LEFT, to: AnimationState.KO, allowed: true },
  
  // 우측면보법 (Right Side Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_RIGHT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_RIGHT, allowed: true },
  { from: AnimationState.STEP_RIGHT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_RIGHT, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_RIGHT, to: AnimationState.KO, allowed: true },
  
  // 전좌측보법 (Forward-Left Diagonal Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_FORWARD_LEFT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_FORWARD_LEFT, allowed: true },
  { from: AnimationState.STEP_FORWARD_LEFT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_FORWARD_LEFT, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_FORWARD_LEFT, to: AnimationState.KO, allowed: true },
  
  // 전우측보법 (Forward-Right Diagonal Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_FORWARD_RIGHT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_FORWARD_RIGHT, allowed: true },
  { from: AnimationState.STEP_FORWARD_RIGHT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_FORWARD_RIGHT, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_FORWARD_RIGHT, to: AnimationState.KO, allowed: true },
  
  // 후좌측보법 (Back-Left Diagonal Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_BACK_LEFT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_BACK_LEFT, allowed: true },
  { from: AnimationState.STEP_BACK_LEFT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_BACK_LEFT, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_BACK_LEFT, to: AnimationState.KO, allowed: true },
  
  // 후우측보법 (Back-Right Diagonal Step)
  { from: AnimationState.IDLE, to: AnimationState.STEP_BACK_RIGHT, allowed: true },
  { from: AnimationState.WALK, to: AnimationState.STEP_BACK_RIGHT, allowed: true },
  { from: AnimationState.STEP_BACK_RIGHT, to: AnimationState.IDLE, allowed: true },
  { from: AnimationState.STEP_BACK_RIGHT, to: AnimationState.HIT, allowed: true },
  { from: AnimationState.STEP_BACK_RIGHT, to: AnimationState.KO, allowed: true },

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

/**
 * Calculate stance adjacency (distance around the stance wheel)
 * 
 * **Korean**: 자세 인접도 계산
 * 
 * Determines how many steps apart two stances are on the octagonal stance wheel.
 * Returns 0 for same stance, 1-3 for adjacent stances, 4 for opposite stances.
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @returns Number of steps apart (0-4)
 * 
 * @example
 * ```typescript
 * calculateStanceDistance(TrigramStance.GEON, TrigramStance.TAE); // 1 (adjacent)
 * calculateStanceDistance(TrigramStance.GEON, TrigramStance.SON); // 4 (opposite)
 * calculateStanceDistance(TrigramStance.GEON, TrigramStance.GEON); // 0 (same)
 * ```
 * 
 * @korean 자세거리계산
 */
export function calculateStanceDistance(
  from: TrigramStance,
  to: TrigramStance
): number {
  if (from === to) return 0;
  
  const fromIndex = TRIGRAM_STANCES_ORDER.indexOf(from);
  const toIndex = TRIGRAM_STANCES_ORDER.indexOf(to);
  
  if (fromIndex === -1 || toIndex === -1) {
    console.warn(`Invalid stance in distance calculation: ${from} -> ${to}`);
    return 4; // Treat as opposite stance
  }
  
  // Calculate shortest distance around the circular wheel
  const directDistance = Math.abs(toIndex - fromIndex);
  const wrapDistance = TRIGRAM_STANCES_ORDER.length - directDistance;
  
  return Math.min(directDistance, wrapDistance);
}

/**
 * Determine transition type based on stance distance
 * 
 * **Korean**: 전환 유형 결정
 * 
 * Classifies transition as direct (adjacent), indirect (opposite), or self.
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @returns Transition type
 * 
 * @korean 전환유형결정
 */
export function determineTransitionType(
  from: TrigramStance,
  to: TrigramStance
): StanceTransitionType {
  const distance = calculateStanceDistance(from, to);
  
  if (distance === 0) return 'self';
  if (distance <= 2) return 'direct'; // Adjacent or near-adjacent
  return 'indirect'; // Opposite or far apart
}

/**
 * Generate keyframes for direct stance transition (adjacent stances)
 * 
 * **Korean**: 직접 전환 키프레임 생성
 * 
 * Creates smooth keyframes for transitions between adjacent stances.
 * Phase breakdown:
 * - Frames 0-12: Weight shift away from source stance
 * - Frames 12-24: Foot repositioning
 * - Frames 24-36: Guard change to target stance
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @returns Array of keyframes
 * 
 * @korean 직접전환키프레임생성
 */
function generateDirectTransitionKeyframes(
  from: TrigramStance,
  to: TrigramStance
): readonly StanceTransitionKeyframe[] {
  return [
    // Phase 1: Initial weight shift (frames 0-12)
    { frame: 0, stance: from, blend: 1.0 },
    { frame: 6, stance: from, blend: 0.8 },
    { frame: 12, stance: 'neutral', blend: 0.5 },
    
    // Phase 2: Foot repositioning (frames 12-24)
    { frame: 18, stance: 'neutral', blend: 0.4 },
    { frame: 24, stance: to, blend: 0.3 },
    
    // Phase 3: Guard position change (frames 24-36)
    { frame: 30, stance: to, blend: 0.7 },
    { frame: 36, stance: to, blend: 1.0 },
  ];
}

/**
 * Generate keyframes for indirect stance transition (opposite stances)
 * 
 * **Korean**: 간접 전환 키프레임 생성
 * 
 * Creates keyframes for transitions between opposite stances via neutral position.
 * Longer neutral phase for more complex repositioning.
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @returns Array of keyframes
 * 
 * @korean 간접전환키프레임생성
 */
function generateIndirectTransitionKeyframes(
  from: TrigramStance,
  to: TrigramStance
): readonly StanceTransitionKeyframe[] {
  return [
    // Phase 1: Exit source stance (frames 0-12)
    { frame: 0, stance: from, blend: 1.0 },
    { frame: 6, stance: from, blend: 0.7 },
    { frame: 12, stance: 'neutral', blend: 0.5 },
    
    // Phase 2: Extended neutral position (frames 12-24)
    { frame: 18, stance: 'neutral', blend: 0.5 },
    { frame: 24, stance: 'neutral', blend: 0.4 },
    
    // Phase 3: Enter target stance (frames 24-36)
    { frame: 30, stance: to, blend: 0.6 },
    { frame: 36, stance: to, blend: 1.0 },
  ];
}

/**
 * Create a stance transition configuration
 * 
 * **Korean**: 자세 전환 생성
 * 
 * Generates complete transition configuration between two stances.
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @returns Complete stance transition configuration
 * 
 * @korean 자세전환생성
 */
export function createStanceTransition(
  from: TrigramStance,
  to: TrigramStance
): StanceTransition {
  const type = determineTransitionType(from, to);
  
  // Self-transition (no animation)
  if (type === 'self') {
    return {
      from,
      to,
      type: 'self',
      duration: 0,
      keyframes: [
        { frame: 0, stance: from, blend: 1.0 },
      ],
      description: {
        korean: `${from} 자세 유지`,
        english: `Maintain ${from} stance`,
      },
    };
  }
  
  // Generate keyframes based on transition type
  const keyframes = type === 'direct' 
    ? generateDirectTransitionKeyframes(from, to)
    : generateIndirectTransitionKeyframes(from, to);
  
  return {
    from,
    to,
    type,
    duration: 600, // 600ms standard transition
    keyframes,
    description: {
      korean: `${from}에서 ${to}로 전환`,
      english: `Transition from ${from} to ${to}`,
    },
  };
}

/**
 * Stance transition matrix containing all 64 transitions (8x8)
 * 
 * **Korean**: 팔괘 전환 행렬
 * 
 * Maps from every stance to every other stance, including self-transitions.
 * Key format: "from_to" (e.g., "geon_tae")
 * 
 * Total transitions: 64 (8 source stances × 8 target stances)
 * - 8 self-transitions (0ms)
 * - ~24 direct transitions (600ms, adjacent stances)
 * - ~32 indirect transitions (600ms, opposite stances)
 * 
 * @korean 팔괘전환행렬
 */
export const STANCE_TRANSITIONS: Map<string, StanceTransition> = new Map();

/**
 * Initialize the stance transition matrix
 * 
 * **Korean**: 전환 행렬 초기화
 * 
 * Generates all 64 stance transitions and populates the transition map.
 * Call this during system initialization.
 * 
 * @korean 전환행렬초기화
 */
export function initializeStanceTransitions(): void {
  // Generate all 64 transitions (8 from × 8 to)
  for (const from of TRIGRAM_STANCES_ORDER) {
    for (const to of TRIGRAM_STANCES_ORDER) {
      const key = `${from}_${to}`;
      const transition = createStanceTransition(from, to);
      STANCE_TRANSITIONS.set(key, transition);
    }
  }
  
  if (process.env.NODE_ENV === "development") {
    console.log(`[StanceTransitions] Initialized ${STANCE_TRANSITIONS.size} stance transitions`);
  }
}

/**
 * Get stance transition configuration
 * 
 * **Korean**: 자세 전환 가져오기
 * 
 * Retrieves the transition configuration for moving from one stance to another.
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @returns Transition configuration, or undefined if not found
 * 
 * @example
 * ```typescript
 * const transition = getStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
 * console.log(transition.duration); // 600
 * console.log(transition.type); // "direct"
 * ```
 * 
 * @korean 자세전환가져오기
 */
export function getStanceTransition(
  from: TrigramStance,
  to: TrigramStance
): StanceTransition | undefined {
  const key = `${from}_${to}`;
  return STANCE_TRANSITIONS.get(key);
}

/**
 * Get all valid transitions from a stance
 * 
 * **Korean**: 유효한 전환 목록
 * 
 * Returns all possible transitions from the given stance.
 * 
 * @param from - Source stance
 * @returns Array of all transitions from this stance
 * 
 * @korean 유효한전환목록
 */
export function getTransitionsFromStance(
  from: TrigramStance
): StanceTransition[] {
  const transitions: StanceTransition[] = [];
  
  for (const to of TRIGRAM_STANCES_ORDER) {
    const transition = getStanceTransition(from, to);
    if (transition) {
      transitions.push(transition);
    }
  }
  
  return transitions;
}

// Note: For production use, consider calling initializeStanceTransitions()
// during application startup to avoid blocking the main thread.
// For now, initialize on module load for convenience.
initializeStanceTransitions();
