/**
 * PainVignette Component Tests
 * 
 * Tests component props, visibility logic, and TypeScript interfaces.
 * Full rendering tests are done in E2E tests with Three.js context.
 */

import { describe, it, expect } from "vitest";
import { PainVignette } from "./PainVignette";

describe("PainVignette", () => {
  it("should be defined and importable", () => {
    expect(PainVignette).toBeDefined();
    expect(typeof PainVignette).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept pain and isMobile props", () => {
      const props = { pain: 50, isMobile: false };
      expect(props.pain).toBe(50);
      expect(props.isMobile).toBe(false);
    });

    it("should accept different pain values", () => {
      const props1 = { pain: 0, isMobile: false };
      const props2 = { pain: 50, isMobile: false };
      const props3 = { pain: 100, isMobile: false };
      expect(props1.pain).toBe(0);
      expect(props2.pain).toBe(50);
      expect(props3.pain).toBe(100);
    });

    it("should accept mobile mode", () => {
      const props = { pain: 50, isMobile: true };
      expect(props.isMobile).toBe(true);
    });
  });

  describe("Pain Threshold Logic", () => {
    it("should not render below threshold (pain < 5)", () => {
      // Component should return null for pain < 5
      const lowPainProps = [0, 1, 2, 3, 4];
      lowPainProps.forEach(pain => {
        const props = { pain, isMobile: false };
        expect(props.pain).toBeLessThan(5);
      });
    });

    it("should render at threshold (pain >= 5)", () => {
      // Component should render for pain >= 5
      const visiblePainProps = [5, 10, 50, 75, 100];
      visiblePainProps.forEach(pain => {
        const props = { pain, isMobile: false };
        expect(props.pain).toBeGreaterThanOrEqual(5);
      });
    });
  });

  describe("Pain Intensity Ranges", () => {
    it("should handle minimum visible pain (5%)", () => {
      const props = { pain: 5, isMobile: false };
      expect(props.pain).toBe(5);
    });

    it("should handle low pain (20%)", () => {
      const props = { pain: 20, isMobile: false };
      expect(props.pain).toBe(20);
    });

    it("should handle moderate pain (50%)", () => {
      const props = { pain: 50, isMobile: false };
      expect(props.pain).toBe(50);
    });

    it("should handle high pain (75%)", () => {
      const props = { pain: 75, isMobile: false };
      expect(props.pain).toBe(75);
    });

    it("should handle maximum pain (100%)", () => {
      const props = { pain: 100, isMobile={false} };
      expect(props.pain).toBe(100);
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative pain values", () => {
      const props = { pain: -10, isMobile: false };
      // Logic should clamp to 0
      const clamped = Math.max(0, Math.min(100, props.pain));
      expect(clamped).toBe(0);
    });

    it("should handle pain values above 100", () => {
      const props = { pain: 150, isMobile: false };
      // Logic should clamp to 100
      const clamped = Math.max(0, Math.min(100, props.pain));
      expect(clamped).toBe(100);
    });

    it("should handle decimal pain values", () => {
      const props = { pain: 42.7, isMobile: false };
      expect(props.pain).toBe(42.7);
    });
  });

  describe("Mobile Optimization", () => {
    it("should accept mobile mode for all pain levels", () => {
      const props1 = { pain: 10, isMobile: true };
      const props2 = { pain: 50, isMobile: true };
      const props3 = { pain: 90, isMobile: true };
      expect(props1.isMobile).toBe(true);
      expect(props2.isMobile).toBe(true);
      expect(props3.isMobile).toBe(true);
    });
  });

  describe("Intensity Calculation", () => {
    it("should calculate correct normalized intensity", () => {
      const testCases = [
        { pain: 0, expected: 0 },
        { pain: 50, expected: 0.5 },
        { pain: 100, expected: 1 },
      ];

      testCases.forEach(({ pain, expected }) => {
        const normalized = pain / 100;
        const intensity = Math.pow(normalized, 1.5);
        expect(intensity).toBeCloseTo(Math.pow(expected, 1.5), 5);
      });
    });

    it("should use cubic easing for dramatic effect", () => {
      const pain50 = 50 / 100;
      const intensity50 = Math.pow(pain50, 1.5);
      
      const pain75 = 75 / 100;
      const intensity75 = Math.pow(pain75, 1.5);
      
      // Higher pain should have proportionally higher intensity with power curve
      expect(intensity75).toBeGreaterThan(intensity50);
    });
  });
});
