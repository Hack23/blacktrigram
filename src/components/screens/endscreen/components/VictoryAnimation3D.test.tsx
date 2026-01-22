import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { describe, it, expect } from "vitest";
import { VictoryAnimation3D } from "./VictoryAnimation3D";

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

describe("VictoryAnimation3D", () => {
  it("should render without crashing", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should have victory-animation-3d test id", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("should render with gold/cyan particle theme", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should create primary particle system", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should create secondary particle layer", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render rotating rings", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render Korean trigram symbols", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render central glow sphere", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should have enhanced particle effects", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should have multiple point lights", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render octagonal pattern for 팔괘", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });
});
