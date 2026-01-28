/**
 * AI Counter-Attack Integration Example
 *
 * **Korean**: AI 반격 통합 예제 (AI Banggyeok Tonghap Yeje)
 *
 * Demonstrates how the AI DecisionTree can integrate with LimbExposureSystem
 * to intelligently detect and exploit opponent vulnerabilities during combat.
 *
 * This serves as both documentation and a template for implementing
 * counter-attack awareness in the AI system.
 *
 * @module systems/combat/AICounterAttackIntegration
 * @korean AI반격통합
 */

import type { KoreanTechnique } from "../vitalpoint/types";
import type { PlayerState } from "../player";
import type { CounterOpportunity } from "../../types/physics";
import {
  calculateCounterOpportunity,
  calculateVulnerabilityMultiplier,
  canExecuteCounter,
  mapLimbToBreakingTarget,
} from "./LimbExposureSystem";

/**
 * Extended combat context with limb exposure awareness.
 *
 * **Korean**: 사지 노출 인식 전투 상황
 *
 * Extends the existing CombatContext type with information about
 * opponent's exposed limbs and counter-attack opportunities.
 */
export interface CounterAwareCombatContext {
  /** Player executing technique */
  readonly player: PlayerState;

  /** Opponent state */
  readonly opponent: PlayerState;

  /** Distance between combatants (meters) */
  readonly distance: number;

  /** Opponent's current technique (if executing) */
  readonly opponentTechnique?: KoreanTechnique;

  /** Time elapsed in opponent's technique execution (ms) */
  readonly opponentTechniqueTime?: number;

  /** Detected counter opportunity (if any) */
  readonly counterOpportunity?: CounterOpportunity;

  /** Opponent's current vulnerability multiplier */
  readonly opponentVulnerability: number;
}

/**
 * Analyze combat context for counter-attack opportunities.
 *
 * **Korean**: 반격 기회 분석
 *
 * Evaluates the current combat situation to detect if the opponent
 * has exposed limbs that can be exploited for counter-attacks.
 *
 * **TEMPLATE/EXAMPLE IMPLEMENTATION**: This function demonstrates the
 * integration pattern but requires PlayerState to track currentTechnique
 * and techniqueElapsedTime fields before it can be fully functional.
 *
 * @param player - The AI-controlled player
 * @param opponent - The opponent player
 * @param distance - Distance between combatants
 * @returns Enhanced combat context with counter-attack data
 *
 * @remarks
 * TODO: PlayerState needs to be extended with:
 * - currentTechnique?: KoreanTechnique
 * - techniqueElapsedTime?: number
 * Once these fields exist, remove the undefined assignments and use actual data.
 *
 * @example
 * ```typescript
 * const context = analyzeCounterOpportunity(aiPlayer, humanPlayer, 0.8);
 * if (context.counterOpportunity?.allowsBreaking) {
 *   // AI can execute breaking technique!
 *   const breakingTechnique = selectBreakingTechnique(context);
 *   executeTechnique(aiPlayer, breakingTechnique);
 * }
 * ```
 */
export function analyzeCounterOpportunity(
  player: PlayerState,
  opponent: PlayerState,
  distance: number
): CounterAwareCombatContext {
  let counterOpportunity: CounterOpportunity | undefined;
  let opponentVulnerability = 1.0;

  // TODO: Replace with actual PlayerState properties once available
  // PlayerState needs: currentTechnique?: KoreanTechnique, techniqueElapsedTime?: number
  const opponentTechnique = undefined as KoreanTechnique | undefined;
  const opponentTechniqueTime = undefined as number | undefined;

  if (opponentTechnique && opponentTechniqueTime !== undefined) {
    // Calculate counter opportunity
    counterOpportunity = calculateCounterOpportunity(
      opponentTechnique,
      opponentTechniqueTime
    );

    // Calculate vulnerability multiplier
    opponentVulnerability = calculateVulnerabilityMultiplier(
      opponentTechnique,
      opponentTechniqueTime
    );
  }

  return {
    player,
    opponent,
    distance,
    opponentTechnique,
    opponentTechniqueTime,
    counterOpportunity,
    opponentVulnerability,
  };
}

/**
 * AI decision priorities for counter-attack scenarios.
 *
 * **Korean**: AI 반격 우선순위
 */
export enum CounterAttackPriority {
  /** Ignore counter, continue offense */
  IGNORE = 0,

  /** Low priority, only if perfect opportunity */
  LOW = 1,

  /** Medium priority, consider if favorable */
  MEDIUM = 2,

  /** High priority, strongly favor counter */
  HIGH = 3,

  /** Maximum priority, always counter */
  CRITICAL = 4,
}

/**
 * Determine AI's priority for executing a counter-attack.
 *
 * **Korean**: 반격 우선순위 결정
 *
 * Calculates how strongly the AI should favor a counter-attack
 * based on archetype, personality, and opportunity quality.
 *
 * @param context - Combat context with counter opportunity
 * @param aiArchetype - AI's player archetype
 * @param aiPersonality - AI personality traits
 * @returns Priority level for counter-attack
 */
export function calculateCounterPriority(
  context: CounterAwareCombatContext,
  aiArchetype: string,
  aiPersonality: { defensiveness: number; aggression: number }
): CounterAttackPriority {
  const { counterOpportunity, opponentVulnerability, distance } = context;

  // No opportunity = no priority
  if (!counterOpportunity) {
    return CounterAttackPriority.IGNORE;
  }

  // Too far to counter effectively
  if (distance > 1.0) {
    return CounterAttackPriority.IGNORE;
  }

  let priorityScore = 0;

  // Archetype modifiers
  if (aiArchetype === "musa") {
    // Traditional warrior - moderate counter preference
    priorityScore += 1;
  } else if (aiArchetype === "amsalja") {
    // Assassin - high counter preference (exploit weaknesses)
    priorityScore += 3;
  } else if (aiArchetype === "jeongbo-yowon") {
    // Intelligence operative - analytical counters
    priorityScore += 2;
  }

  // Personality modifiers
  priorityScore += aiPersonality.defensiveness * 2; // Defensive AI favors counters
  priorityScore -= aiPersonality.aggression * 0.5; // Aggressive AI may ignore

  // Opportunity quality modifiers
  if (counterOpportunity.allowsBreaking) {
    priorityScore += 2; // Breaking opportunities are high value
  }

  if (counterOpportunity.vulnerabilityMultiplier > 2.0) {
    priorityScore += 1; // High vulnerability is attractive
  }

  if (opponentVulnerability > 1.8) {
    priorityScore += 1; // Very vulnerable opponent
  }

  // Convert score to priority enum
  if (priorityScore >= 6) return CounterAttackPriority.CRITICAL;
  if (priorityScore >= 4) return CounterAttackPriority.HIGH;
  if (priorityScore >= 2) return CounterAttackPriority.MEDIUM;
  if (priorityScore >= 1) return CounterAttackPriority.LOW;
  return CounterAttackPriority.IGNORE;
}

/**
 * Select the best counter-technique for the opportunity.
 *
 * **Korean**: 최적 반격 기술 선택
 *
 * Chooses an appropriate counter-technique from the AI's available
 * techniques based on the exposed limb and opportunity window.
 *
 * @param context - Combat context with counter opportunity
 * @param availableTechniques - AI's available techniques
 * @returns Selected counter technique, or undefined if none suitable
 */
export function selectCounterTechnique(
  context: CounterAwareCombatContext,
  availableTechniques: readonly KoreanTechnique[]
): KoreanTechnique | undefined {
  const { counterOpportunity, player } = context;

  if (!counterOpportunity) {
    return undefined;
  }

  // Get breaking target from exposed limb
  const breakingTarget = mapLimbToBreakingTarget(
    counterOpportunity.exposedLimb
  );

  // Filter to suitable counter techniques
  const validCounters = availableTechniques.filter((technique) => {
    // Check if technique is in recommended counters
    if (
      counterOpportunity.recommendedCounters &&
      counterOpportunity.recommendedCounters.includes(technique.id)
    ) {
      return true;
    }

    // Check if technique type matches breaking target
    if (breakingTarget === "knee" || breakingTarget === "ankle") {
      return technique.reachConfig.bodyPart === "leg";
    } else if (breakingTarget === "elbow" || breakingTarget === "wrist") {
      return technique.reachConfig.bodyPart === "arm";
    }

    return false;
  });

  if (validCounters.length === 0) {
    return undefined;
  }

  // Filter by stamina availability
  const affordableCounters = validCounters.filter((technique) =>
    canExecuteCounter(player.stamina, technique, context.distance)
  );

  if (affordableCounters.length === 0) {
    return undefined;
  }

  // Select highest damage technique
  return affordableCounters.reduce((best, current) =>
    current.damage > best.damage ? current : best
  );
}

/**
 * Example AI decision flow integrating counter-attacks.
 *
 * **Korean**: AI 반격 의사결정 흐름 예제
 *
 * Demonstrates a complete decision cycle for an AI combatant
 * that can recognize and exploit counter-attack opportunities.
 *
 * @example
 * ```typescript
 * // In AI combat loop:
 * const context = analyzeCounterOpportunity(ai, human, distance);
 * const decision = aiDecisionWithCounters(context, ai.techniques);
 *
 * if (decision.action === "counter") {
 *   executeTechnique(ai, decision.technique!);
 * }
 * ```
 */
export function aiDecisionWithCounters(
  context: CounterAwareCombatContext,
  availableTechniques: readonly KoreanTechnique[]
): {
  action: "counter" | "attack" | "defend" | "reposition";
  technique?: KoreanTechnique;
  reason: string;
} {
  const aiArchetype = context.player.archetype;
  const aiPersonality = {
    defensiveness: 0.7, // Example values
    aggression: 0.3,
  };

  // Analyze counter opportunity priority
  const counterPriority = calculateCounterPriority(
    context,
    aiArchetype,
    aiPersonality
  );

  // High priority counters take precedence
  if (counterPriority >= CounterAttackPriority.HIGH) {
    const counterTechnique = selectCounterTechnique(
      context,
      availableTechniques
    );

    if (counterTechnique) {
      return {
        action: "counter",
        technique: counterTechnique,
        reason: `Exploiting exposed ${context.counterOpportunity?.exposedLimb} with breaking technique`,
      };
    }
  }

  // Medium priority counters compete with normal actions
  if (counterPriority === CounterAttackPriority.MEDIUM) {
    const counterTechnique = selectCounterTechnique(
      context,
      availableTechniques
    );

    // 60% chance to take counter over normal attack
    if (counterTechnique && Math.random() < 0.6) {
      return {
        action: "counter",
        technique: counterTechnique,
        reason: `Opportunistic counter on ${context.counterOpportunity?.exposedLimb}`,
      };
    }
  }

  // Default to standard AI logic (attack, defend, etc.)
  // This would integrate with existing DecisionTree logic
  return {
    action: "attack",
    reason: "Standard offense, no priority counter available",
  };
}

/**
 * Integration points for existing AI DecisionTree.
 *
 * **Korean**: 기존 AI 의사결정 트리 통합 지점
 */
export const AI_INTEGRATION_POINTS = {
  /**
   * 1. CombatContext Enhancement
   * Extend the existing CombatContext interface with limb exposure data.
   * Location: src/systems/ai/types.ts
   */
  ENHANCE_COMBAT_CONTEXT: "Add counterOpportunity and opponentVulnerability fields",

  /**
   * 2. Decision Tree Evaluation
   * Add counter-attack evaluation before standard action selection.
   * Location: src/systems/ai/DecisionTree.ts - makeDecision()
   */
  EVALUATE_COUNTERS_FIRST: "Call analyzeCounterOpportunity() at decision start",

  /**
   * 3. Action Selection Priority
   * Integrate counter priority with existing action selection logic.
   * Location: src/systems/ai/DecisionTree.ts - selectAction()
   */
  PRIORITIZE_COUNTERS: "Check counter priority before attack/defend decisions",

  /**
   * 4. Technique Filtering
   * Filter available techniques to include counter-specific moves.
   * Location: src/systems/ai/DecisionTree.ts - selectTechnique()
   */
  INCLUDE_COUNTER_TECHNIQUES: "Add breaking techniques to available moves",

  /**
   * 5. Personality Tuning
   * Adjust AI personality traits to influence counter behavior.
   * Location: src/systems/ai/AIPersonality.ts
   */
  TUNE_DEFENSIVENESS: "Defensive archetypes should favor counters",
} as const;

export default {
  analyzeCounterOpportunity,
  calculateCounterPriority,
  selectCounterTechnique,
  aiDecisionWithCounters,
  AI_INTEGRATION_POINTS,
};
