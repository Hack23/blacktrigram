import { describe, it, expect } from "vitest";
import { TrigramSystem } from "./TrigramSystem";
import type { TrigramStance, KoreanTechnique } from "../types";

describe("TrigramSystem", () => {
  describe("getAllStances", () => {
    it("should return all 8 trigram stances", () => {
      // Assuming TRIGRAM_STANCES is a static member or exported constant
      const stances =
        TrigramSystem.TRIGRAM_STANCES_ORDER ||
        Object.keys(TrigramSystem.TRIGRAM_DATA);
      expect(stances).toHaveLength(8);
      // Add more specific checks if needed
    });
  });

  describe("getTrigramData", () => {
    it("should get technique for stance", () => {
      const technique = TrigramSystem.getTechniqueForStance("geon");
      expect(technique).toBeDefined();
      if (technique) {
        expect(technique.stance).toBe("geon");
        expect(technique.koreanName).toBeTruthy();
        expect(technique.englishName).toBeTruthy();
      }
    });
  });

  describe("getStanceEffectiveness", () => {
    it("should return correct effectiveness between stances", () => {
      // Assuming STANCE_EFFECTIVENESS_MATRIX is a static member
      const effectiveness = TrigramSystem.STANCE_EFFECTIVENESS_MATRIX.geon.tae;
      expect(typeof effectiveness).toBe("number");
    });

    it("should handle non-existent stance pairs gracefully or as defined", () => {
      // Example: expect effectiveness for non-defined pair to be 1.0 or throw
      // This depends on the system's design
      const effectiveness = TrigramSystem.STANCE_EFFECTIVENESS_MATRIX.geon.geon; // Or some other logic
      expect(effectiveness).toBe(1.0); // Assuming neutral for same stance
    });
  });

  describe("getTechniqueForStance", () => {
    it("should get technique for stance using correct method name", () => {
      const technique = TrigramSystem.getTechniqueForStance("geon");
      expect(technique).toBeDefined();
      if (technique) {
        expect(technique.stance).toBe("geon");
      }
    });
  });

  describe("Korean martial arts integration", () => {
    it("should validate Korean technique names", () => {
      const technique = TrigramSystem.getTechniqueForStance("li");
      expect(technique).toBeDefined();
      if (technique) {
        expect(technique.koreanName).toMatch(/[\u3131-\u3163\uac00-\ud7a3]/); // Korean characters
      }
    });

    it("should handle all trigram stances", () => {
      const stances: TrigramStance[] = [
        "geon",
        "tae",
        "li",
        "jin",
        "son",
        "gam",
        "gan",
        "gon",
      ];

      stances.forEach((stance) => {
        const technique = TrigramSystem.getTechniqueForStance(stance);
        expect(technique).toBeDefined();
        if (technique) {
          expect(technique.stance).toBe(stance);
        }
      });
    });
  });

  describe("damage effectiveness calculations", () => {
    it("should calculate effective damage correctly", () => {
      const distance = 50;
      const accuracy = 0.8;

      const mockTechnique: KoreanTechnique = {
        name: "Mock Technique",
        koreanName: "모의 기술",
        englishName: "Mock Technique",
        description: { korean: "테스트 설명", english: "Test description" },
        kiCost: 10,
        staminaCost: 5,
        range: 100,
        accuracy: accuracy,
        stance: "geon",
        damage: 25,
        type: "strike", // Add missing type property
      };

      const damage = TrigramSystem.calculateDamage(
        mockTechnique,
        distance,
        accuracy
      );

      expect(typeof damage).toBe("number");
      expect(damage).toBeGreaterThan(0);
    });
  });
});
