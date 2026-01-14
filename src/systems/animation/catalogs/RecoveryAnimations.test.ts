/**
 * Tests for Recovery Animation System
 * 
 * Validates recovery animations from fallen states including:
 * - Prone stand-up (엎드린 기상)
 * - Supine stand-up (누운 기상)
 * - Roll recovery (회전기상)
 * - Defensive getup (방어기상)
 * 
 * @module systems/animation/RecoveryAnimations.test
 * @category Animation Tests
 * @korean 기상애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  getRecoveryKeyframes,
  isVulnerableFrame,
  determineRecoveryType,
  getRecoveryAnimationState,
  getRecoveryConfig,
  RECOVERY_PRONE_KEYFRAMES,
  RECOVERY_SUPINE_KEYFRAMES,
  RECOVERY_ROLL_KEYFRAMES,
  RECOVERY_DEFENSIVE_KEYFRAMES,
} from "./RecoveryAnimations";
import type { RecoveryAnimationType, GroundState } from "./types";

describe("RecoveryAnimations", () => {
  describe("Keyframe Data", () => {
    it("should have correct frame counts for each recovery type", () => {
      // Prone: 30 frames (500ms at 60fps)
      expect(RECOVERY_PRONE_KEYFRAMES).toHaveLength(5);
      expect(RECOVERY_PRONE_KEYFRAMES[RECOVERY_PRONE_KEYFRAMES.length - 1].frame).toBe(29);

      // Supine: 36 frames (600ms at 60fps)
      expect(RECOVERY_SUPINE_KEYFRAMES).toHaveLength(5);
      expect(RECOVERY_SUPINE_KEYFRAMES[RECOVERY_SUPINE_KEYFRAMES.length - 1].frame).toBe(35);

      // Roll: 24 frames (400ms at 60fps)
      expect(RECOVERY_ROLL_KEYFRAMES).toHaveLength(5);
      expect(RECOVERY_ROLL_KEYFRAMES[RECOVERY_ROLL_KEYFRAMES.length - 1].frame).toBe(23);

      // Defensive: 42 frames (700ms at 60fps)
      expect(RECOVERY_DEFENSIVE_KEYFRAMES).toHaveLength(5);
      expect(RECOVERY_DEFENSIVE_KEYFRAMES[RECOVERY_DEFENSIVE_KEYFRAMES.length - 1].frame).toBe(41);
    });

    it("should have Korean and English descriptions for all keyframes", () => {
      const allKeyframes = [
        ...RECOVERY_PRONE_KEYFRAMES,
        ...RECOVERY_SUPINE_KEYFRAMES,
        ...RECOVERY_ROLL_KEYFRAMES,
        ...RECOVERY_DEFENSIVE_KEYFRAMES,
      ];

      for (const kf of allKeyframes) {
        expect(kf.description.korean).toBeTruthy();
        expect(kf.description.english).toBeTruthy();
        expect(typeof kf.description.korean).toBe("string");
        expect(typeof kf.description.english).toBe("string");
      }
    });

    it("should have center of mass progress from ground to standing", () => {
      // All recovery animations should start low and end high
      const checkProgression = (keyframes: readonly typeof RECOVERY_PRONE_KEYFRAMES[number][]) => {
        expect(keyframes[0].centerOfMassHeight).toBeLessThan(0.2); // Start grounded
        expect(keyframes[keyframes.length - 1].centerOfMassHeight).toBeGreaterThan(0.8); // End standing
        
        // Should be monotonically increasing
        for (let i = 1; i < keyframes.length; i++) {
          expect(keyframes[i].centerOfMassHeight).toBeGreaterThanOrEqual(
            keyframes[i - 1].centerOfMassHeight
          );
        }
      };

      checkProgression(RECOVERY_PRONE_KEYFRAMES);
      checkProgression(RECOVERY_SUPINE_KEYFRAMES);
      checkProgression(RECOVERY_ROLL_KEYFRAMES);
      checkProgression(RECOVERY_DEFENSIVE_KEYFRAMES);
    });

    it("should mark last keyframe as not vulnerable", () => {
      // Last 6 frames should be interruptible and not vulnerable
      expect(RECOVERY_PRONE_KEYFRAMES[RECOVERY_PRONE_KEYFRAMES.length - 1].vulnerable).toBe(false);
      expect(RECOVERY_SUPINE_KEYFRAMES[RECOVERY_SUPINE_KEYFRAMES.length - 1].vulnerable).toBe(false);
      expect(RECOVERY_ROLL_KEYFRAMES[RECOVERY_ROLL_KEYFRAMES.length - 1].vulnerable).toBe(false);
      expect(RECOVERY_DEFENSIVE_KEYFRAMES[RECOVERY_DEFENSIVE_KEYFRAMES.length - 1].vulnerable).toBe(false);
    });

    it("should have earlier keyframes marked as vulnerable", () => {
      // First keyframe should be vulnerable
      expect(RECOVERY_PRONE_KEYFRAMES[0].vulnerable).toBe(true);
      expect(RECOVERY_SUPINE_KEYFRAMES[0].vulnerable).toBe(true);
      expect(RECOVERY_ROLL_KEYFRAMES[0].vulnerable).toBe(true);
      expect(RECOVERY_DEFENSIVE_KEYFRAMES[0].vulnerable).toBe(true);
    });
  });

  describe("getRecoveryKeyframes", () => {
    it("should return correct keyframes for each recovery type", () => {
      expect(getRecoveryKeyframes("prone_standup")).toBe(RECOVERY_PRONE_KEYFRAMES);
      expect(getRecoveryKeyframes("supine_standup")).toBe(RECOVERY_SUPINE_KEYFRAMES);
      expect(getRecoveryKeyframes("roll_recovery")).toBe(RECOVERY_ROLL_KEYFRAMES);
      expect(getRecoveryKeyframes("defensive_getup")).toBe(RECOVERY_DEFENSIVE_KEYFRAMES);
    });

    it("should return arrays with at least 5 keyframes each", () => {
      const types: RecoveryAnimationType[] = [
        "prone_standup",
        "supine_standup",
        "roll_recovery",
        "defensive_getup",
      ];

      for (const type of types) {
        const keyframes = getRecoveryKeyframes(type);
        expect(keyframes.length).toBeGreaterThanOrEqual(5);
      }
    });
  });

  describe("isVulnerableFrame", () => {
    it("should return true for early frames in prone standup", () => {
      expect(isVulnerableFrame("prone_standup", 0)).toBe(true);
      expect(isVulnerableFrame("prone_standup", 10)).toBe(true);
      expect(isVulnerableFrame("prone_standup", 20)).toBe(true);
    });

    it("should return false for last frames in prone standup", () => {
      // Last 6 frames (25-30) should not be vulnerable
      expect(isVulnerableFrame("prone_standup", 25)).toBe(false);
      expect(isVulnerableFrame("prone_standup", 29)).toBe(false);
    });

    it("should return true for early frames in supine standup", () => {
      expect(isVulnerableFrame("supine_standup", 0)).toBe(true);
      expect(isVulnerableFrame("supine_standup", 15)).toBe(true);
      expect(isVulnerableFrame("supine_standup", 25)).toBe(true);
    });

    it("should return false for last frames in supine standup", () => {
      // Last 6 frames (30-36) should not be vulnerable
      expect(isVulnerableFrame("supine_standup", 31)).toBe(false);
      expect(isVulnerableFrame("supine_standup", 35)).toBe(false);
    });

    it("should return true for early frames in roll recovery", () => {
      expect(isVulnerableFrame("roll_recovery", 0)).toBe(true);
      expect(isVulnerableFrame("roll_recovery", 10)).toBe(true);
      expect(isVulnerableFrame("roll_recovery", 15)).toBe(true);
    });

    it("should return false for last frames in roll recovery", () => {
      // Last 6 frames (18-24) should not be vulnerable
      expect(isVulnerableFrame("roll_recovery", 19)).toBe(false);
      expect(isVulnerableFrame("roll_recovery", 23)).toBe(false);
    });

    it("should return true for early frames in defensive getup", () => {
      expect(isVulnerableFrame("defensive_getup", 0)).toBe(true);
      expect(isVulnerableFrame("defensive_getup", 20)).toBe(true);
      expect(isVulnerableFrame("defensive_getup", 30)).toBe(true);
    });

    it("should return false for last frames in defensive getup", () => {
      // Last 6 frames (36-42) should not be vulnerable
      expect(isVulnerableFrame("defensive_getup", 37)).toBe(false);
      expect(isVulnerableFrame("defensive_getup", 41)).toBe(false);
    });
  });

  describe("determineRecoveryType", () => {
    it("should return prone_standup for prone ground state", () => {
      expect(determineRecoveryType("prone")).toBe("prone_standup");
    });

    it("should return supine_standup for supine ground state", () => {
      expect(determineRecoveryType("supine")).toBe("supine_standup");
    });

    it("should return roll_recovery for side_left ground state", () => {
      expect(determineRecoveryType("side_left")).toBe("roll_recovery");
    });

    it("should return roll_recovery for side_right ground state", () => {
      expect(determineRecoveryType("side_right")).toBe("roll_recovery");
    });

    it("should handle all ground state types", () => {
      const groundStates: GroundState[] = ["prone", "supine", "side_left", "side_right"];

      for (const state of groundStates) {
        const recoveryType = determineRecoveryType(state);
        expect(recoveryType).toBeTruthy();
        expect(typeof recoveryType).toBe("string");
      }
    });
  });

  describe("getRecoveryAnimationState", () => {
    it("should return correct animation state for each recovery type", () => {
      expect(getRecoveryAnimationState("prone_standup")).toBe("recovery_prone_standup");
      expect(getRecoveryAnimationState("supine_standup")).toBe("recovery_supine_standup");
      expect(getRecoveryAnimationState("roll_recovery")).toBe("recovery_roll");
      expect(getRecoveryAnimationState("defensive_getup")).toBe("recovery_defensive");
    });
  });

  describe("getRecoveryConfig", () => {
    it("should return config for prone standup with no stamina cost", () => {
      const config = getRecoveryConfig("prone_standup");
      expect(config.staminaCost).toBe(0);
      expect(config.damageReduction).toBe(0);
      expect(config.vulnerableFrames).toBe(24);
      expect(config.interruptibleFrame).toBe(24);
    });

    it("should return config for supine standup with no stamina cost", () => {
      const config = getRecoveryConfig("supine_standup");
      expect(config.staminaCost).toBe(0);
      expect(config.damageReduction).toBe(0);
      expect(config.vulnerableFrames).toBe(30);
      expect(config.interruptibleFrame).toBe(30);
    });

    it("should return config for roll recovery with 20 stamina cost", () => {
      const config = getRecoveryConfig("roll_recovery");
      expect(config.staminaCost).toBe(20);
      expect(config.damageReduction).toBe(0);
      expect(config.vulnerableFrames).toBe(18);
      expect(config.interruptibleFrame).toBe(18);
    });

    it("should return config for defensive getup with 50% damage reduction", () => {
      const config = getRecoveryConfig("defensive_getup");
      expect(config.staminaCost).toBe(0);
      expect(config.damageReduction).toBe(0.5);
      expect(config.vulnerableFrames).toBe(36);
      expect(config.interruptibleFrame).toBe(36);
    });

    it("should have all configs with valid vulnerability windows", () => {
      const types: RecoveryAnimationType[] = [
        "prone_standup",
        "supine_standup",
        "roll_recovery",
        "defensive_getup",
      ];

      for (const type of types) {
        const config = getRecoveryConfig(type);
        const keyframes = getRecoveryKeyframes(type);
        const totalFrames = keyframes[keyframes.length - 1].frame + 1;

        // Vulnerable frames should be less than total frames
        expect(config.vulnerableFrames).toBeLessThan(totalFrames);
        
        // Interruptible frame should be same or less than vulnerable frames end
        expect(config.interruptibleFrame).toBeLessThanOrEqual(totalFrames);
        
        // Last 6 frames should be interruptible
        expect(totalFrames - config.interruptibleFrame).toBeGreaterThanOrEqual(6);
      }
    });
  });

  describe("Korean Terminology", () => {
    it("should have bilingual descriptions in all keyframes", () => {
      const allKeyframes = [
        ...RECOVERY_PRONE_KEYFRAMES,
        ...RECOVERY_SUPINE_KEYFRAMES,
        ...RECOVERY_ROLL_KEYFRAMES,
        ...RECOVERY_DEFENSIVE_KEYFRAMES,
      ];

      for (const kf of allKeyframes) {
        // Check Korean text (should contain Hangul characters)
        expect(kf.description.korean).toMatch(/[\u3131-\uD79D]/);
        
        // Check English text
        expect(kf.description.english.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Recovery Animation Durations", () => {
    it("should have roll recovery as fastest (24 frames)", () => {
      const rollFrames = RECOVERY_ROLL_KEYFRAMES[RECOVERY_ROLL_KEYFRAMES.length - 1].frame + 1;
      const proneFrames = RECOVERY_PRONE_KEYFRAMES[RECOVERY_PRONE_KEYFRAMES.length - 1].frame + 1;
      const supineFrames = RECOVERY_SUPINE_KEYFRAMES[RECOVERY_SUPINE_KEYFRAMES.length - 1].frame + 1;
      const defensiveFrames = RECOVERY_DEFENSIVE_KEYFRAMES[RECOVERY_DEFENSIVE_KEYFRAMES.length - 1].frame + 1;

      expect(rollFrames).toBe(24);
      expect(rollFrames).toBeLessThan(proneFrames);
      expect(rollFrames).toBeLessThan(supineFrames);
      expect(rollFrames).toBeLessThan(defensiveFrames);
    });

    it("should have defensive getup as slowest (42 frames)", () => {
      const defensiveFrames = RECOVERY_DEFENSIVE_KEYFRAMES[RECOVERY_DEFENSIVE_KEYFRAMES.length - 1].frame + 1;
      const rollFrames = RECOVERY_ROLL_KEYFRAMES[RECOVERY_ROLL_KEYFRAMES.length - 1].frame + 1;
      const proneFrames = RECOVERY_PRONE_KEYFRAMES[RECOVERY_PRONE_KEYFRAMES.length - 1].frame + 1;
      const supineFrames = RECOVERY_SUPINE_KEYFRAMES[RECOVERY_SUPINE_KEYFRAMES.length - 1].frame + 1;

      expect(defensiveFrames).toBe(42);
      expect(defensiveFrames).toBeGreaterThan(rollFrames);
      expect(defensiveFrames).toBeGreaterThan(proneFrames);
      expect(defensiveFrames).toBeGreaterThan(supineFrames);
    });

    it("should have prone standup at 30 frames (500ms)", () => {
      const proneFrames = RECOVERY_PRONE_KEYFRAMES[RECOVERY_PRONE_KEYFRAMES.length - 1].frame + 1;
      expect(proneFrames).toBe(30);
    });

    it("should have supine standup at 36 frames (600ms)", () => {
      const supineFrames = RECOVERY_SUPINE_KEYFRAMES[RECOVERY_SUPINE_KEYFRAMES.length - 1].frame + 1;
      expect(supineFrames).toBe(36);
    });
  });
});
