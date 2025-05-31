import type {
  AttackType,
  CollisionZone,
  HitDetectionParams,
  StatusEffect,
  VitalPoint,
} from "../../types";
import {
  calculateVitalPointDamage,
  getClosestVitalPoint,
} from "./AnatomicalRegions";

/**
 * Korean Martial Arts Hit Detection System
 * Implements precise vital point targeting with traditional Korean martial arts principles
 */

// Local types AttackType, HitResult, HitDetectionParams, CollisionZone removed or to be aligned with imported ones.
// For now, we assume they are defined in types/index.ts or we use the imported ones.
// If HitResult here is very specific and different, it might need to remain local or be a new type in types/index.ts

// Using the imported HitResult type (aliased as ConsolidatedHitResult if local one is kept for comparison)
// For this refactor, let's assume the local HitResult is the one to use or be merged.
// If types/index.ts has a HitResult, it needs to be compatible.
// For now, I'll keep the local HitResult definition if it's substantially different
// and assume it will be reconciled later or moved to types/index.ts.
// The provided types/index.ts does not have a HitResult that matches this one.
// It has AttackResult. This HitResult is specific to this system.

interface HitResult {
  // This local HitResult is specific to this system's return value.
  readonly hit: boolean;
  readonly damage: number;
  readonly vitalPoint: VitalPoint | null; // Uses the imported VitalPoint
  readonly effects: readonly StatusEffect[]; // Uses the imported StatusEffect
  readonly hitType: "normal" | "vital" | "critical" | "miss";
  readonly description: string;
  readonly accuracy?: number;
}

/**
 * Advanced hit detection with vital point precision
 */
export class HitDetectionSystem {
  private static readonly HIT_TOLERANCE = 25; // Pixels tolerance for vital point hits
  private static readonly GUARD_REDUCTION = 0.3; // Guard reduces damage by 30%
  private static readonly SKILL_MODIFIER = 0.1; // Skill affects hit accuracy

  /**
   * Main hit detection function - determines if and how an attack lands
   */
  public static detectHit(params: HitDetectionParams): HitResult {
    const {
      attackPosition,
      attackType,
      accuracy,
      baseDamage,
      attackerSkill,
      defenderGuard,
    } = params;

    // Calculate effective accuracy based on attacker skill
    const effectiveAccuracy = Math.min(
      1.0,
      accuracy + attackerSkill * this.SKILL_MODIFIER
    );

    // Check for vital point hit
    const vitalPoint = getClosestVitalPoint(attackPosition, this.HIT_TOLERANCE);
    const isVitalHit =
      vitalPoint !== null &&
      this.isVitalPointHit(attackPosition, vitalPoint, effectiveAccuracy);

    // Calculate base hit detection
    const hitSuccess = this.calculateHitSuccess(
      attackType,
      effectiveAccuracy,
      defenderGuard
    );

    if (!hitSuccess) {
      return {
        hit: false,
        damage: 0,
        vitalPoint: null,
        effects: [],
        hitType: "miss",
        description: "Attack missed target",
      };
    }

    // Calculate damage and effects
    let finalDamage = baseDamage;
    let effects: StatusEffect[] = [];
    let hitType: "normal" | "vital" | "critical" | "miss" = "normal";
    let description = "Standard hit";

    if (isVitalHit && vitalPoint) {
      finalDamage = calculateVitalPointDamage(
        vitalPoint,
        baseDamage,
        effectiveAccuracy
      );
      effects = vitalPoint.effects ? [...vitalPoint.effects] : []; // Ensure effects is an array
      hitType = "vital";
      description = `Vital point struck: ${vitalPoint.koreanName} (${vitalPoint.name.english})`; // Access name parts

      // Check for critical hit on high-difficulty vital points
      if ((vitalPoint.difficulty ?? 0) >= 0.8 && effectiveAccuracy >= 0.9) {
        // Use difficulty from VitalPoint
        hitType = "critical";
        finalDamage = Math.round(finalDamage * 1.5);
        description = `Critical vital strike: ${vitalPoint.koreanName}!`; // Access koreanName
      }
    }

    // Apply guard reduction
    if (defenderGuard > 0) {
      const guardEffectiveness = Math.min(1.0, defenderGuard);
      finalDamage = Math.round(
        finalDamage * (1 - this.GUARD_REDUCTION * guardEffectiveness)
      );
    }

    // Ensure minimum damage for successful hits
    finalDamage = Math.max(1, finalDamage);

    return {
      hit: true,
      damage: finalDamage,
      vitalPoint: vitalPoint,
      effects,
      hitType,
      description,
      accuracy: effectiveAccuracy,
    };
  }

  /**
   * Determines if a vital point is successfully hit based on precision
   */
  private static isVitalPointHit(
    attackPosition: { x: number; y: number },
    vitalPoint: VitalPoint, // Uses imported VitalPoint
    accuracy: number
  ): boolean {
    const distance = this.calculateDistance(
      attackPosition,
      vitalPoint.position
    );

    // Smaller tolerance for more difficult vital points
    const effectiveTolerance =
      this.HIT_TOLERANCE * (1 - (vitalPoint.difficulty ?? 0.5) * 0.5); // Use difficulty from VitalPoint

    // Accuracy affects hit tolerance
    const adjustedTolerance = effectiveTolerance * (0.5 + accuracy * 0.5);

    return distance <= adjustedTolerance;
  }

  /**
   * Calculates hit success probability based on multiple factors
   */
  private static calculateHitSuccess(
    attackType: AttackType,
    accuracy: number,
    defenderGuard: number
  ): boolean {
    // Base hit chances by attack type
    const baseHitChance: Record<AttackType, number> = {
      punch: 0.85,
      kick: 0.75,
      elbow: 0.9,
      knee: 0.8,
      grapple: 0.95,
      throw: 0.7,
      pressure_point: 0.6,
      combination: 0.8,
      strike: 0.85,
    };

    const baseChance = baseHitChance[attackType] || 0.7;

    // Apply accuracy modifier
    const accuracyModifier = 0.5 + accuracy * 0.5; // 50-100% based on accuracy

    // Apply guard penalty
    const guardPenalty = defenderGuard * 0.4; // Up to 40% reduction

    const finalHitChance = baseChance * accuracyModifier - guardPenalty;

    // Roll for hit success
    return Math.random() < Math.max(0.1, Math.min(0.95, finalHitChance));
  }

  /**
   * Collision detection for different attack shapes
   */
  public static checkCollision(
    attackZone: CollisionZone,
    targetZone: CollisionZone
  ): boolean {
    if (attackZone.shape === "circle" && targetZone.shape === "circle") {
      return this.circleToCircleCollision(attackZone, targetZone);
    }

    if (attackZone.shape === "rectangle" && targetZone.shape === "rectangle") {
      return this.rectangleToRectangleCollision(attackZone, targetZone);
    }

    // Mixed collision types
    return this.mixedShapeCollision(attackZone, targetZone);
  }

  /**
   * Circle-to-circle collision detection
   */
  private static circleToCircleCollision(
    circle1: CollisionZone,
    circle2: CollisionZone
  ): boolean {
    const distance = this.calculateDistance(circle1.center, circle2.center);
    const radius1 = circle1.radius ?? 0;
    const radius2 = circle2.radius ?? 0;
    return distance <= radius1 + radius2;
  }

  /**
   * Rectangle-to-rectangle collision detection
   */
  private static rectangleToRectangleCollision(
    rect1: CollisionZone,
    rect2: CollisionZone
  ): boolean {
    if (!rect1.width || !rect1.height || !rect2.width || !rect2.height) {
      return false;
    }

    const rect1Left = rect1.center.x - rect1.width / 2;
    const rect1Right = rect1.center.x + rect1.width / 2;
    const rect1Top = rect1.center.y - rect1.height / 2;
    const rect1Bottom = rect1.center.y + rect1.height / 2;

    const rect2Left = rect2.center.x - rect2.width / 2;
    const rect2Right = rect2.center.x + rect2.width / 2;
    const rect2Top = rect2.center.y - rect2.height / 2;
    const rect2Bottom = rect2.center.y + rect2.height / 2;

    return !(
      rect1Right < rect2Left ||
      rect1Left > rect2Right ||
      rect1Bottom < rect2Top ||
      rect1Top > rect2Bottom
    );
  }

  /**
   * Mixed shape collision detection
   */
  private static mixedShapeCollision(
    shape1: CollisionZone,
    shape2: CollisionZone
  ): boolean {
    // Simplified approach: treat everything as circles using largest dimension
    const radius1 =
      shape1.radius || Math.max(shape1.width || 0, shape1.height || 0) / 2;
    const radius2 =
      shape2.radius || Math.max(shape2.width || 0, shape2.height || 0) / 2;

    const distance = this.calculateDistance(shape1.center, shape2.center);
    return distance <= radius1 + radius2;
  }

  /**
   * Calculate distance between two points
   */
  private static calculateDistance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  /**
   * Get hit feedback for Korean martial arts UI
   */
  public static getHitFeedback(hitResult: HitResult): {
    korean: string;
    english: string;
    color: number;
    intensity: number;
  } {
    if (!hitResult.hit) {
      return {
        korean: "빗나감",
        english: "Miss",
        color: 0x888888,
        intensity: 0,
      };
    }

    switch (hitResult.hitType) {
      case "critical":
        return {
          korean: "치명타!",
          english: "Critical Hit!",
          color: 0xff0000,
          intensity: 1.0,
        };
      case "vital":
        return {
          korean: "급소 공격!",
          english: "Vital Strike!",
          color: 0xffd700,
          intensity: 0.8,
        };
      default:
        return {
          korean: "명중",
          english: "Hit",
          color: 0x00ff00,
          intensity: 0.6,
        };
    }
  }
}

/**
 * Helper function for quick hit detection
 */
export function detectQuickHit(
  attackPos: { readonly x: number; readonly y: number },
  damage: number,
  accuracy: number = 0.8
): HitResult {
  // Returns local HitResult
  return HitDetectionSystem.detectHit({
    attackPosition: attackPos,
    attackType: "punch", // AttackType should be from types/index.ts
    accuracy,
    baseDamage: damage,
    attackerSkill: 0.5,
    defenderGuard: 0,
  });
}

/**
 * Specialized hit detection for Korean martial arts techniques
 */
export function detectKoreanTechniqueHit(
  technique: string,
  attackPos: { readonly x: number; readonly y: number },
  damage: number,
  accuracy: number
): HitResult {
  // Returns local HitResult
  // Map Korean techniques to attack types
  const techniqueToAttackType: Record<string, AttackType> = {
    // AttackType from types/index.ts
    천둥벽력: "punch",
    유수연타: "combination",
    화염지창: "pressure_point",
    벽력일섬: "kick",
    선풍연격: "combination",
    수류반격: "grapple",
    반석방어: "elbow",
    대지포옹: "throw",
  };

  const attackType = techniqueToAttackType[technique] || "punch";

  return HitDetectionSystem.detectHit({
    attackPosition: attackPos,
    attackType,
    accuracy,
    baseDamage: damage,
    attackerSkill: 0.7, // Higher skill for traditional techniques
    defenderGuard: 0,
  });
}

// Export types for use in other files - these are specific to this module or should be moved to types/index.ts
// export type { HitResult, AttackType, HitDetectionParams, CollisionZone };
