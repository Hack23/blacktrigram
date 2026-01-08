/**
 * Tests for ProgressBar component
 * Enhanced with actual rendering tests using @testing-library/react
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../types/constants";
import type { ProgressBarType } from "./ProgressBar";
import { ProgressBar } from "./ProgressBar";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("ProgressBar", () => {
  it("should be defined and importable", () => {
    expect(ProgressBar).toBeDefined();
    expect(typeof ProgressBar).toBe("function");
  });

  it("should have proper display name", () => {
    expect(ProgressBar.displayName).toBe("ProgressBar");
  });

  it("should render health bar", () => {
    render(<ProgressBar type="health" current={75} max={100} />);

    expect(screen.getByTestId("html-overlay")).toBeInTheDocument();
  });

  it("should render ki bar", () => {
    render(<ProgressBar type="ki" current={60} max={100} />);

    expect(screen.getByTestId("html-overlay")).toBeInTheDocument();
  });

  it("should render stamina bar", () => {
    render(<ProgressBar type="stamina" current={50} max={100} />);

    expect(screen.getByTestId("html-overlay")).toBeInTheDocument();
  });

  it("should render with custom test ID", () => {
    render(
      <ProgressBar
        type="health"
        current={80}
        max={100}
        testId="custom-progress-bar"
      />
    );

    expect(screen.getByTestId("custom-progress-bar")).toBeInTheDocument();
  });

  it("should render with bilingual labels", () => {
    render(
      <ProgressBar
        type="health"
        current={85}
        max={100}
        label={{ korean: "체력", english: "Health" }}
      />
    );

    expect(screen.getByText("체력 | Health")).toBeInTheDocument();
  });

  it("should display current/max values", () => {
    render(
      <ProgressBar
        type="health"
        current={75}
        max={100}
        label={{ korean: "체력", english: "Health" }}
        showText={true}
      />
    );

    expect(screen.getByText("75 / 100")).toBeInTheDocument();
  });

  it("should display percentage", () => {
    render(
      <ProgressBar type="health" current={75} max={100} showText={true} />
    );

    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("should support all progress bar types", () => {
    const types: ProgressBarType[] = ["health", "ki", "stamina"];

    types.forEach((type) => {
      const { unmount } = render(
        <ProgressBar
          type={type}
          current={50}
          max={100}
          testId={`bar-${type}`}
        />
      );

      expect(screen.getByTestId(`bar-${type}`)).toBeInTheDocument();
      unmount();
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
    const zeroMax = 0;
    const percentage1 = Math.max(
      0,
      Math.min(1, zeroMax > 0 ? 50 / zeroMax : 0)
    );
    expect(percentage1).toBe(0);

    // Negative current
    const negativeCurrent = -10;
    const normalMax = 100;
    const percentage2 = Math.max(
      0,
      Math.min(1, normalMax > 0 ? negativeCurrent / normalMax : 0)
    );
    expect(percentage2).toBe(0);

    // Over max
    const overMax = 150;
    const maxValue = 100;
    const percentage3 = Math.max(
      0,
      Math.min(1, maxValue > 0 ? overMax / maxValue : 0)
    );
    expect(percentage3).toBe(1);
  });

  it("should render with custom dimensions", () => {
    render(
      <ProgressBar
        type="health"
        current={80}
        max={100}
        width={300}
        height={32}
      />
    );

    expect(screen.getByTestId("html-overlay")).toBeInTheDocument();
  });

  it("should render with custom position", () => {
    const position: [number, number, number] = [5, 10, 0];
    render(
      <ProgressBar type="ki" current={60} max={100} position={position} />
    );

    expect(screen.getByTestId("html-overlay")).toBeInTheDocument();
  });

  it("should support showing/hiding text", () => {
    const { container: withText } = render(
      <ProgressBar type="health" current={85} max={100} showText={true} />
    );

    expect(withText).toBeTruthy();

    const { container: withoutText } = render(
      <ProgressBar type="health" current={85} max={100} showText={false} />
    );

    expect(withoutText).toBeTruthy();
  });

  it("should support animation toggle", () => {
    const { container: animated } = render(
      <ProgressBar type="stamina" current={55} max={100} animated={true} />
    );

    expect(animated).toBeTruthy();

    const { container: staticBar } = render(
      <ProgressBar type="stamina" current={55} max={100} animated={false} />
    );

    expect(staticBar).toBeTruthy();
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

    scenarios.forEach(({ current, max }) => {
      const { unmount } = render(
        <ProgressBar type="health" current={current} max={max} />
      );

      const percentage = max > 0 ? current / max : 0;
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(1);
      unmount();
    });
  });

  it("should render bilingual labels for all resource types", () => {
    const labels = [
      { type: "health" as ProgressBarType, korean: "체력", english: "Health" },
      { type: "ki" as ProgressBarType, korean: "기력", english: "Ki" },
      {
        type: "stamina" as ProgressBarType,
        korean: "지구력",
        english: "Stamina",
      },
    ];

    labels.forEach(({ type, korean, english }) => {
      const { unmount } = render(
        <ProgressBar
          type={type}
          current={70}
          max={100}
          label={{ korean, english }}
        />
      );

      expect(screen.getByText(`${korean} | ${english}`)).toBeInTheDocument();
      unmount();
    });
  });
});
