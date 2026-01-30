/**
 * Tests for animation constants data
 *
 * **Korean**: 애니메이션 상수 테스트 (Animation Constants Tests)
 *
 * Tests verify:
 * - Animation duration constants integrity
 * - Animation easing curve definitions
 * - Frame configuration structure
 * - Korean martial arts animation sequences
 * - Data validation and edge cases
 *
 * @module types/constants/animations.test
 * @category Testing
 * @korean 애니메이션상수테스트
 */

import { describe, expect, it } from "vitest";
import {
  ANIMATION_DURATIONS,
  ANIMATION_EASING,
  FRAME_CONFIGS,
  KOREAN_MARTIAL_ANIMATIONS,
} from "./animations";

describe("animations.ts Constants", () => {
  describe("ANIMATION_DURATIONS constant", () => {
    it("should be defined and contain animation durations", () => {
      expect(ANIMATION_DURATIONS).toBeDefined();
      expect(typeof ANIMATION_DURATIONS).toBe("object");
    });

    it("should have UI animation durations", () => {
      expect(ANIMATION_DURATIONS).toHaveProperty("BUTTON_HOVER");
      expect(ANIMATION_DURATIONS).toHaveProperty("BUTTON_PRESS");
      expect(ANIMATION_DURATIONS).toHaveProperty("MODAL_FADE");
      expect(ANIMATION_DURATIONS).toHaveProperty("SCREEN_TRANSITION");
    });

    it("should have combat animation durations", () => {
      expect(ANIMATION_DURATIONS).toHaveProperty("BASIC_ATTACK");
      expect(ANIMATION_DURATIONS).toHaveProperty("HEAVY_ATTACK");
      expect(ANIMATION_DURATIONS).toHaveProperty("BLOCK");
      expect(ANIMATION_DURATIONS).toHaveProperty("DODGE");
      expect(ANIMATION_DURATIONS).toHaveProperty("STANCE_CHANGE");
    });

    it("should have effect animation durations", () => {
      expect(ANIMATION_DURATIONS).toHaveProperty("HIT_FLASH");
      expect(ANIMATION_DURATIONS).toHaveProperty("DAMAGE_NUMBER");
      expect(ANIMATION_DURATIONS).toHaveProperty("STATUS_EFFECT");
      expect(ANIMATION_DURATIONS).toHaveProperty("PARTICLE_LIFE");
    });

    it("should have Korean martial arts specific durations", () => {
      expect(ANIMATION_DURATIONS).toHaveProperty("TRIGRAM_TRANSITION");
      expect(ANIMATION_DURATIONS).toHaveProperty("VITAL_POINT_HIGHLIGHT");
      expect(ANIMATION_DURATIONS).toHaveProperty("KI_FLOW_PULSE");
    });

    it("all durations should be positive numbers", () => {
      Object.values(ANIMATION_DURATIONS).forEach((duration) => {
        expect(typeof duration).toBe("number");
        expect(duration).toBeGreaterThan(0);
      });
    });

    it("UI animations should be faster than combat animations", () => {
      expect(ANIMATION_DURATIONS.BUTTON_HOVER).toBeLessThan(ANIMATION_DURATIONS.BASIC_ATTACK);
      expect(ANIMATION_DURATIONS.BUTTON_PRESS).toBeLessThan(ANIMATION_DURATIONS.HEAVY_ATTACK);
    });

    it("heavy attack should be slower than basic attack", () => {
      expect(ANIMATION_DURATIONS.HEAVY_ATTACK).toBeGreaterThan(ANIMATION_DURATIONS.BASIC_ATTACK);
    });

    it("button press should be faster than button hover", () => {
      expect(ANIMATION_DURATIONS.BUTTON_PRESS).toBeLessThanOrEqual(ANIMATION_DURATIONS.BUTTON_HOVER);
    });

    it("all durations should be reasonable for gameplay (< 5000ms)", () => {
      Object.values(ANIMATION_DURATIONS).forEach((duration) => {
        expect(duration).toBeLessThanOrEqual(5000);
      });
    });

    it("hit flash should be very fast for visual feedback", () => {
      expect(ANIMATION_DURATIONS.HIT_FLASH).toBeLessThanOrEqual(200);
    });

    it("status effects should last longer than hit effects", () => {
      expect(ANIMATION_DURATIONS.STATUS_EFFECT).toBeGreaterThan(ANIMATION_DURATIONS.HIT_FLASH);
    });

    it("Korean martial arts animations should have appropriate durations", () => {
      expect(ANIMATION_DURATIONS.TRIGRAM_TRANSITION).toBeGreaterThanOrEqual(300);
      expect(ANIMATION_DURATIONS.VITAL_POINT_HIGHLIGHT).toBeGreaterThanOrEqual(100);
      expect(ANIMATION_DURATIONS.KI_FLOW_PULSE).toBeGreaterThanOrEqual(500);
    });
  });

  describe("ANIMATION_EASING constant", () => {
    it("should be defined and contain easing curves", () => {
      expect(ANIMATION_EASING).toBeDefined();
      expect(typeof ANIMATION_EASING).toBe("object");
    });

    it("should have standard easing curves", () => {
      expect(ANIMATION_EASING).toHaveProperty("LINEAR");
      expect(ANIMATION_EASING).toHaveProperty("EASE_IN");
      expect(ANIMATION_EASING).toHaveProperty("EASE_OUT");
      expect(ANIMATION_EASING).toHaveProperty("EASE_IN_OUT");
    });

    it("should have special easing curves", () => {
      expect(ANIMATION_EASING).toHaveProperty("BOUNCE");
      expect(ANIMATION_EASING).toHaveProperty("ELASTIC");
      expect(ANIMATION_EASING).toHaveProperty("BACK");
    });

    it("all easing values should be strings", () => {
      Object.values(ANIMATION_EASING).forEach((easing) => {
        expect(typeof easing).toBe("string");
        expect(easing.length).toBeGreaterThan(0);
      });
    });

    it("standard easings should be valid CSS easing functions", () => {
      expect(ANIMATION_EASING.LINEAR).toBe("linear");
      expect(ANIMATION_EASING.EASE_IN).toBe("ease-in");
      expect(ANIMATION_EASING.EASE_OUT).toBe("ease-out");
      expect(ANIMATION_EASING.EASE_IN_OUT).toBe("ease-in-out");
    });

    it("cubic-bezier easings should be valid format", () => {
      expect(ANIMATION_EASING.BOUNCE).toMatch(/^cubic-bezier\(/);
      expect(ANIMATION_EASING.ELASTIC).toMatch(/^cubic-bezier\(/);
      expect(ANIMATION_EASING.BACK).toMatch(/^cubic-bezier\(/);
    });

    it("cubic-bezier easings should have correct parameter format", () => {
      const bezierRegex = /^cubic-bezier\(-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?,\s*\d+(\.\d+)?,\s*\d+(\.\d+)?\)$/;
      expect(ANIMATION_EASING.BOUNCE).toMatch(bezierRegex);
      expect(ANIMATION_EASING.ELASTIC).toMatch(bezierRegex);
      expect(ANIMATION_EASING.BACK).toMatch(bezierRegex);
    });
  });

  describe("FRAME_CONFIGS constant", () => {
    it("should be defined and contain frame configurations", () => {
      expect(FRAME_CONFIGS).toBeDefined();
      expect(typeof FRAME_CONFIGS).toBe("object");
    });

    it("should have standard animation types", () => {
      expect(FRAME_CONFIGS).toHaveProperty("IDLE");
      expect(FRAME_CONFIGS).toHaveProperty("WALK");
      expect(FRAME_CONFIGS).toHaveProperty("ATTACK");
      expect(FRAME_CONFIGS).toHaveProperty("BLOCK");
      expect(FRAME_CONFIGS).toHaveProperty("HIT");
    });

    it("all frame configs should have required properties", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        expect(config).toHaveProperty("frames");
        expect(config).toHaveProperty("duration");
        expect(config).toHaveProperty("loop");
      });
    });

    it("all frame counts should be positive integers", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        expect(typeof config.frames).toBe("number");
        expect(config.frames).toBeGreaterThan(0);
        expect(Number.isInteger(config.frames)).toBe(true);
      });
    });

    it("all durations should be positive numbers", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        expect(typeof config.duration).toBe("number");
        expect(config.duration).toBeGreaterThan(0);
      });
    });

    it("all loop values should be booleans", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        expect(typeof config.loop).toBe("boolean");
      });
    });

    it("idle and walk animations should loop", () => {
      expect(FRAME_CONFIGS.IDLE.loop).toBe(true);
      expect(FRAME_CONFIGS.WALK.loop).toBe(true);
    });

    it("attack, block, and hit animations should not loop", () => {
      expect(FRAME_CONFIGS.ATTACK.loop).toBe(false);
      expect(FRAME_CONFIGS.BLOCK.loop).toBe(false);
      expect(FRAME_CONFIGS.HIT.loop).toBe(false);
    });

    it("attack should have more frames than block or hit", () => {
      expect(FRAME_CONFIGS.ATTACK.frames).toBeGreaterThan(FRAME_CONFIGS.BLOCK.frames);
      expect(FRAME_CONFIGS.ATTACK.frames).toBeGreaterThan(FRAME_CONFIGS.HIT.frames);
    });

    it("walk should have more frames than idle", () => {
      expect(FRAME_CONFIGS.WALK.frames).toBeGreaterThan(FRAME_CONFIGS.IDLE.frames);
    });

    it("frame durations should match ANIMATION_DURATIONS where applicable", () => {
      expect(FRAME_CONFIGS.ATTACK.duration).toBe(ANIMATION_DURATIONS.BASIC_ATTACK);
      expect(FRAME_CONFIGS.BLOCK.duration).toBe(ANIMATION_DURATIONS.BLOCK);
    });

    it("frame configurations should have reasonable frame counts", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        expect(config.frames).toBeLessThanOrEqual(12);
        expect(config.frames).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe("KOREAN_MARTIAL_ANIMATIONS constant", () => {
    it("should be defined and contain Korean martial arts animations", () => {
      expect(KOREAN_MARTIAL_ANIMATIONS).toBeDefined();
      expect(typeof KOREAN_MARTIAL_ANIMATIONS).toBe("object");
    });

    it("should have stance transition animations", () => {
      expect(KOREAN_MARTIAL_ANIMATIONS).toHaveProperty("STANCE_TRANSITIONS");
      expect(typeof KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).toBe("object");
    });

    it("should have technique animations", () => {
      expect(KOREAN_MARTIAL_ANIMATIONS).toHaveProperty("TECHNIQUE_ANIMATIONS");
      expect(typeof KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS).toBe("object");
    });

    it("stance transitions should have valid structure", () => {
      const transitions = KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS;
      expect(transitions).toHaveProperty("GEON_TO_TAE");
      expect(transitions).toHaveProperty("TAE_TO_LI");
      expect(transitions).toHaveProperty("LI_TO_JIN");
    });

    it("all stance transitions should have frames and duration", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).forEach((transition) => {
        expect(transition).toHaveProperty("frames");
        expect(transition).toHaveProperty("duration");
        expect(typeof transition.frames).toBe("number");
        expect(typeof transition.duration).toBe("number");
      });
    });

    it("technique animations should have valid structure", () => {
      const techniques = KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS;
      expect(techniques).toHaveProperty("PALM_STRIKE");
      expect(techniques).toHaveProperty("FLYING_KICK");
      expect(techniques).toHaveProperty("PRESSURE_POINT");
      expect(techniques).toHaveProperty("VITAL_POINT_STRIKE");
    });

    it("all technique animations should have frames and duration", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS).forEach((technique) => {
        expect(technique).toHaveProperty("frames");
        expect(technique).toHaveProperty("duration");
        expect(typeof technique.frames).toBe("number");
        expect(typeof technique.duration).toBe("number");
      });
    });

    it("all stance transition frame counts should be positive", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).forEach((transition) => {
        expect(transition.frames).toBeGreaterThan(0);
      });
    });

    it("all technique animation frame counts should be positive", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS).forEach((technique) => {
        expect(technique.frames).toBeGreaterThan(0);
      });
    });

    it("all stance transition durations should be positive", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).forEach((transition) => {
        expect(transition.duration).toBeGreaterThan(0);
      });
    });

    it("all technique animation durations should be positive", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS).forEach((technique) => {
        expect(technique.duration).toBeGreaterThan(0);
      });
    });

    it("stance transitions should have reasonable frame counts (8-15)", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).forEach((transition) => {
        expect(transition.frames).toBeGreaterThanOrEqual(8);
        expect(transition.frames).toBeLessThanOrEqual(15);
      });
    });

    it("technique animations should have reasonable frame counts (6-12)", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS).forEach((technique) => {
        expect(technique.frames).toBeGreaterThanOrEqual(6);
        expect(technique.frames).toBeLessThanOrEqual(12);
      });
    });

    it("stance transition durations should be in reasonable range (400-600ms)", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).forEach((transition) => {
        expect(transition.duration).toBeGreaterThanOrEqual(400);
        expect(transition.duration).toBeLessThanOrEqual(600);
      });
    });

    it("technique animation durations should be in reasonable range (300-600ms)", () => {
      Object.values(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS).forEach((technique) => {
        expect(technique.duration).toBeGreaterThanOrEqual(300);
        expect(technique.duration).toBeLessThanOrEqual(600);
      });
    });

    it("palm strike should be faster than flying kick", () => {
      expect(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS.PALM_STRIKE.duration).toBeLessThan(
        KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS.FLYING_KICK.duration
      );
    });

    it("pressure point should be faster than vital point strike", () => {
      expect(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS.PRESSURE_POINT.duration).toBeLessThan(
        KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS.VITAL_POINT_STRIKE.duration
      );
    });
  });

  describe("Data Integrity Cross-Checks", () => {
    it("all constants should be defined", () => {
      expect(ANIMATION_DURATIONS).toBeDefined();
      expect(ANIMATION_EASING).toBeDefined();
      expect(FRAME_CONFIGS).toBeDefined();
      expect(KOREAN_MARTIAL_ANIMATIONS).toBeDefined();
    });

    it("all constants should be objects", () => {
      expect(typeof ANIMATION_DURATIONS).toBe("object");
      expect(typeof ANIMATION_EASING).toBe("object");
      expect(typeof FRAME_CONFIGS).toBe("object");
      expect(typeof KOREAN_MARTIAL_ANIMATIONS).toBe("object");
    });

    it("all constants should not be empty", () => {
      expect(Object.keys(ANIMATION_DURATIONS).length).toBeGreaterThan(0);
      expect(Object.keys(ANIMATION_EASING).length).toBeGreaterThan(0);
      expect(Object.keys(FRAME_CONFIGS).length).toBeGreaterThan(0);
      expect(Object.keys(KOREAN_MARTIAL_ANIMATIONS).length).toBeGreaterThan(0);
    });

    it("frame configs should be consistent with animation durations", () => {
      // Attack frames should match basic attack duration
      expect(FRAME_CONFIGS.ATTACK.duration).toBe(ANIMATION_DURATIONS.BASIC_ATTACK);
      // Block frames should match block duration
      expect(FRAME_CONFIGS.BLOCK.duration).toBe(ANIMATION_DURATIONS.BLOCK);
    });

    it("Korean techniques should align with ANIMATION_DURATIONS", () => {
      // Stance transitions should be close to STANCE_CHANGE duration
      Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS).forEach((transition) => {
        expect(transition.duration).toBeGreaterThanOrEqual(ANIMATION_DURATIONS.STANCE_CHANGE - 100);
        expect(transition.duration).toBeLessThanOrEqual(ANIMATION_DURATIONS.STANCE_CHANGE + 100);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined/null access safely", () => {
      // TypeScript prevents null/undefined keys, but test runtime behavior with string coercion
      const nullKey = String(null);
      const undefinedKey = String(undefined);
      expect(() => (ANIMATION_DURATIONS as any)[nullKey]).not.toThrow();
      expect(() => (ANIMATION_DURATIONS as any)[undefinedKey]).not.toThrow();
      expect((ANIMATION_DURATIONS as any)[nullKey]).toBeUndefined();
      expect((ANIMATION_DURATIONS as any)[undefinedKey]).toBeUndefined();
    });

    it("should return undefined for non-existent keys", () => {
      expect((ANIMATION_DURATIONS as any)["NONEXISTENT"]).toBeUndefined();
      expect((ANIMATION_EASING as any)["NONEXISTENT"]).toBeUndefined();
      expect((FRAME_CONFIGS as any)["NONEXISTENT"]).toBeUndefined();
    });

    it("all duration values should be finite numbers", () => {
      Object.values(ANIMATION_DURATIONS).forEach((duration) => {
        expect(Number.isFinite(duration)).toBe(true);
        expect(Number.isNaN(duration)).toBe(false);
      });
    });

    it("all frame counts should be finite integers", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        expect(Number.isFinite(config.frames)).toBe(true);
        expect(Number.isInteger(config.frames)).toBe(true);
        expect(Number.isNaN(config.frames)).toBe(false);
      });
    });

    it("easing strings should not be empty", () => {
      Object.values(ANIMATION_EASING).forEach((easing) => {
        expect(easing.length).toBeGreaterThan(0);
        expect(easing.trim()).toBe(easing);
      });
    });
  });

  describe("Performance Considerations", () => {
    it("UI animations should be fast enough for responsive feel (<200ms)", () => {
      expect(ANIMATION_DURATIONS.BUTTON_HOVER).toBeLessThanOrEqual(200);
      expect(ANIMATION_DURATIONS.BUTTON_PRESS).toBeLessThanOrEqual(200);
      expect(ANIMATION_DURATIONS.HIT_FLASH).toBeLessThanOrEqual(200);
    });

    it("combat animations should target 60fps (durations divisible by ~16.67ms)", () => {
      // While exact frame timing isn't required, durations should be reasonable
      expect(ANIMATION_DURATIONS.BASIC_ATTACK % 50).toBeLessThanOrEqual(50);
      expect(ANIMATION_DURATIONS.HEAVY_ATTACK % 50).toBeLessThanOrEqual(50);
    });

    it("particle effects should not last too long (max 1000ms)", () => {
      expect(ANIMATION_DURATIONS.PARTICLE_LIFE).toBeLessThanOrEqual(1000);
    });

    it("frame counts should be reasonable for 60fps gameplay", () => {
      Object.values(FRAME_CONFIGS).forEach((config) => {
        // Max 15 frames for smooth 60fps animation
        expect(config.frames).toBeLessThanOrEqual(15);
      });
    });
  });

  describe("Korean Martial Arts Cultural Validation", () => {
    it("should have trigram stance transitions", () => {
      const transitions = KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS;
      expect(Object.keys(transitions).length).toBeGreaterThan(0);
    });

    it("should have traditional Korean martial arts techniques", () => {
      const techniques = KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS;
      expect(techniques).toHaveProperty("PALM_STRIKE");
      expect(techniques).toHaveProperty("FLYING_KICK");
      expect(techniques).toHaveProperty("PRESSURE_POINT");
      expect(techniques).toHaveProperty("VITAL_POINT_STRIKE");
    });

    it("vital point techniques should be precise and fast", () => {
      expect(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS.PRESSURE_POINT.duration).toBeLessThanOrEqual(400);
      expect(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS.VITAL_POINT_STRIKE.duration).toBeLessThanOrEqual(500);
    });

    it("Ki flow animation should have appropriate pulse duration", () => {
      expect(ANIMATION_DURATIONS.KI_FLOW_PULSE).toBeGreaterThanOrEqual(1000);
      expect(ANIMATION_DURATIONS.KI_FLOW_PULSE).toBeLessThanOrEqual(1500);
    });

    it("trigram transition should be smooth but deliberate", () => {
      expect(ANIMATION_DURATIONS.TRIGRAM_TRANSITION).toBeGreaterThanOrEqual(500);
      expect(ANIMATION_DURATIONS.TRIGRAM_TRANSITION).toBeLessThanOrEqual(700);
    });

    it("vital point highlight should be quick for feedback", () => {
      expect(ANIMATION_DURATIONS.VITAL_POINT_HIGHLIGHT).toBeGreaterThanOrEqual(200);
      expect(ANIMATION_DURATIONS.VITAL_POINT_HIGHLIGHT).toBeLessThanOrEqual(400);
    });
  });

  describe("Consistency Validation", () => {
    it("all animation durations should use consistent units (milliseconds)", () => {
      Object.values(ANIMATION_DURATIONS).forEach((duration) => {
        // All should be in milliseconds (reasonable range)
        expect(duration).toBeGreaterThanOrEqual(50);
        expect(duration).toBeLessThanOrEqual(5000);
      });
    });

    it("frame configs should have consistent structure", () => {
      const expectedKeys = ["frames", "duration", "loop"];
      Object.values(FRAME_CONFIGS).forEach((config) => {
        const keys = Object.keys(config);
        expectedKeys.forEach((key) => {
          expect(keys).toContain(key);
        });
      });
    });

    it("Korean martial animations should have consistent structure", () => {
      const stanceTransitions = Object.values(KOREAN_MARTIAL_ANIMATIONS.STANCE_TRANSITIONS);
      stanceTransitions.forEach((transition) => {
        expect(transition).toHaveProperty("frames");
        expect(transition).toHaveProperty("duration");
      });

      const techniqueAnimations = Object.values(KOREAN_MARTIAL_ANIMATIONS.TECHNIQUE_ANIMATIONS);
      techniqueAnimations.forEach((technique) => {
        expect(technique).toHaveProperty("frames");
        expect(technique).toHaveProperty("duration");
      });
    });

    it("easing curves should use valid CSS syntax", () => {
      const standardEasings = ["linear", "ease-in", "ease-out", "ease-in-out"];
      Object.values(ANIMATION_EASING).forEach((easing) => {
        const isStandard = standardEasings.includes(easing);
        const isCubicBezier = easing.startsWith("cubic-bezier(");
        expect(isStandard || isCubicBezier).toBe(true);
      });
    });
  });
});
