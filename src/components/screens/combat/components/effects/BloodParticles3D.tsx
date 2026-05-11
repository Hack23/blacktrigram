/**
 * BloodParticles3D - Realistic blood splatter particle system
 *
 * Creates physics-based blood particles that spray from impact points with gravity,
 * creating pools on the arena floor. Optimized for 60fps with instanced rendering.
 *
 * Features:
 * - Gravity-based particle physics
 * - Blood pool accumulation on floor
 * - 10-second fade-out for pools
 * - Instanced rendering for performance
 * - Mobile-optimized particle counts
 *
 * @module components/combat/BloodParticles3D
 * @category Combat Effects
 * @korean 피입자3D
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { ThreeObjectPools } from "../../../../../utils/threeObjectPool";

/**
 * Blood particle data structure for efficient simulation
 * 
 * PERFORMANCE: position and velocity now use pooled Vector3 objects
 * that are acquired on particle creation and released on expiration
 */
interface BloodParticle {
  /** Current position [x, y, z] - POOLED Vector3 */
  position: THREE.Vector3;
  /** Current velocity [x, y, z] - POOLED Vector3 */
  velocity: THREE.Vector3;
  /** Particle lifetime in seconds */
  lifetime: number;
  /** Time elapsed since creation */
  age: number;
  /** Whether particle has settled on floor */
  settled: boolean;
  /** Flag to track if vectors are pooled and need release */
  isPooled: boolean;
}

/**
 * Blood splatter effect configuration
 */
export interface BloodSplatterEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position in 3D world space */
  readonly position: [number, number, number];
  /** Impact direction for splatter */
  readonly direction: [number, number, number];
  /** Intensity of effect (0.0 to 1.0) */
  readonly intensity: number;
  /** Timestamp when effect was created */
  readonly startTime: number;
}

/**
 * Props for BloodParticles3D component
 */
export interface BloodParticles3DProps {
  /** Active blood splatter effects to render */
  readonly effects: readonly BloodSplatterEffect[];
  /** Whether to enable blood effects (violence settings) */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Performance and physics constants
 */
const BLOOD_CONSTANTS = {
  /** Gravity acceleration (m/s²) */
  GRAVITY: -9.8,
  /** Maximum particles per splatter effect */
  MAX_PARTICLES_DESKTOP: 300,
  MAX_PARTICLES_MOBILE: 100,
  /** Particle lifetime in seconds */
  PARTICLE_LIFETIME: 2.0,
  /** Blood pool fade duration in seconds */
  POOL_FADE_DURATION: 10.0,
  /** Initial velocity range */
  VELOCITY_MIN: 2.0,
  VELOCITY_MAX: 5.0,
  /** Spread angle in radians */
  SPREAD_ANGLE: Math.PI / 3,
  /** Floor Y position */
  FLOOR_Y: 0.0,
  /** Particle size */
  PARTICLE_SIZE: 0.05,
  /**
   * Maximum per-frame delta time (seconds) used to clamp the blood physics update.
   * 
   * We cap the simulation step at ~33ms (1/30) to avoid the classic
   * "spiral of death" when the frame rate drops: very large timesteps can
   * cause unstable motion, particles tunneling through the floor, or
   * visually exaggerated splatter. Treating anything below 30fps as
   * "slow motion" for this effect keeps the blood behavior stable even
   * on slower devices. If the engine's minimum target frame rate changes,
   * adjust this threshold accordingly.
   */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Generate initial particles for a blood splatter effect
 * 
 * PERFORMANCE OPTIMIZATION: Uses ThreeObjectPools for ALL Vector3 allocations
 * 
 * Pooling Strategy (UPDATED):
 * - Acquire temp vectors for calculations (baseDir, origin, axis vectors) - RELEASED
 * - Acquire position/velocity from pool for particle ownership - MUST BE RELEASED on expiration
 * 
 * Memory Impact:
 * - Before: 600 Vector3 allocations per splatter (2 per particle × 300)
 * - After: 5 temp vectors (reused) + particles use pooled vectors (released on expiration)
 * - Reduction: ~99.2% fewer allocations (600 → 5 temp + pooled reuse)
 * 
 * @param effect - Blood splatter effect configuration
 * @param maxParticles - Maximum number of particles to generate
 * @returns Array of blood particles with ALL vectors from pool (must be released later)
 */
const generateBloodParticles = (
  effect: BloodSplatterEffect,
  maxParticles: number
): BloodParticle[] => {
  const particles: BloodParticle[] = [];
  const particleCount = Math.floor(maxParticles * effect.intensity);

  const baseDir = ThreeObjectPools.vector3.acquire();
  const origin = ThreeObjectPools.vector3.acquire();
  const direction = ThreeObjectPools.vector3.acquire();
  const yAxis = ThreeObjectPools.vector3.acquire();
  const zAxis = ThreeObjectPools.vector3.acquire();

  baseDir.set(...effect.direction).normalize();
  origin.set(...effect.position);
  yAxis.set(0, 1, 0);
  zAxis.set(0, 0, 1);

  for (let i = 0; i < particleCount; i++) {
    const spreadAngle = BLOOD_CONSTANTS.SPREAD_ANGLE;
    const phi = (Math.random() - 0.5) * spreadAngle;
    const theta = Math.random() * Math.PI * 2;

    direction.copy(baseDir);
    direction.applyAxisAngle(yAxis, phi);
    direction.applyAxisAngle(zAxis, theta);

    const speed =
      BLOOD_CONSTANTS.VELOCITY_MIN +
      Math.random() * (BLOOD_CONSTANTS.VELOCITY_MAX - BLOOD_CONSTANTS.VELOCITY_MIN);

    const particlePosition = ThreeObjectPools.vector3.acquire();
    const particleVelocity = ThreeObjectPools.vector3.acquire();
    
    particlePosition.copy(origin);
    particleVelocity.copy(direction).multiplyScalar(speed);

    particles.push({
      position: particlePosition,
      velocity: particleVelocity,
      lifetime: BLOOD_CONSTANTS.PARTICLE_LIFETIME,
      age: 0,
      settled: false,
      isPooled: true, // Mark as pooled for cleanup
    });
  }

  ThreeObjectPools.vector3.release(baseDir);
  ThreeObjectPools.vector3.release(origin);
  ThreeObjectPools.vector3.release(direction);
  ThreeObjectPools.vector3.release(yAxis);
  ThreeObjectPools.vector3.release(zAxis);

  return particles;
};

/**
 * BloodParticles3D Component
 *
 * Renders realistic blood splatter effects using physics-based particle simulation.
 * Optimized for performance with instanced rendering and efficient physics updates.
 *
 * @example
 * ```tsx
 * const [bloodEffects, setBloodEffects] = useState<BloodSplatterEffect[]>([]);
 *
 * // On hit event
 * const handleHit = (position: [number, number, number], direction: [number, number, number]) => {
 *   setBloodEffects([...bloodEffects, {
 *     id: generateId(),
 *     position,
 *     direction,
 *     intensity: 0.8,
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <BloodParticles3D
 *   effects={bloodEffects}
 *   enabled={violenceSettings.blood}
 *   isMobile={isMobile}
 *   onEffectComplete={(id) => {
 *     setBloodEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const BloodParticles3D: React.FC<BloodParticles3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const particlesRef = useRef<Map<string, BloodParticle[]>>(new Map());
  const poolParticlesRef = useRef<BloodParticle[]>([]);
  const pointsRef = useRef<THREE.Points>(null);
  const completedEffectsRef = useRef<Set<string>>(new Set());

  const maxParticles = isMobile
    ? BLOOD_CONSTANTS.MAX_PARTICLES_MOBILE
    : BLOOD_CONSTANTS.MAX_PARTICLES_DESKTOP;

  const bloodColor = useMemo(() => KOREAN_COLORS.BLOODLOSS_INDICATOR, []);

  React.useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!particlesRef.current.has(effect.id)) {
        const particles = generateBloodParticles(effect, maxParticles);
        particlesRef.current.set(effect.id, particles);
      }
    });

    const effectIds = new Set(effects.map((e) => e.id));
    particlesRef.current.forEach((particles, id) => {
      if (!effectIds.has(id)) {
        particles.forEach((p) => {
          if (p.isPooled) {
            ThreeObjectPools.vector3.release(p.position);
            ThreeObjectPools.vector3.release(p.velocity);
            p.isPooled = false;
          }
        });
        particlesRef.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });
  }, [effects, enabled, maxParticles]);

  React.useEffect(() => {
    const currentParticles = particlesRef.current;
    const currentPoolParticles = poolParticlesRef.current;
    const currentCompletedEffects = completedEffectsRef.current;
    
    return () => {
      currentParticles.forEach((particles) => {
        particles.forEach((p) => {
          if (p.isPooled) {
            ThreeObjectPools.vector3.release(p.position);
            ThreeObjectPools.vector3.release(p.velocity);
            p.isPooled = false;
          }
        });
      });
      
      currentPoolParticles.forEach((p) => {
        if (p.isPooled) {
          ThreeObjectPools.vector3.release(p.position);
          ThreeObjectPools.vector3.release(p.velocity);
          p.isPooled = false;
        }
      });
      
      poolParticlesRef.current = [];
      
      currentParticles.clear();
      currentCompletedEffects.clear();
    };
  }, []);

  const initialPositions = useMemo(() => {
    const positions = new Float32Array(maxParticles * 3);
    return positions;
  }, [maxParticles]);

  useFrame((_, delta) => {
    if (!enabled || !pointsRef.current) return;

    const safeDelta = Math.min(delta, BLOOD_CONSTANTS.MAX_DELTA);

    let totalParticleIndex = 0;
    const attr = pointsRef.current.geometry.attributes.position;
    const posArray = attr.array as Float32Array;

    particlesRef.current.forEach((particles, effectId) => {
      let hasActiveParticles = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age += safeDelta;

        if (!p.settled) {
          p.velocity.y += BLOOD_CONSTANTS.GRAVITY * safeDelta;

          p.position.addScaledVector(p.velocity, safeDelta);

          if (p.position.y <= BLOOD_CONSTANTS.FLOOR_Y) {
            p.position.y = BLOOD_CONSTANTS.FLOOR_Y;
            p.velocity.set(0, 0, 0);
            p.settled = true;
            p.lifetime = BLOOD_CONSTANTS.POOL_FADE_DURATION;
            p.age = 0;

            poolParticlesRef.current.push(p);
          } else {
            hasActiveParticles = true;
          }
        }

        if (totalParticleIndex < posArray.length / 3) {
          posArray[totalParticleIndex * 3] = p.position.x;
          posArray[totalParticleIndex * 3 + 1] = p.position.y;
          posArray[totalParticleIndex * 3 + 2] = p.position.z;
          totalParticleIndex++;
        } else if (process.env.NODE_ENV === "development") {
          console.warn(
            `BloodParticles3D: Particle buffer full (${posArray.length / 3} particles). ` +
            `Additional particles are not rendered. Consider reducing particle counts or ` +
            `increasing maxParticles if this happens frequently.`
          );
        }
      }

      if (!hasActiveParticles && !completedEffectsRef.current.has(effectId)) {
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);
      }
    });

    const maxVisibleParticles = Math.min(maxParticles, posArray.length / 3);

    if (totalParticleIndex >= maxVisibleParticles) {
      poolParticlesRef.current = poolParticlesRef.current.filter((p) => {
        p.age += safeDelta;
        const isAlive = p.age < p.lifetime;
        
        if (!isAlive && p.isPooled) {
          ThreeObjectPools.vector3.release(p.position);
          ThreeObjectPools.vector3.release(p.velocity);
          p.isPooled = false; // Mark as released
        }
        
        return isAlive;
      });
    } else {
      poolParticlesRef.current = poolParticlesRef.current.filter((p) => {
        p.age += safeDelta;
        const isAlive = p.age < p.lifetime;

        if (isAlive && totalParticleIndex < maxVisibleParticles) {
          posArray[totalParticleIndex * 3] = p.position.x;
          posArray[totalParticleIndex * 3 + 1] = p.position.y;
          posArray[totalParticleIndex * 3 + 2] = p.position.z;
          totalParticleIndex++;
        }

        if (!isAlive && p.isPooled) {
          ThreeObjectPools.vector3.release(p.position);
          ThreeObjectPools.vector3.release(p.velocity);
          p.isPooled = false; // Mark as released
        }

        return isAlive;
      });
    }

    attr.needsUpdate = true;
  });

  if (!enabled || effects.length === 0) {
    return null;
  }

  return (
    <Points
      ref={pointsRef}
      positions={initialPositions}
      data-testid="blood-particles-3d"
    >
      <PointMaterial
        color={bloodColor}
        size={BLOOD_CONSTANTS.PARTICLE_SIZE}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </Points>
  );
};

export default BloodParticles3D;
