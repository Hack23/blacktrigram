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
  DifficultyParameters,
  getArchetypeBehavior,
  interpolateDifficultyParameters,
} from "@/systems/ai";
import { PlayerState } from "@/systems/player";
import { Position, TrigramStance, DamageType, CombatAttackType, PlayerArchetype } from "@/types";
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
 * Select optimal vital point for attack based on stance compatibility and archetype priority
 * 
 * Prioritizes vital points by:
 * 1. Archetype vital target priority (health/pain/consciousness/balanced)
 * 2. Stance compatibility (must be in effectiveStances array)
 * 3. Base damage threshold (>25 damage preferred)
 * 4. Targeting difficulty vs AI skill level
 * 
 * @korean 자세 효과 및 원형 우선순위에 따른 최적 급소 선택
 * 
 * @param stance - Current trigram stance
 * @param difficultyLevel - AI difficulty level (0.0-1.0)
 * @param archetype - Player archetype for priority targeting
 * @returns Vital point ID or null if no suitable target
 */
function selectOptimalVitalPoint(
  stance: TrigramStance,
  difficultyLevel: number,
  archetype: PlayerState["archetype"]
): string | null {
  // Guard: Ensure vital points are available
  if (KOREAN_VITAL_POINTS.length === 0) {
    return null;
  }

  // Get archetype behavior for vital point priority
  const behavior = getArchetypeBehavior(archetype);

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

  // Sort by targeting suitability based on AI difficulty AND archetype priority
  const sortedPoints = [...targetPoints].sort((a, b) => {
    // Calculate base suitability score
    const baseSuitabilityA =
      (a.baseDamage ?? 0) * (1 - Math.abs(difficultyLevel - a.targetingDifficulty));
    const baseSuitabilityB =
      (b.baseDamage ?? 0) * (1 - Math.abs(difficultyLevel - b.targetingDifficulty));
    
    // Apply archetype priority multiplier
    const priorityMultiplierA = getVitalPointPriorityScore(a, behavior.vitalTargetPriority);
    const priorityMultiplierB = getVitalPointPriorityScore(b, behavior.vitalTargetPriority);
    
    const finalSuitabilityA = baseSuitabilityA * priorityMultiplierA;
    const finalSuitabilityB = baseSuitabilityB * priorityMultiplierB;
    
    return finalSuitabilityB - finalSuitabilityA;
  });

  // Select top-rated target
  return sortedPoints[0]?.id ?? null;
}

/**
 * Calculate priority score for vital point based on archetype targeting preference
 * 
 * @korean 원형 타격 우선순위 점수 계산
 * 
 * @param vitalPoint - Vital point to score
 * @param priority - Archetype vital target priority
 * @returns Priority multiplier (1.0 = neutral, >1.0 = preferred, <1.0 = deprioritized)
 */
function getVitalPointPriorityScore(
  vitalPoint: typeof KOREAN_VITAL_POINTS[0],
  priority: import("@/systems/ai/AIPersonality").VitalTargetPriority
): number {
  // Import effect types to check vital point effects
  const effects = vitalPoint.effects || [];
  
  switch (priority) {
    case "health":
      // Jojik - prioritize high base damage
      return (vitalPoint.baseDamage ?? 0) > 30 ? 1.5 : 1.0;
      
    case "pain":
      // Jeongbo - prioritize pain-inducing effects
      // Check if effects include pain or disorientation
      const hasPainEffect = effects.some(e => 
        String(e).toLowerCase().includes("pain") || 
        String(e).toLowerCase().includes("disorientation")
      );
      return hasPainEffect ? 1.5 : 1.0;
      
    case "consciousness":
      // Amsalja - prioritize consciousness-affecting strikes
      // Check if effects include unconsciousness, stun, or breathlessness
      const hasConsciousnessEffect = effects.some(e => 
        String(e).toLowerCase().includes("unconscious") || 
        String(e).toLowerCase().includes("stun") ||
        String(e).toLowerCase().includes("breathless")
      );
      return hasConsciousnessEffect ? 1.5 : 1.0;
      
    case "balanced":
    default:
      // Musa, Hacker - balanced approach
      return 1.0;
  }
}

/**
 * Check if a technique is a signature move for the given archetype
 * 
 * Signature techniques are identified by:
 * - Damage type and attack type matching archetype preferences
 * - Ki/Stamina costs indicating advanced techniques
 * - Specific technique characteristics (e.g., nerve strikes for Amsalja)
 * 
 * @korean 원형 대표 기술 확인
 * 
 * @param technique - Technique to check
 * @param archetype - Player archetype
 * @returns True if technique is signature for the archetype
 */
function isSignatureTechnique(
  technique: KoreanTechnique,
  archetype: PlayerState["archetype"]
): boolean {
  const damageType = technique.damageType;
  const attackType = technique.type;
  const isAdvanced = (technique.kiCost || 0) >= 10 || (technique.staminaCost || 0) >= 15;
  
  switch (archetype) {
    case PlayerArchetype.MUSA:
      // Musa: Joint manipulation (JOINT damage) and bone strikes (CRUSHING/BLUNT)
      return (
        damageType === DamageType.JOINT ||
        damageType === DamageType.CRUSHING ||
        (damageType === DamageType.BLUNT && isAdvanced)
      );
      
    case PlayerArchetype.AMSALJA:
      // Amsalja: Nerve strikes (NERVE damage) and silent takedowns (pressure points)
      return (
        damageType === DamageType.NERVE ||
        damageType === DamageType.PRESSURE ||
        attackType === CombatAttackType.NERVE_STRIKE ||
        attackType === CombatAttackType.PRESSURE_POINT
      );
      
    case PlayerArchetype.HACKER:
      // Hacker: Anatomical analysis (INTERNAL/NERVE) and calculated strikes
      return (
        damageType === DamageType.INTERNAL ||
        damageType === DamageType.NERVE ||
        (isAdvanced && (technique.accuracy || 0) >= 0.8) // High accuracy represents calculation
      );
      
    case PlayerArchetype.JEONGBO_YOWON:
      // Jeongbo: Psychological pressure (PRESSURE) and submission techniques (JOINT)
      return (
        damageType === DamageType.PRESSURE ||
        damageType === DamageType.JOINT ||
        attackType === CombatAttackType.GRAPPLE
      );
      
    case PlayerArchetype.JOJIK_POKRYEOKBAE:
      // Jojik: Dirty techniques (any high-damage strike) and environmental usage
      return (
        (technique.damage || 0) >= 30 || // High raw damage
        damageType === DamageType.SLASHING || // Brutal cutting
        damageType === DamageType.PIERCING // Dirty stabbing techniques
      );
      
    default:
      return false;
  }
}

/**
 * Helper to select technique for AI action with archetype signature bias
 * 
 * Implements 40%+ signature technique usage requirement:
 * - Identifies signature techniques for archetype
 * - Applies 60% selection bias toward signature moves
 * - Falls back to best available technique if no signatures available
 * 
 * @korean 원형별 대표 기술 선호도를 적용한 기술 선택
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
    // Identify signature techniques for this archetype
    const signatureTechniques = candidates.filter((tech) =>
      isSignatureTechnique(tech, player.archetype)
    );
    
    // Apply 60% bias toward signature techniques (ensures >40% usage over time)
    const useSignature = signatureTechniques.length > 0 && Math.random() < 0.6;
    
    const technique = useSignature
      ? signatureTechniques[0]
      : candidates[0];
    
    const difficultyLevel = adaptiveDifficulty.calculatePlayerSkill();
    const vitalPoint = selectOptimalVitalPoint(player.currentStance, difficultyLevel, player.archetype) ?? undefined;
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
    const vitalPoint = selectOptimalVitalPoint(player.currentStance, difficultyLevel, player.archetype) ?? undefined;
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
  readonly currentDifficultyParams: DifficultyParameters;
  readonly updateDifficultyTarget: (newParams: DifficultyParameters) => void;
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

  // Difficulty parameters with smooth interpolation
  const initialParams = useMemo(
    () => adaptiveDifficulty.getDifficultyParameters(),
    [] // Only get initial params once
  );
  const [currentParams, setCurrentParams] = useState<DifficultyParameters>(initialParams);
  const [targetParams, setTargetParams] = useState<DifficultyParameters>(initialParams);
  const transitionStartTimeRef = useRef(Date.now());
  const transitionDurationMs = 10000; // 10 seconds for smooth transition

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

  // Smooth interpolation of difficulty parameters
  useEffect(() => {
    if (isPaused || !roundStarted || roundEnded) {
      return;
    }

    const interpolationInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - transitionStartTimeRef.current;
      const progress = Math.min(1.0, elapsed / transitionDurationMs);

      if (progress < 1.0) {
        // Still interpolating
        const interpolated = interpolateDifficultyParameters(
          currentParams,
          targetParams,
          progress
        );
        setCurrentParams(interpolated);
      } else if (progress >= 1.0 && currentParams !== targetParams) {
        // Transition complete - snap to target
        setCurrentParams(targetParams);
      }
    }, 16); // ~60fps update rate

    return () => clearInterval(interpolationInterval);
  }, [isPaused, roundStarted, roundEnded, currentParams, targetParams]);

  // Pass current difficulty parameters to DecisionTree
  useEffect(() => {
    decisionTree.setDifficultyParameters(currentParams);
  }, [decisionTree, currentParams]);

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
   * Update difficulty target parameters
   * Triggers smooth interpolation to new difficulty level
   * 
   * @korean 난이도 목표 매개변수 업데이트
   */
  const updateDifficultyTarget = useCallback((newParams: DifficultyParameters) => {
    setTargetParams(newParams);
    transitionStartTimeRef.current = Date.now();
  }, []);

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
    currentDifficultyParams: currentParams,
    updateDifficultyTarget,
  };
}
