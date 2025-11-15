/**
 * AI Personality System for Korean Martial Arts Combat
 * Defines behavioral archetypes that guide AI decision-making
 */

import { PlayerArchetype, TrigramStance } from "@/types";

/**
 * AI personality profile defining combat behavior
 */
export interface AIPersonality {
  readonly name: string;
  readonly koreanName: string;
  readonly archetype: PlayerArchetype;
  readonly aggressionLevel: number; // 0.0-1.0: How often AI attacks
  readonly defensePreference: number; // 0.0-1.0: Tendency to block/counter
  readonly comboTendency: number; // 0.0-1.0: Likelihood to continue combos
  readonly stanceSwitchFrequency: number; // 0.0-1.0: How often changes stance
  readonly feintChance: number; // 0.0-1.0: Probability of fake attacks
  readonly tacticalRetreatThreshold: number; // Health % to retreat
  readonly favoredStances: readonly TrigramStance[];
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * Five AI personality archetypes inspired by Korean martial arts philosophy
 */
export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  /**
   * 맹공자 (Maenggongja) - Fierce Attacker
   * Aggressive pressure fighter using Musa archetype
   */
  AGGRESSIVE_STRIKER: {
    name: "Aggressive Striker",
    koreanName: "맹공자",
    archetype: PlayerArchetype.MUSA,
    aggressionLevel: 0.85,
    defensePreference: 0.2,
    comboTendency: 0.7,
    stanceSwitchFrequency: 0.3,
    feintChance: 0.15,
    tacticalRetreatThreshold: 0.15,
    favoredStances: [
      TrigramStance.GEON, // Heaven - Direct force
      TrigramStance.JIN, // Thunder - Explosive power
      TrigramStance.LI, // Fire - Precision strikes
    ],
    description: {
      korean: "정면 돌파를 선호하는 공격적인 전사",
      english: "Aggressive warrior who prefers frontal assault",
    },
  },

  /**
   * 기술가 (Gisulga) - Technical Master
   * Precision fighter using Amsalja archetype
   */
  TECHNICAL_MASTER: {
    name: "Technical Master",
    koreanName: "기술가",
    archetype: PlayerArchetype.AMSALJA,
    aggressionLevel: 0.5,
    defensePreference: 0.6,
    comboTendency: 0.4,
    stanceSwitchFrequency: 0.7,
    feintChance: 0.35,
    tacticalRetreatThreshold: 0.35,
    favoredStances: [
      TrigramStance.SON, // Wind - Continuous pressure
      TrigramStance.GAM, // Water - Flow and adaptation
      TrigramStance.TAE, // Lake - Fluid manipulation
    ],
    description: {
      korean: "정밀한 기술로 약점을 노리는 달인",
      english: "Master who targets weaknesses with precise techniques",
    },
  },

  /**
   * 균형잡힌자 (Gyunhyeongjabin-ja) - Balanced Fighter
   * All-around fighter using Jeongbo Yowon archetype
   */
  BALANCED_FIGHTER: {
    name: "Balanced Fighter",
    koreanName: "균형잡힌자",
    archetype: PlayerArchetype.JEONGBO_YOWON,
    aggressionLevel: 0.6,
    defensePreference: 0.5,
    comboTendency: 0.5,
    stanceSwitchFrequency: 0.5,
    feintChance: 0.25,
    tacticalRetreatThreshold: 0.25,
    favoredStances: [
      TrigramStance.GEON, // Heaven
      TrigramStance.GAM, // Water
      TrigramStance.GAN, // Mountain
      TrigramStance.GON, // Earth
    ],
    description: {
      korean: "공격과 방어의 조화를 추구하는 전략가",
      english: "Strategist seeking harmony between offense and defense",
    },
  },

  /**
   * 방어의달인 (Bangeo-ui Darin) - Defensive Specialist
   * Counter-attack focused using Hacker archetype
   */
  DEFENSIVE_SPECIALIST: {
    name: "Defensive Specialist",
    koreanName: "방어의달인",
    archetype: PlayerArchetype.HACKER,
    aggressionLevel: 0.35,
    defensePreference: 0.8,
    comboTendency: 0.3,
    stanceSwitchFrequency: 0.4,
    feintChance: 0.4,
    tacticalRetreatThreshold: 0.4,
    favoredStances: [
      TrigramStance.GAN, // Mountain - Defensive mastery
      TrigramStance.GON, // Earth - Grounding
      TrigramStance.GAM, // Water - Adaptation
    ],
    description: {
      korean: "방어에서 반격의 기회를 찾는 전문가",
      english: "Expert who finds counter-attack opportunities through defense",
    },
  },

  /**
   * 혼돈의전사 (Hondon-ui Jeonsa) - Chaos Warrior
   * Unpredictable fighter using Jojik Pokryeokbae archetype
   */
  CHAOS_WARRIOR: {
    name: "Chaos Warrior",
    koreanName: "혼돈의전사",
    archetype: PlayerArchetype.JOJIK_POKRYEOKBAE,
    aggressionLevel: 0.75,
    defensePreference: 0.3,
    comboTendency: 0.6,
    stanceSwitchFrequency: 0.8,
    feintChance: 0.5,
    tacticalRetreatThreshold: 0.1,
    favoredStances: [
      TrigramStance.LI, // Fire - Unpredictable
      TrigramStance.SON, // Wind - Constant motion
      TrigramStance.JIN, // Thunder - Explosive
      TrigramStance.TAE, // Lake - Fluid
    ],
    description: {
      korean: "예측 불가능한 패턴으로 상대를 혼란시키는 전사",
      english: "Warrior who confuses opponents with unpredictable patterns",
    },
  },
};

/**
 * Get a random AI personality
 */
export function getRandomPersonality(): AIPersonality {
  const personalities = Object.values(AI_PERSONALITIES);
  return personalities[Math.floor(Math.random() * personalities.length)];
}

/**
 * Get personality by archetype
 */
export function getPersonalityByArchetype(
  archetype: PlayerArchetype
): AIPersonality {
  const personality = Object.values(AI_PERSONALITIES).find(
    (p) => p.archetype === archetype
  );
  return personality ?? AI_PERSONALITIES.BALANCED_FIGHTER;
}

/**
 * Get personality by name key
 */
export function getPersonalityByName(name: string): AIPersonality {
  return AI_PERSONALITIES[name] ?? AI_PERSONALITIES.BALANCED_FIGHTER;
}

/**
 * List all available personalities
 */
export function getAllPersonalities(): readonly AIPersonality[] {
  return Object.values(AI_PERSONALITIES);
}
