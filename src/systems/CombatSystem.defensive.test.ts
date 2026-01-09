/**
 * Unit tests for Combat System Defensive Action Processing
 *
 * Tests the processDefensiveAction function that determines which
 * defensive animation to trigger based on combat state.
 *
 * @module systems/CombatSystem.defensive.test
 * @category Combat System Tests
 * @korean 전투시스템방어테스트
 */

import { CombatState, PlayerArchetype, TrigramStance } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";
import type { DefensiveAnimationType } from "./animation/types";
import CombatSystem from "./CombatSystem";
import { PlayerState } from "./player";

describe("CombatSystem - Defensive Action Processing", () => {
  let combatSystem: CombatSystem;
  let baseDefender: PlayerState;
  let baseAttacker: PlayerState;

  beforeEach(() => {
    combatSystem = new CombatSystem();

    // Create base defender with good balance and stamina
    baseDefender = {
      id: "defender-1",
      name: { korean: "방어자", english: "Defender" },
      archetype: PlayerArchetype.MUSA,
      health: 80,
      maxHealth: 100,
      ki: 80,
      maxKi: 100,
      stamina: 80,
      maxStamina: 100,
      energy: 50,
      maxEnergy: 100,
      attackPower: 10,
      defense: 12,
      speed: 10,
      technique: 10,
      currentStance: TrigramStance.GAN, // Mountain stance (defensive)
      combatState: CombatState.DEFENDING,
      position: { x: 100, y: 200 },
      isBlocking: true,
      isStunned: false,
      isCountering: false,
      balance: 80, // Good balance
      pain: 10,
      consciousness: 90,
      recentHits: 0,
      isAI: false,
      statusEffects: [],
      activeEffects: [],
      bodyFacing: "right" as const,
      stats: {
        damageDealt: 0,
        damageTaken: 0,
        attacksLanded: 0,
        attacksMissed: 0,
        blocksSuccessful: 0,
        blocksFailed: 0,
        vitalPointsHit: 0,
        techniquesUsed: 0,
        kiUsed: 0,
        staminaUsed: 0,
        timeInStance: 0,
        stanceChanges: 0,
      },
    };

    // Create base attacker
    baseAttacker = {
      ...baseDefender,
      id: "attacker-1",
      name: { korean: "공격자", english: "Attacker" },
      combatState: CombatState.ATTACKING,
      isBlocking: false,
    };
  });

  describe("Parry Deflection (받아넘기기)", () => {
    it("should return parry_deflect when defense is 1.5x attack power", () => {
      const defender = {
        ...baseDefender,
        balance: 90,
        stamina: 90,
        defense: 15,
      };
      const attackPower = 10;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("parry_deflect");
    });

    it("should return parry_deflect with high balance and stamina", () => {
      const defender = {
        ...baseDefender,
        balance: 100,
        stamina: 100,
        defense: 12,
      };
      const attackPower = 15;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("parry_deflect");
    });
  });

  describe("Block Success (막기)", () => {
    it("should return block_success when defense matches attack reasonably", () => {
      const defender = {
        ...baseDefender,
        balance: 60, // Moderate balance
        stamina: 60, // Moderate stamina
        defense: 10, // Lower defense
      };
      const attackPower = 22; // Moderate attack

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("block_success");
    });

    it("should return block_success with adequate balance and stamina", () => {
      const defender = {
        ...baseDefender,
        balance: 50,
        stamina: 70,
        defense: 10,
      };
      const attackPower = 22;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("block_success");
    });
  });

  describe("Guard Break (방어붕괴)", () => {
    it("should return guard_break when balance is below 30", () => {
      const defender = {
        ...baseDefender,
        balance: 25,
        stamina: 80,
        defense: 12,
      };
      const attackPower = 15;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("guard_break");
    });

    it("should return guard_break when defense is insufficient (< 0.6x attack)", () => {
      const defender = {
        ...baseDefender,
        balance: 40,
        stamina: 40,
        defense: 8,
      };
      const attackPower = 30; // Overwhelming attack

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("guard_break");
    });

    it("should return guard_break with low stamina", () => {
      const defender = {
        ...baseDefender,
        balance: 50,
        stamina: 20, // Exhausted
        defense: 10,
      };
      const attackPower = 25;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("guard_break");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero balance", () => {
      const defender = {
        ...baseDefender,
        balance: 0,
        stamina: 100,
        defense: 15,
      };
      const attackPower = 15;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("guard_break");
    });

    it("should handle zero stamina", () => {
      const defender = {
        ...baseDefender,
        balance: 100,
        stamina: 0,
        defense: 15,
      };
      const attackPower = 15;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("guard_break");
    });

    it("should handle very high defense stat", () => {
      const defender = {
        ...baseDefender,
        balance: 80,
        stamina: 80,
        defense: 30, // Very high defense
      };
      const attackPower = 15;

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("parry_deflect");
    });

    it("should handle very low defense and resources", () => {
      const defender = {
        ...baseDefender,
        balance: 30, // Just above threshold
        stamina: 30,
        defense: 5, // Very low defense
      };
      const attackPower = 30; // Heavy attack

      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );

      expect(result).toBe("guard_break");
    });
  });

  describe("Combat Progression", () => {
    it("should show progression from parry to block to guard break", () => {
      let defender = {
        ...baseDefender,
        balance: 100,
        stamina: 100,
        defense: 15,
      };
      const attackPower = 15;

      // Initial state: Strong defense -> Parry
      let result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );
      expect(result).toBe("parry_deflect");

      // After taking damage: Reduced balance/stamina -> Block
      defender = { ...defender, balance: 50, stamina: 50, defense: 10 };
      result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );
      expect(result).toBe("block_success");

      // After more damage: Low balance -> Guard Break
      defender = { ...defender, balance: 25, stamina: 40 };
      result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        attackPower
      );
      expect(result).toBe("guard_break");
    });
  });

  describe("Defense Stat Integration", () => {
    it("should factor in defense stat when calculating defensive power", () => {
      const lowDefenseDefender = {
        ...baseDefender,
        balance: 70,
        stamina: 70,
        defense: 7, // Low defense
      };
      const highDefenseDefender = {
        ...baseDefender,
        balance: 70,
        stamina: 70,
        defense: 18, // High defense
      };
      const attackPower = 20;

      const lowResult = combatSystem.processDefensiveAction(
        lowDefenseDefender,
        baseAttacker,
        attackPower
      );
      const highResult = combatSystem.processDefensiveAction(
        highDefenseDefender,
        baseAttacker,
        attackPower
      );

      // High defense should perform better than low defense
      expect(lowResult).toBe("block_success");
      expect(highResult).toBe("parry_deflect");
    });
  });

  describe("Type Safety", () => {
    it("should return valid DefensiveAnimationType values", () => {
      const validTypes: DefensiveAnimationType[] = [
        "block_success",
        "parry_deflect",
        "guard_break",
        "guard_recovery",
      ];

      const defender = { ...baseDefender };
      const result = combatSystem.processDefensiveAction(
        defender,
        baseAttacker,
        15
      );

      expect(validTypes).toContain(result);
    });
  });
});
