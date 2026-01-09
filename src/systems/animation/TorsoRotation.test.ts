/**
 * Unit tests for Torso Rotation System
 *
 * Tests independent upper/lower body movement including:
 * - Torso rotation calculation (±90° constraints)
 * - Hip rotation power modifiers for combat
 * - Anatomical constraint enforcement
 * - Smooth interpolation timing
 */

import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  TORSO_CONSTRAINTS,
  calculateTorsoRotation,
  calculateHipRotationPowerModifier,
} from "./SkeletonRig";

describe("TorsoRotationSystem", () => {
  describe("TORSO_CONSTRAINTS", () => {
    it("should define anatomically correct rotation limits", () => {
      expect(TORSO_CONSTRAINTS.MAX_ROTATION).toBe(Math.PI / 2); // 90°
      expect(TORSO_CONSTRAINTS.MIN_ROTATION).toBe(-Math.PI / 2); // -90°
      expect(TORSO_CONSTRAINTS.INTERPOLATION_TIME).toBe(0.2); // 200ms
    });

    it("should define power modifier range for hip rotation", () => {
      expect(TORSO_CONSTRAINTS.POWER_MODIFIER_RANGE).toEqual([0.10, 0.30]);
    });
  });

  describe("calculateTorsoRotation", () => {
    it("should calculate zero rotation when opponent is directly ahead of hips", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(0, 0, 5); // Directly ahead (Z+)
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = 0; // Hips facing forward (Z+)

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      expect(torsoRot).toBeCloseTo(0, 5); // Torso aligned with hips
    });

    it("should calculate 90° rotation when opponent is perpendicular to hips", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(5, 0, 0); // Directly to the right (X+)
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = 0; // Hips facing forward (Z+)

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      expect(torsoRot).toBeCloseTo(Math.PI / 2, 5); // 90° right rotation
    });

    it("should clamp rotation to maximum +90° (anatomical constraint)", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(-5, 0, 0); // Behind and to the left
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = 0; // Hips facing right

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      // Should be clamped to max rotation (±90°)
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
    });

    it("should clamp rotation to minimum -90° (anatomical constraint)", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(0, 0, -5); // Behind
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = 0; // Hips facing right

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      // Should be clamped to min/max rotation (±90°)
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
    });

    it("should calculate rotation relative to hip direction, not world", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(5, 0, 5); // Diagonal (45°)
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = 0; // Hips facing forward (Z+)

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      // Torso rotation should be 45° to the right
      expect(torsoRot).toBeGreaterThan(0);
      expect(torsoRot).toBeCloseTo(Math.PI / 4, 5); // ~45°
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
    });

    it("should handle negative hip rotations correctly", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(0, 0, 5); // Forward
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = -Math.PI / 4; // Hips rotated 45° right

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      // Should still be within constraints
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
      // With hips at -45° and opponent at 0°, torso should rotate +45° to face them
      expect(torsoRot).toBeCloseTo(Math.PI / 4, 5);
    });

    it("should handle opponent at same position (edge case)", () => {
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(0, 0, 0); // Same position
      const moveDir = new THREE.Vector3(0, 0, 0);
      const hipRotation = 0;

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      // Should return valid number (not NaN)
      expect(torsoRot).not.toBeNaN();
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
    });
  });

  describe("calculateHipRotationPowerModifier", () => {
    describe("strike techniques", () => {
      it("should return 1.0 modifier with zero rotation", () => {
        const modifier = calculateHipRotationPowerModifier(0, "strike");
        expect(modifier).toBe(1.0); // No bonus
      });

      it("should return 1.30 modifier with full 90° rotation", () => {
        const modifier = calculateHipRotationPowerModifier(Math.PI / 2, "strike");
        expect(modifier).toBeCloseTo(1.30, 5); // Maximum 30% bonus for strikes
      });

      it("should return 1.15 modifier with half rotation (45°)", () => {
        const modifier = calculateHipRotationPowerModifier(Math.PI / 4, "strike");
        expect(modifier).toBeCloseTo(1.15, 2); // Half rotation = half bonus
      });

      it("should handle negative rotations (absolute value)", () => {
        const positiveModifier = calculateHipRotationPowerModifier(
          Math.PI / 2,
          "strike"
        );
        const negativeModifier = calculateHipRotationPowerModifier(
          -Math.PI / 2,
          "strike"
        );
        expect(negativeModifier).toBeCloseTo(positiveModifier, 5);
      });
    });

    describe("throw techniques", () => {
      it("should return 1.0 modifier with zero rotation", () => {
        const modifier = calculateHipRotationPowerModifier(0, "throw");
        expect(modifier).toBe(1.0);
      });

      it("should return 1.10 modifier with full 90° rotation", () => {
        const modifier = calculateHipRotationPowerModifier(Math.PI / 2, "throw");
        expect(modifier).toBeCloseTo(1.10, 5); // Maximum 10% bonus for throws
      });

      it("should return lower modifier than strikes at same rotation", () => {
        const strikeModifier = calculateHipRotationPowerModifier(
          Math.PI / 2,
          "strike"
        );
        const throwModifier = calculateHipRotationPowerModifier(
          Math.PI / 2,
          "throw"
        );
        expect(throwModifier).toBeLessThan(strikeModifier);
      });
    });

    describe("joint lock techniques", () => {
      it("should return 1.0 modifier with zero rotation", () => {
        const modifier = calculateHipRotationPowerModifier(0, "joint");
        expect(modifier).toBe(1.0);
      });

      it("should return 1.10 modifier with full 90° rotation", () => {
        const modifier = calculateHipRotationPowerModifier(Math.PI / 2, "joint");
        expect(modifier).toBeCloseTo(1.10, 5); // Maximum 10% bonus for joints
      });

      it("should return same modifier as throws at same rotation", () => {
        const jointModifier = calculateHipRotationPowerModifier(
          Math.PI / 2,
          "joint"
        );
        const throwModifier = calculateHipRotationPowerModifier(
          Math.PI / 2,
          "throw"
        );
        expect(jointModifier).toBeCloseTo(throwModifier, 5);
      });
    });

    describe("edge cases", () => {
      it("should handle rotations exceeding 90° (hypothetical)", () => {
        // Even if rotation exceeds 90° (shouldn't happen with constraints),
        // modifier should be clamped to maximum
        const modifier = calculateHipRotationPowerModifier(Math.PI, "strike");
        expect(modifier).toBeGreaterThanOrEqual(1.0);
        expect(modifier).toBeLessThanOrEqual(1.31); // Allow small floating point error
      });

      it("should return values in expected range for all technique types", () => {
        const techniques: Array<"strike" | "throw" | "joint"> = [
          "strike",
          "throw",
          "joint",
        ];
        const rotations = [0, Math.PI / 8, Math.PI / 4, Math.PI / 2];

        techniques.forEach((technique) => {
          rotations.forEach((rotation) => {
            const modifier = calculateHipRotationPowerModifier(rotation, technique);
            expect(modifier).toBeGreaterThanOrEqual(1.0);
            expect(modifier).toBeLessThanOrEqual(1.30);
          });
        });
      });
    });
  });

  describe("Integration: Torso rotation with hip rotation power", () => {
    it("should combine torso rotation calculation with power modifier", () => {
      // Scenario: Player strafing left while facing opponent to the right
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(5, 0, 0);
      const moveDir = new THREE.Vector3(0, 0, 1); // Moving forward
      const hipRotation = Math.PI / 4; // Hips rotated 45° for strafing

      // Calculate torso rotation to face opponent
      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );

      // Calculate power modifier from hip engagement
      const powerModifier = calculateHipRotationPowerModifier(
        Math.abs(torsoRot),
        "strike"
      );

      // Verify both calculations work together
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
      expect(powerModifier).toBeGreaterThanOrEqual(1.0);
      expect(powerModifier).toBeLessThanOrEqual(1.30);
    });

    it("should demonstrate realistic combat scenario: lateral strike", () => {
      // Real combat scenario: Moving left, opponent ahead-right
      const playerPos = new THREE.Vector3(0, 0, 0);
      const opponentPos = new THREE.Vector3(3, 0, 2);
      const moveDir = new THREE.Vector3(-1, 0, 0); // Moving left
      const hipRotation = -Math.PI / 3; // Hips facing slightly left for movement

      const torsoRot = calculateTorsoRotation(
        playerPos,
        opponentPos,
        moveDir,
        hipRotation
      );
      const powerModifier = calculateHipRotationPowerModifier(
        Math.abs(torsoRot),
        "strike"
      );

      // Torso should rotate to face opponent within anatomical limits
      expect(Math.abs(torsoRot)).toBeLessThanOrEqual(TORSO_CONSTRAINTS.MAX_ROTATION);
      
      // Power modifier should be applied based on torso rotation
      expect(powerModifier).toBeGreaterThan(1.0); // Some rotation = some bonus
    });
  });

  describe("Performance: Interpolation timing", () => {
    it("should complete rotation within target 200ms timeframe", () => {
      // This is a functional test - actual timing would be tested in integration
      expect(TORSO_CONSTRAINTS.INTERPOLATION_TIME).toBe(0.2);
      
      // Verify the interpolation time is appropriate for 60fps
      const framesAt60fps = TORSO_CONSTRAINTS.INTERPOLATION_TIME * 60;
      expect(framesAt60fps).toBe(12); // 12 frames at 60fps
    });

    it("should define constraints compatible with real-time performance", () => {
      // Verify all constants are reasonable for 60fps gameplay
      expect(TORSO_CONSTRAINTS.MAX_ROTATION).toBeGreaterThan(0);
      expect(TORSO_CONSTRAINTS.MIN_ROTATION).toBeLessThan(0);
      expect(TORSO_CONSTRAINTS.INTERPOLATION_TIME).toBeLessThan(1.0); // Less than 1 second
    });
  });
});
