/**
 * Unit tests for PunchAnimations with Korean martial arts biomechanics
 *
 * Tests proper implementation of:
 * - Hip rotation (엉덩이회전)
 * - Shoulder torque (어깨비틀기)
 * - Fist rotation (주먹회전)
 * - Hikite - opposite arm pulling (당기기)
 * - Full arm extension (팔완전펴기)
 *
 * @module systems/animation/PunchAnimations.test
 */

import { describe, expect, it } from "vitest";
import { BoneName } from "../../types/skeletal";
import {
  JAB_ANIMATION,
  CROSS_ANIMATION,
  HOOK_ANIMATION,
  UPPERCUT_ANIMATION,
} from "./PunchAnimations";

describe("PunchAnimations - Korean Martial Arts Biomechanics", () => {
  describe("JAB_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(JAB_ANIMATION.name).toBe("jab");
      expect(JAB_ANIMATION.koreanName).toBe("잽");
      expect(JAB_ANIMATION.type).toBe("attack");
    });

    it("should animate left arm (lead hand in orthodox stance)", () => {
      const hasLeftShoulder = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_L)
      );
      const hasLeftElbow = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.ELBOW_L)
      );

      expect(hasLeftShoulder).toBe(true);
      expect(hasLeftElbow).toBe(true);
    });

    it("should have hip rotation for speed", () => {
      // JAB should have hip rotation (using EXTENSION phase values)
      const pelvisRotations = JAB_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.PELVIS))
        .map((kf) => kf.boneRotations.get(BoneName.PELVIS));

      const maxPelvisRotation = Math.max(
        ...pelvisRotations.map((rot) => Math.abs(rot?.y ?? 0))
      );

      // Jab should have hip rotation (> 0)
      expect(maxPelvisRotation).toBeGreaterThan(0);
      // Should have rotation but not excessive (< 0.5 radians)
      expect(maxPelvisRotation).toBeLessThan(0.5);
    });

    it("should include shoulder rotation", () => {
      const spineRotations = JAB_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.SPINE_UPPER))
        .map((kf) => kf.boneRotations.get(BoneName.SPINE_UPPER));

      const hasSpineRotation = spineRotations.some((rot) => (rot?.y ?? 0) > 0);
      expect(hasSpineRotation).toBe(true);
    });

    it("should include hikite (opposite arm pulling back)", () => {
      // Right arm should pull back as left arm punches
      const hasRightShoulder = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_R)
      );
      const hasRightElbow = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.ELBOW_R)
      );

      expect(hasRightShoulder).toBe(true);
      expect(hasRightElbow).toBe(true);
    });

    it("should have full arm extension at peak", () => {
      // Find the keyframe with maximum left elbow extension
      const elbowRotations = JAB_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.ELBOW_L))
        .map((kf) => kf.boneRotations.get(BoneName.ELBOW_L));

      // At extension, elbow should be nearly straight (close to 0, around -0.09)
      const minElbowBend = Math.min(
        ...elbowRotations.map((rot) => Math.abs(rot?.z ?? 0))
      );

      // Should be nearly straight (< 0.2 radians = ~11°)
      expect(minElbowBend).toBeLessThan(0.2);
    });
  });

  describe("CROSS_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(CROSS_ANIMATION.name).toBe("cross");
      expect(CROSS_ANIMATION.koreanName).toBe("크로스");
      expect(CROSS_ANIMATION.type).toBe("attack");
    });

    it("should animate right arm (rear hand in orthodox stance)", () => {
      const hasRightShoulder = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_R)
      );
      const hasRightElbow = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.ELBOW_R)
      );

      expect(hasRightShoulder).toBe(true);
      expect(hasRightElbow).toBe(true);
    });

    it("should have full hip rotation for power", () => {
      // CROSS should have full hip rotation (~0.25-0.45 radians / 14-26°)
      const pelvisRotations = CROSS_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.PELVIS))
        .map((kf) => kf.boneRotations.get(BoneName.PELVIS));

      const maxPelvisRotation = Math.max(
        ...pelvisRotations.map((rot) => Math.abs(rot?.y ?? 0))
      );

      // Cross should have significant hip rotation (> 0.2 radians)
      expect(maxPelvisRotation).toBeGreaterThan(0.2);
      expect(maxPelvisRotation).toBeLessThan(0.5);
    });

    it("should have coordinated shoulder rotation", () => {
      const spineRotations = CROSS_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.SPINE_UPPER))
        .map((kf) => kf.boneRotations.get(BoneName.SPINE_UPPER));

      const maxSpineRotation = Math.max(
        ...spineRotations.map((rot) => Math.abs(rot?.y ?? 0))
      );

      // Should have significant shoulder rotation
      expect(maxSpineRotation).toBeGreaterThan(0.3);
    });

    it("should include hikite (opposite arm pulling back)", () => {
      // Left arm should pull back as right arm punches
      const hasLeftShoulder = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_L)
      );
      const hasLeftElbow = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.ELBOW_L)
      );

      expect(hasLeftShoulder).toBe(true);
      expect(hasLeftElbow).toBe(true);
    });

    it("should have full arm extension at peak", () => {
      // Find the keyframe with maximum right elbow extension
      const elbowRotations = CROSS_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.ELBOW_R))
        .map((kf) => kf.boneRotations.get(BoneName.ELBOW_R));

      // At extension, elbow should be nearly straight
      const minElbowBend = Math.min(
        ...elbowRotations.map((rot) => Math.abs(rot?.z ?? 0))
      );

      // Should be nearly straight (< 0.2 radians)
      expect(minElbowBend).toBeLessThan(0.2);
    });

    it("should have hip rotation similar to jab (both use EXTENSION phase)", () => {
      const jabMaxPelvis = Math.max(
        ...JAB_ANIMATION.keyframes
          .filter((kf) => kf.boneRotations.has(BoneName.PELVIS))
          .map((kf) => Math.abs(kf.boneRotations.get(BoneName.PELVIS)?.y ?? 0))
      );

      const crossMaxPelvis = Math.max(
        ...CROSS_ANIMATION.keyframes
          .filter((kf) => kf.boneRotations.has(BoneName.PELVIS))
          .map((kf) => Math.abs(kf.boneRotations.get(BoneName.PELVIS)?.y ?? 0))
      );

      // Both jab and cross use EXTENSION/PEAK phases with similar hip rotation
      // The difference is in technique execution, not hip rotation amount
      expect(crossMaxPelvis).toBeGreaterThan(0.2);
      expect(jabMaxPelvis).toBeGreaterThan(0.2);
    });
  });

  describe("HOOK_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(HOOK_ANIMATION.name).toBe("hook");
      expect(HOOK_ANIMATION.koreanName).toBe("훅");
      expect(HOOK_ANIMATION.type).toBe("attack");
    });

    it("should have circular shoulder rotation", () => {
      const spineRotations = HOOK_ANIMATION.keyframes
        .filter((kf) => kf.boneRotations.has(BoneName.SPINE_UPPER))
        .map((kf) => kf.boneRotations.get(BoneName.SPINE_UPPER));

      const maxSpineRotation = Math.max(
        ...spineRotations.map((rot) => Math.abs(rot?.y ?? 0))
      );

      // Hook should have significant circular rotation
      expect(maxSpineRotation).toBeGreaterThan(0.2);
    });

    it("should include hip rotation", () => {
      const hasPelvisRotation = HOOK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.PELVIS)
      );

      expect(hasPelvisRotation).toBe(true);
    });

    it("should include hikite (opposite arm)", () => {
      // Both arms should be animated
      const hasLeftShoulder = HOOK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_L)
      );
      const hasRightShoulder = HOOK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_R)
      );

      expect(hasLeftShoulder).toBe(true);
      expect(hasRightShoulder).toBe(true);
    });
  });

  describe("UPPERCUT_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(UPPERCUT_ANIMATION.name).toBe("uppercut");
      expect(UPPERCUT_ANIMATION.koreanName).toBe("어퍼컷");
      expect(UPPERCUT_ANIMATION.type).toBe("attack");
    });

    it("should include leg drive (knee animation)", () => {
      const hasLeftKnee = UPPERCUT_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.KNEE_L)
      );
      const hasRightKnee = UPPERCUT_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.KNEE_R)
      );

      expect(hasLeftKnee).toBe(true);
      expect(hasRightKnee).toBe(true);
    });

    it("should include pelvis vertical movement", () => {
      const pelvisPositions = UPPERCUT_ANIMATION.keyframes
        .filter((kf) => kf.bonePositions.has(BoneName.PELVIS))
        .map((kf) => kf.bonePositions.get(BoneName.PELVIS));

      const hasVerticalMovement = pelvisPositions.some(
        (pos) => Math.abs(pos?.y ?? 0) > 0
      );

      expect(hasVerticalMovement).toBe(true);
    });

    it("should include hip rotation", () => {
      const hasPelvisRotation = UPPERCUT_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.PELVIS)
      );

      expect(hasPelvisRotation).toBe(true);
    });

    it("should include hikite (opposite arm)", () => {
      // Both arms should be animated
      const hasLeftShoulder = UPPERCUT_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_L)
      );
      const hasRightShoulder = UPPERCUT_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_R)
      );

      expect(hasLeftShoulder).toBe(true);
      expect(hasRightShoulder).toBe(true);
    });
  });

  describe("Korean Martial Arts Biomechanics Integration", () => {
    it("all punch animations should include pelvis rotation", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        HOOK_ANIMATION,
        UPPERCUT_ANIMATION,
      ];

      animations.forEach((anim) => {
        const hasPelvis = anim.keyframes.some((kf) =>
          kf.boneRotations.has(BoneName.PELVIS)
        );
        expect(hasPelvis).toBe(true);
      });
    });

    it("all punch animations should include spine rotation", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        HOOK_ANIMATION,
        UPPERCUT_ANIMATION,
      ];

      animations.forEach((anim) => {
        const hasSpine = anim.keyframes.some((kf) =>
          kf.boneRotations.has(BoneName.SPINE_UPPER)
        );
        expect(hasSpine).toBe(true);
      });
    });

    it("all punch animations should animate both arms (hikite)", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        HOOK_ANIMATION,
        UPPERCUT_ANIMATION,
      ];

      animations.forEach((anim) => {
        const hasLeftArm =
          anim.keyframes.some((kf) =>
            kf.boneRotations.has(BoneName.SHOULDER_L)
          ) ||
          anim.keyframes.some((kf) => kf.boneRotations.has(BoneName.ELBOW_L));
        const hasRightArm =
          anim.keyframes.some((kf) =>
            kf.boneRotations.has(BoneName.SHOULDER_R)
          ) ||
          anim.keyframes.some((kf) => kf.boneRotations.has(BoneName.ELBOW_R));

        expect(hasLeftArm).toBe(true);
        expect(hasRightArm).toBe(true);
      });
    });

    it("all punch animations should have multiple keyframes", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        HOOK_ANIMATION,
        UPPERCUT_ANIMATION,
      ];

      animations.forEach((anim) => {
        expect(anim.keyframes.length).toBeGreaterThanOrEqual(3);
      });
    });

    it("all punch animations should have keyframes in chronological order", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        HOOK_ANIMATION,
        UPPERCUT_ANIMATION,
      ];

      animations.forEach((anim) => {
        for (let i = 1; i < anim.keyframes.length; i++) {
          expect(anim.keyframes[i].time).toBeGreaterThanOrEqual(
            anim.keyframes[i - 1].time
          );
        }
      });
    });
  });
});
