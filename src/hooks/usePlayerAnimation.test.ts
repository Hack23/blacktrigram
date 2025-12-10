/**
 * Unit tests for usePlayerAnimation hook
 * 
 * Tests React hook integration with animation state machine.
 */

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlayerAnimation } from "./usePlayerAnimation";
import { DEFAULT_ANIMATION_CONFIGS } from "../systems/animation";

describe("usePlayerAnimation", () => {
  describe("initialization", () => {
    it("should initialize with idle state", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      expect(result.current.currentState).toBe("idle");
      expect(result.current.currentFrame).toBe(0);
    });

    it("should initialize with custom initial state", () => {
      const { result } = renderHook(() =>
        usePlayerAnimation({ initialState: "walk" })
      );

      expect(result.current.currentState).toBe("walk");
    });

    it("should use default configs if not provided", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      expect(result.current.stateMachine.getCurrentAnimation()).toBeDefined();
    });

    it("should accept custom animation configs", () => {
      const customConfigs = new Map(DEFAULT_ANIMATION_CONFIGS);
      const { result } = renderHook(() =>
        usePlayerAnimation({ customConfigs })
      );

      expect(result.current.currentState).toBe("idle");
    });
  });

  describe("update", () => {
    it("should update animation state", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        const updateResult = result.current.update(1 / 60);
        expect(updateResult.state).toBe("idle");
        expect(updateResult.frame).toBeGreaterThan(0);
      });
    });

    it("should maintain state machine across renders", () => {
      const { result, rerender } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo("walk");
      });

      rerender();

      expect(result.current.currentState).toBe("walk");
    });
  });

  describe("transitionTo", () => {
    it("should transition between valid states", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        const success = result.current.transitionTo("walk");
        expect(success).toBe(true);
      });

      expect(result.current.currentState).toBe("walk");
    });

    it("should not transition to invalid states", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo("attack");
      });

      act(() => {
        const success = result.current.transitionTo("walk");
        expect(success).toBe(false);
      });

      expect(result.current.currentState).toBe("attack");
    });

    it("should reset frame count on transition", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.update(1 / 60);
        result.current.update(1 / 60);
      });

      expect(result.current.currentFrame).toBeGreaterThan(0);

      act(() => {
        result.current.transitionTo("walk");
      });

      expect(result.current.currentFrame).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset to idle state", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo("attack");
        result.current.update(1 / 60);
      });

      expect(result.current.currentState).toBe("attack");

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentState).toBe("idle");
      expect(result.current.currentFrame).toBe(0);
    });
  });

  describe("event callbacks", () => {
    it("should call onAnimationStart callback", () => {
      const onAnimationStart = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onAnimationStart },
        })
      );

      act(() => {
        result.current.transitionTo("walk");
      });

      expect(onAnimationStart).toHaveBeenCalledWith("walk");
    });

    it("should call onFrame callback during updates", () => {
      const onFrame = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onFrame },
        })
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
        })
      );

      act(() => {
        result.current.transitionTo("attack");
      });

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
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
        })
      );

      act(() => {
        result.current.transitionTo("attack");
        result.current.transitionTo("hit");
      });

      expect(onAnimationInterrupted).toHaveBeenCalledWith("attack", "hit");
    });
  });

  describe("stateMachine access", () => {
    it("should provide access to underlying state machine", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      expect(result.current.stateMachine).toBeDefined();
      expect(result.current.stateMachine.getCurrentState()).toBe("idle");
    });

    it("should allow direct state machine manipulation", () => {
      const { result, rerender } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.stateMachine.transitionTo("walk");
        // Direct calls to stateMachine don't trigger re-render, so force it
        rerender();
      });

      // After re-render, should reflect the change
      expect(result.current.stateMachine.getCurrentState()).toBe("walk");
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

    it("should maintain single state machine instance across renders", () => {
      const { result, rerender } = renderHook(() => usePlayerAnimation());

      const machine1 = result.current.stateMachine;

      rerender();
      rerender();
      rerender();

      expect(result.current.stateMachine).toBe(machine1);
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
        })
      );

      act(() => {
        result.current.transitionTo("attack");
      });

      expect(onAnimationStart).toHaveBeenCalledWith("attack");

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      act(() => {
        for (let i = 0; i <= config.frames; i++) {
          result.current.update(frameDuration);
        }
      });

      // Attack animation is 12 frames, so we should have 12 frame callbacks
      // Plus 1 for the transition to idle after completion
      expect(onFrame).toHaveBeenCalledTimes(config.frames + 1);
      expect(onAnimationComplete).toHaveBeenCalledWith("attack");
      expect(result.current.currentState).toBe("idle");
    });

    it("should handle interrupted animation", () => {
      const onAnimationInterrupted = vi.fn();

      const { result } = renderHook(() =>
        usePlayerAnimation({
          events: { onAnimationInterrupted },
        })
      );

      act(() => {
        result.current.transitionTo("attack");
        result.current.update(1 / 60);
        result.current.transitionTo("hit");
      });

      expect(onAnimationInterrupted).toHaveBeenCalledWith("attack", "hit");
      expect(result.current.currentState).toBe("hit");
    });

    it("should handle movement animation loop", () => {
      const { result } = renderHook(() => usePlayerAnimation());

      act(() => {
        result.current.transitionTo("walk");
      });

      const config = DEFAULT_ANIMATION_CONFIGS.get("walk")!;
      const frameDuration = 1 / config.fps;

      act(() => {
        // Complete multiple loops
        for (let i = 0; i < config.frames * 3; i++) {
          result.current.update(frameDuration);
        }
      });

      // Should still be in walk state (looping)
      expect(result.current.currentState).toBe("walk");
      // Frame should have looped
      expect(result.current.currentFrame).toBeLessThan(config.frames);
    });
  });
});
