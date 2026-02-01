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

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

/**
 * ☱ TAE (태) - LAKE: Fluid Joint Manipulation
 *
 * Hapkido-based joint locks and manipulations.
 * Element: Lake (연못)
 * Philosophy: Yield to control, redirect opponent's force
 *
 * @korean 태괘 - 연못: 유동적인 관절기 기술 (합기도)
 */
export const TAE_TECHNIQUES: readonly TrigramStanceTechnique[] = [
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 1.05,
    },
    executionTime: 750, // Increased from 600ms (+25%) for flowing motion visibility
    recoveryTime: 1100, // Adjusted proportionally from 1000ms
    critChance: 0.08,
    critMultiplier: 1.3,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "punch", // Type: shared category
    animationId: "tae_flowing_strikes", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.FLOWING_CROSS,
    animationSpeed: 0.75, // Reduced from 1.2x to 0.75x for flowing, visible motion
    category: "medium", // Balanced technique with moderate damage/stamina
    range: "medium",
    speed: 0.75, // Reduced to match animationSpeed for consistency
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
    staminaCost: 14,
    accuracy: 0.88,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1100, // Increased from 650ms (+69%) for detailed joint manipulation
    recoveryTime: 1400, // Adjusted proportionally from 1000ms
    critChance: 0.12,
    critMultiplier: 1.5,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "tae_wrist_lock", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.TAE_WRIST_LOCK,
    animationSpeed: 0.55, // Reduced from 0.85x to 0.55x for circular motion clarity
    category: "medium", // Changed from "light" - joint locks require deliberate control
    range: "short",
    speed: 0.55, // Reduced to match animationSpeed for consistency
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1200, // Increased from 750ms (+60%) for circular technique visibility
    recoveryTime: 1500, // Adjusted proportionally from 1100ms
    critChance: 0.22,
    critMultiplier: 2.0,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "tae_small_circle", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.SMALL_CIRCLE_LOCK,
    animationSpeed: 0.55, // Reduced from 0.85x to 0.55x for small circle detail
    category: "special",
    range: "short",
    speed: 0.55, // Reduced to match animationSpeed for consistency
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 690, // Increased from 650ms (+6%) - small joint, faster application
    recoveryTime: 1000, // Adjusted from 900ms
    critChance: 0.1,
    critMultiplier: 1.4,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "tae_finger_lock", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.FINGER_LOCK,
    animationSpeed: 0.6, // Reduced from 0.9x to 0.6x for small joint precision
    category: "light", // Small joint manipulation - remains light category
    range: "short",
    speed: 0.6, // Reduced to match animationSpeed for consistency
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1280, // Increased from 800ms (+60%) for leverage and control phases
    recoveryTime: 1600, // Adjusted proportionally from 1150ms
    critChance: 0.16,
    critMultiplier: 1.7,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "tae_elbow_lock", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.ELBOW_LOCK,
    animationSpeed: 0.5, // Reduced from 0.8x to 0.5x for hyperextension detail
    category: "medium",
    range: "short",
    speed: 0.5, // Reduced to match animationSpeed for consistency
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1360, // Increased from 850ms (+60%) for shoulder rotation detail
    recoveryTime: 1700, // Adjusted proportionally from 1200ms
    critChance: 0.18,
    critMultiplier: 1.8,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "tae_shoulder_lock", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.SHOULDER_MANIPULATION,
    animationSpeed: 0.5, // Reduced from 0.8x to 0.5x for shoulder manipulation clarity
    category: "medium",
    range: "short",
    speed: 0.5, // Reduced to match animationSpeed for consistency
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1440, // Increased from 900ms (+60%) for full submission sequence
    recoveryTime: 1800, // Adjusted proportionally from 1300ms
    critChance: 0.2,
    critMultiplier: 1.9,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "tae_arm_bar", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.ARM_BAR,
    animationSpeed: 0.5, // Reduced from 0.75x to 0.5x for complete arm bar technique
    category: "medium",
    range: "short",
    speed: 0.5, // Reduced to match animationSpeed for consistency
  },
];
