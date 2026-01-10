/**
 * Tests for AnimationBuilder
 *
 * @module systems/animation/__tests__/AnimationBuilder.test
 */

import { describe, it, expect } from "vitest";
import {
  AnimationBuilder,
  KeyframeFactories,
  BoneRotationHelpers,
} from "./AnimationBuilder";
import { BoneName } from "../../types/skeletal";

describe("AnimationBuilder", () => {
  describe("basic animation creation", () => {
    it("should create a simple animation with builder pattern", () => {
      const animation = AnimationBuilder.create("test_punch")
        .withKoreanName("테스트펀치")
        .withDuration(0.5)
        .withType("attack")
        .withLoop(false)
        .build();

      expect(animation.name).toBe("test_punch");
      expect(animation.koreanName).toBe("테스트펀치");
      expect(animation.duration).toBe(0.5);
      expect(animation.type).toBe("attack");
      expect(animation.loop).toBe(false);
      expect(animation.keyframes).toHaveLength(0);
    });

    it("should create animation with keyframes using fluent API", () => {
      const animation = AnimationBuilder.create("punch")
        .withDuration(0.3)
        .withType("attack")
        .keyframe(0.0, "linear")
          .rotate(BoneName.SHOULDER_R, 0, 0, -0.2)
          .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
          .build()
        .keyframe(0.15, "ease-out")
          .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
          .rotate(BoneName.ELBOW_R, 0, 0, 0)
          .position(BoneName.HAND_R, 0, 0, 0.8)
          .build()
        .build();

      expect(animation.keyframes).toHaveLength(2);
      expect(animation.keyframes[0].time).toBe(0.0);
      expect(animation.keyframes[0].easing).toBe("linear");
      expect(animation.keyframes[0].boneRotations.size).toBe(2);
      expect(animation.keyframes[1].time).toBe(0.15);
      expect(animation.keyframes[1].bonePositions.size).toBe(1);
    });

    it("should allow adding pre-built keyframes", () => {
      const guardKeyframe = KeyframeFactories.guardReturn(0.3);
      
      const animation = AnimationBuilder.create("combo")
        .withDuration(0.5)
        .addKeyframe(guardKeyframe)
        .build();

      expect(animation.keyframes).toHaveLength(1);
      expect(animation.keyframes[0]).toBe(guardKeyframe);
    });
  });

  describe("default values", () => {
    it("should use sensible defaults", () => {
      const animation = AnimationBuilder.create("idle").build();

      expect(animation.duration).toBe(1.0);
      expect(animation.loop).toBe(false);
      expect(animation.type).toBe("idle");
      expect(animation.koreanName).toBe("idle");
    });
  });

  describe("method chaining", () => {
    it("should support method chaining", () => {
      const builder = AnimationBuilder.create("test");
      
      const result1 = builder.withDuration(1.0);
      const result2 = result1.withLoop(true);
      const result3 = result2.withType("movement");

      expect(result1).toBe(builder);
      expect(result2).toBe(builder);
      expect(result3).toBe(builder);
    });
  });
});

describe("KeyframeFactories", () => {
  describe("guardReturn", () => {
    it("should create guard return keyframe with correct structure", () => {
      const keyframe = KeyframeFactories.guardReturn(0.5);

      expect(keyframe.time).toBe(0.5);
      expect(keyframe.easing).toBe("ease-in");
      expect(keyframe.boneRotations.size).toBeGreaterThan(0);
      expect(keyframe.bonePositions.size).toBeGreaterThan(0);
      expect(keyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
    });
  });

  describe("neutralStance", () => {
    it("should create neutral stance keyframe", () => {
      const keyframe = KeyframeFactories.neutralStance(0.0);

      expect(keyframe.time).toBe(0.0);
      expect(keyframe.easing).toBe("linear");
      expect(keyframe.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.PELVIS)).toBe(true);

      // All rotations should be zero (neutral)
      const spineRotation = keyframe.boneRotations.get(BoneName.SPINE_UPPER);
      expect(spineRotation?.x).toBe(0);
      expect(spineRotation?.y).toBe(0);
      expect(spineRotation?.z).toBe(0);
    });
  });

  describe("rotateTorso", () => {
    it("should create torso rotation with cascading angles", () => {
      const angle = Math.PI / 4; // 45 degrees
      const keyframe = KeyframeFactories.rotateTorso(0.1, angle, "ease-out");

      expect(keyframe.time).toBe(0.1);
      expect(keyframe.easing).toBe("ease-out");

      const upperSpine = keyframe.boneRotations.get(BoneName.SPINE_UPPER);
      const middleSpine = keyframe.boneRotations.get(BoneName.SPINE_MIDDLE);
      const pelvis = keyframe.boneRotations.get(BoneName.PELVIS);

      expect(upperSpine?.y).toBe(angle);
      expect(middleSpine?.y).toBe(angle * 0.75);
      expect(pelvis?.y).toBe(angle * 0.5);
    });
  });
});

describe("BoneRotationHelpers", () => {
  describe("shoulderExtension", () => {
    it("should create shoulder rotation for right arm", () => {
      const rotation = BoneRotationHelpers.shoulderExtension("R", 0.5, 0.2);

      expect(rotation.x).toBe(0.2); // up
      expect(rotation.y).toBe(0);
      expect(rotation.z).toBe(0.5); // forward (positive for right)
    });

    it("should create shoulder rotation for left arm", () => {
      const rotation = BoneRotationHelpers.shoulderExtension("L", 0.5, 0.2);

      expect(rotation.x).toBe(0.2); // up
      expect(rotation.y).toBe(0);
      expect(rotation.z).toBe(-0.5); // forward (negative for left)
    });

    it("should default up rotation to 0", () => {
      const rotation = BoneRotationHelpers.shoulderExtension("R", 0.5);

      expect(rotation.x).toBe(0);
    });
  });

  describe("elbowBend", () => {
    it("should create elbow rotation for right arm", () => {
      const bend = Math.PI / 2; // 90 degrees
      const rotation = BoneRotationHelpers.elbowBend("R", bend);

      expect(rotation.x).toBe(0);
      expect(rotation.y).toBe(0);
      expect(rotation.z).toBe(bend); // positive for right
    });

    it("should create elbow rotation for left arm", () => {
      const bend = Math.PI / 2;
      const rotation = BoneRotationHelpers.elbowBend("L", bend);

      expect(rotation.x).toBe(0);
      expect(rotation.y).toBe(0);
      expect(rotation.z).toBe(-bend); // negative for left
    });
  });

  describe("hipRotation", () => {
    it("should create hip rotation with forward and outward components", () => {
      const rotation = BoneRotationHelpers.hipRotation("R", 0.5, 0.3);

      expect(rotation.x).toBe(0.5); // forward
      expect(rotation.y).toBe(0.3); // outward
      expect(rotation.z).toBe(0);
    });

    it("should default outward rotation to 0", () => {
      const rotation = BoneRotationHelpers.hipRotation("L", 0.5);

      expect(rotation.y).toBe(0);
    });
  });

  describe("kneeBend", () => {
    it("should create knee rotation", () => {
      const bend = Math.PI / 3;
      const rotation = BoneRotationHelpers.kneeBend("R", bend);

      expect(rotation.x).toBe(0);
      expect(rotation.y).toBe(0);
      expect(rotation.z).toBe(bend);
    });

    it("should be same for both legs (symmetric)", () => {
      const bend = 0.8;
      const leftKnee = BoneRotationHelpers.kneeBend("L", bend);
      const rightKnee = BoneRotationHelpers.kneeBend("R", bend);

      expect(leftKnee.z).toBe(rightKnee.z);
    });
  });
});

describe("Integration", () => {
  it("should create complete animation using all utilities", () => {
    const animation = AnimationBuilder.create("enhanced_jab")
      .withKoreanName("향상된 잽")
      .withDuration(0.3)
      .withType("attack")
      .keyframe(0.0, "linear")
        .rotate(
          BoneName.SHOULDER_R,
          ...BoneRotationHelpers.shoulderExtension("R", -0.2).toArray()
        )
        .rotate(
          BoneName.ELBOW_R,
          ...BoneRotationHelpers.elbowBend("R", 1.5).toArray()
        )
        .build()
      .addKeyframe(KeyframeFactories.rotateTorso(0.1, 0.3, "ease-out"))
      .keyframe(0.15, "linear")
        .rotate(
          BoneName.SHOULDER_R,
          ...BoneRotationHelpers.shoulderExtension("R", 0.5).toArray()
        )
        .rotate(
          BoneName.ELBOW_R,
          ...BoneRotationHelpers.elbowBend("R", 0).toArray()
        )
        .position(BoneName.HAND_R, 0, 0, 0.8)
        .build()
      .addKeyframe(KeyframeFactories.guardReturn(0.3))
      .build();

    expect(animation.name).toBe("enhanced_jab");
    expect(animation.keyframes).toHaveLength(4);
    expect(animation.duration).toBe(0.3);
    
    // Verify structure
    expect(animation.keyframes[0].time).toBe(0.0);
    expect(animation.keyframes[1].time).toBe(0.1);
    expect(animation.keyframes[2].time).toBe(0.15);
    expect(animation.keyframes[3].time).toBe(0.3);
  });
});
