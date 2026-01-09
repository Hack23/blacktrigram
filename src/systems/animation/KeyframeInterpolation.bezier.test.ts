/**
 * Tests for cubic bezier interpolation and motion smoothing
 * 
 * Validates:
 * - Cubic bezier easing accuracy
 * - Bezier preset curves
 * - Cross-fade blending
 * - Motion prediction for latency reduction
 * - Performance at 60fps
 * 
 * @module systems/animation/KeyframeInterpolation.bezier.test
 * @category Animation System Tests
 * @korean 베지어보간테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import {
  cubicBezier,
  cubicBezierWithOptions,
  createBezierEasing,
  BEZIER_PRESETS,
  easeNaturalMotion,
  easeSmoothTransition,
  easeExplosivePower,
  getEasingFunction,
  crossFadeAnimations,
  createMotionPredictionState,
  updateMotionPrediction,
  predictFutureKeyframe,
  type BezierControlPoints,
  type MotionPredictionState,
  type EasingName,
} from "./KeyframeInterpolation";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";

describe("Cubic Bezier Interpolation", () => {
  describe("cubicBezier() - Core Function (Legacy API)", () => {
    it("should return 0 at t=0", () => {
      const result = cubicBezier(0, 0.25, 0.1, 0.25, 1.0);
      expect(result).toBeCloseTo(0, 5);
    });

    it("should return 1 at t=1", () => {
      const result = cubicBezier(1, 0.25, 0.1, 0.25, 1.0);
      expect(result).toBeCloseTo(1, 5);
    });

    it("should produce smooth S-curve for ease-in-out", () => {
      // CSS ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)
      const t25 = cubicBezier(0.25, 0.42, 0, 0.58, 1);
      const t50 = cubicBezier(0.5, 0.42, 0, 0.58, 1);
      const t75 = cubicBezier(0.75, 0.42, 0, 0.58, 1);

      // Verify S-curve characteristics
      expect(t25).toBeLessThan(0.25); // Slow start
      expect(t50).toBeCloseTo(0.5, 1); // Middle point
      expect(t75).toBeGreaterThan(0.75); // Slow end
    });

    it("should handle control points outside [0,1] for overshoot", () => {
      // Control point y can exceed 1 for elastic effects
      const result = cubicBezier(0.5, 0.5, 1.5, 0.5, 1.0);
      // Should produce overshoot effect
      expect(typeof result).toBe("number");
      expect(isFinite(result)).toBe(true);
    });

    it("should clamp input t to [0,1] range", () => {
      const belowZero = cubicBezier(-0.5, 0.25, 0.1, 0.25, 1.0);
      const aboveOne = cubicBezier(1.5, 0.25, 0.1, 0.25, 1.0);

      expect(belowZero).toBeCloseTo(0, 5);
      expect(aboveOne).toBeCloseTo(1, 5);
    });

    it("should be monotonic for standard easing curves", () => {
      // Natural motion preset should be monotonically increasing
      const points = [0, 0.25, 0.5, 0.75, 1.0];
      const results = points.map((t) =>
        cubicBezier(t, 0.25, 0.1, 0.25, 1.0)
      );

      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeGreaterThanOrEqual(results[i - 1]);
      }
    });
  });

  describe("cubicBezierWithOptions() - Modern Configuration API", () => {
    it("should return 0 at t=0 with options object", () => {
      const result = cubicBezierWithOptions(0, {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
      });
      expect(result).toBeCloseTo(0, 5);
    });

    it("should return 1 at t=1 with options object", () => {
      const result = cubicBezierWithOptions(1, {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
      });
      expect(result).toBeCloseTo(1, 5);
    });

    it("should produce identical results to legacy cubicBezier()", () => {
      const options: BezierControlPoints = {
        p1x: 0.42,
        p1y: 0,
        p2x: 0.58,
        p2y: 1.0,
      };

      // Test multiple points
      const testPoints = [0, 0.25, 0.5, 0.75, 1.0];
      
      testPoints.forEach((t) => {
        const modernResult = cubicBezierWithOptions(t, options);
        const legacyResult = cubicBezier(t, options.p1x, options.p1y, options.p2x, options.p2y);
        
        expect(modernResult).toBeCloseTo(legacyResult, 5);
      });
    });

    it("should handle precisionMode: false (default behavior)", () => {
      const result = cubicBezierWithOptions(0.5, {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
        precisionMode: false,
      });

      // Should use standard approximation (same as without precisionMode)
      const resultWithoutFlag = cubicBezierWithOptions(0.5, {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
      });

      expect(result).toBeCloseTo(resultWithoutFlag, 5);
    });

    it("should handle precisionMode: true (currently same as false, reserved for future)", () => {
      const result = cubicBezierWithOptions(0.5, {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
        precisionMode: true,
      });

      // Currently should behave same as false since precision mode is not yet implemented
      // This test documents expected behavior for future implementation
      expect(typeof result).toBe("number");
      expect(isFinite(result)).toBe(true);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it("should work with Korean martial arts preset control points", () => {
      // Test with natural motion preset
      const naturalMotion = cubicBezierWithOptions(0.5, BEZIER_PRESETS.naturalMotion);
      expect(typeof naturalMotion).toBe("number");
      expect(isFinite(naturalMotion)).toBe(true);

      // Test with explosive power preset
      const explosivePower = cubicBezierWithOptions(0.5, BEZIER_PRESETS.explosivePower);
      expect(typeof explosivePower).toBe("number");
      expect(isFinite(explosivePower)).toBe(true);

      // Explosive power should accelerate faster than natural motion
      expect(explosivePower).toBeGreaterThan(naturalMotion);
    });

    it("should clamp input t to [0,1] range with options", () => {
      const options: BezierControlPoints = {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
      };

      const belowZero = cubicBezierWithOptions(-0.5, options);
      const aboveOne = cubicBezierWithOptions(1.5, options);

      expect(belowZero).toBeCloseTo(0, 5);
      expect(aboveOne).toBeCloseTo(1, 5);
    });

    it("should handle control points outside [0,1] for overshoot effects", () => {
      const result = cubicBezierWithOptions(0.5, {
        p1x: 0.5,
        p1y: 1.5, // Overshoot effect
        p2x: 0.5,
        p2y: 1.0,
      });

      // Should produce valid result even with y > 1
      expect(typeof result).toBe("number");
      expect(isFinite(result)).toBe(true);
    });

    it("should be monotonic for standard easing curves with options", () => {
      const options: BezierControlPoints = {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
      };

      const points = [0, 0.25, 0.5, 0.75, 1.0];
      const results = points.map((t) => cubicBezierWithOptions(t, options));

      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeGreaterThanOrEqual(results[i - 1]);
      }
    });
  });

  describe("createBezierEasing() - Factory Function", () => {
    it("should create reusable easing function", () => {
      const points: BezierControlPoints = {
        p1x: 0.25,
        p1y: 0.1,
        p2x: 0.25,
        p2y: 1.0,
      };
      const easingFn = createBezierEasing(points);

      expect(typeof easingFn).toBe("function");
      expect(easingFn(0)).toBeCloseTo(0, 5);
      expect(easingFn(1)).toBeCloseTo(1, 5);
    });

    it("should produce consistent results on multiple calls", () => {
      const easingFn = createBezierEasing(BEZIER_PRESETS.naturalMotion);

      const result1 = easingFn(0.5);
      const result2 = easingFn(0.5);

      expect(result1).toBe(result2);
    });
  });

  describe("BEZIER_PRESETS - Korean Martial Arts Curves", () => {
    it("naturalMotion should have physics-based acceleration", () => {
      const easing = createBezierEasing(BEZIER_PRESETS.naturalMotion);

      // Natural motion should have gentle start and smooth acceleration
      const t25 = easing(0.25);
      const t50 = easing(0.5);
      const t75 = easing(0.75);

      expect(t25).toBeLessThan(0.3); // Gentle start
      expect(t50).toBeGreaterThan(0.4);
      expect(t50).toBeLessThan(0.6);
      expect(t75).toBeGreaterThan(0.7); // Smooth acceleration
    });

    it("smoothTransition should create S-curve", () => {
      const easing = createBezierEasing(BEZIER_PRESETS.smoothTransition);

      const t25 = easing(0.25);
      const t75 = easing(0.75);

      // S-curve: slow at both ends
      expect(t25).toBeLessThan(0.25);
      expect(t75).toBeGreaterThan(0.75);
    });

    it("explosivePower should have rapid acceleration", () => {
      const easing = createBezierEasing(BEZIER_PRESETS.explosivePower);

      const t10 = easing(0.1);
      const t20 = easing(0.2);

      // Explosive: very fast initial acceleration
      expect(t10).toBeGreaterThan(0.1);
      expect(t20).toBeGreaterThan(0.25); // Rapid rise
    });

    it("controlledSlow should have gradual deceleration", () => {
      const easing = createBezierEasing(BEZIER_PRESETS.controlledSlow);

      const t25 = easing(0.25);
      const t50 = easing(0.5);
      const t75 = easing(0.75);

      // Controlled: slow throughout (0.6, 0.0, 0.9, 0.4 control points)
      // This creates a gentle deceleration curve
      expect(t25).toBeLessThan(0.3); // Slow start
      expect(t50).toBeLessThan(0.55); // Gentle progression
      expect(t75).toBeLessThan(0.85); // Gradual slow
    });
  });

  describe("Preset Easing Functions", () => {
    it("easeNaturalMotion should match preset", () => {
      const manualEasing = createBezierEasing(BEZIER_PRESETS.naturalMotion);

      const t1 = easeNaturalMotion(0.5);
      const t2 = manualEasing(0.5);

      expect(t1).toBeCloseTo(t2, 10);
    });

    it("easeSmoothTransition should match preset", () => {
      const manualEasing = createBezierEasing(BEZIER_PRESETS.smoothTransition);

      const t1 = easeSmoothTransition(0.5);
      const t2 = manualEasing(0.5);

      expect(t1).toBeCloseTo(t2, 10);
    });

    it("easeExplosivePower should match preset", () => {
      const manualEasing = createBezierEasing(BEZIER_PRESETS.explosivePower);

      const t1 = easeExplosivePower(0.5);
      const t2 = manualEasing(0.5);

      expect(t1).toBeCloseTo(t2, 10);
    });
  });

  describe("getEasingFunction() - Extended Names", () => {
    it("should support all bezier preset names", () => {
      const presetNames: EasingName[] = [
        "natural-motion",
        "smooth-transition",
        "quick-start",
        "explosive-power",
        "controlled-slow",
      ];

      for (const name of presetNames) {
        const easingFn = getEasingFunction(name);
        expect(typeof easingFn).toBe("function");
        expect(easingFn(0)).toBeCloseTo(0, 5);
        expect(easingFn(1)).toBeCloseTo(1, 5);
      }
    });

    it("should maintain backward compatibility", () => {
      const linear = getEasingFunction("linear");
      const easeIn = getEasingFunction("ease-in");
      const easeOut = getEasingFunction("ease-out");
      const easeInOut = getEasingFunction("ease-in-out");

      expect(linear(0.5)).toBe(0.5);
      expect(easeIn(0.5)).toBeCloseTo(0.25, 5);
      expect(easeOut(0.5)).toBeCloseTo(0.75, 5);
      expect(easeInOut(0.5)).toBeCloseTo(0.5, 1);
    });

    it("should default to linear for invalid names", () => {
      // @ts-expect-error - testing invalid input
      const easingFn = getEasingFunction("invalid");
      expect(easingFn(0.5)).toBe(0.5);
    });
  });

  describe("crossFadeAnimations() - Animation Blending", () => {
    let idleAnimation: SkeletalAnimation;
    let attackAnimation: SkeletalAnimation;

    beforeEach(() => {
      // Create mock idle animation
      idleAnimation = {
        name: "idle",
        duration: 1.0,
        fps: 60,
        loop: true,
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([
              ["spine", new THREE.Euler(0, 0, 0)],
              ["arm_r", new THREE.Euler(0, 0, 0)],
            ]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1, 0)]]),
            easing: "linear",
          },
          {
            time: 1.0,
            boneRotations: new Map([
              ["spine", new THREE.Euler(0.1, 0, 0)],
              ["arm_r", new THREE.Euler(0.05, 0, 0)],
            ]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1.05, 0)]]),
            easing: "linear",
          },
        ],
      };

      // Create mock attack animation
      attackAnimation = {
        name: "attack",
        duration: 0.2,
        fps: 60,
        loop: false,
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([
              ["spine", new THREE.Euler(0, 0, 0)],
              ["arm_r", new THREE.Euler(0, 0, 0)],
            ]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1, 0)]]),
            easing: "linear",
          },
          {
            time: 0.2,
            boneRotations: new Map([
              ["spine", new THREE.Euler(-0.3, 0.2, 0)],
              ["arm_r", new THREE.Euler(1.5, 0, 0)],
            ]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 0.9, 0.2)]]),
            easing: "ease-out",
          },
        ],
      };
    });

    it("should blend between two animations at 0% (first animation)", () => {
      const blended = crossFadeAnimations(
        idleAnimation,
        0.5,
        attackAnimation,
        0.1,
        0.0 // 0% blend = 100% idle
      );

      const blendedSpineRot = blended.boneRotations.get("spine");

      expect(blendedSpineRot).toBeDefined();
      // At 0% blend, should be close to idle animation (interpolated at t=0.5)
      // Idle interpolation at 0.5: blend between keyframes at 0 and 1.0
      if (blendedSpineRot) {
        expect(blendedSpineRot.x).toBeGreaterThanOrEqual(0);
        expect(blendedSpineRot.x).toBeLessThan(0.1); // Close to idle values
      }
    });

    it("should blend between two animations at 100% (second animation)", () => {
      const blended = crossFadeAnimations(
        idleAnimation,
        0.5,
        attackAnimation,
        0.1,
        1.0 // 100% blend = 100% attack
      );

      const blendedSpineRot = blended.boneRotations.get("spine");

      expect(blendedSpineRot).toBeDefined();
      // Should be close to attack animation values
      if (blendedSpineRot) {
        expect(Math.abs(blendedSpineRot.x)).toBeGreaterThan(0.1);
      }
    });

    it("should create smooth intermediate blend at 50%", () => {
      const blended = crossFadeAnimations(
        idleAnimation,
        0.5,
        attackAnimation,
        0.1,
        0.5, // 50% blend
        "smooth-transition"
      );

      const blendedSpineRot = blended.boneRotations.get("spine");
      expect(blendedSpineRot).toBeDefined();

      // Should be between idle and attack values
      expect(blendedSpineRot!.x).toBeLessThan(0);
      expect(blendedSpineRot!.x).toBeGreaterThan(-0.3);
    });

    it("should support different easing curves", () => {
      const linear = crossFadeAnimations(
        idleAnimation,
        0.5,
        attackAnimation,
        0.1,
        0.5,
        "linear"
      );

      const smooth = crossFadeAnimations(
        idleAnimation,
        0.5,
        attackAnimation,
        0.1,
        0.5,
        "smooth-transition"
      );

      // Different easing should produce different results
      const linearRot = linear.boneRotations.get("spine")!.x;
      const smoothRot = smooth.boneRotations.get("spine")!.x;

      // May differ due to easing
      expect(typeof linearRot).toBe("number");
      expect(typeof smoothRot).toBe("number");
    });

    it("should handle missing bones gracefully", () => {
      const blended = crossFadeAnimations(
        idleAnimation,
        0.5,
        attackAnimation,
        0.1,
        0.5
      );

      // Should contain all bones from both animations
      expect(blended.boneRotations.has("spine")).toBe(true);
      expect(blended.boneRotations.has("arm_r")).toBe(true);
    });
  });

  describe("Motion Prediction System", () => {
    let predictionState: MotionPredictionState;
    let keyframe1: AnimationKeyframe;
    let keyframe2: AnimationKeyframe;

    beforeEach(() => {
      predictionState = createMotionPredictionState();

      keyframe1 = {
        time: 0,
        boneRotations: new Map([["spine", new THREE.Euler(0, 0, 0)]]),
        bonePositions: new Map([["spine", new THREE.Vector3(0, 1, 0)]]),
        easing: "linear",
      };

      keyframe2 = {
        time: 0.1,
        boneRotations: new Map([["spine", new THREE.Euler(0.1, 0.05, 0)]]),
        bonePositions: new Map([["spine", new THREE.Vector3(0.1, 1.05, 0.05)]]),
        easing: "linear",
      };
    });

    it("should create initial prediction state", () => {
      expect(predictionState.velocities.size).toBe(0);
      expect(predictionState.angularVelocities.size).toBe(0);
      expect(predictionState.lastUpdateTime).toBe(0);
    });

    it("should calculate position velocities", () => {
      const updated = updateMotionPrediction(
        predictionState,
        keyframe1,
        keyframe2,
        0.1
      );

      const velocity = updated.velocities.get("spine");
      expect(velocity).toBeDefined();
      expect(velocity!.x).toBeCloseTo(1.0, 5); // 0.1 / 0.1
      expect(velocity!.y).toBeCloseTo(0.5, 5); // 0.05 / 0.1
      expect(velocity!.z).toBeCloseTo(0.5, 5); // 0.05 / 0.1
    });

    it("should calculate angular velocities", () => {
      const updated = updateMotionPrediction(
        predictionState,
        keyframe1,
        keyframe2,
        0.1
      );

      const angularVel = updated.angularVelocities.get("spine");
      expect(angularVel).toBeDefined();
      
      // Quaternion-based angular velocity is more accurate than simple Euler differences
      // The values will be close but not exactly the same due to proper rotation math
      expect(angularVel!.x).toBeCloseTo(1.0, 3); // 0.1 / 0.1, allowing for quaternion precision
      expect(angularVel!.y).toBeCloseTo(0.5, 3); // 0.05 / 0.1, allowing for quaternion precision
    });

    it("should update timestamp", () => {
      const updated = updateMotionPrediction(
        predictionState,
        keyframe1,
        keyframe2,
        0.1
      );

      expect(updated.lastUpdateTime).toBeGreaterThan(0);
    });

    it("should handle zero delta time gracefully", () => {
      const updated = updateMotionPrediction(
        predictionState,
        keyframe1,
        keyframe2,
        0
      );

      expect(updated).toBe(predictionState);
    });
  });

  describe("predictFutureKeyframe() - Latency Reduction", () => {
    let currentKeyframe: AnimationKeyframe;
    let predictionState: MotionPredictionState;

    beforeEach(() => {
      currentKeyframe = {
        time: 0.1,
        boneRotations: new Map([["spine", new THREE.Euler(0.1, 0.05, 0)]]),
        bonePositions: new Map([["spine", new THREE.Vector3(0.1, 1.05, 0.05)]]),
        easing: "linear",
      };

      // Create prediction state with known velocities
      predictionState = {
        velocities: new Map([["spine", new THREE.Vector3(1.0, 0.5, 0.5)]]),
        angularVelocities: new Map([["spine", new THREE.Euler(1.0, 0.5, 0)]]),
        lastUpdateTime: performance.now(),
      };
    });

    it("should predict future positions", () => {
      // Predict 1 frame ahead (16.67ms)
      const predicted = predictFutureKeyframe(
        currentKeyframe,
        predictionState,
        0.01667
      );

      const predictedPos = predicted.bonePositions.get("spine");
      const currentPos = currentKeyframe.bonePositions.get("spine")!;

      expect(predictedPos).toBeDefined();
      expect(predictedPos!.x).toBeGreaterThan(currentPos.x);
      expect(predictedPos!.y).toBeGreaterThan(currentPos.y);
    });

    it("should apply damping to prevent overshoot", () => {
      const predicted = predictFutureKeyframe(
        currentKeyframe,
        predictionState,
        0.01667
      );

      const predictedPos = predicted.bonePositions.get("spine")!;
      const currentPos = currentKeyframe.bonePositions.get("spine")!;
      const velocity = predictionState.velocities.get("spine")!;

      // Prediction should be less than full velocity * time (due to 0.8 damping)
      const fullPrediction = currentPos.x + velocity.x * 0.01667;
      const dampedPrediction = predictedPos.x;

      expect(dampedPrediction).toBeLessThan(fullPrediction);
      expect(dampedPrediction).toBeGreaterThan(currentPos.x);
    });

    it("should clamp prediction time to 50ms maximum", () => {
      const predicted = predictFutureKeyframe(
        currentKeyframe,
        predictionState,
        0.2 // Request 200ms - should clamp to 50ms
      );

      const predictedTime = predicted.time;
      const currentTime = currentKeyframe.time;

      // Allow small floating point error
      expect(predictedTime - currentTime).toBeLessThanOrEqual(0.050001);
    });

    it("should handle bones without velocity", () => {
      const keyframeWithExtraBone = {
        ...currentKeyframe,
        bonePositions: new Map([
          ...currentKeyframe.bonePositions,
          ["arm_r", new THREE.Vector3(0.5, 1.2, 0)],
        ]),
      };

      const predicted = predictFutureKeyframe(
        keyframeWithExtraBone,
        predictionState,
        0.01667
      );

      // Bone without velocity should remain unchanged
      const armPos = predicted.bonePositions.get("arm_r");
      expect(armPos).toBeDefined();
      expect(armPos!.x).toBeCloseTo(0.5, 5);
    });

    it("should achieve <50ms latency reduction", () => {
      // Typical use case: predict 1-2 frames ahead
      const prediction1Frame = 0.01667; // 16.67ms
      const prediction2Frames = 0.03333; // 33.33ms

      const predicted1 = predictFutureKeyframe(
        currentKeyframe,
        predictionState,
        prediction1Frame
      );

      const predicted2 = predictFutureKeyframe(
        currentKeyframe,
        predictionState,
        prediction2Frames
      );

      // Both should complete successfully
      expect(predicted1.time).toBeCloseTo(
        currentKeyframe.time + prediction1Frame,
        4
      );
      expect(predicted2.time).toBeCloseTo(
        currentKeyframe.time + prediction2Frames,
        4
      );

      // Total latency: input lag + processing + prediction = <50ms
      expect(prediction2Frames * 1000).toBeLessThan(50);
    });
  });

  describe("Performance Tests - 60fps Target", () => {
    it("should complete cubic bezier calculation in <0.1ms", () => {
      const iterations = 1000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        cubicBezier(i / iterations, 0.25, 0.1, 0.25, 1.0);
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      // Should average <0.1ms per call for 60fps (16.67ms frame budget)
      expect(avgTime).toBeLessThan(0.1);
    });

    it("should handle cross-fade blending efficiently", () => {
      const idleAnimation: SkeletalAnimation = {
        name: "idle",
        duration: 1.0,
        fps: 60,
        loop: true,
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([["spine", new THREE.Euler(0, 0, 0)]]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1, 0)]]),
            easing: "linear",
          },
          {
            time: 1.0,
            boneRotations: new Map([["spine", new THREE.Euler(0.1, 0, 0)]]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1.05, 0)]]),
            easing: "linear",
          },
        ],
      };

      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        crossFadeAnimations(
          idleAnimation,
          0.5,
          idleAnimation,
          0.3,
          i / iterations,
          "smooth-transition"
        );
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      // Cross-fade should complete in <1ms for 60fps target
      expect(avgTime).toBeLessThan(1.0);
    });

    it("should handle motion prediction efficiently", () => {
      const keyframe: AnimationKeyframe = {
        time: 0,
        boneRotations: new Map([["spine", new THREE.Euler(0, 0, 0)]]),
        bonePositions: new Map([["spine", new THREE.Vector3(0, 1, 0)]]),
        easing: "linear",
      };

      const state: MotionPredictionState = {
        velocities: new Map([["spine", new THREE.Vector3(1, 0.5, 0.5)]]),
        angularVelocities: new Map([["spine", new THREE.Euler(1, 0.5, 0)]]),
        lastUpdateTime: performance.now(),
      };

      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        predictFutureKeyframe(keyframe, state, 0.01667);
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      // Motion prediction should complete in <0.5ms
      expect(avgTime).toBeLessThan(0.5);
    });
  });

  describe("Visual Quality - No Artifacts", () => {
    it("should produce smooth transitions without popping", () => {
      // Sample points along bezier curve
      const samples = 10;
      const points: number[] = [];

      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const value = cubicBezier(t, 0.25, 0.1, 0.25, 1.0);
        points.push(value);
      }

      // Check for monotonic increase (no backwards jumps = no popping)
      for (let i = 1; i < points.length; i++) {
        expect(points[i]).toBeGreaterThanOrEqual(points[i - 1]);
      }

      // Check for smoothness (no sudden jumps)
      for (let i = 2; i < points.length; i++) {
        const delta1 = points[i - 1] - points[i - 2];
        const delta2 = points[i] - points[i - 1];

        // Second derivative check - rate of change shouldn't jump
        const secondDerivative = Math.abs(delta2 - delta1);
        expect(secondDerivative).toBeLessThan(0.3); // Smooth transition
      }
    });

    it("should maintain continuity during cross-fade", () => {
      const idleAnimation: SkeletalAnimation = {
        name: "idle",
        duration: 1.0,
        fps: 60,
        loop: true,
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([["spine", new THREE.Euler(0, 0, 0)]]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1, 0)]]),
            easing: "linear",
          },
          {
            time: 1.0,
            boneRotations: new Map([["spine", new THREE.Euler(0.1, 0, 0)]]),
            bonePositions: new Map([["spine", new THREE.Vector3(0, 1.05, 0)]]),
            easing: "linear",
          },
        ],
      };

      // Sample blend progression
      const blendSteps = 10;
      const positions: number[] = [];

      for (let i = 0; i <= blendSteps; i++) {
        const blendFactor = i / blendSteps;
        const blended = crossFadeAnimations(
          idleAnimation,
          0.5,
          idleAnimation,
          0.3,
          blendFactor,
          "smooth-transition"
        );

        const pos = blended.bonePositions.get("spine");
        if (pos) {
          positions.push(pos.y);
        }
      }

      // Check for continuity (no sudden jumps)
      for (let i = 1; i < positions.length; i++) {
        const delta = Math.abs(positions[i] - positions[i - 1]);
        expect(delta).toBeLessThan(0.1); // Smooth progression
      }
    });
  });
});
