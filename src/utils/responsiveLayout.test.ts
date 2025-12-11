/**
 * Tests for responsive layout utilities
 */

import { describe, expect, it } from 'vitest';
import {
  MIN_TOUCH_TARGET_SIZE,
  calculateControlsHeight,
  calculateFontSize,
  calculateHUDHeight,
  calculateProgressBarSize,
  calculateSafePosition,
  calculateSpacing,
  getStanceSelectorLayout,
  isValidTouchTarget,
} from './responsiveLayout';

describe('responsiveLayout utilities', () => {
  describe('isValidTouchTarget', () => {
    it('should validate minimum touch target size (44x44px)', () => {
      expect(isValidTouchTarget(44, 44)).toBe(true);
      expect(isValidTouchTarget(50, 50)).toBe(true);
      expect(isValidTouchTarget(60, 60)).toBe(true);
    });

    it('should reject targets below minimum size', () => {
      expect(isValidTouchTarget(43, 43)).toBe(false);
      expect(isValidTouchTarget(30, 30)).toBe(false);
      expect(isValidTouchTarget(20, 50)).toBe(false);
    });

    it('should use custom minimum size', () => {
      expect(isValidTouchTarget(40, 40, 40)).toBe(true);
      expect(isValidTouchTarget(39, 39, 40)).toBe(false);
    });

    it('should require both dimensions to meet minimum', () => {
      expect(isValidTouchTarget(50, 30)).toBe(false);
      expect(isValidTouchTarget(30, 50)).toBe(false);
      expect(isValidTouchTarget(50, 50)).toBe(true);
    });
  });

  describe('calculateFontSize', () => {
    it('should use minimum size for mobile (< 768px)', () => {
      expect(calculateFontSize(375, 16, 14)).toBe(14);
      expect(calculateFontSize(400, 16, 14)).toBe(14);
      expect(calculateFontSize(767, 16, 14)).toBe(14);
    });

    it('should scale for tablet (768-1024px)', () => {
      const tabletSize = calculateFontSize(800, 16, 14);
      expect(tabletSize).toBeGreaterThan(14);
      expect(tabletSize).toBeLessThan(16);
    });

    it('should use base size for desktop (>= 1024px)', () => {
      expect(calculateFontSize(1024, 16, 14)).toBe(16);
      expect(calculateFontSize(1920, 16, 14)).toBe(16);
    });

    it('should respect custom base and minimum sizes', () => {
      // calculateFontSize(375, 20, 16) -> mobile, so max(16, floor(20 * 0.875)) = max(16, 17) = 17
      expect(calculateFontSize(375, 20, 16)).toBe(17);
      expect(calculateFontSize(1920, 20, 16)).toBe(20);
    });
  });

  describe('calculateSafePosition', () => {
    it('should add safe area inset to position', () => {
      expect(calculateSafePosition(10, 44)).toBe(54);
      expect(calculateSafePosition(20, 34)).toBe(54);
      expect(calculateSafePosition(15, 44)).toBe(59);
      expect(calculateSafePosition(25, 44)).toBe(69);
    });

    it('should handle zero inset', () => {
      expect(calculateSafePosition(10, 0)).toBe(10);
      expect(calculateSafePosition(20, 0)).toBe(20);
    });

    it('should handle zero position', () => {
      expect(calculateSafePosition(0, 44)).toBe(44);
      expect(calculateSafePosition(0, 34)).toBe(34);
    });
  });

  describe('calculateHUDHeight', () => {
    it('should return compact height for small mobile portrait', () => {
      const height = calculateHUDHeight(350, false);
      expect(height).toBe(80);
    });

    it('should return standard mobile height for portrait', () => {
      // 375px is <= 375, so isSmallMobile = true, returns 80
      const height = calculateHUDHeight(375, false);
      expect(height).toBe(80);
    });

    it('should return minimized height for mobile landscape', () => {
      const heightSmall = calculateHUDHeight(350, true);
      const heightStandard = calculateHUDHeight(667, true);

      expect(heightSmall).toBe(60);
      expect(heightStandard).toBe(70);
    });

    it('should return larger height for desktop', () => {
      const height = calculateHUDHeight(1920, false);
      expect(height).toBe(120);
    });

    it('should minimize HUD in landscape to maximize gameplay', () => {
      const portrait = calculateHUDHeight(375, false);
      const landscape = calculateHUDHeight(667, true);

      expect(landscape).toBeLessThan(portrait);
    });
  });

  describe('calculateControlsHeight', () => {
    it('should return 0 for desktop (keyboard controls)', () => {
      expect(calculateControlsHeight(false, false)).toBe(0);
      expect(calculateControlsHeight(false, true)).toBe(0);
    });

    it('should return full height for mobile portrait', () => {
      expect(calculateControlsHeight(true, false)).toBe(130);
    });

    it('should return minimal height for mobile landscape', () => {
      expect(calculateControlsHeight(true, true)).toBe(100);
    });
  });

  describe('calculateSpacing', () => {
    it('should return base spacing for mobile normal density', () => {
      expect(calculateSpacing(true, 'normal')).toBe(8);
    });

    it('should return base spacing for desktop normal density', () => {
      expect(calculateSpacing(false, 'normal')).toBe(12);
    });

    it('should reduce spacing for compact density', () => {
      const normal = calculateSpacing(true, 'normal');
      const compact = calculateSpacing(true, 'compact');

      expect(compact).toBeLessThan(normal);
    });

    it('should increase spacing for spacious density', () => {
      const normal = calculateSpacing(true, 'normal');
      const spacious = calculateSpacing(true, 'spacious');

      expect(spacious).toBeGreaterThan(normal);
    });

    it('should default to normal density', () => {
      const withDensity = calculateSpacing(true, 'normal');
      const withoutDensity = calculateSpacing(true);

      expect(withoutDensity).toBe(withDensity);
    });
  });

  describe('calculateProgressBarSize', () => {
    it('should return larger health bar on mobile', () => {
      const health = calculateProgressBarSize(true, 'health');
      const ki = calculateProgressBarSize(true, 'ki');
      const stamina = calculateProgressBarSize(true, 'stamina');

      expect(health.height).toBeGreaterThan(ki.height);
      expect(health.height).toBeGreaterThan(stamina.height);
    });

    it('should meet minimum touch target for mobile health bar', () => {
      const { width, height } = calculateProgressBarSize(true, 'health');

      expect(width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
      expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
    });

    it('should return larger bars for desktop', () => {
      const mobileHealth = calculateProgressBarSize(true, 'health');
      const desktopHealth = calculateProgressBarSize(false, 'health');

      expect(desktopHealth.width).toBeGreaterThan(mobileHealth.width);
      expect(desktopHealth.height).toBeGreaterThan(mobileHealth.height);
    });

    it('should differentiate between bar types', () => {
      const health = calculateProgressBarSize(false, 'health');
      const ki = calculateProgressBarSize(false, 'ki');
      const stamina = calculateProgressBarSize(false, 'stamina');

      expect(health.height).toBeGreaterThan(ki.height);
      expect(ki.height).toBe(stamina.height);
    });
  });

  describe('getStanceSelectorLayout', () => {
    it('should return compact grid for mobile portrait', () => {
      const layout = getStanceSelectorLayout(true, false);

      expect(layout.columns).toBe(4);
      expect(layout.rows).toBe(2);
      expect(layout.gap).toBe(10);
    });

    it('should return horizontal layout for mobile landscape', () => {
      const layout = getStanceSelectorLayout(true, true);

      expect(layout.columns).toBe(4);
      expect(layout.rows).toBe(2);
      expect(layout.gap).toBe(8);
    });

    it('should return spacious layout for desktop', () => {
      const layout = getStanceSelectorLayout(false, false);

      expect(layout.columns).toBe(4);
      expect(layout.rows).toBe(2);
      expect(layout.gap).toBe(15);
    });

    it('should use tighter gap in mobile landscape', () => {
      const portrait = getStanceSelectorLayout(true, false);
      const landscape = getStanceSelectorLayout(true, true);

      expect(landscape.gap).toBeLessThan(portrait.gap);
    });

    it('should always show 8 stances (4x2 grid)', () => {
      const layouts = [
        getStanceSelectorLayout(true, false),
        getStanceSelectorLayout(true, true),
        getStanceSelectorLayout(false, false),
      ];

      layouts.forEach((layout) => {
        expect(layout.columns * layout.rows).toBe(8);
      });
    });
  });

  describe('MIN_TOUCH_TARGET_SIZE constant', () => {
    it('should be 44px (iOS Human Interface Guideline)', () => {
      expect(MIN_TOUCH_TARGET_SIZE).toBe(44);
    });
  });
});
