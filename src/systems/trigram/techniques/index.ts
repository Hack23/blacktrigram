/**
 * Techniques Module Index
 * 한국 무술 기법 모듈
 *
 * This module provides modular access to all Korean martial arts techniques
 * organized by trigram stance, plus Dark Ops techniques and configuration.
 *
 * Structure:
 * - Individual stance files (Geon, Tae, Li, Jin, Son, Gam, Gan, Gon)
 * - Dark Ops techniques for 암살자 archetype
 * - Configuration and constants
 *
 * @module techniques
 */

import { TrigramStance } from "../../../types/common";
import type { KoreanTechnique } from "../../vitalpoint/types";

// =====================================================
// STANCE TECHNIQUE IMPORTS
// =====================================================

// Basic stance techniques (array only)
export { GEON_TECHNIQUES } from "./GeonTechniques";
export { JIN_TECHNIQUES } from "./JinTechniques";
export { LI_TECHNIQUES } from "./LiTechniques";
export { TAE_TECHNIQUES } from "./TaeTechniques";

// Extended stance techniques (with helper functions)
export {
  GAM_TECHNIQUE_COUNT,
  GAM_TECHNIQUES,
  getGamTechniqueById,
  getGamTechniquesByType,
} from "./GamTechniques";
export {
  GAN_TECHNIQUE_COUNT,
  GAN_TECHNIQUES,
  getGanTechniqueById,
  getGanTechniquesByType,
} from "./GanTechniques";
export {
  getGonTechniqueById,
  getGonTechniquesByType,
  GON_TECHNIQUE_COUNT,
  GON_TECHNIQUES,
} from "./GonTechniques";
export {
  getSonTechniqueById,
  getSonTechniquesByType,
  SON_TECHNIQUE_COUNT,
  SON_TECHNIQUES,
} from "./SonTechniques";

// Import for composition
import { GAM_TECHNIQUES } from "./GamTechniques";
import { GAN_TECHNIQUES } from "./GanTechniques";
import { GEON_TECHNIQUES } from "./GeonTechniques";
import { GON_TECHNIQUES } from "./GonTechniques";
import { JIN_TECHNIQUES } from "./JinTechniques";
import { LI_TECHNIQUES } from "./LiTechniques";
import { SON_TECHNIQUES } from "./SonTechniques";
import { TAE_TECHNIQUES } from "./TaeTechniques";

// =====================================================
// DARK OPS TECHNIQUE IMPORTS
// =====================================================

export {
  DARK_OPS_ARCHETYPE_BONUSES,
  DARK_OPS_NIGHT_BONUS,
  DARK_OPS_SPECIAL_EFFECTS,
  DARK_OPS_TECHNIQUE_COUNT,
  DARK_OPS_TECHNIQUES,
  DARK_OPS_UNITS,
  getDarkOpsArchetypeBonus,
  getDarkOpsTechniqueById,
  getDarkOpsTechniquesByUnit,
} from "./DarkOpsTechniques";

// =====================================================
// CONFIGURATION IMPORTS
// =====================================================

export {
  ARCHETYPE_TECHNIQUE_BONUSES,
  calculateDamageEffectiveness,
  DAMAGE_TYPE_EFFECTIVENESS,
  getTrigramKey,
  getTrigramProperties,
  KOREAN_TECHNIQUE_CATEGORIES,
  TECHNIQUE_DIFFICULTY_LEVELS,
  TECHNIQUE_MODIFIERS,
  TECHNIQUE_NAMING,
  TECHNIQUE_PROPERTIES,
  TRIGRAM_TECHNIQUE_PROPERTIES,
} from "./TechniqueConfig";

// =====================================================
// COMPOSED TRIGRAM TECHNIQUES
// =====================================================

/**
 * Complete TRIGRAM_TECHNIQUES map organized by stance
 * This is the primary technique lookup used throughout the game
 *
 * 팔괘 기술 전체 맵 (스탠스별 구성)
 */
export const TRIGRAM_TECHNIQUES: Record<
  TrigramStance,
  readonly KoreanTechnique[]
> = {
  [TrigramStance.GEON]: GEON_TECHNIQUES,
  [TrigramStance.TAE]: TAE_TECHNIQUES,
  [TrigramStance.LI]: LI_TECHNIQUES,
  [TrigramStance.JIN]: JIN_TECHNIQUES,
  [TrigramStance.SON]: SON_TECHNIQUES,
  [TrigramStance.GAM]: GAM_TECHNIQUES,
  [TrigramStance.GAN]: GAN_TECHNIQUES,
  [TrigramStance.GON]: GON_TECHNIQUES,
} as const;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get all techniques for a specific stance
 */
export function getTechniquesByStance(
  stance: TrigramStance
): readonly KoreanTechnique[] {
  return TRIGRAM_TECHNIQUES[stance] ?? [];
}

/**
 * Get a technique by ID from any stance
 */
export function getTechniqueById(id: string): KoreanTechnique | undefined {
  for (const techniques of Object.values(TRIGRAM_TECHNIQUES)) {
    const technique = techniques.find((t) => t.id === id);
    if (technique) return technique;
  }
  return undefined;
}

/**
 * Get all techniques across all stances
 */
export function getAllTechniques(): readonly KoreanTechnique[] {
  return Object.values(TRIGRAM_TECHNIQUES).flat();
}

/**
 * Get total technique count
 */
export function getTotalTechniqueCount(): number {
  return Object.values(TRIGRAM_TECHNIQUES).reduce(
    (sum, techniques) => sum + techniques.length,
    0
  );
}

/**
 * Get technique count by stance
 */
export function getTechniqueCountByStance(): Record<TrigramStance, number> {
  return {
    [TrigramStance.GEON]: GEON_TECHNIQUES.length,
    [TrigramStance.TAE]: TAE_TECHNIQUES.length,
    [TrigramStance.LI]: LI_TECHNIQUES.length,
    [TrigramStance.JIN]: JIN_TECHNIQUES.length,
    [TrigramStance.SON]: SON_TECHNIQUES.length,
    [TrigramStance.GAM]: GAM_TECHNIQUES.length,
    [TrigramStance.GAN]: GAN_TECHNIQUES.length,
    [TrigramStance.GON]: GON_TECHNIQUES.length,
  };
}
