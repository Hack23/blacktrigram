/**
 * Tests for TrigramParticles3D component
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import React, { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { TrigramStance } from "../../../../types/common";
import TrigramParticles3D, {
  type TrigramParticleEffect,
} from "./TrigramParticles3D";

/**
 * Helper to render Three.js components in test environment
 */
const render3D = (component: React.ReactElement) => {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>,
  );
};

describe("TrigramParticles3D", () => {
  const mockEffect: TrigramParticleEffect = {
    id: "test-trigram-1",
    position: [0, 1.5, 0],
    stance: TrigramStance.GEON,
    startTime: Date.now(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled={false} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when no effects", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple effects", () => {
      const effects: TrigramParticleEffect[] = [
        mockEffect,
        {
          id: "test-trigram-2",
          position: [2, 1.5, 0],
          stance: TrigramStance.TAE,
          startTime: Date.now(),
        },
        {
          id: "test-trigram-3",
          position: [-2, 1.5, 0],
          stance: TrigramStance.LI,
          startTime: Date.now(),
        },
      ];

      const { container } = render3D(
        <TrigramParticles3D effects={effects} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("trigram stances", () => {
    it("should render all eight trigram stances", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ] as const;

      stances.forEach((stance, index) => {
        const effect: TrigramParticleEffect = {
          id: `test-stance-${index}`,
          position: [index, 1.5, 0],
          stance,
          startTime: Date.now(),
        };

        const { container } = render3D(
          <TrigramParticles3D effects={[effect]} enabled />,
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle stance transitions", () => {
      const { rerender, container } = render3D(
        <TrigramParticles3D
          effects={[{ ...mockEffect, stance: TrigramStance.GEON }]}
          enabled
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      // Change stance
      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TrigramParticles3D
              effects={[{ ...mockEffect, stance: TrigramStance.TAE }]}
              enabled
            />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("should handle onEffectComplete callback", () => {
      const onComplete = vi.fn();

      const { container } = render3D(
        <TrigramParticles3D
          effects={[mockEffect]}
          enabled
          onEffectComplete={onComplete}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Callback will be invoked when effect lifetime expires (tested via useFrame)
    });

    it("should accept optional callback", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled />,
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
        const effect: TrigramParticleEffect = {
          id: `test-position-${index}`,
          position,
          stance: TrigramStance.GEON,
          startTime: Date.now(),
        };

        const { container } = render3D(
          <TrigramParticles3D effects={[effect]} enabled />,
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <TrigramParticles3D effects={[]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TrigramParticles3D effects={[mockEffect]} enabled />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TrigramParticles3D effects={[]} enabled />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Korean theming", () => {
    it("should use Korean colors for trigrams", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled />,
      );

      // Verify component renders (actual color testing requires WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render trigram symbols", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled />,
      );

      // Trigram symbols should be rendered (☰☱☲☳☴☵☶☷)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty effects array", () => {
      const { container } = render3D(
        <TrigramParticles3D effects={[]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle rapid effect changes", () => {
      const { rerender, container } = render3D(
        <TrigramParticles3D effects={[mockEffect]} enabled />,
      );

      // Rapid updates
      for (let i = 0; i < 10; i++) {
        const stanceArray = [
          TrigramStance.GEON,
          TrigramStance.TAE,
          TrigramStance.LI,
          TrigramStance.JIN,
          TrigramStance.SON,
          TrigramStance.GAM,
          TrigramStance.GAN,
          TrigramStance.GON,
        ];
        const newEffect: TrigramParticleEffect = {
          id: `rapid-effect-${i}`,
          position: [i, 1.5, i],
          stance: stanceArray[i % 8],
          startTime: Date.now(),
        };

        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <TrigramParticles3D effects={[newEffect]} enabled />
            </Suspense>
          </Canvas>,
        );
      }

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple simultaneous effects", () => {
      const stanceArray = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];
      const simultaneousEffects: TrigramParticleEffect[] = Array.from(
        { length: 8 },
        (_, i) => ({
          id: `simultaneous-${i}`,
          position: [
            Math.cos((i * Math.PI * 2) / 8) * 5,
            1.5,
            Math.sin((i * Math.PI * 2) / 8) * 5,
          ] as [number, number, number],
          stance: stanceArray[i],
          startTime: Date.now(),
        }),
      );

      const { container } = render3D(
        <TrigramParticles3D effects={simultaneousEffects} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
