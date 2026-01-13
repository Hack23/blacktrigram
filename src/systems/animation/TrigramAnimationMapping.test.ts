/**
 * Trigram Animation Mapping Tests
 *
 * Tests for trigram-aware animation mapping system that links TrigramStance
 * to specific skeletal animations for punches, kicks, and strikes.
 *
 * **Korean**: 팔괘 애니메이션 매핑 테스트
 *
 * @module systems/animation/__tests__/TrigramAnimationMapping
 * @korean 팔괘애니메이션매핑테스트
 */

import { describe, it, expect } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  getAnimationsForStance,
  getAnimationForTechnique,
  hasTechniqueAnimation,
  TRIGRAM_ANIMATION_MAP,
  type StanceAnimationSet,
} from "./TrigramAnimationMapping";

describe("TrigramAnimationMapping", () => {
  describe("TRIGRAM_ANIMATION_MAP", () => {
    it("should have mappings for all 8 trigram stances", () => {
      const stances = Object.values(TrigramStance);
      expect(stances.length).toBe(8);

      stances.forEach((stance) => {
        expect(TRIGRAM_ANIMATION_MAP[stance]).toBeDefined();
      });
    });

    it("should have punch, kick, and strike animations for each stance", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const animSet = TRIGRAM_ANIMATION_MAP[stance];
        expect(animSet.punch, `${stance} should have punch animation`).toBeDefined();
        expect(animSet.kick, `${stance} should have kick animation`).toBeDefined();
        expect(animSet.strike, `${stance} should have strike animation`).toBeDefined();
      });
    });

    it("should have unique animations per stance (reflecting philosophy)", () => {
      const geonAnims = TRIGRAM_ANIMATION_MAP[TrigramStance.GEON];
      const taeAnims = TRIGRAM_ANIMATION_MAP[TrigramStance.TAE];

      // Different stances should have different animations
      expect(geonAnims.punch.name).not.toBe(taeAnims.punch.name);
    });
  });

  describe("getAnimationsForStance", () => {
    it("should return animation set for Geon (Heaven) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.GEON);

      expect(animSet).toBeDefined();
      expect(animSet.punch).toBeDefined();
      expect(animSet.kick).toBeDefined();
      expect(animSet.strike).toBeDefined();
    });

    it("should return animation set for Tae (Lake) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.TAE);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("tae");
    });

    it("should return animation set for Li (Fire) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.LI);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("li");
    });

    it("should return animation set for Jin (Thunder) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.JIN);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("jin");
    });

    it("should return animation set for Son (Wind) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.SON);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("son");
    });

    it("should return animation set for Gam (Water) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.GAM);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("gam");
    });

    it("should return animation set for Gan (Mountain) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.GAN);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("gan");
    });

    it("should return animation set for Gon (Earth) stance", () => {
      const animSet = getAnimationsForStance(TrigramStance.GON);

      expect(animSet).toBeDefined();
      expect(animSet.punch.name).toContain("gon");
    });
  });

  describe("getAnimationForTechnique", () => {
    it("should return punch animation for Geon stance", () => {
      const animation = getAnimationForTechnique(TrigramStance.GEON, "punch");

      expect(animation).toBeDefined();
      expect(animation?.name).toContain("geon");
      expect(animation?.koreanName).toBeTruthy();
    });

    it("should return kick animation for any stance", () => {
      const animation = getAnimationForTechnique(TrigramStance.GEON, "kick");

      expect(animation).toBeDefined();
      expect(animation?.type).toBe("attack");
    });

    it("should return strike animation for Geon stance", () => {
      const animation = getAnimationForTechnique(TrigramStance.GEON, "strike");

      expect(animation).toBeDefined();
      expect(animation?.name).toContain("geon");
    });

    it("should return null for invalid technique", () => {
      const animation = getAnimationForTechnique(
        TrigramStance.GEON,
        "invalid" as any
      );

      expect(animation).toBeNull();
    });

    it("should handle case-insensitive technique names", () => {
      const lowerAnimation = getAnimationForTechnique(TrigramStance.GEON, "punch");
      const upperAnimation = getAnimationForTechnique(TrigramStance.GEON, "PUNCH" as any);

      expect(lowerAnimation).toBeDefined();
      expect(upperAnimation).toBeDefined();
      expect(lowerAnimation?.name).toBe(upperAnimation?.name);
    });
  });

  describe("hasTechniqueAnimation", () => {
    it("should return true for valid punch technique", () => {
      expect(hasTechniqueAnimation(TrigramStance.GEON, "punch")).toBe(true);
    });

    it("should return true for valid kick technique", () => {
      expect(hasTechniqueAnimation(TrigramStance.TAE, "kick")).toBe(true);
    });

    it("should return true for valid strike technique", () => {
      expect(hasTechniqueAnimation(TrigramStance.LI, "strike")).toBe(true);
    });

    it("should return false for invalid technique", () => {
      expect(hasTechniqueAnimation(TrigramStance.GEON, "invalid" as any)).toBe(
        false
      );
    });

    it("should return true for all techniques across all stances", () => {
      const stances = Object.values(TrigramStance);
      const techniques: Array<"punch" | "kick" | "strike"> = ["punch", "kick", "strike"];

      stances.forEach((stance) => {
        techniques.forEach((technique) => {
          expect(
            hasTechniqueAnimation(stance, technique),
            `${stance} should have ${technique} animation`
          ).toBe(true);
        });
      });
    });
  });

  describe("Animation Naming Convention", () => {
    it("should follow naming convention: {stance}_{description}", () => {
      const animSet = getAnimationsForStance(TrigramStance.GEON);

      expect(animSet.punch.name).toMatch(/^geon_/);
      expect(animSet.strike.name).toMatch(/^geon_/);
    });

    it("should have Korean names for all animations", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const animSet = getAnimationsForStance(stance);

        expect(animSet.punch.koreanName).toBeTruthy();
        expect(animSet.kick.koreanName).toBeTruthy();
        expect(animSet.strike.koreanName).toBeTruthy();
      });
    });
  });

  describe("Animation Properties", () => {
    it("should have valid duration for all animations", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const animSet = getAnimationsForStance(stance);

        expect(animSet.punch.duration).toBeGreaterThan(0);
        expect(animSet.kick.duration).toBeGreaterThan(0);
        expect(animSet.strike.duration).toBeGreaterThan(0);
      });
    });

    it("should have keyframes for all animations", () => {
      const animSet = getAnimationsForStance(TrigramStance.GEON);

      expect(animSet.punch.keyframes.length).toBeGreaterThan(0);
      expect(animSet.kick.keyframes.length).toBeGreaterThan(0);
      expect(animSet.strike.keyframes.length).toBeGreaterThan(0);
    });

    it("should mark all stance animations as attack type", () => {
      const animSet = getAnimationsForStance(TrigramStance.GEON);

      expect(animSet.punch.type).toBe("attack");
      expect(animSet.kick.type).toBe("attack");
      expect(animSet.strike.type).toBe("attack");
    });
  });
});
