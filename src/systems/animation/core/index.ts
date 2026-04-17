/**
 * Core animation sub-package
 *
 * Foundations for the animation system: types, priorities, transitions,
 * registries, hit timing, optimization, laterality, and stance mappings.
 */

export * from "./types";

export {
  ANIMATION_PRIORITY_MAP,
  canInterrupt,
  comparePriority,
  getPriority,
  PRIORITY_LEVEL_KOREAN_NAMES,
} from "./AnimationPriority";

export {
  buildTransitionMap,
  DEFAULT_TRANSITIONS,
  getStanceTransition,
  getValidTransitions,
  isTransitionAllowed,
  TRIGRAM_STANCES_ORDER,
} from "./AnimationTransitions";

export * from "./AnimationStateMachine";

export {
  ALL_ANIMATIONS,
  ANIMATION_REGISTRY,
  ELBOW_KNEE_ANIMATIONS,
  getAnimation,
  getAnimationByName,
  getAnimationByType,
  getAnimationByTypeOrDefault,
  getAnimationForTechnique,
  getAnimationForTechniqueId,
  getAnimationForTechniqueIdWithConfig,
  resolveTechniqueAnimation,
  GRAPPLING_ANIMATIONS,
  KICK_ANIMATIONS,
  PUNCH_ANIMATIONS,
  // New ID-based animation lookups (Option A Step 1)
  ANIMATION_ID_REGISTRY,
  CATEGORY_DEFAULT_ANIMATIONS,
  getAnimationById,
  getAnimationByIdWithFallback,
  hasAnimationId,
  getCategoryDefaultAnimation,
} from "./AnimationRegistry";

export {
  ANIMATION_HIT_TIMING,
  getAnimationHitTiming,
  getCurrentReachMultiplier,
  isWithinHitWindow,
} from "./AnimationHitTiming";
export type {
  AnimationHitWindow,
  TechniqueHitTiming,
} from "./AnimationHitTiming";

export {
  animationCache,
  batchTransformBones,
  batchUpdateBones,
  calculateDirtyBones,
  interpolateKeyframeCached,
  performanceMonitor,
  precomputeAnimation,
} from "./AnimationOptimizations";
export type { AnimationPerformanceMetrics } from "./AnimationOptimizations";

export {
  applyLaterality,
  areLateralityVariants,
  getAnimationLaterality,
} from "./LateralityTransform";

export {
  calculateSpeedModifierForDamage,
  determineAnimationTypeForTechnique,
  getAdjustedAnimationDuration,
  getAnimationNameForType,
  hasAnimationForType,
  TechniqueAnimationMapper,
  techniqueAnimationMapper,
} from "./TechniqueAnimationMapper";

export {
  getAllGuardPoses,
  getAnimationMappingStats,
  getAnimationsForStance,
  getAttackAnimations,
  getDefensiveAnimations,
  getGuardPoseForStanceWithSide,
  getRunAnimation,
  getWalkAnimation,
} from "./TrigramAnimationMapping";
export type {
  AnimationMappingStats,
  StanceAnimationCollection,
} from "./TrigramAnimationMapping";

export {
  calculateTransitionDuration,
  ensureStanceTransitionsInitialized,
  getStanceTransition as getTrigramStanceTransition,
  initializeStanceTransitions,
  STANCE_TRANSITIONS,
  transitionBetweenStances,
  TRIGRAM_STANCES_ORDER as TRIGRAM_STANCES_ORDER_TRANSITIONS,
} from "./TrigramStanceTransitions";

export {
  addRecoveryPhase,
  calculateMuscleTension,
  createTechniqueWithRecovery,
  validateRecoveryPhase,
} from "./RecoveryPhaseEnhancer";
export type {
  RecoveryPhaseConfig,
  RecoveryValidationResult,
} from "./RecoveryPhaseEnhancer";
