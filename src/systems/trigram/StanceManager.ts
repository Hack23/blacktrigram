/**
 * ## Stance Manager System
 *
 * **Business Purpose:**
 * Central management system for Korean martial arts stance transitions and
 * trigram-based combat positioning within Black Trigram.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import { TrigramStance, PlayerArchetype } from "../../types/enums";
import type { PlayerState } from "../../types/player";

export interface StanceTransitionRule {
  fromStance: TrigramStance;
  toStance: TrigramStance;
  kiCost: number;
  staminaCost: number;
  transitionTime: number;
  difficulty: number;
}

export interface StanceChangeResult {
  success: boolean;
  newStance: TrigramStance;
  kiCost: number;
  staminaCost: number;
  message?: string;
  player: PlayerState;
}

export class StanceManager {
  private currentStance: TrigramStance = TrigramStance.GEON;
  private transitionRules: Map<string, StanceTransitionRule> = new Map();

  constructor() {
    this.initializeTransitionRules();
  }

  private initializeTransitionRules(): void {
    const stances = Object.values(TrigramStance);
    
    stances.forEach(fromStance => {
      stances.forEach(toStance => {
        if (fromStance !== toStance) {
          const rule: StanceTransitionRule = {
            fromStance,
            toStance,
            kiCost: 10,
            staminaCost: 5,
            transitionTime: 500,
            difficulty: 1,
          };
          
          const key = `${fromStance}_to_${toStance}`;
          this.transitionRules.set(key, rule);
        }
      });
    });
  }

  /**
   * Changes player stance with Korean martial arts validation
   * 
   * @param player - Current player state with resources and stance
   * @param newStance - Target trigram stance to transition to
   * @returns Result indicating success/failure and updated player state
   */
  changeStance(player: PlayerState, newStance: TrigramStance): StanceChangeResult {
    if (this.currentStance === newStance) {
      return {
        success: false,
        newStance: this.currentStance,
        kiCost: 0,
        staminaCost: 0,
        message: "이미 해당 자세입니다",
        player,
      };
    }

    const rule = this.getTransitionRule(this.currentStance, newStance);
    if (!rule) {
      return {
        success: false,
        newStance: this.currentStance,
        kiCost: 0,
        staminaCost: 0,
        message: "유효하지 않은 자세 전환입니다",
        player,
      };
    }

    const cost = this.calculateStanceCost(player, rule);
    if (player.ki < cost.ki || player.stamina < cost.stamina) {
      return {
        success: false,
        newStance: this.currentStance,
        kiCost: cost.ki,
        staminaCost: cost.stamina,
        message: "기력이나 체력이 부족합니다",
        player,
      };
    }

    // Apply stance change
    const updatedPlayer: PlayerState = {
      ...player,
      currentStance: newStance,
      ki: Math.max(0, player.ki - cost.ki),
      stamina: Math.max(0, player.stamina - cost.stamina),
      lastStanceChangeTime: Date.now(),
    };

    this.currentStance = newStance;

    const stanceData = TRIGRAM_STANCES_DATA[newStance];
    return {
      success: true,
      updatedPlayer,
      cost,
      message: `${stanceData.korean} 자세로 전환`,
    };
  }

  /**
   * **Business Logic:** Gets transition rules between stances
   * 
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @returns Transition rule or null if invalid
   * @internal
   */
  private getTransitionRule(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): StanceTransitionRule | null {
    const key = `${fromStance}_to_${toStance}`;
    return this.transitionRules.get(key) || null;
  }

  /**
   * **Business Logic:** Calculates resource cost for stance transition
   * 
   * @param player - Current player state
   * @param rule - Transition rule to apply
   * @returns Resource costs for the transition
   * @internal
   */
  private calculateStanceCost(
    player: PlayerState,
    rule: StanceTransitionRule
  ): {
    ki: number;
    stamina: number;
    timeMilliseconds: number;
  } {
    const baseCost = {
      ki: rule.kiCost,
      stamina: rule.staminaCost,
      timeMilliseconds: rule.transitionTime,
    };

    // Apply player condition modifiers
    const healthPercent = player.health / player.maxHealth;
    const conditionMultiplier = 0.5 + (healthPercent * 0.5); // 0.5x to 1.0x

    return {
      ki: Math.round(baseCost.ki / conditionMultiplier),
      stamina: Math.round(baseCost.stamina / conditionMultiplier),
      timeMilliseconds: Math.round(baseCost.timeMilliseconds / conditionMultiplier),
    };
  }

  /**
   * **Business Logic:** Gets current stance
   */
  getCurrentStance(): TrigramStance {
    return this.currentStance;
  }

  /**
   * **Business Logic:** Resets stance manager to initial state
   */
  reset(stance: TrigramStance = TrigramStance.GEON): void {
    this.currentStance = stance;
  }

  /**
   * **Business Logic:** Gets required level for a stance
   */
  private getStanceRequiredLevel(stance: TrigramStance): number {
    const levelMap: Record<TrigramStance, number> = {
      [TrigramStance.GEON]: 0,
      [TrigramStance.TAE]: 1,
      [TrigramStance.LI]: 2,
      [TrigramStance.JIN]: 3,
      [TrigramStance.SON]: 4,
      [TrigramStance.GAM]: 5,
      [TrigramStance.GAN]: 6,
      [TrigramStance.GON]: 7,
    };

    return levelMap[stance] || 0;
  }

  /**
   * **Business Logic:** Validates if player can change to a specific stance
   */
  canChangeStance(player: PlayerState, newStance: TrigramStance): boolean {
    if (this.currentStance === newStance) {
      return false;
    }

    const rule = this.getTransitionRule(this.currentStance, newStance);
    if (!rule) {
      return false;
    }

    const cost = this.calculateStanceCost(player, rule);
    return player.ki >= cost.ki && player.stamina >= cost.stamina;
  }

  /**
   * **Business Logic:** Gets available stances based on player progression
   */
  getAvailableStances(player: PlayerState): TrigramStance[] {
    const playerLevel = Math.floor((player.experiencePoints || 0) / 100);
    const availableStances: TrigramStance[] = [];

    Object.values(TrigramStance).forEach((stance) => {
      const requiredLevel = this.getStanceRequiredLevel(stance);
      if (playerLevel >= requiredLevel) {
        availableStances.push(stance);
      }
    });

    return availableStances;
  }

  /**
   * **Business Logic:** Calculates stance mastery for archetype combinations
   */
  getStanceMastery(archetype: PlayerArchetype, stance: TrigramStance): number {
    const masteryMap: Record<PlayerArchetype, Partial<Record<TrigramStance, number>>> = {
      [PlayerArchetype.MUSA]: {
        [TrigramStance.GEON]: 1.3,
        [TrigramStance.GAN]: 1.2,
      },
      [PlayerArchetype.AMSALJA]: {
        [TrigramStance.SON]: 1.4,
        [TrigramStance.GAM]: 1.2,
      },
      [PlayerArchetype.HACKER]: {
        [TrigramStance.LI]: 1.3,
        [TrigramStance.JIN]: 1.1,
      },
      [PlayerArchetype.JEONGBO_YOWON]: {
        [TrigramStance.TAE]: 1.2,
        [TrigramStance.GAM]: 1.3,
      },
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
        [TrigramStance.JIN]: 1.3,
        [TrigramStance.GON]: 1.2,
      },
    };

    return masteryMap[archetype]?.[stance] || 1.0;
  }
}

export default StanceManager;
    };

    // Apply player condition modifiers
    const healthPercent = player.health / player.maxHealth;
    const conditionMultiplier = 0.5 +
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @returns Transition rule or null if invalid
   * @internal
   */
  private getTransitionRule(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): StanceTransitionRule | null {
    const ruleKey = `${fromStance}_to_${toStance}`;
    return this.transitionRules.get(ruleKey) || null;
  }

  /**
   * **Business Logic:** Calculates resource cost for stance transition
   * 
   * @param player - Current player state
   * @param rule - Transition rule to apply
   * @returns Resource costs for the transition
   * @internal
   */
  private calculateStanceCost(
    player: PlayerState,
    rule: StanceTransitionRule
  ): {
    ki: number;
    stamina: number;
    timeMilliseconds: number;
  } {
    const baseCost = {
      ki: rule.kiCost,
      stamina: rule.staminaCost,
      timeMilliseconds: rule.transitionTime,
    };

    // Apply player condition modifiers
    const healthPercent = player.health / player.maxHealth;
    const conditionMultiplier = 0.5 + (healthPercent * 0.5); // 0.5x to 1.0x

    return {
      ki: Math.round(baseCost.ki / conditionMultiplier),
      stamina: Math.round(baseCost.stamina / conditionMultiplier),
      timeMilliseconds: Math.round(baseCost.timeMilliseconds / conditionMultiplier),
    };
  }

  /**
   * **Business Logic:** Gets current stance
   * 
   * @returns Current trigram stance
   */
  getCurrentStance(): TrigramStance {
    return this.currentStance;
  }

  /**
   * **Business Logic:** Resets stance manager to initial state
   * 
   * @param stance - Initial stance to set (defaults to Heaven)
   */
  reset(stance: TrigramStance = TrigramStance.GEON): void {
    this.currentStance = stance;
  }
}

export default StanceManager;
      };
    }

    // Apply stance change
    const updatedPlayer: PlayerState = {
      ...player,
      currentStance: newStance,
      ki: Math.max(0, player.ki - cost.ki),
      stamina: Math.max(0, player.stamina - cost.stamina),
      lastStanceChangeTime: Date.now(),
    };

    this.currentStance = newStance;

    const stanceData = TRIGRAM_STANCES_DATA[newStance];
    return {
      success: true,
      updatedPlayer,
      cost,
      message: `${stanceData.korean} 자세로 전환`,
    };
  }

  /**
   * **Business Logic:** Checks if stance change is possible without actually executing it
   *
   * @param player - Current player state
   * @param newStance - Target stance to validate
   * @returns Whether the stance change is currently possible
   */
  canChangeStance(player: PlayerState, newStance: TrigramStance): boolean {
    if (player.currentStance === newStance) return true;

    const transitionRule = this.getTransitionRule(
      player.currentStance,
      newStance
    );
    if (!transitionRule) return false;

    const cost = this.calculateStanceCost(player, transitionRule);
    const timeSinceLastChange = Date.now() - player.lastStanceChangeTime;

    return (
      timeSinceLastChange >= transitionRule.minCooldown &&
      player.ki >= cost.ki &&
      player.stamina >= cost.stamina
    );
  }

  /**
   * **Business Logic:** Gets available stance options for current player state
   *
   * @param player - Current player state
   * @returns Array of stances that can be transitioned to
   */
  getAvailableStances(player: PlayerState): TrigramStance[] {
    return Object.values(TrigramStance).filter((stance) =>
      this.canChangeStance(player, stance)
    );
  }

  /**
   * **Business Logic:** Calculates stance mastery bonus for archetype
   *
   * @param archetype - Player's martial arts archetype
   * @param stance - Trigram stance to check mastery for
   * @returns Bonus multiplier for stance effectiveness
   */
  getStanceMastery(archetype: PlayerArchetype, stance: TrigramStance): number {
    const masteryMap: Record<
      PlayerArchetype,
      Partial<Record<TrigramStance, number>>
    > = {
      [PlayerArchetype.MUSA]: {
        [TrigramStance.GEON]: 1.3, // Warriors excel at Heaven stance
        [TrigramStance.GAN]: 1.2, // Strong Mountain defense
      },
      [PlayerArchetype.AMSALJA]: {
        [TrigramStance.SON]: 1.4, // Assassins master Wind techniques
        [TrigramStance.GAM]: 1.2, // Water flow for stealth
      },
      [PlayerArchetype.HACKER]: {
        [TrigramStance.LI]: 1.3, // Fire for precision strikes
        [TrigramStance.JIN]: 1.2, // Thunder for disruption
      },
      [PlayerArchetype.JEONGBO_YOWON]: {
        [TrigramStance.GAM]: 1.3, // Water for adaptability
        [TrigramStance.TAE]: 1.2, // Lake for information flow
      },
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
        [TrigramStance.GON]: 1.2, // Earth for brutal efficiency
        [TrigramStance.JIN]: 1.2, // Thunder for intimidation
      },
    };

    return masteryMap[archetype][stance] || 1.0;
  }

  /**
   * **Business Logic:** Finds transition rule between two stances
   *
   * @private
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @returns Transition rule if valid, null otherwise
   */
  private getTransitionRule(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): StanceTransitionRule | null {
    return (
      STANCE_TRANSITION_RULES.find(
        (rule) => rule.fromStance === fromStance && rule.toStance === toStance
      ) || null
    );
  }

  /**
   * **Business Logic:** Calculates actual resource cost for stance change
   *
   * @private
   * @param player - Current player state
   * @param rule - Base transition rule
   * @returns Actual cost accounting for player condition and archetype
   */
  private calculateStanceCost(
    player: PlayerState,
    rule: StanceTransitionRule
  ): {
    ki: number;
    stamina: number;
    timeMilliseconds: number;
  } {
    // Base costs from rule
    let kiCost = rule.kiCost;
    let staminaCost = rule.staminaCost;
    let timeCost = rule.minCooldown;

    // Archetype modifiers
    const mastery = this.getStanceMastery(player.archetype, rule.toStance);
    if (mastery > 1.0) {
      kiCost = Math.floor(kiCost * 0.8); // 20% discount for mastered stances
      staminaCost = Math.floor(staminaCost * 0.8);
      timeCost = Math.floor(timeCost * 0.9); // Faster transitions
    }

    // Fatigue penalty - higher costs when resources are low
    const kiPercentage = player.ki / player.maxKi;
    const staminaPercentage = player.stamina / player.maxStamina;

    if (kiPercentage < 0.3) {
      kiCost = Math.ceil(kiCost * 1.5);
    }
    if (staminaPercentage < 0.3) {
      staminaCost = Math.ceil(staminaCost * 1.5);
    }

    return {
      ki: kiCost,
      stamina: staminaCost,
      timeMilliseconds: timeCost,
    };
  }

  /**
   * **Business Logic:** Gets current stance
   *
   * @returns Current trigram stance
   */
  getCurrentStance(): TrigramStance {
    return this.currentStance;
  }

  /**
   * **Business Logic:** Resets manager to initial state
   *
   * @param stance - Stance to reset to (default: Heaven)
   */
  reset(stance: TrigramStance = TrigramStance.GEON): void {
    this.currentStance = stance;
  }
}

export default StanceManager;
