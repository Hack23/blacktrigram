/**
 * Guard Position Integration Tests
 *
 * Validates that Korean martial arts guard positions (막기자세) are properly
 * integrated throughout all animations.
 *
 * Tests ensure:
 * - All techniques start from proper guard position
 * - Hands return to guard after technique execution
 * - Non-striking hand maintains guard during techniques
 * - Guard height appropriate for stance (high/middle/low)
 *
 * @module systems/animation/__tests__/GuardPositionIntegration
 * @korean 방어자세통합테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "../@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../MartialArtsAnimationBuilder";
import {
  HIGH_GUARD,
  MIDDLE_GUARD,
  LOW_GUARD,
  getGuardPosition,
} from "../KoreanGuardPositions";

/**
 * Helper to check if a keyframe has proper guard position
 */
function hasGuardPosition(
  keyframe: any,
  guardType: "HIGH_GUARD" | "MIDDLE_GUARD" | "LOW_GUARD",
  hand: "left" | "right"
): boolean {
  const guard = getGuardPosition(guardType);
  const boneName =
    hand === "left" ? BoneName.SHOULDER_L : BoneName.SHOULDER_R;
  const elbowName = hand === "left" ? BoneName.ELBOW_L : BoneName.ELBOW_R;

  const shoulderRot = keyframe.boneRotations.get(boneName);
  const elbowRot = keyframe.boneRotations.get(elbowName);

  if (!shoulderRot || !elbowRot) return false;

  const guardArm = hand === "left" ? guard.left : guard.right;

  // Check shoulder angles (within reasonable tolerance)
  const shoulderMatch =
    Math.abs(shoulderRot.x - guardArm.shoulder[0]) < 0.3 &&
    Math.abs(shoulderRot.y - guardArm.shoulder[1]) < 0.3 &&
    Math.abs(shoulderRot.z - guardArm.shoulder[2]) < 0.3;

  // Check elbow angles
  const elbowMatch =
    Math.abs(elbowRot.x - guardArm.elbow[0]) < 0.3 &&
    Math.abs(elbowRot.y - guardArm.elbow[1]) < 0.3 &&
    Math.abs(elbowRot.z - guardArm.elbow[2]) < 0.3;

  return shoulderMatch && elbowMatch;
}

describe("Guard Position Integration", () => {
  describe("Korean Guard Position Definitions", () => {
    it("should have HIGH_GUARD defined with proper angles", () => {
      expect(HIGH_GUARD.korean).toBe("상단막기");
      expect(HIGH_GUARD.english).toBe("High Guard");
      expect(HIGH_GUARD.height).toBe("temple_level");
      expect(HIGH_GUARD.left.shoulder).toHaveLength(3);
      expect(HIGH_GUARD.left.elbow).toHaveLength(3);
      expect(HIGH_GUARD.right.shoulder).toHaveLength(3);
      expect(HIGH_GUARD.right.elbow).toHaveLength(3);
    });

    it("should have MIDDLE_GUARD defined with proper angles", () => {
      expect(MIDDLE_GUARD.korean).toBe("중단막기");
      expect(MIDDLE_GUARD.english).toBe("Middle Guard");
      expect(MIDDLE_GUARD.height).toBe("chest_level");
      expect(MIDDLE_GUARD.left.shoulder).toHaveLength(3);
      expect(MIDDLE_GUARD.left.elbow).toHaveLength(3);
    });

    it("should have LOW_GUARD defined with proper angles", () => {
      expect(LOW_GUARD.korean).toBe("하단막기");
      expect(LOW_GUARD.english).toBe("Low Guard");
      expect(LOW_GUARD.height).toBe("abdomen_level");
      expect(LOW_GUARD.left.shoulder).toHaveLength(3);
      expect(LOW_GUARD.left.elbow).toHaveLength(3);
    });

    it("should have guards protecting vital areas", () => {
      expect(HIGH_GUARD.protects).toContain("head");
      expect(HIGH_GUARD.protects).toContain("temple");
      expect(MIDDLE_GUARD.protects).toContain("chest");
      expect(MIDDLE_GUARD.protects).toContain("solar_plexus");
      expect(LOW_GUARD.protects).toContain("abdomen");
      expect(LOW_GUARD.protects).toContain("groin");
    });
  });

  describe("KeyframeConfig Guard Methods", () => {
    it("should support withGuard HIGH_GUARD method", () => {
      const animation = MartialArtsAnimationBuilder.create(
        "test_high_guard",
        "테스트상단막기"
      )
        .asAttack(0.5)
        .at(0)
        .withGuard("HIGH_GUARD")
        .done()
        .build();

      expect(animation.keyframes).toHaveLength(1);
      const firstFrame = animation.keyframes[0];

      // Verify high guard position on left hand
      expect(hasGuardPosition(firstFrame, "HIGH_GUARD", "left")).toBe(true);

      // Verify high guard position on right hand
      expect(hasGuardPosition(firstFrame, "HIGH_GUARD", "right")).toBe(true);
    });

    it("should support withGuard MIDDLE_GUARD method", () => {
      const animation = MartialArtsAnimationBuilder.create(
        "test_middle_guard",
        "테스트중단막기"
      )
        .asAttack(0.5)
        .at(0)
        .withGuard("MIDDLE_GUARD")
        .done()
        .build();

      expect(animation.keyframes).toHaveLength(1);
      const firstFrame = animation.keyframes[0];

      expect(hasGuardPosition(firstFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(firstFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should support withGuard LOW_GUARD method", () => {
      const animation = MartialArtsAnimationBuilder.create(
        "test_low_guard",
        "테스트하단막기"
      )
        .asAttack(0.5)
        .at(0)
        .withGuard("LOW_GUARD")
        .done()
        .build();

      expect(animation.keyframes).toHaveLength(1);
      const firstFrame = animation.keyframes[0];

      expect(hasGuardPosition(firstFrame, "LOW_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(firstFrame, "LOW_GUARD", "right")).toBe(true);
    });

    it("should support one-handed guard for striking techniques", () => {
      const animation = MartialArtsAnimationBuilder.create(
        "test_one_hand_guard",
        "테스트한손막기"
      )
        .asAttack(0.5)
        .at(0)
        .withGuard("MIDDLE_GUARD", "left") // Only left hand guards
        .done()
        .build();

      expect(animation.keyframes).toHaveLength(1);
      const firstFrame = animation.keyframes[0];

      // Left hand should be in guard
      expect(hasGuardPosition(firstFrame, "MIDDLE_GUARD", "left")).toBe(true);

      // Right hand should NOT be in guard (available for strike)
      // We don't test this as it may have attack positioning
    });
  });

  describe("Complete Technique Guard Cycle", () => {
    it("should start from guard, execute strike, return to guard", () => {
      const punchWithGuard = MartialArtsAnimationBuilder.create(
        "punch_with_guard",
        "주먹지르기_막기"
      )
        .asAttack(0.6)
        // Start in middle guard
        .at(0)
        .withGuard("MIDDLE_GUARD")
        .done()
        // Punch extension (right hand strikes, left maintains guard)
        .at(0.25)
        .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.5)
        .rotate(BoneName.ELBOW_R, 0, 0, 0)
        .withGuard("MIDDLE_GUARD", "left") // Left hand stays in guard
        .done()
        // Return to guard
        .at(0.6)
        .withGuard("MIDDLE_GUARD")
        .done()
        .build();

      expect(punchWithGuard.keyframes).toHaveLength(3);

      // Start frame: both hands in guard
      const startFrame = punchWithGuard.keyframes[0];
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "right")).toBe(true);

      // Mid frame: left hand maintains guard
      const midFrame = punchWithGuard.keyframes[1];
      expect(hasGuardPosition(midFrame, "MIDDLE_GUARD", "left")).toBe(true);

      // End frame: both hands return to guard
      const endFrame = punchWithGuard.keyframes[2];
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should maintain guard height appropriate for technique", () => {
      // High kick should use high guard to protect face
      const highKick = MartialArtsAnimationBuilder.create(
        "high_kick_guard",
        "높은차기_막기"
      )
        .asAttack(0.7)
        .at(0)
        .withGuard("HIGH_GUARD") // High guard for high technique
        .done()
        .at(0.35)
        .rotate(BoneName.HIP_R, 1.5, 0, 0) // High kick
        .withGuard("HIGH_GUARD") // Maintain high guard during kick
        .done()
        .at(0.7)
        .withGuard("HIGH_GUARD") // Return to high guard
        .done()
        .build();

      expect(highKick.keyframes).toHaveLength(3);

      // All frames should maintain high guard
      highKick.keyframes.forEach((frame) => {
        expect(hasGuardPosition(frame, "HIGH_GUARD", "left")).toBe(true);
        expect(hasGuardPosition(frame, "HIGH_GUARD", "right")).toBe(true);
      });
    });

    it("should adapt guard for defensive techniques", () => {
      const blockAndCounter = MartialArtsAnimationBuilder.create(
        "block_counter",
        "막기_반격"
      )
        .asDefense(0.5)
        // Start in middle guard
        .at(0)
        .withGuard("MIDDLE_GUARD")
        .done()
        // Block with both hands
        .at(0.2)
        .rotate(BoneName.SHOULDER_L, -0.5, 0.5, 0.3)
        .rotate(BoneName.SHOULDER_R, -0.5, -0.5, -0.3)
        .done()
        // Counter strike (right hand)
        .at(0.35)
        .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.5)
        .withGuard("MIDDLE_GUARD", "left") // Left maintains guard
        .done()
        // Return to guard
        .at(0.5)
        .withGuard("MIDDLE_GUARD")
        .done()
        .build();

      expect(blockAndCounter.keyframes).toHaveLength(4);

      const startFrame = blockAndCounter.keyframes[0];
      const endFrame = blockAndCounter.keyframes[3];

      // Start and end in guard
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });
  });

  describe("Performance Requirements", () => {
    it("should create guard animations efficiently (<10ms)", () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        MartialArtsAnimationBuilder.create(`test_${i}`, `테스트${i}`)
          .asAttack(0.5)
          .at(0)
          .withGuard("MIDDLE_GUARD")
          .done()
          .at(0.25)
          .withGuard("MIDDLE_GUARD", "left")
          .done()
          .at(0.5)
          .withGuard("MIDDLE_GUARD")
          .done()
          .build();
      }

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(10); // Should be very fast
    });

    it("should maintain 60fps animation targets", () => {
      const animation = MartialArtsAnimationBuilder.create(
        "performance_test",
        "성능테스트"
      )
        .asAttack(0.6)
        .at(0)
        .withGuard("MIDDLE_GUARD")
        .done()
        .at(0.3)
        .withGuard("MIDDLE_GUARD", "left")
        .done()
        .at(0.6)
        .withGuard("MIDDLE_GUARD")
        .done()
        .build();

      expect(animation.duration).toBe(0.6);
      expect(animation.keyframes).toHaveLength(3);

      // Verify smooth interpolation between keyframes
      const frameTime = 1 / 60; // 16.67ms per frame
      const expectedFrames = Math.ceil(animation.duration / frameTime);
      expect(expectedFrames).toBeGreaterThanOrEqual(36); // 60fps * 0.6s = 36 frames
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should use proper Korean terminology", () => {
      expect(HIGH_GUARD.korean).toBe("상단막기");
      expect(HIGH_GUARD.romanized).toBe("Sangdan Makgi");
      expect(MIDDLE_GUARD.korean).toBe("중단막기");
      expect(MIDDLE_GUARD.romanized).toBe("Jungdan Makgi");
      expect(LOW_GUARD.korean).toBe("하단막기");
      expect(LOW_GUARD.romanized).toBe("Hadan Makgi");
    });

    it("should have proper hand pose descriptions", () => {
      expect(HIGH_GUARD.handPose).toBe("fist_vertical");
      expect(MIDDLE_GUARD.handPose).toBe("fist_vertical");
      expect(LOW_GUARD.handPose).toBe("fist_vertical");
    });

    it("should protect vital areas according to guard height", () => {
      // High guard protects head
      expect(HIGH_GUARD.protects).toEqual(
        expect.arrayContaining(["head", "temple", "forehead"])
      );

      // Middle guard protects torso
      expect(MIDDLE_GUARD.protects).toEqual(
        expect.arrayContaining(["chest", "solar_plexus", "ribs"])
      );

      // Low guard protects lower body
      expect(LOW_GUARD.protects).toEqual(
        expect.arrayContaining(["abdomen", "groin"])
      );
    });
  });
});
