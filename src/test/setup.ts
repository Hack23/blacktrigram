// Test setup for Black Trigram Korean martial arts game

import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, beforeAll, expect, vi } from "vitest";

expect.extend(matchers);

beforeAll(() => {
  // Enhanced Audio mock with proper HTMLAudioElement that matches test expectations
  // Vitest 4.0 requires proper function/class constructors, not arrow functions
  class MockHTMLAudioElement {
    canPlayType: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    load: ReturnType<typeof vi.fn>;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    volume = 1;
    currentTime = 0;
    duration = 100;
    paused = false;
    ended = false;
    src = "";
    crossOrigin = null;
    preload = "auto";

    constructor(src?: string) {
      if (src) {
        this.src = src;
      }
      this.canPlayType = vi.fn((type: string) => {
        // Return "probably" for mp3 to match test expectations
        if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
        if (type === "audio/wav") return "maybe";
        if (type === "audio/ogg") return "maybe";
        return ""; // Empty string means not supported (webm)
      });
      this.play = vi.fn(() => Promise.resolve());
      this.pause = vi.fn();
      this.load = vi.fn();
      this.addEventListener = vi.fn();
      this.removeEventListener = vi.fn();
    }
  }

  global.HTMLAudioElement = MockHTMLAudioElement as any;
  global.Audio = MockHTMLAudioElement as any;

  // Mock PixiJS Application constructor issues
  class MockHTMLCanvasElement {
    width = 800;
    height = 600;
    style: Record<string, any> = {};
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    getContext: ReturnType<typeof vi.fn>;

    constructor() {
      this.addEventListener = vi.fn();
      this.removeEventListener = vi.fn();
      this.getContext = vi.fn(() => ({
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        canvas: { width: 800, height: 600 },
      }));
    }
  }

  global.HTMLCanvasElement = MockHTMLCanvasElement as any;

  // Mock Canvas API
  class MockCanvasRenderingContext2D {
    fillRect = vi.fn();
    clearRect = vi.fn();
    beginPath = vi.fn();
    arc = vi.fn();
    fill = vi.fn();
    stroke = vi.fn();
  }

  global.CanvasRenderingContext2D = MockCanvasRenderingContext2D as any;

  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((cb) => window.setTimeout(cb, 16));
  global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  global.ResizeObserver = MockResizeObserver as any;

  // Console warning suppression for cleaner test output
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Suppress specific warnings that are expected in test environment
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("PixiJS") ||
        message.includes("WebGL") ||
        message.includes("AudioContext"))
    ) {
      return;
    }
    originalWarn(...args);
  };
});

// Cleanup after each test case
afterEach(() => {
  // Clean up any test-specific mocks
  vi.clearAllMocks();
});
