// Korean martial arts vital point system

import type {
  VitalPoint,
  VitalPointHitResult,
  AnatomicalHit,
  RegionData,
  VitalPointEffect as AnatomyVitalPointEffect, // Use alias if VitalPointEffect is also local
  AnatomyModel,
  BodyPart,
  VitalPointCategory,
} from "../types/anatomy";
import type {
  PlayerState,
  StatusEffect,
  Position,
  DamageType,
  KoreanTechnique,
  PlayerArchetype,
} from "../types"; // Ensure Position and DamageType are imported
import { VITAL_POINTS_DATA, ANATOMICAL_REGIONS_DATA } from "../types/constants"; // Assuming these constants exist

export class VitalPointSystem {
  private readonly vitalPoints: readonly VitalPoint[];

  constructor() {
    this.vitalPoints = VITAL_POINTS_DATA;
  }

  // Fix: Single implementation of findVitalPoint
  public findVitalPoint(
    position: Position,
    targetDimensions: { width: number; height: number },
    accuracy: number = 1.0
  ): VitalPoint | null {
    let closestPoint: VitalPoint | null = null;
    let minDistance = Infinity;

    const searchRadius = (1 - accuracy) * 20 + 5; // Larger radius for lower accuracy

    for (const vp of this.vitalPoints) {
      const vpX = (vp.location.x / 100) * targetDimensions.width;
      const vpY = (vp.location.y / 100) * targetDimensions.height;

      const distance = Math.sqrt(
        Math.pow(position.x - vpX, 2) + Math.pow(position.y - vpY, 2)
      );

      if (distance <= searchRadius && distance < minDistance) {
        minDistance = distance;
        closestPoint = vp;
      }
    }

    return closestPoint;
  }

  // Fix: Single implementation of calculateDamage
  public calculateDamage(
    vitalPoint: VitalPoint,
    baseDamage: number,
    technique: KoreanTechnique,
    archetype: PlayerArchetype
  ): number {
    let damage = baseDamage * (vitalPoint.damageMultiplier || 1.0);

    // Apply technique effectiveness
    const isEffectiveTechnique =
      vitalPoint.techniques?.includes(technique.type as string) || false; // Cast technique.type to string
    if (isEffectiveTechnique) {
      damage *= 1.2;
    }

    // Apply archetype modifiers - fix category type
    const archetypeBonus = this.getArchetypeVitalPointBonus(
      archetype,
      vitalPoint.category as any
    );
    damage *= archetypeBonus;

    return Math.round(damage);
  }

  // Fix: Convert Map usage to Array operations
  public getVitalPointsByCategory(
    category: VitalPointCategory
  ): readonly VitalPoint[] {
    return this.vitalPoints.filter(
      (vp: VitalPoint) => vp.category === category
    );
  }

  // Fix: Single implementation of processHit
  public processHit(
    hitPosition: Position,
    technique: KoreanTechnique,
    baseDamage: number,
    archetype: PlayerArchetype,
    targetDimensions: { width: number; height: number } = {
      width: 100,
      height: 200,
    }
  ): VitalPointHitResult {
    // This now correctly refers to VitalPointHitResult from types/systems.ts
    const vitalPoint = this.findVitalPoint(
      hitPosition,
      targetDimensions,
      technique.accuracy
    );

    if (!vitalPoint) {
      return {
        hit: false,
        damage: baseDamage,
        effects: [],
        vitalPointsHit: [],
        bodyPartId: undefined,
        isCritical: false, // Correct field from types/systems.ts VitalPointHitResult
      };
    }

    const totalDamage = this.calculateDamage(
      vitalPoint,
      baseDamage,
      technique,
      archetype
    );
    const isCriticalHit = Math.random() < (technique.critChance || 0.05);

    // Convert VitalPointEffect to StatusEffect
    const statusEffects: StatusEffect[] =
      vitalPoint.effects?.map((effect) => ({
        id: effect.id,
        type: effect.type,
        intensity: effect.intensity,
        duration: effect.duration,
        description: effect.description,
        stackable: effect.stackable || false,
        source: "vital_point",
      })) || [];

    return {
      hit: true,
      damage: isCriticalHit ? Math.floor(totalDamage * 1.5) : totalDamage,
      effects: statusEffects,
      vitalPointsHit: [vitalPoint.id], // Correctly string[]
      // vitalPoint, // Not part of types/systems.ts VitalPointHitResult
      // severity: vitalPoint.severity, // Not part of types/systems.ts VitalPointHitResult
      // criticalHit: isCriticalHit, // isCritical is the correct field name
      // location: hitPosition, // Not part of types/systems.ts VitalPointHitResult
      // statusEffectsApplied: statusEffects, // effects is the correct field name
      // painLevel: totalDamage * (vitalPoint.severity === "critical" ? 1.5 : 1.0), // Not part of this
      // consciousnessImpact: // Not part of this
      //   vitalPoint.category === "head" ? totalDamage * 0.8 : totalDamage * 0.3,
      bodyPartId: vitalPoint.location.region.toString(), // Or derive more specifically
      isCritical: isCriticalHit, // Correct field
    };
  }

  private getArchetypeVitalPointBonus(
    archetype: PlayerArchetype,
    category: any
  ): number {
    // Fix the mapping to match actual VitalPointCategory values
    const bonuses: Record<PlayerArchetype, Record<string, number>> = {
      musa: {
        head: 1.0,
        nerve: 1.1,
        organ: 1.0,
        pressure_point: 1.1,
        joints: 1.2,
        vascular: 1.0,
        torso: 1.1,
        joint: 1.2,
        blood_vessel: 1.0,
        bone: 1.1,
        muscle: 1.0,
        nerve_points: 1.1,
      },
      amsalja: {
        head: 1.3,
        nerve: 1.5,
        organ: 1.2,
        pressure_point: 1.4,
        joints: 1.1,
        vascular: 1.3,
        torso: 1.0,
        joint: 1.1,
        blood_vessel: 1.3,
        bone: 1.0,
        muscle: 1.0,
        nerve_points: 1.5,
      },
      hacker: {
        head: 1.2,
        nerve: 1.4,
        organ: 1.1,
        pressure_point: 1.5,
        joints: 1.0,
        vascular: 1.2,
        torso: 1.0,
        joint: 1.0,
        blood_vessel: 1.2,
        bone: 1.0,
        muscle: 1.0,
        nerve_points: 1.4,
      },
      jeongbo_yowon: {
        head: 1.1,
        nerve: 1.3,
        organ: 1.2,
        pressure_point: 1.3,
        joints: 1.1,
        vascular: 1.1,
        torso: 1.1,
        joint: 1.1,
        blood_vessel: 1.1,
        bone: 1.0,
        muscle: 1.0,
        nerve_points: 1.3,
      },
      jojik_pokryeokbae: {
        head: 1.2,
        nerve: 1.0,
        organ: 1.3,
        pressure_point: 1.0,
        joints: 1.3,
        vascular: 1.1,
        torso: 1.2,
        joint: 1.3,
        blood_vessel: 1.1,
        bone: 1.2,
        muscle: 1.2,
        nerve_points: 1.0,
      },
    };

    return bonuses[archetype]?.[category] || 1.0;
  }

  // Add missing instance methods
  public getVitalPointsInRegion(region: any): VitalPoint[] {
    return this.vitalPoints.filter((vp) => vp.location.region === region);
  }

  public getAllVitalPoints(): VitalPoint[] {
    return [...this.vitalPoints];
  }

  // Fix static method implementations
  public static getVitalPointsInRegion(region: any): VitalPoint[] {
    // Changed to non-readonly
    return new VitalPointSystem().getVitalPointsInRegion(region);
  }

  public static getAllVitalPoints(): VitalPoint[] {
    // Changed to non-readonly
    return new VitalPointSystem().getAllVitalPoints();
  }

  public static getHitResult(
    attacker: PlayerState,
    defender: PlayerState,
    techniqueVitalPoints: readonly string[], // IDs of vital points targeted by technique
    hitPosition: Position, // Precise hit location on defender
    baseDamage: number,
    accuracyRoll: number // e.g., 0-1, result of an accuracy check
  ): VitalPointHitResult {
    const hitVitalPoints: VitalPoint[] = [];
    let totalDamage = 0;
    const appliedEffects: StatusEffect[] = [];
    let mostSevereVitalPoint: VitalPoint | undefined = undefined;

    // Basic proximity check for vital points near hitPosition
    // This is a simplified model. A real system would use defender's posture, hit angle, etc.
    for (const vpId of Object.keys(VITAL_POINTS_DATA)) {
      const vitalPoint = VITAL_POINTS_DATA[vpId];
      // Example: Check if hitPosition is within a certain radius of the vital point's location
      // This requires vitalPoint.location to be in world coordinates or relative to defender's origin
      // For now, assume if a technique targets it, and accuracy is good, it's a potential hit.
      if (techniqueVitalPoints.includes(vpId)) {
        // Simplified hit chance: if accuracyRoll is high enough for this VP
        if (
          accuracyRoll * attacker.skills.striking >
          (1 - vitalPoint.baseAccuracy) * 100
        ) {
          // Example calc
          hitVitalPoints.push(vitalPoint);
          totalDamage +=
            (baseDamage + vitalPoint.baseDamage) * vitalPoint.damageMultiplier;
          vitalPoint.effects.forEach((effect) => {
            // Convert AnatomyVitalPointEffect to StatusEffect
            appliedEffects.push({
              id: effect.id,
              type: effect.type,
              intensity: effect.intensity,
              duration: effect.duration,
              description: effect.description,
              stackable: effect.stackable,
              source: `vp:${vpId}`,
            });
          });
          if (
            !mostSevereVitalPoint ||
            VitalPointSystem.isSeverityGreater(
              vitalPoint.severity,
              mostSevereVitalPoint.severity
            )
          ) {
            mostSevereVitalPoint = vitalPoint;
          }
        }
      }
    }

    const criticalHit = Math.random() < attacker.skills.focus / 200; // Example crit chance
    if (criticalHit && mostSevereVitalPoint) {
      totalDamage *= 1.5; // Crit damage multiplier
    }

    return {
      hit: hitVitalPoints.length > 0,
      damage: totalDamage,
      effects: appliedEffects,
      vitalPointsHit: hitVitalPoints, // This should be VitalPoint[]
      vitalPoint: mostSevereVitalPoint,
      severity: mostSevereVitalPoint?.severity,
      criticalHit: criticalHit && hitVitalPoints.length > 0,
      location: hitPosition,
      effectiveness: hitVitalPoints.length / (techniqueVitalPoints.length || 1), // Example effectiveness
      statusEffectsApplied: appliedEffects, // Duplicate of effects, can be merged
      painLevel: totalDamage * 0.5, // Example pain calculation
      consciousnessImpact: totalDamage * 0.2, // Example consciousness impact
      // bodyPartId: undefined, // Removed, not part of VitalPointHitResult
    };
  }
}

// Fix wrapper functions to use static methods correctly
export function getVitalPointsInRegion(region: string): readonly VitalPoint[] {
  return VitalPointSystem.getVitalPointsInRegion(region);
}

export function getAllVitalPoints(): readonly VitalPoint[] {
  return VitalPointSystem.getAllVitalPoints();
}
