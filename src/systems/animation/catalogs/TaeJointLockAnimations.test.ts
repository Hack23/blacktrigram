/**
 * Unit tests for Tae (Lake) Joint Lock Animations
 *
 * Verifies the integrity of Tae Trigram joint manipulation animations.
 *
 * @korean 태괘관절기애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  TAE_ELBOW_HYPEREXTENSION,
  TAE_FINGER_LOCK,
  TAE_FLOWING_COUNTER,
  TAE_SMALL_CIRCLE_LOCK,
} from "./TaeJointLockAnimations";

describe("Tae (Lake) Joint Lock Animations", () => {
  describe("TAE_SMALL_CIRCLE_LOCK (소원꺾기)", () => {
    it("should have correct metadata", () => {
      expect(TAE_SMALL_CIRCLE_LOCK.name).toBe("small_circle_lock");
      expect(TAE_SMALL_CIRCLE_LOCK.koreanName).toBe("소원꺾기");
    });

    it("should have lock phases", () => {
      expect(TAE_SMALL_CIRCLE_LOCK.duration).toBeGreaterThan(0.5);
    });
  });

  describe("TAE_ELBOW_HYPEREXTENSION (팔꿈치과신전)", () => {
    it("should have correct metadata", () => {
      expect(TAE_ELBOW_HYPEREXTENSION.name).toBe("elbow_hyperextension");
      expect(TAE_ELBOW_HYPEREXTENSION.koreanName).toBe("팔꿈치과신전");
    });
  });

  describe("TAE_FINGER_LOCK (손가락제압)", () => {
    it("should have correct metadata", () => {
      expect(TAE_FINGER_LOCK.name).toBe("finger_lock");
      expect(TAE_FINGER_LOCK.koreanName).toBe("손가락제압");
    });
  });

  describe("TAE_FLOWING_COUNTER (유수관절기방어)", () => {
    it("should have correct metadata", () => {
      expect(TAE_FLOWING_COUNTER.name).toBe("flowing_lock_counter");
      expect(TAE_FLOWING_COUNTER.koreanName).toBe("유수관절기방어");
    });
  });
});
