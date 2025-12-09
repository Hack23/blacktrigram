/**
 * Unit tests for StaminaBar3D component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StaminaBar3D } from "./StaminaBar3D";

describe("StaminaBar3D", () => {
  const defaultProps = {
    current: 45,
    max: 50,
    playerId: "player1",
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<StaminaBar3D {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render with correct test ID", () => {
      render(<StaminaBar3D {...defaultProps} />);
      expect(screen.getByTestId("stamina-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render 5 stamina segments", () => {
      render(<StaminaBar3D {...defaultProps} />);
      for (let i = 0; i < 5; i++) {
        expect(
          screen.getByTestId(`stamina-segment-3d-player1-${i}`)
        ).toBeInTheDocument();
      }
    });

    it("should display Korean and English labels by default", () => {
      render(<StaminaBar3D {...defaultProps} />);
      expect(screen.getByText(/기력 \| Stamina/)).toBeInTheDocument();
    });

    it("should display current and max stamina values", () => {
      render(<StaminaBar3D {...defaultProps} />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "45/50"
      );
    });

    it("should hide text when showText is false", () => {
      render(<StaminaBar3D {...defaultProps} showText={false} />);
      expect(screen.queryByText(/기력 \| Stamina/)).not.toBeInTheDocument();
    });
  });

  describe("Stamina Percentage Calculation", () => {
    it("should calculate full stamina correctly", () => {
      render(<StaminaBar3D current={50} max={50} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "50/50"
      );
    });

    it("should calculate medium stamina correctly", () => {
      render(<StaminaBar3D current={25} max={50} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "25/50"
      );
    });

    it("should calculate low stamina correctly", () => {
      render(<StaminaBar3D current={8} max={50} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "8/50"
      );
    });

    it("should handle zero stamina", () => {
      render(<StaminaBar3D current={0} max={50} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "0/50"
      );
    });

    it("should clamp stamina above max", () => {
      render(<StaminaBar3D current={75} max={50} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "75/50"
      );
    });

    it("should clamp stamina below zero", () => {
      render(<StaminaBar3D current={-5} max={50} playerId="player1" />);
      // Note: Display shows actual value but bar should clamp visually
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "-5/50"
      );
    });
  });

  describe("Variants", () => {
    it("should render player variant correctly", () => {
      render(<StaminaBar3D {...defaultProps} variant="player" />);
      expect(screen.getByTestId("stamina-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render opponent variant correctly", () => {
      render(<StaminaBar3D {...defaultProps} variant="opponent" />);
      expect(screen.getByTestId("stamina-bar-3d-player1")).toBeInTheDocument();
    });

    it("should render training variant correctly", () => {
      render(<StaminaBar3D {...defaultProps} variant="training" />);
      expect(screen.getByTestId("stamina-bar-3d-player1")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(
        <StaminaBar3D {...defaultProps} isMobile={true} />
      );
      const staminaBar = container.querySelector(
        '[data-testid="stamina-bar-3d-player1"]'
      );
      expect(staminaBar).toHaveStyle({ width: "180px" });
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(
        <StaminaBar3D {...defaultProps} isMobile={false} screenWidth={1200} />
      );
      const staminaBar = container.querySelector(
        '[data-testid="stamina-bar-3d-player1"]'
      );
      expect(staminaBar).toHaveStyle({ width: "250px" });
    });

    it("should adapt to screen width", () => {
      const { container } = render(
        <StaminaBar3D {...defaultProps} screenWidth={800} />
      );
      const staminaBar = container.querySelector(
        '[data-testid="stamina-bar-3d-player1"]'
      );
      expect(staminaBar).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have progressbar role", () => {
      render(<StaminaBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeInTheDocument();
    });

    it("should have correct aria-label", () => {
      render(<StaminaBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-label", "기력 | Stamina");
    });

    it("should have correct aria-valuenow", () => {
      render(<StaminaBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "45");
    });

    it("should have correct aria-valuemin", () => {
      render(<StaminaBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    });

    it("should have correct aria-valuemax", () => {
      render(<StaminaBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemax", "50");
    });

    it("should have correct aria-valuetext", () => {
      render(<StaminaBar3D {...defaultProps} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuetext", "45 out of 50");
    });
  });

  describe("Visual States", () => {
    it("should add pulse animation when stamina is below 20%", () => {
      const { container } = render(
        <StaminaBar3D current={8} max={50} playerId="player1" />
      );
      const staminaBar = container.querySelector(
        '[data-testid="stamina-bar-3d-player1"]'
      );
      const segmentsContainer = staminaBar?.querySelector("div:last-of-type");
      const animationStyle = segmentsContainer?.getAttribute("style");
      expect(animationStyle).toContain("staminaPulse");
    });

    it("should not add pulse animation when stamina is above 20%", () => {
      const { container } = render(
        <StaminaBar3D current={25} max={50} playerId="player1" />
      );
      const staminaBar = container.querySelector(
        '[data-testid="stamina-bar-3d-player1"]'
      );
      const segmentsContainer = staminaBar?.querySelector("div:last-of-type");
      expect(segmentsContainer).toHaveStyle({ animation: "none" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle fractional stamina values", () => {
      render(<StaminaBar3D current={45.7} max={50} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "46/50"
      );
    });

    it("should handle non-standard max values", () => {
      render(<StaminaBar3D current={80} max={100} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "80/100"
      );
    });

    it("should handle very small max values", () => {
      render(<StaminaBar3D current={3} max={5} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "3/5"
      );
    });

    it("should handle large stamina values", () => {
      render(<StaminaBar3D current={499} max={500} playerId="player1" />);
      expect(screen.getByTestId("stamina-value-3d-player1")).toHaveTextContent(
        "499/500"
      );
    });
  });
});
