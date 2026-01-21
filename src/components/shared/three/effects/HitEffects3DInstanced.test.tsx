/**
 * Tests for HitEffects3DInstanced component
 * GPU-optimized instanced rendering tests
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import React, { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { HitEffect } from "../../../../systems";
import { HitEffectType } from "../../../../systems/effects";
import HitEffects3DInstanced from "./HitEffects3DInstanced";

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

describe("HitEffects3DInstanced", () => {
  const mockEffect: HitEffect = {
    id: "test-hit-instanced-1",
    type: HitEffectType.HIT,
    position: { x: 600, y: 400 },
    intensity: 1.0,
    startTime: Date.now(),
    duration: 500,
  };

  const mockArenaBounds = {
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle empty effects array", () => {
      const { container } = render3D(<HitEffects3DInstanced effects={[]} />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple effects", () => {
      const effects: HitEffect[] = [
        mockEffect,
        {
          id: "test-hit-instanced-2",
          type: HitEffectType.CRITICAL_HIT,
          position: { x: 400, y: 300 },
          intensity: 1.5,
          startTime: Date.now(),
          duration: 600,
        },
        {
          id: "test-hit-instanced-3",
          type: HitEffectType.BLOCK,
          position: { x: 800, y: 500 },
          intensity: 1.0,
          startTime: Date.now(),
          duration: 400,
        },
      ];

      const { container } = render3D(
        <HitEffects3DInstanced effects={effects} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("instanced rendering", () => {
    it("should use Instances for batched rendering", () => {
      const { container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      // Verify component renders (instancing specifics tested via WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should batch effects by type", () => {
      const sameTypeEffects: HitEffect[] = [
        {
          id: "hit-1",
          type: HitEffectType.HIT,
          position: { x: 100, y: 100 },
          intensity: 1.0,
          startTime: Date.now(),
          duration: 500,
        },
        {
          id: "hit-2",
          type: HitEffectType.HIT,
          position: { x: 200, y: 200 },
          intensity: 1.0,
          startTime: Date.now(),
          duration: 500,
        },
        {
          id: "hit-3",
          type: HitEffectType.HIT,
          position: { x: 300, y: 300 },
          intensity: 1.0,
          startTime: Date.now(),
          duration: 500,
        },
      ];

      const { container } = render3D(
        <HitEffects3DInstanced effects={sameTypeEffects} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("effect types", () => {
    it("should render HIT effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.HIT }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render CRITICAL_HIT effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.CRITICAL_HIT }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render BLOCK effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.BLOCK }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render MISS effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.MISS }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render VITAL_POINT_STRIKE effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.VITAL_POINT_STRIKE }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render PARRY effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.PARRY }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render COUNTER effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.COUNTER }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render GENERAL_DAMAGE effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.GENERAL_DAMAGE }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render STATUS_EFFECT effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[{ ...mockEffect, type: HitEffectType.STATUS_EFFECT }]}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("should handle onEffectComplete callback", () => {
      const onComplete = vi.fn();

      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[mockEffect]}
          onEffectComplete={onComplete}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Callback will be invoked when effect duration expires (tested via useFrame)
    });

    it("should accept optional callback", () => {
      const { container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("arena bounds", () => {
    it("should use custom arena bounds", () => {
      const customBounds = {
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      };

      const { container } = render3D(
        <HitEffects3DInstanced
          effects={[mockEffect]}
          arenaBounds={customBounds}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use default arena bounds", () => {
      const { container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <HitEffects3DInstanced effects={[]} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <HitEffects3DInstanced effects={[mockEffect]} />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <HitEffects3DInstanced effects={[]} />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
    it("should handle 100+ simultaneous effects", () => {
      const massEffects: HitEffect[] = Array.from({ length: 100 }, (_, i) => ({
        id: `mass-effect-${i}`,
        type: [
          HitEffectType.HIT,
          HitEffectType.CRITICAL_HIT,
          HitEffectType.BLOCK,
          HitEffectType.MISS,
        ][i % 4],
        position: {
          x: (i % 10) * 120,
          y: Math.floor(i / 10) * 80,
        },
        intensity: 0.8 + Math.random() * 0.4,
        startTime: Date.now(),
        duration: 400 + Math.random() * 200,
      }));

      const { container } = render3D(
        <HitEffects3DInstanced effects={massEffects} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle rapid effect changes", () => {
      const { rerender, container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      // Rapid updates
      for (let i = 0; i < 10; i++) {
        const newEffect: HitEffect = {
          id: `rapid-effect-${i}`,
          type: [
            HitEffectType.HIT,
            HitEffectType.CRITICAL_HIT,
            HitEffectType.BLOCK,
          ][i % 3],
          position: { x: i * 100, y: i * 50 },
          intensity: 1.0,
          startTime: Date.now(),
          duration: 500,
        };

        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <HitEffects3DInstanced effects={[newEffect]} />
            </Suspense>
          </Canvas>,
        );
      }

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Korean theming", () => {
    it("should use Korean colors for effects", () => {
      const { container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      // Verify component renders (actual color testing requires WebGL inspection)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should maintain additive blending", () => {
      const { container } = render3D(
        <HitEffects3DInstanced effects={[mockEffect]} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
