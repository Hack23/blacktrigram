/**
 * Three.js Optimization Module
 * 
 * Performance optimization utilities for mobile and desktop rendering.
 * Includes LOD system, instanced geometry, and adaptive quality management.
 * 
 * @module components/shared/three/optimization
 * @category Performance Optimization
 * @korean 최적화모듈
 */

export {
  AdaptiveQualitySystem,
  useAdaptiveQuality,
  getQualityFromPerformanceSettings,
  QUALITY_PRESETS,
  type QualityLevel,
  type QualitySettings,
  type AdaptiveQualityThresholds,
} from "./AdaptiveQuality";

export {
  LODCharacter,
  LODEffect,
  calculateLODDistances,
  getLODParticleCount,
  getLODShadowQuality,
  DEFAULT_LOD_DISTANCES,
  MOBILE_LOD_DISTANCES,
  type LODDistances,
  type LODCharacterProps,
  type LODEffectProps,
} from "./LODSystem";

export {
  InstancableSpheres,
  InstancableBoxes,
  InstancableParticles,
  getOptimalInstanceLimit,
  batchInstances,
  createInstancesFromPositions,
  type InstanceData,
  type InstancableSpheresProps,
  type InstancableBoxesProps,
  type InstancableParticlesProps,
} from "./InstancedGeometry";
