/**
 * Performance test for arena bounds validation
 * 
 * Verifies that bounds checking adds <0.5ms overhead per frame
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { MovementPhysics, MovementInput, MovementState } from './MovementPhysics';
import { TrigramStance } from '@/types/common';
import { ArenaBounds } from '@/types/PhysicsTypes';

describe('Arena Bounds - Performance Tests', () => {
  it('should complete bounds checking in <0.5ms per frame', () => {
    const physics = new MovementPhysics();
    
    const bounds: ArenaBounds = {
      minX: -4.7,
      maxX: 4.7,
      minZ: -3.45,
      maxZ: 3.45,
      centerX: 0,
      centerZ: 0,
      widthMeters: 10,
      depthMeters: 7.5,
    };

    const state: MovementState = {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: 0,
      maxSpeed: 6.0,
      currentStance: TrigramStance.GEON,
      legInjuryFactor: 0,
    };

    const input: MovementInput = {
      forward: 1.0,
      lateral: 1.0,
      isRunning: true,
      isMoving: true,
      useTacticalSteps: false,
    };

    const iterations = 1000;
    const deltaTime = 1 / 60; // 60fps

    // Warm up
    for (let i = 0; i < 100; i++) {
      physics.updateMovement(state, input, deltaTime, bounds);
    }

    // Measure performance with bounds
    const startWithBounds = performance.now();
    for (let i = 0; i < iterations; i++) {
      physics.updateMovement(state, input, deltaTime, bounds);
    }
    const endWithBounds = performance.now();
    const timeWithBounds = endWithBounds - startWithBounds;
    const avgTimeWithBounds = timeWithBounds / iterations;

    // Reset state
    state.position.set(0, 0, 0);
    state.velocity.set(0, 0, 0);

    // Measure performance without bounds (baseline)
    const startWithoutBounds = performance.now();
    for (let i = 0; i < iterations; i++) {
      physics.updateMovement(state, input, deltaTime);
    }
    const endWithoutBounds = performance.now();
    const timeWithoutBounds = endWithoutBounds - startWithoutBounds;
    const avgTimeWithoutBounds = timeWithoutBounds / iterations;

    const overhead = avgTimeWithBounds - avgTimeWithoutBounds;

    console.log(`Performance results (${iterations} iterations):`);
    console.log(`  Without bounds: ${avgTimeWithoutBounds.toFixed(4)}ms per frame`);
    console.log(`  With bounds:    ${avgTimeWithBounds.toFixed(4)}ms per frame`);
    console.log(`  Overhead:       ${overhead.toFixed(4)}ms per frame`);

    // Should add less than 0.5ms overhead
    expect(overhead).toBeLessThan(0.5);
  });

  it('should handle boundary collisions efficiently', () => {
    const physics = new MovementPhysics();
    
    const bounds: ArenaBounds = {
      minX: -4.7,
      maxX: 4.7,
      minZ: -3.45,
      maxZ: 3.45,
      centerX: 0,
      centerZ: 0,
      widthMeters: 10,
      depthMeters: 7.5,
    };

    const state: MovementState = {
      position: new THREE.Vector3(4.5, 0, 0), // Near boundary
      velocity: new THREE.Vector3(2, 0, 0), // Moving toward boundary
      acceleration: 0,
      maxSpeed: 6.0,
      currentStance: TrigramStance.GEON,
      legInjuryFactor: 0,
    };

    const input: MovementInput = {
      forward: 0,
      lateral: 1.0,
      isRunning: true,
      isMoving: true,
      useTacticalSteps: false,
    };

    const iterations = 100;
    const deltaTime = 1 / 60;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      physics.updateMovement(state, input, deltaTime, bounds);
    }
    const end = performance.now();
    const avgTime = (end - start) / iterations;

    console.log(`Boundary collision handling: ${avgTime.toFixed(4)}ms per frame`);

    // Should still be very fast even at boundaries
    expect(avgTime).toBeLessThan(1.0);
  });

  it('should handle corner collisions efficiently', () => {
    const physics = new MovementPhysics();
    
    const bounds: ArenaBounds = {
      minX: -4.7,
      maxX: 4.7,
      minZ: -3.45,
      maxZ: 3.45,
      centerX: 0,
      centerZ: 0,
      widthMeters: 10,
      depthMeters: 7.5,
    };

    const state: MovementState = {
      position: new THREE.Vector3(4.5, 0, 3.2), // Near corner
      velocity: new THREE.Vector3(2, 0, 2), // Moving toward corner
      acceleration: 0,
      maxSpeed: 6.0,
      currentStance: TrigramStance.GEON,
      legInjuryFactor: 0,
    };

    const input: MovementInput = {
      forward: 1.0,
      lateral: 1.0,
      isRunning: true,
      isMoving: true,
      useTacticalSteps: false,
    };

    const iterations = 100;
    const deltaTime = 1 / 60;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      physics.updateMovement(state, input, deltaTime, bounds);
    }
    const end = performance.now();
    const avgTime = (end - start) / iterations;

    console.log(`Corner collision handling: ${avgTime.toFixed(4)}ms per frame`);

    // Corner collisions should also be very fast
    expect(avgTime).toBeLessThan(1.0);
  });
});
