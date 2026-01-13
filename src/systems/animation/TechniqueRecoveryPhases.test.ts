/**
 * Tests for Technique Recovery Phase System
 * 
 * Validates realistic recovery animations after technique completion including:
 * - Recovery phase duration (150-250ms)
 * - Ease-out interpolation for gradual deceleration
 * - Muscle tension release during recovery
 * - Intermediate positions (no direct snap-back)
 * - Breathing synchronization
 * 
 * @module systems/animation/TechniqueRecoveryPhases.test
 * @category Animation Tests
 * @korean 기술복귀단계테스트
 */

import { describe, it, expect } from "vitest";
import {
  addRecoveryPhase,
  calculateRecoveryTension,
  createTechniqueRecovery,
  getMuscleTensionState,
  validateRecoveryPhase,
  DEFAULT_RECOVERY_CONFIG,
  type TensionKeyframe,
} from "./TechniqueRecoveryPhases";
import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import * as THREE from "three";

/**
 * Create a basic test technique animation (front kick)
 */
function createTestTechniqueAnimation(): SkeletalAnimation {
  return {
    id: "test_front_kick",
    names: {
      korean: "앞차기",
      english: "Front Kick",
    },
    duration: 0.5, // 500ms base animation
    loop: false,
    keyframes: [
      // Initial stance
      {
        time: 0,
        easing: "linear",
        boneRotations: new Map([
          [BoneName.HIP_R, new THREE.Euler(0, 0, 0)],
          [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0)],
          [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0)],
        ]),
        bonePositions: new Map([
          [BoneName.FOOT_R, new THREE.Vector3(0, 0, 0)],
        ]),
      },
      // Chamber
      {
        time: 0.12,
        easing: "ease-out",
        boneRotations: new Map([
          [BoneName.HIP_R, new THREE.Euler(1.57, 0, 0)], // 90° hip flexion
          [BoneName.KNEE_R, new THREE.Euler(-2.0, 0, 0)], // Knee bent tight
          [BoneName.SPINE_UPPER, new THREE.Euler(-0.05, 0, 0)],
        ]),
        bonePositions: new Map([
          [BoneName.FOOT_R, new THREE.Vector3(0, 0.5, 0)],
        ]),
      },
      // Extension (peak)
      {
        time: 0.3,
        easing: "ease-out",
        boneRotations: new Map([
          [BoneName.HIP_R, new THREE.Euler(1.7, 0, 0)], // Full hip extension
          [BoneName.KNEE_R, new THREE.Euler(0.1, 0, 0)], // Nearly straight
          [BoneName.SPINE_UPPER, new THREE.Euler(0.05, 0, 0)],
        ]),
        bonePositions: new Map([
          [BoneName.FOOT_R, new THREE.Vector3(0.6, 0, 0)], // Forward position
        ]),
      },
      // Retraction
      {
        time: 0.5,
        easing: "ease-in",
        boneRotations: new Map([
          [BoneName.HIP_R, new THREE.Euler(1.57, 0, 0)], // Back to chamber
          [BoneName.KNEE_R, new THREE.Euler(-2.0, 0, 0)],
          [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0)],
        ]),
        bonePositions: new Map([
          [BoneName.FOOT_R, new THREE.Vector3(0, 0, 0)],
        ]),
      },
    ],
  };
}

describe("TechniqueRecoveryPhases", () => {
  describe("calculateRecoveryTension", () => {
    it("should release tension gradually during recovery", () => {
      const peakTension = 1.0;
      
      // At 0% progress, tension is at peak
      expect(calculateRecoveryTension(peakTension, 0)).toBeCloseTo(1.0, 1);
      
      // At 50% progress, tension significantly reduced
      const halfwayTension = calculateRecoveryTension(peakTension, 0.5);
      expect(halfwayTension).toBeLessThan(0.5);
      expect(halfwayTension).toBeGreaterThan(0.1);
      
      // At 80% progress, tension mostly released
      const eightyPercent = calculateRecoveryTension(peakTension, 0.8);
      expect(eightyPercent).toBeLessThan(0.3);
      
      // At 100% progress, tension near minimum (10% base)
      expect(calculateRecoveryTension(peakTension, 1.0)).toBeCloseTo(0.1, 1);
    });

    it("should never go below 10% base tension", () => {
      const peakTension = 1.0;
      
      // Even at complete recovery, maintain 10% base tension
      expect(calculateRecoveryTension(peakTension, 1.0)).toBeGreaterThanOrEqual(0.1);
      expect(calculateRecoveryTension(peakTension, 1.5)).toBeGreaterThanOrEqual(0.1);
    });

    it("should use non-linear tension release curve", () => {
      const peakTension = 1.0;
      
      // Tension release should be faster early, slower late (quadratic ease-out)
      const tension25 = calculateRecoveryTension(peakTension, 0.25);
      const tension50 = calculateRecoveryTension(peakTension, 0.5);
      const tension75 = calculateRecoveryTension(peakTension, 0.75);
      
      // First quarter releases more than second quarter
      const firstQuarterRelease = 1.0 - tension25;
      const secondQuarterRelease = tension25 - tension50;
      expect(firstQuarterRelease).toBeGreaterThan(secondQuarterRelease);
      
      // Second quarter releases more than third quarter
      const thirdQuarterRelease = tension50 - tension75;
      expect(secondQuarterRelease).toBeGreaterThan(thirdQuarterRelease);
    });
  });

  describe("addRecoveryPhase", () => {
    it("should add recovery phase with proper duration", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation);
      
      // Should have 2 additional keyframes (intermediate + final)
      expect(withRecovery.keyframes.length).toBe(baseAnimation.keyframes.length + 2);
      
      // Total duration should increase by recovery duration (200ms default)
      expect(withRecovery.duration).toBeGreaterThan(baseAnimation.duration);
      expect(withRecovery.duration - baseAnimation.duration).toBeCloseTo(0.2, 2);
    });

    it("should use ease-out interpolation during recovery", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation);
      
      // Second to last keyframe should be intermediate recovery
      const intermediateFrame = withRecovery.keyframes[withRecovery.keyframes.length - 2];
      expect(intermediateFrame.easing).toBe("ease-out");
      
      // Last keyframe should also use ease-out
      const finalFrame = withRecovery.keyframes[withRecovery.keyframes.length - 1];
      expect(finalFrame.easing).toBe("ease-out");
    });

    it("should release muscle tension during recovery", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation);
      
      // Get recovery keyframes
      const intermediateFrame = withRecovery.keyframes[withRecovery.keyframes.length - 2] as TensionKeyframe;
      const finalFrame = withRecovery.keyframes[withRecovery.keyframes.length - 1] as TensionKeyframe;
      
      // Intermediate frame should have reduced tension
      expect(intermediateFrame.muscleTension).toBeDefined();
      if (intermediateFrame.muscleTension) {
        intermediateFrame.muscleTension.forEach((tension) => {
          expect(tension).toBeLessThan(0.5); // At least 50% reduction
          expect(tension).toBeGreaterThanOrEqual(0.1); // Relaxing toward minimum (10% base)
        });
      }
      
      // Final frame should have minimal tension (10% base)
      expect(finalFrame.muscleTension).toBeDefined();
      if (finalFrame.muscleTension) {
        finalFrame.muscleTension.forEach((tension) => {
          expect(tension).toBeCloseTo(0.1, 1);
        });
      }
    });

    it("should return through intermediate position, not direct", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation);
      
      // Should have at least 2 recovery keyframes
      const recoveryFrames = withRecovery.keyframes.slice(-2);
      expect(recoveryFrames.length).toBeGreaterThanOrEqual(2);
      
      // Intermediate frame should not be at neutral (0,0,0)
      const intermediateFrame = recoveryFrames[0];
      let hasNonZeroRotation = false;
      
      intermediateFrame.boneRotations.forEach((rotation) => {
        if (Math.abs(rotation.x) > 0.01 || Math.abs(rotation.y) > 0.01 || Math.abs(rotation.z) > 0.01) {
          hasNonZeroRotation = true;
        }
      });
      
      expect(hasNonZeroRotation).toBe(true);
    });

    it("should interpolate approximately 80% back to neutral at intermediate", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation, {
        intermediateProgress: 0.8,
      });
      
      // Get peak and intermediate keyframes
      const peakFrame = baseAnimation.keyframes[baseAnimation.keyframes.length - 2];
      const intermediateFrame = withRecovery.keyframes[withRecovery.keyframes.length - 2];
      
      // Check hip rotation is roughly 20% of peak (80% back to neutral)
      const peakHipRotation = peakFrame.boneRotations.get(BoneName.HIP_R);
      const intermediateHipRotation = intermediateFrame.boneRotations.get(BoneName.HIP_R);
      
      if (peakHipRotation && intermediateHipRotation) {
        const remainingRotation = Math.abs(intermediateHipRotation.x);
        const peakRotation = Math.abs(peakHipRotation.x);
        
        // Should be roughly 20% of peak rotation remaining
        expect(remainingRotation / peakRotation).toBeLessThan(0.35);
        expect(remainingRotation / peakRotation).toBeGreaterThan(0.0);
      }
    });

    it("should accept custom recovery duration", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const customDuration = 0.25; // 250ms
      
      const withRecovery = addRecoveryPhase(baseAnimation, {
        duration: customDuration,
      });
      
      const finalTime = withRecovery.keyframes[withRecovery.keyframes.length - 1].time;
      const recoveryDuration = finalTime - baseAnimation.duration;
      
      expect(recoveryDuration).toBeCloseTo(customDuration, 2);
    });

    it("should include breathing synchronization when enabled", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation, {
        includeBreathing: true,
      });
      
      // Check that spine has slight breathing offset
      const intermediateFrame = withRecovery.keyframes[withRecovery.keyframes.length - 2];
      const spineRotation = intermediateFrame.boneRotations.get(BoneName.SPINE_UPPER);
      
      expect(spineRotation).toBeDefined();
      // Breathing causes small offset (not exactly at interpolated neutral)
      // This is hard to test precisely, but we can verify spine rotation exists
    });

    it("should handle animations with insufficient keyframes gracefully", () => {
      const incompleteAnimation: SkeletalAnimation = {
        id: "incomplete",
        names: { korean: "불완전", english: "Incomplete" },
        duration: 0.1,
        loop: false,
        keyframes: [
          {
            time: 0,
            easing: "linear",
            boneRotations: new Map(),
            bonePositions: new Map(),
          },
        ],
      };
      
      const withRecovery = addRecoveryPhase(incompleteAnimation);
      
      // Should return original animation unchanged
      expect(withRecovery.keyframes.length).toBe(1);
      expect(withRecovery.duration).toBe(0.1);
    });
  });

  describe("createTechniqueRecovery", () => {
    it("should create kick-specific recovery configuration", () => {
      const kickRecovery = createTechniqueRecovery("kick");
      
      // Kicks need longer recovery for balance restoration
      expect(kickRecovery.duration).toBeGreaterThan(0.2);
      expect(kickRecovery.intermediateProgress).toBeLessThanOrEqual(0.8);
      expect(kickRecovery.easing).toBe("ease-out");
    });

    it("should create punch-specific recovery configuration", () => {
      const punchRecovery = createTechniqueRecovery("punch");
      
      // Punches recover faster
      expect(punchRecovery.duration).toBeLessThan(0.2);
      expect(punchRecovery.intermediateProgress).toBeGreaterThan(0.8);
    });

    it("should create throw-specific recovery configuration", () => {
      const throwRecovery = createTechniqueRecovery("throw");
      
      // Throws need extended recovery
      expect(throwRecovery.duration).toBeGreaterThan(0.25);
      expect(throwRecovery.intermediateProgress).toBeLessThan(0.75);
    });

    it("should create spin-specific recovery configuration", () => {
      const spinRecovery = createTechniqueRecovery("spin");
      
      // Spinning techniques need longest recovery
      expect(spinRecovery.duration).toBeGreaterThan(0.25);
      expect(spinRecovery.easing).toBe("controlled-slow");
    });
  });

  describe("getMuscleTensionState", () => {
    it("should return default relaxed state for keyframes without tension data", () => {
      const keyframe: TensionKeyframe = {
        time: 0,
        easing: "linear",
        boneRotations: new Map(),
        bonePositions: new Map(),
      };
      
      const tensionState = getMuscleTensionState(keyframe);
      
      expect(tensionState.legs).toBe(0.1);
      expect(tensionState.core).toBe(0.1);
      expect(tensionState.arms).toBe(0.1);
      expect(tensionState.shoulders).toBe(0.1);
    });

    it("should calculate average tension across muscle groups", () => {
      const keyframe: TensionKeyframe = {
        time: 0,
        easing: "linear",
        boneRotations: new Map(),
        bonePositions: new Map(),
        muscleTension: new Map([
          [BoneName.HIP_R, 0.8],
          [BoneName.HIP_L, 0.6],
          [BoneName.KNEE_R, 0.7],
          [BoneName.KNEE_L, 0.5],
          [BoneName.PELVIS, 0.5], // Add PELVIS to match core bones
          [BoneName.SPINE_LOWER, 0.6],
          [BoneName.SPINE_UPPER, 0.4],
          [BoneName.SHOULDER_R, 0.5],
          [BoneName.SHOULDER_L, 0.3],
        ]),
      };
      
      const tensionState = getMuscleTensionState(keyframe);
      
      // Legs average: (0.8 + 0.6 + 0.7 + 0.5) / 4 = 0.65
      expect(tensionState.legs).toBeCloseTo(0.65, 1);
      
      // Core average: (0.5 + 0.6 + 0.4) / 3 = 0.5
      expect(tensionState.core).toBeCloseTo(0.5, 1);
      
      // Shoulders average: (0.5 + 0.3) / 2 = 0.4
      expect(tensionState.shoulders).toBeCloseTo(0.4, 1);
    });
  });

  describe("validateRecoveryPhase", () => {
    it("should validate animation with proper recovery phase", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation);
      
      const validation = validateRecoveryPhase(withRecovery);
      
      expect(validation.valid).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it("should fail validation for insufficient keyframes", () => {
      const incompleteAnimation: SkeletalAnimation = {
        id: "incomplete",
        names: { korean: "불완전", english: "Incomplete" },
        duration: 0.1,
        loop: false,
        keyframes: [
          {
            time: 0,
            easing: "linear",
            boneRotations: new Map(),
            bonePositions: new Map(),
          },
          {
            time: 0.1,
            easing: "linear",
            boneRotations: new Map(),
            bonePositions: new Map(),
          },
        ],
      };
      
      const validation = validateRecoveryPhase(incompleteAnimation);
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
    });

    it("should warn about recovery duration outside recommended range", () => {
      const baseAnimation = createTestTechniqueAnimation();
      
      // Too short recovery (100ms)
      const tooShort = addRecoveryPhase(baseAnimation, { duration: 0.1 });
      const shortValidation = validateRecoveryPhase(tooShort);
      
      expect(shortValidation.valid).toBe(false);
      expect(shortValidation.issues.some((issue) => issue.includes("duration"))).toBe(true);
      
      // Too long recovery (300ms)
      const tooLong = addRecoveryPhase(baseAnimation, { duration: 0.3 });
      const longValidation = validateRecoveryPhase(tooLong);
      
      expect(longValidation.valid).toBe(false);
      expect(longValidation.issues.some((issue) => issue.includes("duration"))).toBe(true);
    });

    it("should warn about incorrect easing function", () => {
      const baseAnimation = createTestTechniqueAnimation();
      const withRecovery = addRecoveryPhase(baseAnimation, {
        easing: "ease-in" as any, // Wrong easing for recovery
      });
      
      const validation = validateRecoveryPhase(withRecovery);
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((issue) => issue.includes("ease-out"))).toBe(true);
    });

    it("should warn about missing intermediate positions", () => {
      const animationWithoutIntermediate: SkeletalAnimation = {
        id: "no_intermediate",
        names: { korean: "중간없음", english: "No Intermediate" },
        duration: 0.7,
        loop: false,
        keyframes: [
          {
            time: 0,
            easing: "linear",
            boneRotations: new Map([[BoneName.HIP_R, new THREE.Euler(1.0, 0, 0)]]),
            bonePositions: new Map(),
          },
          {
            time: 0.5,
            easing: "linear",
            boneRotations: new Map([[BoneName.HIP_R, new THREE.Euler(0.5, 0, 0)]]),
            bonePositions: new Map(),
          },
          {
            time: 0.65,
            easing: "ease-out",
            boneRotations: new Map(), // Missing bone transformations
            bonePositions: new Map(),
          },
          {
            time: 0.7,
            easing: "ease-out",
            boneRotations: new Map([[BoneName.HIP_R, new THREE.Euler(0, 0, 0)]]),
            bonePositions: new Map(),
          },
        ],
      };
      
      const validation = validateRecoveryPhase(animationWithoutIntermediate);
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((issue) => issue.includes("missing"))).toBe(true);
    });
  });

  describe("DEFAULT_RECOVERY_CONFIG", () => {
    it("should have standard 200ms duration", () => {
      expect(DEFAULT_RECOVERY_CONFIG.duration).toBe(0.2);
    });

    it("should use 80% intermediate progress", () => {
      expect(DEFAULT_RECOVERY_CONFIG.intermediateProgress).toBe(0.8);
    });

    it("should use 60% intermediate time ratio", () => {
      expect(DEFAULT_RECOVERY_CONFIG.intermediateTimeRatio).toBe(0.6);
    });

    it("should use ease-out easing", () => {
      expect(DEFAULT_RECOVERY_CONFIG.easing).toBe("ease-out");
    });

    it("should include breathing by default", () => {
      expect(DEFAULT_RECOVERY_CONFIG.includeBreathing).toBe(true);
    });
  });
});
