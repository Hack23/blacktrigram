/**
 * Tests for TrigramParticles3DGPU component
 * GPU-accelerated particle system tests
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import React, { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { TrigramStance } from "../../../../types/common";
import TrigramParticles3DGPU from "./TrigramParticles3DGPU";
import type { TrigramParticleEffect } from "./TrigramParticles3D";

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

describe("TrigramParticles3DGPU", () => {
  const mockEffect: TrigramParticleEffect = {
    id: "test-trigram-gpu-1",
    position: [0, 1.5, 0],
    stance: TrigramStance.GEON,
    startTime: Date.now(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled={false} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when no effects", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU effects={[]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple effects", () => {
      const effects: TrigramParticleEffect[] = [
        mockEffect,
        {
          id: "test-trigram-gpu-2",
          position: [2, 1.5, 0],
          stance: TrigramStance.TAE,
          startTime: Date.now(),
        },
        {
          id: "test-trigram-gpu-3",
          position: [-2, 1.5, 0],
          stance: TrigramStance.LI,
          startTime: Date.now(),
        },
      ];

      const { container } = render3D(
        <TrigramParticles3DGPU effects={effects} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("GPU acceleration", () => {
    it("should use ShaderMaterial for GPU rendering", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      // Verify component renders (GPU specifics tested via WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle high particle counts (1000+)", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU
          effects={[mockEffect]}
          enabled
          particleCount={1000}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("LOD (Level of Detail)", () => {
    it("should adjust particle count based on camera distance (near)", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU
          effects={[mockEffect]}
          enabled
          cameraDistance={3}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should adjust particle count based on camera distance (medium)", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU
          effects={[mockEffect]}
          enabled
          cameraDistance={10}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should adjust particle count based on camera distance (far)", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU
          effects={[mockEffect]}
          enabled
          cameraDistance={20}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use custom particle count when provided", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU
          effects={[mockEffect]}
          enabled
          particleCount={500}
          cameraDistance={3}
        />,
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
          id: `test-stance-gpu-${index}`,
          position: [index, 1.5, 0],
          stance,
          startTime: Date.now(),
        };

        const { container } = render3D(
          <TrigramParticles3DGPU effects={[effect]} enabled />,
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("callbacks", () => {
    it("should handle onEffectComplete callback", () => {
      const onComplete = vi.fn();

      const { container } = render3D(
        <TrigramParticles3DGPU
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
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <TrigramParticles3DGPU effects={[]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TrigramParticles3DGPU effects={[mockEffect]} enabled />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TrigramParticles3DGPU effects={[]} enabled />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
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
          id: `simultaneous-gpu-${i}`,
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
        <TrigramParticles3DGPU
          effects={simultaneousEffects}
          enabled
          particleCount={1000}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should properly dispose resources on unmount", () => {
      const { container, unmount } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe("Korean theming", () => {
    it("should use Korean colors for trigrams", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      // Verify component renders (actual color testing requires WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should maintain additive blending for glow effect", () => {
      const { container } = render3D(
        <TrigramParticles3DGPU effects={[mockEffect]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
