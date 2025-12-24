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
  /** Accuracy modifier (affects hit chance and damage output) */
  readonly accuracyModifier: number;
  /** Defense modifier (affects damage reduction) */
  readonly defenseModifier: number;
  /** Damage modifier (affects outgoing damage) */
  readonly damageModifier: number;
  /** Damage taken multiplier (affects incoming damage) */
  readonly damageTakenMultiplier: number;
  /** Movement speed modifier */
  readonly speedModifier: number;
  /** Can perform blocking actions */
  readonly canBlock: boolean;
  /** Can execute techniques */
  readonly canExecuteTechniques: boolean;
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
   * 
   * Based on acceptance criteria:
   * - READY: 100% capability (baseline)
   * - SHAKEN: -15% accuracy, -10% damage
   * - VULNERABLE: -30% accuracy, -25% damage, +50% damage taken
   * - HELPLESS: Cannot attack, cannot block, +100% damage taken
   */
  private readonly stateCapabilities: Record<CombatReadinessState, StateCapability> = {
    [CombatReadinessState.READY]: {
      capability: 1.0, // 100%
      accuracyModifier: 1.0,
      defenseModifier: 1.0,
      damageModifier: 1.0,
      damageTakenMultiplier: 1.0, // Normal damage taken
      speedModifier: 1.0,
      canBlock: true,
      canExecuteTechniques: true,
    },
    [CombatReadinessState.SHAKEN]: {
      capability: 0.85, // 85%
      accuracyModifier: 0.85, // -15% accuracy
      defenseModifier: 1.0,
      damageModifier: 0.9, // -10% damage
      damageTakenMultiplier: 1.0, // Normal damage taken
      speedModifier: 0.95,
      canBlock: true,
      canExecuteTechniques: true,
    },
    [CombatReadinessState.VULNERABLE]: {
      capability: 0.7, // 70%
      accuracyModifier: 0.7, // -30% accuracy
      defenseModifier: 0.75,
      damageModifier: 0.75, // -25% damage
      damageTakenMultiplier: 1.5, // +50% damage taken
      speedModifier: 0.8,
      canBlock: true,
      canExecuteTechniques: true,
    },
    [CombatReadinessState.HELPLESS]: {
      capability: 0.0, // 0%
      accuracyModifier: 0.0, // Cannot attack
      defenseModifier: 0.0,
      damageModifier: 0.0, // Cannot attack
      damageTakenMultiplier: 2.0, // +100% damage taken (2x)
      speedModifier: 0.3,
      canBlock: false, // Cannot block
      canExecuteTechniques: false,
    },
  };

  /**
   * Determines the current combat readiness state based on player condition.
   * 
   * Evaluates health, pain, consciousness, balance, and recent hits to determine
   * the most appropriate combat state. State transitions follow acceptance criteria:
   * - READY → SHAKEN: After taking 2-3 hits or significant vital point strike
   * - SHAKEN → VULNERABLE: After additional 2 hits or loss of 30% body part health
   * - VULNERABLE → HELPLESS: After head trauma, pain >80, or knock-down
   * - Recovery: HELPLESS → READY over 5 seconds if no additional hits
   * 
   * @param player - Current player state
   * @param currentTime - Current timestamp in milliseconds
   * @returns Current combat readiness state
   * 
   * @example
   * ```typescript
   * const state = combatStateSystem.determineState(player, Date.now());
   * if (state === CombatReadinessState.HELPLESS) {
   *   console.log("Player is near incapacitation!");
   * }
   * ```
   * 
   * @public
   * @korean 상태결정
   */
  determineState(player: PlayerState, currentTime?: number): CombatReadinessState {
    const healthPercent = player.health / player.maxHealth;
    const pain = player.pain;
    const consciousness = player.consciousness;
    const balance = player.balance;
    
    // Count recent hits (within last 10 seconds)
    const recentHits = this.countRecentHits(player, currentTime, 10000);
    
    // Check for recovery from HELPLESS state
    // If player was helpless and recovery conditions are met, allow normal state determination
    // Recovery overrides low stats if enough time has passed without hits
    if (player.lastHelplessStateTime && currentTime) {
      const timeSinceHelpless = currentTime - player.lastHelplessStateTime;
      const noRecentHits = this.countRecentHits(player, currentTime, 5000) === 0;
      
      // Recovery: HELPLESS → normal state after 5 seconds if no additional hits
      if (timeSinceHelpless >= 5000 && noRecentHits) {
        // Player has recovered - skip HELPLESS check and determine state normally
        // This allows recovery even if stats are still low
        // Continue to normal state determination below
      } else if (timeSinceHelpless < 5000) {
        // Still in recovery period, check if should remain HELPLESS
        const stillCritical = healthPercent <= 0.3 || pain > 80 || consciousness <= 20 || balance <= 20;
        if (stillCritical) {
          return CombatReadinessState.HELPLESS;
        }
      }
    }

    // Check for HELPLESS state (worst condition) - only if not in recovery
    // Triggers: health <= 30%, pain > 80, consciousness <= 20, balance <= 20, or head trauma
    const hasHeadTrauma = player.bodyPartHealth 
      ? (player.bodyPartHealth.head / (player.bodyPartMaxHealth?.head ?? 100)) < 0.5
      : false;
    
    // Only enter HELPLESS if not already recovering
    const isRecovering = player.lastHelplessStateTime && currentTime 
      && (currentTime - player.lastHelplessStateTime) >= 5000
      && this.countRecentHits(player, currentTime, 5000) === 0;
    
    if (!isRecovering && (
      healthPercent <= 0.3 ||
      pain > 80 ||
      consciousness <= 20 ||
      balance <= 20 ||
      hasHeadTrauma
    )) {
      return CombatReadinessState.HELPLESS;
    }

    // Check for VULNERABLE state
    // Triggers: health <= 50%, pain > 60, consciousness <= 40, balance <= 40,
    // or 30% body part health loss
    const hasBodyPartDamage = this.checkBodyPartHealthLoss(player, 0.3);
    
    if (
      healthPercent <= 0.5 ||
      pain > 60 ||
      consciousness <= 40 ||
      balance <= 40 ||
      hasBodyPartDamage ||
      recentHits >= 4 // Additional 2 hits from SHAKEN (total 4-5 hits)
    ) {
      return CombatReadinessState.VULNERABLE;
    }

    // Check for SHAKEN state
    // Triggers: health <= 70%, pain > 30, consciousness <= 60, balance <= 60,
    // or 2-3 recent hits
    if (
      healthPercent <= 0.7 ||
      pain > 30 ||
      consciousness <= 60 ||
      balance <= 60 ||
      recentHits >= 2 // 2-3 hits triggers SHAKEN
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
      attackPower: Math.floor(player.attackPower * capability.damageModifier),
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

  /**
   * Counts recent hits within a time window.
   * 
   * @param player - Current player state
   * @param currentTime - Current timestamp (milliseconds)
   * @param timeWindow - Time window to check in milliseconds
   * @returns Number of hits within the time window
   * 
   * @private
   * @korean 최근타격횟수
   */
  private countRecentHits(
    player: PlayerState,
    currentTime: number | undefined,
    timeWindow: number
  ): number {
    if (!currentTime || !player.recentHitTimestamps) {
      return 0;
    }

    const cutoffTime = currentTime - timeWindow;
    return player.recentHitTimestamps.filter(
      (timestamp) => timestamp >= cutoffTime
    ).length;
  }

  /**
   * Checks if any body part has lost more than the specified percentage of health.
   * 
   * @param player - Current player state
   * @param lossThreshold - Health loss threshold (0.0 to 1.0)
   * @returns True if any body part has lost more than the threshold
   * 
   * @private
   * @korean 신체부위손상확인
   */
  private checkBodyPartHealthLoss(
    player: PlayerState,
    lossThreshold: number
  ): boolean {
    if (!player.bodyPartHealth || !player.bodyPartMaxHealth) {
      return false;
    }

    const bodyParts: Array<keyof typeof player.bodyPartHealth> = [
      "head",
      "neck",
      "torsoUpper",
      "torsoLower",
      "armLeft",
      "armRight",
      "legLeft",
      "legRight",
    ];

    for (const part of bodyParts) {
      const current = player.bodyPartHealth[part];
      const max = player.bodyPartMaxHealth[part];
      const healthPercent = current / max;
      const lossPercent = 1 - healthPercent;

      if (lossPercent >= lossThreshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Records a hit on the player and updates recent hit tracking.
   * 
   * Should be called by combat system when player takes a hit.
   * Maintains a rolling window of the last 10 hit timestamps.
   * 
   * @param player - Current player state
   * @param currentTime - Timestamp of the hit
   * @returns Updated player state with recorded hit
   * 
   * @public
   * @korean 타격기록
   */
  recordHit(player: PlayerState, currentTime: number): PlayerState {
    const recentHits = player.recentHitTimestamps ?? [];
    
    // Add new hit timestamp and keep only last 10
    const updatedHits = [...recentHits, currentTime].slice(-10);

    return {
      ...player,
      recentHitTimestamps: updatedHits,
      hitsTaken: player.hitsTaken + 1,
    };
  }

  /**
   * Updates player when entering HELPLESS state.
   * 
   * Records the timestamp for recovery tracking.
   * 
   * @param player - Current player state
   * @param currentTime - Timestamp when entering helpless state
   * @returns Updated player state
   * 
   * @public
   * @korean 무력상태기록
   */
  enterHelplessState(player: PlayerState, currentTime: number): PlayerState {
    return {
      ...player,
      lastHelplessStateTime: currentTime,
    };
  }

  /**
   * Checks if player can recover from HELPLESS state.
   * 
   * Recovery occurs after 5 seconds with no additional hits.
   * 
   * @param player - Current player state
   * @param currentTime - Current timestamp
   * @returns True if recovery is possible
   * 
   * @public
   * @korean 회복가능확인
   */
  canRecoverFromHelpless(player: PlayerState, currentTime: number): boolean {
    if (!player.lastHelplessStateTime) {
      return false;
    }

    const timeSinceHelpless = currentTime - player.lastHelplessStateTime;
    const noRecentHits = this.countRecentHits(player, currentTime, 5000) === 0;

    return timeSinceHelpless >= 5000 && noRecentHits;
  }
}

