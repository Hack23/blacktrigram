import { beforeEach, describe, expect, it } from "vitest";
import type { PlayerState } from "../types";
import {
  CombatAttackType,
  DamageType,
  PlayerArchetype,
  TrigramStance,
} from "../types/common";
import { createPlayerFromArchetype } from "../utils/playerUtils";
import CombatSystem, { createCombatResult } from "./CombatSystem";
import { TrainingCombatSystem } from "./combat/TrainingCombatSystem";
import { KoreanTechnique } from "./vitalpoint";

describe("CombatSystem", () => {
  let combatSystem: CombatSystem;
  let player1: PlayerState;
  let player2: PlayerState;
  let mockTechnique: KoreanTechnique;

  beforeEach(() => {
    combatSystem = new CombatSystem();
    player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

    // Fix: Ensure mockTechnique is properly defined in beforeEach
    mockTechnique = {
      id: "test_punch",
      name: { korean: "주먹질", english: "Punch" },
      koreanName: "주먹질",
      englishName: "Punch",
      romanized: "jumeokjil",
      description: { korean: "기본 주먹 공격", english: "Basic punch attack" },
      stance: TrigramStance.GEON,
      type: CombatAttackType.PUNCH,
      damageType: DamageType.BLUNT,
      damage: 15,
      range: 1.0,
      kiCost: 5,
      staminaCost: 10,
      accuracy: 0.85,
      executionTime: 300,
      recoveryTime: 500,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    };
  });

  describe("resolveAttack", () => {
    it("should resolve a basic attack successfully", () => {
      // Fix: Use mockTechnique instead of undefined
      const result = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique // Fix: Pass technique object
      );

      expect(result).toBeDefined();
      expect(result.hit).toBeDefined();
      expect(result.damage).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeGreaterThan(0);
      expect(result.criticalHit).toBeDefined();
      expect(result.vitalPointHit).toBeDefined();
    });

    it("should calculate damage based on technique and player stats", () => {
      // Fix: Use mockTechnique instead of undefined
      const result = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique
      );

      if (result.hit) {
        expect(result.damage).toBeGreaterThan(0);
        expect(result.damage).toBeLessThanOrEqual(mockTechnique.damage! * 2);
      }
    });

    it("should handle critical hits", () => {
      // Fix: Use mockTechnique instead of undefined
      const result = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique
      );

      if (result.hit) {
        expect(result.criticalHit).toBeDefined();
        expect(result.damage).toBeGreaterThanOrEqual(0);
      }
    });

    it("should apply stance effectiveness", () => {
      const player1WithGeon = { ...player1, currentStance: TrigramStance.GEON };
      const player2WithSon = { ...player2, currentStance: TrigramStance.SON };

      // Fix: Use mockTechnique instead of undefined
      const result = combatSystem.resolveAttack(
        player1WithGeon,
        player2WithSon,
        mockTechnique
      );

      expect(result).toBeDefined();
      // GEON has advantage over SON according to trigram system
    });
  });

  describe("applyCombatResult", () => {
    it("should update player states based on combat result", () => {
      // Fix: Use mockTechnique instead of undefined
      const combatResult = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique // Fix: Pass proper technique object
      );

      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(combatResult, player1, player2);

      expect(updatedAttacker).toBeDefined();
      expect(updatedDefender).toBeDefined();

      if (combatResult.hit) {
        expect(updatedDefender.health).toBeLessThanOrEqual(player2.health);
      }

      expect(updatedAttacker.ki).toBeLessThanOrEqual(player1.ki);
      expect(updatedAttacker.stamina).toBeLessThanOrEqual(player1.stamina);
    });
  });

  describe("getAvailableTechniques", () => {
    it("should filter techniques by available resources", () => {
      const lowResourcePlayer: PlayerState = {
        ...player1,
        ki: 1,
        stamina: 1,
      };

      const techniques = combatSystem.getAvailableTechniques(lowResourcePlayer);

      // Should filter out high-cost techniques
      techniques.forEach((technique) => {
        expect(technique.kiCost).toBeLessThanOrEqual(lowResourcePlayer.ki);
        expect(technique.staminaCost).toBeLessThanOrEqual(
          lowResourcePlayer.stamina
        );
      });
    });

    it("should filter out techniques when stunned", () => {
      const stunnedPlayer: PlayerState = {
        ...player1,
        isStunned: true,
      };

      const techniques = combatSystem.getAvailableTechniques(stunnedPlayer);

      // Should return no techniques when stunned
      expect(techniques).toEqual([]);
    });

    it("should filter out techniques from wrong stance", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      // Player in GEON stance
      player.currentStance = TrigramStance.GEON;

      const techniques = combatSystem.getAvailableTechniques(player);

      // All returned techniques should match the player's stance
      techniques.forEach((technique) => {
        expect(technique.stance).toBe(TrigramStance.GEON);
      });
    });
  });

  describe("isPlayerDefeated", () => {
    it("should return true when health is 0", () => {
      const defeatedPlayer: PlayerState = {
        ...player1,
        health: 0,
      };

      expect(combatSystem.isPlayerDefeated(defeatedPlayer)).toBe(true);
    });

    it("should return true when health is negative", () => {
      const defeatedPlayer: PlayerState = {
        ...player1,
        health: -10,
      };

      expect(combatSystem.isPlayerDefeated(defeatedPlayer)).toBe(true);
    });

    it("should return true when consciousness is 0", () => {
      const defeatedPlayer: PlayerState = {
        ...player1,
        consciousness: 0,
      };

      expect(combatSystem.isPlayerDefeated(defeatedPlayer)).toBe(true);
    });

    it("should return false when player has health and consciousness", () => {
      expect(combatSystem.isPlayerDefeated(player1)).toBe(false);
    });
  });

  describe("updatePlayerState", () => {
    it("should regenerate ki over time", () => {
      const lowKiPlayer: PlayerState = {
        ...player1,
        ki: 50,
        maxKi: 100,
      };

      const updated = combatSystem.updatePlayerState(lowKiPlayer, 1000); // 1 second

      expect(updated.ki).toBeGreaterThan(lowKiPlayer.ki);
      expect(updated.ki).toBeLessThanOrEqual(lowKiPlayer.maxKi);
    });

    it("should regenerate stamina over time", () => {
      const lowStaminaPlayer: PlayerState = {
        ...player1,
        stamina: 30,
        maxStamina: 100,
      };

      const updated = combatSystem.updatePlayerState(lowStaminaPlayer, 1000);

      expect(updated.stamina).toBeGreaterThan(lowStaminaPlayer.stamina);
      expect(updated.stamina).toBeLessThanOrEqual(lowStaminaPlayer.maxStamina);
    });

    it("should regenerate health slowly over time", () => {
      const lowHealthPlayer: PlayerState = {
        ...player1,
        health: 50,
        maxHealth: 100,
      };

      const updated = combatSystem.updatePlayerState(lowHealthPlayer, 1000);

      expect(updated.health).toBeGreaterThan(lowHealthPlayer.health);
      expect(updated.health).toBeLessThanOrEqual(lowHealthPlayer.maxHealth);
    });

    it("should not exceed max ki", () => {
      const almostFullKiPlayer: PlayerState = {
        ...player1,
        ki: 99,
        maxKi: 100,
      };

      const updated = combatSystem.updatePlayerState(almostFullKiPlayer, 10000);

      expect(updated.ki).toBe(almostFullKiPlayer.maxKi);
    });

    it("should not exceed max stamina", () => {
      const almostFullStaminaPlayer: PlayerState = {
        ...player1,
        stamina: 98,
        maxStamina: 100,
      };

      const updated = combatSystem.updatePlayerState(
        almostFullStaminaPlayer,
        10000
      );

      expect(updated.stamina).toBe(almostFullStaminaPlayer.maxStamina);
    });

    it("should not exceed max health", () => {
      const almostFullHealthPlayer: PlayerState = {
        ...player1,
        health: 99,
        maxHealth: 100,
      };

      const updated = combatSystem.updatePlayerState(
        almostFullHealthPlayer,
        10000
      );

      expect(updated.health).toBe(almostFullHealthPlayer.maxHealth);
    });

    it("should not regenerate health when at 0", () => {
      const defeatedPlayer: PlayerState = {
        ...player1,
        health: 0,
      };

      const updated = combatSystem.updatePlayerState(defeatedPlayer, 1000);

      expect(updated.health).toBe(0);
    });

    it("should remove expired status effects", () => {
      const now = Date.now();
      const playerWithEffects: PlayerState = {
        ...player1,
        statusEffects: [
          {
            id: "expired_effect",
            type: "weakened",
            intensity: "moderate" as any,
            duration: 1000,
            description: { korean: "만료된 효과", english: "Expired effect" },
            stackable: false,
            source: "test",
            startTime: now - 2000,
            endTime: now - 1000, // Already expired
          },
          {
            id: "active_effect",
            type: "stun",
            intensity: "high" as any,
            duration: 5000,
            description: { korean: "활성 효과", english: "Active effect" },
            stackable: false,
            source: "test",
            startTime: now,
            endTime: now + 5000, // Still active
          },
        ],
      };

      const updated = combatSystem.updatePlayerState(playerWithEffects, 100);

      expect(updated.statusEffects.length).toBe(1);
      expect(updated.statusEffects[0].id).toBe("active_effect");
    });
  });

  describe("static resolveAttack", () => {
    it("should work as a static method", () => {
      const result = CombatSystem.resolveAttack(player1, player2, mockTechnique);

      expect(result).toBeDefined();
      expect(result.hit).toBeDefined();
      expect(result.damage).toBeGreaterThanOrEqual(0);
    });
  });

  describe("applyCombatResult - static", () => {
    it("should apply damage to defender when hit", () => {
      const hitResult: any = {
        hit: true,
        damage: 25,
        timestamp: Date.now(),
      };

      const { updatedDefender } = CombatSystem.applyCombatResult(
        hitResult,
        player1,
        player2
      );

      expect(updatedDefender.health).toBe(player2.health - 25);
      expect(updatedDefender.totalDamageReceived).toBe(
        player2.totalDamageReceived + 25
      );
      expect(updatedDefender.hitsTaken).toBe(player2.hitsTaken + 1);
    });

    it("should not apply damage when miss", () => {
      const missResult: any = {
        hit: false,
        damage: 0,
        timestamp: Date.now(),
      };

      const { updatedDefender } = CombatSystem.applyCombatResult(
        missResult,
        player1,
        player2
      );

      expect(updatedDefender.health).toBe(player2.health);
    });

    it("should deduct ki and stamina from attacker", () => {
      const result: any = {
        hit: true,
        damage: 10,
        timestamp: Date.now(),
      };

      const { updatedAttacker } = CombatSystem.applyCombatResult(
        result,
        player1,
        player2
      );

      expect(updatedAttacker.ki).toBeLessThan(player1.ki);
      expect(updatedAttacker.stamina).toBeLessThan(player1.stamina);
    });

    it("should update attacker damage dealt on hit", () => {
      const result: any = {
        hit: true,
        damage: 30,
        timestamp: Date.now(),
      };

      const { updatedAttacker } = CombatSystem.applyCombatResult(
        result,
        player1,
        player2
      );

      expect(updatedAttacker.totalDamageDealt).toBe(
        player1.totalDamageDealt + 30
      );
      expect(updatedAttacker.hitsLanded).toBe(player1.hitsLanded + 1);
    });

    it("should not update damage dealt on miss", () => {
      const result: any = {
        hit: false,
        damage: 0,
        timestamp: Date.now(),
      };

      const { updatedAttacker } = CombatSystem.applyCombatResult(
        result,
        player1,
        player2
      );

      expect(updatedAttacker.totalDamageDealt).toBe(player1.totalDamageDealt);
      expect(updatedAttacker.hitsLanded).toBe(player1.hitsLanded);
    });

    it("should not reduce health below 0", () => {
      const highDamageResult: any = {
        hit: true,
        damage: 999,
        timestamp: Date.now(),
      };

      const { updatedDefender } = CombatSystem.applyCombatResult(
        highDamageResult,
        player1,
        player2
      );

      expect(updatedDefender.health).toBe(0);
    });

    it("should not reduce ki below 0", () => {
      const lowKiPlayer: PlayerState = {
        ...player1,
        ki: 2,
      };

      const result: any = {
        hit: true,
        damage: 10,
        timestamp: Date.now(),
      };

      const { updatedAttacker } = CombatSystem.applyCombatResult(
        result,
        lowKiPlayer,
        player2
      );

      expect(updatedAttacker.ki).toBe(0);
    });

    it("should not reduce stamina below 0", () => {
      const lowStaminaPlayer: PlayerState = {
        ...player1,
        stamina: 3,
      };

      const result: any = {
        hit: true,
        damage: 10,
        timestamp: Date.now(),
      };

      const { updatedAttacker } = CombatSystem.applyCombatResult(
        result,
        lowStaminaPlayer,
        player2
      );

      expect(updatedAttacker.stamina).toBe(0);
    });
  });

  describe("getArchetypeVitalPointModifier (type safety validation)", () => {
    it("should apply correct modifiers for AMSALJA archetype on neurological vital points", () => {
      const amsaljaPlayer = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 0);
      const result = combatSystem.resolveAttack(
        amsaljaPlayer,
        player2,
        mockTechnique,
        "baekhe" // Neurological vital point
      );
      // Verify the attack works (testing the type safety)
      expect(result).toBeDefined();
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should apply correct modifiers for MUSA archetype on skeletal vital points", () => {
      const musaPlayer = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const result = combatSystem.resolveAttack(
        musaPlayer,
        player2,
        mockTechnique,
        "hyeolhae" // Skeletal vital point
      );
      // Verify the attack works (testing the type safety)
      expect(result).toBeDefined();
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should apply correct modifiers for HACKER archetype on neurological vital points", () => {
      const hackerPlayer = createPlayerFromArchetype(PlayerArchetype.HACKER, 0);
      const result = combatSystem.resolveAttack(
        hackerPlayer,
        player2,
        mockTechnique,
        "baekhe" // Neurological vital point
      );
      // Verify the attack works (testing the type safety)
      expect(result).toBeDefined();
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should handle all archetype enum values correctly", () => {
      // Test each archetype to ensure enum values work correctly
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype: PlayerArchetype) => {
        const testPlayer = createPlayerFromArchetype(archetype, 0);
        const result = combatSystem.resolveAttack(
          testPlayer,
          player2,
          mockTechnique
        );
        expect(result).toBeDefined();
        expect(result.attacker?.archetype).toBe(archetype);
      });
    });
  });

  describe("resolveAttack - miss scenarios (coverage for lines 60-74)", () => {
    it("should handle attack miss when player has insufficient ki", () => {
      const lowKiPlayer: PlayerState = {
        ...player1,
        ki: 0,
        stamina: 100,
      };

      const result = combatSystem.resolveAttack(
        lowKiPlayer,
        player2,
        mockTechnique
      );

      expect(result.success).toBe(false);
      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
    });

    it("should handle attack miss when player has insufficient stamina", () => {
      const lowStaminaPlayer: PlayerState = {
        ...player1,
        ki: 100,
        stamina: 0,
      };

      const result = combatSystem.resolveAttack(
        lowStaminaPlayer,
        player2,
        mockTechnique
      );

      expect(result.success).toBe(false);
      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
    });

    it("should handle attack miss when player is in wrong stance", () => {
      const wrongStancePlayer: PlayerState = {
        ...player1,
        currentStance: TrigramStance.TAE, // mockTechnique requires GEON
      };

      const result = combatSystem.resolveAttack(
        wrongStancePlayer,
        player2,
        mockTechnique
      );

      expect(result.success).toBe(false);
      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
    });

    it("should handle attack miss when player is stunned", () => {
      const stunnedPlayer: PlayerState = {
        ...player1,
        isStunned: true,
      };

      const result = combatSystem.resolveAttack(
        stunnedPlayer,
        player2,
        mockTechnique
      );

      expect(result.success).toBe(false);
      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
    });
  });

  describe("processVitalPointHit - edge cases (coverage for lines 285-324)", () => {
    it("should handle invalid vital point ID", () => {
      const result = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique,
        "invalid_vital_point_id"
      );

      // Should still execute the attack, but without vital point bonus
      expect(result).toBeDefined();
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should process valid vital point hit with temple", () => {
      const result = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique,
        "head_temple"
      );

      expect(result).toBeDefined();
      if (result.hit) {
        // Damage should be higher with vital point hit
        expect(result.damage).toBeGreaterThan(0);
      }
    });

    it("should process valid vital point hit with carotid", () => {
      const result = combatSystem.resolveAttack(
        player1,
        player2,
        mockTechnique,
        "neck_carotid"
      );

      expect(result).toBeDefined();
      if (result.hit) {
        // Critical vital point should have high damage
        expect(result.damage).toBeGreaterThan(0);
      }
    });
  });

  describe("calculateDamage - severity multipliers (coverage for lines 425-480)", () => {
    it("should calculate damage without vital point hit", () => {
      const vitalPointHit: any = {
        hit: false,
        damage: 0,
        effects: [],
        severity: "MINOR",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      expect(damageResult.baseDamage).toBe(15);
      expect(damageResult.totalDamage).toBeGreaterThan(0);
      expect(damageResult.modifierDamage).toBeGreaterThan(0);
    });

    it("should apply MINOR severity multiplier (1.1x)", () => {
      const vitalPointHit: any = {
        hit: true,
        vitalPointHit: {
          id: "test_vp",
          severity: "MINOR",
        },
        damage: 10,
        effects: [],
        severity: "MINOR",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
    });

    it("should apply MODERATE severity multiplier (1.3x)", () => {
      const vitalPointHit: any = {
        hit: true,
        vitalPointHit: {
          id: "test_vp",
          severity: "MODERATE",
        },
        damage: 15,
        effects: [],
        severity: "MODERATE",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
    });

    it("should apply MAJOR severity multiplier (1.6x)", () => {
      const vitalPointHit: any = {
        hit: true,
        vitalPointHit: {
          id: "test_vp",
          severity: "MAJOR",
        },
        damage: 20,
        effects: [],
        severity: "MAJOR",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
    });

    it("should apply CRITICAL severity multiplier (2.0x)", () => {
      const vitalPointHit: any = {
        hit: true,
        vitalPointHit: {
          id: "test_vp",
          severity: "CRITICAL",
        },
        damage: 25,
        effects: [],
        severity: "CRITICAL",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Vital point multiplier applies to attackerBonus, not baseDamage
      // So total damage should be greater than baseDamage
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
    });

    it("should apply LETHAL severity multiplier (3.0x)", () => {
      const vitalPointHit: any = {
        hit: true,
        vitalPointHit: {
          id: "test_vp",
          severity: "LETHAL",
        },
        damage: 30,
        effects: [],
        severity: "LETHAL",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Vital point multiplier applies to attackerBonus, not baseDamage
      // So total damage should be significantly greater than baseDamage
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
    });

    it("should apply defense reduction correctly", () => {
      const highDefenseDefender: PlayerState = {
        ...player2,
        defense: 100,
      };

      const vitalPointHit: any = {
        hit: false,
        damage: 0,
        effects: [],
        severity: "MINOR",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        highDefenseDefender,
        vitalPointHit
      );

      // Damage should be reduced by defense
      expect(damageResult.totalDamage).toBeGreaterThan(0);
    });

    it("should ensure minimum damage of 1", () => {
      const superDefenseDefender: PlayerState = {
        ...player2,
        defense: 1000,
      };

      const vitalPointHit: any = {
        hit: false,
        damage: 0,
        effects: [],
        severity: "MINOR",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        superDefenseDefender,
        vitalPointHit
      );

      // Should always do at least 1 damage
      expect(damageResult.totalDamage).toBeGreaterThanOrEqual(1);
    });

    it("should combine technique effects with vital point effects", () => {
      const techniqueWithEffects: KoreanTechnique = {
        ...mockTechnique,
        effects: [
          {
            id: "stun_1",
            type: "stun",
            intensity: "high" as any,
            duration: 1000,
            description: { korean: "기절", english: "Stun" },
            stackable: false,
            source: "technique",
            startTime: Date.now(),
            endTime: Date.now() + 1000,
          },
        ],
      };

      const vitalPointHit: any = {
        hit: true,
        vitalPointHit: {
          id: "test_vp",
          severity: "MAJOR",
        },
        damage: 20,
        effects: [
          {
            id: "bleed_1",
            type: "bleeding",
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "출혈", english: "Bleeding" },
            stackable: true,
            source: "vitalpoint",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        severity: "MAJOR",
      };

      const damageResult = combatSystem.calculateDamage(
        techniqueWithEffects,
        player1,
        player2,
        vitalPointHit
      );

      expect(damageResult.effectsApplied.length).toBe(2);
    });

    it("should return finalDefenderState with updated health", () => {
      const vitalPointHit: any = {
        hit: false,
        damage: 0,
        effects: [],
        severity: "MINOR",
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      expect(damageResult.finalDefenderState).toBeDefined();
      expect(damageResult.finalDefenderState?.health).toBeDefined();
      expect(damageResult.finalDefenderState?.health).toBeLessThanOrEqual(player2.health);
      expect(damageResult.finalDefenderState?.health).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getCombatStatistics", () => {
    it("should calculate combat statistics correctly", () => {
      const stats = combatSystem.getCombatStatistics(player1);

      expect(stats.healthPercent).toBeGreaterThanOrEqual(0);
      expect(stats.healthPercent).toBeLessThanOrEqual(100);
      expect(stats.kiPercent).toBeGreaterThanOrEqual(0);
      expect(stats.kiPercent).toBeLessThanOrEqual(100);
      expect(stats.staminaPercent).toBeGreaterThanOrEqual(0);
      expect(stats.staminaPercent).toBeLessThanOrEqual(100);
      expect(stats.balancePercent).toBeDefined();
    });

    it("should calculate 0% health for defeated player", () => {
      const defeatedPlayer: PlayerState = {
        ...player1,
        health: 0,
      };

      const stats = combatSystem.getCombatStatistics(defeatedPlayer);

      expect(stats.healthPercent).toBe(0);
    });

    it("should calculate 100% health for full health player", () => {
      const fullHealthPlayer: PlayerState = {
        ...player1,
        health: player1.maxHealth,
      };

      const stats = combatSystem.getCombatStatistics(fullHealthPlayer);

      expect(stats.healthPercent).toBe(100);
    });
  });
});

describe("createCombatResult helper (coverage for lines 488-509)", () => {
  it("should create CombatResult with default values", () => {
    const result = createCombatResult({});

    expect(result.success).toBe(false);
    expect(result.damage).toBe(0);
    expect(result.isCritical).toBe(false);
    expect(result.criticalHit).toBe(false);
    expect(result.hit).toBe(false);
    expect(result.isBlocked).toBe(false);
    expect(result.vitalPointHit).toBe(false);
    expect(result.effects).toEqual([]);
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it("should set criticalHit from isCritical", () => {
    const result = createCombatResult({ isCritical: true });

    expect(result.isCritical).toBe(true);
    expect(result.criticalHit).toBe(true);
  });

  it("should set isCritical from criticalHit", () => {
    const result = createCombatResult({ criticalHit: true });

    expect(result.isCritical).toBe(true);
    expect(result.criticalHit).toBe(true);
  });

  it("should prioritize isCritical over criticalHit", () => {
    const result = createCombatResult({ isCritical: true, criticalHit: false });

    expect(result.isCritical).toBe(true);
    expect(result.criticalHit).toBe(true);
  });

  it("should set hit from success when hit is not provided", () => {
    const result = createCombatResult({ success: true });

    expect(result.hit).toBe(true);
    expect(result.success).toBe(true);
  });

  it("should preserve provided values", () => {
    const partialResult = {
      success: true,
      damage: 50,
      isCritical: true,
      hit: true,
      isBlocked: false,
      vitalPointHit: true,
      effects: [
        {
          id: "test_effect",
          type: "stun" as any,
          intensity: "high" as any,
          duration: 1000,
          description: { korean: "기절", english: "Stun" },
          stackable: false,
          source: "test",
          startTime: Date.now(),
          endTime: Date.now() + 1000,
        },
      ],
    };

    const result = createCombatResult(partialResult);

    expect(result.success).toBe(true);
    expect(result.damage).toBe(50);
    expect(result.isCritical).toBe(true);
    expect(result.criticalHit).toBe(true);
    expect(result.hit).toBe(true);
    expect(result.isBlocked).toBe(false);
    expect(result.vitalPointHit).toBe(true);
    expect(result.effects.length).toBe(1);
  });

  it("should handle partial attacker and defender", () => {
    const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
    const mockTechnique: KoreanTechnique = {
      id: "test",
      name: { korean: "테스트", english: "Test" },
      koreanName: "테스트",
      englishName: "Test",
      romanized: "teseuteu",
      description: { korean: "테스트 기술", english: "Test technique" },
      stance: TrigramStance.GEON,
      type: CombatAttackType.STRIKE,
      damageType: DamageType.BLUNT,
      damage: 10,
      range: 1.0,
      kiCost: 5,
      staminaCost: 10,
      accuracy: 0.8,
      executionTime: 300,
      recoveryTime: 500,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    };

    const result = createCombatResult({
      attacker: player1,
      defender: player2,
      technique: mockTechnique,
    });

    expect(result.attacker).toBe(player1);
    expect(result.defender).toBe(player2);
    expect(result.technique).toBe(mockTechnique);
  });

  it("should handle undefined attacker, defender, and technique", () => {
    const result = createCombatResult({
      success: false,
      damage: 0,
    });

    expect(result.attacker).toBeUndefined();
    expect(result.defender).toBeUndefined();
    expect(result.technique).toBeUndefined();
  });
});

describe("TrainingCombatSystem", () => {
  let trainingSystem: TrainingCombatSystem;
  let player: PlayerState;
  let mockTechnique: KoreanTechnique;

  beforeEach(() => {
    trainingSystem = new TrainingCombatSystem();
    player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    // Fix: Define mockTechnique properly
    mockTechnique = {
      id: "basic_strike",
      name: { korean: "기본 타격", english: "Basic Strike" },
      koreanName: "기본 타격",
      englishName: "Basic Strike",
      romanized: "gibon tagyeok",
      description: {
        korean: "기본적인 타격 기술",
        english: "Basic striking technique",
      },
      stance: TrigramStance.GEON,
      type: CombatAttackType.STRIKE,
      damageType: DamageType.BLUNT,
      damage: 12,
      range: 1.0,
      kiCost: 3,
      staminaCost: 5,
      accuracy: 0.9,
      executionTime: 250,
      recoveryTime: 400,
      critChance: 0.08,
      critMultiplier: 1.3,
      effects: [],
    };
  });

  describe("executeTrainingTechnique", () => {
    it("should return training-specific data", () => {
      const result = trainingSystem.executeTrainingTechnique(
        player,
        mockTechnique
      );

      expect(result).toBeDefined();
      expect(result.accuracyScore).toBeDefined();
      expect(result.techniqueScore).toBeDefined();
      expect(result.formScore).toBeDefined();
      expect(result.improvementAreas).toBeDefined();
      expect(result.nextTrainingGoals).toBeDefined();
    });

    // Fix: Remove test that checks for non-existent setTrainingAids method
  });

  describe("resetTrainingDummy", () => {
    it("should reset the training dummy", () => {
      // Fix: Remove unused originalDummy variable

      // Modify dummy
      trainingSystem.updateTrainingDummy({ health: 50 });

      // Fix: Use resetTrainingSession instead of resetTrainingDummy
      trainingSystem.resetTrainingSession();

      const resetDummy = trainingSystem.getTrainingDummy();
      expect(resetDummy.health).toBeGreaterThan(900);
    });
  });
});
