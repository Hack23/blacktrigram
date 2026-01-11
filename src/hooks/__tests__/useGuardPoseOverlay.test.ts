/**
 * Tests for useGuardPoseOverlay hook
 *
 * @module hooks/__tests__/useGuardPoseOverlay.test
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getArchetypePhysicalAttributes } from "../../data/archetypePhysicalAttributes";
import { createScaledHumanoidRig } from "../../systems/animation";
import { PlayerArchetype, TrigramStance } from "../../types/common";
import { useGuardPoseOverlay } from "../useGuardPoseOverlay";

describe("useGuardPoseOverlay", () => {
  let testRig: ReturnType<typeof createScaledHumanoidRig>;

  beforeEach(() => {
    // Create a test rig for each test
    const physicalAttributes = getArchetypePhysicalAttributes(
      PlayerArchetype.MUSA
    );
    testRig = createScaledHumanoidRig(physicalAttributes);
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      expect(result.current.applyGuardOverlay).toBeDefined();
      expect(typeof result.current.applyGuardOverlay).toBe("function");
    });

    it("should support different stances", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.TAE,
          laterality: "left",
          currentAnimation: "idle",
        })
      );

      expect(result.current.applyGuardOverlay).toBeDefined();
    });
  });

  describe("guard pose application", () => {
    it("should apply guard overlay for idle animation", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      // Get initial bone positions
      const leftShoulder = testRig.bones.get("shoulder_L");
      const initialRotation = leftShoulder?.rotation.clone();

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Guard overlay should have modified bone rotations
      expect(leftShoulder?.rotation.equals(initialRotation!)).toBe(false);
    });

    it("should apply guard overlay for walk animation", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "walk",
        })
      );

      const rightShoulder = testRig.bones.get("shoulder_R");
      const initialRotation = rightShoulder?.rotation.clone();

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Should apply partial guard during movement
      expect(rightShoulder?.rotation.equals(initialRotation!)).toBe(false);
    });

    it("should not apply guard overlay for attack animation", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "attack",
        })
      );

      const leftShoulder = testRig.bones.get("shoulder_L");
      const initialRotation = leftShoulder?.rotation.clone();

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Guard overlay should NOT modify bones during attack
      expect(leftShoulder?.rotation.equals(initialRotation!)).toBe(true);
    });

    it("should not apply guard overlay for defend animation", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "defend",
        })
      );

      const leftShoulder = testRig.bones.get("shoulder_L");
      const initialRotation = leftShoulder?.rotation.clone();

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Guard overlay should NOT modify bones during defend
      expect(leftShoulder?.rotation.equals(initialRotation!)).toBe(true);
    });

    it("should not apply guard overlay for hit animation", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "hit",
        })
      );

      const leftShoulder = testRig.bones.get("shoulder_L");
      const initialRotation = leftShoulder?.rotation.clone();

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Guard overlay should NOT modify bones during hit
      expect(leftShoulder?.rotation.equals(initialRotation!)).toBe(true);
    });
  });

  describe("breathing animation", () => {
    it("should animate breathing over time", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      const chest = testRig.bones.get("spine_middle");

      // Collect scale values over time
      const scaleValues: number[] = [];

      // Apply guard overlay multiple times to see breathing cycle
      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.applyGuardOverlay(testRig, 0.1); // Larger delta for visible change
          scaleValues.push(chest?.scale.x ?? 1);
        }
      });

      // Check that scale values vary (breathing animation)
      const minScale = Math.min(...scaleValues);
      const maxScale = Math.max(...scaleValues);
      const scaleRange = maxScale - minScale;

      // Breathing should cause variation in scale
      expect(scaleRange).toBeGreaterThan(0.001);
    });

    it("should cycle breathing animation", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      const chest = testRig.bones.get("spine_middle");
      const scales: number[] = [];

      // Collect scale values over breathing cycle
      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.applyGuardOverlay(testRig, 0.1);
          scales.push(chest!.scale.x);
        }
      });

      // Scale should vary (breathing cycle)
      const uniqueScales = new Set(scales);
      expect(uniqueScales.size).toBeGreaterThan(1);
    });
  });

  describe("stance transitions", () => {
    it("should change guard pose when stance changes", () => {
      const { result, rerender } = renderHook(
        ({ stance }) =>
          useGuardPoseOverlay({
            stance,
            currentAnimation: "idle",
          }),
        {
          initialProps: { stance: TrigramStance.GEON },
        }
      );

      const leftShoulder = testRig.bones.get("shoulder_L");

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });
      const geonRotation = leftShoulder?.rotation.clone();

      // Change to different stance
      rerender({ stance: TrigramStance.TAE });

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });
      const taeRotation = leftShoulder?.rotation.clone();

      // Rotations should be different for different stances
      expect(geonRotation?.equals(taeRotation!)).toBe(false);
    });

    it("should respect laterality changes", () => {
      // Test with TAE stance which typically has asymmetric guard positions
      const { result, rerender } = renderHook(
        ({ laterality }) =>
          useGuardPoseOverlay({
            stance: TrigramStance.TAE, // Use TAE instead of GEON for clearer asymmetry
            laterality,
            currentAnimation: "idle",
          }),
        {
          initialProps: { laterality: "right" as const },
        }
      );

      const leftShoulder = testRig.bones.get("shoulder_L");
      const rightShoulder = testRig.bones.get("shoulder_R");
      const leftHip = testRig.bones.get("hip_L");
      const rightHip = testRig.bones.get("hip_R");

      // Apply multiple frames to allow lerp to accumulate
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.applyGuardOverlay(testRig, 0.016);
        }
      });
      const rightLateralityLeftShoulder = leftShoulder?.rotation.clone();
      const rightLateralityRightShoulder = rightShoulder?.rotation.clone();
      const rightLateralityLeftHip = leftHip?.rotation.clone();
      const rightLateralityRightHip = rightHip?.rotation.clone();

      // Reset rig
      testRig.bones.forEach((bone) => bone.rotation.set(0, 0, 0));

      // Change to left laterality
      rerender({ laterality: "left" });

      // Apply multiple frames to allow lerp to accumulate
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.applyGuardOverlay(testRig, 0.016);
        }
      });
      const leftLateralityLeftShoulder = leftShoulder?.rotation.clone();
      const leftLateralityRightShoulder = rightShoulder?.rotation.clone();
      const leftLateralityLeftHip = leftHip?.rotation.clone();
      const leftLateralityRightHip = rightHip?.rotation.clone();

      // Check for differences (mirroring should affect at least one limb)
      const leftShoulderDiff = !rightLateralityLeftShoulder?.equals(
        leftLateralityLeftShoulder!
      );
      const rightShoulderDiff = !rightLateralityRightShoulder?.equals(
        leftLateralityRightShoulder!
      );
      const leftHipDiff = !rightLateralityLeftHip?.equals(
        leftLateralityLeftHip!
      );
      const rightHipDiff = !rightLateralityRightHip?.equals(
        leftLateralityRightHip!
      );

      // At least one limb should be different due to mirroring
      expect(
        leftShoulderDiff || rightShoulderDiff || leftHipDiff || rightHipDiff
      ).toBe(true);
    });
  });

  describe("blend factors", () => {
    it("should apply full guard for idle", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      const leftShoulder = testRig.bones.get("shoulder_L");
      const initialRotation = leftShoulder?.rotation.clone();

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Should have significant rotation change (full blend)
      const rotationDiff = Math.abs(
        leftShoulder!.rotation.x - initialRotation!.x
      );
      expect(rotationDiff).toBeGreaterThan(0);
    });

    it("should apply partial guard for walk", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "walk",
        })
      );

      const leftShoulder = testRig.bones.get("shoulder_L");

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Should have some rotation change (partial blend)
      expect(leftShoulder?.rotation.x).not.toBe(0);
    });
  });

  describe("bone application", () => {
    it("should apply guard pose to arms", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Check arm bones have been modified (shoulders should have non-zero rotations)
      expect(testRig.bones.get("shoulder_L")?.rotation.x).not.toBe(0);
      expect(testRig.bones.get("shoulder_R")?.rotation.x).not.toBe(0);
      // Elbows may have zero rotation in some guard poses, so check shoulders and wrists
      const elbowL = testRig.bones.get("elbow_L")?.rotation;
      const elbowR = testRig.bones.get("elbow_R")?.rotation;
      // At least one component should be non-zero
      const elbowLModified =
        elbowL &&
        (Math.abs(elbowL.x) > 0.001 ||
          Math.abs(elbowL.y) > 0.001 ||
          Math.abs(elbowL.z) > 0.001);
      const elbowRModified =
        elbowR &&
        (Math.abs(elbowR.x) > 0.001 ||
          Math.abs(elbowR.y) > 0.001 ||
          Math.abs(elbowR.z) > 0.001);
      expect(elbowLModified || elbowRModified).toBe(true);
    });

    it("should apply guard pose to legs", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Check leg bones have been modified
      expect(testRig.bones.get("hip_L")?.rotation.x).not.toBe(0);
      expect(testRig.bones.get("hip_R")?.rotation.x).not.toBe(0);
    });

    it("should apply different hip positions based on stance width", () => {
      // Test narrow stance (GAN - stanceWidth: 0.3)
      const { result: narrowResult } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GAN,
          currentAnimation: "idle",
        })
      );

      const narrowRig = createScaledHumanoidRig(
        getArchetypePhysicalAttributes(PlayerArchetype.MUSA)
      );
      const narrowHipLInitial = narrowRig.bones.get("hip_L")!.position.x;

      act(() => {
        narrowResult.current.applyGuardOverlay(narrowRig, 0.016);
      });

      // Test wide stance (LI - stanceWidth: 1.2)
      const { result: wideResult } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.LI,
          currentAnimation: "idle",
        })
      );

      const wideRig = createScaledHumanoidRig(
        getArchetypePhysicalAttributes(PlayerArchetype.MUSA)
      );
      const wideHipLInitial = wideRig.bones.get("hip_L")!.position.x;

      act(() => {
        wideResult.current.applyGuardOverlay(wideRig, 0.016);
      });

      // Wide stance should have hips further apart than narrow stance
      // Left hip has negative X, so wider = more negative
      const narrowHipX = Math.abs(narrowRig.bones.get("hip_L")!.position.x);
      const wideHipX = Math.abs(wideRig.bones.get("hip_L")!.position.x);

      // LI (1.2) should have wider hip offset than GAN (0.3)
      expect(wideHipX).toBeGreaterThan(narrowHipX);

      // Verify both changed from initial
      expect(narrowRig.bones.get("hip_L")!.position.x).not.toBe(
        narrowHipLInitial
      );
      expect(wideRig.bones.get("hip_L")!.position.x).not.toBe(wideHipLInitial);
    });

    it("should apply guard pose to torso", () => {
      const { result } = renderHook(() =>
        useGuardPoseOverlay({
          stance: TrigramStance.GEON,
          currentAnimation: "idle",
        })
      );

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });

      // Check torso bones have been modified (at least one component should be non-zero)
      const spineUpper = testRig.bones.get("spine_upper")?.rotation;
      const torsoModified =
        spineUpper &&
        (Math.abs(spineUpper.x) > 0.001 ||
          Math.abs(spineUpper.y) > 0.001 ||
          Math.abs(spineUpper.z) > 0.001);
      expect(torsoModified).toBe(true);
    });
  });
});
