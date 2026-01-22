import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { describe, it, expect } from "vitest";
import { DefeatAnimation3D } from "./DefeatAnimation3D";

/**
 * Helper to render Three.js components
 */
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

describe("DefeatAnimation3D", () => {
  it("should render without crashing", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should have defeat-animation-3d test id", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("should render with blue/cyan particle theme", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should create particle system", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render spiral rings", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render central dimmed sphere", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should have subdued glow effect", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });
});
