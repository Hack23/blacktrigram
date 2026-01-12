/**
 * ☵ 감 (GAM) - Water Stance Techniques
 * 수류반격 - Adaptive Flow (Hapkido Redirect & Counter)
 *
 * The Water stance (감괘) embodies adaptation and redirection.
 * Based on Hapkido (합기도) principles of using opponent's force
 * against them, flowing around attacks like water around rocks.
 *
 * Philosophy: "물처럼 흘러 적의 힘을 이용하라"
 *             Flow like water and use the enemy's force
 *
 * @module GamTechniques
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * GAM stance techniques - Water / Adaptive Flow
 * Hapkido redirect and counter techniques
 *
 * Technique characteristics:
 * - Counter-attack focus
 * - Force redirection
 * - Flowing defense-to-offense
 * - Throws using opponent's momentum
 *
 * Animation speeds are calibrated for flowing responses:
 * - Reactive: 1.1-1.2 (quick counters)
 * - Normal: 1.0 (standard redirects)
 * - Controlled: 0.9 (throwing techniques)
 */
export const GAM_TECHNIQUES: readonly KoreanTechnique[] = [
  // ============= Primary Technique =============
  {
    id: "gam_water_counter",
    name: {
      korean: "수류반격",
      english: "Water Counter",
      romanized: "suryu_bangyeok",
    },
    koreanName: "수류반격",
    englishName: "Water Counter",
    romanized: "suryu_bangyeok",
    description: {
      korean: "물의 흐름으로 적의 공격을 받아넘기는 반격",
      english: "Counter-attack that flows like water",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.COUNTER_ATTACK,
    damageType: DamageType.BLUNT,
    damage: 32,
    kiCost: 20,
    staminaCost: 12,
    accuracy: 0.85,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 600,
    recoveryTime: 900,
    critChance: 0.18,
    critMultiplier: 1.7,
    effects: [],
    // Animation: Flowing counter-attack
    animationType: AnimationType.COUNTER_STRIKE,
    animationSpeed: 1.1,
  },

  // ============= Throwing Techniques =============
  {
    id: "gam_redirect_throw",
    name: {
      korean: "유도던지기",
      english: "Redirect Throw",
      romanized: "yudo-deonjigi",
    },
    koreanName: "유도던지기",
    englishName: "Redirect Throw",
    romanized: "yudo-deonjigi",
    description: {
      korean: "합기도 방향전환으로 상대의 힘을 이용해 던짐",
      english: "Hapkido redirect using opponent's force for throw",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.THROW,
    damageType: DamageType.BLUNT,
    damage: 30,
    kiCost: 18,
    staminaCost: 24,
    accuracy: 0.82,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.7,
    },
    executionTime: 850,
    recoveryTime: 1200,
    critChance: 0.16,
    critMultiplier: 1.8,
    effects: [],
    // Animation: Redirect throw motion
    animationType: AnimationType.THROW,
    animationSpeed: 0.9,
  },
  {
    id: "gam_hip_throw",
    name: {
      korean: "허리던지기",
      english: "Hip Throw",
      romanized: "heori-deonjigi",
    },
    koreanName: "허리던지기",
    englishName: "Hip Throw",
    romanized: "heori-deonjigi",
    description: {
      korean: "합기도 허리 던지기로 상대를 제압",
      english: "Hapkido hip throw for control",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.THROW,
    damageType: DamageType.BLUNT,
    damage: 34,
    kiCost: 22,
    staminaCost: 28,
    accuracy: 0.8,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.7,
    },
    executionTime: 900,
    recoveryTime: 1300,
    critChance: 0.2,
    critMultiplier: 1.9,
    effects: [],
    // Animation: Hip throw motion
    animationType: AnimationType.THROW,
    animationSpeed: 0.85,
  },

  // ============= Blocking & Parry Techniques =============
  {
    id: "gam_flowing_block",
    name: {
      korean: "유수막기",
      english: "Flowing Block",
      romanized: "yusu-makgi",
    },
    koreanName: "유수막기",
    englishName: "Flowing Block",
    romanized: "yusu-makgi",
    description: {
      korean: "물의 흐름처럼 부드럽게 막고 반격",
      english: "Soft flowing block leading to counter",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.BLOCK,
    damageType: DamageType.BLUNT,
    damage: 18,
    kiCost: 10,
    staminaCost: 15,
    accuracy: 0.92,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 400,
    recoveryTime: 700,
    critChance: 0.08,
    critMultiplier: 1.3,
    effects: [],
    // Animation: Soft blocking motion
    animationType: AnimationType.BLOCK,
    animationSpeed: 1.0,
  },
  {
    id: "gam_circular_parry",
    name: {
      korean: "원형받기",
      english: "Circular Parry",
      romanized: "wonhyeong-batgi",
    },
    koreanName: "원형받기",
    englishName: "Circular Parry",
    romanized: "wonhyeong-batgi",
    description: {
      korean: "합기도 원형 움직임으로 공격을 무력화",
      english: "Hapkido circular motion neutralizing attack",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.COUNTER_ATTACK,
    damageType: DamageType.PRESSURE,
    damage: 24,
    kiCost: 14,
    staminaCost: 18,
    accuracy: 0.88,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 550,
    recoveryTime: 850,
    critChance: 0.12,
    critMultiplier: 1.5,
    effects: [],
    // Animation: Circular parry motion
    animationType: AnimationType.COUNTER_STRIKE,
    animationSpeed: 1.0,
  },

  // ============= Joint Control Counter =============
  {
    id: "gam_wrist_twist_counter",
    name: {
      korean: "손목비틀기반격",
      english: "Wrist Twist Counter",
      romanized: "sonmok-biteulgi-bangyeok",
    },
    koreanName: "손목비틀기반격",
    englishName: "Wrist Twist Counter",
    romanized: "sonmok-biteulgi-bangyeok",
    description: {
      korean: "공격을 받아 손목을 비틀어 반격",
      english: "Counter by catching and twisting wrist",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.COUNTER_ATTACK,
    damageType: DamageType.JOINT,
    damage: 28,
    kiCost: 16,
    staminaCost: 20,
    accuracy: 0.86,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.65,
    },
    executionTime: 700,
    recoveryTime: 1000,
    critChance: 0.16,
    critMultiplier: 1.7,
    effects: [],
    // Animation: Wrist control transition
    animationType: AnimationType.WRIST_LOCK,
    animationSpeed: 1.0,
  },
] as const;

/**
 * Get GAM techniques count
 */
export const GAM_TECHNIQUE_COUNT = GAM_TECHNIQUES.length;

/**
 * Get GAM technique by ID
 */
export function getGamTechniqueById(id: string): KoreanTechnique | undefined {
  return GAM_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all GAM techniques by attack type
 */
export function getGamTechniquesByType(
  type: CombatAttackType
): readonly KoreanTechnique[] {
  return GAM_TECHNIQUES.filter((t) => t.type === type);
}
