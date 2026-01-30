/**
 * Tests for Elbow and Knee Animations Module
 *
 * Validates close-range elbow and knee techniques:
 * - Elbow strikes (팔꿈치치기)
 * - Elbow uppercuts (팔꿈치올려치기)
 * - Knee strikes (무릎차기)
 * - Spinning elbows (회전팔꿈치)
 * - Downward elbows (내려팔꿈치)
 *
 * @module systems/animation/__tests__/ElbowKneeAnimations
 * @korean 팔꿈치무릎애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  DOWNWARD_ELBOW_ANIMATION,
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  KNEE_STRIKE_ANIMATION,
  SPINNING_ELBOW_ANIMATION,
} from "./ElbowKneeAnimations";

describe("ElbowKneeAnimations", () => {
  describe("ELBOW_STRIKE_ANIMATION (팔꿈치치기)", () => {
    it("should be defined with correct properties", () => {
      expect(ELBOW_STRIKE_ANIMATION).toBeDefined();
      expect(ELBOW_STRIKE_ANIMATION.name).toBe("elbow_strike");
      expect(ELBOW_STRIKE_ANIMATION.koreanName).toBe("팔꿈치치기");
      expect(ELBOW_STRIKE_ANIMATION.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for fast horizontal elbow", () => {
      expect(ELBOW_STRIKE_ANIMATION.duration).toBe(0.42);
      expect(typeof ELBOW_STRIKE_ANIMATION.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(ELBOW_STRIKE_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(ELBOW_STRIKE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should have time-ordered keyframes", () => {
      for (let i = 1; i < ELBOW_STRIKE_ANIMATION.keyframes.length; i++) {
        expect(ELBOW_STRIKE_ANIMATION.keyframes[i].time).toBeGreaterThan(
          ELBOW_STRIKE_ANIMATION.keyframes[i - 1].time,
        );
      }
    });
  });

  describe("ELBOW_UPPERCUT_ANIMATION (팔꿈치올려치기)", () => {
    it("should be defined with correct properties", () => {
      expect(ELBOW_UPPERCUT_ANIMATION).toBeDefined();
      expect(ELBOW_UPPERCUT_ANIMATION.name).toBe("elbow_uppercut");
      expect(ELBOW_UPPERCUT_ANIMATION.koreanName).toBe("팔꿈치올려치기");
    });

    it("should have valid duration for rising elbow", () => {
      expect(ELBOW_UPPERCUT_ANIMATION.duration).toBe(0.48);
      expect(ELBOW_UPPERCUT_ANIMATION.duration).toBeGreaterThan(
        ELBOW_STRIKE_ANIMATION.duration,
      );
    });

    it("should not be looping", () => {
      expect(ELBOW_UPPERCUT_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(ELBOW_UPPERCUT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
        3,
      );
    });
  });

  describe("KNEE_STRIKE_ANIMATION (무릎차기)", () => {
    it("should be defined with correct properties", () => {
      expect(KNEE_STRIKE_ANIMATION).toBeDefined();
      expect(KNEE_STRIKE_ANIMATION.name).toBe("knee_strike");
      expect(KNEE_STRIKE_ANIMATION.koreanName).toBe("무릎차기");
    });

    it("should have valid duration", () => {
      expect(KNEE_STRIKE_ANIMATION.duration).toBe(0.4);
    });

    it("should not be looping", () => {
      expect(KNEE_STRIKE_ANIMATION.loop).toBe(false);
    });

    it("should have at least 2 keyframes", () => {
      expect(KNEE_STRIKE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("SPINNING_ELBOW_ANIMATION (회전팔꿈치)", () => {
    it("should be defined with correct properties", () => {
      expect(SPINNING_ELBOW_ANIMATION).toBeDefined();
      expect(SPINNING_ELBOW_ANIMATION.name).toBe("spinning_elbow");
      expect(SPINNING_ELBOW_ANIMATION.koreanName).toBe("회전팔꿈치");
    });

    it("should have valid duration for 360° spin", () => {
      expect(SPINNING_ELBOW_ANIMATION.duration).toBe(0.5);
      expect(SPINNING_ELBOW_ANIMATION.duration).toBeGreaterThan(
        ELBOW_STRIKE_ANIMATION.duration,
      );
    });

    it("should not be looping", () => {
      expect(SPINNING_ELBOW_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(SPINNING_ELBOW_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
        3,
      );
    });
  });

  describe("DOWNWARD_ELBOW_ANIMATION (내려팔꿈치)", () => {
    it("should be defined with correct properties", () => {
      expect(DOWNWARD_ELBOW_ANIMATION).toBeDefined();
      expect(DOWNWARD_ELBOW_ANIMATION.name).toBe("downward_elbow");
      expect(DOWNWARD_ELBOW_ANIMATION.koreanName).toBe("내려팔꿈치");
    });

    it("should have valid duration", () => {
      expect(DOWNWARD_ELBOW_ANIMATION.duration).toBe(0.4);
    });

    it("should not be looping", () => {
      expect(DOWNWARD_ELBOW_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(DOWNWARD_ELBOW_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
        3,
      );
    });
  });

  describe("Animation Quality Standards", () => {
    const allAnimations = [
      ELBOW_STRIKE_ANIMATION,
      ELBOW_UPPERCUT_ANIMATION,
      KNEE_STRIKE_ANIMATION,
      SPINNING_ELBOW_ANIMATION,
      DOWNWARD_ELBOW_ANIMATION,
    ];

    it("should have keyframes with valid time values", () => {
      allAnimations.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(animation.duration);
        });
      });
    });

    it("should have first keyframe at time 0", () => {
      allAnimations.forEach((animation) => {
        expect(animation.keyframes[0].time).toBe(0);
      });
    });

    it("should not be looping", () => {
      allAnimations.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have Korean names", () => {
      allAnimations.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("should have bone rotations as Euler objects", () => {
      allAnimations.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          kf.boneRotations.forEach((rotation) => {
            expect(rotation).toBeDefined();
            expect(typeof rotation.x).toBe("number");
            expect(typeof rotation.y).toBe("number");
            expect(typeof rotation.z).toBe("number");
          });
        });
      });
    });
  });

  describe("Performance Requirements", () => {
    const allAnimations = [
      ELBOW_STRIKE_ANIMATION,
      ELBOW_UPPERCUT_ANIMATION,
      KNEE_STRIKE_ANIMATION,
      SPINNING_ELBOW_ANIMATION,
      DOWNWARD_ELBOW_ANIMATION,
    ];

    it("should have reasonable keyframe counts", () => {
      allAnimations.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        expect(animation.keyframes.length).toBeLessThanOrEqual(20);
      });
    });

    it("should have durations suitable for real-time gameplay", () => {
      allAnimations.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.3);
        expect(animation.duration).toBeLessThanOrEqual(1.0);
      });
    });
  });

  describe("Technique Type Classification", () => {
    it("should classify elbow strikes as close-range techniques", () => {
      expect(ELBOW_STRIKE_ANIMATION.duration).toBeLessThanOrEqual(0.5);
      expect(ELBOW_UPPERCUT_ANIMATION.duration).toBeLessThanOrEqual(0.5);
      expect(DOWNWARD_ELBOW_ANIMATION.duration).toBeLessThanOrEqual(0.5);
    });

    it("should classify spinning elbow as slower technique", () => {
      expect(SPINNING_ELBOW_ANIMATION.duration).toBeGreaterThan(
        ELBOW_STRIKE_ANIMATION.duration,
      );
    });

    it("should classify knee strike as clinch-range technique", () => {
      expect(KNEE_STRIKE_ANIMATION.duration).toBeLessThanOrEqual(0.5);
    });
  });
});
