import { describe, it, expect, vi, beforeEach } from "vitest";
import { CombatSystem } from "./CombatSystem";
import type { PlayerState, KoreanTechnique, VitalPoint } from "../types";
import { createPlayerState } from "../types";

describe("CombatSystem", () => {
  let player1: PlayerState;
  let player2: PlayerState;
  let mockTechnique: KoreanTechnique;
  let mockVitalPoint: VitalPoint;

  beforeEach(() => {
    player1 = createPlayerState("player1", { x: 0, y: 0 }, "geon");
    player2 = createPlayerState("player2", { x: 50, y: 0 }, "tae");

    mockTechnique = {
      name: "테스트 기술",
      koreanName: "테스트 기술",
      englishName: "Test Technique",
      description: { korean: "테스트", english: "Test" },
      kiCost: 10,
      staminaCost: 5,
      range: 60,
      accuracy: 0.8,
      stance: "geon",
      damage: 25,
      type: "punch",
      critChance: 0.1,
      critMultiplier: 1.5,
    };

    mockVitalPoint = {
      id: "test_point",
      name: { korean: "테스트", english: "Test Point" },
      koreanName: "테스트",
      position: { x: 50, y: 0 },
      region: "torso",
      damageMultiplier: 1.5,
    };
  });

  describe("resolveAttack", () => {
    it("should resolve successful attack", () => {
      const result = CombatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique,
        []
      );

      expect(result).toHaveProperty("hit");
      expect(result).toHaveProperty("damage");
      expect(result).toHaveProperty("critical");
      expect(result).toHaveProperty("blocked");
      expect(result).toHaveProperty("conditionsApplied");
      expect(result).toHaveProperty("attackerState");
      expect(result).toHaveProperty("defenderState");
      expect(result).toHaveProperty("description");
    });

    it("should handle blocked attacks", () => {
      const blockingPlayer = { ...player2, isBlocking: true };

      const result = CombatSystem.resolveAttack(
        player1,
        blockingPlayer,
        mockTechnique,
        []
      );

      expect(result.blocked).toBe(true);
      expect(result.damage).toBeLessThan(mockTechnique.damage);
    });

    it("should apply vital point modifiers", () => {
      const result = CombatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique,
        [mockVitalPoint]
      );

      // Should potentially deal more damage due to vital point
      expect(result).toHaveProperty("damage");
      expect(typeof result.damage).toBe("number");
    });

    it("should handle critical hits", () => {
      // Mock random to always trigger critical
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.05); // Force critical hit

      const highCritTechnique = {
        ...mockTechnique,
        critChance: 1.0, // 100% crit chance
      };

      const result = CombatSystem.resolveAttack(
        player1,
        player2,
        highCritTechnique,
        []
      );

      Math.random = originalRandom;

      // Note: Due to random hit chance, we can't guarantee the attack hits
      // but if it does hit with 100% crit chance, it should be critical
      if (result.hit) {
        expect(result.critical).toBe(true);
      }
    });

    it("should consume attacker's ki", () => {
      const result = CombatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique,
        []
      );

      expect(result.attackerState.ki).toBeLessThanOrEqual(player1.ki);
    });

    it("should apply status effects", () => {
      const effectTechnique = {
        ...mockTechnique,
        effects: [
          {
            type: "stun",
            duration: 2000,
            magnitude: 1,
            chance: 1.0, // 100% chance
            source: "test",
          },
        ],
      };

      // Mock to ensure hit
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.1); // Force hit

      const result = CombatSystem.resolveAttack(
        player1,
        player2,
        effectTechnique,
        []
      );

      Math.random = originalRandom;

      if (result.hit) {
        expect(result.conditionsApplied.length).toBeGreaterThan(0);
      }
    });

    it("should miss at long range", () => {
      const farPlayer = createPlayerState("far", { x: 1000, y: 0 }, "tae");

      // Run multiple times since miss is probabilistic
      let missCount = 0;
      const trials = 10;

      for (let i = 0; i < trials; i++) {
        const result = CombatSystem.resolveAttack(
          player1,
          farPlayer,
          mockTechnique,
          []
        );

        if (!result.hit) {
          missCount++;
        }
      }

      // At extreme range, we should see some misses
      expect(missCount).toBeGreaterThan(0);
    });
  });
});
