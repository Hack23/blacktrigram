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

  // Mock WebGL context for Three.js
  class MockWebGLRenderingContext {
    getExtension = vi.fn();
    getParameter = vi.fn();
    createShader = vi.fn();
    createProgram = vi.fn();
    attachShader = vi.fn();
    linkProgram = vi.fn();
    getProgramParameter = vi.fn(() => true);
    useProgram = vi.fn();
    createBuffer = vi.fn();
    bindBuffer = vi.fn();
    bufferData = vi.fn();
    enableVertexAttribArray = vi.fn();
    vertexAttribPointer = vi.fn();
    drawArrays = vi.fn();
    clear = vi.fn();
    clearColor = vi.fn();
    enable = vi.fn();
    disable = vi.fn();
    depthFunc = vi.fn();
    viewport = vi.fn();
    getAttribLocation = vi.fn(() => 0);
    getUniformLocation = vi.fn(() => ({}));
    uniformMatrix4fv = vi.fn();
    uniform1i = vi.fn();
    createTexture = vi.fn();
    bindTexture = vi.fn();
    texImage2D = vi.fn();
    texParameteri = vi.fn();
    ARRAY_BUFFER = 0x8892;
    STATIC_DRAW = 0x88e4;
    FLOAT = 0x1406;
    TRIANGLES = 0x0004;
    COLOR_BUFFER_BIT = 0x00004000;
    DEPTH_BUFFER_BIT = 0x00000100;
    DEPTH_TEST = 0x0b71;
    LEQUAL = 0x0203;
    TEXTURE_2D = 0x0de1;
    RGBA = 0x1908;
    UNSIGNED_BYTE = 0x1401;
    TEXTURE_WRAP_S = 0x2802;
    TEXTURE_WRAP_T = 0x2803;
    TEXTURE_MIN_FILTER = 0x2801;
    TEXTURE_MAG_FILTER = 0x2800;
    CLAMP_TO_EDGE = 0x812f;
    LINEAR = 0x2601;
  }

  global.WebGLRenderingContext = MockWebGLRenderingContext as any;

  // Update HTMLCanvasElement getContext to support WebGL
  class EnhancedMockHTMLCanvasElement extends MockHTMLCanvasElement {
    getContext: ReturnType<typeof vi.fn>;

    constructor() {
      super();
      this.getContext = vi.fn((contextType: string) => {
        if (contextType === "webgl" || contextType === "webgl2") {
          return new MockWebGLRenderingContext();
        }
        return {
          fillRect: vi.fn(),
          clearRect: vi.fn(),
          canvas: { width: 800, height: 600 },
        };
      });
    }
  }

  global.HTMLCanvasElement = EnhancedMockHTMLCanvasElement as any;

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

  // Mock ResizeObserver (needs to be on window for react-use-measure)
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    constructor(_callback: ResizeObserverCallback) {
      // Store callback for potential testing (prefixed with _ to indicate unused)
    }
  }

  global.ResizeObserver = MockResizeObserver as any;
  (window as any).ResizeObserver = MockResizeObserver;

  // Console warning suppression for cleaner test output
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Suppress specific warnings that are expected in test environment
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("WebGL") ||
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
