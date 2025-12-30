/**
 * Tests for LayoutSystem
 *
 * Validates grid calculations, responsive positioning, and alignment helpers
 */

import { describe, expect, it } from "vitest";
import {
  LayoutSystem,
  alignHorizontal,
  alignVertical,
  calculateGridPosition,
  centerElement,
  defaultLayoutSystem,
} from "./LayoutSystem";
import { ScreenSize } from "../types/LayoutTypes";

describe("LayoutSystem", () => {
  describe("calculateGridPosition", () => {
    const layout = new LayoutSystem();

    it("should calculate position for first column", () => {
      const result = layout.calculateGridPosition(0, 1, 1200);
      expect(result.x).toBe(0);
      expect(result.width).toBe(80); // (1200/12) - 20 = 100 - 20 = 80
    });

    it("should calculate position for middle column", () => {
      const result = layout.calculateGridPosition(3, 6, 1200);
      expect(result.x).toBe(300); // 3 * 100 = 300
      expect(result.width).toBe(580); // 6 * 100 - 20 = 580
    });

    it("should calculate full-width position", () => {
      const result = layout.calculateGridPosition(0, 12, 1200);
      expect(result.x).toBe(0);
      expect(result.width).toBe(1180); // 12 * 100 - 20 = 1180
    });

    it("should respect custom gutter size", () => {
      const result = layout.calculateGridPosition(0, 1, 1200, 10);
      expect(result.width).toBe(90); // 100 - 10 = 90
    });
  });

  describe("calculateResponsivePosition", () => {
    const layout = new LayoutSystem();

    const mobileScreen: ScreenSize = {
      width: 375,
      height: 667,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLandscape: false,
    };

    const tabletScreen: ScreenSize = {
      width: 768,
      height: 1024,
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isLandscape: false,
    };

    const desktopScreen: ScreenSize = {
      width: 1920,
      height: 1080,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLandscape: true,
    };

    it("should use mobile position when provided", () => {
      const config = {
        base: { x: 100, y: 50 },
        mobile: { x: 10, y: 20 },
      };

      const result = layout.calculateResponsivePosition(config, mobileScreen);
      expect(result).toEqual({ x: 10, y: 20 });
    });

    it("should use tablet position when provided", () => {
      const config = {
        base: { x: 100, y: 50 },
        tablet: { x: 50, y: 30 },
      };

      const result = layout.calculateResponsivePosition(config, tabletScreen);
      expect(result).toEqual({ x: 50, y: 30 });
    });

    it("should use base position for desktop", () => {
      const config = {
        base: { x: 100, y: 50 },
      };

      const result = layout.calculateResponsivePosition(config, desktopScreen);
      expect(result).toEqual({ x: 100, y: 50 });
    });

    it("should scale proportionally when enabled", () => {
      const config = {
        base: { x: 100, y: 50 },
        scaleProportionally: true,
      };

      const result = layout.calculateResponsivePosition(config, mobileScreen);
      // 375 / 1200 = 0.3125
      expect(result.x).toBeCloseTo(31.25, 1);
      expect(result.y).toBeCloseTo(15.625, 1);
    });
  });

  describe("calculateSafePosition", () => {
    const layout = new LayoutSystem();

    it("should adjust top position for notch", () => {
      const result = layout.calculateSafePosition({ x: 0, y: 10 }, "top");
      expect(result).toEqual({ x: 0, y: 54 }); // 10 + 44
    });

    it("should adjust bottom position for home indicator", () => {
      const result = layout.calculateSafePosition({ x: 0, y: 100 }, "bottom");
      expect(result).toEqual({ x: 0, y: 66 }); // 100 - 34
    });

    it("should adjust left position", () => {
      const result = layout.calculateSafePosition({ x: 10, y: 0 }, "left");
      expect(result).toEqual({ x: 10, y: 0 }); // No left inset by default
    });

    it("should adjust right position", () => {
      const result = layout.calculateSafePosition({ x: 100, y: 0 }, "right");
      expect(result).toEqual({ x: 100, y: 0 }); // No right inset by default
    });
  });

  describe("alignHorizontal", () => {
    const layout = new LayoutSystem();

    it("should align left with margin", () => {
      const x = layout.alignHorizontal(200, 800, "left", 10);
      expect(x).toBe(10);
    });

    it("should center element", () => {
      const x = layout.alignHorizontal(200, 800, "center");
      expect(x).toBe(300); // (800 - 200) / 2
    });

    it("should align right with margin", () => {
      const x = layout.alignHorizontal(200, 800, "right", 10);
      expect(x).toBe(590); // 800 - 200 - 10
    });
  });

  describe("alignVertical", () => {
    const layout = new LayoutSystem();

    it("should align top with margin", () => {
      const y = layout.alignVertical(100, 600, "top", 10);
      expect(y).toBe(10);
    });

    it("should center element vertically", () => {
      const y = layout.alignVertical(100, 600, "middle");
      expect(y).toBe(250); // (600 - 100) / 2
    });

    it("should align bottom with margin", () => {
      const y = layout.alignVertical(100, 600, "bottom", 10);
      expect(y).toBe(490); // 600 - 100 - 10
    });
  });

  describe("getScreenSize", () => {
    const layout = new LayoutSystem();

    it("should identify mobile screen", () => {
      const result = layout.getScreenSize(375, 667);
      expect(result.isMobile).toBe(true);
      expect(result.isTablet).toBe(false);
      expect(result.isDesktop).toBe(false);
      expect(result.isLandscape).toBe(false);
    });

    it("should identify tablet screen", () => {
      const result = layout.getScreenSize(768, 1024);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(true);
      expect(result.isDesktop).toBe(false);
    });

    it("should identify desktop screen", () => {
      const result = layout.getScreenSize(1920, 1080);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isDesktop).toBe(true);
      expect(result.isLandscape).toBe(true);
    });
  });

  describe("calculateContainerBounds", () => {
    const layout = new LayoutSystem();

    it("should calculate desktop container bounds", () => {
      const result = layout.calculateContainerBounds(1200, 800, 120, 0, 10);

      expect(result.x).toBe(10);
      expect(result.y).toBe(130); // 120 + 10
      expect(result.width).toBe(1180); // 1200 - 20
      expect(result.height).toBe(660); // 800 - 130 - 10
      expect(result.scale).toBe(1.0);
    });

    it("should calculate mobile container bounds with safe area", () => {
      const result = layout.calculateContainerBounds(375, 667, 95, 160, 10);

      expect(result.x).toBe(10);
      expect(result.y).toBe(149); // 95 + 10 + 44 (safe area top)
      expect(result.width).toBe(355); // 375 - 20
      // Available height: 667 - 149 - 160 - 10 - 34 (safe area bottom)
      expect(result.height).toBe(314);
      expect(result.scale).toBeLessThan(1.0); // Mobile scale
    });
  });

  describe("helper functions", () => {
    it("should use default layout system for calculateGridPosition", () => {
      const result = calculateGridPosition(0, 1, 1200);
      expect(result.x).toBe(0);
      expect(result.width).toBe(80);
    });

    it("should use default layout system for alignHorizontal", () => {
      const x = alignHorizontal(200, 800, "center");
      expect(x).toBe(300);
    });

    it("should use default layout system for alignVertical", () => {
      const y = alignVertical(100, 600, "middle");
      expect(y).toBe(250);
    });

    it("should center element using helper", () => {
      const pos = centerElement(200, 100, 800, 600);
      expect(pos.x).toBe(300);
      expect(pos.y).toBe(250);
    });
  });

  describe("defaultLayoutSystem", () => {
    it("should be a singleton instance", () => {
      expect(defaultLayoutSystem).toBeInstanceOf(LayoutSystem);
    });

    it("should be usable for calculations", () => {
      const result = defaultLayoutSystem.calculateGridPosition(0, 1, 1200);
      expect(result.x).toBe(0);
      expect(result.width).toBe(80);
    });
  });
});
