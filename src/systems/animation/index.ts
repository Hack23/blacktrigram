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
  AnimationPatternHelpers,
  AnimationPresets,
  BoneRotationHelpers,
  KeyframeFactories,
} from "./AnimationBuilder";

// Martial arts animation builder (semantic API)
export {
  AnimationType,
  KICK_PHASES,
  MARTIAL_POSES,
  MartialArtsAnimationBuilder,
  PUNCH_PHASES,
} from "./MartialArtsAnimationBuilder";

// Technique animation mapping
export {
  TECHNIQUE_ANIMATIONS,
  getAnimationForTechniqueOrDefault,
  getAnimationStats,
  getAnimationForTechnique as getTechniqueAnimationConfig,
  getTechniquesByAnimationType,
  hasAnimationMapping,
  type AnimationConfig,
} from "./TechniqueAnimationMapping";

// Animation registry (unified access)
export {
  ALL_ANIMATIONS,
  ANIMATION_REGISTRY,
  ELBOW_KNEE_ANIMATIONS,
  GRAPPLING_ANIMATIONS,
  KICK_ANIMATIONS,
  PUNCH_ANIMATIONS,
  getAnimation, // Unified lookup across ALL_ANIMATIONS
  getAnimationByName,
  getAnimationByType,
  getAnimationByTypeOrDefault,
  getAnimationForTechniqueId,
  getAnimationForTechniqueIdWithConfig,
} from "./AnimationRegistry";

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
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GEON_HIGH_GUARD_POSE,
  GON_EARTH_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  STANCE_GUARD_CONFIGS,
  TAE_FLUID_GUARD_POSE,
  getAllStanceGuardPoses,
  getGuardConfigForStance,
  getGuardPoseForStance,
} from "./StanceGuardPoses";

// Skeletal animation system
export {
  BONE_CHAINS,
  JOINT_CONSTRAINTS,
  TORSO_CONSTRAINTS,
  applyJointConstraint,
  calculateHipRotationPowerModifier,
  calculateTorsoRotation,
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
} from "./AttackAnimations";

// Animation lookup with stance-specific support
export { getAnimationForTechnique } from "./AnimationRegistry";

// Basic animations (Idle, Walk, Run, Fall)
export {
  BASIC_ANIMATIONS,
  FALL_BACKWARD_ANIMATION,
  FALL_FORWARD_ANIMATION,
  FALL_SIDE_LEFT_ANIMATION,
  FALL_SIDE_RIGHT_ANIMATION,
  IDLE_ANIMATION,
  RUN_ANIMATION,
  WALK_ANIMATION as WALK_ANIMATION_NEW,
} from "./BasicAnimations";

// Step movement animations
export {
  STEP_ANIMATIONS,
  STEP_BACK_ANIMATION,
  STEP_FORWARD_ANIMATION,
  STEP_LEFT_ANIMATION,
  STEP_RIGHT_ANIMATION,
  getStepAnimation,
} from "./StepSkeletalAnimations";

// Footwork pattern animations
export {
  FOOTWORK_ANIMATIONS,
  FOOTWORK_CIRCULAR_LEFT_ANIMATION,
  FOOTWORK_CIRCULAR_RIGHT_ANIMATION,
  FOOTWORK_PIVOT_LEFT_ANIMATION,
  FOOTWORK_PIVOT_RIGHT_ANIMATION,
  FOOTWORK_SHUFFLE_ANIMATION,
  FOOTWORK_SLIDE_BACK_ANIMATION,
  FOOTWORK_SLIDE_FORWARD_ANIMATION,
  FOOTWORK_SLIDE_LEFT_ANIMATION,
  FOOTWORK_SLIDE_RIGHT_ANIMATION,
  getFootworkAnimation,
} from "./FootworkSkeletalAnimations";

// Step animation system
export {
  STEP_ANIMATION_CONFIGS,
  STEP_ANIMATION_PARAMS,
  STEP_KEYFRAMES,
  STEP_KOREAN_TERMS,
  createStepConfig,
  getStepDirectionVector,
  getStepKeyframeAtFrame,
  interpolateStepKeyframes,
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
  BodyFacingSystem,
  DEFAULT_ROTATION_SPEED,
  MAX_HEAD_ROTATION,
  MAX_TORSO_ROTATION,
  TURN_ANIMATION_DURATION,
  TURN_THRESHOLD_ANGLE,
  bodyFacingSystem,
  calculateAngleDifference,
  calculateAngleToTarget,
  createDefaultBodyFacing,
  getFacingAngleRadians,
  getHeadAngleRadians,
  getHipRotationRadians,
  getTorsoRotationRadians,
  isTurning,
  lockFacing,
  normalizeAngle,
  unlockFacing,
  updateBodyFacing,
  updateFacingTowardOpponent,
} from "./BodyFacingSystem";

// Enhanced technique animation mapper
export {
  TechniqueAnimationMapper,
  calculateSpeedModifierForDamage,
  determineAnimationTypeForTechnique,
  getAdjustedAnimationDuration,
  getAnimationNameForType,
  hasAnimationForType,
  techniqueAnimationMapper,
} from "./TechniqueAnimationMapper";

// Defensive animations system (16 stance-specific defensive moves)
export {
  ALL_DEFENSIVE_ANIMATIONS,
  // Collections and lookup functions
  DEFENSIVE_ANIMATIONS_BY_STANCE,
  GAM_FLOW_DEFENSE,
  GAM_REDIRECTION_COUNTER,
  GAN_COUNTER_FORTRESS,
  GAN_IMMOVABLE_BLOCK,
  GEON_COUNTER_STRIKE,
  // Individual defensive animations
  GEON_HIGH_BLOCK,
  GON_GROUNDING_DEFENSE,
  GON_TAKEDOWN_COUNTER,
  JIN_EXPLOSIVE_BLOCK,
  JIN_SHOCKING_COUNTER,
  LI_NERVE_STRIKE_COUNTER,
  LI_PRECISION_PARRY,
  SON_CONTINUOUS_DEFLECTION,
  SON_PRESSURE_COUNTER,
  TAE_JOINT_LOCK_DEFENSE,
  TAE_SWEEP_DEFENSE,
  getDefensiveAnimation,
  getDefensiveAnimationsForStance,
} from "./DefensiveAnimations";

// Stance-specific locomotion animations (16 unique - 8 walk, 8 run)
export {
  GAM_RUN_ANIMATION,
  GAM_WALK_ANIMATION,
  GAN_RUN_ANIMATION,
  GAN_WALK_ANIMATION,
  // Run animations
  GEON_RUN_ANIMATION,
  // Walk animations
  GEON_WALK_ANIMATION,
  GON_RUN_ANIMATION,
  GON_WALK_ANIMATION,
  JIN_RUN_ANIMATION,
  JIN_WALK_ANIMATION,
  LI_RUN_ANIMATION,
  LI_WALK_ANIMATION,
  SON_RUN_ANIMATION,
  SON_WALK_ANIMATION,
  STANCE_LOCOMOTION_ANIMATIONS,
  STANCE_RUN_ANIMATIONS,
  // Collections and lookup functions
  STANCE_WALK_ANIMATIONS,
  TAE_RUN_ANIMATION,
  TAE_WALK_ANIMATION,
  getStanceRunAnimation,
  getStanceWalkAnimation,
} from "./StanceLocomotionAnimations";

// Stance-specific attack animations (24 unique attacks - 3 per stance)
export {
  ALL_ATTACK_ANIMATIONS,
  // Collections and lookup functions
  ATTACK_ANIMATIONS_BY_STANCE,
  // GAM (Water) attacks
  GAM_FLOWING_RIVER_STRIKE,
  GAM_TIDAL_WAVE_PALM,
  GAM_WHIRLPOOL_COUNTER,
  GAN_AVALANCHE_HAMMER,
  // GAN (Mountain) attacks
  GAN_FORTRESS_COUNTER_STRIKE,
  GAN_STONE_WALL_THRUST,
  // GEON (Heaven) attacks
  GEON_BONE_BREAKING_STRIKE_1,
  GEON_CRUSHING_ELBOW,
  GEON_THUNDEROUS_UPPERCUT,
  GON_EARTHQUAKE_STOMP,
  // GON (Earth) attacks
  GON_GROUND_SWEEP_STRIKE,
  GON_ROOTING_TAKEDOWN,
  JIN_EXPLOSIVE_KNEE,
  // JIN (Thunder) attacks
  JIN_LIGHTNING_STRAIGHT,
  JIN_SHOCKING_HAMMER_FIST,
  // LI (Fire) attacks
  LI_BURNING_FINGER_STRIKE_1,
  LI_PHOENIX_EYE_STRIKE,
  LI_SOLAR_PLEXUS_SPEAR,
  SON_PENETRATING_PALM_RUSH,
  SON_PRESSURE_POINT_CHAIN,
  // SON (Wind) attacks
  SON_WHIRLWIND_COMBO_1,
  TAE_FLOWING_ARM_BAR,
  TAE_SPIRAL_SHOULDER_THROW,
  // TAE (Lake) attacks
  TAE_WRIST_LOCK_STRIKE,
  getAttackAnimation,
  getAttackAnimationsForStance,
} from "./StanceAttackAnimations";

// Advanced joint movements system
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
  type AnkleArticulationState,
  type BodySide,
  type HandStrikeType,
  type HipRotationState,
  type KickHeight,
  type KickType,
  type KneeDriveState,
  type KneePhase,
  type KneeTechniqueType,
  type ShoulderElevationState,
  type ShoulderPhase,
  type ShoulderTechniqueType,
  type SpinalFlexionState,
  type SpinalMovementType,
  type StrikePhase,
  type TechniquePhase,
  type WristSnapState,
} from "./AdvancedJointMovements";
