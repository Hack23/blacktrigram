/**
 * Attack Movement Physics Tests
 *
 * **Korean**: 공격 이동 물리 테스트
 *
 * Tests for realistic forward momentum during attack animations.
 *
 * @module systems/physics/AttackMovementPhysics.test
 * @category Physics System Tests
 * @korean 공격이동물리테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import { AttackMovementPhysics } from "./AttackMovementPhysics";
import { AnimationType } from "@/systems/animation";
import { TrigramStance } from "@/types/common";

describe("AttackMovementPhysics", () => {
  let physics: AttackMovementPhysics;

  beforeEach(() => {
    physics = new AttackMovementPhysics();
  });

  describe("calculateAttackMovement", () => {
    it("should calculate forward movement for kick attacks", () => {
      const config = {
        animationType: AnimationType.ROUNDHOUSE_KICK,
        currentStance: TrigramStance.GEON, // Heaven stance (+30%)
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.48,
      };

      const result = physics.calculateAttackMovement(config);

      // Base: 1.0m, Geon modifier: 1.3x = 1.3m
      expect(result.displacement.x).toBeCloseTo(1.3, 1);
      expect(result.displacement.y).toBe(0);
      expect(result.displacement.z).toBe(0);
      expect(result.lungeDuration).toBe(0.24); // 50% of animation
      expect(result.recoveryDuration).toBe(0.24); // 50% of animation
      expect(result.totalDuration).toBe(0.48);
    });

    it("should calculate forward movement for punch attacks", () => {
      const config = {
        animationType: AnimationType.CROSS,
        currentStance: TrigramStance.LI, // Fire stance (+10%)
        direction: new THREE.Vector3(0, 0, 1).normalize(),
        animationDuration: 0.3,
      };

      const result = physics.calculateAttackMovement(config);

      // Base: 0.5m, Li modifier: 1.1x = 0.55m
      expect(result.displacement.z).toBeCloseTo(0.55, 2);
      expect(result.displacement.x).toBe(0);
      expect(result.displacement.y).toBe(0);
    });

    it("should apply aggressive stance modifiers correctly", () => {
      const baseConfig = {
        animationType: AnimationType.FRONT_KICK,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.4,
        currentStance: TrigramStance.GEON,
      };

      // Heaven stance (most aggressive - pure yang drives forward)
      const heavenResult = physics.calculateAttackMovement({
        ...baseConfig,
        currentStance: TrigramStance.GEON,
      });

      // Fire stance (precision with controlled forward movement)
      const fireResult = physics.calculateAttackMovement({
        ...baseConfig,
        currentStance: TrigramStance.LI,
      });

      // Mountain stance (defensive)
      const mountainResult = physics.calculateAttackMovement({
        ...baseConfig,
        currentStance: TrigramStance.GAN,
      });

      // Heaven should move furthest
      expect(heavenResult.displacement.x).toBeGreaterThan(
        fireResult.displacement.x
      );

      // Fire should move more than Mountain
      expect(fireResult.displacement.x).toBeGreaterThan(
        mountainResult.displacement.x
      );

      // Verify actual values
      // Base: 0.8m
      expect(heavenResult.displacement.x).toBeCloseTo(0.8 * 1.3, 2); // 1.04m
      expect(fireResult.displacement.x).toBeCloseTo(0.8 * 1.1, 2); // 0.88m
      expect(mountainResult.displacement.x).toBeCloseTo(0.8 * 0.8, 2); // 0.64m
    });

    it("should handle different animation types with appropriate distances", () => {
      const direction = new THREE.Vector3(1, 0, 0).normalize();
      const stance = TrigramStance.GEON;
      const duration = 0.4;

      // Kicks should move furthest
      const kickResult = physics.calculateAttackMovement({
        animationType: AnimationType.ROUNDHOUSE_KICK,
        currentStance: stance,
        direction,
        animationDuration: duration,
      });

      // Punches should move moderately
      const punchResult = physics.calculateAttackMovement({
        animationType: AnimationType.CROSS,
        currentStance: stance,
        direction,
        animationDuration: duration,
      });

      // Elbows should move minimally
      const elbowResult = physics.calculateAttackMovement({
        animationType: AnimationType.ELBOW_STRIKE,
        currentStance: stance,
        direction,
        animationDuration: duration,
      });

      expect(kickResult.displacement.length()).toBeGreaterThan(
        punchResult.displacement.length()
      );
      expect(punchResult.displacement.length()).toBeGreaterThan(
        elbowResult.displacement.length()
      );
    });

    it("should normalize direction vectors", () => {
      const unnormalizedDirection = new THREE.Vector3(5, 0, 0);
      const config = {
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        direction: unnormalizedDirection.normalize(),
        animationDuration: 0.25,
      };

      const result = physics.calculateAttackMovement(config);

      // Base: 0.3m, Geon: 1.3x = 0.39m
      expect(result.displacement.length()).toBeCloseTo(0.39, 2);
    });
  });

  describe("applyAttackMovement", () => {
    it("should apply forward lunge during lunge phase", () => {
      const initialPosition = new THREE.Vector3(0, 0, 0);
      const result = {
        displacement: new THREE.Vector3(1.0, 0, 0),
        lungeDuration: 0.24,
        recoveryDuration: 0.24,
        totalDuration: 0.48,
      };

      // At 25% through lunge phase
      const position25 = physics.applyAttackMovement(
        initialPosition,
        result,
        0.06,
        false
      );

      // At 50% through lunge phase
      const position50 = physics.applyAttackMovement(
        initialPosition,
        result,
        0.12,
        false
      );

      // At 100% through lunge phase (peak)
      const position100 = physics.applyAttackMovement(
        initialPosition,
        result,
        0.24,
        false
      );

      // Should progress forward with ease-out curve
      expect(position25.x).toBeGreaterThan(0);
      expect(position50.x).toBeGreaterThan(position25.x);
      expect(position100.x).toBeCloseTo(1.0, 2); // Full displacement at peak
    });

    it("should return to origin during recovery phase", () => {
      const initialPosition = new THREE.Vector3(0, 0, 0);
      const result = {
        displacement: new THREE.Vector3(1.0, 0, 0),
        lungeDuration: 0.24,
        recoveryDuration: 0.24,
        totalDuration: 0.48,
      };

      // At 50% through recovery phase
      const position50Recovery = physics.applyAttackMovement(
        initialPosition,
        result,
        0.36, // 0.24 lunge + 0.12 recovery
        true
      );

      // At 100% through recovery phase (back to origin)
      const position100Recovery = physics.applyAttackMovement(
        initialPosition,
        result,
        0.48, // 0.24 lunge + 0.24 recovery
        true
      );

      // Should be returning to origin
      expect(position50Recovery.x).toBeLessThan(1.0);
      expect(position50Recovery.x).toBeGreaterThan(0);

      // Should be back at origin at end of recovery
      expect(position100Recovery.x).toBeCloseTo(0, 1);
    });

    it("should handle different starting positions", () => {
      const startPosition = new THREE.Vector3(5, 0, 3);
      const result = {
        displacement: new THREE.Vector3(0.5, 0, 0),
        lungeDuration: 0.15,
        recoveryDuration: 0.15,
        totalDuration: 0.3,
      };

      const peakPosition = physics.applyAttackMovement(
        startPosition,
        result,
        0.15,
        false
      );

      // Should move from start position
      expect(peakPosition.x).toBeCloseTo(5.5, 1);
      expect(peakPosition.y).toBe(0);
      expect(peakPosition.z).toBe(3);
    });

    it("should not mutate original position vector", () => {
      const originalPosition = new THREE.Vector3(0, 0, 0);
      const originalX = originalPosition.x;

      const result = {
        displacement: new THREE.Vector3(1.0, 0, 0),
        lungeDuration: 0.24,
        recoveryDuration: 0.24,
        totalDuration: 0.48,
      };

      physics.applyAttackMovement(originalPosition, result, 0.12, false);

      // Original should be unchanged
      expect(originalPosition.x).toBe(originalX);
    });
  });

  describe("phase detection", () => {
    it("should detect lunge phase correctly", () => {
      const lungeDuration = 0.24;

      expect(physics.isInLungePhase(0.0, lungeDuration)).toBe(true);
      expect(physics.isInLungePhase(0.12, lungeDuration)).toBe(true);
      expect(physics.isInLungePhase(0.23, lungeDuration)).toBe(true);
      expect(physics.isInLungePhase(0.24, lungeDuration)).toBe(false);
      expect(physics.isInLungePhase(0.3, lungeDuration)).toBe(false);
    });

    it("should detect recovery phase correctly", () => {
      const result = {
        displacement: new THREE.Vector3(1, 0, 0),
        lungeDuration: 0.24,
        recoveryDuration: 0.24,
        totalDuration: 0.48,
      };

      expect(physics.isInRecoveryPhase(0.12, result)).toBe(false); // Still in lunge
      expect(physics.isInRecoveryPhase(0.24, result)).toBe(true); // Start of recovery
      expect(physics.isInRecoveryPhase(0.36, result)).toBe(true); // Middle of recovery
      expect(physics.isInRecoveryPhase(0.48, result)).toBe(false); // Recovery complete
      expect(physics.isInRecoveryPhase(0.5, result)).toBe(false); // Past recovery
    });
  });

  describe("bilingual names", () => {
    it("should return bilingual lunge phase name", () => {
      const name = physics.getLungePhaseName();
      expect(name.korean).toBe("돌진");
      expect(name.english).toBe("Lunge");
    });

    it("should return bilingual recovery phase name", () => {
      const name = physics.getRecoveryPhaseName();
      expect(name.korean).toBe("복귀");
      expect(name.english).toBe("Recovery");
    });
  });

  describe("stance movement modifiers", () => {
    it("should apply all eight trigram stance modifiers", () => {
      const baseConfig = {
        animationType: AnimationType.FRONT_KICK,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.4,
        currentStance: TrigramStance.GEON,
      };

      const stances = [
        { stance: TrigramStance.GEON, expectedMultiplier: 1.3 }, // Heaven: most aggressive
        { stance: TrigramStance.JIN, expectedMultiplier: 1.2 },
        { stance: TrigramStance.SON, expectedMultiplier: 1.15 },
        { stance: TrigramStance.LI, expectedMultiplier: 1.1 }, // Fire: controlled precision
        { stance: TrigramStance.TAE, expectedMultiplier: 1.0 },
        { stance: TrigramStance.GAM, expectedMultiplier: 1.0 },
        { stance: TrigramStance.GON, expectedMultiplier: 0.9 },
        { stance: TrigramStance.GAN, expectedMultiplier: 0.8 },
      ];

      for (const { stance, expectedMultiplier } of stances) {
        const result = physics.calculateAttackMovement({
          ...baseConfig,
          currentStance: stance,
        });

        // Base: 0.8m * modifier
        const expectedDistance = 0.8 * expectedMultiplier;
        expect(result.displacement.length()).toBeCloseTo(expectedDistance, 2);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle zero duration gracefully", () => {
      const config = {
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0,
      };

      const result = physics.calculateAttackMovement(config);

      expect(result.lungeDuration).toBe(0);
      expect(result.recoveryDuration).toBe(0);
      expect(result.totalDuration).toBe(0);
    });

    it("should handle diagonal directions correctly", () => {
      const diagonalDirection = new THREE.Vector3(1, 0, 1).normalize();
      const config = {
        animationType: AnimationType.ROUNDHOUSE_KICK,
        currentStance: TrigramStance.GEON,
        direction: diagonalDirection,
        animationDuration: 0.48,
      };

      const result = physics.calculateAttackMovement(config);

      // Base: 1.0m, Geon: 1.3x = 1.3m total
      expect(result.displacement.length()).toBeCloseTo(1.3, 2);

      // Should maintain diagonal direction
      const normalizedResult = result.displacement.clone().normalize();
      expect(normalizedResult.x).toBeCloseTo(diagonalDirection.x, 2);
      expect(normalizedResult.z).toBeCloseTo(diagonalDirection.z, 2);
    });

    it("should clamp progress values in applyAttackMovement", () => {
      const position = new THREE.Vector3(0, 0, 0);
      const result = {
        displacement: new THREE.Vector3(1, 0, 0),
        lungeDuration: 0.2,
        recoveryDuration: 0.2,
        totalDuration: 0.4,
      };

      // Test with time beyond lunge duration (should clamp to 1.0)
      const peakPosition = physics.applyAttackMovement(
        position,
        result,
        0.3,
        false
      );

      expect(peakPosition.x).toBeCloseTo(1.0, 1);

      // Test with time beyond recovery duration (should clamp to 0.0)
      const returnPosition = physics.applyAttackMovement(
        position,
        result,
        0.5,
        true
      );

      expect(returnPosition.x).toBeCloseTo(0.0, 1);
    });
  });
});
