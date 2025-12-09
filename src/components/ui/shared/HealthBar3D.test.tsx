/**
 * Unit tests for HealthBar3D component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthBar3D } from "./HealthBar3D";

describe("HealthBar3D", () => {
  const defaultProps = {
    current: 85,
    max: 100,
    playerId: "player1",
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<HealthBar3D {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render with correct test ID", () => {
      render(<HealthBar3D {...defaultProps} />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render 10 health segments", () => {
      render(<HealthBar3D {...defaultProps} />);
      for (let i = 0; i < 10; i++) {
        expect(
          screen.getByTestId(`health-segment-3d-player1-${i}`)
        ).toBeInTheDocument();
      }
    });

    it("should display Korean and English labels by default", () => {
      render(<HealthBar3D {...defaultProps} />);
      expect(screen.getByText(/체력 \| Health/)).toBeInTheDocument();
    });

    it("should display current and max health values", () => {
      render(<HealthBar3D {...defaultProps} />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "85/100"
      );
    });

    it("should hide text when showText is false", () => {
      render(<HealthBar3D {...defaultProps} showText={false} />);
      expect(screen.queryByText(/체력 \| Health/)).not.toBeInTheDocument();
    });
  });

  describe("Health Percentage Calculation", () => {
    it("should calculate full health correctly", () => {
      render(<HealthBar3D current={100} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "100/100"
      );
    });

    it("should calculate medium health correctly", () => {
      render(<HealthBar3D current={50} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "50/100"
      );
    });

    it("should calculate low health correctly", () => {
      render(<HealthBar3D current={15} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "15/100"
      );
    });

    it("should handle zero health", () => {
      render(<HealthBar3D current={0} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "0/100"
      );
    });

    it("should clamp health above max", () => {
      render(<HealthBar3D current={150} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "150/100"
      );
    });

    it("should clamp health below zero", () => {
      render(<HealthBar3D current={-10} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "0/100"
      );
    });
  });

  describe("Variants", () => {
    it("should render player variant correctly", () => {
      render(<HealthBar3D {...defaultProps} variant="player" />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render opponent variant correctly", () => {
      render(<HealthBar3D {...defaultProps} variant="opponent" />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render training variant correctly", () => {
      render(<HealthBar3D {...defaultProps} variant="training" />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(
        <HealthBar3D {...defaultProps} isMobile={true} />
      );
      const healthBar = container.querySelector(
        '[data-testid="health-bar-3d-player1"]'
      );
      expect(healthBar).toHaveStyle({ width: "180px" });
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(
        <HealthBar3D {...defaultProps} isMobile={false} screenWidth={1200} />
      );
      const healthBar = container.querySelector(
        '[data-testid="health-bar-3d-player1"]'
      );
      expect(healthBar).toHaveStyle({ width: "250px" });
    });

    it("should adapt to screen width", () => {
      const { container } = render(
        <HealthBar3D {...defaultProps} screenWidth={800} />
      );
      const healthBar = container.querySelector(
        '[data-testid="health-bar-3d-player1"]'
      );
      expect(healthBar).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have progressbar role", () => {
      render(<HealthBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeInTheDocument();
    });

    it("should have correct aria-label", () => {
      render(<HealthBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-label", "체력 | Health");
    });

    it("should have correct aria-valuenow", () => {
      render(<HealthBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "85");
    });

    it("should have correct aria-valuemin", () => {
      render(<HealthBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    });

    it("should have correct aria-valuemax", () => {
      render(<HealthBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    });

    it("should have correct aria-valuetext", () => {
      render(<HealthBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute(
        "aria-valuetext",
        "85 out of 100"
      );
    });
  });

  describe("Visual States", () => {
    it("should render full health with green color", () => {
      render(<HealthBar3D current={90} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render medium health with yellow color", () => {
      render(<HealthBar3D current={40} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render low health with red color", () => {
      render(<HealthBar3D current={20} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-bar-3d-player1")).toBeInTheDocument();
    });

    it("should add pulse animation when health is below 20%", () => {
      const { container } = render(
        <HealthBar3D current={15} max={100} playerId="player1" />
      );
      const healthBar = container.querySelector(
        '[data-testid="health-bar-3d-player1"]'
      );
      const segmentsContainer = healthBar?.querySelector("div:last-of-type");
      const animationStyle = segmentsContainer?.getAttribute("style");
      expect(animationStyle).toContain("healthPulse");
    });

    it("should not add pulse animation when health is above 20%", () => {
      const { container } = render(
        <HealthBar3D current={50} max={100} playerId="player1" />
      );
      const healthBar = container.querySelector(
        '[data-testid="health-bar-3d-player1"]'
      );
      const segmentsContainer = healthBar?.querySelector("div:last-of-type");
      expect(segmentsContainer).toHaveStyle({ animation: "none" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle fractional health values", () => {
      render(<HealthBar3D current={85.7} max={100} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "86/100"
      );
    });

    it("should handle non-standard max values", () => {
      render(<HealthBar3D current={42} max={50} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "42/50"
      );
    });

    it("should handle very small max values", () => {
      render(<HealthBar3D current={3} max={5} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "3/5"
      );
    });

    it("should handle large health values", () => {
      render(<HealthBar3D current={9999} max={10000} playerId="player1" />);
      expect(screen.getByTestId("health-value-3d-player1")).toHaveTextContent(
        "9999/10000"
      );
    });
  });
});
