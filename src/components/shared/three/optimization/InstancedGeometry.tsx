/**
 * InstancedGeometry - Reusable instancing utilities for optimized rendering
 *
 * Provides helpers and components for GPU instancing to reduce draw calls.
 * Especially useful for particles, repeated geometry, and effects.
 *
 * Features:
 * - Instanced particle systems
 * - Batch rendering utilities
 * - Position/rotation/scale management
 * - Color variations per instance
 * - Korean-themed effects optimization
 *
 * Performance Impact:
 * - Reduces draw calls from N to 1 per geometry type
 * - 50%+ performance improvement for particle-heavy scenes
 * - Target: <100 draw calls per frame
 *
 * @module components/shared/three/optimization/InstancedGeometry
 * @category Performance Optimization
 * @korean 인스턴스기하학
 */

import { Instances, Instance } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Instance data for a single object
 */
export interface InstanceData {
  readonly position: THREE.Vector3 | [number, number, number];
  readonly rotation?: THREE.Euler | [number, number, number];
  readonly scale?: number | [number, number, number];
  readonly color?: THREE.ColorRepresentation;
}

/**
 * Props for InstancableSpheres component
 */
export interface InstancableSpheresProps {
  /** Array of instance data */
  readonly instances: readonly InstanceData[];
  /** Sphere radius */
  readonly radius?: number;
  /** Sphere segments (lower = better performance) */
  readonly segments?: number;
  /** Base material color */
  readonly color?: THREE.ColorRepresentation;
  /** Material properties */
  readonly materialProps?: Partial<THREE.MeshBasicMaterialParameters>;
}

/**
 * Instanced spheres component
 *
 * Renders multiple spheres with a single draw call.
 * Ideal for particles, projectiles, effects.
 *
 * @example
 * ```tsx
 * const particles = useMemo(() =>
 *   Array.from({ length: 50 }, (_, i) => ({
 *     position: [Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5],
 *     color: i % 2 === 0 ? 0x00ffff : 0xffd700,
 *   })),
 *   []
 * );
 *
 * <InstancableSpheres
 *   instances={particles}
 *   radius={0.1}
 *   segments={8}
 * />
 * ```
 */
export const InstancableSpheres: React.FC<InstancableSpheresProps> = ({
  instances,
  radius = 0.1,
  segments = 8,
  color = 0x00ffff,
  materialProps = {},
}) => {
  return (
    <Instances limit={instances.length}>
      <sphereGeometry args={[radius, segments, segments]} />
      <meshBasicMaterial color={color} {...materialProps} />
      {instances.map((instance, index) => (
        <Instance
          key={index}
          position={instance.position}
          rotation={instance.rotation}
          scale={instance.scale}
          color={instance.color}
        />
      ))}
    </Instances>
  );
};

/**
 * Props for InstancableBoxes component
 */
export interface InstancableBoxesProps {
  /** Array of instance data */
  readonly instances: readonly InstanceData[];
  /** Box dimensions [width, height, depth] */
  readonly size?: [number, number, number];
  /** Base material color */
  readonly color?: THREE.ColorRepresentation;
  /** Material properties */
  readonly materialProps?: Partial<THREE.MeshStandardMaterialParameters>;
}

/**
 * Instanced boxes component
 *
 * Renders multiple boxes with a single draw call.
 * Useful for environment objects, obstacles, UI elements.
 *
 * @example
 * ```tsx
 * <InstancableBoxes
 *   instances={[
 *     { position: [0, 0, 0], scale: 1 },
 *     { position: [2, 0, 0], scale: 1.5 },
 *   ]}
 *   size={[1, 1, 1]}
 *   color={0x404040}
 * />
 * ```
 */
export const InstancableBoxes: React.FC<InstancableBoxesProps> = ({
  instances,
  size = [1, 1, 1],
  color = 0x00ffff,
  materialProps = {},
}) => {
  return (
    <Instances limit={instances.length}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} {...materialProps} />
      {instances.map((instance, index) => (
        <Instance
          key={index}
          position={instance.position}
          rotation={instance.rotation}
          scale={instance.scale}
          color={instance.color}
        />
      ))}
    </Instances>
  );
};

/**
 * Props for InstancableParticles component
 */
export interface InstancableParticlesProps {
  /** Particle positions */
  readonly positions: readonly (THREE.Vector3 | [number, number, number])[];
  /** Particle colors (optional) */
  readonly colors?: readonly THREE.ColorRepresentation[];
  /** Particle size */
  readonly size?: number;
  /** Quality level affects particle complexity */
  readonly quality?: "high" | "medium" | "low";
  /** Base particle color */
  readonly baseColor?: THREE.ColorRepresentation;
}

/**
 * Optimized instanced particles
 *
 * High-performance particle system using instancing.
 * Quality parameter adjusts geometry complexity.
 *
 * @example
 * ```tsx
 * const positions = useMemo(() =>
 *   Array.from({ length: 100 }, () => [
 *     Math.random() * 10 - 5,
 *     Math.random() * 5,
 *     Math.random() * 10 - 5,
 *   ]),
 *   []
 * );
 *
 * <InstancableParticles
 *   positions={positions}
 *   size={0.1}
 *   quality="medium"
 *   baseColor={0x00ffff}
 * />
 * ```
 */
export const InstancableParticles: React.FC<InstancableParticlesProps> = ({
  positions,
  colors,
  size = 0.1,
  quality = "medium",
  baseColor = 0x00ffff,
}) => {
  // Adjust geometry complexity based on quality
  const segments = useMemo(() => {
    switch (quality) {
      case "high":
        return 16;
      case "medium":
        return 8;
      case "low":
        return 4;
      default:
        return 8;
    }
  }, [quality]);

  const instances = useMemo(
    () =>
      positions.map((position, index) => ({
        position,
        color: colors?.[index] ?? baseColor,
        scale: size,
      })),
    [positions, colors, baseColor, size]
  );

  return (
    <Instances limit={positions.length}>
      <sphereGeometry args={[1, segments, segments]} />
      <meshBasicMaterial transparent opacity={0.8} />
      {instances.map((instance, index) => (
        <Instance
          key={index}
          position={instance.position}
          scale={instance.scale}
          color={instance.color}
        />
      ))}
    </Instances>
  );
};

/**
 * Calculate optimal instance limit based on performance tier
 *
 * @param baseLimit - Ideal instance count
 * @param isMobile - Whether device is mobile
 * @returns Adjusted instance limit
 */
export function getOptimalInstanceLimit(
  baseLimit: number,
  isMobile: boolean
): number {
  if (isMobile) {
    // 50% reduction on mobile
    return Math.floor(baseLimit * 0.5);
  }
  return baseLimit;
}

/**
 * Batch instance data into chunks for efficient rendering
 *
 * @param instances - Array of instance data
 * @param batchSize - Maximum instances per batch
 * @returns Array of batched instances
 */
export function batchInstances<T>(
  instances: readonly T[],
  batchSize: number
): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < instances.length; i += batchSize) {
    batches.push(instances.slice(i, i + batchSize) as T[]);
  }
  return batches;
}

/**
 * Create instance data from positions array
 *
 * @param positions - Array of positions
 * @param options - Optional instance properties
 * @returns Array of instance data
 */
export function createInstancesFromPositions(
  positions: readonly (THREE.Vector3 | [number, number, number])[],
  options: {
    color?: THREE.ColorRepresentation;
    scale?: number | [number, number, number];
    rotation?: THREE.Euler | [number, number, number];
  } = {}
): InstanceData[] {
  return positions.map((position) => ({
    position,
    color: options.color,
    scale: options.scale,
    rotation: options.rotation,
  }));
}
