/**
 * Integration tests for InjuryMovementModifier with MovementPhysics
 * 
 * Tests the integration helper functions and compatibility with
 * the existing MovementPhysics system.
 */

import { describe, it, expect } from "vitest";
import {
  calculateLegInjuryFactor,
  calculateMovementSpeed,
  calculateInjuryMultiplier,
} from "../integration";
import { TrigramStance } from "@/types/common";
import type { BodyPartHealth } from "../../bodypart/types";

describe("Integration with MovementPhysics", () => {
  /**
   * Helper to create body part health
   */
  const createHealth = (
    legLeft: number,
    legRight: number,
    torsoUpper: number = 100,
    torsoLower: number = 100
  ): BodyPartHealth => ({
    head: 100,
    neck: 100,
    torsoUpper,
    torsoLower,
    armLeft: 100,
    armRight: 100,
    legLeft,
    legRight,
  });

  describe("calculateLegInjuryFactor", () => {
    it("should return 0 for fully healthy legs", () => {
      const health = createHealth(100, 100);
      const factor = calculateLegInjuryFactor(health);
      
      expect(factor).toBe(0); // No injury
    });

    it("should return 0.5 for 50% leg health", () => {
      const health = createHealth(50, 50);
      const factor = calculateLegInjuryFactor(health);
      
      expect(factor).toBe(0.5); // 50% injured
    });

    it("should return 1.0 for 0% leg health", () => {
      const health = createHealth(0, 0);
      const factor = calculateLegInjuryFactor(health);
      
      expect(factor).toBe(1.0); // Fully injured
    });

    it("should average left and right leg health", () => {
      const health = createHealth(80, 60); // avg 70%
      const factor = calculateLegInjuryFactor(health);
      
      expect(factor).toBeCloseTo(0.3, 2); // 30% injured
    });
  });

  describe("calculateMovementSpeed", () => {
    it("should return base speed for healthy player", () => {
      const health = createHealth(100, 100);
      const speed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        0
      );
      
      expect(speed).toBe(5.0);
    });

    it("should reduce speed for injured legs", () => {
      const health = createHealth(50, 50);
      const speed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        0
      );
      
      expect(speed).toBeLessThan(5.0);
      expect(speed).toBeGreaterThan(0);
    });

    it("should apply stance modifiers correctly", () => {
      const health = createHealth(100, 100);
      
      // Fast stance
      const fastSpeed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.SON, // Wind: +25%
        0
      );
      
      // Slow stance
      const slowSpeed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GAN, // Mountain: -20%
        0
      );
      
      expect(fastSpeed).toBe(5.0 * 1.25);
      expect(slowSpeed).toBe(5.0 * 0.8);
    });

    it("should apply pain penalties", () => {
      const health = createHealth(100, 100);
      
      const normalSpeed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        0
      );
      
      const painSpeed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        85 // Pain overload
      );
      
      expect(painSpeed).toBeLessThan(normalSpeed);
      expect(painSpeed).toBeCloseTo(5.0 * 0.85, 2);
    });

    it("should combine all modifiers correctly", () => {
      const health = createHealth(40, 40, 50, 50); // Injured
      const speed = calculateMovementSpeed(
        6.0, // 6 m/s base
        health,
        TrigramStance.GAN, // -20% stance
        90 // Pain overload
      );
      
      // Should have combined penalties
      expect(speed).toBeLessThan(6.0);
      expect(speed).toBeGreaterThan(0);
    });

    it("should respect minimum speed of 10%", () => {
      const health = createHealth(0, 0, 0, 0); // Complete injury
      const speed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GAN, // Slowest stance
        100 // Max pain
      );
      
      expect(speed).toBeGreaterThanOrEqual(5.0 * 0.1);
    });
  });

  describe("calculateInjuryMultiplier", () => {
    it("should return 1.0 for healthy player", () => {
      const health = createHealth(100, 100);
      const multiplier = calculateInjuryMultiplier(health);
      
      expect(multiplier).toBe(1.0);
    });

    it("should return reduced multiplier for injured legs", () => {
      const health = createHealth(50, 50);
      const multiplier = calculateInjuryMultiplier(health);
      
      expect(multiplier).toBeLessThan(1.0);
      expect(multiplier).toBeGreaterThan(0);
    });

    it("should include torso injuries", () => {
      const healthLegsOnly = createHealth(100, 100, 50, 50);
      const multiplierLegsOnly = calculateInjuryMultiplier(healthLegsOnly);
      
      // Should be less than 1.0 due to torso damage
      expect(multiplierLegsOnly).toBeLessThan(1.0);
    });

    it("should NOT include stance modifiers", () => {
      // This function should give the same result regardless of stance
      // since it's explicitly calculating INJURY multiplier only
      const health = createHealth(60, 60);
      const multiplier = calculateInjuryMultiplier(health);
      
      // The multiplier should be purely from injuries
      // (function uses neutral stance internally)
      expect(multiplier).toBeGreaterThan(0);
      expect(multiplier).toBeLessThan(1.0);
    });

    it("should NOT include pain penalties", () => {
      // This function should give the same result regardless of pain
      // since it's explicitly calculating INJURY multiplier only
      const health = createHealth(60, 60);
      const multiplier = calculateInjuryMultiplier(health);
      
      // The multiplier should be purely from injuries
      // (function uses 0 pain internally)
      expect(multiplier).toBeGreaterThan(0);
      expect(multiplier).toBeLessThan(1.0);
    });
  });

  describe("Compatibility with MovementPhysics.MovementState", () => {
    it("should produce compatible leg injury factor", () => {
      const health = createHealth(70, 70);
      const legInjuryFactor = calculateLegInjuryFactor(health);
      
      // MovementPhysics expects 0-1 where 0 = healthy, 1 = injured
      expect(legInjuryFactor).toBeGreaterThanOrEqual(0);
      expect(legInjuryFactor).toBeLessThanOrEqual(1);
      expect(legInjuryFactor).toBeCloseTo(0.3, 2); // 70% health = 30% injured
    });

    it("should work with MovementPhysics speed calculation pattern", () => {
      const health = createHealth(60, 60);
      const BASE_SPEED = 6.0;
      
      // Old MovementPhysics pattern: baseSpeed * (1.0 - legInjuryFactor * 0.5)
      const legInjuryFactor = calculateLegInjuryFactor(health);
      const oldStyleSpeed = BASE_SPEED * (1.0 - legInjuryFactor * 0.5);
      
      // New pattern: use calculateMovementSpeed
      // (Should be more accurate than old pattern)
      const newStyleSpeed = calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );
      
      // Both should reduce speed, but new system is more sophisticated
      expect(oldStyleSpeed).toBeLessThan(BASE_SPEED);
      expect(newStyleSpeed).toBeLessThan(BASE_SPEED);
    });
  });

  describe("Edge Cases", () => {
    it("should handle asymmetric leg injuries", () => {
      const health = createHealth(80, 40); // One leg much worse
      const speed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        0
      );
      
      // Should use worst leg penalty
      expect(speed).toBeLessThan(5.0);
    });

    it("should handle negative health gracefully", () => {
      const health = createHealth(-10, -10);
      const speed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        0
      );
      
      // Should clamp to minimum
      expect(speed).toBeGreaterThanOrEqual(5.0 * 0.1);
    });

    it("should handle over-100 health gracefully", () => {
      const health = createHealth(150, 150);
      const speed = calculateMovementSpeed(
        5.0,
        health,
        TrigramStance.GEON,
        0
      );
      
      // Should treat as 100% health
      expect(speed).toBe(5.0);
    });
  });
});
