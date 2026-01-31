/**
 * Tests for MartialArtsAnimationBuilder
 *
 * @module systems/animation/__tests__/MartialArtsAnimationBuilder.test
 */

import { describe, it, expect } from "vitest";
import {
  MartialArtsAnimationBuilder,
  AnimationType,
  TECHNIQUE_TIMING,
} from "./MartialArtsAnimationBuilder";
import { TrigramStance } from "@/types/common";
import { BoneName } from "@/types/skeletal";

describe("MartialArtsAnimationBuilder", () => {
  describe("Factory Methods", () => {
    it("should create builder with name and Korean name", () => {
      const builder = MartialArtsAnimationBuilder.create("Jab", "직권");

      expect(builder).toBeDefined();
      expect(builder).toBeInstanceOf(MartialArtsAnimationBuilder);
    });

    it("should create multiple independent builders", () => {
      const builder1 = MartialArtsAnimationBuilder.create("Jab", "직권");
      const builder2 = MartialArtsAnimationBuilder.create("Cross", "교차");

      expect(builder1).not.toBe(builder2);
    });
  });

  describe("Animation Type Configuration", () => {
    it("should configure as attack animation with duration", () => {
      const builder = MartialArtsAnimationBuilder.create("Jab", "직권");
      const result = builder.asAttack(0.55);

      expect(result).toBe(builder); // Fluent interface
      const animation = result.build();
      expect(animation.type).toBe("attack");
      expect(animation.duration).toBe(0.55);
    });

    it("should configure as defense animation with duration", () => {
      const builder = MartialArtsAnimationBuilder.create("Block", "막기");
      const result = builder.asDefense(0.6);

      expect(result).toBe(builder);
      const animation = result.build();
      expect(animation.type).toBe("defense");
      expect(animation.duration).toBe(0.6);
    });

    it("should configure as movement animation with duration", () => {
      const builder = MartialArtsAnimationBuilder.create("Walk", "걷기");
      const result = builder.asMovement(1.0, false);

      expect(result).toBe(builder);
      const animation = result.build();
      expect(animation.type).toBe("movement");
      expect(animation.duration).toBe(1.0);
      expect(animation.loop).toBe(false);
    });

    it("should configure as idle animation with loop", () => {
      const builder = MartialArtsAnimationBuilder.create("Idle", "대기");
      const result = builder.asIdle(2.0, true);

      expect(result).toBe(builder);
      const animation = result.build();
      expect(animation.type).toBe("idle");
      expect(animation.duration).toBe(2.0);
      expect(animation.loop).toBe(true);
    });

    it("should configure as stance animation", () => {
      const builder = MartialArtsAnimationBuilder.create("Stance", "자세");
      const result = builder.asStance(1.5, false);

      expect(result).toBe(builder);
      const animation = result.build();
      expect(animation.type).toBe("stance");
      expect(animation.duration).toBe(1.5);
    });

    it("should default to loop enabled for idle", () => {
      const builder = MartialArtsAnimationBuilder.create("Idle", "대기");
      const animation = builder.asIdle(2.0).build();

      expect(animation.loop).toBe(true);
    });
  });

  describe("Keyframe Addition with at() method", () => {
    it("should add keyframe at specific time", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      builder
        .asAttack(1.0)
        .at(0.5)
        .rotate(BoneName.SHOULDER_R, 1, 0, 0)
        .done();

      const animation = builder.build();
      expect(animation.keyframes).toHaveLength(1);
      // Time should be normalized to start at 0, so 0.5 becomes 0
      expect(animation.keyframes[0].time).toBe(0);
    });

    it("should add multiple keyframes in sequence", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      builder
        .asAttack(1.0)
        .at(0.0)
        .rotate(BoneName.SHOULDER_R, 0, 0, 0)
        .done()
        .at(0.5)
        .rotate(BoneName.SHOULDER_R, 1, 0, 0)
        .done()
        .at(1.0)
        .rotate(BoneName.SHOULDER_R, 0, 0, 0)
        .done();

      const animation = builder.build();
      expect(animation.keyframes).toHaveLength(3);
    });

    it("should support keyframe with multiple bone rotations", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      builder
        .asAttack(1.0)
        .at(0.5)
        .rotate(BoneName.SHOULDER_R, 1, 0, 0)
        .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
        .rotate(BoneName.WRIST_R, 0, 0, 0.5)
        .done();

      const animation = builder.build();
      expect(animation.keyframes).toHaveLength(1);
      expect(animation.keyframes[0].boneRotations.size).toBe(3);
    });
  });

  describe("Guard Position Methods", () => {
    it("should apply basic guard", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder.asIdle(1.0).withGuard();

      expect(result).toBe(builder); // Fluent interface
    });

    it("should apply high guard", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder.asDefense(0.6).withHighGuard();

      expect(result).toBe(builder);
    });

    it("should apply Korean guard positions", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");

      expect(() => builder.withKoreanHighGuard("both")).not.toThrow();
      expect(() => builder.withKoreanMiddleGuard("right")).not.toThrow();
      expect(() => builder.withKoreanLowGuard("left")).not.toThrow();
    });

    it("should apply trigram guard", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder
        .asStance(1.5)
        .withTrigramGuard(TrigramStance.GEON);

      expect(result).toBe(builder);
    });
  });

  describe("Hand Pose Methods", () => {
    it("should apply open palm pose", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder.asAttack(0.5).withOpenPalm("both");

      expect(result).toBe(builder);
    });

    it("should apply spear hand pose", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder.asAttack(0.5).withSpearHand("right");

      expect(result).toBe(builder);
    });

    it("should apply backfist pose", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder.asAttack(0.5).withBackfist("left");

      expect(result).toBe(builder);
    });

    it("should apply grab pose", () => {
      const builder = MartialArtsAnimationBuilder.create("Test", "테스트");
      const result = builder.asAttack(0.5).withGrab("both");

      expect(result).toBe(builder);
    });
  });

  describe("Building Animations", () => {
    it("should build animation with basic properties", () => {
      const animation = MartialArtsAnimationBuilder.create("Jab", "직권")
        .asAttack(0.55)
        .build();

      expect(animation.name).toBe("Jab");
      expect(animation.koreanName).toBe("직권");
      expect(animation.duration).toBe(0.55);
      expect(animation.type).toBe("attack");
      expect(animation.loop).toBe(false);
    });

    it("should build animation with keyframes", () => {
      const animation = MartialArtsAnimationBuilder.create("Test", "테스트")
        .asAttack(1.0)
        .at(0.0)
        .rotate(BoneName.SHOULDER_R, 0, 0, 0)
        .done()
        .at(0.5)
        .rotate(BoneName.SHOULDER_R, 1, 0, 0)
        .done()
        .build();

      expect(animation.keyframes).toHaveLength(2);
      expect(animation.keyframes[0].time).toBe(0.0);
      expect(animation.keyframes[1].time).toBe(0.5);
    });

    it("should normalize keyframe times", () => {
      const animation = MartialArtsAnimationBuilder.create("Test", "테스트")
        .asAttack(2.0)
        .at(1.0)
        .rotate(BoneName.SHOULDER_R, 0, 0, 0)
        .done()
        .at(1.5)
        .rotate(BoneName.SHOULDER_R, 1, 0, 0)
        .done()
        .build();

      // Times should be normalized to start at 0
      expect(animation.keyframes[0].time).toBe(0.0);
      expect(animation.keyframes[1].time).toBe(0.5);
    });
  });

  describe("AnimationType Enum", () => {
    it("should have kick types", () => {
      expect(AnimationType.FRONT_KICK).toBe("front_kick");
      expect(AnimationType.ROUNDHOUSE_KICK).toBe("roundhouse_kick");
      expect(AnimationType.SIDE_KICK).toBe("side_kick");
      expect(AnimationType.AXE_KICK).toBe("axe_kick");
    });

    it("should have punch types", () => {
      expect(AnimationType.JAB).toBe("jab");
      expect(AnimationType.CROSS).toBe("cross");
      expect(AnimationType.HOOK).toBe("hook");
      expect(AnimationType.UPPERCUT).toBe("uppercut");
    });

    it("should have elbow and knee types", () => {
      expect(AnimationType.ELBOW_STRIKE).toBe("elbow_strike");
      expect(AnimationType.KNEE_STRIKE).toBe("knee_strike");
      expect(AnimationType.FLYING_KNEE).toBe("flying_knee");
      expect(AnimationType.CLINCH_KNEE).toBe("clinch_knee");
    });

    it("should have grappling types", () => {
      expect(AnimationType.THROW).toBe("throw");
      expect(AnimationType.JOINT_LOCK).toBe("joint_lock");
      expect(AnimationType.TAKEDOWN).toBe("takedown");
      expect(AnimationType.SWEEP).toBe("sweep");
    });

    it("should have specialized strike types", () => {
      expect(AnimationType.SPEAR_HAND_STRIKE).toBe("spear_hand_strike");
      expect(AnimationType.NERVE_STRIKE).toBe("nerve_strike");
      expect(AnimationType.PRESSURE_POINT_STRIKE).toBe("pressure_point_strike");
    });
  });

  describe("TECHNIQUE_TIMING Constants", () => {
    it("should have FAST timing", () => {
      expect(TECHNIQUE_TIMING.FAST).toBeDefined();
      expect(TECHNIQUE_TIMING.FAST.total).toBe(0.55);
      expect(TECHNIQUE_TIMING.FAST.chamber).toBe(0.1);
      expect(TECHNIQUE_TIMING.FAST.extend).toBe(0.15);
    });

    it("should have MEDIUM timing", () => {
      expect(TECHNIQUE_TIMING.MEDIUM).toBeDefined();
      expect(TECHNIQUE_TIMING.MEDIUM.total).toBe(0.73);
    });

    it("should have HEAVY timing", () => {
      expect(TECHNIQUE_TIMING.HEAVY).toBeDefined();
      expect(TECHNIQUE_TIMING.HEAVY.total).toBe(1.0);
    });

    it("should have SPINNING timing", () => {
      expect(TECHNIQUE_TIMING.SPINNING).toBeDefined();
      expect(TECHNIQUE_TIMING.SPINNING.total).toBe(1.2);
    });

    it("should have all phase properties", () => {
      const timing = TECHNIQUE_TIMING.FAST;
      expect(timing.chamber).toBeDefined();
      expect(timing.extend).toBeDefined();
      expect(timing.peak).toBeDefined();
      expect(timing.retract).toBeDefined();
      expect(timing.recover).toBeDefined();
      expect(timing.total).toBeDefined();
    });

    it("should have timing phases sum to total", () => {
      const timing = TECHNIQUE_TIMING.MEDIUM;
      const sum =
        timing.chamber +
        timing.extend +
        timing.peak +
        timing.retract +
        timing.recover;
      expect(sum).toBeCloseTo(timing.total, 2);
    });
  });

  describe("Complex Animation Building", () => {
    it("should build complex attack with guards and poses", () => {
      const animation = MartialArtsAnimationBuilder.create("Jab", "직권")
        .asAttack(0.55)
        .withKoreanMiddleGuard("both")
        .at(0.0)
        .rotate(BoneName.SHOULDER_R, 0, 0, 0)
        .done()
        .at(0.25)
        .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
        .done()
        .build();

      expect(animation).toBeDefined();
      expect(animation.type).toBe("attack");
      expect(animation.keyframes).toHaveLength(2);
    });

    it("should build idle stance with trigram guard", () => {
      const animation = MartialArtsAnimationBuilder.create(
        "Geon Stance",
        "건 자세"
      )
        .asIdle(2.0, true)
        .withTrigramGuard(TrigramStance.GEON)
        .build();

      expect(animation.type).toBe("idle");
      expect(animation.loop).toBe(true);
      expect(animation.duration).toBe(2.0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty animation", () => {
      const animation = MartialArtsAnimationBuilder.create("Empty", "빈")
        .asAttack(0.5)
        .build();

      expect(animation.keyframes).toHaveLength(0);
    });

    it("should handle single keyframe", () => {
      const animation = MartialArtsAnimationBuilder.create("Single", "단일")
        .asAttack(1.0)
        .at(0.5)
        .rotate(BoneName.SHOULDER_R, 1, 0, 0)
        .done()
        .build();

      expect(animation.keyframes).toHaveLength(1);
    });

    it("should handle zero duration", () => {
      const animation = MartialArtsAnimationBuilder.create("Instant", "즉시")
        .asAttack(0)
        .build();

      expect(animation.duration).toBe(0);
    });

    it("should handle very large duration", () => {
      const animation = MartialArtsAnimationBuilder.create("Long", "긴")
        .asIdle(100, true)
        .build();

      expect(animation.duration).toBe(100);
    });
  });
});
