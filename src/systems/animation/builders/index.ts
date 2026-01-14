/**
 * Builder and pose utilities sub-package
 *
 * Fluent builders, keyframe helpers, phase applicators, and rig utilities
 * for constructing skeletal animations.
 */

export {
  AnimationBuilder,
  AnimationPatternHelpers,
  AnimationPresets,
  BoneRotationHelpers,
  KeyframeFactories,
} from "./AnimationBuilder";

export * from "./MartialArtsAnimationBuilder";

export { KeyframeConfig } from "./KeyframeConfig";
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
  applyHandPoseToConfig,
  applyHandPoseToKeyframe,
} from "./HandPoseApplicator";
export {
  applyHighPeakPhaseToConfig,
  applyKickPhaseToConfig,
  applyRoundhousePhaseToConfig,
  applySideKickPhaseToConfig,
  getKickPhase,
} from "./KickPhaseApplicator";
export {
  applyMartialPoseToConfig,
  applyMartialPoseToKeyframe,
  getMartialPose,
} from "./MartialPoseApplicator";
export { applyPunchPhaseToConfig, getPunchPhase } from "./PunchPhaseApplicator";

export {
  TECHNIQUE_HAND_POSES,
  createInitialHandAnimationState,
  getHandPose,
  getTechniqueHandPose,
  updateHandAnimationState,
} from "./HandPoses";
export * from "./KoreanGuardPositions";
export * from "./MartialArtsConstants";

export {
  BONE_CHAINS,
  JOINT_CONSTRAINTS,
  TORSO_CONSTRAINTS,
  applyJointConstraint,
  calculateHipRotationPowerModifier,
  createBone,
  createHandBones,
  createHumanoidRig,
  createHumanoidRigWithHands,
  createScaledHumanoidRig,
  getBoneWorldPosition,
  getBoneWorldRotation,
  resetBoneToRestPose,
  resetRigToRestPose,
} from "./SkeletonRig";
