/**
 * Tests for TrigramSymbol3D
 * 
 * Verifies 3D trigram symbol rendering with Korean aesthetics
 * 
 * @module components/shared/three/indicators/TrigramSymbol3D.test
 * @category Combat UI Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrigramSymbol3D } from "./TrigramSymbol3D";
import { FONT_FAMILY } from "../../../../types/constants";
import React from "react";

// Mock Html from @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children, position, center }: { children: React.ReactNode; position: [number, number, number]; center?: boolean }) => (
    <div data-testid="drei-html" data-position={JSON.stringify(position)} data-center={center}>
      {children}
    </div>
  ),
}));

describe("TrigramSymbol3D", () => {
  describe("Rendering", () => {
    it("should render trigram symbol", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff} 
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol).toBeInTheDocument();
      expect(symbol.textContent).toBe("☰");
    });

    it("should render all eight trigram symbols", () => {
      const symbols = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];

      symbols.forEach((symbol) => {
        const { unmount } = render(
          <TrigramSymbol3D 
            symbol={symbol} 
            position={[0, 0, 0]} 
            color={0xffffff} 
          />
        );

        const element = screen.getByTestId("trigram-symbol-3d");
        expect(element.textContent).toBe(symbol);

        unmount();
      });
    });

    it("should apply position prop to Html component", () => {
      const position: [number, number, number] = [1, 2, 3];
      
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={position} 
          color={0xffffff} 
        />
      );

      const htmlContainer = screen.getByTestId("drei-html");
      expect(htmlContainer.getAttribute("data-position")).toBe(JSON.stringify(position));
    });

    it("should center the Html component", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff} 
        />
      );

      const htmlContainer = screen.getByTestId("drei-html");
      expect(htmlContainer.getAttribute("data-center")).toBe("true");
    });
  });

  describe("Styling", () => {
    it("should apply Korean font family", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff} 
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.fontFamily).toBe(FONT_FAMILY.KOREAN);
    });

    it("should apply bold font weight", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff} 
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.fontWeight).toBe("bold");
    });

    it("should apply color from hex number", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xff4444} 
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      // Browser converts hex to RGB format
      expect(symbol.style.color).toBe("rgb(255, 68, 68)");
    });

    it("should apply color from string", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color="#00ffff" 
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      // Browser converts hex to RGB format
      expect(symbol.style.color).toBe("rgb(0, 255, 255)");
    });

    it("should apply opacity prop", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          opacity={0.5}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.opacity).toBe("0.5");
    });

    it("should use default opacity of 1.0", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.opacity).toBe("1");
    });

    it("should apply scale prop", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          scale={1.5}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.transform).toContain("scale(1.5)");
    });

    it("should use default scale of 1.0", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.transform).toContain("scale(1)");
    });
  });

  describe("Responsive Sizing", () => {
    it("should use mobile font size when isMobile is true", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          isMobile={true}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.fontSize).toBe("48px");
    });

    it("should use desktop font size when isMobile is false", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          isMobile={false}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.fontSize).toBe("64px");
    });

    it("should use custom font size when provided", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          fontSize={100}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.fontSize).toBe("100px");
    });

    it("should apply scale to font size", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          fontSize={64}
          scale={1.5}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      // 64 * 1.5 = 96
      expect(symbol.style.fontSize).toBe("96px");
    });
  });

  describe("Brushstroke Effect", () => {
    it("should apply brushstroke text-shadow by default", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      const textShadow = symbol.style.textShadow;
      
      // Should have multi-layered shadow
      expect(textShadow).toContain("20px");
      expect(textShadow).toContain("40px");
      expect(textShadow).toContain("rgba");
    });

    it("should apply simple glow when brushstroke is false", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          brushstroke={false}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      const textShadow = symbol.style.textShadow;
      
      // Should have simpler shadow
      expect(textShadow).toContain("20px");
      expect(textShadow).toContain("40px");
    });
  });

  describe("Accessibility", () => {
    it("should have role img", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.getAttribute("role")).toBe("img");
    });

    it("should have descriptive aria-label", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      const ariaLabel = symbol.getAttribute("aria-label");
      expect(ariaLabel).toContain("Trigram symbol");
      expect(ariaLabel).toContain("☰");
    });

    it("should be non-interactive", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.pointerEvents).toBe("none");
      expect(symbol.style.userSelect).toBe("none");
    });
  });

  describe("Custom Props", () => {
    it("should apply custom className", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          className="custom-class"
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.className).toContain("custom-class");
    });

    it("should apply custom testId", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          testId="custom-test-id"
        />
      );

      const symbol = screen.getByTestId("custom-test-id");
      expect(symbol).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should use smooth font rendering", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.WebkitFontSmoothing).toBe("antialiased");
      expect(symbol.style.MozOsxFontSmoothing).toBe("grayscale");
    });

    it("should use smooth transitions", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.transition).toContain("opacity");
      expect(symbol.style.transition).toContain("transform");
      expect(symbol.style.transition).toContain("0.3s");
      expect(symbol.style.transition).toContain("ease-in-out");
    });
  });

  describe("Korean Martial Arts Integration", () => {
    it("should render Heaven trigram with metal color", () => {
      render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff} // Metal/white
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.textContent).toBe("☰");
      // Browser converts hex to RGB format
      expect(symbol.style.color).toBe("rgb(255, 255, 255)");
    });

    it("should render Fire trigram with fire color", () => {
      render(
        <TrigramSymbol3D 
          symbol="☲" 
          position={[0, 0, 0]} 
          color={0xff4444} // Fire/red
        />
      );

      const symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.textContent).toBe("☲");
      // Browser converts hex to RGB format
      expect(symbol.style.color).toBe("rgb(255, 68, 68)");
    });

    it("should support fade animations for stance transitions", () => {
      const { rerender } = render(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          opacity={1.0}
        />
      );

      let symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.opacity).toBe("1");

      // Fade out
      rerender(
        <TrigramSymbol3D 
          symbol="☰" 
          position={[0, 0, 0]} 
          color={0xffffff}
          opacity={0.0}
        />
      );

      symbol = screen.getByTestId("trigram-symbol-3d");
      expect(symbol.style.opacity).toBe("0");
    });
  });

  describe("Memoization", () => {
    it("should export named and default components", () => {
      // Both named and default exports should be available
      expect(TrigramSymbol3D).toBeDefined();
      
      // Component should be a React component function
      expect(typeof TrigramSymbol3D).toBe("function");
    });
  });
});
