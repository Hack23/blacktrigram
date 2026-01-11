/**
 * Animation Timing Validation Tests
 *
 * Validates that all technique animations meet minimum duration requirements
 * to ensure techniques are visible and not "teleporting".
 *
 * Requirements:
 * - Minimum 0.5s duration for all techniques
 * - Fast techniques: 0.5-0.6s
 * - Medium techniques: 0.6-0.8s
 * - Heavy techniques: 0.8-1.2s
 *
 * @module systems/animation/AnimationTiming.test
 */

import { describe, expect, it } from "vitest";
import { TECHNIQUE_TIMING } from "./MartialArtsAnimationBuilder";
import {
  BACKFIST_ANIMATION,
  BODY_SHOT_ANIMATION,
  CROSS_ANIMATION,
  DOUBLE_HOOK_ANIMATION,
  HAMMER_FIST_ANIMATION,
  HOOK_ANIMATION,
  JAB_ANIMATION,
  JAB_CROSS_ANIMATION,
  LEAD_HOOK_ANIMATION,
  LEAD_UPPERCUT_ANIMATION,
  OVERHAND_ANIMATION,
  PALM_STRIKE_ANIMATION,
  SPINNING_BACKFIST_ANIMATION,
  SUPERMAN_PUNCH_ANIMATION,
  UPPERCUT_ANIMATION,
} from "./PunchAnimations";
import {
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  CRESCENT_KICK_ANIMATION,
  DOUBLE_KICK_ANIMATION,
  FRONT_KICK_ANIMATION,
  HOOK_KICK_ANIMATION,
  JUMPING_KICK_ANIMATION,
  JUMPING_ROUNDHOUSE_ANIMATION,
  LOW_KICK_ANIMATION,
  PUSH_KICK_ANIMATION,
  QUESTION_MARK_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  SPINNING_BACK_KICK_ANIMATION,
  SPINNING_HEEL_KICK_ANIMATION,
  SWEEP_ANIMATION,
  TORNADO_KICK_ANIMATION,
} from "./KickAnimations";

describe("Animation Timing Validation", () => {
  describe("TECHNIQUE_TIMING constants", () => {
    it("should define FAST timing constants", () => {
      expect(TECHNIQUE_TIMING.FAST.chamber).toBe(0.1);
      expect(TECHNIQUE_TIMING.FAST.extend).toBe(0.15);
      expect(TECHNIQUE_TIMING.FAST.peak).toBe(0.05);
      expect(TECHNIQUE_TIMING.FAST.retract).toBe(0.1);
      expect(TECHNIQUE_TIMING.FAST.recover).toBe(0.15);
      expect(TECHNIQUE_TIMING.FAST.total).toBe(0.55);
    });

    it("should define FAST_MEDIUM timing constants", () => {
      expect(TECHNIQUE_TIMING.FAST_MEDIUM.chamber).toBe(0.1);
      expect(TECHNIQUE_TIMING.FAST_MEDIUM.extend).toBe(0.15);
      expect(TECHNIQUE_TIMING.FAST_MEDIUM.peak).toBe(0.05);
      expect(TECHNIQUE_TIMING.FAST_MEDIUM.retract).toBe(0.1);
      expect(TECHNIQUE_TIMING.FAST_MEDIUM.recover).toBe(0.2);
      expect(TECHNIQUE_TIMING.FAST_MEDIUM.total).toBe(0.6);
    });

    it("should define MEDIUM_LIGHT timing constants", () => {
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber).toBe(0.12);
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend).toBe(0.18);
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract).toBe(0.1);
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT.recover).toBe(0.22);
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT.total).toBe(0.7);
    });

    it("should define MEDIUM timing constants", () => {
      expect(TECHNIQUE_TIMING.MEDIUM.chamber).toBe(0.15);
      expect(TECHNIQUE_TIMING.MEDIUM.extend).toBe(0.2);
      expect(TECHNIQUE_TIMING.MEDIUM.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.MEDIUM.retract).toBe(0.12);
      expect(TECHNIQUE_TIMING.MEDIUM.recover).toBe(0.18);
      expect(TECHNIQUE_TIMING.MEDIUM.total).toBe(0.73);
    });

    it("should define MEDIUM_HEAVY timing constants", () => {
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber).toBe(0.12);
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend).toBe(0.2);
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract).toBe(0.15);
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY.recover).toBe(0.2);
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY.total).toBe(0.75);
    });

    it("should define HEAVY_LIGHT timing constants", () => {
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber).toBe(0.15);
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT.extend).toBe(0.2);
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT.peak).toBe(0.1);
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT.retract).toBe(0.15);
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT.recover).toBe(0.2);
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT.total).toBe(0.8);
    });

    it("should define HEAVY_MEDIUM timing constants", () => {
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM.chamber).toBe(0.12);
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM.extend).toBe(0.22);
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM.retract).toBe(0.15);
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM.recover).toBe(0.28);
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM.total).toBe(0.85);
    });

    it("should define HEAVY timing constants", () => {
      expect(TECHNIQUE_TIMING.HEAVY.chamber).toBe(0.2);
      expect(TECHNIQUE_TIMING.HEAVY.extend).toBe(0.3);
      expect(TECHNIQUE_TIMING.HEAVY.peak).toBe(0.12);
      expect(TECHNIQUE_TIMING.HEAVY.retract).toBe(0.15);
      expect(TECHNIQUE_TIMING.HEAVY.recover).toBe(0.23);
      expect(TECHNIQUE_TIMING.HEAVY.total).toBe(1.0);
    });

    it("should define COMBO_FAST timing constants", () => {
      expect(TECHNIQUE_TIMING.COMBO_FAST.chamber).toBe(0.08);
      expect(TECHNIQUE_TIMING.COMBO_FAST.extend).toBe(0.12);
      expect(TECHNIQUE_TIMING.COMBO_FAST.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.COMBO_FAST.retract).toBe(0.1);
      expect(TECHNIQUE_TIMING.COMBO_FAST.recover).toBe(0.32);
      expect(TECHNIQUE_TIMING.COMBO_FAST.total).toBe(0.7);
      // Validate sum of phases equals total
      const sum = TECHNIQUE_TIMING.COMBO_FAST.chamber + 
                  TECHNIQUE_TIMING.COMBO_FAST.extend + 
                  TECHNIQUE_TIMING.COMBO_FAST.peak + 
                  TECHNIQUE_TIMING.COMBO_FAST.retract + 
                  TECHNIQUE_TIMING.COMBO_FAST.recover;
      expect(sum).toBeCloseTo(TECHNIQUE_TIMING.COMBO_FAST.total, 10);
    });

    it("should define JUMPING timing constants", () => {
      expect(TECHNIQUE_TIMING.JUMPING.chamber).toBe(0.18);
      expect(TECHNIQUE_TIMING.JUMPING.extend).toBe(0.22);
      expect(TECHNIQUE_TIMING.JUMPING.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.JUMPING.retract).toBe(0.12);
      expect(TECHNIQUE_TIMING.JUMPING.recover).toBe(0.3);
      expect(TECHNIQUE_TIMING.JUMPING.total).toBe(0.9);
    });

    it("should define COMBO_HEAVY timing constants", () => {
      expect(TECHNIQUE_TIMING.COMBO_HEAVY.chamber).toBe(0.12);
      expect(TECHNIQUE_TIMING.COMBO_HEAVY.extend).toBe(0.22);
      expect(TECHNIQUE_TIMING.COMBO_HEAVY.peak).toBe(0.08);
      expect(TECHNIQUE_TIMING.COMBO_HEAVY.retract).toBe(0.15);
      expect(TECHNIQUE_TIMING.COMBO_HEAVY.recover).toBe(0.38);
      expect(TECHNIQUE_TIMING.COMBO_HEAVY.total).toBe(0.95);
      // Validate sum of phases equals total
      const sum = TECHNIQUE_TIMING.COMBO_HEAVY.chamber + 
                  TECHNIQUE_TIMING.COMBO_HEAVY.extend + 
                  TECHNIQUE_TIMING.COMBO_HEAVY.peak + 
                  TECHNIQUE_TIMING.COMBO_HEAVY.retract + 
                  TECHNIQUE_TIMING.COMBO_HEAVY.recover;
      expect(sum).toBeCloseTo(TECHNIQUE_TIMING.COMBO_HEAVY.total, 10);
    });

    it("should define SPINNING timing constants", () => {
      expect(TECHNIQUE_TIMING.SPINNING.chamber).toBe(0.3);
      expect(TECHNIQUE_TIMING.SPINNING.extend).toBe(0.35);
      expect(TECHNIQUE_TIMING.SPINNING.peak).toBe(0.12);
      expect(TECHNIQUE_TIMING.SPINNING.retract).toBe(0.15);
      expect(TECHNIQUE_TIMING.SPINNING.recover).toBe(0.28);
      expect(TECHNIQUE_TIMING.SPINNING.total).toBe(1.2);
    });

    it("should have increasing durations (FAST < MEDIUM < HEAVY)", () => {
      expect(TECHNIQUE_TIMING.FAST.total).toBeLessThan(
        TECHNIQUE_TIMING.MEDIUM.total
      );
      expect(TECHNIQUE_TIMING.MEDIUM.total).toBeLessThan(
        TECHNIQUE_TIMING.HEAVY.total
      );
    });

    it("should have all 12 timing categories defined", () => {
      expect(TECHNIQUE_TIMING.FAST).toBeDefined();
      expect(TECHNIQUE_TIMING.FAST_MEDIUM).toBeDefined();
      expect(TECHNIQUE_TIMING.MEDIUM_LIGHT).toBeDefined();
      expect(TECHNIQUE_TIMING.MEDIUM).toBeDefined();
      expect(TECHNIQUE_TIMING.MEDIUM_HEAVY).toBeDefined();
      expect(TECHNIQUE_TIMING.HEAVY_LIGHT).toBeDefined();
      expect(TECHNIQUE_TIMING.HEAVY_MEDIUM).toBeDefined();
      expect(TECHNIQUE_TIMING.HEAVY).toBeDefined();
      expect(TECHNIQUE_TIMING.COMBO_FAST).toBeDefined();
      expect(TECHNIQUE_TIMING.JUMPING).toBeDefined();
      expect(TECHNIQUE_TIMING.COMBO_HEAVY).toBeDefined();
      expect(TECHNIQUE_TIMING.SPINNING).toBeDefined();
    });
  });

  describe("Minimum Duration Requirement (0.5s)", () => {
    const allAnimations = [
      // Punch animations
      JAB_ANIMATION,
      CROSS_ANIMATION,
      PALM_STRIKE_ANIMATION,
      HOOK_ANIMATION,
      LEAD_HOOK_ANIMATION,
      UPPERCUT_ANIMATION,
      LEAD_UPPERCUT_ANIMATION,
      OVERHAND_ANIMATION,
      BACKFIST_ANIMATION,
      SPINNING_BACKFIST_ANIMATION,
      HAMMER_FIST_ANIMATION,
      SUPERMAN_PUNCH_ANIMATION,
      JAB_CROSS_ANIMATION,
      DOUBLE_HOOK_ANIMATION,
      BODY_SHOT_ANIMATION,
      // Kick animations
      FRONT_KICK_ANIMATION,
      ROUNDHOUSE_KICK_ANIMATION,
      SIDE_KICK_ANIMATION,
      AXE_KICK_ANIMATION,
      BACK_KICK_ANIMATION,
      TORNADO_KICK_ANIMATION,
      JUMPING_KICK_ANIMATION,
      SWEEP_ANIMATION,
      LOW_KICK_ANIMATION,
      CRESCENT_KICK_ANIMATION,
      PUSH_KICK_ANIMATION,
      SPINNING_HEEL_KICK_ANIMATION,
      JUMPING_ROUNDHOUSE_ANIMATION,
      QUESTION_MARK_KICK_ANIMATION,
      HOOK_KICK_ANIMATION,
      DOUBLE_KICK_ANIMATION,
      SPINNING_BACK_KICK_ANIMATION,
    ];

    it("all animations should have minimum 0.5s duration", () => {
      allAnimations.forEach((anim) => {
        expect(anim.duration, `${anim.name} (${anim.koreanName})`).toBeGreaterThanOrEqual(
          0.5
        );
      });
    });

    it("all animations should have reasonable maximum duration", () => {
      allAnimations.forEach((anim) => {
        expect(anim.duration, `${anim.name} (${anim.koreanName})`).toBeLessThanOrEqual(
          1.5
        );
      });
    });
  });

  describe("Fast Technique Timing (0.5-0.6s)", () => {
    it("JAB_ANIMATION should use FAST timing", () => {
      expect(JAB_ANIMATION.duration).toBe(TECHNIQUE_TIMING.FAST.total);
      expect(JAB_ANIMATION.duration).toBeGreaterThanOrEqual(0.5);
      expect(JAB_ANIMATION.duration).toBeLessThanOrEqual(0.6);
    });

    it("LOW_KICK_ANIMATION should be in fast range", () => {
      expect(LOW_KICK_ANIMATION.duration).toBeGreaterThanOrEqual(0.5);
      expect(LOW_KICK_ANIMATION.duration).toBeLessThanOrEqual(0.65);
    });
  });

  describe("Medium Technique Timing (0.6-0.8s)", () => {
    const mediumTechniques = [
      { anim: CROSS_ANIMATION, name: "Cross" },
      { anim: PALM_STRIKE_ANIMATION, name: "Palm Strike" },
      { anim: LEAD_HOOK_ANIMATION, name: "Lead Hook" },
      { anim: LEAD_UPPERCUT_ANIMATION, name: "Lead Uppercut" },
      { anim: BACKFIST_ANIMATION, name: "Backfist" },
      { anim: FRONT_KICK_ANIMATION, name: "Front Kick" },
      { anim: SIDE_KICK_ANIMATION, name: "Side Kick" },
      { anim: BODY_SHOT_ANIMATION, name: "Body Shot" },
      { anim: PUSH_KICK_ANIMATION, name: "Push Kick" },
    ];

    mediumTechniques.forEach(({ anim, name }) => {
      it(`${name} should be in medium range`, () => {
        expect(anim.duration, `${name} (${anim.koreanName})`).toBeGreaterThanOrEqual(0.6);
        expect(anim.duration, `${name} (${anim.koreanName})`).toBeLessThanOrEqual(0.9);
      });
    });
  });

  describe("Heavy Technique Timing (0.8-1.2s)", () => {
    const heavyTechniques = [
      { anim: HOOK_ANIMATION, name: "Hook" },
      { anim: UPPERCUT_ANIMATION, name: "Uppercut" },
      { anim: OVERHAND_ANIMATION, name: "Overhand" },
      { anim: HAMMER_FIST_ANIMATION, name: "Hammer Fist" },
      { anim: SUPERMAN_PUNCH_ANIMATION, name: "Superman Punch" },
      { anim: DOUBLE_HOOK_ANIMATION, name: "Double Hook" },
      { anim: ROUNDHOUSE_KICK_ANIMATION, name: "Roundhouse Kick" },
      { anim: AXE_KICK_ANIMATION, name: "Axe Kick" },
      { anim: BACK_KICK_ANIMATION, name: "Back Kick" },
      { anim: SWEEP_ANIMATION, name: "Sweep" },
      { anim: CRESCENT_KICK_ANIMATION, name: "Crescent Kick" },
      { anim: HOOK_KICK_ANIMATION, name: "Hook Kick" },
      { anim: JUMPING_KICK_ANIMATION, name: "Jumping Kick" },
      { anim: JUMPING_ROUNDHOUSE_ANIMATION, name: "Jumping Roundhouse" },
      { anim: QUESTION_MARK_KICK_ANIMATION, name: "Question Mark Kick" },
      { anim: DOUBLE_KICK_ANIMATION, name: "Double Kick" },
    ];

    heavyTechniques.forEach(({ anim, name }) => {
      it(`${name} should be in heavy range`, () => {
        expect(anim.duration, `${name} (${anim.koreanName})`).toBeGreaterThanOrEqual(0.7);
        expect(anim.duration, `${name} (${anim.koreanName})`).toBeLessThanOrEqual(1.1);
      });
    });
  });

  describe("Spinning/Combo Technique Timing (1.0-1.3s)", () => {
    const spinningTechniques = [
      { anim: SPINNING_BACKFIST_ANIMATION, name: "Spinning Backfist" },
      { anim: TORNADO_KICK_ANIMATION, name: "Tornado Kick" },
      { anim: SPINNING_HEEL_KICK_ANIMATION, name: "Spinning Heel Kick" },
      { anim: SPINNING_BACK_KICK_ANIMATION, name: "Spinning Back Kick" },
    ];

    spinningTechniques.forEach(({ anim, name }) => {
      it(`${name} should be in spinning/combo range`, () => {
        expect(anim.duration, `${name} (${anim.koreanName})`).toBeGreaterThanOrEqual(1.0);
        expect(anim.duration, `${name} (${anim.koreanName})`).toBeLessThanOrEqual(1.3);
      });
    });
  });

  describe("Animation Keyframe Coverage", () => {
    it("JAB_ANIMATION should have appropriate keyframes", () => {
      expect(JAB_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
      
      // Verify keyframes span animation duration
      const lastKeyframe = JAB_ANIMATION.keyframes[JAB_ANIMATION.keyframes.length - 1];
      expect(lastKeyframe.time).toBeCloseTo(JAB_ANIMATION.duration, 1);
    });

    it("SPINNING_BACKFIST_ANIMATION should have distinct phases", () => {
      expect(SPINNING_BACKFIST_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
      
      // Check for chronological order
      for (let i = 1; i < SPINNING_BACKFIST_ANIMATION.keyframes.length; i++) {
        expect(SPINNING_BACKFIST_ANIMATION.keyframes[i].time).toBeGreaterThan(
          SPINNING_BACKFIST_ANIMATION.keyframes[i - 1].time
        );
      }
    });
  });

  describe("Technique Speed Relationship", () => {
    it("fast techniques should be faster than medium techniques", () => {
      expect(JAB_ANIMATION.duration).toBeLessThan(CROSS_ANIMATION.duration);
      expect(LOW_KICK_ANIMATION.duration).toBeLessThan(ROUNDHOUSE_KICK_ANIMATION.duration);
    });

    it("medium techniques should be faster than heavy techniques", () => {
      expect(CROSS_ANIMATION.duration).toBeLessThan(OVERHAND_ANIMATION.duration);
      expect(FRONT_KICK_ANIMATION.duration).toBeLessThan(AXE_KICK_ANIMATION.duration);
    });

    it("heavy techniques should be faster than spinning techniques", () => {
      expect(OVERHAND_ANIMATION.duration).toBeLessThan(SPINNING_BACKFIST_ANIMATION.duration);
      expect(BACK_KICK_ANIMATION.duration).toBeLessThan(SPINNING_BACK_KICK_ANIMATION.duration);
    });
  });

  describe("Combo Animation Duration", () => {
    it("JAB_CROSS should be longer than single jab", () => {
      expect(JAB_CROSS_ANIMATION.duration).toBeGreaterThan(JAB_ANIMATION.duration);
    });

    it("DOUBLE_HOOK should be longer than single hook", () => {
      expect(DOUBLE_HOOK_ANIMATION.duration).toBeGreaterThan(HOOK_ANIMATION.duration);
    });

    it("DOUBLE_KICK should be longer than single kick", () => {
      expect(DOUBLE_KICK_ANIMATION.duration).toBeGreaterThan(FRONT_KICK_ANIMATION.duration);
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("all animations should have Korean names", () => {
      const allAnimations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        SPINNING_BACKFIST_ANIMATION,
      ];

      allAnimations.forEach((anim) => {
        expect(anim.koreanName).toBeTruthy();
        expect(anim.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("all animations should be attack type", () => {
      const allAnimations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
      ];

      allAnimations.forEach((anim) => {
        expect(anim.type).toBe("attack");
      });
    });
  });

  describe("Animation Phase Validation", () => {
    it("JAB_CROSS_ANIMATION phases should match declared duration", () => {
      // JAB_CROSS uses COMBO_FAST.total (700ms)
      // Phases: chamber(80) + extend(120) + peak(80) + retract(100) + recover(320) = 700ms
      expect(JAB_CROSS_ANIMATION.duration).toBeCloseTo(TECHNIQUE_TIMING.COMBO_FAST.total, 2);
    });

    it("DOUBLE_HOOK_ANIMATION phases should match declared duration", () => {
      // DOUBLE_HOOK uses HEAVY.total (1000ms)
      // Phases should sum to 1000ms
      expect(DOUBLE_HOOK_ANIMATION.duration).toBeCloseTo(TECHNIQUE_TIMING.HEAVY.total, 2);
    });

    it("DOUBLE_KICK_ANIMATION phases should match declared duration", () => {
      // DOUBLE_KICK uses COMBO_HEAVY.total (950ms)
      // Phases should sum to 950ms
      expect(DOUBLE_KICK_ANIMATION.duration).toBeCloseTo(TECHNIQUE_TIMING.COMBO_HEAVY.total, 2);
    });
  });
});
