/**
 * Technique definitions for all player archetypes.
 * 
 * **Korean**: 기술 정의 (Technique Definitions)
 * 
 * Each archetype has 3-5 unique techniques that reflect their combat philosophy
 * and specialization. Techniques are mapped to keyboard shortcuts Q, W, E, R.
 * 
 * @module data/techniques
 * @category Combat System
 * @korean 기술데이터
 */

import { PlayerArchetype, TrigramStance, DamageType, Technique, TechniqueKey } from "../types";
import { KoreanTechniquesSystem } from "../systems/trigram/KoreanTechniques";
import { KoreanTechnique } from "../systems/vitalpoint/types";

/**
 * Technique definitions for 무사 (Musa) - Traditional Warrior.
 * 
 * Philosophy: Honor through disciplined strength and overwhelming force.
 * Favored Stance: ☰ 건 (Geon) - Heaven
 */
export const MUSA_TECHNIQUES: readonly Technique[] = [
  {
    id: "musa_thunder_strike",
    name: {
      korean: "천둥벽력",
      english: "Thunder Strike",
    },
    description: {
      korean: "강력한 하늘의 힘으로 적을 강타합니다",
      english: "Strike with the power of heaven",
    },
    staminaCost: 30,
    kiCost: 20,
    damage: { min: 25, max: 35 },
    damageType: DamageType.BLUNT,
    cooldown: 5000,
    requiredStance: TrigramStance.GEON,
    keyboardShortcut: "Q",
    criticalChance: 0.25,
    animationDuration: 800,
  },
  {
    id: "musa_iron_defense",
    name: {
      korean: "철벽방어",
      english: "Iron Defense",
    },
    description: {
      korean: "산처럼 굳건한 방어 자세를 취합니다",
      english: "Adopt an immovable defensive stance",
    },
    staminaCost: 20,
    kiCost: 15,
    damage: { min: 0, max: 5 },
    damageType: DamageType.IMPACT,
    cooldown: 8000,
    requiredStance: TrigramStance.GAN,
    keyboardShortcut: "W",
    specialEffect: "defense_boost",
    animationDuration: 600,
  },
  {
    id: "musa_dragon_fist",
    name: {
      korean: "용권",
      english: "Dragon Fist",
    },
    description: {
      korean: "용의 기세로 적을 관통합니다",
      english: "Pierce through with dragon's might",
    },
    staminaCost: 35,
    kiCost: 25,
    damage: { min: 30, max: 40 },
    damageType: DamageType.PIERCING,
    cooldown: 7000,
    keyboardShortcut: "E",
    targetsVitalPoint: true,
    criticalChance: 0.3,
    animationDuration: 1000,
  },
  {
    id: "musa_mountain_breaker",
    name: {
      korean: "파산격",
      english: "Mountain Breaker",
    },
    description: {
      korean: "산을 깨뜨리는 강력한 일격",
      english: "A devastating blow that shatters mountains",
    },
    staminaCost: 40,
    kiCost: 30,
    damage: { min: 35, max: 50 },
    damageType: DamageType.CRUSHING,
    cooldown: 10000,
    requiredStance: TrigramStance.GEON,
    keyboardShortcut: "R",
    criticalChance: 0.2,
    specialEffect: "armor_break",
    animationDuration: 1200,
  },
];

/**
 * Technique definitions for 암살자 (Amsalja) - Shadow Assassin.
 * 
 * Philosophy: Precision through stealth and vital point mastery.
 * Favored Stance: ☲ 리 (Li) - Fire
 */
export const AMSALJA_TECHNIQUES: readonly Technique[] = [
  {
    id: "amsalja_shadow_strike",
    name: {
      korean: "암영격",
      english: "Shadow Strike",
    },
    description: {
      korean: "그림자처럼 빠르게 급소를 노립니다",
      english: "Strike vital points with shadow speed",
    },
    staminaCost: 25,
    kiCost: 20,
    damage: { min: 20, max: 35 },
    damageType: DamageType.NERVE,
    cooldown: 4000,
    requiredStance: TrigramStance.LI,
    keyboardShortcut: "Q",
    targetsVitalPoint: true,
    criticalChance: 0.4,
    animationDuration: 600,
  },
  {
    id: "amsalja_nerve_strike",
    name: {
      korean: "신경타",
      english: "Nerve Strike",
    },
    description: {
      korean: "정확한 신경 타격으로 적을 마비시킵니다",
      english: "Paralyze the enemy with precise nerve strikes",
    },
    staminaCost: 30,
    kiCost: 25,
    damage: { min: 15, max: 25 },
    damageType: DamageType.NERVE,
    cooldown: 6000,
    keyboardShortcut: "W",
    targetsVitalPoint: true,
    specialEffect: "paralysis",
    animationDuration: 700,
  },
  {
    id: "amsalja_deadly_precision",
    name: {
      korean: "치명정밀",
      english: "Deadly Precision",
    },
    description: {
      korean: "완벽한 정밀도로 치명적인 급소를 공격합니다",
      english: "Attack critical vital points with perfect accuracy",
    },
    staminaCost: 35,
    kiCost: 30,
    damage: { min: 25, max: 45 },
    damageType: DamageType.PRESSURE,
    cooldown: 8000,
    requiredStance: TrigramStance.LI,
    keyboardShortcut: "E",
    targetsVitalPoint: true,
    criticalChance: 0.5,
    animationDuration: 900,
  },
  {
    id: "amsalja_silent_death",
    name: {
      korean: "무음살",
      english: "Silent Death",
    },
    description: {
      korean: "소리 없이 치명적인 일격을 가합니다",
      english: "Deliver a silent, lethal strike",
    },
    staminaCost: 45,
    kiCost: 35,
    damage: { min: 40, max: 60 },
    damageType: DamageType.NERVE,
    cooldown: 12000,
    keyboardShortcut: "R",
    targetsVitalPoint: true,
    criticalChance: 0.6,
    specialEffect: "instant_kill_chance",
    animationDuration: 1000,
  },
];

/**
 * Technique definitions for 해커 (Hacker) - Cyber Warrior.
 * 
 * Philosophy: Technology-enhanced combat with data-driven precision.
 * Favored Stance: ☳ 진 (Jin) - Thunder
 */
export const HACKER_TECHNIQUES: readonly Technique[] = [
  {
    id: "hacker_electric_shock",
    name: {
      korean: "전격",
      english: "Electric Shock",
    },
    description: {
      korean: "사이버 임플란트로 전기 충격을 가합니다",
      english: "Deliver electric shock via cyber implants",
    },
    staminaCost: 20,
    kiCost: 25,
    damage: { min: 18, max: 28 },
    damageType: DamageType.ELECTRIC,
    cooldown: 4500,
    requiredStance: TrigramStance.JIN,
    keyboardShortcut: "Q",
    specialEffect: "stun",
    animationDuration: 500,
  },
  {
    id: "hacker_data_strike",
    name: {
      korean: "데이터 타격",
      english: "Data Strike",
    },
    description: {
      korean: "전투 데이터를 분석하여 최적의 공격을 수행합니다",
      english: "Analyze combat data for optimal attack",
    },
    staminaCost: 25,
    kiCost: 20,
    damage: { min: 22, max: 32 },
    damageType: DamageType.PIERCING,
    cooldown: 5000,
    keyboardShortcut: "W",
    targetsVitalPoint: true,
    criticalChance: 0.35,
    animationDuration: 700,
  },
  {
    id: "hacker_cyber_overdrive",
    name: {
      korean: "사이버 가속",
      english: "Cyber Overdrive",
    },
    description: {
      korean: "임플란트를 과부하시켜 초고속 공격을 수행합니다",
      english: "Overload implants for lightning-fast attacks",
    },
    staminaCost: 35,
    kiCost: 30,
    damage: { min: 15, max: 25 },
    damageType: DamageType.ELECTRIC,
    cooldown: 7000,
    requiredStance: TrigramStance.JIN,
    keyboardShortcut: "E",
    specialEffect: "multi_hit",
    animationDuration: 1200,
  },
  {
    id: "hacker_system_crash",
    name: {
      korean: "시스템 크래시",
      english: "System Crash",
    },
    description: {
      korean: "적의 신경 시스템을 해킹하여 무력화합니다",
      english: "Hack the enemy's nervous system",
    },
    staminaCost: 40,
    kiCost: 35,
    damage: { min: 30, max: 45 },
    damageType: DamageType.PSYCHIC,
    cooldown: 10000,
    keyboardShortcut: "R",
    targetsVitalPoint: true,
    specialEffect: "system_shutdown",
    animationDuration: 1100,
  },
];

/**
 * Technique definitions for 정보요원 (Jeongbo Yowon) - Intelligence Operative.
 * 
 * Philosophy: Strategic analysis and exploiting weaknesses.
 * Favored Stance: ☵ 감 (Gam) - Water
 */
export const JEONGBO_YOWON_TECHNIQUES: readonly Technique[] = [
  {
    id: "jeongbo_tactical_strike",
    name: {
      korean: "전술타격",
      english: "Tactical Strike",
    },
    description: {
      korean: "적의 약점을 분석하여 전술적으로 공격합니다",
      english: "Analyze and strike enemy weaknesses tactically",
    },
    staminaCost: 25,
    kiCost: 20,
    damage: { min: 20, max: 30 },
    damageType: DamageType.PIERCING,
    cooldown: 4000,
    requiredStance: TrigramStance.GAM,
    keyboardShortcut: "Q",
    targetsVitalPoint: true,
    criticalChance: 0.3,
    animationDuration: 650,
  },
  {
    id: "jeongbo_counter_intelligence",
    name: {
      korean: "역정보공작",
      english: "Counter Intelligence",
    },
    description: {
      korean: "적의 움직임을 읽고 반격합니다",
      english: "Read and counter enemy movements",
    },
    staminaCost: 20,
    kiCost: 25,
    damage: { min: 15, max: 30 },
    damageType: DamageType.IMPACT,
    cooldown: 5000,
    keyboardShortcut: "W",
    specialEffect: "counter_stance",
    animationDuration: 600,
  },
  {
    id: "jeongbo_psychological_warfare",
    name: {
      korean: "심리전",
      english: "Psychological Warfare",
    },
    description: {
      korean: "적의 정신을 교란하여 약화시킵니다",
      english: "Disrupt enemy's mental state",
    },
    staminaCost: 30,
    kiCost: 30,
    damage: { min: 10, max: 20 },
    damageType: DamageType.PSYCHIC,
    cooldown: 8000,
    keyboardShortcut: "E",
    specialEffect: "confusion",
    animationDuration: 800,
  },
  {
    id: "jeongbo_intelligence_strike",
    name: {
      korean: "정보타격",
      english: "Intelligence Strike",
    },
    description: {
      korean: "수집한 정보를 바탕으로 완벽한 공격을 수행합니다",
      english: "Execute perfect attack based on gathered intelligence",
    },
    staminaCost: 40,
    kiCost: 35,
    damage: { min: 35, max: 50 },
    damageType: DamageType.PIERCING,
    cooldown: 10000,
    requiredStance: TrigramStance.GAM,
    keyboardShortcut: "R",
    targetsVitalPoint: true,
    criticalChance: 0.45,
    animationDuration: 1000,
  },
];

/**
 * Technique definitions for 조직폭력배 (Jojik Pokryeokbae) - Organized Crime.
 * 
 * Philosophy: Ruthless pragmatism and brutal efficiency.
 * Favored Stance: ☷ 곤 (Gon) - Earth
 */
export const JOJIK_POKRYEOKBAE_TECHNIQUES: readonly Technique[] = [
  {
    id: "jojik_street_brawl",
    name: {
      korean: "거리싸움",
      english: "Street Brawl",
    },
    description: {
      korean: "더러운 싸움으로 적을 제압합니다",
      english: "Overwhelm with dirty fighting",
    },
    staminaCost: 20,
    kiCost: 15,
    damage: { min: 18, max: 28 },
    damageType: DamageType.BLUNT,
    cooldown: 3500,
    requiredStance: TrigramStance.GON,
    keyboardShortcut: "Q",
    criticalChance: 0.25,
    animationDuration: 600,
  },
  {
    id: "jojik_brutal_takedown",
    name: {
      korean: "잔혹제압",
      english: "Brutal Takedown",
    },
    description: {
      korean: "무자비하게 적을 쓰러뜨립니다",
      english: "Mercilessly takedown the enemy",
    },
    staminaCost: 30,
    kiCost: 20,
    damage: { min: 25, max: 35 },
    damageType: DamageType.CRUSHING,
    cooldown: 5000,
    keyboardShortcut: "W",
    specialEffect: "knockdown",
    animationDuration: 800,
  },
  {
    id: "jojik_improvised_weapon",
    name: {
      korean: "즉석무기",
      english: "Improvised Weapon",
    },
    description: {
      korean: "주변 물건을 이용하여 공격합니다",
      english: "Attack using improvised objects",
    },
    staminaCost: 25,
    kiCost: 20,
    damage: { min: 22, max: 38 },
    damageType: DamageType.SHARP,
    cooldown: 6000,
    requiredStance: TrigramStance.GON,
    keyboardShortcut: "E",
    criticalChance: 0.3,
    specialEffect: "bleed",
    animationDuration: 700,
  },
  {
    id: "jojik_ruthless_assault",
    name: {
      korean: "무자비공격",
      english: "Ruthless Assault",
    },
    description: {
      korean: "자비 없이 적을 집중 공격합니다",
      english: "Relentlessly assault without mercy",
    },
    staminaCost: 45,
    kiCost: 25,
    damage: { min: 30, max: 55 },
    damageType: DamageType.CRUSHING,
    cooldown: 9000,
    keyboardShortcut: "R",
    criticalChance: 0.35,
    specialEffect: "rage",
    animationDuration: 1300,
  },
];

/**
 * Get techniques for a specific player archetype.
 * 
 * @param archetype - Player archetype
 * @returns Array of techniques for the archetype
 * 
 * @public
 */
export function getTechniquesForArchetype(
  archetype: PlayerArchetype
): readonly Technique[] {
  switch (archetype) {
    case PlayerArchetype.MUSA:
      return MUSA_TECHNIQUES;
    case PlayerArchetype.AMSALJA:
      return AMSALJA_TECHNIQUES;
    case PlayerArchetype.HACKER:
      return HACKER_TECHNIQUES;
    case PlayerArchetype.JEONGBO_YOWON:
      return JEONGBO_YOWON_TECHNIQUES;
    case PlayerArchetype.JOJIK_POKRYEOKBAE:
      return JOJIK_POKRYEOKBAE_TECHNIQUES;
    default:
      // Exhaustive check: if a new archetype is added, TypeScript will error here
      const _exhaustiveCheck: never = archetype;
      throw new Error(`Unknown archetype: ${_exhaustiveCheck}`);
  }
}

/**
 * Convert KoreanTechnique to Technique format for UI compatibility
 */
function convertKoreanToTechnique(koreanTech: KoreanTechnique): Technique {
  // Convert string damageType to DamageType enum
  const getDamageType = (type: string): DamageType => {
    // Map common string values to DamageType enum
    const typeMap: Record<string, DamageType> = {
      'blunt': DamageType.BLUNT,
      'physical': DamageType.BLUNT,
      'piercing': DamageType.PIERCING,
      'slashing': DamageType.SLASHING,
      'crushing': DamageType.CRUSHING,
      'impact': DamageType.IMPACT,
      'joint': DamageType.JOINT,
      'electric': DamageType.ELECTRIC,
      'psychic': DamageType.PSYCHIC,
    };
    return typeMap[type.toLowerCase()] || DamageType.BLUNT;
  };

  return {
    id: koreanTech.id,
    name: {
      korean: koreanTech.koreanName || koreanTech.name.korean,
      english: koreanTech.englishName || koreanTech.name.english,
      romanized: koreanTech.romanized || koreanTech.name.romanized,
    },
    description: koreanTech.description,
    staminaCost: koreanTech.staminaCost,
    kiCost: koreanTech.kiCost,
    damage: {
      min: Math.floor(koreanTech.damage * 0.8),
      max: Math.ceil(koreanTech.damage * 1.2),
    },
    damageType: getDamageType(koreanTech.damageType),
    cooldown: koreanTech.recoveryTime + koreanTech.executionTime,
    requiredStance: koreanTech.stance,
    keyboardShortcut: "Q", // Placeholder; immediately overridden by getTechniquesForStanceAndArchetype()
    criticalChance: koreanTech.critChance,
    animationDuration: koreanTech.executionTime,
  };
}

/**
 * Get techniques for a player based on their current stance and archetype.
 * Combines trigram stance techniques with archetype-specific bonuses.
 * 
 * @param stance - Current player stance
 * @param archetype - Player archetype
 * @returns Array of available techniques with proper keyboard shortcuts assigned
 * 
 * @public
 */
export function getTechniquesForStanceAndArchetype(
  stance: TrigramStance,
  archetype: PlayerArchetype
): readonly Technique[] {
  // Get stance-based techniques from Korean martial arts system
  const koreanTechniques = KoreanTechniquesSystem.getAllAvailableTechniques(
    stance,
    archetype
  );

  // Convert to Technique format
  const convertedTechniques = koreanTechniques.map(convertKoreanToTechnique);

  // Also include archetype-specific special techniques
  const archetypeTechniques = getTechniquesForArchetype(archetype);
  
  // Filter archetype techniques to only include those matching current stance or no stance requirement
  const filteredArchetypeTechniques = archetypeTechniques.filter(
    (tech) => !tech.requiredStance || tech.requiredStance === stance
  );

  // Combine both sets, prioritizing stance techniques
  const allTechniques = [...convertedTechniques, ...filteredArchetypeTechniques];
  
  // Assign proper keyboard shortcuts (Q, W, E, R) based on position
  // Note: Only first 4 techniques are keyboard-accessible in combat.
  // Additional techniques beyond index 3 will have repeated shortcuts but are
  // displayed in TechniqueBar for information - use Q/W/E/R to execute first 4.
  const keyboardShortcuts = ['Q', 'W', 'E', 'R'] as const;
  return allTechniques.map((tech, index) => ({
    ...tech,
    keyboardShortcut: keyboardShortcuts[index % keyboardShortcuts.length] as TechniqueKey,
  }));
}

/**
 * Get a specific technique by ID.
 * 
 * @param techniqueId - Unique technique identifier
 * @returns Technique if found, undefined otherwise
 * 
 * @public
 */
export function getTechniqueById(techniqueId: string): Technique | undefined {
  const allTechniques = [
    ...MUSA_TECHNIQUES,
    ...AMSALJA_TECHNIQUES,
    ...HACKER_TECHNIQUES,
    ...JEONGBO_YOWON_TECHNIQUES,
    ...JOJIK_POKRYEOKBAE_TECHNIQUES,
  ];
  
  return allTechniques.find((tech) => tech.id === techniqueId);
}

export default {
  getTechniquesForArchetype,
  getTechniquesForStanceAndArchetype,
  getTechniqueById,
};
