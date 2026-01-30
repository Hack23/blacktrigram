/**
 * ☴ 손 (SON) - Wind Stance Techniques
 * 선풍연격 - Continuous Pressure (Taekyon Rhythmic Combat)
 *
 * The Wind stance (손괘) embodies continuous pressure and rhythmic flow.
 * Based on traditional Taekyon (택견) - the oldest Korean martial art,
 * emphasizing fluid footwork, rhythmic movement, and unrelenting pressure.
 *
 * Philosophy: "바람처럼 끊임없이 흐르라" - Flow endlessly like the wind
 *
 * @module SonTechniques
 */

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

/**
 * SON stance techniques - Wind / Continuous Pressure
 * Taekyon rhythmic combat with continuous flowing attacks
 *
 * Technique characteristics:
 * - Continuous pressure attacks
 * - Rhythmic striking patterns
 * - Fluid footwork integration
 * - Destabilizing movements
 *
 * Animation speeds are calibrated for rhythmic flow:
 * - Fast: 1.2-1.3 (rapid footwork, quick strikes)
 * - Normal: 1.0 (standard techniques)
 * - Sustained: 0.9-1.0 (continuous pressure)
 */
export const SON_TECHNIQUES: readonly TrigramStanceTechnique[] = [
  // ============= Primary Technique =============
  {
    id: "son_whirlwind_barrage",
    name: {
      korean: "선풍연격",
      english: "Whirlwind Barrage",
      romanized: "seonpung_yeongyeok",
    },
    koreanName: "선풍연격",
    englishName: "Whirlwind Barrage",
    romanized: "seonpung_yeongyeok",
    description: {
      korean: "바람처럼 연속적인 공격",
      english: "Continuous attacks like wind",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 22,
    kiCost: 8,
    staminaCost: 30,
    accuracy: 0.7,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    executionTime: 400,
    recoveryTime: 600,
    critChance: 0.06,
    critMultiplier: 1.2,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "punch", // Type: shared category
    animationId: "son_whirlwind_barrage", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Continuous striking pattern
    animationType: AnimationType.RAPID_BARRAGE,
    animationSpeed: 1.5,
    category: "medium",
    range: "short",
    speed: 1.5,
  },

  // ============= Taekyon Footwork Techniques =============
  {
    id: "son_sweeping_low_kick",
    name: {
      korean: "품밟기",
      english: "Sweeping Foot Attack",
      romanized: "pum-balbgi",
    },
    koreanName: "품밟기",
    englishName: "Sweeping Foot Attack",
    romanized: "pum-balbgi",
    description: {
      korean: "택견의 낮은 발차기로 발목을 쓸어 넘어뜨림",
      english: "Taekyon low sweeping kick targeting ankles",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 20,
    kiCost: 10,
    staminaCost: 22,
    accuracy: 0.82,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 0.95,
    },
    executionTime: 550,
    recoveryTime: 850,
    critChance: 0.12,
    critMultiplier: 1.4,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "low_kick", // Type: shared category
    animationId: "son_sweeping_low_kick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Low sweeping kick
    animationType: AnimationType.SON_SWEEPING_LOW_KICK,
    animationSpeed: 1.1,
    category: "medium",
    range: "medium",
    speed: 1.1,
  },
  {
    id: "son_rapid_footwork",
    name: {
      korean: "품밟기연환",
      english: "Rapid Footwork Chain",
      romanized: "pum-balbgi-yeonhwan",
    },
    koreanName: "품밟기연환",
    englishName: "Rapid Footwork Chain",
    romanized: "pum-balbgi-yeonhwan",
    description: {
      korean: "택견의 빠른 발놀림으로 연속 타격",
      english: "Taekyon rapid footwork with continuous strikes",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 28,
    kiCost: 16,
    staminaCost: 24,
    accuracy: 0.74,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.05,
    },
    executionTime: 600,
    recoveryTime: 900,
    critChance: 0.16,
    critMultiplier: 1.6,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "footwork", // Type: shared category
    animationId: "son_rapid_footwork", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Rapid footwork sequence
    animationType: AnimationType.SON_RAPID_FOOTWORK,
    animationSpeed: 1.2,
    category: "medium",
    range: "medium",
    speed: 1.2,
  },

  // ============= Rhythmic Striking Techniques =============
  {
    id: "son_rhythmic_strikes",
    name: {
      korean: "결련수",
      english: "Rhythmic Hand Strikes",
      romanized: "gyeolryeon-su",
    },
    koreanName: "결련수",
    englishName: "Rhythmic Hand Strikes",
    romanized: "gyeolryeon-su",
    description: {
      korean: "택견의 리듬감 있는 연속 손타격",
      english: "Taekyon rhythmic continuous hand strikes",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.PRESSURE,
    damage: 24,
    kiCost: 12,
    staminaCost: 28,
    accuracy: 0.85,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    executionTime: 450,
    recoveryTime: 700,
    critChance: 0.22,
    critMultiplier: 2.0,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "punch", // Type: shared category
    animationId: "son_rhythmic_strikes", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Rhythmic hand combination
    animationType: AnimationType.SON_RHYTHMIC_STRIKES,
    animationSpeed: 1.2,
    category: "special",
    range: "short",
    speed: 1.2,
  },
  {
    id: "son_flowing_push",
    name: {
      korean: "밀기",
      english: "Flowing Push",
      romanized: "mil-gi",
    },
    koreanName: "밀기",
    englishName: "Flowing Push",
    romanized: "mil-gi",
    description: {
      korean: "택견의 밀기로 상대의 균형을 무너뜨림",
      english: "Taekyon push disrupting opponent's balance",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.PRESSURE,
    damage: 20,
    kiCost: 8,
    staminaCost: 20,
    accuracy: 0.85,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 500,
    recoveryTime: 750,
    critChance: 0.1,
    critMultiplier: 1.3,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "palm_strike", // Type: shared category
    animationId: "son_flowing_push", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Flowing push movement
    animationType: AnimationType.SON_FLOWING_PUSH,
    animationSpeed: 1.0,
    category: "medium",
    range: "short",
    speed: 1.0,
  },

  // ============= Spinning Techniques =============
  {
    id: "son_spinning_elbow",
    name: {
      korean: "돌개팔꿈치",
      english: "Spinning Elbow",
      romanized: "dolgae-palkkumchi",
    },
    koreanName: "돌개팔꿈치",
    englishName: "Spinning Elbow",
    romanized: "dolgae-palkkumchi",
    description: {
      korean: "회전하며 연속적으로 가하는 팔꿈치 공격",
      english: "Continuous spinning elbow strikes",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.ELBOW,
    damageType: DamageType.BLUNT,
    damage: 26,
    kiCost: 14,
    staminaCost: 26,
    accuracy: 0.76,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "elbow",
      baseExtension: 0.5,
    },
    executionTime: 550,
    recoveryTime: 850,
    critChance: 0.14,
    critMultiplier: 1.5,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "spinning_elbow", // Type: shared category
    animationId: "son_spinning_elbow", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Spinning elbow attack
    animationType: AnimationType.ELBOW_STRIKE,
    animationSpeed: 1.1,
    category: "medium",
    range: "short",
    speed: 1.1,
  },
] as const;

/**
 * Get SON techniques count
 */
export const SON_TECHNIQUE_COUNT = SON_TECHNIQUES.length;

/**
 * Get SON technique by ID
 */
export function getSonTechniqueById(id: string): TrigramStanceTechnique | undefined {
  return SON_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all SON techniques by attack type
 */
export function getSonTechniquesByType(
  type: CombatAttackType
): readonly TrigramStanceTechnique[] {
  return SON_TECHNIQUES.filter((t) => t.type === type);
}
