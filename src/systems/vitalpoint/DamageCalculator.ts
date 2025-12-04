import {
  PlayerArchetype,
  TrigramStance,
  VitalPointSeverity,
} from "../../types/common";
import { PlayerState } from "../player";
import { TrigramCalculator } from "../trigram/TrigramCalculator";
import { StatusEffect } from "../types";
import { calculateMeridianFlow } from "./KoreanAnatomy";
import { getMeridiansForVitalPoint } from "./MeridianVitalPointMapping";
import {
  DamageResult,
  KoreanTechnique,
  VitalPoint,
  VitalPointHitResult,
} from "./types";

export class DamageCalculator {
  /**
   * Vital point severity damage multipliers
   */
  private static readonly SEVERITY_MULTIPLIERS: Record<
    VitalPointSeverity,
    number
  > = {
    [VitalPointSeverity.MINOR]: 1.2,
    [VitalPointSeverity.MODERATE]: 1.5,
    [VitalPointSeverity.MAJOR]: 2.0,
    [VitalPointSeverity.CRITICAL]: 2.5,
    [VitalPointSeverity.LETHAL]: 3.0,
  };

  /**
   * Accuracy bonus scaling constants
   * Maps 0.0-1.0 accuracy to 0.8x-1.2x multiplier
   */
  private static readonly ACCURACY_MIN_MULTIPLIER = 0.8;
  private static readonly ACCURACY_RANGE = 0.4; // Range from min to max (1.2 - 0.8)

  /**
   * Calculate vital point damage with proper archetype bonuses
   */
  static calculateVitalPointDamage(
    vitalPoint: VitalPoint,
    baseDamage: number,
    attacker: PlayerState,
    accuracy: number
  ): DamageResult {
    const effects: StatusEffect[] = [];

    // Fix: Use static method call instead of this
    const archetypeModifier = DamageCalculator.getArchetypeModifier(
      attacker.archetype
    );
    const techniqueEffectiveness = accuracy;

    const finalDamage = Math.max(
      1,
      (vitalPoint.baseDamage ?? vitalPoint.damage?.min ?? baseDamage) *
        archetypeModifier *
        techniqueEffectiveness
    );

    // Create status effects from vital point
    vitalPoint.effects.forEach((effect) => {
      const statusEffect: StatusEffect = {
        id: `${effect.id}_${Date.now()}`,
        type: "weakened", // Map to valid EffectType
        intensity: "moderate" as any,
        duration: effect.duration,
        description: effect.description,
        stackable: effect.stackable,
        source: vitalPoint.id,
        startTime: Date.now(),
        endTime: Date.now() + effect.duration,
      };
      effects.push(statusEffect);
    });

    return {
      damage: finalDamage,
      effects,
      isCritical: accuracy > 0.9,
      isVitalPoint: true,
    };
  }

  /**
   * Fix: Add missing getArchetypeModifier method
   */
  static getArchetypeModifier(archetype: PlayerArchetype): number {
    switch (archetype) {
      case PlayerArchetype.MUSA:
        return 1.2; // Traditional warrior - strong base damage
      case PlayerArchetype.AMSALJA:
        return 1.5; // Assassin - high damage modifier
      case PlayerArchetype.HACKER:
        return 1.1; // Cyber warrior - precision over power
      case PlayerArchetype.JEONGBO_YOWON:
        return 1.1; // Intelligence operative - strategic damage
      case PlayerArchetype.JOJIK_POKRYEOKBAE:
        return 1.3; // Organized crime - brutal effectiveness
      default:
        return 1.0;
    }
  }

  /**
   * Calculate technique damage with vital point consideration
   */
  static calculateTechniqueDamage(
    technique: KoreanTechnique,
    attacker: PlayerState,
    vitalPoint: VitalPoint | null,
    accuracy: number
  ): DamageResult {
    // Fix: Remove unused baseDamage variable and use technique.damage directly
    const effects: StatusEffect[] = [];
    const archetypeModifier = DamageCalculator.getArchetypeModifier(
      attacker.archetype
    );

    let finalDamage = (technique.damage ?? 15) * archetypeModifier * accuracy;

    // Apply vital point multiplier if hitting a vital point
    if (vitalPoint) {
      finalDamage *=
        (vitalPoint.baseDamage ?? vitalPoint.damage?.min ?? 10) / 10;

      // Add vital point effects
      vitalPoint.effects.forEach((effect) => {
        const statusEffect: StatusEffect = {
          id: `${effect.id}_${Date.now()}`,
          type: "weakened",
          intensity: "moderate" as any,
          duration: effect.duration,
          description: effect.description,
          stackable: effect.stackable,
          source: vitalPoint.id,
          startTime: Date.now(),
          endTime: Date.now() + effect.duration,
        };
        effects.push(statusEffect);
      });
    }

    return {
      damage: Math.max(1, Math.floor(finalDamage)),
      effects,
      isCritical: accuracy > 0.8,
      isVitalPoint: !!vitalPoint,
    };
  }

  /**
   * Calculate damage reduction from defense
   */
  static calculateDamageReduction(
    incomingDamage: number,
    defenderDefense: number,
    isBlocking: boolean = false
  ): number {
    const blockMultiplier = isBlocking ? 0.5 : 1.0;
    const defenseReduction = Math.min(0.8, defenderDefense / 200); // Max 80% reduction

    return Math.max(
      1,
      incomingDamage * (1 - defenseReduction) * blockMultiplier
    );
  }

  /**
   * Calculate critical hit chance
   */
  static calculateCriticalChance(
    baseCritChance: number,
    attacker: PlayerState,
    technique: KoreanTechnique
  ): number {
    const archetypeBonus =
      DamageCalculator.getArchetypeModifier(attacker.archetype) * 0.1;
    const techniqueBonus = (technique.critChance || 0.1) * 0.5;

    return Math.min(0.95, baseCritChance + archetypeBonus + techniqueBonus);
  }

  /**
   * Calculate comprehensive vital point damage with all modifiers.
   *
   * **Korean**: 종합 급소 피해 계산 (Comprehensive Vital Point Damage Calculation)
   *
   * Integrates all damage modifiers including:
   * - Base damage from attacker strength and technique power
   * - Stance effectiveness (攻克关系)
   * - Vital point severity multipliers (1.5x-3.0x)
   * - Accuracy bonus (0.8x-1.2x)
   * - Meridian flow bonus (1.0x-1.3x at peak hours)
   * - Time-of-day bonus (+20% for Dark Ops techniques at night)
   * - Archetype-specific bonuses
   * - Critical hit multiplier (2x when accuracy > 0.9)
   * - Damage variance (±10% randomness)
   * - Defense reduction
   *
   * ## Damage Formula
   *
   * ```typescript
   * finalDamage =
   *   baseDamage ×
   *   stanceEffectiveness ×
   *   vitalPointMultiplier ×
   *   accuracyBonus ×
   *   meridianBonus ×
   *   timeBonus ×
   *   archetypeBonus ×
   *   criticalMultiplier ×
   *   variance ×
   *   defenseReduction
   * ```
   *
   * @param attacker - Attacking player state
   * @param defender - Defending player state
   * @param technique - Korean martial arts technique being used
   * @param vitalPointHit - Result of vital point hit detection
   * @param currentHour - Current hour of day (0-23) for meridian flow
   * @param meridianStates - Current meridian disruption states (0=blocked, 1=normal)
   * @returns Comprehensive damage result with all modifiers applied
   *
   * @example
   * ```typescript
   * const result = DamageCalculator.calculateEnhancedVitalPointDamage(
   *   attackerState,
   *   defenderState,
   *   technique,
   *   vitalPointHitResult,
   *   2, // 2 AM - liver meridian peak
   *   { liver: 1.0, gallbladder: 0.8 }
   * );
   * console.log(`Final damage: ${result.damage}`);
   * console.log(`Critical hit: ${result.isCritical}`);
   * ```
   *
   * @public
   * @korean 종합급소피해계산
   */
  static calculateEnhancedVitalPointDamage(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    vitalPointHit: VitalPointHitResult,
    currentHour: number,
    meridianStates: Record<string, number>
  ): DamageResult {
    // 1. Base damage from technique
    const attackerStrength = attacker.attackPower || 50;
    const techniquePower = technique.damage || 15;
    const baseDamage = attackerStrength * (techniquePower / 10);

    // 2. Stance effectiveness (攻克关系)
    const stanceEffectiveness = TrigramCalculator.calculateStanceEffectiveness(
      attacker.currentStance,
      defender.currentStance
    );

    // 3. Vital point severity multiplier
    const vitalPointMultiplier = vitalPointHit.vitalPointHit
      ? DamageCalculator.SEVERITY_MULTIPLIERS[vitalPointHit.severity] ?? 1
      : 1;

    // 4. Accuracy bonus (better aim = more damage)
    // Maps 0.0-1.0 accuracy to 0.8x-1.2x multiplier
    const accuracy = vitalPointHit.accuracy ?? 0.5;
    const accuracyBonus =
      DamageCalculator.ACCURACY_MIN_MULTIPLIER +
      accuracy * DamageCalculator.ACCURACY_RANGE;

    // 5. Meridian flow bonus
    const meridianBonus = DamageCalculator.calculateMeridianDamageBonus(
      vitalPointHit.vitalPointHit?.id ?? "",
      currentHour,
      meridianStates
    );

    // 6. Time-of-day bonus (Dark Ops techniques at night)
    const timeBonus = DamageCalculator.calculateTimeBonus(
      technique,
      currentHour
    );

    // 7. Archetype-specific bonus
    const archetypeBonus = DamageCalculator.getArchetypeDamageBonus(
      attacker.archetype,
      technique,
      vitalPointHit.vitalPointHit
    );

    // 8. Critical hit (accuracy > 0.9)
    const criticalMultiplier = accuracy > 0.9 ? 2.0 : 1.0;
    const isCritical = accuracy > 0.9;

    // 9. Calculate total damage before defense
    let totalDamage =
      baseDamage *
      stanceEffectiveness *
      vitalPointMultiplier *
      accuracyBonus *
      meridianBonus *
      timeBonus *
      archetypeBonus *
      criticalMultiplier;

    // 10. Add damage variance (±10%)
    const variance = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    totalDamage *= variance;

    // 11. Apply defense reduction using existing method for consistency
    const defenderDefense = defender.defense || 0;
    const finalDamage = DamageCalculator.calculateDamageReduction(
      totalDamage,
      defenderDefense,
      false
    );

    // 12. Combine effects from vital point hit
    const effects = vitalPointHit.effects || [];

    return {
      damage: Math.max(1, finalDamage), // Minimum 1 damage
      effects,
      isCritical,
      isVitalPoint: !!vitalPointHit.vitalPointHit,
    };
  }

  /**
   * Calculate meridian flow damage bonus based on time of day.
   *
   * **Korean**: 경락 유효성 피해 보너스 계산
   *
   * Calculates bonus damage when striking vital points during their peak
   * meridian flow hours. Peak flow provides +30% damage bonus.
   *
   * @param vitalPointId - ID of the vital point being struck
   * @param currentHour - Current hour of day (0-23)
   * @param meridianStates - Current meridian disruption states
   * @returns Damage multiplier (1.0-1.3)
   *
   * @private
   * @korean 경락유효성피해보너스계산
   */
  private static calculateMeridianDamageBonus(
    vitalPointId: string,
    currentHour: number,
    meridianStates: Record<string, number>
  ): number {
    if (!vitalPointId) return 1;

    const relatedMeridians = getMeridiansForVitalPoint(vitalPointId);
    let maxBonus = 1.0;

    for (const meridianId of relatedMeridians) {
      const flow = calculateMeridianFlow(meridianId, currentHour);
      const state = meridianStates[meridianId] ?? 1.0;

      // Peak flow (>0.9) with normal state gives +30% bonus
      // flow ranges from 0.7 to 1.3, state from 0 (blocked) to 1 (normal)
      const effectiveFlow = flow * state;
      if (effectiveFlow > 0.9) {
        // Bonus scales linearly from 1.0 (no bonus) at effectiveFlow = 0.9
        // to 1.3 (maximum 30% bonus) at effectiveFlow = 1.3:
        //   bonus = 1.0 + ((effectiveFlow - 0.9) / 0.4) * 0.3
        const bonus = 1.0 + ((effectiveFlow - 0.9) / 0.4) * 0.3;
        maxBonus = Math.max(maxBonus, Math.min(1.3, bonus));
      }
    }

    return maxBonus;
  }

  /**
   * Calculate time-of-day bonus for Dark Ops techniques.
   *
   * **Korean**: 시간대 보너스 계산
   *
   * Dark Ops techniques gain +20% damage at night (20:00-05:59)
   * to reflect tactical advantage of darkness.
   *
   * @param technique - Technique being used
   * @param currentHour - Current hour of day (0-23)
   * @returns Time bonus multiplier (1.0 or 1.2)
   *
   * @private
   * @korean 시간대보너스계산
   */
  private static calculateTimeBonus(
    technique: KoreanTechnique,
    currentHour: number
  ): number {
    // Dark Ops techniques get +20% at night (20:00-05:59)
    // Check if technique has dark_ops or stealth in its ID or type
    const isDarkOpsTechnique =
      technique.id.includes("dark_ops") ||
      technique.id.includes("stealth") ||
      technique.id.includes("shadow") ||
      technique.id.includes("night");

    if (isDarkOpsTechnique) {
      // Night hours: 20:00 through 05:59 (6 AM is considered daylight)
      if (currentHour >= 20 || currentHour < 6) {
        return 1.2;
      }
    }
    return 1.0;
  }

  /**
   * Get archetype-specific damage bonus for technique and vital point.
   *
   * **Korean**: 원형 특화 피해 보너스
   *
   * Each archetype has specialized bonuses for different techniques
   * and vital point categories:
   *
   * - **무사 (Musa)**: +20% with 건 (Geon) stance techniques
   * - **암살자 (Amsalja)**: +30% on neurological vital points
   * - **해커 (Hacker)**: +15% baseline precision bonus
   * - **정보요원 (Jeongbo)**: +25% on vascular vital points
   * - **조직폭력배 (Jojik)**: +20% on dirty/ruthless techniques
   *
   * @param archetype - Attacker's archetype
   * @param technique - Technique being used
   * @param vitalPoint - Vital point being struck (optional)
   * @returns Archetype damage multiplier (1.0-1.5)
   *
   * @private
   * @korean 원형특화피해보너스
   */
  private static getArchetypeDamageBonus(
    archetype: PlayerArchetype,
    technique: KoreanTechnique,
    vitalPoint?: VitalPoint
  ): number {
    // Base archetype modifier
    let bonus = DamageCalculator.getArchetypeModifier(archetype);

    // Additional bonuses based on technique-archetype synergy
    switch (archetype) {
      case PlayerArchetype.MUSA:
        // Musa gets bonus with Geon (Heaven) stance techniques
        if (technique.stance === TrigramStance.GEON) {
          bonus *= 1.2;
        }
        break;

      case PlayerArchetype.AMSALJA:
        // Assassin gets bonus on neurological vital points
        if (vitalPoint?.category === "neurological") {
          bonus *= 1.3;
        }
        break;

      case PlayerArchetype.HACKER:
        // Hacker gets consistent precision bonus
        bonus *= 1.15;
        break;

      case PlayerArchetype.JEONGBO_YOWON:
        // Intelligence operative gets bonus on vascular targets
        if (vitalPoint?.category === "vascular") {
          bonus *= 1.25;
        }
        break;

      case PlayerArchetype.JOJIK_POKRYEOKBAE:
        // Organized crime gets bonus on ruthless techniques
        // Check for keywords in technique ID
        if (
          technique.id.includes("ruthless") ||
          technique.id.includes("brutal") ||
          technique.id.includes("dirty")
        ) {
          bonus *= 1.2;
        }
        break;
    }

    // Cap maximum bonus at 1.5x
    return Math.min(1.5, bonus);
  }
}

export default DamageCalculator;
