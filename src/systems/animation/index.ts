/**
 * Animation system exports for Black Trigram
 * 
 * Unified exports for the animation state machine, priority system,
 * and transition rules.
 * 
 * @module systems/animation
 * @category Animation
 * @korean 애니메이션시스템
 */

export * from "./types";
export * from "./AnimationStateMachine";
export * from "./AnimationPriority";
export * from "./AnimationTransitions";

export {
  PlayerAnimationStateMachine,
  DEFAULT_ANIMATION_CONFIGS,
} from "./AnimationStateMachine";

export {
  canInterrupt,
  getPriority,
  comparePriority,
  ANIMATION_PRIORITY_MAP,
} from "./AnimationPriority";

export {
  isTransitionAllowed,
  getValidTransitions,
  buildTransitionMap,
  DEFAULT_TRANSITIONS,
} from "./AnimationTransitions";
