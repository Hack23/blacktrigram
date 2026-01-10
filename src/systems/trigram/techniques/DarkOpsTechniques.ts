/**
 * 🌑 Dark Ops Techniques (암흑작전 기술)
 * Silent Incapacitation & Tactical Assassination
 *
 * Special operations techniques designed for the 암살자 (Amsalja) archetype.
 * Based on 5 specialized Korean Dark Ops units with focus on silent takedowns,
 * nerve disruption, and rapid incapacitation.
 *
 * Philosophy: "그림자처럼 움직이고 바람처럼 사라져라"
 *             Move like shadow, vanish like wind
 *
 * @module DarkOpsTechniques
 */

import type { KoreanTechnique } from "@/systems/vitalpoint";
import {
  CombatAttackType,
  DamageType,
  PlayerArchetype,
  TrigramStance,
} from "../../../types/common";
import { AnimationType } from "../../animation/MartialArtsAnimationBuilder";

// =====================================================
// DARK OPS UNIT DEFINITIONS
// =====================================================

/**
 * Dark Ops unit specializations (암흑작전 부대 특화)
 */
export const DARK_OPS_UNITS = {
  DARK_OPERATIONS: "암흑작전부대", // Dark Operations Unit - Silent Infiltration
  SHADOW_COMMANDO: "암흑특공대", // Shadow Commando Brigade - Demolition Tactics
  NIGHTFALL_SQUADRON: "심야작전부대", // Nightfall Squadron - Night Operations
  BLACK_OPS_TASK_FORCE: "블랙옵스부대", // Black Ops Task Force - Cyber-Enhanced
  DEEP_SEA_UNIT: "심해침투부대", // Deep Sea Unit - Amphibious Combat
} as const;

// =====================================================
// DARK OPS TECHNIQUES
// =====================================================

/**
 * Dark Ops techniques array - Silent incapacitation and tactical assassination
 * Designed for 암살자 (Amsalja) archetype with +30% effectiveness bonus
 *
 * Animation speeds are calibrated for stealth and precision:
 * - Silent: 0.8-0.9 (slow, controlled movements)
 * - Normal: 1.0 (standard techniques)
 * - Rapid: 1.1-1.2 (quick incapacitation)
 */
export const DARK_OPS_TECHNIQUES: readonly KoreanTechnique[] = [
  // ===== 암흑작전부대 (Dark Operations Unit) - Silent Infiltration =====
  {
    id: "darkops_silent_carotid",
    name: {
      korean: "은밀 경동맥 차단",
      english: "Silent Carotid Strike",
      romanized: "Eunmil Gyeongdongmaek Chadan",
    },
    koreanName: "은밀 경동맥 차단",
    englishName: "Silent Carotid Strike",
    romanized: "Eunmil Gyeongdongmaek Chadan",
    description: {
      korean:
        "경동맥을 압박하여 소리 없이 실신시킴. 3초 내 무의식 유발. 암흑작전부대의 침투 기술.",
      english:
        "Silent carotid compression causing unconsciousness within 3 seconds. Dark Operations Unit infiltration technique.",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.PRESSURE_POINT,
    damageType: DamageType.PRESSURE,
    damage: 28,
    kiCost: 30,
    staminaCost: 25,
    accuracy: 0.92,
    range: 0.8,
    executionTime: 600,
    recoveryTime: 1000,
    critChance: 0.25,
    critMultiplier: 2.0,
    effects: [],
    // Animation: Silent choking motion
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.8,
  },
  {
    id: "darkops_nerve_paralysis",
    name: {
      korean: "신경마비타격",
      english: "Nerve Paralysis Strike",
      romanized: "Singyeong Mabi Tagyeok",
    },
    koreanName: "신경마비타격",
    englishName: "Nerve Paralysis Strike",
    romanized: "Singyeong Mabi Tagyeok",
    description: {
      korean: "신경총을 정밀 타격하여 사지 마비 유발. 블랙옵스 기술 강화.",
      english:
        "Precise nerve cluster strike causing limb paralysis. Black Ops tech-enhanced technique.",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.NERVE_STRIKE,
    damageType: DamageType.NERVE,
    damage: 26,
    kiCost: 25,
    staminaCost: 20,
    accuracy: 0.95,
    range: 1.0,
    executionTime: 500,
    recoveryTime: 900,
    critChance: 0.3,
    critMultiplier: 2.2,
    effects: [],
    // Animation: Precision nerve strike
    animationType: AnimationType.JAB,
    animationSpeed: 1.1,
  },

  // ===== 암흑특공대 (Shadow Commando Brigade) - Demolition Tactics =====
  {
    id: "darkops_liver_disruption",
    name: {
      korean: "간장타격",
      english: "Liver Disruption Strike",
      romanized: "Ganjang Tagyeok",
    },
    koreanName: "간장타격",
    englishName: "Liver Disruption Strike",
    romanized: "Ganjang Tagyeok",
    description: {
      korean:
        "간을 강타하여 내부 출혈과 급격한 체력 소진 유발. 암흑특공대 폭파 전술.",
      english:
        "Powerful liver strike causing internal trauma and rapid stamina drain. Shadow Commando explosive tactic.",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.INTERNAL,
    damage: 35,
    kiCost: 28,
    staminaCost: 30,
    accuracy: 0.85,
    range: 1.2,
    executionTime: 700,
    recoveryTime: 1100,
    critChance: 0.22,
    critMultiplier: 2.1,
    effects: [],
    // Animation: Powerful body hook
    animationType: AnimationType.HOOK,
    animationSpeed: 1.0,
  },
  {
    id: "darkops_kidney_strike",
    name: {
      korean: "신장충격",
      english: "Kidney Shock",
      romanized: "Sinjang Chunggyeok",
    },
    koreanName: "신장충격",
    englishName: "Kidney Shock",
    romanized: "Sinjang Chunggyeok",
    description: {
      korean:
        "신장을 타격하여 극심한 고통과 일시적 마비 유발. 폭발적 힘의 암흑특공대 기술.",
      english:
        "Kidney strike causing severe pain and temporary paralysis. Shadow Commando explosive force technique.",
    },
    stance: TrigramStance.JIN,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.INTERNAL,
    damage: 33,
    kiCost: 26,
    staminaCost: 28,
    accuracy: 0.82,
    range: 1.1,
    executionTime: 650,
    recoveryTime: 1050,
    critChance: 0.2,
    critMultiplier: 2.0,
    effects: [],
    // Animation: Short hook to kidney
    animationType: AnimationType.HOOK,
    animationSpeed: 1.1,
  },

  // ===== 심야작전부대 (Nightfall Squadron) - Night Operations =====
  {
    id: "darkops_throat_strike",
    name: {
      korean: "후두차단",
      english: "Throat Disruption",
      romanized: "Hudu Chadan",
    },
    koreanName: "후두차단",
    englishName: "Throat Disruption",
    romanized: "Hudu Chadan",
    description: {
      korean:
        "후두를 타격하여 호흡 곤란과 발성 불가 유발. 심야작전부대의 무음 제압술.",
      english:
        "Throat strike causing breathing difficulty and voice loss. Nightfall Squadron silent suppression technique.",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.PRESSURE,
    damage: 30,
    kiCost: 24,
    staminaCost: 22,
    accuracy: 0.88,
    range: 0.9,
    executionTime: 550,
    recoveryTime: 950,
    critChance: 0.24,
    critMultiplier: 2.1,
    effects: [],
    // Animation: Throat strike
    animationType: AnimationType.JAB,
    animationSpeed: 1.0,
  },
  {
    id: "darkops_solar_plexus_paralyze",
    name: {
      korean: "명치마비",
      english: "Solar Plexus Paralysis",
      romanized: "Myeongchi Mabi",
    },
    koreanName: "명치마비",
    englishName: "Solar Plexus Paralysis",
    romanized: "Myeongchi Mabi",
    description: {
      korean:
        "명치를 정밀 타격하여 횡격막 마비와 호흡 정지. 심야작전부대 야간 전술.",
      english:
        "Precise solar plexus strike causing diaphragm paralysis and breath cessation. Nightfall Squadron night tactic.",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.THRUST,
    damageType: DamageType.NERVE,
    damage: 32,
    kiCost: 28,
    staminaCost: 24,
    accuracy: 0.9,
    range: 1.0,
    executionTime: 600,
    recoveryTime: 1000,
    critChance: 0.26,
    critMultiplier: 2.2,
    effects: [],
    // Animation: Precision thrust
    animationType: AnimationType.JAB,
    animationSpeed: 1.0,
  },

  // ===== 블랙옵스부대 (Black Ops Task Force) - Cyber-Enhanced Combat =====
  {
    id: "darkops_brachial_plexus_strike",
    name: {
      korean: "상완신경타격",
      english: "Brachial Plexus Strike",
      romanized: "Sangwan Singyeong Tagyeok",
    },
    koreanName: "상완신경타격",
    englishName: "Brachial Plexus Strike",
    romanized: "Sangwan Singyeong Tagyeok",
    description: {
      korean:
        "상완 신경총을 타격하여 팔 전체 마비. 블랙옵스 사이버 분석 기반 정밀 타격.",
      english:
        "Brachial plexus strike causing complete arm paralysis. Black Ops cyber-analysis precision targeting.",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.NERVE_STRIKE,
    damageType: DamageType.NERVE,
    damage: 28,
    kiCost: 26,
    staminaCost: 20,
    accuracy: 0.94,
    range: 1.1,
    executionTime: 550,
    recoveryTime: 900,
    critChance: 0.28,
    critMultiplier: 2.3,
    effects: [],
    // Animation: Arm strike
    animationType: AnimationType.JAB,
    animationSpeed: 1.1,
  },
  {
    id: "darkops_femoral_nerve_strike",
    name: {
      korean: "대퇴신경타격",
      english: "Femoral Nerve Strike",
      romanized: "Daetoe Singyeong Tagyeok",
    },
    koreanName: "대퇴신경타격",
    englishName: "Femoral Nerve Strike",
    romanized: "Daetoe Singyeong Tagyeok",
    description: {
      korean: "대퇴 신경을 타격하여 다리 이동 불가. 블랙옵스 디지털 표적 지정.",
      english:
        "Femoral nerve strike disabling leg mobility. Black Ops digital targeting system.",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.KICK,
    damageType: DamageType.NERVE,
    damage: 30,
    kiCost: 24,
    staminaCost: 26,
    accuracy: 0.9,
    range: 1.4,
    executionTime: 600,
    recoveryTime: 1000,
    critChance: 0.24,
    critMultiplier: 2.1,
    effects: [],
    // Animation: Low kick to thigh
    animationType: AnimationType.LOW_KICK,
    animationSpeed: 1.0,
  },

  // ===== 심해침투부대 (Deep Sea Unit) - Amphibious Combat =====
  {
    id: "darkops_rear_choke",
    name: {
      korean: "후방목졸임",
      english: "Rear Naked Choke",
      romanized: "Hubang Mokjorim",
    },
    koreanName: "후방목졸임",
    englishName: "Rear Naked Choke",
    romanized: "Hubang Mokjorim",
    description: {
      korean:
        "후방에서 목을 조여 혈류 차단과 의식 상실. 심해침투부대 수중 전투 기술.",
      english:
        "Rear choke cutting blood flow and causing unconsciousness. Deep Sea Unit underwater combat technique.",
    },
    stance: TrigramStance.GAM,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.PRESSURE,
    damage: 34,
    kiCost: 30,
    staminaCost: 32,
    accuracy: 0.86,
    range: 0.7,
    executionTime: 800,
    recoveryTime: 1200,
    critChance: 0.22,
    critMultiplier: 2.0,
    effects: [],
    // Animation: Rear choke hold
    animationType: AnimationType.GRAPPLE,
    animationSpeed: 0.9,
  },
  {
    id: "darkops_spinal_strike",
    name: {
      korean: "척추타격",
      english: "Spinal Column Strike",
      romanized: "Cheokchu Tagyeok",
    },
    koreanName: "척추타격",
    englishName: "Spinal Column Strike",
    romanized: "Cheokchu Tagyeok",
    description: {
      korean:
        "척추를 타격하여 전신 마비와 의식 상실. 심해침투부대 치명적 기술.",
      english:
        "Spinal column strike causing full-body paralysis and unconsciousness. Deep Sea Unit lethal technique.",
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.NERVE,
    damage: 40,
    kiCost: 35,
    staminaCost: 35,
    accuracy: 0.78,
    range: 1.0,
    executionTime: 750,
    recoveryTime: 1150,
    critChance: 0.3,
    critMultiplier: 2.5,
    effects: [],
    // Animation: Powerful back strike
    animationType: AnimationType.CROSS,
    animationSpeed: 1.0,
  },

  // ===== Additional Dark Ops Techniques - Mixed Units =====
  {
    id: "darkops_jaw_dislocation",
    name: {
      korean: "턱탈구",
      english: "Jaw Dislocation",
      romanized: "Teok Talgu",
    },
    koreanName: "턱탈구",
    englishName: "Jaw Dislocation",
    romanized: "Teok Talgu",
    description: {
      korean: "턱을 비틀어 탈구시키고 의식 혼미. 암흑작전부대 신속 무력화.",
      english:
        "Twisting jaw causing dislocation and disorientation. Dark Operations rapid incapacitation.",
    },
    stance: TrigramStance.TAE,
    type: CombatAttackType.GRAPPLE,
    damageType: DamageType.JOINT,
    damage: 30,
    kiCost: 22,
    staminaCost: 24,
    accuracy: 0.88,
    range: 0.8,
    executionTime: 600,
    recoveryTime: 1000,
    critChance: 0.24,
    critMultiplier: 2.0,
    effects: [],
    // Animation: Jaw manipulation
    animationType: AnimationType.WRIST_LOCK,
    animationSpeed: 0.9,
  },
  {
    id: "darkops_temple_strike",
    name: {
      korean: "관자놀이급타",
      english: "Temple Knockout Strike",
      romanized: "Gwanja-nori Geubta",
    },
    koreanName: "관자놀이급타",
    englishName: "Temple Knockout Strike",
    romanized: "Gwanja-nori Geubta",
    description: {
      korean: "관자놀이를 정확히 타격하여 즉시 의식 상실. 블랙옵스 치명 타격.",
      english:
        "Precise temple strike causing immediate unconsciousness. Black Ops lethal targeting.",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 38,
    kiCost: 32,
    staminaCost: 28,
    accuracy: 0.92,
    range: 1.1,
    executionTime: 550,
    recoveryTime: 950,
    critChance: 0.32,
    critMultiplier: 2.4,
    effects: [],
    // Animation: Temple strike
    animationType: AnimationType.HOOK,
    animationSpeed: 1.1,
  },
  {
    id: "darkops_achilles_sever",
    name: {
      korean: "아킬레스절단",
      english: "Achilles Tendon Sever",
      romanized: "Akilles Jeoldan",
    },
    koreanName: "아킬레스절단",
    englishName: "Achilles Tendon Sever",
    romanized: "Akilles Jeoldan",
    description: {
      korean: "아킬레스건을 공격하여 이동 불가. 암흑특공대 무력화 기술.",
      english:
        "Achilles tendon strike disabling mobility. Shadow Commando incapacitation technique.",
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.KICK,
    damageType: DamageType.SLASHING,
    damage: 32,
    kiCost: 26,
    staminaCost: 28,
    accuracy: 0.84,
    range: 1.3,
    executionTime: 650,
    recoveryTime: 1050,
    critChance: 0.26,
    critMultiplier: 2.2,
    effects: [],
    // Animation: Low cutting kick
    animationType: AnimationType.LOW_KICK,
    animationSpeed: 1.0,
  },
  {
    id: "darkops_ear_strike",
    name: {
      korean: "귓바퀴타격",
      english: "Ear Box Strike",
      romanized: "Gwitbakwi Tagyeok",
    },
    koreanName: "귓바퀴타격",
    englishName: "Ear Box Strike",
    romanized: "Gwitbakwi Tagyeok",
    description: {
      korean:
        "양쪽 귀를 동시 타격하여 고막 파열과 평형 상실. 심야작전부대 방향 감각 교란.",
      english:
        "Simultaneous ear strikes rupturing eardrums and disrupting balance. Nightfall Squadron disorientation tactic.",
    },
    stance: TrigramStance.SON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 28,
    kiCost: 24,
    staminaCost: 22,
    accuracy: 0.86,
    range: 0.9,
    executionTime: 500,
    recoveryTime: 900,
    critChance: 0.22,
    critMultiplier: 2.0,
    effects: [],
    // Animation: Double palm strike
    animationType: AnimationType.PALM_STRIKE,
    animationSpeed: 1.1,
  },
  {
    id: "darkops_eye_gouge",
    name: {
      korean: "안구공격",
      english: "Eye Strike",
      romanized: "Angu Gonggyeok",
    },
    koreanName: "안구공격",
    englishName: "Eye Strike",
    romanized: "Angu Gonggyeok",
    description: {
      korean:
        "눈을 정밀 공격하여 시각 상실과 전투 무력화. 암살자 특화 치명 기술.",
      english:
        "Precise eye strike causing vision loss and combat incapacitation. Assassin specialty lethal technique.",
    },
    stance: TrigramStance.LI,
    type: CombatAttackType.THRUST,
    damageType: DamageType.PIERCING,
    damage: 36,
    kiCost: 30,
    staminaCost: 26,
    accuracy: 0.9,
    range: 1.0,
    executionTime: 500,
    recoveryTime: 900,
    critChance: 0.3,
    critMultiplier: 2.4,
    effects: [],
    // Animation: Precision finger thrust
    animationType: AnimationType.JAB,
    animationSpeed: 1.2,
  },
] as const;

// =====================================================
// DARK OPS CONFIGURATION
// =====================================================

/**
 * Dark Ops archetype bonus configuration
 * 암살자 (Amsalja) gets +30% effectiveness with all Dark Ops techniques
 */
export const DARK_OPS_ARCHETYPE_BONUSES: Record<PlayerArchetype, number> = {
  [PlayerArchetype.AMSALJA]: 1.3, // +30% for Shadow Assassin archetype
  [PlayerArchetype.JEONGBO_YOWON]: 1.15, // +15% for Intelligence Operative
  [PlayerArchetype.HACKER]: 1.1, // +10% for Cyber Warrior (tech synergy)
  [PlayerArchetype.MUSA]: 0.85, // -15% for Traditional Warrior (dishonorable)
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: 1.05, // +5% for Organized Crime (ruthless)
} as const;

/**
 * Dark Ops night operations bonus
 * Time-of-day effectiveness multiplier (simulated)
 */
export const DARK_OPS_NIGHT_BONUS = {
  night: 1.25, // +25% at night (00:00 - 06:00, 18:00 - 23:59)
  day: 1.0, // Normal during day (06:00 - 18:00)
  twilight: 1.15, // +15% during twilight (05:00 - 07:00, 17:00 - 19:00)
} as const;

/**
 * Dark Ops special effects configuration
 */
export const DARK_OPS_SPECIAL_EFFECTS = {
  silent: {
    korean: "무음 공격",
    english: "Silent Attack",
    description: {
      korean: "적에게 경보를 발생시키지 않음",
      english: "Does not alert enemies",
    },
    noAlert: true,
  },
  paralysis: {
    korean: "마비",
    english: "Paralysis",
    description: {
      korean: "일시적 또는 영구적 사지 마비",
      english: "Temporary or permanent limb paralysis",
    },
    duration: 3000, // 3 seconds
  },
  unconsciousness: {
    korean: "의식 상실",
    english: "Unconsciousness",
    description: {
      korean: "즉시 의식을 잃음",
      english: "Immediate loss of consciousness",
    },
    duration: 5000, // 5 seconds
  },
  breathingDifficulty: {
    korean: "호흡 곤란",
    english: "Breathing Difficulty",
    description: {
      korean: "호흡 재생 -75%",
      english: "Breathing regen -75%",
    },
    staminaRegenPenalty: -0.75,
    duration: 5000, // 5 seconds
  },
  disorientation: {
    korean: "방향 감각 상실",
    english: "Disorientation",
    description: {
      korean: "정확도 -50%",
      english: "Accuracy -50%",
    },
    accuracyPenalty: -0.5,
    duration: 4000, // 4 seconds
  },
} as const;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get Dark Ops techniques count
 */
export const DARK_OPS_TECHNIQUE_COUNT = DARK_OPS_TECHNIQUES.length;

/**
 * Get Dark Ops technique by ID
 */
export function getDarkOpsTechniqueById(
  id: string
): KoreanTechnique | undefined {
  return DARK_OPS_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Get all Dark Ops techniques for a specific unit
 */
export function getDarkOpsTechniquesByUnit(
  unitType: keyof typeof DARK_OPS_UNITS
): readonly KoreanTechnique[] {
  // Map technique IDs to units based on prefix patterns
  const unitPrefixMap: Record<string, string[]> = {
    DARK_OPERATIONS: ["darkops_silent_carotid", "darkops_jaw_dislocation"],
    SHADOW_COMMANDO: [
      "darkops_liver_disruption",
      "darkops_kidney_strike",
      "darkops_achilles_sever",
    ],
    NIGHTFALL_SQUADRON: [
      "darkops_throat_strike",
      "darkops_solar_plexus_paralyze",
      "darkops_ear_strike",
    ],
    BLACK_OPS_TASK_FORCE: [
      "darkops_nerve_paralysis",
      "darkops_brachial_plexus_strike",
      "darkops_femoral_nerve_strike",
      "darkops_temple_strike",
    ],
    DEEP_SEA_UNIT: ["darkops_rear_choke", "darkops_spinal_strike"],
  };

  const techniqueIds = unitPrefixMap[unitType] ?? [];
  return DARK_OPS_TECHNIQUES.filter((t) => techniqueIds.includes(t.id));
}

/**
 * Get archetype effectiveness multiplier for Dark Ops
 */
export function getDarkOpsArchetypeBonus(archetype: PlayerArchetype): number {
  return DARK_OPS_ARCHETYPE_BONUSES[archetype] ?? 1.0;
}
