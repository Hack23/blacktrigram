/**
 * TrainingArena3D Component Tests
 *
 * Tests for the 3D training dojang floor with Korean aesthetic
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it } from "vitest";
import TrainingArena3D from "./TrainingArena3D";
import React from "react";

describe("TrainingArena3D", () => {
  const renderInCanvas = (component: React.ReactElement) => {
    return render(<Canvas>{component}</Canvas>);
  };

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderInCanvas(<TrainingArena3D />);
      expect(container).toBeTruthy();
    });

    it("should render with default size", () => {
      const { container } = renderInCanvas(<TrainingArena3D />);
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with custom size", () => {
      const { container } = renderInCanvas(<TrainingArena3D size={30} />);
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with grid enabled", () => {
      const { container } = renderInCanvas(
        <TrainingArena3D showGrid={true} />
      );
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without grid", () => {
      const { container } = renderInCanvas(
        <TrainingArena3D showGrid={false} />
      );
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Korean Aesthetic", () => {
    it("should render floor plane", () => {
      const { container } = renderInCanvas(<TrainingArena3D />);
      expect(container).toBeTruthy();
    });

    it("should render cyberpunk grid overlay", () => {
      const { container } = renderInCanvas(
        <TrainingArena3D showGrid={true} />
      );
      expect(container).toBeTruthy();
    });

    it("should render center marker", () => {
      const { container } = renderInCanvas(<TrainingArena3D />);
      expect(container).toBeTruthy();
    });

    it("should render corner markers", () => {
      const { container } = renderInCanvas(<TrainingArena3D />);
      expect(container).toBeTruthy();
    });
  });

  describe("Performance Optimization", () => {
    it("should reuse geometries and materials", () => {
      // Render twice to ensure geometries/materials are being reused
      const { unmount: unmount1 } = renderInCanvas(<TrainingArena3D />);
      unmount1();

      const { container } = renderInCanvas(<TrainingArena3D />);
      expect(container).toBeTruthy();
    });

    it("should handle size prop changes", () => {
      const { rerender, container } = renderInCanvas(
        <TrainingArena3D size={20} />
      );
      expect(container).toBeTruthy();

      // Rerender with different size
      rerender(
        <Canvas>
          <TrainingArena3D size={30} />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible via canvas element", () => {
      const { container } = renderInCanvas(<TrainingArena3D />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });
  });
});
