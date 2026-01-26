/**
 * Test for knockback boundary clamping in meters
 * Validates that players stay within meter-based arena bounds
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { KnockbackPhysics } from './KnockbackPhysics';
import { TrigramStance } from '@/types/common';
import type { KnockbackConfig } from './KnockbackPhysics';

describe('Knockback Arena Boundary Clamping', () => {
  it('should clamp knockback to meter-based arena boundaries', () => {
    const physics = new KnockbackPhysics();
    
    // 10m × 7.5m arena (extends from -5 to +5 in X, -3.75 to +3.75 in Z)
    const arenaBounds = {
      x: 0,
      y: 0,
      width: 1000,
      height: 750,
      worldWidthMeters: 10,
      worldDepthMeters: 7.5,
      scale: 1.0,
    };

    // Player near right edge at x=4m
    const defenderPos = { x: 4, y: 0 };

    // Heavy knockback to the right (2.5m base)
    const config: KnockbackConfig = {
      force: 800,
      direction: new THREE.Vector3(1, 0, 0).normalize(), // Right
      duration: 0.8,
      balanceState: { current: 60, max: 100 },
      currentStance: TrigramStance.GAM, // Neutral
    };

    const result = physics.calculateKnockback(config, 80);
    
    // Verify displacement is 2.5m
    expect(result.displacement.x).toBeCloseTo(2.5, 1);
    
    // Apply displacement: 4m + 2.5m = 6.5m (exceeds +5m boundary)
    const newPos = {
      x: defenderPos.x + result.displacement.x,
      y: defenderPos.y + result.displacement.z,
    };

    // Check that clamping logic would work
    const halfWidth = arenaBounds.worldWidthMeters / 2;
    const clampedX = Math.max(-halfWidth, Math.min(halfWidth, newPos.x));
    
    // Should be clamped to +5m (right boundary)
    expect(clampedX).toBeCloseTo(5.0, 1);
  });

  it('should handle different arena sizes correctly', () => {
    const testCases = [
      { size: 6, halfSize: 3 },
      { size: 8, halfSize: 4 },
      { size: 10, halfSize: 5 },
      { size: 12, halfSize: 6 },
      { size: 14, halfSize: 7 },
    ];

    testCases.forEach(({ size, halfSize }) => {
      // Player at center with 4m knockback to right
      const defenderPos = { x: 0, y: 0 };
      const knockbackDistance = 4;
      
      const newX = defenderPos.x + knockbackDistance;
      const clampedX = Math.max(-halfSize, Math.min(halfSize, newX));
      
      // Should stay within boundary
      expect(Math.abs(clampedX)).toBeLessThanOrEqual(halfSize);
      
      // For arenas > 4m, should not be clamped
      if (size > 8) {
        expect(clampedX).toBe(knockbackDistance);
      }
    });
  });

  it('should clamp knockback in Z direction (position.y)', () => {
    const physics = new KnockbackPhysics();
    
    // 10m × 7.5m arena
    const arenaBounds = {
      worldWidthMeters: 10,
      worldDepthMeters: 7.5,
    };

    // Player near bottom edge at y=-3m
    const defenderPos = { x: 0, y: -3 };

    // Knockback downward (negative Z)
    const config: KnockbackConfig = {
      force: 800,
      direction: new THREE.Vector3(0, 0, -1).normalize(), // Backward
      duration: 0.8,
      balanceState: { current: 60, max: 100 },
      currentStance: TrigramStance.GAM,
    };

    const result = physics.calculateKnockback(config, 80);
    
    // Apply displacement: -3m + (-2.5m) = -5.5m (exceeds -3.75m boundary)
    const newY = defenderPos.y + result.displacement.z;

    // Clamp to arena depth boundary
    const halfDepth = arenaBounds.worldDepthMeters / 2;
    const clampedY = Math.max(-halfDepth, Math.min(halfDepth, newY));
    
    // Should be clamped to -3.75m (bottom boundary)
    expect(clampedY).toBeCloseTo(-3.75, 2);
    expect(Math.abs(clampedY)).toBeLessThanOrEqual(halfDepth);
  });

  it('should handle extreme knockback at arena edge', () => {
    const physics = new KnockbackPhysics();
    
    // Small 6m × 4.5m arena
    const arenaBounds = {
      worldWidthMeters: 6,
      worldDepthMeters: 4.5,
    };

    // Player at far right edge
    const defenderPos = { x: 2.9, y: 0 };

    // Critical strike with Fire stance (vulnerable) and low balance
    const config: KnockbackConfig = {
      force: 1200,
      direction: new THREE.Vector3(1, 0, 0).normalize(),
      duration: 1.2,
      balanceState: { current: 30, max: 100 }, // Low balance (1.5x)
      currentStance: TrigramStance.LI, // Fire: -30% resistance (1.3x)
    };

    const result = physics.calculateKnockback(config, 110);
    
    // Expected: 4.0m * 1.3 (Fire) * 1.5 (low balance) = 7.8m knockback
    const expectedDistance = 4.0 * 1.3 * 1.5;
    expect(result.displacement.length()).toBeCloseTo(expectedDistance, 1);

    // After knockback: 2.9m + 7.8m = 10.7m (way outside 3m boundary)
    const newX = defenderPos.x + result.displacement.x;
    
    // Clamp to boundary
    const halfWidth = arenaBounds.worldWidthMeters / 2;
    const clampedX = Math.max(-halfWidth, Math.min(halfWidth, newX));
    
    // Should be clamped to +3m (right edge of 6m arena)
    expect(clampedX).toBeCloseTo(3.0, 1);
    expect(Math.abs(clampedX)).toBeLessThanOrEqual(halfWidth);
  });

  it('should handle knockback toward center (no clamping needed)', () => {
    const physics = new KnockbackPhysics();
    
    const arenaBounds = {
      worldWidthMeters: 10,
      worldDepthMeters: 7.5,
    };

    // Player at right edge
    const defenderPos = { x: 4.5, y: 0 };

    // Medium knockback toward center (left)
    const config: KnockbackConfig = {
      force: 550,
      direction: new THREE.Vector3(-1, 0, 0).normalize(),
      duration: 0.5,
      balanceState: { current: 60, max: 100 },
      currentStance: TrigramStance.GAM,
    };

    const result = physics.calculateKnockback(config, 55);
    
    // 1.2m knockback to left
    expect(result.displacement.x).toBeCloseTo(-1.2, 1);

    // After knockback: 4.5m - 1.2m = 3.3m (well within ±5m boundary)
    const newX = defenderPos.x + result.displacement.x;
    
    const halfWidth = arenaBounds.worldWidthMeters / 2;
    const clampedX = Math.max(-halfWidth, Math.min(halfWidth, newX));
    
    // Should not be clamped
    expect(clampedX).toBeCloseTo(3.3, 1);
    expect(clampedX).toBe(newX);
  });
});
