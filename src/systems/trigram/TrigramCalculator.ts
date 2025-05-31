import type {
  TrigramStance,
  TransitionMetrics,
  TransitionPath,
  KiFlowFactors,
} from "../../types";
import { TRIGRAM_DATA, STANCE_EFFECTIVENESS_MATRIX } from "../../types";

/**
 * Korean Trigram Calculator - Advanced Stance Mechanics
 * Based on I-Ching philosophy and Korean martial arts principles
 */

export class TrigramCalculator {
  private static readonly TRANSITION_BASE_COST = 5;
  private static readonly KI_FLOW_EFFICIENCY = 0.8;
  private static readonly ELEMENTAL_MULTIPLIER = 1.2;

  // Add this missing static property
  private static readonly BASE_KI_FLOW_RATES: Record<TrigramStance, number> = {
    geon: 1.2, // Heaven - high spiritual energy
    tae: 1.0, // Lake - balanced energy flow
    li: 1.1, // Fire - intense but consuming
    jin: 0.9, // Thunder - explosive but draining
    son: 1.1, // Wind - gentle and sustained
    gam: 1.3, // Water - deep and flowing
    gan: 0.8, // Mountain - stable but slow
    gon: 0.9, // Earth - grounded and steady
  };

  // Fix index signature issues by using Record<string, string[]>
  private static readonly ELEMENTAL_CYCLES: {
    generating: Record<string, string[]>;
    destructive: Record<string, string[]>;
  } = {
    generating: {
      Heaven: ["Lake", "Fire"],
      Lake: ["Fire", "Thunder"],
      Fire: ["Thunder", "Wind"],
      Thunder: ["Wind", "Water"],
      Wind: ["Water", "Mountain"],
      Water: ["Mountain", "Earth"],
      Mountain: ["Earth", "Heaven"],
      Earth: ["Heaven", "Lake"],
    },
    destructive: {
      Heaven: ["Thunder", "Water"],
      Lake: ["Mountain", "Earth"],
      Fire: ["Water", "Mountain"],
      Thunder: ["Earth", "Heaven"],
      Wind: ["Heaven", "Lake"],
      Water: ["Lake", "Fire"],
      Mountain: ["Fire", "Thunder"],
      Earth: ["Thunder", "Wind"],
    },
  };

  /**
   * Calculate relationship between two trigram stances
   */
  public static calculateTrigramRelationship(
    stance1: TrigramStance,
    stance2: TrigramStance
  ): {
    harmonious: boolean;
    conflicting: boolean;
    complementary: boolean;
    advantage: number;
    description: { korean: string; english: string };
  } {
    const data1 = TRIGRAM_DATA[stance1];
    const data2 = TRIGRAM_DATA[stance2];

    const elementalHarmony = this.calculateElementalHarmony(
      data1.element,
      data2.element
    );

    const orderDistance = this.calculateOrderDistance(data1.order, data2.order);
    const effectiveness = STANCE_EFFECTIVENESS_MATRIX[stance1][stance2];

    const harmonious = elementalHarmony.harmonyLevel > 0.7;
    const conflicting = elementalHarmony.harmonyLevel < 0.4;
    const complementary = orderDistance === 4; // Opposite positions
    return {
      harmonious,
      conflicting,
      complementary,
      advantage: effectiveness,
      description: {
        korean: this.getKoreanRelationshipDescription(
          stance1,
          stance2,
          harmonious,
          conflicting
        ),
        english: this.getEnglishRelationshipDescription(
          stance1,
          stance2,
          harmonious,
          conflicting
        ),
      },
    };
  }

  /**
   * Calculate elemental harmony between two elements
   */
  public static calculateElementalHarmony(
    element1: string,
    element2: string
  ): {
    element1: string;
    element2: string;
    harmonyLevel: number;
    flowDirection: "generating" | "destructive" | "neutral";
    koreanTerm: string;
    effects: readonly string[];
  } {
    if (element1 === element2) {
      return {
        element1,
        element2,
        harmonyLevel: 1.0,
        flowDirection: "neutral",
        koreanTerm: "동일 원소",
        effects: ["Stability", "Balance", "Reinforcement"],
      };
    }

    // Fix index signature issues by using type assertion or in operator
    // Check generating cycle
    const generatingCycles = this.ELEMENTAL_CYCLES.generating;
    const isGenerating =
      generatingCycles[element1] &&
      generatingCycles[element1].includes(element2);
    if (isGenerating) {
      return {
        element1,
        element2,
        harmonyLevel: 0.8,
        flowDirection: "generating",
        koreanTerm: "생성 관계",
        effects: ["Synergy", "Amplification", "Natural flow"],
      };
    }

    // Check destructive cycle
    const destructiveCycles = this.ELEMENTAL_CYCLES.destructive;
    const isDestructive =
      destructiveCycles[element1] &&
      destructiveCycles[element1].includes(element2);
    if (isDestructive) {
      return {
        element1,
        element2,
        harmonyLevel: 0.3,
        flowDirection: "destructive",
        koreanTerm: "억제 관계",
        effects: ["Conflict", "Suppression", "Resistance"],
      };
    }

    // Neutral relationship
    return {
      element1,
      element2,
      harmonyLevel: 0.5,
      flowDirection: "neutral",
      koreanTerm: "중립 관계",
      effects: ["Independence", "Coexistence"],
    };
  }

  /**
   * Calculate optimal trigram flow for combat strategy
   */
  public static calculateOptimalTrigramFlow(
    playerStance: TrigramStance,
    opponentStance: TrigramStance,
    playerKi: number,
    playerStamina: number
  ): Array<{
    targetStance: TrigramStance;
    effectiveness: number;
    cost: number;
  } | null> {
    // Use all parameters to avoid unused variable warnings
    const kiEfficiency = Math.min(1.0, playerKi / 50);
    const staminaEfficiency = Math.min(1.0, playerStamina / 100);

    const allStances: TrigramStance[] = [
      "geon",
      "tae",
      "li",
      "jin",
      "son",
      "gam",
      "gan",
      "gon",
    ];

    // Calculate the optimal flow of stances based on opponent's stance
    const flowResults = allStances.map((stance) => {
      if (stance === playerStance) return null;

      const transition = this.calculateTransitionMetrics(playerStance, stance);
      if (
        transition.kiCost > playerKi ||
        transition.staminaCost > playerStamina
      ) {
        return null;
      }

      const effectiveness = STANCE_EFFECTIVENESS_MATRIX[stance][opponentStance];
      const cost = transition.kiCost + transition.staminaCost;

      // Scale effectiveness by player resources
      const scaledEffectiveness =
        effectiveness * kiEfficiency * staminaEfficiency;

      return {
        targetStance: stance,
        effectiveness: scaledEffectiveness,
        cost,
      };
    });

    return flowResults.sort((a, b) => {
      if (!a) return 1;
      if (!b) return -1;
      return b.effectiveness / b.cost - a.effectiveness / a.cost;
    });
  }

  /**
   * Enhanced stance effectiveness calculation
   */
  public static calculateEnhancedStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance,
    playerFactors?: KiFlowFactors
  ): number {
    const baseEffectiveness =
      STANCE_EFFECTIVENESS_MATRIX[attackerStance][defenderStance];
    const elementalAdvantage = this.calculateElementalAdvantage(
      attackerStance,
      defenderStance
    );

    let finalEffectiveness = baseEffectiveness * elementalAdvantage;

    // Apply player factors if provided
    if (playerFactors) {
      if (playerFactors.stanceAffinity) {
        finalEffectiveness *= playerFactors.stanceAffinity;
      }
      if (playerFactors.playerLevelModifier) {
        finalEffectiveness *= playerFactors.playerLevelModifier;
      }
    }

    return Math.max(0.5, Math.min(2.0, finalEffectiveness));
  }

  /**
   * Find optimal transition path with validation
   */
  public static findOptimalTransition(
    from: TrigramStance,
    to: TrigramStance,
    playerKi: number,
    playerStamina: number
  ): TransitionPath {
    // Ensure from and to are defined
    if (!from || !to) {
      return {
        path: [],
        totalCost: Infinity,
        success: false,
        description: "Invalid stance parameters",
      };
    }

    // Direct transition if same stance
    if (from === to) {
      return {
        path: [from],
        totalCost: 0,
        success: true,
        description: "Already in target stance",
      };
    }

    // Get direct transition cost
    const directTransition = this.calculateTransitionMetrics(from, to);

    // Check if player has enough resources for direct transition
    if (
      playerKi >= directTransition.kiCost &&
      playerStamina >= directTransition.staminaCost
    ) {
      return {
        path: [from, to],
        totalCost: directTransition.kiCost + directTransition.staminaCost,
        success: true,
        from,
        to,
        totalKiCost: directTransition.kiCost,
        totalStaminaCost: directTransition.staminaCost,
        description: `Direct transition from ${TRIGRAM_DATA[from].korean} to ${TRIGRAM_DATA[to].korean}`,
      };
    }

    // If direct transition not possible, find intermediate path
    const allStances: TrigramStance[] = [
      "geon",
      "tae",
      "li",
      "jin",
      "son",
      "gam",
      "gan",
      "gon",
    ];

    let bestPath: TransitionPath = {
      path: [],
      totalCost: Infinity,
      success: false,
      description: "No viable path found",
    };

    // Try single intermediate stance
    allStances.forEach((intermediate) => {
      if (intermediate === from || intermediate === to) return;

      const firstTransition = this.calculateTransitionMetrics(
        from,
        intermediate
      );
      const secondTransition = this.calculateTransitionMetrics(
        intermediate,
        to
      );

      const totalKiCost = firstTransition.kiCost + secondTransition.kiCost;
      const totalStaminaCost =
        firstTransition.staminaCost + secondTransition.staminaCost;
      const totalCost = totalKiCost + totalStaminaCost;

      if (
        totalKiCost <= playerKi &&
        totalStaminaCost <= playerStamina &&
        totalCost < bestPath.totalCost
      ) {
        bestPath = {
          path: [from, intermediate, to],
          totalCost,
          success: true,
          from,
          to,
          totalKiCost,
          totalStaminaCost,
          efficiency:
            directTransition.effectiveness /
            (totalCost /
              (directTransition.kiCost + directTransition.staminaCost)),
          description: `Path via ${TRIGRAM_DATA[intermediate].korean}`,
        };
      }
    });

    return bestPath;
  }

  /**
   * Calculate transition metrics between stances
   */
  private static calculateTransitionMetrics(
    from: TrigramStance,
    to: TrigramStance
  ): TransitionMetrics {
    if (from === to) {
      return {
        staminaCost: 0,
        kiCost: 0,
        timeDelay: 0,
        effectiveness: 1.0,
      };
    }

    const fromData = TRIGRAM_DATA[from];
    const toData = TRIGRAM_DATA[to];
    const orderDiff = Math.abs((fromData.order || 0) - (toData.order || 0));

    // Use TRANSITION_BASE_COST to calculate costs
    const kiCost = Math.max(this.TRANSITION_BASE_COST, orderDiff * 3);
    const staminaCost = Math.max(this.TRANSITION_BASE_COST - 2, orderDiff * 2);
    const timeDelay = orderDiff * 100;
    const effectiveness = Math.max(0.5, 1 - orderDiff * 0.1);

    return {
      staminaCost,
      kiCost,
      timeDelay,
      effectiveness,
    };
  }

  /**
   * Calculate elemental advantage between stances
   */
  public static calculateElementalAdvantage(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    const attackerElement = TRIGRAM_DATA[attackerStance].element;
    const defenderElement = TRIGRAM_DATA[defenderStance].element;

    // Traditional five-element theory relationships
    const elementAdvantages: Record<string, string[]> = {
      Heaven: ["Earth", "Mountain"],
      Lake: ["Fire", "Thunder"],
      Fire: ["Metal", "Wind"],
      Thunder: ["Earth", "Mountain"],
      Wind: ["Earth", "Lake"],
      Water: ["Fire", "Thunder"],
      Mountain: ["Water", "Wind"],
      Earth: ["Water", "Lake"],
    };

    if (elementAdvantages[attackerElement]?.includes(defenderElement)) {
      return this.ELEMENTAL_MULTIPLIER;
    } else if (elementAdvantages[defenderElement]?.includes(attackerElement)) {
      return 1.0 / this.ELEMENTAL_MULTIPLIER;
    }

    return 1.0;
  }

  /**
   * Calculate ki flow based on stance and factors
   */
  public static calculateKiFlow(
    stance: TrigramStance,
    factors: KiFlowFactors
  ): number {
    // Use the defined static property
    const baseFlow = this.BASE_KI_FLOW_RATES[stance] || 1.0;
    let finalFlow = baseFlow * this.KI_FLOW_EFFICIENCY;

    const playerLevelModifier = factors.playerLevelModifier || 1.0;
    const stanceAffinity = factors.stanceAffinity || 1.0;

    finalFlow *= playerLevelModifier * stanceAffinity;

    if (factors.kiRecovery) finalFlow += factors.kiRecovery;
    if (factors.kiConsumption) finalFlow -= factors.kiConsumption;
    if (factors.timeInStance && factors.timeInStance > 5000) {
      finalFlow *= 1.2; // Bonus for maintaining stance
    }

    return Math.max(0.1, finalFlow);
  }

  /**
   * Calculate order distance in trigram wheel
   */
  private static calculateOrderDistance(
    order1: number,
    order2: number
  ): number {
    const directDistance = Math.abs(order1 - order2);
    return Math.min(directDistance, 8 - directDistance);
  }

  /**
   * Get Korean description of relationship
   */
  private static getKoreanRelationshipDescription(
    stance1: TrigramStance,
    stance2: TrigramStance,
    harmonious: boolean,
    conflicting: boolean
  ): string {
    // Fix: Add type guards to ensure stances are valid before accessing TRIGRAM_DATA
    if (!this.isValidStance(stance1) || !this.isValidStance(stance2)) {
      return "알 수 없는 관계";
    }

    const data1 = TRIGRAM_DATA[stance1];
    const data2 = TRIGRAM_DATA[stance2];

    if (!data1 || !data2) {
      return "알 수 없는 관계";
    }

    const name1 = data1.korean;
    const name2 = data2.korean;

    if (harmonious) {
      return `${name1}과 ${name2}는 조화로운 관계`;
    } else if (conflicting) {
      return `${name1}과 ${name2}는 상극 관계`;
    } else {
      return `${name1}과 ${name2}는 중립적 관계`;
    }
  }

  /**
   * Get English description of relationship
   */
  private static getEnglishRelationshipDescription(
    stance1: TrigramStance,
    stance2: TrigramStance,
    harmonious: boolean,
    conflicting: boolean
  ): string {
    // Fix: Add type guards to ensure stances are valid before accessing TRIGRAM_DATA
    if (!this.isValidStance(stance1) || !this.isValidStance(stance2)) {
      return "Unknown relationship";
    }

    const data1 = TRIGRAM_DATA[stance1];
    const data2 = TRIGRAM_DATA[stance2];

    if (!data1 || !data2) {
      return "Unknown relationship";
    }

    const name1 = data1.english;
    const name2 = data2.english;

    if (harmonious) {
      return `${name1} and ${name2} are in harmonious relationship`;
    } else if (conflicting) {
      return `${name1} and ${name2} are in conflicting relationship`;
    } else {
      return `${name1} and ${name2} have a neutral relationship`;
    }
  }

  /**
   * Type guard to validate if a value is a valid TrigramStance
   */
  private static isValidStance(stance: unknown): stance is TrigramStance {
    return (
      typeof stance === "string" &&
      ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"].includes(stance)
    );
  }

  /**
   * Calculate comprehensive trigram analysis for training
   */
  public static calculateTrigramMastery(
    _playerState: PlayerState,
    stanceHistory: TrigramStance[],
    combatPerformance: {
      hits: number;
      misses: number;
      criticalHits: number;
      blocks: number;
    }
  ): {
    masteryLevel: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    koreanTitle: string;
  } {
    const uniqueStances = new Set(stanceHistory);
    const diversityScore = uniqueStances.size / 8; // 8 total stances

    const accuracyScore =
      combatPerformance.hits /
      Math.max(1, combatPerformance.hits + combatPerformance.misses);

    const criticalRatio =
      combatPerformance.criticalHits / Math.max(1, combatPerformance.hits);

    const defensiveScore =
      combatPerformance.blocks /
      Math.max(1, combatPerformance.hits + combatPerformance.blocks);

    const masteryLevel =
      (diversityScore + accuracyScore + criticalRatio + defensiveScore) / 4;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    if (diversityScore > 0.7) {
      strengths.push("다양한 자세 활용 (Diverse stance usage)");
    } else {
      weaknesses.push("제한적 자세 활용 (Limited stance variety)");
      recommendations.push(
        "모든 8괘 자세 연습 (Practice all 8 trigram stances)"
      );
    }

    if (accuracyScore > 0.8) {
      strengths.push("높은 정확도 (High accuracy)");
    } else {
      weaknesses.push("낮은 명중률 (Low hit rate)");
      recommendations.push("정확성 훈련 강화 (Intensify accuracy training)");
    }

    if (criticalRatio > 0.3) {
      strengths.push("효과적인 급소 공격 (Effective vital point attacks)");
    } else {
      recommendations.push(
        "급소 공격 기법 연마 (Refine vital point techniques)"
      );
    }

    let koreanTitle: string;
    if (masteryLevel >= 0.9) {
      koreanTitle = "무술 대가 (Martial Arts Master)";
    } else if (masteryLevel >= 0.7) {
      koreanTitle = "숙련자 (Expert Practitioner)";
    } else if (masteryLevel >= 0.5) {
      koreanTitle = "중급자 (Intermediate Student)";
    } else {
      koreanTitle = "초보자 (Beginner)";
    }

    return {
      masteryLevel,
      strengths,
      weaknesses,
      recommendations,
      koreanTitle,
    };
  }

  /**
   * Enhanced recommendation with detailed stance analysis
   */
  public static getDetailedStanceAnalysis(
    currentStance: TrigramStance,
    opponentStance: TrigramStance
  ): {
    currentEffectiveness: number;
    recommendations: Array<{
      stance: TrigramStance;
      effectiveness: number;
      reasoning: string;
      priority: "high" | "medium" | "low";
    }>;
    transitionCosts: Record<TrigramStance, TransitionMetrics>;
  } {
    // Fix method name reference
    const currentEffectiveness = this.calculateEnhancedStanceEffectiveness(
      currentStance,
      opponentStance
    );

    const allStances: TrigramStance[] = [
      "geon",
      "tae",
      "li",
      "jin",
      "son",
      "gam",
      "gan",
      "gon",
    ];

    // Fix: Initialize transitionCosts to be returned later
    const transitionCosts: Record<TrigramStance, TransitionMetrics> =
      {} as Record<TrigramStance, TransitionMetrics>;

    // Calculate transition costs for each stance
    allStances.forEach((stance) => {
      transitionCosts[stance] = this.calculateTransitionMetrics(
        currentStance,
        stance
      );
    });

    // Build initial recommendations based on effectiveness
    const effectivenessRecommendations = allStances.map((stance) => {
      // Fix method name reference
      const effectiveness = this.calculateEnhancedStanceEffectiveness(
        stance,
        opponentStance
      );

      const transitionCost = transitionCosts[stance];

      // Calculate priority based on effectiveness and transition cost
      let priority: "high" | "medium" | "low" = "medium";

      if (effectiveness > 1.3 && transitionCost.kiCost < 15) {
        priority = "high";
      } else if (effectiveness < 0.7 || transitionCost.kiCost > 25) {
        priority = "low";
      }

      return {
        stance,
        effectiveness,
        reasoning: `Effectiveness: ${effectiveness.toFixed(2)}, Ki Cost: ${
          transitionCost.kiCost
        }`,
        priority,
      };
    });

    // Sort by effectiveness and filter out current stance
    const sortedRecommendations = effectivenessRecommendations
      .filter((rec) => rec.stance !== currentStance)
      .sort((a, b) => b.effectiveness - a.effectiveness);

    return {
      currentEffectiveness,
      recommendations: sortedRecommendations,
      transitionCosts, // Using the initialized transitionCosts
    };
  }
}

// Add missing interface for PlayerState
interface PlayerState {
  playerId: string;
  // Add necessary properties - minimal implementation
  stance?: TrigramStance;
  ki?: number;
  stamina?: number;
}
