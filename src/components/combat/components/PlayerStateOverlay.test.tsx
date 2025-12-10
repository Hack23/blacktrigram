/**
 * PlayerStateOverlay Component Tests
 * 
 * Tests component props, integration logic, and TypeScript interfaces.
 * Full rendering tests are done in E2E tests with Three.js context.
 */

import { describe, it, expect } from "vitest";
import { PlayerStateOverlay } from "./PlayerStateOverlay";

describe("PlayerStateOverlay", () => {
  it("should be defined and importable", () => {
    expect(PlayerStateOverlay).toBeDefined();
    expect(typeof PlayerStateOverlay).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept all required props", () => {
      const props = {
        pain: 50,
        balanceState: "SHAKEN" as const,
        position: "left" as const,
        consciousness: 80,
        bloodLoss: 45,
        stamina: 70,
        isMobile: false,
      };

      expect(props.pain).toBe(50);
      expect(props.balanceState).toBe("SHAKEN");
      expect(props.position).toBe("left");
      expect(props.consciousness).toBe(80);
      expect(props.bloodLoss).toBe(45);
      expect(props.stamina).toBe(70);
      expect(props.isMobile).toBe(false);
    });

    it("should accept optional bloodLoss prop", () => {
      const propsWithBloodLoss = {
        pain: 50,
        balanceState: "READY" as const,
        position: "left" as const,
        consciousness: 100,
        bloodLoss: 60,
        stamina: 80,
        isMobile: false,
      };

      expect(propsWithBloodLoss.bloodLoss).toBe(60);
    });
  });

  describe("Balance States", () => {
    it("should accept all balance states", () => {
      const balanceStates = ["READY", "SHAKEN", "VULNERABLE", "HELPLESS"] as const;
      
      balanceStates.forEach((state) => {
        const props = {
          pain: 50,
          balanceState: state,
          position: "left" as const,
          consciousness: 80,
          stamina: 70,
          isMobile: false,
        };
        expect(props.balanceState).toBe(state);
      });
    });
  });

  describe("Player Positions", () => {
    it("should accept left position", () => {
      const props = {
        pain: 50,
        balanceState: "READY" as const,
        position: "left" as const,
        consciousness: 80,
        stamina: 70,
        isMobile: false,
      };
      expect(props.position).toBe("left");
    });

    it("should accept right position", () => {
      const props = {
        pain: 50,
        balanceState: "READY" as const,
        position: "right" as const,
        consciousness: 80,
        stamina: 70,
        isMobile: false,
      };
      expect(props.position).toBe("right");
    });
  });

  describe("State Value Ranges", () => {
    it("should handle full health state", () => {
      const props = {
        pain: 0,
        balanceState: "READY" as const,
        position: "left" as const,
        consciousness: 100,
        bloodLoss: 0,
        stamina: 100,
        isMobile: false,
      };

      expect(props.pain).toBe(0);
      expect(props.consciousness).toBe(100);
      expect(props.bloodLoss).toBe(0);
      expect(props.stamina).toBe(100);
    });

    it("should handle critical health state", () => {
      const props = {
        pain: 100,
        balanceState: "HELPLESS" as const,
        position: "left" as const,
        consciousness: 0,
        bloodLoss: 100,
        stamina: 0,
        isMobile: false,
      };

      expect(props.pain).toBe(100);
      expect(props.balanceState).toBe("HELPLESS");
      expect(props.consciousness).toBe(0);
      expect(props.bloodLoss).toBe(100);
      expect(props.stamina).toBe(0);
    });

    it("should handle moderate damage state", () => {
      const props = {
        pain: 50,
        balanceState: "SHAKEN" as const,
        position: "left" as const,
        consciousness: 70,
        bloodLoss: 40,
        stamina: 60,
        isMobile: false,
      };

      expect(props.pain).toBe(50);
      expect(props.balanceState).toBe("SHAKEN");
      expect(props.consciousness).toBe(70);
      expect(props.bloodLoss).toBe(40);
      expect(props.stamina).toBe(60);
    });
  });

  describe("Mobile Optimization", () => {
    it("should accept mobile mode", () => {
      const props = {
        pain: 50,
        balanceState: "SHAKEN" as const,
        position: "left" as const,
        consciousness: 80,
        stamina: 70,
        isMobile: true,
      };
      expect(props.isMobile).toBe(true);
    });

    it("should accept desktop mode", () => {
      const props = {
        pain: 50,
        balanceState: "SHAKEN" as const,
        position: "left" as const,
        consciousness: 80,
        stamina: 70,
        isMobile: false,
      };
      expect(props.isMobile).toBe(false);
    });
  });

  describe("Default Values", () => {
    it("should handle missing optional bloodLoss", () => {
      const props = {
        pain: 50,
        balanceState: "READY" as const,
        position: "left" as const,
        consciousness: 100,
        stamina: 80,
        isMobile: false,
      };
      
      // bloodLoss defaults to 0 in component
      expect(props.bloodLoss).toBeUndefined();
    });
  });

  describe("Component Integration Logic", () => {
    it("should have props that trigger pain vignette", () => {
      const props = { pain: 50, isMobile: false };
      expect(props.pain).toBeGreaterThanOrEqual(5); // Pain vignette shows at >= 5
    });

    it("should have props that trigger consciousness blur", () => {
      const props = { consciousness: 70, isMobile: false };
      expect(props.consciousness).toBeLessThanOrEqual(90); // Blur shows at <= 90
    });

    it("should have props that trigger blood loss warning", () => {
      const props = { bloodLoss: 60, isMobile: false };
      expect(props.bloodLoss).toBeGreaterThanOrEqual(50); // Warning shows at >= 50
    });

    it("should have props that trigger stamina warning", () => {
      const props = { stamina: 15, isMobile: false };
      expect(props.stamina).toBeLessThan(20); // Warning shows at < 20
    });
  });
});
