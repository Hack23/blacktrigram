/**
 * ExplosiveBurstEffect3D - Explosive particle burst effects for Jin trigram
 *
 * Creates explosive particle bursts with Korean cyberpunk aesthetic for
 * Jin (Thunder) stance techniques on impact.
 *
 * **Korean Martial Arts Context:**
 * - 진괘 (Jin): Thunder trigram explosive impact visualization
 * - 폭발 (Pokbal): Explosion particle burst
 * - 충격파 (Chunggyeokpa): Shockwave expansion
 *
 * @module components/shared/three/effects/ExplosiveBurstEffect3D
 * @korean 폭발파열효과3D
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Props for ExplosiveBurstEffect3D component
 */
export interface ExplosiveBurstEffect3DProps {
  /** Position in 3D space [x, y, z] */
  readonly position: [number, number, number];
  /** Intensity of the burst (0-1) */
  readonly intensity?: number;
  /** Number of particles in the burst */
  readonly particleCount?: number;
  /** Duration in milliseconds */
  readonly duration?: number;
  /** Callback when effect completes */
  readonly onComplete?: () => void;
  /** Whether effect is active */
  readonly active?: boolean;
  /** Color theme for particles */
  readonly color?: number;
}

/**
 * Individual particle in the burst
 */
interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * Explosive particle burst with physics
 */
const ParticleBurst: React.FC<{
  position: [number, number, number];
  particles: ParticleData[];
  color: number;
}> = ({ position, particles, color }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef(particles);
  
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);
  
  const particleCount = particles.length;
  
  const meshRefsArray = useMemo(
    () => particles.map(() => ({ current: null as THREE.Mesh | null })),
    [particles]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    particlesRef.current.forEach((particle, i) => {
      particle.velocity.y -= 9.8 * delta; // Gravity
      particle.velocity.multiplyScalar(0.98); // Air resistance
      particle.position.addScaledVector(particle.velocity, delta);

      particle.life -= delta;

      const mesh = meshRefsArray[i]?.current;
      if (mesh) {
        mesh.position.copy(particle.position);
        const alpha = Math.max(0, particle.life / particle.maxLife);
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = alpha;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: particleCount }, (_, i) => {
        const particle = particles[i];
        const alpha = Math.max(0, particle.life / particle.maxLife);
        return (
          <mesh key={i} ref={meshRefsArray[i]} position={particle.position}>
            <sphereGeometry args={[particle.size, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={alpha}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Expanding shockwave ring
 */
const ShockwaveRing: React.FC<{
  position: [number, number, number];
  progressRef: React.MutableRefObject<number>;
  intensity: number;
  color: number;
}> = ({ position, progressRef, intensity, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const progress = progressRef.current;
      const scale = 1 + progress * 3 * intensity;
      meshRef.current.scale.set(scale, scale, 1);

      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - progress) * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.4, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/**
 * Explosive flash sphere
 */
const ExplosionFlash: React.FC<{
  position: [number, number, number];
  progressRef: React.MutableRefObject<number>;
  intensity: number;
  color: number;
}> = ({ position, progressRef, intensity, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const progress = progressRef.current;
      const scale = progress < 0.2 ? 1 + progress * 2 : 1.4 - progress;
      meshRef.current.scale.setScalar(scale * intensity);

      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - progress) * 0.9;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

/**
 * Debris particles flying outward
 */
const DebrisParticles: React.FC<{
  position: [number, number, number];
  intensity: number;
  color: number;
  active: boolean;
}> = ({ position, intensity, color, active }) => {
  const groupRef = useRef<THREE.Group>(null);

  const [debris, setDebris] = useState<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Euler;
    rotationVel: THREE.Vector3;
    size: number;
  }>>([]);

  useEffect(() => {
    if (!active) return;

    const debrisData: Array<{
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      rotation: THREE.Euler;
      rotationVel: THREE.Vector3;
      size: number;
    }> = [];

    const count = Math.floor(15 * intensity);
    const center = new THREE.Vector3(...position);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.3) * Math.PI * 0.5;
      const speed = 2 + Math.random() * 3;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * Math.cos(elevation) * speed,
        Math.sin(elevation) * speed,
        Math.sin(angle) * Math.cos(elevation) * speed
      );

      debrisData.push({
        position: center.clone(),
        velocity,
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationVel: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        size: 0.05 + Math.random() * 0.05,
      });
    }

    setDebris(debrisData);
  }, [position, intensity, active]);

  const debrisRefs = useMemo(
    () => debris.map(() => React.createRef<THREE.Mesh>()),
    [debris]
  );

  useFrame((_, delta) => {
    debris.forEach((piece, i) => {
      const mesh = debrisRefs[i].current;
      if (!mesh) return;

      piece.velocity.y -= 9.8 * delta;
      piece.velocity.multiplyScalar(0.98);
      piece.position.addScaledVector(piece.velocity, delta);

      piece.rotation.x += piece.rotationVel.x * delta;
      piece.rotation.y += piece.rotationVel.y * delta;
      piece.rotation.z += piece.rotationVel.z * delta;

      mesh.position.copy(piece.position);
      mesh.rotation.copy(piece.rotation);

      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity *= 0.97;
    });
  });

  return (
    <group ref={groupRef}>
      {debris.map((piece, i) => (
        <mesh key={i} ref={debrisRefs[i]} position={piece.position}>
          <boxGeometry args={[piece.size, piece.size, piece.size]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Main Explosive Burst Effect Component
 * Creates a multi-layered explosive particle burst
 */
export const ExplosiveBurstEffect3D: React.FC<ExplosiveBurstEffect3DProps> = ({
  position,
  intensity = 1.0,
  particleCount = 50,
  duration = 1500,
  onComplete,
  active = true,
  color = KOREAN_COLORS.ACCENT_GOLD,
}) => {
  const cappedParticleCount = Math.min(particleCount, 50);
  
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    if (!active) return;

    const particleData: ParticleData[] = [];
    const center = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < cappedParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.3) * Math.PI;
      const speed = 3 + Math.random() * 4;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * Math.cos(elevation) * speed,
        Math.sin(elevation) * speed,
        Math.sin(angle) * Math.cos(elevation) * speed
      );

      const maxLife = 0.5 + Math.random() * 1.0;

      particleData.push({
        position: center.clone(),
        velocity,
        life: maxLife,
        maxLife,
        size: 0.04 + Math.random() * 0.04,
      });
    }

    setParticles(particleData);
  }, [position, active, cappedParticleCount]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    progressRef.current = 0;
    completedRef.current = false;
  }, [active]);

  useFrame(() => {
    if (!active) return;

    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min(elapsed / duration, 1);
    progressRef.current = newProgress;

    if (newProgress >= 1 && !completedRef.current && onComplete) {
      completedRef.current = true;
      onComplete();
    }
  });

  if (!active) return null;

  return (
    <group data-testid="explosive-burst-effect-3d">
      {/* Explosion flash */}
      <ExplosionFlash
        position={position}
        progressRef={progressRef}
        intensity={intensity}
        color={color}
      />

      {/* Shockwave rings */}
      <ShockwaveRing
        position={position}
        progressRef={progressRef}
        intensity={intensity}
        color={KOREAN_COLORS.PRIMARY_CYAN}
      />
      <ShockwaveRing
        position={[position[0], position[1] + 0.05, position[2]]}
        progressRef={progressRef}
        intensity={intensity * 0.8}
        color={KOREAN_COLORS.ACCENT_RED}
      />

      {/* Particle burst */}
      <ParticleBurst position={position} particles={particles} color={color} />

      {/* Debris */}
      <DebrisParticles
        position={position}
        intensity={intensity}
        color={KOREAN_COLORS.TEXT_SECONDARY}
        active={active}
      />
    </group>
  );
};

export default ExplosiveBurstEffect3D;
