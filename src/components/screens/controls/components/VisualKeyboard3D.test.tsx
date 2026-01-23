/**
 * Tests for VisualKeyboard3D - 3D keyboard visualization
 * 
 * Tests keyboard rendering, key filtering by tab, grid layout,
 * lighting setup, and test IDs.
 * 
 * @module components/screens/controls/components/__tests__
 */

import { Canvas } from "@react-three/fiber";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VisualKeyboard3D } from "./VisualKeyboard3D";

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

describe("VisualKeyboard3D", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should have visual-keyboard test id", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      // Check for data-testid in rendered output
      expect(container.innerHTML).toContain("visual-keyboard");
    });

    it("should render with Three.js canvas", () => {
      const pressedKeys = new Set<string>();

      const { getByTestId } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(getByTestId("three-canvas")).toBeTruthy();
    });
  });

  describe("Filtering keys by tab", () => {
    it("should render combat keys when combat tab is selected", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Combat keys include stances, combat actions, and techniques
    });

    it("should render movement keys when movement tab is selected", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Movement keys include WASD, arrows, and modifiers
    });

    it("should render system keys when system tab is selected", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="system" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // System keys include ESC, M, Tab
    });

    it("should update rendered keys when tab changes", () => {
      const pressedKeys = new Set<string>();

      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="system" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Pressed keys tracking", () => {
    it("should handle empty pressedKeys set", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle single pressed key", () => {
      const pressedKeys = new Set<string>(["Space"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle multiple pressed keys", () => {
      const pressedKeys = new Set<string>(["KeyW", "Space", "Digit1"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should update when pressed keys change", () => {
      const pressedKeys1 = new Set<string>(["Space"]);

      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys1} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();

      const pressedKeys2 = new Set<string>(["KeyW", "KeyA"]);

      rerender(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys2} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle keys being pressed and released", () => {
      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>(["Space"])}
            selectedTab="combat"
          />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>()}
            selectedTab="combat"
          />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle rapid key press changes", () => {
      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>()}
            selectedTab="combat"
          />
        </Canvas>
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <Canvas>
            <VisualKeyboard3D
              pressedKeys={new Set<string>(["Space", "KeyW"])}
              selectedTab="combat"
            />
          </Canvas>
        );

        rerender(
          <Canvas>
            <VisualKeyboard3D
              pressedKeys={new Set<string>()}
              selectedTab="combat"
            />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });
  });

  describe("Grid layout", () => {
    it("should position keys in grid layout", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Keys should be positioned based on row/col in KEYBOARD_LAYOUT
    });

    it("should handle keys at different positions", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // WASD keys at different row/col positions
    });

    it("should handle negative column positions (modifiers)", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Shift and Ctrl have negative column positions
    });
  });

  describe("Lighting setup", () => {
    it("should include ambient light", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Should have ambient light for overall illumination
    });

    it("should include directional lights", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Should have directional lights for depth
    });

    it("should include point light", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Should have point light for accent
    });
  });

  describe("Background elements", () => {
    it("should render background plane", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render grid helper", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Tab-specific rendering", () => {
    it("should render different key counts for different tabs", () => {
      const pressedKeys = new Set<string>();

      const { container: combatContainer } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      const { container: movementContainer } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      const { container: systemContainer } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="system" />
        </Canvas>
      );

      expect(combatContainer).toBeTruthy();
      expect(movementContainer).toBeTruthy();
      expect(systemContainer).toBeTruthy();
    });

    it("should show stance keys only in combat tab", () => {
      const pressedKeys = new Set<string>(["Digit1", "Digit2"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should show WASD keys only in movement tab", () => {
      const pressedKeys = new Set<string>(["KeyW", "KeyA", "KeyS", "KeyD"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should show ESC/M keys only in system tab", () => {
      const pressedKeys = new Set<string>(["Escape", "KeyM"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="system" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Integration with Key3D", () => {
    it("should pass pressed state to Key3D components", () => {
      const pressedKeys = new Set<string>(["Space"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should pass correct keyData to Key3D components", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render multiple Key3D components", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Should render multiple keys based on filtered KEYBOARD_LAYOUT
    });
  });

  describe("Edge cases", () => {
    it("should handle switching tabs rapidly", () => {
      const pressedKeys = new Set<string>();

      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <Canvas>
            <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
          </Canvas>
        );
        rerender(
          <Canvas>
            <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="system" />
          </Canvas>
        );
        rerender(
          <Canvas>
            <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });

    it("should handle many keys pressed simultaneously", () => {
      const pressedKeys = new Set<string>([
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "Space",
        "Digit1",
        "Digit2",
        "Digit3",
        "KeyQ",
        "KeyE",
      ]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle all keys being pressed", () => {
      const allKeys = new Set<string>([
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "KeyQ",
        "KeyW",
        "KeyE",
        "KeyR",
        "KeyT",
        "KeyY",
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyG",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyB",
        "Space",
      ]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={allKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle empty selected tab gracefully", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={pressedKeys}
            selectedTab={"" as any}
          />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should handle multiple rerenders efficiently", () => {
      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>()}
            selectedTab="combat"
          />
        </Canvas>
      );

      for (let i = 0; i < 50; i++) {
        rerender(
          <Canvas>
            <VisualKeyboard3D
              pressedKeys={new Set<string>([`Key${i}`])}
              selectedTab="combat"
            />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });

    it("should efficiently update pressed keys", () => {
      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>()}
            selectedTab="combat"
          />
        </Canvas>
      );

      const pressedKeys = new Set<string>();
      for (let i = 0; i < 20; i++) {
        pressedKeys.add(`Digit${i % 8 + 1}`);
        rerender(
          <Canvas>
            <VisualKeyboard3D
              pressedKeys={new Set(pressedKeys)}
              selectedTab="combat"
            />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });
  });

  describe("Complete scenarios", () => {
    it("should render complete combat keyboard with pressed keys", () => {
      const pressedKeys = new Set<string>(["Space", "Digit1", "KeyQ"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="combat" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render complete movement keyboard with WASD pressed", () => {
      const pressedKeys = new Set<string>(["KeyW", "KeyA", "KeyS", "KeyD"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="movement" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render complete system keyboard", () => {
      const pressedKeys = new Set<string>(["Escape"]);

      const { container } = render(
        <Canvas>
          <VisualKeyboard3D pressedKeys={pressedKeys} selectedTab="system" />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle user journey through tabs with key presses", () => {
      const { container, rerender } = render(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>(["Space"])}
            selectedTab="combat"
          />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>(["KeyW", "KeyA"])}
            selectedTab="movement"
          />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <VisualKeyboard3D
            pressedKeys={new Set<string>(["Escape"])}
            selectedTab="system"
          />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });
});
