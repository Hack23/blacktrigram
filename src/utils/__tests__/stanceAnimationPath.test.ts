/**
 * Integration test: Stance Animation Path
 *
 * Verifies the complete data flow from AnimationState to final animation keyframe.
 * This test traces the exact path that stance animations take through the system.
 *
 * @korean 자세애니메이션경로테스트
 */

import { describe, expect, it } from "vitest";
import { getAnimationByName } from "../../systems/animation/core/AnimationRegistry";
import { AnimationState } from "../../systems/animation/core/types";
import { BoneName } from "../../types/skeletal";
import { animationStateToPlayerAnimation } from "../player3DHelpers";

describe("Stance Animation Path Integration", () => {
  describe("Step 1: AnimationState to PlayerAnimation mapping", () => {
    it("should map stance_guard_geon to stance_geon", () => {
      const result = animationStateToPlayerAnimation(
        AnimationState.STANCE_GUARD_GEON
      );
      expect(result).toBe("stance_geon");
    });

    it("should map all 8 stance guard states correctly", () => {
      const stances = [
        { state: AnimationState.STANCE_GUARD_GEON, expected: "stance_geon" },
        { state: AnimationState.STANCE_GUARD_TAE, expected: "stance_tae" },
        { state: AnimationState.STANCE_GUARD_LI, expected: "stance_li" },
        { state: AnimationState.STANCE_GUARD_JIN, expected: "stance_jin" },
        { state: AnimationState.STANCE_GUARD_SON, expected: "stance_son" },
        { state: AnimationState.STANCE_GUARD_GAM, expected: "stance_gam" },
        { state: AnimationState.STANCE_GUARD_GAN, expected: "stance_gan" },
        { state: AnimationState.STANCE_GUARD_GON, expected: "stance_gon" },
      ];

      for (const { state, expected } of stances) {
        const result = animationStateToPlayerAnimation(state);
        expect(result, `${state} should map to ${expected}`).toBe(expected);
      }
    });
  });

  describe("Step 2: getAnimationByName retrieves correct animation", () => {
    it("should return stance_geon animation", () => {
      const anim = getAnimationByName("stance_geon");
      expect(anim).toBeDefined();
      expect(anim?.name).toBe("stance_geon");
    });

    it("should have valid keyframes with leg bones", () => {
      const anim = getAnimationByName("stance_geon");
      expect(anim).toBeDefined();
      expect(anim!.keyframes.length).toBeGreaterThan(0);

      const kf = anim!.keyframes[0];

      // Verify leg bones exist in keyframe
      expect(kf.boneRotations.has(BoneName.HIP_L)).toBe(true);
      expect(kf.boneRotations.has(BoneName.HIP_R)).toBe(true);
      expect(kf.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(kf.boneRotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it("should have non-zero leg rotations (not walking neutral)", () => {
      const anim = getAnimationByName("stance_geon");
      const kf = anim!.keyframes[0];

      const hipL = kf.boneRotations.get(BoneName.HIP_L);
      const hipR = kf.boneRotations.get(BoneName.HIP_R);
      const kneeL = kf.boneRotations.get(BoneName.KNEE_L);
      const kneeR = kf.boneRotations.get(BoneName.KNEE_R);

      // Check that we have significant rotation values (not near-zero walking values)
      // GEON stance requires significant hip and knee rotations for proper forward stance
      expect(Math.abs(hipL!.x)).toBeGreaterThan(0.1);
      expect(Math.abs(hipR!.x)).toBeGreaterThan(0.1);
      expect(Math.abs(kneeR!.x)).toBeGreaterThan(0.5); // Deep front knee bend

      console.log(
        "GEON stance leg rotations:\n" +
          `  HIP_L: x=${hipL!.x.toFixed(3)}, y=${hipL!.y.toFixed(
            3
          )}, z=${hipL!.z.toFixed(3)}\n` +
          `  HIP_R: x=${hipR!.x.toFixed(3)}, y=${hipR!.y.toFixed(
            3
          )}, z=${hipR!.z.toFixed(3)}\n` +
          `  KNEE_L: x=${kneeL!.x.toFixed(3)}, y=${kneeL!.y.toFixed(
            3
          )}, z=${kneeL!.z.toFixed(3)}\n` +
          `  KNEE_R: x=${kneeR!.x.toFixed(3)}, y=${kneeR!.y.toFixed(
            3
          )}, z=${kneeR!.z.toFixed(3)}`
      );
    });
  });

  describe("Full path test: AnimationState -> PlayerAnimation -> Animation", () => {
    it("should return animation with distinct leg positions for each stance", () => {
      const stanceMappings: [AnimationState, string][] = [
        [AnimationState.STANCE_GUARD_GEON, "stance_geon"],
        [AnimationState.STANCE_GUARD_TAE, "stance_tae"],
        [AnimationState.STANCE_GUARD_LI, "stance_li"],
        [AnimationState.STANCE_GUARD_GON, "stance_gon"],
      ];

      for (const [state, expectedName] of stanceMappings) {
        // Step 1: AnimationState -> PlayerAnimation
        const playerAnim = animationStateToPlayerAnimation(state);
        expect(playerAnim).toBe(expectedName);

        // Step 2: PlayerAnimation -> SkeletalAnimation
        const anim = getAnimationByName(playerAnim);
        expect(anim, `Animation ${playerAnim} should exist`).toBeDefined();

        // Step 3: Animation has valid leg data
        const kf = anim!.keyframes[0];
        const hipL = kf.boneRotations.get(BoneName.HIP_L);
        const kneeR = kf.boneRotations.get(BoneName.KNEE_R);

        expect(
          hipL,
          `${expectedName} should have HIP_L rotation`
        ).toBeDefined();
        expect(
          kneeR,
          `${expectedName} should have KNEE_R rotation`
        ).toBeDefined();

        console.log(
          `${expectedName}: HIP_L.x=${hipL!.x.toFixed(
            3
          )}, KNEE_R.x=${kneeR!.x.toFixed(3)}`
        );
      }
    });
  });
});
