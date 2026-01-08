/**
 * Tests for TrainingAICharacter3D component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TrainingAICharacter3D } from "./TrainingAICharacter3D";
import { TrigramStance } from "../../../../../types/common";

// Mock React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

describe("TrainingAICharacter3D", () => {
  const defaultProps = {
    position: [5, 0, 0] as [number, number, number],
    stance: TrigramStance.GEON,
  };

  it("should render without crashing", () => {
    const { container } = render(<TrainingAICharacter3D {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it("should render at specified position", () => {
    const { container } = render(
      <TrainingAICharacter3D {...defaultProps} position={[10, 2, 5]} />
    );
    expect(container).toBeTruthy();
  });

  it("should render with different stances", () => {
    const { container } = render(
      <TrainingAICharacter3D {...defaultProps} stance={TrigramStance.GAM} />
    );
    expect(container).toBeTruthy();
  });

  it("should render with attacking state", () => {
    const { container } = render(
      <TrainingAICharacter3D
        {...defaultProps}
        stance={TrigramStance.JIN}
        isAttacking={true}
      />
    );
    expect(container).toBeTruthy();
  });

  it("should render with health indicator", () => {
    const { container } = render(
      <TrainingAICharacter3D
        {...defaultProps}
        stance={TrigramStance.LI}
        healthPercent={0.5}
      />
    );
    expect(container).toBeTruthy();
  });

  it("should render with low health", () => {
    const { container } = render(
      <TrainingAICharacter3D
        {...defaultProps}
        healthPercent={0.2}
      />
    );
    expect(container).toBeTruthy();
  });
});
