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
export function createPlayerFromArchetype(
  archetype: PlayerArchetype,
  playerIndex: number
): PlayerState {
  const archetypeData = PLAYER_ARCHETYPES_DATA[archetype];

  const basePosition: Position = {
    x: playerIndex === 0 ? 300 : 500,
    y: 400,
  };

  return {
    id: `player_${playerIndex + 1}`,
    name: archetypeData.name,
    archetype,

    // Combat stats
    health: archetypeData.baseHealth,
    maxHealth: archetypeData.baseHealth,
    ki: archetypeData.baseKi,
    maxKi: archetypeData.baseKi,
    stamina: archetypeData.baseStamina,
    maxStamina: archetypeData.baseStamina,
    energy: 100,
    maxEnergy: 100,

    // Combat attributes
    attackPower: archetypeData.stats.attackPower,
    defense: archetypeData.stats.defense,
    speed: archetypeData.stats.speed,
    technique: archetypeData.stats.technique,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,

    // Combat state
    currentStance: archetypeData.coreStance,
    combatState: CombatState.IDLE,
    position: basePosition,
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    lastActionTime: 0,
    recoveryTime: 0,
    lastStanceChangeTime: 0,

    // Status and effects
    statusEffects: [],
    activeEffects: [],

    // Vital points state
    vitalPoints: [],

    // Match statistics
    totalDamageReceived: 0,
    totalDamageDealt: 0,
    hitsTaken: 0,
    hitsLanded: 0,
    perfectStrikes: 0,
    vitalPointHits: 0,
  };
}

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
export function applyDamage(
  player: PlayerState,
  damage: number,
  _damageType?: string // Fix: Add underscore for unused parameter
): PlayerState {
  const newHealth = Math.max(0, player.health - damage);
  const isKnockedOut = newHealth <= 0;

  return updatePlayerState(player, {
    health: newHealth,
    totalDamageReceived: player.totalDamageReceived + damage,
    hitsTaken: player.hitsTaken + 1,
    combatState: isKnockedOut ? CombatState.STUNNED : player.combatState,
    consciousness: isKnockedOut ? 0 : player.consciousness,
  });
}

/**
 * Apply status effect to player
 */
export function applyStatusEffect(
  player: PlayerState,
  effect: StatusEffect
): PlayerState {
  const existingEffectIndex = player.statusEffects.findIndex(
    (e) => e.type === effect.type && !e.stackable
  );

  let newEffects: StatusEffect[];
  if (existingEffectIndex >= 0 && !effect.stackable) {
    // Replace existing non-stackable effect
    newEffects = [...player.statusEffects];
    newEffects[existingEffectIndex] = effect;
  } else {
    // Add new effect
    newEffects = [...player.statusEffects, effect];
  }

  return updatePlayerState(player, {
    statusEffects: newEffects,
    activeEffects: [...player.activeEffects, effect.type],
  });
}

/**
 * Get vital point by ID (fix return type)
 */
export function getVitalPointById(
  player: PlayerState,
  vitalPointId: string
): {
  readonly id: string;
  readonly isHit: boolean;
  readonly damage: number;
  readonly lastHitTime: number;
} | null {
  return player.vitalPoints.find((vp) => vp.id === vitalPointId) || null;
}

/**
 * Check if player can act
 */
export function canPlayerAct(player: PlayerState): boolean {
  if (player.health <= 0) return false;
  if (player.consciousness <= 0) return false;
  if (player.combatState === CombatState.STUNNED) return false;
  if (player.isStunned) return false;
  return true;
}

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
