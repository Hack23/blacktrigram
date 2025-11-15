/**
 * useAICombat Hook - AI Combat System Integration
 * 
 * Custom hook for AI combat behavior with strategic decision-making.
 *
 * Manages AI opponent behavior including:
 * - Strategic decision-making via DecisionTree
 * - Combo attack sequences
 * - Adaptive difficulty based on player skill
 * - Performance monitoring (<5ms target for decisions)
 *
 * Side effects:
 * - Manages internal state for AI actions and aggression
 * - Sets up intervals/timers for AI action scheduling (50ms loop)
 * - Updates state in response to combat events and round status
 *
 * @param config Configuration object for AI combat behavior
 * @param config.player The AI-controlled player state
 * @param config.opponent The opponent player state
 * @param config.personality The AI's personality archetype
 * @param config.adaptiveDifficulty Adaptive difficulty system instance
 * @param config.isPaused Whether the game is paused
 * @param config.roundStarted Whether the round has started
 * @param config.roundEnded Whether the round has ended
 * @param config.arenaBounds Combat arena boundaries
 * @param config.onExecuteAction Callback to execute AI actions
 * @param config.onStanceChange Optional callback for stance changes
 * 
 * @returns AI combat state and control functions
 * 
 * @example
 * ```typescript
 * const { aiState, comboSystem, adjustedPersonality } = useAICombat({
 *   player: aiPlayer,
 *   opponent: humanPlayer,
 *   personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
 *   adaptiveDifficulty,
 *   isPaused,
 *   roundStarted,
 *   roundEnded,
 *   arenaBounds,
 *   onExecuteAction: handleAction,
 *   onStanceChange: handleStanceChange,
 * });
 * ```
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerState } from "@/systems/player";
import { Position, TrigramStance } from "@/types";
import {
  AIPersonality,
  AIComboSystem,
  AdaptiveDifficulty,
  AIDecisionTree,
  AIActionType,
  CombatContext,
} from "@/systems/ai";

/**
 * AI state management
 */
interface AIState {
  nextAction: number;
  targetPosition: Position;
  lastActionType: string;
  consecutiveAttacks: number;
  actionCooldown: number;
  aggressionLevel: number;
}

/**
 * AI combat hook configuration
 */
interface UseAICombatConfig {
  readonly player: PlayerState;
  readonly opponent: PlayerState;
  readonly personality: AIPersonality;
  readonly adaptiveDifficulty: AdaptiveDifficulty;
  readonly isPaused: boolean;
  readonly roundStarted: boolean;
  readonly roundEnded: boolean;
  readonly arenaBounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly onExecuteAction: (action: string, targetPosition?: Position) => void;
  readonly onStanceChange?: (stance: TrigramStance) => void;
}

/**
 * AI combat hook return type
 */
interface UseAICombatReturn {
  readonly aiState: AIState;
  readonly comboSystem: AIComboSystem;
  readonly decisionTree: AIDecisionTree;
  readonly adjustedPersonality: AIPersonality;
  readonly executeAIAction: (action: string, targetPosition?: Position) => void;
}

/**
 * Custom hook for AI combat behavior
 */
export function useAICombat(config: UseAICombatConfig): UseAICombatReturn {
  const {
    player,
    opponent,
    personality,
    adaptiveDifficulty,
    isPaused,
    roundStarted,
    roundEnded,
    arenaBounds,
    onExecuteAction,
    onStanceChange,
  } = config;

  // Initialize AI systems (persist across renders)
  const comboSystem = useMemo(() => new AIComboSystem(), []);
  const decisionTree = useMemo(() => new AIDecisionTree(), []);

  // Adjust personality based on player skill
  const adjustedPersonality = useMemo(
    () => adaptiveDifficulty.adjustAIPersonality(personality),
    [adaptiveDifficulty, personality]
  );

  // AI state
  const [aiState, setAiState] = useState<AIState>({
    nextAction: Date.now(),
    targetPosition: player.position,
    lastActionType: "idle",
    consecutiveAttacks: 0,
    actionCooldown: 500,
    aggressionLevel: adjustedPersonality.aggressionLevel,
  });

  // Performance tracking
  const lastDecisionTimeRef = useRef(0);
  const matchStartTimeRef = useRef(Date.now());
  const previousDamageRef = useRef(0);
  const nextActionRef = useRef(Date.now());
  const consecutiveSlowDecisionsRef = useRef(0);

  /**
   * Execute AI action callback
   */
  const executeAIAction = useCallback(
    (action: string, targetPosition?: Position) => {
      onExecuteAction(action, targetPosition);
    },
    [onExecuteAction]
  );

  /**
   * Build combat context for decision-making
   */
  const buildCombatContext = useCallback((): CombatContext => {
    const dx = player.position.x - opponent.position.x;
    const dy = player.position.y - opponent.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate recent damage taken (fix for issue #2529467021)
    const recentDamageTaken = Math.max(
      0,
      player.totalDamageReceived - previousDamageRef.current
    );
    previousDamageRef.current = player.totalDamageReceived;

    return {
      playerPosition: player.position,
      opponentPosition: opponent.position,
      playerHealth: player.health,
      playerMaxHealth: player.maxHealth,
      playerKi: player.ki,
      playerMaxKi: player.maxKi,
      playerStamina: player.stamina,
      playerMaxStamina: player.maxStamina,
      opponentHealth: opponent.health,
      opponentStance: opponent.currentStance,
      playerStance: player.currentStance,
      distanceToOpponent: distance,
      timeInMatch: Date.now() - matchStartTimeRef.current,
      isOpponentAttacking: opponent.combatState === "attacking",
      recentDamageTaken,
      arenaBounds,
    };
  }, [player, opponent, arenaBounds]);

  /**
   * AI decision loop (fixed memory leak - issue #2529466989)
   */
  useEffect(() => {
    if (isPaused || !roundStarted || roundEnded) {
      return;
    }

    const aiInterval = setInterval(() => {
      const now = Date.now();

      // Respect next action time using ref (prevents stale closure)
      if (now < nextActionRef.current) {
        return;
      }

      // Performance: track decision time
      const decisionStart = performance.now();

      // Build combat context
      const context = buildCombatContext();

      // Make strategic decision
      const decision = decisionTree.makeDecision(
        context,
        adjustedPersonality,
        comboSystem
      );

      // Performance: warn if decision took too long (improved threshold - issue #2529466997)
      const decisionTime = performance.now() - decisionStart;
      if (decisionTime > 10) {
        consecutiveSlowDecisionsRef.current += 1;
        if (consecutiveSlowDecisionsRef.current >= 3) {
          console.warn(
            `AI decision took ${decisionTime.toFixed(2)}ms (3+ times in a row)`
          );
          consecutiveSlowDecisionsRef.current = 0;
        }
      } else {
        consecutiveSlowDecisionsRef.current = 0;
      }
      lastDecisionTimeRef.current = decisionTime;

      // Execute decision
      let actionType = "idle";
      let newTargetPosition = aiState.targetPosition;
      let newConsecutiveAttacks = aiState.consecutiveAttacks;

      switch (decision.action) {
        case AIActionType.ATTACK:
          actionType = "attack";
          newConsecutiveAttacks++;
          break;

        case AIActionType.TECHNIQUE:
          actionType = "technique";
          newConsecutiveAttacks++;
          break;

        case AIActionType.COMBO:
          // Start or continue combo
          if (!comboSystem.isComboActive()) {
            comboSystem.startCombo(player, opponent, adjustedPersonality);
          }
          
          if (comboSystem.shouldContinueCombo(player, opponent, adjustedPersonality)) {
            const technique = comboSystem.getNextComboTechnique();
            actionType = technique ? "technique" : "attack";
            newConsecutiveAttacks++;
          } else {
            comboSystem.resetCombo();
            actionType = "idle";
          }
          break;

        case AIActionType.DEFEND:
          actionType = "defend";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.COUNTER:
          actionType = "counter";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.RETREAT:
          actionType = "retreat";
          newTargetPosition = decision.targetPosition ?? aiState.targetPosition;
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.APPROACH:
          actionType = "approach";
          newTargetPosition = decision.targetPosition ?? opponent.position;
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.CIRCLE:
          actionType = "circle";
          newTargetPosition = decision.targetPosition ?? aiState.targetPosition;
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.STANCE_CHANGE:
          if (decision.targetStance && onStanceChange) {
            onStanceChange(decision.targetStance);
          }
          actionType = "idle";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.FEINT:
          actionType = "feint";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.WAIT:
        default:
          actionType = "idle";
          newConsecutiveAttacks = 0;
          break;
      }

      // Execute action
      executeAIAction(actionType, newTargetPosition);

      // Calculate next action cooldown
      const actionCooldown =
        actionType === "attack" || actionType === "technique" ? 600 : 400;

      // Update next action time using ref (prevents stale closure)
      nextActionRef.current = now + actionCooldown + Math.random() * 200;

      // Update AI state
      setAiState({
        nextAction: nextActionRef.current,
        targetPosition: newTargetPosition,
        lastActionType: actionType,
        consecutiveAttacks: newConsecutiveAttacks,
        actionCooldown,
        aggressionLevel: adjustedPersonality.aggressionLevel,
      });
    }, 50); // 50ms loop for responsive AI

    return () => clearInterval(aiInterval);
  }, [
    isPaused,
    roundStarted,
    roundEnded,
    buildCombatContext,
    decisionTree,
    adjustedPersonality,
    comboSystem,
    executeAIAction,
    onStanceChange,
    player,
    opponent,
  ]);

  /**
   * Reset AI state when round starts
   */
  useEffect(() => {
    if (roundStarted) {
      matchStartTimeRef.current = Date.now();
      decisionTree.reset();
      comboSystem.resetCombo();
    }
  }, [roundStarted, decisionTree, comboSystem]);

  return {
    aiState,
    comboSystem,
    decisionTree,
    adjustedPersonality,
    executeAIAction,
  };
}
