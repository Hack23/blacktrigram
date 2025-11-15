/**
 * useAICombat Hook - AI Combat System Integration
 * Manages AI decision-making, combos, and adaptive difficulty
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
      recentDamageTaken: Math.max(
        0,
        player.totalDamageReceived - (player.totalDamageReceived || 0)
      ),
      arenaBounds,
    };
  }, [player, opponent, arenaBounds]);

  /**
   * AI decision loop
   */
  useEffect(() => {
    if (isPaused || !roundStarted || roundEnded) {
      return;
    }

    const aiInterval = setInterval(() => {
      const now = Date.now();

      // Respect next action time
      if (now < aiState.nextAction) {
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

      // Performance: log if decision took too long
      const decisionTime = performance.now() - decisionStart;
      if (decisionTime > 5) {
        console.warn(`AI decision took ${decisionTime.toFixed(2)}ms`);
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

      // Update AI state
      setAiState({
        nextAction: now + actionCooldown + Math.random() * 200,
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
    aiState.nextAction,
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
