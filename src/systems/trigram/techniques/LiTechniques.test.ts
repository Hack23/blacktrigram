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
import { LI_TECHNIQUES, type LiTechniqueMetadata } from "./LiTechniques";
import { TrigramStance } from "../../../types/common";

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

  describe("Precision Bonus", () => {
    it("should have precisionBonus for all techniques", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.precisionBonus).toBeDefined();
        expect(typeof technique.precisionBonus).toBe("number");
      });
    });

    it("should have precisionBonus in valid range (0.1-0.25)", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.precisionBonus).toBeGreaterThanOrEqual(0.1);
        expect(technique.precisionBonus).toBeLessThanOrEqual(0.25);
      });
    });

    it("should have highest precision bonus for li_nerve_strike", () => {
      const nerveStrike = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      expect(nerveStrike?.precisionBonus).toBe(0.25);
    });

    it("should correlate precision bonus with accuracy", () => {
      LI_TECHNIQUES.forEach((technique) => {
        // Higher accuracy should generally have higher precision bonus
        if (technique.accuracy >= 0.95) {
          expect(technique.precisionBonus).toBeGreaterThanOrEqual(0.2);
        }
      });
    });
  });

  describe("Vital Point Multiplier", () => {
    it("should have vitalPointMultiplier for all techniques", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.vitalPointMultiplier).toBeDefined();
        expect(typeof technique.vitalPointMultiplier).toBe("number");
      });
    });

    it("should have vitalPointMultiplier in valid range (1.5-2.5)", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.vitalPointMultiplier).toBeGreaterThanOrEqual(1.5);
        expect(technique.vitalPointMultiplier).toBeLessThanOrEqual(2.5);
      });
    });

    it("should have highest multiplier for li_nerve_strike", () => {
      const nerveStrike = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      expect(nerveStrike?.vitalPointMultiplier).toBe(2.5);
    });

    it("should have high multiplier for li_pressure_point", () => {
      const pressurePoint = LI_TECHNIQUES.find((t) => t.id === "li_pressure_point");
      expect(pressurePoint?.vitalPointMultiplier).toBeGreaterThanOrEqual(2.0);
    });
  });

  describe("Nerve Disruption Effect", () => {
    it("should have nerveDisruptionEffect for all techniques", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.nerveDisruptionEffect).toBeDefined();
        expect(typeof technique.nerveDisruptionEffect).toBe("object");
      });
    });

    it("should have valid effect types", () => {
      const validTypes = ["electric", "paralysis", "sensory"];
      LI_TECHNIQUES.forEach((technique) => {
        expect(validTypes).toContain(technique.nerveDisruptionEffect.type);
      });
    });

    it("should have intensity in valid range (0.0-1.0)", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.nerveDisruptionEffect.intensity).toBeGreaterThanOrEqual(0.0);
        expect(technique.nerveDisruptionEffect.intensity).toBeLessThanOrEqual(1.0);
      });
    });

    it("should have valid color values", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.nerveDisruptionEffect.color).toBeGreaterThanOrEqual(0);
        expect(technique.nerveDisruptionEffect.color).toBeLessThanOrEqual(0xffffff);
      });
    });

    it("should have reasonable duration (400-2000ms)", () => {
      LI_TECHNIQUES.forEach((technique) => {
        expect(technique.nerveDisruptionEffect.duration).toBeGreaterThanOrEqual(400);
        expect(technique.nerveDisruptionEffect.duration).toBeLessThanOrEqual(2000);
      });
    });

    it("should have paralysis type for li_nerve_strike", () => {
      const nerveStrike = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      expect(nerveStrike?.nerveDisruptionEffect.type).toBe("paralysis");
    });

    it("should have maximum intensity for li_nerve_strike", () => {
      const nerveStrike = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      expect(nerveStrike?.nerveDisruptionEffect.intensity).toBe(1.0);
    });
  });

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

      expect(nerveStrike?.executionTime).toBeLessThanOrEqual(450);
      expect(pressurePoint?.executionTime).toBeLessThanOrEqual(450);
    });

    it("should be faster than original execution times", () => {
      // Verify optimization: executionTime should be reduced from original values
      const flameSpear = LI_TECHNIQUES.find((t) => t.id === "li_flame_spear");
      expect(flameSpear?.executionTime).toBeLessThan(700); // Was 700ms

      const templeStrike = LI_TECHNIQUES.find((t) => t.id === "li_temple_strike");
      expect(templeStrike?.executionTime).toBeLessThan(650); // Was 650ms
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
    it("should satisfy LiTechniqueMetadata type", () => {
      LI_TECHNIQUES.forEach((technique) => {
        // TypeScript compilation ensures this, but we can verify at runtime
        const typed: LiTechniqueMetadata = technique;
        expect(typed).toBeDefined();
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
      expect(technique?.precisionBonus).toBe(0.15);
      expect(technique?.vitalPointMultiplier).toBe(1.8);
      expect(technique?.nerveDisruptionEffect.type).toBe("electric");
      expect(technique?.executionTime).toBe(500);
    });

    it("should have correct li_nerve_strike configuration", () => {
      const technique = LI_TECHNIQUES.find((t) => t.id === "li_nerve_strike");
      expect(technique).toBeDefined();
      expect(technique?.precisionBonus).toBe(0.25);
      expect(technique?.vitalPointMultiplier).toBe(2.5);
      expect(technique?.nerveDisruptionEffect.type).toBe("paralysis");
      expect(technique?.nerveDisruptionEffect.intensity).toBe(1.0);
      expect(technique?.executionTime).toBe(400);
    });

    it("should have correct li_pressure_point configuration", () => {
      const technique = LI_TECHNIQUES.find((t) => t.id === "li_pressure_point");
      expect(technique).toBeDefined();
      expect(technique?.precisionBonus).toBe(0.22);
      expect(technique?.vitalPointMultiplier).toBe(2.3);
      expect(technique?.accuracy).toBe(0.96);
    });
  });
});
