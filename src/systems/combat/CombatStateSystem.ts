/**
 * Combat State System for managing Ready/Shaken/Vulnerable/Helpless states.
 * 
 * **Korean**: 전투 상태 시스템 (Combat State System)
 * 
 * Implements the combat readiness state machine based on cumulative damage,
 * pain, consciousness, and balance. Each state affects player capabilities
 * with specific multipliers.
 * 
 * ## Combat States
 * 
 * - **🟢 READY**: 100% capability - perfect combat condition
 * - **🟡 SHAKEN**: 80% capability - slightly compromised, -20% accuracy
 * - **🟠 VULNERABLE**: 60% capability - significantly exposed, -40% defense
 * - **🔴 HELPLESS**: 20% capability - near incapacitation, cannot block
 * 
 * @module systems/combat/CombatStateSystem
 * @category Combat System
 * @korean 전투상태시스템
 */

import { PlayerState } from "../player";

/**
 * Combat readiness states representing player combat effectiveness.
 * 
 * **Korean**: 전투 준비 상태
 */
export enum CombatReadinessState {
  /** 🟢 Ready - Full combat capability (100%) */
  READY = "ready",
  /** 🟡 Shaken - Reduced effectiveness (80%) */
  SHAKEN = "shaken",
  /** 🟠 Vulnerable - Significantly impaired (60%) */
  VULNERABLE = "vulnerable",
  /** 🔴 Helpless - Near incapacitation (20%) */
  HELPLESS = "helpless",
}

/**
 * State capability modifiers for each combat state.
 * 
 * **Korean**: 상태 능력 배율
 */
interface StateCapability {
  /** Overall capability percentage */
  readonly capability: number;
  /** Accuracy modifier */
  readonly accuracyModifier: number;
  /** Defense modifier */
  readonly defenseModifier: number;
  /** Movement speed modifier */
  readonly speedModifier: number;
  /** Can perform blocking actions */
  readonly canBlock: boolean;
  /** Can execute techniques */
  readonly canExecuteTechniques: boolean;
}

/**
 * State transition thresholds based on various factors.
 */
interface StateThresholds {
  /** Health percentage threshold */
  readonly healthThreshold: number;
  /** Pain level threshold */
  readonly painThreshold: number;
  /** Consciousness threshold */
  readonly consciousnessThreshold: number;
  /** Balance threshold */
  readonly balanceThreshold: number;
}

/**
 * Combat State System managing readiness state transitions.
 * 
 * Evaluates player condition and determines current combat readiness state.
 * States degrade based on:
 * - Cumulative damage (health loss)
 * - Pain overload
 * - Consciousness reduction
 * - Balance disruption
 * 
 * @example
 * ```typescript
 * const combatStateSystem = new CombatStateSystem();
 * 
 * // Determine current state
 * const state = combatStateSystem.determineState(player);
 * 
 * // Get capability modifiers
 * const capability = combatStateSystem.getCapability(state);
 * console.log(`Capability: ${capability.capability}%`);
 * 
 * // Apply modifiers to damage calculation
 * const modifiedDamage = baseDamage * capability.accuracyModifier;
 * ```
 * 
 * @public
 * @korean 전투상태시스템
 */
export class CombatStateSystem {
  /**
   * State capability definitions with modifiers per state.
   */
  private readonly stateCapabilities: Record<CombatReadinessState, StateCapability> = {
    [CombatReadinessState.READY]: {
      capability: 1.0, // 100%
      accuracyModifier: 1.0,
      defenseModifier: 1.0,
      speedModifier: 1.0,
      canBlock: true,
      canExecuteTechniques: true,
    },
    [CombatReadinessState.SHAKEN]: {
      capability: 0.8, // 80%
      accuracyModifier: 0.8, // -20% accuracy
      defenseModifier: 0.9,
      speedModifier: 0.9,
      canBlock: true,
      canExecuteTechniques: true,
    },
    [CombatReadinessState.VULNERABLE]: {
      capability: 0.6, // 60%
      accuracyModifier: 0.7,
      defenseModifier: 0.6, // -40% defense
      speedModifier: 0.7,
      canBlock: true,
      canExecuteTechniques: true,
    },
    [CombatReadinessState.HELPLESS]: {
      capability: 0.2, // 20%
      accuracyModifier: 0.5,
      defenseModifier: 0.3,
      speedModifier: 0.4,
      canBlock: false, // Cannot block
      canExecuteTechniques: false,
    },
  };

  /**
   * State transition thresholds for each combat state.
   * 
   * If ANY threshold is crossed, player degrades to that state.
   */
  private readonly stateThresholds: Record<CombatReadinessState, StateThresholds> = {
    [CombatReadinessState.READY]: {
      healthThreshold: 0.81, // Above 80% health
      painThreshold: 19, // Below 20 pain
      consciousnessThreshold: 80, // Above 80 consciousness
      balanceThreshold: 80, // Above 80 balance
    },
    [CombatReadinessState.SHAKEN]: {
      healthThreshold: 0.61, // 60-80% health
      painThreshold: 39, // 20-40 pain
      consciousnessThreshold: 60, // 60-80 consciousness
      balanceThreshold: 60, // 60-80 balance
    },
    [CombatReadinessState.VULNERABLE]: {
      healthThreshold: 0.41, // 40-60% health
      painThreshold: 59, // 40-60 pain
      consciousnessThreshold: 40, // 40-60 consciousness
      balanceThreshold: 40, // 40-60 balance
    },
    [CombatReadinessState.HELPLESS]: {
      healthThreshold: 0.21, // Below 40% health
      painThreshold: 79, // Above 60 pain
      consciousnessThreshold: 20, // Below 40 consciousness
      balanceThreshold: 20, // Below 40 balance
    },
  };

  /**
   * Determines the current combat readiness state based on player condition.
   * 
   * Evaluates health, pain, consciousness, and balance to determine
   * the most appropriate combat state. Uses worst-case evaluation:
   * if ANY factor is in a degraded state, player is in that state.
   * 
   * @param player - Current player state
   * @returns Current combat readiness state
   * 
   * @example
   * ```typescript
   * const state = combatStateSystem.determineState(player);
   * if (state === CombatReadinessState.HELPLESS) {
   *   console.log("Player is near incapacitation!");
   * }
   * ```
   * 
   * @public
   * @korean 상태결정
   */
  determineState(player: PlayerState): CombatReadinessState {
    const healthPercent = player.health / player.maxHealth;
    const pain = player.pain;
    const consciousness = player.consciousness;
    const balance = player.balance;

    // Check for HELPLESS state (worst condition)
    // Health <= 40%, pain >= 60, consciousness <= 40, or balance <= 40
    if (
      healthPercent < this.stateThresholds[CombatReadinessState.VULNERABLE].healthThreshold ||
      pain > this.stateThresholds[CombatReadinessState.VULNERABLE].painThreshold ||
      consciousness < this.stateThresholds[CombatReadinessState.VULNERABLE].consciousnessThreshold ||
      balance < this.stateThresholds[CombatReadinessState.VULNERABLE].balanceThreshold
    ) {
      return CombatReadinessState.HELPLESS;
    }

    // Check for VULNERABLE state
    // Health <= 60%, pain >= 40, consciousness <= 60, or balance <= 60
    if (
      healthPercent < this.stateThresholds[CombatReadinessState.SHAKEN].healthThreshold ||
      pain > this.stateThresholds[CombatReadinessState.SHAKEN].painThreshold ||
      consciousness < this.stateThresholds[CombatReadinessState.SHAKEN].consciousnessThreshold ||
      balance < this.stateThresholds[CombatReadinessState.SHAKEN].balanceThreshold
    ) {
      return CombatReadinessState.VULNERABLE;
    }

    // Check for SHAKEN state
    // Health <= 80%, pain >= 20, consciousness <= 80, or balance <= 80
    if (
      healthPercent < this.stateThresholds[CombatReadinessState.READY].healthThreshold ||
      pain > this.stateThresholds[CombatReadinessState.READY].painThreshold ||
      consciousness < this.stateThresholds[CombatReadinessState.READY].consciousnessThreshold ||
      balance < this.stateThresholds[CombatReadinessState.READY].balanceThreshold
    ) {
      return CombatReadinessState.SHAKEN;
    }

    // Default to READY state
    return CombatReadinessState.READY;
  }

  /**
   * Gets the capability modifiers for a specific combat state.
   * 
   * Returns all modifiers that should be applied to player actions
   * based on their current combat readiness.
   * 
   * @param state - Combat readiness state
   * @returns Capability modifiers for the state
   * 
   * @example
   * ```typescript
   * const capability = combatStateSystem.getCapability(
   *   CombatReadinessState.SHAKEN
   * );
   * 
   * // Apply to damage calculation
   * const finalDamage = baseDamage * capability.accuracyModifier;
   * 
   * // Check if can block
   * if (!capability.canBlock) {
   *   console.log("Cannot block in this state!");
   * }
   * ```
   * 
   * @public
   * @korean 능력조회
   */
  getCapability(state: CombatReadinessState): StateCapability {
    return this.stateCapabilities[state];
  }

  /**
   * Applies combat state modifiers to a player state.
   * 
   * Creates a modified player state with capability reductions
   * based on current combat readiness.
   * 
   * @param player - Current player state
   * @param state - Combat readiness state to apply
   * @returns Modified player state with applied modifiers
   * 
   * @example
   * ```typescript
   * const state = combatStateSystem.determineState(player);
   * const modifiedPlayer = combatStateSystem.applyStateModifiers(
   *   player,
   *   state
   * );
   * ```
   * 
   * @public
   * @korean 상태적용
   */
  applyStateModifiers(
    player: PlayerState,
    state: CombatReadinessState
  ): PlayerState {
    const capability = this.getCapability(state);

    return {
      ...player,
      attackPower: Math.floor(player.attackPower * capability.accuracyModifier),
      defense: Math.floor(player.defense * capability.defenseModifier),
      speed: Math.floor(player.speed * capability.speedModifier),
      isBlocking: player.isBlocking && capability.canBlock,
      isStunned: player.isStunned || !capability.canExecuteTechniques,
    };
  }

  /**
   * Gets bilingual name for combat state.
   * 
   * @param state - Combat readiness state
   * @returns Korean and English state names
   * 
   * @public
   * @korean 상태이름
   */
  getStateName(state: CombatReadinessState): { korean: string; english: string } {
    const names: Record<CombatReadinessState, { korean: string; english: string }> = {
      [CombatReadinessState.READY]: {
        korean: "준비완료",
        english: "Ready",
      },
      [CombatReadinessState.SHAKEN]: {
        korean: "동요상태",
        english: "Shaken",
      },
      [CombatReadinessState.VULNERABLE]: {
        korean: "취약상태",
        english: "Vulnerable",
      },
      [CombatReadinessState.HELPLESS]: {
        korean: "무력상태",
        english: "Helpless",
      },
    };

    return names[state];
  }

  /**
   * Gets emoji indicator for combat state.
   * 
   * @param state - Combat readiness state
   * @returns Emoji representing the state
   * 
   * @public
   * @korean 상태아이콘
   */
  getStateEmoji(state: CombatReadinessState): string {
    const emojis: Record<CombatReadinessState, string> = {
      [CombatReadinessState.READY]: "🟢",
      [CombatReadinessState.SHAKEN]: "🟡",
      [CombatReadinessState.VULNERABLE]: "🟠",
      [CombatReadinessState.HELPLESS]: "🔴",
    };

    return emojis[state];
  }
}

export default CombatStateSystem;
