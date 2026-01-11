/**
 * ☰ Geon (건) - Heaven Stance Techniques
 *
 * Direct force techniques based on Taekwondo power strikes.
 * Represents heavenly power and direct, decisive action.
 *
 * 건괘 - 하늘: 태권도 강력한 타격 기술
 *
 * @module systems/trigram/techniques/GeonTechniques
 * @korean 건괘기술
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * ☰ GEON (건) - HEAVEN: Direct Force Techniques
 *
 * Taekwondo-based power strikes emphasizing direct force.
 * Element: Heaven (하늘)
 * Philosophy: Swift, decisive action with heavenly power
 *
 * @korean 건괘 - 하늘: 직접적인 힘의 기술 (태권도 타격)
 */
export const GEON_TECHNIQUES: readonly KoreanTechnique[] = [
  {
    id: "geon_heaven_strike",
    name: {
      korean: "천둥벽력",
      english: "Thunder Strike",
      romanized: "cheondung_byeokryeok",
    },
    koreanName: "천둥벽력",
    englishName: "Thunder Strike",
    romanized: "cheondung_byeokryeok",
    description: {
      korean: "하늘의 힘을 담은 직접적인 타격",
      english: "Direct strike imbued with heavenly power",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 30,
    kiCost: 15,
    staminaCost: 20,
    accuracy: 0.8,
    range: 1.2,
    executionTime: 800,
    recoveryTime: 1200,
    critChance: 0.1,
    critMultiplier: 1.5,
    effects: [],
    animationType: AnimationType.CROSS,
    animationSpeed: 1.0,
  },
  {
    id: "geon_heavenly_fist",
    name: {
      korean: "천권",
      english: "Heavenly Fist",
      romanized: "cheon-gwon",
    },
    koreanName: "천권",
    englishName: "Heavenly Fist",
    romanized: "cheon-gwon",
    description: {
      korean: "태권도 정권지르기로 머리를 노리는 강력한 주먹 공격",
      english: "Powerful Taekwondo straight punch targeting the head",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.PUNCH,
    damageType: DamageType.BLUNT,
    damage: 28,
    kiCost: 12,
    staminaCost: 15,
    accuracy: 0.85,
    range: 1.0,
    executionTime: 600,
    recoveryTime: 900,
    critChance: 0.12,
    critMultiplier: 1.6,
    effects: [],
    animationType: AnimationType.JAB,
    animationSpeed: 1.1,
  },
  {
    id: "geon_frontal_kick",
    name: {
      korean: "앞차기",
      english: "Front Kick",
      romanized: "ap-chagi",
    },
    koreanName: "앞차기",
    englishName: "Front Kick",
    romanized: "ap-chagi",
    description: {
      korean: "태권도 기본 앞차기로 명치를 타격",
      english: "Taekwondo basic front kick targeting solar plexus",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 32,
    kiCost: 18,
    staminaCost: 22,
    accuracy: 0.82,
    range: 1.5,
    executionTime: 700,
    recoveryTime: 1000,
    critChance: 0.15,
    critMultiplier: 1.7,
    effects: [],
    animationType: AnimationType.FRONT_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "geon_roundhouse_kick",
    name: {
      korean: "돌려차기",
      english: "Roundhouse Kick",
      romanized: "dolryeo-chagi",
    },
    koreanName: "돌려차기",
    englishName: "Roundhouse Kick",
    romanized: "dolryeo-chagi",
    description: {
      korean: "태권도 대표 기술로 관자놀이나 늑골을 타격하는 회전 발차기",
      english: "Signature Taekwondo spinning kick targeting temple or ribs",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 35,
    kiCost: 20,
    staminaCost: 25,
    accuracy: 0.78,
    range: 1.8,
    executionTime: 800,
    recoveryTime: 1100,
    critChance: 0.18,
    critMultiplier: 1.8,
    effects: [],
    animationType: AnimationType.ROUNDHOUSE_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "geon_axe_kick",
    name: {
      korean: "내려차기",
      english: "Axe Kick",
      romanized: "naeryeo-chagi",
    },
    koreanName: "내려차기",
    englishName: "Axe Kick",
    romanized: "naeryeo-chagi",
    description: {
      korean: "위에서 아래로 내리찍는 도끼차기로 정수리나 어깨를 타격",
      english: "Downward axe kick striking crown or shoulder from above",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.KICK,
    damageType: DamageType.CRUSHING,
    damage: 38,
    kiCost: 22,
    staminaCost: 28,
    accuracy: 0.75,
    range: 1.6,
    executionTime: 900,
    recoveryTime: 1200,
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    animationType: AnimationType.AXE_KICK,
    animationSpeed: 0.9,
  },
  {
    id: "geon_palm_strike",
    name: {
      korean: "장권",
      english: "Palm Strike",
      romanized: "jang-gwon",
    },
    koreanName: "장권",
    englishName: "Palm Strike",
    romanized: "jang-gwon",
    description: {
      korean: "태권도 장권으로 턱이나 명치를 타격하는 손바닥 공격",
      english: "Taekwondo palm heel strike targeting jaw or solar plexus",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 30,
    kiCost: 14,
    staminaCost: 18,
    accuracy: 0.88,
    range: 1.1,
    executionTime: 650,
    recoveryTime: 950,
    critChance: 0.14,
    critMultiplier: 1.6,
    effects: [],
    animationType: AnimationType.PALM_STRIKE,
    animationSpeed: 1.0,
  },
  {
    id: "geon_elbow_smash",
    name: {
      korean: "팔꿈치치기",
      english: "Elbow Smash",
      romanized: "palkkumchi-chigi",
    },
    koreanName: "팔꿈치치기",
    englishName: "Elbow Smash",
    romanized: "palkkumchi-chigi",
    description: {
      korean: "근거리에서 팔꿈치로 관자놀이나 턱을 강타",
      english: "Close-range elbow strike to temple or jaw",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.ELBOW,
    damageType: DamageType.BLUNT,
    damage: 33,
    kiCost: 16,
    staminaCost: 20,
    accuracy: 0.86,
    range: 0.8,
    executionTime: 550,
    recoveryTime: 850,
    critChance: 0.16,
    critMultiplier: 1.8,
    effects: [],
    animationType: AnimationType.ELBOW_STRIKE,
    animationSpeed: 1.1,
  },
];
