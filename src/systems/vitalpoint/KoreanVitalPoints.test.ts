import { describe, expect, it } from "vitest";
import { TrigramStance, VitalPointCategory, VitalPointSeverity } from "../../types/common";
import {
  KOREAN_VITAL_POINTS,
  getVitalPointsByCategory,
  getVitalPointsByRegion,
  getVitalPointById,
  getVitalPointsByStance,
  getVitalPointsByDifficulty,
  getVitalPointsBySeverity,
} from "./KoreanVitalPoints";

describe("KoreanVitalPoints", () => {
  describe("KOREAN_VITAL_POINTS data", () => {
    it("should have defined vital points", () => {
      expect(KOREAN_VITAL_POINTS).toBeDefined();
      expect(KOREAN_VITAL_POINTS.length).toBeGreaterThan(0);
    });

    it("should have all required properties for each vital point", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        expect(vp.id).toBeDefined();
        expect(vp.names).toBeDefined();
        expect(vp.names.korean).toBeDefined();
        expect(vp.names.english).toBeDefined();
        expect(vp.names.romanized).toBeDefined();
        expect(vp.position).toBeDefined();
        expect(vp.position.x).toBeDefined();
        expect(vp.position.y).toBeDefined();
        expect(vp.category).toBeDefined();
        expect(vp.severity).toBeDefined();
        expect(vp.description).toBeDefined();
        expect(vp.description.korean).toBeDefined();
        expect(vp.description.english).toBeDefined();
        expect(vp.targetingDifficulty).toBeDefined();
        expect(vp.effectiveStances).toBeDefined();
        expect(Array.isArray(vp.effectiveStances)).toBe(true);
        expect(Array.isArray(vp.effects)).toBe(true);
      });
    });

    it("should have unique IDs for all vital points", () => {
      const ids = KOREAN_VITAL_POINTS.map((vp) => vp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have valid targeting difficulty values (0-1)", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        expect(vp.targetingDifficulty).toBeGreaterThanOrEqual(0);
        expect(vp.targetingDifficulty).toBeLessThanOrEqual(1);
      });
    });

    it("should have baekhoehoel vital point", () => {
      const vp = KOREAN_VITAL_POINTS.find((vp) => vp.id === "baekhoehoel");
      expect(vp).toBeDefined();
      expect(vp?.names.korean).toBe("백회혈");
      expect(vp?.names.english).toBe("Crown Point");
      expect(vp?.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should have inmyeong vital point", () => {
      const vp = KOREAN_VITAL_POINTS.find((vp) => vp.id === "inmyeong");
      expect(vp).toBeDefined();
      expect(vp?.names.korean).toBe("인영");
      expect(vp?.names.english).toBe("Man's Welcome");
      expect(vp?.category).toBe(VitalPointCategory.VASCULAR);
    });

    it("should have myeongmun vital point", () => {
      const vp = KOREAN_VITAL_POINTS.find((vp) => vp.id === "myeongmun");
      expect(vp).toBeDefined();
      expect(vp?.names.korean).toBe("명문");
      expect(vp?.names.english).toBe("Gate of Life");
      expect(vp?.severity).toBe(VitalPointSeverity.MAJOR);
    });

    it("should have Korean names in Hangul", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        // Check if Korean name contains Hangul characters
        const hasHangul = /[\uAC00-\uD7AF]/.test(vp.names.korean);
        expect(hasHangul).toBe(true);
      });
    });

    it("should have romanized names", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        expect(vp.names.romanized).toBeDefined();
        expect(vp.names.romanized.length).toBeGreaterThan(0);
      });
    });

    it("should have effects for all vital points", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        expect(Array.isArray(vp.effects)).toBe(true);
        expect(vp.effects.length).toBeGreaterThan(0);
        
        vp.effects.forEach((effect) => {
          expect(effect.id).toBeDefined();
          expect(effect.type).toBeDefined();
          expect(effect.intensity).toBeDefined();
          expect(effect.duration).toBeGreaterThan(0);
          expect(effect.description).toBeDefined();
          expect(effect.description.korean).toBeDefined();
          expect(effect.description.english).toBeDefined();
        });
      });
    });

    it("should have backwards compatibility properties", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        expect(vp.korean).toBeDefined();
        expect(vp.english).toBeDefined();
        expect(vp.anatomicalName).toBeDefined();
        expect(vp.radius).toBeDefined();
        expect(vp.damage).toBeDefined();
        expect(vp.difficulty).toBeDefined();
        expect(vp.requiredForce).toBeDefined();
      });
    });
  });

  describe("getVitalPointsByCategory", () => {
    it("should filter vital points by NEUROLOGICAL category", () => {
      const neurological = getVitalPointsByCategory(VitalPointCategory.NEUROLOGICAL);
      
      expect(neurological.length).toBeGreaterThan(0);
      neurological.forEach((vp) => {
        expect(vp.category).toBe(VitalPointCategory.NEUROLOGICAL);
      });
    });

    it("should filter vital points by VASCULAR category", () => {
      const vascular = getVitalPointsByCategory(VitalPointCategory.VASCULAR);
      
      expect(vascular.length).toBeGreaterThan(0);
      vascular.forEach((vp) => {
        expect(vp.category).toBe(VitalPointCategory.VASCULAR);
      });
    });

    it("should return empty array for non-existent category", () => {
      const result = getVitalPointsByCategory("NON_EXISTENT" as VitalPointCategory);
      expect(result).toEqual([]);
    });

    it("should return different results for different categories", () => {
      const neurological = getVitalPointsByCategory(VitalPointCategory.NEUROLOGICAL);
      const vascular = getVitalPointsByCategory(VitalPointCategory.VASCULAR);
      
      expect(neurological.length).not.toBe(vascular.length);
    });
  });

  describe("getVitalPointsByRegion", () => {
    it("should filter vital points by region", () => {
      // First check what regions exist
      const regions = new Set(KOREAN_VITAL_POINTS.map((vp) => vp.region).filter(Boolean));
      
      regions.forEach((region) => {
        if (region) {
          const result = getVitalPointsByRegion(region);
          expect(result.length).toBeGreaterThan(0);
          result.forEach((vp) => {
            expect(vp.region).toBe(region);
          });
        }
      });
    });

    it("should return empty array for non-existent region", () => {
      const result = getVitalPointsByRegion("non_existent_region");
      expect(result).toEqual([]);
    });

    it("should handle undefined region", () => {
      const result = getVitalPointsByRegion(undefined as any);
      expect(result).toBeDefined();
    });
  });

  describe("getVitalPointById", () => {
    it("should find vital point by ID", () => {
      const vp = getVitalPointById("baekhoehoel");
      
      expect(vp).toBeDefined();
      expect(vp?.id).toBe("baekhoehoel");
      expect(vp?.names.korean).toBe("백회혈");
    });

    it("should return undefined for non-existent ID", () => {
      const vp = getVitalPointById("non_existent_id");
      expect(vp).toBeUndefined();
    });

    it("should return correct vital point for inmyeong", () => {
      const vp = getVitalPointById("inmyeong");
      
      expect(vp).toBeDefined();
      expect(vp?.names.english).toBe("Man's Welcome");
    });

    it("should return correct vital point for myeongmun", () => {
      const vp = getVitalPointById("myeongmun");
      
      expect(vp).toBeDefined();
      expect(vp?.names.english).toBe("Gate of Life");
    });

    it("should handle empty string", () => {
      const vp = getVitalPointById("");
      expect(vp).toBeUndefined();
    });

    it("should be case-sensitive", () => {
      const vp = getVitalPointById("BAEKHOEHOEL");
      expect(vp).toBeUndefined();
    });
  });

  describe("getVitalPointsByStance", () => {
    it("should filter vital points by GEON stance", () => {
      const geon = getVitalPointsByStance(TrigramStance.GEON);
      
      expect(geon.length).toBeGreaterThan(0);
      geon.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.GEON);
      });
    });

    it("should filter vital points by TAE stance", () => {
      const tae = getVitalPointsByStance(TrigramStance.TAE);
      
      tae.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.TAE);
      });
    });

    it("should filter vital points by LI stance", () => {
      const li = getVitalPointsByStance(TrigramStance.LI);
      
      li.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.LI);
      });
    });

    it("should filter vital points by JIN stance", () => {
      const jin = getVitalPointsByStance(TrigramStance.JIN);
      
      jin.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.JIN);
      });
    });

    it("should filter vital points by SON stance", () => {
      const son = getVitalPointsByStance(TrigramStance.SON);
      
      son.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.SON);
      });
    });

    it("should filter vital points by GAM stance", () => {
      const gam = getVitalPointsByStance(TrigramStance.GAM);
      
      gam.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.GAM);
      });
    });

    it("should filter vital points by GAN stance", () => {
      const gan = getVitalPointsByStance(TrigramStance.GAN);
      
      gan.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.GAN);
      });
    });

    it("should filter vital points by GON stance", () => {
      const gon = getVitalPointsByStance(TrigramStance.GON);
      
      gon.forEach((vp) => {
        expect(vp.effectiveStances).toContain(TrigramStance.GON);
      });
    });

    it("should return different results for different stances", () => {
      const geon = getVitalPointsByStance(TrigramStance.GEON);
      const tae = getVitalPointsByStance(TrigramStance.TAE);
      
      // Results may overlap but shouldn't be identical for all stances
      const geonIds = new Set(geon.map((vp) => vp.id));
      const taeIds = new Set(tae.map((vp) => vp.id));
      
      expect(geonIds.size).toBeGreaterThan(0);
      expect(taeIds.size).toBeGreaterThan(0);
    });
  });

  describe("getVitalPointsByDifficulty", () => {
    it("should filter easy vital points (0-0.5)", () => {
      const easy = getVitalPointsByDifficulty(0, 0.5);
      
      easy.forEach((vp) => {
        expect(vp.targetingDifficulty).toBeGreaterThanOrEqual(0);
        expect(vp.targetingDifficulty).toBeLessThanOrEqual(0.5);
      });
    });

    it("should filter medium vital points (0.5-0.75)", () => {
      const medium = getVitalPointsByDifficulty(0.5, 0.75);
      
      medium.forEach((vp) => {
        expect(vp.targetingDifficulty).toBeGreaterThanOrEqual(0.5);
        expect(vp.targetingDifficulty).toBeLessThanOrEqual(0.75);
      });
    });

    it("should filter hard vital points (0.75-1.0)", () => {
      const hard = getVitalPointsByDifficulty(0.75, 1.0);
      
      hard.forEach((vp) => {
        expect(vp.targetingDifficulty).toBeGreaterThanOrEqual(0.75);
        expect(vp.targetingDifficulty).toBeLessThanOrEqual(1.0);
      });
    });

    it("should return empty array for invalid range", () => {
      const result = getVitalPointsByDifficulty(2.0, 3.0);
      expect(result).toEqual([]);
    });

    it("should handle exact match", () => {
      // Find a specific difficulty value
      const vp = KOREAN_VITAL_POINTS[0];
      const difficulty = vp.targetingDifficulty;
      
      const result = getVitalPointsByDifficulty(difficulty, difficulty);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle min > max gracefully", () => {
      const result = getVitalPointsByDifficulty(0.9, 0.1);
      expect(result).toEqual([]);
    });
  });

  describe("getVitalPointsBySeverity", () => {
    it("should filter CRITICAL vital points", () => {
      const critical = getVitalPointsBySeverity(VitalPointSeverity.CRITICAL);
      
      expect(critical.length).toBeGreaterThan(0);
      critical.forEach((vp) => {
        expect(vp.severity).toBe(VitalPointSeverity.CRITICAL);
      });
    });

    it("should filter MAJOR vital points", () => {
      const major = getVitalPointsBySeverity(VitalPointSeverity.MAJOR);
      
      expect(major.length).toBeGreaterThan(0);
      major.forEach((vp) => {
        expect(vp.severity).toBe(VitalPointSeverity.MAJOR);
      });
    });

    it("should filter MINOR vital points if any exist", () => {
      const minor = getVitalPointsBySeverity(VitalPointSeverity.MINOR);
      
      minor.forEach((vp) => {
        expect(vp.severity).toBe(VitalPointSeverity.MINOR);
      });
    });

    it("should return different results for different severities", () => {
      const critical = getVitalPointsBySeverity(VitalPointSeverity.CRITICAL);
      const major = getVitalPointsBySeverity(VitalPointSeverity.MAJOR);
      
      expect(critical.length).not.toBe(major.length);
    });

    it("should return empty array for non-existent severity", () => {
      const result = getVitalPointsBySeverity("NON_EXISTENT" as VitalPointSeverity);
      expect(result).toEqual([]);
    });
  });

  describe("data integrity", () => {
    it("should have valid base damage values", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        if (vp.baseDamage !== undefined) {
          expect(vp.baseDamage).toBeGreaterThan(0);
        }
      });
    });

    it("should have valid damage ranges", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        if (vp.damage) {
          expect(vp.damage.min).toBeLessThanOrEqual(vp.damage.max);
          expect(vp.damage.average).toBeGreaterThanOrEqual(vp.damage.min);
          expect(vp.damage.average).toBeLessThanOrEqual(vp.damage.max);
        }
      });
    });

    it("should have valid radius values", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        if (vp.radius !== undefined) {
          expect(vp.radius).toBeGreaterThan(0);
        }
      });
    });

    it("should have valid required force values", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        if (vp.requiredForce !== undefined) {
          expect(vp.requiredForce).toBeGreaterThan(0);
        }
      });
    });

    it("should have critical vital points with higher damage", () => {
      const critical = getVitalPointsBySeverity(VitalPointSeverity.CRITICAL);
      const major = getVitalPointsBySeverity(VitalPointSeverity.MAJOR);
      
      if (critical.length > 0 && major.length > 0) {
        const avgCriticalDamage = critical.reduce((sum, vp) => sum + (vp.baseDamage || 0), 0) / critical.length;
        const avgMajorDamage = major.reduce((sum, vp) => sum + (vp.baseDamage || 0), 0) / major.length;
        
        expect(avgCriticalDamage).toBeGreaterThanOrEqual(avgMajorDamage);
      }
    });
  });
});
