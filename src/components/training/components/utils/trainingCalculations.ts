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
    [PlayerArchetype.HACKER]: {
      [TrigramStance.LI]: 1.4,
      [TrigramStance.JIN]: 1.1,
    },
    [PlayerArchetype.JEONGBO_YOWON]: {
      [TrigramStance.GAM]: 1.3,
      [TrigramStance.TAE]: 1.2,
    },
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
      [TrigramStance.JIN]: 1.3,
      [TrigramStance.GON]: 1.2,
    },
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

export const calculateDamage = (
  baseDamage: number,
  accuracy: number,
  stance: TrigramStance,
  archetype: PlayerArchetype
): number => {
  const stanceMultiplier = getStanceMastery(archetype, stance);
  const accuracyMultiplier = 0.5 + accuracy * 0.5;

  return Math.round(baseDamage * stanceMultiplier * accuracyMultiplier);
};

export default {
  calculateTechniqueAccuracy,
  getStanceMastery,
  calculateExperienceGain,
  calculateDamage,
};
