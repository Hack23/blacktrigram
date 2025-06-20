import type {
  CombatSystemInterface,
  VitalPointHitResult,
} from "../types/systems";
import type { PlayerState, CombatResult } from "../types";
import type { StatusEffect } from "../types/effects";
import { VitalPointSystem } from "./VitalPointSystem";
import { TrigramSystem } from "./TrigramSystem";
import { VitalPointSeverity } from "../types/enums";
import { TRIGRAM_TECHNIQUES } from "../types/constants";
import type { KoreanTechnique } from "../types/combat";

export class CombatSystem implements CombatSystemInterface {
  private vitalPointSystem: VitalPointSystem;
  protected trigramSystem: TrigramSystem; // Fix: Change from private to protected

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
    technique: KoreanTechnique, // Fix: Add technique parameter
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
        isCritical : false,
        isBlocked: false,
      };
    }

    // Fix: Use correct method signature - TrigramSystem.calculateStanceEffectiveness only takes 2 parameters
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
        isCritical : false,
        isBlocked: false,
      };
    }

    // Process vital point hit if targeted
    let vitalPointResult: VitalPointHitResult | null = null;
    if (targetedVitalPointId) {
      vitalPointResult = this.processVitalPointHit(
        targetedVitalPointId,
        technique.damage || 15,
        attacker
      );
    }

    // Calculate damage using the interface method
    const damageResult = this.calculateDamage(
      technique,
      attacker,
      defender,
      vitalPointResult || {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      }
    );

    // Check for critical hit
    const critRoll = Math.random();
    const isCritical = critRoll <= (technique.critChance || 0.1);

    return {
      hit: true,
      damage: damageResult.totalDamage,
      criticalHit: isCritical,
      vitalPointHit: vitalPointResult?.hit || false,
      effects: damageResult.effectsApplied,
      timestamp,
      technique,
      attacker,
      defender,
      success: true,
      isCritical : vitalPointResult?.hit || false,
      isBlocked: false,
    };
  }

  /**
   * Fix: Make applyCombatResult non-static instance method
   */
  applyCombatResult(
    result: CombatResult,
    attacker: PlayerState,
    defender: PlayerState
  ): { updatedAttacker: PlayerState; updatedDefender: PlayerState } {
    return CombatSystem.applyCombatResult(result, attacker, defender);
  }

  /**
   * Static version for backwards compatibility
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
      updatedDefender = {
        ...defender,
        health: Math.max(0, defender.health - result.damage),
        // Fix: Use optional chaining for missing properties
        totalDamageReceived: (defender.totalDamageReceived || 0) + result.damage,
        hitsTaken: (defender.hitsTaken || 0) + 1,
      };
    }

    // Apply technique costs to attacker
    updatedAttacker = {
      ...attacker,
      ki: Math.max(0, attacker.ki - 5),
      stamina: Math.max(0, attacker.stamina - 10),
      totalDamageDealt:
        attacker.totalDamageDealt + (result.hit ? result.damage : 0),
      hitsLanded: (attacker.hitsLanded || 0) + (result.hit ? 1 : 0),
    };

    return { updatedAttacker, updatedDefender };
  }

  /**
   * Fix: Add missing getAvailableTechniques method required by interface
   */
  getAvailableTechniques(player: PlayerState): readonly KoreanTechnique[] {
    const allTechniques = TRIGRAM_TECHNIQUES[player.currentStance] || [];

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
   * Update player state over time
   */
  updatePlayerState(player: PlayerState, deltaTime: number): PlayerState {
    let updatedPlayer = { ...player };

    // Apply natural regeneration
    const regenRate = deltaTime / 1000; // Convert to seconds

    // Ki regeneration (slower during combat)
    if (updatedPlayer.ki < updatedPlayer.maxKi) {
      updatedPlayer.ki = Math.min(
        updatedPlayer.maxKi,
        updatedPlayer.ki + regenRate * 2
      );
    }

    // Stamina regeneration
    if (updatedPlayer.stamina < updatedPlayer.maxStamina) {
      updatedPlayer.stamina = Math.min(
        updatedPlayer.maxStamina,
        updatedPlayer.stamina + regenRate * 3
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

    // Update status effects
    const currentTime = Date.now();
    updatedPlayer.statusEffects = updatedPlayer.statusEffects.filter(
      (effect) => effect.endTime > currentTime
    );

    // Clear temporary combat states
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
   * Fix: Integrate processVitalPointHit into the combat system
   */
  private processVitalPointHit(
    vitalPointId: string,
    baseDamage: number,
    attacker: PlayerState
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

    // Fix: Use available methods instead of non-existent calculateVitalPointDamage
    // Calculate damage based on vital point properties and attacker archetype
    const archetypeModifier = this.getArchetypeVitalPointModifier(
      attacker.archetype,
      vitalPoint
    );
    const damage = Math.floor(baseDamage * archetypeModifier);

    return {
      hit: true,
      vitalPoint,
      damage,
      effects: vitalPoint.effects.map((effect) => ({
        id: `${effect.id}_${Date.now()}`,
        type: effect.type as any,
        intensity: effect.intensity as any,
        duration: effect.duration,
        description: effect.description,
        stackable: effect.stackable,
        source: vitalPointId,
        startTime: Date.now(),
        endTime: Date.now() + effect.duration,
      })),
      severity: vitalPoint.severity,
    };
  }

  /**
   * Helper method to get archetype-specific vital point damage modifier
   */
  private getArchetypeVitalPointModifier(
    archetype: any,
    vitalPoint: any
  ): number {
    // Simple archetype-based modifiers
    const baseModifier = 1.0;

    // Different archetypes have different specializations
    switch (archetype) {
      case "amsalja": // Shadow Assassin - better at nerve strikes
        return vitalPoint.category === "neurological" ? 1.3 : baseModifier;
      case "musa": // Traditional Warrior - better at bone strikes
        return vitalPoint.category === "skeletal" ? 1.2 : baseModifier;
      case "hacker": // Cyber Warrior - better at nerve disruption
        return vitalPoint.category === "neurological" ? 1.1 : baseModifier;
      default:
        return baseModifier;
    }
  }

  /**
   * Execute attack with technique
   */
  private executeAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique // Fix: Add technique parameter
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
        isCritical : false,
        isBlocked: false,
      };
    }

    // Calculate damage using the interface method
    const vitalPointHit: VitalPointHitResult = {
      hit: false,
      damage: 0,
      effects: [],
      severity: "minor" as any, // Use any to satisfy enum type
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
      isCritical : false,
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
    if (hitResult.hit && hitResult.vitalPoint) {
      const severityMultipliers = {
        minor: 1.1,
        moderate: 1.3,
        major: 1.6,
        critical: 2.0,
        lethal: 3.0,
      };
      vitalPointMultiplier = severityMultipliers[hitResult.severity] || 1.0;
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

  private updateDefender(
    defender: PlayerState,
    result: CombatResult
  ): PlayerState {
    if (!result.hit) return defender;

    return {
      ...defender,
      health: Math.max(0, defender.health - result.damage),
      // Fix: Use optional chaining for missing properties
      totalDamageReceived: (defender.totalDamageReceived || 0) + result.damage,
      hitsTaken: (defender.hitsTaken || 0) + 1,
    };
  }

  private updateAttacker(
    attacker: PlayerState,
    result: CombatResult
  ): PlayerState {
    return {
      ...attacker,
      // Fix: Use optional chaining for missing properties
      totalDamageDealt: (attacker.totalDamageDealt || 0) + (result.hit ? result.damage : 0),
      hitsLanded: (attacker.hitsLanded || 0) + (result.hit ? 1 : 0),
    };
  }

  public canPerformAction(player: PlayerState): boolean {
    return (
      player.isAlive &&
      player.stamina > 0 &&
      // Fix: Use optional chaining for missing properties
      !(player.isStunned ?? false)
    );
  }

  private updatePlayerStates(players: PlayerState[]): PlayerState[] {
    const currentTime = Date.now();
    
    return players.map((player) => {
      const updatedPlayer = { ...player };

      // Auto-recovery from stun and other temporary states
      // Fix: Use optional chaining for missing properties
      if (
        (updatedPlayer.lastActionTime || 0) &&
        currentTime - (updatedPlayer.lastActionTime || 0) > (updatedPlayer.recoveryTime || 1000)
      ) {
        // Clear temporary states
        return {
          ...updatedPlayer,
          isStunned: false,
          isCountering: false,
        };
      }

      return updatedPlayer;
    });
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
    timestamp: Date.now(), // <-- Add this property
  };

  return result;
}

export default CombatSystem;
