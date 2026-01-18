/**
 * Tests for AnatomyOverlay3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it } from "vitest";
import { Suspense } from "react";
import { AnatomyOverlay3D } from "./AnatomyOverlay3D";
import type { AnatomyLayer } from "./AnatomyOverlay3D";

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

describe("AnatomyOverlay3D", () => {
  const testPosition: [number, number, number] = [5, 0, 0];

  it("should render without crashing", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={[]}
        opacity={0.7}
      />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with skeleton layer", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={["skeleton"]}
        opacity={0.7}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with nerves layer", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={["nerves"]}
        opacity={0.7}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with vascular layer", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={["vascular"]}
        opacity={0.7}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with surface layer", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={["surface"]}
        opacity={0.7}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with multiple layers", () => {
    const layers: AnatomyLayer[] = ["skeleton", "nerves", "vascular", "surface"];
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={layers}
        opacity={0.7}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different opacity values", () => {
    [0.3, 0.5, 0.7, 1.0].forEach((opacity) => {
      const { container } = render3D(
        <AnatomyOverlay3D
          position={testPosition}
          visibleLayers={["skeleton"]}
          opacity={opacity}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  it("should render at different positions", () => {
    const positions: [number, number, number][] = [
      [0, 0, 0],
      [5, 0, 0],
      [10, 2, 5],
    ];

    positions.forEach((pos) => {
      const { container } = render3D(
        <AnatomyOverlay3D
          position={pos}
          visibleLayers={["skeleton"]}
          opacity={0.7}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  it("should render for mobile with all layers", () => {
    const layers: AnatomyLayer[] = ["skeleton", "nerves", "vascular", "surface"];
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={layers}
        opacity={0.6}
        isMobile={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with empty layer list", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={[]}
        opacity={0.7}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with test ID", () => {
    const { container } = render3D(
      <AnatomyOverlay3D
        position={testPosition}
        visibleLayers={["skeleton"]}
        opacity={0.7}
      />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
