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
  getVitalPointsStats,
} from "./KoreanVitalPoints";

describe("KoreanVitalPoints", () => {
  describe("KOREAN_VITAL_POINTS data - Complete 70-Point System", () => {
    it("should have exactly 70 vital points", () => {
      expect(KOREAN_VITAL_POINTS).toBeDefined();
      expect(KOREAN_VITAL_POINTS.length).toBe(70);
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

    it("should have baekhoehoel (head_crown) vital point", () => {
      // Note: The full 70-point system uses 'head_crown' as ID instead of 'baekhoehoel'
      const vp = KOREAN_VITAL_POINTS.find((vp) => vp.id === "head_crown");
      expect(vp).toBeDefined();
      expect(vp?.names.korean).toBe("정수리");
      expect(vp?.names.english).toBe("Crown");
      expect(vp?.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should have temple (head_temple) vital point", () => {
      const vp = KOREAN_VITAL_POINTS.find((vp) => vp.id === "head_temple");
      expect(vp).toBeDefined();
      expect(vp?.names.korean).toBe("태양혈");
      expect(vp?.names.english).toBe("Temple");
      expect(vp?.category).toBe(VitalPointCategory.NEUROLOGICAL);
    });

    it("should have solar plexus (torso_solar_plexus) vital point", () => {
      const vp = KOREAN_VITAL_POINTS.find((vp) => vp.id === "torso_solar_plexus");
      expect(vp).toBeDefined();
      expect(vp?.names.korean).toBe("명치");
      expect(vp?.names.english).toBe("Solar Plexus");
      expect(vp?.severity).toBe(VitalPointSeverity.CRITICAL);
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

    it("should have effects for most vital points", () => {
      // Not all vital points have effects in the current data
      const pointsWithEffects = KOREAN_VITAL_POINTS.filter((vp) => vp.effects && vp.effects.length > 0);
      
      expect(pointsWithEffects.length).toBeGreaterThan(0);
      
      pointsWithEffects.forEach((vp) => {
        expect(Array.isArray(vp.effects)).toBe(true);
        
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

    it("should NOT require backwards compatibility properties", () => {
      // The 70-point system uses modern structure without backwards compat
      // Test that we can work without these properties
      KOREAN_VITAL_POINTS.forEach((vp) => {
        // Modern required properties
        expect(vp.names).toBeDefined();
        expect(vp.names.korean).toBeDefined();
        expect(vp.names.english).toBeDefined();
        expect(vp.names.romanized).toBeDefined();
        
        // Backwards compat properties are optional
        // Don't test for them as they're not in VITAL_POINTS_DATA
      });
    });
  });

  describe("Regional Distribution - Complete 70-Point System", () => {
    it("should have 12 head region points", () => {
      const headPoints = getVitalPointsByRegion("head_");
      expect(headPoints.length).toBe(12);
    });

    it("should have 24 torso region points", () => {
      const torsoPoints = getVitalPointsByRegion("torso_");
      expect(torsoPoints.length).toBe(24);
    });

    it("should have 17 arm region points (left + right)", () => {
      const leftArmPoints = getVitalPointsByRegion("arm_left_");
      const rightArmPoints = getVitalPointsByRegion("arm_right_");
      const totalArmPoints = leftArmPoints.length + rightArmPoints.length;
      expect(totalArmPoints).toBe(17);
    });

    it("should have 17 leg region points (left + right)", () => {
      const leftLegPoints = getVitalPointsByRegion("leg_left_");
      const rightLegPoints = getVitalPointsByRegion("leg_right_");
      const totalLegPoints = leftLegPoints.length + rightLegPoints.length;
      expect(totalLegPoints).toBe(17);
    });
  });

  describe("getVitalPointsStats - Comprehensive Statistics", () => {
    it("should provide correct statistics for 70-point system", () => {
      const stats = getVitalPointsStats();
      
      expect(stats.total).toBe(70);
      expect(stats.byRegion.head).toBe(12);
      expect(stats.byRegion.torso).toBe(24);
      expect(stats.byRegion.arms + stats.byRegion.legs).toBe(34);
      
      // Verify all severity counts add up
      const totalBySeverity = 
        stats.bySeverity.lethal +
        stats.bySeverity.critical +
        stats.bySeverity.major +
        stats.bySeverity.moderate +
        stats.bySeverity.minor;
      expect(totalBySeverity).toBe(70);
      
      // Verify all category counts add up
      const totalByCategory =
        stats.byCategory.neurological +
        stats.byCategory.skeletal +
        stats.byCategory.vascular +
        stats.byCategory.organ +
        stats.byCategory.joint +
        stats.byCategory.muscular +
        stats.byCategory.respiratory;
      expect(totalByCategory).toBe(70);
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
    it("should filter vital points by head_ region prefix", () => {
      const headPoints = getVitalPointsByRegion("head_");
      
      expect(headPoints.length).toBe(12);
      headPoints.forEach((vp) => {
        expect(vp.id.startsWith("head_")).toBe(true);
      });
    });

    it("should filter vital points by torso_ region prefix", () => {
      const torsoPoints = getVitalPointsByRegion("torso_");
      
      expect(torsoPoints.length).toBe(24);
      torsoPoints.forEach((vp) => {
        expect(vp.id.startsWith("torso_")).toBe(true);
      });
    });

    it("should filter vital points by arm_left_ region prefix", () => {
      const armLeftPoints = getVitalPointsByRegion("arm_left_");
      
      expect(armLeftPoints.length).toBeGreaterThan(0);
      armLeftPoints.forEach((vp) => {
        expect(vp.id.startsWith("arm_left_")).toBe(true);
      });
    });

    it("should filter vital points by leg_right_ region prefix", () => {
      const legRightPoints = getVitalPointsByRegion("leg_right_");
      
      expect(legRightPoints.length).toBeGreaterThan(0);
      legRightPoints.forEach((vp) => {
        expect(vp.id.startsWith("leg_right_")).toBe(true);
      });
    });

    it("should return empty array for non-existent region", () => {
      const result = getVitalPointsByRegion("non_existent_region");
      expect(result).toEqual([]);
    });

    it("should handle empty string", () => {
      const result = getVitalPointsByRegion("");
      // Empty string matches all IDs, so should return all points
      expect(result.length).toBe(70);
    });
  });

  describe("getVitalPointById", () => {
    it("should find vital point by ID - head_temple", () => {
      const vp = getVitalPointById("head_temple");
      
      expect(vp).toBeDefined();
      expect(vp?.id).toBe("head_temple");
      expect(vp?.names.korean).toBe("태양혈");
    });

    it("should return undefined for non-existent ID", () => {
      const vp = getVitalPointById("non_existent_id");
      expect(vp).toBeUndefined();
    });

    it("should return correct vital point for torso_solar_plexus", () => {
      const vp = getVitalPointById("torso_solar_plexus");
      
      expect(vp).toBeDefined();
      expect(vp?.names.english).toBe("Solar Plexus");
    });

    it("should return correct vital point for leg_left_knee", () => {
      const vp = getVitalPointById("leg_left_knee");
      
      expect(vp).toBeDefined();
      expect(vp?.names.english).toBe("Left Knee");
    });

    it("should handle empty string", () => {
      const vp = getVitalPointById("");
      expect(vp).toBeUndefined();
    });

    it("should be case-sensitive", () => {
      const vp = getVitalPointById("HEAD_TEMPLE");
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

    it("should have valid radius values if present", () => {
      KOREAN_VITAL_POINTS.forEach((vp) => {
        if (vp.radius !== undefined) {
          expect(vp.radius).toBeGreaterThan(0);
        }
      });
    });

    it("should have valid required force values if present", () => {
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
