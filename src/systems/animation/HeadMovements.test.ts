/**
 * Unit tests for HeadMovements system
 * 
 * Tests head movement animation generation and keyframe interpolation.
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  createHeadRecoilAnimation,
  createHeadNodAnimation,
  createHeadShakeAnimation,
  createHeadTiltAnimation,
  createHeadTurnAnimation,
  createHeadDropAnimation,
  calculateSmoothHeadRotation,
  applyHeadMovementKeyframe,
  isHeadMovementComplete,
  getHeadMovementByType,
} from "./HeadMovements";
import {
  HeadMovementType,
} from "../../types/facial";

describe("HeadMovements", () => {
  describe("createHeadRecoilAnimation", () => {
    it("should create recoil animation with correct type", () => {
      const animation = createHeadRecoilAnimation(0.5);
      
      expect(animation.type).toBe(HeadMovementType.RECOIL);
      expect(animation.loop).toBe(false);
    });

    it("should have stronger recoil with higher hit strength", () => {
      const weakRecoil = createHeadRecoilAnimation(0.3);
      const strongRecoil = createHeadRecoilAnimation(0.9);
      
      expect(Math.abs(strongRecoil.rotations[1].x)).toBeGreaterThan(
        Math.abs(weakRecoil.rotations[1].x)
      );
    });

    it("should return to neutral position at end", () => {
      const animation = createHeadRecoilAnimation(0.7);
      const lastRotation = animation.rotations[animation.rotations.length - 1];
      
      expect(lastRotation.x).toBeCloseTo(0, 5);
      expect(lastRotation.y).toBeCloseTo(0, 5);
      expect(lastRotation.z).toBeCloseTo(0, 5);
    });

    it("should apply direction vector when provided", () => {
      const leftDirection = new THREE.Vector3(-1, 0, 0);
      const rightDirection = new THREE.Vector3(1, 0, 0);
      
      const leftRecoil = createHeadRecoilAnimation(0.5, leftDirection);
      const rightRecoil = createHeadRecoilAnimation(0.5, rightDirection);
      
      // Recoil direction should differ
      expect(leftRecoil.rotations[1].y).not.toBeCloseTo(
        rightRecoil.rotations[1].y,
        5
      );
    });
  });

  describe("createHeadNodAnimation", () => {
    it("should create nod animation with forward pitch", () => {
      const animation = createHeadNodAnimation(0.5);
      
      expect(animation.type).toBe(HeadMovementType.NOD);
      expect(animation.rotations[1].x).toBeGreaterThan(0); // Forward nod
    });

    it("should scale intensity with parameter", () => {
      const lightNod = createHeadNodAnimation(0.3);
      const heavyNod = createHeadNodAnimation(0.9);
      
      expect(heavyNod.rotations[1].x).toBeGreaterThan(lightNod.rotations[1].x);
    });

    it("should return to neutral at end", () => {
      const animation = createHeadNodAnimation();
      const lastRotation = animation.rotations[animation.rotations.length - 1];
      
      expect(lastRotation.x).toBeCloseTo(0, 5);
      expect(lastRotation.y).toBeCloseTo(0, 5);
      expect(lastRotation.z).toBeCloseTo(0, 5);
    });
  });

  describe("createHeadShakeAnimation", () => {
    it("should create shake animation with side-to-side motion", () => {
      const animation = createHeadShakeAnimation(0.7);
      
      expect(animation.type).toBe(HeadMovementType.SHAKE);
      expect(animation.loop).toBe(false);
    });

    it("should have alternating left-right yaw rotations", () => {
      const animation = createHeadShakeAnimation(0.5);
      
      // Check for alternating signs in yaw (y rotation)
      let hasPositive = false;
      let hasNegative = false;
      
      animation.rotations.forEach((rotation) => {
        if (rotation.y > 0.01) hasPositive = true;
        if (rotation.y < -0.01) hasNegative = true;
      });
      
      expect(hasPositive).toBe(true);
      expect(hasNegative).toBe(true);
    });

    it("should have decreasing amplitude over time", () => {
      const animation = createHeadShakeAnimation(0.7);
      
      // Compare early and late rotation amplitudes
      const earlyAmplitude = Math.abs(animation.rotations[1].y);
      const lateAmplitude = Math.abs(animation.rotations[5].y);
      
      expect(earlyAmplitude).toBeGreaterThan(lateAmplitude);
    });
  });

  describe("createHeadTiltAnimation", () => {
    it("should create left tilt with negative roll", () => {
      const animation = createHeadTiltAnimation("left", 0.6);
      
      expect(animation.type).toBe(HeadMovementType.TILT);
      expect(animation.rotations[1].z).toBeLessThan(0);
    });

    it("should create right tilt with positive roll", () => {
      const animation = createHeadTiltAnimation("right", 0.6);
      
      expect(animation.rotations[1].z).toBeGreaterThan(0);
    });

    it("should scale tilt with intensity", () => {
      const smallTilt = createHeadTiltAnimation("left", 0.3);
      const largeTilt = createHeadTiltAnimation("left", 0.9);
      
      expect(Math.abs(largeTilt.rotations[1].z)).toBeGreaterThan(
        Math.abs(smallTilt.rotations[1].z)
      );
    });
  });

  describe("createHeadTurnAnimation", () => {
    it("should create turn animation from current to target angle", () => {
      const currentAngle = 0;
      const targetAngle = Math.PI / 4; // 45 degrees
      
      const animation = createHeadTurnAnimation(targetAngle, currentAngle);
      
      expect(animation.type).toBe(HeadMovementType.TURN);
      expect(animation.rotations[0].y).toBeCloseTo(currentAngle, 5);
      expect(animation.rotations[2].y).toBeCloseTo(targetAngle, 3); // Reduced precision for maxTurn cap
    });

    it("should limit turn to maximum angle", () => {
      const currentAngle = 0;
      const largeTargetAngle = Math.PI * 2; // 360 degrees
      
      const animation = createHeadTurnAnimation(largeTargetAngle, currentAngle);
      
      // Should be capped at max turn (0.785 radians ~= 45 degrees)
      expect(Math.abs(animation.rotations[2].y)).toBeLessThanOrEqual(0.8);
    });

    it("should normalize angle differences correctly", () => {
      const currentAngle = -Math.PI * 0.9;
      const targetAngle = Math.PI * 0.9;
      
      const animation = createHeadTurnAnimation(targetAngle, currentAngle);
      
      // Should take shortest path
      const totalTurn = Math.abs(
        animation.rotations[2].y - animation.rotations[0].y
      );
      expect(totalTurn).toBeLessThanOrEqual(Math.PI);
    });
  });

  describe("createHeadDropAnimation", () => {
    it("should create drop animation with forward pitch", () => {
      const animation = createHeadDropAnimation();
      
      expect(animation.type).toBe(HeadMovementType.DROP);
      expect(animation.loop).toBe(false);
    });

    it("should progressively drop head forward", () => {
      const animation = createHeadDropAnimation();
      
      // Each frame should have more forward pitch than previous
      for (let i = 1; i < animation.rotations.length; i++) {
        expect(animation.rotations[i].x).toBeGreaterThanOrEqual(
          animation.rotations[i - 1].x
        );
      }
    });

    it("should end at maximum drop angle", () => {
      const animation = createHeadDropAnimation();
      const lastRotation = animation.rotations[animation.rotations.length - 1];
      
      expect(lastRotation.x).toBeGreaterThan(0.6); // ~40 degrees
    });
  });

  describe("calculateSmoothHeadRotation", () => {
    it("should smoothly interpolate toward target", () => {
      const currentRotation = new THREE.Euler(0, 0, 0);
      const targetPosition = new THREE.Vector3(5, 2, 0);
      const headPosition = new THREE.Vector3(0, 2, 0);
      
      const newRotation = calculateSmoothHeadRotation(
        currentRotation,
        targetPosition,
        headPosition,
        0.2
      );
      
      // Should move toward target but not reach it immediately
      expect(Math.abs(newRotation.y)).toBeGreaterThan(0);
      expect(Math.abs(newRotation.y)).toBeLessThan(Math.PI / 4);
    });

    it("should limit pitch to realistic human range", () => {
      const currentRotation = new THREE.Euler(0, 0, 0);
      const extremeUpTarget = new THREE.Vector3(0, 10, 0);
      const headPosition = new THREE.Vector3(0, 2, 0);
      
      const newRotation = calculateSmoothHeadRotation(
        currentRotation,
        extremeUpTarget,
        headPosition,
        1.0
      );
      
      // Should be capped at ~40 degrees
      expect(Math.abs(newRotation.x)).toBeLessThanOrEqual(0.8);
    });

    it("should limit yaw to realistic human range", () => {
      const currentRotation = new THREE.Euler(0, 0, 0);
      const extremeSideTarget = new THREE.Vector3(10, 2, 0);
      const headPosition = new THREE.Vector3(0, 2, 0);
      
      const newRotation = calculateSmoothHeadRotation(
        currentRotation,
        extremeSideTarget,
        headPosition,
        1.0
      );
      
      // Should be capped at ~80 degrees
      expect(Math.abs(newRotation.y)).toBeLessThanOrEqual(1.5);
    });

    it("should use smoothing factor for gradual movement", () => {
      const currentRotation = new THREE.Euler(0, 0, 0);
      const targetPosition = new THREE.Vector3(5, 2, 0);
      const headPosition = new THREE.Vector3(0, 2, 0);
      
      const slowSmoothing = calculateSmoothHeadRotation(
        currentRotation,
        targetPosition,
        headPosition,
        0.05
      );
      
      const fastSmoothing = calculateSmoothHeadRotation(
        currentRotation,
        targetPosition,
        headPosition,
        0.5
      );
      
      expect(Math.abs(fastSmoothing.y)).toBeGreaterThan(
        Math.abs(slowSmoothing.y)
      );
    });
  });

  describe("applyHeadMovementKeyframe", () => {
    it("should return first keyframe at time 0", () => {
      const animation = createHeadNodAnimation();
      const rotation = applyHeadMovementKeyframe(animation, 0);
      
      expect(rotation.x).toBeCloseTo(animation.rotations[0].x, 5);
      expect(rotation.y).toBeCloseTo(animation.rotations[0].y, 5);
      expect(rotation.z).toBeCloseTo(animation.rotations[0].z, 5);
    });

    it("should return last keyframe when time exceeds duration", () => {
      const animation = createHeadNodAnimation();
      const rotation = applyHeadMovementKeyframe(
        animation,
        animation.totalDuration + 1
      );
      
      const lastRotation = animation.rotations[animation.rotations.length - 1];
      expect(rotation.x).toBeCloseTo(lastRotation.x, 5);
      expect(rotation.y).toBeCloseTo(lastRotation.y, 5);
      expect(rotation.z).toBeCloseTo(lastRotation.z, 5);
    });

    it("should interpolate between keyframes", () => {
      const animation = createHeadNodAnimation();
      const halfFrameTime = animation.frameDuration / 2;
      
      const rotation = applyHeadMovementKeyframe(animation, halfFrameTime);
      
      // Should be between first and second keyframe
      const firstFrame = animation.rotations[0];
      const secondFrame = animation.rotations[1];
      
      expect(rotation.x).toBeGreaterThan(firstFrame.x);
      expect(rotation.x).toBeLessThan(secondFrame.x);
    });
  });

  describe("isHeadMovementComplete", () => {
    it("should return false when animation not complete", () => {
      const animation = createHeadNodAnimation();
      const complete = isHeadMovementComplete(animation, 0.1);
      
      expect(complete).toBe(false);
    });

    it("should return true when time exceeds duration", () => {
      const animation = createHeadNodAnimation();
      const complete = isHeadMovementComplete(
        animation,
        animation.totalDuration + 0.1
      );
      
      expect(complete).toBe(true);
    });

    it("should return true exactly at duration", () => {
      const animation = createHeadNodAnimation();
      const complete = isHeadMovementComplete(
        animation,
        animation.totalDuration
      );
      
      expect(complete).toBe(true);
    });
  });

  describe("getHeadMovementByType", () => {
    it("should return recoil animation for RECOIL type", () => {
      const animation = getHeadMovementByType(HeadMovementType.RECOIL, 0.5);
      
      expect(animation.type).toBe(HeadMovementType.RECOIL);
    });

    it("should return nod animation for NOD type", () => {
      const animation = getHeadMovementByType(HeadMovementType.NOD, 0.6);
      
      expect(animation.type).toBe(HeadMovementType.NOD);
    });

    it("should return shake animation for SHAKE type", () => {
      const animation = getHeadMovementByType(HeadMovementType.SHAKE, 0.7);
      
      expect(animation.type).toBe(HeadMovementType.SHAKE);
    });

    it("should return tilt animation for TILT type", () => {
      const animation = getHeadMovementByType(HeadMovementType.TILT, 0.5);
      
      expect(animation.type).toBe(HeadMovementType.TILT);
    });

    it("should return drop animation for DROP type", () => {
      const animation = getHeadMovementByType(HeadMovementType.DROP);
      
      expect(animation.type).toBe(HeadMovementType.DROP);
    });

    it("should return turn animation for TURN type", () => {
      const animation = getHeadMovementByType(HeadMovementType.TURN, 0.5);
      
      expect(animation.type).toBe(HeadMovementType.TURN);
    });

    it("should apply intensity parameter", () => {
      const lowIntensity = getHeadMovementByType(HeadMovementType.NOD, 0.3);
      const highIntensity = getHeadMovementByType(HeadMovementType.NOD, 0.9);
      
      expect(Math.abs(highIntensity.rotations[1].x)).toBeGreaterThan(
        Math.abs(lowIntensity.rotations[1].x)
      );
    });
  });
});
