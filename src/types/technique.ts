/**
 * Technique system type definitions for Korean martial arts combat.
 *
 * **Korean**: 기술 시스템 (Technique System)
 *
 * Defines combat techniques available to each player archetype, including
 * resource costs, damage outputs, cooldowns, and special effects.
 *
 * @module types/technique
 * @category Combat System
 * @korean 기술
 */

import { DamageType, KoreanText, TrigramStance } from "./common";
import { TechniqueAnimationConfig } from "./skeletal";

/**
 * Keyboard shortcut keys for technique selection.
 *
 * **NEW LAYOUT**: Q-E-R-T-Y-F-G-Z-X-C - Zero conflicts with WASD movement!
 * 
 * Ergonomic keys surrounding WASD for quick access during combat.
 * No overlap with movement keys (W, A, S, D) or browser shortcuts.
 * Supports up to 10 techniques with keyboard shortcuts.
 *
 * @public
 * @category Combat System
 */
export type TechniqueKey =
  | "Q"
  | "E"
  | "R"
  | "T"
  | "Y"
  | "F"
  | "G"
  | "Z"
  | "X"
  | "C";

/**
 * Combat technique definition.
 *
 * **Korean**: 전투 기술 (Combat Technique)
 *
 * Represents a special combat move that can be executed by a player.
 * Each technique has resource costs, damage potential, cooldown periods,
 * and may apply special effects or require specific stances.
 *
 * @example
 * ```typescript
 * const thunderStrike: Technique = {
 *   id: "musa_thunder_strike",
 *   name: {
 *     korean: "천둥벽력",
 *     english: "Thunder Strike"
 *   },
 *   description: {
 *     korean: "강력한 하늘의 힘으로 적을 강타합니다",
 *     english: "Strike the enemy with the power of heaven"
 *   },
 *   staminaCost: 30,
 *   kiCost: 20,
 *   damage: { min: 25, max: 35 },
 *   damageType: DamageType.BLUNT,
 *   cooldown: 5000,
 *   requiredStance: TrigramStance.GEON,
 *   keyboardShortcut: "Q"
 * };
 * ```
 *
 * @public
 * @category Combat System
 * @korean 기술
 */
export interface Technique {
  /** Unique technique identifier */
  readonly id: string;

  /** Bilingual technique name */
  readonly name: KoreanText;

  /** Bilingual technique description */
  readonly description: KoreanText;

  /** Stamina cost to execute (0-100) */
  readonly staminaCost: number;

  /** Ki (氣) cost to execute (0-100) */
  readonly kiCost: number;

  /** Base damage range */
  readonly damage: {
    readonly min: number;
    readonly max: number;
  };

  /** Type of damage dealt */
  readonly damageType: DamageType;

  /** Cooldown duration in milliseconds */
  readonly cooldown: number;

  /** Required stance to execute (optional) */
  readonly requiredStance?: TrigramStance;

  /** Keyboard shortcut key */
  readonly keyboardShortcut: TechniqueKey;

  /** Whether technique targets vital points */
  readonly targetsVitalPoint?: boolean;

  /** Critical hit chance modifier (0.0-1.0) */
  readonly criticalChance?: number;

  /** Animation duration in milliseconds */
  readonly animationDuration?: number;

  /** Special effect type (stun, bleed, etc.) */
  readonly specialEffect?: string;

  /**
   * Icon identifier for UI display.
   * Can be an emoji character (e.g., "⚔️"), icon font class name, or icon identifier.
   * Defaults to "⚔️" if not specified in the UI.
   */
  readonly icon?: string;

  /**
   * Animation configuration for technique execution.
   * 
   * Links the technique to a specific attack animation type and speed modifier.
   * When technique is executed, the appropriate animation is played at the specified speed.
   * 
   * **Korean**: 애니메이션 설정
   * 
   * @example
   * ```typescript
   * animation: {
   *   type: AttackAnimationType.KICK_ROUNDHOUSE,
   *   speedModifier: 1.1 // Slightly faster for precision
   * }
   * ```
   */
  readonly animation?: TechniqueAnimationConfig;
}

/**
 * Technique cooldown state tracking.
 *
 * @public
 * @category Combat System
 */
export interface TechniqueCooldown {
  /** Technique ID */
  readonly techniqueId: string;

  /** Timestamp when cooldown started */
  readonly startTime: number;

  /** Cooldown duration in milliseconds */
  readonly duration: number;

  /** Remaining cooldown time in milliseconds */
  readonly remaining: number;
}

/**
 * Technique selection state for a player.
 *
 * Tracks available techniques, cooldowns, and current selection.
 *
 * @public
 * @category Combat System
 */
export interface TechniqueSelection {
  /** Available techniques for current archetype */
  readonly availableTechniques: readonly Technique[];

  /** Currently selected technique index */
  readonly selectedIndex: number;

  /** Active cooldowns */
  readonly activeCooldowns: readonly TechniqueCooldown[];

  /** Whether technique selection is locked (during execution) */
  readonly isLocked: boolean;
}

/**
 * Result of technique execution validation.
 *
 * @public
 * @category Combat System
 */
export interface TechniqueValidation {
  /** Whether technique can be executed */
  readonly canExecute: boolean;

  /** Reason for failure if cannot execute */
  readonly reason?: string;

  /** Insufficient stamina */
  readonly insufficientStamina?: boolean;

  /** Insufficient Ki */
  readonly insufficientKi?: boolean;

  /** Technique on cooldown */
  readonly onCooldown?: boolean;

  /** Wrong stance */
  readonly wrongStance?: boolean;
}

export default {};
