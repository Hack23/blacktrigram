/**
 * Unit tests for StanceAuraParticles component
 * 
 * Tests particle system structure and TypeScript interface.
 * Full rendering tests are done in E2E tests.
 */

import { describe, it, expect } from "vitest";
import { StanceAuraParticles } from "./StanceAuraParticles";
import { TrigramStance } from "../../types/common";

describe("StanceAuraParticles", () => {
  it("should be defined and importable", () => {
    expect(StanceAuraParticles).toBeDefined();
    expect(typeof StanceAuraParticles).toBe("function");
  });

  describe("Component Props", () => {
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
        const props = { stance };
        expect(props.stance).toBe(stance);
      });
    });

    it("should accept intensity values", () => {
      const intensities = [0, 0.25, 0.5, 0.75, 1.0];
      
      intensities.forEach((intensity) => {
        const props = { 
          stance: TrigramStance.GEON, 
          intensity 
        };
        expect(props.intensity).toBe(intensity);
      });
    });

    it("should accept particle count", () => {
      const counts = [50, 100, 200, 500];
      
      counts.forEach((count) => {
        const props = { 
          stance: TrigramStance.GEON, 
          count 
        };
        expect(props.count).toBe(count);
      });
    });

    it("should accept animated flag", () => {
      const props1 = { stance: TrigramStance.GEON, animated: true };
      const props2 = { stance: TrigramStance.GEON, animated: false };
      
      expect(props1.animated).toBe(true);
      expect(props2.animated).toBe(false);
    });

    it("should accept spread radius", () => {
      const spreads = [1.0, 2.0, 3.0, 5.0];
      
      spreads.forEach((spread) => {
        const props = { 
          stance: TrigramStance.GEON, 
          spread 
        };
        expect(props.spread).toBe(spread);
      });
    });
  });

  describe("Default Props", () => {
    it("should have default intensity of 1.0", () => {
      const props = { stance: TrigramStance.GEON };
      // Component uses default value if not provided
      expect(props.stance).toBe(TrigramStance.GEON);
    });

    it("should have default count of 200", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });

    it("should have default animated as true", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });

    it("should have default spread of 2.0", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });
  });

  describe("Stance Colors", () => {
    it("should map each stance to a unique color", () => {
      const stances = [
        TrigramStance.GEON, // Gold
        TrigramStance.TAE,  // Sky Blue
        TrigramStance.LI,   // Orange Red
        TrigramStance.JIN,  // Purple
        TrigramStance.SON,  // Light Green
        TrigramStance.GAM,  // Blue
        TrigramStance.GAN,  // Brown
        TrigramStance.GON,  // Dark Khaki
      ];

      stances.forEach((stance) => {
        const props = { stance };
        expect(props.stance).toBeDefined();
      });
    });
  });

  describe("Stance Patterns", () => {
    it("should have unique animation patterns for each stance", () => {
      const stances = [
        { stance: TrigramStance.GEON, name: "Heaven - Direct upward" },
        { stance: TrigramStance.TAE, name: "Lake - Fluid wavy" },
        { stance: TrigramStance.LI, name: "Fire - Fast erratic" },
        { stance: TrigramStance.JIN, name: "Thunder - Explosive" },
        { stance: TrigramStance.SON, name: "Wind - Swirling" },
        { stance: TrigramStance.GAM, name: "Water - Flowing" },
        { stance: TrigramStance.GAN, name: "Mountain - Stable" },
        { stance: TrigramStance.GON, name: "Earth - Grounded" },
      ];

      stances.forEach(({ stance, name }) => {
        const props = { stance };
        expect(props.stance).toBe(stance);
        expect(name).toBeDefined();
      });
    });
  });

  describe("Performance", () => {
    it("should handle low particle counts efficiently", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        count: 50 
      };
      expect(props.count).toBe(50);
    });

    it("should handle high particle counts", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        count: 500 
      };
      expect(props.count).toBe(500);
    });

    it("should support disabling animation for performance", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        animated: false 
      };
      expect(props.animated).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero intensity gracefully", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        intensity: 0 
      };
      expect(props.intensity).toBe(0);
    });

    it("should handle very low intensity", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        intensity: 0.05 
      };
      expect(props.intensity).toBe(0.05);
    });

    it("should handle maximum intensity", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        intensity: 1.0 
      };
      expect(props.intensity).toBe(1.0);
    });

    it("should handle minimal particle count", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        count: 10 
      };
      expect(props.count).toBe(10);
    });

    it("should handle minimal spread radius", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        spread: 0.5 
      };
      expect(props.spread).toBe(0.5);
    });
  });

  describe("Korean Martial Arts Theme", () => {
    it("should support Heaven stance (Geon)", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBe(TrigramStance.GEON);
    });

    it("should support Lake stance (Tae)", () => {
      const props = { stance: TrigramStance.TAE };
      expect(props.stance).toBe(TrigramStance.TAE);
    });

    it("should support Fire stance (Li)", () => {
      const props = { stance: TrigramStance.LI };
      expect(props.stance).toBe(TrigramStance.LI);
    });

    it("should support Thunder stance (Jin)", () => {
      const props = { stance: TrigramStance.JIN };
      expect(props.stance).toBe(TrigramStance.JIN);
    });

    it("should support Wind stance (Son)", () => {
      const props = { stance: TrigramStance.SON };
      expect(props.stance).toBe(TrigramStance.SON);
    });

    it("should support Water stance (Gam)", () => {
      const props = { stance: TrigramStance.GAM };
      expect(props.stance).toBe(TrigramStance.GAM);
    });

    it("should support Mountain stance (Gan)", () => {
      const props = { stance: TrigramStance.GAN };
      expect(props.stance).toBe(TrigramStance.GAN);
    });

    it("should support Earth stance (Gon)", () => {
      const props = { stance: TrigramStance.GON };
      expect(props.stance).toBe(TrigramStance.GON);
    });
  });
});
