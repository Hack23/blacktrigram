import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(
      on: Cypress.PluginEvents,
      _config: Cypress.PluginConfigOptions // Fixed: Add underscore prefix
    ): Cypress.PluginConfigOptions {
      // Register custom tasks for testing
      on("task", {
        // Log messages to console
        log(message) {
          console.log(message);
          return null;
        },

        // Performance logging for PixiJS tests
        logPerformance(metrics: { name: string; duration: number }) {
          console.log(
            `⚡ Performance: ${metrics.name} took ${metrics.duration}ms`
          );
          return null;
        },

        // Silent task to suppress WebGL warnings
        silenceWebGLWarning() {
          return null;
        },
      });

      // Suppress WebGL warnings in browser console
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--enable-unsafe-swiftshader");
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--disable-features=VizDisplayCompositor");
          launchOptions.args.push("--log-level=3"); // Suppress WebGL warnings
        }
        return launchOptions;
      });

      return _config; // Fixed: Use underscore prefixed variable
    },
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
  },
});
