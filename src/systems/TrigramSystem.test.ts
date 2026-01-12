import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../types/common";
import { createPlayerFromArchetype } from "../utils/playerUtils";
import { TrigramSystem, applyCounterStanceDamage, COUNTER_STANCE_DAMAGE_MULTIPLIER } from "./TrigramSystem";
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

  describe("Counter Stance System", () => {
    describe("getCounterStance", () => {
      it("should return GAM (Water) as counter to GEON (Heaven)", () => {
        expect(system.getCounterStance(TrigramStance.GEON)).toBe(TrigramStance.GAM);
      });

      it("should return GAN (Mountain) as counter to JIN (Thunder)", () => {
        expect(system.getCounterStance(TrigramStance.JIN)).toBe(TrigramStance.GAN);
      });

      it("should return SON (Wind) as counter to LI (Fire)", () => {
        expect(system.getCounterStance(TrigramStance.LI)).toBe(TrigramStance.SON);
      });

      it("should return counter stances for all 8 trigram stances", () => {
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

        stances.forEach(stance => {
          const counter = system.getCounterStance(stance);
          expect(counter).toBeDefined();
          expect(stances).toContain(counter);
        });
      });
    });

    describe("isCounterStance", () => {
      it("should return true when stance counters opponent's stance", () => {
        // GAM (Water) counters GEON (Heaven)
        expect(system.isCounterStance(TrigramStance.GAM, TrigramStance.GEON)).toBe(true);
      });

      it("should return false when stance does not counter opponent's stance", () => {
        // GEON (Heaven) does not counter itself
        expect(system.isCounterStance(TrigramStance.GEON, TrigramStance.GEON)).toBe(false);
      });

      it("should return false when using non-counter stance", () => {
        // TAE (Lake) does not counter GEON (Heaven)
        expect(system.isCounterStance(TrigramStance.TAE, TrigramStance.GEON)).toBe(false);
      });

      it("should correctly identify all counter relationships", () => {
        const counterPairs: Array<[TrigramStance, TrigramStance]> = [
          [TrigramStance.GAM, TrigramStance.GEON], // Water counters Heaven
          [TrigramStance.GON, TrigramStance.TAE],  // Earth counters Lake
          [TrigramStance.SON, TrigramStance.LI],   // Wind counters Fire
          [TrigramStance.GAN, TrigramStance.JIN],  // Mountain counters Thunder
          [TrigramStance.GEON, TrigramStance.SON], // Heaven counters Wind
          [TrigramStance.TAE, TrigramStance.GAM],  // Lake counters Water
          [TrigramStance.LI, TrigramStance.GAN],   // Fire counters Mountain
          [TrigramStance.JIN, TrigramStance.GON],  // Thunder counters Earth
        ];

        counterPairs.forEach(([counterStance, targetStance]) => {
          expect(system.isCounterStance(counterStance, targetStance)).toBe(true);
        });
      });
    });
  });

  describe("applyCounterStanceDamage", () => {
    it("should apply 1.2x multiplier when isCounterStance is true", () => {
      const baseDamage = 100;
      const result = applyCounterStanceDamage(baseDamage, true);
      expect(result).toBe(baseDamage * COUNTER_STANCE_DAMAGE_MULTIPLIER);
      expect(result).toBe(120);
    });

    it("should return base damage when isCounterStance is false", () => {
      const baseDamage = 100;
      const result = applyCounterStanceDamage(baseDamage, false);
      expect(result).toBe(baseDamage);
    });

    it("should return base damage unchanged for zero damage", () => {
      const result = applyCounterStanceDamage(0, true);
      expect(result).toBe(0);
    });

    it("should return base damage unchanged for negative damage", () => {
      const result = applyCounterStanceDamage(-50, true);
      expect(result).toBe(-50);
    });

    it("should work with fractional damage values", () => {
      const baseDamage = 75.5;
      const result = applyCounterStanceDamage(baseDamage, true);
      expect(result).toBeCloseTo(baseDamage * COUNTER_STANCE_DAMAGE_MULTIPLIER);
      expect(result).toBeCloseTo(90.6);
    });

    it("should integrate with isCounterStance check", () => {
      const baseDamage = 100;
      const isCounter = system.isCounterStance(TrigramStance.GAM, TrigramStance.GEON);
      const finalDamage = applyCounterStanceDamage(baseDamage, isCounter);
      
      expect(isCounter).toBe(true);
      expect(finalDamage).toBe(120);
    });
  });
});
