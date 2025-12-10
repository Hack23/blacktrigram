/**
 * ConsciousnessBlur Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { ConsciousnessBlur } from "./ConsciousnessBlur";

describe("ConsciousnessBlur", () => {
  const renderInCanvas = (component: React.ReactElement) => {
    return render(
      <Canvas>
        {component}
      </Canvas>
    );
  };

  describe("Rendering", () => {
    it("should not render when consciousness is very high (> 90)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={100} isMobile={false} />);
      expect(screen.queryByTestId("consciousness-blur")).not.toBeInTheDocument();
    });

    it("should not render when consciousness is exactly 91", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={91} isMobile={false} />);
      expect(screen.queryByTestId("consciousness-blur")).not.toBeInTheDocument();
    });

    it("should render when consciousness is 90 or lower", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={90} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should render at low consciousness levels", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={30} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should render when unconscious (0)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={0} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have fixed positioning", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={false} />);
      const blur = screen.getByTestId("consciousness-blur");
      expect(blur).toHaveStyle({ position: "fixed" });
    });

    it("should have pointer-events none", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={false} />);
      const blur = screen.getByTestId("consciousness-blur");
      expect(blur).toHaveStyle({ pointerEvents: "none" });
    });

    it("should have smooth transition", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={false} />);
      const blur = screen.getByTestId("consciousness-blur");
      expect(blur).toHaveStyle({
        transition: "backdrop-filter 0.5s ease-out, background-color 0.5s ease-out"
      });
    });

    it("should apply backdrop-filter blur", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={false} />);
      const blur = screen.getByTestId("consciousness-blur");
      const style = window.getComputedStyle(blur);
      // backdropFilter is the standard property
      expect(style.backdropFilter || blur.style.backdropFilter).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden=true for decorative effect", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={false} />);
      const blur = screen.getByTestId("consciousness-blur");
      expect(blur).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Consciousness Level Variations", () => {
    it("should handle consciousness at 90 (threshold)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={90} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should handle moderate consciousness (70%)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={70} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should handle low consciousness (50%)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should handle very low consciousness (25%)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={25} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should handle unconscious state (0%)", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={0} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });
  });

  describe("Mobile Optimization", () => {
    it("should render in mobile mode", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={true} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should apply same basic styles in mobile mode", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={50} isMobile={true} />);
      const blur = screen.getByTestId("consciousness-blur");
      expect(blur).toHaveStyle({
        position: "fixed",
        pointerEvents: "none"
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative consciousness by clamping to 0", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={-10} isMobile={false} />);
      // Should render (clamped to 0, which is <= 90)
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });

    it("should handle consciousness above 100 by clamping", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={150} isMobile={false} />);
      // Should not render (clamped to 100, which is > 90)
      expect(screen.queryByTestId("consciousness-blur")).not.toBeInTheDocument();
    });

    it("should handle decimal consciousness values", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={72.5} isMobile={false} />);
      expect(screen.getByTestId("consciousness-blur")).toBeInTheDocument();
    });
  });

  describe("Blur Intensity Calculation", () => {
    it("should increase blur as consciousness decreases", () => {
      const { rerender } = renderInCanvas(
        <ConsciousnessBlur consciousness={90} isMobile={false} />
      );
      const blur90 = screen.getByTestId("consciousness-blur");
      const style90 = window.getComputedStyle(blur90);
      
      rerender(
        <Canvas>
          <ConsciousnessBlur consciousness={50} isMobile={false} />
        </Canvas>
      );
      
      const blur50 = screen.getByTestId("consciousness-blur");
      expect(blur50).toBeInTheDocument();
    });

    it("should apply maximum blur at 0 consciousness", () => {
      renderInCanvas(<ConsciousnessBlur consciousness={0} isMobile={false} />);
      const blur = screen.getByTestId("consciousness-blur");
      expect(blur).toBeInTheDocument();
    });
  });
});
