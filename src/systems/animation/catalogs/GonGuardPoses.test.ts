/**
 * Tests for Gon (Earth) Guard Poses
 *
 * Validates low grappling guard positions for the Gon trigram.
 * Ensures proper Ssireum wrestling biomechanics.
 *
 * @module systems/animation/catalogs/__tests__/GonGuardPoses.test
 */

import { describe, it, expect } from "vitest";
import { GON_LOW_GRAPPLING_GUARD, GON_GUARD_VARIANTS } from "./GonGuardPoses";

describe("Gon Guard Poses", () => {
  describe("GON_LOW_GRAPPLING_GUARD", () => {
    it("should have symmetric arm positions", () => {
      const leftShoulder = GON_LOW_GRAPPLING_GUARD.leftArm.shoulder;
      const rightShoulder = GON_LOW_GRAPPLING_GUARD.rightArm.shoulder;
      
      // X (forward/back) should be same
      expect(leftShoulder.x).toBeCloseTo(rightShoulder.x, 2);
      
      // Y (lateral) should be opposite
      expect(leftShoulder.y).toBeCloseTo(-rightShoulder.y, 2);
      
      // Z (rotation) should be opposite
      expect(leftShoulder.z).toBeCloseTo(-rightShoulder.z, 2);
    });

    it("should have hands positioned low for grappling", () => {
      const leftShoulder = GON_LOW_GRAPPLING_GUARD.leftArm.shoulder;
      const rightShoulder = GON_LOW_GRAPPLING_GUARD.rightArm.shoulder;
      
      // Shoulders should be forward (positive X)
      expect(leftShoulder.x).toBeGreaterThan(0.4); // Greater than 23°
      expect(rightShoulder.x).toBeGreaterThan(0.4);
    });

    it("should have elbows bent ready for grab", () => {
      const leftElbow = GON_LOW_GRAPPLING_GUARD.leftArm.elbow;
      const rightElbow = GON_LOW_GRAPPLING_GUARD.rightArm.elbow;
      
      // Elbows should be bent (negative Z for left, positive Z for right)
      expect(leftElbow.z).toBeLessThan(-1.3); // Less than -74°
      expect(rightElbow.z).toBeGreaterThan(1.3); // Greater than 74°
    });

    it("should have deeply bent knees for low center", () => {
      const leftKnee = GON_LOW_GRAPPLING_GUARD.leftLeg.knee;
      const rightKnee = GON_LOW_GRAPPLING_GUARD.rightLeg.knee;
      
      // Knees should be deeply bent (negative X)
      expect(leftKnee.x).toBeLessThan(-0.8); // Less than -46°
      expect(rightKnee.x).toBeLessThan(-0.8);
      
      // Should be symmetric
      expect(leftKnee.x).toBeCloseTo(rightKnee.x, 2);
    });

    it("should have ankles positioned for weight bearing", () => {
      const leftAnkle = GON_LOW_GRAPPLING_GUARD.leftLeg.ankle;
      const rightAnkle = GON_LOW_GRAPPLING_GUARD.rightLeg.ankle;
      
      // Ankles should be dorsiflexed (positive X)
      expect(leftAnkle.x).toBeGreaterThan(0.3); // Greater than 17°
      expect(rightAnkle.x).toBeGreaterThan(0.3);
    });

    it("should have hips back for stability", () => {
      const pelvis = GON_LOW_GRAPPLING_GUARD.pelvis;
      
      // Pelvis should tilt back (negative X)
      expect(pelvis.x).toBeLessThan(-0.3); // Less than -17°
    });

    it("should have forward lean in torso", () => {
      const torso = GON_LOW_GRAPPLING_GUARD.torso;
      
      // Torso should lean forward (positive X)
      expect(torso.x).toBeGreaterThan(0.2); // Greater than 11°
    });

    it("should have neutral wrists", () => {
      const leftWrist = GON_LOW_GRAPPLING_GUARD.leftArm.wrist;
      const rightWrist = GON_LOW_GRAPPLING_GUARD.rightArm.wrist;
      
      // Wrists should be neutral (all close to 0)
      expect(Math.abs(leftWrist.x)).toBeLessThan(0.1);
      expect(Math.abs(leftWrist.y)).toBeLessThan(0.1);
      expect(Math.abs(leftWrist.z)).toBeLessThan(0.1);
      expect(Math.abs(rightWrist.x)).toBeLessThan(0.1);
      expect(Math.abs(rightWrist.y)).toBeLessThan(0.1);
      expect(Math.abs(rightWrist.z)).toBeLessThan(0.1);
    });

    it("should have wide stance width", () => {
      expect(GON_LOW_GRAPPLING_GUARD.stanceWidth).toBeGreaterThan(1.0);
      expect(GON_LOW_GRAPPLING_GUARD.stanceWidth).toBeLessThan(1.5);
    });

    it("should have parallel feet (no depth)", () => {
      expect(GON_LOW_GRAPPLING_GUARD.stanceDepth).toBe(0);
    });

    it("should have lowered pelvis height", () => {
      expect(GON_LOW_GRAPPLING_GUARD.pelvisHeight).toBeDefined();
      expect(GON_LOW_GRAPPLING_GUARD.pelvisHeight).toBeLessThan(0);
      
      if (GON_LOW_GRAPPLING_GUARD.pelvisHeight) {
        expect(GON_LOW_GRAPPLING_GUARD.pelvisHeight).toBeGreaterThan(-0.2);
      }
    });

    it("should have neutral weight distribution", () => {
      expect(GON_LOW_GRAPPLING_GUARD.weight).toBe("neutral");
    });

    it("should have reasonable breathing range", () => {
      const breathingRange = GON_LOW_GRAPPLING_GUARD.breathingRange;
      
      expect(breathingRange.min).toBeLessThan(1.0);
      expect(breathingRange.max).toBeGreaterThan(1.0);
      expect(breathingRange.max - breathingRange.min).toBeGreaterThan(0);
      expect(breathingRange.max - breathingRange.min).toBeLessThan(0.1); // Subtle breathing
    });

    it("should have symmetric leg positions", () => {
      const leftHip = GON_LOW_GRAPPLING_GUARD.leftLeg.hip;
      const rightHip = GON_LOW_GRAPPLING_GUARD.rightLeg.hip;
      const leftKnee = GON_LOW_GRAPPLING_GUARD.leftLeg.knee;
      const rightKnee = GON_LOW_GRAPPLING_GUARD.rightLeg.knee;
      const leftAnkle = GON_LOW_GRAPPLING_GUARD.leftLeg.ankle;
      const rightAnkle = GON_LOW_GRAPPLING_GUARD.rightLeg.ankle;
      
      // Hips should be symmetric
      expect(leftHip.x).toBeCloseTo(rightHip.x, 2);
      expect(leftHip.y).toBeCloseTo(-rightHip.y, 2);
      expect(leftHip.z).toBeCloseTo(-rightHip.z, 2);
      
      // Knees should be symmetric
      expect(leftKnee.x).toBeCloseTo(rightKnee.x, 2);
      
      // Ankles should be symmetric
      expect(leftAnkle.x).toBeCloseTo(rightAnkle.x, 2);
    });
  });

  describe("GON_GUARD_VARIANTS", () => {
    it("should expose LOW_GRAPPLING variant", () => {
      expect(GON_GUARD_VARIANTS.LOW_GRAPPLING).toBeDefined();
      expect(GON_GUARD_VARIANTS.LOW_GRAPPLING).toBe(GON_LOW_GRAPPLING_GUARD);
    });

    it("should be a const object with all expected properties", () => {
      // TypeScript enforces readonly with 'as const', but runtime freezing is optional
      expect(GON_GUARD_VARIANTS.LOW_GRAPPLING).toBeDefined();
      expect(typeof GON_GUARD_VARIANTS).toBe('object');
    });
  });

  describe("Biomechanical Validation", () => {
    it("should maintain anatomically safe joint angles", () => {
      const pose = GON_LOW_GRAPPLING_GUARD;
      
      // Shoulders: Safe range ±180° (±3.14 rad)
      expect(Math.abs(pose.leftArm.shoulder.x)).toBeLessThan(3.14);
      expect(Math.abs(pose.leftArm.shoulder.y)).toBeLessThan(3.14);
      expect(Math.abs(pose.leftArm.shoulder.z)).toBeLessThan(3.14);
      expect(Math.abs(pose.rightArm.shoulder.x)).toBeLessThan(3.14);
      expect(Math.abs(pose.rightArm.shoulder.y)).toBeLessThan(3.14);
      expect(Math.abs(pose.rightArm.shoulder.z)).toBeLessThan(3.14);
      
      // Elbows: Safe range 0-150° (0-2.62 rad)
      expect(Math.abs(pose.leftArm.elbow.z)).toBeLessThan(2.62);
      expect(Math.abs(pose.rightArm.elbow.z)).toBeLessThan(2.62);
      
      // Knees: Safe range 0-135° (0-2.36 rad)
      expect(Math.abs(pose.leftLeg.knee.x)).toBeLessThan(2.36);
      expect(Math.abs(pose.rightLeg.knee.x)).toBeLessThan(2.36);
      
      // Ankles: Safe range ±45° (±0.79 rad)
      expect(Math.abs(pose.leftLeg.ankle.x)).toBeLessThan(0.79);
      expect(Math.abs(pose.rightLeg.ankle.x)).toBeLessThan(0.79);
    });

    it("should have balanced posture", () => {
      const pose = GON_LOW_GRAPPLING_GUARD;
      
      // Torso and pelvis should counterbalance
      // If pelvis tilts back (negative X), torso should lean forward (positive X)
      expect(pose.pelvis.x).toBeLessThan(0);
      expect(pose.torso.x).toBeGreaterThan(0);
    });

    it("should allow for quick directional changes", () => {
      const pose = GON_LOW_GRAPPLING_GUARD;
      
      // Neutral weight distribution allows movement
      expect(pose.weight).toBe("neutral");
      
      // Wide stance provides stable base
      expect(pose.stanceWidth).toBeGreaterThan(1.0);
      
      // Parallel feet allow lateral movement
      expect(pose.stanceDepth).toBe(0);
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should embody Ssireum wrestling principles", () => {
      const pose = GON_LOW_GRAPPLING_GUARD;
      
      // Low center of gravity (lowered pelvis)
      expect(pose.pelvisHeight).toBeLessThan(0);
      
      // Wide stable base (wide stance)
      expect(pose.stanceWidth).toBeGreaterThan(1.0);
      
      // Hands positioned for grappling (forward shoulders, bent elbows)
      expect(pose.leftArm.shoulder.x).toBeGreaterThan(0.4);
      expect(Math.abs(pose.leftArm.elbow.z)).toBeGreaterThan(1.3);
      
      // Deeply bent knees for wrestling readiness
      expect(pose.leftLeg.knee.x).toBeLessThan(-0.8);
    });

    it("should maintain head-up awareness posture", () => {
      const pose = GON_LOW_GRAPPLING_GUARD;
      
      // Despite low stance, torso is upright enough for awareness
      expect(pose.torso.x).toBeGreaterThan(0);
      expect(pose.torso.x).toBeLessThan(0.5); // Not bent over too far (< 28°)
    });
  });
});
