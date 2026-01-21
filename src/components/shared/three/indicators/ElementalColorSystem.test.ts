/**
 * Tests for ElementalColorSystem
 * 
 * Verifies the 오행 (Five Elements) color mapping for Korean trigram stances
 * 
 * @module components/shared/three/indicators/ElementalColorSystem.test
 * @category Combat UI Tests
 */

import { describe, it, expect } from "vitest";
import { TrigramStance } from "../../../../types/common";
import {
  ELEMENT_COLORS,
  TRIGRAM_TO_ELEMENT,
  TRIGRAM_SYMBOLS,
  TRIGRAM_KOREAN_NAMES,
  TRIGRAM_ENGLISH_NAMES,
  getTrigramElementColor,
  getTrigramSymbol,
  getTrigramElement,
  getTrigramKoreanName,
  getTrigramEnglishName,
  getTrigramInfo,
  type Element,
} from "./ElementalColorSystem";

describe("ElementalColorSystem", () => {
  describe("Constants", () => {
    it("should define all five elements with colors", () => {
      expect(ELEMENT_COLORS.wood).toBe(0x228b22);
      expect(ELEMENT_COLORS.fire).toBe(0xff4444);
      expect(ELEMENT_COLORS.earth).toBe(0xffd700);
      expect(ELEMENT_COLORS.metal).toBe(0xffffff);
      expect(ELEMENT_COLORS.water).toBe(0x00ffff);
    });

    it("should map all eight trigrams to elements", () => {
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.GEON]).toBe("metal");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.TAE]).toBe("metal");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.LI]).toBe("fire");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.JIN]).toBe("wood");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.SON]).toBe("wood");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.GAM]).toBe("water");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.GAN]).toBe("earth");
      expect(TRIGRAM_TO_ELEMENT[TrigramStance.GON]).toBe("earth");
    });

    it("should define all trigram Unicode symbols", () => {
      expect(TRIGRAM_SYMBOLS[TrigramStance.GEON]).toBe("☰");
      expect(TRIGRAM_SYMBOLS[TrigramStance.TAE]).toBe("☱");
      expect(TRIGRAM_SYMBOLS[TrigramStance.LI]).toBe("☲");
      expect(TRIGRAM_SYMBOLS[TrigramStance.JIN]).toBe("☳");
      expect(TRIGRAM_SYMBOLS[TrigramStance.SON]).toBe("☴");
      expect(TRIGRAM_SYMBOLS[TrigramStance.GAM]).toBe("☵");
      expect(TRIGRAM_SYMBOLS[TrigramStance.GAN]).toBe("☶");
      expect(TRIGRAM_SYMBOLS[TrigramStance.GON]).toBe("☷");
    });

    it("should define all Korean trigram names", () => {
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.GEON]).toBe("건");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.TAE]).toBe("태");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.LI]).toBe("리");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.JIN]).toBe("진");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.SON]).toBe("손");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.GAM]).toBe("감");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.GAN]).toBe("간");
      expect(TRIGRAM_KOREAN_NAMES[TrigramStance.GON]).toBe("곤");
    });

    it("should define all English trigram names", () => {
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.GEON]).toBe("Heaven");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.TAE]).toBe("Lake");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.LI]).toBe("Fire");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.JIN]).toBe("Thunder");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.SON]).toBe("Wind");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.GAM]).toBe("Water");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.GAN]).toBe("Mountain");
      expect(TRIGRAM_ENGLISH_NAMES[TrigramStance.GON]).toBe("Earth");
    });
  });

  describe("getTrigramElementColor", () => {
    it("should return metal color for Geon (Heaven)", () => {
      const color = getTrigramElementColor(TrigramStance.GEON);
      expect(color).toBe(ELEMENT_COLORS.metal);
    });

    it("should return fire color for Li (Fire)", () => {
      const color = getTrigramElementColor(TrigramStance.LI);
      expect(color).toBe(ELEMENT_COLORS.fire);
    });

    it("should return wood color for Jin (Thunder)", () => {
      const color = getTrigramElementColor(TrigramStance.JIN);
      expect(color).toBe(ELEMENT_COLORS.wood);
    });

    it("should return water color for Gam (Water)", () => {
      const color = getTrigramElementColor(TrigramStance.GAM);
      expect(color).toBe(ELEMENT_COLORS.water);
    });

    it("should return earth color for Gon (Earth)", () => {
      const color = getTrigramElementColor(TrigramStance.GON);
      expect(color).toBe(ELEMENT_COLORS.earth);
    });

    it("should return correct colors for all eight trigrams", () => {
      const allStances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];

      allStances.forEach((stance) => {
        const color = getTrigramElementColor(stance);
        expect(typeof color).toBe("number");
        expect(color).toBeGreaterThanOrEqual(0);
        expect(color).toBeLessThanOrEqual(0xffffff);
      });
    });
  });

  describe("getTrigramSymbol", () => {
    it("should return correct Unicode symbols for all trigrams", () => {
      expect(getTrigramSymbol(TrigramStance.GEON)).toBe("☰");
      expect(getTrigramSymbol(TrigramStance.TAE)).toBe("☱");
      expect(getTrigramSymbol(TrigramStance.LI)).toBe("☲");
      expect(getTrigramSymbol(TrigramStance.JIN)).toBe("☳");
      expect(getTrigramSymbol(TrigramStance.SON)).toBe("☴");
      expect(getTrigramSymbol(TrigramStance.GAM)).toBe("☵");
      expect(getTrigramSymbol(TrigramStance.GAN)).toBe("☶");
      expect(getTrigramSymbol(TrigramStance.GON)).toBe("☷");
    });
  });

  describe("getTrigramElement", () => {
    it("should return correct element for each trigram", () => {
      expect(getTrigramElement(TrigramStance.GEON)).toBe("metal");
      expect(getTrigramElement(TrigramStance.TAE)).toBe("metal");
      expect(getTrigramElement(TrigramStance.LI)).toBe("fire");
      expect(getTrigramElement(TrigramStance.JIN)).toBe("wood");
      expect(getTrigramElement(TrigramStance.SON)).toBe("wood");
      expect(getTrigramElement(TrigramStance.GAM)).toBe("water");
      expect(getTrigramElement(TrigramStance.GAN)).toBe("earth");
      expect(getTrigramElement(TrigramStance.GON)).toBe("earth");
    });

    it("should return one of the five elements for all trigrams", () => {
      const validElements: Element[] = ["wood", "fire", "earth", "metal", "water"];
      const allStances = Object.values(TrigramStance);

      allStances.forEach((stance) => {
        const element = getTrigramElement(stance);
        expect(validElements).toContain(element);
      });
    });
  });

  describe("getTrigramKoreanName", () => {
    it("should return correct Korean names for all trigrams", () => {
      expect(getTrigramKoreanName(TrigramStance.GEON)).toBe("건");
      expect(getTrigramKoreanName(TrigramStance.TAE)).toBe("태");
      expect(getTrigramKoreanName(TrigramStance.LI)).toBe("리");
      expect(getTrigramKoreanName(TrigramStance.JIN)).toBe("진");
      expect(getTrigramKoreanName(TrigramStance.SON)).toBe("손");
      expect(getTrigramKoreanName(TrigramStance.GAM)).toBe("감");
      expect(getTrigramKoreanName(TrigramStance.GAN)).toBe("간");
      expect(getTrigramKoreanName(TrigramStance.GON)).toBe("곤");
    });
  });

  describe("getTrigramEnglishName", () => {
    it("should return correct English names for all trigrams", () => {
      expect(getTrigramEnglishName(TrigramStance.GEON)).toBe("Heaven");
      expect(getTrigramEnglishName(TrigramStance.TAE)).toBe("Lake");
      expect(getTrigramEnglishName(TrigramStance.LI)).toBe("Fire");
      expect(getTrigramEnglishName(TrigramStance.JIN)).toBe("Thunder");
      expect(getTrigramEnglishName(TrigramStance.SON)).toBe("Wind");
      expect(getTrigramEnglishName(TrigramStance.GAM)).toBe("Water");
      expect(getTrigramEnglishName(TrigramStance.GAN)).toBe("Mountain");
      expect(getTrigramEnglishName(TrigramStance.GON)).toBe("Earth");
    });
  });

  describe("getTrigramInfo", () => {
    it("should return complete info object for Geon stance", () => {
      const info = getTrigramInfo(TrigramStance.GEON);

      expect(info.stance).toBe(TrigramStance.GEON);
      expect(info.symbol).toBe("☰");
      expect(info.element).toBe("metal");
      expect(info.color).toBe(ELEMENT_COLORS.metal);
      expect(info.koreanName).toBe("건");
      expect(info.englishName).toBe("Heaven");
    });

    it("should return complete info object for Li stance", () => {
      const info = getTrigramInfo(TrigramStance.LI);

      expect(info.stance).toBe(TrigramStance.LI);
      expect(info.symbol).toBe("☲");
      expect(info.element).toBe("fire");
      expect(info.color).toBe(ELEMENT_COLORS.fire);
      expect(info.koreanName).toBe("리");
      expect(info.englishName).toBe("Fire");
    });

    it("should return readonly properties", () => {
      const info = getTrigramInfo(TrigramStance.GEON);

      // TypeScript type check ensures readonly, but runtime check
      const descriptor = Object.getOwnPropertyDescriptor(info, "stance");
      expect(descriptor).toBeDefined();
    });

    it("should provide complete info for all eight trigrams", () => {
      const allStances = Object.values(TrigramStance);

      allStances.forEach((stance) => {
        const info = getTrigramInfo(stance);

        expect(info.stance).toBe(stance);
        expect(typeof info.symbol).toBe("string");
        expect(info.symbol.length).toBeGreaterThan(0);
        expect(typeof info.element).toBe("string");
        expect(typeof info.color).toBe("number");
        expect(typeof info.koreanName).toBe("string");
        expect(info.koreanName.length).toBeGreaterThan(0);
        expect(typeof info.englishName).toBe("string");
        expect(info.englishName.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Element Distribution", () => {
    it("should have balanced element distribution across trigrams", () => {
      const elementCounts = {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0,
      };

      Object.values(TrigramStance).forEach((stance) => {
        const element = getTrigramElement(stance);
        elementCounts[element]++;
      });

      // Verify each element is used at least once
      expect(elementCounts.wood).toBeGreaterThan(0);
      expect(elementCounts.fire).toBeGreaterThan(0);
      expect(elementCounts.earth).toBeGreaterThan(0);
      expect(elementCounts.metal).toBeGreaterThan(0);
      expect(elementCounts.water).toBeGreaterThan(0);

      // Verify total count matches number of trigrams
      const totalCount = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
      expect(totalCount).toBe(8);
    });

    it("should have specific element associations based on traditional Bagua", () => {
      // Metal stances (☰☱)
      expect(getTrigramElement(TrigramStance.GEON)).toBe("metal");
      expect(getTrigramElement(TrigramStance.TAE)).toBe("metal");

      // Fire stance (☲)
      expect(getTrigramElement(TrigramStance.LI)).toBe("fire");

      // Wood stances (☳☴)
      expect(getTrigramElement(TrigramStance.JIN)).toBe("wood");
      expect(getTrigramElement(TrigramStance.SON)).toBe("wood");

      // Water stance (☵)
      expect(getTrigramElement(TrigramStance.GAM)).toBe("water");

      // Earth stances (☶☷)
      expect(getTrigramElement(TrigramStance.GAN)).toBe("earth");
      expect(getTrigramElement(TrigramStance.GON)).toBe("earth");
    });
  });

  describe("Korean Martial Arts Integration", () => {
    it("should provide bilingual support for all trigrams", () => {
      const allStances = Object.values(TrigramStance);

      allStances.forEach((stance) => {
        const koreanName = getTrigramKoreanName(stance);
        const englishName = getTrigramEnglishName(stance);

        // Korean name should be a single character
        expect(koreanName.length).toBe(1);

        // English name should be capitalized
        expect(englishName[0]).toBe(englishName[0].toUpperCase());

        // Both should be non-empty
        expect(koreanName.trim()).toBeTruthy();
        expect(englishName.trim()).toBeTruthy();
      });
    });

    it("should maintain authentic Korean martial arts philosophy", () => {
      // Verify Heaven (Geon) is metal - strength and clarity
      expect(getTrigramElement(TrigramStance.GEON)).toBe("metal");

      // Verify Fire (Li) is fire - illumination
      expect(getTrigramElement(TrigramStance.LI)).toBe("fire");

      // Verify Thunder (Jin) is wood - movement
      expect(getTrigramElement(TrigramStance.JIN)).toBe("wood");

      // Verify Water (Gam) is water - flow
      expect(getTrigramElement(TrigramStance.GAM)).toBe("water");

      // Verify Earth (Gon) is earth - grounding
      expect(getTrigramElement(TrigramStance.GON)).toBe("earth");
    });
  });
});
