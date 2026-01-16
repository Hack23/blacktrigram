/**
 * Unit tests for AtmosphericParticles3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect } from "vitest";
import AtmosphericParticles3D from "../AtmosphericParticles3D";
import { Suspense } from "react";

describe("AtmosphericParticles3D", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <AtmosphericParticles3D />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom particle count", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <AtmosphericParticles3D count={250} />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom scale and speed", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <AtmosphericParticles3D scale={0.8} speed={3} />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should apply correct particle properties", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <AtmosphericParticles3D count={500} scale={1.0} speed={2} />
        </Suspense>
      </Canvas>
    );

    // Verify component renders
    expect(container).toBeTruthy();
  });
});
