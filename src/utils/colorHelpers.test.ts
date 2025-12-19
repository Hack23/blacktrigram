/**
 * Tests for color utility functions
 */

import { describe, it, expect } from "vitest";
import { toHexColor, mixColors } from "./colorHelpers";
import { KOREAN_COLORS } from "../types/constants";

describe("colorHelpers", () => {
  describe("toHexColor", () => {
    it("should convert color with leading zeros", () => {
      expect(toHexColor(0x000001)).toBe("#000001");
    });

    it("should handle black color", () => {
      expect(toHexColor(0x000000)).toBe("#000000");
    });

    it("should convert standard hex colors correctly", () => {
      expect(toHexColor(0xff6b6b)).toBe("#ff6b6b");
      expect(toHexColor(0xcc0000)).toBe("#cc0000");
      expect(toHexColor(0xffffff)).toBe("#ffffff");
    });

    it("should convert KOREAN_COLORS constants correctly", () => {
      expect(toHexColor(KOREAN_COLORS.PRIMARY_CYAN)).toBe("#00ffff");
      expect(toHexColor(KOREAN_COLORS.SECONDARY_YELLOW)).toBe("#ffff00");
      expect(toHexColor(KOREAN_COLORS.UI_BACKGROUND_DARK)).toBe("#1a1a2e");
    });

    it("should pad short hex values with leading zeros", () => {
      expect(toHexColor(0x001122)).toBe("#001122");
      expect(toHexColor(0x0000ff)).toBe("#0000ff");
      expect(toHexColor(0x00ff00)).toBe("#00ff00");
    });

    it("should handle medium color values", () => {
      expect(toHexColor(0x9370db)).toBe("#9370db"); // Consciousness purple
      expect(toHexColor(0xff4444)).toBe("#ff4444"); // Cardinal south
    });
  });

  describe("mixColors", () => {
    it("should return first color when ratio is 0", () => {
      const color1 = 0xffdbac; // Skin color
      const color2 = 0x663366; // Bruise color
      expect(mixColors(color1, color2, 0)).toBe(color1);
    });

    it("should return second color when ratio is 1", () => {
      const color1 = 0xffdbac;
      const color2 = 0x663366;
      expect(mixColors(color1, color2, 1)).toBe(color2);
    });

    it("should mix colors at 50% ratio", () => {
      const white = 0xffffff;
      const black = 0x000000;
      const gray = mixColors(white, black, 0.5);
      
      // 50% mix should give gray (0x7f7f7f or similar)
      expect(gray).toBeGreaterThan(0x000000);
      expect(gray).toBeLessThan(0xffffff);
    });

    it("should create bruised skin effect", () => {
      const skinColor = 0xffdbac;
      const bruiseColor = 0x663366;
      const bruised = mixColors(skinColor, bruiseColor, 0.3);
      
      // Result should be between the two colors
      expect(bruised).toBeLessThan(skinColor);
      expect(bruised).toBeGreaterThan(bruiseColor);
    });

    it("should handle pure red to blue transition", () => {
      const red = 0xff0000;
      const blue = 0x0000ff;
      const purple = mixColors(red, blue, 0.5);
      
      // 50% red + 50% blue should give purple
      expect(purple).toBe(0x7f007f);
    });

    it("should mix RGB channels independently", () => {
      const color1 = 0xff0000; // Pure red
      const color2 = 0x00ff00; // Pure green
      const mixed = mixColors(color1, color2, 0.5);
      
      // Should have equal red and green, no blue
      const r = (mixed >> 16) & 0xff;
      const g = (mixed >> 8) & 0xff;
      const b = mixed & 0xff;
      
      expect(r).toBeCloseTo(0x7f, 1);
      expect(g).toBeCloseTo(0x7f, 1);
      expect(b).toBe(0);
    });

    it("should handle small ratios correctly", () => {
      const white = 0xffffff;
      const black = 0x000000;
      const nearWhite = mixColors(white, black, 0.1);
      
      // 10% black should be very light gray
      expect(nearWhite).toBeGreaterThan(0xd0d0d0);
      expect(nearWhite).toBeLessThan(0xffffff);
    });

    it("should work with Korean color constants", () => {
      const cyan = KOREAN_COLORS.PRIMARY_CYAN;
      const yellow = KOREAN_COLORS.SECONDARY_YELLOW;
      const mixed = mixColors(cyan, yellow, 0.5);
      
      // Mix should be greenish
      expect(mixed).toBeGreaterThan(0x000000);
      expect(mixed).toBeLessThan(0xffffff);
    });
  });
});
