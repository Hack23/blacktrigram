/**
 * Animation system exports for Black Trigram
 *
 * Unified exports for the animation state machine, priority system,
 * transition rules, skeletal animation system, and stance guard poses.
 *
 * @module systems/animation
 * @category Animation
 * @korean 애니메이션시스템
 */

export * from "./AnimationPriority";
export * from "./AnimationStateMachine";
export * from "./AnimationTransitions";
export * from "./types";

export {
  DEFAULT_ANIMATION_CONFIGS,
  PlayerAnimationStateMachine,
} from "./AnimationStateMachine";

export {
  ANIMATION_PRIORITY_MAP,
  canInterrupt,
  comparePriority,
  getPriority,
} from "./AnimationPriority";

export {
  DEFAULT_TRANSITIONS,
  buildTransitionMap,
  getValidTransitions,
  isTransitionAllowed,
} from "./AnimationTransitions";

// Stance guard pose system
export {
  GEON_HIGH_GUARD_POSE,
  TAE_FLUID_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GON_EARTH_GUARD_POSE,
  STANCE_GUARD_CONFIGS,
  getGuardPoseForStance,
  getGuardConfigForStance,
  getAllStanceGuardPoses,
} from "./StanceGuardPoses";

// Skeletal animation system
export {
  BONE_CHAINS,
  JOINT_CONSTRAINTS,
  applyJointConstraint,
  createBone,
  createHumanoidRig,
  createScaledHumanoidRig,
  getBoneWorldPosition,
  getBoneWorldRotation,
  resetBoneToRestPose,
  resetRigToRestPose,
} from "./SkeletonRig";

export {
  ATTACK_ANIMATIONS,
  BACKWARD_RETREAT_ANIMATION,
  BLOCK_ANIMATION,
  CROSS_ANIMATION,
  FORWARD_DASH_ANIMATION,
  FRONT_KICK_ANIMATION,
  IDLE_STANCE_ANIMATION,
  JAB_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_STEP_ANIMATION,
  WALK_ANIMATION,
  getAnimation,
  getAnimationForTechnique,
} from "./AttackAnimations";

export {
  applyKeyframeToRig,
  blendKeyframes,
  easeIn,
  easeInOut,
  easeLinear,
  easeOut,
  findSurroundingKeyframes,
  getEasingFunction,
  getInterpolatedKeyframe,
  interpolatePosition,
  interpolateRotation,
  updateAnimation,
} from "./KeyframeInterpolation";

export {
  FIST_POSE,
  GRAPPLING_POSE,
  HAND_POSES,
  KNIFE_HAND_POSE,
  OPEN_POSE,
  PALM_HEEL_POSE,
  RELAXED_POSE,
  SPEAR_HAND_POSE,
  TECHNIQUE_HAND_POSES,
  createInitialHandAnimationState,
  getHandPose,
  getTechniqueHandPose,
  interpolateFingerCurl,
  interpolateFingerSpread,
  interpolateWristRotation,
  setHandHighlight,
  updateHandAnimationState,
} from "./HandPoses";

export { createHandBones, createHumanoidRigWithHands } from "./SkeletonRig";

// Facial expression system
export {
  DEFAULT_TRANSITION_CONFIG,
  calculateFacialDamage,
  createDefaultExpressionState,
  createDefaultFacialDamage,
  createExpressionTransition,
  getExpressionFromCombatState,
  getExpressionIntensity,
  resetFacialDamage,
  updateExpressionState,
  type ExpressionTransitionConfig,
} from "./FacialExpressions";

// Head movement animations
export {
  applyHeadMovementKeyframe,
  calculateSmoothHeadRotation,
  createHeadDropAnimation,
  createHeadNodAnimation,
  createHeadRecoilAnimation,
  createHeadShakeAnimation,
  createHeadTiltAnimation,
  createHeadTurnAnimation,
  getHeadMovementByType,
  isHeadMovementComplete,
} from "./HeadMovements";
