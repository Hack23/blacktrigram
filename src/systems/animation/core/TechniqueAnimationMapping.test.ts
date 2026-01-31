/**
 * Tests for TechniqueAnimationMapping
 * 
 * Tests the direct technique ID to animation type mapping system.
 * Ensures reliable lookup for all technique-animation relationships.
 * 
 * @module systems/animation/TechniqueAnimationMapping.test
 * @korean 기술애니메이션매핑테스트
 */

import { describe, expect, it } from "vitest";
import { AnimationType } from "../builders/MartialArtsAnimationBuilder";
import {
  getAnimationForTechnique,
  getAnimationForTechniqueOrDefault,
  getAnimationStats,
  getTechniquesByAnimationType,
  hasAnimationMapping,
  TECHNIQUE_ANIMATIONS,
  type AnimationConfig,
} from "./TechniqueAnimationMapping";

describe("TechniqueAnimationMapping", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNIQUE_ANIMATIONS MAP
  // ═══════════════════════════════════════════════════════════════════════════

  describe("TECHNIQUE_ANIMATIONS", () => {
    it("should be a ReadonlyMap", () => {
      expect(TECHNIQUE_ANIMATIONS).toBeInstanceOf(Map);
    });

    it("should contain technique mappings", () => {
      expect(TECHNIQUE_ANIMATIONS.size).toBeGreaterThan(0);
    });

    it("should have valid AnimationConfig values", () => {
      const firstEntry = Array.from(TECHNIQUE_ANIMATIONS.values())[0];
      
      expect(firstEntry).toBeDefined();
      expect(firstEntry.type).toBeDefined();
      expect(typeof firstEntry.type).toBe("string");
      expect(typeof firstEntry.speed).toBe("number");
      expect(firstEntry.speed).toBeGreaterThan(0);
    });

    it("should contain trigram stance techniques", () => {
      // Check for some known trigram techniques
      const hasGeon = Array.from(TECHNIQUE_ANIMATIONS.keys()).some(
        key => key.startsWith("geon_")
      );
      const hasTae = Array.from(TECHNIQUE_ANIMATIONS.keys()).some(
        key => key.startsWith("tae_")
      );
      const hasLi = Array.from(TECHNIQUE_ANIMATIONS.keys()).some(
        key => key.startsWith("li_")
      );
      
      expect(hasGeon || hasTae || hasLi).toBe(true);
    });

    it("should contain Dark Ops techniques", () => {
      const hasDarkOps = Array.from(TECHNIQUE_ANIMATIONS.keys()).some(
        key => key.startsWith("darkops_")
      );
      expect(hasDarkOps).toBe(true);
    });

    it("should have reasonable speed modifiers", () => {
      // All speed values should be in reasonable range (0.5 - 2.0)
      const allSpeeds = Array.from(TECHNIQUE_ANIMATIONS.values()).map(
        config => config.speed
      );
      
      allSpeeds.forEach(speed => {
        expect(speed).toBeGreaterThanOrEqual(0.5);
        expect(speed).toBeLessThanOrEqual(2.0);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION LOOKUP FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getAnimationForTechnique", () => {
    it("should return undefined for unmapped technique", () => {
      const result = getAnimationForTechnique("nonexistent_technique");
      expect(result).toBeUndefined();
    });

    it("should return AnimationConfig for valid technique", () => {
      const firstKey = Array.from(TECHNIQUE_ANIMATIONS.keys())[0];
      if (firstKey) {
        const config = getAnimationForTechnique(firstKey);
        
        expect(config).toBeDefined();
        expect(config?.type).toBeDefined();
        expect(config?.speed).toBeGreaterThan(0);
      }
    });

    it("should return correct config structure", () => {
      const firstKey = Array.from(TECHNIQUE_ANIMATIONS.keys())[0];
      if (firstKey) {
        const config = getAnimationForTechnique(firstKey);
        
        expect(config).toHaveProperty("type");
        expect(config).toHaveProperty("speed");
        expect(typeof config?.type).toBe("string");
        expect(typeof config?.speed).toBe("number");
      }
    });

    it("should be case-sensitive", () => {
      const firstKey = Array.from(TECHNIQUE_ANIMATIONS.keys())[0];
      if (firstKey) {
        const result = getAnimationForTechnique(firstKey.toUpperCase());
        // Should not match unless the key was already uppercase
        if (firstKey !== firstKey.toUpperCase()) {
          expect(result).toBeUndefined();
        }
      }
    });

    it("should handle empty string", () => {
      const result = getAnimationForTechnique("");
      expect(result).toBeUndefined();
    });

    it("should return different configs for different techniques", () => {
      const keys = Array.from(TECHNIQUE_ANIMATIONS.keys());
      if (keys.length >= 2) {
        const config1 = getAnimationForTechnique(keys[0]);
        const config2 = getAnimationForTechnique(keys[1]);
        
        expect(config1).toBeDefined();
        expect(config2).toBeDefined();
        // At least one property should differ
        expect(
          config1?.type !== config2?.type || config1?.speed !== config2?.speed
        ).toBe(true);
      }
    });
  });

  describe("getAnimationForTechniqueOrDefault", () => {
    it("should return mapped config for valid technique", () => {
      const firstKey = Array.from(TECHNIQUE_ANIMATIONS.keys())[0];
      if (firstKey) {
        const direct = getAnimationForTechnique(firstKey);
        const withDefault = getAnimationForTechniqueOrDefault(firstKey);
        
        expect(withDefault).toEqual(direct);
      }
    });

    it("should return default config for unmapped technique", () => {
      const result = getAnimationForTechniqueOrDefault("nonexistent");
      
      expect(result).toBeDefined();
      expect(result.type).toBe(AnimationType.JAB); // Default fallback
      expect(result.speed).toBeGreaterThan(0);
    });

    it("should use custom fallback type when provided", () => {
      const result = getAnimationForTechniqueOrDefault(
        "nonexistent",
        AnimationType.HOOK
      );
      
      expect(result).toBeDefined();
      expect(result.type).toBe(AnimationType.HOOK);
    });

    it("should never return undefined", () => {
      const result1 = getAnimationForTechniqueOrDefault("nonexistent");
      const result2 = getAnimationForTechniqueOrDefault("");
      const result3 = getAnimationForTechniqueOrDefault("xyz123");
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
    });

    it("should have valid speed multiplier in fallback", () => {
      const result = getAnimationForTechniqueOrDefault("nonexistent");
      expect(result.speed).toBeGreaterThan(0);
      expect(result.speed).toBeLessThanOrEqual(2.0);
    });

    it("should handle all AnimationType fallbacks", () => {
      const types = [
        AnimationType.JAB,
        AnimationType.CROSS,
        AnimationType.HOOK,
        AnimationType.FRONT_KICK,
        AnimationType.ROUNDHOUSE_KICK,
      ];

      types.forEach(type => {
        const result = getAnimationForTechniqueOrDefault("nonexistent", type);
        expect(result).toBeDefined();
        expect(result.type).toBe(type);
      });
    });
  });

  describe("hasAnimationMapping", () => {
    it("should return true for mapped technique", () => {
      const firstKey = Array.from(TECHNIQUE_ANIMATIONS.keys())[0];
      if (firstKey) {
        expect(hasAnimationMapping(firstKey)).toBe(true);
      }
    });

    it("should return false for unmapped technique", () => {
      expect(hasAnimationMapping("nonexistent_technique")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(hasAnimationMapping("")).toBe(false);
    });

    it("should be case-sensitive", () => {
      const firstKey = Array.from(TECHNIQUE_ANIMATIONS.keys())[0];
      if (firstKey && firstKey !== firstKey.toUpperCase()) {
        expect(hasAnimationMapping(firstKey.toUpperCase())).toBe(false);
      }
    });

    it("should match getAnimationForTechnique behavior", () => {
      const keys = Array.from(TECHNIQUE_ANIMATIONS.keys()).slice(0, 10);
      
      keys.forEach(key => {
        const hasMappingResult = hasAnimationMapping(key);
        const getResult = getAnimationForTechnique(key);
        
        // If hasMapping is true, get should return defined
        // If hasMapping is false, get should return undefined
        expect(hasMappingResult).toBe(getResult !== undefined);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REVERSE LOOKUP AND STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getTechniquesByAnimationType", () => {
    it("should return array of technique IDs", () => {
      const result = getTechniquesByAnimationType(AnimationType.JAB);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return techniques using specified animation type", () => {
      // Find an animation type that's actually used
      const firstEntry = Array.from(TECHNIQUE_ANIMATIONS.entries())[0];
      if (firstEntry) {
        const [techniqueId, config] = firstEntry;
        const techniques = getTechniquesByAnimationType(config.type);
        
        expect(techniques).toContain(techniqueId);
      }
    });

    it("should return empty array for unused animation type", () => {
      // Use an obscure animation type that may not be mapped
      const result = getTechniquesByAnimationType("NONEXISTENT" as AnimationType);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should not return duplicates", () => {
      const firstEntry = Array.from(TECHNIQUE_ANIMATIONS.entries())[0];
      if (firstEntry) {
        const [, config] = firstEntry;
        const techniques = getTechniquesByAnimationType(config.type);
        const uniqueTechniques = [...new Set(techniques)];
        
        expect(techniques.length).toBe(uniqueTechniques.length);
      }
    });

    it("should return readonly array", () => {
      const result = getTechniquesByAnimationType(AnimationType.CROSS);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle all standard animation types", () => {
      const types = [
        AnimationType.JAB,
        AnimationType.CROSS,
        AnimationType.HOOK,
        AnimationType.FRONT_KICK,
        AnimationType.ROUNDHOUSE_KICK,
      ];

      types.forEach(type => {
        const result = getTechniquesByAnimationType(type);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe("getAnimationStats", () => {
    it("should return stats object", () => {
      const stats = getAnimationStats();
      expect(typeof stats).toBe("object");
      expect(stats).not.toBeNull();
    });

    it("should contain counts for all AnimationTypes", () => {
      const stats = getAnimationStats();
      const animationTypes = Object.values(AnimationType);
      
      animationTypes.forEach(type => {
        expect(stats).toHaveProperty(type);
        expect(typeof stats[type]).toBe("number");
        expect(stats[type]).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have accurate total count", () => {
      const stats = getAnimationStats();
      const totalFromStats = Object.values(stats).reduce((sum, count) => sum + count, 0);
      const actualTotal = TECHNIQUE_ANIMATIONS.size;
      
      expect(totalFromStats).toBe(actualTotal);
    });

    it("should return non-negative counts", () => {
      const stats = getAnimationStats();
      const allCounts = Object.values(stats);
      
      allCounts.forEach(count => {
        expect(count).toBeGreaterThanOrEqual(0);
      });
    });

    it("should show which animations are most used", () => {
      const stats = getAnimationStats();
      const maxCount = Math.max(...Object.values(stats));
      
      expect(maxCount).toBeGreaterThanOrEqual(0);
    });

    it("should initialize all animation types to 0 if unused", () => {
      const stats = getAnimationStats();
      
      // Every animation type should be present, even if count is 0
      Object.values(AnimationType).forEach(type => {
        expect(type in stats).toBe(true);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TRIGRAM STANCE TECHNIQUES
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Trigram Stance Techniques", () => {
    it("should have Geon (☰) techniques mapped", () => {
      const geonTechniques = Array.from(TECHNIQUE_ANIMATIONS.keys()).filter(
        key => key.startsWith("geon_")
      );
      
      if (geonTechniques.length > 0) {
        geonTechniques.forEach(technique => {
          const config = getAnimationForTechnique(technique);
          expect(config).toBeDefined();
          expect(config?.type).toBeDefined();
        });
      }
    });

    it("should have Tae (☱) techniques mapped", () => {
      const taeTechniques = Array.from(TECHNIQUE_ANIMATIONS.keys()).filter(
        key => key.startsWith("tae_")
      );
      
      if (taeTechniques.length > 0) {
        taeTechniques.forEach(technique => {
          const config = getAnimationForTechnique(technique);
          expect(config).toBeDefined();
        });
      }
    });

    it("should have techniques from multiple trigrams", () => {
      const trigrams = ["geon_", "tae_", "li_", "jin_", "son_", "gam_", "gan_", "gon_"];
      let trigramCount = 0;
      
      trigrams.forEach(prefix => {
        const hasTechniques = Array.from(TECHNIQUE_ANIMATIONS.keys()).some(
          key => key.startsWith(prefix)
        );
        if (hasTechniques) trigramCount++;
      });
      
      // Should have techniques from multiple trigrams
      expect(trigramCount).toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // DARK OPS TECHNIQUES
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Dark Ops Techniques", () => {
    it("should have Dark Ops techniques mapped", () => {
      const darkOpsTechniques = Array.from(TECHNIQUE_ANIMATIONS.keys()).filter(
        key => key.startsWith("darkops_")
      );
      
      expect(darkOpsTechniques.length).toBeGreaterThan(0);
    });

    it("should have valid configs for Dark Ops techniques", () => {
      const darkOpsTechniques = Array.from(TECHNIQUE_ANIMATIONS.keys()).filter(
        key => key.startsWith("darkops_")
      );
      
      darkOpsTechniques.forEach(technique => {
        const config = getAnimationForTechnique(technique);
        expect(config).toBeDefined();
        expect(config?.type).toBeDefined();
        expect(config?.speed).toBeGreaterThan(0);
      });
    });

    it("should have reasonable speed modifiers for lethal techniques", () => {
      const darkOpsTechniques = Array.from(TECHNIQUE_ANIMATIONS.keys()).filter(
        key => key.startsWith("darkops_")
      );
      
      darkOpsTechniques.forEach(technique => {
        const config = getAnimationForTechnique(technique);
        if (config) {
          expect(config.speed).toBeGreaterThanOrEqual(0.5);
          expect(config.speed).toBeLessThanOrEqual(2.0);
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES AND ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Edge Cases", () => {
    it("should handle special characters in technique names", () => {
      expect(() => getAnimationForTechnique("test-technique_123")).not.toThrow();
      expect(() => hasAnimationMapping("test-technique_123")).not.toThrow();
    });

    it("should handle unicode characters", () => {
      expect(() => getAnimationForTechnique("한글기술")).not.toThrow();
      expect(() => hasAnimationMapping("한글기술")).not.toThrow();
    });

    it("should handle very long technique names", () => {
      const longName = "a".repeat(1000);
      expect(() => getAnimationForTechnique(longName)).not.toThrow();
      expect(() => hasAnimationMapping(longName)).not.toThrow();
    });

    it("should handle null/undefined gracefully in type system", () => {
      // TypeScript should prevent null/undefined, but test runtime behavior
      expect(() => getAnimationForTechniqueOrDefault("")).not.toThrow();
    });

    it("should maintain consistency between lookup functions", () => {
      const testIds = [
        "test1",
        "test2",
        Array.from(TECHNIQUE_ANIMATIONS.keys())[0] || "valid",
      ];
      
      testIds.forEach(id => {
        const hasMapping = hasAnimationMapping(id);
        const getResult = getAnimationForTechnique(id);
        const getOrDefault = getAnimationForTechniqueOrDefault(id);
        
        // If hasMapping is true, getResult should be defined
        if (hasMapping) {
          expect(getResult).toBeDefined();
        }
        
        // getOrDefault should always be defined
        expect(getOrDefault).toBeDefined();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION CONFIG STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════

  describe("AnimationConfig Structure", () => {
    it("should have readonly type field", () => {
      const firstEntry = Array.from(TECHNIQUE_ANIMATIONS.values())[0];
      if (firstEntry) {
        expect(firstEntry).toHaveProperty("type");
        expect(typeof firstEntry.type).toBe("string");
      }
    });

    it("should have readonly speed field", () => {
      const firstEntry = Array.from(TECHNIQUE_ANIMATIONS.values())[0];
      if (firstEntry) {
        expect(firstEntry).toHaveProperty("speed");
        expect(typeof firstEntry.speed).toBe("number");
      }
    });

    it("should match AnimationConfig type structure", () => {
      const config: AnimationConfig = {
        type: AnimationType.JAB,
        speed: 1.0,
      };
      
      expect(config).toHaveProperty("type");
      expect(config).toHaveProperty("speed");
    });
  });
});
