/**
 * ☶ 간 (GAN) - Mountain Stance Techniques
 * 반석방어 - Immovable Defense (Hapkido Defensive Mastery)
 *
 * The Mountain stance (간괘) embodies immovable defense and patient counter.
 * Based on Hapkido (합기도) defensive principles - rooted and unshakeable
 * like a mountain, waiting for the perfect moment to counter.
 *
 * Philosophy: "산처럼 굳건히 서서 때를 기다려라"
 *             Stand firm like a mountain and wait for the moment
 *
 * @module GanTechniques
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * GAN stance techniques - Mountain / Immovable Defense
 * Hapkido defensive mastery and patient counters
 *
 * Technique characteristics:
 * - Superior blocking capability
 * - Rooted defensive stances
 * - Devastating counter-attacks
 * - Control through position
 *
 * Animation speeds are calibrated for defensive timing:
 * - Quick defense: 1.1-1.2 (rapid blocks)
 * - Normal: 1.0 (standard defense)
 * - Powerful counter: 0.9-1.0 (deliberate strikes)
 */
export const GAN_TECHNIQUES: readonly KoreanTechnique[] = [
  // ============= Primary Technique =============
  {
    id: "gan_rock_defense",
    name: {
      korean: "반석방어",
      english: "Rock Defense",
      romanized: "banseok_bangeo",
    },
    koreanName: "반석방어",
    englishName: "Rock Defense",
    romanized: "banseok_bangeo",
    description: {
      korean: "바위처럼 견고한 방어 자세",
      english: "Solid defense like a rock",
    },
    stance: TrigramStance.GAN,
    type: CombatAttackType.BLOCK,
    damageType: DamageType.BLUNT,
    damage: 15,
    kiCost: 5,
    staminaCost: 8,
    accuracy: 0.95,
    range: 0.5,
    executionTime: 300,
    recoveryTime: 500,
    critChance: 0.02,
    critMultiplier: 1.0,
    effects: [],
    // Animation: Solid blocking stance
    animationType: AnimationType.BLOCK,
    animationSpeed: 1.2,
  },

  // ============= Defensive Stance Techniques =============
  {
    id: "gan_immovable_stance",
    name: {
      korean: "부동자세",
      english: "Immovable Stance",
      romanized: "budong-jase",
    },
    koreanName: "부동자세",
    englishName: "Immovable Stance",
    romanized: "budong-jase",
    description: {
      korean: "산처럼 움직이지 않는 견고한 방어 자세",
      english: "Immovable defensive stance like a mountain",
    },
    stance: TrigramStance.GAN,
    type: CombatAttackType.BLOCK,
    damageType: DamageType.BLUNT,
    damage: 12,
    kiCost: 8,
    staminaCost: 10,
    accuracy: 0.98,
    range: 0.5,
    executionTime: 250,
    recoveryTime: 450,
    critChance: 0.04,
    critMultiplier: 1.1,
    effects: [],
    // Animation: Rooted defensive stance
    animationType: AnimationType.BLOCK,
    animationSpeed: 1.0,
  },
  {
    id: "gan_iron_block",
    name: {
      korean: "철벽막기",
      english: "Iron Wall Block",
      romanized: "cheolbyeok-makgi",
    },
    koreanName: "철벽막기",
    englishName: "Iron Wall Block",
    romanized: "cheolbyeok-makgi",
    description: {
      korean: "합기도 강력한 막기로 공격을 완전히 차단",
      english: "Hapkido powerful block completely stopping attack",
    },
    stance: TrigramStance.GAN,
    type: CombatAttackType.BLOCK,
    damageType: DamageType.BLUNT,
    damage: 20,
    kiCost: 12,
    staminaCost: 15,
    accuracy: 0.94,
    range: 0.6,
    executionTime: 400,
    recoveryTime: 650,
    critChance: 0.06,
    critMultiplier: 1.2,
    effects: [],
    // Animation: Powerful blocking motion
    animationType: AnimationType.BLOCK,
    animationSpeed: 1.1,
  },

  // ============= Counter-Attack Techniques =============
  {
    id: "gan_counter_strike",
    name: {
      korean: "반격타",
      english: "Counter Strike",
      romanized: "bangyeok-ta",
    },
    koreanName: "반격타",
    englishName: "Counter Strike",
    romanized: "bangyeok-ta",
    description: {
      korean: "방어 후 즉시 가하는 강력한 반격",
      english: "Powerful counter strike immediately after defense",
    },
    stance: TrigramStance.GAN,
    type: CombatAttackType.COUNTER_ATTACK,
    damageType: DamageType.BLUNT,
    damage: 30,
    kiCost: 16,
    staminaCost: 20,
    accuracy: 0.88,
    range: 1.0,
    executionTime: 600,
    recoveryTime: 950,
    critChance: 0.2,
    critMultiplier: 1.9,
    effects: [],
    // Animation: Powerful counter attack
    animationType: AnimationType.COUNTER_STRIKE,
    animationSpeed: 1.0,
  },
  {
    id: "gan_reversal_technique",
    name: {
      korean: "역기술",
      english: "Reversal Technique",
      romanized: "yeok-gisul",
    },
    koreanName: "역기술",
    englishName: "Reversal Technique",
    romanized: "yeok-gisul",
    description: {
      korean: "상대의 공격을 받아 역으로 제압",
      english: "Receiving attack and reversing into control",
    },
    stance: TrigramStance.GAN,
    type: CombatAttackType.COUNTER_ATTACK,
    damageType: DamageType.JOINT,
    damage: 28,
    kiCost: 18,
    staminaCost: 22,
    accuracy: 0.84,
    range: 0.9,
    executionTime: 800,
    recoveryTime: 1200,
    critChance: 0.18,
    critMultiplier: 1.8,
    effects: [],
    // Animation: Reversal motion
    animationType: AnimationType.COUNTER_STRIKE,
    animationSpeed: 0.9,
  },

  // ============= Grappling Control =============
  {
    id: "gan_mountain_stance_lock",
    name: {
      korean: "산세고정",
      english: "Mountain Stance Lock",
      romanized: "sanse-gojeong",
    },
    koreanName: "산세고정",
    englishName: "Mountain Stance Lock",
    romanized: "sanse-gojeong",
    description: {
      korean: "합기도 방어 자세에서 상대를 고정하고 제압",
      english: "Hapkido defensive position locking and controlling opponent",
    },
    stance: TrigramStance.GAN,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 24,
    kiCost: 14,
    staminaCost: 18,
    accuracy: 0.86,
    range: 0.8,
    executionTime: 750,
    recoveryTime: 1100,
    critChance: 0.14,
    critMultiplier: 1.6,
    effects: [],
    // Animation: Standing control position
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.9,
  },
] as const;

/**
 * Get GAN techniques count
 */
export const GAN_TECHNIQUE_COUNT = GAN_TECHNIQUES.length;

/**
 * Get GAN technique by ID
 */
export function getGanTechniqueById(id: string): KoreanTechnique | undefined {
  return GAN_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all GAN techniques by attack type
 */
export function getGanTechniquesByType(
  type: CombatAttackType
): readonly KoreanTechnique[] {
  return GAN_TECHNIQUES.filter((t) => t.type === type);
}
