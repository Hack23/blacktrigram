/**
 * Player archetype constants for Korean martial arts
 */

import { PlayerArchetype, TrigramStance } from "../enums";
import type { PlayerArchetypeData } from "../anatomy";
import { KOREAN_COLORS } from "./colors";

// Player archetype data
export const PLAYER_ARCHETYPES_DATA: Record<
  PlayerArchetype,
  PlayerArchetypeData
> = {
  [PlayerArchetype.MUSA]: {
    id: "musa",
    name: { korean: "무사", english: "Warrior" },
    description: {
      korean: "전통 무사의 길",
      english: "Path of the traditional warrior",
    },
    baseHealth: 120,
    baseKi: 100,
    baseStamina: 110,
    coreStance: TrigramStance.GEON,
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
      secondary: KOREAN_COLORS.KOREAN_RED,
    },
    colors: {
      primary: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
      secondary: KOREAN_COLORS.KOREAN_RED,
    },
    stats: {
      attackPower: 85,
      defense: 90,
      speed: 70,
      technique: 80,
    },
    favoredStances: [TrigramStance.GEON, TrigramStance.GAN],
    specialAbilities: ["Honor Strike", "Defensive Mastery"],
    philosophy: {
      korean: "명예와 정의의 길",
      english: "The way of honor and justice",
    },
  },

  [PlayerArchetype.AMSALJA]: {
    id: "amsalja",
    name: { korean: "암살자", english: "Assassin" },
    description: {
      korean: "그림자 속의 효율성",
      english: "Efficiency from the shadows",
    },
    baseHealth: 80,
    baseKi: 120,
    baseStamina: 100,
    coreStance: TrigramStance.SON,
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
      secondary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    },
    colors: {
      primary: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
      secondary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    },
    stats: {
      attackPower: 95,
      defense: 60,
      speed: 95,
      technique: 90,
    },
    favoredStances: [TrigramStance.SON, TrigramStance.GAM],
    specialAbilities: ["Shadow Strike", "Vital Point Mastery"],
    philosophy: {
      korean: "침묵과 정확성의 도",
      english: "The way of silence and precision",
    },
  },

  [PlayerArchetype.HACKER]: {
    id: "hacker",
    name: { korean: "해커", english: "Hacker" },
    description: {
      korean: "정보를 통한 힘",
      english: "Power through information",
    },
    baseHealth: 90,
    baseKi: 130,
    baseStamina: 80,
    coreStance: TrigramStance.LI,
    theme: {
      primary: KOREAN_COLORS.PRIMARY_CYAN,
      secondary: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    },
    colors: {
      primary: KOREAN_COLORS.PRIMARY_CYAN,
      secondary: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    },
    stats: {
      attackPower: 75,
      defense: 70,
      speed: 85,
      technique: 95,
    },
    favoredStances: [TrigramStance.LI, TrigramStance.JIN],
    specialAbilities: ["System Override", "Digital Precision"],
    philosophy: {
      korean: "지식과 기술의 융합",
      english: "The fusion of knowledge and technology",
    },
  },

  [PlayerArchetype.JEONGBO_YOWON]: {
    id: "jeongbo_yowon",
    name: { korean: "정보요원", english: "Agent" },
    description: {
      korean: "관찰을 통한 지식",
      english: "Knowledge through observation",
    },
    baseHealth: 100,
    baseKi: 110,
    baseStamina: 100,
    coreStance: TrigramStance.TAE,
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
      secondary: KOREAN_COLORS.UI_STEEL_GRAY,
    },
    colors: {
      primary: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
      secondary: KOREAN_COLORS.UI_STEEL_GRAY,
    },
    stats: {
      attackPower: 80,
      defense: 85,
      speed: 80,
      technique: 85,
    },
    favoredStances: [TrigramStance.TAE, TrigramStance.GAN],
    specialAbilities: ["Intel Gathering", "Adaptive Combat"],
    philosophy: {
      korean: "적응과 전략의 예술",
      english: "The art of adaptation and strategy",
    },
  },

  [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
    id: "jojik_pokryeokbae",
    name: { korean: "조직폭력배", english: "Gangster" },
    description: {
      korean: "무자비함을 통한 생존",
      english: "Survival through ruthlessness",
    },
    baseHealth: 110,
    baseKi: 90,
    baseStamina: 120,
    coreStance: TrigramStance.JIN,
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
      secondary: KOREAN_COLORS.NEGATIVE_RED,
    },
    colors: {
      primary: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
      secondary: KOREAN_COLORS.NEGATIVE_RED,
    },
    stats: {
      attackPower: 90,
      defense: 75,
      speed: 75,
      technique: 70,
    },
    favoredStances: [TrigramStance.JIN, TrigramStance.GON],
    specialAbilities: ["Brutal Force", "Street Fighting"],
    philosophy: {
      korean: "강함과 의지의 길",
      english: "The way of strength and will",
    },
  },
} as const;

// Base player stats
export const BASE_PLAYER_STATS = {
  HEALTH: 100,
  KI: 100,
  STAMINA: 100,
  ATTACK_POWER: 75,
  DEFENSE: 75,
  SPEED: 75,
  TECHNIQUE: 75,
} as const;
