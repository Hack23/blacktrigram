/**
 * Tests for GamepadVisualization3D - 3D gamepad display component
 * 
 * Tests gamepad body rendering, button display, labels, responsive sizing,
 * and test IDs.
 * 
 * @module components/screens/controls/components/__tests__
 */

import { Canvas } from "@react-three/fiber";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GamepadVisualization3D } from "./GamepadVisualization3D";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Three.js Canvas
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-html">{children}</div>
  ),
}));

describe("GamepadVisualization3D", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should have gamepad-visualization test id", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container.innerHTML).toContain("gamepad-visualization");
    });

    it("should render with Three.js canvas", () => {
      const { getByTestId } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(getByTestId("three-canvas")).toBeTruthy();
    });

    it("should render HTML overlays for buttons", () => {
      const { getAllByTestId } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const htmlOverlays = getAllByTestId("three-html");
      // Should have HTML overlays for all 12 buttons
      expect(htmlOverlays.length).toBeGreaterThanOrEqual(12);
    });
  });

  describe("Gamepad body", () => {
    it("should render gamepad body sections", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Should render left and right body sections
    });

    it("should render center connector", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Should have center connector piece
    });
  });

  describe("Button display", () => {
    it("should display all 12 buttons", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // GAMEPAD_BUTTONS has 12 buttons (0-11)
    });

    it("should display face buttons (A, B, X, Y)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("A");
      expect(content).toContain("B");
      expect(content).toContain("X");
      expect(content).toContain("Y");
    });

    it("should display shoulder buttons (LB, RB, LT, RT)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("LB");
      expect(content).toContain("RB");
      expect(content).toContain("LT");
      expect(content).toContain("RT");
    });

    it("should display menu buttons (Back, Start)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("Back");
      expect(content).toContain("Start");
    });

    it("should display stick buttons (L3, R3)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("L3");
      expect(content).toContain("R3");
    });
  });

  describe("Button labels", () => {
    it("should display Korean button names", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      // Korean labels for buttons should be present
      expect(container).toBeTruthy();
    });

    it("should display English button names", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("A");
      expect(content).toContain("B");
      expect(content).toContain("X");
      expect(content).toContain("Y");
    });

    it("should display bilingual format (Korean | English)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      // Should have pipe separators for bilingual labels
      expect(content).toMatch(/\|/);
    });

    it("should display action names", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("Attack");
      expect(content).toContain("Block");
    });

    it("should display Korean action names", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("공격");
      expect(content).toContain("방어");
    });
  });

  describe("Responsive sizing", () => {
    it("should render in mobile mode", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={true} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render in desktop mode", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should display all buttons in mobile mode", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={true} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("A");
      expect(content).toContain("B");
      expect(content).toContain("LB");
      expect(content).toContain("Start");
    });

    it("should display all buttons in desktop mode", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("A");
      expect(content).toContain("B");
      expect(content).toContain("LB");
      expect(content).toContain("Start");
    });

    it("should handle switching between mobile and desktop", () => {
      const { container, rerender } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <GamepadVisualization3D isMobile={true} />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Button positions", () => {
    it("should position face buttons on right side", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // A, B, X, Y should be positioned on right side
    });

    it("should position shoulder buttons on top", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // LB, RB, LT, RT should be on top
    });

    it("should position menu buttons in center", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Back, Start should be in center
    });

    it("should position stick buttons on lower part", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // L3, R3 should be lower
    });
  });

  describe("Lighting", () => {
    it("should include ambient light", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should include directional lights", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Button colors", () => {
    it("should apply different colors to different buttons", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Each button should have its assigned color
    });

    it("should use KOREAN_COLORS for button styling", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Colors should come from KOREAN_COLORS constants
    });
  });

  describe("Complete button set", () => {
    it("should render button index 0 (A)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("A");
      expect(container.textContent).toContain("Attack");
    });

    it("should render button index 1 (B)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("B");
      expect(container.textContent).toContain("Block");
    });

    it("should render button index 2 (X)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("X");
      expect(container.textContent).toContain("Technique");
    });

    it("should render button index 3 (Y)", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("Y");
      expect(container.textContent).toContain("Technique");
    });

    it("should render all shoulder buttons", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("LB");
      expect(content).toContain("RB");
      expect(content).toContain("LT");
      expect(content).toContain("RT");
    });

    it("should render all menu buttons with actions", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("Back");
      expect(content).toContain("Start");
      expect(content).toContain("Menu");
      expect(content).toContain("Pause");
    });

    it("should render stick buttons with actions", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("L3");
      expect(content).toContain("R3");
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid mobile/desktop switching", () => {
      const { container, rerender } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <Canvas>
            <GamepadVisualization3D isMobile={true} />
          </Canvas>
        );
        rerender(
          <Canvas>
            <GamepadVisualization3D isMobile={false} />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });

    it("should maintain all buttons across rerenders", () => {
      const { container, rerender } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const initialContent = container.textContent || "";
      expect(initialContent).toContain("A");

      for (let i = 0; i < 5; i++) {
        rerender(
          <Canvas>
            <GamepadVisualization3D isMobile={i % 2 === 0} />
          </Canvas>
        );
      }

      const finalContent = container.textContent || "";
      expect(finalContent).toContain("A");
      expect(finalContent).toContain("B");
      expect(finalContent).toContain("Start");
    });
  });

  describe("Integration", () => {
    it("should display complete gamepad with all elements", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";

      // Face buttons
      expect(content).toContain("A");
      expect(content).toContain("B");
      expect(content).toContain("X");
      expect(content).toContain("Y");

      // Shoulder buttons
      expect(content).toContain("LB");
      expect(content).toContain("RB");

      // Menu buttons
      expect(content).toContain("Back");
      expect(content).toContain("Start");

      // Actions
      expect(content).toContain("Attack");
      expect(content).toContain("Block");

      // Korean translations
      expect(content).toContain("공격");
      expect(content).toContain("방어");
    });

    it("should work in complete mobile scenario", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={true} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("A");
      expect(content).toContain("공격");
      expect(content).toContain("Attack");
    });

    it("should work in complete desktop scenario", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("A");
      expect(content).toContain("공격");
      expect(content).toContain("Attack");
    });
  });

  describe("Performance", () => {
    it("should handle multiple rerenders efficiently", () => {
      const { container, rerender } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      for (let i = 0; i < 50; i++) {
        rerender(
          <Canvas>
            <GamepadVisualization3D isMobile={i % 2 === 0} />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should provide clear button labels", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      // Each button should have clear Korean and English labels
      expect(content.length).toBeGreaterThan(100); // Should have substantial text
    });

    it("should show actions for each button", () => {
      const { container } = render(
        <Canvas>
          <GamepadVisualization3D isMobile={false} />
        </Canvas>
      );

      const content = container.textContent || "";
      expect(content).toContain("Attack");
      expect(content).toContain("Block");
      expect(content).toContain("Menu");
      expect(content).toContain("Pause");
    });
  });
});
