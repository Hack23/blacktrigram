/**
 * ## Training Calculation Utilities
 *
 * **Business Purpose:**
 * Mathematical functions for authentic Korean martial arts training calculations
 * following traditional Korean martial arts progression principles.
 */

import { TrigramStance, PlayerArchetype } from "../../../../types/enums";
import type { PlayerState } from "../../../../types/player";

export const calculateTechniqueAccuracy = (
  player: PlayerState,
  stance: TrigramStance,
  difficulty: number
): number => {
  const baseAccuracy = player.technique / 100;
  const stanceBonus = getStanceMastery(player.archetype, stance);
  const difficultyPenalty = 1 - (difficulty - 1) * 0.1;

  return Math.min(1.0, baseAccuracy * stanceBonus * difficultyPenalty);
};

export const getStanceMastery = (
  archetype: PlayerArchetype,
  stance: TrigramStance
): number => {
  const masteryMap = {
    [PlayerArchetype.MUSA]: {
      [TrigramStance.GEON]: 1.3,
      [TrigramStance.GAN]: 1.2,
    },
    [PlayerArchetype.AMSALJA]: {
      [TrigramStance.SON]: 1.4,
      [TrigramStance.GAM]: 1.2,
    },
    // ...other archetypes
  };

  return masteryMap[archetype]?.[stance] || 1.0;
};

export const calculateExperienceGain = (
  accuracy: number,
  perfect: boolean,
  combo: number
): number => {
  let baseExp = 10;
  baseExp += Math.floor(accuracy * 20);
  if (perfect) baseExp += 15;
  if (combo > 1) baseExp += Math.min(combo * 2, 20);

  return baseExp;
};
