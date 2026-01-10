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
import { AnimationType } from "./MartialArtsAnimationBuilder";
import {
  KICK_ANIMATIONS,
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  TORNADO_KICK_ANIMATION,
  JUMPING_KICK_ANIMATION,
  SWEEP_ANIMATION,
} from "./KickAnimations";
import {
  PUNCH_ANIMATIONS,
  JAB_ANIMATION,
  CROSS_ANIMATION,
  PALM_STRIKE_ANIMATION,
} from "./PunchAnimations";
import {
  ELBOW_KNEE_ANIMATIONS,
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  KNEE_STRIKE_ANIMATION,
} from "./ElbowKneeAnimations";
import {
  GRAPPLING_ANIMATIONS,
  THROW_ANIMATION,
  GRAPPLE_ANIMATION,
  COUNTER_ATTACK_ANIMATION,
  BLOCK_ANIMATION,
} from "./GrapplingAnimations";
import {
  getAnimationForTechniqueOrDefault,
  getAnimationForTechnique,
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

    // Punches (주먹)
    [AnimationType.JAB, JAB_ANIMATION],
    [AnimationType.CROSS, CROSS_ANIMATION],
    [AnimationType.PALM_STRIKE, PALM_STRIKE_ANIMATION],

    // Elbow/Knee (팔꿈치/무릎)
    [AnimationType.ELBOW_STRIKE, ELBOW_STRIKE_ANIMATION],
    [AnimationType.ELBOW_UPPERCUT, ELBOW_UPPERCUT_ANIMATION],
    [AnimationType.KNEE_STRIKE, KNEE_STRIKE_ANIMATION],

    // Grappling (잡기)
    [AnimationType.THROW, THROW_ANIMATION],
    [AnimationType.GRAPPLE, GRAPPLE_ANIMATION],
    [AnimationType.SWEEP, SWEEP_ANIMATION],
    [AnimationType.COUNTER_ATTACK, COUNTER_ATTACK_ANIMATION],

    // Defense (방어)
    [AnimationType.BLOCK, BLOCK_ANIMATION],
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
 * Get animation for a technique by technique ID
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
  const config = getAnimationForTechnique(techniqueId);
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

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Re-export all individual animations for direct access
export {
  // Kicks
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  TORNADO_KICK_ANIMATION,
  JUMPING_KICK_ANIMATION,
  SWEEP_ANIMATION,
  // Punches
  JAB_ANIMATION,
  CROSS_ANIMATION,
  PALM_STRIKE_ANIMATION,
  // Elbow/Knee
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  KNEE_STRIKE_ANIMATION,
  // Grappling
  THROW_ANIMATION,
  GRAPPLE_ANIMATION,
  COUNTER_ATTACK_ANIMATION,
  BLOCK_ANIMATION,
};

// Re-export category maps
export {
  KICK_ANIMATIONS,
  PUNCH_ANIMATIONS,
  ELBOW_KNEE_ANIMATIONS,
  GRAPPLING_ANIMATIONS,
};

// Re-export animation types and mapping
export { AnimationType } from "./MartialArtsAnimationBuilder";
export { getAnimationForTechnique, hasAnimationMapping };
export type { AnimationConfig };
