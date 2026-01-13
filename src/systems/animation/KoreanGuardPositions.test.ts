/**
 * Unit tests for Korean Guard Positions (막기자세)
 *
 * Tests authentic Korean martial arts guard positions including
 * high guard, middle guard, and low guard configurations.
 *
 * @module systems/animation/KoreanGuardPositions.test
 * @category Tests
 * @korean 막기자세테스트
 */

import { describe, expect, it } from "vitest";
import {
  getGuardForStanceHeight,
  getGuardPosition,
  HIGH_GUARD,
  KOREAN_GUARD_POSITIONS,
  LOW_GUARD,
  MIDDLE_GUARD,
} from "./KoreanGuardPositions";

describe("Korean Guard Positions (막기자세)", () => {
  describe("Guard Position Definitions", () => {
    it("should define all three Korean guard positions", () => {
      expect(KOREAN_GUARD_POSITIONS).toBeDefined();
      expect(Object.keys(KOREAN_GUARD_POSITIONS).length).toBe(3);
      expect(KOREAN_GUARD_POSITIONS.HIGH_GUARD).toBe(HIGH_GUARD);
      expect(KOREAN_GUARD_POSITIONS.MIDDLE_GUARD).toBe(MIDDLE_GUARD);
      expect(KOREAN_GUARD_POSITIONS.LOW_GUARD).toBe(LOW_GUARD);
    });

    it("should have correct Korean names for all guards", () => {
      expect(HIGH_GUARD.korean).toBe("상단막기");
      expect(MIDDLE_GUARD.korean).toBe("중단막기");
      expect(LOW_GUARD.korean).toBe("하단막기");
    });

    it("should have correct English names for all guards", () => {
      expect(HIGH_GUARD.english).toBe("High Guard");
      expect(MIDDLE_GUARD.english).toBe("Middle Guard");
      expect(LOW_GUARD.english).toBe("Low Guard");
    });

    it("should have correct romanization", () => {
      expect(HIGH_GUARD.romanized).toBe("Sangdan Makgi");
      expect(MIDDLE_GUARD.romanized).toBe("Jungdan Makgi");
      expect(LOW_GUARD.romanized).toBe("Hadan Makgi");
    });

    it("should have bilingual descriptions", () => {
      expect(HIGH_GUARD.description.korean).toContain("머리");
      expect(HIGH_GUARD.description.english).toContain("head");
      expect(MIDDLE_GUARD.description.korean).toContain("가슴");
      expect(MIDDLE_GUARD.description.english).toContain("chest");
      expect(LOW_GUARD.description.korean).toContain("하복부");
      expect(LOW_GUARD.description.english).toContain("lower");
    });
  });

  describe("High Guard (상단막기)", () => {
    it("should have hands at temple level", () => {
      expect(HIGH_GUARD.height).toBe("temple_level");
    });

    it("should use fist vertical hand pose", () => {
      expect(HIGH_GUARD.handPose).toBe("fist_vertical");
    });

    it("should protect head and face", () => {
      expect(HIGH_GUARD.protects).toContain("head");
      expect(HIGH_GUARD.protects).toContain("temple");
      expect(HIGH_GUARD.protects).toContain("forehead");
      expect(HIGH_GUARD.protects).toContain("eyes");
      expect(HIGH_GUARD.protects).toContain("nose");
      expect(HIGH_GUARD.protects).toContain("jaw");
    });

    it("should have symmetric arm positions", () => {
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
      
      // Shoulders should be raised (~15°)
      expect(HIGH_GUARD.left.shoulder[0]).toBeCloseTo(toRadians(-15), 2);
      expect(HIGH_GUARD.right.shoulder[0]).toBeCloseTo(toRadians(-15), 2);
      
      // Elbows should be bent tight (~110°)
      expect(HIGH_GUARD.left.elbow[2]).toBeCloseTo(toRadians(-110), 2);
      expect(HIGH_GUARD.right.elbow[2]).toBeCloseTo(toRadians(110), 2);
    });

    it("should have left and right arms with opposite signs", () => {
      // Z rotation should be opposite for left/right symmetry
      expect(HIGH_GUARD.left.shoulder[2]).toBeGreaterThan(0);
      expect(HIGH_GUARD.right.shoulder[2]).toBeLessThan(0);
    });
  });

  describe("Middle Guard (중단막기)", () => {
    it("should have hands at chest level", () => {
      expect(MIDDLE_GUARD.height).toBe("chest_level");
    });

    it("should use fist vertical hand pose", () => {
      expect(MIDDLE_GUARD.handPose).toBe("fist_vertical");
    });

    it("should protect torso and vital organs", () => {
      expect(MIDDLE_GUARD.protects).toContain("chest");
      expect(MIDDLE_GUARD.protects).toContain("solar_plexus");
      expect(MIDDLE_GUARD.protects).toContain("ribs");
      expect(MIDDLE_GUARD.protects).toContain("liver");
      expect(MIDDLE_GUARD.protects).toContain("spleen");
      expect(MIDDLE_GUARD.protects).toContain("heart");
    });

    it("should have elbows at 90 degrees", () => {
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
      
      // Elbows should be at classic 90° guard position
      expect(MIDDLE_GUARD.left.elbow[2]).toBeCloseTo(toRadians(-90), 2);
      expect(MIDDLE_GUARD.right.elbow[2]).toBeCloseTo(toRadians(90), 2);
    });

    it("should be the most versatile guard position", () => {
      // Middle guard should have protections for most vital areas
      expect(MIDDLE_GUARD.protects.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Low Guard (하단막기)", () => {
    it("should have hands at abdomen level", () => {
      expect(LOW_GUARD.height).toBe("abdomen_level");
    });

    it("should use fist vertical hand pose", () => {
      expect(LOW_GUARD.handPose).toBe("fist_vertical");
    });

    it("should protect lower body and groin", () => {
      expect(LOW_GUARD.protects).toContain("abdomen");
      expect(LOW_GUARD.protects).toContain("groin");
      expect(LOW_GUARD.protects).toContain("hip");
      expect(LOW_GUARD.protects).toContain("thigh");
      expect(LOW_GUARD.protects).toContain("lower_ribs");
    });

    it("should have shoulders more forward", () => {
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
      
      // Shoulders should be forward (~20°) for low guard
      expect(LOW_GUARD.left.shoulder[0]).toBeCloseTo(toRadians(20), 2);
      expect(LOW_GUARD.right.shoulder[0]).toBeCloseTo(toRadians(20), 2);
      
      // Elbows should be bent wider (~70°)
      expect(LOW_GUARD.left.elbow[2]).toBeCloseTo(toRadians(-70), 2);
      expect(LOW_GUARD.right.elbow[2]).toBeCloseTo(toRadians(70), 2);
    });
  });

  describe("Guard Position Getters", () => {
    it("should get guard by type", () => {
      const highGuard = getGuardPosition("HIGH_GUARD");
      expect(highGuard).toBe(HIGH_GUARD);
      expect(highGuard.korean).toBe("상단막기");
      
      const middleGuard = getGuardPosition("MIDDLE_GUARD");
      expect(middleGuard).toBe(MIDDLE_GUARD);
      expect(middleGuard.korean).toBe("중단막기");
      
      const lowGuard = getGuardPosition("LOW_GUARD");
      expect(lowGuard).toBe(LOW_GUARD);
      expect(lowGuard.korean).toBe("하단막기");
    });

    it("should get appropriate guard for stance height", () => {
      const highStanceGuard = getGuardForStanceHeight("high");
      expect(highStanceGuard).toBe(HIGH_GUARD);
      
      const middleStanceGuard = getGuardForStanceHeight("middle");
      expect(middleStanceGuard).toBe(MIDDLE_GUARD);
      
      const lowStanceGuard = getGuardForStanceHeight("low");
      expect(lowStanceGuard).toBe(LOW_GUARD);
    });
  });

  describe("Guard Position Application", () => {
    it("should have proper rotation values for animation", () => {
      // All guards should have valid rotation values in radians
      for (const guard of Object.values(KOREAN_GUARD_POSITIONS)) {
        // Left arm rotations
        expect(guard.left.shoulder.length).toBe(3);
        expect(guard.left.elbow.length).toBe(3);
        expect(guard.left.wrist.length).toBe(3);
        
        // Right arm rotations
        expect(guard.right.shoulder.length).toBe(3);
        expect(guard.right.elbow.length).toBe(3);
        expect(guard.right.wrist.length).toBe(3);
        
        // Rotation values should be in reasonable range (radians)
        for (const value of [...guard.left.shoulder, ...guard.left.elbow, ...guard.left.wrist]) {
          expect(Math.abs(value)).toBeLessThanOrEqual(Math.PI);
        }
        for (const value of [...guard.right.shoulder, ...guard.right.elbow, ...guard.right.wrist]) {
          expect(Math.abs(value)).toBeLessThanOrEqual(Math.PI);
        }
      }
    });

    it("should have mirrored left and right arm positions", () => {
      // For all guards, left and right arms should be mirrored on Z-axis
      for (const guard of Object.values(KOREAN_GUARD_POSITIONS)) {
        // Shoulder Z rotations should be opposite signs
        expect(Math.sign(guard.left.shoulder[2])).toBe(-Math.sign(guard.right.shoulder[2]));
        
        // Elbow Z rotations should be opposite signs
        expect(Math.sign(guard.left.elbow[2])).toBe(-Math.sign(guard.right.elbow[2]));
      }
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should follow traditional Taekwondo guard principles", () => {
      // High guard (상단막기) - used for overhead blocks
      expect(HIGH_GUARD.height).toBe("temple_level");
      
      // Middle guard (중단막기) - most common fighting stance
      expect(MIDDLE_GUARD.height).toBe("chest_level");
      
      // Low guard (하단막기) - used for low blocks and sweeps
      expect(LOW_GUARD.height).toBe("abdomen_level");
    });

    it("should protect vital points according to Korean martial arts", () => {
      // Guards should protect key vital point categories
      const allProtectedAreas = new Set([
        ...HIGH_GUARD.protects,
        ...MIDDLE_GUARD.protects,
        ...LOW_GUARD.protects,
      ]);
      
      // Should protect all three major regions
      const hasHeadProtection = HIGH_GUARD.protects.some(area => 
        ["head", "temple", "jaw"].includes(area)
      );
      const hasTorsoProtection = MIDDLE_GUARD.protects.some(area => 
        ["chest", "solar_plexus", "ribs", "liver"].includes(area)
      );
      const hasLowerProtection = LOW_GUARD.protects.some(area => 
        ["abdomen", "groin"].includes(area)
      );
      
      expect(hasHeadProtection).toBe(true);
      expect(hasTorsoProtection).toBe(true);
      expect(hasLowerProtection).toBe(true);
    });

    it("should use vertical fist position (주먹쥐기)", () => {
      // All guards should use vertical fist as per Korean martial arts tradition
      expect(HIGH_GUARD.handPose).toBe("fist_vertical");
      expect(MIDDLE_GUARD.handPose).toBe("fist_vertical");
      expect(LOW_GUARD.handPose).toBe("fist_vertical");
    });
  });
});
