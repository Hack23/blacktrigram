/**
 * DustClouds3D - Environmental dust particle effects for movement and impacts
 *
 * Creates realistic dust clouds that billow from footfalls, strikes, and ground impacts.
 * Uses physics-based particle simulation with air resistance and settling behavior.
 *
 * Features:
 * - Billowing dust cloud simulation
 * - Air resistance and gravity physics
 * - Settles to floor over time
 * - Radial expansion pattern
 * - Korean gray/brown earth tones
 * - Mobile performance optimization
 *
 * @module components/combat/DustClouds3D
 * @category Combat Effects
 * @korean 먼지구름3D
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";

/**
 * Dust cloud effect data
 */
export interface DustCloudEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position in 3D world space */
  readonly position: [number, number, number];
  /** Intensity of dust (0.0 to 1.0) - affects particle count and spread */
  readonly intensity: number;
  /** Timestamp when effect was created */
  readonly startTime: number;
  /** Type of dust event */
  readonly type: "footfall" | "impact" | "block" | "slide";
}

/**
 * Props for DustClouds3D component
 */
export interface DustClouds3DProps {
  /** Active dust cloud effects to render */
  readonly effects: readonly DustCloudEffect[];
  /** Whether to enable dust effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Individual dust particle
 */
interface DustParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  lifetime: number;
  size: number;
}

/**
 * Performance and physics constants
 */
const DUST_CONSTANTS = {
  /** Gravity acceleration for dust (m/s²) - lighter than blood */
  GRAVITY: -3.0,
  /** Air resistance coefficient */
  AIR_RESISTANCE: 0.95,
  /** Base particle count */
  PARTICLES_DESKTOP: {
    footfall: 30,
    impact: 60,
    block: 40,
    slide: 50,
  },
  PARTICLES_MOBILE: {
    footfall: 15,
    impact: 30,
    block: 20,
    slide: 25,
  },
  /** Particle lifetime in seconds */
  LIFETIME: 3.0,
  /** Initial velocity range (m/s) */
  VELOCITY_MIN: 0.5,
  VELOCITY_MAX: 2.0,
  /** Particle size range */
  SIZE_MIN: 0.05,
  SIZE_MAX: 0.15,
  /** Spread radius */
  SPREAD_RADIUS: 1.5,
  /** Floor Y position */
  FLOOR_Y: 0.0,
  /** Maximum delta time for physics stability */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Generate dust particles in billowing cloud pattern
 */
const generateDustParticles = (
  effect: DustCloudEffect,
  particleCount: number
): DustParticle[] => {
  const particles: DustParticle[] = [];
  const origin = new THREE.Vector3(...effect.position);

  // Ensure origin is at or near floor level for dust
  origin.y = Math.max(origin.y, DUST_CONSTANTS.FLOOR_Y + 0.1);

  for (let i = 0; i < particleCount; i++) {
    // Random position in horizontal circle near origin
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * DUST_CONSTANTS.SPREAD_RADIUS * effect.intensity;
    const offset = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.random() * 0.3, // Slight vertical variation
      Math.sin(angle) * radius
    );

    // Mostly horizontal velocity with slight upward component
    const velocityAngle = angle + (Math.random() - 0.5) * 0.3;
    const horizontalSpeed =
      DUST_CONSTANTS.VELOCITY_MIN +
      Math.random() * (DUST_CONSTANTS.VELOCITY_MAX - DUST_CONSTANTS.VELOCITY_MIN);
    const upwardSpeed = Math.random() * 0.5 * effect.intensity;

    const velocity = new THREE.Vector3(
      Math.cos(velocityAngle) * horizontalSpeed,
      upwardSpeed,
      Math.sin(velocityAngle) * horizontalSpeed
    );

    particles.push({
      position: origin.clone().add(offset),
      velocity,
      age: 0,
      lifetime: DUST_CONSTANTS.LIFETIME * (0.8 + Math.random() * 0.4),
      size:
        DUST_CONSTANTS.SIZE_MIN +
        Math.random() * (DUST_CONSTANTS.SIZE_MAX - DUST_CONSTANTS.SIZE_MIN),
    });
  }

  return particles;
};

/**
 * DustClouds3D Component
 *
 * Renders billowing dust cloud effects for movement and combat impacts.
 * Particles expand radially, rise slightly, then settle to the floor.
 *
 * @example
 * ```tsx
 * const [dustEffects, setDustEffects] = useState<DustCloudEffect[]>([]);
 *
 * // On footfall
 * const handleFootfall = (position: [number, number, number]) => {
 *   setDustEffects([...dustEffects, {
 *     id: generateId(),
 *     position,
 *     intensity: 0.5,
 *     type: 'footfall',
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <DustClouds3D
 *   effects={dustEffects}
 *   enabled={visualEffects.dust}
 *   isMobile={isMobile}
 *   onEffectComplete={(id) => {
 *     setDustEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const DustClouds3D: React.FC<DustClouds3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  // Particle system state
  const particlesRef = useRef<Map<string, DustParticle[]>>(new Map());
  const pointsRef = useRef<THREE.Points>(null);
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Performance configuration
  const getParticleCount = (effect: DustCloudEffect): number => {
    const counts = isMobile
      ? DUST_CONSTANTS.PARTICLES_MOBILE
      : DUST_CONSTANTS.PARTICLES_DESKTOP;
    return Math.floor(counts[effect.type] * effect.intensity);
  };

  // Calculate max particles needed
  const maxParticles = useMemo(() => {
    const maxCounts = isMobile
      ? DUST_CONSTANTS.PARTICLES_MOBILE
      : DUST_CONSTANTS.PARTICLES_DESKTOP;
    return Math.max(...Object.values(maxCounts));
  }, [isMobile]);

  // Dust color - Korean earth tones
  const dustColor = useMemo(() => KOREAN_COLORS.UI_STEEL_GRAY, []);

  // Initialize particles for new effects
  useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!particlesRef.current.has(effect.id)) {
        const particleCount = getParticleCount(effect);
        const particles = generateDustParticles(effect, particleCount);
        particlesRef.current.set(effect.id, particles);
      }
    });

    // Clean up removed effects
    const effectIds = new Set(effects.map((e) => e.id));
    particlesRef.current.forEach((_, id) => {
      if (!effectIds.has(id)) {
        particlesRef.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });
  }, [effects, enabled, isMobile, getParticleCount]);

  // Initial positions for buffer (updated in useFrame)
  const initialPositions = useMemo(() => {
    const positions = new Float32Array(maxParticles * 3);
    return positions;
  }, [maxParticles]);

  // Physics update loop
  useFrame((_, delta) => {
    if (!enabled || !pointsRef.current) return;

    const safeDelta = Math.min(delta, DUST_CONSTANTS.MAX_DELTA);

    let totalParticleIndex = 0;
    const attr = pointsRef.current.geometry.attributes.position;
    const posArray = attr.array as Float32Array;

    // Update all active dust particles
    particlesRef.current.forEach((particles, effectId) => {
      let hasActiveParticles = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age += safeDelta;

        if (p.age < p.lifetime) {
          hasActiveParticles = true;

          // Apply gravity (lighter than other particles)
          p.velocity.y += DUST_CONSTANTS.GRAVITY * safeDelta;

          // Apply air resistance
          p.velocity.multiplyScalar(DUST_CONSTANTS.AIR_RESISTANCE);

          // Update position
          p.position.addScaledVector(p.velocity, safeDelta);

          // Floor collision - settle on floor
          if (p.position.y <= DUST_CONSTANTS.FLOOR_Y) {
            p.position.y = DUST_CONSTANTS.FLOOR_Y;
            p.velocity.y = 0;
            p.velocity.x *= 0.9; // Sliding friction
            p.velocity.z *= 0.9;
          }

          // Update render position
          if (totalParticleIndex < posArray.length / 3) {
            posArray[totalParticleIndex * 3] = p.position.x;
            posArray[totalParticleIndex * 3 + 1] = p.position.y;
            posArray[totalParticleIndex * 3 + 2] = p.position.z;
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
      data-testid="dust-clouds-3d"
    >
      <PointMaterial
        color={dustColor}
        size={DUST_CONSTANTS.SIZE_MIN * 1.5}
        sizeAttenuation
        transparent
        opacity={0.4} // Semi-transparent for dust effect
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </Points>
  );
};

export default DustClouds3D;
