/**
 * ☷ 곤 (GON) - Earth Stance Techniques
 * 대지포옹 - Grounding & Takedowns (Ssireum/Hapkido Throws)
 *
 * The Earth stance (곤괘) embodies grounding and powerful takedowns.
 * Based on Ssireum (씨름) traditional Korean wrestling and Hapkido throws,
 * connecting with the earth to uproot and control opponents.
 *
 * Philosophy: "대지와 하나되어 적을 쓰러뜨려라"
 *             Become one with the earth and bring down the enemy
 *
 * @module GonTechniques
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * GON stance techniques - Earth / Grounding & Takedowns
 * Ssireum wrestling and Hapkido throws
 *
 * Technique characteristics:
 * - Powerful takedowns
 * - Ssireum wrestling throws
 * - Ground control techniques
 * - Heavy impact throws
 *
 * Animation speeds are calibrated for power and control:
 * - Setup: 0.8-0.9 (positioning for throw)
 * - Normal: 1.0 (standard grappling)
 * - Impact: 1.1 (explosive finish)
 */
export const GON_TECHNIQUES: readonly KoreanTechnique[] = [
  // ============= Primary Technique =============
  {
    id: "gon_earth_embrace",
    name: {
      korean: "대지포옹",
      english: "Earth Embrace",
      romanized: "daeji_pooong",
    },
    koreanName: "대지포옹",
    englishName: "Earth Embrace",
    romanized: "daeji_pooong",
    description: {
      korean: "대지의 힘으로 상대를 제압하는 기술",
      english: "Grappling technique using earth's power",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.BLUNT,
    damage: 26,
    kiCost: 16,
    staminaCost: 22,
    accuracy: 0.72,
    range: 0.7,
    executionTime: 900,
    recoveryTime: 1300,
    critChance: 0.08,
    critMultiplier: 1.4,
    effects: [],
    // Animation: Clinch grapple position
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.9,
  },

  // ============= Leg Techniques =============
  {
    id: "gon_leg_sweep",
    name: {
      korean: "다리걸기",
      english: "Leg Sweep",
      romanized: "dari-geolgi",
    },
    koreanName: "다리걸기",
    englishName: "Leg Sweep",
    romanized: "dari-geolgi",
    description: {
      korean: "상대의 다리를 걸어 넘어뜨리는 기술",
      english: "Sweeping opponent's leg for takedown",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 22,
    kiCost: 12,
    staminaCost: 18,
    accuracy: 0.8,
    range: 1.2,
    executionTime: 650,
    recoveryTime: 950,
    critChance: 0.12,
    critMultiplier: 1.5,
    effects: [],
    // Animation: Reaping leg sweep
    animationType: AnimationType.LOW_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "gon_ankle_pick",
    name: {
      korean: "발목잡기",
      english: "Ankle Pick",
      romanized: "balmok-japgi",
    },
    koreanName: "발목잡기",
    englishName: "Ankle Pick",
    romanized: "balmok-japgi",
    description: {
      korean: "발목을 잡아 상대를 넘어뜨리는 기술",
      english: "Grabbing ankle to take opponent down",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.BLUNT,
    damage: 24,
    kiCost: 14,
    staminaCost: 20,
    accuracy: 0.82,
    range: 0.8,
    executionTime: 700,
    recoveryTime: 1000,
    critChance: 0.14,
    critMultiplier: 1.6,
    effects: [],
    // Animation: Low shooting motion
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 1.1,
  },

  // ============= Ssireum Throwing Techniques =============
  {
    id: "gon_ssireum_throw",
    name: {
      korean: "씨름던지기",
      english: "Ssireum Throw",
      romanized: "ssireum-deonjigi",
    },
    koreanName: "씨름던지기",
    englishName: "Ssireum Throw",
    romanized: "ssireum-deonjigi",
    description: {
      korean: "한국 전통 씨름의 던지기 기술",
      english: "Traditional Korean wrestling throw",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.THROW,
    damageType: DamageType.BLUNT,
    damage: 32,
    kiCost: 20,
    staminaCost: 28,
    accuracy: 0.76,
    range: 0.9,
    executionTime: 850,
    recoveryTime: 1250,
    critChance: 0.16,
    critMultiplier: 1.7,
    effects: [],
    // Animation: Traditional belt throw
    animationType: AnimationType.THROW,
    animationSpeed: 0.9,
  },
  {
    id: "gon_ground_pound",
    name: {
      korean: "대지강타",
      english: "Ground Pound",
      romanized: "daeji-gangta",
    },
    koreanName: "대지강타",
    englishName: "Ground Pound",
    romanized: "daeji-gangta",
    description: {
      korean: "상대를 땅에 내리찍는 강력한 던지기",
      english: "Powerful throw slamming opponent to ground",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.THROW,
    damageType: DamageType.CRUSHING,
    damage: 36,
    kiCost: 24,
    staminaCost: 32,
    accuracy: 0.72,
    range: 1.0,
    executionTime: 1000,
    recoveryTime: 1400,
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    // Animation: Slam throw
    animationType: AnimationType.SLAM,
    animationSpeed: 1.0,
  },
  {
    id: "gon_body_lock_takedown",
    name: {
      korean: "몸통잡기넘어뜨리기",
      english: "Body Lock Takedown",
      romanized: "momtong-japgi-neomeotteurigi",
    },
    koreanName: "몸통잡기넘어뜨리기",
    englishName: "Body Lock Takedown",
    romanized: "momtong-japgi-neomeotteurigi",
    description: {
      korean: "몸통을 감싸 잡고 넘어뜨리는 씨름 기술",
      english: "Ssireum technique grabbing torso for takedown",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.BLUNT,
    damage: 28,
    kiCost: 18,
    staminaCost: 24,
    accuracy: 0.78,
    range: 0.9,
    executionTime: 800,
    recoveryTime: 1150,
    critChance: 0.16,
    critMultiplier: 1.7,
    effects: [],
    // Animation: Body lock clinch
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.9,
  },
  {
    id: "gon_sacrifice_throw",
    name: {
      korean: "희생던지기",
      english: "Sacrifice Throw",
      romanized: "huisaeng-deonjigi",
    },
    koreanName: "희생던지기",
    englishName: "Sacrifice Throw",
    romanized: "huisaeng-deonjigi",
    description: {
      korean: "자신을 희생하여 상대를 크게 던지는 기술",
      english: "Sacrificing position to execute large throw",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.THROW,
    damageType: DamageType.BLUNT,
    damage: 34,
    kiCost: 22,
    staminaCost: 30,
    accuracy: 0.74,
    range: 1.1,
    executionTime: 950,
    recoveryTime: 1350,
    critChance: 0.18,
    critMultiplier: 1.9,
    effects: [],
    // Animation: Sacrifice throw motion
    animationType: AnimationType.THROW,
    animationSpeed: 1.0,
  },
] as const;

/**
 * Get GON techniques count
 */
export const GON_TECHNIQUE_COUNT = GON_TECHNIQUES.length;

/**
 * Get GON technique by ID
 */
export function getGonTechniqueById(id: string): KoreanTechnique | undefined {
  return GON_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all GON techniques by attack type
 */
export function getGonTechniquesByType(
  type: CombatAttackType
): readonly KoreanTechnique[] {
  return GON_TECHNIQUES.filter((t) => t.type === type);
}
