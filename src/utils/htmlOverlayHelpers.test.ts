/**
 * Unit tests for Html Overlay Helpers
 * 
 * Tests positioning, bounds checking, z-index management,
 * and text measurement for Three.js Html overlays.
 * 
 * @module utils/htmlOverlayHelpers.test
 */

import { describe, it, expect } from "vitest";
import {
  getZIndexForLayer,
  calculateSafePosition,
  measureTextBounds,
  applyHtmlOverlayStyles,
  createHtmlOverlayConfig,
  getDefaultSafeArea,
  calculateDistanceFactor,
} from "./htmlOverlayHelpers";
import { Z_INDEX } from "../types/LayoutTypes";
import { FONT_FAMILY } from "../types/constants";

describe("htmlOverlayHelpers", () => {
  describe("getZIndexForLayer", () => {
    it("should return correct z-index for each layer", () => {
      expect(getZIndexForLayer("background")).toBe(Z_INDEX.BACKGROUND);
      expect(getZIndexForLayer("arena")).toBe(Z_INDEX.ARENA);
      expect(getZIndexForLayer("players")).toBe(Z_INDEX.PLAYERS);
      expect(getZIndexForLayer("effects")).toBe(Z_INDEX.EFFECTS);
      expect(getZIndexForLayer("hud")).toBe(Z_INDEX.HUD);
      expect(getZIndexForLayer("mobile-controls")).toBe(Z_INDEX.MOBILE_CONTROLS);
      expect(getZIndexForLayer("modal")).toBe(Z_INDEX.MODAL);
      expect(getZIndexForLayer("tooltip")).toBe(Z_INDEX.TOOLTIP);
      expect(getZIndexForLayer("debug")).toBe(Z_INDEX.DEBUG);
    });

    it("should apply z-index offset correctly", () => {
      const baseZIndex = getZIndexForLayer("hud");
      const offsetZIndex = getZIndexForLayer("hud", 5);
      expect(offsetZIndex).toBe(baseZIndex + 5);
    });

    it("should maintain proper layer hierarchy", () => {
      const background = getZIndexForLayer("background");
      const arena = getZIndexForLayer("arena");
      const hud = getZIndexForLayer("hud");
      const modal = getZIndexForLayer("modal");

      expect(background).toBeLessThan(arena);
      expect(arena).toBeLessThan(hud);
      expect(hud).toBeLessThan(modal);
    });
  });

  describe("calculateSafePosition", () => {
    const screenBounds = {
      width: 1920,
      height: 1080,
    };

    it("should not clamp position within screen bounds", () => {
      const position: [number, number, number] = [100, 100, 0];
      const elementBounds = { width: 200, height: 100 };

      const result = calculateSafePosition(position, elementBounds, screenBounds);

      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
      expect(result.wasClamped).toBe(false);
    });

    it("should clamp position at right edge", () => {
      const position: [number, number, number] = [1800, 100, 0];
      const elementBounds = { width: 200, height: 100 };

      const result = calculateSafePosition(position, elementBounds, screenBounds);

      expect(result.x).toBeLessThan(1800);
      expect(result.y).toBe(100);
      expect(result.wasClamped).toBe(true);
    });

    it("should clamp position at bottom edge", () => {
      const position: [number, number, number] = [100, 1000, 0];
      const elementBounds = { width: 200, height: 100 };

      const result = calculateSafePosition(position, elementBounds, screenBounds);

      expect(result.x).toBe(100);
      expect(result.y).toBeLessThan(1000);
      expect(result.wasClamped).toBe(true);
    });

    it("should respect element margins", () => {
      const position: [number, number, number] = [5, 5, 0];
      const elementBounds = { width: 200, height: 100, margin: 10 };

      const result = calculateSafePosition(position, elementBounds, screenBounds);

      expect(result.x).toBeGreaterThanOrEqual(10); // margin applied
      expect(result.y).toBeGreaterThanOrEqual(10);
      expect(result.wasClamped).toBe(true);
    });

    it("should respect safe area insets", () => {
      const position: [number, number, number] = [5, 5, 0];
      const elementBounds = { width: 200, height: 100 };
      const boundsWithSafeArea = {
        ...screenBounds,
        safeArea: { top: 44, right: 0, bottom: 34, left: 0 },
      };

      const result = calculateSafePosition(position, elementBounds, boundsWithSafeArea);

      expect(result.y).toBeGreaterThanOrEqual(44); // top safe area
      expect(result.wasClamped).toBe(true);
    });

    it("should clamp to left edge", () => {
      const position: [number, number, number] = [-50, 100, 0];
      const elementBounds = { width: 200, height: 100 };

      const result = calculateSafePosition(position, elementBounds, screenBounds);

      expect(result.x).toBeGreaterThanOrEqual(0);
      expect(result.wasClamped).toBe(true);
    });

    it("should clamp to top edge", () => {
      const position: [number, number, number] = [100, -50, 0];
      const elementBounds = { width: 200, height: 100 };

      const result = calculateSafePosition(position, elementBounds, screenBounds);

      expect(result.y).toBeGreaterThanOrEqual(0);
      expect(result.wasClamped).toBe(true);
    });
  });

  describe("measureTextBounds", () => {
    it("should measure vertical layout text bounds", () => {
      const result = measureTextBounds("공격", "Attack", 16, FONT_FAMILY.KOREAN, "vertical");

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.koreanWidth).toBeGreaterThan(0);
      expect(result.englishWidth).toBeGreaterThan(0);
      // Note: In test environment without canvas, fallback is used
      // so we just check that measurements are reasonable
      expect(result.height).toBeGreaterThan(16); // At least one line height
    });

    it("should measure horizontal layout text bounds", () => {
      const result = measureTextBounds("공격", "Attack", 16, FONT_FAMILY.KOREAN, "horizontal");

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.width).toBeGreaterThan(result.height); // Horizontal should be wider
    });

    it("should handle longer text correctly", () => {
      const short = measureTextBounds("공격", "Attack", 16);
      const long = measureTextBounds("연속공격기술", "Continuous Attack Technique", 16);

      expect(long.width).toBeGreaterThan(short.width);
    });

    it("should scale with font size", () => {
      const small = measureTextBounds("공격", "Attack", 12);
      const large = measureTextBounds("공격", "Attack", 24);

      expect(large.width).toBeGreaterThan(small.width);
      expect(large.height).toBeGreaterThan(small.height);
    });

    it("should return fallback measurements if canvas unavailable", () => {
      // This tests the fallback path when canvas is not available
      const result = measureTextBounds("공격", "Attack", 16);
      
      // Should still return valid measurements
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });
  });

  describe("applyHtmlOverlayStyles", () => {
    it("should create non-interactive overlay style", () => {
      const style = applyHtmlOverlayStyles("hud", false);

      expect(style.zIndex).toBe(Z_INDEX.HUD);
      expect(style.pointerEvents).toBe("none");
      expect(style.center).toBe(true);
      expect(style.distanceFactor).toBe(10);
    });

    it("should create interactive overlay style", () => {
      const style = applyHtmlOverlayStyles("modal", true);

      expect(style.zIndex).toBe(Z_INDEX.MODAL);
      expect(style.pointerEvents).toBe("all");
    });

    it("should apply custom distance factor", () => {
      const style = applyHtmlOverlayStyles("hud", false, 15);

      expect(style.distanceFactor).toBe(15);
    });

    it("should apply z-index offset", () => {
      const style = applyHtmlOverlayStyles("hud", false, 10, true, false, 5);

      expect(style.zIndex).toBe(Z_INDEX.HUD + 5);
    });

    it("should enable occlusion when specified", () => {
      const style = applyHtmlOverlayStyles("players", false, 10, true, true);

      expect(style.occlude).toBe(true);
    });

    it("should include GPU acceleration transform", () => {
      const style = applyHtmlOverlayStyles("hud", false);

      expect(style.transform).toBe("translateZ(0)");
    });
  });

  describe("createHtmlOverlayConfig", () => {
    it("should create complete overlay configuration", () => {
      const config = createHtmlOverlayConfig({
        position: [0, 2, 0],
        layer: "hud",
        screenBounds: { width: 1920, height: 1080 },
        elementBounds: { width: 200, height: 100 },
      });

      expect(config.position).toBeDefined();
      expect(config.style).toBeDefined();
      expect(config.position3D).toEqual([0, 2, 0]);
      expect(config.style.zIndex).toBe(Z_INDEX.HUD);
    });

    it("should apply safe position calculation", () => {
      const config = createHtmlOverlayConfig({
        position: [1800, 1000, 0],
        layer: "hud",
        screenBounds: { width: 1920, height: 1080 },
        elementBounds: { width: 200, height: 100 },
      });

      expect(config.position.wasClamped).toBe(true);
      expect(config.position.x).toBeLessThan(1800);
      expect(config.position.y).toBeLessThan(1000);
    });

    it("should use larger distance factor for mobile", () => {
      const desktop = createHtmlOverlayConfig({
        position: [0, 0, 0],
        layer: "hud",
        isMobile: false,
      });

      const mobile = createHtmlOverlayConfig({
        position: [0, 0, 0],
        layer: "hud",
        isMobile: true,
      });

      expect(mobile.style.distanceFactor).toBeGreaterThan(desktop.style.distanceFactor ?? 0);
    });

    it("should work without bounds checking", () => {
      const config = createHtmlOverlayConfig({
        position: [100, 200, 0],
        layer: "tooltip",
      });

      expect(config.position.x).toBe(100);
      expect(config.position.y).toBe(200);
      expect(config.position.wasClamped).toBe(false);
    });

    it("should apply z-index offset", () => {
      const config = createHtmlOverlayConfig({
        position: [0, 0, 0],
        layer: "hud",
        zIndexOffset: 10,
      });

      expect(config.style.zIndex).toBe(Z_INDEX.HUD + 10);
    });
  });

  describe("getDefaultSafeArea", () => {
    it("should return zero safe area for desktop", () => {
      const safeArea = getDefaultSafeArea(false);

      expect(safeArea.top).toBe(0);
      expect(safeArea.right).toBe(0);
      expect(safeArea.bottom).toBe(0);
      expect(safeArea.left).toBe(0);
    });

    it("should return standard safe area for mobile", () => {
      const safeArea = getDefaultSafeArea(true);

      expect(safeArea.top).toBeGreaterThan(0); // Status bar + notch
      expect(safeArea.bottom).toBeGreaterThan(0); // Home indicator
    });

    it("should use standard iOS safe area values", () => {
      const safeArea = getDefaultSafeArea(true);

      expect(safeArea.top).toBe(44);
      expect(safeArea.bottom).toBe(34);
    });
  });

  describe("calculateDistanceFactor", () => {
    it("should return different factors for different overlay types", () => {
      const textFactor = calculateDistanceFactor(1920, "text", false);
      const buttonFactor = calculateDistanceFactor(1920, "button", false);
      const panelFactor = calculateDistanceFactor(1920, "panel", false);

      expect(textFactor).toBeLessThan(buttonFactor);
      expect(buttonFactor).toBeLessThan(panelFactor);
    });

    it("should increase factor for mobile", () => {
      const desktop = calculateDistanceFactor(1920, "text", false);
      const mobile = calculateDistanceFactor(1920, "text", true);

      expect(mobile).toBeGreaterThan(desktop);
    });

    it("should adjust for smaller screens", () => {
      const large = calculateDistanceFactor(1920, "text", false);
      const small = calculateDistanceFactor(1024, "text", false);

      expect(small).toBeGreaterThan(large);
    });

    it("should return consistent values for same inputs", () => {
      const factor1 = calculateDistanceFactor(1920, "button", false);
      const factor2 = calculateDistanceFactor(1920, "button", false);

      expect(factor1).toBe(factor2);
    });
  });
});
