/**
 * Unit tests for PhysicsTypes arena bounds utilities
 * 
 * Tests the new ArenaBounds interface and related utilities for
 * arena bounds validation in Black Trigram combat system.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  ArenaBounds,
  PhysicsArenaBounds,
  calculateArenaBounds,
  clampPositionToBounds,
  isPositionInBounds,
  clampToArenaBounds,
} from './PhysicsTypes';

describe('PhysicsTypes - Arena Bounds', () => {
  describe('calculateArenaBounds', () => {
    it('should calculate bounds for 10m × 7.5m arena with default margin', () => {
      const config: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 1000,
        height: 750,
        scale: 1.0,
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

    it('should calculate bounds for 6m × 4.5m small arena', () => {
      const config: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 600,
        height: 450,
        scale: 0.6,
        worldWidthMeters: 6,
        worldDepthMeters: 4.5,
      };

      const bounds = calculateArenaBounds(config, 0.3);

      expect(bounds.minX).toBeCloseTo(-2.7, 1);
      expect(bounds.maxX).toBeCloseTo(2.7, 1);
      expect(bounds.minZ).toBeCloseTo(-1.95, 1);
      expect(bounds.maxZ).toBeCloseTo(1.95, 1);
    });

    it('should calculate bounds for 14m × 10.5m ultra arena', () => {
      const config: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 1400,
        height: 1050,
        scale: 1.4,
        worldWidthMeters: 14,
        worldDepthMeters: 10.5,
      };

      const bounds = calculateArenaBounds(config, 0.3);

      expect(bounds.minX).toBeCloseTo(-6.7, 1);
      expect(bounds.maxX).toBeCloseTo(6.7, 1);
      expect(bounds.minZ).toBeCloseTo(-4.95, 1);
      expect(bounds.maxZ).toBeCloseTo(4.95, 1);
    });

    it('should respect custom margin parameter', () => {
      const config: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 1000,
        height: 750,
        scale: 1.0,
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      const bounds = calculateArenaBounds(config, 0.5); // Custom 0.5m margin

      expect(bounds.minX).toBeCloseTo(-4.5, 1);
      expect(bounds.maxX).toBeCloseTo(4.5, 1);
      expect(bounds.minZ).toBeCloseTo(-3.25, 1);
      expect(bounds.maxZ).toBeCloseTo(3.25, 1);
    });

    it('should throw error for non-positive width', () => {
      const config = {
        worldWidthMeters: 0,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 0.3)).toThrow(
        'worldWidthMeters must be a positive finite number'
      );
    });

    it('should throw error for negative depth', () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: -5,
      };

      expect(() => calculateArenaBounds(config, 0.3)).toThrow(
        'worldDepthMeters must be a positive finite number'
      );
    });

    it('should throw error for NaN dimensions', () => {
      const config = {
        worldWidthMeters: NaN,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 0.3)).toThrow(
        'worldWidthMeters must be a positive finite number'
      );
    });

    it('should throw error for negative margin', () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, -0.5)).toThrow(
        'margin must be a non-negative finite number'
      );
    });

    it('should throw error for margin larger than half width', () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 6)).toThrow(
        'margin (6m) must be less than half the arena width (5m)'
      );
    });

    it('should throw error for margin larger than half depth', () => {
      const config = {
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      expect(() => calculateArenaBounds(config, 4)).toThrow(
        'margin (4m) must be less than half the arena depth (3.75m)'
      );
    });
  });

  describe('clampPositionToBounds', () => {
    let bounds: ArenaBounds;

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

    it('should clamp position exceeding maxX boundary', () => {
      const position = new THREE.Vector3(6, 0, 0);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(4.7, 1);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBe(0);
    });

    it('should clamp position exceeding minX boundary', () => {
      const position = new THREE.Vector3(-6, 0, 0);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(-4.7, 1);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBe(0);
    });

    it('should clamp position exceeding maxZ boundary', () => {
      const position = new THREE.Vector3(0, 1.8, 5);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBe(0);
      expect(clamped.y).toBe(1.8); // Y unchanged
      expect(clamped.z).toBeCloseTo(3.45, 1);
    });

    it('should clamp position exceeding minZ boundary', () => {
      const position = new THREE.Vector3(0, 1.8, -5);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBe(0);
      expect(clamped.y).toBe(1.8); // Y unchanged
      expect(clamped.z).toBeCloseTo(-3.45, 1);
    });

    it('should clamp corner position exceeding both axes', () => {
      const position = new THREE.Vector3(6, 0, 5);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(4.7, 1);
      expect(clamped.z).toBeCloseTo(3.45, 1);
    });

    it('should not clamp position within bounds', () => {
      const position = new THREE.Vector3(2, 0, 1);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBe(2);
      expect(clamped.y).toBe(0);
      expect(clamped.z).toBe(1);
    });

    it('should preserve Y axis (height)', () => {
      const position = new THREE.Vector3(0, 5.5, 0);
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.y).toBe(5.5); // Height unchanged
    });

    it('should work with Position3D interface', () => {
      const position = { x: 6, y: 1.8, z: 5 };
      const clamped = clampPositionToBounds(position, bounds);

      expect(clamped.x).toBeCloseTo(4.7, 1);
      expect(clamped.y).toBe(1.8);
      expect(clamped.z).toBeCloseTo(3.45, 1);
    });
  });

  describe('isPositionInBounds', () => {
    let bounds: ArenaBounds;

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

    it('should return true for position within bounds', () => {
      const position = new THREE.Vector3(2, 0, 1);
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });

    it('should return false for position exceeding maxX', () => {
      const position = new THREE.Vector3(5, 0, 0);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it('should return false for position exceeding minX', () => {
      const position = new THREE.Vector3(-5, 0, 0);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it('should return false for position exceeding maxZ', () => {
      const position = new THREE.Vector3(0, 0, 4);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it('should return false for position exceeding minZ', () => {
      const position = new THREE.Vector3(0, 0, -4);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it('should return true for position at boundary', () => {
      const position = new THREE.Vector3(4.7, 0, 3.45);
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });

    it('should return false for position in corner outside bounds', () => {
      const position = new THREE.Vector3(5, 0, 4);
      expect(isPositionInBounds(position, bounds)).toBe(false);
    });

    it('should work with 2D position object (y maps to Z/depth)', () => {
      const position = { x: 2, y: 1 }; // y=1 maps to z=1 (depth)
      expect(isPositionInBounds(position, bounds)).toBe(true);
      
      const outsidePosition = { x: 6, y: 0 }; // Outside X boundary
      expect(isPositionInBounds(outsidePosition, bounds)).toBe(false);
    });

    it('should ignore Y axis (height)', () => {
      const position = new THREE.Vector3(2, 100, 1); // Very high Y
      expect(isPositionInBounds(position, bounds)).toBe(true);
    });
  });

  describe('clampToArenaBounds (2D legacy)', () => {
    it('should clamp 2D position to arena bounds', () => {
      const config: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 1000,
        height: 750,
        scale: 1.0,
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      const position = { x: 6, y: 4 };
      const clamped = clampToArenaBounds(position, config);

      expect(clamped.x).toBeCloseTo(5, 1);
      expect(clamped.y).toBeCloseTo(3.75, 1);
    });

    it('should work with position within bounds', () => {
      const config: PhysicsArenaBounds = {
        x: 0,
        y: 0,
        width: 1000,
        height: 750,
        scale: 1.0,
        worldWidthMeters: 10,
        worldDepthMeters: 7.5,
      };

      const position = { x: 2, y: 1 };
      const clamped = clampToArenaBounds(position, config);

      expect(clamped.x).toBe(2);
      expect(clamped.y).toBe(1);
    });
  });
});
