/**
 * Tests for Grappling Animations Module
 *
 * Validates throw, lock, and grappling animations:
 * - Hip throws (던지기)
 * - Joint locks (관절기)
 * - Counter attacks (반격)
 * - Defensive blocks (막기)
 * - Wrist locks (손목꺾기)
 *
 * @module systems/animation/__tests__/GrapplingAnimations
 * @korean 잡기애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  BLOCK_ANIMATION,
  COUNTER_ATTACK_ANIMATION,
  GRAPPLE_ANIMATION,
  THROW_ANIMATION,
  WRIST_LOCK_ANIMATION,
} from "./GrapplingAnimations";

describe("GrapplingAnimations", () => {
  describe("THROW_ANIMATION (던지기)", () => {
    it("should be defined with correct properties", () => {
      expect(THROW_ANIMATION).toBeDefined();
      expect(THROW_ANIMATION.name).toBe("throw");
      expect(THROW_ANIMATION.koreanName).toBe("던지기");
      expect(THROW_ANIMATION.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for hip throw", () => {
      expect(THROW_ANIMATION.duration).toBe(0.7);
      expect(typeof THROW_ANIMATION.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(THROW_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(THROW_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should have time-ordered keyframes", () => {
      for (let i = 1; i < THROW_ANIMATION.keyframes.length; i++) {
        expect(THROW_ANIMATION.keyframes[i].time).toBeGreaterThan(
          THROW_ANIMATION.keyframes[i - 1].time,
        );
      }
    });
  });

  describe("GRAPPLE_ANIMATION (관절기)", () => {
    it("should be defined with correct properties", () => {
      expect(GRAPPLE_ANIMATION).toBeDefined();
      expect(GRAPPLE_ANIMATION.name).toBe("grapple");
      expect(GRAPPLE_ANIMATION.koreanName).toBe("관절기");
    });

    it("should have valid duration for joint lock", () => {
      expect(GRAPPLE_ANIMATION.duration).toBe(0.65);
      expect(GRAPPLE_ANIMATION.duration).toBeGreaterThan(0.5);
    });

    it("should not be looping", () => {
      expect(GRAPPLE_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(GRAPPLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("COUNTER_ATTACK_ANIMATION (반격)", () => {
    it("should be defined with correct properties", () => {
      expect(COUNTER_ATTACK_ANIMATION).toBeDefined();
      expect(COUNTER_ATTACK_ANIMATION.name).toBe("counter_attack");
      expect(COUNTER_ATTACK_ANIMATION.koreanName).toBe("반격");
    });

    it("should have valid duration", () => {
      expect(COUNTER_ATTACK_ANIMATION.duration).toBe(0.45);
    });

    it("should not be looping", () => {
      expect(COUNTER_ATTACK_ANIMATION.loop).toBe(false);
    });

    it("should have at least 2 keyframes for parry+counter", () => {
      expect(COUNTER_ATTACK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
        2,
      );
    });
  });

  describe("BLOCK_ANIMATION (막기)", () => {
    it("should be defined with correct properties", () => {
      expect(BLOCK_ANIMATION).toBeDefined();
      expect(BLOCK_ANIMATION.name).toBe("block");
      expect(BLOCK_ANIMATION.koreanName).toBe("막기");
    });

    it("should have valid duration for defensive block", () => {
      expect(BLOCK_ANIMATION.duration).toBeGreaterThan(0);
    });

    it("should not be looping", () => {
      expect(BLOCK_ANIMATION.loop).toBe(false);
    });

    it("should have at least 2 keyframes", () => {
      expect(BLOCK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("WRIST_LOCK_ANIMATION (손목꺾기)", () => {
    it("should be defined with correct properties", () => {
      expect(WRIST_LOCK_ANIMATION).toBeDefined();
      expect(WRIST_LOCK_ANIMATION.name).toBe("wrist_lock");
      expect(WRIST_LOCK_ANIMATION.koreanName).toBe("손목꺾기");
    });

    it("should have valid duration for joint manipulation", () => {
      expect(WRIST_LOCK_ANIMATION.duration).toBe(0.75);
    });

    it("should not be looping", () => {
      expect(WRIST_LOCK_ANIMATION.loop).toBe(false);
    });

    it("should have at least 3 keyframes", () => {
      expect(WRIST_LOCK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Animation Quality Standards", () => {
    const allAnimations = [
      THROW_ANIMATION,
      GRAPPLE_ANIMATION,
      COUNTER_ATTACK_ANIMATION,
      BLOCK_ANIMATION,
      WRIST_LOCK_ANIMATION,
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
  });

  describe("Performance Requirements", () => {
    const allAnimations = [
      THROW_ANIMATION,
      GRAPPLE_ANIMATION,
      COUNTER_ATTACK_ANIMATION,
      BLOCK_ANIMATION,
      WRIST_LOCK_ANIMATION,
    ];

    it("should have reasonable keyframe counts", () => {
      allAnimations.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        expect(animation.keyframes.length).toBeLessThanOrEqual(20);
      });
    });

    it("should have durations suitable for real-time gameplay", () => {
      allAnimations.forEach((animation) => {
        expect(animation.duration).toBeLessThanOrEqual(1.0);
      });
    });
  });

  describe("Technique Type Classification", () => {
    it("should classify counter attack as fast defensive technique", () => {
      expect(COUNTER_ATTACK_ANIMATION.duration).toBeLessThanOrEqual(0.5);
    });

    it("should classify grapple as slower technique", () => {
      expect(GRAPPLE_ANIMATION.duration).toBeGreaterThan(
        COUNTER_ATTACK_ANIMATION.duration,
      );
    });
  });
});
