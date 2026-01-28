/**
 * Grappling System for Korean Martial Arts Combat
 *
 * **Korean**: 잡기 시스템 (Grapple System)
 *
 * Implements realistic grappling and takedown mechanics based on:
 * - **Hapkido (합기도)**: Joint locks and control techniques
 * - **Ssireum (씨름)**: Traditional Korean wrestling
 * - **GON Stance (곤괘)**: Earth stance grounding and control
 *
 * ## Core Mechanics
 *
 * 1. **Grab Initiation**: Establish grip on opponent's limb/body
 * 2. **Control Duration**: Maintain control with stamina cost
 * 3. **Grip Strength**: Affects escape difficulty and follow-up options
 * 4. **Escape Mechanics**: Based on strength, technique, and stamina
 * 5. **Follow-up Techniques**: Throws, takedowns, joint locks from control
 *
 * @module systems/combat/GrappleSystem
 * @category Combat System
 * @korean 잡기시스템
 */

import type { PlayerState } from "@/systems/player";
import {
  CombatState,
  GrappleControl,
  GrappleState,
  GrappleTarget,
  TrigramStance,
} from "@/types";

/**
 * Configuration for grappling mechanics.
 *
 * **Korean**: 잡기 설정 (Grapple Configuration)
 */
export interface GrappleConfig {
  /** Base stamina cost per second to maintain control */
  readonly baseStaminaCostPerSecond: number;
  /** Minimum grip strength to maintain control */
  readonly minGripStrength: number;
  /** Maximum grip strength value */
  readonly maxGripStrength: number;
  /** Base escape difficulty multiplier */
  readonly baseEscapeDifficulty: number;
  /** Stamina cost to attempt escape */
  readonly escapeStaminaCost: number;
  /** Minimum duration before escape is possible (ms) */
  readonly minControlDuration: number;
}

/**
 * Default grappling configuration values.
 */
export const DEFAULT_GRAPPLE_CONFIG: GrappleConfig = {
  baseStaminaCostPerSecond: 5,
  minGripStrength: 20,
  maxGripStrength: 100,
  baseEscapeDifficulty: 1.5,
  escapeStaminaCost: 15,
  minControlDuration: 500, // 0.5 seconds
};

/**
 * Grapple attempt result.
 *
 * **Korean**: 잡기 시도 결과 (Grapple Attempt Result)
 */
export interface GrappleAttemptResult {
  /** Whether the grapple was successful */
  readonly success: boolean;
  /** New grapple control state if successful */
  readonly grappleControl?: GrappleControl;
  /** Reason for failure if unsuccessful */
  readonly reason?: string;
  /** Stamina cost for the attempt */
  readonly staminaCost: number;
}

/**
 * Escape attempt result.
 *
 * **Korean**: 탈출 시도 결과 (Escape Attempt Result)
 */
export interface EscapeAttemptResult {
  /** Whether the escape was successful */
  readonly success: boolean;
  /** Updated grapple control state */
  readonly grappleControl: GrappleControl | null;
  /** Reason for failure if unsuccessful */
  readonly reason?: string;
  /** Stamina cost for the attempt */
  readonly staminaCost: number;
}

/**
 * Grappling System for control and hold mechanics.
 *
 * **Korean**: 잡기 시스템 (Grapple System)
 *
 * Manages grappling state between combatants, including grip strength,
 * control duration, escape mechanics, and follow-up techniques.
 */
export class GrappleSystem {
  private readonly config: GrappleConfig;

  constructor(config: Partial<GrappleConfig> = {}) {
    this.config = { ...DEFAULT_GRAPPLE_CONFIG, ...config };
  }

  /**
   * Attempt to initiate a grapple on target.
   *
   * **Korean**: 잡기 시도 (Attempt Grapple)
   *
   * @param attacker - Player attempting the grapple
   * @param defender - Target player
   * @param target - Body part to grapple
   * @param currentTime - Current game time in milliseconds
   * @returns Result of the grapple attempt
   */
  attemptGrapple(
    attacker: PlayerState,
    defender: PlayerState,
    target: GrappleTarget,
    currentTime: number
  ): GrappleAttemptResult {
    // Check if attacker can grapple
    if (attacker.combatState === CombatState.STUNNED) {
      return {
        success: false,
        reason: "Attacker is stunned",
        staminaCost: 0,
      };
    }

    // Check if attacker is already grappling someone else
    if (attacker.combatState === CombatState.GRAPPLING) {
      return {
        success: false,
        reason: "Attacker is already grappling another opponent",
        staminaCost: 0,
      };
    }

    if (attacker.stamina < this.config.escapeStaminaCost) {
      return {
        success: false,
        reason: "Insufficient stamina",
        staminaCost: 0,
      };
    }

    // Check if defender is already being grappled
    if (defender.combatState === CombatState.GRAPPLED) {
      return {
        success: false,
        reason: "Target is already being grappled",
        staminaCost: 0,
      };
    }

    // Calculate grip strength based on attacker attributes and stance
    const gripStrength = this.calculateGripStrength(attacker, target);

    // Calculate success chance based on attributes
    const successChance = this.calculateGrappleSuccessChance(
      attacker,
      defender,
      target
    );

    const roll = Math.random();
    const success = roll < successChance;

    if (success) {
      // Create grapple control - start with GRABBING state during initiation
      const grappleControl: GrappleControl = {
        state: GrappleState.GRABBING,
        target,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength,
        duration: 0,
        startTime: currentTime,
        canEscape: false, // Initially cannot escape
        staminaCostPerSecond: this.calculateStaminaCost(target, gripStrength),
      };

      return {
        success: true,
        grappleControl,
        staminaCost: this.config.escapeStaminaCost,
      };
    }

    return {
      success: false,
      reason: `Grapple attempt failed (${Math.round(successChance * 100)}% chance)`,
      staminaCost: this.config.escapeStaminaCost * 0.5, // Half cost on failure
    };
  }

  /**
   * Update grapple control state over time.
   *
   * **Korean**: 잡기 업데이트 (Update Grapple)
   *
   * @param grappleControl - Current grapple control state
   * @param controller - Player maintaining control
   * @param target - Player being controlled
   * @param deltaTime - Time elapsed since last update (seconds)
   * @param currentTime - Current game time in milliseconds
   * @returns Updated grapple control or null if broken
   */
  updateGrapple(
    grappleControl: GrappleControl,
    controller: PlayerState,
    _target: PlayerState,
    deltaTime: number,
    currentTime: number
  ): GrappleControl | null {
    // Check if controller can maintain control
    if (
      controller.stamina < grappleControl.staminaCostPerSecond * deltaTime ||
      controller.combatState === CombatState.STUNNED
    ) {
      // Control broken due to stamina or state
      return null;
    }

    // Update duration
    const newDuration = currentTime - grappleControl.startTime;

    // Transition from GRABBING to CONTROLLING after initial establishment
    let newState = grappleControl.state;
    if (grappleControl.state === GrappleState.GRABBING && newDuration > 0) {
      newState = GrappleState.CONTROLLING;
    }

    // Decay grip strength slightly over time
    const gripDecayRate = 2; // points per second
    const rawGripStrength = grappleControl.gripStrength - gripDecayRate * deltaTime;

    // Check if grip strength has dropped too low
    if (rawGripStrength < this.config.minGripStrength) {
      return null;
    }

    const newGripStrength = rawGripStrength;

    // Allow escape attempts after minimum duration
    const canEscape = newDuration >= this.config.minControlDuration;

    return {
      ...grappleControl,
      state: newState,
      gripStrength: newGripStrength,
      duration: newDuration,
      canEscape,
    };
  }

  /**
   * Attempt to escape from a grapple.
   *
   * **Korean**: 탈출 시도 (Attempt Escape)
   *
   * @param grappleControl - Current grapple control state
   * @param controller - Player maintaining control
   * @param target - Player attempting to escape
   * @returns Result of the escape attempt
   */
  attemptEscape(
    grappleControl: GrappleControl,
    controller: PlayerState,
    target: PlayerState
  ): EscapeAttemptResult {
    // Check if escape is possible
    if (!grappleControl.canEscape) {
      return {
        success: false,
        grappleControl,
        reason: "Cannot escape yet",
        staminaCost: 0,
      };
    }

    // Check stamina
    if (target.stamina < this.config.escapeStaminaCost) {
      return {
        success: false,
        grappleControl,
        reason: "Insufficient stamina",
        staminaCost: 0,
      };
    }

    // Calculate escape chance
    const escapeChance = this.calculateEscapeChance(
      grappleControl,
      controller,
      target
    );

    const roll = Math.random();
    const success = roll < escapeChance;

    if (success) {
      return {
        success: true,
        grappleControl: null, // Escape successful, control broken
        staminaCost: this.config.escapeStaminaCost,
      };
    }

    // Escape failed, weaken grip slightly
    const weakenedGripStrength = Math.max(
      this.config.minGripStrength,
      grappleControl.gripStrength - 10
    );

    return {
      success: false,
      grappleControl: {
        ...grappleControl,
        gripStrength: weakenedGripStrength,
      },
      reason: `Escape failed (${Math.round(escapeChance * 100)}% chance)`,
      staminaCost: this.config.escapeStaminaCost,
    };
  }

  /**
   * Calculate grip strength based on attacker attributes and target.
   *
   * **Korean**: 악력 계산 (Calculate Grip Strength)
   *
   * @private
   */
  private calculateGripStrength(
    attacker: PlayerState,
    target: GrappleTarget
  ): number {
    // Base strength from attack power
    let strength = attacker.attackPower * 3;

    // Stance modifiers
    if (attacker.currentStance === TrigramStance.GON) {
      strength *= 1.3; // GON stance excels at grappling
    } else if (attacker.currentStance === TrigramStance.GAN) {
      strength *= 1.15; // GAN stance is also good for control
    }

    // Target modifiers
    switch (target) {
      case GrappleTarget.HAND:
        strength *= 1.1; // Easier to control hand
        break;
      case GrappleTarget.ARM:
        strength *= 1.0; // Standard difficulty
        break;
      case GrappleTarget.LEG:
        strength *= 0.9; // Harder to control leg
        break;
      case GrappleTarget.TORSO:
        strength *= 0.85; // Harder to control torso
        break;
      case GrappleTarget.NECK:
        strength *= 1.2; // High control but risky
        break;
      case GrappleTarget.BOTH_ARMS:
        strength *= 0.7; // Very hard to control both arms
        break;
    }

    return Math.min(this.config.maxGripStrength, strength);
  }

  /**
   * Calculate grapple success chance.
   *
   * **Korean**: 잡기 성공률 계산 (Calculate Grapple Success Chance)
   *
   * @private
   */
  private calculateGrappleSuccessChance(
    attacker: PlayerState,
    defender: PlayerState,
    target: GrappleTarget
  ): number {
    // Base chance from technique vs defense
    const attributeDiff = attacker.technique - defender.defense;
    let baseChance = 0.5 + attributeDiff * 0.02; // ±2% per point difference

    // Speed advantage
    if (attacker.speed > defender.speed) {
      baseChance += (attacker.speed - defender.speed) * 0.01;
    }

    // Stance modifiers
    if (attacker.currentStance === TrigramStance.GON) {
      baseChance += 0.15; // GON stance excels at grappling
    }

    if (defender.combatState === CombatState.ATTACKING) {
      baseChance += 0.2; // Easier to grapple during attack
    } else if (defender.combatState === CombatState.DEFENDING) {
      baseChance -= 0.15; // Harder to grapple defensive opponent
    }

    // Target difficulty
    switch (target) {
      case GrappleTarget.HAND:
        baseChance += 0.1; // Easier to grab hand
        break;
      case GrappleTarget.BOTH_ARMS:
        baseChance -= 0.2; // Much harder to grab both arms
        break;
      case GrappleTarget.NECK:
        baseChance -= 0.1; // Risky target
        break;
    }

    // Clamp between 0.05 and 0.95
    return Math.max(0.05, Math.min(0.95, baseChance));
  }

  /**
   * Calculate escape chance from grapple.
   *
   * **Korean**: 탈출 성공률 계산 (Calculate Escape Chance)
   *
   * @private
   */
  private calculateEscapeChance(
    grappleControl: GrappleControl,
    controller: PlayerState,
    target: PlayerState
  ): number {
    // Base chance from strength vs grip
    const gripFactor = grappleControl.gripStrength / this.config.maxGripStrength;
    let baseChance = 0.5 - gripFactor * 0.3; // Stronger grip = harder escape

    // Attribute comparison
    const strengthDiff = target.attackPower - controller.attackPower;
    baseChance += strengthDiff * 0.02;

    // Speed advantage helps escape
    if (target.speed > controller.speed) {
      baseChance += (target.speed - controller.speed) * 0.015;
    }

    // Technique helps find weaknesses in grip
    baseChance += target.technique * 0.005;

    // Stance modifiers - certain stances are better at escaping grapples
    // **Korean**: 곤(坤) 자세는 탈출에 유리 (+30%), 간(艮) 자세는 방어적인 탈출 (+15%)
    if (target.currentStance === TrigramStance.GON) {
      baseChance += 0.3; // GON stance excels at grounding and escape
    } else if (target.currentStance === TrigramStance.GAN) {
      baseChance += 0.15; // GAN stance has defensive escape advantage
    }

    // Time factor - longer control makes escape harder
    const durationSeconds = grappleControl.duration / 1000;
    const timePenalty = Math.min(0.2, durationSeconds * 0.02);
    baseChance -= timePenalty;

    // Clamp between 0.05 and 0.85
    return Math.max(0.05, Math.min(0.85, baseChance));
  }

  /**
   * Calculate stamina cost to maintain control.
   *
   * **Korean**: 체력 소모 계산 (Calculate Stamina Cost)
   *
   * @private
   */
  private calculateStaminaCost(
    target: GrappleTarget,
    gripStrength: number
  ): number {
    let cost = this.config.baseStaminaCostPerSecond;

    // Target affects stamina cost
    switch (target) {
      case GrappleTarget.HAND:
        cost *= 0.8; // Easier to maintain
        break;
      case GrappleTarget.ARM:
        cost *= 1.0; // Standard
        break;
      case GrappleTarget.LEG:
        cost *= 1.2; // Harder to maintain
        break;
      case GrappleTarget.TORSO:
        cost *= 1.3; // Much harder to maintain
        break;
      case GrappleTarget.NECK:
        cost *= 1.5; // Very demanding
        break;
      case GrappleTarget.BOTH_ARMS:
        cost *= 1.8; // Extremely demanding
        break;
    }

    // Higher grip strength costs more stamina
    const gripFactor = gripStrength / this.config.maxGripStrength;
    cost *= 0.7 + gripFactor * 0.6; // 70-130% based on grip

    return cost;
  }

  /**
   * Check if a grapple can be transitioned to a throw.
   *
   * **Korean**: 던지기 전환 확인 (Check Throw Transition)
   *
   * @param grappleControl - Current grapple control state
   * @param controller - Player attempting throw
   * @returns Whether throw transition is possible
   */
  canTransitionToThrow(
    grappleControl: GrappleControl,
    controller: PlayerState
  ): boolean {
    // Need sufficient control duration
    if (grappleControl.duration < 1000) {
      return false; // Need at least 1 second of control
    }

    // Need sufficient grip strength
    if (grappleControl.gripStrength < 60) {
      return false;
    }

    // Need sufficient stamina for throw
    if (controller.stamina < 20) {
      return false;
    }

    // Certain targets are better for throws
    const goodThrowTargets = [
      GrappleTarget.ARM,
      GrappleTarget.TORSO,
      GrappleTarget.BOTH_ARMS,
    ];

    return goodThrowTargets.includes(grappleControl.target);
  }

  /**
   * Check if a grapple can be transitioned to a joint lock.
   *
   * **Korean**: 관절기 전환 확인 (Check Joint Lock Transition)
   *
   * @param grappleControl - Current grapple control state
   * @param controller - Player attempting lock
   * @returns Whether joint lock transition is possible
   */
  canTransitionToJointLock(
    grappleControl: GrappleControl,
    controller: PlayerState
  ): boolean {
    // Need sufficient control duration
    if (grappleControl.duration < 800) {
      return false;
    }

    // Need high technique for joint locks
    if (controller.technique < 10) {
      return false;
    }

    // Joint locks work on limbs
    const lockTargets = [
      GrappleTarget.HAND,
      GrappleTarget.ARM,
      GrappleTarget.LEG,
    ];

    return lockTargets.includes(grappleControl.target);
  }
}

export default GrappleSystem;
