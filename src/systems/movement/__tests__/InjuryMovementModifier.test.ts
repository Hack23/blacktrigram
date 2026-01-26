/**
 * InjuryMovementModifier.test.ts - Tests for Injury-Based Movement System
 * 
 * Comprehensive tests validating injury-based movement speed calculations
 * including leg injuries, torso damage, stance modifiers, and pain effects.
 * 
 * Target: ≥85% code coverage
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  InjuryMovementModifier,
  DEFAULT_INJURY_MOVEMENT_CONFIG,
  STANCE_SPEED_MODIFIERS,
} from "../InjuryMovementModifier";
import { TrigramStance } from "@/types/common";
import type { BodyPartHealth } from "../../bodypart/types";

describe("InjuryMovementModifier", () => {
  let modifier: InjuryMovementModifier;
  const BASE_SPEED = 5.0; // 5 m/s base movement speed

  beforeEach(() => {
    modifier = new InjuryMovementModifier();
  });

  /**
   * Helper to create body part health with specific values
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

  describe("Leg Injury Penalties", () => {
    it("should apply no penalty at 100% leg health", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.speedMultiplier).toBe(1.0);
      expect(result.finalSpeed).toBe(BASE_SPEED);
      expect(result.penalties.leftLegPenalty).toBe(0);
      expect(result.penalties.rightLegPenalty).toBe(0);
      expect(result.isLimping).toBe(false);
      expect(result.isSevereLimp).toBe(false);
    });

    it("should apply no penalty at 70% leg health (threshold)", () => {
      const health = createHealth(70, 70);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.speedMultiplier).toBe(1.0);
      expect(result.penalties.leftLegPenalty).toBe(0);
      expect(result.penalties.rightLegPenalty).toBe(0);
      expect(result.isLimping).toBe(false);
    });

    it("should apply 40% penalty at 30% leg health (limping threshold)", () => {
      const health = createHealth(30, 30);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // At 30% health: 40% penalty each leg -> 0.6 speed multiplier
      // BUT: Both legs at 40% penalty (> 0.3) triggers bothLegsInjured
      // 0.6 * 0.8 (both legs) = 0.48
      expect(result.penalties.leftLegPenalty).toBeCloseTo(0.4, 2);
      expect(result.penalties.bothLegsInjured).toBe(true);
      expect(result.speedMultiplier).toBeCloseTo(0.48, 2);
      expect(result.isLimping).toBe(true); // At limping threshold
      expect(result.isSevereLimp).toBe(false); // At threshold, not below
    });

    it("should apply progressive penalty between 70% and 30%", () => {
      // Test at 50% health (midpoint of limping range)
      const health = createHealth(50, 50);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // 50% is halfway between 70% (0% penalty) and 30% (40% penalty)
      // Expected: 20% penalty -> 0.8 speed multiplier
      expect(result.speedMultiplier).toBeCloseTo(0.8, 2);
      expect(result.penalties.leftLegPenalty).toBeCloseTo(0.2, 2);
      expect(result.isLimping).toBe(true);
      expect(result.isSevereLimp).toBe(false);
    });

    it("should apply 80% penalty at 10% leg health (critical threshold)", () => {
      const health = createHealth(10, 10);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // At 10% health: 80% penalty -> 0.2 speed multiplier before torso
      expect(result.speedMultiplier).toBeCloseTo(0.2, 1);
      expect(result.penalties.leftLegPenalty).toBeCloseTo(0.8, 2);
      expect(result.isSevereLimp).toBe(true);
    });

    it("should apply near-100% penalty at 0% leg health", () => {
      const health = createHealth(0, 0);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // At 0% health: 100% penalty, but clamped to minimum 10%
      expect(result.speedMultiplier).toBe(DEFAULT_INJURY_MOVEMENT_CONFIG.minSpeedMultiplier);
      expect(result.finalSpeed).toBe(BASE_SPEED * 0.1);
    });

    it("should use worst leg penalty when legs have different health", () => {
      // Left leg worse than right
      const health = createHealth(40, 80);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // Left leg at 40% should dominate (30% penalty)
      const expectedLeftPenalty = ((70 - 40) / 40) * 0.4;
      expect(result.penalties.leftLegPenalty).toBeCloseTo(expectedLeftPenalty, 2);
      expect(result.speedMultiplier).toBeCloseTo(1.0 - expectedLeftPenalty, 2);
    });
  });

  describe("Both Legs Injured Penalty", () => {
    it("should apply additional 20% penalty when both legs have >30% penalty", () => {
      // Both legs at 20% health -> each has 60% penalty
      const health = createHealth(20, 20);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.penalties.bothLegsInjured).toBe(true);
      // Base penalty ~60% leaves 0.4, then * 0.8 (both legs) = 0.32
      expect(result.speedMultiplier).toBeCloseTo(0.32, 1);
      expect(result.speedMultiplier).toBeLessThan(0.4); // Definitely lower than without cumulative penalty
    });

    it("should NOT apply both legs penalty when only one leg is injured", () => {
      // Only left leg injured severely
      const health = createHealth(20, 90);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.penalties.bothLegsInjured).toBe(false);
    });

    it("should NOT apply both legs penalty when injuries are minor", () => {
      // Both legs at 60% (only 10% penalty each, below 30% threshold)
      const health = createHealth(60, 60);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.penalties.bothLegsInjured).toBe(false);
    });
  });

  describe("Torso Injury Penalties", () => {
    it("should apply no torso penalty at 100% torso health", () => {
      const health = createHealth(100, 100, 100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.penalties.torsoPenalty).toBe(0);
    });

    it("should apply 30% max penalty at 0% torso health", () => {
      const health = createHealth(100, 100, 0, 0);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // 30% max torso penalty -> 0.7 multiplier from torso alone
      expect(result.penalties.torsoPenalty).toBe(0.3);
    });

    it("should apply 15% penalty at 50% torso health", () => {
      const health = createHealth(100, 100, 50, 50);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // 50% damage = 15% penalty (30% max * 0.5)
      expect(result.penalties.torsoPenalty).toBeCloseTo(0.15, 2);
    });

    it("should average upper and lower torso health", () => {
      const health = createHealth(100, 100, 80, 60); // avg 70%
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // 30% damage = 9% penalty (30% max * 0.3)
      expect(result.penalties.torsoPenalty).toBeCloseTo(0.09, 2);
    });
  });

  describe("Stance Speed Modifiers", () => {
    it("should apply neutral modifier for Heaven stance", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.penalties.stanceModifier).toBe(1.0);
      expect(result.finalSpeed).toBe(BASE_SPEED);
    });

    it("should apply -20% modifier for Mountain defensive stance", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GAN,
        0
      );

      expect(result.penalties.stanceModifier).toBe(0.8);
      expect(result.finalSpeed).toBe(BASE_SPEED * 0.8);
    });

    it("should apply +25% modifier for Wind offensive stance", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.SON,
        0
      );

      expect(result.penalties.stanceModifier).toBe(1.25);
      expect(result.finalSpeed).toBe(BASE_SPEED * 1.25);
    });

    it("should apply +20% modifier for Fire aggressive stance", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.LI,
        0
      );

      expect(result.penalties.stanceModifier).toBe(1.2);
      expect(result.finalSpeed).toBe(BASE_SPEED * 1.2);
    });

    it("should test all stance modifiers", () => {
      const health = createHealth(100, 100);
      
      Object.entries(STANCE_SPEED_MODIFIERS).forEach(([stance, expectedMod]) => {
        const result = modifier.calculateMovementSpeed(
          BASE_SPEED,
          health,
          stance as TrigramStance,
          0
        );
        
        expect(result.penalties.stanceModifier).toBe(expectedMod);
      });
    });
  });

  describe("Pain Overload Penalty", () => {
    it("should NOT apply pain penalty below 80 pain", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        79
      );

      expect(result.penalties.painOverload).toBe(false);
      expect(result.statusText.korean).not.toContain("과부하");
    });

    it("should apply 15% pain penalty at 80 pain (threshold)", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        80
      );

      expect(result.penalties.painOverload).toBe(true);
      // Pain overload multiplier is 0.85 (-15%)
      expect(result.speedMultiplier).toBeCloseTo(0.85, 2);
    });

    it("should apply 15% pain penalty at 100 pain", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        100
      );

      expect(result.penalties.painOverload).toBe(true);
      expect(result.speedMultiplier).toBeCloseTo(0.85, 2);
    });

    it("should include pain overload in status text", () => {
      const health = createHealth(60, 60); // Limping
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        85
      );

      expect(result.statusText.korean).toContain("고통 과부하");
      expect(result.statusText.english).toContain("Pain Overload");
    });
  });

  describe("Combined Penalties", () => {
    it("should combine leg injury + torso + stance + pain penalties", () => {
      // Worst case scenario
      const health = createHealth(20, 20, 0, 0); // Severe leg + torso damage
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GAN, // Defensive stance -20%
        90 // Pain overload
      );

      // Should have significant speed reduction
      // Calculation: leg penalty ~60% -> 0.4, * 0.8 (both legs) = 0.32
      // * 0.7 (torso) = 0.224, * 0.8 (stance) = 0.179, * 0.85 (pain) = 0.152
      expect(result.speedMultiplier).toBeCloseTo(0.152, 1);
      expect(result.speedMultiplier).toBeLessThan(0.20);
      expect(result.penalties.bothLegsInjured).toBe(true);
      expect(result.penalties.painOverload).toBe(true);
    });

    it("should respect minimum speed multiplier of 10%", () => {
      // Extreme injury scenario
      const health = createHealth(0, 0, 0, 0);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GAN, // Slowest stance
        100 // Maximum pain
      );

      // Should clamp to minimum 10%
      expect(result.speedMultiplier).toBe(DEFAULT_INJURY_MOVEMENT_CONFIG.minSpeedMultiplier);
      expect(result.finalSpeed).toBe(BASE_SPEED * 0.1);
    });

    it("should allow stance bonuses to increase speed despite minor injuries", () => {
      const health = createHealth(90, 90); // Minor injury
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.SON, // +25% stance
        0
      );

      // Should still be faster than base speed
      expect(result.finalSpeed).toBeGreaterThan(BASE_SPEED);
    });
  });

  describe("Status Text Generation", () => {
    it("should show Normal status at full health", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.statusText.korean).toBe("정상");
      expect(result.statusText.english).toBe("Normal");
    });

    it("should show Limping status at 50% leg health", () => {
      const health = createHealth(50, 50);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.statusText.korean).toBe("절름거림");
      expect(result.statusText.english).toBe("Limping");
    });

    it("should show Severe Limping status at 20% leg health", () => {
      const health = createHealth(20, 20);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.statusText.korean).toContain("중증 절름거림");
      expect(result.statusText.english).toContain("Severe Limping");
    });

    it("should show Critical Injury at 5% leg health", () => {
      const health = createHealth(5, 5);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.statusText.korean).toContain("심각한 부상");
      expect(result.statusText.english).toContain("Critical Injury");
    });

    it("should indicate both legs when both are injured", () => {
      const health = createHealth(15, 15);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.statusText.korean).toContain("양 다리");
      expect(result.statusText.english).toContain("Both Legs");
    });
  });

  describe("Helper Methods", () => {
    it("shouldLimp should return false at full health", () => {
      const health = createHealth(100, 100);
      expect(modifier.shouldLimp(health)).toBe(false);
    });

    it("shouldLimp should return true below 70% leg health", () => {
      const health = createHealth(60, 60);
      expect(modifier.shouldLimp(health)).toBe(true);
    });

    it("hasSevereLimp should return false above 30% leg health", () => {
      const health = createHealth(50, 50);
      expect(modifier.hasSevereLimp(health)).toBe(false);
    });

    it("hasSevereLimp should return true below 30% leg health", () => {
      const health = createHealth(20, 20);
      expect(modifier.hasSevereLimp(health)).toBe(true);
    });

    it("getInjuryDescription should return current injury state", () => {
      const health = createHealth(40, 40);
      const description = modifier.getInjuryDescription(health);

      expect(description.korean).toBe("절름거림");
      expect(description.english).toBe("Limping");
    });

    it("getStanceSpeedModifier should return correct modifier", () => {
      expect(modifier.getStanceSpeedModifier(TrigramStance.GEON)).toBe(1.0);
      expect(modifier.getStanceSpeedModifier(TrigramStance.GAN)).toBe(0.8);
      expect(modifier.getStanceSpeedModifier(TrigramStance.SON)).toBe(1.25);
    });
  });

  describe("Configuration Override", () => {
    it("should allow custom configuration", () => {
      const customModifier = new InjuryMovementModifier({
        legThresholds: {
          normal: 80,  // Changed from 70
          limping: 40, // Changed from 30
          critical: 20, // Changed from 10
        },
      });

      const health = createHealth(75, 75);
      const result = customModifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // With custom config, 75% should now trigger limping
      expect(result.isLimping).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative health gracefully", () => {
      const health = createHealth(-10, -10);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // Should clamp to minimum speed
      expect(result.speedMultiplier).toBe(DEFAULT_INJURY_MOVEMENT_CONFIG.minSpeedMultiplier);
    });

    it("should handle health over 100 gracefully", () => {
      const health = createHealth(150, 150);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        0
      );

      // Should treat as 100% health
      expect(result.speedMultiplier).toBe(1.0);
    });

    it("should handle zero base speed", () => {
      const health = createHealth(50, 50);
      const result = modifier.calculateMovementSpeed(
        0,
        health,
        TrigramStance.GEON,
        0
      );

      expect(result.finalSpeed).toBe(0);
    });

    it("should handle negative pain gracefully", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        -10
      );

      expect(result.penalties.painOverload).toBe(false);
    });

    it("should handle pain over 100 gracefully", () => {
      const health = createHealth(100, 100);
      const result = modifier.calculateMovementSpeed(
        BASE_SPEED,
        health,
        TrigramStance.GEON,
        150
      );

      expect(result.penalties.painOverload).toBe(true);
    });
  });
});
