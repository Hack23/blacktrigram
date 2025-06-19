/**
 * @fileoverview Mock utilities for creating test PlayerState objects with Korean martial arts data
 * @description Provides comprehensive mock functions for Black Trigram combat testing
 */

import type { PlayerState } from "../../types/player";
import {
  PlayerArchetype,
  TrigramStance,
  CombatAttackType,
  DamageType,
} from "../../types/enums";
import type { KoreanTechnique } from "../../types";

const ARCHETYPE_STAT_MODIFIERS = {
  [PlayerArchetype.MUSA]: {
    health: 120,
    maxHealth: 120,
    ki: 110,
    maxKi: 110,
  },
  [PlayerArchetype.JEONGBO_YOWON]: {
    health: 90,
    maxHealth: 90,
    ki: 130,
    maxKi: 130,
  },
  [PlayerArchetype.AMSALJA]: {
    health: 100,
    maxHealth: 100,
    ki: 120,
    maxKi: 120,
  },
  [PlayerArchetype.HACKER]: {
    health: 80,
    maxHealth: 80,
    ki: 140,
    maxKi: 140,
  },
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
    health: 130,
    maxHealth: 130,
    ki: 100,
    maxKi: 100,
  },
} as const;

/**
 * Creates a mock player with default or custom properties
 */
export function createMockPlayer(
  overrides: Partial<PlayerState> = {}
): PlayerState {
  return {
    id: overrides.id ?? "test-player",
    name: overrides.name ?? { korean: "테스트 무사", english: "Test Warrior" },
    archetype: overrides.archetype ?? PlayerArchetype.MUSA,
    currentStance: overrides.currentStance ?? TrigramStance.GEON,
    health: overrides.health ?? 100,
    maxHealth: overrides.maxHealth ?? 100,
    ki: overrides.ki ?? 100,
    maxKi: overrides.maxKi ?? 100,
    stamina: overrides.stamina ?? 100,
    maxStamina: overrides.maxStamina ?? 100,
    balance: overrides.balance ?? 100,
    consciousness: overrides.consciousness ?? 100,
    pain: overrides.pain ?? 0,
    experiencePoints: overrides.experiencePoints ?? 0,
    isBlocking: overrides.isBlocking ?? false,
    isStunned: overrides.isStunned ?? false,
    isCountering: overrides.isCountering ?? false,
    statusEffects: overrides.statusEffects ?? [],
    position: overrides.position ?? { x: 0, y: 0 },
    hitsLanded: overrides.hitsLanded ?? 0,
    hitsTaken: overrides.hitsTaken ?? 0,
    totalDamageDealt: overrides.totalDamageDealt ?? 0,
    totalDamageReceived: overrides.totalDamageReceived ?? 0,
    combatStats: overrides.combatStats ?? {
      hitsLanded: 0,
      hitsTaken: 0,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      perfectStrikes: 0,
      criticalHits: 0,
    },
    attackPower: overrides.attackPower ?? 10,
    defense: overrides.defense ?? 5,
    lastActionTime: overrides.lastActionTime ?? 0,
    recoveryTime: overrides.recoveryTime ?? 500,
    ...overrides,
  };
}

/**
 * Creates a defeated mock player for testing victory conditions
 */
export function createDefeatedMockPlayer(
  overrides: Partial<PlayerState> = {}
): PlayerState {
  return createMockPlayer({
    health: 0,
    consciousness: 0,
    ...overrides,
  });
}

/**
 * Creates an unconscious player for testing victory conditions
 */
export function createUnconsciousPlayer(): PlayerState {
  return createMockPlayer({
    health: 0,
    consciousness: 0,
  });
}

/**
 * Creates a damaged player with specified health percentage
 */
export function createDamagedPlayer(healthPercent: number): PlayerState {
  const maxHealth = 100;
  return createMockPlayer({
    health: maxHealth * healthPercent,
    maxHealth,
  });
}

/**
 * Creates a player with specific archetype
 */
export function createArchetypePlayer(archetype: PlayerArchetype): PlayerState {
  return createMockPlayer({ archetype });
}

// Helper function to create players with specific levels
export function createPlayerWithLevel(
  level: number,
  archetype: PlayerArchetype = PlayerArchetype.MUSA
): PlayerState {
  return createMockPlayer({
    archetype,
    experiencePoints: level * 100, // Fix: Remove level property
  });
}

/**
 * Creates a basic Korean technique for testing
 */
export function createBasicTechnique(): KoreanTechnique {
  return {
    id: "basic_strike",
    name: { korean: "기본 타격", english: "Basic Strike" },
    koreanName: "기본 타격",
    englishName: "Basic Strike",
    romanized: "gibon tagyeok",
    description: {
      korean: "기본적인 타격 기술",
      english: "Basic striking technique",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 12,
    range: 1.0,
    kiCost: 3,
    staminaCost: 5,
    accuracy: 0.9,
    executionTime: 250,
    recoveryTime: 400,
    critChance: 0.08,
    critMultiplier: 1.3,
    effects: [],
  };
}

export default createMockPlayer;
export function createPlayerFromArchetype(
  archetype: PlayerArchetype,
  level: number = 1
): PlayerState {
  const baseStats = ARCHETYPE_STAT_MODIFIERS[archetype];
  return createMockPlayer({
    archetype,
    level,
    health: baseStats.health + level * 10,
    maxHealth: baseStats.maxHealth + level * 10,
    ki: baseStats.ki + level * 5,
    maxKi: baseStats.maxKi + level * 5,
  });
}
