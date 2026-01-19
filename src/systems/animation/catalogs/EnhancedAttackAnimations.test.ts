/**
 * Tests for Enhanced Attack Animations with Recovery Phases
 *
 * Validates Korean martial arts recovery principles applied to actual techniques.
 *
 * @category Tests
 * @korean 향상된공격애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { validateRecoveryPhase } from "../core/RecoveryPhaseEnhancer";
import {
  CROSS_ANIMATION,
  FRONT_KICK_ANIMATION,
  JAB_ANIMATION,
} from "./AttackAnimations";
import {
  CROSS_ANIMATION_ENHANCED,
  ENHANCED_ANIMATIONS,
  FRONT_KICK_ANIMATION_ENHANCED,
  JAB_ANIMATION_ENHANCED,
  RECOVERY_PRESETS,
  ROUNDHOUSE_KICK_ANIMATION_ENHANCED,
  applyRecoveryPreset,
} from "./EnhancedAttackAnimations";

describe("EnhancedAttackAnimations", () => {
  describe("JAB_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(JAB_ANIMATION_ENHANCED.duration).toBeGreaterThan(
        JAB_ANIMATION.duration,
      );
    });

    it("should add 2 recovery keyframes to base animation", () => {
      expect(JAB_ANIMATION_ENHANCED.keyframes.length).toBe(
        JAB_ANIMATION.keyframes.length + 2,
      );
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(JAB_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("should have fast recovery duration (180-220ms)", () => {
      const result = validateRecoveryPhase(JAB_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
      expect(result.recoveryDuration).toBeLessThanOrEqual(220);
    });

    it("should preserve original animation name and type", () => {
      expect(JAB_ANIMATION_ENHANCED.name).toBe("jab");
      expect(JAB_ANIMATION_ENHANCED.koreanName).toBe("잽");
      expect(JAB_ANIMATION_ENHANCED.type).toBe("attack");
    });

    it("should return to neutral in final keyframe", () => {
      const finalFrame =
        JAB_ANIMATION_ENHANCED.keyframes[
          JAB_ANIMATION_ENHANCED.keyframes.length - 1
        ];

      finalFrame.boneRotations.forEach((rotation) => {
        expect(Math.abs(rotation.x)).toBeLessThan(0.01);
        expect(Math.abs(rotation.y)).toBeLessThan(0.01);
        expect(Math.abs(rotation.z)).toBeLessThan(0.01);
      });
    });
  });

  describe("CROSS_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(CROSS_ANIMATION_ENHANCED.duration).toBeGreaterThan(
        CROSS_ANIMATION.duration,
      );
    });

    it("should add 2 recovery keyframes", () => {
      expect(CROSS_ANIMATION_ENHANCED.keyframes.length).toBe(
        CROSS_ANIMATION.keyframes.length + 2,
      );
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(CROSS_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("should have standard recovery duration (220ms)", () => {
      const result = validateRecoveryPhase(CROSS_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeCloseTo(220, 0);
    });

    it("should preserve original animation identity", () => {
      expect(CROSS_ANIMATION_ENHANCED.name).toBe("cross");
      expect(CROSS_ANIMATION_ENHANCED.koreanName).toBe("크로스");
      expect(CROSS_ANIMATION_ENHANCED.type).toBe("attack");
    });
  });

  describe("FRONT_KICK_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(FRONT_KICK_ANIMATION_ENHANCED.duration).toBeGreaterThan(
        FRONT_KICK_ANIMATION.duration,
      );
    });

    it("should add 2 recovery keyframes", () => {
      expect(FRONT_KICK_ANIMATION_ENHANCED.keyframes.length).toBe(
        FRONT_KICK_ANIMATION.keyframes.length + 2,
      );
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(FRONT_KICK_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("should have shorter recovery (170ms) since base has set-down", () => {
      const result = validateRecoveryPhase(FRONT_KICK_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeCloseTo(170, 5);
    });

    it("should preserve kick animation identity", () => {
      expect(FRONT_KICK_ANIMATION_ENHANCED.name).toBe("front_kick");
      expect(FRONT_KICK_ANIMATION_ENHANCED.koreanName).toBe("앞차기");
      expect(FRONT_KICK_ANIMATION_ENHANCED.type).toBe("attack");
    });
  });

  describe("ROUNDHOUSE_KICK_ANIMATION_ENHANCED", () => {
    it("should have longer duration than base animation", () => {
      expect(ROUNDHOUSE_KICK_ANIMATION_ENHANCED.duration).toBeGreaterThan(0.6);
    });

    it("should have valid recovery phase", () => {
      const result = validateRecoveryPhase(ROUNDHOUSE_KICK_ANIMATION_ENHANCED);
      expect(result.isValid).toBe(true);
    });

    it("should have moderate recovery (180ms)", () => {
      const result = validateRecoveryPhase(ROUNDHOUSE_KICK_ANIMATION_ENHANCED);
      expect(result.recoveryDuration).toBeCloseTo(180, 5);
    });

    it("should preserve roundhouse kick identity", () => {
      expect(ROUNDHOUSE_KICK_ANIMATION_ENHANCED.name).toBe("roundhouse_kick");
      expect(ROUNDHOUSE_KICK_ANIMATION_ENHANCED.koreanName).toBe("돌려차기");
    });
  });

  describe("ENHANCED_ANIMATIONS map", () => {
    it("should contain all enhanced animations", () => {
      expect(ENHANCED_ANIMATIONS.jab).toBeDefined();
      expect(ENHANCED_ANIMATIONS.cross).toBeDefined();
      expect(ENHANCED_ANIMATIONS.front_kick).toBeDefined();
      expect(ENHANCED_ANIMATIONS.roundhouse_kick).toBeDefined();
    });

    it("should provide enhanced versions of animations", () => {
      expect(ENHANCED_ANIMATIONS.jab.duration).toBeGreaterThan(
        JAB_ANIMATION.duration,
      );
      expect(ENHANCED_ANIMATIONS.cross.duration).toBeGreaterThan(
        CROSS_ANIMATION.duration,
      );
    });

    it("should all have valid recovery phases", () => {
      Object.values(ENHANCED_ANIMATIONS).forEach((animation) => {
        const result = validateRecoveryPhase(animation);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe("RECOVERY_PRESETS", () => {
    it("should define all required presets", () => {
      expect(RECOVERY_PRESETS.fast).toBeDefined();
      expect(RECOVERY_PRESETS.power).toBeDefined();
      expect(RECOVERY_PRESETS.kick).toBeDefined();
      expect(RECOVERY_PRESETS.combo).toBeDefined();
      expect(RECOVERY_PRESETS.finishing).toBeDefined();
    });

    it("should have fast recovery with shortest duration", () => {
      expect(RECOVERY_PRESETS.fast.duration).toBeLessThan(0.21);
      expect(RECOVERY_PRESETS.fast.intermediateReturnPercent).toBe(0.75);
    });

    it("should have power recovery with standard duration", () => {
      expect(RECOVERY_PRESETS.power.duration).toBeCloseTo(0.22, 2);
      expect(RECOVERY_PRESETS.power.peakMuscleTension).toBe(1.0);
    });

    it("should have kick recovery with moderate duration", () => {
      expect(RECOVERY_PRESETS.kick.duration).toBeCloseTo(0.18, 2);
      expect(RECOVERY_PRESETS.kick.intermediateReturnPercent).toBe(0.85);
    });

    it("should have combo recovery with fastest duration", () => {
      expect(RECOVERY_PRESETS.combo.duration).toBeLessThan(
        RECOVERY_PRESETS.fast.duration!,
      );
      expect(RECOVERY_PRESETS.combo.finalMuscleTension).toBe(0.03); // Very low
    });

    it("should have finishing recovery with longest duration", () => {
      expect(RECOVERY_PRESETS.finishing.duration).toBeGreaterThan(0.24);
      expect(RECOVERY_PRESETS.finishing.finalMuscleTension).toBe(0.15); // Higher (defensive)
    });

    it("should have progressively longer durations", () => {
      expect(RECOVERY_PRESETS.combo.duration).toBeLessThan(
        RECOVERY_PRESETS.fast.duration!,
      );
      expect(RECOVERY_PRESETS.fast.duration).toBeLessThan(
        RECOVERY_PRESETS.power.duration!,
      );
      expect(RECOVERY_PRESETS.power.duration).toBeLessThan(
        RECOVERY_PRESETS.finishing.duration!,
      );
    });
  });

  describe("applyRecoveryPreset", () => {
    it("should apply fast preset correctly", () => {
      const enhanced = applyRecoveryPreset(JAB_ANIMATION, "fast");
      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(true);
      expect(result.recoveryDuration).toBeCloseTo(190, 5);
    });

    it("should apply power preset correctly", () => {
      const enhanced = applyRecoveryPreset(CROSS_ANIMATION, "power");
      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(true);
      expect(result.recoveryDuration).toBeCloseTo(220, 5);
    });

    it("should apply kick preset correctly", () => {
      const enhanced = applyRecoveryPreset(FRONT_KICK_ANIMATION, "kick");
      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(true);
      expect(result.recoveryDuration).toBeCloseTo(180, 5);
    });

    it("should apply combo preset for fastest recovery", () => {
      const enhanced = applyRecoveryPreset(JAB_ANIMATION, "combo");
      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(true);
      expect(result.recoveryDuration).toBeCloseTo(160, 5);
    });

    it("should apply finishing preset for longest recovery", () => {
      const enhanced = applyRecoveryPreset(CROSS_ANIMATION, "finishing");
      const result = validateRecoveryPhase(enhanced);

      expect(result.isValid).toBe(true);
      expect(result.recoveryDuration).toBeCloseTo(250, 5);
    });

    it("should preserve original animation properties", () => {
      const enhanced = applyRecoveryPreset(JAB_ANIMATION, "fast");

      expect(enhanced.name).toBe(JAB_ANIMATION.name);
      expect(enhanced.koreanName).toBe(JAB_ANIMATION.koreanName);
      expect(enhanced.type).toBe(JAB_ANIMATION.type);
    });

    it("should return to neutral position in all presets", () => {
      const presetNames = Object.keys(RECOVERY_PRESETS) as Array<
        keyof typeof RECOVERY_PRESETS
      >;

      presetNames.forEach((presetName) => {
        const enhanced = applyRecoveryPreset(JAB_ANIMATION, presetName);
        const finalFrame = enhanced.keyframes[enhanced.keyframes.length - 1];

        finalFrame.boneRotations.forEach((rotation) => {
          expect(Math.abs(rotation.x)).toBeLessThan(0.01);
          expect(Math.abs(rotation.y)).toBeLessThan(0.01);
          expect(Math.abs(rotation.z)).toBeLessThan(0.01);
        });
      });
    });
  });

  describe("Korean Martial Arts Principles", () => {
    it("should implement 복귀 (recovery) across all enhanced animations", () => {
      const animations = [
        JAB_ANIMATION_ENHANCED,
        CROSS_ANIMATION_ENHANCED,
        FRONT_KICK_ANIMATION_ENHANCED,
        ROUNDHOUSE_KICK_ANIMATION_ENHANCED,
      ];

      animations.forEach((anim) => {
        const result = validateRecoveryPhase(anim);
        expect(result.isValid).toBe(true);
        expect(result.recoveryKeyframes).toBe(2);
      });
    });

    it("should implement different recovery speeds based on technique type", () => {
      // Jab (fast technique) should have faster recovery than cross (power technique)
      const jabResult = validateRecoveryPhase(JAB_ANIMATION_ENHANCED);
      const crossResult = validateRecoveryPhase(CROSS_ANIMATION_ENHANCED);

      expect(jabResult.recoveryDuration).toBeLessThan(
        crossResult.recoveryDuration,
      );
    });

    it("should have all recovery durations within 150-250ms range", () => {
      const animations = Object.values(ENHANCED_ANIMATIONS);

      animations.forEach((anim) => {
        const result = validateRecoveryPhase(anim);
        expect(result.recoveryDuration).toBeGreaterThanOrEqual(150);
        expect(result.recoveryDuration).toBeLessThanOrEqual(250);
      });
    });

    it("should return all enhanced animations to neutral stance", () => {
      const animations = Object.values(ENHANCED_ANIMATIONS);

      animations.forEach((anim) => {
        const finalFrame = anim.keyframes[anim.keyframes.length - 1];

        finalFrame.boneRotations.forEach((rotation) => {
          expect(Math.abs(rotation.x)).toBeLessThan(0.01);
          expect(Math.abs(rotation.y)).toBeLessThan(0.01);
          expect(Math.abs(rotation.z)).toBeLessThan(0.01);
        });
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should maintain 60fps with enhanced animations", () => {
      const startTime = performance.now();

      // Process 1000 enhanced animations
      for (let i = 0; i < 1000; i++) {
        const anim = Object.values(ENHANCED_ANIMATIONS)[i % 4];
        validateRecoveryPhase(anim);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 1000;

      // Should process well under 1ms per animation for 60fps
      expect(avgTime).toBeLessThan(1.0);
    });

    it("should apply presets efficiently", () => {
      const startTime = performance.now();

      // Apply 1000 presets
      for (let i = 0; i < 1000; i++) {
        applyRecoveryPreset(JAB_ANIMATION, "fast");
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 1000;

      expect(avgTime).toBeLessThan(1.0);
    });
  });
});
