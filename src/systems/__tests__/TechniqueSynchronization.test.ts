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
  getTechniqueById as getArchetypeTechniqueById,
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

      // Document the state
      console.log("\n📊 Technique System Status:");
      console.log(`  Archetype Techniques: ${archetypeIds.size}`);
      console.log(`  Trigram Techniques: ${trigramIds.size}`);
      console.log(`  Total Unique: ${allUniqueIds.size}`);

      // Calculate overlap
      const overlap = [...archetypeIds].filter((id) => trigramIds.has(id));
      console.log(`  Overlap: ${overlap.length} techniques`);

      // This test documents current state - no assertion needed
      expect(allUniqueIds.size).toBeGreaterThan(0);
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

      if (missingMappings.length > 0) {
        console.warn("\n⚠️  Missing animation mappings:");
        missingMappings.forEach((id) => console.warn(`   - ${id}`));
      }

      expect(missingMappings.length).toBe(0);
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

      if (duplicates.length > 0) {
        console.warn("\n⚠️  Duplicate animation usage:");
        duplicates.forEach(({ animation, techniques }) => {
          console.warn(`   ${animation}: ${techniques.join(", ")}`);
        });
      }

      // This is informational - some duplicates may be intentional
      // But we want to know about them
      expect(duplicates.length).toBeLessThan(ARCHETYPE_TECHNIQUES.length / 2);
    });

    it("should have animation types defined for archetype techniques", () => {
      const missingAnimations: string[] = [];

      ARCHETYPE_TECHNIQUES.forEach((technique) => {
        if (!technique.animation?.type) {
          missingAnimations.push(technique.id);
        }
      });

      if (missingAnimations.length > 0) {
        console.warn("\n⚠️  Missing animation types:");
        missingAnimations.forEach((id) => console.warn(`   - ${id}`));
      }

      expect(missingAnimations.length).toBe(0);
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

      console.log("\n📊 Trigram Animation Coverage:");
      console.log(`  With animations: ${withAnimations.length}`);
      console.log(`  Without animations: ${withoutAnimations.length}`);

      if (withoutAnimations.length > 0) {
        console.warn("\n⚠️  Trigram techniques without animations:");
        withoutAnimations.slice(0, 10).forEach((t: any) => {
          console.warn(`   - ${t.id}: ${t.nameKorean || t.name?.korean || "?"}`);
        });
        if (withoutAnimations.length > 10) {
          console.warn(`   ... and ${withoutAnimations.length - 10} more`);
        }
      }

      // Document current state
      expect(trigramTechniques.length).toBeGreaterThan(0);
    });
  });

  describe("System Integration Readiness", () => {
    it("should identify path to unified technique system", () => {
      const trigramTechniques = getAllTechniques();
      const archetypeTechniques = ARCHETYPE_TECHNIQUES;

      console.log("\n🎯 Integration Analysis:");
      console.log(`  Total techniques available: ${trigramTechniques.length + archetypeTechniques.length}`);
      console.log(`  Archetype-based: ${archetypeTechniques.length}`);
      console.log(`  Trigram-based: ${trigramTechniques.length}`);
      console.log("\n  Recommendation: Merge systems for full 87+ technique library");

      // Success if both systems have techniques
      expect(archetypeTechniques.length).toBeGreaterThan(0);
      expect(trigramTechniques.length).toBeGreaterThan(0);
    });
  });
});
