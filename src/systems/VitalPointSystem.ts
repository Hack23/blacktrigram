import type {
  Position,
  VitalPoint,
  KoreanTechnique,
  VitalPointHit,
  AnatomicalRegionIdentifier,
  VitalPointSystemConfig,
} from "../types";
import { KOREAN_VITAL_POINTS_DATA } from "./vitalpoint/KoreanVitalPoints";

export const VitalPointSystem = {
  config: {
    baseAccuracy: 0.8,
    distanceModifier: 0.05,
    targetingDifficulty: 0.75,
    damageMultiplier: 1.8,
    effectChance: 0.6,
  } as VitalPointSystemConfig,

  configure(newConfig: Partial<VitalPointSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
  },

  getVitalPointsForRegion(region: AnatomicalRegionIdentifier): VitalPoint[] {
    const regionPoints =
      KOREAN_VITAL_POINTS_DATA[region as keyof typeof KOREAN_VITAL_POINTS_DATA];
    return regionPoints ? Object.values(regionPoints) : [];
  },

  getAllVitalPoints(): VitalPoint[] {
    const allPoints: VitalPoint[] = [];
    Object.values(KOREAN_VITAL_POINTS_DATA).forEach((regionPoints) => {
      allPoints.push(...Object.values(regionPoints));
    });
    return allPoints;
  },

  checkVitalPointHit(
    targetPosition: Position,
    vitalPoint: VitalPoint,
    technique: KoreanTechnique,
    distanceToTarget: number,
    configParams: VitalPointSystemConfig
  ): VitalPointHit | null {
    // Calculate base accuracy considering distance and technique precision
    const baseAccuracy = configParams.baseAccuracy;
    const distanceModifier = configParams.distanceModifier;
    const distancePenalty = distanceToTarget * distanceModifier;

    // Factor in technique accuracy and range
    const techniqueAccuracyBonus = technique.accuracy - 0.5; // Bonus/penalty from technique
    const rangeEffectiveness = Math.max(
      0.1,
      1 - distanceToTarget / technique.range
    );

    let accuracy = baseAccuracy - distancePenalty + techniqueAccuracyBonus;
    accuracy *= rangeEffectiveness;

    // Calculate position precision - how close the attack is to the vital point
    const positionDistance = Math.sqrt(
      Math.pow(targetPosition.x - vitalPoint.position.x, 2) +
        Math.pow(targetPosition.y - vitalPoint.position.y, 2)
    );

    // Smaller vital points are harder to hit precisely
    const precisionTolerance = 15 / (vitalPoint.difficulty ?? 0.5); // Inverse difficulty
    const positionAccuracy = Math.max(
      0,
      1 - positionDistance / precisionTolerance
    );

    // Final accuracy combines all factors
    const finalAccuracy = accuracy * positionAccuracy;

    // Difficulty affects hit chance
    const difficulty = vitalPoint.difficulty ?? 0.5;
    const hitChance = finalAccuracy * (1 - difficulty * 0.3); // Difficulty reduces hit chance

    // Technique type modifiers
    const techniqueTypeModifier = this.getTechniqueTypeModifier(
      technique.type,
      vitalPoint
    );
    const adjustedHitChance = hitChance * techniqueTypeModifier;

    if (Math.random() > adjustedHitChance) {
      return null;
    }

    // Calculate damage based on precision and vital point multiplier
    const baseDamage = technique.damage;
    const vitalPointMultiplier = vitalPoint.damageMultiplier;
    const precisionMultiplier = Math.max(0.5, finalAccuracy);
    const finalDamage = Math.round(
      baseDamage * vitalPointMultiplier * precisionMultiplier
    );

    // Determine if it's a critical hit based on high precision and difficulty
    const isCritical =
      finalAccuracy > 0.9 && (vitalPoint.difficulty ?? 0) > 0.7;

    return {
      hit: true,
      vitalPoint,
      damage: finalDamage,
      critical: isCritical,
      description: `Struck ${vitalPoint.koreanName} (${
        vitalPoint.name.english
      }) with ${(finalAccuracy * 100).toFixed(1)}% precision`,
      effectiveness: finalAccuracy,
      effectsApplied: vitalPoint.effects || [],
    };
  },

  calculateAccuracy(
    attackerPosition: Position,
    targetPosition: Position,
    technique: KoreanTechnique,
    distance: number
  ): number {
    // Calculate base accuracy from attacker's position and technique
    const baseAccuracy = technique.accuracy;

    // Distance penalty - further attacks are less accurate
    const distancePenalty = Math.max(
      0,
      (distance - technique.range * 0.5) / technique.range
    );

    // Angle consideration - attacks from better angles are more accurate
    const attackAngle = Math.atan2(
      targetPosition.y - attackerPosition.y,
      targetPosition.x - attackerPosition.x
    );

    // Optimal angles for different attack types (example: front attacks vs side attacks)
    const optimalAngle = this.getOptimalAngleForTechnique(technique);
    const angleDifference = Math.abs(attackAngle - optimalAngle);
    const angleModifier = Math.max(0.7, 1 - (angleDifference / Math.PI) * 0.3);

    let finalAccuracy = baseAccuracy * angleModifier * (1 - distancePenalty);

    // Ensure accuracy stays within reasonable bounds
    return Math.max(0.1, Math.min(0.95, finalAccuracy));
  },

  getTechniqueTypeModifier(attackType: string, vitalPoint: VitalPoint): number {
    // Different attack types are more effective against different vital point categories
    const categoryModifiers: Record<string, Record<string, number>> = {
      punch: { nerve: 1.2, joint: 0.8, organ: 0.9, vessel: 1.0 },
      kick: { joint: 1.3, organ: 1.1, nerve: 0.9, vessel: 0.8 },
      elbow: { nerve: 1.4, joint: 1.0, organ: 0.8, vessel: 0.9 },
      knee: { organ: 1.2, joint: 1.1, nerve: 0.8, vessel: 0.9 },
      pressure_point: { nerve: 1.5, meridian: 1.3, vessel: 1.2, joint: 0.7 },
      grapple: { joint: 1.2, vessel: 0.8, nerve: 0.9, organ: 1.0 },
      throw: { joint: 1.1, organ: 0.9, nerve: 0.8, vessel: 0.8 },
      combination: { nerve: 1.0, joint: 1.0, organ: 1.0, vessel: 1.0 },
      strike: { nerve: 1.1, joint: 0.9, organ: 1.0, vessel: 1.0 },
    };

    const category = vitalPoint.category || "nerve";
    const modifiers = categoryModifiers[attackType];
    return modifiers?.[category] || 1.0;
  },

  getOptimalAngleForTechnique(technique: KoreanTechnique): number {
    // Return optimal attack angles in radians for different techniques
    const angleMap: Record<string, number> = {
      punch: 0, // Straight forward
      kick: Math.PI / 4, // 45 degrees
      elbow: Math.PI / 2, // Side angle
      knee: Math.PI / 6, // 30 degrees upward
      pressure_point: 0, // Direct approach
      grapple: Math.PI, // From behind/close
      throw: Math.PI / 3, // 60 degrees
      combination: 0, // Variable, use straight
      strike: 0, // Direct
    };

    return angleMap[technique.type] || 0;
  },
};
