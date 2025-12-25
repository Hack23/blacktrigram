/**
 * MovementPenaltyIntegration.test.ts - Movement Penalty Integration Tests
 * 
 * Tests integration between MovementPenaltySystem and combat actions,
 * ensuring leg injuries properly affect AI movement speed.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { MovementPenaltySystem } from "../MovementPenaltySystem";
import { BodyPartHealth, BodyPartMaxHealth, BodyPart } from "../types";

describe("MovementPenaltySystem - Combat Integration", () => {
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

  describe("AI Movement Speed Calculation", () => {
    it("should maintain full speed with healthy legs", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      };

      const baseSpeed = 10; // pixels per frame
      const movementDirection = { x: 1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      expect(modifiedSpeed).toBe(10);
    });

    it("should reduce speed to 80% when limping", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 60,
        legRight: 60,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      expect(modifiedSpeed).toBe(8); // 10 * 0.8
    });

    it("should reduce speed to 60% with severe limp", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 40,
        legRight: 40,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      expect(modifiedSpeed).toBe(6); // 10 * 0.6
    });

    it("should reduce speed to 40% when hobbled", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 20,
        legRight: 20,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      expect(modifiedSpeed).toBe(4); // 10 * 0.4
    });
  });

  describe("Asymmetric Movement Penalties", () => {
    it("should penalize movement toward injured left leg", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 40, // Injured
        legRight: 80, // Healthy
      };

      const baseSpeed = 10;
      const movingLeft = { x: -1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movingLeft
      );

      // Average leg health = 60% (limping = 0.8x)
      // Left movement with left leg injured = 0.8x asymmetric
      // Total: 10 * 0.8 * 0.8 = 6.4
      expect(modifiedSpeed).toBe(6.4);
    });

    it("should lightly penalize movement away from injured leg", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 40, // Injured
        legRight: 80, // Healthy
      };

      const baseSpeed = 10;
      const movingRight = { x: 1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movingRight
      );

      // Average leg health = 60% (limping = 0.8x)
      // Right movement with left leg injured = 0.9x asymmetric
      // Total: 10 * 0.8 * 0.9 = 7.2
      expect(modifiedSpeed).toBe(7.2);
    });
  });

  describe("Instant Penalty Integration", () => {
    it("should apply instant penalty from knee strike", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };
      const currentTime = 1000;
      
      // Create instant penalty from knee strike
      const instantPenalty = system.createInstantPenalty(
        BodyPart.LEG_RIGHT,
        currentTime
      );

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection,
        instantPenalty,
        currentTime + 2000 // 2 seconds after strike
      );

      // Instant penalty overrides normal speed (30% speed)
      expect(modifiedSpeed).toBe(3);
    });

    it("should restore normal speed after instant penalty expires", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };
      const currentTime = 1000;
      
      const instantPenalty = system.createInstantPenalty(
        BodyPart.LEG_LEFT,
        currentTime
      );

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection,
        instantPenalty,
        currentTime + 6000 // 6 seconds after strike (expired)
      );

      // Back to normal speed after expiry
      expect(modifiedSpeed).toBe(10);
    });
  });

  describe("Realistic Combat Scenarios", () => {
    it("should handle progressive damage during combat", () => {
      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };

      // Start of fight - full health
      let health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      };

      let speed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );
      expect(speed).toBe(10); // Full speed

      // After first leg strike - limping
      health = { ...health, legLeft: 60, legRight: 60 };
      speed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );
      expect(speed).toBe(8); // 80% speed

      // After more damage - severe limp
      health = { ...health, legLeft: 40, legRight: 40 };
      speed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );
      expect(speed).toBe(6); // 60% speed

      // Critically injured - hobbled
      health = { ...health, legLeft: 20, legRight: 20 };
      speed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );
      expect(speed).toBe(4); // 40% speed
    });

    it("should combine injury and instant penalties realistically", () => {
      // Already injured leg (limping)
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 60,
        legRight: 60,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };
      const currentTime = 1000;
      
      // Then receive knee strike
      const instantPenalty = system.createInstantPenalty(
        BodyPart.LEG_RIGHT,
        currentTime
      );

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection,
        instantPenalty,
        currentTime + 1000
      );

      // Instant penalty (30%) overrides limping (80%)
      expect(modifiedSpeed).toBe(3);
    });
  });

  describe("Edge Cases and Safety", () => {
    it("should handle zero distance movement", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 60,
        legRight: 60,
      };

      const baseSpeed = 10;
      const noMovement = { x: 0, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        noMovement
      );

      // Should still apply base penalty without asymmetric
      expect(modifiedSpeed).toBe(8); // 80% for limping
    });

    it("should handle extremely low speeds gracefully", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 10,
        legRight: 10,
      };

      const baseSpeed = 0.1; // Very slow
      const movementDirection = { x: 1, y: 0 };

      const modifiedSpeed = system.calculateModifiedSpeed(
        baseSpeed,
        health,
        maxHealth,
        movementDirection
      );

      expect(modifiedSpeed).toBeGreaterThan(0);
      expect(modifiedSpeed).toBeLessThan(baseSpeed);
    });

    it("should maintain performance with repeated calculations", () => {
      const health: BodyPartHealth = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 60,
        legRight: 60,
      };

      const baseSpeed = 10;
      const movementDirection = { x: 1, y: 0 };

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        system.calculateModifiedSpeed(
          baseSpeed,
          health,
          maxHealth,
          movementDirection
        );
      }
      const duration = performance.now() - startTime;

      // Should complete 1000 calculations in under 10ms
      expect(duration).toBeLessThan(10);
    });
  });
});
