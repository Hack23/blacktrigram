// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import support modules using require() instead of import for Cypress 15 webpack
// compatibility. ES module imports of side-effect-only modules (like Cypress command
// registrations) are tree-shaken by the webpack bundler, causing all custom commands
// to be undefined. Using require() ensures the modules execute and register commands.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./commands");
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./performance");
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./test-isolation");
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./resource-monitoring");
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./memory-monitor");

// Import cypress-wait-until for waitUntil command
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("cypress-wait-until");

// Task to silence WebGL warnings
Cypress.on("window:before:load", (win) => {
  // Silence console errors related to WebGL
  const originalConsoleError = win.console.error;
  win.console.error = (...args) => {
    // Don't log errors about WebGL context to keep test output clean
    if (
      args[0]?.includes &&
      (args[0].includes("WebGL") ||
        args[0].includes("browser does not support WebGL"))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});

// Global test isolation and cleanup hooks
beforeEach(() => {
  // Clear browser storage for test isolation
  cy.clearLocalStorage();
  cy.clearCookies();

  // Reset viewport to standard size
  cy.viewport(1280, 720);

  // Clear any test data from previous runs
  cy.window().then((win) => {
    // Reset any global game state
    const gameStateWin = win as Window & { __gameState?: unknown };
    if (gameStateWin.__gameState) {
      delete gameStateWin.__gameState;
    }

    // Clear any event listeners
    const eventListenersWin = win as Window & {
      __eventListeners?: Array<() => void>;
    };
    if (eventListenersWin.__eventListeners) {
      eventListenersWin.__eventListeners.forEach((cleanup) => cleanup());
      eventListenersWin.__eventListeners = [];
    }
  });

  // WebGL mocking is handled by visitWithWebGLMock's onBeforeLoad callback,
  // which applies the mock to the new window before the page renders.
  // Calling cy.mockWebGL() here would only patch the current (blank) window
  // which gets replaced by cy.visit().

  // Start resource monitoring for leak detection (best-effort; command may
  // not be registered if resource-monitoring.ts fails to load)
  try { cy.startResourceMonitoring(); } catch { /* command may not be registered */ }
});

afterEach(function () {
  // All cleanup here is best-effort — failures must not cascade into the
  // next test.  testIsolation: true already gives each test a clean page.
  // IMPORTANT: None of these operations use Cypress assertions (.should),
  // so they cannot trigger the Cypress.on("fail") handler.

  // Detect resource leaks (logs only, no assertions; best-effort)
  try { cy.detectResourceLeaks(); } catch { /* command may not be registered */ }

  // Log test result for monitoring
  const testResult = this.currentTest?.state ?? "unknown";
  const testName = this.currentTest?.title ?? "unknown";
  const testDuration = this.currentTest?.duration ?? 0;

  cy.task("logTestMetrics", {
    test: testName,
    status: testResult,
    duration: testDuration,
  });

  // Force cleanup of any remaining resources
  cy.window({ log: false }).then((win) => {
    try {
      // Stop any running audio
      const audioElements = document.getElementsByTagName("audio");
      Array.from(audioElements).forEach((audio) => {
        audio.pause();
        audio.remove();
      });

      // Clear PixiJS resources
      const pixiWin = win as Window & {
        PIXI?: unknown;
        __pixiApp?: {
          destroy: (
            removeView: boolean,
            options?: { children?: boolean; texture?: boolean }
          ) => void;
        };
      };

      if (pixiWin.PIXI && pixiWin.__pixiApp) {
        pixiWin.__pixiApp.destroy(true, { children: true, texture: true });
        delete pixiWin.__pixiApp;
      }
    } catch {
      // Ignore synchronous DOM/resource cleanup errors
    }
  });
});

// Improve visual test feedback
Cypress.on("test:before:run", () => {
  // Log to provide visual separation in test output
  console.log("\n----- Starting Black Trigram Test -----\n");
});

// Global error handling for Black Trigram
// Narrow patterns: only ignore specific, known WebGL/audio/Three.js errors.
// Broad patterns like "is not a function" or "Cannot read properties" are NOT
// included so genuine app regressions still fail the test run.
Cypress.on("uncaught:exception", (err, _runnable) => {
  const msg = err.message;
  // Audio loading/playback failures (non-critical in headless)
  if (
    msg.includes("Failed to load audio") ||
    msg.includes("no supported source was found") ||
    msg.includes("play() request was interrupted") ||
    msg.includes("The play() request was interrupted") ||
    msg.includes("NotAllowedError") ||
    msg.includes("NotSupportedError")
  ) {
    return false;
  }
  // WebGL context creation failures (headless Chrome without GPU)
  if (
    msg.includes("WebGL context") ||
    msg.includes("Failed to create WebGL context") ||
    msg.includes("CONTEXT_LOST_WEBGL")
  ) {
    return false;
  }
  // Three.js / R3F renderer initialisation errors tied to missing GL
  if (
    (msg.includes("THREE") || msg.includes("R3F")) &&
    (msg.includes("renderer") || msg.includes("WebGL") || msg.includes("getContext"))
  ) {
    return false;
  }
  // WebGL mock stub TypeErrors — Three.js calling GL methods not in the mock.
  // Matches "gl.someMethod is not a function" patterns specifically.
  if (
    err instanceof TypeError &&
    /\bgl\.\w+ is not a function\b/.test(msg)
  ) {
    return false;
  }
  // PixiJS errors (non-critical)
  if (msg.includes("PixiJS")) {
    return false;
  }
  // Network errors on media assets
  if (
    (msg.includes("NetworkError") || msg.includes("AbortError")) &&
    (msg.includes("audio") || msg.includes("load"))
  ) {
    return false;
  }
  return true;
});

// Performance logging for CI
afterEach(() => {
  cy.window({ log: false }).then((win) => {
    try {
      if (win.performance?.clearMarks) {
        win.performance.clearMarks();
      }
    } catch {
      // Ignore — performance cleanup is non-critical
    }
  });
});

// Import custom commands with type support
/// <reference types="cypress" />
/// <reference path="./commands.ts" />

// Global error handler.
// IMPORTANT: This handler MUST throw errors, not swallow them.
// Returning false from Cypress.on("fail") silently swallows ALL test failures,
// making every test appear to pass regardless of assertion results.
// This was the root cause of e2e tests completing too quickly — no test could
// ever fail because errors were being silently caught and discarded.
//
// The afterEach hooks above are designed to be resilient (no hard assertions,
// try/catch guards, conditional DOM checks) so they won't cause cascading
// failures when this handler properly propagates errors.
Cypress.on("fail", (err, runnable) => {
  console.error(`Cypress test failed [${runnable.title}]:`, err.message);
  throw err;
});
