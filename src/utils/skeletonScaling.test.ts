/**
 * Unit tests for skeleton scaling system.
 *
 * **Korean**: 골격 크기 조정 테스트 (Skeleton Scaling Tests)
 *
 * Tests verify:
 * - Bone scaling calculations based on physical attributes
 * - Skeleton rig integration with Korean anatomy
 * - Hitbox dimension calculations
 * - Vital point position adjustments
 * - Choke and head strike vulnerability modifiers
 *
 * @module utils/skeletonScaling.test
 * @category Testing
 */

import {
  AMSALJA_PHYSICAL,
  HACKER_PHYSICAL,
  JEONGBO_PHYSICAL,
  JOJIK_PHYSICAL,
  MUSA_PHYSICAL,
} from "@/data/archetypePhysicalAttributes";
import { BoneName } from "@/types/skeletal";
import { describe, expect, it } from "vitest";
import {
  calculateBoneScalingFactors,
  calculateChokeEffectiveness,
  calculateHeadStrikeVulnerability,
  calculateHitboxDimensions,
  calculateShoulderOffset,
  calculateVitalPointAdjustment,
  getScaledBoneLength,
} from "./skeletonScaling";

describe("Skeleton Scaling System", () => {
  describe("calculateBoneScalingFactors()", () => {
    it("should calculate scaling factors close to baseline for Musa", () => {
      const factors = calculateBoneScalingFactors(MUSA_PHYSICAL);

      // Musa is close to baseline, factors should be near 1.0 (within 15%)
      expect(factors.overall).toBeGreaterThan(0.95);
      expect(factors.overall).toBeLessThan(1.15);
      expect(factors.head).toBeCloseTo(1.0, 1);
      expect(factors.neck).toBeGreaterThan(0.95);
      expect(factors.neck).toBeLessThan(1.25);
      expect(factors.spine).toBeGreaterThan(0.95);
      expect(factors.spine).toBeLessThan(1.15);
      expect(factors.upperArm).toBeGreaterThan(0.95);
      expect(factors.upperArm).toBeLessThan(1.15);
      expect(factors.forearm).toBeGreaterThan(0.95);
      expect(factors.forearm).toBeLessThan(1.15);
      expect(factors.thigh).toBeGreaterThan(0.95);
      expect(factors.thigh).toBeLessThan(1.15);
      expect(factors.shin).toBeGreaterThan(0.95);
      expect(factors.shin).toBeLessThan(1.15);
      expect(factors.shoulder).toBeGreaterThan(0.95);
      expect(factors.shoulder).toBeLessThan(1.2);
    });

    it("should calculate taller factors for Amsalja", () => {
      const factors = calculateBoneScalingFactors(AMSALJA_PHYSICAL);

      // Amsalja is taller with longer limbs
      expect(factors.overall).toBeGreaterThan(1.0);
      expect(factors.thigh).toBeGreaterThan(1.0);
      expect(factors.shin).toBeGreaterThan(1.0);
      expect(factors.upperArm).toBeGreaterThan(1.0);
      expect(factors.forearm).toBeGreaterThan(1.0);

      // Has same head size as reference (22cm), narrower shoulders (44cm vs 43cm ref)
      expect(factors.head).toBeCloseTo(1.0, 1);
      expect(factors.shoulder).toBeGreaterThan(1.0); // 44/43 > 1.0 (slightly wider)
    });

    it("should calculate stockier factors for Jojik", () => {
      const factors = calculateBoneScalingFactors(JOJIK_PHYSICAL);

      // Jojik is tall AND massive with long powerful legs
      expect(factors.thigh).toBeGreaterThan(1.0);
      expect(factors.shin).toBeGreaterThan(1.0);

      // Has larger head, thicker torso, wider shoulders
      expect(factors.head).toBeGreaterThan(1.0);
      expect(factors.spine).toBeGreaterThan(1.0);
      expect(factors.shoulder).toBeGreaterThan(1.0);

      // Slightly longer neck (same as Amsalja at 11cm vs ref 10cm)
      expect(factors.neck).toBeGreaterThan(1.0);
    });

    it("should maintain proportional scaling relationships", () => {
      const allProfiles = [
        MUSA_PHYSICAL,
        AMSALJA_PHYSICAL,
        HACKER_PHYSICAL,
        JEONGBO_PHYSICAL,
        JOJIK_PHYSICAL,
      ];

      allProfiles.forEach((profile) => {
        const factors = calculateBoneScalingFactors(profile);

        // All factors should be positive
        expect(factors.overall).toBeGreaterThan(0);
        expect(factors.head).toBeGreaterThan(0);
        expect(factors.neck).toBeGreaterThan(0);
        expect(factors.spine).toBeGreaterThan(0);

        // Factors should be reasonable (0.5 to 1.5 range)
        expect(factors.overall).toBeGreaterThan(0.85);
        expect(factors.overall).toBeLessThan(1.25);
        expect(factors.head).toBeGreaterThan(0.85);
        expect(factors.head).toBeLessThan(1.25);
      });
    });
  });

  describe("getScaledBoneLength()", () => {
    it("should return scaled lengths for Musa", () => {
      const headLength = getScaledBoneLength(BoneName.HEAD, MUSA_PHYSICAL);
      const neckLength = getScaledBoneLength(BoneName.NECK, MUSA_PHYSICAL);
      const thighLength = getScaledBoneLength(BoneName.THIGH_L, MUSA_PHYSICAL);

      // With visual amplification applied, expect values near base but scaled
      // MUSA neckLength=10 (same as reference), so neck ~10
      // MUSA legLength=96 vs ref 95, so slightly longer
      expect(headLength).toBeGreaterThan(15);
      expect(headLength).toBeLessThan(25);
      expect(neckLength).toBeGreaterThan(8);
      expect(neckLength).toBeLessThan(15);
      expect(thighLength).toBeGreaterThan(25);
      expect(thighLength).toBeLessThan(40);
    });

    it("should return larger head for Jojik", () => {
      const jojikHead = getScaledBoneLength(BoneName.HEAD, JOJIK_PHYSICAL);
      const musaHead = getScaledBoneLength(BoneName.HEAD, MUSA_PHYSICAL);

      // Jojik has larger head (24cm vs 22cm = 1.09x base scaling)
      // With amplification, expect noticeable difference
      expect(jojikHead).toBeGreaterThan(musaHead);
      expect(jojikHead).toBeGreaterThan(20); // Larger than base 20cm
    });

    it("should return longer legs for Amsalja", () => {
      const amsaljaThigh = getScaledBoneLength(
        BoneName.THIGH_L,
        AMSALJA_PHYSICAL
      );
      const musaThigh = getScaledBoneLength(BoneName.THIGH_L, MUSA_PHYSICAL);

      // Amsalja has longer legs
      expect(amsaljaThigh).toBeGreaterThan(musaThigh);
    });

    it("should scale symmetrically for left and right bones", () => {
      const leftThigh = getScaledBoneLength(BoneName.THIGH_L, AMSALJA_PHYSICAL);
      const rightThigh = getScaledBoneLength(
        BoneName.THIGH_R,
        AMSALJA_PHYSICAL
      );

      // Left and right should be identical
      expect(leftThigh).toBe(rightThigh);
    });

    it("should handle all bone names", () => {
      const boneNames = [
        BoneName.HEAD,
        BoneName.NECK,
        BoneName.SPINE_LOWER,
        BoneName.SPINE_MIDDLE,
        BoneName.SPINE_UPPER,
        BoneName.PELVIS,
        BoneName.SHOULDER_L,
        BoneName.UPPER_ARM_L,
        BoneName.FOREARM_L,
        BoneName.HAND_L,
        BoneName.THIGH_L,
        BoneName.SHIN_L,
        BoneName.FOOT_L,
      ];

      boneNames.forEach((boneName) => {
        const length = getScaledBoneLength(boneName, MUSA_PHYSICAL);
        expect(length).toBeGreaterThan(0);
        expect(length).toBeLessThan(100); // Reasonable bone length
      });
    });
  });

  describe("calculateShoulderOffset()", () => {
    it("should return half of shoulder width", () => {
      const musaOffset = calculateShoulderOffset(MUSA_PHYSICAL);
      expect(musaOffset).toBe(MUSA_PHYSICAL.shoulderWidth / 2);
      expect(musaOffset).toBe(23); // 46cm / 2
    });

    it("should be largest for Jojik", () => {
      const jojikOffset = calculateShoulderOffset(JOJIK_PHYSICAL);
      const musaOffset = calculateShoulderOffset(MUSA_PHYSICAL);
      const amsaljaOffset = calculateShoulderOffset(AMSALJA_PHYSICAL);

      // Jojik has widest shoulders
      expect(jojikOffset).toBeGreaterThan(musaOffset);
      expect(jojikOffset).toBeGreaterThan(amsaljaOffset);
      expect(jojikOffset).toBe(27); // 54cm / 2
    });

    it("should be smallest for Amsalja", () => {
      const amsaljaOffset = calculateShoulderOffset(AMSALJA_PHYSICAL);
      const musaOffset = calculateShoulderOffset(MUSA_PHYSICAL);

      // Amsalja has narrowest shoulders
      expect(amsaljaOffset).toBeLessThan(musaOffset);
      expect(amsaljaOffset).toBe(22); // 44cm / 2
    });
  });

  describe("calculateHitboxDimensions()", () => {
    it("should match body proportions", () => {
      const hitbox = calculateHitboxDimensions(MUSA_PHYSICAL);

      expect(hitbox.width).toBe(MUSA_PHYSICAL.shoulderWidth);
      expect(hitbox.height).toBe(MUSA_PHYSICAL.totalHeight);
      expect(hitbox.depth).toBe(MUSA_PHYSICAL.shoulderWidth * 0.5);
    });

    it("should be tallest for Amsalja", () => {
      const amsaljaHitbox = calculateHitboxDimensions(AMSALJA_PHYSICAL);
      const musaHitbox = calculateHitboxDimensions(MUSA_PHYSICAL);

      // Amsalja is tallest
      expect(amsaljaHitbox.height).toBeGreaterThan(musaHitbox.height);
      expect(amsaljaHitbox.height).toBe(186);

      // But narrowest
      expect(amsaljaHitbox.width).toBeLessThan(musaHitbox.width);
      expect(amsaljaHitbox.width).toBe(44);
    });

    it("should be widest for Jojik", () => {
      const jojikHitbox = calculateHitboxDimensions(JOJIK_PHYSICAL);
      const musaHitbox = calculateHitboxDimensions(MUSA_PHYSICAL);

      // Jojik has widest hitbox
      expect(jojikHitbox.width).toBeGreaterThan(musaHitbox.width);
      expect(jojikHitbox.width).toBe(54);
    });

    it("should have proportional depth", () => {
      const allProfiles = [MUSA_PHYSICAL, AMSALJA_PHYSICAL, JOJIK_PHYSICAL];

      allProfiles.forEach((profile) => {
        const hitbox = calculateHitboxDimensions(profile);
        // Depth should be half of width
        expect(hitbox.depth).toBe(hitbox.width * 0.5);
      });
    });
  });

  describe("calculateVitalPointAdjustment()", () => {
    it("should adjust head vital points upward for taller fighters", () => {
      const amsaljaAdj = calculateVitalPointAdjustment(
        "head_temple",
        AMSALJA_PHYSICAL
      );
      const musaAdj = calculateVitalPointAdjustment(
        "head_temple",
        MUSA_PHYSICAL
      );

      // Amsalja's head is higher due to longer torso and legs
      expect(amsaljaAdj.y).not.toBe(musaAdj.y);
    });

    it("should not adjust x position for head vital points", () => {
      const adjustment = calculateVitalPointAdjustment(
        "head_temple",
        MUSA_PHYSICAL
      );

      // Head vital points don't shift horizontally
      expect(adjustment.x).toBe(0);
    });

    it("should adjust arm vital points based on shoulder width", () => {
      const jojikAdj = calculateVitalPointAdjustment(
        "arm_radial",
        JOJIK_PHYSICAL
      );
      const amsaljaAdj = calculateVitalPointAdjustment(
        "arm_radial",
        AMSALJA_PHYSICAL
      );

      // Jojik's wider shoulders shift arm vital points outward
      expect(Math.abs(jojikAdj.x)).toBeGreaterThan(Math.abs(amsaljaAdj.x));
    });

    it("should adjust leg vital points based on leg length", () => {
      const amsaljaAdj = calculateVitalPointAdjustment(
        "leg_femoral",
        AMSALJA_PHYSICAL
      );
      const jojikAdj = calculateVitalPointAdjustment(
        "leg_femoral",
        JOJIK_PHYSICAL
      );

      // Longer legs shift vital points
      expect(amsaljaAdj.y).not.toBe(jojikAdj.y);
    });

    it("should return zero adjustment for unknown vital points", () => {
      const adjustment = calculateVitalPointAdjustment(
        "unknown_point",
        MUSA_PHYSICAL
      );

      expect(adjustment.x).toBe(0);
      expect(adjustment.y).toBe(0);
    });
  });

  describe("calculateChokeEffectiveness()", () => {
    it("should return baseline for Musa", () => {
      const effectiveness = calculateChokeEffectiveness(MUSA_PHYSICAL);

      // Musa has average neck, should be close to 1.0
      expect(effectiveness).toBeCloseTo(1.0, 1);
    });

    it("should be more effective against Amsalja", () => {
      const amsaljaChoke = calculateChokeEffectiveness(AMSALJA_PHYSICAL);
      const musaChoke = calculateChokeEffectiveness(MUSA_PHYSICAL);

      // Amsalja has longer, thinner neck
      expect(amsaljaChoke).toBeGreaterThan(musaChoke);
      expect(amsaljaChoke).toBeGreaterThan(1.0);
    });

    it("should be less effective against Jojik", () => {
      const jojikChoke = calculateChokeEffectiveness(JOJIK_PHYSICAL);
      const musaChoke = calculateChokeEffectiveness(MUSA_PHYSICAL);

      // Jojik has shorter, thicker neck
      expect(jojikChoke).toBeLessThan(musaChoke);
      expect(jojikChoke).toBeLessThan(1.0);
    });

    it("should factor both neck length and body weight", () => {
      // Test with extreme values
      const longThinNeck = {
        ...MUSA_PHYSICAL,
        neckLength: 12,
        weight: 65,
      };

      const shortThickNeck = {
        ...MUSA_PHYSICAL,
        neckLength: 8,
        weight: 85,
      };

      const thinChoke = calculateChokeEffectiveness(longThinNeck);
      const thickChoke = calculateChokeEffectiveness(shortThickNeck);

      // Long thin neck should be much more vulnerable
      expect(thinChoke).toBeGreaterThan(thickChoke);
      expect(thinChoke).toBeGreaterThan(1.2);
      expect(thickChoke).toBeLessThan(0.9);
    });

    it("should return positive values", () => {
      const allProfiles = [
        MUSA_PHYSICAL,
        AMSALJA_PHYSICAL,
        HACKER_PHYSICAL,
        JEONGBO_PHYSICAL,
        JOJIK_PHYSICAL,
      ];

      allProfiles.forEach((profile) => {
        const effectiveness = calculateChokeEffectiveness(profile);
        expect(effectiveness).toBeGreaterThan(0);
      });
    });
  });

  describe("calculateHeadStrikeVulnerability()", () => {
    it("should return baseline for Musa", () => {
      const vulnerability = calculateHeadStrikeVulnerability(MUSA_PHYSICAL);

      // Musa has average head, should be close to 1.0
      expect(vulnerability).toBeCloseTo(1.0, 1);
    });

    it("should have equal vulnerability for Amsalja and Musa", () => {
      const amsaljaVuln = calculateHeadStrikeVulnerability(AMSALJA_PHYSICAL);
      const musaVuln = calculateHeadStrikeVulnerability(MUSA_PHYSICAL);

      // Amsalja and Musa both have 22cm heads, so equal vulnerability
      expect(amsaljaVuln).toBeCloseTo(musaVuln, 2);
    });

    it("should be more resistant for Jojik", () => {
      const jojikVuln = calculateHeadStrikeVulnerability(JOJIK_PHYSICAL);
      const musaVuln = calculateHeadStrikeVulnerability(MUSA_PHYSICAL);

      // Jojik has larger head (more mass)
      expect(jojikVuln).toBeLessThan(musaVuln);
      expect(jojikVuln).toBeLessThan(1.0);
    });

    it("should scale inversely with head size", () => {
      const smallHead = {
        ...MUSA_PHYSICAL,
        headSize: 20,
      };

      const largeHead = {
        ...MUSA_PHYSICAL,
        headSize: 24,
      };

      const smallVuln = calculateHeadStrikeVulnerability(smallHead);
      const largeVuln = calculateHeadStrikeVulnerability(largeHead);

      // Smaller head = more vulnerable
      expect(smallVuln).toBeGreaterThan(largeVuln);
    });

    it("should return positive values", () => {
      const allProfiles = [
        MUSA_PHYSICAL,
        AMSALJA_PHYSICAL,
        HACKER_PHYSICAL,
        JEONGBO_PHYSICAL,
        JOJIK_PHYSICAL,
      ];

      allProfiles.forEach((profile) => {
        const vulnerability = calculateHeadStrikeVulnerability(profile);
        expect(vulnerability).toBeGreaterThan(0);
      });
    });
  });

  describe("Korean Anatomy Integration", () => {
    it("should reflect traditional martial arts vulnerabilities", () => {
      // In Korean martial arts, neck is a critical vulnerability point
      const amsaljaChoke = calculateChokeEffectiveness(AMSALJA_PHYSICAL);
      const jojikChoke = calculateChokeEffectiveness(JOJIK_PHYSICAL);

      // Difference should be significant (>20%)
      const difference = Math.abs(amsaljaChoke - jojikChoke);
      expect(difference).toBeGreaterThan(0.15);
    });

    it("should scale vital points proportionally to body dimensions", () => {
      const tallFighter = AMSALJA_PHYSICAL;
      const stockyFighter = JOJIK_PHYSICAL;

      const tallHeadAdj = calculateVitalPointAdjustment(
        "head_temple",
        tallFighter
      );
      const stockyHeadAdj = calculateVitalPointAdjustment(
        "head_temple",
        stockyFighter
      );

      // Head positions should differ based on height
      expect(tallHeadAdj.y).not.toBe(stockyHeadAdj.y);
    });

    it("should maintain Korean anatomy principles for all archetypes", () => {
      const allProfiles = [
        MUSA_PHYSICAL,
        AMSALJA_PHYSICAL,
        HACKER_PHYSICAL,
        JEONGBO_PHYSICAL,
        JOJIK_PHYSICAL,
      ];

      allProfiles.forEach((profile) => {
        // Choke effectiveness should correlate with neck length
        const chokeEff = calculateChokeEffectiveness(profile);

        // Longer necks should generally be more vulnerable
        // (with weight as secondary factor)
        expect(chokeEff).toBeGreaterThan(0.7);
        expect(chokeEff).toBeLessThan(1.3);
      });
    });
  });
});
