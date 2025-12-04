import { VitalPointSeverity } from "../types/common";
import { CombatResult, CombatSystemInterface } from "./combat/types";
import { PlayerState } from "./player";
import {
  addEffectsToPlayer,
  getEffectModifiers,
  removeExpiredEffects,
} from "./PlayerEffectManager";
import { TRIGRAM_TECHNIQUES } from "./trigram";
import { TrigramSystem } from "./TrigramSystem";
import { StatusEffect } from "./types";
import { KoreanTechnique, VitalPointHitResult } from "./vitalpoint/types";
import { VitalPointSystem } from "./VitalPointSystem";

export class CombatSystem implements CombatSystemInterface {
  private vitalPointSystem: VitalPointSystem;
  protected trigramSystem: TrigramSystem;

  constructor() {
    this.vitalPointSystem = new VitalPointSystem();
    this.trigramSystem = new TrigramSystem();
  }

  /**
   * Fix: Update resolveAttack to match interface signature
   */
  resolveAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    targetedVitalPointId?: string
  ): CombatResult {
    const timestamp = Date.now();

    // Check if attacker can execute the technique
    if (!this.canExecuteTechnique(attacker, technique)) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp,
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // Fix: Use correct method signature
    const stanceEffectiveness = this.trigramSystem.calculateStanceEffectiveness(
      attacker.currentStance,
      defender.currentStance
    );

    // Calculate base hit chance
    const baseAccuracy = technique.accuracy * stanceEffectiveness;
    const hitRoll = Math.random();
    const hit = hitRoll <= baseAccuracy;

    if (!hit) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp,
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // Process vital point hit if targeted (with archetype parameters)
    let vitalPointResult: VitalPointHitResult | null = null;
    if (targetedVitalPointId) {
      vitalPointResult = this.processVitalPointHit(
        targetedVitalPointId,
        technique.damage ?? 15,
        attacker,
        defender
      );
    }

    // Calculate damage using the interface method
    const damageResult = this.calculateDamage(
      technique,
      attacker,
      defender,
      vitalPointResult ?? {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      }
    );

    // Check for critical hit
    const critRoll = Math.random();
    const isCritical = critRoll <= (technique.critChance ?? 0.1);

    return {
      hit: true,
      damage: damageResult.totalDamage,
      criticalHit: isCritical,
      vitalPointHit: vitalPointResult?.hit ?? false,
      effects: damageResult.effectsApplied,
      timestamp,
      technique,
      attacker,
      defender,
      success: true,
      isCritical: vitalPointResult?.hit ?? false,
      isBlocked: false,
    };
  }

  /**
   * Fix: Make applyCombatResult non-static instance method with effect application
   */
  applyCombatResult(
    result: CombatResult,
    attacker: PlayerState,
    defender: PlayerState
  ): { updatedAttacker: PlayerState; updatedDefender: PlayerState } {
    return CombatSystem.applyCombatResult(result, attacker, defender);
  }

  /**
   * Static version for backwards compatibility with comprehensive effect application
   */
  static applyCombatResult(
    result: CombatResult,
    attacker: PlayerState,
    defender: PlayerState
  ): { updatedAttacker: PlayerState; updatedDefender: PlayerState } {
    // Apply damage and effects
    let updatedDefender = defender;
    let updatedAttacker = attacker;

    if (result.hit) {
      // Apply damage
      updatedDefender = {
        ...defender,
        health: Math.max(0, defender.health - result.damage),
        totalDamageReceived: defender.totalDamageReceived + result.damage,
        hitsTaken: defender.hitsTaken + 1,
      };

      // Apply status effects from vital point hit
      if (result.effects && result.effects.length > 0) {
        updatedDefender = addEffectsToPlayer(updatedDefender, result.effects);
      }

      // Track vital point hits
      if (result.vitalPointHit) {
        updatedAttacker = {
          ...updatedAttacker,
          vitalPointHits: attacker.vitalPointHits + 1,
        };
      }

      // Track perfect strikes (high accuracy)
      if (result.isCritical) {
        updatedAttacker = {
          ...updatedAttacker,
          perfectStrikes: attacker.perfectStrikes + 1,
        };
      }
    }

    // Apply technique costs to attacker
    updatedAttacker = {
      ...updatedAttacker,
      ki: Math.max(0, attacker.ki - 5),
      stamina: Math.max(0, attacker.stamina - 10),
      totalDamageDealt:
        attacker.totalDamageDealt + (result.hit ? result.damage : 0),
      hitsLanded: attacker.hitsLanded + (result.hit ? 1 : 0),
    };

    return { updatedAttacker, updatedDefender };
  }

  /**
   * Fix: Add missing getAvailableTechniques method required by interface
   */
  getAvailableTechniques(player: PlayerState): readonly KoreanTechnique[] {
    const allTechniques = TRIGRAM_TECHNIQUES[player.currentStance] ?? [];

    // Filter techniques based on available resources using canExecuteTechnique
    return allTechniques.filter((technique) =>
      this.canExecuteTechnique(player, technique as KoreanTechnique)
    ) as readonly KoreanTechnique[];
  }

  /**
   * Check if attacker can execute technique
   */
  private canExecuteTechnique(
    player: PlayerState,
    technique: KoreanTechnique
  ): boolean {
    return (
      player.ki >= technique.kiCost &&
      player.stamina >= technique.staminaCost &&
      player.currentStance === technique.stance &&
      !player.isStunned
    );
  }

  /**
   * Static methods for backwards compatibility
   */
  static resolveAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique
  ): CombatResult {
    const instance = new CombatSystem();
    return instance.executeAttack(attacker, defender, technique);
  }

  /**
   * Check if a player is defeated
   */
  isPlayerDefeated(player: PlayerState): boolean {
    return player.health <= 0 || player.consciousness <= 0;
  }

  /**
   * Update player state over time with effect management
   */
  updatePlayerState(player: PlayerState, deltaTime: number): PlayerState {
    let updatedPlayer = { ...player };

    // Remove expired effects first
    updatedPlayer = removeExpiredEffects(updatedPlayer);

    // Get effect modifiers for resource regeneration
    const effectModifiers = getEffectModifiers(updatedPlayer);

    // Apply natural regeneration with effect modifiers
    const regenRate = deltaTime / 1000; // Convert to seconds

    // Ki regeneration (slower during combat) - affected by effects
    if (updatedPlayer.ki < updatedPlayer.maxKi) {
      updatedPlayer.ki = Math.min(
        updatedPlayer.maxKi,
        updatedPlayer.ki + regenRate * 2 * effectModifiers.kiRegen
      );
    }

    // Stamina regeneration - affected by effects
    if (updatedPlayer.stamina < updatedPlayer.maxStamina) {
      updatedPlayer.stamina = Math.min(
        updatedPlayer.maxStamina,
        updatedPlayer.stamina + regenRate * 3 * effectModifiers.staminaRegen
      );
    }

    // Health regeneration (very slow)
    if (
      updatedPlayer.health < updatedPlayer.maxHealth &&
      updatedPlayer.health > 0
    ) {
      updatedPlayer.health = Math.min(
        updatedPlayer.maxHealth,
        updatedPlayer.health + regenRate * 0.5
      );
    }

    // Clear temporary combat states
    const currentTime = Date.now();
    if (
      updatedPlayer.lastActionTime &&
      currentTime - updatedPlayer.lastActionTime > updatedPlayer.recoveryTime
    ) {
      updatedPlayer.isStunned = false;
      updatedPlayer.isCountering = false;
    }

    return updatedPlayer;
  }

  /**
   * Get combat statistics
   */
  getCombatStatistics(player: PlayerState): {
    healthPercent: number;
    kiPercent: number;
    staminaPercent: number;
    balancePercent: number;
  } {
    return {
      healthPercent: (player.health / player.maxHealth) * 100,
      kiPercent: (player.ki / player.maxKi) * 100,
      staminaPercent: (player.stamina / player.maxStamina) * 100,
      balancePercent: player.balance,
    };
  }

  /**
   * Fix: Integrate processVitalPointHit into the combat system with archetype parameters
   */
  private processVitalPointHit(
    vitalPointId: string,
    _baseDamage: number, // Unused but kept for interface compatibility
    attacker: PlayerState,
    defender: PlayerState
  ): VitalPointHitResult {
    const vitalPoint = this.vitalPointSystem.getVitalPointById(vitalPointId);

    if (!vitalPoint) {
      return {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };
    }

    // Use VitalPointSystem's processHit with full archetype support
    return this.vitalPointSystem.processHit(
      vitalPoint.position, // Use vital point position for hit calculation
      { width: 10, height: 10 }, // Standard hit box
      vitalPointId, // Targeted vital point
      undefined, // Use current hour from system
      attacker.archetype, // Attacker archetype for offensive modifiers
      defender.archetype // Defender archetype for defensive modifiers
    );
  }

  /**
   * Execute attack with technique
   */
  protected executeAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique
  ): CombatResult {
    const hitRoll = Math.random();
    const accuracy = technique.accuracy || 0.8;
    const hit = hitRoll <= accuracy;

    if (!hit) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // Calculate damage using the interface method
    const vitalPointHit: VitalPointHitResult = {
      hit: false,
      damage: 0,
      effects: [],
      severity: VitalPointSeverity.MINOR, // Use the enum directly
    };

    const damageResult = this.calculateDamage(
      technique,
      attacker,
      defender,
      vitalPointHit
    );

    return {
      hit: true,
      damage: damageResult.totalDamage,
      criticalHit: Math.random() < (technique.critChance || 0.1),
      vitalPointHit: false,
      effects: damageResult.effectsApplied,
      timestamp: Date.now(),
      technique,
      attacker,
      defender,
      success: true,
      isCritical: false,
      isBlocked: false,
    };
  }

  /**
   * Fix: Add missing calculateDamage method required by interface
   */
  calculateDamage(
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState,
    hitResult: VitalPointHitResult
  ): {
    baseDamage: number;
    modifierDamage: number;
    totalDamage: number;
    effectsApplied: readonly StatusEffect[];
    finalDefenderState?: Partial<PlayerState>;
  } {
    // Calculate base damage from technique
    const baseDamage = technique.damage || 15;

    // Apply attacker modifiers
    const attackerBonus = attacker.attackPower * 0.1;

    // Apply vital point modifiers if hit
    let vitalPointMultiplier = 1.0;
    if (hitResult.hit && hitResult.vitalPointHit) {
      // Use the correct property name
      const severityMultipliers: Record<VitalPointSeverity, number> = {
        [VitalPointSeverity.MINOR]: 1.1,
        [VitalPointSeverity.MODERATE]: 1.3,
        [VitalPointSeverity.MAJOR]: 1.6,
        [VitalPointSeverity.CRITICAL]: 2.0,
        [VitalPointSeverity.LETHAL]: 3.0,
      };

      // Use the severity property directly
      vitalPointMultiplier = severityMultipliers[hitResult.severity] ?? 1.0;
    }

    // Calculate total modifier damage
    const modifierDamage = attackerBonus * vitalPointMultiplier;

    // Apply defense reduction
    const defenseReduction = defender.defense * 0.05;
    const totalDamage = Math.max(
      1,
      baseDamage + modifierDamage - defenseReduction
    );

    // Combine effects from technique and vital point hit
    const effectsApplied = [...technique.effects, ...hitResult.effects];

    return {
      baseDamage,
      modifierDamage,
      totalDamage: Math.floor(totalDamage),
      effectsApplied,
      finalDefenderState: {
        health: Math.max(0, defender.health - totalDamage),
      },
    };
  }
}

/**
 * Creates a standardized CombatResult with all required fields
 * Ensures both 'critical' and 'criticalHit' are present for API compatibility
 */
export function createCombatResult(
  partialResult: Partial<CombatResult>
): CombatResult {
  // Set default values
  const result: CombatResult = {
    success: partialResult.success ?? false,
    damage: partialResult.damage ?? 0,
    isCritical: partialResult.isCritical ?? partialResult.criticalHit ?? false,
    hit: partialResult.hit ?? partialResult.success ?? false,
    isBlocked: partialResult.isBlocked ?? false,
    vitalPointHit: partialResult.vitalPointHit ?? false,
    effects: partialResult.effects ?? [],
    attacker: partialResult.attacker,
    defender: partialResult.defender,
    technique: partialResult.technique,
    // Always set criticalHit to match critical for consistency
    criticalHit: partialResult.isCritical ?? partialResult.criticalHit ?? false,
    timestamp: Date.now(),
  };

  return result;
}

export default CombatSystem;
