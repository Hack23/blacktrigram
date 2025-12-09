/**
 * StanceAuraParticles - Particle system for trigram stance visual effects
 * 
 * Creates a dynamic particle cloud that visualizes the player's current stance
 * with color-coded particles that orbit, pulse, and emanate Korean martial arts energy.
 * 
 * Each of the 8 trigram stances has a unique color and particle behavior pattern.
 * 
 * @module components/three/StanceAuraParticles
 * @category 3D Components
 * @korean 자세오라입자
 */

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import { getStanceColor } from "../../utils/stanceHelpers";

/**
 * Props for StanceAuraParticles component
 */
export interface StanceAuraParticlesProps {
  /** Current trigram stance affecting particle color and behavior */
  readonly stance: TrigramStance;
  /** Intensity of particle effect (0.0 to 1.0) */
  readonly intensity?: number;
  /** Number of particles to render */
  readonly count?: number;
  /** Whether particles should animate */
  readonly animated?: boolean;
  /** Spread radius of particles */
  readonly spread?: number;
}

/**
 * Performance constants for particle animation
 */
const PERFORMANCE_CONSTANTS = {
  /** Maximum delta time to prevent spiral of death (33.33ms) */
  MAX_DELTA_TIME: 1 / 30,
} as const;

/**
 * Get animation pattern based on stance philosophy
 * Each stance has unique particle movement patterns
 */
const getStancePattern = (stance: TrigramStance) => {
  switch (stance) {
    case TrigramStance.GEON: // Heaven - Direct upward motion
      return { speed: 1.5, rotationSpeed: 0.5, verticalBias: 1.0 };
    case TrigramStance.TAE: // Lake - Fluid, wavy motion
      return { speed: 1.0, rotationSpeed: 0.8, verticalBias: 0.3 };
    case TrigramStance.LI: // Fire - Fast, erratic motion
      return { speed: 2.0, rotationSpeed: 1.5, verticalBias: 0.8 };
    case TrigramStance.JIN: // Thunder - Explosive bursts
      return { speed: 2.5, rotationSpeed: 1.0, verticalBias: 0.5 };
    case TrigramStance.SON: // Wind - Swirling, circular motion
      return { speed: 1.2, rotationSpeed: 2.0, verticalBias: 0.2 };
    case TrigramStance.GAM: // Water - Flowing, descending
      return { speed: 0.8, rotationSpeed: 0.6, verticalBias: -0.5 };
    case TrigramStance.GAN: // Mountain - Stable, slow orbit
      return { speed: 0.5, rotationSpeed: 0.3, verticalBias: 0.0 };
    case TrigramStance.GON: // Earth - Grounded, horizontal
      return { speed: 0.7, rotationSpeed: 0.4, verticalBias: -0.8 };
    default:
      return { speed: 1.0, rotationSpeed: 0.5, verticalBias: 0.0 };
  }
};

/**
 * StanceAuraParticles Component
 * 
 * Renders an animated particle system that visualizes the player's stance
 * with color-coded particles following stance-specific movement patterns.
 * 
 * Performance optimized:
 * - Uses instanced rendering via Points
 * - Reuses Float32Array buffers
 * - Clamps delta time to prevent spiral of death
 * 
 * @example
 * ```tsx
 * <StanceAuraParticles 
 *   stance={TrigramStance.GEON} 
 *   intensity={0.8}
 *   count={200}
 *   animated={true}
 * />
 * ```
 */
export const StanceAuraParticles: React.FC<StanceAuraParticlesProps> = ({
  stance,
  intensity = 1.0,
  count = 200,
  animated = true,
  spread = 2.0,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Get stance-specific color and pattern
  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);
  const pattern = useMemo(() => getStancePattern(stance), [stance]);

  // Initialize particle positions and phases (stable - no random on rerender)
  const particleData = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    
    // Use deterministic initialization based on index
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const normalizedI = i / count; // Use as deterministic "random" value
      const radius = 0.5 + normalizedI * spread;
      const height = (normalizedI - 0.5) * 2;
      
      // Spherical distribution around player
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = height + 1.0; // Centered at player height
      pos[i3 + 2] = Math.sin(angle) * radius;
      
      // Phase offset for wave patterns (deterministic)
      phase[i] = normalizedI * Math.PI * 2;
    }
    
    return { positions: pos, phases: phase };
  }, [count, spread]);

  // Animation loop - 60fps target
  useFrame((state, delta) => {
    if (!animated || !pointsRef.current) return;

    // Clamp delta to prevent instability
    const safeDelta = Math.min(delta, PERFORMANCE_CONSTANTS.MAX_DELTA_TIME);
    const time = state.clock.elapsedTime;

    // Access particle data
    const { phases } = particleData;

    const attr = pointsRef.current.geometry.attributes.position;
    const array = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Orbital motion around player
      const orbitalAngle = time * pattern.rotationSpeed + phase;
      const orbitalRadius = 0.5 + Math.sin(time + phase) * 0.3;
      
      // Calculate target position based on stance pattern
      const targetX = Math.cos(orbitalAngle) * orbitalRadius * spread;
      const targetZ = Math.sin(orbitalAngle) * orbitalRadius * spread;
      const targetY = 1.0 + Math.sin(time * pattern.speed + phase) * pattern.verticalBias;

      // Smoothly interpolate towards target (gives flowing motion)
      const lerpFactor = Math.min(safeDelta * pattern.speed, 1.0);
      array[i3] += (targetX - array[i3]) * lerpFactor;
      array[i3 + 1] += (targetY - array[i3 + 1]) * lerpFactor;
      array[i3 + 2] += (targetZ - array[i3 + 2]) * lerpFactor;

      // Reset particles that drift too far
      const distSq = array[i3] * array[i3] + array[i3 + 2] * array[i3 + 2];
      if (distSq > spread * spread * 4) {
        // Deterministic angle based on particle index and time
        const angle = (phase + time) % (Math.PI * 2);
        array[i3] = Math.cos(angle) * spread * 0.5;
        array[i3 + 1] = 1.0;
        array[i3 + 2] = Math.sin(angle) * spread * 0.5;
      }
    }

    attr.needsUpdate = true;
  });

  // Don't render if intensity is too low
  if (intensity < 0.1) return null;

  return (
    <Points 
      ref={pointsRef} 
      positions={particleData.positions}
      data-testid="stance-aura-particles"
    >
      <PointMaterial
        color={stanceColor}
        size={0.08 * intensity}
        sizeAttenuation
        transparent
        opacity={0.7 * intensity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default StanceAuraParticles;
