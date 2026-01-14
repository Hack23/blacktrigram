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
  TAE_ELBOW_HYPEREXTENSION,
  TAE_FINGER_LOCK,
  TAE_FLOWING_COUNTER,
  TAE_SMALL_CIRCLE_LOCK,
} from "../catalogs/TaeJointLockAnimations";

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

    // Tae (태)
    [AnimationType.WRIST_LOCK_STRIKE, WRIST_LOCK_ANIMATION],
    [AnimationType.SPIRAL_SHOULDER_THROW, HIP_THROW_ANIMATION],
    [AnimationType.JOINT_LOCK_DEFENSE, TAE_FLOWING_COUNTER], // Updated to specific Tae counter
    [AnimationType.SWEEP_DEFENSE, TAE_SWEEP_DEFENSE],
    [AnimationType.WRIST_TWIST_COUNTER, TAE_FLOWING_COUNTER], // Mapped to Flowing Lock Counter
    [AnimationType.SMALL_CIRCLE_LOCK, TAE_SMALL_CIRCLE_LOCK],
    [AnimationType.FINGER_LOCK, TAE_FINGER_LOCK],
    [AnimationType.ELBOW_LOCK, TAE_ELBOW_HYPEREXTENSION],
    [AnimationType.ELBOW_HYPEREXTEND, TAE_ELBOW_HYPEREXTENSION],
    [AnimationType.SHOULDER_MANIPULATION, SHOULDER_MANIPULATION_ANIMATION],
    [AnimationType.FLOWING_ARM_BAR, FLOWING_ARM_BAR_ANIMATION],

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
  // Additional animations from AttackAnimations not in other maps
  ["idle_stance", IDLE_STANCE_ANIMATION],
  ["forward_dash", FORWARD_DASH_ANIMATION],
  ["backward_retreat", BACKWARD_RETREAT_ANIMATION],
  ["side_step", SIDE_STEP_ANIMATION],
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
  type: AnimationType
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
  fallback: AnimationType = AnimationType.JAB
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
  techniqueId: string
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
  fallbackType: AnimationType = AnimationType.JAB
): { animation: SkeletalAnimation; speed: number } {
  const config = getAnimationForTechniqueOrDefault(techniqueId, fallbackType);
  const animation =
    ANIMATION_REGISTRY.get(config.type) ?? ANIMATION_REGISTRY.get(fallbackType);

  if (!animation) {
    throw new Error(
      `Missing animation for ${config.type} with fallback ${fallbackType}`
    );
  }
  return { animation, speed: config.speed };
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
  name: string
): SkeletalAnimation | undefined {
  return ALL_ANIMATIONS.get(name);
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
  return ALL_ANIMATIONS.get(name);
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
  // Generic strikes last
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
  // 1. First check if technique ID exists directly in ALL_ANIMATIONS
  //    This handles stance-specific animations like "geon_heaven_strike"
  if (ALL_ANIMATIONS.has(techniqueNameOrId)) {
    return techniqueNameOrId;
  }

  // 2. Try regex pattern matching for generic technique names
  for (const [pattern, animationName] of TECHNIQUE_ANIMATION_FALLBACK) {
    if (pattern.test(techniqueNameOrId)) {
      return animationName;
    }
  }

  // 3. Ultimate fallback to jab
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
