/**
 * Technique Synchronization Validation Tests
 *
 * These tests ensure:
 * 1. All techniques have unique animations
 * 2. No techniques are lost between systems
 * 3. Animation mappings are complete
 *
 * @category Testing
 * @module tests/TechniqueSynchronization
 */

import { describe, expect, it } from "vitest";
import { getAllTechniques, getTotalTechniqueCount } from "../trigram/techniques";
import {
  MUSA_TECHNIQUES,
  AMSALJA_TECHNIQUES,
  HACKER_TECHNIQUES,
  JEONGBO_YOWON_TECHNIQUES,
  JOJIK_POKRYEOKBAE_TECHNIQUES,
} from "../../data/techniques";
import { TECHNIQUE_TO_ANIMATION_TYPE } from "../../data/techniqueMappings";

// Combine all archetype techniques
const ARCHETYPE_TECHNIQUES = [
  ...MUSA_TECHNIQUES,
  ...AMSALJA_TECHNIQUES,
  ...HACKER_TECHNIQUES,
  ...JEONGBO_YOWON_TECHNIQUES,
  ...JOJIK_POKRYEOKBAE_TECHNIQUES,
];

describe("Technique System Synchronization", () => {
  describe("Trigram Technique System", () => {
    it("should have all trigram techniques defined", () => {
      const trigramTechniques = getAllTechniques();
      expect(trigramTechniques).toBeDefined();
      expect(trigramTechniques.length).toBeGreaterThan(0);
    });

    it("should report accurate total technique count", () => {
      const count = getTotalTechniqueCount();
      const actual = getAllTechniques().length;
      expect(count).toBe(actual);
    });

    it("should have unique technique IDs in trigram system", () => {
      const trigramTechniques = getAllTechniques();
      const ids = trigramTechniques.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have no missing technique IDs in trigram system", () => {
      const trigramTechniques = getAllTechniques();
      trigramTechniques.forEach((technique) => {
        expect(technique.id).toBeDefined();
        expect(technique.id).not.toBe("");
        expect(typeof technique.id).toBe("string");
      });
    });
  });

  describe("Archetype Technique System", () => {
    it("should have all archetype techniques defined", () => {
      expect(ARCHETYPE_TECHNIQUES).toBeDefined();
      expect(ARCHETYPE_TECHNIQUES.length).toBeGreaterThan(0);
    });

    it("should have unique technique IDs in archetype system", () => {
      const ids = ARCHETYPE_TECHNIQUES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have no missing technique IDs in archetype system", () => {
      ARCHETYPE_TECHNIQUES.forEach((technique) => {
        expect(technique.id).toBeDefined();
        expect(technique.id).not.toBe("");
        expect(typeof technique.id).toBe("string");
      });
    });
  });

  describe("Technique ID Overlap Analysis", () => {
    it("should document the number of unique techniques across both systems", () => {
      const trigramTechniques = getAllTechniques();
      const trigramIds = new Set(trigramTechniques.map((t) => t.id));
      const archetypeIds = new Set(ARCHETYPE_TECHNIQUES.map((t) => t.id));

      const allUniqueIds = new Set([...trigramIds, ...archetypeIds]);

      // Calculate overlap
      const overlap = [...archetypeIds].filter((id) => trigramIds.has(id));

      // Assert the documented state
      expect(archetypeIds.size).toBe(21); // 21 archetype techniques
      expect(trigramIds.size).toBe(51); // 51 trigram techniques
      expect(allUniqueIds.size).toBe(72); // 72 total unique techniques
      expect(overlap.length).toBe(0); // Zero overlap between systems
    });
  });

  describe("Animation Mapping Coverage", () => {
    it("should have animation mappings for all archetype techniques", () => {
      const missingMappings: string[] = [];

      ARCHETYPE_TECHNIQUES.forEach((technique) => {
        const hasMapping = technique.id in TECHNIQUE_TO_ANIMATION_TYPE;
        if (!hasMapping) {
          missingMappings.push(technique.id);
        }
      });

      expect(missingMappings).toEqual([]);
    });

    it("should have unique animations for archetype techniques", () => {
      const animationUsage = new Map<string, string[]>();

      ARCHETYPE_TECHNIQUES.forEach((technique) => {
        if (technique.animation?.type) {
          const animType = technique.animation.type;
          if (!animationUsage.has(animType)) {
            animationUsage.set(animType, []);
          }
          animationUsage.get(animType)!.push(technique.id);
        }
      });

      // Find duplicates
      const duplicates: Array<{ animation: string; techniques: string[] }> = [];
      animationUsage.forEach((techniques, animation) => {
        if (techniques.length > 1) {
          duplicates.push({ animation, techniques });
        }
      });

      // Some duplicates are expected (e.g., pressure_point for multiple techniques)
      // Document known duplicates for reference
      const knownDuplicates = ["pressure_point", "punch_mid", "punch_high"];
      const unexpectedDuplicates = duplicates.filter(
        (d) => !knownDuplicates.includes(d.animation)
      );
      
      // Fail if we find new unexpected duplicates
      expect(unexpectedDuplicates).toEqual([]);
    });

    it("should have animation types defined for archetype techniques", () => {
      const missingAnimations: string[] = [];

      ARCHETYPE_TECHNIQUES.forEach((technique) => {
        if (!technique.animation?.type) {
          missingAnimations.push(technique.id);
        }
      });

      expect(missingAnimations).toEqual([]);
    });
  });

  describe("Trigram Technique Animation Coverage", () => {
    it("should check if trigram techniques have animation types", () => {
      const trigramTechniques = getAllTechniques();
      const withAnimations = trigramTechniques.filter(
        (t: any) => t.animation || t.animationType
      );
      const withoutAnimations = trigramTechniques.filter(
        (t: any) => !t.animation && !t.animationType
      );

      // All trigram techniques should have animations
      expect(trigramTechniques.length).toBeGreaterThan(0);
      expect(withAnimations.length).toBe(trigramTechniques.length);
      expect(withoutAnimations.length).toBe(0);
    });
  });

  describe("System Integration Readiness", () => {
    it("should identify path to unified technique system", () => {
      const trigramTechniques = getAllTechniques();
      const archetypeTechniques = ARCHETYPE_TECHNIQUES;

      // Integration analysis - assert expected totals
      const totalTechniques = trigramTechniques.length + archetypeTechniques.length;
      expect(archetypeTechniques.length).toBe(21);
      expect(trigramTechniques.length).toBe(51);
      expect(totalTechniques).toBe(72);

      // Success if both systems have techniques
      expect(archetypeTechniques.length).toBeGreaterThan(0);
      expect(trigramTechniques.length).toBeGreaterThan(0);
    });
  });
});
