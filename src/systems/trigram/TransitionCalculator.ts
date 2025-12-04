import { TrigramStance } from "../../types";
import { TrigramStance as TrigramStanceEnum } from "../../types/common";
import { PlayerState } from "../player";
import { TrigramTransitionCost, TrigramTransitionRule } from "./types";

/**
 * Calculator for trigram stance transition costs and validation
 */
export class TransitionCalculator {
  private calculateBaseCost(
    from: TrigramStance,
    to: TrigramStance
  ): TrigramTransitionCost {
    if (from === to) {
      return { ki: 0, stamina: 0, timeMilliseconds: 0 };
    }

    return { ki: 10, stamina: 15, timeMilliseconds: 500 };
  }

  generateTransitionRule(
    from: TrigramStance,
    to: TrigramStance
  ): TrigramTransitionRule {
    const cost = this.calculateBaseCost(from, to);

    return {
      from,
      to,
      cost,
      effectiveness: 1.0, // Fix: Add missing effectiveness property
      conditions: [],
      description: {
        korean: `${from}에서 ${to}로 전환`,
        english: `Transition from ${from} to ${to}`,
      },
    };
  }

  /**
   * Calculate the cost of transitioning between stances
   */
  static calculateCost(
    from: TrigramStance,
    to: TrigramStance
  ): TrigramTransitionCost {
    if (from === to) {
      return { ki: 0, stamina: 0, timeMilliseconds: 0 }; // Fix property name
    }

    const baseCost = { ki: 15, stamina: 10, timeMilliseconds: 500 };
    const modifier = this.getAdjacencyModifier(from, to);

    return {
      ki: Math.floor(baseCost.ki * modifier),
      stamina: Math.floor(baseCost.stamina * modifier),
      timeMilliseconds: Math.floor(baseCost.timeMilliseconds * modifier), // Fix property name
    };
  }

  /**
   * Check if a transition is valid for a player
   */
  static canTransition(
    from: TrigramStance,
    to: TrigramStance,
    player: PlayerState
  ): boolean {
    const cost = this.calculateCost(from, to);
    return player.ki >= cost.ki && player.stamina >= cost.stamina;
  }

  /**
   * Check if transition is valid based on player state
   */
  static isTransitionValid(
    from: TrigramStance,
    to: TrigramStance,
    player: PlayerState
  ): boolean {
    return this.canTransition(from, to, player);
  }

  /**
   * Get Ki cost for transition
   */
  static getKiCost(
    from: TrigramStance,
    to: TrigramStance,
    _player: PlayerState
  ): number {
    return this.calculateCost(from, to).ki;
  }

  /**
   * Get Stamina cost for transition
   */
  static getStaminaCost(
    from: TrigramStance,
    to: TrigramStance,
    _player: PlayerState
  ): number {
    return this.calculateCost(from, to).stamina;
  }

  /**
   * Get transition time
   */
  static getTransitionTime(
    from: TrigramStance,
    to: TrigramStance,
    _player: PlayerState
  ): number {
    return this.calculateCost(from, to).timeMilliseconds; // Fix property name
  }

  /**
   * Get adjacency modifier for stance transitions
   */
  private static getAdjacencyModifier(
    from: TrigramStance,
    to: TrigramStance
  ): number {
    const adjacencyMap: Record<TrigramStance, TrigramStance[]> = {
      [TrigramStanceEnum.GEON]: [TrigramStanceEnum.TAE, TrigramStanceEnum.GON],
      [TrigramStanceEnum.TAE]: [TrigramStanceEnum.GEON, TrigramStanceEnum.LI],
      [TrigramStanceEnum.LI]: [TrigramStanceEnum.TAE, TrigramStanceEnum.JIN],
      [TrigramStanceEnum.JIN]: [TrigramStanceEnum.LI, TrigramStanceEnum.SON],
      [TrigramStanceEnum.SON]: [TrigramStanceEnum.JIN, TrigramStanceEnum.GAM],
      [TrigramStanceEnum.GAM]: [TrigramStanceEnum.SON, TrigramStanceEnum.GAN],
      [TrigramStanceEnum.GAN]: [TrigramStanceEnum.GAM, TrigramStanceEnum.GON],
      [TrigramStanceEnum.GON]: [TrigramStanceEnum.GAN, TrigramStanceEnum.GEON],
    };

    return adjacencyMap[from]?.includes(to) ? 0.7 : 1.0;
  }

  /**
   * Get the shortest transition path between stances
   */
  static getTransitionPath(
    from: TrigramStance,
    to: TrigramStance
  ): TrigramStance[] {
    if (from === to) return [from];
    return [from, to];
  }

  /**
   * Calculate total cost for a transition path
   */
  static calculatePathCost(path: TrigramStance[]): TrigramTransitionCost {
    if (path.length <= 1) {
      return { ki: 0, stamina: 0, timeMilliseconds: 0 }; // Fix: Use timeMilliseconds
    }

    const totalCost = { ki: 0, stamina: 0, timeMilliseconds: 0 };

    for (let i = 0; i < path.length - 1; i++) {
      const stepCost = this.calculateCost(path[i], path[i + 1]);
      totalCost.ki += stepCost.ki;
      totalCost.stamina += stepCost.stamina;
      totalCost.timeMilliseconds += stepCost.timeMilliseconds;
    }

    return totalCost;
  }

  /**
   * Get all valid transitions from a stance
   */
  static getValidTransitions(
    from: TrigramStance,
    player: PlayerState
  ): TrigramTransitionRule[] {
    const transitions: TrigramTransitionRule[] = [];

    for (const to of Object.values(TrigramStanceEnum)) {
      if (this.isTransitionValid(from, to, player)) {
        const cost = this.calculateCost(from, to);

        transitions.push({
          from,
          to,
          cost,
          effectiveness: 1.0, // Add missing property
          conditions: [],
          description: {
            korean: `${from}에서 ${to}로`,
            english: `From ${from} to ${to}`,
          },
        });
      }
    }

    return transitions;
  }
}
