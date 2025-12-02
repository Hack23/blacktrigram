/**
 * Tests for TrainingAI system
 */

import { describe, it, expect, beforeEach } from "vitest";
import { TrainingAI, AITrainingDifficulty } from "./TrainingAI";
import { PlayerState } from "../player";
import { TrigramStance } from "@/types";
import { createMockPlayerState } from "../../test/test-utils";

describe("TrainingAI", () => {
  let trainingAI: TrainingAI;
  let mockPlayerState: PlayerState;
  let mockAIPlayerState: PlayerState;

  beforeEach(() => {
    trainingAI = new TrainingAI("medium");

    mockPlayerState = {
      ...createMockPlayerState(),
      id: "player",
      position: { x: -5, y: 0 },
    };

    mockAIPlayerState = {
      ...createMockPlayerState(),
      id: "ai",
      name: { korean: "AI", english: "AI" },
      position: { x: 5, y: 0 },
    };
  });

  describe("Initialization", () => {
    it("should initialize with medium difficulty by default", () => {
      const ai = new TrainingAI();
      const state = ai.getState();

      expect(state.difficulty).toBe("medium");
      expect(state.reactionTime).toBe(300);
      expect(state.blockChance).toBe(0.5);
      expect(state.counterChance).toBe(0.3);
    });

    it("should initialize with easy difficulty", () => {
      const ai = new TrainingAI("easy");
      const state = ai.getState();

      expect(state.difficulty).toBe("easy");
      expect(state.reactionTime).toBe(500);
      expect(state.blockChance).toBe(0.3);
      expect(state.counterChance).toBe(0.1);
    });

    it("should initialize with hard difficulty", () => {
      const ai = new TrainingAI("hard");
      const state = ai.getState();

      expect(state.difficulty).toBe("hard");
      expect(state.reactionTime).toBe(150);
      expect(state.blockChance).toBe(0.7);
      expect(state.counterChance).toBe(0.5);
    });

    it("should start in inactive state", () => {
      const state = trainingAI.getState();
      expect(state.isActive).toBe(false);
    });

    it("should initialize with correct personality for difficulty", () => {
      const easyAI = new TrainingAI("easy");
      expect(easyAI.getState().personality.koreanName).toBe("방어의 달인");

      const mediumAI = new TrainingAI("medium");
      expect(mediumAI.getState().personality.koreanName).toBe("균형 잡힌 자");

      const hardAI = new TrainingAI("hard");
      expect(hardAI.getState().personality.koreanName).toBe("맹공자");
    });
  });

  describe("Activation and Deactivation", () => {
    it("should activate AI", () => {
      trainingAI.activate();
      const state = trainingAI.getState();

      expect(state.isActive).toBe(true);
      expect(state.lastActionTime).toBeGreaterThan(0);
    });

    it("should deactivate AI", () => {
      trainingAI.activate();
      trainingAI.deactivate();
      const state = trainingAI.getState();

      expect(state.isActive).toBe(false);
      expect(state.currentAction).toBeNull();
    });

    it("should not update when inactive", () => {
      const decision = trainingAI.update(0.016, mockPlayerState, mockAIPlayerState);
      expect(decision).toBeNull();
    });
  });

  describe("AI Decision Making", () => {
    beforeEach(() => {
      trainingAI.activate();
    });

    it("should make decisions when active", () => {
      const decision = trainingAI.update(0.016, mockPlayerState, mockAIPlayerState);

      expect(decision).toBeTruthy();
      expect(decision?.action).toBeDefined();
      expect(decision?.priority).toBeGreaterThanOrEqual(0);
    });

    it("should respect reaction time delay", () => {
      // First update should return a decision
      const firstDecision = trainingAI.update(
        0.016,
        mockPlayerState,
        mockAIPlayerState
      );
      expect(firstDecision).toBeTruthy();

      // Immediate second update should return same decision (reaction time delay)
      const secondDecision = trainingAI.update(
        0.016,
        mockPlayerState,
        mockAIPlayerState
      );
      expect(secondDecision).toBe(firstDecision);
    });

    it("should make new decision after reaction time passes", () => {
      // First decision
      trainingAI.update(0.016, mockPlayerState, mockAIPlayerState);

      // Wait for reaction time to pass (simulate 350ms at 60fps)
      for (let i = 0; i < 21; i++) {
        trainingAI.update(0.016, mockPlayerState, mockAIPlayerState);
      }

      // Should have made multiple decisions by now
      const state = trainingAI.getState();
      expect(state.currentAction).toBeTruthy();
    });
  });

  describe("Difficulty Adjustment", () => {
    beforeEach(() => {
      trainingAI.activate();
    });

    it("should change difficulty level", () => {
      trainingAI.setDifficulty("hard");
      const state = trainingAI.getState();

      expect(state.difficulty).toBe("hard");
      expect(state.reactionTime).toBe(150);
      expect(state.blockChance).toBe(0.7);
    });

    it("should update personality when changing difficulty", () => {
      trainingAI.setDifficulty("easy");
      expect(trainingAI.getState().personality.koreanName).toBe("방어의 달인");

      trainingAI.setDifficulty("hard");
      expect(trainingAI.getState().personality.koreanName).toBe("맹공자");
    });
  });

  describe("Block and Counter", () => {
    it("should block with probability based on difficulty", () => {
      const easyAI = new TrainingAI("easy");
      // Use 500 samples for more stable statistical results
      const blocks = Array.from({ length: 500 }, () => easyAI.shouldBlock()).filter(
        Boolean
      ).length;

      // Should block around 30% of the time (150 expected)
      // Wider range: 10%-50% (50-250) to account for statistical variance
      expect(blocks).toBeGreaterThan(50);
      expect(blocks).toBeLessThan(250);
    });

    it("should counter with probability based on difficulty", () => {
      const hardAI = new TrainingAI("hard");
      // Use 500 samples for more stable statistical results
      const counters = Array.from({ length: 500 }, () =>
        hardAI.shouldCounter()
      ).filter(Boolean).length;

      // Should counter around 50% of the time (250 expected)
      // Wider range: 30%-70% (150-350) to account for statistical variance
      expect(counters).toBeGreaterThan(150);
      expect(counters).toBeLessThan(350);
    });
  });

  describe("Position and Stance Updates", () => {
    it("should update position", () => {
      const newPosition = { x: 10, y: 5 };
      trainingAI.updatePosition(newPosition);

      const state = trainingAI.getState();
      expect(state.position).toEqual(newPosition);
    });

    it("should update stance", () => {
      const newStance = TrigramStance.GAM;
      trainingAI.updateStance(newStance);

      const state = trainingAI.getState();
      expect(state.stance).toBe(newStance);
    });
  });

  describe("Reset", () => {
    it("should reset AI state", () => {
      trainingAI.activate();
      trainingAI.update(0.016, mockPlayerState, mockAIPlayerState);

      trainingAI.reset();

      const state = trainingAI.getState();
      expect(state.currentAction).toBeNull();
    });
  });

  describe("Adaptive Difficulty", () => {
    it("should update adaptive difficulty metrics", () => {
      trainingAI.activate();

      // Simulate a match where player is winning
      trainingAI.updateAdaptiveDifficulty({
        hitsLanded: 10,
        totalAttacks: 15,
        combosExecuted: 3,
        perfectBlockCount: 2,
        avgReactionTimeMs: 400,
        vitalPointsHit: 5,
        effectiveStanceChanges: 4,
        damageDealt: 50,
        damageTaken: 20,
      });

      // Should not throw error
      expect(trainingAI.getState()).toBeTruthy();
    });
  });

  describe("Custom Personality", () => {
    it("should accept custom personality key", () => {
      const ai = new TrainingAI("medium", { x: 0, y: 0 }, "CHAOS_WARRIOR");
      const state = ai.getState();

      expect(state.personality.koreanName).toBe("혼돈의 전사");
    });

    it("should fallback to balanced fighter for invalid personality", () => {
      const ai = new TrainingAI("medium", { x: 0, y: 0 }, "INVALID_KEY");
      const state = ai.getState();

      expect(state.personality.koreanName).toBe("균형 잡힌 자");
    });
  });
});
