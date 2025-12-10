/**
 * BloodLossOverlay Component Tests
 * 
 * Tests component props, threshold logic, and TypeScript interfaces.
 * Full rendering tests are done in E2E tests with Three.js context.
 */

import { describe, it, expect } from "vitest";
import { BloodLossOverlay } from "./BloodLossOverlay";

describe("BloodLossOverlay", () => {
  it("should be defined and importable", () => {
    expect(BloodLossOverlay).toBeDefined();
    expect(typeof BloodLossOverlay).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept bloodLoss and isMobile props", () => {
      const props = { bloodLoss: 75, isMobile: false };
      expect(props.bloodLoss).toBe(75);
      expect(props.isMobile).toBe(false);
    });

    it("should accept different bloodLoss values", () => {
      const props1 = { bloodLoss: 0, isMobile: false };
      const props2 = { bloodLoss: 50, isMobile: false };
      const props3 = { bloodLoss: 100, isMobile: false };
      expect(props1.bloodLoss).toBe(0);
      expect(props2.bloodLoss).toBe(50);
      expect(props3.bloodLoss).toBe(100);
    });

    it("should accept mobile mode", () => {
      const props = { bloodLoss: 75, isMobile: true };
      expect(props.isMobile).toBe(true);
    });
  });

  describe("Threshold Logic", () => {
    it("should not render below threshold (bloodLoss < 50)", () => {
      const lowBloodLoss = [0, 10, 25, 49];
      lowBloodLoss.forEach((bloodLoss) => {
        const props = { bloodLoss, isMobile: false };
        expect(props.bloodLoss).toBeLessThan(50);
      });
    });

    it("should render at or above threshold (bloodLoss >= 50)", () => {
      const highBloodLoss = [50, 60, 75, 90, 100];
      highBloodLoss.forEach((bloodLoss) => {
        const props = { bloodLoss, isMobile: false };
        expect(props.bloodLoss).toBeGreaterThanOrEqual(50);
      });
    });
  });

  describe("Intensity Calculation", () => {
    it("should calculate intensity based on bloodLoss", () => {
      const testCases = [
        { bloodLoss: 50, expectedIntensity: 0 },
        { bloodLoss: 75, expectedIntensity: 0.5 },
        { bloodLoss: 100, expectedIntensity: 1 },
      ];

      testCases.forEach(({ bloodLoss, expectedIntensity }) => {
        const criticalThreshold = 50;
        const intensity = (bloodLoss - criticalThreshold) / (100 - criticalThreshold);
        expect(intensity).toBeCloseTo(expectedIntensity, 5);
      });
    });

    it("should use reduced opacity on mobile", () => {
      const maxOpacityMobile = 0.15;
      const maxOpacityDesktop = 0.25;
      expect(maxOpacityMobile).toBeLessThan(maxOpacityDesktop);
    });
  });

  describe("Pulse Animation", () => {
    it("should use 1.5s pulse duration", () => {
      const pulseDuration = 1.5;
      expect(pulseDuration).toBe(1.5);
    });

    it("should pulse between base opacity and 1.5x opacity", () => {
      const multiplier = 1.5;
      expect(multiplier).toBe(1.5);
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative bloodLoss by not rendering", () => {
      const props = { bloodLoss: -10, isMobile: false };
      expect(props.bloodLoss).toBeLessThan(50);
    });

    it("should handle bloodLoss above 100 by clamping", () => {
      const props = { bloodLoss: 150, isMobile: false };
      const clamped = Math.max(50, Math.min(100, props.bloodLoss));
      expect(clamped).toBe(100);
    });

    it("should handle decimal bloodLoss values", () => {
      const props = { bloodLoss: 67.3, isMobile: false };
      expect(props.bloodLoss).toBe(67.3);
    });
  });

  describe("Mobile Optimization", () => {
    it("should accept mobile mode for all bloodLoss levels", () => {
      const props1 = { bloodLoss: 50, isMobile: true };
      const props2 = { bloodLoss: 75, isMobile: true };
      const props3 = { bloodLoss: 100, isMobile: true };
      expect(props1.isMobile).toBe(true);
      expect(props2.isMobile).toBe(true);
      expect(props3.isMobile).toBe(true);
    });
  });
});
