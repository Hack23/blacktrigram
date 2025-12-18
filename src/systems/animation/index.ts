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

// Skeletal animation system
export {
  createBone,
  createHumanoidRig,
  updateBoneWorldMatrices,
  getBoneWorldPosition,
  getBoneWorldRotation,
  resetBone,
  resetRigToBind,
  cloneRig,
} from "./SkeletonRig";

export {
  JAB_ANIMATION,
  CROSS_ANIMATION,
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  BLOCK_ANIMATION,
  FIGHTING_STANCE_ANIMATION,
  IDLE_ANIMATION,
  ANIMATION_CLIPS,
} from "./AttackAnimations";
