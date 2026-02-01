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

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

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
 *
 * Counter Timing Windows (반격 타이밍):
 * - counterWindow: 200ms standard (perfect reactive timing)
 * - perfectWindow: 50ms (완벽한 타이밍)
 * - counterMultiplier: 1.5-2.0x damage bonus
 *
 * Flow Types (흐름 유형):
 * - adaptive: Reactive to opponent's force (적응형)
 * - flowing: Smooth continuous motion (흐름형)
 * - reactive: Instant response counter (반응형)
 */
export const GAM_TECHNIQUES: readonly TrigramStanceTechnique[] = [
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
      korean: "물의 흐름으로 적의 공격을 받아넘기는 반격 - 적응형 흐름으로 최적의 반격 타이밍을 잡는다",
      english: "Counter-attack that flows like water - Adaptive flow captures optimal counter timing",
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
      baseExtension: 1.05,
    },
    // Counter timing optimized for reactive flow (300-600ms range)
    executionTime: 400, // Optimized for quick reactive flow (was 600)
    recoveryTime: 900,
    critChance: 0.18,
    critMultiplier: 1.7,
    // Counter-attack timing windows (반격 타이밍 윈도우)
    counterWindow: 200, // Standard reactive window in milliseconds
    perfectWindow: 50, // Perfect counter timing window (완벽한 타이밍)
    counterMultiplier: 1.8, // Counter damage bonus multiplier
    flowType: "adaptive", // Adaptive flow type (적응형 흐름)
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "counter", // Type: shared category
    animationId: "gam_water_counter", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Flowing counter-attack (matches TechniqueAnimationMapping)
    animationType: AnimationType.WATER_COUNTER,
    animationSpeed: 1.0,
    category: "medium",
    range: "medium",
    speed: 1.0,
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
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "throw", // Type: shared category
    animationId: "gam_redirect_throw", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Redirect throw motion
    animationType: AnimationType.GAM_REDIRECT_THROW,
    animationSpeed: 0.9,
    category: "medium",
    range: "short",
    speed: 0.9,
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
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "throw", // Type: shared category
    animationId: "gam_hip_throw", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Hip throw motion
    animationType: AnimationType.GAM_HIP_THROW,
    animationSpeed: 0.85,
    category: "medium",
    range: "short",
    speed: 0.85,
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
    damage: 20,
    kiCost: 10,
    staminaCost: 14,
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
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "defensive", // Type: shared category
    animationId: "gam_flowing_block", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Soft blocking motion
    animationType: AnimationType.BLOCK,
    animationSpeed: 1.0,
    category: "light",
    range: "short",
    speed: 1.0,
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
      korean: "합기도 원형 움직임으로 공격을 무력화 - 흐르는 원형 동작으로 반격의 기회를 만든다",
      english: "Hapkido circular motion neutralizing attack - Flowing circular motion creates counter opportunity",
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
      baseExtension: 1.05,
    },
    // Counter timing optimized for circular flow
    executionTime: 500, // Optimized for flowing circular motion (was 550)
    recoveryTime: 850,
    critChance: 0.12,
    critMultiplier: 1.5,
    // Counter-attack timing windows (반격 타이밍 윈도우)
    counterWindow: 200, // Standard reactive window
    perfectWindow: 50, // Perfect counter timing
    counterMultiplier: 1.6, // Counter damage bonus
    flowType: "flowing", // Flowing circular motion (흐름형)
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "defensive", // Type: shared category
    animationId: "gam_circular_parry", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Circular parry motion
    animationType: AnimationType.GAM_CIRCULAR_PARRY,
    animationSpeed: 1.0,
    category: "medium",
    range: "medium",
    speed: 1.0,
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
      korean: "공격을 받아 손목을 비틀어 반격 - 반응형 포착으로 관절을 즉시 제압한다",
      english: "Counter by catching and twisting wrist - Reactive capture controls joint instantly",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.COUNTER_ATTACK,
    damageType: DamageType.JOINT,
    damage: 28,
    kiCost: 16,
    staminaCost: 20,
    accuracy: 0.90,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.65,
    },
    // Counter timing optimized for reactive wrist capture
    executionTime: 550, // Optimized for reactive joint lock (was 700)
    recoveryTime: 1000,
    critChance: 0.25,
    critMultiplier: 2.2,
    // Counter-attack timing windows (반격 타이밍 윈도우)
    counterWindow: 200, // Standard reactive window
    perfectWindow: 50, // Perfect counter timing for joint lock
    counterMultiplier: 2.0, // High counter bonus for joint lock
    flowType: "reactive", // Reactive instant capture (반응형)
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "joint_lock", // Type: shared category
    animationId: "gam_wrist_twist_counter", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Wrist control transition
    animationType: AnimationType.GAM_WRIST_TWIST_COUNTER,
    animationSpeed: 1.0,
    category: "special",
    range: "short",
    speed: 1.0,
  },
] as const;

/**
 * Get GAM techniques count
 */
export const GAM_TECHNIQUE_COUNT = GAM_TECHNIQUES.length;

/**
 * Get GAM technique by ID
 */
export function getGamTechniqueById(id: string): TrigramStanceTechnique | undefined {
  return GAM_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all GAM techniques by attack type
 */
export function getGamTechniquesByType(
  type: CombatAttackType
): readonly TrigramStanceTechnique[] {
  return GAM_TECHNIQUES.filter((t) => t.type === type);
}
