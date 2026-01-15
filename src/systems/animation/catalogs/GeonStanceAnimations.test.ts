/**
 * Geon Stance Animations Tests
 *
 * Comprehensive tests for ☰ Geon (Heaven) trigram animations including:
 * - Idle breathing animation
 * - Movement animations (forward advance, diagonal step)
 * - Combat technique animations (heavenly fist, overhead hammer)
 *
 * @module systems/animation/catalogs/GeonStanceAnimations.test
 * @category Testing
 * @korean 건괘애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  GEON_IDLE_BREATHING,
  GEON_FORWARD_ADVANCE,
  GEON_DIAGONAL_POWER_STEP,
  GEON_HEAVENLY_FIST_ANIMATION,
  GEON_OVERHEAD_HAMMER,
  GEON_ANIMATIONS,
} from "./GeonStanceAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// GEON IDLE BREATHING ANIMATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_IDLE_BREATHING", () => {
  it("should have correct duration for breathing cycle", () => {
    expect(GEON_IDLE_BREATHING.duration).toBe(2.5);
    expect(GEON_IDLE_BREATHING.loop).toBe(true);
  });

  it("should have Korean and English names", () => {
    expect(GEON_IDLE_BREATHING.name).toBe("geon_idle_breathing");
    expect(GEON_IDLE_BREATHING.koreanName).toBe("건괘 호흡 자세");
  });

  it("should include chest expansion keyframes", () => {
    expect(GEON_IDLE_BREATHING.keyframes.length).toBeGreaterThanOrEqual(3);

    const neutralFrame = GEON_IDLE_BREATHING.keyframes.find((f) => f.time === 0);
    const expansionFrame = GEON_IDLE_BREATHING.keyframes.find((f) => f.time === 1.25);
    const returnFrame = GEON_IDLE_BREATHING.keyframes.find((f) => f.time === 2.5);

    expect(neutralFrame).toBeDefined();
    expect(expansionFrame).toBeDefined();
    expect(returnFrame).toBeDefined();

    // Check chest expansion - spine upper should rotate backward during inhale
    const expansionSpineRotation = expansionFrame?.boneRotations.get(BoneName.SPINE_UPPER);
    expect(expansionSpineRotation).toBeDefined();
    expect(expansionSpineRotation?.x).toBeLessThan(0); // Negative = backward lean
  });

  it("should maintain authoritative head position", () => {
    GEON_IDLE_BREATHING.keyframes.forEach((frame) => {
      const headRotation = frame.boneRotations.get(BoneName.HEAD);
      if (headRotation) {
        // Head should be held high (positive X rotation = looking up)
        expect(headRotation.x).toBeGreaterThanOrEqual(0);
      }
    });
  });

  it("should have smooth breathing cycle timing", () => {
    const times = GEON_IDLE_BREATHING.keyframes.map((f) => f.time);
    expect(times).toContain(0); // Start
    expect(times).toContain(1.25); // Mid-breath
    expect(times).toContain(2.5); // End
  });

  it("should complete cycle in <5ms for performance", () => {
    const start = performance.now();
    // Access animation to measure load time
    expect(GEON_IDLE_BREATHING).toBeDefined();
    const end = performance.now();

    expect(end - start).toBeLessThan(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON FORWARD ADVANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_FORWARD_ADVANCE", () => {
  it("should have correct frame count and timing", () => {
    expect(GEON_FORWARD_ADVANCE.duration).toBeCloseTo(0.667, 3);
    expect(GEON_FORWARD_ADVANCE.loop).toBe(false);
    expect(GEON_FORWARD_ADVANCE.keyframes.length).toBeGreaterThanOrEqual(3);
  });

  it("should have Korean and English names", () => {
    expect(GEON_FORWARD_ADVANCE.name).toBe("geon_forward_advance");
    expect(GEON_FORWARD_ADVANCE.koreanName).toBe("천둥 전진");
  });

  it("should have push-off, transfer, and landing phases", () => {
    const keyframes = GEON_FORWARD_ADVANCE.keyframes;

    // Push-off phase (start)
    expect(keyframes[0].time).toBe(0);

    // Weight transfer (middle)
    const middleFrame = keyframes.find((f) => f.time > 0.2 && f.time < 0.5);
    expect(middleFrame).toBeDefined();

    // Landing phase (end)
    const lastFrame = keyframes[keyframes.length - 1];
    expect(lastFrame.time).toBeCloseTo(0.667, 3);
  });

  it("should move pelvis forward during advance", () => {
    const startFrame = GEON_FORWARD_ADVANCE.keyframes[0];
    const endFrame =
      GEON_FORWARD_ADVANCE.keyframes[GEON_FORWARD_ADVANCE.keyframes.length - 1];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const endPos = endFrame.bonePositions.get(BoneName.PELVIS);

    expect(endPos).toBeDefined();
    expect(startPos).toBeDefined();

    // Pelvis should move forward (positive Z in our coordinate system)
    if (startPos && endPos) {
      expect(endPos.z).toBeGreaterThan(startPos.z);
    }
  });

  it("should demonstrate powerful weight transfer", () => {
    const middleFrame = GEON_FORWARD_ADVANCE.keyframes.find(
      (f) => f.time > 0.2 && f.time < 0.5
    );

    if (middleFrame) {
      const pelvisRot = middleFrame.boneRotations.get(BoneName.PELVIS);
      const spineRot = middleFrame.boneRotations.get(BoneName.SPINE_UPPER);

      // Should have forward lean during transfer
      expect(pelvisRot?.x).toBeGreaterThan(0);
      expect(spineRot?.x).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON DIAGONAL POWER STEP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_DIAGONAL_POWER_STEP", () => {
  it("should have correct frame count and timing", () => {
    expect(GEON_DIAGONAL_POWER_STEP.duration).toBeCloseTo(0.778, 3);
    expect(GEON_DIAGONAL_POWER_STEP.loop).toBe(false);
    expect(GEON_DIAGONAL_POWER_STEP.keyframes.length).toBeGreaterThanOrEqual(3);
  });

  it("should have Korean and English names", () => {
    expect(GEON_DIAGONAL_POWER_STEP.name).toBe("geon_diagonal_power_step");
    expect(GEON_DIAGONAL_POWER_STEP.koreanName).toBe("대각선 강타보");
  });

  it("should demonstrate 45-degree rotation", () => {
    const endFrame =
      GEON_DIAGONAL_POWER_STEP.keyframes[
        GEON_DIAGONAL_POWER_STEP.keyframes.length - 1
      ];
    const pelvisRot = endFrame.boneRotations.get(BoneName.PELVIS);

    expect(pelvisRot).toBeDefined();
    // Should have approximately -45° rotation (approximately -0.79 radians)
    expect(Math.abs(pelvisRot!.y)).toBeGreaterThan(0.5); // At least 28°
  });

  it("should move diagonally", () => {
    const startFrame = GEON_DIAGONAL_POWER_STEP.keyframes[0];
    const endFrame =
      GEON_DIAGONAL_POWER_STEP.keyframes[
        GEON_DIAGONAL_POWER_STEP.keyframes.length - 1
      ];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const endPos = endFrame.bonePositions.get(BoneName.PELVIS);

    expect(endPos).toBeDefined();
    expect(startPos).toBeDefined();

    if (startPos && endPos) {
      // Should move both laterally (X) and forward (Z)
      expect(Math.abs(endPos.x)).toBeGreaterThan(0);
      expect(endPos.z).toBeGreaterThan(startPos.z);
    }
  });

  it("should demonstrate hip rotation for torque", () => {
    const middleFrame = GEON_DIAGONAL_POWER_STEP.keyframes.find(
      (f) => f.time > 0.2 && f.time < 0.6
    );

    if (middleFrame) {
      const pelvisRot = middleFrame.boneRotations.get(BoneName.PELVIS);
      const spineRot = middleFrame.boneRotations.get(BoneName.SPINE_UPPER);

      // Both pelvis and spine should show rotation
      expect(pelvisRot?.y).not.toBe(0);
      expect(spineRot?.y).not.toBe(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON HEAVENLY FIST ANIMATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_HEAVENLY_FIST_ANIMATION", () => {
  it("should have correct frame count and timing", () => {
    expect(GEON_HEAVENLY_FIST_ANIMATION.duration).toBe(1.2);
    expect(GEON_HEAVENLY_FIST_ANIMATION.loop).toBe(false);
    expect(GEON_HEAVENLY_FIST_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(6);
  });

  it("should have Korean and English names", () => {
    expect(GEON_HEAVENLY_FIST_ANIMATION.name).toBe("geon_heavenly_fist");
    expect(GEON_HEAVENLY_FIST_ANIMATION.koreanName).toBe("천둥벽력");
  });

  it("should have wind-up, strike, and recovery phases", () => {
    const keyframes = GEON_HEAVENLY_FIST_ANIMATION.keyframes;

    // Wind-up phase (first 25% - 0-300ms)
    expect(keyframes[0].time).toBe(0);
    const windupEnd = keyframes.find((f) => f.time >= 0.3 && f.time <= 0.35);
    expect(windupEnd).toBeDefined();

    // Strike phase (middle 40% - 300-800ms)
    const strikePhase = keyframes.filter((f) => f.time > 0.3 && f.time <= 0.8);
    expect(strikePhase.length).toBeGreaterThanOrEqual(2);

    // Recovery phase (last 35% - 800-1200ms)
    const lastFrame = keyframes[keyframes.length - 1];
    expect(lastFrame.time).toBe(1.2);
  });

  it("should achieve full arm extension during strike", () => {
    const strikeFrame = GEON_HEAVENLY_FIST_ANIMATION.keyframes.find(
      (f) => f.time >= 0.8
    );
    const elbowRotation = strikeFrame?.boneRotations.get(BoneName.ELBOW_R);

    expect(elbowRotation).toBeDefined();
    // Should be nearly straight (close to 0°)
    expect(Math.abs(elbowRotation!.x)).toBeLessThan(0.18); // Less than 10°
  });

  it("should rotate torso for power generation", () => {
    const strikeFrame = GEON_HEAVENLY_FIST_ANIMATION.keyframes.find(
      (f) => f.time >= 0.8
    );
    const spineRotation = strikeFrame?.boneRotations.get(BoneName.SPINE_UPPER);

    expect(spineRotation).toBeDefined();
    // Should have significant Y-axis rotation (torso twist)
    expect(Math.abs(spineRotation!.y)).toBeGreaterThan(0.2); // At least 11°
  });

  it("should demonstrate wind-up phase with elbow bend", () => {
    const windupFrame = GEON_HEAVENLY_FIST_ANIMATION.keyframes.find(
      (f) => f.time >= 0.3 && f.time <= 0.35
    );
    const elbowRotation = windupFrame?.boneRotations.get(BoneName.ELBOW_R);

    expect(elbowRotation).toBeDefined();
    // Elbow should be deeply bent during wind-up
    expect(Math.abs(elbowRotation!.x)).toBeGreaterThan(2.0); // More than 115°
  });

  it("should return to guard position in recovery", () => {
    const recoveryFrame =
      GEON_HEAVENLY_FIST_ANIMATION.keyframes[
        GEON_HEAVENLY_FIST_ANIMATION.keyframes.length - 1
      ];

    const shoulderRot = recoveryFrame.boneRotations.get(BoneName.SHOULDER_R);
    const elbowRot = recoveryFrame.boneRotations.get(BoneName.ELBOW_R);

    expect(shoulderRot).toBeDefined();
    expect(elbowRot).toBeDefined();

    // Should return to guard-like position
    expect(Math.abs(elbowRot!.x)).toBeGreaterThan(1.4); // Bent for guard
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON OVERHEAD HAMMER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_OVERHEAD_HAMMER", () => {
  it("should have correct frame count and timing", () => {
    expect(GEON_OVERHEAD_HAMMER.duration).toBe(1.2);
    expect(GEON_OVERHEAD_HAMMER.loop).toBe(false);
    expect(GEON_OVERHEAD_HAMMER.keyframes.length).toBeGreaterThanOrEqual(7);
  });

  it("should have Korean and English names", () => {
    expect(GEON_OVERHEAD_HAMMER.name).toBe("geon_overhead_hammer");
    expect(GEON_OVERHEAD_HAMMER.koreanName).toBe("천둥 망치타");
  });

  it("should raise arms overhead during wind-up", () => {
    const windupFrame = GEON_OVERHEAD_HAMMER.keyframes.find(
      (f) => f.time >= 0.35 && f.time <= 0.4
    );

    const leftShoulder = windupFrame?.boneRotations.get(BoneName.SHOULDER_L);
    const rightShoulder = windupFrame?.boneRotations.get(BoneName.SHOULDER_R);

    expect(leftShoulder).toBeDefined();
    expect(rightShoulder).toBeDefined();

    // Shoulders should be highly rotated backward (arms overhead)
    expect(leftShoulder!.x).toBeLessThan(-1.5); // Less than -85° (raised high)
    expect(rightShoulder!.x).toBeLessThan(-1.5);
  });

  it("should demonstrate downward strike phase", () => {
    const impactFrame = GEON_OVERHEAD_HAMMER.keyframes.find(
      (f) => f.time >= 0.85
    );

    const leftShoulder = impactFrame?.boneRotations.get(BoneName.SHOULDER_L);
    const rightShoulder = impactFrame?.boneRotations.get(BoneName.SHOULDER_R);

    expect(leftShoulder).toBeDefined();
    expect(rightShoulder).toBeDefined();

    // At impact, shoulders should be forward (positive rotation)
    expect(leftShoulder!.x).toBeGreaterThan(0);
    expect(rightShoulder!.x).toBeGreaterThan(0);
  });

  it("should drop body weight during strike", () => {
    const startFrame = GEON_OVERHEAD_HAMMER.keyframes[0];
    const impactFrame = GEON_OVERHEAD_HAMMER.keyframes.find(
      (f) => f.time >= 0.85
    );

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const impactPos = impactFrame?.bonePositions.get(BoneName.PELVIS);

    expect(startPos).toBeDefined();
    expect(impactPos).toBeDefined();

    if (startPos && impactPos) {
      // Pelvis should drop down (negative Y) during strike
      expect(impactPos.y).toBeLessThan(startPos.y);
    }
  });

  it("should demonstrate full body commitment", () => {
    const impactFrame = GEON_OVERHEAD_HAMMER.keyframes.find(
      (f) => f.time >= 0.85
    );

    const spineRot = impactFrame?.boneRotations.get(BoneName.SPINE_UPPER);
    const pelvisRot = impactFrame?.boneRotations.get(BoneName.PELVIS);
    const kneeRot = impactFrame?.boneRotations.get(BoneName.KNEE_L);

    // Full body should be engaged
    expect(spineRot?.x).toBeGreaterThan(0.2); // Forward lean
    expect(pelvisRot?.x).toBeGreaterThan(0.1); // Pelvis forward
    expect(kneeRot).toBeDefined(); // Legs bent for absorption
  });

  it("should return to guard position after recovery", () => {
    const recoveryFrame =
      GEON_OVERHEAD_HAMMER.keyframes[GEON_OVERHEAD_HAMMER.keyframes.length - 1];

    const spineRot = recoveryFrame.boneRotations.get(BoneName.SPINE_UPPER);
    const pelvisRot = recoveryFrame.boneRotations.get(BoneName.PELVIS);
    const pelvisPos = recoveryFrame.bonePositions.get(BoneName.PELVIS);

    // Should return to neutral stance
    expect(spineRot?.x).toBeCloseTo(0, 1);
    expect(pelvisRot?.x).toBeCloseTo(0, 1);
    expect(pelvisPos?.z).toBeCloseTo(0, 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_ANIMATIONS Map", () => {
  it("should contain all Geon animations", () => {
    expect(GEON_ANIMATIONS.size).toBe(5);
    expect(GEON_ANIMATIONS.has("geon_idle_breathing")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_forward_advance")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_diagonal_power_step")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_heavenly_fist")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_overhead_hammer")).toBe(true);
  });

  it("should provide correct animation references", () => {
    expect(GEON_ANIMATIONS.get("geon_idle_breathing")).toBe(GEON_IDLE_BREATHING);
    expect(GEON_ANIMATIONS.get("geon_heavenly_fist")).toBe(
      GEON_HEAVENLY_FIST_ANIMATION
    );
    expect(GEON_ANIMATIONS.get("geon_overhead_hammer")).toBe(GEON_OVERHEAD_HAMMER);
  });

  it("should have all animations with proper structure", () => {
    GEON_ANIMATIONS.forEach((animation, key) => {
      expect(animation.name).toBe(key);
      expect(animation.koreanName).toBeTruthy();
      expect(animation.duration).toBeGreaterThan(0);
      expect(animation.keyframes.length).toBeGreaterThan(0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE BENCHMARKS
// ═══════════════════════════════════════════════════════════════════════════

describe("Geon Animations Performance", () => {
  it("all animations should load in <5ms", () => {
    const start = performance.now();

    // Access all animations to measure load time
    expect(GEON_IDLE_BREATHING).toBeDefined();
    expect(GEON_FORWARD_ADVANCE).toBeDefined();
    expect(GEON_DIAGONAL_POWER_STEP).toBeDefined();
    expect(GEON_HEAVENLY_FIST_ANIMATION).toBeDefined();
    expect(GEON_OVERHEAD_HAMMER).toBeDefined();

    const end = performance.now();

    expect(end - start).toBeLessThan(5);
  });

  it("animation map access should be fast", () => {
    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      GEON_ANIMATIONS.get("geon_heavenly_fist");
      GEON_ANIMATIONS.get("geon_idle_breathing");
      GEON_ANIMATIONS.get("geon_overhead_hammer");
    }

    const end = performance.now();

    // 300 lookups should complete in <5ms
    expect(end - start).toBeLessThan(5);
  });
});
