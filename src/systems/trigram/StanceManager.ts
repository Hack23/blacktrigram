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

    stances.forEach((fromStance) => {
      stances.forEach((toStance) => {
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
  changeStance(
    player: PlayerState,
    newStance: TrigramStance
  ): StanceChangeResult {
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
   * **Business Logic:** Validates if a stance transition is possible
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @returns Transition rule or null if invalid
   * @internal
   */
  private getTransitionRule(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): StanceTransitionRule | null {
    return (
      this.transitionRules.find(
        (rule) => rule.from === fromStance && rule.to === toStance
      ) || null
    );
  }

  /**
   * **Business Logic:** Calculates cost and requirements for stance change
   */
  private calculateStanceCost(
    player: PlayerState,
    rule: StanceTransitionRule
  ): {
    readonly kiCost: number;
    readonly staminaCost: number;
    readonly canAfford: boolean;
  } {
    const kiCost =
      rule.baseCost.ki *
      this.getDifficultyMultiplier(player.archetype, rule.to);
    const staminaCost =
      rule.baseCost.stamina *
      this.getDifficultyMultiplier(player.archetype, rule.to);

    return {
      kiCost,
      staminaCost,
      canAfford: player.ki >= kiCost && player.stamina >= staminaCost,
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
   * **Business Logic:** Checks if player can change to a specific stance
   */
  canChangeStance(player: PlayerState, newStance: TrigramStance): boolean {
    if (player.currentStance === newStance) {
      return false; // Already in this stance
    }

    const rule = this.getTransitionRule(player.currentStance, newStance);
    if (!rule) {
      return false; // No valid transition rule
    }

    const cost = this.calculateStanceCost(player, rule);
    if (!cost.canAfford) {
      return false; // Insufficient resources
    }

    return true;
  }

  /**
   * **Business Logic:** Gets all available stances for current player state
   */
  getAvailableStances(player: PlayerState): TrigramStance[] {
    return Object.values(TrigramStance).filter((stance) =>
      this.canChangeStance(player, stance)
    );
  }

  /**
   * **Business Logic:** Gets stance mastery level for archetype
   */
  getStanceMastery(archetype: PlayerArchetype, stance: TrigramStance): number {
    const archetypeData = PLAYER_ARCHETYPE_STANCE_AFFINITIES[archetype];
    if (!archetypeData) {
      return 0.5; // Default mastery
    }

    switch (stance) {
      case TrigramStance.GEON:
        return archetypeData.geon;
      case TrigramStance.TAE:
        return archetypeData.tae;
      case TrigramStance.LI:
        return archetypeData.li;
      case TrigramStance.JIN:
        return archetypeData.jin;
      case TrigramStance.SON:
        return archetypeData.son;
      case TrigramStance.GAM:
        return archetypeData.gam;
      case TrigramStance.GAN:
        return archetypeData.gan;
      case TrigramStance.GON:
        return archetypeData.gon;
      default:
        return 0.5;
    }
  }
}

export default StanceManager;
