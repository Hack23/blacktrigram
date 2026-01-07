/**
 * Tests for Knockback Physics System
 * 
 * Validates force-based displacement calculations, stance resistance,
 * balance integration, and recovery window mechanics.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import KnockbackPhysics, {
  KnockbackConfig,
  KnockbackResult,
  BalanceState,
} from './KnockbackPhysics';
import { TrigramStance } from '@/types/common';

describe('KnockbackPhysics', () => {
  let physics: KnockbackPhysics;
  let attackDirection: THREE.Vector3;

  beforeEach(() => {
    physics = new KnockbackPhysics();
    attackDirection = new THREE.Vector3(1, 0, 0).normalize();
  });

  describe('Base Knockback Distance', () => {
    it('should calculate light strike knockback (20-40 damage)', () => {
      const config: KnockbackConfig = {
        force: 300,
        direction: attackDirection,
        duration: 0.3,
        balanceState: { current: 85, max: 100 }, // High balance (neutral)
        currentStance: TrigramStance.GAM, // Water (neutral resistance)
      };

      const result = physics.calculateKnockback(config, 30);
      
      // 0.5m base * 1.0 (neutral stance) * 0.7 (high balance) = 0.35m
      expect(result.displacement.length()).toBeCloseTo(0.35, 1);
      expect(result.shouldFall).toBe(false);
      expect(result.recoveryWindow).toBeCloseTo(0.2, 1); // Light recovery
    });

    it('should calculate medium strike knockback (40-70 damage)', () => {
      const config: KnockbackConfig = {
        force: 550,
        direction: attackDirection,
        duration: 0.5,
        balanceState: { current: 60, max: 100 }, // Medium balance (neutral)
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 55);
      
      // 1.2m base * 1.0 (neutral) * 1.0 (medium balance) = 1.2m
      expect(result.displacement.length()).toBeCloseTo(1.2, 1);
      expect(result.shouldFall).toBe(false);
      expect(result.recoveryWindow).toBeCloseTo(0.4, 1); // Medium recovery
    });

    it('should calculate heavy strike knockback (70-100 damage)', () => {
      const config: KnockbackConfig = {
        force: 850,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 50, max: 100 }, // Medium balance
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 85);
      
      // 2.5m base * 1.0 * 1.0 = 2.5m
      expect(result.displacement.length()).toBeCloseTo(2.5, 1);
      expect(result.shouldFall).toBe(false);
      expect(result.recoveryWindow).toBeCloseTo(0.7, 1); // Heavy recovery
    });

    it('should calculate critical strike knockback (100+ damage)', () => {
      const config: KnockbackConfig = {
        force: 1200,
        direction: attackDirection,
        duration: 1.2,
        balanceState: { current: 50, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 110);
      
      // 4.0m base * 1.0 * 1.0 = 4.0m
      expect(result.displacement.length()).toBeCloseTo(4.0, 1);
      expect(result.shouldFall).toBe(false);
      expect(result.recoveryWindow).toBeCloseTo(1.5, 1); // Critical recovery
    });
  });

  describe('Stance Resistance Modifiers', () => {
    const balanceState: BalanceState = { current: 60, max: 100 };

    it('should apply Mountain stance (+40% resistance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState,
        currentStance: TrigramStance.GAN, // Mountain: +40% resistance
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 0.6 (40% resistance) * 1.0 = 1.5m
      expect(result.displacement.length()).toBeCloseTo(1.5, 1);
    });

    it('should apply Earth stance (+30% resistance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState,
        currentStance: TrigramStance.GON, // Earth: +30% resistance
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 0.7 (30% resistance) * 1.0 = 1.75m
      expect(result.displacement.length()).toBeCloseTo(1.75, 1);
    });

    it('should apply Heaven stance (+10% resistance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState,
        currentStance: TrigramStance.GEON, // Heaven: +10% resistance
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 0.9 (10% resistance) * 1.0 = 2.25m
      expect(result.displacement.length()).toBeCloseTo(2.25, 1);
    });

    it('should apply Wind stance (-20% resistance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState,
        currentStance: TrigramStance.SON, // Wind: -20% resistance (more vulnerable)
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.2 (-20% resistance) * 1.0 = 3.0m
      expect(result.displacement.length()).toBeCloseTo(3.0, 1);
    });

    it('should apply Fire stance (-30% resistance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState,
        currentStance: TrigramStance.LI, // Fire: -30% resistance (most vulnerable)
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.3 (-30% resistance) * 1.0 = 3.25m
      expect(result.displacement.length()).toBeCloseTo(3.25, 1);
    });
  });

  describe('Balance Integration', () => {
    const neutralStance = TrigramStance.GAM; // Water (neutral)

    it('should reduce knockback with high balance (>70%)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 85, max: 100 }, // 85% balance
        currentStance: neutralStance,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.0 * 0.7 (high balance reduction) = 1.75m
      expect(result.displacement.length()).toBeCloseTo(1.75, 1);
      expect(result.shouldFall).toBe(false);
    });

    it('should apply normal knockback with medium balance (40-70%)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 55, max: 100 }, // 55% balance
        currentStance: neutralStance,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.0 * 1.0 (normal) = 2.5m
      expect(result.displacement.length()).toBeCloseTo(2.5, 1);
      expect(result.shouldFall).toBe(false);
    });

    it('should increase knockback with low balance (20-40%)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 35, max: 100 }, // 35% balance (stumbling)
        currentStance: neutralStance,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.0 * 1.5 (low balance increase) = 3.75m
      expect(result.displacement.length()).toBeCloseTo(3.75, 1);
      expect(result.shouldFall).toBe(false); // Above 20% threshold
      
      // Recovery window increased by 50% for low balance
      expect(result.recoveryWindow).toBeCloseTo(1.05, 1); // 0.7 * 1.5
    });

    it('should trigger fall with critical balance (<20%)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 15, max: 100 }, // 15% balance (falling)
        currentStance: neutralStance,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.0 * 2.0 (critical balance) = 5.0m
      expect(result.displacement.length()).toBeCloseTo(5.0, 1);
      expect(result.shouldFall).toBe(true); // Below 20% threshold
      
      // Extended recovery for critical balance
      expect(result.recoveryWindow).toBeCloseTo(1.05, 1); // 0.7 * 1.5
    });
  });

  describe('Combined Effects', () => {
    it('should stack stance and balance modifiers', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 30, max: 100 }, // Low balance (1.5x)
        currentStance: TrigramStance.LI, // Fire stance (1.3x vulnerable)
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.3 (Fire) * 1.5 (low balance) = 4.875m
      expect(result.displacement.length()).toBeCloseTo(4.875, 1);
      expect(result.shouldFall).toBe(false);
    });

    it('should apply maximum resistance (Mountain + high balance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 90, max: 100 }, // High balance (0.7x)
        currentStance: TrigramStance.GAN, // Mountain stance (0.6x)
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 0.6 (Mountain) * 0.7 (high balance) = 1.05m
      expect(result.displacement.length()).toBeCloseTo(1.05, 1);
      expect(result.shouldFall).toBe(false);
    });

    it('should apply maximum vulnerability (Fire + critical balance)', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 10, max: 100 }, // Critical balance (2.0x)
        currentStance: TrigramStance.LI, // Fire stance (1.3x)
      };

      const result = physics.calculateKnockback(config, 80);
      
      // 2.5m base * 1.3 (Fire) * 2.0 (critical) = 6.5m
      expect(result.displacement.length()).toBeCloseTo(6.5, 1);
      expect(result.shouldFall).toBe(true); // Critical balance
    });
  });

  describe('Knockback Direction', () => {
    it('should apply knockback in attack direction', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: new THREE.Vector3(1, 0, 0).normalize(), // Right
        duration: 0.8,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // Should be pushed in positive X direction
      expect(result.displacement.x).toBeGreaterThan(0);
      expect(result.displacement.y).toBeCloseTo(0, 1);
      expect(result.displacement.z).toBeCloseTo(0, 1);
    });

    it('should handle diagonal attack vectors', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: new THREE.Vector3(1, 0, 1).normalize(), // Diagonal
        duration: 0.8,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // Should maintain direction ratio
      const ratio = result.displacement.x / result.displacement.z;
      expect(ratio).toBeCloseTo(1, 1); // Equal X and Z
    });
  });

  describe('Knockback Duration', () => {
    it('should calculate duration for light knockback', () => {
      const config: KnockbackConfig = {
        force: 300,
        direction: attackDirection,
        duration: 0.3,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 30);
      
      // 0.5m distance with high balance modifier (0.35m actual)
      // Duration: 0.3 + (0.35 / 4.0) * 0.9 = 0.3 + 0.07875 = 0.37875s
      expect(result.duration).toBeCloseTo(0.37875, 1);
    });

    it('should calculate duration for critical knockback', () => {
      const config: KnockbackConfig = {
        force: 1200,
        direction: attackDirection,
        duration: 1.2,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 110);
      
      // 4.0m distance → ~1.2s duration
      expect(result.duration).toBeCloseTo(1.2, 1);
    });
  });

  describe('Recovery Window', () => {
    it('should calculate light recovery window', () => {
      const config: KnockbackConfig = {
        force: 300,
        direction: attackDirection,
        duration: 0.3,
        balanceState: { current: 60, max: 100 }, // Normal balance
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 30);
      
      expect(result.recoveryWindow).toBeCloseTo(0.2, 1);
    });

    it('should increase recovery window for low balance', () => {
      const config: KnockbackConfig = {
        force: 300,
        direction: attackDirection,
        duration: 0.3,
        balanceState: { current: 30, max: 100 }, // Low balance
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 30);
      
      // 0.2s * 1.5 (low balance modifier) = 0.3s
      expect(result.recoveryWindow).toBeCloseTo(0.3, 1);
    });

    it('should calculate critical recovery window', () => {
      const config: KnockbackConfig = {
        force: 1200,
        direction: attackDirection,
        duration: 1.2,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 110);
      
      expect(result.recoveryWindow).toBeCloseTo(1.5, 1);
    });
  });

  describe('applyKnockbackForce', () => {
    it('should start at original position (progress 0)', () => {
      const originalPos = new THREE.Vector3(0, 0, 0);
      const result: KnockbackResult = {
        displacement: new THREE.Vector3(2.5, 0, 0),
        duration: 0.8,
        recoveryWindow: 0.7,
        shouldFall: false,
      };

      const newPos = physics.applyKnockbackForce(originalPos, result, 0.016, 0.0);
      
      expect(newPos.x).toBeCloseTo(0, 2);
      expect(newPos.y).toBeCloseTo(0, 2);
      expect(newPos.z).toBeCloseTo(0, 2);
    });

    it('should be near final position at progress 0.5 (ease-out)', () => {
      const originalPos = new THREE.Vector3(0, 0, 0);
      const result: KnockbackResult = {
        displacement: new THREE.Vector3(2.5, 0, 0),
        duration: 0.8,
        recoveryWindow: 0.7,
        shouldFall: false,
      };

      const newPos = physics.applyKnockbackForce(originalPos, result, 0.016, 0.5);
      
      // Ease-out cubic: 1 - (1-0.5)^3 = 0.875
      // 2.5m * 0.875 = 2.1875m
      expect(newPos.x).toBeCloseTo(2.1875, 1);
    });

    it('should reach final position (progress 1)', () => {
      const originalPos = new THREE.Vector3(0, 0, 0);
      const result: KnockbackResult = {
        displacement: new THREE.Vector3(2.5, 0, 0),
        duration: 0.8,
        recoveryWindow: 0.7,
        shouldFall: false,
      };

      const newPos = physics.applyKnockbackForce(originalPos, result, 0.016, 1.0);
      
      expect(newPos.x).toBeCloseTo(2.5, 2);
      expect(newPos.y).toBeCloseTo(0, 2);
      expect(newPos.z).toBeCloseTo(0, 2);
    });

    it('should clamp progress above 1', () => {
      const originalPos = new THREE.Vector3(0, 0, 0);
      const result: KnockbackResult = {
        displacement: new THREE.Vector3(2.5, 0, 0),
        duration: 0.8,
        recoveryWindow: 0.7,
        shouldFall: false,
      };

      const newPos = physics.applyKnockbackForce(originalPos, result, 0.016, 1.5);
      
      // Should not exceed final displacement
      expect(newPos.x).toBeCloseTo(2.5, 2);
    });
  });

  describe('State Checking', () => {
    it('should detect knockback state', () => {
      expect(physics.isInKnockback(0.4, 0.8)).toBe(true);
      expect(physics.isInKnockback(0.9, 0.8)).toBe(false);
    });

    it('should detect recovery window', () => {
      expect(physics.isInRecoveryWindow(0.3, 0.7)).toBe(true);
      expect(physics.isInRecoveryWindow(0.8, 0.7)).toBe(false);
    });
  });

  describe('Korean Terminology', () => {
    it('should provide knockback state names', () => {
      const normal = KnockbackPhysics.getKnockbackStateName(false);
      expect(normal.korean).toBe('밀침');
      expect(normal.english).toBe('Knockback');

      const falling = KnockbackPhysics.getKnockbackStateName(true);
      expect(falling.korean).toBe('넘어짐');
      expect(falling.english).toBe('Falling');
    });

    it('should provide recovery state names', () => {
      const recovery = physics.getRecoveryStateName();
      expect(recovery.korean).toBe('회복');
      expect(recovery.english).toBe('Recovery');
    });

    it('should provide stumbling state names', () => {
      const stumbling = physics.getStumblingStateName();
      expect(stumbling.korean).toBe('휘청거림');
      expect(stumbling.english).toBe('Stumbling');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero damage', () => {
      const config: KnockbackConfig = {
        force: 0,
        direction: attackDirection,
        duration: 0,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 0);
      
      // Zero damage should still apply minimum knockback
      expect(result.displacement.length()).toBeGreaterThan(0);
    });

    it('should handle maximum balance', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 100, max: 100 }, // Maximum balance
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // High balance reduction should apply
      expect(result.displacement.length()).toBeLessThan(2.5);
      expect(result.shouldFall).toBe(false);
    });

    it('should handle zero balance', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 0, max: 100 }, // Zero balance
        currentStance: TrigramStance.GAM,
      };

      const result = physics.calculateKnockback(config, 80);
      
      // Critical balance multiplier should apply
      expect(result.displacement.length()).toBeGreaterThan(2.5);
      expect(result.shouldFall).toBe(true);
    });
  });

  describe('Performance (60fps target)', () => {
    it('should calculate knockback in under 1ms', () => {
      const config: KnockbackConfig = {
        force: 800,
        direction: attackDirection,
        duration: 0.8,
        balanceState: { current: 60, max: 100 },
        currentStance: TrigramStance.GAM,
      };

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        physics.calculateKnockback(config, 80);
      }
      const end = performance.now();
      
      const avgTime = (end - start) / 1000;
      
      // Should be well under 16.67ms per frame (60fps)
      expect(avgTime).toBeLessThan(1); // <1ms per calculation
    });

    it('should apply force in under 0.1ms', () => {
      const originalPos = new THREE.Vector3(0, 0, 0);
      const result: KnockbackResult = {
        displacement: new THREE.Vector3(2.5, 0, 0),
        duration: 0.8,
        recoveryWindow: 0.7,
        shouldFall: false,
      };

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        physics.applyKnockbackForce(originalPos, result, 0.016, 0.5);
      }
      const end = performance.now();
      
      const avgTime = (end - start) / 1000;
      
      // Should be extremely fast for per-frame updates
      expect(avgTime).toBeLessThan(0.1);
    });
  });
});
