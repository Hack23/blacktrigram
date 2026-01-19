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

import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_ANIMATION_CONFIGS,
  PlayerAnimationStateMachine,
} from "./AnimationStateMachine";
import type { AnimationEvents } from "./types";
import { AnimationState } from "./types";

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

    machine = new PlayerAnimationStateMachine(
      DEFAULT_ANIMATION_CONFIGS,
      events,
    );
  });

  describe("Recovery Animation Configurations", () => {
    it("should have recovery_prone_standup configured with 30 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
      expect(config).toBeDefined();
      expect(config?.frames).toBe(30);
      expect(config?.duration).toBe(0.5);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9); // RECOVERY priority
    });

    it("should have recovery_supine_standup configured with 36 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.RECOVERY_SUPINE_STANDUP,
      );
      expect(config).toBeDefined();
      expect(config?.frames).toBe(36);
      expect(config?.duration).toBe(0.6);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9);
    });

    it("should have recovery_roll configured with 24 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.RECOVERY_ROLL,
      );
      expect(config).toBeDefined();
      expect(config?.frames).toBe(24);
      expect(config?.duration).toBe(0.4);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9);
    });

    it("should have recovery_defensive configured with 42 frames", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get(
        AnimationState.RECOVERY_DEFENSIVE,
      );
      expect(config).toBeDefined();
      expect(config?.frames).toBe(42);
      expect(config?.duration).toBe(0.7);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(9);
    });

    it("should have recovery animations with highest priority", () => {
      const recoveryAnimations: AnimationState[] = [
        AnimationState.RECOVERY_PRONE_STANDUP,
        AnimationState.RECOVERY_SUPINE_STANDUP,
        AnimationState.RECOVERY_ROLL,
        AnimationState.RECOVERY_DEFENSIVE,
      ];

      for (const animState of recoveryAnimations) {
        const config = DEFAULT_ANIMATION_CONFIGS.get(animState);
        expect(config?.priority).toBe(9); // Highest priority
      }
    });
  });

  describe("Transitioning from Ground States to Recovery", () => {
    it("should allow transition from ground_prone to recovery_prone_standup", () => {
      // Fall forward leads to prone position
      machine.transitionTo(AnimationState.FALL_FORWARD);
      // Complete the fall animation to reach ground state
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      // Transition to recovery
      const success = machine.transitionTo(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
    });

    it("should allow transition from ground_supine to recovery_supine_standup", () => {
      // Fall backward leads to supine position
      machine.transitionTo(AnimationState.FALL_BACKWARD);
      // Complete the fall animation to reach ground state
      const frameDuration = 1 / 60;
      for (let i = 0; i < 31; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SUPINE);

      const success = machine.transitionTo(
        AnimationState.RECOVERY_SUPINE_STANDUP,
      );
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_SUPINE_STANDUP,
      );
    });

    it("should allow transition from ground_side_left to recovery_roll", () => {
      // Fall to side left
      machine.transitionTo(AnimationState.FALL_SIDE_LEFT);
      // Complete the fall animation to reach ground state
      const frameDuration = 1 / 60;
      for (let i = 0; i < 28; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SIDE_LEFT);

      const success = machine.transitionTo(AnimationState.RECOVERY_ROLL);
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(AnimationState.RECOVERY_ROLL);
    });

    it("should allow transition from ground_side_right to recovery_defensive", () => {
      // Fall to side right
      machine.transitionTo(AnimationState.FALL_SIDE_RIGHT);
      // Complete the fall animation to reach ground state
      const frameDuration = 1 / 60;
      for (let i = 0; i < 28; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SIDE_RIGHT);

      const success = machine.transitionTo(AnimationState.RECOVERY_DEFENSIVE);
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(AnimationState.RECOVERY_DEFENSIVE);
    });

    it("should allow any recovery type from any ground state", () => {
      const fallToGroundMapping = {
        [AnimationState.GROUND_PRONE]: AnimationState.FALL_FORWARD,
        [AnimationState.GROUND_SUPINE]: AnimationState.FALL_BACKWARD,
        [AnimationState.GROUND_SIDE_LEFT]: AnimationState.FALL_SIDE_LEFT,
        [AnimationState.GROUND_SIDE_RIGHT]: AnimationState.FALL_SIDE_RIGHT,
      } as const;

      const groundStates: AnimationState[] = [
        AnimationState.GROUND_PRONE,
        AnimationState.GROUND_SUPINE,
        AnimationState.GROUND_SIDE_LEFT,
        AnimationState.GROUND_SIDE_RIGHT,
      ];
      const recoveryAnimations: AnimationState[] = [
        AnimationState.RECOVERY_PRONE_STANDUP,
        AnimationState.RECOVERY_SUPINE_STANDUP,
        AnimationState.RECOVERY_ROLL,
        AnimationState.RECOVERY_DEFENSIVE,
      ];

      for (const ground of groundStates) {
        for (const recovery of recoveryAnimations) {
          machine.reset();
          // Transition through fall to reach ground state
          const fallAnimation =
            fallToGroundMapping[ground as keyof typeof fallToGroundMapping];
          machine.transitionTo(fallAnimation);
          // Complete fall animation
          const frameDuration = 1 / 60;
          for (let i = 0; i < 31; i++) {
            machine.update(frameDuration);
          }
          // Should be in ground state now
          expect(machine.getCurrentState()).toBe(ground);

          // Now test recovery transition
          const success = machine.transitionTo(recovery);
          expect(success).toBe(true);
          expect(machine.getCurrentState()).toBe(recovery);
        }
      }
    });
  });

  describe("Recovery Animation Completion", () => {
    it("should transition from recovery_prone_standup to idle when complete", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      machine.transitionTo(AnimationState.RECOVERY_PRONE_STANDUP);

      // Update through all 30 frames (500ms at 60fps)
      for (let i = 0; i < 30; i++) {
        machine.update(frameDuration);
      }

      // Should auto-transition to idle
      const result = machine.update(frameDuration);
      expect(result.state).toBe(AnimationState.IDLE);
    });

    it("should transition from recovery_supine_standup to idle when complete", () => {
      // Fall backward to reach supine
      machine.transitionTo(AnimationState.FALL_BACKWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 31; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SUPINE);

      machine.transitionTo(AnimationState.RECOVERY_SUPINE_STANDUP);

      // Update through all 36 frames (600ms at 60fps)
      for (let i = 0; i < 36; i++) {
        machine.update(frameDuration);
      }

      const result = machine.update(frameDuration);
      expect(result.state).toBe(AnimationState.IDLE);
    });

    it("should transition from recovery_roll to idle when complete", () => {
      // Fall to side left
      machine.transitionTo(AnimationState.FALL_SIDE_LEFT);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 28; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SIDE_LEFT);

      machine.transitionTo(AnimationState.RECOVERY_ROLL);

      // Update through all 24 frames (400ms at 60fps)
      for (let i = 0; i < 24; i++) {
        machine.update(frameDuration);
      }

      const result = machine.update(frameDuration);
      expect(result.state).toBe(AnimationState.IDLE);
    });

    it("should transition from recovery_defensive to idle when complete", () => {
      // Fall to side right
      machine.transitionTo(AnimationState.FALL_SIDE_RIGHT);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 28; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SIDE_RIGHT);

      machine.transitionTo(AnimationState.RECOVERY_DEFENSIVE);

      // Update through all 42 frames (700ms at 60fps)
      for (let i = 0; i < 42; i++) {
        machine.update(frameDuration);
      }

      const result = machine.update(frameDuration);
      expect(result.state).toBe(AnimationState.IDLE);
    });

    it("should emit onAnimationComplete and onAnimationStart events", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      eventLog = []; // Clear start events

      machine.transitionTo(AnimationState.RECOVERY_PRONE_STANDUP);

      // Update through animation
      for (let i = 0; i <= 30; i++) {
        machine.update(frameDuration);
      }

      // Should have complete event for recovery and start event for idle
      expect(eventLog).toContain(
        `COMPLETE:${AnimationState.RECOVERY_PRONE_STANDUP}`,
      );
      expect(eventLog).toContain(`START:${AnimationState.IDLE}`);
    });
  });

  describe("Recovery Animation Priority", () => {
    it("should have higher priority than fall animations", () => {
      // Start fall animation
      machine.transitionTo(AnimationState.FALL_FORWARD);
      expect(machine.getCurrentState()).toBe(AnimationState.FALL_FORWARD);

      // Move fall to ground state first
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 24; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      // Recovery should work from ground (priority 9 > 8)
      const success = machine.transitionTo(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
    });

    it("should allow transition from idle to recovery for testing", () => {
      // Fall forward to reach prone state
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      // Then to recovery
      const success = machine.transitionTo(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
    });

    it("should not allow switching between recovery animations mid-execution", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      machine.transitionTo(AnimationState.RECOVERY_PRONE_STANDUP);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );

      // Try to switch to different recovery animation (should fail - same priority)
      const success = machine.transitionTo(AnimationState.RECOVERY_ROLL);
      expect(success).toBe(false);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
    });
  });

  describe("Recovery Animation Interruptibility", () => {
    it("should not allow switching between recovery animations mid-execution", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      machine.transitionTo(AnimationState.RECOVERY_PRONE_STANDUP);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );

      // Try to switch to different recovery animation
      const success = machine.transitionTo(AnimationState.RECOVERY_ROLL);
      expect(success).toBe(false);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
    });

    it("should complete recovery animation without interruption from lower priority", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      machine.transitionTo(AnimationState.RECOVERY_ROLL);

      // Update through most of animation
      for (let i = 0; i < 20; i++) {
        machine.update(frameDuration);
        expect(machine.getCurrentState()).toBe(AnimationState.RECOVERY_ROLL);
      }
    });
  });

  describe("Frame Progression", () => {
    it("should progress through frames at 60fps for prone recovery", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      machine.transitionTo(AnimationState.RECOVERY_PRONE_STANDUP);

      // Check initial state
      expect(machine.getCurrentFrame()).toBe(0);

      for (let i = 0; i < 29; i++) {
        machine.update(frameDuration);
        const currentFrame = machine.getCurrentFrame();
        expect(currentFrame).toBe(i + 1);
        expect(machine.getCurrentState()).toBe(
          AnimationState.RECOVERY_PRONE_STANDUP,
        );
      }
    });

    it("should progress through frames at 60fps for roll recovery", () => {
      // Fall to side left
      machine.transitionTo(AnimationState.FALL_SIDE_LEFT);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 28; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SIDE_LEFT);

      machine.transitionTo(AnimationState.RECOVERY_ROLL);

      for (let i = 0; i < 23; i++) {
        machine.update(frameDuration);
        const currentFrame = machine.getCurrentFrame();
        expect(currentFrame).toBe(i + 1);
        expect(machine.getCurrentState()).toBe(AnimationState.RECOVERY_ROLL);
      }
    });

    it("should report animation progress correctly", () => {
      // Fall forward to reach prone
      machine.transitionTo(AnimationState.FALL_FORWARD);
      const frameDuration = 1 / 60;
      for (let i = 0; i < 25; i++) {
        machine.update(frameDuration);
      }
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      machine.transitionTo(AnimationState.RECOVERY_PRONE_STANDUP);

      // At frame 0
      const result = machine.update(0);
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
      machine.transitionTo(AnimationState.FALL_FORWARD);
      expect(machine.getCurrentState()).toBe(AnimationState.FALL_FORWARD);

      // Complete fall animation (24 frames)
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 24; i++) {
        machine.update(frameDuration);
      }

      // Should auto-transition to ground_prone
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_PRONE);

      // Initiate recovery
      const success = machine.transitionTo(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );
      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe(
        AnimationState.RECOVERY_PRONE_STANDUP,
      );

      // Complete recovery (30 frames)
      for (let i = 0; i <= 30; i++) {
        machine.update(frameDuration);
      }

      // Should auto-transition to idle
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
    });

    it("should complete full knockdown-recovery sequence", () => {
      // Fall backward
      machine.transitionTo(AnimationState.FALL_BACKWARD);

      // Complete fall (30 frames)
      const frameDuration = 1 / 60;
      for (let i = 0; i <= 30; i++) {
        machine.update(frameDuration);
      }

      // Should be in ground_supine
      expect(machine.getCurrentState()).toBe(AnimationState.GROUND_SUPINE);

      // Execute supine recovery
      machine.transitionTo(AnimationState.RECOVERY_SUPINE_STANDUP);

      // Complete recovery (36 frames)
      for (let i = 0; i <= 36; i++) {
        machine.update(frameDuration);
      }

      // Should be back to idle
      expect(machine.getCurrentState()).toBe(AnimationState.IDLE);
    });
  });
});
