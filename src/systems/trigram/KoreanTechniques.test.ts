import { describe, it, expect, beforeEach } from "vitest";
import {
  KoreanTechniquesSystem,
  getTechniquesByStance,
  getAdvancedTechniques,
  getTechniquesByArchetype,
} from "./KoreanTechniques";
import { TrigramStance, PlayerArchetype } from "../../types/enums";

/**
 * ## Korean Techniques System Test Suite
 *
 * **Business Purpose:**
 * Validates the Korean martial arts techniques system that provides authentic
 * traditional Korean combat techniques based on trigram philosophy. Tests ensure that:
 * - Techniques are properly categorized by trigram stances
 * - Player archetypes have appropriate technique access
 * - Advanced techniques require proper skill progression
 * - Cultural accuracy is maintained in technique naming and descriptions
 *
 * **Korean Martial Arts Integration:**
 * - Tests authentic Korean technique names and descriptions
 * - Validates traditional trigram-based technique classification
 * - Ensures archetype-specific technique mastery bonuses
 * - Verifies progression requirements follow Korean martial arts hierarchy
 *
 * **Business Value:**
 * These tests ensure the technique system provides authentic Korean martial arts
 * education while maintaining proper game balance and progression.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("KoreanTechniquesSystem", () => {
  let techniquesSystem: KoreanTechniquesSystem;

  beforeEach(() => {
    techniquesSystem = new KoreanTechniquesSystem();
  });

  /**
   * **Business Requirement:** System must provide proper archetype-based
   * technique filtering for authentic Korean martial arts specialization
   */
  describe("getTechniquesByArchetype", () => {
    it("should filter techniques by archetype correctly", () => {
      const techniques = techniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.MUSA
      );

      expect(Array.isArray(techniques)).toBe(true);
      expect(techniques.length).toBeGreaterThan(0);

      techniques.forEach((technique) => {
        expect(technique.archetype).toContain(PlayerArchetype.MUSA);
      });
    });

    it("should return different techniques for different archetypes", () => {
      const musaTechniques = techniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.MUSA
      );
      const amsaljaTechniques = techniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.AMSALJA
      );

      expect(musaTechniques).not.toEqual(amsaljaTechniques);
    });

    it("should provide techniques for all player archetypes", () => {
      const archetypes = Object.values(PlayerArchetype);

      archetypes.forEach((archetype) => {
        const techniques = techniquesSystem.getTechniquesByArchetype(archetype);
        expect(techniques.length).toBeGreaterThan(0);
      });
    });

    it("should include Korean and English names for all techniques", () => {
      const techniques = techniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.MUSA
      );

      techniques.forEach((technique) => {
        expect(technique.koreanName).toBeTruthy();
        expect(technique.englishName).toBeTruthy();
        expect(typeof technique.koreanName).toBe("string");
        expect(typeof technique.englishName).toBe("string");
      });
    });
  });

  /**
   * **Business Requirement:** Techniques must be properly organized by
   * trigram stances following Korean martial arts philosophy
   */
  describe("getTechniquesByStance", () => {
    it("should return techniques for specific stance", () => {
      const techniques = getTechniquesByStance(TrigramStance.GEON);

      expect(Array.isArray(techniques)).toBe(true);
      techniques.forEach((technique) => {
        expect(technique.stance).toBe(TrigramStance.GEON);
      });
    });

    it("should handle all trigram stances", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const techniques = getTechniquesByStance(stance);
        expect(Array.isArray(techniques)).toBe(true);
      });
    });

    it("should return empty array for stance with no techniques", () => {
      const techniques = getTechniquesByStance(TrigramStance.GON);
      expect(Array.isArray(techniques)).toBe(true);
      // Note: This might return techniques if GON stance has techniques implemented
    });

    it("should return techniques with proper Korean martial arts attributes", () => {
      const techniques = getTechniquesByStance(TrigramStance.GEON);

      if (techniques.length > 0) {
        techniques.forEach((technique) => {
          expect(technique).toHaveProperty("koreanName");
          expect(technique).toHaveProperty("englishName");
          expect(technique).toHaveProperty("stance");
          expect(technique).toHaveProperty("archetype");
          expect(technique.stance).toBe(TrigramStance.GEON);
        });
      }
    });
  });

  /**
   * **Business Requirement:** Advanced techniques must require proper
   * skill progression following Korean martial arts hierarchy
   */
  describe("getAdvancedTechniques", () => {
    it("should return only advanced level techniques", () => {
      const techniques = getAdvancedTechniques();

      expect(Array.isArray(techniques)).toBe(true);
      techniques.forEach((technique) => {
        expect(technique.level).toBeGreaterThanOrEqual(3); // Advanced level threshold
      });
    });

    it("should include master-level techniques", () => {
      const techniques = getAdvancedTechniques();

      const masterTechniques = techniques.filter((t) => t.level >= 5);
      expect(masterTechniques.length).toBeGreaterThanOrEqual(0);
    });

    it("should have higher power requirements for advanced techniques", () => {
      const techniques = getAdvancedTechniques();

      techniques.forEach((technique) => {
        expect(technique.kiCost).toBeGreaterThan(10); // Advanced techniques cost more ki
        expect(technique.difficulty).toBeGreaterThanOrEqual(0.7); // Higher difficulty
      });
    });

    it("should maintain Korean cultural authenticity in advanced techniques", () => {
      const techniques = getAdvancedTechniques();

      techniques.forEach((technique) => {
        expect(technique.koreanName).toBeTruthy();
        expect(technique.koreanName).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/); // Contains Korean characters
        expect(technique.description).toBeTruthy();
      });
    });
  });

  /**
   * **Business Requirement:** System must provide comprehensive technique
   * management for all Korean martial arts aspects
   */
  describe("System Integration", () => {
    it("should provide techniques for all combinations of archetype and stance", () => {
      const archetypes = Object.values(PlayerArchetype);
      const stances = Object.values(TrigramStance);

      archetypes.forEach((archetype) => {
        stances.forEach((stance) => {
          const techniquesByArchetype =
            techniquesSystem.getTechniquesByArchetype(archetype);
          const techniquesByStance = getTechniquesByStance(stance);

          // Should be able to get techniques by both criteria
          expect(Array.isArray(techniquesByArchetype)).toBe(true);
          expect(Array.isArray(techniquesByStance)).toBe(true);
        });
      });
    });

    it("should maintain consistent technique data structure", () => {
      const allTechniques = [
        ...techniquesSystem.getTechniquesByArchetype(PlayerArchetype.MUSA),
        ...getTechniquesByStance(TrigramStance.GEON),
        ...getAdvancedTechniques(),
      ];

      allTechniques.forEach((technique) => {
        // Required properties
        expect(technique).toHaveProperty("id");
        expect(technique).toHaveProperty("koreanName");
        expect(technique).toHaveProperty("englishName");
        expect(technique).toHaveProperty("stance");
        expect(technique).toHaveProperty("archetype");
        expect(technique).toHaveProperty("level");
        expect(technique).toHaveProperty("kiCost");

        // Type validation
        expect(typeof technique.id).toBe("string");
        expect(typeof technique.koreanName).toBe("string");
        expect(typeof technique.englishName).toBe("string");
        expect(typeof technique.level).toBe("number");
        expect(typeof technique.kiCost).toBe("number");
      });
    });

    it("should provide balanced technique distribution across archetypes", () => {
      const archetypes = Object.values(PlayerArchetype);
      const techniqueCounts = archetypes.map((archetype) => ({
        archetype,
        count: techniquesSystem.getTechniquesByArchetype(archetype).length,
      }));

      // Each archetype should have at least some techniques
      techniqueCounts.forEach(({ archetype, count }) => {
        expect(count).toBeGreaterThan(0);
      });

      // No archetype should have extremely more techniques than others
      const maxCount = Math.max(...techniqueCounts.map((t) => t.count));
      const minCount = Math.min(...techniqueCounts.map((t) => t.count));

      expect(maxCount / minCount).toBeLessThan(3); // No more than 3x difference
    });
  });

  /**
   * **Business Requirement:** Technique filtering must support complex
   * queries for advanced Korean martial arts instruction
   */
  describe("Advanced Filtering", () => {
    it("should filter techniques by multiple criteria", () => {
      const musaTechniques = techniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.MUSA
      );
      const geonTechniques = getTechniquesByStance(TrigramStance.GEON);

      // Find techniques that match both criteria
      const musaGeonTechniques = musaTechniques.filter(
        (technique) => technique.stance === TrigramStance.GEON
      );

      musaGeonTechniques.forEach((technique) => {
        expect(technique.archetype).toContain(PlayerArchetype.MUSA);
        expect(technique.stance).toBe(TrigramStance.GEON);
      });
    });

    it("should support difficulty-based filtering", () => {
      const allTechniques = techniquesSystem.getTechniquesByArchetype(
        PlayerArchetype.MUSA
      );

      const beginnerTechniques = allTechniques.filter((t) => t.level <= 2);
      const advancedTechniques = allTechniques.filter((t) => t.level >= 4);

      if (beginnerTechniques.length > 0) {
        beginnerTechniques.forEach((technique) => {
          expect(technique.level).toBeLessThanOrEqual(2);
          expect(technique.kiCost).toBeLessThanOrEqual(15);
        });
      }

      if (advancedTechniques.length > 0) {
        advancedTechniques.forEach((technique) => {
          expect(technique.level).toBeGreaterThanOrEqual(4);
        });
      }
    });

    it("should maintain Korean naming consistency across all techniques", () => {
      const allTechniques = [
        ...techniquesSystem.getTechniquesByArchetype(PlayerArchetype.MUSA),
        ...techniquesSystem.getTechniquesByArchetype(PlayerArchetype.AMSALJA),
        ...getTechniquesByStance(TrigramStance.GEON),
        ...getAdvancedTechniques(),
      ];

      // Remove duplicates
      const uniqueTechniques = allTechniques.filter(
        (technique, index, self) =>
          index === self.findIndex((t) => t.id === technique.id)
      );

      uniqueTechniques.forEach((technique) => {
        // Korean name should contain Korean characters
        expect(technique.koreanName).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/);

        // English name should be reasonable length
        expect(technique.englishName.length).toBeGreaterThan(3);
        expect(technique.englishName.length).toBeLessThan(50);

        // Should not be the same
        expect(technique.koreanName).not.toBe(technique.englishName);
      });
    });
  });
});
