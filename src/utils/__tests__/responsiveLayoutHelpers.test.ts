/**
 * Tests for Responsive Layout Helpers
 * 
 * Validates that centralized layout constants follow progressive scaling
 * and match the expected values for each screen size category.
 */

import { describe, it, expect } from 'vitest';
import {
  getLayoutConstants,
  getCombatLayoutConstants,
  getResponsivePadding,
  getResponsiveHeaderHeight,
  getResponsiveFooterHeight,
  getResponsiveSectionSpacing,
  getResponsiveButtonArea,
} from '../responsiveLayoutHelpers';

describe('responsiveLayoutHelpers', () => {
  describe('getLayoutConstants', () => {
    it('should return mobile layout for width < 768', () => {
      const layout = getLayoutConstants(375);
      
      expect(layout.padding).toBe(20);
      expect(layout.headerHeight).toBe(90);
      expect(layout.footerHeight).toBe(75);
      expect(layout.sectionSpacing).toBe(15);
      expect(layout.buttonArea).toBe(75);
    });

    it('should return tablet layout for width 768-1023', () => {
      const layout = getLayoutConstants(800);
      
      expect(layout.padding).toBe(25);
      expect(layout.headerHeight).toBe(100);
      expect(layout.footerHeight).toBe(85);
      expect(layout.sectionSpacing).toBe(18);
      expect(layout.buttonArea).toBe(85);
    });

    it('should return desktop layout for width 1024-1439', () => {
      const layout = getLayoutConstants(1200);
      
      expect(layout.padding).toBe(30);
      expect(layout.headerHeight).toBe(110);
      expect(layout.footerHeight).toBe(90);
      expect(layout.sectionSpacing).toBe(20);
      expect(layout.buttonArea).toBe(95);
    });

    it('should return large layout for width 1440-1919', () => {
      const layout = getLayoutConstants(1600);
      
      expect(layout.padding).toBe(32);
      expect(layout.headerHeight).toBe(115);
      expect(layout.footerHeight).toBe(95);
      expect(layout.sectionSpacing).toBe(22);
      expect(layout.buttonArea).toBe(102);
    });

    it('should return xlarge layout for width >= 1920 (4K)', () => {
      const layout = getLayoutConstants(3840);
      
      expect(layout.padding).toBe(35);
      expect(layout.headerHeight).toBe(120);
      expect(layout.footerHeight).toBe(100);
      expect(layout.sectionSpacing).toBe(25);
      expect(layout.buttonArea).toBe(110);
    });

    it('should follow progressive scaling: mobile < tablet < desktop < large < xlarge', () => {
      const mobile = getLayoutConstants(375);
      const tablet = getLayoutConstants(800);
      const desktop = getLayoutConstants(1200);
      const large = getLayoutConstants(1600);
      const xlarge = getLayoutConstants(3840);

      // Padding should increase progressively
      expect(mobile.padding).toBeLessThan(tablet.padding);
      expect(tablet.padding).toBeLessThan(desktop.padding);
      expect(desktop.padding).toBeLessThan(large.padding);
      expect(large.padding).toBeLessThan(xlarge.padding);

      // Header height should increase progressively
      expect(mobile.headerHeight).toBeLessThan(tablet.headerHeight);
      expect(tablet.headerHeight).toBeLessThan(desktop.headerHeight);
      expect(desktop.headerHeight).toBeLessThan(large.headerHeight);
      expect(large.headerHeight).toBeLessThan(xlarge.headerHeight);

      // Footer height should increase progressively
      expect(mobile.footerHeight).toBeLessThan(tablet.footerHeight);
      expect(tablet.footerHeight).toBeLessThan(desktop.footerHeight);
      expect(desktop.footerHeight).toBeLessThan(large.footerHeight);
      expect(large.footerHeight).toBeLessThan(xlarge.footerHeight);
    });
  });

  describe('getCombatLayoutConstants', () => {
    it('should return mobile combat layout for width < 768', () => {
      const layout = getCombatLayoutConstants(375);
      
      expect(layout.padding).toBe(10);
      expect(layout.hudHeight).toBe(95);
      expect(layout.controlsHeight).toBe(160);
      expect(layout.footerHeight).toBe(34);
      expect(layout.healthBarHeight).toBe(48);
    });

    it('should return xlarge combat layout for width >= 1920 (4K)', () => {
      const layout = getCombatLayoutConstants(3840);
      
      expect(layout.padding).toBe(10);
      expect(layout.hudHeight).toBe(140);
      expect(layout.controlsHeight).toBe(180);
      expect(layout.footerHeight).toBe(40);
      expect(layout.healthBarHeight).toBe(70);
    });

    it('should follow progressive scaling for HUD elements', () => {
      const mobile = getCombatLayoutConstants(375);
      const tablet = getCombatLayoutConstants(800);
      const desktop = getCombatLayoutConstants(1200);
      const large = getCombatLayoutConstants(1600);
      const xlarge = getCombatLayoutConstants(3840);

      // HUD height should increase (except tablet is optimized)
      expect(mobile.hudHeight).toBeLessThan(tablet.hudHeight);
      expect(tablet.hudHeight).toBeLessThan(desktop.hudHeight);
      expect(desktop.hudHeight).toBeLessThan(large.hudHeight);
      expect(large.hudHeight).toBeLessThan(xlarge.hudHeight);

      // Health bar height should increase progressively
      expect(mobile.healthBarHeight).toBeLessThan(tablet.healthBarHeight);
      expect(tablet.healthBarHeight).toBeLessThan(desktop.healthBarHeight);
      expect(desktop.healthBarHeight).toBeLessThan(large.healthBarHeight);
      expect(large.healthBarHeight).toBeLessThan(xlarge.healthBarHeight);
    });

    it('should ensure 4K displays get larger values than desktop', () => {
      const desktop = getCombatLayoutConstants(1200);
      const xlarge = getCombatLayoutConstants(3840);

      expect(xlarge.hudHeight).toBeGreaterThan(desktop.hudHeight);
      expect(xlarge.controlsHeight).toBeGreaterThan(desktop.controlsHeight);
      expect(xlarge.footerHeight).toBeGreaterThan(desktop.footerHeight);
      expect(xlarge.healthBarHeight).toBeGreaterThan(desktop.healthBarHeight);
    });
  });

  describe('Individual helper functions', () => {
    it('getResponsivePadding should return correct values', () => {
      expect(getResponsivePadding('mobile')).toBe(20);
      expect(getResponsivePadding('tablet')).toBe(25);
      expect(getResponsivePadding('desktop')).toBe(30);
      expect(getResponsivePadding('large')).toBe(32);
      expect(getResponsivePadding('xlarge')).toBe(35);
    });

    it('getResponsiveHeaderHeight should return correct values', () => {
      expect(getResponsiveHeaderHeight('mobile')).toBe(90);
      expect(getResponsiveHeaderHeight('tablet')).toBe(100);
      expect(getResponsiveHeaderHeight('desktop')).toBe(110);
      expect(getResponsiveHeaderHeight('large')).toBe(115);
      expect(getResponsiveHeaderHeight('xlarge')).toBe(120);
    });

    it('getResponsiveFooterHeight should return correct values', () => {
      expect(getResponsiveFooterHeight('mobile')).toBe(75);
      expect(getResponsiveFooterHeight('tablet')).toBe(85);
      expect(getResponsiveFooterHeight('desktop')).toBe(90);
      expect(getResponsiveFooterHeight('large')).toBe(95);
      expect(getResponsiveFooterHeight('xlarge')).toBe(100);
    });

    it('getResponsiveSectionSpacing should return correct values', () => {
      expect(getResponsiveSectionSpacing('mobile')).toBe(15);
      expect(getResponsiveSectionSpacing('tablet')).toBe(18);
      expect(getResponsiveSectionSpacing('desktop')).toBe(20);
      expect(getResponsiveSectionSpacing('large')).toBe(22);
      expect(getResponsiveSectionSpacing('xlarge')).toBe(25);
    });

    it('getResponsiveButtonArea should return correct values', () => {
      expect(getResponsiveButtonArea('mobile')).toBe(75);
      expect(getResponsiveButtonArea('tablet')).toBe(85);
      expect(getResponsiveButtonArea('desktop')).toBe(95);
      expect(getResponsiveButtonArea('large')).toBe(102);
      expect(getResponsiveButtonArea('xlarge')).toBe(110);
    });
  });

  describe('Edge cases and boundaries', () => {
    it('should handle exact breakpoint boundaries correctly', () => {
      // Just below mobile breakpoint
      const width767 = getLayoutConstants(767);
      expect(width767.padding).toBe(20); // mobile

      // Exactly at tablet breakpoint
      const width768 = getLayoutConstants(768);
      expect(width768.padding).toBe(25); // tablet

      // Just below desktop breakpoint
      const width1023 = getLayoutConstants(1023);
      expect(width1023.padding).toBe(25); // tablet

      // Exactly at desktop breakpoint
      const width1024 = getLayoutConstants(1024);
      expect(width1024.padding).toBe(30); // desktop

      // Exactly at 4K breakpoint
      const width1920 = getLayoutConstants(1920);
      expect(width1920.padding).toBe(35); // xlarge
    });

    it('should handle ultra-wide resolutions (5120x1440)', () => {
      const layout = getLayoutConstants(5120);
      
      // Should use xlarge category
      expect(layout.padding).toBe(35);
      expect(layout.headerHeight).toBe(120);
      expect(layout.footerHeight).toBe(100);
    });

    it('should handle 8K resolutions (7680x4320)', () => {
      const layout = getLayoutConstants(7680);
      
      // Should use xlarge category
      expect(layout.padding).toBe(35);
      expect(layout.headerHeight).toBe(120);
      expect(layout.footerHeight).toBe(100);
    });
  });

  describe('Consistency checks', () => {
    it('should ensure no property decreases from desktop to xlarge', () => {
      const desktop = getLayoutConstants(1200);
      const xlarge = getLayoutConstants(3840);

      expect(xlarge.padding).toBeGreaterThanOrEqual(desktop.padding);
      expect(xlarge.headerHeight).toBeGreaterThanOrEqual(desktop.headerHeight);
      expect(xlarge.footerHeight).toBeGreaterThanOrEqual(desktop.footerHeight);
      expect(xlarge.sectionSpacing).toBeGreaterThanOrEqual(desktop.sectionSpacing);
      expect(xlarge.buttonArea).toBeGreaterThanOrEqual(desktop.buttonArea);
    });

    it('should maintain reasonable proportions between values', () => {
      const layout = getLayoutConstants(3840);

      // Header should be taller than footer
      expect(layout.headerHeight).toBeGreaterThan(layout.footerHeight);

      // Button area should be larger than section spacing
      expect(layout.buttonArea).toBeGreaterThan(layout.sectionSpacing);

      // Padding should be less than header height
      expect(layout.padding).toBeLessThan(layout.headerHeight);
    });
  });
});
