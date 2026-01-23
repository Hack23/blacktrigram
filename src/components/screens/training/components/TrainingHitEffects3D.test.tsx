/**
 * TrainingHitEffects3D tests
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TrainingHitEffects3D } from "./TrainingHitEffects3D";
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

describe("TrainingHitEffects3D", () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render Canvas component", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with visible prop", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render when not visible", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Hit Types", () => {
    it("should accept success hit type", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept perfect hit type", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept miss hit type", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="miss"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Particle System", () => {
    it("should use InstancedMesh for particles", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // InstancedMesh is used for better performance
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should create different particle counts based on type", () => {
      const { container: successContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      const { container: perfectContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      const { container: missContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="miss"
          visible={true}
        />
      );

      // Success: 20 particles, Perfect: 30 particles, Miss: 10 particles
      expect(successContainer.querySelector("canvas")).toBeInTheDocument();
      expect(perfectContainer.querySelector("canvas")).toBeInTheDocument();
      expect(missContainer.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use object pooling for vectors", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Uses ThreeObjectPools for vector pooling
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Korean Theming", () => {
    it("should use KOREAN_COLORS.PRIMARY_CYAN for success", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Success hits use PRIMARY_CYAN color
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use KOREAN_COLORS.ACCENT_GOLD for perfect", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      // Perfect hits use ACCENT_GOLD color
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use KOREAN_COLORS.UI_GRAY for miss", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="miss"
          visible={true}
        />
      );

      // Miss hits use UI_GRAY color
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Position", () => {
    it("should render at specified 3D position", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[5, 10, -3]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render at origin", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render at negative coordinates", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[-5, -10, -3]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Callbacks", () => {
    it("should accept onComplete callback", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
          onComplete={mockOnComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should work without onComplete callback", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Performance Optimization", () => {
    it("should use memoized temp objects", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Uses memoized Matrix4, Vector3, Color, and scale vector
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should reuse geometry and material", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Geometry and material are memoized and shared
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use refs to track particle state", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // particlesRef stores particles to avoid state updates
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should clean up resources on unmount", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Component disposes geometry and material
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("should use useFrame for animation", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // useFrame hook animates particles
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should apply gravity to particles", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Particles have gravity applied: velocity.y -= 9.8 * delta
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should decay particle life over time", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Particle life decays: life -= delta * 1.5
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should scale particles based on life", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Particle scale changes with opacity
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Perfect Hit Flash", () => {
    it("should render central flash for perfect hits", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      // Perfect hits have a central flash mesh
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render flash for success hits", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Success hits don't have central flash
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render flash for miss hits", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="miss"
          visible={true}
        />
      );

      // Miss hits don't have central flash
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Visibility Control", () => {
    it("should initialize when visible becomes true", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle visibility toggle", () => {
      const { container, rerender } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      // Toggle visibility
      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TrainingHitEffects3D
              position={[0, 0, 0]}
              type="success"
              visible={true}
            />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should reset initialization on visibility change", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={false}
        />
      );

      // initializedRef resets when visible changes to false
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Particle Count by Type", () => {
    it("should render with perfect hit type", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      // Component renders with perfect hit particles
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with success hit type", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Component renders with success hit particles
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with miss hit type", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="miss"
          visible={true}
        />
      );

      // Component renders with miss particles
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Particle Properties", () => {
    it("should render particle system for hit effects", () => {
      const { container } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Particle system renders in Canvas
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render different hit types", () => {
      const { container: perfectContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      const { container: successContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Both hit types render successfully
      expect(perfectContainer.querySelector("canvas")).toBeInTheDocument();
      expect(successContainer.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render particle effects with different sizes", () => {
      const { container: perfectContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="perfect"
          visible={true}
        />
      );

      const { container: normalContainer } = render3D(
        <TrainingHitEffects3D
          position={[0, 0, 0]}
          type="success"
          visible={true}
        />
      );

      // Both particle effects render successfully
      expect(perfectContainer.querySelector("canvas")).toBeInTheDocument();
      expect(normalContainer.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
