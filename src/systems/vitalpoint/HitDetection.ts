import type { Position } from "../../types/common";
import type { VitalPoint, VitalPointHitResult } from "../../types/anatomy";
// Fix: Remove unused KoreanTechnique import
// Fix: Import EffectType from effects.ts, not enums.ts
import {
  VitalPointSeverity,
  VitalPointEffectType,
  EffectIntensity as VitalPointEffectIntensity,
} from "../../types/enums";
import type { VitalPointEffect } from "../../types/anatomy";
import type { StatusEffect, HitEffectType } from "../../types/effects"; // Fix: Import HitEffectType instead of EffectType

export class HitDetection {
  /**
   * Convert VitalPointEffect to StatusEffect with required properties
   */
  private static convertVitalPointEffectToStatusEffect(
    vitalPointEffect: VitalPointEffect,
    vitalPointId: string
  ): StatusEffect {
    const currentTime = Date.now();

    // Fix: Use EffectType from effects.ts (string literals)
    const typeMapping: Record<VitalPointEffectType, HitEffectType> = {
      [VitalPointEffectType.UNCONSCIOUSNESS]: "stun",
      [VitalPointEffectType.BREATHLESSNESS]: "stamina_drain",
      [VitalPointEffectType.PAIN]: "weakened",
      [VitalPointEffectType.PARALYSIS]: "paralysis",
      [VitalPointEffectType.STUN]: "stun",
      [VitalPointEffectType.WEAKNESS]: "weakened",
      [VitalPointEffectType.DISORIENTATION]: "confusion",
      [VitalPointEffectType.BLOOD_FLOW_RESTRICTION]: "bleed",
      [VitalPointEffectType.NERVE_DISRUPTION]: "paralysis",
      [VitalPointEffectType.ORGAN_DISRUPTION]: "vulnerability",
    };

    // Convert VitalPointEffectIntensity to effects.ts intensity type
    const intensityMapping: Record<
      VitalPointEffectIntensity,
      "minor" | "moderate" | "severe" | "critical"
    > = {
      [VitalPointEffectIntensity.WEAK]: "minor",
      [VitalPointEffectIntensity.MEDIUM]: "moderate",
      [VitalPointEffectIntensity.HIGH]: "severe",
      [VitalPointEffectIntensity.EXTREME]: "critical",
    };

    return {
      id: `${vitalPointEffect.id}_${currentTime}`,
      type: typeMapping[vitalPointEffect.type] || "weakened", // Fix: Use correct type
      intensity: intensityMapping[vitalPointEffect.intensity] || "moderate",
      duration: vitalPointEffect.duration,
      description: vitalPointEffect.description,
      stackable: vitalPointEffect.stackable,
      source: vitalPointId,
      startTime: currentTime,
      endTime: currentTime + vitalPointEffect.duration,
    };
  }

  processVitalPointHit(
    vitalPoint: VitalPoint,
    hitPosition: Position,
    force: number
  ): VitalPointHitResult {
    // Calculate hit accuracy
    const distance = Math.sqrt(
      Math.pow(hitPosition.x - vitalPoint.position.x, 2) +
        Math.pow(hitPosition.y - vitalPoint.position.y, 2)
    );

    const isHit = distance <= vitalPoint.radius;

    if (!isHit) {
      return {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };
    }

    // Calculate damage
    const baseDamage = vitalPoint.baseDamage || 15;
    const forceMultiplier = Math.min(force / vitalPoint.requiredForce, 2.0);
    const damage = Math.floor(baseDamage * forceMultiplier);

    // Fix: Convert VitalPointEffect array to StatusEffect array
    const effects = vitalPoint.effects.map((effect) =>
      HitDetection.convertVitalPointEffectToStatusEffect(effect, vitalPoint.id)
    );

    return {
      hit: true,
      vitalPoint,
      damage,
      effects,
      severity: vitalPoint.severity,
    };
  }
}

export default HitDetection;
