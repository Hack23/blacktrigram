/**
 * Animation Registry
 *
 * Central registry for all martial arts animations.
 * Combines all animation modules and provides unified access.
 *
 * 무술 애니메이션 레지스트리 - 모든 애니메이션 통합 관리
 *
 * @module systems/animation/AnimationRegistry
 * @korean 애니메이션레지스트리
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import {
  BACKWARD_RETREAT_ANIMATION,
  FORWARD_DASH_ANIMATION,
  IDLE_STANCE_ANIMATION,
  SIDE_STEP_ANIMATION,
} from "./AttackAnimations";
import { BASIC_ANIMATIONS } from "./BasicAnimations";
import { COMBO_ANIMATIONS } from "./ComboAnimations";
import { DARKOPS_ANIMATIONS } from "./DarkOpsAnimations";
import {
  ELBOW_KNEE_ANIMATIONS,
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  FLYING_KNEE_ANIMATION,
  KNEE_STRIKE_ANIMATION,
  SPINNING_ELBOW_ANIMATION,
} from "./ElbowKneeAnimations";
import {
  ARM_BAR_ANIMATION,
  BLOCK_ANIMATION,
  COUNTER_ATTACK_ANIMATION,
  COUNTER_STRIKE_ANIMATION,
  GRAPPLE_ANIMATION,
  GRAPPLING_ANIMATIONS,
  HIGH_BLOCK_ANIMATION,
  HIP_THROW_ANIMATION,
  LEG_REAP_ANIMATION,
  LOW_BLOCK_ANIMATION,
  PARRY_COUNTER_ANIMATION,
  SHOULDER_LOCK_ANIMATION,
  SLAM_ANIMATION,
  THROW_ANIMATION,
  WRIST_LOCK_ANIMATION,
} from "./GrapplingAnimations";
import {
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  CRESCENT_KICK_ANIMATION,
  FRONT_KICK_ANIMATION,
  JUMPING_KICK_ANIMATION,
  KICK_ANIMATIONS,
  LOW_KICK_ANIMATION,
  PUSH_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  SPINNING_HEEL_KICK_ANIMATION,
  SWEEP_ANIMATION,
  TORNADO_KICK_ANIMATION,
} from "./KickAnimations";
import { AnimationType } from "./MartialArtsAnimationBuilder";
import { MOVEMENT_ANIMATIONS } from "./MovementAnimations";
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
} from "./PunchAnimations";
import { STANCE_ANIMATIONS } from "./StanceAnimations";
import { ALL_ATTACK_ANIMATIONS } from "./StanceAttackAnimations";
import { STANCE_LOCOMOTION_ANIMATIONS } from "./StanceLocomotionAnimations";
import {
  getAnimationForTechniqueOrDefault,
  getAnimationForTechnique as getTechniqueAnimationConfig,
  hasAnimationMapping,
  type AnimationConfig,
} from "./TechniqueAnimationMapping";

// ═══════════════════════════════════════════════════════════════════════════
// MASTER ANIMATION REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Master registry of all animations by AnimationType
 * 애니메이션 타입별 마스터 레지스트리
 */
export const ANIMATION_REGISTRY: ReadonlyMap<AnimationType, SkeletalAnimation> =
  new Map([
    // Kicks (발차기)
    [AnimationType.FRONT_KICK, FRONT_KICK_ANIMATION],
    [AnimationType.ROUNDHOUSE_KICK, ROUNDHOUSE_KICK_ANIMATION],
    [AnimationType.SIDE_KICK, SIDE_KICK_ANIMATION],
    [AnimationType.AXE_KICK, AXE_KICK_ANIMATION],
    [AnimationType.BACK_KICK, BACK_KICK_ANIMATION],
    [AnimationType.TORNADO_KICK, TORNADO_KICK_ANIMATION],
    [AnimationType.JUMPING_KICK, JUMPING_KICK_ANIMATION],
    [AnimationType.LOW_KICK, LOW_KICK_ANIMATION],
    [AnimationType.CRESCENT_KICK, CRESCENT_KICK_ANIMATION],
    [AnimationType.PUSH_KICK, PUSH_KICK_ANIMATION],
    [AnimationType.SPINNING_HEEL_KICK, SPINNING_HEEL_KICK_ANIMATION],

    // Punches (주먹)
    [AnimationType.JAB, JAB_ANIMATION],
    [AnimationType.CROSS, CROSS_ANIMATION],
    [AnimationType.HOOK, HOOK_ANIMATION],
    [AnimationType.UPPERCUT, UPPERCUT_ANIMATION],
    [AnimationType.OVERHAND, OVERHAND_ANIMATION],
    [AnimationType.PALM_STRIKE, PALM_STRIKE_ANIMATION],
    [AnimationType.BACKFIST, BACKFIST_ANIMATION],
    [AnimationType.HAMMER_FIST, HAMMER_FIST_ANIMATION],

    // Elbow/Knee (팔꿈치/무릎)
    [AnimationType.ELBOW_STRIKE, ELBOW_STRIKE_ANIMATION],
    [AnimationType.ELBOW_UPPERCUT, ELBOW_UPPERCUT_ANIMATION],
    [AnimationType.SPINNING_ELBOW, SPINNING_ELBOW_ANIMATION],
    [AnimationType.KNEE_STRIKE, KNEE_STRIKE_ANIMATION],
    [AnimationType.FLYING_KNEE, FLYING_KNEE_ANIMATION],

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

    // Counters (반격)
    [AnimationType.COUNTER_ATTACK, COUNTER_ATTACK_ANIMATION],
    [AnimationType.COUNTER_STRIKE, COUNTER_STRIKE_ANIMATION],
    [AnimationType.PARRY_COUNTER, PARRY_COUNTER_ANIMATION],

    // Defense (방어)
    [AnimationType.BLOCK, BLOCK_ANIMATION],
    [AnimationType.BLOCK_HIGH, HIGH_BLOCK_ANIMATION],
    [AnimationType.BLOCK_LOW, LOW_BLOCK_ANIMATION],
  ]);

/**
 * All animations combined into a single map by name
 * 이름별 전체 애니메이션 맵
 */
export const ALL_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ...KICK_ANIMATIONS,
  ...PUNCH_ANIMATIONS,
  ...ELBOW_KNEE_ANIMATIONS,
  ...GRAPPLING_ANIMATIONS,
  ...STANCE_ANIMATIONS,
  ...DARKOPS_ANIMATIONS,
  ...COMBO_ANIMATIONS,
  ...MOVEMENT_ANIMATIONS,
  ...ALL_ATTACK_ANIMATIONS, // Stance-specific attack animations (24 unique)
  ...BASIC_ANIMATIONS, // Idle, Walk, Run, Fall animations
  ...STANCE_LOCOMOTION_ANIMATIONS, // Stance-specific walk/run animations (16 unique)
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
  return ANIMATION_REGISTRY.get(type) ?? ANIMATION_REGISTRY.get(fallback)!;
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
    ANIMATION_REGISTRY.get(config.type) ??
    ANIMATION_REGISTRY.get(fallbackType)!;
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
export { AnimationType } from "./MartialArtsAnimationBuilder";
export { hasAnimationMapping };
export type { AnimationConfig };
