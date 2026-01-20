/**
 * HealthBar Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthBar } from "./HealthBar";

describe("HealthBar", () => {
  const defaultProps = {
    current: 85,
    max: 100,
    playerId: "player-1",
    isMobile: false,
  };

  describe("Rendering", () => {
    it("should render health bar with correct test ID", () => {
      render(<HealthBar {...defaultProps} />);
      expect(screen.getByTestId("health-bar-player-1")).toBeInTheDocument();
    });

    it("should display Korean and English labels", () => {
      render(<HealthBar {...defaultProps} />);
      expect(screen.getByText(/체력.*Health/)).toBeInTheDocument();
    });

    it("should display numeric health values", () => {
      render(<HealthBar {...defaultProps} />);
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent("85/100");
    });

    it("should render correct number of segments", () => {
      render(<HealthBar {...defaultProps} />);
      const segments = screen.getAllByTestId(/health-segment-player-1-/);
      expect(segments).toHaveLength(10);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA progressbar role", () => {
      render(<HealthBar {...defaultProps} current={85} max={100} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("role", "progressbar");
    });

    it("should have proper ARIA label with Korean and English text", () => {
      render(<HealthBar {...defaultProps} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-label", "체력 | Health");
    });

    it("should have correct aria-valuenow attribute", () => {
      render(<HealthBar {...defaultProps} current={85} max={100} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "85");
    });

    it("should have correct aria-valuemin attribute", () => {
      render(<HealthBar {...defaultProps} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
    });

    it("should have correct aria-valuemax attribute", () => {
      render(<HealthBar {...defaultProps} current={85} max={100} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });

    it("should have readable aria-valuetext", () => {
      render(<HealthBar {...defaultProps} current={85} max={100} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuetext", "85 out of 100");
    });

    it("should update ARIA attributes when health changes", () => {
      const { rerender } = render(<HealthBar {...defaultProps} current={85} max={100} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "85");
      expect(bar).toHaveAttribute("aria-valuetext", "85 out of 100");

      rerender(<HealthBar {...defaultProps} current={50} max={100} />);
      expect(bar).toHaveAttribute("aria-valuenow", "50");
      expect(bar).toHaveAttribute("aria-valuetext", "50 out of 100");
    });

    it("should handle decimal health values in ARIA attributes", () => {
      render(<HealthBar {...defaultProps} current={85.7} max={100} />);
      const bar = screen.getByTestId("health-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "86");
      expect(bar).toHaveAttribute("aria-valuetext", "86 out of 100");
    });
  });

  describe("Health Percentage Colors", () => {
    it("should use green color for health >50%", () => {
      const { container } = render(<HealthBar {...defaultProps} current={60} max={100} />);
      const segments = container.querySelectorAll('[data-testid*="health-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Green color (HEALTH_FULL)
      expect(firstSegment.style.backgroundColor).toContain("rgb(0, 255, 0)");
    });

    it("should use yellow color for health 25-50%", () => {
      const { container } = render(<HealthBar {...defaultProps} current={40} max={100} />);
      const segments = container.querySelectorAll('[data-testid*="health-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Yellow color (HEALTH_MEDIUM)
      expect(firstSegment.style.backgroundColor).toContain("rgb(255, 255, 0)");
    });

    it("should use red color for health <25%", () => {
      const { container } = render(<HealthBar {...defaultProps} current={20} max={100} />);
      const segments = container.querySelectorAll('[data-testid*="health-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Red color (HEALTH_CRITICAL)
      expect(firstSegment.style.backgroundColor).toContain("rgb(255, 0, 0)");
    });
  });

  describe("Segment Filling", () => {
    it("should fill all segments at 100% health", () => {
      const { container } = render(<HealthBar {...defaultProps} current={100} max={100} />);
      const segments = container.querySelectorAll('[data-testid*="health-segment"]');
      
      segments.forEach((segment) => {
        const bgColor = (segment as HTMLElement).style.backgroundColor;
        // Should be filled (green color, not dark gray)
        expect(bgColor).not.toContain("rgb(22, 33, 62)");
      });
    });

    it("should fill half segments at 50% health", () => {
      const { container } = render(<HealthBar {...defaultProps} current={50} max={100} />);
      const segments = container.querySelectorAll('[data-testid*="health-segment"]');
      
      // First 5 segments should be filled
      for (let i = 0; i < 5; i++) {
        const bgColor = (segments[i] as HTMLElement).style.backgroundColor;
        expect(bgColor).not.toContain("rgb(22, 33, 62)");
      }
      
      // Last 5 segments should be empty (UI_BACKGROUND_MEDIUM)
      for (let i = 5; i < 10; i++) {
        const bgColor = (segments[i] as HTMLElement).style.backgroundColor;
        expect(bgColor).toContain("rgb(26, 26, 26)"); // Updated for WCAG AA (was rgb(22, 33, 62))
      }
    });

    it("should handle zero health correctly", () => {
      render(<HealthBar {...defaultProps} current={0} max={100} />);
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent("0/100");
    });
  });

  describe("Responsive Sizing", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(<HealthBar {...defaultProps} isMobile={true} />);
      const healthBar = container.querySelector('[data-testid="health-bar-player-1"]') as HTMLElement;
      expect(healthBar.style.width).toBe("180px");
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(<HealthBar {...defaultProps} isMobile={false} />);
      const healthBar = container.querySelector('[data-testid="health-bar-player-1"]') as HTMLElement;
      expect(healthBar.style.width).toBe("250px");
    });
  });

  describe("Pulse Animation", () => {
    it("should apply pulse animation when health <20%", () => {
      const { container } = render(<HealthBar {...defaultProps} current={15} max={100} />);
      const segmentContainer = container.querySelector('[data-testid*="health-segment"]')?.parentElement;
      expect(segmentContainer?.style.animation).toContain("healthPulse");
    });

    it("should not apply pulse animation when health >=20%", () => {
      const { container } = render(<HealthBar {...defaultProps} current={25} max={100} />);
      const segmentContainer = container.querySelector('[data-testid*="health-segment"]')?.parentElement;
      expect(segmentContainer?.style.animation).toBe("none");
    });
  });

  describe("Edge Cases", () => {
    it("should handle health over max correctly", () => {
      render(<HealthBar {...defaultProps} current={120} max={100} />);
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent("120/100");
    });

    it("should handle negative health as zero", () => {
      render(<HealthBar {...defaultProps} current={-10} max={100} />);
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent("-10/100");
    });

    it("should handle decimal health values", () => {
      render(<HealthBar {...defaultProps} current={85.7} max={100} />);
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent("86/100");
    });
  });
});
