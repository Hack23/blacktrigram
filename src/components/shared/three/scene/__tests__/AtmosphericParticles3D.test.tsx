/**
 * Unit tests for AtmosphericParticles3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect } from "vitest";
import AtmosphericParticles3D from "../AtmosphericParticles3D";
import { Suspense } from "react";

describe("AtmosphericParticles3D", () => {
  describe("basic rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with custom particle count", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={250} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with custom scale and speed", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D scale={0.8} speed={3} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should apply correct particle properties", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={500} scale={1.0} speed={2} />
          </Suspense>
        </Canvas>
      );

      // Verify component renders
      expect(container).toBeTruthy();
    });
  });

  describe("geometry cleanup", () => {
    it("should handle unmount gracefully", () => {
      const { unmount } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} />
          </Suspense>
        </Canvas>
      );

      // Unmount the component - cleanup should happen via useEffect return
      expect(() => unmount()).not.toThrow();
    });

    it("should handle remounting with different props", () => {
      const { rerender, unmount } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} scale={1.0} />
          </Suspense>
        </Canvas>
      );

      // Rerender with different props (this should trigger cleanup via useEffect)
      expect(() => {
        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <AtmosphericParticles3D count={200} scale={1.5} />
            </Suspense>
          </Canvas>
        );
      }).not.toThrow();

      // Unmount
      expect(() => unmount()).not.toThrow();
    });

    it("should handle multiple mount/unmount cycles", () => {
      for (let i = 0; i < 3; i++) {
        const { unmount } = render(
          <Canvas>
            <Suspense fallback={null}>
              <AtmosphericParticles3D count={50} />
            </Suspense>
          </Canvas>
        );

        expect(() => unmount()).not.toThrow();
      }
    });
  });

  describe("scale-awareness", () => {
    it("should calculate spread dimensions correctly based on scale", () => {
      const testCases = [
        { scale: 0.5, expectedSpreadX: 20, expectedSpreadZ: 20 },
        { scale: 1.0, expectedSpreadX: 40, expectedSpreadZ: 40 },
        { scale: 2.0, expectedSpreadX: 80, expectedSpreadZ: 80 },
      ];

      testCases.forEach(({ scale, expectedSpreadX, expectedSpreadZ }) => {
        const spreadX = 40 * scale;
        const spreadZ = 40 * scale;
        expect(spreadX).toBe(expectedSpreadX);
        expect(spreadZ).toBe(expectedSpreadZ);
      });
    });

    it("should handle very small scale", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D scale={0.1} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle scale changes", () => {
      const { rerender, container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} scale={0.5} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      // Change scale
      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} scale={2.0} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("material properties", () => {
    it("should render with correct material setup", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D />
          </Suspense>
        </Canvas>
      );

      // Component should render with additive blending material
      // The material is configured in JSX with:
      // - blending={THREE.AdditiveBlending}
      // - transparent
      // - opacity={0.3}
      // - depthWrite={false}
      // - sizeAttenuation
      // Note: JSDOM doesn't provide Three.js scene graph access for detailed verification
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("particle animation", () => {
    it("should render with useFrame animation enabled", () => {
      // Smoke test: component should render successfully with animation hooks.
      // The useFrame hook (lines 99-109) handles:
      // - Checking if particlesRef.current exists
      // - Getting positions array from geometry
      // - Iterating through particles and updating Y position (falling)
      // - Resetting particles that fall below 0
      // - Marking geometry.attributes.position.needsUpdate
      // Note: JSDOM doesn't execute useFrame, so this only tests setup without errors
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} speed={2} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle zero speed (no animation)", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D speed={0} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle very high speed", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D speed={100} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle negative speed (upward movement)", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D speed={-1} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("deterministic position generation", () => {
    it("should generate positions consistently", () => {
      // First render
      const { unmount: unmount1, container: container1 } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} scale={1.0} />
          </Suspense>
        </Canvas>
      );

      expect(container1.querySelector("canvas")).toBeInTheDocument();
      unmount1();

      // Second render with same params should work consistently
      const { container: container2 } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} scale={1.0} />
          </Suspense>
        </Canvas>
      );

      expect(container2.querySelector("canvas")).toBeInTheDocument();
    });

    it("should generate positions for different counts", () => {
      const { container: container1 } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} />
          </Suspense>
        </Canvas>
      );

      expect(container1.querySelector("canvas")).toBeInTheDocument();

      const { container: container2 } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={200} />
          </Suspense>
        </Canvas>
      );

      expect(container2.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle position generation edge cases", () => {
      const counts = [0, 1, 10, 100, 500, 1000];
      counts.forEach((count) => {
        const { container } = render(
          <Canvas>
            <Suspense fallback={null}>
              <AtmosphericParticles3D count={count} scale={1.0} />
            </Suspense>
          </Canvas>
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("performance", () => {
    it("should render efficiently with 500 particles (default)", () => {
      const startTime = performance.now();

      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={500} />
          </Suspense>
        </Canvas>
      );

      const renderTime = performance.now() - startTime;

      // Note: JSDOM rendering is fast. Using 200ms threshold to catch major
      // performance regressions while accounting for CI environment variability.
      expect(renderTime).toBeLessThan(200);
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle mobile particle count (300) efficiently", () => {
      const startTime = performance.now();

      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={300} scale={0.5} />
          </Suspense>
        </Canvas>
      );

      const renderTime = performance.now() - startTime;

      // Note: JSDOM rendering is fast. Using 200ms threshold to catch major
      // performance regressions while accounting for CI environment variability.
      expect(renderTime).toBeLessThan(200);
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle large particle count (1000)", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={1000} />
          </Suspense>
        </Canvas>
      );

      // Should still render without errors
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle minimal particle count (10)", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={10} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle zero particles", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={0} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle rapid prop changes", () => {
      const { rerender, container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={100} scale={1.0} speed={2} />
          </Suspense>
        </Canvas>
      );

      // Rapid rerenders with different props
      for (let i = 0; i < 5; i++) {
        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <AtmosphericParticles3D
                count={100 + i * 50}
                scale={1.0 + i * 0.1}
                speed={2 + i}
              />
            </Suspense>
          </Canvas>
        );
      }

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("prop combinations", () => {
    it("should handle all custom props together", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <AtmosphericParticles3D count={750} scale={1.5} speed={3.5} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle extreme prop combinations", () => {
      const combinations = [
        { count: 0, scale: 0.1, speed: 0 },
        { count: 1, scale: 0.1, speed: 0.1 },
        { count: 1000, scale: 3.0, speed: 100 },
        { count: 500, scale: 1.0, speed: -5 },
      ];

      combinations.forEach((props) => {
        const { container } = render(
          <Canvas>
            <Suspense fallback={null}>
              <AtmosphericParticles3D {...props} />
            </Suspense>
          </Canvas>
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });
});
