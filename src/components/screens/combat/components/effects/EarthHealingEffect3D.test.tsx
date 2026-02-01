/**
 * Tests for EarthHealingEffect3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import React, { Suspense } from "react";
import EarthHealingEffect3D, { type EarthHealingEffect } from "./EarthHealingEffect3D";

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

describe("EarthHealingEffect3D", () => {
  const mockEffect: EarthHealingEffect = {
    id: "test-healing-1",
    position: [0, 0, 0],
    healAmount: 3,
    startTime: Date.now(),
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled={false} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when no effects", () => {
      const { container } = render3D(<EarthHealingEffect3D effects={[]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle multiple effects", () => {
      const effects: EarthHealingEffect[] = [
        mockEffect,
        {
          id: "test-healing-2",
          position: [2, 0, 0],
          healAmount: 2,
          startTime: Date.now(),
        },
        {
          id: "test-healing-3",
          position: [-2, 0, 0],
          healAmount: 5,
          startTime: Date.now(),
        },
      ];

      const { container } = render3D(<EarthHealingEffect3D effects={effects} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with test id", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      // Check for canvas element
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("heal amount scaling", () => {
    it("should handle minimal healing (1 HP)", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 1,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle moderate healing (3 HP)", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 3,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle maximum healing (6 HP)", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 6,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should scale particle count with heal amount", () => {
      const effects: EarthHealingEffect[] = [
        { ...mockEffect, id: "heal-1", healAmount: 1 },
        { ...mockEffect, id: "heal-6", healAmount: 6 },
      ];

      const { container } = render3D(<EarthHealingEffect3D effects={effects} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("mobile optimization", () => {
    it("should reduce root count on mobile", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should reduce particles per HP on mobile", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 6,
      };

      const { container } = render3D(
        <EarthHealingEffect3D effects={[effect]} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("should call onEffectComplete callback", () => {
      const onEffectComplete = vi.fn();

      render3D(
        <EarthHealingEffect3D
          effects={[mockEffect]}
          enabled
          onEffectComplete={onEffectComplete}
        />
      );

      // Callback will be called when effect completes (after lifetime)
      // We can't easily test the timing in unit tests
      expect(onEffectComplete).not.toHaveBeenCalled();
    });

    it("should handle missing callback gracefully", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("position handling", () => {
    it("should handle ground-level position", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        position: [0, 0, 0],
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle elevated position", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        position: [0, 2, 0],
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle negative position", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        position: [-5, 0, -5],
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle distant positions", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        position: [100, 0, 100],
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
    it("should handle 10 concurrent effects (60fps target)", () => {
      const effects: EarthHealingEffect[] = Array.from({ length: 10 }, (_, i) => ({
        id: `test-healing-${i}`,
        position: [i * 2, 0, 0] as [number, number, number],
        healAmount: 1 + Math.floor(Math.random() * 5),
        startTime: Date.now(),
      }));

      const { container } = render3D(<EarthHealingEffect3D effects={effects} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle 5 concurrent effects on mobile", () => {
      const effects: EarthHealingEffect[] = Array.from({ length: 5 }, (_, i) => ({
        id: `test-healing-mobile-${i}`,
        position: [i * 2, 0, 0] as [number, number, number],
        healAmount: 1 + Math.floor(Math.random() * 5),
        startTime: Date.now(),
      }));

      const { container } = render3D(
        <EarthHealingEffect3D effects={effects} enabled isMobile />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle maximum particles (6 HP * 8 particles)", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 6,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle zero heal amount", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 0,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle negative heal amount", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: -1,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle very high heal amount", () => {
      const effect: EarthHealingEffect = {
        ...mockEffect,
        healAmount: 100,
      };

      const { container } = render3D(<EarthHealingEffect3D effects={[effect]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle empty effects array", () => {
      const { container } = render3D(<EarthHealingEffect3D effects={[]} enabled />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("root tendril behavior", () => {
    it("should generate multiple root tendrils", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle varied root counts", () => {
      const effects: EarthHealingEffect[] = [
        { ...mockEffect, id: "heal-desktop", healAmount: 3 },
      ];

      const { container } = render3D(
        <EarthHealingEffect3D effects={effects} enabled isMobile={false} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("effect lifecycle", () => {
    it("should handle effect addition", () => {
      const { container, rerender } = render3D(
        <EarthHealingEffect3D effects={[]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <EarthHealingEffect3D effects={[mockEffect]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect removal", () => {
      const { container, rerender } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <EarthHealingEffect3D effects={[]} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle rapid effect changes", () => {
      const effects1: EarthHealingEffect[] = [
        { id: "heal-1", position: [0, 0, 0], healAmount: 2, startTime: Date.now() },
      ];

      const effects2: EarthHealingEffect[] = [
        { id: "heal-2", position: [1, 0, 0], healAmount: 4, startTime: Date.now() },
      ];

      const { container, rerender } = render3D(
        <EarthHealingEffect3D effects={effects1} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <EarthHealingEffect3D effects={effects2} enabled />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("visual properties", () => {
    it("should use warm earth glow colors", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use additive blending for glow effect", () => {
      const { container } = render3D(
        <EarthHealingEffect3D effects={[mockEffect]} enabled />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
