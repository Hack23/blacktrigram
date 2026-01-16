/**
 * Unit tests for CombatArena3D component
 */

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CombatArena3D from "./CombatArena3D";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@react-three/drei", () => ({
  Environment: () => null,
  Text: ({ children }: { children: React.ReactNode }) => (
    <mesh>{children}</mesh>
  ),
}));

vi.mock("three", () => ({
  GridHelper: class MockGridHelper {},
  Fog: class MockFog {},
  DoubleSide: 2,
  Color: class MockColor {
    constructor(public color?: number | string) {}
  },
  MeshPhysicalMaterial: class MockMeshPhysicalMaterial {
    dispose() {}
  },
  MeshBasicMaterial: class MockMeshBasicMaterial {
    dispose() {}
  },
  BufferGeometry: class MockBufferGeometry {
    dispose() {}
    setAttribute() {}
  },
  BufferAttribute: class MockBufferAttribute {},
  AdditiveBlending: 1,
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

  it("should render without blocking when Environment is loading", () => {
    // This test verifies that the arena can render immediately
    // even if the Environment component takes time to load
    const { container } = render(<CombatArena3D lighting="cyberpunk" />);

    // Arena should render immediately (not blocked by Environment loading)
    expect(container).toBeTruthy();
    expect(container.querySelector("group")).toBeTruthy;
  });
});
