import { describe, it, expect, beforeEach } from "vitest";
import { TrigramSystem } from "./TrigramSystem";
import { TrigramStance, PlayerArchetype } from "../types/enums";
import type { PlayerState } from "../types/player";

describe("TrigramSystem", () => {
  let trigramSystem: TrigramSystem;
  let mockPlayer: PlayerState;

  beforeEach(() => {
    trigramSystem = new TrigramSystem();
    mockPlayer = {
      id: "test-player",
      currentStance: TrigramStance.GEON,
      archetype: PlayerArchetype.MUSA,
    };
  });

  describe("Korean Trigram Philosophy Integration", () => {
    it("should handle all eight trigram stances correctly", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];

      stances.forEach((stance) => {
        const result = trigramSystem.changeStance(mockPlayer, stance);
        expect(result.success).toBe(true);
        expect(result.newStance).toBe(stance);
      });
    });

    it("should calculate archetype mastery bonuses correctly", () => {
      const musaMastery = trigramSystem.getStanceMastery(
        PlayerArchetype.MUSA,
        TrigramStance.GEON
      );
      const amsaljaMastery = trigramSystem.getStanceMastery(
        PlayerArchetype.AMSALJA,
        TrigramStance.SON
      );

      expect(musaMastery).toBeGreaterThan(1.0); // Musa should excel at Heaven stance
      expect(amsaljaMastery).toBeGreaterThan(1.0); // Assassin should excel at Wind stance
    });
  });

  it("should initialize with all eight trigram stances", () => {
    const stances = trigramSystem.getAllStances();
    expect(stances).toHaveLength(8);
    expect(stances).toContain(TrigramStance.GEON);
    expect(stances).toContain(TrigramStance.GON);
  });

  it("should calculate stance relationships correctly", () => {
    const effectiveness = trigramSystem.calculateStanceEffectiveness(
      TrigramStance.GEON, // Heaven
      TrigramStance.GON // Earth
    );

    // Heaven should be strong against Earth in I Ching philosophy
    expect(effectiveness).toBeGreaterThan(1.0);
  });

  it("should validate stance transitions", () => {
    const canTransition = trigramSystem.canTransitionToStance(
      TrigramStance.GEON,
      TrigramStance.TAE,
      { ki: 50, stamina: 50 }
    );

    expect(typeof canTransition).toBe("boolean");
  });

  it("should provide Korean cultural context for stances", () => {
    const context = trigramSystem.getStanceContext(TrigramStance.GEON);

    expect(context.koreanName).toBe("건");
    expect(context.englishName).toBe("Heaven");
    expect(context.philosophy).toBeTruthy();
  });

  describe("calculateStanceEffectiveness", () => {
    it("should calculate effectiveness between stances", () => {
      const effectiveness = system.calculateStanceEffectiveness(
        TrigramStance.GEON,
        TrigramStance.GON
      );

      expect(effectiveness).toBeGreaterThan(0);
      expect(effectiveness).toBeLessThanOrEqual(2);
    });
  });

  describe("getCurrentStanceData", () => {
    it("should return stance data", () => {
      const data = system.getCurrentStanceData(TrigramStance.GEON);
      expect(data).toBeDefined();
      expect(data?.id).toBe(TrigramStance.GEON);
    });
  });

  describe("recommendStance", () => {
    it("should recommend optimal stance", () => {
      const recommendedStance = system.recommendStance(mockPlayerState);
      expect(Object.values(TrigramStance)).toContain(recommendedStance);
    });
  });

  describe("validateTransition", () => {
    it("should validate valid transitions", () => {
      const result = system.validateTransition(
        TrigramStance.GEON,
        TrigramStance.TAE,
        mockPlayerState
      );
      expect(result.valid).toBe(true);
    });

    it("should invalidate insufficient resource transitions", () => {
      const lowResourcePlayer: PlayerState = {
        ...mockPlayerState,
        ki: 0,
        stamina: 0,
      };

      const result = system.validateTransition(
        TrigramStance.GEON,
        TrigramStance.GAM,
        lowResourcePlayer
      );
      expect(result.valid).toBe(false);
      expect(result.reason).toBeDefined();
    });
  });
});
