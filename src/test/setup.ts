// Test setup for Black Trigram Korean martial arts game

import { beforeAll, afterEach, vi } from "vitest";
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

beforeAll(() => {
  // Enhanced Audio mock with proper HTMLAudioElement that matches test expectations
  global.HTMLAudioElement = vi.fn().mockImplementation(() => ({
    canPlayType: vi.fn((type: string) => {
      // Return "probably" for mp3 to match test expectations
      if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
      if (type === "audio/wav") return "maybe";
      if (type === "audio/ogg") return "maybe";
      return ""; // Empty string means not supported (webm)
    }),
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    load: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    volume: 1,
    currentTime: 0,
    duration: 100,
    paused: false,
    ended: false,
    src: "",
    crossOrigin: null,
    preload: "auto",
  })) as any;

  // Mock PixiJS Application constructor issues
  global.HTMLCanvasElement = vi.fn().mockImplementation(() => ({
    getContext: vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      canvas: { width: 800, height: 600 },
    })),
    width: 800,
    height: 600,
    style: {},
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as any;

  // Mock Canvas API
  global.CanvasRenderingContext2D = vi.fn().mockImplementation(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
  }));

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
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

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
