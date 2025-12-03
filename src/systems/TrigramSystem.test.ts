import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../types/common";
import { createPlayerFromArchetype } from "../utils/playerUtils";
import { TrigramSystem } from "./TrigramSystem";
import { PlayerState } from "./player";

describe("TrigramSystem", () => {
  let system: TrigramSystem;
  let mockPlayerState: PlayerState;

  beforeEach(() => {
    system = new TrigramSystem();
    mockPlayerState = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  });

  describe("canTransitionTo", () => {
    it("should allow transition with sufficient resources", () => {
      const canTransition = system.canTransitionTo(
        TrigramStance.GEON,
        TrigramStance.TAE,
        mockPlayerState
      );
      expect(canTransition).toBe(true);
    });

    it("should prevent transition with insufficient resources", () => {
      const lowResourcePlayer: PlayerState = {
        ...mockPlayerState,
        ki: 1,
        stamina: 1,
      };

      const canTransition = system.canTransitionTo(
        TrigramStance.GEON,
        TrigramStance.GAM,
        lowResourcePlayer
      );
      expect(canTransition).toBe(false);
    });
  });

  describe("getTransitionCost", () => {
    it("should return zero cost for same stance", () => {
      const cost = system.getTransitionCost(
        TrigramStance.GEON,
        TrigramStance.GEON,
        mockPlayerState
      );

      expect(cost.ki).toBe(0);
      expect(cost.stamina).toBe(0);
      expect(cost.timeMilliseconds).toBe(0);
    });

    it("should return positive cost for different stances", () => {
      const cost = system.getTransitionCost(
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

  describe("getStanceCharacteristic", () => {
    it("should identify GAN (Mountain) as defensive", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.GAN);
      expect(characteristic).toBe("defensive");
    });

    it("should identify GON (Earth) as defensive", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.GON);
      expect(characteristic).toBe("defensive");
    });

    it("should identify GEON (Heaven) as offensive", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.GEON);
      expect(characteristic).toBe("offensive");
    });

    it("should identify JIN (Thunder) as offensive", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.JIN);
      expect(characteristic).toBe("offensive");
    });

    it("should identify TAE (Lake) as balanced", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.TAE);
      expect(characteristic).toBe("balanced");
    });

    it("should identify LI (Fire) as balanced", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.LI);
      expect(characteristic).toBe("balanced");
    });

    it("should identify SON (Wind) as balanced", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.SON);
      expect(characteristic).toBe("balanced");
    });

    it("should identify GAM (Water) as balanced", () => {
      const characteristic = system.getStanceCharacteristic(TrigramStance.GAM);
      expect(characteristic).toBe("balanced");
    });
  });

  describe("isDefensiveStance", () => {
    it("should return true for GAN (Mountain)", () => {
      expect(system.isDefensiveStance(TrigramStance.GAN)).toBe(true);
    });

    it("should return true for GON (Earth)", () => {
      expect(system.isDefensiveStance(TrigramStance.GON)).toBe(true);
    });

    it("should return false for GEON (Heaven)", () => {
      expect(system.isDefensiveStance(TrigramStance.GEON)).toBe(false);
    });

    it("should return false for TAE (Lake)", () => {
      expect(system.isDefensiveStance(TrigramStance.TAE)).toBe(false);
    });
  });

  describe("isOffensiveStance", () => {
    it("should return true for GEON (Heaven)", () => {
      expect(system.isOffensiveStance(TrigramStance.GEON)).toBe(true);
    });

    it("should return true for JIN (Thunder)", () => {
      expect(system.isOffensiveStance(TrigramStance.JIN)).toBe(true);
    });

    it("should return false for GAN (Mountain)", () => {
      expect(system.isOffensiveStance(TrigramStance.GAN)).toBe(false);
    });

    it("should return false for TAE (Lake)", () => {
      expect(system.isOffensiveStance(TrigramStance.TAE)).toBe(false);
    });
  });
});
