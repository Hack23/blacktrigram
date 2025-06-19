/**
 * @fileoverview Realistic Damage Calculation for Korean Martial Arts
 * @description Authentic damage calculation based on vital point targeting and Korean martial arts principles
 */

import type { KoreanTechnique } from "../../types/combat";
import type { PlayerState } from "../../types/player";
import type { VitalPoint } from "../../types/anatomy";
import type { HitEffect } from "../../types/effects";
import { KoreanVitalPoints } from "./KoreanVitalPoints";
import { HitEffectType } from "../../types/effects";

export interface DamageResult {
  readonly totalDamage: number;
  readonly isCritical: boolean;
  readonly vitalPointsHit: readonly VitalPoint[];
  readonly effects: readonly HitEffect[];
  readonly stunChance: number;
  readonly consciousnessLoss: number;
  readonly balanceLoss: number;
  readonly techniqueEffectiveness: number;
}

export class DamageCalculator {
  constructor(private readonly vitalPoints: KoreanVitalPoints) {}

  /**
   * Calculate damage with authentic Korean martial arts mechanics
   */
  public async calculateDamage(
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState,
    stanceMultiplier: number,
    targetPosition?: { x: number; y: number }
  ): Promise<DamageResult> {
    // Base damage calculation
    let baseDamage = technique.damage;
    if (technique.damageRange) {
      const randomFactor = Math.random();
      baseDamage =
        technique.damageRange.min +
        (technique.damageRange.max - technique.damageRange.min) * randomFactor;
    }

    // Apply stance effectiveness
    baseDamage *= stanceMultiplier;

    // Attacker modifiers
    const attackerCondition = this.calculateAttackerCondition(attacker);
    baseDamage *= attackerCondition;

    // Vital point targeting
    const vitalPointResult = this.calculateVitalPointDamage(
      baseDamage,
      technique,
      targetPosition
    );

    // Defense calculation
    const defenseReduction = this.calculateDefense(defender, technique);
    const finalDamage = Math.max(
      1,
      vitalPointResult.damage * (1 - defenseReduction)
    );

    // Critical hit determination
    const isCritical = this.determineCriticalHit(
      technique,
      attacker,
      vitalPointResult.vitalPointsHit
    );

    // Apply critical multiplier
    const criticalMultiplier = isCritical
      ? technique.critMultiplier || 1.5
      : 1.0;
    const totalDamage = Math.round(finalDamage * criticalMultiplier);

    // Generate effects
    const effects = this.generateHitEffects(
      technique,
      vitalPointResult.vitalPointsHit,
      isCritical,
      totalDamage
    );

    return {
      totalDamage,
      isCritical,
      vitalPointsHit: vitalPointResult.vitalPointsHit,
      effects,
      stunChance: vitalPointResult.stunChance,
      consciousnessLoss: vitalPointResult.consciousnessLoss,
      balanceLoss: vitalPointResult.balanceLoss,
      techniqueEffectiveness: stanceMultiplier * attackerCondition,
    };
  }

  /**
   * Calculate attacker's current condition affecting damage output
   */
  private calculateAttackerCondition(attacker: PlayerState): number {
    const healthCondition = attacker.health / attacker.maxHealth;
    const staminaCondition = attacker.stamina / attacker.maxStamina;
    const balanceCondition = attacker.balance / 100;
    const consciousnessCondition = attacker.consciousness / 100;

    // Korean martial arts emphasizes mind-body unity
    const mentalState = (consciousnessCondition + balanceCondition) / 2;
    const physicalState = (healthCondition + staminaCondition) / 2;

    return 0.5 + (mentalState * 0.3 + physicalState * 0.7) * 0.5;
  }

  /**
   * Calculate vital point targeting damage
   */
  private calculateVitalPointDamage(
    baseDamage: number,
    technique: KoreanTechnique,
    targetPosition?: { x: number; y: number }
  ): {
    damage: number;
    vitalPointsHit: VitalPoint[];
    stunChance: number;
    consciousnessLoss: number;
    balanceLoss: number;
  } {
    if (!targetPosition) {
      // Random body targeting
      return {
        damage: baseDamage,
        vitalPointsHit: [],
        stunChance: 0.1,
        consciousnessLoss: 0.05,
        balanceLoss: 0.1,
      };
    }

    // Find vital point near target
    const vitalPoint = this.vitalPoints.findNearestVitalPoint(
      targetPosition.x,
      targetPosition.y,
      0.5, // Default depth
      0.15 // Search radius
    );

    if (!vitalPoint) {
      return {
        damage: baseDamage,
        vitalPointsHit: [],
        stunChance: 0.1,
        consciousnessLoss: 0.05,
        balanceLoss: 0.1,
      };
    }

    // Calculate accuracy for vital point hit
    const distance = Math.sqrt(
      Math.pow(vitalPoint.location.x - targetPosition.x, 2) +
        Math.pow(vitalPoint.location.y - targetPosition.y, 2)
    );
    const accuracy = Math.max(0.1, 1 - distance * 10);

    // Apply vital point damage calculation
    const vitalDamage = this.vitalPoints.calculateVitalPointDamage(
      vitalPoint,
      baseDamage,
      accuracy
    );

    return {
      damage: vitalDamage.totalDamage,
      vitalPointsHit: [vitalPoint],
      stunChance: vitalDamage.stunChance,
      consciousnessLoss: vitalDamage.consciousnessLoss,
      balanceLoss: vitalDamage.balanceLoss,
    };
  }

  /**
   * Calculate defender's damage reduction
   */
  private calculateDefense(
    defender: PlayerState,
    technique: KoreanTechnique
  ): number {
    let defenseValue = defender.defense || 0;

    // Blocking bonus
    if (defender.isBlocking) {
      defenseValue *= 1.8;
    }

    // Stance defensive bonuses would be applied here
    // (Implementation depends on stance system)

    // Counter-attack preparation
    if (defender.isCountering) {
      defenseValue *= 1.3;
    }

    // Health and consciousness affect defense
    const defenderCondition = Math.min(
      defender.health / defender.maxHealth,
      defender.consciousness / 100
    );
    defenseValue *= defenderCondition;

    // Convert defense to damage reduction percentage
    return Math.min(0.8, defenseValue / (defenseValue + 50));
  }

  /**
   * Determine if attack is critical hit
   */
  private determineCriticalHit(
    technique: KoreanTechnique,
    attacker: PlayerState,
    vitalPointsHit: readonly VitalPoint[]
  ): boolean {
    let critChance = technique.critChance || 0.1;

    // Vital point hits increase critical chance
    if (vitalPointsHit.length > 0) {
      critChance *= 2.0;
    }

    // Attacker condition affects critical chance
    const attackerCondition = this.calculateAttackerCondition(attacker);
    critChance *= attackerCondition;

    // Perfect balance increases critical chance
    if (attacker.balance >= 95) {
      critChance *= 1.2;
    }

    return Math.random() <= critChance;
  }

  /**
   * Generate hit effects for visual feedback
   */
  private generateHitEffects(
    technique: KoreanTechnique,
    vitalPointsHit: readonly VitalPoint[],
    isCritical: boolean,
    damage: number
  ): HitEffect[] {
    const effects: HitEffect[] = [];
    const timestamp = Date.now();

    // Main hit effect
    effects.push({
      id: `hit_${timestamp}`,
      type: isCritical ? HitEffectType.CRITICAL : HitEffectType.HIT_NORMAL,
      attackerId: "attacker",
      defenderId: "defender",
      timestamp,
      duration: isCritical ? 1500 : 1000,
      position: { x: 0, y: 0 }, // Will be set by caller
      intensity: isCritical ? 1.5 : 1.0,
      startTime: timestamp,
      text: isCritical ? "치명타!" : technique.name.korean,
    });

    // Vital point hit effects
    vitalPointsHit.forEach((vitalPoint, index) => {
      effects.push({
        id: `vital_${timestamp}_${index}`,
        type: HitEffectType.VITAL_POINT,
        attackerId: "attacker",
        defenderId: "defender",
        timestamp,
        duration: 2000,
        position: { x: 0, y: 0 },
        intensity: 1.2,
        startTime: timestamp,
        text: vitalPoint.name.korean,
      });
    });

    return effects;
  }
}

export default DamageCalculator;
