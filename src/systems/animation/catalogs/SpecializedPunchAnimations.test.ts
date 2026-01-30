/**
 * Tests for Specialized Punch Animations Module
 *
 * Validates specialized punching techniques
 *
 * @module systems/animation/__tests__/SpecializedPunchAnimations
 * @korean 특수펀치애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { SPECIALIZED_PUNCH_ANIMATIONS } from "./SpecializedPunchAnimations";

describe("SpecializedPunchAnimations", () => {
  describe("SPECIALIZED_PUNCH_ANIMATIONS Map", () => {
    it("should be defined and be a Map", () => {
      expect(SPECIALIZED_PUNCH_ANIMATIONS).toBeDefined();
      expect(SPECIALIZED_PUNCH_ANIMATIONS).toBeInstanceOf(Map);
    });

    it("should contain specialized punch animations", () => {
      expect(SPECIALIZED_PUNCH_ANIMATIONS.size).toBeGreaterThan(0);
    });

    it("should contain animations with Korean names", () => {
      const values = Array.from(SPECIALIZED_PUNCH_ANIMATIONS.values());
      values.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("should have unique animation names", () => {
      const names = Array.from(SPECIALIZED_PUNCH_ANIMATIONS.keys());
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe("Animation Quality Standards", () => {
    const allPunches = Array.from(SPECIALIZED_PUNCH_ANIMATIONS.values());

    it("should have keyframes with valid time values", () => {
      allPunches.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(animation.duration);
        });
      });
    });

    it("should have first keyframe at time 0", () => {
      allPunches.forEach((animation) => {
        expect(animation.keyframes[0].time).toBe(0);
      });
    });

    it("should not be looping", () => {
      allPunches.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have minimum duration for visibility", () => {
      allPunches.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.3);
      });
    });

    it("should have time-ordered keyframes", () => {
      allPunches.forEach((animation) => {
        for (let i = 1; i < animation.keyframes.length; i++) {
          expect(animation.keyframes[i].time).toBeGreaterThan(
            animation.keyframes[i - 1].time,
          );
        }
      });
    });
  });

  describe("Performance Requirements", () => {
    const allPunches = Array.from(SPECIALIZED_PUNCH_ANIMATIONS.values());

    it("should have reasonable keyframe counts", () => {
      allPunches.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        expect(animation.keyframes.length).toBeLessThanOrEqual(25);
      });
    });

    it("should have durations suitable for real-time gameplay", () => {
      allPunches.forEach((animation) => {
        expect(animation.duration).toBeLessThanOrEqual(1.0);
      });
    });

    it("should have valid durations", () => {
      allPunches.forEach((animation) => {
        expect(animation.duration).toBeGreaterThan(0);
        expect(typeof animation.duration).toBe("number");
      });
    });
  });
});
