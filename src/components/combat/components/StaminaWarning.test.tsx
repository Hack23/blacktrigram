/**
 * StaminaWarning Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { StaminaWarning } from "./StaminaWarning";

describe("StaminaWarning", () => {
  const renderInCanvas = (component: React.ReactElement) => {
    return render(
      <Canvas>
        {component}
      </Canvas>
    );
  };

  describe("Rendering", () => {
    it("should not render when stamina is above threshold (>= 20)", () => {
      renderInCanvas(<StaminaWarning stamina={100} isMobile={false} />);
      expect(screen.queryByTestId("stamina-warning")).not.toBeInTheDocument();
    });

    it("should not render when stamina is exactly 20", () => {
      renderInCanvas(<StaminaWarning stamina={20} isMobile={false} />);
      expect(screen.queryByTestId("stamina-warning")).not.toBeInTheDocument();
    });

    it("should render when stamina drops below threshold (< 20)", () => {
      renderInCanvas(<StaminaWarning stamina={19} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should render at low stamina (10)", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should render at zero stamina", () => {
      renderInCanvas(<StaminaWarning stamina={0} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have fixed positioning", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning).toHaveStyle({ position: "fixed" });
    });

    it("should have pointer-events none", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning).toHaveStyle({ pointerEvents: "none" });
    });

    it("should have smooth border transition", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning).toHaveStyle({ transition: "border-color 0.3s ease-out" });
    });

    it("should have flashing animation", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      const style = window.getComputedStyle(warning);
      // Animation property includes timing and iteration
      expect(warning.style.animation).toContain("staminaFlash");
      expect(warning.style.animation).toContain("infinite");
    });

    it("should have yellow border", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      const style = window.getComputedStyle(warning);
      expect(style.borderColor || warning.style.borderColor).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden=true for decorative warning", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Stamina Level Variations", () => {
    it("should handle stamina just below threshold (19)", () => {
      renderInCanvas(<StaminaWarning stamina={19} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should handle low stamina (15)", () => {
      renderInCanvas(<StaminaWarning stamina={15} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should handle very low stamina (5)", () => {
      renderInCanvas(<StaminaWarning stamina={5} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should handle critical stamina (1)", () => {
      renderInCanvas(<StaminaWarning stamina={1} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should handle depleted stamina (0)", () => {
      renderInCanvas(<StaminaWarning stamina={0} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });
  });

  describe("Mobile Optimization", () => {
    it("should render in mobile mode", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={true} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should apply same basic styles in mobile mode", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={true} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning).toHaveStyle({
        position: "fixed",
        pointerEvents: "none"
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative stamina by clamping", () => {
      renderInCanvas(<StaminaWarning stamina={-10} isMobile={false} />);
      // Should still render (clamped to 0, which is < 20)
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });

    it("should handle stamina above 100 by not rendering", () => {
      renderInCanvas(<StaminaWarning stamina={150} isMobile={false} />);
      // Should not render (>= 20)
      expect(screen.queryByTestId("stamina-warning")).not.toBeInTheDocument();
    });

    it("should handle decimal stamina values", () => {
      renderInCanvas(<StaminaWarning stamina={12.5} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });
  });

  describe("Threshold Behavior", () => {
    it("should not render just at threshold (20)", () => {
      renderInCanvas(<StaminaWarning stamina={20} isMobile={false} />);
      expect(screen.queryByTestId("stamina-warning")).not.toBeInTheDocument();
    });

    it("should not render just above threshold (20.1)", () => {
      renderInCanvas(<StaminaWarning stamina={20.1} isMobile={false} />);
      expect(screen.queryByTestId("stamina-warning")).not.toBeInTheDocument();
    });

    it("should render just below threshold (19.9)", () => {
      renderInCanvas(<StaminaWarning stamina={19.9} isMobile={false} />);
      expect(screen.getByTestId("stamina-warning")).toBeInTheDocument();
    });
  });

  describe("CSS Animation Injection", () => {
    it("should inject keyframe animation CSS", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      
      const warning = screen.getByTestId("stamina-warning");
      expect(warning).toBeInTheDocument();
      
      // Style tag should be present in parent
      const container = warning.parentElement;
      const styleTag = container?.querySelector("style");
      expect(styleTag).toBeTruthy();
      expect(styleTag?.textContent).toContain("staminaFlash");
    });

    it("should define flashing keyframes with opacity changes", () => {
      renderInCanvas(<StaminaWarning stamina={10} isMobile={false} />);
      
      const warning = screen.getByTestId("stamina-warning");
      const container = warning.parentElement;
      const styleTag = container?.querySelector("style");
      
      expect(styleTag?.textContent).toContain("0%, 100%");
      expect(styleTag?.textContent).toContain("50%");
      expect(styleTag?.textContent).toContain("opacity");
    });
  });

  describe("Animation Urgency", () => {
    it("should flash faster at critically low stamina", () => {
      renderInCanvas(<StaminaWarning stamina={2} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning.style.animation).toContain("staminaFlash");
    });

    it("should flash slower at moderately low stamina", () => {
      renderInCanvas(<StaminaWarning stamina={18} isMobile={false} />);
      const warning = screen.getByTestId("stamina-warning");
      expect(warning.style.animation).toContain("staminaFlash");
    });
  });
});
