/**
 * Attack Movement Physics System for realistic forward momentum during attacks.
 *
 * **Korean**: 공격 이동 물리 시스템 (Attack Movement Physics System)
 *
 * Implements realistic forward movement physics when fighters execute attacks.
 * Kicks naturally extend the body forward, punches lunge with body weight,
 * and spinning techniques carry rotational momentum.
 *
 * ## Attack Movement Mechanics
 *
 * Forward movement distance is determined by:
 * - Animation type (kicks > punches > elbows/knees)
 * - Stance modifiers (8 trigram stances affect aggression)
 * - Animation phase timing (extension → peak → recovery)
 *
 * ## Movement Integration
 *
 * - Extension phase (frames 3-6): Forward lunge with ease-out
 * - Peak phase (frame 6): Maximum extension reached
 * - Recovery phase (frames 7-10): Return to original stance
 * - Arena bounds: Automatically clamp movement to valid zone
 *
 * ## Performance
 *
 * Optimized for 60fps with efficient vector calculations and
 * smooth easing curves for realistic attack momentum feel.
 *
 * @module systems/physics/AttackMovementPhysics
 * @category Physics System
 * @korean 공격이동물리
 */

import * as THREE from "three";
import { TrigramStance } from "@/types/common";
import { AnimationType } from "@/systems/animation";

/**
 * Configuration for attack movement calculation.
 *
 * **Korean**: 공격 이동 설정 (Attack Movement Configuration)
 *
 * @public
 * @korean 공격이동설정
 */
export interface AttackMovementConfig {
  /** Animation type being executed */
  readonly animationType: AnimationType;
  /** Current trigram stance */
  readonly currentStance: TrigramStance;
  /** Normalized attack direction vector (attacker → target) */
  readonly direction: THREE.Vector3;
  /** Total attack animation duration in seconds */
  readonly animationDuration: number;
}

/**
 * Result of attack movement calculation.
 *
 * **Korean**: 공격 이동 결과 (Attack Movement Result)
 *
 * Contains displacement vector and timing for attack lunge.
 *
 * @public
 * @korean 공격이동결과
 */
export interface AttackMovementResult {
  /** Total forward displacement vector in world space */
  readonly displacement: THREE.Vector3;
  /** Duration of forward lunge phase in seconds */
  readonly lungeDuration: number;
  /** Duration of recovery return phase in seconds */
  readonly recoveryDuration: number;
  /** Total movement cycle duration in seconds */
  readonly totalDuration: number;
}

/**
 * Attack Movement Physics Engine.
 *
 * **Korean**: 공격 이동 물리 엔진
 *
 * Calculates realistic forward movement during attack animations
 * based on technique type, stance modifiers, and animation timing.
 * Provides smooth lunge and recovery phases for authentic martial arts feel.
 *
 * @example
 * ```typescript
 * const physics = new AttackMovementPhysics();
 *
 * // Calculate movement for roundhouse kick
 * const config: AttackMovementConfig = {
 *   animationType: AnimationType.ROUNDHOUSE_KICK,
 *   currentStance: TrigramStance.LI, // Fire stance (aggressive)
 *   direction: new THREE.Vector3(1, 0, 0).normalize(),
 *   animationDuration: 0.48, // 480ms kick animation
 * };
 *
 * const result = physics.calculateAttackMovement(config);
 * // Result: 1.0m base * 1.3 (Fire bonus) = ~1.3m forward lunge
 * // lungeDuration: 0.24s (50% of animation)
 * // recoveryDuration: 0.24s (50% of animation)
 * ```
 *
 * @public
 * @korean 공격이동물리
 */
export class AttackMovementPhysics {
  /**
   * Calculates attack movement displacement and timing.
   *
   * **Korean**: 공격 이동 계산 (Calculate Attack Movement)
   *
   * Determines forward lunge distance and recovery timing based on:
   * 1. Base movement from animation type
   * 2. Stance movement modifier (8 trigram effects)
   * 3. Animation phase durations (lunge vs recovery)
   *
   * @param config - Attack movement configuration
   * @returns Attack movement result with displacement and timing
   *
   * @example
   * ```typescript
   * // Front kick with Heaven stance
   * const kick = physics.calculateAttackMovement({
   *   animationType: AnimationType.FRONT_KICK,
   *   currentStance: TrigramStance.GEON,
   *   direction: attackVector,
   *   animationDuration: 0.4,
   * });
   * // Result: ~0.88m forward (0.8m * 1.1 Geon modifier)
   *
   * // Jab with Mountain stance
   * const jab = physics.calculateAttackMovement({
   *   animationType: AnimationType.JAB,
   *   currentStance: TrigramStance.GAN,
   *   direction: attackVector,
   *   animationDuration: 0.25,
   * });
   * // Result: ~0.24m forward (0.3m * 0.8 Gan modifier)
   * ```
   *
   * @public
   * @korean 공격이동계산
   */
  calculateAttackMovement(
    config: AttackMovementConfig
  ): AttackMovementResult {
    // 1. Get base movement distance for animation type
    const baseDistance = this.getBaseMovementDistance(config.animationType);

    // 2. Apply stance movement modifier
    const stanceModifier = this.getStanceMovementModifier(config.currentStance);
    const finalDistance = baseDistance * stanceModifier;

    // 3. Calculate displacement vector
    const displacement = config.direction.clone().multiplyScalar(finalDistance);

    // 4. Calculate phase durations (lunge + recovery)
    const lungeDuration = config.animationDuration * 0.5; // First 50% = forward
    const recoveryDuration = config.animationDuration * 0.5; // Last 50% = return

    return {
      displacement,
      lungeDuration,
      recoveryDuration,
      totalDuration: config.animationDuration,
    };
  }

  /**
   * Gets base forward movement distance for animation type.
   *
   * **Korean**: 기본 이동 거리 (Base Movement Distance)
   *
   * Movement distances by technique category:
   * - Kicks: 0.8-1.2m (leg extension, longest reach)
   * - Punches: 0.3-0.5m (arm extension, body lunge)
   * - Elbows/Knees: 0.2-0.3m (close range techniques)
   * - Spinning: 0.5-0.8m (rotation carries momentum)
   *
   * @param animationType - Type of attack animation
   * @returns Base movement distance in meters
   *
   * @private
   * @korean 기본이동거리
   */
  private getBaseMovementDistance(animationType: AnimationType): number {
    // Kicks - highest forward movement (leg extension)
    if (
      animationType === AnimationType.ROUNDHOUSE_KICK ||
      animationType === AnimationType.SIDE_KICK ||
      animationType === AnimationType.BACK_KICK
    ) {
      return 1.0; // 1.0m forward lunge
    }

    if (
      animationType === AnimationType.FRONT_KICK ||
      animationType === AnimationType.PUSH_KICK
    ) {
      return 0.8; // 0.8m forward lunge
    }

    if (
      animationType === AnimationType.AXE_KICK ||
      animationType === AnimationType.CRESCENT_KICK ||
      animationType === AnimationType.LOW_KICK
    ) {
      return 0.9; // 0.9m forward lunge
    }

    // Spinning kicks - momentum carries body forward
    if (
      animationType === AnimationType.SPINNING_HOOK ||
      animationType === AnimationType.SPINNING_HEEL_KICK ||
      animationType === AnimationType.TORNADO_KICK
    ) {
      return 0.8; // 0.8m with rotation
    }

    // Jumping/flying kicks - aerial momentum
    if (
      animationType === AnimationType.FLYING_KICK ||
      animationType === AnimationType.JUMPING_KICK
    ) {
      return 1.2; // 1.2m maximum extension
    }

    // Punches - moderate forward movement (arm + body lunge)
    if (
      animationType === AnimationType.CROSS ||
      animationType === AnimationType.OVERHAND ||
      animationType === AnimationType.HOOK
    ) {
      return 0.5; // 0.5m forward lunge
    }

    if (
      animationType === AnimationType.JAB ||
      animationType === AnimationType.BACKFIST
    ) {
      return 0.3; // 0.3m forward lunge
    }

    if (
      animationType === AnimationType.UPPERCUT ||
      animationType === AnimationType.HAMMER_FIST ||
      animationType === AnimationType.PALM_STRIKE
    ) {
      return 0.4; // 0.4m forward lunge
    }

    // Elbow/Knee - minimal movement (close range)
    if (
      animationType === AnimationType.ELBOW_STRIKE ||
      animationType === AnimationType.KNEE_STRIKE
    ) {
      return 0.2; // 0.2m forward lunge
    }

    // Default - minimal movement for unknown types
    return 0.2;
  }

  /**
   * Gets stance movement modifier for attack lunge.
   *
   * **Korean**: 자세 이동 배율 (Stance Movement Modifier)
   *
   * Trigram stance movement modifiers:
   * - ☲ 리 (Li/Fire): +30% movement (aggressive, forward pressure)
   * - ☳ 진 (Jin/Thunder): +20% movement (explosive power)
   * - ☴ 손 (Son/Wind): +15% movement (continuous flow)
   * - ☰ 건 (Geon/Heaven): +10% movement (balanced force)
   * - ☱ 태 (Tae/Lake): 0% (neutral, adaptive)
   * - ☵ 감 (Gam/Water): 0% (neutral, flowing)
   * - ☷ 곤 (Gon/Earth): -10% movement (grounded, stable)
   * - ☶ 간 (Gan/Mountain): -20% movement (defensive, minimal advance)
   *
   * @param stance - Current trigram stance
   * @returns Movement multiplier (0.8 to 1.3)
   *
   * @private
   * @korean 자세이동배율
   */
  private getStanceMovementModifier(stance: TrigramStance): number {
    const modifiers: Record<TrigramStance, number> = {
      [TrigramStance.LI]: 1.3, // Fire: +30% aggressive forward movement
      [TrigramStance.JIN]: 1.2, // Thunder: +20% explosive movement
      [TrigramStance.SON]: 1.15, // Wind: +15% flowing movement
      [TrigramStance.GEON]: 1.1, // Heaven: +10% balanced movement
      [TrigramStance.TAE]: 1.0, // Lake: neutral movement
      [TrigramStance.GAM]: 1.0, // Water: neutral movement
      [TrigramStance.GON]: 0.9, // Earth: -10% grounded movement
      [TrigramStance.GAN]: 0.8, // Mountain: -20% defensive movement
    };
    return modifiers[stance];
  }

  /**
   * Applies attack movement force to attacker position over time.
   *
   * **Korean**: 공격 이동 적용 (Apply Attack Movement)
   *
   * Uses smooth ease-out cubic curve for realistic lunge feel:
   * - Fast initial forward movement (attack commitment)
   * - Gradual deceleration at peak extension
   * - Smooth return during recovery phase
   *
   * @param attackerPosition - Current attacker position
   * @param result - Attack movement result with displacement
   * @param elapsedTime - Time elapsed since attack started
   * @param isRecoveryPhase - Whether in recovery (return) phase
   * @returns New attacker position
   *
   * @example
   * ```typescript
   * // In animation update loop (60fps)
   * if (elapsedTime < result.lungeDuration) {
   *   // Lunge forward phase
   *   const progress = elapsedTime / result.lungeDuration;
   *   const newPosition = physics.applyAttackMovement(
   *     attackerPosition,
   *     result,
   *     elapsedTime,
   *     false
   *   );
   * } else if (elapsedTime < result.totalDuration) {
   *   // Recovery return phase
   *   const recoveryProgress =
   *     (elapsedTime - result.lungeDuration) / result.recoveryDuration;
   *   const newPosition = physics.applyAttackMovement(
   *     attackerPosition,
   *     result,
   *     elapsedTime,
   *     true
   *   );
   * }
   * ```
   *
   * @public
   * @korean 공격이동적용
   */
  applyAttackMovement(
    attackerPosition: THREE.Vector3,
    result: AttackMovementResult,
    elapsedTime: number,
    isRecoveryPhase: boolean
  ): THREE.Vector3 {
    let progress: number;

    if (!isRecoveryPhase) {
      // Lunge forward phase
      progress = Math.min(1.0, elapsedTime / result.lungeDuration);

      // Smooth forward lunge curve (ease-out cubic)
      // Fast initial commitment, gradual deceleration at peak
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      // Calculate position along forward path
      const currentDisplacement = result.displacement
        .clone()
        .multiplyScalar(easedProgress);

      return attackerPosition.clone().add(currentDisplacement);
    } else {
      // Recovery return phase
      const recoveryTime = elapsedTime - result.lungeDuration;
      progress = Math.min(1.0, recoveryTime / result.recoveryDuration);

      // Smooth return curve (ease-in cubic)
      // Gradual start, faster finish back to stance
      const easedProgress = Math.pow(progress, 3);

      // Calculate return position (from peak back to origin)
      const returnDisplacement = result.displacement
        .clone()
        .multiplyScalar(1.0 - easedProgress);

      return attackerPosition.clone().add(returnDisplacement);
    }
  }

  /**
   * Checks if attacker is currently in lunge phase.
   *
   * **Korean**: 돌진 상태 확인 (Check Lunge State)
   *
   * @param elapsedTime - Time elapsed since attack started
   * @param lungeDuration - Total lunge phase duration
   * @returns True if in forward lunge phase
   *
   * @public
   * @korean 돌진상태확인
   */
  isInLungePhase(elapsedTime: number, lungeDuration: number): boolean {
    return elapsedTime < lungeDuration;
  }

  /**
   * Checks if attacker is in recovery return phase.
   *
   * **Korean**: 회복 상태 확인 (Check Recovery State)
   *
   * @param elapsedTime - Time elapsed since attack started
   * @param result - Attack movement result with timing
   * @returns True if in recovery return phase
   *
   * @public
   * @korean 회복상태확인
   */
  isInRecoveryPhase(
    elapsedTime: number,
    result: AttackMovementResult
  ): boolean {
    return (
      elapsedTime >= result.lungeDuration &&
      elapsedTime < result.totalDuration
    );
  }

  /**
   * Gets bilingual Korean-English name for lunge phase.
   *
   * **Korean**: 돌진 단계 이름 (Lunge Phase Name)
   *
   * @returns Korean and English phase names
   *
   * @public
   * @korean 돌진단계이름
   */
  getLungePhaseName(): { korean: string; english: string } {
    return {
      korean: "돌진",
      english: "Lunge",
    };
  }

  /**
   * Gets bilingual Korean-English name for recovery phase.
   *
   * **Korean**: 복귀 단계 이름 (Recovery Phase Name)
   *
   * @returns Korean and English phase names
   *
   * @public
   * @korean 복귀단계이름
   */
  getRecoveryPhaseName(): { korean: string; english: string } {
    return {
      korean: "복귀",
      english: "Recovery",
    };
  }
}

export default AttackMovementPhysics;
