/**
 * Tests for responsive layout utilities
 */

import { describe, expect, it } from 'vitest';
import {
  BREAKPOINTS,
  MIN_TOUCH_TARGET_SIZE,
  calculateControlsHeight,
  calculateFontSize,
  calculateHUDHeight,
  calculateProgressBarSize,
  calculateSafePosition,
  calculateSpacing,
  getHUDHeight,
  getResponsiveFontSize,
  getResponsivePadding,
  getResponsiveSize,
  getStanceSelectorLayout,
  isValidTouchTarget,
  shouldShowMobileControls,
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

  // NEW RESOLUTION-BASED SIZING TESTS
  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1280);
      expect(BREAKPOINTS.desktop).toBe(1920);
      expect(BREAKPOINTS.ultrawide).toBe(2560);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(BREAKPOINTS)).toBe(true);
    });
  });

  describe('getResponsiveSize', () => {
    const sizes = { mobile: 12, tablet: 14, desktop: 16 };

    it('should return mobile size for width < mobile breakpoint', () => {
      expect(getResponsiveSize(320, sizes)).toBe(12);
      expect(getResponsiveSize(500, sizes)).toBe(12);
      expect(getResponsiveSize(767, sizes)).toBe(12);
    });

    it('should interpolate between mobile and tablet', () => {
      const midpoint = (BREAKPOINTS.mobile + BREAKPOINTS.tablet) / 2;
      const result = getResponsiveSize(midpoint, sizes);
      expect(result).toBeCloseTo(13, 1); // Halfway between 12 and 14
    });

    it('should interpolate between tablet and desktop', () => {
      const midpoint = (BREAKPOINTS.tablet + BREAKPOINTS.desktop) / 2;
      const result = getResponsiveSize(midpoint, sizes);
      expect(result).toBeCloseTo(15, 1); // Halfway between 14 and 16
    });

    it('should return desktop size for width >= desktop breakpoint', () => {
      expect(getResponsiveSize(1920, sizes)).toBe(16);
      expect(getResponsiveSize(2560, sizes)).toBe(16);
      expect(getResponsiveSize(3840, sizes)).toBe(16);
    });

    it('should handle edge cases at exact breakpoints', () => {
      expect(getResponsiveSize(BREAKPOINTS.mobile, sizes)).toBe(12);
      expect(getResponsiveSize(BREAKPOINTS.tablet, sizes)).toBe(14);
      expect(getResponsiveSize(BREAKPOINTS.desktop, sizes)).toBe(16);
    });
  });

  describe('getHUDHeight', () => {
    it('should calculate percentage of screen height', () => {
      expect(getHUDHeight(1000, 0.08)).toBe(80);
      expect(getHUDHeight(1080, 0.08)).toBeCloseTo(86.4, 1);
      expect(getHUDHeight(2160, 0.08)).toBeCloseTo(120, 1); // Capped at 120
    });

    it('should enforce minimum height of 40px', () => {
      expect(getHUDHeight(400, 0.08)).toBe(40);
      expect(getHUDHeight(100, 0.08)).toBe(40);
      expect(getHUDHeight(300, 0.1)).toBe(40);
    });

    it('should enforce maximum height of 120px', () => {
      expect(getHUDHeight(2000, 0.08)).toBe(120);
      expect(getHUDHeight(3000, 0.08)).toBe(120);
      expect(getHUDHeight(2160, 0.1)).toBe(120);
    });

    it('should handle different percentage values', () => {
      expect(getHUDHeight(1000, 0.06)).toBe(60);
      expect(getHUDHeight(1000, 0.10)).toBe(100);
      expect(getHUDHeight(800, 0.125)).toBe(100);
    });
  });

  describe('getResponsivePadding', () => {
    it('should return correct padding for mobile', () => {
      expect(getResponsivePadding(320)).toBe(8);
      expect(getResponsivePadding(500)).toBe(8);
    });

    it('should interpolate padding between breakpoints', () => {
      const midpoint = (BREAKPOINTS.mobile + BREAKPOINTS.tablet) / 2;
      const result = getResponsivePadding(midpoint);
      expect(result).toBeGreaterThan(8);
      expect(result).toBeLessThan(12);
    });

    it('should return correct padding for desktop', () => {
      expect(getResponsivePadding(1920)).toBe(16);
      expect(getResponsivePadding(3840)).toBe(16);
    });
  });

  describe('getResponsiveFontSize', () => {
    it('should return correct font size for mobile', () => {
      expect(getResponsiveFontSize(320)).toBe(12);
      expect(getResponsiveFontSize(500)).toBe(12);
    });

    it('should interpolate font size between breakpoints', () => {
      const midpoint = (BREAKPOINTS.mobile + BREAKPOINTS.tablet) / 2;
      const result = getResponsiveFontSize(midpoint);
      expect(result).toBeGreaterThan(12);
      expect(result).toBeLessThan(14);
    });

    it('should return correct font size for desktop', () => {
      expect(getResponsiveFontSize(1920)).toBe(16);
      expect(getResponsiveFontSize(3840)).toBe(16);
    });
  });

  describe('shouldShowMobileControls', () => {
    it('should show controls for narrow screens regardless of isMobile', () => {
      expect(shouldShowMobileControls(320, false)).toBe(true);
      expect(shouldShowMobileControls(500, false)).toBe(true);
      expect(shouldShowMobileControls(767, false)).toBe(true);
    });

    it('should not show controls for wide screens when isMobile is false', () => {
      expect(shouldShowMobileControls(768, false)).toBe(false);
      expect(shouldShowMobileControls(1024, false)).toBe(false);
      expect(shouldShowMobileControls(1920, false)).toBe(false);
    });

    it('should show controls when isMobile is true regardless of width', () => {
      expect(shouldShowMobileControls(1920, true)).toBe(true);
      expect(shouldShowMobileControls(1024, true)).toBe(true);
      expect(shouldShowMobileControls(320, true)).toBe(true);
    });

    it('should default isMobile to false when not provided', () => {
      expect(shouldShowMobileControls(500)).toBe(true);
      expect(shouldShowMobileControls(1920)).toBe(false);
    });
  });

  describe('Multi-resolution scenarios', () => {
    const testResolutions = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Desktop HD', width: 1920, height: 1080 },
      { name: '4K', width: 3840, height: 2160 },
    ];

    it('should scale smoothly across all resolutions', () => {
      testResolutions.forEach(({ width, height }) => {
        const padding = getResponsivePadding(width);
        const fontSize = getResponsiveFontSize(width);
        const hudHeight = getHUDHeight(height, 0.08);

        // All values should be within reasonable bounds
        expect(padding).toBeGreaterThanOrEqual(8);
        expect(padding).toBeLessThanOrEqual(16);
        expect(fontSize).toBeGreaterThanOrEqual(12);
        expect(fontSize).toBeLessThanOrEqual(16);
        expect(hudHeight).toBeGreaterThanOrEqual(40);
        expect(hudHeight).toBeLessThanOrEqual(120);
      });
    });
  });
});
