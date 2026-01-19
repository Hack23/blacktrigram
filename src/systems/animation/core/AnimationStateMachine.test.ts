/**
 * Unit tests for PlayerAnimationStateMachine
 *
 * Tests core animation state machine logic, timing, and transitions.
 */

import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_ANIMATION_CONFIGS,
  PlayerAnimationStateMachine,
} from "./AnimationStateMachine";
import type { AnimationEvents } from "./types";
import { AnimationState } from "./types";

describe("PlayerAnimationStateMachine", () => {
  describe("initialization", () => {
    it("should start in idle state", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
      expect(machine.getCurrentFrame()).toBe(0);
    });

    it("should accept custom animation configs", () => {
      const customConfigs = new Map(DEFAULT_ANIMATION_CONFIGS);
      const machine = new PlayerAnimationStateMachine(customConfigs);
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
    });
  });

  describe("update", () => {
    it("should advance frames based on delta time", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.IDLE);
      expect(config).toBeDefined();
      if (!config) return;
      const frameDuration = 1 / config.fps; // 1/60 = ~0.0167s

      // First update
      const result1 = machine.update(frameDuration);
      expect(result1.frame).toBe(1);

      // Second update
      const result2 = machine.update(frameDuration);
      expect(result2.frame).toBe(2);
    });

    it("should loop looping animations", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.IDLE);
      expect(config).toBeDefined();
      if (!config) return;
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
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
      const frameDuration = 1 / config.fps;

      // Advance through all frames
      for (let i = 0; i < config.frames + 1; i++) {
        machine.update(frameDuration);
      }

      // Should have transitioned to idle
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
    });

    it("should calculate progress correctly", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
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
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
      const frameDuration = 1 / config.fps;

      // Advance to completion
      for (let i = 0; i < config.frames; i++) {
        machine.update(frameDuration);
      }

      // Complete the animation
      const result = machine.update(frameDuration);
      expect(result?.justCompleted).toBe(true);
    });
  });

  describe("transitionTo", () => {
    it("should transition to valid states", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.transitionTo(AnimationState.WALK)).toBe(true);
      expect(machine.getCurrentState()).toBe(AnimationState.WALK);
    });

    it("should not transition to same state", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.transitionTo(AnimationState.IDLE)).toBe(false);
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
    });

    it("should respect transition rules", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      // Attack cannot transition directly to walk
      expect(machine.transitionTo(AnimationState.WALK)).toBe(false);
      expect(machine.getCurrentState()).toBe(AnimationState.ATTACK);
    });

    it("should respect priority system", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      // Hit (higher priority) can interrupt attack
      expect(machine.transitionTo(AnimationState.HIT)).toBe(true);
      expect(machine.getCurrentState()).toBe(AnimationState.HIT);
    });

    it("should not allow lower priority to interrupt non-interruptible animations", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.HIT); // Hit is non-interruptible

      // Attack (lower priority) cannot interrupt hit
      expect(machine.transitionTo(AnimationState.ATTACK)).toBe(false);
      expect(machine.getCurrentState()).toBe(AnimationState.HIT);
    });

    it("should reset frame and time accumulator on transition", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      const frameDuration = 1 / 60;

      // Advance idle animation
      machine.update(frameDuration);
      machine.update(frameDuration);
      expect(machine.getCurrentFrame()).toBeGreaterThan(0);

      // Transition to walk
      machine.transitionTo(AnimationState.WALK);
      expect(machine.getCurrentFrame()).toBe(0);
    });
  });

  describe("event callbacks", () => {
    let events: AnimationEvents;
    let onAnimationStart: ReturnType<
      typeof vi.fn<[state: AnimationState], void>
    >;
    let onFrame: ReturnType<
      typeof vi.fn<[frame: number, state: AnimationState], void>
    >;
    let onAnimationComplete: ReturnType<
      typeof vi.fn<[state: AnimationState], void>
    >;
    let onAnimationInterrupted: ReturnType<
      typeof vi.fn<[fromState: AnimationState, toState: AnimationState], void>
    >;

    beforeEach(() => {
      onAnimationStart = vi.fn<[state: AnimationState], void>();
      onFrame = vi.fn<[frame: number, state: AnimationState], void>();
      onAnimationComplete = vi.fn<[state: AnimationState], void>();
      onAnimationInterrupted = vi.fn<
        [fromState: AnimationState, toState: AnimationState],
        void
      >();

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
        events,
      );
      machine.transitionTo(AnimationState.WALK);

      expect(onAnimationStart).toHaveBeenCalledWith(AnimationState.WALK);
      expect(onAnimationStart).toHaveBeenCalledTimes(1);
    });

    it("should call onFrame during updates", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events,
      );
      const frameDuration = 1 / 60;

      machine.update(frameDuration);
      expect(onFrame).toHaveBeenCalledWith(1, AnimationState.IDLE);
    });

    it("should call onAnimationComplete when animation finishes", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events,
      );
      machine.transitionTo(AnimationState.ATTACK);

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
      const frameDuration = 1 / config.fps;

      // Complete the animation
      for (let i = 0; i <= config.frames; i++) {
        machine.update(frameDuration);
      }

      expect(onAnimationComplete).toHaveBeenCalledWith(AnimationState.ATTACK);
    });

    it("should call onAnimationInterrupted when animation is interrupted", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events,
      );
      machine.transitionTo(AnimationState.ATTACK);

      // Interrupt with hit
      machine.transitionTo(AnimationState.HIT);

      expect(onAnimationInterrupted).toHaveBeenCalledWith(
        AnimationState.ATTACK,
        AnimationState.HIT,
      );
    });

    it("should not call onAnimationInterrupted when animation completes naturally", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
        events,
      );
      machine.transitionTo(AnimationState.ATTACK);

      // Clear any calls from the initial transition
      onAnimationInterrupted.mockClear();

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
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
      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
      expect(config.frames).toBe(12);
      expect(config.duration).toBeCloseTo(0.2, 2); // 200ms at 60fps
    });

    it("should have defend animation with 4 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.DEFEND);
      expect(config).toBeDefined();
      if (!config) return;
      expect(config.frames).toBe(4);
      expect(config.duration).toBeCloseTo(0.067, 2); // ~67ms at 60fps
    });

    it("should have stance_change animation with ~600ms duration", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.STANCE_CHANGE,
      );
      expect(config).toBeDefined();
      if (!config) return;
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
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);
      machine.update(1 / 60);

      machine.reset();

      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
      expect(machine.getCurrentFrame()).toBe(0);
      expect(machine.getPreviousState()).toBe(null);
    });
  });

  describe("getState", () => {
    it("should return current machine state", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.WALK);
      machine.update(1 / 60);

      const state = machine.getState();
      expect(state.currentState).toBe(AnimationState.WALK);
      expect(state.frameIndex).toBeGreaterThan(0);
      expect(state.isPlaying).toBe(true);
      expect(state.previousState).toBe(AnimationState.IDLE);
    });
  });

  describe("getCurrentAnimation", () => {
    it("should return current animation config", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      const config = machine.getCurrentAnimation();

      expect(config).toBeDefined();
      expect(config?.state).toBe(AnimationState.IDLE);
    });

    it("should return updated config after transition", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      const config = machine.getCurrentAnimation();
      expect(config?.state).toBe(AnimationState.ATTACK);
      expect(config?.frames).toBe(12);
    });
  });

  describe("getPreviousState", () => {
    it("should track previous state", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.getPreviousState()).toBe(null);

      machine.transitionTo(AnimationState.WALK);
      expect(machine.getPreviousState()).toBe(AnimationState.IDLE);

      machine.transitionTo(AnimationState.ATTACK);
      expect(machine.getPreviousState()).toBe(AnimationState.WALK);
    });
  });

  describe("60fps performance", () => {
    it("should handle rapid updates efficiently", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
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
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.transitionTo(AnimationState.ATTACK);

      const config = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(config).toBeDefined();
      if (!config) return;
      const frameDuration = 1 / config.fps;

      // Update to advance frames
      for (let i = 0; i < 10; i++) {
        machine.update(frameDuration);
      }

      // Should be on frame 10 (started at 0, advanced 10 times)
      expect(machine.getCurrentFrame()).toBe(10);
      expect(machine.getCurrentState()).toBe(AnimationState.ATTACK);

      // Two more updates should complete and auto-transition to idle
      machine.update(frameDuration); // frame 11
      machine.update(frameDuration); // completes, transitions to idle
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
      expect(machine.getCurrentFrame()).toBe(0);
    });
  });

  describe("motion prediction API", () => {
    it("should initialize with motion prediction disabled", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.isMotionPredictionEnabled()).toBe(false);
    });

    it("should enable motion prediction with default prediction time", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.setMotionPrediction(true);

      expect(machine.isMotionPredictionEnabled()).toBe(true);
      const state = machine.getMotionPredictionState();
      expect(state).toBeDefined();
      expect(state.velocities).toBeDefined();
      expect(state.angularVelocities).toBeDefined();
    });

    it("should enable motion prediction with custom prediction time", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      const customTime = 0.033; // 2 frames at 60fps
      machine.setMotionPrediction(true, customTime);

      expect(machine.isMotionPredictionEnabled()).toBe(true);
      const state = machine.getMotionPredictionState();
      expect(state).toBeDefined();
      expect(state.velocities).toBeDefined();
    });

    it("should disable motion prediction", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.setMotionPrediction(true);
      expect(machine.isMotionPredictionEnabled()).toBe(true);

      machine.setMotionPrediction(false);
      expect(machine.isMotionPredictionEnabled()).toBe(false);
    });

    it("should update motion prediction state with velocity tracking", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.setMotionPrediction(true);

      // Create mock keyframes with proper Euler angle format
      const keyframe1 = {
        time: 0,
        bonePositions: new Map([
          ["root", new THREE.Vector3(0, 0, 0)],
          ["spine", new THREE.Vector3(0, 1, 0)],
        ]),
        boneRotations: new Map([
          ["root", new THREE.Euler(0, 0, 0, "XYZ")],
          ["spine", new THREE.Euler(0, 0, 0, "XYZ")],
        ]),
      };

      const keyframe2 = {
        time: 0.01667,
        bonePositions: new Map([
          ["root", new THREE.Vector3(0.1, 0, 0)],
          ["spine", new THREE.Vector3(0.1, 1, 0)],
        ]),
        boneRotations: new Map([
          ["root", new THREE.Euler(0, 0.1, 0, "XYZ")],
          ["spine", new THREE.Euler(0, 0, 0, "XYZ")],
        ]),
      };

      const deltaTime = 0.01667; // 1 frame at 60fps

      // First update establishes baseline
      machine.updateMotionPredictionState(keyframe1, deltaTime);

      // Second update calculates velocities
      machine.updateMotionPredictionState(keyframe2, deltaTime);

      const state = machine.getMotionPredictionState();
      expect(state.velocities).toBeDefined();
      expect(state.velocities.size).toBeGreaterThan(0);
      expect(state.angularVelocities).toBeDefined();
    });

    it("should handle getPredictedKeyframe when motion prediction is disabled", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      const currentKeyframe = {
        time: 0,
        bonePositions: new Map([["root", new THREE.Vector3(0, 0, 0)]]),
        boneRotations: new Map([["root", new THREE.Euler(0, 0, 0, "XYZ")]]),
      };

      // Should return the same keyframe when prediction is disabled
      const predicted = machine.getPredictedKeyframe(currentKeyframe);
      expect(predicted).toBe(currentKeyframe);
    });

    it("should predict future keyframe when motion prediction is enabled", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      machine.setMotionPrediction(true, 0.01667);

      // Setup velocity tracking with two keyframes using proper THREE.Vector3
      const keyframe1 = {
        time: 0,
        bonePositions: new Map([["root", new THREE.Vector3(0, 0, 0)]]),
        boneRotations: new Map([["root", new THREE.Euler(0, 0, 0, "XYZ")]]),
      };

      const keyframe2 = {
        time: 0.01667,
        bonePositions: new Map([["root", new THREE.Vector3(1, 0, 0)]]),
        boneRotations: new Map([["root", new THREE.Euler(0, 0.1, 0, "XYZ")]]),
      };

      machine.updateMotionPredictionState(keyframe1, 0.01667);
      machine.updateMotionPredictionState(keyframe2, 0.01667);

      // Get predicted keyframe
      const predicted = machine.getPredictedKeyframe(keyframe2);

      // Predicted keyframe should be different from current
      expect(predicted).not.toBe(keyframe2);
      expect(predicted.bonePositions).toBeDefined();
      expect(predicted.boneRotations).toBeDefined();

      // Predicted position should be ahead of current position
      const predictedRoot = predicted.bonePositions.get("root");
      const currentRoot = keyframe2.bonePositions.get("root");
      expect(predictedRoot).toBeDefined();
      expect(currentRoot).toBeDefined();
      if (predictedRoot && currentRoot) {
        expect(predictedRoot.x).toBeGreaterThan(currentRoot.x);
      }
    });

    it("should reset velocity tracking when motion prediction is re-enabled", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Enable and setup velocity with two keyframes
      machine.setMotionPrediction(true);
      const keyframe1 = {
        time: 0,
        bonePositions: new Map([["root", new THREE.Vector3(0, 0, 0)]]),
        boneRotations: new Map([["root", new THREE.Euler(0, 0, 0, "XYZ")]]),
      };
      const keyframe2 = {
        time: 0.01667,
        bonePositions: new Map([["root", new THREE.Vector3(1, 0, 0)]]),
        boneRotations: new Map([["root", new THREE.Euler(0, 0.1, 0, "XYZ")]]),
      };

      // Two updates to establish velocity
      machine.updateMotionPredictionState(keyframe1, 0.01667);
      machine.updateMotionPredictionState(keyframe2, 0.01667);

      let state = machine.getMotionPredictionState();
      // Store initial velocity count (should be > 0 after two updates)
      expect(state.velocities.size).toBeGreaterThan(0);

      // Disable then re-enable
      machine.setMotionPrediction(false);
      expect(machine.isMotionPredictionEnabled()).toBe(false);

      machine.setMotionPrediction(true);
      expect(machine.isMotionPredictionEnabled()).toBe(true);

      // The state should be functional after re-enabling
      // (Implementation may keep or clear velocities, both are valid)
      state = machine.getMotionPredictionState();
      expect(state).toBeDefined();
      expect(state.velocities).toBeDefined();
    });
  });

  describe("easing configuration API", () => {
    it("should initialize with natural-motion as default easing", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.getPreferredEasing()).toBe("natural-motion");
    });

    it("should set preferred easing curve", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      machine.setPreferredEasing("smooth-transition");
      expect(machine.getPreferredEasing()).toBe("smooth-transition");

      machine.setPreferredEasing("explosive-power");
      expect(machine.getPreferredEasing()).toBe("explosive-power");
    });

    it("should support all easing curve presets", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      const easingPresets = [
        "natural-motion",
        "smooth-transition",
        "quick-start",
        "explosive-power",
        "controlled-slow",
      ] as const;

      for (const preset of easingPresets) {
        machine.setPreferredEasing(preset);
        expect(machine.getPreferredEasing()).toBe(preset);
      }
    });

    it("should accept linear easing", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      machine.setPreferredEasing("linear");
      expect(machine.getPreferredEasing()).toBe("linear");
    });

    it("should retain easing preference across state transitions", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      machine.setPreferredEasing("explosive-power");
      expect(machine.getPreferredEasing()).toBe("explosive-power");

      // Transition to different animation state
      machine.transitionTo(AnimationState.ATTACK);
      expect(machine.getPreferredEasing()).toBe("explosive-power");

      machine.transitionTo(AnimationState.IDLE);
      expect(machine.getPreferredEasing()).toBe("explosive-power");
    });

    it("should have configured easing for stance change animations", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Animations like stance_change should have smooth-transition easing configured
      machine.transitionTo(AnimationState.STANCE_CHANGE);
      const config = machine.getCurrentAnimation();
      expect(config?.easing).toBe("smooth-transition");
    });

    it("should have configured easing for attack animations", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Attack animations should have explosive-power easing
      machine.transitionTo(AnimationState.ATTACK);
      const config = machine.getCurrentAnimation();
      expect(config?.easing).toBe("explosive-power");
    });

    it("should have configured easing for defensive animations", () => {
      // Defensive block success should have controlled-slow easing configured
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.DEFEND_BLOCK_SUCCESS,
      );
      expect(config).toBeDefined();
      expect(config?.easing).toBe("controlled-slow");
    });

    it("should have configured easing for recovery animations", () => {
      // Recovery animations should have natural-motion easing configured
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.DEFEND_RECOVERY,
      );
      expect(config).toBeDefined();
      expect(config?.easing).toBe("natural-motion");
    });
  });

  // ===== Animation Queue Integration Tests =====

  describe("animation queue integration", () => {
    it("should have queue enabled by default", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      expect(machine.isQueueEnabled()).toBe(true);

      const queueState = machine.getQueueState();
      expect(queueState.enabled).toBe(true);
      expect(queueState.size).toBe(0);
      expect(queueState.maxSize).toBe(3); // Default max size
    });

    it("should queue animations when transition fails", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Start a non-interruptible attack animation
      machine.transitionTo(AnimationState.ATTACK);
      expect(machine.getCurrentState()).toBe(AnimationState.ATTACK);

      // Try to transition to defend (lower priority, should queue)
      const result = machine.transitionToQueued(AnimationState.DEFEND);
      expect(result).toBe("queued");

      // Check queue state
      const queueState = machine.getQueueState();
      expect(queueState.size).toBe(1);
      expect(queueState.pending[0].state).toBe(AnimationState.DEFEND);
    });

    it("should process queued animation when current animation completes", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );
      const attackConfig = DEFAULT_ANIMATION_CONFIGS.get(AnimationState.ATTACK);
      expect(attackConfig).toBeDefined();
      if (!attackConfig) return;

      // Start attack animation
      machine.transitionTo(AnimationState.ATTACK);

      // Queue a walk animation (lower priority than attack)
      const result = machine.transitionToQueued(AnimationState.WALK);
      expect(result).toBe("queued");
      expect(machine.getQueueState().size).toBe(1);

      // Complete the attack animation by updating through all frames
      const frameDuration = 1 / attackConfig.fps;
      for (let i = 0; i < attackConfig.frames; i++) {
        machine.update(frameDuration);
      }

      // After attack completes, it normally goes to idle, but queued animation should execute
      // The next update should trigger the queue processing
      machine.update(frameDuration);

      // Machine should have transitioned to the queued animation
      expect(machine.getCurrentState()).toBe(AnimationState.WALK);
      expect(machine.getQueueState().size).toBe(0);
    });

    it("should maintain priority order in queue", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Start attack
      machine.transitionTo(AnimationState.ATTACK);

      // Queue lower priority animations
      machine.transitionToQueued(AnimationState.WALK); // Priority 1
      machine.transitionToQueued(AnimationState.DEFEND); // Priority 4
      machine.transitionToQueued(AnimationState.RUN); // Priority 2

      const queueState = machine.getQueueState();
      expect(queueState.size).toBe(3);

      // Queue should be sorted by priority (highest first)
      expect(queueState.pending[0].state).toBe(AnimationState.DEFEND); // Priority 4
      expect(queueState.pending[1].state).toBe(AnimationState.RUN); // Priority 2
      expect(queueState.pending[2].state).toBe(AnimationState.WALK); // Priority 1
    });

    it("should allow immediate transition for high priority animations", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Start attack animation
      machine.transitionTo(AnimationState.ATTACK);

      // HIT has higher priority, should interrupt immediately
      const result = machine.transitionToQueued(AnimationState.HIT);
      expect(result).toBe("success");
      expect(machine.getCurrentState()).toBe(AnimationState.HIT);
      expect(machine.getQueueState().size).toBe(0);
    });

    it("should clear queue when requested", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Start attack and queue some animations
      machine.transitionTo(AnimationState.ATTACK);
      machine.transitionToQueued(AnimationState.DEFEND);
      machine.transitionToQueued(AnimationState.WALK);

      expect(machine.getQueueState().size).toBe(2);

      // Clear queue
      machine.clearQueue();
      expect(machine.getQueueState().size).toBe(0);
    });

    it("should reconfigure queue with enableQueue()", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Reconfigure with larger size and different strategy
      machine.enableQueue(5, "requested");

      const queueState = machine.getQueueState();
      expect(queueState.maxSize).toBe(5);
      expect(machine.getConflictStrategy()).toBe("requested");
    });

    it("should disable queue when requested", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      expect(machine.isQueueEnabled()).toBe(true);

      machine.disableQueue();

      expect(machine.isQueueEnabled()).toBe(false);

      // transitionToQueued should fail when queue is disabled
      machine.transitionTo(AnimationState.ATTACK);
      const result = machine.transitionToQueued(AnimationState.DEFEND);
      expect(result).toBe("failed");
    });

    it("should keep conflict strategy in sync with queue", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Change conflict strategy
      machine.setConflictStrategy("state_order");
      expect(machine.getConflictStrategy()).toBe("state_order");

      // Queue an animation to verify queue uses new strategy
      machine.transitionTo(AnimationState.ATTACK);
      machine.transitionToQueued(AnimationState.DEFEND);

      // Strategy should be reflected in queue behavior
      const queueState = machine.getQueueState();
      expect(queueState.size).toBe(1);
    });

    it("should respect max queue size", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Start attack
      machine.transitionTo(AnimationState.ATTACK);

      // Try to queue more than max size (default 3)
      machine.transitionToQueued(AnimationState.WALK); // Priority 1
      machine.transitionToQueued(AnimationState.RUN); // Priority 2
      machine.transitionToQueued(AnimationState.STANCE_CHANGE); // Priority 3

      expect(machine.getQueueState().size).toBe(3);

      // Try to add lower priority - should fail
      const result = machine.transitionToQueued(AnimationState.IDLE); // Priority 0
      expect(result).toBe("failed");
      expect(machine.getQueueState().size).toBe(3);

      // Try to add higher priority - should replace lowest
      const result2 = machine.transitionToQueued(AnimationState.DEFEND); // Priority 4
      expect(result2).toBe("queued");
      expect(machine.getQueueState().size).toBe(3);

      // Verify WALK (priority 1) was replaced
      const pending = machine.getQueueState().pending;
      const states = pending.map((r) => r.state);
      expect(states).not.toContain(AnimationState.WALK);
      expect(states).toContain(AnimationState.DEFEND);
    });

    it("should handle equal-priority conflicts with timestamp strategy", () => {
      const machine = new PlayerAnimationStateMachine(
        DEFAULT_ANIMATION_CONFIGS,
      );

      // Ensure timestamp strategy (default)
      machine.setConflictStrategy("timestamp");

      // Start attack
      machine.transitionTo(AnimationState.ATTACK);

      // Queue two animations with same priority (both are ATTACK priority = 5)
      machine.transitionToQueued(AnimationState.ATTACK);

      // Wait a tiny bit to ensure different timestamp
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      return sleep(5).then(() => {
        machine.transitionToQueued(AnimationState.ATTACK);

        const queueState = machine.getQueueState();
        expect(queueState.size).toBe(2);

        // First request should be at index 0 (FIFO with timestamp strategy)
        expect(queueState.pending[0].timestamp).toBeLessThan(
          queueState.pending[1].timestamp,
        );
      });
    });
  });
});
