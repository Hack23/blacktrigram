/**
 * Tests for useResponsiveLayout hook
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useResponsiveLayout, useContentArea, BREAKPOINTS } from './useResponsiveLayout';
import * as deviceDetection from '../utils/deviceDetection';

describe('useResponsiveLayout', () => {
  // Store original functions
  const originalShouldUseMobileControls = deviceDetection.shouldUseMobileControls;
  const originalGetSafeAreaInsets = deviceDetection.getSafeAreaInsets;

  beforeEach(() => {
    // Mock device detection to return desktop by default
    vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(false);
    vi.spyOn(deviceDetection, 'getSafeAreaInsets').mockReturnValue({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Device Detection', () => {
    it('should detect iPhone SE as small mobile', () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);
      vi.spyOn(deviceDetection, 'getSafeAreaInsets').mockReturnValue({
        top: 44,
        bottom: 34,
        left: 0,
        right: 0,
      });

      const { result } = renderHook(() => useResponsiveLayout(375, 667));

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isSmallMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isLandscape).toBe(false);
    });

    it('should detect iPhone 11 as mobile', () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);
      vi.spyOn(deviceDetection, 'getSafeAreaInsets').mockReturnValue({
        top: 44,
        bottom: 34,
        left: 0,
        right: 0,
      });

      const { result } = renderHook(() => useResponsiveLayout(414, 896));

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isSmallMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isLandscape).toBe(false);
    });

    it('should detect tablet dimensions', () => {
      // Mock as desktop (tablets not using mobile controls in test)
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(false);

      const { result } = renderHook(() => useResponsiveLayout(768, 1024));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isLandscape).toBe(false);
    });

    it('should detect desktop dimensions', () => {
      const { result } = renderHook(() => useResponsiveLayout(1920, 1080));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isLandscape).toBe(true);
    });

    it('should detect landscape orientation', () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useResponsiveLayout(667, 375));

      expect(result.current.isLandscape).toBe(true);
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('Safe Area Insets', () => {
    it('should provide safe area insets for mobile portrait', () => {
      // Mock iOS mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);
      vi.spyOn(deviceDetection, 'getSafeAreaInsets').mockReturnValue({
        top: 44,
        bottom: 34,
        left: 0,
        right: 0,
      });

      const { result } = renderHook(() => useResponsiveLayout(375, 667));

      expect(result.current.safeArea.top).toBe(44);
      expect(result.current.safeArea.bottom).toBe(34);
      expect(result.current.safeArea.left).toBe(0);
      expect(result.current.safeArea.right).toBe(0);
    });

    it('should provide safe area insets for mobile landscape', () => {
      // Mock iOS mobile device in landscape
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);
      vi.spyOn(deviceDetection, 'getSafeAreaInsets').mockReturnValue({
        top: 44,
        bottom: 34,
        left: 0,
        right: 0,
      });

      const { result } = renderHook(() => useResponsiveLayout(667, 375));

      expect(result.current.safeArea.top).toBe(44);
      expect(result.current.safeArea.bottom).toBe(34);
      expect(result.current.safeArea.left).toBe(0); // No horizontal insets in portrait on new implementation
      expect(result.current.safeArea.right).toBe(0);
    });

    it('should not provide safe area insets for desktop', () => {
      const { result } = renderHook(() => useResponsiveLayout(1920, 1080));

      expect(result.current.safeArea.top).toBe(0);
      expect(result.current.safeArea.bottom).toBe(0);
      expect(result.current.safeArea.left).toBe(0);
      expect(result.current.safeArea.right).toBe(0);
    });
  });

  describe('Touch Targets', () => {
    it('should provide iOS-compliant touch targets (44px minimum)', () => {
      const { result } = renderHook(() => useResponsiveLayout(375, 667));

      expect(result.current.touchTarget.small).toBeGreaterThanOrEqual(44);
      expect(result.current.touchTarget.medium).toBeGreaterThanOrEqual(44);
      expect(result.current.touchTarget.large).toBeGreaterThanOrEqual(44);
    });

    it('should scale touch targets for small mobile', () => {
      const { result } = renderHook(() => useResponsiveLayout(350, 600));

      expect(result.current.touchTarget.small).toBe(44);
      expect(result.current.touchTarget.medium).toBe(50);
      expect(result.current.touchTarget.large).toBe(60);
    });

    it('should scale touch targets for larger mobile', () => {
      const { result } = renderHook(() => useResponsiveLayout(414, 896));

      expect(result.current.touchTarget.small).toBe(44);
      expect(result.current.touchTarget.medium).toBe(60);
      expect(result.current.touchTarget.large).toBe(80);
    });
  });

  describe('Font Sizes', () => {
    it('should provide readable font sizes for small mobile (14px minimum body)', () => {
      const { result } = renderHook(() => useResponsiveLayout(350, 600));

      expect(result.current.fontSize.small).toBeGreaterThanOrEqual(12);
      expect(result.current.fontSize.body).toBeGreaterThanOrEqual(14);
      expect(result.current.fontSize.hud).toBeGreaterThanOrEqual(16);
    });

    it('should provide larger font sizes for desktop', () => {
      const { result } = renderHook(() => useResponsiveLayout(1920, 1080));

      expect(result.current.fontSize.body).toBeGreaterThanOrEqual(16);
      expect(result.current.fontSize.title).toBeGreaterThanOrEqual(22);
      expect(result.current.fontSize.hero).toBeGreaterThanOrEqual(32);
    });

    it('should scale HUD font appropriately', () => {
      const mobile = renderHook(() => useResponsiveLayout(375, 667));
      const desktop = renderHook(() => useResponsiveLayout(1920, 1080));

      expect(mobile.result.current.fontSize.hud).toBeLessThan(
        desktop.result.current.fontSize.hud
      );
    });
  });

  describe('Spacing', () => {
    it('should provide compact spacing for small mobile', () => {
      const { result } = renderHook(() => useResponsiveLayout(350, 600));

      expect(result.current.spacing.xs).toBeLessThanOrEqual(8);
      expect(result.current.spacing.sm).toBeLessThanOrEqual(12);
      expect(result.current.spacing.md).toBeLessThanOrEqual(16);
    });

    it('should provide spacious spacing for desktop', () => {
      const { result } = renderHook(() => useResponsiveLayout(1920, 1080));

      expect(result.current.spacing.xs).toBeGreaterThanOrEqual(8);
      expect(result.current.spacing.md).toBeGreaterThanOrEqual(16);
      expect(result.current.spacing.xl).toBeGreaterThanOrEqual(32);
    });
  });

  describe('Viewport', () => {
    it('should return viewport dimensions', () => {
      const { result } = renderHook(() => useResponsiveLayout(375, 667));

      expect(result.current.viewport.width).toBe(375);
      expect(result.current.viewport.height).toBe(667);
    });
  });

  describe('Memoization', () => {
    it('should return same object reference for same dimensions', () => {
      const { result, rerender } = renderHook(
        ({ w, h }) => useResponsiveLayout(w, h),
        { initialProps: { w: 375, h: 667 } }
      );

      const firstResult = result.current;
      rerender({ w: 375, h: 667 });

      expect(result.current).toBe(firstResult);
    });

    it('should return new object reference when dimensions change', () => {
      const { result, rerender } = renderHook(
        ({ w, h }) => useResponsiveLayout(w, h),
        { initialProps: { w: 375, h: 667 } }
      );

      const firstResult = result.current;
      rerender({ w: 414, h: 896 });

      expect(result.current).not.toBe(firstResult);
    });
  });
});

describe('useContentArea', () => {
  it('should calculate available content area with safe insets', () => {
    const layout = {
      isMobile: true,
      isSmallMobile: true,
      isTablet: false,
      isLandscape: false,
      safeArea: { top: 44, bottom: 34, left: 0, right: 0 },
      touchTarget: { small: 44, medium: 50, large: 60 },
      fontSize: { small: 12, body: 14, title: 18, hero: 24, hud: 16 },
      spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
      viewport: { width: 375, height: 667 },
    };

    const { result } = renderHook(() => useContentArea(layout, 80, 130));

    // Verify content area accounts for safe areas and reserved space
    expect(result.current.width).toBeLessThan(layout.viewport.width);
    expect(result.current.height).toBeLessThan(layout.viewport.height);

    // Verify position accounts for safe area and HUD
    expect(result.current.x).toBeGreaterThanOrEqual(layout.safeArea.left);
    expect(result.current.y).toBeGreaterThanOrEqual(layout.safeArea.top + 80);
  });

  it('should maximize content area on desktop', () => {
    const layout = {
      isMobile: false,
      isSmallMobile: false,
      isTablet: false,
      isLandscape: true,
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
      touchTarget: { small: 44, medium: 60, large: 80 },
      fontSize: { small: 14, body: 16, title: 24, hero: 36, hud: 20 },
      spacing: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 },
      viewport: { width: 1920, height: 1080 },
    };

    const { result } = renderHook(() => useContentArea(layout, 120, 0));

    // Desktop should have minimal reserved space
    expect(result.current.width).toBeGreaterThan(1800);
    expect(result.current.height).toBeGreaterThan(900);
  });

  it('should memoize results', () => {
    const layout = {
      isMobile: true,
      isSmallMobile: false,
      isTablet: false,
      isLandscape: false,
      safeArea: { top: 44, bottom: 34, left: 0, right: 0 },
      touchTarget: { small: 44, medium: 60, large: 80 },
      fontSize: { small: 14, body: 16, title: 24, hero: 36, hud: 20 },
      spacing: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 },
      viewport: { width: 414, height: 896 },
    };

    const { result, rerender } = renderHook(
      ({ l, h, c }) => useContentArea(l, h, c),
      { initialProps: { l: layout, h: 80, c: 130 } }
    );

    const firstResult = result.current;
    rerender({ l: layout, h: 80, c: 130 });

    expect(result.current).toBe(firstResult);
  });
});

describe('BREAKPOINTS', () => {
  it('should define standard breakpoints', () => {
    expect(BREAKPOINTS.MOBILE_SMALL).toBe(375);
    expect(BREAKPOINTS.MOBILE).toBe(768);
    expect(BREAKPOINTS.TABLET).toBe(1024);
    expect(BREAKPOINTS.DESKTOP).toBe(1920);
  });
});
