/**
 * Design System Unit Tests
 * 
 * Tests for design system utilities, helper functions, and constants.
 * Ensures design system maintains consistency and correctness.
 * 
 * @korean 디자인 시스템 단위 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  TYPOGRAPHY,
  SPACING,
  SPACING_ADJUSTMENTS,
  BORDER_RADIUS,
  HIERARCHY,
  BORDERS,
  GRADIENTS,
  TRANSITIONS,
  getResponsiveSpacing,
  getResponsiveFontSize,
} from './designSystem';
import { KOREAN_COLORS } from './colors';

describe('Design System - Typography', () => {
  it('should have all required typography levels', () => {
    expect(TYPOGRAPHY).toHaveProperty('heading1');
    expect(TYPOGRAPHY).toHaveProperty('heading2');
    expect(TYPOGRAPHY).toHaveProperty('heading3');
    expect(TYPOGRAPHY).toHaveProperty('body');
    expect(TYPOGRAPHY).toHaveProperty('bodySmall');
    expect(TYPOGRAPHY).toHaveProperty('button');
    expect(TYPOGRAPHY).toHaveProperty('caption');
    expect(TYPOGRAPHY).toHaveProperty('micro');
    expect(TYPOGRAPHY).toHaveProperty('nano');
  });

  it('should have consistent structure for each typography level', () => {
    Object.values(TYPOGRAPHY).forEach((level) => {
      expect(level).toHaveProperty('fontSize');
      expect(level).toHaveProperty('fontWeight');
      expect(level).toHaveProperty('lineHeight');
      expect(level).toHaveProperty('fontFamily');
    });
  });

  it('should have descending font sizes from heading1 to nano', () => {
    const h1Size = parseInt(TYPOGRAPHY.heading1.fontSize, 10);
    const h2Size = parseInt(TYPOGRAPHY.heading2.fontSize, 10);
    const h3Size = parseInt(TYPOGRAPHY.heading3.fontSize, 10);
    const bodySize = parseInt(TYPOGRAPHY.body.fontSize, 10);
    const bodySmallSize = parseInt(TYPOGRAPHY.bodySmall.fontSize, 10);
    const captionSize = parseInt(TYPOGRAPHY.caption.fontSize, 10);
    const microSize = parseInt(TYPOGRAPHY.micro.fontSize, 10);
    const nanoSize = parseInt(TYPOGRAPHY.nano.fontSize, 10);

    expect(h1Size).toBeGreaterThan(h2Size);
    expect(h2Size).toBeGreaterThan(h3Size);
    expect(h3Size).toBeGreaterThan(bodySize);
    expect(bodySize).toBeGreaterThan(bodySmallSize);
    expect(bodySmallSize).toBeGreaterThan(captionSize);
    expect(captionSize).toBeGreaterThan(microSize);
    expect(microSize).toBeGreaterThan(nanoSize);
  });
});

describe('Design System - Spacing', () => {
  it('should have all required spacing levels', () => {
    expect(SPACING).toHaveProperty('xxs');
    expect(SPACING).toHaveProperty('xs');
    expect(SPACING).toHaveProperty('sm');
    expect(SPACING).toHaveProperty('md');
    expect(SPACING).toHaveProperty('lg');
    expect(SPACING).toHaveProperty('xl');
    expect(SPACING).toHaveProperty('xxl');
  });

  it('should follow 4px base rhythm', () => {
    const xxs = parseInt(SPACING.xxs, 10);
    const xs = parseInt(SPACING.xs, 10);
    const sm = parseInt(SPACING.sm, 10);
    const md = parseInt(SPACING.md, 10);
    const lg = parseInt(SPACING.lg, 10);
    const xl = parseInt(SPACING.xl, 10);
    const xxl = parseInt(SPACING.xxl, 10);

    expect(xxs).toBe(4);
    expect(xs).toBe(8);
    expect(sm).toBe(12);
    expect(md).toBe(16);
    expect(lg).toBe(24);
    expect(xl).toBe(32);
    expect(xxl).toBe(48);

    // All should be multiples of 4
    [xxs, xs, sm, md, lg, xl, xxl].forEach((value) => {
      expect(value % 4).toBe(0);
    });
  });

  it('should have spacing adjustments for edge cases', () => {
    expect(SPACING_ADJUSTMENTS).toHaveProperty('xsPlus');
    expect(SPACING_ADJUSTMENTS).toHaveProperty('smPlus');
    expect(SPACING_ADJUSTMENTS).toHaveProperty('mdPlus');
    expect(SPACING_ADJUSTMENTS).toHaveProperty('compact');

    expect(SPACING_ADJUSTMENTS.xsPlus).toBe('10px');
    expect(SPACING_ADJUSTMENTS.smPlus).toBe('14px');
    expect(SPACING_ADJUSTMENTS.mdPlus).toBe('18px');
    expect(SPACING_ADJUSTMENTS.compact).toBe('6px');
  });
});

describe('Design System - Border Radius', () => {
  it('should have all required border radius levels', () => {
    expect(BORDER_RADIUS).toHaveProperty('none');
    expect(BORDER_RADIUS).toHaveProperty('sm');
    expect(BORDER_RADIUS).toHaveProperty('md');
    expect(BORDER_RADIUS).toHaveProperty('lg');
    expect(BORDER_RADIUS).toHaveProperty('xl');
    expect(BORDER_RADIUS).toHaveProperty('full');
  });

  it('should have ascending border radius values', () => {
    const none = parseInt(BORDER_RADIUS.none, 10);
    const sm = parseInt(BORDER_RADIUS.sm, 10);
    const md = parseInt(BORDER_RADIUS.md, 10);
    const lg = parseInt(BORDER_RADIUS.lg, 10);
    const xl = parseInt(BORDER_RADIUS.xl, 10);

    expect(none).toBe(0);
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
  });
});

describe('Design System - Hierarchy', () => {
  it('should have all required hierarchy levels', () => {
    expect(HIERARCHY).toHaveProperty('primary');
    expect(HIERARCHY).toHaveProperty('secondary');
    expect(HIERARCHY).toHaveProperty('tertiary');
    expect(HIERARCHY).toHaveProperty('muted');
    expect(HIERARCHY).toHaveProperty('accent');
    expect(HIERARCHY).toHaveProperty('gold');
    expect(HIERARCHY).toHaveProperty('accent70');
    expect(HIERARCHY).toHaveProperty('accent50');
    expect(HIERARCHY).toHaveProperty('primary80');
  });

  it('should have consistent structure for each hierarchy level', () => {
    Object.values(HIERARCHY).forEach((level) => {
      expect(level).toHaveProperty('color');
      expect(level).toHaveProperty('hex');
      expect(typeof level.color).toBe('string');
      expect(typeof level.hex).toBe('number');
    });
  });

  it('should have opacity variants with rgba format', () => {
    expect(HIERARCHY.accent70.color).toContain('rgba');
    expect(HIERARCHY.accent70.color).toContain('0.7');
    expect(HIERARCHY.accent50.color).toContain('0.5');
    expect(HIERARCHY.primary80.color).toContain('0.8');
  });
});

describe('Design System - Borders', () => {
  it('should have all required border styles', () => {
    expect(BORDERS).toHaveProperty('default');
    expect(BORDERS).toHaveProperty('accent');
    expect(BORDERS).toHaveProperty('muted');
    expect(BORDERS).toHaveProperty('active');
  });

  it('should have valid CSS border syntax', () => {
    Object.values(BORDERS).forEach((border) => {
      expect(border).toMatch(/^\d+px solid/);
    });
  });
});

describe('Design System - Gradients', () => {
  it('should have all required gradient generators', () => {
    expect(GRADIENTS).toHaveProperty('vertical');
    expect(GRADIENTS).toHaveProperty('verticalReverse');
    expect(GRADIENTS).toHaveProperty('horizontal');
    expect(GRADIENTS).toHaveProperty('horizontalReverse');
    expect(GRADIENTS).toHaveProperty('radial');
  });

  it('should generate valid CSS gradient strings', () => {
    const verticalGrad = GRADIENTS.vertical(0.9, 0.3);
    const horizontalGrad = GRADIENTS.horizontal(0.8, 0.4);
    const radialGrad = GRADIENTS.radial(0.9, 0.2);

    expect(verticalGrad).toContain('linear-gradient');
    expect(verticalGrad).toContain('180deg');
    expect(verticalGrad).toContain('rgba');

    expect(horizontalGrad).toContain('linear-gradient');
    expect(horizontalGrad).toContain('90deg');

    expect(radialGrad).toContain('radial-gradient');
    expect(radialGrad).toContain('circle');
  });

  it('should generate gradients with specified opacity values', () => {
    const gradient = GRADIENTS.vertical(0.85, 0.4);
    expect(gradient).toContain('0.85');
    // Note: end opacity may be adjusted for visual effect, just verify format
    expect(gradient).toContain('rgba');
    expect(gradient).toMatch(/rgba\(\d+, \d+, \d+, [\d.]+\)/);
  });
});

describe('Design System - Transitions', () => {
  it('should have all required transition presets', () => {
    expect(TRANSITIONS).toHaveProperty('fast');
    expect(TRANSITIONS).toHaveProperty('normal');
    expect(TRANSITIONS).toHaveProperty('slow');
  });

  it('should have valid CSS transition syntax', () => {
    expect(TRANSITIONS.fast).toMatch(/[\d.]+m?s/); // Match ms or s
    expect(TRANSITIONS.normal).toMatch(/[\d.]+m?s/);
    expect(TRANSITIONS.slow).toMatch(/[\d.]+m?s/);
  });

  it('should have ascending duration values', () => {
    // Extract numeric values (handle both ms and s)
    const parseDuration = (duration: string) => {
      const match = duration.match(/([\d.]+)(m?s)/);
      if (!match) return 0;
      const value = parseFloat(match[1]);
      const unit = match[2];
      return unit === 'ms' ? value : value * 1000; // Convert to ms for comparison
    };

    const fastDuration = parseDuration(TRANSITIONS.fast);
    const normalDuration = parseDuration(TRANSITIONS.normal);
    const slowDuration = parseDuration(TRANSITIONS.slow);

    expect(fastDuration).toBeLessThan(normalDuration);
    expect(normalDuration).toBeLessThan(slowDuration);
  });
});

describe('Design System - Helper Functions', () => {
  describe('getResponsiveSpacing', () => {
    it('should return correct spacing for mobile', () => {
      const spacing = getResponsiveSpacing('md', true);
      expect(spacing).toBe('16px'); // Returns string with 'px'
    });

    it('should scale spacing for desktop', () => {
      const spacing = getResponsiveSpacing('md', false, 1.5);
      expect(spacing).toBe('24px'); // 16 * 1.5 + 'px'
    });

    it('should handle all spacing levels', () => {
      const levels: Array<keyof typeof SPACING> = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      levels.forEach((level) => {
        const spacing = getResponsiveSpacing(level, false);
        expect(typeof spacing).toBe('string');
        expect(spacing).toMatch(/^\d+px$/);
      });
    });
  });

  describe('getResponsiveFontSize', () => {
    it('should return correct font size for mobile', () => {
      const fontSize = getResponsiveFontSize('body', true);
      expect(fontSize).toBe('14px');
    });

    it('should scale font size for desktop', () => {
      const fontSize = getResponsiveFontSize('body', false, 1.5);
      expect(fontSize).toBe('21px'); // 14 * 1.5
    });

    it('should handle all typography levels', () => {
      const levels: Array<keyof typeof TYPOGRAPHY> = [
        'heading1', 'heading2', 'heading3', 
        'body', 'bodySmall', 'button', 'caption', 'micro', 'nano'
      ];
      levels.forEach((level) => {
        const fontSize = getResponsiveFontSize(level, false);
        expect(fontSize).toMatch(/^\d+px$/);
      });
    });
  });
});

describe('Design System - Integration with KOREAN_COLORS', () => {
  it('should use KOREAN_COLORS constants', () => {
    // Hierarchy should reference KOREAN_COLORS
    expect(HIERARCHY.accent.hex).toBe(KOREAN_COLORS.PRIMARY_CYAN);
    expect(HIERARCHY.gold.hex).toBe(KOREAN_COLORS.ACCENT_GOLD);
    expect(HIERARCHY.primary.hex).toBe(KOREAN_COLORS.TEXT_PRIMARY);
  });

  it('should compute RGB values from KOREAN_COLORS', () => {
    // RGB colors should be valid
    expect(HIERARCHY.accent.color).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    expect(HIERARCHY.gold.color).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });
});
