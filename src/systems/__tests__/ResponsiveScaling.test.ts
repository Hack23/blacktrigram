/**
 * Tests for ResponsiveScaling System
 * 
 * Validates responsive scaling calculations across all screen sizes
 * from mobile (375px) to ultra-wide (2560px+)
 */

import { describe, expect, it } from 'vitest';
import {
  RESPONSIVE_BREAKPOINTS,
  FONT_SCALE_MAP,
  SPACING_SCALE_MAP,
  DEFAULT_RESIZE_TRANSITION,
  FONT_SIZE_CONSTRAINTS,
  getScreenSize,
  calculateFontSize,
  calculateSpacing,
  getFontScale,
  getSpacingScale,
  createTransitionString,
  createResponsiveConfig,
  calculateResponsiveValues,
  testScreenSize,
  isMobileSize,
  isTabletSize,
  isDesktopSize,
} from '../ResponsiveScaling';

describe('ResponsiveScaling - Constants', () => {
  it('should define five breakpoints', () => {
    expect(RESPONSIVE_BREAKPOINTS.MOBILE).toBe(768);
    expect(RESPONSIVE_BREAKPOINTS.TABLET).toBe(1024);
    expect(RESPONSIVE_BREAKPOINTS.DESKTOP).toBe(1440);
    expect(RESPONSIVE_BREAKPOINTS.LARGE).toBe(1920);
    expect(RESPONSIVE_BREAKPOINTS.XLARGE).toBe(2560);
  });

  it('should define font scale multipliers', () => {
    expect(FONT_SCALE_MAP.mobile).toBe(0.8);
    expect(FONT_SCALE_MAP.tablet).toBe(0.9);
    expect(FONT_SCALE_MAP.desktop).toBe(1.0);
    expect(FONT_SCALE_MAP.large).toBe(1.2);
    expect(FONT_SCALE_MAP.xlarge).toBe(1.4);
  });

  it('should define spacing scale multipliers', () => {
    expect(SPACING_SCALE_MAP.mobile).toBe(0.5);
    expect(SPACING_SCALE_MAP.tablet).toBe(0.75);
    expect(SPACING_SCALE_MAP.desktop).toBe(1.0);
    expect(SPACING_SCALE_MAP.large).toBe(1.25);
    expect(SPACING_SCALE_MAP.xlarge).toBe(1.5);
  });

  it('should define transition configuration', () => {
    expect(DEFAULT_RESIZE_TRANSITION.duration).toBe('300ms');
    expect(DEFAULT_RESIZE_TRANSITION.easing).toBe('ease-in-out');
    expect(DEFAULT_RESIZE_TRANSITION.enabled).toBe(true);
    expect(DEFAULT_RESIZE_TRANSITION.properties).toContain('font-size');
    expect(DEFAULT_RESIZE_TRANSITION.properties).toContain('padding');
  });

  it('should define font size constraints', () => {
    expect(FONT_SIZE_CONSTRAINTS.MIN_BODY_SIZE).toBe(14);
    expect(FONT_SIZE_CONSTRAINTS.MAX_SIZE).toBe(24);
    expect(FONT_SIZE_CONSTRAINTS.BASE_SIZE).toBe(16);
  });
});

describe('ResponsiveScaling - getScreenSize', () => {
  describe('mobile screens', () => {
    it('should detect iPhone SE (375px)', () => {
      expect(getScreenSize(375)).toBe('mobile');
    });

    it('should detect standard mobile (414px)', () => {
      expect(getScreenSize(414)).toBe('mobile');
    });

    it('should detect large mobile (430px)', () => {
      expect(getScreenSize(430)).toBe('mobile');
    });

    it('should detect mobile at breakpoint boundary (767px)', () => {
      expect(getScreenSize(767)).toBe('mobile');
    });
  });

  describe('tablet screens', () => {
    it('should detect tablet at lower boundary (768px)', () => {
      expect(getScreenSize(768)).toBe('tablet');
    });

    it('should detect iPad (800px)', () => {
      expect(getScreenSize(800)).toBe('tablet');
    });

    it('should detect tablet at upper boundary (1023px)', () => {
      expect(getScreenSize(1023)).toBe('tablet');
    });
  });

  describe('desktop screens', () => {
    it('should detect desktop at lower boundary (1024px)', () => {
      expect(getScreenSize(1024)).toBe('desktop');
    });

    it('should detect standard desktop (1280px)', () => {
      expect(getScreenSize(1280)).toBe('desktop');
    });

    it('should detect desktop at upper boundary (1439px)', () => {
      expect(getScreenSize(1439)).toBe('desktop');
    });
  });

  describe('large desktop screens', () => {
    it('should detect large at lower boundary (1440px)', () => {
      expect(getScreenSize(1440)).toBe('large');
    });

    it('should detect HD display (1920px)', () => {
      expect(getScreenSize(1920)).toBe('xlarge');
    });

    it('should detect large at upper boundary (1919px)', () => {
      expect(getScreenSize(1919)).toBe('large');
    });
  });

  describe('extra large screens', () => {
    it('should detect 2K display (2560px)', () => {
      expect(getScreenSize(2560)).toBe('xlarge');
    });

    it('should detect 4K display (3840px)', () => {
      expect(getScreenSize(3840)).toBe('xlarge');
    });

    it('should detect ultra-wide (5120px)', () => {
      expect(getScreenSize(5120)).toBe('xlarge');
    });
  });
});

describe('ResponsiveScaling - calculateFontSize', () => {
  const BASE_SIZE = 16;

  describe('mobile scaling', () => {
    it('should scale down but clamp to minimum (14px)', () => {
      // 16 * 0.8 = 12.8, clamped to 14
      const result = calculateFontSize(BASE_SIZE, 'mobile');
      expect(result).toBe(14);
    });

    it('should clamp larger base sizes appropriately', () => {
      // 20 * 0.8 = 16, no clamping needed
      const result = calculateFontSize(20, 'mobile');
      expect(result).toBe(16);
    });
  });

  describe('tablet scaling', () => {
    it('should scale to 90%', () => {
      // 16 * 0.9 = 14.4
      const result = calculateFontSize(BASE_SIZE, 'tablet');
      expect(result).toBe(14.4);
    });

    it('should respect minimum constraint', () => {
      // 12 * 0.9 = 10.8, clamped to 14
      const result = calculateFontSize(12, 'tablet');
      expect(result).toBe(14);
    });
  });

  describe('desktop scaling', () => {
    it('should use base size (100%)', () => {
      // 16 * 1.0 = 16
      const result = calculateFontSize(BASE_SIZE, 'desktop');
      expect(result).toBe(16);
    });

    it('should maintain exact base value', () => {
      const result = calculateFontSize(18, 'desktop');
      expect(result).toBe(18);
    });
  });

  describe('large desktop scaling', () => {
    it('should scale to 120%', () => {
      // 16 * 1.2 = 19.2
      const result = calculateFontSize(BASE_SIZE, 'large');
      expect(result).toBe(19.2);
    });

    it('should not exceed maximum', () => {
      // 24 * 1.2 = 28.8, clamped to 24
      const result = calculateFontSize(24, 'large');
      expect(result).toBe(24);
    });
  });

  describe('extra large scaling', () => {
    it('should scale to 140%', () => {
      // 16 * 1.4 = 22.4
      const result = calculateFontSize(BASE_SIZE, 'xlarge');
      expect(result).toBe(22.4);
    });

    it('should clamp to maximum (24px)', () => {
      // 20 * 1.4 = 28, clamped to 24
      const result = calculateFontSize(20, 'xlarge');
      expect(result).toBe(24);
    });
  });

  describe('custom constraints', () => {
    it('should respect custom minimum', () => {
      const result = calculateFontSize(10, 'mobile', 12, 30);
      expect(result).toBe(12);
    });

    it('should respect custom maximum', () => {
      const result = calculateFontSize(30, 'xlarge', 10, 20);
      expect(result).toBe(20);
    });
  });

  describe('Korean text readability', () => {
    it('should keep body text readable on mobile', () => {
      const result = calculateFontSize(16, 'mobile');
      expect(result).toBeGreaterThanOrEqual(14);
    });

    it('should not exceed comfortable reading size', () => {
      const result = calculateFontSize(20, 'xlarge');
      expect(result).toBeLessThanOrEqual(24);
    });
  });
});

describe('ResponsiveScaling - calculateSpacing', () => {
  const BASE_SPACING = 20;

  it('should scale mobile spacing to 50%', () => {
    // 20 * 0.5 = 10
    expect(calculateSpacing(BASE_SPACING, 'mobile')).toBe(10);
  });

  it('should scale tablet spacing to 75%', () => {
    // 20 * 0.75 = 15
    expect(calculateSpacing(BASE_SPACING, 'tablet')).toBe(15);
  });

  it('should keep desktop spacing at 100%', () => {
    // 20 * 1.0 = 20
    expect(calculateSpacing(BASE_SPACING, 'desktop')).toBe(20);
  });

  it('should scale large spacing to 125%', () => {
    // 20 * 1.25 = 25
    expect(calculateSpacing(BASE_SPACING, 'large')).toBe(25);
  });

  it('should scale xlarge spacing to 150%', () => {
    // 20 * 1.5 = 30
    expect(calculateSpacing(BASE_SPACING, 'xlarge')).toBe(30);
  });

  it('should round fractional values', () => {
    // 17 * 0.5 = 8.5, rounded to 9
    expect(calculateSpacing(17, 'mobile')).toBe(9);
  });
});

describe('ResponsiveScaling - getFontScale', () => {
  it('should return correct scale for each screen size', () => {
    expect(getFontScale('mobile')).toBe(0.8);
    expect(getFontScale('tablet')).toBe(0.9);
    expect(getFontScale('desktop')).toBe(1.0);
    expect(getFontScale('large')).toBe(1.2);
    expect(getFontScale('xlarge')).toBe(1.4);
  });
});

describe('ResponsiveScaling - getSpacingScale', () => {
  it('should return correct scale for each screen size', () => {
    expect(getSpacingScale('mobile')).toBe(0.5);
    expect(getSpacingScale('tablet')).toBe(0.75);
    expect(getSpacingScale('desktop')).toBe(1.0);
    expect(getSpacingScale('large')).toBe(1.25);
    expect(getSpacingScale('xlarge')).toBe(1.5);
  });
});

describe('ResponsiveScaling - createTransitionString', () => {
  it('should create default transition string', () => {
    const result = createTransitionString();
    expect(result).toContain('font-size 300ms ease-in-out');
    expect(result).toContain('padding 300ms ease-in-out');
    expect(result).toContain('margin 300ms ease-in-out');
  });

  it('should accept custom duration', () => {
    const result = createTransitionString({ duration: '200ms' });
    expect(result).toContain('200ms');
  });

  it('should accept custom easing', () => {
    const result = createTransitionString({ easing: 'linear' });
    expect(result).toContain('linear');
  });

  it('should return "none" when disabled', () => {
    const result = createTransitionString({ enabled: false });
    expect(result).toBe('none');
  });

  it('should handle custom properties', () => {
    const result = createTransitionString({
      properties: ['opacity', 'transform'],
    });
    expect(result).toContain('opacity 300ms ease-in-out');
    expect(result).toContain('transform 300ms ease-in-out');
    expect(result).not.toContain('font-size');
  });
});

describe('ResponsiveScaling - createResponsiveConfig', () => {
  it('should create config for mobile', () => {
    const config = createResponsiveConfig(375, 667);
    expect(config.screenSize).toBe('mobile');
    expect(config.fontScale).toBe(0.8);
    expect(config.spacingScale).toBe(0.5);
    expect(config.viewport.width).toBe(375);
    expect(config.viewport.height).toBe(667);
  });

  it('should create config for tablet', () => {
    const config = createResponsiveConfig(768, 1024);
    expect(config.screenSize).toBe('tablet');
    expect(config.fontScale).toBe(0.9);
    expect(config.spacingScale).toBe(0.75);
  });

  it('should create config for desktop', () => {
    const config = createResponsiveConfig(1280, 800);
    expect(config.screenSize).toBe('desktop');
    expect(config.fontScale).toBe(1.0);
    expect(config.spacingScale).toBe(1.0);
  });

  it('should create config for large', () => {
    const config = createResponsiveConfig(1440, 900);
    expect(config.screenSize).toBe('large');
    expect(config.fontScale).toBe(1.2);
    expect(config.spacingScale).toBe(1.25);
  });

  it('should create config for xlarge', () => {
    const config = createResponsiveConfig(2560, 1440);
    expect(config.screenSize).toBe('xlarge');
    expect(config.fontScale).toBe(1.4);
    expect(config.spacingScale).toBe(1.5);
  });
});

describe('ResponsiveScaling - calculateResponsiveValues', () => {
  describe('mobile values (375px)', () => {
    const values = calculateResponsiveValues(375);

    it('should calculate readable font sizes', () => {
      expect(values.fontSize.small).toBeGreaterThanOrEqual(12);
      expect(values.fontSize.body).toBe(14); // Clamped minimum
      expect(values.fontSize.title).toBeGreaterThanOrEqual(18);
      expect(values.fontSize.hero).toBeGreaterThanOrEqual(24);
      expect(values.fontSize.hud).toBeGreaterThanOrEqual(16);
    });

    it('should calculate compact spacing', () => {
      expect(values.spacing.xs).toBeLessThanOrEqual(8);
      expect(values.spacing.sm).toBeLessThanOrEqual(12);
      expect(values.spacing.md).toBe(8); // 16 * 0.5
      expect(values.spacing.lg).toBe(12); // 24 * 0.5
      expect(values.spacing.xl).toBe(16); // 32 * 0.5
    });

    it('should include transition string', () => {
      expect(values.transition).toContain('ease-in-out');
    });
  });

  describe('tablet values (768px)', () => {
    const values = calculateResponsiveValues(768);

    it('should calculate moderate font sizes', () => {
      expect(values.fontSize.body).toBe(14.4); // 16 * 0.9
      expect(values.fontSize.title).toBeGreaterThan(18);
    });

    it('should calculate moderate spacing', () => {
      expect(values.spacing.md).toBe(12); // 16 * 0.75
    });
  });

  describe('desktop values (1280px)', () => {
    const values = calculateResponsiveValues(1280);

    it('should use base font sizes', () => {
      expect(values.fontSize.body).toBe(16); // 16 * 1.0
    });

    it('should use base spacing', () => {
      expect(values.spacing.md).toBe(16); // 16 * 1.0
    });
  });

  describe('large values (1440px)', () => {
    const values = calculateResponsiveValues(1440);

    it('should scale up font sizes', () => {
      expect(values.fontSize.body).toBe(19.2); // 16 * 1.2
    });

    it('should scale up spacing', () => {
      expect(values.spacing.md).toBe(20); // 16 * 1.25
    });
  });

  describe('xlarge values (2560px)', () => {
    const values = calculateResponsiveValues(2560);

    it('should scale to maximum readable sizes', () => {
      expect(values.fontSize.body).toBe(22.4); // 16 * 1.4
      expect(values.fontSize.hero).toBeLessThanOrEqual(36);
    });

    it('should scale to maximum spacing', () => {
      expect(values.spacing.md).toBe(24); // 16 * 1.5
      expect(values.spacing.xl).toBe(48); // 32 * 1.5
    });
  });

  describe('custom base values', () => {
    it('should accept custom base font size', () => {
      const values = calculateResponsiveValues(1280, 18);
      expect(values.fontSize.body).toBe(18); // 18 * 1.0 for desktop
    });

    it('should accept custom base spacing', () => {
      const values = calculateResponsiveValues(1280, 16, 20);
      expect(values.spacing.md).toBe(20); // 20 * 1.0 for desktop
    });
  });
});

describe('ResponsiveScaling - testScreenSize', () => {
  it('should provide complete test results for mobile', () => {
    const result = testScreenSize(375, 667);
    expect(result.width).toBe(375);
    expect(result.height).toBe(667);
    expect(result.screenSize).toBe('mobile');
    expect(result.isMobile).toBe(true);
    expect(result.isTablet).toBe(false);
    expect(result.isDesktop).toBe(false);
  });

  it('should provide complete test results for tablet', () => {
    const result = testScreenSize(768, 1024);
    expect(result.screenSize).toBe('tablet');
    expect(result.isMobile).toBe(false);
    expect(result.isTablet).toBe(true);
    expect(result.isDesktop).toBe(false);
  });

  it('should provide complete test results for desktop', () => {
    const result = testScreenSize(1280, 800);
    expect(result.screenSize).toBe('desktop');
    expect(result.isMobile).toBe(false);
    expect(result.isTablet).toBe(false);
    expect(result.isDesktop).toBe(true);
  });
});

describe('ResponsiveScaling - Helper Functions', () => {
  describe('isMobileSize', () => {
    it('should return true for mobile widths', () => {
      expect(isMobileSize(375)).toBe(true);
      expect(isMobileSize(767)).toBe(true);
    });

    it('should return false for non-mobile widths', () => {
      expect(isMobileSize(768)).toBe(false);
      expect(isMobileSize(1280)).toBe(false);
    });
  });

  describe('isTabletSize', () => {
    it('should return true for tablet widths', () => {
      expect(isTabletSize(768)).toBe(true);
      expect(isTabletSize(1000)).toBe(true);
    });

    it('should return false for non-tablet widths', () => {
      expect(isTabletSize(375)).toBe(false);
      expect(isTabletSize(1280)).toBe(false);
    });
  });

  describe('isDesktopSize', () => {
    it('should return true for desktop and larger', () => {
      expect(isDesktopSize(1024)).toBe(true);
      expect(isDesktopSize(1440)).toBe(true);
      expect(isDesktopSize(2560)).toBe(true);
    });

    it('should return false for mobile and tablet', () => {
      expect(isDesktopSize(375)).toBe(false);
      expect(isDesktopSize(768)).toBe(false);
    });
  });
});

describe('ResponsiveScaling - Edge Cases', () => {
  it('should handle very small screens (320px)', () => {
    const values = calculateResponsiveValues(320);
    expect(values.fontSize.body).toBeGreaterThanOrEqual(14);
    expect(values.spacing.md).toBeGreaterThan(0);
  });

  it('should handle very large screens (8K: 7680px)', () => {
    const values = calculateResponsiveValues(7680);
    expect(values.fontSize.body).toBeLessThanOrEqual(24);
    expect(values.spacing.md).toBeGreaterThan(0);
  });

  it('should handle square screens', () => {
    const values = calculateResponsiveValues(1000);
    expect(values.fontSize.body).toBeGreaterThan(0);
    expect(values.spacing.md).toBeGreaterThan(0);
  });

  it('should handle portrait orientations', () => {
    const values = calculateResponsiveValues(1024); // iPad Pro portrait
    expect(values.fontSize.body).toBeGreaterThan(0);
  });

  it('should handle landscape orientations', () => {
    const values = calculateResponsiveValues(1366); // iPad Pro landscape
    expect(values.fontSize.body).toBeGreaterThan(0);
  });
});

describe('ResponsiveScaling - Comprehensive Screen Size Coverage', () => {
  const testCases = [
    { width: 375, height: 667, expected: 'mobile', name: 'iPhone SE' },
    { width: 414, height: 896, expected: 'mobile', name: 'iPhone 11' },
    { width: 768, height: 1024, expected: 'tablet', name: 'iPad' },
    { width: 800, height: 1280, expected: 'tablet', name: 'Android Tablet' },
    { width: 1024, height: 768, expected: 'desktop', name: 'Small Desktop' },
    { width: 1280, height: 800, expected: 'desktop', name: 'Standard Desktop' },
    { width: 1440, height: 900, expected: 'large', name: 'HD Display' },
    { width: 1920, height: 1080, expected: 'xlarge', name: '2K Display' },
    { width: 2560, height: 1440, expected: 'xlarge', name: '4K Display' },
    { width: 3440, height: 1440, expected: 'xlarge', name: 'Ultra-wide' },
  ];

  testCases.forEach(({ width, height, expected, name }) => {
    it(`should correctly categorize ${name} (${width}x${height})`, () => {
      const size = getScreenSize(width);
      expect(size).toBe(expected);
      
      const values = calculateResponsiveValues(width, height);
      expect(values.fontSize.body).toBeGreaterThanOrEqual(14);
      expect(values.fontSize.body).toBeLessThanOrEqual(24);
    });
  });
});
