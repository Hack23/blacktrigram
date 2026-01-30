/**
 * Tests for KoreanButton component
 * Enhanced with actual rendering tests using @testing-library/react
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../../types/constants";
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

  describe("Rendering", () => {
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
  });

  describe("Button Variants", () => {
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

    it("should render primary variant by default", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="기본"
          english="Default"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Button Sizes", () => {
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

    it("should render medium size by default", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="중간"
          english="Medium"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
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

    it("should support multiple clicks", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="다중 클릭"
          english="Multiple Clicks"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should have button role", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="접근성"
          english="Accessibility"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have proper aria-label when provided", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="공격"
          english="Attack"
          onClick={handleClick}
          ariaLabel="Attack enemy"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Attack enemy");
    });

    it("should have proper disabled attribute", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="비활성"
          english="Disabled"
          onClick={handleClick}
          disabled
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });

    it("should be keyboard navigable", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="탭"
          english="Tab"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button");
      button.focus();

      expect(document.activeElement).toBe(button);
    });
  });

  describe("Combat Actions", () => {
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

    it("should render stance buttons", () => {
      const stances = [
        { korean: "건", english: "Heaven" },
        { korean: "태", english: "Lake" },
        { korean: "리", english: "Fire" },
        { korean: "진", english: "Thunder" },
      ];

      stances.forEach(({ korean, english }) => {
        const handleClick = vi.fn();
        const { unmount } = render(
          <KoreanButton
            korean={korean}
            english={english}
            onClick={handleClick}
            testId={`stance-${korean}`}
          />
        );

        expect(screen.getByText(korean)).toBeInTheDocument();
        expect(screen.getByText(english)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Korean Theming", () => {
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

  describe("Edge Cases", () => {
    it("should handle empty Korean text", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean=""
          english="Empty Korean"
          onClick={handleClick}
        />
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle empty English text", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="빈 영어"
          english=""
          onClick={handleClick}
        />
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle both texts empty", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean=""
          english=""
          onClick={handleClick}
        />
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle very long Korean text", () => {
      const longKorean = "한글".repeat(100);
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean={longKorean}
          english="Long Korean"
          onClick={handleClick}
        />
      );

      expect(screen.getByText(longKorean)).toBeInTheDocument();
    });

    it("should handle very long English text", () => {
      const longEnglish = "A".repeat(500);
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="긴 영어"
          english={longEnglish}
          onClick={handleClick}
        />
      );

      expect(screen.getByText(longEnglish)).toBeInTheDocument();
    });

    it("should handle special characters in Korean", () => {
      const specialKorean = "공격! @#$% (필살기)";
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean={specialKorean}
          english="Special"
          onClick={handleClick}
        />
      );

      expect(screen.getByText(specialKorean)).toBeInTheDocument();
    });

    it("should handle special characters in English", () => {
      const specialEnglish = "Attack! @#$% <>&\"'";
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="특수"
          english={specialEnglish}
          onClick={handleClick}
        />
      );

      expect(screen.getByText(specialEnglish)).toBeInTheDocument();
    });

    it("should handle null onClick gracefully", () => {
      expect(() => {
        render(
          <KoreanButton
            korean="시작"
            english="Start"
            onClick={null as unknown as () => void}
          />
        );
      }).not.toThrow();
    });

    it("should handle undefined onClick gracefully", () => {
      expect(() => {
        render(
          <KoreanButton
            korean="시작"
            english="Start"
            onClick={undefined as unknown as () => void}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Component Integration", () => {
    it("should render with all props combined", () => {
      const handleClick = vi.fn();
      render(
        <KoreanButton
          korean="완전한"
          english="Complete"
          onClick={handleClick}
          variant="primary"
          size="lg"
          disabled={false}
          fullWidth={true}
          position={[1, 2, 3]}
          ariaLabel="Complete button"
          testId="full-button"
        />
      );

      expect(screen.getByTestId("full-button")).toBeInTheDocument();
      expect(screen.getByText("완전한")).toBeInTheDocument();
      expect(screen.getByText("Complete")).toBeInTheDocument();
    });

    it("should support dynamic prop updates", () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <KoreanButton
          korean="초기"
          english="Initial"
          onClick={handleClick}
          disabled={false}
        />
      );

      let button = screen.getByRole("button");
      expect(button).not.toBeDisabled();

      rerender(
        <KoreanButton
          korean="초기"
          english="Initial"
          onClick={handleClick}
          disabled={true}
        />
      );

      button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should support changing variant dynamically", () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <KoreanButton
          korean="변경"
          english="Change"
          onClick={handleClick}
          variant="primary"
          testId="dynamic-button"
        />
      );

      expect(screen.getByTestId("dynamic-button")).toBeInTheDocument();

      rerender(
        <KoreanButton
          korean="변경"
          english="Change"
          onClick={handleClick}
          variant="danger"
          testId="dynamic-button"
        />
      );

      expect(screen.getByTestId("dynamic-button")).toBeInTheDocument();
    });
  });
});

