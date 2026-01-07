/**
 * Combat Physics Performance Benchmarks
 * 
 * Performance benchmarks for physics systems targeting 60fps (16.67ms per frame).
 * 
 * **Budget Allocation** (per frame):
 * - Physics: <5.0ms (30% of frame budget)
 * - Rendering: <8.0ms (48% of frame budget)
 * - Game logic: <3.67ms (22% of frame budget)
 * 
 * Run with: `npm run test:ai-performance`
 * 
 * @module systems/physics/__tests__/PhysicsPerformance
 */

import { bench, describe } from 'vitest';
import * as THREE from 'three';
import { MovementPhysics, MovementState, MovementInput } from '../MovementPhysics';
import { SpeedModifierSystem, MovementType } from '../SpeedModifierSystem';
import KnockbackPhysics, { KnockbackConfig } from '../KnockbackPhysics';
import { CollisionDetection } from '../CollisionDetection';
import { TrigramStance, CombatState } from '@/types/common';
import type { PlayerState } from '@/systems/player';
import type { Position3D } from '@/types/physics';

describe('PhysicsPerformance - 60fps Validation', () => {
  describe('MovementPhysics Performance', () => {
    bench('Single player movement update', () => {
      const physics = new MovementPhysics();
      const state: MovementState = {
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
      
      physics.updateMovement(state, input, 1/60);
    }, { time: 1000, iterations: 10000 });

    bench('Two players movement update', () => {
      const physics = new MovementPhysics();
      const player1: MovementState = {
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance: TrigramStance.GEON,
        legInjuryFactor: 0,
      };
      const player2: MovementState = {
        position: new THREE.Vector3(0, 0, 5),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance: TrigramStance.SON,
        legInjuryFactor: 0,
      };
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };
      
      physics.updateMovement(player1, input, 1/60);
      physics.updateMovement(player2, input, 1/60);
    }, { time: 1000, iterations: 10000 });

    bench('Four players movement update', () => {
      const physics = new MovementPhysics();
      const players: MovementState[] = [
        {
          position: new THREE.Vector3(0, 0, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: 0,
          maxSpeed: 2.0,
          currentStance: TrigramStance.GEON,
          legInjuryFactor: 0,
        },
        {
          position: new THREE.Vector3(0, 0, 5),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: 0,
          maxSpeed: 2.0,
          currentStance: TrigramStance.SON,
          legInjuryFactor: 0,
        },
        {
          position: new THREE.Vector3(5, 0, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: 0,
          maxSpeed: 2.0,
          currentStance: TrigramStance.LI,
          legInjuryFactor: 0,
        },
        {
          position: new THREE.Vector3(5, 0, 5),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: 0,
          maxSpeed: 2.0,
          currentStance: TrigramStance.GAN,
          legInjuryFactor: 0,
        },
      ];
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0.5,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };
      
      players.forEach(player => physics.updateMovement(player, input, 1/60));
    }, { time: 1000, iterations: 5000 });
  });

  describe('KnockbackPhysics Performance', () => {
    bench('Single knockback calculation', () => {
      const physics = new KnockbackPhysics();
      const config: KnockbackConfig = {
        force: 800,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        duration: 0.8,
        balanceState: { current: 70, max: 100 },
        currentStance: TrigramStance.GAM,
      };
      
      physics.calculateKnockback(config, 80);
    }, { time: 1000, iterations: 10000 });

    bench('Knockback with animation application', () => {
      const physics = new KnockbackPhysics();
      const config: KnockbackConfig = {
        force: 800,
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        duration: 0.8,
        balanceState: { current: 70, max: 100 },
        currentStance: TrigramStance.GAM,
      };
      
      const result = physics.calculateKnockback(config, 80);
      const originalPos = new THREE.Vector3(0, 0, 0);
      physics.applyKnockbackForce(originalPos, result, 1/60, 0.5);
    }, { time: 1000, iterations: 10000 });
  });

  describe('CollisionDetection Performance', () => {
    bench('Single collision check', () => {
      const collision = new CollisionDetection();
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0.5, y: 0, z: 5.5 };
      
      collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: 'punch' },
        TrigramStance.GEON,
        'torso'
      );
    }, { time: 1000, iterations: 10000 });

    bench('100 collision checks (frame budget test)', () => {
      const collision = new CollisionDetection();
      
      for (let i = 0; i < 100; i++) {
        const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
        const defenderPos: Position3D = {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2,
          z: 5 + Math.random() * 2
        };
        
        collision.checkAttackHit(
          attackerPos,
          defenderPos,
          { type: i % 2 === 0 ? 'punch' : 'kick' },
          TrigramStance.GEON,
          'torso'
        );
      }
    }, { time: 1000, iterations: 100 });
  });

  describe('SpeedModifierSystem Performance', () => {
    bench('Calculate speed modifiers', () => {
      const system = new SpeedModifierSystem();
      const playerState = createBenchmarkPlayerState();
      
      system.calculateSpeedModifiers(
        playerState,
        MovementType.WALKING,
        false
      );
    }, { time: 1000, iterations: 10000 });

    bench('Calculate modifiers with injury', () => {
      const system = new SpeedModifierSystem();
      const playerState = createBenchmarkPlayerState();
      // Create a modified copy with injuries instead of mutating readonly properties
      const injuredState: PlayerState = {
        ...playerState,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 50,
          legRight: 50,
        },
      };
      
      system.calculateSpeedModifiers(
        injuredState,
        MovementType.WALKING,
        false
      );
    }, { time: 1000, iterations: 10000 });
  });

  describe('Full Frame Budget Validation', () => {
    bench('Complete physics frame (single player)', () => {
      // Simulate all physics calculations for one player in a single frame
      const movement = new MovementPhysics();
      const speedModifier = new SpeedModifierSystem();
      const knockback = new KnockbackPhysics();
      const collision = new CollisionDetection();
      
      const playerState = createBenchmarkPlayerState();
      const movementState: MovementState = {
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance: TrigramStance.GEON,
        legInjuryFactor: 0,
      };
      
      // 1. Calculate speed modifiers
      speedModifier.calculateSpeedModifiers(
        playerState,
        MovementType.WALKING,
        false
      );
      
      // 2. Update movement
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0.5,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };
      movement.updateMovement(movementState, input, 1/60);
      
      // 3. Check collision
      collision.checkAttackHit(
        { x: movementState.position.x, y: 0, z: movementState.position.z },
        { x: 0, y: 0, z: 5 },
        { type: 'punch' },
        playerState.currentStance,
        'torso'
      );
      
      // 4. Calculate knockback (simulating hit)
      const knockbackConfig: KnockbackConfig = {
        force: 600,
        direction: new THREE.Vector3(0, 0, 1).normalize(),
        duration: 0.5,
        balanceState: { current: 80, max: 100 },
        currentStance: playerState.currentStance,
      };
      knockback.calculateKnockback(knockbackConfig, 60);
    }, { time: 1000, iterations: 1000 });

    bench('Complete physics frame (two players)', () => {
      // Simulate all physics calculations for two players in a single frame
      const movement = new MovementPhysics();
      const speedModifier = new SpeedModifierSystem();
      const knockback = new KnockbackPhysics();
      const collision = new CollisionDetection();
      
      const player1State = createBenchmarkPlayerState();
      const player2State = createBenchmarkPlayerState();
      
      const movementState1: MovementState = {
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance: TrigramStance.GEON,
        legInjuryFactor: 0,
      };
      
      const movementState2: MovementState = {
        position: new THREE.Vector3(0, 0, 5),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance: TrigramStance.SON,
        legInjuryFactor: 0,
      };
      
      const input: MovementInput = {
        forward: 1.0,
        lateral: 0.5,
        isRunning: false,
        isMoving: true,
        useTacticalSteps: false,
      };
      
      // Player 1 physics
      speedModifier.calculateSpeedModifiers(player1State, MovementType.WALKING, false);
      movement.updateMovement(movementState1, input, 1/60);
      collision.checkAttackHit(
        { x: movementState1.position.x, y: 0, z: movementState1.position.z },
        { x: 0, y: 0, z: 5 },
        { type: 'punch' },
        player1State.currentStance,
        'torso'
      );
      
      // Player 2 physics
      speedModifier.calculateSpeedModifiers(player2State, MovementType.WALKING, false);
      movement.updateMovement(movementState2, input, 1/60);
      collision.checkAttackHit(
        { x: movementState2.position.x, y: 0, z: movementState2.position.z },
        { x: 0, y: 0, z: 0 },
        { type: 'punch' },
        player2State.currentStance,
        'torso'
      );
      
      // Knockback for both (simulating hits)
      const knockbackConfig: KnockbackConfig = {
        force: 600,
        direction: new THREE.Vector3(0, 0, 1).normalize(),
        duration: 0.5,
        balanceState: { current: 80, max: 100 },
        currentStance: TrigramStance.GAM,
      };
      knockback.calculateKnockback(knockbackConfig, 60);
      knockback.calculateKnockback(knockbackConfig, 60);
    }, { time: 1000, iterations: 500 });
  });
});

/**
 * Helper function to create a benchmark player state
 */
function createBenchmarkPlayerState(): PlayerState {
  return {
    id: 'benchmark-player',
    name: { korean: '벤치마크', english: 'Benchmark' },
    archetype: 'musa' as any,
    
    // Resources
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    
    // Body part health
    bodyPartHealth: {
      head: 100,
      neck: 100,
      torsoUpper: 100,
      torsoLower: 100,
      armLeft: 100,
      armRight: 100,
      legLeft: 100,
      legRight: 100,
    },
    bodyPartMaxHealth: {
      head: 100,
      neck: 100,
      torsoUpper: 100,
      torsoLower: 100,
      armLeft: 100,
      armRight: 100,
      legLeft: 100,
      legRight: 100,
    },
    
    // Combat attributes
    attackPower: 10,
    defense: 10,
    speed: 10,
    technique: 10,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    
    // Combat state
    currentStance: TrigramStance.GEON,
    combatState: CombatState.IDLE,
    position: { x: 0, y: 0 },
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    lastActionTime: 0,
    recoveryTime: 0,
    lastStanceChangeTime: 0,
    
    // Effects and vital points
    statusEffects: [],
    activeEffects: [],
    vitalPoints: [],
    
    // Statistics
    totalDamageReceived: 0,
    totalDamageDealt: 0,
    hitsTaken: 0,
    hitsLanded: 0,
    perfectStrikes: 0,
    vitalPointHits: 0,
  };
}
