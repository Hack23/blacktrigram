/**
 * Animation system exports for Black Trigram
 * 
 * Unified exports for the animation state machine, priority system,
 * transition rules, and skeletal animation system.
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
  applyJointConstraint,
  getBoneWorldPosition,
  getBoneWorldRotation,
  resetBoneToRestPose,
  resetRigToRestPose,
  JOINT_CONSTRAINTS,
  BONE_CHAINS,
} from "./SkeletonRig";

export {
  JAB_ANIMATION,
  CROSS_ANIMATION,
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  BLOCK_ANIMATION,
  WALK_ANIMATION,
  ATTACK_ANIMATIONS,
  getAnimation,
} from "./AttackAnimations";

export {
  easeLinear,
  easeIn,
  easeOut,
  easeInOut,
  getEasingFunction,
  findSurroundingKeyframes,
  interpolateRotation,
  interpolatePosition,
  getInterpolatedKeyframe,
  applyKeyframeToRig,
  blendKeyframes,
  updateAnimation,
} from "./KeyframeInterpolation";
