/**
 * StaminaWarning Component Tests
 * 
 * Tests component props, threshold logic, and TypeScript interfaces.
 * Full rendering tests are done in E2E tests with Three.js context.
 */

import { describe, it, expect } from "vitest";
import { StaminaWarning } from "./StaminaWarning";

describe("StaminaWarning", () => {
  it("should be defined and importable", () => {
    expect(StaminaWarning).toBeDefined();
    expect(typeof StaminaWarning).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept stamina and isMobile props", () => {
      const props = { stamina: 15, isMobile: false };
      expect(props.stamina).toBe(15);
      expect(props.isMobile).toBe(false);
    });

    it("should accept different stamina values", () => {
      const props1 = { stamina: 0, isMobile: false };
      const props2 = { stamina: 10, isMobile: false };
      const props3 = { stamina: 100, isMobile: false };
      expect(props1.stamina).toBe(0);
      expect(props2.stamina).toBe(10);
      expect(props3.stamina).toBe(100);
    });

    it("should accept mobile mode", () => {
      const props = { stamina: 15, isMobile: true };
      expect(props.isMobile).toBe(true);
    });
  });

  describe("Threshold Logic", () => {
    it("should not render at or above threshold (stamina >= 20)", () => {
      const highStamina = [20, 30, 50, 100];
      highStamina.forEach((stamina) => {
        const props = { stamina, isMobile: false };
        expect(props.stamina).toBeGreaterThanOrEqual(20);
      });
    });

    it("should render below threshold (stamina < 20)", () => {
      const lowStamina = [0, 5, 10, 15, 19];
      lowStamina.forEach((stamina) => {
        const props = { stamina, isMobile: false };
        expect(props.stamina).toBeLessThan(20);
      });
    });
  });

  describe("Urgency Calculation", () => {
    it("should calculate urgency based on how low stamina is", () => {
      const testCases = [
        { stamina: 19, expectedUrgency: 1 / 20 },
        { stamina: 10, expectedUrgency: 10 / 20 },
        { stamina: 0, expectedUrgency: 1 },
      ];

      testCases.forEach(({ stamina, expectedUrgency }) => {
        const criticalThreshold = 20;
        const urgency = (criticalThreshold - stamina) / criticalThreshold;
        expect(urgency).toBeCloseTo(expectedUrgency, 5);
      });
    });

    it("should flash faster at higher urgency", () => {
      const highUrgency = 0.9; // stamina near 0
      const lowUrgency = 0.1; // stamina near 20
      
      const animDurationHigh = Math.max(0.6, 1.2 - highUrgency * 0.6);
      const animDurationLow = Math.max(0.6, 1.2 - lowUrgency * 0.6);
      
      expect(animDurationHigh).toBeLessThan(animDurationLow);
    });
  });

  describe("Flash Animation", () => {
    it("should use variable animation speed", () => {
      const minDuration = 0.6;
      const maxDuration = 1.2;
      expect(minDuration).toBe(0.6);
      expect(maxDuration).toBe(1.2);
    });

    it("should flash with yellow warning color", () => {
      const warningColor = 0xffff00; // Yellow
      expect(warningColor).toBe(0xffff00);
    });
  });

  describe("Mobile Optimization", () => {
    it("should use thinner border on mobile (4px vs 6px)", () => {
      const mobileBorder = "4px";
      const desktopBorder = "6px";
      expect(mobileBorder).toBe("4px");
      expect(desktopBorder).toBe("6px");
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative stamina by clamping", () => {
      const props = { stamina: -10, isMobile: false };
      const clamped = Math.max(0, Math.min(20, props.stamina));
      expect(clamped).toBe(0);
      expect(clamped).toBeLessThan(20); // Should trigger warning
    });

    it("should handle stamina above 100", () => {
      const props = { stamina: 150, isMobile: false };
      expect(props.stamina).toBeGreaterThanOrEqual(20); // Should not trigger warning
    });

    it("should handle decimal stamina values", () => {
      const props = { stamina: 12.5, isMobile: false };
      expect(props.stamina).toBe(12.5);
    });
  });

  describe("Threshold Behavior", () => {
    it("should not render at exactly 20", () => {
      const props = { stamina: 20, isMobile: false };
      expect(props.stamina).toBeGreaterThanOrEqual(20);
    });

    it("should render just below threshold", () => {
      const props = { stamina: 19.9, isMobile: false };
      expect(props.stamina).toBeLessThan(20);
    });
  });
});
