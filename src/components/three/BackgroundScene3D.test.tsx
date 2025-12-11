/**
 * Tests for shared BackgroundScene3D component
 */

import { Canvas } from "@react-three/fiber";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { BackgroundScene3D } from "./BackgroundScene3D";

// Test wrapper for Three.js components
const TestCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Canvas>
    <React.Suspense fallback={null}>{children}</React.Suspense>
  </Canvas>
);

describe("BackgroundScene3D", () => {
  it("should render without crashing with default props", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with intro theme", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D theme="intro" />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with controls theme", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D theme="controls" />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with philosophy theme", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D theme="philosophy" />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should accept custom grid configuration", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D
          gridSize={60}
          gridDivisions={30}
          gridPositionY={-10}
          gridRotationSpeed={0.001}
        />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should accept custom fog configuration", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D fogNear={3} fogFar={30} />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should accept custom light intensities", () => {
    const { container } = render(
      <TestCanvas>
        <BackgroundScene3D
          ambientIntensity={0.5}
          directionalIntensity={1.2}
          pointIntensity={0.6}
        />
      </TestCanvas>
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
