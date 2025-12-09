/**
 * Shared utility functions for stance-related operations
 * 
 * Provides common helpers for stance colors, names, and symbols
 * to avoid duplication across components.
 * 
 * @module utils/stanceHelpers
 * @category Utilities
 * @korean 자세도우미
 */

import { TrigramStance } from "../types/common";
import { KOREAN_COLORS } from "../types/constants";

/**
 * Get color for each trigram stance
 * Maps 8 trigrams to Korean cyberpunk color palette
 * 
 * @param stance - Current trigram stance
 * @returns Hex color number
 * @korean 자세색상가져오기
 */
export const getStanceColor = (stance: TrigramStance): number => {
  const stanceColors = {
    [TrigramStance.GEON]: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY, // Heaven - Gold
    [TrigramStance.TAE]: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,   // Lake - Sky Blue
    [TrigramStance.LI]: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,     // Fire - Orange Red
    [TrigramStance.JIN]: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,   // Thunder - Purple
    [TrigramStance.SON]: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,   // Wind - Light Green
    [TrigramStance.GAM]: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,   // Water - Blue
    [TrigramStance.GAN]: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,   // Mountain - Brown
    [TrigramStance.GON]: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,   // Earth - Dark Khaki
  };
  return stanceColors[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
};

/**
 * Get stance display names (Korean + English)
 * 
 * @param stance - Current trigram stance
 * @returns Object with korean, english, and romanized names
 * @korean 자세이름가져오기
 */
export const getStanceNames = (stance: TrigramStance) => {
  const names = {
    [TrigramStance.GEON]: { korean: "건", english: "Heaven", romanized: "Geon" },
    [TrigramStance.TAE]: { korean: "태", english: "Lake", romanized: "Tae" },
    [TrigramStance.LI]: { korean: "리", english: "Fire", romanized: "Li" },
    [TrigramStance.JIN]: { korean: "진", english: "Thunder", romanized: "Jin" },
    [TrigramStance.SON]: { korean: "손", english: "Wind", romanized: "Son" },
    [TrigramStance.GAM]: { korean: "감", english: "Water", romanized: "Gam" },
    [TrigramStance.GAN]: { korean: "간", english: "Mountain", romanized: "Gan" },
    [TrigramStance.GON]: { korean: "곤", english: "Earth", romanized: "Gon" },
  };
  return names[stance] ?? { korean: "건", english: "Heaven", romanized: "Geon" };
};

/**
 * Get trigram Unicode symbol for each stance
 * 
 * @param stance - Current trigram stance
 * @returns Unicode trigram symbol
 * @korean 팔괘기호가져오기
 */
export const getTrigramSymbol = (stance: TrigramStance): string => {
  const symbols = {
    [TrigramStance.GEON]: "☰", // Heaven
    [TrigramStance.TAE]: "☱",  // Lake
    [TrigramStance.LI]: "☲",   // Fire
    [TrigramStance.JIN]: "☳",  // Thunder
    [TrigramStance.SON]: "☴",  // Wind
    [TrigramStance.GAM]: "☵",  // Water
    [TrigramStance.GAN]: "☶",  // Mountain
    [TrigramStance.GON]: "☷",  // Earth
  };
  return symbols[stance] ?? "☰";
};

/**
 * Get Korean name for each stance
 * 
 * @param stance - Current trigram stance
 * @returns Korean name (Hangul)
 * @korean 자세한글이름가져오기
 */
export const getStanceKoreanName = (stance: TrigramStance): string => {
  return getStanceNames(stance).korean;
};

/**
 * Get color as hex string for CSS usage
 * 
 * @param stance - Current trigram stance
 * @returns Hex color string (e.g., "#FFD700")
 * @korean 자세CSS색상가져오기
 */
export const getStanceColorHex = (stance: TrigramStance): string => {
  const color = getStanceColor(stance);
  return `#${color.toString(16).padStart(6, '0').toLowerCase()}`;
};
