// Core game state and flow management

import { GameMode, KoreanText } from "@/types";
import type { PlayerState } from "./player";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Event data can contain various types depending on event type
  readonly data: Record<string, any>;
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
