/**
 * @fileoverview Tests for clothing color utility functions
 * @module utils/clothingColors.test
 */

import { describe, it, expect } from "vitest";
import {
  adjustBrightness,
  adjustSaturation,
  shiftHue,
  blendColorsThree,
  createColorVariation,
  generateTeamColors,
  applyDamageColor,
  isLightColor,
  getContrastingColor,
  createArchetypePalette,
} from "./clothingColors";

describe("clothingColors utilities", () => {
  describe("adjustBrightness", () => {
    it("should increase brightness of a color", () => {
      const baseColor = 0x808080; // Gray
      const result = adjustBrightness(baseColor, 1.5);

      // Result should be brighter
      expect(result).toBeGreaterThan(baseColor);
    });

    it("should decrease brightness of a color", () => {
      const baseColor = 0x808080; // Gray
      const result = adjustBrightness(baseColor, 0.5);

      // Result should be darker
      expect(result).toBeLessThan(baseColor);
    });

    it("should handle factor of 1 (no change)", () => {
      const baseColor = 0xff8800;
      const result = adjustBrightness(baseColor, 1.0);

      expect(result).toBe(baseColor);
    });

    it("should return valid hex color", () => {
      const result = adjustBrightness(0x00ff00, 1.3);

      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });
  });

  describe("adjustSaturation", () => {
    it("should adjust saturation of a color", () => {
      const baseColor = 0x808080; // Gray (low saturation)
      const result = adjustSaturation(baseColor, 1.5);

      expect(result).toBeTypeOf("number");
      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle saturation factor of 1 (no change)", () => {
      const baseColor = 0xff8800;
      const result = adjustSaturation(baseColor, 1.0);

      expect(result).toBe(baseColor);
    });

    it("should return valid hex color", () => {
      const result = adjustSaturation(0xff0000, 0.5);

      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });
  });

  describe("shiftHue", () => {
    it("should shift hue by positive amount", () => {
      const baseColor = 0xff0000; // Red
      const result = shiftHue(baseColor, 0.5);

      expect(result).not.toBe(baseColor);
      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle hue wrap around", () => {
      const baseColor = 0xff0000; // Red
      const result = shiftHue(baseColor, 1.2);

      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle negative hue shift", () => {
      const baseColor = 0xff0000; // Red
      const result = shiftHue(baseColor, -0.25);

      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle zero shift (no change)", () => {
      const baseColor = 0x00ff00;
      const result = shiftHue(baseColor, 0);

      expect(result).toBe(baseColor);
    });
  });

  describe("blendColorsThree", () => {
    it("should blend two colors", () => {
      const color1 = 0x000000; // Black
      const color2 = 0xffffff; // White
      const result = blendColorsThree(color1, color2, 0.5);

      // Result should be between black and white
      expect(result).toBeGreaterThan(color1);
      expect(result).toBeLessThan(color2);
    });

    it("should return first color at t=0", () => {
      const color1 = 0xff0000;
      const color2 = 0x00ff00;
      const result = blendColorsThree(color1, color2, 0);

      expect(result).toBe(color1);
    });

    it("should return second color at t=1", () => {
      const color1 = 0xff0000;
      const color2 = 0x00ff00;
      const result = blendColorsThree(color1, color2, 1);

      expect(result).toBe(color2);
    });

    it("should return valid hex color", () => {
      const result = blendColorsThree(0xff0000, 0x0000ff, 0.3);

      expect(result).toBeGreaterThanOrEqual(0x000000);
      expect(result).toBeLessThanOrEqual(0xffffff);
    });
  });

  describe("createColorVariation", () => {
    it("should create lighter variation", () => {
      const baseColor = 0x808080;
      const result = createColorVariation(baseColor, "lighter");

      expect(result).toBeGreaterThan(baseColor);
    });

    it("should create darker variation", () => {
      const baseColor = 0x808080;
      const result = createColorVariation(baseColor, "darker");

      expect(result).toBeLessThan(baseColor);
    });

    it("should create saturated variation", () => {
      const baseColor = 0x808080;
      const result = createColorVariation(baseColor, "saturated");

      expect(result).toBeTypeOf("number");
      expect(result).toBeGreaterThanOrEqual(0x000000);
    });

    it("should create desaturated variation", () => {
      const baseColor = 0xff0000;
      const result = createColorVariation(baseColor, "desaturated");

      expect(result).toBeTypeOf("number");
      expect(result).toBeGreaterThanOrEqual(0x000000);
    });

    it("should create complementary variation", () => {
      const baseColor = 0xff0000;
      const result = createColorVariation(baseColor, "complementary");

      expect(result).not.toBe(baseColor);
      expect(result).toBeGreaterThanOrEqual(0x000000);
    });
  });

  describe("generateTeamColors", () => {
    it("should generate team color set", () => {
      const baseColor = 0xff0000;
      const teamColors = generateTeamColors(baseColor);

      expect(teamColors).toHaveProperty("primary");
      expect(teamColors).toHaveProperty("light");
      expect(teamColors).toHaveProperty("dark");
      expect(teamColors).toHaveProperty("accent");
    });

    it("should have primary color equal to base", () => {
      const baseColor = 0x0088ff;
      const teamColors = generateTeamColors(baseColor);

      expect(teamColors.primary).toBe(baseColor);
    });

    it("should create distinct light and dark variants", () => {
      const baseColor = 0x808080; // Use gray instead of pure green
      const teamColors = generateTeamColors(baseColor);

      expect(teamColors.light).toBeGreaterThan(baseColor);
      expect(teamColors.dark).toBeLessThan(baseColor);
    });
  });

  describe("applyDamageColor", () => {
    it("should darken color with damage", () => {
      const baseColor = 0x808080; // Gray
      const result = applyDamageColor(baseColor, 0.5);

      // Damage should make color darker
      expect(result).toBeLessThan(baseColor);
    });

    it("should handle full damage intensity", () => {
      const baseColor = 0x808080; // Gray
      const result = applyDamageColor(baseColor, 1.0);

      // Full damage should darken significantly
      expect(result).toBeLessThan(baseColor);
      expect(result).toBeGreaterThanOrEqual(0x000000);
    });

    it("should handle zero damage (no change)", () => {
      const baseColor = 0x8080ff;
      const result = applyDamageColor(baseColor, 0);

      expect(result).toBe(baseColor);
    });
  });

  describe("isLightColor", () => {
    it("should identify white as light color", () => {
      expect(isLightColor(0xffffff)).toBe(true);
    });

    it("should identify black as dark color", () => {
      expect(isLightColor(0x000000)).toBe(false);
    });

    it("should identify light gray as light color", () => {
      expect(isLightColor(0xcccccc)).toBe(true);
    });

    it("should identify dark gray as dark color", () => {
      expect(isLightColor(0x333333)).toBe(false);
    });
  });

  describe("getContrastingColor", () => {
    it("should return white for dark colors", () => {
      const result = getContrastingColor(0x000000);
      expect(result).toBe(0xffffff);
    });

    it("should return black for light colors", () => {
      const result = getContrastingColor(0xffffff);
      expect(result).toBe(0x000000);
    });

    it("should return contrasting color for mid-range", () => {
      const result = getContrastingColor(0x808080);

      // Should return either black or white
      expect([0x000000, 0xffffff]).toContain(result);
    });
  });

  describe("createArchetypePalette", () => {
    it("should create palette with correct structure", () => {
      const palette = createArchetypePalette(0xff0000, 0x00ff00);

      expect(palette).toHaveProperty("primary");
      expect(palette).toHaveProperty("primaryLight");
      expect(palette).toHaveProperty("primaryDark");
      expect(palette).toHaveProperty("accent");
      expect(palette).toHaveProperty("accentLight");
      expect(palette).toHaveProperty("accentDark");
      expect(palette).toHaveProperty("neutral");
    });

    it("should preserve primary color", () => {
      const primaryColor = 0xff0000;
      const accentColor = 0x00ff00;
      const palette = createArchetypePalette(primaryColor, accentColor);

      expect(palette.primary).toBe(primaryColor);
    });

    it("should preserve accent color", () => {
      const primaryColor = 0xff0000;
      const accentColor = 0x00ff00;
      const palette = createArchetypePalette(primaryColor, accentColor);

      expect(palette.accent).toBe(accentColor);
    });

    it("should create lighter and darker variants", () => {
      const primaryColor = 0x808080;
      const accentColor = 0x404040;
      const palette = createArchetypePalette(primaryColor, accentColor);

      expect(palette.primaryLight).toBeGreaterThan(palette.primary);
      expect(palette.primaryDark).toBeLessThan(palette.primary);
      expect(palette.accentLight).toBeGreaterThan(palette.accent);
      expect(palette.accentDark).toBeLessThan(palette.accent);
    });

    it("should create neutral blend color", () => {
      const primaryColor = 0xff0000;
      const accentColor = 0x0000ff;
      const palette = createArchetypePalette(primaryColor, accentColor);

      // Neutral should be between primary and accent
      expect(palette.neutral).toBeGreaterThan(Math.min(primaryColor, accentColor));
      expect(palette.neutral).toBeLessThan(Math.max(primaryColor, accentColor));
    });
  });
});
