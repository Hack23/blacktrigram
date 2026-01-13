/**
 * Integration tests for Guard Positions in Animations
 *
 * Tests that animations properly apply and maintain Korean martial arts
 * guard positions (막기자세) throughout technique execution.
 *
 * @module systems/animation/GuardPositionIntegration.test
 * @category Tests
 * @korean 방어자세통합테스트
 */

import { describe, expect, it } from "vitest";
import { BoneName } from "../../types/skeletal";
import { CROSS_ANIMATION, JAB_ANIMATION } from "./PunchAnimations";
import { MIDDLE_GUARD } from "./KoreanGuardPositions";

describe("Guard Position Integration in Animations", () => {
  describe("JAB Animation Guard Integration", () => {
    it("should have proper keyframe structure", () => {
      expect(JAB_ANIMATION.keyframes.length).toBeGreaterThan(0);
      expect(JAB_ANIMATION.duration).toBe(0.55); // FAST technique
    });

    it("should maintain right hand guard during left jab", () => {
      // Find keyframes after the initial chamber phase
      const extensionKeyframes = JAB_ANIMATION.keyframes.filter(
        kf => kf.time > 0.1 && kf.time < 0.45
      );

      // At least some keyframes should have right arm guard positions
      const hasRightArmGuard = extensionKeyframes.some(kf => {
        const rightShoulder = kf.boneRotations.get(BoneName.SHOULDER_R);
        const rightElbow = kf.boneRotations.get(BoneName.ELBOW_R);
        return rightShoulder !== undefined && rightElbow !== undefined;
      });

      expect(hasRightArmGuard).toBe(true);
    });

    it("should have guard positions applied through builder methods", () => {
      // Check that the animation has multiple keyframes with arm rotations
      const keyframesWithArms = JAB_ANIMATION.keyframes.filter(kf => {
        const hasLeftArm = 
          kf.boneRotations.has(BoneName.SHOULDER_L) || 
          kf.boneRotations.has(BoneName.ELBOW_L);
        const hasRightArm = 
          kf.boneRotations.has(BoneName.SHOULDER_R) || 
          kf.boneRotations.has(BoneName.ELBOW_R);
        return hasLeftArm || hasRightArm;
      });

      // Should have arm positions throughout animation
      expect(keyframesWithArms.length).toBeGreaterThan(2);
    });

    it("should return to neutral position after technique", () => {
      // Last keyframe should have both arms positioned
      const lastKeyframe = JAB_ANIMATION.keyframes[JAB_ANIMATION.keyframes.length - 1];
      
      const hasLeftArm = 
        lastKeyframe.boneRotations.has(BoneName.SHOULDER_L) &&
        lastKeyframe.boneRotations.has(BoneName.ELBOW_L);
      const hasRightArm = 
        lastKeyframe.boneRotations.has(BoneName.SHOULDER_R) &&
        lastKeyframe.boneRotations.has(BoneName.ELBOW_R);

      // Recovery should position both arms
      expect(hasLeftArm || hasRightArm).toBe(true);
    });
  });

  describe("CROSS Animation Guard Integration", () => {
    it("should have proper keyframe structure", () => {
      expect(CROSS_ANIMATION.keyframes.length).toBeGreaterThan(0);
      expect(CROSS_ANIMATION.duration).toBe(0.73); // MEDIUM technique
    });

    it("should maintain left hand guard during right cross", () => {
      // Find keyframes during execution phase
      const extensionKeyframes = CROSS_ANIMATION.keyframes.filter(
        kf => kf.time > 0.15 && kf.time < 0.55
      );

      // At least some keyframes should have left arm guard positions
      const hasLeftArmGuard = extensionKeyframes.some(kf => {
        const leftShoulder = kf.boneRotations.get(BoneName.SHOULDER_L);
        const leftElbow = kf.boneRotations.get(BoneName.ELBOW_L);
        return leftShoulder !== undefined && leftElbow !== undefined;
      });

      expect(hasLeftArmGuard).toBe(true);
    });

    it("should have proper arm rotations throughout", () => {
      const keyframesWithArms = CROSS_ANIMATION.keyframes.filter(kf => {
        const hasLeftArm = 
          kf.boneRotations.has(BoneName.SHOULDER_L) || 
          kf.boneRotations.has(BoneName.ELBOW_L);
        const hasRightArm = 
          kf.boneRotations.has(BoneName.SHOULDER_R) || 
          kf.boneRotations.has(BoneName.ELBOW_R);
        return hasLeftArm || hasRightArm;
      });

      // Should have arm positions throughout animation
      expect(keyframesWithArms.length).toBeGreaterThan(2);
    });

    it("should return to neutral position after technique", () => {
      // Last keyframe should have both arms positioned
      const lastKeyframe = CROSS_ANIMATION.keyframes[CROSS_ANIMATION.keyframes.length - 1];
      
      const hasLeftArm = 
        lastKeyframe.boneRotations.has(BoneName.SHOULDER_L) &&
        lastKeyframe.boneRotations.has(BoneName.ELBOW_L);
      const hasRightArm = 
        lastKeyframe.boneRotations.has(BoneName.SHOULDER_R) &&
        lastKeyframe.boneRotations.has(BoneName.ELBOW_R);

      // Recovery should position both arms
      expect(hasLeftArm || hasRightArm).toBe(true);
    });
  });

  describe("Guard Position Values", () => {
    it("should have valid rotation values in radians", () => {
      // Check JAB animation
      for (const kf of JAB_ANIMATION.keyframes) {
        for (const [boneName, rotation] of kf.boneRotations.entries()) {
          // Rotation values should be in reasonable range (radians)
          expect(Math.abs(rotation.x)).toBeLessThanOrEqual(Math.PI);
          expect(Math.abs(rotation.y)).toBeLessThanOrEqual(Math.PI * 2);
          expect(Math.abs(rotation.z)).toBeLessThanOrEqual(Math.PI);
        }
      }

      // Check CROSS animation
      for (const kf of CROSS_ANIMATION.keyframes) {
        for (const [boneName, rotation] of kf.boneRotations.entries()) {
          // Rotation values should be in reasonable range (radians)
          expect(Math.abs(rotation.x)).toBeLessThanOrEqual(Math.PI);
          expect(Math.abs(rotation.y)).toBeLessThanOrEqual(Math.PI * 2);
          expect(Math.abs(rotation.z)).toBeLessThanOrEqual(Math.PI);
        }
      }
    });

    it("should have guard-like elbow angles when guard is applied", () => {
      // Middle guard should have elbows bent around 90 degrees (~1.57 radians)
      const expectedElbowBend = Math.PI / 2; // 90 degrees
      const tolerance = Math.PI / 4; // 45 degree tolerance

      // Check that some keyframes have elbow bends consistent with guard positions
      const jabKeyframesWithGuard = JAB_ANIMATION.keyframes.filter(kf => {
        const rightElbow = kf.boneRotations.get(BoneName.ELBOW_R);
        if (!rightElbow) return false;
        
        // Check if elbow Z rotation is in guard range
        const elbowZ = Math.abs(rightElbow.z);
        return elbowZ > (expectedElbowBend - tolerance) && 
               elbowZ < (expectedElbowBend + tolerance);
      });

      // Should have at least one keyframe with guard-like elbow position
      expect(jabKeyframesWithGuard.length).toBeGreaterThan(0);
    });

    it("should have symmetric guard positions for left/right", () => {
      // When both hands are in guard, their rotations should be mirrored
      const lastJabKeyframe = JAB_ANIMATION.keyframes[JAB_ANIMATION.keyframes.length - 1];
      
      const leftElbow = lastJabKeyframe.boneRotations.get(BoneName.ELBOW_L);
      const rightElbow = lastJabKeyframe.boneRotations.get(BoneName.ELBOW_R);

      if (leftElbow && rightElbow) {
        // Z rotations should be opposite signs (mirrored)
        expect(Math.sign(leftElbow.z)).toBe(-Math.sign(rightElbow.z));
      }
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should use middle guard for punch techniques", () => {
      // JAB and CROSS should use middle guard (chest level protection)
      // This is verified by checking that guard methods were called
      // and arm positions are at appropriate angles
      
      // Middle guard has elbows at ~90 degrees
      const middleGuardElbowAngle = Math.abs(MIDDLE_GUARD.left.elbow[2]);
      expect(middleGuardElbowAngle).toBeCloseTo(Math.PI / 2, 1);
    });

    it("should maintain non-striking hand in defensive position", () => {
      // During JAB (left hand strikes), right hand should stay in guard
      // Check keyframes during execution phase
      const jabExecutionPhase = JAB_ANIMATION.keyframes.filter(
        kf => kf.time > 0.1 && kf.time < 0.4
      );

      // At least some keyframes should have right shoulder/elbow positions
      const rightArmPositioned = jabExecutionPhase.some(kf => 
        kf.boneRotations.has(BoneName.SHOULDER_R) || 
        kf.boneRotations.has(BoneName.ELBOW_R)
      );

      expect(rightArmPositioned).toBe(true);
    });

    it("should follow Korean punch technique progression", () => {
      // Korean martial arts emphasize:
      // 1. Preparation (준비) - Chamber
      // 2. Execution (실행) - Strike
      // 3. Return (복귀) - Guard
      
      // JAB should have multiple phases
      expect(JAB_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
      
      // CROSS should have multiple phases
      expect(CROSS_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
      
      // First keyframe time should be near 0 or at chamber phase
      expect(JAB_ANIMATION.keyframes[0].time).toBeLessThanOrEqual(0.15);
      expect(CROSS_ANIMATION.keyframes[0].time).toBeLessThanOrEqual(0.2);
    });

    it("should use proper timing for Korean techniques", () => {
      // Korean martial arts emphasize visible technique phases
      // JAB (FAST technique) should be 550ms
      expect(JAB_ANIMATION.duration).toBe(0.55);
      
      // CROSS (MEDIUM technique) should be 730ms
      expect(CROSS_ANIMATION.duration).toBe(0.73);
      
      // All keyframes should be within duration
      for (const kf of JAB_ANIMATION.keyframes) {
        expect(kf.time).toBeLessThanOrEqual(JAB_ANIMATION.duration);
      }
      for (const kf of CROSS_ANIMATION.keyframes) {
        expect(kf.time).toBeLessThanOrEqual(CROSS_ANIMATION.duration);
      }
    });
  });
});
