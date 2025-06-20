/**
 * Player state and related types for Korean martial arts
 */

import type { CombatStats } from "./combat";
import type { KoreanText, Position } from "./common";
import type { StatusEffect } from "./effects";
import { PlayerArchetype, TrigramStance, CombatState } from "./enums";

// Player state interface with all required properties
export interface PlayerState {
  readonly id: string;
  readonly name: KoreanText;
  readonly archetype: PlayerArchetype;

  // Health and vitals
  readonly health: number;
  readonly maxHealth: number;
  readonly ki: number;
  readonly maxKi: number;
  readonly stamina: number;
  readonly maxStamina: number;
  readonly balance: number;
  readonly maxBalance: number;
  readonly consciousness: number;
  readonly maxConsciousness: number;
  readonly pain: number;
  readonly maxPain: number;

  // Combat state
  readonly currentStance: TrigramStance;
  readonly position: Position;
  readonly isAlive: boolean;
  readonly isBlocking: boolean;
  readonly isExecutingTechnique: boolean;
  readonly statusEffects: readonly StatusEffect[];
  readonly combatStats: CombatStats;

  // Extended properties for combat system
  readonly energy: number;
  readonly maxEnergy: number;
  readonly attackPower: number;
  readonly defense: number;
  readonly speed: number;
  readonly technique: number;
  readonly accuracy: number;
  readonly criticalChance: number;
  readonly effectiveness: number;
  readonly momentum: number;
  readonly focus: number;
  readonly injuries: readonly any[];
  readonly skills: readonly any[];
  readonly techniques: readonly any[];
  readonly equipment: any;
  readonly experience: number;
  readonly level: number;
  readonly training: {
    readonly sessions: number;
    readonly totalTime: number;
    readonly skillPoints: number;
  };

  // Fix: Add missing properties used in combat system
  readonly wins?: number;
  readonly isStunned?: boolean;
  readonly isCountering?: boolean;
  readonly lastActionTime?: number;
  readonly recoveryTime?: number;
  readonly totalDamageReceived?: number;
  readonly hitsTaken?: number;
  readonly totalDamageDealt?: number;
  readonly hitsLanded?: number;
  readonly combatState?: CombatState;
  readonly lastStanceChangeTime?: number;
  readonly activeEffects?: readonly string[];
  readonly vitalPoints?: readonly any[];
}

// Combat statistics
export interface CombatStats {
  readonly totalDamage: number;
  readonly criticalHits: number;
  readonly vitalPointHits: number;
  readonly techniquesUsed: number;
  readonly stamina: number;
  readonly ki: number;
}

// Match statistics
export interface MatchStatistics {
  readonly rounds: number;
  readonly timeElapsed: number;
  readonly winner: PlayerState | null;
  readonly player1Stats: PlayerCombatStats;
  readonly player2Stats: PlayerCombatStats;
  readonly events: readonly CombatEvent[];
}

// Player combat statistics
export interface PlayerCombatStats {
  readonly totalDamage: number;
  readonly damageReceived: number;
  readonly hitRate: number;
  readonly criticalHits: number;
  readonly vitalPointHits: number;
  readonly perfectStrikes: number;
  readonly techniquesUsed: number;
  readonly stanceChanges: number;
  readonly kiUsed: number;
  readonly staminaUsed: number;
}

// Combat event
export interface CombatEvent {
  readonly id: string;
  readonly timestamp: number;
  readonly type: string;
  readonly description: KoreanText;
  readonly players: readonly string[];
  readonly data?: any;
}

// Player creation parameters
export interface PlayerCreationParams {
  readonly id: string;
  readonly name: KoreanText;
  readonly archetype: PlayerArchetype;
  readonly position?: Position;
  readonly customization?: PlayerCustomization;
}

// Player customization options
export interface PlayerCustomization {
  readonly colors?: {
    readonly primary?: number;
    readonly secondary?: number;
  };
  readonly preferredStances?: readonly TrigramStance[];
  readonly specialization?: string;
}

// Player update parameters
export interface PlayerUpdateParams {
  readonly health?: number;
  readonly ki?: number;
  readonly stamina?: number;
  readonly currentStance?: TrigramStance;
  readonly position?: Position;
  readonly statusEffects?: readonly StatusEffect[];
}

export default PlayerState;
