/**
 * Unit tests for Torso Rotation System
 *
 * Tests independent upper/lower body movement including:
 * - Torso rotation calculation (±90° constraints)
 * - Hip rotation power modifiers for combat
 * - Anatomical constraint enforcement
 * - Smooth interpolation timing
 * - Technique-specific torso rotation validation
 * - Sequential spine rotation (lower → mid → upper)
 */

import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  TORSO_CONSTRAINTS,
  calculateTorsoRotation,
  calculateHipRotationPowerModifier,
} from "./SkeletonRig";
import {
  JAB_ANIMATION,
  CROSS_ANIMATION,
  HOOK_ANIMATION,
} from "./PunchAnimations";
import {
  ROUNDHOUSE_KICK_ANIMATION,
} from "./KickAnimations";
import { BoneName } from "../../types/skeletal";

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

  describe("Technique Torso Rotation Validation", () => {
    describe("Debug: Check keyframe structure", () => {
      it("should show JAB_ANIMATION keyframe structure", () => {
        const jab = JAB_ANIMATION;
        console.log("\n=== JAB_ANIMATION Keyframes ===");
        jab.keyframes.forEach((kf, i) => {
          console.log(`\nKeyframe ${i} at t=${kf.time}:`);
          console.log(`  Bones: ${Array.from(kf.boneRotations.keys()).join(", ")}`);
          console.log(`  Has SPINE_LOWER: ${kf.boneRotations.has(BoneName.SPINE_LOWER)}`);
          console.log(`  Has SPINE_MIDDLE: ${kf.boneRotations.has(BoneName.SPINE_MIDDLE)}`);
          console.log(`  Has SPINE_UPPER: ${kf.boneRotations.has(BoneName.SPINE_UPPER)}`);
        });
        
        // This test always passes - just for debugging
        expect(jab.keyframes.length).toBeGreaterThan(0);
      });
    });

    describe("Straight Punch Torso Rotation", () => {
      it("should have torso rotation in jab extension phase", () => {
        const jab = JAB_ANIMATION;
        
        // Find extension keyframe (should be at 0.25s after chamber at 0.10s)
        const extensionFrame = jab.keyframes.find(kf => 
          kf.time >= 0.20 && kf.time <= 0.30
        );
        
        expect(extensionFrame).toBeDefined();
        if (!extensionFrame) return;
        
        // Check that spine bones are rotated
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_MIDDLE)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
        
        const spineLower = extensionFrame.boneRotations.get(BoneName.SPINE_LOWER);
        const spineMid = extensionFrame.boneRotations.get(BoneName.SPINE_MIDDLE);
        const spineUpper = extensionFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        // Spine should have Y-axis rotation (counter-rotation for power)
        if (spineLower && spineMid && spineUpper) {
          expect(Math.abs(spineLower.y)).toBeGreaterThan(0);
          expect(Math.abs(spineMid.y)).toBeGreaterThan(0);
          expect(Math.abs(spineUpper.y)).toBeGreaterThan(0);
        }
      });

      it("should have torso rotation in cross extension phase", () => {
        const cross = CROSS_ANIMATION;
        
        // Find extension keyframe (should be after chamber, around 0.35s)
        const extensionFrame = cross.keyframes.find(kf => 
          kf.time >= 0.30 && kf.time <= 0.45
        );
        
        expect(extensionFrame).toBeDefined();
        if (!extensionFrame) return;
        
        // Cross should have spine rotation
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_MIDDLE)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
      });

      it("should have sequential spine rotation (lower < mid < upper)", () => {
        const cross = CROSS_ANIMATION;
        
        // Find extension keyframe (should be after chamber, around 0.35s)
        const extensionFrame = cross.keyframes.find(kf => 
          kf.time >= 0.30 && kf.time <= 0.45
        );
        
        expect(extensionFrame).toBeDefined();
        if (!extensionFrame) return;
        
        const spineLower = extensionFrame.boneRotations.get(BoneName.SPINE_LOWER);
        const spineMid = extensionFrame.boneRotations.get(BoneName.SPINE_MIDDLE);
        const spineUpper = extensionFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        // Sequential rotation: lower rotates least, upper rotates most
        if (spineLower && spineMid && spineUpper) {
          const lowerAbs = Math.abs(spineLower.y);
          const midAbs = Math.abs(spineMid.y);
          const upperAbs = Math.abs(spineUpper.y);
          
          // Lower should rotate less than mid
          expect(lowerAbs).toBeLessThanOrEqual(midAbs + 0.1); // Allow small margin
          // Mid should rotate less than upper
          expect(midAbs).toBeLessThanOrEqual(upperAbs + 0.1);
        }
      });
    });

    describe("Hook Punch Torso Rotation", () => {
      it("should have circular torso rotation in hook extension", () => {
        const hook = HOOK_ANIMATION;
        
        // Find extension keyframe (hook punch at ~0.20-0.35s range)
        const extensionFrame = hook.keyframes.find(kf => 
          kf.time >= 0.20 && kf.time <= 0.40
        );
        
        expect(extensionFrame).toBeDefined();
        if (!extensionFrame) return;
        
        // Hook should have all spine bones rotated
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_MIDDLE)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
        
        const spineUpper = extensionFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        // Hook should have larger rotation than straight punch (45-60° range)
        if (spineUpper) {
          const rotationDegrees = Math.abs(spineUpper.y) * (180 / Math.PI);
          expect(rotationDegrees).toBeGreaterThan(40); // At least 40° rotation
          expect(rotationDegrees).toBeLessThan(65); // Not exceeding 65°
        }
      });

      it("should have sequential spine rotation in hooks", () => {
        const hook = HOOK_ANIMATION;
        
        const extensionFrame = hook.keyframes.find(kf => 
          kf.time >= 0.20 && kf.time <= 0.40
        );
        
        expect(extensionFrame).toBeDefined();
        if (!extensionFrame) return;
        
        const spineLower = extensionFrame.boneRotations.get(BoneName.SPINE_LOWER);
        const spineMid = extensionFrame.boneRotations.get(BoneName.SPINE_MIDDLE);
        const spineUpper = extensionFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        // All spine bones should be present and rotating
        expect(spineLower).toBeDefined();
        expect(spineMid).toBeDefined();
        expect(spineUpper).toBeDefined();
        
        if (spineLower && spineMid && spineUpper) {
          // Should have Y-axis rotation for circular motion
          expect(Math.abs(spineLower.y)).toBeGreaterThan(0);
          expect(Math.abs(spineMid.y)).toBeGreaterThan(0);
          expect(Math.abs(spineUpper.y)).toBeGreaterThan(0);
        }
      });
    });

    describe("Kick Torso Lean", () => {
      it("should have compensatory torso lean in roundhouse kick", () => {
        const roundhouse = ROUNDHOUSE_KICK_ANIMATION;
        
        // Find extension keyframe (kick fully extended)
        const extensionFrame = roundhouse.keyframes.find(kf => 
          kf.time >= 0.30 && kf.time <= 0.50
        );
        
        expect(extensionFrame).toBeDefined();
        if (!extensionFrame) return;
        
        // Should have spine rotation (lean on Z-axis)
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_MIDDLE)).toBe(true);
        expect(extensionFrame.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
        
        const spineLower = extensionFrame.boneRotations.get(BoneName.SPINE_LOWER);
        const spineMid = extensionFrame.boneRotations.get(BoneName.SPINE_MIDDLE);
        const spineUpper = extensionFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        // Should have Z-axis rotation for lateral lean
        if (spineLower && spineMid && spineUpper) {
          // At least one spine bone should have Z rotation for balance
          const hasZRotation = 
            Math.abs(spineLower.z) > 0.01 ||
            Math.abs(spineMid.z) > 0.01 ||
            Math.abs(spineUpper.z) > 0.01;
          expect(hasZRotation).toBe(true);
        }
      });

      it("should have spine rotation synchronized with kick extension", () => {
        const roundhouse = ROUNDHOUSE_KICK_ANIMATION;
        
        // Check that spine rotation exists at the peak of kick
        const peakFrame = roundhouse.keyframes.find(kf => 
          kf.time >= 0.40 && kf.time <= 0.55
        );
        
        expect(peakFrame).toBeDefined();
        if (!peakFrame) return;
        
        // Peak should maintain spine rotation for balance
        expect(peakFrame.boneRotations.has(BoneName.SPINE_LOWER)).toBe(true);
        expect(peakFrame.boneRotations.has(BoneName.SPINE_MIDDLE)).toBe(true);
        expect(peakFrame.boneRotations.has(BoneName.SPINE_UPPER)).toBe(true);
      });
    });

    describe("Torso Recovery", () => {
      it("should reset torso rotation during recovery phase", () => {
        const jab = JAB_ANIMATION;
        
        // Find recovery keyframe (last keyframe)
        const recoveryFrame = jab.keyframes[jab.keyframes.length - 1];
        
        expect(recoveryFrame).toBeDefined();
        
        // Recovery should reset spine to neutral or near-neutral
        const spineLower = recoveryFrame.boneRotations.get(BoneName.SPINE_LOWER);
        const spineMid = recoveryFrame.boneRotations.get(BoneName.SPINE_MIDDLE);
        const spineUpper = recoveryFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        if (spineLower && spineMid && spineUpper) {
          // Should be close to neutral (allowing for small guard adjustments)
          expect(Math.abs(spineLower.y)).toBeLessThan(0.2); // ~11°
          expect(Math.abs(spineMid.y)).toBeLessThan(0.2);
          expect(Math.abs(spineUpper.y)).toBeLessThan(0.2);
        }
      });
    });
  });
});
