import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

// Mock PixiJS components for testing
const MockApplication: React.FC<any> = ({ children, ...props }) => (
  <div data-testid="pixi-application" {...props}>
    {children}
  </div>
);

const MockContainer: React.FC<any> = ({ children, ...props }) => (
  <div data-testid="pixi-container" {...props}>
    {children}
  </div>
);

const MockGraphics: React.FC<any> = (props) => (
  <div data-testid="pixi-graphics" {...props} />
);

const MockText: React.FC<any> = ({ text, children, ...props }) => (
  <div data-testid="pixi-text" {...props}>
    {text || children}
  </div>
);

const MockSprite: React.FC<any> = (props) => (
  <div data-testid="pixi-sprite" {...props} />
);

// Mock PIXI components object
const mockPixiComponents = {
  Application: MockApplication,
  Container: MockContainer,
  Graphics: MockGraphics,
  Text: MockText,
  Sprite: MockSprite,
};

// Mock the @pixi/react module
vi.mock("@pixi/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Application: ({ children }: any) => <>{children}</>,
    extend: vi.fn(),
    useApplication: () => ({ app: {} }),
    useTick: vi.fn(),
  };
});

// Stub out AudioProvider/useAudio so TrainingScreen sees a provider
vi.mock("../src/audio/AudioProvider", () => ({
  AudioProvider: ({ children }: any) => <>{children}</>,
  useAudio: () => ({
    playSoundEffect: vi.fn(),
    playMusic: vi.fn(),
    setVolume: vi.fn(),
    mute: vi.fn(),
    unmute: vi.fn(),
  }),
}));

// Custom render function for components that need PixiJS
export function renderWithPixi(
  ui: React.ReactElement,
  options: RenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AudioProvider>
      <MockApplication width={800} height={600} data-testid="mock-pixi-app">
        {children}
      </MockApplication>
    </AudioProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { render } from "@testing-library/react";
export { renderWithPixi };
