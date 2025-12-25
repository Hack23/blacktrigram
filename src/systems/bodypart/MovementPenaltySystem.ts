/**
 * Movement Penalty System
 * 
 * **Korean**: 이동 패널티 시스템
 * 
 * Implements injury-based movement penalties where leg and body damage reduces
 * movement speed, stance changes, and mobility capabilities. This system applies
 * realistic combat trauma effects based on Korean martial arts principles.
 * 
 * ## System Features
 * 
 * - Progressive speed reduction based on leg health
 * - Asymmetric damage (left/right leg affects directional movement)
 * - Instant penalties from knee/ankle strikes (5 seconds)
 * - Stance change duration penalties
 * - Advanced stance restrictions when critically injured
 * - Balance integration for VULNERABLE/HELPLESS states
 * 
 * ## Movement Speed Penalties
 * 
 * | Leg Health | State | Speed | Can Run |
 * |------------|-------|-------|---------|
 * | 100-70% | Normal | 100% | Yes |
 * | 69-50% | Limping | 80% | Yes |
 * | 49-30% | Severe Limp | 60% | Yes |
 * | <30% | Hobbled | 40% | No |
 * 
 * ## Stance Change Penalties
 * 
 * - Legs <50% health: Stance change takes 2x longer
 * - Legs <30% health: Cannot change to advanced stances (only basic)
 * 
 * @module systems/bodypart/MovementPenaltySystem
 * @category Body Part System
 * @korean 이동패널티시스템
 */

import {
  BodyPart,
  BodyPartHealth,
  BodyPartMaxHealth,
  LegInjuryState,
  MovementPenalty,
  InstantMovementPenalty,
  MOVEMENT_PENALTY_CONSTANTS,
} from "./types";

/**
 * Movement Penalty System class.
 * 
 * **Korean**: 이동 패널티 시스템 클래스
 * 
 * Calculates movement penalties from leg injuries, manages instant penalties
 * from knee/ankle strikes, and integrates with balance system.
 * 
 * @example
 * ```typescript
 * const system = new MovementPenaltySystem();
 * 
 * // Calculate current movement penalty
 * const penalty = system.calculateMovementPenalty(
 *   bodyPartHealth,
 *   maxHealth,
 *   activeInstantPenalty
 * );
 * 
 * // Apply to movement speed
 * const actualSpeed = baseSpeed * penalty.speedMultiplier;
 * ```
 * 
 * @public
 * @category Body Part System
 */
export class MovementPenaltySystem {
  /**
   * Calculate movement penalty from body part health.
   * 
   * **Korean**: 이동 패널티 계산
   * 
   * Analyzes leg health and returns comprehensive movement penalty including
   * speed multiplier, stance change penalties, and balance effects.
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @param instantPenalty - Optional active instant penalty
   * @param currentTime - Current timestamp for instant penalty expiry check
   * @returns Movement penalty with all modifiers
   * 
   * @public
   */
  calculateMovementPenalty(
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth,
    instantPenalty?: InstantMovementPenalty,
    currentTime: number = Date.now()
  ): MovementPenalty {
    // Calculate average leg health percentage
    const leftLegPercent = health.legLeft / maxHealth.legLeft;
    const rightLegPercent = health.legRight / maxHealth.legRight;
    const avgLegHealth = (leftLegPercent + rightLegPercent) / 2;

    // Determine injury state and base speed multiplier
    const { injuryState, speedMultiplier } = this.getInjuryStateFromHealth(avgLegHealth);

    // Check if instant penalty is active
    const hasActiveInstantPenalty = 
      instantPenalty !== undefined &&
      instantPenalty.appliedAt + instantPenalty.duration > currentTime;

    // Apply instant penalty if active, otherwise use base multiplier
    const finalSpeedMultiplier = hasActiveInstantPenalty
      ? Math.min(speedMultiplier, instantPenalty!.speedMultiplier)
      : speedMultiplier;

    // Calculate stance change penalty
    const stanceChangePenalty = 
      avgLegHealth < MOVEMENT_PENALTY_CONSTANTS.STANCE_CHANGE.CRITICAL_THRESHOLD
        ? MOVEMENT_PENALTY_CONSTANTS.STANCE_CHANGE.INJURED
        : MOVEMENT_PENALTY_CONSTANTS.STANCE_CHANGE.NORMAL;

    // Determine if advanced stances are restricted
    const advancedStancesRestricted =
      avgLegHealth < MOVEMENT_PENALTY_CONSTANTS.STANCE_CHANGE.RESTRICTION_THRESHOLD;

    // Calculate balance modifier (lower leg health = worse balance)
    const balanceModifier = Math.max(0.3, avgLegHealth);

    // Determine if player can run
    const canRun = injuryState !== LegInjuryState.HOBBLED;

    return {
      speedMultiplier: finalSpeedMultiplier,
      canRun,
      injuryState,
      stanceChangePenalty,
      advancedStancesRestricted,
      balanceModifier,
      hasInstantPenalty: hasActiveInstantPenalty,
      instantPenaltyExpiry: hasActiveInstantPenalty
        ? instantPenalty!.appliedAt + instantPenalty!.duration
        : 0,
    };
  }

  /**
   * Get injury state and speed multiplier from leg health percentage.
   * 
   * **Korean**: 부상 상태 및 속도 배율 조회
   * 
   * @param legHealthPercent - Average leg health as percentage (0.0-1.0)
   * @returns Injury state and corresponding speed multiplier
   * 
   * @private
   */
  private getInjuryStateFromHealth(legHealthPercent: number): {
    injuryState: LegInjuryState;
    speedMultiplier: number;
  } {
    const { THRESHOLDS, SPEED_MULTIPLIERS } = MOVEMENT_PENALTY_CONSTANTS;

    if (legHealthPercent >= THRESHOLDS.NORMAL) {
      return {
        injuryState: LegInjuryState.NORMAL,
        speedMultiplier: SPEED_MULTIPLIERS.NORMAL,
      };
    } else if (legHealthPercent >= THRESHOLDS.LIMPING) {
      return {
        injuryState: LegInjuryState.LIMPING,
        speedMultiplier: SPEED_MULTIPLIERS.LIMPING,
      };
    } else if (legHealthPercent >= THRESHOLDS.SEVERE_LIMP) {
      return {
        injuryState: LegInjuryState.SEVERE_LIMP,
        speedMultiplier: SPEED_MULTIPLIERS.SEVERE_LIMP,
      };
    } else {
      return {
        injuryState: LegInjuryState.HOBBLED,
        speedMultiplier: SPEED_MULTIPLIERS.HOBBLED,
      };
    }
  }

  /**
   * Calculate asymmetric movement penalty based on movement direction and injured leg.
   * 
   * **Korean**: 비대칭 이동 패널티 계산
   * 
   * Left leg damage affects left-side movements more, and vice versa.
   * This creates realistic limping behavior where movement toward the injured
   * side is more impaired.
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @param movementDirection - Direction of movement (positive = right, negative = left)
   * @returns Additional speed multiplier for asymmetric penalty
   * 
   * @public
   */
  calculateAsymmetricPenalty(
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth,
    movementDirection: { x: number; y: number }
  ): number {
    const leftLegPercent = health.legLeft / maxHealth.legLeft;
    const rightLegPercent = health.legRight / maxHealth.legRight;

    // Only apply asymmetric penalty if one leg is significantly more damaged
    const legHealthDifference = Math.abs(leftLegPercent - rightLegPercent);
    if (legHealthDifference < 0.15) {
      // Both legs similarly damaged - no asymmetric penalty
      return 1.0;
    }

    // Determine which leg is more injured
    const leftLegMoreInjured = leftLegPercent < rightLegPercent;

    // Horizontal movement direction (x-axis)
    const movingLeft = movementDirection.x < -0.1;
    const movingRight = movementDirection.x > 0.1;

    if (leftLegMoreInjured) {
      // Left leg injured - left movement more impaired
      if (movingLeft) {
        return MOVEMENT_PENALTY_CONSTANTS.ASYMMETRIC.SAME_SIDE_PENALTY;
      } else if (movingRight) {
        return MOVEMENT_PENALTY_CONSTANTS.ASYMMETRIC.OPPOSITE_SIDE_PENALTY;
      }
    } else {
      // Right leg injured - right movement more impaired
      if (movingRight) {
        return MOVEMENT_PENALTY_CONSTANTS.ASYMMETRIC.SAME_SIDE_PENALTY;
      } else if (movingLeft) {
        return MOVEMENT_PENALTY_CONSTANTS.ASYMMETRIC.OPPOSITE_SIDE_PENALTY;
      }
    }

    return 1.0; // No horizontal movement
  }

  /**
   * Create instant movement penalty from knee/ankle strike.
   * 
   * **Korean**: 순간 이동 패널티 생성
   * 
   * Applied when knee or ankle vital points are struck, causing immediate
   * severe movement impairment for 5 seconds.
   * 
   * @param affectedPart - Body part that was struck (LEG_LEFT or LEG_RIGHT)
   * @param currentTime - Timestamp when strike occurred
   * @returns Instant movement penalty configuration
   * 
   * @public
   */
  createInstantPenalty(
    affectedPart: BodyPart.LEG_LEFT | BodyPart.LEG_RIGHT,
    currentTime: number = Date.now()
  ): InstantMovementPenalty {
    return {
      speedMultiplier: MOVEMENT_PENALTY_CONSTANTS.INSTANT_PENALTY.SPEED_MULTIPLIER,
      duration: MOVEMENT_PENALTY_CONSTANTS.INSTANT_PENALTY.DURATION,
      appliedAt: currentTime,
      affectedPart,
    };
  }

  /**
   * Check if player should enter VULNERABLE state from leg damage.
   * 
   * **Korean**: 취약 상태 확인
   * 
   * Low leg health increases chance of entering vulnerable state,
   * making player more susceptible to follow-up attacks.
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @returns True if player should enter vulnerable state
   * 
   * @public
   */
  shouldEnterVulnerableState(
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth
  ): boolean {
    const leftLegPercent = health.legLeft / maxHealth.legLeft;
    const rightLegPercent = health.legRight / maxHealth.legRight;
    const avgLegHealth = (leftLegPercent + rightLegPercent) / 2;

    // Enter vulnerable state when legs are critically damaged
    return avgLegHealth < MOVEMENT_PENALTY_CONSTANTS.THRESHOLDS.SEVERE_LIMP;
  }

  /**
   * Check if player should enter HELPLESS state from leg damage.
   * 
   * **Korean**: 무력 상태 확인
   * 
   * Both legs critically damaged or hobbled - player cannot maintain
   * effective combat stance and is highly vulnerable.
   * 
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @returns True if player should enter helpless state
   * 
   * @public
   */
  shouldEnterHelplessState(
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth
  ): boolean {
    const leftLegPercent = health.legLeft / maxHealth.legLeft;
    const rightLegPercent = health.legRight / maxHealth.legRight;

    // Enter helpless state when both legs are hobbled
    return (
      leftLegPercent < MOVEMENT_PENALTY_CONSTANTS.THRESHOLDS.SEVERE_LIMP &&
      rightLegPercent < MOVEMENT_PENALTY_CONSTANTS.THRESHOLDS.SEVERE_LIMP
    );
  }

  /**
   * Calculate modified movement speed with all penalties applied.
   * 
   * **Korean**: 수정된 이동 속도 계산
   * 
   * Applies base movement penalty, asymmetric penalties, and instant penalties
   * to calculate the final movement speed.
   * 
   * @param baseSpeed - Base movement speed (pixels per frame)
   * @param health - Current body part health
   * @param maxHealth - Maximum health values
   * @param movementDirection - Direction vector of movement
   * @param instantPenalty - Optional active instant penalty
   * @param currentTime - Current timestamp
   * @returns Final movement speed with all penalties applied
   * 
   * @public
   */
  calculateModifiedSpeed(
    baseSpeed: number,
    health: BodyPartHealth,
    maxHealth: BodyPartMaxHealth,
    movementDirection: { x: number; y: number },
    instantPenalty?: InstantMovementPenalty,
    currentTime: number = Date.now()
  ): number {
    // Get base movement penalty
    const penalty = this.calculateMovementPenalty(
      health,
      maxHealth,
      instantPenalty,
      currentTime
    );

    // Calculate asymmetric penalty
    const asymmetricMultiplier = this.calculateAsymmetricPenalty(
      health,
      maxHealth,
      movementDirection
    );

    // Apply all multipliers
    return baseSpeed * penalty.speedMultiplier * asymmetricMultiplier;
  }
}

/**
 * Singleton instance of Movement Penalty System.
 * 
 * **Korean**: 이동 패널티 시스템 싱글톤
 * 
 * Provides global access to the movement penalty system throughout the game.
 * 
 * @public
 */
export const movementPenaltySystem = new MovementPenaltySystem();
