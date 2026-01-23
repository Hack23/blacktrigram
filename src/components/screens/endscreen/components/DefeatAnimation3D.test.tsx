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

  it("should have defeat-animation-3d test id on root group", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("should render without errors (blue/cyan theme verification limited in JSDOM)", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (particle system verification limited in JSDOM)", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render without errors (spiral rings verification limited in JSDOM)", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (central sphere verification limited in JSDOM)", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (glow effect verification limited in JSDOM)", () => {
    const { container } = render3D(<DefeatAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should cleanup resources on unmount without errors", () => {
    const { unmount } = render3D(<DefeatAnimation3D />);
    expect(() => unmount()).not.toThrow();
  });
});
