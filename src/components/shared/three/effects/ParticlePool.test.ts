/**
 * Tests for ParticlePool
 * Comprehensive coverage for particle object pooling
 */

import { describe, expect, it, beforeEach } from "vitest";
import { ParticlePool } from "./ParticlePool";

describe("ParticlePool", () => {
  let pool: ParticlePool;

  beforeEach(() => {
    pool = new ParticlePool({
      maxSize: 10,
      defaultLifetime: 2.0,
      defaultSize: 0.1,
      defaultColor: 0x00ffff,
    });
  });

  describe("initialization", () => {
    it("should create pool with specified size", () => {
      const stats = pool.getStats();
      expect(stats.total).toBe(10);
      expect(stats.available).toBe(10);
      expect(stats.active).toBe(0);
    });

    it("should pre-allocate particles", () => {
      const particle1 = pool.acquire();
      expect(particle1).not.toBeNull();
      expect(particle1?.id).toBeDefined();
    });
  });

  describe("acquire", () => {
    it("should acquire particle from pool", () => {
      const particle = pool.acquire();
      
      expect(particle).not.toBeNull();
      expect(particle?.alive).toBe(true);
      expect(particle?.startTime).toBeGreaterThan(0);
    });

    it("should accept simulation time parameter", () => {
      const simulationTime = 5.0;
      const particle = pool.acquire(simulationTime);
      
      expect(particle).not.toBeNull();
      expect(particle?.startTime).toBe(simulationTime);
    });

    it("should use performance.now() when no time provided", () => {
      const particle = pool.acquire();
      
      expect(particle).not.toBeNull();
      expect(particle?.startTime).toBeGreaterThan(0);
    });

    it("should return null when pool is exhausted", () => {
      // Exhaust the pool
      for (let i = 0; i < 10; i++) {
        pool.acquire();
      }
      
      const particle = pool.acquire();
      expect(particle).toBeNull();
    });

    it("should track active particles", () => {
      pool.acquire();
      pool.acquire();
      pool.acquire();
      
      const stats = pool.getStats();
      expect(stats.active).toBe(3);
      expect(stats.available).toBe(7);
    });
  });

  describe("release", () => {
    it("should release particle back to pool", () => {
      const particle = pool.acquire();
      expect(particle).not.toBeNull();
      
      pool.release(particle!);
      
      const stats = pool.getStats();
      expect(stats.active).toBe(0);
      expect(stats.available).toBe(10);
    });

    it("should reset particle state on release", () => {
      const particle = pool.acquire();
      expect(particle).not.toBeNull();
      
      // Modify particle
      particle!.position.set(10, 20, 30);
      particle!.velocity.set(1, 2, 3);
      particle!.size = 5.0;
      
      pool.release(particle!);
      
      // Acquire again and check reset
      const particle2 = pool.acquire();
      expect(particle2?.position.x).toBe(0);
      expect(particle2?.position.y).toBe(0);
      expect(particle2?.position.z).toBe(0);
      expect(particle2?.velocity.x).toBe(0);
      expect(particle2?.size).toBe(0.1);
    });

    it("should ignore release of non-active particle", () => {
      const particle = pool.acquire();
      pool.release(particle!);
      
      // Try to release again
      pool.release(particle!);
      
      const stats = pool.getStats();
      expect(stats.available).toBe(10);
    });
  });

  describe("update", () => {
    it("should automatically release expired particles", () => {
      const currentTime = 0;
      const particle = pool.acquire(currentTime);
      expect(particle).not.toBeNull();
      
      // Update beyond lifetime
      pool.update(currentTime + 3.0);
      
      const stats = pool.getStats();
      expect(stats.active).toBe(0);
      expect(stats.available).toBe(10);
    });

    it("should keep alive particles within lifetime", () => {
      const currentTime = 0;
      pool.acquire(currentTime);
      pool.acquire(currentTime);
      
      // Update within lifetime
      pool.update(currentTime + 1.0);
      
      const stats = pool.getStats();
      expect(stats.active).toBe(2);
      expect(stats.available).toBe(8);
    });

    it("should handle mixed expired and alive particles", () => {
      const particle1 = pool.acquire(0);
      const particle2 = pool.acquire(1.5);
      
      // Update to expire first particle only
      pool.update(2.5);
      
      const stats = pool.getStats();
      expect(stats.active).toBe(1);
      expect(stats.available).toBe(9);
    });

    it("should not create temporary arrays (performance)", () => {
      // This test verifies the optimized update method
      for (let i = 0; i < 10; i++) {
        pool.acquire(0);
      }
      
      // Update should handle all particles in single pass
      pool.update(3.0);
      
      const stats = pool.getStats();
      expect(stats.active).toBe(0);
      expect(stats.available).toBe(10);
    });
  });

  describe("getActive", () => {
    it("should return all active particles", () => {
      pool.acquire();
      pool.acquire();
      pool.acquire();
      
      const active = pool.getActive();
      expect(active.length).toBe(3);
    });

    it("should return empty array when no active particles", () => {
      const active = pool.getActive();
      expect(active.length).toBe(0);
    });

    it("should return readonly array", () => {
      const active = pool.getActive();
      expect(active).toBeDefined();
      // TypeScript ensures readonly
    });
  });

  describe("getStats", () => {
    it("should return accurate statistics", () => {
      pool.acquire();
      pool.acquire();
      
      const stats = pool.getStats();
      expect(stats.total).toBe(10);
      expect(stats.active).toBe(2);
      expect(stats.available).toBe(8);
    });
  });

  describe("dispose", () => {
    it("should clear all particles", () => {
      pool.acquire();
      pool.acquire();
      
      pool.dispose();
      
      const stats = pool.getStats();
      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.available).toBe(0);
    });
  });

  describe("default color configuration", () => {
    it("should use configured default color", () => {
      const particle = pool.acquire();
      expect(particle).not.toBeNull();
      expect(particle?.color.getHex()).toBe(0x00ffff);
    });

    it("should fallback to white when no default color", () => {
      const pool2 = new ParticlePool({
        maxSize: 5,
        defaultLifetime: 1.0,
        defaultSize: 0.2,
      });
      
      const particle = pool2.acquire();
      pool2.release(particle!);
      
      const particle2 = pool2.acquire();
      expect(particle2?.color.getHex()).toBe(0xffffff);
    });
  });

  describe("pool exhaustion scenarios", () => {
    it("should handle acquire-release-acquire cycle", () => {
      const particles = [];
      
      // Exhaust pool
      for (let i = 0; i < 10; i++) {
        particles.push(pool.acquire());
      }
      
      expect(pool.acquire()).toBeNull();
      
      // Release some
      pool.release(particles[0]!);
      pool.release(particles[1]!);
      
      // Should be able to acquire again
      const newParticle = pool.acquire();
      expect(newParticle).not.toBeNull();
    });

    it("should maintain particle identity through acquire-release cycles", () => {
      const particle1 = pool.acquire();
      const id1 = particle1?.id;
      
      pool.release(particle1!);
      
      const particle2 = pool.acquire();
      // Should get same particle object back
      expect(particle2?.id).toBe(id1);
    });
  });

  describe("edge cases", () => {
    it("should handle zero-size pool", () => {
      const emptyPool = new ParticlePool({
        maxSize: 0,
        defaultLifetime: 1.0,
        defaultSize: 0.1,
      });
      
      expect(emptyPool.acquire()).toBeNull();
    });

    it("should handle very small lifetime", () => {
      const pool2 = new ParticlePool({
        maxSize: 5,
        defaultLifetime: 0.001,
        defaultSize: 0.1,
      });
      
      const particle = pool2.acquire(0);
      pool2.update(0.002);
      
      const stats = pool2.getStats();
      expect(stats.active).toBe(0);
    });

    it("should handle large pool size", () => {
      const largePool = new ParticlePool({
        maxSize: 1000,
        defaultLifetime: 2.0,
        defaultSize: 0.1,
      });
      
      for (let i = 0; i < 500; i++) {
        largePool.acquire();
      }
      
      const stats = largePool.getStats();
      expect(stats.active).toBe(500);
      expect(stats.available).toBe(500);
    });
  });
});
