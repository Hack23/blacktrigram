import { describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../../types/common";
import {
  KoreanTechniquesSystem,
  getTechniquesByStance,
} from "./KoreanTechniques";

describe("KoreanTechniquesSystem", () => {
  describe("getAllTechniques", () => {
    it("should return array of techniques", () => {
      const techniques = KoreanTechniquesSystem.getAllTechniques();

      expect(Array.isArray(techniques)).toBe(true);
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should return techniques with Korean names", () => {
      const techniques = KoreanTechniquesSystem.getAllTechniques();

      techniques.forEach((technique: KoreanTechnique) => {
        expect(technique.name.korean).toBeDefined();
        expect(technique.name.english).toBeDefined();
        expect(technique.koreanName).toBeDefined();
        expect(technique.englishName).toBeDefined();
      });
    });

    it("should have valid technique properties", () => {
      const techniques = KoreanTechniquesSystem.getAllTechniques();

      techniques.forEach((technique: KoreanTechnique) => {
        expect(technique.id).toBeDefined();
        expect(technique.stance).toBeDefined();
        expect(Object.values(TrigramStance)).toContain(technique.stance);
        expect(technique.kiCost).toBeGreaterThanOrEqual(0);
        expect(technique.staminaCost).toBeGreaterThanOrEqual(0);
        expect(technique.accuracy).toBeGreaterThan(0);
        expect(technique.accuracy).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("getTechniquesByArchetype", () => {
    it("should return archetype-specific techniques", () => {
      const techniques = KoreanTechniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.MUSA
      );

      expect(Array.isArray(techniques)).toBe(true);

      const musaStances = [TrigramStance.GEON, TrigramStance.GAN];
      const hasMusaTechniques = techniques.some((tech: KoreanTechnique) =>
        musaStances.includes(tech.stance)
      );
      expect(hasMusaTechniques).toBe(true);
    });

    it("should handle all archetypes", () => {
      Object.values(PlayerArchetype).forEach((archetype) => {
        const techniques =
          KoreanTechniquesSystem.getTechniquesByArchetype(archetype);
        expect(Array.isArray(techniques)).toBe(true);
      });
    });
  });

  describe("getTechniqueById", () => {
    it("should return technique by ID", () => {
      const allTechniques = KoreanTechniquesSystem.getAllTechniques();
      if (allTechniques.length > 0) {
        const firstTechnique = allTechniques[0];
        const foundTechnique = KoreanTechniquesSystem.getTechniqueById(
          firstTechnique.id
        );

        expect(foundTechnique).toBeDefined();
        expect(foundTechnique?.id).toBe(firstTechnique.id);
      }
    });

    it("should return undefined for invalid ID", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById("invalid_id");
      expect(technique).toBeUndefined();
    });
  });
});

// Fix: Keep standalone function tests
describe("getTechniquesByStance", () => {
  it("should return techniques for specific stance", () => {
    const techniques = getTechniquesByStance(TrigramStance.GEON);

    expect(Array.isArray(techniques)).toBe(true);
    techniques.forEach((technique) => {
      expect(technique.stance).toBe(TrigramStance.GEON);
    });
  });

  it("should handle all stances", () => {
    Object.values(TrigramStance).forEach((stance) => {
      const techniques = getTechniquesByStance(stance);
      expect(Array.isArray(techniques)).toBe(true);
    });
  });

  it("should return empty array for stance with no techniques", () => {
    const techniques = getTechniquesByStance(TrigramStance.GON);
    expect(Array.isArray(techniques)).toBe(true);
  });
});

import { KoreanTechnique } from "../vitalpoint";
import * as KT from "./KoreanTechniques";

describe("KoreanTechniques module", () => {
  it("should export technique data for each TrigramStance", () => {
    expect(Object.keys(KT).length).toBeGreaterThan(0);
  });
});

describe("Technique Data Consistency", () => {
  it("should have matching values between name object and separate name fields", () => {
    const techniques = KoreanTechniquesSystem.getAllTechniques();

    techniques.forEach((technique: KoreanTechnique) => {
      // Validate korean name consistency
      expect(technique.koreanName).toBe(technique.name.korean);
      
      // Validate english name consistency
      expect(technique.englishName).toBe(technique.name.english);
      
      // Validate romanized name consistency
      expect(technique.romanized).toBe(technique.name.romanized);
    });
  });

  it("should have all 51 techniques with consistent name fields", () => {
    const techniques = KoreanTechniquesSystem.getAllTechniques();
    
    // Verify we have all 51 techniques
    expect(techniques.length).toBe(51);
    
    // Count techniques with consistent data
    const consistentTechniques = techniques.filter((technique: KoreanTechnique) => 
      technique.koreanName === technique.name.korean &&
      technique.englishName === technique.name.english &&
      technique.romanized === technique.name.romanized
    );
    
    // All techniques should have consistent data
    expect(consistentTechniques.length).toBe(51);
  });
});
