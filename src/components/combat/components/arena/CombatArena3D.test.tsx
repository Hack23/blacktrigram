/**
 * Unit tests for CombatArena3D component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CombatArena3D from "./CombatArena3D";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("three", () => ({
  GridHelper: class MockGridHelper {},
  Fog: class MockFog {},
  DoubleSide: 2,
}));

describe("CombatArena3D", () => {
  it("should render without crashing", () => {
    const { container } = render(<CombatArena3D />);

    expect(container).toBeTruthy();
  });

  it("should render with cyberpunk lighting", () => {
    const { container } = render(<CombatArena3D lighting="cyberpunk" />);

    expect(container).toBeTruthy();
  });

  it("should render with traditional lighting", () => {
    const { container } = render(<CombatArena3D lighting="traditional" />);

    expect(container).toBeTruthy();
  });

  it("should render with neutral lighting", () => {
    const { container } = render(<CombatArena3D lighting="neutral" />);

    expect(container).toBeTruthy();
  });

  it("should render with default lighting when not specified", () => {
    const { container } = render(<CombatArena3D />);

    expect(container).toBeTruthy();
  });
});
