/**
 * Unit tests for TrainingDummy3D component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TrainingDummy3D from "./TrainingDummy3D";

// Mock React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

describe("TrainingDummy3D", () => {
  const defaultProps = {
    position: [0, 0, 0] as [number, number, number],
    selectedVitalPoint: null,
    isTraining: false,
  };

  it("should render without crashing", () => {
    const { container } = render(<TrainingDummy3D {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it("should render with selected vital point", () => {
    const { container } = render(
      <TrainingDummy3D {...defaultProps} selectedVitalPoint="baihui" />
    );
    expect(container).toBeTruthy();
  });

  it("should render when training is active", () => {
    const { container } = render(
      <TrainingDummy3D {...defaultProps} isTraining={true} />
    );
    expect(container).toBeTruthy();
  });

  it("should render at custom position", () => {
    const { container } = render(
      <TrainingDummy3D {...defaultProps} position={[5, 0, 3]} />
    );
    expect(container).toBeTruthy();
  });
});
