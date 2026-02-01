/**
 * ☳ Jin (진) - Thunder Stance Techniques
 *
 * Explosive power techniques based on Taekwondo jumping attacks.
 * Represents thunder's sudden, overwhelming force.
 *
 * 진괘 - 우레: 태권도 점프 공격 기술
 *
 * **Two-Phase System:**
 * - Charge Phase: Power buildup with visual accumulation (200-400ms)
 * - Release Phase: Explosive burst with maximum impact (400-600ms)
 * - Total: 600-1000ms for complete explosive technique
 *
 * **Explosive Mechanics:**
 * - Power charging with visual effects (electric arcs, energy gathering)
 * - Perfect timing window for maximum power multiplier (1.3-1.5x)
 * - Thunder/lightning effects on release
 * - Camera shake and screen flash on impact
 *
 * @module systems/trigram/techniques/JinTechniques
 * @korean 진괘기술
 */

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

/**
 * Extended technique interface for Jin's explosive power system
 * Adds two-phase timing and explosive mechanics to base technique
 */
export interface JinExplosiveTechnique extends TrigramStanceTechnique {
  /** Duration of power charging phase in milliseconds (200-400ms) */
  readonly chargeTime?: number;
  /** Duration of explosive release phase in milliseconds (400-600ms) */
  readonly releaseTime?: number;
  /** Power multiplier for explosive techniques (1.3-1.5x) */
  readonly explosivePower?: number;
  /** Whether this technique uses thunder/lightning effects */
  readonly thunderEffect?: boolean;
  /** Camera shake intensity on impact (0-1, higher = stronger shake) */
  readonly cameraShakeIntensity?: number;
  /** Screen flash intensity on release (0-1, higher = brighter flash) */
  readonly screenFlashIntensity?: number;
}

/**
 * ☳ JIN (진) - THUNDER: Explosive Power
 *
 * High-impact jumping and spinning attacks with two-phase execution.
 * Element: Thunder (우레)
 * Philosophy: Sudden overwhelming force, shock and awe
 *
 * **Explosive Mechanics:**
 * - All techniques feature charge + release phases
 * - Lightning/thunder effects on explosive release
 * - Camera shake and screen flash for impact feedback
 * - Power multipliers for perfect timing execution
 *
 * @korean 진괘 - 우레: 폭발적인 힘 (태권도 점프 공격)
 */
export const JIN_TECHNIQUES: readonly JinExplosiveTechnique[] = [
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
      korean: "번개처럼 빠른 일격 - 폭발적인 힘으로 적을 제압",
      english: "Swift strike like lightning - overwhelming explosive force",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 24,
    kiCost: 10,
    staminaCost: 14,
    accuracy: 0.75,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
    },
    // Two-phase explosive timing
    chargeTime: 200, // Quick charge for fast strike
    releaseTime: 500, // Explosive release
    executionTime: 700, // Total time (charge + release + 0ms transition)
    recoveryTime: 800,
    critChance: 0.12,
    critMultiplier: 1.6,
    // Explosive power mechanics
    explosivePower: 1.3, // 30% power bonus on perfect timing
    thunderEffect: true, // Lightning flash effect on release
    cameraShakeIntensity: 0.3, // Light camera shake
    screenFlashIntensity: 0.4, // Moderate screen flash
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "punch", // Type: shared category
    animationId: "jin_lightning_flash", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.LIGHTNING_STRIKE,
    animationSpeed: 1.4,
    category: "light",
    range: "short",
    speed: 1.4,
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
      korean: "공중에서 가하는 폭발적인 앞차기 - 천둥의 일격",
      english: "Explosive jumping front kick from the air - thunder's strike",
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
    // Two-phase explosive timing
    chargeTime: 350, // Medium charge for jump preparation
    releaseTime: 550, // Explosive kick release
    executionTime: 900, // Total time (charge + release)
    recoveryTime: 1350,
    critChance: 0.22,
    critMultiplier: 2.1,
    // Explosive power mechanics
    explosivePower: 1.4, // 40% power bonus - higher for jumping attacks
    thunderEffect: true, // Thunder impact on landing
    cameraShakeIntensity: 0.6, // Strong camera shake
    screenFlashIntensity: 0.5, // Strong screen flash
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "jumping_kick", // Type: shared category
    animationId: "jin_jumping_front_kick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.JIN_JUMPING_FRONT_KICK,
    animationSpeed: 1.0,
    category: "heavy",
    range: "medium",
    speed: 1.0,
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
      korean: "360도 회전하며 가하는 폭발적인 발차기 - 회오리의 파괴력",
      english: "Explosive 360-degree spinning kick - whirlwind destruction",
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
    // Two-phase explosive timing
    chargeTime: 400, // Longer charge for spin momentum
    releaseTime: 600, // Full rotation release
    executionTime: 1000, // Total time (charge + release)
    recoveryTime: 1500,
    critChance: 0.25,
    critMultiplier: 2.3,
    // Explosive power mechanics
    explosivePower: 1.5, // 50% power bonus - highest for spinning techniques
    thunderEffect: true, // Lightning trail during spin
    cameraShakeIntensity: 0.7, // Very strong camera shake
    screenFlashIntensity: 0.6, // Strong screen flash
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "kick", // Type: shared category
    animationId: "jin_tornado_kick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.TORNADO_KICK,
    animationSpeed: 1.0,
    category: "heavy",
    range: "medium",
    speed: 1.0,
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
      korean: "공중에서 가하는 강력한 옆차기 - 번개의 속도",
      english: "Powerful flying sidekick from the air - lightning speed",
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
    // Two-phase explosive timing
    chargeTime: 300, // Quick charge for flying leap
    releaseTime: 550, // Explosive sidekick
    executionTime: 850, // Total time (charge + release)
    recoveryTime: 1450,
    critChance: 0.24,
    critMultiplier: 2.2,
    // Explosive power mechanics
    explosivePower: 1.4, // 40% power bonus for flying techniques
    thunderEffect: true, // Thunder burst on impact
    cameraShakeIntensity: 0.6, // Strong camera shake
    screenFlashIntensity: 0.5, // Strong screen flash
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "jumping_kick", // Type: shared category
    animationId: "jin_flying_sidekick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.JIN_FLYING_SIDEKICK,
    animationSpeed: 1.1,
    category: "heavy",
    range: "medium",
    speed: 1.1,
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
      korean: "뒤로 회전하며 가하는 강력한 뒤차기 - 예측 불가능한 파괴력",
      english: "Powerful spinning back kick - unpredictable destructive force",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.KICK,
    damageType: DamageType.BLUNT,
    damage: 37,
    kiCost: 22,
    staminaCost: 30,
    accuracy: 0.74,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.1,
    },
    // Two-phase explosive timing
    chargeTime: 250, // Quick spin preparation
    releaseTime: 500, // Explosive back kick
    executionTime: 750, // Total time (charge + release)
    recoveryTime: 1250,
    critChance: 0.28,
    critMultiplier: 2.3,
    // Explosive power mechanics
    explosivePower: 1.4, // 40% power bonus for spinning techniques
    thunderEffect: true, // Thunder impact on connection
    cameraShakeIntensity: 0.7, // Very strong shake - highest damage spinning kick
    screenFlashIntensity: 0.6, // Strong flash
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "kick", // Type: shared category
    animationId: "jin_back_kick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.BACK_KICK,
    animationSpeed: 1.0,
    category: "special",
    range: "medium",
    speed: 1.0,
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
      korean: "폭발적인 무릎 공격으로 복부나 얼굴을 타격 - 천둥의 충격",
      english: "Explosive knee strike to abdomen or face - thunder's impact",
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
    // Two-phase explosive timing
    chargeTime: 200, // Quick charge for close-range
    releaseTime: 400, // Fast explosive knee
    executionTime: 600, // Total time (charge + release)
    recoveryTime: 1000,
    critChance: 0.18,
    critMultiplier: 1.9,
    // Explosive power mechanics
    explosivePower: 1.3, // 30% power bonus for close-range explosive strike
    thunderEffect: true, // Thunder shock on impact
    cameraShakeIntensity: 0.5, // Strong shake for close impact
    screenFlashIntensity: 0.4, // Moderate flash
    effects: [],
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "knee_strike", // Type: shared category
    animationId: "jin_knee_strike", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    animationType: AnimationType.KNEE_STRIKE,
    animationSpeed: 1.1,
    category: "medium",
    range: "short",
    speed: 1.1,
  },
];
