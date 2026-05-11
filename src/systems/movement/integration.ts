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

import { injuryMovementModifier } from "./InjuryMovementModifier";
import type { BodyPartHealth } from "../bodypart/types";
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
 * Uses the **worst** (minimum) leg health to match the main injury system's behavior,
 * ensuring asymmetric injuries (e.g., one leg at 0%, other at 100%) are properly represented.
 * 
 * @param bodyPartHealth - Current body part health
 * @returns Leg injury factor (0 = healthy, 1 = fully injured), clamped to 0-1 range
 * 
 * @example
 * ```typescript
 * const legInjuryFactor = calculateLegInjuryFactor(bodyPartHealth);
 * movementState.legInjuryFactor = legInjuryFactor;
 * ```
 * 
 * @korean 다리손상요소계산
 */
export function calculateLegInjuryFactor(
  bodyPartHealth: BodyPartHealth
): number {
  // Use worst (minimum) leg health to match main injury system behavior
  // This ensures asymmetric injuries are properly represented
  const worstLegHealth = Math.min(bodyPartHealth.legLeft, bodyPartHealth.legRight);
  
  // Clamp worst leg health to valid 0-100 range to avoid invalid injury factors
  const clampedLegHealth = Math.min(100, Math.max(0, worstLegHealth));

  // Normalize to 0-1 health ratio (1 = fully healthy, 0 = no health)
  const healthRatio = clampedLegHealth / 100;

  // Convert to 0-1 injury factor (0 = healthy, 1 = fully injured)
  // Use inverse of health ratio and clamp defensively to 0-1
  const injuryFactor = 1.0 - healthRatio;
  return Math.min(1, Math.max(0, injuryFactor));
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
 * Uses the shared singleton instance to avoid allocations in per-frame loops.
 * 
 * @param baseSpeed - Base movement speed (m/s)
 * @param bodyPartHealth - Current body part health
 * @param stance - Current trigram stance
 * @param painLevel - Current pain level (0-100)
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
 * @korean 종합이동속도계산
 */
export function calculateMovementSpeed(
  baseSpeed: number,
  bodyPartHealth: BodyPartHealth,
  stance: TrigramStance,
  painLevel: number
): number {
  const result = injuryMovementModifier.calculateMovementSpeed(
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
 * Uses the shared singleton instance to avoid allocations in per-frame loops.
 * 
 * @param bodyPartHealth - Current body part health
 * @returns Speed multiplier (0.1-1.0)
 * 
 * @korean 손상속도배수계산
 */
export function calculateInjuryMultiplier(
  bodyPartHealth: BodyPartHealth
): number {
  // Calculate without stance or pain modifiers
  const result = injuryMovementModifier.calculateMovementSpeed(
    1.0, // Base speed of 1.0 to get pure multiplier
    bodyPartHealth,
    TrigramStance.GEON, // Neutral stance (1.0x)
    0 // No pain
  );
  
  // The result will be the pure injury multiplier
  return result.speedMultiplier;
}
