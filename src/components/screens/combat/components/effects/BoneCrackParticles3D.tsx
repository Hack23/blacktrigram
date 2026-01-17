/**
 * BoneCrackParticles3D - Bone fracture particle effects for brutal combat realism
 * 
 * Displays white/ivory bone fragments when bone-breaking techniques land successfully.
 * Supports different fracture types (hairline, compound, shatter) with varying severity.
 * 
 * 골절 입자 효과 (Bone Fracture Particle Effects)
 * 
 * @module BoneCrackParticles3D
 */

import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Fracture types based on Korean martial arts bone-breaking techniques
 * 골절 유형
 */
export type FractureType = 'hairline' | 'compound' | 'shatter';

/**
 * Bone types that can be fractured in combat
 * 골 유형
 */
export type BoneType = 'rib' | 'limb' | 'skull' | 'spine';

/**
 * Bone crack particle effect data
 * 골절 입자 효과 데이터
 */
export interface BoneCrackEffect {
  readonly id: string;
  readonly position: [number, number, number];
  readonly fractureType: FractureType;
  readonly boneType: BoneType;
  readonly impactDirection: [number, number, number];
  readonly startTime: number;
}

/**
 * Props for BoneCrackParticles3D component
 */
export interface BoneCrackParticles3DProps {
  readonly effects: readonly BoneCrackEffect[];
  readonly enabled?: boolean;
  readonly isMobile?: boolean;
  readonly onEffectComplete?: (id: string) => void;
}

/**
 * Particle instance for bone fragments
 */
interface BoneParticleInstance {
  readonly effectId: string;
  readonly points: THREE.Points;
  readonly velocities: Float32Array;
  readonly rotations: Float32Array;
  readonly lifetimes: Float32Array;
  readonly startTime: number;
}

/**
 * Physics constants for bone fragments
 */
const BONE_PHYSICS = {
  GRAVITY: -9.8,
  AIR_RESISTANCE: 0.96, // Heavier than blood
  ROTATION_SPEED: 3.0,
  FRAGMENT_SIZE_HAIRLINE: 0.05,
  FRAGMENT_SIZE_COMPOUND: 0.08,
  FRAGMENT_SIZE_SHATTER: 0.12,
  LIFETIME_ACTIVE: 2.0, // Fragments fall for 2s
  LIFETIME_GROUND: 8.0, // Persist on ground for 8s
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Particle counts based on fracture severity
 */
const PARTICLE_COUNTS = {
  hairline: { desktop: 15, mobile: 8 },
  compound: { desktop: 35, mobile: 18 },
  shatter: { desktop: 60, mobile: 30 },
} as const;

/**
 * Get particle count based on fracture type and device
 */
function getParticleCount(
  fractureType: FractureType,
  isMobile: boolean
): number {
  const counts = PARTICLE_COUNTS[fractureType];
  return isMobile ? counts.mobile : counts.desktop;
}

/**
 * Get fragment size based on fracture type
 */
function getFragmentSize(fractureType: FractureType): number {
  switch (fractureType) {
    case 'hairline':
      return BONE_PHYSICS.FRAGMENT_SIZE_HAIRLINE;
    case 'compound':
      return BONE_PHYSICS.FRAGMENT_SIZE_COMPOUND;
    case 'shatter':
      return BONE_PHYSICS.FRAGMENT_SIZE_SHATTER;
  }
}

/**
 * Get velocity spread based on fracture type
 */
function getVelocitySpread(fractureType: FractureType): number {
  switch (fractureType) {
    case 'hairline':
      return 1.0; // Minimal spread
    case 'compound':
      return 2.5; // Moderate spread
    case 'shatter':
      return 4.5; // Wide explosion
  }
}

/**
 * BoneCrackParticles3D - Renders bone fracture particle effects
 * 
 * Features:
 * - Angular white/ivory fragments with realistic physics
 * - Three fracture types: hairline, compound, shatter
 * - Slower fall rate than blood (heavier fragments)
 * - Ground persistence (8 seconds)
 * - Mobile optimization (50% particle reduction)
 * 
 * 기능:
 * - 현실적인 물리 법칙을 가진 각진 흰색/상아색 파편
 * - 세 가지 골절 유형: 미세, 복합, 분쇄
 * - 혈액보다 느린 낙하 속도 (무거운 파편)
 * - 바닥 지속성 (8초)
 * - 모바일 최적화 (입자 50% 감소)
 */
export const BoneCrackParticles3D: React.FC<BoneCrackParticles3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const [particleInstances, setParticleInstances] = useState<
    Map<string, BoneParticleInstance>
  >(new Map());

  // Create particle instances for new effects
  useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!particleInstances.has(effect.id)) {
        const particleCount = getParticleCount(effect.fractureType, isMobile);
        const fragmentSize = getFragmentSize(effect.fractureType);
        const velocitySpread = getVelocitySpread(effect.fractureType);

        // Create positions buffer
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const rotations = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);

        // Initialize particles at impact position
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;

          // Start at impact position
          positions[i3] = effect.position[0];
          positions[i3 + 1] = effect.position[1];
          positions[i3 + 2] = effect.position[2];

          // Velocity: explosion pattern based on impact direction
          const angle = (Math.PI * 2 * i) / particleCount;
          const elevation = Math.random() * Math.PI * 0.5; // 0-90 degrees

          const speed = Math.random() * velocitySpread + 1.0;
          velocities[i3] =
            effect.impactDirection[0] +
            Math.cos(angle) * Math.cos(elevation) * speed;
          velocities[i3 + 1] = Math.sin(elevation) * speed + 1.0; // Upward bias
          velocities[i3 + 2] =
            effect.impactDirection[2] +
            Math.sin(angle) * Math.cos(elevation) * speed;

          // Random rotation velocities for tumbling
          rotations[i3] = (Math.random() - 0.5) * BONE_PHYSICS.ROTATION_SPEED;
          rotations[i3 + 1] =
            (Math.random() - 0.5) * BONE_PHYSICS.ROTATION_SPEED;
          rotations[i3 + 2] =
            (Math.random() - 0.5) * BONE_PHYSICS.ROTATION_SPEED;

          // Lifetime (active + ground persistence)
          lifetimes[i] =
            BONE_PHYSICS.LIFETIME_ACTIVE + BONE_PHYSICS.LIFETIME_GROUND;
        }

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );

        // White/ivory material for bone fragments
        const material = new THREE.PointsMaterial({
          color: 0xf5f5dc, // Ivory/bone color
          size: fragmentSize,
          sizeAttenuation: true,
          transparent: true,
          opacity: 1.0,
          blending: THREE.NormalBlending,
          depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);

        const instance: BoneParticleInstance = {
          effectId: effect.id,
          points,
          velocities,
          rotations,
          lifetimes,
          startTime: effect.startTime,
        };

        setParticleInstances((prev) => new Map(prev).set(effect.id, instance));
      }
    });
  }, [effects, enabled, isMobile, particleInstances]);

  // Animate bone fragments with physics
  useFrame((_state, delta) => {
    if (!enabled) return;

    const safeDelta = Math.min(delta, BONE_PHYSICS.MAX_DELTA);
    const currentTime = Date.now();

    particleInstances.forEach((instance, effectId) => {
      const positions = instance.points.geometry.attributes.position
        .array as Float32Array;
      const particleCount = positions.length / 3;
      let allExpired = true;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const lifetime = instance.lifetimes[i];

        if (lifetime > 0) {
          allExpired = false;

          const elapsed =
            (currentTime - instance.startTime) / 1000 - i * 0.01; // Stagger

          // Active falling phase
          if (elapsed < BONE_PHYSICS.LIFETIME_ACTIVE) {
            // Apply velocity
            positions[i3] += instance.velocities[i3] * safeDelta;
            positions[i3 + 1] += instance.velocities[i3 + 1] * safeDelta;
            positions[i3 + 2] += instance.velocities[i3 + 2] * safeDelta;

            // Apply gravity
            instance.velocities[i3 + 1] += BONE_PHYSICS.GRAVITY * safeDelta;

            // Apply air resistance
            instance.velocities[i3] *= BONE_PHYSICS.AIR_RESISTANCE;
            instance.velocities[i3 + 1] *= BONE_PHYSICS.AIR_RESISTANCE;
            instance.velocities[i3 + 2] *= BONE_PHYSICS.AIR_RESISTANCE;

            // Ground collision
            if (positions[i3 + 1] <= 0) {
              positions[i3 + 1] = 0;
              instance.velocities[i3 + 1] = 0;
              instance.velocities[i3] *= 0.3; // Bounce damping
              instance.velocities[i3 + 2] *= 0.3;
            }
          }
          // Ground persistence phase - fragments remain visible
          else {
            // Ensure fragments stay on ground
            if (positions[i3 + 1] > 0) {
              positions[i3 + 1] = 0;
            }

            // Fade out in last second
            const timeRemaining = lifetime - elapsed;
            if (timeRemaining < 1.0) {
              const opacity = timeRemaining;
              (instance.points.material as THREE.PointsMaterial).opacity =
                opacity;
            }
          }

          // Decrease lifetime
          instance.lifetimes[i] -= safeDelta;
        }
      }

      instance.points.geometry.attributes.position.needsUpdate = true;

      // Clean up expired effect
      if (allExpired) {
        instance.points.geometry.dispose();
        (instance.points.material as THREE.Material).dispose();

        setParticleInstances((prev) => {
          const next = new Map(prev);
          next.delete(effectId);
          return next;
        });

        onEffectComplete?.(effectId);
      }
    });
  });

  if (!enabled) return null;

  return (
    <group>
      {Array.from(particleInstances.values()).map((instance) => (
        <primitive key={instance.effectId} object={instance.points} />
      ))}
    </group>
  );
};

BoneCrackParticles3D.displayName = 'BoneCrackParticles3D';
