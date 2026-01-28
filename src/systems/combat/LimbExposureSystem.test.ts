/**
 * Tests for Limb Exposure System
 *
 * Validates counter-attack opportunity detection, vulnerability calculations,
 * and breaking technique mechanics.
 *
 * @module systems/combat/__tests__/LimbExposureSystem.test
 */

import { describe, it, expect } from "vitest";
import {
  calculateCounterOpportunity,
  calculateVulnerabilityMultiplier,
  determineExposedLimb,
  mapLimbToBreakingTarget,
  calculateBreakingResult,
  canExecuteCounter,
  generateLimbExposureWindow,
} from "./LimbExposureSystem";
import type { KoreanTechnique } from "../vitalpoint/types";
import { TrigramStance } from "../../types/common";

/**
 * Create a test technique with exposure configuration
 */
function createTestTechnique(
  overrides: Partial<KoreanTechnique> = {}
): KoreanTechnique {
  return {
    id: "test_technique",
    name: {
      korean: "테스트 기술",
      english: "Test Technique",
      romanized: "Test",
    },
    koreanName: "테스트 기술",
    englishName: "Test Technique",
    romanized: "Test",
    description: {
      korean: "테스트용",
      english: "For testing",
    },
    stance: TrigramStance.GEON,
    type: "strike",
    damageType: "blunt",
    damage: 30,
    kiCost: 15,
    staminaCost: 20,
    accuracy: 0.8,
    reachConfig: {
      bodyPart: "arm",
      techniqueType: "punch",
      baseExtension: 0.95,
      exposureWindow: {
        exposedLimb: "right_arm",
        startTime: 0.4,
        duration: 300,
        vulnerabilityMultiplier: 1.5,
        allowsBreaking: false,
      },
    },
    executionTime: 800,
    recoveryTime: 1200,
    critChance: 0.1,
    critMultiplier: 1.5,
    effects: [],
    category: "medium",
    range: "short",
    speed: 1.0,
    ...overrides,
  };
}

describe("LimbExposureSystem", () => {
  describe("calculateCounterOpportunity", () => {
    it("should return undefined when no exposure window is defined", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.9,
          // No exposureWindow
        },
      });

      const result = calculateCounterOpportunity(technique, 400);
      expect(result).toBeUndefined();
    });

    it("should return undefined when current time is before exposure window", () => {
      const technique = createTestTechnique();
      const beforeWindow = technique.executionTime * 0.4 - 100;

      const result = calculateCounterOpportunity(technique, beforeWindow);
      expect(result).toBeUndefined();
    });

    it("should return undefined when current time is after exposure window", () => {
      const technique = createTestTechnique();
      const afterWindow = technique.executionTime * 0.4 + 400;

      const result = calculateCounterOpportunity(technique, afterWindow);
      expect(result).toBeUndefined();
    });

    it("should return counter opportunity during exposure window", () => {
      const technique = createTestTechnique();
      const duringWindow = technique.executionTime * 0.4 + 100;

      const result = calculateCounterOpportunity(technique, duringWindow);

      expect(result).toBeDefined();
      expect(result?.exposedLimb).toBe("right_arm");
      expect(result?.vulnerabilityMultiplier).toBe(1.5);
      expect(result?.allowsBreaking).toBe(false);
      expect(result?.windowStart).toBe(320); // 800 * 0.4
      expect(result?.windowDuration).toBe(300);
    });

    it("should recommend breaking techniques for kick exposures", () => {
      const kickTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.1,
          exposureWindow: {
            exposedLimb: "right_leg",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.2,
            allowsBreaking: true,
          },
        },
      });

      const result = calculateCounterOpportunity(
        kickTechnique,
        kickTechnique.executionTime * 0.5 + 100
      );

      expect(result).toBeDefined();
      expect(result?.recommendedCounters).toContain("leg_sweep");
      expect(result?.recommendedCounters).toContain("ankle_break");
    });

    it("should recommend joint locks for arm exposures with breaking", () => {
      const punchTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.95,
          exposureWindow: {
            exposedLimb: "right_arm",
            startTime: 0.4,
            duration: 300,
            vulnerabilityMultiplier: 1.8,
            allowsBreaking: true,
          },
        },
      });

      const result = calculateCounterOpportunity(
        punchTechnique,
        punchTechnique.executionTime * 0.4 + 100
      );

      expect(result).toBeDefined();
      expect(result?.recommendedCounters).toContain("arm_bar");
      expect(result?.recommendedCounters).toContain("elbow_break");
    });
  });

  describe("calculateVulnerabilityMultiplier", () => {
    it("should return baseline vulnerability when no exposure window", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "elbow",
          baseExtension: 0.5,
        },
      });

      const multiplier = calculateVulnerabilityMultiplier(technique, 400);
      expect(multiplier).toBe(1.0);
    });

    it("should return slight vulnerability during wind-up", () => {
      const technique = createTestTechnique();
      const windUpTime = 100; // Before exposure starts

      const multiplier = calculateVulnerabilityMultiplier(
        technique,
        windUpTime
      );
      expect(multiplier).toBe(1.1);
    });

    it("should return max vulnerability during exposure window", () => {
      const technique = createTestTechnique();
      const duringExposure = technique.executionTime * 0.4 + 100;

      const multiplier = calculateVulnerabilityMultiplier(
        technique,
        duringExposure
      );
      expect(multiplier).toBe(1.5); // From exposureWindow
    });

    it("should decrease vulnerability during recovery phase", () => {
      const technique = createTestTechnique();
      const midRecovery = technique.executionTime + technique.recoveryTime / 2;

      const multiplier = calculateVulnerabilityMultiplier(
        technique,
        midRecovery
      );

      // Should be between 1.0 and max vulnerability
      expect(multiplier).toBeGreaterThan(1.0);
      expect(multiplier).toBeLessThan(1.5);
    });

    it("should return baseline after recovery completes", () => {
      const technique = createTestTechnique();
      const afterRecovery =
        technique.executionTime + technique.recoveryTime + 100;

      const multiplier = calculateVulnerabilityMultiplier(
        technique,
        afterRecovery
      );
      expect(multiplier).toBe(1.0);
    });
  });

  describe("determineExposedLimb", () => {
    it("should use explicit exposure window limb when defined", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.1,
          exposureWindow: {
            exposedLimb: "left_leg",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.0,
            allowsBreaking: true,
          },
        },
      });

      const limb = determineExposedLimb(technique);
      expect(limb).toBe("left_leg");
    });

    it("should infer right arm for right-sided punch", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.95,
        },
      });

      const limb = determineExposedLimb(technique, false);
      expect(limb).toBe("right_arm");
    });

    it("should infer left leg for left-sided kick", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.1,
        },
      });

      const limb = determineExposedLimb(technique, true);
      expect(limb).toBe("left_leg");
    });

    it("should expose elbow for medium extension arm strikes", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.6,
        },
      });

      const limb = determineExposedLimb(technique);
      expect(limb).toBe("right_elbow");
    });

    it("should expose knee for medium extension leg techniques", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 0.8,
        },
      });

      const limb = determineExposedLimb(technique);
      expect(limb).toBe("right_knee");
    });
  });

  describe("mapLimbToBreakingTarget", () => {
    it("should map ankle limbs to ankle target", () => {
      expect(mapLimbToBreakingTarget("left_ankle")).toBe("ankle");
      expect(mapLimbToBreakingTarget("right_ankle")).toBe("ankle");
    });

    it("should map knee limbs to knee target", () => {
      expect(mapLimbToBreakingTarget("left_knee")).toBe("knee");
      expect(mapLimbToBreakingTarget("right_knee")).toBe("knee");
    });

    it("should map elbow limbs to elbow target", () => {
      expect(mapLimbToBreakingTarget("left_elbow")).toBe("elbow");
      expect(mapLimbToBreakingTarget("right_elbow")).toBe("elbow");
    });

    it("should map wrist limbs to wrist target", () => {
      expect(mapLimbToBreakingTarget("left_wrist")).toBe("wrist");
      expect(mapLimbToBreakingTarget("right_wrist")).toBe("wrist");
    });

    it("should default leg to knee target", () => {
      expect(mapLimbToBreakingTarget("left_leg")).toBe("knee");
      expect(mapLimbToBreakingTarget("right_leg")).toBe("knee");
    });

    it("should default arm to elbow target", () => {
      expect(mapLimbToBreakingTarget("left_arm")).toBe("elbow");
      expect(mapLimbToBreakingTarget("right_arm")).toBe("elbow");
    });
  });

  describe("calculateBreakingResult", () => {
    it("should fail when breaking is not allowed", () => {
      const technique = createTestTechnique();
      const opportunity = {
        exposedLimb: "right_arm" as const,
        windowStart: 320,
        windowDuration: 300,
        vulnerabilityMultiplier: 1.5,
        allowsBreaking: false,
      };

      const result = calculateBreakingResult(technique, opportunity, 50);

      expect(result.success).toBe(false);
      expect(result.severity).toBe(0);
      expect(result.mobilityReduction).toBe(0);
      expect(result.statusEffects).toEqual([]);
    });

    it("should fail when force is too low", () => {
      const technique = createTestTechnique();
      const opportunity = {
        exposedLimb: "right_leg" as const,
        windowStart: 400,
        windowDuration: 400,
        vulnerabilityMultiplier: 2.0,
        allowsBreaking: true,
      };

      const result = calculateBreakingResult(technique, opportunity, 15);

      expect(result.success).toBe(false);
      expect(result.severity).toBe(0);
    });

    it("should succeed with moderate force and vulnerability", () => {
      const technique = createTestTechnique();
      const opportunity = {
        exposedLimb: "right_knee" as const,
        windowStart: 400,
        windowDuration: 400,
        vulnerabilityMultiplier: 2.0,
        allowsBreaking: true,
      };

      const result = calculateBreakingResult(technique, opportunity, 30);

      expect(result.success).toBe(true);
      expect(result.target).toBe("knee");
      expect(result.severity).toBeGreaterThan(0);
      expect(result.statusEffects).toContain("pain");
    });

    it("should apply severe injury effects for high severity breaks", () => {
      const technique = createTestTechnique();
      const opportunity = {
        exposedLimb: "right_ankle" as const,
        windowStart: 400,
        windowDuration: 400,
        vulnerabilityMultiplier: 2.5,
        allowsBreaking: true,
      };

      const result = calculateBreakingResult(technique, opportunity, 50);

      expect(result.success).toBe(true);
      expect(result.severity).toBeGreaterThan(0.8);
      expect(result.statusEffects).toContain("severe_injury");
      expect(result.statusEffects).toContain("disabled_limb");
      expect(result.mobilityReduction).toBeGreaterThanOrEqual(0.6);
    });

    it("should apply bleeding for severe bone breaks", () => {
      const technique = createTestTechnique();
      const opportunity = {
        exposedLimb: "right_knee" as const,
        windowStart: 400,
        windowDuration: 400,
        vulnerabilityMultiplier: 2.0,
        allowsBreaking: true,
      };

      const result = calculateBreakingResult(technique, opportunity, 60);

      expect(result.success).toBe(true);
      expect(result.statusEffects).toContain("bleeding");
    });

    it("should increase mobility reduction for leg breaks", () => {
      const technique = createTestTechnique();
      const legOpportunity = {
        exposedLimb: "right_knee" as const,
        windowStart: 400,
        windowDuration: 400,
        vulnerabilityMultiplier: 2.5,
        allowsBreaking: true,
      };

      const legResult = calculateBreakingResult(
        technique,
        legOpportunity,
        50
      );

      expect(legResult.mobilityReduction).toBeGreaterThanOrEqual(0.8);
      expect(legResult.statusEffects).toContain("impaired_mobility");
    });
  });

  describe("canExecuteCounter", () => {
    it("should return false when stamina is insufficient", () => {
      const technique = createTestTechnique({
        staminaCost: 30,
      });

      const canCounter = canExecuteCounter(20, technique, 0.5);
      expect(canCounter).toBe(false);
    });

    it("should return false when distance is too far", () => {
      const technique = createTestTechnique({
        staminaCost: 20,
      });

      const canCounter = canExecuteCounter(30, technique, 1.5);
      expect(canCounter).toBe(false);
    });

    it("should return true when stamina and distance are valid", () => {
      const technique = createTestTechnique({
        staminaCost: 20,
      });

      const canCounter = canExecuteCounter(30, technique, 0.8);
      expect(canCounter).toBe(true);
    });
  });

  describe("generateLimbExposureWindow", () => {
    it("should generate high vulnerability for high extension kicks", () => {
      const kickTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.2,
        },
        executionTime: 1000,
      });

      const exposure = generateLimbExposureWindow(kickTechnique);

      expect(exposure.vulnerabilityMultiplier).toBeGreaterThanOrEqual(2.0);
      expect(exposure.allowsBreaking).toBe(true);
      expect(exposure.duration).toBeGreaterThan(300);
    });

    it("should generate medium vulnerability for standard punches", () => {
      const punchTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.9,
        },
        executionTime: 800,
      });

      const exposure = generateLimbExposureWindow(punchTechnique);

      expect(exposure.vulnerabilityMultiplier).toBeGreaterThan(1.0);
      expect(exposure.vulnerabilityMultiplier).toBeLessThan(2.0);
      expect(exposure.allowsBreaking).toBe(false);
    });

    it("should generate low vulnerability for close-range techniques", () => {
      const elbowTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "elbow",
          baseExtension: 0.5,
        },
        executionTime: 600,
      });

      const exposure = generateLimbExposureWindow(elbowTechnique);

      expect(exposure.vulnerabilityMultiplier).toBeLessThanOrEqual(1.3);
      expect(exposure.allowsBreaking).toBe(false);
    });

    it("should set exposure start time at mid-execution", () => {
      const technique = createTestTechnique({
        executionTime: 1000,
      });

      const exposure = generateLimbExposureWindow(technique);

      expect(exposure.startTime).toBe(0.5);
    });

    it("should scale duration with execution time", () => {
      const fastTechnique = createTestTechnique({
        executionTime: 500,
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 1.1,
        },
      });

      const slowTechnique = createTestTechnique({
        executionTime: 1500,
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 1.1,
        },
      });

      const fastExposure = generateLimbExposureWindow(fastTechnique);
      const slowExposure = generateLimbExposureWindow(slowTechnique);

      expect(slowExposure.duration).toBeGreaterThan(fastExposure.duration);
    });
  });
});
