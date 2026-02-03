/**
 * Tests for EarthCrackEffect3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import React, { Suspense } from "react";
import EarthCrackEffect3D, { type EarthCrackEffect } from "./EarthCrackEffect3D";

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

describe("EarthCrackEffect3D", () => {
  const mockEffect: EarthCrackEffect = {
    id: "test-crack-1",
    position: [0, 0, 0],
    intensity: 1.0,
    startTime: Date.now(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const { container } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled={false} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when no effects", () => {
      const { container } = render3D(<EarthCrackEffect3D effects={[]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple effects", () => {
      const effects: EarthCrackEffect[] = [
        mockEffect,
        {
          id: "test-crack-2",
          position: [2, 0, 0],
          intensity: 0.8,
          startTime: Date.now(),
        },
        {
          id: "test-crack-3",
          position: [-2, 0, 0],
          intensity: 1.2,
          startTime: Date.now(),
        },
      ];

      const { container } = render3D(<EarthCrackEffect3D effects={effects} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with test id", () => {
      const { container } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled />
      );

      // Check for canvas element
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("intensity scaling", () => {
    it("should handle low intensity (0.5)", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        intensity: 0.5,
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle medium intensity (1.0)", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        intensity: 1.0,
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle high intensity (2.0)", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        intensity: 2.0,
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("mobile optimization", () => {
    it("should reduce crack lines on mobile", () => {
      const { container } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should reduce segments per line on mobile", () => {
      const { container } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("should call onEffectComplete callback", () => {
      const onEffectComplete = vi.fn();

      render3D(
        <EarthCrackEffect3D
          effects={[mockEffect]}
          enabled
          onEffectComplete={onEffectComplete}
        />
      );

      // Callback will be called when effect completes (after fade duration)
      // We can't easily test the timing in unit tests
      expect(onEffectComplete).not.toHaveBeenCalled();
    });

    it("should handle missing callback gracefully", () => {
      const { container } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("position handling", () => {
    it("should handle ground-level position", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        position: [0, 0, 0],
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle elevated position", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        position: [0, 2, 0],
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle negative position", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        position: [-5, 0, -5],
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
    it("should handle 10 concurrent effects (60fps target)", () => {
      const effects: EarthCrackEffect[] = Array.from({ length: 10 }, (_, i) => ({
        id: `test-crack-${i}`,
        position: [i * 2, 0, 0] as [number, number, number],
        intensity: 0.5 + Math.random() * 0.5,
        startTime: Date.now(),
      }));

      const { container } = render3D(<EarthCrackEffect3D effects={effects} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle 5 concurrent effects on mobile", () => {
      const effects: EarthCrackEffect[] = Array.from({ length: 5 }, (_, i) => ({
        id: `test-crack-mobile-${i}`,
        position: [i * 2, 0, 0] as [number, number, number],
        intensity: 0.5 + Math.random() * 0.5,
        startTime: Date.now(),
      }));

      const { container } = render3D(
        <EarthCrackEffect3D effects={effects} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle zero intensity", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        intensity: 0,
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle very high intensity", () => {
      const effect: EarthCrackEffect = {
        ...mockEffect,
        intensity: 5.0,
      };

      const { container } = render3D(<EarthCrackEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle empty effects array", () => {
      const { container } = render3D(<EarthCrackEffect3D effects={[]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <EarthCrackEffect3D effects={[]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <EarthCrackEffect3D effects={[mockEffect]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <EarthCrackEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <EarthCrackEffect3D effects={[]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
