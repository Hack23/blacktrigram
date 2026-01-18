/**
 * Unit tests for TrainingScreen3D component
 * 
 * OPTIMIZED: Reduced test complexity to prevent timeouts
 * Tests are focused on critical functionality only
 */

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TrainingScreen3D from "./TrainingScreen3D";

// Mock Three.js and React Three Fiber - simplified
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    camera: { position: { set: vi.fn() } },
    scene: {},
  }),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
  Environment: () => null,
  Text: () => null,
  PerspectiveCamera: () => null,
  OrbitControls: () => null,
}));

vi.mock("@react-three/postprocessing", () => ({
  EffectComposer: () => null,
  Bloom: () => null,
  SSAO: () => null,
  Vignette: () => null,
  ChromaticAberration: () => null,
  Noise: () => null,
}));

// Mock audio provider
vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    playSFX: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
    stopMusic: vi.fn(),
  }),
}));

// Mock input system
vi.mock("../../../utils/inputSystem", () => ({
  usePlayerMovement: () => ({
    playerPosition: { x: 0, y: 0 },
    isMoving: false,
  }),
}));

// Mock child components to speed up rendering
vi.mock("./components/TrainingDummy3D", () => ({
  default: () => null,
}));

vi.mock("./components/TrainingAICharacter3D", () => ({
  default: () => null,
}));

describe("TrainingScreen3D - Core Functionality", () => {
  const defaultProps = {
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

  it("should render training controls", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("training-controls-html")).toBeInTheDocument();
  });
});

describe("TrainingScreen3D - UI Components", () => {
  const defaultProps = {
    onPlayerUpdate: vi.fn(),
    onReturnToMenu: vi.fn(),
    width: 1200,
    height: 800,
  };

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
});

describe("TrainingScreen3D - Responsive Layout", () => {
  const defaultProps = {
    onPlayerUpdate: vi.fn(),
    onReturnToMenu: vi.fn(),
    width: 1200,
    height: 800,
  };

  it("should handle mobile dimensions", () => {
    const { container } = render(
      <TrainingScreen3D {...defaultProps} width={400} height={600} />
    );
    expect(container).toBeTruthy();
  });

  it("should handle desktop dimensions", () => {
    const { container } = render(
      <TrainingScreen3D {...defaultProps} width={1920} height={1080} />
    );
    expect(container).toBeTruthy();
  });
});

describe("TrainingScreen3D - User Interactions", () => {
  const defaultProps = {
    onPlayerUpdate: vi.fn(),
    onReturnToMenu: vi.fn(),
    width: 1200,
    height: 800,
  };

  it("should render return-to-menu button", () => {
    const { getByTestId } = render(<TrainingScreen3D {...defaultProps} />);
    expect(getByTestId("return-to-menu-button")).toBeInTheDocument();
  });

  it("should call onReturnToMenu when button clicked", () => {
    const mockOnReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <TrainingScreen3D {...defaultProps} onReturnToMenu={mockOnReturnToMenu} />
    );
    const button = getByTestId("return-to-menu-button");
    button.click();
    expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
  });
});
