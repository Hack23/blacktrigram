/**
 * Breathing Disruption System for realistic respiratory targeting mechanics.
 * 
 * **Korean**: 호흡곤란 시스템 (Breathing Disruption System)
 * 
 * This system implements realistic breathing disruption from torso strikes targeting
 * the solar plexus, ribs, and diaphragm. Breathing difficulty reduces stamina
 * regeneration and creates authentic combat trauma effects.
 * 
 * ## Disruption Levels (호흡곤란 수준)
 * 
 * - **Winded (바람맞음)**: 25% stamina regeneration penalty for 5 seconds
 * - **Gasping (헐떡임)**: 50% stamina regeneration penalty for 10 seconds
 * - **Severely Winded (심각한 호흡곤란)**: 75% stamina regeneration penalty for 15 seconds
 * 
 * ## Korean Martial Arts Context
 * 
 * Traditional Korean martial arts (태권도, 합기도, 택견) emphasize torso strikes:
 * - **명치 (Myeongchi)**: Solar plexus - instant breath disruption
 * - **늑골 (Neukgol)**: Floating ribs - cumulative breathing difficulty
 * - **횡격막 (Hoenggyeongmak)**: Diaphragm - severe respiratory impact
 * 
 * ## Game Design Philosophy
 * 
 * Breathing disruption creates tactical depth by:
 * 1. Rewarding torso targeting over simple head/limb attacks
 * 2. Creating stamina management gameplay - disrupted fighters must fight defensively
 * 3. Providing realistic combat trauma feedback
 * 4. Encouraging recovery periods when torso health is compromised
 * 
 * @module systems/breathing
 * @category Combat Systems
 * @korean 호흡곤란시스템
 */

import { KoreanText, VitalPointEffectType } from "@/types";
import { StatusEffect } from "@/systems/types";
import { PlayerState } from "@/systems/player";
import { EffectIntensity } from "@/systems/effects";

/**
 * Breathing disruption severity levels.
 * 
 * **Korean**: 호흡곤란 수준
 * 
 * Progressive levels of respiratory impairment from torso strikes.
 * Higher levels stack duration and increase stamina regeneration penalties.
 * 
 * @public
 * @category Combat Systems
 * @korean 호흡곤란수준
 */
export enum BreathingDisruptionLevel {
  /** No breathing disruption - normal stamina regeneration */
  NONE = "none",
  
  /**
   * Winded (바람맞음)
   * - 25% stamina regeneration penalty
   * - Duration: 5 seconds
   * - Caused by: Moderate torso strikes
   */
  WINDED = "winded",
  
  /**
   * Gasping (헐떡임)
   * - 50% stamina regeneration penalty
   * - Duration: 10 seconds
   * - Caused by: Heavy torso strikes or multiple hits
   */
  GASPING = "gasping",
  
  /**
   * Severely Winded (심각한 호흡곤란)
   * - 75% stamina regeneration penalty
   * - Duration: 15 seconds
   * - Caused by: Solar plexus vital point strikes
   */
  SEVERELY_WINDED = "severely_winded",
}

/**
 * Breathing disruption effect extending StatusEffect.
 * 
 * **Korean**: 호흡곤란 효과
 * 
 * Tracks active breathing difficulty with Korean-English terminology.
 * Integrates with the status effect system for consistent duration tracking.
 * 
 * @public
 * @category Combat Systems
 * @korean 호흡곤란효과
 */
export interface BreathingDisruptionEffect extends StatusEffect {
  /** Effect type is always BREATHLESSNESS */
  readonly type: VitalPointEffectType.BREATHLESSNESS;
  
  /** Breathing disruption severity level */
  readonly level: BreathingDisruptionLevel;
  
  /** Stamina regeneration multiplier (0.25 = 75% penalty, 0.50 = 50% penalty) */
  readonly staminaRegenMultiplier: number;
  
  /** Whether this effect can stack with additional torso hits */
  readonly stackable: true;
}

/**
 * Configuration for breathing disruption level effects.
 * 
 * **Korean**: 호흡곤란 설정
 */
interface BreathingDisruptionConfig {
  readonly level: BreathingDisruptionLevel;
  readonly duration: number; // milliseconds
  readonly staminaRegenMultiplier: number;
  readonly koreanName: string;
  readonly englishName: string;
  readonly description: KoreanText;
}

/**
 * Breathing disruption level configurations.
 * 
 * Defines stamina penalties, durations, and bilingual descriptions
 * for each severity level.
 */
const BREATHING_DISRUPTION_CONFIGS: Record<
  Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>,
  BreathingDisruptionConfig
> = {
  [BreathingDisruptionLevel.WINDED]: {
    level: BreathingDisruptionLevel.WINDED,
    duration: 5000, // 5 seconds
    staminaRegenMultiplier: 0.75, // 25% penalty
    koreanName: "바람맞음",
    englishName: "Winded",
    description: {
      korean: "중간 강도의 몸통 타격으로 호흡이 불규칙해짐",
      english: "Breathing is irregular from moderate torso strike",
      romanized: "baram-maeum",
    },
  },
  [BreathingDisruptionLevel.GASPING]: {
    level: BreathingDisruptionLevel.GASPING,
    duration: 10000, // 10 seconds
    staminaRegenMultiplier: 0.50, // 50% penalty
    koreanName: "헐떡임",
    englishName: "Gasping",
    description: {
      korean: "강한 몸통 타격으로 호흡이 어려워짐",
      english: "Heavy torso strikes cause breathing difficulty",
      romanized: "heoltteogim",
    },
  },
  [BreathingDisruptionLevel.SEVERELY_WINDED]: {
    level: BreathingDisruptionLevel.SEVERELY_WINDED,
    duration: 15000, // 15 seconds
    staminaRegenMultiplier: 0.25, // 75% penalty
    koreanName: "심각한 호흡곤란",
    englishName: "Severely Winded",
    description: {
      korean: "명치 급소 타격으로 심각한 호흡곤란 발생",
      english: "Solar plexus vital strike causes severe breathing disruption",
      romanized: "simgakhan hoheup gonnan",
    },
  },
};

/**
 * Breathing Disruption System implementation.
 * 
 * **Korean**: 호흡곤란 시스템
 * 
 * Manages breathing disruption effects from torso targeting.
 * Integrates with vital point system and stamina regeneration.
 * 
 * @public
 * @category Combat Systems
 */
export class BreathingDisruptionSystem {
  /**
   * Create a breathing disruption effect at specified severity level.
   * 
   * **Korean**: 호흡곤란 효과 생성
   * 
   * @param level - Severity level of breathing disruption
   * @param source - Source of the disruption (technique name, vital point, etc.)
   * @param timestamp - When the effect was applied (game time)
   * @returns BreathingDisruptionEffect ready to apply to PlayerState
   * 
   * @example
   * ```typescript
   * // Solar plexus strike causes severe disruption
   * const effect = BreathingDisruptionSystem.createEffect(
   *   BreathingDisruptionLevel.SEVERELY_WINDED,
   *   "명치타격 (Solar Plexus Strike)",
   *   Date.now()
   * );
   * ```
   */
  static createEffect(
    level: Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>,
    source: string,
    timestamp: number
  ): BreathingDisruptionEffect {
    const config = BREATHING_DISRUPTION_CONFIGS[level];
    
    return {
      id: `breathing_disruption_${level}_${timestamp}`,
      type: VitalPointEffectType.BREATHLESSNESS,
      level,
      intensity: this.levelToIntensity(level),
      duration: config.duration,
      staminaRegenMultiplier: config.staminaRegenMultiplier,
      description: config.description,
      stackable: true,
      source,
      startTime: timestamp,
      endTime: timestamp + config.duration,
    };
  }

  /**
   * Convert breathing disruption level to effect intensity.
   * 
   * Maps severity levels to standardized EffectIntensity enum.
   * 
   * @param level - Breathing disruption severity
   * @returns Corresponding EffectIntensity value
   */
  private static levelToIntensity(
    level: BreathingDisruptionLevel
  ): EffectIntensity {
    switch (level) {
      case BreathingDisruptionLevel.WINDED:
        return EffectIntensity.LOW;
      case BreathingDisruptionLevel.GASPING:
        return EffectIntensity.MEDIUM;
      case BreathingDisruptionLevel.SEVERELY_WINDED:
        return EffectIntensity.HIGH;
      default:
        return EffectIntensity.WEAK;
    }
  }

  /**
   * Calculate breathing disruption level from damage amount.
   * 
   * **Korean**: 피해량으로 호흡곤란 수준 계산
   * 
   * Determines appropriate disruption severity based on torso strike damage.
   * Used when vital point ID is not specified but torso region was hit.
   * 
   * @param damage - Base damage of the torso strike
   * @param isSolarPlexus - Whether strike hit solar plexus vital point
   * @returns Appropriate breathing disruption level
   * 
   * @example
   * ```typescript
   * // Moderate torso strike (15 damage) causes winded effect
   * const level = BreathingDisruptionSystem.calculateLevelFromDamage(15, false);
   * // level === BreathingDisruptionLevel.WINDED
   * 
   * // Solar plexus vital strike (20+ damage) causes severe effect
   * const severeLevel = BreathingDisruptionSystem.calculateLevelFromDamage(25, true);
   * // severeLevel === BreathingDisruptionLevel.SEVERELY_WINDED
   * ```
   */
  static calculateLevelFromDamage(
    damage: number,
    isSolarPlexus: boolean
  ): BreathingDisruptionLevel {
    // Solar plexus vital strikes always cause severe disruption
    if (isSolarPlexus) {
      return BreathingDisruptionLevel.SEVERELY_WINDED;
    }

    // Thresholds for damage-based severity
    if (damage >= 20) {
      return BreathingDisruptionLevel.GASPING;
    } else if (damage >= 10) {
      return BreathingDisruptionLevel.WINDED;
    }

    return BreathingDisruptionLevel.NONE;
  }

  /**
   * Stack multiple breathing disruption effects.
   * 
   * **Korean**: 호흡곤란 효과 누적
   * 
   * Cumulative torso hits increase disruption duration and potentially severity.
   * Multiple hits stack duration, and severe hits can escalate the level.
   * 
   * @param existingEffect - Current active breathing disruption effect
   * @param newLevel - Severity of new torso strike
   * @param source - Source of the new disruption
   * @param timestamp - Current game time
   * @returns Updated BreathingDisruptionEffect with stacked duration/severity
   * 
   * @example
   * ```typescript
   * // First hit: Winded for 5 seconds
   * let effect = BreathingDisruptionSystem.createEffect(
   *   BreathingDisruptionLevel.WINDED, "Rib Strike", 1000
   * );
   * 
   * // Second hit: Stacks to Gasping with extended duration
   * effect = BreathingDisruptionSystem.stackEffect(
   *   effect, BreathingDisruptionLevel.WINDED, "Rib Strike", 3000
   * );
   * // Now Gasping level with 10+ seconds remaining
   * ```
   */
  static stackEffect(
    existingEffect: BreathingDisruptionEffect,
    newLevel: Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>,
    source: string,
    timestamp: number
  ): BreathingDisruptionEffect {
    const newConfig = BREATHING_DISRUPTION_CONFIGS[newLevel];
    
    // Escalate to higher severity if new strike is more severe
    const effectiveLevel = this.getHigherLevel(existingEffect.level, newLevel);
    const effectiveConfig = BREATHING_DISRUPTION_CONFIGS[effectiveLevel];

    // Stack duration: add 50% of new effect's duration to remaining time
    const remainingTime = Math.max(0, existingEffect.endTime - timestamp);
    const additionalTime = Math.floor(newConfig.duration * 0.5);
    const totalDuration = remainingTime + additionalTime;

    return {
      ...existingEffect,
      level: effectiveLevel,
      intensity: this.levelToIntensity(effectiveLevel),
      duration: totalDuration,
      staminaRegenMultiplier: effectiveConfig.staminaRegenMultiplier,
      description: effectiveConfig.description,
      source: `${existingEffect.source}, ${source}`,
      endTime: timestamp + totalDuration,
    };
  }

  /**
   * Compare two disruption levels and return the more severe.
   * 
   * @param level1 - First disruption level
   * @param level2 - Second disruption level
   * @returns The more severe of the two levels
   */
  private static getHigherLevel(
    level1: BreathingDisruptionLevel,
    level2: BreathingDisruptionLevel
  ): Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE> {
    const severity = {
      [BreathingDisruptionLevel.NONE]: 0,
      [BreathingDisruptionLevel.WINDED]: 1,
      [BreathingDisruptionLevel.GASPING]: 2,
      [BreathingDisruptionLevel.SEVERELY_WINDED]: 3,
    };

    const higher = severity[level1] > severity[level2] ? level1 : level2;
    
    // Type guard: result can't be NONE since inputs exclude NONE
    return higher as Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>;
  }

  /**
   * Get active breathing disruption effect from player state.
   * 
   * **Korean**: 활성 호흡곤란 효과 가져오기
   * 
   * Searches player's active status effects for breathing disruption.
   * 
   * @param player - Current player state
   * @returns Active BreathingDisruptionEffect or undefined
   */
  static getActiveEffect(
    player: PlayerState
  ): BreathingDisruptionEffect | undefined {
    return player.statusEffects.find(
      (effect): effect is BreathingDisruptionEffect =>
        effect.type === VitalPointEffectType.BREATHLESSNESS &&
        "level" in effect &&
        "staminaRegenMultiplier" in effect
    );
  }

  /**
   * Calculate stamina regeneration multiplier with breathing disruption.
   * 
   * **Korean**: 호흡곤란 포함 스태미나 재생 계산
   * 
   * Applies breathing disruption penalty to base stamina regeneration rate.
   * Used by stamina regeneration system each frame.
   * 
   * @param player - Current player state
   * @param baseRegenRate - Base stamina regeneration per second
   * @returns Modified regeneration rate with breathing penalty applied
   * 
   * @example
   * ```typescript
   * const baseRegen = 10; // 10 stamina/second normally
   * 
   * // With Gasping effect (50% penalty)
   * const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
   *   player, baseRegen
   * );
   * // modifiedRegen === 5 (50% of base rate)
   * ```
   */
  static calculateStaminaRegen(
    player: PlayerState,
    baseRegenRate: number
  ): number {
    const activeEffect = this.getActiveEffect(player);
    
    if (!activeEffect) {
      return baseRegenRate;
    }

    return baseRegenRate * activeEffect.staminaRegenMultiplier;
  }

  /**
   * Check if player can recover from breathing disruption.
   * 
   * **Korean**: 호흡곤란 회복 가능 여부 확인
   * 
   * Recovery is possible when torso health > 50%.
   * Player must avoid additional torso damage to allow breathing to normalize.
   * 
   * @param player - Current player state
   * @returns True if torso health supports recovery
   */
  static canRecover(player: PlayerState): boolean {
    // Check if body part health tracking is available
    if (!player.bodyPartHealth) {
      // Fallback: use overall health as proxy
      return player.health > player.maxHealth * 0.5;
    }

    // Calculate torso health percentage (using upper torso as primary)
    const upperTorsoHealth = player.bodyPartHealth.torsoUpper ?? 0;
    const lowerTorsoHealth = player.bodyPartHealth.torsoLower ?? 0;
    const avgTorsoHealth = (upperTorsoHealth + lowerTorsoHealth) / 2;
    
    const maxUpperTorsoHealth = player.bodyPartMaxHealth?.torsoUpper ?? 100;
    const maxLowerTorsoHealth = player.bodyPartMaxHealth?.torsoLower ?? 100;
    const avgMaxTorsoHealth = (maxUpperTorsoHealth + maxLowerTorsoHealth) / 2;
    
    const torsoHealthPercent = avgTorsoHealth / avgMaxTorsoHealth;

    return torsoHealthPercent > 0.5;
  }

  /**
   * Apply gradual recovery to breathing disruption effect.
   * 
   * **Korean**: 호흡곤란 점진적 회복 적용
   * 
   * When torso health > 50% and no new hits, breathing gradually improves.
   * This provides tactical gameplay: fighters with damaged torsos must fight defensively.
   * 
   * @param effect - Current breathing disruption effect
   * @param deltaTime - Time since last update (milliseconds)
   * @param timestamp - Current game time
   * @returns Updated effect with recovery applied, or undefined if fully recovered
   * 
   * @example
   * ```typescript
   * // Each frame with torso health > 50%
   * const updated = BreathingDisruptionSystem.applyGradualRecovery(
   *   effect, 16.67, timestamp
   * );
   * // Effect duration decreases faster than normal expiration
   * ```
   */
  static applyGradualRecovery(
    effect: BreathingDisruptionEffect,
    deltaTime: number,
    timestamp: number
  ): BreathingDisruptionEffect | undefined {
    // Recovery rate: 2x faster than normal expiration
    const recoveryMultiplier = 2.0;
    const recoveryTime = deltaTime * recoveryMultiplier;
    
    const newEndTime = effect.endTime - recoveryTime;
    
    // Fully recovered if end time reached
    if (newEndTime <= timestamp) {
      return undefined;
    }

    return {
      ...effect,
      endTime: newEndTime,
      duration: newEndTime - effect.startTime,
    };
  }

  /**
   * Get breathing disruption level from player state.
   * 
   * **Korean**: 플레이어 호흡곤란 수준 가져오기
   * 
   * Convenience method to get current disruption level.
   * 
   * @param player - Current player state
   * @returns Current breathing disruption level (NONE if no active effect)
   */
  static getCurrentLevel(player: PlayerState): BreathingDisruptionLevel {
    const activeEffect = this.getActiveEffect(player);
    return activeEffect?.level ?? BreathingDisruptionLevel.NONE;
  }

  /**
   * Check if breathing disruption is active.
   * 
   * @param player - Current player state
   * @returns True if player has active breathing disruption
   */
  static isActive(player: PlayerState): boolean {
    return this.getCurrentLevel(player) !== BreathingDisruptionLevel.NONE;
  }
}
