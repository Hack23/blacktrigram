import {
  type PlayerState,
  type TrigramStance,
  type TrigramTransitionCost,
  type TransitionPath,
  STANCE_EFFECTIVENESS_MATRIX,
  TRIGRAM_DATA,
  TRIGRAM_STANCES_ORDER,
  KoreanTechnique,
} from "../types";
import { TrigramCalculator } from "./trigram/TrigramCalculator";

export class TrigramSystem {
  private trigramCalculator: TrigramCalculator; // Add missing property

  constructor() {
    this.trigramCalculator = new TrigramCalculator();
  }

  // Alternative: Return object with transition details
  public canTransitionTo(
    from: TrigramStance,
    to: TrigramStance,
    playerState?: PlayerState
  ): { canTransition: boolean; reason?: string } {
    if (from === to) return { canTransition: true };

    if (!playerState) {
      return { canTransition: true };
    }

    // Fix: Add null checks for playerState
    const healthRatio = playerState?.health / playerState?.maxHealth || 0;
    const kiRatio = playerState?.ki / playerState?.maxKi || 0;
    const staminaRatio = playerState?.stamina / playerState?.maxStamina || 0;

    // Check ki requirement
    if (kiRatio <= 0.2) {
      return { canTransition: false, reason: "insufficient_ki" };
    }

    // Check stamina requirement
    if (staminaRatio <= 0.2) {
      return { canTransition: false, reason: "insufficient_stamina" };
    }

    // Check health requirement
    if (healthRatio <= 0.1) {
      return { canTransition: false, reason: "insufficient_health" };
    }

    return { canTransition: true };
  }

  // Keep only one calculateTransitionCost implementation
  public calculateTransitionCost(
    from: TrigramStance,
    to: TrigramStance,
    playerState?: PlayerState
  ): TrigramTransitionCost {
    if (from === to) {
      return { ki: 0, stamina: 0, timeMilliseconds: 0 };
    }

    const baseKiCost = 10;
    const baseStaminaCost = 8;
    const baseTimeMs = 500;

    // Fix: Add safety check for playerState
    const healthRatio = playerState
      ? playerState.health / playerState.maxHealth
      : 1.0;
    const modifier = healthRatio < 0.5 ? 1.5 : 1.0; // Ensure healthRatio is used correctly

    return {
      ki: Math.floor(baseKiCost * modifier),
      stamina: Math.floor(baseStaminaCost * modifier),
      timeMilliseconds: Math.floor(baseTimeMs * modifier),
    };
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
    const effectiveness = this.getStanceEffectiveness(fromStance, toStance); // Changed from calculateStanceEffectiveness
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
    const effectiveness = this.getStanceEffectiveness(fromStance, toStance); // Changed from calculateStanceEffectiveness

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
      // Use this.trigramCalculator
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
      // Use this.trigramCalculator
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
      // Use this.trigramCalculator
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
    let bestStance: TrigramStance = playerState.currentStance;
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

  public executeStanceChange(
    playerState: PlayerState,
    newStance: TrigramStance
  ): {
    success: boolean;
    cost: { ki: number; stamina: number; timeMilliseconds: number }; // Ensure this matches TrigramTransitionCost
    newState?: PlayerState;
    reason?: string;
  } {
    // Check if player can afford the stance change
    const transitionCost = this.trigramCalculator.calculateTransitionCost(
      playerState.currentStance as TrigramStance, // Ensure currentStance is used
      newStance,
      playerState
    );

    if (playerState.ki < transitionCost.ki) {
      return {
        success: false,
        cost: transitionCost,
        reason: "insufficient_ki",
      };
    }

    if (playerState.stamina < transitionCost.stamina) {
      return {
        success: false,
        cost: transitionCost,
        reason: "insufficient_stamina",
      };
    }

    // Execute stance change
    const newState: PlayerState = {
      ...playerState,
      currentStance: newStance, // Use currentStance, not stance
      ki: playerState.ki - transitionCost.ki,
      stamina: playerState.stamina - transitionCost.stamina,
      lastStanceChangeTime: Date.now(), // Ensure this field exists and is updated
    };

    return {
      success: true,
      cost: transitionCost,
      newState,
    };
  }

  // Add missing methods that GameEngine expects
  public getTechniqueForStance(
    stance: TrigramStance
  ): KoreanTechnique | undefined {
    const stanceData = TRIGRAM_DATA[stance];
    return stanceData?.technique;
  }

  public getKiRecoveryRate(player: PlayerState): number {
    const baseRate = 1.0;
    const stanceModifier =
      TRIGRAM_DATA[player.currentStance as TrigramStance]?.kiFlowModifier || // Ensure currentStance is used
      1.0;
    return baseRate * stanceModifier;
  }
}
