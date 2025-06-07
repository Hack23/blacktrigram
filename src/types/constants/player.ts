// Player archetype constants for Korean martial arts game

import type {
  PlayerArchetype,
  PlayerArchetypeData,
  TrigramStance,
  KoreanText,
} from "../../types"; // Ensure PlayerArchetypeData is imported correctly

// Define PLAYER_ARCHETYPES_DATA with explicit Record type
export const PLAYER_ARCHETYPES_DATA: Record<
  PlayerArchetype,
  PlayerArchetypeData
> = {
  musa: {
    // id: "musa", // Removed: Key is the ID
    name: { korean: "무사", english: "Musa (Warrior)" },
    description: {
      korean:
        "균형 잡힌 능력치를 가진 다재다능한 전사입니다. 검술과 다양한 무술에 능숙합니다.",
      english:
        "A versatile warrior with balanced stats, skilled in swordsmanship and various martial arts.",
    },
    philosophy: {
      korean: "명예롭고 정직한 전투를 통한 자기 수양",
      english: "Self-cultivation through honorable and honest combat",
    },
    preferredTrigrams: ["geon", "jin", "gan"] as readonly TrigramStance[],
    specialization: "검술 (Geomsul - Swordsmanship)",
    bonuses: {
      damageBonus: 1.1,
      accuracyBonus: 1.05,
      speedBonus: 1.0,
      defenseBonus: 1.05,
      damageResistance: 0.05,
      precisionBonus: 0.1,
      kiEfficiency: 1.0,
      staminaEfficiency: 1.0,
    },
  },
  amsalja: {
    // id: "amsalja", // Removed: Key is the ID
    name: { korean: "암살자", english: "Amsalja (Assassin)" },
    description: {
      korean:
        "빠르고 치명적인 암살자입니다. 은신과 급소 공격에 특화되어 있습니다.",
      english:
        "A swift and deadly assassin, specializing in stealth and critical strikes.",
    },
    philosophy: {
      korean: "최소한의 노력으로 최대한의 효과를 달성",
      english: "Maximum effect with minimum effort",
    },
    preferredTrigrams: ["tae", "li", "son"] as readonly TrigramStance[],
    specialization: "은신술 (Eunsinnsul - Stealth Techniques)",
    bonuses: {
      damageBonus: 1.2, // Higher base damage for surprise/criticals
      accuracyBonus: 1.15, // Higher accuracy for vital points
      speedBonus: 1.2,
      defenseBonus: 0.85, // Lower defense, relies on evasion
      damageResistance: 0.0,
      precisionBonus: 0.25, // High precision for vital points
      kiEfficiency: 1.1,
      staminaEfficiency: 1.05,
    },
  },
  hacker: {
    // id: "hacker", // Removed: Key is the ID
    name: { korean: "해커", english: "Hacker (Technomancer)" },
    description: {
      korean: "기술을 활용하여 전투 시스템을 교란하고 약화시키는 전략가입니다.",
      english:
        "A strategist who uses technology to disrupt and weaken combat systems.",
    },
    philosophy: {
      korean: "지식과 기술을 통한 세상의 이해와 조작",
      english:
        "Understanding and manipulating the world through knowledge and technology",
    },
    preferredTrigrams: ["gam", "gon", "li"] as readonly TrigramStance[],
    specialization: "전자기 교란 (Jeonjagi Gyoran - EMP & System Hacking)",
    bonuses: {
      damageBonus: 0.9, // Less direct damage
      accuracyBonus: 1.0,
      speedBonus: 0.95,
      defenseBonus: 1.0,
      // Special bonuses related to debuffs or system effects rather than direct combat stats
      debuffEffectiveness: 1.25, // Example custom bonus
      techResistance: 0.2, // Resistance to other tech attacks
      damageResistance: 0.05,
      precisionBonus: 0.05,
      kiEfficiency: 1.2, // Represents energy management for tech
      staminaEfficiency: 0.95,
    },
  },
  jeongbo_yowon: {
    // id: "jeongbo_yowon", // Removed: Key is the ID
    name: { korean: "정보 요원", english: "Jeongbo Yowon (Intel Agent)" },
    description: {
      korean:
        "정보 수집과 분석에 능하며, 상대의 약점을 파악하여 전투를 유리하게 이끌어갑니다.",
      english:
        "Excels at information gathering and analysis, turning battles by exploiting enemy weaknesses.",
    },
    philosophy: {
      korean: "정보가 가장 강력한 무기라는 신념",
      english: "Belief that information is the most powerful weapon",
    },
    preferredTrigrams: ["son", "gam", "gan"] as readonly TrigramStance[],
    specialization: "심리전 (Simnijeon - Psychological Warfare)",
    bonuses: {
      damageBonus: 1.0,
      accuracyBonus: 1.1,
      speedBonus: 1.05,
      defenseBonus: 0.95,
      // Bonuses related to exploiting weaknesses or predicting moves
      weaknessExploitDamage: 1.3, // Example custom bonus
      counterAttackChance: 0.15,
      damageResistance: 0.0,
      precisionBonus: 0.15,
      kiEfficiency: 1.05,
      staminaEfficiency: 1.1,
    },
  },
  jojik_pokryeokbae: {
    // id: "jojik_pokryeokbae", // Removed: Key is the ID
    name: {
      korean: "조직 폭력배",
      english: "Jojik Pokryeokbae (Syndicate Enforcer)",
    },
    description: {
      korean:
        "강인한 육체와 다양한 불법 무기를 사용하는 위협적인 집행자입니다.",
      english:
        "A formidable enforcer using brute strength and various illicit weaponry.",
    },
    philosophy: {
      korean: "승리가 모든 것을 정당화한다는 현실주의",
      english: "Realism that victory justifies everything",
    },
    preferredTrigrams: ["jin", "gan", "geon"] as readonly TrigramStance[],
    specialization: "불법 무기 사용 (Bulbeop Mugi Sayong - Illicit Weaponry)",
    bonuses: {
      damageBonus: 1.25, // High damage with weapons
      accuracyBonus: 0.9, // Less precise, more brute force
      speedBonus: 0.9,
      defenseBonus: 1.15, // Tougher
      damageResistance: 0.15,
      intimidationFactor: 0.2, // Example custom bonus
      precisionBonus: 0.0,
      kiEfficiency: 0.9,
      staminaEfficiency: 1.2, // High stamina for prolonged fights
    },
  },
};

export const DEFAULT_PLAYER_NAME: KoreanText = {
  korean: "무명",
  english: "Nameless",
  romanized: "Mumyeong",
};

// Add missing PLAYER_ARCHETYPES export
export const PLAYER_ARCHETYPES = Object.keys(
  PLAYER_ARCHETYPES_DATA
) as PlayerArchetype[];
