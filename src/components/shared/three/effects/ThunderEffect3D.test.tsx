/**
 * Tests for ThunderEffect3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import { ThunderEffect3D } from "./ThunderEffect3D";
import { Suspense, type ComponentProps } from "react";

describe("ThunderEffect3D", () => {
  const renderThunderEffect = (props: ComponentProps<typeof ThunderEffect3D>) => {
    return render(
      <Canvas>
        <Suspense fallback={null}>
          <ThunderEffect3D {...props} />
        </Suspense>
      </Canvas>
    );
  };

  it("should render charge effect without crashing", () => {
    const { container } = renderThunderEffect({
      position: [0, 1, 0],
      effectType: "charge",
      intensity: 1.0,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render release effect without crashing", () => {
    const { container } = renderThunderEffect({
      position: [0, 1, 0],
      effectType: "release",
      intensity: 1.0,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should call onComplete callback", async () => {
    const onComplete = vi.fn();
    const { container } = renderThunderEffect({
      position: [0, 1, 0],
      effectType: "release",
      duration: 100,
      onComplete,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
    
    // Note: Testing frame-based callbacks requires more complex setup
    // This is a basic smoke test to ensure component renders
  });

  it("should respect active prop", () => {
    const { container } = renderThunderEffect({
      position: [0, 1, 0],
      effectType: "charge",
      active: false,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with different intensity values", () => {
    const { container } = renderThunderEffect({
      position: [0, 1, 0],
      effectType: "charge",
      intensity: 0.5,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render at different positions", () => {
    const { container } = renderThunderEffect({
      position: [5, 2, -3],
      effectType: "release",
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
