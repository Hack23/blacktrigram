/**
 * Integration Tests for Enhanced Animation Registry
 *
 * Verifies that enhanced animations with recovery phases are properly
 * integrated into the animation registry and used by default.
 *
 * @category Tests
 * @korean 향상된애니메이션레지스트리통합테스트
 */

import { describe, expect, it } from "vitest";
import { AnimationType } from "../builders/MartialArtsAnimationBuilder";
import {
  ALL_ANIMATIONS,
  ANIMATION_REGISTRY,
  getAnimationByType,
} from "./AnimationRegistry";
import { validateRecoveryPhase } from "./RecoveryPhaseEnhancer";

describe("Enhanced Animation Registry Integration", () => {
  describe("ANIMATION_REGISTRY uses enhanced animations", () => {
    it("should use JAB_ANIMATION_ENHANCED for JAB type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.JAB);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("jab");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
        expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
        expect(result.recoveryDuration).toBeLessThanOrEqual(250);
      }
    });

    it("should use CROSS_ANIMATION_ENHANCED for CROSS type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.CROSS);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("cross");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
        expect(result.recoveryDuration).toBeCloseTo(220, 5);
      }
    });

    it("should use FRONT_KICK_ANIMATION_ENHANCED for FRONT_KICK type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.FRONT_KICK);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("front_kick");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      }
    });

    it("should use ROUNDHOUSE_KICK_ANIMATION_ENHANCED for ROUNDHOUSE_KICK type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.ROUNDHOUSE_KICK);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("roundhouse_kick");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      }
    });

    it("should use ELBOW_STRIKE_ANIMATION_ENHANCED for ELBOW_STRIKE type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.ELBOW_STRIKE);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("elbow_strike");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
        expect(result.recoveryDuration).toBeCloseTo(160, 5);
      }
    });

    it("should use ELBOW_UPPERCUT_ANIMATION_ENHANCED for ELBOW_UPPERCUT type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.ELBOW_UPPERCUT);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("elbow_uppercut");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      }
    });

    it("should use KNEE_STRIKE_ANIMATION_ENHANCED for KNEE_STRIKE type", () => {
      const animation = ANIMATION_REGISTRY.get(AnimationType.KNEE_STRIKE);
      expect(animation).toBeDefined();

      if (animation) {
        expect(animation.name).toBe("knee_strike");

        // Verify it has recovery phase
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
        expect(result.recoveryDuration).toBeCloseTo(190, 5);
      }
    });
  });

  describe("getAnimationByType returns enhanced animations", () => {
    it("should return enhanced jab animation", () => {
      const animation = getAnimationByType(AnimationType.JAB);
      expect(animation).toBeDefined();

      if (animation) {
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      }
    });

    it("should return enhanced cross animation", () => {
      const animation = getAnimationByType(AnimationType.CROSS);
      expect(animation).toBeDefined();

      if (animation) {
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      }
    });

    it("should return enhanced kick animations", () => {
      const frontKick = getAnimationByType(AnimationType.FRONT_KICK);
      const roundhouse = getAnimationByType(AnimationType.ROUNDHOUSE_KICK);

      if (frontKick && roundhouse) {
        expect(validateRecoveryPhase(frontKick).isValid).toBe(true);
        expect(validateRecoveryPhase(roundhouse).isValid).toBe(true);
      }
    });
  });

  describe("All enhanced animations have proper recovery phases", () => {
    const enhancedTypes = [
      AnimationType.JAB,
      AnimationType.CROSS,
      AnimationType.FRONT_KICK,
      AnimationType.ROUNDHOUSE_KICK,
      AnimationType.ELBOW_STRIKE,
      AnimationType.ELBOW_UPPERCUT,
      AnimationType.KNEE_STRIKE,
    ];

    enhancedTypes.forEach((type) => {
      it(`should have valid recovery phase for ${type}`, () => {
        const animation = ANIMATION_REGISTRY.get(type);
        expect(animation).toBeDefined();

        if (animation) {
          const result = validateRecoveryPhase(animation);
          expect(result.isValid).toBe(true);
          expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
          expect(result.recoveryDuration).toBeLessThanOrEqual(250);
          expect(result.recoveryKeyframes).toBe(2);
        }
      });
    });
  });

  describe("Enhanced animations return to neutral position", () => {
    const enhancedTypes = [
      AnimationType.JAB,
      AnimationType.CROSS,
      AnimationType.FRONT_KICK,
      AnimationType.ROUNDHOUSE_KICK,
      AnimationType.ELBOW_STRIKE,
      AnimationType.ELBOW_UPPERCUT,
      AnimationType.KNEE_STRIKE,
    ];

    enhancedTypes.forEach((type) => {
      it(`should return to neutral for ${type}`, () => {
        const animation = ANIMATION_REGISTRY.get(type);
        expect(animation).toBeDefined();

        if (animation) {
          // Check final keyframe returns to neutral
          const finalFrame =
            animation.keyframes[animation.keyframes.length - 1];
          finalFrame.boneRotations.forEach((rotation) => {
            expect(Math.abs(rotation.x)).toBeLessThan(0.01);
            expect(Math.abs(rotation.y)).toBeLessThan(0.01);
            expect(Math.abs(rotation.z)).toBeLessThan(0.01);
          });
        }
      });
    });
  });

  describe("Korean Martial Arts Principles", () => {
    it("should implement 복귀 (Bokgwi) for all enhanced animations", () => {
      const enhancedTypes = [
        AnimationType.JAB,
        AnimationType.CROSS,
        AnimationType.FRONT_KICK,
        AnimationType.ROUNDHOUSE_KICK,
        AnimationType.ELBOW_STRIKE,
        AnimationType.ELBOW_UPPERCUT,
        AnimationType.KNEE_STRIKE,
      ];

      enhancedTypes.forEach((type) => {
        const animation = ANIMATION_REGISTRY.get(type);

        if (animation) {
          const result = validateRecoveryPhase(animation);

          // All should have proper recovery (복귀)
          expect(result.isValid).toBe(true);
          expect(result.recoveryKeyframes).toBe(2);
        }
      });
    });

    it("should have different recovery speeds based on technique type", () => {
      const jab = ANIMATION_REGISTRY.get(AnimationType.JAB);
      const cross = ANIMATION_REGISTRY.get(AnimationType.CROSS);
      const elbowStrike = ANIMATION_REGISTRY.get(AnimationType.ELBOW_STRIKE);

      if (jab && cross && elbowStrike) {
        const jabResult = validateRecoveryPhase(jab);
        const crossResult = validateRecoveryPhase(cross);
        const elbowResult = validateRecoveryPhase(elbowStrike);

        // Elbow should be fastest (close-range)
        expect(elbowResult.recoveryDuration).toBeLessThan(
          jabResult.recoveryDuration
        );

        // Power technique (cross) should be slower than jab
        expect(crossResult.recoveryDuration).toBeGreaterThan(
          jabResult.recoveryDuration
        );
      }
    });
  });

  describe("Performance", () => {
    it("should retrieve enhanced animations efficiently", () => {
      const startTime = performance.now();

      // Retrieve 1000 animations
      for (let i = 0; i < 1000; i++) {
        getAnimationByType(AnimationType.JAB);
        getAnimationByType(AnimationType.CROSS);
        getAnimationByType(AnimationType.FRONT_KICK);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 3000;

      // Should be extremely fast (just Map lookups)
      expect(avgTime).toBeLessThan(0.01);
    });
  });

  describe("Trigram Idle Animations", () => {
    it("should have stance_geon with multiple keyframes for breathing animation", () => {
      const anim = ALL_ANIMATIONS.get("stance_geon");

      expect(anim).toBeDefined();
      expect(anim!.name).toBe("stance_geon");
      expect(anim!.keyframes.length).toBeGreaterThan(1);
      expect(anim!.loop).toBe(true);
      expect(anim!.duration).toBeGreaterThan(1);

      // Check what bones are actually present
      const firstKeyframe = anim!.keyframes[0];
      const boneNames = [...firstKeyframe.boneRotations.keys()];

      // Debug: Log what bones are present
      console.log("stance_geon bone names:", boneNames);
      console.log("Total bones:", boneNames.length);

      // Log first keyframe rotations for key bones
      const shoulderL = firstKeyframe.boneRotations.get("shoulder_L");
      const hipL = firstKeyframe.boneRotations.get("hip_L");
      const pelvis = firstKeyframe.boneRotations.get("pelvis");
      console.log(
        "shoulder_L rotation:",
        shoulderL?.x,
        shoulderL?.y,
        shoulderL?.z
      );
      console.log("hip_L rotation:", hipL?.x, hipL?.y, hipL?.z);
      console.log("pelvis rotation:", pelvis?.x, pelvis?.y, pelvis?.z);

      // Log foot positions
      const footLPos = firstKeyframe.bonePositions?.get("foot_L");
      const footRPos = firstKeyframe.bonePositions?.get("foot_R");
      console.log("foot_L position:", footLPos?.x, footLPos?.y, footLPos?.z);
      console.log("foot_R position:", footRPos?.x, footRPos?.y, footRPos?.z);

      // Bones should include arm and leg bones with dramatic rotations
      expect(boneNames.length).toBeGreaterThan(5);
    });

    it("should have all 8 stance animations in ALL_ANIMATIONS", () => {
      const stances = [
        "stance_geon",
        "stance_tae",
        "stance_li",
        "stance_jin",
        "stance_son",
        "stance_gam",
        "stance_gan",
        "stance_gon",
      ];

      for (const stance of stances) {
        const anim = ALL_ANIMATIONS.get(stance);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(1);
        expect(anim!.loop).toBe(true);
      }
    });
  });
});
