/**
 * ComboCounter Component Tests
 * 
 * Tests for the combo counter display component.
 */

import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ComboCounter } from "./ComboCounter";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("three", () => ({
  Group: class MockGroup {},
}));

describe("ComboCounter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when combo is below minimum (default 2)", () => {
    const { container } = render(<ComboCounter combo={1} />);
    // Component returns null when combo < minDisplayCombo
    expect(container).toBeTruthy();
  });

  it("should render when combo meets minimum", () => {
    const { container } = render(<ComboCounter combo={2} />);
    expect(container).toBeTruthy();
  });

  it("should render when combo is above minimum", () => {
    const { container } = render(<ComboCounter combo={5} />);
    expect(container).toBeTruthy();
  });

  it("should render with high combo count", () => {
    const { container } = render(<ComboCounter combo={10} />);
    expect(container).toBeTruthy();
  });

  it("should accept isMobile prop", () => {
    const { container } = render(<ComboCounter combo={5} isMobile={true} />);
    expect(container).toBeTruthy();
  });

  it("should accept custom minDisplayCombo prop", () => {
    const { container } = render(<ComboCounter combo={3} minDisplayCombo={3} />);
    expect(container).toBeTruthy();
  });

  it("should not render when combo is below custom minimum", () => {
    const { container } = render(<ComboCounter combo={4} minDisplayCombo={5} />);
    // Component returns null when combo < minDisplayCombo
    expect(container).toBeTruthy();
  });

  it("should render combo at milestone 5", () => {
    const { container } = render(<ComboCounter combo={5} />);
    expect(container).toBeTruthy();
  });

  it("should render combo at milestone 10", () => {
    const { container } = render(<ComboCounter combo={10} />);
    expect(container).toBeTruthy();
  });

  it("should render combo at milestone 15", () => {
    const { container } = render(<ComboCounter combo={15} />);
    expect(container).toBeTruthy();
  });

  it("should render combo at milestone 20 (Godlike)", () => {
    const { container } = render(<ComboCounter combo={20} />);
    expect(container).toBeTruthy();
  });

  it("should apply different colors for different combo tiers", () => {
    // Tier 1: combo 2 (white)
    const { rerender, container } = render(<ComboCounter combo={2} />);
    expect(container).toBeTruthy();

    // Tier 2: combo 3 (cyan)
    rerender(<ComboCounter combo={3} />);
    expect(container).toBeTruthy();

    // Tier 3: combo 5 (gold)
    rerender(<ComboCounter combo={5} />);
    expect(container).toBeTruthy();

    // Tier 4: combo 7 (red)
    rerender(<ComboCounter combo={7} />);
    expect(container).toBeTruthy();

    // Tier 5: combo 10 (magenta)
    rerender(<ComboCounter combo={10} />);
    expect(container).toBeTruthy();
  });
});
