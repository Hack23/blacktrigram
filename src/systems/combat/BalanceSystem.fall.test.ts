/**
 * Unit tests for Balance System Fall Integration
 * 
 * Tests fall trigger conditions and fall direction determination
 * based on balance loss.
 * 
 * @module systems/combat/BalanceSystem.fall.test
 * @category Combat System
 * @korean 균형시스템낙법테스트
 */

import { describe, it, expect } from "vitest";
import BalanceSystem from "./BalanceSystem";
import { TrigramStance } from "../../types/common";
import type { PlayerState } from "../player";

// Helper to create test player state
function createTestPlayer(balance: number): PlayerState {
  return {
    id: "test-player",
    name: "Test Player",
    archetype: "musa",
    health: 100,
    maxHealth: 100,
    ki: 50,
    maxKi: 100,
    stamina: 80,
    maxStamina: 100,
    stance: TrigramStance.GEON,
    stanceLaterality: "left",
    pain: 0,
    consciousness: 100,
    balance,
    defense: 50,
    speed: 100,
    attack: 50,
    criticalChance: 0.1,
    kiRegenRate: 5,
    staminaRegenRate: 10,
    effects: [],
    position: { x: 0, y: 0 },
    bodyPartHealth: {
      head: 100,
      torso: 100,
      leftArm: 100,
      rightArm: 100,
      leftLeg: 100,
      rightLeg: 100,
      core: 100,
    },
    maxBodyPartHealth: {
      head: 100,
      torso: 100,
      leftArm: 100,
      rightArm: 100,
      leftLeg: 100,
      rightLeg: 100,
      core: 100,
    },
  } as PlayerState;
}

describe("BalanceSystem - Fall Integration", () => {
  const system = new BalanceSystem();

  describe("shouldTriggerFall", () => {
    it("should not trigger fall at stable balance (80-100%)", () => {
      const player = createTestPlayer(85);
      expect(system.shouldTriggerFall(player)).toBe(false);
    });

    it("should not trigger fall at unsteady balance (50-79%)", () => {
      const player = createTestPlayer(60);
      expect(system.shouldTriggerFall(player)).toBe(false);
    });

    it("should not trigger fall at off-balance (20-49%)", () => {
      const player = createTestPlayer(30);
      expect(system.shouldTriggerFall(player)).toBe(false);
    });

    it("should trigger fall at falling threshold (< 20%)", () => {
      const player = createTestPlayer(19);
      expect(system.shouldTriggerFall(player)).toBe(true);
    });

    it("should trigger fall at very low balance (< 10%)", () => {
      const player = createTestPlayer(5);
      expect(system.shouldTriggerFall(player)).toBe(true);
    });

    it("should trigger fall at exactly 0 balance", () => {
      const player = createTestPlayer(0);
      expect(system.shouldTriggerFall(player)).toBe(true);
    });

    it("should not trigger at exactly 20 balance (boundary)", () => {
      const player = createTestPlayer(20);
      expect(system.shouldTriggerFall(player)).toBe(false);
    });
  });

  describe("determineFallType", () => {
    it("should return backward fall from frontal attack (0°)", () => {
      const player = createTestPlayer(15);
      const fallType = system.determineFallType(player, 0, "mid");
      expect(fallType).toBe("backward");
    });

    it("should return forward fall from rear attack (π)", () => {
      const player = createTestPlayer(15);
      const fallType = system.determineFallType(player, Math.PI, "mid");
      expect(fallType).toBe("forward");
    });

    it("should return side fall from lateral attack", () => {
      const player = createTestPlayer(15);
      const fallTypeLeft = system.determineFallType(player, -Math.PI / 2, "mid");
      const fallTypeRight = system.determineFallType(player, Math.PI / 2, "mid");
      
      expect(fallTypeLeft).toBe("side_left");
      expect(fallTypeRight).toBe("side_right");
    });

    it("should handle high attacks (head strikes)", () => {
      const player = createTestPlayer(10);
      const fallType = system.determineFallType(player, 0, "high");
      expect(fallType).toBe("backward");
    });

    it("should handle low attacks (leg sweeps)", () => {
      const player = createTestPlayer(5);
      const fallTypeFromFront = system.determineFallType(player, 0, "low");
      const fallTypeFromRear = system.determineFallType(player, Math.PI, "low");
      
      // Low attacks always cause side falls
      expect(["side_left", "side_right"]).toContain(fallTypeFromFront);
      expect(["side_left", "side_right"]).toContain(fallTypeFromRear);
    });

    it("should work with different balance levels", () => {
      // Fall type determination shouldn't depend on exact balance value
      const player1 = createTestPlayer(19);
      const player2 = createTestPlayer(5);
      const player3 = createTestPlayer(0);
      
      const fall1 = system.determineFallType(player1, 0, "mid");
      const fall2 = system.determineFallType(player2, 0, "mid");
      const fall3 = system.determineFallType(player3, 0, "mid");
      
      // Same attack angle should give same fall type regardless of balance
      expect(fall1).toBe(fall2);
      expect(fall2).toBe(fall3);
    });

    it("should handle diagonal attacks", () => {
      const player = createTestPlayer(10);
      
      // Front-right diagonal (π/4)
      const fallTypeFR = system.determineFallType(player, Math.PI / 4, "mid");
      expect(["backward", "side_right"]).toContain(fallTypeFR);
      
      // Front-left diagonal (-π/4)
      const fallTypeFL = system.determineFallType(player, -Math.PI / 4, "mid");
      expect(["backward", "side_left"]).toContain(fallTypeFL);
    });
  });

  describe("determineFallTypeFromStance", () => {
    it("should return forward for aggressive stances (Heaven, Fire, Earth)", () => {
      expect(system.determineFallTypeFromStance(TrigramStance.GEON)).toBe("forward");
      expect(system.determineFallTypeFromStance(TrigramStance.LI)).toBe("forward");
      expect(system.determineFallTypeFromStance(TrigramStance.GON)).toBe("forward");
    });

    it("should return backward for defensive stances (Mountain, Water, Thunder)", () => {
      expect(system.determineFallTypeFromStance(TrigramStance.GAN)).toBe("backward");
      expect(system.determineFallTypeFromStance(TrigramStance.GAM)).toBe("backward");
      expect(system.determineFallTypeFromStance(TrigramStance.JIN)).toBe("backward");
    });

    it("should return side fall for lateral stances (Wind)", () => {
      const fallType = system.determineFallTypeFromStance(TrigramStance.SON);
      expect(["side_left", "side_right"]).toContain(fallType);
    });

    it("should return backward for Lake stance (fluid retreat)", () => {
      expect(system.determineFallTypeFromStance(TrigramStance.TAE)).toBe("backward");
    });

    it("should return valid fall type for all stances", () => {
      const allStances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];
      
      const validFallTypes = ["forward", "backward", "side_left", "side_right"];
      
      for (const stance of allStances) {
        const fallType = system.determineFallTypeFromStance(stance);
        expect(validFallTypes).toContain(fallType);
      }
    });
  });

  describe("integration with balance loss", () => {
    it("should trigger fall after severe balance disruption", () => {
      let player = createTestPlayer(100);
      
      // Simulate severe leg strike (70 damage with 2.5x leg multiplier = 105 balance loss)
      player = system.disruptBalance(player, 70, "left_leg" as any);
      
      // Should be well below 20% now
      expect(player.balance).toBeLessThan(20);
      expect(system.shouldTriggerFall(player)).toBe(true);
    });

    it("should not trigger fall from moderate balance loss", () => {
      let player = createTestPlayer(100);
      
      // Simulate moderate torso strike (15 damage with 1.5x torso multiplier)
      player = system.disruptBalance(player, 15, "torso" as any);
      
      // Should still be above 20%
      expect(player.balance).toBeGreaterThanOrEqual(20);
      expect(system.shouldTriggerFall(player)).toBe(false);
    });

    it("should trigger fall from multiple leg strikes", () => {
      let player = createTestPlayer(100);
      
      // Simulate series of leg strikes (each ~22.5 balance loss)
      player = system.disruptBalance(player, 20, "left_leg" as any);
      player = system.disruptBalance(player, 20, "right_leg" as any);
      player = system.disruptBalance(player, 20, "left_leg" as any);
      player = system.disruptBalance(player, 20, "right_leg" as any);
      
      // Multiple strikes should bring balance below 20%
      expect(system.shouldTriggerFall(player)).toBe(true);
    });

    it("should allow recovery to prevent fall", () => {
      let player = createTestPlayer(25);
      
      // Apply recovery over 3 seconds (3000ms)
      player = system.applyRecovery(player, 3000);
      
      // Should have recovered above fall threshold
      expect(player.balance).toBeGreaterThan(20);
      expect(system.shouldTriggerFall(player)).toBe(false);
    });
  });

  describe("fall type consistency", () => {
    it("should return same fall type for same attack angle", () => {
      const player1 = createTestPlayer(15);
      const player2 = createTestPlayer(10);
      const player3 = createTestPlayer(5);
      
      const attackAngle = Math.PI / 3;
      
      const fall1 = system.determineFallType(player1, attackAngle, "mid");
      const fall2 = system.determineFallType(player2, attackAngle, "mid");
      const fall3 = system.determineFallType(player3, attackAngle, "mid");
      
      expect(fall1).toBe(fall2);
      expect(fall2).toBe(fall3);
    });

    it("should return valid fall types for all possible angles", () => {
      const player = createTestPlayer(10);
      const validFallTypes = ["forward", "backward", "side_left", "side_right"];
      
      // Test angles from -π to π in π/8 increments
      for (let angle = -Math.PI; angle <= Math.PI; angle += Math.PI / 8) {
        const fallType = system.determineFallType(player, angle, "mid");
        expect(validFallTypes).toContain(fallType);
      }
    });
  });
});
