/**
 * Tests for LODSystem
 */

import { describe, it, expect } from "vitest";
import {
  DEFAULT_LOD_DISTANCES,
  MOBILE_LOD_DISTANCES,
  calculateLODDistances,
  getLODParticleCount,
  getLODShadowQuality,
  LODCharacter,
  LODEffect,
} from "./LODSystem";

describe("LODSystem", () => {
  describe("LOD distance constants", () => {
    it("should have default LOD distances", () => {
      expect(DEFAULT_LOD_DISTANCES).toEqual({
        high: 0,
        medium: 12,
      });
    });

    it("should have mobile LOD distances", () => {
      expect(MOBILE_LOD_DISTANCES).toEqual({
        high: 0,
        medium: 8,
      });
    });

    it("mobile distances should be more aggressive than desktop", () => {
      expect(MOBILE_LOD_DISTANCES.medium).toBeLessThan(
        DEFAULT_LOD_DISTANCES.medium
      );
    });
  });

  describe("calculateLODDistances", () => {
    it("should calculate LOD distances based on arena size", () => {
      const distances = calculateLODDistances(16, 8);

      expect(distances.high).toBe(0);
      expect(distances.medium).toBeGreaterThan(0);
      expect(distances.medium).toBeLessThan(20); // Should be reasonable
    });

    it("should scale with arena size", () => {
      const small = calculateLODDistances(10, 10);
      const large = calculateLODDistances(20, 20);

      expect(large.medium).toBeGreaterThan(small.medium);
    });

    it("should handle square arenas", () => {
      const distances = calculateLODDistances(10, 10);
      
      expect(distances.high).toBe(0);
      expect(distances.medium).toBeCloseTo(5.66, 1); // 40% of diagonal ≈ 5.66
    });

    it("should handle rectangular arenas", () => {
      const distances = calculateLODDistances(16, 8);
      
      const diagonal = Math.sqrt(16 * 16 + 8 * 8);
      const expectedMedium = diagonal * 0.4;
      
      expect(distances.medium).toBeCloseTo(expectedMedium, 2);
    });
  });

  describe("getLODParticleCount", () => {
    it("should return full count for high detail", () => {
      const result = getLODParticleCount(100, "high");
      expect(result).toBe(100);
    });

    it("should return 60% for medium detail", () => {
      const result = getLODParticleCount(100, "medium");
      expect(result).toBe(60);
    });

    it("should return 30% for low detail", () => {
      const result = getLODParticleCount(100, "low");
      expect(result).toBe(30);
    });

    it("should handle fractional counts", () => {
      // 50 particles
      expect(getLODParticleCount(50, "high")).toBe(50);
      expect(getLODParticleCount(50, "medium")).toBe(30); // Floor of 30
      expect(getLODParticleCount(50, "low")).toBe(15);
    });

    it("should handle small counts", () => {
      expect(getLODParticleCount(10, "high")).toBe(10);
      expect(getLODParticleCount(10, "medium")).toBe(6);
      expect(getLODParticleCount(10, "low")).toBe(3);
    });

    it("should reduce particle count progressively", () => {
      const base = 100;
      const high = getLODParticleCount(base, "high");
      const medium = getLODParticleCount(base, "medium");
      const low = getLODParticleCount(base, "low");

      expect(high).toBeGreaterThan(medium);
      expect(medium).toBeGreaterThan(low);
    });
  });

  describe("getLODShadowQuality", () => {
    it("should return 2048 for high detail", () => {
      expect(getLODShadowQuality("high")).toBe(2048);
    });

    it("should return 1024 for medium detail", () => {
      expect(getLODShadowQuality("medium")).toBe(1024);
    });

    it("should return 512 for low detail", () => {
      expect(getLODShadowQuality("low")).toBe(512);
    });

    it("should decrease shadow quality progressively", () => {
      const high = getLODShadowQuality("high");
      const medium = getLODShadowQuality("medium");
      const low = getLODShadowQuality("low");

      expect(high).toBeGreaterThan(medium);
      expect(medium).toBeGreaterThan(low);
    });

    it("should return power-of-2 values for GPU efficiency", () => {
      const values = [
        getLODShadowQuality("high"),
        getLODShadowQuality("medium"),
        getLODShadowQuality("low"),
      ];

      values.forEach((value) => {
        // Check if power of 2: log2(value) should be an integer
        const log2 = Math.log2(value);
        expect(log2).toBe(Math.floor(log2));
      });
    });
  });

  describe("Performance characteristics", () => {
    it("should provide significant reduction at low detail", () => {
      const base = 100;
      const low = getLODParticleCount(base, "low");
      const reduction = (base - low) / base;

      expect(reduction).toBeGreaterThanOrEqual(0.5); // At least 50% reduction
    });

    it("shadow map size should reduce memory usage", () => {
      // Shadow map memory usage is proportional to size^2
      const highMemory = Math.pow(getLODShadowQuality("high"), 2);
      const lowMemory = Math.pow(getLODShadowQuality("low"), 2);
      const reduction = (highMemory - lowMemory) / highMemory;

      expect(reduction).toBeGreaterThan(0.9); // >90% memory reduction
    });
  });

  describe("LOD Component rendering", () => {
    it("LODCharacter should be defined and exportable", () => {
      // Basic smoke test - ensures components can be imported
      expect(LODCharacter).toBeDefined();
      expect(typeof LODCharacter).toBe("function");
    });

    it("LODEffect should be defined and exportable", () => {
      expect(LODEffect).toBeDefined();
      expect(typeof LODEffect).toBe("function");
    });

    it("LOD utilities should be properly exported", () => {
      expect(DEFAULT_LOD_DISTANCES).toBeDefined();
      expect(MOBILE_LOD_DISTANCES).toBeDefined();
      expect(calculateLODDistances).toBeDefined();
      expect(getLODParticleCount).toBeDefined();
      expect(getLODShadowQuality).toBeDefined();
    });
  });
});
