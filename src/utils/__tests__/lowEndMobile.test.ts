/**
 * Low-End Mobile Optimization Tests
 * 
 * Validates extra-small device support (<380px) for iPhone SE,
 * old Android phones, and budget smartphones.
 * 
 * @category Testing
 * @korean 저사양모바일최적화테스트
 */

import { describe, it, expect } from 'vitest';
import { getCombatLayoutConstants } from '../responsiveLayoutHelpers';
import { calculateMobileAreaBounds } from '../mobileLayoutHelpers';
import { getKoreanFontSize } from '../../types/constants/typography';
import {
  getPerformanceTier,
  getPerformanceSettings,
  PERFORMANCE_SETTINGS_BY_TIER,
} from '../../types/constants/performance';

describe('Low-End Mobile Optimization', () => {
  describe('Extra-Small Device Detection (<380px)', () => {
    it('should detect iPhone SE (375px) as extra-small', () => {
      const tier = getPerformanceTier(375, true);
      expect(tier).toBe('low');
    });

    it('should detect old Android (360px) as extra-small', () => {
      const tier = getPerformanceTier(360, true);
      expect(tier).toBe('low');
    });

    it('should detect extreme low-end (320px) as extra-small', () => {
      const tier = getPerformanceTier(320, true);
      expect(tier).toBe('low');
    });

    it('should detect standard mobile (400px) as medium tier', () => {
      const tier = getPerformanceTier(400, true);
      expect(tier).toBe('medium');
    });
  });

  describe('Combat Layout Constants', () => {
    it('should use reduced padding for extra-small devices', () => {
      const constants = getCombatLayoutConstants(375);
      expect(constants.padding).toBe(8); // Extra-small padding
    });

    it('should use reduced HUD height for extra-small devices', () => {
      const constants = getCombatLayoutConstants(360);
      expect(constants.hudHeight).toBe(85); // Extra-small HUD
    });

    it('should use reduced controls height for extra-small devices', () => {
      const constants = getCombatLayoutConstants(320);
      expect(constants.controlsHeight).toBe(150); // Extra-small controls
    });

    it('should ensure minimum button height for WCAG AA (48px)', () => {
      const constants = getCombatLayoutConstants(375);
      expect(constants.buttonHeight).toBeGreaterThanOrEqual(48);
    });

    it('should use standard mobile values for devices ≥380px', () => {
      const constants = getCombatLayoutConstants(400);
      expect(constants.padding).toBe(10);
      expect(constants.hudHeight).toBe(95);
      expect(constants.controlsHeight).toBe(160);
    });
  });

  describe('Mobile Arena Bounds', () => {
    it('should calculate arena for iPhone SE (375x667)', () => {
      const bounds = calculateMobileAreaBounds(375, 667, 75, 110, 90);
      
      // Should use tighter margins (30px total vs 40px)
      expect(bounds.width).toBeLessThanOrEqual(320);
      expect(bounds.height).toBeLessThanOrEqual(240);
      expect(bounds.scale).toBeLessThan(0.35); // Smaller than standard mobile
    });

    it('should calculate arena for old Android (360x640)', () => {
      const bounds = calculateMobileAreaBounds(360, 640, 75, 110, 90);
      
      expect(bounds.width).toBeLessThanOrEqual(320);
      expect(bounds.height).toBeLessThanOrEqual(240);
    });

    it('should calculate arena for extreme low-end (320x568)', () => {
      const bounds = calculateMobileAreaBounds(320, 568, 75, 110, 90);
      
      expect(bounds.width).toBeLessThanOrEqual(290); // Tighter fit
      expect(bounds.height).toBeLessThanOrEqual(240);
    });

    it('should maintain 4:3 aspect ratio', () => {
      const bounds = calculateMobileAreaBounds(375, 667, 75, 110, 90);
      const aspectRatio = bounds.width / bounds.height;
      
      // Allow small tolerance for rounding
      expect(aspectRatio).toBeCloseTo(4 / 3, 1);
    });

    it('should center arena horizontally', () => {
      const width = 375;
      const bounds = calculateMobileAreaBounds(width, 667, 75, 110, 90);
      
      // x position should be (width - areaWidth) / 2
      const expectedX = (width - bounds.width) / 2;
      expect(bounds.x).toBeCloseTo(expectedX, 1);
    });
  });

  describe('Korean Font Sizes', () => {
    it('should provide extra-small font sizes for <380px devices', () => {
      expect(getKoreanFontSize('SMALL', 375)).toBe(13);
      expect(getKoreanFontSize('MEDIUM', 360)).toBe(15);
      expect(getKoreanFontSize('LARGE', 320)).toBe(18);
    });

    it('should provide small font sizes for 380-450px devices', () => {
      expect(getKoreanFontSize('SMALL', 400)).toBe(14);
      expect(getKoreanFontSize('MEDIUM', 420)).toBe(17);
      expect(getKoreanFontSize('LARGE', 440)).toBe(20);
    });

    it('should provide regular font sizes for ≥450px devices', () => {
      expect(getKoreanFontSize('SMALL', 768)).toBe(16);
      expect(getKoreanFontSize('MEDIUM', 1024)).toBe(19);
      expect(getKoreanFontSize('LARGE', 1920)).toBe(22);
    });

    it('should ensure minimum readable size (13px)', () => {
      const size = getKoreanFontSize('SMALL', 320);
      expect(size).toBeGreaterThanOrEqual(13);
    });
  });

  describe('Performance Settings', () => {
    it('should use low tier settings for extra-small devices', () => {
      const settings = getPerformanceSettings(375, true);
      
      expect(settings).toEqual(PERFORMANCE_SETTINGS_BY_TIER.low);
      expect(settings.maxParticles).toBe(20);
      expect(settings.shadowMapSize).toBe(512);
      expect(settings.antialias).toBe(false);
      expect(settings.dpr).toBe(1); // No upscaling
      expect(settings.targetFPS).toBe(50);
    });

    it('should use medium tier settings for standard mobile', () => {
      const settings = getPerformanceSettings(400, true);
      
      expect(settings).toEqual(PERFORMANCE_SETTINGS_BY_TIER.medium);
      expect(settings.maxParticles).toBe(40);
      expect(settings.shadowMapSize).toBe(1024);
      expect(settings.antialias).toBe(true);
      expect(settings.targetFPS).toBe(55);
    });

    it('should use high tier settings for desktop', () => {
      const settings = getPerformanceSettings(1920, false);
      
      expect(settings).toEqual(PERFORMANCE_SETTINGS_BY_TIER.high);
      expect(settings.maxParticles).toBe(100);
      expect(settings.shadowMapSize).toBe(2048);
      expect(settings.postProcessing).toBe(true);
      expect(settings.targetFPS).toBe(60);
    });

    it('should scale particle count for performance', () => {
      const lowSettings = getPerformanceSettings(320, true);
      const mediumSettings = getPerformanceSettings(768, true);
      const highSettings = getPerformanceSettings(1920, false);
      
      expect(lowSettings.maxParticles).toBeLessThan(mediumSettings.maxParticles);
      expect(mediumSettings.maxParticles).toBeLessThan(highSettings.maxParticles);
    });

    it('should disable antialiasing on low-end devices', () => {
      const settings = getPerformanceSettings(360, true);
      expect(settings.antialias).toBe(false);
    });

    it('should cap DPR at 1x on low-end devices', () => {
      const settings = getPerformanceSettings(375, true);
      expect(settings.dpr).toBe(1);
    });
  });

  describe('WCAG AA Touch Target Compliance', () => {
    it('should meet minimum 44px touch target requirement', () => {
      const MINIMUM_TOUCH_TARGET = 44;
      
      // Combat layout button heights
      const extraSmallButtons = getCombatLayoutConstants(375);
      expect(extraSmallButtons.buttonHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
      
      const mobileButtons = getCombatLayoutConstants(400);
      expect(mobileButtons.buttonHeight).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
    });

    it('should exceed minimum for better usability (48px)', () => {
      const RECOMMENDED_TOUCH_TARGET = 48;
      
      const extraSmallButtons = getCombatLayoutConstants(320);
      expect(extraSmallButtons.buttonHeight).toBeGreaterThanOrEqual(RECOMMENDED_TOUCH_TARGET);
    });
  });

  describe('Screen Size Categories', () => {
    it('should categorize device widths correctly', () => {
      // Extra-small: <380px
      expect(getPerformanceTier(320, true)).toBe('low');
      expect(getPerformanceTier(375, true)).toBe('low');
      
      // Standard mobile: 380-768px
      expect(getPerformanceTier(400, true)).toBe('medium');
      expect(getPerformanceTier(750, true)).toBe('medium');
      
      // Tablet/Desktop: ≥768px
      expect(getPerformanceTier(768, false)).toBe('medium');
      expect(getPerformanceTier(1024, false)).toBe('high');
    });
  });
});
