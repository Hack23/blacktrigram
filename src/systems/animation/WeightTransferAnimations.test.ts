/**
 * Unit tests for Weight Transfer in Movement Animations
 *
 * Tests Korean martial arts weight transfer principles (체중이동) in movement animations:
 * - Hip position shifts during weight transfer
 * - Foot placement mechanics (heel-first for forward, ball-first for backward)
 * - Center of mass movement
 * - Korean martial arts principles (디딤발/축발)
 *
 * @module systems/animation/WeightTransferAnimations.test
 * @category Animation Tests
 * @korean 체중이동애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "../../types/skeletal";
import {
  MOVEMENT_FORWARD_STEP_ANIMATION,
  MOVEMENT_BACKWARD_STEP_ANIMATION,
  MOVEMENT_SIDESTEP_LEFT_ANIMATION,
  MOVEMENT_SIDESTEP_RIGHT_ANIMATION,
} from "./MovementAnimations";

describe("Weight Transfer Animations", () => {
  describe("Forward Step (전진스텝) Weight Transfer", () => {
    const animation = MOVEMENT_FORWARD_STEP_ANIMATION;

    it("should have proper animation structure", () => {
      expect(animation.name).toBe("movement_forward_step");
      expect(animation.koreanName).toBe("전진스텝");
      expect(animation.type).toBe("movement");
      expect(animation.duration).toBe(0.6); // 600ms for proper weight transfer
      expect(animation.keyframes.length).toBeGreaterThan(4); // Multiple phases
    });

    it("should shift hip toward stepping leg during weight transfer", () => {
      // Find the weight transfer phase (around 0.45s)
      const transferFrame = animation.keyframes.find((kf) => kf.time >= 0.45 && kf.time <= 0.5);
      expect(transferFrame).toBeDefined();

      const pelvisPos = transferFrame?.bonePositions.get(BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      // Hip should move forward (positive Z) and toward left leg (negative X)
      expect(pelvisPos!.x).toBeLessThan(0); // Hip shifts left toward front leg
      expect(pelvisPos!.z).toBeGreaterThan(0.3); // Hip moves forward
    });

    it("should show heel-first landing (디딤발 principle)", () => {
      // Find the heel strike phase (around 0.35s)
      const heelStrikeFrame = animation.keyframes.find((kf) => kf.time >= 0.35 && kf.time <= 0.4);
      expect(heelStrikeFrame).toBeDefined();

      const footRotation = heelStrikeFrame?.boneRotations.get(BoneName.FOOT_L);
      expect(footRotation).toBeDefined();
      // Positive X rotation means toe up, heel down
      expect(footRotation!.x).toBeGreaterThan(0);
    });

    it("should drop pelvis height during weight transfer", () => {
      // Initial frame
      const initialFrame = animation.keyframes[0];
      const initialPelvisY = initialFrame.bonePositions.get(BoneName.PELVIS)?.y ?? 0;

      // Find mid-transfer frame (around 0.25-0.35s)
      const midTransferFrame = animation.keyframes.find((kf) => kf.time >= 0.25 && kf.time <= 0.35);
      expect(midTransferFrame).toBeDefined();

      const midPelvisY = midTransferFrame?.bonePositions.get(BoneName.PELVIS)?.y ?? 0;
      // Pelvis should drop slightly during movement
      expect(midPelvisY).toBeLessThan(initialPelvisY);
    });

    it("should stabilize at final frame", () => {
      const finalFrame = animation.keyframes[animation.keyframes.length - 1];
      expect(finalFrame.time).toBe(0.6);

      const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      expect(pelvisPos!.y).toBe(0); // Return to neutral height
    });
  });

  describe("Backward Step (후진스텝) Weight Transfer", () => {
    const animation = MOVEMENT_BACKWARD_STEP_ANIMATION;

    it("should have proper animation structure", () => {
      expect(animation.name).toBe("movement_backward_step");
      expect(animation.koreanName).toBe("후진스텝");
      expect(animation.duration).toBe(0.6);
    });

    it("should shift hip toward back leg during weight transfer", () => {
      const transferFrame = animation.keyframes.find((kf) => kf.time >= 0.45 && kf.time <= 0.5);
      expect(transferFrame).toBeDefined();

      const pelvisPos = transferFrame?.bonePositions.get(BoneName.PELVIS);
      expect(pelvisPos).toBeDefined();
      // Hip should move backward (negative Z) and toward right leg (positive X)
      expect(pelvisPos!.x).toBeGreaterThan(0); // Hip shifts right toward back leg
      expect(pelvisPos!.z).toBeLessThan(-0.3); // Hip moves backward
    });

    it("should show ball-of-foot first landing (backward step principle)", () => {
      // Find the landing phase (around 0.35s)
      const landingFrame = animation.keyframes.find((kf) => kf.time >= 0.35 && kf.time <= 0.4);
      expect(landingFrame).toBeDefined();

      const footRotation = landingFrame?.boneRotations.get(BoneName.FOOT_R);
      expect(footRotation).toBeDefined();
      // Negative X rotation means ball of foot down, heel up
      expect(footRotation!.x).toBeLessThan(0);
    });

    it("should maintain forward-facing guard throughout", () => {
      const finalFrame = animation.keyframes[animation.keyframes.length - 1];
      
      // Check guard positions are defined
      const leftShoulder = finalFrame.boneRotations.get(BoneName.SHOULDER_L);
      const leftElbow = finalFrame.boneRotations.get(BoneName.ELBOW_L);
      const rightShoulder = finalFrame.boneRotations.get(BoneName.SHOULDER_R);
      const rightElbow = finalFrame.boneRotations.get(BoneName.ELBOW_R);
      
      expect(leftShoulder).toBeDefined();
      expect(leftElbow).toBeDefined();
      expect(rightShoulder).toBeDefined();
      expect(rightElbow).toBeDefined();
    });
  });

  describe("Left Sidestep (왼쪽측면스텝) Weight Transfer", () => {
    const animation = MOVEMENT_SIDESTEP_LEFT_ANIMATION;

    it("should have proper animation structure", () => {
      expect(animation.name).toBe("movement_sidestep_left");
      expect(animation.koreanName).toBe("왼쪽측면스텝");
      expect(animation.duration).toBe(0.5);
    });

    it("should shift hip laterally to the left", () => {
      const finalFrame = animation.keyframes[animation.keyframes.length - 1];
      const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);
      
      expect(pelvisPos).toBeDefined();
      // Full 30cm lateral movement to the left (negative X)
      expect(pelvisPos!.x).toBeLessThan(-0.25);
      // No significant forward/backward movement
      expect(Math.abs(pelvisPos!.z)).toBeLessThan(0.05);
    });

    it("should engage hip with pelvis rotation during lateral movement", () => {
      // Find the mid-movement phase (around 0.18s)
      const midFrame = animation.keyframes.find((kf) => kf.time >= 0.18 && kf.time <= 0.2);
      expect(midFrame).toBeDefined();

      const pelvisRotation = midFrame?.boneRotations.get(BoneName.PELVIS);
      expect(pelvisRotation).toBeDefined();
      // Pelvis should have Y-rotation for hip engagement
      expect(Math.abs(pelvisRotation!.y)).toBeGreaterThan(0);
    });

    it("should counter-rotate spine to maintain forward guard", () => {
      const midFrame = animation.keyframes.find((kf) => kf.time >= 0.18 && kf.time <= 0.2);
      expect(midFrame).toBeDefined();

      const spineRotation = midFrame?.boneRotations.get(BoneName.SPINE_LOWER);
      const pelvisRotation = midFrame?.boneRotations.get(BoneName.PELVIS);
      
      expect(spineRotation).toBeDefined();
      expect(pelvisRotation).toBeDefined();
      
      // Spine should counter-rotate opposite to pelvis
      // If pelvis rotates positive Y, spine rotates negative Y
      if (pelvisRotation!.y > 0) {
        expect(spineRotation!.y).toBeLessThan(0);
      }
    });

    it("should return to neutral rotation at end", () => {
      const finalFrame = animation.keyframes[animation.keyframes.length - 1];
      const pelvisRotation = finalFrame.boneRotations.get(BoneName.PELVIS);
      const spineRotation = finalFrame.boneRotations.get(BoneName.SPINE_LOWER);
      
      expect(pelvisRotation).toBeDefined();
      expect(spineRotation).toBeDefined();
      
      // Both should return to neutral (0) rotation
      expect(Math.abs(pelvisRotation!.y)).toBeLessThan(0.01);
      expect(Math.abs(spineRotation!.y)).toBeLessThan(0.01);
    });
  });

  describe("Right Sidestep (오른쪽측면스텝) Weight Transfer", () => {
    const animation = MOVEMENT_SIDESTEP_RIGHT_ANIMATION;

    it("should have proper animation structure", () => {
      expect(animation.name).toBe("movement_sidestep_right");
      expect(animation.koreanName).toBe("오른쪽측면스텝");
      expect(animation.duration).toBe(0.5);
    });

    it("should shift hip laterally to the right", () => {
      const finalFrame = animation.keyframes[animation.keyframes.length - 1];
      const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);
      
      expect(pelvisPos).toBeDefined();
      // Full 30cm lateral movement to the right (positive X)
      expect(pelvisPos!.x).toBeGreaterThan(0.25);
      // No significant forward/backward movement
      expect(Math.abs(pelvisPos!.z)).toBeLessThan(0.05);
    });

    it("should mirror left sidestep mechanics", () => {
      const leftAnim = MOVEMENT_SIDESTEP_LEFT_ANIMATION;
      const rightAnim = MOVEMENT_SIDESTEP_RIGHT_ANIMATION;
      
      // Should have same number of keyframes
      expect(rightAnim.keyframes.length).toBe(leftAnim.keyframes.length);
      
      // Should have same duration
      expect(rightAnim.duration).toBe(leftAnim.duration);
      
      // Final pelvis X positions should be opposite signs but similar magnitude
      const leftFinalX = leftAnim.keyframes[leftAnim.keyframes.length - 1]
        .bonePositions.get(BoneName.PELVIS)!.x;
      const rightFinalX = rightAnim.keyframes[rightAnim.keyframes.length - 1]
        .bonePositions.get(BoneName.PELVIS)!.x;
      
      expect(Math.abs(leftFinalX)).toBeCloseTo(Math.abs(rightFinalX), 1);
      expect(Math.sign(leftFinalX)).toBe(-Math.sign(rightFinalX));
    });
  });

  describe("Korean Martial Arts Principles (한국 무술 원리)", () => {
    it("should implement 디딤발 (Didimbal) - heel-first stepping", () => {
      const forwardStep = MOVEMENT_FORWARD_STEP_ANIMATION;
      
      // Find heel strike frame
      const heelFrame = forwardStep.keyframes.find((kf) => kf.time >= 0.35 && kf.time <= 0.4);
      expect(heelFrame).toBeDefined();
      
      const footRot = heelFrame?.boneRotations.get(BoneName.FOOT_L);
      expect(footRot).toBeDefined();
      expect(footRot!.x).toBeGreaterThan(0); // Toe up = heel down first
    });

    it("should implement 축발 (Chukbal) - pivot foot stability", () => {
      const forwardStep = MOVEMENT_FORWARD_STEP_ANIMATION;
      
      // During step, back leg (pivot foot) maintains stability
      const liftPhase = forwardStep.keyframes.find((kf) => kf.time >= 0.15 && kf.time <= 0.2);
      expect(liftPhase).toBeDefined();
      
      const backKnee = liftPhase?.boneRotations.get(BoneName.KNEE_R);
      expect(backKnee).toBeDefined();
      // Back knee should be flexed for stability
      expect(backKnee!.x).toBeLessThan(0);
    });

    it("should implement 체중이동 (Chejung Idong) - smooth weight transfer", () => {
      const forwardStep = MOVEMENT_FORWARD_STEP_ANIMATION;
      
      // Weight should transfer gradually, not abruptly
      // Check that pelvis X position changes smoothly across multiple frames
      const pelvisXPositions: number[] = [];
      
      for (const kf of forwardStep.keyframes) {
        const pelvisPos = kf.bonePositions.get(BoneName.PELVIS);
        if (pelvisPos) {
          pelvisXPositions.push(pelvisPos.x);
        }
      }
      
      // Should have multiple intermediate values (not just start and end)
      expect(pelvisXPositions.length).toBeGreaterThanOrEqual(5);
      
      // Check for smooth progression (no huge jumps)
      // Maximum 15cm per keyframe ensures smooth, natural movement without jarring transitions
      // This threshold is based on typical human gait where hip shift occurs gradually over multiple phases
      const MAX_SMOOTH_MOVEMENT_DELTA = 0.15; // meters (15cm)
      for (let i = 1; i < pelvisXPositions.length; i++) {
        const diff = Math.abs(pelvisXPositions[i] - pelvisXPositions[i - 1]);
        expect(diff).toBeLessThan(MAX_SMOOTH_MOVEMENT_DELTA);
      }
    });

    it("should implement 중심이동 (Jungsim Idong) - center of mass movement", () => {
      const forwardStep = MOVEMENT_FORWARD_STEP_ANIMATION;
      
      // Center of mass (pelvis) should follow body movement
      const startPelvis = forwardStep.keyframes[0].bonePositions.get(BoneName.PELVIS);
      const endPelvis = forwardStep.keyframes[forwardStep.keyframes.length - 1]
        .bonePositions.get(BoneName.PELVIS);
      
      expect(startPelvis).toBeDefined();
      expect(endPelvis).toBeDefined();
      
      // Pelvis should move significantly forward (positive Z)
      expect(endPelvis!.z).toBeGreaterThan(startPelvis!.z + 0.3);
    });
  });

  describe("Performance and 60fps Compatibility", () => {
    it("should have reasonable duration for 60fps", () => {
      const animations = [
        MOVEMENT_FORWARD_STEP_ANIMATION,
        MOVEMENT_BACKWARD_STEP_ANIMATION,
        MOVEMENT_SIDESTEP_LEFT_ANIMATION,
        MOVEMENT_SIDESTEP_RIGHT_ANIMATION,
      ];
      
      for (const anim of animations) {
        // Duration should be between 300ms (minimum for visibility) and 1000ms (maximum for responsiveness)
        expect(anim.duration).toBeGreaterThanOrEqual(0.3);
        expect(anim.duration).toBeLessThanOrEqual(1.0);
        
        // Should have reasonable number of keyframes (not too many for performance)
        expect(anim.keyframes.length).toBeLessThanOrEqual(20);
        expect(anim.keyframes.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("should have keyframes in chronological order", () => {
      const animations = [
        MOVEMENT_FORWARD_STEP_ANIMATION,
        MOVEMENT_BACKWARD_STEP_ANIMATION,
        MOVEMENT_SIDESTEP_LEFT_ANIMATION,
        MOVEMENT_SIDESTEP_RIGHT_ANIMATION,
      ];
      
      for (const anim of animations) {
        for (let i = 1; i < anim.keyframes.length; i++) {
          expect(anim.keyframes[i].time).toBeGreaterThan(anim.keyframes[i - 1].time);
        }
      }
    });
  });
});
