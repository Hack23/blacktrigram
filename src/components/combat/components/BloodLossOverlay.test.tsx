/**
 * BloodLossOverlay Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { BloodLossOverlay } from "./BloodLossOverlay";

describe("BloodLossOverlay", () => {
  const renderInCanvas = (component: React.ReactElement) => {
    return render(
      <Canvas>
        {component}
      </Canvas>
    );
  };

  describe("Rendering", () => {
    it("should not render when blood loss is below threshold (< 50)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={0} isMobile={false} />);
      expect(screen.queryByTestId("bloodloss-overlay")).not.toBeInTheDocument();
    });

    it("should not render when blood loss is exactly 49", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={49} isMobile={false} />);
      expect(screen.queryByTestId("bloodloss-overlay")).not.toBeInTheDocument();
    });

    it("should render when blood loss reaches threshold (50)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={50} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should render at high blood loss (75)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should render at maximum blood loss (100)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={100} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have fixed positioning", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveStyle({ position: "fixed" });
    });

    it("should have pointer-events none", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveStyle({ pointerEvents: "none" });
    });

    it("should have smooth opacity transition", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveStyle({ transition: "opacity 0.5s ease-out" });
    });

    it("should have pulsing animation", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveStyle({ animation: "bloodLossPulse 1.5s ease-in-out infinite" });
    });

    it("should use blood loss indicator color", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveStyle({ backgroundColor: "rgb(204, 0, 0)" });
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden=true for decorative overlay", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Blood Loss Intensity Variations", () => {
    it("should handle critical threshold (50%)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={50} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should handle moderate blood loss (60%)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={60} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should handle high blood loss (75%)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should handle severe blood loss (90%)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={90} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should handle maximum blood loss (100%)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={100} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });
  });

  describe("Mobile Optimization", () => {
    it("should render in mobile mode", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={true} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should apply same basic styles in mobile mode", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={true} />);
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toHaveStyle({
        position: "fixed",
        pointerEvents: "none"
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative blood loss by not rendering", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={-10} isMobile={false} />);
      expect(screen.queryByTestId("bloodloss-overlay")).not.toBeInTheDocument();
    });

    it("should handle blood loss above 100 by clamping", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={150} isMobile={false} />);
      // Should still render (clamped to 100)
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });

    it("should handle decimal blood loss values", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={67.3} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });
  });

  describe("Threshold Behavior", () => {
    it("should not render just below threshold (49.9)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={49.9} isMobile={false} />);
      expect(screen.queryByTestId("bloodloss-overlay")).not.toBeInTheDocument();
    });

    it("should render just above threshold (50.1)", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={50.1} isMobile={false} />);
      expect(screen.getByTestId("bloodloss-overlay")).toBeInTheDocument();
    });
  });

  describe("CSS Animation Injection", () => {
    it("should inject keyframe animation CSS", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      
      // Check that overlay exists
      const overlay = screen.getByTestId("bloodloss-overlay");
      expect(overlay).toBeInTheDocument();
      
      // Style tag should be present in parent
      const container = overlay.parentElement;
      const styleTag = container?.querySelector("style");
      expect(styleTag).toBeTruthy();
      expect(styleTag?.textContent).toContain("bloodLossPulse");
    });

    it("should define pulsing keyframes with opacity changes", () => {
      renderInCanvas(<BloodLossOverlay bloodLoss={75} isMobile={false} />);
      
      const overlay = screen.getByTestId("bloodloss-overlay");
      const container = overlay.parentElement;
      const styleTag = container?.querySelector("style");
      
      expect(styleTag?.textContent).toContain("0%, 100%");
      expect(styleTag?.textContent).toContain("50%");
      expect(styleTag?.textContent).toContain("opacity");
    });
  });
});
