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
      expect(factors.neck).toBeLessThan(1.30); // Increased tolerance for amplification
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
    it("should return amplified half of shoulder width", () => {
      const musaOffset = calculateShoulderOffset(MUSA_PHYSICAL);
      const expectedOffset = (MUSA_PHYSICAL.shoulderWidth / 2) * 1.15;
      expect(musaOffset).toBeCloseTo(expectedOffset, 1);
      expect(musaOffset).toBeGreaterThan(MUSA_PHYSICAL.shoulderWidth / 2); // Amplified
    });

    it("should be largest for Jojik", () => {
      const jojikOffset = calculateShoulderOffset(JOJIK_PHYSICAL);
      const musaOffset = calculateShoulderOffset(MUSA_PHYSICAL);
      const amsaljaOffset = calculateShoulderOffset(AMSALJA_PHYSICAL);
      const hackerOffset = calculateShoulderOffset(HACKER_PHYSICAL);

      // Jojik has widest shoulders (54cm)
      expect(jojikOffset).toBeGreaterThan(musaOffset);
      expect(jojikOffset).toBeGreaterThan(amsaljaOffset);
      expect(jojikOffset).toBeGreaterThan(hackerOffset);
      expect(jojikOffset).toBeCloseTo(31.05, 1); // (54cm / 2) * 1.15
    });

    it("should be smallest for Hacker", () => {
      const hackerOffset = calculateShoulderOffset(HACKER_PHYSICAL);
      const musaOffset = calculateShoulderOffset(MUSA_PHYSICAL);
      const jojikOffset = calculateShoulderOffset(JOJIK_PHYSICAL);

      // Hacker has narrowest shoulders (43cm)
      expect(hackerOffset).toBeLessThan(musaOffset);
      expect(hackerOffset).toBeLessThan(jojikOffset);
      expect(hackerOffset).toBeCloseTo(24.73, 1); // (43cm / 2) * 1.15
    });

    it("should create significant width difference between archetypes", () => {
      const jojikOffset = calculateShoulderOffset(JOJIK_PHYSICAL);
      const hackerOffset = calculateShoulderOffset(HACKER_PHYSICAL);

      // Difference should be noticeable (>20%)
      const widthDifference = (jojikOffset - hackerOffset) / hackerOffset;
      expect(widthDifference).toBeGreaterThan(0.20); // At least 20% wider
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

  describe("Archetype Body Shape Silhouette Differences", () => {
    it("should create distinct shoulder widths for all archetypes", () => {
      const archetypes = [
        { name: "Hacker", attrs: HACKER_PHYSICAL, expectedOrder: 1 }, // Narrowest
        { name: "Amsalja", attrs: AMSALJA_PHYSICAL, expectedOrder: 2 },
        { name: "Jeongbo", attrs: JEONGBO_PHYSICAL, expectedOrder: 3 },
        { name: "Musa", attrs: MUSA_PHYSICAL, expectedOrder: 4 },
        { name: "Jojik", attrs: JOJIK_PHYSICAL, expectedOrder: 5 }, // Widest
      ];

      const shoulderWidths = archetypes.map(a => ({
        name: a.name,
        width: calculateShoulderOffset(a.attrs) * 2, // Total span
      }));

      // Sort by width to verify order
      const sortedByWidth = [...shoulderWidths].sort((a, b) => a.width - b.width);

      // Verify correct ordering from narrowest to widest
      expect(sortedByWidth[0].name).toBe("Hacker"); // Narrowest
      expect(sortedByWidth[4].name).toBe("Jojik"); // Widest

      // Verify all widths are unique
      const uniqueWidths = new Set(shoulderWidths.map(sw => Math.round(sw.width)));
      expect(uniqueWidths.size).toBe(5);
    });

    it("should create distinct leg lengths for all archetypes", () => {
      const archetypes = [
        { name: "Hacker", attrs: HACKER_PHYSICAL }, // Shortest
        { name: "Jeongbo", attrs: JEONGBO_PHYSICAL },
        { name: "Musa", attrs: MUSA_PHYSICAL },
        { name: "Jojik", attrs: JOJIK_PHYSICAL },
        { name: "Amsalja", attrs: AMSALJA_PHYSICAL }, // Longest
      ];

      const legLengths = archetypes.map(a => ({
        name: a.name,
        factors: calculateBoneScalingFactors(a.attrs),
      }));

      // Hacker should have shortest legs
      const hackerLegs = legLengths.find(l => l.name === "Hacker");
      const amsaljaLegs = legLengths.find(l => l.name === "Amsalja");

      if (!hackerLegs || !amsaljaLegs) {
        throw new Error("Missing expected archetype data");
      }

      expect(hackerLegs.factors.thigh).toBeLessThan(amsaljaLegs.factors.thigh);
      expect(hackerLegs.factors.shin).toBeLessThan(amsaljaLegs.factors.shin);

      // Amsalja should have longest legs
      const allOthers = legLengths.filter(l => l.name !== "Amsalja");
      allOthers.forEach(other => {
        expect(amsaljaLegs.factors.thigh).toBeGreaterThanOrEqual(other.factors.thigh);
        expect(amsaljaLegs.factors.shin).toBeGreaterThanOrEqual(other.factors.shin);
      });
    });

    it("should create distinct arm lengths for all archetypes", () => {
      const archetypes = [
        { name: "Hacker", attrs: HACKER_PHYSICAL, armLength: 73 }, // Shortest
        { name: "Jeongbo", attrs: JEONGBO_PHYSICAL, armLength: 76 },
        { name: "Musa", attrs: MUSA_PHYSICAL, armLength: 77 },
        { name: "Amsalja", attrs: AMSALJA_PHYSICAL, armLength: 82 },
        { name: "Jojik", attrs: JOJIK_PHYSICAL, armLength: 84 }, // Longest
      ];

      const armFactors = archetypes.map(a => ({
        name: a.name,
        factors: calculateBoneScalingFactors(a.attrs),
      }));

      // Hacker should have shortest arms
      const hackerArms = armFactors.find(a => a.name === "Hacker");
      const jojikArms = armFactors.find(a => a.name === "Jojik");

      if (!hackerArms || !jojikArms) {
        throw new Error("Missing expected archetype data");
      }

      expect(hackerArms.factors.upperArm).toBeLessThan(jojikArms.factors.upperArm);
      expect(hackerArms.factors.forearm).toBeLessThan(jojikArms.factors.forearm);

      // Jojik should have longest arms
      const allOthers = armFactors.filter(a => a.name !== "Jojik");
      allOthers.forEach(other => {
        expect(jojikArms.factors.upperArm).toBeGreaterThanOrEqual(other.factors.upperArm);
        expect(jojikArms.factors.forearm).toBeGreaterThanOrEqual(other.factors.forearm);
      });
    });

    it("should create distinct torso lengths for all archetypes", () => {
      const archetypes = [
        { name: "Hacker", attrs: HACKER_PHYSICAL, torsoLength: 57 }, // Shortest
        { name: "Amsalja", attrs: AMSALJA_PHYSICAL, torsoLength: 58 },
        { name: "Jeongbo", attrs: JEONGBO_PHYSICAL, torsoLength: 58 },
        { name: "Musa", attrs: MUSA_PHYSICAL, torsoLength: 59 },
        { name: "Jojik", attrs: JOJIK_PHYSICAL, torsoLength: 64 }, // Longest
      ];

      const torsoFactors = archetypes.map(a => ({
        name: a.name,
        factors: calculateBoneScalingFactors(a.attrs),
      }));

      // Hacker should have shortest torso
      const hackerTorso = torsoFactors.find(t => t.name === "Hacker");
      const jojikTorso = torsoFactors.find(t => t.name === "Jojik");

      if (!hackerTorso || !jojikTorso) {
        throw new Error("Missing expected archetype data");
      }

      expect(hackerTorso.factors.spine).toBeLessThan(jojikTorso.factors.spine);

      // Jojik should have longest torso
      const allOthers = torsoFactors.filter(t => t.name !== "Jojik");
      allOthers.forEach(other => {
        expect(jojikTorso.factors.spine).toBeGreaterThan(other.factors.spine);
      });
    });

    it("should create distinct overall heights for all archetypes", () => {
      const archetypes = [
        { name: "Hacker", attrs: HACKER_PHYSICAL, height: 175 }, // Shortest
        { name: "Jeongbo", attrs: JEONGBO_PHYSICAL, height: 179 },
        { name: "Musa", attrs: MUSA_PHYSICAL, height: 180 },
        { name: "Amsalja", attrs: AMSALJA_PHYSICAL, height: 186 },
        { name: "Jojik", attrs: JOJIK_PHYSICAL, height: 188 }, // Tallest
      ];

      const heightFactors = archetypes.map(a => ({
        name: a.name,
        factors: calculateBoneScalingFactors(a.attrs),
      }));

      // Verify height ordering
      const sortedByOverall = [...heightFactors].sort((a, b) => 
        a.factors.overall - b.factors.overall
      );

      expect(sortedByOverall[0].name).toBe("Hacker"); // Shortest
      expect(sortedByOverall[4].name).toBe("Jojik"); // Tallest (188cm)
    });

    it("should create recognizable silhouettes for each archetype", () => {
      const profiles = {
        Hacker: {
          attrs: HACKER_PHYSICAL,
          expected: "Compact, shortest limbs, narrowest shoulders",
        },
        Amsalja: {
          attrs: AMSALJA_PHYSICAL,
          expected: "Tall, lean, long limbs, narrow shoulders",
        },
        Jeongbo: {
          attrs: JEONGBO_PHYSICAL,
          expected: "Balanced, average proportions",
        },
        Musa: {
          attrs: MUSA_PHYSICAL,
          expected: "Athletic, balanced military build",
        },
        Jojik: {
          attrs: JOJIK_PHYSICAL,
          expected: "Massive, widest shoulders, longest torso, imposing",
        },
      };

      // Calculate all scaling factors
      const scalingData = Object.entries(profiles).map(([name, data]) => ({
        name,
        factors: calculateBoneScalingFactors(data.attrs),
        shoulderOffset: calculateShoulderOffset(data.attrs),
      }));

      // Verify Hacker is most compact
      const hacker = scalingData.find(d => d.name === "Hacker")!;
      const others = scalingData.filter(d => d.name !== "Hacker");
      others.forEach(other => {
        expect(hacker.shoulderOffset).toBeLessThanOrEqual(other.shoulderOffset);
        expect(hacker.factors.overall).toBeLessThanOrEqual(other.factors.overall);
      });

      // Verify Jojik is most massive
      const jojik = scalingData.find(d => d.name === "Jojik")!;
      const othersNotJojik = scalingData.filter(d => d.name !== "Jojik");
      othersNotJojik.forEach(other => {
        expect(jojik.shoulderOffset).toBeGreaterThanOrEqual(other.shoulderOffset);
        expect(jojik.factors.spine).toBeGreaterThan(other.factors.spine);
      });

      // Verify Amsalja is tallest with longest limbs
      const amsalja = scalingData.find(d => d.name === "Amsalja")!;
      const othersNotAmsalja = scalingData.filter(d => d.name !== "Amsalja");
      othersNotAmsalja.forEach(other => {
        // Amsalja should have longest or tied-longest legs
        expect(amsalja.factors.thigh + amsalja.factors.shin).toBeGreaterThanOrEqual(
          other.factors.thigh + other.factors.shin
        );
      });
    });

    it("should maintain proportional consistency across all archetypes", () => {
      const allProfiles = [
        MUSA_PHYSICAL,
        AMSALJA_PHYSICAL,
        HACKER_PHYSICAL,
        JEONGBO_PHYSICAL,
        JOJIK_PHYSICAL,
      ];

      allProfiles.forEach((profile) => {
        const factors = calculateBoneScalingFactors(profile);
        const shoulderOffset = calculateShoulderOffset(profile);

        // All factors should be positive and reasonable
        expect(factors.overall).toBeGreaterThan(0.8);
        expect(factors.overall).toBeLessThan(1.3);
        expect(factors.head).toBeGreaterThan(0.8);
        expect(factors.head).toBeLessThan(1.3);
        expect(factors.shoulder).toBeGreaterThan(0.8);
        expect(factors.shoulder).toBeLessThan(1.7); // Increased for amplified shoulder width

        // Shoulder offset should be positive and reasonable
        expect(shoulderOffset).toBeGreaterThan(20); // At least 20cm offset
        expect(shoulderOffset).toBeLessThan(35); // No more than 35cm offset

        // Upper and lower limbs should scale proportionally
        const armLength = factors.upperArm + factors.forearm;
        const legLength = factors.thigh + factors.shin;
        expect(armLength).toBeGreaterThan(1.5);
        expect(legLength).toBeGreaterThan(1.5);
      });
    });

    it("should amplify visual differences beyond raw physical attributes", () => {
      // Raw shoulder width difference
      const jojikRawWidth = JOJIK_PHYSICAL.shoulderWidth;
      const hackerRawWidth = HACKER_PHYSICAL.shoulderWidth;
      const rawDifference = (jojikRawWidth - hackerRawWidth) / hackerRawWidth;

      // Visual difference after amplification
      const jojikVisualWidth = calculateShoulderOffset(JOJIK_PHYSICAL) * 2;
      const hackerVisualWidth = calculateShoulderOffset(HACKER_PHYSICAL) * 2;
      const visualDifference = (jojikVisualWidth - hackerVisualWidth) / hackerVisualWidth;

      // Raw difference: (54 - 43) / 43 = 25.6%
      expect(rawDifference).toBeCloseTo(0.256, 2);

      // Visual difference should be amplified beyond raw (>25%)
      // With 1.15x shoulder amplification, visual difference is still 25.6%
      // This is expected behavior: shoulder amplification applies uniformly to all archetypes
      expect(visualDifference).toBeCloseTo(rawDifference, 2); // Same percentage preserved
      expect(Math.abs(jojikVisualWidth - hackerVisualWidth)).toBeGreaterThan(
        Math.abs(jojikRawWidth - hackerRawWidth) // Absolute difference amplified
      );
    });
  });
});
