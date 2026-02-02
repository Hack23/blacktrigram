/**
 * TrigramParticles3DGPU - GPU-accelerated Korean trigram symbol particle effects
 *
 * High-performance GPU-based particle system using ShaderMaterial
 * for rendering 1000+ trigram particles at 60fps during stance transitions.
 *
 * Features:
 * - GPU-accelerated particle movement (vertex shader)
 * - Smooth circular particles with glow (fragment shader)
 * - Korean-themed colors per trigram
 * - Spiral expansion pattern maintained
 * - LOD (Level of Detail) support
 * - Memory-efficient with particle pooling
 * - Additive blending for glowing effect
 *
 * Performance:
 * - Target: <5ms per 1000 particles
 * - GPU utilization: 60-70%
 * - CPU utilization: <40%
 *
 * @module components/shared/three/effects/TrigramParticles3DGPU
 * @category Shared Effects
 * @korean 팔괘입자3D_GPU
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";
import { TrigramStance } from "../../../../types/common";
import particleVertexShader from "./shaders/particleVertex.glsl";
import particleFragmentShader from "./shaders/particleFragment.glsl";
import type { TrigramParticleEffect } from "./TrigramParticles3D";
import { ThreeObjectPools } from "../../../../utils/threeObjectPool";

/**
 * Props for TrigramParticles3DGPU component
 */
export interface TrigramParticles3DGPUProps {
  /** Active trigram effects to render */
  readonly effects: readonly TrigramParticleEffect[];
  /** Whether to enable trigram effects */
  readonly enabled?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
  /** Particle count per effect (default: 500, LOD will adjust) */
  readonly particleCount?: number;
  /** Camera distance for LOD (optional, will be calculated if not provided) */
  readonly cameraDistance?: number;
}

/**
 * Get color for trigram stance
 */
const getTrigramColor = (stance: TrigramStance): number => {
  const colorMap: Record<string, number> = {
    [TrigramStance.GEON]: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    [TrigramStance.TAE]: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    [TrigramStance.LI]: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    [TrigramStance.JIN]: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    [TrigramStance.SON]: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    [TrigramStance.GAM]: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    [TrigramStance.GAN]: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    [TrigramStance.GON]: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
  };
  return colorMap[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
};

/**
 * Effect constants
 */
const TRIGRAM_CONSTANTS = {
  /** Effect lifetime in seconds */
  LIFETIME: 2.0,
  /** Spiral expansion speed */
  SPIRAL_SPEED: 1.5,
  /** Particle size */
  PARTICLE_SIZE: 0.3,
  /** Rise speed (m/s) */
  RISE_SPEED: 0.5,
  /** Gravity acceleration */
  GRAVITY: 4.0,
} as const;

/**
 * LOD configuration
 */
const LOD_CONFIG = {
  /** Near distance threshold (meters) */
  NEAR_DISTANCE: 5,
  /** Medium distance threshold (meters) */
  MEDIUM_DISTANCE: 15,
  /** Particle counts per LOD level */
  PARTICLE_COUNTS: {
    NEAR: 1000,
    MEDIUM: 500,
    FAR: 100,
  },
} as const;

/**
 * Calculate LOD particle count based on camera distance
 */
const calculateLODParticleCount = (distance: number): number => {
  if (distance < LOD_CONFIG.NEAR_DISTANCE) {
    return LOD_CONFIG.PARTICLE_COUNTS.NEAR;
  }
  if (distance < LOD_CONFIG.MEDIUM_DISTANCE) {
    return LOD_CONFIG.PARTICLE_COUNTS.MEDIUM;
  }
  return LOD_CONFIG.PARTICLE_COUNTS.FAR;
};

/**
 * Individual GPU particle effect instance
 */
interface GPUParticleEffect {
  id: string;
  position: THREE.Vector3;
  stance: TrigramStance;
  startTime: number;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  points: THREE.Points;
}

/**
 * TrigramParticles3DGPU Component
 *
 * GPU-accelerated Korean trigram particle system.
 * Maintains API compatibility with TrigramParticles3D.
 *
 * @example
 * ```tsx
 * <TrigramParticles3DGPU
 *   effects={trigramEffects}
 *   enabled={visualEffects.trigrams}
 *   particleCount={500}
 *   onEffectComplete={(id) => {
 *     setTrigramEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const TrigramParticles3DGPU: React.FC<TrigramParticles3DGPUProps> = ({
  effects,
  enabled = true,
  onEffectComplete,
  particleCount: propParticleCount,
  cameraDistance,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const activeEffectsRef = useRef<Map<string, GPUParticleEffect>>(new Map());
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Calculate LOD particle count
  const particleCount = useMemo(() => {
    if (propParticleCount !== undefined) {
      return propParticleCount;
    }
    if (cameraDistance !== undefined) {
      return calculateLODParticleCount(cameraDistance);
    }
    return LOD_CONFIG.PARTICLE_COUNTS.MEDIUM; // Default to medium quality
  }, [propParticleCount, cameraDistance]);

  /**
   * Create GPU particle system for an effect
   * Performance: Uses ThreeObjectPools to reduce GC pressure during effect creation
   */
  const createParticleEffect = useMemo(
    () => (effect: TrigramParticleEffect, count: number): GPUParticleEffect => {
      const geometry = new THREE.BufferGeometry();

      // Create particle attributes
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const startTimes = new Float32Array(count);
      const sizes = new Float32Array(count);

      // Initialize particles in spiral pattern
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const radius = 0.5;

        // Initial position (tight spiral at center)
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        // Velocity (outward spiral)
        velocities[i * 3] = Math.cos(angle) * TRIGRAM_CONSTANTS.SPIRAL_SPEED;
        velocities[i * 3 + 1] = TRIGRAM_CONSTANTS.RISE_SPEED;
        velocities[i * 3 + 2] = Math.sin(angle) * TRIGRAM_CONSTANTS.SPIRAL_SPEED;

        // Stagger start times for wave effect
        startTimes[i] = (i / count) * 0.3;

        // Particle size with slight variation
        sizes[i] = TRIGRAM_CONSTANTS.PARTICLE_SIZE * (0.8 + Math.random() * 0.4);
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute("startTime", new THREE.BufferAttribute(startTimes, 1));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      // Create shader material with configurable uniforms
      // Use pooled Color object for temporary color creation
      const colorValue = getTrigramColor(effect.stance);
      const pooledColor = ThreeObjectPools.color.acquire();
      
      let material: THREE.ShaderMaterial;
      try {
        pooledColor.set(colorValue);
        
        // Clone color for shader material uniform (shader needs its own color instance)
        material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            speed: { value: 1.0 },
            gravity: { value: TRIGRAM_CONSTANTS.GRAVITY },
            lifetime: { value: TRIGRAM_CONSTANTS.LIFETIME },
            sizeScale: { value: 300.0 }, // Configurable perspective scale
            color: { value: pooledColor.clone() }, // Use cloned color for material ownership
            opacity: { value: 0.8 },
            edgeStart: { value: 0.3 }, // Configurable edge start
            edgeEnd: { value: 0.5 }, // Configurable edge end
            glowPower: { value: 3.0 }, // Configurable glow intensity
          },
          vertexShader: particleVertexShader,
          fragmentShader: particleFragmentShader,
          transparent: true,
          blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      } finally {
        // Release pooled color back to pool after cloning
        ThreeObjectPools.color.release(pooledColor);
      }

      // Use pooled Vector3 for position copy
      const pooledPos = ThreeObjectPools.vector3.acquire();
      pooledPos.set(...effect.position);
      const points = new THREE.Points(geometry, material);
      points.position.copy(pooledPos);
      ThreeObjectPools.vector3.release(pooledPos); // Release after copy

      // Acquire and store position for effect tracking
      const position = ThreeObjectPools.vector3.acquire();
      position.set(...effect.position);

      return {
        id: effect.id,
        position, // Store pooled vector (will be released in cleanup)
        stance: effect.stance,
        startTime: 0, // Will be set from clock in useFrame
        geometry,
        material,
        points,
      };
    },
    [],
  );

  // Manage effect lifecycle
  // Performance: Releases pooled Vector3 objects during cleanup
  useEffect(() => {
    if (!enabled || !groupRef.current) return;

    const currentEffectIds = new Set(effects.map((e) => e.id));
    const activeIds = Array.from(activeEffectsRef.current.keys());

    // Remove effects that are no longer in the list
    activeIds.forEach((id) => {
      if (!currentEffectIds.has(id)) {
        const effect = activeEffectsRef.current.get(id);
        if (effect) {
          groupRef.current?.remove(effect.points);
          effect.geometry.dispose();
          effect.material.dispose();
          // Release pooled Vector3 back to pool
          ThreeObjectPools.vector3.release(effect.position);
          activeEffectsRef.current.delete(id);
          completedEffectsRef.current.delete(id);
        }
      }
    });

    // Add new effects
    effects.forEach((effect) => {
      if (!activeEffectsRef.current.has(effect.id)) {
        const particleEffect = createParticleEffect(effect, particleCount);
        activeEffectsRef.current.set(effect.id, particleEffect);
        groupRef.current?.add(particleEffect.points);
      }
    });
  }, [effects, enabled, particleCount, createParticleEffect]);

  // Animation loop
  useFrame((state) => {
    if (!enabled) return;

    const currentTime = state.clock.elapsedTime;

    activeEffectsRef.current.forEach((effect, effectId) => {
      // Initialize startTime on first frame if not set
      if (effect.startTime === 0) {
        effect.startTime = currentTime;
      }

      // Update shader time uniform
      effect.material.uniforms.time.value = currentTime;

      // Check if effect is complete
      const age = currentTime - effect.startTime;
      if (
        age >= TRIGRAM_CONSTANTS.LIFETIME &&
        !completedEffectsRef.current.has(effectId)
      ) {
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);
      }
    });
  });

  // Cleanup on unmount - release all pooled objects
  useEffect(() => {
    return () => {
      const activeEffects = activeEffectsRef.current;
      activeEffects.forEach((effect) => {
        effect.geometry.dispose();
        effect.material.dispose();
        // Release pooled Vector3 back to pool
        ThreeObjectPools.vector3.release(effect.position);
      });
      activeEffects.clear();
    };
  }, []);

  // Don't render if disabled or no effects
  if (!enabled || effects.length === 0) {
    return null;
  }

  return <group ref={groupRef} name="trigram-particles-gpu" />;
};

export default TrigramParticles3DGPU;
