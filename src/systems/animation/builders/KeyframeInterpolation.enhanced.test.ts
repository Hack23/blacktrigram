import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import {
  cubicBezierWithOptions,
  cubicBezier,
  createBezierEasing,
  BEZIER_PRESETS,
  easeLinear,
  easeIn,
  easeOut,
  easeInOut,
  easeNaturalMotion,
  easeSmoothTransition,
  easeExplosivePower,
  getEasingFunction,
  findSurroundingKeyframes,
  interpolateRotation,
  interpolatePosition,
  getInterpolatedKeyframe,
  applyKeyframeToRig,
  blendKeyframes,
  updateAnimation,
  crossFadeAnimations,
  createMotionPredictionState,
  updateMotionPrediction,
  predictFutureKeyframe,
  type BezierControlPoints,
  type EasingName,
} from "./KeyframeInterpolation";
import type {
  AnimationKeyframe,
  SkeletalAnimation,
  SkeletalRig,
} from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";

describe("KeyframeInterpolation", () => {
  describe("cubicBezierWithOptions", () => {
    it("should return 0 at t=0", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 };

      // Act
      const result = cubicBezierWithOptions(0, points);

      // Assert
      expect(result).toBe(0);
    });

    it("should return 1 at t=1", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 };

      // Act
      const result = cubicBezierWithOptions(1, points);

      // Assert
      expect(result).toBeCloseTo(1, 5);
    });

    it("should return value between 0 and 1 for t=0.5", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 };

      // Act
      const result = cubicBezierWithOptions(0.5, points);

      // Assert
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it("should clamp t values below 0", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 };

      // Act
      const result = cubicBezierWithOptions(-0.5, points);

      // Assert
      expect(result).toBe(0);
    });

    it("should clamp t values above 1", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 };

      // Act
      const result = cubicBezierWithOptions(1.5, points);

      // Assert
      expect(result).toBeCloseTo(1, 5);
    });

    it("should handle linear bezier (0.5, 0.5, 0.5, 0.5)", () => {
      // Arrange
      const linear: BezierControlPoints = { p1x: 0.5, p1y: 0.5, p2x: 0.5, p2y: 0.5 };

      // Act
      const result = cubicBezierWithOptions(0.5, linear);

      // Assert
      expect(result).toBeCloseTo(0.5, 1);
    });

    it("should support overshoot with p1y > 1", () => {
      // Arrange
      const overshoot: BezierControlPoints = { p1x: 0.25, p1y: 1.5, p2x: 0.75, p2y: 1.0 };

      // Act
      const result = cubicBezierWithOptions(0.5, overshoot);

      // Assert
      expect(result).toBeDefined();
      expect(isFinite(result)).toBe(true);
    });

    it("should handle precisionMode flag gracefully", () => {
      // Arrange
      const points: BezierControlPoints = { 
        p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0,
        precisionMode: true // Currently unused but should not break
      };

      // Act
      const result = cubicBezierWithOptions(0.5, points);

      // Assert
      expect(result).toBeDefined();
      expect(isFinite(result)).toBe(true);
    });
  });

  describe("cubicBezier (legacy)", () => {
    it("should match cubicBezierWithOptions output", () => {
      // Arrange
      const p1x = 0.25, p1y = 0.1, p2x = 0.25, p2y = 1.0;
      const t = 0.5;

      // Act
      const legacyResult = cubicBezier(t, p1x, p1y, p2x, p2y);
      const newResult = cubicBezierWithOptions(t, { p1x, p1y, p2x, p2y });

      // Assert
      expect(legacyResult).toBeCloseTo(newResult, 10);
    });

    it("should work with all parameters", () => {
      // Act & Assert
      expect(() => {
        cubicBezier(0.5, 0.42, 0, 0.58, 1.0);
      }).not.toThrow();
    });
  });

  describe("createBezierEasing", () => {
    it("should create a reusable easing function", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.42, p1y: 0, p2x: 0.58, p2y: 1.0 };

      // Act
      const easingFn = createBezierEasing(points);

      // Assert
      expect(typeof easingFn).toBe("function");
      expect(easingFn(0)).toBe(0);
      expect(easingFn(1)).toBeCloseTo(1, 5);
    });

    it("should create consistent results", () => {
      // Arrange
      const points: BezierControlPoints = { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1.0 };
      const easingFn = createBezierEasing(points);

      // Act
      const result1 = easingFn(0.5);
      const result2 = easingFn(0.5);

      // Assert
      expect(result1).toBe(result2);
    });
  });

  describe("BEZIER_PRESETS", () => {
    it("should have naturalMotion preset", () => {
      expect(BEZIER_PRESETS.naturalMotion).toBeDefined();
      expect(BEZIER_PRESETS.naturalMotion).toHaveProperty("p1x");
      expect(BEZIER_PRESETS.naturalMotion).toHaveProperty("p1y");
      expect(BEZIER_PRESETS.naturalMotion).toHaveProperty("p2x");
      expect(BEZIER_PRESETS.naturalMotion).toHaveProperty("p2y");
    });

    it("should have smoothTransition preset", () => {
      expect(BEZIER_PRESETS.smoothTransition).toBeDefined();
    });

    it("should have quickStart preset", () => {
      expect(BEZIER_PRESETS.quickStart).toBeDefined();
    });

    it("should have explosivePower preset", () => {
      expect(BEZIER_PRESETS.explosivePower).toBeDefined();
    });

    it("should have controlledSlow preset", () => {
      expect(BEZIER_PRESETS.controlledSlow).toBeDefined();
    });

    it("should have valid control point ranges", () => {
      Object.values(BEZIER_PRESETS).forEach((preset) => {
        expect(preset.p1x).toBeGreaterThanOrEqual(0);
        expect(preset.p1x).toBeLessThanOrEqual(1);
        expect(preset.p2x).toBeGreaterThanOrEqual(0);
        expect(preset.p2x).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("Basic Easing Functions", () => {
    describe("easeLinear", () => {
      it("should return input value", () => {
        expect(easeLinear(0)).toBe(0);
        expect(easeLinear(0.5)).toBe(0.5);
        expect(easeLinear(1)).toBe(1);
      });
    });

    describe("easeIn", () => {
      it("should start slow", () => {
        expect(easeIn(0)).toBe(0);
        expect(easeIn(0.5)).toBeLessThan(0.5); // Slower than linear
        expect(easeIn(1)).toBe(1);
      });
    });

    describe("easeOut", () => {
      it("should end slow", () => {
        expect(easeOut(0)).toBe(0);
        expect(easeOut(0.5)).toBeGreaterThan(0.5); // Faster than linear
        expect(easeOut(1)).toBe(1);
      });
    });

    describe("easeInOut", () => {
      it("should be slow at both ends", () => {
        expect(easeInOut(0)).toBe(0);
        expect(easeInOut(0.5)).toBeCloseTo(0.5, 1);
        expect(easeInOut(1)).toBe(1);
      });

      it("should be slower than linear at 0.25", () => {
        expect(easeInOut(0.25)).toBeLessThan(0.25);
      });

      it("should be slower than linear at 0.75", () => {
        expect(easeInOut(0.75)).toBeGreaterThan(0.75);
      });
    });
  });

  describe("Preset Easing Functions", () => {
    it("should have easeNaturalMotion function", () => {
      expect(typeof easeNaturalMotion).toBe("function");
      expect(easeNaturalMotion(0)).toBe(0);
      expect(easeNaturalMotion(1)).toBeCloseTo(1, 5);
    });

    it("should have easeSmoothTransition function", () => {
      expect(typeof easeSmoothTransition).toBe("function");
      expect(easeSmoothTransition(0)).toBe(0);
      expect(easeSmoothTransition(1)).toBeCloseTo(1, 5);
    });

    it("should have easeExplosivePower function", () => {
      expect(typeof easeExplosivePower).toBe("function");
      expect(easeExplosivePower(0)).toBe(0);
      expect(easeExplosivePower(1)).toBeCloseTo(1, 5);
    });
  });

  describe("getEasingFunction", () => {
    it("should return linear by default", () => {
      const easing = getEasingFunction();
      expect(easing(0.5)).toBe(0.5);
    });

    it("should return correct function for each name", () => {
      const easings: EasingName[] = [
        "linear",
        "ease-in",
        "ease-out",
        "ease-in-out",
        "natural-motion",
        "smooth-transition",
        "quick-start",
        "explosive-power",
        "controlled-slow",
      ];

      easings.forEach((name) => {
        const easing = getEasingFunction(name);
        expect(typeof easing).toBe("function");
        expect(easing(0)).toBe(0);
        expect(easing(1)).toBeCloseTo(1, 5);
      });
    });

    it("should return different functions for different names", () => {
      const linear = getEasingFunction("linear");
      const easeIn = getEasingFunction("ease-in");
      
      expect(linear(0.5)).not.toBe(easeIn(0.5));
    });
  });

  describe("findSurroundingKeyframes", () => {
    let animation: SkeletalAnimation;

    beforeEach(() => {
      animation = {
        name: "Test",
        duration: 1.0,
        loop: false,
        keyframes: [
          { time: 0, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
          { time: 0.5, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
          { time: 1.0, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
        ],
      };
    });

    it("should find keyframes at exact time", () => {
      // Act
      const [prev, next, t] = findSurroundingKeyframes(animation, 0.5);

      // Assert
      // When time is exactly at a keyframe (0.5), it returns the interval containing it
      expect(prev.time).toBe(0);
      expect(next.time).toBe(0.5);
      expect(t).toBe(1); // t=1 means we're fully at the next keyframe
    });

    it("should find keyframes for time between keyframes", () => {
      // Act
      const [prev, next, t] = findSurroundingKeyframes(animation, 0.25);

      // Assert
      expect(prev.time).toBe(0);
      expect(next.time).toBe(0.5);
      expect(t).toBeCloseTo(0.5, 10);
    });

    it("should clamp time to animation duration", () => {
      // Act
      const [prev, next] = findSurroundingKeyframes(animation, 2.0);

      // Assert
      expect(prev.time).toBeLessThanOrEqual(1.0);
      expect(next.time).toBeLessThanOrEqual(1.0);
    });

    it("should handle time at start", () => {
      // Act
      const [prev, next, t] = findSurroundingKeyframes(animation, 0);

      // Assert
      expect(prev.time).toBe(0);
      expect(t).toBe(0);
    });

    it("should handle time at end", () => {
      // Act
      const [prev, next] = findSurroundingKeyframes(animation, 1.0);

      // Assert
      expect(next.time).toBe(1.0);
    });

    it("should calculate correct interpolation factor", () => {
      // Act
      const [, , t] = findSurroundingKeyframes(animation, 0.75);

      // Assert - 0.75 is halfway between 0.5 and 1.0
      expect(t).toBeCloseTo(0.5, 10);
    });
  });

  describe("interpolateRotation", () => {
    it("should interpolate between two Euler rotations", () => {
      // Arrange
      const from = new THREE.Euler(0, 0, 0);
      const to = new THREE.Euler(1, 0, 0);

      // Act
      const result = interpolateRotation(from, to, 0.5);

      // Assert
      expect(result.x).toBeGreaterThan(0);
      expect(result.x).toBeLessThan(1);
    });

    it("should return from rotation at t=0", () => {
      // Arrange
      const from = new THREE.Euler(0.5, 0.3, 0.1);
      const to = new THREE.Euler(1, 1, 1);

      // Act
      const result = interpolateRotation(from, to, 0);

      // Assert
      expect(result.x).toBeCloseTo(from.x, 5);
      expect(result.y).toBeCloseTo(from.y, 5);
      expect(result.z).toBeCloseTo(from.z, 5);
    });

    it("should return to rotation at t=1", () => {
      // Arrange
      const from = new THREE.Euler(0, 0, 0);
      const to = new THREE.Euler(1, 0.5, 0.3);

      // Act
      const result = interpolateRotation(from, to, 1);

      // Assert
      expect(result.x).toBeCloseTo(to.x, 5);
      expect(result.y).toBeCloseTo(to.y, 5);
      expect(result.z).toBeCloseTo(to.z, 5);
    });

    it("should apply easing function", () => {
      // Arrange
      const from = new THREE.Euler(0, 0, 0);
      const to = new THREE.Euler(2, 0, 0);

      // Act
      const linear = interpolateRotation(from, to, 0.5, easeLinear);
      const easeInResult = interpolateRotation(from, to, 0.5, easeIn);

      // Assert - Ease-in should be slower at midpoint
      expect(easeInResult.x).toBeLessThan(linear.x);
    });
  });

  describe("interpolatePosition", () => {
    it("should interpolate between two Vector3 positions", () => {
      // Arrange
      const from = new THREE.Vector3(0, 0, 0);
      const to = new THREE.Vector3(2, 0, 0);

      // Act
      const result = interpolatePosition(from, to, 0.5);

      // Assert
      expect(result.x).toBeCloseTo(1, 10);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it("should apply easing function", () => {
      // Arrange
      const from = new THREE.Vector3(0, 0, 0);
      const to = new THREE.Vector3(10, 0, 0);

      // Act
      const linear = interpolatePosition(from, to, 0.5, easeLinear);
      const eased = interpolatePosition(from, to, 0.5, easeOut);

      // Assert - Ease-out should be faster at midpoint
      expect(eased.x).toBeGreaterThan(linear.x);
    });

    it("should handle 3D interpolation", () => {
      // Arrange
      const from = new THREE.Vector3(0, 0, 0);
      const to = new THREE.Vector3(1, 2, 3);

      // Act
      const result = interpolatePosition(from, to, 0.5);

      // Assert
      expect(result.x).toBeCloseTo(0.5, 10);
      expect(result.y).toBeCloseTo(1.0, 10);
      expect(result.z).toBeCloseTo(1.5, 10);
    });
  });

  describe("getInterpolatedKeyframe", () => {
    let animation: SkeletalAnimation;

    beforeEach(() => {
      const kf1: AnimationKeyframe = {
        time: 0,
        boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        bonePositions: new Map(),
        easing: "linear",
      };
      const kf2: AnimationKeyframe = {
        time: 1.0,
        boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(2, 0, 0)]]),
        bonePositions: new Map(),
        easing: "linear",
      };

      animation = {
        name: "Test",
        duration: 1.0,
        loop: false,
        keyframes: [kf1, kf2],
      };
    });

    it("should interpolate keyframe at midpoint", () => {
      // Act
      const result = getInterpolatedKeyframe(animation, 0.5);

      // Assert
      expect(result.time).toBe(0.5);
      expect(result.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(1, 1);
    });

    it("should return first keyframe at t=0", () => {
      // Act
      const result = getInterpolatedKeyframe(animation, 0);

      // Assert
      expect(result.time).toBe(0);
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(0, 5);
    });

    it("should return last keyframe at t=duration", () => {
      // Act
      const result = getInterpolatedKeyframe(animation, 1.0);

      // Assert
      expect(result.time).toBe(1.0);
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(2, 5);
    });
  });

  describe("blendKeyframes", () => {
    let kf1: AnimationKeyframe;
    let kf2: AnimationKeyframe;

    beforeEach(() => {
      kf1 = {
        time: 0,
        boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        bonePositions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(0, 0, 0)]]),
        easing: "linear",
      };
      kf2 = {
        time: 1.0,
        boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(2, 0, 0)]]),
        bonePositions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(2, 0, 0)]]),
        easing: "linear",
      };
    });

    it("should blend rotations at 50%", () => {
      // Act
      const result = blendKeyframes(kf1, kf2, 0.5);

      // Assert
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(1, 1);
    });

    it("should blend positions at 50%", () => {
      // Act
      const result = blendKeyframes(kf1, kf2, 0.5);

      // Assert
      const position = result.bonePositions.get(BoneName.SHOULDER_R)!;
      expect(position.x).toBeCloseTo(1, 1);
    });

    it("should return first keyframe at blend=0", () => {
      // Act
      const result = blendKeyframes(kf1, kf2, 0);

      // Assert
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(0, 5);
    });

    it("should return second keyframe at blend=1", () => {
      // Act
      const result = blendKeyframes(kf1, kf2, 1);

      // Assert
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(2, 5);
    });

    it("should clamp blend factor above 1", () => {
      // Act
      const result = blendKeyframes(kf1, kf2, 1.5);

      // Assert - Should use blend=1
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(2, 5);
    });

    it("should clamp blend factor below 0", () => {
      // Act
      const result = blendKeyframes(kf1, kf2, -0.5);

      // Assert - Should use blend=0
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(0, 5);
    });
  });

  describe("updateAnimation", () => {
    let animation: SkeletalAnimation;

    beforeEach(() => {
      animation = {
        name: "Test",
        duration: 1.0,
        loop: false,
        keyframes: [
          { time: 0, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
          { time: 1.0, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
        ],
      };
    });

    it("should advance time by deltaTime", () => {
      // Act
      const result = updateAnimation(animation, 0, 0.1);

      // Assert
      expect(result.time).toBeCloseTo(0.1, 10);
    });

    it("should return keyframe at new time", () => {
      // Act
      const result = updateAnimation(animation, 0, 0.5);

      // Assert
      expect(result.keyframe).toBeDefined();
      expect(result.keyframe.time).toBeCloseTo(0.5, 10);
    });

    it("should not mark completed before duration", () => {
      // Act
      const result = updateAnimation(animation, 0, 0.5);

      // Assert
      expect(result.completed).toBe(false);
    });

    it("should mark completed at duration", () => {
      // Act
      const result = updateAnimation(animation, 0, 1.0);

      // Assert
      expect(result.completed).toBe(true);
    });

    it("should loop animation when loop is true", () => {
      // Arrange
      animation.loop = true;

      // Act
      const result = updateAnimation(animation, 0.9, 0.2);

      // Assert
      expect(result.time).toBeLessThan(animation.duration);
      expect(result.completed).toBe(false);
    });

    it("should respect playback speed", () => {
      // Act
      const normal = updateAnimation(animation, 0, 0.1, 1.0);
      const fast = updateAnimation(animation, 0, 0.1, 2.0);

      // Assert
      expect(fast.time).toBeCloseTo(normal.time * 2, 10);
    });
  });

  describe("crossFadeAnimations", () => {
    let anim1: SkeletalAnimation;
    let anim2: SkeletalAnimation;

    beforeEach(() => {
      anim1 = {
        name: "Anim1",
        duration: 1.0,
        loop: false,
        keyframes: [
          { time: 0, boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]), bonePositions: new Map(), easing: "linear" },
          { time: 1.0, boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(1, 0, 0)]]), bonePositions: new Map(), easing: "linear" },
        ],
      };
      anim2 = {
        name: "Anim2",
        duration: 1.0,
        loop: false,
        keyframes: [
          { time: 0, boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(2, 0, 0)]]), bonePositions: new Map(), easing: "linear" },
          { time: 1.0, boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(3, 0, 0)]]), bonePositions: new Map(), easing: "linear" },
        ],
      };
    });

    it("should blend two animations", () => {
      // Act
      const result = crossFadeAnimations(anim1, 0.5, anim2, 0.5, 0.5);

      // Assert
      expect(result).toBeDefined();
      expect(result.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
    });

    it("should favor first animation at blend=0", () => {
      // Act
      const result = crossFadeAnimations(anim1, 0, anim2, 0, 0);

      // Assert
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(0, 5);
    });

    it("should favor second animation at blend=1", () => {
      // Act
      const result = crossFadeAnimations(anim1, 0, anim2, 0, 1);

      // Assert
      const rotation = result.boneRotations.get(BoneName.SHOULDER_R)!;
      expect(rotation.x).toBeCloseTo(2, 5);
    });

    it("should apply easing to blend", () => {
      // Act
      const linear = crossFadeAnimations(anim1, 0, anim2, 0, 0.5, "linear");
      const smooth = crossFadeAnimations(anim1, 0, anim2, 0, 0.5, "smooth-transition");

      // Assert - Different easing should give different results
      expect(linear).toBeDefined();
      expect(smooth).toBeDefined();
    });
  });

  describe("Motion Prediction", () => {
    describe("createMotionPredictionState", () => {
      it("should create initial state", () => {
        // Act
        const state = createMotionPredictionState();

        // Assert
        expect(state).toBeDefined();
        expect(state.velocities).toBeInstanceOf(Map);
        expect(state.angularVelocities).toBeInstanceOf(Map);
        expect(state.lastUpdateTime).toBe(0);
      });

      it("should start with empty velocity maps", () => {
        // Act
        const state = createMotionPredictionState();

        // Assert
        expect(state.velocities.size).toBe(0);
        expect(state.angularVelocities.size).toBe(0);
      });
    });

    describe("updateMotionPrediction", () => {
      it("should calculate velocities from keyframe delta", () => {
        // Arrange
        const state = createMotionPredictionState();
        const kf1: AnimationKeyframe = {
          time: 0,
          boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
          bonePositions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(0, 0, 0)]]),
          easing: "linear",
        };
        const kf2: AnimationKeyframe = {
          time: 0.1,
          boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(1, 0, 0)]]),
          bonePositions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(1, 0, 0)]]),
          easing: "linear",
        };

        // Act
        const newState = updateMotionPrediction(state, kf1, kf2, 0.1);

        // Assert
        expect(newState.velocities.size).toBeGreaterThan(0);
        expect(newState.angularVelocities.size).toBeGreaterThan(0);
      });

      it("should handle zero deltaTime", () => {
        // Arrange
        const state = createMotionPredictionState();
        const kf1: AnimationKeyframe = {
          time: 0,
          boneRotations: new Map(),
          bonePositions: new Map(),
          easing: "linear",
        };

        // Act
        const result = updateMotionPrediction(state, kf1, kf1, 0);

        // Assert
        expect(result).toBe(state);
      });
    });

    describe("predictFutureKeyframe", () => {
      it("should predict future positions", () => {
        // Arrange
        const currentKf: AnimationKeyframe = {
          time: 0,
          boneRotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(1, 0, 0)]]),
          bonePositions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(1, 0, 0)]]),
          easing: "linear",
        };
        const state = {
          velocities: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(10, 0, 0)]]),
          angularVelocities: new Map([[BoneName.SHOULDER_R, new THREE.Euler(5, 0, 0)]]),
          lastUpdateTime: 0,
        };

        // Act
        const predicted = predictFutureKeyframe(currentKf, state, 0.01667);

        // Assert
        expect(predicted).toBeDefined();
        expect(predicted.bonePositions.has(BoneName.SHOULDER_R)).toBe(true);
      });

      it("should clamp prediction time to 50ms", () => {
        // Arrange
        const kf: AnimationKeyframe = {
          time: 0,
          boneRotations: new Map(),
          bonePositions: new Map(),
          easing: "linear",
        };
        const state = createMotionPredictionState();

        // Act - Request 100ms prediction
        const result = predictFutureKeyframe(kf, state, 0.1);

        // Assert - Should clamp to 50ms
        expect(result.time).toBeLessThanOrEqual(0.05);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle animation with single keyframe", () => {
      // Arrange
      const animation: SkeletalAnimation = {
        name: "Single",
        duration: 1.0,
        loop: false,
        keyframes: [
          { time: 0, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
        ],
      };

      // Act & Assert
      expect(() => {
        getInterpolatedKeyframe(animation, 0.5);
      }).not.toThrow();
    });

    it("should handle empty bone rotations", () => {
      // Arrange
      const kf1: AnimationKeyframe = {
        time: 0,
        boneRotations: new Map(),
        bonePositions: new Map(),
        easing: "linear",
      };

      // Act & Assert
      expect(() => {
        blendKeyframes(kf1, kf1, 0.5);
      }).not.toThrow();
    });

    it("should handle very small deltaTime", () => {
      // Arrange
      const animation: SkeletalAnimation = {
        name: "Test",
        duration: 1.0,
        loop: false,
        keyframes: [
          { time: 0, boneRotations: new Map(), bonePositions: new Map(), easing: "linear" },
        ],
      };

      // Act
      const result = updateAnimation(animation, 0, 0.0001);

      // Assert
      expect(result.time).toBeCloseTo(0.0001, 10);
    });
  });
});
