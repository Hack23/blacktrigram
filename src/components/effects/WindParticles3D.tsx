/**
 * WindParticles3D - Korean-themed wind particle system for Son (Wind) stance
 *
 * Creates swirling wind trails following Son technique strike paths with
 * authentic Korean cyberpunk aesthetic. Optimized for 60fps performance
 * using instanced rendering and object pooling.
 *
 * Features:
 * - Swirling particle motion along strike paths
 * - Korean cyberpunk color scheme (KOREAN_COLORS.TRIGRAM_SON_PRIMARY)
 * - Instance-based rendering for performance
 * - Physics-based particle lifetime and velocity
 * - Mobile-optimized particle counts
 * - Object pooling to reduce GC pressure
 *
 * @module components/effects/WindParticles3D
 * @category Combat Effects
 * @korean 바람입자3D - 손 자세 바람 입자 시스템
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants"; // eslint-disable-line no-restricted-imports -- This 3D effect component directly uses color constants
import { ThreeObjectPools } from "../../utils/threeObjectPool";

/**
 * Wind trail data for particle emission
 * 바람 궤적 데이터 (입자 방출용)
 */
interface WindTrail {
  /** Starting position of wind trail */
  position: THREE.Vector3;
  /** Direction vector of wind motion */
  direction: THREE.Vector3;
  /** Trail length in meters */
  length: number;
  /** Timestamp when trail was created */
  age: number;
  /** Whether vectors are pooled (for cleanup) */
  isPooled: boolean;
}

/**
 * Wind particle instance data
 * 바람 입자 인스턴스 데이터
 * 
 * PERFORMANCE: position and velocity use pooled Vector3 objects
 */
interface WindParticle {
  /** Current position [x, y, z] - POOLED Vector3 */
  position: THREE.Vector3;
  /** Current velocity [x, y, z] - POOLED Vector3 */
  velocity: THREE.Vector3;
  /** Swirl phase for circular motion (radians) */
  swirlPhase: number;
  /** Swirl radius in meters */
  swirlRadius: number;
  /** Particle lifetime in seconds */
  lifetime: number;
  /** Time elapsed since creation */
  age: number;
  /** Flag to track if vectors are pooled and need release */
  isPooled: boolean;
}

/**
 * Wind effect configuration
 * 바람 효과 설정
 */
export interface WindEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position in 3D world space */
  readonly position: [number, number, number];
  /** Strike direction for particle trail */
  readonly direction: [number, number, number];
  /** Effect intensity (0.0 to 1.0) */
  readonly intensity: number;
  /** Timestamp when effect was created */
  readonly startTime: number;
}

/**
 * Props for WindParticles3D component
 */
export interface WindParticles3DProps {
  /** Active wind effects to render */
  readonly effects: readonly WindEffect[];
  /** Whether to enable wind effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Performance and physics constants
 * 성능 및 물리 상수
 */
const WIND_CONSTANTS = {
  /** Maximum particles per effect */
  MAX_PARTICLES_DESKTOP: 150,
  MAX_PARTICLES_MOBILE: 50,
  /** Particle lifetime in seconds */
  PARTICLE_LIFETIME: 1.5,
  /** Effect trail lifetime in seconds */
  TRAIL_LIFETIME: 0.8,
  /** Base particle velocity (m/s) */
  BASE_VELOCITY: 3.0,
  /** Velocity spread factor */
  VELOCITY_SPREAD: 0.5,
  /** Swirl radius range (meters) */
  SWIRL_RADIUS_MIN: 0.05,
  SWIRL_RADIUS_MAX: 0.15,
  /** Swirl speed (radians/second) */
  SWIRL_SPEED: 4.0,
  /** Particle size */
  PARTICLE_SIZE: 0.04,
  /** Emission rate (particles per trail per second) */
  EMISSION_RATE: 100,
  /** Maximum per-frame delta time (seconds) */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * WindParticles3D Component
 *
 * Renders physics-based wind particles that swirl along Son (Wind) technique
 * strike paths. Uses instanced rendering for 60fps performance on mobile
 * and desktop.
 *
 * @example
 * ```tsx
 * const [windEffects, setWindEffects] = useState<WindEffect[]>([]);
 *
 * // On Son technique execution
 * const handleWindTechnique = (position: [number, number, number], direction: [number, number, number]) => {
 *   setWindEffects([...windEffects, {
 *     id: generateId(),
 *     position,
 *     direction,
 *     intensity: 1.0,
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <WindParticles3D
 *   effects={windEffects}
 *   enabled={visualEffects.wind}
 *   isMobile={isMobileDevice}
 *   onEffectComplete={(id) => {
 *     setWindEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const WindParticles3D: React.FC<WindParticles3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<WindParticle[]>([]);
  const [trails, setTrails] = useState<Map<string, WindTrail>>(new Map());
  const completedEffectsRef = useRef<Set<string>>(new Set());
  
  // Track particles and trails for cleanup
  const particlesRef = useRef<WindParticle[]>([]);
  const trailsRef = useRef<Map<string, WindTrail>>(new Map());

  // Reusable color object to avoid creating new THREE.Color on every frame
  // This significantly reduces GC pressure when rendering many particles
  const windColor = useMemo(
    () => new THREE.Color(KOREAN_COLORS.TRIGRAM_SON_PRIMARY),
    []
  );

  const maxParticles = isMobile
    ? WIND_CONSTANTS.MAX_PARTICLES_MOBILE
    : WIND_CONSTANTS.MAX_PARTICLES_DESKTOP;

  // Update refs when state changes
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    trailsRef.current = trails;
  }, [trails]);

  // Initialize wind trails from effects
  useEffect(() => {
    if (!enabled) return;

    const newTrails = new Map(trails);
    
    effects.forEach((effect) => {
      if (!newTrails.has(effect.id) && !completedEffectsRef.current.has(effect.id)) {
        // Acquire Vector3 objects from pool
        const position = ThreeObjectPools.vector3.acquire();
        const direction = ThreeObjectPools.vector3.acquire();
        
        position.set(effect.position[0], effect.position[1], effect.position[2]);
        direction.set(effect.direction[0], effect.direction[1], effect.direction[2]).normalize();
        
        newTrails.set(effect.id, {
          position,
          direction,
          length: 1.5 * effect.intensity, // Trail length based on intensity
          age: 0,
          isPooled: true,
        });
      }
    });

    setTrails(newTrails);
  }, [effects, enabled, trails]);

  // Emit particles along wind trails
  useFrame((_, delta) => {
    if (!enabled || trails.size === 0) return;

    const safeDelta = Math.min(delta, WIND_CONSTANTS.MAX_DELTA);
    const particlesToEmit = Math.floor(WIND_CONSTANTS.EMISSION_RATE * safeDelta);

    // Update existing particles
    const updatedParticles = particles
      .map((particle) => {
        particle.age += safeDelta;

        if (particle.age >= particle.lifetime) {
          // Release pooled vectors
          if (particle.isPooled) {
            ThreeObjectPools.vector3.release(particle.position);
            ThreeObjectPools.vector3.release(particle.velocity);
          }
          return null;
        }

        // Update swirl phase
        particle.swirlPhase += WIND_CONSTANTS.SWIRL_SPEED * safeDelta;

        // Calculate swirl offset
        const swirlX = Math.cos(particle.swirlPhase) * particle.swirlRadius;
        const swirlY = Math.sin(particle.swirlPhase) * particle.swirlRadius;

        // Update position with velocity and swirl
        particle.position.x += (particle.velocity.x + swirlX) * safeDelta;
        particle.position.y += (particle.velocity.y + swirlY) * safeDelta;
        particle.position.z += particle.velocity.z * safeDelta;

        return particle;
      })
      .filter((p): p is WindParticle => p !== null);

    // Emit new particles from active trails
    const newParticles: WindParticle[] = [];
    const updatedTrails = new Map(trails);
    const trailsToRemove: string[] = [];

    updatedTrails.forEach((trail, effectId) => {
      trail.age += safeDelta;

      if (trail.age >= WIND_CONSTANTS.TRAIL_LIFETIME) {
        trailsToRemove.push(effectId);
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);

        // Release pooled vectors
        if (trail.isPooled) {
          ThreeObjectPools.vector3.release(trail.position);
          ThreeObjectPools.vector3.release(trail.direction);
        }
        return;
      }

      // Emit particles along trail
      if (updatedParticles.length + newParticles.length < maxParticles) {
        for (let i = 0; i < particlesToEmit; i++) {
          const t = Math.random(); // Random position along trail
          const spreadAngle = (Math.random() - 0.5) * Math.PI / 4; // ±45° spread

          // Calculate emission position along trail
          const position = ThreeObjectPools.vector3.acquire();
          position.copy(trail.position).addScaledVector(trail.direction, t * trail.length);

          // Calculate velocity with spread
          const velocity = ThreeObjectPools.vector3.acquire();
          velocity.copy(trail.direction).multiplyScalar(WIND_CONSTANTS.BASE_VELOCITY);
          
          // Add perpendicular spread
          const perpendicular = ThreeObjectPools.vector3.acquire();
          perpendicular.set(-trail.direction.z, 0, trail.direction.x).normalize();
          velocity.addScaledVector(perpendicular, Math.sin(spreadAngle) * WIND_CONSTANTS.VELOCITY_SPREAD);
          ThreeObjectPools.vector3.release(perpendicular);

          newParticles.push({
            position,
            velocity,
            swirlPhase: Math.random() * Math.PI * 2,
            swirlRadius:
              WIND_CONSTANTS.SWIRL_RADIUS_MIN +
              Math.random() * (WIND_CONSTANTS.SWIRL_RADIUS_MAX - WIND_CONSTANTS.SWIRL_RADIUS_MIN),
            lifetime: WIND_CONSTANTS.PARTICLE_LIFETIME,
            age: 0,
            isPooled: true,
          });
        }
      }
    });

    // Remove completed trails
    trailsToRemove.forEach((id) => updatedTrails.delete(id));
    setTrails(updatedTrails);

    // Update particles state
    setParticles([...updatedParticles, ...newParticles]);

    // Update Points geometry
    if (pointsRef.current && updatedParticles.length > 0) {
      const positions = new Float32Array(updatedParticles.length * 3);
      const colors = new Float32Array(updatedParticles.length * 3);

      updatedParticles.forEach((particle, i) => {
        const i3 = i * 3;
        positions[i3] = particle.position.x;
        positions[i3 + 1] = particle.position.y;
        positions[i3 + 2] = particle.position.z;

        // Fade color based on age using pre-allocated color object
        const alpha = 1.0 - particle.age / particle.lifetime;
        colors[i3] = windColor.r * alpha;
        colors[i3 + 1] = windColor.g * alpha;
        colors[i3 + 2] = windColor.b * alpha;
      });

      const geometry = pointsRef.current.geometry;
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }
  });

  // Cleanup on unmount - uses refs to access latest state
  useEffect(() => {
    return () => {
      // Release all pooled vectors from latest particles
      particlesRef.current.forEach((particle) => {
        if (particle.isPooled) {
          ThreeObjectPools.vector3.release(particle.position);
          ThreeObjectPools.vector3.release(particle.velocity);
        }
      });

      // Release all pooled vectors from latest trails
      trailsRef.current.forEach((trail) => {
        if (trail.isPooled) {
          ThreeObjectPools.vector3.release(trail.position);
          ThreeObjectPools.vector3.release(trail.direction);
        }
      });
    };
  }, []); // Empty deps OK - refs always have latest values

  if (!enabled || particles.length === 0) return null;

  return (
    <Points ref={pointsRef}>
      <bufferGeometry />
      <PointMaterial
        vertexColors
        size={WIND_CONSTANTS.PARTICLE_SIZE}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};
