/**
 * Tests for Stance Idle Animations Module
 *
 * Validates idle stance animations for different trigrams
 *
 * @module systems/animation/__tests__/StanceIdleAnimations
 * @korean 자세대기애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  ALL_TRIGRAM_IDLE_ANIMATIONS,
  GAM_IDLE_ANIMATION,
  GAN_IDLE_ANIMATION,
  GEON_IDLE_ANIMATION,
  GON_IDLE_ANIMATION,
  JIN_IDLE_ANIMATION,
  LI_IDLE_ANIMATION,
  SON_IDLE_ANIMATION,
  TAE_IDLE_ANIMATION,
  TRIGRAM_IDLE_ANIMATIONS,
  TRIGRAM_IDLE_METADATA,
} from "./StanceIdleAnimations";

describe("StanceIdleAnimations", () => {
  describe("Individual Trigram Idle Animations", () => {
    const allAnimations = [
      GEON_IDLE_ANIMATION,
      TAE_IDLE_ANIMATION,
      LI_IDLE_ANIMATION,
      JIN_IDLE_ANIMATION,
      SON_IDLE_ANIMATION,
      GAM_IDLE_ANIMATION,
      GAN_IDLE_ANIMATION,
      GON_IDLE_ANIMATION,
    ];

    it("should all be defined", () => {
      allAnimations.forEach((animation) => {
        expect(animation).toBeDefined();
      });
    });

    it("should all have Korean names", () => {
      allAnimations.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
      });
    });

    it("should all be looping", () => {
      allAnimations.forEach((animation) => {
        expect(animation.loop).toBe(true);
      });
    });

    it("should have valid durations", () => {
      allAnimations.forEach((animation) => {
        expect(animation.duration).toBeGreaterThan(0);
        expect(typeof animation.duration).toBe("number");
      });
    });
  });

  describe("TRIGRAM_IDLE_ANIMATIONS Map", () => {
    it("should be defined and be a Map", () => {
      expect(TRIGRAM_IDLE_ANIMATIONS).toBeDefined();
      expect(TRIGRAM_IDLE_ANIMATIONS).toBeInstanceOf(Map);
    });

    it("should contain all 8 trigram idle animations", () => {
      expect(TRIGRAM_IDLE_ANIMATIONS.size).toBe(8);
    });
  });

  describe("ALL_TRIGRAM_IDLE_ANIMATIONS Array", () => {
    it("should be defined as an array", () => {
      expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toBeDefined();
      expect(Array.isArray(ALL_TRIGRAM_IDLE_ANIMATIONS)).toBe(true);
    });

    it("should contain all 8 trigram idle animations", () => {
      expect(ALL_TRIGRAM_IDLE_ANIMATIONS.length).toBe(8);
    });
  });

  describe("TRIGRAM_IDLE_METADATA", () => {
    it("should be defined as an object", () => {
      expect(TRIGRAM_IDLE_METADATA).toBeDefined();
      expect(typeof TRIGRAM_IDLE_METADATA).toBe("object");
    });

    it("should contain metadata for all 8 trigrams", () => {
      expect(TRIGRAM_IDLE_METADATA.GEON).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.TAE).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.LI).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.JIN).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.SON).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.GAM).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.GAN).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA.GON).toBeDefined();
    });

    it("should have Korean and English names for each stance", () => {
      Object.values(TRIGRAM_IDLE_METADATA).forEach((metadata) => {
        expect(metadata.korean).toBeDefined();
        expect(metadata.english).toBeDefined();
        expect(typeof metadata.korean).toBe("string");
        expect(typeof metadata.english).toBe("string");
      });
    });

    it("should have breathing durations for each stance", () => {
      Object.values(TRIGRAM_IDLE_METADATA).forEach((metadata) => {
        expect(metadata.breathingDuration).toBeGreaterThan(0);
        expect(typeof metadata.breathingDuration).toBe("number");
      });
    });
  });

  describe("Animation Quality Standards", () => {
    it("should have keyframes with valid time values", () => {
      ALL_TRIGRAM_IDLE_ANIMATIONS.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(animation.duration);
        });
      });
    });

    it("should have first keyframe at time 0", () => {
      ALL_TRIGRAM_IDLE_ANIMATIONS.forEach((animation) => {
        expect(animation.keyframes[0].time).toBe(0);
      });
    });

    it("should have time-ordered keyframes", () => {
      ALL_TRIGRAM_IDLE_ANIMATIONS.forEach((animation) => {
        for (let i = 1; i < animation.keyframes.length; i++) {
          expect(animation.keyframes[i].time).toBeGreaterThan(
            animation.keyframes[i - 1].time,
          );
        }
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should have reasonable keyframe counts", () => {
      ALL_TRIGRAM_IDLE_ANIMATIONS.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        expect(animation.keyframes.length).toBeLessThanOrEqual(30);
      });
    });

    it("should have durations suitable for idle animations", () => {
      ALL_TRIGRAM_IDLE_ANIMATIONS.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(1.0);
        expect(animation.duration).toBeLessThanOrEqual(5.0);
      });
    });
  });
});
