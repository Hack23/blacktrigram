/**
 * Tests for color utility functions
 */

import { describe, it, expect } from "vitest";
import { toHexColor } from "./colorHelpers";
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
});
