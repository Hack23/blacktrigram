/**
 * WaterWave3D - Wave particle burst for Gam (Water) counter techniques
 *
 * Creates flowing wave particles that burst outward during counter-attack
 * techniques, visualizing the redirection of opponent's force. Particles
 * flow in curved trajectories mimicking water splashing and flowing.
 *
 * Used for:
 * - gam_water_counter (수류반격) - Adaptive flow burst
 * - gam_circular_parry (원형받기) - Circular flowing waves
 * - gam_wrist_twist_counter (손목비틀기반격) - Reactive splash
 *
 * PERFORMANCE OPTIMIZATION (Object Pooling):
 * - Uses ThreeObjectPools for all Vector3 allocations
 * - Instanced particle rendering
 * - Target: 60fps with up to 5 simultaneous wave effects
 *
 * Features:
 * - Flowing water particle trajectories
 * - Counter timing window visualization
 * - Perfect counter enhanced effects
 * - Korean cyberpunk cyan coloring
 * - Flow type-specific patterns
 *
 * @module components/combat/WaterWave3D
 * @category Combat Effects - Water (감괘)
 * @korean 물결파동3D
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { ThreeObjectPools } from "../../../../../utils/threeObjectPool";

/**
 * Water wave effect data for counter techniques
 * 물결 파동 효과 데이터 (반격 기술)
 */
export interface WaterWaveEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position (counter impact point) */
  readonly position: [number, number, number];
  /** Direction of wave burst (opponent's force vector) */
  readonly direction: [number, number, number];
  /** Flow type determines particle pattern */
  readonly flowType: "adaptive" | "flowing" | "reactive";
  /** Whether this was a perfect counter (enhanced effect) */
  readonly isPerfect: boolean;
  /** Timestamp when effect was created */
  readonly startTime: number;
  /** Intensity multiplier (0.0 to 1.0) */
  readonly intensity?: number;
}

/**
 * Props for WaterWave3D component
 */
export interface WaterWave3DProps {
  /** Active wave effects to render */
  readonly effects: readonly WaterWaveEffect[];
  /** Whether to enable wave effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Individual water particle
 */
interface WaterParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  lifetime: number;
  size: number;
  /** Curve parameter for flowing trajectory */
  curveT: number;
  /** Curve tangent vector */
  curveTangent: THREE.Vector3;
  /** Flag indicating if vectors are from object pool */
  isPooled: boolean;
}

/**
 * Performance and physics constants
 * 성능 및 물리 상수
 */
const WAVE_CONSTANTS = {
  /** Particle count based on flow type and platform */
  PARTICLES_DESKTOP: {
    adaptive: 40, // Moderate particle count
    flowing: 50, // More particles for smooth flow
    reactive: 30, // Fewer, faster particles
  },
  PARTICLES_MOBILE: {
    adaptive: 20,
    flowing: 25,
    reactive: 15,
  },
  /** Perfect counter particle multiplier */
  PERFECT_MULTIPLIER: 1.5,
  /** Particle lifetime (seconds) */
  LIFETIME: {
    adaptive: 1.5,
    flowing: 2.0, // Longer for flowing motion
    reactive: 1.2, // Shorter for quick response
  },
  /** Initial velocity range (m/s) */
  VELOCITY_MIN: {
    adaptive: 2.5,
    flowing: 2.0,
    reactive: 3.5,
  },
  VELOCITY_MAX: {
    adaptive: 4.0,
    flowing: 3.5,
    reactive: 5.0,
  },
  /** Particle size range */
  SIZE_MIN: 0.06,
  SIZE_MAX: 0.12,
  SIZE_PERFECT: 0.15, // Perfect counter particles larger
  /** Spread angle (radians) */
  SPREAD_ANGLE: Math.PI / 3, // 60 degrees
  /** Gravity for water particles (lighter than normal) */
  GRAVITY: -4.0,
  /** Curve intensity for flowing trajectories */
  CURVE_INTENSITY: {
    adaptive: 0.8,
    flowing: 1.2, // Most curved
    reactive: 0.5, // Least curved
  },
  /** Maximum delta time for physics stability */
  MAX_DELTA: 1 / 30,
  /** Colors by flow type */
  COLORS: {
    adaptive: KOREAN_COLORS.PRIMARY_CYAN, // 0x00e6e6
    flowing: 0x00ccff, // Light cyan
    reactive: 0x00ffff, // Bright cyan
    perfect: KOREAN_COLORS.ACCENT_GOLD, // Gold for perfect counters
  },
} as const;

/**
 * Generate water wave particles
 * PERFORMANCE: Uses ThreeObjectPools to eliminate Vector3 allocations
 */
const generateWaveParticles = (
  effect: WaterWaveEffect,
  particleCount: number
): WaterParticle[] => {
  const particles: WaterParticle[] = [];
  const intensity = effect.intensity ?? 1.0;

  const tempOrigin = ThreeObjectPools.vector3.acquire();
  const tempDirection = ThreeObjectPools.vector3.acquire();
  const tempVelocity = ThreeObjectPools.vector3.acquire();
  const tempTangent = ThreeObjectPools.vector3.acquire();

  try {
    tempOrigin.set(...effect.position);
    tempDirection.set(...effect.direction).normalize();

    const perpX = ThreeObjectPools.vector3.acquire();
    const perpY = ThreeObjectPools.vector3.acquire();

    try {
      if (Math.abs(tempDirection.y) < 0.9) {
        perpX.set(0, 1, 0).cross(tempDirection).normalize();
      } else {
        perpX.set(1, 0, 0).cross(tempDirection).normalize();
      }
      perpY.copy(tempDirection).cross(perpX).normalize();

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.random() - 0.5) * WAVE_CONSTANTS.SPREAD_ANGLE;
        const elevation = (Math.random() - 0.3) * (WAVE_CONSTANTS.SPREAD_ANGLE / 2);

        tempVelocity.copy(tempDirection);
        tempVelocity
          .addScaledVector(perpX, Math.sin(angle))
          .addScaledVector(perpY, Math.sin(elevation))
          .normalize();

        const speed =
          (WAVE_CONSTANTS.VELOCITY_MIN[effect.flowType] +
            Math.random() *
              (WAVE_CONSTANTS.VELOCITY_MAX[effect.flowType] -
                WAVE_CONSTANTS.VELOCITY_MIN[effect.flowType])) *
          intensity;

        tempVelocity.multiplyScalar(speed);

        const curveFactor = WAVE_CONSTANTS.CURVE_INTENSITY[effect.flowType];
        tempTangent.set(
          (Math.random() - 0.5) * curveFactor,
          Math.random() * curveFactor,
          (Math.random() - 0.5) * curveFactor
        );

        const size = effect.isPerfect
          ? WAVE_CONSTANTS.SIZE_PERFECT
          : WAVE_CONSTANTS.SIZE_MIN +
            Math.random() * (WAVE_CONSTANTS.SIZE_MAX - WAVE_CONSTANTS.SIZE_MIN);

        const particlePosition = ThreeObjectPools.vector3.acquire();
        const particleVelocity = ThreeObjectPools.vector3.acquire();
        const particleTangent = ThreeObjectPools.vector3.acquire();

        particlePosition.copy(tempOrigin);
        particleVelocity.copy(tempVelocity);
        particleTangent.copy(tempTangent);

        particles.push({
          position: particlePosition,
          velocity: particleVelocity,
          age: 0,
          lifetime: WAVE_CONSTANTS.LIFETIME[effect.flowType],
          size,
          curveT: 0,
          curveTangent: particleTangent,
          isPooled: true, // Mark for cleanup
        });
      }
    } finally {
      ThreeObjectPools.vector3.release(perpX);
      ThreeObjectPools.vector3.release(perpY);
    }
  } finally {
    ThreeObjectPools.vector3.release(tempOrigin);
    ThreeObjectPools.vector3.release(tempDirection);
    ThreeObjectPools.vector3.release(tempVelocity);
    ThreeObjectPools.vector3.release(tempTangent);
  }

  return particles;
};

/**
 * WaterWave3D Component
 * Renders water wave particles for counter techniques
 */
export const WaterWave3D: React.FC<WaterWave3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const particleSystems = useMemo(() => {
    if (!enabled || effects.length === 0) return [];

    return effects.map((effect) => {
      let particleCount =
        (isMobile
          ? WAVE_CONSTANTS.PARTICLES_MOBILE[effect.flowType]
          : WAVE_CONSTANTS.PARTICLES_DESKTOP[effect.flowType]) *
        (effect.intensity ?? 1.0);

      if (effect.isPerfect) {
        particleCount = Math.round(particleCount * WAVE_CONSTANTS.PERFECT_MULTIPLIER);
      }

      return {
        effectId: effect.id,
        flowType: effect.flowType,
        isPerfect: effect.isPerfect,
        particles: generateWaveParticles(effect, particleCount),
        color: effect.isPerfect
          ? WAVE_CONSTANTS.COLORS.perfect
          : WAVE_CONSTANTS.COLORS[effect.flowType],
      };
    });
  }, [effects, enabled, isMobile]);
  
  const positionsRef = useRef<Map<string, Float32Array>>(new Map());
  
  const activeParticlesRef = useRef<Map<string, WaterParticle[]>>(new Map());
  
  useEffect(() => {
    particleSystems.forEach((system) => {
      activeParticlesRef.current.set(system.effectId, [...system.particles]);
    });
  }, [particleSystems]);
  
  useEffect(() => {
    const activeParticles = activeParticlesRef.current;
    const positions = positionsRef.current;
    
    return () => {
      activeParticles.forEach((particles) => {
        particles.forEach((particle) => {
          if (particle.isPooled) {
            ThreeObjectPools.vector3.release(particle.position);
            ThreeObjectPools.vector3.release(particle.velocity);
            ThreeObjectPools.vector3.release(particle.curveTangent);
            particle.isPooled = false; // Mark as released to prevent double-release
          }
        });
      });
      
      activeParticles.clear();
      positions.clear();
    };
  }, [particleSystems]);

  useFrame((_state, delta) => {
    if (!enabled) return;

    const safeDelta = Math.min(delta, WAVE_CONSTANTS.MAX_DELTA);

    particleSystems.forEach((system) => {
      const activeParticles = activeParticlesRef.current.get(system.effectId);
      if (!activeParticles) return;
      
      let allExpired = true;
      
      const expiredIndices: number[] = [];

      activeParticles.forEach((particle, index) => {
        particle.age += safeDelta;

        if (particle.age < particle.lifetime) {
          allExpired = false;

          particle.curveT += safeDelta / particle.lifetime;

          const curveFactor = Math.sin(particle.curveT * Math.PI);
          particle.velocity.addScaledVector(
            particle.curveTangent,
            curveFactor * safeDelta * 2
          );

          particle.velocity.y += WAVE_CONSTANTS.GRAVITY * safeDelta;

          particle.position.addScaledVector(particle.velocity, safeDelta);
        } else {
          expiredIndices.push(index);
        }
      });
      
      for (let i = expiredIndices.length - 1; i >= 0; i--) {
        const particle = activeParticles[expiredIndices[i]];
        if (particle.isPooled) {
          ThreeObjectPools.vector3.release(particle.position);
          ThreeObjectPools.vector3.release(particle.velocity);
          ThreeObjectPools.vector3.release(particle.curveTangent);
          particle.isPooled = false; // Prevent double-release
        }
        activeParticles.splice(expiredIndices[i], 1); // Safe: mutating tracked copy, not memoized
      }

      if (allExpired && onEffectComplete) {
        onEffectComplete(system.effectId);
      }
    });
    
    particleSystems.forEach((system) => {
      const activeParticles = activeParticlesRef.current.get(system.effectId);
      if (!activeParticles) return;
      
      let positions = positionsRef.current.get(system.effectId);
      
      if (!positions) {
        const maxParticles = system.particles.length; // Initial count is max
        positions = new Float32Array(maxParticles * 3);
        positionsRef.current.set(system.effectId, positions);
      }
      
      activeParticles.forEach((particle, i) => {
        const i3 = i * 3;
        positions[i3] = particle.position.x;
        positions[i3 + 1] = particle.position.y;
        positions[i3 + 2] = particle.position.z;
      });
    });
  });

  if (!enabled || particleSystems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Reading ref during render for Three.js performance optimization - positions updated in useFrame */}
      {/* eslint-disable react-hooks/refs */}
      {particleSystems.map((system) => {
        let positions = positionsRef.current.get(system.effectId);
        if (!positions) {
          positions = new Float32Array(system.particles.length * 3);
          positionsRef.current.set(system.effectId, positions);
        }
        
        const activeParticles = activeParticlesRef.current.get(system.effectId);
        const activeCount = activeParticles ? activeParticles.length : system.particles.length;
        
        return (
          <Points 
            key={system.effectId} 
            positions={positions}
            limit={activeCount} // Only render active particles
            data-testid="water-wave-3d"
          >
            <PointMaterial
              color={system.color}
              size={WAVE_CONSTANTS.SIZE_MAX}
              sizeAttenuation
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </Points>
        );
      })}
      {/* eslint-enable react-hooks/refs */}
    </>
  );
};

/**
 * Default export for lazy loading
 */
export default WaterWave3D;
