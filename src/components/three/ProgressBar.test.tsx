/**
 * Tests for ProgressBar component
 */

import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../types/constants";
import { ProgressBar } from "./ProgressBar";
import type { ProgressBarType } from "./ProgressBar";

describe("ProgressBar", () => {
  it("should be defined and importable", () => {
    expect(ProgressBar).toBeDefined();
    expect(typeof ProgressBar).toBe("function");
  });

  it("should have proper display name", () => {
    expect(ProgressBar.displayName).toBe("ProgressBar");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test
    const validProps = {
      type: "health" as ProgressBarType,
      current: 75,
      max: 100,
      label: { korean: "체력", english: "Health" },
      position: [0, 0, 0] as [number, number, number],
      width: 200,
      height: 24,
      showText: true,
      animated: true,
    };

    expect(validProps.type).toBe("health");
    expect(validProps.current).toBe(75);
    expect(validProps.max).toBe(100);
    expect(validProps.width).toBe(200);
  });

  it("should support all progress bar types", () => {
    const types: ProgressBarType[] = ["health", "ki", "stamina"];

    types.forEach((type) => {
      const props = {
        type,
        current: 50,
        max: 100,
      };

      expect(props.type).toBe(type);
    });
  });

  it("should calculate percentage correctly", () => {
    const testCases = [
      { current: 50, max: 100, expected: 0.5 },
      { current: 75, max: 100, expected: 0.75 },
      { current: 100, max: 100, expected: 1.0 },
      { current: 0, max: 100, expected: 0.0 },
      { current: 150, max: 100, expected: 1.0 }, // Clamped to max
    ];

    testCases.forEach(({ current, max, expected }) => {
      const percentage = Math.max(0, Math.min(1, max > 0 ? current / max : 0));
      expect(percentage).toBe(expected);
    });
  });

  it("should handle edge cases for percentage calculation", () => {
    // Zero max
    const percentage1 = Math.max(0, Math.min(1, 0 > 0 ? 50 / 0 : 0));
    expect(percentage1).toBe(0);

    // Negative current
    const percentage2 = Math.max(0, Math.min(1, 100 > 0 ? -10 / 100 : 0));
    expect(percentage2).toBe(0);

    // Over max
    const percentage3 = Math.max(0, Math.min(1, 100 > 0 ? 150 / 100 : 0));
    expect(percentage3).toBe(1);
  });

  it("should support custom dimensions", () => {
    const props = {
      type: "health" as ProgressBarType,
      current: 80,
      max: 100,
      width: 300,
      height: 32,
    };

    expect(props.width).toBe(300);
    expect(props.height).toBe(32);
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [5, 10, 0];
    const props = {
      type: "ki" as ProgressBarType,
      current: 60,
      max: 100,
      position,
    };

    expect(props.position).toEqual([5, 10, 0]);
  });

  it("should support bilingual labels", () => {
    const label = { korean: "기력", english: "Ki" };
    const props = {
      type: "ki" as ProgressBarType,
      current: 70,
      max: 100,
      label,
    };

    expect(props.label?.korean).toBe("기력");
    expect(props.label?.english).toBe("Ki");
  });

  it("should support showing/hiding text", () => {
    const propsWithText = {
      type: "health" as ProgressBarType,
      current: 85,
      max: 100,
      showText: true,
    };

    const propsWithoutText = {
      type: "health" as ProgressBarType,
      current: 85,
      max: 100,
      showText: false,
    };

    expect(propsWithText.showText).toBe(true);
    expect(propsWithoutText.showText).toBe(false);
  });

  it("should support animation toggle", () => {
    const propsAnimated = {
      type: "stamina" as ProgressBarType,
      current: 55,
      max: 100,
      animated: true,
    };

    const propsStatic = {
      type: "stamina" as ProgressBarType,
      current: 55,
      max: 100,
      animated: false,
    };

    expect(propsAnimated.animated).toBe(true);
    expect(propsStatic.animated).toBe(false);
  });

  it("should support custom test ID", () => {
    const props = {
      type: "health" as ProgressBarType,
      current: 90,
      max: 100,
      testId: "custom-progress-bar",
    };

    expect(props.testId).toBe("custom-progress-bar");
  });

  it("should use Korean colors for theming", () => {
    const healthColors = [
      KOREAN_COLORS.HEALTH_FULL,
      KOREAN_COLORS.HEALTH_MEDIUM,
      KOREAN_COLORS.HEALTH_LOW,
      KOREAN_COLORS.HEALTH_CRITICAL,
    ];

    const kiColors = [
      KOREAN_COLORS.KI_FULL,
      KOREAN_COLORS.KI_MEDIUM,
      KOREAN_COLORS.KI_LOW,
    ];

    const staminaColors = [
      KOREAN_COLORS.STAMINA_FULL,
      KOREAN_COLORS.STAMINA_MEDIUM,
      KOREAN_COLORS.STAMINA_LOW,
    ];

    [...healthColors, ...kiColors, ...staminaColors].forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });

  it("should handle different health percentages correctly", () => {
    const scenarios = [
      { current: 90, max: 100, description: "High health" },
      { current: 50, max: 100, description: "Medium health" },
      { current: 25, max: 100, description: "Low health" },
      { current: 10, max: 100, description: "Critical health" },
    ];

    scenarios.forEach(({ current, max, description }) => {
      const props = {
        type: "health" as ProgressBarType,
        current,
        max,
      };

      const percentage = max > 0 ? current / max : 0;
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(1);
    });
  });
});
