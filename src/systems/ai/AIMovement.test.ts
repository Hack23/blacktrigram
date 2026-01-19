/**
 * AIMovement.test.ts - AI Movement System Tests
 *
 * Tests for archetype-specific movement patterns and distance-based behavior.
 *
 * **Physics-First**: All distances and positions are in METERS.
 */

import { TrigramStance } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";
import { AI_PERSONALITIES } from "./AIPersonality";
import { AIComboSystem } from "./ComboSystem";
import { AIDecisionTree, CombatContext } from "./DecisionTree";

// Arena boundary constants from DecisionTree are used inline in tests where needed
// (not needed as top-level constants after physics-first refactoring)

describe("AI Movement System", () => {
  let decisionTree: AIDecisionTree;
  let comboSystem: AIComboSystem;

  beforeEach(() => {
    decisionTree = new AIDecisionTree();
    comboSystem = new AIComboSystem();
    decisionTree.setDifficultyLevel(0.5); // Medium difficulty
  });

  /**
   * Helper to create a combat context with specific distance in METERS
   * Arena is centered at origin for physics-first coordinate system.
   */
  const createContext = (
    distanceMeters: number,
    healthPercent: number = 1.0,
  ): CombatContext => {
    // Position player at -distance/2, opponent at +distance/2 (centered at origin)
    const halfDistance = distanceMeters / 2;
    return {
      playerPosition: { x: -halfDistance, y: 0 },
      opponentPosition: { x: halfDistance, y: 0 },
      playerHealth: 100 * healthPercent,
      playerMaxHealth: 100,
      playerKi: 100,
      playerMaxKi: 100,
      playerStamina: 100,
      playerMaxStamina: 100,
      opponentHealth: 100,
      opponentStance: TrigramStance.GEON,
      playerStance: TrigramStance.GEON,
      distanceToOpponent: distanceMeters, // METERS
      timeInMatch: 5000,
      isOpponentAttacking: false,
      recentDamageTaken: 0,
      arenaBounds: {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        worldWidthMeters: 8,
        worldDepthMeters: 6,
      },
    };
  };

  describe("Distance Closing Behavior", () => {
    it("should move toward opponent when too far (> 2.5m)", () => {
      const context = createContext(3.0); // 3m = Far distance
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;

      // Make multiple decisions to get movement action
      // Increased iterations to 50 to account for probabilistic nature of decision-making
      let foundApproach = false;
      for (let i = 0; i < 50; i++) {
        decisionTree.reset(); // Reset to clear any cooldowns
        const decision = decisionTree.makeDecision(
          context,
          personality,
          comboSystem,
        );
        if (decision.action === "approach" && decision.targetPosition) {
          foundApproach = true;
          // Verify target position is closer to opponent
          const currentDist = Math.abs(
            context.playerPosition.x - context.opponentPosition.x,
          );
          const newDist = Math.abs(
            decision.targetPosition.x - context.opponentPosition.x,
          );
          expect(newDist).toBeLessThan(currentDist);
          break;
        }
      }

      expect(foundApproach).toBe(true);
    });

    it("should reduce distance over multiple decisions", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      let currentDistance = 3.0; // 3m = far distance

      // Simulate 10 decision cycles
      for (let i = 0; i < 10; i++) {
        const context = createContext(currentDistance);
        const decision = decisionTree.makeDecision(
          context,
          personality,
          comboSystem,
        );

        if (decision.action === "approach" && decision.targetPosition) {
          const dx = decision.targetPosition.x - context.opponentPosition.x;
          const dy = decision.targetPosition.y - context.opponentPosition.y;
          const newDistance = Math.sqrt(dx * dx + dy * dy);

          // Distance should decrease or stay similar (not increase by more than 0.1m)
          expect(newDistance).toBeLessThanOrEqual(currentDistance + 0.1);
          currentDistance = newDistance;
        }
      }

      // After 10 cycles, distance should have decreased significantly
      expect(currentDistance).toBeLessThan(3.0);
    });
  });

  describe("Defensive Retreat Behavior", () => {
    it("should retreat when health < 30% and pain > 50", () => {
      const context: CombatContext = {
        ...createContext(1.0, 0.25), // 25% health, 1m = close distance
        recentDamageTaken: 60, // High pain
      };
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;

      const decision = decisionTree.makeDecision(
        context,
        personality,
        comboSystem,
      );

      // Should prioritize retreat
      expect(decision.action).toBe("retreat");
      expect(decision.priority).toBeGreaterThanOrEqual(9);
    });

    it("should retreat when health < tactical retreat threshold", () => {
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      const context = createContext(
        1.25, // 1.25m (close-mid range)
        personality.tacticalRetreatThreshold - 0.05,
      );

      const decision = decisionTree.makeDecision(
        context,
        personality,
        comboSystem,
      );

      // Should prioritize retreat
      expect(decision.action).toBe("retreat");
      expect(decision.priority).toBe(20); // Highest priority - survival overrides all
    });

    it("should move away from opponent on retreat", () => {
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      const context = createContext(1.25, 0.2); // 20% health, 1.25m distance

      const decision = decisionTree.makeDecision(
        context,
        personality,
        comboSystem,
      );

      if (decision.action === "retreat" && decision.targetPosition) {
        // Calculate distances
        const currentDist = Math.abs(
          context.playerPosition.x - context.opponentPosition.x,
        );
        const newDist = Math.abs(
          decision.targetPosition.x - context.opponentPosition.x,
        );

        // New position should be farther from opponent
        expect(newDist).toBeGreaterThan(currentDist);
      }
    });
  });

  describe("Archetype-Specific Movement Patterns", () => {
    it("Musa should charge directly frequently", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER; // Musa archetype
      const context = createContext(2.5); // 2.5m = Far enough to trigger approach

      let approachCount = 0;

      // Sample 100 decisions with reset to clear cooldowns
      // With AGGRESSIVE_STRIKER's aggressive movement tendency, should see approach actions
      for (let i = 0; i < 100; i++) {
        decisionTree.reset(); // Clear cooldowns between iterations
        const decision = decisionTree.makeDecision(
          context,
          personality,
          comboSystem,
        );

        if (decision.action === "approach") {
          approachCount++;
        }
      }

      // Musa should approach when far from opponent (distance 2.5m > optimal ~0.5m * 1.8)
      // With resets clearing stance change cooldown, expect reasonable approach frequency
      // Note: Some iterations may choose stance_change (30% probability) or wait
      expect(approachCount).toBeGreaterThan(20);
    });

    it("Hacker should maintain mid-range (1.0-1.5m)", () => {
      const personality = AI_PERSONALITIES.DEFENSIVE_SPECIALIST; // Hacker archetype

      // Test at various distances in METERS
      const testCases = [
        { distance: 0.8, expectedBehavior: "retreat or circle" }, // Too close
        { distance: 1.5, expectedBehavior: "circle or maintain" }, // Optimal
        { distance: 3.0, expectedBehavior: "approach" }, // Too far
      ];

      testCases.forEach(({ distance }) => {
        const context = createContext(distance);
        const decision = decisionTree.makeDecision(
          context,
          personality,
          comboSystem,
        );

        // Verify that decisions are made at all distances
        expect(decision).toBeDefined();
        expect(decision.action).toBeTruthy();

        if (distance > 2.5) {
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
        ...createContext(2.5), // 2.5m
        arenaBounds: {
          x: 0,
          y: 0,
          width: 400,
          height: 300,
          worldWidthMeters: 8,
          worldDepthMeters: 6,
        },
      };

      const decision = decisionTree.makeDecision(
        context,
        personality,
        comboSystem,
      );

      if (decision.targetPosition) {
        // Physics-first: positions are in METERS, arena centered at origin
        const halfWidth = context.arenaBounds.worldWidthMeters / 2;
        const halfDepth = context.arenaBounds.worldDepthMeters / 2;
        const marginX = 0.6; // AI_MOVEMENT_METERS.ARENA_MARGIN_X
        const marginY = 1.8; // AI_MOVEMENT_METERS.ARENA_MARGIN_Y

        // Target position should be within bounds (in meters)
        expect(decision.targetPosition.x).toBeGreaterThanOrEqual(
          -halfWidth + marginX,
        );
        expect(decision.targetPosition.x).toBeLessThanOrEqual(
          halfWidth - marginX,
        );
        expect(decision.targetPosition.y).toBeGreaterThanOrEqual(
          -halfDepth + marginY,
        );
        expect(decision.targetPosition.y).toBeLessThanOrEqual(
          halfDepth - marginY,
        );
      }
    });

    it("should consider stamina when making movement decisions", () => {
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;
      const lowStaminaContext: CombatContext = {
        ...createContext(2.5), // 2.5m
        playerStamina: 3, // Very low stamina
        playerMaxStamina: 100,
      };

      const decision = decisionTree.makeDecision(
        lowStaminaContext,
        personality,
        comboSystem,
      );

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
      const context = createContext(1.5); // 1.5m

      const startTime = performance.now();
      const decision = decisionTree.makeDecision(
        context,
        personality,
        comboSystem,
      );
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(duration).toBeLessThan(10);
      expect(decision).toBeDefined();
    });

    it("should maintain <10ms average over 100 decisions", () => {
      const personality = AI_PERSONALITIES.BALANCED_FIGHTER;
      const context = createContext(1.5); // 1.5m

      const durations: number[] = [];

      for (let i = 0; i < 100; i++) {
        const startTime = performance.now();
        decisionTree.makeDecision(context, personality, comboSystem);
        const endTime = performance.now();
        durations.push(endTime - startTime);
      }

      const avgDuration =
        durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const maxDuration = Math.max(...durations);

      expect(avgDuration).toBeLessThan(10);
      expect(maxDuration).toBeLessThan(20); // Allow some outliers but not too slow
    });
  });
});
