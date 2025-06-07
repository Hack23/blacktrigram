// Types related to game flow, UI props for game screens, and training

import { PlayerArchetype } from "./enums"; // Changed import for PlayerArchetype
// Import GamePhase from enums
import type { GamePhase as EnumGamePhase, TrigramStance } from "./enums";
import type { PlayerState, GamePhase, Position, KoreanText } from "./index";
import type { HitEffect } from "./effects";

/**
 * Core game state interface for Black Trigram
 */
export interface GameState {
  readonly phase: GamePhase;
  readonly isTraining: boolean;
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly timeRemaining: number;
  readonly gameTime: number;
  readonly isPaused: boolean;
  readonly combatEffects: readonly HitEffect[];
  readonly currentActivePlayer: 0 | 1;
  readonly matchWinner?: string;
  readonly roundWinner?: string;
}

/**
 * Game configuration interface
 */
export interface GameConfig {
  readonly maxRounds: number;
  readonly roundDuration: number;
  readonly maxPlayers: 2;
  readonly enableVitalPoints: boolean;
  readonly enableDebugMode: boolean;
}

/**
 * Match state for tracking game progress
 */
export interface MatchState {
  readonly currentRound: number;
  readonly scores: Record<string, number>;
  readonly roundWinner?: string;
  readonly matchWinner?: string;
  readonly isComplete: boolean;
}

/**
 * Game mode types
 */
export type GameMode = "training" | "versus" | "tournament" | "story";

/**
 * Game difficulty levels
 */
export type GameDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "master";

/**
 * Game performance metrics
 */
export interface GameMetrics {
  readonly frameRate: number;
  readonly audioLatency: number;
  readonly inputLatency: number;
  readonly memoryUsage: number;
}

export interface AppState {
  readonly gamePhase: EnumGamePhase; // Use GamePhase from enums
  readonly players: readonly [PlayerState, PlayerState];
  readonly gameTime: number;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly combatLog: readonly string[];
  readonly isPaused: boolean;
  readonly winnerId: string | null;
}

export type GamePhase = EnumGamePhase; // Re-export GamePhase from enums

export type GameScreen = "intro" | "training" | "combat" | "menu";

export interface SessionData {
  readonly startTime: number;
  readonly trainingStats: TrainingStats;
  readonly combatStats: CombatStats;
  readonly currentScore: number;
}

export interface TrainingStats {
  readonly sessionsCompleted: number;
  readonly totalTrainingTime: number;
  readonly stancesLearned: readonly TrigramStance[];
  readonly techniquesLearned: readonly string[];
}

export interface CombatStats {
  readonly wins: number;
  readonly losses: number;
  readonly totalCombats: number;
  readonly averageDamageDealt: number;
  readonly favoriteStance: TrigramStance;
}

export interface GameSettings {
  readonly audioEnabled: boolean;
  readonly musicVolume: number;
  readonly sfxVolume: number;
  readonly language: "korean" | "english" | "bilingual";
  readonly showVitalPoints: boolean;
  readonly showDebugInfo: boolean;
  readonly difficulty: "beginner" | "intermediate" | "advanced" | "master";
}

export interface GameAction {
  readonly type: string;
  readonly timestamp: number;
  readonly data?: unknown;
}

// Renamed to avoid conflict with IntroScreenProps in types/components.ts
export interface IntroSetupProps {
  onArchetypeSelect: (archetype: PlayerArchetype) => void;
  onStanceSelect: (stance: TrigramStance) => void;
  onStartTraining: () => void;
  onStartCombat: () => void;
  selectedArchetype: PlayerArchetype;
  selectedStance: TrigramStance;
}

export interface TrainingScreenProps {
  archetype: PlayerArchetype; // Use PlayerArchetype directly
  stance: TrigramStance;
  onBack: () => void;
  onStartCombat: () => void;
}

// Re-export from player types for convenience
export type { PlayerArchetype } from "./enums"; // Export PlayerArchetype from enums
