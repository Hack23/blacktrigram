/**
 * Tests for Basic Animations Module
 *
 * Validates core locomotion and state animations:
 * - Idle breathing animation (대기호흡)
 * - Run cycle (달리기)
 * - Walk cycle (걷기)
 * - Fall animations (낙법)
 *
 * @module systems/animation/__tests__/BasicAnimations
 * @korean 기본애니메이션테스트
 */

import { BoneName } from "@/types/skeletal";
import { describe, expect, it } from "vitest";
import {
  BASIC_ANIMATIONS,
  FALL_BACKWARD_ANIMATION,
  FALL_FORWARD_ANIMATION,
  FALL_SIDE_LEFT_ANIMATION,
  FALL_SIDE_RIGHT_ANIMATION,
  IDLE_ANIMATION,
  RUN_ANIMATION,
  WALK_ANIMATION,
} from "./BasicAnimations";

describe("BasicAnimations", () => {
  describe("IDLE_ANIMATION (대기)", () => {
    it("should be defined with correct properties", () => {
      expect(IDLE_ANIMATION).toBeDefined();
      expect(IDLE_ANIMATION.name).toBe("idle");
      expect(IDLE_ANIMATION.koreanName).toBe("대기");
      expect(IDLE_ANIMATION.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for idle breathing", () => {
      expect(IDLE_ANIMATION.duration).toBe(2.0);
      expect(typeof IDLE_ANIMATION.duration).toBe("number");
      expect(IDLE_ANIMATION.duration).toBeGreaterThan(0);
    });

    it("should be marked as looping", () => {
      expect(IDLE_ANIMATION.loop).toBe(true);
    });

    it("should have at least 5 keyframes", () => {
      expect(IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should have time-ordered keyframes", () => {
      for (let i = 1; i < IDLE_ANIMATION.keyframes.length; i++) {
        expect(IDLE_ANIMATION.keyframes[i].time).toBeGreaterThan(
          IDLE_ANIMATION.keyframes[i - 1].time,
        );
      }
    });

    it("should include subtle spine movement for breathing", () => {
      const hasSpineMovement = IDLE_ANIMATION.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.SPINE_UPPER) ||
          kf.boneRotations.has(BoneName.SPINE_LOWER)
        );
      });
      expect(hasSpineMovement).toBe(true);
    });

    it("should include shoulder rotations", () => {
      const hasShouldersMovement = IDLE_ANIMATION.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.SHOULDER_L) ||
          kf.boneRotations.has(BoneName.SHOULDER_R)
        );
      });
      expect(hasShouldersMovement).toBe(true);
    });
  });

  describe("RUN_ANIMATION (달리기)", () => {
    it("should be defined with correct properties", () => {
      expect(RUN_ANIMATION).toBeDefined();
      expect(RUN_ANIMATION.name).toBe("run");
      expect(RUN_ANIMATION.koreanName).toBe("달리기");
      expect(RUN_ANIMATION.keyframes).toBeInstanceOf(Array);
    });

    it("should have valid duration for run cycle", () => {
      expect(RUN_ANIMATION.duration).toBe(0.5);
      expect(typeof RUN_ANIMATION.duration).toBe("number");
    });

    it("should be marked as looping", () => {
      expect(RUN_ANIMATION.loop).toBe(true);
    });

    it("should have at least 4 keyframes for full gait", () => {
      expect(RUN_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    });

    it("should include both leg movements", () => {
      const hasLeftLeg = RUN_ANIMATION.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.HIP_L);
      });
      const hasRightLeg = RUN_ANIMATION.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.HIP_R);
      });
      expect(hasLeftLeg).toBe(true);
      expect(hasRightLeg).toBe(true);
    });

    it("should include arm swing", () => {
      const hasArmSwing = RUN_ANIMATION.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.SHOULDER_L) ||
          kf.boneRotations.has(BoneName.SHOULDER_R)
        );
      });
      expect(hasArmSwing).toBe(true);
    });

    it("should have pelvis vertical movement (bounce)", () => {
      const hasPelvisMovement = RUN_ANIMATION.keyframes.some((kf) => {
        return kf.bonePositions.has(BoneName.PELVIS);
      });
      expect(hasPelvisMovement).toBe(true);
    });
  });

  describe("WALK_ANIMATION (걷기)", () => {
    it("should be defined with correct properties", () => {
      expect(WALK_ANIMATION).toBeDefined();
      expect(WALK_ANIMATION.name).toBe("walk");
      expect(WALK_ANIMATION.koreanName).toBe("걷기");
    });

    it("should have valid duration for walk cycle", () => {
      expect(WALK_ANIMATION.duration).toBe(0.8);
      expect(WALK_ANIMATION.duration).toBeGreaterThan(RUN_ANIMATION.duration);
    });

    it("should be marked as looping", () => {
      expect(WALK_ANIMATION.loop).toBe(true);
    });

    it("should have at least 4 keyframes", () => {
      expect(WALK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    });

    it("should include natural arm swing", () => {
      const hasArmSwing = WALK_ANIMATION.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.SHOULDER_L);
      });
      expect(hasArmSwing).toBe(true);
    });

    it("should have time-ordered keyframes", () => {
      for (let i = 1; i < WALK_ANIMATION.keyframes.length; i++) {
        expect(WALK_ANIMATION.keyframes[i].time).toBeGreaterThan(
          WALK_ANIMATION.keyframes[i - 1].time,
        );
      }
    });
  });

  describe("FALL_FORWARD_ANIMATION (전방낙법)", () => {
    it("should be defined with correct properties", () => {
      expect(FALL_FORWARD_ANIMATION).toBeDefined();
      expect(FALL_FORWARD_ANIMATION.name).toBe("fall_forward");
      expect(FALL_FORWARD_ANIMATION.koreanName).toBe("전방낙법");
    });

    it("should have valid duration", () => {
      expect(FALL_FORWARD_ANIMATION.duration).toBe(0.4);
      expect(typeof FALL_FORWARD_ANIMATION.duration).toBe("number");
    });

    it("should not be looping", () => {
      expect(FALL_FORWARD_ANIMATION.loop).toBe(false);
    });

    it("should have at least 4 keyframes", () => {
      expect(FALL_FORWARD_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    });

    it("should include spine rotation for forward fall", () => {
      const hasSpineRotation = FALL_FORWARD_ANIMATION.keyframes.some((kf) => {
        const spine = kf.boneRotations.get(BoneName.SPINE_LOWER);
        return spine && spine.x > 0.1; // Forward lean
      });
      expect(hasSpineRotation).toBe(true);
    });

    it("should include hand bracing (shoulder/elbow rotation)", () => {
      const hasHandBracing = FALL_FORWARD_ANIMATION.keyframes.some((kf) => {
        return (
          kf.boneRotations.has(BoneName.SHOULDER_L) &&
          kf.boneRotations.has(BoneName.ELBOW_L)
        );
      });
      expect(hasHandBracing).toBe(true);
    });

    it("should lower pelvis to ground", () => {
      const hasPelvisLowering = FALL_FORWARD_ANIMATION.keyframes.some((kf) => {
        const pelvisPos = kf.bonePositions.get(BoneName.PELVIS);
        return pelvisPos && pelvisPos.y < -0.5;
      });
      expect(hasPelvisLowering).toBe(true);
    });
  });

  describe("FALL_BACKWARD_ANIMATION (후방낙법)", () => {
    it("should be defined with correct properties", () => {
      expect(FALL_BACKWARD_ANIMATION).toBeDefined();
      expect(FALL_BACKWARD_ANIMATION.name).toBe("fall_backward");
      expect(FALL_BACKWARD_ANIMATION.koreanName).toBe("후방낙법");
    });

    it("should have valid duration", () => {
      expect(FALL_BACKWARD_ANIMATION.duration).toBe(0.5);
      expect(FALL_BACKWARD_ANIMATION.duration).toBeGreaterThan(
        FALL_FORWARD_ANIMATION.duration,
      );
    });

    it("should not be looping", () => {
      expect(FALL_BACKWARD_ANIMATION.loop).toBe(false);
    });

    it("should have at least 4 keyframes", () => {
      expect(FALL_BACKWARD_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
        4,
      );
    });

    it("should include backward spine rotation", () => {
      const hasBackwardRotation = FALL_BACKWARD_ANIMATION.keyframes.some(
        (kf) => {
          const pelvis = kf.boneRotations.get(BoneName.PELVIS);
          return pelvis && pelvis.x < -0.1; // Backward lean
        },
      );
      expect(hasBackwardRotation).toBe(true);
    });

    it("should include arm slap (shoulder abduction)", () => {
      const hasArmSlap = FALL_BACKWARD_ANIMATION.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.SHOULDER_L);
      });
      expect(hasArmSlap).toBe(true);
    });
  });

  describe("FALL_SIDE_LEFT_ANIMATION (좌측낙법)", () => {
    it("should be defined with correct properties", () => {
      expect(FALL_SIDE_LEFT_ANIMATION).toBeDefined();
      expect(FALL_SIDE_LEFT_ANIMATION.name).toBe("fall_side_left");
      expect(FALL_SIDE_LEFT_ANIMATION.koreanName).toBe("좌측낙법");
    });

    it("should have valid duration", () => {
      expect(FALL_SIDE_LEFT_ANIMATION.duration).toBe(0.45);
    });

    it("should not be looping", () => {
      expect(FALL_SIDE_LEFT_ANIMATION.loop).toBe(false);
    });

    it("should include lateral rotation", () => {
      const hasLateralRotation = FALL_SIDE_LEFT_ANIMATION.keyframes.some(
        (kf) => {
          const pelvis = kf.boneRotations.get(BoneName.PELVIS);
          return pelvis && Math.abs(pelvis.z) > 0.2; // Z-axis roll
        },
      );
      expect(hasLateralRotation).toBe(true);
    });

    it("should include left arm slap", () => {
      const hasLeftArmSlap = FALL_SIDE_LEFT_ANIMATION.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.SHOULDER_L);
      });
      expect(hasLeftArmSlap).toBe(true);
    });
  });

  describe("FALL_SIDE_RIGHT_ANIMATION (우측낙법)", () => {
    it("should be defined with correct properties", () => {
      expect(FALL_SIDE_RIGHT_ANIMATION).toBeDefined();
      expect(FALL_SIDE_RIGHT_ANIMATION.name).toBe("fall_side_right");
      expect(FALL_SIDE_RIGHT_ANIMATION.koreanName).toBe("우측낙법");
    });

    it("should have valid duration", () => {
      expect(FALL_SIDE_RIGHT_ANIMATION.duration).toBe(0.45);
      expect(FALL_SIDE_RIGHT_ANIMATION.duration).toBe(
        FALL_SIDE_LEFT_ANIMATION.duration,
      );
    });

    it("should not be looping", () => {
      expect(FALL_SIDE_RIGHT_ANIMATION.loop).toBe(false);
    });

    it("should include right arm slap", () => {
      const hasRightArmSlap = FALL_SIDE_RIGHT_ANIMATION.keyframes.some((kf) => {
        return kf.boneRotations.has(BoneName.SHOULDER_R);
      });
      expect(hasRightArmSlap).toBe(true);
    });
  });

  describe("BASIC_ANIMATIONS Map", () => {
    it("should be defined and be a Map", () => {
      expect(BASIC_ANIMATIONS).toBeDefined();
      expect(BASIC_ANIMATIONS).toBeInstanceOf(Map);
    });

    it("should contain all basic animations", () => {
      expect(BASIC_ANIMATIONS.get("idle")).toBe(IDLE_ANIMATION);
      expect(BASIC_ANIMATIONS.get("walk")).toBe(WALK_ANIMATION);
      expect(BASIC_ANIMATIONS.get("run")).toBe(RUN_ANIMATION);
      expect(BASIC_ANIMATIONS.get("fall_forward")).toBe(
        FALL_FORWARD_ANIMATION,
      );
      expect(BASIC_ANIMATIONS.get("fall_backward")).toBe(
        FALL_BACKWARD_ANIMATION,
      );
      expect(BASIC_ANIMATIONS.get("fall_side_left")).toBe(
        FALL_SIDE_LEFT_ANIMATION,
      );
      expect(BASIC_ANIMATIONS.get("fall_side_right")).toBe(
        FALL_SIDE_RIGHT_ANIMATION,
      );
    });

    it("should have exactly 7 animations", () => {
      expect(BASIC_ANIMATIONS.size).toBe(7);
    });

    it("should contain animations with Korean names", () => {
      const values = Array.from(BASIC_ANIMATIONS.values());
      values.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Animation Type Classification", () => {
    it("should classify idle as looping animation", () => {
      expect(IDLE_ANIMATION.loop).toBe(true);
    });

    it("should classify locomotion as looping animations", () => {
      expect(WALK_ANIMATION.loop).toBe(true);
      expect(RUN_ANIMATION.loop).toBe(true);
    });

    it("should classify falls as non-looping animations", () => {
      expect(FALL_FORWARD_ANIMATION.loop).toBe(false);
      expect(FALL_BACKWARD_ANIMATION.loop).toBe(false);
      expect(FALL_SIDE_LEFT_ANIMATION.loop).toBe(false);
      expect(FALL_SIDE_RIGHT_ANIMATION.loop).toBe(false);
    });
  });

  describe("Animation Quality Standards", () => {
    const allAnimations = [
      IDLE_ANIMATION,
      WALK_ANIMATION,
      RUN_ANIMATION,
      FALL_FORWARD_ANIMATION,
      FALL_BACKWARD_ANIMATION,
      FALL_SIDE_LEFT_ANIMATION,
      FALL_SIDE_RIGHT_ANIMATION,
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

    it("should have last keyframe at or near duration", () => {
      allAnimations.forEach((animation) => {
        const lastKf = animation.keyframes[animation.keyframes.length - 1];
        expect(lastKf.time).toBeGreaterThanOrEqual(animation.duration * 0.9);
        expect(lastKf.time).toBeLessThanOrEqual(animation.duration);
      });
    });

    it("should have bone rotations as Euler objects", () => {
      allAnimations.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          kf.boneRotations.forEach((rotation) => {
            expect(rotation).toBeDefined();
            expect(typeof rotation.x).toBe("number");
            expect(typeof rotation.y).toBe("number");
            expect(typeof rotation.z).toBe("number");
          });
        });
      });
    });

    it("should have bone positions as Vector3 objects", () => {
      allAnimations.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          kf.bonePositions.forEach((position) => {
            expect(position).toBeDefined();
            expect(typeof position.x).toBe("number");
            expect(typeof position.y).toBe("number");
            expect(typeof position.z).toBe("number");
          });
        });
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should have reasonable keyframe counts for 60fps performance", () => {
      const allAnimations = [
        IDLE_ANIMATION,
        WALK_ANIMATION,
        RUN_ANIMATION,
        FALL_FORWARD_ANIMATION,
        FALL_BACKWARD_ANIMATION,
        FALL_SIDE_LEFT_ANIMATION,
        FALL_SIDE_RIGHT_ANIMATION,
      ];

      allAnimations.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
        expect(animation.keyframes.length).toBeLessThanOrEqual(30);
      });
    });

    it("should have durations suitable for real-time gameplay", () => {
      expect(IDLE_ANIMATION.duration).toBeLessThanOrEqual(3);
      expect(WALK_ANIMATION.duration).toBeLessThanOrEqual(1.5);
      expect(RUN_ANIMATION.duration).toBeLessThanOrEqual(1);
      expect(FALL_FORWARD_ANIMATION.duration).toBeLessThanOrEqual(1);
      expect(FALL_BACKWARD_ANIMATION.duration).toBeLessThanOrEqual(1);
    });
  });
});
