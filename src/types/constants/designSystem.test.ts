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
  TYPOGRAPHY_NUMERIC,
  SPACING,
  SPACING_NUMERIC,
  SPACING_ADJUSTMENTS,
  BORDER_RADIUS,
  HIERARCHY,
  BORDERS,
  GRADIENTS,
  TRANSITIONS,
  OPACITY,
  COMBAT_UI_DIMENSIONS,
  COMBAT_UI_DIMENSIONS_NUMERIC,
  TEXT_EFFECTS,
  FONT_SIZE_MULTIPLIERS,
  LAYOUT_MULTIPLIERS,
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
    expect(SPACING_ADJUSTMENTS).toHaveProperty('horizontalEmphasis');
    expect(SPACING_ADJUSTMENTS).toHaveProperty('micro');
    expect(SPACING_ADJUSTMENTS).toHaveProperty('tiny');

    expect(SPACING_ADJUSTMENTS.xsPlus).toBe('10px');
    expect(SPACING_ADJUSTMENTS.smPlus).toBe('14px');
    expect(SPACING_ADJUSTMENTS.mdPlus).toBe('18px');
    expect(SPACING_ADJUSTMENTS.compact).toBe('6px');
    expect(SPACING_ADJUSTMENTS.horizontalEmphasis).toBe('24px');
    expect(SPACING_ADJUSTMENTS.micro).toBe('3px');
    expect(SPACING_ADJUSTMENTS.tiny).toBe('2px');
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
    const verticalGrad = GRADIENTS.vertical(0.9);
    const horizontalGrad = GRADIENTS.horizontal(0.8);
    const radialGrad = GRADIENTS.radial(0.9);

    expect(verticalGrad).toContain('linear-gradient');
    expect(verticalGrad).toContain('180deg');
    expect(verticalGrad).toContain('rgba');

    expect(horizontalGrad).toContain('linear-gradient');
    expect(horizontalGrad).toContain('90deg');

    expect(radialGrad).toContain('radial-gradient');
    expect(radialGrad).toContain('circle');
  });

  it('should generate gradients with specified opacity values', () => {
    const gradient = GRADIENTS.vertical(0.85);
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

describe('Design System - Font Size Multipliers', () => {
  it('should have all required multipliers', () => {
    expect(FONT_SIZE_MULTIPLIERS).toHaveProperty('titleSmall');
    expect(FONT_SIZE_MULTIPLIERS).toHaveProperty('messageSmall');
    expect(FONT_SIZE_MULTIPLIERS).toHaveProperty('bodySmall');
    expect(FONT_SIZE_MULTIPLIERS).toHaveProperty('titleLarge');
  });

  it('should have correct multiplier values', () => {
    expect(FONT_SIZE_MULTIPLIERS.titleSmall).toBe(0.6);
    expect(FONT_SIZE_MULTIPLIERS.messageSmall).toBe(0.75);
    expect(FONT_SIZE_MULTIPLIERS.bodySmall).toBe(0.875);
    expect(FONT_SIZE_MULTIPLIERS.titleLarge).toBe(1.125);
  });
});

describe('Design System - Layout Multipliers', () => {
  it('should have gap to padding ratio', () => {
    expect(LAYOUT_MULTIPLIERS).toHaveProperty('gapToPadding');
    expect(LAYOUT_MULTIPLIERS.gapToPadding).toBe(1.2);
  });
});

describe('Design System - Combat UI Dimensions (Extended)', () => {
  it('should have technique bar width constants', () => {
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('techniqueBarWidthMobile');
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('techniqueBarWidthDesktop');
    
    expect(COMBAT_UI_DIMENSIONS.techniqueBarWidthMobile).toBe('100%');
    expect(COMBAT_UI_DIMENSIONS.techniqueBarWidthDesktop).toBe('70%');
  });

  it('should have combat log max width percentage', () => {
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('combatLogMaxWidthPercentMobile');
    expect(COMBAT_UI_DIMENSIONS.combatLogMaxWidthPercentMobile).toBe(0.9);
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

describe('Design System - OPACITY Constants', () => {
  it('should have all opacity values', () => {
    expect(OPACITY).toHaveProperty('base');
    expect(OPACITY).toHaveProperty('increment');
    expect(OPACITY).toHaveProperty('light');
    expect(OPACITY).toHaveProperty('medium');
    expect(OPACITY).toHaveProperty('heavy');
  });

  it('should have correct numeric values', () => {
    expect(OPACITY.base).toBe(0.7);
    expect(OPACITY.increment).toBe(0.1);
    expect(OPACITY.light).toBe(0.3);
    expect(OPACITY.medium).toBe(0.5);
    expect(OPACITY.heavy).toBe(0.8);
  });
});

describe('Design System - COMBAT_UI_DIMENSIONS', () => {
  it('should have combat log dimensions', () => {
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('combatLogMinMobile');
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('combatLogMinDesktop');
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('combatLogMaxMobile');
    expect(COMBAT_UI_DIMENSIONS).toHaveProperty('combatLogMaxDesktop');
  });

  it('should have correct dimension values', () => {
    expect(COMBAT_UI_DIMENSIONS.combatLogMinMobile).toBe('200px');
    expect(COMBAT_UI_DIMENSIONS.combatLogMinDesktop).toBe('280px');
    expect(COMBAT_UI_DIMENSIONS.combatLogMaxMobile).toBe('90%');
    expect(COMBAT_UI_DIMENSIONS.combatLogMaxDesktop).toBe('500px');
  });
});

describe('Design System - TEXT_EFFECTS', () => {
  it('should have text shadow effects', () => {
    expect(TEXT_EFFECTS).toHaveProperty('darkShadow');
    expect(TEXT_EFFECTS).toHaveProperty('lightGlow');
  });

  it('should have valid shadow syntax', () => {
    expect(TEXT_EFFECTS.darkShadow).toContain('rgba');
    expect(TEXT_EFFECTS.lightGlow).toContain('rgba');
  });
});

describe('Design System - TYPOGRAPHY_NUMERIC', () => {
  it('should have numeric values matching string TYPOGRAPHY', () => {
    expect(TYPOGRAPHY_NUMERIC.heading1).toBe(24);
    expect(TYPOGRAPHY_NUMERIC.heading2).toBe(20);
    expect(TYPOGRAPHY_NUMERIC.heading3).toBe(16);
    expect(TYPOGRAPHY_NUMERIC.body).toBe(14);
    expect(TYPOGRAPHY_NUMERIC.bodySmall).toBe(12);
    expect(TYPOGRAPHY_NUMERIC.button).toBe(14);
    expect(TYPOGRAPHY_NUMERIC.caption).toBe(10);
    expect(TYPOGRAPHY_NUMERIC.micro).toBe(9);
    expect(TYPOGRAPHY_NUMERIC.nano).toBe(8);
  });

  it('should match parsed string values from TYPOGRAPHY', () => {
    expect(TYPOGRAPHY_NUMERIC.heading1).toBe(parseInt(TYPOGRAPHY.heading1.fontSize, 10));
    expect(TYPOGRAPHY_NUMERIC.body).toBe(parseInt(TYPOGRAPHY.body.fontSize, 10));
    expect(TYPOGRAPHY_NUMERIC.caption).toBe(parseInt(TYPOGRAPHY.caption.fontSize, 10));
    expect(TYPOGRAPHY_NUMERIC.nano).toBe(parseInt(TYPOGRAPHY.nano.fontSize, 10));
  });
});

describe('Design System - SPACING_NUMERIC', () => {
  it('should have numeric values matching string SPACING', () => {
    expect(SPACING_NUMERIC.xxs).toBe(4);
    expect(SPACING_NUMERIC.xs).toBe(8);
    expect(SPACING_NUMERIC.sm).toBe(12);
    expect(SPACING_NUMERIC.md).toBe(16);
    expect(SPACING_NUMERIC.lg).toBe(24);
    expect(SPACING_NUMERIC.xl).toBe(32);
    expect(SPACING_NUMERIC.xxl).toBe(48);
  });

  it('should have numeric values matching SPACING_ADJUSTMENTS', () => {
    expect(SPACING_NUMERIC.xsPlus).toBe(10);
    expect(SPACING_NUMERIC.smPlus).toBe(14);
    expect(SPACING_NUMERIC.mdPlus).toBe(18);
    expect(SPACING_NUMERIC.compact).toBe(6);
    expect(SPACING_NUMERIC.horizontalEmphasis).toBe(24);
    expect(SPACING_NUMERIC.micro).toBe(3);
    expect(SPACING_NUMERIC.tiny).toBe(2);
  });

  it('should match parsed string values from SPACING', () => {
    expect(SPACING_NUMERIC.xs).toBe(parseInt(SPACING.xs, 10));
    expect(SPACING_NUMERIC.md).toBe(parseInt(SPACING.md, 10));
    expect(SPACING_NUMERIC.lg).toBe(parseInt(SPACING.lg, 10));
  });

  it('should match parsed string values from SPACING_ADJUSTMENTS', () => {
    expect(SPACING_NUMERIC.xsPlus).toBe(parseInt(SPACING_ADJUSTMENTS.xsPlus, 10));
    expect(SPACING_NUMERIC.compact).toBe(parseInt(SPACING_ADJUSTMENTS.compact, 10));
    expect(SPACING_NUMERIC.micro).toBe(parseInt(SPACING_ADJUSTMENTS.micro, 10));
  });
});

describe('Design System - COMBAT_UI_DIMENSIONS_NUMERIC', () => {
  it('should have numeric values matching string COMBAT_UI_DIMENSIONS', () => {
    expect(COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMinMobile).toBe(200);
    expect(COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMinDesktop).toBe(280);
    expect(COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMaxDesktop).toBe(500);
  });

  it('should match parsed string values from COMBAT_UI_DIMENSIONS', () => {
    expect(COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMinMobile).toBe(parseInt(COMBAT_UI_DIMENSIONS.combatLogMinMobile, 10));
    expect(COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMinDesktop).toBe(parseInt(COMBAT_UI_DIMENSIONS.combatLogMinDesktop, 10));
    expect(COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMaxDesktop).toBe(parseInt(COMBAT_UI_DIMENSIONS.combatLogMaxDesktop, 10));
  });
});
