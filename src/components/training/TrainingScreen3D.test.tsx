/**
 * Unit tests for TrainingScreen3D component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TrainingScreen3D from "./TrainingScreen3D";
import { PlayerState } from "../../systems";
import { PlayerArchetype, TrigramStance } from "../../types/common";
import { createPlayerFromArchetype } from "../../utils/playerUtils";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

// Mock audio provider
vi.mock("../../audio/AudioProvider", () => ({
  useAudio: () => ({
    playSFX: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
    stopMusic: vi.fn(),
  }),
}));

// Mock input system
vi.mock("../../utils/inputSystem", () => ({
  usePlayerMovement: () => ({
    playerPosition: { x: 0, y: 0 },
    isMoving: false,
  }),
}));

describe("TrainingScreen3D", () => {
  const mockPlayer: PlayerState = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

  const defaultProps = {
    player: mockPlayer,
    onPlayerUpdate: vi.fn(),
    onReturnToMenu: vi.fn(),
    width: 1200,
    height: 800,
  };

  it("should render without crashing", () => {
    const { container } = render(<TrainingScreen3D {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it("should render Three.js Canvas", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("three-canvas")).toBeInTheDocument();
  });

  it("should render Html overlays", () => {
    const { getAllByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    const htmlOverlays = getAllByTestId("html-overlay");
    expect(htmlOverlays.length).toBeGreaterThan(0);
  });

  it("should render training controls", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("training-controls-html")).toBeInTheDocument();
  });

  it("should render training stats", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("training-stats-html")).toBeInTheDocument();
  });

  it("should render vital point panel", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("vital-point-training-html")).toBeInTheDocument();
  });

  it("should render mode selector", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("training-mode-selector-html")).toBeInTheDocument();
  });

  it("should handle mobile responsively", () => {
    const { container } = render(
      <TrainingScreen3D {...defaultProps} width={400} height={600} />
    );
    expect(container).toBeTruthy();
  });

  it("should handle custom dimensions", () => {
    const { container } = render(
      <TrainingScreen3D {...defaultProps} width={1920} height={1080} />
    );
    expect(container).toBeTruthy();
  });
});
