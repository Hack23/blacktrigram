/**
 * Unit tests for stance helper utilities
 * 
 * Tests shared utility functions for stance-related operations.
 */

import { describe, it, expect } from "vitest";
import { TrigramStance } from "../types/common";
import {
  getStanceColor,
  getStanceNames,
  getTrigramSymbol,
  getStanceKoreanName,
  getStanceColorHex,
} from "./stanceHelpers";

describe("stanceHelpers", () => {
  describe("getStanceColor", () => {
    it("should return correct color for each stance", () => {
      expect(getStanceColor(TrigramStance.GEON)).toBeDefined();
      expect(getStanceColor(TrigramStance.TAE)).toBeDefined();
      expect(getStanceColor(TrigramStance.LI)).toBeDefined();
      expect(getStanceColor(TrigramStance.JIN)).toBeDefined();
      expect(getStanceColor(TrigramStance.SON)).toBeDefined();
      expect(getStanceColor(TrigramStance.GAM)).toBeDefined();
      expect(getStanceColor(TrigramStance.GAN)).toBeDefined();
      expect(getStanceColor(TrigramStance.GON)).toBeDefined();
    });

    it("should return different colors for different stances", () => {
      const colors = new Set([
        getStanceColor(TrigramStance.GEON),
        getStanceColor(TrigramStance.TAE),
        getStanceColor(TrigramStance.LI),
        getStanceColor(TrigramStance.JIN),
        getStanceColor(TrigramStance.SON),
        getStanceColor(TrigramStance.GAM),
        getStanceColor(TrigramStance.GAN),
        getStanceColor(TrigramStance.GON),
      ]);
      
      // All 8 stances should have unique colors
      expect(colors.size).toBe(8);
    });

    it("should return numbers (hex color values)", () => {
      expect(typeof getStanceColor(TrigramStance.GEON)).toBe("number");
      expect(getStanceColor(TrigramStance.GEON)).toBeGreaterThan(0);
    });
  });

  describe("getStanceNames", () => {
    it("should return korean, english, and romanized names", () => {
      const names = getStanceNames(TrigramStance.GEON);
      expect(names).toHaveProperty("korean");
      expect(names).toHaveProperty("english");
      expect(names).toHaveProperty("romanized");
      expect(names.korean).toBe("건");
      expect(names.english).toBe("Heaven");
      expect(names.romanized).toBe("Geon");
    });

    it("should return correct names for all 8 stances", () => {
      const expectedNames = [
        { stance: TrigramStance.GEON, korean: "건", english: "Heaven" },
        { stance: TrigramStance.TAE, korean: "태", english: "Lake" },
        { stance: TrigramStance.LI, korean: "리", english: "Fire" },
        { stance: TrigramStance.JIN, korean: "진", english: "Thunder" },
        { stance: TrigramStance.SON, korean: "손", english: "Wind" },
        { stance: TrigramStance.GAM, korean: "감", english: "Water" },
        { stance: TrigramStance.GAN, korean: "간", english: "Mountain" },
        { stance: TrigramStance.GON, korean: "곤", english: "Earth" },
      ];

      expectedNames.forEach(({ stance, korean, english }) => {
        const names = getStanceNames(stance);
        expect(names.korean).toBe(korean);
        expect(names.english).toBe(english);
      });
    });
  });

  describe("getTrigramSymbol", () => {
    it("should return Unicode trigram symbols", () => {
      const symbols = {
        [TrigramStance.GEON]: "☰",
        [TrigramStance.TAE]: "☱",
        [TrigramStance.LI]: "☲",
        [TrigramStance.JIN]: "☳",
        [TrigramStance.SON]: "☴",
        [TrigramStance.GAM]: "☵",
        [TrigramStance.GAN]: "☶",
        [TrigramStance.GON]: "☷",
      };

      Object.entries(symbols).forEach(([stance, symbol]) => {
        expect(getTrigramSymbol(stance as TrigramStance)).toBe(symbol);
      });
    });

    it("should return unique symbols for all stances", () => {
      const symbols = new Set([
        getTrigramSymbol(TrigramStance.GEON),
        getTrigramSymbol(TrigramStance.TAE),
        getTrigramSymbol(TrigramStance.LI),
        getTrigramSymbol(TrigramStance.JIN),
        getTrigramSymbol(TrigramStance.SON),
        getTrigramSymbol(TrigramStance.GAM),
        getTrigramSymbol(TrigramStance.GAN),
        getTrigramSymbol(TrigramStance.GON),
      ]);
      
      expect(symbols.size).toBe(8);
    });
  });

  describe("getStanceKoreanName", () => {
    it("should return Korean Hangul names", () => {
      expect(getStanceKoreanName(TrigramStance.GEON)).toBe("건");
      expect(getStanceKoreanName(TrigramStance.TAE)).toBe("태");
      expect(getStanceKoreanName(TrigramStance.LI)).toBe("리");
      expect(getStanceKoreanName(TrigramStance.JIN)).toBe("진");
      expect(getStanceKoreanName(TrigramStance.SON)).toBe("손");
      expect(getStanceKoreanName(TrigramStance.GAM)).toBe("감");
      expect(getStanceKoreanName(TrigramStance.GAN)).toBe("간");
      expect(getStanceKoreanName(TrigramStance.GON)).toBe("곤");
    });

    it("should return unique names for all stances", () => {
      const names = new Set([
        getStanceKoreanName(TrigramStance.GEON),
        getStanceKoreanName(TrigramStance.TAE),
        getStanceKoreanName(TrigramStance.LI),
        getStanceKoreanName(TrigramStance.JIN),
        getStanceKoreanName(TrigramStance.SON),
        getStanceKoreanName(TrigramStance.GAM),
        getStanceKoreanName(TrigramStance.GAN),
        getStanceKoreanName(TrigramStance.GON),
      ]);
      
      expect(names.size).toBe(8);
    });
  });

  describe("getStanceColorHex", () => {
    it("should return hex color strings", () => {
      const hex = getStanceColorHex(TrigramStance.GEON);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should return valid hex colors for all stances", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];

      stances.forEach((stance) => {
        const hex = getStanceColorHex(stance);
        expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
        expect(hex.length).toBe(7); // # + 6 characters
      });
    });

    it("should be consistent with getStanceColor", () => {
      const color = getStanceColor(TrigramStance.GEON);
      const hex = getStanceColorHex(TrigramStance.GEON);
      const expectedHex = `#${color.toString(16).padStart(6, '0')}`;
      expect(hex).toBe(expectedHex);
    });
  });

  describe("Integration", () => {
    it("should provide complete stance information", () => {
      const stance = TrigramStance.GEON;
      
      const color = getStanceColor(stance);
      const names = getStanceNames(stance);
      const symbol = getTrigramSymbol(stance);
      const korean = getStanceKoreanName(stance);
      const colorHex = getStanceColorHex(stance);

      expect(color).toBeDefined();
      expect(names.korean).toBe(korean);
      expect(names.korean).toBe("건");
      expect(symbol).toBe("☰");
      expect(colorHex).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
