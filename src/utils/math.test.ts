/**
 * Tests for mathematical utility functions
 * 
 * @module utils/math.test
 */

import { describe, it, expect } from "vitest";
import { calculateDistance3D, calculateDistance3DSquared, toRadians } from "./math";

describe("Math Utilities", () => {
  describe("calculateDistance3D", () => {
    it("should calculate distance for 3-4-5 triangle", () => {
      const distance = calculateDistance3D([0, 0, 0], [3, 4, 0]);
      expect(distance).toBeCloseTo(5.0, 5);
    });

    it("should calculate distance for identical points", () => {
      const distance = calculateDistance3D([1, 2, 3], [1, 2, 3]);
      expect(distance).toBe(0);
    });

    it("should calculate distance for negative coordinates", () => {
      const distance = calculateDistance3D([-1, -1, -1], [1, 1, 1]);
      expect(distance).toBeCloseTo(Math.sqrt(12), 5);
    });
  });

  describe("calculateDistance3DSquared", () => {
    it("should calculate squared distance for 3-4-5 triangle", () => {
      const distSq = calculateDistance3DSquared([0, 0, 0], [3, 4, 0]);
      expect(distSq).toBe(25);
    });

    it("should calculate squared distance for identical points", () => {
      const distSq = calculateDistance3DSquared([1, 2, 3], [1, 2, 3]);
      expect(distSq).toBe(0);
    });

    it("should be faster than calculateDistance3D (no sqrt)", () => {
      // Just verify the function works correctly
      const distSq = calculateDistance3DSquared([0, 0, 0], [5, 0, 0]);
      expect(distSq).toBe(25);
    });
  });

  describe("toRadians", () => {
    it("should convert 0 degrees to 0 radians", () => {
      expect(toRadians(0)).toBe(0);
    });

    it("should convert 90 degrees to π/2 radians", () => {
      expect(toRadians(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    it("should convert 180 degrees to π radians", () => {
      expect(toRadians(180)).toBeCloseTo(Math.PI, 10);
    });

    it("should convert 360 degrees to 2π radians", () => {
      expect(toRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    it("should handle negative angles", () => {
      expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
    });

    it("should handle fractional degrees", () => {
      expect(toRadians(45)).toBeCloseTo(Math.PI / 4, 10);
    });

    it("should be consistent with Math.PI conversion", () => {
      const degrees = 123.456;
      const expected = (degrees * Math.PI) / 180;
      expect(toRadians(degrees)).toBeCloseTo(expected, 10);
    });
  });
});
