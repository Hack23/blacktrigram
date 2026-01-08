/**
 * Tests for KoreanButton component
 * Enhanced with actual rendering tests using @testing-library/react
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../types/constants";
import { KoreanButton } from "./KoreanButton";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("KoreanButton", () => {
  it("should be defined and importable", () => {
    expect(KoreanButton).toBeDefined();
    expect(typeof KoreanButton).toBe("function");
  });

  it("should have proper display name", () => {
    expect(KoreanButton.displayName).toBe("KoreanButton");
  });

  it("should render Korean and English text", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="공격"
        english="Attack"
        onClick={handleClick}
      />
    );

    expect(screen.getByText("공격")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="클릭"
        english="Click"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="비활성"
        english="Disabled"
        onClick={handleClick}
        disabled={true}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render with custom test ID", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="테스트"
        english="Test"
        onClick={handleClick}
        testId="custom-button"
      />
    );

    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
  });

  it("should render with default test ID when not provided", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="기본"
        english="Default"
        onClick={handleClick}
      />
    );

    expect(screen.getByTestId("korean-button")).toBeInTheDocument();
  });

  it("should support all button variants", () => {
    const variants: Array<"primary" | "secondary" | "danger"> = [
      "primary",
      "secondary",
      "danger",
    ];

    variants.forEach((variant) => {
      const handleClick = vi.fn();
      const { unmount } = render(
        <KoreanButton
          korean="테스트"
          english="Test"
          onClick={handleClick}
          variant={variant}
          testId={`button-${variant}`}
        />
      );

      expect(screen.getByTestId(`button-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should support all button sizes", () => {
    const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const handleClick = vi.fn();
      const { unmount } = render(
        <KoreanButton
          korean="크기"
          english="Size"
          onClick={handleClick}
          size={size}
          testId={`button-${size}`}
        />
      );

      expect(screen.getByTestId(`button-${size}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should render disabled button", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="비활성"
        english="Disabled"
        onClick={handleClick}
        disabled={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should render enabled button by default", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="활성"
        english="Enabled"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("should support full width option", () => {
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="전체 너비"
        english="Full Width"
        onClick={handleClick}
        fullWidth={true}
        testId="fullwidth-button"
      />
    );

    expect(screen.getByTestId("fullwidth-button")).toBeInTheDocument();
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [10, 20, 30];
    const handleClick = vi.fn();
    render(
      <KoreanButton
        korean="위치"
        english="Position"
        onClick={handleClick}
        position={position}
      />
    );

    expect(screen.getByTestId("korean-button")).toBeInTheDocument();
  });

  it("should render combat action buttons", () => {
    const combatActions = [
      { korean: "공격", english: "Attack" },
      { korean: "방어", english: "Defend" },
      { korean: "회피", english: "Evade" },
      { korean: "반격", english: "Counter" },
    ];

    combatActions.forEach(({ korean, english }) => {
      const handleClick = vi.fn();
      const { unmount } = render(
        <KoreanButton
          korean={korean}
          english={english}
          onClick={handleClick}
          testId={`action-${korean}`}
        />
      );

      expect(screen.getByText(korean)).toBeInTheDocument();
      expect(screen.getByText(english)).toBeInTheDocument();
      unmount();
    });
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });

  it("should use Korean colors for theming", () => {
    const colors = [
      KOREAN_COLORS.PRIMARY_CYAN,
      KOREAN_COLORS.ACCENT_GOLD,
      KOREAN_COLORS.ACCENT_RED,
      KOREAN_COLORS.UI_BACKGROUND_DARK,
    ];

    colors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });
});
