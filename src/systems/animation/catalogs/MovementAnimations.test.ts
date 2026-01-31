/**
 * Tests for Movement Animations Module
 *
 * Validates footwork, dodges, and movement techniques
 *
 * @module systems/animation/__tests__/MovementAnimations
 * @korean 이동애니메이션테스트
 */

import { BoneName } from "@/types/skeletal";
import { describe, expect, it } from "vitest";
import { MOVEMENT_FORWARD_STEP_ANIMATION } from "./MovementAnimations";

describe("MovementAnimations", () => {
  describe("MOVEMENT_FORWARD_STEP_ANIMATION (전진스텝)", () => {
    it("should be defined with correct properties", () => {
      expect(MOVEMENT_FORWARD_STEP_ANIMATION).toBeDefined();
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.name).toBe(
        "movement_forward_step",
      );
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.koreanName).toBe("전진스텝");
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for forward step", () => {
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.duration).toBe(0.6);
      expect(typeof MOVEMENT_FORWARD_STEP_ANIMATION.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.loop).toBe(false);
    });

    it("should have at least 4 keyframes for weight transfer", () => {
      expect(
        MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.length,
      ).toBeGreaterThanOrEqual(4);
    });

    it("should have time-ordered keyframes", () => {
      for (
        let i = 1;
        i < MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.length;
        i++
      ) {
        expect(MOVEMENT_FORWARD_STEP_ANIMATION.keyframes[i].time).toBeGreaterThan(
          MOVEMENT_FORWARD_STEP_ANIMATION.keyframes[i - 1].time,
        );
      }
    });

    it("should include pelvis movement", () => {
      const hasPelvisMovement = MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.some(
        (kf) => {
          return kf.bonePositions.has(BoneName.PELVIS);
        },
      );
      expect(hasPelvisMovement).toBe(true);
    });

    it("should include leg movements", () => {
      const hasLegMovement = MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.some(
        (kf) => {
          return (
            kf.boneRotations.has(BoneName.HIP_L) ||
            kf.boneRotations.has(BoneName.KNEE_L)
          );
        },
      );
      expect(hasLegMovement).toBe(true);
    });

    it("should include foot rotation for heel strike", () => {
      const hasFootRotation = MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.some(
        (kf) => {
          return kf.boneRotations.has(BoneName.FOOT_L);
        },
      );
      expect(hasFootRotation).toBe(true);
    });
  });

  describe("Animation Quality Standards", () => {
    it("should have keyframes with valid time values", () => {
      MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.forEach((kf) => {
        expect(kf.time).toBeGreaterThanOrEqual(0);
        expect(kf.time).toBeLessThanOrEqual(
          MOVEMENT_FORWARD_STEP_ANIMATION.duration,
        );
      });
    });

    it("should have first keyframe at time 0", () => {
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.keyframes[0].time).toBe(0);
    });

    it("should have Korean name defined", () => {
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.koreanName).toBeDefined();
      expect(typeof MOVEMENT_FORWARD_STEP_ANIMATION.koreanName).toBe("string");
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.koreanName.length).toBeGreaterThan(
        0,
      );
    });
  });

  describe("Performance Requirements", () => {
    it("should have reasonable keyframe count", () => {
      expect(
        MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.length,
      ).toBeGreaterThanOrEqual(3);
      expect(
        MOVEMENT_FORWARD_STEP_ANIMATION.keyframes.length,
      ).toBeLessThanOrEqual(30);
    });

    it("should have duration suitable for movement", () => {
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.duration).toBeGreaterThanOrEqual(
        0.3,
      );
      expect(MOVEMENT_FORWARD_STEP_ANIMATION.duration).toBeLessThanOrEqual(1.5);
    });
  });
});
