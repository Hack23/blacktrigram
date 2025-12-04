import { defineConfig } from "cypress";
import * as fs from "fs";
import * as path from "path";
import { resolve } from "path";

// Use __dirname in a more TypeScript-friendly way
const __dirname = resolve(process.cwd());

// Centralize report directories
const REPORTS_BASE_DIR = "build/cypress";
const REPORTS = {
  junit: `${REPORTS_BASE_DIR}/junit`,
  mochawesome: `${REPORTS_BASE_DIR}/mochawesome`,
  videos: `${REPORTS_BASE_DIR}/videos`,
  screenshots: `${REPORTS_BASE_DIR}/screenshots`,
  artifacts: `${REPORTS_BASE_DIR}/artifacts`,
};

export default defineConfig({
  screenshotsFolder: REPORTS.screenshots,
  videosFolder: REPORTS.videos,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 3, // Reduced from 5 for better memory management
  video: true, // Video recording enabled; videos are only saved for failed tests
  videoUploadOnPasses: false, // Only upload videos for failed tests
  videoCompression: 50, // Optimized for faster encoding (larger files, but faster CI) - increased from 25
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  viewportWidth: 1280,
  viewportHeight: 800,
  retries: {
    runMode: 1, // Reduced from 2 for better flaky test detection
    openMode: 0, // Reduced from 1 to encourage fixing tests immediately
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "spec, cypress-junit-reporter, mochawesome",
    mochaJunitReporterReporterOptions: {
      mochaFile: "build/cypress/junit/results-[hash].xml",
      toConsole: false,
      attachments: true,
      testCaseSwitchClassnameAndName: false,
      includePending: true,
    },
    mochawesomeReporterOptions: {
      reportDir: REPORTS.mochawesome,
      overwrite: false,
      html: true,
      json: true,
      code: true,
      timestamp: "mmddyyyy_HHMMss",
      charts: true,
      showHooks: "failed",
      embeddedScreenshots: true,
    },
  },
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    testIsolation: true,
    // Optimized timeout settings for faster test execution
    defaultCommandTimeout: 5000, // Reduced from 6000 for faster failures
    requestTimeout: 6000, // Reduced from 8000
    responseTimeout: 6000, // Reduced from 8000
    pageLoadTimeout: 12000, // Reduced from 15000
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    // Environment variables for Black Trigram testing
    env: {
      GAME_SPEED: 1.0,
      DISABLE_AUDIO: true,
      MOCK_WEBGL: true,
    },
    setupNodeEvents(on, config) {
      on("before:run", () => {
        // Clean up all report directories
        Object.values(REPORTS).forEach((dir) => {
          if (fs.existsSync(dir)) {
            console.log(`Cleaning up ${dir}`);
            const files = fs.readdirSync(dir);
            files.forEach((file) => {
              const filePath = path.join(dir, file);
              if (!fs.lstatSync(filePath).isDirectory()) {
                fs.unlinkSync(filePath);
              }
            });
          } else {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory ${dir}`);
          }
        });
      });

      // Browser launch configuration for Three.js/WebGL optimization
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          // Core WebGL rendering flags (software rendering via SwiftShader)
          launchOptions.args.push("--enable-unsafe-swiftshader");
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--disable-features=VizDisplayCompositor");
          launchOptions.args.push("--disable-gpu-sandbox");
          launchOptions.args.push("--disable-dev-shm-usage");
          launchOptions.args.push("--no-sandbox");

          // Three.js-specific optimizations
          launchOptions.args.push("--enable-webgl-draft-extensions"); // Enable draft WebGL features
          launchOptions.args.push("--max-gum-fps=60"); // Cap frame rate at 60fps for consistency
          launchOptions.args.push("--disable-gpu-vsync"); // Disable vsync for more predictable frame timing
          launchOptions.args.push("--enable-webgl2-compute-context"); // Enable WebGL2 compute features

          // Memory optimization for Three.js scenes
          launchOptions.args.push("--js-flags=--max-old-space-size=4096"); // 4GB heap for Node.js
          launchOptions.args.push("--disable-software-rasterizer"); // Use hardware-accelerated rasterization when possible

          // Reduce logging noise
          launchOptions.args.push("--log-level=3");
          launchOptions.args.push("--disable-logging");
          launchOptions.args.push("--silent");

          // Audio/video performance
          launchOptions.args.push("--autoplay-policy=no-user-gesture-required");
        }
        return launchOptions;
      });

      // Enhanced task definitions
      on("task", {
        // Basic directory tasks
        ensureDir: (dir: string) => {
          try {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            return true;
          } catch (error) {
            console.error(`Failed to create directory: ${dir}`, error);
            return false;
          }
        },

        // Enhanced logging for Black Trigram testing
        log(message) {
          console.log(message);
          return null;
        },

        // Performance monitoring for PixiJS operations
        logPerformance(metrics: { name: string; duration: number }) {
          console.log(
            `⚡ Performance: ${metrics.name} took ${metrics.duration}ms`
          );
          return null;
        },

        readFile({ path }) {
          try {
            const content = fs.readFileSync(path, "utf8");
            return { content };
          } catch (err) {
            return { error: `Error reading file: ${err}` };
          }
        },

        listJunitFiles() {
          try {
            if (!fs.existsSync(REPORTS.junit)) {
              return [];
            }
            return fs
              .readdirSync(REPORTS.junit)
              .filter((file) => file.endsWith(".xml"));
          } catch (_err) {
            return [];
          }
        },

        resetJunitResults() {
          try {
            if (!fs.existsSync(REPORTS.junit)) {
              fs.mkdirSync(REPORTS.junit, { recursive: true });
              return null;
            }
            return null;
          } catch (err) {
            console.error(
              "Error resetting JUnit results:",
              err instanceof Error ? err.message : String(err)
            );
            return null;
          }
        },

        writeFile({ path, content }) {
          try {
            fs.writeFileSync(path, content);
            return `File written successfully: ${path}`;
          } catch (err) {
            return `Error writing file: ${
              err instanceof Error ? err.message : String(err)
            }`;
          }
        },

        logTestMetrics({ test, status, duration }) {
          console.log(
            `Test: ${test}, Status: ${status}, Duration: ${duration}ms`
          );
          return null;
        },

        checkFilesExist({
          basePath,
          fileList,
        }: {
          basePath: string;
          fileList: string[];
        }) {
          const existingFiles = fileList.filter((file: string) =>
            fs.existsSync(path.join(basePath, file))
          );
          return existingFiles;
        },

        findUnconvertedTests({
          testDir,
          templatePattern,
        }: {
          testDir: string;
          templatePattern: string;
        }) {
          const files = fs.readdirSync(testDir);

          const unconverted = files.filter((file) => {
            if (!file.endsWith(".cy.ts")) return false;
            const content = fs.readFileSync(path.join(testDir, file), "utf8");
            return !content.includes(templatePattern);
          });

          return unconverted;
        },
      });

      return config;
    },
    retries: {
      runMode: 1, // Reduced from 2 for better flaky test detection
      openMode: 0, // Reduced from 1 to encourage fixing tests immediately
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        configFile: resolve(__dirname, "./vite.config.ts"),
        // Added optimizations for PixiJS components
        optimizeDeps: {
          include: ["@pixi/react", "pixi.js"],
        },
      },
    },
    viewportWidth: 1280,
    viewportHeight: 720, // Optimized for component testing
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    experimentalMemoryManagement: true,
  },
  waitForAnimations: false, // Disable animation waits for faster tests
  animationDistanceThreshold: 5, // Minimal animation threshold
});
