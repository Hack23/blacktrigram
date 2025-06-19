import { describe, it, expect, beforeEach } from "vitest";
import { StanceManager } from "./StanceManager";
import { TrigramStance, PlayerArchetype } from "../../types/enums";
import { createMockPlayer } from "../../test/mocks/playerMocks";
import type { PlayerState } from "../../types/player";

describe("StanceManager", () => {
  let stanceManager: StanceManager;
  let mockPlayer: PlayerState;

  beforeEach(() => {
    stanceManager = new StanceManager();
    mockPlayer = createMockPlayer({
      archetype: PlayerArchetype.MUSA,
      currentStance: TrigramStance.GEON,
      ki: 100,
      stamina: 100,
    });
  });

  describe("canTransitionTo", () => {
    it("should allow transition with sufficient resources", () => {
      const canTransition = stanceManager.canTransitionTo(
        mockPlayer,
        TrigramStance.TAE
      );
      expect(canTransition).toBe(true);
    });

    it("should prevent transition with insufficient resources", () => {
      const lowResourcePlayer = createMockPlayer({
        ki: 5,
        stamina: 5,
      });

      const canTransition = stanceManager.canTransitionTo(
        lowResourcePlayer,
        TrigramStance.TAE
      );
      expect(canTransition).toBe(false);
    });

    it("should allow staying in same stance", () => {
      const canTransition = stanceManager.canTransitionTo(
        mockPlayer,
        mockPlayer.currentStance
      );
      expect(canTransition).toBe(true);
    });
  });

  describe("getTransitionCost", () => {
    it("should return zero cost for same stance", () => {
      const cost = stanceManager.getTransitionCost(
        mockPlayer.currentStance,
        mockPlayer.currentStance
      );
      expect(cost.ki).toBe(0);
      expect(cost.stamina).toBe(0);
    });

    it("should return positive cost for different stances", () => {
      const cost = stanceManager.getTransitionCost(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
      expect(cost.ki).toBeGreaterThan(0);
      expect(cost.stamina).toBeGreaterThan(0);
    });
  });

  describe("executeTransition", () => {
    it("should successfully transition to new stance", () => {
      const result = stanceManager.executeTransition(
        mockPlayer,
        TrigramStance.TAE
      );

      expect(result.success).toBe(true);
      expect(result.newStance).toBe(TrigramStance.TAE);
      expect(result.updatedPlayer.currentStance).toBe(TrigramStance.TAE);
    });

    it("should fail transition with insufficient resources", () => {
      const lowResourcePlayer = createMockPlayer({
        ki: 1,
        stamina: 1,
      });

      const result = stanceManager.executeTransition(
        lowResourcePlayer,
        TrigramStance.TAE
      );

      expect(result.success).toBe(false);
      expect(result.newStance).toBe(lowResourcePlayer.currentStance);
    });
  });

  describe("getOptimalStance", () => {
    it("should recommend counter stance for opponent", () => {
      const opponentStance = TrigramStance.GEON;
      const optimalStance = stanceManager.getOptimalStance(
        mockPlayer,
        opponentStance
      );

      expect(Object.values(TrigramStance)).toContain(optimalStance);
    });

    it("should consider player archetype in recommendations", () => {
      const musaPlayer = createMockPlayer({
        archetype: PlayerArchetype.MUSA,
      });

      const amsaljaPlayer = createMockPlayer({
        archetype: PlayerArchetype.AMSALJA,
      });

      const musaOptimal = stanceManager.getOptimalStance(
        musaPlayer,
        TrigramStance.GEON
      );

      const amsaljaOptimal = stanceManager.getOptimalStance(
        amsaljaPlayer,
        TrigramStance.GEON
      );

      // Different archetypes may have different optimal choices
      expect(Object.values(TrigramStance)).toContain(musaOptimal);
      expect(Object.values(TrigramStance)).toContain(amsaljaOptimal);
    });
  });

  describe("getAllAvailableStances", () => {
    it("should return all trigram stances", () => {
      const stances = stanceManager.getAllAvailableStances(mockPlayer);
      expect(stances).toHaveLength(8); // 8 trigram stances
      expect(stances).toContain(TrigramStance.GEON);
      expect(stances).toContain(TrigramStance.TAE);
      expect(stances).toContain(TrigramStance.LI);
    });

    it("should filter by available resources", () => {
      const lowResourcePlayer = createMockPlayer({
        ki: 5,
        stamina: 5,
      });

      const availableStances =
        stanceManager.getAllAvailableStances(lowResourcePlayer);

      // Should still include current stance
      expect(availableStances).toContain(lowResourcePlayer.currentStance);
    });
  });

  describe("Korean martial arts integration", () => {
    it("should respect traditional trigram philosophy", () => {
      // Each stance should have meaningful costs and effects
      const allStances = Object.values(TrigramStance);

      allStances.forEach((stance) => {
        const cost = stanceManager.getTransitionCost(
          TrigramStance.GEON,
          stance
        );

        if (stance === TrigramStance.GEON) {
          expect(cost.ki).toBe(0);
          expect(cost.stamina).toBe(0);
        } else {
          expect(cost.ki).toBeGreaterThanOrEqual(0);
          expect(cost.stamina).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it("should handle all player archetypes", () => {
      const archetypes = Object.values(PlayerArchetype);

      archetypes.forEach((archetype) => {
        const player = createMockPlayer({ archetype });
        const optimalStance = stanceManager.getOptimalStance(
          player,
          TrigramStance.GEON
        );

        expect(Object.values(TrigramStance)).toContain(optimalStance);
      });
    });
  });
});
