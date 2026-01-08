/**
 * Tests for KoreanText component
 * Enhanced with actual rendering tests using @testing-library/react
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../../types/constants";
import { KoreanText } from "./KoreanText";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("KoreanText", () => {
  it("should be defined and importable", () => {
    expect(KoreanText).toBeDefined();
    expect(typeof KoreanText).toBe("function");
  });

  it("should have proper display name", () => {
    expect(KoreanText.displayName).toBe("KoreanText");
  });

  it("should render Korean and English text", () => {
    render(
      <KoreanText
        korean="공격"
        english="Attack"
      />
    );

    expect(screen.getByText("공격")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
  });

  it("should render with custom test ID", () => {
    render(
      <KoreanText
        korean="테스트"
        english="Test"
        testId="custom-text"
      />
    );

    expect(screen.getByTestId("custom-text")).toBeInTheDocument();
  });

  it("should render with default test ID when not provided", () => {
    render(
      <KoreanText
        korean="기본"
        english="Default"
      />
    );

    expect(screen.getByTestId("korean-text")).toBeInTheDocument();
  });

  it("should render with vertical layout by default", () => {
    const { container } = render(
      <KoreanText
        korean="세로"
        english="Vertical"
      />
    );

    const textContainer = container.querySelector('[data-testid="korean-text"]');
    expect(textContainer).toBeInTheDocument();
    expect(screen.getByText("Vertical")).toBeInTheDocument();
  });

  it("should render with horizontal layout when specified", () => {
    render(
      <KoreanText
        korean="가로"
        english="Horizontal"
        layout="horizontal"
      />
    );

    // In horizontal layout, English text should have " | " prefix
    expect(screen.getByText("| Horizontal")).toBeInTheDocument();
  });

  it("should render with vertical layout", () => {
    render(
      <KoreanText
        korean="세로"
        english="Vertical"
        layout="vertical"
      />
    );

    // In vertical layout, English text doesn't have " | " prefix
    expect(screen.getByText("Vertical")).toBeInTheDocument();
    expect(screen.queryByText("| Vertical")).not.toBeInTheDocument();
  });

  it("should support all text sizes", () => {
    const sizes: Array<"small" | "medium" | "large" | "xlarge"> = [
      "small",
      "medium",
      "large",
      "xlarge",
    ];

    sizes.forEach((size) => {
      const { unmount } = render(
        <KoreanText
          korean="크기"
          english="Size"
          size={size}
          testId={`text-${size}`}
        />
      );

      expect(screen.getByTestId(`text-${size}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should support all text alignments", () => {
    const alignments: Array<"left" | "center" | "right"> = [
      "left",
      "center",
      "right",
    ];

    alignments.forEach((align) => {
      const { unmount } = render(
        <KoreanText
          korean="정렬"
          english="Align"
          align={align}
          testId={`text-${align}`}
        />
      );

      expect(screen.getByTestId(`text-${align}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should support bold and normal weights", () => {
    const weights: Array<"normal" | "bold"> = ["normal", "bold"];

    weights.forEach((weight) => {
      const { unmount } = render(
        <KoreanText
          korean="굵기"
          english="Weight"
          weight={weight}
          testId={`text-${weight}`}
        />
      );

      expect(screen.getByTestId(`text-${weight}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should support custom colors", () => {
    const { unmount } = render(
      <KoreanText
        korean="색상"
        english="Color"
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
    );

    expect(screen.getByTestId("korean-text")).toBeInTheDocument();
    unmount();
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [5, 10, 15];
    render(
      <KoreanText
        korean="위치"
        english="Position"
        position={position}
      />
    );

    expect(screen.getByTestId("korean-text")).toBeInTheDocument();
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });

  it("should use Korean colors for theming", () => {
    const colors = [
      KOREAN_COLORS.TEXT_PRIMARY,
      KOREAN_COLORS.TEXT_SECONDARY,
      KOREAN_COLORS.ACCENT_GOLD,
      KOREAN_COLORS.PRIMARY_CYAN,
    ];

    colors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should render bilingual text for combat terms", () => {
    const combatTerms = [
      { korean: "공격", english: "Attack" },
      { korean: "방어", english: "Defend" },
      { korean: "회피", english: "Evade" },
      { korean: "반격", english: "Counter" },
    ];

    combatTerms.forEach(({ korean, english }) => {
      const { unmount } = render(
        <KoreanText
          korean={korean}
          english={english}
          testId={`combat-${korean}`}
        />
      );

      expect(screen.getByText(korean)).toBeInTheDocument();
      expect(screen.getByText(english)).toBeInTheDocument();
      unmount();
    });
  });
});
