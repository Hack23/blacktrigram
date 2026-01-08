/**
 * StaminaBar Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StaminaBar } from "./StaminaBar";

describe("StaminaBar", () => {
  const defaultProps = {
    current: 45,
    max: 50,
    playerId: "player-1",
    isMobile: false,
  };

  describe("Rendering", () => {
    it("should render stamina bar with correct test ID", () => {
      render(<StaminaBar {...defaultProps} />);
      expect(screen.getByTestId("stamina-bar-player-1")).toBeInTheDocument();
    });

    it("should display Korean and English labels", () => {
      render(<StaminaBar {...defaultProps} />);
      expect(screen.getByText(/기력.*Stamina/)).toBeInTheDocument();
    });

    it("should display numeric stamina values", () => {
      render(<StaminaBar {...defaultProps} />);
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent("45/50");
    });

    it("should render correct number of segments", () => {
      render(<StaminaBar {...defaultProps} />);
      const segments = screen.getAllByTestId(/stamina-segment-player-1-/);
      expect(segments).toHaveLength(5);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA progressbar role", () => {
      render(<StaminaBar {...defaultProps} current={45} max={50} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("role", "progressbar");
    });

    it("should have proper ARIA label with Korean and English text", () => {
      render(<StaminaBar {...defaultProps} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-label", "기력 | Stamina");
    });

    it("should have correct aria-valuenow attribute", () => {
      render(<StaminaBar {...defaultProps} current={45} max={50} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "45");
    });

    it("should have correct aria-valuemin attribute", () => {
      render(<StaminaBar {...defaultProps} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
    });

    it("should have correct aria-valuemax attribute", () => {
      render(<StaminaBar {...defaultProps} current={45} max={50} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuemax", "50");
    });

    it("should have readable aria-valuetext", () => {
      render(<StaminaBar {...defaultProps} current={45} max={50} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuetext", "45 out of 50");
    });

    it("should update ARIA attributes when stamina changes", () => {
      const { rerender } = render(<StaminaBar {...defaultProps} current={45} max={50} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "45");
      expect(bar).toHaveAttribute("aria-valuetext", "45 out of 50");

      rerender(<StaminaBar {...defaultProps} current={25} max={50} />);
      expect(bar).toHaveAttribute("aria-valuenow", "25");
      expect(bar).toHaveAttribute("aria-valuetext", "25 out of 50");
    });

    it("should handle decimal stamina values in ARIA attributes", () => {
      render(<StaminaBar {...defaultProps} current={45.3} max={50} />);
      const bar = screen.getByTestId("stamina-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "46");
      expect(bar).toHaveAttribute("aria-valuetext", "46 out of 50");
    });
  });

  describe("Segment Filling", () => {
    it("should fill all segments at 100% stamina", () => {
      const { container } = render(<StaminaBar {...defaultProps} current={50} max={50} />);
      const segments = container.querySelectorAll('[data-testid*="stamina-segment"]');
      
      segments.forEach((segment) => {
        const bgColor = (segment as HTMLElement).style.backgroundColor;
        // Should be filled (blue color, not dark gray)
        expect(bgColor).not.toContain("rgb(22, 33, 62)");
      });
    });

    it("should fill correct segments at 60% stamina", () => {
      const { container } = render(<StaminaBar {...defaultProps} current={30} max={50} />);
      const segments = container.querySelectorAll('[data-testid*="stamina-segment"]');
      
      // First 3 segments should be filled (60% = 3/5)
      for (let i = 0; i < 3; i++) {
        const bgColor = (segments[i] as HTMLElement).style.backgroundColor;
        expect(bgColor).not.toContain("rgb(22, 33, 62)");
      }
      
      // Last 2 segments should be empty (UI_BACKGROUND_MEDIUM)
      for (let i = 3; i < 5; i++) {
        const bgColor = (segments[i] as HTMLElement).style.backgroundColor;
        expect(bgColor).toContain("rgb(26, 26, 26)"); // Updated for WCAG AA (was rgb(22, 33, 62))
      }
    });

    it("should handle zero stamina correctly", () => {
      render(<StaminaBar {...defaultProps} current={0} max={50} />);
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent("0/50");
    });
  });

  describe("Responsive Sizing", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(<StaminaBar {...defaultProps} isMobile={true} />);
      const staminaBar = container.querySelector('[data-testid="stamina-bar-player-1"]') as HTMLElement;
      expect(staminaBar.style.width).toBe("180px");
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(<StaminaBar {...defaultProps} isMobile={false} />);
      const staminaBar = container.querySelector('[data-testid="stamina-bar-player-1"]') as HTMLElement;
      expect(staminaBar.style.width).toBe("250px");
    });
  });

  describe("Pulse Animation", () => {
    it("should apply pulse animation when stamina <20%", () => {
      const { container } = render(<StaminaBar {...defaultProps} current={8} max={50} />);
      const segmentContainer = container.querySelector('[data-testid*="stamina-segment"]')?.parentElement;
      expect(segmentContainer?.style.animation).toContain("staminaPulse");
    });

    it("should not apply pulse animation when stamina >=20%", () => {
      const { container } = render(<StaminaBar {...defaultProps} current={15} max={50} />);
      const segmentContainer = container.querySelector('[data-testid*="stamina-segment"]')?.parentElement;
      expect(segmentContainer?.style.animation).toBe("none");
    });
  });

  describe("Color Consistency", () => {
    it("should use blue color for filled segments", () => {
      const { container } = render(<StaminaBar {...defaultProps} current={40} max={50} />);
      const segments = container.querySelectorAll('[data-testid*="stamina-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Blue color (ACCENT_BLUE: 0x3399ff = rgb(51, 153, 255))
      expect(firstSegment.style.backgroundColor).toContain("rgb(51, 153, 255)");
    });
  });

  describe("Edge Cases", () => {
    it("should handle stamina over max correctly", () => {
      render(<StaminaBar {...defaultProps} current={60} max={50} />);
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent("60/50");
    });

    it("should handle negative stamina as zero percentage", () => {
      render(<StaminaBar {...defaultProps} current={-10} max={50} />);
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent("-10/50");
    });

    it("should handle decimal stamina values", () => {
      render(<StaminaBar {...defaultProps} current={45.7} max={50} />);
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent("46/50");
    });
  });

  describe("Transition Smoothness", () => {
    it("should have CSS transitions defined for segments", () => {
      const { container } = render(<StaminaBar {...defaultProps} />);
      const segment = container.querySelector('[data-testid*="stamina-segment"]') as HTMLElement;
      expect(segment.style.transition).toContain("background-color");
      expect(segment.style.transition).toContain("0.2s");
    });
  });
});
