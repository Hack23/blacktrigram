/**
 * Tests for BasePanel component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BasePanel } from "./BasePanel";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("BasePanel", () => {
  it("should be defined and importable", () => {
    expect(BasePanel).toBeDefined();
    expect(typeof BasePanel).toBe("function");
  });

  it("should have proper display name", () => {
    expect(BasePanel.displayName).toBe("BasePanel");
  });

  it("should render children content", () => {
    render(
      <BasePanel>
        <div>Test Content</div>
      </BasePanel>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render with custom test ID", () => {
    render(
      <BasePanel testId="custom-panel">
        <div>Content</div>
      </BasePanel>
    );

    expect(screen.getByTestId("custom-panel")).toBeInTheDocument();
  });

  it("should render with default test ID when not provided", () => {
    render(
      <BasePanel>
        <div>Content</div>
      </BasePanel>
    );

    expect(screen.getByTestId("base-panel")).toBeInTheDocument();
  });

  it("should render with default variant", () => {
    render(
      <BasePanel variant="default">
        <div>Default Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toBeInTheDocument();
  });

  it("should render with bordered variant", () => {
    render(
      <BasePanel variant="bordered">
        <div>Bordered Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toBeInTheDocument();
  });

  it("should render with elevated variant", () => {
    render(
      <BasePanel variant="elevated">
        <div>Elevated Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toBeInTheDocument();
  });

  it("should render with custom width", () => {
    render(
      <BasePanel width={500}>
        <div>Wide Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toHaveStyle({ width: "500px" });
  });

  it("should render with custom height", () => {
    render(
      <BasePanel height={300}>
        <div>Tall Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toHaveStyle({ height: "300px" });
  });

  it("should render with custom padding", () => {
    render(
      <BasePanel padding={24}>
        <div>Padded Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toHaveStyle({ padding: "24px" });
  });

  it("should render with string width", () => {
    render(
      <BasePanel width="50%">
        <div>Half Width</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toHaveStyle({ width: "50%" });
  });

  it("should render for mobile", () => {
    render(
      <BasePanel isMobile={true}>
        <div>Mobile Panel</div>
      </BasePanel>
    );

    const panel = screen.getByTestId("base-panel");
    expect(panel).toBeInTheDocument();
  });

  it("should render nested content", () => {
    render(
      <BasePanel>
        <div>
          <h1>Title</h1>
          <p>Description</p>
        </div>
      </BasePanel>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
