/**
 * @fileoverview Player type definitions for Black Trigram Korean martial arts combat system
 * @description Complete player state and archetype definitions with Korean cultural elements
 */

import type { PlayerArchetype, TrigramStance } from "./enums";
import type { KoreanText } from "./korean-text";
import type { StatusEffect } from "./effects";

/**
 * @interface PlayerState
 * @description Complete player state for Korean martial arts combat system
 */
export interface PlayerState {
  readonly id: string;
  readonly name: KoreanText;
  readonly archetype: PlayerArchetype;
  readonly currentStance: TrigramStance;

  // Core stats
  readonly health: number;
  readonly maxHealth: number;
  readonly ki: number;
  readonly maxKi: number;
  readonly stamina: number;
  readonly maxStamina: number;
  readonly balance: number;
  readonly consciousness: number;
  readonly pain: number;

  // Combat stats
  readonly attackPower: number;
  readonly defense: number;
  readonly experiencePoints: number;
  readonly level: number;

  // Combat state
  readonly isBlocking: boolean;
  readonly isStunned: boolean;
  readonly isCountering: boolean;
  readonly statusEffects: readonly StatusEffect[];

  // Position and movement
  readonly position: { readonly x: number; readonly y: number };

  // Combat statistics
  readonly hitsLanded: number;
  readonly hitsTaken: number;
  readonly totalDamageDealt: number;
  readonly totalDamageReceived: number;
  readonly combatStats: {
    readonly hitsLanded: number;
    readonly hitsTaken: number;
    readonly totalDamageDealt: number;
    readonly totalDamageReceived: number;
    readonly perfectStrikes: number;
    readonly criticalHits: number;
  };

  // Timing
  readonly lastActionTime: number;
  readonly recoveryTime: number;
}

/**
 * @interface PlayerArchetypeData
 * @description Data structure for player archetype definitions
 */
export interface PlayerArchetypeData {
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly specialties: readonly string[];
  readonly preferredStances: readonly TrigramStance[];
  readonly colors: {
    readonly primary: number;
    readonly secondary: number;
    readonly accent: number;
  };
  readonly baseStats: {
    readonly health: number;
    readonly ki: number;
    readonly stamina: number;
    readonly attackPower: number;
    readonly defense: number;
  };
  readonly bonuses: {
    readonly [key: string]: number;
  };
}

/**
 * @interface PlayerStats
 * @description Enhanced combat statistics for players
 */
export interface PlayerStats {
  readonly totalMatches: number;
  readonly wins: number;
  readonly losses: number;
  readonly draws: number;
  readonly winRate: number;
  readonly averageDamagePerMatch: number;
  readonly averageAccuracy: number;
  readonly favoriteStance: TrigramStance;
  readonly longestWinStreak: number;
  readonly perfectVictories: number;
  readonly comebackWins: number;
}

/**
 * @type PlayerUpdateFields
 * @description Fields that can be updated on a player
 */
export type PlayerUpdateFields = Partial<
  Pick<
    PlayerState,
    | "health"
    | "ki"
    | "stamina"
    | "balance"
    | "consciousness"
    | "pain"
    | "currentStance"
    | "isBlocking"
    | "isStunned"
    | "isCountering"
    | "statusEffects"
    | "position"
    | "hitsLanded"
    | "hitsTaken"
    | "totalDamageDealt"
    | "totalDamageReceived"
  >
>;

/**
 * @interface PlayerCreationOptions
 * @description Options for creating a new player
 */
export interface PlayerCreationOptions {
  readonly name: KoreanText;
  readonly archetype: PlayerArchetype;
  readonly customStats?: Partial<PlayerArchetypeData["baseStats"]>;
  readonly startingStance?: TrigramStance;
  readonly level?: number;
}

/**
 * @interface PlayerAbility
 * @description Special abilities available to players
 */
export interface PlayerAbility {
  readonly id: string;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly kiCost: number;
  readonly staminaCost: number;
  readonly cooldown: number;
  readonly requiredStance?: TrigramStance;
  readonly requiredLevel: number;
  readonly effects: readonly string[];
}

/**
 * @interface PlayerProgression
 * @description Player progression and advancement
 */
export interface PlayerProgression {
  readonly currentLevel: number;
  readonly experiencePoints: number;
  readonly experienceToNextLevel: number;
  readonly skillPoints: number;
  readonly unlockedAbilities: readonly string[];
  readonly masteredStances: readonly TrigramStance[];
  readonly achievements: readonly string[];
}

export default PlayerState;
/**
 * @interface TrainingPlayerState
 * @description Extended player state for training mode
 */
export interface TrainingPlayerState extends PlayerState {
  readonly trainingData: {
    readonly sessionsCompleted: number;
    readonly techniquesLearned: readonly string[];
    readonly masteryCertifications: readonly string[];
    readonly instructorNotes: readonly string[];
  };
}
