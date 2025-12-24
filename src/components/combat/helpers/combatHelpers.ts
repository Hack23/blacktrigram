/**
 * CombatScreen3D Helper Utilities
 *
 * Extracted helper functions and constants from CombatScreen3D
 * for better code organization and maintainability.
 *
 * @module components/combat/helpers/combatHelpers
 * @category Combat Utilities
 * @korean 전투화면도우미
 */

import { PlayerState } from "../../../systems";
import { TrigramStance } from "../../../types";
import { TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";

/**
 * Map of trigram stances to their array indices for fast lookups
 */
export const STANCE_INDEX_MAP = new Map<TrigramStance, number>();
TRIGRAM_STANCES_ORDER.forEach((stance, index) => {
  STANCE_INDEX_MAP.set(stance, index);
});

/**
 * Round announcement fade-out delay (in milliseconds)
 * Wait for previous announcement to fully fade out before showing next one
 */
export const ANNOUNCEMENT_FADE_OUT_DELAY = 300;

/**
 * Calculate accuracy percentage for a player
 * Uses hits / (hits + misses) when miss tracking is available
 * Falls back to 100% if hits exist but no miss tracking, or 0% if no combat activity
 *
 * @param player - Player state with combat statistics
 * @returns Accuracy percentage (0-100)
 *
 * @example
 * ```typescript
 * const accuracy = calculateAccuracy(playerState);
 * console.log(`Accuracy: ${accuracy}%`);
 * ```
 */
export const calculateAccuracy = (player: PlayerState): number => {
  const hits = player.hitsLanded ?? 0;
  const misses = player.misses ?? 0;
  const totalAttempts = hits + misses;

  // If we have miss tracking, use proper accuracy formula
  if (totalAttempts > 0) {
    return (hits / totalAttempts) * 100;
  }

  // Fallback: if no miss tracking and hits exist, show 100%
  // Otherwise 0% (no combat activity)
  return hits > 0 ? 100 : 0;
};
