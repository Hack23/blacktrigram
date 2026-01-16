/**
 * Jin Stance Animations Tests
 *
 * Comprehensive tests for ☳ Jin (Thunder) trigram animations including:
 * - Idle coiled spring animation
 * - Movement animations (explosive burst, jumping advance)
 * - Biomechanical correctness and explosive force mechanics
 *
 * @module systems/animation/catalogs/JinStanceAnimations.test
 * @category Testing
 * @korean 진괘애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  JIN_IDLE_COILED,
  JIN_EXPLOSIVE_BURST,
  JIN_JUMPING_ADVANCE,
  JIN_ANIMATIONS,
} from "./JinStanceAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// JIN IDLE COILED ANIMATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_IDLE_COILED", () => {
  it("should have correct duration for coiled breathing cycle", () => {
    expect(JIN_IDLE_COILED.duration).toBe(2.5);
    expect(JIN_IDLE_COILED.loop).toBe(true);
  });

  it("should have Korean and English names", () => {
    expect(JIN_IDLE_COILED.name).toBe("jin_idle_coiled");
    expect(JIN_IDLE_COILED.koreanName).toBe("진괘 도약 자세");
  });

  it("should maintain deep knee bends throughout for coiled spring tension", () => {
    JIN_IDLE_COILED.keyframes.forEach((frame) => {
      const kneeL = frame.boneRotations.get(BoneName.KNEE_L);
      const kneeR = frame.boneRotations.get(BoneName.KNEE_R);

      // Both knees should always be bent (negative rotation) for explosive readiness
      expect(kneeL?.x).toBeLessThan(-0.5); // At least -28.6° bend
      expect(kneeR?.x).toBeLessThan(-0.5);
    });
  });

  it("should keep weight on balls of feet with raised heels", () => {
    JIN_IDLE_COILED.keyframes.forEach((frame) => {
      const ankleL = frame.boneRotations.get(BoneName.FOOT_L);
      const ankleR = frame.boneRotations.get(BoneName.FOOT_R);

      // Positive ankle rotation = heels raised
      expect(ankleL?.x).toBeGreaterThan(0.1); // At least 5.7° raised
      expect(ankleR?.x).toBeGreaterThan(0.1);
    });
  });

  it("should chamber fists at hips throughout cycle", () => {
    JIN_IDLE_COILED.keyframes.forEach((frame) => {
      const elbowL = frame.boneRotations.get(BoneName.ELBOW_L);
      const elbowR = frame.boneRotations.get(BoneName.ELBOW_R);

      // Elbows should be bent ~90° for chambered position
      expect(Math.abs(elbowL?.z ?? 0)).toBeGreaterThan(1.4); // ~80°+
      expect(Math.abs(elbowR?.z ?? 0)).toBeGreaterThan(1.4);
    });
  });

  it("should have increased tension at mid-cycle", () => {
    const neutralFrame = JIN_IDLE_COILED.keyframes.find((f) => f.time === 0);
    const tensionFrame = JIN_IDLE_COILED.keyframes.find((f) => f.time === 1.25);

    expect(neutralFrame).toBeDefined();
    expect(tensionFrame).toBeDefined();

    // Knees should bend deeper at tension peak
    const neutralKnee = neutralFrame?.boneRotations.get(BoneName.KNEE_L);
    const tensionKnee = tensionFrame?.boneRotations.get(BoneName.KNEE_L);

    expect(tensionKnee?.x).toBeLessThan(neutralKnee?.x ?? 0); // Deeper bend
  });

  it("should maintain very low pelvis height for explosive power", () => {
    JIN_IDLE_COILED.keyframes.forEach((frame) => {
      const pelvisPos = frame.bonePositions.get(BoneName.PELVIS);

      // Pelvis should be low (negative Y)
      expect(pelvisPos?.y).toBeLessThan(-0.2); // Below -0.2 units
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JIN EXPLOSIVE BURST TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_EXPLOSIVE_BURST", () => {
  it("should have correct frame count and timing", () => {
    expect(JIN_EXPLOSIVE_BURST.duration).toBe(0.6);
    expect(JIN_EXPLOSIVE_BURST.loop).toBe(false);
    expect(JIN_EXPLOSIVE_BURST.keyframes.length).toBeGreaterThanOrEqual(3);
  });

  it("should have Korean and English names", () => {
    expect(JIN_EXPLOSIVE_BURST.name).toBe("jin_explosive_burst");
    expect(JIN_EXPLOSIVE_BURST.koreanName).toBe("천둥 돌진");
  });

  it("should start from deep coiled position", () => {
    const startFrame = JIN_EXPLOSIVE_BURST.keyframes[0];
    const kneeL = startFrame.boneRotations.get(BoneName.KNEE_L);
    const kneeR = startFrame.boneRotations.get(BoneName.KNEE_R);

    // Both knees deeply bent at start
    expect(kneeL?.x).toBeLessThan(-1.0); // ~-57°+ bend
    expect(kneeR?.x).toBeLessThan(-1.0);
  });

  it("should demonstrate explosive leg extension during burst", () => {
    const startFrame = JIN_EXPLOSIVE_BURST.keyframes[0];
    const midFrame = JIN_EXPLOSIVE_BURST.keyframes.find((f) => f.time >= 0.3);

    expect(midFrame).toBeDefined();

    const startKnee = startFrame.boneRotations.get(BoneName.KNEE_L);
    const midKnee = midFrame?.boneRotations.get(BoneName.KNEE_L);

    // Knees should extend significantly (less negative)
    expect((midKnee?.x ?? 0) > (startKnee?.x ?? 0)).toBe(true);
  });

  it("should move pelvis forward significantly", () => {
    const startFrame = JIN_EXPLOSIVE_BURST.keyframes[0];
    const endFrame =
      JIN_EXPLOSIVE_BURST.keyframes[JIN_EXPLOSIVE_BURST.keyframes.length - 1];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const endPos = endFrame.bonePositions.get(BoneName.PELVIS);

    // Pelvis should move forward (positive Z)
    expect((endPos?.z ?? 0) > (startPos?.z ?? 0)).toBe(true);
    expect(endPos?.z).toBeGreaterThan(0.5); // At least 0.5 units forward
  });

  it("should rise from low to stable height", () => {
    const startFrame = JIN_EXPLOSIVE_BURST.keyframes[0];
    const endFrame =
      JIN_EXPLOSIVE_BURST.keyframes[JIN_EXPLOSIVE_BURST.keyframes.length - 1];

    const startHeight = startFrame.bonePositions.get(BoneName.PELVIS);
    const endHeight = endFrame.bonePositions.get(BoneName.PELVIS);

    // Pelvis should rise (less negative Y)
    expect((endHeight?.y ?? 0) > (startHeight?.y ?? 0)).toBe(true);
  });

  it("should drive arms forward for striking", () => {
    const endFrame =
      JIN_EXPLOSIVE_BURST.keyframes[JIN_EXPLOSIVE_BURST.keyframes.length - 1];

    const shoulderL = endFrame.boneRotations.get(BoneName.SHOULDER_L);
    const shoulderR = endFrame.boneRotations.get(BoneName.SHOULDER_R);

    // Shoulders should be in striking position (negative X = forward)
    expect(shoulderL?.x).toBeLessThan(0);
    expect(shoulderR?.x).toBeLessThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JIN JUMPING ADVANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_JUMPING_ADVANCE", () => {
  it("should have correct frame count and timing", () => {
    expect(JIN_JUMPING_ADVANCE.duration).toBe(0.9);
    expect(JIN_JUMPING_ADVANCE.loop).toBe(false);
    expect(JIN_JUMPING_ADVANCE.keyframes.length).toBeGreaterThanOrEqual(4);
  });

  it("should have Korean and English names", () => {
    expect(JIN_JUMPING_ADVANCE.name).toBe("jin_jumping_advance");
    expect(JIN_JUMPING_ADVANCE.koreanName).toBe("번개 도약");
  });

  it("should start with deep crouch for spring load", () => {
    const startFrame = JIN_JUMPING_ADVANCE.keyframes[0];
    const kneeL = startFrame.boneRotations.get(BoneName.KNEE_L);
    const kneeR = startFrame.boneRotations.get(BoneName.KNEE_R);

    // Deep crouch at start
    expect(kneeL?.x).toBeLessThan(-0.8); // ~-45°+ bend
    expect(kneeR?.x).toBeLessThan(-0.8);
  });

  it("should achieve airborne peak with both feet off ground", () => {
    const peakFrame = JIN_JUMPING_ADVANCE.keyframes.find((f) => f.time >= 0.45 && f.time <= 0.5);

    expect(peakFrame).toBeDefined();

    const pelvisHeight = peakFrame?.bonePositions.get(BoneName.PELVIS);

    // Pelvis should be elevated (positive Y)
    expect(pelvisHeight?.y).toBeGreaterThan(0.1); // Above ground level
  });

  it("should demonstrate leg extension during takeoff", () => {
    const startFrame = JIN_JUMPING_ADVANCE.keyframes[0];
    const takeoffFrame = JIN_JUMPING_ADVANCE.keyframes.find((f) => f.time >= 0.29 && f.time <= 0.3);

    expect(takeoffFrame).toBeDefined();

    const startKnee = startFrame.boneRotations.get(BoneName.KNEE_L);
    const takeoffKnee = takeoffFrame?.boneRotations.get(BoneName.KNEE_L);

    // Legs should extend (less negative bend)
    expect((takeoffKnee?.x ?? 0) > (startKnee?.x ?? 0)).toBe(true);
  });

  it("should rotate torso in air for striking position", () => {
    const peakFrame = JIN_JUMPING_ADVANCE.keyframes.find((f) => f.time >= 0.45 && f.time <= 0.5);

    expect(peakFrame).toBeDefined();

    const spine = peakFrame?.boneRotations.get(BoneName.SPINE_UPPER);
    const pelvis = peakFrame?.boneRotations.get(BoneName.PELVIS);

    // Should have rotation for striking (Y-axis rotation)
    expect(Math.abs(spine?.y ?? 0) > 0.1).toBe(true); // Some rotation
  });

  it("should land in stable striking stance", () => {
    const endFrame =
      JIN_JUMPING_ADVANCE.keyframes[JIN_JUMPING_ADVANCE.keyframes.length - 1];

    const kneeL = endFrame.boneRotations.get(BoneName.KNEE_L);
    const kneeR = endFrame.boneRotations.get(BoneName.KNEE_R);

    // Knees bent for shock absorption
    expect(kneeL?.x).toBeLessThan(-0.3); // ~-17°+ bend
    expect(kneeR?.x).toBeLessThan(-0.3);
  });

  it("should move forward significantly during jump", () => {
    const startFrame = JIN_JUMPING_ADVANCE.keyframes[0];
    const endFrame =
      JIN_JUMPING_ADVANCE.keyframes[JIN_JUMPING_ADVANCE.keyframes.length - 1];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const endPos = endFrame.bonePositions.get(BoneName.PELVIS);

    // Should move forward substantially
    expect((endPos?.z ?? 0) - (startPos?.z ?? 0)).toBeGreaterThan(0.5);
  });

  it("should swing arms for momentum and balance", () => {
    const midFrame = JIN_JUMPING_ADVANCE.keyframes.find((f) => f.time >= 0.29 && f.time <= 0.3);

    expect(midFrame).toBeDefined();

    const shoulderL = midFrame?.boneRotations.get(BoneName.SHOULDER_L);
    const shoulderR = midFrame?.boneRotations.get(BoneName.SHOULDER_R);

    // Arms should swing (negative X = forward swing)
    expect(shoulderL?.x).toBeLessThan(0);
    expect(shoulderR?.x).toBeLessThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JIN ANIMATIONS MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_ANIMATIONS", () => {
  it("should contain all Jin stance animations", () => {
    expect(JIN_ANIMATIONS.size).toBe(3);
    expect(JIN_ANIMATIONS.has("jin_idle_coiled")).toBe(true);
    expect(JIN_ANIMATIONS.has("jin_explosive_burst")).toBe(true);
    expect(JIN_ANIMATIONS.has("jin_jumping_advance")).toBe(true);
  });

  it("should map to correct animation objects", () => {
    expect(JIN_ANIMATIONS.get("jin_idle_coiled")).toBe(JIN_IDLE_COILED);
    expect(JIN_ANIMATIONS.get("jin_explosive_burst")).toBe(JIN_EXPLOSIVE_BURST);
    expect(JIN_ANIMATIONS.get("jin_jumping_advance")).toBe(JIN_JUMPING_ADVANCE);
  });

  it("should have all animations with valid durations", () => {
    JIN_ANIMATIONS.forEach((animation) => {
      expect(animation.duration).toBeGreaterThan(0);
      expect(animation.duration).toBeLessThan(5); // No animation over 5 seconds
    });
  });

  it("should have all animations with Korean names", () => {
    JIN_ANIMATIONS.forEach((animation) => {
      expect(animation.koreanName).toBeDefined();
      expect(animation.koreanName.length).toBeGreaterThan(0);
    });
  });
});
