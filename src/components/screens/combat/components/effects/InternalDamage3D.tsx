/**
 * InternalDamage3D - Deep red organ pulses for Korean martial arts organ strikes
 *
 * Priority #4: Internal Damage Visualization
 * - Deep red organ pulses (liver, kidney, spleen, stomach, heart)
 * - Tissue deformation ripples
 * - Penetration depth visualization
 * - Critical organ damage feedback
 *
 * Korean martial arts context (내장 공격 - Internal organ strikes):
 * - 간격 (Liver strike) - Right side body blow
 * - 신장격 (Kidney strike) - Lower back strike
 * - 비장격 (Spleen strike) - Left side body blow
 * - 명치격 (Solar plexus) - Stomach strike
 * - 심장격 (Heart strike) - Chest strike (critical)
 */

import React, { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Organ types for Korean martial arts internal strikes
 */
export type OrganType = 'liver' | 'kidney' | 'spleen' | 'stomach' | 'heart';

/**
 * Penetration depth levels for organ damage
 */
export type PenetrationDepth = 'surface' | 'shallow' | 'deep' | 'critical';

/**
 * Individual internal damage effect
 */
export interface InternalDamageEffect {
  readonly id: string;
  readonly position: [number, number, number];
  readonly organType: OrganType;
  readonly penetrationDepth: PenetrationDepth;
  readonly startTime: number;
}

/**
 * Props for InternalDamage3D component
 */
export interface InternalDamage3DProps {
  readonly effects: readonly InternalDamageEffect[];
  readonly enabled?: boolean;
  readonly isMobile?: boolean;
  readonly onEffectComplete?: (id: string) => void;
}

// Physics constants for organ damage pulses
const INTERNAL_DAMAGE_CONSTANTS = {
  // Pulse expansion speeds
  PULSE_SPEED: 2.5, // m/s expansion rate
  
  // Lifetimes
  PULSE_LIFETIME: 1.5, // seconds for pulse to complete
  RIPPLE_LIFETIME: 0.8, // seconds for tissue ripple
  
  // Max radii by penetration depth
  MAX_RADIUS: {
    surface: 0.4,
    shallow: 0.7,
    deep: 1.0,
    critical: 1.2,
  },
  
  // Intensity multipliers
  INTENSITY: {
    surface: 0.5,
    shallow: 0.8,
    deep: 1.2,
    critical: 1.5,
  },
  
  // Particle counts (desktop)
  PULSE_PARTICLES: 60,
  RIPPLE_PARTICLES: 30,
  
  // Colors
  ORGAN_COLOR: 0x8b0000, // Dark red for organs
  RIPPLE_COLOR: 0xdc143c, // Crimson for tissue ripples
  
  // Emissive intensity
  EMISSIVE_INTENSITY: 0.8,
} as const;

/**
 * InternalDamage3D - Visualizes internal organ damage with deep red pulses
 *
 * Features:
 * - Expanding sphere pulses from organ impacts
 * - Tissue deformation ripples
 * - Penetration depth-based sizing
 * - Korean martial arts organ strike feedback
 * - Mobile optimization (50% particles)
 */
export const InternalDamage3D: React.FC<InternalDamage3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  // Track active effect instances
  const [effectInstances, setEffectInstances] = React.useState<
    Map<
      string,
      {
        pulseParticles: THREE.Points;
        rippleParticles: THREE.Points;
        startTime: number;
        effect: InternalDamageEffect;
      }
    >
  >(new Map());

  // Calculate particle counts based on mobile optimization
  const particleCounts = useMemo(() => {
    const pulseCount = isMobile
      ? Math.floor(INTERNAL_DAMAGE_CONSTANTS.PULSE_PARTICLES * 0.5)
      : INTERNAL_DAMAGE_CONSTANTS.PULSE_PARTICLES;
    const rippleCount = isMobile
      ? Math.floor(INTERNAL_DAMAGE_CONSTANTS.RIPPLE_PARTICLES * 0.5)
      : INTERNAL_DAMAGE_CONSTANTS.RIPPLE_PARTICLES;
    return { pulseCount, rippleCount };
  }, [isMobile]);

  // Create particle system for organ pulse
  const createPulseParticles = useMemo(
    () => (effect: InternalDamageEffect) => {
      const { pulseCount } = particleCounts;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pulseCount * 3);
      const colors = new Float32Array(pulseCount * 3);
      const sizes = new Float32Array(pulseCount);

      // Create sphere distribution
      for (let i = 0; i < pulseCount; i++) {
        // Fibonacci sphere distribution for phi/theta calculations
        // (values calculated but not stored in positions yet - used later for expansion)

        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Dark red color
        const color = new THREE.Color(INTERNAL_DAMAGE_CONSTANTS.ORGAN_COLOR);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Size based on penetration depth
        const baseSize = 0.03;
        const depthMultiplier =
          INTERNAL_DAMAGE_CONSTANTS.INTENSITY[effect.penetrationDepth];
        sizes[i] = baseSize * depthMultiplier;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geometry, material);
      points.position.set(...effect.position);

      // Store phi/theta for sphere expansion
      (geometry as THREE.BufferGeometry & { sphereData: Record<string, number | Float32Array> }).sphereData = { positions: positions.slice() };
      for (let i = 0; i < pulseCount; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / pulseCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        (geometry as THREE.BufferGeometry & { sphereData: Record<string, number | Float32Array> }).sphereData[`phi_${i}`] = phi;
        (geometry as THREE.BufferGeometry & { sphereData: Record<string, number | Float32Array> }).sphereData[`theta_${i}`] = theta;
      }

      return points;
    },
    [particleCounts]
  );

  // Create particle system for tissue ripples
  const createRippleParticles = useMemo(
    () => (effect: InternalDamageEffect) => {
      const { rippleCount } = particleCounts;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(rippleCount * 3);
      const colors = new Float32Array(rippleCount * 3);
      const sizes = new Float32Array(rippleCount);

      // Create ring distribution
      for (let i = 0; i < rippleCount; i++) {
        const angle = (i / rippleCount) * Math.PI * 2;
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Crimson color for ripples
        const color = new THREE.Color(INTERNAL_DAMAGE_CONSTANTS.RIPPLE_COLOR);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = 0.02;

        // Store angle for ring expansion
        (geometry as THREE.BufferGeometry & { [key: string]: number })[`angle_${i}`] = angle;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.NormalBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geometry, material);
      points.position.set(...effect.position);

      return points;
    },
    [particleCounts]
  );

  // Update effect instances when effects prop changes
  useEffect(() => {
    if (!enabled) return;

    setEffectInstances((prev) => {
      const updated = new Map(prev);

      // Add new effects
      effects.forEach((effect) => {
        if (!updated.has(effect.id)) {
          const pulseParticles = createPulseParticles(effect);
          const rippleParticles = createRippleParticles(effect);
          updated.set(effect.id, {
            pulseParticles,
            rippleParticles,
            startTime: effect.startTime,
            effect,
          });
        }
      });

      // Remove completed effects
      const currentIds = new Set(effects.map((e) => e.id));
      Array.from(updated.keys()).forEach((id) => {
        if (!currentIds.has(id)) {
          const instance = updated.get(id);
          if (instance) {
            instance.pulseParticles.geometry.dispose();
            (instance.pulseParticles.material as THREE.Material).dispose();
            instance.rippleParticles.geometry.dispose();
            (instance.rippleParticles.material as THREE.Material).dispose();
          }
          updated.delete(id);
        }
      });

      return updated;
    });
  }, [effects, enabled, createPulseParticles, createRippleParticles]);

  // Animation loop
  useFrame(() => {
    if (!enabled || effectInstances.size === 0) return;

    const now = Date.now();
    const completedIds: string[] = [];

    effectInstances.forEach((instance, id) => {
      const elapsed = (now - instance.startTime) / 1000;
      const { effect } = instance;

      // Pulse animation
      const pulseProgress = Math.min(
        elapsed / INTERNAL_DAMAGE_CONSTANTS.PULSE_LIFETIME,
        1.0
      );
      if (pulseProgress < 1.0) {
      const pulseGeometry = instance.pulseParticles.geometry;
        const pulsePositions = pulseGeometry.attributes.position
          .array as Float32Array;
        const maxRadius =
          INTERNAL_DAMAGE_CONSTANTS.MAX_RADIUS[effect.penetrationDepth];

        const { pulseCount } = particleCounts;
        const sphereData = (pulseGeometry as THREE.BufferGeometry & { sphereData: Record<string, number | Float32Array> }).sphereData;
        for (let i = 0; i < pulseCount; i++) {
          const phi = sphereData[`phi_${i}`] as number;
          const theta = sphereData[`theta_${i}`] as number;
          const radius = maxRadius * pulseProgress;

          pulsePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          pulsePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          pulsePositions[i * 3 + 2] = radius * Math.cos(phi);
        }

        pulseGeometry.attributes.position.needsUpdate = true;

        // Fade opacity
        const material = instance.pulseParticles.material as THREE.PointsMaterial;
        material.opacity = 1.0 - pulseProgress * 0.7;
      }

      // Ripple animation
      const rippleProgress = Math.min(
        elapsed / INTERNAL_DAMAGE_CONSTANTS.RIPPLE_LIFETIME,
        1.0
      );
      if (rippleProgress < 1.0) {
        const rippleGeometry = instance.rippleParticles.geometry;
        const ripplePositions = rippleGeometry.attributes.position
          .array as Float32Array;

        const { rippleCount } = particleCounts;
        const rippleRadius = 0.6 * rippleProgress;
        for (let i = 0; i < rippleCount; i++) {
          const angle = (rippleGeometry as THREE.BufferGeometry & { [key: string]: number })[`angle_${i}`];
          ripplePositions[i * 3] = rippleRadius * Math.cos(angle);
          ripplePositions[i * 3 + 1] = 0;
          ripplePositions[i * 3 + 2] = rippleRadius * Math.sin(angle);
        }

        rippleGeometry.attributes.position.needsUpdate = true;

        // Fade opacity
        const material = instance.rippleParticles
          .material as THREE.PointsMaterial;
        material.opacity = 1.0 - rippleProgress;
      }

      // Check completion
      if (
        elapsed >= INTERNAL_DAMAGE_CONSTANTS.PULSE_LIFETIME &&
        elapsed >= INTERNAL_DAMAGE_CONSTANTS.RIPPLE_LIFETIME
      ) {
        completedIds.push(id);
      }
    });

    // Notify completed effects
    completedIds.forEach((id) => {
      onEffectComplete?.(id);
    });
  });

  // Render all active particle systems
  return (
    <>
      {Array.from(effectInstances.values()).map((instance) => (
        <React.Fragment key={instance.effect.id}>
          <primitive object={instance.pulseParticles} />
          <primitive object={instance.rippleParticles} />
        </React.Fragment>
      ))}
    </>
  );
};
