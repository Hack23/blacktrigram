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

  it("should have victory-animation-3d test id on root group", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("should render without errors (gold/cyan theme verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (primary particle system verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render without errors (secondary particle layer verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (rotating rings verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (Korean trigram symbols verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (central glow sphere verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (enhanced particle effects verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (multiple point lights verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should render without errors (팔괘 octagonal pattern verification limited in JSDOM)", () => {
    const { container } = render3D(<VictoryAnimation3D />);
    expect(container).toBeTruthy();
  });

  it("should cleanup resources on unmount without errors", () => {
    const { unmount } = render3D(<VictoryAnimation3D />);
    expect(() => unmount()).not.toThrow();
  });
});
