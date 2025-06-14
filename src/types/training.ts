import type { PlayerState } from "./player";
import type { KoreanText } from "./korean-text";
import type { TrigramStance } from "./enums";
import type { Position } from "./common";

/**
 * Training mode types for Korean martial arts practice
 */
export type TrainingMode =
  | "basics"
  | "advanced"
  | "techniques"
  | "combat"
  | "free";

/**
 * Training session statistics
 */
export interface TrainingStatistics {
  readonly attempts: number;
  readonly techniquesExecuted: number;
  readonly perfectStrikes: number;
  readonly criticalHits: number;
  readonly totalDamage: number;
  readonly sessionTime: number;
  readonly accuracy: number;
  readonly averageDamage: number;
  readonly bestCombo: number;
  readonly stanceChanges: number;
}

/**
 * Training dummy state for practice
 */
export interface TrainingDummyState {
  readonly health: number;
  readonly maxHealth: number;
  readonly position: Position;
  readonly isActive: boolean;
  readonly lastHitTime: number;
  readonly hitCount: number;
  readonly isStunned: boolean;
  readonly defensiveMode: boolean;
}

/**
 * Training technique execution result
 */
export interface TrainingTechniqueResult {
  readonly hit: boolean;
  readonly damage: number;
  readonly critical: boolean;
  readonly perfect: boolean;
  readonly miss: boolean;
  readonly stance: TrigramStance;
  readonly accuracy: number;
}

/**
 * Training mode configuration
 */
export interface TrainingModeConfig {
  readonly mode: TrainingMode;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly maxAttempts: number;
  readonly difficulty: number;
  readonly requiredLevel: number;
  readonly availableStances: readonly TrigramStance[];
  readonly focusAreas: readonly string[];
}

/**
 * Training feedback message
 */
export interface TrainingFeedbackMessage {
  readonly id: string;
  readonly message: string;
  readonly type: "success" | "warning" | "error" | "info";
  readonly timestamp: number;
  readonly duration: number;
}

/**
 * Training session configuration
 */
export interface TrainingSessionConfig {
  readonly mode: TrainingMode;
  readonly timeLimit?: number;
  readonly maxAttempts: number;
  readonly targetAccuracy?: number;
  readonly enabledFeatures: readonly string[];
}

/**
 * Training progress data
 */
export interface TrainingProgress {
  readonly level: number;
  readonly experienceGained: number;
  readonly skillsImproved: readonly string[];
  readonly achievementsUnlocked: readonly string[];
  readonly sessionSummary: TrainingStatistics;
}

export interface TrainingResult {
  readonly accuracyScore: number;
  readonly techniqueScore: number;
  readonly formScore: number;
  readonly improvementAreas: readonly string[];
  readonly nextTrainingGoals: readonly string[];
  readonly hit: boolean;
  readonly damage: number;
  readonly timestamp: number;
}

export interface TrainingSession {
  readonly id: string;
  readonly startTime: number;
  readonly endTime?: number;
  readonly mode: TrainingMode;
  readonly difficulty: TrainingDifficulty;
  readonly player: PlayerState;
  readonly results: readonly TrainingResult[];
  readonly overallScore: number;
  readonly improvements: readonly string[];
}

export type TrainingDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "master";

export interface TrainingTarget {
  readonly id: string;
  readonly position: Position;
  readonly size: number;
  readonly type: "vital_point" | "technique_zone" | "balance_point";
  readonly difficulty: number;
  readonly active: boolean;
}

export interface TrainingProgression {
  readonly currentLevel: number;
  readonly experience: number;
  readonly masteredTechniques: readonly string[];
  readonly availableStances: readonly TrigramStance[];
  readonly achievements: readonly string[];
}
