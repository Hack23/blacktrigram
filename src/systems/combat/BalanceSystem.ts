/**
 * Balance System for managing stability and vulnerability windows.
 * 
 * **Korean**: 균형 시스템 (Balance System)
 * 
 * Implements physical balance and stability mechanics. Loss of balance creates
 * vulnerability windows where damage is increased and defensive options limited.
 * Balance is affected by:
 * - Leg strikes
 * - Throws and sweeps
 * - Heavy impacts
 * - Fatigue (low stamina)
 * 
 * ## Balance States
 * 
 * - **Stable**: 80-100 balance - Full mobility and defense
 * - **Unsteady**: 50-79 balance - Reduced evasion, slower movement
 * - **Off-Balance**: 20-49 balance - Vulnerability window, defense penalty
 * - **Falling**: 0-19 balance - Severe vulnerability, possible knockdown
 * 
 * @module systems/combat/BalanceSystem
 * @category Combat System
 * @korean 균형시스템
 */

import { PlayerState } from "../player";
import { BodyRegion } from "@/types";

/**
 * Balance levels representing physical stability.
 * 
 * **Korean**: 균형 수준
 */
export enum BalanceLevel {
  /** Stable footing (80-100) */
  STABLE = "stable",
  /** Unsteady but controlled (50-79) */
  UNSTEADY = "unsteady",
  /** Off-balance, vulnerable (20-49) */
  OFF_BALANCE = "off_balance",
  /** Falling or knocked down (0-19) */
  FALLING = "falling",
}

/**
 * Effects of balance on combat performance.
 */
interface BalanceEffects {
  /** Balance value range */
  readonly range: readonly [number, number];
  /** Defense multiplier */
  readonly defenseMultiplier: number;
  /** Evasion success chance modifier */
  readonly evasionModifier: number;
  /** Movement speed multiplier */
  readonly movementSpeedMultiplier: number;
  /** Vulnerability to attacks multiplier */
  readonly vulnerabilityMultiplier: number;
  /** Can perform evasive actions */
  readonly canEvade: boolean;
  /** Risk of knockdown */
  readonly knockdownRisk: number;
}

/**
 * Balance System managing stability and vulnerability.
 * 
 * Balance represents physical stability and center of gravity control.
 * Low balance creates vulnerability windows where opponents can capitalize
 * with increased damage and reduced defensive options.
 * 
 * @example
 * ```typescript
 * const balanceSystem = new BalanceSystem();
 * 
 * // Apply balance disruption from leg strike
 * const newPlayer = balanceSystem.disruptBalance(
 *   player,
 *   15,
 *   BodyRegion.LEFT_LEG
 * );
 * 
 * // Check if vulnerable
 * const isVulnerable = balanceSystem.isVulnerable(newPlayer);
 * 
 * // Apply recovery
 * const recovered = balanceSystem.applyRecovery(newPlayer, 1000);
 * ```
 * 
 * @public
 * @korean 균형시스템
 */
export class BalanceSystem {
  /**
   * Balance level effects and thresholds.
   */
  private readonly balanceEffects: Record<BalanceLevel, BalanceEffects> = {
    [BalanceLevel.STABLE]: {
      range: [80, 100],
      defenseMultiplier: 1.0,
      evasionModifier: 1.0,
      movementSpeedMultiplier: 1.0,
      vulnerabilityMultiplier: 1.0,
      canEvade: true,
      knockdownRisk: 0.0,
    },
    [BalanceLevel.UNSTEADY]: {
      range: [50, 79],
      defenseMultiplier: 0.85,
      evasionModifier: 0.7,
      movementSpeedMultiplier: 0.85,
      vulnerabilityMultiplier: 1.15,
      canEvade: true,
      knockdownRisk: 0.1,
    },
    [BalanceLevel.OFF_BALANCE]: {
      range: [20, 49],
      defenseMultiplier: 0.6,
      evasionModifier: 0.4,
      movementSpeedMultiplier: 0.6,
      vulnerabilityMultiplier: 1.5, // 50% more damage taken
      canEvade: false,
      knockdownRisk: 0.3,
    },
    [BalanceLevel.FALLING]: {
      range: [0, 19],
      defenseMultiplier: 0.3,
      evasionModifier: 0.0,
      movementSpeedMultiplier: 0.3,
      vulnerabilityMultiplier: 2.0, // 100% more damage taken
      canEvade: false,
      knockdownRisk: 0.8,
    },
  };

  /**
   * Balance disruption multipliers by body region.
   */
  private readonly regionMultipliers: Record<string, number> = {
    [BodyRegion.LEFT_LEG]: 2.5,
    [BodyRegion.RIGHT_LEG]: 2.5,
    [BodyRegion.CORE]: 2.0,
    [BodyRegion.TORSO]: 1.5,
    [BodyRegion.HEAD]: 1.0,
    default: 0.5,
  };

  /**
   * Base balance recovery rate per second.
   */
  private readonly baseRecoveryRate = 8.0; // 8 points per second

  /**
   * Maximum balance value.
   */
  private readonly maxBalance = 100;

  /**
   * Disrupts balance from combat impact.
   * 
   * Calculates balance loss based on damage amount and body region hit.
   * Leg strikes cause maximum balance disruption.
   * 
   * @param player - Current player state
   * @param impact - Impact force amount
   * @param region - Body region affected
   * @returns Updated player state with reduced balance
   * 
   * @example
   * ```typescript
   * // Leg sweep causes major balance disruption
   * player = system.disruptBalance(
   *   player,
   *   20,
   *   BodyRegion.RIGHT_LEG
   * );
   * ```
   * 
   * @public
   * @korean 균형파괴
   */
  disruptBalance(
    player: PlayerState,
    impact: number,
    region?: BodyRegion
  ): PlayerState {
    // Get multiplier based on region
    const multiplier = region
      ? this.regionMultipliers[region] ?? this.regionMultipliers.default
      : this.regionMultipliers.default;

    // Calculate balance loss
    const balanceLoss = impact * multiplier * 0.6; // 0.6 = balance sensitivity

    // Apply balance loss, clamped to 0
    const newBalance = Math.max(0, player.balance - balanceLoss);

    return {
      ...player,
      balance: newBalance,
    };
  }

  /**
   * Applies balance recovery over time.
   * 
   * Balance recovers quickly when not being disrupted, allowing
   * fighters to regain stable footing between exchanges.
   * 
   * @param player - Current player state
   * @param deltaTime - Time elapsed in milliseconds
   * @returns Updated player state with recovered balance
   * 
   * @example
   * ```typescript
   * // In game loop
   * player = system.applyRecovery(player, 16); // ~60fps
   * ```
   * 
   * @public
   * @korean 균형회복
   */
  applyRecovery(player: PlayerState, deltaTime: number): PlayerState {
    // Already at maximum balance
    if (player.balance >= this.maxBalance) {
      return player;
    }

    const deltaSeconds = deltaTime / 1000;
    const level = this.getBalanceLevel(player.balance);

    // Recovery modifier based on balance level
    let recoveryModifier = 1.0;
    if (level === BalanceLevel.OFF_BALANCE) {
      recoveryModifier = 0.7; // Harder to recover when off-balance
    } else if (level === BalanceLevel.FALLING) {
      recoveryModifier = 0.4; // Very hard to recover when falling
    }

    // Stamina affects recovery rate
    const staminaFactor = player.stamina / player.maxStamina;
    const finalModifier = recoveryModifier * (0.5 + staminaFactor * 0.5);

    const recovery = this.baseRecoveryRate * deltaSeconds * finalModifier;
    const newBalance = Math.min(this.maxBalance, player.balance + recovery);

    return {
      ...player,
      balance: newBalance,
    };
  }

  /**
   * Determines balance level from balance value.
   * 
   * @param balance - Balance value (0-100)
   * @returns Current balance level
   * 
   * @public
   * @korean 균형수준확인
   */
  getBalanceLevel(balance: number): BalanceLevel {
    if (balance >= 80) return BalanceLevel.STABLE;
    if (balance >= 50) return BalanceLevel.UNSTEADY;
    if (balance >= 20) return BalanceLevel.OFF_BALANCE;
    return BalanceLevel.FALLING;
  }

  /**
   * Gets effects for a specific balance level.
   * 
   * @param level - Balance level
   * @returns Effects applied at that level
   * 
   * @public
   * @korean 균형효과
   */
  getEffects(level: BalanceLevel): BalanceEffects {
    return this.balanceEffects[level];
  }

  /**
   * Applies balance effects to player state.
   * 
   * Modifies player stats based on current balance level.
   * 
   * @param player - Current player state
   * @returns Modified player state with balance effects
   * 
   * @public
   * @korean 균형효과적용
   */
  applyEffects(player: PlayerState): PlayerState {
    const level = this.getBalanceLevel(player.balance);
    const effects = this.getEffects(level);

    return {
      ...player,
      defense: Math.floor(player.defense * effects.defenseMultiplier),
      speed: Math.floor(player.speed * effects.movementSpeedMultiplier),
    };
  }

  /**
   * Checks if player is vulnerable due to balance.
   * 
   * @param player - Current player state
   * @returns True if off-balance or falling
   * 
   * @public
   * @korean 균형취약확인
   */
  isVulnerable(player: PlayerState): boolean {
    const level = this.getBalanceLevel(player.balance);
    return (
      level === BalanceLevel.OFF_BALANCE || level === BalanceLevel.FALLING
    );
  }

  /**
   * Calculates damage multiplier for vulnerable balance state.
   * 
   * @param player - Current player state
   * @returns Damage multiplier (1.0 = normal, >1.0 = increased damage)
   * 
   * @public
   * @korean 취약성배율
   */
  getVulnerabilityMultiplier(player: PlayerState): number {
    const level = this.getBalanceLevel(player.balance);
    const effects = this.getEffects(level);
    return effects.vulnerabilityMultiplier;
  }

  /**
   * Checks if knockdown should occur, using a provided random function for determinism.
   * 
   * @param player - Current player state
   * @param randomFn - Optional random number generator (returns number in [0,1)), defaults to Math.random
   * @returns True if knockdown should occur
   * 
   * @public
   * @korean 넘어짐확인
   */
  shouldKnockdown(
    player: PlayerState,
    randomFn: () => number = Math.random
  ): boolean {
    const level = this.getBalanceLevel(player.balance);
    const effects = this.getEffects(level);
    return randomFn() < effects.knockdownRisk;
  }

  /**
   * Gets bilingual name for balance level.
   * 
   * @param level - Balance level
   * @returns Korean and English level names
   * 
   * @public
   * @korean 균형이름
   */
  getLevelName(level: BalanceLevel): { korean: string; english: string } {
    const names: Record<BalanceLevel, { korean: string; english: string }> = {
      [BalanceLevel.STABLE]: {
        korean: "안정",
        english: "Stable",
      },
      [BalanceLevel.UNSTEADY]: {
        korean: "불안정",
        english: "Unsteady",
      },
      [BalanceLevel.OFF_BALANCE]: {
        korean: "균형상실",
        english: "Off-Balance",
      },
      [BalanceLevel.FALLING]: {
        korean: "낙하중",
        english: "Falling",
      },
    };

    return names[level];
  }

  /**
   * Gets color indicator for balance level (for UI).
   * 
   * @param level - Balance level
   * @returns Hex color code
   * 
   * @public
   * @korean 균형색상
   */
  getLevelColor(level: BalanceLevel): number {
    const colors: Record<BalanceLevel, number> = {
      [BalanceLevel.STABLE]: 0x00ff00, // Green
      [BalanceLevel.UNSTEADY]: 0xffff00, // Yellow
      [BalanceLevel.OFF_BALANCE]: 0xff8800, // Orange
      [BalanceLevel.FALLING]: 0xff0000, // Red
    };

    return colors[level];
  }
}

export default BalanceSystem;
