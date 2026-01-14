/**
 * Guarded Attack Animations Tests
 *
 * Validates that guarded attack animations maintain proper Korean martial arts
 * defensive positioning (막기자세) throughout technique execution.
 *
 * Tests verify:
 * - All techniques start from proper guard position
 * - Non-striking hand maintains guard during technique
 * - Both hands return to guard after technique
 * - Guard height appropriate for technique type
 *
 * @module systems/animation/__tests__/GuardedAttackAnimations
 * @korean 막기자세공격애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "../../../types/skeletal";
import {
  GUARDED_JAB_ANIMATION,
  GUARDED_CROSS_ANIMATION,
  GUARDED_HOOK_ANIMATION,
  GUARDED_FRONT_KICK_ANIMATION,
  GUARDED_ATTACK_ANIMATIONS,
} from "../GuardedAttackAnimations";
import {
  HIGH_GUARD,
  MIDDLE_GUARD,
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
  const shoulderName =
    hand === "left" ? BoneName.SHOULDER_L : BoneName.SHOULDER_R;
  const elbowName = hand === "left" ? BoneName.ELBOW_L : BoneName.ELBOW_R;

  const shoulderRot = keyframe.boneRotations.get(shoulderName);
  const elbowRot = keyframe.boneRotations.get(elbowName);

  if (!shoulderRot || !elbowRot) return false;

  const guardArm = hand === "left" ? guard.left : guard.right;

  // Check angles with reasonable tolerance (±0.3 radians ~= 17°)
  const shoulderMatch =
    Math.abs(shoulderRot.x - guardArm.shoulder[0]) < 0.3 &&
    Math.abs(shoulderRot.y - guardArm.shoulder[1]) < 0.3 &&
    Math.abs(shoulderRot.z - guardArm.shoulder[2]) < 0.3;

  const elbowMatch =
    Math.abs(elbowRot.x - guardArm.elbow[0]) < 0.3 &&
    Math.abs(elbowRot.y - guardArm.elbow[1]) < 0.3 &&
    Math.abs(elbowRot.z - guardArm.elbow[2]) < 0.3;

  return shoulderMatch && elbowMatch;
}

describe("Guarded Attack Animations", () => {
  describe("GUARDED_JAB_ANIMATION (막기자세 잽)", () => {
    it("should have proper animation structure", () => {
      expect(GUARDED_JAB_ANIMATION).toBeDefined();
      expect(GUARDED_JAB_ANIMATION.name).toBe("guarded_jab");
      expect(GUARDED_JAB_ANIMATION.koreanName).toBe("막기자세_잽");
      expect(GUARDED_JAB_ANIMATION.type).toBe("attack");
      expect(GUARDED_JAB_ANIMATION.duration).toBe(0.3);
      expect(GUARDED_JAB_ANIMATION.keyframes.length).toBeGreaterThan(0);
    });

    it("should start in middle guard (중단막기)", () => {
      const startFrame = GUARDED_JAB_ANIMATION.keyframes[0];
      expect(startFrame.time).toBe(0.0);

      // Both hands should be in middle guard at start
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should maintain left hand guard during right punch", () => {
      // Find keyframes during punch execution (between start and end)
      const midFrames = GUARDED_JAB_ANIMATION.keyframes.filter(
        (kf) => kf.time > 0 && kf.time < GUARDED_JAB_ANIMATION.duration
      );

      expect(midFrames.length).toBeGreaterThan(0);

      // Check that at least one mid-frame has left guard maintained
      const hasGuardDuringPunch = midFrames.some((kf) =>
        hasGuardPosition(kf, "MIDDLE_GUARD", "left")
      );

      expect(hasGuardDuringPunch).toBe(true);
    });

    it("should return to middle guard at end (복귀)", () => {
      const endFrame =
        GUARDED_JAB_ANIMATION.keyframes[
          GUARDED_JAB_ANIMATION.keyframes.length - 1
        ];
      expect(endFrame.time).toBe(GUARDED_JAB_ANIMATION.duration);

      // Both hands should return to middle guard
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should have torso rotation reset at end", () => {
      const endFrame =
        GUARDED_JAB_ANIMATION.keyframes[
          GUARDED_JAB_ANIMATION.keyframes.length - 1
        ];

      const spineUpper = endFrame.boneRotations.get(BoneName.SPINE_UPPER);
      const spineMiddle = endFrame.boneRotations.get(BoneName.SPINE_MIDDLE);
      const pelvis = endFrame.boneRotations.get(BoneName.PELVIS);

      // Torso should be reset to neutral
      expect(spineUpper?.y).toBeCloseTo(0, 1);
      expect(spineMiddle?.y).toBeCloseTo(0, 1);
      expect(pelvis?.y).toBeCloseTo(0, 1);
    });
  });

  describe("GUARDED_CROSS_ANIMATION (막기자세 크로스)", () => {
    it("should have proper animation structure", () => {
      expect(GUARDED_CROSS_ANIMATION).toBeDefined();
      expect(GUARDED_CROSS_ANIMATION.name).toBe("guarded_cross");
      expect(GUARDED_CROSS_ANIMATION.koreanName).toBe("막기자세_크로스");
      expect(GUARDED_CROSS_ANIMATION.type).toBe("attack");
      expect(GUARDED_CROSS_ANIMATION.duration).toBe(0.35);
      expect(GUARDED_CROSS_ANIMATION.keyframes.length).toBeGreaterThan(0);
    });

    it("should start in middle guard (중단막기)", () => {
      const startFrame = GUARDED_CROSS_ANIMATION.keyframes[0];
      expect(startFrame.time).toBe(0.0);

      // Both hands should be in middle guard at start
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should maintain right hand guard during left punch", () => {
      // Find keyframes during punch execution
      const midFrames = GUARDED_CROSS_ANIMATION.keyframes.filter(
        (kf) => kf.time > 0 && kf.time < GUARDED_CROSS_ANIMATION.duration
      );

      expect(midFrames.length).toBeGreaterThan(0);

      // Check that at least one mid-frame has right guard maintained
      const hasGuardDuringPunch = midFrames.some((kf) =>
        hasGuardPosition(kf, "MIDDLE_GUARD", "right")
      );

      expect(hasGuardDuringPunch).toBe(true);
    });

    it("should return to middle guard at end (복귀)", () => {
      const endFrame =
        GUARDED_CROSS_ANIMATION.keyframes[
          GUARDED_CROSS_ANIMATION.keyframes.length - 1
        ];
      expect(endFrame.time).toBe(GUARDED_CROSS_ANIMATION.duration);

      // Both hands should return to middle guard
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should have torso rotation reset at end", () => {
      const endFrame =
        GUARDED_CROSS_ANIMATION.keyframes[
          GUARDED_CROSS_ANIMATION.keyframes.length - 1
        ];

      const spineUpper = endFrame.boneRotations.get(BoneName.SPINE_UPPER);
      const pelvis = endFrame.boneRotations.get(BoneName.PELVIS);

      // Torso should be reset to neutral
      expect(spineUpper?.y).toBeCloseTo(0, 1);
      expect(pelvis?.y).toBeCloseTo(0, 1);
    });
  });

  describe("GUARDED_HOOK_ANIMATION (막기자세 훅)", () => {
    it("should have proper animation structure", () => {
      expect(GUARDED_HOOK_ANIMATION).toBeDefined();
      expect(GUARDED_HOOK_ANIMATION.name).toBe("guarded_hook");
      expect(GUARDED_HOOK_ANIMATION.koreanName).toBe("막기자세_훅");
      expect(GUARDED_HOOK_ANIMATION.type).toBe("attack");
      expect(GUARDED_HOOK_ANIMATION.duration).toBe(0.35);
    });

    it("should start in middle guard (중단막기)", () => {
      const startFrame = GUARDED_HOOK_ANIMATION.keyframes[0];

      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(startFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should maintain left hand guard during right hook", () => {
      const midFrames = GUARDED_HOOK_ANIMATION.keyframes.filter(
        (kf) => kf.time > 0 && kf.time < GUARDED_HOOK_ANIMATION.duration
      );

      const hasGuardDuringHook = midFrames.some((kf) =>
        hasGuardPosition(kf, "MIDDLE_GUARD", "left")
      );

      expect(hasGuardDuringHook).toBe(true);
    });

    it("should return to middle guard at end (복귀)", () => {
      const endFrame =
        GUARDED_HOOK_ANIMATION.keyframes[
          GUARDED_HOOK_ANIMATION.keyframes.length - 1
        ];

      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });
  });

  describe("GUARDED_FRONT_KICK_ANIMATION (막기자세 앞차기)", () => {
    it("should have proper animation structure", () => {
      expect(GUARDED_FRONT_KICK_ANIMATION).toBeDefined();
      expect(GUARDED_FRONT_KICK_ANIMATION.name).toBe("guarded_front_kick");
      expect(GUARDED_FRONT_KICK_ANIMATION.koreanName).toBe("막기자세_앞차기");
      expect(GUARDED_FRONT_KICK_ANIMATION.type).toBe("attack");
      expect(GUARDED_FRONT_KICK_ANIMATION.duration).toBe(0.55);
    });

    it("should start in high guard (상단막기) for kick", () => {
      const startFrame = GUARDED_FRONT_KICK_ANIMATION.keyframes[0];
      expect(startFrame.time).toBe(0.0);

      // Both hands should be in high guard at start (face protection for kick)
      expect(hasGuardPosition(startFrame, "HIGH_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(startFrame, "HIGH_GUARD", "right")).toBe(true);
    });

    it("should maintain high guard during kick execution", () => {
      // Find keyframes during kick (not the last frame)
      const kickFrames = GUARDED_FRONT_KICK_ANIMATION.keyframes.filter(
        (kf) => kf.time > 0 && kf.time < 0.4 // Before recovery phase
      );

      expect(kickFrames.length).toBeGreaterThan(0);

      // At least some frames should maintain high guard during kick
      const maintainsHighGuard = kickFrames.some(
        (kf) =>
          hasGuardPosition(kf, "HIGH_GUARD", "left") &&
          hasGuardPosition(kf, "HIGH_GUARD", "right")
      );

      expect(maintainsHighGuard).toBe(true);
    });

    it("should return to middle guard at end (복귀)", () => {
      const endFrame =
        GUARDED_FRONT_KICK_ANIMATION.keyframes[
          GUARDED_FRONT_KICK_ANIMATION.keyframes.length - 1
        ];
      expect(endFrame.time).toBe(GUARDED_FRONT_KICK_ANIMATION.duration);

      // Both hands should return to middle guard after kick
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
      expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
    });

    it("should have leg returned to stance at end", () => {
      const endFrame =
        GUARDED_FRONT_KICK_ANIMATION.keyframes[
          GUARDED_FRONT_KICK_ANIMATION.keyframes.length - 1
        ];

      const hipR = endFrame.boneRotations.get(BoneName.HIP_R);
      const kneeR = endFrame.boneRotations.get(BoneName.KNEE_R);
      const pelvis = endFrame.boneRotations.get(BoneName.PELVIS);

      // Leg should be back in neutral stance
      expect(hipR?.x).toBeCloseTo(0, 1);
      expect(kneeR?.x).toBeCloseTo(-0.2, 1); // Slight bend for stance
      expect(pelvis?.x).toBeCloseTo(0, 1);
    });
  });

  describe("GUARDED_ATTACK_ANIMATIONS Export", () => {
    it("should export all guarded animations", () => {
      expect(GUARDED_ATTACK_ANIMATIONS).toBeDefined();
      expect(GUARDED_ATTACK_ANIMATIONS.GUARDED_JAB).toBe(GUARDED_JAB_ANIMATION);
      expect(GUARDED_ATTACK_ANIMATIONS.GUARDED_CROSS).toBe(
        GUARDED_CROSS_ANIMATION
      );
      expect(GUARDED_ATTACK_ANIMATIONS.GUARDED_HOOK).toBe(
        GUARDED_HOOK_ANIMATION
      );
      expect(GUARDED_ATTACK_ANIMATIONS.GUARDED_FRONT_KICK).toBe(
        GUARDED_FRONT_KICK_ANIMATION
      );
    });

    it("should have all animations as attack type", () => {
      Object.values(GUARDED_ATTACK_ANIMATIONS).forEach((animation) => {
        expect(animation.type).toBe("attack");
      });
    });

    it("should have Korean names for all animations", () => {
      Object.values(GUARDED_ATTACK_ANIMATIONS).forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(animation.koreanName).toContain("막기자세");
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should maintain 60fps target durations", () => {
      const frameTime = 1 / 60; // 16.67ms per frame

      Object.values(GUARDED_ATTACK_ANIMATIONS).forEach((animation) => {
        const expectedFrames = Math.ceil(animation.duration / frameTime);
        expect(expectedFrames).toBeGreaterThanOrEqual(18); // Minimum frames for visibility
        expect(animation.duration).toBeGreaterThanOrEqual(0.3); // Minimum 300ms
      });
    });

    it("should have reasonable keyframe counts", () => {
      Object.values(GUARDED_ATTACK_ANIMATIONS).forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3); // Start, mid, end minimum
        expect(animation.keyframes.length).toBeLessThanOrEqual(10); // Not too complex
      });
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should use proper Korean terminology", () => {
      expect(GUARDED_JAB_ANIMATION.koreanName).toBe("막기자세_잽");
      expect(GUARDED_CROSS_ANIMATION.koreanName).toBe("막기자세_크로스");
      expect(GUARDED_HOOK_ANIMATION.koreanName).toBe("막기자세_훅");
      expect(GUARDED_FRONT_KICK_ANIMATION.koreanName).toBe("막기자세_앞차기");
    });

    it("should demonstrate proper guard standards (막기자세)", () => {
      const animations = Object.values(GUARDED_ATTACK_ANIMATIONS);

      animations.forEach((animation) => {
        const startFrame = animation.keyframes[0];
        const endFrame = animation.keyframes[animation.keyframes.length - 1];

        // Every animation should start with both hands in guard
        const startHasLeftGuard =
          hasGuardPosition(startFrame, "MIDDLE_GUARD", "left") ||
          hasGuardPosition(startFrame, "HIGH_GUARD", "left");

        const startHasRightGuard =
          hasGuardPosition(startFrame, "MIDDLE_GUARD", "right") ||
          hasGuardPosition(startFrame, "HIGH_GUARD", "right");

        expect(startHasLeftGuard).toBe(true);
        expect(startHasRightGuard).toBe(true);

        // Every animation should end with both hands in guard
        const endHasLeftGuard =
          hasGuardPosition(endFrame, "MIDDLE_GUARD", "left") ||
          hasGuardPosition(endFrame, "HIGH_GUARD", "left");

        const endHasRightGuard =
          hasGuardPosition(endFrame, "MIDDLE_GUARD", "right") ||
          hasGuardPosition(endFrame, "HIGH_GUARD", "right");

        expect(endHasLeftGuard).toBe(true);
        expect(endHasRightGuard).toBe(true);
      });
    });
  });
});
