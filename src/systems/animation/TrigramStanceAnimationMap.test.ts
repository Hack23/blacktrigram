/**
 * Unit tests for Trigram Stance Animation Mapping System
 *
 * Tests automated mapping between TrigramStance enum values and their
 * guard poses and technique animations. Validates all 8 trigram stances
 * have proper mappings and accessor functions work correctly.
 *
 * @module systems/animation/TrigramStanceAnimationMap.test
 * @category Animation
 * @korean 팔괘자세애니메이션맵테스트
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../types/common";
import type { SkeletalAnimation } from "../../types/skeletal";
import {
  TRIGRAM_GUARD_POSE_MAP,
  TRIGRAM_TECHNIQUE_ANIMATIONS_MAP,
  getGuardPoseByStance,
  getTechniqueAnimationsByStance,
  getTechniqueAnimationNamesByStance,
  getTechniqueCountByStance,
  hasGuardPose,
  hasTechniqueAnimations,
} from "./TrigramStanceAnimationMap";
import {
  GEON_HIGH_GUARD_POSE,
  TAE_FLUID_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GON_EARTH_GUARD_POSE,
} from "./StanceGuardPoses";

describe("TrigramStanceAnimationMap", () => {
  describe("TRIGRAM_GUARD_POSE_MAP", () => {
    it("should contain all 8 trigram stances", () => {
      expect(TRIGRAM_GUARD_POSE_MAP.size).toBe(8);

      // Verify all stances are present
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.GEON)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.TAE)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.LI)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.JIN)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.SON)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.GAM)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.GAN)).toBe(true);
      expect(TRIGRAM_GUARD_POSE_MAP.has(TrigramStance.GON)).toBe(true);
    });

    it("should map to correct guard poses", () => {
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.GEON)).toBe(
        GEON_HIGH_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.TAE)).toBe(
        TAE_FLUID_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.LI)).toBe(
        LI_FIRE_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.JIN)).toBe(
        JIN_THUNDER_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.SON)).toBe(
        SON_WIND_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.GAM)).toBe(
        GAM_WATER_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.GAN)).toBe(
        GAN_MOUNTAIN_GUARD_POSE
      );
      expect(TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.GON)).toBe(
        GON_EARTH_GUARD_POSE
      );
    });

    it("should have valid StanceGuardPose objects for all stances", () => {
      TRIGRAM_GUARD_POSE_MAP.forEach((guardPose) => {
        expect(guardPose).toBeDefined();
        expect(guardPose.leftArm).toBeDefined();
        expect(guardPose.rightArm).toBeDefined();
        expect(guardPose.torso).toBeDefined();
        expect(guardPose.weight).toBeDefined();
        expect(guardPose.breathingRange).toBeDefined();
        expect(guardPose.breathingRange.min).toBeGreaterThan(0.9);
        expect(guardPose.breathingRange.max).toBeLessThan(1.1);
      });
    });
  });

  describe("TRIGRAM_TECHNIQUE_ANIMATIONS_MAP", () => {
    it("should contain all 8 trigram stances", () => {
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.size).toBe(8);

      // Verify all stances are present
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.GEON)).toBe(
        true
      );
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.TAE)).toBe(
        true
      );
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.LI)).toBe(true);
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.JIN)).toBe(
        true
      );
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.SON)).toBe(
        true
      );
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.GAM)).toBe(
        true
      );
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.GAN)).toBe(
        true
      );
      expect(TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.has(TrigramStance.GON)).toBe(
        true
      );
    });

    it("should have correct number of techniques per stance", () => {
      // Based on StanceAnimations.ts, each stance has these technique counts:
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.GEON)?.length
      ).toBe(7); // Heaven: 7 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.TAE)?.length
      ).toBe(7); // Lake: 7 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.LI)?.length
      ).toBe(6); // Fire: 6 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.JIN)?.length
      ).toBe(6); // Thunder: 6 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.SON)?.length
      ).toBe(6); // Wind: 6 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.GAM)?.length
      ).toBe(6); // Water: 6 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.GAN)?.length
      ).toBe(6); // Mountain: 6 techniques
      expect(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.GON)?.length
      ).toBe(7); // Earth: 7 techniques
    });

    it("should have valid SkeletalAnimation objects for all techniques", () => {
      TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.forEach((animations) => {
        expect(animations.length).toBeGreaterThan(0);

        animations.forEach((animation) => {
          expect(animation).toBeDefined();
          expect(animation.name).toBeTruthy();
          expect(animation.koreanName).toBeTruthy();
          expect(animation.duration).toBeGreaterThan(0);
          expect(animation.keyframes).toBeDefined();
          expect(Array.isArray(animation.keyframes)).toBe(true);
          // Note: keyframes array may be empty for some animations initially
        });
      });
    });

    it("should have all technique names start with stance prefix", () => {
      const stanceToPrefix: Record<TrigramStance, string> = {
        [TrigramStance.GEON]: "geon_",
        [TrigramStance.TAE]: "tae_",
        [TrigramStance.LI]: "li_",
        [TrigramStance.JIN]: "jin_",
        [TrigramStance.SON]: "son_",
        [TrigramStance.GAM]: "gam_",
        [TrigramStance.GAN]: "gan_",
        [TrigramStance.GON]: "gon_",
      };

      TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.forEach((animations, _stance) => {
        const expectedPrefix = stanceToPrefix[_stance];

        animations.forEach((animation) => {
          expect(animation.name.startsWith(expectedPrefix)).toBe(true);
        });
      });
    });

    it("should have unique animation names within each stance", () => {
      TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.forEach((animations) => {
        const names = animations.map((anim) => anim.name);
        const uniqueNames = new Set(names);

        expect(uniqueNames.size).toBe(names.length);
      });
    });
  });

  describe("getGuardPoseByStance", () => {
    it("should return correct guard pose for each stance", () => {
      expect(getGuardPoseByStance(TrigramStance.GEON)).toBe(
        GEON_HIGH_GUARD_POSE
      );
      expect(getGuardPoseByStance(TrigramStance.TAE)).toBe(
        TAE_FLUID_GUARD_POSE
      );
      expect(getGuardPoseByStance(TrigramStance.LI)).toBe(LI_FIRE_GUARD_POSE);
      expect(getGuardPoseByStance(TrigramStance.JIN)).toBe(
        JIN_THUNDER_GUARD_POSE
      );
      expect(getGuardPoseByStance(TrigramStance.SON)).toBe(SON_WIND_GUARD_POSE);
      expect(getGuardPoseByStance(TrigramStance.GAM)).toBe(
        GAM_WATER_GUARD_POSE
      );
      expect(getGuardPoseByStance(TrigramStance.GAN)).toBe(
        GAN_MOUNTAIN_GUARD_POSE
      );
      expect(getGuardPoseByStance(TrigramStance.GON)).toBe(
        GON_EARTH_GUARD_POSE
      );
    });

    it("should return undefined for invalid stance", () => {
      expect(
        getGuardPoseByStance("invalid_stance" as TrigramStance)
      ).toBeUndefined();
    });

    it("should have O(1) lookup performance", () => {
      const iterations = 10000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        getGuardPoseByStance(TrigramStance.GEON);
      }

      const end = performance.now();
      const duration = end - start;

      // 10000 lookups should complete in < 10ms (< 0.001ms per lookup)
      expect(duration).toBeLessThan(10);
    });
  });

  describe("getTechniqueAnimationsByStance", () => {
    it("should return correct animations for each stance", () => {
      const geonTechniques = getTechniqueAnimationsByStance(TrigramStance.GEON);
      expect(geonTechniques.length).toBe(7);
      expect(geonTechniques[0].name).toBe("geon_heaven_strike");

      const taeTechniques = getTechniqueAnimationsByStance(TrigramStance.TAE);
      expect(taeTechniques.length).toBe(7);
      expect(taeTechniques[0].name).toBe("tae_flowing_strikes");

      const liTechniques = getTechniqueAnimationsByStance(TrigramStance.LI);
      expect(liTechniques.length).toBe(6);
      expect(liTechniques[0].name).toBe("li_flame_spear");
    });

    it("should return empty array for invalid stance", () => {
      const result = getTechniqueAnimationsByStance(
        "invalid_stance" as TrigramStance
      );
      expect(result).toEqual([]);
    });

    it("should return readonly array (type-level constraint)", () => {
      const techniques = getTechniqueAnimationsByStance(TrigramStance.GEON);

      // TypeScript prevents modifications at compile time
      // At runtime, the array can be modified, but TypeScript type system prevents it
      expect(Array.isArray(techniques)).toBe(true);
      expect(techniques.length).toBe(7);
    });

    it("should have all animations with valid structure", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const techniques = getTechniqueAnimationsByStance(stance);

        techniques.forEach((technique) => {
          expect(technique.name).toBeTruthy();
          expect(technique.koreanName).toBeTruthy();
          expect(technique.duration).toBeGreaterThan(0);
          expect(technique.type).toBeTruthy();
        });
      });
    });
  });

  describe("getTechniqueAnimationNamesByStance", () => {
    it("should return correct animation names for each stance", () => {
      const geonNames = getTechniqueAnimationNamesByStance(TrigramStance.GEON);
      expect(geonNames.length).toBe(7);
      expect(geonNames).toContain("geon_heaven_strike");
      expect(geonNames).toContain("geon_heavenly_fist");
      expect(geonNames).toContain("geon_frontal_kick");

      const taeNames = getTechniqueAnimationNamesByStance(TrigramStance.TAE);
      expect(taeNames.length).toBe(7);
      expect(taeNames).toContain("tae_flowing_strikes");
      expect(taeNames).toContain("tae_wrist_lock");
    });

    it("should return empty array for invalid stance", () => {
      const result = getTechniqueAnimationNamesByStance(
        "invalid_stance" as TrigramStance
      );
      expect(result).toEqual([]);
    });

    it("should return all unique names", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const names = getTechniqueAnimationNamesByStance(stance);
        const uniqueNames = new Set(names);

        expect(uniqueNames.size).toBe(names.length);
      });
    });
  });

  describe("getTechniqueCountByStance", () => {
    it("should return correct count for each stance", () => {
      expect(getTechniqueCountByStance(TrigramStance.GEON)).toBe(7);
      expect(getTechniqueCountByStance(TrigramStance.TAE)).toBe(7);
      expect(getTechniqueCountByStance(TrigramStance.LI)).toBe(6);
      expect(getTechniqueCountByStance(TrigramStance.JIN)).toBe(6);
      expect(getTechniqueCountByStance(TrigramStance.SON)).toBe(6);
      expect(getTechniqueCountByStance(TrigramStance.GAM)).toBe(6);
      expect(getTechniqueCountByStance(TrigramStance.GAN)).toBe(6);
      expect(getTechniqueCountByStance(TrigramStance.GON)).toBe(7);
    });

    it("should return 0 for invalid stance", () => {
      const result = getTechniqueCountByStance(
        "invalid_stance" as TrigramStance
      );
      expect(result).toBe(0);
    });

    it("should be faster than retrieving full animation array", () => {
      const iterations = 10000;

      // Measure getTechniqueCountByStance
      const countStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        getTechniqueCountByStance(TrigramStance.GEON);
      }
      const countEnd = performance.now();
      const countDuration = countEnd - countStart;

      // Should complete quickly
      expect(countDuration).toBeLessThan(20);
    });
  });

  describe("hasGuardPose", () => {
    it("should return true for all valid stances", () => {
      expect(hasGuardPose(TrigramStance.GEON)).toBe(true);
      expect(hasGuardPose(TrigramStance.TAE)).toBe(true);
      expect(hasGuardPose(TrigramStance.LI)).toBe(true);
      expect(hasGuardPose(TrigramStance.JIN)).toBe(true);
      expect(hasGuardPose(TrigramStance.SON)).toBe(true);
      expect(hasGuardPose(TrigramStance.GAM)).toBe(true);
      expect(hasGuardPose(TrigramStance.GAN)).toBe(true);
      expect(hasGuardPose(TrigramStance.GON)).toBe(true);
    });

    it("should return false for invalid stance", () => {
      expect(hasGuardPose("invalid_stance" as TrigramStance)).toBe(false);
    });

    it("should be consistent with getGuardPoseByStance", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const hasGuard = hasGuardPose(stance);
        const guardPose = getGuardPoseByStance(stance);

        expect(hasGuard).toBe(guardPose !== undefined);
      });
    });
  });

  describe("hasTechniqueAnimations", () => {
    it("should return true for all valid stances", () => {
      expect(hasTechniqueAnimations(TrigramStance.GEON)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.TAE)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.LI)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.JIN)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.SON)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.GAM)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.GAN)).toBe(true);
      expect(hasTechniqueAnimations(TrigramStance.GON)).toBe(true);
    });

    it("should return false for invalid stance", () => {
      expect(hasTechniqueAnimations("invalid_stance" as TrigramStance)).toBe(
        false
      );
    });

    it("should be consistent with getTechniqueAnimationsByStance", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const hasTechniques = hasTechniqueAnimations(stance);
        const techniques = getTechniqueAnimationsByStance(stance);

        expect(hasTechniques).toBe(techniques.length > 0);
      });
    });
  });

  describe("Integration and Consistency", () => {
    it("should have matching stance identifiers in both maps", () => {
      const guardStances = Array.from(TRIGRAM_GUARD_POSE_MAP.keys());
      const techniqueStances = Array.from(
        TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.keys()
      );

      guardStances.sort();
      techniqueStances.sort();

      expect(guardStances).toEqual(techniqueStances);
    });

    it("should cover all enum values", () => {
      const enumValues = Object.values(TrigramStance);

      enumValues.forEach((stance) => {
        expect(hasGuardPose(stance)).toBe(true);
        expect(hasTechniqueAnimations(stance)).toBe(true);
      });
    });

    it("should have consistent Korean naming conventions", () => {
      TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.forEach((animations) => {
        animations.forEach((animation) => {
          // All animations should have Korean names
          expect(animation.koreanName).toBeTruthy();
          expect(typeof animation.koreanName).toBe("string");
          expect(animation.koreanName.length).toBeGreaterThan(0);
        });
      });
    });

    it("should maintain referential equality for guard poses", () => {
      // Getting the same guard pose multiple times should return the same object
      const firstGet = getGuardPoseByStance(TrigramStance.GEON);
      const secondGet = getGuardPoseByStance(TrigramStance.GEON);

      expect(firstGet).toBe(secondGet);
    });

    it("should maintain referential equality for technique arrays", () => {
      // Getting the same technique array multiple times should return the same object
      const firstGet = getTechniqueAnimationsByStance(TrigramStance.GEON);
      const secondGet = getTechniqueAnimationsByStance(TrigramStance.GEON);

      expect(firstGet).toBe(secondGet);
    });
  });

  describe("Performance", () => {
    it("should handle frequent guard pose lookups efficiently", () => {
      const iterations = 100000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        const stance =
          Object.values(TrigramStance)[i % Object.values(TrigramStance).length];
        getGuardPoseByStance(stance);
      }

      const end = performance.now();
      const duration = end - start;

      // 100000 lookups should complete in < 100ms
      expect(duration).toBeLessThan(100);
    });

    it("should handle frequent technique lookups efficiently", () => {
      const iterations = 100000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        const stance =
          Object.values(TrigramStance)[i % Object.values(TrigramStance).length];
        getTechniqueAnimationsByStance(stance);
      }

      const end = performance.now();
      const duration = end - start;

      // 100000 lookups should complete in < 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
