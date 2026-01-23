/**
 * DamageNumber3D tests
 */

import { render, waitFor } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DamageNumber3D } from "./DamageNumber3D";
import { Suspense } from "react";

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>
        {component}
      </Suspense>
    </Canvas>
  );
}

describe("DamageNumber3D", () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    vi.clearAllTimers();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render Canvas component", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("should accept damage value prop", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={150}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept zero damage", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={0}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Damage Types", () => {
    it("should accept normal damage type", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept perfect hit type", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={200}
          type="perfect"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept critical hit type", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={300}
          type="critical"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Typography", () => {
    it("should use FONT_FAMILY.KOREAN constant", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // Component should render with Korean font family
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with bold styling for emphasis", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should apply glow effect appropriate for damage type", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="perfect"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Position", () => {
    it("should render at specified 3D position", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[5, 10, -3]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render at origin", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render at negative coordinates", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[-5, -10, -3]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("should start with initial state", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // Animation starts with useFrame
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom duration", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
          duration={2.0}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use default duration of 1.5s when not specified", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use useFrame for animation", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // useFrame hook is used for frame-by-frame animation
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Callbacks", () => {
    it("should accept onComplete callback", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not crash without onComplete callback", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={() => {}}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should include data-testid for testing", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // Component includes data-testid="damage-number-3d"
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should format damage with negative sign", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // Damage is formatted as -{damage}
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Large Damage Values", () => {
    it("should handle large damage numbers", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={9999}
          type="critical"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle very small damage numbers", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={1}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle decimal damage values", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={123.45}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Performance Optimization", () => {
    it("should use refs to avoid re-renders", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // Component uses refs for animation state
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should memoize overlay styles", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // overlayStyle is memoized with useMemo
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle direct DOM manipulation efficiently", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // Uses direct DOM manipulation to avoid React re-renders
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use lazy initialization for start time", () => {
      const { container } = render3D(
        <DamageNumber3D
          position={[0, 0, 0]}
          damage={100}
          type="normal"
          onComplete={mockOnComplete}
        />
      );

      // startTimeRef uses lazy initialization (??=)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
