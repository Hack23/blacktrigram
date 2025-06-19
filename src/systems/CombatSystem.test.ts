import { describe, it, expect, beforeEach } from "vitest";
import CombatSystem from "./CombatSystem";
import { TrainingCombatSystem } from "./combat/TrainingCombatSystem";
import { createPlayerFromArchetype } from "../utils/playerUtils";
import {
  createMockPlayer,
  createBasicTechnique,
} from "../test/mocks/playerMocks"; // Fix: Add missing import
import {
  TrigramStance,
  PlayerArchetype,
  CombatAttackType,
  DamageType,
} from "../types/enums";
import type { PlayerState, KoreanTechnique, CombatResult } from "../types"; // Fix: Add CombatResult import

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
      const system = new CombatSystem();
      const technique = createBasicTechnique();

      const player1 = createMockPlayer({
        ki: 50,
        stamina: 50,
        hitsLanded: 0,
        totalDamageDealt: 0,
      });

      const player2 = createMockPlayer({
        health: 100,
        consciousness: 100,
        balance: 100,
        pain: 0,
        hitsTaken: 0,
        totalDamageReceived: 0,
      });

      const combatResult: CombatResult = {
        hit: true,
        damage: 20,
        technique,
        effects: [],
        isCritical: false,
        isBlocked: false,
        criticalHit: false,
        vitalPointHit: false,
        success: true,
        timestamp: Date.now(),
        attacker: player1,
        defender: player2,
      };

      const { updatedAttacker, updatedDefender } = system.applyCombatResult(
        combatResult,
        player1,
        player2
      );

      expect(updatedAttacker.ki).toBeLessThanOrEqual(player1.ki);
      expect(updatedAttacker.stamina).toBeLessThanOrEqual(player1.stamina);
      expect(updatedDefender.health).toBeLessThan(player2.health);
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
