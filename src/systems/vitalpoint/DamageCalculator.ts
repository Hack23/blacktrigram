import type { VitalPoint, DamageResult } from "../../types/anatomy";
import type { PlayerState } from "../../types/player";
import type { StatusEffect } from "../../types/effects";
import type { KoreanTechnique } from "../../types/combat";
import { PlayerArchetype } from "../../types/enums";

export class DamageCalculator {
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
      (vitalPoint.baseDamage || vitalPoint.damage?.min || baseDamage) *
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

    let finalDamage = (technique.damage || 15) * archetypeModifier * accuracy;

    // Apply vital point multiplier if hitting a vital point
    if (vitalPoint) {
      finalDamage *=
        (vitalPoint.baseDamage || vitalPoint.damage?.min || 10) / 10;

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
}

export default DamageCalculator;
