/**
 * Tests for KoreanPanel component
 * Tests the wrapper's delegation to BasePanel and default testId behavior
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  describe("Wrapper Behavior", () => {
    it("should delegate to BasePanel with default testId", () => {
      render(<KoreanPanel>Test content</KoreanPanel>);

      // Verify default testId is applied
      expect(screen.getByTestId("korean-panel")).toBeInTheDocument();
      
      // Verify BasePanel functionality works
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should use custom testId when provided", () => {
      render(<KoreanPanel testId="custom-panel">Content</KoreanPanel>);

      expect(screen.getByTestId("custom-panel")).toBeInTheDocument();
      expect(screen.queryByTestId("korean-panel")).not.toBeInTheDocument();
    });

    it("should pass all props through to BasePanel", () => {
      render(
        <KoreanPanel
          variant="bordered"
          width={300}
          height={200}
          padding={20}
        >
          Styled content
        </KoreanPanel>
      );

      expect(screen.getByTestId("korean-panel")).toBeInTheDocument();
      expect(screen.getByText("Styled content")).toBeInTheDocument();
    });

    it("should support all BasePanel variants", () => {
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

  describe("Children Handling", () => {
    it("should render simple text children", () => {
      render(<KoreanPanel>Simple text</KoreanPanel>);

      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("should render JSX element children", () => {
      render(
        <KoreanPanel>
          <div>JSX element</div>
        </KoreanPanel>
      );

      expect(screen.getByText("JSX element")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <KoreanPanel>
          <div>First</div>
          <div>Second</div>
        </KoreanPanel>
      );

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("should support nested KoreanPanels", () => {
      render(
        <KoreanPanel testId="outer">
          <h1>Outer</h1>
          <KoreanPanel testId="inner">
            <h2>Inner</h2>
          </KoreanPanel>
        </KoreanPanel>
      );

      expect(screen.getByTestId("outer")).toBeInTheDocument();
      expect(screen.getByTestId("inner")).toBeInTheDocument();
      expect(screen.getByText("Outer")).toBeInTheDocument();
      expect(screen.getByText("Inner")).toBeInTheDocument();
    });
  });

  describe("Korean Theming Compatibility", () => {
    it("should work with Korean content", () => {
      render(
        <KoreanPanel>
          <h1>한글 제목</h1>
          <p>한글 설명</p>
        </KoreanPanel>
      );

      expect(screen.getByText("한글 제목")).toBeInTheDocument();
      expect(screen.getByText("한글 설명")).toBeInTheDocument();
    });

    it("should work with bilingual content", () => {
      render(
        <KoreanPanel>
          <span>한글 | English</span>
        </KoreanPanel>
      );

      expect(screen.getByText("한글 | English")).toBeInTheDocument();
    });
  });
});

