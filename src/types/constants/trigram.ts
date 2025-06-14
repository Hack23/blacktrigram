/**
 * Trigram system constants for Black Trigram Korean martial arts
 */

import { KOREAN_COLORS } from "./colors";
import { TrigramStance, TrigramStance as TrigramStanceEnum } from "../enums"; // Assuming enum definition

// Helper function (optional, if you prefer this pattern)
// const createTrigram = (
//   id: TrigramStance,
//   korean: string,
//   english: string,
//   symbol: string,
//   description: string,
//   theme: TrigramTheme,
//   principle: string,
//   qualities: string[],
//   associatedTechniques: string[]
// ): TrigramData => ({
//   id,
//   korean,
//   english,
//   symbol,
//   description,
//   theme,
//   principle,
//   qualities,
//   associatedTechniques,
// });

// Order of Trigrams for UI elements like wheels or selection lists
export const TRIGRAM_STANCES_ORDER: readonly TrigramStance[] = [
  "geon" as TrigramStance,
  "tae" as TrigramStance,
  "li" as TrigramStance,
  "jin" as TrigramStance,
  "son" as TrigramStance,
  "gam" as TrigramStance,
  "gan" as TrigramStance,
  "gon" as TrigramStance,
] as const;

export const TRIGRAM_DATA: Record<TrigramStance, TrigramStanceData> = {
  [TrigramStance.GEON]: {
    name: { korean: "건", english: "Heaven" },
    symbol: "☰",
    element: "metal",
    nature: "yang",
    philosophy: { korean: "하늘", english: "Heaven" },
    combat: { korean: "직접 공격", english: "Direct attack" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
      secondary: KOREAN_COLORS.WHITE_SOLID,
    },
    defensiveBonus: 1.0,
    kiFlowModifier: 1.0,
    techniques: {
      primary: {
        korean: "천둥벽력",
        english: "Thunder Strike",
        damage: 15,
        kiCost: 8,
        staminaCost: 12,
        hitChance: 0.85,
        criticalChance: 0.12,
        description: {
          korean: "하늘의 힘으로 적을 타격한다",
          english: "Strike the enemy with heavenly force",
        },
        targetAreas: ["torso", "head"],
        effects: ["stun"],
      },
    },
  },
  [TrigramStance.TAE]: {
    name: { korean: "태", english: "Lake" },
    symbol: "☱",
    element: "metal",
    nature: "yin",
    philosophy: { korean: "호수", english: "Lake" },
    combat: { korean: "유동적 적응", english: "Fluid adaptation" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
      secondary: KOREAN_COLORS.UI_STEEL_GRAY,
    },
    defensiveBonus: 1.1,
    kiFlowModifier: 1.2,
    techniques: {
      primary: {
        korean: "유수연타",
        english: "Flowing Strikes",
        damage: 10,
        kiCost: 5,
        staminaCost: 8,
        hitChance: 0.9,
        criticalChance: 0.1,
        description: {
          korean: "물의 흐름처럼 연속적인 타격",
          english: "Continuous strikes like flowing water",
        },
        targetAreas: ["torso", "arms"],
        effects: ["knockback"],
      },
    },
  },
  [TrigramStance.LI]: {
    name: { korean: "리", english: "Fire" },
    symbol: "☲",
    element: "metal",
    nature: "yang",
    philosophy: { korean: "불", english: "Fire" },
    combat: { korean: "접근 공격", english: "Close attack" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
      secondary: KOREAN_COLORS.ACCENT_RED,
    },
    defensiveBonus: 0.9,
    kiFlowModifier: 1.1,
    techniques: {
      primary: {
        korean: "화염베기",
        english: "Flame Slash",
        damage: 18,
        kiCost: 9,
        staminaCost: 11,
        hitChance: 0.8,
        criticalChance: 0.15,
        description: {
          korean: "불의 형상을 한 날카로운 베기",
          english: "A sharp slash in the form of fire",
        },
        targetAreas: ["torso", "legs"],
        effects: ["burn"],
      },
    },
  },
  [TrigramStance.JIN]: {
    name: { korean: "진", english: "Thunder" },
    symbol: "☳",
    element: "metal",
    nature: "yang",
    philosophy: { korean: "천둥", english: "Thunder" },
    combat: { korean: "돌진 공격", english: "Charge attack" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
      secondary: KOREAN_COLORS.SECONDARY_YELLOW,
    },
    defensiveBonus: 0.8,
    kiFlowModifier: 1.3,
    techniques: {
      primary: {
        korean: "천둥의 박치기",
        english: "Thunder Clap",
        damage: 20,
        kiCost: 10,
        staminaCost: 15,
        hitChance: 0.82,
        criticalChance: 0.18,
        description: {
          korean: "천둥의 힘으로 적을 가격",
          english: "Strike the enemy with the force of thunder",
        },
        targetAreas: ["head", "torso"],
        effects: ["stun", "knockback"],
      },
    },
  },
  [TrigramStance.SON]: {
    name: { korean: "손", english: "Wind" },
    symbol: "☴",
    element: "metal",
    nature: "yin",
    philosophy: { korean: "바람", english: "Wind" },
    combat: { korean: "회피 공격", english: "Evasive attack" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
      secondary: KOREAN_COLORS.POSITIVE_GREEN_DARK,
    },
    defensiveBonus: 1.2,
    kiFlowModifier: 0.9,
    techniques: {
      primary: {
        korean: "바람베기",
        english: "Wind Cut",
        damage: 12,
        kiCost: 6,
        staminaCost: 10,
        hitChance: 0.88,
        criticalChance: 0.14,
        description: {
          korean: "바람의 힘으로 적을 베어내다",
          english: "Cut through the enemy with the power of wind",
        },
        targetAreas: ["torso", "arms"],
        effects: ["bleed"],
      },
    },
  },
  [TrigramStance.GAM]: {
    name: { korean: "감", english: "Water" },
    symbol: "☵",
    element: "metal",
    nature: "yin",
    philosophy: { korean: "물", english: "Water" },
    combat: { korean: "유동 공격", english: "Flowing attack" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
      secondary: KOREAN_COLORS.PRIMARY_BLUE_DARK,
    },
    defensiveBonus: 1.3,
    kiFlowModifier: 1.1,
    techniques: {
      primary: {
        korean: "수륙재해",
        english: "Water Whip",
        damage: 14,
        kiCost: 7,
        staminaCost: 9,
        hitChance: 0.84,
        criticalChance: 0.13,
        description: {
          korean: "물의 힘으로 적을 휘감아 타격",
          english: "Strike the enemy by wrapping them with the power of water",
        },
        targetAreas: ["torso", "legs"],
        effects: ["drown"],
      },
    },
  },
  [TrigramStance.GAN]: {
    name: { korean: "간", english: "Mountain" },
    symbol: "☶",
    element: "metal",
    nature: "yin",
    philosophy: { korean: "산", english: "Mountain" },
    combat: { korean: "방어 자세", english: "Defensive stance" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
      secondary: KOREAN_COLORS.UI_STEEL_GRAY_DARK,
    },
    defensiveBonus: 1.4,
    kiFlowModifier: 0.8,
    techniques: {
      primary: {
        korean: "산의 수호",
        english: "Mountain Guard",
        damage: 0,
        kiCost: 10,
        staminaCost: 15,
        hitChance: 1.0,
        criticalChance: 0.0,
        description: {
          korean: "산처럼 견고한 방어 자세",
          english: "A defensive stance as solid as a mountain",
        },
        targetAreas: ["torso"],
        effects: ["block"],
      },
    },
  },
  [TrigramStance.GON]: {
    name: { korean: "곤", english: "Earth" },
    symbol: "☷",
    element: "metal",
    nature: "yang",
    philosophy: { korean: "지구", english: "Earth" },
    combat: { korean: "포용 공격", english: "Embracing attack" },
    theme: {
      primary: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
      secondary: KOREAN_COLORS.SECONDARY_BROWN_DARK,
    },
    defensiveBonus: 1.1,
    kiFlowModifier: 1.2,
    techniques: {
      primary: {
        korean: "지구의 방패",
        english: "Earth Shield",
        damage: 0,
        kiCost: 12,
        staminaCost: 16,
        hitChance: 1.0,
        criticalChance: 0.0,
        description: {
          korean: "지구의 힘으로 적의 공격을 막다",
          english: "Block the enemy's attack with the power of earth",
        },
        targetAreas: ["torso"],
        effects: ["block"],
      },
    },
  },
} as const;

export interface TrigramStanceData {
  readonly name: { korean: string; english: string };
  readonly symbol: string;
  readonly element: string;
  readonly nature: "yin" | "yang";
  readonly philosophy: { korean: string; english: string };
  readonly combat: { korean: string; english: string };
  readonly theme: {
    primary: number;
    secondary: number;
  };
  readonly defensiveBonus: number;
  readonly kiFlowModifier: number;
  readonly techniques: {
    primary: {
      korean: string;
      english: string;
      damage: number;
      kiCost: number;
      staminaCost: number;
      hitChance: number;
      criticalChance: number;
      description: { korean: string; english: string };
      targetAreas: string[];
      effects: string[];
    };
  };
}

// Fix stance effectiveness matrix to match test expectations
export const STANCE_EFFECTIVENESS_MATRIX: Record<
  TrigramStance,
  Partial<Record<TrigramStance, number>>
> = {
  [TrigramStanceEnum.GEON]: {
    [TrigramStanceEnum.GON]: 1.2,
    [TrigramStanceEnum.SON]: 0.8,
  },
  [TrigramStanceEnum.TAE]: {
    [TrigramStanceEnum.JIN]: 1.2,
    [TrigramStanceEnum.GAN]: 0.8,
  },
  [TrigramStanceEnum.LI]: {
    [TrigramStanceEnum.GAM]: 0.8, // Fire is weak against Water
    [TrigramStanceEnum.TAE]: 0.8,
  },
  [TrigramStanceEnum.JIN]: {
    [TrigramStanceEnum.SON]: 1.2,
    [TrigramStanceEnum.GEON]: 0.8,
  },
  [TrigramStanceEnum.SON]: {
    [TrigramStanceEnum.GON]: 1.2,
    [TrigramStanceEnum.LI]: 0.8,
  },
  [TrigramStanceEnum.GAM]: {
    [TrigramStanceEnum.LI]: 1.2, // Water is strong against Fire (corrected)
    [TrigramStanceEnum.JIN]: 0.8,
  },
  [TrigramStanceEnum.GAN]: {
    [TrigramStanceEnum.TAE]: 1.2,
    [TrigramStanceEnum.GAM]: 0.8,
  },
  [TrigramStanceEnum.GON]: {
    [TrigramStanceEnum.GEON]: 1.2,
    [TrigramStanceEnum.SON]: 0.8,
    [TrigramStanceEnum.GAM]: 1.2, // Earth absorbs Water (added)
  },
};
