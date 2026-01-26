/**
 * Integration module for InjuryMovementModifier with MovementPhysics
 * 
 * **Korean**: 손상 이동 통합 (Injury Movement Integration)
 * 
 * Provides helper functions to integrate the InjuryMovementModifier system
 * with the existing MovementPhysics system.
 * 
 * @module systems/movement/integration
 * @category Movement System
 * @korean 손상이동통합
 */

import { InjuryMovementModifier } from "./InjuryMovementModifier";
import { BodyPartHealth } from "../bodypart/types";
import { TrigramStance } from "@/types/common";

/**
 * Calculate leg injury factor for MovementPhysics from body part health.
 * 
 * **Korean**: 다리 손상 요소 계산
 * 
 * Converts detailed body part health into a simple 0-1 injury factor
 * that MovementPhysics.MovementState expects. This allows gradual
 * migration from the old simple system to the new detailed system.
 * 
 * @param bodyPartHealth - Current body part health
 * @param modifier - InjuryMovementModifier instance (optional)
 * @returns Leg injury factor (0 = healthy, 1 = fully injured)
 * 
 * @example
 * ```typescript
 * const legInjuryFactor = calculateLegInjuryFactor(bodyPartHealth);
 * movementState.legInjuryFactor = legInjuryFactor;
 * ```
 * 
 * @public
 * @korean 다리손상요소계산
 */
export function calculateLegInjuryFactor(
  bodyPartHealth: BodyPartHealth,
  _modifier?: InjuryMovementModifier
): number {
  // Calculate average leg health percentage
  const avgLegHealth = (bodyPartHealth.legLeft + bodyPartHealth.legRight) / 2;
  
  // Convert to 0-1 injury factor (0 = healthy, 1 = fully injured)
  // Use inverse of health percentage
  return 1.0 - (avgLegHealth / 100);
}

/**
 * Calculate comprehensive movement speed with all injury modifiers.
 * 
 * **Korean**: 종합 이동 속도 계산
 * 
 * This is the recommended function for full integration with the new
 * injury system. It applies all modifiers including leg injuries,
 * torso damage, stance bonuses, and pain penalties.
 * 
 * @param baseSpeed - Base movement speed (m/s)
 * @param bodyPartHealth - Current body part health
 * @param stance - Current trigram stance
 * @param painLevel - Current pain level (0-100)
 * @param modifier - InjuryMovementModifier instance (optional)
 * @returns Final calculated speed in m/s
 * 
 * @example
 * ```typescript
 * const finalSpeed = calculateMovementSpeed(
 *   5.0,
 *   playerBodyHealth,
 *   TrigramStance.GEON,
 *   65
 * );
 * 
 * // Use this speed to override MovementPhysics
 * movementPhysics.setMaxSpeed(finalSpeed);
 * ```
 * 
 * @public
 * @korean 종합이동속도계산
 */
export function calculateMovementSpeed(
  baseSpeed: number,
  bodyPartHealth: BodyPartHealth,
  stance: TrigramStance,
  painLevel: number,
  modifier?: InjuryMovementModifier
): number {
  const injuryModifier = modifier ?? new InjuryMovementModifier();
  
  const result = injuryModifier.calculateMovementSpeed(
    baseSpeed,
    bodyPartHealth,
    stance,
    painLevel
  );
  
  return result.finalSpeed;
}

/**
 * Calculate speed multiplier from injuries (without stance or pain).
 * 
 * **Korean**: 손상 속도 배수 계산
 * 
 * Useful when you want to apply injury penalties separately from
 * stance and pain modifiers.
 * 
 * @param bodyPartHealth - Current body part health
 * @param modifier - InjuryMovementModifier instance (optional)
 * @returns Speed multiplier (0.1-1.0)
 * 
 * @public
 * @korean 손상속도배수계산
 */
export function calculateInjuryMultiplier(
  bodyPartHealth: BodyPartHealth,
  modifier?: InjuryMovementModifier
): number {
  const injuryModifier = modifier ?? new InjuryMovementModifier();
  
  // Calculate without stance or pain modifiers
  const result = injuryModifier.calculateMovementSpeed(
    1.0, // Base speed of 1.0 to get pure multiplier
    bodyPartHealth,
    TrigramStance.GEON, // Neutral stance (1.0x)
    0 // No pain
  );
  
  // The result will be the pure injury multiplier
  return result.speedMultiplier;
}
