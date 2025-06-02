import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React, { type ReactElement } from "react";

// Add missing jest-dom matchers for vitest
import "@testing-library/jest-dom/vitest";

// Mock extend spy for tracking calls - single declaration
export const extendSpy = vi.fn();

// Mock PixiJS components for testing
vi.mock("@pixi/react", async () => {
  return {
    extend: extendSpy,
    Stage: ({ children, ...props }: any): ReactElement => {
      return React.createElement(
        "div",
        {
          "data-testid": "pixi-stage",
          ...props,
        },
        children
      );
    },
    Container: ({ children, ...props }: any): ReactElement => {
      // Fix: Handle onPointerDown properly in tests
      const { onPointerDown, ...otherProps } = props;

      const handleClick = () => {
        if (onPointerDown) {
          // Mock FederatedPointerEvent for tests
          const mockEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            target: null,
          };
          onPointerDown(mockEvent);
        }
      };

      return React.createElement(
        "div",
        {
          "data-testid": "pixi-container",
          onClick: onPointerDown ? handleClick : undefined,
          ...otherProps,
        },
        children
      );
    },
    Graphics: ({ draw, ...props }: any): ReactElement => {
      // Mock graphics drawing with comprehensive mock object
      if (draw) {
        const mockGraphics = {
          clear: vi.fn(),
          setFillStyle: vi.fn(),
          setStrokeStyle: vi.fn(),
          rect: vi.fn(),
          circle: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          roundRect: vi.fn(),
          fill: vi.fn(),
          stroke: vi.fn(),
          closePath: vi.fn(),
          lineStyle: vi.fn(),
          // Add missing PixiJS Graphics methods for Korean martial arts rendering
          beginFill: vi.fn(),
          endFill: vi.fn(),
          drawRect: vi.fn(),
          drawCircle: vi.fn(),
          drawRoundedRect: vi.fn(),
          drawPolygon: vi.fn(),
          drawEllipse: vi.fn(),
          arcTo: vi.fn(),
          arc: vi.fn(),
          bezierCurveTo: vi.fn(),
          quadraticCurveTo: vi.fn(),
          // Korean martial arts specific drawing methods
          drawStar: vi.fn(),
          drawTriangle: vi.fn(),
          // Add methods commonly used in Korean trigram drawing
          lineWidth: 1,
          alpha: 1,
          visible: true,
          x: 0,
          y: 0,
          scale: { x: 1, y: 1 },
          rotation: 0,
          // Fix: Add proper PixiJS Graphics properties to avoid style conflicts
          width: 0,
          height: 0,
          tint: 0xffffff,
          blendMode: "normal",
        };
        try {
          draw(mockGraphics);
        } catch (error) {
          console.warn("Graphics draw function error:", error);
        }
      }

      return React.createElement("div", {
        "data-testid": "pixi-graphics",
        ...props,
      });
    },
    Text: ({ text, style, ...props }: any): ReactElement => {
      return React.createElement(
        "div",
        {
          "data-testid": "pixi-text",
          "data-text": text,
          ...props,
        },
        text
      );
    },
    Sprite: ({ ...props }: any): ReactElement => {
      return React.createElement("div", {
        "data-testid": "pixi-sprite",
        ...props,
      });
    },
    useTick: vi.fn(),
    useApp: vi.fn(() => ({
      stage: { addChild: vi.fn(), removeChild: vi.fn() },
      renderer: { render: vi.fn() },
    })),
    PixiComponent: vi.fn(),
  };
});

// Mock audio for tests
vi.mock("../audio/AudioManager", () => ({
  useAudio: vi.fn(() => ({
    playMusic: vi.fn(),
    playSFX: vi.fn(),
    playAttackSound: vi.fn(),
    playHitSound: vi.fn(),
    setMasterVolume: vi.fn(),
    getMasterVolume: vi.fn(() => 0.7),
    isEnabled: vi.fn(() => true),
  })),
  audioManager: {
    playMusic: vi.fn(),
    playSFX: vi.fn(),
    playAttackSound: vi.fn(),
    playHitSound: vi.fn(),
  },
}));

// Enhanced global test setup
beforeAll(() => {
  // Mock window dimensions for consistent testing
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1920,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: 1080,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  // Global test cleanup
});

// Export commonly used test utilities
export const mockWindowResize = (width: number, height: number): void => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
};

export const mockKeyboardEvent = (
  key: string,
  type: "keydown" | "keyup" = "keydown"
): void => {
  const event = new KeyboardEvent(type, {
    key,
    code: `Key${key.toUpperCase()}`,
    bubbles: true,
  });
  document.dispatchEvent(event);
};
