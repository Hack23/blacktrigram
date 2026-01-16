/**
 * Unit tests for Tae (Lake) Joint Lock Animations
 *
 * Comprehensive tests for all Tae Trigram combat technique animations.
 *
 * @korean 태괘관절기애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  TAE_ARM_BAR,
  TAE_ELBOW_CONTROL,
  TAE_FINGER_LOCK,
  TAE_FLOWING_COUNTER,
  TAE_FLOWING_STRIKES,
  TAE_SMALL_CIRCLE,
  TAE_SHOULDER_LOCK,
  TAE_WRIST_LOCK_SEQUENCE,
} from "./TaeJointLockAnimations";

describe("Tae (Lake) Joint Lock Animations", () => {
  // ═══════════════════════════════════════════════════════════════════════
  // EXISTING ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_WRIST_LOCK_SEQUENCE (손목꺾기)", () => {
    it("should have correct metadata", () => {
      expect(TAE_WRIST_LOCK_SEQUENCE.name).toBe("tae_wrist_lock_sequence");
      expect(TAE_WRIST_LOCK_SEQUENCE.koreanName).toBe("손목꺾기");
    });

    it("should have correct duration and phases", () => {
      expect(TAE_WRIST_LOCK_SEQUENCE.duration).toBe(1.8);
      expect(TAE_WRIST_LOCK_SEQUENCE.keyframes.length).toBeGreaterThanOrEqual(4);
    });

    it("should demonstrate circular motion in shoulder rotation", () => {
      const keyframes = TAE_WRIST_LOCK_SEQUENCE.keyframes;
      const shoulderRotations = keyframes
        .map((f) => f.boneRotations.get(BoneName.SHOULDER_R)?.y || 0)
        .filter((y) => y !== 0);

      expect(shoulderRotations.length).toBeGreaterThan(3);
      expect(Math.max(...shoulderRotations)).toBeGreaterThan(0.5);
    });
  });

  describe("TAE_ELBOW_CONTROL (팔꿈치 제어)", () => {
    it("should have correct metadata", () => {
      expect(TAE_ELBOW_CONTROL.name).toBe("tae_elbow_control");
      expect(TAE_ELBOW_CONTROL.koreanName).toBe("팔꿈치 제어");
    });

    it("should have correct duration", () => {
      expect(TAE_ELBOW_CONTROL.duration).toBe(1.65);
      expect(TAE_ELBOW_CONTROL.keyframes.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("TAE_FINGER_LOCK (손가락제압)", () => {
    it("should have correct metadata", () => {
      expect(TAE_FINGER_LOCK.name).toBe("finger_lock");
      expect(TAE_FINGER_LOCK.koreanName).toBe("손가락제압");
    });

    it("should have correct duration", () => {
      expect(TAE_FINGER_LOCK.duration).toBe(0.5);
      expect(TAE_FINGER_LOCK.keyframes.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("TAE_FLOWING_COUNTER (유수관절기방어)", () => {
    it("should have correct metadata", () => {
      expect(TAE_FLOWING_COUNTER.name).toBe("flowing_lock_counter");
      expect(TAE_FLOWING_COUNTER.koreanName).toBe("유수관절기방어");
    });

    it("should have correct duration", () => {
      expect(TAE_FLOWING_COUNTER.duration).toBe(0.65);
      expect(TAE_FLOWING_COUNTER.keyframes.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // NEW COMBAT TECHNIQUE ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_FLOWING_STRIKES (유수연타)", () => {
    it("should have correct metadata", () => {
      expect(TAE_FLOWING_STRIKES.name).toBe("tae_flowing_strikes");
      expect(TAE_FLOWING_STRIKES.koreanName).toBe("유수연타");
      expect(TAE_FLOWING_STRIKES.type).toBe("attack");
    });

    it("should have correct duration", () => {
      expect(TAE_FLOWING_STRIKES.duration).toBe(0.6);
      expect(TAE_FLOWING_STRIKES.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate forward motion", () => {
      const firstFrame = TAE_FLOWING_STRIKES.keyframes[0];
      const lastFrame = TAE_FLOWING_STRIKES.keyframes[
        TAE_FLOWING_STRIKES.keyframes.length - 1
      ];

      const firstZ = firstFrame.bonePositions.get(BoneName.PELVIS)?.z || 0;
      const lastZ = lastFrame.bonePositions.get(BoneName.PELVIS)?.z || 0;

      expect(lastZ).toBeGreaterThan(firstZ);
    });
  });

  describe("TAE_SMALL_CIRCLE (소원법)", () => {
    it("should have correct metadata", () => {
      expect(TAE_SMALL_CIRCLE.name).toBe("tae_small_circle");
      expect(TAE_SMALL_CIRCLE.koreanName).toBe("소원법");
      expect(TAE_SMALL_CIRCLE.type).toBe("attack");
    });

    it("should have correct duration", () => {
      expect(TAE_SMALL_CIRCLE.duration).toBe(0.75);
      expect(TAE_SMALL_CIRCLE.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should engage both shoulders", () => {
      const lockFrame = TAE_SMALL_CIRCLE.keyframes[
        TAE_SMALL_CIRCLE.keyframes.length - 1
      ];

      expect(lockFrame.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(lockFrame.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
    });

    it("should demonstrate wrist rotation", () => {
      const lockFrame = TAE_SMALL_CIRCLE.keyframes[
        TAE_SMALL_CIRCLE.keyframes.length - 1
      ];

      expect(lockFrame.boneRotations.has(BoneName.WRIST_R)).toBe(true);
    });
  });

  describe("TAE_SHOULDER_LOCK (어깨꺾기)", () => {
    it("should have correct metadata", () => {
      expect(TAE_SHOULDER_LOCK.name).toBe("tae_shoulder_lock");
      expect(TAE_SHOULDER_LOCK.koreanName).toBe("어깨꺾기");
      expect(TAE_SHOULDER_LOCK.type).toBe("attack");
    });

    it("should have correct duration", () => {
      expect(TAE_SHOULDER_LOCK.duration).toBe(0.85);
      expect(TAE_SHOULDER_LOCK.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate extreme shoulder rotation", () => {
      const lockFrame = TAE_SHOULDER_LOCK.keyframes[
        TAE_SHOULDER_LOCK.keyframes.length - 1
      ];

      const shoulderRot = lockFrame.boneRotations.get(BoneName.SHOULDER_R);
      expect(shoulderRot).toBeTruthy();

      if (shoulderRot) {
        expect(Math.abs(shoulderRot.y)).toBeGreaterThan(0.8);
      }
    });

    it("should use both hands", () => {
      const lockFrame = TAE_SHOULDER_LOCK.keyframes[
        TAE_SHOULDER_LOCK.keyframes.length - 1
      ];

      expect(lockFrame.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(lockFrame.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
    });
  });

  describe("TAE_ARM_BAR (팔꺾기)", () => {
    it("should have correct metadata", () => {
      expect(TAE_ARM_BAR.name).toBe("tae_arm_bar");
      expect(TAE_ARM_BAR.koreanName).toBe("팔꺾기");
      expect(TAE_ARM_BAR.type).toBe("attack");
    });

    it("should have correct duration", () => {
      expect(TAE_ARM_BAR.duration).toBe(0.9);
      expect(TAE_ARM_BAR.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate body pivot", () => {
      const frames = TAE_ARM_BAR.keyframes;
      const spineRotations = frames.map(f => 
        f.boneRotations.get(BoneName.SPINE_UPPER)?.y || 0
      );

      expect(Math.max(...spineRotations)).toBeGreaterThan(0.6);
    });

    it("should drop body for leverage", () => {
      const finalFrame = TAE_ARM_BAR.keyframes[
        TAE_ARM_BAR.keyframes.length - 1
      ];

      const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);
      expect(pelvisPos).toBeTruthy();
      
      if (pelvisPos) {
        expect(pelvisPos.y).toBeLessThan(-0.08);
      }
    });

    it("should use both hands for control", () => {
      const lockFrame = TAE_ARM_BAR.keyframes[
        TAE_ARM_BAR.keyframes.length - 1
      ];

      expect(lockFrame.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(lockFrame.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // CROSS-ANIMATION VALIDATION
  // ═══════════════════════════════════════════════════════════════════════

  describe("All Tae Combat Techniques", () => {
    const allAnimations = [
      TAE_WRIST_LOCK_SEQUENCE,
      TAE_ELBOW_CONTROL,
      TAE_FINGER_LOCK,
      TAE_FLOWING_COUNTER,
      TAE_FLOWING_STRIKES,
      TAE_SMALL_CIRCLE,
      TAE_SHOULDER_LOCK,
      TAE_ARM_BAR,
    ];

    it("should all have valid Korean names", () => {
      allAnimations.forEach(anim => {
        expect(anim.koreanName).toBeTruthy();
        expect(anim.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("should all have reasonable durations", () => {
      allAnimations.forEach(anim => {
        expect(anim.duration).toBeGreaterThan(0);
        expect(anim.duration).toBeLessThan(2);
      });
    });

    it("should all be attack or defense type", () => {
      allAnimations.forEach(anim => {
        expect(["attack", "defense"]).toContain(anim.type);
      });
    });

    it("should all have at least 2 keyframes", () => {
      allAnimations.forEach(anim => {
        expect(anim.keyframes.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
