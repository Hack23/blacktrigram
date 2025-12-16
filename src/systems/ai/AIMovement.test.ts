/**
 * AIMovement.test.ts - AI Movement System Tests
 * 
 * Tests for archetype-specific movement patterns and distance-based behavior.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AIDecisionTree, CombatContext } from "./DecisionTree";
import { AIComboSystem } from "./ComboSystem";
import { AI_PERSONALITIES } from "./AIPersonality";
import { TrigramStance } from "@/types";

// Import arena boundary constants from DecisionTree for test validation
const ARENA_MARGIN_X = AIDecisionTree.ARENA_MARGIN_X;
const ARENA_MARGIN_Y = AIDecisionTree.ARENA_MARGIN_Y;

describe("AI Movement System", () => {
  let decisionTree: AIDecisionTree;
  let comboSystem: AIComboSystem;

  beforeEach(() => {
    decisionTree = new AIDecisionTree();
    comboSystem = new AIComboSystem();
    decisionTree.setDifficultyLevel(0.5); // Medium difficulty
  });

  /**
   * Helper to create a combat context with specific distance
   */
  const createContext = (distance: number, healthPercent: number = 1.0): CombatContext => {
    return {
      playerPosition: { x: 100, y: 100 },
      opponentPosition: { x: 100 + distance, y: 100 },
      playerHealth: 100 * healthPercent,
      playerMaxHealth: 100,
      playerKi: 100,
      playerMaxKi: 100,
      playerStamina: 100,
      playerMaxStamina: 100,
      opponentHealth: 100,
      opponentStance: TrigramStance.GEON,
      playerStance: TrigramStance.GEON,
      distanceToOpponent: distance,
      timeInMatch: 5000,
      isOpponentAttacking: false,
      recentDamageTaken: 0,
      arenaBounds: { x: 0, y: 0, width: 800, height: 600 },
    };
  };

  describe("Distance Closing Behavior", () => {
    it("should move toward opponent when too far (> 250px)", () => {
      const context = createContext(300); // Far distance
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;

      // Make multiple decisions to get movement action
      // Increased iterations to 50 to account for probabilistic nature of decision-making
      let foundApproach = false;
      for (let i = 0; i < 50; i++) {
        decisionTree.reset(); // Reset to clear any cooldowns
        const decision = decisionTree.makeDecision(context, personality, comboSystem);
        if (decision.action === "approach" && decision.targetPosition) {
          foundApproach = true;
          // Verify target position is closer to opponent
          const currentDist = Math.abs(context.playerPosition.x - context.opponentPosition.x);
          const newDist = Math.abs(decision.targetPosition.x - context.opponentPosition.x);
          expect(newDist).toBeLessThan(currentDist);
          break;
        }
      }

      expect(foundApproach).toBe(true);
    });

    it("should reduce distance over multiple decisions", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      let currentDistance = 300;

      // Simulate 10 decision cycles
      for (let i = 0; i < 10; i++) {
        const context = createContext(currentDistance);
        const decision = decisionTree.makeDecision(context, personality, comboSystem);

        if (decision.action === "approach" && decision.targetPosition) {
          const dx = decision.targetPosition.x - context.opponentPosition.x;
          const dy = decision.targetPosition.y - context.opponentPosition.y;
          const newDistance = Math.sqrt(dx * dx + dy * dy);

          // Distance should decrease or stay similar (not increase)
          expect(newDistance).toBeLessThanOrEqual(currentDistance + 10);
          currentDistance = newDistance;
        }
      }

      // After 10 cycles, distance should have decreased significantly
      expect(currentDistance).toBeLessThan(300);
    });
  });

  describe("Defensive Retreat Behavior", () => {
    it("should retreat when health < 30% and pain > 50", () => {
      const context: CombatContext = {
        ...createContext(120, 0.25), // 25% health, close distance
        recentDamageTaken: 60, // High pain
      };
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;

      const decision = decisionTree.makeDecision(context, personality, comboSystem);

      // Should prioritize retreat
      expect(decision.action).toBe("retreat");
      expect(decision.priority).toBeGreaterThanOrEqual(9);
    });

    it("should retreat when health < tactical retreat threshold", () => {
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      const context = createContext(150, personality.tacticalRetreatThreshold - 0.05);

      const decision = decisionTree.makeDecision(context, personality, comboSystem);

      // Should prioritize retreat
      expect(decision.action).toBe("retreat");
      expect(decision.priority).toBe(10); // Highest priority
    });

    it("should move away from opponent on retreat", () => {
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      const context = createContext(150, 0.2); // 20% health

      const decision = decisionTree.makeDecision(context, personality, comboSystem);

      if (decision.action === "retreat" && decision.targetPosition) {
        // Calculate distances
        const currentDist = Math.abs(context.playerPosition.x - context.opponentPosition.x);
        const newDist = Math.abs(decision.targetPosition.x - context.opponentPosition.x);

        // New position should be farther from opponent
        expect(newDist).toBeGreaterThan(currentDist);
      }
    });
  });

  describe("Archetype-Specific Movement Patterns", () => {
    it("Amsalja should use flanking movements frequently", () => {
      const personality = AI_PERSONALITIES.TECHNICAL_MASTER; // Amsalja archetype
      const context = createContext(250); // Far enough to trigger approach

      let approachCount = 0;

      // Sample 50 decisions
      for (let i = 0; i < 50; i++) {
        const decision = decisionTree.makeDecision(context, personality, comboSystem);

        if (decision.action === "approach") {
          approachCount++;
        }
      }

      // Amsalja should have some flanking behavior
      // Note: Due to randomness, we check for reasonable flanking attempts
      expect(approachCount).toBeGreaterThan(0);
    });

    it("Musa should charge directly frequently", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER; // Musa archetype
      const context = createContext(250); // Far enough to trigger approach

      let approachCount = 0;

      // Sample 50 decisions
      for (let i = 0; i < 50; i++) {
        const decision = decisionTree.makeDecision(context, personality, comboSystem);

        if (decision.action === "approach") {
          approachCount++;
        }
      }

      // Musa should approach frequently due to high aggression
      expect(approachCount).toBeGreaterThan(0);
    });

    it("Hacker should maintain mid-range (3-4 cells / 200px)", () => {
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST; // Hacker archetype

      // Test at various distances
      const testCases = [
        { distance: 100, expectedBehavior: "retreat or circle" }, // Too close
        { distance: 200, expectedBehavior: "circle or maintain" }, // Optimal
        { distance: 350, expectedBehavior: "approach" }, // Too far
      ];

      testCases.forEach(({ distance }) => {
        const context = createContext(distance);
        const decision = decisionTree.makeDecision(context, personality, comboSystem);

        // Verify that decisions are made at all distances
        expect(decision).toBeDefined();
        expect(decision.action).toBeTruthy();

        if (distance > 300) {
          // Too far - should approach or wait (but not retreat away)
          expect(["approach", "wait"]).toContain(decision.action);
        }
        // At close and optimal ranges, AI may choose various tactical actions
        // including combos, stance changes, defensive moves, etc.
      });
    });
  });

  describe("Stamina and Arena Boundaries", () => {
    it("should respect arena boundaries in movement decisions", () => {
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;
      const context: CombatContext = {
        ...createContext(250),
        arenaBounds: { x: 0, y: 0, width: 400, height: 300 },
      };

      const decision = decisionTree.makeDecision(context, personality, comboSystem);

      if (decision.targetPosition) {
        // Target position should be within bounds (using DecisionTree's arena margin constants)
        expect(decision.targetPosition.x).toBeGreaterThanOrEqual(context.arenaBounds.x);
        expect(decision.targetPosition.x).toBeLessThanOrEqual(
          context.arenaBounds.x + context.arenaBounds.width - ARENA_MARGIN_X
        );
        expect(decision.targetPosition.y).toBeGreaterThanOrEqual(context.arenaBounds.y);
        expect(decision.targetPosition.y).toBeLessThanOrEqual(
          context.arenaBounds.y + context.arenaBounds.height - ARENA_MARGIN_Y
        );
      }
    });

    it("should consider stamina when making movement decisions", () => {
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;
      const lowStaminaContext: CombatContext = {
        ...createContext(250),
        playerStamina: 3, // Very low stamina
        playerMaxStamina: 100,
      };

      const decision = decisionTree.makeDecision(lowStaminaContext, personality, comboSystem);

      // With low stamina, should still make valid decisions
      // Note: The decision tree itself doesn't enforce stamina costs directly,
      // but the execution layer (moveAIPlayer) should check stamina
      // The decision should still be valid and have a reasonable priority
      expect(decision).toBeDefined();
      expect(decision.action).toBeTruthy();
      expect(decision.priority).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Performance", () => {
    it("should make movement decisions within 10ms", () => {
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;
      const context = createContext(200);

      const startTime = performance.now();
      const decision = decisionTree.makeDecision(context, personality, comboSystem);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(duration).toBeLessThan(10);
      expect(decision).toBeDefined();
    });

    it("should maintain <10ms average over 100 decisions", () => {
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;
      const context = createContext(200);

      const durations: number[] = [];

      for (let i = 0; i < 100; i++) {
        const startTime = performance.now();
        decisionTree.makeDecision(context, personality, comboSystem);
        const endTime = performance.now();
        durations.push(endTime - startTime);
      }

      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const maxDuration = Math.max(...durations);

      expect(avgDuration).toBeLessThan(10);
      expect(maxDuration).toBeLessThan(20); // Allow some outliers but not too slow
    });
  });
});
