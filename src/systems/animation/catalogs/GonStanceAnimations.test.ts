/**
 * Tests for Gon (Earth) Stance Animations
 *
 * Validates idle, movement, and guard animations for the Gon trigram.
 * Ensures proper Korean martial arts biomechanics and timing.
 *
 * @module systems/animation/catalogs/__tests__/GonStanceAnimations.test
 */

import { describe, it, expect } from "vitest";
import {
  GON_IDLE_SSIREUM_STANCE,
  GON_HEAVY_GROUNDING_STEP,
  GON_SWEEP_POSITIONING_STEP,
} from "./GonStanceAnimations";
import { ANATOMICAL_LIMITS } from "../constants";
import { BoneName } from "@/types/skeletal";

describe("Gon Stance Animations", () => {
  describe("ANATOMICAL_LIMITS (Centralized)", () => {
    it("should define safe anatomical limits for Gon techniques", () => {
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND).toBe(2.27); // 130°
      expect(ANATOMICAL_LIMITS.HIP.MAX_FLEXION).toBe(1.92); // 110°
      expect(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEX).toBe(0.35); // 20°
    });
  });

  describe("GON_IDLE_SSIREUM_STANCE", () => {
    it("should have correct animation properties", () => {
      expect(GON_IDLE_SSIREUM_STANCE.name).toBe("gon_idle_ssireum_stance");
      expect(GON_IDLE_SSIREUM_STANCE.koreanName).toBe("곤괘 씨름 자세");
      expect(GON_IDLE_SSIREUM_STANCE.duration).toBe(3.4);
      expect(GON_IDLE_SSIREUM_STANCE.loop).toBe(true);
      expect(GON_IDLE_SSIREUM_STANCE.type).toBe("idle");
    });

    it("should have 3 keyframes for breathing cycle", () => {
      expect(GON_IDLE_SSIREUM_STANCE.keyframes.length).toBe(3);
      expect(GON_IDLE_SSIREUM_STANCE.keyframes[0].time).toBe(0);
      expect(GON_IDLE_SSIREUM_STANCE.keyframes[1].time).toBe(1.7);
      expect(GON_IDLE_SSIREUM_STANCE.keyframes[2].time).toBe(3.4);
    });

    it("should maintain deeply bent knees for low center throughout", () => {
      GON_IDLE_SSIREUM_STANCE.keyframes.forEach((frame) => {
        const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = frame.boneRotations.get(BoneName.KNEE_R);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        // All frames should have deep knee bend (< -45°)
        if (kneeL && kneeR) {
          expect(kneeL.x).toBeLessThan(-0.78); // Less than -45°
          expect(kneeR.x).toBeLessThan(-0.78);
          expect(Math.abs(kneeL.x - kneeR.x)).toBeLessThan(0.1); // Symmetric
        }
      });
    });

    it("should keep hips low and back for grounding", () => {
      GON_IDLE_SSIREUM_STANCE.keyframes.forEach((frame) => {
        const pelvis = frame.boneRotations.get(BoneName.PELVIS);
        
        expect(pelvis).toBeDefined();
        
        // Hips should be back (negative X rotation)
        if (pelvis) {
          expect(pelvis.x).toBeLessThan(-0.3); // Less than -17°
        }
      });
    });

    it("should have hands positioned low for grappling", () => {
      GON_IDLE_SSIREUM_STANCE.keyframes.forEach((frame) => {
        const shoulderL = frame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = frame.boneRotations.get(BoneName.SHOULDER_R);
        
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        
        // Shoulders should be forward and down (positive X)
        if (shoulderL && shoulderR) {
          expect(shoulderL.x).toBeGreaterThan(0.4); // Greater than 23°
          expect(shoulderR.x).toBeGreaterThan(0.4);
        }
      });
    });

    it("should have lowered pelvis position", () => {
      GON_IDLE_SSIREUM_STANCE.keyframes.forEach((frame) => {
        const pelvisPos = frame.bonePositions.get(BoneName.PELVIS);
        
        expect(pelvisPos).toBeDefined();
        
        // Pelvis should be lowered (negative Y)
        if (pelvisPos) {
          expect(pelvisPos.y).toBeLessThan(-0.08);
        }
      });
    });

    it("should not exceed anatomical limits", () => {
      GON_IDLE_SSIREUM_STANCE.keyframes.forEach((frame) => {
        const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = frame.boneRotations.get(BoneName.KNEE_R);
        const ankleL = frame.boneRotations.get(BoneName.FOOT_L);
        const ankleR = frame.boneRotations.get(BoneName.FOOT_R);
        
        if (kneeL) {
          expect(Math.abs(kneeL.x)).toBeLessThanOrEqual(ANATOMICAL_LIMITS.KNEE.MAX_BEND);
        }
        if (kneeR) {
          expect(Math.abs(kneeR.x)).toBeLessThanOrEqual(ANATOMICAL_LIMITS.KNEE.MAX_BEND);
        }
        if (ankleL) {
          expect(Math.abs(ankleL.x)).toBeLessThanOrEqual(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEX);
        }
        if (ankleR) {
          expect(Math.abs(ankleR.x)).toBeLessThanOrEqual(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEX);
        }
      });
    });
  });

  describe("GON_HEAVY_GROUNDING_STEP", () => {
    it("should have correct animation properties", () => {
      expect(GON_HEAVY_GROUNDING_STEP.name).toBe("gon_heavy_grounding_step");
      expect(GON_HEAVY_GROUNDING_STEP.koreanName).toBe("땅 밟기");
      expect(GON_HEAVY_GROUNDING_STEP.duration).toBeCloseTo(0.267, 3);
      expect(GON_HEAVY_GROUNDING_STEP.loop).toBe(false);
      expect(GON_HEAVY_GROUNDING_STEP.type).toBe("movement");
    });

    it("should have 4 keyframes for step cycle (16 frames at 60fps)", () => {
      expect(GON_HEAVY_GROUNDING_STEP.keyframes.length).toBe(4);
      expect(GON_HEAVY_GROUNDING_STEP.keyframes[0].time).toBe(0);
      expect(GON_HEAVY_GROUNDING_STEP.keyframes[1].time).toBeCloseTo(0.09, 2);
      expect(GON_HEAVY_GROUNDING_STEP.keyframes[2].time).toBeCloseTo(0.18, 2);
      expect(GON_HEAVY_GROUNDING_STEP.keyframes[3].time).toBeCloseTo(0.267, 3);
    });

    it("should start from low stance position", () => {
      const startFrame = GON_HEAVY_GROUNDING_STEP.keyframes[0];
      const kneeL = startFrame.boneRotations.get(BoneName.KNEE_L);
      const kneeR = startFrame.boneRotations.get(BoneName.KNEE_R);
      
      expect(kneeL?.x).toBeCloseTo(-0.87, 2); // -50°
      expect(kneeR?.x).toBeCloseTo(-0.87, 2);
    });

    it("should lift right foot during step", () => {
      const liftFrame = GON_HEAVY_GROUNDING_STEP.keyframes[2]; // 180ms
      const hipR = liftFrame.boneRotations.get(BoneName.HIP_R);
      const kneeR = liftFrame.boneRotations.get(BoneName.KNEE_R);
      
      expect(hipR).toBeDefined();
      expect(kneeR).toBeDefined();
      
      // Hip should lift (positive X)
      if (hipR) {
        expect(hipR.x).toBeGreaterThan(0.3);
      }
      // Knee should be bent for step
      if (kneeR) {
        expect(kneeR.x).toBeLessThan(-0.4);
      }
    });

    it("should plant foot firmly at end", () => {
      const endFrame = GON_HEAVY_GROUNDING_STEP.keyframes[3];
      const footR = endFrame.boneRotations.get(BoneName.FOOT_R);
      const pelvisPos = endFrame.bonePositions.get(BoneName.PELVIS);
      
      expect(footR).toBeDefined();
      
      // Foot should have weight (positive X dorsiflexion)
      if (footR) {
        expect(footR.x).toBeCloseTo(0.35, 2); // 20°
      }
      
      // Should have moved forward
      if (pelvisPos) {
        expect(pelvisPos.z).toBeGreaterThan(0.15);
      }
    });

    it("should maintain low center of gravity throughout", () => {
      GON_HEAVY_GROUNDING_STEP.keyframes.forEach((frame) => {
        const pelvisPos = frame.bonePositions.get(BoneName.PELVIS);
        
        // Pelvis should stay low
        if (pelvisPos) {
          expect(pelvisPos.y).toBeLessThan(-0.05);
        }
      });
    });
  });

  describe("GON_SWEEP_POSITIONING_STEP", () => {
    it("should have correct animation properties", () => {
      expect(GON_SWEEP_POSITIONING_STEP.name).toBe("gon_sweep_positioning_step");
      expect(GON_SWEEP_POSITIONING_STEP.koreanName).toBe("쓸기 준비");
      expect(GON_SWEEP_POSITIONING_STEP.duration).toBeCloseTo(0.3, 1);
      expect(GON_SWEEP_POSITIONING_STEP.loop).toBe(false);
      expect(GON_SWEEP_POSITIONING_STEP.type).toBe("movement");
    });

    it("should have 4 keyframes for sweep setup (18 frames at 60fps)", () => {
      expect(GON_SWEEP_POSITIONING_STEP.keyframes.length).toBe(4);
      expect(GON_SWEEP_POSITIONING_STEP.keyframes[0].time).toBe(0);
      expect(GON_SWEEP_POSITIONING_STEP.keyframes[1].time).toBeCloseTo(0.1, 2);
      expect(GON_SWEEP_POSITIONING_STEP.keyframes[2].time).toBeCloseTo(0.2, 2);
      expect(GON_SWEEP_POSITIONING_STEP.keyframes[3].time).toBeCloseTo(0.3, 1);
    });

    it("should shift weight laterally", () => {
      const startPos = GON_SWEEP_POSITIONING_STEP.keyframes[0].bonePositions.get(BoneName.PELVIS);
      const endPos = GON_SWEEP_POSITIONING_STEP.keyframes[3].bonePositions.get(BoneName.PELVIS);
      
      expect(startPos).toBeDefined();
      expect(endPos).toBeDefined();
      
      // Should move laterally (X or Z axis)
      if (startPos && endPos) {
        const lateralMovement = Math.abs(endPos.z - startPos.z);
        expect(lateralMovement).toBeGreaterThan(0.15); // Moved at least 15cm laterally
      }
    });

    it("should reach forward with arms for grab", () => {
      const endFrame = GON_SWEEP_POSITIONING_STEP.keyframes[3];
      const shoulderL = endFrame.boneRotations.get(BoneName.SHOULDER_L);
      const shoulderR = endFrame.boneRotations.get(BoneName.SHOULDER_R);
      
      expect(shoulderL).toBeDefined();
      expect(shoulderR).toBeDefined();
      
      // Shoulders should be forward (positive X)
      if (shoulderL && shoulderR) {
        expect(shoulderL.x).toBeGreaterThan(0.6); // Greater than 34°
        expect(shoulderR.x).toBeGreaterThan(0.6);
      }
    });

    it("should position lead foot for sweep", () => {
      const endFrame = GON_SWEEP_POSITIONING_STEP.keyframes[3];
      const footL = endFrame.boneRotations.get(BoneName.FOOT_L);
      const hipL = endFrame.boneRotations.get(BoneName.HIP_L);
      
      expect(footL).toBeDefined();
      expect(hipL).toBeDefined();
      
      // Foot should be planted and ready
      if (footL) {
        expect(footL.x).toBeCloseTo(0.35, 2); // 20° dorsiflexion
      }
    });

    it("should not exceed anatomical limits during movement", () => {
      GON_SWEEP_POSITIONING_STEP.keyframes.forEach((frame) => {
        const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = frame.boneRotations.get(BoneName.KNEE_R);
        
        if (kneeL) {
          expect(Math.abs(kneeL.x)).toBeLessThanOrEqual(ANATOMICAL_LIMITS.KNEE.MAX_BEND);
        }
        if (kneeR) {
          expect(Math.abs(kneeR.x)).toBeLessThanOrEqual(ANATOMICAL_LIMITS.KNEE.MAX_BEND);
        }
      });
    });
  });

  describe("General Animation Integrity", () => {
    it("all animations should have valid Korean names", () => {
      expect(GON_IDLE_SSIREUM_STANCE.koreanName).toBeTruthy();
      expect(GON_HEAVY_GROUNDING_STEP.koreanName).toBeTruthy();
      expect(GON_SWEEP_POSITIONING_STEP.koreanName).toBeTruthy();
      
      // Should be in Korean (Unicode Korean range: \uAC00-\uD7AF)
      expect(GON_IDLE_SSIREUM_STANCE.koreanName).toMatch(/[가-힣]/);
      expect(GON_HEAVY_GROUNDING_STEP.koreanName).toMatch(/[가-힣]/);
      expect(GON_SWEEP_POSITIONING_STEP.koreanName).toMatch(/[가-힣]/);
    });

    it("all animations should have non-empty keyframes", () => {
      expect(GON_IDLE_SSIREUM_STANCE.keyframes.length).toBeGreaterThan(0);
      expect(GON_HEAVY_GROUNDING_STEP.keyframes.length).toBeGreaterThan(0);
      expect(GON_SWEEP_POSITIONING_STEP.keyframes.length).toBeGreaterThan(0);
    });

    it("all animations should have keyframes in chronological order", () => {
      [GON_IDLE_SSIREUM_STANCE, GON_HEAVY_GROUNDING_STEP, GON_SWEEP_POSITIONING_STEP].forEach((animation) => {
        for (let i = 1; i < animation.keyframes.length; i++) {
          expect(animation.keyframes[i].time).toBeGreaterThanOrEqual(animation.keyframes[i - 1].time);
        }
      });
    });
  });
});
