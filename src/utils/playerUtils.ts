/**
 * @fileoverview Player utility functions for Korean martial arts game
 * @description Helper functions for player creation, state management, and archetype handling
 */

import type { PlayerState } from "../types/player";
import { PlayerArchetype, TrigramStance } from "../types/enums";
import { PLAYER_ARCHETYPES_DATA } from "../types/constants";
import type { KoreanText } from "../types/korean-text";

/**
 * Creates a new player from an archetype with Korean martial arts characteristics
 */
export function createPlayerFromArchetype(
  archetype: PlayerArchetype,
  playerIndex: number
): PlayerState {
  const archetypeData = PLAYER_ARCHETYPES_DATA[archetype];

  const playerNames: Record<PlayerArchetype, KoreanText[]> = {
    [PlayerArchetype.MUSA]: [
      { korean: "강철무사", english: "Iron Warrior" },
      { korean: "용맹무사", english: "Brave Warrior" },
    ],
    [PlayerArchetype.AMSALJA]: [
      { korean: "그림자", english: "Shadow" },
      { korean: "은밀자", english: "Stealth" },
    ],
    [PlayerArchetype.HACKER]: [
      { korean: "사이버전사", english: "Cyber Warrior" },
      { korean: "데이터침입자", english: "Data Infiltrator" },
    ],
    [PlayerArchetype.JEONGBO_YOWON]: [
      { korean: "정보수집가", english: "Intelligence Gatherer" },
      { korean: "관찰자", english: "Observer" },
    ],
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: [
      { korean: "폭력배", english: "Gangster" },
      { korean: "거친자", english: "Rough One" },
    ],
  };

  const names = playerNames[archetype];
  const selectedName = names[playerIndex % names.length];

  return {
    id: `player_${playerIndex}`,
    name: selectedName,
    archetype,
    currentStance: TrigramStance.GEON,
    health: archetypeData.stats.baseHealth,
    maxHealth: archetypeData.stats.baseHealth,
    ki: archetypeData.stats.baseKi,
    maxKi: archetypeData.stats.baseKi,
    stamina: archetypeData.stats.baseStamina,
    maxStamina: archetypeData.stats.baseStamina,
    balance: 100,
    consciousness: 100,
    pain: 0,
    experiencePoints: 0,
    level: 1,
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    statusEffects: [],
    combatStats: {
      hitsLanded: 0,
      hitsTaken: 0,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      perfectStrikes: 0,
      criticalHits: 0,
    },
  };
}

/**
 * Gets archetype-specific colors for UI theming
 */
export function getArchetypeColors(archetype: PlayerArchetype): {
  primary: number;
  secondary: number;
  accent: number;
} {
  return PLAYER_ARCHETYPES_DATA[archetype].colors;
}

/**
 * Calculates player combat effectiveness based on current state
 */
export function calculateCombatEffectiveness(player: PlayerState): number {
  const healthFactor = player.health / player.maxHealth;
  const kiFactor = player.ki / player.maxKi;
  const staminaFactor = player.stamina / player.maxStamina;
  const balanceFactor = player.balance / 100;
  const consciousnessFactor = player.consciousness / 100;

  // Weighted calculation favoring health and consciousness
  return Math.round(
    (healthFactor * 0.35 +
      consciousnessFactor * 0.25 +
      kiFactor * 0.2 +
      staminaFactor * 0.15 +
      balanceFactor * 0.05) * 100
  );
}

/**
 * Determines if a player can execute actions based on their state
 */
export function canPlayerAct(player: PlayerState): boolean {
  return (
    player.health > 0 &&
    player.consciousness > 0 &&
    !player.isStunned &&
    player.balance > 10
  );
}

/**
 * Calculates resource costs for actions based on archetype
 */
export function getActionCosts(
  player: PlayerState,
  actionType: "attack" | "defend" | "technique" | "stance"
): { ki: number; stamina: number } {
  const archetype = player.archetype;
  const baseModifier = PLAYER_ARCHETYPES_DATA[archetype].actionModifiers;

  const baseCosts = {
    attack: { ki: 10, stamina: 15 },
    defend: { ki: 5, stamina: 10 },
    technique: { ki: 20, stamina: 25 },
    stance: { ki: 8, stamina: 12 },
  };

  const base = baseCosts[actionType];

  return {
    ki: Math.round(base.ki * baseModifier.kiCostModifier),
    stamina: Math.round(base.stamina * baseModifier.staminaCostModifier),
  };
}

/**
 * Applies status effects to a player
 */
export function applyStatusEffect(
  player: PlayerState,
  effectType: "stun" | "poison" | "burn" | "bleed" | "strengthen" | "weaken",
  duration: number,
  intensity: number
): PlayerState {
  const newEffect = {
    id: `${effectType}_${Date.now()}`,
    type: effectType as any,
    intensity: intensity > 0.75 ? "high" : intensity > 0.5 ? "medium" : "low" as any,
    duration,
    description: {
      korean: getKoreanEffectName(effectType),
      english: effectType.charAt(0).toUpperCase() + effectType.slice(1),
    },
    stackable: ["poison", "burn", "bleed"].includes(effectType),
    source: "combat",
    startTime: Date.now(),
    endTime: Date.now() + duration,
  };

  return {
    ...player,
    statusEffects: [...player.statusEffects, newEffect],
  };
}

/**
 * Gets Korean name for status effects
 */
function getKoreanEffectName(effectType: string): string {
  const koreanNames: Record<string, string> = {
    stun: "기절",
    poison: "중독",
    burn: "화상",
    bleed: "출혈",
    strengthen: "강화",
    weaken: "약화",
  };
  return koreanNames[effectType] || effectType;
}

/**
 * Updates player resources after action
 */
export function updatePlayerResources(
  player: PlayerState,
  kiCost: number,
  staminaCost: number
): PlayerState {
  return {
    ...player,
    ki: Math.max(0, player.ki - kiCost),
    stamina: Math.max(0, player.stamina - staminaCost),
  };
}

/**
 * Regenerates player resources over time
 */
export function regeneratePlayerResources(
  player: PlayerState,
  deltaTime: number
): PlayerState {
  const regenRate = 0.1; // 10% per second
  const kiRegen = player.maxKi * regenRate * (deltaTime / 1000);
  const staminaRegen = player.maxStamina * regenRate * (deltaTime / 1000);

  return {
    ...player,
    ki: Math.min(player.maxKi, player.ki + kiRegen),
    stamina: Math.min(player.maxStamina, player.stamina + staminaRegen),
  };
}

/**
 * Checks if player is defeated
 */
export function isPlayerDefeated(player: PlayerState): boolean {
  return player.health <= 0 || player.consciousness <= 0;
}

/**
 * Gets player's combat stance data
 */
export function getPlayerStanceInfo(player: PlayerState): {
  korean: string;
  english: string;
  symbol: string;
} {
  const stanceMap: Record<TrigramStance, { korean: string; english: string; symbol: string }> = {
    [TrigramStance.GEON]: { korean: "건", english: "Heaven", symbol: "☰" },
    [TrigramStance.TAE]: { korean: "태", english: "Lake", symbol: "☱" },
    [TrigramStance.LI]: { korean: "리", english: "Fire", symbol: "☲" },
    [TrigramStance.JIN]: { korean: "진", english: "Thunder", symbol: "☳" },
    [TrigramStance.SON]: { korean: "손", english: "Wind", symbol: "☴" },
    [TrigramStance.GAM]: { korean: "감", english: "Water", symbol: "☵" },
    [TrigramStance.GAN]: { korean: "간", english: "Mountain", symbol: "☶" },
    [TrigramStance.GON]: { korean: "곤", english: "Earth", symbol: "☷" },
  };

  return stanceMap[player.currentStance] || stanceMap[TrigramStance.GEON];
}
 
/**
 * Reset player to starting state
 */
export function resetPlayerState(
  archetype: PlayerArchetype,
  playerIndex: number
): PlayerState {
  return createPlayerFromArchetype(archetype, playerIndex);
}
