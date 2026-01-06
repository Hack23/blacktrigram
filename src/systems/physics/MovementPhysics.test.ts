/**
 * Unit tests for MovementPhysics system
 * 
 * Tests realistic physics-based movement calculations including:
 * - Acceleration/deceleration curves
 * - Stance-based speed modifiers
 * - Foot-wide step precision
 * - Injury system integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { MovementPhysics, MovementState, MovementInput } from './MovementPhysics';
import { TrigramStance } from '@/types/common';

describe('MovementPhysics', () => {
  let physics: MovementPhysics;
  let state: MovementState;

  beforeEach(() => {
    physics = new MovementPhysics();
    state = {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: 0,
      maxSpeed: 2.0,
      currentStance: TrigramStance.GEON,
      legInjuryFactor: 0,
    };
  });

  describe('Acceleration', () => {
    it('should accelerate from 0 to 2m/s in approximately 0.5 seconds', () => {
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

      // Should be close to 2m/s (within 10% tolerance)
      const speed = state.velocity.length();
      expect(speed).toBeGreaterThanOrEqual(1.8);
      expect(speed).toBeLessThanOrEqual(2.2);
    });

    it('should have correct acceleration rate (4.0 m/s²)', () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      physics.updateMovement(state, input, 0.1);
      
      expect(state.acceleration).toBe(4.0);
    });
  });

  describe('Deceleration', () => {
    it('should decelerate from 2m/s to 0 in approximately 0.3 seconds', () => {
      // Start with velocity at 2m/s
      state.velocity.set(0, 0, 2.0);

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

      // Should be close to 0m/s (within 0.2m/s tolerance)
      const speed = state.velocity.length();
      expect(speed).toBeLessThanOrEqual(0.2);
    });

    it('should have correct deceleration rate (6.67 m/s²)', () => {
      state.velocity.set(0, 0, 2.0);

      const input: MovementInput = {
        forward: 0,
        lateral: 0,
        isRunning: false,
        isMoving: false,
        useTacticalSteps: false,
      };

      physics.updateMovement(state, input, 0.1);
      
      expect(state.acceleration).toBe(-6.67);
    });
  });

  describe('Movement Speeds', () => {
    it('should achieve 2m/s walking speed', () => {
      const walkSpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0);
      expect(walkSpeed).toBe(2.0);
    });

    it('should achieve 4m/s running speed', () => {
      const runSpeed = physics.getMaxSpeed(true, TrigramStance.GEON, 0);
      expect(runSpeed).toBe(4.0);
    });

    it('should have 1.8m/s lateral speed', () => {
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
      expect(lateralSpeed).toBeGreaterThanOrEqual(1.6);
      expect(lateralSpeed).toBeLessThanOrEqual(2.0);
    });

    it('should be 25% slower when moving backward', () => {
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

      // Test forward speed
      const forwardState = { ...state, velocity: new THREE.Vector3() };
      const deltaTime = 1 / 60;
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(forwardState, forwardInput, deltaTime);
      }
      const forwardSpeed = Math.abs(forwardState.velocity.z);

      // Test backward speed
      const backwardState = { ...state, velocity: new THREE.Vector3() };
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(backwardState, backwardInput, deltaTime);
      }
      const backwardSpeed = Math.abs(backwardState.velocity.z);

      // Backward should be approximately 75% of forward speed
      const ratio = backwardSpeed / forwardSpeed;
      expect(ratio).toBeGreaterThanOrEqual(0.7);
      expect(ratio).toBeLessThanOrEqual(0.8);
    });
  });

  describe('Stance Speed Modifiers', () => {
    it('should have 100% speed for Geon (Heaven) stance', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GEON);
      expect(modifier).toBe(1.00);
    });

    it('should have 110% speed for Tae (Lake) stance', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.TAE);
      expect(modifier).toBe(1.10);
    });

    it('should have 120% speed for Li (Fire) stance', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.LI);
      expect(modifier).toBe(1.20);
    });

    it('should have 115% speed for Jin (Thunder) stance', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.JIN);
      expect(modifier).toBe(1.15);
    });

    it('should have 125% speed for Son (Wind) stance - fastest', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.SON);
      expect(modifier).toBe(1.25);
    });

    it('should have 105% speed for Gam (Water) stance', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GAM);
      expect(modifier).toBe(1.05);
    });

    it('should have 80% speed for Gan (Mountain) stance - defensive', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GAN);
      expect(modifier).toBe(0.80);
    });

    it('should have 85% speed for Gon (Earth) stance - grounded', () => {
      const modifier = physics.getStanceSpeedModifier(TrigramStance.GON);
      expect(modifier).toBe(0.85);
    });

    it('should apply stance modifier to movement speed', () => {
      state.currentStance = TrigramStance.SON; // Wind: 125% speed

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

      // Max speed should be 2.0 * 1.25 = 2.5 m/s
      expect(state.maxSpeed).toBe(2.5);
      const speed = state.velocity.length();
      expect(speed).toBeGreaterThanOrEqual(2.3);
      expect(speed).toBeLessThanOrEqual(2.7);
    });
  });

  describe('Tactical Step Precision', () => {
    it('should quantize movement to 30cm grid when tactical steps enabled', () => {
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

    it('should have step size of 0.3 meters (30cm)', () => {
      const stepSize = physics.getStepSize();
      expect(stepSize).toBe(0.3);
    });

    it('should allow smooth movement when tactical steps disabled', () => {
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

  describe('Injury System Integration', () => {
    it('should reduce speed by up to 50% with full leg injury', () => {
      const healthySpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0);
      const injuredSpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 1.0);
      
      expect(injuredSpeed).toBe(healthySpeed * 0.5);
      expect(injuredSpeed).toBe(1.0); // 2.0 * 0.5
    });

    it('should calculate injury penalty from leg health percentage', () => {
      // 100% health = 0% penalty
      expect(physics.calculateInjuryPenalty(1.0)).toBe(0);
      
      // 50% health = 50% penalty
      expect(physics.calculateInjuryPenalty(0.5)).toBe(0.5);
      
      // 0% health = 100% penalty
      expect(physics.calculateInjuryPenalty(0.0)).toBe(1.0);
    });

    it('should apply injury penalty to movement', () => {
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
      const expectedSpeed = 2.0 * 0.75; // 1.5 m/s
      expect(state.maxSpeed).toBe(expectedSpeed);
    });

    it('should combine stance modifier and injury penalty', () => {
      state.currentStance = TrigramStance.SON; // 125% speed
      state.legInjuryFactor = 0.5; // 50% injury (25% penalty)

      const speed = physics.getMaxSpeed(false, state.currentStance, state.legInjuryFactor);
      
      // 2.0 * 1.25 * 0.75 = 1.875 m/s
      expect(speed).toBe(1.875);
    });
  });

  describe('Physics Calculations', () => {
    it('should calculate acceleration time correctly', () => {
      // Time to go from 0 to 2m/s at 4.0 m/s²
      const time = physics.getAccelerationTime(0, 2.0);
      expect(time).toBe(0.5);
    });

    it('should calculate stopping distance correctly', () => {
      // Distance to stop from 2m/s with 6.67 m/s² deceleration
      // d = v² / (2a) = 4 / 13.34 ≈ 0.3 meters
      const distance = physics.getStoppingDistance(2.0);
      expect(distance).toBeGreaterThanOrEqual(0.29);
      expect(distance).toBeLessThanOrEqual(0.31);
    });
  });

  describe('Position Updates', () => {
    it('should update position based on velocity and deltaTime', () => {
      state.velocity.set(0, 0, 2.0); // 2m/s forward

      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      const deltaTime = 0.1; // 100ms
      physics.updateMovement(state, input, deltaTime);

      // Should move approximately 0.2 meters (2m/s * 0.1s)
      expect(state.position.z).toBeGreaterThanOrEqual(0.15);
      expect(state.position.z).toBeLessThanOrEqual(0.25);
    });

    it('should maintain position at origin when not moving', () => {
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

  describe('Korean Terminology', () => {
    it('should support Korean terms for movement (이동속도)', () => {
      // Test that the system works with stance names
      const stances = [
        TrigramStance.GEON, // 건 (Heaven)
        TrigramStance.TAE,  // 태 (Lake)
        TrigramStance.LI,   // 리 (Fire)
        TrigramStance.JIN,  // 진 (Thunder)
        TrigramStance.SON,  // 손 (Wind)
        TrigramStance.GAM,  // 감 (Water)
        TrigramStance.GAN,  // 간 (Mountain)
        TrigramStance.GON,  // 곤 (Earth)
      ];

      stances.forEach(stance => {
        const modifier = physics.getStanceSpeedModifier(stance);
        expect(modifier).toBeGreaterThan(0);
        expect(modifier).toBeLessThanOrEqual(1.25);
      });
    });
  });
});
