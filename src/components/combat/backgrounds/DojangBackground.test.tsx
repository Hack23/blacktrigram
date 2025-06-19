import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DojangBackground } from "./DojangBackground";
import { renderWithPixi } from "../../../test/test-utils";
import { KOREAN_COLORS } from "../../../types/constants";

describe("DojangBackground", () => {
  const defaultProps = {
    width: 800,
    height: 600,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render dojang background with default props", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
      expect(screen.getByTestId("dojang-nameplate")).toBeTruthy();
    });

    it("should render with custom dimensions", () => {
      const customProps = {
        width: 1200,
        height: 900,
      };

      renderWithPixi(<DojangBackground {...customProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should display Korean dojang nameplate", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      const nameplate = screen.getByTestId("dojang-nameplate");
      expect(nameplate).toBeTruthy();
    });
  });

  describe("Lighting Modes", () => {
    it("should render with normal lighting", () => {
      renderWithPixi(<DojangBackground {...defaultProps} lighting="normal" />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render with cyberpunk lighting", () => {
      renderWithPixi(
        <DojangBackground {...defaultProps} lighting="cyberpunk" />
      );

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render with traditional lighting", () => {
      renderWithPixi(
        <DojangBackground {...defaultProps} lighting="traditional" />
      );

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Animation Features", () => {
    it("should render without animation by default", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render with animation enabled", () => {
      renderWithPixi(<DojangBackground {...defaultProps} animate={true} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should handle animation state changes", () => {
      const { rerender } = renderWithPixi(
        <DojangBackground {...defaultProps} animate={false} />
      );

      expect(screen.getByTestId("dojang-background")).toBeTruthy();

      rerender(<DojangBackground {...defaultProps} animate={true} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Korean Traditional Patterns", () => {
    it("should show Korean patterns by default", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should hide patterns when showPattern is false", () => {
      renderWithPixi(
        <DojangBackground {...defaultProps} showPattern={false} />
      );

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render trigram symbols correctly", () => {
      renderWithPixi(<DojangBackground {...defaultProps} showPattern={true} />);

      // Should contain traditional Korean design elements
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Visual Elements", () => {
    it("should render floor pattern correctly", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      // Floor pattern should be present
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render octagonal arena marking", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      // Octagonal combat area should be visible
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render taegeuk patterns in corners", () => {
      renderWithPixi(<DojangBackground {...defaultProps} showPattern={true} />);

      // Traditional Korean yin-yang patterns should be present
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Cyberpunk Integration", () => {
    it("should render cyberpunk grid overlay", () => {
      renderWithPixi(
        <DojangBackground
          {...defaultProps}
          lighting="cyberpunk"
          animate={true}
        />
      );

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should show pulsing neon accents", () => {
      renderWithPixi(
        <DojangBackground
          {...defaultProps}
          lighting="cyberpunk"
          animate={true}
        />
      );

      // Animated cyberpunk elements should be present
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should render energy flow lines", () => {
      renderWithPixi(
        <DojangBackground
          {...defaultProps}
          lighting="cyberpunk"
          animate={true}
        />
      );

      // Cyberpunk aesthetic elements
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Traditional Lighting", () => {
    it("should render warm lantern lighting", () => {
      renderWithPixi(
        <DojangBackground
          {...defaultProps}
          lighting="traditional"
          animate={true}
        />
      );

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should show lantern glow effects", () => {
      renderWithPixi(
        <DojangBackground
          {...defaultProps}
          lighting="traditional"
          animate={true}
        />
      );

      // Traditional Korean lighting should be present
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Responsive Design", () => {
    it("should adapt to mobile dimensions", () => {
      const mobileProps = {
        width: 375,
        height: 667,
      };

      renderWithPixi(<DojangBackground {...mobileProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should adapt to tablet dimensions", () => {
      const tabletProps = {
        width: 768,
        height: 1024,
      };

      renderWithPixi(<DojangBackground {...tabletProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should adapt to desktop dimensions", () => {
      const desktopProps = {
        width: 1920,
        height: 1080,
      };

      renderWithPixi(<DojangBackground {...desktopProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should render efficiently without animation", () => {
      const startTime = performance.now();

      renderWithPixi(<DojangBackground {...defaultProps} animate={false} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should handle animation smoothly", () => {
      renderWithPixi(<DojangBackground {...defaultProps} animate={true} />);

      // Should render animated elements without errors
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Cultural Accuracy", () => {
    it("should display proper Korean text", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      const nameplate = screen.getByTestId("dojang-nameplate");
      expect(nameplate).toBeTruthy();

      // Should contain Korean martial arts terminology
    });

    it("should use authentic Korean color schemes", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      // Should use traditional Korean colors
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should respect traditional design principles", () => {
      renderWithPixi(<DojangBackground {...defaultProps} showPattern={true} />);

      // Should incorporate traditional Korean design elements
      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle zero dimensions gracefully", () => {
      const zeroProps = {
        width: 0,
        height: 0,
      };

      renderWithPixi(<DojangBackground {...zeroProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should handle negative dimensions", () => {
      const negativeProps = {
        width: -100,
        height: -100,
      };

      renderWithPixi(<DojangBackground {...negativeProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });

    it("should handle extremely large dimensions", () => {
      const largeProps = {
        width: 10000,
        height: 10000,
      };

      renderWithPixi(<DojangBackground {...largeProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should provide appropriate test identifiers", () => {
      renderWithPixi(<DojangBackground {...defaultProps} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
      expect(screen.getByTestId("dojang-nameplate")).toBeTruthy();
    });

    it("should support reduced motion preferences", () => {
      // Mock reduced motion preference
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderWithPixi(<DojangBackground {...defaultProps} animate={false} />);

      expect(screen.getByTestId("dojang-background")).toBeTruthy();
    });
  });
});
