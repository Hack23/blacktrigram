import { TrigramStance, PlayerArchetype } from "../../types/enums";
import type { PlayerState } from "../../types/player";

/**
 * ## Transition Calculator System
 *
 * **Business Purpose:**
 * Manages the complex calculations for Korean martial arts stance transitions
 * within Black Trigram's combat system. Handles:
 * - Resource cost calculations for stance changes
 * - Transition timing and cooldown management
 * - Archetype-specific transition bonuses and penalties
 * - Optimal path finding between distant stances
 *
 * **Korean Martial Arts Integration:**
 * - Implements authentic Korean martial arts energy flow principles
 * - Respects traditional Korean martial arts stance progression
 * - Maintains cultural accuracy in transition timing
 * - Provides realistic Korean martial arts combat rhythm
 *
 * **Technical Architecture:**
 * - Efficient algorithms for real-time transition calculations
 * - Cached transition rules for performance optimization
 * - Extensible design supporting new stance mechanics
 * - Integration with combat system for seamless gameplay
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

export interface TransitionCost {
  readonly ki: number;
  readonly stamina: number;
  readonly time: number;
}

export class TransitionCalculator {
  private static readonly BASE_TRANSITION_COSTS = new Map([
    // Adjacent transitions (easy)
    [
      `${TrigramStance.GEON}-${TrigramStance.TAE}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.TAE}-${TrigramStance.LI}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.LI}-${TrigramStance.JIN}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.JIN}-${TrigramStance.SON}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.SON}-${TrigramStance.GAM}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.GAM}-${TrigramStance.GAN}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.GAN}-${TrigramStance.GON}`,
      { ki: 5, stamina: 3, time: 500 },
    ],
    [
      `${TrigramStance.GON}-${TrigramStance.GEON}`,
      { ki: 5, stamina: 3, time: 500 },
    ],

    // Opposite transitions (hard)
    [
      `${TrigramStance.GEON}-${TrigramStance.GON}`,
      { ki: 20, stamina: 15, time: 1500 },
    ],
    [
      `${TrigramStance.TAE}-${TrigramStance.SON}`,
      { ki: 20, stamina: 15, time: 1500 },
    ],
    [
      `${TrigramStance.LI}-${TrigramStance.GAM}`,
      { ki: 20, stamina: 15, time: 1500 },
    ],
    [
      `${TrigramStance.JIN}-${TrigramStance.GAN}`,
      { ki: 20, stamina: 15, time: 1500 },
    ],
  ]);

  private static readonly ARCHETYPE_MASTERY = new Map([
    [PlayerArchetype.MUSA, new Set([TrigramStance.GEON, TrigramStance.GAN])],
    [PlayerArchetype.AMSALJA, new Set([TrigramStance.SON, TrigramStance.GAM])],
    [PlayerArchetype.HACKER, new Set([TrigramStance.LI, TrigramStance.JIN])],
    [
      PlayerArchetype.JEONGBO_YOWON,
      new Set([TrigramStance.GAM, TrigramStance.TAE]),
    ],
    [
      PlayerArchetype.JOJIK_POKRYEOKBAE,
      new Set([TrigramStance.GON, TrigramStance.JIN]),
    ],
  ]);

  /**
   * **Business Logic:** Calculates resource cost for stance transition
   *
   * @param player - Current player state
   * @param targetStance - Desired target stance
   * @returns Transition cost breakdown
   */
  calculateTransitionCost(
    player: PlayerState,
    targetStance: TrigramStance
  ): TransitionCost {
    const transitionKey = `${player.currentStance}-${targetStance}`;
    const reverseKey = `${targetStance}-${player.currentStance}`;

    let baseCost = TransitionCalculator.BASE_TRANSITION_COSTS.get(
      transitionKey
    ) ||
      TransitionCalculator.BASE_TRANSITION_COSTS.get(reverseKey) || {
        ki: 10,
        stamina: 7,
        time: 1000,
      }; // Default diagonal cost

    // Apply archetype mastery bonus
    const mastery = this.getArchetypeMastery(player.archetype, targetStance);
    const masteryMultiplier = mastery > 1.0 ? 0.7 : 1.0;

    // Apply fatigue penalty
    const fatigueMultiplier = this.calculateFatigueMultiplier(player);

    return {
      ki: Math.ceil(baseCost.ki * masteryMultiplier * fatigueMultiplier),
      stamina: Math.ceil(
        baseCost.stamina * masteryMultiplier * fatigueMultiplier
      ),
      time: Math.ceil(baseCost.time * masteryMultiplier),
    };
  }

  /**
   * **Business Logic:** Checks if transition is possible given current state
   *
   * @param player - Current player state
   * @param targetStance - Desired target stance
   * @returns Whether transition is possible
   */
  canTransition(player: PlayerState, targetStance: TrigramStance): boolean {
    // Check cooldown
    const timeSinceLastChange = Date.now() - player.lastStanceChangeTime;
    if (timeSinceLastChange < 300) return false; // Minimum 300ms cooldown

    // Check resource requirements
    const cost = this.calculateTransitionCost(player, targetStance);
    if (player.ki < cost.ki || player.stamina < cost.stamina) return false;

    // Check if stunned or incapacitated
    if (player.isStunned || player.consciousness <= 0) return false;

    return true;
  }

  /**
   * **Business Logic:** Finds optimal path between distant stances
   *
   * @param player - Current player state
   * @param targetStance - Final target stance
   * @returns Array of stances representing optimal path
   */
  findOptimalPath(
    player: PlayerState,
    targetStance: TrigramStance
  ): TrigramStance[] {
    // Simple implementation - can be enhanced with A* algorithm
    const path = [player.currentStance];
    let current = player.currentStance;

    while (current !== targetStance && path.length < 8) {
      // Find adjacent stance closest to target
      const adjacent = this.getAdjacentStances(current);
      const next = adjacent.reduce((best, stance) => {
        const bestDistance = this.getStanceDistance(best, targetStance);
        const currentDistance = this.getStanceDistance(stance, targetStance);
        return currentDistance < bestDistance ? stance : best;
      });

      if (next === current) break; // Prevent infinite loop

      path.push(next);
      current = next;
    }

    return path;
  }

  /**
   * **Business Logic:** Gets archetype mastery multiplier for specific stance
   *
   * @param archetype - Player archetype
   * @param stance - Target stance
   * @returns Mastery multiplier
   */
  getArchetypeMastery(
    archetype: PlayerArchetype,
    stance: TrigramStance
  ): number {
    const masteryStances =
      TransitionCalculator.ARCHETYPE_MASTERY.get(archetype);
    return masteryStances?.has(stance) ? 1.3 : 1.0;
  }

  /**
   * **Business Logic:** Calculates transition duration based on complexity
   *
   * @param from - Starting stance
   * @param to - Target stance
   * @returns Duration in milliseconds
   */
  calculateTransitionDuration(from: TrigramStance, to: TrigramStance): number {
    const transitionKey = `${from}-${to}`;
    const baseCost =
      TransitionCalculator.BASE_TRANSITION_COSTS.get(transitionKey);
    return baseCost?.time || 1000;
  }

  /**
   * **Business Logic:** Gets adjacent stances for pathfinding
   *
   * @private
   * @param stance - Current stance
   * @returns Adjacent stances
   */
  private getAdjacentStances(stance: TrigramStance): TrigramStance[] {
    const stances = Object.values(TrigramStance);
    const currentIndex = stances.indexOf(stance);

    const previous =
      stances[(currentIndex - 1 + stances.length) % stances.length];
    const next = stances[(currentIndex + 1) % stances.length];

    return [previous, next];
  }

  /**
   * **Business Logic:** Calculates distance between stances for pathfinding
   *
   * @private
   * @param from - Starting stance
   * @param to - Target stance
   * @returns Distance value
   */
  private getStanceDistance(from: TrigramStance, to: TrigramStance): number {
    const stances = Object.values(TrigramStance);
    const fromIndex = stances.indexOf(from);
    const toIndex = stances.indexOf(to);

    const directDistance = Math.abs(toIndex - fromIndex);
    const wrapDistance = stances.length - directDistance;

    return Math.min(directDistance, wrapDistance);
  }

  /**
   * **Business Logic:** Calculates fatigue multiplier based on player condition
   *
   * @private
   * @param player - Current player state
   * @returns Fatigue multiplier
   */
  private calculateFatigueMultiplier(player: PlayerState): number {
    const kiPercentage = player.ki / player.maxKi;
    const staminaPercentage = player.stamina / player.maxStamina;

    const averageCondition = (kiPercentage + staminaPercentage) / 2;

    if (averageCondition > 0.8) return 1.0;
    if (averageCondition > 0.5) return 1.2;
    if (averageCondition > 0.3) return 1.5;
    return 2.0; // Heavy fatigue penalty
  }
}

export default TransitionCalculator;
