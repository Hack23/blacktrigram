/**
 * AtmosphericParticles3D - Three.js 3D atmospheric particle effects
 *
 * Renders rain/mist particles for environmental depth in the combat arena
 * Creates an immersive cyberpunk urban night atmosphere
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Props for the AtmosphericParticles3D component.
 */
export interface AtmosphericParticles3DProps {
  /** Number of particles to render. Defaults to 500 */
  readonly count?: number;
  /** Scale factor for particle spread (1.0 = desktop, <1.0 = mobile). Defaults to 1.0 */
  readonly scale?: number;
  /** Particle fall speed. Defaults to 2 */
  readonly speed?: number;
}

/**
 * Generate particle positions using a deterministic pattern
 * This avoids Math.random() in render functions for React purity
 */
function generateParticlePositions(
  count: number,
  spreadX: number,
  spreadY: number,
  spreadZ: number
): Float32Array {
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = i / count; // Normalized index [0, 1]

    const offsetX = Math.sin(t * 123.456) * Math.cos(t * 789.012);
    const offsetY = Math.sin(t * 234.567) * Math.cos(t * 890.123);
    const offsetZ = Math.sin(t * 345.678) * Math.cos(t * 901.234);

    pos[i * 3] = offsetX * spreadX * 0.5;
    pos[i * 3 + 1] = offsetY * spreadY * 0.5 + spreadY * 0.5; // Bias upward
    pos[i * 3 + 2] = offsetZ * spreadZ * 0.5;
  }

  return pos;
}

/**
 * AtmosphericParticles3D Component
 * Creates rain/mist particle effects for atmospheric depth
 *
 * Performance optimized with:
 * - BufferGeometry for efficient rendering
 * - Additive blending for transparent particles
 * - Configurable particle count for mobile optimization
 * - Deterministic position generation (no Math.random in render)
 */
export const AtmosphericParticles3D: React.FC<
  AtmosphericParticles3DProps
> = ({ count = 500, scale = 1.0, speed = 2 }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [geometry] = useState(() => new THREE.BufferGeometry());

  const spreadX = 40 * scale;
  const spreadY = 20;
  const spreadZ = 40 * scale;

  useEffect(() => {
    const positions = generateParticlePositions(
      count,
      spreadX,
      spreadY,
      spreadZ
    );
    
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return () => {
      geometry.dispose();
    };
  }, [count, spreadX, spreadY, spreadZ, geometry]);

  useFrame((_state, delta) => {
    if (!particlesRef.current) return;

    const positions =
      particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * speed; // Fall down
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = spreadY; // Reset to top
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color={0xffffff}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default AtmosphericParticles3D;
