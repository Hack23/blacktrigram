import type {
  TrigramStance,
  TrigramEffectivenessMatrix,
  TrigramTransitionCost,
  TransitionPath,
} from "../../types/trigram";
import type { PlayerState } from "../../types/player";
import {
  TRIGRAM_DATA,
  STANCE_EFFECTIVENESS_MATRIX,
} from "../../types/constants";
import type { EffectType } from "../../types"; // Import EffectType

export interface TransitionPathWithDescription extends TransitionPath {
  description: {
    korean: string;
    english: string;
  };
}

export class TrigramCalculator {
  // private readonly trigramData: Record<TrigramStance, TrigramData>; // Unused if directly using imported TRIGRAM_DATA
  private readonly effectivenessMatrix: TrigramEffectivenessMatrix;

  constructor(
    // trigramData?: Record<TrigramStance, TrigramData>, // Can be removed if TRIGRAM_DATA is directly used
    effectivenessMatrix?: TrigramEffectivenessMatrix
  ) {
    // this.trigramData = trigramData || TRIGRAM_DATA;
    this.effectivenessMatrix =
      effectivenessMatrix || STANCE_EFFECTIVENESS_MATRIX;
  }

  public calculateTransitionCost(
    from: TrigramStance,
    to: TrigramStance,
    playerState: PlayerState
  ): TrigramTransitionCost {
    if (from === to) return { ki: 0, stamina: 0, timeMilliseconds: 0 };

    const effectiveness = this.effectivenessMatrix[from]?.[to] || 1.0;
    // Base cost can be more dynamic, e.g. from TrigramData or rules
    const baseKiCost = effectiveness < 1.0 ? 15 : 10; // Higher cost for less effective transitions
    const baseStaminaCost = baseKiCost * 0.8;
    const baseTimeMs = 500 + (1 - effectiveness) * 200; // Longer time for less effective

    let healthModifier = 1.0;
    if (playerState.health < playerState.maxHealth * 0.5) healthModifier = 1.5;
    else if (playerState.health < playerState.maxHealth * 0.25)
      healthModifier = 2.0;

    return {
      ki: Math.floor(baseKiCost * healthModifier),
      stamina: Math.floor(baseStaminaCost * healthModifier),
      timeMilliseconds: Math.floor(baseTimeMs * healthModifier),
    };
  }

  public calculateOptimalPath(
    from: TrigramStance,
    to: TrigramStance,
    playerState: PlayerState
  ): TransitionPathWithDescription | null {
    if (from === to) {
      return {
        path: [from],
        totalCost: { ki: 0, stamina: 0, timeMilliseconds: 0 },
        cumulativeRisk: 0,
        overallEffectiveness: 1.0,
        name: `${from}`,
        description: {
          korean: "현재 자세 유지",
          english: "Maintain current stance",
        },
      };
    }

    // Simple direct path for now
    const cost = this.calculateTransitionCost(from, to, playerState);
    if (playerState.ki < cost.ki || playerState.stamina < cost.stamina) {
      return null; // Cannot afford direct path
    }

    const overallEffectiveness = this.getStanceEffectiveness(from, to); // Or effectiveness of 'to' stance in context
    const cumulativeRisk = (cost.timeMilliseconds / 1000) * 0.1; // Example risk calculation

    return {
      path: [from, to],
      totalCost: cost,
      overallEffectiveness: overallEffectiveness,
      cumulativeRisk,
      name: `${from} → ${to}`,
      description: {
        korean: `${TRIGRAM_DATA[from].name.korean} 에서 ${TRIGRAM_DATA[to].name.korean} 로 전환`,
        english: `Transition from ${TRIGRAM_DATA[from].name.english} to ${TRIGRAM_DATA[to].name.english}`,
      },
    };
  }

  public getKiRecoveryRate(playerState: PlayerState): number {
    const baseRate = 1.5; // Base Ki recovery per second or tick
    const healthModifier = playerState.health / playerState.maxHealth; // Healthier recovers faster
    const stanceModifier =
      TRIGRAM_DATA[playerState.currentStance as TrigramStance]
        ?.kiFlowModifier || 1.0; // Stance specific modifier

    // Consider active effects that might alter Ki recovery
    let effectsModifier = 1.0;
    playerState.activeEffects?.forEach((effect) => {
      if (effect.type === ("ki_drain" as EffectType)) effectsModifier *= 0.5; // Example
      if (effect.type === ("ki_regen_buff" as EffectType))
        effectsModifier *= 1.5; // Example
    });

    return baseRate * healthModifier * stanceModifier * effectsModifier;
  }

  public getStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return this.effectivenessMatrix[attackerStance]?.[defenderStance] || 1.0;
  }

  public calculateTransitionPath(
    // This seems to be a duplicate or alternative name for calculateTransitionCost
    from: TrigramStance,
    to: TrigramStance,
    playerState: PlayerState
  ): TrigramTransitionCost {
    return this.calculateTransitionCost(from, to, playerState);
  }
}
