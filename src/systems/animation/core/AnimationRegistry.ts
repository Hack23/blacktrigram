/**
 * Animation Registry
 *
 * Central registry for all martial arts animations.
 * Combines all animation modules and provides unified access.
 *
 * 무술 애니메이션 레지스트리 - 모든 애니메이션 통합 관리
 *
 * **RECOVERY PHASE INTEGRATION (복귀 단계 통합)**
 *
 * Enhanced animations with realistic recovery phases are now the default for:
 * - JAB_ANIMATION → JAB_ANIMATION_ENHANCED (200ms recovery)
 * - CROSS_ANIMATION → CROSS_ANIMATION_ENHANCED (220ms recovery)
 * - FRONT_KICK_ANIMATION → FRONT_KICK_ANIMATION_ENHANCED (170ms recovery)
 * - ROUNDHOUSE_KICK_ANIMATION → ROUNDHOUSE_KICK_ANIMATION_ENHANCED (180ms recovery)
 * - ELBOW_STRIKE_ANIMATION → ELBOW_STRIKE_ANIMATION_ENHANCED (160ms recovery)
 * - ELBOW_UPPERCUT_ANIMATION → ELBOW_UPPERCUT_ANIMATION_ENHANCED (170ms recovery)
 * - KNEE_STRIKE_ANIMATION → KNEE_STRIKE_ANIMATION_ENHANCED (190ms recovery)
 *
 * Enhanced animations follow Korean martial arts principles (복귀/Bokgwi):
 * - 균형회복 (Gyunhyeong Hoebog) - Balance restoration
 * - 자세복귀 (Jase Bokgwi) - Stance return
 * - 호흡조절 (Hoheup Jojoel) - Breath control during recovery
 * - 근육이완 (Geunryuk Ihwan) - Muscle relaxation after tension
 *
 * All code using ANIMATION_REGISTRY or getAnimationForTechnique() will
 * automatically use enhanced versions with no code changes required.
 *
 * @module systems/animation/AnimationRegistry
 * @korean 애니메이션레지스트리
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { AnimationType } from "../builders/MartialArtsAnimationBuilder";
import {
  BACKWARD_RETREAT_ANIMATION,
  FORWARD_DASH_ANIMATION,
  IDLE_STANCE_ANIMATION,
  SIDE_STEP_ANIMATION,
} from "../catalogs/AttackAnimations";
import { BASIC_ANIMATIONS } from "../catalogs/BasicAnimations";
import { COMBO_ANIMATIONS } from "../catalogs/ComboAnimations";
import { DARKOPS_ANIMATIONS } from "../catalogs/DarkOpsAnimations";
import {
  GAM_FLOW_DEFENSE,
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
  TAE_SWEEP_DEFENSE,
} from "../catalogs/DefensiveAnimations";
import {
  BRACHIAL_ELBOW_ANIMATION,
  CLINCH_KNEE_ANIMATION,
  ELBOW_KNEE_ANIMATIONS,
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  FEMORAL_KNEE_ANIMATION,
  FLYING_KNEE_ANIMATION,
  KIDNEY_KNEE_ANIMATION,
  KNEE_KICK_ANIMATION,
  KNEE_STRIKE_ANIMATION,
  SPINAL_ELBOW_ANIMATION,
  SPINNING_BACK_ELBOW_ANIMATION,
  SPINNING_ELBOW_ANIMATION,
  TEMPLE_ELBOW_ANIMATION,
} from "../catalogs/ElbowKneeAnimations";
import {
  ARM_BAR_ANIMATION,
  BLOCK_ANIMATION,
  BODY_LOCK_THROW_ANIMATION,
  CAROTID_CHOKE_ANIMATION,
  COUNTER_ATTACK_ANIMATION,
  COUNTER_STRIKE_ANIMATION,
  EARTH_EMBRACE_ANIMATION,
  ELBOW_LOCK_ANIMATION,
  FINGER_LOCK_ANIMATION,
  FLOWING_ARM_BAR_ANIMATION,
  GRAPPLE_ANIMATION,
  GRAPPLING_ANIMATIONS,
  HIGH_BLOCK_ANIMATION,
  HIP_THROW_ANIMATION,
  JOINT_LOCK_DEFENSE_ANIMATION,
  LEG_REAP_ANIMATION,
  LOW_BLOCK_ANIMATION,
  MOUNTAIN_LOCK_ANIMATION,
  PARRY_COUNTER_ANIMATION,
  REAR_NAKED_CHOKE_ANIMATION,
  REDIRECT_THROW_ANIMATION,
  SHOULDER_LOCK_ANIMATION,
  SHOULDER_MANIPULATION_ANIMATION,
  SLAM_ANIMATION,
  SMALL_CIRCLE_LOCK_ANIMATION,
  SUPLEX_ANIMATION,
  SWEEP_DEFENSE_ANIMATION,
  TAKEDOWN_ANIMATION,
  THROW_ANIMATION,
  WRIST_LOCK_ANIMATION,
} from "../catalogs/GrapplingAnimations";
import {
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  CRESCENT_KICK_ANIMATION,
  FLYING_KICK_ANIMATION,
  FRONT_KICK_ANIMATION,
  JUMPING_KICK_ANIMATION,
  KICK_ANIMATIONS,
  LOW_KICK_ANIMATION,
  PUSH_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  SPINNING_HEEL_KICK_ANIMATION,
  SPINNING_HOOK_KICK_ANIMATION,
  SWEEP_ANIMATION,
  TORNADO_KICK_ANIMATION,
} from "../catalogs/KickAnimations";
import { MOVEMENT_ANIMATIONS } from "../catalogs/MovementAnimations";
import {
  BACKFIST_ANIMATION,
  CROSS_ANIMATION,
  HAMMER_FIST_ANIMATION,
  HOOK_ANIMATION,
  JAB_ANIMATION,
  OVERHAND_ANIMATION,
  PALM_STRIKE_ANIMATION,
  PUNCH_ANIMATIONS,
  UPPERCUT_ANIMATION,
} from "../catalogs/PunchAnimations";

import { STANCE_ANIMATIONS } from "../catalogs/StanceAnimations";
import { ALL_ATTACK_ANIMATIONS } from "../catalogs/StanceAttackAnimations";
import { TRIGRAM_IDLE_ANIMATIONS_BY_NAME } from "../catalogs/StanceIdleAnimations";
import { STANCE_LOCOMOTION_ANIMATIONS } from "../catalogs/StanceLocomotionAnimations";

// Trigram-specific stance and technique animation maps
import { GAM_STANCE_ANIMATIONS } from "../catalogs/GamStanceAnimations";
import {
  GAM_TECHNIQUE_ANIMATIONS,
  GAM_WATER_FLOW_COUNTER_ANIMATION,
} from "../catalogs/GamTechniqueAnimations";
import { GAN_ROCK_DEFENSE_ANIMATION } from "../catalogs/GanTechniqueAnimations";
import { GAN_STANCE_ANIMATIONS } from "../catalogs/GanStanceAnimations";
import { GAN_TECHNIQUE_ANIMATIONS } from "../catalogs/GanTechniqueAnimations";
import { GEON_ANIMATIONS } from "../catalogs/GeonStanceAnimations";
import { GON_TECHNIQUE_ANIMATIONS } from "../catalogs/GonTechniqueAnimations";
import { JIN_ANIMATIONS } from "../catalogs/JinStanceAnimations";
import { JIN_TECHNIQUE_ANIMATIONS } from "../catalogs/JinTechniqueAnimations";
import { LI_STANCE_ANIMATIONS } from "../catalogs/LiStanceAnimations";
import { SON_STANCE_ANIMATIONS } from "../catalogs/SonStanceAnimations";
import { SON_TECHNIQUE_ANIMATIONS } from "../catalogs/SonTechniqueAnimations";
import { TAE_STANCE_ANIMATIONS } from "../catalogs/TaeStanceAnimations";
import {
  getAnimationForTechniqueOrDefault,
  getAnimationForTechnique as getTechniqueAnimationConfig,
  hasAnimationMapping,
  type AnimationConfig,
} from "./TechniqueAnimationMapping";

// Enhanced animations with recovery phases (복귀 애니메이션 강화)
import {
  CROSS_ANIMATION_ENHANCED,
  FRONT_KICK_ANIMATION_ENHANCED,
  JAB_ANIMATION_ENHANCED,
  ROUNDHOUSE_KICK_ANIMATION_ENHANCED,
} from "../catalogs/EnhancedAttackAnimations";
import {
  ELBOW_STRIKE_ANIMATION_ENHANCED,
  ELBOW_UPPERCUT_ANIMATION_ENHANCED,
  KNEE_STRIKE_ANIMATION_ENHANCED,
} from "../catalogs/EnhancedElbowKneeAnimations";

import {
  TAE_ARM_BAR,
  TAE_ELBOW_CONTROL,
  TAE_FINGER_LOCK,
  TAE_FLOWING_COUNTER,
  TAE_FLOWING_STRIKES,
  TAE_SHOULDER_LOCK,
  TAE_SMALL_CIRCLE,
  TAE_WRIST_LOCK_SEQUENCE,
} from "../catalogs/TaeJointLockAnimations";

// TODO: Register Tae stance animations when trigram-specific idle/movement system is implemented
// import {
//   TAE_IDLE_FLOWING,
//   TAE_CIRCULAR_SIDESTEP,
//   TAE_DIAGONAL_CIRCULAR_APPROACH,
//   TAE_FLEXIBLE_GUARD_TRANSITION,
// } from "../catalogs/TaeStanceAnimations";

import {
  GAM_FLOWING_BLOCK,
  GAM_FLOWING_RIVER_STRIKE,
  GAM_REDIRECTION_COUNTER,
  GAM_TIDAL_WAVE_PALM,
  GAM_WHIRLPOOL_COUNTER,
} from "../catalogs/GamRedirectionAnimations";

// Specialized punch variant animations (특수 주먹 변형 애니메이션)
import {
  EAR_STRIKE_ANIMATION,
  EYE_GOUGE_ANIMATION,
  FLOWING_CROSS_ANIMATION,
  FLOWING_PUSH_ANIMATION,
  HEAVEN_STRIKE_ANIMATION,
  LIGHTNING_STRIKE_ANIMATION,
  LIVER_DISRUPTION_ANIMATION,
  NERVE_PARALYSIS_ANIMATION,
  NERVE_STRIKE_ANIMATION,
  PRESSURE_POINT_STRIKE_ANIMATION,
  RAPID_BARRAGE_ANIMATION,
  RHYTHMIC_STRIKES_ANIMATION,
  SOLAR_PLEXUS_STRIKE_ANIMATION,
  SPEAR_HAND_STRIKE_ANIMATION as SPEAR_HAND_ANIMATION,
  SPECIALIZED_PUNCH_ANIMATIONS,
  THROAT_STRIKE_ANIMATION,
} from "../catalogs/SpecializedPunchAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// MASTER ANIMATION REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Master registry of all animations by AnimationType
 * 애니메이션 타입별 마스터 레지스트리
 */
export const ANIMATION_REGISTRY: ReadonlyMap<AnimationType, SkeletalAnimation> =
  new Map([
    // Kicks (발차기) - Using enhanced versions with recovery phases
    [AnimationType.FRONT_KICK, FRONT_KICK_ANIMATION_ENHANCED],
    [AnimationType.ROUNDHOUSE_KICK, ROUNDHOUSE_KICK_ANIMATION_ENHANCED],
    [AnimationType.SIDE_KICK, SIDE_KICK_ANIMATION],
    [AnimationType.AXE_KICK, AXE_KICK_ANIMATION],
    [AnimationType.BACK_KICK, BACK_KICK_ANIMATION],
    [AnimationType.TORNADO_KICK, TORNADO_KICK_ANIMATION],
    [AnimationType.JUMPING_KICK, JUMPING_KICK_ANIMATION],
    [AnimationType.LOW_KICK, LOW_KICK_ANIMATION],
    [AnimationType.CRESCENT_KICK, CRESCENT_KICK_ANIMATION],
    [AnimationType.PUSH_KICK, PUSH_KICK_ANIMATION],
    [AnimationType.SPINNING_HEEL_KICK, SPINNING_HEEL_KICK_ANIMATION],
    [AnimationType.SPINNING_HOOK, SPINNING_HOOK_KICK_ANIMATION],
    [AnimationType.FLYING_KICK, FLYING_KICK_ANIMATION],

    // Punches (주먹) - Using enhanced versions with recovery phases
    [AnimationType.JAB, JAB_ANIMATION_ENHANCED],
    [AnimationType.CROSS, CROSS_ANIMATION_ENHANCED],
    [AnimationType.HOOK, HOOK_ANIMATION],
    [AnimationType.UPPERCUT, UPPERCUT_ANIMATION],
    [AnimationType.OVERHAND, OVERHAND_ANIMATION],
    [AnimationType.PALM_STRIKE, PALM_STRIKE_ANIMATION],
    [AnimationType.BACKFIST, BACKFIST_ANIMATION],
    [AnimationType.HAMMER_FIST, HAMMER_FIST_ANIMATION],

    // Specialized Punch Variants (특수 주먹 변형)
    [AnimationType.SPEAR_HAND_STRIKE, SPEAR_HAND_ANIMATION],
    [AnimationType.NERVE_STRIKE, NERVE_STRIKE_ANIMATION],
    [AnimationType.PRESSURE_POINT_STRIKE, PRESSURE_POINT_STRIKE_ANIMATION],
    [AnimationType.LIGHTNING_STRIKE, LIGHTNING_STRIKE_ANIMATION],
    [AnimationType.HEAVEN_STRIKE, HEAVEN_STRIKE_ANIMATION],
    [AnimationType.FLOWING_CROSS, FLOWING_CROSS_ANIMATION],
    [AnimationType.RAPID_BARRAGE, RAPID_BARRAGE_ANIMATION],
    [AnimationType.RHYTHMIC_STRIKES, RHYTHMIC_STRIKES_ANIMATION],
    [AnimationType.FLOWING_PUSH, FLOWING_PUSH_ANIMATION],
    [AnimationType.SOLAR_PLEXUS_STRIKE, SOLAR_PLEXUS_STRIKE_ANIMATION],
    [AnimationType.THROAT_STRIKE, THROAT_STRIKE_ANIMATION],
    [AnimationType.EYE_GOUGE, EYE_GOUGE_ANIMATION],
    [AnimationType.NERVE_PARALYSIS, NERVE_PARALYSIS_ANIMATION],
    [AnimationType.LIVER_DISRUPTION, LIVER_DISRUPTION_ANIMATION],
    [AnimationType.EAR_STRIKE, EAR_STRIKE_ANIMATION],

    // ═══ TRIGRAM SPECIFIC ALIASES (괘별 기술 매핑) ═══
    // Geon (건)
    [AnimationType.GEON_HEAVEN_STRIKE, HEAVEN_STRIKE_ANIMATION],
    [AnimationType.GEON_ROUNDHOUSE, ROUNDHOUSE_KICK_ANIMATION_ENHANCED],
    [AnimationType.CRUSHING_ELBOW, ELBOW_STRIKE_ANIMATION_ENHANCED],
    [AnimationType.GEON_COUNTER, GEON_COUNTER_STRIKE],
    [AnimationType.HIGH_BLOCK, GEON_HIGH_BLOCK],

    // Li (리)
    [AnimationType.PHOENIX_EYE_STRIKE, NERVE_STRIKE_ANIMATION],
    [AnimationType.NERVE_STRIKE_COUNTER, LI_NERVE_STRIKE_COUNTER],
    [AnimationType.PRECISION_PARRY, LI_PRECISION_PARRY],
    [AnimationType.LI_SOLAR_PLEXUS, SOLAR_PLEXUS_STRIKE_ANIMATION],
    [AnimationType.SOLAR_PLEXUS_SPEAR, SPEAR_HAND_ANIMATION],

    // Tae (태) - Lake: Joint Manipulation
    [AnimationType.WRIST_LOCK_STRIKE, WRIST_LOCK_ANIMATION],
    [AnimationType.WRIST_LOCK, TAE_WRIST_LOCK_SEQUENCE], // Enhanced Hapkido wrist lock
    [AnimationType.SPIRAL_SHOULDER_THROW, HIP_THROW_ANIMATION],
    [AnimationType.JOINT_LOCK_DEFENSE, TAE_FLOWING_COUNTER],
    [AnimationType.SWEEP_DEFENSE, TAE_SWEEP_DEFENSE],
    [AnimationType.WRIST_TWIST_COUNTER, TAE_FLOWING_COUNTER],
    [AnimationType.FLOWING_CROSS, TAE_FLOWING_STRIKES], // Continuous palm strikes
    [AnimationType.SMALL_CIRCLE_LOCK, TAE_SMALL_CIRCLE], // Advanced dual joint control
    [AnimationType.FINGER_LOCK, TAE_FINGER_LOCK],
    [AnimationType.ELBOW_LOCK, TAE_ELBOW_CONTROL], // Enhanced two-handed control
    [AnimationType.ELBOW_HYPEREXTEND, TAE_ELBOW_CONTROL],
    [AnimationType.SHOULDER_MANIPULATION, TAE_SHOULDER_LOCK], // Enhanced shoulder lock
    [AnimationType.ARM_BAR, TAE_ARM_BAR], // Most powerful submission
    [AnimationType.FLOWING_ARM_BAR, TAE_ARM_BAR], // Alias for flowing arm bar

    // Jin (진)
    [AnimationType.EXPLOSIVE_KNEE, KNEE_STRIKE_ANIMATION_ENHANCED],
    [AnimationType.LIGHTNING_STRAIGHT, JAB_ANIMATION_ENHANCED],
    [AnimationType.SHOCKING_COUNTER, JIN_SHOCKING_COUNTER],
    [AnimationType.SHOCKING_HAMMER_FIST, HAMMER_FIST_ANIMATION],
    [AnimationType.EXPLOSIVE_BLOCK, JIN_EXPLOSIVE_BLOCK],

    // Son (손)
    [AnimationType.CONTINUOUS_DEFLECTION, SON_CONTINUOUS_DEFLECTION],
    [AnimationType.PRESSURE_COUNTER, SON_PRESSURE_COUNTER],
    [AnimationType.RAPID_FOOTWORK, FLOWING_PUSH_ANIMATION], // Placeholder until dedicated footwork
    [AnimationType.PENETRATING_PALM_RUSH, FLOWING_PUSH_ANIMATION],
    [AnimationType.PRESSURE_POINT_CHAIN, RAPID_BARRAGE_ANIMATION],

    // Gam (감)
    [AnimationType.WATER_COUNTER, GAM_REDIRECTION_COUNTER],
    [AnimationType.CIRCULAR_PARRY, GAM_FLOWING_BLOCK], // Updated to Flowing Block
    [AnimationType.FLOW_DEFENSE, GAM_FLOWING_BLOCK], // Updated to Flowing Block
    [AnimationType.FLOWING_RIVER_STRIKE, GAM_FLOWING_RIVER_STRIKE],
    [AnimationType.REDIRECTION_COUNTER, GAM_REDIRECTION_COUNTER],
    [AnimationType.TIDAL_WAVE_PALM, GAM_TIDAL_WAVE_PALM],
    [AnimationType.WHIRLPOOL_COUNTER, GAM_WHIRLPOOL_COUNTER],

    // Gan (간)
    [AnimationType.ROCK_COUNTER, GAN_COUNTER_FORTRESS],
    [AnimationType.ROCK_DEFENSE, GAN_IMMOVABLE_BLOCK],
    [AnimationType.AVALANCHE_HAMMER, HAMMER_FIST_ANIMATION],
    [AnimationType.COUNTER_FORTRESS, GAN_COUNTER_FORTRESS],
    [AnimationType.FORTRESS_COUNTER_STRIKE, COUNTER_STRIKE_ANIMATION],
    [AnimationType.STONE_WALL_THRUST, PUSH_KICK_ANIMATION],

    // General Grappling
    [AnimationType.TAKEDOWN, TAKEDOWN_ANIMATION],
    [AnimationType.JOINT_LOCK, JOINT_LOCK_DEFENSE_ANIMATION],
    [AnimationType.HIP_WHEEL_THROW, HIP_THROW_ANIMATION],
    [AnimationType.SSIREUM_THROW, BODY_LOCK_THROW_ANIMATION], // Korean wrestling style
    [AnimationType.SACRIFICE_THROW, SUPLEX_ANIMATION], // Close match
    [AnimationType.CLINCH, CLINCH_KNEE_ANIMATION],
    [AnimationType.PARRY, PARRY_COUNTER_ANIMATION],

    // Movement/Basic
    [AnimationType.SIDESTEP, SIDE_STEP_ANIMATION],
    [AnimationType.PIVOT, SIDE_STEP_ANIMATION], // Reusing side step
    [AnimationType.STEP_FORWARD, FORWARD_DASH_ANIMATION],
    [AnimationType.STEP_BACK, BACKWARD_RETREAT_ANIMATION],
    [AnimationType.FORWARD_DASH, FORWARD_DASH_ANIMATION],
    [AnimationType.BACKWARD_RETREAT, BACKWARD_RETREAT_ANIMATION],
    [AnimationType.WALK, FORWARD_DASH_ANIMATION], // Placeholder
    [AnimationType.RECOVERY, IDLE_STANCE_ANIMATION],
    [AnimationType.STANCE, IDLE_STANCE_ANIMATION],
    [AnimationType.IDLE, IDLE_STANCE_ANIMATION],
    [AnimationType.DUCK, IDLE_STANCE_ANIMATION], // Placeholder
    [AnimationType.LEAN, IDLE_STANCE_ANIMATION], // Placeholder

    // Defense Aliases
    [AnimationType.BLOCK, BLOCK_ANIMATION],
    [AnimationType.BLOCK_HIGH, HIGH_BLOCK_ANIMATION],
    [AnimationType.BLOCK_LOW, LOW_BLOCK_ANIMATION],
    [AnimationType.FLOWING_BLOCK, GAM_FLOWING_BLOCK],
    [AnimationType.IRON_BLOCK, GAN_IMMOVABLE_BLOCK],
    [AnimationType.IMMOVABLE_BLOCK, GAN_IMMOVABLE_BLOCK],
    [AnimationType.THUNDEROUS_UPPERCUT, ELBOW_UPPERCUT_ANIMATION],

    // Gon (곤)
    [AnimationType.GROUNDING_DEFENSE, GON_GROUNDING_DEFENSE],
    [AnimationType.TAKEDOWN_COUNTER, GON_TAKEDOWN_COUNTER],
    [AnimationType.EARTHQUAKE_STOMP, AXE_KICK_ANIMATION],
    [AnimationType.GROUND_SWEEP_STRIKE, SWEEP_ANIMATION],
    [AnimationType.ROOTING_TAKEDOWN, TAKEDOWN_ANIMATION],
    [AnimationType.TAKEDOWN_COUNTER, GON_TAKEDOWN_COUNTER],
    [AnimationType.ANKLE_PICK, TAKEDOWN_ANIMATION],
    [AnimationType.BODY_LOCK_SLAM, BODY_LOCK_THROW_ANIMATION],

    // Dark Ops (암살자)
    [AnimationType.TEMPLE_STRIKE, TEMPLE_ELBOW_ANIMATION],
    [AnimationType.BRACHIAL_PLEXUS, BRACHIAL_ELBOW_ANIMATION],
    [AnimationType.ACHILLES_ATTACK, LEG_REAP_ANIMATION],
    [AnimationType.CERVICAL_TWIST, REAR_NAKED_CHOKE_ANIMATION],
    [AnimationType.ELBOW_HYPEREXTEND, ARM_BAR_ANIMATION],
    [AnimationType.FEMORAL_NERVE, FEMORAL_KNEE_ANIMATION],
    [AnimationType.LARYNX_CRUSH, THROAT_STRIKE_ANIMATION],
    [AnimationType.JAW_DISLOCATION, HOOK_ANIMATION],
    [AnimationType.FINGER_BREAK, FINGER_LOCK_ANIMATION],
    [AnimationType.GUILLOTINE_CHOKE, CAROTID_CHOKE_ANIMATION],
    [AnimationType.JUGULAR_STRIKE, THROAT_STRIKE_ANIMATION],
    [AnimationType.KNEECAP_STRIKE, LOW_KICK_ANIMATION],
    [AnimationType.OCCIPITAL_STRIKE, HAMMER_FIST_ANIMATION],
    [AnimationType.SCIATIC_NERVE_STRIKE, KNEE_STRIKE_ANIMATION_ENHANCED],
    [AnimationType.SILENT_TAKEDOWN, REAR_NAKED_CHOKE_ANIMATION],
    [AnimationType.SLEEPER_HOLD, REAR_NAKED_CHOKE_ANIMATION],
    [AnimationType.TRIANGLE_CHOKE, LEG_REAP_ANIMATION], // Uses legs
    [AnimationType.SPLEEN_RUPTURE, KNEE_STRIKE_ANIMATION_ENHANCED],

    // Musa (무사)
    [AnimationType.DRAGON_FIST, HEAVEN_STRIKE_ANIMATION],
    [AnimationType.THUNDER_STRIKE, HEAVEN_STRIKE_ANIMATION],
    [AnimationType.MOUNTAIN_BREAKER, HAMMER_FIST_ANIMATION],
    [AnimationType.IRON_DEFENSE, GEON_HIGH_BLOCK],

    // Amsalja (암살자)
    [AnimationType.DEADLY_PRECISION, NERVE_STRIKE_ANIMATION],
    [AnimationType.SHADOW_NERVE_STRIKE, NERVE_STRIKE_ANIMATION],
    [AnimationType.SHADOW_STRIKE, CROSS_ANIMATION_ENHANCED],
    [AnimationType.SILENT_DEATH, HEAVEN_STRIKE_ANIMATION], // Finisher

    // Hacker (해커)
    [AnimationType.CYBER_OVERDRIVE, RAPID_BARRAGE_ANIMATION],
    [AnimationType.DATA_STRIKE, NERVE_STRIKE_ANIMATION],
    [AnimationType.ELECTRIC_SHOCK, PALM_STRIKE_ANIMATION],
    [AnimationType.SYSTEM_CRASH, HEAVEN_STRIKE_ANIMATION],

    // Jeongbo (정보요원)
    [AnimationType.TACTICAL_STRIKE, JAB_ANIMATION_ENHANCED],
    [AnimationType.INTELLIGENCE_STRIKE, NERVE_STRIKE_ANIMATION],
    [AnimationType.COUNTER_INTELLIGENCE, PARRY_COUNTER_ANIMATION],
    [AnimationType.PSYCHOLOGICAL_WARFARE, IDLE_STANCE_ANIMATION],

    // Jojik (조직폭력배)
    [AnimationType.RUTHLESS_ASSAULT, RAPID_BARRAGE_ANIMATION],
    [AnimationType.STREET_BRAWL, OVERHAND_ANIMATION],
    [AnimationType.IMPROVISED_WEAPON, HAMMER_FIST_ANIMATION],
    [AnimationType.BRUTAL_TAKEDOWN, BODY_LOCK_THROW_ANIMATION],

    // Misc
    [AnimationType.IDLE_STANCE, IDLE_STANCE_ANIMATION],

    // Movement Aliases
    [AnimationType.SIDE_STEP, SIDE_STEP_ANIMATION],

    // [AnimationType.FLOWING_PUSH, FLOWING_PUSH_ANIMATION],
    // [AnimationType.THROAT_STRIKE, THROAT_STRIKE_ANIMATION],
    // [AnimationType.EYE_GOUGE, EYE_GOUGE_ANIMATION],
    // [AnimationType.NERVE_PARALYSIS, NERVE_PARALYSIS_ANIMATION],
    // [AnimationType.LIVER_DISRUPTION, LIVER_DISRUPTION_ANIMATION],
    // [AnimationType.EAR_STRIKE, EAR_STRIKE_ANIMATION],

    // Elbow/Knee (팔꿈치/무릎) - Using enhanced versions with recovery phases
    [AnimationType.ELBOW_STRIKE, ELBOW_STRIKE_ANIMATION_ENHANCED],
    [AnimationType.ELBOW_UPPERCUT, ELBOW_UPPERCUT_ANIMATION_ENHANCED],
    [AnimationType.SPINNING_ELBOW, SPINNING_ELBOW_ANIMATION],
    [AnimationType.KNEE_STRIKE, KNEE_STRIKE_ANIMATION_ENHANCED],
    [AnimationType.FLYING_KNEE, FLYING_KNEE_ANIMATION],
    [AnimationType.KNEE_KICK, KNEE_KICK_ANIMATION],
    [AnimationType.CLINCH_KNEE, CLINCH_KNEE_ANIMATION],
    [AnimationType.TEMPLE_ELBOW, TEMPLE_ELBOW_ANIMATION],
    [AnimationType.SPINNING_BACK_ELBOW, SPINNING_BACK_ELBOW_ANIMATION],
    [AnimationType.SPINAL_ELBOW, SPINAL_ELBOW_ANIMATION],
    [AnimationType.BRACHIAL_ELBOW, BRACHIAL_ELBOW_ANIMATION],
    [AnimationType.KIDNEY_KNEE, KIDNEY_KNEE_ANIMATION],
    [AnimationType.FEMORAL_KNEE, FEMORAL_KNEE_ANIMATION],

    // Grappling (잡기)
    [AnimationType.THROW, THROW_ANIMATION],
    [AnimationType.GRAPPLE, GRAPPLE_ANIMATION],
    [AnimationType.SWEEP, SWEEP_ANIMATION],
    [AnimationType.SLAM, SLAM_ANIMATION],
    [AnimationType.WRIST_LOCK, WRIST_LOCK_ANIMATION],
    [AnimationType.ARM_BAR, ARM_BAR_ANIMATION],
    [AnimationType.SHOULDER_LOCK, SHOULDER_LOCK_ANIMATION],
    [AnimationType.HIP_THROW, HIP_THROW_ANIMATION],
    [AnimationType.LEG_REAP, LEG_REAP_ANIMATION],
    [AnimationType.SMALL_CIRCLE_LOCK, SMALL_CIRCLE_LOCK_ANIMATION],
    [AnimationType.FINGER_LOCK, FINGER_LOCK_ANIMATION],
    [AnimationType.ELBOW_LOCK, ELBOW_LOCK_ANIMATION],
    [AnimationType.SHOULDER_MANIPULATION, SHOULDER_MANIPULATION_ANIMATION],
    [AnimationType.FLOWING_ARM_BAR, FLOWING_ARM_BAR_ANIMATION],
    [AnimationType.MOUNTAIN_LOCK, MOUNTAIN_LOCK_ANIMATION],
    [AnimationType.EARTH_EMBRACE, EARTH_EMBRACE_ANIMATION],
    [AnimationType.CAROTID_CHOKE, CAROTID_CHOKE_ANIMATION],
    [AnimationType.REAR_NAKED_CHOKE, REAR_NAKED_CHOKE_ANIMATION],
    [AnimationType.REDIRECT_THROW, REDIRECT_THROW_ANIMATION],

    // Counters (반격)
    [AnimationType.COUNTER_ATTACK, COUNTER_ATTACK_ANIMATION],
    [AnimationType.COUNTER_STRIKE, COUNTER_STRIKE_ANIMATION],
    [AnimationType.PARRY_COUNTER, PARRY_COUNTER_ANIMATION],

    // Defense (방어)
    [AnimationType.BLOCK, BLOCK_ANIMATION],
    [AnimationType.BLOCK_HIGH, HIGH_BLOCK_ANIMATION],
    [AnimationType.BLOCK_LOW, LOW_BLOCK_ANIMATION],
    [AnimationType.JOINT_LOCK_DEFENSE, JOINT_LOCK_DEFENSE_ANIMATION],
    [AnimationType.SWEEP_DEFENSE, SWEEP_DEFENSE_ANIMATION],
  ]);

/**
 * All animations combined into a single map by name
 * 이름별 전체 애니메이션 맵
 */
export const ALL_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ...KICK_ANIMATIONS,
  ...PUNCH_ANIMATIONS,
  ...SPECIALIZED_PUNCH_ANIMATIONS, // Add specialized punch variants
  ...ELBOW_KNEE_ANIMATIONS,
  ...GRAPPLING_ANIMATIONS,
  ...STANCE_ANIMATIONS,
  ...DARKOPS_ANIMATIONS,
  ...COMBO_ANIMATIONS,
  ...MOVEMENT_ANIMATIONS,
  ...ALL_ATTACK_ANIMATIONS, // Stance-specific attack animations (24 unique)
  ...BASIC_ANIMATIONS, // Idle, Walk, Run, Fall animations
  ...STANCE_LOCOMOTION_ANIMATIONS, // Stance-specific walk/run animations (16 unique)
  // Trigram idle animations with breathing/weight shifts (overrides static stance poses)
  // Must come after STANCE_ANIMATIONS to properly override stance_geon, stance_tae, etc.
  ...TRIGRAM_IDLE_ANIMATIONS_BY_NAME,

  // ═══ Trigram-specific stance and technique animations (팔괘 자세/기술 애니메이션) ═══
  // Each trigram has unique movement patterns and combat techniques
  ...GEON_ANIMATIONS, // ☰ Heaven: Direct force, power strikes
  ...TAE_STANCE_ANIMATIONS, // ☱ Lake: Fluid joint manipulation
  ...LI_STANCE_ANIMATIONS, // ☲ Fire: Precision targeting and spear-hand strikes
  ...JIN_ANIMATIONS, // ☳ Thunder: Explosive power
  ...JIN_TECHNIQUE_ANIMATIONS, // ☳ Thunder techniques
  ...SON_STANCE_ANIMATIONS, // ☴ Wind: Continuous pressure
  ...SON_TECHNIQUE_ANIMATIONS, // ☴ Wind techniques
  ["gam_idle_flowing", GAM_STANCE_ANIMATIONS.idle],
  ["gam_yielding_sidestep", GAM_STANCE_ANIMATIONS.movement.yieldingSidestep],
  ["gam_flowing_retreat_step", GAM_STANCE_ANIMATIONS.movement.flowingRetreat],
  ["gam_water_flow_counter", GAM_STANCE_ANIMATIONS.techniques.waterFlowCounter],
  ["gam_flowing_takedown", GAM_STANCE_ANIMATIONS.techniques.flowingTakedown],
  ["gam_counter", GAM_TECHNIQUE_ANIMATIONS.counter],
  ["gam_takedown", GAM_TECHNIQUE_ANIMATIONS.takedown],
  ...GAN_STANCE_ANIMATIONS, // ☶ Mountain: Defensive mastery
  ...GAN_TECHNIQUE_ANIMATIONS, // ☶ Mountain techniques
  ...GON_TECHNIQUE_ANIMATIONS, // ☷ Earth: Ssireum throws and ground control
  // Additional animations from AttackAnimations not in other maps
  ["idle_stance", IDLE_STANCE_ANIMATION],
  ["forward_dash", FORWARD_DASH_ANIMATION],
  ["backward_retreat", BACKWARD_RETREAT_ANIMATION],
  ["side_step", SIDE_STEP_ANIMATION],
]);

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION ID-BASED REGISTRY (animationId → SkeletalAnimation)
// Direct 1-1 mapping for technique animations using new architecture
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animation ID Registry - Direct mapping from technique animationId to SkeletalAnimation
 *
 * This provides 1-1 mapping between technique IDs and animations, using the new
 * animationId field instead of the legacy AnimationType enum.
 *
 * 기술 ID에서 애니메이션으로의 직접 매핑 (1-1 관계)
 *
 * @see TechniqueAnimationMapping.ts for legacy technique → AnimationType mappings
 * @korean 애니메이션ID레지스트리
 */
export const ANIMATION_ID_REGISTRY: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    // Complete mapping for all 57 techniques using existing animations
    ["amsalja_silent_death", SPEAR_HAND_ANIMATION],
    ["darkops_ear_strike", EAR_STRIKE_ANIMATION],
    ["darkops_eye_gouge", EYE_GOUGE_ANIMATION],
    ["darkops_finger_break", FINGER_LOCK_ANIMATION],
    ["darkops_kidney_strike", KIDNEY_KNEE_ANIMATION],
    ["darkops_larynx_crush", THROAT_STRIKE_ANIMATION],
    ["darkops_sleeper_hold", REAR_NAKED_CHOKE_ANIMATION],
    ["darkops_spinal_strike", SPINAL_ELBOW_ANIMATION],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- animation guaranteed to exist in registry
    ["gam_circular_parry", STANCE_ANIMATIONS.get("gam_circular_parry")!], // Use dedicated circular parry animation
    ["gam_flow_defense", GAM_FLOW_DEFENSE],
    ["gam_flowing_block", GAM_FLOWING_BLOCK],
    ["gam_hip_throw", HIP_THROW_ANIMATION],
    ["gam_redirect_throw", REDIRECT_THROW_ANIMATION],
    ["gam_water_counter", GAM_WATER_FLOW_COUNTER_ANIMATION],
    ["gan_counter_strike", GAN_COUNTER_FORTRESS],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- animation guaranteed to exist in registry
    ["gan_immovable_stance", STANCE_ANIMATIONS.get("gan_immovable_stance")!], // Use dedicated immovable stance animation
    ["gan_iron_block", GAN_IMMOVABLE_BLOCK],
    ["gan_rock_defense", GAN_ROCK_DEFENSE_ANIMATION],
    ["geon_axe_kick", AXE_KICK_ANIMATION],
    ["geon_counter_strike", GEON_COUNTER_STRIKE],
    ["geon_crushing_elbow", ELBOW_STRIKE_ANIMATION_ENHANCED],
    ["geon_elbow_smash", ELBOW_STRIKE_ANIMATION_ENHANCED],
    ["geon_frontal_kick", FRONT_KICK_ANIMATION_ENHANCED],
    ["geon_heaven_strike", HEAVEN_STRIKE_ANIMATION],
    ["geon_heavenly_fist", JAB_ANIMATION_ENHANCED],
    ["geon_high_block", GEON_HIGH_BLOCK],
    ["geon_palm_strike", PALM_STRIKE_ANIMATION],
    ["gon_ankle_pick", SWEEP_ANIMATION],
    ["gon_earth_embrace", EARTH_EMBRACE_ANIMATION],
    ["gon_ground_pound", SLAM_ANIMATION],
    ["gon_leg_sweep", SWEEP_ANIMATION],
    ["gon_ssireum_throw", HIP_THROW_ANIMATION],
    ["hacker_data_strike", PALM_STRIKE_ANIMATION],
    ["hacker_system_crash", HAMMER_FIST_ANIMATION],
    ["jin_back_kick", BACK_KICK_ANIMATION],
    ["jin_explosive_knee", KNEE_STRIKE_ANIMATION_ENHANCED],
    ["jin_flying_sidekick", FLYING_KICK_ANIMATION],
    ["jin_knee_strike", KNEE_STRIKE_ANIMATION_ENHANCED],
    ["jin_tornado_kick", TORNADO_KICK_ANIMATION],
    ["jojik_street_brawl", HOOK_ANIMATION],
    ["li_flame_spear", SPEAR_HAND_ANIMATION],
    ["li_nerve_strike", NERVE_STRIKE_ANIMATION],
    ["li_precision_parry", LI_PRECISION_PARRY],
    ["li_sidekick", SIDE_KICK_ANIMATION],
    ["li_temple_strike", TEMPLE_ELBOW_ANIMATION],
    ["musa_dragon_fist", CROSS_ANIMATION_ENHANCED],
    ["musa_iron_defense", HIGH_BLOCK_ANIMATION],
    ["musa_thunder_strike", UPPERCUT_ANIMATION],
    ["son_flowing_push", FLOWING_PUSH_ANIMATION],
    ["son_rapid_footwork", SIDE_STEP_ANIMATION],
    ["son_sweeping_low_kick", LOW_KICK_ANIMATION],
    ["tae_arm_bar", ARM_BAR_ANIMATION],
    ["tae_elbow_lock", ELBOW_LOCK_ANIMATION],
    ["tae_finger_lock", FINGER_LOCK_ANIMATION],
    ["tae_flowing_strikes", FLOWING_CROSS_ANIMATION],
    ["tae_sweep_defense", SWEEP_DEFENSE_ANIMATION],
    ["tae_wrist_lock", WRIST_LOCK_ANIMATION],
  ]);

/**
 * Category-based default animations for fallback
 *
 * When an animationId is not found, fallback to category default.
 *
 * 카테고리별 기본 애니메이션 (fallback용)
 */
export const CATEGORY_DEFAULT_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["punch", JAB_ANIMATION_ENHANCED],
    ["kick", FRONT_KICK_ANIMATION_ENHANCED],
    ["strike", PALM_STRIKE_ANIMATION],
    ["joint_lock", WRIST_LOCK_ANIMATION],
    ["throw", HIP_THROW_ANIMATION],
    ["defensive", BLOCK_ANIMATION],
    ["elbow_strike", ELBOW_STRIKE_ANIMATION_ENHANCED],
    ["counter", COUNTER_STRIKE_ANIMATION],
    ["jumping_kick", JUMPING_KICK_ANIMATION],
    ["grapple", GRAPPLE_ANIMATION],
    ["sweep", SWEEP_ANIMATION],
    ["knee_strike", KNEE_STRIKE_ANIMATION_ENHANCED],
    ["footwork", SIDE_STEP_ANIMATION],
    ["stance", IDLE_STANCE_ANIMATION],
    ["takedown", SLAM_ANIMATION],
  ]);

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION LOOKUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get animation by AnimationType
 *
 * @param type - Animation type enum value
 * @returns Skeletal animation or undefined
 *
 * @korean 애니메이션타입으로조회
 */
export function getAnimationByType(
  type: AnimationType,
): SkeletalAnimation | undefined {
  return ANIMATION_REGISTRY.get(type);
}

/**
 * Get animation by AnimationType with fallback
 *
 * @param type - Animation type enum value
 * @param fallback - Fallback animation type
 * @returns Skeletal animation (never undefined)
 *
 * @korean 애니메이션타입으로조회_기본값
 */
export function getAnimationByTypeOrDefault(
  type: AnimationType,
  fallback: AnimationType = AnimationType.JAB,
): SkeletalAnimation {
  const animation =
    ANIMATION_REGISTRY.get(type) ?? ANIMATION_REGISTRY.get(fallback);

  if (!animation) {
    throw new Error(`Missing animation for ${type} with fallback ${fallback}`);
  }

  return animation;
}

/**
 * Get animation for a technique by technique ID (using AnimationType mapping)
 *
 * Uses the TechniqueAnimationMapping to find the correct animation
 * for any technique in the game.
 *
 * @param techniqueId - Technique identifier (e.g., "geon_frontal_kick")
 * @returns Skeletal animation or undefined
 *
 * @korean 기술ID로애니메이션조회
 */
export function getAnimationForTechniqueId(
  techniqueId: string,
): SkeletalAnimation | undefined {
  const config = getTechniqueAnimationConfig(techniqueId);
  if (!config) return undefined;
  return ANIMATION_REGISTRY.get(config.type);
}

/**
 * Get animation for a technique with fallback
 *
 * @param techniqueId - Technique identifier
 * @param fallbackType - Fallback animation type
 * @returns Animation with speed modifier
 *
 * @korean 기술ID로애니메이션조회_기본값
 */
export function getAnimationForTechniqueIdWithConfig(
  techniqueId: string,
  fallbackType: AnimationType = AnimationType.JAB,
): { animation: SkeletalAnimation; speed: number } {
  const config = getAnimationForTechniqueOrDefault(techniqueId, fallbackType);
  const animation =
    ANIMATION_REGISTRY.get(config.type) ?? ANIMATION_REGISTRY.get(fallbackType);

  if (!animation) {
    throw new Error(
      `Missing animation for ${config.type} with fallback ${fallbackType}`,
    );
  }
  return { animation, speed: config.speed };
}

// ═══════════════════════════════════════════════════════════════════════════
// NEW ARCHITECTURE: ID-Based Animation Lookup Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get animation by animationId (new architecture)
 *
 * Direct 1-1 lookup using the new animationId field from technique.
 * This is the preferred method for the new animation architecture.
 *
 * @param animationId - Technique's animationId (e.g., "geon_heaven_strike")
 * @returns SkeletalAnimation or undefined if not found
 *
 * @korean 애니메이션ID로조회
 */
export function getAnimationById(
  animationId: string,
): SkeletalAnimation | undefined {
  return ANIMATION_ID_REGISTRY.get(animationId);
}

/**
 * Get animation by ID with category-based fallback
 *
 * Implements a 3-tier fallback system:
 * 1. Try direct ID lookup in ANIMATION_ID_REGISTRY
 * 2. If not found, use category default from CATEGORY_DEFAULT_ANIMATIONS
 * 3. If no category, use IDLE_STANCE as ultimate fallback
 *
 * This function never returns undefined, making it safe for use in game logic.
 *
 * @param animationId - Technique's animationId
 * @param animationCategory - Technique's animationCategory for fallback
 * @returns SkeletalAnimation (never undefined)
 *
 * @korean 애니메이션ID로조회_카테고리대체
 */
export function getAnimationByIdWithFallback(
  animationId: string | undefined,
  animationCategory?: string,
): SkeletalAnimation {
  // Try direct ID lookup
  if (animationId) {
    const animation = ANIMATION_ID_REGISTRY.get(animationId);
    if (animation) return animation;
  }

  // Fallback to category default
  if (animationCategory) {
    const categoryDefault = CATEGORY_DEFAULT_ANIMATIONS.get(animationCategory);
    if (categoryDefault) return categoryDefault;
  }

  // Ultimate fallback
  return IDLE_STANCE_ANIMATION;
}

/**
 * Check if animation ID exists in registry
 *
 * @param animationId - Animation ID to check
 * @returns true if animation exists in ANIMATION_ID_REGISTRY
 *
 * @korean 애니메이션ID존재확인
 */
export function hasAnimationId(animationId: string): boolean {
  return ANIMATION_ID_REGISTRY.has(animationId);
}

/**
 * Get category default animation
 *
 * Returns the default animation for a given category, useful for fallback logic.
 *
 * @param category - Animation category (e.g., "punch", "kick")
 * @returns SkeletalAnimation or undefined if category not found
 *
 * @korean 카테고리기본애니메이션조회
 */
export function getCategoryDefaultAnimation(
  category: string,
): SkeletalAnimation | undefined {
  return CATEGORY_DEFAULT_ANIMATIONS.get(category);
}

/**
 * Get animation by name (legacy support)
 *
 * @param name - Animation name (e.g., "front_kick")
 * @returns Skeletal animation or undefined
 *
 * @korean 이름으로애니메이션조회
 */
export function getAnimationByName(
  name: string,
): SkeletalAnimation | undefined {
  return ALL_ANIMATIONS.get(name) ?? ANIMATION_ID_REGISTRY.get(name);
}

/**
 * Get animation by name - unified lookup across all animation registries
 *
 * Searches ALL_ANIMATIONS which includes:
 * - BASIC_ANIMATIONS (idle, walk, run, fall)
 * - KICK_ANIMATIONS, PUNCH_ANIMATIONS, etc.
 * - STANCE_ANIMATIONS, MOVEMENT_ANIMATIONS
 * - ALL_ATTACK_ANIMATIONS (stance-specific attacks)
 *
 * @param name - Animation name (e.g., "idle", "front_kick", "walk")
 * @returns Skeletal animation or undefined
 *
 * @korean 애니메이션가져오기
 */
export function getAnimation(name: string): SkeletalAnimation | undefined {
  return ALL_ANIMATIONS.get(name) ?? ANIMATION_ID_REGISTRY.get(name);
}

// ═══════════════════════════════════════════════════════════════════════════
// TECHNIQUE TO ANIMATION LOOKUP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Regex fallback patterns for technique-to-animation mapping
 * Used when technique ID is not found in ALL_ANIMATIONS
 *
 * NOTE: Order matters - more specific patterns must come first
 *
 * @korean 기술애니메이션폴백매핑
 */
const TECHNIQUE_ANIMATION_FALLBACK: ReadonlyArray<readonly [RegExp, string]> = [
  // ───────────────────────────────────────────────────────────────────────
  // Stance-specific distinctive strikes - MUST be checked before the generic
  // /strike/ rule so that "Thunder Strike", "Heaven Strike", "Nerve Strike",
  // "Precision Strike", etc. don't collapse to the generic "jab" fallback.
  // ───────────────────────────────────────────────────────────────────────
  [/heaven.?strike|천둥벽력|하늘치기/i, "heaven_strike"],
  [/lightning.?(strike|flash)|번개|뇌격/i, "lightning_strike"],
  [/nerve.?strike|신경.?타격|신경치기/i, "nerve_strike"],
  [/pressure.?point|혈도|급소/i, "pressure_point_strike"],
  [/solar.?plexus|명치|태양신경총/i, "solar_plexus_strike"],
  [/throat.?strike|후두타격|목치기/i, "throat_strike"],
  [/temple.?(strike|elbow)|관자놀이/i, "temple_strike"],
  [/eye.?gouge|눈찌르기/i, "eye_gouge"],
  [/ear.?strike|귀치기/i, "ear_strike"],
  [/liver.?(disruption|strike)|간장|간치기/i, "liver_disruption"],
  [/kidney.?(strike|punch)|신장치기/i, "kidney_strike"],
  [/spear.?hand|관수|손끝찌르기/i, "spear_hand_strike"],
  [/flowing.?cross|flowing.?strike|유수타격/i, "flowing_cross"],
  [/flowing.?push|flowing.?palm/i, "flowing_push"],
  [/rapid.?barrage|연환타/i, "rapid_barrage"],
  [/rhythmic.?strike|리듬타격/i, "rhythmic_strikes"],
  // Heavenly/dragon fist names are stance-specific and should map to the
  // proper Geon/Jin animations, not the generic jab/cross fallbacks.
  // Note: intentionally exclude "정권" (generic straight punch) here — it
  // should continue to resolve to the generic `jab` via the kick/jab
  // section below, not to Geon's heaven_strike.
  [/heavenly.?fist|천권/i, "heaven_strike"],
  [/dragon.?fist|용권/i, "jin_lightning_flash"],

  // Kicks (차기) - more specific patterns first
  [/axe.?kick|내려차기|naeryeo/i, "axe_kick"],
  [/back.?kick|뒤차기|dwi.?chagi/i, "back_kick"],
  [/tornado|회오리|hoe.?ori/i, "tornado_kick"],
  [/jump|뛰어|ttwi|flying/i, "jumping_kick"],
  [/sweep|쓸기|걸기|품밟기|dari.?geolgi/i, "sweep"],
  [/side.?kick|옆차기|yeop.?chagi/i, "side_kick"],
  [/low.?kick|하단차기|낮은차기|thigh.?kick|leg.?kick/i, "low_kick"],
  [/front.?kick|앞차기|snap.?kick|ap.?chagi/i, "front_kick"],
  [/roundhouse|돌려차기|dolryeo/i, "roundhouse_kick"],
  // Knee strikes (무릎)
  [/knee|무릎|mureup/i, "knee_strike"],
  // Elbow strikes (팔꿈치)
  [/elbow|팔꿈치|팔굽|palkkumchi/i, "elbow_strike"],
  // Throws & Slams (던지기/내던지기)
  [/slam|내던지기|smash/i, "slam"],
  [/throw|던지기|deonjigi|ground.?pound/i, "throw"],
  // Grapple/Lock (꺾기/잡기) - specific locks first
  [/arm.?bar|팔꺾기|팔관절기|juji.?gatame/i, "arm_bar"],
  [/wrist.?lock|손목꺾기|손목관절기|kote.?gaeshi/i, "wrist_lock"],
  [/lock|grapple|꺾기|잡기|embrace|kkeokgi|japgi|submission/i, "grapple"],
  // Counter attacks (반격)
  [/counter.?strike|반격타격|카운터스트라이크/i, "counter_strike"],
  [/counter|반격|bangyeok|parry|redirect/i, "counter_attack"],
  // Blocks (막기)
  [/block|막기|makgi|defense|방어/i, "block"],
  // Punches (주먹) - check after specific patterns
  [/hook|후크|횡타|갈고리/i, "hook"],
  [/palm|장권|jang.?gwon/i, "palm_strike"],
  [/cross|십자|교차/i, "cross"],
  [/uppercut|upper|올려|치올/i, "uppercut"],
  [/jab|잽|직권|찌르기|punch|주먹|권/i, "jab"],
  // Generic strikes last - only used when no more specific pattern matched above
  [/strike|타격|격|chigi/i, "jab"],
] as const;

/**
 * Get animation name for a technique
 *
 * PRIORITY ORDER:
 * 1. Direct lookup in ALL_ANIMATIONS by technique ID (stance-specific)
 * 2. Regex pattern matching for generic techniques
 * 3. Fallback to "jab"
 *
 * This ensures stance-specific animations like "geon_heaven_strike"
 * are used when available, while still supporting generic technique names.
 *
 * @param techniqueNameOrId - Technique name, ID, or Korean name
 * @returns Animation name from ALL_ANIMATIONS
 *
 * @example
 * ```typescript
 * getAnimationForTechnique("geon_heaven_strike") // "geon_heaven_strike" (exact match)
 * getAnimationForTechnique("tae_wrist_lock") // "tae_wrist_lock" (exact match)
 * getAnimationForTechnique("roundhouse_kick") // "roundhouse_kick" (regex match)
 * getAnimationForTechnique("앞차기") // "front_kick" (regex match)
 * ```
 *
 * @korean 기술에맞는애니메이션가져오기
 */
export function getAnimationForTechnique(techniqueNameOrId: string): string {
  if (!techniqueNameOrId) return "jab";

  // 1. First check if technique ID exists directly in ALL_ANIMATIONS
  //    This handles stance-specific animations like "geon_heaven_strike"
  if (ALL_ANIMATIONS.has(techniqueNameOrId)) {
    return techniqueNameOrId;
  }

  if (ANIMATION_ID_REGISTRY.has(techniqueNameOrId)) {
    return techniqueNameOrId;
  }

  // 2. Try a normalized form: "Thunder Strike" → "thunder_strike".
  //    This lets us catch techniques whose English name happens to match
  //    an animation key exactly once spaces are collapsed.
  const normalized = techniqueNameOrId
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  if (normalized && ALL_ANIMATIONS.has(normalized)) {
    return normalized;
  }

  if (normalized && ANIMATION_ID_REGISTRY.has(normalized)) {
    return normalized;
  }

  // 3. Try regex pattern matching for generic technique names
  for (const [pattern, animationName] of TECHNIQUE_ANIMATION_FALLBACK) {
    if (pattern.test(techniqueNameOrId)) {
      return animationName;
    }
  }

  // 4. Ultimate fallback to jab
  return "jab";
}

/**
 * Resolve a technique object to its best-matching animation key.
 *
 * This is the single, authoritative entry point for screens and systems
 * that need to know which skeletal animation to play for a given technique.
 *
 * Resolution order (most specific → least):
 *  1. `technique.animationId` if present and registered (KoreanTechnique / TrigramStanceTechnique).
 *  2. `technique.id` if registered (Technique objects from {@link getTechniquesForStanceAndArchetype}
 *     already carry their stance-specific id, e.g. `"geon_heaven_strike"`).
 *  3. Regex-based fallback on `technique.name.english`, then `technique.name.korean`.
 *  4. `"jab"` as ultimate fallback.
 *
 * Passing the technique object (rather than a loose string) avoids the
 * long-standing bug where `technique.name.english` — e.g. `"Thunder Strike"` —
 * would match only the generic `/strike/` rule and collapse every
 * stance-specific attack to the jab animation.
 *
 * @param technique - Technique or technique-like object.
 * @returns Animation key registered in {@link ALL_ANIMATIONS}.
 *
 * @korean 기술객체로애니메이션해결
 */
export function resolveTechniqueAnimation(
  technique:
    | {
        readonly id?: string;
        readonly animationId?: string;
        readonly name?: {
          readonly english?: string;
          readonly korean?: string;
        };
      }
    | null
    | undefined,
): string {
  if (!technique) return "jab";

  // 1. Prefer animationId (authoritative 1-1 mapping on KoreanTechnique).
  if (
    technique.animationId &&
    (ALL_ANIMATIONS.has(technique.animationId) ||
      ANIMATION_ID_REGISTRY.has(technique.animationId))
  ) {
    return technique.animationId;
  }

  // 2. technique.id (Technique objects preserve stance-prefixed ids here).
  if (
    technique.id &&
    (ALL_ANIMATIONS.has(technique.id) || ANIMATION_ID_REGISTRY.has(technique.id))
  ) {
    return technique.id;
  }

  // 3. Regex/normalized fallback on the most specific string we have.
  const english = technique.name?.english;
  if (english) {
    const byEnglish = getAnimationForTechnique(english);
    // Guard: only accept the result if it's not the dumb "jab" default when
    // we still have an id/animationId we can try as a last resort.
    if (byEnglish !== "jab" || !technique.id) {
      return byEnglish;
    }
  }

  // 4. Try id as a string (may go through regex fallback if not registered).
  if (technique.id) {
    return getAnimationForTechnique(technique.id);
  }

  // 5. Korean name as last resort.
  const korean = technique.name?.korean;
  if (korean) {
    return getAnimationForTechnique(korean);
  }

  return "jab";
}

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Re-export all individual animations for direct access
export {
  ARM_BAR_ANIMATION,
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  BLOCK_ANIMATION,
  COUNTER_ATTACK_ANIMATION,
  COUNTER_STRIKE_ANIMATION,
  CROSS_ANIMATION,
  // Elbow/Knee
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  // Kicks
  FRONT_KICK_ANIMATION,
  GRAPPLE_ANIMATION,
  HOOK_ANIMATION,
  // Punches
  JAB_ANIMATION,
  JUMPING_KICK_ANIMATION,
  KNEE_STRIKE_ANIMATION,
  LOW_KICK_ANIMATION,
  PALM_STRIKE_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  SLAM_ANIMATION,
  SWEEP_ANIMATION,
  // Grappling
  THROW_ANIMATION,
  TORNADO_KICK_ANIMATION,
  WRIST_LOCK_ANIMATION,
};

// Re-export category maps
export {
  COMBO_ANIMATIONS,
  DARKOPS_ANIMATIONS,
  ELBOW_KNEE_ANIMATIONS,
  GRAPPLING_ANIMATIONS,
  KICK_ANIMATIONS,
  MOVEMENT_ANIMATIONS,
  PUNCH_ANIMATIONS,
  STANCE_ANIMATIONS,
};

// Re-export animation types and mapping
export { AnimationType } from "../builders/MartialArtsAnimationBuilder";
export { hasAnimationMapping };
export type { AnimationConfig };
