/**
 * Enhanced Attack Movement Physics Tests - Edge Cases & Coverage Boost
 *
 * **Korean**: 공격 이동 물리 향상 테스트
 *
 * Additional tests to achieve 90%+ coverage by testing:
 * - Edge cases (negative durations, zero vectors, extreme values)
 * - Error handling paths
 * - Boundary conditions
 * - Integration scenarios
 * - All untested animation types
 *
 * @module systems/physics/AttackMovementPhysics.enhanced.test
 * @category Physics System Tests
 * @korean 공격이동물리향상테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import { AttackMovementPhysics } from "./AttackMovementPhysics";
import { AnimationType } from "@/systems/animation";
import { TrigramStance } from "@/types/common";

describe("AttackMovementPhysics - Enhanced Coverage", () => {
  let physics: AttackMovementPhysics;

  beforeEach(() => {
    physics = new AttackMovementPhysics();
  });

  describe("Edge Cases - Animation Duration", () => {
    it("should handle negative animation duration gracefully", () => {
      const config = {
        animationType: AnimationType.FRONT_KICK,
        currentStance: TrigramStance.GEON,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: -0.5, // Negative duration
      };

      const result = physics.calculateAttackMovement(config);

      // System should handle gracefully, not crash
      expect(result.totalDuration).toBe(-0.5);
      expect(result.lungeDuration).toBe(-0.25);
      expect(result.recoveryDuration).toBe(-0.25);
      expect(result.displacement).toBeDefined();
    });

    it("should handle very long animation durations", () => {
      const config = {
        animationType: AnimationType.JUMPING_KICK,
        currentStance: TrigramStance.GEON,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 5.0, // Unusually long 5 second animation
      };

      const result = physics.calculateAttackMovement(config);

      // Displacement should still be based on technique, not duration
      expect(result.displacement.length()).toBeCloseTo(1.2 * 1.3, 2); // 1.2m * 1.3 Geon
      expect(result.lungeDuration).toBe(2.5); // 50% of 5s
      expect(result.recoveryDuration).toBe(2.5);
      expect(result.totalDuration).toBe(5.0);
    });

    it("should handle extremely short animation durations", () => {
      const config = {
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.01, // 10ms extremely fast animation
      };

      const result = physics.calculateAttackMovement(config);

      expect(result.totalDuration).toBe(0.01);
      expect(result.lungeDuration).toBe(0.005);
      expect(result.recoveryDuration).toBe(0.005);
    });
  });

  describe("Edge Cases - Direction Vectors", () => {
    it("should handle zero-length direction vector gracefully", () => {
      const zeroVector = new THREE.Vector3(0, 0, 0);
      const config = {
        animationType: AnimationType.CROSS,
        currentStance: TrigramStance.GEON,
        direction: zeroVector,
        animationDuration: 0.3,
      };

      const result = physics.calculateAttackMovement(config);

      // Displacement with zero direction should result in zero movement
      expect(result.displacement.length()).toBe(0);
      expect(result.displacement.x).toBe(0);
      expect(result.displacement.y).toBe(0);
      expect(result.displacement.z).toBe(0);
    });

    it("should handle very small direction vectors", () => {
      const tinyVector = new THREE.Vector3(0.0001, 0, 0).normalize();
      const config = {
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        direction: tinyVector,
        animationDuration: 0.25,
      };

      const result = physics.calculateAttackMovement(config);

      // Should still work with tiny normalized vectors
      expect(result.displacement.length()).toBeCloseTo(0.3 * 1.3, 2);
    });

    it("should handle upward direction vectors", () => {
      const upwardVector = new THREE.Vector3(0, 1, 0).normalize();
      const config = {
        animationType: AnimationType.UPPERCUT,
        currentStance: TrigramStance.GEON,
        direction: upwardVector,
        animationDuration: 0.3,
      };

      const result = physics.calculateAttackMovement(config);

      // Should apply vertical displacement
      expect(result.displacement.y).toBeCloseTo(0.4 * 1.3, 2); // 0.4m * 1.3 Geon
      expect(result.displacement.x).toBeCloseTo(0, 2);
      expect(result.displacement.z).toBeCloseTo(0, 2);
    });

    it("should handle 3D diagonal directions correctly", () => {
      const diagonal3D = new THREE.Vector3(1, 1, 1).normalize();
      const config = {
        animationType: AnimationType.SPINNING_HOOK,
        currentStance: TrigramStance.JIN,
        direction: diagonal3D,
        animationDuration: 0.5,
      };

      const result = physics.calculateAttackMovement(config);

      // Total displacement: 0.8m * 1.2 (Jin) = 0.96m
      expect(result.displacement.length()).toBeCloseTo(0.96, 2);
      
      // Direction should be preserved in 3D space
      const normalized = result.displacement.clone().normalize();
      expect(normalized.x).toBeCloseTo(diagonal3D.x, 2);
      expect(normalized.y).toBeCloseTo(diagonal3D.y, 2);
      expect(normalized.z).toBeCloseTo(diagonal3D.z, 2);
    });
  });

  describe("Untested Animation Types Coverage", () => {
    it("should calculate movement for spinning techniques", () => {
      const spinningTypes = [
        AnimationType.SPINNING_HEEL_KICK,
        AnimationType.TORNADO_KICK,
        AnimationType.SPINNING_ELBOW,
        AnimationType.SPINNING_BACK_ELBOW,
      ];

      spinningTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.TAE, // Neutral
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.5,
        };

        const result = physics.calculateAttackMovement(config);
        expect(result.displacement).toBeDefined();
        expect(result.displacement.length()).toBeGreaterThan(0);
      });
    });

    it("should calculate movement for specialized strikes", () => {
      const specializedTypes = [
        AnimationType.SPEAR_HAND_STRIKE,
        AnimationType.NERVE_STRIKE,
        AnimationType.PRESSURE_POINT_STRIKE,
        AnimationType.LIGHTNING_STRIKE,
        AnimationType.HEAVEN_STRIKE,
        AnimationType.THROAT_STRIKE,
        AnimationType.EYE_GOUGE,
        AnimationType.SOLAR_PLEXUS_STRIKE,
        AnimationType.LIVER_DISRUPTION,
        AnimationType.EAR_STRIKE,
      ];

      specializedTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.LI, // Fire
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.3,
        };

        const result = physics.calculateAttackMovement(config);
        expect(result.displacement).toBeDefined();
        expect(result.displacement.length()).toBeGreaterThan(0);
      });
    });

    it("should calculate movement for grappling techniques", () => {
      const grapplingTypes = [
        AnimationType.WRIST_LOCK,
        AnimationType.ARM_BAR,
        AnimationType.SHOULDER_LOCK,
        AnimationType.HIP_THROW,
        AnimationType.LEG_REAP,
        AnimationType.SMALL_CIRCLE_LOCK,
        AnimationType.FINGER_LOCK,
        AnimationType.ELBOW_LOCK,
        AnimationType.SHOULDER_MANIPULATION,
        AnimationType.MOUNTAIN_LOCK,
        AnimationType.EARTH_EMBRACE,
        AnimationType.CAROTID_CHOKE,
      ];

      grapplingTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.GON, // Earth (grounded)
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.6,
        };

        const result = physics.calculateAttackMovement(config);
        
        // Grappling should have minimal forward movement
        expect(result.displacement).toBeDefined();
        expect(result.displacement.length()).toBeLessThan(0.1); // < 10cm
      });
    });

    it("should calculate movement for knee techniques", () => {
      const kneeTypes = [
        AnimationType.KNEE_KICK,
        AnimationType.FLYING_KNEE,
        AnimationType.CLINCH_KNEE,
        AnimationType.KIDNEY_KNEE,
        AnimationType.FEMORAL_KNEE,
      ];

      kneeTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.JIN, // Thunder
          direction: new THREE.Vector3(0, 0, 1).normalize(),
          animationDuration: 0.35,
        };

        const result = physics.calculateAttackMovement(config);
        
        // Knees should have minimal movement
        expect(result.displacement).toBeDefined();
        expect(result.displacement.length()).toBeCloseTo(0.2 * 1.2, 2); // 0.2m * 1.2 Jin
      });
    });

    it("should calculate movement for elbow techniques", () => {
      const elbowTypes = [
        AnimationType.ELBOW_UPPERCUT,
        AnimationType.TEMPLE_ELBOW,
        AnimationType.SPINAL_ELBOW,
        AnimationType.BRACHIAL_ELBOW,
      ];

      elbowTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.SON, // Wind
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.3,
        };

        const result = physics.calculateAttackMovement(config);
        
        // Elbows should have minimal movement
        expect(result.displacement).toBeDefined();
        expect(result.displacement.length()).toBeCloseTo(0.2 * 1.15, 2); // 0.2m * 1.15 Son
      });
    });

    it("should calculate movement for jump/flying attacks", () => {
      const jumpTypes = [
        AnimationType.FLYING_KICK,
        AnimationType.JUMPING_KICK,
      ];

      jumpTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.GEON, // Heaven
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.7,
        };

        const result = physics.calculateAttackMovement(config);
        
        // Jump/flying attacks should have maximum movement
        expect(result.displacement.length()).toBeGreaterThan(1.0); // > 1m
        expect(result.displacement.length()).toBeCloseTo(1.2 * 1.3, 2); // 1.2m * 1.3 Geon
      });
    });

    it("should handle rapid fire combo variations", () => {
      const comboTypes = [
        AnimationType.RAPID_BARRAGE,
        AnimationType.RHYTHMIC_STRIKES,
        AnimationType.NERVE_PARALYSIS,
      ];

      comboTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.LI, // Fire precision
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.5,
        };

        const result = physics.calculateAttackMovement(config);
        
        // Rapid strikes should have moderate jab-like movement
        expect(result.displacement.length()).toBeCloseTo(0.3 * 1.1, 2); // 0.3m * 1.1 Li
      });
    });

    it("should handle flowing techniques", () => {
      const flowingTypes = [
        AnimationType.FLOWING_CROSS,
        AnimationType.FLOWING_PUSH,
      ];

      flowingTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.GAM, // Water flow
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.4,
        };

        const result = physics.calculateAttackMovement(config);
        expect(result.displacement).toBeDefined();
      });
    });
  });

  describe("Boundary Conditions - Stance Modifiers", () => {
    it("should apply minimum stance modifier correctly (Mountain)", () => {
      const config = {
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GAN, // Mountain: 0.8x (lowest)
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.25,
      };

      const result = physics.calculateAttackMovement(config);

      // Minimum modifier: 0.3m * 0.8 = 0.24m
      expect(result.displacement.length()).toBeCloseTo(0.24, 2);
    });

    it("should apply maximum stance modifier correctly (Heaven)", () => {
      const config = {
        animationType: AnimationType.JUMPING_KICK,
        currentStance: TrigramStance.GEON, // Heaven: 1.3x (highest)
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.7,
      };

      const result = physics.calculateAttackMovement(config);

      // Maximum modifier: 1.2m * 1.3 = 1.56m
      expect(result.displacement.length()).toBeCloseTo(1.56, 2);
    });
  });

  describe("Phase Timing Edge Cases", () => {
    it("should handle time exactly at phase boundary", () => {
      const position = new THREE.Vector3(0, 0, 0);
      const result = {
        displacement: new THREE.Vector3(1, 0, 0),
        lungeDuration: 0.25,
        recoveryDuration: 0.25,
        totalDuration: 0.5,
      };

      // Exactly at lunge end / recovery start
      const atBoundary = physics.applyAttackMovement(position, result, 0.25, false);
      expect(atBoundary.x).toBeCloseTo(1.0, 1);

      // First frame of recovery
      const recoveryStart = physics.applyAttackMovement(position, result, 0.25, true);
      expect(recoveryStart.x).toBeCloseTo(1.0, 1);
    });

    it("should handle time far beyond animation duration", () => {
      const position = new THREE.Vector3(0, 0, 0);
      const result = {
        displacement: new THREE.Vector3(0.5, 0, 0),
        lungeDuration: 0.15,
        recoveryDuration: 0.15,
        totalDuration: 0.3,
      };

      // Way beyond animation duration
      const wayBeyond = physics.applyAttackMovement(position, result, 10.0, true);
      
      // Should clamp to original position (recovery complete)
      expect(wayBeyond.x).toBeCloseTo(0, 1);
    });

    it("should handle negative elapsed time", () => {
      const position = new THREE.Vector3(5, 0, 0);
      const result = {
        displacement: new THREE.Vector3(1, 0, 0),
        lungeDuration: 0.2,
        recoveryDuration: 0.2,
        totalDuration: 0.4,
      };

      // Negative time (before animation start)
      const beforeStart = physics.applyAttackMovement(position, result, -0.1, false);
      
      // With negative time, progress becomes negative, but cubic easing still applies
      // The system doesn't explicitly clamp negative times, just handles them mathematically
      expect(beforeStart).toBeDefined();
      expect(beforeStart.x).toBeLessThan(position.x); // Will be behind starting position
    });
  });

  describe("Integration Tests", () => {
    it("should maintain consistent results across multiple stance types with same attack", () => {
      const baseConfig = {
        animationType: AnimationType.ROUNDHOUSE_KICK,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.48,
        currentStance: TrigramStance.GEON,
      };

      const results = [
        physics.calculateAttackMovement({ ...baseConfig, currentStance: TrigramStance.GEON }),
        physics.calculateAttackMovement({ ...baseConfig, currentStance: TrigramStance.TAE }),
        physics.calculateAttackMovement({ ...baseConfig, currentStance: TrigramStance.GAN }),
      ];

      // All should have same timing structure
      results.forEach((result) => {
        expect(result.lungeDuration).toBe(0.24);
        expect(result.recoveryDuration).toBe(0.24);
        expect(result.totalDuration).toBe(0.48);
      });

      // But different displacement magnitudes
      expect(results[0].displacement.length()).toBeGreaterThan(results[1].displacement.length());
      expect(results[1].displacement.length()).toBeGreaterThan(results[2].displacement.length());
    });

    it("should handle backward direction vectors", () => {
      const backwardDirection = new THREE.Vector3(-1, 0, 0).normalize();
      const config = {
        animationType: AnimationType.BACK_KICK,
        currentStance: TrigramStance.GEON,
        direction: backwardDirection,
        animationDuration: 0.5,
      };

      const result = physics.calculateAttackMovement(config);

      // Should move backward (negative X)
      expect(result.displacement.x).toBeLessThan(0);
      expect(result.displacement.length()).toBeCloseTo(1.0 * 1.3, 2); // 1.0m * 1.3 Geon
    });

    it("should verify no mutation of input direction vector", () => {
      const originalDirection = new THREE.Vector3(1, 0, 0);
      const directionCopy = originalDirection.clone();

      const config = {
        animationType: AnimationType.CROSS,
        currentStance: TrigramStance.GEON,
        direction: originalDirection,
        animationDuration: 0.3,
      };

      physics.calculateAttackMovement(config);

      // Original direction should be unchanged
      expect(originalDirection.x).toBe(directionCopy.x);
      expect(originalDirection.y).toBe(directionCopy.y);
      expect(originalDirection.z).toBe(directionCopy.z);
    });
  });

  describe("Performance & Memory", () => {
    it("should handle rapid successive calculations efficiently", () => {
      const config = {
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        animationDuration: 0.25,
      };

      // Simulate 60fps updates for 1 second = 60 calls
      const startTime = performance.now();
      for (let i = 0; i < 60; i++) {
        physics.calculateAttackMovement(config);
      }
      const endTime = performance.now();

      // Should complete in < 10ms for 60 calculations
      expect(endTime - startTime).toBeLessThan(10);
    });

    it("should handle many different animation types without memory issues", () => {
      const allTypes = Object.values(AnimationType).filter(
        (v) => typeof v === "string"
      ) as AnimationType[];

      allTypes.forEach((type) => {
        const config = {
          animationType: type,
          currentStance: TrigramStance.GEON,
          direction: new THREE.Vector3(1, 0, 0).normalize(),
          animationDuration: 0.5,
        };

        const result = physics.calculateAttackMovement(config);
        expect(result).toBeDefined();
        expect(result.displacement).toBeDefined();
      });
    });
  });
});
