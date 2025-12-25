/**
 * Integration of Breathing Disruption System with Vital Point System.
 * 
 * **Korean**: 호흡곤란-급소 통합
 * 
 * This module bridges the breathing disruption system with the vital point targeting
 * system, applying appropriate respiratory effects based on which torso vital points
 * are struck.
 * 
 * ## Torso Vital Points with Breathing Effects
 * 
 * - **명치 (Solar Plexus)**: Instant severe disruption (75% penalty, 15s)
 * - **늑골 (Floating Ribs)**: Moderate disruption (50% penalty, 10s)
 * - **횡격막 (Diaphragm)**: Severe disruption (75% penalty, 15s)
 * - **복부 (Abdomen)**: Light disruption (25% penalty, 5s)
 * 
 * @module systems/breathing/integration
 * @category Combat Systems
 * @korean 호흡곤란통합
 */

import { VitalPoint } from "../vitalpoint/types";
import { PlayerState } from "../player";
import { StatusEffect } from "../types";
import {
  BreathingDisruptionSystem,
  BreathingDisruptionLevel,
  BreathingDisruptionEffect,
} from "./BreathingDisruptionSystem";
import { VitalPointEffectType } from "@/types";

/**
 * Torso vital point IDs that cause breathing disruption.
 * 
 * Maps vital point IDs to their corresponding breathing disruption levels.
 */
const BREATHING_DISRUPTION_VITAL_POINTS: Record<
  string,
  BreathingDisruptionLevel
> = {
  // Solar plexus - instant severe disruption
  torso_solar_plexus: BreathingDisruptionLevel.SEVERELY_WINDED,
  
  // Floating ribs - moderate disruption
  torso_floating_ribs: BreathingDisruptionLevel.GASPING,
  torso_rib_left: BreathingDisruptionLevel.GASPING,
  torso_rib_right: BreathingDisruptionLevel.GASPING,
  
  // Diaphragm - severe disruption
  torso_diaphragm: BreathingDisruptionLevel.SEVERELY_WINDED,
  
  // Lower torso - light disruption
  torso_abdomen: BreathingDisruptionLevel.WINDED,
  torso_liver: BreathingDisruptionLevel.WINDED,
  torso_kidney_left: BreathingDisruptionLevel.WINDED,
  torso_kidney_right: BreathingDisruptionLevel.WINDED,
};

/**
 * Check if a vital point causes breathing disruption.
 * 
 * @param vitalPointId - ID of the vital point struck
 * @returns True if this vital point affects breathing
 */
export function causesBreathingDisruption(vitalPointId: string): boolean {
  return vitalPointId in BREATHING_DISRUPTION_VITAL_POINTS;
}

/**
 * Get breathing disruption level for a vital point.
 * 
 * **Korean**: 급소별 호흡곤란 수준
 * 
 * @param vitalPointId - ID of the vital point struck
 * @returns Breathing disruption level, or NONE if not applicable
 */
export function getBreathingDisruptionLevel(
  vitalPointId: string
): BreathingDisruptionLevel {
  return (
    BREATHING_DISRUPTION_VITAL_POINTS[vitalPointId] ||
    BreathingDisruptionLevel.NONE
  );
}

/**
 * Apply breathing disruption effect from vital point strike.
 * 
 * **Korean**: 급소 타격으로 호흡곤란 적용
 * 
 * Creates a breathing disruption effect when a torso vital point is struck.
 * If player already has breathing disruption, stacks the effects.
 * 
 * @param player - Current player state
 * @param vitalPoint - Vital point that was struck
 * @param damage - Base damage dealt
 * @param timestamp - Current game time
 * @returns Updated player state with breathing disruption effect
 * 
 * @example
 * ```typescript
 * // Solar plexus strike causes severe breathing disruption
 * const updatedPlayer = applyBreathingDisruptionFromVitalPoint(
 *   player,
 *   solarPlexusVitalPoint,
 *   40,
 *   Date.now()
 * );
 * 
 * // Player now has 75% stamina regen penalty for 15 seconds
 * const penalty = BreathingDisruptionSystem.calculateStaminaRegen(
 *   updatedPlayer,
 *   10
 * );
 * // penalty === 2.5 (25% of normal regen)
 * ```
 */
export function applyBreathingDisruptionFromVitalPoint(
  player: PlayerState,
  vitalPoint: VitalPoint,
  _damage: number, // Damage parameter kept for API consistency but not currently used
  timestamp: number
): PlayerState {
  // Check if this vital point causes breathing disruption
  const level = getBreathingDisruptionLevel(vitalPoint.id);
  
  if (level === BreathingDisruptionLevel.NONE) {
    // No breathing effect from this vital point
    return player;
  }

  // Check for existing breathing disruption
  const existingEffect = BreathingDisruptionSystem.getActiveEffect(player);
  
  let newEffect: BreathingDisruptionEffect;
  
  if (existingEffect) {
    // Stack with existing effect
    newEffect = BreathingDisruptionSystem.stackEffect(
      existingEffect,
      level,
      `${vitalPoint.names.korean} (${vitalPoint.names.english})`,
      timestamp
    );
    
    // Remove old effect and add stacked effect
    const otherEffects = player.statusEffects.filter(
      (effect) => effect.id !== existingEffect.id
    );
    
    return {
      ...player,
      statusEffects: [...otherEffects, newEffect],
    };
  } else {
    // Create new breathing disruption effect
    newEffect = BreathingDisruptionSystem.createEffect(
      level,
      `${vitalPoint.names.korean} (${vitalPoint.names.english})`,
      timestamp
    );
    
    return {
      ...player,
      statusEffects: [...player.statusEffects, newEffect],
    };
  }
}

/**
 * Apply breathing disruption from general torso damage.
 * 
 * **Korean**: 일반 몸통 피해로 호흡곤란 적용
 * 
 * When torso is hit but no specific vital point is targeted,
 * calculates appropriate breathing disruption level from damage amount.
 * 
 * @param player - Current player state
 * @param damage - Torso damage amount
 * @param isSolarPlexusArea - Whether strike was near solar plexus
 * @param timestamp - Current game time
 * @returns Updated player state with breathing disruption effect
 * 
 * @example
 * ```typescript
 * // Moderate torso strike (15 damage)
 * const updatedPlayer = applyBreathingDisruptionFromTorsoDamage(
 *   player,
 *   15,
 *   false,
 *   Date.now()
 * );
 * 
 * // Player gets Winded effect (25% penalty for 5s)
 * ```
 */
export function applyBreathingDisruptionFromTorsoDamage(
  player: PlayerState,
  damage: number,
  isSolarPlexusArea: boolean,
  timestamp: number
): PlayerState {
  // Calculate disruption level from damage
  const level = BreathingDisruptionSystem.calculateLevelFromDamage(
    damage,
    isSolarPlexusArea
  );
  
  if (level === BreathingDisruptionLevel.NONE) {
    // Damage too low to cause breathing disruption
    return player;
  }

  // Check for existing breathing disruption
  const existingEffect = BreathingDisruptionSystem.getActiveEffect(player);
  
  let newEffect: BreathingDisruptionEffect;
  
  if (existingEffect) {
    // Stack with existing effect
    newEffect = BreathingDisruptionSystem.stackEffect(
      existingEffect,
      level,
      "Torso Strike",
      timestamp
    );
    
    // Remove old effect and add stacked effect
    const otherEffects = player.statusEffects.filter(
      (effect) => effect.id !== existingEffect.id
    );
    
    return {
      ...player,
      statusEffects: [...otherEffects, newEffect],
    };
  } else {
    // Create new breathing disruption effect
    newEffect = BreathingDisruptionSystem.createEffect(
      level,
      "Torso Strike",
      timestamp
    );
    
    return {
      ...player,
      statusEffects: [...player.statusEffects, newEffect],
    };
  }
}

/**
 * Update breathing disruption effects each frame.
 * 
 * **Korean**: 호흡곤란 효과 프레임 업데이트
 * 
 * Handles recovery when torso health > 50% and removes expired effects.
 * Should be called each game frame (60fps).
 * 
 * @param player - Current player state
 * @param deltaTime - Time since last frame (milliseconds)
 * @param timestamp - Current game time
 * @returns Updated player state with modified breathing disruption
 * 
 * @example
 * ```typescript
 * // In game loop (60fps)
 * function gameUpdate(deltaTime: number) {
 *   player = updateBreathingDisruption(player, deltaTime, Date.now());
 *   
 *   // Stamina regen now reflects breathing disruption penalty
 *   const regenRate = BreathingDisruptionSystem.calculateStaminaRegen(
 *     player,
 *     BASE_STAMINA_REGEN
 *   );
 * }
 * ```
 */
export function updateBreathingDisruption(
  player: PlayerState,
  deltaTime: number,
  timestamp: number
): PlayerState {
  const activeEffect = BreathingDisruptionSystem.getActiveEffect(player);
  
  if (!activeEffect) {
    // No breathing disruption to update
    return player;
  }

  // Check if effect has expired
  if (timestamp >= activeEffect.endTime) {
    // Remove expired effect
    const remainingEffects = player.statusEffects.filter(
      (effect) => effect.id !== activeEffect.id
    );
    
    return {
      ...player,
      statusEffects: remainingEffects,
    };
  }

  // Check if player can recover (torso health > 50%)
  if (BreathingDisruptionSystem.canRecover(player)) {
    // Apply gradual recovery
    const recoveredEffect = BreathingDisruptionSystem.applyGradualRecovery(
      activeEffect,
      deltaTime,
      timestamp
    );
    
    if (!recoveredEffect) {
      // Fully recovered
      const remainingEffects = player.statusEffects.filter(
        (effect) => effect.id !== activeEffect.id
      );
      
      return {
        ...player,
        statusEffects: remainingEffects,
      };
    }
    
    // Replace with recovered effect
    const otherEffects = player.statusEffects.filter(
      (effect) => effect.id !== activeEffect.id
    );
    
    return {
      ...player,
      statusEffects: [...otherEffects, recoveredEffect],
    };
  }

  // No recovery, effect continues normally
  return player;
}

/**
 * Replace legacy BREATHLESSNESS effects with new breathing disruption system.
 * 
 * **Korean**: 구형 호흡곤란 효과를 신규 시스템으로 전환
 * 
 * Upgrades old-style breathlessness status effects to use the new
 * breathing disruption system with proper stamina regen penalties.
 * 
 * @param player - Player state with legacy effects
 * @param timestamp - Current game time
 * @returns Player state with upgraded breathing disruption effects
 */
export function upgradeLegacyBreathlessness(
  player: PlayerState,
  timestamp: number
): PlayerState {
  // Find legacy breathlessness effects (without breathing disruption level)
  const legacyEffects = player.statusEffects.filter(
    (effect): effect is StatusEffect =>
      effect.type === VitalPointEffectType.BREATHLESSNESS &&
      !("level" in effect)
  );
  
  if (legacyEffects.length === 0) {
    return player;
  }

  // Remove legacy effects
  const nonLegacyEffects = player.statusEffects.filter(
    (effect) =>
      effect.type !== VitalPointEffectType.BREATHLESSNESS ||
      "level" in effect
  );
  
  // Create new breathing disruption effect based on legacy effect intensity
  const legacyEffect = legacyEffects[0]; // Use first/strongest effect
  let level: BreathingDisruptionLevel;
  
  // Map legacy intensity to new disruption levels
  switch (legacyEffect.intensity) {
    case "high":
    case "severe":
    case "critical":
      level = BreathingDisruptionLevel.SEVERELY_WINDED;
      break;
    case "medium":
    case "moderate":
      level = BreathingDisruptionLevel.GASPING;
      break;
    default:
      level = BreathingDisruptionLevel.WINDED;
  }
  
  const newEffect = BreathingDisruptionSystem.createEffect(
    level,
    legacyEffect.source || "Legacy Effect",
    timestamp
  );
  
  return {
    ...player,
    statusEffects: [...nonLegacyEffects, newEffect],
  };
}
