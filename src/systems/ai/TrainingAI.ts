/**
 * TrainingAI - AI opponent system for training mode
 * 
 * Integrates AIPersonality, DecisionTree, and ComboSystem to create
 * a configurable AI opponent for training scenarios.
 * 
 * **Korean Philosophy (훈련 AI 철학)**:
 * - 단계적 난이도 (Stepped Difficulty): Progressive challenge levels
 * - 교육적 피드백 (Educational Feedback): AI teaches through behavior
 * - 적응형 전투 (Adaptive Combat): AI adjusts to player skill
 */

import { Position, TrigramStance } from "@/types";
import { PlayerState } from "../player";
import { AIPersonality, AI_PERSONALITIES } from "./AIPersonality";
import { AIDecisionTree, CombatContext, AIDecision } from "./DecisionTree";
import { AIComboSystem } from "./ComboSystem";
import { AdaptiveDifficulty } from "./AdaptiveDifficulty";

/**
 * Training AI difficulty levels
 */
export type AITrainingDifficulty = "easy" | "medium" | "hard";

/**
 * Training AI state
 */
export interface TrainingAIState {
  readonly difficulty: AITrainingDifficulty;
  readonly personality: AIPersonality;
  readonly currentAction: AIDecision | null;
  readonly position: Position;
  readonly stance: TrigramStance;
  readonly isActive: boolean;
  readonly reactionTime: number; // ms delay before responding
  readonly blockChance: number; // 0.0-1.0
  readonly counterChance: number; // 0.0-1.0
  readonly lastActionTime: number;
}

/**
 * Training AI configuration based on difficulty
 */
interface DifficultyConfig {
  readonly reactionTime: number;
  readonly blockChance: number;
  readonly counterChance: number;
  readonly aggressionMultiplier: number;
  readonly aiSkillLevel: number; // For DecisionTree
}

const DIFFICULTY_CONFIGS: Record<AITrainingDifficulty, DifficultyConfig> = {
  easy: {
    reactionTime: 500, // 500ms reaction delay
    blockChance: 0.3,
    counterChance: 0.1,
    aggressionMultiplier: 0.6,
    aiSkillLevel: 0.3,
  },
  medium: {
    reactionTime: 300, // 300ms reaction delay
    blockChance: 0.5,
    counterChance: 0.3,
    aggressionMultiplier: 0.8,
    aiSkillLevel: 0.6,
  },
  hard: {
    reactionTime: 150, // 150ms reaction delay
    blockChance: 0.7,
    counterChance: 0.5,
    aggressionMultiplier: 1.0,
    aiSkillLevel: 0.9,
  },
};

/**
 * TrainingAI System
 * 
 * Manages AI opponent behavior in training mode using existing AI systems.
 * Provides configurable difficulty and realistic martial arts behavior.
 */
export class TrainingAI {
  private state: TrainingAIState;
  private decisionTree: AIDecisionTree;
  private comboSystem: AIComboSystem;
  private adaptiveDifficulty: AdaptiveDifficulty;
  private actionDelayTimer: number = 0;

  constructor(
    difficulty: AITrainingDifficulty = "medium",
    initialPosition: Position = { x: 5, y: 0 },
    personalityKey?: string
  ) {
    // Select personality based on difficulty or use provided key
    const personality = personalityKey
      ? AI_PERSONALITIES[personalityKey] ?? AI_PERSONALITIES.BALANCED_FIGHTER
      : this.selectPersonalityForDifficulty(difficulty);

    const config = DIFFICULTY_CONFIGS[difficulty];

    this.state = {
      difficulty,
      personality,
      currentAction: null,
      position: initialPosition,
      stance: personality.favoredStances[0] ?? TrigramStance.GEON,
      isActive: false,
      reactionTime: config.reactionTime,
      blockChance: config.blockChance,
      counterChance: config.counterChance,
      lastActionTime: 0,
    };

    // Initialize AI systems
    this.decisionTree = new AIDecisionTree();
    this.decisionTree.setDifficultyLevel(config.aiSkillLevel);

    this.comboSystem = new AIComboSystem();
    this.adaptiveDifficulty = new AdaptiveDifficulty();
  }

  /**
   * Select appropriate personality for difficulty level
   */
  private selectPersonalityForDifficulty(
    difficulty: AITrainingDifficulty
  ): AIPersonality {
    switch (difficulty) {
      case "easy":
        return AI_PERSONALITIES.DEFENSIVE_SPECIALIST; // Less aggressive
      case "medium":
        return AI_PERSONALITIES.BALANCED_FIGHTER; // Balanced approach
      case "hard":
        return AI_PERSONALITIES.AGGRESSIVE_STRIKER; // More aggressive
      default:
        return AI_PERSONALITIES.BALANCED_FIGHTER;
    }
  }

  /**
   * Activate AI opponent
   */
  activate(): void {
    this.state = {
      ...this.state,
      isActive: true,
      lastActionTime: Date.now(),
    };
  }

  /**
   * Deactivate AI opponent
   */
  deactivate(): void {
    this.state = {
      ...this.state,
      isActive: false,
      currentAction: null,
    };
  }

  /**
   * Update AI behavior (60fps game loop)
   * 
   * Internal method called each frame by the TrainingAI system to process AI decision-making and update state.
   * Respects reaction time delays based on difficulty level.
   * 
   * @param deltaTime - Time since last frame in seconds
   * @param playerState - Current player state
   * @param aiPlayerState - Current AI player state (for combat systems)
   * @returns Updated AI decision or null if inactive/delayed
   */
  update(
    deltaTime: number,
    playerState: PlayerState,
    aiPlayerState: PlayerState
  ): AIDecision | null {
    if (!this.state.isActive) {
      return null;
    }

    const now = Date.now();

    // Update action delay timer
    this.actionDelayTimer = Math.max(0, this.actionDelayTimer - deltaTime * 1000);

    // Check if enough time has passed since last decision (reaction time)
    if (this.actionDelayTimer > 0) {
      return this.state.currentAction;
    }

    // Build combat context
    const context: CombatContext = {
      playerPosition: this.state.position,
      opponentPosition: playerState.position,
      playerHealth: aiPlayerState.health,
      playerMaxHealth: aiPlayerState.maxHealth,
      playerKi: aiPlayerState.ki,
      playerMaxKi: aiPlayerState.maxKi,
      playerStamina: aiPlayerState.stamina,
      playerMaxStamina: aiPlayerState.maxStamina,
      opponentHealth: playerState.health,
      opponentStance: playerState.currentStance,
      playerStance: this.state.stance,
      distanceToOpponent: this.calculateDistance(
        this.state.position,
        playerState.position
      ),
      timeInMatch: (now - this.state.lastActionTime) / 1000,
      isOpponentAttacking: this.isPlayerAttacking(playerState),
      recentDamageTaken: aiPlayerState.totalDamageReceived,
      arenaBounds: {
        x: -8,
        y: -6,
        width: 16,
        height: 12,
      },
    };

    // Get adjusted personality from adaptive difficulty
    const adjustedPersonality = this.adjustPersonalityForTraining(
      this.state.personality
    );

    // Make decision using decision tree
    const decision = this.decisionTree.makeDecision(
      context,
      adjustedPersonality,
      this.comboSystem
    );

    // Apply reaction time delay for next action
    this.actionDelayTimer = this.state.reactionTime;

    // Update state with new decision
    this.state = {
      ...this.state,
      currentAction: decision,
      lastActionTime: now,
    };

    return decision;
  }

  /**
   * Adjust personality based on training context
   */
  private adjustPersonalityForTraining(
    basePersonality: AIPersonality
  ): AIPersonality {
    const config = DIFFICULTY_CONFIGS[this.state.difficulty];

    // Apply difficulty multiplier to aggression
    return {
      ...basePersonality,
      aggressionLevel: basePersonality.aggressionLevel * config.aggressionMultiplier,
      defensePreference:
        basePersonality.defensePreference * (2 - config.aggressionMultiplier),
    };
  }

  /**
   * Calculate distance between two positions
   */
  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Determine if player is currently attacking
   */
  private isPlayerAttacking(playerState: PlayerState): boolean {
    const timeSinceLastAction = Date.now() - playerState.lastActionTime;
    return timeSinceLastAction < 500; // 500ms attack window
  }

  /**
   * Update AI position (for movement actions)
   */
  updatePosition(newPosition: Position): void {
    this.state = {
      ...this.state,
      position: newPosition,
    };
  }

  /**
   * Update AI stance
   */
  updateStance(newStance: TrigramStance): void {
    this.state = {
      ...this.state,
      stance: newStance,
    };
  }

  /**
   * Set difficulty
   */
  setDifficulty(difficulty: AITrainingDifficulty): void {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const personality = this.selectPersonalityForDifficulty(difficulty);

    this.state = {
      ...this.state,
      difficulty,
      personality,
      reactionTime: config.reactionTime,
      blockChance: config.blockChance,
      counterChance: config.counterChance,
    };

    this.decisionTree.setDifficultyLevel(config.aiSkillLevel);
  }

  /**
   * Reset AI state
   */
  reset(): void {
    this.decisionTree.reset();
    this.comboSystem.resetCombo();
    this.actionDelayTimer = 0;

    this.state = {
      ...this.state,
      currentAction: null,
      lastActionTime: Date.now(),
    };
  }

  /**
   * Get current AI state (for display/debugging)
   */
  getState(): Readonly<TrainingAIState> {
    return this.state;
  }

  /**
   * Check if AI should block incoming attack
   */
  shouldBlock(): boolean {
    return Math.random() < this.state.blockChance;
  }

  /**
   * Check if AI should counter incoming attack
   */
  shouldCounter(): boolean {
    return Math.random() < this.state.counterChance;
  }

  /**
   * Get AI's current decision for debugging
   */
  getCurrentDecision(): AIDecision | null {
    return this.state.currentAction;
  }

  /**
   * Update adaptive difficulty based on match performance
   */
  updateAdaptiveDifficulty(matchData: {
    readonly hitsLanded: number;
    readonly totalAttacks: number;
    readonly combosExecuted: number;
    readonly perfectBlockCount: number;
    readonly avgReactionTimeMs: number;
    readonly vitalPointsHit: number;
    readonly effectiveStanceChanges: number;
    readonly damageDealt: number;
    readonly damageTaken: number;
  }): void {
    this.adaptiveDifficulty.updateSkillMetrics(matchData);

    // Optionally adjust difficulty based on adaptive system
    // For training, we might want to keep difficulty stable
  }
}

export default TrainingAI;
