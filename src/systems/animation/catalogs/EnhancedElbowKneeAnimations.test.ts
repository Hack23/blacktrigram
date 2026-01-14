/**
 * Tests for Enhanced Elbow and Knee Animations with Recovery Phases
 *
 * Validates Korean martial arts recovery principles for close-range techniques.
 *
 * @category Tests
 * @korean 향상된팔꿈치무릎애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { validateRecoveryPhase } from "../core/RecoveryPhaseEnhancer";
import {
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  KNEE_STRIKE_ANIMATION,
} from "./ElbowKneeAnimations";
import {
  ELBOW_STRIKE_ANIMATION_ENHANCED,
  ELBOW_UPPERCUT_ANIMATION_ENHANCED,
  ENHANCED_ELBOW_KNEE_ANIMATIONS,
  KNEE_STRIKE_ANIMATION_ENHANCED,
} from "./EnhancedElbowKneeAnimations";

describe("EnhancedElbowKneeAnimations", () => {
  describe("ELBOW_STRIKE_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(ELBOW_STRIKE_ANIMATION_ENHANCED.duration).toBeGreaterThan(
        ELBOW_STRIKE_ANIMATION.duration
      );
    });

    it("should add 2 recovery keyframes", () => {
      expect(ELBOW_STRIKE_ANIMATION_ENHANCED.keyframes.length).toBe(
        ELBOW_STRIKE_ANIMATION.keyframes.length + 2
      );
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(ELBOW_STRIKE_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("should have very fast recovery for close-range (150-170ms)", () => {
      const result = validateRecoveryPhase(ELBOW_STRIKE_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
      expect(result.recoveryDuration).toBeLessThanOrEqual(170);
    });

    it("should preserve animation identity", () => {
      expect(ELBOW_STRIKE_ANIMATION_ENHANCED.name).toBe("elbow_strike");
      expect(ELBOW_STRIKE_ANIMATION_ENHANCED.koreanName).toBe("팔꿈치치기");
      expect(ELBOW_STRIKE_ANIMATION_ENHANCED.type).toBe("attack");
    });

    it("should return to neutral position", () => {
      const finalFrame =
        ELBOW_STRIKE_ANIMATION_ENHANCED.keyframes[
          ELBOW_STRIKE_ANIMATION_ENHANCED.keyframes.length - 1
        ];

      finalFrame.boneRotations.forEach((rotation) => {
        expect(Math.abs(rotation.x)).toBeLessThan(0.01);
        expect(Math.abs(rotation.y)).toBeLessThan(0.01);
        expect(Math.abs(rotation.z)).toBeLessThan(0.01);
      });
    });
  });

  describe("ELBOW_UPPERCUT_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(ELBOW_UPPERCUT_ANIMATION_ENHANCED.duration).toBeGreaterThan(
        ELBOW_UPPERCUT_ANIMATION.duration
      );
    });

    it("should add 2 recovery keyframes", () => {
      expect(ELBOW_UPPERCUT_ANIMATION_ENHANCED.keyframes.length).toBe(
        ELBOW_UPPERCUT_ANIMATION.keyframes.length + 2
      );
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(ELBOW_UPPERCUT_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
    });

    it("should have fast recovery (170ms) for vertical strike", () => {
      const result = validateRecoveryPhase(ELBOW_UPPERCUT_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeCloseTo(170, 5);
    });

    it("should preserve animation identity", () => {
      expect(ELBOW_UPPERCUT_ANIMATION_ENHANCED.name).toBe("elbow_uppercut");
      expect(ELBOW_UPPERCUT_ANIMATION_ENHANCED.koreanName).toBe(
        "팔꿈치올려치기"
      );
    });
  });

  describe("KNEE_STRIKE_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(KNEE_STRIKE_ANIMATION_ENHANCED.duration).toBeGreaterThan(
        KNEE_STRIKE_ANIMATION.duration
      );
    });

    it("should add 2 recovery keyframes", () => {
      expect(KNEE_STRIKE_ANIMATION_ENHANCED.keyframes.length).toBe(
        KNEE_STRIKE_ANIMATION.keyframes.length + 2
      );
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(KNEE_STRIKE_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
    });

    it("should have moderate recovery (190ms) for balance restoration", () => {
      const result = validateRecoveryPhase(KNEE_STRIKE_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeCloseTo(190, 5);
    });

    it("should preserve animation identity", () => {
      expect(KNEE_STRIKE_ANIMATION_ENHANCED.name).toBe("knee_strike");
      expect(KNEE_STRIKE_ANIMATION_ENHANCED.koreanName).toBe("무릎차기");
    });

    it("should return to neutral position", () => {
      const finalFrame =
        KNEE_STRIKE_ANIMATION_ENHANCED.keyframes[
          KNEE_STRIKE_ANIMATION_ENHANCED.keyframes.length - 1
        ];

      finalFrame.boneRotations.forEach((rotation) => {
        expect(Math.abs(rotation.x)).toBeLessThan(0.01);
        expect(Math.abs(rotation.y)).toBeLessThan(0.01);
        expect(Math.abs(rotation.z)).toBeLessThan(0.01);
      });
    });
  });

  describe("ENHANCED_ELBOW_KNEE_ANIMATIONS map", () => {
    it("should contain all enhanced animations", () => {
      expect(ENHANCED_ELBOW_KNEE_ANIMATIONS.elbow_strike).toBeDefined();
      expect(ENHANCED_ELBOW_KNEE_ANIMATIONS.elbow_uppercut).toBeDefined();
      expect(ENHANCED_ELBOW_KNEE_ANIMATIONS.knee_strike).toBeDefined();
    });

    it("should provide enhanced versions", () => {
      expect(
        ENHANCED_ELBOW_KNEE_ANIMATIONS.elbow_strike.duration
      ).toBeGreaterThan(ELBOW_STRIKE_ANIMATION.duration);
      expect(
        ENHANCED_ELBOW_KNEE_ANIMATIONS.elbow_uppercut.duration
      ).toBeGreaterThan(ELBOW_UPPERCUT_ANIMATION.duration);
      expect(
        ENHANCED_ELBOW_KNEE_ANIMATIONS.knee_strike.duration
      ).toBeGreaterThan(KNEE_STRIKE_ANIMATION.duration);
    });

    it("should all have valid recovery phases", () => {
      Object.values(ENHANCED_ELBOW_KNEE_ANIMATIONS).forEach((animation) => {
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe("Close-Range Combat Principles", () => {
    it("should have faster recovery than standard strikes", () => {
      const elbowResult = validateRecoveryPhase(
        ELBOW_STRIKE_ANIMATION_ENHANCED
      );
      const elbowUppercutResult = validateRecoveryPhase(
        ELBOW_UPPERCUT_ANIMATION_ENHANCED
      );

      // Close-range techniques should have <170ms recovery
      expect(elbowResult.recoveryDuration).toBeLessThan(170);
      expect(elbowUppercutResult.recoveryDuration).toBeLessThan(180);
    });

    it("should have complete balance restoration for knee strike", () => {
      const result = validateRecoveryPhase(KNEE_STRIKE_ANIMATION_ENHANCED);

      // Knee strike needs longer recovery for balance (single-leg position)
      expect(result.recoveryDuration).toBeGreaterThan(180);
      expect(result.recoveryDuration).toBeLessThan(200);
    });

    it("should return all animations to neutral stance", () => {
      const animations = Object.values(ENHANCED_ELBOW_KNEE_ANIMATIONS);

      animations.forEach((anim) => {
        const finalFrame = anim.keyframes[anim.keyframes.length - 1];

        finalFrame.boneRotations.forEach((rotation) => {
          expect(Math.abs(rotation.x)).toBeLessThan(0.01);
          expect(Math.abs(rotation.y)).toBeLessThan(0.01);
          expect(Math.abs(rotation.z)).toBeLessThan(0.01);
        });
      });
    });

    it("should maintain Korean martial arts principles", () => {
      // All enhanced animations should follow 복귀 (Bokgwi) principles
      const animations = Object.values(ENHANCED_ELBOW_KNEE_ANIMATIONS);

      animations.forEach((anim) => {
        const result = validateRecoveryPhase(anim);
        expect(result.isValid).toBe(true);
        expect(result.recoveryKeyframes).toBe(2);
        expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
        expect(result.recoveryDuration).toBeLessThanOrEqual(250);
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should process enhanced animations efficiently", () => {
      const startTime = performance.now();

      // Process 1000 validations
      for (let i = 0; i < 1000; i++) {
        const anim = Object.values(ENHANCED_ELBOW_KNEE_ANIMATIONS)[i % 3];
        validateRecoveryPhase(anim);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 1000;

      // Should process well under 1ms per animation
      expect(avgTime).toBeLessThan(1.0);
    });
  });
});
