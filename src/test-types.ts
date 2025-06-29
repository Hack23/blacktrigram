// Test utility types for Black Trigram Korean martial arts game

import { PlayerState } from "./systems";
import type { PlayerArchetype, TrigramStance } from "./types";

// Mock player state for testing Korean martial arts combat
export interface MockPlayerState extends PlayerState {
  readonly _isMock: true;
}

// Test combat scenario configuration
export interface TestCombatScenario {
  readonly player1: Partial<PlayerState>;
  readonly player2: Partial<PlayerState>;
  readonly scenario: string;
  readonly expectedOutcome?: string;
}

// Test archetype configuration for Korean martial arts
export interface TestArchetypeConfig {
  readonly archetype: PlayerArchetype;
  readonly preferredStances: readonly TrigramStance[];
  readonly testDamageMultiplier: number;
  readonly mockBehavior: "aggressive" | "defensive" | "balanced";
}

// Test vital point configuration
export interface TestVitalPointConfig {
  readonly id: string;
  readonly testAccuracy: number;
  readonly testDamage: number;
  readonly mockEffects: readonly string[];
}

// Test combat result for assertion
export interface TestCombatResult {
  readonly damage: number;
  readonly hit: boolean;
  readonly critical: boolean;
  readonly vitalPoint: boolean;
  readonly attacker: PlayerArchetype;
  readonly defender: PlayerArchetype;
}

// Test game state for integration testing
export interface TestGameState {
  readonly gamePhase: string;
  readonly player1: MockPlayerState;
  readonly player2: MockPlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
}

// Mock audio manager for testing
export interface MockAudioManager {
  readonly playMusic: (id: string) => Promise<void>;
  readonly stopMusic: () => void;
  readonly playSFX: (id: string) => void;
  readonly playAttackSound: (id: string) => void;
  readonly playHitSound: (id: string) => void;
  readonly setVolume: (volume: number) => void;
  readonly isEnabled: boolean;
  readonly isInitialized: boolean;
}

// Test utilities for Korean martial arts game
export interface TestUtils {
  readonly createMockPlayer: (archetype: PlayerArchetype) => MockPlayerState;
  readonly createMockCombat: () => TestCombatScenario;
  readonly mockAudioManager: MockAudioManager;
}
