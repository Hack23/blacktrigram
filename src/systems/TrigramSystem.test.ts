import { describe, it, expect, beforeEach } from "vitest";
import { TrigramSystem } from "./TrigramSystem";
import { TrigramStance } from "../types/enums";

/**
 * ## Trigram System Test Suite
 *
 * **Business Purpose:**
 * Validates the core trigram philosophy system that provides authentic I Ching
 * based Korean martial arts stance relationships and combat mechanics.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrigramSystem", () => {
  let trigramSystem: TrigramSystem;

  beforeEach(() => {
    trigramSystem = new TrigramSystem();
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
      TrigramStance.GON   // Earth
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
});
        TrigramStance.GEON,
        TrigramStance.TAE,
        mockPlayerState
      );

      expect(cost.ki).toBeGreaterThan(0);
      expect(cost.stamina).toBeGreaterThan(0);
      expect(cost.timeMilliseconds).toBeGreaterThan(0);
    });
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
