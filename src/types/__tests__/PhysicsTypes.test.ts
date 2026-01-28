/**
 * Unit tests for PhysicsTypes module
 * Tests physics-first coordinate system conversion functions
 */

import { describe, expect, it, beforeEach } from "vitest";
import * as THREE from "three";
import type { Position3D } from "../physics";
import {
  type PhysicsArenaBounds,
  type MovementArenaBounds,
  getPixelsPerMeter,
  metersToPixels,
  pixelsToMeters,
  calculateDistanceMeters,
  calculateArenaBounds,
  clampPositionToBounds,
  isPositionInBounds,
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

describe("Arena Bounds Validation", () => {
  describe("calculateArenaBounds", () => {
    it("should calculate bounds for 10m × 7.5m arena with default margin", () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      const bounds = calculateArenaBounds(config);

      // With 0.3m default margin
      expect(bounds.minX).toBeCloseTo(-4.7, 1);
      expect(bounds.maxX).toBeCloseTo(4.7, 1);
      expect(bounds.minZ).toBeCloseTo(-3.45, 1);
      expect(bounds.maxZ).toBeCloseTo(3.45, 1);
      expect(bounds.centerX).toBe(0);
      expect(bounds.centerZ).toBe(0);
      expect(bounds.widthMeters).toBe(10);
      expect(bounds.depthMeters).toBe(7.5);
    });

    it("should calculate bounds for 6m × 4.5m small arena", () => {
      const config = {
        worldWidthMeters: 6,
        worldDepthMeters: 4.5,
      };

      const bounds = calculateArenaBounds(config, 0.3);

      expect(bounds.minX).toBeCloseTo(-2.7, 1);
      expect(bounds.maxX).toBeCloseTo(2.7, 1);
      expect(bounds.minZ).toBeCloseTo(-1.95, 1);
      expect(bounds.maxZ).toBeCloseTo(1.95, 1);
    });

    it("should calculate bounds for 14m × 10.5m ultra arena", () => {
      const config = {
        worldWidthMeters: 14,
        worldDepthMeters: 10.5,
      };

      const bounds = calculateArenaBounds(config, 0.5);

      expect(bounds.minX).toBeCloseTo(-6.5, 1);
      expect(bounds.maxX).toBeCloseTo(6.5, 1);
      expect(bounds.minZ).toBeCloseTo(-4.75, 1);
      expect(bounds.maxZ).toBeCloseTo(4.75, 1);
    });

    it("should handle custom margin", () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      const bounds = calculateArenaBounds(config, 0.5);

      expect(bounds.minX).toBeCloseTo(-4.5, 1);
      expect(bounds.maxX).toBeCloseTo(4.5, 1);
      expect(bounds.minZ).toBeCloseTo(-3.25, 1);
      expect(bounds.maxZ).toBeCloseTo(3.25, 1);
    });

    it("should throw error for non-positive width", () => {
      const config = {
        worldWidthMeters: 0,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 0.3)).toThrow(
        "worldWidthMeters must be a positive finite number"
      );
    });

    it("should throw error for negative depth", () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: -5,
      };

      expect(() => calculateArenaBounds(config, 0.3)).toThrow(
        "worldDepthMeters must be a positive finite number"
      );
    });

    it("should throw error for NaN dimensions", () => {
      const config = {
        worldWidthMeters: NaN,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 0.3)).toThrow(
        "worldWidthMeters must be a positive finite number"
      );
    });

    it("should throw error for negative margin", () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, -0.5)).toThrow(
        "margin must be a non-negative finite number"
      );
    });

    it("should throw error for margin larger than half width", () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 6)).toThrow(
        "margin (6m) must be less than half the arena width (5m)"
      );
    });

    it("should throw error for margin larger than half depth", () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 4)).toThrow(
        "margin (4m) must be less than half the arena depth (3.75m)"
      );
    });
  });

  describe("clampPositionToBounds", () => {
    let bounds: MovementArenaBounds;

    beforeEach(() => {
      bounds = {
        minX: -4.7,
        maxX: 4.7,
        minZ: -3.45,
        maxZ: 3.45,
        centerX: 0,
        centerZ: 0,
        widthMeters: 10,
        depthMeters: 7.5,
      };
    });

    it("should clamp position outside left boundary", () => {
      const position = new THREE.Vector3(-6, 0, 0);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(-4.7, 1);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBe(0);
    });

    it("should clamp position outside right boundary", () => {
      const position = new THREE.Vector3(6, 0, 0);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(4.7, 1);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBe(0);
    });

    it("should clamp position outside front boundary", () => {
      const position = new THREE.Vector3(0, 0, 5);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBe(0);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBeCloseTo(3.45, 1);
    });

    it("should clamp position outside back boundary", () => {
      const position = new THREE.Vector3(0, 0, -5);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBe(0);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBeCloseTo(-3.45, 1);
    });

    it("should not modify position within bounds", () => {
      const position = new THREE.Vector3(2, 1.8, 1);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBe(2);
      expect(clamped.y).toBe(1.8);
      expect(clamped.z).toBe(1);
    });

    it("should preserve Y coordinate (height)", () => {
      const position = new THREE.Vector3(6, 5.5, 0);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.y).toBe(5.5); // Height unchanged
    });

    it("should work with Position3D interface", () => {
      const position = { x: 6, y: 1.8, z: 5 };
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(4.7, 1);
      expect(clamped.y).toBe(1.8);
      expect(clamped.z).toBeCloseTo(3.45, 1);
    });
  });

  describe("isPositionInBounds", () => {
    let bounds: MovementArenaBounds;

    beforeEach(() => {
      bounds = {
        minX: -4.7,
        maxX: 4.7,
        minZ: -3.45,
        maxZ: 3.45,
        centerX: 0,
        centerZ: 0,
        widthMeters: 10,
        depthMeters: 7.5,
      };
    });

    it("should return true for position inside bounds", () => {
      const position = new THREE.Vector3(2, 0, 1);
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });

    it("should return false for position outside left boundary", () => {
      const position = new THREE.Vector3(-5, 0, 0);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it("should return false for position outside right boundary", () => {
      const position = new THREE.Vector3(5, 0, 0);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it("should return false for position outside front boundary", () => {
      const position = new THREE.Vector3(0, 0, 4);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it("should return false for position outside back boundary", () => {
      const position = new THREE.Vector3(0, 0, -4);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it("should return true for position at center", () => {
      const position = new THREE.Vector3(0, 0, 0);
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });

    it("should return true for position at boundary", () => {
      const position = new THREE.Vector3(4.7, 0, 3.45);
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });

    it("should return false for position in corner outside bounds", () => {
      const position = new THREE.Vector3(5, 0, 4);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it("should work with 2D position object (y maps to Z/depth)", () => {
      const position = { x: 2, y: 1 }; // y=1 maps to z=1 (depth)
      expect(isPositionInBounds(position, bounds)).toBe(true);
      
      const outsidePosition = { x: 6, y: 0 }; // Outside X boundary
      expect(isPositionInBounds(outsidePosition, bounds)).toBe(false);
    });

    it("should work with Position3D object {x, y, z}", () => {
      const position = { x: 2, y: 1.8, z: 1 }; // Plain object with x, y, z
      expect(isPositionInBounds(position, bounds)).toBe(true);
      
      const outsidePosition = { x: 6, y: 0, z: 0 }; // Outside X boundary
      expect(isPositionInBounds(outsidePosition, bounds)).toBe(false);
      
      const outsideDepth = { x: 0, y: 1.8, z: 5 }; // Outside Z boundary
      expect(isPositionInBounds(outsideDepth, bounds)).toBe(false);
    });

    it("should ignore Y axis (height)", () => {
      const position = new THREE.Vector3(2, 100, 1); // Very high Y
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });
  });
});
