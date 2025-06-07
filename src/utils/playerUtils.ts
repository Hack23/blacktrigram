// Player utility functions for Korean martial arts game

import type {
  PlayerState,
  PlayerArchetype,
  KoreanText,
  Position,
  TrigramStance,
  KoreanTechnique,
  CombatResult,
} from "../types";
import { TRIGRAM_DATA } from "../types/constants";

/**
 * Create a new player state with default values
 */
export function createPlayerState(
  id: string,
  archetype: PlayerArchetype,
  name: KoreanText,
  position: Position = { x: 0, y: 0 }
): PlayerState {
  return {
    id,
    name,
    archetype,
    position,
    currentStance: "geon",
    facing: "right",
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    consciousness: 100,
    pain: 0,
    balance: 100,
    bloodLoss: 0,
    lastStanceChangeTime: 0,
    combatReadiness: "ready",
    activeEffects: [],
    combatState: "idle",
    comboCount: 0,
    lastActionTime: 0,
    vitalPointDamage: {},
    bodyPartStatus: {
      head: "healthy",
      face_upper: "healthy",
      chest: "healthy",
      abdomen: "healthy",
      neck: "healthy",
      torso: "healthy",
      left_arm: "healthy",
      right_arm: "healthy",
      left_leg: "healthy",
      right_leg: "healthy",
    },
    knownTechniques: [],
    currentTargetId: null,
    attributes: {
      strength: 10,
      agility: 10,
      endurance: 10,
      intelligence: 10,
      focus: 10,
      resilience: 10,
    },
    skills: {
      striking: 10,
      kicking: 10,
      grappling: 10,
      weaponry: 0,
      meditation: 5,
      strategy: 5,
    },
  };
}

/**
 * Check if player is incapacitated
 */
export function isPlayerCapacitated(player: PlayerState): boolean {
  return (
    player.health > 0 &&
    player.consciousness > 0 &&
    player.combatState !== "stunned"
  );
}

/**
 * Calculate archetype-specific damage modifiers
 */
export function calculateArchetypeDamage(
  archetype: PlayerArchetype,
  baseDamage: number
): number {
  const modifiers: Record<PlayerArchetype, number> = {
    musa: 1.1, // Traditional warrior - high damage
    amsalja: 1.2, // Assassin - highest damage
    hacker: 0.9, // Cyber warrior - lower physical damage
    jeongbo_yowon: 1.0, // Intelligence operative - balanced
    jojik_pokryeokbae: 1.15, // Organized crime - high brutal damage
  };

  return baseDamage * (modifiers[archetype] || 1.0);
}

/**
 * Execute a technique between attacker and defender
 */
export function executeTechnique(
  attacker: PlayerState,
  defender: PlayerState,
  technique: KoreanTechnique,
  targetPoint?: string | null
): {
  updatedAttacker: Partial<PlayerState>;
  updatedDefender: Partial<PlayerState>;
  hitResult: CombatResult;
} {
  // Calculate basic damage with archetype modifiers
  const baseDamage = technique.damage || 20;
  const archetypeDamage = calculateArchetypeDamage(
    attacker.archetype,
    baseDamage
  );
  const damage = Math.floor(archetypeDamage * (0.8 + Math.random() * 0.4));

  // Determine if hit connects based on attacker/defender states
  const attackerEffectiveness = calculateCombatEffectiveness(attacker);
  const defenderEffectiveness = calculateCombatEffectiveness(defender);
  const hitChance = 0.8 * attackerEffectiveness * (2 - defenderEffectiveness);
  const hit = Math.random() < hitChance;

  // Check for critical hit or vital point hit
  const isCritical = hit && Math.random() < 0.1;
  const isVitalPoint = hit && targetPoint && Math.random() < 0.15;

  const finalDamage = hit
    ? isCritical || isVitalPoint
      ? Math.floor(damage * 1.5)
      : damage
    : 0;

  const hitResult: CombatResult = {
    hit,
    damage: finalDamage,
    critical: isCritical,
    blocked: false,
    stunned: isCritical && Math.random() < 0.3,
    knockdown: false,
    vitalPointHit: isVitalPoint,
    hitPosition: defender.position,
    // Enhanced properties
    attacker: attacker.archetype,
    defender: defender.archetype,
    damagePrevented: 0,
    staminaUsed: technique.staminaCost || 10,
    kiUsed: technique.kiCost || 0,
    defenderDamaged: hit,
    attackerStance: attacker.currentStance,
    defenderStance: defender.currentStance,
    painLevel: finalDamage * 0.5,
    consciousnessImpact: finalDamage * 0.1,
    balanceEffect: isCritical ? 20 : 0,
    bloodLoss: isVitalPoint ? finalDamage * 0.2 : 0,
    stunDuration: isCritical ? 1000 : 0,
    statusEffects: technique.effects || [],
    hitType: isCritical ? "critical" : hit ? "normal" : "miss",
    effectiveness: attackerEffectiveness,
    vitalPointsHit: [],
    effects: technique.effects || [],
    damageType: technique.damageType || "blunt",
    isVitalPoint: isVitalPoint,
    newState: hit ? "attacking" : "ready",
  };

  const updatedAttacker: Partial<PlayerState> = {
    stamina: Math.max(0, attacker.stamina - (technique.staminaCost || 10)),
    ki: Math.max(0, attacker.ki - (technique.kiCost || 0)),
    lastActionTime: Date.now(),
    combatState: "attacking",
  };

  const updatedDefender: Partial<PlayerState> = hit
    ? {
        health: Math.max(0, defender.health - finalDamage),
        pain: Math.min(100, defender.pain + hitResult.painLevel),
        consciousness: Math.max(
          0,
          defender.consciousness - hitResult.consciousnessImpact
        ),
        balance: Math.max(0, defender.balance - hitResult.balanceEffect),
        bloodLoss: defender.bloodLoss + hitResult.bloodLoss,
        combatState: hitResult.stunned ? "stunned" : "defending",
      }
    : {
        combatState: "defending",
      };

  return {
    updatedAttacker,
    updatedDefender,
    hitResult,
  };
}

/**
 * Get archetype display name
 */
export function getArchetypeDisplayName(
  archetype: PlayerArchetype
): KoreanText {
  const names: Record<PlayerArchetype, KoreanText> = {
    musa: { korean: "무사", english: "Warrior" },
    amsalja: { korean: "암살자", english: "Assassin" },
    hacker: { korean: "해커", english: "Hacker" },
    jeongbo_yowon: { korean: "정보요원", english: "Intelligence Operative" },
    jojik_pokryeokbae: { korean: "조직폭력배", english: "Organized Crime" },
  };

  return names[archetype];
}

/**
 * Check if player can perform action
 */
export function canPerformAction(player: PlayerState): boolean {
  return (
    player.health > 0 &&
    player.consciousness > 0 &&
    player.stamina > 10 &&
    player.combatState !== "stunned"
  );
}

/**
 * Calculate combat effectiveness based on player state
 */
export function calculateCombatEffectiveness(player: PlayerState): number {
  const healthRatio = player.health / player.maxHealth;
  const staminaRatio = player.stamina / player.maxStamina;
  const consciousnessRatio = player.consciousness / 100;
  const painPenalty = Math.max(0, 1 - player.pain / 100);

  return healthRatio * staminaRatio * consciousnessRatio * painPenalty;
}
