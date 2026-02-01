/**
 * Optimized Effects Package Index
 *
 * Exports GPU-accelerated and instanced rendering components
 * for high-performance visual effects in Black Trigram.
 *
 * @module components/shared/three/effects/optimized
 * @category Shared Effects
 */

// GPU-accelerated particle systems
export { TrigramParticles3DGPU } from "./TrigramParticles3DGPU";
export type { TrigramParticles3DGPUProps } from "./TrigramParticles3DGPU";

// Instanced mesh rendering
export { HitEffects3DInstanced } from "./HitEffects3DInstanced";
export type { HitEffects3DInstancedProps } from "./HitEffects3DInstanced";

// Post-processing effects
export { EffectsComposer } from "./EffectsComposer";
export type { EffectsComposerProps } from "./EffectsComposer";

/**
 * Particle pooling system
 * 
 * Note: This utility is provided for custom/advanced particle implementations
 * that want to manage GPU resources manually. The optimized GPU components
 * exported from this module (TrigramParticles3DGPU, HitEffects3DInstanced)
 * implement their own internal resource management and do NOT depend on
 * ParticlePool. Use this for building custom particle systems or when you
 * need fine-grained control over particle lifecycle.
 */
export { ParticlePool } from "./ParticlePool";
export type { Particle, ParticlePoolConfig } from "./ParticlePool";

// Jin (Thunder) trigram explosive effects
export { default as ThunderEffect3D } from "./ThunderEffect3D";
export type { ThunderEffect3DProps } from "./ThunderEffect3D";
export { default as ExplosiveBurstEffect3D } from "./ExplosiveBurstEffect3D";
export type { ExplosiveBurstEffect3DProps } from "./ExplosiveBurstEffect3D";

// Original components (for backwards compatibility)
export { default as TrigramParticles3D } from "./TrigramParticles3D";
export type { TrigramParticles3DProps, TrigramParticleEffect } from "./TrigramParticles3D";
export { default as HitEffects3D } from "./HitEffects3D";
export type { HitEffects3DProps } from "./HitEffects3D";
export { default as StanceTransitionEffect } from "./StanceTransitionEffect";
export type { StanceTransitionEffectProps } from "./StanceTransitionEffect";
export { default as DamageNumbers } from "./DamageNumbers";
export type { DamageNumbersProps } from "./DamageNumbers";
export { default as VitalPointMarkers3D } from "./VitalPointMarkers3D";
export type { VitalPointMarkers3DProps } from "./VitalPointMarkers3D";
export { default as StanceSymbol3D } from "./StanceSymbol3D";
export type { StanceSymbol3DProps } from "./StanceSymbol3D";
export { default as ActionFeedback } from "./ActionFeedback";
export type { ActionFeedbackProps } from "./ActionFeedback";
export { default as PlayerStateIndicators } from "./PlayerStateIndicators";
export { default as LimbExposureIndicator3D } from "./LimbExposureIndicator3D";
export type { LimbExposureIndicator3DProps } from "./LimbExposureIndicator3D";
