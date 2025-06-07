/**
 * Korean martial arts techniques for each trigram stance
 */

import type { KoreanTechnique } from "../combat";
import type { TrigramStance } from "../enums";

// Base techniques for each trigram stance
export const TRIGRAM_TECHNIQUES: Record<
  TrigramStance,
  readonly KoreanTechnique[]
> = {
  geon: [
    {
      id: "geon_heaven_strike",
      name: "천둥벽력",
      koreanName: "천둥벽력",
      englishName: "Thunder Strike",
      romanized: "cheondung_byeokryeok",
      description: {
        korean: "하늘의 힘을 담은 직접적인 타격",
        english: "Direct strike imbued with heavenly power",
      },
      stance: "geon",
      type: "strike",
      damageType: "blunt",
      damage: 30,
      kiCost: 15,
      staminaCost: 20,
      accuracy: 0.8,
      range: 1.2,
      executionTime: 800,
      recoveryTime: 1200,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    },
  ],
  tae: [
    {
      id: "tae_flowing_strikes",
      name: "유수연타",
      koreanName: "유수연타",
      englishName: "Flowing Strikes",
      romanized: "yusu_yeonta",
      description: {
        korean: "물의 흐름처럼 연속적인 타격",
        english: "Continuous strikes like flowing water",
      },
      stance: "tae",
      type: "strike",
      damageType: "blunt",
      damage: 25,
      kiCost: 12,
      staminaCost: 18,
      accuracy: 0.85,
      range: 1.0,
      executionTime: 600,
      recoveryTime: 1000,
      critChance: 0.08,
      critMultiplier: 1.3,
      effects: [],
    },
  ],
  li: [
    {
      id: "li_flame_spear",
      name: "화염지창",
      koreanName: "화염지창",
      englishName: "Flame Spear",
      romanized: "hwayeom_jichang",
      description: {
        korean: "불꽃처럼 정확하고 날카로운 공격",
        english: "Precise and sharp attack like flame",
      },
      stance: "li",
      type: "thrust",
      damageType: "piercing",
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
    },
  ],
  jin: [
    {
      id: "jin_lightning_flash",
      name: "벽력일섬",
      koreanName: "벽력일섬",
      englishName: "Lightning Flash",
      romanized: "byeokryeok_ilseom",
      description: {
        korean: "번개처럼 빠른 일격",
        english: "Swift strike like lightning",
      },
      stance: "jin",
      type: "strike",
      damageType: "blunt",
      damage: 28,
      kiCost: 10,
      staminaCost: 25,
      accuracy: 0.75,
      range: 1.0,
      executionTime: 500,
      recoveryTime: 800,
      critChance: 0.12,
      critMultiplier: 1.6,
      effects: [],
    },
  ],
  son: [
    {
      id: "son_whirlwind_barrage",
      name: "선풍연격",
      koreanName: "선풍연격",
      englishName: "Whirlwind Barrage",
      romanized: "seonpung_yeongyeok",
      description: {
        korean: "바람처럼 연속적인 공격",
        english: "Continuous attacks like wind",
      },
      stance: "son",
      type: "strike",
      damageType: "blunt",
      damage: 22,
      kiCost: 8,
      staminaCost: 30,
      accuracy: 0.7,
      range: 0.8,
      executionTime: 400,
      recoveryTime: 600,
      critChance: 0.06,
      critMultiplier: 1.2,
      effects: [],
    },
  ],
  gam: [
    {
      id: "gam_water_counter",
      name: "수류반격",
      koreanName: "수류반격",
      englishName: "Water Counter",
      romanized: "suryu_bangyeok",
      description: {
        korean: "물의 흐름으로 적의 공격을 받아넘기는 반격",
        english: "Counter-attack that flows like water",
      },
      stance: "gam",
      type: "counter_attack",
      damageType: "blunt",
      damage: 32,
      kiCost: 20,
      staminaCost: 12,
      accuracy: 0.85,
      range: 0.9,
      executionTime: 600,
      recoveryTime: 900,
      critChance: 0.18,
      critMultiplier: 1.7,
      effects: [],
    },
  ],
  gan: [
    {
      id: "gan_rock_defense",
      name: "반석방어",
      koreanName: "반석방어",
      englishName: "Rock Defense",
      romanized: "banseok_bangeo",
      description: {
        korean: "바위처럼 견고한 방어 자세",
        english: "Solid defense like a rock",
      },
      stance: "gan",
      type: "block",
      damageType: "blunt",
      damage: 15,
      kiCost: 5,
      staminaCost: 8,
      accuracy: 0.95,
      range: 0.5,
      executionTime: 300,
      recoveryTime: 500,
      critChance: 0.02,
      critMultiplier: 1.0,
      effects: [],
    },
  ],
  gon: [
    {
      id: "gon_earth_embrace",
      name: "대지포옹",
      koreanName: "대지포옹",
      englishName: "Earth Embrace",
      romanized: "daeji_pooong",
      description: {
        korean: "대지의 힘으로 상대를 제압하는 기술",
        english: "Grappling technique using earth's power",
      },
      stance: "gon",
      type: "grapple",
      damageType: "blunt",
      damage: 26,
      kiCost: 16,
      staminaCost: 22,
      accuracy: 0.72,
      range: 0.7,
      executionTime: 900,
      recoveryTime: 1300,
      critChance: 0.08,
      critMultiplier: 1.4,
      effects: [],
    },
  ],
};

// Technique effectiveness modifiers
export const TECHNIQUE_MODIFIERS = {
  DAMAGE_VARIANCE: 0.15, // ±15% damage variance
  CRITICAL_DAMAGE_BASE: 1.5,
  VITAL_POINT_BONUS: 2.0,
  STANCE_MISMATCH_PENALTY: 0.8,
  COMBO_MULTIPLIER: 1.1,
} as const;

// Korean martial arts techniques for Black Trigram

import type { DamageType, EnumCombatAttackType } from "../index"; // Use EnumCombatAttackType

// Single TECHNIQUE_PROPERTIES declaration - Korean martial arts authentic
export const TECHNIQUE_PROPERTIES: Record<
  Extract<
    EnumCombatAttackType,
    | "strike"
    | "thrust"
    | "block"
    | "counter_attack"
    | "throw"
    | "grapple"
    | "pressure_point"
    | "nerve_strike"
    | "punch"
  >,
  {
    baseDamage: number;
    range: number;
    accuracy: number;
    kiCost: number;
    staminaCost: number;
  }
> = {
  strike: {
    baseDamage: 20,
    range: 1.0,
    accuracy: 0.85,
    kiCost: 15,
    staminaCost: 10,
  },
  thrust: {
    baseDamage: 25,
    range: 1.5,
    accuracy: 0.9,
    kiCost: 18,
    staminaCost: 12,
  },
  block: {
    baseDamage: 5,
    range: 0.5,
    accuracy: 0.95,
    kiCost: 8,
    staminaCost: 15,
  },
  counter_attack: {
    baseDamage: 22,
    range: 1.0,
    accuracy: 0.88,
    kiCost: 20,
    staminaCost: 15,
  },
  throw: {
    baseDamage: 30,
    range: 0.8,
    accuracy: 0.75,
    kiCost: 25,
    staminaCost: 20,
  },
  grapple: {
    baseDamage: 15,
    range: 0.6,
    accuracy: 0.8,
    kiCost: 20,
    staminaCost: 25,
  },
  pressure_point: {
    baseDamage: 12,
    range: 0.8,
    accuracy: 0.95,
    kiCost: 25,
    staminaCost: 8,
  },
  nerve_strike: {
    baseDamage: 18,
    range: 1.0,
    accuracy: 0.9,
    kiCost: 22,
    staminaCost: 12,
  },
  punch: {
    // Added punch properties
    baseDamage: 18,
    range: 0.9,
    accuracy: 0.88,
    kiCost: 12,
    staminaCost: 8,
  },
} as const;

// Complete DAMAGE_TYPE_EFFECTIVENESS matrix with ALL damage types
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

// Korean technique naming convention (한국 무술 명명법)
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

// Korean martial arts technique categories (한국 무술 기법 분류)
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

// Korean technique difficulty progression (한국 무술 난이도 체계)
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

// Korean trigram technique properties (팔괘 기법 특성)
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

// Korean archetype combat specializations (한국 무사 유형별 전투 특화)
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
      // Retaining original fields for compatibility, adjust as needed
      damageBonus: 1.2,
      accuracyBonus: 1.1,
      kiEfficiency: 1.0,
      staminaEfficiency: 1.1,
    },
    preferredTechniques: ["strike", "block", "counter_attack"], // Kept for potential compatibility
  },
  amsalja: {
    korean: "암살자",
    english: "Shadow Assassin",
    philosophy: "Efficiency through invisibility, one perfect strike",
    combatStyle: "Stealth approaches, instant takedowns",
    preferredTrigrams: ["son", "gam"],
    techniques: {
      무성제압: "Silent takedowns preventing vocal response",
      신경파괴: "Precise neural disruption for stealth",
      호흡차단: "Silent breathing and consciousness targeting",
    },
    bonuses: {
      stealthMultiplier: 1.8,
      oneStrikeKill: 2.0,
      silentMovement: 1.5,
      // Retaining original fields for compatibility, adjust as needed
      damageBonus: 1.5,
      accuracyBonus: 1.3,
      kiEfficiency: 1.2,
      staminaEfficiency: 0.9,
    },
    preferredTechniques: ["nerve_strike", "pressure_point", "thrust"], // Kept for potential compatibility
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
    },
    bonuses: {
      precisionAnalysis: 1.6,
      environmentalControl: 1.4,
      dataOptimization: 1.3,
      // Retaining original fields for compatibility, adjust as needed
      damageBonus: 1.1,
      accuracyBonus: 1.4,
      kiEfficiency: 1.3,
      staminaEfficiency: 1.0,
    },
    preferredTechniques: ["pressure_point", "nerve_strike"], // Kept for potential compatibility
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
    },
    bonuses: {
      psychologicalWarfare: 1.5,
      strategicAnalysis: 1.4,
      painCompliance: 1.7,
      // Retaining original fields for compatibility, adjust as needed
      damageBonus: 1.1,
      accuracyBonus: 1.2,
      kiEfficiency: 1.1,
      staminaEfficiency: 1.2,
    },
    preferredTechniques: ["grapple", "pressure_point"], // Kept for potential compatibility
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
    },
    bonuses: {
      dirtyFighting: 1.8,
      survivalInstinct: 1.6,
      streetSmart: 1.5,
      // Retaining original fields for compatibility, adjust as needed
      damageBonus: 1.3,
      accuracyBonus: 0.9,
      kiEfficiency: 0.9,
      staminaEfficiency: 1.3,
    },
    preferredTechniques: ["strike", "throw", "grapple"], // Kept for potential compatibility
  },
} as const;
