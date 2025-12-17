/**
 * AI Performance Benchmarks
 * 
 * Performance testing for AI combat decision-making to ensure real-time performance requirements:
 * - AI decision time: <10ms average, <25ms maximum
 * - Combat frame rate: ≥58fps average with AI active
 * - Memory usage: No leaks over extended gameplay
 * 
 * Benchmarks validate:
 * - Single AI decision latency
 * - Batch decision performance (60fps simulation)
 * - Distance calculation hot path
 * - Decision tree evaluation overhead
 * - Memory allocation patterns
 * 
 * @module systems/ai/__tests__/AI-Performance
 */

import { bench, describe } from "vitest";
import { AIDecisionTree, CombatContext } from "@/systems/ai/DecisionTree";
import { AdaptiveDifficulty } from "@/systems/ai/AdaptiveDifficulty";
import { AI_PERSONALITIES } from "@/systems/ai/AIPersonality";
import { createMockPlayerState } from "@/test/test-utils";

/**
 * Create benchmark combat context
 */
function createBenchmarkContext(): CombatContext {
  const player = createMockPlayerState({ position: { x: 600, y: 400 } });
  const opponent = createMockPlayerState({ position: { x: 400, y: 400 } });
  
  return {
    player,
    opponent,
    distanceToOpponent: 200,
    isOpponentVulnerable: false,
    isPlayerHealthLow: false,
    isPlayerStaminaLow: false,
    opponentRecentActions: [],
    playerRecentActions: [],
    timeInRound: 30000, // 30 seconds into round
    comboSystem: {
      isComboActive: () => false,
      getNextTechniqueInCombo: () => null,
      shouldStartCombo: () => false,
      recordTechnique: () => {},
      reset: () => {},
    },
  };
}

/**
 * Calculate distance between two points (hot path)
 */
function calculateDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ==================== Performance Benchmarks ====================

describe("AI Decision Performance", () => {
  // ==================== Single Decision Benchmarks ====================
  
  // Pre-create instances outside benchmarks to measure only decision-making performance
  const balancedDifficulty = new AdaptiveDifficulty();
  const balancedTree = new AIDecisionTree(
    AI_PERSONALITIES.BALANCED_FIGHTER,
    balancedDifficulty
  );

  bench(
    "AI decision making (single iteration - target <10ms)",
    () => {
      const context = createBenchmarkContext();

      // Critical: Decision must complete quickly
      const decision = balancedTree.decide(context);

      // Validate decision is valid
      if (!decision) {
        throw new Error("Decision tree returned null");
      }
    }
  );

  const aggressiveDifficulty = new AdaptiveDifficulty();
  const aggressiveTree = new AIDecisionTree(
    AI_PERSONALITIES.AGGRESSIVE_STRIKER,
    aggressiveDifficulty
  );

  bench(
    "AI decision making - aggressive personality",
    () => {
      const context = createBenchmarkContext();
      aggressiveTree.decide(context);
    }
  );

  const defensiveDifficulty = new AdaptiveDifficulty();
  const defensiveTree = new AIDecisionTree(
    AI_PERSONALITIES.DEFENSIVE_SPECIALIST,
    defensiveDifficulty
  );

  bench(
    "AI decision making - defensive personality",
    () => {
      const context = createBenchmarkContext();
      defensiveTree.decide(context);
    }
  );

  // ==================== Batch Decision Benchmarks (60fps simulation) ====================

  // Pre-create contexts for batch benchmarks to measure only decision loop
  const batchContexts60 = Array.from({ length: 60 }, () =>
    createBenchmarkContext()
  );

  const loadTestDifficulty = new AdaptiveDifficulty();
  const loadTestTree = new AIDecisionTree(
    AI_PERSONALITIES.BALANCED_FIGHTER,
    loadTestDifficulty
  );

  bench(
    "AI decision making under load (60fps - 60 decisions in <1000ms)",
    () => {
      // Simulate 60 decisions (1 second at 60fps)
      batchContexts60.forEach((context) => {
        loadTestTree.decide(context);
      });
    }
  );

  // Pre-create contexts for sustained load test
  const batchContexts600 = Array.from({ length: 600 }, () =>
    createBenchmarkContext()
  );

  const sustainedDifficulty = new AdaptiveDifficulty();
  const sustainedTree = new AIDecisionTree(
    AI_PERSONALITIES.AGGRESSIVE_STRIKER,
    sustainedDifficulty
  );

  bench(
    "AI decision making - sustained load (10 seconds at 60fps)",
    () => {
      // 600 decisions (10 seconds at 60fps)
      batchContexts600.forEach((context) => {
        sustainedTree.decide(context);
      });
    }
  );

  // ==================== Hot Path Benchmarks ====================

  bench(
    "Distance calculation (hot path - target <0.1ms)",
    () => {
      const pos1 = { x: 400, y: 300 };
      const pos2 = { x: 800, y: 600 };

      const distance = calculateDistance(pos1, pos2);

      // Validate calculation
      if (distance <= 0) {
        throw new Error("Invalid distance calculation");
      }
    }
  );

  // Pre-create position pairs for batch distance test
  const distancePositions = Array.from({ length: 1000 }, (_, i) => ({
    pos1: { x: i % 1200, y: i % 800 },
    pos2: { x: (i * 2) % 1200, y: (i * 3) % 800 },
  }));

  bench(
    "Distance calculation - batch (1000 calculations)",
    () => {
      distancePositions.forEach(({ pos1, pos2 }) => {
        calculateDistance(pos1, pos2);
      });
    }
  );

  // ==================== Adaptive Difficulty Benchmarks ====================

  bench(
    "Adaptive difficulty update (skill metrics processing)",
    () => {
      const difficulty = new AdaptiveDifficulty();

      difficulty.updateSkillMetrics({
        hitsLanded: 45,
        totalAttacks: 60,
        combosExecuted: 3,
        perfectBlockCount: 5,
        avgReactionTimeMs: 250,
        vitalPointHitsLanded: 8,
        effectiveStanceChanges: 4,
        damageTakenThisMatch: 200,
        damageDealtThisMatch: 500,
      });

      const tier = difficulty.getDifficultyTier();
      if (tier < 1 || tier > 5) {
        throw new Error("Invalid difficulty tier");
      }
    }
  );

  bench(
    "Adaptive difficulty - get parameters",
    () => {
      const difficulty = new AdaptiveDifficulty();

      const params = difficulty.getDifficultyParameters();

      if (!params?.reactionTimeMs) {
        throw new Error("Invalid difficulty parameters");
      }
    }
  );

  // ==================== Context Building Benchmarks ====================

  bench(
    "Combat context creation (per frame operation)",
    () => {
      const player = createMockPlayerState({ position: { x: 600, y: 400 } });
      const opponent = createMockPlayerState({ position: { x: 400, y: 400 } });
      
      const context: CombatContext = {
        player,
        opponent,
        distanceToOpponent: calculateDistance(player.position, opponent.position),
        isOpponentVulnerable: opponent.balance < 50,
        isPlayerHealthLow: player.health < 30,
        isPlayerStaminaLow: player.stamina < 20,
        opponentRecentActions: [],
        playerRecentActions: [],
        timeInRound: 30000,
        comboSystem: {
          isComboActive: () => false,
          getNextTechniqueInCombo: () => null,
          shouldStartCombo: () => false,
          recordTechnique: () => {},
          reset: () => {},
        },
      };

      if (!context.player || !context.opponent) {
        throw new Error("Invalid context");
      }
    }
  );

  // ==================== Memory Allocation Benchmarks ====================

  bench(
    "AI state object allocation (memory pressure test)",
    () => {
      const states = Array.from({ length: 100 }, () => ({
        lastActionType: "idle" as const,
        nextAction: Date.now() + 500,
        consecutiveAttacks: 0,
        aggressionLevel: 0.5,
        threatLevel: 0.5,
      }));

      // Verify allocation
      if (states.length !== 100) {
        throw new Error("Allocation failed");
      }
    }
  );

  bench(
    "Player state cloning (state updates)",
    () => {
      const originalPlayer = createMockPlayerState();

      const clonedPlayer = {
        ...originalPlayer,
        health: 95,
        stamina: 90,
      };

      if (clonedPlayer.health !== 95) {
        throw new Error("Cloning failed");
      }
    }
  );

  // ==================== Archetype-Specific Performance ====================

  bench(
    "Decision tree - all 5 archetypes (personality variation impact)",
    () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      const personalities = [
        AI_PERSONALITIES.AGGRESSIVE_STRIKER,
        AI_PERSONALITIES.TECHNICAL_MASTER,
        AI_PERSONALITIES.BALANCED_FIGHTER,
        AI_PERSONALITIES.DEFENSIVE_SPECIALIST,
        AI_PERSONALITIES.AGGRESSIVE_STRIKER,
      ];

      archetypes.forEach((archetype, index) => {
        const player = createMockPlayerState({ archetype });
        const tree = new AIDecisionTree(
          personalities[index],
          new AdaptiveDifficulty()
        );
        const context = createBenchmarkContext();
        context.player = player;

        tree.decide(context);
      });
    }
  );

  // ==================== Stress Test Benchmarks ====================

  // Pre-create contexts for memory pressure test to focus on decision-making
  const memoryPressureContexts = Array.from({ length: 1000 }, () =>
    createBenchmarkContext()
  );

  const memoryPressureDifficulty = new AdaptiveDifficulty();
  const memoryPressureTree = new AIDecisionTree(
    AI_PERSONALITIES.AGGRESSIVE_STRIKER,
    memoryPressureDifficulty
  );

  bench(
    "AI decisions under memory pressure (1000 iterations)",
    () => {
      const decisions = [];

      for (let i = 0; i < 1000; i++) {
        const decision = memoryPressureTree.decide(memoryPressureContexts[i]);
        decisions.push(decision);
      }

      // Verify all decisions were made
      if (decisions.length !== 1000) {
        throw new Error("Decision making failed under pressure");
      }
    }
  );

  bench(
    "Multiple AI instances - parallel decision making",
    () => {
      // Simulate 4 AI opponents making decisions simultaneously
      const trees = Array.from(
        { length: 4 },
        () =>
          new AIDecisionTree(
            AI_PERSONALITIES.BALANCED_FIGHTER,
            new AdaptiveDifficulty()
          )
      );

      const contexts = Array.from({ length: 4 }, () =>
        createBenchmarkContext()
      );

      // All AIs make decisions
      trees.forEach((tree, index) => {
        tree.decide(contexts[index]);
      });
    }
  );
});

// ==================== Real-Time Performance Validation ====================

describe("Real-Time Performance Validation", () => {
  bench(
    "Frame budget validation (16.67ms for 60fps)",
    () => {
      // Simulate one complete AI frame:
      // 1. Context creation
      // 2. Decision making
      // 3. Action execution (simulated)

      const player = createMockPlayerState({ position: { x: 600, y: 400 } });
      const opponent = createMockPlayerState({ position: { x: 400, y: 400 } });
      
      // Context creation (~0.5ms)
      const context: CombatContext = {
        player,
        opponent,
        distanceToOpponent: calculateDistance(player.position, opponent.position),
        isOpponentVulnerable: opponent.balance < 50,
        isPlayerHealthLow: player.health < 30,
        isPlayerStaminaLow: player.stamina < 20,
        opponentRecentActions: [],
        playerRecentActions: [],
        timeInRound: 30000,
        comboSystem: {
          isComboActive: () => false,
          getNextTechniqueInCombo: () => null,
          shouldStartCombo: () => false,
          recordTechnique: () => {},
          reset: () => {},
        },
      };

      // Decision making (~5ms target)
      const tree = new AIDecisionTree(
        AI_PERSONALITIES.AGGRESSIVE_STRIKER,
        new AdaptiveDifficulty()
      );
      const decision = tree.decide(context);

      // Action execution (simulated, ~1ms)
      if (decision) {
        const actionType = decision.action;
        // Simulated action processing
        if (actionType) {
          // Action validated
        }
      }

      // Total should be well under 16.67ms for 60fps
    }
  );

  bench(
    "Minimum frame time (target 58fps = 17.24ms per frame)",
    () => {
      const tree = new AIDecisionTree(
        AI_PERSONALITIES.BALANCED_FIGHTER,
        new AdaptiveDifficulty()
      );
      const context = createBenchmarkContext();

      // Complete AI cycle
      tree.decide(context);
    }
  );
});
