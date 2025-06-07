/**
 * Trigram system constants for Black Trigram Korean martial arts
 */

import type { TrigramStance, PlayerArchetype } from "../enums";
import type { TrigramData, TrigramEffectivenessMatrix } from "../trigram";
import type { KoreanTechnique } from "../combat";
import type { CYBERPUNK_PALETTE } from "./colors";

// Trigram stances in traditional order
export const TRIGRAM_STANCES_ORDER: readonly TrigramStance[] = [
  "geon",
  "tae",
  "li",
  "jin",
  "son",
  "gam",
  "gan",
  "gon",
] as const;

// Base techniques for each trigram stance
const createTrigram = (
  id: TrigramStance,
  koreanName: string,
  englishName: string,
  symbol: string,
  element: { korean: string; english: string },
  philosophy: { korean: string; english: string },
  combatRole: { korean: string; english: string },
  techniqueKorean: string,
  techniqueEnglish: string
): TrigramData => ({
  id,
  name: { korean: koreanName, english: englishName },
  symbol,
  element,
  philosophy,
  combatRole,
  technique: {
    id: `${id}_technique`,
    name: techniqueKorean,
    koreanName: techniqueKorean,
    englishName: techniqueEnglish,
    romanized: techniqueEnglish.toLowerCase().replace(/\s+/g, "_"),
    description: {
      korean: `${koreanName} 자세의 기본 기술`,
      english: `Basic technique of ${englishName} stance`,
    },
    stance: id,
    type: "strike",
    damage: 25,
    kiCost: 10,
    staminaCost: 15,
    accuracy: 0.75,
    effects: [],
  } as KoreanTechnique,
  strengths: ["balanced"],
  weaknesses: ["none"],
  offensiveBonus: 1.0,
  defensiveBonus: 1.0,
  kiFlowModifier: 1.0,
  staminaModifier: 1.0,
  // Add theme property for visual styling
  theme: {
    primary: 0x00ffff,
    secondary: 0xffffff,
    active: 0x40ffff,
    hover: 0x80ffff,
    glow: 0x00ffff,
  },
});

// Trigram data definitions
export const TRIGRAM_DATA: Record<TrigramStance, TrigramData> = {
  geon: createTrigram(
    "geon",
    "건",
    "Heaven",
    "☰",
    { korean: "천", english: "Sky" },
    {
      korean: "창조와 힘의 원리",
      english: "Principle of creation and strength",
    },
    { korean: "직접 공격", english: "Direct assault" },
    "천둥벽력",
    "Thunder Strike"
  ),
  tae: createTrigram(
    "tae",
    "태",
    "Lake",
    "☱",
    { korean: "택", english: "Marsh" },
    { korean: "기쁨과 유연함", english: "Joy and flexibility" },
    { korean: "유동적 공격", english: "Fluid attacks" },
    "유수연타",
    "Flowing Strikes"
  ),
  li: createTrigram(
    "li",
    "리",
    "Fire",
    "☲",
    { korean: "화", english: "Flame" },
    { korean: "밝음과 지혜", english: "Brightness and wisdom" },
    { korean: "정밀 공격", english: "Precision strikes" },
    "화염지창",
    "Flame Spear"
  ),
  jin: createTrigram(
    "jin",
    "진",
    "Thunder",
    "☳",
    { korean: "뇌", english: "Lightning" },
    { korean: "움직임과 각성", english: "Movement and awakening" },
    { korean: "돌격 공격", english: "Charging attacks" },
    "벽력일섬",
    "Lightning Flash"
  ),
  son: createTrigram(
    "son",
    "손",
    "Wind",
    "☴",
    { korean: "풍", english: "Breeze" },
    { korean: "침투와 순응", english: "Penetration and adaptation" },
    { korean: "연속 공격", english: "Continuous attacks" },
    "선풍연격",
    "Whirlwind Barrage"
  ),
  gam: createTrigram(
    "gam",
    "감",
    "Water",
    "☵",
    { korean: "수", english: "Stream" },
    { korean: "위험과 깊이", english: "Danger and depth" },
    { korean: "반격", english: "Counter-attacks" },
    "수류반격",
    "Water Counter"
  ),
  gan: createTrigram(
    "gan",
    "간",
    "Mountain",
    "☶",
    { korean: "산", english: "Peak" },
    { korean: "정지와 안정", english: "Stillness and stability" },
    { korean: "방어", english: "Defense" },
    "반석방어",
    "Rock Defense"
  ),
  gon: createTrigram(
    "gon",
    "곤",
    "Earth",
    "☷",
    { korean: "지", english: "Ground" },
    { korean: "수용과 양육", english: "Receptivity and nurturing" },
    { korean: "제압 기술", english: "Grappling techniques" },
    "대지포옹",
    "Earth Embrace"
  ),
};

// Stance effectiveness matrix (how effective each stance is against others)
export const STANCE_EFFECTIVENESS_MATRIX: TrigramEffectivenessMatrix = {
  geon: {
    geon: 1.0,
    tae: 1.1,
    li: 0.9,
    jin: 1.0,
    son: 1.2,
    gam: 0.8,
    gan: 1.1,
    gon: 0.9,
  },
  tae: {
    geon: 0.9,
    tae: 1.0,
    li: 1.1,
    jin: 0.8,
    son: 1.0,
    gam: 1.2,
    gan: 0.9,
    gon: 1.1,
  },
  li: {
    geon: 1.1,
    tae: 0.9,
    li: 1.0,
    jin: 1.2,
    son: 0.8,
    gam: 1.0,
    gan: 1.1,
    gon: 0.9,
  },
  jin: {
    geon: 1.0,
    tae: 1.2,
    li: 0.8,
    jin: 1.0,
    son: 1.1,
    gam: 0.9,
    gan: 1.0,
    gon: 1.1,
  },
  son: {
    geon: 0.8,
    tae: 1.0,
    li: 1.2,
    jin: 0.9,
    son: 1.0,
    gam: 1.1,
    gan: 0.8,
    gon: 1.0,
  },
  gam: {
    geon: 1.2,
    tae: 0.8,
    li: 1.0,
    jin: 1.1,
    son: 0.9,
    gam: 1.0,
    gan: 1.2,
    gon: 0.8,
  },
  gan: {
    geon: 0.9,
    tae: 1.1,
    li: 0.9,
    jin: 1.0,
    son: 1.2,
    gam: 0.8,
    gan: 1.0,
    gon: 1.1,
  },
  gon: {
    geon: 1.1,
    tae: 0.9,
    li: 1.1,
    jin: 0.9,
    son: 1.0,
    gam: 1.2,
    gan: 0.9,
    gon: 1.0,
  },
};

// Archetype stance preferences
export const ARCHETYPE_STANCE_AFFINITIES: Record<
  PlayerArchetype,
  Record<TrigramStance, number>
> = {
  musa: {
    geon: 1.2,
    tae: 1.0,
    li: 1.1,
    jin: 1.1,
    son: 0.9,
    gam: 1.0,
    gan: 1.1,
    gon: 0.9,
  },
  amsalja: {
    geon: 0.9,
    tae: 1.2,
    li: 1.1,
    jin: 1.0,
    son: 1.2,
    gam: 1.1,
    gan: 0.8,
    gon: 0.9,
  },
  hacker: {
    geon: 0.8,
    tae: 1.1,
    li: 1.2,
    jin: 0.9,
    son: 1.1,
    gam: 1.1,
    gan: 1.0,
    gon: 1.0,
  },
  jeongbo_yowon: {
    geon: 1.0,
    tae: 1.1,
    li: 1.0,
    jin: 0.9,
    son: 1.2,
    gam: 1.1,
    gan: 1.0,
    gon: 0.9,
  },
  jojik_pokryeokbae: {
    geon: 1.1,
    tae: 0.9,
    li: 1.0,
    jin: 1.2,
    son: 0.8,
    gam: 1.0,
    gan: 1.1,
    gon: 1.1,
  },
};
