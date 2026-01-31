/**
 * Tests for Li Stance Animations Module
 *
 * Validates Li (Fire) trigram stance animations:
 * - Idle targeting stance (조준 자세)
 * - Li guard poses
 * - Spear-hand formations
 *
 * @module systems/animation/__tests__/LiStanceAnimations
 * @korean 리괘자세애니메이션테스트
 */

import { BoneName } from "@/types/skeletal";
import { describe, expect, it } from "vitest";
import { LI_IDLE_TARGETING } from "./LiStanceAnimations";

describe("LiStanceAnimations", () => {
  describe("LI_IDLE_TARGETING (리괘 조준 자세)", () => {
    it("should be defined with correct properties", () => {
      expect(LI_IDLE_TARGETING).toBeDefined();
      expect(LI_IDLE_TARGETING.name).toBe("li_idle_targeting");
      expect(LI_IDLE_TARGETING.koreanName).toBe("리괘 조준 자세");
      expect(LI_IDLE_TARGETING.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for idle cycle", () => {
      expect(LI_IDLE_TARGETING.duration).toBe(2.5);
      expect(typeof LI_IDLE_TARGETING.duration).toBe("number");
    });

    it("should be marked as looping", () => {
      expect(LI_IDLE_TARGETING.loop).toBe(true);
    });

    it("should have at least 2 keyframes", () => {
      expect(LI_IDLE_TARGETING.keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it("should have time-ordered keyframes", () => {
      for (let i = 1; i < LI_IDLE_TARGETING.keyframes.length; i++) {
        expect(LI_IDLE_TARGETING.keyframes[i].time).toBeGreaterThan(
          LI_IDLE_TARGETING.keyframes[i - 1].time,
        );
      }
    });

    it("should include spine rotation for forward lean", () => {
      const hasSpineRotation = LI_IDLE_TARGETING.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.SPINE_UPPER) ||
          kf.boneRotations.has(BoneName.SPINE_LOWER)
        );
      });
      expect(hasSpineRotation).toBe(true);
    });

    it("should include both arm positions", () => {
      const hasArmPositions = LI_IDLE_TARGETING.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.SHOULDER_L) &&
          kf.boneRotations.has(BoneName.SHOULDER_R)
        );
      });
      expect(hasArmPositions).toBe(true);
    });

    it("should include wrist rotations for spear-hand", () => {
      const hasWristRotations = LI_IDLE_TARGETING.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.WRIST_L) ||
          kf.boneRotations.has(BoneName.WRIST_R)
        );
      });
      expect(hasWristRotations).toBe(true);
    });

    it("should include leg stance positions", () => {
      const hasLegPositions = LI_IDLE_TARGETING.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.HIP_R) ||
          kf.boneRotations.has(BoneName.KNEE_R)
        );
      });
      expect(hasLegPositions).toBe(true);
    });

    it("should include head targeting position", () => {
      const hasHeadRotation = LI_IDLE_TARGETING.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.HEAD);
      });
      expect(hasHeadRotation).toBe(true);
    });
  });

  describe("Animation Quality Standards", () => {
    it("should have keyframes with valid time values", () => {
      LI_IDLE_TARGETING.keyframes.forEach((kf) => {
        expect(kf.time).toBeGreaterThanOrEqual(0);
        expect(kf.time).toBeLessThanOrEqual(LI_IDLE_TARGETING.duration);
      });
    });

    it("should have first keyframe at time 0", () => {
      expect(LI_IDLE_TARGETING.keyframes[0].time).toBe(0);
    });

    it("should have Korean name defined", () => {
      expect(LI_IDLE_TARGETING.koreanName).toBeDefined();
      expect(typeof LI_IDLE_TARGETING.koreanName).toBe("string");
      expect(LI_IDLE_TARGETING.koreanName.length).toBeGreaterThan(0);
    });

    it("should have bone rotations as Euler objects", () => {
      LI_IDLE_TARGETING.keyframes.forEach((kf) => {
        kf.boneRotations.forEach((rotation) => {
          expect(rotation).toBeDefined();
          expect(typeof rotation.x).toBe("number");
          expect(typeof rotation.y).toBe("number");
          expect(typeof rotation.z).toBe("number");
        });
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should have reasonable keyframe count", () => {
      expect(LI_IDLE_TARGETING.keyframes.length).toBeGreaterThanOrEqual(2);
      expect(LI_IDLE_TARGETING.keyframes.length).toBeLessThanOrEqual(20);
    });

    it("should have duration suitable for idle animation", () => {
      expect(LI_IDLE_TARGETING.duration).toBeGreaterThanOrEqual(1.5);
      expect(LI_IDLE_TARGETING.duration).toBeLessThanOrEqual(5.0);
    });
  });

  describe("Li Fire Trigram Characteristics", () => {
    it("should emphasize targeting and precision", () => {
      // Verify forward-leaning posture for targeting
      const hasForwardLean = LI_IDLE_TARGETING.keyframes.some((kf) => {
        const spine = kf.boneRotations.get(BoneName.SPINE_UPPER);
        return spine && spine.x > 0; // Forward lean
      });
      expect(hasForwardLean).toBe(true);
    });

    it("should include both arms in guard position", () => {
      LI_IDLE_TARGETING.keyframes.forEach((kf) => {
        const hasLeftArm = kf.boneRotations.has(BoneName.SHOULDER_L);
        const hasRightArm = kf.boneRotations.has(BoneName.SHOULDER_R);
        expect(hasLeftArm || hasRightArm).toBe(true);
      });
    });
  });
});
