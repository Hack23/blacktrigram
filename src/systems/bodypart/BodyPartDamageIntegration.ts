/**
 * Body Part Damage Integration for Combat System
 *
 * **Korean**: 신체부위 피해 통합
 *
 * Extends the damage calculation system to apply damage to specific body parts
 * based on vital point hits and attack locations. Integrates with the existing
 * VitalPointSystem and DamageCalculator.
 *
 * @module systems/bodypart/BodyPartDamageIntegration
 * @category Body Part System
 * @korean 신체부위피해통합
 */

import { BodyRegion } from "@/types";
import { PlayerState } from "../player";
import { VitalPoint } from "../vitalpoint/types";
import { bodyPartHealthSystem } from "./BodyPartHealthSystem";
import { BodyPart } from "./types";

/**
 * Map vital point to its corresponding body region.
 *
 * **Korean**: 급소에서 신체 영역 매핑
 *
 * Analyzes a vital point's location and category to determine which
 * BodyRegion it belongs to, enabling proper damage distribution.
 *
 * @param vitalPoint - Vital point that was struck
 * @returns Corresponding body region
 *
 * @public
 */
export function getBodyRegionFromVitalPoint(
  vitalPoint: VitalPoint
): BodyRegion {
  const pointId = vitalPoint.id.toLowerCase();

  // Head region vital points
  if (
    pointId.includes("head_") ||
    pointId.includes("temple") ||
    pointId.includes("jaw") ||
    pointId.includes("crown") ||
    pointId.includes("forehead") ||
    pointId.includes("eye") ||
    pointId.includes("nose") ||
    pointId.includes("ear") ||
    pointId.includes("skull")
  ) {
    return BodyRegion.HEAD;
  }

  // Neck region vital points
  if (
    pointId.includes("neck") ||
    pointId.includes("throat") ||
    pointId.includes("carotid") ||
    pointId.includes("cervical")
  ) {
    return BodyRegion.NECK;
  }

  // Torso region vital points
  if (
    pointId.includes("torso_") ||
    pointId.includes("chest") ||
    pointId.includes("solar_plexus") ||
    pointId.includes("ribs") ||
    pointId.includes("sternum") ||
    pointId.includes("heart") ||
    pointId.includes("lung") ||
    pointId.includes("abdomen")
  ) {
    return BodyRegion.TORSO;
  }

  // Core region vital points
  if (
    pointId.includes("core") ||
    pointId.includes("dantian") ||
    pointId.includes("kidney") ||
    pointId.includes("liver") ||
    pointId.includes("spleen") ||
    pointId.includes("bladder")
  ) {
    return BodyRegion.CORE;
  }

  // Left arm vital points
  if (
    pointId.includes("arm_left") ||
    pointId.includes("left_shoulder") ||
    pointId.includes("left_elbow") ||
    pointId.includes("left_wrist") ||
    pointId.includes("left_hand")
  ) {
    return BodyRegion.LEFT_ARM;
  }

  // Right arm vital points
  if (
    pointId.includes("arm_right") ||
    pointId.includes("right_shoulder") ||
    pointId.includes("right_elbow") ||
    pointId.includes("right_wrist") ||
    pointId.includes("right_hand")
  ) {
    return BodyRegion.RIGHT_ARM;
  }

  // Left leg vital points
  if (
    pointId.includes("leg_left") ||
    pointId.includes("left_knee") ||
    pointId.includes("left_ankle") ||
    pointId.includes("left_foot") ||
    pointId.includes("left_thigh")
  ) {
    return BodyRegion.LEFT_LEG;
  }

  // Right leg vital points
  if (
    pointId.includes("leg_right") ||
    pointId.includes("right_knee") ||
    pointId.includes("right_ankle") ||
    pointId.includes("right_foot") ||
    pointId.includes("right_thigh")
  ) {
    return BodyRegion.RIGHT_LEG;
  }

  // Default to torso for unmatched points
  return BodyRegion.TORSO;
}

/**
 * Apply damage to player's body parts based on hit location.
 *
 * **Korean**: 타격 위치 기반 신체부위 피해 적용
 *
 * Takes total damage and distributes it across body parts according to
 * the hit location. Updates both aggregate health and body part health.
 *
 * For combat compatibility, the aggregate health is directly reduced by
 * the damage amount (traditional behavior), while body part health is
 * updated proportionally for visualization purposes.
 *
 * @param player - Player receiving damage
 * @param totalDamage - Total damage amount
 * @param bodyRegion - Body region that was hit
 * @returns Updated player state with body part damage applied
 *
 * @public
 */
export function applyDamageToBodyParts(
  player: PlayerState,
  totalDamage: number,
  bodyRegion: BodyRegion
): PlayerState {
  // If body part health not initialized, initialize it
  const bodyPartHealth =
    player.bodyPartHealth ?? bodyPartHealthSystem.createDefaultBodyPartHealth();
  const bodyPartMaxHealth =
    player.bodyPartMaxHealth ?? bodyPartHealthSystem.createDefaultMaxHealth();

  // Apply distributed damage to body parts for visualization
  const updatedBodyPartHealth = bodyPartHealthSystem.applyDistributedDamage(
    bodyPartHealth,
    bodyRegion,
    totalDamage,
    bodyPartMaxHealth
  );

  // Calculate new aggregate health directly: traditional damage reduction
  // This ensures combat damage calculations remain consistent
  const newAggregateHealth = Math.max(0, player.health - totalDamage);

  // Update player state with new body part health and aggregate health
  return {
    ...player,
    bodyPartHealth: updatedBodyPartHealth,
    bodyPartMaxHealth,
    health: newAggregateHealth,
  };
}

/**
 * Apply damage from a vital point hit to appropriate body parts.
 *
 * **Korean**: 급소 타격 신체부위 피해 적용
 *
 * Specialized damage application for vital point strikes. Maps the vital
 * point to its body region and applies damage with appropriate distribution.
 *
 * @param player - Player receiving damage
 * @param totalDamage - Total damage amount
 * @param vitalPoint - Vital point that was struck
 * @returns Updated player state with vital point damage applied
 *
 * @public
 */
export function applyVitalPointDamageToBodyParts(
  player: PlayerState,
  totalDamage: number,
  vitalPoint: VitalPoint
): PlayerState {
  const bodyRegion = getBodyRegionFromVitalPoint(vitalPoint);
  return applyDamageToBodyParts(player, totalDamage, bodyRegion);
}

/**
 * Get combat capability modifiers from body part health.
 *
 * **Korean**: 신체부위 전투 능력 수정치 조회
 *
 * Calculates how body part damage affects combat capabilities.
 * Returns modifiers that should be applied to:
 * - Consciousness (awareness, reaction time)
 * - Stamina regeneration
 * - Attack damage output
 * - Movement speed
 * - Balance and stability
 * - Technique accuracy
 *
 * @param player - Player state to analyze
 * @returns Combat capability effect multipliers (0.0-1.0)
 *
 * @example
 * ```typescript
 * const effects = getBodyPartCombatEffects(player);
 * const actualDamage = baseDamage * effects.attackDamageModifier;
 * const actualSpeed = baseSpeed * effects.movementSpeedModifier;
 * ```
 *
 * @public
 */
export function getBodyPartCombatEffects(player: PlayerState) {
  // If no body part health, return no effects
  if (!player.bodyPartHealth) {
    return {
      consciousnessModifier: 1.0,
      staminaRegenModifier: 1.0,
      attackDamageModifier: 1.0,
      movementSpeedModifier: 1.0,
      balanceModifier: 1.0,
      techniqueAccuracyModifier: 1.0,
    };
  }

  return bodyPartHealthSystem.calculateBodyPartEffects(
    player.bodyPartHealth,
    player.bodyPartMaxHealth
  );
}

/**
 * Check if player is incapacitated by body part damage.
 *
 * **Korean**: 신체부위 무력화 확인
 *
 * Determines if the player can continue fighting based on body part health.
 * Player is incapacitated if:
 * - Head is at 0 HP (unconscious)
 * - Both legs are at 0 HP (cannot stand)
 * - Aggregate health is below 10%
 *
 * @param player - Player state to check
 * @returns Whether player is incapacitated
 *
 * @public
 */
export function isPlayerIncapacitatedByBodyDamage(
  player: PlayerState
): boolean {
  if (!player.bodyPartHealth) {
    return false; // No body part system = use aggregate health only
  }

  return bodyPartHealthSystem.isIncapacitated(player.bodyPartHealth);
}

/**
 * Initialize body part health for a player.
 *
 * **Korean**: 플레이어 신체부위 체력 초기화
 *
 * Sets up body part health and max health for a player if not already present.
 * Uses the provided max health or defaults to 100 per part.
 *
 * @param player - Player state to initialize
 * @param maxHealthPerPart - Optional custom max health per part
 * @returns Player state with body part health initialized
 *
 * @public
 */
export function initializeBodyPartHealthForPlayer(
  player: PlayerState,
  maxHealthPerPart: number = 100
): PlayerState {
  // Skip if already initialized
  if (player.bodyPartHealth && player.bodyPartMaxHealth) {
    return player;
  }

  const bodyPartHealth =
    bodyPartHealthSystem.createDefaultBodyPartHealth(maxHealthPerPart);
  const bodyPartMaxHealth =
    bodyPartHealthSystem.createDefaultMaxHealth(maxHealthPerPart);

  return {
    ...player,
    bodyPartHealth,
    bodyPartMaxHealth,
    health: bodyPartHealthSystem.calculateAggregateHealth(bodyPartHealth),
  };
}

/**
 * Heal body parts proportionally based on total healing amount.
 *
 * **Korean**: 신체부위 비례 치유
 *
 * Distributes healing across all damaged body parts proportionally to
 * their damage level. Most damaged parts receive more healing.
 *
 * @param player - Player state to heal
 * @param totalHealAmount - Total healing to distribute
 * @returns Updated player state with healing applied
 *
 * @public
 */
export function healBodyPartsProportionally(
  player: PlayerState,
  totalHealAmount: number
): PlayerState {
  if (!player.bodyPartHealth || !player.bodyPartMaxHealth) {
    return player; // No body part system active
  }

  const bodyPartHealth = player.bodyPartHealth;
  const bodyPartMaxHealth = player.bodyPartMaxHealth;

  // Calculate total missing health across all parts
  const missingHealth = (Object.keys(bodyPartHealth) as BodyPart[]).reduce(
    (sum, part) => {
      return sum + (bodyPartMaxHealth[part] - bodyPartHealth[part]);
    },
    0
  );

  // If no damage, return unchanged
  if (missingHealth <= 0) {
    return player;
  }

  // Heal each part proportionally to its damage
  let updatedHealth = { ...bodyPartHealth };

  (Object.keys(bodyPartHealth) as BodyPart[]).forEach((part) => {
    const partMissingHealth = bodyPartMaxHealth[part] - bodyPartHealth[part];
    if (partMissingHealth > 0) {
      const proportion = partMissingHealth / missingHealth;
      const healForThisPart = totalHealAmount * proportion;
      updatedHealth = bodyPartHealthSystem.healBodyPart(
        updatedHealth,
        part,
        healForThisPart,
        bodyPartMaxHealth
      );
    }
  });

  // Calculate new aggregate health
  const newAggregateHealth =
    bodyPartHealthSystem.calculateAggregateHealth(updatedHealth);

  return {
    ...player,
    bodyPartHealth: updatedHealth,
    health: newAggregateHealth,
  };
}
