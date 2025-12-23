/**
 * Device Detection Tests
 * 
 * Comprehensive test coverage for mobile/tablet/desktop detection
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  detectPlatform,
  isMobileDevice,
  shouldUseMobileControls,
  getSafeAreaInsets,
  DeviceType,
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
} from './deviceDetection';

describe('deviceDetection', () => {
  // Store original values
  const originalNavigator = global.navigator;
  const originalWindow = global.window;

  /**
   * Mock navigator and window for testing
   */
  function mockEnvironment(config: {
    userAgent: string;
    width: number;
    height: number;
    hasTouch?: boolean;
    maxTouchPoints?: number;
  }) {
    // Mock navigator
    Object.defineProperty(global, 'navigator', {
      writable: true,
      configurable: true,
      value: {
        userAgent: config.userAgent,
        maxTouchPoints: config.maxTouchPoints ?? 0,
      },
    });

    // Mock window
    const mockWindow: any = {
      innerWidth: config.width,
      innerHeight: config.height,
      matchMedia: vi.fn((query: string) => ({
        matches: query === '(pointer: coarse)' && (config.hasTouch ?? false),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    };
    
    // Only add ontouchstart if touch is supported
    if (config.hasTouch) {
      mockWindow.ontouchstart = {};
    }
    
    Object.defineProperty(global, 'window', {
      writable: true,
      configurable: true,
      value: mockWindow,
    });
  }

  afterEach(() => {
    // Restore original values
    Object.defineProperty(global, 'navigator', {
      writable: true,
      configurable: true,
      value: originalNavigator,
    });
    Object.defineProperty(global, 'window', {
      writable: true,
      configurable: true,
      value: originalWindow,
    });
  });

  describe('detectPlatform', () => {
    describe('iPhone detection', () => {
      it('should detect iPhone SE as mobile iOS', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          width: 375,
          height: 667,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('ios');
        expect(result.deviceType).toBe(DeviceType.MOBILE);
        expect(result.isMobile).toBe(true);
        expect(result.isTablet).toBe(false);
        expect(result.isDesktop).toBe(false);
        expect(result.hasTouch).toBe(true);
        expect(result.screenWidth).toBe(375);
        expect(result.screenHeight).toBe(667);
      });

      it('should detect iPhone 14 Pro Max as mobile iOS (high-res)', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
          width: 430,
          height: 932,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('ios');
        expect(result.deviceType).toBe(DeviceType.MOBILE);
        expect(result.isMobile).toBe(true);
        expect(result.isTablet).toBe(false);
        expect(result.hasTouch).toBe(true);
      });

      it('should detect iPhone in landscape mode', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          width: 932,
          height: 430,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('ios');
        expect(result.deviceType).toBe(DeviceType.MOBILE);
        expect(result.isMobile).toBe(true);
        // Even in landscape with width > 768, user-agent indicates mobile
      });
    });

    describe('iPad detection', () => {
      it('should detect iPad as tablet iOS', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          width: 768,
          height: 1024,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('ios');
        expect(result.deviceType).toBe(DeviceType.TABLET);
        expect(result.isMobile).toBe(false);
        expect(result.isTablet).toBe(true);
        expect(result.isDesktop).toBe(false);
        expect(result.hasTouch).toBe(true);
      });

      it('should detect iPad Pro as tablet', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          width: 1024,
          height: 1366,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('ios');
        expect(result.deviceType).toBe(DeviceType.TABLET);
        expect(result.isTablet).toBe(true);
      });
    });

    describe('Android phone detection', () => {
      it('should detect Android phone as mobile', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 Mobile',
          width: 412,
          height: 915,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('android');
        expect(result.deviceType).toBe(DeviceType.MOBILE);
        expect(result.isMobile).toBe(true);
        expect(result.isTablet).toBe(false);
        expect(result.hasTouch).toBe(true);
      });

      it('should detect high-res Android phone as mobile', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Linux; Android 13; Samsung Galaxy S23) AppleWebKit/537.36 Mobile',
          width: 1080,
          height: 2340,
          hasTouch: true,
          maxTouchPoints: 10,
        });

        const result = detectPlatform();

        expect(result.os).toBe('android');
        expect(result.deviceType).toBe(DeviceType.MOBILE);
        expect(result.isMobile).toBe(true);
        // Even with width > 768, user-agent Mobile keyword indicates phone
      });
    });

    describe('Android tablet detection', () => {
      it('should detect Android tablet', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Linux; Android 12; Tablet) AppleWebKit/537.36',
          width: 800,
          height: 1280,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        expect(result.os).toBe('android');
        expect(result.deviceType).toBe(DeviceType.TABLET);
        expect(result.isMobile).toBe(false);
        expect(result.isTablet).toBe(true);
      });

      it('should detect Android without Mobile as tablet', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36',
          width: 1024,
          height: 768,
          hasTouch: true,
        });

        const result = detectPlatform();

        expect(result.os).toBe('android');
        expect(result.deviceType).toBe(DeviceType.TABLET);
        expect(result.isTablet).toBe(true);
      });
    });

    describe('Desktop detection', () => {
      it('should detect Windows desktop', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          width: 1920,
          height: 1080,
          hasTouch: false,
        });

        const result = detectPlatform();

        expect(result.os).toBe('windows');
        expect(result.deviceType).toBe(DeviceType.DESKTOP);
        expect(result.isMobile).toBe(false);
        expect(result.isTablet).toBe(false);
        expect(result.isDesktop).toBe(true);
        expect(result.hasTouch).toBe(false);
      });

      it('should detect macOS desktop', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0',
          width: 2560,
          height: 1440,
          hasTouch: false,
        });

        const result = detectPlatform();

        expect(result.os).toBe('macos');
        expect(result.deviceType).toBe(DeviceType.DESKTOP);
        expect(result.isDesktop).toBe(true);
      });

      it('should detect Linux desktop', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0',
          width: 1920,
          height: 1080,
          hasTouch: false,
        });

        const result = detectPlatform();

        expect(result.os).toBe('linux');
        expect(result.deviceType).toBe(DeviceType.DESKTOP);
        expect(result.isDesktop).toBe(true);
      });
    });

    describe('Edge cases', () => {
      it('should detect small desktop screen as mobile by size', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          width: 640,
          height: 480,
          hasTouch: false,
        });

        const result = detectPlatform();

        // Small screen without mobile user-agent should still be detected as mobile by size
        expect(result.deviceType).toBe(DeviceType.MOBILE);
        expect(result.isMobile).toBe(true);
      });

      it('should detect medium screen with touch as tablet', () => {
        mockEnvironment({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Touch) Chrome/120.0.0.0',
          width: 900,
          height: 1200,
          hasTouch: true,
          maxTouchPoints: 5,
        });

        const result = detectPlatform();

        // Medium screen with touch support should be tablet
        expect(result.deviceType).toBe(DeviceType.TABLET);
        expect(result.isTablet).toBe(true);
      });
    });
  });

  describe('isMobileDevice', () => {
    it('should return true for mobile phones', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        width: 375,
        height: 667,
        hasTouch: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it('should return true for tablets', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
        width: 768,
        height: 1024,
        hasTouch: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it('should return false for desktop', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        width: 1920,
        height: 1080,
        hasTouch: false,
      });

      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('shouldUseMobileControls', () => {
    it('should return true for mobile phones', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        width: 375,
        height: 667,
        hasTouch: true,
      });

      expect(shouldUseMobileControls()).toBe(true);
    });

    it('should return true for tablets', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
        width: 768,
        height: 1024,
        hasTouch: true,
      });

      expect(shouldUseMobileControls()).toBe(true);
    });

    it('should return true for small touch screens', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Touch) Chrome/120.0.0.0',
        width: 720,
        height: 1280,
        hasTouch: true,
      });

      expect(shouldUseMobileControls()).toBe(true);
    });

    it('should return false for desktop without touch', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        width: 1920,
        height: 1080,
        hasTouch: false,
      });

      expect(shouldUseMobileControls()).toBe(false);
    });

    it('should return true for high-res Android phone', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Samsung Galaxy S23) Mobile',
        width: 1080,
        height: 2340,
        hasTouch: true,
      });

      expect(shouldUseMobileControls()).toBe(true);
    });
  });

  describe('getSafeAreaInsets', () => {
    it('should return iPhone notch insets for iOS mobile', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        width: 375,
        height: 667,
        hasTouch: true,
      });

      const insets = getSafeAreaInsets();

      expect(insets.top).toBe(44);
      expect(insets.bottom).toBe(34);
      expect(insets.left).toBe(0);
      expect(insets.right).toBe(0);
    });

    it('should return Android status bar insets for Android mobile', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) Mobile',
        width: 412,
        height: 915,
        hasTouch: true,
      });

      const insets = getSafeAreaInsets();

      expect(insets.top).toBe(24);
      expect(insets.bottom).toBe(0);
      expect(insets.left).toBe(0);
      expect(insets.right).toBe(0);
    });

    it('should return no insets for tablets', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
        width: 768,
        height: 1024,
        hasTouch: true,
      });

      const insets = getSafeAreaInsets();

      expect(insets.top).toBe(0);
      expect(insets.bottom).toBe(0);
      expect(insets.left).toBe(0);
      expect(insets.right).toBe(0);
    });

    it('should return no insets for desktop', () => {
      mockEnvironment({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        width: 1920,
        height: 1080,
        hasTouch: false,
      });

      const insets = getSafeAreaInsets();

      expect(insets.top).toBe(0);
      expect(insets.bottom).toBe(0);
      expect(insets.left).toBe(0);
      expect(insets.right).toBe(0);
    });
  });

  describe('Breakpoints', () => {
    it('should export correct mobile breakpoint', () => {
      expect(MOBILE_BREAKPOINT).toBe(768);
    });

    it('should export correct tablet breakpoint', () => {
      expect(TABLET_BREAKPOINT).toBe(1024);
    });
  });
});
