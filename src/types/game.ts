// Core game state and flow management

import type { CombatEventData } from "./combat";
import type {
  PlayerState,
  KoreanText,
  CombatResult,
  TrigramStance,
} from "./index";
import type { PlayerMatchStats } from "./player"; // Fix: Use correct import name
import { GameMode, GamePhase } from "./enums"; // Fix: Import enums only

// Main game state interface
export interface GameState {
  readonly mode: GameMode;
  readonly phase: GamePhase;
  readonly players: readonly [PlayerState, PlayerState];
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly matchStatistics: MatchStatistics;
  readonly winner?: PlayerState | null;
}

// Round result information
export interface RoundResult {
  readonly roundNumber: number;
  readonly winner: PlayerState | null;
  readonly method: "knockout" | "time" | "forfeit" | "draw";
  readonly duration: number;
  readonly finalHealth: readonly [number, number];
  readonly damageDealt: readonly [number, number];
  readonly combatEvents: readonly CombatResult[];
}

// Match configuration
export interface MatchConfig {
  readonly mode: GameMode;
  readonly rounds: number;
  readonly roundDuration: number; // seconds
  readonly player1Archetype: string;
  readonly player2Archetype: string;
  readonly stage: string;
  readonly difficulty?: "easy" | "medium" | "hard" | "expert";
}

// Game event system
export interface GameEvent {
  readonly id: string;
  readonly type: GameEventType;
  readonly timestamp: number;
  readonly playerId?: string;
  readonly data: Record<string, any>; // Fix: Keep consistent type
  readonly message?: KoreanText;
}

// Game event types
export enum GameEventType {
  GAME_START = "game_start",
  ROUND_START = "round_start",
  ROUND_END = "round_end",
  MATCH_END = "match_end",
  PLAYER_ATTACK = "player_attack",
  PLAYER_HIT = "player_hit",
  STANCE_CHANGE = "stance_change",
  TECHNIQUE_EXECUTE = "technique_execute",
  VITAL_POINT_HIT = "vital_point_hit",
  STATUS_EFFECT = "status_effect",
  PAUSE_TOGGLE = "pause_toggle",
  ERROR = "error",
}

// Game settings interface
export interface GameSettings {
  readonly audio: {
    readonly masterVolume: number;
    readonly musicVolume: number;
    readonly sfxVolume: number;
    readonly voiceVolume: number;
  };
  readonly graphics: {
    readonly resolution: "720p" | "1080p" | "1440p" | "4k";
    readonly quality: "low" | "medium" | "high" | "ultra";
    readonly fullscreen: boolean;
    readonly vsync: boolean;
    readonly frameRate: 30 | 60 | 120 | 144;
  };
  readonly controls: {
    readonly keyboardLayout: "qwerty" | "azerty" | "dvorak";
    readonly mouseSensitivity: number;
    readonly showInputHistory: boolean;
  };
  readonly gameplay: {
    readonly language: "korean" | "english" | "both";
    readonly showRomanization: boolean;
    readonly showVitalPoints: boolean;
    readonly combatHints: boolean;
    readonly difficultyLevel:
      | "beginner"
      | "intermediate"
      | "advanced"
      | "master";
  };
  readonly accessibility: {
    readonly colorBlindSupport: boolean;
    readonly highContrast: boolean;
    readonly largeText: boolean;
    readonly reducedMotion: boolean;
  };
}

// Save data structure
export interface SaveData {
  readonly version: string;
  readonly playerId: string;
  readonly progress: {
    readonly unlockedArchetypes: readonly string[];
    readonly unlockedStages: readonly string[];
    readonly completedModes: readonly GameMode[];
    readonly achievements: readonly string[];
  };
  readonly statistics: {
    readonly totalMatches: number;
    readonly wins: number;
    readonly losses: number;
    readonly draws: number;
    readonly favoriteArchetype: string;
    readonly totalPlayTime: number; // milliseconds
  };
  readonly settings: GameSettings;
  readonly timestamp: number;
}

// Game session interface
export interface GameSession {
  readonly id: string;
  readonly gameMode: GameMode;
  readonly players: readonly [PlayerState, PlayerState];
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly roundTimeLimit: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly isGameOver: boolean;
  readonly winner: PlayerState | null;
}

// Game configuration
export interface GameConfig {
  readonly maxHealth: number;
  readonly maxKi: number;
  readonly maxStamina: number;
  readonly roundDuration: number;
  readonly maxRounds: number;
  readonly difficulty: "beginner" | "intermediate" | "expert" | "master";
  readonly enableVitalPoints: boolean;
  readonly enableStatusEffects: boolean;
  readonly allowArchetypeSwitching: boolean;
}

// Match statistics - Fix: Remove duplicate and use single definition
export interface MatchStatistics {
  // Top-level match statistics
  readonly totalDamageDealt: number;
  readonly totalDamageTaken: number;
  readonly criticalHits: number;
  readonly vitalPointHits: number;
  readonly techniquesUsed: number;
  readonly perfectStrikes: number;
  readonly consecutiveWins: number;
  readonly matchDuration: number;
  readonly totalMatches: number;
  readonly maxRounds: number;
  readonly winner: number;
  readonly totalRounds: number;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly combatEvents: readonly CombatEventData[];
  readonly finalScore: { player1: number; player2: number };
  readonly roundsWon: { player1: number; player2: number };

  // Individual player statistics
  readonly player1: PlayerMatchStats;
  readonly player2: PlayerMatchStats;
}

// Training session data
export interface TrainingSession {
  readonly playerId: string;
  readonly archetype: string;
  readonly practiceStance: TrigramStance;
  readonly exercisesCompleted: readonly string[];
  readonly duration: number;
  readonly improvementMetrics: {
    readonly accuracy: number;
    readonly timing: number;
    readonly technique: number;
  };
}

// Game save data
export interface GameSaveData {
  readonly version: string;
  readonly playerId: string;
  readonly playerProgress: {
    readonly archetypeExperience: Record<string, number>;
    readonly unlockedTechniques: readonly string[];
    readonly achievements: readonly string[];
  };
  readonly settings: {
    readonly volume: number;
    readonly difficulty: string;
    readonly controls: Record<string, string>;
  };
  readonly statistics: {
    readonly totalMatches: number;
    readonly wins: number;
    readonly losses: number;
    readonly favoriteArchetype: string;
  };
}

// Fix: Remove GameUIProps export to avoid duplicate with components.ts
// export interface GameUIProps { ... } // Remove this interface

// Re-export PlayerMatchStats for compatibility
export type { PlayerMatchStats } from "./player";
