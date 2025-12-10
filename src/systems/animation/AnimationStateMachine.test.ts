/**
 * Unit tests for PlayerAnimationStateMachine
 * 
 * Tests core animation state machine logic, timing, and transitions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  PlayerAnimationStateMachine,
  DEFAULT_ANIMATION_CONFIGS,
} from "./AnimationStateMachine";
import type { AnimationEvents } from "./types";

describe("PlayerAnimationStateMachine", () => {
  describe("initialization", () => {
    it("should start in idle state", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      expect(machine.getCurrentState()).toBe("idle");
      expect(machine.getCurrentFrame()).toBe(0);
    });

    it("should accept custom animation configs", () => {
      const customConfigs = new Map(DEFAULT_ANIMATION_CONFIGS);
      const machine = new PlayerAnimationStateMachine(customConfigs);
      expect(machine.getCurrentState()).toBe("idle");
    });
  });

  describe("update", () => {
    it("should advance frames based on delta time", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      const config = DEFAULT_ANIMATION_CONFIGS.get("idle")!;
      const frameDuration = 1 / config.fps; // 1/60 = ~0.0167s

      // First update
      const result1 = machine.update(frameDuration);
      expect(result1.frame).toBe(1);

      // Second update
      const result2 = machine.update(frameDuration);
      expect(result2.frame).toBe(2);
    });

    it("should loop looping animations", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      const config = DEFAULT_ANIMATION_CONFIGS.get("idle")!;
      const frameDuration = 1 / config.fps;

      // Advance through all frames
      for (let i = 0; i < config.frames; i++) {
        machine.update(frameDuration);
      }

      // Should loop back to frame 0
      const result = machine.update(frameDuration);
      expect(result.frame).toBe(1); // Back to start after looping
    });

    it("should auto-transition to idle after non-looping animation completes", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      // Advance through all frames
      for (let i = 0; i < config.frames + 1; i++) {
        machine.update(frameDuration);
      }

      // Should have transitioned to idle
      expect(machine.getCurrentState()).toBe("idle");
    });

    it("should calculate progress correctly", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      // At frame 0
      let result = machine.update(0);
      expect(result.progress).toBe(0);

      // At frame 6 (midpoint of 12)
      for (let i = 0; i < 6; i++) {
        result = machine.update(frameDuration);
      }
      expect(result.progress).toBeCloseTo(0.5, 1);
    });

    it("should set justCompleted flag on animation completion", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      let result;
      // Advance to completion
      for (let i = 0; i < config.frames; i++) {
        result = machine.update(frameDuration);
      }

      // Complete the animation
      result = machine.update(frameDuration);
      expect(result?.justCompleted).toBe(true);
    });
  });

  describe("transitionTo", () => {
    it("should transition to valid states", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      expect(machine.transitionTo("walk")).toBe(true);
      expect(machine.getCurrentState()).toBe("walk");
    });

    it("should not transition to same state", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      expect(machine.transitionTo("idle")).toBe(false);
      expect(machine.getCurrentState()).toBe("idle");
    });

    it("should respect transition rules", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      // Attack cannot transition directly to walk
      expect(machine.transitionTo("walk")).toBe(false);
      expect(machine.getCurrentState()).toBe("attack");
    });

    it("should respect priority system", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      // Hit (higher priority) can interrupt attack
      expect(machine.transitionTo("hit")).toBe(true);
      expect(machine.getCurrentState()).toBe("hit");
    });

    it("should not allow lower priority to interrupt non-interruptible animations", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("hit"); // Hit is non-interruptible

      // Attack (lower priority) cannot interrupt hit
      expect(machine.transitionTo("attack")).toBe(false);
      expect(machine.getCurrentState()).toBe("hit");
    });

    it("should reset frame and time accumulator on transition", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      const frameDuration = 1 / 60;

      // Advance idle animation
      machine.update(frameDuration);
      machine.update(frameDuration);
      expect(machine.getCurrentFrame()).toBeGreaterThan(0);

      // Transition to walk
      machine.transitionTo("walk");
      expect(machine.getCurrentFrame()).toBe(0);
    });
  });

  describe("event callbacks", () => {
    let events: AnimationEvents;
    let onAnimationStart: ReturnType<typeof vi.fn>;
    let onFrame: ReturnType<typeof vi.fn>;
    let onAnimationComplete: ReturnType<typeof vi.fn>;
    let onAnimationInterrupted: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      onAnimationStart = vi.fn();
      onFrame = vi.fn();
      onAnimationComplete = vi.fn();
      onAnimationInterrupted = vi.fn();

      events = {
        onAnimationStart,
        onFrame,
        onAnimationComplete,
        onAnimationInterrupted,
      };
    });

    it("should call onAnimationStart when transitioning", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events
      );
      machine.transitionTo("walk");

      expect(onAnimationStart).toHaveBeenCalledWith("walk");
      expect(onAnimationStart).toHaveBeenCalledTimes(1);
    });

    it("should call onFrame during updates", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events
      );
      const frameDuration = 1 / 60;

      machine.update(frameDuration);
      expect(onFrame).toHaveBeenCalledWith(1, "idle");
    });

    it("should call onAnimationComplete when animation finishes", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events
      );
      machine.transitionTo("attack");

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      // Complete the animation
      for (let i = 0; i <= config.frames; i++) {
        machine.update(frameDuration);
      }

      expect(onAnimationComplete).toHaveBeenCalledWith("attack");
    });

    it("should call onAnimationInterrupted when animation is interrupted", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events
      );
      machine.transitionTo("attack");

      // Interrupt with hit
      machine.transitionTo("hit");

      expect(onAnimationInterrupted).toHaveBeenCalledWith("attack", "hit");
    });

    it("should not call onAnimationInterrupted when animation completes naturally", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events
      );
      machine.transitionTo("attack");

      // Clear any calls from the initial transition
      onAnimationInterrupted.mockClear();

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      // Complete the animation naturally
      for (let i = 0; i <= config.frames; i++) {
        machine.update(frameDuration);
      }

      // Should not have been interrupted (auto-transition to idle doesn't count as interrupt)
      expect(onAnimationInterrupted).not.toHaveBeenCalled();
    });
  });

  describe("frame-accurate timing", () => {
    it("should have attack animation with 12 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      expect(config.frames).toBe(12);
      expect(config.duration).toBeCloseTo(0.2, 2); // 200ms at 60fps
    });

    it("should have defend animation with 4 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend")!;
      expect(config.frames).toBe(4);
      expect(config.duration).toBeCloseTo(0.067, 2); // ~67ms at 60fps
    });

    it("should have stance_change animation with ~600ms duration", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("stance_change")!;
      expect(config.duration).toBeCloseTo(0.6, 1);
    });

    it("should maintain 60fps for all animations", () => {
      DEFAULT_ANIMATION_CONFIGS.forEach((config) => {
        expect(config.fps).toBe(60);
      });
    });
  });

  describe("reset", () => {
    it("should reset to idle state", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");
      machine.update(1 / 60);

      machine.reset();

      expect(machine.getCurrentState()).toBe("idle");
      expect(machine.getCurrentFrame()).toBe(0);
      expect(machine.getPreviousState()).toBe(null);
    });
  });

  describe("getState", () => {
    it("should return current machine state", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("walk");
      machine.update(1 / 60);

      const state = machine.getState();
      expect(state.currentState).toBe("walk");
      expect(state.frameIndex).toBeGreaterThan(0);
      expect(state.isPlaying).toBe(true);
      expect(state.previousState).toBe("idle");
    });
  });

  describe("getCurrentAnimation", () => {
    it("should return current animation config", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      const config = machine.getCurrentAnimation();

      expect(config).toBeDefined();
      expect(config?.state).toBe("idle");
    });

    it("should return updated config after transition", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      const config = machine.getCurrentAnimation();
      expect(config?.state).toBe("attack");
      expect(config?.frames).toBe(12);
    });
  });

  describe("getPreviousState", () => {
    it("should track previous state", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      expect(machine.getPreviousState()).toBe(null);

      machine.transitionTo("walk");
      expect(machine.getPreviousState()).toBe("idle");

      machine.transitionTo("attack");
      expect(machine.getPreviousState()).toBe("walk");
    });
  });

  describe("60fps performance", () => {
    it("should handle rapid updates efficiently", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      const frameDuration = 1 / 60;

      // Simulate 1 second of 60fps updates
      const start = performance.now();
      for (let i = 0; i < 60; i++) {
        machine.update(frameDuration);
      }
      const end = performance.now();

      // Should complete in less than 100ms for 60 updates
      expect(end - start).toBeLessThan(100);
    });

    it("should maintain accuracy over many updates", () => {
      const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
      machine.transitionTo("attack");

      const config = DEFAULT_ANIMATION_CONFIGS.get("attack")!;
      const frameDuration = 1 / config.fps;

      // Update to advance frames
      for (let i = 0; i < 10; i++) {
        machine.update(frameDuration);
      }

      // Should be on frame 10 (started at 0, advanced 10 times)
      expect(machine.getCurrentFrame()).toBe(10);
      expect(machine.getCurrentState()).toBe("attack");
      
      // Two more updates should complete and auto-transition to idle
      machine.update(frameDuration); // frame 11
      machine.update(frameDuration); // completes, transitions to idle
      expect(machine.getCurrentState()).toBe("idle");
      expect(machine.getCurrentFrame()).toBe(0);
    });
  });
});
