/**
 * Tests for layoutUtils
 */

import { describe, expect, it } from "vitest";
import {
  calculateResponsiveFontSize,
  calculateResponsivePadding,
  calculateResponsiveSpacing,
  calculateResponsiveDimensions,
  getLayoutConstants,
  pxToRem,
  calculateCenteredPosition,
  calculateGridLayout,
} from "./layoutUtils";

describe("layoutUtils", () => {
  describe("calculateResponsiveFontSize", () => {
    it("should return base size for desktop", () => {
      const result = calculateResponsiveFontSize(16, false);
      expect(result).toBe(16);
    });

    it("should scale down for mobile", () => {
      const result = calculateResponsiveFontSize(16, true);
      expect(result).toBe(13); // 16 * 0.8 = 12.8, rounded to 13
    });
  });

  describe("calculateResponsivePadding", () => {
    it("should return base padding for desktop", () => {
      const result = calculateResponsivePadding(20, false);
      expect(result).toBe(20);
    });

    it("should scale down for mobile", () => {
      const result = calculateResponsivePadding(20, true);
      expect(result).toBe(14); // 20 * 0.7 = 14
    });
  });

  describe("calculateResponsiveSpacing", () => {
    it("should return base spacing for desktop", () => {
      const result = calculateResponsiveSpacing(16, false);
      expect(result).toBe(16);
    });

    it("should scale down for mobile", () => {
      const result = calculateResponsiveSpacing(16, true);
      expect(result).toBe(12); // 16 * 0.75 = 12
    });
  });

  describe("calculateResponsiveDimensions", () => {
    it("should return desktop dimensions", () => {
      const result = calculateResponsiveDimensions({ isMobile: false });
      
      expect(result.fontSize).toBe(16);
      expect(result.padding).toBe(12);
      expect(result.spacing).toBe(8);
      expect(result.borderWidth).toBe(2);
    });

    it("should return mobile dimensions", () => {
      const result = calculateResponsiveDimensions({ isMobile: true });
      
      expect(result.fontSize).toBe(13); // 16 * 0.8 = 12.8, rounded
      expect(result.padding).toBe(10); // 12.8 * 0.75 = 9.6, rounded
      expect(result.spacing).toBe(6); // 12.8 * 0.5 = 6.4, rounded
      expect(result.borderWidth).toBe(1);
    });

    it("should use custom base size", () => {
      const result = calculateResponsiveDimensions({ 
        isMobile: false, 
        baseSize: 20 
      });
      
      expect(result.fontSize).toBe(20);
      expect(result.padding).toBe(15); // 20 * 0.75
      expect(result.spacing).toBe(10); // 20 * 0.5
    });

    it("should use custom mobile scale", () => {
      const result = calculateResponsiveDimensions({ 
        isMobile: true, 
        baseSize: 16,
        mobileSizeScale: 0.9,
      });
      
      expect(result.fontSize).toBe(14); // 16 * 0.9 = 14.4, rounded
    });
  });

  describe("getLayoutConstants", () => {
    it("should return desktop layout constants", () => {
      const result = getLayoutConstants(false);
      
      expect(result.padding).toBe(20);
      expect(result.spacing).toBe(15);
      expect(result.headerHeight).toBe(60);
      expect(result.footerHeight).toBe(60);
      expect(result.buttonSize).toBe(60);
      expect(result.fontSize.small).toBe(14);
      expect(result.fontSize.medium).toBe(16);
      expect(result.fontSize.large).toBe(20);
      expect(result.fontSize.xlarge).toBe(32);
    });

    it("should return mobile layout constants", () => {
      const result = getLayoutConstants(true);
      
      expect(result.padding).toBe(10);
      expect(result.spacing).toBe(8);
      expect(result.headerHeight).toBe(50);
      expect(result.footerHeight).toBe(50);
      expect(result.buttonSize).toBe(40);
      expect(result.fontSize.small).toBe(12);
      expect(result.fontSize.medium).toBe(14);
      expect(result.fontSize.large).toBe(18);
      expect(result.fontSize.xlarge).toBe(24);
    });
  });

  describe("pxToRem", () => {
    it("should convert pixels to rem with default base", () => {
      const result = pxToRem(16);
      expect(result).toBe("1rem");
    });

    it("should convert pixels to rem with custom base", () => {
      const result = pxToRem(20, 10);
      expect(result).toBe("2rem");
    });

    it("should handle fractional values", () => {
      const result = pxToRem(24);
      expect(result).toBe("1.5rem");
    });
  });

  describe("calculateCenteredPosition", () => {
    it("should calculate centered position", () => {
      const result = calculateCenteredPosition(100, 50);
      expect(result).toBe(25);
    });

    it("should handle equal sizes", () => {
      const result = calculateCenteredPosition(100, 100);
      expect(result).toBe(0);
    });

    it("should handle larger element than container", () => {
      const result = calculateCenteredPosition(50, 100);
      expect(result).toBe(-25);
    });
  });

  describe("calculateGridLayout", () => {
    it("should calculate grid layout dimensions", () => {
      const result = calculateGridLayout(8, 4, 10);
      
      expect(result.rows).toBe(2);
      expect(result.columns).toBe(4);
      expect(result.gap).toBe(10);
      expect(result.totalGapWidth).toBe(30); // (4 - 1) * 10
      expect(result.totalGapHeight).toBe(10); // (2 - 1) * 10
    });

    it("should handle uneven distribution", () => {
      const result = calculateGridLayout(7, 3, 5);
      
      expect(result.rows).toBe(3); // ceil(7 / 3)
      expect(result.columns).toBe(3);
      expect(result.totalGapWidth).toBe(10); // (3 - 1) * 5
      expect(result.totalGapHeight).toBe(10); // (3 - 1) * 5
    });

    it("should handle single row", () => {
      const result = calculateGridLayout(4, 10, 8);
      
      expect(result.rows).toBe(1);
      expect(result.columns).toBe(10);
      expect(result.totalGapWidth).toBe(72); // (10 - 1) * 8
      expect(result.totalGapHeight).toBe(0); // (1 - 1) * 8
    });
  });
});
