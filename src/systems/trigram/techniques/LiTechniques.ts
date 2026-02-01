/**
 * ☲ Li (리) - Fire Stance Techniques
 *
 * Precision nerve strikes based on Taekwondo accuracy.
 * Represents fire's penetrating and illuminating nature.
 *
 * Enhanced with precision targeting, vital point multipliers,
 * and nerve disruption effects for Li stance specialization.
 *
 * 리괘 - 불: 태권도 정밀 타격 기술
 *
 * @module systems/trigram/techniques/LiTechniques
 * @korean 리괘기술
 */

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

/**
 * Extended Li technique interface with precision strike metadata
 * 리 기술 정밀 타격 메타데이터
 */
export interface LiTechniqueMetadata extends TrigramStanceTechnique {
  /**
   * Precision bonus for Li stance techniques (0.1-0.25 range)
   * Added to base accuracy for vital point targeting
   * 정밀도 보너스
   */
  readonly precisionBonus: number;

  /**
   * Vital point damage multiplier (1.5-2.5x range)
   * Applied when hitting vital points with Li techniques
   * 급소 피해 배수
   */
  readonly vitalPointMultiplier: number;

  /**
   * Nerve disruption effect metadata
   * Describes the type and intensity of neural disruption
   * 신경 교란 효과
   */
  readonly nerveDisruptionEffect: {
    /** Effect type: 'electric', 'paralysis', 'sensory' */
    readonly type: "electric" | "paralysis" | "sensory";
    /** Intensity: 0.0 (minimal) to 1.0 (maximum) */
    readonly intensity: number;
    /** Visual color for effect (KOREAN_COLORS constant) */
    readonly color: number;
    /** Effect duration in milliseconds */
    readonly duration: number;
  };
}

/**
 * ☲ LI (리) - FIRE: Precision Nerve Strikes
 *
 * Precise strikes targeting vital points and nerves.
 * Element: Fire (불)
 * Philosophy: Penetrating accuracy, illuminating weakness
 *
 * Enhanced with precision modifiers, vital point multipliers,
 * and nerve disruption effects for maximum surgical precision.
 *
 * @korean 리괘 - 불: 정밀한 신경 타격 (태권도 정확성)
 */
export const LI_TECHNIQUES: readonly LiTechniqueMetadata[] = [
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    executionTime: 500, // Optimized for precision strikes (was 700ms)
    recoveryTime: 1100,
    critChance: 0.15,
    critMultiplier: 1.8,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "strike", // Type: shared category
    animationId: "li_flame_spear", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.SPEAR_HAND_STRIKE,
    animationSpeed: 1.3,
    category: "medium",
    range: "short",
    speed: 1.3,
    // Li Precision Strike Enhancements
    precisionBonus: 0.15,
    vitalPointMultiplier: 1.8,
    nerveDisruptionEffect: {
      type: "electric",
      intensity: 0.7,
      color: 0x00d4ff, // KOREAN_COLORS.ACCENT_PRIMARY
      duration: 800,
    },
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "elbow",
      baseExtension: 0.5,
    },
    executionTime: 450, // Optimized for precision strikes (was 650ms)
    recoveryTime: 950,
    critChance: 0.22,
    critMultiplier: 2.0,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "elbow_strike", // Type: shared category
    animationId: "li_temple_strike", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.TEMPLE_ELBOW,
    animationSpeed: 1.1,
    category: "special",
    range: "short",
    speed: 1.1,
    // Li Precision Strike Enhancements
    precisionBonus: 0.18,
    vitalPointMultiplier: 2.2,
    nerveDisruptionEffect: {
      type: "sensory",
      intensity: 0.85,
      color: 0xffff33, // KOREAN_COLORS.WARNING_YELLOW
      duration: 1200,
    },
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    executionTime: 400, // Optimized for precision strikes (was 600ms)
    recoveryTime: 900,
    critChance: 0.25,
    critMultiplier: 2.2,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "strike", // Type: shared category
    animationId: "li_nerve_strike", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.NERVE_STRIKE,
    animationSpeed: 1.2,
    category: "special",
    range: "short",
    speed: 1.2,
    // Li Precision Strike Enhancements
    precisionBonus: 0.25,
    vitalPointMultiplier: 2.5,
    nerveDisruptionEffect: {
      type: "paralysis",
      intensity: 1.0,
      color: 0xff33ff, // KOREAN_COLORS.SECONDARY_MAGENTA
      duration: 1500,
    },
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
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.1,
    },
    executionTime: 550, // Optimized for precision strikes (was 750ms)
    recoveryTime: 1050,
    critChance: 0.18,
    critMultiplier: 1.9,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "kick", // Type: shared category
    animationId: "li_sidekick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.SIDE_KICK,
    animationSpeed: 1.0,
    category: "medium",
    range: "medium",
    speed: 1.0,
    // Li Precision Strike Enhancements
    precisionBonus: 0.12,
    vitalPointMultiplier: 1.7,
    nerveDisruptionEffect: {
      type: "electric",
      intensity: 0.6,
      color: 0x00e6e6, // KOREAN_COLORS.PRIMARY_CYAN
      duration: 700,
    },
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    executionTime: 400, // Optimized for precision strikes (was 550ms)
    recoveryTime: 850,
    critChance: 0.28,
    critMultiplier: 2.3,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "strike", // Type: shared category
    animationId: "li_pressure_point", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.PRESSURE_POINT_STRIKE,
    animationSpeed: 1.0,
    category: "special",
    range: "short",
    speed: 1.0,
    // Li Precision Strike Enhancements
    precisionBonus: 0.22,
    vitalPointMultiplier: 2.3,
    nerveDisruptionEffect: {
      type: "electric",
      intensity: 0.9,
      color: 0xffc400, // KOREAN_COLORS.ACCENT_GOLD
      duration: 1000,
    },
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 480, // Optimized for precision strikes (was 680ms)
    recoveryTime: 980,
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "strike", // Type: shared category
    animationId: "li_solar_plexus_strike", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.SOLAR_PLEXUS_STRIKE,
    animationSpeed: 1.1,
    category: "medium",
    range: "short",
    speed: 1.1,
    // Li Precision Strike Enhancements
    precisionBonus: 0.14,
    vitalPointMultiplier: 1.9,
    nerveDisruptionEffect: {
      type: "sensory",
      intensity: 0.75,
      color: 0xff7733, // KOREAN_COLORS.WARNING_ORANGE
      duration: 900,
    },
  },
];
