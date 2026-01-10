/**
 * Tests for useGuardPoseOverlay hook
 *
 * @module hooks/__tests__/useGuardPoseOverlay.test
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useGuardPoseOverlay } from "../useGuardPoseOverlay";
import { createScaledHumanoidRig } from "../../systems/animation";
import { getArchetypePhysicalAttributes } from "../../data/archetypePhysicalAttributes";
import { PlayerArchetype, TrigramStance } from "../../types/common";

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
      const initialScale = chest?.scale.clone();

      // Apply guard overlay multiple times to see breathing
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.applyGuardOverlay(testRig, 0.1); // Larger delta for visible change
        }
      });

      // Chest scale should have changed due to breathing
      expect(chest?.scale.equals(initialScale!)).toBe(false);
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
      const { result, rerender } = renderHook(
        ({ laterality }) =>
          useGuardPoseOverlay({
            stance: TrigramStance.GEON,
            laterality,
            currentAnimation: "idle",
          }),
        {
          initialProps: { laterality: "right" as const },
        }
      );

      const leftShoulder = testRig.bones.get("shoulder_L");

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });
      const rightLateralityRotation = leftShoulder?.rotation.clone();

      // Reset rig
      testRig.bones.forEach((bone) => bone.rotation.set(0, 0, 0));

      // Change to left laterality
      rerender({ laterality: "left" });

      act(() => {
        result.current.applyGuardOverlay(testRig, 0.016);
      });
      const leftLateralityRotation = leftShoulder?.rotation.clone();

      // Rotations should be different for different laterality
      expect(rightLateralityRotation?.equals(leftLateralityRotation!)).toBe(
        false
      );
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

      // Check arm bones have been modified
      expect(testRig.bones.get("shoulder_L")?.rotation.x).not.toBe(0);
      expect(testRig.bones.get("shoulder_R")?.rotation.x).not.toBe(0);
      expect(testRig.bones.get("elbow_L")?.rotation.x).not.toBe(0);
      expect(testRig.bones.get("elbow_R")?.rotation.x).not.toBe(0);
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

      // Check torso bones have been modified
      expect(testRig.bones.get("spine_upper")?.rotation.y).not.toBe(0);
    });
  });
});
