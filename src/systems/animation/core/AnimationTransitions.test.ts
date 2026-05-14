/**
 * Unit tests for AnimationTransitions system
 *
 * Tests transition rules and validation logic.
 */

import { describe, expect, it } from "vitest";
import {
  buildTransitionMap,
  DEFAULT_TRANSITIONS,
  getValidTransitions,
  isTransitionAllowed,
} from "./AnimationTransitions";
import { AnimationState } from "./types";

describe("AnimationTransitions", () => {
  describe("isTransitionAllowed", () => {
    it("should allow same state transitions", () => {
      const states: AnimationState[] = [
        AnimationState.IDLE,
        AnimationState.WALK,
        AnimationState.RUN,
        AnimationState.ATTACK,
        AnimationState.DEFEND,
        AnimationState.HIT,
        AnimationState.STANCE_CHANGE,
        AnimationState.KO,
      ];

      states.forEach((state) => {
        expect(isTransitionAllowed(state, state)).toBe(true);
      });
    });

    it("should allow valid transitions from idle", () => {
      expect(
        isTransitionAllowed(AnimationState.IDLE, AnimationState.WALK),
      ).toBe(true);
      expect(isTransitionAllowed(AnimationState.IDLE, AnimationState.RUN)).toBe(
        true,
      );
      expect(
        isTransitionAllowed(AnimationState.IDLE, AnimationState.ATTACK),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.IDLE, AnimationState.DEFEND),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.IDLE, AnimationState.STANCE_CHANGE),
      ).toBe(true);
      expect(
        isTransitionAllowed(
          AnimationState.IDLE,
          AnimationState.STANCE_SIDE_SWITCH,
        ),
      ).toBe(true);
      expect(isTransitionAllowed(AnimationState.IDLE, AnimationState.HIT)).toBe(
        true,
      );
      expect(isTransitionAllowed(AnimationState.IDLE, AnimationState.KO)).toBe(
        true,
      );
    });

    it("should allow valid transitions from walk", () => {
      expect(
        isTransitionAllowed(AnimationState.WALK, AnimationState.IDLE),
      ).toBe(true);
      expect(isTransitionAllowed(AnimationState.WALK, AnimationState.RUN)).toBe(
        true,
      );
      expect(
        isTransitionAllowed(AnimationState.WALK, AnimationState.ATTACK),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.WALK, AnimationState.DEFEND),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.WALK, AnimationState.STANCE_CHANGE),
      ).toBe(true);
      expect(
        isTransitionAllowed(
          AnimationState.WALK,
          AnimationState.STANCE_SIDE_SWITCH,
        ),
      ).toBe(true);
      expect(isTransitionAllowed(AnimationState.WALK, AnimationState.HIT)).toBe(
        true,
      );
      expect(isTransitionAllowed(AnimationState.WALK, AnimationState.KO)).toBe(
        true,
      );
    });

    it("should allow valid transitions from attack", () => {
      expect(
        isTransitionAllowed(AnimationState.ATTACK, AnimationState.IDLE),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.ATTACK, AnimationState.HIT),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.ATTACK, AnimationState.KO),
      ).toBe(true);
    });

    it("should not allow invalid transitions from attack", () => {
      expect(
        isTransitionAllowed(AnimationState.ATTACK, AnimationState.WALK),
      ).toBe(false);
      expect(
        isTransitionAllowed(AnimationState.ATTACK, AnimationState.RUN),
      ).toBe(false);
      expect(
        isTransitionAllowed(AnimationState.ATTACK, AnimationState.DEFEND),
      ).toBe(false);
      expect(
        isTransitionAllowed(
          AnimationState.ATTACK,
          AnimationState.STANCE_CHANGE,
        ),
      ).toBe(false);
    });

    it("should allow valid transitions from hit", () => {
      expect(isTransitionAllowed(AnimationState.HIT, AnimationState.IDLE)).toBe(
        true,
      );
      expect(isTransitionAllowed(AnimationState.HIT, AnimationState.HIT)).toBe(
        true,
      );
      expect(isTransitionAllowed(AnimationState.HIT, AnimationState.KO)).toBe(
        true,
      );
    });

    it("should not allow transitions from ko (terminal state)", () => {
      expect(isTransitionAllowed(AnimationState.KO, AnimationState.IDLE)).toBe(
        false,
      );
      expect(isTransitionAllowed(AnimationState.KO, AnimationState.WALK)).toBe(
        false,
      );
      expect(
        isTransitionAllowed(AnimationState.KO, AnimationState.ATTACK),
      ).toBe(false);
      expect(isTransitionAllowed(AnimationState.KO, AnimationState.HIT)).toBe(
        false,
      );
    });

    it("should allow defend to transition back to idle or to hit", () => {
      expect(
        isTransitionAllowed(AnimationState.DEFEND, AnimationState.IDLE),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.DEFEND, AnimationState.WALK),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.DEFEND, AnimationState.HIT),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.DEFEND, AnimationState.KO),
      ).toBe(true);
    });

    it("should allow stance_change to transition back to idle or to hit", () => {
      expect(
        isTransitionAllowed(AnimationState.STANCE_CHANGE, AnimationState.IDLE),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.STANCE_CHANGE, AnimationState.HIT),
      ).toBe(true);
      expect(
        isTransitionAllowed(AnimationState.STANCE_CHANGE, AnimationState.KO),
      ).toBe(true);
    });

    it("should allow stance side switch from locomotion and back to idle", () => {
      expect(
        isTransitionAllowed(
          AnimationState.IDLE,
          AnimationState.STANCE_SIDE_SWITCH,
        ),
      ).toBe(true);
      expect(
        isTransitionAllowed(
          AnimationState.WALK,
          AnimationState.STANCE_SIDE_SWITCH,
        ),
      ).toBe(true);
      expect(
        isTransitionAllowed(
          AnimationState.RUN,
          AnimationState.STANCE_SIDE_SWITCH,
        ),
      ).toBe(true);
      expect(
        isTransitionAllowed(
          AnimationState.STANCE_SIDE_SWITCH,
          AnimationState.IDLE,
        ),
      ).toBe(true);
    });
  });

  describe("getValidTransitions", () => {
    it("should return all valid transitions from idle", () => {
      const valid = getValidTransitions(AnimationState.IDLE);
      expect(valid).toContain(AnimationState.WALK);
      expect(valid).toContain(AnimationState.RUN);
      expect(valid).toContain(AnimationState.ATTACK);
      expect(valid).toContain(AnimationState.DEFEND);
      expect(valid).toContain(AnimationState.STANCE_CHANGE);
      expect(valid).toContain(AnimationState.STANCE_SIDE_SWITCH);
      expect(valid).toContain(AnimationState.HIT);
      expect(valid).toContain(AnimationState.KO);
      expect(valid.length).toBeGreaterThan(0);
    });

    it("should return limited transitions from attack", () => {
      const valid = getValidTransitions(AnimationState.ATTACK);
      expect(valid).toContain(AnimationState.IDLE);
      expect(valid).toContain(AnimationState.HIT);
      expect(valid).toContain(AnimationState.KO);
      expect(valid).not.toContain(AnimationState.WALK);
      expect(valid).not.toContain(AnimationState.RUN);
    });

    it("should return empty array for ko (terminal state)", () => {
      const valid = getValidTransitions(AnimationState.KO);
      expect(valid).toEqual([]);
    });

    it("should return valid transitions from walk", () => {
      const valid = getValidTransitions(AnimationState.WALK);
      expect(valid.length).toBeGreaterThan(0);
      expect(valid).toContain(AnimationState.IDLE);
      expect(valid).toContain(AnimationState.RUN);
    });
  });

  describe("buildTransitionMap", () => {
    it("should build a valid transition map", () => {
      const map = buildTransitionMap();
      expect(map).toBeInstanceOf(Map);
      expect(map.size).toBeGreaterThan(0);
    });

    it("should have entries for all non-terminal states", () => {
      const map = buildTransitionMap();
      expect(map.has(AnimationState.IDLE)).toBe(true);
      expect(map.has(AnimationState.WALK)).toBe(true);
      expect(map.has(AnimationState.RUN)).toBe(true);
      expect(map.has(AnimationState.ATTACK)).toBe(true);
      expect(map.has(AnimationState.DEFEND)).toBe(true);
      expect(map.has(AnimationState.HIT)).toBe(true);
      expect(map.has(AnimationState.STANCE_CHANGE)).toBe(true);
    });

    it("should have correct transitions for idle", () => {
      const map = buildTransitionMap();
      const idleTransitions = map.get(AnimationState.IDLE);
      expect(idleTransitions).toBeDefined();
      expect(idleTransitions?.has(AnimationState.WALK)).toBe(true);
      expect(idleTransitions?.has(AnimationState.RUN)).toBe(true);
      expect(idleTransitions?.has(AnimationState.ATTACK)).toBe(true);
    });

    it("should not have transitions from ko (terminal state)", () => {
      const map = buildTransitionMap();
      const koTransitions = map.get(AnimationState.KO);
      expect(koTransitions).toBeUndefined();
    });

    it("should build map with custom transitions", () => {
      const customTransitions = [
        { from: AnimationState.IDLE, to: AnimationState.WALK, allowed: true },
        { from: AnimationState.WALK, to: AnimationState.IDLE, allowed: true },
      ];
      const map = buildTransitionMap(customTransitions);
      expect(map.size).toBe(2);
      expect(map.get(AnimationState.IDLE)?.has(AnimationState.WALK)).toBe(true);
      expect(map.get(AnimationState.WALK)?.has(AnimationState.IDLE)).toBe(true);
    });
  });

  describe("DEFAULT_TRANSITIONS", () => {
    it("should be defined and be an array", () => {
      expect(DEFAULT_TRANSITIONS).toBeDefined();
      expect(Array.isArray(DEFAULT_TRANSITIONS)).toBe(true);
    });

    it("should have multiple transition rules", () => {
      expect(DEFAULT_TRANSITIONS.length).toBeGreaterThan(20);
    });

    it("should have transitions for all major states", () => {
      const fromStates = new Set(DEFAULT_TRANSITIONS.map((t) => t.from));
      expect(fromStates.has(AnimationState.IDLE)).toBe(true);
      expect(fromStates.has(AnimationState.WALK)).toBe(true);
      expect(fromStates.has(AnimationState.ATTACK)).toBe(true);
      expect(fromStates.has(AnimationState.DEFEND)).toBe(true);
      expect(fromStates.has(AnimationState.HIT)).toBe(true);
    });
  });
});
