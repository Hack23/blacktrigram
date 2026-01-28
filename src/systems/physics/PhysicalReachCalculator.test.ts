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

  // Test archetype physical attributes (matching canonical data)
  const AMSALJA_PHYSICAL: PhysicalAttributes = {
    weight: 75,
    legLength: 102, // cm - longest legs
    armLength: 82, // cm - longest arms
    muscleMass: 30, // kg - lean functional muscle
    fatMass: 10, // kg - 13% body fat
    age: 28, // years - peak agility
    totalHeight: 186, // cm - tall for reach
    torsoLength: 58, // cm - compact torso
    headSize: 22, // cm - normal profile
    neckLength: 11, // cm - longer for evasion
    shoulderWidth: 44, // cm - lean athletic
    walkSpeed: 6.5, // m/s - fastest
    runSpeed: 11.0, // m/s - fastest sprint
    acceleration: 15.0, // m/s² - highest explosiveness
  };

  const HACKER_PHYSICAL: PhysicalAttributes = {
    weight: 72,
    legLength: 92, // cm - standard proportions
    armLength: 73, // cm - average reach
    muscleMass: 28, // kg - moderate for tech worker
    fatMass: 15, // kg - 21% body fat
    age: 26, // years - young digital native
    totalHeight: 175, // cm - average height
    torsoLength: 57, // cm - average
    headSize: 22, // cm - average
    neckLength: 10, // cm - average
    shoulderWidth: 43, // cm - average span
    walkSpeed: 5.5, // m/s - average movement
    runSpeed: 8.5, // m/s - moderate sprint
    acceleration: 10.0, // m/s² - moderate explosiveness
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
      // Shoulder offset = 44cm/2 = 0.22m + torso rotation 0.1m = 0.32m
      expect(result.bodyPivotContribution).toBeCloseTo(0.32, 2);
    });

    it("should add shoulder offset for crosses", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.CROSS,
        0.2, // Peak time for cross
        TrigramStance.GEON,
      );

      // Shoulder offset = 44cm/2 = 0.22m + torso rotation 0.1m = 0.32m
      expect(result.bodyPivotContribution).toBeCloseTo(0.32, 2);
    });

    it("should add shoulder offset for hooks", () => {
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.HOOK,
        0.25, // Peak time for hook
        TrigramStance.GEON,
      );

      // Shoulder offset = 44cm/2 = 0.22m + torso rotation 0.1m = 0.32m
      expect(result.bodyPivotContribution).toBeCloseTo(0.32, 2);
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
      expect(result.bodyPivotContribution).toBeCloseTo(0.32, 2); // Shoulder offset (44cm/2=22cm) + rotation (10cm)

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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  describe("Hybrid Reach System (baseExtension)", () => {
    it("should use baseExtension when greater than animation multiplier", () => {
      // Front kick: animationMultiplier = 1.0, baseExtension = 1.05
      const reachConfig = {
        bodyPart: "leg" as const,
        techniqueType: "kick" as const,
        baseExtension: 1.05,
      };

      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        0.27, // Peak time
        TrigramStance.GEON,
        reachConfig,
      );

      // Should use 1.05 (baseExtension) instead of 1.0 (animation multiplier)
      expect(result.baseExtension).toBe(1.05);
      expect(result.animationReachMultiplier).toBe(1.0);
      expect(result.finalExtensionMultiplier).toBe(1.05);

      // Effective reach should be calculated with 1.05
      const expectedReach = (result.baseLimbLength + result.bodyPivotContribution) * 1.05 * result.stanceModifier;
      expect(result.effectiveReach).toBeCloseTo(expectedReach, 2);
    });

    it("should use animation multiplier when greater than baseExtension", () => {
      // Roundhouse kick: animationMultiplier = 1.05, baseExtension = 1.0
      const reachConfig = {
        bodyPart: "leg" as const,
        techniqueType: "kick" as const,
        baseExtension: 1.0,
      };

      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.ROUNDHOUSE_KICK,
        0.32, // Peak time
        TrigramStance.GEON,
        reachConfig,
      );

      // Should use 1.05 (animation multiplier) instead of 1.0 (baseExtension)
      expect(result.baseExtension).toBe(1.0);
      expect(result.animationReachMultiplier).toBe(1.05);
      expect(result.finalExtensionMultiplier).toBe(1.05);

      // Effective reach should be calculated with 1.05
      const expectedReach = (result.baseLimbLength + result.bodyPivotContribution) * 1.05 * result.stanceModifier;
      expect(result.effectiveReach).toBeCloseTo(expectedReach, 2);
    });

    it("should use max of both values for optimal reach", () => {
      // Test with various configurations using correct peak times
      const testCases = [
        { 
          baseExt: 1.15, 
          animation: AnimationType.ROUNDHOUSE_KICK,
          peakTime: 0.32, // ROUNDHOUSE peak
          expected: 1.15, // baseExtension wins
        },
        { 
          baseExt: 1.0, 
          animation: AnimationType.ROUNDHOUSE_KICK,
          peakTime: 0.32, // ROUNDHOUSE peak
          expected: 1.05, // animation wins (1.05 max multiplier)
        },
        { 
          baseExt: 1.05, 
          animation: AnimationType.FRONT_KICK,
          peakTime: 0.27, // FRONT_KICK peak
          expected: 1.05, // baseExtension wins (animation is 1.0)
        },
      ];

      testCases.forEach(({ baseExt, animation, peakTime, expected }) => {
        const reachConfig = {
          bodyPart: "leg" as const,
          techniqueType: "kick" as const,
          baseExtension: baseExt,
        };

        const result = calculator.calculateReach(
          HACKER_PHYSICAL,
          animation,
          peakTime,
          TrigramStance.GEON,
          reachConfig,
        );

        expect(result.finalExtensionMultiplier).toBeCloseTo(expected, 2);
      });
    });

    it("should fallback to animation multiplier when no reachConfig provided", () => {
      // Without reachConfig (backward compatible)
      const result = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        0.27, // Peak time
        TrigramStance.GEON,
        // No reachConfig
      );

      // Should use animation multiplier only
      expect(result.baseExtension).toBeUndefined();
      expect(result.animationReachMultiplier).toBe(1.0);
      expect(result.finalExtensionMultiplier).toBe(1.0);
    });

    it("should apply to calculateMaxReach as well", () => {
      const reachConfig = {
        bodyPart: "leg" as const,
        techniqueType: "kick" as const,
        baseExtension: 1.05,
      };

      // With reachConfig
      const maxReachWithConfig = calculator.calculateMaxReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        TrigramStance.GEON,
        reachConfig,
      );

      // Without reachConfig
      const maxReachWithout = calculator.calculateMaxReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        TrigramStance.GEON,
      );

      // With baseExtension (1.05) should be longer than without (1.0)
      expect(maxReachWithConfig).toBeGreaterThan(maxReachWithout);
      
      // Difference should be exactly 5% (1.05 vs 1.0)
      const expectedDifference = maxReachWithout * 0.05;
      expect(maxReachWithConfig - maxReachWithout).toBeCloseTo(expectedDifference, 2);
    });

    it("should fix front kick reach discrepancy", () => {
      // This test validates the fix for the reported issue:
      // Front kick was designed with baseExtension 1.05 but used 1.0
      const reachConfig = {
        bodyPart: "leg" as const,
        techniqueType: "kick" as const,
        baseExtension: 1.05, // Designed reach from technique definition
      };

      const musaPhysical: PhysicalAttributes = {
        weight: 80,
        legLength: 95,
        armLength: 75,
        muscleMass: 35,
        fatMass: 12,
        age: 30,
        totalHeight: 180,
        torsoLength: 60,
        headSize: 23,
        neckLength: 11,
        shoulderWidth: 46,
        walkSpeed: 6.0,
        runSpeed: 10.0,
        acceleration: 12.0,
      };

      const withConfig = calculator.calculateMaxReach(
        musaPhysical,
        AnimationType.FRONT_KICK,
        TrigramStance.GEON,
        reachConfig,
      );

      const withoutConfig = calculator.calculateMaxReach(
        musaPhysical,
        AnimationType.FRONT_KICK,
        TrigramStance.GEON,
      );

      // Expected reach with baseExtension
      // Leg: 0.95m, Pivot: 0.25m, Extension: 1.05, Stance: 1.1 (GEON)
      // Expected: (0.95 + 0.25) * 1.05 * 1.1 = 1.386m
      expect(withConfig).toBeCloseTo(1.386, 2);

      // Without config should be 5% shorter due to lower extension
      // (0.95 + 0.25) * 1.0 * 1.1 = 1.32m
      expect(withoutConfig).toBeCloseTo(1.32, 2);
      
      // Verify the difference is 5% of base reach
      const difference = withConfig - withoutConfig;
      const expectedDifference = 0.066; // 5% of 1.32m
      expect(difference).toBeCloseTo(expectedDifference, 2);
    });

    it("should maintain reach curve with baseExtension (no phantom hits)", () => {
      // This test verifies that baseExtension doesn't force full reach at the
      // start/end of hit window - reach should still ramp up/down with animation
      const reachConfig = {
        bodyPart: "leg" as const,
        techniqueType: "kick" as const,
        baseExtension: 1.05,
      };

      // FRONT_KICK timing: start=0.15, peak=0.27, end=0.4, maxReachMultiplier=1.0
      // With baseExtension 1.05, peak extension becomes max(1.05, 1.0) = 1.05

      // At start of hit window (0.15s) - reach should be near zero
      const startResult = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        0.15, // Start time
        TrigramStance.GEON,
        reachConfig,
      );

      // At peak (0.27s) - reach should be maximum
      const peakResult = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        0.27, // Peak time
        TrigramStance.GEON,
        reachConfig,
      );

      // At end of hit window (0.4s) - reach should be near zero again
      const endResult = calculator.calculateReach(
        AMSALJA_PHYSICAL,
        AnimationType.FRONT_KICK,
        0.4, // End time
        TrigramStance.GEON,
        reachConfig,
      );

      // Verify reach curve: start and end should be much less than peak
      expect(startResult.effectiveReach).toBeLessThan(peakResult.effectiveReach * 0.5);
      expect(endResult.effectiveReach).toBeLessThan(peakResult.effectiveReach * 0.5);
      
      // Peak should use the designed baseExtension
      expect(peakResult.finalExtensionMultiplier).toBeCloseTo(1.05, 2);
      
      // Start and end should have reduced extension due to curve factor
      expect(startResult.finalExtensionMultiplier).toBeLessThan(1.05);
      expect(endResult.finalExtensionMultiplier).toBeLessThan(1.05);
    });
  });
});
