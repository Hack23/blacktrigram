/**
 * Unit tests for AnimationPriority system
 * 
 * Tests animation priority comparison and interrupt logic.
 */

import { describe, it, expect } from "vitest";
import {
  canInterrupt,
  getPriority,
  comparePriority,
  ANIMATION_PRIORITY_MAP,
} from "./AnimationPriority";
import { AnimationPriority, AnimationState } from "./types";

describe("AnimationPriority", () => {
  describe("ANIMATION_PRIORITY_MAP", () => {
    it("should map all animation states to priority levels", () => {
      const states: AnimationState[] = [
        "idle",
        "walk",
        "run",
        "stance_change",
        "defend",
        "attack",
        "hit",
        "ko",
      ];

      states.forEach((state) => {
        expect(ANIMATION_PRIORITY_MAP[state]).toBeDefined();
        expect(typeof ANIMATION_PRIORITY_MAP[state]).toBe("number");
      });
    });

    it("should have correct priority order: ko > hit > attack > defend > stance_change > movement > idle", () => {
      expect(ANIMATION_PRIORITY_MAP.ko).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.hit
      );
      expect(ANIMATION_PRIORITY_MAP.hit).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.attack
      );
      expect(ANIMATION_PRIORITY_MAP.attack).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.defend
      );
      expect(ANIMATION_PRIORITY_MAP.defend).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.stance_change
      );
      expect(ANIMATION_PRIORITY_MAP.stance_change).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.run
      );
      expect(ANIMATION_PRIORITY_MAP.run).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.walk
      );
      expect(ANIMATION_PRIORITY_MAP.walk).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.idle
      );
    });
  });

  describe("canInterrupt", () => {
    it("should allow same priority animations to transition", () => {
      expect(canInterrupt("walk", "walk", true)).toBe(true);
      expect(canInterrupt("walk", "walk", false)).toBe(true);
    });

    it("should allow higher priority to interrupt interruptible animations", () => {
      expect(canInterrupt("attack", "hit", true)).toBe(true);
      expect(canInterrupt("defend", "attack", true)).toBe(true);
      expect(canInterrupt("idle", "walk", true)).toBe(true);
    });

    it("should not allow lower priority to interrupt interruptible animations", () => {
      expect(canInterrupt("hit", "attack", true)).toBe(false);
      expect(canInterrupt("attack", "defend", true)).toBe(false);
      expect(canInterrupt("walk", "idle", true)).toBe(false);
    });

    it("should not allow lower priority to interrupt non-interruptible animations", () => {
      expect(canInterrupt("hit", "attack", false)).toBe(false);
      expect(canInterrupt("attack", "walk", false)).toBe(false);
    });

    it("should allow higher priority to interrupt non-interruptible animations", () => {
      expect(canInterrupt("attack", "hit", false)).toBe(true);
      expect(canInterrupt("defend", "hit", false)).toBe(true);
      expect(canInterrupt("stance_change", "ko", false)).toBe(true);
    });

    it("should handle KO animation (highest priority)", () => {
      expect(canInterrupt("attack", "ko", true)).toBe(true);
      expect(canInterrupt("hit", "ko", true)).toBe(true);
      expect(canInterrupt("ko", "idle", true)).toBe(false);
      expect(canInterrupt("ko", "hit", true)).toBe(false);
    });
  });

  describe("getPriority", () => {
    it("should return correct priority for each state", () => {
      expect(getPriority("idle")).toBe(AnimationPriority.IDLE);
      expect(getPriority("walk")).toBe(AnimationPriority.WALK);
      expect(getPriority("run")).toBe(AnimationPriority.RUN);
      expect(getPriority("stance_change")).toBe(
        AnimationPriority.STANCE_CHANGE
      );
      expect(getPriority("defend")).toBe(AnimationPriority.DEFEND);
      expect(getPriority("attack")).toBe(AnimationPriority.ATTACK);
      expect(getPriority("hit")).toBe(AnimationPriority.HIT);
      expect(getPriority("ko")).toBe(AnimationPriority.KO);
    });
  });

  describe("comparePriority", () => {
    it("should return positive when first state has higher priority", () => {
      expect(comparePriority("hit", "attack")).toBeGreaterThan(0);
      expect(comparePriority("ko", "hit")).toBeGreaterThan(0);
      expect(comparePriority("attack", "idle")).toBeGreaterThan(0);
    });

    it("should return negative when second state has higher priority", () => {
      expect(comparePriority("attack", "hit")).toBeLessThan(0);
      expect(comparePriority("hit", "ko")).toBeLessThan(0);
      expect(comparePriority("idle", "attack")).toBeLessThan(0);
    });

    it("should return zero when priorities are equal", () => {
      expect(comparePriority("idle", "idle")).toBe(0);
      expect(comparePriority("attack", "attack")).toBe(0);
      expect(comparePriority("hit", "hit")).toBe(0);
    });
  });
});
