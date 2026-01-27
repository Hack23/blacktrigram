/**
 * Speed Modifier System
 *
 * **Korean**: 속도 변경 시스템 (Speed Modifier System)
 *
 * Implements comprehensive movement speed modifier system that dynamically adjusts
 * player movement speed based on multiple factors: combat stance, leg injuries,
 * stamina depletion, and combat state. Integrates with physics-based movement
 * system for authentic Korean martial arts combat feel.
 *
 * ## System Features
 *
 * - Base movement speeds for walking, running, backward, lateral, and crouching
 * - Eight Trigram stance-based speed modifiers (80% to 125%)
 * - Injury-based speed reduction from leg damage (0% to 100% penalty)
 * - Stamina-based acceleration penalty (0% to 75% penalty)
 * - Combat state speed adjustments (0% to 100% penalty)
 * - Multiplicative and additive modifier stacking
 *
 * ## Speed Calculation Formula
 *
 * ```
 * Final Speed = Base Speed
 *               × (1 - Injury Penalty with Stance & Pain)
 *               × (1 - Combat State Penalty)
 *
 * Final Acceleration = Base Acceleration
 *                      × (1 - Stamina Penalty)
 * ```
 *
 * @module systems/physics/SpeedModifierSystem
 * @category Physics System
 * @korean 속도변경시스템
 */

import type {
  BodyPartHealth,
  BodyPartMaxHealth,
} from "@/systems/bodypart/types";
import type { PlayerState } from "@/systems/player";
import { CombatState, TrigramStance } from "@/types/common";
import { BASE_MOVEMENT_ACCELERATION } from "@/types/physicsConstants";
import { STANCE_SPEED_MODIFIERS } from "./MovementPhysics";
import { injuryMovementModifier } from "@/systems/movement/InjuryMovementModifier";

/**
 * Complete speed modifier state for physics calculations.
 *
 * **Korean**: 속도 변경 상태 (Speed Modifier State)
 *
 * Contains all calculated speed modifiers and final values for application
 * to the physics-based movement system.
 *
 * @public
 * @category Physics System
 * @korean 속도변경상태
 */
export interface SpeedModifierState {
  /** Base movement speed before modifiers (m/s) */
  readonly baseSpeed: number;
  /** Stance-based speed multiplier (0.80 to 1.25) */
  readonly stanceModifier: number;
  /** Injury-based speed reduction (0.0 to 0.75, percentage reduction) - Korean: 부상감소 */
  readonly injuryPenalty: number;
  /** Combat state speed reduction (0.0 to 1.0, percentage reduction) */
  readonly combatStatePenalty: number;
  /** Stamina-based acceleration reduction (0.0 to 0.75, percentage reduction) - Korean: 스태미나효과 */
  readonly staminaPenalty: number;
  /** Final calculated movement speed (m/s) */
  readonly finalSpeed: number;
  /** Final calculated acceleration (m/s²) */
  readonly finalAcceleration: number;
  /** Whether running is allowed (false when stamina < 10%) */
  readonly canRun: boolean;
}

/**
 * Movement type enumeration.
 *
 * **Korean**: 이동 유형 (Movement Type)
 *
 * @public
 * @category Physics System
 */
export enum MovementType {
  /** Walking forward - Korean: 걷기 */
  WALKING = "walking",
  /** Running/sprinting forward - Korean: 달리기 */
  RUNNING = "running",
  /** Moving backward - Korean: 후퇴 */
  BACKWARD = "backward",
  /** Side-stepping left/right - Korean: 측면이동 */
  LATERAL = "lateral",
  /** Crouching movement - Korean: 웅크리기 */
  CROUCHING = "crouching",
}

/**
 * Speed Modifier System class.
 *
 * **Korean**: 속도 변경 시스템 클래스
 *
 * Calculates comprehensive speed modifiers from multiple factors including
 * stance, injuries, stamina, and combat state. Integrates with existing
 * body part and movement systems.
 *
 * @example
 * ```typescript
 * const system = new SpeedModifierSystem();
 *
 * const modifiers = system.calculateSpeedModifiers(
 *   playerState,
 *   MovementType.RUNNING,
 *   true // isCrouching
 * );
 *
 * // Apply to movement physics
 * movementPhysics.setMaxSpeed(modifiers.finalSpeed);
 * movementPhysics.setAcceleration(modifiers.finalAcceleration);
 * ```
 *
 * @public
 * @category Physics System
 */
export class SpeedModifierSystem {
  /**
   * Base walking speed (m/s)
   * Standard walking pace for combat movement - crosses 14m arena in ~2.3s
   *
   * **Korean**: 기본 걷기 속도 (Base Walking Speed)
   */
  private readonly BASE_WALKING_SPEED = 6.0;

  /**
   * Base running speed (m/s)
   * Sprint speed for rapid repositioning - crosses 14m arena in ~1.4s
   *
   * **Korean**: 기본 달리기 속도 (Base Running Speed)
   */
  private readonly BASE_RUNNING_SPEED = 10.0;

  /**
   * Lateral movement speed (m/s)
   * Fast side-stepping for combat positioning
   *
   * **Korean**: 측면 이동 속도 (Lateral Movement Speed)
   */
  private readonly LATERAL_SPEED = 5.0;

  /**
   * Crouching movement speed (m/s)
   * Defensive low movement for cautious approach
   *
   * **Korean**: 웅크림 이동 속도 (Crouching Movement Speed)
   */
  private readonly CROUCHING_SPEED = 3.0;

  /**
   * Backward speed multiplier (75% of forward speed)
   *
   * **Korean**: 후퇴 속도 배수 (Backward Speed Multiplier)
   */
  private readonly BACKWARD_SPEED_MULTIPLIER = 0.75;

  /**
   * Base acceleration rate (m/s²)
   * Instant-response acceleration for combat movement
   * (e.g., reaches 6 m/s walking speed in 0.2s; 10 m/s sprint speed in 0.33s)
   * Increased from 12.0 to 30.0 for responsive, arcade-style combat feel
   *
   * Imported from physicsConstants.ts to maintain consistency across systems.
   *
   * **Korean**: 기본 가속도 (Base Acceleration)
   */
  private readonly BASE_ACCELERATION = BASE_MOVEMENT_ACCELERATION;

  /**
   * Combat state speed penalty multipliers
   *
   * **Korean**: 전투 상태 속도 패널티 (Combat State Speed Penalties)
   */
  private readonly COMBAT_STATE_PENALTIES: Record<CombatState, number> = {
    [CombatState.IDLE]: 0.0, // No penalty when idle
    [CombatState.ATTACKING]: 0.3, // -30% during attack commitment
    [CombatState.DEFENDING]: 0.2, // -20% while guarding
    [CombatState.STUNNED]: 1.0, // Cannot move when stunned
    [CombatState.RECOVERING]: 0.4, // -40% during recovery frames
    [CombatState.COUNTERING]: 0.25, // -25% during counter execution
    [CombatState.TRANSITIONING]: 0.15, // -15% during stance transitions
  };

  // Constructor removed - no longer need MovementPenaltySystem instance
  // Using injuryMovementModifier singleton instead

  /**
   * Calculate comprehensive speed modifiers for player movement.
   *
   * **Korean**: 속도 변경 계산 (Calculate Speed Modifiers)
   *
   * Analyzes player state and returns complete speed modifier information
   * including all individual factors and final calculated values.
   *
   * @param playerState - Current player state with stance, health, stamina
   * @param movementType - Type of movement being performed
   * @param isCrouching - Whether player is in crouching stance
   * @returns Complete speed modifier state with all factors
   *
   * @public
   */
  public calculateSpeedModifiers(
    playerState: PlayerState,
    movementType: MovementType = MovementType.WALKING,
    isCrouching: boolean = false,
  ): SpeedModifierState {
    // Get base speed based on movement type and archetype-specific speeds
    const baseSpeed = this.getBaseSpeed(
      movementType,
      isCrouching,
      playerState.physicalAttributes,
    );

    // Calculate injury penalty from leg damage using NEW InjuryMovementModifier system
    // This replaces the old MovementPenaltySystem with comprehensive injury calculations
    const injuryPenalty = this.calculateInjuryPenalty(
      playerState.bodyPartHealth,
      playerState.bodyPartMaxHealth,
      playerState.currentStance,
      playerState.pain,
    );

    // Calculate stance modifier (already handled by InjuryMovementModifier)
    const stanceModifier = this.getStanceSpeedModifier(
      playerState.currentStance,
    );

    // Calculate combat state penalty
    const combatStatePenalty = this.getCombatStatePenalty(
      playerState.combatState,
    );

    // Calculate stamina penalty (affects acceleration only)
    const staminaPenalty = this.calculateStaminaPenalty(
      playerState.stamina,
      playerState.maxStamina,
    );

    // Check if running is allowed
    const canRun = this.canPlayerRun(
      playerState.stamina,
      playerState.maxStamina,
    );

    // Calculate final speed using injury modifier (includes stance) and combat state penalty
    // Note: InjuryMovementModifier already includes stance, so we don't multiply by stanceModifier again
    // Formula: Base × (InjuryMovementSpeed / Base) × (1 - CombatState)
    const finalSpeed =
      baseSpeed *
      (1.0 - injuryPenalty) *
      (1.0 - combatStatePenalty);

    // Calculate final acceleration using archetype-specific base and stamina penalty
    // Formula: ArchetypeAcceleration × (1 - StaminaPenalty)
    const archetypeAcceleration =
      playerState.physicalAttributes?.acceleration ?? this.BASE_ACCELERATION;
    const finalAcceleration = archetypeAcceleration * (1.0 - staminaPenalty);

    return {
      baseSpeed,
      stanceModifier,
      injuryPenalty,
      combatStatePenalty,
      staminaPenalty,
      finalSpeed,
      finalAcceleration,
      canRun,
    };
  }

  /**
   * Get base speed for movement type.
   *
   * **Korean**: 기본 속도 계산 (Get Base Speed)
   *
   * Uses archetype-specific walk/run speeds when available,
   * falls back to default values for backwards compatibility.
   *
   * @param movementType - Type of movement
   * @param isCrouching - Whether player is crouching
   * @param physicalAttributes - Player's physical attributes (optional)
   * @returns Base speed in m/s
   *
   * @private
   */
  private getBaseSpeed(
    movementType: MovementType,
    isCrouching: boolean,
    physicalAttributes?: import("@/types").PhysicalAttributes,
  ): number {
    if (isCrouching) {
      return this.CROUCHING_SPEED;
    }

    // Use archetype-specific speeds if available
    const archetypeWalkSpeed =
      physicalAttributes?.walkSpeed ?? this.BASE_WALKING_SPEED;
    const archetypeRunSpeed =
      physicalAttributes?.runSpeed ?? this.BASE_RUNNING_SPEED;

    switch (movementType) {
      case MovementType.WALKING:
        return archetypeWalkSpeed;
      case MovementType.RUNNING:
        return archetypeRunSpeed;
      case MovementType.BACKWARD:
        return archetypeWalkSpeed * this.BACKWARD_SPEED_MULTIPLIER;
      case MovementType.LATERAL:
        // Lateral speed scales proportionally to archetype walk speed
        return (
          archetypeWalkSpeed * (this.LATERAL_SPEED / this.BASE_WALKING_SPEED)
        );
      case MovementType.CROUCHING:
        return this.CROUCHING_SPEED;
      default:
        return archetypeWalkSpeed;
    }
  }

  /**
   * Get stance-based speed modifier.
   *
   * **Korean**: 자세 속도 배수 계산 (Get Stance Speed Modifier)
   *
   * @param stance - Current Eight Trigram stance
   * @returns Speed multiplier (0.80 to 1.25)
   *
   * @private
   */
  private getStanceSpeedModifier(stance: TrigramStance): number {
    return STANCE_SPEED_MODIFIERS[stance] ?? 1.0;
  }

  /**
   * Calculate injury-based speed penalty from leg damage.
   *
   * **Korean**: 부상 속도 패널티 계산 (Calculate Injury Penalty)
   *
   * Uses NEW InjuryMovementModifier to determine speed reduction based on
   * leg damage severity, torso damage, stance, and pain levels.
   * Penalties are progressive and realistic:
   * - Leg injuries: 0-100% penalty based on health
   * - Torso injuries: 0-30% minor penalty
   * - Both legs injured: Additional 20% cumulative penalty
   * - Stance modifiers: -20% (defensive) to +25% (offensive)
   * - Pain overload: -15% when pain ≥ 80
   *
   * @param bodyPartHealth - Current body part health
   * @param bodyPartMaxHealth - Maximum body part health
   * @param stance - Current trigram stance
   * @param painLevel - Current pain level (0-100)
   * @returns Speed penalty as percentage (0.0 to 0.9 max)
   *
   * @private
   */
  private calculateInjuryPenalty(
    bodyPartHealth: BodyPartHealth | undefined,
    bodyPartMaxHealth: BodyPartMaxHealth | undefined,
    stance: TrigramStance,
    painLevel: number,
  ): number {
    if (!bodyPartHealth || !bodyPartMaxHealth) {
      return 0.0; // No penalty if body part health not tracked
    }

    // Use NEW InjuryMovementModifier system for comprehensive injury calculation
    // This includes leg injuries, torso damage, both-legs penalty, stance, and pain
    const result = injuryMovementModifier.calculateMovementSpeed(
      1.0, // Base speed of 1.0 to get pure multiplier
      bodyPartHealth,
      stance,
      painLevel,
    );

    // Convert speedMultiplier to penalty percentage
    // speedMultiplier of 1.0 = no penalty (0.0)
    // speedMultiplier of 0.5 = 50% penalty (0.5)
    // speedMultiplier of 0.1 = 90% penalty (0.9)
    const penalty = 1.0 - result.speedMultiplier;

    // Return penalty (already clamped by InjuryMovementModifier to min 0.1 speed)
    return Math.min(penalty, 0.9);
  }

  /**
   * Calculate combat state speed penalty.
   *
   * **Korean**: 전투 상태 속도 패널티 계산 (Get Combat State Penalty)
   *
   * Different combat states restrict movement:
   * - IDLE: 0% penalty (full movement)
   * - ATTACKING: -30% penalty (committed to technique)
   * - DEFENDING: -20% penalty (guard up, limited mobility)
   * - STUNNED: -100% penalty (cannot move)
   * - RECOVERING: -40% penalty (vulnerable, slow movement)
   * - COUNTERING: -25% penalty (counter execution)
   * - TRANSITIONING: -15% penalty (stance change)
   *
   * @param combatState - Current combat state
   * @returns Speed penalty as percentage (0.0 to 1.0)
   *
   * @private
   */
  private getCombatStatePenalty(combatState: CombatState): number {
    return this.COMBAT_STATE_PENALTIES[combatState] ?? 0.0;
  }

  /**
   * Calculate stamina-based acceleration penalty.
   *
   * **Korean**: 스태미나 가속 패널티 계산 (Calculate Stamina Penalty)
   *
   * Stamina affects acceleration rate, making it harder to change direction
   * or speed up when fatigued:
   * - High stamina (70-100%): 0% penalty (normal acceleration)
   * - Medium stamina (40-70%): -20% penalty
   * - Low stamina (10-40%): -50% penalty
   * - Depleted stamina (<10%): -75% penalty, cannot run
   *
   * @param currentStamina - Current stamina points
   * @param maxStamina - Maximum stamina capacity
   * @returns Acceleration penalty as percentage (0.0 to 0.75)
   *
   * @private
   */
  private calculateStaminaPenalty(
    currentStamina: number,
    maxStamina: number,
  ): number {
    if (maxStamina <= 0) {
      return 0.0; // No penalty if stamina not tracked
    }

    const staminaPercent = (currentStamina / maxStamina) * 100;

    if (staminaPercent >= 70) {
      return 0.0; // High stamina: no penalty
    } else if (staminaPercent >= 40) {
      return 0.2; // Medium stamina: -20% acceleration
    } else if (staminaPercent >= 10) {
      return 0.5; // Low stamina: -50% acceleration
    } else {
      return 0.75; // Depleted stamina: -75% acceleration
    }
  }

  /**
   * Check if player can run based on stamina level.
   *
   * **Korean**: 달리기 가능 확인 (Can Player Run)
   *
   * @param currentStamina - Current stamina points
   * @param maxStamina - Maximum stamina capacity
   * @returns True if player has enough stamina to run
   *
   * @private
   */
  private canPlayerRun(currentStamina: number, maxStamina: number): boolean {
    if (maxStamina <= 0) {
      return true; // Allow running if stamina not tracked
    }

    const staminaPercent = (currentStamina / maxStamina) * 100;
    return staminaPercent >= 10; // Cannot run when stamina < 10%
  }

  /**
   * Apply speed modifiers to movement physics system.
   *
   * **Korean**: 속도 변경 적용 (Apply Speed Modifiers)
   *
   * Convenience method to directly apply calculated modifiers to a
   * movement physics instance.
   *
   * @param movementPhysics - Movement physics system to update
   * @param modifiers - Calculated speed modifier state
   *
   * @public
   */
  public applySpeedModifiers(
    movementPhysics: {
      setMaxSpeed: (speed: number) => void;
      setAcceleration: (accel: number) => void;
    },
    modifiers: SpeedModifierState,
  ): void {
    movementPhysics.setMaxSpeed(modifiers.finalSpeed);
    movementPhysics.setAcceleration(modifiers.finalAcceleration);
  }
}
