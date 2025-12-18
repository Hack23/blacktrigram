/**
 * Unit tests for AttackAnimations
 * 
 * Tests animation clip definitions, keyframes, and timing
 */

import { describe, it, expect } from "vitest";
import {
  JAB_ANIMATION,
  CROSS_ANIMATION,
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  BLOCK_ANIMATION,
  FIGHTING_STANCE_ANIMATION,
  IDLE_ANIMATION,
  ANIMATION_CLIPS,
} from "./AttackAnimations";

describe("AttackAnimations", () => {
  describe("JAB_ANIMATION", () => {
    it("should have correct structure", () => {
      expect(JAB_ANIMATION.name).toBe("jab");
      expect(JAB_ANIMATION.duration).toBe(0.3);
      expect(JAB_ANIMATION.loop).toBe(false);
      expect(JAB_ANIMATION.keyframes).toBeDefined();
    });

    it("should have 5 keyframes", () => {
      expect(JAB_ANIMATION.keyframes).toHaveLength(5);
    });

    it("should have keyframes at correct times", () => {
      const times = JAB_ANIMATION.keyframes.map((kf) => kf.time);
      expect(times).toEqual([0.0, 0.1, 0.15, 0.25, 0.3]);
    });

    it("should animate right arm and torso", () => {
      const windUp = JAB_ANIMATION.keyframes[0];
      const boneNames = windUp.transforms.map((t) => t.boneName);

      expect(boneNames).toContain("shoulder_R");
      expect(boneNames).toContain("elbow_R");
      expect(boneNames).toContain("spine_upper");
    });

    it("should extend elbow during punch", () => {
      const windUp = JAB_ANIMATION.keyframes[0];
      const extension = JAB_ANIMATION.keyframes[2]; // Full extension

      const windUpElbow = windUp.transforms.find(
        (t) => t.boneName === "elbow_R"
      );
      const extendElbow = extension.transforms.find(
        (t) => t.boneName === "elbow_R"
      );

      expect(windUpElbow?.rotation?.z).toBeLessThan(-1.0); // Bent
      expect(extendElbow?.rotation?.z).toBeGreaterThan(-0.2); // Straight
    });

    it("should move hand forward", () => {
      const extension = JAB_ANIMATION.keyframes[2];
      const handTransform = extension.transforms.find(
        (t) => t.boneName === "hand_R"
      );

      expect(handTransform?.position).toBeDefined();
      expect(handTransform!.position!.x).toBeGreaterThan(0);
    });
  });

  describe("CROSS_ANIMATION", () => {
    it("should have correct structure", () => {
      expect(CROSS_ANIMATION.name).toBe("cross");
      expect(CROSS_ANIMATION.duration).toBe(0.35);
      expect(CROSS_ANIMATION.loop).toBe(false);
    });

    it("should animate left arm and rotate torso", () => {
      const impact = CROSS_ANIMATION.keyframes[2];
      const boneNames = impact.transforms.map((t) => t.boneName);

      expect(boneNames).toContain("shoulder_L");
      expect(boneNames).toContain("elbow_L");
      expect(boneNames).toContain("spine_upper");
      expect(boneNames).toContain("pelvis");
    });

    it("should rotate pelvis during cross", () => {
      const impact = CROSS_ANIMATION.keyframes[2];

      const pelvisRotation = impact.transforms.find(
        (t) => t.boneName === "pelvis"
      )?.rotation?.y;

      expect(pelvisRotation).toBeDefined();
      expect(Math.abs(pelvisRotation!)).toBeGreaterThan(0.1);
    });
  });

  describe("FRONT_KICK_ANIMATION", () => {
    it("should have correct structure", () => {
      expect(FRONT_KICK_ANIMATION.name).toBe("front_kick");
      expect(FRONT_KICK_ANIMATION.duration).toBe(0.4);
      expect(FRONT_KICK_ANIMATION.loop).toBe(false);
    });

    it("should animate right leg", () => {
      const chamber = FRONT_KICK_ANIMATION.keyframes[0];
      const boneNames = chamber.transforms.map((t) => t.boneName);

      expect(boneNames).toContain("hip_R");
      expect(boneNames).toContain("knee_R");
      expect(boneNames).toContain("ankle_R");
    });

    it("should lift knee in chambering phase", () => {
      const chamber = FRONT_KICK_ANIMATION.keyframes[0];
      const hipTransform = chamber.transforms.find((t) => t.boneName === "hip_R");
      const kneeTransform = chamber.transforms.find((t) => t.boneName === "knee_R");

      expect(hipTransform?.rotation?.x).toBeGreaterThan(0.5); // Hip flexion
      expect(kneeTransform?.rotation?.z).toBeGreaterThan(1.0); // Knee bent
    });

    it("should extend leg during kick", () => {
      const extension = FRONT_KICK_ANIMATION.keyframes[1];
      const kneeTransform = extension.transforms.find((t) => t.boneName === "knee_R");

      expect(kneeTransform?.rotation?.z).toBeLessThan(0.5); // Less bent
    });
  });

  describe("ROUNDHOUSE_KICK_ANIMATION", () => {
    it("should have correct structure", () => {
      expect(ROUNDHOUSE_KICK_ANIMATION.name).toBe("roundhouse_kick");
      expect(ROUNDHOUSE_KICK_ANIMATION.duration).toBe(0.5);
      expect(ROUNDHOUSE_KICK_ANIMATION.loop).toBe(false);
    });

    it("should rotate pelvis for roundhouse", () => {
      const rotation = ROUNDHOUSE_KICK_ANIMATION.keyframes[1];
      const pelvisTransform = rotation.transforms.find((t) => t.boneName === "pelvis");

      expect(pelvisTransform?.rotation?.y).toBeDefined();
      expect(Math.abs(pelvisTransform!.rotation!.y)).toBeGreaterThan(0.5);
    });

    it("should chamber knee before extension", () => {
      const chamber = ROUNDHOUSE_KICK_ANIMATION.keyframes[1];
      const extension = ROUNDHOUSE_KICK_ANIMATION.keyframes[2];

      const chamberKnee = chamber.transforms.find((t) => t.boneName === "knee_R")?.rotation?.z;
      const extendKnee = extension.transforms.find((t) => t.boneName === "knee_R")?.rotation?.z;

      expect(chamberKnee).toBeGreaterThan(1.0); // Bent
      expect(extendKnee).toBeLessThan(1.0); // Extended
    });
  });

  describe("BLOCK_ANIMATION", () => {
    it("should have correct structure", () => {
      expect(BLOCK_ANIMATION.name).toBe("block");
      expect(BLOCK_ANIMATION.duration).toBe(0.2);
      expect(BLOCK_ANIMATION.loop).toBe(false);
    });

    it("should raise both arms", () => {
      const guard = BLOCK_ANIMATION.keyframes[1];
      const boneNames = guard.transforms.map((t) => t.boneName);

      expect(boneNames).toContain("shoulder_L");
      expect(boneNames).toContain("shoulder_R");
      expect(boneNames).toContain("elbow_L");
      expect(boneNames).toContain("elbow_R");
    });

    it("should position arms symmetrically", () => {
      const guard = BLOCK_ANIMATION.keyframes[1];

      const shoulderL = guard.transforms.find((t) => t.boneName === "shoulder_L")?.rotation?.z;
      const shoulderR = guard.transforms.find((t) => t.boneName === "shoulder_R")?.rotation?.z;

      expect(shoulderL).toBeDefined();
      expect(shoulderR).toBeDefined();
      expect(Math.abs(shoulderL! + shoulderR!)).toBeLessThan(0.1); // Nearly opposite
    });
  });

  describe("FIGHTING_STANCE_ANIMATION", () => {
    it("should be looping", () => {
      expect(FIGHTING_STANCE_ANIMATION.loop).toBe(true);
    });

    it("should have breathing cycle", () => {
      expect(FIGHTING_STANCE_ANIMATION.duration).toBe(1.0);
      expect(FIGHTING_STANCE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should maintain guard position", () => {
      const neutral = FIGHTING_STANCE_ANIMATION.keyframes[0];
      const boneNames = neutral.transforms.map((t) => t.boneName);

      expect(boneNames).toContain("shoulder_L");
      expect(boneNames).toContain("shoulder_R");
      expect(boneNames).toContain("elbow_L");
      expect(boneNames).toContain("elbow_R");
    });

    it("should have slight knee bend", () => {
      const neutral = FIGHTING_STANCE_ANIMATION.keyframes[0];
      const kneeL = neutral.transforms.find((t) => t.boneName === "knee_L");
      const kneeR = neutral.transforms.find((t) => t.boneName === "knee_R");

      expect(kneeL?.rotation?.z).toBeGreaterThan(0);
      expect(kneeR?.rotation?.z).toBeGreaterThan(0);
    });
  });

  describe("IDLE_ANIMATION", () => {
    it("should be looping", () => {
      expect(IDLE_ANIMATION.loop).toBe(true);
    });

    it("should have subtle breathing motion", () => {
      expect(IDLE_ANIMATION.duration).toBe(2.0);
      expect(IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should animate spine for breathing", () => {
      const breathing = IDLE_ANIMATION.keyframes[1];
      const spine = breathing.transforms.find((t) => t.boneName === "spine_upper");

      expect(spine).toBeDefined();
      expect(spine?.position).toBeDefined();
    });
  });

  describe("ANIMATION_CLIPS", () => {
    it("should contain all animations", () => {
      expect(ANIMATION_CLIPS.jab).toBe(JAB_ANIMATION);
      expect(ANIMATION_CLIPS.cross).toBe(CROSS_ANIMATION);
      expect(ANIMATION_CLIPS.front_kick).toBe(FRONT_KICK_ANIMATION);
      expect(ANIMATION_CLIPS.roundhouse_kick).toBe(ROUNDHOUSE_KICK_ANIMATION);
      expect(ANIMATION_CLIPS.block).toBe(BLOCK_ANIMATION);
      expect(ANIMATION_CLIPS.fighting_stance).toBe(FIGHTING_STANCE_ANIMATION);
      expect(ANIMATION_CLIPS.idle).toBe(IDLE_ANIMATION);
    });

    it("should be accessible by name", () => {
      expect(ANIMATION_CLIPS["jab"]).toBeDefined();
      expect(ANIMATION_CLIPS["cross"]).toBeDefined();
      expect(ANIMATION_CLIPS["front_kick"]).toBeDefined();
    });
  });

  describe("Animation Timing", () => {
    it("all attack animations should be under 0.6s", () => {
      expect(JAB_ANIMATION.duration).toBeLessThanOrEqual(0.6);
      expect(CROSS_ANIMATION.duration).toBeLessThanOrEqual(0.6);
      expect(FRONT_KICK_ANIMATION.duration).toBeLessThanOrEqual(0.6);
      expect(ROUNDHOUSE_KICK_ANIMATION.duration).toBeLessThanOrEqual(0.6);
      expect(BLOCK_ANIMATION.duration).toBeLessThanOrEqual(0.6);
    });

    it("keyframes should be in ascending time order", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        BLOCK_ANIMATION,
        FIGHTING_STANCE_ANIMATION,
        IDLE_ANIMATION,
      ];

      animations.forEach((anim) => {
        const times = anim.keyframes.map((kf) => kf.time);
        for (let i = 1; i < times.length; i++) {
          expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
        }
      });
    });

    it("last keyframe should match duration", () => {
      const animations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        BLOCK_ANIMATION,
        FIGHTING_STANCE_ANIMATION,
        IDLE_ANIMATION,
      ];

      animations.forEach((anim) => {
        const lastKeyframe = anim.keyframes[anim.keyframes.length - 1];
        expect(lastKeyframe.time).toBe(anim.duration);
      });
    });
  });

  describe("Transform Data", () => {
    it("all bone transforms should have valid rotations", () => {
      const animations = [JAB_ANIMATION, CROSS_ANIMATION, FRONT_KICK_ANIMATION];

      animations.forEach((anim) => {
        anim.keyframes.forEach((keyframe) => {
          keyframe.transforms.forEach((transform) => {
            if (transform.rotation) {
              expect(transform.rotation.x).toBeDefined();
              expect(transform.rotation.y).toBeDefined();
              expect(transform.rotation.z).toBeDefined();
              expect(typeof transform.rotation.x).toBe("number");
              expect(typeof transform.rotation.y).toBe("number");
              expect(typeof transform.rotation.z).toBe("number");
            }
          });
        });
      });
    });

    it("position transforms should be optional", () => {
      const windUp = JAB_ANIMATION.keyframes[0];
      const hasPositionTransform = windUp.transforms.some((t) => t.position !== undefined);
      
      // Wind-up typically doesn't need position changes
      expect(hasPositionTransform).toBe(false);
    });
  });
});
