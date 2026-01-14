/**
 * Runtime animation systems sub-package
 *
 * Facial expressions, head and body tracking, advanced joint movement helpers,
 * fall handling, and recovery visualizations.
 */

export {
  calculateFacialDamage,
  createDefaultExpressionState,
  createDefaultFacialDamage,
  createExpressionTransition,
  DEFAULT_TRANSITION_CONFIG,
  getExpressionFromCombatState,
  getExpressionIntensity,
  resetFacialDamage,
  updateExpressionState,
} from "./FacialExpressions";
export type { ExpressionTransitionConfig } from "./FacialExpressions";

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

export {
  determineFallDirection,
  determineFallFromStance,
  FALL_BACKWARD_KEYFRAMES,
  FALL_FORWARD_KEYFRAMES,
  FALL_IMPACT_FRAMES,
  FALL_SIDE_KEYFRAMES,
  getFallKeyframes,
  getImpactFrame,
} from "./FallAnimations";

export {
  BodyFacingSystem,
  bodyFacingSystem,
  calculateAngleDifference,
  calculateAngleToTarget,
  createDefaultBodyFacing,
  DEFAULT_ROTATION_SPEED,
  getFacingAngleRadians,
  getHeadAngleRadians,
  getHipRotationRadians,
  getTorsoRotationRadians,
  HEAD_TRACKING_SMOOTHING,
  isTurning,
  lockFacing,
  MAX_HEAD_ROTATION,
  MAX_TORSO_ROTATION,
  normalizeAngle,
  TURN_ANIMATION_DURATION,
  TURN_THRESHOLD_ANGLE,
  unlockFacing,
  updateBodyFacing,
  updateFacingTowardOpponent,
} from "./BodyFacingSystem";

export {
  ADVANCED_JOINT_CONSTRAINTS,
  applyHipRotationToEuler,
  calculateAnkleArticulation,
  calculateHipRotationForKick,
  calculateKickPowerFromHipRotation,
  calculateKneeDrive,
  calculateKneeStrikePowerModifier,
  calculateShoulderElevation,
  calculateSpinalFlexion,
  calculateWristSnap,
  calculateWristSnapPowerModifier,
} from "./AdvancedJointMovements";
export type {
  AnkleArticulationState,
  BodySide,
  HandStrikeType,
  HipRotationState,
  KickHeight,
  KickType,
  KneeDriveState,
  KneePhase,
  KneeTechniqueType,
  ShoulderElevationState,
  ShoulderPhase,
  ShoulderTechniqueType,
  SpinalFlexionState,
  SpinalMovementType,
  StrikePhase,
  TechniquePhase,
  WristSnapState,
} from "./AdvancedJointMovements";

export {
  compareRecoveryPhases,
  generateRecoveryVisualization,
  generateTensionChart,
  printRecoveryAnalysis,
} from "./RecoveryVisualization";
export type {
  RecoveryTimelinePoint,
  RecoveryVisualization,
} from "./RecoveryVisualization";

export * from "./MuscleActivation";
