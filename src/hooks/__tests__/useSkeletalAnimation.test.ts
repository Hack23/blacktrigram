/**
 * Tests for useSkeletalAnimation hook
 *
 * @module hooks/__tests__/useSkeletalAnimation.test
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSkeletalAnimation } from "../useSkeletalAnimation";
import { createScaledHumanoidRig } from "../../systems/animation";
import { getArchetypePhysicalAttributes } from "../../data/archetypePhysicalAttributes";
import { PlayerArchetype } from "../../types/common";

describe("useSkeletalAnimation", () => {
  let testRig: ReturnType<typeof createScaledHumanoidRig>;

  beforeEach(() => {
    // Create a test rig for each test
    const physicalAttributes = getArchetypePhysicalAttributes(
      PlayerArchetype.MUSA
    );
    testRig = createScaledHumanoidRig(physicalAttributes);
  });

  describe("initialization", () => {
    it("should initialize with idle animation by default", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "idle",
        })
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
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.0);
    });

    it("should initialize with attack animation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "attack",
          attackAnimation: "jab",
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.0);
    });
  });

  describe("animation transitions", () => {
    it("should transition from idle to walk", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation }) =>
          useSkeletalAnimation({
            currentAnimation,
          }),
        {
          initialProps: { currentAnimation: "idle" as const },
        }
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
        ({ currentAnimation, attackAnimation }) =>
          useSkeletalAnimation({
            currentAnimation,
            attackAnimation,
          }),
        {
          initialProps: {
            currentAnimation: "walk" as const,
            attackAnimation: undefined,
          },
        }
      );

      // Transition to attack
      rerender({
        currentAnimation: "attack",
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
        }
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
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      // Diagonal rotation is set by parent component
      expect(result.current.diagonalRotationY).toBe(null);
    });

    it("should handle cardinal step animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "step_forward",
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.diagonalRotationY).toBe(null);
    });

    it("should clear diagonal rotation for non-step animations", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation }) =>
          useSkeletalAnimation({
            currentAnimation,
          }),
        {
          initialProps: { currentAnimation: "step_forward_left" as const },
        }
      );

      // Transition to walk (non-diagonal)
      rerender({ currentAnimation: "walk" });

      expect(result.current.diagonalRotationY).toBe(null);
    });
  });

  describe("animation updates", () => {
    it("should update animation time via updateRigAnimation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "walk",
        })
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
        })
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
        })
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
        })
      );

      expect(result.current.animState.isPlaying).toBe(false);
      expect(result.current.animState.currentTime).toBe(0);
    });

    it("should handle stance change animation", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "stance_change",
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.2);
    });

    it("should handle footwork animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "footwork_circular_left",
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(1.0);
    });

    it("should handle stance guard animations", () => {
      const { result } = renderHook(() =>
        useSkeletalAnimation({
          currentAnimation: "stance_guard_geon",
        })
      );

      expect(result.current.animState.isPlaying).toBe(true);
      expect(result.current.animState.playbackSpeed).toBe(0.5);
    });
  });
});
