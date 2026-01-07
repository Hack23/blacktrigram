/**
 * Tests for guard pose mirroring function
 * 
 * Validates that left/right stance mirroring works correctly for
 * authentic Korean martial arts stance differentiation.
 * 
 * @module types/__tests__/skeletal.mirrorGuardPose.test.ts
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { mirrorGuardPose } from "../skeletal";
import type { StanceGuardPose } from "../skeletal";

describe("mirrorGuardPose", () => {
  describe("Basic Mirroring", () => {
    it("should swap left and right arm positions", () => {
      const originalPose: StanceGuardPose = {
        leftArm: {
          shoulder: new THREE.Euler(1.0, 0.5, 0.3),
          elbow: new THREE.Euler(0.0, 0.8, 0.0),
          wrist: new THREE.Euler(0.2, 0.0, 0.0),
        },
        rightArm: {
          shoulder: new THREE.Euler(1.0, -0.5, -0.3),
          elbow: new THREE.Euler(0.0, -0.8, 0.0),
          wrist: new THREE.Euler(0.2, 0.0, 0.0),
        },
        torso: new THREE.Euler(0.1, 0.0, 0.0),
        leftLeg: {
          hip: new THREE.Euler(0.1, 0.05, 0.0),
          knee: new THREE.Euler(0.3, 0.0, 0.0),
          ankle: new THREE.Euler(-0.1, 0.0, 0.0),
        },
        rightLeg: {
          hip: new THREE.Euler(0.1, -0.05, 0.0),
          knee: new THREE.Euler(0.3, 0.0, 0.0),
          ankle: new THREE.Euler(-0.1, 0.0, 0.0),
        },
        pelvis: new THREE.Euler(0.05, 0.0, 0.0),
        stanceWidth: 0.5,
        weight: "forward",
        breathingRange: { min: 0.98, max: 1.02 },
      };

      const mirrored = mirrorGuardPose(originalPose);

      // Left arm should become right arm (with mirrored Y/Z)
      expect(mirrored.leftArm.shoulder.x).toBeCloseTo(1.0);
      expect(mirrored.leftArm.shoulder.y).toBeCloseTo(0.5); // Negated from -0.5
      expect(mirrored.leftArm.shoulder.z).toBeCloseTo(0.3); // Negated from -0.3

      // Right arm should become left arm (with mirrored Y/Z)
      expect(mirrored.rightArm.shoulder.x).toBeCloseTo(1.0);
      expect(mirrored.rightArm.shoulder.y).toBeCloseTo(-0.5); // Negated from 0.5
      expect(mirrored.rightArm.shoulder.z).toBeCloseTo(-0.3); // Negated from 0.3
    });

    it("should preserve X rotation (forward/back bend)", () => {
      const pose: StanceGuardPose = {
        leftArm: {
          shoulder: new THREE.Euler(-0.5, 0.3, 0.1),
          elbow: new THREE.Euler(0.0, 0.8, 0.0),
          wrist: new THREE.Euler(0.2, 0.0, 0.0),
        },
        rightArm: {
          shoulder: new THREE.Euler(-0.5, -0.3, -0.1),
          elbow: new THREE.Euler(0.0, -0.8, 0.0),
          wrist: new THREE.Euler(0.2, 0.0, 0.0),
        },
        torso: new THREE.Euler(0.1, 0.0, 0.0),
        leftLeg: {
          hip: new THREE.Euler(0.2, 0.1, 0.0),
          knee: new THREE.Euler(0.4, 0.0, 0.0),
          ankle: new THREE.Euler(-0.15, 0.0, 0.0),
        },
        rightLeg: {
          hip: new THREE.Euler(0.2, -0.1, 0.0),
          knee: new THREE.Euler(0.4, 0.0, 0.0),
          ankle: new THREE.Euler(-0.15, 0.0, 0.0),
        },
        pelvis: new THREE.Euler(0.08, 0.0, 0.0),
        stanceWidth: 0.6,
        weight: "forward",
        breathingRange: { min: 0.98, max: 1.02 },
      };

      const mirrored = mirrorGuardPose(pose);

      // X rotations should be preserved (not negated)
      expect(mirrored.leftArm.shoulder.x).toBeCloseTo(-0.5);
      expect(mirrored.rightArm.shoulder.x).toBeCloseTo(-0.5);
      expect(mirrored.leftArm.elbow.x).toBeCloseTo(0.0);
      expect(mirrored.leftArm.wrist.x).toBeCloseTo(0.2);
    });

    it("should negate Y and Z rotations (lateral and roll)", () => {
      const pose: StanceGuardPose = {
        leftArm: {
          shoulder: new THREE.Euler(0.0, 0.5, 0.3),
          elbow: new THREE.Euler(0.0, 0.8, 0.0),
          wrist: new THREE.Euler(0.0, 0.1, 0.2),
        },
        rightArm: {
          shoulder: new THREE.Euler(0.0, -0.5, -0.3),
          elbow: new THREE.Euler(0.0, -0.8, 0.0),
          wrist: new THREE.Euler(0.0, -0.1, -0.2),
        },
        torso: new THREE.Euler(0.0, 0.2, 0.1),
        leftLeg: {
          hip: new THREE.Euler(0.0, 0.15, 0.1),
          knee: new THREE.Euler(0.25, 0.0, 0.0),
          ankle: new THREE.Euler(-0.1, 0.0, 0.05),
        },
        rightLeg: {
          hip: new THREE.Euler(0.0, -0.15, -0.1),
          knee: new THREE.Euler(0.25, 0.0, 0.0),
          ankle: new THREE.Euler(-0.1, 0.0, -0.05),
        },
        pelvis: new THREE.Euler(0.0, 0.1, 0.0),
        stanceWidth: 0.5,
        weight: "neutral",
        breathingRange: { min: 0.97, max: 1.03 },
      };

      const mirrored = mirrorGuardPose(pose);

      // Y rotations should be negated
      expect(mirrored.leftArm.shoulder.y).toBeCloseTo(0.5); // From -0.5
      expect(mirrored.rightArm.shoulder.y).toBeCloseTo(-0.5); // From 0.5
      
      // Z rotations should be negated
      expect(mirrored.leftArm.shoulder.z).toBeCloseTo(0.3); // From -0.3
      expect(mirrored.rightArm.shoulder.z).toBeCloseTo(-0.3); // From 0.3
    });
  });

  describe("Double Mirroring (Identity Test)", () => {
    it("should return to original pose when mirrored twice", () => {
      const original: StanceGuardPose = {
        leftArm: {
          shoulder: new THREE.Euler(-0.5, 0.3, 0.1),
          elbow: new THREE.Euler(0.0, 0.8, 0.0),
          wrist: new THREE.Euler(0.2, 0.0, 0.0),
        },
        rightArm: {
          shoulder: new THREE.Euler(-0.5, -0.3, -0.1),
          elbow: new THREE.Euler(0.0, -0.8, 0.0),
          wrist: new THREE.Euler(0.2, 0.0, 0.0),
        },
        torso: new THREE.Euler(0.1, 0.2, 0.3),
        leftLeg: {
          hip: new THREE.Euler(0.15, 0.08, 0.05),
          knee: new THREE.Euler(0.35, 0.0, 0.0),
          ankle: new THREE.Euler(-0.12, 0.0, 0.02),
        },
        rightLeg: {
          hip: new THREE.Euler(0.15, -0.08, -0.05),
          knee: new THREE.Euler(0.35, 0.0, 0.0),
          ankle: new THREE.Euler(-0.12, 0.0, -0.02),
        },
        pelvis: new THREE.Euler(0.06, 0.04, 0.0),
        stanceWidth: 0.55,
        weight: "forward",
        breathingRange: { min: 0.98, max: 1.02 },
      };

      const mirrored = mirrorGuardPose(original);
      const doubleMirrored = mirrorGuardPose(mirrored);

      // Should return to original (within floating point tolerance)
      expect(doubleMirrored.leftArm.shoulder.x).toBeCloseTo(original.leftArm.shoulder.x);
      expect(doubleMirrored.leftArm.shoulder.y).toBeCloseTo(original.leftArm.shoulder.y);
      expect(doubleMirrored.leftArm.shoulder.z).toBeCloseTo(original.leftArm.shoulder.z);
    });
  });
});
