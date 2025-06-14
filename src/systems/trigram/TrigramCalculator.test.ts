import { describe, it, expect } from "vitest";
import { TrigramCalculator } from "./TrigramCalculator";
import { TrigramStance } from "../../types/enums";

/**
 * ## Trigram Calculator Test Suite
 *
 * **Business Purpose:**
 * Validates the mathematical foundation of Black Trigram's Korean martial arts
 * trigram system. Tests ensure that:
 * - Trigram calculations follow authentic I Ching mathematical principles
 * - Stance relationships maintain traditional Korean martial arts hierarchy
 * - Combat effectiveness calculations respect cultural trigram philosophy
 * - Mathematical precision supports competitive gameplay balance
 *
 * **Korean Martial Arts Integration:**
 * - Tests traditional I Ching trigram mathematical relationships
 * - Validates authentic Korean martial arts stance progression calculations
 * - Ensures cultural accuracy in trigram transformation mathematics
 * - Verifies traditional Korean martial arts energy flow calculations
 *
 * **Business Value:**
 * These tests ensure trigram calculations provide mathematically sound and
 * culturally authentic Korean martial arts combat mechanics.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrigramCalculator", () => {
  let calculator: TrigramCalculator;

  beforeEach(() => {
    calculator = new TrigramCalculator();
  });

  /**
   * **Business Requirement:** Trigram calculations must follow traditional
   * I Ching mathematical principles with cultural authenticity
   */
  describe("Traditional Trigram Mathematics", () => {
    it("should calculate trigram opposites correctly", () => {
      expect(calculator.getOpposite(TrigramStance.GEON)).toBe(
        TrigramStance.GON
      );
      expect(calculator.getOpposite(TrigramStance.LI)).toBe(TrigramStance.GAM);
      expect(calculator.getOpposite(TrigramStance.JIN)).toBe(TrigramStance.GAN);
      expect(calculator.getOpposite(TrigramStance.SON)).toBe(TrigramStance.TAE);
    });

    it("should calculate trigram adjacency relationships", () => {
      const adjacent = calculator.getAdjacentStances(TrigramStance.GEON);
      expect(adjacent).toContain(TrigramStance.TAE);
      expect(adjacent).toContain(TrigramStance.SON);
    });

    it("should calculate trigram transformation difficulty", () => {
      // Adjacent stances should be easier to transform
      const easyTransition = calculator.getTransitionDifficulty(
        TrigramStance.GEON,
        TrigramStance.TAE
      );

      // Opposite stances should be hardest to transform
      const hardTransition = calculator.getTransitionDifficulty(
        TrigramStance.GEON,
        TrigramStance.GON
      );

      expect(hardTransition).toBeGreaterThan(easyTransition);
    });
  });

  /**
   * **Business Requirement:** Korean martial arts effectiveness calculations
   * must respect traditional combat principles and philosophy
   */
  describe("Combat Effectiveness Calculations", () => {
    it("should calculate stance effectiveness against other stances", () => {
      // Heaven (건) should be strong against Earth (곤)
      const effectiveness = calculator.calculateStanceEffectiveness(
        TrigramStance.GEON,
        TrigramStance.GON
      );

      expect(effectiveness).toBeGreaterThan(1.0);
    });

    it("should calculate energy flow between stances", () => {
      const energyFlow = calculator.calculateEnergyFlow(
        TrigramStance.LI,
        TrigramStance.GAM
      );

      // Fire and Water should have opposing energy flow
      expect(energyFlow).toBeLessThan(0);
    });

    it("should maintain trigram balance in calculations", () => {
      const stances = Object.values(TrigramStance);
      const totalBalance = stances.reduce((sum, stance) => {
        return sum + calculator.getStanceBalance(stance);
      }, 0);

      // Total balance should be neutral (close to 0)
      expect(Math.abs(totalBalance)).toBeLessThan(0.1);
    });
  });
});
