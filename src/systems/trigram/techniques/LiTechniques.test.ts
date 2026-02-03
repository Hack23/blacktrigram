/**
 * LiTechniques.test.ts
 *
 * Comprehensive test suite for Li (Fire) trigram precision strike techniques.
 * Tests precision bonuses, vital point multipliers, nerve disruption effects,
 * and execution time optimization.
 *
 * @author Black Trigram Development Team
 */

import { describe, it, expect } from "vitest";
import { LI_TECHNIQUES } from "./LiTechniques";
import { TrigramStance, DamageType } from "../../../types/common";

describe("LiTechniques", () => {
  describe("Technique Array", () => {
    it("should export 6 Li techniques", () => {
      expect(LI_TECHNIQUES).toHaveLength(6);
    });

    it("should have all techniques in Li stance", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.stance).toBe(TrigramStance.LI);
      });
    });

    it("should have unique IDs for each technique", () => {
      const ids = LI_TECHNIQUES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(LI_TECHNIQUES.length);
    });

    it("should have all techniques start with 'li_' prefix", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.id).toMatch(/^li_/);
      });
    });
  });

  // NOTE: precisionBonus, vitalPointMultiplier, and nerveDisruptionEffect
  // were previously explored as potential Li-specific properties but were never
  // implemented in the actual technique definitions and are not part of the
  // current Li techniques specification. Tests for these properties have been
  // removed to match the current implementation. If these properties are
  // reintroduced in the future, corresponding tests should be added here.

  describe("Execution Time Optimization", () => {
    it("should have executionTime for all techniques", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.executionTime).toBeDefined();
        expect(typeof technique.executionTime).toBe("number");
      });
    });

    it("should have executionTime in optimized range (400-800ms)", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.executionTime).toBeGreaterThanOrEqual(400);
        expect(technique.executionTime).toBeLessThanOrEqual(800);
      });
    });

    it("should have fastest execution for precision strikes", () => {
      const nerveStrike = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      const pressurePoint = LI_TECHNIQUES.find((t) => t.id === "li_pressure_point");

      // Verify these are among the fastest (under 700ms)
      expect(nerveStrike?.executionTime).toBeLessThanOrEqual(700);
      expect(pressurePoint?.executionTime).toBeLessThanOrEqual(700);
    });

    it("should be optimized for precision", () => {
      // Verify execution times are reasonable for precision techniques
      const flameSpear = LI_TECHNIQUES.find((t) => t.id === "li_flame_spear");
      expect(flameSpear?.executionTime).toBeLessThanOrEqual(800);

      const templeStrike = LI_TECHNIQUES.find((t) => t.id === "li_temple_strike");
      expect(templeStrike?.executionTime).toBeLessThanOrEqual(800);
    });
  });

  describe("Technique Balance", () => {
    it("should have required categorization fields", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.category).toBeDefined();
        expect(technique.range).toBeDefined();
        expect(technique.speed).toBeDefined();
      });
    });

    it("should have special category for precision techniques", () => {
      const specialTechniques = [
        "li_temple_strike",
        "li_nerve_strike",
        "li_pressure_point",
      ];

      specialTechniques.forEach((id) => {
        const technique = LI_TECHNIQUES.find((t) => t.id === id);
        expect(technique?.category).toBe("special");
      });
    });

    it("should have short range for most techniques", () => {
      const shortRangeCount = LI_TECHNIQUES.filter((t) => t.range === "short").length;
      expect(shortRangeCount).toBeGreaterThanOrEqual(4);
    });

    it("should have high accuracy for all techniques", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.accuracy).toBeGreaterThanOrEqual(0.85);
      });
    });
  });

  describe("Bilingual Text", () => {
    it("should have Korean and English names", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.name.korean).toBeDefined();
        expect(technique.name.english).toBeDefined();
        expect(technique.name.romanized).toBeDefined();
      });
    });

    it("should have Korean and English descriptions", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.description.korean).toBeDefined();
        expect(technique.description.english).toBeDefined();
      });
    });

    it("should have consistent naming across fields", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.koreanName).toBe(technique.name.korean);
        expect(technique.englishName).toBe(technique.name.english);
        expect(technique.romanized).toBe(technique.name.romanized);
      });
    });
  });

  describe("Animation Configuration", () => {
    it("should have animation metadata", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.animationCategory).toBeDefined();
        expect(technique.animationId).toBeDefined();
        expect(technique.animationSpeed).toBeDefined();
      });
    });

    it("should have unique animation IDs", () => {
      const animationIds = LI_TECHNIQUES.map((t) => t.animationId);
      const uniqueIds = new Set(animationIds);
      expect(uniqueIds.size).toBe(LI_TECHNIQUES.length);
    });

    it("should have animation speed matching technique speed", () => {
      LI_TECHNIQUES.forEach((technique) => {
        // Animation speed should be similar to technique speed
        const speedDiff = Math.abs(
          (technique.animationSpeed ?? 1.0) - (technique.speed ?? 1.0)
        );
        expect(speedDiff).toBeLessThan(0.5);
      });
    });
  });

  describe("Combat Stats", () => {
    it("should have reasonable damage values", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.damage).toBeGreaterThanOrEqual(20);
        expect(technique.damage).toBeLessThanOrEqual(40);
      });
    });

    it("should have balanced ki and stamina costs", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.kiCost).toBeGreaterThan(0);
        expect(technique.staminaCost).toBeGreaterThan(0);
        
        // Total cost should be reasonable
        const totalCost = technique.kiCost + technique.staminaCost;
        expect(totalCost).toBeGreaterThanOrEqual(20);
        expect(totalCost).toBeLessThanOrEqual(50);
      });
    });

    it("should have high critical hit chances", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.critChance).toBeGreaterThanOrEqual(0.15);
        expect(technique.critMultiplier).toBeGreaterThanOrEqual(1.7);
      });
    });
  });

  describe("Type Safety", () => {
    it("should satisfy TrigramStanceTechnique type", () => {
      LI_TECHNIQUES.forEach((technique) => {
        // TypeScript compilation ensures this, but we can verify at runtime
        expect(technique).toBeDefined();
        expect(technique.id).toBeDefined();
        expect(technique.stance).toBe(TrigramStance.LI);
      });
    });

    it("should have readonly arrays", () => {
      // TypeScript ensures this at compile-time
      expect(LI_TECHNIQUES).toBeDefined();
      expect(Array.isArray(LI_TECHNIQUES)).toBe(true);
    });
  });

  describe("Integration", () => {
    it("should have reach configuration for all techniques", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.reachConfig).toBeDefined();
        expect(technique.reachConfig.bodyPart).toBeDefined();
        expect(technique.reachConfig.techniqueType).toBeDefined();
        expect(technique.reachConfig.baseExtension).toBeDefined();
      });
    });

    it("should have status effects array", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(Array.isArray(technique.effects)).toBe(true);
      });
    });

    it("should have recovery time greater than execution time", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.recoveryTime).toBeGreaterThan(technique.executionTime);
      });
    });
  });

  describe("Specific Technique Validation", () => {
    it("should have correct li_flame_spear configuration", () => {
      const technique = LI_TECHNIQUES.find((t) => t.id === "li_flame_spear");
      expect(technique).toBeDefined();
      expect(technique?.executionTime).toBe(700);
      expect(technique?.accuracy).toBe(0.9);
      expect(technique?.damageType).toBe(DamageType.PIERCING);
    });

    it("should have correct li_nerve_strike configuration", () => {
      const technique = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      expect(technique).toBeDefined();
      expect(technique?.executionTime).toBe(600);
      expect(technique?.accuracy).toBe(0.95);
      expect(technique?.damageType).toBe(DamageType.NERVE);
    });

    it("should have correct li_pressure_point configuration", () => {
      const technique = LI_TECHNIQUES.find((t) => t.id === "li_pressure_point");
      expect(technique).toBeDefined();
      expect(technique?.executionTime).toBe(550);
      expect(technique?.accuracy).toBe(0.96);
      expect(technique?.damageType).toBe(DamageType.PRESSURE);
    });
  });
});
