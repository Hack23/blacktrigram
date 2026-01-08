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

/**
 * Blood particle data structure for efficient simulation
 */
interface BloodParticle {
  /** Current position [x, y, z] */
  position: THREE.Vector3;
  /** Current velocity [x, y, z] */
  velocity: THREE.Vector3;
  /** Particle lifetime in seconds */
  lifetime: number;
  /** Time elapsed since creation */
  age: number;
  /** Whether particle has settled on floor */
  settled: boolean;
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
 */
const generateBloodParticles = (
  effect: BloodSplatterEffect,
  maxParticles: number
): BloodParticle[] => {
  const particles: BloodParticle[] = [];
  const particleCount = Math.floor(maxParticles * effect.intensity);

  const baseDir = new THREE.Vector3(...effect.direction).normalize();
  const origin = new THREE.Vector3(...effect.position);

  for (let i = 0; i < particleCount; i++) {
    // Random spread around impact direction
    const spreadAngle = BLOOD_CONSTANTS.SPREAD_ANGLE;
    const phi = (Math.random() - 0.5) * spreadAngle;
    const theta = Math.random() * Math.PI * 2;

    // Rotate direction vector
    const direction = baseDir.clone();
    direction.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      phi
    );
    direction.applyAxisAngle(
      new THREE.Vector3(0, 0, 1),
      theta
    );

    // Random velocity magnitude
    const speed =
      BLOOD_CONSTANTS.VELOCITY_MIN +
      Math.random() * (BLOOD_CONSTANTS.VELOCITY_MAX - BLOOD_CONSTANTS.VELOCITY_MIN);

    particles.push({
      position: origin.clone(),
      velocity: direction.multiplyScalar(speed),
      lifetime: BLOOD_CONSTANTS.PARTICLE_LIFETIME,
      age: 0,
      settled: false,
    });
  }

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
  // Particle system state
  const particlesRef = useRef<Map<string, BloodParticle[]>>(new Map());
  const poolParticlesRef = useRef<BloodParticle[]>([]);
  const pointsRef = useRef<THREE.Points>(null);
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Performance configuration
  const maxParticles = isMobile
    ? BLOOD_CONSTANTS.MAX_PARTICLES_MOBILE
    : BLOOD_CONSTANTS.MAX_PARTICLES_DESKTOP;

  // Blood color from Korean theme
  const bloodColor = useMemo(() => KOREAN_COLORS.BLOODLOSS_INDICATOR, []);

  // Initialize particles for new effects
  React.useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!particlesRef.current.has(effect.id)) {
        const particles = generateBloodParticles(effect, maxParticles);
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
  }, [effects, enabled, maxParticles]);

  // Initial particle positions for first render
  // Actual positions are updated in useFrame
  const initialPositions = useMemo(() => {
    const positions = new Float32Array(maxParticles * 3);
    // Initialize with zeros - actual positions set in useFrame
    return positions;
  }, [maxParticles]);

  // Physics update loop
  useFrame((_, delta) => {
    if (!enabled || !pointsRef.current) return;

    const safeDelta = Math.min(delta, BLOOD_CONSTANTS.MAX_DELTA);

    let totalParticleIndex = 0;
    const attr = pointsRef.current.geometry.attributes.position;
    const posArray = attr.array as Float32Array;

    // Update active splatter particles
    particlesRef.current.forEach((particles, effectId) => {
      let hasActiveParticles = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age += safeDelta;

        if (!p.settled) {
          // Apply gravity
          p.velocity.y += BLOOD_CONSTANTS.GRAVITY * safeDelta;

          // Update position
          p.position.addScaledVector(p.velocity, safeDelta);

          // Check floor collision
          if (p.position.y <= BLOOD_CONSTANTS.FLOOR_Y) {
            p.position.y = BLOOD_CONSTANTS.FLOOR_Y;
            p.velocity.set(0, 0, 0);
            p.settled = true;
            p.lifetime = BLOOD_CONSTANTS.POOL_FADE_DURATION;
            p.age = 0;

            // Add to pool particles
            poolParticlesRef.current.push(p);
          } else {
            hasActiveParticles = true;
          }
        }

        // Update render position
        if (totalParticleIndex < posArray.length / 3) {
          posArray[totalParticleIndex * 3] = p.position.x;
          posArray[totalParticleIndex * 3 + 1] = p.position.y;
          posArray[totalParticleIndex * 3 + 2] = p.position.z;
          totalParticleIndex++;
        } else if (process.env.NODE_ENV === "development") {
          // Warn in development when particles are being dropped due to buffer overflow
          console.warn(
            `BloodParticles3D: Particle buffer full (${posArray.length / 3} particles). ` +
            `Additional particles are not rendered. Consider reducing particle counts or ` +
            `increasing maxParticles if this happens frequently.`
          );
        }
      }

      // Check if effect is complete
      if (!hasActiveParticles && !completedEffectsRef.current.has(effectId)) {
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);
      }
    });

    // Determine the maximum number of particles we can safely render this frame.
    // This explicitly ties the visible particle cap to both the buffer size and maxParticles.
    const maxVisibleParticles = Math.min(maxParticles, posArray.length / 3);

    // Update blood pool particles (fade out)
    if (totalParticleIndex >= maxVisibleParticles) {
      // Buffer is full: continue aging and culling pool particles, but do not write positions.
      poolParticlesRef.current = poolParticlesRef.current.filter((p) => {
        p.age += safeDelta;
        return p.age < p.lifetime;
      });
    } else {
      // There is still room in the buffer: write pool particle positions up to the cap.
      poolParticlesRef.current = poolParticlesRef.current.filter((p) => {
        p.age += safeDelta;
        const isAlive = p.age < p.lifetime;

        if (isAlive && totalParticleIndex < maxVisibleParticles) {
          posArray[totalParticleIndex * 3] = p.position.x;
          posArray[totalParticleIndex * 3 + 1] = p.position.y;
          posArray[totalParticleIndex * 3 + 2] = p.position.z;
          totalParticleIndex++;
        }

        return isAlive;
      });
    }

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
