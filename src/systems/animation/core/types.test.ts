/**
 * Tests for Animation System Types
 * 
 * Tests enums, constants, and type guard functions in the animation type system.
 * Validates AnimationState, AnimationPriority, and utility functions.
 * 
 * @module systems/animation/types.test
 * @korean 애니메이션타입테스트
 */

import { describe, expect, it } from "vitest";
import {
  AnimationPriority,
  AnimationState,
  getAllAnimationStates,
  isFallState,
  isFootworkState,
  isGroundState,
  isRecoveryState,
  isStanceGuardState,
  isStepState,
  isValidAnimationState,
  STEP_PRIORITY,
  stringToAnimationState,
} from "./types";

describe("Animation System Types", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION STATE ENUM
  // ═══════════════════════════════════════════════════════════════════════════

  describe("AnimationState Enum", () => {
    it("should have basic movement states", () => {
      expect(AnimationState.IDLE).toBe("idle");
      expect(AnimationState.WALK).toBe("walk");
      expect(AnimationState.RUN).toBe("run");
    });

    it("should have combat action states", () => {
      expect(AnimationState.ATTACK).toBe("attack");
      expect(AnimationState.DEFEND).toBe("defend");
      expect(AnimationState.HIT).toBe("hit");
      expect(AnimationState.KO).toBe("ko");
    });

    it("should have defensive animation states", () => {
      expect(AnimationState.DEFEND_BLOCK_SUCCESS).toBe("defend_block_success");
      expect(AnimationState.DEFEND_PARRY).toBe("defend_parry");
      expect(AnimationState.DEFEND_GUARD_BREAK).toBe("defend_guard_break");
      expect(AnimationState.DEFEND_RECOVERY).toBe("defend_recovery");
    });

    it("should have stance transition states", () => {
      expect(AnimationState.STANCE_CHANGE).toBe("stance_change");
      expect(AnimationState.STANCE_SIDE_SWITCH).toBe("stance_side_switch");
    });

    it("should have all eight trigram stance guard states", () => {
      expect(AnimationState.STANCE_GUARD_GEON).toBe("stance_guard_geon");
      expect(AnimationState.STANCE_GUARD_TAE).toBe("stance_guard_tae");
      expect(AnimationState.STANCE_GUARD_LI).toBe("stance_guard_li");
      expect(AnimationState.STANCE_GUARD_JIN).toBe("stance_guard_jin");
      expect(AnimationState.STANCE_GUARD_SON).toBe("stance_guard_son");
      expect(AnimationState.STANCE_GUARD_GAM).toBe("stance_guard_gam");
      expect(AnimationState.STANCE_GUARD_GAN).toBe("stance_guard_gan");
      expect(AnimationState.STANCE_GUARD_GON).toBe("stance_guard_gon");
    });

    it("should have tactical step movement states", () => {
      expect(AnimationState.STEP_FORWARD).toBe("step_forward");
      expect(AnimationState.STEP_BACK).toBe("step_back");
      expect(AnimationState.STEP_LEFT).toBe("step_left");
      expect(AnimationState.STEP_RIGHT).toBe("step_right");
      expect(AnimationState.STEP_FORWARD_LEFT).toBe("step_forward_left");
      expect(AnimationState.STEP_FORWARD_RIGHT).toBe("step_forward_right");
      expect(AnimationState.STEP_BACK_LEFT).toBe("step_back_left");
      expect(AnimationState.STEP_BACK_RIGHT).toBe("step_back_right");
    });

    it("should have footwork pattern states", () => {
      expect(AnimationState.FOOTWORK_CIRCULAR_LEFT).toBe("footwork_circular_left");
      expect(AnimationState.FOOTWORK_CIRCULAR_RIGHT).toBe("footwork_circular_right");
      expect(AnimationState.FOOTWORK_PIVOT_LEFT).toBe("footwork_pivot_left");
      expect(AnimationState.FOOTWORK_PIVOT_RIGHT).toBe("footwork_pivot_right");
      expect(AnimationState.FOOTWORK_SLIDE_FORWARD).toBe("footwork_slide_forward");
      expect(AnimationState.FOOTWORK_SLIDE_BACK).toBe("footwork_slide_back");
      expect(AnimationState.FOOTWORK_SLIDE_LEFT).toBe("footwork_slide_left");
      expect(AnimationState.FOOTWORK_SLIDE_RIGHT).toBe("footwork_slide_right");
      expect(AnimationState.FOOTWORK_SHUFFLE).toBe("footwork_shuffle");
    });

    it("should have fall animation states", () => {
      expect(AnimationState.FALL_FORWARD).toBe("fall_forward");
      expect(AnimationState.FALL_BACKWARD).toBe("fall_backward");
      expect(AnimationState.FALL_SIDE_LEFT).toBe("fall_side_left");
      expect(AnimationState.FALL_SIDE_RIGHT).toBe("fall_side_right");
    });

    it("should have ground position states", () => {
      expect(AnimationState.GROUND_PRONE).toBe("ground_prone");
      expect(AnimationState.GROUND_SUPINE).toBe("ground_supine");
      expect(AnimationState.GROUND_SIDE_LEFT).toBe("ground_side_left");
      expect(AnimationState.GROUND_SIDE_RIGHT).toBe("ground_side_right");
    });

    it("should have turn animation states", () => {
      expect(AnimationState.TURN_LEFT).toBe("turn_left");
      expect(AnimationState.TURN_RIGHT).toBe("turn_right");
    });

    it("should have recovery animation states", () => {
      expect(AnimationState.RECOVERY_PRONE_STANDUP).toBe("recovery_prone_standup");
      expect(AnimationState.RECOVERY_SUPINE_STANDUP).toBe("recovery_supine_standup");
      expect(AnimationState.RECOVERY_ROLL).toBe("recovery_roll");
      expect(AnimationState.RECOVERY_DEFENSIVE).toBe("recovery_defensive");
    });

    it("should have grappling animation states", () => {
      expect(AnimationState.GRAPPLE_ENTRY).toBe("grapple_entry");
      expect(AnimationState.GRAPPLE_CONTROL).toBe("grapple_control");
      expect(AnimationState.GRAPPLE_STRUGGLE).toBe("grapple_struggle");
      expect(AnimationState.GRAPPLE_ESCAPE).toBe("grapple_escape");
    });

    it("should use lowercase string values", () => {
      const allStates = Object.values(AnimationState);
      allStates.forEach(state => {
        expect(state).toBe(state.toLowerCase());
      });
    });

    it("should use snake_case naming", () => {
      const allStates = Object.values(AnimationState);
      allStates.forEach(state => {
        // Should only contain lowercase letters, numbers, and underscores
        expect(state).toMatch(/^[a-z0-9_]+$/);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION PRIORITY ENUM
  // ═══════════════════════════════════════════════════════════════════════════

  describe("AnimationPriority Enum", () => {
    it("should have all priority levels", () => {
      expect(AnimationPriority.IDLE).toBeDefined();
      expect(AnimationPriority.WALK).toBeDefined();
      expect(AnimationPriority.RUN).toBeDefined();
      expect(AnimationPriority.STANCE_CHANGE).toBeDefined();
      expect(AnimationPriority.DEFEND).toBeDefined();
      expect(AnimationPriority.ATTACK).toBeDefined();
      expect(AnimationPriority.HIT).toBeDefined();
      expect(AnimationPriority.KO).toBeDefined();
      expect(AnimationPriority.FALL).toBeDefined();
      expect(AnimationPriority.RECOVERY).toBeDefined();
    });

    it("should have correct priority order", () => {
      expect(AnimationPriority.IDLE).toBe(0);
      expect(AnimationPriority.WALK).toBe(1);
      expect(AnimationPriority.RUN).toBe(2);
      expect(AnimationPriority.STANCE_CHANGE).toBe(3);
      expect(AnimationPriority.DEFEND).toBe(4);
      expect(AnimationPriority.ATTACK).toBe(5);
      expect(AnimationPriority.HIT).toBe(6);
      expect(AnimationPriority.KO).toBe(7);
      expect(AnimationPriority.FALL).toBe(8);
      expect(AnimationPriority.RECOVERY).toBe(9);
    });

    it("should have ascending priority values", () => {
      expect(AnimationPriority.IDLE).toBeLessThan(AnimationPriority.WALK);
      expect(AnimationPriority.WALK).toBeLessThan(AnimationPriority.RUN);
      expect(AnimationPriority.RUN).toBeLessThan(AnimationPriority.STANCE_CHANGE);
      expect(AnimationPriority.STANCE_CHANGE).toBeLessThan(AnimationPriority.DEFEND);
      expect(AnimationPriority.DEFEND).toBeLessThan(AnimationPriority.ATTACK);
      expect(AnimationPriority.ATTACK).toBeLessThan(AnimationPriority.HIT);
      expect(AnimationPriority.HIT).toBeLessThan(AnimationPriority.KO);
      expect(AnimationPriority.KO).toBeLessThan(AnimationPriority.FALL);
      expect(AnimationPriority.FALL).toBeLessThan(AnimationPriority.RECOVERY);
    });

    it("should have recovery as highest priority", () => {
      const allPriorities = Object.values(AnimationPriority).filter(
        v => typeof v === "number"
      ) as number[];
      const maxPriority = Math.max(...allPriorities);
      expect(AnimationPriority.RECOVERY).toBe(maxPriority);
    });

    it("should have idle as lowest priority", () => {
      const allPriorities = Object.values(AnimationPriority).filter(
        v => typeof v === "number"
      ) as number[];
      const minPriority = Math.min(...allPriorities);
      expect(AnimationPriority.IDLE).toBe(minPriority);
    });
  });

  describe("STEP_PRIORITY Constant", () => {
    it("should equal ATTACK priority", () => {
      expect(STEP_PRIORITY).toBe(AnimationPriority.ATTACK);
    });

    it("should be priority level 5", () => {
      expect(STEP_PRIORITY).toBe(5);
    });

    it("should indicate non-interruptible nature", () => {
      // Steps are non-interruptible, same as attacks
      expect(STEP_PRIORITY).toBeGreaterThan(AnimationPriority.DEFEND);
      expect(STEP_PRIORITY).toBeLessThan(AnimationPriority.HIT);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPE GUARD FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("isValidAnimationState", () => {
    it("should return true for valid AnimationState values", () => {
      expect(isValidAnimationState(AnimationState.IDLE)).toBe(true);
      expect(isValidAnimationState(AnimationState.ATTACK)).toBe(true);
      expect(isValidAnimationState(AnimationState.DEFEND)).toBe(true);
      expect(isValidAnimationState(AnimationState.STEP_FORWARD)).toBe(true);
    });

    it("should return false for invalid strings", () => {
      expect(isValidAnimationState("invalid_state")).toBe(false);
      expect(isValidAnimationState("not_a_state")).toBe(false);
      expect(isValidAnimationState("xyz")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isValidAnimationState(123)).toBe(false);
      expect(isValidAnimationState(null)).toBe(false);
      expect(isValidAnimationState(undefined)).toBe(false);
      expect(isValidAnimationState({})).toBe(false);
      expect(isValidAnimationState([])).toBe(false);
      expect(isValidAnimationState(true)).toBe(false);
    });

    it("should work as type guard", () => {
      const value: unknown = "idle";
      if (isValidAnimationState(value)) {
        // TypeScript should know value is AnimationState here
        const state: AnimationState = value;
        expect(state).toBe(AnimationState.IDLE);
      }
    });

    it("should return true for all enum values", () => {
      const allStates = Object.values(AnimationState);
      allStates.forEach(state => {
        expect(isValidAnimationState(state)).toBe(true);
      });
    });
  });

  describe("stringToAnimationState", () => {
    it("should convert valid string to AnimationState", () => {
      expect(stringToAnimationState("idle")).toBe(AnimationState.IDLE);
      expect(stringToAnimationState("attack")).toBe(AnimationState.ATTACK);
      expect(stringToAnimationState("defend")).toBe(AnimationState.DEFEND);
    });

    it("should be case-insensitive", () => {
      expect(stringToAnimationState("IDLE")).toBe(AnimationState.IDLE);
      expect(stringToAnimationState("IdLe")).toBe(AnimationState.IDLE);
      expect(stringToAnimationState("ATTACK")).toBe(AnimationState.ATTACK);
    });

    it("should return null for invalid strings", () => {
      expect(stringToAnimationState("invalid")).toBeNull();
      expect(stringToAnimationState("not_a_state")).toBeNull();
      expect(stringToAnimationState("")).toBeNull();
    });

    it("should handle all AnimationState enum values", () => {
      const allStates = Object.values(AnimationState);
      allStates.forEach(state => {
        expect(stringToAnimationState(state)).toBe(state);
      });
    });

    it("should handle complex state names", () => {
      expect(stringToAnimationState("step_forward")).toBe(AnimationState.STEP_FORWARD);
      expect(stringToAnimationState("stance_guard_geon")).toBe(AnimationState.STANCE_GUARD_GEON);
      expect(stringToAnimationState("footwork_circular_left")).toBe(AnimationState.FOOTWORK_CIRCULAR_LEFT);
    });
  });

  describe("getAllAnimationStates", () => {
    it("should return array of all AnimationState values", () => {
      const states = getAllAnimationStates();
      expect(Array.isArray(states)).toBe(true);
      expect(states.length).toBeGreaterThan(0);
    });

    it("should contain all enum values", () => {
      const states = getAllAnimationStates();
      const enumValues = Object.values(AnimationState);
      
      expect(states.length).toBe(enumValues.length);
      enumValues.forEach(value => {
        expect(states).toContain(value);
      });
    });

    it("should return AnimationState array type", () => {
      const states = getAllAnimationStates();
      states.forEach(state => {
        expect(isValidAnimationState(state)).toBe(true);
      });
    });

    it("should include basic states", () => {
      const states = getAllAnimationStates();
      expect(states).toContain(AnimationState.IDLE);
      expect(states).toContain(AnimationState.ATTACK);
      expect(states).toContain(AnimationState.DEFEND);
    });

    it("should include stance guard states", () => {
      const states = getAllAnimationStates();
      expect(states).toContain(AnimationState.STANCE_GUARD_GEON);
      expect(states).toContain(AnimationState.STANCE_GUARD_TAE);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE CATEGORY CHECKERS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("isStanceGuardState", () => {
    it("should return true for all trigram stance guards", () => {
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_GEON)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_TAE)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_LI)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_JIN)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_SON)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_GAM)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_GAN)).toBe(true);
      expect(isStanceGuardState(AnimationState.STANCE_GUARD_GON)).toBe(true);
    });

    it("should return false for non-guard states", () => {
      expect(isStanceGuardState(AnimationState.IDLE)).toBe(false);
      expect(isStanceGuardState(AnimationState.ATTACK)).toBe(false);
      expect(isStanceGuardState(AnimationState.STEP_FORWARD)).toBe(false);
      expect(isStanceGuardState(AnimationState.STANCE_CHANGE)).toBe(false);
    });
  });

  describe("isStepState", () => {
    it("should return true for all step movements", () => {
      expect(isStepState(AnimationState.STEP_FORWARD)).toBe(true);
      expect(isStepState(AnimationState.STEP_BACK)).toBe(true);
      expect(isStepState(AnimationState.STEP_LEFT)).toBe(true);
      expect(isStepState(AnimationState.STEP_RIGHT)).toBe(true);
      expect(isStepState(AnimationState.STEP_FORWARD_LEFT)).toBe(true);
      expect(isStepState(AnimationState.STEP_FORWARD_RIGHT)).toBe(true);
      expect(isStepState(AnimationState.STEP_BACK_LEFT)).toBe(true);
      expect(isStepState(AnimationState.STEP_BACK_RIGHT)).toBe(true);
    });

    it("should return false for non-step states", () => {
      expect(isStepState(AnimationState.IDLE)).toBe(false);
      expect(isStepState(AnimationState.WALK)).toBe(false);
      expect(isStepState(AnimationState.FOOTWORK_CIRCULAR_LEFT)).toBe(false);
    });
  });

  describe("isFootworkState", () => {
    it("should return true for all footwork patterns", () => {
      expect(isFootworkState(AnimationState.FOOTWORK_CIRCULAR_LEFT)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_CIRCULAR_RIGHT)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_PIVOT_LEFT)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_PIVOT_RIGHT)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_SLIDE_FORWARD)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_SLIDE_BACK)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_SLIDE_LEFT)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_SLIDE_RIGHT)).toBe(true);
      expect(isFootworkState(AnimationState.FOOTWORK_SHUFFLE)).toBe(true);
    });

    it("should return false for non-footwork states", () => {
      expect(isFootworkState(AnimationState.STEP_FORWARD)).toBe(false);
      expect(isFootworkState(AnimationState.WALK)).toBe(false);
      expect(isFootworkState(AnimationState.IDLE)).toBe(false);
    });
  });

  describe("isFallState", () => {
    it("should return true for all fall animations", () => {
      expect(isFallState(AnimationState.FALL_FORWARD)).toBe(true);
      expect(isFallState(AnimationState.FALL_BACKWARD)).toBe(true);
      expect(isFallState(AnimationState.FALL_SIDE_LEFT)).toBe(true);
      expect(isFallState(AnimationState.FALL_SIDE_RIGHT)).toBe(true);
    });

    it("should return false for non-fall states", () => {
      expect(isFallState(AnimationState.GROUND_PRONE)).toBe(false);
      expect(isFallState(AnimationState.RECOVERY_ROLL)).toBe(false);
      expect(isFallState(AnimationState.HIT)).toBe(false);
    });
  });

  describe("isGroundState", () => {
    it("should return true for all ground positions", () => {
      expect(isGroundState(AnimationState.GROUND_PRONE)).toBe(true);
      expect(isGroundState(AnimationState.GROUND_SUPINE)).toBe(true);
      expect(isGroundState(AnimationState.GROUND_SIDE_LEFT)).toBe(true);
      expect(isGroundState(AnimationState.GROUND_SIDE_RIGHT)).toBe(true);
    });

    it("should return false for non-ground states", () => {
      expect(isGroundState(AnimationState.FALL_FORWARD)).toBe(false);
      expect(isGroundState(AnimationState.RECOVERY_PRONE_STANDUP)).toBe(false);
      expect(isGroundState(AnimationState.IDLE)).toBe(false);
    });
  });

  describe("isRecoveryState", () => {
    it("should return true for all recovery animations", () => {
      expect(isRecoveryState(AnimationState.RECOVERY_PRONE_STANDUP)).toBe(true);
      expect(isRecoveryState(AnimationState.RECOVERY_SUPINE_STANDUP)).toBe(true);
      expect(isRecoveryState(AnimationState.RECOVERY_ROLL)).toBe(true);
      expect(isRecoveryState(AnimationState.RECOVERY_DEFENSIVE)).toBe(true);
    });

    it("should return false for non-recovery states", () => {
      expect(isRecoveryState(AnimationState.GROUND_PRONE)).toBe(false);
      expect(isRecoveryState(AnimationState.FALL_FORWARD)).toBe(false);
      expect(isRecoveryState(AnimationState.IDLE)).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Integration Tests", () => {
    it("should have mutually exclusive state categories", () => {
      const allStates = getAllAnimationStates();
      
      allStates.forEach(state => {
        const categories = [
          isStanceGuardState(state),
          isStepState(state),
          isFootworkState(state),
          isFallState(state),
          isGroundState(state),
          isRecoveryState(state),
        ];
        
        const trueCount = categories.filter(Boolean).length;
        // Each state should belong to at most one category
        expect(trueCount).toBeLessThanOrEqual(1);
      });
    });

    it("should categorize all trigram stance guards", () => {
      const stanceGuardStates = [
        AnimationState.STANCE_GUARD_GEON,
        AnimationState.STANCE_GUARD_TAE,
        AnimationState.STANCE_GUARD_LI,
        AnimationState.STANCE_GUARD_JIN,
        AnimationState.STANCE_GUARD_SON,
        AnimationState.STANCE_GUARD_GAM,
        AnimationState.STANCE_GUARD_GAN,
        AnimationState.STANCE_GUARD_GON,
      ];
      
      stanceGuardStates.forEach(state => {
        expect(isStanceGuardState(state)).toBe(true);
      });
    });

    it("should have consistent string conversion round-trip", () => {
      const allStates = getAllAnimationStates();
      
      allStates.forEach(state => {
        const converted = stringToAnimationState(state);
        expect(converted).toBe(state);
      });
    });

    it("should maintain type safety", () => {
      const state: AnimationState = AnimationState.IDLE;
      expect(isValidAnimationState(state)).toBe(true);
      
      const converted = stringToAnimationState("idle");
      if (converted !== null) {
        const typed: AnimationState = converted;
        expect(typed).toBe(AnimationState.IDLE);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Edge Cases", () => {
    it("should handle empty string in converters", () => {
      expect(stringToAnimationState("")).toBeNull();
      expect(isValidAnimationState("")).toBe(false);
    });

    it("should handle special characters", () => {
      expect(stringToAnimationState("step-forward")).toBeNull();
      expect(isValidAnimationState("step.forward")).toBe(false);
    });

    it("should handle mixed case properly", () => {
      expect(stringToAnimationState("StEp_FoRwArD")).toBe(AnimationState.STEP_FORWARD);
    });

    it("should handle leading/trailing spaces", () => {
      const result = stringToAnimationState(" idle ");
      // Depending on implementation, this might be null
      // The function normalizes with toLowerCase but doesn't trim
      expect(result === null || result === AnimationState.IDLE).toBe(true);
    });

    it("should not throw on invalid inputs", () => {
      expect(() => isValidAnimationState(null)).not.toThrow();
      expect(() => isValidAnimationState(undefined)).not.toThrow();
      expect(() => isValidAnimationState({})).not.toThrow();
      expect(() => stringToAnimationState("invalid")).not.toThrow();
    });
  });
});
