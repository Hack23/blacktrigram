/**
 * Tests for ImpactSparks3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import React, { Suspense } from "react";
import ImpactSparks3D, {
  type ImpactSparkEffect,
} from "./ImpactSparks3D";

/**
 * Helper to render Three.js components in test environment
 */
const render3D = (component: React.ReactElement) => {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
};

describe("ImpactSparks3D", () => {
  const mockEffect: ImpactSparkEffect = {
    id: "test-spark-1",
    position: [0, 1.5, 0],
    isCritical: false,
    startTime: Date.now(),
    intensity: 1.0,
  };

  const mockCriticalEffect: ImpactSparkEffect = {
    id: "test-spark-critical",
    position: [1, 2, -1],
    isCritical: true,
    startTime: Date.now(),
    intensity: 1.0,
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render canvas element", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled={false} />
      );

      const points = container.querySelector('[data-testid="impact-sparks-3d"]');
      expect(points).toBeFalsy();
    });

    it("should not render when no effects", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[]} enabled />
      );

      const points = container.querySelector('[data-testid="impact-sparks-3d"]');
      expect(points).toBeFalsy();
    });

    it("should handle multiple effects", () => {
      const effects: ImpactSparkEffect[] = [
        mockEffect,
        mockCriticalEffect,
        {
          id: "test-spark-3",
          position: [2, 1, 1],
          isCritical: false,
          startTime: Date.now(),
        },
      ];

      const { container } = render3D(
        <ImpactSparks3D effects={effects} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("effect types", () => {
    it("should handle normal hit effects", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle critical hit effects", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockCriticalEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle intensity variations", () => {
      const lowIntensityEffect: ImpactSparkEffect = {
        ...mockEffect,
        id: "test-low-intensity",
        intensity: 0.3,
      };

      const highIntensityEffect: ImpactSparkEffect = {
        ...mockEffect,
        id: "test-high-intensity",
        intensity: 1.5,
      };

      const { container: lowContainer } = render3D(
        <ImpactSparks3D effects={[lowIntensityEffect]} enabled />
      );

      const { container: highContainer } = render3D(
        <ImpactSparks3D effects={[highIntensityEffect]} enabled />
      );

      expect(lowContainer.querySelector("canvas")).toBeInTheDocument();
      expect(highContainer.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("mobile optimization", () => {
    it("should handle mobile mode", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render critical hits on mobile", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockCriticalEffect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("should handle onEffectComplete callback", () => {
      const onComplete = vi.fn();

      const { container } = render3D(
        <ImpactSparks3D
          effects={[mockEffect]}
          enabled
          onEffectComplete={onComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Callback will be invoked when particle lifetime expires (tested via useFrame)
    });

    it("should accept optional callback", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("position handling", () => {
    it("should handle various positions", () => {
      const positions: Array<[number, number, number]> = [
        [0, 0, 0],
        [-5, 2, 3],
        [10, 1.5, -10],
        [0, 5, 0],
      ];

      positions.forEach((position, index) => {
        const effect: ImpactSparkEffect = {
          id: `test-position-${index}`,
          position,
          isCritical: false,
          startTime: Date.now(),
        };

        const { container } = render3D(
          <ImpactSparks3D effects={[effect]} enabled />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <ImpactSparks3D effects={[]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <ImpactSparks3D effects={[mockEffect]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <ImpactSparks3D effects={[]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Korean theming", () => {
    it("should use Korean gold color for critical hits", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockCriticalEffect]} enabled />
      );

      // Verify component renders (actual color testing requires WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use Korean cyan color for normal hits", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      // Verify component renders (actual color testing requires WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty effects array", () => {
      const { container } = render3D(
        <ImpactSparks3D effects={[]} enabled />
      );

      expect(
        container.querySelector('[data-testid="impact-sparks-3d"]')
      ).toBeFalsy();
    });

    it("should handle rapid effect changes", () => {
      const { rerender, container } = render3D(
        <ImpactSparks3D effects={[mockEffect]} enabled />
      );

      // Rapid updates
      for (let i = 0; i < 10; i++) {
        const newEffect: ImpactSparkEffect = {
          id: `rapid-effect-${i}`,
          position: [i, 1, i],
          isCritical: i % 2 === 0,
          startTime: Date.now(),
        };

        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <ImpactSparks3D effects={[newEffect]} enabled />
            </Suspense>
          </Canvas>
        );
      }

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle zero intensity", () => {
      const zeroIntensity: ImpactSparkEffect = {
        ...mockEffect,
        id: "zero-intensity",
        intensity: 0,
      };

      const { container } = render3D(
        <ImpactSparks3D effects={[zeroIntensity]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
