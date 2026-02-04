/**
 * ParticlePool - Object pooling system for Three.js particle systems
 *
 * Provides efficient memory management for particle effects by reusing
 * Three.js Points objects instead of creating/destroying them repeatedly.
 * Essential for maintaining 60fps during intense combat with many effects.
 *
 * Features:
 * - Object pooling to avoid GC pressure
 * - Automatic pool size management
 * - Lifetime tracking for automatic cleanup
 * - Memory-efficient particle reuse
 *
 * @module utils/particlePool
 * @category Performance
 * @korean 입자풀
 */

import * as THREE from "three";

/**
 * Pooled particle system instance
 */
interface PooledParticleSystem {
  /** The Three.js Points object */
  points: THREE.Points;
  /** Whether this system is currently in use */
  active: boolean;
  /** How long this system has been active (seconds) */
  lifetime: number;
  /** Unique identifier for tracking */
  id: string;
}

/**
 * Configuration for particle pool
 */
export interface ParticlePoolConfig {
  /** Maximum number of particle systems to pool */
  readonly maxSize?: number;
  /** Maximum particles per system */
  readonly particlesPerSystem?: number;
  /** Whether to enable debug logging */
  readonly debug?: boolean;
}

/**
 * ParticlePool Class
 *
 * Manages a pool of reusable Three.js Points objects for particle effects.
 * Reduces garbage collection pressure by reusing existing objects.
 *
 * @example
 * ```typescript
 * const pool = new ParticlePool({ maxSize: 50, particlesPerSystem: 100 });
 *
 * // Acquire a particle system
 * const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
 * const points = pool.acquire(100, material);
 * scene.add(points);
 *
 * // Later, when effect completes
 * scene.remove(points);
 * pool.release(points);
 *
 * // Cleanup when done
 * pool.dispose();
 * ```
 */
export class ParticlePool {
  private pool: PooledParticleSystem[] = [];
  private readonly maxSize: number;
  private readonly particlesPerSystem: number;
  private readonly debug: boolean;
  private nextId = 0;

  /**
   * Create a new particle pool
   *
   * @param config - Pool configuration
   */
  constructor(config: ParticlePoolConfig = {}) {
    this.maxSize = config.maxSize ?? 50;
    this.particlesPerSystem = config.particlesPerSystem ?? 200;
    this.debug = config.debug ?? false;

    if (this.debug) {
      console.log(
        `[ParticlePool] Created with maxSize=${this.maxSize}, particlesPerSystem=${this.particlesPerSystem}`
      );
    }
  }

  /**
   * Acquire a particle system from the pool
   *
   * Returns an existing inactive system if available, otherwise creates a new one.
   * If pool is full, reuses the oldest active system.
   *
   * **Resource Management**: When reusing a system, the old material is automatically
   * disposed if it differs from the new material. Geometries are disposed and recreated
   * only when the particle count changes. This ensures proper memory management while
   * maximizing reuse.
   *
   * @param particleCount - Number of particles needed
   * @param material - Material to use for the particles (will be managed by the pool)
   * @returns A Three.js Points object ready to use
   */
  acquire(
    particleCount: number,
    material: THREE.PointsMaterial
  ): THREE.Points {
    // Find inactive system
    const inactive = this.pool.find((p) => !p.active);

    if (inactive) {
      inactive.active = true;
      inactive.lifetime = 0;
      
      // Dispose old material if different from new material
      // (Materials might be shared, so only dispose if we're replacing)
      if (inactive.points.material !== material) {
        const oldMaterial = inactive.points.material;
        if (Array.isArray(oldMaterial)) {
          oldMaterial.forEach((m) => m.dispose());
        } else {
          oldMaterial.dispose();
        }
      }
      inactive.points.material = material;

      // Resize geometry if needed
      const currentSize =
        inactive.points.geometry.attributes.position.count;
      if (currentSize !== particleCount) {
        inactive.points.geometry.dispose();
        const positions = new Float32Array(particleCount * 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        inactive.points.geometry = geometry;
      }

      if (this.debug) {
        console.log(
          `[ParticlePool] Acquired inactive system ${inactive.id}`
        );
      }

      return inactive.points;
    }

    // Create new if pool not full
    if (this.pool.length < this.maxSize) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const points = new THREE.Points(geometry, material);
      const id = `particle-system-${this.nextId++}`;

      const pooled: PooledParticleSystem = {
        points,
        active: true,
        lifetime: 0,
        id,
      };

      this.pool.push(pooled);

      if (this.debug) {
        console.log(
          `[ParticlePool] Created new system ${id} (pool size: ${this.pool.length}/${this.maxSize})`
        );
      }

      return points;
    }

    // Pool is full, reuse oldest active system
    const oldest = this.pool.reduce((prev, curr) =>
      curr.lifetime > prev.lifetime ? curr : prev
    );
    oldest.active = true;
    oldest.lifetime = 0;
    
    // Dispose old material if different from new material
    if (oldest.points.material !== material) {
      const oldMaterial = oldest.points.material;
      if (Array.isArray(oldMaterial)) {
        oldMaterial.forEach((m) => m.dispose());
      } else {
        oldMaterial.dispose();
      }
    }
    oldest.points.material = material;

    // Resize geometry if needed
    const currentSize = oldest.points.geometry.attributes.position.count;
    if (currentSize !== particleCount) {
      oldest.points.geometry.dispose();
      const positions = new Float32Array(particleCount * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      oldest.points.geometry = geometry;
    }

    if (this.debug) {
      console.warn(
        `[ParticlePool] Pool full! Reusing oldest system ${oldest.id} (lifetime: ${oldest.lifetime.toFixed(1)}s)`
      );
    }

    return oldest.points;
  }

  /**
   * Release a particle system back to the pool
   *
   * Marks the system as inactive so it can be reused. The material
   * is NOT disposed as it may be shared or reused.
   *
   * @param points - The Points object to release
   */
  release(points: THREE.Points): void {
    const pooled = this.pool.find((p) => p.points === points);
    if (pooled) {
      pooled.active = false;

      if (this.debug) {
        console.log(
          `[ParticlePool] Released system ${pooled.id} (lifetime: ${pooled.lifetime.toFixed(1)}s)`
        );
      }
    } else if (this.debug) {
      console.warn(
        "[ParticlePool] Attempted to release Points object not in pool"
      );
    }
  }

  /**
   * Update all active particle systems
   *
   * Call this once per frame to track lifetimes. Useful for debugging
   * and automatic cleanup.
   *
   * @param delta - Time elapsed since last update (seconds)
   */
  update(delta: number): void {
    this.pool.forEach((p) => {
      if (p.active) {
        p.lifetime += delta;
      }
    });
  }

  /**
   * Get pool statistics
   *
   * @returns Object containing pool stats
   */
  getStats(): {
    total: number;
    active: number;
    inactive: number;
    maxSize: number;
  } {
    const active = this.pool.filter((p) => p.active).length;
    return {
      total: this.pool.length,
      active,
      inactive: this.pool.length - active,
      maxSize: this.maxSize,
    };
  }

  /**
   * Dispose all pooled particle systems
   *
   * Cleans up all geometries and materials. Call this when the pool
   * is no longer needed.
   *
   * ⚠️ Warning: Materials are disposed! If materials are shared between
   * multiple particle systems outside the pool, dispose them separately.
   */
  dispose(): void {
    this.pool.forEach((p) => {
      p.points.geometry.dispose();
      if (Array.isArray(p.points.material)) {
        p.points.material.forEach((m) => m.dispose());
      } else {
        p.points.material.dispose();
      }
    });
    this.pool = [];

    if (this.debug) {
      console.log("[ParticlePool] Disposed all particle systems");
    }
  }

  /**
   * Clear inactive particle systems
   *
   * Removes inactive systems from the pool to free memory.
   * Useful for managing memory in long-running sessions.
   */
  clearInactive(): void {
    const beforeCount = this.pool.length;
    const toRemove = this.pool.filter((p) => !p.active);

    toRemove.forEach((p) => {
      p.points.geometry.dispose();
      if (Array.isArray(p.points.material)) {
        p.points.material.forEach((m) => m.dispose());
      } else {
        p.points.material.dispose();
      }
    });

    this.pool = this.pool.filter((p) => p.active);

    if (this.debug) {
      console.log(
        `[ParticlePool] Cleared ${beforeCount - this.pool.length} inactive systems`
      );
    }
  }
}

/**
 * Global particle pool instance
 *
 * Shared pool for all particle effects in the application.
 * Use this for most cases unless you need a separate pool.
 *
 * @example
 * ```typescript
 * import { globalParticlePool } from '@/utils/particlePool';
 *
 * const material = new THREE.PointsMaterial({ color: 0xff0000 });
 * const points = globalParticlePool.acquire(100, material);
 * ```
 */
export const globalParticlePool = new ParticlePool({
  maxSize: 50,
  particlesPerSystem: 200,
  debug: process.env.NODE_ENV === "development",
});
