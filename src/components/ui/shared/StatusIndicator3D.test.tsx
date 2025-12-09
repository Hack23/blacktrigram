/**
 * Unit tests for StatusIndicator3D component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusIndicator3D } from "./StatusIndicator3D";

describe("StatusIndicator3D", () => {
  const defaultProps = {
    type: "ki" as const,
    labelKorean: "기력",
    labelEnglish: "Ki Energy",
    value: 75,
    maxValue: 100,
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<StatusIndicator3D {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render with default test ID", () => {
      render(<StatusIndicator3D {...defaultProps} />);
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();
    });

    it("should render with custom test ID", () => {
      render(<StatusIndicator3D {...defaultProps} testId="custom-status" />);
      expect(screen.getByTestId("custom-status")).toBeInTheDocument();
    });

    it("should display Korean label", () => {
      render(<StatusIndicator3D {...defaultProps} />);
      expect(screen.getByText("기력")).toBeInTheDocument();
    });

    it("should display English label", () => {
      render(<StatusIndicator3D {...defaultProps} />);
      expect(screen.getByText("Ki Energy")).toBeInTheDocument();
    });

    it("should display value with max value", () => {
      render(<StatusIndicator3D {...defaultProps} />);
      expect(screen.getByTestId("status-value-3d-ki")).toHaveTextContent(
        "75/100"
      );
    });

    it("should display value without max value", () => {
      render(
        <StatusIndicator3D
          {...defaultProps}
          value={42}
          maxValue={undefined}
        />
      );
      expect(screen.getByTestId("status-value-3d-ki")).toHaveTextContent("42");
    });

    it("should display string value", () => {
      render(<StatusIndicator3D {...defaultProps} value="Ready" />);
      expect(screen.getByTestId("status-value-3d-ki")).toHaveTextContent(
        "Ready"
      );
    });
  });

  describe("Status Types", () => {
    it("should render ki type with default icon", () => {
      render(<StatusIndicator3D {...defaultProps} type="ki" />);
      expect(screen.getByText("⚡")).toBeInTheDocument();
    });

    it("should render technique type with default icon", () => {
      render(<StatusIndicator3D {...defaultProps} type="technique" />);
      expect(screen.getByText("🥋")).toBeInTheDocument();
    });

    it("should render buff type with default icon", () => {
      render(<StatusIndicator3D {...defaultProps} type="buff" />);
      expect(screen.getByText("↑")).toBeInTheDocument();
    });

    it("should render debuff type with default icon", () => {
      render(<StatusIndicator3D {...defaultProps} type="debuff" />);
      expect(screen.getByText("↓")).toBeInTheDocument();
    });

    it("should render stance type with default icon", () => {
      render(<StatusIndicator3D {...defaultProps} type="stance" />);
      expect(screen.getByText("☯")).toBeInTheDocument();
    });

    it("should render custom type with default icon", () => {
      render(<StatusIndicator3D {...defaultProps} type="custom" />);
      expect(screen.getByText("●")).toBeInTheDocument();
    });

    it("should use custom icon when provided", () => {
      render(<StatusIndicator3D {...defaultProps} icon="💪" />);
      expect(screen.getByText("💪")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render player variant correctly", () => {
      render(<StatusIndicator3D {...defaultProps} variant="player" />);
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();
    });

    it("should render opponent variant correctly", () => {
      render(<StatusIndicator3D {...defaultProps} variant="opponent" />);
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();
    });

    it("should render training variant correctly", () => {
      render(<StatusIndicator3D {...defaultProps} variant="training" />);
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(
        <StatusIndicator3D {...defaultProps} isMobile={true} />
      );
      const indicator = container.querySelector(
        '[data-testid="status-indicator-3d-ki"]'
      );
      expect(indicator).toHaveStyle({ width: "40px" });
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(
        <StatusIndicator3D
          {...defaultProps}
          isMobile={false}
          screenWidth={1200}
        />
      );
      const indicator = container.querySelector(
        '[data-testid="status-indicator-3d-ki"]'
      );
      expect(indicator).toHaveStyle({ width: "60px" });
    });

    it("should adapt to screen width", () => {
      const { container } = render(
        <StatusIndicator3D {...defaultProps} screenWidth={800} />
      );
      const indicator = container.querySelector(
        '[data-testid="status-indicator-3d-ki"]'
      );
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("Custom Colors", () => {
    it("should use custom color when provided", () => {
      render(<StatusIndicator3D {...defaultProps} color={0xff0000} />);
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();
    });

    it("should use default color for ki type", () => {
      render(<StatusIndicator3D {...defaultProps} type="ki" />);
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();
    });

    it("should use default color for technique type", () => {
      render(<StatusIndicator3D {...defaultProps} type="technique" />);
      expect(screen.getByTestId("status-indicator-3d-technique")).toBeInTheDocument();
    });

    it("should use default color for buff type", () => {
      render(<StatusIndicator3D {...defaultProps} type="buff" />);
      expect(screen.getByTestId("status-indicator-3d-buff")).toBeInTheDocument();
    });

    it("should use default color for debuff type", () => {
      render(<StatusIndicator3D {...defaultProps} type="debuff" />);
      expect(screen.getByTestId("status-indicator-3d-debuff")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero value", () => {
      render(<StatusIndicator3D {...defaultProps} value={0} />);
      expect(screen.getByTestId("status-value-3d-ki")).toHaveTextContent(
        "0/100"
      );
    });

    it("should handle large values", () => {
      render(<StatusIndicator3D {...defaultProps} value={9999} maxValue={10000} />);
      expect(screen.getByTestId("status-value-3d-ki")).toHaveTextContent(
        "9999/10000"
      );
    });

    it("should handle fractional values", () => {
      render(<StatusIndicator3D {...defaultProps} value={75.7} />);
      expect(screen.getByTestId("status-value-3d-ki")).toHaveTextContent(
        "76/100"
      );
    });

    it("should handle empty string value", () => {
      render(<StatusIndicator3D {...defaultProps} value="" maxValue={undefined} />);
      const valueElement = screen.getByTestId("status-value-3d-ki");
      expect(valueElement.textContent?.trim()).toBe("");
    });

    it("should handle long label text", () => {
      render(
        <StatusIndicator3D
          {...defaultProps}
          labelKorean="매우 긴 한국어 레이블"
          labelEnglish="Very Long English Label"
        />
      );
      expect(screen.getByText("매우 긴 한국어 레이블")).toBeInTheDocument();
    });

    it("should handle special characters in labels", () => {
      render(
        <StatusIndicator3D
          {...defaultProps}
          labelKorean="특수!@#"
          labelEnglish="Special!@#"
        />
      );
      expect(screen.getByText("특수!@#")).toBeInTheDocument();
    });
  });

  describe("Multiple Status Types", () => {
    it("should render multiple indicators with different types", () => {
      const { rerender } = render(
        <StatusIndicator3D {...defaultProps} type="ki" />
      );
      expect(screen.getByTestId("status-indicator-3d-ki")).toBeInTheDocument();

      rerender(<StatusIndicator3D {...defaultProps} type="technique" />);
      expect(
        screen.getByTestId("status-indicator-3d-technique")
      ).toBeInTheDocument();

      rerender(<StatusIndicator3D {...defaultProps} type="buff" />);
      expect(screen.getByTestId("status-indicator-3d-buff")).toBeInTheDocument();
    });
  });
});
