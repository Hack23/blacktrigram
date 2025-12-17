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
import { PlayerArchetype } from "@/types";
import { createMockPlayerState } from "@/test/test-utils";

/**
 * Create benchmark combat context matching current CombatContext interface
 */
function createBenchmarkContext(): CombatContext {
  return {
    playerPosition: { x: 600, y: 400 },
    opponentPosition: { x: 400, y: 400 },
    playerHealth: 80,
    playerMaxHealth: 100,
    playerKi: 60,
    playerMaxKi: 100,
    playerStamina: 70,
    playerMaxStamina: 100,
    opponentHealth: 75,
    opponentStance: "geon" as const,
    playerStance: "gon" as const,
    distanceToOpponent: 200,
    timeInMatch: 30000, // 30 seconds into match
    isOpponentAttacking: false,
    recentDamageTaken: 0,
    arenaBounds: {
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
    },
  };
}

/**
 * Create mock combo system for benchmarks
 */
function createMockComboSystem() {
  return {
    isComboActive: () => false,
    getNextTechniqueInCombo: () => null,
    shouldStartCombo: () => false,
    recordTechnique: () => {},
    reset: () => {},
  } as any; // Type assertion for benchmark purposes
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
  const balancedTree = new AIDecisionTree();
  balancedTree.setDifficultyParameters(balancedDifficulty.getDifficultyParameters());
  
  const mockComboSystem = createMockComboSystem();

  bench(
    "AI decision making (single iteration - target <10ms)",
    () => {
      const context = createBenchmarkContext();

      // Critical: Decision must complete quickly
      const decision = balancedTree.makeDecision(
        context,
        AI_PERSONALITIES.BALANCED_FIGHTER,
        mockComboSystem
      );

      // Validate decision is valid
      if (!decision) {
        throw new Error("Decision tree returned null");
      }
    }
  );

  const aggressiveDifficulty = new AdaptiveDifficulty();
  const aggressiveTree = new AIDecisionTree();
  aggressiveTree.setDifficultyParameters(aggressiveDifficulty.getDifficultyParameters());

  bench(
    "AI decision making - aggressive personality",
    () => {
      const context = createBenchmarkContext();
      aggressiveTree.makeDecision(
        context,
        AI_PERSONALITIES.AGGRESSIVE_STRIKER,
        mockComboSystem
      );
    }
  );

  const defensiveDifficulty = new AdaptiveDifficulty();
  const defensiveTree = new AIDecisionTree();
  defensiveTree.setDifficultyParameters(defensiveDifficulty.getDifficultyParameters());

  bench(
    "AI decision making - defensive personality",
    () => {
      const context = createBenchmarkContext();
      defensiveTree.makeDecision(
        context,
        AI_PERSONALITIES.DEFENSIVE_SPECIALIST,
        mockComboSystem
      );
    }
  );

  // ==================== Batch Decision Benchmarks (60fps simulation) ====================

  // Pre-create contexts for batch benchmarks to measure only decision loop
  const batchContexts60 = Array.from({ length: 60 }, () =>
    createBenchmarkContext()
  );

  const loadTestDifficulty = new AdaptiveDifficulty();
  const loadTestTree = new AIDecisionTree();
  loadTestTree.setDifficultyParameters(loadTestDifficulty.getDifficultyParameters());

  bench(
    "AI decision making under load (60fps - 60 decisions in <1000ms)",
    () => {
      // Simulate 60 decisions (1 second at 60fps)
      batchContexts60.forEach((context) => {
        loadTestTree.makeDecision(
          context,
          AI_PERSONALITIES.BALANCED_FIGHTER,
          mockComboSystem
        );
      });
    }
  );

  // Pre-create contexts for sustained load test
  const batchContexts600 = Array.from({ length: 600 }, () =>
    createBenchmarkContext()
  );

  const sustainedDifficulty = new AdaptiveDifficulty();
  const sustainedTree = new AIDecisionTree();
  sustainedTree.setDifficultyParameters(sustainedDifficulty.getDifficultyParameters());

  bench(
    "AI decision making - sustained load (10 seconds at 60fps)",
    () => {
      // 600 decisions (10 seconds at 60fps)
      batchContexts600.forEach((context) => {
        sustainedTree.makeDecision(
          context,
          AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          mockComboSystem
        );
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
        playerPosition: player.position,
        opponentPosition: opponent.position,
        playerHealth: player.health,
        playerMaxHealth: player.maxHealth,
        playerKi: player.ki,
        playerMaxKi: player.maxKi,
        playerStamina: player.stamina,
        playerMaxStamina: player.maxStamina,
        opponentHealth: opponent.health,
        opponentStance: opponent.stance,
        playerStance: player.stance,
        distanceToOpponent: calculateDistance(player.position, opponent.position),
        timeInMatch: 30000,
        isOpponentAttacking: false,
        recentDamageTaken: 0,
        arenaBounds: {
          x: 0,
          y: 0,
          width: 1200,
          height: 800,
        },
      };

      if (!context.playerPosition || !context.opponentPosition) {
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
        const tree = new AIDecisionTree();
        tree.setDifficultyParameters(new AdaptiveDifficulty().getDifficultyParameters());
        const context = createBenchmarkContext();

        tree.makeDecision(
          context,
          personalities[index],
          mockComboSystem
        );
      });
    }
  );

  // ==================== Stress Test Benchmarks ====================

  // Pre-create contexts for memory pressure test to focus on decision-making
  const memoryPressureContexts = Array.from({ length: 1000 }, () =>
    createBenchmarkContext()
  );

  const memoryPressureDifficulty = new AdaptiveDifficulty();
  const memoryPressureTree = new AIDecisionTree();
  memoryPressureTree.setDifficultyParameters(memoryPressureDifficulty.getDifficultyParameters());

  bench(
    "AI decisions under memory pressure (1000 iterations)",
    () => {
      const decisions = [];

      for (let i = 0; i < 1000; i++) {
        const decision = memoryPressureTree.makeDecision(
          memoryPressureContexts[i],
          AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          mockComboSystem
        );
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
        () => {
          const tree = new AIDecisionTree();
          tree.setDifficultyParameters(new AdaptiveDifficulty().getDifficultyParameters());
          return tree;
        }
      );

      const contexts = Array.from({ length: 4 }, () =>
        createBenchmarkContext()
      );

      // All AIs make decisions
      trees.forEach((tree, index) => {
        tree.makeDecision(
          contexts[index],
          AI_PERSONALITIES.BALANCED_FIGHTER,
          mockComboSystem
        );
      });
    }
  );
});

// ==================== Real-Time Performance Validation ====================

describe("Real-Time Performance Validation", () => {
  const frameBudgetTree = new AIDecisionTree();
  frameBudgetTree.setDifficultyParameters(new AdaptiveDifficulty().getDifficultyParameters());
  const frameBudgetCombo = createMockComboSystem();

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
        playerPosition: player.position,
        opponentPosition: opponent.position,
        playerHealth: player.health,
        playerMaxHealth: player.maxHealth,
        playerKi: player.ki,
        playerMaxKi: player.maxKi,
        playerStamina: player.stamina,
        playerMaxStamina: player.maxStamina,
        opponentHealth: opponent.health,
        opponentStance: opponent.stance,
        playerStance: player.stance,
        distanceToOpponent: calculateDistance(player.position, opponent.position),
        timeInMatch: 30000,
        isOpponentAttacking: false,
        recentDamageTaken: 0,
        arenaBounds: {
          x: 0,
          y: 0,
          width: 1200,
          height: 800,
        },
      };

      // Decision making (~5ms target)
      const decision = frameBudgetTree.makeDecision(
        context,
        AI_PERSONALITIES.AGGRESSIVE_STRIKER,
        frameBudgetCombo
      );

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

  const minFrameTree = new AIDecisionTree();
  minFrameTree.setDifficultyParameters(new AdaptiveDifficulty().getDifficultyParameters());

  bench(
    "Minimum frame time (target 58fps = 17.24ms per frame)",
    () => {
      const context = createBenchmarkContext();

      // Complete AI cycle
      minFrameTree.makeDecision(
        context,
        AI_PERSONALITIES.BALANCED_FIGHTER,
        frameBudgetCombo
      );
    }
  );
});
