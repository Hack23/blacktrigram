/**
 * useAICombat Hook - AI Combat System Integration
 *
 * Custom hook for AI combat behavior with strategic decision-making.
 *
 * Manages AI opponent behavior including:
 * - Strategic decision-making via DecisionTree
 * - Combo attack sequences
 * - Adaptive difficulty based on player skill
 * - Performance monitoring (<10ms target for decisions)
 *
 * Side effects:
 * - Manages internal state for AI actions and aggression
 * - Sets up intervals/timers for AI action scheduling
 * - Updates state in response to combat events and round status
 *
 * @param config Configuration object for AI combat behavior.
 * @param config.player The AI-controlled player state.
 * @param config.opponent The opponent player state.
 * @param config.personality The AI's personality archetype.
 * @param config.adaptiveDifficulty Adaptive difficulty system instance.
 * @param config.arenaBounds Arena boundaries for movement validation.
 * @param config.roundStarted Whether the combat round has started.
 * @param config.roundEnded Whether the combat round has ended.
 * @param config.isPaused Whether the game is paused.
 * @param config.onExecuteAction Callback to execute AI actions.
 * @param config.onStanceChange Callback to handle stance changes.
 *
 * @returns AI combat state and control functions
 *
 * @example
 * ```typescript
 * const { aiState } = useAICombat({
 *   player: aiPlayer,
 *   opponent: humanPlayer,
 *   personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
 *   adaptiveDifficulty,
 *   arenaBounds,
 *   roundStarted,
 *   roundEnded,
 *   isPaused,
 *   onExecuteAction: handleAction,
 *   onStanceChange: handleStanceChange,
 * });
 * ```
 */

import {
  AdaptiveDifficulty,
  AIActionType,
  AIComboSystem,
  AIDecisionTree,
  AIPersonality,
  CombatContext,
} from "@/systems/ai";
import { PlayerState } from "@/systems/player";
import { Position, TrigramStance } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KoreanTechniquesSystem } from "@/systems/trigram/KoreanTechniques";
import { KoreanTechnique } from "@/systems/vitalpoint/types";
import {
  KOREAN_VITAL_POINTS,
} from "@/systems/vitalpoint/KoreanVitalPoints";

// Performance monitoring constants
const AI_DECISION_THRESHOLD_MS = 10; // Threshold for slow decision warnings
const WARNING_THROTTLE_MS = 5000; // Throttle performance warnings to every 5 seconds

/**
 * Technique range constants (pixels)
 * Based on game design: 1 cell = ~40px, 2 cells = ~80px, 3 cells = ~120px
 * 
 * Each technique has a range property in cell units (e.g., 1.0 = 1 cell = 40px)
 * 
 * @korean 기술 범위 상수
 */
const CELL_SIZE = 40; // Size of one grid cell in pixels

/**
 * Get viable techniques based on distance, stance, and stamina
 * 
 * Filters techniques that:
 * - Match current stance
 * - Are within effective range of opponent
 * - Have sufficient stamina to execute
 * - Applies selection bias against recently used techniques (avoid >70% repetition)
 * 
 * @korean 거리, 자세, 체력에 따른 실행 가능한 기술 선택
 * 
 * @param distance - Distance to opponent in pixels
 * @param stance - Current trigram stance
 * @param stamina - Available stamina
 * @param archetype - Player archetype for specialized techniques
 * @param recentTechniques - Array of recently used technique IDs (for variation)
 * @returns Array of viable techniques sorted by effectiveness with variation bias
 */
function getViableTechniques(
  distance: number,
  stance: TrigramStance,
  stamina: number,
  archetype: PlayerState["archetype"],
  recentTechniques: string[] = []
): readonly KoreanTechnique[] {
  // Get all available techniques for stance and archetype
  const stanceTechniques =
    KoreanTechniquesSystem.getAllAvailableTechniques(stance, archetype);

  // Early return if no techniques available
  if (stanceTechniques.length === 0) {
    return [];
  }

  // Filter techniques that are viable for current situation
  const viableTechniques = stanceTechniques.filter((tech) => {
    // Calculate technique effective range
    // tech.range is in cell units (e.g., 1.0 = 1 cell = 40px, 2.0 = 2 cells = 80px)
    const minRange = 0; // All techniques can be used at close range
    const maxRange = tech.range * CELL_SIZE; // Convert cell units to pixels

    // Check if opponent is within technique range
    const inRange = distance >= minRange && distance <= maxRange;

    // Check if player has sufficient stamina
    const hasStamina = stamina >= tech.staminaCost;

    return inRange && hasStamina;
  });

  // Pre-compute recent use counts for efficiency (avoid O(n²×m) in sort)
  const recentUseCounts = new Map<string, number>();
  for (const tech of viableTechniques) {
    recentUseCounts.set(
      tech.id,
      recentTechniques.filter((id) => id === tech.id).length
    );
  }

  // Sort by effectiveness with variation bias
  return viableTechniques.sort((a, b) => {
    // Base effectiveness: damage × accuracy
    const baseEffectivenessA = (a.damage ?? 0) * (a.accuracy ?? 0.8);
    const baseEffectivenessB = (b.damage ?? 0) * (b.accuracy ?? 0.8);

    // Apply penalty for recently used techniques (avoid repetition)
    const recentUsesA = recentUseCounts.get(a.id) ?? 0;
    const recentUsesB = recentUseCounts.get(b.id) ?? 0;
    
    // Penalty: 20% reduction per recent use (max 60% penalty for 3+ uses)
    const penaltyA = Math.min(0.6, recentUsesA * 0.2);
    const penaltyB = Math.min(0.6, recentUsesB * 0.2);
    
    const finalEffectivenessA = baseEffectivenessA * (1 - penaltyA);
    const finalEffectivenessB = baseEffectivenessB * (1 - penaltyB);

    return finalEffectivenessB - finalEffectivenessA;
  });
}

/**
 * Select optimal vital point for attack based on stance compatibility
 * 
 * Prioritizes vital points by:
 * 1. Stance compatibility (must be in effectiveStances array)
 * 2. Base damage threshold (>25 damage preferred)
 * 3. Targeting difficulty vs AI skill level
 * 
 * @korean 자세 효과에 따른 최적 급소 선택
 * 
 * @param stance - Current trigram stance
 * @param difficultyLevel - AI difficulty level (0.0-1.0)
 * @returns Vital point ID or null if no suitable target
 */
function selectOptimalVitalPoint(
  stance: TrigramStance,
  difficultyLevel: number
): string | null {
  // Guard: Ensure vital points are available
  if (KOREAN_VITAL_POINTS.length === 0) {
    return null;
  }

  // Filter vital points effective for current stance
  const effectivePoints = KOREAN_VITAL_POINTS.filter((point) =>
    point.effectiveStances?.includes(stance)
  );

  if (effectivePoints.length === 0) {
    // Fallback: select any vital point if no stance-specific ones available
    const fallbackPoint =
      KOREAN_VITAL_POINTS[
        Math.floor(Math.random() * KOREAN_VITAL_POINTS.length)
      ];
    return fallbackPoint?.id ?? null;
  }

  // Damage threshold for high-priority targets
  const HIGH_DAMAGE_THRESHOLD = 25;
  
  // Filter by damage threshold (prefer high-damage vital points)
  const highDamagePoints = effectivePoints.filter(
    (point) => (point.baseDamage ?? 0) > HIGH_DAMAGE_THRESHOLD
  );

  const targetPoints =
    highDamagePoints.length > 0
      ? highDamagePoints
      : effectivePoints;

  // Sort by targeting suitability based on AI difficulty
  const sortedPoints = [...targetPoints].sort((a, b) => {
    // Calculate suitability score
    const suitabilityA =
      (a.baseDamage ?? 0) * (1 - Math.abs(difficultyLevel - a.targetingDifficulty));
    const suitabilityB =
      (b.baseDamage ?? 0) * (1 - Math.abs(difficultyLevel - b.targetingDifficulty));
    return suitabilityB - suitabilityA;
  });

  // Select top-rated target
  return sortedPoints[0]?.id ?? null;
}

/**
 * Helper to select technique for AI action with reduced duplication
 * 
 * @param isSpecialTechnique - Whether to filter for high-cost special techniques
 * @param context - Current combat context
 * @param player - AI player state
 * @param adaptiveDifficulty - Adaptive difficulty system
 * @param recentTechniques - Recently used technique IDs for variation
 * @returns Selected technique, vital point, and action type
 */
function selectTechniqueForAction(
  isSpecialTechnique: boolean,
  context: CombatContext,
  player: PlayerState,
  adaptiveDifficulty: AdaptiveDifficulty,
  recentTechniques: string[]
): { technique?: KoreanTechnique; vitalPoint?: string; actionType: string } {
  const viableTechniques = getViableTechniques(
    context.distanceToOpponent,
    player.currentStance,
    player.stamina,
    player.archetype,
    recentTechniques
  );

  const candidates = isSpecialTechnique
    ? viableTechniques.filter((tech) => tech.kiCost >= 10 || tech.staminaCost >= 15)
    : viableTechniques;

  if (candidates.length > 0) {
    const technique = candidates[0];
    const difficultyLevel = adaptiveDifficulty.calculatePlayerSkill();
    const vitalPoint = selectOptimalVitalPoint(player.currentStance, difficultyLevel) ?? undefined;
    return { 
      technique, 
      vitalPoint, 
      actionType: isSpecialTechnique ? "technique" : "attack" 
    };
  }

  // Fallback logic for special techniques
  if (isSpecialTechnique && viableTechniques.length > 0) {
    const technique = viableTechniques[0];
    const difficultyLevel = adaptiveDifficulty.calculatePlayerSkill();
    const vitalPoint = selectOptimalVitalPoint(player.currentStance, difficultyLevel) ?? undefined;
    return { 
      technique, 
      vitalPoint, 
      actionType: "attack" 
    };
  }

  return { actionType: "idle" };
}

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
  selectedTechnique?: KoreanTechnique;
  targetVitalPoint?: string;
  recentTechniques: string[]; // Track last 5 techniques for variation
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

  // Update AI difficulty level based on adaptive difficulty (only when skill level meaningfully changes)
  const lastSkillLevelRef = useRef(0.5);
  useEffect(() => {
    const newSkillLevel = adaptiveDifficulty.calculatePlayerSkill();
    // Only update if skill level changed by more than 1%
    if (Math.abs(newSkillLevel - lastSkillLevelRef.current) > 0.01) {
      lastSkillLevelRef.current = newSkillLevel;
      decisionTree.setDifficultyLevel(newSkillLevel);
    }
  }, [adaptiveDifficulty, decisionTree]);

  // AI state - use useState lazy initializer for Date.now()
  const [aiState, setAiState] = useState<AIState>(() => {
    const now = Date.now();
    return {
      nextAction: now,
      targetPosition: player.position,
      lastActionType: "idle",
      consecutiveAttacks: 0,
      actionCooldown: 500,
      aggressionLevel: adjustedPersonality.aggressionLevel,
      selectedTechnique: undefined,
      targetVitalPoint: undefined,
      recentTechniques: [],
    };
  });

  // Performance tracking - use useState lazy initializer for refs that need Date.now()
  const lastDecisionTimeRef = useRef(0);
  const [initialMatchTime] = useState(() => Date.now());
  const matchStartTimeRef = useRef(initialMatchTime);
  const previousDamageRef = useRef(0);
  const [initialActionTime] = useState(() => Date.now());
  const nextActionRef = useRef(initialActionTime);
  const lastWarningTimeRef = useRef(0);

  // Initialize previousDamageRef when round starts (issue #2529728007)
  useEffect(() => {
    if (roundStarted) {
      matchStartTimeRef.current = Date.now();
      previousDamageRef.current = player.totalDamageReceived;
      decisionTree.reset();
      comboSystem.resetCombo();
    }
  }, [roundStarted, decisionTree, comboSystem, player.totalDamageReceived]);

  /**
   * Execute AI action callback
   * 
   * Triggers the onExecuteAction callback which will then retrieve
   * the selected technique and vital point from aiState
   * 
   * @korean AI 행동 실행 콜백
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

      // Performance: warn if decision took too long with time-based throttle (issue #2529466997, #2529728019)
      const decisionTime = performance.now() - decisionStart;
      if (decisionTime > AI_DECISION_THRESHOLD_MS) {
        const now = Date.now();
        if (now - lastWarningTimeRef.current > WARNING_THROTTLE_MS) {
          // Only warn every 5 seconds
          console.warn(
            `AI decisions running slow: ${decisionTime.toFixed(2)}ms`
          );
          lastWarningTimeRef.current = now;
        }
      }
      lastDecisionTimeRef.current = decisionTime;

      // Execute decision with technique and vital point selection
      let actionType = "idle";
      let newTargetPosition = aiState.targetPosition;
      let newConsecutiveAttacks = aiState.consecutiveAttacks;
      let selectedTechnique: KoreanTechnique | undefined;
      let targetVitalPoint: string | undefined;

      switch (decision.action) {
        case AIActionType.ATTACK:
          {
            const result = selectTechniqueForAction(
              false,
              context,
              player,
              adaptiveDifficulty,
              aiState.recentTechniques
            );
            selectedTechnique = result.technique;
            targetVitalPoint = result.vitalPoint;
            actionType = result.actionType;
            if (actionType === "attack") {
              newConsecutiveAttacks++;
            }
          }
          break;

        case AIActionType.TECHNIQUE:
          {
            const result = selectTechniqueForAction(
              true,
              context,
              player,
              adaptiveDifficulty,
              aiState.recentTechniques
            );
            selectedTechnique = result.technique;
            targetVitalPoint = result.vitalPoint;
            actionType = result.actionType;
            if (actionType === "attack" || actionType === "technique") {
              newConsecutiveAttacks++;
            }
          }
          break;

        case AIActionType.COMBO:
          // Start or continue combo
          if (!comboSystem.isComboActive()) {
            comboSystem.startCombo(player, opponent, adjustedPersonality);
          }

          if (
            comboSystem.shouldContinueCombo(
              player,
              opponent,
              adjustedPersonality
            )
          ) {
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

      // Execute action (technique and vital point are stored in aiState)
      executeAIAction(actionType, newTargetPosition);

      // Calculate next action cooldown
      const actionCooldown =
        actionType === "attack" || actionType === "technique" ? 600 : 400;

      // Update next action time using ref (prevents stale closure)
      nextActionRef.current = now + actionCooldown + Math.random() * 200;

      // Track recent techniques for variation (keep last 5)
      let updatedRecentTechniques = [...aiState.recentTechniques];
      if (selectedTechnique) {
        updatedRecentTechniques.push(selectedTechnique.id);
        // Keep only last 5 techniques
        if (updatedRecentTechniques.length > 5) {
          updatedRecentTechniques = updatedRecentTechniques.slice(-5);
        }
      }

      // Update AI state with selected technique and vital point
      setAiState({
        nextAction: nextActionRef.current,
        targetPosition: newTargetPosition,
        lastActionType: actionType,
        consecutiveAttacks: newConsecutiveAttacks,
        actionCooldown,
        aggressionLevel: adjustedPersonality.aggressionLevel,
        selectedTechnique,
        targetVitalPoint,
        recentTechniques: updatedRecentTechniques,
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
    aiState,
  ]);

  return {
    aiState,
    comboSystem,
    decisionTree,
    adjustedPersonality,
    executeAIAction,
  };
}
