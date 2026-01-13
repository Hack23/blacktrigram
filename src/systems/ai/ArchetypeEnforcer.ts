/**
 * Archetype Behavior Enforcement System
 * 
 * Centralizes archetype-specific combat philosophy enforcement to ensure
 * each of the 5 player archetypes has immediately recognizable and distinct
 * AI behavior patterns.
 * 
 * **Korean Philosophy Integration (한국 무술 철학)**:
 * - 무사 (Musa): 명예 (Honor) - Direct, honorable combat
 * - 암살자 (Amsalja): 은밀 (Stealth) - Silent, precise takedowns
 * - 해커 (Hacker): 분석 (Analysis) - Tech-enhanced tactical combat
 * - 정보요원 (Jeongbo): 심리전 (Psychological Warfare) - Strategic manipulation
 * - 조직폭력배 (Jojik): 생존 (Survival) - Ruthless, unpredictable tactics
 * 
 * @module systems/ai/ArchetypeEnforcer
 * @category AI Combat
 * @korean 원형 행동 강화 시스템
 */

import { PlayerArchetype } from "@/types";
import { AIDecision, AIActionType, CombatContext } from "./types";

/**
 * Archetype enforcement rules defining distinct combat behaviors
 * 
 * Each archetype has:
 * - Preferred actions (used most frequently)
 * - Prohibited actions (never used due to philosophy)
 * - Signature move (iconic technique with specific trigger condition)
 * - Action frequencies (target distribution percentages)
 * 
 * **Note on Action Frequencies**:
 * These values represent **target frequencies/proportions** for each action type
 * rather than a single normalized probability distribution. Multiple actions can have
 * high target frequencies because they can occur in overlapping situations:
 * - ATTACK (70%) and TECHNIQUE (70%) both represent aggressive behavior
 * - STANCE_CHANGE (80%) occurs frequently but doesn't prevent other actions
 * - The frequencies serve as **behavioral targets** to guide AI personality,
 *   and are not required to sum to 100% across all actions
 * 
 * @korean 원형 강화 규칙
 */
export interface ArchetypeEnforcementRules {
  /** Actions this archetype uses most frequently */
  readonly preferredActions: readonly AIActionType[];
  
  /** Actions this archetype never uses (philosophy conflicts) */
  readonly prohibitedActions: readonly AIActionType[];
  
  /** Signature technique ID for this archetype */
  readonly signatureMove: string;
  
  /** Condition function to trigger signature move */
  readonly signatureCondition: (context: CombatContext) => boolean;
  
  /** Target frequency distribution for each action type (0.0-1.0) */
  readonly actionFrequencies: Readonly<Record<AIActionType, number>>;
}

/**
 * Archetype enforcement rules for all 5 player archetypes
 * 
 * Defines distinct combat philosophies with measurable behavior patterns
 * that make each archetype immediately identifiable through AI actions.
 * 
 * @korean 5대 원형 강화 규칙
 */
export const ARCHETYPE_ENFORCEMENT: Record<PlayerArchetype, ArchetypeEnforcementRules> = {
  [PlayerArchetype.MUSA]: {
    preferredActions: [AIActionType.ATTACK, AIActionType.APPROACH, AIActionType.TECHNIQUE],
    prohibitedActions: [AIActionType.FEINT], // Honor code: No deception
    signatureMove: "musa_mountain_breaker",
    signatureCondition: (context) => {
      /**
       * Musa (무사) signature move condition: Mountain Breaker when opponent <40% health
       * 
       * NOTE: Uses opponentMaxHealth if available, otherwise assumes symmetric max-health
       * pools (context.playerMaxHealth === opponentMaxHealth). If asymmetric max health
       * exists, CombatContext provides opponentMaxHealth for accurate calculation.
       */
      const maxHealth = context.opponentMaxHealth ?? context.playerMaxHealth;
      if (maxHealth <= 0) {
        // Defensive guard: avoid divide-by-zero / invalid percentages
        return false;
      }
      const opponentHealthPercent = context.opponentHealth / maxHealth;
      return opponentHealthPercent < 0.40; // Finishing move when opponent <40% health
    },
    actionFrequencies: {
      /**
       * Musa (무사) Action Frequencies - Honor Code Warrior
       * 
       * These frequencies represent behavioral targets (not strict probability distributions).
       * Multiple actions can have high frequencies as they represent overlapping aggressive behavior.
       * 
       * **Honor Code Rules**:
       * - FEINT: 0% (prohibited - no deception)
       * - RETREAT: 2% (minimal - only at critical health <10%, handled by evaluateSurvival)
       * - DEFEND: 10% (minimal - offense-focused philosophy)
       * 
       * The 2% retreat frequency applies only when health drops below the honor threshold (~5-10%),
       * enforced by evaluateSurvival logic. Above this threshold, Musa never retreats.
       */
      [AIActionType.ATTACK]: 0.70, // 70% aggressive attacks
      [AIActionType.DEFEND]: 0.10, // 10% defense (honor code: minimal defense)
      [AIActionType.RETREAT]: 0.02, // 2% retreat (only at critical health <10%)
      [AIActionType.APPROACH]: 0.15, // 15% approach
      [AIActionType.FEINT]: 0.00, // 0% feints (prohibited by honor code)
      [AIActionType.TECHNIQUE]: 0.70, // 70% techniques (overlaps with attack)
      [AIActionType.COUNTER]: 0.10, // 10% counters
      [AIActionType.STANCE_CHANGE]: 0.10, // 10% stance changes
      [AIActionType.CIRCLE]: 0.05, // 5% circling
      [AIActionType.WAIT]: 0.03, // 3% wait
      [AIActionType.COMBO]: 0.05, // 5% combos
    },
  },

  [PlayerArchetype.AMSALJA]: {
    preferredActions: [AIActionType.TECHNIQUE, AIActionType.CIRCLE, AIActionType.COUNTER],
    prohibitedActions: [], // No prohibitions (pragmatic assassin)
    signatureMove: "amsalja_silent_death",
    signatureCondition: (context) => {
      // Execute Silent Death when opponent is VULNERABLE or worse
      return (
        context.opponentBalance === "VULNERABLE" ||
        context.opponentBalance === "HELPLESS"
      );
    },
    actionFrequencies: {
      [AIActionType.TECHNIQUE]: 0.60, // 60% techniques (vital point priority)
      [AIActionType.CIRCLE]: 0.20, // 20% circling (stealth positioning to flanks/rear)
      [AIActionType.ATTACK]: 0.15, // 15% basic attacks
      [AIActionType.RETREAT]: 0.05, // 5% tactical retreats (at 60% health threshold)
      [AIActionType.DEFEND]: 0.10, // 10% defense
      [AIActionType.APPROACH]: 0.10, // 10% approach
      [AIActionType.FEINT]: 0.10, // 10% feints
      [AIActionType.COUNTER]: 0.20, // 20% counters
      [AIActionType.STANCE_CHANGE]: 0.15, // 15% stance changes
      [AIActionType.WAIT]: 0.05, // 5% wait
      [AIActionType.COMBO]: 0.10, // 10% combos
    },
  },

  [PlayerArchetype.HACKER]: {
    preferredActions: [AIActionType.WAIT, AIActionType.TECHNIQUE, AIActionType.CIRCLE],
    prohibitedActions: [], // Analytical, uses all tactics
    signatureMove: "hacker_system_crash",
    signatureCondition: (context) => {
      // Execute System Crash after 20 seconds of observation (data collection phase)
      return context.timeInMatch > 20000;
    },
    actionFrequencies: {
      [AIActionType.WAIT]: 0.25, // 25% observation (data collection)
      [AIActionType.TECHNIQUE]: 0.40, // 40% tech-assisted strikes
      [AIActionType.CIRCLE]: 0.15, // 15% repositioning (maintain mid-range)
      [AIActionType.ATTACK]: 0.15, // 15% basic attacks
      [AIActionType.DEFEND]: 0.05, // 5% defense
      [AIActionType.APPROACH]: 0.05, // 5% approach (prefers mid-range)
      [AIActionType.RETREAT]: 0.10, // 10% retreat (maintain optimal distance)
      [AIActionType.FEINT]: 0.05, // 5% feints
      [AIActionType.COUNTER]: 0.15, // 15% counters
      [AIActionType.STANCE_CHANGE]: 0.10, // 10% stance changes
      [AIActionType.COMBO]: 0.05, // 5% combos
    },
  },

  [PlayerArchetype.JEONGBO_YOWON]: {
    preferredActions: [AIActionType.FEINT, AIActionType.COUNTER, AIActionType.TECHNIQUE],
    prohibitedActions: [], // Psychological warfare, uses all tactics
    signatureMove: "jeongbo_precision_takedown",
    signatureCondition: (context) => {
      // Execute Precision Takedown when opponent is HELPLESS (implemented in Issue #1186)
      return context.opponentBalance === "HELPLESS";
    },
    actionFrequencies: {
      [AIActionType.FEINT]: 0.30, // 30% psychological pressure (feints)
      [AIActionType.TECHNIQUE]: 0.35, // 35% precision strikes
      [AIActionType.COUNTER]: 0.20, // 20% counters
      [AIActionType.WAIT]: 0.10, // 10% observation (strategic timing)
      [AIActionType.ATTACK]: 0.05, // 5% basic attacks
      [AIActionType.DEFEND]: 0.10, // 10% defense
      [AIActionType.APPROACH]: 0.10, // 10% approach
      [AIActionType.RETREAT]: 0.05, // 5% tactical retreats
      [AIActionType.CIRCLE]: 0.15, // 15% circling (intimidation)
      [AIActionType.STANCE_CHANGE]: 0.10, // 10% stance changes
      [AIActionType.COMBO]: 0.05, // 5% combos
    },
  },

  [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
    preferredActions: [AIActionType.ATTACK, AIActionType.TECHNIQUE, AIActionType.STANCE_CHANGE],
    prohibitedActions: [], // No rules, survival at any cost
    signatureMove: "jojik_improvised_weapon",
    signatureCondition: (context) => {
      /**
       * Jojik (조직폭력배) signature move: Improvised Weapon when desperate (<30% health)
       * 
       * This condition uses playerHealth (the AI's health) to trigger desperate tactics.
       */
      const maxHealth = context.playerMaxHealth;
      if (maxHealth <= 0) {
        // Defensive guard: avoid divide-by-zero
        return false;
      }
      const playerHealthPercent = context.playerHealth / maxHealth;
      return playerHealthPercent < 0.30; // Desperate improvised weapon when health <30%
    },
    actionFrequencies: {
      /**
       * Jojik (조직폭력배) Action Frequencies - Chaotic Survivor
       * 
       * These frequencies represent behavioral targets for Jojik's unpredictable fighting style.
       * 
       * **Key Behavioral Characteristics**:
       * - STANCE_CHANGE: 80% (extremely high for unpredictability)
       *   This means that in approximately 80% of decision cycles where a stance change
       *   is a valid option, the AI will evaluate and strongly favor a stance change,
       *   creating the erratic, chaotic movement pattern that defines Jojik's combat style.
       * 
       * - RETREAT: 5% base, but survival instinct triggers tactical retreat at 70% health
       *   (handled by evaluateSurvival logic with personality.tacticalRetreatThreshold)
       * 
       * The high stance change frequency is the primary mechanism for Jojik's unpredictable behavior.
       */
      [AIActionType.ATTACK]: 0.50, // 50% chaotic attacks
      [AIActionType.TECHNIQUE]: 0.25, // 25% dirty techniques
      [AIActionType.STANCE_CHANGE]: 0.80, // 80% unpredictable stance changes (defines chaotic behavior)
      [AIActionType.RETREAT]: 0.05, // 5% pragmatic retreats (survival instinct at 70% health via threshold)
      [AIActionType.FEINT]: 0.05, // 5% deceptive moves
      [AIActionType.DEFEND]: 0.10, // 10% defense
      [AIActionType.APPROACH]: 0.15, // 15% approach
      [AIActionType.COUNTER]: 0.10, // 10% counters
      [AIActionType.CIRCLE]: 0.10, // 10% circling
      [AIActionType.WAIT]: 0.03, // 3% wait
      [AIActionType.COMBO]: 0.10, // 10% combos
    },
  },
};

/**
 * Enforce archetype-specific behavior on AI decision
 * 
 * Applies philosophy-based restrictions and redirects to enforce distinct
 * combat patterns for each archetype. This ensures players can identify
 * which archetype they're fighting based on behavior alone.
 * 
 * **Enforcement Logic**:
 * 1. Check for prohibited actions → Replace with preferred action
 * 2. Check for signature move condition → Override with signature move
 * 3. Return decision (possibly modified)
 * 
 * @korean 원형 행동 강화
 * 
 * @param decision - Original AI decision from DecisionTree
 * @param archetype - Player archetype to enforce
 * @param context - Current combat context
 * @returns Modified decision enforcing archetype philosophy
 */
export function enforceArchetypeBehavior(
  decision: AIDecision,
  archetype: PlayerArchetype,
  context: CombatContext
): AIDecision {
  const rules = ARCHETYPE_ENFORCEMENT[archetype];

  // Check for prohibited actions
  if (rules.prohibitedActions.includes(decision.action)) {
    // Replace with preferred action (random selection from preferred set)
    // Defensive guard: Ensure preferredActions is not empty
    if (rules.preferredActions.length === 0) {
      console.warn(
        `[ArchetypeEnforcer] ${archetype} has empty preferredActions array. Using original decision with warning.`
      );
      return {
        ...decision,
        reason: `Archetype enforcement: ${archetype} prohibited action ${decision.action}, but no alternatives available`,
      };
    }

    const alternativeAction = rules.preferredActions[
      Math.floor(Math.random() * rules.preferredActions.length)
    ];

    return {
      ...decision,
      action: alternativeAction,
      reason: `Archetype enforcement: ${archetype} does not use ${decision.action} (원형 강화: ${decision.action} 사용 불가)`,
    };
  }

  // Check for signature move condition
  if (rules.signatureCondition(context)) {
    // Override with signature move
    return {
      action: AIActionType.TECHNIQUE,
      targetVitalPoint: undefined, // Let technique selection handle vital point targeting
      priority: 10, // Maximum priority
      reason: `Signature move: ${rules.signatureMove} for ${archetype} (서명 기술: ${rules.signatureMove})`,
    };
  }

  // No enforcement needed - return original decision
  return decision;
}

/**
 * Get signature move ID for archetype
 * 
 * Returns the technique ID of this archetype's signature move.
 * Used for technique selection in useAICombat.ts.
 * 
 * @korean 서명 기술 ID 가져오기
 * 
 * @param archetype - Player archetype
 * @returns Signature technique ID
 */
export function getSignatureMove(archetype: PlayerArchetype): string {
  return ARCHETYPE_ENFORCEMENT[archetype].signatureMove;
}

/**
 * Check if signature move condition is met
 * 
 * Evaluates whether the archetype should execute its signature move
 * based on current combat context.
 * 
 * @korean 서명 기술 조건 확인
 * 
 * @param archetype - Player archetype
 * @param context - Current combat context
 * @returns True if signature move should be executed
 */
export function shouldExecuteSignatureMove(
  archetype: PlayerArchetype,
  context: CombatContext
): boolean {
  const rules = ARCHETYPE_ENFORCEMENT[archetype];
  return rules.signatureCondition(context);
}

/**
 * Get action frequency target for archetype
 * 
 * Returns the target frequency (0.0-1.0) for a specific action type
 * based on archetype combat philosophy.
 * 
 * @korean 행동 빈도 목표 가져오기
 * 
 * @param archetype - Player archetype
 * @param actionType - AI action type
 * @returns Target frequency for this action (0.0-1.0)
 */
export function getActionFrequency(
  archetype: PlayerArchetype,
  actionType: AIActionType
): number {
  return ARCHETYPE_ENFORCEMENT[archetype].actionFrequencies[actionType] ?? 0.0;
}

/**
 * Check if action is prohibited for archetype
 * 
 * Returns true if the archetype's philosophy prohibits using this action.
 * 
 * @korean 금지된 행동 확인
 * 
 * @param archetype - Player archetype
 * @param actionType - AI action type to check
 * @returns True if action is prohibited
 */
export function isActionProhibited(
  archetype: PlayerArchetype,
  actionType: AIActionType
): boolean {
  return ARCHETYPE_ENFORCEMENT[archetype].prohibitedActions.includes(actionType);
}
