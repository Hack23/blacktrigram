/**
 * Performance benchmarks for movement system
 * 
 * These benchmarks measure the performance of critical movement calculations
 * to ensure no significant overhead from scale-aware conversions.
 * 
 * Run with: npm run bench
 */

import { bench, describe } from 'vitest';
import { BASE_PIXELS_PER_METER } from '../inputSystem';

describe('Movement Performance Benchmarks', () => {
  describe('Pixel-to-Meter Conversion', () => {
    bench('desktop scale (1.0) conversion', () => {
      const scale = 1.0;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const x = 5.0 * pixelsPerMeter;
      const y = 3.0 * pixelsPerMeter;
    });

    bench('mobile scale (0.3125) conversion', () => {
      const scale = 0.3125;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const x = 5.0 * pixelsPerMeter;
      const y = 3.0 * pixelsPerMeter;
    });

    bench('tablet scale (0.5) conversion', () => {
      const scale = 0.5;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const x = 5.0 * pixelsPerMeter;
      const y = 3.0 * pixelsPerMeter;
    });

    bench('default scale fallback', () => {
      const scale = undefined;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / (scale ?? 1.0);
      const x = 5.0 * pixelsPerMeter;
      const y = 3.0 * pixelsPerMeter;
    });
  });

  describe('Reverse Conversion (Pixels to Meters)', () => {
    bench('desktop scale (1.0) reverse conversion', () => {
      const scale = 1.0;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const posX = 200 / pixelsPerMeter;
      const posZ = 150 / pixelsPerMeter;
    });

    bench('mobile scale (0.3125) reverse conversion', () => {
      const scale = 0.3125;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const posX = 320 / pixelsPerMeter;
      const posZ = 160 / pixelsPerMeter;
    });
  });

  describe('Bounds Clamping', () => {
    bench('simple bounds clamping (desktop)', () => {
      const bounds = { x: 120, y: 100, width: 960, height: 600 };
      const x = Math.max(bounds.x, Math.min(bounds.x + bounds.width, 500));
      const y = Math.max(bounds.y, Math.min(bounds.y + bounds.height, 300));
    });

    bench('simple bounds clamping (mobile)', () => {
      const bounds = { x: 37.5, y: 100, width: 300, height: 225 };
      const x = Math.max(bounds.x, Math.min(bounds.x + bounds.width, 200));
      const y = Math.max(bounds.y, Math.min(bounds.y + bounds.height, 150));
    });

    bench('bounds clamping with edge case (out of bounds)', () => {
      const bounds = { x: 120, y: 100, width: 960, height: 600 };
      const x = Math.max(bounds.x, Math.min(bounds.x + bounds.width, 2000));
      const y = Math.max(bounds.y, Math.min(bounds.y + bounds.height, 1000));
    });
  });

  describe('Full Movement Calculation', () => {
    bench('complete desktop movement calculation', () => {
      const scale = 1.0;
      const bounds = { x: 120, y: 100, width: 960, height: 600 };
      const position = { x: 2.0, z: 1.5 }; // meters
      
      // Convert to pixels
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      let newX = position.x * pixelsPerMeter;
      let newY = position.z * pixelsPerMeter;
      
      // Clamp to bounds
      newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, newX));
      newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, newY));
      
      // Convert back to meters
      const finalX = newX / pixelsPerMeter;
      const finalZ = newY / pixelsPerMeter;
    });

    bench('complete mobile movement calculation', () => {
      const scale = 0.3125;
      const bounds = { x: 37.5, y: 100, width: 300, height: 225 };
      const position = { x: 1.0, z: 0.5 }; // meters
      
      // Convert to pixels
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      let newX = position.x * pixelsPerMeter;
      let newY = position.z * pixelsPerMeter;
      
      // Clamp to bounds
      newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, newX));
      newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, newY));
      
      // Convert back to meters
      const finalX = newX / pixelsPerMeter;
      const finalZ = newY / pixelsPerMeter;
    });
  });

  describe('Scale Validation', () => {
    bench('scale validation check', () => {
      const scale = 0.3125;
      const isValid = isFinite(scale) && scale > 0;
    });

    bench('scale validation with NaN', () => {
      const scale = NaN;
      const isValid = !isNaN(scale) && isFinite(scale) && scale > 0;
    });

    bench('scale validation with negative', () => {
      const scale = -1.0;
      const isValid = scale > 0;
    });
  });

  describe('Real-World Frame Calculations', () => {
    bench('60fps frame movement calculation (desktop)', () => {
      const speed = 2.0; // m/s
      const deltaTime = 1 / 60; // 60fps
      const scale = 1.0;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const distanceMeters = speed * deltaTime;
      const distancePixels = distanceMeters * pixelsPerMeter;
    });

    bench('60fps frame movement calculation (mobile)', () => {
      const speed = 2.0; // m/s
      const deltaTime = 1 / 60; // 60fps
      const scale = 0.3125;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      
      const distanceMeters = speed * deltaTime;
      const distancePixels = distanceMeters * pixelsPerMeter;
    });

    bench('arena crossing time calculation', () => {
      const arenaWidthPixels = 960;
      const scale = 1.0;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const arenaWidthMeters = arenaWidthPixels / pixelsPerMeter;
      const speed = 2.0; // m/s
      
      const timeToCross = arenaWidthMeters / speed;
    });
  });

  describe('Multiple Position Updates (Batch Processing)', () => {
    bench('10 position updates (desktop)', () => {
      const scale = 1.0;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const positions = [
        { x: 1.0, z: 0.5 },
        { x: 2.0, z: 1.0 },
        { x: 3.0, z: 1.5 },
        { x: 4.0, z: 2.0 },
        { x: 5.0, z: 2.5 },
        { x: 6.0, z: 3.0 },
        { x: 7.0, z: 3.5 },
        { x: 8.0, z: 4.0 },
        { x: 9.0, z: 4.5 },
        { x: 10.0, z: 5.0 },
      ];
      
      positions.forEach(pos => {
        const pixelX = pos.x * pixelsPerMeter;
        const pixelY = pos.z * pixelsPerMeter;
      });
    });

    bench('10 position updates (mobile)', () => {
      const scale = 0.3125;
      const pixelsPerMeter = BASE_PIXELS_PER_METER / scale;
      const positions = [
        { x: 1.0, z: 0.5 },
        { x: 2.0, z: 1.0 },
        { x: 3.0, z: 1.5 },
        { x: 4.0, z: 2.0 },
        { x: 5.0, z: 2.5 },
        { x: 6.0, z: 3.0 },
        { x: 7.0, z: 3.5 },
        { x: 8.0, z: 4.0 },
        { x: 9.0, z: 4.5 },
        { x: 10.0, z: 5.0 },
      ];
      
      positions.forEach(pos => {
        const pixelX = pos.x * pixelsPerMeter;
        const pixelY = pos.z * pixelsPerMeter;
      });
    });
  });
});
