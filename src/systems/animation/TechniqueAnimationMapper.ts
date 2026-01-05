/**
 * Technique Animation Mapper
 * 
 * Maps 70 Korean techniques to appropriate attack animation types.
 * Implements the technique-to-animation link system for authentic martial arts animations.
 * 
 * @module systems/animation/TechniqueAnimationMapper
 * @category Animation System
 * @korean 기술애니메이션매퍼
 */

import { AttackAnimationType } from "../../types/skeletal";
import { ATTACK_ANIMATIONS } from "./AttackAnimations";

/**
 * Maps AttackAnimationType to existing skeletal animation names
 * 
 * Links the new enum-based system to existing animation implementation.
 * New animations will be added to AttackAnimations.ts as needed.
 * 
 * @korean 애니메이션타입맵
 */
const ANIMATION_TYPE_TO_NAME_MAP: Record<AttackAnimationType, string> = {
  // Punch category (주먹 타격) - use existing animations
  [AttackAnimationType.PUNCH_HIGH]: "jab", // High punch to head
  [AttackAnimationType.PUNCH_MID]: "cross", // Mid-level cross punch
  [AttackAnimationType.PUNCH_LOW]: "jab", // Low punch to body (reuse jab for now)

  // Kick category (발차기) - use dedicated animations
  [AttackAnimationType.KICK_FRONT]: "front_kick", // Front kick (앞차기)
  [AttackAnimationType.KICK_SIDE]: "side_kick", // Side kick (옆차기) - NEW dedicated animation
  [AttackAnimationType.KICK_ROUNDHOUSE]: "roundhouse_kick", // Roundhouse kick (돌려차기)

  // Elbow category (팔꿈치 타격) - use dedicated elbow animations
  [AttackAnimationType.ELBOW_STRIKE]: "elbow_strike",
  [AttackAnimationType.ELBOW_UPPERCUT]: "elbow_uppercut", // NEW dedicated uppercut animation

  // Knee category (무릎 타격) - use dedicated knee animation
  [AttackAnimationType.KNEE_STRIKE]: "knee_strike",
  [AttackAnimationType.KNEE_CLINCH]: "knee_strike", // Reuse knee strike in clinch position

  // Pressure point category (급소 타격) - use precise jab motion
  [AttackAnimationType.PRESSURE_POINT]: "jab",
  [AttackAnimationType.PRESSURE_POINT_RAPID]: "jab",
};

/**
 * Get skeletal animation name for an attack animation type
 * 
 * @param animationType - Attack animation type enum
 * @returns Name of skeletal animation from ATTACK_ANIMATIONS map
 * 
 * @public
 * @korean 애니메이션타입에서이름가져오기
 */
export function getAnimationNameForType(
  animationType: AttackAnimationType
): string {
  return ANIMATION_TYPE_TO_NAME_MAP[animationType];
}

/**
 * Check if an animation type has a defined animation
 * 
 * @param animationType - Attack animation type enum
 * @returns True if animation exists in ATTACK_ANIMATIONS map
 * 
 * @public
 * @korean 애니메이션존재확인
 */
export function hasAnimationForType(
  animationType: AttackAnimationType
): boolean {
  const animationName = ANIMATION_TYPE_TO_NAME_MAP[animationType];
  return ATTACK_ANIMATIONS.has(animationName);
}

/**
 * Determines appropriate animation type from technique characteristics
 * 
 * Uses technique name, damage type, and keywords to automatically
 * select the best-matching attack animation type.
 * 
 * @param techniqueName - English or Korean technique name
 * @param techniqueId - Technique ID
 * @param damageType - Type of damage dealt
 * @returns Best-matching attack animation type
 * 
 * @public
 * @korean 기술에서애니메이션타입결정
 */
export function determineAnimationTypeForTechnique(
  techniqueName: string,
  techniqueId: string,
  damageType?: string
): AttackAnimationType {
  const searchText = `${techniqueName} ${techniqueId}`.toLowerCase();

  // Pressure point / precise strikes (급소)
  if (
    searchText.includes("pressure") ||
    searchText.includes("precise") ||
    searchText.includes("nerve") ||
    searchText.includes("vital") ||
    searchText.includes("급소") ||
    searchText.includes("신경") ||
    damageType === "nerve" ||
    damageType === "pressure"
  ) {
    // Check for rapid/multi-hit variants
    if (
      searchText.includes("rapid") ||
      searchText.includes("multiple") ||
      searchText.includes("연속")
    ) {
      return AttackAnimationType.PRESSURE_POINT_RAPID;
    }
    return AttackAnimationType.PRESSURE_POINT;
  }

  // Kicks (차기)
  if (
    searchText.includes("kick") ||
    searchText.includes("차기") ||
    searchText.includes("발")
  ) {
    if (
      searchText.includes("roundhouse") ||
      searchText.includes("round") ||
      searchText.includes("돌려") ||
      searchText.includes("회전")
    ) {
      return AttackAnimationType.KICK_ROUNDHOUSE;
    }
    if (
      searchText.includes("side") ||
      searchText.includes("옆") ||
      searchText.includes("측면")
    ) {
      return AttackAnimationType.KICK_SIDE;
    }
    // Default to front kick
    return AttackAnimationType.KICK_FRONT;
  }

  // Elbow strikes (팔꿈치)
  if (
    searchText.includes("elbow") ||
    searchText.includes("팔꿈치") ||
    searchText.includes("팔굽")
  ) {
    if (
      searchText.includes("uppercut") ||
      searchText.includes("올려") ||
      searchText.includes("치켜")
    ) {
      return AttackAnimationType.ELBOW_UPPERCUT;
    }
    return AttackAnimationType.ELBOW_STRIKE;
  }

  // Knee strikes (무릎)
  if (
    searchText.includes("knee") ||
    searchText.includes("무릎") ||
    searchText.includes("슬")
  ) {
    if (
      searchText.includes("clinch") ||
      searchText.includes("grab") ||
      searchText.includes("잡고")
    ) {
      return AttackAnimationType.KNEE_CLINCH;
    }
    return AttackAnimationType.KNEE_STRIKE;
  }

  // Punches (주먹) - check target height
  if (
    searchText.includes("punch") ||
    searchText.includes("strike") ||
    searchText.includes("주먹") ||
    searchText.includes("권") ||
    searchText.includes("격")
  ) {
    // High attacks (head level)
    if (
      searchText.includes("head") ||
      searchText.includes("high") ||
      searchText.includes("temple") ||
      searchText.includes("jaw") ||
      searchText.includes("머리") ||
      searchText.includes("관자") ||
      searchText.includes("턱")
    ) {
      return AttackAnimationType.PUNCH_HIGH;
    }
    // Low attacks (body level)
    if (
      searchText.includes("low") ||
      searchText.includes("body") ||
      searchText.includes("ribs") ||
      searchText.includes("아래") ||
      searchText.includes("복부") ||
      searchText.includes("늑골")
    ) {
      return AttackAnimationType.PUNCH_LOW;
    }
    // Default to mid-level punch
    return AttackAnimationType.PUNCH_MID;
  }

  // Default: mid-level punch for any unmatched technique
  return AttackAnimationType.PUNCH_MID;
}

/**
 * Calculates animation speed modifier based on technique power level
 * 
 * Implements the rule:
 * - Light techniques (damage <20): 1.2x speed
 * - Normal techniques (damage 20-35): 1.0x speed
 * - Heavy techniques (damage >35): 0.8x speed
 * 
 * @param damage - Base damage of the technique
 * @returns Speed modifier (0.8 - 1.2)
 * 
 * @public
 * @korean 기술위력에서속도배율계산
 */
export function calculateSpeedModifierForDamage(damage: number): number {
  if (damage < 20) {
    return 1.2; // Light, fast techniques
  } else if (damage > 35) {
    return 0.8; // Heavy, powerful techniques
  }
  return 1.0; // Normal speed
}

/**
 * Get animation duration adjusted by speed modifier
 * 
 * @param baseAnimationName - Name of base animation
 * @param speedModifier - Speed multiplier (0.8 - 1.2)
 * @returns Adjusted duration in milliseconds
 * 
 * @public
 * @korean 조정된애니메이션지속시간
 */
export function getAdjustedAnimationDuration(
  baseAnimationName: string,
  speedModifier: number
): number {
  const animation = ATTACK_ANIMATIONS.get(baseAnimationName);
  if (!animation) {
    return 200; // Default 200ms for missing animations
  }

  // Convert seconds to milliseconds and apply speed modifier
  const baseDurationMs = animation.duration * 1000;
  return Math.round(baseDurationMs / speedModifier);
}

export default {
  getAnimationNameForType,
  hasAnimationForType,
  determineAnimationTypeForTechnique,
  calculateSpeedModifierForDamage,
  getAdjustedAnimationDuration,
};
