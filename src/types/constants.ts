// This file re-exports all constants from the src/types/constants/ subdirectory.
export * from "./constants/index"; // This should cover most re-exports from the subdirectory

// Core constants for Black Trigram (흑괘) Korean martial arts system
export const GAME_VERSION = "1.0.0" as const;
export const GAME_NAME = "흑괘 (Black Trigram)" as const;

export const KOREAN_MARTIAL_ARTS_PRINCIPLES = {
  RESPECT: "존중 (Jonjung)",
  DISCIPLINE: "수련 (Suryeon)",
  PRECISION: "정확 (Jeonghwak)",
  WISDOM: "지혜 (Jihye)",
  BALANCE: "균형 (Gyunhyeong)",
} as const;

export const VITAL_POINT_SYSTEM = {
  TOTAL_POINTS: 70,
  CATEGORIES: 8,
  SEVERITY_LEVELS: 4,
  MAX_SIMULTANEOUS_HITS: 3,
} as const;

export const TRIGRAM_SYSTEM = {
  TOTAL_STANCES: 8,
  MAX_TRANSITION_CHAINS: 3,
  BASE_TRANSITION_TIME_MS: 500,
  PHILOSOPHY_DEPTH_LEVELS: 4,
} as const;

export const PLAYER_ARCHETYPES_COUNT = 5 as const;

export const CYBERPUNK_DOJANG = {
  NEON_INTENSITY: 0.8,
  SHADOW_DEPTH: 0.6,
  TRADITIONAL_ELEMENTS: true,
  KOREAN_CALLIGRAPHY: true,
} as const;

// Typography constants for Korean text
export const KOREAN_FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
  heavy: 900,
} as const;

// Re-export from other constant files
// export * from "./constants/index"; // Already at the top

// Re-export typography constants
export * from "./constants/typography";
