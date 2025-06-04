import {
  type PlayerState,
  type TrigramStance,
  type TrigramTransitionCost,
  type TransitionPath,
  STANCE_EFFECTIVENESS_MATRIX,
  TRIGRAM_DATA,
  TRIGRAM_STANCES_ORDER,
} from "../types";
import { TrigramCalculator } from "./trigram/TrigramCalculator";

// Add missing TransitionResult interface
interface TransitionResult {
  canTransition: boolean;
  cost: TrigramTransitionCost;
  reason?: string;
}

export class TrigramSystem {
  private trigramCalculator: TrigramCalculator; // Add missing property

  constructor() {
    this.trigramCalculator = new TrigramCalculator();
  }

  public canTransitionTo(
    playerState: PlayerState,
    targetStance: TrigramStance
  ): TransitionResult {
    const cost = this.trigramCalculator.calculateTransitionCost(
      playerState.stance,
      targetStance,
      playerState
    );

    if (playerState.ki < cost.ki) {
      return { canTransition: false, cost, reason: "insufficient_ki" };
    }
    if (playerState.stamina < cost.stamina) {
      return { canTransition: false, cost, reason: "insufficient_stamina" };
    }

    return { canTransition: true, cost };
  }

  public calculateOptimalPath(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    playerState: PlayerState,
    _opponentStance?: TrigramStance
  ): TransitionPath | null {
    const cost = this.trigramCalculator.calculateTransitionCost(
      fromStance,
      toStance,
      playerState
    );

    if (playerState.ki < cost.ki || playerState.stamina < cost.stamina) {
      return null;
    }

    // Fix: Use correct method name and variable
    const effectiveness = this.getStanceEffectiveness(fromStance, toStance);
    const risk = this.calculateRisk(cost, playerState);

    return {
      path: [fromStance, toStance],
      totalCost: cost,
      overallEffectiveness: effectiveness,
      cumulativeRisk: risk,
      name: `${TRIGRAM_DATA[fromStance].name.english} → ${TRIGRAM_DATA[toStance].name.english}`,
      description: {
        korean: `${TRIGRAM_DATA[fromStance].name.korean}에서 ${TRIGRAM_DATA[toStance].name.korean}로 전환`,
        english: `Transition from ${TRIGRAM_DATA[fromStance].name.english} to ${TRIGRAM_DATA[toStance].name.english}`,
      },
    };
  }

  public findOptimalPath(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    playerState: PlayerState
  ): TransitionPath | null {
    // Calculate the transition cost first
    const directCost = this.calculateTransitionCost(
      fromStance,
      toStance,
      playerState
    );

    // Fix: Use correct method name
    const effectiveness = this.getStanceEffectiveness(fromStance, toStance);

    // Calculate risk based on the cost and player state
    const risk = this.calculateRisk(directCost, playerState);

    return {
      path: [fromStance, toStance],
      totalCost: directCost,
      overallEffectiveness: effectiveness,
      cumulativeRisk: risk,
      name: `${TRIGRAM_DATA[fromStance].name.english} → ${TRIGRAM_DATA[toStance].name.english}`,
      // Add required description property
      description: {
        korean: `${TRIGRAM_DATA[fromStance].name.korean}에서 ${TRIGRAM_DATA[toStance].name.korean}로 전환`,
        english: `Transition from ${TRIGRAM_DATA[fromStance].name.english} to ${TRIGRAM_DATA[toStance].name.english}`,
      },
    };
  }

  // Add missing calculateRisk method
  private calculateRisk(
    cost: TrigramTransitionCost,
    playerState: PlayerState
  ): number {
    let baseRisk = 0.1; // Base 10% risk

    // Higher risk if low on resources
    if (playerState.ki < playerState.maxKi * 0.3) baseRisk += 0.2;
    if (playerState.stamina < playerState.maxStamina * 0.3) baseRisk += 0.2;
    if (playerState.health < playerState.maxHealth * 0.5) baseRisk += 0.3;

    // Time-based risk
    const timeRisk = (cost.timeMilliseconds / 1000) * 0.05; // 5% per second

    return Math.min(1.0, baseRisk + timeRisk);
  }

  public findSafestPathToStance(
    currentStance: TrigramStance,
    targetStance: TrigramStance,
    playerState: PlayerState
    // opponentStance?: TrigramStance // Remove unused parameter
  ): TransitionPath | null {
    // Simplified: direct path, consider "safest" as lowest cost or highest defensive gain
    const cost = this.trigramCalculator.calculateTransitionCost(
      currentStance,
      targetStance,
      playerState
    );
    if (playerState.ki >= cost.ki && playerState.stamina >= cost.stamina) {
      return {
        path: [currentStance, targetStance], // Use path
        totalCost: cost,
        cumulativeRisk: (cost.timeMilliseconds / 1000) * 0.05, // Lower risk for "safe" path
        name: `안전: ${currentStance} → ${targetStance}`,
        description: {
          korean: `안전하게 ${currentStance}에서 ${targetStance}로`,
          english: `Safely from ${currentStance} to ${targetStance}`,
        },
        overallEffectiveness: TRIGRAM_DATA[targetStance]?.defensiveBonus || 1.0, // Example safety metric
      };
    }
    return null;
  }

  public findQuickestPathToStance(
    currentStance: TrigramStance,
    targetStance: TrigramStance,
    playerState: PlayerState
    // opponentStance?: TrigramStance // Remove unused parameter
  ): TransitionPath | null {
    // Simplified: direct path, "quickest" means lowest timeMilliseconds
    const cost = this.trigramCalculator.calculateTransitionCost(
      currentStance,
      targetStance,
      playerState
    );
    if (playerState.ki >= cost.ki && playerState.stamina >= cost.stamina) {
      return {
        path: [currentStance, targetStance], // Use path
        totalCost: cost,
        cumulativeRisk: (cost.timeMilliseconds / 1000) * 0.15, // Higher risk for "quick" path if it's aggressive
        name: `신속: ${currentStance} → ${targetStance}`,
        description: {
          korean: `신속하게 ${currentStance}에서 ${targetStance}로`,
          english: `Quickly from ${currentStance} to ${targetStance}`,
        },
        overallEffectiveness:
          STANCE_EFFECTIVENESS_MATRIX[currentStance]?.[targetStance] || 1.0,
      };
    }
    return null;
  }

  public getStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return this.trigramCalculator.getStanceEffectiveness(
      attackerStance,
      defenderStance
    );
  }

  public getStanceCycle(clockwise: boolean = true): readonly TrigramStance[] {
    if (clockwise) {
      return TRIGRAM_STANCES_ORDER;
    } else {
      return [...TRIGRAM_STANCES_ORDER].reverse();
    }
  }

  public getNextStanceInCycle(
    currentStance: TrigramStance,
    clockwise: boolean = true
  ): TrigramStance {
    const cycle = this.getStanceCycle(clockwise);
    const currentIndex = cycle.indexOf(currentStance);
    if (currentIndex === -1) return currentStance; // Should not happen
    const nextIndex = (currentIndex + 1) % cycle.length;
    return cycle[nextIndex];
  }

  // Add missing method for test compatibility
  public calculateTransitionCost(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    playerState: PlayerState
  ): TrigramTransitionCost {
    return this.trigramCalculator.calculateTransitionCost(
      fromStance,
      toStance,
      playerState
    );
  }

  // Add missing method for test compatibility
  public getOptimalStanceAgainst(
    opponentStance: TrigramStance,
    playerState: PlayerState
  ): TrigramStance {
    // Simple implementation: return stance with best effectiveness against opponent
    const stances: TrigramStance[] = [
      "geon",
      "tae",
      "li",
      "jin",
      "son",
      "gam",
      "gan",
      "gon",
    ];
    let bestStance: TrigramStance = playerState.stance;
    let bestEffectiveness = 0;

    for (const stance of stances) {
      const effectiveness = this.getStanceEffectiveness(stance, opponentStance);
      if (effectiveness > bestEffectiveness) {
        bestEffectiveness = effectiveness;
        bestStance = stance;
      }
    }

    return bestStance;
  }
}
