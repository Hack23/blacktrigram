/**
 * Player state and related types for Korean martial arts combat system.
 * 
 * **Korean**: 플레이어 시스템 (Player System)
 * 
 * This module defines the complete state structure for combat participants,
 * including resources (Health, Ki, Stamina), combat attributes, positioning,
 * and tracking for vital point strikes and statistics.
 * 
 * ## Player State Structure
 * 
 * The player state encompasses:
 * - **Identity**: Name, archetype, unique ID
 * - **Resources**: Health, Ki (氣), Stamina, Energy
 * - **Attributes**: Attack, Defense, Speed, Technique skill
 * - **Combat Status**: Stance, state, blocking, stunning, countering
 * - **Position**: 2D coordinates in combat arena
 * - **Effects**: Status effects and active modifiers
 * - **Statistics**: Match performance metrics
 * 
 * @module systems/player
 * @category Player & Archetypes
 * @korean 플레이어
 */

import { StatusEffect } from "@/systems/types";
import {
  CombatState,
  KoreanText,
  PlayerArchetype,
  Position,
  TrigramStance,
} from "@/types";

/**
 * Complete player state for Korean martial arts combat.
 * 
 * **Korean**: 플레이어 상태 (Player State)
 * 
 * Represents the complete state of a combatant including physical resources,
 * combat attributes, current stance, position, and accumulated statistics.
 * All properties are readonly to enforce immutable state updates.
 * 
 * ## Resource System
 * 
 * - **Health**: Physical integrity (0 = defeated)
 * - **Ki (氣)**: Spiritual energy for techniques and stance transitions
 * - **Stamina**: Physical endurance for sustained combat
 * - **Energy**: Action points for moves per turn
 * 
 * ## Combat Attributes
 * 
 * - **Attack Power**: Base damage output modifier
 * - **Defense**: Damage reduction and blocking effectiveness
 * - **Speed**: Action priority and dodge capability
 * - **Technique**: Precision for vital point targeting
 * 
 * @example
 * ```typescript
 * const player: PlayerState = {
 *   id: "player-1",
 *   name: { korean: "이순신", english: "Yi Sun-sin" },
 *   archetype: PlayerArchetype.MUSA,
 *   
 *   // Resources
 *   health: 100,
 *   maxHealth: 100,
 *   ki: 100,
 *   maxKi: 100,
 *   stamina: 100,
 *   maxStamina: 100,
 *   energy: 100,
 *   maxEnergy: 100,
 *   
 *   // Attributes
 *   attackPower: 15,
 *   defense: 12,
 *   speed: 10,
 *   technique: 14,
 *   
 *   // Combat state
 *   currentStance: TrigramStance.GEON,
 *   combatState: CombatState.IDLE,
 *   position: { x: 100, y: 200 },
 *   isBlocking: false,
 *   isStunned: false,
 *   
 *   // ... other properties
 * };
 * ```
 * 
 * @public
 * @category Player & Archetypes
 * @korean 플레이어상태
 */
export interface PlayerState {
  /** Unique player identifier */
  readonly id: string;
  /** Bilingual Korean-English player name */
  readonly name: KoreanText;
  /** Player combat archetype (무사, 암살자, etc.) */
  readonly archetype: PlayerArchetype;
  
  // Physical attributes
  /** 
   * Physical body attributes affecting combat calculations.
   * **Korean**: 신체 속성 (Body Attributes)
   * 
   * These attributes determine reach, movement speed, damage output,
   * defense capability, and stamina based on realistic body dimensions
   * and composition. Loaded from archetype defaults on player creation.
   */
  readonly physicalAttributes?: import("@/types").PhysicalAttributes;

  // Combat stats
  /** Current health points (0 = defeated) - aggregate of body part health */
  readonly health: number;
  /** Maximum health capacity */
  readonly maxHealth: number;
  /** Body part-specific health tracking (신체부위 체력) */
  readonly bodyPartHealth?: import("@/systems/bodypart").BodyPartHealth;
  /** Maximum health for each body part */
  readonly bodyPartMaxHealth?: import("@/systems/bodypart").BodyPartMaxHealth;
  /** Current Ki (氣) spiritual energy */
  readonly ki: number;
  /** Maximum Ki capacity */
  readonly maxKi: number;
  /** Current stamina (physical endurance) */
  readonly stamina: number;
  /** Maximum stamina capacity */
  readonly maxStamina: number;
  /** Current energy (action points) */
  readonly energy: number;
  /** Maximum energy capacity */
  readonly maxEnergy: number;

  // Combat attributes
  /** Base attack damage multiplier */
  readonly attackPower: number;
  /** Damage reduction and blocking effectiveness */
  readonly defense: number;
  /** Action speed and dodge capability */
  readonly speed: number;
  /** Precision for vital point targeting */
  readonly technique: number;
  /** Current pain level (reduces effectiveness) */
  readonly pain: number;
  /** Consciousness level (0 = unconscious) */
  readonly consciousness: number;
  /** Physical balance and stability */
  readonly balance: number;
  /** Combat momentum for combo bonuses */
  readonly momentum: number;

  // Combat state
  /** Current Eight Trigram stance */
  readonly currentStance: TrigramStance;
  /** Current combat action state */
  readonly combatState: CombatState;
  /** Position in combat arena */
  readonly position: Position;
  /** Body facing direction for opponent tracking */
  readonly bodyFacing?: import("@/systems/animation/types").BodyFacing;
  /** Whether player is actively blocking */
  readonly isBlocking: boolean;
  /** Whether player is stunned (cannot act) */
  readonly isStunned: boolean;
  /** Whether player is executing a counter-attack */
  readonly isCountering: boolean;
  /** Timestamp of last action performed */
  readonly lastActionTime: number;
  /** Time required before next action available */
  readonly recoveryTime: number;
  /** Timestamp of last stance transition */
  readonly lastStanceChangeTime: number;
  /** Timestamps of recent hits for balance state tracking (last 10 hits) */
  readonly recentHitTimestamps?: readonly number[];
  /** Timestamp when player last entered HELPLESS state */
  readonly lastHelplessStateTime?: number;

  // Status and effects
  /** Active status effects (poison, stun, etc.) */
  readonly statusEffects: readonly StatusEffect[];
  /** IDs of currently active effects */
  readonly activeEffects: readonly string[];

  // Vital points state
  /** State of player's vital points (for defense) */
  readonly vitalPoints: readonly {
    /** Vital point identifier */
    readonly id: string;
    /** Whether this vital point has been struck */
    readonly isHit: boolean;
    /** Accumulated damage to this vital point */
    readonly damage: number;
    /** Timestamp of last hit to this point */
    readonly lastHitTime: number;
  }[];

  // Match statistics
  /** Total damage received this match */
  readonly totalDamageReceived: number;
  /** Total damage dealt this match */
  readonly totalDamageDealt: number;
  /** Number of hits received */
  readonly hitsTaken: number;
  /** Number of hits successfully landed */
  readonly hitsLanded: number;
  /** Number of perfect accuracy strikes */
  readonly perfectStrikes: number;
  /** Number of successful vital point strikes */
  readonly vitalPointHits: number;

  // Optional extended statistics
  /** Number of missed attacks */
  readonly misses?: number;
  /** Overall accuracy percentage */
  readonly accuracy?: number;
  /** Current combo chain length */
  readonly comboCount?: number;
  /** Maximum combo achieved this match */
  readonly maxCombo?: number;
  /** Rounds won this match */
  readonly roundsWon?: number;
  /** Total matches won (career) */
  readonly matchesWon?: number;
  /** Experience points earned */
  readonly experiencePoints?: number;
  /** Player ranking (e.g., "Bronze", "Silver") */
  readonly rank?: string;
  /** Total career wins */
  readonly wins?: number;
  /** Total career losses */
  readonly losses?: number;
}

/**
 * Data required to create a new player.
 * 
 * **Korean**: 플레이어 생성 데이터
 * 
 * Used when initializing a new combatant with customizations.
 * 
 * @example
 * ```typescript
 * const creationData: PlayerCreationData = {
 *   name: { korean: "김무사", english: "Kim Warrior" },
 *   archetype: PlayerArchetype.MUSA,
 *   preferredStance: TrigramStance.GEON,
 *   customizations: {
 *     colors: { primary: 0x00FFFF, secondary: 0xFFAA00 },
 *     techniques: ["geon-thunder-strike"]
 *   }
 * };
 * ```
 * 
 * @public
 * @category Player & Archetypes
 * @korean 플레이어생성
 */
export interface PlayerCreationData {
  /** Bilingual player name */
  readonly name: KoreanText;
  /** Combat archetype selection */
  readonly archetype: PlayerArchetype;
  /** Optional starting stance preference */
  readonly preferredStance?: TrigramStance;
  /** Optional visual and technique customizations */
  readonly customizations?: {
    /** Primary and secondary color scheme */
    readonly colors?: { primary: number; secondary: number };
    /** List of unlocked technique IDs */
    readonly techniques?: string[];
  };
}

/**
 * Player statistics accumulated over a match.
 * 
 * **Korean**: 플레이어 경기 통계
 * 
 * Tracks performance metrics for a single combat match.
 * 
 * @public
 * @category Player & Archetypes
 * @korean 경기통계
 */
export interface PlayerMatchStats {
  /** Wins in this match */
  readonly wins: number;
  /** Losses in this match */
  readonly losses: number;
  /** Total hits received */
  readonly hitsTaken: number;
  /** Total hits landed on opponent */
  readonly hitsLanded: number;
  /** Total damage dealt */
  readonly totalDamageDealt: number;
  /** Total damage received */
  readonly totalDamageReceived: number;
  /** Techniques used this match */
  readonly techniques: readonly string[];
  /** Number of perfect accuracy strikes */
  readonly perfectStrikes: number;
  /** Number of vital point hits */
  readonly vitalPointHits: number;
  /** Current consecutive win streak */
  readonly consecutiveWins: number;
  /** Match duration in milliseconds */
  readonly matchDuration: number;
}

/**
 * Partial update data for player state.
 * 
 * **Korean**: 플레이어 업데이트 데이터
 * 
 * Allows updating specific player properties without replacing entire state.
 * 
 * @example
 * ```typescript
 * const update: PlayerUpdateData = {
 *   health: 75,
 *   ki: 50,
 *   currentStance: TrigramStance.GAM
 * };
 * ```
 * 
 * @public
 * @category Player & Archetypes
 */
export type PlayerUpdateData = Partial<PlayerState>;

/**
 * Minimal player state with only essential properties.
 * 
 * **Korean**: 최소 플레이어 상태
 * 
 * Simplified player state for systems that don't require full combat data.
 * Useful for UI displays and simple calculations.
 * 
 * @public
 * @category Player & Archetypes
 * @korean 최소상태
 */
export interface MinimalPlayerState {
  id: string;
  name: { korean: string; english: string };
  archetype: PlayerArchetype;
  health: number;
  maxHealth: number;
  ki: number;
  maxKi: number;
  stamina: number;
  maxStamina: number;
  energy: number;
  maxEnergy: number;
  attackPower: number;
  defense: number;
  speed: number;
  technique: number;
  pain: number;
  consciousness: number;
  balance: number;
  momentum: number;
  currentStance: TrigramStance;
  combatState: CombatState;
  position: Position;
  isBlocking: boolean;
  isStunned: boolean;
  isCountering: boolean;
  lastActionTime: number;
  recoveryTime: number;
  lastStanceChangeTime: number;
  statusEffects: any[];
  activeEffects: any[];
  vitalPoints: any[];
  totalDamageReceived: number;
  totalDamageDealt: number;
  hitsTaken: number;
  hitsLanded: number;
  perfectStrikes: number;
  vitalPointHits: number;
}
export interface PlayerTrainingStats {
  readonly attempts: number;
  readonly successes: number;
  readonly failures: number;
  readonly averageTime: number;
  readonly bestTime: number;
  readonly worstTime: number;
  readonly techniquesUsed: readonly string[];
  readonly dummyInteractions: number;
}
