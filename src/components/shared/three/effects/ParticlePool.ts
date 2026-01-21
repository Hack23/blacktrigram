/**
 * ParticlePool - Object pooling for particle systems
 *
 * Reuses particle objects instead of creating/destroying them
 * to minimize garbage collection and improve performance.
 *
 * Features:
 * - Pre-allocated particle pool
 * - Acquire/release pattern for reuse
 * - Automatic cleanup of expired particles
 * - Memory-efficient for 1000+ particles
 *
 * @module components/shared/three/effects/ParticlePool
 * @category Performance
 * @korean 입자풀
 */

import * as THREE from "three";

/**
 * Individual particle state
 */
export interface Particle {
  /** Unique identifier */
  id: string;
  /** Current position in 3D space */
  position: THREE.Vector3;
  /** Current velocity vector */
  velocity: THREE.Vector3;
  /** Birth time in seconds */
  startTime: number;
  /** Particle lifetime in seconds */
  lifetime: number;
  /** Particle size */
  size: number;
  /** Particle color */
  color: THREE.Color;
  /** Whether particle is alive */
  alive: boolean;
}

/**
 * Particle pool configuration
 */
export interface ParticlePoolConfig {
  /** Maximum pool size */
  readonly maxSize: number;
  /** Default particle lifetime (seconds) */
  readonly defaultLifetime: number;
  /** Default particle size */
  readonly defaultSize: number;
}

/**
 * ParticlePool class for efficient particle management
 *
 * @example
 * ```typescript
 * const pool = new ParticlePool({ maxSize: 1000, defaultLifetime: 2.0, defaultSize: 0.1 });
 *
 * // Acquire particle from pool
 * const particle = pool.acquire();
 * if (particle) {
 *   particle.position.set(0, 0, 0);
 *   particle.velocity.set(1, 2, 0);
 *   particle.color.setHex(0x00ffff);
 * }
 *
 * // Update pool (call every frame)
 * pool.update(deltaTime);
 *
 * // Pool automatically releases expired particles
 * ```
 */
export class ParticlePool {
  private readonly pool: Particle[] = [];
  private readonly active: Set<Particle> = new Set();
  private readonly config: ParticlePoolConfig;
  private nextId = 0;

  constructor(config: ParticlePoolConfig) {
    this.config = config;

    // Pre-allocate particle objects
    for (let i = 0; i < config.maxSize; i++) {
      this.pool.push(this.createParticle());
    }
  }

  /**
   * Create a new particle object
   */
  private createParticle(): Particle {
    return {
      id: `particle-${this.nextId++}`,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      startTime: 0,
      lifetime: this.config.defaultLifetime,
      size: this.config.defaultSize,
      color: new THREE.Color(0xffffff),
      alive: false,
    };
  }

  /**
   * Acquire a particle from the pool
   * Returns null if pool is exhausted
   */
  acquire(): Particle | null {
    if (this.pool.length === 0) {
      return null;
    }

    const particle = this.pool.pop()!;
    particle.alive = true;
    particle.startTime = performance.now() / 1000;
    this.active.add(particle);
    return particle;
  }

  /**
   * Release a particle back to the pool
   */
  release(particle: Particle): void {
    if (!this.active.has(particle)) return;

    this.active.delete(particle);
    this.resetParticle(particle);
    this.pool.push(particle);
  }

  /**
   * Reset particle to default state
   */
  private resetParticle(particle: Particle): void {
    particle.position.set(0, 0, 0);
    particle.velocity.set(0, 0, 0);
    particle.startTime = 0;
    particle.lifetime = this.config.defaultLifetime;
    particle.size = this.config.defaultSize;
    particle.color.setHex(0xffffff);
    particle.alive = false;
  }

  /**
   * Update all active particles
   * Automatically releases expired particles
   */
  update(currentTime: number): void {
    const particlesToRelease: Particle[] = [];

    for (const particle of this.active) {
      const age = currentTime - particle.startTime;
      if (age >= particle.lifetime) {
        particlesToRelease.push(particle);
      }
    }

    // Release expired particles
    particlesToRelease.forEach((particle) => this.release(particle));
  }

  /**
   * Get all active particles
   */
  getActive(): readonly Particle[] {
    return Array.from(this.active);
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    total: number;
    active: number;
    available: number;
  } {
    return {
      total: this.config.maxSize,
      active: this.active.size,
      available: this.pool.length,
    };
  }

  /**
   * Clear all particles and reset pool
   */
  clear(): void {
    // Release all active particles
    const activeArray = Array.from(this.active);
    activeArray.forEach((particle) => this.release(particle));
  }

  /**
   * Dispose of pool resources
   */
  dispose(): void {
    this.clear();
    this.pool.length = 0;
    this.active.clear();
  }
}

export default ParticlePool;
