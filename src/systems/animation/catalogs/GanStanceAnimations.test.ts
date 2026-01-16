/**
 * Tests for Gan (Mountain) Stance Animations
 *
 * Validates idle, movement, and guard transition animations for the Gan trigram.
 * Ensures proper rooted mechanics, minimal movement, and defensive positioning.
 *
 * @module systems/animation/catalogs/GanStanceAnimations.test
 * @category Animation Tests
 * @korean 간괘자세애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  GAN_IDLE_ROOTED,
  GAN_SHORT_ROOT_STEP,
  GAN_DEFENSIVE_ANGLE_SHIFT,
  GAN_HIGH_SOLID_GUARD_TRANSITION,
  GAN_STANCE_ANIMATIONS,
} from "./GanStanceAnimations";
import { BoneName } from "@/types/skeletal";

describe("Gan Stance Animations", () => {
  // ═══════════════════════════════════════════════════════════════════════
  // GAN_IDLE_ROOTED TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_IDLE_ROOTED", () => {
    it("should have correct duration for rooted cycle", () => {
      expect(GAN_IDLE_ROOTED.duration).toBe(3.2);
      expect(GAN_IDLE_ROOTED.loop).toBe(true);
      expect(GAN_IDLE_ROOTED.type).toBe("idle");
    });

    it("should have proper keyframe count", () => {
      expect(GAN_IDLE_ROOTED.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate minimal movement (mountain stillness)", () => {
      const keyframes = GAN_IDLE_ROOTED.keyframes;
      
      // Check spine rotations - should be very minimal (< 2 degrees)
      keyframes.forEach((frame) => {
        const spineUpper = frame.boneRotations.get(BoneName.SPINE_UPPER);
        if (spineUpper) {
          expect(Math.abs(spineUpper.x)).toBeLessThan(0.035); // < 2°
        }
      });
    });

    it("should maintain bent knees for stable rooted stance", () => {
      GAN_IDLE_ROOTED.keyframes.forEach((frame) => {
        const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = frame.boneRotations.get(BoneName.KNEE_R);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        if (kneeL && kneeR) {
          expect(kneeL.x).toBeLessThan(-0.174); // At least -10° bent
          expect(kneeR.x).toBeLessThan(-0.174);
        }
      });
    });

    it("should maintain high solid guard position", () => {
      GAN_IDLE_ROOTED.keyframes.forEach((frame) => {
        const shoulderL = frame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = frame.boneRotations.get(BoneName.SHOULDER_R);
        const elbowL = frame.boneRotations.get(BoneName.ELBOW_L);
        const elbowR = frame.boneRotations.get(BoneName.ELBOW_R);
        
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        expect(elbowL).toBeDefined();
        expect(elbowR).toBeDefined();
        
        if (shoulderL && shoulderR && elbowL && elbowR) {
          // Shoulders should be elevated (negative X rotation)
          expect(shoulderL.x).toBeLessThan(-0.174); // At least -10° elevated
          expect(shoulderR.x).toBeLessThan(-0.174);
          
          // Elbows should be bent for guard (> 90°)
          expect(Math.abs(elbowL.z)).toBeGreaterThan(1.57); // > 90°
          expect(Math.abs(elbowR.z)).toBeGreaterThan(1.57);
        }
      });
    });

    it("should have no positional movement (mountain doesn't shift)", () => {
      GAN_IDLE_ROOTED.keyframes.forEach((frame) => {
        const pelvisPos = frame.bonePositions.get(BoneName.PELVIS);
        if (pelvisPos) {
          expect(pelvisPos.x).toBe(0);
          expect(pelvisPos.y).toBe(0);
          expect(pelvisPos.z).toBe(0);
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // GAN_SHORT_ROOT_STEP TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_SHORT_ROOT_STEP", () => {
    it("should have correct duration and frame count", () => {
      expect(GAN_SHORT_ROOT_STEP.duration).toBe(0.4);
      expect(GAN_SHORT_ROOT_STEP.loop).toBe(false);
      expect(GAN_SHORT_ROOT_STEP.type).toBe("movement");
      expect(GAN_SHORT_ROOT_STEP.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate minimal forward movement", () => {
      const firstFrame = GAN_SHORT_ROOT_STEP.keyframes[0];
      const lastFrame = GAN_SHORT_ROOT_STEP.keyframes[GAN_SHORT_ROOT_STEP.keyframes.length - 1];
      
      const firstPos = firstFrame.bonePositions.get(BoneName.PELVIS);
      const lastPos = lastFrame.bonePositions.get(BoneName.PELVIS);
      
      expect(firstPos).toBeDefined();
      expect(lastPos).toBeDefined();
      
      if (firstPos && lastPos) {
        const forwardMovement = lastPos.z - firstPos.z;
        // Should move forward but minimally (< 0.3m for short step)
        expect(forwardMovement).toBeGreaterThan(0);
        expect(forwardMovement).toBeLessThan(0.3);
      }
    });

    it("should maintain stable knee bends throughout", () => {
      GAN_SHORT_ROOT_STEP.keyframes.forEach((frame) => {
        const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = frame.boneRotations.get(BoneName.KNEE_R);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        if (kneeL && kneeR) {
          // Knees should stay bent for stability
          expect(kneeL.x).toBeLessThan(-0.174); // At least -10°
          expect(kneeR.x).toBeLessThan(-0.174);
        }
      });
    });

    it("should maintain guard position during step", () => {
      GAN_SHORT_ROOT_STEP.keyframes.forEach((frame) => {
        const shoulderL = frame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = frame.boneRotations.get(BoneName.SHOULDER_R);
        const elbowL = frame.boneRotations.get(BoneName.ELBOW_L);
        const elbowR = frame.boneRotations.get(BoneName.ELBOW_R);
        
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        expect(elbowL).toBeDefined();
        expect(elbowR).toBeDefined();
        
        if (elbowL && elbowR) {
          // Guard should remain solid (elbows bent)
          expect(Math.abs(elbowL.z)).toBeGreaterThan(1.57); // > 90°
          expect(Math.abs(elbowR.z)).toBeGreaterThan(1.57);
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // GAN_DEFENSIVE_ANGLE_SHIFT TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_DEFENSIVE_ANGLE_SHIFT", () => {
    it("should have correct duration and structure", () => {
      expect(GAN_DEFENSIVE_ANGLE_SHIFT.duration).toBe(0.5);
      expect(GAN_DEFENSIVE_ANGLE_SHIFT.loop).toBe(false);
      expect(GAN_DEFENSIVE_ANGLE_SHIFT.type).toBe("movement");
      expect(GAN_DEFENSIVE_ANGLE_SHIFT.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should pivot on Y-axis for defensive angle", () => {
      const firstFrame = GAN_DEFENSIVE_ANGLE_SHIFT.keyframes[0];
      const lastFrame = GAN_DEFENSIVE_ANGLE_SHIFT.keyframes[GAN_DEFENSIVE_ANGLE_SHIFT.keyframes.length - 1];
      
      const firstPelvis = firstFrame.boneRotations.get(BoneName.PELVIS);
      const lastPelvis = lastFrame.boneRotations.get(BoneName.PELVIS);
      
      expect(firstPelvis).toBeDefined();
      expect(lastPelvis).toBeDefined();
      
      if (firstPelvis && lastPelvis) {
        // Should rotate on Y-axis (negative for defensive left angle)
        expect(lastPelvis.y).toBeLessThan(0);
        expect(Math.abs(lastPelvis.y)).toBeGreaterThan(0.174); // At least -10°
      }
    });

    it("should maintain balance throughout pivot", () => {
      GAN_DEFENSIVE_ANGLE_SHIFT.keyframes.forEach((frame) => {
        const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = frame.boneRotations.get(BoneName.KNEE_R);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        if (kneeL && kneeR) {
          // Both knees should remain bent for stability
          expect(kneeL.x).toBeLessThan(-0.174);
          expect(kneeR.x).toBeLessThan(-0.174);
        }
      });
    });

    it("should maintain guard throughout angle shift", () => {
      GAN_DEFENSIVE_ANGLE_SHIFT.keyframes.forEach((frame) => {
        const shoulderL = frame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = frame.boneRotations.get(BoneName.SHOULDER_R);
        const elbowL = frame.boneRotations.get(BoneName.ELBOW_L);
        const elbowR = frame.boneRotations.get(BoneName.ELBOW_R);
        
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        expect(elbowL).toBeDefined();
        expect(elbowR).toBeDefined();
        
        if (elbowL && elbowR) {
          // Guard should never drop (elbows stay bent)
          expect(Math.abs(elbowL.z)).toBeGreaterThan(1.57); // > 90°
          expect(Math.abs(elbowR.z)).toBeGreaterThan(1.57);
        }
      });
    });

    it("should rotate foot for pivot", () => {
      const lastFrame = GAN_DEFENSIVE_ANGLE_SHIFT.keyframes[GAN_DEFENSIVE_ANGLE_SHIFT.keyframes.length - 1];
      const footL = lastFrame.boneRotations.get(BoneName.FOOT_L);
      
      expect(footL).toBeDefined();
      
      if (footL) {
        // Pivot foot should rotate on Y-axis
        expect(Math.abs(footL.y)).toBeGreaterThan(0.087); // At least 5° rotation
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // GAN_HIGH_SOLID_GUARD_TRANSITION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_HIGH_SOLID_GUARD_TRANSITION", () => {
    it("should have correct duration and structure", () => {
      expect(GAN_HIGH_SOLID_GUARD_TRANSITION.duration).toBeCloseTo(0.333, 2);
      expect(GAN_HIGH_SOLID_GUARD_TRANSITION.loop).toBe(false);
      expect(GAN_HIGH_SOLID_GUARD_TRANSITION.type).toBe("stance");
      expect(GAN_HIGH_SOLID_GUARD_TRANSITION.keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it("should transition to high guard position", () => {
      const lastFrame = GAN_HIGH_SOLID_GUARD_TRANSITION.keyframes[GAN_HIGH_SOLID_GUARD_TRANSITION.keyframes.length - 1];
      
      const shoulderL = lastFrame.boneRotations.get(BoneName.SHOULDER_L);
      const shoulderR = lastFrame.boneRotations.get(BoneName.SHOULDER_R);
      const elbowL = lastFrame.boneRotations.get(BoneName.ELBOW_L);
      const elbowR = lastFrame.boneRotations.get(BoneName.ELBOW_R);
      
      expect(shoulderL).toBeDefined();
      expect(shoulderR).toBeDefined();
      expect(elbowL).toBeDefined();
      expect(elbowR).toBeDefined();
      
      if (shoulderL && shoulderR && elbowL && elbowR) {
        // Shoulders should be elevated (negative X)
        expect(shoulderL.x).toBeLessThan(-0.174); // At least -10°
        expect(shoulderR.x).toBeLessThan(-0.174);
        
        // Elbows should be significantly bent (> 100°)
        expect(Math.abs(elbowL.z)).toBeGreaterThan(1.74); // > 100°
        expect(Math.abs(elbowR.z)).toBeGreaterThan(1.74);
      }
    });

    it("should end in stable stance", () => {
      const lastFrame = GAN_HIGH_SOLID_GUARD_TRANSITION.keyframes[GAN_HIGH_SOLID_GUARD_TRANSITION.keyframes.length - 1];
      
      const kneeL = lastFrame.boneRotations.get(BoneName.KNEE_L);
      const kneeR = lastFrame.boneRotations.get(BoneName.KNEE_R);
      
      expect(kneeL).toBeDefined();
      expect(kneeR).toBeDefined();
      
      if (kneeL && kneeR) {
        // Should end in rooted stance
        expect(kneeL.x).toBeLessThan(-0.174); // At least -10° bent
        expect(kneeR.x).toBeLessThan(-0.174);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ANIMATION MAP TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_STANCE_ANIMATIONS Map", () => {
    it("should contain all stance animations", () => {
      expect(GAN_STANCE_ANIMATIONS.size).toBe(4);
      
      expect(GAN_STANCE_ANIMATIONS.has("gan_idle_rooted")).toBe(true);
      expect(GAN_STANCE_ANIMATIONS.has("gan_short_root_step")).toBe(true);
      expect(GAN_STANCE_ANIMATIONS.has("gan_defensive_angle_shift")).toBe(true);
      expect(GAN_STANCE_ANIMATIONS.has("gan_high_solid_guard_transition")).toBe(true);
    });

    it("should return correct animations from map", () => {
      expect(GAN_STANCE_ANIMATIONS.get("gan_idle_rooted")).toBe(GAN_IDLE_ROOTED);
      expect(GAN_STANCE_ANIMATIONS.get("gan_short_root_step")).toBe(GAN_SHORT_ROOT_STEP);
      expect(GAN_STANCE_ANIMATIONS.get("gan_defensive_angle_shift")).toBe(GAN_DEFENSIVE_ANGLE_SHIFT);
      expect(GAN_STANCE_ANIMATIONS.get("gan_high_solid_guard_transition")).toBe(GAN_HIGH_SOLID_GUARD_TRANSITION);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ANATOMICAL SAFETY TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("Anatomical Safety", () => {
    const allAnimations = [
      GAN_IDLE_ROOTED,
      GAN_SHORT_ROOT_STEP,
      GAN_DEFENSIVE_ANGLE_SHIFT,
      GAN_HIGH_SOLID_GUARD_TRANSITION,
    ];

    it("should not exceed safe joint rotation limits", () => {
      allAnimations.forEach((animation) => {
        animation.keyframes.forEach((frame) => {
          // Check elbow bends (should not exceed 145°)
          const elbowL = frame.boneRotations.get(BoneName.ELBOW_L);
          const elbowR = frame.boneRotations.get(BoneName.ELBOW_R);
          
          if (elbowL) {
            expect(Math.abs(elbowL.z)).toBeLessThan(2.53); // < 145°
          }
          if (elbowR) {
            expect(Math.abs(elbowR.z)).toBeLessThan(2.53);
          }
          
          // Check shoulder rotations (should not exceed extreme positions)
          const shoulderL = frame.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = frame.boneRotations.get(BoneName.SHOULDER_R);
          
          if (shoulderL) {
            expect(Math.abs(shoulderL.x)).toBeLessThan(1.57); // < 90°
          }
          if (shoulderR) {
            expect(Math.abs(shoulderR.x)).toBeLessThan(1.57);
          }
        });
      });
    });
  });
});
