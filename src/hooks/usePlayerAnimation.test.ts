/**
 * Unit tests for usePlayerAnimation hook
 *
 * Tests React hook integration with animation state machine.
 */

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_ANIMATION_CONFIGS } from "../systems/animation";
import { AnimationState } from "../systems/animation/core/types";
import { usePlayerAnimation } from "./usePlayerAnimation";

describe("usePlayerAnimation", () => {
  describe("initialization", () => {
    it("should initialize with idle state", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      expect(result.current.currentState).toBe(AnimationState.IDLE);
      expect(result.current.currentFrame).toBe(0);
    });

    it("should initialize with custom initial state", () => {
      const { result } = renderHook(() =>
        usePlayerAnimation({ initialState: AnimationState.WALK }),
      );

      expect(result.current.currentState).toBe(AnimationState.WALK);
    });

    it("should use default configs if not provided", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      // Check that hook returns expected properties
      expect(result.current.currentState).toBe(AnimationState.IDLE);
      expect(result.current.currentFrame).toBe(0);
    });

    it("should accept custom animation configs", () => {
      const customConfigs = new Map(DEFAULT_ANIMATION_CONFIGS);
      const { result } = renderHook(() =>
        usePlayerAnimation({ customConfigs }),
      );

      expect(result.current.currentState).toBe(AnimationState.IDLE);
    });
  });

  describe("update", () => {
    it("should update animation state", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        const updateResult = result.current.update(1 / 60);
        expect(updateResult.state).toBe(AnimationState.IDLE);
        expect(updateResult.frame).toBeGreaterThan(0);
      });
    });

    it("should maintain state machine across renders", () => {
      const { result, rerender } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo(AnimationState.WALK);
      });

      rerender();

      expect(result.current.currentState).toBe(AnimationState.WALK);
    });
  });

  describe("transitionTo", () => {
    it("should transition between valid states", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        const success = result.current.transitionTo(AnimationState.WALK);
        expect(success).toBe(true);
      });

      expect(result.current.currentState).toBe(AnimationState.WALK);
    });

    it("should not transition to invalid states", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo(AnimationState.ATTACK);
      });

      act(() => {
        const success = result.current.transitionTo(AnimationState.WALK);
        expect(success).toBe(false);
      });

      expect(result.current.currentState).toBe(AnimationState.ATTACK);
    });

    it("should reset frame count on transition", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.update(1 / 60);
        result.current.update(1 / 60);
      });

      expect(result.current.currentFrame).toBeGreaterThan(0);

      act(() => {
        result.current.transitionTo(AnimationState.WALK);
      });

      expect(result.current.currentFrame).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset to idle state", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo(AnimationState.ATTACK);
        result.current.update(1 / 60);
      });

      expect(result.current.currentState).toBe(AnimationState.ATTACK);

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentState).toBe(AnimationState.IDLE);
      expect(result.current.currentFrame).toBe(0);
    });
  });

  describe("event callbacks", () => {
    it("should call onAnimationStart callback", () => {
      const onAnimationStart = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onAnimationStart },
        }),
      );

      act(() => {
        result.current.transitionTo(AnimationState.WALK);
      });

      expect(onAnimationStart).toHaveBeenCalledWith(AnimationState.WALK);
    });

    it("should call onFrame callback during updates", () => {
      const onFrame = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onFrame },
        }),
      );

      act(() => {
        result.current.update(1 / 60);
      });

      expect(onFrame).toHaveBeenCalled();
    });

    it("should call onAnimationComplete callback", () => {
      const onAnimationComplete = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onAnimationComplete },
        }),
      );

      act(() => {
        result.current.transitionTo(AnimationState.ATTACK);
      });

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK)!;
      const frameDuration = 1 / config.fps;

      act(() => {
        // Complete the animation
        for (let i = 0; i <= config.frames; i++) {
          result.current.update(frameDuration);
        }
      });

      expect(onAnimationComplete).toHaveBeenCalledWith("attack");
    });

    it("should call onAnimationInterrupted callback", () => {
      const onAnimationInterrupted = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onAnimationInterrupted },
        }),
      );

      act(() => {
        result.current.transitionTo(AnimationState.ATTACK);
        result.current.transitionTo(AnimationState.HIT);
      });

      expect(onAnimationInterrupted).toHaveBeenCalledWith(
        AnimationState.ATTACK,
        AnimationState.HIT,
      );
    });
  });

  describe("transitionTo method", () => {
    it("should allow state transitions via hook method", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo(AnimationState.WALK);
      });

      expect(result.current.currentState).toBe(AnimationState.WALK);
    });

    it("should respect transition rules", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo(AnimationState.WALK);
      });

      expect(result.current.currentState).toBe(AnimationState.WALK);
    });
  });

  describe("performance", () => {
    it("should memoize callbacks", () => {
      const { result, rerender } = renderHook(() => usePlayerAnimation());

      const update1 = result.current.update;
      const transitionTo1 = result.current.transitionTo;
      const reset1 = result.current.reset;

      rerender();

      expect(result.current.update).toBe(update1);
      expect(result.current.transitionTo).toBe(transitionTo1);
      expect(result.current.reset).toBe(reset1);
    });

    it("should maintain stable API across renders", () => {
      const { result, rerender } = renderHook(() => usePlayerAnimation());

      const update1 = result.current.update;
      const transitionTo1 = result.current.transitionTo;
      const reset1 = result.current.reset;

      rerender();
      rerender();
      rerender();

      // API functions should remain stable
      expect(result.current.update).toBe(update1);
      expect(result.current.transitionTo).toBe(transitionTo1);
      expect(result.current.reset).toBe(reset1);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete attack animation cycle", () => {
      const onAnimationStart = vi.fn();
      const onAnimationComplete = vi.fn();
      const onFrame = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: {
            onAnimationStart,
            onAnimationComplete,
            onFrame,
          },
        }),
      );

      act(() => {
        result.current.transitionTo(AnimationState.ATTACK);
      });

      expect(onAnimationStart).toHaveBeenCalledWith(AnimationState.ATTACK);

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK)!;
      const frameDuration = 1 / config.fps;

      act(() => {
        for (let i = 0; i <= config.frames; i++) {
          result.current.update(frameDuration);
        }
      });

      // Attack animation is 12 frames, so we should have 12 frame callbacks
      // Plus 1 for the transition to idle after completion
      expect(onFrame).toHaveBeenCalledTimes(config.frames + 1);
      expect(onAnimationComplete).toHaveBeenCalledWith(AnimationState.ATTACK);
      expect(result.current.currentState).toBe(AnimationState.IDLE);
    });

    it("should handle interrupted animation", () => {
      const onAnimationInterrupted = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onAnimationInterrupted },
        }),
      );

      act(() => {
        result.current.transitionTo(AnimationState.ATTACK);
        result.current.update(1 / 60);
        result.current.transitionTo(AnimationState.HIT);
      });

      expect(onAnimationInterrupted).toHaveBeenCalledWith(
        AnimationState.ATTACK,
        AnimationState.HIT,
      );
      expect(result.current.currentState).toBe(AnimationState.HIT);
    });

    it("should handle movement animation loop", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo(AnimationState.WALK);
      });

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.WALK)!;
      const frameDuration = 1 / config.fps;

      act(() => {
        // Complete multiple loops
        for (let i = 0; i < config.frames * 3; i++) {
          result.current.update(frameDuration);
        }
      });

      // Should still be in walk state (looping)
      expect(result.current.currentState).toBe(AnimationState.WALK);
      // Frame should have looped
      expect(result.current.currentFrame).toBeLessThan(config.frames);
    });
  });
});
