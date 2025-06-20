/**
 * Player state utilities and helper functions
 */

import type {
  PlayerState,
  PlayerArchetype,
  TrigramStance,
  Position,
  StatusEffect,
} from "../types";
import { CombatState } from "../types/enums";
import { PLAYER_ARCHETYPES_DATA } from "../types/constants";

/**
 * Create a complete PlayerState from archetype and player index
 */
export const createPlayer = (id: string, archetype: PlayerArchetype): PlayerState => {
  const archetypeData = PLAYER_ARCHETYPES_DATA[archetype];

  return {
    id,
    name: archetypeData.name,
    archetype,
    health: archetypeData.baseHealth,
    maxHealth: archetypeData.baseHealth,
    ki: archetypeData.baseKi,
    maxKi: archetypeData.baseKi,
    stamina: archetypeData.baseStamina,
    maxStamina: archetypeData.baseStamina,
    balance: 100,
    maxBalance: 100,
    consciousness: 100,
    maxConsciousness: 100,
    pain: 0,
    maxPain: 100,
    currentStance: archetypeData.coreStance,
    position: { x: 0, y: 0 },
    isAlive: true,
    isBlocking: false,
    isExecutingTechnique: false,
    statusEffects: [],
    // Fix: Use combatStats instead of combatState
    combatStats: {
      totalDamage: 0,
      criticalHits: 0,
      vitalPointHits: 0,
      techniquesUsed: 0,
      stamina: archetypeData.baseStamina,
      ki: archetypeData.baseKi,
    },
    // Add extended properties with defaults
    energy: 100,
    maxEnergy: 100,
    attackPower: archetypeData.stats.attackPower,
    defense: archetypeData.stats.defense,
    speed: archetypeData.stats.speed,
    technique: archetypeData.stats.technique,
    accuracy: 0.8,
    criticalChance: 0.1,
    effectiveness: 1.0,
    momentum: 0,
    focus: 100,
    injuries: [],
    skills: [],
    techniques: [],
    equipment: null,
    experience: 0,
    level: 1,
    training: {
      sessions: 0,
      totalTime: 0,
      skillPoints: 0,
    },
  };
};

/**
 * Update player state with partial updates
 */
export function updatePlayerState(
  player: PlayerState,
  updates: Partial<PlayerState>
): PlayerState {
  return {
    ...player,
    ...updates,
    // Ensure vital constraints
    health: Math.max(
      0,
      Math.min(updates.health ?? player.health, player.maxHealth)
    ),
    ki: Math.max(0, Math.min(updates.ki ?? player.ki, player.maxKi)),
    stamina: Math.max(
      0,
      Math.min(updates.stamina ?? player.stamina, player.maxStamina)
    ),
    consciousness: Math.max(
      0,
      Math.min(updates.consciousness ?? player.consciousness, 100)
    ),
    balance: Math.max(0, Math.min(updates.balance ?? player.balance, 100)),
  };
}

/**
 * Apply damage to player
 */
export const applyDamage = (player: PlayerState, damage: number): Partial<PlayerState> => {
  const newHealth = Math.max(0, player.health - damage);
  const isKnockedOut = newHealth === 0;

  return {
    health: newHealth,
    // Fix: Use optional chaining for missing properties
    totalDamageReceived: (player.totalDamageReceived || 0) + damage,
    hitsTaken: (player.hitsTaken || 0) + 1,
    // Fix: Use combatStats instead of combatState
    isAlive: !isKnockedOut,
  };
};

/**
 * Apply status effect to player
 */
export const applyStatusEffect = (
  player: PlayerState,
  effect: StatusEffect
): Partial<PlayerState> => {
  return {
    statusEffects: [...player.statusEffects, effect],
    // Fix: Use optional chaining for missing properties
    activeEffects: [...(player.activeEffects || []), effect.type],
  };
};

/**
 * Get vital point by ID (fix return type)
 */
export const getVitalPoint = (player: PlayerState, vitalPointId: string): any | null => {
  // Fix: Use optional chaining for missing properties
  return (player.vitalPoints || []).find((vp: any) => vp.id === vitalPointId) || null;
};

/**
 * Check if player can act
 */
export const canPerformAction = (player: PlayerState): boolean => {
  if (!player.isAlive) return false;
  if (player.stamina <= 0) return false;
  // Fix: Use combatStats and optional chaining
  if ((player.isStunned ?? false)) return false;
  return true;
};

/**
 * Get player's current stance effectiveness against opponent
 */
export function getStanceEffectiveness(
  _playerStance: TrigramStance, // Fix: Add underscore to unused parameter
  _opponentStance: TrigramStance // Fix: Add underscore to unused parameter
): number {
  // Basic implementation - could be enhanced with stance matrix
  return 1.0;
}

/**
 * Check if player has enough resources for action
 */
export function hasEnoughResources(
  player: PlayerState,
  kiCost: number,
  staminaCost: number
): boolean {
  return player.ki >= kiCost && player.stamina >= staminaCost;
}

/**
 * Get player archetype bonuses
 */
export function getArchetypeBonuses(archetype: PlayerArchetype): {
  attackBonus: number;
  defenseBonus: number;
  speedBonus: number;
  techniqueBonus: number;
} {
  const data = PLAYER_ARCHETYPES_DATA[archetype];
  return {
    attackBonus: data.stats.attackPower * 0.1,
    defenseBonus: data.stats.defense * 0.1,
    speedBonus: data.stats.speed * 0.1,
    techniqueBonus: data.stats.technique * 0.1,
  };
}

/**
 * Calculate player's current combat effectiveness
 */
export function calculateCombatEffectiveness(player: PlayerState): number {
  const healthFactor = player.health / player.maxHealth;
  const staminaFactor = player.stamina / player.maxStamina;
  const consciousnessFactor = player.consciousness / 100;
  const balanceFactor = player.balance / 100;

  return (
    (healthFactor + staminaFactor + consciousnessFactor + balanceFactor) / 4
  );
}

/**
 * Remove expired status effects
 */
export function updateStatusEffects(
  player: PlayerState,
  currentTime: number
): PlayerState {
  const activeEffects = player.statusEffects.filter(
    (effect) => effect.endTime > currentTime
  );

  return updatePlayerState(player, {
    statusEffects: activeEffects,
    activeEffects: activeEffects.map((e) => e.type),
  });
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

/**
 * Remove status effects from player
 */
export const removeStatusEffects = (
  player: PlayerState,
  effectTypes: string[]
): Partial<PlayerState> => {
  const filteredEffects = player.statusEffects.filter(
    (effect) => !effectTypes.includes(effect.type)
  );

  const activeEffects = (player.activeEffects || []).filter(
    (effectType) => !effectTypes.includes(effectType)
  );

  return {
    statusEffects: filteredEffects,
    // Fix: Use optional chaining for missing properties
    activeEffects: activeEffects,
  };
};

