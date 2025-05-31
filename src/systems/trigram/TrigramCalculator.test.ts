import { describe, it, expect } from "vitest";
import { TrigramCalculator } from "./TrigramCalculator";
import { TrigramSystem } from "../TrigramSystem"; // Add TrigramSystem import
import type { TrigramStance, KiFlowFactors } from "../../types";

describe("TrigramCalculator", () => {
  describe("calculateKiFlow", () => {
    it("should calculate Ki flow between stances", () => {
      const fromStance: TrigramStance = "geon";
      const toStance: TrigramStance = "li";
      const factors: KiFlowFactors = {
        playerLevelModifier: 1.2,
        stanceAffinity: 1.1,
        kiRecovery: 5,
        kiConsumption: 3,
      };

      // Use TrigramSystem.calculateKiFlow instead of TrigramCalculator.calculateKiFlow
      const result = TrigramSystem.calculateKiFlow(
        fromStance,
        toStance,
        factors
      );

      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
    });

    it("should handle same stance transitions", () => {
      const stance: TrigramStance = "geon";
      const factors: KiFlowFactors = {};

      const result = TrigramSystem.calculateKiFlow(stance, stance, factors);

      expect(result).toBeGreaterThan(0);
    });

    it("should apply player level modifiers correctly", () => {
      const fromStance: TrigramStance = "gam";
      const toStance: TrigramStance = "gan";

      const baseFactors: KiFlowFactors = { playerLevelModifier: 1.0 };
      const enhancedFactors: KiFlowFactors = { playerLevelModifier: 1.5 };

      const baseFlow = TrigramSystem.calculateKiFlow(
        fromStance,
        toStance,
        baseFactors
      );
      const enhancedFlow = TrigramSystem.calculateKiFlow(
        fromStance,
        toStance,
        enhancedFactors
      );

      expect(enhancedFlow).toBeGreaterThan(baseFlow);
    });
  });

  describe("trigram stance calculations", () => {
    it("should calculate traditional Korean trigram relationships", () => {
      const heavenStance: TrigramStance = "geon";
      const earthStance: TrigramStance = "gon";

      // Heaven and Earth should have complementary flow
      const result = TrigramSystem.calculateKiFlow(
        heavenStance,
        earthStance,
        {}
      );
      expect(result).toBeGreaterThan(0);
    });

    it("should handle elemental relationships", () => {
      const fireStance: TrigramStance = "li";
      const waterStance: TrigramStance = "gam";

      // Fire and Water opposing elements
      const result = TrigramSystem.calculateKiFlow(fireStance, waterStance, {});
      expect(result).toBeGreaterThan(0);
    });
  });

  // If TrigramCalculator has its own methods, test those here
  describe("TrigramCalculator specific methods", () => {
    it("should exist as a class", () => {
      expect(TrigramCalculator).toBeDefined();
    });

    // Add tests for actual TrigramCalculator methods when they exist
    // For now, this serves as a placeholder for future functionality
  });
});
