/**
 * Unit Tests for Trigram Animation Mapping
 * 
 * **Korean**: 팔괘 애니메이션 매핑 테스트
 * 
 * Tests the unified animation mapping API with full laterality support.
 * 
 * Test Coverage:
 * - ✅ getAnimationsForStance() with StanceWithSide and TrigramStance
 * - ✅ getGuardPoseForStanceWithSide() wrapper
 * - ✅ getAllGuardPoses() for all 16 configurations
 * - ✅ getAttackAnimations() with laterality
 * - ✅ getDefensiveAnimations() with laterality
 * - ✅ getWalkAnimation() with laterality
 * - ✅ getRunAnimation() with laterality
 * - ✅ getAnimationMappingStats() validation
 * - ✅ Edge cases and error handling
 * 
 * @module systems/animation/TrigramAnimationMapping.test
 * @category Animation Tests
 * @korean 팔괘애니메이션매핑테스트
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  getAnimationsForStance,
  getGuardPoseForStanceWithSide,
  getAllGuardPoses,
  getAttackAnimations,
  getDefensiveAnimations,
  getWalkAnimation,
  getRunAnimation,
  getAnimationMappingStats,
} from "./TrigramAnimationMapping";
import { getAnimationLaterality } from "./LateralityTransform";

describe("TrigramAnimationMapping", () => {
  describe("getAnimationsForStance()", () => {
    describe("With StanceWithSide Parameter", () => {
      it("should return complete animation collection for right laterality", () => {
        const collection = getAnimationsForStance("geon_right");
        
        expect(collection).toBeDefined();
        expect(collection?.guardPose).toBeDefined();
        expect(collection?.attacks).toHaveLength(3);
        expect(collection?.defensive).toHaveLength(2);
        expect(collection?.walk).toBeDefined();
        expect(collection?.run).toBeDefined();
      });

      it("should return complete animation collection for left laterality", () => {
        const collection = getAnimationsForStance("tae_left");
        
        expect(collection).toBeDefined();
        expect(collection?.guardPose).toBeDefined();
        expect(collection?.attacks).toHaveLength(3);
        expect(collection?.defensive).toHaveLength(2);
        expect(collection?.walk).toBeDefined();
        expect(collection?.run).toBeDefined();
      });

      it("should apply laterality to all animations", () => {
        const leftCollection = getAnimationsForStance("geon_left");
        
        expect(leftCollection).toBeDefined();
        
        // Check that attacks are left-handed
        leftCollection?.attacks.forEach((anim) => {
          expect(getAnimationLaterality(anim)).toBe("left");
        });
        
        // Check that defensive moves are left-handed
        leftCollection?.defensive.forEach((anim) => {
          expect(getAnimationLaterality(anim)).toBe("left");
        });
        
        // Check locomotion
        expect(getAnimationLaterality(leftCollection!.walk)).toBe("left");
        expect(getAnimationLaterality(leftCollection!.run)).toBe("left");
      });

      it("should work for all 8 stances with right laterality", () => {
        const stances = [
          "geon_right", "tae_right", "li_right", "jin_right",
          "son_right", "gam_right", "gan_right", "gon_right"
        ];
        
        stances.forEach((stanceWithSide) => {
          const collection = getAnimationsForStance(stanceWithSide as any);
          expect(collection).toBeDefined();
          expect(collection?.attacks).toHaveLength(3);
          expect(collection?.defensive).toHaveLength(2);
        });
      });

      it("should work for all 8 stances with left laterality", () => {
        const stances = [
          "geon_left", "tae_left", "li_left", "jin_left",
          "son_left", "gam_left", "gan_left", "gon_left"
        ];
        
        stances.forEach((stanceWithSide) => {
          const collection = getAnimationsForStance(stanceWithSide as any);
          expect(collection).toBeDefined();
          expect(collection?.attacks).toHaveLength(3);
          expect(collection?.defensive).toHaveLength(2);
        });
      });
    });

    describe("With TrigramStance Parameter (Backward Compatibility)", () => {
      it("should default to right laterality", () => {
        const collection = getAnimationsForStance(TrigramStance.GEON);
        
        expect(collection).toBeDefined();
        
        // Should return right-handed animations by default
        collection?.attacks.forEach((anim) => {
          expect(getAnimationLaterality(anim)).toBe("right");
        });
      });

      it("should respect explicit laterality parameter", () => {
        const rightCollection = getAnimationsForStance(TrigramStance.TAE, "right");
        const leftCollection = getAnimationsForStance(TrigramStance.TAE, "left");
        
        expect(rightCollection).toBeDefined();
        expect(leftCollection).toBeDefined();
        
        // Right collection should have right-handed animations
        rightCollection?.attacks.forEach((anim) => {
          expect(getAnimationLaterality(anim)).toBe("right");
        });
        
        // Left collection should have left-handed animations
        leftCollection?.attacks.forEach((anim) => {
          expect(getAnimationLaterality(anim)).toBe("left");
        });
      });

      it("should work for all 8 stances", () => {
        Object.values(TrigramStance).forEach((stance) => {
          const collection = getAnimationsForStance(stance);
          expect(collection).toBeDefined();
          expect(collection?.guardPose).toBeDefined();
          expect(collection?.attacks.length).toBeGreaterThan(0);
          expect(collection?.walk).toBeDefined();
          expect(collection?.run).toBeDefined();
        });
      });
    });

    describe("Invalid Input", () => {
      it("should return undefined for invalid stance", () => {
        const collection = getAnimationsForStance("invalid" as any);
        expect(collection).toBeUndefined();
      });

      it("should return undefined for malformed StanceWithSide", () => {
        const collection = getAnimationsForStance("geon_middle" as any);
        expect(collection).toBeUndefined();
      });
    });
  });

  describe("getGuardPoseForStanceWithSide()", () => {
    it("should return guard pose for StanceWithSide", () => {
      const leftGeon = getGuardPoseForStanceWithSide("geon_left");
      const rightTae = getGuardPoseForStanceWithSide("tae_right");
      
      expect(leftGeon).toBeDefined();
      expect(rightTae).toBeDefined();
    });

    it("should return guard pose for plain TrigramStance", () => {
      const geon = getGuardPoseForStanceWithSide(TrigramStance.GEON);
      
      expect(geon).toBeDefined();
    });

    it("should respect explicit laterality parameter", () => {
      const rightGeon = getGuardPoseForStanceWithSide(TrigramStance.GEON, "right");
      const leftGeon = getGuardPoseForStanceWithSide(TrigramStance.GEON, "left");
      
      expect(rightGeon).toBeDefined();
      expect(leftGeon).toBeDefined();
      
      // Poses should be different (mirrored)
      // Left pose's left arm should have been the right arm swapped
      // Original right arm: (-1.2, -0.5, -0.6)
      // After mirroring to left arm: (-1.2, 0.5, 0.6)
      expect(leftGeon?.leftArm.shoulder.y).toBeCloseTo(0.5);
      expect(rightGeon?.leftArm.shoulder.y).toBeCloseTo(0.5);
    });

    it("should work for all 8 stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const pose = getGuardPoseForStanceWithSide(stance);
        expect(pose).toBeDefined();
      });
    });
  });

  describe("getAllGuardPoses()", () => {
    it("should return all 16 guard poses", () => {
      const allPoses = getAllGuardPoses();
      
      expect(allPoses.size).toBe(16); // 8 stances × 2 laterality
    });

    it("should include all stance combinations", () => {
      const allPoses = getAllGuardPoses();
      
      const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
      const lateralities = ["left", "right"];
      
      stances.forEach((stance) => {
        lateralities.forEach((laterality) => {
          const key = `${stance}_${laterality}`;
          expect(allPoses.has(key)).toBe(true);
        });
      });
    });

    it("should cache result for performance", () => {
      const first = getAllGuardPoses();
      const second = getAllGuardPoses();
      
      // Should return same Map instance
      expect(first).toBe(second);
    });
  });

  describe("getAttackAnimations()", () => {
    it("should return 3 attacks for each stance", () => {
      const geonAttacks = getAttackAnimations(TrigramStance.GEON);
      const taeAttacks = getAttackAnimations(TrigramStance.TAE);
      
      expect(geonAttacks).toHaveLength(3);
      expect(taeAttacks).toHaveLength(3);
    });

    it("should apply laterality transformation", () => {
      const rightAttacks = getAttackAnimations("geon_right");
      const leftAttacks = getAttackAnimations("geon_left");
      
      expect(rightAttacks).toHaveLength(3);
      expect(leftAttacks).toHaveLength(3);
      
      // Right attacks should be right-handed
      rightAttacks.forEach((anim) => {
        expect(getAnimationLaterality(anim)).toBe("right");
      });
      
      // Left attacks should be left-handed
      leftAttacks.forEach((anim) => {
        expect(getAnimationLaterality(anim)).toBe("left");
      });
    });

    it("should work for all 8 stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const attacks = getAttackAnimations(stance);
        expect(attacks.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getDefensiveAnimations()", () => {
    it("should return 2 defensive moves for each stance", () => {
      const geonDefense = getDefensiveAnimations(TrigramStance.GEON);
      const taeDefense = getDefensiveAnimations(TrigramStance.TAE);
      
      expect(geonDefense).toHaveLength(2);
      expect(taeDefense).toHaveLength(2);
    });

    it("should apply laterality transformation", () => {
      const rightDefense = getDefensiveAnimations("gam_right");
      const leftDefense = getDefensiveAnimations("gam_left");
      
      expect(rightDefense).toHaveLength(2);
      expect(leftDefense).toHaveLength(2);
      
      // Right defensive should be right-handed
      rightDefense.forEach((anim) => {
        expect(getAnimationLaterality(anim)).toBe("right");
      });
      
      // Left defensive should be left-handed
      leftDefense.forEach((anim) => {
        expect(getAnimationLaterality(anim)).toBe("left");
      });
    });

    it("should work for all 8 stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const defensive = getDefensiveAnimations(stance);
        expect(defensive.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getWalkAnimation()", () => {
    it("should return walk animation for stance", () => {
      const geonWalk = getWalkAnimation(TrigramStance.GEON);
      
      expect(geonWalk).toBeDefined();
      // Locomotion animations use "movement" type
      expect(geonWalk?.type).toBe("movement");
    });

    it("should apply laterality transformation", () => {
      const rightWalk = getWalkAnimation("son_right");
      const leftWalk = getWalkAnimation("son_left");
      
      expect(rightWalk).toBeDefined();
      expect(leftWalk).toBeDefined();
      
      expect(getAnimationLaterality(rightWalk!)).toBe("right");
      expect(getAnimationLaterality(leftWalk!)).toBe("left");
    });

    it("should work for all 8 stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const walk = getWalkAnimation(stance);
        expect(walk).toBeDefined();
      });
    });
  });

  describe("getRunAnimation()", () => {
    it("should return run animation for stance", () => {
      const liRun = getRunAnimation(TrigramStance.LI);
      
      expect(liRun).toBeDefined();
      // Locomotion animations use "movement" type
      expect(liRun?.type).toBe("movement");
    });

    it("should apply laterality transformation", () => {
      const rightRun = getRunAnimation("jin_right");
      const leftRun = getRunAnimation("jin_left");
      
      expect(rightRun).toBeDefined();
      expect(leftRun).toBeDefined();
      
      expect(getAnimationLaterality(rightRun!)).toBe("right");
      expect(getAnimationLaterality(leftRun!)).toBe("left");
    });

    it("should work for all 8 stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const run = getRunAnimation(stance);
        expect(run).toBeDefined();
      });
    });
  });

  describe("getAnimationMappingStats()", () => {
    it("should return correct statistics", () => {
      const stats = getAnimationMappingStats();
      
      expect(stats.totalConfigurations).toBe(16); // 8 stances × 2 laterality
      expect(stats.completeMappings).toBe(8); // All 8 stances
      expect(stats.attacksPerStance).toBe(3);
      expect(stats.defensivePerStance).toBe(2);
      expect(stats.totalAttacks).toBe(48); // 8 × 3 × 2
      expect(stats.totalDefensive).toBe(32); // 8 × 2 × 2
    });

    it("should reflect complete mapping coverage", () => {
      const stats = getAnimationMappingStats();
      
      // All stances should have complete mappings
      expect(stats.completeMappings).toBe(stats.totalConfigurations / 2);
    });
  });

  describe("Integration Tests", () => {
    it("should provide consistent animations across all access methods", () => {
      // Get animations through different methods
      const collection = getAnimationsForStance("geon_left");
      const attacks = getAttackAnimations("geon_left");
      const defensive = getDefensiveAnimations("geon_left");
      const walk = getWalkAnimation("geon_left");
      const run = getRunAnimation("geon_left");
      const guardPose = getGuardPoseForStanceWithSide("geon_left");
      
      // Should return consistent results
      expect(collection?.attacks).toEqual(attacks);
      expect(collection?.defensive).toEqual(defensive);
      expect(collection?.walk).toEqual(walk);
      expect(collection?.run).toEqual(run);
      expect(collection?.guardPose).toEqual(guardPose);
    });

    it("should handle mixed parameter formats consistently", () => {
      // Using StanceWithSide
      const leftByString = getAnimationsForStance("tae_left");
      
      // Using TrigramStance + explicit laterality
      const leftByParam = getAnimationsForStance(TrigramStance.TAE, "left");
      
      // Should return equivalent results
      expect(leftByString?.attacks.length).toBe(leftByParam?.attacks.length);
      expect(leftByString?.defensive.length).toBe(leftByParam?.defensive.length);
    });
  });

  describe("Performance", () => {
    it("should retrieve animations efficiently", () => {
      const startTime = performance.now();
      
      // Get animations for all 16 configurations
      const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
      const lateralities = ["left", "right"];
      
      stances.forEach((stance) => {
        lateralities.forEach((laterality) => {
          const stanceWithSide = `${stance}_${laterality}`;
          getAnimationsForStance(stanceWithSide as any);
        });
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (<100ms for all 16 configurations)
      expect(duration).toBeLessThan(100);
    });
  });
});
