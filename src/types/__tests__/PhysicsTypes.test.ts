/**
 * Unit tests for PhysicsTypes module
 * Tests physics-first coordinate system conversion functions
 */

import { describe, expect, it } from "vitest";
import * as THREE from "three";
import type { Position3D } from "../physics";
import {
  type PhysicsArenaBounds,
  getPixelsPerMeter,
  metersToPixels,
  pixelsToMeters,
  calculateDistanceMeters,
} from "../PhysicsTypes";

describe("PhysicsTypes", () => {
  describe("getPixelsPerMeter", () => {
    it("should calculate pixels per meter correctly for desktop arena", () => {
      const bounds: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 960,
        height: 960,
        scale: 1.0,
        worldWidthMeters: 10,
        worldDepthMeters: 10,
      };

      const result = getPixelsPerMeter(bounds);
      expect(result).toBe(96); // 960px / 10m = 96 px/m
    });

    it("should calculate pixels per meter correctly for mobile arena", () => {
      const bounds: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        scale: 0.3125,
        worldWidthMeters: 6,
        worldDepthMeters: 6,
      };

      const result = getPixelsPerMeter(bounds);
      expect(result).toBe(50); // 300px / 6m = 50 px/m
    });

    it("should calculate pixels per meter correctly for 4K arena", () => {
      const bounds: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1920,
        scale: 2.0,
        worldWidthMeters: 14,
        worldDepthMeters: 14,
      };

      const result = getPixelsPerMeter(bounds);
      expect(result).toBeCloseTo(137.14, 2); // 1920px / 14m ≈ 137.14 px/m
    });

    it("should throw error for zero worldWidthMeters", () => {
      const bounds: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 960,
        height: 960,
        scale: 1.0,
        worldWidthMeters: 0,
        worldDepthMeters: 10,
      };

      expect(() => getPixelsPerMeter(bounds)).toThrow(
        "worldWidthMeters must be positive"
      );
    });

    it("should throw error for negative worldWidthMeters", () => {
      const bounds: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 960,
        height: 960,
        scale: 1.0,
        worldWidthMeters: -10,
        worldDepthMeters: 10,
      };

      expect(() => getPixelsPerMeter(bounds)).toThrow(
        "worldWidthMeters must be positive"
      );
    });
  });

  describe("metersToPixels", () => {
    const desktopBounds: PhysicsArenaBounds = {
      x: 0,
      y: 0,
      width: 960,
      height: 960,
      scale: 1.0,
      worldWidthMeters: 10,
      worldDepthMeters: 10,
    };

    it("should convert Position3D meters to pixels correctly", () => {
      const positionMeters: Position3D = { x: 5, y: 0, z: 3 };
      
      const result = metersToPixels(positionMeters, desktopBounds);
      
      // 96 px/m * 5m = 480px for x
      // z → y coordinate mapping for screen space
      // 96 px/m * 3m = 288px for y (from z)
      expect(result.x).toBe(480);
      expect(result.y).toBe(288);
    });

    it("should convert THREE.Vector3 meters to pixels correctly", () => {
      const positionMeters = new THREE.Vector3(2, 0, 4);
      
      const result = metersToPixels(positionMeters, desktopBounds);
      
      // 96 px/m * 2m = 192px for x
      // 96 px/m * 4m = 384px for y (from z)
      expect(result.x).toBe(192);
      expect(result.y).toBe(384);
    });

    it("should handle negative coordinates", () => {
      const positionMeters: Position3D = { x: -5, y: 0, z: -3 };
      
      const result = metersToPixels(positionMeters, desktopBounds);
      
      expect(result.x).toBe(-480);
      expect(result.y).toBe(-288);
    });

    it("should handle zero coordinates", () => {
      const positionMeters: Position3D = { x: 0, y: 0, z: 0 };
      
      const result = metersToPixels(positionMeters, desktopBounds);
      
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it("should throw error for invalid position (null)", () => {
      expect(() => metersToPixels(null as unknown as Position3D, desktopBounds)).toThrow(
        "Invalid position"
      );
    });

    it("should throw error for invalid position (undefined)", () => {
      expect(() => metersToPixels(undefined as unknown as Position3D, desktopBounds)).toThrow(
        "Invalid position"
      );
    });

    it("should throw error for position with NaN coordinates", () => {
      const positionMeters: Position3D = { x: NaN, y: 0, z: 3 };
      
      expect(() => metersToPixels(positionMeters, desktopBounds)).toThrow(
        "Invalid position"
      );
    });

    it("should throw error for position with Infinity coordinates", () => {
      const positionMeters: Position3D = { x: 5, y: 0, z: Infinity };
      
      expect(() => metersToPixels(positionMeters, desktopBounds)).toThrow(
        "Invalid position"
      );
    });
  });

  describe("pixelsToMeters", () => {
    const desktopBounds: PhysicsArenaBounds = {
      x: 0,
      y: 0,
      width: 960,
      height: 960,
      scale: 1.0,
      worldWidthMeters: 10,
      worldDepthMeters: 10,
    };

    it("should convert pixel coordinates to Position3D meters correctly", () => {
      const pixelPosition = { x: 480, y: 288 };
      
      const result = pixelsToMeters(pixelPosition, desktopBounds);
      
      // 480px / 96 px/m = 5m for x
      // 288px / 96 px/m = 3m for z (from y)
      expect(result.x).toBe(5);
      expect(result.y).toBe(0); // Always 0 for 2D to 3D conversion
      expect(result.z).toBe(3);
    });

    it("should handle negative pixel coordinates", () => {
      const pixelPosition = { x: -480, y: -288 };
      
      const result = pixelsToMeters(pixelPosition, desktopBounds);
      
      expect(result.x).toBe(-5);
      expect(result.y).toBe(0);
      expect(result.z).toBe(-3);
    });

    it("should handle zero pixel coordinates", () => {
      const pixelPosition = { x: 0, y: 0 };
      
      const result = pixelsToMeters(pixelPosition, desktopBounds);
      
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it("should throw error for NaN pixel coordinates", () => {
      const pixelPosition = { x: NaN, y: 100 };
      
      expect(() => pixelsToMeters(pixelPosition, desktopBounds)).toThrow(
        "Invalid pixel coordinates"
      );
    });

    it("should throw error for Infinity pixel coordinates", () => {
      const pixelPosition = { x: 100, y: Infinity };
      
      expect(() => pixelsToMeters(pixelPosition, desktopBounds)).toThrow(
        "Invalid pixel coordinates"
      );
    });

    it("should convert correctly for mobile arena (different px/m ratio)", () => {
      const mobileBounds: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        scale: 0.3125,
        worldWidthMeters: 6,
        worldDepthMeters: 6,
      };
      
      const pixelPosition = { x: 250, y: 150 }; // 50 px/m * 5m = 250px, 50 px/m * 3m = 150px
      
      const result = pixelsToMeters(pixelPosition, mobileBounds);
      
      expect(result.x).toBe(5);
      expect(result.z).toBe(3);
    });
  });

  describe("calculateDistanceMeters", () => {
    it("should calculate distance between two Position3D points", () => {
      const pos1: Position3D = { x: 0, y: 0, z: 0 };
      const pos2: Position3D = { x: 3, y: 0, z: 4 };
      
      const distance = calculateDistanceMeters(pos1, pos2);
      
      // Pythagorean theorem: sqrt(3² + 4²) = 5
      expect(distance).toBe(5);
    });

    it("should calculate distance between two THREE.Vector3 points", () => {
      const pos1 = new THREE.Vector3(0, 0, 0);
      const pos2 = new THREE.Vector3(3, 0, 4);
      
      const distance = calculateDistanceMeters(pos1, pos2);
      
      expect(distance).toBe(5);
    });

    it("should calculate distance with mixed Position3D and THREE.Vector3", () => {
      const pos1: Position3D = { x: 1, y: 0, z: 1 };
      const pos2 = new THREE.Vector3(4, 0, 5);
      
      const distance = calculateDistanceMeters(pos1, pos2);
      
      // sqrt((4-1)² + (5-1)²) = sqrt(9 + 16) = 5
      expect(distance).toBe(5);
    });

    it("should calculate distance in 3D space (using y coordinate)", () => {
      const pos1: Position3D = { x: 0, y: 0, z: 0 };
      const pos2: Position3D = { x: 0, y: 3, z: 4 };
      
      const distance = calculateDistanceMeters(pos1, pos2);
      
      // sqrt(3² + 4²) = 5
      expect(distance).toBe(5);
    });

    it("should return 0 for identical positions", () => {
      const pos1: Position3D = { x: 5, y: 2, z: 3 };
      const pos2: Position3D = { x: 5, y: 2, z: 3 };
      
      const distance = calculateDistanceMeters(pos1, pos2);
      
      expect(distance).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const pos1: Position3D = { x: -3, y: 0, z: -4 };
      const pos2: Position3D = { x: 0, y: 0, z: 0 };
      
      const distance = calculateDistanceMeters(pos1, pos2);
      
      expect(distance).toBe(5);
    });

    it("should throw error for invalid first position", () => {
      const pos1 = null as unknown as Position3D;
      const pos2: Position3D = { x: 0, y: 0, z: 0 };
      
      expect(() => calculateDistanceMeters(pos1, pos2)).toThrow(
        "Invalid positions for distance calculation"
      );
    });

    it("should throw error for invalid second position", () => {
      const pos1: Position3D = { x: 0, y: 0, z: 0 };
      const pos2 = undefined as unknown as Position3D;
      
      expect(() => calculateDistanceMeters(pos1, pos2)).toThrow(
        "Invalid positions for distance calculation"
      );
    });

    it("should throw error for position with NaN", () => {
      const pos1: Position3D = { x: NaN, y: 0, z: 0 };
      const pos2: Position3D = { x: 0, y: 0, z: 0 };
      
      expect(() => calculateDistanceMeters(pos1, pos2)).toThrow(
        "Invalid positions for distance calculation"
      );
    });

    it("should throw error for position with Infinity", () => {
      const pos1: Position3D = { x: 0, y: 0, z: 0 };
      const pos2: Position3D = { x: Infinity, y: 0, z: 0 };
      
      expect(() => calculateDistanceMeters(pos1, pos2)).toThrow(
        "Invalid positions for distance calculation"
      );
    });
  });
});
