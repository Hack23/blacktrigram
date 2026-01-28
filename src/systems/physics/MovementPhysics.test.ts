/**
 * Unit tests for MovementPhysics system
 *
 * Tests realistic physics-based movement calculations including:
 * - Acceleration/deceleration curves
 * - Stance-based speed modifiers
 * - Foot-wide step precision
 * - Injury system integration
 */

import { asMutable } from "@/test/test-utils";
import { TrigramStance } from "@/types/common";
import * as THREE from "three";
import { beforeEach, describe, expect, it } from "vitest";
import {
  MovementInput,
  MovementPhysics,
  MovementState,
} from "./MovementPhysics";

describe("MovementPhysics", () => {
  let physics: MovementPhysics;
  let state: MovementState;

  beforeEach(() => {
    // Default 10m arena (reference size, no scaling)
    physics = new MovementPhysics(10.0);
    state = {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: 0,
      maxSpeed: 2.0,
      currentStance: TrigramStance.GEON,
      legInjuryFactor: 0,
    };
  });

  describe("Acceleration", () => {
    it("should accelerate from 0 to 6m/s in approximately 0.5 seconds", () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Simulate 0.5 seconds at 60fps (30 frames)
      const deltaTime = 1 / 60;
      const frames = 30;

      for (let i = 0; i < frames; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      // Should be close to 6m/s (within 10% tolerance)
      const speed = state.velocity.length();
      expect(speed).toBeGreaterThanOrEqual(5.4);
      expect(speed).toBeLessThanOrEqual(6.6);
    });

    it("should have correct acceleration rate (30.0 m/s²)", () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      physics.updateMovement(state, input, 0.1);

      expect(state.acceleration).toBe(30.0);
    });
  });

  describe("Deceleration", () => {
    it("should decelerate from 6m/s to 0 in approximately 0.3 seconds", () => {
      // Start with velocity at 6m/s
      state.velocity.set(0, 0, 6.0);

      const input: MovementInput = {
        forward: 0,
        lateral: 0,
        isRunning: false,
        isMoving: false,
        useTacticalSteps: false,
      };

      // Simulate 0.3 seconds at 60fps (18 frames)
      const deltaTime = 1 / 60;
      const frames = 18;

      for (let i = 0; i < frames; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      // Should be close to 0m/s (within 0.6m/s tolerance)
      const speed = state.velocity.length();
      expect(speed).toBeLessThanOrEqual(0.6);
    });

    it("should have correct deceleration rate (20.0 m/s²)", () => {
      state.velocity.set(0, 0, 6.0);

      const input: MovementInput = {
        forward: 0,
        lateral: 0,
        isRunning: false,
        isMoving: false,
        useTacticalSteps: false,
      };

      physics.updateMovement(state, input, 0.1);

      expect(state.acceleration).toBe(-20.0);
    });
  });

  describe("Movement Speeds", () => {
    it("should achieve 6m/s walking speed", () => {
      const walkSpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0);
      expect(walkSpeed).toBe(6.0);
    });

    it("should achieve 10m/s running speed", () => {
      const runSpeed = physics.getMaxSpeed(true, TrigramStance.GEON, 0);
      expect(runSpeed).toBe(10.0);
    });

    it("should have 6m/s lateral speed (matches forward speed for responsive combat)", () => {
      const input: MovementInput = {
        forward: 0,
        lateral: 1.0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Simulate acceleration to max lateral speed
      const deltaTime = 1 / 60;
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      const lateralSpeed = Math.abs(state.velocity.x);
      // Lateral speed now matches forward speed (6.0 m/s) for consistent movement
      expect(lateralSpeed).toBeGreaterThanOrEqual(5.5);
      expect(lateralSpeed).toBeLessThanOrEqual(6.5);
    });

    it("should have same speed in forward and backward directions", () => {
      // Note: Backward speed multiplier was removed for responsive gameplay
      // Contextual backward penalty should be applied by combat system based on facing
      const forwardInput: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      const backwardInput: MovementInput = {
        forward: -1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Test forward speed (deep clone state to avoid shared Vector3 references)
      const forwardState = {
        position: state.position.clone(),
        velocity: new THREE.Vector3(),
        acceleration: state.acceleration,
        maxSpeed: state.maxSpeed,
        currentStance: state.currentStance,
        legInjuryFactor: state.legInjuryFactor,
      };
      const deltaTime = 1 / 60;
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(forwardState, forwardInput, deltaTime);
      }
      const forwardSpeed = Math.abs(forwardState.velocity.z);

      // Test backward speed (deep clone state to avoid shared Vector3 references)
      const backwardState = {
        position: state.position.clone(),
        velocity: new THREE.Vector3(),
        acceleration: state.acceleration,
        maxSpeed: state.maxSpeed,
        currentStance: state.currentStance,
        legInjuryFactor: state.legInjuryFactor,
      };
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(backwardState, backwardInput, deltaTime);
      }
      const backwardSpeed = Math.abs(backwardState.velocity.z);

      // Forward and backward should have same speed (no backward penalty in raw physics)
      const ratio = backwardSpeed / forwardSpeed;
      expect(ratio).toBeGreaterThanOrEqual(0.95);
      expect(ratio).toBeLessThanOrEqual(1.05);
    });
  });

  describe("Stance Speed Modifiers", () => {
    it("should have 100% speed for Geon (Heaven) stance", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GEON);
      expect(modifier).toBe(1.0);
    });

    it("should have 110% speed for Tae (Lake) stance", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.TAE);
      expect(modifier).toBe(1.1);
    });

    it("should have 120% speed for Li (Fire) stance", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.LI);
      expect(modifier).toBe(1.2);
    });

    it("should have 115% speed for Jin (Thunder) stance", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.JIN);
      expect(modifier).toBe(1.15);
    });

    it("should have 125% speed for Son (Wind) stance - fastest", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.SON);
      expect(modifier).toBe(1.25);
    });

    it("should have 105% speed for Gam (Water) stance", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GAM);
      expect(modifier).toBe(1.05);
    });

    it("should have 80% speed for Gan (Mountain) stance - defensive", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GAN);
      expect(modifier).toBe(0.8);
    });

    it("should have 85% speed for Gon (Earth) stance - grounded", () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GON);
      expect(modifier).toBe(0.85);
    });

    it("should apply stance modifier to movement speed", () => {
      asMutable(state).currentStance = TrigramStance.SON; // Wind: 125% speed

      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Simulate acceleration
      const deltaTime = 1 / 60;
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      // Max speed should be 6.0 * 1.25 = 7.5 m/s
      expect(state.maxSpeed).toBe(7.5);
      const speed = state.velocity.length();
      expect(speed).toBeGreaterThanOrEqual(7.0);
      expect(speed).toBeLessThanOrEqual(8.0);
    });
  });

  describe("Tactical Step Precision", () => {
    it("should quantize movement to 30cm grid when tactical steps enabled", () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: true,
      };

      // Move for a few frames
      const deltaTime = 1 / 60;
      for (let i = 0; i < 10; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      // Position should be a multiple of 0.3 meters
      const zPos = state.position.z;
      const remainder = Math.abs(zPos % 0.3);
      expect(remainder).toBeLessThan(0.01); // Small tolerance for floating point
    });

    it("should have step size of 0.3 meters (30cm)", () => {
      const stepSize = physics.getStepSize();
      expect(stepSize).toBe(0.3);
    });

    it("should allow smooth movement when tactical steps disabled", () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Move for a few frames
      const deltaTime = 1 / 60;
      for (let i = 0; i < 10; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      // Position should NOT be quantized
      const zPos = state.position.z;
      expect(zPos).toBeGreaterThan(0);
      // Not necessarily a multiple of 0.3
    });
  });

  describe("Injury System Integration", () => {
    it("should reduce speed by up to 50% with full leg injury", () => {
      const healthySpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0);
      const injuredSpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 1.0);

      expect(injuredSpeed).toBe(healthySpeed * 0.5);
      expect(injuredSpeed).toBe(3.0); // 6.0 * 0.5
    });

    it("should calculate injury penalty from leg health percentage", () => {
      // 100% health = 0% penalty
      expect(physics.calculateInjuryPenalty(1.0)).toBe(0);

      // 50% health = 50% penalty
      expect(physics.calculateInjuryPenalty(0.5)).toBe(0.5);

      // 0% health = 100% penalty
      expect(physics.calculateInjuryPenalty(0.0)).toBe(1.0);
    });

    it("should apply injury penalty to movement", () => {
      state.legInjuryFactor = 0.5; // 50% injury

      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Simulate acceleration
      const deltaTime = 1 / 60;
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(state, input, deltaTime);
      }

      // Max speed should be reduced by 25% (50% injury * 50% max penalty)
      const expectedSpeed = 6.0 * 0.75; // 4.5 m/s
      expect(state.maxSpeed).toBe(expectedSpeed);
    });

    it("should combine stance modifier and injury penalty", () => {
      asMutable(state).currentStance = TrigramStance.SON; // 125% speed
      state.legInjuryFactor = 0.5; // 50% injury (25% penalty)

      const speed = physics.getMaxSpeed(
        false,
        state.currentStance,
        state.legInjuryFactor,
      );

      // 6.0 * 1.25 * 0.75 = 5.625 m/s
      expect(speed).toBe(5.625);
    });
  });

  describe("Physics Calculations", () => {
    it("should calculate acceleration time correctly", () => {
      // Time to go from 0 to 6m/s at 30.0 m/s²
      const time = physics.getAccelerationTime(0, 6.0);
      expect(time).toBe(0.2);
    });

    it("should calculate stopping distance correctly", () => {
      // Distance to stop from 6m/s with 20.0 m/s² deceleration
      // d = v² / (2a) = 36 / 40 = 0.9 meters
      const distance = physics.getStoppingDistance(6.0);
      expect(distance).toBeGreaterThanOrEqual(0.85);
      expect(distance).toBeLessThanOrEqual(0.95);
    });
  });

  describe("Position Updates", () => {
    it("should update position based on velocity and deltaTime", () => {
      state.velocity.set(0, 0, 6.0); // 6m/s forward

      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      const deltaTime = 0.1; // 100ms
      physics.updateMovement(state, input, deltaTime);

      // Should move approximately 0.6 meters (6m/s * 0.1s)
      expect(state.position.z).toBeGreaterThanOrEqual(0.55);
      expect(state.position.z).toBeLessThanOrEqual(0.65);
    });

    it("should maintain position at origin when not moving", () => {
      const input: MovementInput = {
        forward: 0,
        lateral: 0,
        isRunning: false,
        isMoving: false,
        useTacticalSteps: false,
      };

      physics.updateMovement(state, input, 1 / 60);

      expect(state.position.x).toBe(0);
      expect(state.position.y).toBe(0);
      expect(state.position.z).toBe(0);
    });
  });

  describe("Korean Terminology", () => {
    it("should support Korean terms for movement (이동속도)", () => {
      // Test that the system works with stance names
      const stances = [
        TrigramStance.GEON, // 건 (Heaven)
        TrigramStance.TAE, // 태 (Lake)
        TrigramStance.LI, // 리 (Fire)
        TrigramStance.JIN, // 진 (Thunder)
        TrigramStance.SON, // 손 (Wind)
        TrigramStance.GAM, // 감 (Water)
        TrigramStance.GAN, // 간 (Mountain)
        TrigramStance.GON, // 곤 (Earth)
      ];

      stances.forEach((stance) => {
        const modifier = physics.getStanceSpeedModifier(stance);
        expect(modifier).toBeGreaterThan(0);
        expect(modifier).toBeLessThanOrEqual(1.25);
      });
    });
  });

  describe("Arena-Aware Speed Scaling", () => {
    it("should have 1.0x speed for 10m reference arena", () => {
      const physics10m = new MovementPhysics(10.0);
      expect(physics10m.getArenaSpeedScale()).toBe(1.0);
      expect(physics10m.getArenaWidth()).toBe(10.0);
    });

    it("should have 0.7x speed for 6m small arena (clamped)", () => {
      const physics6m = new MovementPhysics(6.0);
      expect(physics6m.getArenaSpeedScale()).toBe(0.7);
      expect(physics6m.getArenaWidth()).toBe(6.0);
    });

    it("should have 0.8x speed for 8m medium arena", () => {
      const physics8m = new MovementPhysics(8.0);
      expect(physics8m.getArenaSpeedScale()).toBe(0.8);
    });

    it("should have 1.2x speed for 12m large arena", () => {
      const physics12m = new MovementPhysics(12.0);
      expect(physics12m.getArenaSpeedScale()).toBe(1.2);
    });

    it("should have 1.3x speed for 14m ultra arena (clamped)", () => {
      const physics14m = new MovementPhysics(14.0);
      expect(physics14m.getArenaSpeedScale()).toBe(1.3);
      expect(physics14m.getArenaWidth()).toBe(14.0);
    });

    it("should scale walking speed proportionally to arena size", () => {
      // 6m arena: 6.0 m/s * 0.7 = 4.2 m/s
      const physics6m = new MovementPhysics(6.0);
      const speed6m = physics6m.getMaxSpeed(false, TrigramStance.GEON, 0);
      expect(speed6m).toBeCloseTo(4.2, 1);

      // 10m arena: 6.0 m/s * 1.0 = 6.0 m/s
      const physics10m = new MovementPhysics(10.0);
      const speed10m = physics10m.getMaxSpeed(false, TrigramStance.GEON, 0);
      expect(speed10m).toBe(6.0);

      // 14m arena: 6.0 m/s * 1.3 = 7.8 m/s
      const physics14m = new MovementPhysics(14.0);
      const speed14m = physics14m.getMaxSpeed(false, TrigramStance.GEON, 0);
      expect(speed14m).toBeCloseTo(7.8, 1);
    });

    it("should scale running speed proportionally to arena size", () => {
      // 6m arena: 10.0 m/s * 0.7 = 7.0 m/s
      const physics6m = new MovementPhysics(6.0);
      const speed6m = physics6m.getMaxSpeed(true, TrigramStance.GEON, 0);
      expect(speed6m).toBeCloseTo(7.0, 1);

      // 10m arena: 10.0 m/s * 1.0 = 10.0 m/s
      const physics10m = new MovementPhysics(10.0);
      const speed10m = physics10m.getMaxSpeed(true, TrigramStance.GEON, 0);
      expect(speed10m).toBe(10.0);

      // 14m arena: 10.0 m/s * 1.3 = 13.0 m/s
      const physics14m = new MovementPhysics(14.0);
      const speed14m = physics14m.getMaxSpeed(true, TrigramStance.GEON, 0);
      expect(speed14m).toBeCloseTo(13.0, 1);
    });

    it("should combine arena scaling with stance modifiers", () => {
      // 14m arena * 1.3 arena scale * 1.25 wind stance = 6.0 * 1.3 * 1.25 = 9.75 m/s
      const physics14m = new MovementPhysics(14.0);
      const speed = physics14m.getMaxSpeed(false, TrigramStance.SON, 0);
      expect(speed).toBeCloseTo(9.75, 1);
    });

    it("should combine arena scaling with injury penalties", () => {
      // 6m arena * 0.7 arena scale * 0.75 injury = 6.0 * 0.7 * 0.75 = 3.15 m/s
      const physics6m = new MovementPhysics(6.0);
      const speed = physics6m.getMaxSpeed(false, TrigramStance.GEON, 0.5);
      expect(speed).toBeCloseTo(3.15, 1);
    });

    it("should allow updating arena width dynamically", () => {
      const physics = new MovementPhysics(10.0);
      expect(physics.getArenaSpeedScale()).toBe(1.0);

      physics.setArenaWidth(6.0);
      expect(physics.getArenaWidth()).toBe(6.0);
      expect(physics.getArenaSpeedScale()).toBe(0.7);

      physics.setArenaWidth(14.0);
      expect(physics.getArenaWidth()).toBe(14.0);
      expect(physics.getArenaSpeedScale()).toBe(1.3);
    });

    it("should apply arena scaling during movement updates", () => {
      const physics6m = new MovementPhysics(6.0);
      const state6m: MovementState = {
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance: TrigramStance.GEON,
        legInjuryFactor: 0,
      };

      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Simulate acceleration for 6m arena
      const deltaTime = 1 / 60;
      for (let i = 0; i < 60; i++) {
        physics6m.updateMovement(state6m, input, deltaTime);
      }

      // Max speed should be scaled: 6.0 * 0.7 = 4.2 m/s
      expect(state6m.maxSpeed).toBeCloseTo(4.2, 1);
      const speed = state6m.velocity.length();
      expect(speed).toBeGreaterThanOrEqual(3.8);
      expect(speed).toBeLessThanOrEqual(4.6);
    });

    it("should maintain traversal time consistency across arena sizes", () => {
      // Goal: Time to cross arena should be similar across sizes
      // 6m arena at 4.2 m/s: ~1.43 seconds
      // 10m arena at 6.0 m/s: ~1.67 seconds
      // 14m arena at 7.8 m/s: ~1.79 seconds
      // This creates slightly faster pacing on smaller screens (more arcade-like)

      const physics6m = new MovementPhysics(6.0);
      const walkSpeed6m = physics6m.getMaxSpeed(false, TrigramStance.GEON, 0);
      const traversalTime6m = 6.0 / walkSpeed6m;
      expect(traversalTime6m).toBeCloseTo(1.43, 1);

      const physics10m = new MovementPhysics(10.0);
      const walkSpeed10m = physics10m.getMaxSpeed(false, TrigramStance.GEON, 0);
      const traversalTime10m = 10.0 / walkSpeed10m;
      expect(traversalTime10m).toBeCloseTo(1.67, 1);

      const physics14m = new MovementPhysics(14.0);
      const walkSpeed14m = physics14m.getMaxSpeed(false, TrigramStance.GEON, 0);
      const traversalTime14m = 14.0 / walkSpeed14m;
      expect(traversalTime14m).toBeCloseTo(1.79, 1);
    });

    describe("Edge Cases and Validation", () => {
      it("should throw error for negative arena width in constructor", () => {
        expect(() => new MovementPhysics(-5.0)).toThrow(
          "Arena width must be a positive finite number"
        );
      });

      it("should throw error for zero arena width in constructor", () => {
        expect(() => new MovementPhysics(0)).toThrow(
          "Arena width must be a positive finite number"
        );
      });

      it("should throw error for NaN arena width in constructor", () => {
        expect(() => new MovementPhysics(NaN)).toThrow(
          "Arena width must be a positive finite number"
        );
      });

      it("should throw error for Infinity arena width in constructor", () => {
        expect(() => new MovementPhysics(Infinity)).toThrow(
          "Arena width must be a positive finite number"
        );
      });

      it("should throw error for negative arena width in setArenaWidth", () => {
        const physics = new MovementPhysics(10.0);
        expect(() => physics.setArenaWidth(-5.0)).toThrow(
          "Arena width must be a positive finite number"
        );
      });

      it("should throw error for zero arena width in setArenaWidth", () => {
        const physics = new MovementPhysics(10.0);
        expect(() => physics.setArenaWidth(0)).toThrow(
          "Arena width must be a positive finite number"
        );
      });

      it("should clamp very small arena width to 0.7x scale", () => {
        // 0.1m arena: rawScale = 0.01, clamped to 0.7
        const physics = new MovementPhysics(0.1);
        expect(physics.getArenaSpeedScale()).toBe(0.7);
      });

      it("should clamp very large arena width to 1.3x scale", () => {
        // 1000m arena: rawScale = 100, clamped to 1.3
        const physics = new MovementPhysics(1000.0);
        expect(physics.getArenaSpeedScale()).toBe(1.3);
      });

      it("should handle very small positive arena width", () => {
        const physics = new MovementPhysics(1.0);
        // 1m arena: rawScale = 0.1, clamped to 0.7
        expect(physics.getArenaSpeedScale()).toBe(0.7);
        expect(physics.getArenaWidth()).toBe(1.0);
      });

      it("should handle very large arena width", () => {
        const physics = new MovementPhysics(100.0);
        // 100m arena: rawScale = 10, clamped to 1.3
        expect(physics.getArenaSpeedScale()).toBe(1.3);
        expect(physics.getArenaWidth()).toBe(100.0);
      });

      it("should cache arena speed scale for performance", () => {
        const physics = new MovementPhysics(12.0);
        const scale1 = physics.getArenaSpeedScale();
        const scale2 = physics.getArenaSpeedScale();
        // Both calls should return the same cached value
        expect(scale1).toBe(scale2);
        expect(scale1).toBe(1.2);
      });

      it("should update cached scale when setArenaWidth is called", () => {
        const physics = new MovementPhysics(10.0);
        expect(physics.getArenaSpeedScale()).toBe(1.0);

        physics.setArenaWidth(14.0);
        expect(physics.getArenaSpeedScale()).toBe(1.3);

        physics.setArenaWidth(6.0);
        expect(physics.getArenaSpeedScale()).toBe(0.7);
      });
    });
  });
});
