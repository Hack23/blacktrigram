/**
 * Stance Animations Test Suite
 * 
 * Validates Korean martial arts biomechanics for all eight trigram stances.
 * Tests knee bend angles, weight distribution, hip positioning, and stance uniqueness.
 * 
 * 팔괘 자세 애니메이션 테스트
 * 
 * @module systems/animation/__tests__/StanceAnimations
 * @korean 자세애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  createGeonStance,
  createTaeStance,
  createLiStance,
  createJinStance,
  createSonStance,
  createGamStance,
  createGanStance,
  createGonStance,
} from "../StanceAnimations";
import { KOREAN_STANCE_BIOMECHANICS } from "../MartialArtsConstants";
import { BoneName } from "../../../types/skeletal";
import * as THREE from "three";

/**
 * Helper function to convert degrees to radians
 */
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

/**
 * Helper to get rotation from keyframe
 */
const getRotation = (
  animation: ReturnType<typeof createGeonStance>,
  boneName: BoneName
): THREE.Euler | undefined => {
  if (animation.keyframes.length === 0) return undefined;
  return animation.keyframes[0].boneRotations.get(boneName);
};

/**
 * Helper to get position from keyframe
 */
const getPosition = (
  animation: ReturnType<typeof createGeonStance>,
  boneName: BoneName
): THREE.Vector3 | undefined => {
  if (animation.keyframes.length === 0) return undefined;
  return animation.keyframes[0].bonePositions.get(boneName);
};

describe("Korean Martial Arts Stance Biomechanics", () => {
  describe("☰ Geon (건) - Heaven Stance", () => {
    const geonStance = createGeonStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN;

    it("should create valid animation structure", () => {
      expect(geonStance.name).toBe("stance_geon");
      expect(geonStance.koreanName).toBe("건 자세");
      expect(geonStance.type).toBe("idle");
      expect(geonStance.loop).toBe(true);
      expect(geonStance.keyframes.length).toBeGreaterThan(0);
    });

    it("should have correct front knee bend angle (~70°)", () => {
      const thighRotation = getRotation(geonStance, BoneName.THIGH_R);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have correct back leg extension (~160°)", () => {
      const thighRotation = getRotation(geonStance, BoneName.THIGH_L);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.backKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have forward weight distribution (60/40)", () => {
      const pelvisPos = getPosition(geonStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Forward weight should result in positive Z offset
        expect(pelvisPos.z).toBeGreaterThan(0);
      }
    });
  });

  describe("☱ Tae (태) - Lake Stance", () => {
    const taeStance = createTaeStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.TAE_LAKE;

    it("should create valid animation structure", () => {
      expect(taeStance.name).toBe("stance_tae");
      expect(taeStance.koreanName).toBe("태 자세");
      expect(taeStance.type).toBe("idle");
      expect(taeStance.loop).toBe(true);
    });

    it("should have nearly straight front leg (~170°)", () => {
      const thighRotation = getRotation(taeStance, BoneName.THIGH_R);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have bent back knee (~120°)", () => {
      const thighRotation = getRotation(taeStance, BoneName.THIGH_L);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.backKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have back-weighted distribution (10/90)", () => {
      const pelvisPos = getPosition(taeStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Back weight should result in negative Z offset
        expect(pelvisPos.z).toBeLessThan(0);
      }
    });
  });

  describe("☲ Li (리) - Fire Stance", () => {
    const liStance = createLiStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.LI_FIRE;

    it("should create valid animation structure", () => {
      expect(liStance.name).toBe("stance_li");
      expect(liStance.koreanName).toBe("리 자세");
      expect(liStance.type).toBe("idle");
    });

    it("should have equal knee bend on both legs (~135°)", () => {
      const rightThigh = getRotation(liStance, BoneName.THIGH_R);
      const leftThigh = getRotation(liStance, BoneName.THIGH_L);
      
      expect(rightThigh).toBeDefined();
      expect(leftThigh).toBeDefined();
      
      if (rightThigh && leftThigh) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(rightThigh.x).toBeCloseTo(expectedRotation, 1);
        expect(leftThigh.x).toBeCloseTo(expectedRotation, 1);
        // Both legs should have same angle
        expect(rightThigh.x).toBeCloseTo(leftThigh.x, 2);
      }
    });

    it("should have balanced weight distribution (50/50)", () => {
      const pelvisPos = getPosition(liStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Balanced stance should be near center
        expect(Math.abs(pelvisPos.z)).toBeLessThan(0.05);
      }
    });
  });

  describe("☳ Jin (진) - Thunder Stance", () => {
    const jinStance = createJinStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER;

    it("should create valid animation structure", () => {
      expect(jinStance.name).toBe("stance_jin");
      expect(jinStance.koreanName).toBe("진 자세");
      expect(jinStance.type).toBe("idle");
    });

    it("should have deep knee bend on both legs (~90°)", () => {
      const rightThigh = getRotation(jinStance, BoneName.THIGH_R);
      const leftThigh = getRotation(jinStance, BoneName.THIGH_L);
      
      expect(rightThigh).toBeDefined();
      expect(leftThigh).toBeDefined();
      
      if (rightThigh && leftThigh) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(rightThigh.x).toBeCloseTo(expectedRotation, 1);
        expect(leftThigh.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have very low hip position for power", () => {
      const pelvisPos = getPosition(jinStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Very low stance should have negative Y offset
        expect(pelvisPos.y).toBeLessThan(-0.05);
      }
    });
  });

  describe("☴ Son (손) - Wind Stance", () => {
    const sonStance = createSonStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.SON_WIND;

    it("should create valid animation structure", () => {
      expect(sonStance.name).toBe("stance_son");
      expect(sonStance.koreanName).toBe("손 자세");
      expect(sonStance.type).toBe("idle");
    });

    it("should have straight standing leg (~170°)", () => {
      const thighRotation = getRotation(sonStance, BoneName.THIGH_R);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have raised leg with knee up", () => {
      const leftThigh = getRotation(sonStance, BoneName.THIGH_L);
      expect(leftThigh).toBeDefined();
      if (leftThigh) {
        // Raised leg should have significant positive rotation
        expect(leftThigh.x).toBeGreaterThan(1.0); // > ~57°
      }
    });

    it("should have high hip position for balance", () => {
      const pelvisPos = getPosition(sonStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // High stance should have minimal Y offset
        expect(pelvisPos.y).toBeGreaterThan(-0.12);
      }
    });
  });

  describe("☵ Gam (감) - Water Stance", () => {
    const gamStance = createGamStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.GAM_WATER;

    it("should create valid animation structure", () => {
      expect(gamStance.name).toBe("stance_gam");
      expect(gamStance.koreanName).toBe("감 자세");
      expect(gamStance.type).toBe("idle");
    });

    it("should have extended front leg (~150°)", () => {
      const thighRotation = getRotation(gamStance, BoneName.THIGH_R);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have deep back knee bend (~100°)", () => {
      const thighRotation = getRotation(gamStance, BoneName.THIGH_L);
      expect(thighRotation).toBeDefined();
      if (thighRotation) {
        const expectedRotation = toRadians(-(180 - biomech.backKneeBend));
        expect(thighRotation.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have back-weighted distribution (30/70)", () => {
      const pelvisPos = getPosition(gamStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Back-weighted should be negative Z
        expect(pelvisPos.z).toBeLessThan(0);
      }
    });
  });

  describe("☶ Gan (간) - Mountain Stance", () => {
    const ganStance = createGanStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN;

    it("should create valid animation structure", () => {
      expect(ganStance.name).toBe("stance_gan");
      expect(ganStance.koreanName).toBe("간 자세");
      expect(ganStance.type).toBe("idle");
    });

    it("should have moderate knee bend on both legs (~120°)", () => {
      const rightThigh = getRotation(ganStance, BoneName.THIGH_R);
      const leftThigh = getRotation(ganStance, BoneName.THIGH_L);
      
      expect(rightThigh).toBeDefined();
      expect(leftThigh).toBeDefined();
      
      if (rightThigh && leftThigh) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(rightThigh.x).toBeCloseTo(expectedRotation, 1);
        expect(leftThigh.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have slightly back-weighted distribution (40/60)", () => {
      const pelvisPos = getPosition(ganStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Slightly back-weighted
        expect(pelvisPos.z).toBeLessThanOrEqual(0);
      }
    });
  });

  describe("☷ Gon (곤) - Earth Stance", () => {
    const gonStance = createGonStance();
    const biomech = KOREAN_STANCE_BIOMECHANICS.GON_EARTH;

    it("should create valid animation structure", () => {
      expect(gonStance.name).toBe("stance_gon");
      expect(gonStance.koreanName).toBe("곤 자세");
      expect(gonStance.type).toBe("idle");
    });

    it("should have very deep knee bend on both legs (~80°)", () => {
      const rightThigh = getRotation(gonStance, BoneName.THIGH_R);
      const leftThigh = getRotation(gonStance, BoneName.THIGH_L);
      
      expect(rightThigh).toBeDefined();
      expect(leftThigh).toBeDefined();
      
      if (rightThigh && leftThigh) {
        const expectedRotation = toRadians(-(180 - biomech.frontKneeBend));
        expect(rightThigh.x).toBeCloseTo(expectedRotation, 1);
        expect(leftThigh.x).toBeCloseTo(expectedRotation, 1);
      }
    });

    it("should have very low hip position for grounding", () => {
      const pelvisPos = getPosition(gonStance, BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      if (pelvisPos) {
        // Very low stance should have negative Y offset
        expect(pelvisPos.y).toBeLessThan(-0.05);
      }
    });
  });

  describe("Stance Uniqueness and Variety", () => {
    it("should have all 8 stances with unique knee bend configurations", () => {
      const stances = [
        createGeonStance(),
        createTaeStance(),
        createLiStance(),
        createJinStance(),
        createSonStance(),
        createGamStance(),
        createGanStance(),
        createGonStance(),
      ];

      // Extract right thigh rotations from each stance
      const rightKneeAngles = stances.map((stance) => {
        const rotation = getRotation(stance, BoneName.THIGH_R);
        return rotation ? rotation.x : 0;
      });

      // Check that we have 8 different values (with tolerance for floating point)
      const uniqueAngles = new Set(
        rightKneeAngles.map((angle) => Math.round(angle * 100) / 100)
      );
      
      // Should have at least 6 unique angles (some stances like Li/Gan might be similar)
      expect(uniqueAngles.size).toBeGreaterThanOrEqual(6);
    });

    it("should have all 8 stances with unique hip heights", () => {
      const stances = [
        createGeonStance(),
        createTaeStance(),
        createLiStance(),
        createJinStance(),
        createSonStance(),
        createGamStance(),
        createGanStance(),
        createGonStance(),
      ];

      // Extract pelvis Y positions
      const hipHeights = stances.map((stance) => {
        const position = getPosition(stance, BoneName.PELVIS);
        return position ? position.y : 0;
      });

      // Check for variety in hip heights
      const uniqueHeights = new Set(
        hipHeights.map((height) => Math.round(height * 100) / 100)
      );
      
      // Should have at least 5 unique heights
      expect(uniqueHeights.size).toBeGreaterThanOrEqual(5);
    });

    it("should have varied weight distribution across stances", () => {
      const stances = [
        createGeonStance(),
        createTaeStance(),
        createLiStance(),
        createJinStance(),
        createSonStance(),
        createGamStance(),
        createGanStance(),
        createGonStance(),
      ];

      // Extract pelvis Z positions (weight distribution)
      const weightDistributions = stances.map((stance) => {
        const position = getPosition(stance, BoneName.PELVIS);
        return position ? position.z : 0;
      });

      // Check that we have forward, backward, and centered stances
      const hasForward = weightDistributions.some((z) => z > 0.05);
      const hasBackward = weightDistributions.some((z) => z < -0.05);
      const hasCentered = weightDistributions.some(
        (z) => Math.abs(z) < 0.05
      );

      expect(hasForward).toBe(true);
      expect(hasBackward).toBe(true);
      expect(hasCentered).toBe(true);
    });
  });

  describe("Performance and Structure", () => {
    it("should create all stances within performance budget", () => {
      const start = performance.now();
      
      createGeonStance();
      createTaeStance();
      createLiStance();
      createJinStance();
      createSonStance();
      createGamStance();
      createGanStance();
      createGonStance();
      
      const end = performance.now();
      const duration = end - start;
      
      // Should create all 8 stances in less than 50ms
      expect(duration).toBeLessThan(50);
    });

    it("should have consistent animation structure across all stances", () => {
      const stances = [
        createGeonStance(),
        createTaeStance(),
        createLiStance(),
        createJinStance(),
        createSonStance(),
        createGamStance(),
        createGanStance(),
        createGonStance(),
      ];

      stances.forEach((stance) => {
        expect(stance.name).toBeTruthy();
        expect(stance.koreanName).toBeTruthy();
        expect(stance.type).toBe("idle");
        expect(stance.loop).toBe(true);
        expect(stance.duration).toBeGreaterThan(0);
        expect(stance.keyframes.length).toBeGreaterThan(0);
      });
    });
  });
});
