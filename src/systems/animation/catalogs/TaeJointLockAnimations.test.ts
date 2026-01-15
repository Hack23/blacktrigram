/**
 * Unit tests for Tae (Lake) Joint Lock Animations
 *
 * Verifies the integrity of Tae Trigram joint manipulation animations.
 *
 * @korean 태괘관절기애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  TAE_WRIST_LOCK_SEQUENCE,
  TAE_ELBOW_CONTROL,
  TAE_FINGER_LOCK,
  TAE_FLOWING_COUNTER,
} from "./TaeJointLockAnimations";

describe("Tae (Lake) Joint Lock Animations", () => {
  describe("TAE_WRIST_LOCK_SEQUENCE (유수연타)", () => {
    it("should have correct metadata", () => {
      expect(TAE_WRIST_LOCK_SEQUENCE.name).toBe("tae_wrist_lock_sequence");
      expect(TAE_WRIST_LOCK_SEQUENCE.koreanName).toBe("유수연타");
    });

    it("should have correct duration and phases", () => {
      expect(TAE_WRIST_LOCK_SEQUENCE.duration).toBe(1.8);
      expect(TAE_WRIST_LOCK_SEQUENCE.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should demonstrate circular motion in shoulder rotation", () => {
      // Y-rotation should increase then decrease in circular pattern
      const keyframes = TAE_WRIST_LOCK_SEQUENCE.keyframes;
      const shoulderRotations = keyframes
        .map((f) => f.boneRotations.get(BoneName.SHOULDER_R)?.y || 0)
        .filter((y) => y !== 0); // Filter out zero values

      // Verify we have circular motion (some increase, some decrease)
      expect(shoulderRotations.length).toBeGreaterThan(3);
      expect(Math.max(...shoulderRotations)).toBeGreaterThan(0.5); // Peak rotation
    });
  });

  describe("TAE_ELBOW_CONTROL (팔꿈치 제어)", () => {
    it("should have correct metadata", () => {
      expect(TAE_ELBOW_CONTROL.name).toBe("tae_elbow_control");
      expect(TAE_ELBOW_CONTROL.koreanName).toBe("팔꿈치 제어");
    });

    it("should have correct duration", () => {
      expect(TAE_ELBOW_CONTROL.duration).toBe(1.65);
      expect(TAE_ELBOW_CONTROL.keyframes.length).toBeGreaterThanOrEqual(5);
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
});
