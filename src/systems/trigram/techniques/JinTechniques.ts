/**
 * ☳ Jin (진) - Thunder Stance Techniques
 *
 * Explosive power techniques based on Taekwondo jumping attacks.
 * Represents thunder's sudden, overwhelming force.
 *
 * 진괘 - 우레: 태권도 점프 공격 기술
 *
 * @module systems/trigram/techniques/JinTechniques
 * @korean 진괘기술
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

/**
 * ☳ JIN (진) - THUNDER: Explosive Power
 *
 * High-impact jumping and spinning attacks.
 * Element: Thunder (우레)
 * Philosophy: Sudden overwhelming force, shock and awe
 *
 * @korean 진괘 - 우레: 폭발적인 힘 (태권도 점프 공격)
 */
export const JIN_TECHNIQUES: readonly KoreanTechnique[] = [
  {
    id: "jin_lightning_flash",
    name: {
      korean: "벽력일섬",
      english: "Lightning Flash",
      romanized: "byeokryeok_ilseom",
    },
    koreanName: "벽력일섬",
    englishName: "Lightning Flash",
    romanized: "byeokryeok_ilseom",
    description: {
      korean: "번개처럼 빠른 일격",
      english: "Swift strike like lightning",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 28,
    kiCost: 10,
    staminaCost: 25,
    accuracy: 0.75,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    executionTime: 500,
    recoveryTime: 800,
    critChance: 0.12,
    critMultiplier: 1.6,
    effects: [],
    animationType: AnimationType.JAB,
    animationSpeed: 1.4,
  },
  {
    id: "jin_jumping_front_kick",
    name: {
      korean: "뛰어앞차기",
      english: "Jumping Front Kick",
      romanized: "ttwi-eo-ap-chagi",
    },
    koreanName: "뛰어앞차기",
    englishName: "Jumping Front Kick",
    romanized: "ttwi-eo-ap-chagi",
    description: {
      korean: "공중에서 가하는 폭발적인 앞차기",
      english: "Explosive jumping front kick from the air",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.KICK,
    damageType: DamageType.IMPACT,
    damage: 36,
    kiCost: 24,
    staminaCost: 32,
    accuracy: 0.72,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.15,
    },
    executionTime: 950,
    recoveryTime: 1350,
    critChance: 0.22,
    critMultiplier: 2.1,
    effects: [],
    animationType: AnimationType.JUMPING_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "jin_tornado_kick",
    name: {
      korean: "회오리차기",
      english: "Tornado Kick",
      romanized: "hoe-ori-chagi",
    },
    koreanName: "회오리차기",
    englishName: "Tornado Kick",
    romanized: "hoe-ori-chagi",
    description: {
      korean: "360도 회전하며 가하는 폭발적인 발차기",
      english: "Explosive 360-degree spinning kick",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.KICK,
    damageType: DamageType.IMPACT,
    damage: 40,
    kiCost: 28,
    staminaCost: 35,
    accuracy: 0.68,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.15,
    },
    executionTime: 1100,
    recoveryTime: 1500,
    critChance: 0.25,
    critMultiplier: 2.3,
    effects: [],
    animationType: AnimationType.TORNADO_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "jin_flying_sidekick",
    name: {
      korean: "날아차기",
      english: "Flying Sidekick",
      romanized: "nal-a-chagi",
    },
    koreanName: "날아차기",
    englishName: "Flying Sidekick",
    romanized: "nal-a-chagi",
    description: {
      korean: "공중에서 가하는 강력한 옆차기",
      english: "Powerful flying sidekick from the air",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.KICK,
    damageType: DamageType.IMPACT,
    damage: 38,
    kiCost: 26,
    staminaCost: 34,
    accuracy: 0.7,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.15,
    },
    executionTime: 1050,
    recoveryTime: 1450,
    critChance: 0.24,
    critMultiplier: 2.2,
    effects: [],
    animationType: AnimationType.JUMPING_KICK,
    animationSpeed: 1.1,
  },
  {
    id: "jin_back_kick",
    name: {
      korean: "뒤차기",
      english: "Back Kick",
      romanized: "dwi-chagi",
    },
    koreanName: "뒤차기",
    englishName: "Back Kick",
    romanized: "dwi-chagi",
    description: {
      korean: "뒤로 회전하며 가하는 강력한 뒤차기",
      english: "Powerful spinning back kick",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.KICK,
    damageType: DamageType.IMPACT,
    damage: 37,
    kiCost: 22,
    staminaCost: 30,
    accuracy: 0.74,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.1,
    },
    executionTime: 850,
    recoveryTime: 1250,
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    animationType: AnimationType.BACK_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "jin_knee_strike",
    name: {
      korean: "무릎치기",
      english: "Knee Strike",
      romanized: "mureup-chigi",
    },
    koreanName: "무릎치기",
    englishName: "Knee Strike",
    romanized: "mureup-chigi",
    description: {
      korean: "폭발적인 무릎 공격으로 복부나 얼굴을 타격",
      english: "Explosive knee strike to abdomen or face",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.KNEE,
    damageType: DamageType.BLUNT,
    damage: 35,
    kiCost: 20,
    staminaCost: 28,
    accuracy: 0.8,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "knee",
      baseExtension: 0.4,
    },
    executionTime: 600,
    recoveryTime: 1000,
    critChance: 0.18,
    critMultiplier: 1.9,
    effects: [],
    animationType: AnimationType.KNEE_STRIKE,
    animationSpeed: 1.1,
  },
];
