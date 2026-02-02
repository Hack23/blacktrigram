/**
 * ThunderEffect3D - Lightning and thunder visual effects for Jin trigram
 *
 * Provides explosive lightning arcs, electric sparks, and thunder flashes
 * for Jin (Thunder) stance techniques with Korean cyberpunk aesthetic.
 *
 * **Korean Martial Arts Context:**
 * - 진괘 (Jin): Thunder trigram explosive power visualization
 * - 번개 (Byeonggae): Lightning effect for charge phase
 * - 천둥 (Cheondung): Thunder burst for release phase
 *
 * @module components/shared/three/effects/ThunderEffect3D
 * @korean 천둥효과3D
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Props for ThunderEffect3D component
 */
export interface ThunderEffect3DProps {
  /** Position in 3D space [x, y, z] */
  readonly position: [number, number, number];
  /** Intensity of the effect (0-1) */
  readonly intensity?: number;
  /** Effect type: charge (buildup) or release (burst) */
  readonly effectType: "charge" | "release";
  /** Duration in milliseconds */
  readonly duration?: number;
  /** Callback when effect completes */
  readonly onComplete?: () => void;
  /** Whether effect is active */
  readonly active?: boolean;
}

/**
 * Lightning arc between two points with animated energy
 */
const LightningArc: React.FC<{
  start: THREE.Vector3;
  end: THREE.Vector3;
  intensity: number;
  color: number;
}> = ({ start, end, intensity, color }) => {
  const lineRef = useRef<THREE.Line>(null);

  // Create line object in useMemo to avoid recreation on re-render
  const line = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 8;
    const displacement = 0.2 * intensity;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = new THREE.Vector3().lerpVectors(start, end, t);

      // Add random zigzag displacement (except at endpoints)
      if (i > 0 && i < segments) {
        point.x += (Math.random() - 0.5) * displacement;
        point.y += (Math.random() - 0.5) * displacement;
        point.z += (Math.random() - 0.5) * displacement;
      }

      points.push(point);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: intensity,
      linewidth: 2,
    });

    return new THREE.Line(geometry, material);
  }, [start, end, intensity, color]);

  useFrame(() => {
    if (lineRef.current) {
      // Flicker effect
      const flicker = 0.8 + Math.random() * 0.2;
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = flicker * intensity;
    }
  });

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  return <primitive object={line} ref={lineRef} />;
};

/**
 * Electric spark particle for explosive effects
 */
const ElectricSpark: React.FC<{
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  intensity: number;
}> = ({ position: initialPosition, velocity, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const positionRef = useRef(initialPosition.clone());
  const velocityRef = useRef(velocity.clone());

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Update position with velocity
      positionRef.current.addScaledVector(velocityRef.current, delta);
      meshRef.current.position.copy(positionRef.current);

      // Apply gravity
      velocityRef.current.y -= 9.8 * delta;

      // Fade out
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity *= 0.95;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      userData={{ isElectricSpark: true }}
    >
      <sphereGeometry args={[0.03 * intensity, 8, 8]} />
      <meshBasicMaterial
        color={KOREAN_COLORS.PRIMARY_CYAN}
        transparent
        opacity={1}
      />
    </mesh>
  );
};

/**
 * Thunder charge effect - electric arcs gathering energy
 */
const ThunderChargeEffect: React.FC<{
  position: [number, number, number];
  intensity: number;
}> = ({ position, intensity }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Create multiple lightning arcs in a sphere pattern
  const arcs = useMemo(() => {
    const arcData: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
    const center = new THREE.Vector3(...position);
    const radius = 0.5 * intensity;

    // Create 6 arcs from surrounding points to center
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const start = new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle * 2) * radius * 0.5,
        center.z + Math.sin(angle) * radius
      );
      arcData.push({ start, end: center });
    }

    return arcData;
  }, [position, intensity]);

  useFrame(() => {
    if (groupRef.current) {
      // Pulsing rotation
      groupRef.current.rotation.y += 0.05;
      const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central energy sphere */}
      <mesh>
        <sphereGeometry args={[0.15 * intensity, 16, 16]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Lightning arcs converging to center */}
      {arcs.map((arc, i) => (
        <LightningArc
          key={i}
          start={arc.start}
          end={arc.end}
          intensity={intensity}
          color={KOREAN_COLORS.ACCENT_BLUE}
        />
      ))}

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color={KOREAN_COLORS.PRIMARY_CYAN}
        intensity={intensity * 2}
        distance={2}
        decay={2}
      />
    </group>
  );
};

/**
 * Thunder release effect - explosive burst with lightning
 */
const ThunderReleaseEffect: React.FC<{
  position: [number, number, number];
  intensity: number;
  progress: number;
}> = ({ position, intensity, progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate electric sparks on mount
  const [sparks] = useState(() => {
    const sparkData: Array<{
      position: THREE.Vector3;
      velocity: THREE.Vector3;
    }> = [];
    const center = new THREE.Vector3(...position);

    // Create 20 sparks in random directions
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI - Math.PI / 2;
      const speed = 3 + Math.random() * 2;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * Math.cos(elevation) * speed,
        Math.sin(elevation) * speed,
        Math.sin(angle) * Math.cos(elevation) * speed
      );

      sparkData.push({ position: center.clone(), velocity });
    }

    return sparkData;
  });

  useFrame(() => {
    if (groupRef.current) {
      // Expanding explosion
      const scale = 1 + progress * 2;
      groupRef.current.scale.setScalar(scale);

      // Fade out over time (skip ElectricSpark meshes which have their own fade logic)
      groupRef.current.traverse((object) => {
        if (
          object instanceof THREE.Mesh &&
          object.material &&
          !object.userData.isElectricSpark
        ) {
          const material = object.material as THREE.Material & {
            opacity?: number;
          };
          if (material.opacity !== undefined) {
            material.opacity = (1 - progress) * intensity;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central explosion sphere */}
      <mesh>
        <sphereGeometry args={[0.5 * intensity, 16, 16]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.ACCENT_GOLD}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Expanding shockwave ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4 * intensity, 0.6 * intensity, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lightning cross pattern */}
      {[0, 1].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <boxGeometry args={[1.5 * intensity, 0.05, 0.05]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.ACCENT_RED}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Electric sparks */}
      {sparks.map((spark, i) => (
        <ElectricSpark
          key={i}
          position={spark.position}
          velocity={spark.velocity}
          intensity={intensity}
        />
      ))}

      {/* Bright flash light */}
      <pointLight
        position={[0, 0, 0]}
        color={KOREAN_COLORS.ACCENT_GOLD}
        intensity={intensity * 5 * (1 - progress)}
        distance={5}
        decay={2}
      />
    </group>
  );
};

/**
 * Main Thunder Effect Component
 * Displays charge or release effects for Jin trigram techniques
 */
export const ThunderEffect3D: React.FC<ThunderEffect3DProps> = ({
  position,
  intensity = 1.0,
  effectType,
  duration = 1000,
  onComplete,
  active = true,
}) => {
  const progressRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    progressRef.current = 0;
    completedRef.current = false;
  }, [active, effectType]);

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
    <group data-testid="thunder-effect-3d">
      {effectType === "charge" && (
        <ThunderChargeEffect position={position} intensity={intensity} />
      )}
      {effectType === "release" && (
        <ThunderReleaseEffect
          position={position}
          intensity={intensity}
          progress={progressRef.current}
        />
      )}
    </group>
  );
};

export default ThunderEffect3D;
