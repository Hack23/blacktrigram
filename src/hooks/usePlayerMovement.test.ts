/**
 * Tests for usePlayerMovement hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { MovementPhysics, MovementState, MovementInput } from '@/systems/physics';
import { TrigramStance } from '@/types/common';

describe('usePlayerMovement Integration', () => {
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

  describe('Hook Integration with Physics Engine', () => {
    it('should integrate stance changes with physics', () => {
      // Start with Geon stance
      const geonSpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0);
      expect(geonSpeed).toBe(2.0);

      // Change to Wind stance
      const windSpeed = physics.getMaxSpeed(false, TrigramStance.SON, 0);
      expect(windSpeed).toBe(2.5); // 125% speed
    });

    it('should integrate injury with physics', () => {
      const healthySpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0);
      const injuredSpeed = physics.getMaxSpeed(false, TrigramStance.GEON, 0.5);

      expect(healthySpeed).toBe(2.0);
      expect(injuredSpeed).toBe(1.5); // 25% penalty
    });

    it('should handle forward movement', () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      // Simulate frames
      for (let i = 0; i < 30; i++) {
        physics.updateMovement(state, input, 1 / 60);
      }

      expect(state.velocity.length()).toBeGreaterThan(0);
      expect(state.position.z).toBeGreaterThan(0);
    });

    it('should handle running mode', () => {
      // Walking
      const walkInput: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      const walkState = { ...state, velocity: new THREE.Vector3() };
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(walkState, walkInput, 1 / 60);
      }
      const walkSpeed = walkState.velocity.length();

      // Running
      const runInput: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: true,
        isMoving: true,
        useTacticalSteps: false,
      };

      const runState = { ...state, velocity: new THREE.Vector3() };
      for (let i = 0; i < 60; i++) {
        physics.updateMovement(runState, runInput, 1 / 60);
      }
      const runSpeed = runState.velocity.length();

      // Running should be faster
      expect(runSpeed).toBeGreaterThan(walkSpeed);
      expect(runState.maxSpeed).toBe(4.0); // Running max speed
    });

    it('should handle stance-based speed differences', () => {
      // Geon (100% speed)
      const geonState = {
        ...state,
        currentStance: TrigramStance.GEON,
        velocity: new THREE.Vector3(),
      };
      
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      for (let i = 0; i < 60; i++) {
        physics.updateMovement(geonState, input, 1 / 60);
      }
      const geonSpeed = geonState.velocity.length();

      // Wind (125% speed)
      const windState = {
        ...state,
        currentStance: TrigramStance.SON,
        velocity: new THREE.Vector3(),
      };

      for (let i = 0; i < 60; i++) {
        physics.updateMovement(windState, input, 1 / 60);
      }
      const windSpeed = windState.velocity.length();

      // Wind should be faster
      expect(windSpeed).toBeGreaterThan(geonSpeed);
    });

    it('should handle leg injury penalties', () => {
      // Healthy player
      const healthyState = {
        ...state,
        legInjuryFactor: 0,
        velocity: new THREE.Vector3(),
      };

      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      for (let i = 0; i < 60; i++) {
        physics.updateMovement(healthyState, input, 1 / 60);
      }
      const healthySpeed = healthyState.velocity.length();

      // Injured player
      const injuredState = {
        ...state,
        legInjuryFactor: 0.5,
        velocity: new THREE.Vector3(),
      };

      for (let i = 0; i < 60; i++) {
        physics.updateMovement(injuredState, input, 1 / 60);
      }
      const injuredSpeed = injuredState.velocity.length();

      // Injured should be slower
      expect(injuredSpeed).toBeLessThan(healthySpeed);
      expect(injuredState.maxSpeed).toBe(1.5); // 25% penalty
    });

    it('should handle tactical steps', () => {
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: true,
      };

      for (let i = 0; i < 10; i++) {
        physics.updateMovement(state, input, 1 / 60);
      }

      // Position should be quantized to 0.3m steps
      const zPos = state.position.z;
      const remainder = Math.abs(zPos % 0.3);
      expect(remainder).toBeLessThan(0.01);
    });

    it('should handle stopping', () => {
      // Start moving
      const moveInput: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };

      for (let i = 0; i < 30; i++) {
        physics.updateMovement(state, moveInput, 1 / 60);
      }

      const speedWhileMoving = state.velocity.length();
      expect(speedWhileMoving).toBeGreaterThan(0);

      // Stop
      const stopInput: MovementInput = {
        forward: 0,
        lateral: 0,
        isRunning: false,
        isMoving: false,
        useTacticalSteps: false,
      };

      for (let i = 0; i < 30; i++) {
        physics.updateMovement(state, stopInput, 1 / 60);
      }

      // Should have slowed down
      expect(state.velocity.length()).toBeLessThan(speedWhileMoving);
    });
  });
});
