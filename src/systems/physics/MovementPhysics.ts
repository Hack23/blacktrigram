/**
 * Physics-based movement system for realistic combat movement.
 * 
 * **Korean**: 이동 물리 시스템 (Movement Physics System)
 * 
 * This module implements realistic physics-based player movement with proper
 * acceleration/deceleration, foot-wide step precision, and stance-based speed
 * modifiers for authentic Korean martial arts combat feel.
 * 
 * ## Features
 * 
 * - **Realistic Acceleration**: 0 to 2m/s in 0.5 seconds (4.0 m/s²)
 * - **Realistic Deceleration**: 2m/s to 0 in 0.3 seconds (6.67 m/s²)
 * - **Foot-wide Steps**: Discrete 30cm movement increments for tactical positioning
 * - **Stance Modifiers**: 8 trigram stances with different speed characteristics
 * - **Injury Integration**: Movement speed reduced by leg damage (10-50%)
 * 
 * @module systems/physics/MovementPhysics
 * @category Physics System
 * @korean 이동물리
 */

import * as THREE from 'three';
import { TrigramStance } from '@/types/common';

/**
 * Movement input from keyboard/gamepad controls.
 * 
 * **Korean**: 이동 입력 (Movement Input)
 * 
 * @public
 * @category Physics System
 * @korean 이동입력
 */
export interface MovementInput {
  /** Forward/backward input (-1 to 1, where 1 is forward) */
  readonly forward: number;
  /** Lateral left/right input (-1 to 1, where 1 is right) */
  readonly lateral: number;
  /** Whether sprint/run key is held */
  readonly isRunning: boolean;
  /** Whether any movement input is active */
  readonly isMoving: boolean;
  /** Whether to use tactical step mode (30cm grid) */
  readonly useTacticalSteps: boolean;
}

/**
 * Complete movement state for physics calculations.
 * 
 * **Korean**: 이동 상태 (Movement State)
 * 
 * Contains position, velocity, and current movement parameters.
 * All vectors are mutable for performance (updated in-place during physics loop).
 * 
 * @public
 * @category Physics System
 * @korean 이동상태
 */
export interface MovementState {
  /**
   * Current position in 3D space (meters).
   * 
   * NOTE: This is a readonly reference to a mutable THREE.Vector3.
   * The physics engine intentionally mutates the vector in-place
   * (e.g. via position.add(...)) for performance. The readonly
   * modifier prevents reassignment of the Vector3 instance, not
   * mutation of its components.
   */
  readonly position: THREE.Vector3;
  /**
   * Current velocity vector (m/s).
   * 
   * NOTE: This is a readonly reference to a mutable THREE.Vector3.
   * The physics engine updates this vector in-place each frame.
   * Callers must not reassign the velocity reference, but may pass
   * it to APIs that read or modify its components.
   */
  readonly velocity: THREE.Vector3;
  /** Current acceleration magnitude (m/s²) */
  acceleration: number;
  /** Maximum speed for current state (m/s) */
  maxSpeed: number;
  /** Current Eight Trigram stance */
  readonly currentStance: TrigramStance;
  /** Leg injury percentage (0-1, where 1 is fully injured) */
  legInjuryFactor: number;
}

/**
 * Stance-based speed modifiers for Eight Trigram system.
 * 
 * **Korean**: 팔괘 속도 배수 (Eight Trigram Speed Multipliers)
 * 
 * Each trigram stance has unique movement characteristics based on
 * traditional Korean martial arts philosophy:
 * 
 * - ☰ 건 (Geon/Heaven): 100% - Balanced, standard speed
 * - ☱ 태 (Tae/Lake): 110% - Fluid movement, flowing techniques
 * - ☲ 리 (Li/Fire): 120% - Aggressive, fast attacks
 * - ☳ 진 (Jin/Thunder): 115% - Explosive power
 * - ☴ 손 (Son/Wind): 125% - Continuous motion, fastest stance
 * - ☵ 감 (Gam/Water): 105% - Adaptive, slightly faster than neutral
 * - ☶ 간 (Gan/Mountain): 80% - Solid defense, slower movement
 * - ☷ 곤 (Gon/Earth): 85% - Grounded, stable but slower
 * 
 * @korean 자세속도배수
 */
export const STANCE_SPEED_MODIFIERS: Record<TrigramStance, number> = {
  [TrigramStance.GEON]: 1.00, // Heaven: balanced
  [TrigramStance.TAE]: 1.10,  // Lake: fluid
  [TrigramStance.LI]: 1.20,   // Fire: aggressive
  [TrigramStance.JIN]: 1.15,  // Thunder: explosive
  [TrigramStance.SON]: 1.25,  // Wind: fastest
  [TrigramStance.GAM]: 1.05,  // Water: adaptive
  [TrigramStance.GAN]: 0.80,  // Mountain: defensive
  [TrigramStance.GON]: 0.85,  // Earth: grounded
};

/**
 * Physics-based movement engine for combat.
 * 
 * **Korean**: 이동 물리 엔진 (Movement Physics Engine)
 * 
 * Implements realistic acceleration, deceleration, and stance-based movement
 * for authentic Korean martial arts combat. Supports both continuous movement
 * and tactical foot-wide steps for precise positioning.
 * 
 * @example
 * ```typescript
 * const physics = new MovementPhysics();
 * 
 * const state: MovementState = {
 *   position: new THREE.Vector3(0, 0, 0),
 *   velocity: new THREE.Vector3(0, 0, 0),
 *   acceleration: 0,
 *   maxSpeed: 2.0,
 *   currentStance: TrigramStance.GEON,
 *   legInjuryFactor: 0,
 * };
 * 
 * const input: MovementInput = {
 *   forward: 1.0,
 *   lateral: 0,
 *   isRunning: false,
 *   isMoving: true,
 *   useTacticalSteps: false,
 * };
 * 
 * // In game loop at 60fps
 * physics.updateMovement(state, input, deltaTime);
 * ```
 * 
 * @public
 * @category Physics System
 * @korean 이동물리엔진
 */
export class MovementPhysics {
  /**
   * Base acceleration rate (m/s²)
   * Achieves 0 to 2m/s in 0.5 seconds
   * 
   * **Korean**: 기본 가속도 (Base Acceleration)
   */
  private readonly BASE_ACCELERATION = 4.0;

  /**
   * Base deceleration rate (m/s²)
   * Achieves 2m/s to 0 in 0.3 seconds
   * 
   * **Korean**: 기본 감속도 (Base Deceleration)
   */
  private readonly BASE_DECELERATION = 6.67;

  /**
   * Foot-wide step size (meters)
   * Standard Korean martial arts step is approximately 30cm
   * 
   * **Korean**: 보법 거리 (Step Distance)
   */
  private readonly STEP_SIZE = 0.3;

  /**
   * Base walking speed (m/s)
   * 
   * **Korean**: 기본 걷기 속도 (Base Walking Speed)
   */
  private readonly BASE_WALK_SPEED = 2.0;

  /**
   * Base running speed (m/s)
   * 
   * **Korean**: 기본 달리기 속도 (Base Running Speed)
   */
  private readonly BASE_RUN_SPEED = 4.0;

  /**
   * Lateral movement speed (m/s) - side-stepping
   * 
   * **Korean**: 측면 이동 속도 (Lateral Movement Speed)
   */
  private readonly LATERAL_SPEED = 1.8;

  /**
   * Backward movement speed multiplier (25% slower than forward)
   * 
   * **Korean**: 후퇴 속도 배수 (Backward Speed Multiplier)
   */
  private readonly BACKWARD_SPEED_MULTIPLIER = 0.75;

  /**
   * Override for max speed from external speed modifier systems.
   * 
   * **Korean**: 최대속도 재정의 (Max Speed Override)
   */
  private _overrideMaxSpeed: number | null = null;

  /**
   * Override for acceleration from external speed modifier systems.
   * 
   * **Korean**: 가속도 재정의 (Acceleration Override)
   */
  private _overrideAcceleration: number | null = null;

  // Temporary vectors to avoid allocations in update loop
  private readonly tempTargetVelocity = new THREE.Vector3();
  private readonly tempMovement = new THREE.Vector3();
  private readonly tempDirection = new THREE.Vector3();
  private readonly tempTargetDirection = new THREE.Vector3();

  /**
   * Update player movement based on input and physics.
   * 
   * **Korean**: 이동 업데이트 (Update Movement)
   * 
   * Called every frame (60fps) to update player position based on
   * current velocity, acceleration, and input. Applies stance modifiers
   * and injury penalties automatically.
   * 
   * @param state - Current movement state (modified in-place)
   * @param input - Current movement input from controls
   * @param deltaTime - Time since last update (seconds)
   * 
   * @korean 이동업데이트
   */
  public updateMovement(
    state: MovementState,
    input: MovementInput,
    deltaTime: number
  ): void {
    // Calculate stance speed modifier
    const stanceModifier = this.getStanceSpeedModifier(state.currentStance);
    
    // Calculate injury penalty (0-50% speed reduction)
    const injuryPenalty = 1.0 - (state.legInjuryFactor * 0.5);
    
    // Calculate base target speed (walking or running)
    const baseSpeed = input.isRunning ? this.BASE_RUN_SPEED : this.BASE_WALK_SPEED;
    
    // Apply all modifiers to get final max speed (or use override)
    state.maxSpeed = this._overrideMaxSpeed !== null 
      ? this._overrideMaxSpeed 
      : baseSpeed * stanceModifier * injuryPenalty;

    // Use override acceleration if set, otherwise use base
    const currentAcceleration = this._overrideAcceleration !== null
      ? this._overrideAcceleration
      : this.BASE_ACCELERATION;

    // Calculate target velocity based on input direction
    this.tempTargetVelocity.set(
      input.lateral * this.LATERAL_SPEED * stanceModifier * injuryPenalty,
      0,
      input.forward * state.maxSpeed * (input.forward < 0 ? this.BACKWARD_SPEED_MULTIPLIER : 1.0)
    );

    // Apply acceleration or deceleration
    if (input.isMoving) {
      // Accelerate toward target velocity with realistic direction changes
      const currentSpeed = state.velocity.length();
      const targetSpeed = this.tempTargetVelocity.length();
      
      if (currentSpeed < targetSpeed) {
        // Check if direction change is needed
        if (currentSpeed > 0.001 && targetSpeed > 0.001) {
          // Current movement direction
          this.tempDirection.copy(state.velocity).normalize();
          // Desired movement direction (reuse temp vector to avoid allocation)
          this.tempTargetDirection.copy(this.tempTargetVelocity).normalize();
          const directionDot = this.tempDirection.dot(this.tempTargetDirection);

          if (directionDot < 0) {
            // Moving in opposite direction: decelerate first before reversing
            const velocityDelta = this.BASE_DECELERATION * deltaTime;
            const newSpeed = Math.max(currentSpeed - velocityDelta, 0);
            
            if (newSpeed > 0.001) {
              state.velocity.copy(this.tempDirection.multiplyScalar(newSpeed));
            } else {
              // Fully stopped; can now start accelerating in new direction
              state.velocity.set(0, 0, 0);
            }
            state.acceleration = -this.BASE_DECELERATION;
          } else if (directionDot < 0.7) {
            // Perpendicular direction change (e.g., forward to strafe): moderate deceleration
            const blendedAccel = currentAcceleration * 0.6; // Reduced acceleration for sharp turns
            const velocityDelta = blendedAccel * deltaTime;
            const newSpeed = Math.min(currentSpeed + velocityDelta, targetSpeed);
            this.tempDirection.copy(this.tempTargetVelocity).normalize();
            state.velocity.copy(this.tempDirection.multiplyScalar(newSpeed));
            state.acceleration = blendedAccel;
          } else {
            // Same or similar direction: full acceleration
            this.tempDirection.copy(this.tempTargetVelocity).normalize();
            const velocityDelta = currentAcceleration * deltaTime;
            const newSpeed = Math.min(currentSpeed + velocityDelta, targetSpeed);
            state.velocity.copy(this.tempDirection.multiplyScalar(newSpeed));
            state.acceleration = currentAcceleration;
          }
        } else {
          // Very low speed: safe to accelerate directly toward target
          this.tempDirection.copy(this.tempTargetVelocity).normalize();
          const velocityDelta = currentAcceleration * deltaTime;
          const newSpeed = Math.min(currentSpeed + velocityDelta, targetSpeed);
          state.velocity.copy(this.tempDirection.multiplyScalar(newSpeed));
          state.acceleration = currentAcceleration;
        }
      } else {
        // Already at or above target speed: snap to target velocity
        state.velocity.copy(this.tempTargetVelocity);
        state.acceleration = 0;
      }
    } else {
      // Decelerate to stop
      const currentSpeed = state.velocity.length();
      if (currentSpeed > 0.01) {
        this.tempDirection.copy(state.velocity).normalize();
        const velocityDelta = this.BASE_DECELERATION * deltaTime;
        const newSpeed = Math.max(currentSpeed - velocityDelta, 0);
        state.velocity.copy(this.tempDirection.multiplyScalar(newSpeed));
      } else {
        state.velocity.set(0, 0, 0);
      }
      state.acceleration = -this.BASE_DECELERATION;
    }

    // Calculate movement delta for this frame
    this.tempMovement.copy(state.velocity).multiplyScalar(deltaTime);

    // Apply tactical step quantization if enabled
    if (input.useTacticalSteps) {
      // Quantize to 30cm grid steps
      this.tempMovement.x = Math.round(this.tempMovement.x / this.STEP_SIZE) * this.STEP_SIZE;
      this.tempMovement.z = Math.round(this.tempMovement.z / this.STEP_SIZE) * this.STEP_SIZE;
    }

    // Update position
    state.position.add(this.tempMovement);
  }

  /**
   * Get speed modifier for a specific trigram stance.
   * 
   * **Korean**: 자세 속도 배수 가져오기 (Get Stance Speed Modifier)
   * 
   * @param stance - Eight Trigram stance
   * @returns Speed multiplier (0.8 to 1.25)
   * 
   * @korean 자세속도배수
   */
  public getStanceSpeedModifier(stance: TrigramStance): number {
    return STANCE_SPEED_MODIFIERS[stance];
  }

  /**
   * Calculate movement penalty from leg injury.
   * 
   * **Korean**: 부상 이동 페널티 (Injury Movement Penalty)
   * 
   * Leg damage reduces movement speed by 10-50% based on injury severity.
   * 
   * @param legHealthPercentage - Remaining leg health (0-1)
   * @returns Injury factor (0 = no injury, 1 = maximum injury)
   * 
   * @korean 부상페널티
   */
  public calculateInjuryPenalty(legHealthPercentage: number): number {
    // Injury penalty scales from 0% (healthy) to 50% (critical)
    // Clamp between 0 and 1
    const healthFactor = Math.max(0, Math.min(1, legHealthPercentage));
    return 1.0 - healthFactor;
  }

  /**
   * Get maximum speed for current state configuration.
   * 
   * **Korean**: 최대 속도 계산 (Calculate Maximum Speed)
   * 
   * @param isRunning - Whether running (vs walking)
   * @param stance - Current trigram stance
   * @param legInjuryFactor - Leg injury severity (0-1)
   * @returns Maximum speed in m/s
   * 
   * @korean 최대속도
   */
  public getMaxSpeed(
    isRunning: boolean,
    stance: TrigramStance,
    legInjuryFactor: number
  ): number {
    const baseSpeed = isRunning ? this.BASE_RUN_SPEED : this.BASE_WALK_SPEED;
    const stanceModifier = this.getStanceSpeedModifier(stance);
    const injuryPenalty = 1.0 - (legInjuryFactor * 0.5);
    return baseSpeed * stanceModifier * injuryPenalty;
  }

  /**
   * Calculate time required to reach target speed from current velocity.
   * 
   * **Korean**: 가속 시간 (Acceleration Time)
   * 
   * @param currentSpeed - Current speed magnitude (m/s)
   * @param targetSpeed - Desired speed magnitude (m/s)
   * @returns Time in seconds to reach target speed
   * 
   * @korean 가속시간
   */
  public getAccelerationTime(currentSpeed: number, targetSpeed: number): number {
    const speedDiff = Math.abs(targetSpeed - currentSpeed);
    return speedDiff / this.BASE_ACCELERATION;
  }

  /**
   * Calculate stopping distance from current velocity.
   * 
   * **Korean**: 제동 거리 (Braking Distance)
   * 
   * @param currentSpeed - Current speed magnitude (m/s)
   * @returns Distance in meters required to stop
   * 
   * @korean 제동거리
   */
  public getStoppingDistance(currentSpeed: number): number {
    // Using kinematic equation: d = v² / (2a)
    return (currentSpeed * currentSpeed) / (2 * this.BASE_DECELERATION);
  }

  /**
   * Get tactical step size.
   * 
   * **Korean**: 보법 거리 (Step Distance)
   * 
   * @returns Step size in meters (0.3m = 30cm)
   * 
   * @korean 보법거리
   */
  public getStepSize(): number {
    return this.STEP_SIZE;
  }

  /**
   * Override maximum speed for external speed modifier systems.
   * 
   * **Korean**: 최대 속도 설정 (Set Maximum Speed)
   * 
   * Allows external systems (like SpeedModifierSystem) to override
   * the calculated maximum speed. This is applied in the next
   * updateMovement call.
   * 
   * @param speed - Maximum speed in m/s
   * 
   * @public
   */
  public setMaxSpeed(speed: number): void {
    this._overrideMaxSpeed = speed;
  }

  /**
   * Override acceleration for external speed modifier systems.
   * 
   * **Korean**: 가속도 설정 (Set Acceleration)
   * 
   * Allows external systems (like SpeedModifierSystem) to override
   * the base acceleration rate. This is applied in the next
   * updateMovement call.
   * 
   * @param acceleration - Acceleration in m/s²
   * 
   * @public
   */
  public setAcceleration(acceleration: number): void {
    this._overrideAcceleration = acceleration;
  }

  /**
   * Clear speed and acceleration overrides.
   * 
   * **Korean**: 속도 재정의 해제 (Clear Speed Overrides)
   * 
   * Resets movement to use default calculations without external
   * override values.
   * 
   * @public
   */
  public clearOverrides(): void {
    this._overrideMaxSpeed = null;
    this._overrideAcceleration = null;
  }
}
