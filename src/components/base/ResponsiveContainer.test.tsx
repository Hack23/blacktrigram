/**
 * Tests for ResponsiveContainer component
 *
 * Validates grid positioning, responsive layout, and alignment
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Z_INDEX } from "../../types/LayoutTypes";
import { ResponsiveContainer } from "./ResponsiveContainer";

describe("ResponsiveContainer", () => {
  describe("grid-based positioning", () => {
    it("should render with grid position", () => {
      const { container } = render(
        <ResponsiveContainer
          grid={{ column: 2, span: 4 }}
          containerWidth={1200}
          data-testid="grid-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="grid-container"]') as HTMLElement;
      expect(element).toBeTruthy();

      // Verify grid attributes
      expect(element.getAttribute("data-layout-grid")).toBe("2,4");
    });

    it("should calculate grid position correctly", () => {
      const { container } = render(
        <ResponsiveContainer
          grid={{ column: 0, span: 1 }}
          containerWidth={1200}
          data-testid="grid-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="grid-container"]') as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.position).toBe("absolute");
      expect(computedStyle.left).toBe("0px");
      expect(computedStyle.width).toBe("80px"); // (1200/12) - 20 = 80
    });

    it("should apply custom gutter", () => {
      const { container } = render(
        <ResponsiveContainer
          grid={{ column: 0, span: 1, gutter: 10 }}
          containerWidth={1200}
          data-testid="grid-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="grid-container"]') as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.width).toBe("90px"); // (1200/12) - 10 = 90
    });
  });

  describe("responsive positioning", () => {
    it("should use base position for desktop", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 100, y: 50 } }}
          containerWidth={1920}
          data-testid="responsive-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="responsive-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.left).toBe("100px");
      expect(computedStyle.top).toBe("50px");
    });

    it("should use mobile position override", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{
            base: { x: 100, y: 50 },
            mobile: { x: 10, y: 20 },
          }}
          containerWidth={375}
          data-testid="responsive-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="responsive-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.left).toBe("10px");
      expect(computedStyle.top).toBe("20px");
    });

    it("should scale proportionally when enabled", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{
            base: { x: 100, y: 50 },
            scaleProportionally: true,
          }}
          containerWidth={600} // 50% of base 1200
          data-testid="responsive-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="responsive-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // 600 / 1200 = 0.5, so position should be scaled by 0.5
      expect(computedStyle.left).toBe("50px"); // 100 * 0.5
      expect(computedStyle.top).toBe("25px"); // 50 * 0.5
    });
  });

  describe("alignment", () => {
    it("should align horizontally center", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          elementWidth={200}
          horizontalAlign="center"
          data-testid="aligned-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="aligned-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.left).toBe("300px"); // (800 - 200) / 2
    });

    it("should align horizontally right", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          elementWidth={200}
          horizontalAlign="right"
          margin={10}
          data-testid="aligned-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="aligned-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.left).toBe("590px"); // 800 - 200 - 10
    });

    it("should align vertically middle", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          containerHeight={600}
          elementHeight={100}
          verticalAlign="middle"
          data-testid="aligned-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="aligned-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.top).toBe("250px"); // (600 - 100) / 2
    });

    it("should align vertically bottom", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          containerHeight={600}
          elementHeight={100}
          verticalAlign="bottom"
          margin={10}
          data-testid="aligned-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="aligned-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.top).toBe("490px"); // 600 - 100 - 10
    });

    it("should handle grid with horizontal alignment override", () => {
      const { container } = render(
        <ResponsiveContainer
          grid={{ column: 0, span: 6 }}
          containerWidth={1200}
          elementWidth={300}
          horizontalAlign="center"
          data-testid="grid-aligned-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="grid-aligned-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // Grid width should be maintained (6 columns = 580px)
      expect(computedStyle.width).toBe("580px");
      
      // But x position should be centered (alignment overrides grid x)
      expect(computedStyle.left).toBe("450px"); // (1200 - 300) / 2
    });

    it("should handle grid with vertical alignment override", () => {
      const { container } = render(
        <ResponsiveContainer
          grid={{ column: 2, span: 8, row: 1 }}
          containerWidth={1200}
          containerHeight={800}
          elementHeight={200}
          verticalAlign="middle"
          data-testid="grid-aligned-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="grid-aligned-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // Grid x position should be maintained
      expect(computedStyle.left).toBe("200px"); // Column 2 * 100px
      
      // But y position should be centered (alignment overrides grid row)
      expect(computedStyle.top).toBe("300px"); // (800 - 200) / 2
    });
  });

  describe("z-index layering", () => {
    it("should apply z-index from Z_INDEX constants", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          zIndex={Z_INDEX.HUD}
          data-testid="z-indexed-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector(
        '[data-testid="z-indexed-container"]'
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.zIndex).toBe(String(Z_INDEX.HUD));
      expect(element.getAttribute("data-layout-zindex")).toBe(String(Z_INDEX.HUD));
    });

    it("should stack elements in correct order", () => {
      const { container } = render(
        <>
          <ResponsiveContainer
            position={{ base: { x: 0, y: 0 } }}
            containerWidth={800}
            zIndex={Z_INDEX.BACKGROUND}
            data-testid="background"
          >
            <div>Background</div>
          </ResponsiveContainer>
          <ResponsiveContainer
            position={{ base: { x: 0, y: 0 } }}
            containerWidth={800}
            zIndex={Z_INDEX.HUD}
            data-testid="hud"
          >
            <div>HUD</div>
          </ResponsiveContainer>
        </>
      );

      const background = container.querySelector('[data-testid="background"]') as HTMLElement;
      const hud = container.querySelector('[data-testid="hud"]') as HTMLElement;

      const backgroundZ = parseInt(window.getComputedStyle(background).zIndex);
      const hudZ = parseInt(window.getComputedStyle(hud).zIndex);

      expect(hudZ).toBeGreaterThan(backgroundZ);
    });
  });

  describe("safe area handling", () => {
    it("should apply safe area inset to top", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 10 } }}
          containerWidth={375}
          useSafeArea
          safeAreaEdge="top"
          data-testid="safe-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="safe-container"]') as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // 10 + 44 (default top safe area) = 54
      expect(computedStyle.top).toBe("54px");
    });

    it("should apply safe area inset to bottom", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 100 } }}
          containerWidth={375}
          useSafeArea
          safeAreaEdge="bottom"
          data-testid="safe-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="safe-container"]') as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // 100 - 34 (default bottom safe area) = 66
      expect(computedStyle.top).toBe("66px");
    });
  });

  describe("styling and customization", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          className="custom-class"
          data-testid="styled-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="styled-container"]') as HTMLElement;
      expect(element.classList.contains("custom-class")).toBe(true);
    });

    it("should apply custom style overrides", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          style={{ backgroundColor: "red", fontSize: "16px" }}
          data-testid="styled-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="styled-container"]') as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // Computed styles return RGB format for colors
      expect(computedStyle.backgroundColor).toBe("rgb(255, 0, 0)");
      expect(computedStyle.fontSize).toBe("16px");
    });

    it("should apply padding", () => {
      const { container } = render(
        <ResponsiveContainer
          position={{ base: { x: 0, y: 0 } }}
          containerWidth={800}
          padding={20}
          data-testid="padded-container"
        >
          <div>Content</div>
        </ResponsiveContainer>
      );

      const element = container.querySelector('[data-testid="padded-container"]') as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      expect(computedStyle.padding).toBe("20px");
    });
  });

  describe("children rendering", () => {
    it("should render children correctly", () => {
      const { getByText } = render(
        <ResponsiveContainer position={{ base: { x: 0, y: 0 } }} containerWidth={800}>
          <div>Test Content</div>
        </ResponsiveContainer>
      );

      expect(getByText("Test Content")).toBeTruthy();
    });

    it("should render multiple children", () => {
      const { getByText } = render(
        <ResponsiveContainer position={{ base: { x: 0, y: 0 } }} containerWidth={800}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ResponsiveContainer>
      );

      expect(getByText("Child 1")).toBeTruthy();
      expect(getByText("Child 2")).toBeTruthy();
      expect(getByText("Child 3")).toBeTruthy();
    });
  });
});
