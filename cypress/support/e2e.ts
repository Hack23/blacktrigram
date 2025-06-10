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

// Import commands.js using ES2015 syntax:
import "./commands";
import "./pixi-commands"; // Import PixiJS testing commands

// Import cypress-wait-until for waitUntil command
import "cypress-wait-until";

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

// Add WebGL mocking to all tests by default
beforeEach(() => {
  cy.mockWebGL();
});

// Improve visual test feedback
Cypress.on("test:before:run", () => {
  // Log to provide visual separation in test output
  console.log("\n----- Starting Black Trigram Test -----\n");
});

// Global error handling for Black Trigram
Cypress.on("uncaught:exception", (err, runnable) => {
  // Ignore common game-related errors that don't affect functionality
  if (
    err.message.includes("Failed to load") ||
    err.message.includes("no supported source") ||
    err.message.includes("play() request was interrupted") ||
    err.message.includes("WebGL") ||
    err.message.includes("Audio")
  ) {
    return false;
  }
  return true;
});

// Performance logging for CI
beforeEach(() => {
  cy.window().then((win) => {
    // Clear any previous performance marks
    if (win.performance?.clearMarks) {
      win.performance.clearMarks();
    }
  });
});

// Global test configuration for Korean martial arts game
Cypress.config("defaultCommandTimeout", 10000);
Cypress.config("requestTimeout", 15000);
Cypress.config("responseTimeout", 15000);
Cypress.config("pageLoadTimeout", 30000);

// Note: Tasks are configured in cypress.config.ts, not here
// The tasks "log" and "silenceWebGLWarning" should be defined there
