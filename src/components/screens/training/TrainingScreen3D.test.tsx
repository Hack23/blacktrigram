import { render, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from "vitest";
import type React from "react";
import TrainingScreen3D from "./TrainingScreen3D";

interface MockCanvasProps {
  readonly children: React.ReactNode;
}

interface MockHtmlProps {
  readonly children: React.ReactNode;
}

interface MockCameraPosition {
  readonly set: Mock<(x: number, y: number, z: number) => void>;
}

interface MockCamera {
  readonly position: MockCameraPosition;
}

interface MockThreeContext {
  readonly camera: MockCamera;
  readonly scene: Record<string, never>;
}

interface MockAudioProvider {
  readonly playSFX: Mock<(id: string, volume?: number) => Promise<void>>;
  readonly fadeIn: Mock<(trackId: string, duration?: number) => Promise<void>>;
  readonly fadeOut: Mock<(duration?: number) => Promise<void>>;
  readonly stopMusic: Mock<() => void>;
}

interface MockPlayerMovement {
  readonly playerPosition: { readonly x: number; readonly y: number };
  readonly isMoving: boolean;
}

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: MockCanvasProps) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: (): MockThreeContext => ({
    camera: { position: { set: vi.fn() } },
    scene: {},
  }),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: MockHtmlProps) => (
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

vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: (): MockAudioProvider => ({
    playSFX: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
    stopMusic: vi.fn(),
  }),
}));

vi.mock("../../../utils/inputSystem", () => ({
  usePlayerMovement: (): MockPlayerMovement => ({
    playerPosition: { x: 0, y: 0 },
    isMoving: false,
  }),
}));

vi.mock("./components/TrainingDummy3D", () => ({
  default: () => null,
}));

vi.mock("./components/TrainingAICharacter3D", () => ({
  default: () => null,
}));

describe("TrainingScreen3D - Core Functionality", () => {
  let mockOnPlayerUpdate: Mock;
  let mockOnReturnToMenu: Mock;

  beforeEach(() => {
    mockOnPlayerUpdate = vi.fn();
    mockOnReturnToMenu = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
  });

  it("should render without crashing", () => {
    const { container } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    expect(container).toBeTruthy();
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render Three.js Canvas", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    const canvas = getByTestId("three-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toBeVisible();
  });

  it("should render training controls", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    expect(getByTestId("training-controls-html")).toBeInTheDocument();
  });

  it("should accept required props", () => {
    expect(() => {
      render(
        <TrainingScreen3D
          onPlayerUpdate={mockOnPlayerUpdate}
          onReturnToMenu={mockOnReturnToMenu}
        />
      );
    }).not.toThrow();
  });

  it("should use default dimensions when not provided", () => {
    const { container } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
      />
    );
    expect(container).toBeTruthy();
  });
});

describe("TrainingScreen3D - UI Components", () => {
  let mockOnPlayerUpdate: Mock;
  let mockOnReturnToMenu: Mock;

  beforeEach(() => {
    mockOnPlayerUpdate = vi.fn();
    mockOnReturnToMenu = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render training stats", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    expect(getByTestId("training-stats-html")).toBeInTheDocument();
  });

  it("should render vital point panel", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    expect(getByTestId("vital-point-training-html")).toBeInTheDocument();
  });

  it("should render mode selector", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    expect(getByTestId("training-mode-selector-html")).toBeInTheDocument();
  });

  it("should render all required UI overlays", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );

    expect(getByTestId("training-stats-html")).toBeInTheDocument();
    expect(getByTestId("vital-point-training-html")).toBeInTheDocument();
    expect(getByTestId("training-mode-selector-html")).toBeInTheDocument();
    expect(getByTestId("training-controls-html")).toBeInTheDocument();
  });
});

describe("TrainingScreen3D - Responsive Layout", () => {
  let mockOnPlayerUpdate: Mock;
  let mockOnReturnToMenu: Mock;

  beforeEach(() => {
    mockOnPlayerUpdate = vi.fn();
    mockOnReturnToMenu = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should handle mobile dimensions", () => {
    const { container } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={400}
        height={600}
      />
    );
    expect(container).toBeTruthy();
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should handle tablet dimensions", () => {
    const { container } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={768}
        height={1024}
      />
    );
    expect(container).toBeTruthy();
  });

  it("should handle desktop dimensions", () => {
    const { container } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1920}
        height={1080}
      />
    );
    expect(container).toBeTruthy();
  });

  it("should handle 4K dimensions", () => {
    const { container } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={3840}
        height={2160}
      />
    );
    expect(container).toBeTruthy();
  });
});

describe("TrainingScreen3D - User Interactions", () => {
  let mockOnPlayerUpdate: Mock;
  let mockOnReturnToMenu: Mock;

  beforeEach(() => {
    mockOnPlayerUpdate = vi.fn();
    mockOnReturnToMenu = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render return-to-menu button", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    expect(getByTestId("return-to-menu-button")).toBeInTheDocument();
  });

  it("should call onReturnToMenu when button clicked", () => {
    const { getByTestId } = render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );
    const button = getByTestId("return-to-menu-button");
    button.click();
    expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
    expect(mockOnReturnToMenu).toHaveBeenCalledWith();
  });

  it("should not call callbacks before user interaction", () => {
    render(
      <TrainingScreen3D
        onPlayerUpdate={mockOnPlayerUpdate}
        onReturnToMenu={mockOnReturnToMenu}
        width={1200}
        height={800}
      />
    );

    expect(mockOnReturnToMenu).not.toHaveBeenCalled();
  });
});
