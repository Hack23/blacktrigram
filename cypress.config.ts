import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    testIsolation: true,
    retries: {
      runMode: 2,
      openMode: 1,
    },
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 20000,
    chromeWebSecurity: false,
    video: true,
    videoCompression: 32,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    downloadsFolder: "cypress/downloads",
    fixturesFolder: "cypress/fixtures",
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 10,
    experimentalRunAllSpecs: true,
    screenshotOnRunFailure: true,
    env: {
      GAME_SPEED: 1.0,
      DISABLE_AUDIO: true,
      MOCK_WEBGL: true,
    },
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Cypress.PluginConfigOptions {
      // Register custom tasks for testing
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        logPerformance(metrics: { name: string; duration: number }) {
          console.log(
            `⚡ Performance: ${metrics.name} took ${metrics.duration}ms`
          );
          return null;
        },
      });

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--enable-unsafe-swiftshader");
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--disable-features=VizDisplayCompositor");
          launchOptions.args.push("--log-level=3");
          launchOptions.args.push("--disable-logging");
          launchOptions.args.push("--silent");
        }
        return launchOptions;
      });

      return config;
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        optimizeDeps: {
          include: ["@pixi/react", "pixi.js"],
        },
      },
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    experimentalMemoryManagement: true,
  },
});
