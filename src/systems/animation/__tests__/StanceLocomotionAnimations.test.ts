/**
 * Stance Locomotion Animations Test
 *
 * Tests for trigram-specific idle, walk, and run animations.
 * Verifies that each stance has unique movement characteristics.
 *
 * @module systems/animation/__tests__/StanceLocomotionAnimations.test
 * @korean 자세별이동애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { BoneName } from "../../../types/skeletal";
import { ALL_ANIMATIONS, getAnimation } from "../AnimationRegistry";
import {
  GAM_RUN_ANIMATION,
  GAM_WALK_ANIMATION,
  GAN_RUN_ANIMATION,
  GAN_WALK_ANIMATION,
  GEON_RUN_ANIMATION,
  GEON_WALK_ANIMATION,
  GON_RUN_ANIMATION,
  GON_WALK_ANIMATION,
  JIN_RUN_ANIMATION,
  JIN_WALK_ANIMATION,
  LI_RUN_ANIMATION,
  LI_WALK_ANIMATION,
  SON_RUN_ANIMATION,
  SON_WALK_ANIMATION,
  STANCE_LOCOMOTION_ANIMATIONS,
  STANCE_RUN_ANIMATIONS,
  STANCE_WALK_ANIMATIONS,
  TAE_RUN_ANIMATION,
  TAE_WALK_ANIMATION,
  getStanceRunAnimation,
  getStanceWalkAnimation,
} from "../StanceLocomotionAnimations";

describe("StanceLocomotionAnimations", () => {
  describe("Walk Animations", () => {
    it("should have 8 trigram-specific walk animations", () => {
      expect(STANCE_WALK_ANIMATIONS.size).toBe(8);
    });

    it.each([
      ["geon", GEON_WALK_ANIMATION, "건보법"],
      ["tae", TAE_WALK_ANIMATION, "태보법"],
      ["li", LI_WALK_ANIMATION, "리보법"],
      ["jin", JIN_WALK_ANIMATION, "진보법"],
      ["son", SON_WALK_ANIMATION, "손보법"],
      ["gam", GAM_WALK_ANIMATION, "감보법"],
      ["gan", GAN_WALK_ANIMATION, "간보법"],
      ["gon", GON_WALK_ANIMATION, "곤보법"],
    ])(
      "should have %s walk animation with correct name",
      (stance, animation, koreanName) => {
        expect(animation.name).toBe(`walk_${stance}`);
        expect(animation.koreanName).toBe(koreanName);
        expect(animation.loop).toBe(true);
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
      }
    );

    it("should retrieve walk animations via getStanceWalkAnimation", () => {
      expect(getStanceWalkAnimation("geon")).toBe(GEON_WALK_ANIMATION);
      expect(getStanceWalkAnimation("tae")).toBe(TAE_WALK_ANIMATION);
      expect(getStanceWalkAnimation("li")).toBe(LI_WALK_ANIMATION);
      expect(getStanceWalkAnimation("jin")).toBe(JIN_WALK_ANIMATION);
      expect(getStanceWalkAnimation("son")).toBe(SON_WALK_ANIMATION);
      expect(getStanceWalkAnimation("gam")).toBe(GAM_WALK_ANIMATION);
      expect(getStanceWalkAnimation("gan")).toBe(GAN_WALK_ANIMATION);
      expect(getStanceWalkAnimation("gon")).toBe(GON_WALK_ANIMATION);
    });
  });

  describe("Run Animations", () => {
    it("should have 8 trigram-specific run animations", () => {
      expect(STANCE_RUN_ANIMATIONS.size).toBe(8);
    });

    it.each([
      ["geon", GEON_RUN_ANIMATION, "건질주"],
      ["tae", TAE_RUN_ANIMATION, "태질주"],
      ["li", LI_RUN_ANIMATION, "리질주"],
      ["jin", JIN_RUN_ANIMATION, "진질주"],
      ["son", SON_RUN_ANIMATION, "손질주"],
      ["gam", GAM_RUN_ANIMATION, "감질주"],
      ["gan", GAN_RUN_ANIMATION, "간질주"],
      ["gon", GON_RUN_ANIMATION, "곤질주"],
    ])(
      "should have %s run animation with correct name",
      (stance, animation, koreanName) => {
        expect(animation.name).toBe(`run_${stance}`);
        expect(animation.koreanName).toBe(koreanName);
        expect(animation.loop).toBe(true);
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
      }
    );

    it("should retrieve run animations via getStanceRunAnimation", () => {
      expect(getStanceRunAnimation("geon")).toBe(GEON_RUN_ANIMATION);
      expect(getStanceRunAnimation("tae")).toBe(TAE_RUN_ANIMATION);
      expect(getStanceRunAnimation("li")).toBe(LI_RUN_ANIMATION);
      expect(getStanceRunAnimation("jin")).toBe(JIN_RUN_ANIMATION);
      expect(getStanceRunAnimation("son")).toBe(SON_RUN_ANIMATION);
      expect(getStanceRunAnimation("gam")).toBe(GAM_RUN_ANIMATION);
      expect(getStanceRunAnimation("gan")).toBe(GAN_RUN_ANIMATION);
      expect(getStanceRunAnimation("gon")).toBe(GON_RUN_ANIMATION);
    });
  });

  describe("Combined Locomotion Animations", () => {
    it("should have 16 total locomotion animations (8 walk + 8 run)", () => {
      expect(STANCE_LOCOMOTION_ANIMATIONS.size).toBe(16);
    });

    it("should be registered in ALL_ANIMATIONS", () => {
      // Verify walk animations are in registry
      expect(ALL_ANIMATIONS.has("walk_geon")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_tae")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_li")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_jin")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_son")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_gam")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_gan")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk_gon")).toBe(true);

      // Verify run animations are in registry
      expect(ALL_ANIMATIONS.has("run_geon")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_tae")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_li")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_jin")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_son")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_gam")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_gan")).toBe(true);
      expect(ALL_ANIMATIONS.has("run_gon")).toBe(true);
    });

    it("should be retrievable via getAnimation", () => {
      expect(getAnimation("walk_geon")).toBe(GEON_WALK_ANIMATION);
      expect(getAnimation("run_geon")).toBe(GEON_RUN_ANIMATION);
      expect(getAnimation("walk_gon")).toBe(GON_WALK_ANIMATION);
      expect(getAnimation("run_gon")).toBe(GON_RUN_ANIMATION);
    });
  });

  describe("Animation Timing", () => {
    it("should have run animations faster than walk animations", () => {
      // Run animations should have shorter duration (faster)
      expect(GEON_RUN_ANIMATION.duration).toBeLessThan(
        GEON_WALK_ANIMATION.duration
      );
      expect(TAE_RUN_ANIMATION.duration).toBeLessThan(
        TAE_WALK_ANIMATION.duration
      );
      expect(LI_RUN_ANIMATION.duration).toBeLessThan(
        LI_WALK_ANIMATION.duration
      );
      expect(JIN_RUN_ANIMATION.duration).toBeLessThan(
        JIN_WALK_ANIMATION.duration
      );
      expect(SON_RUN_ANIMATION.duration).toBeLessThan(
        SON_WALK_ANIMATION.duration
      );
      expect(GAM_RUN_ANIMATION.duration).toBeLessThan(
        GAM_WALK_ANIMATION.duration
      );
      expect(GAN_RUN_ANIMATION.duration).toBeLessThan(
        GAN_WALK_ANIMATION.duration
      );
      expect(GON_RUN_ANIMATION.duration).toBeLessThan(
        GON_WALK_ANIMATION.duration
      );
    });

    it("should have different walk speeds reflecting stance philosophy", () => {
      // Gon (Earth) should be slowest - heavy, rooted
      // Li (Fire) should be fastest - quick, precise
      expect(GON_WALK_ANIMATION.duration).toBeGreaterThan(
        LI_WALK_ANIMATION.duration
      );
      expect(GAN_WALK_ANIMATION.duration).toBeGreaterThan(
        LI_WALK_ANIMATION.duration
      );
      expect(SON_WALK_ANIMATION.duration).toBeGreaterThan(
        GEON_WALK_ANIMATION.duration
      );
    });

    it("should have different run speeds reflecting stance philosophy", () => {
      // Jin (Thunder) and Li (Fire) should be fastest
      // Gon (Earth) and Gan (Mountain) should be slowest
      expect(GON_RUN_ANIMATION.duration).toBeGreaterThan(
        LI_RUN_ANIMATION.duration
      );
      expect(GAN_RUN_ANIMATION.duration).toBeGreaterThan(
        JIN_RUN_ANIMATION.duration
      );
    });
  });

  describe("Stance-specific characteristics", () => {
    describe("Geon (Heaven) - Direct, Powerful", () => {
      it("should have aggressive forward lean in walk", () => {
        // Check pelvis rotation shows forward lean
        const firstKeyframe = GEON_WALK_ANIMATION.keyframes[0];
        const pelvisRot = firstKeyframe.boneRotations.get(BoneName.PELVIS);
        expect(pelvisRot).toBeDefined();
        // Positive X rotation indicates forward lean
        expect(pelvisRot!.x).toBeGreaterThan(0);
      });
    });

    describe("Tae (Lake) - Fluid, Adaptive", () => {
      it("should have cat-like smooth walk", () => {
        expect(TAE_WALK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
        // Tae walk should have ease-in-out timing for smoothness
      });
    });

    describe("Li (Fire) - Quick, Precise", () => {
      it("should have fastest walk animation", () => {
        const walkDurations = [
          GEON_WALK_ANIMATION.duration,
          TAE_WALK_ANIMATION.duration,
          LI_WALK_ANIMATION.duration,
          JIN_WALK_ANIMATION.duration,
          SON_WALK_ANIMATION.duration,
          GAM_WALK_ANIMATION.duration,
          GAN_WALK_ANIMATION.duration,
          GON_WALK_ANIMATION.duration,
        ];
        const minDuration = Math.min(...walkDurations);
        expect(LI_WALK_ANIMATION.duration).toBe(minDuration);
      });
    });

    describe("Jin (Thunder) - Explosive", () => {
      it("should have powerful stride in run", () => {
        const firstKeyframe = JIN_RUN_ANIMATION.keyframes[0];
        const pelvisRot = firstKeyframe.boneRotations.get(BoneName.PELVIS);
        expect(pelvisRot).toBeDefined();
        // Jin should have aggressive forward lean
        expect(pelvisRot!.x).toBeGreaterThan(0.1);
      });
    });

    describe("Son (Wind) - Flowing", () => {
      it("should have smooth, continuous motion", () => {
        expect(SON_WALK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
        // Son animations should be longer for flowing feel
        expect(SON_WALK_ANIMATION.duration).toBeGreaterThan(0.8);
      });
    });

    describe("Gam (Water) - Adaptive", () => {
      it("should have lateral movement in walk", () => {
        const firstKeyframe = GAM_WALK_ANIMATION.keyframes[0];
        const pelvisRot = firstKeyframe.boneRotations.get(BoneName.PELVIS);
        expect(pelvisRot).toBeDefined();
        // Gam should have some lateral tilt (Z rotation)
        expect(Math.abs(pelvisRot!.z)).toBeGreaterThan(0);
      });
    });

    describe("Gan (Mountain) - Stable, Grounded", () => {
      it("should have defensive posture in walk", () => {
        const firstKeyframe = GAN_WALK_ANIMATION.keyframes[0];
        // Check for lowered pelvis (lower center of gravity)
        const pelvisPos = firstKeyframe.bonePositions.get(BoneName.PELVIS);
        expect(pelvisPos).toBeDefined();
        expect(pelvisPos!.y).toBeLessThanOrEqual(0); // Y position at or below origin
      });
    });

    describe("Gon (Earth) - Heavy, Rooted", () => {
      it("should have slowest, heaviest walk", () => {
        const walkDurations = [
          GEON_WALK_ANIMATION.duration,
          TAE_WALK_ANIMATION.duration,
          LI_WALK_ANIMATION.duration,
          JIN_WALK_ANIMATION.duration,
          SON_WALK_ANIMATION.duration,
          GAM_WALK_ANIMATION.duration,
          GAN_WALK_ANIMATION.duration,
          GON_WALK_ANIMATION.duration,
        ];
        const maxDuration = Math.max(...walkDurations);
        expect(GON_WALK_ANIMATION.duration).toBe(maxDuration);
      });

      it("should have lowest pelvis position in walk", () => {
        const firstKeyframe = GON_WALK_ANIMATION.keyframes[0];
        const pelvisPos = firstKeyframe.bonePositions.get(BoneName.PELVIS);
        expect(pelvisPos).toBeDefined();
        // Gon should have the lowest stance
        expect(pelvisPos!.y).toBeLessThan(0);
      });
    });
  });
});
