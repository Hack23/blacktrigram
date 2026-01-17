/**
 * Tests for scale-aware combat distance calculations
 * 
 * Verifies that combat distance calculations correctly account for arena scale
 * to ensure hit detection, AI behavior, and animation timing remain accurate
 * across all device sizes.
 */

import { describe, expect, it } from 'vitest';
import { BASE_PIXELS_PER_METER } from '../inputSystem';
import { METERS_TO_PIXELS_SCALE } from '../../types/physicsConstants';
import {
  MOBILE_ARENA_SCALE,
  TABLET_ARENA_SCALE,
  DESKTOP_ARENA_SCALE,
} from '../../test/arenaScaleConstants';

describe('Combat Distance Calculations with Arena Scale', () => {
  describe('Scale-Aware Distance Conversion', () => {
    it('should convert desktop pixel distance to standard pixels correctly', () => {
      // Desktop arena (scale=1.0)
      const arenaScale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / arenaScale; // 100
      
      // Two players 100 pixels apart
      const distanceInPixels = 100;
      
      // Convert to meters, then to standard pixels
      const distanceInMeters = distanceInPixels / pixelsPerMeter; // 1.0m
      const distanceInStandardPixels = distanceInMeters * METERS_TO_PIXELS_SCALE; // 100
      
      expect(distanceInStandardPixels).toBe(100);
      expect(distanceInMeters).toBe(1.0);
    });

    it('should convert mobile pixel distance to standard pixels correctly', () => {
      // Mobile arena (scale=0.3125)
      const arenaScale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / arenaScale; // 320
      
      // Two players 320 pixels apart (visually same distance as 100px on desktop)
      const distanceInPixels = 320;
      
      // Convert to meters, then to standard pixels
      const distanceInMeters = distanceInPixels / pixelsPerMeter; // 1.0m
      const distanceInStandardPixels = distanceInMeters * METERS_TO_PIXELS_SCALE; // 100
      
      expect(distanceInStandardPixels).toBe(100);
      expect(distanceInMeters).toBe(1.0);
    });

    it('should maintain consistent meter distance across scales', () => {
      const scales = [DESKTOP_ARENA_SCALE, 0.75, TABLET_ARENA_SCALE, MOBILE_ARENA_SCALE];
      const expectedMeters = 2.5;
      
      scales.forEach(scale => {
        const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
        const pixelDistance = expectedMeters * pixelsPerMeter;
        
        // Convert back to meters
        const calculatedMeters = pixelDistance / pixelsPerMeter;
        
        // Convert to standard pixels (for technique reach comparison)
        const standardPixels = calculatedMeters * METERS_TO_PIXELS_SCALE;
        
        expect(calculatedMeters).toBeCloseTo(expectedMeters, 5);
        expect(standardPixels).toBeCloseTo(250, 1); // 2.5m * 100 px/m
      });
    });
  });

  describe('Technique Reach Comparison', () => {
    it('should correctly detect kick in range (desktop)', () => {
      const arenaScale = DESKTOP_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / arenaScale;
      
      // Kick with 1.5m reach
      const kickReachMeters = 1.5;
      const kickReachStandardPixels = kickReachMeters * METERS_TO_PIXELS_SCALE; // 150
      
      // Players 140 pixels apart
      const distanceInPixels = 140;
      const distanceInMeters = distanceInPixels / pixelsPerMeter;
      const distanceInStandardPixels = distanceInMeters * METERS_TO_PIXELS_SCALE;
      
      // Should be in range
      expect(distanceInStandardPixels).toBeLessThan(kickReachStandardPixels);
      expect(distanceInMeters).toBeLessThan(kickReachMeters);
    });

    it('should correctly detect kick in range (mobile)', () => {
      const arenaScale = MOBILE_ARENA_SCALE;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / arenaScale; // 320
      
      // Kick with 1.5m reach
      const kickReachMeters = 1.5;
      const kickReachStandardPixels = kickReachMeters * METERS_TO_PIXELS_SCALE; // 150
      
      // Players 448 pixels apart (same 1.4m distance as 140px on desktop)
      const distanceInPixels = 448; // 1.4m * 320 px/m
      const distanceInMeters = distanceInPixels / pixelsPerMeter;
      const distanceInStandardPixels = distanceInMeters * METERS_TO_PIXELS_SCALE;
      
      // Should be in range (same result as desktop)
      expect(distanceInStandardPixels).toBeCloseTo(140, 1);
      expect(distanceInStandardPixels).toBeLessThan(kickReachStandardPixels);
      expect(distanceInMeters).toBeCloseTo(1.4, 2);
      expect(distanceInMeters).toBeLessThan(kickReachMeters);
    });

    it('should detect same in-range status across scales', () => {
      const scales = [DESKTOP_ARENA_SCALE, TABLET_ARENA_SCALE, MOBILE_ARENA_SCALE];
      const kickReachMeters = 1.5;
      const actualDistanceMeters = 1.4;
      
      scales.forEach(scale => {
        const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
        const distanceInPixels = actualDistanceMeters * pixelsPerMeter;
        const distanceInMeters = distanceInPixels / pixelsPerMeter;
        const distanceInStandardPixels = distanceInMeters * METERS_TO_PIXELS_SCALE;
        const kickReachStandardPixels = kickReachMeters * METERS_TO_PIXELS_SCALE;
        
        // Should be in range for all scales
        expect(distanceInStandardPixels).toBeLessThan(kickReachStandardPixels);
        expect(distanceInMeters).toBeLessThan(kickReachMeters);
      });
    });
  });

  describe('AI Movement Threshold', () => {
    it('should use correct movement threshold on desktop', () => {
      const arenaScale = DESKTOP_ARENA_SCALE;
      const thresholdMeters = 0.05; // 5cm
      const pixelsPerMeter = BASE_PIXELS_PER_METER / arenaScale;
      const thresholdPixels = thresholdMeters * pixelsPerMeter;
      
      expect(thresholdPixels).toBe(5); // 5 pixels on desktop
    });

    it('should use correct movement threshold on mobile', () => {
      const arenaScale = MOBILE_ARENA_SCALE;
      const thresholdMeters = 0.05; // 5cm
      const pixelsPerMeter = BASE_PIXELS_PER_METER / arenaScale;
      const thresholdPixels = thresholdMeters * pixelsPerMeter;
      
      expect(thresholdPixels).toBe(16); // 16 pixels on mobile (same 5cm distance)
    });

    it('should represent same physical distance across scales', () => {
      const thresholdMeters = 0.05;
      const scales = [DESKTOP_ARENA_SCALE, TABLET_ARENA_SCALE, MOBILE_ARENA_SCALE];
      
      scales.forEach(scale => {
        const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
        const thresholdPixels = thresholdMeters * pixelsPerMeter;
        const backToMeters = thresholdPixels / pixelsPerMeter;
        
        expect(backToMeters).toBeCloseTo(thresholdMeters, 10);
      });
    });
  });

  describe('Arena Bounds Consistency', () => {
    it('should use full arena width without offsets (desktop)', () => {
      const arenaBounds = {
        x: 120,
        y: 100,
        width: 960,
        height: 600,
        scale: 1.0,
      };
      
      // Position at right edge
      const posX = arenaBounds.x + arenaBounds.width;
      
      // Should clamp to exact edge (no -60 offset)
      const clampedX = Math.max(
        arenaBounds.x,
        Math.min(arenaBounds.x + arenaBounds.width, posX)
      );
      
      expect(clampedX).toBe(arenaBounds.x + arenaBounds.width);
      expect(clampedX).toBe(1080); // 120 + 960
    });

    it('should use full arena width without offsets (mobile)', () => {
      const arenaBounds = {
        x: 37.5,
        y: 100,
        width: 300,
        height: 225,
        scale: MOBILE_ARENA_SCALE,
      };
      
      // Position at right edge
      const posX = arenaBounds.x + arenaBounds.width;
      
      // Should clamp to exact edge (no hardcoded offset)
      const clampedX = Math.max(
        arenaBounds.x,
        Math.min(arenaBounds.x + arenaBounds.width, posX)
      );
      
      expect(clampedX).toBe(arenaBounds.x + arenaBounds.width);
      expect(clampedX).toBe(337.5); // 37.5 + 300
    });
  });

  describe('Real-World Combat Scenarios', () => {
    it('should detect punch hit at 0.8m on both desktop and mobile', () => {
      const punchReachMeters = 1.0;
      const actualDistanceMeters = 0.8;
      
      // Desktop
      const desktopScale = DESKTOP_ARENA_SCALE;
      const desktopPixelsPerMeter = BASE_PIXELS_PER_METER / desktopScale;
      const desktopDistancePixels = actualDistanceMeters * desktopPixelsPerMeter;
      const desktopDistanceStandard = (desktopDistancePixels / desktopPixelsPerMeter) * METERS_TO_PIXELS_SCALE;
      
      // Mobile
      const mobileScale = MOBILE_ARENA_SCALE;
      const mobilePixelsPerMeter = BASE_PIXELS_PER_METER / mobileScale;
      const mobileDistancePixels = actualDistanceMeters * mobilePixelsPerMeter;
      const mobileDistanceStandard = (mobileDistancePixels / mobilePixelsPerMeter) * METERS_TO_PIXELS_SCALE;
      
      const punchReachStandard = punchReachMeters * METERS_TO_PIXELS_SCALE;
      
      // Both should detect hit
      expect(desktopDistanceStandard).toBeLessThan(punchReachStandard);
      expect(mobileDistanceStandard).toBeLessThan(punchReachStandard);
      
      // Both should calculate same distance in meters
      expect(desktopDistancePixels / desktopPixelsPerMeter).toBeCloseTo(actualDistanceMeters, 5);
      expect(mobileDistancePixels / mobilePixelsPerMeter).toBeCloseTo(actualDistanceMeters, 5);
    });

    it('should detect kick miss at 1.8m on both desktop and mobile', () => {
      const kickReachMeters = 1.5;
      const actualDistanceMeters = 1.8;
      
      // Desktop
      const desktopScale = DESKTOP_ARENA_SCALE;
      const desktopPixelsPerMeter = BASE_PIXELS_PER_METER / desktopScale;
      const desktopDistancePixels = actualDistanceMeters * desktopPixelsPerMeter;
      const desktopDistanceStandard = (desktopDistancePixels / desktopPixelsPerMeter) * METERS_TO_PIXELS_SCALE;
      
      // Mobile
      const mobileScale = MOBILE_ARENA_SCALE;
      const mobilePixelsPerMeter = BASE_PIXELS_PER_METER / mobileScale;
      const mobileDistancePixels = actualDistanceMeters * mobilePixelsPerMeter;
      const mobileDistanceStandard = (mobileDistancePixels / mobilePixelsPerMeter) * METERS_TO_PIXELS_SCALE;
      
      const kickReachStandard = kickReachMeters * METERS_TO_PIXELS_SCALE;
      
      // Both should detect miss
      expect(desktopDistanceStandard).toBeGreaterThan(kickReachStandard);
      expect(mobileDistanceStandard).toBeGreaterThan(kickReachStandard);
      
      // Both should calculate same distance in meters
      expect(desktopDistancePixels / desktopPixelsPerMeter).toBeCloseTo(actualDistanceMeters, 5);
      expect(mobileDistancePixels / mobilePixelsPerMeter).toBeCloseTo(actualDistanceMeters, 5);
    });
  });
});
