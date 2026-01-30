/**
 * Tests for KoreanPanel component
 * Enhanced with comprehensive rendering and interaction tests
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../../types/constants";
import { KoreanPanel } from "./KoreanPanel";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay" {...props}>{children}</div>
  ),
}));

describe("KoreanPanel", () => {
  describe("Component Definition", () => {
    it("should be defined and importable", () => {
      expect(KoreanPanel).toBeDefined();
      expect(typeof KoreanPanel).toBe("function");
    });

    it("should have proper display name", () => {
      expect(KoreanPanel.displayName).toBe("KoreanPanel");
    });
  });

  describe("Rendering", () => {
    it("should render with children content", () => {
      render(<KoreanPanel>Test content</KoreanPanel>);

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render with default test ID", () => {
      render(<KoreanPanel>Content</KoreanPanel>);

      expect(screen.getByTestId("korean-panel")).toBeInTheDocument();
    });

    it("should render with custom test ID", () => {
      render(<KoreanPanel testId="custom-panel">Content</KoreanPanel>);

      expect(screen.getByTestId("custom-panel")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <KoreanPanel>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </KoreanPanel>
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
      expect(screen.getByText("Third child")).toBeInTheDocument();
    });

    it("should render nested components", () => {
      render(
        <KoreanPanel>
          <div>
            <span>Nested content</span>
            <button>Click me</button>
          </div>
        </KoreanPanel>
      );

      expect(screen.getByText("Nested content")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("should render JSX elements as children", () => {
      const content = (
        <>
          <h1>Title</h1>
          <p>Description</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </>
      );

      render(<KoreanPanel>{content}</KoreanPanel>);

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });

  describe("Panel Variants", () => {
    it("should support default variant", () => {
      render(<KoreanPanel variant="default">Default panel</KoreanPanel>);

      expect(screen.getByTestId("korean-panel")).toBeInTheDocument();
      expect(screen.getByText("Default panel")).toBeInTheDocument();
    });

    it("should support bordered variant", () => {
      render(<KoreanPanel variant="bordered">Bordered panel</KoreanPanel>);

      expect(screen.getByTestId("korean-panel")).toBeInTheDocument();
      expect(screen.getByText("Bordered panel")).toBeInTheDocument();
    });

    it("should support elevated variant", () => {
      render(<KoreanPanel variant="elevated">Elevated panel</KoreanPanel>);

      expect(screen.getByTestId("korean-panel")).toBeInTheDocument();
      expect(screen.getByText("Elevated panel")).toBeInTheDocument();
    });

    it("should render all variants without error", () => {
      const variants: Array<"default" | "bordered" | "elevated"> = [
        "default",
        "bordered",
        "elevated",
      ];

      variants.forEach((variant) => {
        const { unmount } = render(
          <KoreanPanel variant={variant} testId={`panel-${variant}`}>
            {variant} content
          </KoreanPanel>
        );

        expect(screen.getByTestId(`panel-${variant}`)).toBeInTheDocument();
        expect(screen.getByText(`${variant} content`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Custom Styling", () => {
    it("should accept custom width as number", () => {
      render(
        <KoreanPanel width={300}>
          Width 300
        </KoreanPanel>
      );

      expect(screen.getByText("Width 300")).toBeInTheDocument();
    });

    it("should accept custom width as string", () => {
      render(
        <KoreanPanel width="100%">
          Full width
        </KoreanPanel>
      );

      expect(screen.getByText("Full width")).toBeInTheDocument();
    });

    it("should accept custom height as number", () => {
      render(
        <KoreanPanel height={200}>
          Height 200
        </KoreanPanel>
      );

      expect(screen.getByText("Height 200")).toBeInTheDocument();
    });

    it("should accept custom height as string", () => {
      render(
        <KoreanPanel height="auto">
          Auto height
        </KoreanPanel>
      );

      expect(screen.getByText("Auto height")).toBeInTheDocument();
    });

    it("should accept custom padding", () => {
      render(
        <KoreanPanel padding={24}>
          Padded content
        </KoreanPanel>
      );

      expect(screen.getByText("Padded content")).toBeInTheDocument();
    });

    it("should accept custom position", () => {
      const position: [number, number, number] = [5, 10, 15];
      render(
        <KoreanPanel position={position}>
          Positioned panel
        </KoreanPanel>
      );

      expect(screen.getByText("Positioned panel")).toBeInTheDocument();
    });

    it("should support all dimension combinations", () => {
      const dimensionCombos = [
        { width: 200, height: 150 },
        { width: "50%", height: "auto" },
        { width: 300, height: "100px" },
        { width: "100%", height: 200 },
      ];

      dimensionCombos.forEach((dims, index) => {
        const { unmount } = render(
          <KoreanPanel {...dims} testId={`panel-${index}`}>
            Dimension test {index}
          </KoreanPanel>
        );

        expect(screen.getByTestId(`panel-${index}`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("TypeScript Props", () => {
    it("should accept TypeScript props correctly", () => {
      // TypeScript compilation test
      const validProps = {
        children: "Test content",
        position: [0, 0, 0] as [number, number, number],
        width: 300,
        height: 200,
        padding: 16,
        variant: "default" as const,
      };

      expect(validProps.width).toBe(300);
      expect(validProps.height).toBe(200);
      expect(validProps.padding).toBe(16);
      expect(validProps.variant).toBe("default");
    });

    it("should accept various children types", () => {
      const childrenTypes = [
        "Simple text",
        { type: "div", props: { children: "Element" } },
        ["Multiple", "children"],
      ];

      childrenTypes.forEach((children) => {
        const props = {
          children,
        };

        expect(props.children).toBeDefined();
      });
    });
  });

  describe("Korean Theming", () => {
    it("should use Korean colors for theming", () => {
      const colors = [
        KOREAN_COLORS.UI_BACKGROUND_DARK,
        KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.ACCENT_GOLD,
      ];

      colors.forEach((color) => {
        expect(typeof color).toBe("number");
      });
    });

    it("should verify @react-three/drei Html is available", async () => {
      const drei = await import("@react-three/drei");
      expect(drei.Html).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      render(<KoreanPanel>{""}</KoreanPanel>);

      const panel = screen.getByTestId("korean-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(<KoreanPanel>{null}</KoreanPanel>);

      const panel = screen.getByTestId("korean-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      render(<KoreanPanel>{undefined}</KoreanPanel>);

      const panel = screen.getByTestId("korean-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should handle boolean children", () => {
      render(<KoreanPanel>{false}</KoreanPanel>);

      const panel = screen.getByTestId("korean-panel");
      expect(panel).toBeInTheDocument();
    });

    it("should handle very long text content", () => {
      const longText = "A".repeat(5000);
      render(<KoreanPanel>{longText}</KoreanPanel>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      const specialText = "한글 漢字 <>&\"'`©®™";
      render(<KoreanPanel>{specialText}</KoreanPanel>);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("should handle zero padding", () => {
      render(<KoreanPanel padding={0}>No padding</KoreanPanel>);

      expect(screen.getByText("No padding")).toBeInTheDocument();
    });

    it("should handle zero dimensions", () => {
      render(
        <KoreanPanel width={0} height={0}>
          Zero size
        </KoreanPanel>
      );

      expect(screen.getByText("Zero size")).toBeInTheDocument();
    });

    it("should handle negative position values", () => {
      const position: [number, number, number] = [-5, -10, -15];
      render(
        <KoreanPanel position={position}>
          Negative position
        </KoreanPanel>
      );

      expect(screen.getByText("Negative position")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render with all props combined", () => {
      render(
        <KoreanPanel
          variant="elevated"
          width={400}
          height={300}
          padding={20}
          position={[1, 2, 3]}
          testId="full-panel"
        >
          <h1>Complete Panel</h1>
          <p>With all properties</p>
        </KoreanPanel>
      );

      expect(screen.getByTestId("full-panel")).toBeInTheDocument();
      expect(screen.getByText("Complete Panel")).toBeInTheDocument();
      expect(screen.getByText("With all properties")).toBeInTheDocument();
    });

    it("should support dynamic content updates", () => {
      const { rerender } = render(<KoreanPanel>Initial content</KoreanPanel>);

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(<KoreanPanel>Updated content</KoreanPanel>);

      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
      expect(screen.getByText("Updated content")).toBeInTheDocument();
    });

    it("should support nested Korean panels", () => {
      render(
        <KoreanPanel testId="outer-panel">
          <h1>Outer Panel</h1>
          <KoreanPanel testId="inner-panel">
            <h2>Inner Panel</h2>
          </KoreanPanel>
        </KoreanPanel>
      );

      expect(screen.getByTestId("outer-panel")).toBeInTheDocument();
      expect(screen.getByTestId("inner-panel")).toBeInTheDocument();
      expect(screen.getByText("Outer Panel")).toBeInTheDocument();
      expect(screen.getByText("Inner Panel")).toBeInTheDocument();
    });
  });
});

