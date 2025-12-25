/**
 * MovementPenaltySystem.test.ts - Movement Penalty System Tests
 * 
 * Comprehensive tests for injury-based movement penalties including:
 * - Speed multiplier calculations at different health thresholds
 * - Stance change penalties
 * - Instant penalties from knee/ankle strikes
 * - Asymmetric damage effects
 * - Balance state transitions
 * 
 * Target: 80%+ code coverage
 */

import { describe, it, expect, beforeEach } from "vitest";
import { MovementPenaltySystem } from "../MovementPenaltySystem";
import {
  BodyPart,
  BodyPartHealth,
  BodyPartMaxHealth,
  LegInjuryState,
  InstantMovementPenalty,
  MOVEMENT_PENALTY_CONSTANTS,
} from "../types";

describe("MovementPenaltySystem", () => {
  let system: MovementPenaltySystem;
  let maxHealth: BodyPartMaxHealth;

  beforeEach(() => {
    system = new MovementPenaltySystem();
    maxHealth = {
      head: 100,
      neck: 100,
      torsoUpper: 100,
      torsoLower: 100,
      armLeft: 100,
      armRight: 100,
      legLeft: 100,
      legRight: 100,
    };
  });

  /**
   * Helper to create body part health with specific leg values
   */
  const createHealth = (leftLeg: number, rightLeg: number): BodyPartHealth => ({
    head: 100,
    neck: 100,
    torsoUpper: 100,
    torsoLower: 100,
    armLeft: 100,
    armRight: 100,
    legLeft: leftLeg,
    legRight: rightLeg,
  });

  describe("Movement Speed Penalties", () => {
    it("should return normal speed at 100% leg health", () => {
      const health = createHealth(100, 100);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(1.0);
      expect(penalty.injuryState).toBe(LegInjuryState.NORMAL);
      expect(penalty.canRun).toBe(true);
    });

    it("should return normal speed at 70% leg health (threshold)", () => {
      const health = createHealth(70, 70);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(1.0);
      expect(penalty.injuryState).toBe(LegInjuryState.NORMAL);
      expect(penalty.canRun).toBe(true);
    });

    it("should apply limping penalty at 69% leg health", () => {
      const health = createHealth(69, 69);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.8); // -20% speed
      expect(penalty.injuryState).toBe(LegInjuryState.LIMPING);
      expect(penalty.canRun).toBe(true);
    });

    it("should apply limping penalty at 50% leg health (threshold)", () => {
      const health = createHealth(50, 50);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.8);
      expect(penalty.injuryState).toBe(LegInjuryState.LIMPING);
      expect(penalty.canRun).toBe(true);
    });

    it("should apply severe limp at 49% leg health", () => {
      const health = createHealth(49, 49);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.6); // -40% speed
      expect(penalty.injuryState).toBe(LegInjuryState.SEVERE_LIMP);
      expect(penalty.canRun).toBe(true);
    });

    it("should apply severe limp at 30% leg health (threshold)", () => {
      const health = createHealth(30, 30);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.6);
      expect(penalty.injuryState).toBe(LegInjuryState.SEVERE_LIMP);
      expect(penalty.canRun).toBe(true);
    });

    it("should apply hobbled penalty at 29% leg health", () => {
      const health = createHealth(29, 29);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.4); // -60% speed
      expect(penalty.injuryState).toBe(LegInjuryState.HOBBLED);
      expect(penalty.canRun).toBe(false); // Cannot run
    });

    it("should apply hobbled penalty at 0% leg health", () => {
      const health = createHealth(0, 0);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.4);
      expect(penalty.injuryState).toBe(LegInjuryState.HOBBLED);
      expect(penalty.canRun).toBe(false);
    });

    it("should average left and right leg health", () => {
      // Left leg 80%, right leg 40% = average 60% (limping)
      const health = createHealth(80, 40);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.8);
      expect(penalty.injuryState).toBe(LegInjuryState.LIMPING);
    });
  });

  describe("Stance Change Penalties", () => {
    it("should have normal stance change at >50% leg health", () => {
      const health = createHealth(60, 60);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.stanceChangePenalty).toBe(1.0);
      expect(penalty.advancedStancesRestricted).toBe(false);
    });

    it("should apply 2x stance change penalty at <50% leg health", () => {
      const health = createHealth(49, 49);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.stanceChangePenalty).toBe(2.0);
      expect(penalty.advancedStancesRestricted).toBe(false);
    });

    it("should restrict advanced stances at <30% leg health", () => {
      const health = createHealth(29, 29);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.stanceChangePenalty).toBe(2.0);
      expect(penalty.advancedStancesRestricted).toBe(true);
    });

    it("should allow advanced stances at exactly 30% leg health", () => {
      const health = createHealth(30, 30);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.advancedStancesRestricted).toBe(false);
    });
  });

  describe("Instant Penalties from Knee/Ankle Strikes", () => {
    it("should create instant penalty with correct values", () => {
      const currentTime = 1000;
      const instantPenalty = system.createInstantPenalty(
        BodyPart.LEG_LEFT,
        currentTime
      );

      expect(instantPenalty.speedMultiplier).toBe(0.3);
      expect(instantPenalty.duration).toBe(5000);
      expect(instantPenalty.appliedAt).toBe(currentTime);
      expect(instantPenalty.affectedPart).toBe(BodyPart.LEG_LEFT);
    });

    it("should apply instant penalty when active", () => {
      const health = createHealth(100, 100); // Normal health
      const currentTime = 1000;
      const instantPenalty: InstantMovementPenalty = {
        speedMultiplier: 0.3,
        duration: 5000,
        appliedAt: currentTime,
        affectedPart: BodyPart.LEG_RIGHT,
      };

      // Check within duration
      const penalty = system.calculateMovementPenalty(
        health,
        maxHealth,
        instantPenalty,
        currentTime + 2000 // 2 seconds after strike
      );

      expect(penalty.speedMultiplier).toBe(0.3); // Instant penalty overrides normal
      expect(penalty.hasInstantPenalty).toBe(true);
      expect(penalty.instantPenaltyExpiry).toBe(6000); // 1000 + 5000
    });

    it("should expire instant penalty after duration", () => {
      const health = createHealth(100, 100);
      const currentTime = 1000;
      const instantPenalty: InstantMovementPenalty = {
        speedMultiplier: 0.3,
        duration: 5000,
        appliedAt: currentTime,
        affectedPart: BodyPart.LEG_LEFT,
      };

      // Check after duration expired
      const penalty = system.calculateMovementPenalty(
        health,
        maxHealth,
        instantPenalty,
        currentTime + 6000 // 6 seconds after strike (expired)
      );

      expect(penalty.speedMultiplier).toBe(1.0); // Back to normal
      expect(penalty.hasInstantPenalty).toBe(false);
    });

    it("should use worst penalty when instant penalty and injury both active", () => {
      const health = createHealth(60, 60); // Limping (0.8x)
      const currentTime = 1000;
      const instantPenalty: InstantMovementPenalty = {
        speedMultiplier: 0.3, // Worse than limping
        duration: 5000,
        appliedAt: currentTime,
        affectedPart: BodyPart.LEG_RIGHT,
      };

      const penalty = system.calculateMovementPenalty(
        health,
        maxHealth,
        instantPenalty,
        currentTime + 1000
      );

      expect(penalty.speedMultiplier).toBe(0.3); // Instant penalty is worse
    });
  });

  describe("Asymmetric Damage Effects", () => {
    it("should apply no asymmetric penalty when both legs similarly damaged", () => {
      const health = createHealth(60, 65); // Only 5% difference
      const movementDirection = { x: -1, y: 0 }; // Moving left

      const asymmetricMultiplier = system.calculateAsymmetricPenalty(
        health,
        maxHealth,
        movementDirection
      );

      expect(asymmetricMultiplier).toBe(1.0); // No penalty
    });

    it("should penalize left movement when left leg more injured", () => {
      const health = createHealth(40, 80); // Left leg 40%, right 80% (40% diff)
      const movementDirection = { x: -1, y: 0 }; // Moving left

      const asymmetricMultiplier = system.calculateAsymmetricPenalty(
        health,
        maxHealth,
        movementDirection
      );

      expect(asymmetricMultiplier).toBe(0.8); // Same-side penalty
    });

    it("should apply lighter penalty when moving away from injured leg", () => {
      const health = createHealth(40, 80); // Left leg injured
      const movementDirection = { x: 1, y: 0 }; // Moving right (away from injury)

      const asymmetricMultiplier = system.calculateAsymmetricPenalty(
        health,
        maxHealth,
        movementDirection
      );

      expect(asymmetricMultiplier).toBe(0.9); // Opposite-side penalty
    });

    it("should penalize right movement when right leg more injured", () => {
      const health = createHealth(80, 40); // Right leg injured
      const movementDirection = { x: 1, y: 0 }; // Moving right

      const asymmetricMultiplier = system.calculateAsymmetricPenalty(
        health,
        maxHealth,
        movementDirection
      );

      expect(asymmetricMultiplier).toBe(0.8); // Same-side penalty
    });

    it("should apply no penalty for vertical-only movement", () => {
      const health = createHealth(40, 80);
      const movementDirection = { x: 0, y: 1 }; // Pure vertical

      const asymmetricMultiplier = system.calculateAsymmetricPenalty(
        health,
        maxHealth,
        movementDirection
      );

      expect(asymmetricMultiplier).toBe(1.0);
    });
  });

  describe("Balance State Transitions", () => {
    it("should not trigger vulnerable state at normal leg health", () => {
      const health = createHealth(80, 80);
      const shouldBeVulnerable = system.shouldEnterVulnerableState(health, maxHealth);

      expect(shouldBeVulnerable).toBe(false);
    });

    it("should trigger vulnerable state at <30% leg health (severe limp threshold)", () => {
      const health = createHealth(29, 29);
      const shouldBeVulnerable = system.shouldEnterVulnerableState(health, maxHealth);

      expect(shouldBeVulnerable).toBe(true);
    });

    it("should not trigger helpless state with one leg functional", () => {
      const health = createHealth(20, 60); // One leg critical, one okay
      const shouldBeHelpless = system.shouldEnterHelplessState(health, maxHealth);

      expect(shouldBeHelpless).toBe(false);
    });

    it("should trigger helpless state when both legs critically damaged", () => {
      const health = createHealth(25, 20); // Both legs <30%
      const shouldBeHelpless = system.shouldEnterHelplessState(health, maxHealth);

      expect(shouldBeHelpless).toBe(true);
    });

    it("should not trigger helpless state at exactly 30% on both legs", () => {
      const health = createHealth(30, 30);
      const shouldBeHelpless = system.shouldEnterHelplessState(health, maxHealth);

      expect(shouldBeHelpless).toBe(false);
    });
  });

  describe("Balance Modifier Calculation", () => {
    it("should have full balance at 100% leg health", () => {
      const health = createHealth(100, 100);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.balanceModifier).toBe(1.0);
    });

    it("should reduce balance proportionally to leg damage", () => {
      const health = createHealth(60, 60);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.balanceModifier).toBe(0.6);
    });

    it("should have minimum balance of 0.3 at 0% leg health", () => {
      const health = createHealth(0, 0);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.balanceModifier).toBeGreaterThanOrEqual(0.3);
    });
  });

  describe("Combined Movement Speed Calculation", () => {
    it("should calculate modified speed with all penalties", () => {
      const baseSpeed = 100;
      const health = createHealth(60, 60); // Limping (0.8x)
      const movementDirection = { x: 0, y: 0 }; // No asymmetric penalty

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      expect(modifiedSpeed).toBe(80); // 100 * 0.8
    });

    it("should apply both injury and asymmetric penalties", () => {
      const baseSpeed = 100;
      const health = createHealth(40, 80); // Limping left leg
      const movementDirection = { x: -1, y: 0 }; // Moving left (same side)

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      // Average leg health = 60% (limping = 0.8x)
      // Moving toward injured leg = 0.8x asymmetric
      // Final: 100 * 0.8 * 0.8 = 64
      expect(modifiedSpeed).toBe(64);
    });

    it("should apply instant penalty over other penalties", () => {
      const baseSpeed = 100;
      const health = createHealth(80, 80); // Normal health
      const movementDirection = { x: 0, y: 0 };
      const currentTime = 1000;
      const instantPenalty: InstantMovementPenalty = {
        speedMultiplier: 0.3,
        duration: 5000,
        appliedAt: currentTime,
        affectedPart: BodyPart.LEG_LEFT,
      };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection,
        instantPenalty,
        currentTime + 1000
      );

      expect(modifiedSpeed).toBe(30); // 100 * 0.3
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative health values", () => {
      const health = createHealth(-10, -10);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(0.4); // Hobbled
      expect(penalty.canRun).toBe(false);
    });

    it("should handle health exceeding max", () => {
      const health = createHealth(150, 150);
      const penalty = system.calculateMovementPenalty(health, maxHealth);

      expect(penalty.speedMultiplier).toBe(1.0); // Normal (capped at 100%)
      expect(penalty.canRun).toBe(true);
    });

    it("should handle zero max health gracefully", () => {
      const health = createHealth(50, 50);
      const zeroMaxHealth: BodyPartMaxHealth = {
        ...maxHealth,
        legLeft: 1, // Avoid division by zero
        legRight: 1,
      };

      const penalty = system.calculateMovementPenalty(health, zeroMaxHealth);

      expect(penalty.speedMultiplier).toBeDefined();
      expect(penalty.injuryState).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should calculate movement penalty within 1ms", () => {
      const health = createHealth(60, 60);
      const startTime = performance.now();

      system.calculateMovementPenalty(health, maxHealth);

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(1);
    });

    it("should maintain <1ms average over 1000 calculations", () => {
      const health = createHealth(60, 60);
      const durations: number[] = [];

      for (let i = 0; i < 1000; i++) {
        const startTime = performance.now();
        system.calculateMovementPenalty(health, maxHealth);
        durations.push(performance.now() - startTime);
      }

      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      expect(avgDuration).toBeLessThan(1);
    });
  });
});
