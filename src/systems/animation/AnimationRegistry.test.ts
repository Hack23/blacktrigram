/**
 * Animation Registry Tests - Trigram Support
 *
 * Tests for enhanced AnimationRegistry with trigram-aware pattern matching.
 * Validates automatic resolution of stance-specific animations using
 * TrigramStance and StanceLaterality.
 *
 * **Korean**: 애니메이션 레지스트리 테스트 - 팔괘 지원
 *
 * @module systems/animation/__tests__/AnimationRegistry
 * @korean 애니메이션레지스트리테스트
 */

import { describe, it, expect } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  getAnimation,
  resolveTrigramAnimation,
  getAnimationsForStance,
} from "./AnimationRegistry";

describe("AnimationRegistry - Trigram Support", () => {
  describe("resolveTrigramAnimation", () => {
    describe("Punch Techniques", () => {
      it("should resolve right-handed Geon punch animation", () => {
        const anim = resolveTrigramAnimation("punch", TrigramStance.GEON, "right");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
        expect(anim?.type).toBe("attack");
      });

      it("should resolve left-handed Geon punch animation", () => {
        const anim = resolveTrigramAnimation("punch", TrigramStance.GEON, "left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
        expect(anim?.name).toContain("left");
      });

      it("should resolve right-handed Tae punch animation", () => {
        const anim = resolveTrigramAnimation("punch", TrigramStance.TAE, "right");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("tae");
      });

      it("should resolve left-handed Tae punch animation", () => {
        const anim = resolveTrigramAnimation("punch", TrigramStance.TAE, "left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("tae");
        expect(anim?.name).toContain("left");
      });

      it("should resolve punch for all trigram stances", () => {
        const stances = Object.values(TrigramStance);

        stances.forEach((stance) => {
          const rightAnim = resolveTrigramAnimation("punch", stance, "right");
          const leftAnim = resolveTrigramAnimation("punch", stance, "left");

          expect(rightAnim, `${stance} right punch`).toBeDefined();
          expect(leftAnim, `${stance} left punch`).toBeDefined();
        });
      });
    });

    describe("Kick Techniques", () => {
      it("should resolve right-legged Geon kick animation", () => {
        const anim = resolveTrigramAnimation("kick", TrigramStance.GEON, "right");

        expect(anim).toBeDefined();
        expect(anim?.type).toBe("attack");
      });

      it("should resolve left-legged Geon kick animation", () => {
        const anim = resolveTrigramAnimation("kick", TrigramStance.GEON, "left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("left");
      });

      it("should resolve kick for all trigram stances", () => {
        const stances = Object.values(TrigramStance);

        stances.forEach((stance) => {
          const rightAnim = resolveTrigramAnimation("kick", stance, "right");
          const leftAnim = resolveTrigramAnimation("kick", stance, "left");

          expect(rightAnim, `${stance} right kick`).toBeDefined();
          expect(leftAnim, `${stance} left kick`).toBeDefined();
        });
      });
    });

    describe("Strike Techniques", () => {
      it("should resolve right-handed Geon strike animation", () => {
        const anim = resolveTrigramAnimation("strike", TrigramStance.GEON, "right");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
      });

      it("should resolve left-handed Geon strike animation", () => {
        const anim = resolveTrigramAnimation("strike", TrigramStance.GEON, "left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
        expect(anim?.name).toContain("left");
      });

      it("should resolve strike for all trigram stances", () => {
        const stances = Object.values(TrigramStance);

        stances.forEach((stance) => {
          const rightAnim = resolveTrigramAnimation("strike", stance, "right");
          const leftAnim = resolveTrigramAnimation("strike", stance, "left");

          expect(rightAnim, `${stance} right strike`).toBeDefined();
          expect(leftAnim, `${stance} left strike`).toBeDefined();
        });
      });
    });

    describe("Invalid Techniques", () => {
      it("should return null for invalid technique", () => {
        const anim = resolveTrigramAnimation("invalid", TrigramStance.GEON, "right");

        expect(anim).toBeNull();
      });

      it("should return null for empty technique string", () => {
        const anim = resolveTrigramAnimation("", TrigramStance.GEON, "right");

        expect(anim).toBeNull();
      });
    });

    describe("Laterality Application", () => {
      it("should return original animation for right laterality", () => {
        const rightAnim = resolveTrigramAnimation("punch", TrigramStance.GEON, "right");

        expect(rightAnim?.name).not.toContain("left");
      });

      it("should return mirrored animation for left laterality", () => {
        const leftAnim = resolveTrigramAnimation("punch", TrigramStance.GEON, "left");

        expect(leftAnim?.name).toContain("left");
        expect(leftAnim?.koreanName).toContain("왼쪽");
      });

      it("should create different animations for left vs right", () => {
        const rightAnim = resolveTrigramAnimation("punch", TrigramStance.GEON, "right");
        const leftAnim = resolveTrigramAnimation("punch", TrigramStance.GEON, "left");

        expect(rightAnim).toBeDefined();
        expect(leftAnim).toBeDefined();
        expect(rightAnim?.name).not.toBe(leftAnim?.name);
      });
    });

    describe("Case Insensitivity", () => {
      it("should handle uppercase technique names", () => {
        const anim = resolveTrigramAnimation("PUNCH", TrigramStance.GEON, "right");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
      });

      it("should handle mixed case technique names", () => {
        const anim = resolveTrigramAnimation("Kick", TrigramStance.TAE, "right");

        expect(anim).toBeDefined();
      });
    });
  });

  describe("getAnimation - Trigram Patterns", () => {
    describe("Pattern Matching", () => {
      it("should resolve pattern: geon_punch_right", () => {
        const anim = getAnimation("geon_punch_right");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
      });

      it("should resolve pattern: geon_punch_left", () => {
        const anim = getAnimation("geon_punch_left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("geon");
        expect(anim?.name).toContain("left");
      });

      it("should resolve pattern: tae_kick_right", () => {
        const anim = getAnimation("tae_kick_right");

        expect(anim).toBeDefined();
      });

      it("should resolve pattern: tae_kick_left", () => {
        const anim = getAnimation("tae_kick_left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("left");
      });

      it("should resolve pattern: li_strike_right", () => {
        const anim = getAnimation("li_strike_right");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("li");
      });

      it("should resolve pattern: li_strike_left", () => {
        const anim = getAnimation("li_strike_left");

        expect(anim).toBeDefined();
        expect(anim?.name).toContain("li");
        expect(anim?.name).toContain("left");
      });
    });

    describe("All Stance Patterns", () => {
      it("should resolve punch patterns for all stances", () => {
        const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];

        stances.forEach((stance) => {
          const rightAnim = getAnimation(`${stance}_punch_right`);
          const leftAnim = getAnimation(`${stance}_punch_left`);

          expect(rightAnim, `${stance}_punch_right`).toBeDefined();
          expect(leftAnim, `${stance}_punch_left`).toBeDefined();
        });
      });

      it("should resolve kick patterns for all stances", () => {
        const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];

        stances.forEach((stance) => {
          const rightAnim = getAnimation(`${stance}_kick_right`);
          const leftAnim = getAnimation(`${stance}_kick_left`);

          expect(rightAnim, `${stance}_kick_right`).toBeDefined();
          expect(leftAnim, `${stance}_kick_left`).toBeDefined();
        });
      });

      it("should resolve strike patterns for all stances", () => {
        const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];

        stances.forEach((stance) => {
          const rightAnim = getAnimation(`${stance}_strike_right`);
          const leftAnim = getAnimation(`${stance}_strike_left`);

          expect(rightAnim, `${stance}_strike_right`).toBeDefined();
          expect(leftAnim, `${stance}_strike_left`).toBeDefined();
        });
      });
    });

    describe("Fallback Behavior", () => {
      it("should fallback to generic animation for non-trigram patterns", () => {
        const anim = getAnimation("front_kick");

        expect(anim).toBeDefined();
        expect(anim?.name).toBe("front_kick");
      });

      it("should return undefined for completely invalid patterns", () => {
        const anim = getAnimation("invalid_animation_name");

        expect(anim).toBeUndefined();
      });

      it("should fallback to generic for invalid trigram stance", () => {
        const anim = getAnimation("invalid_punch_right");

        expect(anim).toBeUndefined();
      });

      it("should fallback to generic for invalid technique", () => {
        const anim = getAnimation("geon_invalid_right");

        expect(anim).toBeUndefined();
      });
    });

    describe("Case Insensitivity", () => {
      it("should handle uppercase stance names", () => {
        const anim = getAnimation("GEON_punch_right");

        expect(anim).toBeDefined();
      });

      it("should handle uppercase technique names", () => {
        const anim = getAnimation("geon_PUNCH_right");

        expect(anim).toBeDefined();
      });

      it("should handle uppercase laterality", () => {
        const anim = getAnimation("geon_punch_RIGHT");

        expect(anim).toBeDefined();
      });

      it("should handle mixed case patterns", () => {
        const anim = getAnimation("Geon_Punch_Left");

        expect(anim).toBeDefined();
      });
    });
  });

  describe("Performance", () => {
    it("should complete single lookup in <0.5ms", () => {
      const start = performance.now();
      getAnimation("geon_punch_right");
      const end = performance.now();

      expect(end - start).toBeLessThan(0.5);
    });

    it("should complete 100 lookups in <50ms (<0.5ms average)", () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        getAnimation("geon_punch_right");
      }

      const end = performance.now();
      const totalTime = end - start;

      expect(totalTime).toBeLessThan(50); // 100 lookups <50ms = <0.5ms each
    });

    it("should complete 1000 lookups in <500ms (<0.5ms average)", () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        getAnimation("tae_kick_left");
      }

      const end = performance.now();
      const totalTime = end - start;

      expect(totalTime).toBeLessThan(500); // 1000 lookups <500ms = <0.5ms each
    });

    it("should handle mixed pattern lookups efficiently", () => {
      const patterns = [
        "geon_punch_right",
        "tae_kick_left",
        "li_strike_right",
        "jin_punch_left",
        "front_kick",
        "roundhouse_kick",
      ];

      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        const pattern = patterns[i % patterns.length];
        getAnimation(pattern);
      }

      const end = performance.now();
      const totalTime = end - start;

      expect(totalTime).toBeLessThan(50);
    });
  });

  describe("Integration with getAnimationsForStance", () => {
    it("should return consistent results between direct and pattern lookup", () => {
      const directAnimSet = getAnimationsForStance(TrigramStance.GEON);
      const patternAnimPunch = getAnimation("geon_punch_right");

      expect(patternAnimPunch?.name).toBe(directAnimSet.punch.name);
    });

    it("should apply laterality correctly in pattern lookup", () => {
      const directAnimSet = getAnimationsForStance(TrigramStance.TAE);
      const patternAnimLeft = getAnimation("tae_punch_left");

      // Pattern lookup should add left suffix
      expect(patternAnimLeft?.name).toContain("left");
      // Base animation should not have left suffix
      expect(directAnimSet.punch.name).not.toContain("left");
    });
  });

  describe("Animation Properties", () => {
    it("should return valid animation with all required properties", () => {
      const anim = getAnimation("geon_punch_right");

      expect(anim).toBeDefined();
      expect(anim?.name).toBeTruthy();
      expect(anim?.koreanName).toBeTruthy();
      expect(anim?.duration).toBeGreaterThan(0);
      expect(anim?.keyframes).toBeDefined();
      expect(anim?.keyframes.length).toBeGreaterThan(0);
      expect(anim?.type).toBe("attack");
    });

    it("should maintain Korean names in resolved animations", () => {
      const rightAnim = getAnimation("geon_punch_right");
      const leftAnim = getAnimation("geon_punch_left");

      expect(rightAnim?.koreanName).toBeTruthy();
      expect(leftAnim?.koreanName).toBeTruthy();
      expect(leftAnim?.koreanName).toContain("왼쪽");
    });
  });
});
