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

// Animation builder utilities (new)
export {
  AnimationBuilder,
  KeyframeFactories,
  BoneRotationHelpers,
} from "./AnimationBuilder";

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
  TORSO_CONSTRAINTS,
  applyJointConstraint,
  createBone,
  createHumanoidRig,
  createScaledHumanoidRig,
  getBoneWorldPosition,
  getBoneWorldRotation,
  resetBoneToRestPose,
  resetRigToRestPose,
  calculateTorsoRotation,
  calculateHipRotationPowerModifier,
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

// Step movement animations
export {
  STEP_FORWARD_ANIMATION,
  STEP_BACK_ANIMATION,
  STEP_LEFT_ANIMATION,
  STEP_RIGHT_ANIMATION,
  STEP_ANIMATIONS,
  getStepAnimation,
} from "./StepSkeletalAnimations";

// Footwork pattern animations
export {
  FOOTWORK_CIRCULAR_LEFT_ANIMATION,
  FOOTWORK_CIRCULAR_RIGHT_ANIMATION,
  FOOTWORK_SLIDE_FORWARD_ANIMATION,
  FOOTWORK_SLIDE_BACK_ANIMATION,
  FOOTWORK_SLIDE_LEFT_ANIMATION,
  FOOTWORK_SLIDE_RIGHT_ANIMATION,
  FOOTWORK_PIVOT_LEFT_ANIMATION,
  FOOTWORK_PIVOT_RIGHT_ANIMATION,
  FOOTWORK_SHUFFLE_ANIMATION,
  FOOTWORK_ANIMATIONS,
  getFootworkAnimation,
} from "./FootworkSkeletalAnimations";

// Step animation system
export {
  STEP_ANIMATION_PARAMS,
  STEP_KEYFRAMES,
  STEP_ANIMATION_CONFIGS,
  STEP_KOREAN_TERMS,
  createStepConfig,
  interpolateStepKeyframes,
  getStepKeyframeAtFrame,
  getStepDirectionVector,
} from "./StepAnimations";

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

// Fall animation system
export {
  FALL_BACKWARD_KEYFRAMES,
  FALL_FORWARD_KEYFRAMES,
  FALL_IMPACT_FRAMES,
  FALL_SIDE_KEYFRAMES,
  determineFallDirection,
  determineFallFromStance,
  getFallKeyframes,
  getImpactFrame,
} from "./FallAnimations";

// Body facing direction system
export {
  bodyFacingSystem,
  BodyFacingSystem,
  createDefaultBodyFacing,
  updateBodyFacing,
  updateFacingTowardOpponent,
  lockFacing,
  unlockFacing,
  isTurning,
  getFacingAngleRadians,
  getHeadAngleRadians,
  getTorsoRotationRadians,
  getHipRotationRadians,
  normalizeAngle,
  calculateAngleDifference,
  calculateAngleToTarget,
  DEFAULT_ROTATION_SPEED,
  MAX_TORSO_ROTATION,
  MAX_HEAD_ROTATION,
  TURN_THRESHOLD_ANGLE,
  TURN_ANIMATION_DURATION,
} from "./BodyFacingSystem";

// Enhanced technique animation mapper
export {
  TechniqueAnimationMapper,
  techniqueAnimationMapper,
  getAnimationNameForType,
  hasAnimationForType,
  determineAnimationTypeForTechnique,
  calculateSpeedModifierForDamage,
  getAdjustedAnimationDuration,
} from "./TechniqueAnimationMapper";
// Advanced joint movements system
export {
  ADVANCED_JOINT_CONSTRAINTS,
  calculateHipRotationForKick,
  calculateKickPowerFromHipRotation,
  applyHipRotationToEuler,
  calculateAnkleArticulation,
  calculateWristSnap,
  calculateWristSnapPowerModifier,
  calculateShoulderElevation,
  calculateSpinalFlexion,
  calculateKneeDrive,
  calculateKneeStrikePowerModifier,
  type BodySide,
  type KickType,
  type HandStrikeType,
  type KickHeight,
  type TechniquePhase,
  type StrikePhase,
  type ShoulderTechniqueType,
  type ShoulderPhase,
  type SpinalMovementType,
  type KneeTechniqueType,
  type KneePhase,
  type HipRotationState,
  type ShoulderElevationState,
  type AnkleArticulationState,
  type WristSnapState,
  type KneeDriveState,
  type SpinalFlexionState,
} from "./AdvancedJointMovements";
