/**
 * Tests for InstancedGeometry utilities
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  getOptimalInstanceLimit,
  batchInstances,
  createInstancesFromPositions,
} from "./InstancedGeometry";

describe("InstancedGeometry", () => {
  describe("getOptimalInstanceLimit", () => {
    it("should return full limit for desktop", () => {
      const result = getOptimalInstanceLimit(100, false);
      expect(result).toBe(100);
    });

    it("should return 50% limit for mobile", () => {
      const result = getOptimalInstanceLimit(100, true);
      expect(result).toBe(50);
    });

    it("should handle various base limits", () => {
      expect(getOptimalInstanceLimit(200, true)).toBe(100);
      expect(getOptimalInstanceLimit(50, true)).toBe(25);
      expect(getOptimalInstanceLimit(1000, true)).toBe(500);
    });

    it("should floor fractional results", () => {
      const result = getOptimalInstanceLimit(75, true);
      expect(result).toBe(37); // Floor of 37.5
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe("batchInstances", () => {
    it("should batch instances into chunks", () => {
      const instances = Array.from({ length: 100 }, (_, i) => i);
      const batches = batchInstances(instances, 25);

      expect(batches.length).toBe(4);
      expect(batches[0].length).toBe(25);
      expect(batches[3].length).toBe(25);
    });

    it("should handle uneven batches", () => {
      const instances = Array.from({ length: 105 }, (_, i) => i);
      const batches = batchInstances(instances, 25);

      expect(batches.length).toBe(5);
      expect(batches[0].length).toBe(25);
      expect(batches[4].length).toBe(5); // Last batch smaller
    });

    it("should handle single batch", () => {
      const instances = Array.from({ length: 10 }, (_, i) => i);
      const batches = batchInstances(instances, 25);

      expect(batches.length).toBe(1);
      expect(batches[0].length).toBe(10);
    });

    it("should handle empty input", () => {
      const batches = batchInstances([], 25);
      expect(batches.length).toBe(0);
    });

    it("should preserve instance order", () => {
      const instances = [1, 2, 3, 4, 5];
      const batches = batchInstances(instances, 2);

      expect(batches[0]).toEqual([1, 2]);
      expect(batches[1]).toEqual([3, 4]);
      expect(batches[2]).toEqual([5]);
    });

    it("should handle batch size of 1", () => {
      const instances = [1, 2, 3];
      const batches = batchInstances(instances, 1);

      expect(batches.length).toBe(3);
      expect(batches[0]).toEqual([1]);
      expect(batches[1]).toEqual([2]);
      expect(batches[2]).toEqual([3]);
    });
  });

  describe("createInstancesFromPositions", () => {
    it("should create instances from position arrays", () => {
      const positions: [number, number, number][] = [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
      ];

      const instances = createInstancesFromPositions(positions);

      expect(instances.length).toBe(3);
      expect(instances[0].position).toEqual([0, 0, 0]);
      expect(instances[1].position).toEqual([1, 1, 1]);
      expect(instances[2].position).toEqual([2, 2, 2]);
    });

    it("should create instances from Vector3 positions", () => {
      const positions = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1),
      ];

      const instances = createInstancesFromPositions(positions);

      expect(instances.length).toBe(2);
      expect(instances[0].position).toBe(positions[0]);
      expect(instances[1].position).toBe(positions[1]);
    });

    it("should apply color to all instances", () => {
      const positions: [number, number, number][] = [
        [0, 0, 0],
        [1, 1, 1],
      ];

      const instances = createInstancesFromPositions(positions, {
        color: 0x00ffff,
      });

      expect(instances[0].color).toBe(0x00ffff);
      expect(instances[1].color).toBe(0x00ffff);
    });

    it("should apply scale to all instances", () => {
      const positions: [number, number, number][] = [[0, 0, 0]];

      const instances = createInstancesFromPositions(positions, {
        scale: 2,
      });

      expect(instances[0].scale).toBe(2);
    });

    it("should apply rotation to all instances", () => {
      const positions: [number, number, number][] = [[0, 0, 0]];
      const rotation: [number, number, number] = [0, Math.PI / 2, 0];

      const instances = createInstancesFromPositions(positions, {
        rotation,
      });

      expect(instances[0].rotation).toEqual(rotation);
    });

    it("should apply all options together", () => {
      const positions: [number, number, number][] = [[0, 0, 0]];

      const instances = createInstancesFromPositions(positions, {
        color: 0xffd700,
        scale: 1.5,
        rotation: [0, Math.PI, 0],
      });

      expect(instances[0].color).toBe(0xffd700);
      expect(instances[0].scale).toBe(1.5);
      expect(instances[0].rotation).toEqual([0, Math.PI, 0]);
    });

    it("should handle empty positions array", () => {
      const instances = createInstancesFromPositions([]);
      expect(instances.length).toBe(0);
    });

    it("should create valid InstanceData objects", () => {
      const positions: [number, number, number][] = [[1, 2, 3]];
      const instances = createInstancesFromPositions(positions);

      const instance = instances[0];
      expect(instance).toHaveProperty("position");
      expect(instance.position).toBeDefined();
    });
  });

  describe("Performance characteristics", () => {
    it("should reduce mobile instance count for performance", () => {
      const desktopLimit = 200;
      const mobileLimit = getOptimalInstanceLimit(desktopLimit, true);
      const reduction = (desktopLimit - mobileLimit) / desktopLimit;

      expect(reduction).toBe(0.5); // Exactly 50% reduction
    });

    it("batching should enable progressive rendering", () => {
      const largeSet = Array.from({ length: 1000 }, (_, i) => i);
      const batches = batchInstances(largeSet, 100);

      expect(batches.length).toBe(10);
      
      // Each batch can be rendered independently
      batches.forEach((batch) => {
        expect(batch.length).toBeLessThanOrEqual(100);
      });
    });

    it("should handle particle systems efficiently", () => {
      // Mobile particle system scenario
      const particleCount = 50; // Mobile limit
      const positions = Array.from({ length: particleCount }, () => [
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
      ] as [number, number, number]);

      const instances = createInstancesFromPositions(positions, {
        color: 0x00ffff,
        scale: 0.1,
      });

      expect(instances.length).toBe(particleCount);
      
      // All instances should be ready for GPU instancing
      instances.forEach((instance) => {
        expect(instance.position).toBeDefined();
        expect(instance.color).toBeDefined();
        expect(instance.scale).toBeDefined();
      });
    });
  });
});
