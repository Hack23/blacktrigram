/**
 * Tests for Step Skeletal Animations Module
 *
 * Validates tactical step movement animations
 *
 * @module systems/animation/__tests__/StepSkeletalAnimations
 * @korean 발걸음애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  getStepAnimation,
  STEP_ANIMATIONS,
  STEP_BACK_ANIMATION,
  STEP_FORWARD_ANIMATION,
  STEP_LEFT_ANIMATION,
  STEP_RIGHT_ANIMATION,
} from "./StepSkeletalAnimations";

describe("StepSkeletalAnimations", () => {
  describe("STEP_FORWARD_ANIMATION (전진보법)", () => {
    it("should be defined with correct properties", () => {
      expect(STEP_FORWARD_ANIMATION).toBeDefined();
      expect(STEP_FORWARD_ANIMATION.name).toBe("step_forward");
      expect(STEP_FORWARD_ANIMATION.koreanName).toBe("전진보법");
      expect(STEP_FORWARD_ANIMATION.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for tactical step", () => {
      expect(STEP_FORWARD_ANIMATION.duration).toBe(0.3);
      expect(typeof STEP_FORWARD_ANIMATION.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(STEP_FORWARD_ANIMATION.loop).toBe(false);
    });

    it("should have at least 2 keyframes", () => {
      expect(STEP_FORWARD_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it("should have time-ordered keyframes", () => {
      for (let i = 1; i < STEP_FORWARD_ANIMATION.keyframes.length; i++) {
        expect(STEP_FORWARD_ANIMATION.keyframes[i].time).toBeGreaterThan(
          STEP_FORWARD_ANIMATION.keyframes[i - 1].time,
        );
      }
    });
  });

  describe("STEP_BACK_ANIMATION (후진보법)", () => {
    it("should be defined with correct properties", () => {
      expect(STEP_BACK_ANIMATION).toBeDefined();
      expect(STEP_BACK_ANIMATION.name).toBe("step_back");
      expect(STEP_BACK_ANIMATION.koreanName).toBe("후진보법");
    });

    it("should have same duration as forward step", () => {
      expect(STEP_BACK_ANIMATION.duration).toBe(STEP_FORWARD_ANIMATION.duration);
    });

    it("should not be looping", () => {
      expect(STEP_BACK_ANIMATION.loop).toBe(false);
    });
  });

  describe("STEP_LEFT_ANIMATION (좌측보법)", () => {
    it("should be defined with correct properties", () => {
      expect(STEP_LEFT_ANIMATION).toBeDefined();
      expect(STEP_LEFT_ANIMATION.name).toBe("step_left");
      expect(STEP_LEFT_ANIMATION.koreanName).toBe("좌측보법");
    });

    it("should have same duration as forward step", () => {
      expect(STEP_LEFT_ANIMATION.duration).toBe(STEP_FORWARD_ANIMATION.duration);
    });

    it("should not be looping", () => {
      expect(STEP_LEFT_ANIMATION.loop).toBe(false);
    });
  });

  describe("STEP_RIGHT_ANIMATION (우측보법)", () => {
    it("should be defined with correct properties", () => {
      expect(STEP_RIGHT_ANIMATION).toBeDefined();
      expect(STEP_RIGHT_ANIMATION.name).toBe("step_right");
      expect(STEP_RIGHT_ANIMATION.koreanName).toBe("우측보법");
    });

    it("should have same duration as forward step", () => {
      expect(STEP_RIGHT_ANIMATION.duration).toBe(
        STEP_FORWARD_ANIMATION.duration,
      );
    });

    it("should not be looping", () => {
      expect(STEP_RIGHT_ANIMATION.loop).toBe(false);
    });
  });

  describe("STEP_ANIMATIONS Map", () => {
    it("should be defined and be a Map", () => {
      expect(STEP_ANIMATIONS).toBeDefined();
      expect(STEP_ANIMATIONS).toBeInstanceOf(Map);
    });

    it("should contain exactly 4 step animations", () => {
      expect(STEP_ANIMATIONS.size).toBe(4);
    });

    it("should contain all step animations", () => {
      expect(STEP_ANIMATIONS.get("step_forward")).toBe(STEP_FORWARD_ANIMATION);
      expect(STEP_ANIMATIONS.get("step_back")).toBe(STEP_BACK_ANIMATION);
      expect(STEP_ANIMATIONS.get("step_left")).toBe(STEP_LEFT_ANIMATION);
      expect(STEP_ANIMATIONS.get("step_right")).toBe(STEP_RIGHT_ANIMATION);
    });

    it("should contain animations with Korean names", () => {
      const values = Array.from(STEP_ANIMATIONS.values());
      values.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getStepAnimation function", () => {
    it("should return correct animation by name", () => {
      expect(getStepAnimation("step_forward")).toBe(STEP_FORWARD_ANIMATION);
      expect(getStepAnimation("step_back")).toBe(STEP_BACK_ANIMATION);
      expect(getStepAnimation("step_left")).toBe(STEP_LEFT_ANIMATION);
      expect(getStepAnimation("step_right")).toBe(STEP_RIGHT_ANIMATION);
    });

    it("should return undefined for invalid name", () => {
      expect(getStepAnimation("invalid_step")).toBeUndefined();
    });
  });

  describe("Animation Quality Standards", () => {
    const allSteps = [
      STEP_FORWARD_ANIMATION,
      STEP_BACK_ANIMATION,
      STEP_LEFT_ANIMATION,
      STEP_RIGHT_ANIMATION,
    ];

    it("should have keyframes with valid time values", () => {
      allSteps.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(animation.duration);
        });
      });
    });

    it("should have first keyframe at time 0", () => {
      allSteps.forEach((animation) => {
        expect(animation.keyframes[0].time).toBe(0);
      });
    });

    it("should not be looping", () => {
      allSteps.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have consistent durations", () => {
      const duration = STEP_FORWARD_ANIMATION.duration;
      allSteps.forEach((animation) => {
        expect(animation.duration).toBe(duration);
      });
    });
  });

  describe("Performance Requirements", () => {
    const allSteps = [
      STEP_FORWARD_ANIMATION,
      STEP_BACK_ANIMATION,
      STEP_LEFT_ANIMATION,
      STEP_RIGHT_ANIMATION,
    ];

    it("should have reasonable keyframe counts", () => {
      allSteps.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        expect(animation.keyframes.length).toBeLessThanOrEqual(15);
      });
    });

    it("should have fast durations for tactical movement", () => {
      allSteps.forEach((animation) => {
        expect(animation.duration).toBeLessThanOrEqual(0.5);
      });
    });
  });
});
