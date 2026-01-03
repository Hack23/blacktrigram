/**
 * Combat physics utilities using physical attributes.
 * 
 * **Korean**: 전투 물리 유틸리티 (Combat Physics Utilities)
 * 
 * This module provides combat calculation functions that use player physical
 * attributes (weight, limb length, muscle mass, etc.) to determine realistic
 * combat outcomes including reach, movement speed, damage, and stamina.
 * 
 * ## Integration Points
 * 
 * - Movement speed calculations in useCombatActions
 * - Technique range validation
 * - Damage calculation in combat system
 * - Defense and stamina calculations
 * 
 * @module utils/combatPhysics
 * @category Combat System
 * @korean 전투물리
 */

import { PhysicalAttributes, CombatAttackType } from "@/types";
import { PlayerState } from "@/systems";
import {
  calculateEffectiveReach,
  calculateMovementSpeed,
  calculateDamageModifier,
  calculateDefenseModifier,
  calculateStaminaRecovery,
} from "@/data/archetypePhysicalAttributes";

/**
 * Get player's physical attributes or use defaults.
 * 
 * **Korean**: 플레이어 신체 속성 가져오기
 * 
 * Returns the player's physical attributes if available, otherwise
 * returns baseline default attributes for compatibility with legacy code.
 * 
 * @param player - Player state
 * @returns Physical attributes (actual or default baseline)
 * 
 * @internal
 */
function getPlayerPhysicalAttributes(player: PlayerState): PhysicalAttributes {
  if (player.physicalAttributes) {
    return player.physicalAttributes;
  }
  
  // Default baseline attributes for backward compatibility
  return {
    weight: 75,
    legLength: 95,
    armLength: 75,
    muscleMass: 35,
    fatMass: 12,
    age: 30,
    totalHeight: 178,
    torsoLength: 58,
    headSize: 22,
    neckLength: 10,
    shoulderWidth: 43,
  };
}

/**
 * Calculate effective attack range for a technique.
 * 
 * **Korean**: 기술 유효 거리 계산
 * 
 * Determines how far a technique can reach based on the player's limb
 * length and the type of attack. Different attack types use different
 * limbs and require different extensions.
 * 
 * @param player - Attacking player
 * @param attackType - Type of attack being performed
 * @param extension - Percentage of full limb extension (0.0-1.0)
 * @returns Effective reach in centimeters
 * 
 * @example
 * ```typescript
 * // Full extension punch
 * const punchRange = calculateAttackRange(player, CombatAttackType.PUNCH, 1.0);
 * 
 * // 70% extension kick (stable stance)
 * const kickRange = calculateAttackRange(player, CombatAttackType.KICK, 0.7);
 * ```
 * 
 * @public
 * @korean 공격거리계산
 */
export function calculateAttackRange(
  player: PlayerState,
  attackType: CombatAttackType,
  extension: number = 1.0
): number {
  const physical = getPlayerPhysicalAttributes(player);
  
  // Determine which limb is used for this attack type
  switch (attackType) {
    case CombatAttackType.KICK:
      return calculateEffectiveReach(physical.legLength, extension);
      
    case CombatAttackType.PUNCH:
    case CombatAttackType.STRIKE:
    case CombatAttackType.THRUST:
      return calculateEffectiveReach(physical.armLength, extension);
      
    case CombatAttackType.ELBOW:
      // Elbow strikes use shorter arm reach
      return calculateEffectiveReach(physical.armLength * 0.6, extension);
      
    case CombatAttackType.KNEE:
      // Knee strikes use shorter leg reach
      return calculateEffectiveReach(physical.legLength * 0.6, extension);
      
    case CombatAttackType.GRAPPLE:
    case CombatAttackType.THROW:
      // Grappling requires close range, use arm length at 50% extension
      return calculateEffectiveReach(physical.armLength, 0.5);
      
    case CombatAttackType.PRESSURE_POINT:
    case CombatAttackType.NERVE_STRIKE:
      // Precision strikes use full arm extension
      return calculateEffectiveReach(physical.armLength, extension);
      
    default:
      // Default to arm reach
      return calculateEffectiveReach(physical.armLength, extension);
  }
}

/**
 * Calculate player's current movement speed.
 * 
 * **Korean**: 플레이어 이동 속도 계산
 * 
 * Determines movement speed based on physical attributes (weight, leg length)
 * and applies modifiers from stamina, injuries, and status effects.
 * 
 * @param player - Player state
 * @param baseSpeed - Base movement speed (default: 100)
 * @returns Modified movement speed
 * 
 * @example
 * ```typescript
 * const speed = calculatePlayerMovementSpeed(player);
 * if (speed < 80) {
 *   console.log("Player is moving slowly due to injuries");
 * }
 * ```
 * 
 * @public
 * @korean 플레이어속도계산
 */
export function calculatePlayerMovementSpeed(
  player: PlayerState,
  baseSpeed: number = 100
): number {
  const physical = getPlayerPhysicalAttributes(player);
  
  // Calculate base speed from physical attributes
  let speed = calculateMovementSpeed(physical, baseSpeed);
  
  // Apply stamina penalty if low
  if (player.stamina < 30) {
    const staminaFactor = player.stamina / 30; // 0.0 to 1.0
    speed *= Math.max(0.5, staminaFactor); // Minimum 50% speed
  }
  
  // Apply consciousness penalty
  if (player.consciousness < 50) {
    const consciousnessFactor = player.consciousness / 50;
    speed *= Math.max(0.3, consciousnessFactor); // Minimum 30% speed
  }
  
  // Apply pain penalty
  if (player.pain > 30) {
    const painFactor = 1.0 - (Math.min(player.pain, 80) / 200);
    speed *= Math.max(0.6, painFactor); // Minimum 60% speed
  }
  
  return speed;
}

/**
 * Calculate damage output for an attack.
 * 
 * **Korean**: 공격 피해량 계산
 * 
 * Determines damage based on attacker's muscle mass, technique skill,
 * and attack power. Returns a damage multiplier to apply to base damage.
 * 
 * @param attacker - Attacking player
 * @returns Damage multiplier
 * 
 * @example
 * ```typescript
 * const baseDamage = 25;
 * const multiplier = calculateAttackDamage(attacker);
 * const finalDamage = baseDamage * multiplier;
 * ```
 * 
 * @public
 * @korean 공격피해계산
 */
export function calculateAttackDamage(attacker: PlayerState): number {
  const physical = getPlayerPhysicalAttributes(attacker);
  
  // Base damage from muscle mass
  let damageMultiplier = calculateDamageModifier(physical);
  
  // Apply attack power stat
  damageMultiplier *= (1.0 + attacker.attackPower / 100);
  
  // Apply technique skill
  damageMultiplier *= (1.0 + attacker.technique / 200);
  
  // Apply momentum bonus
  if (attacker.momentum > 0) {
    damageMultiplier *= (1.0 + Math.min(attacker.momentum, 50) / 100);
  }
  
  return damageMultiplier;
}

/**
 * Calculate defense effectiveness against damage.
 * 
 * **Korean**: 방어 효과 계산
 * 
 * Determines damage reduction based on defender's fat mass, muscle mass,
 * defense stat, and blocking status.
 * 
 * @param defender - Defending player
 * @param isBlocking - Whether player is actively blocking
 * @returns Defense multiplier (reduces incoming damage)
 * 
 * @example
 * ```typescript
 * const incomingDamage = 30;
 * const defenseMultiplier = calculateDefenseEffectiveness(defender, true);
 * const finalDamage = incomingDamage * (1.0 - defenseMultiplier);
 * ```
 * 
 * @public
 * @korean 방어효과계산
 */
export function calculateDefenseEffectiveness(
  defender: PlayerState,
  isBlocking: boolean = false
): number {
  const physical = getPlayerPhysicalAttributes(defender);
  
  // Base defense from body composition
  let defenseReduction = (calculateDefenseModifier(physical) - 1.0) * 0.5;
  
  // Apply defense stat
  defenseReduction += defender.defense / 200;
  
  // Apply blocking bonus
  if (isBlocking) {
    defenseReduction += 0.3; // 30% additional reduction when blocking
  }
  
  // Cap defense reduction at 70%
  return Math.min(defenseReduction, 0.7);
}

/**
 * Calculate stamina drain for an action.
 * 
 * **Korean**: 체력 소모 계산
 * 
 * Determines stamina cost based on action type, player's body composition,
 * and current stamina level.
 * 
 * @param player - Player performing action
 * @param baseStaminaCost - Base stamina cost of action
 * @returns Modified stamina cost
 * 
 * @example
 * ```typescript
 * const kickCost = 15;
 * const actualCost = calculateStaminaDrain(player, kickCost);
 * ```
 * 
 * @public
 * @korean 체력소모계산
 */
export function calculateStaminaDrain(
  player: PlayerState,
  baseStaminaCost: number
): number {
  const physical = getPlayerPhysicalAttributes(player);
  
  // Heavier players and higher fat mass = more stamina drain
  const weightFactor = physical.weight / 75; // Normalized to 75kg
  const fatFactor = 1.0 + (physical.fatMass - 12) / 50;
  
  let staminaCost = baseStaminaCost * weightFactor * fatFactor;
  
  // Increased cost when stamina is low (fatigue penalty)
  if (player.stamina < 30) {
    staminaCost *= 1.5;
  }
  
  return Math.ceil(staminaCost);
}

/**
 * Calculate stamina regeneration rate.
 * 
 * **Korean**: 체력 회복 속도 계산
 * 
 * Determines how fast stamina recovers based on age, fat mass,
 * and current status effects.
 * 
 * @param player - Player recovering stamina
 * @param baseRecoveryRate - Base recovery rate per second (default: 10)
 * @returns Modified recovery rate per second
 * 
 * @example
 * ```typescript
 * const recoveryRate = calculateStaminaRegeneration(player);
 * const newStamina = player.stamina + recoveryRate * deltaTime;
 * ```
 * 
 * @public
 * @korean 체력회복계산
 */
export function calculateStaminaRegeneration(
  player: PlayerState,
  baseRecoveryRate: number = 10
): number {
  const physical = getPlayerPhysicalAttributes(player);
  
  // Base recovery from age and body composition
  let recoveryRate = calculateStaminaRecovery(physical, baseRecoveryRate);
  
  // Apply pain penalty
  if (player.pain > 20) {
    const painFactor = 1.0 - (Math.min(player.pain, 60) / 100);
    recoveryRate *= Math.max(0.5, painFactor);
  }
  
  // Apply consciousness penalty
  if (player.consciousness < 80) {
    const consciousnessFactor = player.consciousness / 80;
    recoveryRate *= Math.max(0.6, consciousnessFactor);
  }
  
  // No recovery while stunned
  if (player.isStunned) {
    recoveryRate = 0;
  }
  
  return recoveryRate;
}

/**
 * Check if target is within attack range.
 * 
 * **Korean**: 공격 거리 확인
 * 
 * Validates whether the attacker can reach the defender with the
 * specified attack type.
 * 
 * @param attacker - Attacking player
 * @param defender - Target player
 * @param attackType - Type of attack
 * @param extension - Limb extension percentage (default: 0.9)
 * @returns True if target is within range
 * 
 * @example
 * ```typescript
 * if (isWithinAttackRange(player, opponent, CombatAttackType.KICK)) {
 *   executeKick(player, opponent);
 * } else {
 *   console.log("Target too far for kick");
 * }
 * ```
 * 
 * @public
 * @korean 거리확인
 */
export function isWithinAttackRange(
  attacker: PlayerState,
  defender: PlayerState,
  attackType: CombatAttackType,
  extension: number = 0.9
): boolean {
  const attackRange = calculateAttackRange(attacker, attackType, extension);
  
  // Calculate distance between players
  const dx = defender.position.x - attacker.position.x;
  const dy = defender.position.y - attacker.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Convert cm to pixels (assuming 1cm = 2 pixels for game scale)
  const rangeInPixels = attackRange * 2;
  
  return distance <= rangeInPixels;
}

/**
 * Calculate optimal attack distance based on player physique.
 * 
 * **Korean**: 최적 공격 거리 계산
 * 
 * Determines the ideal distance for a player to fight at based on
 * their limb lengths and combat style.
 * 
 * @param player - Player state
 * @returns Optimal fighting distance in pixels
 * 
 * @example
 * ```typescript
 * const optimalDist = calculateOptimalAttackDistance(player);
 * // AI can use this to maintain ideal spacing
 * ```
 * 
 * @public
 * @korean 최적거리계산
 */
export function calculateOptimalAttackDistance(player: PlayerState): number {
  const physical = getPlayerPhysicalAttributes(player);
  
  // Longer reach = prefer longer distance
  const avgLimbLength = (physical.legLength + physical.armLength) / 2;
  
  // Convert to pixels (1cm = 2 pixels) and add safety margin
  const optimalDistanceCm = avgLimbLength * 0.8; // 80% of max reach
  const optimalDistancePixels = optimalDistanceCm * 2;
  
  return optimalDistancePixels;
}

/**
 * Calculate weight class difference bonus/penalty.
 * 
 * **Korean**: 체급 차이 계산
 * 
 * Determines advantage or disadvantage from weight difference in
 * grappling and throwing scenarios.
 * 
 * @param attacker - Attacking player
 * @param defender - Defending player
 * @returns Weight advantage multiplier (1.0 = equal, >1.0 = advantage)
 * 
 * @example
 * ```typescript
 * const weightAdvantage = calculateWeightAdvantage(player, opponent);
 * const throwDamage = baseDamage * weightAdvantage;
 * ```
 * 
 * @public
 * @korean 체급계산
 */
export function calculateWeightAdvantage(
  attacker: PlayerState,
  defender: PlayerState
): number {
  const attackerPhysical = getPlayerPhysicalAttributes(attacker);
  const defenderPhysical = getPlayerPhysicalAttributes(defender);
  
  const weightDiff = attackerPhysical.weight - defenderPhysical.weight;
  
  // Every 5kg difference = 5% advantage/disadvantage
  const advantagePercent = (weightDiff / 5) * 0.05;
  
  // Cap at +/- 30%
  const cappedAdvantage = Math.max(-0.3, Math.min(0.3, advantagePercent));
  
  return 1.0 + cappedAdvantage;
}
