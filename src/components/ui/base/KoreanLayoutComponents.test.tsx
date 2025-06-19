import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderWithPixi } from "../../../test/test-utils";
import {
  KoreanButton,
  ResponsiveContainer,
  KoreanPanel,
  KoreanProgressBar,
} from "./KoreanLayoutComponents";

describe("KoreanLayoutComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("KoreanButton", () => {
    const defaultProps = {
      text: { korean: "확인", english: "Confirm" },
      onClick: vi.fn(),
    };

    it("should render Korean button with bilingual text", () => {
      renderWithPixi(<KoreanButton {...defaultProps} />);

      expect(screen.getByTestId("korean-button")).toBeTruthy();
    });

    it("should handle click events when not disabled", () => {
      const mockOnClick = vi.fn();
      renderWithPixi(<KoreanButton {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByTestId("korean-button");
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not trigger click when disabled", () => {
      const mockOnClick = vi.fn();
      renderWithPixi(
        <KoreanButton {...defaultProps} onClick={mockOnClick} disabled={true} />
      );

      const button = screen.getByTestId("korean-button");
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("should render different variants correctly", () => {
      const variants = ["primary", "secondary", "combat", "stance"] as const;

      variants.forEach((variant) => {
        renderWithPixi(
          <KoreanButton
            {...defaultProps}
            variant={variant}
            data-testid={`button-${variant}`}
          />
        );

        expect(screen.getByTestId(`button-${variant}`)).toBeTruthy();
      });
    });

    it("should support custom dimensions", () => {
      renderWithPixi(
        <KoreanButton
          {...defaultProps}
          width={200}
          height={60}
          data-testid="custom-button"
        />
      );

      expect(screen.getByTestId("custom-button")).toBeTruthy();
    });
  });

  describe("ResponsiveContainer", () => {
    it("should render responsive container with children", () => {
      renderWithPixi(
        <ResponsiveContainer data-testid="responsive-container">
          <div>Test Content</div>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("responsive-container")).toBeTruthy();
    });

    it("should support flexible layout properties", () => {
      renderWithPixi(
        <ResponsiveContainer
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={20}
          data-testid="flex-container"
        >
          <div>Item 1</div>
          <div>Item 2</div>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("flex-container")).toBeTruthy();
    });

    it("should handle percentage-based dimensions", () => {
      renderWithPixi(
        <ResponsiveContainer
          width="100%"
          height="50%"
          data-testid="percentage-container"
        >
          <div>Responsive Content</div>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("percentage-container")).toBeTruthy();
    });

    it("should support complex padding configurations", () => {
      renderWithPixi(
        <ResponsiveContainer
          padding={{ top: 10, right: 20, bottom: 10, left: 20 }}
          data-testid="padded-container"
        >
          <div>Padded Content</div>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("padded-container")).toBeTruthy();
    });
  });

  describe("KoreanPanel", () => {
    const defaultProps = {
      title: { korean: "제목", english: "Title" },
      children: <div>Panel Content</div>,
    };

    it("should render Korean panel with title", () => {
      renderWithPixi(<KoreanPanel {...defaultProps} />);

      expect(screen.getByTestId("korean-panel")).toBeTruthy();
    });

    it("should render without header when showHeader is false", () => {
      renderWithPixi(
        <KoreanPanel
          {...defaultProps}
          showHeader={false}
          data-testid="no-header-panel"
        />
      );

      expect(screen.getByTestId("no-header-panel")).toBeTruthy();
    });

    it("should render without border when showBorder is false", () => {
      renderWithPixi(
        <KoreanPanel
          {...defaultProps}
          showBorder={false}
          data-testid="no-border-panel"
        />
      );

      expect(screen.getByTestId("no-border-panel")).toBeTruthy();
    });

    it("should support different variants", () => {
      const variants = ["dark", "light", "accent"] as const;

      variants.forEach((variant) => {
        renderWithPixi(
          <KoreanPanel
            {...defaultProps}
            variant={variant}
            data-testid={`panel-${variant}`}
          />
        );

        expect(screen.getByTestId(`panel-${variant}`)).toBeTruthy();
      });
    });

    it("should handle custom dimensions", () => {
      renderWithPixi(
        <KoreanPanel
          {...defaultProps}
          width={400}
          height={300}
          data-testid="custom-panel"
        />
      );

      expect(screen.getByTestId("custom-panel")).toBeTruthy();
    });
  });

  describe("KoreanProgressBar", () => {
    const defaultProps = {
      label: { korean: "체력", english: "Health" },
      current: 75,
      max: 100,
    };

    it("should render progress bar with correct percentage", () => {
      renderWithPixi(<KoreanProgressBar {...defaultProps} />);

      expect(screen.getByTestId("korean-progress-bar")).toBeTruthy();
    });

    it("should handle zero progress", () => {
      renderWithPixi(
        <KoreanProgressBar
          {...defaultProps}
          current={0}
          data-testid="zero-progress"
        />
      );

      expect(screen.getByTestId("zero-progress")).toBeTruthy();
    });

    it("should handle full progress", () => {
      renderWithPixi(
        <KoreanProgressBar
          {...defaultProps}
          current={100}
          data-testid="full-progress"
        />
      );

      expect(screen.getByTestId("full-progress")).toBeTruthy();
    });

    it("should handle values exceeding maximum", () => {
      renderWithPixi(
        <KoreanProgressBar
          {...defaultProps}
          current={150}
          data-testid="over-max-progress"
        />
      );

      expect(screen.getByTestId("over-max-progress")).toBeTruthy();
    });

    it("should render without text when showText is false", () => {
      renderWithPixi(
        <KoreanProgressBar
          {...defaultProps}
          showText={false}
          data-testid="no-text-progress"
        />
      );

      expect(screen.getByTestId("no-text-progress")).toBeTruthy();
    });

    it("should use custom colors correctly", () => {
      renderWithPixi(
        <KoreanProgressBar
          {...defaultProps}
          color={0xff0000}
          data-testid="custom-color-progress"
        />
      );

      expect(screen.getByTestId("custom-color-progress")).toBeTruthy();
    });

    it("should change color based on percentage for health bars", () => {
      const lowHealth = {
        ...defaultProps,
        current: 15,
        "data-testid": "low-health",
      };

      const mediumHealth = {
        ...defaultProps,
        current: 45,
        "data-testid": "medium-health",
      };

      const highHealth = {
        ...defaultProps,
        current: 85,
        "data-testid": "high-health",
      };

      renderWithPixi(<KoreanProgressBar {...lowHealth} />);
      renderWithPixi(<KoreanProgressBar {...mediumHealth} />);
      renderWithPixi(<KoreanProgressBar {...highHealth} />);

      expect(screen.getByTestId("low-health")).toBeTruthy();
      expect(screen.getByTestId("medium-health")).toBeTruthy();
      expect(screen.getByTestId("high-health")).toBeTruthy();
    });
  });

  describe("Layout Integration", () => {
    it("should work together in complex layouts", () => {
      renderWithPixi(
        <ResponsiveContainer
          flexDirection="column"
          gap={15}
          data-testid="complex-layout"
        >
          <KoreanPanel
            title={{ korean: "전투 패널", english: "Combat Panel" }}
            variant="accent"
          >
            <KoreanProgressBar
              label={{ korean: "체력", english: "Health" }}
              current={80}
              max={100}
            />

            <KoreanProgressBar
              label={{ korean: "기력", english: "Ki" }}
              current={60}
              max={100}
            />
          </KoreanPanel>

          <ResponsiveContainer flexDirection="row" gap={10}>
            <KoreanButton
              text={{ korean: "공격", english: "Attack" }}
              onClick={() => {}}
              variant="combat"
            />

            <KoreanButton
              text={{ korean: "방어", english: "Defend" }}
              onClick={() => {}}
              variant="stance"
            />
          </ResponsiveContainer>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("complex-layout")).toBeTruthy();
    });

    it("should maintain responsive behavior in nested layouts", () => {
      renderWithPixi(
        <ResponsiveContainer
          width="100%"
          flexDirection="row"
          data-testid="nested-responsive"
        >
          <ResponsiveContainer width="50%" flexDirection="column">
            <KoreanButton
              text={{ korean: "왼쪽", english: "Left" }}
              onClick={() => {}}
            />
          </ResponsiveContainer>

          <ResponsiveContainer width="50%" flexDirection="column">
            <KoreanButton
              text={{ korean: "오른쪽", english: "Right" }}
              onClick={() => {}}
            />
          </ResponsiveContainer>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("nested-responsive")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing text props gracefully", () => {
      expect(() => {
        renderWithPixi(
          <KoreanButton
            text={{ korean: "", english: "" }}
            onClick={() => {}}
            data-testid="empty-text-button"
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId("empty-text-button")).toBeTruthy();
    });

    it("should handle negative progress values", () => {
      renderWithPixi(
        <KoreanProgressBar
          label={{ korean: "음수", english: "Negative" }}
          current={-10}
          max={100}
          data-testid="negative-progress"
        />
      );

      expect(screen.getByTestId("negative-progress")).toBeTruthy();
    });

    it("should handle zero maximum values", () => {
      renderWithPixi(
        <KoreanProgressBar
          label={{ korean: "0 최대", english: "Zero Max" }}
          current={50}
          max={0}
          data-testid="zero-max-progress"
        />
      );

      expect(screen.getByTestId("zero-max-progress")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should provide proper test IDs for all interactive elements", () => {
      renderWithPixi(
        <ResponsiveContainer data-testid="accessibility-test">
          <KoreanButton
            text={{ korean: "테스트", english: "Test" }}
            onClick={() => {}}
            data-testid="accessible-button"
          />

          <KoreanPanel
            title={{ korean: "패널", english: "Panel" }}
            data-testid="accessible-panel"
          >
            <KoreanProgressBar
              label={{ korean: "진행률", english: "Progress" }}
              current={50}
              max={100}
              data-testid="accessible-progress"
            />
          </KoreanPanel>
        </ResponsiveContainer>
      );

      expect(screen.getByTestId("accessibility-test")).toBeTruthy();
      expect(screen.getByTestId("accessible-button")).toBeTruthy();
      expect(screen.getByTestId("accessible-panel")).toBeTruthy();
      expect(screen.getByTestId("accessible-progress")).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should render components efficiently", () => {
      const startTime = performance.now();

      renderWithPixi(
        <ResponsiveContainer data-testid="performance-test">
          {Array.from({ length: 10 }, (_, i) => (
            <KoreanButton
              key={i}
              text={{ korean: `버튼 ${i}`, english: `Button ${i}` }}
              onClick={() => {}}
            />
          ))}
        </ResponsiveContainer>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100); // Should render quickly
      expect(screen.getByTestId("performance-test")).toBeTruthy();
    });
  });
});
