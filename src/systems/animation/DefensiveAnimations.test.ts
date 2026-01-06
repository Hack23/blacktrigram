/**
 * Unit tests for Defensive Animations
 * 
 * Tests guard break and defensive stance animation configurations,
 * timing, and priority behavior.
 * 
 * @module systems/animation/DefensiveAnimations.test
 * @category Animation Tests
 * @korean 방어애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  DEFAULT_ANIMATION_CONFIGS,
} from "./AnimationStateMachine";
import { AnimationPriority } from "./types";

describe("Defensive Animations - Configuration", () => {
  describe("Block Success (막기)", () => {
    it("should have correct configuration with 8 frames (133ms)", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_block_success");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(8);
      expect(config?.duration).toBeCloseTo(0.133, 3);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.interruptible).toBe(false);
      expect(config?.priority).toBe(AnimationPriority.HIT);
    });

    it("should not have counter window", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_block_success");
      expect(config?.counterWindow).toBeUndefined();
    });

    it("should not have vulnerability duration", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_block_success");
      expect(config?.vulnerabilityDuration).toBeUndefined();
    });
  });

  describe("Parry Deflection (받아넘기기)", () => {
    it("should have correct configuration with 10 frames (167ms)", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_parry");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(10);
      expect(config?.duration).toBeCloseTo(0.167, 3);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.interruptible).toBe(false);
      expect(config?.priority).toBe(AnimationPriority.KO);
    });

    it("should have 200ms counter-attack window", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_parry");
      expect(config?.counterWindow).toBeDefined();
      expect(config?.counterWindow).toBeCloseTo(0.2, 3);
    });
  });

  describe("Guard Break (방어붕괴)", () => {
    it("should have correct configuration with 15 frames (250ms)", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_guard_break");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(15);
      expect(config?.duration).toBeCloseTo(0.25, 3);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.interruptible).toBe(false);
      expect(config?.priority).toBe(AnimationPriority.FALL);
    });

    it("should have 500ms vulnerability window", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_guard_break");
      expect(config?.vulnerabilityDuration).toBeDefined();
      expect(config?.vulnerabilityDuration).toBeCloseTo(0.5, 3);
    });
  });

  describe("Guard Recovery (방어복구)", () => {
    it("should have correct configuration with 12 frames (200ms)", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_recovery");
      expect(config).toBeDefined();
      expect(config?.frames).toBe(12);
      expect(config?.duration).toBeCloseTo(0.2, 3);
      expect(config?.fps).toBe(60);
      expect(config?.loop).toBe(false);
      expect(config?.priority).toBe(AnimationPriority.RUN);
    });

    it("should be interruptible", () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get("defend_recovery");
      expect(config?.interruptible).toBe(true);
    });
  });

  describe("Animation Priority Ordering", () => {
    it("should have correct priority hierarchy", () => {
      const blockConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_block_success");
      const parryConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_parry");
      const guardBreakConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_guard_break");
      const recoveryConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_recovery");

      // Priority order: guard_break (8) > parry (7) > block (6) > recovery (2)
      expect(guardBreakConfig?.priority).toBeGreaterThan(parryConfig?.priority ?? 0);
      expect(parryConfig?.priority).toBeGreaterThan(blockConfig?.priority ?? 0);
      expect(blockConfig?.priority).toBeGreaterThan(recoveryConfig?.priority ?? 0);
    });

    it("should have guard_break at highest priority (same as fall)", () => {
      const guardBreakConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_guard_break");
      expect(guardBreakConfig?.priority).toBe(AnimationPriority.FALL);
    });

    it("should have recovery at low priority (same as run)", () => {
      const recoveryConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_recovery");
      expect(recoveryConfig?.priority).toBe(AnimationPriority.RUN);
    });
  });

  describe("60fps Performance Target", () => {
    it("should all use 60fps frame rate", () => {
      const defensiveStates = [
        "defend_block_success",
        "defend_parry",
        "defend_guard_break",
        "defend_recovery",
      ] as const;

      for (const state of defensiveStates) {
        const config = DEFAULT_ANIMATION_CONFIGS.get(state);
        expect(config?.fps).toBe(60);
      }
    });

    it("should have frame counts that target 60fps", () => {
      const blockConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_block_success");
      const parryConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_parry");
      const guardBreakConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_guard_break");
      const recoveryConfig = DEFAULT_ANIMATION_CONFIGS.get("defend_recovery");

      // Verify frame counts match expected durations at 60fps
      expect(blockConfig?.frames).toBe(8); // 133ms / 16.67ms per frame ≈ 8 frames
      expect(parryConfig?.frames).toBe(10); // 167ms / 16.67ms per frame ≈ 10 frames
      expect(guardBreakConfig?.frames).toBe(15); // 250ms / 16.67ms per frame = 15 frames
      expect(recoveryConfig?.frames).toBe(12); // 200ms / 16.67ms per frame = 12 frames
    });
  });

  describe("Non-Looping Behavior", () => {
    it("should have all defensive animations as non-looping", () => {
      const defensiveStates = [
        "defend_block_success",
        "defend_parry",
        "defend_guard_break",
        "defend_recovery",
      ] as const;

      for (const state of defensiveStates) {
        const config = DEFAULT_ANIMATION_CONFIGS.get(state);
        expect(config?.loop).toBe(false);
      }
    });
  });

  describe("Korean Terminology", () => {
    it("should document Korean terms in config", () => {
      // Verify that defensive animation states exist with Korean naming
      expect(DEFAULT_ANIMATION_CONFIGS.has("defend_block_success")).toBe(true); // 막기
      expect(DEFAULT_ANIMATION_CONFIGS.has("defend_parry")).toBe(true); // 받아넘기기
      expect(DEFAULT_ANIMATION_CONFIGS.has("defend_guard_break")).toBe(true); // 방어붕괴
      expect(DEFAULT_ANIMATION_CONFIGS.has("defend_recovery")).toBe(true); // 방어복구
    });
  });
});
