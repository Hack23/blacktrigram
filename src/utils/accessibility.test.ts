/**
 * Accessibility tests for WCAG 2.1 Level AA compliance
 * Tests keyboard navigation, color contrast, and ARIA attributes
 */

import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  meetsContrastRequirement,
  handleKeyboardNav,
  createAriaAttributes,
  getAccessibleForeground,
} from './accessibility';
import { createBilingualLabel } from '../types/AccessibilityTypes';
import { KOREAN_COLORS } from '../types/constants';

describe('Accessibility Utilities', () => {
  describe('Color Contrast (WCAG 2.1)', () => {
    it('should calculate correct contrast ratio for white on dark background', () => {
      const ratio = getContrastRatio(
        KOREAN_COLORS.TEXT_PRIMARY,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5); // WCAG AA for normal text
    });

    it('should calculate correct contrast ratio for primary cyan on dark background', () => {
      const ratio = getContrastRatio(
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      expect(ratio).toBeGreaterThanOrEqual(3); // WCAG AA for large text/UI
    });

    it('should verify accent gold meets WCAG AA on dark background', () => {
      const meets = meetsContrastRequirement({
        foreground: KOREAN_COLORS.ACCENT_GOLD,
        background: KOREAN_COLORS.UI_BACKGROUND_DARK,
        targetRatio: 3, // For UI components
      });
      expect(meets).toBe(true);
    });

    it('should get accessible foreground color for dark background', () => {
      const foreground = getAccessibleForeground(KOREAN_COLORS.UI_BACKGROUND_DARK);
      expect(foreground).toBe(KOREAN_COLORS.TEXT_PRIMARY); // Should be white
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter key activation', () => {
      let activated = false;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      
      handleKeyboardNav(event, {
        onActivate: () => { activated = true; },
      });

      expect(activated).toBe(true);
    });

    it('should handle Space key activation', () => {
      let activated = false;
      const event = new KeyboardEvent('keydown', { key: ' ' });
      
      handleKeyboardNav(event, {
        onActivate: () => { activated = true; },
      });

      expect(activated).toBe(true);
    });

    it('should handle Escape key cancellation', () => {
      let cancelled = false;
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      
      handleKeyboardNav(event, {
        onCancel: () => { cancelled = true; },
      });

      expect(cancelled).toBe(true);
    });

    it('should handle arrow key navigation', () => {
      let direction: string | undefined;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      
      handleKeyboardNav(event, {
        onNavigate: (dir) => { direction = dir; },
      });

      expect(direction).toBe('up');
    });
  });

  describe('Bilingual Labels', () => {
    it('should create Korean | English bilingual label', () => {
      const label = createBilingualLabel('공격', 'Attack');
      expect(label.korean).toBe('공격');
      expect(label.english).toBe('Attack');
      expect(label.label).toBe('공격 | Attack');
    });
  });

  describe('ARIA Attributes', () => {
    it('should create complete ARIA attributes for button', () => {
      const attrs = createAriaAttributes(
        createBilingualLabel('공격', 'Attack'),
        'button',
        { 'aria-pressed': true }
      );

      expect(attrs.role).toBe('button');
      expect(attrs['aria-label']).toBe('공격 | Attack');
      expect(attrs['aria-pressed']).toBe(true);
    });
  });
});

describe('WCAG 2.1 Level AA Color Compliance', () => {
  describe('Primary Colors', () => {
    it('PRIMARY_CYAN should meet 3:1 contrast on dark backgrounds', () => {
      const ratio = getContrastRatio(
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      expect(ratio).toBeGreaterThanOrEqual(3);
    });

    it('ACCENT_GOLD should meet 3:1 contrast on dark backgrounds', () => {
      const ratio = getContrastRatio(
        KOREAN_COLORS.ACCENT_GOLD,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Text Colors', () => {
    it('TEXT_PRIMARY should meet 4.5:1 contrast on dark backgrounds', () => {
      const ratio = getContrastRatio(
        KOREAN_COLORS.TEXT_PRIMARY,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('TEXT_SECONDARY should meet 3:1 contrast on dark backgrounds', () => {
      const ratio = getContrastRatio(
        KOREAN_COLORS.TEXT_SECONDARY,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  });
});
