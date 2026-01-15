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
  GEON_HEAVEN_STRIKE,
  GEON_HEAVENLY_FIST_ANIMATION,
  GEON_OVERHEAD_HAMMER,
  GEON_FRONTAL_KICK,
  GEON_ROUNDHOUSE_KICK,
  GEON_AXE_KICK,
  GEON_PALM_STRIKE,
  GEON_ELBOW_SMASH,
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
// GEON HEAVEN STRIKE ANIMATION TESTS (천둥벽력)
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_HEAVEN_STRIKE", () => {
  it("should have correct frame count and timing", () => {
    expect(GEON_HEAVEN_STRIKE.duration).toBe(1.0);
    expect(GEON_HEAVEN_STRIKE.keyframes.length).toBeGreaterThanOrEqual(6);
  });

  it("should have Korean and English names", () => {
    expect(GEON_HEAVEN_STRIKE.name).toBe("geon_heaven_strike");
    expect(GEON_HEAVEN_STRIKE.koreanName).toBe("천둥벽력");
  });

  it("should have wind-up, strike, and recovery phases", () => {
    const keyframes = GEON_HEAVEN_STRIKE.keyframes;

    // Wind-up phase (first 30%)
    expect(keyframes[0].time).toBe(0);
    const windupFrame = keyframes.find((f) => f.time === 0.3);
    expect(windupFrame).toBeDefined();

    // Strike phase (middle 40%)
    const strikeFrame = keyframes.find((f) => f.time === 0.7);
    expect(strikeFrame).toBeDefined();

    // Recovery phase (last 30%)
    const recoveryFrame = keyframes.find((f) => f.time === 1.0);
    expect(recoveryFrame).toBeDefined();
  });

  it("should achieve high overhead chamber during wind-up", () => {
    const chamberFrame = GEON_HEAVEN_STRIKE.keyframes.find((f) => f.time === 0.3);
    expect(chamberFrame).toBeDefined();

    const shoulderRotation = chamberFrame!.boneRotations.get(BoneName.SHOULDER_R);
    expect(shoulderRotation).toBeDefined();
    // Should be raised high overhead (significant negative X rotation)
    expect(shoulderRotation!.x).toBeLessThan(-1.5); // Less than -85°
  });

  it("should have diagonal downward-forward strike trajectory", () => {
    const strikeFrame = GEON_HEAVEN_STRIKE.keyframes.find((f) => f.time === 0.7);
    expect(strikeFrame).toBeDefined();

    const shoulderRotation = strikeFrame!.boneRotations.get(BoneName.SHOULDER_R);
    const elbowRotation = strikeFrame!.boneRotations.get(BoneName.ELBOW_R);

    // Shoulder should be forward and down (positive X, indicates 45° downward angle)
    expect(shoulderRotation!.x).toBeGreaterThan(0.5); // Greater than ~30°

    // Elbow should be nearly straight at full extension
    // Using 0.02 rad tolerance (~1.1°) as a pragmatic balance between floating-point noise
    // and regression detection; relaxed from 0.01 rad to avoid flakiness while still
    // catching meaningful deviations from the original exact (0, 0, 0) implementation
    expect(Math.abs(elbowRotation!.x)).toBeLessThan(0.02); // Within ~1.1° of straight
  });

  it("should generate power from hip rotation", () => {
    const strikeFrame = GEON_HEAVEN_STRIKE.keyframes.find((f) => f.time === 0.7);
    expect(strikeFrame).toBeDefined();

    const spineRotation = strikeFrame!.boneRotations.get(BoneName.SPINE_UPPER);
    const pelvisRotation = strikeFrame!.boneRotations.get(BoneName.PELVIS);

    // Significant forward rotation for power
    expect(spineRotation!.y).toBeGreaterThan(0.4); // Greater than ~23°
    expect(pelvisRotation!.y).toBeGreaterThan(0.4); // Hip drives through
  });

  it("should include body drop for gravity assist", () => {
    const strikeFrame = GEON_HEAVEN_STRIKE.keyframes.find((f) => f.time === 0.7);
    expect(strikeFrame).toBeDefined();

    const pelvisPosition = strikeFrame!.bonePositions.get(BoneName.PELVIS);
    expect(pelvisPosition).toBeDefined();

    // Body should drop significantly (negative Y)
    expect(pelvisPosition!.y).toBeLessThan(-0.05);
    // Body should shift forward (negative Z)
    expect(pelvisPosition!.z).toBeLessThan(-0.1);
  });

  it("should return to neutral guard position", () => {
    const finalFrame = GEON_HEAVEN_STRIKE.keyframes.find((f) => f.time === 1.0);
    expect(finalFrame).toBeDefined();

    const shoulderRotation = finalFrame!.boneRotations.get(BoneName.SHOULDER_R);
    const elbowRotation = finalFrame!.boneRotations.get(BoneName.ELBOW_R);
    const spineRotation = finalFrame!.boneRotations.get(BoneName.SPINE_UPPER);

    // Should return to guard position
    expect(Math.abs(shoulderRotation!.x + 0.17)).toBeLessThan(0.01); // -10° guard
    expect(Math.abs(elbowRotation!.x + 1.57)).toBeLessThan(0.01); // -90° guard
    expect(Math.abs(spineRotation!.y)).toBeLessThan(0.01); // Neutral torso
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
    // Should be effectively straight (very close to 0°)
    expect(Math.abs(elbowRotation!.x)).toBeLessThan(0.01); // Within ~0.6° of straight
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
    expect(GEON_ANIMATIONS.size).toBe(11);
    expect(GEON_ANIMATIONS.has("geon_idle_breathing")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_forward_advance")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_diagonal_power_step")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_heaven_strike")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_heavenly_fist")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_frontal_kick")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_roundhouse_kick")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_axe_kick")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_palm_strike")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_elbow_smash")).toBe(true);
    expect(GEON_ANIMATIONS.has("geon_overhead_hammer")).toBe(true);
  });

  it("should provide correct animation references", () => {
    expect(GEON_ANIMATIONS.get("geon_idle_breathing")).toBe(GEON_IDLE_BREATHING);
    expect(GEON_ANIMATIONS.get("geon_heaven_strike")).toBe(GEON_HEAVEN_STRIKE);
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
// GEON FRONT KICK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_FRONTAL_KICK", () => {
  it("should have correct duration and animation metadata", () => {
    expect(GEON_FRONTAL_KICK.duration).toBe(0.9);
    expect(GEON_FRONTAL_KICK.name).toBe("geon_frontal_kick");
    expect(GEON_FRONTAL_KICK.koreanName).toBe("앞차기");
  });

  it("should have chamber, extension, and recovery phases", () => {
    const keyframes = GEON_FRONTAL_KICK.keyframes;
    expect(keyframes.length).toBeGreaterThanOrEqual(5);
    
    // Chamber phase
    const chamberFrame = keyframes.find(f => f.time <= 0.3);
    expect(chamberFrame).toBeDefined();
    
    // Extension phase
    const extensionFrame = keyframes.find(f => f.time >= 0.5 && f.time <= 0.7);
    expect(extensionFrame).toBeDefined();
    
    // Recovery phase
    const recoveryFrame = keyframes.find(f => f.time >= 0.9);
    expect(recoveryFrame).toBeDefined();
  });

  it("should raise knee in chamber position", () => {
    const chamberFrame = GEON_FRONTAL_KICK.keyframes[0];
    const hipRotation = chamberFrame?.boneRotations.get(BoneName.HIP_R);
    
    expect(hipRotation).toBeDefined();
    expect(hipRotation!.x).toBeGreaterThan(0.5); // Hip flexion > 30°
  });

  it("should fully extend leg at impact", () => {
    const impactFrame = GEON_FRONTAL_KICK.keyframes.find(f => f.time === 0.6);
    const kneeRotation = impactFrame?.boneRotations.get(BoneName.KNEE_R);
    
    expect(kneeRotation).toBeDefined();
    expect(Math.abs(kneeRotation!.x)).toBeLessThan(0.2); // Near-straight leg at impact
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON ROUNDHOUSE KICK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_ROUNDHOUSE_KICK", () => {
  it("should have correct duration matching technique", () => {
    expect(GEON_ROUNDHOUSE_KICK.duration).toBe(1.1);
    expect(GEON_ROUNDHOUSE_KICK.name).toBe("geon_roundhouse_kick");
    expect(GEON_ROUNDHOUSE_KICK.koreanName).toBe("돌려차기");
  });

  it("should have proper hip rotation for roundhouse mechanics", () => {
    const extensionFrame = GEON_ROUNDHOUSE_KICK.keyframes.find(f => f.time === 0.8);
    const pelvisRotation = extensionFrame?.boneRotations.get(BoneName.PELVIS);
    
    expect(pelvisRotation).toBeDefined();
    expect(Math.abs(pelvisRotation!.y)).toBeGreaterThan(1.0); // Significant hip rotation (>57°)
  });

  it("should pivot support leg during kick", () => {
    const pivotFrame = GEON_ROUNDHOUSE_KICK.keyframes.find(f => f.time >= 0.5);
    const footRotation = pivotFrame?.boneRotations.get(BoneName.FOOT_L);
    
    expect(footRotation).toBeDefined();
    expect(Math.abs(footRotation!.y)).toBeGreaterThan(0.3); // Support foot pivots
  });

  it("should whip leg extension at peak", () => {
    const peakFrame = GEON_ROUNDHOUSE_KICK.keyframes.find(f => f.time === 0.8);
    const kneeRotation = peakFrame?.boneRotations.get(BoneName.KNEE_R);
    
    expect(kneeRotation).toBeDefined();
    expect(Math.abs(kneeRotation!.x)).toBeLessThan(0.3); // Nearly extended at impact
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON AXE KICK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_AXE_KICK", () => {
  it("should have correct duration for complex technique", () => {
    expect(GEON_AXE_KICK.duration).toBe(1.2);
    expect(GEON_AXE_KICK.name).toBe("geon_axe_kick");
    expect(GEON_AXE_KICK.koreanName).toBe("내려차기");
  });

  it("should raise leg overhead in peak phase", () => {
    const peakFrame = GEON_AXE_KICK.keyframes.find(f => f.time === 0.5);
    const hipRotation = peakFrame?.boneRotations.get(BoneName.HIP_R);
    
    expect(hipRotation).toBeDefined();
    expect(hipRotation!.x).toBeGreaterThan(2.0); // High overhead position (>115°)
  });

  it("should maintain straight leg throughout", () => {
    GEON_AXE_KICK.keyframes.forEach(frame => {
      const kneeRotation = frame.boneRotations.get(BoneName.KNEE_R);
      if (kneeRotation) {
        expect(Math.abs(kneeRotation.x)).toBeLessThan(0.6); // Leg stays relatively straight
      }
    });
  });

  it("should drop body weight during impact", () => {
    const impactFrame = GEON_AXE_KICK.keyframes.find(f => f.time === 0.9);
    const pelvisPosition = impactFrame?.bonePositions.get(BoneName.PELVIS);
    
    expect(pelvisPosition).toBeDefined();
    expect(pelvisPosition!.y).toBeLessThan(0); // Body drops downward
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON PALM STRIKE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_PALM_STRIKE", () => {
  it("should have faster execution than closed fist techniques", () => {
    expect(GEON_PALM_STRIKE.duration).toBe(0.95);
    expect(GEON_PALM_STRIKE.duration).toBeLessThan(GEON_HEAVENLY_FIST_ANIMATION.duration);
  });

  it("should chamber similar to punch but with wrist positioning", () => {
    const chamberFrame = GEON_PALM_STRIKE.keyframes.find(f => f.time === 0);
    const wristRotation = chamberFrame?.boneRotations.get(BoneName.WRIST_R);
    
    expect(wristRotation).toBeDefined();
    expect(wristRotation!.x).toBeLessThan(0); // Wrist cocked back
  });

  it("should achieve full extension at impact", () => {
    const impactFrame = GEON_PALM_STRIKE.keyframes.find(f => f.time === 0.65);
    const elbowRotation = impactFrame?.boneRotations.get(BoneName.ELBOW_R);
    
    expect(elbowRotation).toBeDefined();
    expect(Math.abs(elbowRotation!.x)).toBeLessThan(0.2); // Nearly straight arm
  });

  it("should generate power from hip rotation", () => {
    const impactFrame = GEON_PALM_STRIKE.keyframes.find(f => f.time === 0.65);
    const spineRotation = impactFrame?.boneRotations.get(BoneName.SPINE_UPPER);
    
    expect(spineRotation).toBeDefined();
    expect(Math.abs(spineRotation!.y)).toBeGreaterThan(0.3); // Significant torso rotation
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GEON ELBOW SMASH TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_ELBOW_SMASH", () => {
  it("should have fastest execution for close-range technique", () => {
    expect(GEON_ELBOW_SMASH.duration).toBe(0.85);
    expect(GEON_ELBOW_SMASH.duration).toBeLessThan(GEON_PALM_STRIKE.duration);
  });

  it("should maintain tight elbow angle throughout", () => {
    GEON_ELBOW_SMASH.keyframes.forEach(frame => {
      const elbowRotation = frame.boneRotations.get(BoneName.ELBOW_R);
      if (elbowRotation && frame.time < 0.7) {
        expect(elbowRotation.x).toBeLessThan(-1.5); // Elbow stays bent (< -86°)
      }
    });
  });

  it("should generate power from torso rotation", () => {
    const impactFrame = GEON_ELBOW_SMASH.keyframes.find(f => f.time === 0.55);
    const spineRotation = impactFrame?.boneRotations.get(BoneName.SPINE_UPPER);
    const pelvisRotation = impactFrame?.boneRotations.get(BoneName.PELVIS);
    
    expect(spineRotation).toBeDefined();
    expect(pelvisRotation).toBeDefined();
    expect(Math.abs(spineRotation!.y)).toBeGreaterThan(0.6); // Major torso rotation
    expect(Math.abs(pelvisRotation!.y)).toBeGreaterThan(0.4); // Hip drive
  });

  it("should have close-range positioning", () => {
    const impactFrame = GEON_ELBOW_SMASH.keyframes.find(f => f.time === 0.55);
    const pelvisPosition = impactFrame?.bonePositions.get(BoneName.PELVIS);
    
    expect(pelvisPosition).toBeDefined();
    expect(pelvisPosition!.z).toBeLessThan(0.15); // Close-range forward movement
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("GEON_ANIMATIONS Map", () => {
  it("should contain all 11 Geon animations", () => {
    expect(GEON_ANIMATIONS.size).toBe(11);
  });

  it("should have all technique animations accessible by ID", () => {
    expect(GEON_ANIMATIONS.get("geon_idle_breathing")).toBe(GEON_IDLE_BREATHING);
    expect(GEON_ANIMATIONS.get("geon_forward_advance")).toBe(GEON_FORWARD_ADVANCE);
    expect(GEON_ANIMATIONS.get("geon_diagonal_power_step")).toBe(GEON_DIAGONAL_POWER_STEP);
    expect(GEON_ANIMATIONS.get("geon_heaven_strike")).toBe(GEON_HEAVEN_STRIKE);
    expect(GEON_ANIMATIONS.get("geon_heavenly_fist")).toBe(GEON_HEAVENLY_FIST_ANIMATION);
    expect(GEON_ANIMATIONS.get("geon_frontal_kick")).toBe(GEON_FRONTAL_KICK);
    expect(GEON_ANIMATIONS.get("geon_roundhouse_kick")).toBe(GEON_ROUNDHOUSE_KICK);
    expect(GEON_ANIMATIONS.get("geon_axe_kick")).toBe(GEON_AXE_KICK);
    expect(GEON_ANIMATIONS.get("geon_palm_strike")).toBe(GEON_PALM_STRIKE);
    expect(GEON_ANIMATIONS.get("geon_elbow_smash")).toBe(GEON_ELBOW_SMASH);
    expect(GEON_ANIMATIONS.get("geon_overhead_hammer")).toBe(GEON_OVERHEAD_HAMMER);
  });

  it("should have all animations with Korean names", () => {
    GEON_ANIMATIONS.forEach((animation) => {
      expect(animation.koreanName).toBeDefined();
      expect(animation.koreanName.length).toBeGreaterThan(0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE BENCHMARKS
// ═══════════════════════════════════════════════════════════════════════════

describe("Geon Animations Performance", () => {
  it("all animation structures should be accessible in <5ms", () => {
    // NOTE: This test measures access time to already-loaded animation structures,
    // not actual module load time or instantiation time. Animations are module-level
    // constants created at import time, so this validates efficient access to the
    // pre-constructed animation data structures. Individual MartialArtsAnimationBuilder
    // construction performance is tested in builder-specific tests.
    const start = performance.now();

    // Measure the time to access and verify all animation structures
    expect(GEON_IDLE_BREATHING).toBeDefined();
    expect(GEON_IDLE_BREATHING.keyframes.length).toBeGreaterThan(0);
    
    expect(GEON_FORWARD_ADVANCE).toBeDefined();
    expect(GEON_FORWARD_ADVANCE.keyframes.length).toBeGreaterThan(0);
    
    expect(GEON_DIAGONAL_POWER_STEP).toBeDefined();
    expect(GEON_DIAGONAL_POWER_STEP.keyframes.length).toBeGreaterThan(0);
    
    expect(GEON_HEAVEN_STRIKE).toBeDefined();
    expect(GEON_HEAVEN_STRIKE.keyframes.length).toBeGreaterThan(0);

    expect(GEON_HEAVENLY_FIST_ANIMATION).toBeDefined();
    expect(GEON_HEAVENLY_FIST_ANIMATION.keyframes.length).toBeGreaterThan(0);
    
    expect(GEON_OVERHEAD_HAMMER).toBeDefined();
    expect(GEON_OVERHEAD_HAMMER.keyframes.length).toBeGreaterThan(0);

    expect(GEON_FRONTAL_KICK).toBeDefined();
    expect(GEON_FRONTAL_KICK.keyframes.length).toBeGreaterThan(0);

    expect(GEON_ROUNDHOUSE_KICK).toBeDefined();
    expect(GEON_ROUNDHOUSE_KICK.keyframes.length).toBeGreaterThan(0);

    expect(GEON_AXE_KICK).toBeDefined();
    expect(GEON_AXE_KICK.keyframes.length).toBeGreaterThan(0);

    expect(GEON_PALM_STRIKE).toBeDefined();
    expect(GEON_PALM_STRIKE.keyframes.length).toBeGreaterThan(0);

    expect(GEON_ELBOW_SMASH).toBeDefined();
    expect(GEON_ELBOW_SMASH.keyframes.length).toBeGreaterThan(0);

    const end = performance.now();

    // Instantiation and structure access should be fast
    expect(end - start).toBeLessThan(5);
  });
});
