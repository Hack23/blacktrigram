/**
 * Unit tests for TrainingDummy3D component
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import TrainingDummy3D from "./TrainingDummy3D";

// Mock React Three Fiber hooks
vi.mock("@react-three/fiber", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@react-three/fiber")>();
  return {
    ...actual,
    useFrame: vi.fn(),
  };
});

// Helper to render R3F components within Canvas
const renderWithCanvas = (component: React.ReactElement) => {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>,
  );
};

describe("TrainingDummy3D", () => {
  const defaultProps = {
    position: [0, 0, 0] as [number, number, number],
    selectedVitalPoint: null,
    isTraining: false,
  };

  it("should render without crashing", () => {
    const { container } = renderWithCanvas(
      <TrainingDummy3D {...defaultProps} />,
    );
    expect(container).toBeTruthy();
  });

  it("should render with selected vital point", () => {
    const { container } = renderWithCanvas(
      <TrainingDummy3D {...defaultProps} selectedVitalPoint="baihui" />,
    );
    expect(container).toBeTruthy();
  });

  it("should render when training is active", () => {
    const { container } = renderWithCanvas(
      <TrainingDummy3D {...defaultProps} isTraining={true} />,
    );
    expect(container).toBeTruthy();
  });

  it("should render at custom position", () => {
    const { container } = renderWithCanvas(
      <TrainingDummy3D {...defaultProps} position={[5, 0, 3]} />,
    );
    expect(container).toBeTruthy();
  });
});
