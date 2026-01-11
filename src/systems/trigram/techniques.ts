/**
 * @deprecated This file is deprecated. Import from './techniques/index' instead.
 *
 * Korean martial arts techniques - Re-export module for backward compatibility
 * 한국 무술 기법 - 하위 호환성을 위한 재수출 모듈
 *
 * This file now re-exports from the modular techniques directory.
 * All new code should import directly from './techniques/index' or './techniques/{StanceName}Techniques'.
 *
 * @example
 * // OLD (deprecated):
 * import { TRIGRAM_TECHNIQUES } from './techniques';
 *
 * // NEW (preferred):
 * import { TRIGRAM_TECHNIQUES } from './techniques/index';
 * // Or for specific stances:
 * import { GEON_TECHNIQUES } from './techniques/GeonTechniques';
 *
 * @module systems/trigram/techniques
 */

// Re-export everything from the modular techniques index for backward compatibility
export {
  // Configuration constants
  ARCHETYPE_TECHNIQUE_BONUSES,
  // Configuration helpers
  calculateDamageEffectiveness,
  DAMAGE_TYPE_EFFECTIVENESS,
  DARK_OPS_ARCHETYPE_BONUSES,
  DARK_OPS_NIGHT_BONUS,
  DARK_OPS_SPECIAL_EFFECTS,
  DARK_OPS_TECHNIQUE_COUNT,
  // Dark Ops techniques and constants
  DARK_OPS_TECHNIQUES,
  DARK_OPS_UNITS,
  // Stance-specific helpers
  GAM_TECHNIQUE_COUNT,
  // Individual stance technique arrays
  GAM_TECHNIQUES,
  GAN_TECHNIQUE_COUNT,
  GAN_TECHNIQUES,
  GEON_TECHNIQUES,
  // Helper functions
  getAllTechniques,
  getDarkOpsArchetypeBonus,
  getDarkOpsTechniqueById,
  getDarkOpsTechniquesByUnit,
  getGamTechniqueById,
  getGamTechniquesByType,
  getGanTechniqueById,
  getGanTechniquesByType,
  getGonTechniqueById,
  getGonTechniquesByType,
  getSonTechniqueById,
  getSonTechniquesByType,
  getTechniqueById,
  getTechniqueCountByStance,
  getTechniquesByStance,
  getTotalTechniqueCount,
  getTrigramKey,
  getTrigramProperties,
  GON_TECHNIQUE_COUNT,
  GON_TECHNIQUES,
  JIN_TECHNIQUES,
  KOREAN_TECHNIQUE_CATEGORIES,
  LI_TECHNIQUES,
  SON_TECHNIQUE_COUNT,
  SON_TECHNIQUES,
  TAE_TECHNIQUES,
  TECHNIQUE_DIFFICULTY_LEVELS,
  TECHNIQUE_MODIFIERS,
  TECHNIQUE_NAMING,
  TECHNIQUE_PROPERTIES,
  TRIGRAM_TECHNIQUE_PROPERTIES,
  // Composed TRIGRAM_TECHNIQUES map
  TRIGRAM_TECHNIQUES,
} from "./techniques/index";
