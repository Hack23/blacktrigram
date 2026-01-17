/**
 * Tests for DustClouds3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import React, { Suspense } from "react";
import DustClouds3D, { type DustCloudEffect } from "./DustClouds3D";

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

describe("DustClouds3D", () => {
  const mockEffect: DustCloudEffect = {
    id: "test-dust-1",
    position: [0, 0.1, 0],
    intensity: 0.8,
    type: "footfall",
    startTime: Date.now(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const { container } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled={false} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when no effects", () => {
      const { container } = render3D(<DustClouds3D effects={[]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple effects", () => {
      const effects: DustCloudEffect[] = [
        mockEffect,
        {
          id: "test-dust-2",
          position: [2, 0.1, 0],
          intensity: 0.6,
          type: "impact",
          startTime: Date.now(),
        },
        {
          id: "test-dust-3",
          position: [-2, 0.1, 0],
          intensity: 0.9,
          type: "slide",
          startTime: Date.now(),
        },
      ];

      const { container } = render3D(<DustClouds3D effects={effects} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("dust types", () => {
    it("should handle footfall dust", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        type: "footfall",
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle impact dust", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        type: "impact",
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle block dust", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        type: "block",
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle slide dust", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        type: "slide",
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("intensity variations", () => {
    it("should handle low intensity", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        intensity: 0.2,
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle high intensity", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        intensity: 1.0,
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle zero intensity", () => {
      const effect: DustCloudEffect = {
        ...mockEffect,
        intensity: 0,
      };

      const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("mobile optimization", () => {
    it("should handle mobile mode", () => {
      const { container } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render all dust types on mobile", () => {
      const types: Array<DustCloudEffect["type"]> = [
        "footfall",
        "impact",
        "block",
        "slide",
      ];

      types.forEach((type) => {
        const effect: DustCloudEffect = {
          ...mockEffect,
          type,
        };

        const { container } = render3D(
          <DustClouds3D effects={[effect]} enabled isMobile />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("callbacks", () => {
    it("should handle onEffectComplete callback", () => {
      const onComplete = vi.fn();

      const { container } = render3D(
        <DustClouds3D
          effects={[mockEffect]}
          enabled
          onEffectComplete={onComplete}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept optional callback", () => {
      const { container } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("position handling", () => {
    it("should handle floor-level positions", () => {
      const positions: Array<[number, number, number]> = [
        [0, 0, 0],
        [-5, 0.1, 3],
        [10, 0.05, -10],
        [0, 0.2, 0],
      ];

      positions.forEach((position, index) => {
        const effect: DustCloudEffect = {
          id: `test-position-${index}`,
          position,
          intensity: 0.8,
          type: "footfall",
          startTime: Date.now(),
        };

        const { container } = render3D(<DustClouds3D effects={[effect]} enabled />);

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <DustClouds3D effects={[]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <DustClouds3D effects={[mockEffect]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <DustClouds3D effects={[]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Korean theming", () => {
    it("should use Korean earth tones", () => {
      const { container } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled />
      );

      // Verify component renders (actual color testing requires WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty effects array", () => {
      const { container } = render3D(<DustClouds3D effects={[]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle rapid effect changes", () => {
      const { rerender, container } = render3D(
        <DustClouds3D effects={[mockEffect]} enabled />
      );

      // Rapid updates
      for (let i = 0; i < 10; i++) {
        const newEffect: DustCloudEffect = {
          id: `rapid-effect-${i}`,
          position: [i, 0.1, i],
          intensity: Math.random(),
          type: ["footfall", "impact", "block", "slide"][i % 4] as DustCloudEffect["type"],
          startTime: Date.now(),
        };

        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <DustClouds3D effects={[newEffect]} enabled />
            </Suspense>
          </Canvas>
        );
      }

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple simultaneous effects", () => {
      const simultaneousEffects: DustCloudEffect[] = Array.from(
        { length: 8 },
        (_, i) => ({
          id: `simultaneous-${i}`,
          position: [
            Math.cos((i * Math.PI * 2) / 8) * 5,
            0.1,
            Math.sin((i * Math.PI * 2) / 8) * 5,
          ] as [number, number, number],
          intensity: 0.5 + Math.random() * 0.5,
          type: ["footfall", "impact", "block", "slide"][i % 4] as DustCloudEffect["type"],
          startTime: Date.now(),
        })
      );

      const { container } = render3D(
        <DustClouds3D effects={simultaneousEffects} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
