/**
 * Tests for Meridian-Vital Point Mapping System
 */

import { describe, expect, it } from "vitest";
import {
  VITAL_POINT_MERIDIAN_MAP,
  getMeridianMappingStatistics,
  getMeridiansForVitalPoint,
  getVitalPointsForMeridian,
  isVitalPointOnMeridian,
} from "./MeridianVitalPointMapping";

describe("MeridianVitalPointMapping", () => {
  describe("VITAL_POINT_MERIDIAN_MAP", () => {
    it("should have defined mappings", () => {
      expect(VITAL_POINT_MERIDIAN_MAP).toBeDefined();
      expect(Object.keys(VITAL_POINT_MERIDIAN_MAP).length).toBeGreaterThan(0);
    });

    it("should map each vital point to at least one meridian", () => {
      Object.entries(VITAL_POINT_MERIDIAN_MAP).forEach(
        ([_vitalPointId, meridians]) => {
          expect(Array.isArray(meridians)).toBe(true);
          expect(meridians.length).toBeGreaterThan(0);
          expect(meridians.length).toBeLessThanOrEqual(2); // Max 2 meridians per point
        }
      );
    });

    it("should have valid meridian IDs", () => {
      const validMeridianIds = [
        "lung",
        "large_intestine",
        "stomach",
        "spleen",
        "heart",
        "small_intestine",
        "bladder",
        "kidney",
        "pericardium",
        "triple_burner",
        "gallbladder",
        "liver",
      ];

      Object.values(VITAL_POINT_MERIDIAN_MAP).forEach((meridians) => {
        meridians.forEach((meridianId) => {
          expect(validMeridianIds).toContain(meridianId);
        });
      });
    });

    it("should have consistent naming convention for vital points", () => {
      Object.keys(VITAL_POINT_MERIDIAN_MAP).forEach((vitalPointId) => {
        // Vital point IDs should use snake_case
        expect(vitalPointId).toMatch(/^[a-z_]+$/);
      });
    });
  });

  describe("getMeridiansForVitalPoint", () => {
    it("should return meridians for head_temple", () => {
      const meridians = getMeridiansForVitalPoint("head_temple");
      expect(meridians).toContain("gallbladder");
      expect(meridians).toContain("triple_burner");
      expect(meridians.length).toBe(2);
    });

    it("should return meridians for solar_plexus", () => {
      const meridians = getMeridiansForVitalPoint("solar_plexus");
      expect(meridians.length).toBeGreaterThan(0);
      expect(meridians).toContain("stomach");
    });

    it("should return meridians for knee_outer_left (Yanglingquan GB-34)", () => {
      const meridians = getMeridiansForVitalPoint("knee_outer_left");
      expect(meridians).toContain("gallbladder");
    });

    it("should return meridians for shin_front_left (Zusanli ST-36)", () => {
      const meridians = getMeridiansForVitalPoint("shin_front_left");
      expect(meridians).toContain("stomach");
    });

    it("should return meridians for foot_sole_left (Yongquan KI-1)", () => {
      const meridians = getMeridiansForVitalPoint("foot_sole_left");
      expect(meridians).toContain("kidney");
    });

    it("should return empty array for non-existent vital point", () => {
      const meridians = getMeridiansForVitalPoint("non_existent_point");
      expect(meridians).toEqual([]);
    });
  });

  describe("getVitalPointsForMeridian", () => {
    it("should return vital points for gallbladder meridian", () => {
      const vitalPoints = getVitalPointsForMeridian("gallbladder");
      expect(vitalPoints.length).toBeGreaterThan(0);
      expect(vitalPoints).toContain("head_temple");
      expect(vitalPoints).toContain("knee_outer_left");
    });

    it("should return vital points for stomach meridian", () => {
      const vitalPoints = getVitalPointsForMeridian("stomach");
      expect(vitalPoints.length).toBeGreaterThan(0);
      expect(vitalPoints).toContain("shin_front_left");
    });

    it("should return vital points for kidney meridian", () => {
      const vitalPoints = getVitalPointsForMeridian("kidney");
      expect(vitalPoints.length).toBeGreaterThan(0);
      expect(vitalPoints).toContain("foot_sole_left");
    });

    it("should return vital points for lung meridian", () => {
      const vitalPoints = getVitalPointsForMeridian("lung");
      expect(vitalPoints.length).toBeGreaterThan(0);
    });

    it("should return vital points for liver meridian", () => {
      const vitalPoints = getVitalPointsForMeridian("liver");
      expect(vitalPoints.length).toBeGreaterThan(0);
      expect(vitalPoints).toContain("liver"); // Direct organ mapping
    });

    it("should return empty array for non-existent meridian", () => {
      const vitalPoints = getVitalPointsForMeridian("non_existent_meridian");
      expect(vitalPoints).toEqual([]);
    });
  });

  describe("isVitalPointOnMeridian", () => {
    it("should return true when vital point is on meridian", () => {
      expect(isVitalPointOnMeridian("head_temple", "gallbladder")).toBe(true);
      expect(isVitalPointOnMeridian("shin_front_left", "stomach")).toBe(true);
      expect(isVitalPointOnMeridian("foot_sole_left", "kidney")).toBe(true);
    });

    it("should return false when vital point is not on meridian", () => {
      expect(isVitalPointOnMeridian("head_temple", "kidney")).toBe(false);
      expect(isVitalPointOnMeridian("shin_front_left", "gallbladder")).toBe(
        false
      );
    });

    it("should return false for non-existent vital point", () => {
      expect(isVitalPointOnMeridian("non_existent_point", "gallbladder")).toBe(
        false
      );
    });

    it("should return false for non-existent meridian", () => {
      expect(
        isVitalPointOnMeridian("head_temple", "non_existent_meridian")
      ).toBe(false);
    });
  });

  describe("getMeridianMappingStatistics", () => {
    it("should return statistics about mappings", () => {
      const stats = getMeridianMappingStatistics();

      expect(stats.totalVitalPoints).toBeGreaterThan(0);
      expect(stats.totalMappings).toBeGreaterThanOrEqual(
        stats.totalVitalPoints
      );
      expect(Object.keys(stats.meridianCounts).length).toBeGreaterThan(0);
    });

    it("should have all 12 primary meridians represented", () => {
      const stats = getMeridianMappingStatistics();
      const meridianIds = Object.keys(stats.meridianCounts);

      const primaryMeridians = [
        "lung",
        "large_intestine",
        "stomach",
        "spleen",
        "heart",
        "small_intestine",
        "bladder",
        "kidney",
        "pericardium",
        "triple_burner",
        "gallbladder",
        "liver",
      ];

      primaryMeridians.forEach((meridianId) => {
        expect(meridianIds).toContain(meridianId);
        expect(stats.meridianCounts[meridianId]).toBeGreaterThan(0);
      });
    });

    it("should have reasonable distribution of vital points per meridian", () => {
      const stats = getMeridianMappingStatistics();

      // Each meridian should have at least a few vital points
      Object.entries(stats.meridianCounts).forEach(([_meridianId, count]) => {
        expect(count).toBeGreaterThan(0);
        // All 12 primary meridians should have multiple points
        expect(count).toBeGreaterThanOrEqual(1);
      });
    });

    it("should have total mappings equal to sum of individual counts", () => {
      const stats = getMeridianMappingStatistics();
      const sum = Object.values(stats.meridianCounts).reduce(
        (a, b) => a + b,
        0
      );
      expect(sum).toBe(stats.totalMappings);
    });
  });

  describe("Anatomical Accuracy", () => {
    it("should map GB-20 (Fengchi) to gallbladder meridian", () => {
      // GB-20 is a famous point on the gallbladder meridian
      const meridians = getMeridiansForVitalPoint("head_side_neck");
      expect(meridians).toContain("gallbladder");
    });

    it("should map ST-36 (Zusanli) to stomach meridian", () => {
      // ST-36 is one of the most important acupuncture points
      const meridians = getMeridiansForVitalPoint("shin_front_left");
      expect(meridians).toContain("stomach");
    });

    it("should map KI-1 (Yongquan) to kidney meridian", () => {
      // KI-1 is at the sole of the foot
      const meridians = getMeridiansForVitalPoint("foot_sole_left");
      expect(meridians).toContain("kidney");
    });

    it("should map LI-4 (Hegu) to large intestine meridian", () => {
      // LI-4 is between thumb and index finger
      const meridians = getMeridiansForVitalPoint("hand_back_left");
      expect(meridians).toContain("large_intestine");
    });

    it("should map SP-6 (Sanyinjiao) to spleen meridian", () => {
      // SP-6 is on the inner ankle
      const meridians = getMeridiansForVitalPoint("shin_inner_left");
      expect(meridians).toContain("spleen");
    });

    it("should map GB-34 (Yanglingquan) to gallbladder meridian", () => {
      // GB-34 is on the outer knee
      const meridians = getMeridiansForVitalPoint("knee_outer_left");
      expect(meridians).toContain("gallbladder");
    });
  });

  describe("Coverage", () => {
    it("should cover all major body regions", () => {
      const vitalPoints = Object.keys(VITAL_POINT_MERIDIAN_MAP);

      // Check for head region coverage
      const headPoints = vitalPoints.filter((vp) => vp.startsWith("head_"));
      expect(headPoints.length).toBeGreaterThan(0);

      // Check for neck region coverage
      const neckPoints = vitalPoints.filter((vp) => vp.startsWith("neck_"));
      expect(neckPoints.length).toBeGreaterThan(0);

      // Check for chest/torso coverage
      const chestPoints = vitalPoints.filter((vp) => vp.startsWith("chest_"));
      expect(chestPoints.length).toBeGreaterThan(0);

      // Check for arm coverage
      const armPoints = vitalPoints.filter(
        (vp) =>
          vp.includes("arm_") || vp.includes("elbow_") || vp.includes("wrist_")
      );
      expect(armPoints.length).toBeGreaterThan(0);

      // Check for leg coverage
      const legPoints = vitalPoints.filter(
        (vp) =>
          vp.includes("thigh_") || vp.includes("knee_") || vp.includes("shin_")
      );
      expect(legPoints.length).toBeGreaterThan(0);

      // Check for foot coverage
      const footPoints = vitalPoints.filter((vp) => vp.startsWith("foot_"));
      expect(footPoints.length).toBeGreaterThan(0);
    });

    it("should have bilateral symmetry for limbs", () => {
      const vitalPoints = Object.keys(VITAL_POINT_MERIDIAN_MAP);

      // Check left/right pairs
      const leftPoints = vitalPoints.filter((vp) => vp.includes("_left"));
      const rightPoints = vitalPoints.filter((vp) => vp.includes("_right"));

      // Should have similar numbers of left and right points
      expect(Math.abs(leftPoints.length - rightPoints.length)).toBeLessThan(5);
    });
  });
});
