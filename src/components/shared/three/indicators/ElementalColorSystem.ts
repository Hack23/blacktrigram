/**
 * Elemental Color System for Korean Trigram Stances
 * Based on 오행 (Wu Xing / Five Elements) philosophy
 * 
 * Maps each of the eight trigram stances to one of the five elements,
 * providing color-coded visual feedback for combat and training.
 * 
 * Note: This module provides the correct element mappings based on traditional
 * Bagua philosophy. The element property in TRIGRAM_DATA currently uses placeholder
 * "metal" values and should be updated to use this system.
 * 
 * @module components/shared/three/indicators/ElementalColorSystem
 * @category Combat UI
 * @korean 오행색체계
 */

import { TrigramStance } from "../../../../types/common";
import { TRIGRAM_DATA } from "../../../../systems/trigram/types";

/**
 * Five Elements (오행) color palette
 * 
 * Based on traditional Korean/Chinese five element theory:
 * - Wood (木): Growth, expansion - Green tones
 * - Fire (火): Energy, passion - Red/Orange tones  
 * - Earth (土): Stability, grounding - Yellow/Brown tones
 * - Metal (金): Precision, strength - White/Gold tones
 * - Water (水): Flow, adaptation - Blue/Cyan tones
 * 
 * @korean 오행색상
 */
export const ELEMENT_COLORS = {
  /** Wood element - Growth and expansion (木) */
  wood: 0x228b22, // Forest green
  /** Fire element - Energy and passion (火) */
  fire: 0xff4444, // Bright red
  /** Earth element - Stability and grounding (土) */
  earth: 0xffd700, // Gold/Yellow
  /** Metal element - Precision and strength (金) */
  metal: 0xffffff, // White/Silver
  /** Water element - Flow and adaptation (水) */
  water: 0x00ffff, // Cyan
} as const;

/**
 * Element type from the five elements system
 * @korean 원소타입
 */
export type Element = keyof typeof ELEMENT_COLORS;

/**
 * Mapping of trigram stances to five elements
 * 
 * Based on traditional Bagua (八卦) associations:
 * - Geon (Heaven) ☰: Metal - Represents strength and clarity
 * - Tae (Lake) ☱: Metal - Represents joy and openness
 * - Li (Fire) ☲: Fire - Represents illumination and awareness
 * - Jin (Thunder) ☳: Wood - Represents movement and initiative
 * - Son (Wind) ☴: Wood - Represents gentleness and penetration
 * - Gam (Water) ☵: Water - Represents depth and danger
 * - Gan (Mountain) ☶: Earth - Represents stillness and rest
 * - Gon (Earth) ☷: Earth - Represents receptivity and nourishment
 * 
 * @korean 팔괘원소대응
 */
export const TRIGRAM_TO_ELEMENT: Record<TrigramStance, Element> = {
  [TrigramStance.GEON]: "metal", // ☰ Heaven (건)
  [TrigramStance.TAE]: "metal",  // ☱ Lake (태)
  [TrigramStance.LI]: "fire",    // ☲ Fire (리)
  [TrigramStance.JIN]: "wood",   // ☳ Thunder (진)
  [TrigramStance.SON]: "wood",   // ☴ Wind (손)
  [TrigramStance.GAM]: "water",  // ☵ Water (감)
  [TrigramStance.GAN]: "earth",  // ☶ Mountain (간)
  [TrigramStance.GON]: "earth",  // ☷ Earth (곤)
};



/**
 * Get the elemental color for a trigram stance
 * 
 * Returns the hexadecimal color value associated with the stance's element.
 * 
 * @param stance - The trigram stance to get the color for
 * @returns Hexadecimal color value (e.g., 0x00ffff)
 * 
 * @example
 * ```typescript
 * const color = getTrigramElementColor(TrigramStance.GEON);
 * // Returns 0xffffff (white/metal)
 * ```
 * 
 * @korean 팔괘원소색상얻기
 */
export function getTrigramElementColor(stance: TrigramStance): number {
  const element = TRIGRAM_TO_ELEMENT[stance];
  return ELEMENT_COLORS[element];
}

/**
 * Get the Unicode symbol for a trigram stance
 * 
 * Returns the Unicode trigram symbol character (☰☱☲☳☴☵☶☷).
 * Uses the symbol from TRIGRAM_DATA to maintain single source of truth.
 * 
 * @param stance - The trigram stance to get the symbol for
 * @returns Unicode trigram symbol
 * 
 * @example
 * ```typescript
 * const symbol = getTrigramSymbol(TrigramStance.GEON);
 * // Returns "☰" (Heaven)
 * ```
 * 
 * @korean 팔괘기호얻기
 */
export function getTrigramSymbol(stance: TrigramStance): string {
  return TRIGRAM_DATA[stance].symbol;
}

/**
 * Get the element associated with a trigram stance
 * 
 * @param stance - The trigram stance to get the element for
 * @returns Element name (wood, fire, earth, metal, water)
 * 
 * @example
 * ```typescript
 * const element = getTrigramElement(TrigramStance.LI);
 * // Returns "fire"
 * ```
 * 
 * @korean 팔괘원소얻기
 */
export function getTrigramElement(stance: TrigramStance): Element {
  return TRIGRAM_TO_ELEMENT[stance];
}

/**
 * Get Korean name for a trigram stance
 * 
 * Uses the Korean name from TRIGRAM_DATA to maintain single source of truth.
 * 
 * @param stance - The trigram stance to get the name for
 * @returns Korean name (e.g., "건" for Heaven)
 * 
 * @example
 * ```typescript
 * const koreanName = getTrigramKoreanName(TrigramStance.GEON);
 * // Returns "건"
 * ```
 * 
 * @korean 팔괘한글명얻기
 */
export function getTrigramKoreanName(stance: TrigramStance): string {
  return TRIGRAM_DATA[stance].name.korean;
}

/**
 * Get English name for a trigram stance
 * 
 * Uses the English name from TRIGRAM_DATA to maintain single source of truth.
 * 
 * @param stance - The trigram stance to get the name for
 * @returns English name (e.g., "Heaven" for Geon)
 * 
 * @example
 * ```typescript
 * const englishName = getTrigramEnglishName(TrigramStance.GEON);
 * // Returns "Heaven"
 * ```
 * 
 * @korean 팔괘영문명얻기
 */
export function getTrigramEnglishName(stance: TrigramStance): string {
  return TRIGRAM_DATA[stance].name.english;
}

/**
 * Get all trigram information for a stance
 * 
 * Returns a complete set of information about the trigram stance including
 * symbol, colors, names, and element association.
 * 
 * @param stance - The trigram stance to get information for
 * @returns Complete trigram information object
 * 
 * @example
 * ```typescript
 * const info = getTrigramInfo(TrigramStance.LI);
 * // Returns {
 * //   stance: TrigramStance.LI,
 * //   symbol: "☲",
 * //   element: "fire",
 * //   color: 0xff4444,
 * //   koreanName: "리",
 * //   englishName: "Fire"
 * // }
 * ```
 * 
 * @korean 팔괘정보얻기
 */
export function getTrigramInfo(stance: TrigramStance): {
  readonly stance: TrigramStance;
  readonly symbol: string;
  readonly element: Element;
  readonly color: number;
  readonly koreanName: string;
  readonly englishName: string;
} {
  return {
    stance,
    symbol: getTrigramSymbol(stance),
    element: getTrigramElement(stance),
    color: getTrigramElementColor(stance),
    koreanName: getTrigramKoreanName(stance),
    englishName: getTrigramEnglishName(stance),
  };
}
