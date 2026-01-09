import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AudioProvider } from "../../../audio/AudioProvider";
import { PlayerArchetype } from "../../../types/common";
import { IntroScreenThreeJS } from "./IntroScreenThreeJS";

// Mock AudioProvider
vi.mock("../../../audio/AudioProvider", () => ({
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
  useAudio: () => ({
    isInitialized: true,
    isAudioReady: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
  }),
}));

// Mock Three.js Canvas
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("IntroScreenThreeJS", () => {
  it("should render without crashing", () => {
    const mockOnMenuSelect = vi.fn();
    const mockOnArchetypeSelect = vi.fn();

    const { container } = render(
      <AudioProvider>
        <IntroScreenThreeJS
          onMenuSelect={mockOnMenuSelect}
          onArchetypeSelect={mockOnArchetypeSelect}
          selectedArchetype={PlayerArchetype.MUSA}
          width={1920}
          height={1080}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });

  it("should render main UI sections", () => {
    const mockOnMenuSelect = vi.fn();
    const mockOnArchetypeSelect = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <IntroScreenThreeJS
          onMenuSelect={mockOnMenuSelect}
          onArchetypeSelect={mockOnArchetypeSelect}
          selectedArchetype={PlayerArchetype.MUSA}
        />
      </AudioProvider>
    );

    expect(getByTestId("intro-screen")).toBeInTheDocument();
    expect(getByTestId("three-canvas")).toBeInTheDocument();
    expect(getByTestId("html-overlay")).toBeInTheDocument();
  });

  it("should render with default archetype", () => {
    const mockOnMenuSelect = vi.fn();

    const { container } = render(
      <AudioProvider>
        <IntroScreenThreeJS
          onMenuSelect={mockOnMenuSelect}
          selectedArchetype={PlayerArchetype.MUSA}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });

  it("should handle menu selection callback", () => {
    const mockOnMenuSelect = vi.fn();

    render(
      <AudioProvider>
        <IntroScreenThreeJS
          onMenuSelect={mockOnMenuSelect}
          selectedArchetype={PlayerArchetype.HACKER}
        />
      </AudioProvider>
    );

    // Component should render successfully
    expect(mockOnMenuSelect).not.toHaveBeenCalled();
  });

  it("should work with mobile dimensions", () => {
    const mockOnMenuSelect = vi.fn();

    const { container } = render(
      <AudioProvider>
        <IntroScreenThreeJS
          onMenuSelect={mockOnMenuSelect}
          selectedArchetype={PlayerArchetype.AMSALJA}
          width={375}
          height={667}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });
});
