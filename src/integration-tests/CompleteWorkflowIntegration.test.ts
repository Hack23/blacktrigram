/**
 * Complete Workflow Integration Tests
 * 
 * Tests comprehensive end-to-end workflows across all systems,
 * verifying proper integration and state management throughout
 * complete game scenarios.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../types";
import CombatSystem from "../systems/CombatSystem";
import { TrigramSystem } from "../systems/TrigramSystem";
import { VitalPointSystem } from "../systems/VitalPointSystem";
import { createPlayerFromArchetype, updatePlayerState, applyDamage } from "../utils/playerUtils";
import type { PlayerState } from "../systems";

describe("Complete Workflow Integration", () => {
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

  describe("Complete Combat Match Workflow", () => {
    it("should execute a complete 5-round combat match", () => {
      let currentPlayer1 = player1;
      let currentPlayer2 = player2;
      const rounds = 5;
      const combatLog: string[] = [];

      for (let round = 0; round < rounds && currentPlayer2.health > 0; round++) {
        // Get available techniques
        const techniques = combatSystem.getAvailableTechniques(currentPlayer1);
        expect(techniques.length).toBeGreaterThan(0);

        // Execute attack
        const technique = techniques[0];
        const result = combatSystem.resolveAttack(
          currentPlayer1,
          currentPlayer2,
          technique
        );

        // Log the action
        combatLog.push(
          `Round ${round + 1}: ${technique.name.korean} (${technique.name.english})`
        );

        // Apply results
        const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
          result,
          currentPlayer1,
          currentPlayer2
        );

        currentPlayer1 = updatedAttacker;
        currentPlayer2 = updatedDefender;

        // Verify state integrity after each round
        expect(currentPlayer1.health).toBeGreaterThanOrEqual(0);
        expect(currentPlayer1.ki).toBeGreaterThanOrEqual(0);
        expect(currentPlayer1.stamina).toBeGreaterThanOrEqual(0);
        expect(currentPlayer2.health).toBeGreaterThanOrEqual(0);
      }

      // Verify combat progression
      expect(combatLog.length).toBeLessThanOrEqual(rounds);
      expect(currentPlayer1.totalDamageDealt).toBeGreaterThan(0);
      expect(currentPlayer2.totalDamageReceived).toBeGreaterThan(0);
    });

    it("should handle complete match with stance changes between rounds", () => {
      let currentPlayer1 = player1;
      let currentPlayer2 = player2;
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
      ];

      for (let round = 0; round < 4 && currentPlayer2.health > 0; round++) {
        const targetStance = stances[round];

        // Validate stance transition
        const validation = trigramSystem.validateTransition(
          currentPlayer1.currentStance,
          targetStance,
          currentPlayer1
        );

        if (validation.valid) {
          const cost = trigramSystem.getTransitionCost(
            currentPlayer1.currentStance,
            targetStance,
            currentPlayer1
          );

          // Apply stance change
          currentPlayer1 = updatePlayerState(currentPlayer1, {
            currentStance: targetStance,
            ki: currentPlayer1.ki - cost.ki,
            stamina: currentPlayer1.stamina - cost.stamina,
          });

          expect(currentPlayer1.currentStance).toBe(targetStance);
        }

        // Execute attack from current stance
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

          currentPlayer1 = updatedAttacker;
          currentPlayer2 = updatedDefender;
        }
      }

      // Verify stance progression occurred
      expect(currentPlayer1.currentStance).not.toBe(player1.currentStance);
    });

    it("should complete match with vital point targeting", () => {
      let currentPlayer1 = player1;
      let currentPlayer2 = player2;
      const vitalPointAttempts: string[] = [];

      for (let round = 0; round < 3 && currentPlayer2.health > 0; round++) {
        // Get vital points
        const vitalPoints = vitalPointSystem.getVitalPoints();
        expect(vitalPoints.length).toBeGreaterThan(0);

        // Simulate targeting vital point
        const targetPoint = vitalPoints[round % vitalPoints.length];
        const hitPosition = { x: targetPoint.position.x, y: targetPoint.position.y };
        const hitBox = { width: 10, height: 10 };

        const vitalResult = vitalPointSystem.processHit(hitPosition, hitBox);
        vitalPointAttempts.push(targetPoint.names?.korean || targetPoint.id);

        // Track hits
        if (vitalResult.hit && vitalResult.vitalPointHit) {
          // Successfully hit vital point
          expect(vitalResult.vitalPointHit?.names?.korean || vitalResult.vitalPointHit?.id).toBeDefined();
        }

        // Execute normal combat
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

          currentPlayer1 = updatedAttacker;
          currentPlayer2 = updatedDefender;
        }
      }

      // Verify vital point targeting was attempted
      expect(vitalPointAttempts.length).toBeGreaterThan(0);
    });
  });

  describe("Complete Training Workflow", () => {
    it("should complete training session with technique practice", () => {
      const practiceLog: string[] = [];
      const stancesToPractice = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
      ];

      let currentPlayer = player1;

      for (const stance of stancesToPractice) {
        // Transition to stance
        const validation = trigramSystem.validateTransition(
          currentPlayer.currentStance,
          stance,
          currentPlayer
        );

        if (validation.valid) {
          const cost = trigramSystem.getTransitionCost(
            currentPlayer.currentStance,
            stance,
            currentPlayer
          );

          currentPlayer = updatePlayerState(currentPlayer, {
            currentStance: stance,
            ki: currentPlayer.ki - cost.ki,
            stamina: currentPlayer.stamina - cost.stamina,
          });

          // Get techniques for this stance
          const techniques = combatSystem.getAvailableTechniques(currentPlayer);
          practiceLog.push(`${stance}: ${techniques.length} techniques`);

          expect(techniques.length).toBeGreaterThan(0);
        }
      }

      // Verify training progression
      expect(practiceLog.length).toBe(stancesToPractice.length);
      expect(currentPlayer.stamina).toBeLessThan(player1.stamina);
    });

    it("should complete vital point training workflow", () => {
      const vitalPoints = vitalPointSystem.getVitalPoints();
      const trainingAttempts: Array<{ point: string; result: any }> = [];

      // Practice hitting each vital point
      for (const vitalPoint of vitalPoints.slice(0, 5)) {
        // Simulate hit near vital point
        const hitPosition = {
          x: vitalPoint.position.x + Math.random() * 20 - 10,
          y: vitalPoint.position.y + Math.random() * 20 - 10,
        };
        const hitBox = { width: 10, height: 10 };

        const result = vitalPointSystem.processHit(hitPosition, hitBox);
        trainingAttempts.push({
          point: vitalPoint.names?.korean || vitalPoint.id,
          result,
        });
      }

      // Verify training attempts occurred
      expect(trainingAttempts.length).toBeGreaterThan(0);
      trainingAttempts.forEach((attempt) => {
        expect(attempt.point).toBeDefined();
        expect(typeof attempt.point).toBe("string");
        expect(attempt.result).toBeDefined();
      });
    });
  });

  describe("Multi-Player Archetype Workflow", () => {
    it("should simulate tournament with all archetypes", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      const matchResults: Array<{
        player1: PlayerArchetype;
        player2: PlayerArchetype;
        winner: PlayerArchetype;
      }> = [];

      // Each archetype fights against others
      for (let i = 0; i < archetypes.length - 1; i++) {
        const archetype1 = archetypes[i];
        const archetype2 = archetypes[i + 1];

        let fighter1 = createPlayerFromArchetype(archetype1, 0);
        let fighter2 = createPlayerFromArchetype(archetype2, 1);

        // Quick match (3 rounds)
        for (let round = 0; round < 3 && fighter1.health > 0 && fighter2.health > 0; round++) {
          const techniques = combatSystem.getAvailableTechniques(fighter1);
          if (techniques.length > 0) {
            const result = combatSystem.resolveAttack(
              fighter1,
              fighter2,
              techniques[0]
            );

            const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
              result,
              fighter1,
              fighter2
            );

            fighter1 = updatedAttacker;
            fighter2 = updatedDefender;
          }
        }

        // Determine winner
        const winner = fighter1.health > fighter2.health ? archetype1 : archetype2;
        matchResults.push({
          player1: archetype1,
          player2: archetype2,
          winner,
        });
      }

      // Verify tournament completion
      expect(matchResults.length).toBe(archetypes.length - 1);
      matchResults.forEach((match) => {
        expect([match.player1, match.player2]).toContain(match.winner);
      });
    });
  });

  describe("Resource Depletion and Recovery Workflow", () => {
    it("should handle complete resource depletion and prevent actions", () => {
      let currentPlayer = player1;
      const actionsLog: string[] = [];

      // Deplete resources through repeated actions
      while (currentPlayer.stamina > 10 || currentPlayer.ki > 10) {
        const techniques = combatSystem.getAvailableTechniques(currentPlayer);
        if (techniques.length === 0) {
          actionsLog.push("No techniques available - resources depleted");
          break;
        }

        // Execute technique
        const result = combatSystem.resolveAttack(
          currentPlayer,
          player2,
          techniques[0]
        );

        const { updatedAttacker } = combatSystem.applyCombatResult(
          result,
          currentPlayer,
          player2
        );

        actionsLog.push(
          `Ki: ${updatedAttacker.ki}, Stamina: ${updatedAttacker.stamina}`
        );

        currentPlayer = updatedAttacker;

        // Safety limit
        if (actionsLog.length > 50) break;
      }

      // Verify resource depletion occurred
      expect(currentPlayer.ki).toBeLessThan(player1.ki);
      expect(currentPlayer.stamina).toBeLessThan(player1.stamina);
      expect(actionsLog.length).toBeGreaterThan(0);
    });
  });

  describe("Complete Game Session Workflow", () => {
    it("should simulate complete game session: intro -> training -> combat -> end", () => {
      const gameLog: string[] = [];

      // Phase 1: Player creation
      const selectedArchetype = PlayerArchetype.MUSA;
      let player = createPlayerFromArchetype(selectedArchetype, 0);
      gameLog.push(`Created player: ${selectedArchetype}`);

      // Phase 2: Training
      const trainingStances = [TrigramStance.GEON, TrigramStance.TAE];
      for (const stance of trainingStances) {
        const validation = trigramSystem.validateTransition(
          player.currentStance,
          stance,
          player
        );

        if (validation.valid) {
          const cost = trigramSystem.getTransitionCost(
            player.currentStance,
            stance,
            player
          );

          player = updatePlayerState(player, {
            currentStance: stance,
            ki: player.ki - cost.ki,
            stamina: player.stamina - cost.stamina,
          });

          gameLog.push(`Trained in stance: ${stance}`);
        }
      }

      // Phase 3: Combat
      let opponent = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
      let combatRounds = 0;

      while (combatRounds < 5 && player.health > 0 && opponent.health > 0) {
        const techniques = combatSystem.getAvailableTechniques(player);
        if (techniques.length === 0) break;

        const result = combatSystem.resolveAttack(player, opponent, techniques[0]);
        const { updatedAttacker, updatedDefender } = combatSystem.applyCombatResult(
          result,
          player,
          opponent
        );

        player = updatedAttacker;
        opponent = updatedDefender;
        combatRounds++;

        gameLog.push(`Combat round ${combatRounds}`);
      }

      // Phase 4: Game end
      const winner = player.health > opponent.health ? "Player" : "Opponent";
      gameLog.push(`Winner: ${winner}`);

      // Verify complete session
      expect(gameLog).toContain(`Created player: ${selectedArchetype}`);
      expect(gameLog.some((log) => log.includes("Trained"))).toBe(true);
      expect(gameLog.some((log) => log.includes("Combat round"))).toBe(true);
      expect(gameLog.some((log) => log.includes("Winner"))).toBe(true);
      expect(combatRounds).toBeGreaterThan(0);
    });
  });

  describe("Error Recovery Workflow", () => {
    it("should recover from invalid state transitions", () => {
      let currentPlayer = player1;

      // Try to apply excessive damage
      currentPlayer = applyDamage(currentPlayer, 999999);

      // Verify health clamped to 0 (not negative)
      expect(currentPlayer.health).toBe(0);

      // Try to restore health beyond max
      currentPlayer = updatePlayerState(currentPlayer, {
        health: 999999,
      });

      // Verify health clamped to max
      expect(currentPlayer.health).toBeLessThanOrEqual(currentPlayer.maxHealth);
    });

    it("should handle invalid stance transitions gracefully", () => {
      const currentStance = player1.currentStance;
      // Test with a value that would fail validation
      const invalidStance = "INVALID_STANCE" as any;

      // Validate invalid transition
      const validation = trigramSystem.validateTransition(
        currentStance,
        invalidStance,
        player1
      );

      // Should be invalid or not cause errors
      expect(validation).toBeDefined();
    });
  });

  describe("Korean Theming Integration Workflow", () => {
    it("should maintain Korean text throughout complete workflow", () => {
      const koreanTexts: string[] = [];

      // Collect Korean texts from player (check if it's a string or object)
      if (typeof player1.name === "string") {
        koreanTexts.push(player1.name);
      } else if (player1.name && typeof player1.name === "object" && "korean" in player1.name) {
        // Safely extract korean property using type guard
        const nameObj = player1.name as { korean?: string };
        if (nameObj.korean) {
          koreanTexts.push(nameObj.korean);
        }
      }

      // Collect from techniques
      const techniques = combatSystem.getAvailableTechniques(player1);
      techniques.forEach((technique) => {
        if (technique.name?.korean) {
          koreanTexts.push(technique.name.korean);
        }
        if (technique.description?.korean) {
          koreanTexts.push(technique.description.korean);
        }
      });

      // Collect from vital points
      const vitalPoints = vitalPointSystem.getVitalPoints();
      vitalPoints.forEach((point) => {
        if (point.names?.korean) {
          koreanTexts.push(point.names.korean);
        }
      });

      // Verify all Korean texts are present and valid
      expect(koreanTexts.length).toBeGreaterThan(0);
      koreanTexts.forEach((text) => {
        expect(text).toBeDefined();
        expect(typeof text).toBe("string");
        expect(text.length).toBeGreaterThan(0);
      });
    });
  });
});
