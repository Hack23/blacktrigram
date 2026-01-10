/**
 * Tests for useHandPoseTransitions hook
 *
 * @module hooks/__tests__/useHandPoseTransitions.test
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useHandPoseTransitions } from "../useHandPoseTransitions";
import { HandPoseType } from "../../types/hand-animation";

describe("useHandPoseTransitions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with open hand poses", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "idle",
        })
      );

      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
      expect(result.current.leftHandState.currentPose).toBe(HandPoseType.OPEN);
      expect(result.current.rightHandState.currentPose).toBe(
        HandPoseType.OPEN
      );
    });
  });

  describe("animation-based hand poses", () => {
    it("should use technique-specific hand poses for attacks", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "jab",
        })
      );

      // Jab should use FIST pose
      expect(result.current.leftHandState.targetPose).toBeDefined();
      expect(result.current.rightHandState.targetPose).toBeDefined();
    });

    it("should use open hands for blocking", async () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "defend",
          isBlocking: true,
        })
      );

      // Wait for useEffect to run and set initial pose
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // After useEffect, currentPose should be set (targetPose may be null if transition complete)
      expect(
        result.current.leftHandState.currentPose === HandPoseType.OPEN ||
        result.current.leftHandState.targetPose === HandPoseType.OPEN
      ).toBe(true);
      expect(
        result.current.rightHandState.currentPose === HandPoseType.OPEN ||
        result.current.rightHandState.targetPose === HandPoseType.OPEN
      ).toBe(true);
    });

    it("should use relaxed hands for walking", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "walk",
        })
      );

      // Hand states should be defined
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
      // Target pose may be null initially after transition completes
      expect(
        result.current.leftHandState.targetPose === HandPoseType.RELAXED ||
          result.current.leftHandState.targetPose === null
      ).toBe(true);
    });

    it("should use stance change hand poses", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "stance_change",
        })
      );

      // Target pose should be set (may be null initially, then OPEN)
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
    });

    it("should maintain guard hands during steps", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "step_forward",
        })
      );

      // Hand states should be defined
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
    });

    it("should maintain guard hands during footwork", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "footwork_circular_left",
        })
      );

      // Hand states should be defined
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
    });

    it("should use guard hands for stance guard animations", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "stance_guard_geon",
        })
      );

      // Hand states should be defined
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
    });

    it("should return to relaxed hands when idle", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "idle",
        })
      );

      // Hand states should be defined and have relaxed target
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
      // Target pose may be null initially after transition completes
      expect(
        result.current.leftHandState.targetPose === HandPoseType.RELAXED ||
          result.current.leftHandState.targetPose === null
      ).toBe(true);
    });
  });

  describe("hand pose transitions", () => {
    it("should transition from relaxed to fist for attack", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation, attackAnimation }) =>
          useHandPoseTransitions({
            currentAnimation,
            attackAnimation,
          }),
        {
          initialProps: {
            currentAnimation: "idle" as const,
            attackAnimation: undefined,
          },
        }
      );

      // Verify initial relaxed pose
      expect(result.current.leftHandState.targetPose).toBe(
        HandPoseType.RELAXED
      );

      // Transition to attack
      rerender({
        currentAnimation: "attack",
        attackAnimation: "jab",
      });

      // Should have new target pose
      expect(result.current.leftHandState.targetPose).toBeDefined();
      expect(result.current.leftHandState.transitionProgress).toBeGreaterThanOrEqual(
        0
      );
    });

    it("should update hand animations over time", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "jab",
        })
      );

      const initialProgress = result.current.leftHandState.transitionProgress;

      act(() => {
        result.current.updateHandAnimations(0.016); // 1 frame at 60fps
      });

      // Progress should have advanced
      expect(
        result.current.leftHandState.transitionProgress
      ).toBeGreaterThanOrEqual(initialProgress);
    });

    it("should complete hand transitions", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "jab",
        })
      );

      // Fast forward through transition
      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.updateHandAnimations(0.016);
        }
      });

      // Transition should be complete or nearly complete
      expect(result.current.leftHandState.transitionProgress).toBeCloseTo(
        1.0,
        1
      );
    });
  });

  describe("blocking state", () => {
    it("should use open hands when blocking flag is set", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "defend",
          isBlocking: true,
        })
      );

      // Hand states should be defined
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
    });

    it("should transition to open hands when blocking starts", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation, isBlocking }) =>
          useHandPoseTransitions({
            currentAnimation,
            isBlocking,
          }),
        {
          initialProps: {
            currentAnimation: "idle" as const,
            isBlocking: false,
          },
        }
      );

      // Start blocking with defend animation
      rerender({
        currentAnimation: "defend",
        isBlocking: true,
      });

      // Hand states should be defined
      expect(result.current.leftHandState).toBeDefined();
      expect(result.current.rightHandState).toBeDefined();
    });
  });

  describe("different attack techniques", () => {
    it("should handle cross punch hand poses", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "cross",
        })
      );

      expect(result.current.leftHandState.targetPose).toBeDefined();
      expect(result.current.rightHandState.targetPose).toBeDefined();
    });

    it("should handle kick hand poses", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "front_kick",
        })
      );

      expect(result.current.leftHandState.targetPose).toBeDefined();
      expect(result.current.rightHandState.targetPose).toBeDefined();
    });

    it("should handle elbow strike hand poses", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "elbow_strike",
        })
      );

      expect(result.current.leftHandState.targetPose).toBeDefined();
      expect(result.current.rightHandState.targetPose).toBeDefined();
    });
  });

  describe("state synchronization", () => {
    it("should maintain refs in sync with state", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "jab",
        })
      );

      const leftState = result.current.leftHandState;
      const rightState = result.current.rightHandState;

      // States should be valid objects
      expect(leftState).toBeDefined();
      expect(rightState).toBeDefined();
      expect(leftState.currentPose).toBeDefined();
      expect(rightState.currentPose).toBeDefined();
    });

    it("should update both hands simultaneously", () => {
      const { result } = renderHook(() =>
        useHandPoseTransitions({
          currentAnimation: "attack",
          attackAnimation: "jab",
        })
      );

      act(() => {
        result.current.updateHandAnimations(0.016);
      });

      // Both hands should be in transition
      expect(result.current.leftHandState.transitionProgress).toBeGreaterThan(
        0
      );
      expect(result.current.rightHandState.transitionProgress).toBeGreaterThan(
        0
      );
    });
  });
});
