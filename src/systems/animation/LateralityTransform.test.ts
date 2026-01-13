/**
 * Laterality Transform Tests
 *
 * Tests for left/right laterality transformations on skeletal animations.
 * Validates automatic mirroring of animations for opposite-side techniques.
 *
 * **Korean**: 측면성 변환 테스트
 *
 * @module systems/animation/__tests__/LateralityTransform
 * @korean 측면성변환테스트
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { BoneName } from "../../types/skeletal";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";
import {
  applyLaterality,
  getLateralitySuffix,
  hasLaterality,
  extractLaterality,
} from "./LateralityTransform";

// Helper to create a simple test animation
function createTestAnimation(): SkeletalAnimation {
  const keyframe: AnimationKeyframe = {
    time: 0.0,
    easing: "linear" as const,
    boneRotations: new Map([
      [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0.3, 0.2, "XYZ")],
      [BoneName.ELBOW_R, new THREE.Euler(1.0, 0, 0, "XYZ")],
      [BoneName.HIP_R, new THREE.Euler(0.3, 0.1, 0, "XYZ")],
    ]),
    bonePositions: new Map([
      [BoneName.HAND_R, new THREE.Vector3(1.0, 0, 0)],
    ]),
  };

  return {
    name: "test_animation",
    koreanName: "테스트 애니메이션",
    duration: 0.5,
    loop: false,
    type: "attack",
    keyframes: [keyframe],
  };
}

describe("LateralityTransform", () => {
  describe("applyLaterality", () => {
    it("should return original animation for right laterality", () => {
      const originalAnim = createTestAnimation();
      const rightAnim = applyLaterality(originalAnim, "right");

      expect(rightAnim).toBe(originalAnim);
      expect(rightAnim.name).toBe("test_animation");
    });

    it("should create mirrored animation for left laterality", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      expect(leftAnim).not.toBe(originalAnim);
      expect(leftAnim.name).toBe("test_animation_left");
      expect(leftAnim.koreanName).toContain("왼쪽");
    });

    it("should preserve animation duration and type", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      expect(leftAnim.duration).toBe(originalAnim.duration);
      expect(leftAnim.loop).toBe(originalAnim.loop);
      expect(leftAnim.type).toBe(originalAnim.type);
    });

    it("should preserve number of keyframes", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      expect(leftAnim.keyframes.length).toBe(originalAnim.keyframes.length);
    });

    it("should mirror right-side bones to left-side", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      const originalKeyframe = originalAnim.keyframes[0];
      const mirroredKeyframe = leftAnim.keyframes[0];

      // Right shoulder should become left shoulder
      expect(originalKeyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(mirroredKeyframe.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(mirroredKeyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(false);
    });

    it("should negate Y and Z rotation components for mirroring", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      const originalRot = originalAnim.keyframes[0].boneRotations.get(BoneName.SHOULDER_R);
      const mirroredRot = leftAnim.keyframes[0].boneRotations.get(BoneName.SHOULDER_L);

      expect(originalRot).toBeDefined();
      expect(mirroredRot).toBeDefined();

      if (originalRot && mirroredRot) {
        // X axis should remain the same
        expect(mirroredRot.x).toBeCloseTo(originalRot.x);
        // Y and Z axes should be negated
        expect(mirroredRot.y).toBeCloseTo(-originalRot.y);
        expect(mirroredRot.z).toBeCloseTo(-originalRot.z);
      }
    });

    it("should mirror position X component", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      const originalPos = originalAnim.keyframes[0].bonePositions.get(BoneName.HAND_R);
      const mirroredPos = leftAnim.keyframes[0].bonePositions.get(BoneName.HAND_L);

      expect(originalPos).toBeDefined();
      expect(mirroredPos).toBeDefined();

      if (originalPos && mirroredPos) {
        // X component should be negated
        expect(mirroredPos.x).toBeCloseTo(-originalPos.x);
        // Y and Z should remain the same
        expect(mirroredPos.y).toBeCloseTo(originalPos.y);
        expect(mirroredPos.z).toBeCloseTo(originalPos.z);
      }
    });

    it("should preserve keyframe timing", () => {
      const originalAnim = createTestAnimation();
      const leftAnim = applyLaterality(originalAnim, "left");

      expect(leftAnim.keyframes[0].time).toBe(originalAnim.keyframes[0].time);
      expect(leftAnim.keyframes[0].easing).toBe(originalAnim.keyframes[0].easing);
    });

    it("should handle animations with multiple keyframes", () => {
      const multiKeyframeAnim: SkeletalAnimation = {
        name: "multi_keyframe",
        koreanName: "멀티 키프레임",
        duration: 1.0,
        loop: false,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            easing: "linear",
            boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0, "XYZ")]]),
            bonePositions: new Map(),
          },
          {
            time: 0.5,
            easing: "linear",
            boneRotations: new Map([[BoneName.ELBOW_R, new THREE.Euler(1.0, 0, 0, "XYZ")]]),
            bonePositions: new Map(),
          },
          {
            time: 1.0,
            easing: "linear",
            boneRotations: new Map([[BoneName.WRIST_R, new THREE.Euler(0.3, 0, 0, "XYZ")]]),
            bonePositions: new Map(),
          },
        ],
      };

      const leftAnim = applyLaterality(multiKeyframeAnim, "right");

      expect(leftAnim.keyframes.length).toBe(3);
      expect(leftAnim.keyframes[0].time).toBe(0.0);
      expect(leftAnim.keyframes[1].time).toBe(0.5);
      expect(leftAnim.keyframes[2].time).toBe(1.0);
    });

    it("should handle animations with center bones (no mirroring)", () => {
      const centerBoneAnim: SkeletalAnimation = {
        name: "spine_animation",
        koreanName: "척추 애니메이션",
        duration: 0.5,
        loop: false,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            easing: "linear",
            boneRotations: new Map([
              [BoneName.PELVIS, new THREE.Euler(0.1, 0.2, 0.3, "XYZ")],
              [BoneName.SPINE_LOWER, new THREE.Euler(0.1, 0.1, 0, "XYZ")],
            ]),
            bonePositions: new Map(),
          },
        ],
      };

      const leftAnim = applyLaterality(centerBoneAnim, "left");

      // Center bones should still be present in mirrored animation
      expect(leftAnim.keyframes[0].boneRotations.has(BoneName.PELVIS)).toBe(true);
      expect(leftAnim.keyframes[0].boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
    });
  });

  describe("getLateralitySuffix", () => {
    it("should return empty string for right laterality", () => {
      expect(getLateralitySuffix("right")).toBe("");
    });

    it("should return '_left' for left laterality", () => {
      expect(getLateralitySuffix("left")).toBe("_left");
    });
  });

  describe("hasLaterality", () => {
    it("should return true for animation names ending with '_left'", () => {
      expect(hasLaterality("geon_punch_left")).toBe(true);
    });

    it("should return true for animation names ending with '_right'", () => {
      expect(hasLaterality("tae_kick_right")).toBe(true);
    });

    it("should return false for animation names without laterality", () => {
      expect(hasLaterality("geon_punch")).toBe(false);
      expect(hasLaterality("front_kick")).toBe(false);
    });
  });

  describe("extractLaterality", () => {
    it("should extract 'left' from animation name", () => {
      expect(extractLaterality("geon_punch_left")).toBe("left");
      expect(extractLaterality("tae_strike_left")).toBe("left");
    });

    it("should extract 'right' from animation name", () => {
      expect(extractLaterality("geon_punch_right")).toBe("right");
      expect(extractLaterality("tae_strike_right")).toBe("right");
    });

    it("should return null for animation names without laterality", () => {
      expect(extractLaterality("geon_punch")).toBeNull();
      expect(extractLaterality("front_kick")).toBeNull();
    });
  });

  describe("Bone Mirroring Edge Cases", () => {
    it("should handle animations with only left-side bones", () => {
      const leftOnlyAnim: SkeletalAnimation = {
        name: "left_only",
        koreanName: "왼쪽만",
        duration: 0.5,
        loop: false,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            easing: "linear",
            boneRotations: new Map([
              [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, 0, "XYZ")],
              [BoneName.ELBOW_L, new THREE.Euler(1.0, 0, 0, "XYZ")],
            ]),
            bonePositions: new Map(),
          },
        ],
      };

      const leftAnim = applyLaterality(leftOnlyAnim, "left");

      // Should mirror left bones to right bones
      expect(leftAnim.keyframes[0].boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(leftAnim.keyframes[0].boneRotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it("should handle animations with mixed left and right bones", () => {
      const mixedAnim: SkeletalAnimation = {
        name: "mixed_sides",
        koreanName: "혼합",
        duration: 0.5,
        loop: false,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            easing: "linear",
            boneRotations: new Map([
              [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0, "XYZ")],
              [BoneName.ELBOW_L, new THREE.Euler(1.0, 0, 0, "XYZ")],
            ]),
            bonePositions: new Map(),
          },
        ],
      };

      const leftAnim = applyLaterality(mixedAnim, "left");

      // Both sides should be mirrored
      expect(leftAnim.keyframes[0].boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(leftAnim.keyframes[0].boneRotations.has(BoneName.ELBOW_R)).toBe(true);
    });
  });
});
