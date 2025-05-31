import type {
  TrigramStance,
  TransitionMetrics,
  TransitionPath,
} from "../../types";
import { TRIGRAM_DATA } from "../../types";

// Constants for transition calculations
const MAX_TRANSITION_COST = 50;
const MIN_TRANSITION_EFFECTIVENESS = 0.3;

/**
 * Korean Martial Arts Trigram Transition Calculator
 * Calculates optimal stance transitions based on traditional Korean martial philosophy
 * and the I-Ching trigram system integrated with Taekwondo combat principles
 */
export class TransitionCalculator {
  /**
   * Calculate stance transition cost and effectiveness
   */
  public static calculateTransition(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    factors: {
      readonly playerLevelModifier?: number;
      readonly stanceAffinity?: number;
    } = {}
  ): TransitionMetrics {
    if (fromStance === toStance) {
      return {
        staminaCost: 0,
        kiCost: 0,
        timeDelay: 0,
        effectiveness: 1.0,
      };
    }

    const fromData = TRIGRAM_DATA[fromStance];
    const toData = TRIGRAM_DATA[toStance];

    // Calculate order distance in trigram wheel
    const orderDistance = this.calculateOrderDistance(
      fromData.order,
      toData.order
    );

    // Base costs scale with order distance
    const baseCost = 10 + orderDistance * 5;
    const baseTime = orderDistance * 200; // milliseconds

    // Apply modifiers
    const levelModifier = factors.playerLevelModifier ?? 1.0;
    const affinityModifier = factors.stanceAffinity ?? 1.0;

    const finalCost = Math.round(baseCost / levelModifier);
    const finalTime = Math.round(baseTime / affinityModifier);

    return {
      staminaCost: finalCost,
      kiCost: Math.round(finalCost * 0.8),
      timeDelay: finalTime,
      effectiveness: Math.min(1.0, affinityModifier * levelModifier),
    };
  }

  /**
   * Fix: Add missing calculateOrderDistance method
   */
  private static calculateOrderDistance(
    order1: number,
    order2: number
  ): number {
    const directDistance = Math.abs(order1 - order2);
    const circularDistance = 8 - directDistance; // 8 total trigram positions
    return Math.min(directDistance, circularDistance);
  }

  /**
   * Find the optimal path between two stances using Korean martial arts principles
   * Implements A* pathfinding with traditional trigram relationships as heuristics
   */
  public static findOptimalPath(
    from: TrigramStance,
    to: TrigramStance,
    maxKi: number,
    maxStamina: number
  ): TransitionPath {
    if (from === to) {
      return {
        path: [from],
        totalCost: 0,
        success: true,
        from,
        to,
        efficiency: 1.0,
        totalKiCost: 0,
        totalStaminaCost: 0,
        description: "Already in target stance",
      };
    }

    // Direct transition check
    const directTransition = this.TRANSITION_MATRIX[from]?.[to];
    if (
      directTransition &&
      directTransition.kiCost <= maxKi &&
      directTransition.staminaCost <= maxStamina
    ) {
      return {
        path: [from, to],
        totalCost: directTransition.kiCost + directTransition.staminaCost,
        success: true,
        from,
        to,
        efficiency: directTransition.effectiveness,
        totalKiCost: directTransition.kiCost,
        totalStaminaCost: directTransition.staminaCost,
        description: `Direct transition from ${from} to ${to}`,
      };
    }

    // If direct transition fails, return failure
    return {
      path: [],
      totalCost: Infinity,
      success: false,
      from,
      to,
      efficiency: 0,
      totalKiCost: 0,
      totalStaminaCost: 0,
      description: "No viable transition path found",
    };
  }

  /**
   * Calculate optimal transition sequence between stances
   */
  public static calculateOptimalPath(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    factors: {
      readonly playerLevelModifier?: number;
      readonly stanceAffinity?: number;
      readonly maxSteps?: number;
    } = {}
  ): TransitionPath {
    const maxSteps = factors.maxSteps ?? 3;

    if (fromStance === toStance) {
      return {
        path: [fromStance],
        totalCost: 0,
        success: true,
        efficiency: 1.0,
      };
    }

    // Direct transition
    const directTransition = this.calculateTransition(
      fromStance,
      toStance,
      factors
    );

    if (directTransition.staminaCost <= MAX_TRANSITION_COST) {
      return {
        path: [fromStance, toStance],
        totalCost: directTransition.staminaCost + directTransition.kiCost,
        success: true,
        efficiency: directTransition.effectiveness,
      };
    }

    // Multi-step transition (simplified implementation)
    const intermediateStances = this.findIntermediateStances(
      fromStance,
      toStance
    );

    if (
      intermediateStances.length > 0 &&
      intermediateStances.length <= maxSteps
    ) {
      const path = [fromStance, ...intermediateStances, toStance];
      const totalCost = this.calculatePathCost(path, factors);

      return {
        path,
        totalCost,
        success: totalCost <= MAX_TRANSITION_COST * 2,
        efficiency: Math.max(
          MIN_TRANSITION_EFFECTIVENESS,
          1.0 - totalCost / 100
        ),
      };
    }

    return {
      path: [fromStance],
      totalCost: Infinity,
      success: false,
      efficiency: 0,
    };
  }

  /**
   * Find intermediate stances for complex transitions
   */
  private static findIntermediateStances(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): TrigramStance[] {
    const fromData = TRIGRAM_DATA[fromStance];
    const toData = TRIGRAM_DATA[toStance];

    const orderDiff = toData.order - fromData.order;
    const stances: TrigramStance[] = [];

    // Find stances between source and target
    if (Math.abs(orderDiff) > 2) {
      const targetOrder = fromData.order + Math.sign(orderDiff) * 2;

      // Find stance with target order - with proper type checking
      const intermediateEntry = Object.entries(TRIGRAM_DATA).find(
        ([_, data]) => data.order === targetOrder
      );

      // Fix: Check if intermediateEntry exists and has valid stance
      if (intermediateEntry && intermediateEntry[0]) {
        const intermediateStance = intermediateEntry[0] as TrigramStance;
        // Additional validation
        if (intermediateStance && TRIGRAM_DATA[intermediateStance]) {
          stances.push(intermediateStance);
        }
      }
    }

    return stances;
  }

  /**
   * Calculate total cost for a transition path
   */
  private static calculatePathCost(
    path: TrigramStance[],
    factors: {
      readonly playerLevelModifier?: number;
      readonly stanceAffinity?: number;
    } = {}
  ): number {
    let totalCost = 0;

    // Fix: Define from and to stances properly for path calculation
    let fromStance: TrigramStance | undefined;
    let toStance: TrigramStance | undefined;

    // Fix: Validate path elements before using
    const validatedPath = path.filter(
      (stance): stance is TrigramStance =>
        stance !== undefined && TRIGRAM_DATA[stance] !== undefined
    );

    if (validatedPath.length < 2) {
      return Infinity; // Path is invalid if fewer than 2 valid stances
    }

    // Process each segment of the path
    for (let i = 0; i < validatedPath.length - 1; i++) {
      fromStance = validatedPath[i];
      toStance = validatedPath[i + 1];

      // Fix: Ensure both stances are valid
      if (fromStance && toStance) {
        const segmentMetrics = this.calculateTransition(
          fromStance,
          toStance,
          factors
        );
        totalCost += segmentMetrics.staminaCost + segmentMetrics.kiCost;
      }
    }

    return totalCost;
  }

  /**
   * Add missing TRANSITION_MATRIX
   */
  private static readonly TRANSITION_MATRIX: Record<
    TrigramStance,
    Record<TrigramStance, TransitionMetrics>
  > = {
    geon: {
      geon: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      tae: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 0.9 },
      li: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.2 },
      jin: { staminaCost: 10, kiCost: 12, timeDelay: 250, effectiveness: 1.1 },
      son: { staminaCost: 15, kiCost: 18, timeDelay: 350, effectiveness: 0.8 },
      gam: { staminaCost: 9, kiCost: 11, timeDelay: 220, effectiveness: 0.9 },
      gan: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
      gon: { staminaCost: 12, kiCost: 14, timeDelay: 280, effectiveness: 1.0 },
    },
    tae: {
      geon: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.1 },
      tae: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      li: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 0.9 },
      jin: { staminaCost: 15, kiCost: 18, timeDelay: 350, effectiveness: 0.8 },
      son: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.2 },
      gam: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
      gan: { staminaCost: 9, kiCost: 11, timeDelay: 220, effectiveness: 0.9 },
      gon: { staminaCost: 12, kiCost: 14, timeDelay: 280, effectiveness: 1.0 },
    },
    li: {
      geon: { staminaCost: 15, kiCost: 18, timeDelay: 350, effectiveness: 0.8 },
      tae: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.1 },
      li: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      jin: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
      son: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.0 },
      gam: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      gan: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 0.9 },
      gon: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
    },
    jin: {
      geon: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 0.9 },
      tae: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
      li: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      jin: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      son: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.1 },
      gam: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.0 },
      gan: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
      gon: { staminaCost: 16, kiCost: 20, timeDelay: 360, effectiveness: 0.8 },
    },
    son: {
      geon: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
      tae: { staminaCost: 16, kiCost: 20, timeDelay: 360, effectiveness: 0.8 },
      li: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.0 },
      jin: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 0.9 },
      son: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      gam: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.1 },
      gan: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      gon: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
    },
    gam: {
      geon: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.1 },
      tae: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      li: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
      jin: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.0 },
      son: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 0.9 },
      gam: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      gan: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
      gon: { staminaCost: 16, kiCost: 20, timeDelay: 360, effectiveness: 0.8 },
    },
    gan: {
      geon: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      tae: { staminaCost: 12, kiCost: 15, timeDelay: 300, effectiveness: 1.1 },
      li: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.1 },
      jin: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      son: { staminaCost: 18, kiCost: 22, timeDelay: 400, effectiveness: 1.3 },
      gam: { staminaCost: 16, kiCost: 20, timeDelay: 360, effectiveness: 0.8 },
      gan: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
      gon: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
    },
    gon: {
      geon: { staminaCost: 10, kiCost: 12, timeDelay: 240, effectiveness: 1.0 },
      tae: { staminaCost: 8, kiCost: 10, timeDelay: 200, effectiveness: 1.0 },
      li: { staminaCost: 16, kiCost: 20, timeDelay: 360, effectiveness: 0.8 },
      jin: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
      son: { staminaCost: 20, kiCost: 25, timeDelay: 450, effectiveness: 0.7 },
      gam: { staminaCost: 14, kiCost: 17, timeDelay: 320, effectiveness: 1.2 },
      gan: { staminaCost: 16, kiCost: 20, timeDelay: 360, effectiveness: 0.8 },
      gon: { staminaCost: 0, kiCost: 0, timeDelay: 0, effectiveness: 1.0 },
    },
  };

  /**
   * Get transition effectiveness between stances
   */
  public static getTransitionEffectiveness(
    from: TrigramStance,
    to: TrigramStance
  ): number {
    const transition = this.TRANSITION_MATRIX[from]?.[to];
    return transition?.effectiveness ?? 0.5;
  }

  /**
   * Calculate transition timing for frame-perfect execution
   */
  public static calculateTransitionTiming(
    from: TrigramStance,
    to: TrigramStance,
    playerSkill: number = 0.5
  ): {
    readonly frameWindow: number;
    readonly perfectTiming: number;
    readonly difficulty: number;
    readonly description: string;
  } {
    const distance = this.getStanceDistance(from, to);
    const baseFrameWindow = 30; // 30 frames base window

    // Adjust frame window based on distance and skill
    const frameWindow = Math.round(
      baseFrameWindow * (1 + distance * 0.5) * (1 - playerSkill * 0.3)
    );
    const perfectTiming = Math.round(frameWindow * 0.3); // Perfect timing is 30% into the window
    const difficulty = distance * (1 - playerSkill * 0.5);

    const description = `Transition from ${TRIGRAM_DATA[from].korean} to ${TRIGRAM_DATA[to].korean}`;

    return {
      frameWindow,
      perfectTiming,
      difficulty,
      description,
    };
  }

  /**
   * Get the distance between two stances on the trigram wheel
   */
  private static getStanceDistance(
    from: TrigramStance,
    to: TrigramStance
  ): number {
    const fromOrder = TRIGRAM_DATA[from].order;
    const toOrder = TRIGRAM_DATA[to].order;
    const directDistance = Math.abs(fromOrder - toOrder);

    // Consider circular distance around the trigram wheel (8 positions)
    const circularDistance = Math.min(directDistance, 8 - directDistance);

    // Return normalized distance (0-1 range)
    return circularDistance / 4;
  }
}
