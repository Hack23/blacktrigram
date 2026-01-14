/**
 * Unit tests for AnimationTransitions system
 * 
 * Tests transition rules and validation logic.
 */

import { describe, it, expect } from "vitest";
import {
  isTransitionAllowed,
  getValidTransitions,
  buildTransitionMap,
  DEFAULT_TRANSITIONS,
} from "./AnimationTransitions";
import { AnimationState } from "./types";

describe("AnimationTransitions", () => {
  describe("isTransitionAllowed", () => {
    it("should allow same state transitions", () => {
      const states: AnimationState[] = [
        "idle",
        "walk",
        "run",
        "attack",
        "defend",
        "hit",
        "stance_change",
        "ko",
      ];

      states.forEach((state) => {
        expect(isTransitionAllowed(state, state)).toBe(true);
      });
    });

    it("should allow valid transitions from idle", () => {
      expect(isTransitionAllowed("idle", "walk")).toBe(true);
      expect(isTransitionAllowed("idle", "run")).toBe(true);
      expect(isTransitionAllowed("idle", "attack")).toBe(true);
      expect(isTransitionAllowed("idle", "defend")).toBe(true);
      expect(isTransitionAllowed("idle", "stance_change")).toBe(true);
      expect(isTransitionAllowed("idle", "hit")).toBe(true);
      expect(isTransitionAllowed("idle", "ko")).toBe(true);
    });

    it("should allow valid transitions from walk", () => {
      expect(isTransitionAllowed("walk", "idle")).toBe(true);
      expect(isTransitionAllowed("walk", "run")).toBe(true);
      expect(isTransitionAllowed("walk", "attack")).toBe(true);
      expect(isTransitionAllowed("walk", "defend")).toBe(true);
      expect(isTransitionAllowed("walk", "stance_change")).toBe(true);
      expect(isTransitionAllowed("walk", "hit")).toBe(true);
      expect(isTransitionAllowed("walk", "ko")).toBe(true);
    });

    it("should allow valid transitions from attack", () => {
      expect(isTransitionAllowed("attack", "idle")).toBe(true);
      expect(isTransitionAllowed("attack", "hit")).toBe(true);
      expect(isTransitionAllowed("attack", "ko")).toBe(true);
    });

    it("should not allow invalid transitions from attack", () => {
      expect(isTransitionAllowed("attack", "walk")).toBe(false);
      expect(isTransitionAllowed("attack", "run")).toBe(false);
      expect(isTransitionAllowed("attack", "defend")).toBe(false);
      expect(isTransitionAllowed("attack", "stance_change")).toBe(false);
    });

    it("should allow valid transitions from hit", () => {
      expect(isTransitionAllowed("hit", "idle")).toBe(true);
      expect(isTransitionAllowed("hit", "hit")).toBe(true);
      expect(isTransitionAllowed("hit", "ko")).toBe(true);
    });

    it("should not allow transitions from ko (terminal state)", () => {
      expect(isTransitionAllowed("ko", "idle")).toBe(false);
      expect(isTransitionAllowed("ko", "walk")).toBe(false);
      expect(isTransitionAllowed("ko", "attack")).toBe(false);
      expect(isTransitionAllowed("ko", "hit")).toBe(false);
    });

    it("should allow defend to transition back to idle or to hit", () => {
      expect(isTransitionAllowed("defend", "idle")).toBe(true);
      expect(isTransitionAllowed("defend", "walk")).toBe(true);
      expect(isTransitionAllowed("defend", "hit")).toBe(true);
      expect(isTransitionAllowed("defend", "ko")).toBe(true);
    });

    it("should allow stance_change to transition back to idle or to hit", () => {
      expect(isTransitionAllowed("stance_change", "idle")).toBe(true);
      expect(isTransitionAllowed("stance_change", "hit")).toBe(true);
      expect(isTransitionAllowed("stance_change", "ko")).toBe(true);
    });
  });

  describe("getValidTransitions", () => {
    it("should return all valid transitions from idle", () => {
      const valid = getValidTransitions("idle");
      expect(valid).toContain("walk");
      expect(valid).toContain("run");
      expect(valid).toContain("attack");
      expect(valid).toContain("defend");
      expect(valid).toContain("stance_change");
      expect(valid).toContain("hit");
      expect(valid).toContain("ko");
      expect(valid.length).toBeGreaterThan(0);
    });

    it("should return limited transitions from attack", () => {
      const valid = getValidTransitions("attack");
      expect(valid).toContain("idle");
      expect(valid).toContain("hit");
      expect(valid).toContain("ko");
      expect(valid).not.toContain("walk");
      expect(valid).not.toContain("run");
    });

    it("should return empty array for ko (terminal state)", () => {
      const valid = getValidTransitions("ko");
      expect(valid).toEqual([]);
    });

    it("should return valid transitions from walk", () => {
      const valid = getValidTransitions("walk");
      expect(valid.length).toBeGreaterThan(0);
      expect(valid).toContain("idle");
      expect(valid).toContain("run");
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
      expect(map.has("idle")).toBe(true);
      expect(map.has("walk")).toBe(true);
      expect(map.has("run")).toBe(true);
      expect(map.has("attack")).toBe(true);
      expect(map.has("defend")).toBe(true);
      expect(map.has("hit")).toBe(true);
      expect(map.has("stance_change")).toBe(true);
    });

    it("should have correct transitions for idle", () => {
      const map = buildTransitionMap();
      const idleTransitions = map.get("idle");
      expect(idleTransitions).toBeDefined();
      expect(idleTransitions?.has("walk")).toBe(true);
      expect(idleTransitions?.has("run")).toBe(true);
      expect(idleTransitions?.has("attack")).toBe(true);
    });

    it("should not have transitions from ko (terminal state)", () => {
      const map = buildTransitionMap();
      const koTransitions = map.get("ko");
      expect(koTransitions).toBeUndefined();
    });

    it("should build map with custom transitions", () => {
      const customTransitions = [
        { from: "idle" as AnimationState, to: "walk" as AnimationState, allowed: true },
        { from: "walk" as AnimationState, to: "idle" as AnimationState, allowed: true },
      ];
      const map = buildTransitionMap(customTransitions);
      expect(map.size).toBe(2);
      expect(map.get("idle")?.has("walk")).toBe(true);
      expect(map.get("walk")?.has("idle")).toBe(true);
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
      expect(fromStates.has("idle")).toBe(true);
      expect(fromStates.has("walk")).toBe(true);
      expect(fromStates.has("attack")).toBe(true);
      expect(fromStates.has("defend")).toBe(true);
      expect(fromStates.has("hit")).toBe(true);
    });
  });
});
