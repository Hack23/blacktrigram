/**
 * Unit tests for AttackAnimations
 * 
 * Tests Korean martial arts attack animation definitions, keyframes,
 * and animation data integrity.
 */

import { describe, it, expect } from "vitest";
import {
  JAB_ANIMATION,
  CROSS_ANIMATION,
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  BLOCK_ANIMATION,
  WALK_ANIMATION,
  IDLE_STANCE_ANIMATION,
  FORWARD_DASH_ANIMATION,
  BACKWARD_RETREAT_ANIMATION,
  SIDE_STEP_ANIMATION,
  ATTACK_ANIMATIONS,
  getAnimation,
} from "./AttackAnimations";
import { BoneName } from "../../types/skeletal";

describe("AttackAnimations", () => {
  describe("JAB_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(JAB_ANIMATION.name).toBe("jab");
      expect(JAB_ANIMATION.koreanName).toBe("잽");
      expect(JAB_ANIMATION.duration).toBe(0.3);
      expect(JAB_ANIMATION.loop).toBe(false);
      expect(JAB_ANIMATION.type).toBe("attack");
    });

    it("should have 4 keyframes", () => {
      expect(JAB_ANIMATION.keyframes).toHaveLength(4);
    });

    it("should have keyframes in chronological order", () => {
      for (let i = 1; i < JAB_ANIMATION.keyframes.length; i++) {
        expect(JAB_ANIMATION.keyframes[i].time).toBeGreaterThan(
          JAB_ANIMATION.keyframes[i - 1].time
        );
      }
    });

    it("should start at time 0", () => {
      expect(JAB_ANIMATION.keyframes[0].time).toBe(0);
    });

    it("should end at duration time", () => {
      const lastKeyframe =
        JAB_ANIMATION.keyframes[JAB_ANIMATION.keyframes.length - 1];
      expect(lastKeyframe.time).toBe(JAB_ANIMATION.duration);
    });

    it("should animate right arm bones", () => {
      const hasRightShoulder = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_R)
      );
      const hasRightElbow = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.ELBOW_R)
      );

      expect(hasRightShoulder).toBe(true);
      expect(hasRightElbow).toBe(true);
    });

    it("should have torso rotation for weight transfer", () => {
      const hasTorsoRotation = JAB_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SPINE_UPPER)
      );

      expect(hasTorsoRotation).toBe(true);
    });
  });

  describe("CROSS_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(CROSS_ANIMATION.name).toBe("cross");
      expect(CROSS_ANIMATION.koreanName).toBe("크로스");
      expect(CROSS_ANIMATION.duration).toBe(0.35);
      expect(CROSS_ANIMATION.loop).toBe(false);
      expect(CROSS_ANIMATION.type).toBe("attack");
    });

    it("should have 5 keyframes", () => {
      expect(CROSS_ANIMATION.keyframes).toHaveLength(5);
    });

    it("should animate left arm bones", () => {
      const hasLeftShoulder = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SHOULDER_L)
      );
      const hasLeftElbow = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.ELBOW_L)
      );

      expect(hasLeftShoulder).toBe(true);
      expect(hasLeftElbow).toBe(true);
    });

    it("should have hip rotation for power", () => {
      const hasPelvisRotation = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.PELVIS)
      );

      expect(hasPelvisRotation).toBe(true);
    });

    it("should have full body rotation chain", () => {
      const hasSpineLower = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SPINE_LOWER)
      );
      const hasSpineMiddle = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SPINE_MIDDLE)
      );
      const hasSpineUpper = CROSS_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SPINE_UPPER)
      );

      expect(hasSpineLower).toBe(true);
      expect(hasSpineMiddle).toBe(true);
      expect(hasSpineUpper).toBe(true);
    });
  });

  describe("FRONT_KICK_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(FRONT_KICK_ANIMATION.name).toBe("front_kick");
      expect(FRONT_KICK_ANIMATION.koreanName).toBe("앞차기");
      expect(FRONT_KICK_ANIMATION.duration).toBe(0.55); // Enhanced with recovery
      expect(FRONT_KICK_ANIMATION.loop).toBe(false);
      expect(FRONT_KICK_ANIMATION.type).toBe("attack");
    });

    it("should have 5 keyframes (enhanced with recovery)", () => {
      expect(FRONT_KICK_ANIMATION.keyframes).toHaveLength(5);
    });

    it("should animate right leg bones", () => {
      const hasRightHip = FRONT_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.HIP_R)
      );
      const hasRightKnee = FRONT_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.KNEE_R)
      );

      expect(hasRightHip).toBe(true);
      expect(hasRightKnee).toBe(true);
    });

    it("should have balance adjustments on support leg", () => {
      const hasLeftKnee = FRONT_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.KNEE_L)
      );

      expect(hasLeftKnee).toBe(true);
    });

    it("should have arm movements for balance", () => {
      const hasArmMovement = FRONT_KICK_ANIMATION.keyframes.some(
        (kf) =>
          kf.boneRotations.has(BoneName.SHOULDER_L) ||
          kf.boneRotations.has(BoneName.SHOULDER_R)
      );

      expect(hasArmMovement).toBe(true);
    });
  });

  describe("ROUNDHOUSE_KICK_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(ROUNDHOUSE_KICK_ANIMATION.name).toBe("roundhouse_kick");
      expect(ROUNDHOUSE_KICK_ANIMATION.koreanName).toBe("돌려차기");
      expect(ROUNDHOUSE_KICK_ANIMATION.duration).toBe(0.6); // Enhanced with recovery
      expect(ROUNDHOUSE_KICK_ANIMATION.loop).toBe(false);
      expect(ROUNDHOUSE_KICK_ANIMATION.type).toBe("attack");
    });

    it("should have 6 keyframes (enhanced with recovery)", () => {
      expect(ROUNDHOUSE_KICK_ANIMATION.keyframes).toHaveLength(6);
    });

    it("should have hip rotation for circular motion", () => {
      const hasPelvisRotation = ROUNDHOUSE_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.PELVIS)
      );

      expect(hasPelvisRotation).toBe(true);
    });

    it("should animate right leg for kick", () => {
      const hasRightHip = ROUNDHOUSE_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.HIP_R)
      );
      const hasRightKnee = ROUNDHOUSE_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.KNEE_R)
      );

      expect(hasRightHip).toBe(true);
      expect(hasRightKnee).toBe(true);
    });

    it("should have counter-rotation in torso", () => {
      const hasTorsoRotation = ROUNDHOUSE_KICK_ANIMATION.keyframes.some((kf) =>
        kf.boneRotations.has(BoneName.SPINE_UPPER)
      );

      expect(hasTorsoRotation).toBe(true);
    });
  });

  describe("BLOCK_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(BLOCK_ANIMATION.name).toBe("block");
      expect(BLOCK_ANIMATION.koreanName).toBe("막기");
      expect(BLOCK_ANIMATION.duration).toBe(0.4);
      expect(BLOCK_ANIMATION.loop).toBe(false);
      expect(BLOCK_ANIMATION.type).toBe("defense");
    });

    it("should have 3 keyframes", () => {
      expect(BLOCK_ANIMATION.keyframes).toHaveLength(3);
    });

    it("should animate both arms", () => {
      const hasLeftArm = BLOCK_ANIMATION.keyframes.some(
        (kf) =>
          kf.boneRotations.has(BoneName.SHOULDER_L) ||
          kf.boneRotations.has(BoneName.ELBOW_L)
      );
      const hasRightArm = BLOCK_ANIMATION.keyframes.some(
        (kf) =>
          kf.boneRotations.has(BoneName.SHOULDER_R) ||
          kf.boneRotations.has(BoneName.ELBOW_R)
      );

      expect(hasLeftArm).toBe(true);
      expect(hasRightArm).toBe(true);
    });

    it("should have defensive crouch in knees", () => {
      const hasKneeMovement = BLOCK_ANIMATION.keyframes.some(
        (kf) =>
          kf.boneRotations.has(BoneName.KNEE_L) ||
          kf.boneRotations.has(BoneName.KNEE_R)
      );

      expect(hasKneeMovement).toBe(true);
    });
  });

  describe("ATTACK_ANIMATIONS map", () => {
    it("should contain all 10 animations", () => {
      expect(ATTACK_ANIMATIONS.size).toBe(10); // 5 attacks + 1 walk + 4 new animations
    });

    it("should have jab animation", () => {
      expect(ATTACK_ANIMATIONS.has("jab")).toBe(true);
      expect(ATTACK_ANIMATIONS.get("jab")).toBe(JAB_ANIMATION);
    });

    it("should have cross animation", () => {
      expect(ATTACK_ANIMATIONS.has("cross")).toBe(true);
      expect(ATTACK_ANIMATIONS.get("cross")).toBe(CROSS_ANIMATION);
    });

    it("should have front_kick animation", () => {
      expect(ATTACK_ANIMATIONS.has("front_kick")).toBe(true);
      expect(ATTACK_ANIMATIONS.get("front_kick")).toBe(FRONT_KICK_ANIMATION);
    });

    it("should have roundhouse_kick animation", () => {
      expect(ATTACK_ANIMATIONS.has("roundhouse_kick")).toBe(true);
      expect(ATTACK_ANIMATIONS.get("roundhouse_kick")).toBe(
        ROUNDHOUSE_KICK_ANIMATION
      );
    });

    it("should have block animation", () => {
      expect(ATTACK_ANIMATIONS.has("block")).toBe(true);
      expect(ATTACK_ANIMATIONS.get("block")).toBe(BLOCK_ANIMATION);
    });

    it("should have walk animation", () => {
      expect(ATTACK_ANIMATIONS.has("walk")).toBe(true);
      expect(ATTACK_ANIMATIONS.get("walk")).toBe(WALK_ANIMATION);
    });
  });

  describe("getAnimation", () => {
    it("should return animation by name", () => {
      const jab = getAnimation("jab");
      expect(jab).toBe(JAB_ANIMATION);

      const cross = getAnimation("cross");
      expect(cross).toBe(CROSS_ANIMATION);
    });

    it("should return undefined for unknown animation", () => {
      const unknown = getAnimation("unknown_animation");
      expect(unknown).toBeUndefined();
    });
  });

  describe("Animation timing validation", () => {
    it("all animations should have reasonable durations", () => {
      const allAnimations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        BLOCK_ANIMATION,
        WALK_ANIMATION,
      ];

      allAnimations.forEach((anim) => {
        expect(anim.duration).toBeGreaterThan(0);
        expect(anim.duration).toBeLessThan(2); // No animation longer than 2 seconds
      });
    });

    it("all animations should have at least 2 keyframes", () => {
      const allAnimations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        BLOCK_ANIMATION,
        WALK_ANIMATION,
      ];

      allAnimations.forEach((anim) => {
        expect(anim.keyframes.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("keyframes should cover animation duration", () => {
      const allAnimations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        BLOCK_ANIMATION,
        WALK_ANIMATION,
      ];

      allAnimations.forEach((anim) => {
        const firstTime = anim.keyframes[0].time;
        const lastTime = anim.keyframes[anim.keyframes.length - 1].time;

        expect(firstTime).toBeLessThanOrEqual(anim.duration); // Start before end
        expect(lastTime).toBeCloseTo(anim.duration, 2); // End at duration
      });
    });
  });

  describe("Korean martial arts authenticity", () => {
    it("all animations should have Korean names", () => {
      const allAnimations = [
        JAB_ANIMATION,
        CROSS_ANIMATION,
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        BLOCK_ANIMATION,
        WALK_ANIMATION,
      ];

      allAnimations.forEach((anim) => {
        expect(anim.koreanName).toBeTruthy();
        expect(anim.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("attack animations should be marked as attack type", () => {
      expect(JAB_ANIMATION.type).toBe("attack");
      expect(CROSS_ANIMATION.type).toBe("attack");
      expect(FRONT_KICK_ANIMATION.type).toBe("attack");
      expect(ROUNDHOUSE_KICK_ANIMATION.type).toBe("attack");
    });

    it("block animation should be marked as defense type", () => {
      expect(BLOCK_ANIMATION.type).toBe("defense");
    });

    it("walk animation should be marked as movement type", () => {
      expect(WALK_ANIMATION.type).toBe("movement");
    });
  });

  describe("WALK_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(WALK_ANIMATION.name).toBe("walk");
      expect(WALK_ANIMATION.koreanName).toBe("걷기");
      expect(WALK_ANIMATION.duration).toBe(0.8);
      expect(WALK_ANIMATION.loop).toBe(true);
      expect(WALK_ANIMATION.type).toBe("movement");
    });

    it("should have 5 keyframes for complete cycle", () => {
      expect(WALK_ANIMATION.keyframes).toHaveLength(5);
    });

    it("should have keyframes in chronological order", () => {
      for (let i = 1; i < WALK_ANIMATION.keyframes.length; i++) {
        expect(WALK_ANIMATION.keyframes[i].time).toBeGreaterThan(
          WALK_ANIMATION.keyframes[i - 1].time
        );
      }
    });

    it("should start at time 0", () => {
      expect(WALK_ANIMATION.keyframes[0].time).toBe(0);
    });

    it("should end at duration time", () => {
      const lastKeyframe =
        WALK_ANIMATION.keyframes[WALK_ANIMATION.keyframes.length - 1];
      expect(lastKeyframe.time).toBe(WALK_ANIMATION.duration);
    });

    it("should animate both legs", () => {
      const firstKeyframe = WALK_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.HIP_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.HIP_R)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it("should have alternating leg movement", () => {
      // Frame 1: Left foot forward
      const frame1 = WALK_ANIMATION.keyframes[0];
      const leftHipFrame1 = frame1.boneRotations.get(BoneName.HIP_L);
      const rightHipFrame1 = frame1.boneRotations.get(BoneName.HIP_R);
      
      // Frame 3: Right foot forward (should be opposite)
      const frame3 = WALK_ANIMATION.keyframes[2];
      const leftHipFrame3 = frame3.boneRotations.get(BoneName.HIP_L);
      const rightHipFrame3 = frame3.boneRotations.get(BoneName.HIP_R);

      // Left hip should move from forward to back
      expect(leftHipFrame1?.x).toBeLessThan(leftHipFrame3!.x);
      // Right hip should move from back to forward
      expect(rightHipFrame1?.x).toBeGreaterThan(rightHipFrame3!.x);
    });

    it("should animate arms opposite to legs", () => {
      const firstKeyframe = WALK_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
    });

    it("should include pelvis movement for natural gait", () => {
      const firstKeyframe = WALK_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.PELVIS)).toBe(true);
      expect(firstKeyframe.bonePositions?.has(BoneName.PELVIS)).toBe(true);
    });

    it("should loop seamlessly", () => {
      const firstFrame = WALK_ANIMATION.keyframes[0];
      const lastFrame =
        WALK_ANIMATION.keyframes[WALK_ANIMATION.keyframes.length - 1];
      
      // First and last frames should have similar rotations for smooth looping
      const firstLeftHip = firstFrame.boneRotations.get(BoneName.HIP_L);
      const lastLeftHip = lastFrame.boneRotations.get(BoneName.HIP_L);
      
      expect(firstLeftHip?.x).toBeCloseTo(lastLeftHip!.x, 1);
    });
  });

  describe("IDLE_STANCE_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(IDLE_STANCE_ANIMATION.name).toBe("idle_stance");
      expect(IDLE_STANCE_ANIMATION.koreanName).toBe("대기 자세");
      expect(IDLE_STANCE_ANIMATION.duration).toBe(3.0);
      expect(IDLE_STANCE_ANIMATION.loop).toBe(true);
      expect(IDLE_STANCE_ANIMATION.type).toBe("idle");
    });

    it("should have 5 keyframes", () => {
      expect(IDLE_STANCE_ANIMATION.keyframes).toHaveLength(5);
    });

    it("should have slight knee bend for fighting stance", () => {
      const firstKeyframe = IDLE_STANCE_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it("should include breathing motion through spine", () => {
      const breathingKeyframe = IDLE_STANCE_ANIMATION.keyframes[1];
      expect(breathingKeyframe.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
      expect(breathingKeyframe.boneRotations.has(BoneName.SPINE_MIDDLE)).toBe(true);
      expect(breathingKeyframe.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
    });

    it("should have weight shift in pelvis", () => {
      const shiftKeyframe = IDLE_STANCE_ANIMATION.keyframes[1];
      expect(shiftKeyframe.boneRotations.has(BoneName.PELVIS)).toBe(true);
      expect(shiftKeyframe.bonePositions?.has(BoneName.PELVIS)).toBe(true);
    });

    it("should maintain guard position", () => {
      const firstKeyframe = IDLE_STANCE_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.ELBOW_R)).toBe(true);
    });
  });

  describe("FORWARD_DASH_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(FORWARD_DASH_ANIMATION.name).toBe("forward_dash");
      expect(FORWARD_DASH_ANIMATION.koreanName).toBe("앞으로 돌진");
      expect(FORWARD_DASH_ANIMATION.duration).toBe(0.4);
      expect(FORWARD_DASH_ANIMATION.loop).toBe(false);
      expect(FORWARD_DASH_ANIMATION.type).toBe("movement");
    });

    it("should have 4 keyframes", () => {
      expect(FORWARD_DASH_ANIMATION.keyframes).toHaveLength(4);
    });

    it("should start with deep crouch", () => {
      const firstKeyframe = FORWARD_DASH_ANIMATION.keyframes[0];
      const leftKnee = firstKeyframe.boneRotations.get(BoneName.KNEE_L);
      const rightKnee = firstKeyframe.boneRotations.get(BoneName.KNEE_R);
      
      // Both knees should be significantly bent (negative rotation)
      expect(leftKnee).toBeDefined();
      expect(rightKnee).toBeDefined();
      expect(leftKnee!.x).toBeLessThan(-0.5);
      expect(rightKnee!.x).toBeLessThan(-0.5);
    });

    it("should have explosive knee extension", () => {
      const driveKeyframe = FORWARD_DASH_ANIMATION.keyframes[1];
      expect(driveKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(driveKeyframe.boneRotations.has(BoneName.KNEE_R)).toBe(true);
      expect(driveKeyframe.bonePositions?.has(BoneName.PELVIS)).toBe(true);
    });

    it("should move pelvis forward", () => {
      const driveKeyframe = FORWARD_DASH_ANIMATION.keyframes[1];
      const pelvisPos = driveKeyframe.bonePositions?.get(BoneName.PELVIS);
      
      expect(pelvisPos).toBeDefined();
      expect(pelvisPos!.z).toBeGreaterThan(0.5); // Significant forward movement
    });
  });

  describe("BACKWARD_RETREAT_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(BACKWARD_RETREAT_ANIMATION.name).toBe("backward_retreat");
      expect(BACKWARD_RETREAT_ANIMATION.koreanName).toBe("뒤로 물러서기");
      expect(BACKWARD_RETREAT_ANIMATION.duration).toBe(0.45);
      expect(BACKWARD_RETREAT_ANIMATION.loop).toBe(false);
      expect(BACKWARD_RETREAT_ANIMATION.type).toBe("movement");
    });

    it("should have 4 keyframes", () => {
      expect(BACKWARD_RETREAT_ANIMATION.keyframes).toHaveLength(4);
    });

    it("should move pelvis backward", () => {
      const slideKeyframe = BACKWARD_RETREAT_ANIMATION.keyframes[1];
      const pelvisPos = slideKeyframe.bonePositions?.get(BoneName.PELVIS);
      
      expect(pelvisPos).toBeDefined();
      expect(pelvisPos!.z).toBeLessThan(0); // Negative z = backward
    });

    it("should maintain defensive guard", () => {
      const firstKeyframe = BACKWARD_RETREAT_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it("should have coordinated leg movement", () => {
      const firstKeyframe = BACKWARD_RETREAT_ANIMATION.keyframes[0];
      expect(firstKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(firstKeyframe.boneRotations.has(BoneName.KNEE_R)).toBe(true);
    });
  });

  describe("SIDE_STEP_ANIMATION", () => {
    it("should have correct metadata", () => {
      expect(SIDE_STEP_ANIMATION.name).toBe("side_step");
      expect(SIDE_STEP_ANIMATION.koreanName).toBe("옆으로 스텝");
      expect(SIDE_STEP_ANIMATION.duration).toBe(0.3);
      expect(SIDE_STEP_ANIMATION.loop).toBe(false);
      expect(SIDE_STEP_ANIMATION.type).toBe("movement");
    });

    it("should have 4 keyframes", () => {
      expect(SIDE_STEP_ANIMATION.keyframes).toHaveLength(4);
    });

    it("should shift pelvis laterally", () => {
      const shiftKeyframe = SIDE_STEP_ANIMATION.keyframes[0];
      const pelvisPos = shiftKeyframe.bonePositions?.get(BoneName.PELVIS);
      const pelvisRot = shiftKeyframe.boneRotations.get(BoneName.PELVIS);
      
      expect(pelvisPos).toBeDefined();
      expect(pelvisRot).toBeDefined();
      expect(Math.abs(pelvisPos!.x)).toBeGreaterThan(0.2); // Lateral movement
    });

    it("should have asymmetric knee bend for weight shift", () => {
      const shiftKeyframe = SIDE_STEP_ANIMATION.keyframes[0];
      const leftKnee = shiftKeyframe.boneRotations.get(BoneName.KNEE_L);
      const rightKnee = shiftKeyframe.boneRotations.get(BoneName.KNEE_R);
      
      expect(leftKnee).toBeDefined();
      expect(rightKnee).toBeDefined();
      // One knee should bend more than the other
      expect(Math.abs(leftKnee!.x - rightKnee!.x)).toBeGreaterThan(0.1);
    });

    it("should compensate with spine rotation", () => {
      const shiftKeyframe = SIDE_STEP_ANIMATION.keyframes[0];
      expect(shiftKeyframe.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
      expect(shiftKeyframe.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
    });
  });

  describe("Enhanced kick animations", () => {
    it("FRONT_KICK should have ankle dorsiflexion", () => {
      const extensionKeyframe = FRONT_KICK_ANIMATION.keyframes[1];
      const foot = extensionKeyframe.boneRotations.get(BoneName.FOOT_R);
      
      expect(foot).toBeDefined();
      expect(foot!.x).toBeCloseTo(0.5, 1); // Dorsiflexion 0.5 rad
    });

    it("FRONT_KICK should have support leg micro-adjustments", () => {
      const extensionKeyframe = FRONT_KICK_ANIMATION.keyframes[1];
      expect(extensionKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(extensionKeyframe.boneRotations.has(BoneName.FOOT_L)).toBe(true);
    });

    it("FRONT_KICK should have balance recovery", () => {
      const recoveryKeyframe = FRONT_KICK_ANIMATION.keyframes[4];
      const pelvisPos = recoveryKeyframe.bonePositions?.get(BoneName.PELVIS);
      
      expect(pelvisPos).toBeDefined();
      expect(pelvisPos!.y).toBe(0); // Returns to stable height
    });

    it("ROUNDHOUSE_KICK should have ankle flexion on impact", () => {
      const impactKeyframe = ROUNDHOUSE_KICK_ANIMATION.keyframes[2];
      const foot = impactKeyframe.boneRotations.get(BoneName.FOOT_R);
      
      expect(foot).toBeDefined();
      expect(foot!.x).toBeGreaterThan(0.3); // Plantar flexion
    });

    it("ROUNDHOUSE_KICK should have support leg pivot", () => {
      const impactKeyframe = ROUNDHOUSE_KICK_ANIMATION.keyframes[2];
      expect(impactKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(impactKeyframe.boneRotations.has(BoneName.FOOT_L)).toBe(true);
    });

    it("ROUNDHOUSE_KICK should have balance recovery shuffle", () => {
      const recoveryKeyframe = ROUNDHOUSE_KICK_ANIMATION.keyframes[5];
      expect(recoveryKeyframe.boneRotations.has(BoneName.KNEE_R)).toBe(true);
      expect(recoveryKeyframe.boneRotations.has(BoneName.KNEE_L)).toBe(true);
      expect(recoveryKeyframe.bonePositions?.has(BoneName.PELVIS)).toBe(true);
    });
  });
});
