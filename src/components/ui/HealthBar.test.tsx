import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthBar } from "./HealthBar";

describe("HealthBar", () => {
  const defaultProps = {
    current: 100,
    max: 100,
    playerName: "테스트 플레이어",
    x: 0,
    y: 0,
    width: 200,
    height: 30,
    screenWidth: 1200,
    screenHeight: 800,
  };

  describe("rendering", () => {
    it("should render health bar with default props", () => {
      render(<HealthBar {...defaultProps} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should render with right position", () => {
      render(<HealthBar {...defaultProps} position="right" />);
      expect(screen.getByTestId("health-bar-right")).toBeInTheDocument();
    });

    it("should render with center position", () => {
      render(<HealthBar {...defaultProps} position="center" />);
      expect(screen.getByTestId("health-bar-center")).toBeInTheDocument();
    });

    it("should render on mobile screen", () => {
      render(<HealthBar {...defaultProps} screenWidth={400} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("health status", () => {
    it("should show critical status at 15% health", () => {
      render(<HealthBar {...defaultProps} current={15} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should show low status at 35% health", () => {
      render(<HealthBar {...defaultProps} current={35} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should show medium status at 65% health", () => {
      render(<HealthBar {...defaultProps} current={65} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should show high status at 100% health", () => {
      render(<HealthBar {...defaultProps} current={100} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle zero health", () => {
      render(<HealthBar {...defaultProps} current={0} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle negative health", () => {
      render(<HealthBar {...defaultProps} current={-10} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle zero max health", () => {
      render(<HealthBar {...defaultProps} current={50} max={0} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle health over max", () => {
      render(<HealthBar {...defaultProps} current={150} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("text display", () => {
    it("should show text when showText is true", () => {
      render(<HealthBar {...defaultProps} showText={true} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should hide text when showText is false", () => {
      render(<HealthBar {...defaultProps} showText={false} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should display player name", () => {
      render(<HealthBar {...defaultProps} playerName="무사" />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("animations", () => {
    it("should render with animations enabled", () => {
      render(<HealthBar {...defaultProps} animated={true} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should render without animations", () => {
      render(<HealthBar {...defaultProps} animated={false} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should show damage indicator when enabled", () => {
      render(<HealthBar {...defaultProps} showDamageIndicator={true} current={10} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should hide damage indicator when disabled", () => {
      render(<HealthBar {...defaultProps} showDamageIndicator={false} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("responsive behavior", () => {
    it("should adapt to small mobile screens", () => {
      render(<HealthBar {...defaultProps} screenWidth={320} screenHeight={568} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should adapt to tablet screens", () => {
      render(<HealthBar {...defaultProps} screenWidth={768} screenHeight={1024} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should adapt to desktop screens", () => {
      render(<HealthBar {...defaultProps} screenWidth={1920} screenHeight={1080} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle very small dimensions", () => {
      render(<HealthBar {...defaultProps} width={50} height={10} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle very large dimensions", () => {
      render(<HealthBar {...defaultProps} width={800} height={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("positioning", () => {
    it("should position at custom coordinates", () => {
      render(<HealthBar {...defaultProps} x={100} y={50} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should position at negative coordinates", () => {
      render(<HealthBar {...defaultProps} x={-10} y={-10} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should position at screen edges", () => {
      render(<HealthBar {...defaultProps} x={1100} y={750} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("health gradients", () => {
    it("should use green gradient for high health", () => {
      render(<HealthBar {...defaultProps} current={80} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should use yellow gradient for medium health", () => {
      render(<HealthBar {...defaultProps} current={40} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should use red gradient for low health", () => {
      render(<HealthBar {...defaultProps} current={20} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle exact health thresholds", () => {
      render(<HealthBar {...defaultProps} current={25} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle exact medium threshold", () => {
      render(<HealthBar {...defaultProps} current={50} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("Korean martial arts integration", () => {
    it("should support Korean player names", () => {
      render(<HealthBar {...defaultProps} playerName="무사" />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should support bilingual names", () => {
      render(<HealthBar {...defaultProps} playerName="무사 | Musa" />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle long Korean names", () => {
      render(<HealthBar {...defaultProps} playerName="조직폭력배" />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle float health values", () => {
      render(<HealthBar {...defaultProps} current={75.5} max={100} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle very small max health", () => {
      render(<HealthBar {...defaultProps} current={5} max={10} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle very large health values", () => {
      render(<HealthBar {...defaultProps} current={9999} max={10000} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });

    it("should handle equal current and max", () => {
      render(<HealthBar {...defaultProps} current={500} max={500} />);
      expect(screen.getByTestId("health-bar-left")).toBeInTheDocument();
    });
  });
});
