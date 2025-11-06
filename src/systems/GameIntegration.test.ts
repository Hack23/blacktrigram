import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../types";
import CombatSystem from "./CombatSystem";
import { TrigramSystem } from "./TrigramSystem";
import { VitalPointSystem } from "./VitalPointSystem";
import { createPlayerFromArchetype, updatePlayerState } from "../utils/playerUtils";
import type { PlayerState } from "./player";

describe("Game Systems Integration", () => {
  let combatSystem: CombatSystem;
  let trigramSystem: TrigramSystem;
  let vitalPointSystem: VitalPointSystem;
  let player1: PlayerState;
  let player2: PlayerState;

  beforeEach(() => {
    combatSystem = new CombatSystem();
    trigramSystem = new TrigramSystem();
    vitalPointSystem = new VitalPointSystem();
    player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
  });

  describe("Combat System + Trigram System Integration", () => {
    it("should integrate stance effectiveness in combat", () => {
      // Get stance data
      const player1Stance = trigramSystem.getCurrentStanceData(player1.currentStance);
      const player2Stance = trigramSystem.getCurrentStanceData(player2.currentStance);

      expect(player1Stance).toBeDefined();
      expect(player2Stance).toBeDefined();

      // Calculate effectiveness
      const effectiveness = trigramSystem.calculateStanceEffectiveness(
        player1.currentStance,
        player2.currentStance
      );

      expect(effectiveness).toBeGreaterThan(0);
      expect(effectiveness).toBeLessThanOrEqual(2);
    });

    it("should validate stance transitions during combat", () => {
      const targetStance = TrigramStance.TAE;
      
      const canTransition = trigramSystem.canTransitionTo(
        player1.currentStance,
        targetStance,
        player1
      );

      expect(canTransition).toBeDefined();

      const transitionCost = trigramSystem.getTransitionCost(
        player1.currentStance,
        targetStance,
        player1
      );

      expect(transitionCost.ki).toBeGreaterThanOrEqual(0);
      expect(transitionCost.stamina).toBeGreaterThanOrEqual(0);
      expect(transitionCost.timeMilliseconds).toBeGreaterThanOrEqual(0);
    });

    it("should recommend optimal stance based on player state", () => {
      const recommendedStance = trigramSystem.recommendStance(player1);

      expect(Object.values(TrigramStance)).toContain(recommendedStance);
    });

    it("should execute technique from available techniques", () => {
      const techniques = combatSystem.getAvailableTechniques(player1);

      expect(techniques).toBeDefined();
      expect(Array.isArray(techniques)).toBe(true);

      if (techniques.length > 0) {
        const technique = techniques[0];
        const result = combatSystem.resolveAttack(player1, player2, technique);

        expect(result).toBeDefined();
        expect(result.technique).toBeDefined();
        expect(result.timestamp).toBeGreaterThan(0);
      }
    });
  });

  describe("Combat System + Vital Point System Integration", () => {
    it("should integrate vital point hits in combat resolution", () => {
      const techniques = combatSystem.getAvailableTechniques(player1);
      
      if (techniques.length > 0) {
        const technique = techniques[0];
        const result = combatSystem.resolveAttack(player1, player2, technique);

        // Check if vital point hit occurred
        expect(result.vitalPointHit).toBeDefined();
        
        if (result.vitalPointHit) {
          expect(result.damage).toBeGreaterThan(0);
        }
      }
    });

    it("should process vital point hits with position data", () => {
      const hitPosition = { x: 100, y: 50 };
      const hitBox = { width: 10, height: 10 };

      const vitalResult = vitalPointSystem.processHit(hitPosition, hitBox);

      expect(vitalResult).toBeDefined();
      expect(vitalResult.hit).toBeDefined();
      expect(vitalResult.severity).toBeDefined();
    });

    it("should calculate damage with vital point multipliers", () => {
      const vitalPoints = vitalPointSystem.getVitalPoints();
      
      if (vitalPoints.length > 0) {
        const vitalPoint = vitalPoints[0];
        expect(vitalPoint.baseDamage).toBeDefined();
        expect(vitalPoint.severity).toBeDefined();
      }
    });
  });

  describe("Full Combat Flow Integration", () => {
    it("should execute complete attack sequence", () => {
      // Get available techniques
      const techniques = combatSystem.getAvailableTechniques(player1);
      expect(techniques.length).toBeGreaterThan(0);

      // Execute attack
      const technique = techniques[0];
      const attackResult = combatSystem.resolveAttack(player1, player2, technique);

      expect(attackResult).toBeDefined();
      expect(attackResult.hit).toBeDefined();
      expect(attackResult.damage).toBeGreaterThanOrEqual(0);

      // Apply combat result
      const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
        attackResult,
        player1,
        player2
      );

      expect(updatedAttacker).toBeDefined();
      expect(updatedDefender).toBeDefined();

      // Verify state changes
      if (attackResult.hit) {
        expect(updatedDefender.health).toBeLessThanOrEqual(player2.health);
      }
      expect(updatedAttacker.ki).toBeLessThanOrEqual(player1.ki);
      expect(updatedAttacker.stamina).toBeLessThanOrEqual(player1.stamina);
    });

    it("should handle stance change then attack sequence", () => {
      const newStance = TrigramStance.LI;

      // Validate transition
      const validation = trigramSystem.validateTransition(
        player1.currentStance,
        newStance,
        player1
      );

      if (validation.valid) {
        // Get transition cost
        const cost = trigramSystem.getTransitionCost(
          player1.currentStance,
          newStance,
          player1
        );

        // Apply stance change
        const updatedPlayer = updatePlayerState(player1, {
          currentStance: newStance,
          ki: player1.ki - cost.ki,
          stamina: player1.stamina - cost.stamina,
        });

        expect(updatedPlayer.currentStance).toBe(newStance);

        // Now attack from new stance
        const techniques = combatSystem.getAvailableTechniques(updatedPlayer);
        if (techniques.length > 0) {
          const result = combatSystem.resolveAttack(
            updatedPlayer,
            player2,
            techniques[0]
          );
          expect(result).toBeDefined();
        }
      }
    });

    it("should handle multiple combat rounds", () => {
      let currentPlayer1 = player1;
      let currentPlayer2 = player2;
      const rounds = 3;

      for (let i = 0; i < rounds; i++) {
        const techniques = combatSystem.getAvailableTechniques(currentPlayer1);
        if (techniques.length === 0) break;

        const result = combatSystem.resolveAttack(
          currentPlayer1,
          currentPlayer2,
          techniques[0]
        );

        const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
          result,
          currentPlayer1,
          currentPlayer2
        );

        currentPlayer1 = updatedAttacker;
        currentPlayer2 = updatedDefender;

        // Stop if player is defeated
        if (currentPlayer2.health <= 0) break;
      }

      // Verify state after multiple rounds
      expect(currentPlayer1.totalDamageDealt).toBeGreaterThanOrEqual(0);
      expect(currentPlayer2.totalDamageReceived).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Player Archetype Interactions", () => {
    it("should demonstrate different archetypes combat differently", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      const attackResults = archetypes.map((archetype) => {
        const attacker = createPlayerFromArchetype(archetype, 0);
        const defender = createPlayerFromArchetype(PlayerArchetype.MUSA, 1);
        const techniques = combatSystem.getAvailableTechniques(attacker);

        if (techniques.length > 0) {
          return combatSystem.resolveAttack(attacker, defender, techniques[0]);
        }
        return null;
      });

      // Verify all archetypes can attack
      const validResults = attackResults.filter((r) => r !== null);
      expect(validResults.length).toBe(archetypes.length);
    });

    it("should maintain archetype-specific stances", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
      ];

      archetypes.forEach((archetype) => {
        const player = createPlayerFromArchetype(archetype, 0);
        const stanceData = trigramSystem.getCurrentStanceData(player.currentStance);

        expect(stanceData).toBeDefined();
        expect(stanceData?.id).toBe(player.currentStance);
      });
    });
  });

  describe("Resource Management Integration", () => {
    it("should deplete resources during combat", () => {
      const techniques = combatSystem.getAvailableTechniques(player1);
      expect(techniques.length).toBeGreaterThan(0);

      const initialKi = player1.ki;
      const initialStamina = player1.stamina;

      const result = combatSystem.resolveAttack(player1, player2, techniques[0]);
      const { updatedAttacker } = combatSystem.applyCombatResult(
        result,
        player1,
        player2
      );

      expect(updatedAttacker.ki).toBeLessThanOrEqual(initialKi);
      expect(updatedAttacker.stamina).toBeLessThanOrEqual(initialStamina);
    });

    it("should prevent techniques when resources are insufficient", () => {
      const exhaustedPlayer = updatePlayerState(player1, { ki: 0, stamina: 0 });

      const techniques = combatSystem.getAvailableTechniques(exhaustedPlayer);

      // Should have no available techniques or only very low-cost ones
      techniques.forEach((technique) => {
        expect(technique.kiCost).toBeLessThanOrEqual(exhaustedPlayer.ki);
        expect(technique.staminaCost).toBeLessThanOrEqual(exhaustedPlayer.stamina);
      });
    });

    it("should validate stance transition costs", () => {
      const targetStance = TrigramStance.GAM;
      const cost = trigramSystem.getTransitionCost(
        player1.currentStance,
        targetStance,
        player1
      );

      const canAfford =
        player1.ki >= cost.ki && player1.stamina >= cost.stamina;

      const canTransition = trigramSystem.canTransitionTo(
        player1.currentStance,
        targetStance,
        player1
      );

      expect(canTransition).toBe(canAfford);
    });
  });

  describe("Combat State Progression", () => {
    it("should track combat statistics", () => {
      let currentPlayer1 = player1;
      let currentPlayer2 = player2;

      const techniques = combatSystem.getAvailableTechniques(currentPlayer1);
      if (techniques.length > 0) {
        const result = combatSystem.resolveAttack(
          currentPlayer1,
          currentPlayer2,
          techniques[0]
        );

        const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
          result,
          currentPlayer1,
          currentPlayer2
        );

        if (result.hit) {
          expect(updatedAttacker.hitsLanded).toBeGreaterThan(currentPlayer1.hitsLanded);
          expect(updatedDefender.hitsTaken).toBeGreaterThan(currentPlayer2.hitsTaken);
        }
      }
    });

    it("should handle defeat condition", () => {
      const criticallyDamaged = updatePlayerState(player2, { health: 1 });

      const techniques = combatSystem.getAvailableTechniques(player1);
      if (techniques.length > 0) {
        const result = combatSystem.resolveAttack(
          player1,
          criticallyDamaged,
          techniques[0]
        );

        const { updatedDefender } = combatSystem.applyCombatResult(
          result,
          player1,
          criticallyDamaged
        );

        if (result.hit && result.damage > 0) {
          expect(updatedDefender.health).toBeLessThanOrEqual(0);
        }
      }
    });
  });

  describe("System Synchronization", () => {
    it("should maintain consistency across all systems", () => {
      // Execute combat action
      const techniques = combatSystem.getAvailableTechniques(player1);
      if (techniques.length === 0) return;

      const result = combatSystem.resolveAttack(player1, player2, techniques[0]);
      const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
        result,
        player1,
        player2
      );

      // Verify trigram system consistency
      const stanceData = trigramSystem.getCurrentStanceData(updatedAttacker.currentStance);
      expect(stanceData?.id).toBe(updatedAttacker.currentStance);

      // Verify player state consistency
      expect(updatedAttacker.health).toBeGreaterThanOrEqual(0);
      expect(updatedAttacker.health).toBeLessThanOrEqual(updatedAttacker.maxHealth);
      expect(updatedAttacker.ki).toBeGreaterThanOrEqual(0);
      expect(updatedAttacker.ki).toBeLessThanOrEqual(updatedAttacker.maxKi);
      expect(updatedDefender.health).toBeGreaterThanOrEqual(0);
      expect(updatedDefender.health).toBeLessThanOrEqual(updatedDefender.maxHealth);
    });

    it("should maintain Korean text consistency", () => {
      const techniques = combatSystem.getAvailableTechniques(player1);

      techniques.forEach((technique) => {
        expect(technique.name).toBeDefined();
        expect(technique.name.korean).toBeDefined();
        expect(technique.name.english).toBeDefined();
        expect(technique.description).toBeDefined();
        expect(technique.description.korean).toBeDefined();
        expect(technique.description.english).toBeDefined();
      });
    });
  });
});
