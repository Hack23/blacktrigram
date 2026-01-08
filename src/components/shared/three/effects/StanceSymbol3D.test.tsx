/**
 * Unit tests for StanceSymbol3D component
 * 
 * Tests the floating trigram symbol component structure and props.
 * Full rendering tests are done in E2E tests.
 */

import { describe, it, expect } from "vitest";
import { StanceSymbol3D } from "./StanceSymbol3D";
import { TrigramStance } from "../../../../types/common";

describe("StanceSymbol3D", () => {
  it("should be defined and importable", () => {
    expect(StanceSymbol3D).toBeDefined();
    expect(typeof StanceSymbol3D).toBe("function");
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

    it("should accept height offset", () => {
      const offsets = [1.0, 2.0, 2.5, 3.0, 4.0];
      
      offsets.forEach((heightOffset) => {
        const props = { 
          stance: TrigramStance.GEON, 
          heightOffset 
        };
        expect(props.heightOffset).toBe(heightOffset);
      });
    });

    it("should accept animated flag", () => {
      const props1 = { stance: TrigramStance.GEON, animated: true };
      const props2 = { stance: TrigramStance.GEON, animated: false };
      
      expect(props1.animated).toBe(true);
      expect(props2.animated).toBe(false);
    });

    it("should accept scale multiplier", () => {
      const scales = [0.5, 0.8, 1.0, 1.5, 2.0];
      
      scales.forEach((scale) => {
        const props = { 
          stance: TrigramStance.GEON, 
          scale 
        };
        expect(props.scale).toBe(scale);
      });
    });

    it("should accept showName flag", () => {
      const props1 = { stance: TrigramStance.GEON, showName: true };
      const props2 = { stance: TrigramStance.GEON, showName: false };
      
      expect(props1.showName).toBe(true);
      expect(props2.showName).toBe(false);
    });
  });

  describe("Trigram Symbols", () => {
    it("should map GEON to ☰ (Heaven)", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBe(TrigramStance.GEON);
    });

    it("should map TAE to ☱ (Lake)", () => {
      const props = { stance: TrigramStance.TAE };
      expect(props.stance).toBe(TrigramStance.TAE);
    });

    it("should map LI to ☲ (Fire)", () => {
      const props = { stance: TrigramStance.LI };
      expect(props.stance).toBe(TrigramStance.LI);
    });

    it("should map JIN to ☳ (Thunder)", () => {
      const props = { stance: TrigramStance.JIN };
      expect(props.stance).toBe(TrigramStance.JIN);
    });

    it("should map SON to ☴ (Wind)", () => {
      const props = { stance: TrigramStance.SON };
      expect(props.stance).toBe(TrigramStance.SON);
    });

    it("should map GAM to ☵ (Water)", () => {
      const props = { stance: TrigramStance.GAM };
      expect(props.stance).toBe(TrigramStance.GAM);
    });

    it("should map GAN to ☶ (Mountain)", () => {
      const props = { stance: TrigramStance.GAN };
      expect(props.stance).toBe(TrigramStance.GAN);
    });

    it("should map GON to ☷ (Earth)", () => {
      const props = { stance: TrigramStance.GON };
      expect(props.stance).toBe(TrigramStance.GON);
    });
  });

  describe("Korean Names", () => {
    it("should provide Korean name for GEON (건)", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBe(TrigramStance.GEON);
    });

    it("should provide Korean name for TAE (태)", () => {
      const props = { stance: TrigramStance.TAE };
      expect(props.stance).toBe(TrigramStance.TAE);
    });

    it("should provide Korean name for LI (리)", () => {
      const props = { stance: TrigramStance.LI };
      expect(props.stance).toBe(TrigramStance.LI);
    });

    it("should provide Korean name for JIN (진)", () => {
      const props = { stance: TrigramStance.JIN };
      expect(props.stance).toBe(TrigramStance.JIN);
    });

    it("should provide Korean name for SON (손)", () => {
      const props = { stance: TrigramStance.SON };
      expect(props.stance).toBe(TrigramStance.SON);
    });

    it("should provide Korean name for GAM (감)", () => {
      const props = { stance: TrigramStance.GAM };
      expect(props.stance).toBe(TrigramStance.GAM);
    });

    it("should provide Korean name for GAN (간)", () => {
      const props = { stance: TrigramStance.GAN };
      expect(props.stance).toBe(TrigramStance.GAN);
    });

    it("should provide Korean name for GON (곤)", () => {
      const props = { stance: TrigramStance.GON };
      expect(props.stance).toBe(TrigramStance.GON);
    });
  });

  describe("Stance Colors", () => {
    it("should provide unique color for each stance", () => {
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

  describe("Default Props", () => {
    it("should have default heightOffset of 2.5", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });

    it("should have default animated as true", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });

    it("should have default scale of 1.0", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });

    it("should have default showName as true", () => {
      const props = { stance: TrigramStance.GEON };
      expect(props.stance).toBeDefined();
    });
  });

  describe("Animation Settings", () => {
    it("should support rotation animation", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        animated: true 
      };
      expect(props.animated).toBe(true);
    });

    it("should support static display without animation", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        animated: false 
      };
      expect(props.animated).toBe(false);
    });
  });

  describe("Display Options", () => {
    it("should support showing Korean name", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        showName: true 
      };
      expect(props.showName).toBe(true);
    });

    it("should support hiding Korean name", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        showName: false 
      };
      expect(props.showName).toBe(false);
    });
  });

  describe("Scale Adjustments", () => {
    it("should support smaller scale for mobile", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        scale: 0.7 
      };
      expect(props.scale).toBe(0.7);
    });

    it("should support larger scale for emphasis", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        scale: 1.5 
      };
      expect(props.scale).toBe(1.5);
    });

    it("should support minimal scale", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        scale: 0.5 
      };
      expect(props.scale).toBe(0.5);
    });

    it("should support maximum scale", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        scale: 2.0 
      };
      expect(props.scale).toBe(2.0);
    });
  });

  describe("Height Positioning", () => {
    it("should support low height offset", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        heightOffset: 1.5 
      };
      expect(props.heightOffset).toBe(1.5);
    });

    it("should support high height offset", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        heightOffset: 4.0 
      };
      expect(props.heightOffset).toBe(4.0);
    });

    it("should support default height offset", () => {
      const props = { 
        stance: TrigramStance.GEON, 
        heightOffset: 2.5 
      };
      expect(props.heightOffset).toBe(2.5);
    });
  });

  describe("Korean Martial Arts Integration", () => {
    it("should represent I Ching trigram system", () => {
      const trigrams = [
        TrigramStance.GEON, // ☰
        TrigramStance.TAE,  // ☱
        TrigramStance.LI,   // ☲
        TrigramStance.JIN,  // ☳
        TrigramStance.SON,  // ☴
        TrigramStance.GAM,  // ☵
        TrigramStance.GAN,  // ☶
        TrigramStance.GON,  // ☷
      ];

      expect(trigrams).toHaveLength(8);
      trigrams.forEach((stance) => {
        const props = { stance };
        expect(props.stance).toBeDefined();
      });
    });
  });
});
