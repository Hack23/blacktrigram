/**
 * @fileoverview Stance Manager for Korean Martial Arts Eight Trigram System
 * @description Manages trigram stance transitions, effectiveness calculations, and Korean martial arts mechanics
 */

import type { PlayerState } from "../../types/player";
import type { TrigramStance } from "../../types/enums";
import type { StanceBonuses, StanceTransition } from "../../types/trigram";
import { TRIGRAM_DATA } from "../../types/constants/trigram";

/**
 * @class StanceManager
 * @description Manages the eight trigram stance system for Korean martial arts combat
 *
 * Handles:
 * - Stance effectiveness calculations using I Ching principles
 * - Transition costs and timing validation
 * - Korean martial arts stance bonuses and penalties
 * - Traditional eight trigram philosophy integration
 */
export class StanceManager {
  /** Stance change cooldown in milliseconds */
  private readonly stanceChangeCooldown: number = 1000;

  /** Last stance change timestamps per player */
  private readonly lastStanceChanges: Map<string, number> = new Map();

  /**
   * @constructor
   * Initializes the stance manager with Korean martial arts principles
   */
  constructor() {
    // Initialize with traditional Korean martial arts timing
  }

  /**
   * @method getStanceEffectiveness
   * @description Calculates stance effectiveness using traditional Korean martial arts and I Ching principles
   *
   * @param attackerStance - The attacker's current trigram stance
   * @param defenderStance - The defender's current trigram stance
   * @returns Effectiveness multiplier (0.5 to 2.0)
   *
   * @example
   * ```typescript
   * const effectiveness = stanceManager.getStanceEffectiveness(
   *   TrigramStance.GEON, // Heaven ☰
   *   TrigramStance.GON   // Earth ☷
   * );
   * // Returns 1.8 (Heaven overcomes Earth in traditional philosophy)
   * ```
   */
  public getStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    const attackerData = TRIGRAM_DATA[attackerStance];
    const defenderData = TRIGRAM_DATA[defenderStance];

    if (!attackerData || !defenderData) {
      return 1.0; // Neutral effectiveness if data missing
    }

    // Get effectiveness from trigram data
    const effectiveness = attackerData.effectiveness[defenderStance];

    if (effectiveness !== undefined) {
      return effectiveness;
    }

    // Default to neutral effectiveness
    return 1.0;
  }

  /**
   * @method getStanceBonuses
   * @description Retrieves stance-specific bonuses for Korean martial arts combat
   *
   * @param stance - The trigram stance to get bonuses for
   * @returns StanceBonuses object with combat modifiers
   */
  public getStanceBonuses(stance: TrigramStance): StanceBonuses {
    const stanceData = TRIGRAM_DATA[stance];

    if (!stanceData) {
      // Default neutral bonuses
      return {
        attack: 1.0,
        defense: 1.0,
        speed: 1.0,
        balance: 1.0,
        kiRegeneration: 1.0,
        staminaRegeneration: 1.0,
      };
    }

    return stanceData.bonuses;
  }

  /**
   * @method validateStanceTransition
   * @description Validates if a stance transition is allowed according to Korean martial arts principles
   *
   * @param player - The player attempting the stance change
   * @param newStance - The desired new stance
   * @param currentTime - Current timestamp in milliseconds
   * @returns Validation result with success status and reason
   */
  public validateStanceTransition(
    player: PlayerState,
    newStance: TrigramStance,
    currentTime: number = Date.now()
  ): { valid: boolean; reason?: string; cost: number } {
    // Check if player is already in the desired stance
    if (player.currentStance === newStance) {
      return {
        valid: false,
        reason: "이미 해당 자세입니다 - Already in that stance",
        cost: 0,
      };
    }

    // Check cooldown period
    const lastChange = this.lastStanceChanges.get(player.id) || 0;
    const timeSinceLastChange = currentTime - lastChange;

    if (timeSinceLastChange < this.stanceChangeCooldown) {
      const remaining = this.stanceChangeCooldown - timeSinceLastChange;
      return {
        valid: false,
        reason: `자세 변경 대기 중... ${Math.ceil(
          remaining / 1000
        )}초 - Stance change cooldown: ${Math.ceil(remaining / 1000)}s`,
        cost: 0,
      };
    }

    // Calculate transition cost
    const transitionCost = this.calculateTransitionCost(
      player.currentStance,
      newStance
    );

    // Check if player has sufficient resources
    if (player.ki < transitionCost.ki) {
      return {
        valid: false,
        reason: "기력 부족 - Insufficient Ki",
        cost: transitionCost.ki,
      };
    }

    if (player.stamina < transitionCost.stamina) {
      return {
        valid: false,
        reason: "체력 부족 - Insufficient Stamina",
        cost: transitionCost.stamina,
      };
    }

    // Check if player is in a state that prevents stance changes
    if (player.isStunned) {
      return {
        valid: false,
        reason:
          "기절 상태로 자세 변경 불가 - Cannot change stance while stunned",
        cost: transitionCost.ki,
      };
    }

    if (player.consciousness < 20) {
      return {
        valid: false,
        reason:
          "의식 불명으로 자세 변경 불가 - Cannot change stance while unconscious",
        cost: transitionCost.ki,
      };
    }

    return {
      valid: true,
      cost: transitionCost.ki,
    };
  }

  /**
   * @method calculateTransitionCost
   * @description Calculates the Ki and Stamina cost for transitioning between stances
   *
   * @param fromStance - Current stance
   * @param toStance - Desired stance
   * @returns Resource costs for the transition
   */
  public calculateTransitionCost(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): { ki: number; stamina: number } {
    const fromData = TRIGRAM_DATA[fromStance];
    const toData = TRIGRAM_DATA[toStance];

    if (!fromData || !toData) {
      // Default transition cost
      return { ki: 10, stamina: 15 };
    }

    // Base cost from target stance
    const baseCost = toData.transitionCost || { ki: 10, stamina: 15 };

    // Calculate philosophical distance between stances
    // Opposite stances (like Heaven ☰ and Earth ☷) cost more
    const stanceOrder = [
      "geon",
      "tae",
      "li",
      "jin",
      "son",
      "gam",
      "gan",
      "gon",
    ];

    const fromIndex = stanceOrder.indexOf(fromStance);
    const toIndex = stanceOrder.indexOf(toStance);

    if (fromIndex === -1 || toIndex === -1) {
      return baseCost;
    }

    // Calculate circular distance (shortest path around the octagon)
    const directDistance = Math.abs(toIndex - fromIndex);
    const wrapDistance = 8 - directDistance;
    const distance = Math.min(directDistance, wrapDistance);

    // Increase cost based on philosophical distance
    const distanceMultiplier = 1 + distance * 0.2;

    return {
      ki: Math.round(baseCost.ki * distanceMultiplier),
      stamina: Math.round(baseCost.stamina * distanceMultiplier),
    };
  }

  /**
   * @method executeStanceChange
   * @description Executes a validated stance change and updates player state
   *
   * @param player - The player changing stance
   * @param newStance - The new stance to adopt
   * @param currentTime - Current timestamp
   * @returns Updated player state with new stance and resource costs applied
   */
  public executeStanceChange(
    player: PlayerState,
    newStance: TrigramStance,
    currentTime: number = Date.now()
  ): PlayerState {
    // Validate the transition first
    const validation = this.validateStanceTransition(
      player,
      newStance,
      currentTime
    );

    if (!validation.valid) {
      throw new Error(validation.reason || "Stance transition not allowed");
    }

    // Calculate costs
    const costs = this.calculateTransitionCost(player.currentStance, newStance);

    // Record stance change time
    this.lastStanceChanges.set(player.id, currentTime);

    // Return updated player state
    return {
      ...player,
      currentStance: newStance,
      ki: Math.max(0, player.ki - costs.ki),
      stamina: Math.max(0, player.stamina - costs.stamina),
      lastActionTime: currentTime,
    };
  }

  /**
   * @method getAvailableTechniques
   * @description Gets available techniques for the current stance
   *
   * @param stance - The current stance
   * @returns Array of technique IDs available for this stance
   */
  public getAvailableTechniques(stance: TrigramStance): readonly string[] {
    const stanceData = TRIGRAM_DATA[stance];

    if (!stanceData || !stanceData.techniques) {
      return [];
    }

    const techniques: string[] = [];

    if (stanceData.techniques.primary) {
      techniques.push(`${stance}_primary`);
    }

    if (stanceData.techniques.secondary) {
      techniques.push(`${stance}_secondary`);
    }

    if (stanceData.techniques.special) {
      techniques.push(`${stance}_special`);
    }

    return techniques;
  }

  /**
   * @method canChangeStance
   * @description Quick check if player can change stance right now
   */
  public canChangeStance(player: PlayerState, currentTime: number): boolean {
    if (player.isStunned || player.consciousness < 20) {
      return false;
    }

    const lastChange = this.lastStanceChanges.get(player.id) || 0;
    const timeSinceLastChange = currentTime - lastChange;

    return timeSinceLastChange >= this.stanceChangeCooldown;
  }
}
