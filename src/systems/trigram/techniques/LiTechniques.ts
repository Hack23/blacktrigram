/**
 * ☲ Li (리) - Fire Stance Techniques
 *
 * Precision nerve strikes based on Taekwondo accuracy.
 * Represents fire's penetrating and illuminating nature.
 *
 * 리괘 - 불: 태권도 정밀 타격 기술
 *
 * @module systems/trigram/techniques/LiTechniques
 * @korean 리괘기술
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * ☲ LI (리) - FIRE: Precision Nerve Strikes
 *
 * Precise strikes targeting vital points and nerves.
 * Element: Fire (불)
 * Philosophy: Penetrating accuracy, illuminating weakness
 *
 * @korean 리괘 - 불: 정밀한 신경 타격 (태권도 정확성)
 */
export const LI_TECHNIQUES: readonly KoreanTechnique[] = [
  {
    id: "li_flame_spear",
    name: {
      korean: "화염지창",
      english: "Flame Spear",
      romanized: "hwayeom_jichang",
    },
    koreanName: "화염지창",
    englishName: "Flame Spear",
    romanized: "hwayeom_jichang",
    description: {
      korean: "불꽃처럼 정확하고 날카로운 공격",
      english: "Precise and sharp attack like flame",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.THRUST,
    damageType: DamageType.PIERCING,
    damage: 35,
    kiCost: 18,
    staminaCost: 15,
    accuracy: 0.9,
    range: 1.5,
    executionTime: 700,
    recoveryTime: 1100,
    critChance: 0.15,
    critMultiplier: 1.8,
    effects: [],
    animationType: AnimationType.JAB,
    animationSpeed: 1.3,
  },
  {
    id: "li_temple_strike",
    name: {
      korean: "관자놀이타격",
      english: "Temple Strike",
      romanized: "gwanja-nori-tagyeok",
    },
    koreanName: "관자놀이타격",
    englishName: "Temple Strike",
    romanized: "gwanja-nori-tagyeok",
    description: {
      korean: "태권도 역권으로 관자놀이를 정확히 타격",
      english: "Taekwondo back fist precisely targeting temple",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.NERVE,
    damage: 32,
    kiCost: 16,
    staminaCost: 18,
    accuracy: 0.92,
    range: 1.2,
    executionTime: 650,
    recoveryTime: 950,
    critChance: 0.22,
    critMultiplier: 2.0,
    effects: [],
    animationType: AnimationType.ELBOW_STRIKE,
    animationSpeed: 1.1,
  },
  {
    id: "li_nerve_strike",
    name: {
      korean: "신경타격",
      english: "Nerve Strike",
      romanized: "singyeong-tagyeok",
    },
    koreanName: "신경타격",
    englishName: "Nerve Strike",
    romanized: "singyeong-tagyeok",
    description: {
      korean: "정확한 손가락 타격으로 신경을 마비시킴",
      english: "Precise finger strike paralyzing nerves",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.NERVE_STRIKE,
    damageType: DamageType.NERVE,
    damage: 28,
    kiCost: 22,
    staminaCost: 12,
    accuracy: 0.95,
    range: 1.0,
    executionTime: 600,
    recoveryTime: 900,
    critChance: 0.25,
    critMultiplier: 2.2,
    effects: [],
    animationType: AnimationType.JAB,
    animationSpeed: 1.2,
  },
  {
    id: "li_sidekick",
    name: {
      korean: "옆차기",
      english: "Side Kick",
      romanized: "yeop-chagi",
    },
    koreanName: "옆차기",
    englishName: "Side Kick",
    romanized: "yeop-chagi",
    description: {
      korean: "태권도 옆차기로 늑골이나 무릎을 정확히 타격",
      english: "Taekwondo side kick precisely targeting ribs or knee",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 34,
    kiCost: 20,
    staminaCost: 24,
    accuracy: 0.88,
    range: 1.6,
    executionTime: 750,
    recoveryTime: 1050,
    critChance: 0.18,
    critMultiplier: 1.9,
    effects: [],
    animationType: AnimationType.SIDE_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "li_pressure_point",
    name: {
      korean: "혈도공격",
      english: "Pressure Point Attack",
      romanized: "hyeoldo-gonggyeok",
    },
    koreanName: "혈도공격",
    englishName: "Pressure Point Attack",
    romanized: "hyeoldo-gonggyeok",
    description: {
      korean: "급소를 정확히 타격하여 기를 차단",
      english: "Precise vital point strike disrupting ki flow",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.PRESSURE_POINT,
    damageType: DamageType.PRESSURE,
    damage: 26,
    kiCost: 25,
    staminaCost: 10,
    accuracy: 0.96,
    range: 0.9,
    executionTime: 550,
    recoveryTime: 850,
    critChance: 0.28,
    critMultiplier: 2.3,
    effects: [],
    animationType: AnimationType.JAB,
    animationSpeed: 1.0,
  },
  {
    id: "li_solar_plexus_strike",
    name: {
      korean: "명치타격",
      english: "Solar Plexus Strike",
      romanized: "myeongchi-tagyeok",
    },
    koreanName: "명치타격",
    englishName: "Solar Plexus Strike",
    romanized: "myeongchi-tagyeok",
    description: {
      korean: "명치를 정확히 타격하여 호흡을 차단",
      english: "Precise strike to solar plexus disrupting breath",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.THRUST,
    damageType: DamageType.INTERNAL,
    damage: 30,
    kiCost: 18,
    staminaCost: 16,
    accuracy: 0.9,
    range: 1.1,
    executionTime: 680,
    recoveryTime: 980,
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    animationType: AnimationType.PALM_STRIKE,
    animationSpeed: 1.1,
  },
];
