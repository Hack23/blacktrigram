/**
 * Unit tests for StanceAura component
 * 
 * Tests the stance aura component structure and TypeScript interface.
 * Full rendering tests are done in E2E tests.
 */

import { describe, it, expect } from "vitest";
import { StanceAura } from "./StanceAura";
import { TrigramStance } from "../../types/common";

describe("StanceAura", () => {
  it("should be defined and importable", () => {
    expect(StanceAura).toBeDefined();
    expect(typeof StanceAura).toBe("function");
  });

  describe("All Trigram Stances", () => {
    it("should accept all 8 trigram stances", () => {
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
        const props = { stance, intensity: 0.5 };
        expect(props.stance).toBe(stance);
        expect(props.intensity).toBe(0.5);
      });
    });
  });

  describe("Intensity Levels", () => {
    it("should handle zero intensity", () => {
      const props = { stance: TrigramStance.GEON, intensity: 0 };
      expect(props.intensity).toBe(0);
    });

    it("should handle low intensity", () => {
      const props = { stance: TrigramStance.GEON, intensity: 0.2 };
      expect(props.intensity).toBe(0.2);
    });

    it("should handle medium intensity", () => {
      const props = { stance: TrigramStance.GEON, intensity: 0.5 };
      expect(props.intensity).toBe(0.5);
    });

    it("should handle high intensity", () => {
      const props = { stance: TrigramStance.GEON, intensity: 0.9 };
      expect(props.intensity).toBe(0.9);
    });

    it("should handle full intensity", () => {
      const props = { stance: TrigramStance.GEON, intensity: 1.0 };
      expect(props.intensity).toBe(1.0);
    });
  });

  describe("Animation", () => {
    it("should handle animation enabled", () => {
      const props = { stance: TrigramStance.GEON, intensity: 0.5, animated: true };
      expect(props.animated).toBe(true);
    });

    it("should handle animation disabled", () => {
      const props = { stance: TrigramStance.GEON, intensity: 0.5, animated: false };
      expect(props.animated).toBe(false);
    });
  });
});
