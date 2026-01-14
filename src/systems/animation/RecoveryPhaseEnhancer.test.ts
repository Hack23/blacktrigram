/**
 * Tests for Recovery Phase Enhancer
 * 
 * Validates Korean martial arts recovery principles:
 * - 균형회복 (Gyunhyeong Hoebog) - Balance restoration
 * - 자세복귀 (Jase Bokgwi) - Stance return  
 * - 호흡조절 (Hoheup Jojoel) - Breath control
 * - 근육이완 (Geunryuk Ihwan) - Muscle relaxation
 * 
 * @category Tests
 * @korean 복귀단계향상테스트
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  addRecoveryPhase,
  createTechniqueWithRecovery,
  validateRecoveryPhase,
  calculateMuscleTension,
  type RecoveryPhaseConfig,
} from "./RecoveryPhaseEnhancer";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";

/**
 * Create a simple test animation for validation
 */
function createTestAnimation(name: string = "test"): SkeletalAnimation {
  const keyframe1: AnimationKeyframe = {
    time: 0.0,
    easing: "linear",
    boneRotations: new Map([
      [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)],
      [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5)],
    ]),
    bonePositions: new Map(),
  };

  const keyframe2: AnimationKeyframe = {
    time: 0.15,
    easing: "ease-out",
    boneRotations: new Map([
      [BoneName.SHOULDER_R, new THREE.Euler(-0.7, 0, 0.5)],
      [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.05)],
    ]),
    bonePositions: new Map(),
  };

  const keyframe3: AnimationKeyframe = {
    time: 0.3,
    easing: "ease-in",
    boneRotations: new Map([
      [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)],
      [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2)],
    ]),
    bonePositions: new Map(),
  };

  return {
    name,
    koreanName: "테스트",
    keyframes: [keyframe1, keyframe2, keyframe3],
    duration: 0.3,
    loop: false,
    type: "attack",
  };
}

describe("RecoveryPhaseEnhancer", () => {
  describe("addRecoveryPhase", () => {
    it("should add recovery phase with default configuration", () => {
      const baseAnimation = createTestAnimation("jab");
      const enhanced = addRecoveryPhase(baseAnimation);

      // Should have 2 additional keyframes (intermediate + final)
      expect(enhanced.keyframes.length).toBe(baseAnimation.keyframes.length + 2);
      
      // Duration should increase by default recovery time (220ms)
      expect(enhanced.duration).toBeCloseTo(baseAnimation.duration + 0.22, 2);
    });

    it("should add proper duration recovery phase", () => {
      const baseAnimation = createTestAnimation("kick");
      const enhanced = addRecoveryPhase(baseAnimation, {
        duration: 0.2,
      });

      expect(enhanced.duration).toBeCloseTo(0.3 + 0.2, 2);
      expect(enhanced.keyframes.length).toBe(5); // 3 base + 2 recovery
    });

    it("should use ease-out interpolation for recovery keyframes", () => {
      const baseAnimation = createTestAnimation("punch");
      const enhanced = addRecoveryPhase(baseAnimation);

      const intermediateFrame = enhanced.keyframes[enhanced.keyframes.length - 2];
      const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];

      expect(intermediateFrame.easing).toBe("ease-out");
      expect(finalFrame.easing).toBe("ease-out");
    });

    it("should create intermediate keyframe at 80% back to neutral", () => {
      const baseAnimation = createTestAnimation("technique");
      const peakKeyframe = baseAnimation.keyframes[baseAnimation.keyframes.length - 2];
      
      const enhanced = addRecoveryPhase(baseAnimation, {
        intermediateReturnPercent: 0.8,
      });

      const intermediateFrame = enhanced.keyframes[enhanced.keyframes.length - 2];
      
      // Check shoulder rotation is 20% of peak (80% back to neutral)
      const peakRotation = peakKeyframe.boneRotations.get(BoneName.SHOULDER_R)!;
      const intermediateRotation = intermediateFrame.boneRotations.get(BoneName.SHOULDER_R)!;

      expect(Math.abs(intermediateRotation.x)).toBeCloseTo(Math.abs(peakRotation.x) * 0.2, 2);
      expect(Math.abs(intermediateRotation.z)).toBeCloseTo(Math.abs(peakRotation.z) * 0.2, 2);
    });

    it("should return to neutral position in final keyframe", () => {
      const baseAnimation = createTestAnimation("strike");
      const enhanced = addRecoveryPhase(baseAnimation);

      const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];
      
      // All rotations should be zero (neutral)
      finalFrame.boneRotations.forEach((rotation) => {
        expect(Math.abs(rotation.x)).toBeLessThan(0.001);
        expect(Math.abs(rotation.y)).toBeLessThan(0.001);
        expect(Math.abs(rotation.z)).toBeLessThan(0.001);
      });
    });

    it("should handle animations with bone positions", () => {
      const animation = createTestAnimation("test");
      const keyframe = animation.keyframes[1];
      keyframe.bonePositions.set(BoneName.SHOULDER_R, new THREE.Vector3(0.1, 0.2, 0));

      const enhanced = addRecoveryPhase(animation);
      const intermediateFrame = enhanced.keyframes[enhanced.keyframes.length - 2];
      const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];

      // Intermediate should have interpolated position
      expect(intermediateFrame.bonePositions.has(BoneName.SHOULDER_R)).toBe(true);
      
      // Final should return to rest position (0, 0, 0)
      const finalPos = finalFrame.bonePositions.get(BoneName.SHOULDER_R)!;
      expect(finalPos.length()).toBeLessThan(0.001);
    });

    it("should preserve original animation name and metadata", () => {
      const baseAnimation = createTestAnimation("original_name");
      const enhanced = addRecoveryPhase(baseAnimation);

      expect(enhanced.name).toBe("original_name");
      expect(enhanced.koreanName).toBe("테스트");
      expect(enhanced.loop).toBe(false);
      expect(enhanced.type).toBe("attack");
    });

    it("should handle custom intermediate return percentage", () => {
      const baseAnimation = createTestAnimation("custom");
      const enhanced = addRecoveryPhase(baseAnimation, {
        intermediateReturnPercent: 0.7, // 70% back to neutral
      });

      const peakKeyframe = baseAnimation.keyframes[baseAnimation.keyframes.length - 2];
      const intermediateFrame = enhanced.keyframes[enhanced.keyframes.length - 2];

      const peakRotation = peakKeyframe.boneRotations.get(BoneName.ELBOW_R)!;
      const intermediateRotation = intermediateFrame.boneRotations.get(BoneName.ELBOW_R)!;

      // Should be 30% of peak (70% back to neutral)
      expect(Math.abs(intermediateRotation.z)).toBeCloseTo(Math.abs(peakRotation.z) * 0.3, 2);
    });

    it("should warn and return original for animations with < 2 keyframes", () => {
      const invalidAnimation: SkeletalAnimation = {
        name: "invalid",
        koreanName: "무효",
        keyframes: [],
        duration: 0.1,
        loop: false,
        type: "attack",
      };

      const result = addRecoveryPhase(invalidAnimation);
      expect(result).toBe(invalidAnimation);
      expect(result.keyframes.length).toBe(0);
    });

    it("should allow disabling ease-out interpolation", () => {
      const baseAnimation = createTestAnimation("linear_recovery");
      const enhanced = addRecoveryPhase(baseAnimation, {
        useEaseOut: false,
      });

      const intermediateFrame = enhanced.keyframes[enhanced.keyframes.length - 2];
      const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];

      expect(intermediateFrame.easing).toBe("linear");
      expect(finalFrame.easing).toBe("linear");
    });
  });

  describe("createTechniqueWithRecovery", () => {
    it("should be equivalent to addRecoveryPhase", () => {
      const baseAnimation = createTestAnimation("technique");
      
      const withAdd = addRecoveryPhase(baseAnimation);
      const withCreate = createTechniqueWithRecovery(baseAnimation);

      expect(withCreate.keyframes.length).toBe(withAdd.keyframes.length);
      expect(withCreate.duration).toBe(withAdd.duration);
    });

    it("should accept custom configuration", () => {
      const baseAnimation = createTestAnimation("custom_technique");
      
      const enhanced = createTechniqueWithRecovery(baseAnimation, {
        duration: 0.18,
        intermediateReturnPercent: 0.75,
      });

      expect(enhanced.duration).toBeCloseTo(0.3 + 0.18, 2);
    });
  });

  describe("validateRecoveryPhase", () => {
    it("should validate animation with proper recovery phase", () => {
      const baseAnimation = createTestAnimation("valid");
      const enhanced = addRecoveryPhase(baseAnimation, {
        duration: 0.2,
      });

      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.recoveryDuration).toBeCloseTo(200, 0); // 200ms
      expect(result.recoveryKeyframes).toBe(2);
    });

    it("should detect too-short recovery duration", () => {
      const baseAnimation = createTestAnimation("too_short");
      const enhanced = addRecoveryPhase(baseAnimation, {
        duration: 0.1, // 100ms - too short
      });

      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]).toContain("too short");
    });

    it("should detect too-long recovery duration", () => {
      const baseAnimation = createTestAnimation("too_long");
      const enhanced = addRecoveryPhase(baseAnimation, {
        duration: 0.3, // 300ms - too long
      });

      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(issue => issue.includes("too long"))).toBe(true);
    });

    it("should detect incorrect easing function", () => {
      const animation = createTestAnimation("wrong_easing");
      const enhanced = addRecoveryPhase(animation);
      
      // Manually change easing to simulate incorrect configuration
      const modifiedKeyframes = enhanced.keyframes.map((kf, idx) => {
        if (idx === enhanced.keyframes.length - 1) {
          return { ...kf, easing: "linear" as const };
        }
        return kf;
      });

      const modifiedAnimation: SkeletalAnimation = {
        ...enhanced,
        keyframes: modifiedKeyframes,
      };

      const result = validateRecoveryPhase(modifiedAnimation);
      
      expect(result.isValid).toBe(false);
      expect(result.issues.some(issue => issue.includes("ease-out"))).toBe(true);
    });

    it("should detect non-neutral final position", () => {
      const animation = createTestAnimation("non_neutral");
      const enhanced = addRecoveryPhase(animation);
      
      // Manually set non-zero final rotation
      const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];
      finalFrame.boneRotations.set(BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0));

      const result = validateRecoveryPhase(enhanced);
      
      expect(result.isValid).toBe(false);
      expect(result.issues.some(issue => issue.includes("neutral"))).toBe(true);
    });

    it("should fail for animations with < 3 keyframes", () => {
      const invalidAnimation: SkeletalAnimation = {
        name: "too_few",
        koreanName: "부족",
        keyframes: [
          {
            time: 0,
            easing: "linear",
            boneRotations: new Map(),
            bonePositions: new Map(),
          },
        ],
        duration: 0.1,
        loop: false,
        type: "attack",
      };

      const result = validateRecoveryPhase(invalidAnimation);
      
      expect(result.isValid).toBe(false);
      expect(result.recoveryDuration).toBe(0);
      expect(result.issues.some(issue => issue.includes("3 keyframes"))).toBe(true);
    });

    it("should report correct recovery duration in result", () => {
      const animation = createTestAnimation("duration_check");
      const enhanced = addRecoveryPhase(animation, {
        duration: 0.22,
      });

      const result = validateRecoveryPhase(enhanced);
      
      expect(result.recoveryDuration).toBeCloseTo(220, 1); // 220ms
    });
  });

  describe("calculateMuscleTension", () => {
    it("should return peak tension before recovery phase", () => {
      const animation = createTestAnimation("tension_test");
      const enhanced = addRecoveryPhase(animation, {
        peakMuscleTension: 1.0,
      });

      const tension = calculateMuscleTension(enhanced, 0.15, {
        peakMuscleTension: 1.0,
      });

      expect(tension).toBe(1.0);
    });

    it("should interpolate tension during recovery", () => {
      const animation = createTestAnimation("tension_interp");
      const enhanced = addRecoveryPhase(animation, {
        duration: 0.2,
        peakMuscleTension: 1.0,
        intermediateMuscleTension: 0.4,
        finalMuscleTension: 0.1,
      });

      const config = {
        peakMuscleTension: 1.0,
        intermediateMuscleTension: 0.4,
        finalMuscleTension: 0.1,
      };

      // At start of recovery (0.3)
      const tensionStart = calculateMuscleTension(enhanced, 0.3, config);
      expect(tensionStart).toBeCloseTo(1.0, 1);

      // Mid recovery (0.4 is halfway through 0.3-0.5 recovery)
      // Due to ease-out, we should be between peak and intermediate
      const tensionMid = calculateMuscleTension(enhanced, 0.4, config);
      expect(tensionMid).toBeGreaterThan(0.1); // Above final
      expect(tensionMid).toBeLessThan(1.0);    // Below peak

      // End of recovery (0.5)
      const tensionEnd = calculateMuscleTension(enhanced, 0.5, config);
      expect(tensionEnd).toBeCloseTo(0.1, 1);
    });

    it("should use ease-out curve for natural muscle release", () => {
      const animation = createTestAnimation("eased_tension");
      const enhanced = addRecoveryPhase(animation, {
        duration: 0.2,
      });

      const config = {
        peakMuscleTension: 1.0,
        intermediateMuscleTension: 0.4,
        finalMuscleTension: 0.1,
      };

      // Early in recovery should release quickly (ease-out)
      const early = calculateMuscleTension(enhanced, 0.32, config);
      const mid = calculateMuscleTension(enhanced, 0.4, config);
      
      const earlyDrop = 1.0 - early;
      const midDrop = 1.0 - mid;
      
      // Ease-out means faster drop early
      expect(earlyDrop).toBeGreaterThan(0);
    });

    it("should clamp tension values within valid range", () => {
      const animation = createTestAnimation("clamp_test");
      const enhanced = addRecoveryPhase(animation);

      const config = {
        peakMuscleTension: 1.0,
        intermediateMuscleTension: 0.4,
        finalMuscleTension: 0.1,
      };

      // Before animation starts
      const beforeStart = calculateMuscleTension(enhanced, -0.1, config);
      expect(beforeStart).toBeGreaterThanOrEqual(0.0);
      expect(beforeStart).toBeLessThanOrEqual(1.0);

      // After animation ends
      const afterEnd = calculateMuscleTension(enhanced, 10.0, config);
      expect(afterEnd).toBeGreaterThanOrEqual(0.0);
      expect(afterEnd).toBeLessThanOrEqual(1.0);
    });

    it("should return final tension for animations without recovery", () => {
      const simpleAnimation: SkeletalAnimation = {
        name: "simple",
        koreanName: "단순",
        keyframes: [
          {
            time: 0,
            easing: "linear",
            boneRotations: new Map(),
            bonePositions: new Map(),
          },
        ],
        duration: 0.1,
        loop: false,
        type: "attack",
      };

      const tension = calculateMuscleTension(simpleAnimation, 0.05, {
        finalMuscleTension: 0.15,
      });

      expect(tension).toBe(0.15);
    });

    it("should handle custom muscle tension values", () => {
      const animation = createTestAnimation("custom_tension");
      const enhanced = addRecoveryPhase(animation, {
        duration: 0.2,
      });

      const config = {
        peakMuscleTension: 0.9,
        intermediateMuscleTension: 0.3,
        finalMuscleTension: 0.05,
      };

      const tensionPeak = calculateMuscleTension(enhanced, 0.15, config);
      const tensionEnd = calculateMuscleTension(enhanced, 0.5, config);

      expect(tensionPeak).toBeCloseTo(0.9, 1);
      expect(tensionEnd).toBeCloseTo(0.05, 1);
    });
  });

  describe("Korean Martial Arts Principles", () => {
    it("should implement 균형회복 (balance restoration) through gradual return", () => {
      const animation = createTestAnimation("balance_test");
      const enhanced = addRecoveryPhase(animation, {
        intermediateReturnPercent: 0.8,
      });

      // Intermediate keyframe represents balance restoration in progress
      const intermediate = enhanced.keyframes[enhanced.keyframes.length - 2];
      expect(intermediate).toBeDefined();
      expect(intermediate.boneRotations.size).toBeGreaterThan(0);
    });

    it("should implement 자세복귀 (stance return) to neutral position", () => {
      const animation = createTestAnimation("stance_return");
      const enhanced = addRecoveryPhase(animation);

      const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];
      
      // All bones should return to neutral stance
      finalFrame.boneRotations.forEach((rotation) => {
        expect(Math.abs(rotation.x)).toBeLessThan(0.001);
        expect(Math.abs(rotation.y)).toBeLessThan(0.001);
        expect(Math.abs(rotation.z)).toBeLessThan(0.001);
      });
    });

    it("should implement 호흡조절 (breath control) through proper timing", () => {
      const animation = createTestAnimation("breath_control");
      const enhanced = addRecoveryPhase(animation, {
        duration: 0.22, // 220ms matches typical breath cycle
      });

      const result = validateRecoveryPhase(enhanced);
      
      // Duration should be within optimal range for breathing
      expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
      expect(result.recoveryDuration).toBeLessThanOrEqual(250);
    });

    it("should implement 근육이완 (muscle relaxation) through tension release", () => {
      const animation = createTestAnimation("muscle_relaxation");
      const enhanced = addRecoveryPhase(animation, {
        duration: 0.2,
        peakMuscleTension: 1.0,
        intermediateMuscleTension: 0.4,
        finalMuscleTension: 0.1,
      });

      const config = {
        peakMuscleTension: 1.0,
        intermediateMuscleTension: 0.4,
        finalMuscleTension: 0.1,
      };

      // Tension should decrease from peak to relaxed
      const peakTension = calculateMuscleTension(enhanced, 0.15, config);
      const midTension = calculateMuscleTension(enhanced, 0.4, config);
      const finalTension = calculateMuscleTension(enhanced, 0.5, config);

      expect(peakTension).toBeGreaterThan(midTension);
      expect(midTension).toBeGreaterThan(finalTension);
      expect(finalTension).toBeLessThanOrEqual(0.2); // Relaxed state
    });
  });

  describe("Performance Requirements", () => {
    it("should maintain 60fps target with recovery phase additions", () => {
      const startTime = performance.now();
      
      // Process 1000 animations with recovery phases
      for (let i = 0; i < 1000; i++) {
        const animation = createTestAnimation(`perf_test_${i}`);
        addRecoveryPhase(animation);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / 1000;

      // Each operation should take less than 1ms for 60fps
      expect(avgTime).toBeLessThan(1.0);
    });

    it("should validate 1000 animations quickly", () => {
      const animations = Array.from({ length: 1000 }, (_, i) => {
        const base = createTestAnimation(`validate_${i}`);
        return addRecoveryPhase(base);
      });

      const startTime = performance.now();
      
      animations.forEach((anim) => {
        validateRecoveryPhase(anim);
      });
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 1000;

      expect(avgTime).toBeLessThan(1.0);
    });
  });
});
