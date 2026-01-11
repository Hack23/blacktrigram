/**
 * ☱ Tae (태) - Lake Stance Techniques
 *
 * Fluid joint manipulation techniques based on Hapkido.
 * Represents water's adaptability and yielding nature.
 *
 * 태괘 - 연못: 합기도 관절기 기술
 *
 * @module systems/trigram/techniques/TaeTechniques
 * @korean 태괘기술
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * ☱ TAE (태) - LAKE: Fluid Joint Manipulation
 *
 * Hapkido-based joint locks and manipulations.
 * Element: Lake (연못)
 * Philosophy: Yield to control, redirect opponent's force
 *
 * @korean 태괘 - 연못: 유동적인 관절기 기술 (합기도)
 */
export const TAE_TECHNIQUES: readonly KoreanTechnique[] = [
  {
    id: "tae_flowing_strikes",
    name: {
      korean: "유수연타",
      english: "Flowing Strikes",
      romanized: "yusu_yeonta",
    },
    koreanName: "유수연타",
    englishName: "Flowing Strikes",
    romanized: "yusu_yeonta",
    description: {
      korean: "물의 흐름처럼 연속적인 타격",
      english: "Continuous strikes like flowing water",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 25,
    kiCost: 12,
    staminaCost: 18,
    accuracy: 0.85,
    range: 1.0,
    executionTime: 600,
    recoveryTime: 1000,
    critChance: 0.08,
    critMultiplier: 1.3,
    effects: [],
    animationType: AnimationType.CROSS,
    animationSpeed: 1.2,
  },
  {
    id: "tae_wrist_lock",
    name: {
      korean: "손목꺾기",
      english: "Wrist Lock",
      romanized: "sonmok-kkeokgi",
    },
    koreanName: "손목꺾기",
    englishName: "Wrist Lock",
    romanized: "sonmok-kkeokgi",
    description: {
      korean: "합기도 손목 관절기로 상대를 제압",
      english: "Hapkido wrist joint lock for control",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 22,
    kiCost: 10,
    staminaCost: 15,
    accuracy: 0.88,
    range: 0.7,
    executionTime: 700,
    recoveryTime: 1000,
    critChance: 0.12,
    critMultiplier: 1.5,
    effects: [],
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.85,
  },
  {
    id: "tae_small_circle",
    name: {
      korean: "소원법",
      english: "Small Circle Technique",
      romanized: "sowon-beop",
    },
    koreanName: "소원법",
    englishName: "Small Circle Technique",
    romanized: "sowon-beop",
    description: {
      korean: "합기도 소원 기법으로 손목과 팔꿈치를 동시에 제압",
      english: "Hapkido small circle method controlling wrist and elbow",
    },
    stance: TrigramStance.TAE,
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
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.85,
  },
  {
    id: "tae_finger_lock",
    name: {
      korean: "손가락꺾기",
      english: "Finger Lock",
      romanized: "songarak-kkeokgi",
    },
    koreanName: "손가락꺾기",
    englishName: "Finger Lock",
    romanized: "songarak-kkeokgi",
    description: {
      korean: "합기도 소관절기로 손가락을 제압하여 무장 해제",
      english: "Hapkido small joint manipulation for disarming",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 18,
    kiCost: 8,
    staminaCost: 12,
    accuracy: 0.9,
    range: 0.6,
    executionTime: 650,
    recoveryTime: 900,
    critChance: 0.1,
    critMultiplier: 1.4,
    effects: [],
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.9,
  },
  {
    id: "tae_elbow_lock",
    name: {
      korean: "팔꿈치꺾기",
      english: "Elbow Lock",
      romanized: "palkkumchi-kkeokgi",
    },
    koreanName: "팔꿈치꺾기",
    englishName: "Elbow Lock",
    romanized: "palkkumchi-kkeokgi",
    description: {
      korean: "합기도 팔꿈치 관절기로 팔을 과신전시켜 제압",
      english: "Hapkido elbow hyperextension for submission",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 26,
    kiCost: 16,
    staminaCost: 20,
    accuracy: 0.84,
    range: 0.9,
    executionTime: 800,
    recoveryTime: 1150,
    critChance: 0.16,
    critMultiplier: 1.7,
    effects: [],
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.8,
  },
  {
    id: "tae_shoulder_lock",
    name: {
      korean: "어깨꺾기",
      english: "Shoulder Lock",
      romanized: "eokkae-kkeokgi",
    },
    koreanName: "어깨꺾기",
    englishName: "Shoulder Lock",
    romanized: "eokkae-kkeokgi",
    description: {
      korean: "합기도 어깨 관절기로 팔을 뒤로 비틀어 제압",
      english: "Hapkido shoulder manipulation twisting arm behind",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 28,
    kiCost: 18,
    staminaCost: 22,
    accuracy: 0.82,
    range: 1.0,
    executionTime: 850,
    recoveryTime: 1200,
    critChance: 0.18,
    critMultiplier: 1.8,
    effects: [],
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.8,
  },
  {
    id: "tae_arm_bar",
    name: {
      korean: "팔꺾기",
      english: "Arm Bar",
      romanized: "pal-kkeokgi",
    },
    koreanName: "팔꺾기",
    englishName: "Arm Bar",
    romanized: "pal-kkeokgi",
    description: {
      korean: "합기도 팔꺾기로 팔꿈치를 고정하여 항복을 유도",
      english: "Hapkido arm bar immobilizing elbow for submission",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 30,
    kiCost: 20,
    staminaCost: 25,
    accuracy: 0.8,
    range: 1.1,
    executionTime: 900,
    recoveryTime: 1300,
    critChance: 0.2,
    critMultiplier: 1.9,
    effects: [],
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.75,
  },
];
