/**
 * Tests for KoreanButton component
 * Tests the wrapper's delegation to BaseButton and default testId behavior
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KoreanButton } from "./KoreanButton";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("KoreanButton", () => {
  describe("Component Definition", () => {
    it("should be defined and importable", () => {
      expect(KoreanButton).toBeDefined();
      expect(typeof KoreanButton).toBe("function");
    });

    it("should have proper display name", () => {
      expect(KoreanButton.displayName).toBe("KoreanButton");
    });
  });

  describe("Wrapper Behavior", () => {
    it("should delegate to BaseButton with default testId", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="공격"
          english="Attack"
          onClick={handleClick}
        />
      );

      // Verify default testId is applied
      expect(screen.getByTestId("korean-button")).toBeInTheDocument();
      
      // Verify BaseButton functionality works
      expect(screen.getByText("공격")).toBeInTheDocument();
      expect(screen.getByText("Attack")).toBeInTheDocument();
    });

    it("should use custom testId when provided", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="방어"
          english="Defend"
          onClick={handleClick}
          testId="custom-button"
        />
      );

      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
      expect(screen.queryByTestId("korean-button")).not.toBeInTheDocument();
    });

    it("should pass all props through to BaseButton", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="테스트"
          english="Test"
          onClick={handleClick}
          variant="danger"
          size="lg"
          disabled={false}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it("should handle onClick events via BaseButton", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="클릭"
          english="Click"
          onClick={handleClick}
        />
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should support disabled state via BaseButton", () => {
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
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Korean Theming Compatibility", () => {
    it("should render bilingual text through BaseButton", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="한글"
          english="English"
          onClick={handleClick}
        />
      );

      expect(screen.getByText("한글")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("should work with all BaseButton variants", () => {
      const variants: Array<"primary" | "secondary" | "danger"> = [
        "primary",
        "secondary",
        "danger",
      ];

      variants.forEach((variant) => {
        const handleClick = vi.fn();
        const { unmount } = render(
          <KoreanButton
            korean="변형"
            english="Variant"
            onClick={handleClick}
            variant={variant}
            testId={`button-${variant}`}
          />
        );

        expect(screen.getByTestId(`button-${variant}`)).toBeInTheDocument();
        unmount();
      });
    });
  });
});

