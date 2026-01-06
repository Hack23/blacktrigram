import { TrigramStance } from "../../types";
import { TrigramStance as TrigramStanceEnum } from "../../types/common";
import { PlayerState } from "../player";
import { TrigramTransitionCost, TrigramTransitionRule } from "./types";
import { 
  calculateStanceDistance, 
  determineTransitionType,
  getStanceTransition,
  type StanceTransitionType 
} from "../animation/AnimationTransitions";

/**
 * Calculator for trigram stance transition costs and validation
 * 
 * **Korean**: 자세 전환 계산기
 * 
 * Calculates costs, paths, and validation for transitions between trigram stances.
 * Integrates with the animation system's stance transition matrix.
 * 
 * @category Trigram System
 * @korean 자세전환계산기
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
   * 
   * **Korean**: 자세 전환 비용 계산
   * 
   * Calculates ki, stamina, and time costs based on stance distance.
   * Uses animation system's transition configurations for accurate timing.
   * 
   * @param from - Source stance
   * @param to - Target stance
   * @returns Transition cost breakdown
   * 
   * @korean 자세전환비용계산
   */
  static calculateCost(
    from: TrigramStance,
    to: TrigramStance
  ): TrigramTransitionCost {
    if (from === to) {
      return { ki: 0, stamina: 0, timeMilliseconds: 0 };
    }

    // Get transition from animation system for accurate timing
    const transition = getStanceTransition(from, to);
    const timeMs = transition?.duration ?? 600;

    const baseCost = { ki: 15, stamina: 10, timeMilliseconds: timeMs };
    const modifier = this.getAdjacencyModifier(from, to);

    return {
      ki: Math.floor(baseCost.ki * modifier),
      stamina: Math.floor(baseCost.stamina * modifier),
      timeMilliseconds: timeMs, // Use actual transition duration
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
   * 
   * **Korean**: 인접도 수정자
   * 
   * Uses the animation system's distance calculation for consistency.
   * Adjacent stances (distance 1) get 0.7x cost, others get 1.0x cost.
   * 
   * @param from - Source stance
   * @param to - Target stance
   * @returns Cost modifier (0.7 for adjacent, 1.0 for distant)
   * 
   * @korean 인접도수정자
   */
  private static getAdjacencyModifier(
    from: TrigramStance,
    to: TrigramStance
  ): number {
    const distance = calculateStanceDistance(from, to);
    
    // Adjacent stances (distance 1) have reduced cost
    if (distance === 1) return 0.7;
    
    // Near-adjacent (distance 2) have slightly reduced cost
    if (distance === 2) return 0.85;
    
    // Distant/opposite stances have full cost
    return 1.0;
  }

  /**
   * Get the shortest transition path between stances
   * 
   * **Korean**: 최단 전환 경로
   * 
   * For direct transitions, returns [from, to].
   * For indirect transitions, may include intermediate stances for smoother animation.
   * 
   * @param from - Source stance
   * @param to - Target stance
   * @returns Array of stances in transition path
   * 
   * @example
   * ```typescript
   * // Adjacent stances - direct path
   * getTransitionPath(TrigramStance.GEON, TrigramStance.TAE);
   * // Returns: ["geon", "tae"]
   * 
   * // Opposite stances - may use intermediate
   * getTransitionPath(TrigramStance.GEON, TrigramStance.GON);
   * // Returns: ["geon", "gon"] (direct is shortest even though opposite)
   * ```
   * 
   * @korean 최단전환경로
   */
  static getTransitionPath(
    from: TrigramStance,
    to: TrigramStance
  ): TrigramStance[] {
    if (from === to) return [from];
    
    // For all transitions, direct path is used
    // The animation system handles the complexity with keyframes
    return [from, to];
  }
  
  /**
   * Get transition type for a stance change
   * 
   * **Korean**: 전환 유형 가져오기
   * 
   * Determines if transition is direct (adjacent), indirect (opposite), or self.
   * 
   * @param from - Source stance
   * @param to - Target stance
   * @returns Transition type classification
   * 
   * @korean 전환유형가져오기
   */
  static getTransitionType(
    from: TrigramStance,
    to: TrigramStance
  ): StanceTransitionType {
    return determineTransitionType(from, to);
  }
  
  /**
   * Calculate stance distance around the wheel
   * 
   * **Korean**: 자세 거리 계산
   * 
   * Returns the number of steps between stances on the octagonal wheel.
   * 
   * @param from - Source stance
   * @param to - Target stance
   * @returns Distance (0-4)
   * 
   * @korean 자세거리계산
   */
  static getStanceDistance(
    from: TrigramStance,
    to: TrigramStance
  ): number {
    return calculateStanceDistance(from, to);
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
