/**
 * Tests for Li Technique Animations Module
 *
 * Validates Li (Fire) trigram technique animations
 *
 * @module systems/animation/__tests__/LiTechniqueAnimations
 * @korean 리괘기술애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  LI_FIRE_SPEAR_ANIMATION,
  LI_NERVE_STRIKE_COMBO,
} from "./LiTechniqueAnimations";

describe("LiTechniqueAnimations", () => {
  describe("LI_FIRE_SPEAR_ANIMATION", () => {
    it("should be defined with correct properties", () => {
      expect(LI_FIRE_SPEAR_ANIMATION).toBeDefined();
      expect(LI_FIRE_SPEAR_ANIMATION.koreanName).toBeDefined();
      expect(typeof LI_FIRE_SPEAR_ANIMATION.koreanName).toBe("string");
    });

    it("should have valid duration", () => {
      expect(LI_FIRE_SPEAR_ANIMATION.duration).toBeGreaterThan(0);
      expect(typeof LI_FIRE_SPEAR_ANIMATION.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(LI_FIRE_SPEAR_ANIMATION.loop).toBe(false);
    });

    it("should have at least 2 keyframes", () => {
      expect(LI_FIRE_SPEAR_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
        2,
      );
    });
  });

  describe("LI_NERVE_STRIKE_COMBO", () => {
    it("should be defined with correct properties", () => {
      expect(LI_NERVE_STRIKE_COMBO).toBeDefined();
      expect(LI_NERVE_STRIKE_COMBO.koreanName).toBeDefined();
      expect(typeof LI_NERVE_STRIKE_COMBO.koreanName).toBe("string");
    });

    it("should have valid duration", () => {
      expect(LI_NERVE_STRIKE_COMBO.duration).toBeGreaterThan(0);
      expect(typeof LI_NERVE_STRIKE_COMBO.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(LI_NERVE_STRIKE_COMBO.loop).toBe(false);
    });

    it("should have at least 2 keyframes", () => {
      expect(LI_NERVE_STRIKE_COMBO.keyframes.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Animation Quality Standards", () => {
    const allTechniques = [LI_FIRE_SPEAR_ANIMATION, LI_NERVE_STRIKE_COMBO];

    it("should have keyframes with valid time values", () => {
      allTechniques.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(animation.duration);
        });
      });
    });

    it("should have first keyframe at time 0", () => {
      allTechniques.forEach((animation) => {
        expect(animation.keyframes[0].time).toBe(0);
      });
    });

    it("should not be looping", () => {
      allTechniques.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have minimum duration for visibility", () => {
      allTechniques.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.3);
      });
    });

    it("should have Korean names", () => {
      allTechniques.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Performance Requirements", () => {
    const allTechniques = [LI_FIRE_SPEAR_ANIMATION, LI_NERVE_STRIKE_COMBO];

    it("should have reasonable keyframe counts", () => {
      allTechniques.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        expect(animation.keyframes.length).toBeLessThanOrEqual(40);
      });
    });

    it("should have durations suitable for real-time gameplay", () => {
      allTechniques.forEach((animation) => {
        expect(animation.duration).toBeLessThanOrEqual(2.0);
      });
    });
  });
});
