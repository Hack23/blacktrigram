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
 * Execute a technique between attacker and defender
 */
export function executeTechnique(
  attacker: PlayerState,
  defender: PlayerState,
  technique: KoreanTechnique
): {
  updatedAttacker: Partial<PlayerState>;
  updatedDefender: Partial<PlayerState>;
  hitResult: CombatResult;
} {
  // Calculate basic damage
  const baseDamage = technique.damage || 20;
  const damage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4));

  // Determine if hit connects
  const hitChance = 0.8; // 80% base hit chance
  const hit = Math.random() < hitChance;

  const hitResult: CombatResult = {
    hit,
    damage: hit ? damage : 0,
    critical: hit && Math.random() < 0.1, // 10% crit chance
    blocked: false,
    stunned: false,
    knockdown: false,
    vitalPointHit: false,
    hitPosition: defender.position,
  };

  const updatedAttacker: Partial<PlayerState> = {
    stamina: Math.max(0, attacker.stamina - 5),
    lastActionTime: Date.now(),
  };

  const updatedDefender: Partial<PlayerState> = hit
    ? {
        health: Math.max(0, defender.health - damage),
        pain: Math.min(100, defender.pain + damage * 0.5),
      }
    : {};

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
