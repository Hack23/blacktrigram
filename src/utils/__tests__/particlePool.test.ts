/**
 * Tests for ParticlePool utility
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as THREE from "three";
import { ParticlePool } from "../particlePool";

describe("ParticlePool", () => {
  let pool: ParticlePool;
  let testMaterial: THREE.PointsMaterial;

  beforeEach(() => {
    pool = new ParticlePool({
      maxSize: 3,
      particlesPerSystem: 100,
      debug: false,
    });

    testMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.1,
    });
  });

  afterEach(() => {
    pool.dispose();
    testMaterial.dispose();
  });

  describe("acquire", () => {
    it("should create new particle system when pool is empty", () => {
      const points = pool.acquire(50, testMaterial);

      expect(points).toBeInstanceOf(THREE.Points);
      expect(points.geometry.attributes.position.count).toBe(50);
      expect(points.material).toBe(testMaterial);
    });

    it("should reuse inactive particle system", () => {
      const points1 = pool.acquire(50, testMaterial);
      pool.release(points1);

      const points2 = pool.acquire(50, testMaterial);

      expect(points2).toBe(points1);
    });

    it("should create new systems up to maxSize", () => {
      const points1 = pool.acquire(50, testMaterial);
      const points2 = pool.acquire(50, testMaterial);
      const points3 = pool.acquire(50, testMaterial);

      const stats = pool.getStats();
      expect(stats.total).toBe(3);
      expect(stats.active).toBe(3);
      expect(stats.inactive).toBe(0);

      // All three should be different objects
      expect(points1).not.toBe(points2);
      expect(points2).not.toBe(points3);
      expect(points1).not.toBe(points3);
    });

    it("should reuse oldest system when pool is full", () => {
      const material2 = new THREE.PointsMaterial({ color: 0x00ff00 });
      const material3 = new THREE.PointsMaterial({ color: 0x0000ff });

      // Fill the pool
      const points1 = pool.acquire(50, testMaterial);
      pool.acquire(50, material2);
      pool.acquire(50, material3);

      // Make points1 the oldest by updating lifetimes
      pool.update(1.0); // All active systems get +1s lifetime

      // Acquire new system (should reuse points1 since it's oldest)
      const material4 = new THREE.PointsMaterial({ color: 0xffff00 });
      const points4 = pool.acquire(50, material4);

      // points4 should be the same object as points1
      expect(points4).toBe(points1);

      // Check pool hasn't grown
      const stats = pool.getStats();
      expect(stats.total).toBe(3);

      // Cleanup
      material2.dispose();
      material3.dispose();
      material4.dispose();
    });

    it("should resize geometry when particle count changes", () => {
      const points1 = pool.acquire(50, testMaterial);
      expect(points1.geometry.attributes.position.count).toBe(50);

      pool.release(points1);

      const points2 = pool.acquire(100, testMaterial);
      expect(points2).toBe(points1);
      expect(points2.geometry.attributes.position.count).toBe(100);
    });
  });

  describe("release", () => {
    it("should mark system as inactive", () => {
      const points = pool.acquire(50, testMaterial);
      const statsBefore = pool.getStats();
      expect(statsBefore.active).toBe(1);
      expect(statsBefore.inactive).toBe(0);

      pool.release(points);

      const statsAfter = pool.getStats();
      expect(statsAfter.active).toBe(0);
      expect(statsAfter.inactive).toBe(1);
    });

    it("should handle releasing non-pooled Points", () => {
      const externalPoints = new THREE.Points(
        new THREE.BufferGeometry(),
        testMaterial
      );

      // Should not throw
      expect(() => pool.release(externalPoints)).not.toThrow();

      // Pool should be empty
      const stats = pool.getStats();
      expect(stats.total).toBe(0);

      // Cleanup
      externalPoints.geometry.dispose();
    });
  });

  describe("update", () => {
    it("should track lifetime of active systems", () => {
      pool.acquire(50, testMaterial);

      pool.update(1.0);
      pool.update(0.5);
      pool.update(0.3);

      // Lifetime should be accumulated
      // We can't directly access lifetime, but we can verify behavior through stats
      const stats = pool.getStats();
      expect(stats.active).toBe(1);
    });

    it("should not update inactive systems", () => {
      const points = pool.acquire(50, testMaterial);
      pool.update(1.0);
      pool.release(points);

      // After release, updates shouldn't affect this system
      pool.update(10.0);

      const stats = pool.getStats();
      expect(stats.inactive).toBe(1);
    });
  });

  describe("getStats", () => {
    it("should return correct stats for empty pool", () => {
      const stats = pool.getStats();

      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.inactive).toBe(0);
      expect(stats.maxSize).toBe(3);
    });

    it("should return correct stats for mixed pool", () => {
      pool.acquire(50, testMaterial);
      const points2 = pool.acquire(50, testMaterial);
      pool.acquire(50, testMaterial);

      pool.release(points2);

      const stats = pool.getStats();

      expect(stats.total).toBe(3);
      expect(stats.active).toBe(2);
      expect(stats.inactive).toBe(1);
      expect(stats.maxSize).toBe(3);
    });
  });

  describe("clearInactive", () => {
    it("should remove inactive systems", () => {
      const points1 = pool.acquire(50, testMaterial);
      const points2 = pool.acquire(50, testMaterial);
      pool.acquire(50, testMaterial);

      pool.release(points1);
      pool.release(points2);

      const statsBefore = pool.getStats();
      expect(statsBefore.total).toBe(3);
      expect(statsBefore.inactive).toBe(2);

      pool.clearInactive();

      const statsAfter = pool.getStats();
      expect(statsAfter.total).toBe(1);
      expect(statsAfter.active).toBe(1);
      expect(statsAfter.inactive).toBe(0);
    });

    it("should not remove active systems", () => {
      pool.acquire(50, testMaterial);
      pool.acquire(50, testMaterial);

      pool.clearInactive();

      const stats = pool.getStats();
      expect(stats.total).toBe(2);
      expect(stats.active).toBe(2);
    });
  });

  describe("dispose", () => {
    it("should dispose all geometries and materials", () => {
      const points1 = pool.acquire(50, testMaterial);
      const points2 = pool.acquire(50, testMaterial);

      // Create spy-like verification
      const geometry1Disposed =
        points1.geometry.attributes.position === undefined;
      const geometry2Disposed =
        points2.geometry.attributes.position === undefined;

      expect(geometry1Disposed).toBe(false);
      expect(geometry2Disposed).toBe(false);

      pool.dispose();

      const stats = pool.getStats();
      expect(stats.total).toBe(0);
    });

    it("should clear the pool", () => {
      pool.acquire(50, testMaterial);
      pool.acquire(50, testMaterial);

      pool.dispose();

      const stats = pool.getStats();
      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.inactive).toBe(0);
    });
  });

  describe("configuration", () => {
    it("should use default configuration", () => {
      const defaultPool = new ParticlePool();
      const stats = defaultPool.getStats();

      expect(stats.maxSize).toBe(50);

      defaultPool.dispose();
    });

    it("should respect custom configuration", () => {
      const customPool = new ParticlePool({
        maxSize: 10,
        particlesPerSystem: 500,
      });

      const stats = customPool.getStats();
      expect(stats.maxSize).toBe(10);

      customPool.dispose();
    });
  });
});
