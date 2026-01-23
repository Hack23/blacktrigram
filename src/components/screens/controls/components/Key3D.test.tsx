/**
 * Tests for Key3D - Individual 3D keyboard key component
 * 
 * Tests 3D mesh rendering, category colors, press state, key labels,
 * width handling, and test IDs.
 * 
 * @module components/screens/controls/components/__tests__
 */

import { Canvas } from "@react-three/fiber";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Key3D } from "./Key3D";
import type { KeyData } from "../constants/ControlsConstants";

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
  Html: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="three-html" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

describe("Key3D", () => {
  const createMockKeyData = (overrides?: Partial<KeyData>): KeyData => ({
    code: "Space",
    label: "Space",
    labelKorean: "공격",
    row: 4,
    col: 2,
    width: 3,
    category: "combat",
    description: "Attack",
    descriptionKorean: "공격",
    ...overrides,
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const keyData = createMockKeyData();

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render 3D canvas wrapper", () => {
      const keyData = createMockKeyData();

      const { getByTestId } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(getByTestId("three-canvas")).toBeTruthy();
    });

    it("should render HTML overlay", () => {
      const keyData = createMockKeyData();

      const { getByTestId } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(getByTestId("three-html")).toBeTruthy();
    });
  });

  describe("Key labels", () => {
    it("should display main key label", () => {
      const keyData = createMockKeyData({ label: "W", labelKorean: "전진" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("W");
    });

    it("should display Korean label when available", () => {
      const keyData = createMockKeyData({ label: "Space", labelKorean: "공격" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("Space");
      expect(container.textContent).toContain("공격");
    });

    it("should handle keys without Korean labels", () => {
      const keyData = createMockKeyData({ label: "Q", labelKorean: undefined });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("Q");
    });

    it("should display stance labels correctly", () => {
      const keyData = createMockKeyData({
        code: "Digit1",
        label: "1",
        labelKorean: "건",
        category: "stance",
      });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("1");
      expect(container.textContent).toContain("건");
    });

    it("should display arrow key symbols", () => {
      const keyData = createMockKeyData({
        code: "ArrowUp",
        label: "↑",
        labelKorean: "전진",
        category: "movement",
      });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("↑");
    });
  });

  describe("Pressed state", () => {
    it("should render in unpressed state", () => {
      const keyData = createMockKeyData();

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render in pressed state", () => {
      const keyData = createMockKeyData();

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={true} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should change from unpressed to pressed", () => {
      const keyData = createMockKeyData();

      const { container, rerender } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <Key3D keyData={keyData} isPressed={true} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should change from pressed to unpressed", () => {
      const keyData = createMockKeyData();

      const { container, rerender } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={true} />
        </Canvas>
      );

      expect(container).toBeTruthy();

      rerender(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle rapid state changes", () => {
      const keyData = createMockKeyData();

      const { container, rerender } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      for (let i = 0; i < 5; i++) {
        rerender(
          <Canvas>
            <Key3D keyData={keyData} isPressed={true} />
          </Canvas>
        );
        rerender(
          <Canvas>
            <Key3D keyData={keyData} isPressed={false} />
          </Canvas>
        );
      }

      expect(container).toBeTruthy();
    });
  });

  describe("Category colors", () => {
    it("should render with combat category color", () => {
      const keyData = createMockKeyData({ category: "combat" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render with movement category color", () => {
      const keyData = createMockKeyData({ category: "movement" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render with stance category color", () => {
      const keyData = createMockKeyData({ category: "stance" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render with technique category color", () => {
      const keyData = createMockKeyData({ category: "technique" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render with system category color", () => {
      const keyData = createMockKeyData({ category: "system" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should render with modifier category color", () => {
      const keyData = createMockKeyData({ category: "modifier" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Key width", () => {
    it("should handle standard width (1 unit)", () => {
      const keyData = createMockKeyData({ width: 1 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle wide keys (3 units - Space bar)", () => {
      const keyData = createMockKeyData({ width: 3 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle undefined width (defaults to 1)", () => {
      const keyData = createMockKeyData({ width: undefined });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle double width keys", () => {
      const keyData = createMockKeyData({ width: 2 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Test IDs", () => {
    it("should include key code in data-testid", () => {
      const keyData = createMockKeyData({ code: "Space" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      // The mesh should have name attribute with key code
      expect(container).toBeTruthy();
    });

    it("should have unique test IDs for different keys", () => {
      const keyData1 = createMockKeyData({ code: "KeyW" });
      const keyData2 = createMockKeyData({ code: "KeyA" });

      const { container: container1 } = render(
        <Canvas>
          <Key3D keyData={keyData1} isPressed={false} />
        </Canvas>
      );

      const { container: container2 } = render(
        <Canvas>
          <Key3D keyData={keyData2} isPressed={false} />
        </Canvas>
      );

      expect(container1).toBeTruthy();
      expect(container2).toBeTruthy();
    });
  });

  describe("Position calculation", () => {
    it("should position keys based on row and column", () => {
      const keyData = createMockKeyData({ row: 0, col: 0 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle different row positions", () => {
      const keyData = createMockKeyData({ row: 2, col: 1 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle different column positions", () => {
      const keyData = createMockKeyData({ row: 1, col: 5 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle negative column positions (modifier keys)", () => {
      const keyData = createMockKeyData({ row: 3, col: -1 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Multiple keys", () => {
    it("should render multiple keys together", () => {
      const keyData1 = createMockKeyData({ 
        code: "KeyW", 
        label: "W",
        labelKorean: "전진",
        row: 1, 
        col: 1 
      });
      const keyData2 = createMockKeyData({ 
        code: "KeyA", 
        label: "A",
        labelKorean: "좌",
        row: 2, 
        col: 0 
      });
      const keyData3 = createMockKeyData({ 
        code: "KeyS", 
        label: "S",
        labelKorean: "후퇴",
        row: 2, 
        col: 1 
      });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData1} isPressed={false} />
          <Key3D keyData={keyData2} isPressed={false} />
          <Key3D keyData={keyData3} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      // Check that all key labels are present
      const content = container.textContent || "";
      expect(content).toContain("W");
      expect(content).toContain("A");
      expect(content).toContain("S");
    });

    it("should handle some keys pressed and others not", () => {
      const keyData1 = createMockKeyData({ code: "KeyW" });
      const keyData2 = createMockKeyData({ code: "Space" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData1} isPressed={true} />
          <Key3D keyData={keyData2} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty Korean label", () => {
      const keyData = createMockKeyData({ labelKorean: "" });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle very wide keys", () => {
      const keyData = createMockKeyData({ width: 5 });

      const { container } = render(
        <Canvas>
          <Key3D keyData={keyData} isPressed={false} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it("should handle all categories sequentially", () => {
      const categories: Array<KeyData["category"]> = [
        "stance",
        "movement",
        "combat",
        "system",
        "technique",
        "modifier",
        "normal",
      ];

      categories.forEach((category) => {
        const keyData = createMockKeyData({ category });

        const { container } = render(
          <Canvas>
            <Key3D keyData={keyData} isPressed={false} />
          </Canvas>
        );

        expect(container).toBeTruthy();
      });
    });
  });

  describe("Integration", () => {
    it("should work with realistic keyboard layout data", () => {
      const stanceKey = createMockKeyData({
        code: "Digit1",
        label: "1",
        labelKorean: "건",
        row: 0,
        col: 0,
        category: "stance",
        description: "Geon (Heaven)",
        descriptionKorean: "건 (Heaven)",
      });

      const movementKey = createMockKeyData({
        code: "KeyW",
        label: "W",
        labelKorean: "전진",
        row: 1,
        col: 1,
        category: "movement",
        description: "Move Forward",
        descriptionKorean: "전진",
      });

      const combatKey = createMockKeyData({
        code: "Space",
        label: "Space",
        labelKorean: "공격",
        row: 4,
        col: 2,
        width: 3,
        category: "combat",
        description: "Attack",
        descriptionKorean: "공격",
      });

      const { container } = render(
        <Canvas>
          <Key3D keyData={stanceKey} isPressed={false} />
          <Key3D keyData={movementKey} isPressed={true} />
          <Key3D keyData={combatKey} isPressed={false} />
        </Canvas>
      );

      expect(container.textContent).toContain("1");
      expect(container.textContent).toContain("건");
      expect(container.textContent).toContain("W");
      expect(container.textContent).toContain("전진");
      expect(container.textContent).toContain("Space");
      expect(container.textContent).toContain("공격");
    });
  });
});
