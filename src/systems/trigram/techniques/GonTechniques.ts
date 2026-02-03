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

import type { ExtendedGonTechnique } from "../types/GonTechniqueExtensions";
import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation";

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
 *
 * Enhanced with Korean martial arts expert analysis:
 * - Authentic throw trajectories from Ssireum/Hapkido
 * - Ground impact multipliers for realistic damage
 * - Post-throw control durations
 * - Earth's supportive healing philosophy
 * - Visual earth crack effects
 */
export const GON_TECHNIQUES: readonly ExtendedGonTechnique[] = [
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 900,
    recoveryTime: 1000, // Reduced from 1300ms for combo flow
    critChance: 0.08,
    critMultiplier: 1.4,
    effects: [],
    // Combo metadata - Clinch control setup
    comboWindow: 230,
    comboPriority: 1, // Starter - establishes grappling position
    pressureStacks: 2,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "grapple", // Type: shared category
    animationId: "gon_earth_embrace", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Clinch grapple position
    animationType: AnimationType.GON_EARTH_EMBRACE,
    animationSpeed: 0.9,
    category: "medium",
    range: "short",
    speed: 0.9,

    // ============= GON ENHANCEMENTS (Korean Martial Arts Expert Analysis) =============
    // 앞무릎치기 (Ap-mureup-chigi) - Front Knee Push clinch control
    throwTrajectory: "clinch_control", // Setup position, not a throw itself
    groundImpactMultiplier: 1.0, // No impact (control only)
    controlDuration: 1500, // 1.5 seconds of grip control
    supportiveHealing: 2, // Minor Ki recovery from grounding connection
    earthCrackEffect: false, // Visual effect not needed for control
    gripStrength: 0.85, // Strong clinch grip
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
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 0.95,
    },
    executionTime: 650,
    recoveryTime: 700, // Reduced from 950ms for combo flow
    critChance: 0.12,
    critMultiplier: 1.5,
    effects: [],
    // Combo metadata - Sweeping takedown
    comboWindow: 230,
    comboPriority: 2, // Mid-chain - destabilizing sweep
    pressureStacks: 2,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "sweep", // Type: shared category
    animationId: "gon_leg_sweep", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Reaping leg sweep
    animationType: AnimationType.GON_LEG_SWEEP,
    animationSpeed: 1.0,
    category: "medium",
    range: "medium",
    speed: 1.0,

    // ============= GON ENHANCEMENTS =============
    // 안다리걸기 (An-dari-geolgi) - Inner Leg Reap
    throwTrajectory: "horizontal_sweep", // Low sweeping arc
    groundImpactMultiplier: 1.3, // Medium impact from horizontal fall
    controlDuration: 1200, // 1.2 seconds post-sweep advantage
    supportiveHealing: 3, // Earth connection during sweep motion
    earthCrackEffect: true, // Ground sweep creates dust/crack visual
    sweepDirection: "inward", // 안(an) = inner reap direction
    takedownType: "leg_reap", // 걸기(geolgi) specific classification
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 700,
    recoveryTime: 800, // Reduced from 1000ms for combo flow
    critChance: 0.14,
    critMultiplier: 1.6,
    effects: [],
    // Combo metadata - Low level grappling
    comboWindow: 230,
    comboPriority: 1, // Starter - ankle control setup
    pressureStacks: 2,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "sweep", // Type: shared category
    animationId: "gon_ankle_pick", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Low shooting motion
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 1.1,
    category: "medium",
    range: "short",
    speed: 1.1,

    // ============= GON ENHANCEMENTS =============
    // 발목당기기 (Balmok Danggigi) - Ankle Pull
    throwTrajectory: "forward_drive", // Drive forward while pulling ankle
    groundImpactMultiplier: 1.4, // Face-first fall = higher impact
    controlDuration: 1000, // 1 second of ankle control
    supportiveHealing: 4, // Strong earth connection (low stance)
    earthCrackEffect: true, // Driving motion creates ground effect
    penetrationDepth: "low", // Very low shooting entry
    setupSpeed: "fast", // Quick level change execution
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
    damageType: DamageType.IMPACT,
    damage: 32,
    kiCost: 20,
    staminaCost: 28,
    accuracy: 0.82,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.7,
    },
    executionTime: 850,
    recoveryTime: 1000, // Reduced from 1250ms for combo flow
    critChance: 0.24,
    critMultiplier: 2.1,
    effects: [],
    // Combo metadata - Traditional wrestling throw
    comboWindow: 230,
    comboPriority: 3, // Finisher - ssireum slam
    pressureStacks: 4,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "throw", // Type: shared category
    animationId: "gon_ssireum_throw", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Traditional belt throw
    animationType: AnimationType.THROW,
    animationSpeed: 0.9,
    category: "special",
    range: "short",
    speed: 0.9,

    // ============= GON ENHANCEMENTS =============
    // 샅바 메치기 (Satba Mechigi) - UNESCO Heritage Belt Throw
    throwTrajectory: "arc_over_hip", // Classical hip rotation throw
    groundImpactMultiplier: 1.7, // High impact from rotational velocity
    controlDuration: 1800, // 1.8 seconds of dominant position
    supportiveHealing: 5, // Maximum earth connection (traditional technique)
    earthCrackEffect: true, // Powerful traditional throw creates visual impact
    satbaGripRequired: true, // Uses traditional satba belt mechanics
    rotationalPower: "high", // Hip rotation generates force
    traditionalBonus: 1.15, // 15% damage bonus for cultural authenticity
    takedownType: "hip_throw", // Traditional hip throw classification
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 1050,
    recoveryTime: 1150, // Reduced from 1400ms for combo flow
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    // Combo metadata - Crushing throw finisher
    comboWindow: 230,
    comboPriority: 3, // Finisher - devastating slam
    pressureStacks: 4,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "strike", // Type: shared category
    animationId: "gon_ground_pound", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Slam throw
    animationType: AnimationType.SLAM, // Fixed: was wrongly set to GON_BODY_LOCK_TAKEDOWN
    animationSpeed: 1.0,
    category: "heavy",
    range: "short",
    speed: 1.0,

    // ============= GON ENHANCEMENTS =============
    // 들어올려 메치기 (Deureo-ollyeo Mechigi) - Lift and Slam
    throwTrajectory: "vertical_slam", // Straight down with maximum force
    groundImpactMultiplier: 2.0, // MAXIMUM impact (highest in game)
    controlDuration: 2000, // 2 seconds of complete dominance after slam
    supportiveHealing: 1, // Minimal healing (aggressive technique)
    earthCrackEffect: true, // DRAMATIC earth crack visual (signature move)
    liftHeight: "high", // Full body lift before slam
    stunChance: 0.4, // 40% chance to stun opponent from impact
    breathLoss: "severe", // Knocks wind out (respiratory effect)
    takedownType: "slam", // Slam technique classification
    endingPosition: "standing_dominant", // Attacker standing, opponent down
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.9,
    },
    executionTime: 800,
    recoveryTime: 900, // Reduced from 1150ms for combo flow
    critChance: 0.16,
    critMultiplier: 1.7,
    effects: [],
    // Combo metadata - Body lock control
    comboWindow: 230,
    comboPriority: 2, // Mid-chain - torso control
    pressureStacks: 3,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "takedown", // Type: shared category
    animationId: "gon_body_lock_takedown", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Body lock clinch
    animationType: AnimationType.GRAPPLE, // Fixed: was wrongly set to GON_ANKLE_PICK
    animationSpeed: 0.9,
    category: "medium",
    range: "short",
    speed: 0.9,

    // ============= GON ENHANCEMENTS =============
    // 허리 감싸기 (Heori Gamssagi) - Waist Wrap / Bear Hug
    throwTrajectory: "circular_trip", // Circular motion while tripping legs
    groundImpactMultiplier: 1.5, // Solid impact from controlled throw
    controlDuration: 1600, // 1.6 seconds of body control advantage
    supportiveHealing: 3, // Moderate earth connection
    earthCrackEffect: true, // Medium impact creates ground effect
    takedownType: "body_lock", // Full torso encirclement
    breathRestriction: 0.3, // 30% breath restriction from compression
    gripStrength: 0.8, // Strong bear hug grip
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
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.7,
    },
    executionTime: 950,
    recoveryTime: 1100, // Reduced from 1350ms for combo flow
    critChance: 0.18,
    critMultiplier: 1.9,
    effects: [],
    // Combo metadata - Self-sacrificing throw
    comboWindow: 230,
    comboPriority: 3, // Finisher - high-risk high-reward throw
    pressureStacks: 4,
    // NEW ARCHITECTURE: Separate type (category) from ID (unique)
    animationCategory: "throw", // Type: shared category
    animationId: "gon_sacrifice_throw", // ID: unique 1-1 mapping
    // Legacy field for backward compatibility
    // Animation: Sacrifice throw motion
    animationType: AnimationType.GON_SACRIFICE_THROW,
    animationSpeed: 1.0,
    category: "medium",
    range: "short",
    speed: 1.0,

    // ============= GON ENHANCEMENTS =============
    // 몸 바치기 (Mom Bachigi) - Body Sacrifice Throw
    throwTrajectory: "sacrifice_arc", // Backwards fall + forward throw
    groundImpactMultiplier: 1.6, // High impact from momentum transfer
    controlDuration: 800, // Less control (you're also on ground)
    supportiveHealing: 6, // HIGH healing (earth embrace during fall)
    earthCrackEffect: true, // Double impact (both fighters hit ground)
    selfRisk: 0.2, // 20% chance of self-damage from sacrifice
    momentumTransfer: "high", // Uses falling momentum for throw
    endingPosition: "ground_mutual", // Both fighters on ground after
    transitionBonus: 0.3, // 30% bonus to follow-up ground techniques
    takedownType: "sacrifice", // Sacrifice throw classification
  },
] as const;

/**
 * Get GON techniques count
 */
export const GON_TECHNIQUE_COUNT = GON_TECHNIQUES.length;

/**
 * Get GON technique by ID
 */
export function getGonTechniqueById(id: string): ExtendedGonTechnique | undefined {
  return GON_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all GON techniques by attack type
 */
export function getGonTechniquesByType(
  type: CombatAttackType
): readonly ExtendedGonTechnique[] {
  return GON_TECHNIQUES.filter((t) => t.type === type);
}
