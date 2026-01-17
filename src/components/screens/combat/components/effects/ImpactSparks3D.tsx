/**
 * ImpactSparks3D - High-energy spark particle effects for critical hits
 *
 * Creates radial burst of golden/cyan spark particles that explode outward
 * from impact points. Uses additive blending for glowing Korean cyberpunk aesthetic.
 *
 * Features:
 * - Radial explosion pattern
 * - Additive blending for glow effect
 * - Korean gold/cyan color theming
 * - Gravity-based physics
 * - Critical hit intensity scaling
 * - Mobile performance optimization
 *
 * @module components/combat/ImpactSparks3D
 * @category Combat Effects
 * @korean 충격불꽃3D
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";

/**
 * Impact spark effect data
 */
export interface ImpactSparkEffect {
  /** Unique identifier */
  readonly id: string;
  /** Impact position in 3D world space */
  readonly position: [number, number, number];
  /** Whether this is a critical hit (more particles, gold color) */
  readonly isCritical: boolean;
  /** Timestamp when effect was created */
  readonly startTime: number;
  /** Optional intensity multiplier (0.0 to 1.0) */
  readonly intensity?: number;
}

/**
 * Props for ImpactSparks3D component
 */
export interface ImpactSparks3DProps {
  /** Active spark effects to render */
  readonly effects: readonly ImpactSparkEffect[];
  /** Whether to enable spark effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Individual spark particle
 */
interface SparkParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  lifetime: number;
}

/**
 * Performance and physics constants
 */
const SPARK_CONSTANTS = {
  /** Gravity acceleration for sparks (m/s²) */
  GRAVITY: -9.8,
  /** Base particle count for normal hits */
  PARTICLES_NORMAL_DESKTOP: 50,
  PARTICLES_NORMAL_MOBILE: 25,
  /** Critical hit particle count */
  PARTICLES_CRITICAL_DESKTOP: 100,
  PARTICLES_CRITICAL_MOBILE: 50,
  /** Particle lifetime in seconds */
  LIFETIME: 1.5,
  /** Initial velocity range (m/s) */
  VELOCITY_MIN: 3.0,
  VELOCITY_MAX: 6.0,
  /** Particle size */
  SIZE_NORMAL: 0.08,
  SIZE_CRITICAL: 0.12,
  /** Maximum delta time for physics stability */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Generate spark particles in radial explosion pattern
 */
const generateSparkParticles = (
  effect: ImpactSparkEffect,
  particleCount: number
): SparkParticle[] => {
  const particles: SparkParticle[] = [];
  const origin = new THREE.Vector3(...effect.position);
  const intensity = effect.intensity ?? 1.0;

  for (let i = 0; i < particleCount; i++) {
    // Radial explosion pattern
    const angle = (Math.PI * 2 * i) / particleCount;
    const elevation = (Math.random() - 0.3) * Math.PI * 0.4; // Slightly upward bias

    // Calculate direction
    const horizontalSpeed = Math.cos(elevation);
    const direction = new THREE.Vector3(
      Math.cos(angle) * horizontalSpeed,
      Math.sin(elevation),
      Math.sin(angle) * horizontalSpeed
    );

    // Random speed with intensity scaling
    const speed =
      (SPARK_CONSTANTS.VELOCITY_MIN +
        Math.random() *
          (SPARK_CONSTANTS.VELOCITY_MAX - SPARK_CONSTANTS.VELOCITY_MIN)) *
      intensity;

    particles.push({
      position: origin.clone(),
      velocity: direction.multiplyScalar(speed),
      age: 0,
      lifetime: SPARK_CONSTANTS.LIFETIME,
    });
  }

  return particles;
};

/**
 * ImpactSparks3D Component
 *
 * Renders high-energy spark effects for combat impacts using radial particle bursts.
 * Critical hits use Korean gold color with more particles for enhanced visual feedback.
 *
 * @example
 * ```tsx
 * const [sparkEffects, setSparkEffects] = useState<ImpactSparkEffect[]>([]);
 *
 * // On critical hit
 * const handleCriticalHit = (position: [number, number, number]) => {
 *   setSparkEffects([...sparkEffects, {
 *     id: generateId(),
 *     position,
 *     isCritical: true,
 *     intensity: 1.0,
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <ImpactSparks3D
 *   effects={sparkEffects}
 *   enabled={true}
 *   isMobile={isMobile}
 *   onEffectComplete={(id) => {
 *     setSparkEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const ImpactSparks3D: React.FC<ImpactSparks3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  // Particle system state
  const particlesRef = useRef<Map<string, SparkParticle[]>>(new Map());
  const pointsRef = useRef<THREE.Points>(null);
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Calculate max particles needed
  const maxParticles = useMemo(() => {
    return isMobile
      ? SPARK_CONSTANTS.PARTICLES_CRITICAL_MOBILE
      : SPARK_CONSTANTS.PARTICLES_CRITICAL_DESKTOP;
  }, [isMobile]);

  // Spark color - gold for critical, cyan for normal
  const sparkColor = useMemo(
    () => ({
      critical: KOREAN_COLORS.ACCENT_GOLD,
      normal: KOREAN_COLORS.PRIMARY_CYAN,
    }),
    []
  );

  // Initialize particles for new effects
  useEffect(() => {
    if (!enabled) return;

    // Performance configuration - moved inside useEffect to avoid dependency issues
    const getParticleCount = (effect: ImpactSparkEffect): number => {
      if (effect.isCritical) {
        return isMobile
          ? SPARK_CONSTANTS.PARTICLES_CRITICAL_MOBILE
          : SPARK_CONSTANTS.PARTICLES_CRITICAL_DESKTOP;
      }
      return isMobile
        ? SPARK_CONSTANTS.PARTICLES_NORMAL_MOBILE
        : SPARK_CONSTANTS.PARTICLES_NORMAL_DESKTOP;
    };

    effects.forEach((effect) => {
      if (!particlesRef.current.has(effect.id)) {
        const particleCount = getParticleCount(effect);
        const particles = generateSparkParticles(effect, particleCount);
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
  }, [effects, enabled, isMobile]);

  // Initial positions for buffer (updated in useFrame)
  const initialPositions = useMemo(() => {
    const positions = new Float32Array(maxParticles * 3);
    // Start with zeros - actual positions set in useFrame
    return positions;
  }, [maxParticles]);

  // Physics update loop
  useFrame((_, delta) => {
    if (!enabled || !pointsRef.current) return;

    const safeDelta = Math.min(delta, SPARK_CONSTANTS.MAX_DELTA);

    let totalParticleIndex = 0;
    const attr = pointsRef.current.geometry.attributes.position;
    const posArray = attr.array as Float32Array;

    // Update all active spark particles
    particlesRef.current.forEach((particles, effectId) => {
      let hasActiveParticles = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age += safeDelta;

        if (p.age < p.lifetime) {
          hasActiveParticles = true;

          // Apply gravity
          p.velocity.y += SPARK_CONSTANTS.GRAVITY * safeDelta;

          // Update position
          p.position.addScaledVector(p.velocity, safeDelta);

          // Air resistance
          p.velocity.multiplyScalar(0.98);

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

  // Determine color based on most recent effect
  const latestEffect = effects[effects.length - 1];
  const currentColor = latestEffect?.isCritical
    ? sparkColor.critical
    : sparkColor.normal;
  const currentSize = latestEffect?.isCritical
    ? SPARK_CONSTANTS.SIZE_CRITICAL
    : SPARK_CONSTANTS.SIZE_NORMAL;

  return (
    <Points
      ref={pointsRef}
      positions={initialPositions}
      data-testid="impact-sparks-3d"
    >
      <PointMaterial
        color={currentColor}
        size={currentSize}
        sizeAttenuation
        transparent
        opacity={1.0}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Glowing effect for Korean cyberpunk aesthetic
      />
    </Points>
  );
};

export default ImpactSparks3D;
