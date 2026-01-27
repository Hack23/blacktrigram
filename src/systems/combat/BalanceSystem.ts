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
 * - Stance transitions (0.5s vulnerability window)
 * - Body part damage (legs reduce balance)
 * - Rapid stance changes (penalty system)
 *
 * ## Balance States
 *
 * - **Stable**: 80-100 balance - Full mobility and defense
 * - **Unsteady**: 50-79 balance - Reduced evasion, slower movement
 * - **Off-Balance**: 20-49 balance - Vulnerability window, defense penalty
 * - **Falling**: 0-19 balance - Severe vulnerability, possible knockdown
 *
 * ## Fall System Integration
 *
 * When balance falls below 20%, the system can trigger fall animations (낙법).
 * Fall direction is determined by attack vector and player stance.
 *
 * ## Stance Transition Vulnerability
 *
 * Changing stances creates a 0.5s vulnerability window with 1.5x damage multiplier.
 * Rapid stance changes (>2 in 3s) apply additional 20% balance penalty for 2s.
 *
 * @module systems/combat/BalanceSystem
 * @category Combat System
 * @korean 균형시스템
 */

import { BodyRegion } from "@/types";
import { TrigramStance } from "@/types/common";
import {
  determineFallDirection,
  determineFallFromStance,
  getRecoveryConfig,
  isVulnerableFrame,
} from "../animation";
import type {
  FallType,
  GroundState,
  RecoveryAnimationType,
} from "../animation/core/types";
import { PlayerState } from "../player";

/**
 * Stance transition state tracking.
 *
 * **Korean**: 자세 전환 상태 (Stance Transition State)
 *
 * Tracks when a player is transitioning between stances, creating a
 * 0.5s vulnerability window with increased damage multiplier.
 */
export interface TransitionState {
  /** Whether player is currently transitioning */
  readonly isTransitioning: boolean;
  /** Timestamp when transition started (ms) */
  readonly transitionStartTime: number;
  /** Damage multiplier during transition (1.5x) */
  readonly vulnerabilityMultiplier: number;
  /** Stance transitioning from */
  readonly fromStance: TrigramStance | null;
  /** Stance transitioning to */
  readonly toStance: TrigramStance | null;
}

/**
 * Stance change history entry.
 *
 * **Korean**: 자세 변경 기록 (Stance Change Record)
 */
interface StanceChangeRecord {
  /** Timestamp of stance change */
  readonly timestamp: number;
  /** Stance changed from */
  readonly fromStance: TrigramStance;
  /** Stance changed to */
  readonly toStance: TrigramStance;
}

/**
 * Extended player state with balance system data.
 *
 * Extends PlayerState with additional balance-specific tracking.
 */
export interface BalancePlayerState extends PlayerState {
  /** Stance transition state */
  readonly transitionState?: TransitionState;
  /** Stance change history (last 5 changes) */
  readonly stanceChangeHistory?: readonly StanceChangeRecord[];
  /** Rapid change penalty end timestamp */
  readonly rapidChangePenaltyEnd?: number;
}

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
   * Stance transition constants.
   */
  private readonly transitionDuration = 500; // 0.5s in milliseconds
  private readonly transitionVulnerabilityMultiplier = 1.5; // 1.5x damage during transition

  /**
   * Rapid stance change penalty constants.
   */
  private readonly rapidChangeWindow = 3000; // 3 seconds in milliseconds
  private readonly rapidChangeThreshold = 2; // >2 changes trigger penalty
  private readonly rapidChangePenalty = 0.2; // 20% balance reduction
  private readonly rapidChangePenaltyDuration = 2000; // 2 seconds penalty
  private readonly stanceChangeHistoryLimit = 5; // Keep last 5 changes

  /**
   * Disrupts balance from combat impact.
   *
   * Calculates balance loss based on damage amount and body region hit.
   * Leg strikes cause maximum balance disruption.
   *
   * Now also considers:
   * - Body part damage modifier (damaged legs reduce balance more)
   * - Rapid stance change penalty (20% additional reduction)
   *
   * @param player - Current player state
   * @param impact - Impact force amount
   * @param region - Body region affected
   * @param currentTime - Current game time for penalty checks (optional)
   * @returns Updated player state with reduced balance
   *
   * @example
   * ```typescript
   * // Leg sweep causes major balance disruption
   * player = system.disruptBalance(
   *   player,
   *   20,
   *   BodyRegion.RIGHT_LEG,
   *   Date.now()
   * );
   * ```
   *
   * @public
   * @korean 균형파괴
   */
  disruptBalance(
    player: BalancePlayerState,
    impact: number,
    region?: BodyRegion,
    currentTime?: number
  ): BalancePlayerState {
    // Get multiplier based on region
    const multiplier = region
      ? this.regionMultipliers[region] ?? this.regionMultipliers.default
      : this.regionMultipliers.default;

    // Calculate base balance loss
    let balanceLoss = impact * multiplier * 0.6; // 0.6 = balance sensitivity

    // Apply body part damage modifier
    const bodyModifier = this.calculateBalanceModifier(player);
    balanceLoss *= 1.0 / bodyModifier; // More damage = more balance loss

    // Apply rapid stance change penalty if time is provided
    if (currentTime !== undefined && this.isRapidChangePenaltyActive(player, currentTime)) {
      balanceLoss *= 1.0 + this.rapidChangePenalty; // +20% balance loss
    }

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
   * Recovery is affected by:
   * - Balance level (harder to recover when off-balance)
   * - Stamina (low stamina = slow recovery)
   * - Body part damage (leg damage reduces recovery rate)
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
  applyRecovery(player: BalancePlayerState, deltaTime: number): BalancePlayerState {
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
    
    // Body part damage affects recovery rate
    const bodyModifier = this.calculateBalanceModifier(player);
    
    const finalModifier = recoveryModifier * (0.5 + staminaFactor * 0.5) * bodyModifier;

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
    return level === BalanceLevel.OFF_BALANCE || level === BalanceLevel.FALLING;
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

  /**
   * Checks if balance is low enough to trigger fall animation.
   *
   * Falls occur when balance drops below 20% (FALLING state).
   * This creates realistic knockdown conditions from balance loss.
   *
   * @param player - Current player state
   * @returns True if fall animation should trigger
   *
   * @example
   * ```typescript
   * if (balanceSystem.shouldTriggerFall(player)) {
   *   const fallType = balanceSystem.determineFallType(
   *     player,
   *     attackAngle,
   *     attackHeight
   *   );
   *   animationMachine.transitionTo(FALL_TYPE_TO_ANIMATION[fallType]);
   * }
   * ```
   *
   * @public
   * @korean 낙법발동확인
   */
  shouldTriggerFall(player: PlayerState): boolean {
    return player.balance < 20; // FALLING threshold
  }

  /**
   * Determines which fall animation to play based on attack and stance.
   *
   * Calculates fall direction using:
   * - Attack angle relative to player
   * - Attack height (high/mid/low)
   * - Player's current stance bias
   *
   * Korean falling techniques (낙법):
   * - 전방낙법 (Jeonbang Nakbeop): Forward fall
   * - 후방낙법 (Hubang Nakbeop): Backward fall
   * - 측방낙법 (Cheukbang Nakbeop): Side fall
   *
   * @param player - Current player state
   * @param attackAngle - Angle of attack in radians (0 = from front)
   * @param attackHeight - Attack height: 'high', 'mid', or 'low'
   * @returns Fall type to use for animation
   *
   * @example
   * ```typescript
   * // Player facing forward (0°), attacked from behind (π)
   * const fallType = balanceSystem.determineFallType(
   *   player,
   *   Math.PI,
   *   'mid'
   * );
   * // Returns: 'forward' (pushed forward by rear attack)
   *
   * // Low sweep from right side
   * const fallType = balanceSystem.determineFallType(
   *   player,
   *   Math.PI/2,
   *   'low'
   * );
   * // Returns: 'side_right' (swept to the side)
   * ```
   *
   * @public
   * @korean 낙법유형결정
   */
  determineFallType(
    _player: PlayerState,
    attackAngle: number,
    attackHeight: "high" | "mid" | "low" = "mid"
  ): FallType {
    // Get player facing angle from position or default to 0
    const playerFacing = 0; // Default facing forward

    // Use attack direction to determine fall
    return determineFallDirection(attackAngle, playerFacing, attackHeight);
  }

  /**
   * Determines fall type based on player stance when no attack direction available.
   *
   * Uses stance bias to determine likely fall direction when balance is lost
   * without a specific attack (e.g., from fatigue, leg damage accumulation).
   *
   * @param stance - Current trigram stance
   * @returns Fall type based on stance characteristics
   *
   * @example
   * ```typescript
   * // Player in Heaven stance (aggressive forward)
   * const fallType = balanceSystem.determineFallTypeFromStance(
   *   TrigramStance.GEON
   * );
   * // Returns: 'forward' (Heaven stance has forward bias)
   * ```
   *
   * @public
   * @korean 자세낙법결정
   */
  determineFallTypeFromStance(stance: TrigramStance): FallType {
    return determineFallFromStance(stance);
  }

  /**
   * Check if player is in a grounded state based on animation state.
   *
   * Player is considered grounded when in any ground_* animation state
   * (ground_prone, ground_supine, ground_side_left, ground_side_right).
   *
   * @param animationState - Current animation state from AnimationStateMachine
   * @returns True if player is on the ground
   *
   * @example
   * ```typescript
   * const isGrounded = balanceSystem.isGrounded("ground_prone");
   * // Returns: true
   *
   * const notGrounded = balanceSystem.isGrounded("idle");
   * // Returns: false
   * ```
   *
   * @public
   * @korean 지면상태확인
   */
  isGrounded(animationState: string): boolean {
    return animationState.startsWith("ground_");
  }

  /**
   * Get ground state from animation state.
   *
   * Extracts the ground position type from animation state name.
   * Returns null if not in a ground state.
   *
   * @param animationState - Current animation state from AnimationStateMachine
   * @returns Ground state or null if not grounded
   *
   * @example
   * ```typescript
   * const state = balanceSystem.getGroundState("ground_prone");
   * // Returns: "prone"
   *
   * const none = balanceSystem.getGroundState("idle");
   * // Returns: null
   * ```
   *
   * @public
   * @korean 지면자세가져오기
   */
  getGroundState(animationState: string): GroundState | null {
    if (!this.isGrounded(animationState)) {
      return null;
    }

    // Extract ground state from animation state name
    // "ground_prone" -> "prone"
    const groundType = animationState.replace("ground_", "");

    // Validate that it's a valid ground state
    if (
      groundType === "prone" ||
      groundType === "supine" ||
      groundType === "side_left" ||
      groundType === "side_right"
    ) {
      return groundType as GroundState;
    }

    return null;
  }

  /**
   * Check if player can execute recovery based on stamina.
   *
   * Some recovery animations (like roll recovery) require stamina.
   * This checks if player has sufficient stamina for the recovery type.
   *
   * @param player - Current player state
   * @param recoveryType - Type of recovery animation
   * @returns True if player has enough stamina
   *
   * @example
   * ```typescript
   * // Roll recovery costs 20 stamina
   * const canRoll = balanceSystem.canRecoverWithType(player, "roll_recovery");
   * // Returns: true if player.stamina >= 20
   *
   * // Normal recoveries have no cost
   * const canStand = balanceSystem.canRecoverWithType(player, "prone_standup");
   * // Returns: true (no stamina requirement)
   * ```
   *
   * @public
   * @korean 회복가능확인
   */
  canRecoverWithType(
    player: PlayerState,
    recoveryType: RecoveryAnimationType
  ): boolean {
    const config = getRecoveryConfig(recoveryType);

    // Check if player has enough stamina
    return player.stamina >= config.staminaCost;
  }

  /**
   * Apply stamina cost for recovery animation.
   *
   * Deducts stamina cost from player state for recovery animations
   * that require stamina (like roll recovery).
   *
   * @param player - Current player state
   * @param recoveryType - Type of recovery animation
   * @returns Updated player state with stamina deducted
   *
   * @example
   * ```typescript
   * // Roll recovery costs 20 stamina
   * const recovered = balanceSystem.applyRecoveryCost(player, "roll_recovery");
   * // recovered.stamina = player.stamina - 20
   * ```
   *
   * @public
   * @korean 회복비용적용
   */
  applyRecoveryCost(
    player: PlayerState,
    recoveryType: RecoveryAnimationType
  ): PlayerState {
    const config = getRecoveryConfig(recoveryType);

    if (config.staminaCost === 0) {
      return player;
    }

    return {
      ...player,
      stamina: Math.max(0, player.stamina - config.staminaCost),
    };
  }

  /**
   * Get damage multiplier during recovery animation.
   *
   * Some recovery animations (like defensive getup) provide damage reduction.
   * This returns the multiplier to apply to incoming damage.
   *
   * @param recoveryType - Type of recovery animation
   * @param currentFrame - Current frame in the animation
   * @returns Damage multiplier (1.0 = normal, 0.5 = 50% reduction)
   *
   * @example
   * ```typescript
   * // Defensive getup has 50% damage reduction
   * const multiplier = balanceSystem.getRecoveryDamageMultiplier("defensive_getup", 20);
   * // Returns: 0.5 (50% damage reduction)
   *
   * // Normal recoveries have no reduction
   * const normal = balanceSystem.getRecoveryDamageMultiplier("prone_standup", 15);
   * // Returns: 1.0 (full damage)
   * ```
   *
   * @public
   * @korean 회복피해배율
   */
  getRecoveryDamageMultiplier(
    recoveryType: RecoveryAnimationType,
    currentFrame: number
  ): number {
    const config = getRecoveryConfig(recoveryType);

    // Only apply damage reduction during vulnerable frames
    if (!isVulnerableFrame(recoveryType, currentFrame)) {
      return 1.0; // No vulnerability = full damage (or no damage if invulnerable)
    }

    // Apply damage reduction
    // damageReduction of 0.5 means 50% reduction, so multiplier is 0.5
    return 1.0 - config.damageReduction;
  }

  /**
   * Start a stance transition, creating vulnerability window.
   *
   * When a player changes stance, they become vulnerable for 0.5s with
   * a 1.5x damage multiplier. This creates tactical depth around stance changes.
   *
   * @param player - Current player state
   * @param newStance - Target stance to transition to
   * @param currentTime - Current game time in milliseconds
   * @returns Updated player state with transition tracking
   *
   * @example
   * ```typescript
   * // Player switches from Heaven to Water stance
   * const transitioning = balanceSystem.startStanceTransition(
   *   player,
   *   TrigramStance.GAM,
   *   Date.now()
   * );
   * // transitioning.transitionState.isTransitioning = true
   * // transitioning.transitionState.vulnerabilityMultiplier = 1.5
   * ```
   *
   * @public
   * @korean 자세전환시작
   */
  startStanceTransition(
    player: BalancePlayerState,
    newStance: TrigramStance,
    currentTime: number
  ): BalancePlayerState {
    // No-op if changing to the same stance (avoid unnecessary transitions)
    if (newStance === player.currentStance) {
      return player;
    }

    // Initialize transition state
    const transitionState: TransitionState = {
      isTransitioning: true,
      transitionStartTime: currentTime,
      vulnerabilityMultiplier: this.transitionVulnerabilityMultiplier,
      fromStance: player.currentStance,
      toStance: newStance,
    };

    // Add to stance change history
    const historyEntry: StanceChangeRecord = {
      timestamp: currentTime,
      fromStance: player.currentStance,
      toStance: newStance,
    };

    const history = player.stanceChangeHistory ?? [];
    const newHistory = [...history, historyEntry].slice(-this.stanceChangeHistoryLimit);

    // Check for rapid stance changes (inclusive boundary)
    const recentChanges = newHistory.filter(
      (entry) => currentTime - entry.timestamp <= this.rapidChangeWindow
    );

    let rapidChangePenaltyEnd = player.rapidChangePenaltyEnd;

    if (recentChanges.length > this.rapidChangeThreshold) {
      // Apply rapid change penalty
      rapidChangePenaltyEnd = currentTime + this.rapidChangePenaltyDuration;
    }

    return {
      ...player,
      currentStance: newStance,
      lastStanceChangeTime: currentTime,
      transitionState,
      stanceChangeHistory: newHistory,
      rapidChangePenaltyEnd,
    };
  }

  /**
   * Update stance transition state based on time elapsed.
   *
   * Transitions last 0.5s. After that, vulnerability window closes.
   * Called each frame to manage transition timing.
   *
   * @param player - Current player state
   * @param currentTime - Current game time in milliseconds
   * @returns Updated player state
   *
   * @example
   * ```typescript
   * // In game loop
   * player = balanceSystem.updateTransition(player, Date.now());
   * ```
   *
   * @public
   * @korean 전환상태갱신
   */
  updateTransition(
    player: BalancePlayerState,
    currentTime: number
  ): BalancePlayerState {
    if (!player.transitionState?.isTransitioning) {
      return player;
    }

    const elapsed = currentTime - player.transitionState.transitionStartTime;

    // Check if transition window has ended
    if (elapsed >= this.transitionDuration) {
      return {
        ...player,
        transitionState: {
          ...player.transitionState,
          isTransitioning: false,
          vulnerabilityMultiplier: 1.0,
        },
      };
    }

    return player;
  }

  /**
   * Calculate balance modifier based on body part damage.
   *
   * Leg damage significantly reduces balance. The leg-specific modifier
   * scales linearly from 0.7x at 0% leg health to 1.0x at 100% leg health:
   * - 100% leg health: 1.0x balance (no reduction from legs)
   * - 70% leg health: ≈0.91x balance (≈9% reduction from legs)
   * - 30% leg health: ≈0.79x balance (≈21% reduction from legs)
   * - 0% leg health: 0.7x balance (30% reduction from legs)
   *
   * Torso damage also affects balance but to a lesser degree, and the
   * combined leg/torso modifier is clamped so the final balance modifier
   * stays within the range 0.5x to 1.0x.
   *
   * @param player - Current player state with body part health
   * @returns Balance modifier (0.5 to 1.0)
   *
   * @example
   * ```typescript
   * const modifier = balanceSystem.calculateBalanceModifier(player);
   * const effectiveBalance = player.balance * modifier;
   * ```
   *
   * @public
   * @korean 균형조정계수계산
   */
  calculateBalanceModifier(player: BalancePlayerState): number {
    if (!player.bodyPartHealth || !player.bodyPartMaxHealth) {
      return 1.0; // No body part tracking, no modifier
    }

    // Read leg and torso health ratios from body part health tracking
    const leftLegHealthRaw =
      (player.bodyPartHealth.legLeft ?? 0) /
      (player.bodyPartMaxHealth.legLeft ?? 1);
    const rightLegHealthRaw =
      (player.bodyPartHealth.legRight ?? 0) /
      (player.bodyPartMaxHealth.legRight ?? 1);
    
    // Use torsoLower for core balance (lower body)
    const torsoHealthRaw =
      (player.bodyPartHealth.torsoLower ?? 0) /
      (player.bodyPartMaxHealth.torsoLower ?? 1);

    // Clamp health ratios to [0, 1] to prevent out-of-range values
    const leftLegHealth = Math.max(0, Math.min(1, leftLegHealthRaw));
    const rightLegHealth = Math.max(0, Math.min(1, rightLegHealthRaw));
    const torsoHealth = Math.max(0, Math.min(1, torsoHealthRaw));

    // Average leg health (both legs affect balance)
    const avgLegHealth = (leftLegHealth + rightLegHealth) / 2;

    // Leg damage: 0-30% reduction based on damage
    const legModifier = 0.7 + avgLegHealth * 0.3; // Range: 0.7 to 1.0

    // Torso damage: 0-10% reduction based on damage
    const torsoModifier = 0.9 + torsoHealth * 0.1; // Range: 0.9 to 1.0

    // Combine modifiers (multiplicative)
    const combinedModifier = legModifier * torsoModifier;

    // Clamp to [0.5, 1.0] range as documented
    return Math.max(0.5, Math.min(1.0, combinedModifier));
  }

  /**
   * Calculate knockback resistance based on current stance.
   *
   * Different stances provide varying levels of knockback resistance:
   * - Defensive stances (Mountain, Earth): +50% resistance
   * - Balanced stances (Water, Wind): normal resistance
   * - Offensive stances (Heaven, Fire, Thunder): -30% resistance
   * - Fluid stance (Lake): normal resistance
   *
   * @param stance - Current trigram stance
   * @returns Knockback resistance multiplier (0.7 to 1.5)
   *
   * @example
   * ```typescript
   * const resistance = balanceSystem.getKnockbackResistance(TrigramStance.GAN);
   * const effectiveKnockback = baseKnockback * (1.0 / resistance);
   * ```
   *
   * @public
   * @korean 넉백저항계산
   */
  getKnockbackResistance(stance: TrigramStance): number {
    // Defensive stances: +50% resistance
    if (stance === TrigramStance.GAN || stance === TrigramStance.GON) {
      // Mountain, Earth
      return 1.5;
    }

    // Offensive stances: -30% resistance
    if (stance === TrigramStance.GEON || stance === TrigramStance.LI || stance === TrigramStance.JIN) {
      // Heaven, Fire, Thunder
      return 0.7;
    }

    // Balanced/adaptive stances: normal resistance
    return 1.0; // Water, Wind, Lake
  }

  /**
   * Check if rapid stance change penalty is active.
   *
   * Penalty applies when player changes stances >2 times in 3 seconds.
   * Lasts for 2 seconds after the last rapid change.
   * The penalty increases balance loss by 20% in `disruptBalance()`.
   *
   * @param player - Current player state
   * @param currentTime - Current game time in milliseconds
   * @returns True if penalty is active
   *
   * @example
   * ```typescript
   * // The penalty is applied automatically in disruptBalance()
   * if (balanceSystem.isRapidChangePenaltyActive(player, Date.now())) {
   *   // Penalty active: balance loss will be increased by 20%
   *   cy.log("Rapid change penalty active");
   * }
   * ```
   *
   * @public
   * @korean 급속변경벌칙확인
   */
  isRapidChangePenaltyActive(
    player: BalancePlayerState,
    currentTime: number
  ): boolean {
    if (!player.rapidChangePenaltyEnd) {
      return false;
    }
    return currentTime < player.rapidChangePenaltyEnd;
  }

  /**
   * Get total vulnerability multiplier considering all factors.
   *
   * Combines:
   * - Base balance state vulnerability (1.0 to 2.0)
   * - Stance transition vulnerability (1.5x during 0.5s window)
   *
   * @param player - Current player state
   * @returns Combined vulnerability multiplier
   *
   * @example
   * ```typescript
   * const multiplier = balanceSystem.getTotalVulnerabilityMultiplier(player);
   * const finalDamage = baseDamage * multiplier;
   * ```
   *
   * @public
   * @korean 총취약성배율
   */
  getTotalVulnerabilityMultiplier(player: BalancePlayerState): number {
    // Get base balance vulnerability
    const level = this.getBalanceLevel(player.balance);
    const effects = this.getEffects(level);
    let multiplier = effects.vulnerabilityMultiplier;

    // Apply transition vulnerability if active
    if (player.transitionState?.isTransitioning) {
      multiplier *= player.transitionState.vulnerabilityMultiplier;
    }

    return multiplier;
  }
}

export default BalanceSystem;
