import type {
  PlayerState,
  KoreanTechnique,
  CombatResult,
  PlayerArchetype,
  TrigramStance,
  CombatState, // Added CombatState
  VitalPointHitResult,
} from "../types";
import { STANCE_EFFECTIVENESS_MATRIX } from "../types/constants";
import {
  executeTechnique as executeTechniqueUtil, // Renamed to avoid conflict
  isPlayerCapacitated,
  calculateArchetypeDamage,
} from "../utils/playerUtils";

export class CombatSystem {
  /**
   * Execute a full attack sequence using playerUtils' executeTechnique.
   */
  public static async executeAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    targetPoint?: string | null
  ): Promise<CombatResult> {
    // Use playerUtils' executeTechnique for core logic
    const { hitResult } = executeTechniqueUtil(
      // Use renamed util
      attacker,
      defender,
      technique,
      targetPoint
    );
    // Optionally, update states in your game loop with updatedAttacker/updatedDefender
    return hitResult;
  }

  /**
   * Calculate stance effectiveness matrix using constants.
   */
  public static calculateStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return STANCE_EFFECTIVENESS_MATRIX[attackerStance]?.[defenderStance] ?? 1.0;
  }

  /**
   * Calculate technique damage and effects using playerUtils.
   */
  public static calculateTechnique(
    // This seems more like a stateless calculation for UI or prediction
    technique: KoreanTechnique,
    archetype: PlayerArchetype
  ): CombatResult {
    // Use playerUtils to get archetype damage
    const baseDamage =
      technique.damage ??
      (technique.damageRange
        ? (technique.damageRange.min + technique.damageRange.max) / 2
        : 10);
    const damage = calculateArchetypeDamage(archetype, baseDamage);
    const isCritical =
      Math.random() < (technique.critChance ?? 0.1) ||
      (!!technique.critMultiplier && Math.random() < 0.05); // Ensure boolean evaluation

    return {
      attacker: archetype,
      defender: archetype, // Placeholder, defender not known in this context
      damage: isCritical
        ? Math.round(damage * (technique.critMultiplier ?? 1.5))
        : Math.round(damage),
      hit: true, // Assumes hit for calculation purposes
      critical: isCritical,
      techniqueUsed: technique,
      effects: technique.effects || [],
      vitalPointsHit: [],
      defenderDamaged: true, // Assumes damage for calculation
      damageType: technique.damageType || "blunt",
      isVitalPoint: false, // Cannot determine without target
      newState: "ready" as CombatState, // Placeholder
      damagePrevented: 0,
      staminaUsed: technique.staminaCost || 0,
      kiUsed: technique.kiCost || 0,
      attackerStance: technique.stance || "geon", // Default if not specified
      defenderStance: "geon", // Placeholder
      painLevel: damage * 0.5, // Example
      consciousnessImpact: damage * 0.1, // Example
      balanceEffect: 0,
      bloodLoss: 0,
      stunDuration: isCritical ? 1000 : 0,
      statusEffects: technique.effects || [],
      hitType: isCritical ? "critical" : "normal",
      effectiveness: 1.0, // Placeholder
      hitPosition: { x: 0, y: 0 }, // Placeholder
    };
  }

  /**
   * Check win condition based on incapacitation, pain, or consciousness.
   */
  static checkWinCondition(
    players: readonly [PlayerState, PlayerState]
  ): string | null {
    const [player1, player2] = players;
    if (!isPlayerCapacitated(player1)) return player2.id;
    if (!isPlayerCapacitated(player2)) return player1.id;
    return null;
  }

  /**
   * Determine the winner of a combat round based on player states.
   */
  static determineRoundWinner(
    players: readonly [PlayerState, PlayerState]
  ): string | null {
    return this.checkWinCondition(players);
  }

  /**
   * Execute a technique for test purposes (stateless).
   * This is similar to calculateTechnique but might involve randomness for hit chance.
   */
  public static executeTechnique(
    // Renamed from the one in playerUtils to avoid confusion if this is kept separate
    technique: KoreanTechnique,
    attackerArchetype: PlayerArchetype,
    defenderArchetype?: PlayerArchetype // Defender archetype might not always be known for pure calculation
  ): CombatResult {
    const baseDamage =
      technique.damage ??
      (technique.damageRange
        ? (technique.damageRange.min + technique.damageRange.max) / 2
        : 10);
    const damage = calculateArchetypeDamage(attackerArchetype, baseDamage);
    const accuracy = technique.accuracy ?? 0.8;
    const hit = Math.random() < accuracy;
    const isCritical =
      hit &&
      (Math.random() < (technique.critChance ?? 0.1) ||
        (!!technique.critMultiplier && Math.random() < 0.05));

    return {
      attacker: attackerArchetype,
      defender: defenderArchetype || attackerArchetype, // Default to attacker if no defender
      damage: hit
        ? isCritical
          ? Math.round(damage * (technique.critMultiplier ?? 1.5))
          : Math.round(damage)
        : 0,
      hit,
      critical: isCritical,
      techniqueUsed: technique,
      effects: technique.effects || [],
      vitalPointsHit: [],
      defenderDamaged: hit && damage > 0,
      damageType: technique.damageType || "blunt",
      isVitalPoint: false,
      newState: "ready" as CombatState,
      damagePrevented: 0,
      staminaUsed: technique.staminaCost || 0,
      kiUsed: technique.kiCost || 0,
      attackerStance: technique.stance || "geon",
      defenderStance: "geon", // Placeholder
      painLevel: hit ? damage * 0.5 : 0,
      consciousnessImpact: hit ? damage * 0.1 : 0,
      balanceEffect: 0,
      bloodLoss: 0,
      stunDuration: isCritical ? 1000 : 0,
      statusEffects: technique.effects || [],
      hitType: hit ? (isCritical ? "critical" : "normal") : "miss",
      effectiveness: 1.0,
      hitPosition: { x: 0, y: 0 },
    };
  }

  static resolveAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    targetedVitalPointId?: string
  ): {
    combatResult: CombatResult;
    updatedAttacker: PlayerState;
    updatedDefender: PlayerState;
  } {
    const result = executeTechniqueUtil(
      attacker,
      defender,
      technique,
      targetedVitalPointId
    );

    return {
      combatResult: result.hitResult,
      updatedAttacker: result.updatedAttacker,
      updatedDefender: result.updatedDefender,
    };
  }

  static checkWinCondition(
    players: readonly [PlayerState, PlayerState]
  ): string | null {
    const [player1, player2] = players;

    if (player1.health <= 0) {
      return player2.id;
    }

    if (player2.health <= 0) {
      return player1.id;
    }

    if (player1.consciousness <= 0) {
      return player2.id;
    }

    if (player2.consciousness <= 0) {
      return player1.id;
    }

    return null;
  }

  static calculateDamage(
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState,
    hitResult?: VitalPointHitResult
  ): {
    baseDamage: number;
    modifierDamage: number;
    totalDamage: number;
  } {
    const baseDamage = technique.damage || 10;
    const modifierDamage = hitResult?.damage || 0;
    const totalDamage = baseDamage + modifierDamage;

    return {
      baseDamage,
      modifierDamage,
      totalDamage,
    };
  }
}
