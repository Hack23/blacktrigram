/**
 * ArterialSpray3D - High-pressure arterial blood jet particle system
 *
 * Simulates arterial blood spray from vital point strikes on major arteries
 * (carotid, femoral, brachial, subclavian). Features pulsating high-velocity
 * jets synchronized with heart rate for brutal realism.
 *
 * Features:
 * - High-pressure jet physics (10-15 m/s vs regular 2-5 m/s)
 * - Narrow spray cone (15° vs 45° regular)
 * - Pulsating intensity (1.2 Hz heart rate simulation)
 * - 3-5 second sustained spray duration
 * - Mobile-optimized particle counts
 *
 * @module components/combat/ArterialSpray3D
 * @category Combat Effects
 * @korean 동맥분사3D
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";

/**
 * Arterial vital point types for targeted strikes
 * 동맥 급소 유형
 */
export type ArterialVitalPoint =
  | "carotid" // 경동맥 - Neck artery
  | "femoral" // 대퇴동맥 - Thigh artery
  | "brachial" // 상완동맥 - Upper arm artery
  | "subclavian"; // 쇄골하동맥 - Below collarbone artery

/**
 * Arterial spray effect configuration
 */
export interface ArterialSprayEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position in 3D world space */
  readonly position: [number, number, number];
  /** Spray direction (normalized) */
  readonly direction: [number, number, number];
  /** Type of artery struck */
  readonly vitalPoint: ArterialVitalPoint;
  /** Blood pressure intensity (0.5-1.0) - affects velocity */
  readonly pressure: number;
  /** Whether to enable pulsating spray */
  readonly pulsating: boolean;
  /** Timestamp when effect was created */
  readonly startTime: number;
}

/**
 * Props for ArterialSpray3D component
 */
export interface ArterialSpray3DProps {
  /** Active arterial spray effects to render */
  readonly effects: readonly ArterialSprayEffect[];
  /** Whether to enable arterial blood effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced particle count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Arterial spray physics constants
 * 동맥 분사 물리 상수
 */
const ARTERIAL_CONSTANTS = {
  /** High-velocity range (m/s) - 3x faster than regular blood */
  VELOCITY_MIN: 10,
  VELOCITY_MAX: 15,
  /** Narrow spray cone angle (radians) - focused jet */
  SPRAY_CONE_ANGLE: Math.PI / 12, // 15 degrees
  /** Heart beat frequency (Hz) for pulsing */
  PULSE_FREQUENCY: 1.2, // 72 bpm
  /** Pulse intensity variation (0-1) */
  PULSE_AMPLITUDE: 0.4,
  /** Spray duration (seconds) */
  DURATION: 5.0,
  /** Gravity acceleration (m/s²) */
  GRAVITY: -9.8,
  /** Air resistance coefficient */
  AIR_RESISTANCE: 0.97,
  /** Floor Y position */
  FLOOR_Y: 0,
  /** Pool lifetime after settling (seconds) */
  POOL_LIFETIME: 10,
  /** Fade-out duration for pools (seconds) */
  POOL_FADE: 2,
  /** Particle counts */
  MAX_PARTICLES_DESKTOP: 250,
  MAX_PARTICLES_MOBILE: 120,
  /** Particle size range */
  PARTICLE_SIZE_MIN: 0.06,
  PARTICLE_SIZE_MAX: 0.12,
  /** Max delta time to prevent physics explosion */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Arterial particle data structure
 */
interface ArterialParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  lifetime: number;
  settled: boolean;
  size: number;
}

/**
 * Effect instance tracking
 */
interface EffectInstance {
  particles: ArterialParticle[];
  startTime: number;
  effect: ArterialSprayEffect;
}

/**
 * ArterialSpray3D Component
 *
 * Renders high-pressure arterial blood jets from vital point strikes
 *
 * @example
 * ```tsx
 * <ArterialSpray3D
 *   effects={arterialEffects}
 *   enabled={settings.blood}
 *   isMobile={isMobile}
 *   onEffectComplete={handleEffectComplete}
 * />
 * ```
 */
export const ArterialSpray3D: React.FC<ArterialSpray3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const effectInstancesRef = useRef<Map<string, EffectInstance>>(new Map());
  const pointsRef = useRef<THREE.Points>(null);

  // Get particle count based on device
  const maxParticles = isMobile
    ? ARTERIAL_CONSTANTS.MAX_PARTICLES_MOBILE
    : ARTERIAL_CONSTANTS.MAX_PARTICLES_DESKTOP;

  // Initialize particle buffers
  const { positionArray, sizeArray, opacityArray } = useMemo(() => {
    const maxTotal = maxParticles * 10; // Support up to 10 simultaneous effects
    return {
      positionArray: new Float32Array(maxTotal * 3),
      sizeArray: new Float32Array(maxTotal),
      opacityArray: new Float32Array(maxTotal),
    };
  }, [maxParticles]);

  // Create new effect instances
  React.useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!effectInstancesRef.current.has(effect.id)) {
        // Calculate particle count based on artery type
        const arterySizeMultiplier = effect.vitalPoint === "carotid" ? 1.2 : 1.0;
        const particleCount = Math.floor(maxParticles * arterySizeMultiplier);

        // Initialize particles in narrow jet pattern
        const particles: ArterialParticle[] = [];
        const dir = new THREE.Vector3(...effect.direction).normalize();

        for (let i = 0; i < particleCount; i++) {
          // Random angle within spray cone
          const theta = Math.random() * Math.PI * 2;
          const phi =
            Math.random() * ARTERIAL_CONSTANTS.SPRAY_CONE_ANGLE;

          // Convert to velocity direction
          const velocity = dir.clone();
          velocity.applyAxisAngle(
            new THREE.Vector3(0, 1, 0).cross(dir).normalize(),
            phi
          );
          velocity.applyAxisAngle(dir, theta);

          // High-velocity arterial spray
          const speed =
            ARTERIAL_CONSTANTS.VELOCITY_MIN +
            Math.random() *
              (ARTERIAL_CONSTANTS.VELOCITY_MAX - ARTERIAL_CONSTANTS.VELOCITY_MIN);
          velocity.multiplyScalar(speed * effect.pressure);

          particles.push({
            position: new THREE.Vector3(...effect.position),
            velocity,
            age: 0,
            lifetime:
              ARTERIAL_CONSTANTS.DURATION +
              ARTERIAL_CONSTANTS.POOL_LIFETIME,
            settled: false,
            size:
              ARTERIAL_CONSTANTS.PARTICLE_SIZE_MIN +
              Math.random() *
                (ARTERIAL_CONSTANTS.PARTICLE_SIZE_MAX -
                  ARTERIAL_CONSTANTS.PARTICLE_SIZE_MIN),
          });
        }

        effectInstancesRef.current.set(effect.id, {
          particles,
          startTime: Date.now(),
          effect,
        });
      }
    });

    // Clean up removed effects
    const activeIds = new Set(effects.map((e) => e.id));
    effectInstancesRef.current.forEach((_, id) => {
      if (!activeIds.has(id)) {
        effectInstancesRef.current.delete(id);
      }
    });
  }, [effects, enabled, maxParticles]);

  // Animate particles with pulsating arterial flow
  useFrame((_, delta) => {
    if (!enabled || !pointsRef.current) return;

    const safeDelta = Math.min(delta, ARTERIAL_CONSTANTS.MAX_DELTA);
    const currentTime = Date.now();
    let particleIndex = 0;

    effectInstancesRef.current.forEach((instance, effectId) => {
      const { particles, startTime, effect } = instance;
      const elapsed = (currentTime - startTime) / 1000;

      // Pulsating intensity based on heart rate
      const pulseFactor = effect.pulsating
        ? 1.0 +
          Math.sin(elapsed * ARTERIAL_CONSTANTS.PULSE_FREQUENCY * Math.PI * 2) *
            ARTERIAL_CONSTANTS.PULSE_AMPLITUDE
        : 1.0;

      let allSettled = true;

      particles.forEach((particle) => {
        particle.age += safeDelta;

        if (particle.age < particle.lifetime) {
          allSettled = false;

          if (!particle.settled) {
            // Apply pulsating velocity during active spray phase
            if (particle.age < ARTERIAL_CONSTANTS.DURATION) {
              particle.velocity.multiplyScalar(pulseFactor);
            }

            // Update position
            particle.position.addScaledVector(particle.velocity, safeDelta);

            // Apply gravity
            particle.velocity.y += ARTERIAL_CONSTANTS.GRAVITY * safeDelta;

            // Air resistance
            particle.velocity.multiplyScalar(ARTERIAL_CONSTANTS.AIR_RESISTANCE);

            // Check floor collision
            if (particle.position.y <= ARTERIAL_CONSTANTS.FLOOR_Y) {
              particle.position.y = ARTERIAL_CONSTANTS.FLOOR_Y;
              particle.velocity.set(0, 0, 0);
              particle.settled = true;
            }
          }

          // Update buffer arrays
          if (particleIndex < positionArray.length / 3) {
            const i3 = particleIndex * 3;
            positionArray[i3] = particle.position.x;
            positionArray[i3 + 1] = particle.position.y;
            positionArray[i3 + 2] = particle.position.z;

            sizeArray[particleIndex] = particle.size;

            // Calculate opacity with fade-out
            let opacity = 1.0;
            if (particle.settled) {
              const poolAge = particle.age - ARTERIAL_CONSTANTS.DURATION;
              const fadeStart =
                ARTERIAL_CONSTANTS.POOL_LIFETIME - ARTERIAL_CONSTANTS.POOL_FADE;
              if (poolAge > fadeStart) {
                opacity =
                  1.0 - (poolAge - fadeStart) / ARTERIAL_CONSTANTS.POOL_FADE;
              }
            }
            opacityArray[particleIndex] = opacity;

            particleIndex++;
          }
        }
      });

      // Notify completion
      if (allSettled && onEffectComplete) {
        onEffectComplete(effectId);
      }
    });

    // Update geometry
    const geometry = pointsRef.current.geometry;
    if (geometry.attributes.position) {
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
      geometry.attributes.opacity.needsUpdate = true;
    }
  });

  if (!enabled || effects.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positionArray.length / 3}
          array={positionArray}
          itemSize={3}
          args={[positionArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={KOREAN_COLORS.PRIMARY_RED} // Deep red for arterial blood
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

ArterialSpray3D.displayName = "ArterialSpray3D";
