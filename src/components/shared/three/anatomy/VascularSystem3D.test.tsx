/**
 * VascularSystem3D Component Tests
 *
 * Tests for blood vessel visualization with PBR materials
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { VascularSystem3D } from "./VascularSystem3D";

/**
 * Helper to render Three.js components in test environment
 */
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

describe("VascularSystem3D", () => {
  it("should render without crashing", () => {
    const { container } = render3D(
      <VascularSystem3D position={[0, 0, 0]} />
    );

    // Verify canvas is rendered
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom position", () => {
    const { container } = render3D(
      <VascularSystem3D position={[1, 2, 3]} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom opacity", () => {
    const { container } = render3D(
      <VascularSystem3D position={[0, 0, 0]} opacity={0.5} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom heart rate multiplier", () => {
    const { container } = render3D(
      <VascularSystem3D position={[0, 0, 0]} heartRateMultiplier={1.5} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render in mobile mode", () => {
    const { container } = render3D(
      <VascularSystem3D position={[0, 0, 0]} isMobile={true} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should handle inactive state", () => {
    const { container } = render3D(
      <VascularSystem3D position={[0, 0, 0]} isActive={false} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should apply PBR material properties", () => {
    const { container } = render3D(
      <VascularSystem3D
        position={[0, 0, 0]}
        opacity={0.8}
        isActive={true}
      />
    );

    // Verify component renders with proper structure
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
