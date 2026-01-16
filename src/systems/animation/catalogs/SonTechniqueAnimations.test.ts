/**
 * Son Technique Animations Tests
 *
 * Comprehensive tests for ☴ Son (Wind) trigram technique animations including:
 * - Whirlwind Strike (continuous rotating strikes)
 * - Sweeping Multi-Strike (low-to-high sweeping combination)
 *
 * @module systems/animation/catalogs/SonTechniqueAnimations.test
 * @category Testing
 * @korean 손괘기술애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  SON_WHIRLWIND_STRIKE_ANIMATION,
  SON_SWEEPING_MULTI_STRIKE,
  SON_TECHNIQUE_ANIMATIONS,
} from "./SonTechniqueAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// SON WHIRLWIND STRIKE ANIMATION TESTS (선풍연격)
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_WHIRLWIND_STRIKE_ANIMATION", () => {
  it("should have correct frame count and timing", () => {
    expect(SON_WHIRLWIND_STRIKE_ANIMATION.duration).toBe(1.5);
    expect(SON_WHIRLWIND_STRIKE_ANIMATION.loop).toBe(false);
    expect(SON_WHIRLWIND_STRIKE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(7);
  });

  it("should have Korean and English names", () => {
    expect(SON_WHIRLWIND_STRIKE_ANIMATION.name).toBe("son_whirlwind_strike");
    expect(SON_WHIRLWIND_STRIKE_ANIMATION.koreanName).toBe("선풍연격");
  });

  it("should have setup, three strikes, and continuous rotation phases", () => {
    const keyframes = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes;

    // Setup phase (0-375ms)
    const setupFrame = keyframes.find((f) => f.time === 0.375);
    expect(setupFrame).toBeDefined();

    // Strike-1 phase (375-750ms)
    const strike1Frame = keyframes.find((f) => f.time === 0.75);
    expect(strike1Frame).toBeDefined();

    // Strike-2 phase (750-1125ms)
    const strike2Frame = keyframes.find((f) => f.time === 1.125);
    expect(strike2Frame).toBeDefined();

    // Strike-3 phase (1125-1500ms)
    const strike3Frame = keyframes.find((f) => f.time === 1.5);
    expect(strike3Frame).toBeDefined();
  });

  it("should demonstrate continuous rotation throughout technique", () => {
    const keyframes = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes;
    const spineRotations = keyframes
      .filter((f) => f.time > 0.375) // After wind-up
      .map((f) => f.boneRotations.get(BoneName.SPINE_UPPER)?.y || 0);

    // Rotation should continuously increase through the strikes
    for (let i = 1; i < spineRotations.length; i++) {
      expect(spineRotations[i]).toBeGreaterThanOrEqual(spineRotations[i - 1] - 0.01);
    }
  });

  it("should achieve maximum wind-up during setup", () => {
    const setupFrame = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes.find(
      (f) => f.time === 0.375
    );
    
    expect(setupFrame).toBeDefined();
    const pelvisRot = setupFrame!.boneRotations.get(BoneName.PELVIS);
    const spineRot = setupFrame!.boneRotations.get(BoneName.SPINE_UPPER);

    // Should have counter-rotation wind-up (negative Y)
    expect(pelvisRot!.y).toBeLessThan(0);
    expect(spineRot!.y).toBeLessThan(0);
    expect(Math.abs(pelvisRot!.y)).toBeGreaterThan(0.4); // > 23° wind-up
  });

  it("should alternate between left and right strikes", () => {
    const keyframes = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes;
    
    // Strike-1: Right arm should extend
    const strike1Frame = keyframes.find((f) => f.time === 0.75);
    const strike1RightShoulder = strike1Frame?.boneRotations.get(BoneName.SHOULDER_R);
    expect(strike1RightShoulder).toBeDefined();
    expect(strike1RightShoulder!.x).toBeGreaterThan(1.0); // > 57° extension

    // Strike-2: Left arm should extend
    const strike2Frame = keyframes.find((f) => f.time === 1.125);
    const strike2LeftShoulder = strike2Frame?.boneRotations.get(BoneName.SHOULDER_L);
    expect(strike2LeftShoulder).toBeDefined();
    expect(strike2LeftShoulder!.x).toBeGreaterThan(1.0); // > 57° extension

    // Strike-3: Right arm strikes again
    const strike3Frame = keyframes.find((f) => f.time === 1.5);
    const strike3RightShoulder = strike3Frame?.boneRotations.get(BoneName.SHOULDER_R);
    expect(strike3RightShoulder).toBeDefined();
    expect(strike3RightShoulder!.x).toBeGreaterThan(1.0); // > 57° extension
  });

  it("should complete near-full whirlwind rotation by final strike", () => {
    const finalFrame = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes.find(
      (f) => f.time === 1.5
    );
    
    expect(finalFrame).toBeDefined();
    const spineRot = finalFrame!.boneRotations.get(BoneName.SPINE_UPPER);
    const pelvisRot = finalFrame!.boneRotations.get(BoneName.PELVIS);

    // Should have significant rotation (approaching 90°)
    expect(spineRot!.y).toBeGreaterThan(1.3); // > 74°
    expect(pelvisRot!.y).toBeGreaterThan(1.1); // > 63°
  });

  it("should generate power from hip rotation", () => {
    const keyframes = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes;
    
    keyframes.forEach((frame) => {
      if (frame.time > 0.5) { // During striking phases
        const pelvisRot = frame.boneRotations.get(BoneName.PELVIS);
        const spineRot = frame.boneRotations.get(BoneName.SPINE_UPPER);
        
        if (pelvisRot && spineRot) {
          // Hip should drive the rotation
          expect(Math.abs(pelvisRot.y)).toBeGreaterThan(0);
        }
      }
    });
  });

  it("should maintain forward momentum throughout strikes", () => {
    const startFrame = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes[0];
    const finalFrame =
      SON_WHIRLWIND_STRIKE_ANIMATION.keyframes[
        SON_WHIRLWIND_STRIKE_ANIMATION.keyframes.length - 1
      ];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const finalPos = finalFrame.bonePositions.get(BoneName.PELVIS);

    expect(startPos).toBeDefined();
    expect(finalPos).toBeDefined();

    if (startPos && finalPos) {
      // Should move forward during strikes
      expect(finalPos.z).toBeGreaterThan(startPos.z);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SON SWEEPING MULTI-STRIKE ANIMATION TESTS (소용돌이 타격)
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_SWEEPING_MULTI_STRIKE", () => {
  it("should have correct frame count and timing", () => {
    expect(SON_SWEEPING_MULTI_STRIKE.duration).toBe(1.6);
    expect(SON_SWEEPING_MULTI_STRIKE.loop).toBe(false);
    expect(SON_SWEEPING_MULTI_STRIKE.keyframes.length).toBeGreaterThanOrEqual(8);
  });

  it("should have Korean and English names", () => {
    expect(SON_SWEEPING_MULTI_STRIKE.name).toBe("son_sweeping_multi_strike");
    expect(SON_SWEEPING_MULTI_STRIKE.koreanName).toBe("소용돌이 타격");
  });

  it("should have wind-up, sweep-1, sweep-2, and recovery phases", () => {
    const keyframes = SON_SWEEPING_MULTI_STRIKE.keyframes;

    // Wind-up phase (0-300ms)
    const windupFrame = keyframes.find((f) => f.time === 0.3);
    expect(windupFrame).toBeDefined();

    // Sweep-1 phase (300-800ms) - Low sweeping kick
    const sweep1Frame = keyframes.find((f) => f.time === 0.8);
    expect(sweep1Frame).toBeDefined();

    // Sweep-2 phase (800-1300ms) - Body-level strike
    const sweep2Frame = keyframes.find((f) => f.time === 1.3);
    expect(sweep2Frame).toBeDefined();

    // Recovery phase (1300-1600ms)
    const recoveryFrame = keyframes.find((f) => f.time === 1.6);
    expect(recoveryFrame).toBeDefined();
  });

  it("should execute low sweeping kick in sweep-1 phase", () => {
    const sweep1MidFrame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 0.6
    );
    const sweep1EndFrame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 0.8
    );

    expect(sweep1MidFrame).toBeDefined();
    expect(sweep1EndFrame).toBeDefined();

    // Left leg should be extended in sweeping motion
    const hipRot = sweep1EndFrame!.boneRotations.get(BoneName.HIP_L);
    const kneeRot = sweep1EndFrame!.boneRotations.get(BoneName.KNEE_L);

    expect(hipRot).toBeDefined();
    expect(kneeRot).toBeDefined();

    // Hip should have significant abduction for sweep (Z rotation)
    expect(Math.abs(hipRot!.z)).toBeGreaterThan(1.0); // > 57° sweep arc
    // Knee should be relatively extended
    expect(Math.abs(kneeRot!.x)).toBeLessThan(0.2); // < 11° (nearly straight)
  });

  it("should execute body-level strike in sweep-2 phase", () => {
    const sweep2EndFrame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 1.3
    );

    expect(sweep2EndFrame).toBeDefined();

    // Right arm should extend for body strike
    const rightShoulder = sweep2EndFrame!.boneRotations.get(BoneName.SHOULDER_R);
    const rightElbow = sweep2EndFrame!.boneRotations.get(BoneName.ELBOW_R);

    expect(rightShoulder).toBeDefined();
    expect(rightElbow).toBeDefined();

    // Shoulder should be extended forward
    expect(rightShoulder!.x).toBeGreaterThan(1.0); // > 57° extension
    // Elbow should be straight at impact
    expect(Math.abs(rightElbow!.x)).toBeLessThan(0.05); // Nearly straight
  });

  it("should demonstrate continuous circular motion", () => {
    const keyframes = SON_SWEEPING_MULTI_STRIKE.keyframes;
    const spineRotations = keyframes
      .filter((f) => f.time >= 0.3 && f.time <= 1.3) // During sweeps
      .map((f) => f.boneRotations.get(BoneName.SPINE_UPPER)?.y || 0);

    // Rotation should continuously increase
    for (let i = 1; i < spineRotations.length; i++) {
      expect(spineRotations[i]).toBeGreaterThanOrEqual(spineRotations[i - 1] - 0.1);
    }
  });

  it("should demonstrate weight shift from two legs to standing leg during sweep-1", () => {
    const windupFrame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 0.3
    );
    const sweep1Frame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 0.8
    );

    expect(windupFrame).toBeDefined();
    expect(sweep1Frame).toBeDefined();

    // Right knee should be bent more at wind-up (weight loading)
    const windupRightKnee = windupFrame!.boneRotations.get(BoneName.KNEE_R);
    expect(windupRightKnee).toBeDefined();
    expect(Math.abs(windupRightKnee!.x)).toBeGreaterThan(0.4); // > 23° bent

    // Right knee should support weight during sweep
    const sweepRightKnee = sweep1Frame!.boneRotations.get(BoneName.KNEE_R);
    // If knee rotation is defined, it should show support
    if (sweepRightKnee) {
      expect(Math.abs(sweepRightKnee.x)).toBeGreaterThan(0); // Supporting leg has some bend
    }
  });

  it("should return to neutral guard position after recovery", () => {
    const recoveryFrame =
      SON_SWEEPING_MULTI_STRIKE.keyframes[
        SON_SWEEPING_MULTI_STRIKE.keyframes.length - 1
      ];

    const pelvisRot = recoveryFrame.boneRotations.get(BoneName.PELVIS);
    const spineRot = recoveryFrame.boneRotations.get(BoneName.SPINE_UPPER);
    const leftElbow = recoveryFrame.boneRotations.get(BoneName.ELBOW_L);
    const rightElbow = recoveryFrame.boneRotations.get(BoneName.ELBOW_R);

    // Should return to neutral
    expect(Math.abs(pelvisRot!.y)).toBeLessThan(0.01);
    expect(Math.abs(spineRot!.y)).toBeLessThan(0.01);
    // Guard position restored
    expect(Math.abs(leftElbow!.z)).toBeCloseTo(1.57, 1); // ~90°
    expect(Math.abs(rightElbow!.z)).toBeCloseTo(1.57, 1);
  });

  it("should demonstrate body drop during low sweep", () => {
    const windupFrame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 0.3
    );
    const sweep1Frame = SON_SWEEPING_MULTI_STRIKE.keyframes.find(
      (f) => f.time === 0.8
    );

    const windupPos = windupFrame?.bonePositions.get(BoneName.PELVIS);
    const sweep1Pos = sweep1Frame?.bonePositions.get(BoneName.PELVIS);

    expect(windupPos).toBeDefined();
    expect(sweep1Pos).toBeDefined();

    if (windupPos && sweep1Pos) {
      // Body should drop lower during sweep
      expect(sweep1Pos.y).toBeLessThan(windupPos.y);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("SON_TECHNIQUE_ANIMATIONS Map", () => {
  it("should contain all Son technique animations", () => {
    expect(SON_TECHNIQUE_ANIMATIONS.size).toBe(2);
    expect(SON_TECHNIQUE_ANIMATIONS.has("son_whirlwind_strike")).toBe(true);
    expect(SON_TECHNIQUE_ANIMATIONS.has("son_sweeping_multi_strike")).toBe(true);
  });

  it("should provide correct animation references", () => {
    expect(SON_TECHNIQUE_ANIMATIONS.get("son_whirlwind_strike")).toBe(
      SON_WHIRLWIND_STRIKE_ANIMATION
    );
    expect(SON_TECHNIQUE_ANIMATIONS.get("son_sweeping_multi_strike")).toBe(
      SON_SWEEPING_MULTI_STRIKE
    );
  });

  it("should have all animations with proper structure", () => {
    SON_TECHNIQUE_ANIMATIONS.forEach((animation, key) => {
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

describe("Son Technique Animations Performance", () => {
  it("all animation structures should be accessible in <5ms", () => {
    const start = performance.now();

    expect(SON_WHIRLWIND_STRIKE_ANIMATION).toBeDefined();
    expect(SON_WHIRLWIND_STRIKE_ANIMATION.keyframes.length).toBeGreaterThan(0);

    expect(SON_SWEEPING_MULTI_STRIKE).toBeDefined();
    expect(SON_SWEEPING_MULTI_STRIKE.keyframes.length).toBeGreaterThan(0);

    const end = performance.now();

    // Animation structure access should be fast
    expect(end - start).toBeLessThan(5);
  });

  it("should maintain frame timing suitable for 60fps", () => {
    const targetFrameTime = 16.67; // ms per frame at 60fps

    // Whirlwind Strike timing
    const whirlwindKeyframes = SON_WHIRLWIND_STRIKE_ANIMATION.keyframes;
    for (let i = 1; i < whirlwindKeyframes.length; i++) {
      const frameDuration = (whirlwindKeyframes[i].time - whirlwindKeyframes[i - 1].time) * 1000;
      // Frame duration should be reasonable multiples of 16.67ms
      expect(frameDuration).toBeGreaterThan(targetFrameTime * 0.5);
      expect(frameDuration).toBeLessThan(targetFrameTime * 30); // Max ~500ms between keyframes
    }

    // Sweeping Multi-Strike timing
    const sweepingKeyframes = SON_SWEEPING_MULTI_STRIKE.keyframes;
    for (let i = 1; i < sweepingKeyframes.length; i++) {
      const frameDuration = (sweepingKeyframes[i].time - sweepingKeyframes[i - 1].time) * 1000;
      expect(frameDuration).toBeGreaterThan(targetFrameTime * 0.5);
      expect(frameDuration).toBeLessThan(targetFrameTime * 30);
    }
  });
});
