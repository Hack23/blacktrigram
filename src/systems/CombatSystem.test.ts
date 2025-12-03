import { beforeEach, describe, expect, it } from "vitest";
import type { PlayerState } from "../types";
import {
  CombatAttackType,
  DamageType,
  PlayerArchetype,
  TrigramStance,
  VitalPointSeverity,
  VitalPointCategory,
} from "../types/common";
import { createPlayerFromArchetype } from "../utils/playerUtils";
import CombatSystem, { createCombatResult } from "./CombatSystem";
import { TrainingCombatSystem } from "./combat/TrainingCombatSystem";
import { EffectIntensity } from "./effects";
import { KoreanTechnique, VitalPoint } from "./vitalpoint";

// Helper function to create mock VitalPoint objects for testing
function createMockVitalPoint(
  severity: VitalPointSeverity,
  category: VitalPointCategory = VitalPointCategory.NEUROLOGICAL
): VitalPoint {
  return {
    id: `test_vitalpoint_${severity}`,
    names: {
      korean: "테스트 혈점",
      english: "Test Vital Point",
      romanized: "teseuteu hyeoljeom",
    },
    position: { x: 100, y: 100 },
    category,
    severity,
    baseDamage: 20,
    effects: [],
    description: {
      korean: "테스트용 혈점",
      english: "Test vital point for testing",
      romanized: "teseuteuyong hyeoljeom",
    },
    targetingDifficulty: 0.5,
    effectiveStances: [],
  };
}

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
            intensity: EffectIntensity.MODERATE,
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
            intensity: EffectIntensity.HIGH,
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

    it("should handle miss scenario in executeAttack (line 375)", () => {
      // Create a technique with very low accuracy to force misses
      const lowAccuracyTechnique: KoreanTechnique = {
        ...mockTechnique,
        accuracy: 0.001, // Very low accuracy (0.1%) to force misses
      };

      // Run multiple times to ensure we get at least one miss
      let missFound = false;
      for (let i = 0; i < 50; i++) {
        const result = CombatSystem.resolveAttack(player1, player2, lowAccuracyTechnique);
        if (!result.hit) {
          missFound = true;
          // Verify the miss result structure (covers line 375)
          expect(result.hit).toBe(false);
          expect(result.damage).toBe(0);
          expect(result.criticalHit).toBe(false);
          expect(result.vitalPointHit).toBe(false);
          expect(result.effects).toEqual([]);
          expect(result.timestamp).toBeGreaterThan(0);
          break;
        }
      }

      // With 0.1% accuracy, we should definitely get a miss in 50 attempts
      expect(missFound).toBe(true);
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

  // NOTE: getArchetypeVitalPointModifier tests are obsolete. Method has been replaced by 
  // VitalPointSystem + EffectCalculator for comprehensive effect calculation.
  describe.skip("getArchetypeVitalPointModifier (type safety validation) - OBSOLETE", () => {
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

    it("should apply 1.3x modifier for AMSALJA on neurological vital point hit (line 352 - true branch)", () => {
      const amsaljaPlayer = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 0);
      // Use head_temple which is a neurological vital point
      const result = combatSystem.resolveAttack(
        amsaljaPlayer,
        player2,
        mockTechnique,
        "head_temple" // Temple is neurological category
      );
      
      // When the attack hits a neurological point with AMSALJA, line 352 executes
      expect(result).toBeDefined();
      if (result.hit && result.vitalPointHit) {
        // AMSALJA should get bonus damage on neurological points
        expect(result.damage).toBeGreaterThan(0);
      }
    });

    it("should apply base modifier (1.0) for AMSALJA on NON-neurological vital point (line 352 - false branch)", () => {
      const amsaljaPlayer = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 0);
      // Ensure player is in correct stance and has resources
      amsaljaPlayer.currentStance = TrigramStance.GEON;
      amsaljaPlayer.ki = 100;
      amsaljaPlayer.stamina = 100;
      amsaljaPlayer.isStunned = false;
      
      // Mock Math.random to ensure hit (need >0 but <accuracy to hit)
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5); // 50% will hit with 85% accuracy
      
      try {
        // Use neck_carotid which is a vascular (not neurological) vital point
        const result = combatSystem.resolveAttack(
          amsaljaPlayer,
          player2,
          mockTechnique,
          "neck_carotid" // Carotid is vascular category, not neurological
        );
        
        // When AMSALJA hits a non-neurological point, should use baseModifier (line 352 false branch)
        expect(result).toBeDefined();
        expect(result.hit).toBe(true); // Should hit with mocked random
        expect(result.damage).toBeGreaterThan(0);
      } finally {
        randomSpy.mockRestore();
      }
    });

    it("should apply 1.1x modifier for HACKER on neurological vital point hit (line 356 - true branch)", () => {
      const hackerPlayer = createPlayerFromArchetype(PlayerArchetype.HACKER, 0);
      // Use head_temple which is a neurological vital point
      const result = combatSystem.resolveAttack(
        hackerPlayer,
        player2,
        mockTechnique,
        "head_temple" // Temple is neurological category
      );
      
      // When the attack hits a neurological point with HACKER, line 356 executes
      expect(result).toBeDefined();
      if (result.hit && result.vitalPointHit) {
        // HACKER should get bonus damage on neurological points
        expect(result.damage).toBeGreaterThan(0);
      }
    });

    it("should apply base modifier (1.0) for HACKER on NON-neurological vital point (line 356 - false branch)", () => {
      const hackerPlayer = createPlayerFromArchetype(PlayerArchetype.HACKER, 0);
      // Ensure player is in correct stance and has resources
      hackerPlayer.currentStance = TrigramStance.GEON;
      hackerPlayer.ki = 100;
      hackerPlayer.stamina = 100;
      hackerPlayer.isStunned = false;
      
      // Mock Math.random to ensure hit
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5); // 50% will hit with 85% accuracy
      
      try {
        // Use neck_carotid which is a vascular (not neurological) vital point
        const result = combatSystem.resolveAttack(
          hackerPlayer,
          player2,
          mockTechnique,
          "neck_carotid" // Carotid is vascular category, not neurological
        );
        
        // When HACKER hits a non-neurological point, should use baseModifier (line 356 false branch)
        expect(result).toBeDefined();
        expect(result.hit).toBe(true); // Should hit with mocked random
        expect(result.damage).toBeGreaterThan(0);
      } finally {
        randomSpy.mockRestore();
      }
    });

    it("should use base modifier (1.0) for JEONGBO_YOWON archetype (lines 357-358)", () => {
      const jeongboPlayer = createPlayerFromArchetype(PlayerArchetype.JEONGBO_YOWON, 0);
      // Ensure player is in correct stance and has resources
      jeongboPlayer.currentStance = TrigramStance.GEON;
      jeongboPlayer.ki = 100;
      jeongboPlayer.stamina = 100;
      jeongboPlayer.isStunned = false;
      
      // Mock Math.random to ensure hit
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      try {
        // Test with a vital point hit to trigger modifier calculation
        const result = combatSystem.resolveAttack(
          jeongboPlayer,
          player2,
          mockTechnique,
          "head_temple"
        );
        
        // JEONGBO_YOWON doesn't have special modifiers, so default case applies (lines 357-358)
        expect(result).toBeDefined();
        expect(result.hit).toBe(true);
        expect(result.timestamp).toBeGreaterThan(0);
      } finally {
        randomSpy.mockRestore();
      }
    });

    it("should use base modifier (1.0) for JOJIK_POKRYEOKBAE archetype (lines 357-358)", () => {
      const jojikPlayer = createPlayerFromArchetype(PlayerArchetype.JOJIK_POKRYEOKBAE, 0);
      // Ensure player is in correct stance and has resources
      jojikPlayer.currentStance = TrigramStance.GEON;
      jojikPlayer.ki = 100;
      jojikPlayer.stamina = 100;
      jojikPlayer.isStunned = false;
      
      // Mock Math.random to ensure hit
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      try {
        // Test with a vital point hit to trigger modifier calculation
        const result = combatSystem.resolveAttack(
          jojikPlayer,
          player2,
          mockTechnique,
          "head_temple"
        );
        
        // JOJIK_POKRYEOKBAE doesn't have special modifiers, so default case applies (lines 357-358)
        expect(result).toBeDefined();
        expect(result.hit).toBe(true);
        expect(result.timestamp).toBeGreaterThan(0);
      } finally {
        randomSpy.mockRestore();
      }
    });

    it("should handle invalid archetype gracefully (lines 337-338)", () => {
      const playerWithInvalidArchetype = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      // Force an invalid archetype value for testing error handling
      (playerWithInvalidArchetype as any).archetype = "INVALID_ARCHETYPE" as any;
      playerWithInvalidArchetype.currentStance = TrigramStance.GEON;
      playerWithInvalidArchetype.ki = 100;
      playerWithInvalidArchetype.stamina = 100;
      playerWithInvalidArchetype.isStunned = false;
      
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      try {
        const result = combatSystem.resolveAttack(
          playerWithInvalidArchetype,
          player2,
          mockTechnique,
          "head_temple"
        );
        
        // Should still execute attack but with base modifier
        expect(result).toBeDefined();
        // Verify warning was logged (lines 337-338 executed)
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining("Invalid archetype provided")
        );
      } finally {
        randomSpy.mockRestore();
        consoleWarnSpy.mockRestore();
      }
    });

    it("should handle invalid vital point gracefully (lines 342-343)", () => {
      const amsaljaPlayer = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 0);
      amsaljaPlayer.currentStance = TrigramStance.GEON;
      amsaljaPlayer.ki = 100;
      amsaljaPlayer.stamina = 100;
      amsaljaPlayer.isStunned = false;
      
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock getVitalPointById to return an invalid vital point structure (missing required fields)
      const getByIdSpy = vi.spyOn(combatSystem['vitalPointSystem'], 'getVitalPointById')
        .mockReturnValue({
          id: "invalid",
          names: { korean: "invalid", english: "invalid", romanized: "invalid" },
          position: { x: 0, y: 0 },
          effects: [], // Include effects to avoid crash, but structure is still invalid for isVitalPoint check
          // Missing severity, baseDamage, category, etc. to make it invalid
        } as any);
      
      try {
        const result = combatSystem.resolveAttack(
          amsaljaPlayer,
          player2,
          mockTechnique,
          "invalid_vital_point"
        );
        
        // Should still execute attack but with warning
        expect(result).toBeDefined();
        // Verify warning was logged (lines 342-343 executed)
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          "Invalid vital point provided:",
          expect.anything(),
          "using base modifier"
        );
      } finally {
        randomSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        getByIdSpy.mockRestore();
      }
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
      const vitalPointHit = {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
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
      const mockVitalPoint = createMockVitalPoint(VitalPointSeverity.MINOR);
      const vitalPointHit = {
        hit: true,
        damage: 10,
        effects: [],
        severity: VitalPointSeverity.MINOR,
        vitalPointHit: mockVitalPoint,
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Calculate expected modifier damage with 1.1x multiplier
      const expectedAttackerBonus = player1.attackPower * 0.1;
      const expectedModifierWithMultiplier = expectedAttackerBonus * 1.1;
      
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
      expect(damageResult.modifierDamage).toBeCloseTo(expectedModifierWithMultiplier, 1);
    });

    it("should apply MODERATE severity multiplier (1.3x)", () => {
      const mockVitalPoint = createMockVitalPoint(VitalPointSeverity.MODERATE);
      const vitalPointHit = {
        hit: true,
        damage: 15,
        effects: [],
        severity: VitalPointSeverity.MODERATE,
        vitalPointHit: mockVitalPoint,
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Calculate expected modifier damage with 1.3x multiplier
      const expectedAttackerBonus = player1.attackPower * 0.1;
      const expectedModifierWithMultiplier = expectedAttackerBonus * 1.3;
      
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
      expect(damageResult.modifierDamage).toBeCloseTo(expectedModifierWithMultiplier, 1);
    });

    it("should apply MAJOR severity multiplier (1.6x)", () => {
      const mockVitalPoint = createMockVitalPoint(VitalPointSeverity.MAJOR);
      const vitalPointHit = {
        hit: true,
        damage: 20,
        effects: [],
        severity: VitalPointSeverity.MAJOR,
        vitalPointHit: mockVitalPoint,
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Calculate expected modifier damage with 1.6x multiplier
      const expectedAttackerBonus = player1.attackPower * 0.1;
      const expectedModifierWithMultiplier = expectedAttackerBonus * 1.6;
      
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
      expect(damageResult.modifierDamage).toBeCloseTo(expectedModifierWithMultiplier, 1);
    });

    it("should apply CRITICAL severity multiplier (2.0x)", () => {
      const mockVitalPoint = createMockVitalPoint(VitalPointSeverity.CRITICAL);
      const vitalPointHit = {
        hit: true,
        damage: 25,
        effects: [],
        severity: VitalPointSeverity.CRITICAL,
        vitalPointHit: mockVitalPoint,
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Calculate expected modifier damage with 2.0x multiplier
      const expectedAttackerBonus = player1.attackPower * 0.1;
      const expectedModifierWithMultiplier = expectedAttackerBonus * 2.0;
      
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
      expect(damageResult.modifierDamage).toBeCloseTo(expectedModifierWithMultiplier, 1);
    });

    it("should apply LETHAL severity multiplier (3.0x)", () => {
      const mockVitalPoint = createMockVitalPoint(VitalPointSeverity.LETHAL);
      const vitalPointHit = {
        hit: true,
        damage: 30,
        effects: [],
        severity: VitalPointSeverity.LETHAL,
        vitalPointHit: mockVitalPoint,
      };

      const damageResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Calculate expected modifier damage with 3.0x multiplier
      const expectedAttackerBonus = player1.attackPower * 0.1;
      const expectedModifierWithMultiplier = expectedAttackerBonus * 3.0;
      
      expect(damageResult.totalDamage).toBeGreaterThan(damageResult.baseDamage);
      expect(damageResult.modifierDamage).toBeCloseTo(expectedModifierWithMultiplier, 1);
    });

    it("should apply defense reduction correctly", () => {
      const vitalPointHit = {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };

      // Calculate damage with normal defense
      const normalDefenseResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        player2,
        vitalPointHit
      );

      // Calculate damage with high defense
      const highDefenseDefender: PlayerState = {
        ...player2,
        defense: 100,
      };

      const highDefenseResult = combatSystem.calculateDamage(
        mockTechnique,
        player1,
        highDefenseDefender,
        vitalPointHit
      );

      // High defense should result in lower damage
      expect(highDefenseResult.totalDamage).toBeLessThan(normalDefenseResult.totalDamage);
      expect(highDefenseResult.totalDamage).toBeGreaterThan(0);
    });

    it("should ensure minimum damage of 1", () => {
      const superDefenseDefender: PlayerState = {
        ...player2,
        defense: 1000,
      };

      const vitalPointHit = {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
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
            intensity: EffectIntensity.HIGH,
            duration: 1000,
            description: { korean: "기절", english: "Stun" },
            stackable: false,
            source: "technique",
            startTime: Date.now(),
            endTime: Date.now() + 1000,
          },
        ],
      };

      const mockVitalPoint = createMockVitalPoint(VitalPointSeverity.MAJOR);
      const vitalPointHit = {
        hit: true,
        damage: 20,
        effects: [
          {
            id: "bleed_1",
            type: "bleed",
            intensity: EffectIntensity.MODERATE,
            duration: 2000,
            description: { korean: "출혈", english: "Bleeding" },
            stackable: true,
            source: "vitalpoint",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        severity: VitalPointSeverity.MAJOR,
        vitalPointHit: mockVitalPoint,
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
      const vitalPointHit = {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
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
          type: "stun",
          intensity: EffectIntensity.HIGH,
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
