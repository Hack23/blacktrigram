/**
 * @module systems/trigram
 * @category Trigram System
 */

export * from "./KoreanCulture";
export * from "./KoreanTechniques";
export * from "./StanceManager";
export * from "./TransitionCalculator";
export * from "./TrigramCalculator";
export * from "./types";

// Export modular techniques selectively to avoid conflicts
export {
  // Configuration (not duplicated elsewhere)
  DAMAGE_TYPE_EFFECTIVENESS,
  // Dark Ops helpers
  DARK_OPS_TECHNIQUE_COUNT,
  // Stance technique arrays
  GAM_TECHNIQUES,
  // Stance-specific helpers
  GAM_TECHNIQUE_COUNT,
  GAN_TECHNIQUES,
  GAN_TECHNIQUE_COUNT,
  GEON_TECHNIQUES,
  GON_TECHNIQUES,
  GON_TECHNIQUE_COUNT,
  JIN_TECHNIQUES,
  KOREAN_TECHNIQUE_CATEGORIES,
  LI_TECHNIQUES,
  SON_TECHNIQUES,
  SON_TECHNIQUE_COUNT,
  TAE_TECHNIQUES,
  TECHNIQUE_DIFFICULTY_LEVELS,
  TECHNIQUE_MODIFIERS,
  TECHNIQUE_NAMING,
  TECHNIQUE_PROPERTIES,
  TRIGRAM_TECHNIQUE_PROPERTIES,
  calculateDamageEffectiveness,
  // Helper functions from techniques module
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
  getTotalTechniqueCount,
  getTrigramKey,
  getTrigramProperties,
} from "./techniques/index";
