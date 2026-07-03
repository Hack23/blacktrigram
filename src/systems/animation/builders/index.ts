/**
 * Builder and pose utilities sub-package
 *
 * Fluent builders, keyframe helpers, phase applicators, and rig utilities
 * for constructing skeletal animations with integrated anatomy state.
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
export type { HandHighlightMode } from "./KeyframeConfig";
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
export type { KickPhaseName, KickSide } from "./KickPhaseApplicator";
export {
  applyMartialPoseToConfig,
  applyMartialPoseToKeyframe,
  getMartialPose,
} from "./MartialPoseApplicator";
export { applyPunchPhaseToConfig, getPunchPhase } from "./PunchPhaseApplicator";
export type { PunchPhaseName, PunchSide } from "./PunchPhaseApplicator";

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

// Animation factory presets for reducing code duplication
export {
  TIMING_PRESETS,
  createKickAnimation,
  createPunchAnimation,
  createTrigramLocomotion,
  createDefenseAnimation,
  createBothStances,
  createComboAnimation,
  createTrigramBreathing,
  getAnimationForStance,
  PRESET_KICKS,
  PRESET_PUNCHES,
  PRESET_COMBOS,
} from "./AnimationFactoryPresets";
export type {
  KickConfig,
  PunchConfig,
  LocomotionConfig,
  DefenseConfig,
  LeadFoot,
} from "./AnimationFactoryPresets";
