import { TrigramStance } from "../types/enums";
import type { PlayerState } from "../types/player";
import type { TrigramTransitionCost } from "../types";
import { PLAYER_ARCHETYPES_DATA } from "../types/constants/player";

import { TrigramCalculator } from "./trigram/TrigramCalculator";
import { TRIGRAM_STANCES_ORDER } from "../types/constants";

export class TrigramSystem {
  private calculator: TrigramCalculator;

  constructor() {
    this.calculator = new TrigramCalculator();
  }

  /**
   * Check if player can transition to a new stance
   */
  canTransitionTo(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    player: PlayerState
  ): boolean {
    if (fromStance === toStance) {
      return true;
    }

    const cost = this.getTransitionCost(fromStance, toStance);

    // Fix: Use nullish coalescing for safer property access
    const playerKi = player.ki ?? 100;
    const playerStamina = player.stamina ?? 100;

    return playerKi >= cost.ki && playerStamina >= cost.stamina;
  }

  /**
   * Recommend optimal stance against opponent
   */
  recommendStance(player: PlayerState): TrigramStance {
    const from = player.currentStance;
    let best = from;
    let bestScore = Infinity;

    for (const to of TRIGRAM_STANCES_ORDER) {
      const costObj: TrigramTransitionCost = this.getTransitionCost(from, to);
      const score = costObj.ki + costObj.stamina + costObj.timeMilliseconds;
      if (score < bestScore) {
        bestScore = score;
        best = to;
      }
    }

    return best;
  }

  /**
   * Get transition cost between stances
   */
  public getTransitionCost(
    from: TrigramStance,
    to: TrigramStance,
    player?: PlayerState
  ): TrigramTransitionCost {
    if (from === to) {
      return {
        ki: 0,
        stamina: 0,
        timeMilliseconds: 0, // neutral
      };
    }

    const difficulty = TrigramCalculator.calculateTransitionDifficulty(
      from,
      to
    );
    const baseCost = 10;
    const baseTime = 500;

    let ki = Math.ceil(baseCost * difficulty);
    let stamina = Math.ceil(baseCost * difficulty * 1.5);

    // apply archetype stance‐change cost modifier if player provided
    if (player) {
      const archData = PLAYER_ARCHETYPES_DATA[player.archetype];
      const favs = archData.favoredStances || [];
      const mod = favs.includes(to) ? 0.8 : 1.0;
      ki = Math.ceil(ki * mod);
      stamina = Math.ceil(stamina * mod);
    }

    return {
      ki,
      stamina,
      timeMilliseconds: Math.ceil(baseTime * difficulty),
    };
  }

  /**
   * Calculate stance effectiveness
   */
  calculateStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return this.calculator.calculateStanceEffectiveness(
      attackerStance,
      defenderStance
    );
  }

  /**
   * Get stance name in Korean and English
   */
  getStanceName(stance: TrigramStance): { korean: string; english: string } {
    const stanceNames = {
      [TrigramStance.GEON]: { korean: "건", english: "Heaven" },
      [TrigramStance.TAE]: { korean: "태", english: "Lake" },
      [TrigramStance.LI]: { korean: "리", english: "Fire" },
      [TrigramStance.JIN]: { korean: "진", english: "Thunder" },
      [TrigramStance.SON]: { korean: "손", english: "Wind" },
      [TrigramStance.GAM]: { korean: "감", english: "Water" },
      [TrigramStance.GAN]: { korean: "간", english: "Mountain" },
      [TrigramStance.GON]: { korean: "곤", english: "Earth" },
    };

    return stanceNames[stance] || { korean: "Unknown", english: "Unknown" };
  }

  /**
   * Get current stance data
   */
  getCurrentStanceData(stance: TrigramStance): any {
    const stanceName = this.getStanceName(stance);
    return {
      id: stance,
      name: stanceName,
      korean: stanceName.korean,
      english: stanceName.english,
    };
  }

  /**
   * Validate transition with detailed feedback
   */
  validateTransition(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    player: PlayerState
  ): { valid: boolean; reason?: string } {
    if (fromStance === toStance) {
      return { valid: true };
    }

    const cost = this.getTransitionCost(fromStance, toStance, player);

    if (player.ki < cost.ki) {
      return {
        valid: false,
        reason: `Insufficient Ki: need ${cost.ki}, have ${player.ki}`,
      };
    }

    if (player.stamina < cost.stamina) {
      return {
        valid: false,
        reason: `Insufficient Stamina: need ${cost.stamina}, have ${player.stamina}`,
      };
    }

    return { valid: true };
  }
}

export default TrigramSystem;
