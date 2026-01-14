/**
 * High-Resolution Mobile Optimization Tests
 * 
 * Validates support for high-end mobile devices with 2K+ displays:
 * - Motorola Edge 60 Pro (2712x1220, Super HD 1.5K)
 * - Samsung Galaxy S23 Ultra (3088x1440)
 * - Google Pixel 9 Pro (3120x1440)
 * - OnePlus 12 (3168x1440)
 * 
 * These devices have desktop-class resolutions but are mobile devices
 * that require mobile-optimized settings with higher dpr support.
 * 
 * @category Testing
 * @korean 고해상도모바일최적화테스트
 */

import { describe, it, expect } from 'vitest';
import {
  getPerformanceTier,
  getPerformanceSettings,
  PERFORMANCE_SETTINGS_BY_TIER,
  PerformanceTier,
} from '../../types/constants/performance';

describe('High-Resolution Mobile Optimization', () => {
  describe('Device Detection and Tier Classification', () => {
    it('should detect Motorola Edge 60 Pro (2712px) as mobile-high tier', () => {
      const tier = getPerformanceTier(2712, true);
      expect(tier).toBe('mobile-high');
    });

    it('should detect Samsung Galaxy S23 Ultra (3088px) as mobile-high tier', () => {
      const tier = getPerformanceTier(3088, true);
      expect(tier).toBe('mobile-high');
    });

    it('should detect Google Pixel 9 Pro (3120px) as mobile-high tier', () => {
      const tier = getPerformanceTier(3120, true);
      expect(tier).toBe('mobile-high');
    });

    it('should detect OnePlus 12 (3168px) as mobile-high tier', () => {
      const tier = getPerformanceTier(3168, true);
      expect(tier).toBe('mobile-high');
    });

    it('should NOT classify desktop (1920px) as mobile-high', () => {
      const tier = getPerformanceTier(1920, false);
      expect(tier).toBe('high');
      expect(tier).not.toBe('mobile-high');
    });

    it('should classify standard mobile (768px) as medium tier when not isMobile', () => {
      // Tablet at exactly 768px breakpoint
      const tier = getPerformanceTier(768, false);
      expect(tier).toBe('medium');
    });

    it('should classify high-res mobile (768px) as mobile-high when isMobile', () => {
      // Mobile device with exactly 768px screen
      const tier = getPerformanceTier(768, true);
      expect(tier).toBe('mobile-high');
    });
  });

  describe('Performance Settings for Mobile-High Tier', () => {
    const mobileHighSettings = PERFORMANCE_SETTINGS_BY_TIER['mobile-high'];

    it('should support up to 3.5x device pixel ratio for Super HD displays', () => {
      expect(mobileHighSettings.dpr).toEqual([1, 3.5]);
    });

    it('should use moderate particle count (50) for mobile battery life', () => {
      expect(mobileHighSettings.maxParticles).toBe(50);
      expect(mobileHighSettings.maxParticles).toBeGreaterThan(
        PERFORMANCE_SETTINGS_BY_TIER.medium.maxParticles
      );
      expect(mobileHighSettings.maxParticles).toBeLessThan(
        PERFORMANCE_SETTINGS_BY_TIER.high.maxParticles
      );
    });

    it('should use 1536px shadow maps (between medium and high)', () => {
      expect(mobileHighSettings.shadowMapSize).toBe(1536);
      expect(mobileHighSettings.shadowMapSize).toBeGreaterThan(
        PERFORMANCE_SETTINGS_BY_TIER.medium.shadowMapSize
      );
      expect(mobileHighSettings.shadowMapSize).toBeLessThan(
        PERFORMANCE_SETTINGS_BY_TIER.high.shadowMapSize
      );
    });

    it('should enable antialiasing for high-quality displays', () => {
      expect(mobileHighSettings.antialias).toBe(true);
    });

    it('should keep post-processing disabled for mobile battery life', () => {
      expect(mobileHighSettings.postProcessing).toBe(false);
    });

    it('should target 55fps (realistic for high-end mobile)', () => {
      expect(mobileHighSettings.targetFPS).toBe(55);
    });
  });

  describe('getPerformanceSettings Integration', () => {
    it('should return mobile-high settings for Motorola Edge 60 Pro', () => {
      const settings = getPerformanceSettings(2712, true);
      expect(settings.dpr).toEqual([1, 3.5]);
      expect(settings.maxParticles).toBe(50);
      expect(settings.shadowMapSize).toBe(1536);
      expect(settings.antialias).toBe(true);
      expect(settings.postProcessing).toBe(false);
      expect(settings.targetFPS).toBe(55);
    });

    it('should return low settings for extra-small mobile (iPhone SE 375px)', () => {
      const settings = getPerformanceSettings(375, true);
      // iPhone SE is < 380px, so it's in the low tier
      expect(settings.dpr).toBe(1);
      expect(settings.maxParticles).toBe(20);
      expect(settings.shadowMapSize).toBe(512);
    });

    it('should return medium settings for standard mobile (400px)', () => {
      const settings = getPerformanceSettings(400, true);
      expect(settings.dpr).toEqual([1, 2]);
      expect(settings.maxParticles).toBe(40);
      expect(settings.shadowMapSize).toBe(1024);
    });

    it('should return high settings for desktop (1920px)', () => {
      const settings = getPerformanceSettings(1920, false);
      expect(settings.dpr).toEqual([1, 2]);
      expect(settings.maxParticles).toBe(100);
      expect(settings.shadowMapSize).toBe(2048);
      expect(settings.postProcessing).toBe(true);
    });
  });

  describe('DPR Configuration Comparison', () => {
    it('should provide higher max dpr for mobile-high than desktop', () => {
      const mobileHighDpr = PERFORMANCE_SETTINGS_BY_TIER['mobile-high'].dpr as [number, number];
      const desktopDpr = PERFORMANCE_SETTINGS_BY_TIER.high.dpr as [number, number];
      
      expect(mobileHighDpr[1]).toBe(3.5);
      expect(desktopDpr[1]).toBe(2);
      expect(mobileHighDpr[1]).toBeGreaterThan(desktopDpr[1]);
    });

    it('should use same minimum dpr (1x) across all tiers except low', () => {
      const mediumDpr = PERFORMANCE_SETTINGS_BY_TIER.medium.dpr as [number, number];
      const mobileHighDpr = PERFORMANCE_SETTINGS_BY_TIER['mobile-high'].dpr as [number, number];
      const highDpr = PERFORMANCE_SETTINGS_BY_TIER.high.dpr as [number, number];
      
      expect(mediumDpr[0]).toBe(1);
      expect(mobileHighDpr[0]).toBe(1);
      expect(highDpr[0]).toBe(1);
    });

    it('should cap low-tier at 1x dpr for performance', () => {
      const lowDpr = PERFORMANCE_SETTINGS_BY_TIER.low.dpr;
      expect(lowDpr).toBe(1);
    });
  });

  describe('Tier Progression Validation', () => {
    it('should have increasing quality from low to mobile-high', () => {
      const tiers: PerformanceTier[] = ['low', 'medium', 'mobile-high'];
      
      for (let i = 0; i < tiers.length - 1; i++) {
        const current = PERFORMANCE_SETTINGS_BY_TIER[tiers[i]];
        const next = PERFORMANCE_SETTINGS_BY_TIER[tiers[i + 1]];
        
        expect(next.maxParticles).toBeGreaterThan(current.maxParticles);
        expect(next.shadowMapSize).toBeGreaterThan(current.shadowMapSize);
        expect(next.targetFPS).toBeGreaterThanOrEqual(current.targetFPS);
      }
    });

    it('should keep mobile-high settings more conservative than desktop high', () => {
      const mobileHigh = PERFORMANCE_SETTINGS_BY_TIER['mobile-high'];
      const desktopHigh = PERFORMANCE_SETTINGS_BY_TIER.high;
      
      // Mobile-high should use fewer particles (battery life)
      expect(mobileHigh.maxParticles).toBeLessThan(desktopHigh.maxParticles);
      
      // Mobile-high should use smaller shadow maps (memory)
      expect(mobileHigh.shadowMapSize).toBeLessThan(desktopHigh.shadowMapSize);
      
      // Mobile-high should disable post-processing (battery)
      expect(mobileHigh.postProcessing).toBe(false);
      expect(desktopHigh.postProcessing).toBe(true);
      
      // Mobile-high should target slightly lower fps (realistic)
      expect(mobileHigh.targetFPS).toBeLessThanOrEqual(desktopHigh.targetFPS);
    });
  });

  describe('Edge Cases', () => {
    it('should handle exactly 768px mobile as mobile-high', () => {
      const tier = getPerformanceTier(768, true);
      expect(tier).toBe('mobile-high');
    });

    it('should handle exactly 768px non-mobile as medium (tablet)', () => {
      const tier = getPerformanceTier(768, false);
      expect(tier).toBe('medium');
    });

    it('should handle 4K mobile (hypothetical future device)', () => {
      const tier = getPerformanceTier(3840, true);
      expect(tier).toBe('mobile-high');
      
      const settings = getPerformanceSettings(3840, true);
      expect(settings.dpr).toEqual([1, 3.5]);
    });

    it('should handle 767px mobile as medium tier (just below threshold)', () => {
      const tier = getPerformanceTier(767, true);
      expect(tier).toBe('medium');
    });

    it('should handle 379px mobile as low tier (extra-small)', () => {
      const tier = getPerformanceTier(379, true);
      expect(tier).toBe('low');
    });
  });
});
