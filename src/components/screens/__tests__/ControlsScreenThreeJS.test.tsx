import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ControlsScreenThreeJS } from "../ControlsScreenThreeJS";

// Mock Three.js Canvas to avoid WebGL issues in test environment
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="three-html">{children}</div>,
}));

// Mock audio provider
vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    playSFX: vi.fn(),
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    fadeIn: vi.fn().mockResolvedValue(undefined),
    fadeOut: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
  }),
}));

describe("ControlsScreenThreeJS", () => {
  it("should render without crashing", () => {
    const onReturnToMenu = vi.fn();
    const { container } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(container).toBeTruthy();
  });

  it("should have controls-screen test id", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(getByTestId("controls-screen")).toBeTruthy();
  });

  it("should render Three.js Canvas", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(getByTestId("three-canvas")).toBeTruthy();
  });

  it("should render HTML overlay", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(getByTestId("three-html")).toBeTruthy();
  });

  it("should accept width and height props", () => {
    const onReturnToMenu = vi.fn();
    const { container } = render(
      <ControlsScreenThreeJS 
        onReturnToMenu={onReturnToMenu} 
        width={1920}
        height={1080}
      />
    );

    const screen = container.querySelector('[data-testid="controls-screen"]');
    expect(screen).toBeTruthy();
  });
});
