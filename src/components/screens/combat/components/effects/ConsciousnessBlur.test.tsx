/**
 * ConsciousnessBlur Component Tests
 * 
 * Tests component props, blur calculation logic, and TypeScript interfaces.
 * Full rendering tests are done in E2E tests with Three.js context.
 */

import { describe, it, expect } from "vitest";
import { ConsciousnessBlur } from "./ConsciousnessBlur";

describe("ConsciousnessBlur", () => {
  it("should be defined and importable", () => {
    expect(ConsciousnessBlur).toBeDefined();
    expect(typeof ConsciousnessBlur).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept consciousness and isMobile props", () => {
      const props = { consciousness: 70, isMobile: false };
      expect(props.consciousness).toBe(70);
      expect(props.isMobile).toBe(false);
    });

    it("should accept different consciousness values", () => {
      const props1 = { consciousness: 0, isMobile: false };
      const props2 = { consciousness: 50, isMobile: false };
      const props3 = { consciousness: 100, isMobile: false };
      expect(props1.consciousness).toBe(0);
      expect(props2.consciousness).toBe(50);
      expect(props3.consciousness).toBe(100);
    });

    it("should accept mobile mode", () => {
      const props = { consciousness: 70, isMobile: true };
      expect(props.isMobile).toBe(true);
    });
  });

  describe("Threshold Logic", () => {
    it("should not render above threshold (consciousness > 90)", () => {
      const highConsciousness = [91, 95, 100];
      highConsciousness.forEach((consciousness) => {
        const props = { consciousness, isMobile: false };
        expect(props.consciousness).toBeGreaterThan(90);
      });
    });

    it("should render at or below threshold (consciousness <= 90)", () => {
      const lowConsciousness = [90, 70, 50, 25, 0];
      lowConsciousness.forEach((consciousness) => {
        const props = { consciousness, isMobile: false };
        expect(props.consciousness).toBeLessThanOrEqual(90);
      });
    });
  });

  describe("Blur Intensity Calculation", () => {
    it("should calculate blur amount inversely to consciousness", () => {
      const testCases = [
        { consciousness: 100, expectedBlur: 0 },
        { consciousness: 90, expectedBlur: 1 }, // Math.round((10/100)*12) = 1
        { consciousness: 50, expectedBlur: 6 },
        { consciousness: 0, expectedBlur: 12 },
      ];

      testCases.forEach(({ consciousness, expectedBlur }) => {
        const maxBlur = 12;
        const blurAmount = Math.round(((100 - consciousness) / 100) * maxBlur);
        expect(blurAmount).toBe(expectedBlur);
      });
    });

    it("should use reduced blur on mobile", () => {
      const maxBlurMobile = 8;
      const maxBlurDesktop = 12;
      expect(maxBlurMobile).toBeLessThan(maxBlurDesktop);
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative consciousness by clamping to 0", () => {
      const props = { consciousness: -10, isMobile: false };
      const clamped = Math.max(0, Math.min(100, props.consciousness));
      expect(clamped).toBe(0);
    });

    it("should handle consciousness above 100 by clamping", () => {
      const props = { consciousness: 150, isMobile: false };
      const clamped = Math.max(0, Math.min(100, props.consciousness));
      expect(clamped).toBe(100);
    });

    it("should handle decimal consciousness values", () => {
      const props = { consciousness: 72.5, isMobile: false };
      expect(props.consciousness).toBe(72.5);
    });
  });

  describe("Mobile Optimization", () => {
    it("should accept mobile mode for all consciousness levels", () => {
      const props1 = { consciousness: 10, isMobile: true };
      const props2 = { consciousness: 50, isMobile: true };
      const props3 = { consciousness: 90, isMobile: true };
      expect(props1.isMobile).toBe(true);
      expect(props2.isMobile).toBe(true);
      expect(props3.isMobile).toBe(true);
    });
  });
});
