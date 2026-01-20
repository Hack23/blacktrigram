/**
 * Tests for useSkeletalAnimation hook
 *
 * @module hooks/__tests__/useSkeletalAnimation.test
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getArchetypePhysicalAttributes } from "../../data/archetypePhysicalAttributes";
import { createScaledHumanoidRig } from "../../systems/animation";
import { PlayerArchetype } from "../../types/common";
import type { PlayerAnimation } from "../../types/player-visual";
import { useSkeletalAnimation } from "../useSkeletalAnimation";

describe("useSkeletalAnimation", () => {
  let testRig: ReturnType<typeof createScaledHumanoidRig>;

  beforeEach(() => {
    // Create a test rig for each test
    const physicalAttributes = getArchetypePhysicalAttributes(
      PlayerArchetype.MUSA,
    );
    testRig = createScaledHumanoidRig(physicalAttributes);
  });

  describe("initialization", () => {
    it("should initialize with idle animation by default", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "idle",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.currentAnimation).toBeDefined();
      expect(result.current.animTimeRef.current).toBe(0);
      expect(result.current.diagonalRotationY).toBe(null);
    });

    it("should initialize with walk animation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "walk",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.0);
    });

    it("should initialize with attack animation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "attack",
          attackAnimation: "jab",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.0);
    });
  });

  describe("animation transitions", () => {
    it("should transition from idle to walk", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation }: { currentAnimation: PlayerAnimation }) =>
          useSkeletalAnimation({
            currentAnimation,
          }),
        {
          initialProps: { currentAnimation: "idle" as PlayerAnimation },
        },
      );

      // Verify initial state
      expect(result.current.animState.isPlaying).toBe(true);

      // Transition to walk
      rerender({ currentAnimation: "walk" });

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animTimeRef.current).toBe(0); // Time resets on animation change
    });

    it("should transition from walk to attack", () => {
      const { result, rerender } = renderHook(
        ({
          currentAnimation,
          attackAnimation,
        }: {
          currentAnimation: PlayerAnimation;
          attackAnimation?: string;
        }) =>
          useSkeletalAnimation({
            currentAnimation,
            attackAnimation,
          }),
        {
          initialProps: {
            currentAnimation: "walk" as PlayerAnimation,
            attackAnimation: undefined as string | undefined,
          },
        },
      );

      // Transition to attack
      rerender({
        currentAnimation: "attack" as PlayerAnimation,
        attackAnimation: "jab",
      });

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animTimeRef.current).toBe(0);
    });

    it("should handle blocking state", () => {
      const { result, rerender } = renderHook(
        ({ isBlocking }) =>
          useSkeletalAnimation({
            currentAnimation: "defend",
            isBlocking,
          }),
        {
          initialProps: { isBlocking: false },
        },
      );

      // Enable blocking
      rerender({ isBlocking: true });

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animTimeRef.current).toBe(0);
    });
  });

  describe("step animations", () => {
    it("should handle diagonal step animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "step_forward_left",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      // Diagonal rotation is set by parent component
      expect(result.current.diagonalRotationY).toBe(null);
    });

    it("should handle cardinal step animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "step_forward",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.diagonalRotationY).toBe(null);
    });

    it("should clear diagonal rotation for non-step animations", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation }: { currentAnimation: PlayerAnimation }) =>
          useSkeletalAnimation({
            currentAnimation,
          }),
        {
          initialProps: {
            currentAnimation: "step_forward_left" as PlayerAnimation,
          },
        },
      );

      // Transition to walk (non-diagonal)
      rerender({ currentAnimation: "walk" as PlayerAnimation });

      expect(result.current.diagonalRotationY).toBe(null);
    });
  });

  describe("animation updates", () => {
    it("should update animation time via updateRigAnimation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "walk",
        }),
      );

      const initialTime = result.current.animTimeRef.current;

      act(() => {
        result.current.updateRigAnimation(testRig, 0.016); // 1 frame at 60fps
      });

      // Time should have advanced
      expect(result.current.animTimeRef.current).toBeGreaterThan(initialTime);
    });

    it("should call onAnimationComplete when animation completes", () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          onAnimationComplete: onComplete,
        }),
      );

      // Simulate animation playing to completion
      act(() => {
        // Fast forward through the animation
        for (let i = 0; i < 100; i++) {
          result.current.updateRigAnimation(testRig, 0.016);
        }
      });

      // Animation should complete and callback should be called
      expect(result.current.animState.isPlaying).toBe(false);
      expect(onComplete).toHaveBeenCalled();
    });

    it("should apply keyframes to rig", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "walk",
        }),
      );

      // Get initial bone positions
      const pelvis = testRig.bones.get("pelvis");
      const initialRotation = pelvis?.rotation.clone();

      act(() => {
        result.current.updateRigAnimation(testRig, 0.016);
      });

      // Bone rotations should have changed
      expect(pelvis?.rotation.equals(initialRotation!)).toBe(false);
    });
  });

  describe("special animations", () => {
    it("should handle hit animation (stops playing)", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "hit",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(false);
      expect(result.current.animState.currentTime).toBe(0);
    });

    it("should handle stance change animation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "stance_change",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.2);
    });

    it("should handle footwork animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "step_left",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.0);
    });

    it("should handle stance guard animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "stance_geon", // Use the mapped PlayerAnimation value
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(0.5);
    });
  });

  describe("laterality support", () => {
    it("should apply left laterality to animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "idle",
          leadFoot: "left",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      // Animation should be mirrored for left laterality
      const animation = result.current.animState.currentAnimation;
      expect(animation).toBeDefined();
      // Check that animation name includes "_left" suffix after mirroring
      if (animation) {
        expect(animation.name).toContain("_left");
      }
    });

    it("should use right laterality by default", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "idle",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      const animation = result.current.animState.currentAnimation;
      expect(animation).toBeDefined();
      // Default should not have "_left" suffix
      if (animation) {
        expect(animation.name).not.toContain("_left");
      }
    });

    it("should apply right laterality explicitly", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "idle",
          leadFoot: "right",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      const animation = result.current.animState.currentAnimation;
      expect(animation).toBeDefined();
      // Right laterality should not mirror (no "_left" suffix)
      if (animation) {
        expect(animation.name).not.toContain("_left");
      }
    });

    it("should update laterality when leadFoot changes", () => {
      const { result, rerender } = renderHook(
        ({ leadFoot }: { leadFoot: "left" | "right" }) =>
          useSkeletalAnimation({
            currentAnimation: "idle",
            leadFoot,
          }),
        {
          initialProps: { leadFoot: "right" as "left" | "right" },
        },
      );

      // Initial: right laterality (no mirroring)
      let animation = result.current.animState.currentAnimation;
      expect(animation?.name).not.toContain("_left");

      // Change to left laterality (should mirror)
      rerender({ leadFoot: "left" });

      animation = result.current.animState.currentAnimation;
      expect(animation?.name).toContain("_left");
    });

    it("should apply laterality to attack animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          leadFoot: "left",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      const animation = result.current.animState.currentAnimation;
      expect(animation).toBeDefined();
      if (animation) {
        expect(animation.name).toContain("_left");
      }
    });

    it("should apply laterality to walk animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "walk",
          leadFoot: "left",
        }),
      );

      expect(result.current.animState.isPlaying).toBe(true);
      const animation = result.current.animState.currentAnimation;
      expect(animation).toBeDefined();
      if (animation) {
        expect(animation.name).toContain("_left");
      }
    });
  });
});
