/**
 * Player Effect Manager for tracking and applying status effects.
 * 
 * **Korean**: 플레이어 효과 관리자 (Player Effect Manager)
 * 
 * This module provides utilities for managing status effects on player state,
 * including adding effects with stacking logic, removing expired effects,
 * and applying effect-based combat modifiers.
 * 
 * ## Key Features
 * 
 * - **Effect Tracking**: Add, remove, and update status effects
 * - **Stacking Logic**: Manage concurrent effects (max 5)
 * - **Expiration Handling**: Auto-remove expired effects
 * - **Combat Modifiers**: Calculate effect-based stat changes
 * 
 * @module systems/PlayerEffectManager
 * @category Player Management
 * @korean 플레이어효과관리
 */

import { VitalPointEffectType } from "../types/common";
import { StatusEffect } from "./types";
import { PlayerState } from "./player";
import { applyEffectStacking, MAX_CONCURRENT_EFFECTS } from "./EffectCalculator";

/**
 * Adds status effects to a player's active effects list.
 * 
 * **Korean**: 플레이어에 효과 추가 (Add Effects to Player)
 * 
 * Applies stacking logic and respects the max concurrent effects limit.
 * 
 * @param player - Current player state
 * @param effects - New effects to add
 * @returns Updated player state with new effects
 * 
 * @example
 * ```typescript
 * const updatedPlayer = addEffectsToPlayer(
 *   player,
 *   [paralyze, bleed, stun]
 * );
 * ```
 * 
 * @public
 * @korean 효과추가
 */
export function addEffectsToPlayer(
  player: PlayerState,
  effects: readonly StatusEffect[]
): PlayerState {
  const currentTime = Date.now();

  // Apply stacking logic
  const updatedEffects = applyEffectStacking(
    player.statusEffects,
    effects,
    currentTime
  );

  // Update activeEffects array with effect IDs
  const activeEffectIds = updatedEffects.map((effect) => effect.id);

  return {
    ...player,
    statusEffects: updatedEffects,
    activeEffects: activeEffectIds,
  };
}

/**
 * Removes expired status effects from player.
 * 
 * **Korean**: 만료 효과 제거 (Remove Expired Effects)
 * 
 * Filters out effects whose endTime has passed.
 * 
 * @param player - Current player state
 * @param currentTime - Current timestamp (default: Date.now())
 * @returns Updated player state with expired effects removed
 * 
 * @example
 * ```typescript
 * const updatedPlayer = removeExpiredEffects(player, Date.now());
 * ```
 * 
 * @public
 * @korean 만료효과제거
 */
export function removeExpiredEffects(
  player: PlayerState,
  currentTime: number = Date.now()
): PlayerState {
  const activeEffects = player.statusEffects.filter(
    (effect) => effect.endTime > currentTime
  );

  const activeEffectIds = activeEffects.map((effect) => effect.id);

  return {
    ...player,
    statusEffects: activeEffects,
    activeEffects: activeEffectIds,
  };
}

/**
 * Removes a specific status effect by ID.
 * 
 * **Korean**: 특정 효과 제거 (Remove Specific Effect)
 * 
 * @param player - Current player state
 * @param effectId - ID of effect to remove
 * @returns Updated player state with effect removed
 * 
 * @example
 * ```typescript
 * const updatedPlayer = removeEffectById(player, "stun_12345");
 * ```
 * 
 * @public
 * @korean 효과제거
 */
export function removeEffectById(
  player: PlayerState,
  effectId: string
): PlayerState {
  const activeEffects = player.statusEffects.filter(
    (effect) => effect.id !== effectId
  );

  const activeEffectIds = activeEffects.map((effect) => effect.id);

  return {
    ...player,
    statusEffects: activeEffects,
    activeEffects: activeEffectIds,
  };
}

/**
 * Removes all status effects of a specific type.
 * 
 * **Korean**: 특정 유형 효과 모두 제거 (Remove All Effects of Type)
 * 
 * @param player - Current player state
 * @param effectType - Type of effects to remove
 * @returns Updated player state with effects removed
 * 
 * @example
 * ```typescript
 * const updatedPlayer = removeEffectsByType(
 *   player,
 *   VitalPointEffectType.PARALYSIS
 * );
 * ```
 * 
 * @public
 * @korean 유형별효과제거
 */
export function removeEffectsByType(
  player: PlayerState,
  effectType: VitalPointEffectType
): PlayerState {
  const activeEffects = player.statusEffects.filter(
    (effect) => effect.type !== effectType
  );

  const activeEffectIds = activeEffects.map((effect) => effect.id);

  return {
    ...player,
    statusEffects: activeEffects,
    activeEffects: activeEffectIds,
  };
}

/**
 * Clears all status effects from player.
 * 
 * **Korean**: 모든 효과 제거 (Clear All Effects)
 * 
 * Useful for healing items, rest periods, or match resets.
 * 
 * @param player - Current player state
 * @returns Updated player state with no effects
 * 
 * @example
 * ```typescript
 * const clearedPlayer = clearAllEffects(player);
 * ```
 * 
 * @public
 * @korean 전체효과제거
 */
export function clearAllEffects(player: PlayerState): PlayerState {
  return {
    ...player,
    statusEffects: [],
    activeEffects: [],
  };
}

/**
 * Calculates combat stat modifiers based on active status effects.
 * 
 * **Korean**: 효과 기반 전투 배율 계산 (Calculate Effect-Based Combat Modifiers)
 * 
 * Returns multipliers for various combat attributes affected by status effects.
 * 
 * @param player - Current player state
 * @returns Object with stat multipliers (1.0 = no change)
 * 
 * @example
 * ```typescript
 * const modifiers = getEffectModifiers(player);
 * const effectiveDamage = baseDamage * modifiers.attackPower;
 * const effectiveSpeed = baseSpeed * modifiers.speed;
 * ```
 * 
 * @public
 * @korean 효과배율계산
 */
export function getEffectModifiers(player: PlayerState): {
  attackPower: number;
  defense: number;
  speed: number;
  technique: number;
  staminaRegen: number;
  kiRegen: number;
} {
  let attackPower = 1.0;
  let defense = 1.0;
  let speed = 1.0;
  let technique = 1.0;
  let staminaRegen = 1.0;
  let kiRegen = 1.0;

  for (const effect of player.statusEffects) {
    // UNCONSCIOUSNESS takes precedence - early return with complete incapacitation
    if (effect.type === VitalPointEffectType.UNCONSCIOUSNESS) {
      return {
        attackPower: 0,
        defense: 0,
        speed: 0,
        technique: 0,
        staminaRegen: 0,
        kiRegen: 0,
      };
    }

    // Apply other effect modifiers multiplicatively
    switch (effect.type) {
      case VitalPointEffectType.PARALYSIS:
        // Severe movement and action impairment
        attackPower *= 0.3;
        speed *= 0.2;
        technique *= 0.4;
        break;

      case VitalPointEffectType.STUN:
        // Moderate impairment
        attackPower *= 0.5;
        defense *= 0.6;
        speed *= 0.5;
        technique *= 0.6;
        break;

      case VitalPointEffectType.PAIN:
        // Reduces effectiveness across the board
        attackPower *= 0.7;
        defense *= 0.8;
        speed *= 0.8;
        technique *= 0.7;
        break;

      case VitalPointEffectType.BLOOD_FLOW_RESTRICTION:
        // Gradual weakening from reduced circulation
        attackPower *= 0.85;
        staminaRegen *= 0.5;
        break;

      case VitalPointEffectType.BREATHLESSNESS:
        // Stamina issues
        staminaRegen *= 0.3;
        speed *= 0.7;
        break;

      case VitalPointEffectType.DISORIENTATION:
        // Accuracy and technique affected
        technique *= 0.6;
        defense *= 0.7;
        break;

      case VitalPointEffectType.WEAKNESS:
        // Overall power reduction
        attackPower *= 0.7;
        defense *= 0.8;
        break;

      case VitalPointEffectType.NERVE_DISRUPTION:
        // Ki system and coordination impaired
        kiRegen *= 0.5;
        attackPower *= 0.8;
        technique *= 0.7;
        break;

      case VitalPointEffectType.ORGAN_DISRUPTION:
        // Internal damage affecting all systems
        attackPower *= 0.6;
        defense *= 0.7;
        staminaRegen *= 0.4;
        kiRegen *= 0.4;
        break;
    }
  }

  return {
    attackPower,
    defense,
    speed,
    technique,
    staminaRegen,
    kiRegen,
  };
}

/**
 * Checks if player has a specific effect type active.
 * 
 * **Korean**: 효과 활성 여부 확인 (Check Effect Active)
 * 
 * @param player - Current player state
 * @param effectType - Type to check for
 * @returns True if effect type is active
 * 
 * @example
 * ```typescript
 * if (hasEffect(player, VitalPointEffectType.PARALYSIS)) {
 *   console.log("Player is paralyzed!");
 * }
 * ```
 * 
 * @public
 * @korean 효과확인
 */
export function hasEffect(
  player: PlayerState,
  effectType: VitalPointEffectType
): boolean {
  return player.statusEffects.some((effect) => effect.type === effectType);
}

/**
 * Gets all active effects of a specific type.
 * 
 * **Korean**: 유형별 활성 효과 조회 (Get Effects by Type)
 * 
 * @param player - Current player state
 * @param effectType - Type to retrieve
 * @returns Array of matching effects
 * 
 * @public
 * @korean 유형별효과조회
 */
export function getEffectsByType(
  player: PlayerState,
  effectType: VitalPointEffectType
): StatusEffect[] {
  return player.statusEffects.filter((effect) => effect.type === effectType);
}

/**
 * Gets the total number of active status effects.
 * 
 * **Korean**: 활성 효과 개수 조회 (Get Active Effect Count)
 * 
 * @param player - Current player state
 * @returns Number of active effects
 * 
 * @public
 * @korean 효과개수조회
 */
export function getActiveEffectCount(player: PlayerState): number {
  return player.statusEffects.length;
}

/**
 * Checks if player can accept new status effects.
 * 
 * **Korean**: 효과 추가 가능 여부 확인 (Can Add More Effects)
 * 
 * @param player - Current player state
 * @returns True if under MAX_CONCURRENT_EFFECTS limit
 * 
 * @public
 * @korean 효과추가가능확인
 */
export function canAddMoreEffects(player: PlayerState): boolean {
  return player.statusEffects.length < MAX_CONCURRENT_EFFECTS;
}
