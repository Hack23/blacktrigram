/**
 * Son Stance Animations Tests
 *
 * Comprehensive tests for ☴ Son (Wind) trigram animations including:
 * - Idle swaying animation with rhythmic motion
 * - Movement animations (flowing arc step, sweeping circle step)
 * - Mobile guard transition with micro-adjustments
 *
 * @module systems/animation/catalogs/SonStanceAnimations.test
 * @category Testing
 * @korean 손괘애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  SON_IDLE_SWAYING,
  SON_FLOWING_ARC_STEP,
  SON_SWEEPING_CIRCLE_STEP,
  SON_MOBILE_GUARD_TRANSITION,
  SON_STANCE_ANIMATIONS,
} from "./SonStanceAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// SON IDLE SWAYING ANIMATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_IDLE_SWAYING", () => {
  it("should have correct duration for swaying cycle", () => {
    expect(SON_IDLE_SWAYING.duration).toBe(2.8);
    expect(SON_IDLE_SWAYING.loop).toBe(true);
  });

  it("should have Korean and English names", () => {
    expect(SON_IDLE_SWAYING.name).toBe("son_idle_swaying");
    expect(SON_IDLE_SWAYING.koreanName).toBe("손괘 흐름 자세");
  });

  it("should demonstrate rhythmic swaying pattern", () => {
    const keyframes = SON_IDLE_SWAYING.keyframes;
    expect(keyframes.length).toBeGreaterThanOrEqual(5);

    // Check keyframe timing
    const neutralFrame = keyframes.find((f) => f.time === 0);
    const leftSwayFrame = keyframes.find((f) => f.time === 0.7);
    const centerReturnFrame = keyframes.find((f) => f.time === 1.4);
    const rightSwayFrame = keyframes.find((f) => f.time === 2.1);
    const cycleEndFrame = keyframes.find((f) => f.time === 2.8);

    expect(neutralFrame).toBeDefined();
    expect(leftSwayFrame).toBeDefined();
    expect(centerReturnFrame).toBeDefined();
    expect(rightSwayFrame).toBeDefined();
    expect(cycleEndFrame).toBeDefined();
  });

  it("should sway left and right through pelvis rotation", () => {
    const keyframes = SON_IDLE_SWAYING.keyframes;
    const leftSwayFrame = keyframes.find((f) => f.time === 0.7);
    const rightSwayFrame = keyframes.find((f) => f.time === 2.1);

    const leftPelvisRot = leftSwayFrame?.boneRotations.get(BoneName.PELVIS);
    const rightPelvisRot = rightSwayFrame?.boneRotations.get(BoneName.PELVIS);

    expect(leftPelvisRot).toBeDefined();
    expect(rightPelvisRot).toBeDefined();

    // Left sway should have negative Z rotation
    expect(leftPelvisRot!.z).toBeLessThan(0);
    // Right sway should have positive Z rotation
    expect(rightPelvisRot!.z).toBeGreaterThan(0);
  });

  it("should maintain flowing hand circular motion", () => {
    const keyframes = SON_IDLE_SWAYING.keyframes;
    
    // Check that at least some frames have wrist rotation
    const framesWithWristRotation = keyframes.filter((frame) => {
      const leftWrist = frame.boneRotations.get(BoneName.WRIST_L);
      const rightWrist = frame.boneRotations.get(BoneName.WRIST_R);

      // Wrists should have some rotation for circular motion
      if (leftWrist && rightWrist) {
        return Math.abs(leftWrist.z) + Math.abs(rightWrist.z) > 0;
      }
      return false;
    });

    // At least one frame should have wrist rotation
    expect(framesWithWristRotation.length).toBeGreaterThan(0);
  });

  it("should keep weight centered during sway", () => {
    const keyframes = SON_IDLE_SWAYING.keyframes;
    
    keyframes.forEach((frame) => {
      const pelvisPos = frame.bonePositions.get(BoneName.PELVIS);
      
      // Lateral movement should be minimal (< 5cm)
      if (pelvisPos) {
        expect(Math.abs(pelvisPos.x)).toBeLessThan(0.05);
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SON FLOWING ARC STEP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_FLOWING_ARC_STEP", () => {
  it("should have correct frame count and timing", () => {
    expect(SON_FLOWING_ARC_STEP.duration).toBeCloseTo(0.667, 3);
    expect(SON_FLOWING_ARC_STEP.loop).toBe(false);
    expect(SON_FLOWING_ARC_STEP.keyframes.length).toBeGreaterThanOrEqual(3);
  });

  it("should have Korean and English names", () => {
    expect(SON_FLOWING_ARC_STEP.name).toBe("son_flowing_arc_step");
    expect(SON_FLOWING_ARC_STEP.koreanName).toBe("바람 호 걸음");
  });

  it("should demonstrate hip-led arc movement", () => {
    const keyframes = SON_FLOWING_ARC_STEP.keyframes;
    
    // Initial hip rotation
    const startFrame = keyframes[0];
    const startPelvisRot = startFrame.boneRotations.get(BoneName.PELVIS);
    
    expect(startPelvisRot).toBeDefined();
    expect(startPelvisRot!.y).toBeLessThan(0); // Negative Y rotation for wind-up
  });

  it("should move in arc trajectory (lateral + forward)", () => {
    const startFrame = SON_FLOWING_ARC_STEP.keyframes[0];
    const endFrame =
      SON_FLOWING_ARC_STEP.keyframes[SON_FLOWING_ARC_STEP.keyframes.length - 1];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const endPos = endFrame.bonePositions.get(BoneName.PELVIS);

    expect(startPos).toBeDefined();
    expect(endPos).toBeDefined();

    if (startPos && endPos) {
      // Should move laterally (negative X for left arc)
      expect(endPos.x).toBeLessThan(startPos.x);
      // Should move forward (positive Z)
      expect(endPos.z).toBeGreaterThan(startPos.z);
    }
  });

  it("should maintain arms swinging with momentum", () => {
    const middleFrame = SON_FLOWING_ARC_STEP.keyframes.find(
      (f) => f.time > 0.2 && f.time < 0.5
    );

    if (middleFrame) {
      const leftShoulder = middleFrame.boneRotations.get(BoneName.SHOULDER_L);
      const rightShoulder = middleFrame.boneRotations.get(BoneName.SHOULDER_R);

      expect(leftShoulder).toBeDefined();
      expect(rightShoulder).toBeDefined();
      
      // Arms should show Y-axis rotation for natural swing
      expect(Math.abs(leftShoulder!.y) + Math.abs(rightShoulder!.y)).toBeGreaterThan(0.2);
    }
  });

  it("should complete weight transfer smoothly", () => {
    const keyframes = SON_FLOWING_ARC_STEP.keyframes;
    const startFrame = keyframes[0];
    const endFrame = keyframes[keyframes.length - 1];

    const startKneeR = startFrame.boneRotations.get(BoneName.KNEE_R);
    const endKneeL = endFrame.boneRotations.get(BoneName.KNEE_L);

    expect(startKneeR).toBeDefined();
    expect(endKneeL).toBeDefined();

    // Rear knee should be bent more at start
    expect(Math.abs(startKneeR!.x)).toBeGreaterThan(0.3); // > 17°
    // Lead knee should be bent more at end
    expect(Math.abs(endKneeL!.x)).toBeGreaterThan(0.3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SON SWEEPING CIRCLE STEP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_SWEEPING_CIRCLE_STEP", () => {
  it("should have correct frame count and timing", () => {
    expect(SON_SWEEPING_CIRCLE_STEP.duration).toBeCloseTo(0.889, 3);
    expect(SON_SWEEPING_CIRCLE_STEP.loop).toBe(false);
    expect(SON_SWEEPING_CIRCLE_STEP.keyframes.length).toBeGreaterThanOrEqual(3);
  });

  it("should have Korean and English names", () => {
    expect(SON_SWEEPING_CIRCLE_STEP.name).toBe("son_sweeping_circle_step");
    expect(SON_SWEEPING_CIRCLE_STEP.koreanName).toBe("회오리 원형보");
  });

  it("should demonstrate full circular rotation", () => {
    const keyframes = SON_SWEEPING_CIRCLE_STEP.keyframes;
    const endFrame = keyframes[keyframes.length - 1];
    const endPelvisRot = endFrame.boneRotations.get(BoneName.PELVIS);

    expect(endPelvisRot).toBeDefined();
    // Should have significant rotation (near full circle)
    expect(Math.abs(endPelvisRot!.y)).toBeGreaterThan(2.5); // > 143° rotation
  });

  it("should maintain guard position throughout circle", () => {
    const keyframes = SON_SWEEPING_CIRCLE_STEP.keyframes;

    keyframes.forEach((frame) => {
      const leftElbow = frame.boneRotations.get(BoneName.ELBOW_L);
      const rightElbow = frame.boneRotations.get(BoneName.ELBOW_R);

      // Guard position maintained (elbows bent around 90°)
      if (leftElbow && rightElbow) {
        expect(Math.abs(leftElbow.z)).toBeGreaterThan(1.4); // ~80° minimum
        expect(Math.abs(rightElbow.z)).toBeGreaterThan(1.4);
      }
    });
  });

  it("should track opponent with head rotation", () => {
    const keyframes = SON_SWEEPING_CIRCLE_STEP.keyframes;
    const endFrame = keyframes[keyframes.length - 1];
    const headRot = endFrame.boneRotations.get(BoneName.HEAD);

    expect(headRot).toBeDefined();
    // Head should rotate to track target
    expect(Math.abs(headRot!.y)).toBeGreaterThan(2.0); // > 115° head rotation
  });

  it("should complete circular path position", () => {
    const startFrame = SON_SWEEPING_CIRCLE_STEP.keyframes[0];
    const endFrame =
      SON_SWEEPING_CIRCLE_STEP.keyframes[
        SON_SWEEPING_CIRCLE_STEP.keyframes.length - 1
      ];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const endPos = endFrame.bonePositions.get(BoneName.PELVIS);

    expect(startPos).toBeDefined();
    expect(endPos).toBeDefined();

    if (startPos && endPos) {
      // Should have moved in circular pattern (significant lateral and Z movement)
      expect(Math.abs(endPos.x)).toBeGreaterThan(0.2);
      expect(Math.abs(endPos.z)).toBeGreaterThan(0.05);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SON MOBILE GUARD TRANSITION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_MOBILE_GUARD_TRANSITION", () => {
  it("should have correct duration for guard transition", () => {
    expect(SON_MOBILE_GUARD_TRANSITION.duration).toBeCloseTo(0.36, 3);
    expect(SON_MOBILE_GUARD_TRANSITION.loop).toBe(false);
    expect(SON_MOBILE_GUARD_TRANSITION.keyframes.length).toBeGreaterThanOrEqual(2);
  });

  it("should have Korean and English names", () => {
    expect(SON_MOBILE_GUARD_TRANSITION.name).toBe("son_mobile_guard_transition");
    expect(SON_MOBILE_GUARD_TRANSITION.koreanName).toBe("바람 방어");
  });

  it("should transition to Son flowing guard position", () => {
    const endFrame =
      SON_MOBILE_GUARD_TRANSITION.keyframes[
        SON_MOBILE_GUARD_TRANSITION.keyframes.length - 1
      ];

    const leftShoulder = endFrame.boneRotations.get(BoneName.SHOULDER_L);
    const rightShoulder = endFrame.boneRotations.get(BoneName.SHOULDER_R);
    const leftElbow = endFrame.boneRotations.get(BoneName.ELBOW_L);
    const rightElbow = endFrame.boneRotations.get(BoneName.ELBOW_R);

    expect(leftShoulder).toBeDefined();
    expect(rightShoulder).toBeDefined();
    expect(leftElbow).toBeDefined();
    expect(rightElbow).toBeDefined();

    // Should match Son guard position (10°, ±5°, ±15° shoulders, ±90° elbows)
    expect(leftShoulder!.x).toBeCloseTo(0.17, 1); // ~10°
    expect(rightShoulder!.x).toBeCloseTo(0.17, 1);
    expect(Math.abs(leftElbow!.z)).toBeCloseTo(1.57, 1); // ~90°
    expect(Math.abs(rightElbow!.z)).toBeCloseTo(1.57, 1);
  });

  it("should demonstrate subtle wrist micro-adjustments", () => {
    const endFrame =
      SON_MOBILE_GUARD_TRANSITION.keyframes[
        SON_MOBILE_GUARD_TRANSITION.keyframes.length - 1
      ];

    const leftWrist = endFrame.boneRotations.get(BoneName.WRIST_L);
    const rightWrist = endFrame.boneRotations.get(BoneName.WRIST_R);

    expect(leftWrist).toBeDefined();
    expect(rightWrist).toBeDefined();

    // Wrists should have subtle Z rotation for micro-adjustments
    expect(Math.abs(leftWrist!.z) + Math.abs(rightWrist!.z)).toBeGreaterThan(0.15);
  });

  it("should maintain stable stance", () => {
    const endFrame =
      SON_MOBILE_GUARD_TRANSITION.keyframes[
        SON_MOBILE_GUARD_TRANSITION.keyframes.length - 1
      ];

    const leftKnee = endFrame.boneRotations.get(BoneName.KNEE_L);
    const rightKnee = endFrame.boneRotations.get(BoneName.KNEE_R);

    expect(leftKnee).toBeDefined();
    expect(rightKnee).toBeDefined();

    // Knees should be bent for stable stance (~15°)
    expect(Math.abs(leftKnee!.x)).toBeCloseTo(0.26, 1);
    expect(Math.abs(rightKnee!.x)).toBeCloseTo(0.26, 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_STANCE_ANIMATIONS Map", () => {
  it("should contain all Son stance animations", () => {
    expect(SON_STANCE_ANIMATIONS.size).toBe(4);
    expect(SON_STANCE_ANIMATIONS.has("son_idle_swaying")).toBe(true);
    expect(SON_STANCE_ANIMATIONS.has("son_flowing_arc_step")).toBe(true);
    expect(SON_STANCE_ANIMATIONS.has("son_sweeping_circle_step")).toBe(true);
    expect(SON_STANCE_ANIMATIONS.has("son_mobile_guard_transition")).toBe(true);
  });

  it("should provide correct animation references", () => {
    expect(SON_STANCE_ANIMATIONS.get("son_idle_swaying")).toBe(SON_IDLE_SWAYING);
    expect(SON_STANCE_ANIMATIONS.get("son_flowing_arc_step")).toBe(SON_FLOWING_ARC_STEP);
    expect(SON_STANCE_ANIMATIONS.get("son_sweeping_circle_step")).toBe(
      SON_SWEEPING_CIRCLE_STEP
    );
    expect(SON_STANCE_ANIMATIONS.get("son_mobile_guard_transition")).toBe(
      SON_MOBILE_GUARD_TRANSITION
    );
  });

  it("should have all animations with proper structure", () => {
    SON_STANCE_ANIMATIONS.forEach((animation, key) => {
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

describe("Son Stance Animations Performance", () => {
  it("all animation structures should be accessible in <5ms", () => {
    const start = performance.now();

    expect(SON_IDLE_SWAYING).toBeDefined();
    expect(SON_IDLE_SWAYING.keyframes.length).toBeGreaterThan(0);

    expect(SON_FLOWING_ARC_STEP).toBeDefined();
    expect(SON_FLOWING_ARC_STEP.keyframes.length).toBeGreaterThan(0);

    expect(SON_SWEEPING_CIRCLE_STEP).toBeDefined();
    expect(SON_SWEEPING_CIRCLE_STEP.keyframes.length).toBeGreaterThan(0);

    expect(SON_MOBILE_GUARD_TRANSITION).toBeDefined();
    expect(SON_MOBILE_GUARD_TRANSITION.keyframes.length).toBeGreaterThan(0);

    const end = performance.now();

    // Animation structure access should be fast
    expect(end - start).toBeLessThan(5);
  });
});
