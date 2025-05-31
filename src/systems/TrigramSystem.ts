import type {
  TrigramStance,
  KoreanTechnique,
  TrigramData,
  TransitionMetrics,
  TransitionPath,
  KiFlowFactors,
} from "../types";
import {
  TRIGRAM_DATA,
  STANCE_EFFECTIVENESS_MATRIX,
  TRIGRAM_STANCES_ORDER,
} from "../types";

export class TrigramSystem {
  private static BASE_KI_FLOW_RATES: Record<TrigramStance, number> = {
    geon: 1.2, // Heaven - high spiritual energy
    tae: 1.0, // Lake - balanced energy flow
    li: 1.1, // Fire - intense but consuming
    jin: 0.9, // Thunder - explosive but draining
    son: 1.1, // Wind - gentle and sustained
    gam: 1.3, // Water - deep and flowing
    gan: 0.8, // Mountain - stable but slow
    gon: 0.9, // Earth - grounded and steady
  };

  static calculateKiFlow(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    factors: KiFlowFactors
  ): number {
    const baseFlow = this.BASE_KI_FLOW_RATES[fromStance] || 1.0;
    let flow = baseFlow;

    // Same element bonus
    const fromElement = TRIGRAM_DATA[fromStance].element;
    const toElement = TRIGRAM_DATA[toStance].element;

    if (fromElement === toElement && flow !== undefined) {
      flow *= 1.2; // Bonus for same element transition
    }

    const playerLevelModifier = factors.playerLevelModifier || 1.0;
    const stanceAffinity = factors.stanceAffinity || 1.0;

    if (flow !== undefined) {
      flow *= playerLevelModifier * stanceAffinity;
    }

    if (flow !== undefined) {
      flow += (factors.kiRecovery || 0) - (factors.kiConsumption || 0);
    }

    return flow || 0;
  }

  static TRIGRAM_DATA = TRIGRAM_DATA;
  static STANCE_EFFECTIVENESS_MATRIX = STANCE_EFFECTIVENESS_MATRIX;
  static TRIGRAM_STANCES_ORDER = TRIGRAM_STANCES_ORDER;

  static getTrigramData(stance: TrigramStance): TrigramData {
    return TRIGRAM_DATA[stance];
  }

  static getTechniqueForStance(stance: TrigramStance): KoreanTechnique | null {
    const technique = TRIGRAM_DATA[stance]?.technique;
    return technique || null; // Ensure it returns null if undefined
  }

  static calculateStanceAdvantage(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return (
      TrigramSystem.STANCE_EFFECTIVENESS_MATRIX[attackerStance]?.[
        defenderStance
      ] || 1.0
    );
  }

  static getKiRegenRate(stance: TrigramStance, baseRate: number = 0.5): number {
    // Example: Geon has higher Ki regen
    const stanceModifier = stance === "geon" ? 1.5 : 1.0;
    return baseRate * stanceModifier;
  }

  static calculateTransitionCost(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): TransitionMetrics {
    if (fromStance === toStance) {
      return {
        staminaCost: 0,
        kiCost: 0,
        timeDelay: 0,
        effectiveness: 1,
        cost: 0,
        time: 0,
        cooldown: 0,
      };
    }

    const fromData = TRIGRAM_DATA[fromStance];
    const toData = TRIGRAM_DATA[toStance];
    const orderDiff = Math.abs((fromData.order || 0) - (toData.order || 0));

    const kiCost = Math.max(5, orderDiff * 3);
    const staminaCost = Math.max(3, orderDiff * 2);
    const time = orderDiff * 100;
    const effectiveness = Math.max(0.5, 1 - orderDiff * 0.1);

    return {
      staminaCost,
      kiCost,
      timeDelay: time,
      effectiveness,
      cost: kiCost + staminaCost,
      time,
      cooldown: time * 2,
    };
  }

  static findOptimalTransitionPath(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): TransitionPath {
    if (fromStance === toStance) {
      return {
        path: [fromStance],
        totalCost: 0,
        success: true,
        from: fromStance,
        to: fromStance,
        efficiency: 1,
        totalKiCost: 0,
        totalStaminaCost: 0,
        description: "No transition needed",
      };
    }

    return {
      path: [fromStance, toStance],
      totalCost: 25,
      success: true,
      from: fromStance,
      to: toStance,
      efficiency: 0.5,
      totalKiCost: 15,
      totalStaminaCost: 10,
      description: "Direct transition",
    };
  }

  static calculateDamage(
    technique: KoreanTechnique,
    distance: number,
    stanceAdvantage: number
  ): number {
    let damage = technique.damage * stanceAdvantage;
    // Apply range modifier (example: damage decreases with distance beyond optimal range)
    const optimalRange = technique.range * 0.75;
    if (distance > optimalRange) {
      damage *= Math.max(
        0.3,
        1 - (distance - optimalRange) / (technique.range * 2)
      );
    }
    return Math.max(0, damage);
  }
}
