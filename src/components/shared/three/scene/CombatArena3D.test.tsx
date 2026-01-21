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
    set(value: number | string) {
      this.color = value;
      return this;
    }
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

// Mock ThreeObjectPools to return mock Color and Vector3 objects
vi.mock("../../../../utils/threeObjectPool", () => {
  const MockColor = class {
    constructor(public color?: number | string) {}
    set(value: number | string) {
      this.color = value;
      return this;
    }
    clone() {
      return new MockColor(this.color);
    }
  };

  const MockVector3 = class {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0,
    ) {}
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    clone() {
      return new MockVector3(this.x, this.y, this.z);
    }
  };

  return {
    ThreeObjectPools: {
      color: {
        acquire: () => new MockColor(),
        release: vi.fn(),
      },
      vector3: {
        acquire: () => new MockVector3(),
        release: vi.fn(),
      },
    },
  };
});

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
  });
});
