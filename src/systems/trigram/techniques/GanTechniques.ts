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

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

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
export const GAN_TECHNIQUES: readonly TrigramStanceTechnique[] = [
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 420,
    recoveryTime: 700,
    critChance: 0.02,
    critMultiplier: 1.0,
    effects: [],
    // Combo metadata - Solid defensive base
    comboWindow: 250,
    comboPriority: 1, // Starter - establishes defensive position
    pressureStacks: 1,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "defensive", // Type: shared category
    animationId: "gan_rock_defense", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Solid blocking stance
    animationType: AnimationType.GAN_ROCK_DEFENSE_BLOCK,
    animationSpeed: 0.75,
    category: "light",
    range: "short",
    speed: 1.2,
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 350,
    recoveryTime: 630,
    critChance: 0.04,
    critMultiplier: 1.1,
    effects: [],
    // Combo metadata - Rooted defense stance
    comboWindow: 250,
    comboPriority: 1, // Starter - immovable foundation
    pressureStacks: 1,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "stance", // Type: shared category
    animationId: "gan_immovable_stance", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Rooted defensive stance
    animationType: AnimationType.GAN_IMMOVABLE_STANCE,
    animationSpeed: 0.75,
    category: "light",
    range: "short",
    speed: 1.0,
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
    staminaCost: 14,
    accuracy: 0.94,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 1.05,
    },
    executionTime: 560,
    recoveryTime: 909,
    critChance: 0.06,
    critMultiplier: 1.2,
    effects: [],
    // Combo metadata - Powerful blocking technique
    comboWindow: 250,
    comboPriority: 1, // Starter - wall defense
    pressureStacks: 1,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "defensive", // Type: shared category
    animationId: "gan_iron_block", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Powerful blocking motion (matches TechniqueAnimationMapping)
    animationType: AnimationType.IRON_BLOCK,
    animationSpeed: 0.65,
    category: "light",
    range: "medium",
    speed: 0.85,
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
    accuracy: 0.92,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 1.05,
    },
    executionTime: 840,
    recoveryTime: 1330,
    critChance: 0.26,
    critMultiplier: 2.2,
    effects: [],
    // Combo metadata - Devastating counter strike
    comboWindow: 250,
    comboPriority: 3, // Finisher - powerful counter blow
    pressureStacks: 3,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "counter", // Type: shared category
    animationId: "gan_counter_strike", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Powerful counter attack
    animationType: AnimationType.GAN_COUNTER_STRIKE,
    animationSpeed: 0.75,
    category: "special",
    range: "medium",
    speed: 1.0,
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1120,
    recoveryTime: 1680,
    critChance: 0.18,
    critMultiplier: 1.8,
    effects: [],
    // Combo metadata - Control reversal technique
    comboWindow: 250,
    comboPriority: 2, // Mid-chain - defensive reversal
    pressureStacks: 2,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "counter", // Type: shared category
    animationId: "gan_reversal_technique", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Reversal motion
    animationType: AnimationType.GAN_REVERSAL_TECHNIQUE,
    animationSpeed: 0.7,
    category: "medium",
    range: "short",
    speed: 0.9,
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1050,
    recoveryTime: 1540,
    critChance: 0.14,
    critMultiplier: 1.6,
    effects: [],
    // Combo metadata - Immobilizing lock
    comboWindow: 250,
    comboPriority: 2, // Mid-chain - position control
    pressureStacks: 2,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "grapple", // Type: shared category
    animationId: "gan_mountain_stance_lock", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Standing control position
    animationType: AnimationType.GAN_MOUNTAIN_STANCE_LOCK,
    animationSpeed: 0.7,
    category: "medium",
    range: "short",
    speed: 0.9,
  },
] as const;

/**
 * Get GAN techniques count
 */
export const GAN_TECHNIQUE_COUNT = GAN_TECHNIQUES.length;

/**
 * Get GAN technique by ID
 */
export function getGanTechniqueById(id: string): TrigramStanceTechnique | undefined {
  return GAN_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all GAN techniques by attack type
 */
export function getGanTechniquesByType(
  type: CombatAttackType
): readonly TrigramStanceTechnique[] {
  return GAN_TECHNIQUES.filter((t) => t.type === type);
}
