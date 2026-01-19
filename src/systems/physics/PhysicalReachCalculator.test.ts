/**
 * Unit tests for PhysicalReachCalculator
 *
 * Tests biomechanics-accurate reach calculations including:
 * - Body pivot contribution for kicks (0.25m)
 * - Archetype-specific limb lengths
 * - Animation timing and reach multipliers
 * - Stance modifiers from Eight Trigrams
 */

import { PhysicalAttributes } from "@/types";
import { TrigramStance } from "@/types/common";
import { describe, expect, it } from "vitest";
import { AnimationType } from "../animation";
import {
  PhysicalReachCalculator,
  physicalReachCalculator,
} from "./PhysicalReachCalculator";

describe("PhysicalReachCalculator", () => {
  const calculator = new PhysicalReachCalculator();

  // Test archetype physical attributes
  const AMSALJA_PHYSICAL: PhysicalAttributes = {
    weight: 75,
    legLength: 102, // cm - longest legs
    armLength: 82, // cm
    shoulderWidth: 46,
    hipWidth: 38,
    torsoLength: 55,
    neckLength: 13,
  };

  const HACKER_PHYSICAL: PhysicalAttributes = {
    weight: 65,
    legLength: 92, // cm - shorter legs
    armLength: 73, // cm - shorter arms
    shoulderWidth: 42,
    hipWidth: 34,
    torsoLength: 50,
    neckLength: 12,
  };

  describe("Body Pivot Contribution", () => {
    it("should add 0.25m body pivot for kicks", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32, // Peak time for roundhouse
        TrigramStance.GEON, // Heaven stance
      );

      // Base leg: 1.02m, Body pivot: 0.25m, Total: 1.27m
      expect(result.baseLimbLength).toBe(1.02);
      expect(result.bodyPivotContribution).toBe(0.25);
    });

    it("should add 0.25m body pivot for front kicks", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        0.25, // Peak time for front kick
        TrigramStance.GEON,
      );

      expect(result.bodyPivotContribution).toBe(0.25);
    });

    it("should add 0.25m body pivot for knee strikes", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.KNEE_STRIKE,
        0.2, // Peak time for knee
        TrigramStance.GEON,
      );

      expect(result.bodyPivotContribution).toBe(0.25);
    });

    it("should add shoulder offset for punches", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.JAB,
        0.15, // Peak time for jab
        TrigramStance.GEON,
      );

      expect(result.baseLimbLength).toBe(0.82); // Arm length in meters
      // Shoulder offset = 46cm/2 = 0.23m + torso rotation 0.1m = 0.33m
      expect(result.bodyPivotContribution).toBeCloseTo(0.33, 2);
    });

    it("should add shoulder offset for crosses", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.CROSS,
        0.2, // Peak time for cross
        TrigramStance.GEON,
      );

      // Shoulder offset = 46cm/2 = 0.23m + torso rotation 0.1m = 0.33m
      expect(result.bodyPivotContribution).toBeCloseTo(0.33, 2);
    });

    it("should add shoulder offset for hooks", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.HOOK,
        0.25, // Peak time for hook
        TrigramStance.GEON,
      );

      // Shoulder offset = 46cm/2 = 0.23m + torso rotation 0.1m = 0.33m
      expect(result.bodyPivotContribution).toBeCloseTo(0.33, 2);
    });
  });

  describe("Archetype Physical Differences", () => {
    it("should calculate different reaches for different archetypes (kicks)", () => {
      const amsaljaKick = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.GEON,
      );

      const hackerKick = calculator.calculateReach(
        HACKER_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.GEON,
      );

      // Amsalja has 102cm legs vs Hacker's 92cm legs
      expect(amsaljaKick.effectiveReach).toBeGreaterThan(
        hackerKick.effectiveReach,
      );
      expect(amsaljaKick.baseLimbLength).toBe(1.02);
      expect(hackerKick.baseLimbLength).toBe(0.92);
    });

    it("should calculate different reaches for different archetypes (punches)", () => {
      const amsaljaJab = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.JAB,
        0.15,
        TrigramStance.GEON,
      );

      const hackerJab = calculator.calculateReach(
        HACKER_PHYSICAL,
        AnimationType.JAB,
        0.15,
        TrigramStance.GEON,
      );

      // Amsalja has 82cm arms vs Hacker's 73cm arms
      expect(amsaljaJab.effectiveReach).toBeGreaterThan(
        hackerJab.effectiveReach,
      );
      expect(amsaljaJab.baseLimbLength).toBe(0.82);
      expect(hackerJab.baseLimbLength).toBe(0.73);
    });
  });

  describe("Stance Modifiers", () => {
    it("should apply Li (Fire) stance 1.2x reach modifier", () => {
      const taeKick = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.TAE, // Lake stance - 1.0x (neutral)
      );

      const liKick = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.LI,
      );

      // Li stance should increase reach
      expect(liKick.stanceModifier).toBe(1.2);
      expect(taeKick.stanceModifier).toBe(1.0);
      expect(liKick.effectiveReach).toBeGreaterThan(taeKick.effectiveReach);
      // Li is 1.2x vs Tae's 1.0x = 20% increase
      expect(liKick.effectiveReach / taeKick.effectiveReach).toBeCloseTo(
        1.2,
        2,
      );
    });

    it("should apply Gan (Mountain) stance 0.9x reach modifier", () => {
      const taeKick = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.TAE, // Lake stance - 1.0x (neutral)
      );

      const ganKick = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.GAN,
      );

      // Gan stance should decrease reach by 10%
      expect(ganKick.stanceModifier).toBe(0.9);
      expect(ganKick.effectiveReach).toBeLessThan(taeKick.effectiveReach);
    });
  });

  describe("Documented Examples", () => {
    it("should match documentation example for Amsalja roundhouse kick (Li stance)", () => {
      // From PhysicalReachCalculator.ts line 140:
      // Result: (1.02m base leg + 0.25m pivot) × 1.05 (animation) × 1.20 (stance) ≈ 1.60m
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32, // Peak time
        TrigramStance.LI,
      );

      // Verify individual components
      expect(result.baseLimbLength).toBe(1.02); // 102cm → 1.02m
      expect(result.bodyPivotContribution).toBe(0.25);
      expect(result.stanceModifier).toBe(1.2); // Li stance

      // Verify final calculation
      // (1.02 + 0.25) × animationMultiplier × 1.2 ≈ 1.60
      expect(result.effectiveReach).toBeCloseTo(1.6, 1);
    });

    it("should match documentation example for Amsalja jab (with shoulder offset)", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.JAB,
        0.15, // Peak time
        TrigramStance.GEON,
      );

      // Arm length + shoulder offset + torso rotation
      expect(result.baseLimbLength).toBe(0.82); // 82cm → 0.82m
      expect(result.bodyPivotContribution).toBeCloseTo(0.33, 2); // Shoulder offset + rotation

      // Final reach should be realistic punch distance (~1.0-1.2m)
      expect(result.effectiveReach).toBeGreaterThan(1.0);
      expect(result.effectiveReach).toBeLessThan(1.3);
    });
  });

  describe("calculateMaxReach", () => {
    it("should return maximum possible reach for a technique", () => {
      const maxReach = calculator.calculateMaxReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        TrigramStance.LI,
      );

      // Should use peak extension multiplier
      expect(maxReach).toBeGreaterThan(1.5);
      expect(maxReach).toBeCloseTo(1.6, 1);
    });

    it("should return lower max reach for punches than kicks", () => {
      const kickReach = calculator.calculateMaxReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        TrigramStance.GEON,
      );

      const punchReach = calculator.calculateMaxReach(
        AMSALJA_PHYSICAL,
        AnimationType.JAB,
        TrigramStance.GEON,
      );

      expect(kickReach).toBeGreaterThan(punchReach);
    });
  });

  describe("Edge Cases", () => {
    it("should handle chamber phase with minimal reach", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.05, // Very early in chamber - some extension starting
        TrigramStance.GEON,
      );

      // At early chamber, should have minimal reach
      expect(result.effectiveReach).toBeGreaterThanOrEqual(0);
      expect(result.effectiveReach).toBeLessThan(
        (result.baseLimbLength + result.bodyPivotContribution) * 0.5, // Less than half full extension
      );
    });

    it("should handle retraction phase", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.6, // Late in animation - retraction
        TrigramStance.GEON,
      );

      // Retraction should have lower reach than peak
      const peakResult = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32, // Peak
        TrigramStance.GEON,
      );

      expect(result.effectiveReach).toBeLessThan(peakResult.effectiveReach);
    });

    it("should handle extreme stance modifiers", () => {
      // Even with extreme modifiers, reach should remain positive
      const result = calculator.calculateReach(
        HACKER_PHYSICAL,
        AnimationType.JAB,
        0.15,
        TrigramStance.GAN, // 0.9x modifier
      );

      expect(result.effectiveReach).toBeGreaterThan(0);
      expect(result.effectiveReach).toBeLessThan(2.0); // Reasonable upper bound
    });
  });

  describe("Singleton Instance", () => {
    it("should export a singleton instance", () => {
      expect(physicalReachCalculator).toBeInstanceOf(PhysicalReachCalculator);
    });

    it("should produce consistent results across calls", () => {
      const result1 = physicalReachCalculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.LI,
      );

      const result2 = physicalReachCalculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32,
        TrigramStance.LI,
      );

      expect(result1.effectiveReach).toBe(result2.effectiveReach);
    });
  });

  describe("Real-World Validation", () => {
    it("should produce realistic kick reach values (1.2-1.7m range)", () => {
      // Test all archetypes with roundhouse kick in Geon stance
      const archetypes = [
        {
          name: "Hacker",
          attrs: HACKER_PHYSICAL,
          expectedMin: 1.2,
          expectedMax: 1.4,
        },
        {
          name: "Amsalja",
          attrs: AMSALJA_PHYSICAL,
          expectedMin: 1.3,
          expectedMax: 1.5,
        },
      ];

      archetypes.forEach(({ name: _name, attrs, expectedMin, expectedMax }) => {
        const result = calculator.calculateReach(
          attrs,
          AnimationType.ROUNDHOUSE_KICK,
          0.32,
          TrigramStance.GEON,
        );

        expect(result.effectiveReach).toBeGreaterThanOrEqual(expectedMin);
        expect(result.effectiveReach).toBeLessThanOrEqual(expectedMax);
      });
    });

    it("should produce realistic punch reach values (1.0-1.3m range with shoulder offset)", () => {
      // With shoulder offset (~0.33m), realistic punch reach from body center is:
      // Arm length (0.73-0.82m) + shoulder offset + rotation (0.33m) × animation multiplier (0.95)
      const archetypes = [
        {
          name: "Hacker",
          attrs: HACKER_PHYSICAL,
          expectedMin: 0.95,
          expectedMax: 1.15,
        },
        {
          name: "Amsalja",
          attrs: AMSALJA_PHYSICAL,
          expectedMin: 1.0,
          expectedMax: 1.25,
        },
      ];

      archetypes.forEach(({ name: _name, attrs, expectedMin, expectedMax }) => {
        const result = calculator.calculateReach(
          attrs,
          AnimationType.JAB,
          0.15,
          TrigramStance.GEON,
        );

        expect(result.effectiveReach).toBeGreaterThanOrEqual(expectedMin);
        expect(result.effectiveReach).toBeLessThanOrEqual(expectedMax);
      });
    });
  });
});
