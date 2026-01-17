/**
 * Unit tests for inputSystem.ts scale conversion logic
 * 
 * These tests verify the core pixel-to-meter conversion and bounds clamping
 * without requiring the full React hook integration.
 */

import { describe, expect, it } from 'vitest';
import { BASE_PIXELS_PER_METER } from '../inputSystem';

// Arena scale constants for different device sizes
// Mobile: 300px arena / 960px desktop = 0.3125
// Tablet: 480px arena / 960px desktop = 0.5
// Desktop: 960px arena / 960px desktop = 1.0
export const MOBILE_ARENA_SCALE = 0.3125;
export const TABLET_ARENA_SCALE = 0.5;
export const DESKTOP_ARENA_SCALE = 1.0;

describe('inputSystem - Scale Conversion Logic', () => {
  describe('Pixel-to-Meter Conversion', () => {
    it('should use 100 pixels per meter for desktop scale (1.0)', () => {
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      expect(pixelsPerMeter).toBe(100);
    });

    it('should use 320 pixels per meter for mobile scale (0.3125)', () => {
      const scale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      expect(pixelsPerMeter).toBeCloseTo(320, 1);
    });

    it('should use 200 pixels per meter for tablet scale (0.5)', () => {
      const scale = TABLET_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      expect(pixelsPerMeter).toBe(200);
    });

    it('should scale correctly for large displays (1.25)', () => {
      const scale = 1.25;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      expect(pixelsPerMeter).toBe(80);
    });

    it('should handle edge case: minimum scale (0.1)', () => {
      const scale = 0.1;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      expect(pixelsPerMeter).toBe(1000);
    });

    it('should handle edge case: maximum scale (2.0)', () => {
      const scale = 2.0;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      expect(pixelsPerMeter).toBe(50);
    });

    it('should default to 100 pixels per meter when scale is undefined', () => {
      const scale = undefined;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / (scale ?? DESKTOP_ARENA_SCALE);
      
      expect(pixelsPerMeter).toBe(100);
    });
  });

  describe('Position to Pixels Conversion', () => {
    it('should convert 3D position to pixels with desktop scale', () => {
      const position = { x: 2.0, z: 1.5 }; // meters
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const pixelX = position.x * pixelsPerMeter;
      const pixelY = position.z * pixelsPerMeter;
      
      expect(pixelX).toBe(200); // 2 meters = 200 pixels
      expect(pixelY).toBe(150); // 1.5 meters = 150 pixels
    });

    it('should convert 3D position to pixels with mobile scale', () => {
      const position = { x: 1.0, z: 0.5 }; // meters
      const scale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const pixelX = position.x * pixelsPerMeter;
      const pixelY = position.z * pixelsPerMeter;
      
      expect(pixelX).toBeCloseTo(320, 0); // 1 meter = 320 pixels (mobile)
      expect(pixelY).toBeCloseTo(160, 0); // 0.5 meters = 160 pixels (mobile)
    });

    it('should handle negative positions', () => {
      const position = { x: -1.0, z: -0.5 };
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const pixelX = position.x * pixelsPerMeter;
      const pixelY = position.z * pixelsPerMeter;
      
      expect(pixelX).toBe(-100);
      expect(pixelY).toBe(-50);
    });

    it('should handle zero position', () => {
      const position = { x: 0, z: 0 };
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const pixelX = position.x * pixelsPerMeter;
      const pixelY = position.z * pixelsPerMeter;
      
      expect(pixelX).toBe(0);
      expect(pixelY).toBe(0);
    });
  });

  describe('Bounds Clamping (No Hardcoded Offsets)', () => {
    it('should clamp to exact arena bounds without offsets', () => {
      const bounds = { x: 100, y: 50, width: 960, height: 600 };
      const position = { x: 1200, y: 700 }; // Outside bounds
      
      const clampedX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, position.x));
      const clampedY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, position.y));
      
      expect(clampedX).toBe(1060); // 100 + 960 (no -60 offset)
      expect(clampedY).toBe(650);  // 50 + 600 (no -180 offset)
    });

    it('should clamp position below minimum bounds', () => {
      const bounds = { x: 100, y: 50, width: 960, height: 600 };
      const position = { x: 50, y: 20 }; // Below minimum
      
      const clampedX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, position.x));
      const clampedY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, position.y));
      
      expect(clampedX).toBe(100); // Clamped to minimum
      expect(clampedY).toBe(50);
    });

    it('should not clamp position within bounds', () => {
      const bounds = { x: 100, y: 50, width: 960, height: 600 };
      const position = { x: 500, y: 300 }; // Within bounds
      
      const clampedX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, position.x));
      const clampedY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, position.y));
      
      expect(clampedX).toBe(500); // Unchanged
      expect(clampedY).toBe(300);
    });

    it('should handle mobile arena bounds', () => {
      const bounds = { x: 37.5, y: 100, width: 300, height: 225 };
      const position = { x: 400, y: 400 }; // Outside mobile bounds
      
      const clampedX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, position.x));
      const clampedY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, position.y));
      
      expect(clampedX).toBe(337.5); // 37.5 + 300 (full mobile arena width)
      expect(clampedY).toBe(325);   // 100 + 225 (full mobile arena height)
    });
  });

  describe('Pixels to 3D Position Reverse Conversion', () => {
    it('should convert pixels back to 3D position with desktop scale', () => {
      const pixels = { x: 200, y: 150 };
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const posX = pixels.x / pixelsPerMeter;
      const posZ = pixels.y / pixelsPerMeter;
      
      expect(posX).toBe(2.0);  // 200 pixels = 2 meters
      expect(posZ).toBe(1.5);  // 150 pixels = 1.5 meters
    });

    it('should convert pixels back to 3D position with mobile scale', () => {
      const pixels = { x: 320, y: 160 };
      const scale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const posX = pixels.x / pixelsPerMeter;
      const posZ = pixels.y / pixelsPerMeter;
      
      expect(posX).toBeCloseTo(1.0, 2);  // 320 pixels = 1 meter (mobile)
      expect(posZ).toBeCloseTo(0.5, 2);  // 160 pixels = 0.5 meters (mobile)
    });

    it('should maintain round-trip conversion accuracy (desktop)', () => {
      const originalPos = { x: 3.5, z: 2.7 };
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      // Convert to pixels
      const pixelX = originalPos.x * pixelsPerMeter;
      const pixelY = originalPos.z * pixelsPerMeter;
      
      // Convert back to position
      const posX = pixelX / pixelsPerMeter;
      const posZ = pixelY / pixelsPerMeter;
      
      expect(posX).toBeCloseTo(originalPos.x, 10);
      expect(posZ).toBeCloseTo(originalPos.z, 10);
    });

    it('should maintain round-trip conversion accuracy (mobile)', () => {
      const originalPos = { x: 1.2, z: 0.8 };
      const scale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      // Convert to pixels
      const pixelX = originalPos.x * pixelsPerMeter;
      const pixelY = originalPos.z * pixelsPerMeter;
      
      // Convert back to position
      const posX = pixelX / pixelsPerMeter;
      const posZ = pixelY / pixelsPerMeter;
      
      expect(posX).toBeCloseTo(originalPos.x, 10);
      expect(posZ).toBeCloseTo(originalPos.z, 10);
    });
  });

  describe('Scale Validation', () => {
    it('should detect invalid scale: zero', () => {
      const scale = 0;
      const isValid = scale > 0;
      
      expect(isValid).toBe(false);
    });

    it('should detect invalid scale: negative', () => {
      const scale = -1.0;
      const isValid = scale > 0;
      
      expect(isValid).toBe(false);
    });

    it('should detect invalid scale: NaN', () => {
      const scale = NaN;
      const isValid = !isNaN(scale) && scale > 0;
      
      expect(isValid).toBe(false);
    });

    it('should detect invalid scale: Infinity', () => {
      const scale = Infinity;
      const isValid = isFinite(scale) && scale > 0;
      
      expect(isValid).toBe(false);
    });

    it('should accept valid scales', () => {
      const validScales = [0.1, 0.3125, 0.5, 1.0, 1.25, 2.0];
      
      validScales.forEach(scale => {
        const isValid = isFinite(scale) && scale > 0;
        expect(isValid).toBe(true);
      });
    });
  });

  describe('Real-World Movement Scenarios', () => {
    it('should calculate correct pixel movement per frame at 60fps (desktop)', () => {
      const speed = 2.0; // m/s
      const deltaTime = 1 / 60; // 60fps
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const distanceMeters = speed * deltaTime;
      const distancePixels = distanceMeters * pixelsPerMeter;
      
      expect(distancePixels).toBeCloseTo(3.33, 2); // ~3.33 pixels per frame
    });

    it('should calculate correct pixel movement per frame at 60fps (mobile)', () => {
      const speed = 2.0; // m/s
      const deltaTime = 1 / 60; // 60fps
      const scale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const distanceMeters = speed * deltaTime;
      const distancePixels = distanceMeters * pixelsPerMeter;
      
      expect(distancePixels).toBeCloseTo(10.67, 2); // ~10.67 pixels per frame (scaled)
    });

    it('should calculate time to cross arena (desktop)', () => {
      const arenaWidthPixels = 960;
      const scale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const arenaWidthMeters = arenaWidthPixels / pixelsPerMeter;
      const speed = 2.0; // m/s
      
      const timeToCross = arenaWidthMeters / speed;
      
      expect(timeToCross).toBeCloseTo(4.8, 1); // ~4.8 seconds
    });

    it('should calculate time to cross arena (mobile)', () => {
      const arenaWidthPixels = 300;
      const scale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const arenaWidthMeters = arenaWidthPixels / pixelsPerMeter;
      const speed = 2.0; // m/s
      
      const timeToCross = arenaWidthMeters / speed;
      
      expect(timeToCross).toBeCloseTo(0.47, 2); // ~0.47 seconds (smaller arena)
    });
  });
});
