/**
 * Tests for Animation State Machine Recovery Transitions
 * 
 * Validates recovery animation transitions including:
 * - Ground state to recovery animation transitions
 * - Recovery animation to idle transitions
 * - Recovery animation priority handling
 * - Interruptibility at final frames
 * 
 * @module systems/animation/AnimationStateMachine.recovery.test
 * @category Animation Tests
 * @korean 애니메이션상태머신회복테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import { PlayerAnimationStateMachine, DEFAULT_ANIMATION_CONFIGS } from "./AnimationStateMachine";
import type { AnimationEvents, AnimationState } from "./types";

describe("AnimationStateMachine - Recovery Transitions", () => {
  let machine: PlayerAnimationStateMachine;
  let eventLog: string[];

  beforeEach(() => {
    eventLog = [];
    
    const events: AnimationEvents = {
      onAnimationStart: (state) => {
        eventLog.push(`START:${state}`);
      },
      onAnimationComplete: (state) => {
        eventLog.push(`COMPLETE:${state}`);
      },
      onFrame: (frame, state) => {
        eventLog.push(`FRAME:${frame}:${state}`);
      },
    };

    machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS, events);
  });

  describe("Recovery Animation Configurations", () => {
    it("should have recovery_prone_standup configured with 30 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("recovery_prone_standup");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(30);
      expect(config?.duration).toBe(0.5);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9); // RECOVERY priority
    });

    it("should have recovery_supine_standup configured with 36 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("recovery_supine_standup");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(36);
      expect(config?.duration).toBe(0.6);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9);
    });

    it("should have recovery_roll configured with 24 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("recovery_roll");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(24);
      expect(config?.duration).toBe(0.4);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9);
    });

    it("should have recovery_defensive configured with 42 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("recovery_defensive");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(42);
      expect(config?.duration).toBe(0.7);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9);
    });

    it("should have recovery animations with highest priority", () => {
      const recoveryAnimations: AnimationState[] = [
        "recovery_prone_standup",
        "recovery_supine_standup",
        "recovery_roll",
        "recovery_defensive",
      ];

      for (const animState of recoveryAnimations) {
        const config = DEFAULT_ANIMATION_CONFIGS.get(animState);
        expect(config?.priority).toBe(9); // Highest priority
      }
    });
  });

  describe("Transitioning from Ground States to Recovery", () => {
    it("should allow transition from ground_prone to recovery_prone_standup", () => {
      // Set to ground prone state
      machine.transitionTo("ground_prone");
      expect(machine.getCurrentState()).toBe("ground_prone");

      // Transition to recovery
      const success = machine.transitionTo("recovery_prone_standup");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
    });

    it("should allow transition from ground_supine to recovery_supine_standup", () => {
      machine.transitionTo("ground_supine");
      expect(machine.getCurrentState()).toBe("ground_supine");

      const success = machine.transitionTo("recovery_supine_standup");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_supine_standup");
    });

    it("should allow transition from ground_side_left to recovery_roll", () => {
      machine.transitionTo("ground_side_left");
      expect(machine.getCurrentState()).toBe("ground_side_left");

      const success = machine.transitionTo("recovery_roll");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_roll");
    });

    it("should allow transition from ground_side_right to recovery_defensive", () => {
      machine.transitionTo("ground_side_right");
      expect(machine.getCurrentState()).toBe("ground_side_right");

      const success = machine.transitionTo("recovery_defensive");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_defensive");
    });

    it("should allow any recovery type from any ground state", () => {
      const groundStates: AnimationState[] = [
        "ground_prone",
        "ground_supine",
        "ground_side_left",
        "ground_side_right",
      ];
      const recoveryAnimations: AnimationState[] = [
        "recovery_prone_standup",
        "recovery_supine_standup",
        "recovery_roll",
        "recovery_defensive",
      ];

      for (const ground of groundStates) {
        for (const recovery of recoveryAnimations) {
          machine.reset();
          machine.transitionTo(ground);
          const success = machine.transitionTo(recovery);
          expect(success).toBe(true);
          expect(machine.getCurrentState()).toBe(recovery);
        }
      }
    });
  });

  describe("Recovery Animation Completion", () => {
    it("should transition from recovery_prone_standup to idle when complete", () => {
      machine.transitionTo("ground_prone");
      machine.transitionTo("recovery_prone_standup");
      
      // Update through all 30 frames (500ms at 60fps)
      const frameDuration = 1 / 60;
      for (let i = 0; i < 30; i++) {
        machine.update(frameDuration);
      }

      // Should auto-transition to idle
      const result = machine.update(frameDuration);
      expect(result.state).toBe("idle");
    });

    it("should transition from recovery_supine_standup to idle when complete", () => {
      machine.transitionTo("ground_supine");
      machine.transitionTo("recovery_supine_standup");
      
      // Update through all 36 frames (600ms at 60fps)
      const frameDuration = 1 / 60;
      for (let i = 0; i < 36; i++) {
        machine.update(frameDuration);
      }

      const result = machine.update(frameDuration);
      expect(result.state).toBe("idle");
    });

    it("should transition from recovery_roll to idle when complete", () => {
      machine.transitionTo("ground_side_left");
      machine.transitionTo("recovery_roll");
      
      // Update through all 24 frames (400ms at 60fps)
      const frameDuration = 1 / 60;
      for (let i = 0; i < 24; i++) {
        machine.update(frameDuration);
      }

      const result = machine.update(frameDuration);
      expect(result.state).toBe("idle");
    });

    it("should transition from recovery_defensive to idle when complete", () => {
      machine.transitionTo("ground_side_right");
      machine.transitionTo("recovery_defensive");
      
      // Update through all 42 frames (700ms at 60fps)
      const frameDuration = 1 / 60;
      for (let i = 0; i < 42; i++) {
        machine.update(frameDuration);
      }

      const result = machine.update(frameDuration);
      expect(result.state).toBe("idle");
    });

    it("should emit onAnimationComplete and onAnimationStart events", () => {
      machine.transitionTo("ground_prone");
      eventLog = []; // Clear start events
      
      machine.transitionTo("recovery_prone_standup");
      
      // Update through animation
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 30; i++) {
        machine.update(frameDuration);
      }

      // Should have complete event for recovery and start event for idle
      expect(eventLog).toContain("COMPLETE:recovery_prone_standup");
      expect(eventLog).toContain("START:idle");
    });
  });

  describe("Recovery Animation Priority", () => {
    it("should have higher priority than fall animations", () => {
      // Start fall animation
      machine.transitionTo("fall_forward");
      expect(machine.getCurrentState()).toBe("fall_forward");

      // Move fall to ground state first
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 24; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe("ground_prone");

      // Recovery should work from ground (priority 9 > 8)
      const success = machine.transitionTo("recovery_prone_standup");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
    });

    it("should allow transition from idle to recovery for testing", () => {
      // From idle, can transition to ground states for testing
      machine.transitionTo("ground_prone");
      expect(machine.getCurrentState()).toBe("ground_prone");

      // Then to recovery
      const success = machine.transitionTo("recovery_prone_standup");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
    });

    it("should not allow switching between recovery animations mid-execution", () => {
      machine.transitionTo("ground_prone");
      machine.transitionTo("recovery_prone_standup");
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
      
      // Try to switch to different recovery animation (should fail - same priority)
      const success = machine.transitionTo("recovery_roll");
      expect(success).toBe(false);
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
    });
  });

  describe("Recovery Animation Interruptibility", () => {
    it("should not allow switching between recovery animations mid-execution", () => {
      machine.transitionTo("ground_prone");
      machine.transitionTo("recovery_prone_standup");
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
      
      // Try to switch to different recovery animation
      const success = machine.transitionTo("recovery_roll");
      expect(success).toBe(false);
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");
    });

    it("should complete recovery animation without interruption from lower priority", () => {
      machine.transitionTo("ground_prone");
      machine.transitionTo("recovery_roll");
      const frameDuration = 1 / 60;
      
      // Update through most of animation
      for (let i = 0; i < 20; i++) {
        machine.update(frameDuration);
        expect(machine.getCurrentState()).toBe("recovery_roll");
      }
    });
  });

  describe("Frame Progression", () => {
    it("should progress through frames at 60fps for prone recovery", () => {
      machine.transitionTo("ground_prone");
      machine.transitionTo("recovery_prone_standup");
      const frameDuration = 1 / 60; // 16.67ms

      // Check initial state
      expect(machine.getCurrentFrame()).toBe(0);

      for (let i = 0; i < 29; i++) {
        machine.update(frameDuration);
        const currentFrame = machine.getCurrentFrame();
        expect(currentFrame).toBe(i + 1);
        expect(machine.getCurrentState()).toBe("recovery_prone_standup");
      }
    });

    it("should progress through frames at 60fps for roll recovery", () => {
      machine.transitionTo("ground_side_left");
      machine.transitionTo("recovery_roll");
      const frameDuration = 1 / 60;

      for (let i = 0; i < 23; i++) {
        machine.update(frameDuration);
        const currentFrame = machine.getCurrentFrame();
        expect(currentFrame).toBe(i + 1);
        expect(machine.getCurrentState()).toBe("recovery_roll");
      }
    });

    it("should report animation progress correctly", () => {
      machine.transitionTo("ground_prone");
      machine.transitionTo("recovery_prone_standup");
      const frameDuration = 1 / 60;

      // At frame 0
      let result = machine.update(0);
      expect(result.progress).toBeCloseTo(0, 2);

      // At frame 15 (halfway through 30 frames)
      for (let i = 0; i < 15; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentFrame()).toBe(15);
      // Progress should be 15/30 = 0.5
      expect(machine.getCurrentFrame() / 30).toBeCloseTo(0.5, 1);
    });
  });

  describe("Integration with Fall System", () => {
    it("should complete fall-ground-recovery cycle", () => {
      // Fall forward
      machine.transitionTo("fall_forward");
      expect(machine.getCurrentState()).toBe("fall_forward");

      // Complete fall animation (24 frames)
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 24; i++) {
        machine.update(frameDuration);
      }

      // Should auto-transition to ground_prone
      expect(machine.getCurrentState()).toBe("ground_prone");

      // Initiate recovery
      const success = machine.transitionTo("recovery_prone_standup");
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("recovery_prone_standup");

      // Complete recovery (30 frames)
      for (let i = 0; i <= 30; i++) {
        machine.update(frameDuration);
      }

      // Should auto-transition to idle
      expect(machine.getCurrentState()).toBe("idle");
    });

    it("should complete full knockdown-recovery sequence", () => {
      // Fall backward
      machine.transitionTo("fall_backward");
      
      // Complete fall (30 frames)
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 30; i++) {
        machine.update(frameDuration);
      }

      // Should be in ground_supine
      expect(machine.getCurrentState()).toBe("ground_supine");

      // Execute supine recovery
      machine.transitionTo("recovery_supine_standup");
      
      // Complete recovery (36 frames)
      for (let i = 0; i <= 36; i++) {
        machine.update(frameDuration);
      }

      // Should be back to idle
      expect(machine.getCurrentState()).toBe("idle");
    });
  });
});
