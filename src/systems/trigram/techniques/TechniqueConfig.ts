/**
 * Technique Configuration & Constants
 * 한국 무술 기법 설정 및 상수
 *
 * Contains all configuration, modifiers, effectiveness matrices,
 * and metadata for the Korean martial arts technique system.
 *
 * @module TechniqueConfig
 */

import {
  CombatAttackType,
  DamageType,
  TrigramStance,
} from "../../../types/common";

// =====================================================
// TECHNIQUE MODIFIERS
// =====================================================

/**
 * Technique effectiveness modifiers
 */
export const TECHNIQUE_MODIFIERS = {
  DAMAGE_VARIANCE: 0.15, // ±15% damage variance
  CRITICAL_DAMAGE_BASE: 1.5,
  VITAL_POINT_BONUS: 2.0,
  STANCE_MISMATCH_PENALTY: 0.8,
  COMBO_MULTIPLIER: 1.1,
} as const;

// =====================================================
// TECHNIQUE PROPERTIES
// =====================================================

/**
 * Base properties for each combat attack type
 */
export const TECHNIQUE_PROPERTIES: Record<
  CombatAttackType,
  {
    readonly baseDamage: number;
    readonly range: number;
    readonly accuracy: number;
    readonly kiCost: number;
    readonly staminaCost: number;
  }
> = {
  [CombatAttackType.STRIKE]: {
    baseDamage: 20,
    range: 1.0,
    accuracy: 0.85,
    kiCost: 15,
    staminaCost: 10,
  },
  [CombatAttackType.THRUST]: {
    baseDamage: 25,
    range: 1.5,
    accuracy: 0.9,
    kiCost: 18,
    staminaCost: 12,
  },
  [CombatAttackType.BLOCK]: {
    baseDamage: 5,
    range: 0.5,
    accuracy: 0.95,
    kiCost: 8,
    staminaCost: 15,
  },
  [CombatAttackType.COUNTER_ATTACK]: {
    baseDamage: 22,
    range: 1.0,
    accuracy: 0.88,
    kiCost: 20,
    staminaCost: 15,
  },
  [CombatAttackType.THROW]: {
    baseDamage: 30,
    range: 0.8,
    accuracy: 0.75,
    kiCost: 25,
    staminaCost: 20,
  },
  [CombatAttackType.GRAPPLE]: {
    baseDamage: 15,
    range: 0.6,
    accuracy: 0.8,
    kiCost: 20,
    staminaCost: 25,
  },
  [CombatAttackType.PRESSURE_POINT]: {
    baseDamage: 12,
    range: 0.8,
    accuracy: 0.95,
    kiCost: 25,
    staminaCost: 8,
  },
  [CombatAttackType.NERVE_STRIKE]: {
    baseDamage: 18,
    range: 1.0,
    accuracy: 0.9,
    kiCost: 22,
    staminaCost: 12,
  },
  [CombatAttackType.PUNCH]: {
    baseDamage: 18,
    range: 1.2,
    accuracy: 0.88,
    kiCost: 12,
    staminaCost: 8,
  },
  [CombatAttackType.KICK]: {
    baseDamage: 22,
    range: 1.8,
    accuracy: 0.82,
    kiCost: 16,
    staminaCost: 14,
  },
  [CombatAttackType.ELBOW]: {
    baseDamage: 26,
    range: 0.9,
    accuracy: 0.86,
    kiCost: 18,
    staminaCost: 12,
  },
  [CombatAttackType.KNEE]: {
    baseDamage: 28,
    range: 0.7,
    accuracy: 0.84,
    kiCost: 20,
    staminaCost: 16,
  },
} as const;

// =====================================================
// DAMAGE TYPE EFFECTIVENESS
// =====================================================

/**
 * Damage type effectiveness against different body tissues
 * 데미지 유형별 조직 효과 매트릭스
 */
export const DAMAGE_TYPE_EFFECTIVENESS: Record<
  DamageType,
  Record<string, number>
> = {
  blunt: {
    bone: 1.3,
    muscle: 1.1,
    organ: 1.0,
    nerve: 0.8,
    vascular: 0.9,
    joint: 1.2,
  },
  piercing: {
    bone: 0.7,
    muscle: 1.2,
    organ: 1.4,
    nerve: 1.1,
    vascular: 1.5,
    joint: 0.8,
  },
  slashing: {
    bone: 0.5,
    muscle: 1.3,
    organ: 1.1,
    nerve: 0.9,
    vascular: 1.4,
    joint: 0.7,
  },
  pressure: {
    bone: 0.6,
    muscle: 0.9,
    organ: 1.1,
    nerve: 1.6,
    vascular: 1.3,
    joint: 1.0,
  },
  nerve: {
    bone: 0.4,
    muscle: 0.8,
    organ: 1.0,
    nerve: 1.8,
    vascular: 1.2,
    joint: 0.9,
  },
  joint: {
    bone: 1.1,
    muscle: 0.9,
    organ: 0.7,
    nerve: 0.8,
    vascular: 0.6,
    joint: 1.7,
  },
  internal: {
    bone: 0.3,
    muscle: 0.7,
    organ: 1.5,
    nerve: 1.3,
    vascular: 1.1,
    joint: 0.5,
  },
  impact: {
    bone: 1.2,
    muscle: 1.0,
    organ: 1.1,
    nerve: 0.9,
    vascular: 0.8,
    joint: 1.3,
  },
  crushing: {
    bone: 1.5,
    muscle: 1.2,
    organ: 1.3,
    nerve: 0.7,
    vascular: 0.8,
    joint: 1.4,
  },
  sharp: {
    bone: 0.6,
    muscle: 1.4,
    organ: 1.2,
    nerve: 1.0,
    vascular: 1.6,
    joint: 0.8,
  },
  electric: {
    bone: 0.2,
    muscle: 1.0,
    organ: 0.9,
    nerve: 2.0,
    vascular: 1.1,
    joint: 0.5,
  },
  fire: {
    bone: 0.3,
    muscle: 1.1,
    organ: 1.2,
    nerve: 1.4,
    vascular: 1.0,
    joint: 0.6,
  },
  ice: {
    bone: 0.4,
    muscle: 0.8,
    organ: 0.9,
    nerve: 1.2,
    vascular: 0.7,
    joint: 1.1,
  },
  poison: {
    bone: 0.1,
    muscle: 0.6,
    organ: 1.8,
    nerve: 1.5,
    vascular: 1.7,
    joint: 0.3,
  },
  psychic: {
    bone: 0.0,
    muscle: 0.2,
    organ: 0.5,
    nerve: 2.2,
    vascular: 0.4,
    joint: 0.1,
  },
  blood: {
    bone: 0.2,
    muscle: 0.8,
    organ: 1.0,
    nerve: 0.5,
    vascular: 2.0,
    joint: 0.3,
  },
} as const;

// =====================================================
// TRIGRAM TECHNIQUE PROPERTIES
// =====================================================

/**
 * Korean trigram technique properties (팔괘 기법 특성)
 */
export const TRIGRAM_TECHNIQUE_PROPERTIES = {
  geon: {
    korean: "건괘",
    english: "Heaven",
    element: "metal",
    nature: "yang",
    combatStyle: "direct_force",
    preferredDamageTypes: ["blunt", "crushing", "impact"],
    philosophy: "정의로운 행동을 통한 압도적 힘",
  },
  tae: {
    korean: "태괘",
    english: "Lake",
    element: "metal",
    nature: "yin",
    combatStyle: "fluid_adaptation",
    preferredDamageTypes: ["pressure", "joint", "nerve"],
    philosophy: "부드러운 지속성이 경직된 저항을 이긴다",
  },
  li: {
    korean: "리괘",
    english: "Fire",
    element: "fire",
    nature: "yang",
    combatStyle: "precision_strikes",
    preferredDamageTypes: ["piercing", "sharp", "fire"],
    philosophy: "외과적 정밀함으로 약점을 조명한다",
  },
  jin: {
    korean: "진괘",
    english: "Thunder",
    element: "wood",
    nature: "yang",
    combatStyle: "explosive_power",
    preferredDamageTypes: ["electric", "impact", "blunt"],
    philosophy: "번개처럼 치고 천둥처럼 움직인다",
  },
  son: {
    korean: "손괘",
    english: "Wind",
    element: "wood",
    nature: "yin",
    combatStyle: "continuous_pressure",
    preferredDamageTypes: ["slashing", "pressure", "nerve"],
    philosophy: "지속적인 부드러운 힘이 모든 방어를 관통한다",
  },
  gam: {
    korean: "감괘",
    english: "Water",
    element: "water",
    nature: "yang",
    combatStyle: "adaptive_flow",
    preferredDamageTypes: ["blood", "poison", "internal"],
    philosophy: "장애물 주위로 흘러 급소를 타격한다",
  },
  gan: {
    korean: "간괘",
    english: "Mountain",
    element: "earth",
    nature: "yang",
    combatStyle: "immovable_defense",
    preferredDamageTypes: ["blunt", "crushing", "internal"],
    philosophy: "정적 속에 무한한 잠재 에너지를 담는다",
  },
  gon: {
    korean: "곤괘",
    english: "Earth",
    element: "earth",
    nature: "yin",
    combatStyle: "supportive_control",
    preferredDamageTypes: ["joint", "pressure", "internal"],
    philosophy: "지원하고 양육하여 승리를 이룬다",
  },
} as const;

// =====================================================
// KOREAN NAMING CONVENTIONS
// =====================================================

/**
 * Korean technique naming convention (한국 무술 명명법)
 */
export const TECHNIQUE_NAMING = {
  prefixes: {
    heaven: "천", // Heaven/Sky
    earth: "지", // Earth
    human: "인", // Human
    wind: "풍", // Wind
    thunder: "뇌", // Thunder
    fire: "화", // Fire
    water: "수", // Water
    mountain: "산", // Mountain
  },
  suffixes: {
    strike: "격", // Strike/Hit
    thrust: "찌르기", // Thrust/Stab
    block: "막기", // Block/Defend
    throw: "던지기", // Throw
    technique: "술", // Technique/Art
    method: "법", // Method/Way
  },
} as const;

// =====================================================
// TECHNIQUE CATEGORIES
// =====================================================

/**
 * Korean martial arts technique categories (한국 무술 기법 분류)
 */
export const KOREAN_TECHNIQUE_CATEGORIES = {
  striking: {
    korean: "타격술",
    english: "Striking Techniques",
    subcategories: ["punch", "kick", "elbow", "knee", "palm"],
  },
  grappling: {
    korean: "잡기술",
    english: "Grappling Techniques",
    subcategories: ["throw", "takedown", "joint_lock", "choke"],
  },
  pressure_point: {
    korean: "혈도술",
    english: "Pressure Point Techniques",
    subcategories: ["nerve_strike", "blood_flow", "ki_disruption"],
  },
  defensive: {
    korean: "방어술",
    english: "Defensive Techniques",
    subcategories: ["block", "parry", "dodge", "counter"],
  },
} as const;

// =====================================================
// DIFFICULTY LEVELS
// =====================================================

/**
 * Korean technique difficulty progression (한국 무술 난이도 체계)
 */
export const TECHNIQUE_DIFFICULTY_LEVELS = {
  basic: {
    korean: "기초",
    english: "Basic",
    requirements: { ki: 10, stamina: 8, experience: 0 },
  },
  intermediate: {
    korean: "중급",
    english: "Intermediate",
    requirements: { ki: 20, stamina: 15, experience: 100 },
  },
  advanced: {
    korean: "고급",
    english: "Advanced",
    requirements: { ki: 35, stamina: 25, experience: 500 },
  },
  master: {
    korean: "사범",
    english: "Master",
    requirements: { ki: 50, stamina: 40, experience: 1000 },
  },
} as const;

// =====================================================
// ARCHETYPE BONUSES
// =====================================================

/**
 * Korean archetype combat specializations (한국 무사 유형별 전투 특화)
 */
export const ARCHETYPE_TECHNIQUE_BONUSES = {
  musa: {
    korean: "무사",
    english: "Traditional Warrior",
    philosophy: "Honor through strength, disciplined combat",
    combatStyle: "Direct confrontation, overwhelming force",
    preferredTrigrams: ["geon", "jin"],
    techniques: {
      관절기법: "Joint manipulation and control",
      급소타격: "Military-taught pressure point targeting",
      제압술: "Honor-based control methods",
    },
    bonuses: {
      damageResistance: 1.2,
      jointTechniques: 1.5,
      militaryDiscipline: 1.3,
      darkOpsEffectiveness: 0.85,
      damageBonus: 1.2,
      accuracyBonus: 1.1,
      kiEfficiency: 1.0,
      staminaEfficiency: 1.1,
    },
    preferredTechniques: ["strike", "block", "counter_attack"],
  },
  amsalja: {
    korean: "암살자",
    english: "Shadow Assassin",
    philosophy: "Efficiency through invisibility, one perfect strike",
    combatStyle: "Stealth approaches, instant takedowns",
    preferredTrigrams: ["son", "gam", "li"],
    techniques: {
      무성제압: "Silent takedowns preventing vocal response",
      신경파괴: "Precise neural disruption for stealth",
      호흡차단: "Silent breathing and consciousness targeting",
      암흑작전: "Dark Ops techniques for silent incapacitation",
    },
    bonuses: {
      stealthMultiplier: 1.8,
      oneStrikeKill: 2.0,
      silentMovement: 1.5,
      darkOpsEffectiveness: 1.3,
      nightOperationsBonus: 1.25,
      damageBonus: 1.5,
      accuracyBonus: 1.3,
      kiEfficiency: 1.2,
      staminaEfficiency: 0.9,
    },
    preferredTechniques: [
      "nerve_strike",
      "pressure_point",
      "thrust",
      "darkops",
    ],
  },
  hacker: {
    korean: "해커",
    english: "Cyber Warrior",
    philosophy: "Information as power, technological advantage",
    combatStyle: "Environmental manipulation, tech-assisted strikes",
    preferredTrigrams: ["li", "tae"],
    techniques: {
      해부학적분석: "Data-driven approach to vital points",
      생체역학파괴: "Tech-enhanced body mechanics understanding",
      체계적제압: "Algorithm-based damage accumulation",
      디지털타격: "Digital targeting systems for Dark Ops",
    },
    bonuses: {
      precisionAnalysis: 1.6,
      environmentalControl: 1.4,
      dataOptimization: 1.3,
      darkOpsEffectiveness: 1.1,
      damageBonus: 1.1,
      accuracyBonus: 1.4,
      kiEfficiency: 1.3,
      staminaEfficiency: 1.0,
    },
    preferredTechniques: ["pressure_point", "nerve_strike"],
  },
  jeongbo_yowon: {
    korean: "정보요원",
    english: "Intelligence Operative",
    philosophy: "Knowledge through observation, strategic thinking",
    combatStyle: "Psychological manipulation, precise timing",
    preferredTrigrams: ["gan", "gon"],
    techniques: {
      고통순응: "Intelligence-based submission through pain",
      심리적압박: "Mental intimidation through technique",
      정보추출: "Combat methods from interrogation training",
      첩보전술: "Espionage tactics and Dark Ops methods",
    },
    bonuses: {
      psychologicalWarfare: 1.5,
      strategicAnalysis: 1.4,
      painCompliance: 1.7,
      darkOpsEffectiveness: 1.15,
      damageBonus: 1.1,
      accuracyBonus: 1.2,
      kiEfficiency: 1.1,
      staminaEfficiency: 1.2,
    },
    preferredTechniques: ["grapple", "pressure_point"],
  },
  jojik_pokryeokbae: {
    korean: "조직폭력배",
    english: "Organized Crime",
    philosophy: "Survival through ruthlessness, practical violence",
    combatStyle: "Dirty fighting, improvised weapons",
    preferredTrigrams: ["jin", "gam"],
    techniques: {
      환경활용: "Street-smart use of surroundings as weapons",
      더러운기법: "Brutal eye attacks, groin strikes, hair pulling",
      생존격투: "Underground whatever-it-takes combat",
      무자비술: "Ruthless Dark Ops adaptations",
    },
    bonuses: {
      dirtyFighting: 1.8,
      survivalInstinct: 1.6,
      streetSmart: 1.5,
      darkOpsEffectiveness: 1.05,
      damageBonus: 1.3,
      accuracyBonus: 0.9,
      kiEfficiency: 0.9,
      staminaEfficiency: 1.3,
    },
    preferredTechniques: ["strike", "throw", "grapple"],
  },
} as const;

// =====================================================
// STANCE-TRIGRAM MAPPING
// =====================================================

/**
 * Map TrigramStance enum to trigram key strings
 */
export function getTrigramKey(
  stance: TrigramStance
): keyof typeof TRIGRAM_TECHNIQUE_PROPERTIES {
  const stanceMap: Record<
    TrigramStance,
    keyof typeof TRIGRAM_TECHNIQUE_PROPERTIES
  > = {
    [TrigramStance.GEON]: "geon",
    [TrigramStance.TAE]: "tae",
    [TrigramStance.LI]: "li",
    [TrigramStance.JIN]: "jin",
    [TrigramStance.SON]: "son",
    [TrigramStance.GAM]: "gam",
    [TrigramStance.GAN]: "gan",
    [TrigramStance.GON]: "gon",
  };
  return stanceMap[stance];
}

/**
 * Get trigram properties by stance
 */
export function getTrigramProperties(stance: TrigramStance) {
  const key = getTrigramKey(stance);
  return TRIGRAM_TECHNIQUE_PROPERTIES[key];
}

/**
 * Calculate damage effectiveness for a damage type against tissue
 */
export function calculateDamageEffectiveness(
  damageType: DamageType,
  tissueType: string
): number {
  const effectiveness = DAMAGE_TYPE_EFFECTIVENESS[damageType];
  return effectiveness?.[tissueType] ?? 1.0;
}
