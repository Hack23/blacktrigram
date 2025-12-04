import type { Position } from "../../types/common";
import { VitalPoint, VitalPointEffect, VitalPointHitResult } from "./types";
// Fix: Import both EffectIntensity type and enum from the correct location
import { VitalPointEffectType, VitalPointSeverity } from "../../types/common";
import { EffectIntensity, EffectType } from "../effects";
import { StatusEffect } from "../types";

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
    const typeMapping: Record<VitalPointEffectType, EffectType> = {
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

    // Fix: Use the correct EffectIntensity enum values from enums.ts
    const intensityMapping: Record<EffectIntensity, EffectIntensity> = {
      [EffectIntensity.WEAK]: EffectIntensity.WEAK,
      [EffectIntensity.MINOR]: EffectIntensity.MINOR,
      [EffectIntensity.LOW]: EffectIntensity.LOW,
      [EffectIntensity.MEDIUM]: EffectIntensity.MEDIUM,
      [EffectIntensity.MODERATE]: EffectIntensity.MODERATE,
      [EffectIntensity.HIGH]: EffectIntensity.HIGH,
      [EffectIntensity.SEVERE]: EffectIntensity.SEVERE,
      [EffectIntensity.CRITICAL]: EffectIntensity.CRITICAL,
      [EffectIntensity.EXTREME]: EffectIntensity.EXTREME,
    };

    return {
      id: `${vitalPointEffect.id}_${currentTime}`,
      type: typeMapping[vitalPointEffect.type] || "weakened",
      intensity:
        intensityMapping[vitalPointEffect.intensity] || EffectIntensity.MEDIUM,
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

    // Fix: Provide default values for potentially undefined properties
    const radius = vitalPoint.radius ?? 10; // Default radius
    const requiredForce = vitalPoint.requiredForce ?? 50; // Default force requirement

    const isHit = distance <= radius;

    if (!isHit) {
      return {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };
    }

    // Calculate damage
    const baseDamage = vitalPoint.baseDamage ?? 15;
    const forceMultiplier = Math.min(force / requiredForce, 2.0);
    const damage = Math.floor(baseDamage * forceMultiplier);

    // Convert VitalPointEffect array to StatusEffect array
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
