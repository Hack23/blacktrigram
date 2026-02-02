/**
 * Particle Effects System - Enhanced 3D particle effects for combat realism
 * 
 * This module provides a comprehensive particle effects system for Black Trigram,
 * including blood splatter, impact sparks, dust clouds, and Korean trigram symbols.
 * 
 * Features:
 * - Object pooling for performance optimization
 * - Physics-based particle simulation
 * - Korean cultural theming and aesthetics
 * - Mobile performance optimization
 * - 75 comprehensive tests with 100% pass rate
 * 
 * @module components/effects
 * @category Combat Effects
 * @korean 입자효과체계
 */

// Particle pooling system for performance
export { ParticlePool, globalParticlePool } from '../../../../../utils/particlePool';
export type { ParticlePoolConfig } from '../../../../../utils/particlePool';

// Blood particle effects
export { BloodParticles3D } from './BloodParticles3D';
export type { BloodSplatterEffect, BloodParticles3DProps } from './BloodParticles3D';

// Arterial spray effects for vital point strikes
export { ArterialSpray3D } from './ArterialSpray3D';
export type { ArterialSprayEffect, ArterialSpray3DProps, ArterialVitalPoint } from './ArterialSpray3D';

// Bone fracture particles for bone-breaking techniques
export { BoneCrackParticles3D } from './BoneCrackParticles3D';
export type { BoneCrackEffect, BoneCrackParticles3DProps, FractureType, BoneType } from './BoneCrackParticles3D';

// Nerve strike particles for vital point feedback
export { NerveStrikeParticles3D } from './NerveStrikeParticles3D';
export type { NerveStrikeEffect, NerveStrikeParticles3DProps } from './NerveStrikeParticles3D';

// Internal damage visualization for organ strikes
export { InternalDamage3D } from './InternalDamage3D';
export type { InternalDamageEffect, InternalDamage3DProps, OrganType, PenetrationDepth } from './InternalDamage3D';

// Enhanced blood viscosity for realistic droplets
export { BloodViscosity3D } from './BloodViscosity3D';
export type { BloodViscosityEffect, BloodViscosity3DProps, ViscosityType } from './BloodViscosity3D';

// Particle audio integration for synchronized sound effects
export { ParticleAudio3D, createAudioTrigger } from './ParticleAudio3D';
export type { ParticleAudioTrigger, ParticleAudio3DProps, ParticleEffectType } from './ParticleAudio3D';

// Impact spark effects for critical hits
export { ImpactSparks3D } from './ImpactSparks3D';
export type { ImpactSparkEffect, ImpactSparks3DProps } from './ImpactSparks3D';

// Dust cloud effects for movement and impacts
export { DustClouds3D } from './DustClouds3D';
export type { DustCloudEffect, DustClouds3DProps } from './DustClouds3D';

// Earth crack effects for Gon (Earth) trigram techniques
export { EarthCrackEffect3D } from './EarthCrackEffect3D';
export type { EarthCrackEffect, EarthCrackEffect3DProps } from './EarthCrackEffect3D';

// Earth healing effects for Gon supportive techniques
export { EarthHealingEffect3D } from './EarthHealingEffect3D';
export type { EarthHealingEffect, EarthHealingEffect3DProps } from './EarthHealingEffect3D';

// Korean trigram symbol particles for stance transitions
export { TrigramParticles3D } from '../../../../shared/three/effects/TrigramParticles3D';
export type { TrigramParticleEffect, TrigramParticles3DProps } from '../../../../shared/three/effects/TrigramParticles3D';

// Hit effects (moved to shared)
export { default as HitEffects3D } from '../../../../shared/three/effects/HitEffects3D';
export type { HitEffects3DProps } from '../../../../shared/three/effects/HitEffects3D';

/**
 * Performance Configuration Guide
 * 
 * **Desktop (60fps target):**
 * - Impact Sparks: 50-100 particles
 * - Dust Clouds: 30-60 particles (80 for throw impacts)
 * - Earth Cracks: 8 lines × 6 segments = 48 line segments
 * - Earth Healing: 6 roots × 8 particles/HP = 48 particles (max)
 * - Blood Splatter: 100-300 particles
 * - Arterial Spray: 250 particles (high-velocity jets)
 * - Bone Fractures: 15-60 particles (fracture type dependent)
 * - Nerve Strikes: 80 particles (electric-blue pulse)
 * - Trigram Symbols: 8 symbols per effect
 * - Max concurrent effects: 10-15
 * 
 * **Mobile (55fps target):**
 * - Impact Sparks: 25-50 particles
 * - Dust Clouds: 15-30 particles (40 for throw impacts)
 * - Earth Cracks: 5 lines × 4 segments = 20 line segments
 * - Earth Healing: 4 roots × 5 particles/HP = 20 particles (max)
 * - Blood Splatter: 50-100 particles
 * - Arterial Spray: 120 particles (optimized)
 * - Bone Fractures: 8-30 particles (reduced)
 * - Nerve Strikes: 40 particles (optimized)
 * - Trigram Symbols: 8 symbols per effect
 * - Max concurrent effects: 5-8
 * 
 * **Memory Budget:**
 * - Particle pool: ~2MB
 * - Active particles: ~1-3MB
 * - Total overhead: +2-5MB
 * 
 * @example
 * ```typescript
 * import {
 *   ImpactSparks3D,
 *   DustClouds3D,
 *   TrigramParticles3D,
 *   type ImpactSparkEffect,
 *   type DustCloudEffect,
 *   type TrigramParticleEffect,
 * } from '@/components/effects';
 * 
 * // Manage effect state
 * const [sparkEffects, setSparkEffects] = useState<ImpactSparkEffect[]>([]);
 * const [dustEffects, setDustEffects] = useState<DustCloudEffect[]>([]);
 * const [trigramEffects, setTrigramEffects] = useState<TrigramParticleEffect[]>([]);
 * 
 * // Trigger effects on game events
 * const handleCriticalHit = (position: [number, number, number]) => {
 *   const effect: ImpactSparkEffect = {
 *     id: generateId(),
 *     position,
 *     isCritical: true,
 *     intensity: 1.0,
 *     startTime: Date.now(),
 *   };
 *   setSparkEffects([...sparkEffects, effect]);
 * };
 * 
 * const handleStanceChange = (stance: TrigramStance, position: [number, number, number]) => {
 *   const effect: TrigramParticleEffect = {
 *     id: generateId(),
 *     position,
 *     stance,
 *     startTime: Date.now(),
 *   };
 *   setTrigramEffects([...trigramEffects, effect]);
 * };
 * 
 * // Render in scene
 * <Scene3D>
 *   <ImpactSparks3D
 *     effects={sparkEffects}
 *     enabled={visualSettings.sparks}
 *     isMobile={isMobile}
 *     onEffectComplete={(id) => setSparkEffects(prev => prev.filter(e => e.id !== id))}
 *   />
 *   
 *   <DustClouds3D
 *     effects={dustEffects}
 *     enabled={visualSettings.dust}
 *     isMobile={isMobile}
 *     onEffectComplete={(id) => setDustEffects(prev => prev.filter(e => e.id !== id))}
 *   />
 *   
 *   <TrigramParticles3D
 *     effects={trigramEffects}
 *     enabled={visualSettings.trigrams}
 *     onEffectComplete={(id) => setTrigramEffects(prev => prev.filter(e => e.id !== id))}
 *   />
 * </Scene3D>
 * ```
 */
