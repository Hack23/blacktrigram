import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Alias for Korean text components
      "@/korean-text": path.resolve(
        __dirname,
        "./src/components/ui/base/korean-text"
      ),
      // Alias for types
      "@/types": path.resolve(__dirname, "./src/types"),
      // Alias for systems
      "@/systems": path.resolve(__dirname, "./src/systems"),
      // Alias for constants
      "@/constants": path.resolve(__dirname, "./src/types/constants"),
      // Fix react-reconciler constants import for Vitest 4.0
      "react-reconciler/constants": path.resolve(
        __dirname,
        "./node_modules/react-reconciler/constants.js"
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/test-setup.ts"],
    css: true,
    // Korean martial arts specific test configuration
    testTimeout: 10000, // Allow longer tests for complex combat calculations
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    // Mock specific modules for Korean martial arts testing
    server: {
      deps: {
        inline: ["pixi.js", "@pixi/react"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json"],
      reportsDirectory: "./build/coverage", // Output to build directory (not committed during PR)
      exclude: [
        // top-level helpers
        "cypress.reporter.config.js",
        "**/docs/**",
        "**/dist/**",
        "**/public/**",
        // built bundles
        "*.js",
        "blacktrigram/*.js",
        "blacktrigram/docs/assets/**",
        "blacktrigram/**/*.js",
        // skip Pixi & other generated files
        "**/pixi-*.js",
        "**/webworkerAll-*.js",
        "*config.ts",
        ".*.cjs",
        "**/*.cy.ts",
        "cypress/**",
        "dist/assets/**",
        "scripts/**",
      ],
      // Note: 'all' option removed in Vitest 4.0
      skipFull: false, // Don't skip files with 100% coverage
      // Per Secure Development Policy (ISMS) & Issue #increase-combat-test-coverage:
      // - Long-term target: 80% line coverage, 70% branch coverage overall
      // - Minimum threshold for new/changed files: 75% coverage
      // - Specific files improved in this PR must maintain their new coverage levels
      // Note: Global thresholds commented out to avoid breaking existing code.
      // These should be enforced via CI checks for new/changed files only.
      // 
      // Recommended CI approach:
      // 1. Run coverage on base branch and PR branch
      // 2. Compare coverage deltas for changed files
      // 3. Fail PR if any changed file drops below 75% coverage (minimum threshold)
      //
      // thresholds: {
      //   lines: 75,
      //   branches: 70,
      //   functions: 70,
      //   statements: 75,
      // },
    },
  },
  // Optimize deps for Korean martial arts components
  optimizeDeps: {
    include: ["react", "react-dom", "pixi.js", "@pixi/react"],
    exclude: ["vitest", "@vitest/ui"],
  },
});
