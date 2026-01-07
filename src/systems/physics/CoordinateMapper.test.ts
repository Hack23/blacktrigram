/**
 * Unit tests for CoordinateMapper.
 * 
 * Tests 2D→3D coordinate conversion for vital point collision detection.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CoordinateMapper, defaultCoordinateMapper } from './CoordinateMapper';
import type { Position } from '@/types/common';
import type { Position3D } from '@/types/physics';

describe('CoordinateMapper', () => {
  let mapper: CoordinateMapper;

  beforeEach(() => {
    mapper = new CoordinateMapper();
  });

  describe('Constructor and Configuration', () => {
    it('should create mapper with default configuration', () => {
      const config = mapper.getConfig();
      
      expect(config.height).toBe(1.75);
      expect(config.width).toBe(0.5);
      expect(config.depth).toBe(0.3);
      expect(config.overlayWidth).toBe(200);
      expect(config.overlayHeight).toBe(300);
    });

    it('should create mapper with custom configuration', () => {
      const customMapper = new CoordinateMapper({
        height: 1.85,
        width: 0.55,
      });
      
      const config = customMapper.getConfig();
      expect(config.height).toBe(1.85);
      expect(config.width).toBe(0.55);
      expect(config.depth).toBe(0.3); // Should use default
    });

    it('should provide default singleton instance', () => {
      expect(defaultCoordinateMapper).toBeInstanceOf(CoordinateMapper);
    });
  });

  describe('pixel2DToWorld3D - Basic Conversions', () => {
    it('should convert center pixel to center world position', () => {
      const pixel: Position = { x: 100, y: 150 }; // Center of 200x300
      const world = mapper.pixel2DToWorld3D(pixel, 'torso');
      
      expect(world.x).toBeCloseTo(0, 2); // Centered horizontally
      expect(world.y).toBeCloseTo(0.875, 2); // Middle height (1.75m / 2)
      expect(world.z).toBe(0); // Torso at center plane
    });

    it('should convert top-left pixel to world position', () => {
      const pixel: Position = { x: 0, y: 0 }; // Top-left corner
      const world = mapper.pixel2DToWorld3D(pixel, 'head');
      
      expect(world.x).toBeCloseTo(-0.25, 2); // Left edge
      expect(world.y).toBeCloseTo(1.75, 2); // Top (head height)
      expect(world.z).toBe(0.05); // Head slightly forward
    });

    it('should convert bottom-right pixel to world position', () => {
      const pixel: Position = { x: 200, y: 300 }; // Bottom-right corner
      const world = mapper.pixel2DToWorld3D(pixel, 'legs');
      
      expect(world.x).toBeCloseTo(0.25, 2); // Right edge
      expect(world.y).toBeCloseTo(0, 2); // Bottom (feet)
      expect(world.z).toBe(0); // Legs at center plane
    });

    it('should handle head region with forward offset', () => {
      const pixel: Position = { x: 100, y: 50 }; // Temple position
      const world = mapper.pixel2DToWorld3D(pixel, 'head');
      
      expect(world.x).toBeCloseTo(0, 2); // Center
      expect(world.y).toBeGreaterThan(1.4); // Upper region
      expect(world.z).toBe(0.05); // Head forward offset
    });

    it('should handle neck region with minimal offset', () => {
      const pixel: Position = { x: 100, y: 80 };
      const world = mapper.pixel2DToWorld3D(pixel, 'neck');
      
      expect(world.z).toBe(0.02); // Neck nearly centered
    });

    it('should handle arms region with forward offset', () => {
      const pixel: Position = { x: 50, y: 150 }; // Left arm
      const world = mapper.pixel2DToWorld3D(pixel, 'arms');
      
      expect(world.x).toBeLessThan(0); // Left side
      expect(world.z).toBe(0.05); // Arms slightly forward
    });
  });

  describe('world3DToPixel2D - Reverse Conversions', () => {
    it('should convert world center to pixel center', () => {
      const world: Position3D = { x: 0, y: 0.875, z: 0 }; // Center
      const pixel = mapper.world3DToPixel2D(world);
      
      expect(pixel.x).toBe(100); // Center X
      expect(pixel.y).toBe(150); // Center Y
    });

    it('should convert head position to top pixel', () => {
      const world: Position3D = { x: 0, y: 1.75, z: 0.05 }; // Head
      const pixel = mapper.world3DToPixel2D(world);
      
      expect(pixel.x).toBe(100); // Center X
      expect(pixel.y).toBe(0); // Top Y
    });

    it('should convert feet position to bottom pixel', () => {
      const world: Position3D = { x: 0, y: 0, z: 0 }; // Feet
      const pixel = mapper.world3DToPixel2D(world);
      
      expect(pixel.x).toBe(100); // Center X
      expect(pixel.y).toBe(300); // Bottom Y
    });

    it('should round pixel coordinates to integers', () => {
      const world: Position3D = { x: 0.123, y: 1.456, z: 0 };
      const pixel = mapper.world3DToPixel2D(world);
      
      expect(Number.isInteger(pixel.x)).toBe(true);
      expect(Number.isInteger(pixel.y)).toBe(true);
    });
  });

  describe('Bidirectional Conversion Consistency', () => {
    it('should maintain consistency for center point', () => {
      const originalPixel: Position = { x: 100, y: 150 };
      const world = mapper.pixel2DToWorld3D(originalPixel, 'torso');
      const backToPixel = mapper.world3DToPixel2D(world);
      
      expect(backToPixel.x).toBe(originalPixel.x);
      expect(backToPixel.y).toBe(originalPixel.y);
    });

    it('should maintain consistency for head position', () => {
      const originalPixel: Position = { x: 100, y: 50 };
      const world = mapper.pixel2DToWorld3D(originalPixel, 'head');
      const backToPixel = mapper.world3DToPixel2D(world);
      
      expect(backToPixel.x).toBe(originalPixel.x);
      expect(backToPixel.y).toBe(originalPixel.y);
    });

    it('should maintain consistency for multiple positions', () => {
      const testPositions: Position[] = [
        { x: 0, y: 0 },      // Top-left
        { x: 200, y: 0 },    // Top-right
        { x: 0, y: 300 },    // Bottom-left
        { x: 200, y: 300 },  // Bottom-right
        { x: 100, y: 150 },  // Center
        { x: 50, y: 100 },   // Random point 1
        { x: 150, y: 250 },  // Random point 2
      ];
      
      testPositions.forEach(originalPixel => {
        const world = mapper.pixel2DToWorld3D(originalPixel, 'torso');
        const backToPixel = mapper.world3DToPixel2D(world);
        
        expect(backToPixel.x).toBe(originalPixel.x);
        expect(backToPixel.y).toBe(originalPixel.y);
      });
    });
  });

  describe('inferRegionFromId', () => {
    it('should infer head region from ID', () => {
      const mockVitalPoint = {
        id: 'head_temple',
        names: { korean: '태양혈', english: 'Temple', romanized: 'taeyang' },
        position: { x: 100, y: 50 },
        category: 'neurological' as any,
        severity: 'critical' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.7,
        effectiveStances: [],
      };
      
      const world = mapper.vitalPointToWorld3D(mockVitalPoint);
      expect(world.z).toBe(0.05); // Head forward offset
    });

    it('should infer neck region from ID', () => {
      const mockVitalPoint = {
        id: 'neck_carotid',
        names: { korean: '경동맥', english: 'Carotid', romanized: 'gyeongdongmaek' },
        position: { x: 100, y: 80 },
        category: 'circulatory' as any,
        severity: 'critical' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.8,
        effectiveStances: [],
      };
      
      const world = mapper.vitalPointToWorld3D(mockVitalPoint);
      expect(world.z).toBe(0.02); // Neck nearly centered
    });

    it('should infer torso region from ID', () => {
      const mockVitalPoint = {
        id: 'torso_solar_plexus',
        names: { korean: '명치', english: 'Solar Plexus', romanized: 'myeongchi' },
        position: { x: 100, y: 180 },
        category: 'neurological' as any,
        severity: 'major' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.5,
        effectiveStances: [],
      };
      
      const world = mapper.vitalPointToWorld3D(mockVitalPoint);
      expect(world.z).toBe(0); // Torso at center
    });

    it('should default to torso for unknown prefix', () => {
      const mockVitalPoint = {
        id: 'unknown_point',
        names: { korean: '알 수 없음', english: 'Unknown', romanized: 'al su eobseum' },
        position: { x: 100, y: 150 },
        category: 'structural' as any,
        severity: 'minor' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.5,
        effectiveStances: [],
      };
      
      const world = mapper.vitalPointToWorld3D(mockVitalPoint);
      expect(world.z).toBe(0); // Default to torso
    });
  });

  describe('distanceToVitalPoint', () => {
    it('should calculate distance to vital point correctly', () => {
      const mockVitalPoint = {
        id: 'head_temple',
        names: { korean: '태양혈', english: 'Temple', romanized: 'taeyang' },
        position: { x: 100, y: 50 },
        category: 'neurological' as any,
        severity: 'critical' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.7,
        effectiveStances: [],
      };
      
      // Convert vital point to 3D
      const vitalPoint3D = mapper.vitalPointToWorld3D(mockVitalPoint);
      
      // Point at exact vital point location
      const distance1 = mapper.distanceToVitalPoint(vitalPoint3D, mockVitalPoint);
      expect(distance1).toBeCloseTo(0, 5);
      
      // Point 0.1m away in X direction
      const nearPoint: Position3D = {
        x: vitalPoint3D.x + 0.1,
        y: vitalPoint3D.y,
        z: vitalPoint3D.z,
      };
      const distance2 = mapper.distanceToVitalPoint(nearPoint, mockVitalPoint);
      expect(distance2).toBeCloseTo(0.1, 2);
      
      // Point 0.1m away in Y direction
      const upPoint: Position3D = {
        x: vitalPoint3D.x,
        y: vitalPoint3D.y + 0.1,
        z: vitalPoint3D.z,
      };
      const distance3 = mapper.distanceToVitalPoint(upPoint, mockVitalPoint);
      expect(distance3).toBeCloseTo(0.1, 2);
    });

    it('should calculate 3D Euclidean distance', () => {
      const mockVitalPoint = {
        id: 'torso_center',
        names: { korean: '중앙', english: 'Center', romanized: 'jungang' },
        position: { x: 100, y: 150 },
        category: 'structural' as any,
        severity: 'minor' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.5,
        effectiveStances: [],
      };
      
      const vitalPoint3D = mapper.vitalPointToWorld3D(mockVitalPoint);
      
      // Point offset by (0.3, 0.4, 0) should be distance 0.5
      const testPoint: Position3D = {
        x: vitalPoint3D.x + 0.3,
        y: vitalPoint3D.y + 0.4,
        z: vitalPoint3D.z,
      };
      
      const distance = mapper.distanceToVitalPoint(testPoint, mockVitalPoint);
      expect(distance).toBeCloseTo(0.5, 2); // sqrt(0.3² + 0.4²) = 0.5
    });
  });

  describe('findClosestVitalPoint', () => {
    const mockVitalPoints = [
      {
        id: 'head_temple',
        names: { korean: '태양혈', english: 'Temple', romanized: 'taeyang' },
        position: { x: 100, y: 50 },
        category: 'neurological' as any,
        severity: 'critical' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.7,
        effectiveStances: [],
      },
      {
        id: 'head_jaw',
        names: { korean: '턱끝', english: 'Jaw', romanized: 'teokkeut' },
        position: { x: 105, y: 80 },
        category: 'neurological' as any,
        severity: 'major' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.6,
        effectiveStances: [],
      },
      {
        id: 'torso_solar_plexus',
        names: { korean: '명치', english: 'Solar Plexus', romanized: 'myeongchi' },
        position: { x: 100, y: 180 },
        category: 'neurological' as any,
        severity: 'major' as any,
        effects: [],
        description: { korean: '', english: '', romanized: '' },
        targetingDifficulty: 0.5,
        effectiveStances: [],
      },
    ];

    it('should find closest vital point from multiple options', () => {
      const testPoint: Position3D = { x: 0, y: 1.6, z: 0.05 }; // Near temple
      
      const result = mapper.findClosestVitalPoint(testPoint, mockVitalPoints);
      
      expect(result).not.toBeNull();
      expect(result!.vitalPoint.id).toBe('head_temple');
      expect(result!.distance).toBeGreaterThan(0);
    });

    it('should filter by region when specified', () => {
      const testPoint: Position3D = { x: 0, y: 1.6, z: 0.05 }; // Near head region
      
      const result = mapper.findClosestVitalPoint(testPoint, mockVitalPoints, 'head');
      
      expect(result).not.toBeNull();
      expect(result!.vitalPoint.id).toContain('head_');
    });

    it('should return null if no vital points in specified region', () => {
      const testPoint: Position3D = { x: 0, y: 0.5, z: 0 };
      
      const result = mapper.findClosestVitalPoint(testPoint, mockVitalPoints, 'legs');
      
      expect(result).toBeNull();
    });

    it('should return null for empty vital points array', () => {
      const testPoint: Position3D = { x: 0, y: 1.6, z: 0 };
      
      const result = mapper.findClosestVitalPoint(testPoint, []);
      
      expect(result).toBeNull();
    });

    it('should find torso point when closer than head points', () => {
      const testPoint: Position3D = { x: 0, y: 0.8, z: 0 }; // Near torso (lower)
      
      const result = mapper.findClosestVitalPoint(testPoint, mockVitalPoints);
      
      expect(result).not.toBeNull();
      expect(result!.vitalPoint.id).toBe('torso_solar_plexus');
    });
  });

  describe('Performance', () => {
    it('should perform pixel to world conversion in <0.1ms', () => {
      const pixel: Position = { x: 100, y: 150 };
      
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        mapper.pixel2DToWorld3D(pixel, 'torso');
      }
      const end = performance.now();
      
      const avgTime = (end - start) / 1000;
      expect(avgTime).toBeLessThan(0.1);
    });

    it('should perform world to pixel conversion in <0.1ms', () => {
      const world: Position3D = { x: 0, y: 0.875, z: 0 };
      
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        mapper.world3DToPixel2D(world);
      }
      const end = performance.now();
      
      const avgTime = (end - start) / 1000;
      expect(avgTime).toBeLessThan(0.1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative pixel coordinates gracefully', () => {
      const pixel: Position = { x: -10, y: -10 };
      const world = mapper.pixel2DToWorld3D(pixel, 'head');
      
      // Should extrapolate beyond character bounds
      expect(world.x).toBeLessThan(-0.25);
      expect(world.y).toBeGreaterThan(1.75);
    });

    it('should handle pixel coordinates beyond overlay bounds', () => {
      const pixel: Position = { x: 300, y: 400 };
      const world = mapper.pixel2DToWorld3D(pixel, 'legs');
      
      // Should extrapolate beyond character bounds
      expect(world.x).toBeGreaterThan(0.25);
      expect(world.y).toBeLessThan(0);
    });

    it('should handle very small world coordinates', () => {
      const world: Position3D = { x: 0.001, y: 0.001, z: 0 };
      const pixel = mapper.world3DToPixel2D(world);
      
      expect(Number.isFinite(pixel.x)).toBe(true);
      expect(Number.isFinite(pixel.y)).toBe(true);
    });
  });
});
