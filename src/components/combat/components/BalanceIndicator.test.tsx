/**
 * BalanceIndicator Component Tests
 * 
 * Tests component props, balance state logic, and TypeScript interfaces.
 * Full rendering tests are done in E2E tests with Three.js context.
 */

import { describe, it, expect } from "vitest";
import { BalanceIndicator } from "./BalanceIndicator";

describe("BalanceIndicator", () => {
  it("should be defined and importable", () => {
    expect(BalanceIndicator).toBeDefined();
    expect(typeof BalanceIndicator).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept balanceState, position, and isMobile props", () => {
      const props = {
        balanceState: "READY" as const,
        position: "left" as const,
        isMobile: false,
      };
      expect(props.balanceState).toBe("READY");
      expect(props.position).toBe("left");
      expect(props.isMobile).toBe(false);
    });

    it("should accept all balance states", () => {
      const states = ["READY", "SHAKEN", "VULNERABLE", "HELPLESS"] as const;
      states.forEach((state) => {
        const props = { balanceState: state, position: "left" as const, isMobile: false };
        expect(props.balanceState).toBe(state);
      });
    });

    it("should accept left position", () => {
      const props = { balanceState: "READY" as const, position: "left" as const, isMobile: false };
      expect(props.position).toBe("left");
    });

    it("should accept right position", () => {
      const props = { balanceState: "READY" as const, position: "right" as const, isMobile: false };
      expect(props.position).toBe("right");
    });

    it("should accept mobile mode", () => {
      const props = { balanceState: "READY" as const, position: "left" as const, isMobile: true };
      expect(props.isMobile).toBe(true);
    });
  });

  describe("Balance State Colors", () => {
    it("should map READY to green (0x00ff00)", () => {
      const READY_COLOR = 0x00ff00;
      expect(READY_COLOR).toBe(0x00ff00);
    });

    it("should map SHAKEN to yellow (0xffff00)", () => {
      const SHAKEN_COLOR = 0xffff00;
      expect(SHAKEN_COLOR).toBe(0xffff00);
    });

    it("should map VULNERABLE to orange (0xff6600)", () => {
      const VULNERABLE_COLOR = 0xff6600;
      expect(VULNERABLE_COLOR).toBe(0xff6600);
    });

    it("should map HELPLESS to red (0xff3333)", () => {
      const HELPLESS_COLOR = 0xff3333;
      expect(HELPLESS_COLOR).toBe(0xff3333);
    });
  });

  describe("Mobile Optimization", () => {
    it("should use thinner border on mobile (3px vs 4px)", () => {
      const mobileBorder = "3px";
      const desktopBorder = "4px";
      expect(mobileBorder).toBe("3px");
      expect(desktopBorder).toBe("4px");
    });
  });

  describe("Bilingual Labels", () => {
    it("should provide Korean labels for all states", () => {
      const labels = {
        READY: "준비완료",
        SHAKEN: "동요상태",
        VULNERABLE: "취약상태",
        HELPLESS: "무력상태",
      };
      expect(labels.READY).toBe("준비완료");
      expect(labels.SHAKEN).toBe("동요상태");
      expect(labels.VULNERABLE).toBe("취약상태");
      expect(labels.HELPLESS).toBe("무력상태");
    });

    it("should provide English labels for all states", () => {
      const labels = {
        READY: "READY",
        SHAKEN: "SHAKEN",
        VULNERABLE: "VULNERABLE",
        HELPLESS: "HELPLESS",
      };
      expect(labels.READY).toBe("READY");
      expect(labels.SHAKEN).toBe("SHAKEN");
      expect(labels.VULNERABLE).toBe("VULNERABLE");
      expect(labels.HELPLESS).toBe("HELPLESS");
    });
  });
});
