/**
 * Effect calculation system for vital point strikes.
 * 
 * **Korean**: 효과 계산 시스템 (Effect Calculation System)
 * 
 * This module provides comprehensive calculations for status effect duration,
 * intensity, and application based on vital point strikes, accuracy, severity,
 * and archetype-specific modifiers.
 * 
 * ## Key Features
 * 
 * - **Duration Calculation**: Based on severity, accuracy, and archetype
 * - **Intensity Scaling**: Scales with hit accuracy (0.5-1.5x)
 * - **Archetype Modifiers**: Resistance and vulnerability factors
 * - **Critical Hit Enhancement**: 2x duration for accuracy > 0.9
 * - **Effect Stacking**: Manages multiple concurrent effects
 * 
 * @module systems/EffectCalculator
 * @category Combat Effects
 * @korean 효과계산기
 */

import { PlayerArchetype, VitalPointSeverity } from "../types/common";
import { EffectIntensity } from "./effects";
import { StatusEffect } from "./types";
import { VitalPointEffect } from "./vitalpoint/types";

/**
 * Severity multipliers for effect duration calculation.
 * 
 * **Korean**: 심각도 배율 (Severity Multipliers)
 */
const SEVERITY_MULTIPLIERS: Record<VitalPointSeverity, number> = {
  [VitalPointSeverity.MINOR]: 0.5,
  [VitalPointSeverity.MODERATE]: 1.0,
  [VitalPointSeverity.MAJOR]: 1.5,
  [VitalPointSeverity.CRITICAL]: 2.0,
  [VitalPointSeverity.LETHAL]: 3.0,
};

/**
 * Critical hit accuracy threshold.
 * Strikes with accuracy >= 0.9 are considered critical.
 * 
 * **Korean**: 크리티컬 정확도 기준점
 */
const CRITICAL_HIT_THRESHOLD = 0.9;

/**
 * Critical hit duration multiplier.
 * 
 * **Korean**: 크리티컬 타격 지속시간 배율
 */
const CRITICAL_DURATION_MULTIPLIER = 2.0;

/**
 * Maximum number of concurrent status effects allowed per player.
 * 
 * **Korean**: 최대 동시 효과 개수
 */
export const MAX_CONCURRENT_EFFECTS = 5;

/**
 * Archetype resistance modifiers.
 * Positive values = resistance (effects last shorter)
 * Negative values = vulnerability (effects last longer)
 * 
 * **Korean**: 원형별 저항력 배율 (Archetype Resistance Modifiers)
 */
const ARCHETYPE_RESISTANCE: Record<PlayerArchetype, number> = {
  [PlayerArchetype.MUSA]: 0.2, // +20% resistance (traditional warrior discipline)
  [PlayerArchetype.AMSALJA]: -0.1, // -10% resistance (glass cannon)
  [PlayerArchetype.HACKER]: 0.0, // Neutral resistance
  [PlayerArchetype.JEONGBO_YOWON]: 0.1, // +10% resistance (mental fortitude)
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: 0.15, // +15% resistance (street-hardened)
};

/**
 * Archetype offensive effect modifiers.
 * Applied when archetype deals vital point strike.
 * 
 * **Korean**: 원형별 공격 효과 배율 (Archetype Offensive Modifiers)
 */
const ARCHETYPE_OFFENSIVE: Record<PlayerArchetype, number> = {
  [PlayerArchetype.MUSA]: 1.0, // Standard effects
  [PlayerArchetype.AMSALJA]: 1.3, // +30% effect potency (assassination mastery)
  [PlayerArchetype.HACKER]: 1.15, // +15% effect potency (precision targeting)
  [PlayerArchetype.JEONGBO_YOWON]: 1.25, // +25% effect potency (anatomical knowledge)
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: 1.2, // +20% effect potency (brutal efficiency)
};

/**
 * Default effect duration in milliseconds if not specified.
 * 
 * **Korean**: 기본 효과 지속시간 (Default Effect Duration)
 */
const DEFAULT_EFFECT_DURATION = 2000;

/**
 * Calculates the duration of a status effect based on multiple factors.
 * 
 * **Korean**: 효과 지속시간 계산 (Calculate Effect Duration)
 * 
 * Formula:
 * ```
 * duration = baseDuration * (1 + (accuracy - 0.5) * 0.5) * severityMultiplier * archetypeModifier
 * ```
 * 
 * For critical hits (accuracy >= 0.9):
 * ```
 * duration = duration * 2.0
 * ```
 * 
 * @param effect - Vital point effect with base duration
 * @param accuracy - Hit accuracy (0-1)
 * @param severity - Vital point severity level
 * @param attackerArchetype - Attacking player's archetype
 * @param defenderArchetype - Defending player's archetype
 * @returns Calculated duration in milliseconds
 * 
 * @example
 * ```typescript
 * const duration = calculateEffectDuration(
 *   { id: "paralysis", duration: 2000, ... },
 *   0.95, // High accuracy
 *   VitalPointSeverity.MAJOR,
 *   PlayerArchetype.AMSALJA, // Assassin attacker (+30%)
 *   PlayerArchetype.MUSA // Warrior defender (+20% resistance)
 * );
 * // Result: 2000 * 1.225 * 1.5 * 1.3 * 0.8 * 2.0 = ~9,568ms
 * ```
 * 
 * @public
 * @korean 효과지속시간계산
 */
export function calculateEffectDuration(
  effect: VitalPointEffect,
  accuracy: number,
  severity: VitalPointSeverity,
  attackerArchetype: PlayerArchetype,
  defenderArchetype: PlayerArchetype
): number {
  const baseDuration = effect.duration || DEFAULT_EFFECT_DURATION;

  // Accuracy bonus: 0.75x at 0 accuracy, 1.0x at 0.5, 1.25x at 1.0
  const accuracyBonus = 1 + (accuracy - 0.5) * 0.5;

  // Severity multiplier
  const severityMult = SEVERITY_MULTIPLIERS[severity] || 1.0;

  // Attacker offensive modifier
  const offensiveModifier = ARCHETYPE_OFFENSIVE[attackerArchetype] || 1.0;

  // Defender resistance modifier (inverted: resistance reduces duration)
  const resistanceModifier =
    1 - (ARCHETYPE_RESISTANCE[defenderArchetype] || 0);

  // Calculate base duration
  let finalDuration =
    baseDuration * accuracyBonus * severityMult * offensiveModifier * resistanceModifier;

  // Critical hit bonus for high accuracy
  if (accuracy >= CRITICAL_HIT_THRESHOLD) {
    finalDuration *= CRITICAL_DURATION_MULTIPLIER;
  }

  return Math.floor(finalDuration);
}

/**
 * Calculates the intensity of a status effect based on hit accuracy.
 * 
 * **Korean**: 효과 강도 계산 (Calculate Effect Intensity)
 * 
 * Scales effect intensity from 0.5x (poor accuracy) to 1.5x (perfect accuracy).
 * 
 * @param baseIntensity - Base effect intensity
 * @param accuracy - Hit accuracy (0-1)
 * @returns Scaled intensity value
 * 
 * @example
 * ```typescript
 * const intensity = calculateEffectIntensity(
 *   EffectIntensity.MEDIUM,
 *   0.9 // High accuracy
 * );
 * // Returns scaled intensity for 90% accuracy hit
 * ```
 * 
 * @public
 * @korean 효과강도계산
 */
export function calculateEffectIntensity(
  baseIntensity: EffectIntensity,
  accuracy: number
): EffectIntensity {
  // Map intensities to numeric scale
  const intensityMap: Record<EffectIntensity, number> = {
    [EffectIntensity.WEAK]: 1,
    [EffectIntensity.MINOR]: 2,
    [EffectIntensity.LOW]: 3,
    [EffectIntensity.MEDIUM]: 4,
    [EffectIntensity.MODERATE]: 5,
    [EffectIntensity.HIGH]: 6,
    [EffectIntensity.SEVERE]: 7,
    [EffectIntensity.CRITICAL]: 8,
    [EffectIntensity.EXTREME]: 9,
  };

  // Reverse map for lookup
  const reverseMap: EffectIntensity[] = [
    EffectIntensity.WEAK,
    EffectIntensity.MINOR,
    EffectIntensity.LOW,
    EffectIntensity.MEDIUM,
    EffectIntensity.MODERATE,
    EffectIntensity.HIGH,
    EffectIntensity.SEVERE,
    EffectIntensity.CRITICAL,
    EffectIntensity.EXTREME,
  ];

  const baseLevel = intensityMap[baseIntensity] || 4;

  // Accuracy modifier: 0.5x at 0 accuracy, 1.0x at 0.5, 1.5x at 1.0
  const accuracyModifier = 0.5 + accuracy;

  // Calculate scaled level
  const scaledLevel = Math.max(
    1,
    Math.min(9, Math.round(baseLevel * accuracyModifier))
  );

  return reverseMap[scaledLevel - 1];
}

/**
 * Converts a VitalPointEffect to a StatusEffect with calculated properties.
 * 
 * **Korean**: 급소 효과를 상태 효과로 변환 (Convert Vital Point Effect to Status Effect)
 * 
 * @param effect - Vital point effect to convert
 * @param accuracy - Hit accuracy
 * @param severity - Vital point severity
 * @param attackerArchetype - Attacker's archetype
 * @param defenderArchetype - Defender's archetype
 * @param vitalPointId - Source vital point ID
 * @param timestamp - Current timestamp (for startTime/endTime)
 * @returns StatusEffect with calculated duration and intensity
 * 
 * @public
 * @korean 상태효과변환
 */
export function convertToStatusEffect(
  effect: VitalPointEffect,
  accuracy: number,
  severity: VitalPointSeverity,
  attackerArchetype: PlayerArchetype,
  defenderArchetype: PlayerArchetype,
  vitalPointId: string,
  timestamp: number
): StatusEffect {
  const duration = calculateEffectDuration(
    effect,
    accuracy,
    severity,
    attackerArchetype,
    defenderArchetype
  );

  const intensity = calculateEffectIntensity(effect.intensity, accuracy);

  return {
    id: `${effect.id}_${timestamp}`,
    type: effect.type,
    intensity,
    duration,
    description: effect.description,
    stackable: effect.stackable,
    source: vitalPointId,
    startTime: timestamp,
    endTime: timestamp + duration,
  };
}

/**
 * Applies effect stacking logic to a list of status effects.
 * 
 * **Korean**: 효과 중첩 관리 (Manage Effect Stacking)
 * 
 * Rules:
 * - Non-stackable effects: Keep only the most recent
 * - Stackable effects: Allow up to MAX_CONCURRENT_EFFECTS
 * - Expired effects: Remove automatically
 * 
 * @param currentEffects - Existing active effects
 * @param newEffects - New effects to add
 * @param currentTime - Current timestamp
 * @returns Updated effect list with stacking applied
 * 
 * @example
 * ```typescript
 * const updated = applyEffectStacking(
 *   player.statusEffects,
 *   newVitalPointEffects,
 *   Date.now()
 * );
 * ```
 * 
 * @public
 * @korean 효과중첩적용
 */
export function applyEffectStacking(
  currentEffects: readonly StatusEffect[],
  newEffects: readonly StatusEffect[],
  currentTime: number
): StatusEffect[] {
  // Remove expired effects
  let activeEffects = currentEffects.filter(
    (effect) => effect.endTime > currentTime
  );

  // Process each new effect
  for (const newEffect of newEffects) {
    if (!newEffect.stackable) {
      // Remove existing effects of same type (non-stackable)
      activeEffects = activeEffects.filter(
        (effect) => effect.type !== newEffect.type
      );
    }

    // Add new effect
    activeEffects = [...activeEffects, newEffect];
  }

  // Limit to MAX_CONCURRENT_EFFECTS (keep most recent)
  if (activeEffects.length > MAX_CONCURRENT_EFFECTS) {
    activeEffects = activeEffects
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, MAX_CONCURRENT_EFFECTS);
  }

  return activeEffects;
}

/**
 * Gets the offensive effect modifier for an archetype.
 * 
 * **Korean**: 원형 공격 배율 조회 (Get Archetype Offensive Modifier)
 * 
 * @param archetype - Player archetype
 * @returns Offensive effect multiplier (1.0 - 1.3)
 * 
 * @public
 * @korean 원형공격배율조회
 */
export function getArchetypeOffensiveModifier(
  archetype: PlayerArchetype
): number {
  return ARCHETYPE_OFFENSIVE[archetype] || 1.0;
}

/**
 * Gets the defensive resistance modifier for an archetype.
 * 
 * **Korean**: 원형 방어 배율 조회 (Get Archetype Defensive Modifier)
 * 
 * @param archetype - Player archetype
 * @returns Resistance modifier (-0.1 to 0.2)
 * 
 * @public
 * @korean 원형방어배율조회
 */
export function getArchetypeDefensiveModifier(
  archetype: PlayerArchetype
): number {
  return ARCHETYPE_RESISTANCE[archetype] || 0;
}

/**
 * Checks if a hit qualifies as a critical hit based on accuracy.
 * 
 * **Korean**: 크리티컬 타격 판정 (Check Critical Hit)
 * 
 * @param accuracy - Hit accuracy (0-1)
 * @returns True if accuracy >= 0.9 (critical hit)
 * 
 * @public
 * @korean 크리티컬판정
 */
export function isCriticalHit(accuracy: number): boolean {
  return accuracy >= CRITICAL_HIT_THRESHOLD;
}
