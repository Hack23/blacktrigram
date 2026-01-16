/**
 * Animation catalog sub-package
 *
 * Curated collections of skeletal animations for attacks, defenses,
 * locomotion, stances, and recovery-aware variants.
 */

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

// Core attack animations
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

// Basic locomotion and fall animations
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

// Step animation configuration helpers
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

// Defensive animations system (16 stance-specific defensive moves)
export {
  ALL_DEFENSIVE_ANIMATIONS,
  DEFENSIVE_ANIMATIONS_BY_STANCE,
  GAM_FLOW_DEFENSE,
  GAM_REDIRECTION_COUNTER,
  GAN_COUNTER_FORTRESS,
  GAN_IMMOVABLE_BLOCK,
  GEON_COUNTER_STRIKE,
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
  GEON_RUN_ANIMATION,
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
  STANCE_WALK_ANIMATIONS,
  TAE_RUN_ANIMATION,
  TAE_WALK_ANIMATION,
  getStanceRunAnimation,
  getStanceWalkAnimation,
} from "./StanceLocomotionAnimations";

// Stance-specific attack animations (24 unique attacks - 3 per stance)
export {
  ALL_ATTACK_ANIMATIONS,
  ATTACK_ANIMATIONS_BY_STANCE,
  GAM_FLOWING_RIVER_STRIKE,
  GAM_TIDAL_WAVE_PALM,
  GAM_WHIRLPOOL_COUNTER,
  GAN_AVALANCHE_HAMMER,
  GAN_FORTRESS_COUNTER_STRIKE,
  GAN_STONE_WALL_THRUST,
  GEON_BONE_BREAKING_STRIKE_1,
  GEON_CRUSHING_ELBOW,
  GEON_THUNDEROUS_UPPERCUT,
  GON_EARTHQUAKE_STOMP,
  GON_GROUND_SWEEP_STRIKE,
  GON_ROOTING_TAKEDOWN,
  JIN_EXPLOSIVE_KNEE,
  JIN_LIGHTNING_STRAIGHT,
  JIN_SHOCKING_HAMMER_FIST,
  LI_BURNING_FINGER_STRIKE_1,
  LI_PHOENIX_EYE_STRIKE,
  LI_SOLAR_PLEXUS_SPEAR,
  SON_PENETRATING_PALM_RUSH,
  SON_PRESSURE_POINT_CHAIN,
  SON_WHIRLWIND_COMBO_1,
  TAE_FLOWING_ARM_BAR,
  TAE_SPIRAL_SHOULDER_THROW,
  TAE_WRIST_LOCK_STRIKE,
  getAttackAnimation,
  getAttackAnimationsForStance,
} from "./StanceAttackAnimations";

// Enhanced attack animations with recovery phases
export {
  CROSS_ANIMATION_ENHANCED,
  ENHANCED_ANIMATIONS,
  FRONT_KICK_ANIMATION_ENHANCED,
  JAB_ANIMATION_ENHANCED,
  RECOVERY_PRESETS,
  ROUNDHOUSE_KICK_ANIMATION_ENHANCED,
  applyRecoveryPreset,
} from "./EnhancedAttackAnimations";

// Enhanced elbow and knee animations with recovery phases
export {
  ELBOW_STRIKE_ANIMATION_ENHANCED,
  ELBOW_UPPERCUT_ANIMATION_ENHANCED,
  ENHANCED_ELBOW_KNEE_ANIMATIONS,
  KNEE_STRIKE_ANIMATION_ENHANCED,
} from "./EnhancedElbowKneeAnimations";

// Trigram stance idle animations (8 unique idle stances with breathing)
export {
  ALL_TRIGRAM_IDLE_ANIMATIONS,
  GAM_IDLE_ANIMATION,
  GAN_IDLE_ANIMATION,
  GEON_IDLE_ANIMATION,
  GON_IDLE_ANIMATION,
  JIN_IDLE_ANIMATION,
  LI_IDLE_ANIMATION,
  SON_IDLE_ANIMATION,
  TAE_IDLE_ANIMATION,
  TRIGRAM_IDLE_ANIMATIONS,
  TRIGRAM_IDLE_ANIMATIONS_BY_NAME,
  TRIGRAM_IDLE_METADATA,
  getTrigramIdleAnimation,
  getTrigramIdleByName,
} from "./StanceIdleAnimations";

// Geon (Heaven) trigram-specific animations
export {
  GEON_ANIMATIONS,
  GEON_AXE_KICK,
  GEON_DIAGONAL_POWER_STEP,
  GEON_ELBOW_SMASH,
  GEON_FORWARD_ADVANCE,
  GEON_FRONTAL_KICK,
  GEON_HEAVEN_STRIKE,
  GEON_HEAVENLY_FIST_ANIMATION,
  GEON_IDLE_BREATHING,
  GEON_OVERHEAD_HAMMER,
  GEON_PALM_STRIKE,
  GEON_ROUNDHOUSE_KICK,
} from "./GeonStanceAnimations";

// Gan (Mountain) trigram-specific animations
export {
  GAN_DEFENSIVE_ANGLE_SHIFT,
  GAN_HIGH_SOLID_GUARD_TRANSITION,
  GAN_IDLE_ROOTED,
  GAN_SHORT_ROOT_STEP,
  GAN_STANCE_ANIMATIONS,
} from "./GanStanceAnimations";

export {
  GAN_DEFENSIVE_REVERSAL,
  GAN_ROCK_DEFENSE_ANIMATION,
  GAN_TECHNIQUE_ANIMATIONS,
} from "./GanTechniqueAnimations";

// Tae (Lake) trigram-specific animations
export {
  TAE_CIRCULAR_SIDESTEP,
  TAE_DIAGONAL_CIRCULAR_APPROACH,
  TAE_FLEXIBLE_GUARD_TRANSITION,
  TAE_IDLE_FLOWING,
  TAE_STANCE_ANIMATIONS,
} from "./TaeStanceAnimations";
// Jin (Thunder) trigram-specific animations
export {
  JIN_ANIMATIONS,
  JIN_IDLE_COILED,
  JIN_EXPLOSIVE_BURST,
  JIN_JUMPING_ADVANCE,
} from "./JinStanceAnimations";

// Jin technique animations
export {
  JIN_TECHNIQUE_ANIMATIONS,
  JIN_THUNDER_FLASH_ANIMATION,
  JIN_JUMPING_KNEE_STRIKE,
} from "./JinTechniqueAnimations";

// Additional curated animation catalogs
export * from "./ComboAnimations";
export * from "./DarkOpsAnimations";
export * from "./ElbowKneeAnimations";
export * from "./GamRedirectionAnimations";
export * from "./GrapplingAnimations";
export * from "./KickAnimations";
export * from "./MovementAnimations";
export * from "./PunchAnimations";
export * from "./RecoveryAnimations";
export * from "./StanceAnimations";
export * from "./TaeJointLockAnimations";
