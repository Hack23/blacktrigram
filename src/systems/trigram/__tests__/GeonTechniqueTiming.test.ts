/**
 * Geon (Heaven) Technique Timing Validation Test
 * 건괘 기술 타이밍 검증 테스트
 *
 * Validates that Geon techniques have proper timing for Taekwondo form visibility:
 * - Execution times increased for better visibility (770-1470ms range)
 * - Animation speeds reduced for clear technique visualization (0.65-0.75x)
 * - Recovery times proportional to execution times
 *
 * @module systems/trigram/__tests__/GeonTechniqueTiming
 */

import { describe, expect, it } from "vitest";
import { GEON_TECHNIQUES } from "../techniques/GeonTechniques";

describe("Geon (Heaven) Technique Timing Validation", () => {
  describe("Execution Time Requirements", () => {
    it("should have execution times in the 770-1470ms range for visibility", () => {
      const MIN_EXECUTION_TIME = 770;
      const MAX_EXECUTION_TIME = 1470;

      GEON_TECHNIQUES.forEach((tech) => {
        expect(
          tech.executionTime,
          `${tech.id} execution time should be between ${MIN_EXECUTION_TIME}-${MAX_EXECUTION_TIME}ms`
        ).toBeGreaterThanOrEqual(MIN_EXECUTION_TIME);
        expect(
          tech.executionTime,
          `${tech.id} execution time should be between ${MIN_EXECUTION_TIME}-${MAX_EXECUTION_TIME}ms`
        ).toBeLessThanOrEqual(MAX_EXECUTION_TIME);
      });
    });

    it("should have specific execution times for each Geon technique", () => {
      const expectedTimings: Record<string, number> = {
        geon_heaven_strike: 1120,
        geon_heavenly_fist: 840,
        geon_frontal_kick: 980,
        geon_roundhouse_kick: 1120,
        geon_axe_kick: 1470,
        geon_palm_strike: 910,
        geon_elbow_smash: 770,
      };

      GEON_TECHNIQUES.forEach((tech) => {
        const expected = expectedTimings[tech.id];
        expect(
          expected,
          `Missing timing data for technique: ${tech.id}. All techniques must be validated.`
        ).toBeDefined();
        expect(
          tech.executionTime,
          `${tech.id} should have execution time of ${expected}ms`
        ).toBe(expected);
      });
    });
  });

  describe("Animation Speed Requirements", () => {
    it("should have animation speeds in the 0.65-0.75x range for visibility", () => {
      const MIN_ANIMATION_SPEED = 0.65;
      const MAX_ANIMATION_SPEED = 0.75;

      GEON_TECHNIQUES.forEach((tech) => {
        expect(
          tech.animationSpeed,
          `${tech.id} animation speed should be between ${MIN_ANIMATION_SPEED}-${MAX_ANIMATION_SPEED}x`
        ).toBeGreaterThanOrEqual(MIN_ANIMATION_SPEED);
        expect(
          tech.animationSpeed,
          `${tech.id} animation speed should be between ${MIN_ANIMATION_SPEED}-${MAX_ANIMATION_SPEED}x`
        ).toBeLessThanOrEqual(MAX_ANIMATION_SPEED);
      });
    });

    it("should have specific animation speeds for each Geon technique", () => {
      const expectedSpeeds: Record<string, number> = {
        geon_heaven_strike: 0.7,
        geon_heavenly_fist: 0.75,
        geon_frontal_kick: 0.7,
        geon_roundhouse_kick: 0.7,
        geon_axe_kick: 0.65,
        geon_palm_strike: 0.7,
        geon_elbow_smash: 0.75,
      };

      GEON_TECHNIQUES.forEach((tech) => {
        const expected = expectedSpeeds[tech.id];
        expect(
          expected,
          `Missing animation speed data for technique: ${tech.id}. All techniques must be validated.`
        ).toBeDefined();
        expect(
          tech.animationSpeed,
          `${tech.id} should have animation speed of ${expected}x`
        ).toBe(expected);
      });
    });
  });

  describe("Recovery Time Requirements", () => {
    it("should have recovery times proportional to execution times", () => {
      // Recovery time should generally be 1.1-1.7x the execution time
      const MIN_RATIO = 1.1;
      const MAX_RATIO = 1.7;

      GEON_TECHNIQUES.forEach((tech) => {
        const ratio = tech.recoveryTime / tech.executionTime;
        expect(
          ratio,
          `${tech.id} recovery ratio (${ratio.toFixed(2)}) should be between ${MIN_RATIO}-${MAX_RATIO}x execution time`
        ).toBeGreaterThanOrEqual(MIN_RATIO);
        expect(
          ratio,
          `${tech.id} recovery ratio (${ratio.toFixed(2)}) should be between ${MIN_RATIO}-${MAX_RATIO}x execution time`
        ).toBeLessThanOrEqual(MAX_RATIO);
      });
    });

    it("should have specific recovery times for each Geon technique", () => {
      const expectedRecovery: Record<string, number> = {
        geon_heaven_strike: 1680,
        geon_heavenly_fist: 1260,
        geon_frontal_kick: 1400,
        geon_roundhouse_kick: 1540,
        geon_axe_kick: 1680,
        geon_palm_strike: 1330,
        geon_elbow_smash: 1190,
      };

      GEON_TECHNIQUES.forEach((tech) => {
        const expected = expectedRecovery[tech.id];
        expect(
          expected,
          `Missing expected recovery time for technique ${tech.id}`
        ).toBeDefined();
        expect(
          tech.recoveryTime,
          `${tech.id} should have recovery time of ${expected}ms`
        ).toBe(expected);
      });
    });
  });

  describe("Overall Timing Balance", () => {
    it("should maintain consistent timing ratios across all techniques", () => {
      // Verify that all techniques follow similar timing patterns
      const ratios = GEON_TECHNIQUES.map((tech) => ({
        id: tech.id,
        recoveryToExecution: tech.recoveryTime / tech.executionTime,
      }));

      // All ratios should be relatively consistent (within 0.3 of each other)
      const recoveryRatios = ratios.map((r) => r.recoveryToExecution);
      const avgRatio =
        recoveryRatios.reduce((sum, r) => sum + r, 0) / recoveryRatios.length;
      const maxDeviation = 0.3;

      ratios.forEach(({ id, recoveryToExecution }) => {
        expect(
          Math.abs(recoveryToExecution - avgRatio),
          `${id} recovery ratio (${recoveryToExecution.toFixed(2)}) should be within ${maxDeviation} of average (${avgRatio.toFixed(2)})`
        ).toBeLessThanOrEqual(maxDeviation);
      });
    });

    it("should have all techniques with improved visibility timings", () => {
      // Verify that no technique is too fast to see
      const MIN_TOTAL_TIME = 1900; // execution + recovery should be at least 1.9 seconds

      GEON_TECHNIQUES.forEach((tech) => {
        const totalTime = tech.executionTime + tech.recoveryTime;
        expect(
          totalTime,
          `${tech.id} total time (${totalTime}ms) should be at least ${MIN_TOTAL_TIME}ms for visibility`
        ).toBeGreaterThanOrEqual(MIN_TOTAL_TIME);
      });
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should have proper timing for Taekwondo form visualization", () => {
      // Slower execution and animation speeds allow for:
      // - Chamber positions (준비 동작) to be visible
      // - Hip rotation to be apparent
      // - Follow-through (마무리) to be clear

      GEON_TECHNIQUES.forEach((tech) => {
        // Execution time should be long enough to show form (>750ms minimum)
        expect(
          tech.executionTime,
          `${tech.id} execution time should allow form visualization`
        ).toBeGreaterThanOrEqual(750);

        // Animation speed should be slow enough to see details (<0.8x)
        expect(
          tech.animationSpeed,
          `${tech.id} animation speed should allow detail visualization`
        ).toBeLessThanOrEqual(0.8);
      });
    });
  });
});
