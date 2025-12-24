/**
 * Combat Readiness Calculation System
 * 
 * Calculates overall combat readiness from multiple factors:
 * - Body part health (40% weight)
 * - Pain level (20% weight)
 * - Consciousness (20% weight)
 * - Balance state (20% weight)
 * 
 * @module utils/combatReadiness
 */

import type { PlayerState } from "../systems/player";
import type { BodyPartHealth } from "../systems/bodypart/types";

/**
 * Combat readiness level thresholds and colors
 */
export const COMBAT_READINESS_THRESHOLDS = {
  FULL_CAPABILITY: { min: 80, max: 100, color: 0x00ff00, label: { korean: "전투 준비", english: "Combat Ready" } },
  LIGHT_IMPAIRMENT: { min: 60, max: 79, color: 0xffff00, label: { korean: "경미 손상", english: "Light Damage" } },
  MODERATE_IMPAIRMENT: { min: 40, max: 59, color: 0xff8800, label: { korean: "중간 손상", english: "Moderate Damage" } },
  HEAVY_IMPAIRMENT: { min: 20, max: 39, color: 0xff3333, label: { korean: "중증 손상", english: "Heavy Damage" } },
  CRITICAL: { min: 0, max: 19, color: 0x990000, label: { korean: "위급 상태", english: "Critical" } },
} as const;

/**
 * Weight factors for combat readiness calculation
 */
const READINESS_WEIGHTS = {
  BODY_HEALTH: 0.4,  // 40% - Primary survival metric
  PAIN: 0.2,         // 20% - Affects performance
  CONSCIOUSNESS: 0.2, // 20% - Awareness and response
  BALANCE: 0.2,      // 20% - Stability and mobility
} as const;

/**
 * Calculate average body part health percentage
 * 
 * @param bodyHealth - Body part health state
 * @returns Average health percentage (0-100)
 * @throws {Error} If bodyHealth is null or undefined
 */
export function calculateBodyHealthPercentage(bodyHealth: BodyPartHealth): number {
  if (!bodyHealth) {
    throw new Error("bodyHealth cannot be null or undefined");
  }

  const parts = [
    bodyHealth.head,
    bodyHealth.torsoUpper,
    bodyHealth.torsoLower,
    bodyHealth.armLeft,
    bodyHealth.armRight,
    bodyHealth.legLeft,
    bodyHealth.legRight,
  ];
  
  const total = parts.reduce((sum, hp) => sum + hp, 0);
  const average = total / parts.length;
  
  return Math.max(0, Math.min(100, average));
}

/**
 * Calculate combat readiness from player state
 * 
 * Combines multiple factors with weighted importance:
 * - Body part health (40%): Average health of all body parts
 * - Pain (20%): Inverted pain level (0 pain = 100% contribution)
 * - Consciousness (20%): Direct consciousness level
 * - Balance (20%): Direct balance level
 * 
 * @param player - Current player state
 * @returns Combat readiness percentage (0-100)
 * @throws {Error} If player is null or undefined
 * 
 * @example
 * ```typescript
 * const readiness = calculateCombatReadiness(playerState);
 * console.log(`Combat Readiness: ${readiness}%`);
 * // Output: "Combat Readiness: 85%"
 * ```
 */
export function calculateCombatReadiness(player: PlayerState): number {
  if (!player) {
    throw new Error("player cannot be null or undefined");
  }

  // 1. Body health contribution (40%)
  // Use bodyPartHealth if available, otherwise use aggregate health
  let bodyHealthPercent: number;
  if (player.bodyPartHealth) {
    bodyHealthPercent = calculateBodyHealthPercentage(player.bodyPartHealth);
  } else {
    // Fall back to aggregate health percentage
    const maxHealth = player.maxHealth || 100; // Prevent division by zero
    bodyHealthPercent = maxHealth > 0 ? (player.health / maxHealth) * 100 : 0;
  }
  const bodyHealthScore = bodyHealthPercent * READINESS_WEIGHTS.BODY_HEALTH;
  
  // 2. Pain contribution (20%) - inverted (less pain = better readiness)
  const painPercent = Math.max(0, Math.min(100, player.pain));
  const painScore = (100 - painPercent) * READINESS_WEIGHTS.PAIN;
  
  // 3. Consciousness contribution (20%)
  const consciousnessPercent = Math.max(0, Math.min(100, player.consciousness));
  const consciousnessScore = consciousnessPercent * READINESS_WEIGHTS.CONSCIOUSNESS;
  
  // 4. Balance contribution (20%)
  const balancePercent = Math.max(0, Math.min(100, player.balance));
  const balanceScore = balancePercent * READINESS_WEIGHTS.BALANCE;
  
  // Combine all factors
  const totalReadiness = bodyHealthScore + painScore + consciousnessScore + balanceScore;
  
  return Math.max(0, Math.min(100, Math.round(totalReadiness)));
}

/**
 * Get color for combat readiness level
 * 
 * @param readiness - Combat readiness percentage (0-100)
 * @returns Hex color code
 * @throws {Error} If readiness is NaN
 */
export function getCombatReadinessColor(readiness: number): number {
  if (Number.isNaN(readiness)) {
    throw new Error("readiness cannot be NaN");
  }

  if (readiness >= COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.min) {
    return COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.color;
  }
  if (readiness >= COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.min) {
    return COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.color;
  }
  if (readiness >= COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.min) {
    return COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.color;
  }
  if (readiness >= COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.min) {
    return COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.color;
  }
  return COMBAT_READINESS_THRESHOLDS.CRITICAL.color;
}

/**
 * Get label for combat readiness level
 * 
 * @param readiness - Combat readiness percentage (0-100)
 * @returns Korean and English labels
 * @throws {Error} If readiness is NaN
 */
export function getCombatReadinessLabel(readiness: number): { korean: string; english: string } {
  if (Number.isNaN(readiness)) {
    throw new Error("readiness cannot be NaN");
  }

  if (readiness >= COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.min) {
    return COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.label;
  }
  if (readiness >= COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.min) {
    return COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.label;
  }
  if (readiness >= COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.min) {
    return COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.label;
  }
  if (readiness >= COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.min) {
    return COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.label;
  }
  return COMBAT_READINESS_THRESHOLDS.CRITICAL.label;
}

/**
 * Get number of filled bars for combat readiness
 * 
 * Uses ceiling behavior: any non-zero readiness shows at least 1 bar.
 * This provides visual feedback even for minimal combat capability.
 * 
 * @param readiness - Combat readiness percentage (0-100)
 * @param totalBars - Total number of bars (default: 10)
 * @returns Number of filled bars (0-totalBars)
 * @throws {Error} If readiness is NaN or totalBars is not positive
 * 
 * @example
 * ```typescript
 * getCombatReadinessBars(0, 10);   // Returns 0 bars
 * getCombatReadinessBars(5, 10);   // Returns 1 bar (ceil behavior)
 * getCombatReadinessBars(50, 10);  // Returns 5 bars
 * getCombatReadinessBars(100, 10); // Returns 10 bars
 * ```
 */
export function getCombatReadinessBars(readiness: number, totalBars: number = 10): number {
  if (Number.isNaN(readiness)) {
    throw new Error("readiness cannot be NaN");
  }
  if (totalBars <= 0 || !Number.isInteger(totalBars)) {
    throw new Error("totalBars must be a positive integer");
  }

  const percentage = Math.max(0, Math.min(100, readiness));
  
  // Return 0 bars only for exactly 0% readiness
  if (percentage === 0) return 0;
  
  // Use ceiling for any non-zero value to provide visual feedback
  return Math.ceil((percentage / 100) * totalBars);
}
