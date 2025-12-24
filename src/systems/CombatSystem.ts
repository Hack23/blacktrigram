import { BodyRegion } from "../types";
import { VitalPointCategory, VitalPointSeverity } from "../types/common";
import { applyDamageToBodyParts } from "./bodypart/BodyPartDamageIntegration";
import ConsciousnessSystem from "./combat/ConsciousnessSystem";
import {
  extractVitalPointCategory,
  isHeadTraumaHit,
} from "./combat/painConsciousnessUtils";
import PainResponseSystem, {
  ShockPainEffect,
} from "./combat/PainResponseSystem";
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

/**
 * Enhanced Combat System with Pain Response and Consciousness integration.
 *
 * Integrates realistic pain accumulation and consciousness tracking for
 * progressive combat impairment.
 */
export class CombatSystem implements CombatSystemInterface {
  private vitalPointSystem: VitalPointSystem;
  protected trigramSystem: TrigramSystem;
  private painSystem: PainResponseSystem;
  private consciousnessSystem: ConsciousnessSystem;

  // Track shock pain effects per player
  private shockPainEffects: Map<string, ShockPainEffect>;
  // Track last head trauma time per player for consciousness recovery
  private lastHeadTraumaTime: Map<string, number>;

  // Vital point severity thresholds
  private readonly SEVERITY_MAJOR_THRESHOLD = 30;
  private readonly SEVERITY_MODERATE_THRESHOLD = 20;

  constructor() {
    this.vitalPointSystem = new VitalPointSystem();
    this.trigramSystem = new TrigramSystem();
    this.painSystem = new PainResponseSystem();
    this.consciousnessSystem = new ConsciousnessSystem();
    this.shockPainEffects = new Map();
    this.lastHeadTraumaTime = new Map();
  }

  /**
   * Cleanup per-player combat state.
   *
   * Call this when a player permanently leaves the match or when
   * match-level cleanup is performed to avoid unbounded Map growth.
   *
   * @param playerId - ID of the player to cleanup
   *
   * @public
   * @korean 플레이어데이터정리
   */
  public cleanupPlayerData(playerId: string): void {
    this.shockPainEffects.delete(playerId);
    this.lastHeadTraumaTime.delete(playerId);
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
   * Enhanced with Pain Response and Consciousness System integration
   */
  applyCombatResult(
    result: CombatResult,
    attacker: PlayerState,
    defender: PlayerState
  ): { updatedAttacker: PlayerState; updatedDefender: PlayerState } {
    // Start with base result
    let { updatedAttacker, updatedDefender } = CombatSystem.applyCombatResult(
      result,
      attacker,
      defender
    );

    if (result.hit && result.damage > 0) {
      // Determine vital point category and severity from hit result
      const category = this.getVitalPointCategory(result);
      const severity = this.getVitalPointSeverity(result);

      // Apply pain from damage
      const { player: defenderWithPain, shockEffect: newShockEffect } =
        this.painSystem.applyPain(
          updatedDefender,
          result.damage,
          severity,
          category
        );
      updatedDefender = defenderWithPain;

      // Store shock pain effect if triggered
      if (newShockEffect) {
        this.shockPainEffects.set(updatedDefender.id, newShockEffect);
      }

      // Check for pain overload stun
      if (this.painSystem.shouldTriggerStun(updatedDefender)) {
        updatedDefender = {
          ...updatedDefender,
          isStunned: true,
        };
      }

      // Apply consciousness damage for head/neurological hits
      if (this.isHeadTrauma(result, category)) {
        updatedDefender = this.consciousnessSystem.applyDamage(
          updatedDefender,
          result.damage,
          category
        );

        // Track head trauma time for recovery gating
        this.lastHeadTraumaTime.set(updatedDefender.id, Date.now());

        // Check incapacitation threshold
        if (
          this.consciousnessSystem.isAtIncapacitationThreshold(updatedDefender)
        ) {
          updatedDefender = {
            ...updatedDefender,
            isStunned: true,
            // Could add helpless duration tracking here if needed
          };
        }
      }

      // Apply pain and consciousness effects to stats
      const currentShockEffect = this.shockPainEffects.get(updatedDefender.id);
      updatedDefender = this.painSystem.applyEffects(
        updatedDefender,
        currentShockEffect
      );
      updatedDefender = this.consciousnessSystem.applyEffects(updatedDefender);
    }

    return { updatedAttacker, updatedDefender };
  }

  /**
   * Determines if a hit caused head trauma (affects consciousness).
   *
   * @param result - Combat result
   * @param category - Vital point category
   * @returns True if hit should affect consciousness
   */
  private isHeadTrauma(
    result: CombatResult,
    category?: VitalPointCategory
  ): boolean {
    return isHeadTraumaHit(result, category);
  }

  /**
   * Extracts vital point category from combat result.
   *
   * @param result - Combat result
   * @returns Vital point category if available
   */
  private getVitalPointCategory(
    result: CombatResult
  ): VitalPointCategory | undefined {
    return extractVitalPointCategory(result);
  }

  /**
   * Extracts vital point severity from combat result.
   *
   * @param result - Combat result
   * @returns Vital point severity if critical hit
   */
  private getVitalPointSeverity(
    result: CombatResult
  ): VitalPointSeverity | undefined {
    if (result.vitalPointHit) {
      if (result.isCritical) {
        return VitalPointSeverity.CRITICAL;
      }
      if (result.damage > this.SEVERITY_MAJOR_THRESHOLD) {
        return VitalPointSeverity.MAJOR;
      }
      if (result.damage > this.SEVERITY_MODERATE_THRESHOLD) {
        return VitalPointSeverity.MODERATE;
      }
      return VitalPointSeverity.MINOR;
    }
    return undefined;
  }

  /**
   * Updates player states for recovery (pain dissipation, consciousness recovery).
   * Call this regularly in game loop.
   *
   * @param player - Player to update
   * @param deltaTime - Time elapsed since last update (ms)
   * @returns Updated player state
   */
  applyRecovery(player: PlayerState, deltaTime: number): PlayerState {
    let updatedPlayer = player;

    // Apply pain recovery
    updatedPlayer = this.painSystem.applyDissipation(updatedPlayer, deltaTime);

    // Apply consciousness recovery (only if enough time since head trauma)
    const lastTrauma = this.lastHeadTraumaTime.get(player.id);
    updatedPlayer = this.consciousnessSystem.applyRecovery(
      updatedPlayer,
      deltaTime,
      lastTrauma
    );

    // Clean up expired shock pain effects
    const shockEffect = this.shockPainEffects.get(player.id);
    if (shockEffect) {
      const elapsed = Date.now() - shockEffect.startTime;
      if (elapsed >= shockEffect.duration) {
        this.shockPainEffects.delete(player.id);
      }
    }

    return updatedPlayer;
  }

  /**
   * Static version for backwards compatibility with comprehensive effect application
   * Enhanced with Pain Response and Consciousness System integration
   * Updated to apply damage to body parts for 8-body-part health visualization
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
      // Determine body region from technique or use random distribution
      const bodyRegion = CombatSystem.getBodyRegionFromTechnique(
        result.technique
      );

      // Apply damage to body parts (this also updates aggregate health)
      updatedDefender = applyDamageToBodyParts(
        defender,
        result.damage,
        bodyRegion
      );

      // Update tracking stats (applyDamageToBodyParts already sets health)
      updatedDefender = {
        ...updatedDefender,
        totalDamageReceived:
          updatedDefender.totalDamageReceived + result.damage,
        hitsTaken: updatedDefender.hitsTaken + 1,
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
   * Determine body region from technique name or type
   *
   * **Korean**: 기술에서 신체 영역 결정
   *
   * @param technique - The technique used in the attack
   * @returns Body region to apply damage to
   */
  private static getBodyRegionFromTechnique(
    technique?: KoreanTechnique
  ): BodyRegion {
    if (!technique) {
      // Default to torso if no technique specified
      return BodyRegion.TORSO;
    }

    const techniqueName = (
      technique.name?.english ||
      technique.englishName ||
      ""
    ).toLowerCase();
    const techniqueId = technique.id?.toLowerCase() || "";

    // Head/face targeting techniques
    if (
      techniqueName.includes("head") ||
      techniqueName.includes("temple") ||
      techniqueName.includes("jaw") ||
      techniqueName.includes("face") ||
      techniqueId.includes("head") ||
      techniqueId.includes("skull")
    ) {
      return BodyRegion.HEAD;
    }

    // Neck targeting techniques
    if (
      techniqueName.includes("neck") ||
      techniqueName.includes("throat") ||
      techniqueName.includes("choke") ||
      techniqueId.includes("neck")
    ) {
      return BodyRegion.NECK;
    }

    // Leg targeting techniques
    if (
      techniqueName.includes("kick") ||
      techniqueName.includes("sweep") ||
      techniqueName.includes("leg") ||
      techniqueName.includes("knee") ||
      techniqueId.includes("kick") ||
      techniqueId.includes("leg")
    ) {
      // Randomly choose left or right leg
      return Math.random() < 0.5 ? BodyRegion.LEFT_LEG : BodyRegion.RIGHT_LEG;
    }

    // Arm targeting techniques
    if (
      techniqueName.includes("arm") ||
      techniqueName.includes("shoulder") ||
      techniqueName.includes("elbow") ||
      techniqueId.includes("arm")
    ) {
      // Randomly choose left or right arm
      return Math.random() < 0.5 ? BodyRegion.LEFT_ARM : BodyRegion.RIGHT_ARM;
    }

    // Punch/strike techniques typically target torso
    if (
      techniqueName.includes("punch") ||
      techniqueName.includes("strike") ||
      techniqueName.includes("jab") ||
      techniqueName.includes("cross") ||
      techniqueName.includes("hook") ||
      techniqueName.includes("uppercut")
    ) {
      // Mix of torso and head for punches
      return Math.random() < 0.7 ? BodyRegion.TORSO : BodyRegion.HEAD;
    }

    // Body/core targeting techniques
    if (
      techniqueName.includes("body") ||
      techniqueName.includes("solar") ||
      techniqueName.includes("liver") ||
      techniqueName.includes("ribs") ||
      techniqueName.includes("abdomen") ||
      techniqueId.includes("torso") ||
      techniqueId.includes("core")
    ) {
      return BodyRegion.TORSO;
    }

    // Default to torso for unmatched techniques
    return BodyRegion.TORSO;
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

