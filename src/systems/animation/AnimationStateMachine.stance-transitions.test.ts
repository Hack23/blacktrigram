/**
 * Tests for AnimationStateMachine stance transition integration
 * 
 * Validates the integration of the 64-transition matrix with the animation
 * state machine, including keyframe interpolation and blend weight calculations.
 * 
 * @module systems/animation/AnimationStateMachine.stance-transitions.test
 * @category Testing
 * @korean 자세전환애니메이션상태머신테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import { PlayerAnimationStateMachine, DEFAULT_ANIMATION_CONFIGS } from "./AnimationStateMachine";
import { TrigramStance } from "../../types/common";
import { initializeStanceTransitions } from "./AnimationTransitions";

describe("AnimationStateMachine - Stance Transition Integration", () => {
  let machine: PlayerAnimationStateMachine;

  beforeEach(() => {
    // Ensure transitions are initialized
    initializeStanceTransitions();
    
    // Create fresh machine instance
    machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
  });

  describe("transitionToStanceChange", () => {
    it("should successfully start stance transition with valid stances", () => {
      const success = machine.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.TAE
      );

      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("stance_change");
    });

    it("should store transition data during stance_change", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const transitionData = machine.getCurrentStanceTransition();
      expect(transitionData).not.toBeNull();
      expect(transitionData?.from).toBe(TrigramStance.GEON);
      expect(transitionData?.to).toBe(TrigramStance.TAE);
      expect(transitionData?.duration).toBe(600);
    });

    it("should handle self-transitions (same stance)", () => {
      const success = machine.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.GEON
      );

      expect(success).toBe(true);
      const transitionData = machine.getCurrentStanceTransition();
      expect(transitionData?.type).toBe("self");
      expect(transitionData?.duration).toBe(0);
    });

    it("should handle all 64 stance transitions", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];

      for (const from of stances) {
        for (const to of stances) {
          // Reset machine
          machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS);
          
          const success = machine.transitionToStanceChange(from, to);
          expect(success).toBe(true);
          
          const transitionData = machine.getCurrentStanceTransition();
          expect(transitionData).not.toBeNull();
          expect(transitionData?.from).toBe(from);
          expect(transitionData?.to).toBe(to);
        }
      }
    });
  });

  describe("getCurrentStanceTransition", () => {
    it("should return null when not in stance transition", () => {
      expect(machine.getCurrentStanceTransition()).toBeNull();
    });

    it("should return transition data during stance_change", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const transitionData = machine.getCurrentStanceTransition();
      expect(transitionData).not.toBeNull();
      expect(transitionData?.keyframes.length).toBeGreaterThan(0);
    });

    it("should return null after transition completes", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      // Update through entire animation (600ms = 0.6s)
      for (let i = 0; i < 40; i++) {
        machine.update(1 / 60); // 60fps updates
      }

      expect(machine.getCurrentStanceTransition()).toBeNull();
    });
  });

  describe("getStanceTransitionBlend", () => {
    it("should return null when not in stance transition", () => {
      expect(machine.getStanceTransitionBlend()).toBeNull();
    });

    it("should return blend data during stance_change", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const blend = machine.getStanceTransitionBlend();
      expect(blend).not.toBeNull();
      expect(blend?.frame).toBe(0);
      expect(blend?.blend).toBeGreaterThanOrEqual(0);
      expect(blend?.blend).toBeLessThanOrEqual(1);
    });

    it("should interpolate blend weights between keyframes", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      // Update a few frames
      machine.update(1 / 60);
      machine.update(1 / 60);
      machine.update(1 / 60);

      const blend = machine.getStanceTransitionBlend();
      expect(blend).not.toBeNull();
      expect(blend?.frame).toBeGreaterThan(0);
    });

    it("should start at frame 0 with source stance", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const blend = machine.getStanceTransitionBlend();
      expect(blend?.frame).toBe(0);
      expect(blend?.stance).toBe(TrigramStance.GEON);
    });

    it("should end at frame 36 with target stance", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      // Update through most of animation (not to completion)
      for (let i = 0; i < 35; i++) {
        machine.update(1 / 60);
      }

      const blend = machine.getStanceTransitionBlend();
      expect(blend?.frame).toBe(35);
      expect(blend?.stance).toBe(TrigramStance.TAE);
      
      // One more update to reach frame 36
      machine.update(1 / 60);
      const finalBlend = machine.getStanceTransitionBlend();
      
      // At frame 36, we should still have blend data or it may have completed
      if (finalBlend) {
        expect(finalBlend.frame).toBe(36);
        expect(finalBlend.stance).toBe(TrigramStance.TAE);
      }
    });

    it("should have valid blend weights throughout animation", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      // Check blend weights at multiple points
      for (let i = 0; i < 36; i++) {
        const blend = machine.getStanceTransitionBlend();
        expect(blend?.blend).toBeGreaterThanOrEqual(0);
        expect(blend?.blend).toBeLessThanOrEqual(1);
        machine.update(1 / 60);
      }
    });

    it("should include neutral stance in keyframes for indirect transitions", () => {
      // Opposite stances use neutral position
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.SON);

      let foundNeutral = false;
      
      // Check all frames
      for (let i = 0; i < 36; i++) {
        const blend = machine.getStanceTransitionBlend();
        if (blend?.stance === 'neutral') {
          foundNeutral = true;
          break;
        }
        machine.update(1 / 60);
      }

      expect(foundNeutral).toBe(true);
    });
  });

  describe("isInStanceTransition", () => {
    it("should return false when not in transition", () => {
      expect(machine.isInStanceTransition()).toBe(false);
    });

    it("should return true during stance_change animation", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);
      expect(machine.isInStanceTransition()).toBe(true);
    });

    it("should return false after transition completes", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      // Complete animation
      for (let i = 0; i < 40; i++) {
        machine.update(1 / 60);
      }

      expect(machine.isInStanceTransition()).toBe(false);
    });

    it("should return false if transition is interrupted", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);
      expect(machine.isInStanceTransition()).toBe(true);

      // Interrupt with hit animation (higher priority)
      machine.transitionTo("hit");
      expect(machine.isInStanceTransition()).toBe(false);
    });
  });

  describe("Transition Cleanup", () => {
    it("should clear transition data on completion", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);
      expect(machine.getCurrentStanceTransition()).not.toBeNull();

      // Complete animation
      for (let i = 0; i < 40; i++) {
        machine.update(1 / 60);
      }

      expect(machine.getCurrentStanceTransition()).toBeNull();
    });

    it("should clear transition data on interruption", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);
      expect(machine.getCurrentStanceTransition()).not.toBeNull();

      // Interrupt
      machine.transitionTo("hit");
      expect(machine.getCurrentStanceTransition()).toBeNull();
    });

    it("should handle rapid stance changes", () => {
      // Start first transition
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);
      const firstTransition = machine.getCurrentStanceTransition();
      expect(firstTransition?.from).toBe(TrigramStance.GEON);

      // Update a few frames
      machine.update(1 / 60);
      machine.update(1 / 60);

      // Try to start new stance change (should be blocked - stance_change is non-interruptible)
      const success = machine.transitionToStanceChange(
        TrigramStance.TAE,
        TrigramStance.LI
      );
      
      // Should fail because stance_change is non-interruptible
      expect(success).toBe(false);
      
      // Should still have original transition (it hasn't been cleared)
      const currentTransition = machine.getCurrentStanceTransition();
      expect(currentTransition).not.toBeNull();
      if (currentTransition) {
        expect(currentTransition.from).toBe(TrigramStance.GEON);
        expect(currentTransition.to).toBe(TrigramStance.TAE);
      }
    });
  });

  describe("Integration with Guard Poses", () => {
    it("should transition from guard to stance_change", () => {
      // Start in a guard pose
      machine.transitionToStanceGuard(TrigramStance.GEON);
      expect(machine.isInStanceGuard()).toBe(true);

      // Transition to new stance
      const success = machine.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.TAE
      );

      expect(success).toBe(true);
      expect(machine.getCurrentState()).toBe("stance_change");
    });

    it("should transition to target guard after stance_change completes", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      // Complete transition
      for (let i = 0; i < 40; i++) {
        machine.update(1 / 60);
      }

      // Should be in idle after completion
      expect(machine.getCurrentState()).toBe("idle");

      // Can now transition to target guard
      machine.transitionToStanceGuard(TrigramStance.TAE);
      expect(machine.isInStanceGuard()).toBe(true);
      expect(machine.getCurrentGuardStance()).toBe(TrigramStance.TAE);
    });
  });

  describe("Performance", () => {
    it("should handle rapid blend queries efficiently", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const startTime = performance.now();
      
      // Query blend 1000 times
      for (let i = 0; i < 1000; i++) {
        machine.getStanceTransitionBlend();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in less than 10ms
      expect(duration).toBeLessThan(10);
    });

    it("should handle full transition efficiently", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const startTime = performance.now();
      
      // Run through entire animation
      for (let i = 0; i < 36; i++) {
        machine.update(1 / 60);
        machine.getStanceTransitionBlend();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in less than 5ms
      expect(duration).toBeLessThan(5);
    });
  });

  describe("Transition Types", () => {
    it("should handle direct transitions (adjacent stances)", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.TAE);

      const transitionData = machine.getCurrentStanceTransition();
      expect(transitionData?.type).toBe("direct");
    });

    it("should handle indirect transitions (opposite stances)", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.SON);

      const transitionData = machine.getCurrentStanceTransition();
      expect(transitionData?.type).toBe("indirect");
    });

    it("should handle self transitions", () => {
      machine.transitionToStanceChange(TrigramStance.GEON, TrigramStance.GEON);

      const transitionData = machine.getCurrentStanceTransition();
      expect(transitionData?.type).toBe("self");
      expect(transitionData?.duration).toBe(0);
    });
  });
});
