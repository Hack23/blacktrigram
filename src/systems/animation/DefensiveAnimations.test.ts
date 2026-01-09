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
import { TrigramStance } from "../../types/common";
import {
  // GEON (Heaven) defenses
  GEON_HIGH_BLOCK,
  GEON_COUNTER_STRIKE,
  // TAE (Lake) defenses
  TAE_JOINT_LOCK_DEFENSE,
  TAE_SWEEP_DEFENSE,
  // LI (Fire) defenses
  LI_PRECISION_PARRY,
  LI_NERVE_STRIKE_COUNTER,
  // JIN (Thunder) defenses
  JIN_EXPLOSIVE_BLOCK,
  JIN_SHOCKING_COUNTER,
  // SON (Wind) defenses
  SON_CONTINUOUS_DEFLECTION,
  SON_PRESSURE_COUNTER,
  // GAM (Water) defenses
  GAM_FLOW_DEFENSE,
  GAM_REDIRECTION_COUNTER,
  // GAN (Mountain) defenses
  GAN_IMMOVABLE_BLOCK,
  GAN_COUNTER_FORTRESS,
  // GON (Earth) defenses
  GON_GROUNDING_DEFENSE,
  GON_TAKEDOWN_COUNTER,
  // Helper functions
  getDefensiveAnimationsForStance,
  getDefensiveAnimation,
  DEFENSIVE_ANIMATIONS_BY_STANCE,
  ALL_DEFENSIVE_ANIMATIONS,
} from "./DefensiveAnimations";

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

/**
 * Tests for Stance-Specific Defensive Animations
 * 
 * Tests all 16 stance-specific defensive animations (2 per stance × 8 stances),
 * verifying keyframe data, Korean terminology, and animation integrity.
 */
describe("Stance-Specific Defensive Animations", () => {
  describe("☰ GEON (Heaven) - Direct Force Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.GEON);
      expect(animations).toHaveLength(2);
    });

    describe("High Block (상단막기)", () => {
      it("should have correct metadata", () => {
        expect(GEON_HIGH_BLOCK.name).toBe("geon_high_block");
        expect(GEON_HIGH_BLOCK.koreanName).toBe("건 상단막기");
        expect(GEON_HIGH_BLOCK.type).toBe("defense");
        expect(GEON_HIGH_BLOCK.loop).toBe(false);
      });

      it("should have appropriate duration (200ms)", () => {
        expect(GEON_HIGH_BLOCK.duration).toBe(0.2);
      });

      it("should have valid keyframes", () => {
        expect(GEON_HIGH_BLOCK.keyframes.length).toBeGreaterThan(1);
        expect(GEON_HIGH_BLOCK.keyframes[0].time).toBe(0);
      });
    });

    describe("Counter Strike (반격)", () => {
      it("should have correct metadata", () => {
        expect(GEON_COUNTER_STRIKE.name).toBe("geon_counter_strike");
        expect(GEON_COUNTER_STRIKE.koreanName).toBe("건 반격");
        expect(GEON_COUNTER_STRIKE.type).toBe("defense");
      });

      it("should have appropriate duration (250ms)", () => {
        expect(GEON_COUNTER_STRIKE.duration).toBe(0.25);
      });
    });
  });

  describe("☱ TAE (Lake) - Joint Manipulation Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.TAE);
      expect(animations).toHaveLength(2);
    });

    it("should have correct Korean names", () => {
      expect(TAE_JOINT_LOCK_DEFENSE.koreanName).toBe("태 관절방어");
      expect(TAE_SWEEP_DEFENSE.koreanName).toBe("태 쓸어치기방어");
    });

    it("should have appropriate durations (280-300ms)", () => {
      expect(TAE_JOINT_LOCK_DEFENSE.duration).toBe(0.3);
      expect(TAE_SWEEP_DEFENSE.duration).toBe(0.28);
    });
  });

  describe("☲ LI (Fire) - Precision Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.LI);
      expect(animations).toHaveLength(2);
    });

    it("should have fast precision defenses (180-220ms)", () => {
      expect(LI_PRECISION_PARRY.duration).toBe(0.18);
      expect(LI_NERVE_STRIKE_COUNTER.duration).toBe(0.22);
    });

    it("should have correct Korean names", () => {
      expect(LI_PRECISION_PARRY.koreanName).toBe("리 정밀받아넘기기");
      expect(LI_NERVE_STRIKE_COUNTER.koreanName).toBe("리 신경타격반격");
    });
  });

  describe("☳ JIN (Thunder) - Explosive Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.JIN);
      expect(animations).toHaveLength(2);
    });

    it("should have explosive fast defenses (150-180ms)", () => {
      expect(JIN_EXPLOSIVE_BLOCK.duration).toBe(0.15);
      expect(JIN_SHOCKING_COUNTER.duration).toBe(0.18);
    });

    it("should have correct Korean names", () => {
      expect(JIN_EXPLOSIVE_BLOCK.koreanName).toBe("진 폭발막기");
      expect(JIN_SHOCKING_COUNTER.koreanName).toBe("진 충격반격");
    });
  });

  describe("☴ SON (Wind) - Continuous Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.SON);
      expect(animations).toHaveLength(2);
    });

    it("should have longer continuous defenses (350-400ms)", () => {
      expect(SON_CONTINUOUS_DEFLECTION.duration).toBe(0.35);
      expect(SON_PRESSURE_COUNTER.duration).toBe(0.4);
    });

    it("should have correct Korean names", () => {
      expect(SON_CONTINUOUS_DEFLECTION.koreanName).toBe("손 연속막기");
      expect(SON_PRESSURE_COUNTER.koreanName).toBe("손 압박반격");
    });
  });

  describe("☵ GAM (Water) - Flow Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.GAM);
      expect(animations).toHaveLength(2);
    });

    it("should have medium flow defenses (300-320ms)", () => {
      expect(GAM_FLOW_DEFENSE.duration).toBe(0.32);
      expect(GAM_REDIRECTION_COUNTER.duration).toBe(0.3);
    });

    it("should have correct Korean names", () => {
      expect(GAM_FLOW_DEFENSE.koreanName).toBe("감 흐름방어");
      expect(GAM_REDIRECTION_COUNTER.koreanName).toBe("감 전환반격");
    });
  });

  describe("☶ GAN (Mountain) - Immovable Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.GAN);
      expect(animations).toHaveLength(2);
    });

    it("should have solid defensive durations (250-350ms)", () => {
      expect(GAN_IMMOVABLE_BLOCK.duration).toBe(0.25);
      expect(GAN_COUNTER_FORTRESS.duration).toBe(0.35);
    });

    it("should have correct Korean names", () => {
      expect(GAN_IMMOVABLE_BLOCK.koreanName).toBe("간 부동막기");
      expect(GAN_COUNTER_FORTRESS.koreanName).toBe("간 반격요새");
    });
  });

  describe("☷ GON (Earth) - Grounding Defense", () => {
    it("should have 2 defensive variations", () => {
      const animations = getDefensiveAnimationsForStance(TrigramStance.GON);
      expect(animations).toHaveLength(2);
    });

    it("should have grounding defense durations (280-450ms)", () => {
      expect(GON_GROUNDING_DEFENSE.duration).toBe(0.28);
      expect(GON_TAKEDOWN_COUNTER.duration).toBe(0.45);
    });

    it("should have correct Korean names", () => {
      expect(GON_GROUNDING_DEFENSE.koreanName).toBe("곤 접지방어");
      expect(GON_TAKEDOWN_COUNTER.koreanName).toBe("곤 꺾기반격");
    });
  });

  describe("Complete Defensive Coverage", () => {
    it("should have all 16 defensive animations (8 stances × 2 defenses)", () => {
      expect(ALL_DEFENSIVE_ANIMATIONS.size).toBe(16);
    });

    it("should have all 8 stances in the map", () => {
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.size).toBe(8);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.GEON)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.TAE)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.LI)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.JIN)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.SON)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.GAM)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.GAN)).toBe(true);
      expect(DEFENSIVE_ANIMATIONS_BY_STANCE.has(TrigramStance.GON)).toBe(true);
    });

    it("should have correct animation type for all defenses", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        expect(animation.type).toBe("defense");
      });
    });

    it("should have Korean names for all animations", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("should have non-looping animations", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have realistic durations (150-450ms)", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.15);
        expect(animation.duration).toBeLessThanOrEqual(0.45);
      });
    });
  });

  describe("Helper Functions", () => {
    describe("getDefensiveAnimationsForStance", () => {
      it("should return 2 animations for each stance", () => {
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

        stances.forEach((stance) => {
          const animations = getDefensiveAnimationsForStance(stance);
          expect(animations).toHaveLength(2);
        });
      });

      it("should return empty array for invalid stance", () => {
        const animations = getDefensiveAnimationsForStance("invalid" as TrigramStance);
        expect(animations).toHaveLength(0);
      });
    });

    describe("getDefensiveAnimation", () => {
      it("should retrieve animation by name", () => {
        const animation = getDefensiveAnimation("geon_high_block");
        expect(animation).toBeDefined();
        expect(animation?.name).toBe("geon_high_block");
      });

      it("should return undefined for non-existent animation", () => {
        const animation = getDefensiveAnimation("nonexistent_animation");
        expect(animation).toBeUndefined();
      });
    });
  });

  describe("Animation Quality Checks", () => {
    it("should have at least 2 keyframes per animation", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should have keyframes at time 0", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        const firstKeyframe = animation.keyframes[0];
        expect(firstKeyframe.time).toBe(0);
      });
    });

    it("should have valid easing values", () => {
      const validEasings = ["linear", "ease-in", "ease-out", "ease-in-out"];
      
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        animation.keyframes.forEach((keyframe) => {
          expect(validEasings).toContain(keyframe.easing);
        });
      });
    });

    it("should have bone rotations in each keyframe", () => {
      ALL_DEFENSIVE_ANIMATIONS.forEach((animation) => {
        animation.keyframes.forEach((keyframe) => {
          expect(keyframe.boneRotations).toBeInstanceOf(Map);
        });
      });
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should reflect stance philosophy in defense characteristics", () => {
      // Thunder (JIN) should have fastest defenses (explosive)
      const jinAnimations = getDefensiveAnimationsForStance(TrigramStance.JIN);
      const jinAvgDuration = jinAnimations.reduce((sum, a) => sum + a.duration, 0) / jinAnimations.length;
      
      // Wind (SON) should have longer defenses (continuous)
      const sonAnimations = getDefensiveAnimationsForStance(TrigramStance.SON);
      const sonAvgDuration = sonAnimations.reduce((sum, a) => sum + a.duration, 0) / sonAnimations.length;
      
      expect(jinAvgDuration).toBeLessThan(sonAvgDuration);
    });

    it("should have unique defense names per stance", () => {
      const animationNames = new Set();
      
      DEFENSIVE_ANIMATIONS_BY_STANCE.forEach((animations) => {
        animations.forEach((animation) => {
          animationNames.add(animation.name);
        });
      });
      
      // All 16 animations should be unique
      expect(animationNames.size).toBe(16);
    });
  });
});
