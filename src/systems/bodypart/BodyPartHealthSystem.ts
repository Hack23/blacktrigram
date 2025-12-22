/**
 * Body Part Health System
 * 
 * **Korean**: 신체부위 체력 시스템
 * 
 * Manages body part-specific health tracking, damage distribution, and combat
 * capability effects. Implements realistic localized damage mechanics based on
 * Korean martial arts vital point targeting principles.
 * 
 * ## System Features
 * 
 * - Independent health tracking for 8 body parts
 * - Automatic combat capability penalties based on damage
 * - Damage distribution from hit locations to body parts
 * - UI-friendly status information generation
 * - Performance-optimized calculations
 * 
 * @module systems/bodypart/BodyPartHealthSystem
 * @category Body Part System
 * @korean 신체부위체력시스템
 */

import { BodyRegion, KOREAN_COLORS, KoreanText } from "@/types";
import {
  BodyPart,
  BodyPartDamageDistribution,
  BodyPartEffects,
  BodyPartHealth,
  BodyPartHealthConfig,
  BodyPartMaxHealth,
  BodyPartStatus,
  BODY_PART_EFFECT_CONSTANTS,
  DEFAULT_BODY_PART_CONFIG,
} from "./types";

/**
 * Body Part Health System class.
 * 
 * **Korean**: 신체부위 체력 시스템 클래스
 * 
 * Provides methods for managing body part health, calculating effects,
 * and distributing damage based on hit locations.
 * 
 * @example
 * ```typescript
 * const system = new BodyPartHealthSystem();
 * 
 * // Create initial body part health
 * const health = system.createDefaultBodyPartHealth();
 * 
 * // Apply damage to head
 * const damaged = system.applyDamageToBodyPart(
 *   health,
 *   BodyPart.HEAD,
 *   25
 * );
 * 
 * // Calculate combat effects
 * const effects = system.calculateBodyPartEffects(damaged);
 * ```
 * 
 * @public
 * @category Body Part System
 */
export class BodyPartHealthSystem {
  private config: BodyPartHealthConfig;

  constructor(config: BodyPartHealthConfig = DEFAULT_BODY_PART_CONFIG) {
    this.config = config;
  }

  /**
   * Create default body part health with all parts at maximum.
   * 
   * **Korean**: 기본 신체부위 체력 생성
   * 
   * @param maxHealth - Optional custom max health per part (default: 100)
   * @returns Body part health structure with all parts at max HP
   * 
   * @public
   */
  createDefaultBodyPartHealth(maxHealth: number = 100): BodyPartHealth {
    return {
      head: maxHealth,
      neck: maxHealth,
      torsoUpper: maxHealth,
      torsoLower: maxHealth,
      armLeft: maxHealth,
      armRight: maxHealth,
      legLeft: maxHealth,
      legRight: maxHealth,
    };
  }

  /**
   * Create default maximum health values for body parts.
   * 
   * **Korean**: 기본 최대 체력 생성
   * 
   * @param baseMaxHealth - Base maximum health per part
   * @returns Maximum health structure
   * 
   * @public
   */
  createDefaultMaxHealth(baseMaxHealth: number = 100): BodyPartMaxHealth {
    return {
      head: baseMaxHealth,
      neck: baseMaxHealth,
      torsoUpper: baseMaxHealth,
      torsoLower: baseMaxHealth,
      armLeft: baseMaxHealth,
      armRight: baseMaxHealth,
      legLeft: baseMaxHealth,
      legRight: baseMaxHealth,
    };
  }

  /**
   * Apply damage to a specific body part.
   * 
   * **Korean**: 신체부위 피해 적용
   * 
   * Reduces health of the specified body part by the damage amount.
   * Health is clamped to 0-maxHealth range.
   * 
   * @param current - Current body part health
   * @param bodyPart - Body part to damage
   * @param damage - Damage amount to apply
   * @param maxHealth - Optional maximum health limits
   * @returns Updated body part health
   * 
   * @public
   */
  applyDamageToBodyPart(
    current: BodyPartHealth,
    bodyPart: BodyPart,
    damage: number,
    maxHealth?: BodyPartMaxHealth
  ): BodyPartHealth {
    const newHealth = Math.max(0, current[bodyPart] - damage);
    const clampedHealth = maxHealth
      ? Math.min(newHealth, maxHealth[bodyPart])
      : newHealth;

    return {
      ...current,
      [bodyPart]: clampedHealth,
    };
  }

  /**
   * Distribute damage across body parts based on hit location.
   * 
   * **Korean**: 피해 분배
   * 
   * Maps a BodyRegion hit location to primary and secondary body parts,
   * distributing damage according to impact mechanics.
   * 
   * @param bodyRegion - Hit location
   * @returns Damage distribution configuration
   * 
   * @public
   */
  getDamageDistribution(bodyRegion: BodyRegion): BodyPartDamageDistribution {
    switch (bodyRegion) {
      case BodyRegion.HEAD:
        return {
          primary: { part: BodyPart.HEAD, percentage: 0.9 },
          secondary: [{ part: BodyPart.NECK, percentage: 0.1 }],
        };

      case BodyRegion.NECK:
        return {
          primary: { part: BodyPart.NECK, percentage: 0.8 },
          secondary: [
            { part: BodyPart.HEAD, percentage: 0.1 },
            { part: BodyPart.TORSO_UPPER, percentage: 0.1 },
          ],
        };

      case BodyRegion.TORSO:
        return {
          primary: { part: BodyPart.TORSO_UPPER, percentage: 0.6 },
          secondary: [{ part: BodyPart.TORSO_LOWER, percentage: 0.4 }],
        };

      case BodyRegion.CORE:
        return {
          primary: { part: BodyPart.TORSO_LOWER, percentage: 0.7 },
          secondary: [{ part: BodyPart.TORSO_UPPER, percentage: 0.3 }],
        };

      case BodyRegion.LEFT_ARM:
        return {
          primary: { part: BodyPart.ARM_LEFT, percentage: 0.9 },
          secondary: [{ part: BodyPart.TORSO_UPPER, percentage: 0.1 }],
        };

      case BodyRegion.RIGHT_ARM:
        return {
          primary: { part: BodyPart.ARM_RIGHT, percentage: 0.9 },
          secondary: [{ part: BodyPart.TORSO_UPPER, percentage: 0.1 }],
        };

      case BodyRegion.LEFT_LEG:
        return {
          primary: { part: BodyPart.LEG_LEFT, percentage: 0.9 },
          secondary: [{ part: BodyPart.TORSO_LOWER, percentage: 0.1 }],
        };

      case BodyRegion.RIGHT_LEG:
        return {
          primary: { part: BodyPart.LEG_RIGHT, percentage: 0.9 },
          secondary: [{ part: BodyPart.TORSO_LOWER, percentage: 0.1 }],
        };

      default:
        // Default to torso upper for unknown regions
        return {
          primary: { part: BodyPart.TORSO_UPPER, percentage: 1.0 },
          secondary: [],
        };
    }
  }

  /**
   * Apply distributed damage to body parts from a hit.
   * 
   * **Korean**: 분산 피해 적용
   * 
   * Takes total damage and distributes it across primary and secondary
   * body parts based on the hit location.
   * 
   * @param current - Current body part health
   * @param bodyRegion - Hit location
   * @param totalDamage - Total damage to distribute
   * @param maxHealth - Optional maximum health limits
   * @returns Updated body part health
   * 
   * @public
   */
  applyDistributedDamage(
    current: BodyPartHealth,
    bodyRegion: BodyRegion,
    totalDamage: number,
    maxHealth?: BodyPartMaxHealth
  ): BodyPartHealth {
    const distribution = this.getDamageDistribution(bodyRegion);
    let updated = { ...current };

    // Apply primary damage
    updated = this.applyDamageToBodyPart(
      updated,
      distribution.primary.part,
      totalDamage * distribution.primary.percentage,
      maxHealth
    );

    // Apply secondary damage
    for (const secondary of distribution.secondary) {
      updated = this.applyDamageToBodyPart(
        updated,
        secondary.part,
        totalDamage * secondary.percentage,
        maxHealth
      );
    }

    return updated;
  }

  /**
   * Calculate combat capability effects from body part damage.
   * 
   * **Korean**: 전투 능력 효과 계산
   * 
   * Analyzes body part health and returns multipliers for various combat
   * capabilities. Implements acceptance criteria:
   * - Head <50%: Consciousness penalties
   * - Torso <50%: Stamina regen -50%
   * - Arms <50%: Attack damage -30%
   * - Legs <50%: Movement speed -40%
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @returns Combat capability effect multipliers
   * 
   * @public
   */
  calculateBodyPartEffects(
    health: BodyPartHealth,
    maxHealth?: BodyPartMaxHealth
  ): BodyPartEffects {
    const max = maxHealth ?? this.createDefaultMaxHealth();

    // Calculate head/neck effects on consciousness
    const headPercentage = health.head / max.head;
    const neckPercentage = health.neck / max.neck;
    const minHeadNeck = Math.min(headPercentage, neckPercentage);
    
    let consciousnessModifier = 1.0;
    if (minHeadNeck < BODY_PART_EFFECT_CONSTANTS.HEAD.CRITICAL_THRESHOLD) {
      consciousnessModifier = BODY_PART_EFFECT_CONSTANTS.HEAD.CONSCIOUSNESS_PENALTY_AT_50;
    }

    // Calculate torso effects on stamina regeneration
    const torsoUpperPercentage = health.torsoUpper / max.torsoUpper;
    const torsoLowerPercentage = health.torsoLower / max.torsoLower;
    const avgTorso = (torsoUpperPercentage + torsoLowerPercentage) / 2;
    
    let staminaRegenModifier = 1.0;
    if (avgTorso < BODY_PART_EFFECT_CONSTANTS.TORSO.CRITICAL_THRESHOLD) {
      staminaRegenModifier = BODY_PART_EFFECT_CONSTANTS.TORSO.STAMINA_REGEN_PENALTY_AT_50;
    }

    // Calculate arm effects on attack damage
    const armLeftPercentage = health.armLeft / max.armLeft;
    const armRightPercentage = health.armRight / max.armRight;
    const avgArms = (armLeftPercentage + armRightPercentage) / 2;
    
    let attackDamageModifier = 1.0;
    if (avgArms < BODY_PART_EFFECT_CONSTANTS.ARMS.CRITICAL_THRESHOLD) {
      attackDamageModifier = BODY_PART_EFFECT_CONSTANTS.ARMS.ATTACK_DAMAGE_PENALTY_AT_50;
    }

    // Calculate leg effects on movement speed
    const legLeftPercentage = health.legLeft / max.legLeft;
    const legRightPercentage = health.legRight / max.legRight;
    const avgLegs = (legLeftPercentage + legRightPercentage) / 2;
    
    let movementSpeedModifier = 1.0;
    if (avgLegs < BODY_PART_EFFECT_CONSTANTS.LEGS.CRITICAL_THRESHOLD) {
      movementSpeedModifier = BODY_PART_EFFECT_CONSTANTS.LEGS.MOVEMENT_SPEED_PENALTY_AT_50;
    }

    // Balance affected by torso and legs
    const balanceModifier = Math.min(avgTorso, avgLegs);

    // Technique accuracy affected by head and arms
    const techniqueAccuracyModifier = Math.min(headPercentage, avgArms);

    return {
      consciousnessModifier,
      staminaRegenModifier,
      attackDamageModifier,
      movementSpeedModifier,
      balanceModifier,
      techniqueAccuracyModifier,
    };
  }

  /**
   * Calculate aggregate health from body parts.
   * 
   * **Korean**: 종합 체력 계산
   * 
   * Computes overall health as average of all body part health values.
   * This maintains backwards compatibility with single health bar systems.
   * 
   * @param health - Body part health
   * @returns Aggregate health value (0-100)
   * 
   * @public
   */
  calculateAggregateHealth(health: BodyPartHealth): number {
    const sum =
      health.head +
      health.neck +
      health.torsoUpper +
      health.torsoLower +
      health.armLeft +
      health.armRight +
      health.legLeft +
      health.legRight;

    return sum / 8;
  }

  /**
   * Get body part status for UI display.
   * 
   * **Korean**: 신체부위 상태 조회
   * 
   * Provides UI-friendly status information including color coding,
   * status text, and critical/disabled flags.
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @param part - Body part to query
   * @returns Status information for display
   * 
   * @public
   */
  getBodyPartStatus(
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth,
    part: BodyPart
  ): BodyPartStatus {
    const current = health[part];
    const max = maxHealth[part];
    const percentage = current / max;

    // Determine status and color
    let status: KoreanText;
    let color: number;
    let critical: boolean;
    let disabled: boolean;

    if (percentage === 0) {
      status = { korean: "무력화", english: "Disabled" };
      color = KOREAN_COLORS.NEGATIVE_RED;
      critical = true;
      disabled = true;
    } else if (percentage < this.config.criticalThreshold) {
      status = { korean: "치명적", english: "Critical" };
      color = KOREAN_COLORS.NEGATIVE_RED;
      critical = true;
      disabled = false;
    } else if (percentage < this.config.severePenaltyThreshold) {
      status = { korean: "심각", english: "Severe" };
      color = KOREAN_COLORS.WARNING_ORANGE;
      critical = false;
      disabled = false;
    } else if (percentage < this.config.majorPenaltyThreshold) {
      status = { korean: "중상", english: "Major" };
      color = KOREAN_COLORS.WARNING_YELLOW;
      critical = false;
      disabled = false;
    } else if (percentage < this.config.minorPenaltyThreshold) {
      status = { korean: "경상", english: "Minor" };
      color = KOREAN_COLORS.HEALTH_FULL;
      critical = false;
      disabled = false;
    } else {
      status = { korean: "정상", english: "Normal" };
      color = KOREAN_COLORS.HEALTH_FULL;
      critical = false;
      disabled = false;
    }

    return {
      part,
      health: current,
      maxHealth: max,
      percentage,
      status,
      color,
      critical,
      disabled,
    };
  }

  /**
   * Get all body part statuses for UI.
   * 
   * **Korean**: 모든 신체부위 상태 조회
   * 
   * Returns status information for all body parts in a single call.
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @returns Array of status information for all parts
   * 
   * @public
   */
  getAllBodyPartStatuses(
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth
  ): BodyPartStatus[] {
    return Object.values(BodyPart).map((part) =>
      this.getBodyPartStatus(health, maxHealth, part)
    );
  }

  /**
   * Heal a specific body part.
   * 
   * **Korean**: 신체부위 치유
   * 
   * Increases health of the specified body part by the heal amount.
   * Health is clamped to 0-maxHealth range.
   * 
   * @param current - Current body part health
   * @param bodyPart - Body part to heal
   * @param healAmount - Amount of health to restore
   * @param maxHealth - Optional maximum health limits
   * @returns Updated body part health
   * 
   * @public
   */
  healBodyPart(
    current: BodyPartHealth,
    bodyPart: BodyPart,
    healAmount: number,
    maxHealth?: BodyPartMaxHealth
  ): BodyPartHealth {
    const max = maxHealth ?? this.createDefaultMaxHealth();
    const newHealth = Math.min(max[bodyPart], current[bodyPart] + healAmount);

    return {
      ...current,
      [bodyPart]: newHealth,
    };
  }

  /**
   * Check if player is incapacitated based on body part health.
   * 
   * **Korean**: 무력화 상태 확인
   * 
   * Player is incapacitated if:
   * - Head is at 0 HP (unconscious)
   * - Both legs are at 0 HP (cannot move)
   * - Aggregate health below 10%
   * 
   * @param health - Current body part health
   * @returns Whether player is incapacitated
   * 
   * @public
   */
  isIncapacitated(health: BodyPartHealth): boolean {
    // Unconscious from head damage
    if (health.head <= 0) return true;

    // Cannot move from leg damage
    if (health.legLeft <= 0 && health.legRight <= 0) return true;

    // Aggregate health critical
    const aggregate = this.calculateAggregateHealth(health);
    if (aggregate < 10) return true;

    return false;
  }
}

/**
 * Singleton instance of Body Part Health System.
 * 
 * **Korean**: 신체부위 체력 시스템 싱글톤
 * 
 * Provides global access to the body part health system throughout the game.
 * 
 * @public
 */
export const bodyPartHealthSystem = new BodyPartHealthSystem();
