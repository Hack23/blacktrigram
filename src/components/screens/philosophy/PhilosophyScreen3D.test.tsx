import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhilosophyScreen3D } from "./PhilosophyScreen3D";

// Mock Three.js Canvas to avoid WebGL issues in test environment
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-html">{children}</div>
  ),
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

describe("PhilosophyScreen3D", () => {
  it("should render without crashing", () => {
    const onReturnToMenu = vi.fn();
    const { container } = render(
      <PhilosophyScreen3D onReturnToMenu={onReturnToMenu} />,
    );

    expect(container).toBeTruthy();
  });

  it("should have philosophy-screen test id", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <PhilosophyScreen3D onReturnToMenu={onReturnToMenu} />,
    );

    expect(getByTestId("philosophy-screen")).toBeTruthy();
  });

  it("should render Three.js Canvas", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <PhilosophyScreen3D onReturnToMenu={onReturnToMenu} />,
    );

    expect(getByTestId("three-canvas")).toBeTruthy();
  });

  it("should render HTML overlay", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <PhilosophyScreen3D onReturnToMenu={onReturnToMenu} />,
    );

    // UI overlay is now outside Canvas in absolute-positioned div
    expect(getByTestId("philosophy-hud-overlay")).toBeTruthy();
  });

  it("should accept width and height props", () => {
    const onReturnToMenu = vi.fn();
    const { container } = render(
      <PhilosophyScreen3D
        onReturnToMenu={onReturnToMenu}
        width={1920}
        height={1080}
      />,
    );

    const screen = container.querySelector('[data-testid="philosophy-screen"]');
    expect(screen).toBeTruthy();
  });
});
