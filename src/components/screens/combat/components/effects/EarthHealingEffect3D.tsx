/**
 * EarthHealingEffect3D - Healing visual effects for Gon (Earth) trigram supportive techniques
 *
 * Visualizes earth's nurturing and supportive philosophy through root-like energy.
 * Roots grow from ground upward, representing the earth's life-giving power.
 * Green growth energy particles rise with warm earth glow.
 *
 * PERFORMANCE OPTIMIZATION:
 * - Uses instanced particles for efficient rendering
 * - Object pooling for temporary Vector3 calculations during particle generation
 * - Particle positions/velocities stored as number arrays to avoid Vector3 leaks
 * - Target: 10+ concurrent effects at 60fps
 * - Memory: <15KB per component
 *
 * Features:
 * - Root-like energy tendrils growing upward
 * - Warm earth glow (brown/orange) with green growth energy
 * - Healing particles rising to target
 * - Intensity scales with heal amount (1-6 HP)
 * - Animation duration: 1-2 seconds
 *
 * Philosophy:
 * "대지는 모든 것을 품고 키운다" - The earth embraces and nurtures all
 *
 * @module components/combat/EarthHealingEffect3D
 * @category Combat Effects
 * @korean 대지치유효과3D
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { ThreeObjectPools } from "../../../../../utils/threeObjectPool";

/**
 * Earth healing effect data
 */
export interface EarthHealingEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position in 3D world space (character position) */
  readonly position: [number, number, number];
  /** Heal amount (1-6 HP scale) */
  readonly healAmount: number;
  /** Timestamp when effect was created */
  readonly startTime: number;
}

/**
 * Props for EarthHealingEffect3D component
 */
export interface EarthHealingEffect3DProps {
  /** Active earth healing effects to render */
  readonly effects: readonly EarthHealingEffect[];
  /** Whether to enable earth healing effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Individual healing particle
 * Stores positions and velocities as number arrays to avoid Vector3 memory leaks
 */
interface HealingParticle {
  // Position stored as [x, y, z] array instead of Vector3
  position: [number, number, number];
  // Velocity stored as [vx, vy, vz] array instead of Vector3
  velocity: [number, number, number];
  age: number;
  lifetime: number;
  size: number;
  rootIndex: number; // Which root tendril this particle follows
}

/**
 * Root tendril path
 */
interface RootTendril {
  baseAngle: number;
  height: number;
  curvature: number;
  width: number;
}

/**
 * Performance and visual constants
 */
const HEALING_CONSTANTS = {
  /** Number of root tendrils */
  ROOT_COUNT_DESKTOP: 6,
  ROOT_COUNT_MOBILE: 4,
  /** Particles per HP healed */
  PARTICLES_PER_HP_DESKTOP: 8,
  PARTICLES_PER_HP_MOBILE: 5,
  /** Effect lifetime (s) */
  LIFETIME: 1.8, // 1.8 seconds
  /** Root growth duration (s) */
  ROOT_GROWTH_DURATION: 0.8, // 800ms
  /** Particle rise duration (s) */
  PARTICLE_RISE_DURATION: 1.2, // 1.2 seconds
  /** Root height range (m) */
  ROOT_HEIGHT_MIN: 1.5,
  ROOT_HEIGHT_MAX: 2.5,
  /** Root base radius */
  ROOT_BASE_RADIUS: 0.8,
  /** Upward velocity range (m/s) */
  VELOCITY_UP_MIN: 1.0,
  VELOCITY_UP_MAX: 2.0,
  /** Spiral effect strength */
  SPIRAL_STRENGTH: 0.5,
  /** Particle size range */
  SIZE_MIN: 0.06,
  SIZE_MAX: 0.12,
  /** Ground Y position */
  GROUND_Y: 0.0,
  /** Maximum delta time for physics stability */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Generate root tendrils for healing effect
 */
const generateRootTendrils = (rootCount: number): RootTendril[] => {
  const tendrils: RootTendril[] = [];

  for (let i = 0; i < rootCount; i++) {
    const angle = (i / rootCount) * Math.PI * 2;
    tendrils.push({
      baseAngle: angle,
      height: 
        HEALING_CONSTANTS.ROOT_HEIGHT_MIN + 
        Math.random() * (HEALING_CONSTANTS.ROOT_HEIGHT_MAX - HEALING_CONSTANTS.ROOT_HEIGHT_MIN),
      curvature: (Math.random() - 0.5) * 0.3, // Slight curve for organic feel
      width: 0.03 + Math.random() * 0.02,
    });
  }

  return tendrils;
};

/**
 * Generate healing particles along root tendrils
 * 
 * PERFORMANCE: Uses ThreeObjectPools to eliminate Vector3 allocations
 */
const generateHealingParticles = (
  effect: EarthHealingEffect,
  particleCount: number,
  tendrils: RootTendril[]
): HealingParticle[] => {
  const particles: HealingParticle[] = [];
  
  const tempOrigin = ThreeObjectPools.vector3.acquire();
  const tempVel = ThreeObjectPools.vector3.acquire();
  const tempPos = ThreeObjectPools.vector3.acquire();

  try {
    tempOrigin.set(...effect.position);
    // Start particles at ground level
    tempOrigin.y = HEALING_CONSTANTS.GROUND_Y;

    for (let i = 0; i < particleCount; i++) {
      // Assign particle to a root tendril
      const rootIndex = i % tendrils.length;
      const tendril = tendrils[rootIndex];

      // Position along tendril base
      const baseRadius = HEALING_CONSTANTS.ROOT_BASE_RADIUS * (0.3 + Math.random() * 0.7);
      tempPos.set(
        tempOrigin.x + Math.cos(tendril.baseAngle) * baseRadius,
        tempOrigin.y + Math.random() * 0.2, // Slight vertical spread
        tempOrigin.z + Math.sin(tendril.baseAngle) * baseRadius
      );

      // Upward velocity with spiral
      const upwardSpeed = 
        HEALING_CONSTANTS.VELOCITY_UP_MIN + 
        Math.random() * (HEALING_CONSTANTS.VELOCITY_UP_MAX - HEALING_CONSTANTS.VELOCITY_UP_MIN);
      
      const spiralAngle = tendril.baseAngle + tendril.curvature;
      tempVel.set(
        Math.cos(spiralAngle) * HEALING_CONSTANTS.SPIRAL_STRENGTH,
        upwardSpeed,
        Math.sin(spiralAngle) * HEALING_CONSTANTS.SPIRAL_STRENGTH
      );

      // Store as number arrays instead of cloning Vector3 to avoid memory leaks
      particles.push({
        position: [tempPos.x, tempPos.y, tempPos.z],
        velocity: [tempVel.x, tempVel.y, tempVel.z],
        age: 0,
        lifetime: HEALING_CONSTANTS.LIFETIME * (0.9 + Math.random() * 0.2),
        size: 
          HEALING_CONSTANTS.SIZE_MIN + 
          Math.random() * (HEALING_CONSTANTS.SIZE_MAX - HEALING_CONSTANTS.SIZE_MIN),
        rootIndex,
      });
    }

    return particles;
  } finally {
    ThreeObjectPools.vector3.release(tempOrigin);
    ThreeObjectPools.vector3.release(tempVel);
    ThreeObjectPools.vector3.release(tempPos);
  }
};

/**
 * EarthHealingEffect3D Component
 *
 * Renders earth healing effects for supportive techniques.
 * Root-like energy rises from ground with warm earth glow and green growth particles.
 *
 * @example
 * ```tsx
 * const [healingEffects, setHealingEffects] = useState<EarthHealingEffect[]>([]);
 *
 * // On healing technique
 * const handleHealing = (position: [number, number, number], healAmount: number) => {
 *   setHealingEffects([...healingEffects, {
 *     id: generateId(),
 *     position,
 *     healAmount,
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <EarthHealingEffect3D
 *   effects={healingEffects}
 *   enabled={visualEffects.earthHealing}
 *   isMobile={isMobile}
 *   onEffectComplete={(id) => {
 *     setHealingEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const EarthHealingEffect3D: React.FC<EarthHealingEffect3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const particlesRef = useRef<Map<string, HealingParticle[]>>(new Map());
  const tendrilsRef = useRef<Map<string, RootTendril[]>>(new Map());
  const pointsRef = useRef<THREE.Points>(null);
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Configuration based on device
  const config = useMemo(() => ({
    rootCount: isMobile 
      ? HEALING_CONSTANTS.ROOT_COUNT_MOBILE 
      : HEALING_CONSTANTS.ROOT_COUNT_DESKTOP,
    particlesPerHP: isMobile 
      ? HEALING_CONSTANTS.PARTICLES_PER_HP_MOBILE 
      : HEALING_CONSTANTS.PARTICLES_PER_HP_DESKTOP,
  }), [isMobile]);

  // Calculate max particles needed
  const maxParticles = useMemo(() => {
    return Math.ceil(6 * config.particlesPerHP); // Max 6 HP heal
  }, [config.particlesPerHP]);

  // Healing colors - Warm earth glow with green growth energy
  const healingColor = useMemo(() => {
    // Blend brown earth tone with green growth
    return new THREE.Color(KOREAN_COLORS.ACCENT_GREEN).lerp(
      new THREE.Color(KOREAN_COLORS.SECONDARY_BROWN_DARK),
      0.3
    );
  }, []);

  // Initialize particles for new effects
  useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!particlesRef.current.has(effect.id)) {
        // Generate root tendrils
        const tendrils = generateRootTendrils(config.rootCount);
        tendrilsRef.current.set(effect.id, tendrils);

        // Generate particles
        const particleCount = Math.ceil(effect.healAmount * config.particlesPerHP);
        const particles = generateHealingParticles(effect, particleCount, tendrils);
        particlesRef.current.set(effect.id, particles);
      }
    });

    // Clean up removed effects
    const effectIds = new Set(effects.map((e) => e.id));
    particlesRef.current.forEach((_, id) => {
      if (!effectIds.has(id)) {
        particlesRef.current.delete(id);
        tendrilsRef.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });
  }, [effects, enabled, config]);

  // Initial positions for buffer (updated in useFrame)
  const initialPositions = useMemo(() => {
    return new Float32Array(maxParticles * 3);
  }, [maxParticles]);

  // Physics update loop
  useFrame((_, delta) => {
    if (!enabled || !pointsRef.current) return;

    const safeDelta = Math.min(delta, HEALING_CONSTANTS.MAX_DELTA);

    let totalParticleIndex = 0;
    const attr = pointsRef.current.geometry.attributes.position;
    const posArray = attr.array as Float32Array;

    // Update all active healing particles
    particlesRef.current.forEach((particles, effectId) => {
      const tendrils = tendrilsRef.current.get(effectId);
      if (!tendrils) return;

      let hasActiveParticles = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age += safeDelta;

        if (p.age < p.lifetime) {
          hasActiveParticles = true;

          // Update position - upward motion with spiral (using number arrays)
          p.position[0] += p.velocity[0] * safeDelta;
          p.position[1] += p.velocity[1] * safeDelta;
          p.position[2] += p.velocity[2] * safeDelta;

          // Add spiral motion based on root tendril
          const tendril = tendrils[p.rootIndex];
          const spiralProgress = p.age / p.lifetime;
          const spiralRadius = HEALING_CONSTANTS.SPIRAL_STRENGTH * (1 - spiralProgress);
          const spiralAngle = tendril.baseAngle + spiralProgress * Math.PI * 4;
          
          p.position[0] += Math.cos(spiralAngle) * spiralRadius * safeDelta;
          p.position[2] += Math.sin(spiralAngle) * spiralRadius * safeDelta;

          // Slow down upward motion over time (settling effect)
          p.velocity[1] *= 0.985;

          // Update render position
          if (totalParticleIndex < posArray.length / 3) {
            posArray[totalParticleIndex * 3] = p.position[0];
            posArray[totalParticleIndex * 3 + 1] = p.position[1];
            posArray[totalParticleIndex * 3 + 2] = p.position[2];
            totalParticleIndex++;
          }
        }
      }

      // Check if effect is complete
      if (!hasActiveParticles && !completedEffectsRef.current.has(effectId)) {
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);
      }
    });

    attr.needsUpdate = true;
  });

  // Don't render if disabled or no effects
  if (!enabled || effects.length === 0) {
    return null;
  }

  return (
    <Points
      ref={pointsRef}
      positions={initialPositions}
      data-testid="earth-healing-effect-3d"
    >
      <PointMaterial
        color={healingColor}
        size={HEALING_CONSTANTS.SIZE_MIN * 2}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Warm glow effect
      />
    </Points>
  );
};

export default EarthHealingEffect3D;
