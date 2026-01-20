/**
 * Unit tests for TrainingScreen3D component
 * Tests the Three.js-based training screen with 3D dummy and HUD overlays
 *
 * @korean TrainingScreen3D 단위 테스트 - 3D 훈련용 더미와 HUD 오버레이 테스트
 */

import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../types/common";
import { TrainingScreen3D } from "./TrainingScreen3D";

// Cleanup after each test to prevent memory leaks and state pollution
afterEach(() => {
  cleanup();
});

// Mock AudioProvider
vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    isInitialized: true,
    isAudioReady: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
    setSFXVolume: vi.fn(),
    setMusicVolume: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
  }),
}));

// Mock Three.js Canvas and related components
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    gl: {},
    scene: {},
    camera: {},
  }),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
  OrbitControls: () => null,
  Environment: () => null,
  Text: ({ children }: { children: React.ReactNode }) => (
    <mesh>{children}</mesh>
  ),
  PerspectiveCamera: () => null,
}));

// Mock @react-three/postprocessing
vi.mock("@react-three/postprocessing", () => ({
  EffectComposer: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  Bloom: () => null,
  SSAO: () => null,
  Vignette: () => null,
  ChromaticAberration: () => null,
  Noise: () => null,
}));

// Mock Three.js
vi.mock("three", () => ({
  Group: class MockGroup {},
  Mesh: class MockMesh {},
  Vector3: class MockVector3 {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0,
    ) {}
    clone() {
      return new MockVector3(this.x, this.y, this.z);
    }
    add(v: MockVector3) {
      return new MockVector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v: MockVector3) {
      return new MockVector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    toArray() {
      return [this.x, this.y, this.z];
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
      const len = this.length();
      if (len > 0) {
        return new MockVector3(this.x / len, this.y / len, this.z / len);
      }
      return new MockVector3(0, 0, 0);
    }
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    copy(v: MockVector3) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
    multiplyScalar(scalar: number) {
      return new MockVector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    distanceTo(v: MockVector3) {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      const dz = this.z - v.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  },
  Matrix4: class MockMatrix4 {
    elements = new Array(16).fill(0);
    identity() {
      return this;
    }
    copy() {
      return this;
    }
    multiply() {
      return this;
    }
    decompose() {
      return this;
    }
    makeRotationFromEuler() {
      return this;
    }
  },
  Euler: class MockEuler {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0,
      public order = "XYZ",
    ) {}
    clone() {
      return new MockEuler(this.x, this.y, this.z, this.order);
    }
    copy(e: MockEuler) {
      this.x = e.x;
      this.y = e.y;
      this.z = e.z;
      this.order = e.order;
      return this;
    }
    toArray() {
      return [this.x, this.y, this.z, this.order];
    }
    setFromQuaternion(_q: { x: number; y: number; z: number; w: number }) {
      return this;
    }
  },
  Quaternion: class MockQuaternion {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0,
      public w = 1,
    ) {}
    setFromEuler(_e: { x: number; y: number; z: number; order?: string }) {
      return this;
    }
    slerpQuaternions(
      _qa: { x: number; y: number; z: number; w: number },
      _qb: { x: number; y: number; z: number; w: number },
      _t: number,
    ) {
      return this;
    }
    setFromUnitVectors(
      _vFrom: { x: number; y: number; z: number },
      _vTo: { x: number; y: number; z: number },
    ) {
      return this;
    }
  },
  Raycaster: class MockRaycaster {
    set(
      _origin: { x: number; y: number; z: number },
      _direction: { x: number; y: number; z: number },
    ) {
      return this;
    }
    intersectObject(_object: object) {
      return [];
    }
    far = 1000;
  },
  MeshStandardMaterial: class MockMeshStandardMaterial {
    dispose() {}
  },
  MeshPhysicalMaterial: class MockMeshPhysicalMaterial {
    dispose() {}
  },
  MeshBasicMaterial: class MockMeshBasicMaterial {
    dispose() {}
  },
  DoubleSide: 2,
  Color: class MockColor {
    constructor(public color?: number | string) {}
  },
  BufferAttribute: class MockBufferAttribute {},
  AdditiveBlending: 1,
  Fog: class MockFog {
    constructor(
      public color: number,
      public near: number,
      public far: number,
    ) {}
  },
  BoxGeometry: class MockBoxGeometry {
    dispose() {}
  },
  SphereGeometry: class MockSphereGeometry {
    dispose() {}
  },
  CapsuleGeometry: class MockCapsuleGeometry {
    dispose() {}
  },
  CylinderGeometry: class MockCylinderGeometry {
    dispose() {}
  },
  RingGeometry: class MockRingGeometry {
    dispose() {}
  },
  PlaneGeometry: class MockPlaneGeometry {
    dispose() {}
  },
  CircleGeometry: class MockCircleGeometry {
    dispose() {}
  },
  TorusGeometry: class MockTorusGeometry {
    dispose() {}
  },
  BufferGeometry: class MockBufferGeometry {
    attributes: Record<string, unknown> = {};
    setAttribute(name: string, attribute: unknown) {
      this.attributes[name] = attribute;
      return this;
    }
    getAttribute(name: string) {
      return this.attributes[name];
    }
    dispose() {}
  },
  Float32BufferAttribute: class MockFloat32BufferAttribute {},
  Points: class MockPoints {},
  PointsMaterial: class MockPointsMaterial {
    dispose() {}
  },
  Clock: class MockClock {
    elapsedTime = 0;
    getElapsedTime() {
      return this.elapsedTime;
    }
  },
  FrontSide: 0,
  BackSide: 1,
  MathUtils: {
    lerp: (a: number, b: number, t: number) => a + (b - a) * t,
    clamp: (val: number, min: number, max: number) =>
      Math.max(min, Math.min(max, val)),
    degToRad: (deg: number) => (deg * Math.PI) / 180,
    radToDeg: (rad: number) => (rad * 180) / Math.PI,
  },
}));

describe("TrainingScreen3D", () => {
  let mockOnPlayerUpdate: (updates: Partial<unknown>) => void;
  let mockOnReturnToMenu: () => void;

  beforeEach(() => {
    mockOnPlayerUpdate = vi.fn();
    mockOnReturnToMenu = vi.fn();
  });

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      expect(container).toBeTruthy();
    });

    it("should render Three.js canvas", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
    });

    it("should render training screen container", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });

    it("should render HUD overlay outside Canvas", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      // UI overlay is now outside Canvas in absolute-positioned div
      expect(screen.getByTestId("training-hud-overlay")).toBeInTheDocument();
    });
  });

  describe("Dimensions", () => {
    it("should render with custom dimensions", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          width={1920}
          height={1080}
        />,
      );

      const screenDiv = container.querySelector(
        '[data-testid="training-screen-3d"]',
      );
      expect(screenDiv).toHaveStyle({ width: "1920px", height: "1080px" });
    });

    it("should render with default dimensions", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      const screenDiv = container.querySelector(
        '[data-testid="training-screen-3d"]',
      );
      expect(screenDiv).toHaveStyle({ width: "1200px", height: "800px" });
    });

    it("should render with mobile dimensions", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          width={375}
          height={667}
        />,
      );

      const screenDiv = container.querySelector(
        '[data-testid="training-screen-3d"]',
      );
      expect(screenDiv).toHaveStyle({ width: "375px", height: "667px" });
    });
  });

  describe("Archetype Selection", () => {
    it("should render with default MUSA archetype", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });

    it("should render with AMSALJA archetype", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          initialArchetype={PlayerArchetype.AMSALJA}
        />,
      );

      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });

    it("should render with HACKER archetype", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          initialArchetype={PlayerArchetype.HACKER}
        />,
      );

      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });

    it("should render with all archetypes", () => {
      const archetypes = Object.values(PlayerArchetype);

      archetypes.forEach((archetype) => {
        const { unmount } = render(
          <TrainingScreen3D
            onPlayerUpdate={mockOnPlayerUpdate}
            onReturnToMenu={mockOnReturnToMenu}
            initialArchetype={archetype}
          />,
        );

        expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("UI Components", () => {
    it("should render return to menu button", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      expect(screen.getByTestId("return-to-menu-button")).toBeInTheDocument();
    });

    it("should call onReturnToMenu when button is clicked", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      const returnButton = screen.getByTestId("return-to-menu-button");
      fireEvent.click(returnButton);

      expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
    });

    it("should render volume control", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      expect(screen.getByTestId("volume-control")).toBeInTheDocument();
    });
  });

  describe("Training Mode", () => {
    it("should render training mode selector", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      // Check for training mode related elements
      expect(screen.getByTestId("training-hud-overlay")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible return to menu button", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      const returnButton = screen.getByTestId("return-to-menu-button");
      expect(returnButton).toHaveAttribute("aria-label");
    });

    it("should have proper test IDs for key components", () => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />,
      );

      // Verify essential test IDs exist
      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      expect(screen.getByTestId("training-hud-overlay")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should render correctly at desktop resolution", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          width={1920}
          height={1080}
        />,
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });

    it("should render correctly at tablet resolution", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          width={768}
          height={1024}
        />,
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });

    it("should render correctly at mobile resolution", () => {
      const { container } = render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
          width={375}
          height={812}
        />,
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId("training-screen-3d")).toBeInTheDocument();
    });
  });
});
